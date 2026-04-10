function clampProgress(value) {
  const n = Number(value);
  if (Number.isNaN(n)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(n)));
}

function buildTree(flat) {
  const map = new Map();
  const roots = [];

  for (const item of flat) {
    map.set(item.id, { ...item, subtasks: [] });
  }

  for (const item of map.values()) {
    if (!item.parent_id) {
      roots.push(item);
      continue;
    }
    const parent = map.get(item.parent_id);
    if (parent) {
      parent.subtasks.push(item);
    } else {
      roots.push(item);
    }
  }

  return roots;
}

class TaskService {
  constructor(repository) {
    this.repository = repository;
  }

  async getTree() {
    const tasks = await this.repository.getAllFlat();
    return buildTree(tasks);
  }

  async getById(id) {
    return this.repository.getById(id);
  }

  async create(payload) {
    const progress = clampProgress(payload.progress ?? 0);
    const completed = progress === 100;
    const task = await this.repository.create({ ...payload, progress, completed, manual_override: false });
    await this.recomputeAncestors(task.parent_id);
    return task;
  }

  async update(id, payload) {
    const current = await this.repository.getById(id);
    if (!current) {
      return null;
    }

    const children = await this.repository.getChildren(id);
    const hasChildren = children.length > 0;

    let nextProgress = current.progress;
    let nextCompleted = current.completed;
    let manualOverride = current.manual_override;

    if (!hasChildren) {
      if (payload.completed === true) {
        nextProgress = 100;
        nextCompleted = true;
        manualOverride = false;
      } else if (payload.completed === false) {
        nextCompleted = false;
        manualOverride = false;
      }
      if (payload.progress !== undefined) {
        nextProgress = clampProgress(payload.progress);
        nextCompleted = nextProgress === 100 ? true : nextCompleted;
        if (nextProgress < 100) {
          manualOverride = false;
        }
      }
      if (nextProgress < 100 && payload.completed === false) {
        nextCompleted = false;
      }
    } else if (payload.completed === false) {
      manualOverride = false;
      nextCompleted = false;
    }

    const updated = await this.repository.update(id, {
      ...payload,
      progress: hasChildren ? current.progress : nextProgress,
      completed: hasChildren ? nextCompleted : nextCompleted,
      manual_override: manualOverride
    });

    if (!updated) {
      return null;
    }

    await this.recomputeNode(id);
    await this.recomputeAncestors(updated.parent_id);
    return this.repository.getById(id);
  }

  async markCompleted(id) {
    const current = await this.repository.getById(id);
    if (!current) {
      return null;
    }
    const children = await this.repository.getChildren(id);
    if (children.length === 0) {
      await this.repository.patchProgressAndCompletion(id, 100, true, false);
      await this.recomputeAncestors(current.parent_id);
      return this.repository.getById(id);
    }

    const allChildrenCompleted = children.every((child) => !!child.completed);
    if (allChildrenCompleted) {
      await this.repository.patchProgressAndCompletion(id, 100, true, false);
    } else {
      await this.repository.patchProgressAndCompletion(id, 100, true, true);
    }
    await this.recomputeAncestors(current.parent_id);
    return this.repository.getById(id);
  }

  async delete(id) {
    const existing = await this.repository.getById(id);
    if (!existing) {
      return null;
    }
    await this.repository.delete(id);
    await this.recomputeAncestors(existing.parent_id);
    return existing;
  }

  async recomputeNode(id) {
    const children = await this.repository.getChildren(id);
    if (children.length === 0) {
      return;
    }

    const node = await this.repository.getById(id);
    const progress = Math.round(children.reduce((sum, child) => sum + child.progress, 0) / children.length);
    const completed = children.every((child) => child.completed);
    if (node && node.manual_override) {
      await this.repository.patchProgressAndCompletion(id, 100, true, true);
      return;
    }
    await this.repository.patchProgressAndCompletion(id, progress, completed, false);
  }

  async recomputeAncestors(parentId) {
    let cursor = parentId;
    while (cursor) {
      await this.recomputeNode(cursor);
      const parent = await this.repository.getById(cursor);
      cursor = parent ? parent.parent_id : null;
    }
  }
}

module.exports = { TaskService, clampProgress, buildTree };
