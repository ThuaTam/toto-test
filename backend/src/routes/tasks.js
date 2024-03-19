const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const verifyToken = require('../middleware/verifyToken');


// getAll task
router.get('/', taskController.getAllTasks);

// createTask
router.post('/',verifyToken ,taskController.createTask);

// getTask theo id
router.get('/:taskId', taskController.getTaskById);

// updateTask
router.put('/:taskId', verifyToken,taskController.updateTask);
    
// deleteTask
router.delete('/:taskId', verifyToken, taskController.deleteTask);

router.get('/filter', verifyToken, taskController.filterTasks);

module.exports = router;
