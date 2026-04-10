PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
  start_date DATE,
  end_date DATE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
