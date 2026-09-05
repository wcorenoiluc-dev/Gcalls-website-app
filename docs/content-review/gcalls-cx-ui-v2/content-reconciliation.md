# Gcalls CX UI V2 — Content Reconciliation

Contract: 1 breadcrumb + 19 content components, exactly one H1. Copy is locked in
`src/data/gcallsCx.ts` and was not edited. Every source field is rendered.

| # | Section (component) | Copy source | H-level | Visual |
|--:|---|---|---|---|
| — | Breadcrumb | `Breadcrumb` trail | — | — |
| 01 | Hero (`CxHero`) | `CX_HERO` | **H1** | `InboxDiagram` |
| 02 | Gcalls CX là gì (`CxDirectAnswer`) | `CX_DIRECT_ANSWER` | H2 | — |
| 03 | Bài toán đa kênh (`CxProblems`) | `CX_PROBLEMS` (4 items) | H2+H3 | — |
| 04 | Tổng quan workspace (`CxOverview`) | `CX_OVERVIEW` (9 components) | H2 | `CustomerContextDiagram` |
| 05 | Các kênh (`CxChannels`) | `CX_CHANNELS` (5 channels) | H2+H3 | — (5-card grid) |
| 06 | Omnichannel Inbox (`CxInbox`) | `CX_INBOX` (5 points) | H2 | `InboxDiagram` |
| 07 | Ticket & workflow (`CxTickets`) | `CX_TICKETS` (5 points) | H2 | `TicketDiagram` |
| 08 | Customer Context (`CxCustomerContext`) | `CX_CONTEXT` (6 points) | H2 | `CustomerContextDiagram` |
| 09 | Quy trình vận hành (`CxHowItWorks`) | `CX_HOW_IT_WORKS` (5 steps) | H2+H3 | — (process) |
| 10 | Reporting (`CxReporting`) | `CX_REPORTING` (4 points) | H2 | `ReportingDiagram` |
| 11 | Lợi ích (`CxBenefits`) | `CX_BENEFITS` (4 items) | H2+H3 | — (cards) |
| 12 | Use cases (`CxUseCases`) | `CX_USE_CASES` (4 items) | H2+H3 | — (cards) |
| 13 | Tích hợp (`CxIntegration`) | `CX_INTEGRATION` | H2 | — (centered CTA) |
| 14 | Phạm vi sản phẩm (`CxBoundaries`) | `CX_BOUNDARIES` (5 items) | H2 | — (comparison cards) |
| 15 | Triển khai (`CxDeployment`) | `CX_DEPLOYMENT` (7 steps) | H2+H3 | — (process) |
| 16 | Trust/proof (`CxTrust`) | `CX_TRUST` | H2 | — (neutral, no logos/quotes) |
| 17 | Chi phí/cấu hình (`PricingCtaBand`) | `CX_PRICING` | H2 | — (pricing band) |
| 18 | FAQ (`FaqAccordion`) | `CX_FAQ` (6 Q/A) | H2 | — (accordion) |
| 19 | Final CTA (`FinalCtaBand`) | `CX_FINAL_CTA` | H2 | — (final CTA band) |

**Reconciliation:** 19 content components rendered in the exact brief order; one H1 (Hero); no field
dropped; no claim added or rewritten. Layouts alternate across split / callout / cards / process /
comparison / CTA / accordion as the brief requires — no all-full-width vertical image stack, and with
neutral diagrams there is no fabricated-figure or PII exposure to reconcile.

Layout-variety note: the brief's "tabbed media for channels" and image-mapping for §05/§09 assumed real
captures; under the neutral-diagram decision §05 stays a 5-card grid and §09 a process layout (both
distinct from neighbouring sections), which satisfies the "don't reuse one layout / don't stack
full-width images" rule without media.
