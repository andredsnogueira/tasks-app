const express = require('express');
const router = express.Router();
const auth = require('./middlewares/auth');
const validators = require('./validators');
const taskController = require('./controllers/taskController');
const authController = require('./controllers/authController');

router.post('/login', validators.login, authController.login);

router.get('/tasks', auth.verify, taskController.index);

router.post(
  '/tasks',
  validators.createTask,
  auth.verify,
  taskController.create
);

router.put(
  '/tasks/:id',
  validators.updateTask,
  auth.verify,
  taskController.update
);

router.delete(
  '/tasks/:id',
  validators.deleteTask,
  auth.verify,
  taskController.delete
);

router.patch(
  '/tasks/:id/complete',
  validators.completeTask,
  auth.verify,
  taskController.complete
);

exports.router = router;
