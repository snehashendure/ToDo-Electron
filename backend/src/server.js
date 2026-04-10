const path = require('path');
const { createApp } = require('./app');
const { openSqliteDb } = require('./db/sqlite');
const { SqliteTaskRepository } = require('./repositories/sqliteTaskRepository');

async function startServer(port = process.env.PORT || 3001) {
  const dbPath =
    process.env.SQLITE_DB_PATH || path.join(__dirname, '..', 'data', 'tasks.sqlite');
  const sqliteDb = await openSqliteDb(dbPath);
  const repository = new SqliteTaskRepository(sqliteDb);
  const app = createApp({ repository });
  const server = app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port} (SQLite: ${dbPath})`);
  });

  return { sqliteDb, server, app };
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { startServer };
