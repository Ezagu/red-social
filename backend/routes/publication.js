const express = require("express");
const router = express.Router();
const multer = require("multer");
const publicationController = require("../controllers/publication");
const auth = require("../middlewares/auth.js");
const publicationValidator = require("../validators/publicationValidator.js");

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
router.post(
  "/:id/upload",
  [auth, uploads.single("file0")],
  publicationController.upload,
);
router.get("/media/:file", publicationController.media);
router.post("/", auth, publicationValidator.save, publicationController.save);
router.get("/:id", auth, publicationController.detail);
router.delete("/:id", auth, publicationController.remove);

// Exportar router
module.exports = router;
