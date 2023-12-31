const express = require('express');
const router = express.Router();

const conversationController = require('../controllers/Conversation.controller');
const cache = require('../routeCache')

router.post('/create', conversationController.createConversation);
router.get('/my-conversation/:id', conversationController.getMyConversation);
router.get('/:id', conversationController.getConversationById);
module.exports = router;
