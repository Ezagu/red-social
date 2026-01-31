// Importar modulos
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Importar modelos
const Publication = require("../models/publication.js");
const User = require("../models/user.js");
const Comment = require("../models/comment.js");
const Like = require("../models/like.js");

// Importar servicios
const followService = require("../services/followService.js");
const { getPublications } = require("../services/publicationService.js");
const uploadCloudinary = require("../services/cloudinary.js");

// Guardar publicacion
const save = async (req, res) => {
  // Recoger datos
  const { text } = req.body;
  const file = req.file;
  const user = req.user.id;

  const session = await mongoose.startSession();

  try {
    let publication = {};
    let imageUrl = null;

    if (file) {
      const result = await uploadCloudinary(file.buffer);
      imageUrl = result.secure_url;
    }

    await session.withTransaction(async () => {
      publication = new Publication({ text, user, file: imageUrl });
      await publication.save({ session });

      await User.findByIdAndUpdate(
        user,
        {
          $inc: { publicationsCount: 1 },
        },
        { session },
      );
    });

    // Crear y guardar el objeto del modelo
    await publication.populate("user", "-email -password -role -__v");

    // Devolver respuesta
    return res.status(201).json({
      status: "success",
      message: "Publicación subida",
      publication,
      imageUrl,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
    });
  }
};

// Sacar una publicacion
const detail = async (req, res) => {
  // Sacar id de publicacion de la url
  const publicationId = req.params.id;

  // Find con la condicion del id
  try {
    const publication = await Publication.findById(publicationId).populate(
      "user",
      "-password -role -email -__v",
    );

    if (!publication) {
      return res.status(500).json({
        status: "error",
        message: "No existe la publicación",
      });
    }

    const like = await Like.find({
      user: req.user._id,
      targetType: "Publication",
      targetId: publication._id,
    });

    return res.status(200).json({
      status: "success",
      publication: {
        ...publication.toObject(),
        liked: like.length === 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
    });
  }
};

// Eliminar publicaciones
const remove = async (req, res) => {
  // Sacar el id de la publicacion a eliminar
  const publicationId = req.params.id;
  const user = req.user._id;

  // Find y luego remove
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // Borrar publicación
      const publicationDeleted = await Publication.findOneAndDelete(
        {
          user,
          _id: publicationId,
        },
        { session },
      );

      if (!publicationDeleted) throw new Error("PUBLICATION_NOT_FOUND");

      // Descontar contador de publicaciones del usuario
      const userUpdated = await User.findByIdAndUpdate(
        user,
        {
          $inc: { publicationsCount: -1 },
        },
        { session },
      );

      // Eliminar imagen si contiene
      if (publicationDeleted.file) {
        fs.unlinkSync(
          path.join("uploads", "publications", publicationDeleted.file),
        );
      }

      // Eliminar comentarios
      await Comment.deleteMany(
        { publication: publicationDeleted._id },
        { session },
      );

      // Eliminar likes
      await Like.deleteMany(
        {
          targetType: "Publication",
          targetId: publicationDeleted._id,
        },
        { session },
      );

      // DEvolver respuesta
      return res.status(200).json({
        status: "success",
        message: "Publicación eliminada",
        publicationDeleted,
      });
    });
  } catch (error) {
    let message = "Error en el servidor";
    if (error.message === "PUBLICATION_NOT_FOUND")
      message = "No existe la publicación";
    return res.status(500).json({
      status: "error",
      message,
    });
  }
};

// Devolver archivos multimedia
const media = async (req, res) => {
  // Sacar el parametro de la url
  const file = req.params.file;

  // Montar el path real de la imagen
  const filePath = "./uploads/publications/" + file;

  // Comprobar que existe
  fs.stat(filePath, (error) => {
    if (error) {
      return res.status(404).json({
        status: "error",
        message: "No existe la imagen",
      });
    }

    // Devolver un file
    return res.sendFile(path.resolve(filePath));
  });
};

// Listar todas las publicaciones de todos los usuarios
const publications = async (req, res) => {
  // Sacar la página actual
  const page = req.query.page || 1;
  // Establecer número de elementos por página
  const limit = req.query.limit || 5;

  try {
    // Find a publicaciones in, ordenar, popular, paginar
    const publications = await getPublications(
      req.user._id,
      {
        user: {
          $ne: req.user._id,
        },
      },
      page,
      limit,
    );

    return res.status(200).json(publications);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error del servidor",
    });
  }
};

const followingPublications = async (req, res) => {
  const user = req.user.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  try {
    const following = await followService.followingIds(user);

    const publications = await getPublications(
      req.user._id,
      { user: following },
      page,
      limit,
    );

    return res.status(200).json(publications);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error del servidor",
    });
  }
};

const comments = async (req, res) => {
  const id = req.params.id;

  const limit = req.query.limit || 10;
  const page = req.query.page || 1;

  try {
    const commentsPaginate = await Comment.paginate(
      {
        publication: id,
        parentComment: null,
      },
      {
        limit,
        page,
        sort: { createdAt: -1 },
        populate: { path: "user", select: "-password -role -email -__v" },
      },
    );

    // Saber si el comentario fue likeado por el user identity
    const commentsIds = commentsPaginate.docs.map((comment) => comment._id);

    const likesInComments = await Like.find({
      user: req.user._id,
      targetType: "Comment",
      targetId: commentsIds,
    });

    const commentsLiked = likesInComments.map((like) =>
      like.targetId.toString(),
    );

    const comments = commentsPaginate.docs.map((com) => {
      const comment = com.toObject();
      return {
        ...comment,
        liked: commentsLiked.includes(comment._id.toString()),
      };
    });

    res.status(200).json({
      status: "success",
      message: "Lista de comentarios",
      page,
      limit,
      totalComments: commentsPaginate.totalDocs,
      totalPages: commentsPaginate.totalPages,
      hasNextPage: commentsPaginate.hasNextPage,
      items: comments,
    });
  } catch (error) {
    res.status(200).json({
      status: "error",
      message: "No se pudo obtener los comentarios",
    });
  }
};

// Exportar funciones
module.exports = {
  save,
  detail,
  remove,
  media,
  publications,
  followingPublications,
  comments,
};
