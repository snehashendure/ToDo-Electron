const { buildTree, clampProgress } = require('../src/services/taskService');

describe('taskService utilities', () => {
  test('clampProgress bounds values', () => {
    expect(clampProgress(-5)).toBe(0);
    expect(clampProgress(30)).toBe(30);
    expect(clampProgress(120)).toBe(100);
  });

  test('buildTree nests tasks', () => {
    const tree = buildTree([
      { id: 1, parent_id: null, title: 'root' },
      { id: 2, parent_id: 1, title: 'child' },
      { id: 3, parent_id: 2, title: 'grandchild' }
    ]);

    expect(tree).toHaveLength(1);
    expect(tree[0].subtasks[0].id).toBe(2);
    expect(tree[0].subtasks[0].subtasks[0].id).toBe(3);
  });
});
