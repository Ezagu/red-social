const express = require("express");
const router = express.Router();
const followController = require("../controllers/follow");
const auth = require("../middlewares/auth.js");
const followValidator = require("../validators/followValidator.js");

// Rutas
router.post("/:id", auth, followValidator.follow, followController.save);
router.delete(
  "/:id",
  auth,
  followValidator.unfollow,
  followController.unfollow,
);

// Exportar router
module.exports = router;
