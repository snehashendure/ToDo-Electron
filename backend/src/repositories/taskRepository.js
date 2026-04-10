class TaskRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async getAllFlat() {
    const result = await this.pool.query('SELECT * FROM tasks ORDER BY created_at ASC, id ASC');
    return result.rows;
  }

  async getById(id) {
    const result = await this.pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async getChildren(parentId) {
    const result = await this.pool.query('SELECT * FROM tasks WHERE parent_id = $1 ORDER BY id ASC', [
      parentId
    ]);
    return result.rows;
  }

  async create(task) {
    const result = await this.pool.query(
      `INSERT INTO tasks (parent_id, title, description, progress, completed, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        task.parent_id ?? null,
        task.title,
        task.description ?? null,
        task.progress ?? 0,
        task.completed ?? false,
        task.start_date ?? null,
        task.end_date ?? null
      ]
    );
    return result.rows[0];
  }

  async update(id, task) {
    const result = await this.pool.query(
      `UPDATE tasks
         SET title = COALESCE($2, title),
             description = COALESCE($3, description),
             progress = COALESCE($4, progress),
             completed = COALESCE($5, completed),
             start_date = $6,
             end_date = $7
       WHERE id = $1
       RETURNING *`,
      [
        id,
        task.title ?? null,
        task.description ?? null,
        task.progress ?? null,
        task.completed ?? null,
        task.start_date ?? null,
        task.end_date ?? null
      ]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await this.pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }

  async patchProgressAndCompletion(id, progress, completed) {
    await this.pool.query('UPDATE tasks SET progress = $2, completed = $3 WHERE id = $1', [
      id,
      progress,
      completed
    ]);
  }
}

module.exports = { TaskRepository };
