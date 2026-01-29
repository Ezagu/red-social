const { param, body } = require("express-validator");
const { isObjectId } = require("./customs");
const Comment = require("../models/comment.js");
const Publication = require("../models/publication.js");
const Like = require("../models/like.js");
const validateFields = require("./validateFields");

const allowedValues = ["Comment", "Publication"];

const existTarget = async (targetId, { req }) => {
  const targetType = req.body.targetType;
  if (targetType === "Comment") {
    const comment = await Comment.findById(targetId);
    if (!comment) throw new Error("No existe el comentario");
  } else if (targetType === "Publication") {
    const publication = await Publication.findById(targetId);
    if (!publication) throw new Error("No existe la publicación");
  }
  return true;
};

const mustExistLike = async (targetId, { req }) => {
  const targetType = req.body.targetType;
  const like = await Like.findOne({ targetId, targetType, user: req.user._id });
  if (!like)
    throw new Error(
      `No le has dado like a ${targetType === "Comment" ? "este comentario" : "esta publicación"}`,
    );
  return true;
};

const mustNotExistLike = async (targetId, { req }) => {
  const targetType = req.body.targetType;
  const like = await Like.findOne({ targetId, targetType, user: req.user._id });
  console.log(like);
  if (like)
    throw new Error(
      `Ya le has dado like a ${targetType === "Comment" ? "este comentario" : "esta publicación"}`,
    );
  return true;
};

const targetType = body("targetType")
  .trim()
  .notEmpty()
  .withMessage("Debes enviar el targetType")
  .isIn(allowedValues)
  .withMessage("targetType inválido");

const targetIdBased = () =>
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Debes enviar el targetId")
    .custom(isObjectId)
    .custom(existTarget);

exports.like = [
  [targetType, targetIdBased().custom(mustNotExistLike)],
  validateFields,
];

exports.dislike = [
  [targetType, targetIdBased().custom(mustExistLike)],
  validateFields,
];
