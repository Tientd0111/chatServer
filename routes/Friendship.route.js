const express = require('express');
const router = express.Router();
const cache = require('../routeCache')
const friendshipController = require('../controllers/Friendship.controller');
const authorize = require('../middlewares/auth.middlewares');

router.get('/getMyFriend',authorize(), friendshipController.getMyFriend);
router.get('/:id',authorize(), friendshipController.getFriendById);
module.exports = router;
