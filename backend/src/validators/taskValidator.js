const { body } = require('express-validator');

const createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done')
];

const updateTaskValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done')
];

module.exports = {
  createTaskValidator,
  updateTaskValidator
};