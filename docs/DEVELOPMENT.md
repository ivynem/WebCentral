# Development Baseline

This document records the initial Stage 2 tooling baseline. It does not select the first user-facing application or framework.

## Runtime and package manager

- Use Node.js 24.22.1 (LTS), pinned in `.nvmrc`. The package engine range accepts Node 24 only.
- Use npm 11 for this single-package repository. The package engine range accepts npm 11.
- Use TypeScript in strict mode for new application and backend code. TypeScript 5.9.3 is pinned because the selected TypeScript ESLint integration documents support through TypeScript <6.1. Preserve any existing HTML/CSS/JavaScript if later discovered.
- Tool versions are exact in `package.json`. Generate and commit `package-lock.json` before relying on `npm ci` for fresh checkouts or CI.

## Commands

After installing dependencies:

- `npm run build` — compile TypeScript into `dist/`.
- `npm run typecheck` — run the compiler without emitting files.
- `npm run lint` — run ESLint.
- `npm run format` — apply Prettier formatting.
- `npm run format:check` — check formatting without changing files.
- `npm run test` — run Vitest; an empty initial suite is allowed while test coverage is introduced with implementation work.
- `npm run check` — run format, lint, type-check, and test checks.

## Current limitations and next steps

No UI framework, API framework, workspace/monorepo tool, database client, or deployment provider is selected. Choose those after the first application milestone and relevant requirements are reviewed. Add dependencies only when needed, commit the generated lockfile, verify all commands in a fresh checkout, then document the results. No checks have been run in this session.
