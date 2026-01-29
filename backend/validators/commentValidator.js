const { body, param } = require("express-validator");
const validateFields = require("./validateFields");
const Publication = require("../models/publication");
const { isObjectId } = require("./customs");
const Comment = require("../models/comment");
const publication = require("../models/publication");

const mustExistPublication = async (publicationId) => {
  const publication = await Publication.findById(publicationId);
  if (!publication) throw new Error("La publicación no existe");
  return true;
};

const mustExistComment = async (commentId, { req }) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("El comentario no existe");
  return true;
};

const mustExistParentComment = async (parentCommentId, { req }) => {
  const comment = await Comment.findById(parentCommentId);
  if (!comment) {
    throw new Error("El comentario padre no existe");
  } else if (
    comment.publication.toString() !== req.body.publicationId.toString()
  ) {
    throw new Error("El comentario padre no pertenece a esta publicación");
  }
  return true;
};

const commentOfIdentity = async (commentId, { req }) => {
  const comment = await Comment.findById(commentId);
  if (comment.user._id.toString() !== req.user._id.toString())
    throw new Error("El comentario no pertenece al usuario");
  return true;
};

const publicationId = body("publicationId")
  .trim()
  .notEmpty()
  .withMessage("Ingrese el id de la publicación")
  .custom(isObjectId)
  .custom(mustExistPublication);

const text = body("text")
  .trim()
  .notEmpty()
  .withMessage("Ingrese el texto")
  .isLength({ max: 255 })
  .withMessage("Texto demasiado largo");

const parentComent = body("parentComment")
  .trim()
  .notEmpty()
  .withMessage("El parentComment no puede estar vacío")
  .custom(isObjectId)
  .custom(mustExistParentComment);

const commentIdBase = () =>
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Debes enviar el id del comentario")
    .custom(isObjectId)
    .custom(mustExistComment);

exports.create = [
  [publicationId, text, parentComent.optional()],
  validateFields,
];

exports.delete = [[commentIdBase().custom(commentOfIdentity)], validateFields];

exports.replies = [[commentIdBase()], validateFields];
