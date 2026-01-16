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
router.post('/register', userValidator.register, userController.register);
router.post('/login', userValidator.login, userController.login);
router.post('/upload', [auth, uploads.single('file0')], userController.upload);
router.get('/avatar/:file', userController.avatar);
router.get('/users', auth, userController.list);
router.get('{/:id}/followers', auth, userController.listFollowers);
router.get('{/:id}/following', auth, userController.listFollowing);
router.get('{/:id}/publications', auth, userController.publications);
router.get('/:id', auth, userController.profile);
router.put('/', auth, userValidator.update, userController.update);
// DEPRECATED router.get('/counters{/:id}', auth, userController.counters);

// Exportar router
module.exports = router;