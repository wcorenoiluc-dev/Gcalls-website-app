# Checkpoint P02 — /qc-bot-ai/ (QA QC Center, powered by QC Bot AI)

Full production build of the QA QC Center product page. Gcalls Plus
(`/gcalls-plus-webphone/`, CONTENT LOCKED V1), Home and Gcalls CX were not
touched.

---

## 0. Baseline audit (before work)

| Aspect | Finding |
|---|---|
| Route state | **SHELL.** `/qc-bot-ai/` was listed in `SHELL_ROUTES` and rendered by the generic `ShellPage` → `RouteShell`. No bespoke page component existed. |
| Components | None product-specific. |
| Content | Sitemap `intro` + `summary` only. |
| Metadata | Present but not the approved strings (old title/description). `indexable: true`, `status: 'shell'`. |
| JSON-LD | None. |
| QC Bot visuals | **None.** The `@/components/product-ui` barrel holds only Webphone/CRM/analytics mockups; nothing depicting transcript, QA criteria, scoring or signals. |
| LeadForm | Shared architecture reused as-is — `leadCtaHref` → `/lien-he/` → `LeadForm`. No second implementation was built. |
| FAQ | Shared `FaqAccordion` (with the optional contextual `link` added in P01-B). |
| Layout | Shared `Container` / `Section` / `SectionHeader` / `Card` / `Eyebrow` / `GradientHeading` / `FeatureSplit` / `ProductVisual` / `PricingCtaBand` / `FinalCtaBand` / `Breadcrumb`. |

Nothing global was redesigned.

## 1. Product naming

One product, one page identity:

```
QA QC Center
└── powered by QC Bot AI
```

"QA QC Center" is the product and page identity; "QC Bot AI" names the AI
capability (used in the overview eyebrow, the direct answer, and FAQ 2/3).
They are never presented as two competing products, and the page has a single
H1 carrying the QA QC Center name.

## 2. SEO ownership

| Field | Value |
|---|---|
| Primary keyword | **phần mềm QA cuộc gọi** — 1 natural occurrence, in the Overview lead sentence |
| SEO title | `QA QC Center \| AI kiểm soát chất lượng cuộc gọi \| Gcalls` |
| Meta description | `QA QC Center của Gcalls sử dụng QC Bot AI để chuyển cuộc gọi thành transcript, hỗ trợ chấm điểm theo tiêu chí QA và làm nổi bật các tín hiệu cần kiểm tra.` |
| H1 | `QA QC Center – AI hỗ trợ kiểm soát chất lượng cuộc gọi` |
| Canonical | `https://gcalls.co/qc-bot-ai/` |

Exact keyword placement, quoted:

> "Là **phần mềm QA cuộc gọi**, QA QC Center tập hợp bảy thành phần dưới đây
> thành một quy trình kiểm soát chất lượng duy nhất."

No "100%" appears in the title, H1, meta or anywhere in body copy.

**Cannibalisation check.** This page owns AI-supported call quality assurance
only. Webphone → `/gcalls-plus-webphone/`, omnichannel → `/gcalls-cx/`, CRM
integration → `/tong-dai-tich-hop-crm/`. The Product Boundaries section routes
each of those needs away from this page by name, and the Integration section is
a hand-off, not a second CRM landing page.

## 3. Content structure — 18 sections

| # | Section | Notes |
|---|---|---|
| 01 | Hero | H1, 3 value points, demo CTA + `#cach-hoat-dong` |
| 02 | Direct answer / AIO | uncollapsed visible text |
| 03 | Problems | 4 cards |
| 04 | Overview | 7 key components + primary-keyword sentence |
| 05 | How it works | 5 steps, ends on the human QA step |
| 06 | Core AI capabilities | 7 capabilities |
| 07 | QA Scoring | 5 points + score mockup |
| 08 | Conversation signals | 4 points + signals mockup |
| 09 | **AI + Human QA** | the anti-"AI replaces QA" section |
| 10 | Quality dashboard | dashboard mockup |
| 11 | Operational benefits | 4, no percentages attached |
| 12 | Use cases | 4, with industry links |
| 13 | Integration | 3 contextual product links |
| 14 | Product boundaries | 4 cards; card 4 marked "Trang hiện tại", not a self-link |
| 15 | QA process (neutral story) | no fabricated case |
| 16 | Configuration & cost | shared `PricingCtaBand`, renders no price |
| 17 | FAQ | 6 approved questions |
| 18 | Final CTA | demo (primary) + consultation (secondary) |

