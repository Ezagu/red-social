const mongoose = require("mongoose");

// Importar modelo
const Follow = require("../models/follow.js");
const User = require("../models/user.js");
const Notification = require("../models/notification.js");

// Acción de guardar un follow (acción seguir)
const save = async (req, res) => {
  const followed = req.params.id;
  const user = req.user.id;

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const follow = new Follow({
        user,
        followed,
      });
      await follow.save({ session });

      // Aumentar contadores de seguidos y seguidores respectivamente
      await User.findByIdAndUpdate(
        user,
        { $inc: { followingCount: 1 } },
        { session },
      );
      await User.findByIdAndUpdate(
        followed,
        { $inc: { followersCount: 1 } },
        { session },
      );

      const notification = new Notification({
        user: followed,
        fromUser: user,
        targetType: "Follow",
        targetId: follow._id,
      });
      await notification.save({ session });

      await User.findByIdAndUpdate(
        followed,
        {
          $inc: { unreadNotificationsCount: 1 },
        },
        { session },
      );

      return res.status(201).json({
        status: "success",
        message: "Seguido con éxito",
        follow,
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
    });
  }
};

// Acción de borrar un follow (accion dejar de seguir)
const unfollow = async (req, res) => {
  const user = req.user.id;
  const followed = req.params.id;

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const followDeleted = await Follow.findOneAndDelete(
        {
          user,
          followed,
        },
        { session },
      );

      // Decrementar contadores de seguidos y seguidores
      await User.findByIdAndUpdate(
        user,
        { $inc: { followingCount: -1 } },
        { session },
      );
      await User.findByIdAndUpdate(
        followed,
        { $inc: { followersCount: -1 } },
        { session },
      );

      // Eliminar notificación
      const notification = await Notification.findOneAndDelete(
        {
          targetType: "Follow",
          targetId: followDeleted._id,
        },
        { session },
      );

      if (!notification.read) {
        await User.findByIdAndUpdate(
          followed,
          {
            $inc: { unreadNotificationsCount: -1 },
          },
          { session },
        );
      }

      return res.status(200).json({
        status: "success",
        message: "Se ha dejado de seguir al usuario",
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
    });
  }
};

// Exportar funciones
module.exports = {
  save,
  unfollow,
};
