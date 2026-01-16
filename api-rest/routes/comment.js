const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.js');
const commentController = require('../controllers/comment.js');

router.post('', auth, commentController.create);
router.delete('', auth, commentController.remove);
router.get('/:id/replies', auth, commentController.replies);

module.exports = router;