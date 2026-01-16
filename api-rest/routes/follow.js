const express = require('express');
const router = express.Router();
const followController = require('../controllers/follow');
const auth = require('../middlewares/auth.js');

// Rutas
router.post('/:id', auth, followController.save);
router.delete('/:id', auth, followController.unfollow);
router.get('/following{/:id}{/:page}', auth, followController.following);
router.get('/followers{/:id}{/:page}', auth, followController.followers);

// Exportar router
module.exports = router;