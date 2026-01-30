const mongoose = require("mongoose");

const Notification = require("../models/notification.js");
const User = require("../models/user.js");

const read = async (req, res) => {
  const user = req.user._id;
  const notificationId = req.params.id;

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { session },
      );

      if (!notification.read) {
        await User.findByIdAndUpdate(
          user,
          {
            $inc: { unreadNotificationsCount: -1 },
          },
          { session },
        );
      }

      res.status(200).json({
        status: "success",
        message: "Notificación leída",
      });
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error en el servidor",
    });
  }
};

const remove = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const notificationRemoved = await Notification.findByIdAndDelete(
        notificationId,
        { session },
      );

      if (!notificationRemoved.read) {
        await User.findByIdAndUpdate(
          req.user._id,
          {
            $inc: { unreadNotificationsCount: -1 },
          },
          { session },
        );
      }

      res.status(200).json({
        status: "success",
        message: "Notificación eliminada",
        notification: notificationRemoved,
      });
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error en el servidor",
    });
  }
};

const readAll = async (req, res) => {
  const user = req.user._id;

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      await Notification.updateMany(
        { user, read: false },
        { read: true },
        { session },
      );
      await User.findByIdAndUpdate(
        user,
        { unreadNotificationsCount: 0 },
        { session },
      );
      return res.status(200).send({
        status: "success",
        message: "Notificaciones leídas",
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
    });
  }
};

const removeAll = async (req, res) => {
  const user = req.user._id;

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      await Notification.deleteMany({ user }, { session });

      await User.findByIdAndUpdate(
        req.user._id,
        {
          unreadNotificationsCount: 0,
        },
        { session },
      );

      return res.status(200).json({
        status: "success",
        message: "Notificaciones removidas",
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
    });
  }
};

module.exports = {
  read,
  remove,
  readAll,
  removeAll,
};
