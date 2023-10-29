const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/Notification.controller');
const cache = require('../routeCache');
const authorize = require('../middlewares/auth.middlewares');

router.get('/my-notification',authorize(), notificationController.getMyNotification);
module.exports = router;
