# ForgeDesk Deployment

**Status:** The first TypeScript health endpoint is implemented for Vercel's native Node.js function runtime and local Docker Compose. `vercel.json` now pins the build command and generated static output directory. The Vercel project settings, Neon environment variables, and live deployment still require verification in the Vercel account.

## 1. Deployment shape

Begin with the smallest application that satisfies the first reviewed milestone. Keep the initial application a modular monolith. Deploy compatible web frontends and supported server functions to a selected host; long-running APIs, scheduled jobs, or workers may require a separate host.

Vercel is a candidate for compatible frontends and server functions, not a configured or verified provider. Neon PostgreSQL is a candidate hosted database, not a provisioned or verified service. Provider selection must account for runtime limits, regional availability, cost, data handling, operational support, and the actual application shape.

## 2. Environments

| Environment | Intended use            | Data and access                                                                      |
| ----------- | ----------------------- | ------------------------------------------------------------------------------------ |
| Local       | Development             | Local/test data; no production credentials by default.                               |
| Preview     | Pull request validation | Isolated non-production database and credentials; never production data.             |
| Production  | Real users              | Restricted credentials, reviewed migrations, backups, monitoring, and rollback plan. |

Each environment must have separate secrets and data. Avoid copying personal production data into previews. Use synthetic fixtures where possible.

## 3. Configuration and secrets

The health function requires `DATABASE_URL`. Configure it in Vercel's Environment Variables for Preview and Production separately, selecting the intended environment for each. Use the pooled connection string copied from the matching Neon branch; keep credentials server-side and do not use a `NEXT_PUBLIC_` prefix. For local Docker development, Compose defaults to its local PostgreSQL service; to override it with a local Neon connection, put `DATABASE_URL` in an ignored `.env` file. `.env.example` contains a non-secret local example.

- Validate required configuration at startup and fail with a safe, actionable message.
- Store local secrets in ignored local environment files and hosted secrets in the provider's secret manager.
- Never commit credentials or expose database/auth secrets through browser-visible variables.
- Restrict production access and rotate credentials after suspected exposure.
- Redact secrets and personal data from logs.

## 4. Database, migration, backup, restore

PostgreSQL is the hosted database direction in the README. Neon is a candidate provider. Choose a database client/ORM after inspecting the application requirements. Keep development, preview, and production isolated.

Migrations must be versioned and reviewed. Test them on disposable or isolated non-production data. Before production migration, define a backup and recovery plan, compatibility window, and rollback/forward-fix approach. Document and periodically verify backup restoration. No backup or restore service is currently configured.

SQLite may be evaluated for local/offline use behind a tested adapter; do not promise portability until migration, constraints, transaction, and query compatibility are tested.

## 5. Build, release, and rollback

The repository provides `npm run build` and `npm start` for the local Node HTTP server. `vercel.json` runs that build and publishes the generated `public/` directory, while Vercel discovers `api/health.ts` as a Node.js function. The build copies the Overview, Roadmap, Connections, and Activity pages plus shared assets into `public/`; TypeScript output remains in `dist/` and is not published as static files. Keep `DATABASE_URL` in Vercel's server-side environment settings; use an isolated Neon preview branch and pooled URL for previews. A successful `/api/health` response is required to confirm deployment connectivity.

For a release: review the change, run the repository's available checks, deploy to an isolated preview, validate critical paths, approve production release, monitor health, and retain a rollback or forward-fix plan. Production deployment from `main` is a roadmap proposal, not a current workflow.

## 6. Low-resource and unreliable-network considerations

Keep the app's initial bundle and requests small, paginate large datasets, avoid unnecessary background polling, and make retries explicit and safe. Provide useful failure states when a hosted dependency is unavailable. Cache public or non-sensitive read-only data only when freshness rules are clear.

Offline write queues and synchronization are not part of the current implementation. Before enabling them, define encryption/privacy, expiry, replay/idempotency, conflict resolution, and user-visible sync status.

## 7. Operational readiness

Before production use, define health/readiness checks, secret-safe logs, monitoring/alerts, ownership, incident response, data retention, support, and recovery objectives. Add only observability and worker infrastructure needed by a reviewed milestone.

## 8. Provider decision record

| Capability             | Current status                                                                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vercel                 | Repository build/output configuration is committed and PR preview deployed successfully. Preview access is protected and the health route has not been checked. |
| Neon PostgreSQL        | `DATABASE_URL` is read server-side by the health function; Preview environment settings and hosted connectivity are not yet verified.                           |
| Other host             | To evaluate if long-running services or worker needs exceed selected host capabilities.                                                                         |
| Local/offline database | SQLite is an evaluation candidate behind a tested adapter; not supported yet.                                                                                   |
| CI/CD                  | No workflow was present at the Stage 0 inspected head.                                                                                                          |