Section 09 is deliberately placed immediately after the AI capability sections
(06–08) so the human-review boundary lands before the dashboard and benefits.

## 4. Capability evidence

Every capability named on the page comes from the approved P02 copy and is
described in supporting language ("hỗ trợ", "có thể", "theo cấu hình"). No
capability was invented to justify a visual, and the demo mockups depict only
these seven: transcript, QA criteria, scoring, keyword signals, sentiment
signals, conversation review, quality dashboard.

## 5. Claim decisions

Scanned the rendered route. **0 hits** for: `100% cuộc gọi`, `chính xác 100%`,
`thay thế hoàn toàn QA`, `phát hiện mọi vi phạm`, `đảm bảo compliance`,
`đảm bảo tuân thủ`, `tuyệt đối`, `chứng nhận`, `certified`, `guaranteed`,
`1–2%`. **0 occurrences of "100%" anywhere on the page.**

- **"Chỉ nghe được 1–2%"** — not published. It is not an approved universal
  industry fact and must not return without verified evidence.
- **"AI thay thế QA"** — the phrase "thay thế hoàn toàn" appears exactly once,
  as FAQ 4's *question*, whose answer opens "Không nên xem QA QC Center là công
  cụ thay thế hoàn toàn vai trò QA."
- **Sentiment** — the register is "tín hiệu cảm xúc" throughout. Perfect
  emotion detection is never claimed.
- **Scoring** — presented as "Điểm đề xuất · Chờ QA xác nhận", including inside
  the mockup. Never "AI score is correct" or "replaces manual scoring".
- **Compliance** — no regulatory certification is claimed anywhere, including
  in the Finance & Insurance use case.
- **Percentages** — the only 4 on the page (20/30/30/20) are QA criteria
  weights inside the score mockup, verified by walking each text node to a
  captioned demo-data ancestor. No benefit carries a percentage.
- **Pricing** — no price rendered; quote-only via the shared pricing config.

## 6. Visual sources

No real or sanitized QC Bot screenshots exist in the repository, so none were
reused and no unrelated Gcalls mockup was repurposed (that would misrepresent
the product). Five conceptual surfaces were built from the design system in
`src/components/qa-qc/visuals.tsx`, all marked **DEMO_VISUAL_REPLACE_LATER**:

| Mockup | Used in |
|---|---|
| `ReviewWorkspaceMockup` | Hero |
| `TranscriptMockup` | Overview |
| `ScoreCardMockup` | QA Scoring |
| `SignalsMockup` | Conversation signals |
| `QualityDashboardMockup` | Quality dashboard |

Rules they follow: only approved capabilities depicted; **no real PII and no
fabricated customer or agent names** (speakers are role labels "Agent" /
"Khách hàng"; calls are IDs like `#A-1042`); every figure is demo data rendered
inside `ProductVisual`, which prints the demo-data caption beneath it; flags
read "cần xem lại", never as confirmed violations presented as customer data.
No stock photography, robots, neon brains or cyberpunk artwork.

## 7. Internal link map

Ten required destinations, all present in `<main>`, all verified to resolve,
**0 placeholder (`#`) links, 0 self-links**:

| Destination | Where |
|---|---|
| `/gcalls-plus-webphone/` | Integration · Boundaries card 1 |
| `/gcalls-cx/` | Integration · Boundaries card 2 |
| `/tong-dai-tich-hop-crm/` | Integration · Boundaries card 3 |
| `/giai-phap/` | Boundaries footer |
| `/nganh/bpo/` | Use case 3 |
| `/nganh/tai-chinh/` · `/nganh/bao-hiem/` | Use case 4 |
| `/uoc-tinh-chi-phi/?product=qa-qc` | Configuration & cost |
| `/bang-gia/` | Configuration & cost |
| `/blog/` | QA process section |
| `/lien-he/` | Hero · story · final CTA (via `leadCtaHref`) |

## 8. Lead capture

No second form implementation. Every CTA routes through the shared
`leadCtaHref` → `/lien-he/` → `LeadForm`.

P02 §5 suggests `intent = demo`, but `LeadIntent` has no `demo` member and §5
directs using the closest valid typed value. Mapping:

| CTA | intent | source | product |
|---|---|---|---|
| "Yêu cầu demo QA QC Center" | `product_information` | `qa_qc_center` | `QA QC Center` |
| "Đăng ký tư vấn" | `consultation` | `qa_qc_center` | `QA QC Center` |

`source` and `product` are exact matches to the existing enum and `LEAD_NEEDS`.
Verified end-to-end: the demo CTA lands on `/lien-he/` with
`intent=product_information&source=qa_qc_center&product=QA QC Center` and the
form's *Nhu cầu* preselected to "QA QC Center". Backend remains
`NOT_CONFIGURED` and says so honestly — no fake success state.

