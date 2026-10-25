# WebCentral — ForgeDesk Platform

WebCentral is the repository for **ForgeDesk**, a modular platform for building, testing, managing, and deploying websites and business applications from one place.

> **Build rule:** inspect the repository before changing files. Preserve working code, make small reviewable changes, and mark work complete only after its acceptance criteria have been verified. Planned features are not implemented features.

## Vision and application areas

- **Developer Portal:** projects, modules, configuration, diagnostics, logs, testing, and deployment history.
- **Platform Admin:** users, roles, permissions, apps, settings, audit records, health, backups, and restore.
- **Business Back Office:** businesses, staff, customers, products/services, suppliers, inventory, orders, sales, invoices, and reports.
- **Customer Portal and Storefronts:** public business pages, catalogs, customer accounts, inquiries, and order journeys.
- **Social & Communications:** posts, announcements, promotions, customer inquiries, notifications, and moderation.
- **Optional modules:** farm management, delivery, bookings, payments, and other business features.

Farm and e-commerce modules should share business identity and back-office data. Social promotions should link to relevant businesses or products. The visual/web builder is deferred until the core platform is stable.

## Technical direction

- Use **TypeScript** for new application and backend code.
- Preserve existing HTML/CSS/JavaScript in the Developer Portal unless a deliberate migration is approved.
- Use React + TypeScript for later interfaces when appropriate.
- Start with a **modular monolith**, not microservices.
- Use PostgreSQL for hosted environments. Evaluate SQLite for local/offline use behind a tested adapter; do not assume compatibility without tests.
- Use Vercel for compatible frontends/server functions. Long-running services or workers may need another host.
- Neon PostgreSQL is a candidate for development, preview, and production, with data and credentials isolated per environment.
- Use Docker Compose where useful, pinned versions, lockfiles, reproducible scripts, and offline image caching where practical.
- Keep secrets server-side; never commit credentials or expose them in browser code.

These are planned technical choices, not a claim that integrations are already configured.

---

# Development roadmap

Work through stages in dependency order. Stages may overlap only when their prerequisites are satisfied.

**Waterfall delivery rule:** complete requirements and acceptance criteria for a phase, then deliver its working feature together with its finished user-facing UI and verify the integrated path before advancing. Do not defer UI to a later, separate pass. For platform groundwork that has no end-user screen, provide a useful project/developer UI as the visible deliverable. The visual website builder remains a separate deferred product capability.

## Stage 0 — Repository inspection and rules

- [x] Inspect files, branches, commit history, and existing applications.
- [x] Record what works, what is planned, and any technical debt.
- [x] Confirm ForgeDesk as the product name and WebCentral as the repository.
- [x] Define branch, commit, review, and file-preservation rules.
      **Done when:** the real starting state is documented and the first implementation task is evidence-based.

**Recorded baseline:** [`docs/ROADMAP.md`](docs/ROADMAP.md) records the inspected tree, branches, commits, and merged roadmap PR. The inspected `main` tree contained only this README; no application/runtime checks were available.

## Stage 1 — Requirements and architecture

- [x] Write `docs/PROJECT_SPECIFICATION.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/MODULES.md`, and `docs/DEPLOYMENT.md`.
- [x] Define proposed users, access boundaries, data ownership, module/API conventions, errors, and deployment candidates.
- [x] Classify features as MVP, later, or deferred; keep the visual builder deferred.
- [x] Document privacy, security, backups, accessibility, and low-resource/offline requirements.
- [ ] Review MVP scope and architecture decisions before implementation.
      **Done when:** MVP scope, boundaries, and acceptance criteria are reviewed.

