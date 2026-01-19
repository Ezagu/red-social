const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.js');
const auth = require('../middlewares/auth.js');

router.post('/', auth, likeController.save);
router.delete('/:id', auth, likeController.remove);

module.exports = router;