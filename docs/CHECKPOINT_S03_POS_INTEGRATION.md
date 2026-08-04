# Checkpoint S03 — POS Integration

**Route:** `/tong-dai-tich-hop-pos/`
**Type:** Solution page (MOFU / BOFU, Commercial Investigation)
**Status:** CONTENT LOCKED V1

---

## 1. Baseline

**SHELL.** The route existed only in `SHELL_ROUTES`, served by the generic
sitemap-driven `RouteShell`. No page component, no data file, no JSON-LD, no
lead CTA, no POS visual. Sitemap metadata existed but did not match the S03 lock.

### Integration Kit reused — YES (but not cloned)

| Component | Reused |
|---|---|
| `IntegrationHero` | Yes |
| `IntegrationProblems` | Yes |
| `IntegrationWorkflow` | Yes |
| `IntegrationSteps` | Yes |
| `IntegrationBeforeAfter` | Yes (built in S01) |
| `IntegrationBoundaries` | Yes (built in S01) |
| `IntegrationPlatforms` | **Deliberately NOT used** |

No integration component was modified or duplicated.

`IntegrationPlatforms` is the deliberate omission: S01 and S02 both end with a
vendor ecosystem grid, but the §19 evidence gate resolved to generic
positioning, so POS has no vendor grid at all. The generic-platform message
lives in the Trust section and FAQ 5 instead. The page also carries two
POS-specific sections the other integration pages do not have — the Gcalls Plus
relationship (§21) and a retail/e-commerce use-case pair — because the POS story
is customer → purchase/order context → call → follow-up, not ticket or lead
workflow.

---

## 2. SEO ownership

- **Primary keyword:** `tổng đài tích hợp POS`
- **Title:** `Tổng đài tích hợp POS | Kết nối cuộc gọi với dữ liệu bán hàng`
- **Meta:** `Gcalls kết nối tổng đài với POS để đội bán hàng và CSKH sử dụng customer context, dữ liệu bán hàng và lịch sử tương tác trong cùng quy trình chăm sóc.`
- **H1:** `Tổng đài tích hợp POS – kết nối cuộc gọi với dữ liệu bán hàng`
- **Canonical:** `https://gcalls.co/tong-dai-tich-hop-pos/`
- **Robots:** `noindex, nofollow` in preview; route is `indexable: true`, so it
  becomes `index, follow` when the site-wide `ALLOW_INDEXING` launch flag is
  enabled. Global flag, out of S03 scope.

### Cannibalization

The page owns the generic POS integration intent only. **Zero vendor names**
appear, so there is no vendor keyword targeting to cannibalize, and no legacy
vendor route was recreated.

---

## 3. Verified capabilities

The only POS evidence in the repository is the approved estimator config
(`src/data/estimator.ts`, solution `pos`): a `posPlatform` select, a `locations`
count, agents, and a `posNeeds` multi-select offering exactly two data
categories — "Dữ liệu khách hàng" and "Dữ liệu đơn hàng".

Published (4): Customer Identification · Customer Context · Sales Data Context ·
Interaction History — each conditional on platform, API and configuration.

---

## 4. Order-data evidence (§11)

**GENERIC SALES CONTEXT ONLY.**

`posNeeds` evidences order data as a connectable **category**, never as a field.
Nothing in the repository evidences order status, SKU, purchase value, payment
data or full purchase history.

Applied consistently:
- All copy says "dữ liệu bán hàng phù hợp"; "đơn hàng chi tiết" appears nowhere.
- The Sales Context list stays at category level and carries an explicit note
  that specific fields are determined per system during technical survey.
- The visual shows category rows with a "Theo cấu hình" badge and **no** order
  id, status, SKU, quantity, amount or payment method.
- FAQ 3 answers the order question by scope, not by field.

---

## 5. Incoming customer popup evidence (§12)

**NOT VERIFIED & NOT PUBLISHED.**

No POS-specific popup behaviour is evidenced. `CustomerPopupMockup` and S01's
"Customer Popup" capability are CRM-scoped, and §12 explicitly forbids
inheriting them. Only Customer Identification and Customer Context are
published, both conditional. No visual depicts an automatic incoming popup.

---

## 6. Click-to-Call evidence (§13)

**NOT VERIFIED & NOT PUBLISHED.**

Click-to-Call exists in this repository only inside the CRM estimator field
(`crmNeeds`) and CRM copy. §13 forbids inheriting it into POS. The phrase does
not appear anywhere on the page, and no Click-to-Call control is drawn in any
visual.

---

## 7. Platform-name decision (§19)

**NONE — GENERIC POSITIONING ONLY.**

§19 requires *both* current sitemap relevance and product evidence. Neither
holds:

1. **No POS vendor route exists** in the locked sitemap — unlike CRM
   (`/tich-hop/hubspot/` etc.) and Helpdesk (`/tich-hop/zendesk/` etc.). A
   vendor keyword here would have nowhere to route.
2. **Vendor names exist only as estimator select options** (KiotViet, Sapo,
   Haravan) — an internal scoping input that helps a visitor describe their own
   system, not published proof that an integration exists.
3. **The historical names do not match.** Historical material references
   Pancake, Nhanh.vn and Táo Quân; the estimator lists KiotViet, Sapo and
   Haravan. The disagreement is itself evidence that the vendor set is
   unverified.

Current SEO guidance is explicit — "Bỏ tên nền tảng chưa xác minh." No POS
vendor is named anywhere on the page or in any visual, and no vendor route was
created. **Vendor partnership claims: 0.**

The estimator's own select options were left untouched — they are a scoping
input, not page content, and are out of S03 scope.

---

## 8. F&B decision (§18)

**NOT PUBLISHED.**

