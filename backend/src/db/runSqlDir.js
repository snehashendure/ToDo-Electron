const fs = require('fs');
const path = require('path');

async function runSqlDir(pool, dirPath) {
  const files = fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));

  for (const file of files) {
    const sql = fs.readFileSync(path.join(dirPath, file), 'utf8');
    await pool.query(sql);
  }
}

module.exports = { runSqlDir };
