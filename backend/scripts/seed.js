const path = require('path');
const { openSqliteDb } = require('../src/db/sqlite');
const { runSqliteDir } = require('../src/db/runSqliteDir');

async function seed() {
  const dbPath =
    process.env.SQLITE_DB_PATH || path.join(__dirname, '..', 'data', 'tasks.sqlite');
  const db = await openSqliteDb(dbPath);
  try {
    await runSqliteDir(db, path.join(__dirname, '..', 'seeds'));
    console.log('Seeds completed.');
  } finally {
    await db.close();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
