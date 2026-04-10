# ToDo-Electron

A full-stack CRUD task manager built with Electron (frontend shell), Node.js + Express (backend API), and a local SQLite database for persistent storage, including nested subtasks, progress tracking, linting, tests, and CI.

## Folder Structure

- `electron/` - Electron main process and preload bridge.
- `frontend/` - Renderer UI (HTML/CSS/JS) with modern card-based task board.
- `backend/src/` - Express API, services, and SQLite repository layer.
- `backend/migrations/` - SQL migration scripts.
- `backend/seeds/` - SQL seed data scripts.
- `backend/tests/` - Unit and integration tests.
- `shared/` - Shared task model helpers.
- `.github/workflows/` - CI workflow.

## Features

- CRUD for tasks and nested subtasks.
- Parent task completion and progress auto-computed from child subtasks.
- "Mark Completed" action per task with manual override support.
- Optional start/end dates on tasks and subtasks.
- Progress controls via slider and manual numeric input.
- Gradient progress visualization (red -> yellow -> green).
- Collapsible nested subtasks with indentation and shaded sections.
- Delete confirmation dialog and cascading delete behavior.

## Setup

1. Install dependencies:
   - `npm install`
2. Configure local SQLite DB path (optional):
   - Default: `backend/data/tasks.sqlite`
   - Override with env var: `SQLITE_DB_PATH`
3. Run migrations and seed data:
   - `npm run db:migrate`
   - `npm run db:seed`
4. Start the Electron app:
   - `npm start`

## Quality Tooling

- Lint: `npm run lint`
- Format: `npm run format`
- Tests: `npm test`
- Electron build: `npm run build:electron`

## CI/CD

GitHub Actions workflow at `.github/workflows/ci.yml` runs:

- Lint checks
- Test suite
- Electron build step
- Artifact packaging/upload

## AI Memory Layer

The project includes persistent AI/contributor guidance files:

- `write.cursor/rules` - prompt interpretation, naming, structure, and memory update policy.
- `CLAUDE.md` - architecture, patterns, best practices, and contributor workflow.
- `.cursor/rules/always.mdc` - mandatory coding and architecture conventions.
- `.cursor/rules/auto.mdc` - auto-applied formatting/linting/testing guidance.
- `write.cursor/instruction-budget.md` - bounded instruction playbook (~150 lines).
- `write.cursor/gold-standard-references.md` - canonical files for tests, CI, schema, and implementation patterns.

Recommended usage for future prompts:

1. Start with `write.cursor/rules` and `CLAUDE.md`.
2. Follow `.cursor/rules/always.mdc` and `.cursor/rules/auto.mdc`.
3. Use `write.cursor/gold-standard-references.md` before implementing new features.