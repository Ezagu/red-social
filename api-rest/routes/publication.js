const express = require('express');
const router = express.Router();
const multer = require('multer');
const publicationController = require('../controllers/publication');
const auth = require('../middlewares/auth.js');

// Configuracion de subida
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/publications');
  },
  filename: (req, file, cb) => {
    cb(null, 'pub-' + Date.now() + '-' + file.originalname);
  }
})

const uploads = multer({storage});

// Rutas
router.get('/prueba-publication', publicationController.pruebaPublication);
router.post('/save', auth, publicationController.save);
router.get('/detail/:id', auth, publicationController.detail);
router.delete('/remove/:id', auth, publicationController.remove);
router.get('/user/:id{/:page}', auth, publicationController.user);
router.post('/upload/:id', [auth, uploads.single('file0')], publicationController.upload);
router.get('/media/:file', publicationController.media);
router.get('/feed{/:page}', auth, publicationController.feed);


// Exportar router
module.exports = router;