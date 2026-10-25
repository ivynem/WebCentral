# ForgeDesk Architecture

**Status:** Proposed target architecture. No application architecture or runtime has been verified in the repository as of the Stage 0 inventory.

## 1. Architectural direction

Use a TypeScript modular monolith as the initial application shape. Modules share one deployable application and common platform services, with explicit boundaries that allow independent evolution. Do not introduce microservices before operational needs justify them.

Preserve existing HTML/CSS/JavaScript if encountered; the inspected repository currently has no application source to migrate. React + TypeScript is a candidate for future interfaces, subject to a later implementation decision.

The first executable slice is a Node.js health endpoint: Vercel's native TypeScript function at `api/health.ts` and a small Node HTTP server for local Compose use share the same health response and database check. PostgreSQL access currently uses the `pg` driver with a bounded pool. This is an initial adapter decision, not an ORM or domain architecture decision.

## 2. Logical layers

1. **Interfaces:** Developer Portal, administration, business UI, customer pages, and API routes. User interfaces are clients, never authorization authorities.
2. **Application services:** use cases, orchestration, authorization checks, validation, transactions, and audit decisions.
3. **Domain modules:** business rules and module-owned data contracts.
4. **Shared platform services:** identity, permissions, tenant context, configuration, logging, audit, clock/IDs, and health.
5. **Adapters:** database, email, payment, storage, hosting/deployment, and external APIs.
6. **Persistence:** PostgreSQL is the hosted target in the README roadmap. Neon is a candidate provider. SQLite is an option to evaluate behind a tested adapter; compatibility is not assumed.

Dependencies point inward: domain logic does not depend on a hosting vendor or UI framework. Integrations are accessed through narrow interfaces, with provider-specific behavior in adapters.

## 3. Module boundaries and data ownership

Each module owns its domain rules and writes to its own data area through application services. Cross-module reads use documented query interfaces or shared read models. Cross-module writes use application-level commands and transaction boundaries; modules must not silently modify another module's tables.

Shared identity identifies people and platform roles. Business memberships connect people to businesses and carry business-scoped roles. Business-owned records include a business identifier and enforce ownership at every read and write. Public storefront content is explicitly distinguished from private operational data.

Module metadata should include a stable identifier, version, description, dependencies, capabilities, permissions, routes or entry points, and migration requirements. Activation must fail safely when dependencies or required migrations are missing. Runtime loading of arbitrary third-party code is out of scope.

## 4. Security and request flow

For every protected request: authenticate the caller, derive tenant/business context from trusted server-side state, authorize the requested action against that context, validate input, invoke the application service, and return a safe response. Never trust a client-supplied business ID as proof of membership.

Use least privilege, secure session/cookie settings appropriate to the chosen auth design, rate limits for abuse-prone operations, and audit events for high-impact actions. Redact secrets and personal data from operational logs. Handle unknown errors without returning stack traces or internal identifiers.

## 5. API and error conventions

The API style and transport are not selected. When routes are introduced:

- Version public contracts when breaking changes are possible.
- Validate request bodies, query values, identifiers, and uploaded data at boundaries.
- Use a consistent success envelope where useful and a consistent error object with a stable code, safe message, and request/correlation ID.
- Distinguish authentication, authorization, validation, conflict, missing-resource, rate-limit, and unexpected failures.
- Avoid exposing private existence or database details in errors.
- Document pagination, filtering, sorting, idempotency, and retry behavior for endpoints that need them.

## 6. Persistence and migrations

PostgreSQL is the hosted database direction in the roadmap. A specific database client or ORM remains undecided. Keep persistence behind repositories/adapters where this materially improves testing and provider evaluation, without adding abstraction for its own sake.

Use versioned, reviewable migrations. Migrations must be forward-safe where feasible and tested against isolated non-production data. Production changes require a backup and recovery plan. SQLite/local mode requires its own adapter and compatibility tests before it is described as supported.

## 7. Low-resource and offline design

Prefer server-rendered or lightweight interfaces where they reduce client cost; choose the UI approach after inspecting the first use case. Keep bundles and requests small, paginate large datasets, avoid unnecessary polling, and provide clear progress and retry states.

Network loss should not corrupt server state or duplicate commands. Initial offline behavior may be limited to cached public/read-only information. Queued writes and synchronization are deferred until conflict resolution, encryption/privacy, expiry, and duplicate handling are designed and tested.

## 8. Observability and operations

Use structured logs with request IDs and redaction; expose health checks that reveal service readiness without credentials or personal data. Add metrics/tracing only with a clear operational need. Audit records are distinct from diagnostic logs and require a retention/access policy.

## 9. Architecture decisions still open

Database client/ORM, authentication/session implementation, API transport, UI framework for the first app, monorepo/workspace tooling, job/worker design, and offline persistence remain proposals pending Stage 2–4 investigation. Vercel and Neon are candidates, not configured services.
