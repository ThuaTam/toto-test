// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');
// Route để lấy tất cả người dùng
router.get('/', verifyToken,userController.getAllUsers);

// Route để tạo một người dùng mới
router.post('/', userController.createUser);

// Route để lấy tất cả các Task của một người dùng
router.get('/:userId/tasks', verifyToken, userController.getUserTasks); // Áp dụng middleware kiểm tra token ở đây

// Route để cập nhật thông tin người dùng
router.put('/:userId', verifyToken, userController.updateUser);

// Route để lấy thông tin của một người dùng dựa trên id
router.get('/:userId', verifyToken, userController.getUserById);

router.get('/:userId/filterTask', verifyToken, userController.findUserTasks);

module.exports = router;
