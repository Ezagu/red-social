const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/user');
const auth = require('../middlewares/auth.js');
const userValidator = require('../validators/userValidator.js');

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
router.post('/register', userValidator.register ,userController.register);
router.post('/login', userController.login);
router.get('/profile/:id', auth, userController.profile);
router.get('/list', auth, userController.list);
router.get('/list/:page', auth, userController.list);
router.put('/update', auth, userValidator.update, userController.update);
router.post('/upload', [auth, uploads.single('file0')], userController.upload);
router.get('/avatar/:file', userController.avatar);
router.get('/counters{/:id}', auth, userController.counters);


// Exportar router
module.exports = router;