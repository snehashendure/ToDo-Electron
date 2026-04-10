const request = require('supertest');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createApp } = require('../src/app');
const { openSqliteDb } = require('../src/db/sqlite');
const { runSqliteDir } = require('../src/db/runSqliteDir');
const { SqliteTaskRepository } = require('../src/repositories/sqliteTaskRepository');

async function createTestApp(dbPath) {
  const db = await openSqliteDb(dbPath);
  await runSqliteDir(db, path.join(__dirname, '..', 'migrations'));
  const app = createApp({ repository: new SqliteTaskRepository(db) });
  return { app, db };
}

describe('Tasks API integration', () => {
  let app;
  let db;
  let dbPath;

  beforeEach(async () => {
    dbPath = path.join(os.tmpdir(), `todo-test-${Date.now()}-${Math.random()}.sqlite`);
    const test = await createTestApp(dbPath);
    app = test.app;
    db = test.db;
  });

  afterEach(async () => {
    await db.close();
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  test('creates parent and subtask, then computes parent completion', async () => {
    const parent = await request(app).post('/api/tasks').send({ title: 'Parent' });
    expect(parent.status).toBe(201);

    const child = await request(app)
      .post(`/api/tasks/${parent.body.id}/subtasks`)
      .send({ title: 'Child', progress: 100 });
    expect(child.status).toBe(201);

    const list = await request(app).get('/api/tasks');
    expect(list.status).toBe(200);
    expect(list.body[0].progress).toBe(100);
    expect(list.body[0].completed).toBe(1);
  });

  test('mark completed sets manual override when subtasks are incomplete', async () => {
    const parent = await request(app).post('/api/tasks').send({ title: 'Parent' });
    await request(app).post(`/api/tasks/${parent.body.id}/subtasks`).send({ title: 'Child', progress: 30 });

    const completeResp = await request(app).post(`/api/tasks/${parent.body.id}/complete`).send({});
    expect(completeResp.status).toBe(200);
    expect(completeResp.body.completed).toBe(1);
    expect(completeResp.body.manual_override).toBe(1);
  });

  test('delete cascades to subtasks', async () => {
    const parent = await request(app).post('/api/tasks').send({ title: 'Parent' });
    await request(app).post(`/api/tasks/${parent.body.id}/subtasks`).send({ title: 'Child' });

    const delResp = await request(app).delete(`/api/tasks/${parent.body.id}`);
    expect(delResp.status).toBe(204);

    const list = await request(app).get('/api/tasks');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(0);
  });
});
