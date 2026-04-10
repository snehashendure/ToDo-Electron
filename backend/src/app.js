const express = require('express');
const cors = require('cors');
const { TaskService } = require('./services/taskService');
const { createTaskRouter } = require('./routes/tasks');

function createApp({ repository } = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const service = new TaskService(repository);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/tasks', createTaskRouter(service));

  app.use((err, _req, res, next) => {
    void next;
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
