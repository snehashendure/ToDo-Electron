const fs = require('fs');
const os = require('os');
const path = require('path');
const { openSqliteDb } = require('../src/db/sqlite');
const { runSqliteDir } = require('../src/db/runSqliteDir');
const { SqliteTaskRepository } = require('../src/repositories/sqliteTaskRepository');
const { TaskService } = require('../src/services/taskService');

describe('SQLite persistence', () => {
  test('persists tasks between DB connections', async () => {
    const dbPath = path.join(os.tmpdir(), `todo-persist-${Date.now()}-${Math.random()}.sqlite`);

    const db1 = await openSqliteDb(dbPath);
    await runSqliteDir(db1, path.join(__dirname, '..', 'migrations'));
    const repo1 = new SqliteTaskRepository(db1);
    const service1 = new TaskService(repo1);
    await service1.create({ title: 'Persist Me', progress: 40 });
    await db1.close();

    const db2 = await openSqliteDb(dbPath);
    const repo2 = new SqliteTaskRepository(db2);
    const tasks = await repo2.getAllFlat();
    expect(tasks.some((task) => task.title === 'Persist Me')).toBe(true);
    await db2.close();

    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });
});
