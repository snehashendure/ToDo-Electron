const express = require('express');

function createTaskRouter(taskService) {
  const router = express.Router();

  router.get('/', async (_req, res, next) => {
    try {
      const tasks = await taskService.getTree();
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const task = await taskService.getById(Number(req.params.id));
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      if (!req.body.title) {
        return res.status(400).json({ message: 'title is required' });
      }
      const task = await taskService.create(req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  });

  router.post('/:id/subtasks', async (req, res, next) => {
    try {
      if (!req.body.title) {
        return res.status(400).json({ message: 'title is required' });
      }
      const parentId = Number(req.params.id);
      const parent = await taskService.getById(parentId);
      if (!parent) {
        return res.status(404).json({ message: 'Parent task not found' });
      }
      const task = await taskService.create({ ...req.body, parent_id: parentId });
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const task = await taskService.update(Number(req.params.id), req.body);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      next(error);
    }
  });

  router.post('/:id/complete', async (req, res, next) => {
    try {
      const task = await taskService.markCompleted(Number(req.params.id));
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const task = await taskService.delete(Number(req.params.id));
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createTaskRouter };
