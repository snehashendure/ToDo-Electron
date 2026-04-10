# Gold-Standard References

Use these files as canonical examples when writing or updating code.

## Tests

- API integration patterns: `backend/tests/tasks.api.int.test.js`
  - Use when adding endpoints or service behavior.
- DB persistence verification: `backend/tests/sqlite.persistence.int.test.js`
  - Use when changing repository or DB setup.
- Service utility logic: `backend/tests/taskService.unit.test.js`
  - Use for pure logic expectations and helper behavior.

## CI/CD

- Workflow baseline: `.github/workflows/ci.yml`
  - Use for ordering: install -> migrate -> seed -> lint -> test -> build -> artifact.

## Lint/Format

- ESLint baseline: `eslint.config.js`
- Prettier baseline: `.prettierrc`
- Jest baseline: `jest.config.js`

## Schema And Data

- Primary schema migration: `backend/migrations/001_create_tasks.sql`
- Incremental schema update: `backend/migrations/002_add_manual_override.sql`
- Seed fixture baseline: `backend/seeds/001_seed_tasks.sql`

## Architecture Anchors

- API route style: `backend/src/routes/tasks.js`
- Business logic style: `backend/src/services/taskService.js`
- SQLite repository style: `backend/src/repositories/sqliteTaskRepository.js`
- DB bootstrap style: `backend/src/server.js`
- Renderer interaction pattern: `frontend/renderer.js`
- UI style system: `frontend/styles.css`

## Example Prompt Usage

- "Add a new task action endpoint"
  - Read `backend/src/routes/tasks.js` + `backend/src/services/taskService.js` + `backend/tests/tasks.api.int.test.js`.
- "Modify schema for task metadata"
  - Follow `backend/migrations/*.sql`, then adjust seeds and tests.
- "Change UI behavior for task cards"
  - Follow `frontend/renderer.js` + `frontend/styles.css`; keep action wiring consistent.
- "Update quality pipeline"
  - Follow `.github/workflows/ci.yml` and keep command parity with `package.json` scripts.
