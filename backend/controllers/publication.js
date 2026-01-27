// Importar modulos
const fs = require("fs");
const path = require("path");

// Importar modelos
const Publication = require("../models/publication.js");
const User = require("../models/user.js");
const Comment = require("../models/comment.js");
const Like = require("../models/like.js");

// Importar servicios
const followService = require("../services/followService.js");
const { getPublications } = require("../services/publicationService.js");

// Guardar publicacion
const save = async (req, res) => {
  // Recoger datos
  const { text } = req.body;
  const user = req.user.id;

  try {
    // Crear y guardar el objeto del modelo
    const publication = await Publication.create({ text, user });

    await publication.populate("user", "-email -password -role -__v");

    await User.findByIdAndUpdate(user, { $inc: { publicationsCount: 1 } });

    // Devolver respuesta
    return res.status(201).json({
      status: "success",
      message: "Publicación subida",
      publication,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudo subir la publicación",
      error,
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
        message: "No se pudo conseguir la publicación",
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
    return res.status(404).json({
      status: "error",
      message: "No existe la publicación",
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
    const publicationDeleted = await Publication.findOneAndDelete({
      user,
      _id: publicationId,
    });

    if (!publicationDeleted) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada",
      });
    }

    await User.findByIdAndUpdate(user, { $inc: { publicationsCount: -1 } });

    // DEvolver respuesta
    return res.status(200).json({
      status: "success",
      message: "Publicación eliminada",
      publicationDeleted,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se eliminó la publicación",
    });
  }
};

// Subir ficheros
const upload = async (req, res) => {
  // Sacar el id de la publicacion
  const publicationId = req.params.id;

  // Recoger el fichero de imagen y comprobar que existe
  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "Peticion no incluye la imagen",
    });
  }

  // Conseguir nombre del archivo
  const image = req.file.originalname;

  // Sacar la extensión del archivo
  const imagesSplit = image.split(".");
  const extension = imagesSplit[1];

  // Comprobar extensión
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    // Borrar archivo subido
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);

    return res.status(400).json({
      status: "error",
      message: "Extensión del fichero invalida",
    });
  }

  // Si lo es, guardar imagen en base de datos
  try {
    const publicationUpdated = await Publication.findOneAndUpdate(
      { user: req.user.id, _id: publicationId },
      { file: req.file.filename },
      { new: true },
    );

    if (!publicationUpdated) throw new Error();

    return res.status(200).json({
      status: "success",
      publication: publicationUpdated,
      file: req.file,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en la subida del archivo",
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

    if (!publications) throw new Error();

    return res.status(200).json(publications);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudo listar las publicaciones del feed",
      error,
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

    if (!publications) throw new Error();

    return res.status(200).json(publications);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudo listar las publicaciones de tus seguidos",
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
  upload,
  media,
  publications,
  followingPublications,
  comments,
};
