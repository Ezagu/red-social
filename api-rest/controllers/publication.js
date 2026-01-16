// Importar modulos
const fs = require("fs");
const path = require("path");

// Importar modelos
const Publication = require("../models/publication.js");
const User = require('../models/user.js');

// Importar servicios
const followService = require("../services/followService.js");

// Guardar publicacion
const save = async (req, res) => {
  // Recoger datos
  const {text} = req.body;
  const user = req.user.id;

  try {
    // Crear y guardar el objeto del modelo
    const publication = await Publication.create({text, user});

    await publication.populate('user', '-email -password -role -__v');

    await User.findByIdAndUpdate(user, {$inc: {publicationsCount: 1}});

    // Devolver respuesta
    return res.status(200).json({
      status: "success",
      message: "Publicación subida con éxito",
      publication
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "No se pudo subir la publicación",
      error
    });
  }
};

// Sacar una publicacion
const detail = async (req, res) => {
  // Sacar id de publicacion de la url
  const publicationId = req.params.id;

  // Find con la condicion del id
  try {
    const publication = await Publication.findById(publicationId);

    return res.status(200).json({
      status: "success",
      message: "Mostrar publicación",
      publication,
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

    if (!publicationDeleted) throw new Error();

    await User.findByIdAndUpdate(user, {$inc: {publicationsCount: -1}});

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

// Listar publicaciones de un usuario
const user = async (req, res) => {
  // Sacar id de usuario
  const userId = req.params.id;

  // Controlar la pagina
  const page = req.params.page || 1;
  const itemsPerPage = 5;

  // Find, populate, ordenar y paginar
  try {
    const publications = await Publication.paginate(
      { user: userId },
      {
        page,
        limit: itemsPerPage,
        sort: "-created_at",
        populate: { path: "user", select: "-password -__v -role -email" },
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Listado de publicaciones de un usuario",
      page,
      hasNextPage: publications.hasNextPage,
      totalPublications: publications.totalDocs,
      totalPages: publications.totalPages,
      publications: publications.docs,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: "No hay publicaciones para mostrar",
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
      { new: true }
    );

    if (!publicationUpdated) throw new Error();

    return res.status(200).json({
      status: "success",
      publication: publicationUpdated,
      file: req.file,
    });
  } catch (error) {
    return res.status(400).json({
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
        message: "No existe la image",
      });
    }

    // Devolver un file
    return res.sendFile(path.resolve(filePath));
  });
};

// Listar todas las publicaciones (FEED)
const publications = async (req, res) => {
  // Sacar la página actual
  const page = req.query.page || 1;
  // Establecer número de elementos por página
  const limit = req.query.limit || 5;

  try {
    // Find a publicaciones in, ordenar, popular, paginar
    const publications = await Publication.paginate(
      {},
      {
        page,
        limit,
        sort: "-created_at",
        populate: { path: "user", select: "-password -__v -role -email" },
      }
    );

    if (!publications) throw new Error();

    return res.status(200).json({
      status: "success",
      message: "Feed de publicaciones",
      totalPublications: publications.totalDocs,
      page,
      limit,
      totalPages: publications.totalPages,
      hasNextPage: publications.hasNextPage,
      publications: publications.docs,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "No se han listado las publicaciones del feed",
      error
    });
  }
};

// Exportar funciones
module.exports = {
  save,
  detail,
  remove,
  user,
  upload,
  media,
  publications
};
