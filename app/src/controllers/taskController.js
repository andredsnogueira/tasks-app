const { validationResult } = require('express-validator');
const queue = require('../rabbitmq');
const taskRepository = require('../repositories/taskRepository');

exports.index = async (req, res) => {
  try {
    const tasks = await taskRepository.all(req);

    if (tasks.length === 0) {
      return res.status(204).json();
    }

    return res.json({ tasks });
  } catch (_) {
    return res.status(500).json();
  }
};

exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors });
    }

    const task = await taskRepository.save(req);

    if (!task) {
      return res.status(400).json({ error: 'Something went wrong.' });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json();
  }
};

exports.update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors });
    }

    const task = await taskRepository.update(req);

    if (!task) {
      return res.status(400).json({ error: 'Something went wrong.' });
    }

    return res.status(204).json();
  } catch (_) {
    return res.status(500).json();
  }
};

exports.delete = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors });
    }

    if (!req.user.manager) {
      return res.status(403).json();
    }

    const task = await taskRepository.delete(req);

    if (!task) {
      return res.status(400).json({ error: 'Something went wrong.' });
    }

    return res.status(204).json();
  } catch (_) {
    return res.status(500).json();
  }
};

exports.complete = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors });
    }

    let task = await taskRepository.complete(req);

    if (!task) {
      return res.status(400).json({ error: 'Something went wrong.' });
    }

    task = await taskRepository.getByUserAndId(req);

    queue.send(task);

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
};
