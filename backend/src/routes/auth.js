const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route đăng nhập
router.post('/login', authController.login);
// Route đăng xuất
router.post('/logout', authController.logout);

module.exports = router;
