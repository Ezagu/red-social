const express = require('express');
const router = express.Router();
const followController = require('../controllers/follow');
const auth = require('../middlewares/auth.js');

// Rutas
router.post('/:id', auth, followController.save);
router.delete('/:id', auth, followController.unfollow);

// Exportar router
module.exports = router;