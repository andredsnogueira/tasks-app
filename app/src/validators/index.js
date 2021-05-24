const { body, param } = require('express-validator');

exports.createTask = [
  body('name').notEmpty().trim().escape().isString(),
  body('summary').notEmpty().trim().escape().isString(),
];

exports.updateTask = [
  body('name').notEmpty().trim().escape().isString(),
  body('summary').notEmpty().trim().escape().isString(),
  param('id').notEmpty().isInt(),
];

exports.deleteTask = [param('id').notEmpty().isInt()];

exports.completeTask = [param('id').notEmpty().isInt()];

exports.login = [
  body('email').notEmpty().trim().escape().isEmail(),
  body('password').notEmpty().trim().escape().isString(),
];
