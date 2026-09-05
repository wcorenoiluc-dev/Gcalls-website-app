# Gcalls CX — candidate comparison & selection

Two candidates existed for `/gcalls-cx/`. Owner decision: **real-media**.

- `736ef8f` — diagrams-only (preserved as branch `rollback/gcalls-cx-diagrams`).
- `dae633d` — real sanitized media (branch `recovery/gcalls-cx-real-media`; `feature/gcalls-cx-ui-v2` fast-forwarded to it).

| Section | 736ef8f visual | real-media visual | Selected | Reason |
|---|---|---|---|---|
| Hero | `InboxDiagram` (neutral) | **`CxProductStage`** — 3 real surfaces (channel rail / ticket / call) | real-media | Owner: real three-surface hero; genuine product evidence |
| Overview / channels | `CustomerContextDiagram` | **`cx-omnichannel-activity`** crop (screenshot) | real-media | Owner: real omnichannel crop preserving channel/activity context |
| Ticket / workflow | `TicketDiagram` | **`cx-ticket-full`** crop (screenshot) | real-media | Owner: real ticket capture is the primary evidence image |
| Operational workflow (call) | — (none) | **`cx-call-info`** crop, shown as the hero "Cuộc gọi" surface | real-media | Owner: real call-workflow capture; clean empty call form preserved (no dedicated section exists, so it lives in the hero stage) |
| Omnichannel Inbox | `InboxDiagram` | **`InboxDiagram`** (neutral) | diagram | No distinct clean crop survives that isn't a repeat of the hero/overview crops → honest channel diagram |
| Customer context | `CustomerContextDiagram` | **`CustomerContextDiagram`** (neutral) | diagram | `CUSTOMER_360_SOURCE_REQUIRED` — source too PII-dense; neutral relationship diagram, no names/IDs |
| Reporting | `ReportingDiagram` | **`ReportingDiagram`** (neutral) | diagram | `ANALYTICS_SOURCE_REQUIRED` — dashboards are fabricated KPIs; neutral diagram, no invented bars |

## No duplicate / competing media
- Each section renders exactly one visual — no section shows both a diagram and a screenshot.
- The now-unused `TicketDiagram` was **removed** from `visuals.tsx` (tickets use the real capture). `InboxDiagram`, `CustomerContextDiagram`, `ReportingDiagram` each remain in use.
- Shipped media = only the 5 sanitized `.webp` crops under `public/images/products/gcalls-cx/`. No raw ZIP, preview, or OCR artifacts are committed (`.gitignore` enforces this).

## Branch topology (nothing erased)
```
rollback/gcalls-cx-diagrams   736ef8f   (diagrams-only, rollback/reference)
recovery/gcalls-cx-real-media dae633d…  (real-media checkpoint)
feature/gcalls-cx-ui-v2       dae633d…  (fast-forwarded to real-media; 736ef8f is its parent)
```
