const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/auth.middlewares')

const authController = require('../controllers/Auth.controller');

router.get('/list-user',authorize(),authController.getUser);
router.get('/info', authorize(), authController.myInfo);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/login-to-admin', authController.login_to_admin);
router.put('/change-password', authorize(), authController.changePassword);
module.exports = router;
