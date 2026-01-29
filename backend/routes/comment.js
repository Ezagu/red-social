const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.js");
const commentController = require("../controllers/comment.js");
const commentValidator = require("../validators/commentValidator.js");

router.post("", auth, commentValidator.create, commentController.create);
router.delete("/:id", auth, commentValidator.delete, commentController.remove);
router.get(
  "/:id/replies",
  auth,
  commentValidator.replies,
  commentController.replies,
);

module.exports = router;
