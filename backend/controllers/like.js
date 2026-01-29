const Like = require("../models/like.js");
const Comment = require("../models/comment.js");
const Publication = require("../models/publication.js");
const Notification = require("../models/notification.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");

const save = async (req, res) => {
  const targetId = req.params.id;
  const { targetType } = req.body;
  const user = req.user._id;

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const like = new Like({
        targetId,
        targetType,
        user,
      });
      await like.save({ session });

      // Aumentar contador de likes en comentario o publicación
      let target = {};
      if (targetType === "Comment") {
        target = await Comment.findByIdAndUpdate(
          targetId,
          {
            $inc: { likesCount: 1 },
          },
          { session },
        );
      } else if (targetType === "Publication") {
        target = await Publication.findByIdAndUpdate(
          targetId,
          {
            $inc: { likesCount: 1 },
          },
          { session },
        );
      }

      // Crear notificación en caso de que no sea el mismo usuario identificado el que haya dado like
      if (target.user.toString() !== user.toString()) {
        const notification = new Notification({
          user: target.user,
          fromUser: user,
          targetType: "Like",
          targetId: like._id,
        });
        notification.save({ session });

        await User.findByIdAndUpdate(
          target.user,
          {
            $inc: { unreadNotificationsCount: 1 },
          },
          { session },
        );
      }

      return res.status(201).send({
        status: "success",
        message: "Like enviado",
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
    });
  }
};

const remove = async (req, res) => {
  const user = req.user._id;
  const targetId = req.params.id;
  const { targetType } = req.body;

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const likeRemoved = await Like.findOneAndDelete(
        {
          targetId,
          user,
          targetType,
        },
        { session },
      );

      if (likeRemoved.targetType === "Comment") {
        await Comment.findByIdAndUpdate(
          likeRemoved.targetId,
          {
            $inc: { likesCount: -1 },
          },
          { session },
        );
      } else if (likeRemoved.targetType === "Publication") {
        await Publication.findByIdAndUpdate(
          likeRemoved.targetId,
          {
            $inc: { likesCount: -1 },
          },
          { session },
        );
      }

      // Eliminar notificación
      const notification = await Notification.findOneAndDelete(
        {
          targetType: "Like",
          targetId: likeRemoved._id,
        },
        { session },
      );

      if (notification && !notification.read) {
        await User.findByIdAndUpdate(notification.user, {
          $inc: { unreadNotificationsCount: -1 },
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Like removido",
      });
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
