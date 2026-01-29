const express = require("express");
const router = express.Router();
const likeController = require("../controllers/like.js");
const auth = require("../middlewares/auth.js");
const likeValidator = require("../validators/likeValidator.js");

router.post("/:id", auth, likeValidator.like, likeController.save);
router.delete("/:id", auth, likeValidator.dislike, likeController.remove);

module.exports = router;
