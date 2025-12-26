const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Rutas
router.get('/prueba-usuario', userController.pruebaUser);
router.post('/register', userController.register);
router.post('/login', userController.login);

// Exportar router
module.exports = router;