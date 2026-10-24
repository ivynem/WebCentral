# ForgeDesk Roadmap

This roadmap records the verified starting point and follows the staged plan in [README.md](../README.md). A checkbox means work has been completed and its evidence is recorded; planned features are not implementation claims.

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
- [ ] Resolve remaining decisions only after inspecting the runtime/tooling needs in Stage 2.

**Stage 1 completion condition:** the five documents are reviewed; open proposals are understood; the MVP boundary and acceptance criteria are agreed before implementation begins.

## Stage 2 — Development environment and quality baseline

Inspect the runtime and choose tooling based on the first application milestone. Establish reproducible install, development, type-check, lint, test, and build commands; verify ignore/secrets patterns. Add only the infrastructure needed for that milestone.

## Stage 3 — First deployable application

Select a minimal first application after runtime inspection. Evaluate Vercel for compatible frontend/server functions; verify an isolated preview deployment before production configuration.

## Stage 4 — Environments and database

Choose a client/ORM and data boundaries. Evaluate Neon PostgreSQL for isolated development and preview environments. Evaluate SQLite separately if local/offline data is required. Add migrations and backup/restore procedures only after the choices are validated.

## Stages 5–15 — Core platform through production

Follow the stage order in the README: shared foundation; identity/access/tenancy; Developer Portal and platform admin; business back office; customer/storefront; social/communications; optional modules; hosting adapters; reliability/security; and limited production launch. Each stage requires scoped acceptance criteria and a reviewable PR.

## Stage 16 — Deferred capabilities

Visual/web builder, desktop/mobile clients, plugin marketplace, more providers, and advanced campaigns/offline synchronization remain deferred until core platform stability and explicit design work.

## Change policy

Keep branches short-lived and pull requests focused. Inspect existing files before changing them. Preserve working behavior; document proposals as proposals. Do not merge to `main` without approval. Update this roadmap only when evidence supports a status change.
