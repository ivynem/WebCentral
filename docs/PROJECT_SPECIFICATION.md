# ForgeDesk Project Specification

**Repository:** WebCentral  
**Product name:** ForgeDesk  
**Status:** Proposed requirements baseline; no application implementation has been verified.  
**Related documents:** [Architecture](ARCHITECTURE.md), [Roadmap](ROADMAP.md), [Modules](MODULES.md), [Deployment](DEPLOYMENT.md).

## 1. Purpose and scope

ForgeDesk is intended to provide a modular platform for building, testing, managing, and deploying websites and business applications. The repository currently contains a roadmap only; this specification describes target behavior and does not claim that any feature exists.

The first release should establish a secure, usable foundation and a small Developer Portal/admin experience. Detailed business workflows should be delivered incrementally. The visual/web builder is deferred until the core platform is stable.

## 2. Product goals

- Provide one place for authorized developers and platform operators to inspect projects, modules, environments, diagnostics, and deployment status.
- Support business-owned back-office records that can later be reused by storefront and optional business modules.
- Keep modules cohesive while sharing identity, authorization, business identity, audit, and operational services.
- Preserve any existing working code. As of the Stage 0 inspection, no application code was present in the repository.
- Keep the first deployment and development workflow viable for low-resource devices and unreliable or expensive connections.
- Keep provider choices replaceable where practical and label unverified decisions as proposals.

## 3. Users and authorization requirements

The following are planned user classes, not implemented accounts or permissions.

| User class             | Intended scope                                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| Platform administrator | Manage platform accounts, roles, module availability, settings, audit visibility, and operational controls. |
| Developer              | Inspect authorized projects, environments, module configuration, diagnostics, and deployments.              |
| Business owner/staff   | Access records belonging to a business according to assigned permissions.                                   |
| Customer               | Access public business content and their own account, inquiries, or orders.                                 |

Authorization must be checked on the server for every protected action. Role membership alone must not grant access across businesses. A person may hold different roles in different business contexts. Denied requests must not reveal whether another tenant's private records exist.

## 4. MVP and later scope

### Foundation MVP

- Documented application boundaries and development/deployment assumptions.
- A minimal deployable application selected after repository and runtime inspection.
- Server-side identity, role checks, and business/tenant ownership before private business data is exposed.
- Consistent validation, error responses, configuration handling, logging, and audit patterns.
- A minimal Developer Portal or health/landing experience with useful empty, loading, error, and denied-access states.
- Low-resource interface and documented behavior when a network or hosted service is unavailable.

### Later increments

- Platform administration, business back office, customer portal/storefront, social communications, and optional modules are phased as described in [ROADMAP.md](ROADMAP.md).
- Payments, messaging, deployment providers, and storage should use adapters where integration boundaries are stable.
- Offline synchronization is a later capability requiring an explicit conflict, security, and data-retention design.

### Deferred

- Visual/web builder, plugin marketplace, mobile/desktop clients, advanced campaigns, and complex recommendation features.
- No deferred feature should be represented as available before implementation and acceptance checks.

## 5. Functional requirements

1. **Project and environment visibility:** authorized developers can see only projects and environments they are permitted to inspect.
2. **Administration:** privileged operators can manage accounts and module availability through permission-checked, auditable actions.
3. **Business ownership:** every business record has an explicit owner/business context; reads and writes enforce that context.
4. **Module lifecycle:** modules declare identity, version, dependencies, capabilities, and required permissions before activation.
5. **Input and errors:** inputs are validated at system boundaries; clients receive stable error codes and safe messages.
6. **Operations:** health and deployment status provide actionable, non-secret information; logs redact credentials and sensitive personal data.
7. **Data portability:** imports and exports, when introduced, are authorized, validated, and documented.
8. **Recovery:** backup and restore procedures are defined and periodically verified before production data is used.

## 6. Quality and privacy requirements

- TypeScript is the planned language for new application and backend code. Existing HTML/CSS/JavaScript should be preserved unless a deliberate migration is approved.
- Accessibility, responsive layout, and clear interaction states are acceptance requirements, not post-launch polish.
- Favor small payloads, limited client-side work, and graceful degradation for slower devices and connections.
- Offline support should begin with resilient read-only or locally queued workflows only after data consistency and privacy boundaries are designed. It is not a current capability.
- Collect only data needed for a defined feature. Define access, retention, export, correction, and deletion behavior before production use.
- Keep secrets server-side and out of source control, logs, and browser bundles.
- Security-sensitive actions require server authorization, audit events, rate limits as appropriate, and safe failure behavior.
- Establish measurable performance and accessibility budgets during the first deployable application stage; no numeric thresholds have yet been verified or approved.

## 7. Acceptance principles

A feature can be marked complete only when it meets its documented scope, preserves existing behavior, enforces authorization and tenant boundaries, validates input, handles errors, has appropriate automated checks, documents configuration/data changes, and has been reviewed through a pull request. Roadmap status must reflect verified implementation rather than intent.

### Waterfall phase deliverables

For each phase, finish requirements and acceptance criteria first, then deliver the working behavior with its final user-facing UI in the same phase and verify the end-to-end path before advancing. Do not postpone interface implementation to a later phase. Platform groundwork without a direct user screen must include a useful developer/project UI as its visible deliverable. This does not move the separate visual website-builder capability out of its deferred phase.

## 8. Decisions and open questions

- **Proposed:** TypeScript and modular monolith.
- **Candidates, not commitments:** Neon for hosted PostgreSQL and Vercel for compatible frontends/server functions. Long-running workers may require another host.
- **To evaluate:** local database/offline strategy, ORM/client, authentication provider, workspace tooling, first deployable application, and hosting for long-running processes.
- **To define before production:** data retention, applicable privacy/legal obligations, recovery objectives, operational ownership, and support model.
