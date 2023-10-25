const express = require('express');
const router = express.Router();
const cache = require('../routeCache')
const messageController = require('../controllers/Message.controller');

router.get('/list-message/:id', messageController.getMessageByConversation);
module.exports = router;
