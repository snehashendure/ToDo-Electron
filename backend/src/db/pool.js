const { Pool } = require('pg');
require('dotenv').config();

function createPool() {
  return new Pool({
    connectionString:
      process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/todo_electron'
  });
}

module.exports = { createPool };
