const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.js');
const notificationController = require('../controllers/notification.js');

router.delete('/remove-all', auth, notificationController.removeAll);
router.patch('/read-all', auth, notificationController.readAll);
router.patch('/:id/read', auth, notificationController.read);
router.delete('/:id', auth, notificationController.remove);
router.get('/notifications', auth, notificationController.list);

module.exports = router;