const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createTaskValidator, updateTaskValidator } = require('../validators/taskValidator');
const { createTask, getTasks, getTask, updateTask, deleteTask } = require('../controllers/taskController');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTaskValidator, validate, createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTaskValidator, validate, updateTask)
  .patch(updateTaskValidator, validate, updateTask)   // PATCH for partial updates
  .delete(deleteTask);

module.exports = router;
