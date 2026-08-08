# Checkpoint WEB-IND-001 — Industry cluster + Voicebot navigation

Resumes from Checkpoint WEB-PRO-004 (`/voicebot-ai/`). Two pieces of work:

1. The shared-surface exposure WEB-PRO-004 explicitly deferred.
2. All six `/nganh/…` industry pages, built from the supplied ICP source.

Nothing was deployed or published.

> **Correction (WEB-IND-001A).** This document originally said the build
> "remains private and non-indexable." That conflated two different things.
> The build is **non-indexable**; it is **not private**. `robots.txt`, the meta
> robots tag and `X-Robots-Tag` are crawler directives, not access control, and
> this repository contains no authentication layer of any kind. See §9.

---

## 1. Voicebot AI navigation — closing the WEB-PRO-004 gap

WEB-PRO-004 §12 recorded: *"Header, footer and products hub were not touched…
This is the first thing the next checkpoint should fix."* `/voicebot-ai/` was
reachable only by direct URL.

| Surface | Change |
|---|---|
| `NAV_GROUPS` → products | Fourth item in the mega menu |
| `FOOTER_COLUMNS` → products | Fourth item in the footer product column |
| `PRODUCTS_HUB.cards` | Fourth card, with `supportingLabel: 'Voicebot AI'` |
| `PRODUCTS_HUB.decisionGuide` | New row: repeated scripted calls → Voicebot |
| `SITEMAP` WEB-037 | `navVisibility` / `footerVisibility` → `true` |

The products hub counted "ba sản phẩm" in four places (hero description, direct
answer, card eyebrow, card note, decision-guide heading). All were updated to
four, as was the `WEB-002` sitemap description and intro — leaving a "three
products" sentence above four cards would have been a plain factual error.

The Voicebot card inherits the claim guard in `src/data/voicebotAi.ts`: Gcalls
consults, connects and integrates a Voicebot; it is never presented as the
author of the engine, and no accuracy, concurrency, language or saving figure
appears.

---

## 2. Industry cluster — six pages, one component

### Architecture

One page component serves all six routes; only the content object differs.

```
src/data/industries/types.ts     IndustryContent + content hierarchy + claim guard
src/data/industries/index.ts     registry + JSON-LD builder
src/data/industries/*.ts         six content files
src/components/industry/sections.tsx   seven shared sections
src/pages/IndustryPage.tsx       composition, breadcrumb, FAQ, final CTA
```

The section order is enforced by the shape of `IndustryContent`, not by
convention, because the approved content hierarchy is the point:

1. `problem` — customer operational problem
2. `impact` — business impact
3. `capability` — Gcalls capability
4. `workflow` — how it fits the existing workflow
5. `outcomes` — qualified expected value (the `note` field is **required**)
6. `routing` + `finalCta` — conversion

### ICP mapping

One primary ICP and at most one secondary per page. Every ICP in the source is
used at least once.

| Route | Primary ICP | Secondary ICP |
|---|---|---|
| `/nganh/giao-duc/` | 1 — high-density outbound telesales | 3 — already using CRM |
| `/nganh/tai-chinh/` | 3 — already using CRM | 5 — automation & QC at scale |
| `/nganh/bao-hiem/` | 1 — high-density outbound telesales | 5 — automation & QC at scale |
| `/nganh/bat-dong-san/` | 1 — high-density outbound telesales | 3 — already using CRM |
| `/nganh/thuong-mai-dien-tu/` | 2 — outbound customer care | 3 — already using CRM |
| `/nganh/bpo/` | 5 — automation & QC at scale | 4 — international markets |

Three pages share ICP 1 as primary because the source itself lists real estate,
finance, education and insurance under that ICP. They are differentiated by the
secondary ICP and by industry-specific operational detail (admissions funnel vs.
contract lifecycle vs. lead/project handling), not by restating the same pains.

---

## 3. Claims withheld — `NEEDS_GCALLS_VERIFICATION`

Every item below is tagged in code at the point where it would otherwise have
appeared. The tags are in `src/data/industries/*.ts`.

