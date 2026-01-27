const Like = require("../models/like.js");
const Comment = require("../models/comment.js");
const Publication = require("../models/publication.js");
const Notification = require("../models/notification.js");
const User = require("../models/user.js");

const save = async (req, res) => {
  const targetId = req.params.id;
  const { targetType } = req.body;
  const user = req.user._id;

  try {
    const like = await Like.create({
      targetId,
      targetType,
      user,
    });

    // Aumentar contador de likes en comentario o publicación
    let target = {};
    if (targetType === "Comment") {
      target = await Comment.findByIdAndUpdate(targetId, {
        $inc: { likesCount: 1 },
      });
    } else if (targetType === "Publication") {
      target = await Publication.findByIdAndUpdate(targetId, {
        $inc: { likesCount: 1 },
      });
    }

    // Crear notificación en caso de que no sea el mismo usuario identificado el que haya dado like
    if (target.user.toString() !== user.toString()) {
      await Notification.create({
        user: target.user,
        fromUser: user,
        targetType: "Like",
        targetId: like._id,
      });

      await User.findByIdAndUpdate(target.user, {
        $inc: { unreadNotificationsCount: 1 },
      });
    }

    return res.status(201).send({
      status: "success",
      message: "Like enviado",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "error",
        message: "Ya se likeo la publicacion o comentario",
      });
    }

    return res.status(400).json({
      status: "error",
      message: "No se pudo guardar el like",
    });
  }
};

const remove = async (req, res) => {
  const user = req.user._id;
  const targetId = req.params.id;
  const { targetType } = req.body;

  try {
    const likeRemoved = await Like.findOneAndDelete({
      targetId,
      user,
      targetType,
    });

    if (!likeRemoved) {
      return res.status(404).json({
        status: "error",
        message: "Like no encontrado",
      });
    }

    if (likeRemoved.targetType === "Comment") {
      await Comment.findByIdAndUpdate(likeRemoved.targetId, {
        $inc: { likesCount: -1 },
      });
    } else if (likeRemoved.targetType === "Publication") {
      await Publication.findByIdAndUpdate(likeRemoved.targetId, {
        $inc: { likesCount: -1 },
      });
    }

    // Eliminar notificación
    await Notification.findOneAndDelete({
      targetType: "Like",
      targetId: likeRemoved._id,
    });

    return res.status(200).send({
      status: "success",
      message: "Likeado con éxito",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudo deshacer el like",
    });
  }
};

module.exports = {
  save,
  remove,
};
