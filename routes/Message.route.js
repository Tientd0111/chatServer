const express = require('express');
const router = express.Router();
const cache = require('../routeCache')
const messageController = require('../controllers/Message.controller');

router.get('/list-message/:id',cache(300), messageController.getMessageByConversation);
module.exports = router;