| Claim from the ICP source | Why withheld | Where tagged |
|---|---|---|
| **Auto Dialer**, outbound **number rotation**, randomised outbound calling | `src/data/gcallsCx.ts` records the scope decision: no product config, no estimator field, no scope-document entry. Not published anywhere in this repo. | education, insurance, realEstate |
| **"tăng 2.5%"** connection rate | The source document itself flags it as needing verification; no internal source exists. | education, insurance, realEstate |
| **Voice Brandname** as an available/universal capability | Source-documented, but no product config, carrier agreement, coverage list or approval record. `src/data/internationalCalling.ts` withholds brandname outright for international numbers. Reclassified in §10. | ecommerce |
| **"30+ tích hợp"** | Repo names exactly five platforms with routes. | finance |
| **"30%–50% năng suất"** | No approved case study. | finance |
| **"70+ quốc gia"** | Withheld by the S04 claim guard. | bpo |
| Hours saved, % of calls analysed, staffing cost reduction, out-of-hours availability | No measurement exists. | bpo |
| AI replaces staff / perfect accuracy / 100% of calls | Never publishable without deployment-scope evidence. | bpo, insurance, finance |
| Answer-rate improvement from brand recognition | No measurement exists. | ecommerce |

### Voice Brandname — the one judgement call

The ICP source names Voice Brandname as ICP 2's answer, and the e-commerce page
is where ICP 2 lives.

> **Corrected in WEB-IND-001A.** This section originally said the repository has
> "zero evidence" for Voice Brandname. That overstated it: the capability is
> documented in supplied Gcalls material. What is missing is *operational
> scope* — no carrier list, market coverage or approval record. Reclassified
> `SOURCE-DOCUMENTED — PRODUCT SCOPE CONFIRMATION REQUIRED`. See §10.

It is published under three conditions written into the file header, all of
which must survive future edits:

1. Described as something Gcalls **surveys and supports registration for** with
   network operators — never as an active Gcalls feature.
2. Availability stated as conditional on carrier, market, recipient device and
   approval — never universal, never guaranteed.
3. Explicitly scoped to **domestic** numbers, so it cannot be read as
   contradicting the international claim guard.

If those three cannot be kept true, the card should be removed rather than
softened. This needs product confirmation before launch.

### Sector caution

`finance.ts` and `insurance.ts` carry an extra guard: neither page may state or
imply that Gcalls makes a business compliant with any financial,
data-protection or telecoms regulation, that recordings satisfy a legal
retention requirement, or that call review meets a supervisory standard. Both
pages carry an FAQ that says so in plain Vietnamese.

---

## 4. Verification

