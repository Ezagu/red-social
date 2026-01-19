const Notification = require("../models/notification.js");
const User = require("../models/user.js");

const read = async (req, res) => {
  const user = req.user._id;
  const notificationId = req.params.id;

  try {
    const notification = await Notification.findOneAndUpdate(
      { user: req.user._id, _id: notificationId },
      { read: true }
    );

    if (!notification.read) {
      await User.findByIdAndUpdate(user, {
        $inc: { unreadNotificationsCount: -1 },
      });
    }

    res.status(200).json({
      status: "success",
      message: "Notificación leída",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "No se pudo leer la notificación",
    });
  }
};

const remove = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const notificationRemoved = await Notification.findOneAndDelete({
      user: req.user._id,
      _id: notificationId,
    });

    if (!notificationRemoved) {
      return res.status(404).json({
        status: 'error',
        message: 'Notificación inexistente'
      })
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "No se pudo eliminar la notificación",
    });
  }
};

const readAll = async (req, res) => {
  const user = req.user._id;

  try {
    await Notification.updateMany({ user, read: false }, { read: true });

    await User.findByIdAndUpdate(user, { unreadNotificationsCount: 0 });

    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudieron leer las notificaciones",
    });
  }
};

const removeAll = async (req, res) => {
  const user = req.user._id;

  try {
    await Notification.deleteMany({ user });

    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudieron eliminar las notificaciones",
    });
  }
};

const list = async (req, res) => {
  const user = req.user._id;

  try {
    const notifications = await Notification.find({ user })
      .populate("fromUser", "nick name surname image")
      .populate("targetId");

    return res.status(200).json({
      status: "success",
      message: "Listado de notificaciones",
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudo listar las notificaciones",
    });
  }
};

module.exports = {
  read,
  remove,
  readAll,
  removeAll,
  list
};
