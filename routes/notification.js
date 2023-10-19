const express = require('express');
const router = express.Router();
const Notification = require('../controllers/Notification');

router.get('/notifications/:userId', Notification.getNotifications);

module.exports = router;