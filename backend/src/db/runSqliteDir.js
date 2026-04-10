const fs = require('fs');
const path = require('path');

async function runSqliteDir(db, dirPath) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const appliedRows = await db.all('SELECT filename FROM schema_migrations');
  const applied = new Set(appliedRows.map((row) => row.filename));

  const files = fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));

  for (const file of files) {
    if (applied.has(file)) {
      continue;
    }
    const sql = fs.readFileSync(path.join(dirPath, file), 'utf8');
    await db.exec(sql);
    await db.run('INSERT INTO schema_migrations (filename) VALUES (?)', [file]);
  }
}

module.exports = { runSqliteDir };
