# CLAUDE.md

## Project Snapshot

ToDo-Electron is a local-first task management application:

- Frontend: Electron + modern JavaScript renderer (`frontend/`)
- Backend: Node.js + Express (`backend/src/`)
- Database: SQLite for lightweight local persistence, PostgreSQL as supported alternative for local dev workflows
- Testing: Jest + Supertest
- Code quality: ESLint + Prettier
- CI/CD: GitHub Actions (`.github/workflows/ci.yml`)

## Architecture And Patterns

### Backend (MVC-inspired)

- **Routes** (`backend/src/routes`): HTTP endpoints and status mapping.
- **Services** (`backend/src/services`): task domain rules (progress, completion, nesting rules).
- **Repositories** (`backend/src/repositories`): DB persistence adapters.
- **DB utilities** (`backend/src/db`): connection + migration/seed execution.

### Frontend (Component-style composition without framework lock-in)

- `frontend/renderer.js`: render tree + event handlers for task cards and controls.
- `frontend/styles.css`: centralized, modern, responsive styling.
- `frontend/index.html`: structure and interaction anchors.

### Shared Contracts

- `shared/`: common task payload normalization and shape conventions.

## Conventions

- JavaScript naming: camelCase.
- Class naming: PascalCase.
- Database naming: snake_case.
- Separation of concerns:
  - No SQL in route files.
  - No business rules in repository files.
  - No backend logic in frontend renderer modules.

## Best Practices

1. Add behavior in service first, then expose it via route.
2. Keep route handlers thin and explicit about status codes.
3. Add/adjust integration tests for API behavior changes.
4. Update migrations and seeds when schema or expected fixtures change.
5. Keep UI state updates optimistic but recoverable with explicit error messages.

Example (good):

- Add `markCompleted` logic in `taskService`.
- Expose route `POST /api/tasks/:id/complete`.
- Add integration tests for override and cascade behavior.

## Anti-Patterns

- Large route handlers with domain logic.
- Direct DOM manipulation spread across multiple files without a rendering contract.
- Silent failure paths where fetch errors are ignored.
- Schema changes without migration + test updates.
- Creating new conventions that conflict with existing lint and test setup.

## Contributor/Assistant Workflow

1. Read `write.cursor/rules` and `.cursor/rules/*.mdc`.
2. Use `write.cursor/gold-standard-references.md` to find canonical examples.
3. Implement smallest coherent change.
4. Run:
   - `npm run lint`
   - `npm test`
5. If persistence/schema changed:
   - `npm run db:migrate`
   - `npm run db:seed`
6. Update docs if behavior, commands, or architecture changed.

## Local Commands

- Start app: `npm start`
- Backend only: `npm run backend:start`
- Migrate DB: `npm run db:migrate`
- Seed DB: `npm run db:seed`
- Lint: `npm run lint`
- Test: `npm test`
- Build Electron: `npm run build:electron`
