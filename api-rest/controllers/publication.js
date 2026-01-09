// Importar modulos
const fs = require("fs");
const path = require("path");

// Importar modelos
const Publication = require("../models/publication.js");

// Importar servicios
const followService = require("../services/followService.js");

// Acciones de prueba
const pruebaPublication = (req, res) => {
  res.status(200).send({
    message: "Mensaje enviado desde el controlador: controllers/publication.js",
  });
};

// Guardar publicacion
const save = async (req, res) => {
  // Recoger datos del body
  const params = req.body;

  // Si no me llegan dar respuesta negativa
  if (!params.text)
    return res.status(400).json({
      status: "error",
      message: "Debes enviar el texto de la publicación",
    });

  // Crear y rellenar el objeto del modelo
  const newPublication = new Publication(params);
  newPublication.user = req.user.id;

  // Guardar objeto en bbdd
  try {
    const publicationStored = await newPublication.save();

    // Devolver respuesta
    return res.status(200).json({
      status: "success",
      message: "Publicación guardada",
      publicationStored,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "No se ha guardado la publicación",
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

  // Find y luego remove
  try {
    const publicationDeleted = await Publication.findOneAndDelete({
      user: req.user.id,
      _id: publicationId,
    });

    if (!publicationDeleted) throw new Error();

    // DEvolver respuesta
    return res.status(200).json({
      status: "success",
      message: "Eliminar publicación",
      publicationDeleted,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se ha eliminado la publicación",
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
const feed = async (req, res) => {
  // Sacar la página actual
  const page = req.params.page || 1;

  // Establecer número de elementos por página
  const itemsPerPage = 5;

  try {
    // Sacar array de ids de usuarios que yo sigo como usuario identificado
    const myFollows = await followService.followUserIds(req.user.id);

    // Find a publicaciones in, ordenar, popular, paginar
    const publications = await Publication.paginate(
      { user: myFollows.following },
      {
        page,
        limit: itemsPerPage,
        sort: "-created_at",
        populate: { path: "user", select: "-password -__v -role -email" },
      }
    );

    if (!publications) throw new Error();

    return res.status(200).json({
      status: "success",
      message: "Feed de publicaciones",
      myFollows: myFollows.following,
      totalPublications: publications.totalDocs,
      page,
      totalPages: publications.totalPages,
      hasNextPage: publications.hasNextPage,
      publications: publications.docs,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "No se han listado las publicaciones del feed",
    });
  }
};

// Exportar funciones
module.exports = {
  pruebaPublication,
  save,
  detail,
  remove,
  user,
  upload,
  media,
  feed,
};
