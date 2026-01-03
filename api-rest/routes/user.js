const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/user');
const auth = require('../middlewares/auth.js');

// Configuracion de subida
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/avatars');
  },
  filename: (req, file, cb) => {
    cb(null, 'avatar-' + Date.now() + '-' + file.originalname);
  }
})

const uploads = multer({storage});

// Rutas
router.get('/prueba-usuario', auth, userController.pruebaUser);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile/:id', auth, userController.profile);
router.get('/list', auth, userController.list);
router.get('/list/:page', auth, userController.list);
router.put('/update', auth, userController.update);
router.post('/upload', [auth, uploads.single('file0')], userController.upload);
router.get('/avatar/:file', auth, userController.avatar);


// Exportar router
module.exports = router;