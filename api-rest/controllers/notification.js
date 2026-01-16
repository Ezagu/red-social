const Notification = require('../models/notification.js');

const read = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const notification = await Notification.findOneAndUpdate({user: req.user._id, _id: notificationId}, {read: true}, {new: true});

    res.status(200).json({
      status: 'success',
      message: 'Notificación leída',
      notification
    })
  } catch(error) {
    res.status(400).json({
      status: 'error',
      message: 'No se pudo leer la notificación'
    })
  }
};

const remove = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const notificationRemoved = await Notification.findOneAndDelete({user: req.user._id, _id:notificationId});

    if(!notificationRemoved) throw new Error();

    res.status(200).json({
      status: 'success',
      message: 'Notificación eliminada'
    })
  } catch(error) {
    res.status(400).json({
      status: 'error',
      message: 'No se pudo eliminar la notificación'
    })
  }
}

const readAll = async (req, res) => {
  const user = req.user._id;

  try {
    await Notification.updateMany({user, read: false}, {read: true});

    return res.status(200).json({
      status: 'success',
      message: 'Todas las notificaciones leídas'
    });
  } catch(error) {
    return res.status(400).json({
      status: 'error',
      message: 'No se pudieron leer las notificaciones'
    });
  }
}

const removeAll = async (req, res) => {
  const user = req.user._id;

  try {
    await Notification.deleteMany({user});

    return res.status(200).json({
      status: 'success',
      message: 'Se eliminaron todas las notificaciones'
    });
  } catch(error) {
    return res.status(400).json({
      status: 'error',
      message: 'No se pudieron eliminar las notificaciones'
    });
  }
}

module.exports = {
  read,
  remove,
  readAll,
  removeAll
};