**Review:** these documents are proposed in [PR #2](https://github.com/ivynem/WebCentral/pull/2), which remains open and unmerged.

## Stage 2 — Development environment and quality baseline

- [x] Inspect the empty application/tooling baseline; record verified files and existing commands.
- [x] Select a single-package npm setup and pin Node.js 24.22.1 LTS.
- [x] Add strict TypeScript, ESLint, Prettier, type-check, build, and test-check configuration.
- [x] Add initial ignores for dependencies, generated output, and environment secrets.
- [x] Document the available setup and check commands in [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).
- [ ] Generate and commit `package-lock.json`.
- [ ] Install dependencies and verify the commands from a fresh checkout under the pinned Node.js version.
- [ ] Add `.env.example` if the first feature requires configuration; add Docker only when needed.
      **Done when:** a fresh checkout can install reproducibly and pass the available checks.

**Current Stage 2 status:** setup files are proposed in [PR #3](https://github.com/ivynem/WebCentral/pull/3), stacked on PR #2. A lockfile is generated and formatting, lint, type-check, build, and unit checks pass on Node.js 26.12.1/npm 11.20.0. Node 26 is outside the pinned Node.js 24 range, so repeat these checks under Node 24 before Stage 2 is complete.

## Stage 3 — First deployable application

- [ ] Choose a minimal first app, such as the Developer Portal or a landing/health page.
- [ ] Document development and build commands.
- [ ] Connect GitHub to Vercel and configure the correct root and build settings.
- [ ] Set up preview deployments and production deployment from `main`.
- [ ] Verify the deployment and document logs and rollback.
      **Done when:** a working app can be tested from a preview URL.

**First UI slice:** the ForgeDesk progress dashboard is served alongside `api/health.ts` in Vercel and from `src/server.ts` in Docker Compose. It tracks the current phase, delivery steps, Vercel failure, and live database health. Each phase now includes its finished UI before that phase is considered delivered. The Compose app returned `200 OK` after a real `SELECT 1` against local PostgreSQL; Vercel deployment remains unverified until the new preview succeeds.

## Stage 4 — Environments and database

- [ ] Choose a database client/ORM after reviewing requirements.
- [ ] Define data-access boundaries and migrations.
- [ ] Connect the requested Neon PostgreSQL production branch and provision selected services.
- [ ] Isolate local, preview, and production data and credentials.
- [ ] Add migrations, development seed data, safe fixtures, and connection health checks.
- [ ] Document backup and restore; evaluate SQLite separately if local mode is required.
- [ ] Never run destructive tests or unreviewed migrations against production.
      **Done when:** migrations, seed data, and integration tests work against isolated development data.

**Database connection slice (2026-10-25):** implemented a server-only PostgreSQL `SELECT 1` health check using `pg`, a bounded pool, and sanitized `200`/`503` responses. `compose.yaml` supplies a local PostgreSQL service for Windows Docker Desktop. The Docker image built successfully and a live local Compose request returned `200 OK` with `database: connected`. Vercel must receive the Neon pooled `DATABASE_URL` through its server-side environment settings; the hosted preview request remains unverified. See [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

## Stage 5 — Shared application foundation

- [ ] Define shared TypeScript types and validation schemas.
- [ ] Establish API routing, request validation, consistent errors, logging, and configuration.
- [ ] Build a module registry with metadata, dependencies, and enable/disable rules.
- [ ] Define shared API-client and UI-package boundaries.
- [ ] Establish database, transaction, and error-handling patterns.
- [ ] Add unit and integration-test foundations.
      **Done when:** a sample module can register, validate input, use shared services, and pass checks.

## Stage 6 — Identity, access, and tenancy

- [ ] Implement required registration/invitation, login, logout, sessions, and expiry.
- [ ] Use reviewed password hashing and secure cookie/session settings.
- [ ] Enforce server-side roles for platform admins, developers, business staff, and customers.
- [ ] Enforce business/tenant ownership on every relevant read and write.
- [ ] Add rate limits, validation, audit events, and security logging for sensitive actions.
- [ ] Plan account recovery, verification, and MFA according to scope and risk.
- [ ] Test unauthorized, cross-tenant, expired-session, and privilege-escalation cases.
      **Done when:** backend authorization is enforced and tests demonstrate private data separation.

## Stage 7 — Developer Portal MVP

- [ ] Provide appropriate Developer, Admin, and User access paths.
- [ ] Show projects/modules, environment status, recent events, and useful actions.
- [ ] Add diagnostics, health, safe configuration visibility, and deployment links.
- [ ] Redact secrets from logs; connect controls to real endpoints.
- [ ] Include loading, empty, validation, error, and denied-access states.
      **Done when:** an authorized developer can inspect a real test environment.

## Stage 8 — Platform Admin MVP

- [ ] Manage users, account status, roles, permissions, apps, and modules.
- [ ] View audit events, service health, and deployment status.
- [ ] Add backup status and controlled restore workflows.
- [ ] Protect high-impact actions with authorization and confirmation.
      **Done when:** an admin can manage test users/modules with traceable permission-checked actions.

## Stage 9 — Business Back Office

- [ ] Add business profiles, staff memberships, customers, suppliers, products/services, and settings.
- [ ] Add inventory, orders, sales, invoices/receipts, and basic reports incrementally.
- [ ] Enforce business ownership on all records.
- [ ] Add validated, authorized import/export when required.
- [ ] Reuse shared business logic in storefronts.
      **Done when:** a test business can manage its own records without accessing another business's data.

## Stage 10 — Customer Portal and Storefront MVP

- [ ] Build the customer UI with React + TypeScript when API boundaries are ready.
- [ ] Add public pages, catalogs, details, and contact/inquiry flows.
- [ ] Protect customer accounts and personal data.
- [ ] Connect availability and orders to back-office records.
- [ ] Check responsiveness, accessibility, metadata, and performance.
- [ ] Put payment integrations behind an adapter and use test mode first.
      **Done when:** a customer can complete a supported non-production browse/inquiry/order journey.

## Stage 11 — Social & Communications MVP

- [ ] Add business posts and announcements.
- [ ] Add comments/reactions only within agreed scope and moderation rules.
- [ ] Link promotions to businesses/products.
- [ ] Add customer inquiries and a business inbox.
- [ ] Add in-app notifications and optional email adapters.
- [ ] Add report/block/moderation controls and abuse protection.
- [ ] Defer live streaming, complex recommendations, and a paid-ad marketplace.
      **Done when:** a business can publish a promotion, a customer can view it and inquire, and the business can respond safely.

## Stage 12 — Optional business modules

- [ ] **Farm management:** fields, crops, livestock, tasks, inputs, harvests, staff, and reports.
- [ ] **Inventory/purchasing:** stock movements, suppliers, reorder information, and reports.
- [ ] **Delivery/bookings:** delivery status, scheduling, and availability.
- [ ] **Payments:** provider adapters, payment status, refunds, and reconciliation where supported.
- [ ] **Documents/reports:** exports, invoices, summaries, and controlled storage.
      **Done when:** each module has scope, permissions, migrations, tests, and defined links to shared records.

## Stage 13 — Hosting and integration adapters

- [ ] Define a deployment-provider interface and capability matrix.
- [ ] Start with GitHub + Vercel for compatible frontends and supported functions.
- [ ] Document a separate host for long-running APIs/workers when required.
- [ ] Add providers one at a time with auth, secrets, build types, limits, and rollback documented.
- [ ] Document domains/TLS; keep credentials out of browser code.
- [ ] Add deployment history, status, logs, failure reporting, safe retries, and webhook verification where relevant.
- [ ] Test deployment and rollback on non-production projects first.
      **Done when:** at least one deployment path is repeatable and unsupported providers are clearly identified.

## Stage 14 — Reliability, security, and release readiness

- [ ] Cover critical flows with unit, integration, end-to-end, and security tests.
- [ ] Run lint/format checks, type-checking, tests, and production builds in CI.
- [ ] Enable dependency/secret scanning where available.
- [ ] Review auth, tenant isolation, uploads, rate limits, and error messages.
- [ ] Verify migrations, backups, restore, and rollback.
- [ ] Add health checks, monitoring, and useful operational logs.
- [ ] Test accessibility, responsiveness, and performance on low-resource devices/connections.
- [ ] Document known limitations, data retention, incident handling, and releases.
      **Done when:** critical checks pass and release/rollback procedures are documented.

## Stage 15 — Production launch and maintenance

- [ ] Begin with a limited pilot.
- [ ] Configure production secrets, database access, domains/TLS, backups, and monitoring.
- [ ] Document privacy, support, data export/deletion, and applicable legal requirements.
- [ ] Monitor errors and usage; resolve security/reliability issues before expanding.
- [ ] Use versioned migrations, release notes, tested dependency updates, and rollback plans.
      **Done when:** the pilot has clear ownership, monitoring, recovery steps, and controlled releases.

## Stage 16 — Future capabilities

- [ ] Visual/web builder.
- [ ] Desktop and mobile clients.
- [ ] Third-party plugin marketplace.
- [ ] Additional hosting, storage, email, payment, and analytics providers.
- [ ] Advanced campaigns and offline synchronization after conflict/security design.
      Start these only after the core platform is stable.

---

## Branch and pull-request workflow

- Keep `main` stable, reviewed, and deployable.
- Use short-lived branches such as `docs/project-roadmap` and `feat/database-foundation`; do not create all future branches in advance.
- Pull requests should describe scope, tests, configuration/migration notes, and screenshots/logs when useful.
- Require checks and review before merging. Use preview deployments to test changes.
- Preview environments must use isolated data; never run destructive tests against production.

## Environments and secrets

| Environment | Purpose                 | Data policy                                    |
| ----------- | ----------------------- | ---------------------------------------------- |
| Local       | Developer machine       | Local/development data only                    |
| Preview     | Branch/PR testing       | Isolated test data                             |
| Production  | Real users and services | Protected data, controlled migrations, backups |

Use only environment variables required by the implementation, such as `DATABASE_URL`, `AUTH_SECRET`, or `APP_URL`. Keep local values in ignored environment files and hosted values in provider settings. Never commit real secrets or expose database credentials in frontend/public variables.

## Definition of done

A feature is complete only when:

1. It matches documented scope and preserves existing functionality.
2. Backend authorization and tenant ownership are enforced.
3. Inputs are validated and errors handled consistently.
4. Tests, type-checking, linting, and production build pass.
5. Migrations and configuration changes are documented.
6. Secrets and personal data are not leaked in code, logs, or browser bundles.
7. The UI handles loading, empty, success, and failure states.
8. Documentation and roadmap status are updated.
9. The PR explains how the change was tested.

## Immediate next steps

1. Review the Stage 0 inventory and Stage 1 proposals in PR #2.
2. Complete Stage 2 by generating the npm lockfile and verifying the setup with Node.js 24.
3. Select the first deployable application and UI/API framework after requirements review.
4. Evaluate Vercel for compatible frontend/server functions (Stage 3).
5. Evaluate an isolated Neon development database and local/offline needs (Stage 4).
6. Implement the shared foundation before expanding portals and business modules.

## Current status

Stage 0 inspection and Stage 1 architecture documents are recorded in PR #2. Stage 2 tooling is proposed in PR #3; lockfile and checks are recorded in [docs/ROADMAP.md](docs/ROADMAP.md), with full checks on pinned Node 24 still outstanding. The local PostgreSQL health path is verified. Do not mark Neon/Vercel connectivity complete until a live non-production Vercel health request succeeds.
