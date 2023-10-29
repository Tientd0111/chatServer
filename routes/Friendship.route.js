const express = require('express');
const router = express.Router();
const cache = require('../routeCache')
const friendshipController = require('../controllers/Friendship.controller');
const authorize = require('../middlewares/auth.middlewares');

router.get('/getMyFriend',authorize(),cache(300), friendshipController.getMyFriend);
router.get('/:id',authorize(),cache(300), friendshipController.getFriendById);
module.exports = router;
