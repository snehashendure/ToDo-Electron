const path = require('path');
const { openSqliteDb } = require('../src/db/sqlite');
const { runSqliteDir } = require('../src/db/runSqliteDir');

async function migrate() {
  const dbPath =
    process.env.SQLITE_DB_PATH || path.join(__dirname, '..', 'data', 'tasks.sqlite');
  const db = await openSqliteDb(dbPath);
  try {
    await runSqliteDir(db, path.join(__dirname, '..', 'migrations'));
    console.log('Migrations completed.');
  } finally {
    await db.close();
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
