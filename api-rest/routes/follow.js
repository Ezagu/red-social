const express = require('express');
const router = express.Router();
const followController = require('../controllers/follow');
const auth = require('../middlewares/auth.js');

// Rutas
router.get('/prueba-follow', followController.pruebaFollow);
router.post('/save', auth, followController.save);
router.delete('/unfollow/:id', auth, followController.unfollow);
router.get('/following{/:id}{/:page}', auth, followController.following);
router.get('/followers{/:id}{/:page}', auth, followController.followers);

// Exportar router
module.exports = router;