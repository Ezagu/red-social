const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.js");
const notificationController = require("../controllers/notification.js");
const notificationValidator = require("../validators/notificationValidator.js");

router.delete("/remove-all", auth, notificationController.removeAll);
router.patch("/read-all", auth, notificationController.readAll);
router.patch(
  "/:id/read",
  auth,
  notificationValidator.read,
  notificationController.read,
);
router.delete(
  "/:id",
  auth,
  notificationValidator.delete,
  notificationController.remove,
);

module.exports = router;