No F&B evidence exists: there is no F&B industry route in the locked sitemap and
no F&B content in the data layer. Publishing it would be keyword expansion,
which §18 forbids. Retail and E-commerce use cases are published; E-commerce
links to the existing `/nganh/thuong-mai-dien-tu/` route.

Also excluded: inventory-management scenarios (unverified, §16) and
Facebook/Zalo inbox positioning (belongs to Gcalls CX, §17).

---

## 9. Visual strategy

No real or sanitized Gcalls POS UI exists, so the §28 ladder lands on options 2
and 3 — a Gcalls-side call panel plus an abstract, unbranded sales-context
surface.

| Visual | What it is |
|---|---|
| `PosContextMockup` | Gcalls call panel + abstract sales-context panel |
| `SalesContextMockup` | Standalone abstract sales-context panel |

Both in `src/components/pos/visuals.tsx`, tagged `DEMO_VISUAL_REPLACE_LATER`,
under rules recorded in that file:

- **No third-party interface is imitated.** No KiotViet, Sapo, Haravan, Pancake
  or Nhanh.vn layout, branding, colour or name — consistent with publishing no
  platform names at all.
- The sales surface is generic and unbranded, depicting the *concept* of sales
  context reaching a call, not any product's order-management screen.
- **No specific order field is drawn** — no order id, status, SKU, line item,
  quantity, payment method or value.
- No automatic popup and no Click-to-Call control is depicted.
- **No real PII** — masked contact (`KH #5074`), role label (`Agent 07`).

**Fake POS UI: 0. Fake third-party UI: 0.**

---

## 10. Claims

Not present anywhere (S03 §29): `30–50% hiệu suất` · `đồng bộ 100%` ·
`tự động lấy toàn bộ lịch sử đơn hàng` · `nhận diện khách hàng tức thì` ·
`hỗ trợ mọi POS` · `đồng bộ toàn bộ dữ liệu giao dịch` · `real-time guaranteed` ·
`xóa bỏ hoàn toàn thao tác tra cứu` · `không bỏ sót đơn hàng / lead`.

Verified by rendered-DOM scan: **0 percentage tokens, 0 fake prices, 0
unsupported numerical claims, 0 vendor names, 0 unsupported order-data claims.**
The before/after section is an explicit workflow illustration with no
time-saving figure.

Trust is **neutral**: no verified POS customer case exists, so no logo, quote,
result or case study is shown.

---

## 11. Internal links

`/tong-dai-tich-hop-crm/` · `/tong-dai-tich-hop-helpdesk/` ·
`/gcalls-plus-webphone/` · `/gcalls-cx/` · `/qc-bot-ai/` · `/giai-phap/` ·
`/tich-hop/` · `/nganh/thuong-mai-dien-tu/` · `/bang-gia/` ·
`/uoc-tinh-chi-phi/` · `/blog/` · `/lien-he/`

All 12 required links present and resolving to declared routes. 0 broken links,
no legacy POS vendor route linked, no SEO footer dump.

**Conversion:** every lead CTA carries `intent=consultation` through the shared
lead form, with `source: 'pos_integration'` and `solution: 'Tích hợp POS'` —
both pre-existing members of `LeadSource` and `LEAD_NEEDS`, so **no shared lead
type changed**. The estimator deep link uses `?product=pos-integration`,
resolved to internal `pos` by `PRODUCT_SLUG_ALIASES`. Verified: Tích hợp POS is
preselected.

---

## 12. Responsive QA

Measured on real rendered layouts at 390 / 430 / 768 / 1024 / 1440:

- **0 page-level horizontal overflow at every width**
- **0 elements overflowing the viewport at every width**
- Exactly **1 H1** and 21 H2 at every width
- The call + sales-context visual stacks vertically by construction, staying
  legible at 390 rather than shrinking
- Capability, how-it-works and boundary grids are 1-up at 390, 2-up from `sm`
- CTAs stack full-width below `sm`

Sub-44px targets are limited to the visually-hidden skip link and the
pre-existing desktop header CTA (≥1024, pointer context). Every in-page link and
CTA is ≥44px.

---

## 13. Technical QA

| Check | Result |
|---|---|
| `npm run typecheck` | PASS (0 errors) |
| `npm run lint` | PASS (0 errors; 6 pre-existing warnings, all in `src/app/components/ui/*` shadcn vendor files) |
| `npm run build` | PASS |
| H1 count | 1 |
| JSON-LD | 1 block, 4 nodes: BreadcrumbList, Service, SoftwareApplication, FAQPage — no Offer, price, rating, review, partnership or ROI metric |
| Direct answer in rendered HTML | PASS (plain text, not collapsed) |
| FAQ count | 6 |
| Regression P01 / P02 / P03 / S01 / S02 | PASS — content, H1/H2 counts, metadata, lead intents and estimator aliases unchanged |

---

## 14. Open evidence questions

1. **POS platform names** — which POS systems does Gcalls actually integrate
   with today? The estimator list (KiotViet, Sapo, Haravan) and the historical
   material (Pancake, Nhanh.vn, Táo Quân) disagree. Until reconciled with
   product evidence, the page stays generic. If vendors are confirmed, vendor
   pages should be added to the sitemap before naming them here.
2. **Order data fields** — which fields can actually surface (status, value,
   history)? Currently category-level only.
3. **Incoming customer popup** — is there POS-specific recognition on incoming
   calls? Not published.
4. **POS Click-to-Call** — supported for POS systems, or CRM-only? Not published.
5. **F&B workflow** — is there a supported F&B use case? Not published.
6. **POS customer story** — none verified; trust stays neutral.
7. **Real POS integration screenshots** — none exist; both visuals are
   conceptual and tagged for replacement.
