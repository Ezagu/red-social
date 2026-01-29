const mongoose = require("mongoose");

const Comment = require("../models/comment.js");
const Publication = require("../models/publication.js");
const Notification = require("../models/notification.js");
const User = require("../models/user.js");
const Like = require("../models/like.js");

const create = async (req, res) => {
  const user = req.user._id;
  const { publicationId, text } = req.body;
  const parentComment = req.body.parentComment || null;

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // Crear comentario
      const comment = new Comment({
        user,
        publication: publicationId,
        text,
        parentComment,
      });
      await comment.save({ session });

      await comment.populate("user", "-email -password -role -__v");

      // Determinar a quien notificar
      let userToNotificate;

      // MODIFICAR CONTADORES
      if (parentComment) {
        // Si tiene un comentario padre, aumentarle el contador de respuestas
        const parentComent = await Comment.findByIdAndUpdate(
          parentComment,
          {
            $inc: { repliesCount: 1 },
          },
          { session },
        );
        userToNotificate = parentComent.user._id;
      } else {
        // Sino aumentar contador de comentarios de publicacion
        const publication = await Publication.findByIdAndUpdate(
          publicationId,
          {
            $inc: { commentsCount: 1 },
          },
          { session },
        );
        userToNotificate = publication.user;
      }

      //NOTIFICACIÓN
      // Generar notificacion si no es el mismo usuario el que se comenta
      if (userToNotificate.toString() !== user.toString()) {
        const notification = new Notification({
          user: userToNotificate,
          fromUser: user,
          targetType: "Comment",
          targetId: comment._id,
        });
        notification.save({ session });

        await User.findByIdAndUpdate(
          userToNotificate,
          {
            $inc: { unreadNotificationsCount: 1 },
          },
          { session },
        );
      }

      return res.status(201).json({
        status: "success",
        message: "Comentario publicado",
        comment: comment,
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudo publicar el comentario",
      error,
    });
  }
};

const remove = async (req, res) => {
  const comment = req.params.id;

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // Elimina comentario
      commentRemoved = await Comment.findByIdAndDelete(comment, { session });

      // CONTADORES
      if (commentRemoved.parentComment) {
        // Si tiene comentario padre, le actualiza el contador de respuestas
        await Comment.findByIdAndUpdate(
          commentRemoved.parentComment,
          {
            $inc: { repliesCount: -1 },
          },
          { session },
        );
      } else {
        // Actualiza contador de comentartios de la publicacion
        await Publication.findByIdAndUpdate(
          commentRemoved.publication,
          {
            $inc: { commentsCount: -1 },
          },
          { session },
        );
      }

      // Eliminar respuestas
      await Comment.deleteMany(
        { parentComment: commentRemoved._id },
        { session },
      );

      // Eliminar likes
      await Like.deleteMany(
        { targetType: "Comment", targetId: comment },
        { session },
      );

      return res.status(200).json({
        status: "success",
        message: "Comentario borrado con éxito",
        comment: commentRemoved,
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
    });
  }
};

const replies = async (req, res) => {
  const parentComment = req.params.id;

  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  try {
    const replies = await Comment.paginate(
      { parentComment },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: { path: "user", select: "-password -role -email -__v" },
      },
    );

    return res.status(200).json({
      status: "success",
      page,
      limit,
      hasNextPage: replies.hasNextPage,
      items: replies.docs,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error obteniendo las respuestas del comentario",
    });
  }
};

module.exports = {
  create,
  remove,
  replies,
};
