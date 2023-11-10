const express = require('express');
const router = express.Router();

const storyController = require('../controllers/Story.controller');
const cache = require('../routeCache');
const authorize = require('../middlewares/auth.middlewares');

router.get('/get-story-by-id/:id',authorize(), storyController.getStoryById);
router.post('/create-story',authorize(), storyController.createStory);
module.exports = router;
