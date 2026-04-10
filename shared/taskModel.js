function normalizeTaskInput(payload) {
  return {
    title: payload.title?.trim(),
    description: payload.description?.trim() || null,
    progress: Number(payload.progress) || 0,
    parent_id: payload.parent_id ? Number(payload.parent_id) : null,
    start_date: payload.start_date || null,
    end_date: payload.end_date || null
  };
}

module.exports = { normalizeTaskInput };
