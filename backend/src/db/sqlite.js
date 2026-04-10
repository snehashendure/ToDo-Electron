const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function openSqliteDb(filePath) {
  const resolved = filePath || path.join(__dirname, '..', '..', 'data', 'tasks.sqlite');
  const dir = path.dirname(resolved);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = await open({
    filename: resolved,
    driver: sqlite3.Database
  });

  await db.exec('PRAGMA foreign_keys = ON;');
  return db;
}

module.exports = { openSqliteDb };
