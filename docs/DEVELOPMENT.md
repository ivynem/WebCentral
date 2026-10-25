# Development Baseline

This document records the Stage 2 tooling baseline and the first database health-check implementation.

## Runtime and package manager

- Use Node.js 24.22.1 (LTS), pinned in `.nvmrc`. The package engine range accepts Node 24 only.
- Use npm 11 for this single-package repository. The package engine range accepts npm 11.
- Use TypeScript in strict mode for new application and backend code. TypeScript 5.9.3 is pinned because the selected TypeScript ESLint integration documents support through TypeScript <6.1. Preserve any existing HTML/CSS/JavaScript if later discovered.
- Tool versions are exact in `package.json`; `package-lock.json` is generated for repeatable `npm ci` installs.
- The first server runtime uses Node's built-in HTTP server locally and Vercel's native TypeScript function under `api/`. It intentionally adds no web framework.
- PostgreSQL access uses the `pg` driver from server-only modules. A small pool is reused within a warm function instance and bounded to two connections. Use Neon's pooled connection string for Vercel environments.

## Commands

After installing dependencies:

- `npm run build` — compile TypeScript into `dist/`.
- `npm run typecheck` — run the compiler without emitting files.
- `npm run lint` — run ESLint.
- `npm run format` — apply Prettier formatting.
- `npm run format:check` — check formatting without changing files.
- `npm run test` — run Vitest; an empty initial suite is allowed while test coverage is introduced with implementation work.
- `npm run check` — run format, lint, type-check, and test checks.
- `npm start` — start the compiled local HTTP server on port 3000 (or `PORT`).

## Database health check

The `GET /api/health` route runs `SELECT 1` against `DATABASE_URL`. It returns `200` when the query succeeds and `503` with a generic error when configuration or connectivity fails; it does not return connection details. `DATABASE_URL` must remain server-side and must not use a `NEXT_PUBLIC_` prefix.

For local Windows development, install Docker Desktop with the Linux container engine, then run:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

Open `http://localhost:3000/api/health`. Compose starts the app and a local PostgreSQL 17 service with a named persistent volume. The sample credentials are only for local development. To test a Neon branch through Compose, replace `DATABASE_URL` in `.env` with that branch's pooled connection string, keep it out of source control, and run `docker compose up --build app`; do not use production credentials for local checks. Stop the services with `docker compose down`; remove local database data only with the explicit `docker compose down --volumes` command.

Vercel should receive its environment-specific `DATABASE_URL` from the Neon integration in Vercel Project Settings. Deploy a preview and request `/api/health` to verify that hosted path. No Vercel deployment or live Neon connection is claimed until that request succeeds against the configured project.

## Verification record (2026-10-25)

- `npm run check` passed on the available Node.js 26.12.1/npm 11.20.0 host: formatting, ESLint, TypeScript type-check, and 2 health response tests. Node 26 is outside the project's allowed Node 24 range.
- `npm run build` passed on the host, and `docker compose build` passed using Node.js 24.22.1 in the image.
- `docker compose up --detach` started PostgreSQL and the app; `curl http://localhost:3000/api/health` returned `200 OK` and `{"status":"ok","database":"connected"}`. `docker compose down` then stopped the containers and retained the named data volume.
- No live Vercel preview/Neon URL was tested. Two moderate npm advisories appeared for the full dependency tree during the image build; runtime-only impact has not been audited.

## Current limitations and next steps

The UI framework remains open. The first database client is `pg`; no ORM or migration system has been selected. Vercel remains the deployment target for the health function, pending a verified preview. Repeat checks in a fresh checkout under Node 24 and run a live Neon check against a non-production branch before calling connectivity complete.
