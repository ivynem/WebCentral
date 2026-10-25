# ForgeDesk Modules

**Status:** Proposed logical modules. The repository inventory found no implemented modules or application code.

## Boundary rules

- A module owns its domain rules and data writes.
- Shared platform services provide identity, authorization, business context, audit, configuration, and operational primitives.
- Cross-module interaction uses explicit application services or documented query contracts, not direct hidden writes into another module's data.
- Modules declare dependencies, capabilities, permissions, and migrations. Activation is denied when prerequisites are missing.
- Module boundaries do not imply separately deployed services. The initial architecture is a modular monolith.
- Third-party executable plugins and a marketplace are deferred.

## Proposed module map

| Module                         | Initial scope                                                                                                      | Data ownership and dependencies                                                                                | Roadmap                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Platform Core                  | Configuration, health, request context, audit, module registry                                                     | Shared platform metadata; no business data ownership                                                           | Foundation                     |
| Identity and Access            | Accounts, sessions, platform roles, business memberships, permission decisions                                     | Owns identity/access records; supplies trusted principal and business context                                  | Foundation before private data |
| Developer Portal               | Projects, environments, diagnostics, safe configuration view, deployment links                                     | Owns portal presentation/workflows; depends on core, access, deployment adapter                                | MVP candidate                  |
| Platform Administration        | Account/module administration, audit visibility, operational controls                                              | Depends on identity/access and core audit; sensitive actions are permission-checked                            | Early MVP                      |
| Business Back Office           | Businesses, staff membership, customers, suppliers, products/services, inventory, orders, sales, invoices, reports | Business-owned records require business context; depends on identity/access                                    | Later core                     |
| Customer Portal and Storefront | Public business pages/catalogs, customer accounts, inquiries, supported order journey                              | Public projection separated from private back-office records; depends on business data and access              | Later                          |
| Social and Communications      | Posts, promotions, inquiries/inbox, notifications, moderation                                                      | Promotions reference business/product IDs through contracts; depends on business identity and moderation rules | Later                          |
| Farm Management                | Fields, crops/livestock, tasks, inputs, harvests, farm reports                                                     | Owns farm-specific records; links to shared business identity, staff, and inventory by contract                | Optional                       |
| Delivery and Bookings          | Availability, scheduling, delivery status                                                                          | Owns scheduling/status; links to orders/business through contracts                                             | Optional                       |
| Payments                       | Provider-neutral payment intent/status/refund contracts                                                            | Payment credentials held by provider adapter; avoid storing card secrets                                       | Optional, later                |
| Documents and Reporting        | Authorized exports, invoices, summaries, controlled storage                                                        | Respects source-module ownership and retention policy                                                          | Optional                       |
| Deployment Integrations        | Build/deploy provider adapters, status, logs, rollback capabilities                                                | Provider credentials server-side; Developer Portal consumes safe status contracts                              | Later                          |

## Shared contracts

A future module contract should define:

- Stable module ID and version.
- Declared dependencies and compatible versions.
- Capabilities, routes/events, and required permissions.
- Owned entities and migration identifiers.
- Activation/health checks and failure behavior.
- Events or commands emitted/consumed, with versioning and idempotency where applicable.

No concrete module registry format or runtime loader is selected yet. The first implementation should validate one small example before generalizing the contract.
