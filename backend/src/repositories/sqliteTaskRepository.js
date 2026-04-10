class SqliteTaskRepository {
  constructor(db) {
    this.db = db;
  }

  async getAllFlat() {
    return this.db.all('SELECT * FROM tasks ORDER BY created_at ASC, id ASC');
  }

  async getById(id) {
    return this.db.get('SELECT * FROM tasks WHERE id = ?', [id]);
  }

  async getChildren(parentId) {
    return this.db.all('SELECT * FROM tasks WHERE parent_id = ? ORDER BY id ASC', [parentId]);
  }

  async create(task) {
    const result = await this.db.run(
      `INSERT INTO tasks (parent_id, title, description, progress, completed, manual_override, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.parent_id ?? null,
        task.title,
        task.description ?? null,
        task.progress ?? 0,
        task.completed ? 1 : 0,
        task.manual_override ? 1 : 0,
        task.start_date ?? null,
        task.end_date ?? null
      ]
    );
    return this.getById(result.lastID);
  }

  async update(id, task) {
    await this.db.run(
      `UPDATE tasks
         SET title = COALESCE(?, title),
             description = COALESCE(?, description),
             progress = COALESCE(?, progress),
             completed = COALESCE(?, completed),
             manual_override = COALESCE(?, manual_override),
             start_date = ?,
             end_date = ?
       WHERE id = ?`,
      [
        task.title ?? null,
        task.description ?? null,
        task.progress ?? null,
        task.completed === undefined ? null : task.completed ? 1 : 0,
        task.manual_override === undefined ? null : task.manual_override ? 1 : 0,
        task.start_date ?? null,
        task.end_date ?? null,
        id
      ]
    );
    return this.getById(id);
  }

  async delete(id) {
    const existing = await this.getById(id);
    if (!existing) {
      return null;
    }
    await this.db.run('DELETE FROM tasks WHERE id = ?', [id]);
    return existing;
  }

  async patchProgressAndCompletion(id, progress, completed, manualOverride) {
    await this.db.run(
      'UPDATE tasks SET progress = ?, completed = ?, manual_override = COALESCE(?, manual_override) WHERE id = ?',
      [
        progress,
        completed ? 1 : 0,
        manualOverride === undefined ? null : manualOverride ? 1 : 0,
        id
      ]
    );
  }
}

module.exports = { SqliteTaskRepository };
