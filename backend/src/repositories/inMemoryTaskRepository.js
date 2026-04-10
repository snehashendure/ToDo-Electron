const fs = require('fs');
const path = require('path');

class InMemoryTaskRepository {
  constructor(filePath) {
    this.filePath =
      filePath || path.join(__dirname, '..', '..', 'data', 'tasks.fallback.json');
    this.tasks = [];
    this.nextId = 1;
    this.ensureLoaded();
  }

  ensureLoaded() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      this.persist();
      return;
    }

    try {
      const parsed = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      this.tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
      this.nextId = Number(parsed.nextId) || this.tasks.reduce((m, t) => Math.max(m, t.id), 0) + 1;
    } catch {
      this.tasks = [];
      this.nextId = 1;
      this.persist();
    }
  }

  persist() {
    fs.writeFileSync(
      this.filePath,
      JSON.stringify({ tasks: this.tasks, nextId: this.nextId }, null, 2),
      'utf8'
    );
  }

  async getAllFlat() {
    return [...this.tasks].sort((a, b) => a.id - b.id);
  }

  async getById(id) {
    return this.tasks.find((task) => task.id === Number(id)) || null;
  }

  async getChildren(parentId) {
    return this.tasks.filter((task) => task.parent_id === Number(parentId));
  }

  async create(task) {
    const created = {
      id: this.nextId++,
      parent_id: task.parent_id ?? null,
      title: task.title,
      description: task.description ?? null,
      progress: task.progress ?? 0,
      completed: task.completed ?? false,
      start_date: task.start_date ?? null,
      end_date: task.end_date ?? null,
      created_at: new Date().toISOString()
    };
    this.tasks.push(created);
    this.persist();
    return created;
  }

  async update(id, task) {
    const index = this.tasks.findIndex((item) => item.id === Number(id));
    if (index === -1) {
      return null;
    }

    const current = this.tasks[index];
    const updated = {
      ...current,
      title: task.title ?? current.title,
      description: task.description ?? current.description,
      progress: task.progress ?? current.progress,
      completed: task.completed ?? current.completed,
      start_date: task.start_date ?? null,
      end_date: task.end_date ?? null
    };
    this.tasks[index] = updated;
    this.persist();
    return updated;
  }

  async delete(id) {
    const target = await this.getById(id);
    if (!target) {
      return null;
    }
    const idsToDelete = new Set();
    const stack = [Number(id)];
    while (stack.length) {
      const currentId = stack.pop();
      idsToDelete.add(currentId);
      this.tasks
        .filter((task) => task.parent_id === currentId)
        .forEach((child) => stack.push(child.id));
    }
    this.tasks = this.tasks.filter((task) => !idsToDelete.has(task.id));
    this.persist();
    return target;
  }

  async patchProgressAndCompletion(id, progress, completed) {
    const index = this.tasks.findIndex((item) => item.id === Number(id));
    if (index === -1) {
      return;
    }
    this.tasks[index] = { ...this.tasks[index], progress, completed };
    this.persist();
  }
}

module.exports = { InMemoryTaskRepository };
