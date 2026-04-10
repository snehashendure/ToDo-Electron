# Instruction Budget (~150 Lines)

## 1) Project Setup
1. Use Node 20+ and npm.
2. Install with `npm install`.
3. Run migrations before feature testing.
4. Run seeds for deterministic local data.
5. Start with `npm start` for Electron.
6. Use `npm run backend:start` for backend-only checks.
7. Keep local DB path explicit when needed (`SQLITE_DB_PATH`).
8. Validate startup logs for backend + DB mode.
9. Do not skip setup verification when changing persistence code.
10. Keep environment assumptions documented in `README.md`.
11. Prefer local reproducibility over hidden machine-specific config.
12. Treat migration scripts as source of truth for schema.
13. Seed scripts should be safe to rerun locally.
14. Keep startup failures actionable with clear errors.
15. If setup commands change, update docs in the same change.
16. Keep platform-specific notes concise and test-backed.
17. Use relative paths in scripts where practical.
18. Keep DB files under `backend/data` unless overridden.
19. Ensure foreign key support is enabled for SQLite.
20. Confirm schema is up-to-date before debugging app behavior.
21. Add setup troubleshooting notes for frequent errors.
22. Keep commands copy-paste friendly.
23. Prefer one canonical setup path in docs.
24. Avoid introducing extra runtime services unless requested.
25. Keep project bootstrap simple for new contributors.

## 2) Stack Definition
26. Frontend shell is Electron.
27. Frontend interaction code lives in `frontend/renderer.js`.
28. Backend uses Express.
29. API routes live in `backend/src/routes`.
30. Business rules live in `backend/src/services`.
31. Persistence logic lives in `backend/src/repositories`.
32. DB helper logic lives in `backend/src/db`.
33. Shared contracts go to `shared/`.
34. Keep stack choices documented in `CLAUDE.md`.
35. Support local SQLite by default.
36. Support PostgreSQL as optional local dev alternative.
37. Keep API stable unless versioning or explicit request says otherwise.
38. Prefer service-level orchestration for multi-step domain rules.
39. Keep renderer framework-agnostic unless React adoption is explicit.
40. Keep build system aligned with Electron entry points.
41. Keep package scripts focused and explicit.
42. Avoid hidden coupling between frontend and repository internals.
43. Treat API responses as frontend contract.
44. Keep DB column naming snake_case.
45. Keep JS identifiers camelCase.
46. Keep class names PascalCase.
47. Keep module boundaries clear and documented.
48. Prefer adapters instead of rewiring architecture for one-off changes.
49. Reuse existing patterns before inventing new ones.
50. Reference gold standard files before implementing new modules.

## 3) Coding Conventions
51. Keep functions small and named by intent.
52. Routes should validate inputs and map status codes.
53. Services should own task/subtask completion rules.
54. Repositories should only read/write data.
55. Do not place SQL strings inside route files.
56. Use explicit async error handling.
57. Avoid swallowing errors.
58. Show user-visible status for frontend failures.
59. Keep DOM updates predictable and centralized.
60. Use consistent button/action naming across renderer code.
61. Confirm destructive actions (delete) in UI.
62. Keep progress/completion logic deterministic.
63. Manual override behavior must be test-covered.
64. Cascade delete behavior must be test-covered.
65. Keep migration filenames ordered and descriptive.
66. Seed files should mirror realistic UI scenarios.
67. Avoid dead code and unused exports.
68. Keep lint warnings/errors at zero.
69. Keep formatting deterministic via Prettier.
70. Prefer explicit payload shapes over ad-hoc objects.
71. Keep naming consistent across API, service, and DB layers.
72. Avoid long nested conditionals; extract helper logic.
73. Update comments only when they add domain context.
74. Do not duplicate business rules across frontend and backend.
75. Keep code changes minimal but complete.

## 4) Testing And CI/CD
76. Use Jest as primary test runner.
77. Use Supertest for API integration tests.
78. Add tests for new endpoints.
79. Add tests for edge cases in completion logic.
80. Add persistence tests when repository or DB behavior changes.
81. Keep tests isolated from developer machine state.
82. Use temporary DB files for integration tests when needed.
83. Ensure tests are deterministic and repeatable.
84. Run `npm run lint` before `npm test`.
85. Keep CI running lint, tests, and build.
86. Keep CI workflow in `.github/workflows/ci.yml`.
87. Keep CI environment variables explicit.
88. Ensure migration and seed run in CI where relevant.
89. Upload build artifacts in CI for traceability.
90. Do not merge behavior changes without test coverage.
91. Keep test names descriptive.
92. Prefer testing behavior over implementation internals.
93. Include regression tests when fixing bugs.
94. Keep CI updates synchronized with script name changes.
95. Re-run lint/tests after any follow-up fixes.
96. Track known platform-specific build limitations in docs.
97. Keep workflow steps readable and ordered.
98. Keep failures actionable through clear command output.
99. Verify local and CI commands are aligned.
100. Use existing test style as baseline.

## 5) AI Memory Integration
101. Use `write.cursor/rules` as entry memory contract.
102. Use `CLAUDE.md` for architecture and pattern memory.
103. Use `.cursor/rules/always.mdc` for mandatory behavior.
104. Use `.cursor/rules/auto.mdc` for file-triggered guardrails.
105. Update memory files when project conventions change.
106. Record stable implementation references in gold-standard file.
107. Keep memory artifacts concise and high signal.
108. Prefer updating existing memory docs over creating duplicates.
109. Add rationale for non-obvious architectural decisions.
110. Document intended extension points in services/repositories.
111. Keep prompts grounded in existing conventions.
112. Resolve ambiguous requests using architecture-first defaults.
113. Log notable migrations in docs when schema evolves.
114. Keep memory files versioned with code changes.
115. Include examples of good and bad patterns in `CLAUDE.md`.
116. Keep memory updates in same PR as behavior changes.
117. Avoid stale references to removed files.
118. Add cross-links among memory files.
119. Ensure memory files are readable by humans and AI.
120. Validate that memory guidance remains actionable.
121. Avoid conflicting rules across memory files.
122. Keep instructions scoped to this repository.
123. Use imperative, concise instruction wording.
124. Prefer explicit file paths in instructions.
125. Treat memory docs as living architecture contract.

## 6) Reference Linking
126. Link canonical tests in `write.cursor/gold-standard-references.md`.
127. Link canonical CI workflow in references file.
128. Link lint and prettier config in references file.
129. Link DB migrations and seeds in references file.
130. Link key service and repository files in references file.
131. Use reference links before implementing similar functionality.
132. Copy proven patterns, then adapt minimally.
133. Prefer references from current code over external examples.
134. Keep references short and categorized.
135. Include "when to use" guidance for each reference.
136. Update references when canonical files change.
137. Remove references to deprecated patterns.
138. Keep examples aligned with actual code style.
139. Use references to reduce architectural drift.
140. Ensure linked files exist and are maintained.
141. Avoid redundant links across sections.
142. Keep reference examples practical and repeatable.
143. Include endpoint, service, and test examples.
144. Include migration and schema examples.
145. Include UI interaction examples.
146. Include error-handling examples.
147. Include persistence and delete-cascade examples.
148. Include mark-complete behavior references.
149. Keep this budget near 150 lines; revise only with intent.
150. Treat this file as bounded operating instructions for future prompts.
