const express = require("express");
const router = express.Router();
const multer = require("multer");
const publicationController = require("../controllers/publication");
const auth = require("../middlewares/auth.js");
const publicationValidator = require("../validators/publicationValidator.js");
const validateFile = require("../middlewares/validateFile.js");

// Configuracion de subida
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/publications");
  },
  filename: (req, file, cb) => {
    cb(null, "pub-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

// Rutas
router.get("/publications", auth, publicationController.publications);
router.get(
  "/publications/following",
  auth,
  publicationController.followingPublications,
);
router.get("/:id/comments", auth, publicationController.comments);
router.get("/media/:file", publicationController.media);
router.get("/:id", auth, publicationController.detail);
router.delete("/:id", auth, publicationController.remove);
router.post(
  "/",
  auth,
  uploads.single("file0"),
  validateFile,
  publicationValidator.save,
  publicationController.save,
);

// Exportar router
module.exports = router;
