const express = require('express');
const router = express.Router();

const conversationController = require('../controllers/Conversation.controller');

router.post('/create', conversationController.createConversation);
module.exports = router;
