const express = require("express");
const uploads = require("../middlewares/multer.js");
const userController = require("../controllers/user");
const auth = require("../middlewares/auth.js");
const userValidator = require("../validators/userValidator.js");
const validateFile = require("../middlewares/validateFile.js");

// Configuracion de subida
/*const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, "avatar-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });*/

const router = express.Router();

// Rutas
router.post("/register", userValidator.register, userController.register);
router.post("/login", userValidator.login, userController.login);
router.get("/avatar/:file", userController.avatar);
router.get("/users", auth, userValidator.list, userController.list);
router.get("/notifications", auth, userController.notifications);
router.get(
  "{/:id}/followers",
  auth,
  userValidator.list,
  userController.listFollowers,
);
router.get(
  "{/:id}/following",
  auth,
  userValidator.list,
  userController.listFollowing,
);
router.get(
  "{/:id}/publications",
  auth,
  userValidator.list,
  userController.publications,
);
router.get("/{:id}", auth, userValidator.userId, userController.profile);
router.put(
  "/",
  auth,
  userValidator.update,
  uploads.single("file0"),
  validateFile,
  userController.update,
);

// Exportar router
module.exports = router;