**Open decision:** if demo requests should be reportable separately from
product-information leads, add `'demo'` to `LeadIntent` + the `VALID_INTENTS`
allow-list in `ctaLink.ts` — a two-line change that would touch shared lead
types, which is why it was not done unilaterally.

## 9. Responsive verification — actually rendered

The route was rendered inside same-origin iframes at each width and the live
layout measured; media queries respond to the iframe viewport, so this is a
genuine render, not source inspection. Confirmed visually at 390px and 1440px.

| Width | `innerWidth` | `scrollWidth` / `clientWidth` | Overflowing els | Tap targets < 44px | Verdict |
|---|---|---|---|---|---|
| 390 | 390 | 375 / 375 | 0 | 0 | PASS |
| 430 | 430 | 415 / 415 | 0 | 0 | PASS |
| 768 | 768 | 753 / 753 | 0 | 0 | PASS |
| 1024 | 1024 | 1009 / 1009 | 0 | 0 | PASS |
| 1440 | 1440 | 1425 / 1425 | 0 | 0 | PASS |

1 `<h1>` and 18 sections at every width. The quality dashboard stays readable at
390px (2×2 stat tiles + 6-bar trend chart), with the demo-data caption directly
beneath it.

**Bug found and fixed during this QA:** the dashboard trend bars rendered at
zero height because their percentage heights resolved against an auto-height
flex parent. Fixed by making each column `h-full … justify-end`; bar heights now
measure 60/71/56/80/76/39px as intended.

## 10. Accessibility

- Exactly 1 `<h1>`; heading order runs H1 → H2 → H3 with no skipped level.
- 75 decorative icons, **0 exposed to assistive tech** (verified by walking each
  SVG's ancestors for `aria-hidden`). No `<img>` elements, so no missing alt.
- FAQ uses the shared accordion: real `<button aria-expanded aria-controls>`,
  56px minimum control height, headings preserved.
- Links are links and buttons are buttons; the boundaries "current page" card is
  a marked card, not a disabled link.
- Every interactive element carries a visible `focus-visible` ring.
- `LeadForm` aria behaviour untouched.

## 11. Structured data

Four nodes, no duplicates: `BreadcrumbList`, `Product`, `SoftwareApplication`
(with `alternateName: "QC Bot AI"`), `FAQPage` (6 questions, matching the
rendered accordion). Verified absent: `Offer`, price, `AggregateRating`,
`Review`, `customerCount`, award, accuracy % and coverage %.

## 12. Verification

`npm run check` ✓ — typecheck ✓ · lint ✓ (0 errors; 6 pre-existing
`react-refresh` warnings in untouched `app/components/ui/*`) · build ✓

Robots split verified: preview → `noindex, nofollow`;
`VITE_ALLOW_INDEXING=true` → `index, follow`; canonical absolute in both.

Regression: `/gcalls-plus-webphone/` re-checked after this work — 1 h1,
17 sections, no overflow, unchanged.

## 13. Files changed

New:
- `src/pages/QaQcCenterPage.tsx`
- `src/data/qaQcCenter.ts`
- `src/components/qa-qc/sections.tsx`
- `src/components/qa-qc/visuals.tsx`
- `docs/CHECKPOINT_P02_QA_QC_CENTER.md`

Modified:
- `src/app/router.tsx` — real route registered; `qcCenter` removed from `SHELL_ROUTES`
- `src/config/sitemap.ts` — `WEB-004` title, description, `status: 'complete'`

---

## Status: **CONTENT LOCKED V1**

## Remaining evidence questions

1. **Real QC Bot screenshots.** All five visuals are placeholders. Authentic
   sanitized screenshots would replace `src/components/qa-qc/visuals.tsx`
   wholesale — that file is the single swap point.
2. **Customer case study.** No verified QC Bot case exists, so section 15 is
   neutral. A cleared case (with evidence) would replace it.
3. **Sampling statistic.** "Chỉ nghe được 1–2%" stays unpublished pending a
   citable source.
4. **Accuracy / coverage figures.** None published. Any STT accuracy, detection
   rate or coverage claim needs measured, approved evidence — and should state
   its dependency on audio quality and configuration.
5. **Compliance positioning.** No regulatory certification is claimed. If Gcalls
   holds one relevant to Finance/Insurance QA, it can be stated with evidence.
6. **`LeadIntent.demo`** — see §8; product decision on lead reporting.
