# ForgeDesk Roadmap

This roadmap records the verified starting point and follows the staged plan in [README.md](../README.md). A checkbox means work has been completed and its evidence is recorded; planned features are not implementation claims.

## Delivery method

Use a sequential waterfall across phases: agree scope and acceptance criteria, implement the phase behavior and its finished UI together, then verify the integrated workflow before starting the next phase. A phase without a direct user screen must end with a useful developer/project UI. Do not defer UI implementation to a later phase; the visual website builder remains separately deferred.

## Stage 0 — Repository inspection and rules

- [x] Inspect repository files, branches, recent commit history, and the existing README roadmap.
- [x] Record actual code and configuration inventory.
- [x] Confirm product name ForgeDesk and repository name WebCentral from the README.
- [x] Record branch and PR state.
- [x] Establish preservation and review rules.

### Stage 0 evidence (inspected 2026-10-25)

- Repository: public `ivynem/WebCentral`; default branch `main`; repository API reports size 0 KB and no language classification.
- Current `main` head: merge commit `116cf6fb9717f511a5b8a515992f6264187bcf90` (PR #1 merge). The visible history has three commits: initial commit `c0cc41be2ccd929114fef7234156090f6b7862ac`, roadmap commit `090b30adb5b10e1d44b3f214412210fbc9062765`, and the merge commit.
- Recursive tree at the inspected head is not truncated and contains exactly one file: `README.md` (14,495 bytes). No application source, package manifest/lockfile, tests, CI workflow, deployment config, or `docs/` files were present. There is therefore no existing runtime behavior or working application to claim as verified.
- Branches observed: `main` at `116cf6f` and `docs/forgedesk-roadmap` at `090b30a`.
- PR #1, “docs: add ForgeDesk development roadmap,” is merged and closed; merged 2026-10-24 into `main`. The open PR list returned no results. It is not currently an open PR.
- The README explicitly sets TypeScript for new code, preservation of existing HTML/CSS/JavaScript, modular monolith, PostgreSQL hosted with SQLite evaluation, Neon/Vercel as candidates, low-resource/offline considerations, and a deferred visual builder.
- Stage 0 is an inventory only. No application checks were available or run; remote repository inspection does not establish local runtime or deployment state.

## Stage 1 — Requirements and architecture

- [x] Add `PROJECT_SPECIFICATION.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `MODULES.md`, and `DEPLOYMENT.md`.
- [x] Define proposed user classes, access boundaries, module/data ownership, API/error conventions, deployment candidates, security, accessibility, privacy, low-resource, and offline requirements.
- [x] Classify initial MVP, later phases, and deferred features; keep the visual builder deferred.
- [ ] Review MVP scope and architecture decisions before implementation.
- [x] Select the first minimal server slice after inspecting the Stage 2 runtime baseline: a Vercel Node function and matching local Node server.

**Stage 1 completion condition:** the five documents are reviewed; open proposals are understood; the MVP boundary and acceptance criteria are agreed before implementation begins.

## Stage 2 — Development environment and quality baseline

- [x] Record the absence of existing runtime, package manager, application files, and quality scripts in the Stage 0 baseline.
- [x] Pin Node.js 24.22.1 LTS and select npm for the current single-package repository.
- [x] Add strict TypeScript, formatting, lint, type-check, build, and test-check scripts.
- [x] Add initial ignore rules for dependencies, generated output, and secrets.
- [x] Generate `package-lock.json` through npm dependency resolution.
- [x] Install the locked dependencies and run formatting, lint, type-check, build, and unit tests.
- [ ] Repeat installation/checks under pinned Node.js 24.22.1 in a fresh checkout.
- [ ] Review whether `.env.example` is needed once the first feature's configuration is known.

**Stage 2 status:** lockfile is generated and project checks pass on the available Node.js 26.12.1/npm 11.20.0 host, but Node 26 is outside the declared runtime range. Re-run under pinned Node.js 24.22.1 before marking Stage 2 complete. See [DEVELOPMENT.md](DEVELOPMENT.md).

## Stage 3 — First deployable application

The first visible slice is a ForgeDesk project progress dashboard, served statically for Vercel and by the local Node HTTP server. Its database card runs `GET /api/health` and shows the real connection result. The Docker image built successfully; the page/assets returned `200 OK`, and its health check passed against local PostgreSQL. Vercel deployment and preview verification remain outstanding.

## Stage 4 — Environments and database

The initial database client is `pg` with a bounded connection pool. `compose.yaml` starts a local PostgreSQL service on Docker Desktop; Vercel should use the Neon integration's server-side pooled `DATABASE_URL`. The health route exercises `SELECT 1` and returns no connection details. The local query path is verified; a live Neon/preview check, migrations, backups, and any SQLite adapter remain outstanding.

## Stages 5–15 — Core platform through production

Follow the stage order in the README: shared foundation; identity/access/tenancy; Developer Portal and platform admin; business back office; customer/storefront; social/communications; optional modules; hosting adapters; reliability/security; and limited production launch. Each stage requires scoped acceptance criteria and a reviewable PR.

## Stage 16 — Deferred capabilities

Visual/web builder, desktop/mobile clients, plugin marketplace, more providers, and advanced campaigns/offline synchronization remain deferred until core platform stability and explicit design work.

## Change policy

Keep branches short-lived and pull requests focused. Inspect existing files before changing them. Preserve working behavior; document proposals as proposals. Do not merge to `main` without approval. Update this roadmap only when evidence supports a status change.
