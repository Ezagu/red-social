const { param } = require("express-validator");
const { isObjectId } = require("./customs");
const Notification = require("../models/notification");
const validateFields = require("./validateFields");

const notificationId = param("id")
  .trim()
  .notEmpty()
  .withMessage("Debes enviar el id de la notificación")
  .custom(isObjectId)
  .custom(async (notificationId, { req }) => {
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new Error("No existe la notificación");
    if (notification.user.toString() !== req.user._id.toString())
      throw new Error("Esta notificación no pertenece al usuario");
    return true;
  });

exports.read = [[notificationId], [validateFields]];

exports.delete = [[notificationId], [validateFields]];