| Check | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run lint` | 0 errors; 6 pre-existing warnings in the untouched shadcn kit |
| `npm run build` | Pass — `IndustryPage-*.js` 74.94 kB / 15.87 kB gzip, one chunk for all six routes |
| Routes load | All six `/nganh/…` → 200, render 9 sections each |
| H1 count | Exactly 1 per page, all six |
| Horizontal overflow | None, desktop 1440px and narrow viewport; 0 elements wider than the viewport |
| Hero anchor → capability section | Resolves on all six (verified by id lookup, not by eye) |
| JSON-LD | `BreadcrumbList` + `Service` + `FAQPage` on all six; FAQ node built from the same array the page renders |
| Console | No errors or exceptions |
| CTA routing | `/nganh/giao-duc/` primary CTA → `/lien-he/?intent=consultation&source=consultation&solution=Giải+pháp+cho+ngành+giáo+dục` |
| Internal link targets | All typed `RoutePath`, so a dead internal link cannot compile |
| Products mega menu | "Gcalls Voicebot AI" renders as the fourth item with its supporting label |
| Products hub | Four cards; copy reads "bốn sản phẩm" |
| `robots` meta | `noindex, nofollow` on industry routes |

Mobile was verified at the narrowest viewport this environment allows (500 CSS
px — Chrome's minimum window width on macOS), not at 390 px. Single-column
collapse, Vietnamese wrapping, card-link alignment and the 44px tap targets all
behave correctly there. The sections reuse the same primitives already validated
at 390 px on fifteen other pages, but **a real 390 px pass has not been run**.

---

## 5. Files changed

| File | Purpose |
|---|---|
| `src/data/industries/types.ts` | **New.** Content shape, hierarchy, claim guard. |
| `src/data/industries/index.ts` | **New.** Registry + JSON-LD builder. |
| `src/data/industries/education.ts` | **New.** IND-01. |
| `src/data/industries/finance.ts` | **New.** |
| `src/data/industries/insurance.ts` | **New.** |
| `src/data/industries/realEstate.ts` | **New.** |
| `src/data/industries/ecommerce.ts` | **New.** |
| `src/data/industries/bpo.ts` | **New.** |
| `src/components/industry/sections.tsx` | **New.** Sections 01–07. |
| `src/pages/IndustryPage.tsx` | **New.** Page composition. |
| `src/app/router.tsx` | Six industry routes registered; removed from `SHELL_ROUTES`. |
| `src/config/sitemap.ts` | Six industry entries `shell` → `complete`; WEB-037 visibility flags; WEB-002 copy. |
| `src/config/navigation.ts` | Voicebot in products mega menu and footer. |
| `src/data/hubs.ts` | Voicebot card + decision row; "ba" → "bốn sản phẩm". |
| `docs/CHECKPOINT_IND01_INDUSTRIES.md` | This document. |

No new dependencies.

---

## 6. Deliberately NOT done

- **No industry mockups or screenshots.** Other pages pair a hero with a
  `ProductVisual`; there is no industry-specific visual asset in this repo, and
  inventing one would be a fabricated screenshot. The industry hero is
  text-only, which leaves noticeable whitespace on the right at ≥1280px.
- **The "Nhu cầu" select does not pre-fill on industry pages.** The CTA carries
  the industry in `solution` because that is the only slot that reaches the lead
  payload, and an industry is not one of the approved `LEAD_NEEDS` values. The
  trade-off was attribution over pre-fill; the industry is recorded, the visitor
  picks their own need. Adding six industries to a *needs* list would be
  semantically wrong.
- **`sourcePath` still records `/lien-he/`, not the originating page.** This is
  pre-existing across the whole site, not introduced here — `LeadForm` passes
  the live pathname and the CTA has already navigated by then. Worth fixing
  centrally; out of scope for this checkpoint.
- **The industries hub was not rewritten.** Its six cards already describe each
  industry's operating context and now point at real pages instead of shells.
- **No estimator solution and no pricing band** for any industry — neither
  exists to reference.

---

## 7. Remaining product questions

1. **Auto Dialer and outbound number rotation** — do they exist as shipped
   capability? Three pages currently state the problem and route to
   consultation because the mechanism cannot be named. This is the single
   biggest gap between the ICP source and what the site can say.
2. **Voice Brandname** — which carriers, which markets, what approval process,
   and is there any coverage evidence? See §3.
3. Are any of the withheld figures (2.5%, 30–50%, 70+ countries, 30+
   integrations) backed by an internal source that simply is not in this repo?
4. Is there a real customer in any of these six industries whose case study
   could replace the qualified-outcome section with evidence?

---

## 8. Recommended next checkpoint

**WEB-RES-001 — resources cluster.** Eight `shell` routes remain: six under
`/tai-nguyen/` (blog, guides, case studies, ebook, glossary, FAQ) and two under
`/cong-ty/` (customers, partners). The resources shells are the more valuable
half — `Case Studies` is already linked from the industries hub and from several
industry pages, so it is currently the most-linked shell on the site.

---

# Addendum — Checkpoint WEB-IND-001A (corrective)

Three corrections to the record above, plus a real mobile pass. No industry
page was rebuilt; no Voicebot link was removed; nothing was deployed.

## 9. Privacy classification — CORRECTED

The original report classified this build as "private." That was wrong, and the
distinction matters:

| Control | Present | What it actually does |
|---|---|---|
| `public/robots.txt` `Disallow: /` | Yes | Asks compliant crawlers not to fetch |
| `<meta name="robots">` `noindex, nofollow` | Yes | Asks compliant indexers not to index |
| `X-Robots-Tag` in `public/_headers` | Yes (host-applied) | Same, at transport level |
| Sitemap exclusion | Yes | No `sitemap.xml` is emitted |
| **HTTP Basic Authentication** | **No** | — |
| **Cloudflare Access** | **No** | — |
| **Host password protection** | **No** | — |
| **App-level auth before content** | **No** | — |

Every control in the top half is a *non-indexing* control. None prevents an
unauthenticated visitor from receiving the content. Searched and found absent:
`wrangler.toml`, `_worker.js`, `functions/`, `_middleware*`, `netlify.toml`,
`vercel.json`; `server/` holds only a README; `.env.example` defines no site
credential.

**Classification: `PRIVACY STATUS UNVERIFIED`.**

Not `PRIVATE DRAFT VERIFIED` — no access gate exists to verify. Not
`NON-INDEXABLE BUT PUBLICLY ACCESSIBLE` as a settled fact either, because the
documented preview host `v2.gcalls.co` does not currently resolve (`curl` exit
6, no DNS answer), and Cloudflare Pages `*.pages.dev` preview URLs cannot be
enumerated from here. So there is no evidence of a live public draft — but also
no mechanism that would stop one.

`gcalls.co` itself returns 200 from LiteSpeed/PHP — the existing WordPress
production site, unaffected by this work, exactly as `robots.txt` states.

**Required infrastructure action (separate checkpoint, not done here):** put
Cloudflare Access or Pages password protection in front of the preview
deployment *before* it is shared. Until then, treat any preview URL as public.

## 10. Voice Brandname — evidence reclassified

The original report said Voice Brandname had "zero evidence." Corrected: the
capability **is** documented in supplied Gcalls material (the ICP table for
outbound customer care). What is absent is a product configuration in this
repository fixing its operational scope.

**Classification: `SOURCE-DOCUMENTED — PRODUCT SCOPE CONFIRMATION REQUIRED`.**

A supplied planning document proves a capability was proposed. It does not
establish carrier coverage, market coverage, approval odds or any ROI.

Two supplied sources named in the WEB-IND-001A brief could **not** be verified
here: `DIB-DYNAMIC-INPUT-BRANDING.txt` is not present anywhere in the project,
and `src/imports/SEO-AIO-...pdf` is an image-only Google Sheets export (22
image streams, zero extractable text) — its contents cannot be read without OCR
tooling, which was not added.

**Scope framing was AMBIGUOUS and has been fixed.** The domestic scope lived
only in the section note; the capability card and the FAQ answer both said
"thị trường" unqualified. That mattered because `capability.items[].detail` is
what the JSON-LD `hasOfferCatalog` emits — the scope was absent from structured
data entirely. Minimum wording change applied to `src/data/industries/ecommerce.ts`:

- Card: now "do nhà mạng **trong nước** cung cấp … **chỉ áp dụng cho đầu số
  trong nước** … việc kích hoạt do nhà mạng phê duyệt, **không phải mặc định có
  sẵn**".
- FAQ: same domestic scoping, plus the international carve-out.

Conditional wording verified intact: availability conditional, approval
required, coverage not universal, Gcalls support not described as guaranteed
activation, and **no answer-rate figure anywhere on the page**.

## 11. Responsive QA — real 390px and 360px

The original report tested at 500px (Chrome's macOS minimum window width) and
said so. That was insufficient. WEB-IND-001A used same-origin iframe viewport
emulation, which gives the embedded document a genuine CSS viewport and real
media-query evaluation.

Viewports: 1440×900, 1024×768, 768×1024, 390×844, 360×800 — six routes each,
**30 route/viewport combinations, zero defects.** Effective content widths were
375px and 345px (iframe scrollbar), i.e. *stricter* than the nominal targets.

Per combination: no horizontal overflow, 0 elements wider than the viewport, 0
past the right edge, 0 clipped text nodes, exactly 1 H1, 9 sections, CTAs inside
the viewport at ≥48px height, 11 accordion buttons with 0 overflow, 26 footer
links with 0 overflow, mobile menu button present, diacritics rendering.

One heuristic false positive was investigated and dismissed: the site-wide
skip-to-content link (`a.sr-only`, "Bỏ qua để tới nội dung chính") reports as
clipped because that is what `sr-only` does. Pre-existing, not from this work.

**Pre-existing finding, outside this checkpoint's scope:** the **homepage** at
390px reports 12 elements wider than the viewport and 27 clipped text nodes.
The industry routes report 0 of each. Not touched here — flagging it for a
future checkpoint.

## 12. Hero image slot

All six heroes measure identically: content occupies 60–61% of the container,
leaving **465px empty at 1280px and 480px at 1440px**. Nothing is broken — the
768px content column is a comfortable measure and the H1 sets on three lines —
but the right-hand gap is the size of the `ProductVisual` the product pages use.

All six classified **`IMAGE SLOT RECOMMENDED`**.

`IndustryHero` now accepts an optional `visual` prop. Passing one switches the
hero to the two-column grid the rest of the site uses; passing nothing keeps
today's single column byte-for-byte. Text stays first in DOM order either way.
**No imagery was generated or added** — the slot is wired, not filled.

## 13. WEB-IND-001A validation

| Check | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run lint` | 0 errors; same 6 pre-existing shadcn warnings |
| `npm run build` | Pass — `IndustryPage-*.js` 75.45 kB / 15.97 kB gzip |
| Automated tests | **None exist** — no `test` script, no test files in the project |
| Responsive | 30/30 route×viewport combinations clean |
| JSON-LD | Valid on all six: context, 3-item breadcrumb, Service fields, 4-item OfferCatalog, FAQ node matching the DOM exactly, no Offer/price/rating |
| Anchors | `main-content` and the per-page capability anchor resolve on all six |
| Internal links | 24 unique paths, all present in `ROUTES` — 0 broken |
| CTA attribution | Hero and final CTA both carry `intent` + `source` + industry `solution` |
| Console | No errors or exceptions |

Note: `vite preview` does not apply `public/_headers`, so `X-Robots-Tag` cannot
be observed locally — it is applied by Cloudflare Pages at the edge. The meta
robots tag was verified live and reads `noindex, nofollow` on all six routes.

Canonicals resolve to `https://gcalls.co/nganh/…` — the production origin, which
does not currently serve those paths. Inert while `noindex` is on, but it must
be re-checked at go-live.
