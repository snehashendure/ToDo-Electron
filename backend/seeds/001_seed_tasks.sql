DELETE FROM tasks;

INSERT INTO tasks (id, parent_id, title, description, progress, completed, manual_override, start_date, end_date)
VALUES
  (1, NULL, 'Launch MVP', 'Prepare and launch the initial release', 50, 0, 0, '2026-04-10', '2026-05-01'),
  (2, 1, 'Design UI', 'Build card interface and styles', 100, 1, 0, '2026-04-10', '2026-04-14'),
  (3, 1, 'Implement API', 'CRUD with nested subtasks', 0, 0, 0, '2026-04-11', '2026-04-20'),
  (4, NULL, 'Team Sync', 'Weekly sync checklist', 20, 0, 0, NULL, NULL);

DELETE FROM sqlite_sequence WHERE name = 'tasks';
INSERT INTO sqlite_sequence (name, seq) VALUES ('tasks', 4);
