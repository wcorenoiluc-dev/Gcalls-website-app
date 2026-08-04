# Checkpoint S02 — Helpdesk Integration

**Route:** `/tong-dai-tich-hop-helpdesk/`
**Type:** Solution page (MOFU / BOFU, Commercial Investigation)
**Status:** CONTENT LOCKED V1

---

## 1. Baseline

**SHELL.** The route existed only in `SHELL_ROUTES`, served by the generic
sitemap-driven `RouteShell`. There was no page component, no data file, no
JSON-LD, no lead CTA and no Helpdesk-specific visual. Metadata existed in the
sitemap entry but did not match the S02 lock.

Because the shell carried no content, S02 is a build — but **not** a build of new
architecture. The page is composed almost entirely from the S01 integration kit.

### CRM integration kit reused — YES

| Component | Origin | Change |
|---|---|---|
| `IntegrationHero` | Pre-S01 kit | Reused as-is |
| `IntegrationProblems` | Pre-S01 kit | Reused as-is |
| `IntegrationWorkflow` | Pre-S01 kit | Reused as-is |
| `IntegrationSteps` | Pre-S01 kit | Reused as-is |
| `IntegrationPlatforms` | Extended in S01 (per-platform `path`) | Reused as-is |
| `IntegrationBeforeAfter` | **Built in S01 to be reusable** | Reused as-is |
| `IntegrationBoundaries` | **Built in S01 to be reusable** | Reused as-is |

Shared primitives reused unchanged: `FeatureSplit`, `FinalCtaBand`,
`PricingCtaBand`, `ProductVisual`, `FaqAccordion`, `JsonLd`, `Breadcrumb`.

**No integration component was modified or duplicated for S02.** The S01
investment in making before/after and boundaries reusable paid off exactly here.

New files: the data module, the page, and one conceptual visuals module.

---

## 2. SEO ownership

- **Primary keyword:** `tổng đài tích hợp helpdesk`
- **Title:** `Tổng đài tích hợp Helpdesk | Kết nối cuộc gọi & Ticket CSKH`
- **Meta:** `Gcalls kết nối tổng đài với Helpdesk để đội CSKH quản lý cuộc gọi, ticket và lịch sử hỗ trợ trong cùng quy trình, giảm việc chuyển đổi giữa nhiều công cụ.`
- **H1:** `Tổng đài tích hợp Helpdesk – kết nối cuộc gọi với ticket và lịch sử hỗ trợ`
- **Canonical:** `https://gcalls.co/tong-dai-tich-hop-helpdesk/`
- **Robots:** `noindex, nofollow` in preview; route is `indexable: true`, so it
  becomes `index, follow` when the site-wide `ALLOW_INDEXING` launch flag is
  enabled. That flag is global and out of S02 scope.

### Cannibalization control

Zendesk- and Freshdesk-specific intent belongs to `/tich-hop/zendesk/` and
`/tich-hop/freshdesk/`. Vendor names appear **once**, in a routed ecosystem grid
where each card links to its own page. No vendor name is used as a repeated
keyword target, and the FAQ answers the vendor question generically rather than
per-vendor — the same discipline S01 applied to the CRM vendors.

---

## 3. Capabilities actually verified

Published (4):

| Capability | Note |
|---|---|
| Call Context | Carries call information into the support context |
| Ticket / Support Record Connection | **Linking** call data to an existing ticket or record |
| Interaction History | Recording relevant contact history in the support workflow |
| Customer Identification | Conditional on data and platform |

Evidence: the approved estimator config (`src/data/estimator.ts`, solution
`helpdesk`, field `helpdeskNeeds`) enumerates exactly two connection needs —
"Gắn cuộc gọi vào ticket" and "Lịch sử cuộc gọi trong hồ sơ hỗ trợ". Customer
identification and call context are Gcalls-wide capabilities already approved in
S01 copy and the shared `CustomerPopupMockup`.

---

## 4. Ticket creation decision

**AUTO TICKET CREATION: NOT VERIFIED & NOT PUBLISHED.**

S02 §11 warns that the historical SEO question ("can it create tickets after
calls?") is not evidence. A repository-wide search for ticket-creation behaviour
returned nothing, and the estimator evidences *linking*, not *creation*.

Consequences applied throughout:

- Capability 2 is worded as **connection** to an existing ticket or support
  record, never creation.
- The conceptual visual shows a record being **linked** ("Đã liên kết"), never a
  ticket being created.
- FAQ 4 uses the prescribed conservative NOT-VERIFIED answer.
- The phrase "tự động tạo ticket" appears exactly once on the page — inside the
  locked FAQ **question**. There are **0 auto-ticket claims**.

---

## 5. Recording sync decision

**RECORDING SYNC: NOT VERIFIED & NOT PUBLISHED.**

S02 §12 explicitly forbids assuming parity with CRM Integration. No
recording-synchronisation evidence exists anywhere in the repository — the only
search matches are S01's own "not published" notes. Omitted entirely.

---

## 6. Freshdesk / Zendesk evidence

Both are verified on two independent grounds:

1. Each is an option in the approved estimator `helpdeskPlatform` select.
2. Each has a declared route in the locked sitemap (`/tich-hop/freshdesk/`,
   `/tich-hop/zendesk/`), so the links resolve.

This is what permits FAQ 2's closing sentence, which S02 §21 gated on both being
verified.

**Vendor partnership claims: 0.** Naming a platform asserts connection
experience only. No wording implies official partner, certified integration,
marketplace listing or strategic partnership, and no vendor logo is rendered.

---

## 7. Visual strategy

S02 §24 is explicit: **DO NOT CREATE FAKE TICKET UI.** A repository search found
no real or sanitized Gcalls Helpdesk screenshots and no existing ticket visual.

Applying the §24 priority ladder, option 1 was unavailable, so the page uses a
combination of options 2 and 3 — a Gcalls-side surface plus a workflow diagram
that does not pretend to be a vendor product:

| Visual | What it is |
|---|---|
| `HelpdeskFlowMockup` | Gcalls call panel → "Lớp tích hợp Gcalls" → **abstract** support record |
| `SupportContextMockup` | Neutral support-context field list |

Both live in `src/components/helpdesk/visuals.tsx`, tagged
`DEMO_VISUAL_REPLACE_LATER`, and follow hard rules recorded in that file:

- **No third-party interface is imitated.** No Zendesk or Freshdesk layout,
  branding, colour or name appears in any visual.
- The support record is deliberately generic and unbranded — labelled
  "Hồ sơ hỗ trợ", drawn in Gcalls' design language. It depicts the *concept* of
  a linked record, not a product's screen.
- Only evidenced behaviour is depicted: linking and history. No ticket is shown
  being created.
- **No real PII** — masked contact (`KH #2318`), role label (`Agent 04`).
- Both render inside `ProductVisual`, which prints the demo-data caption.

**Fake third-party UI: 0.**

---

## 8. Claims

Not present anywhere (S02 §25): `30–50% hiệu suất` · `đồng bộ 100% cuộc gọi` ·
`tất cả nền tảng Helpdesk` · automatic ticket creation as a behaviour ·
`real-time guaranteed` · `xóa bỏ hoàn toàn nhập liệu thủ công` · automatic
recording sync · `unlimited` anything.

Verified by rendered-DOM scan: **0 percentage tokens, 0 fake prices, 0
unsupported numerical claims.** The before/after section is an explicit workflow
illustration and carries no ROI figure — `IntegrationBeforeAfter` renders no
metrics slot at all.

Trust is **neutral**: no verified Helpdesk customer case exists, so no logo,
quote, result or case study is shown.

---

## 9. Internal links

`/tong-dai-tich-hop-crm/` · `/gcalls-plus-webphone/` · `/gcalls-cx/` ·
`/qc-bot-ai/` · `/tich-hop/` · `/tich-hop/freshdesk/` · `/tich-hop/zendesk/` ·
`/tong-dai-tich-hop-pos/` · `/bang-gia/` · `/uoc-tinh-chi-phi/` ·
`/nganh/thuong-mai-dien-tu/` · `/nganh/bpo/` · `/blog/` · `/lien-he/`

All 14 required links present and resolving to declared routes. 0 broken links,
no SEO footer dump — every link sits in a section where it is contextually
earned (use cases, boundaries, ecosystem, FAQ, CTAs).

**Conversion:** every lead CTA carries `intent=consultation` through the shared
lead form, with `source: 'helpdesk_integration'` and
`solution: 'Tích hợp Helpdesk'` — both pre-existing members of `LeadSource` and
`LEAD_NEEDS`, so **no shared lead type changed**. The estimator deep link uses
`?product=helpdesk-integration`, resolved to internal `helpdesk` by
`PRODUCT_SLUG_ALIASES`. Verified: Tích hợp Helpdesk is preselected.

---

## 10. Responsive QA

Measured on real rendered layouts at 390 / 430 / 768 / 1024 / 1440:

- **0 page-level horizontal overflow at every width**
- **0 elements overflowing the viewport at every width**
- Exactly **1 H1** and 20 H2 at every width
- The integration flow visual stacks vertically by construction, so it stays
  legible at 390 instead of shrinking
- Capability, use-case and boundary grids are 1-up at 390, 2-up from `sm`
- CTAs stack full-width below `sm`

Sub-44px targets are limited to the visually-hidden skip link and the
pre-existing desktop header CTA (≥1024, pointer context). Every in-page link and
CTA is ≥44px.

---

## 11. Technical QA

| Check | Result |
|---|---|
| `npm run typecheck` | PASS (0 errors) |
| `npm run lint` | PASS (0 errors; 6 pre-existing warnings, all in `src/app/components/ui/*` shadcn vendor files) |
| `npm run build` | PASS |
| H1 count | 1 |
| JSON-LD | 1 block, 4 nodes: BreadcrumbList, Service, SoftwareApplication, FAQPage — no Offer, price, rating, review, SLA or partnership |
| Direct answer in rendered HTML | PASS (plain text, not collapsed) |
| FAQ count | 6 |
| Regression P01 / P02 / P03 / S01 | PASS — content, H1/H2 counts, metadata, lead intents and estimator aliases all unchanged |

---

## 12. Open evidence questions

1. **Automatic ticket creation** — needs product confirmation before it can be
   published. Currently described as linking only.
2. **Recording sync** — no evidence; not published. Do not assume CRM parity.
3. **Helpdesk customer story** — none verified; trust stays neutral.
4. **Additional Helpdesk platforms** — only Freshdesk and Zendesk are evidenced.
   Any further vendor needs evidence before being added.
5. **Vendor relationships** — if official partner or marketplace status exists
   for Freshdesk or Zendesk, it is not recorded here and is therefore not claimed.
6. **Real Helpdesk integration screenshots** — none exist. Both visuals are
   conceptual and tagged for replacement.
