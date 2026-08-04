# Checkpoint S04 — International Calling

**Route:** `/tong-dai-quoc-te/`
**Status:** CONTENT LOCKED V1
**Date:** 2026-07-30

---

## 1. Initial status

**SHELL.**

Before this checkpoint the route was served by `ShellPage` → `RouteShell`, which
read the sitemap entry `WEB-010` and rendered a breadcrumb, an H1 from the nav
label, a one-sentence intro, three related-page cards and a generic CTA. Total
rendered body text: roughly 1.1 KB. No section from the required list existed.

The route was listed in `SHELL_ROUTES` in `src/app/router.tsx` and marked
`status: 'shell'` in `src/config/sitemap.ts`.

---

## 2. What was built

| File | Role |
|---|---|
| `src/data/internationalCalling.ts` | All approved copy, the claim guard, the evidence gates, the estimator deep link and the JSON-LD builder |
| `src/pages/InternationalCallingPage.tsx` | Page composition — 17 sections, exactly one `<h1>` |
| `src/components/international/visuals.tsx` | Two conceptual product surfaces (number directory, call routing) |
| `src/app/router.tsx` | Route moved out of `SHELL_ROUTES` onto its own lazy component |
| `src/config/sitemap.ts` | `WEB-010` status `shell` → `complete` |

No shared component was modified. The page is composed from the existing
integration/solution kit (`IntegrationHero`, `IntegrationProblems`,
`IntegrationSteps`, `IntegrationBoundaries`, `IntegrationUseCases`,
`FeatureSplit`, `PricingCtaBand`, `FinalCtaBand`, `FaqAccordion`), so it is
visually identical in language to CRM / Helpdesk / POS.

---

## 3. Final sections — all 17 required sections present

| # | Section | Anchor / heading id |
|---|---|---|
| 01 | Hero (H1) | — |
| 02 | Direct answer | `tong-dai-quoc-te-la-gi` |
| 03 | Problems | `bai-toan-quoc-te` |
| 04 | International number concept | `dau-so-quoc-te` |
| 05 | Country / regulation differences (+ requested-markets block) | `khac-biet-quoc-gia`, `thi-truong-thuong-gap` |
| 06 | How it works | `cach-hoat-dong` / `cach-trien-khai-heading` |
| 07 | Inbound | `cuoc-goi-den` |
| 08 | Outbound | `cuoc-goi-ra` |
| 09 | Number registration / documentation | `dang-ky-dau-so` |
| 10 | Operational management | `quan-ly-van-hanh` |
| 11 | International use cases | `use-case-quoc-te` |
| 12 | Product boundaries | `ranh-gioi-quoc-te` |
| 13 | Deployment | `trien-khai-quoc-te` |
| 14 | Configuration & cost (+ estimator band) | `chi-phi-quoc-te`, `uoc-tinh-quoc-te` |
| 15 | Trust | `cach-lam-viec` |
| 16 | FAQ (7 questions) | `faq-quoc-te` |
| 17 | Final CTA | `cta-quoc-te` |

---

## 4. SEO

| | |
|---|---|
| Primary topic | tổng đài quốc tế |
| H1 | Tổng đài quốc tế – kết nối doanh nghiệp với khách hàng tại nhiều thị trường |
| Title | Tổng đài quốc tế \| Đầu số và liên lạc đa thị trường \| Gcalls |
| Direct answer | Present as plain visible text, never collapsed into an accordion |
| Structured data | 4 nodes — `BreadcrumbList`, `Service`, `SoftwareApplication`, `FAQPage` |
| Deliberately NOT emitted | `areaServed`, any country list, `Offer`, price, `AggregateRating`, `Review`, SLA/uptime property. `areaServed` in particular would be a machine-readable coverage claim. |
| Keyword territory | No CRM / Helpdesk / POS keyword is competed for; the boundary table routes those needs away. |

---

## 5. Claims withheld

All five claims named in the brief are **withheld**. No current evidence for any
of them exists in this repository.

| Historical claim | Decision | Published register instead |
|---|---|---|
| 70+ quốc gia | **WITHHELD** — no verified coverage list exists | "nhiều thị trường"; markets appear only as *requested*, each carrying a "Cần khảo sát" state |
| Tiết kiệm 80–90% | **WITHHELD** — no cost baseline, benchmark or study exists | Cost stated by factor: quốc gia, loại đầu số, hồ sơ đăng ký, lưu lượng |
| Triển khai 1 ngày – 1 tuần | **WITHHELD** — no timeline evidence exists | Ordered steps with no duration on any step and no total; "Thời gian xử lý phụ thuộc vào quốc gia, loại đầu số và tính đầy đủ của hồ sơ" |
| Brandname | **WITHHELD** — no evidence of brandname/CLI display support, and display is regulated per country | "Số hiển thị phụ thuộc vào cấu hình đầu số và quy định về hiển thị số tại quốc gia được gọi đến" |
| SLA | **WITHHELD** — no signed or published SLA exists | Not mentioned. No uptime, latency or voice-quality figure appears. |

### Evidence gates recorded in the data file

- **§M — market names.** Published as *requested* markets only, never as
  coverage. The six names are exactly the options the approved estimator already
  shows visitors, where they are an INPUT (a visitor describing where they need
  to operate), not proof of supply. Every rendering must carry the structural
  qualifier plus a per-item "Cần khảo sát" state. No count, no map, no coverage
  wording. Mirrors the S03 §19 decision on POS vendor names.
- **§T — number types.** Categories explained (local / toll-free / national)
  because `pricing.ts` evidences "loại đầu số" as a real cost driver, but no
  category is claimed as available in any specific market.
- **§B — caller-ID display.** Not published; conditional wording only.
- **§D — setup timeline.** Not published; ordered steps only.
- **§Q — voice quality / uptime.** Not published.
- **§TR — trust.** Neutral. No customer case, logo, quote or figure exists, so
  none is published; the section states the per-market survey position instead.

### Visual rules (`src/components/international/visuals.tsx`)

No country name, flag, map, dialling code (+1, +44, +65) or phone digit is drawn
anywhere. Number slots are abstract — "Thị trường 01/02/03" — because naming a
country inside a product surface would read as a coverage claim. No third-party
carrier interface is imitated. Marked `DEMO_VISUAL_REPLACE_LATER`; this file is
the single swap point when real screenshots exist.

---

## 6. CTA

| Surface | Destination |
|---|---|
| Hero primary | `/lien-he/?intent=consultation&source=international&solution=Tổng+đài+quốc+tế` |
| Hero secondary | `#cach-hoat-dong` in-page anchor |
| Trust CTA | Same lead route as hero |
| Cost band primary | `/uoc-tinh-chi-phi/?product=international` |
| Cost band secondary | `/bang-gia/` |
| Final CTA primary | Same lead route as hero |
| Final CTA secondary | `/uoc-tinh-chi-phi/?product=international` |

`international` is already the estimator's internal solution id, so — unlike
CRM, Helpdesk, POS and CX — **no slug alias was needed**. Click-tested: the
estimator arrives with "Tổng đài quốc tế" pre-selected, and the contact form
arrives with "Nhu cầu: Tổng đài quốc tế" pre-selected.

`source: 'international'` (LeadSource) and `'Tổng đài quốc tế'` (LEAD_NEEDS)
were both pre-existing values, so **no shared type changed** for this page.

---

## 7. Responsive

Measured in a real fixed-width viewport, not by inspection:

| Width | Horizontal overflow |
|---|---|
| 390 | 0 |
| 430 | 0 |
| 768 | 0 |
| 1024 | 0 |
| 1440 | 0 |

Also verified at 390px: header collapses to the hamburger, breadcrumb wraps
without clipping, H1 fits, hero CTAs stack full-width, the market chips wrap,
and the mobile menu marks "Tổng đài quốc tế" as current.

---

## 8. Status

**CONTENT LOCKED V1.**

Copy in `src/data/internationalCalling.ts` must not be rewritten, shortened or
"improved". Read the claim guard and the evidence gates at the head of that file
before any edit. Reversing a gate requires evidence, not judgement.

### Highest-value content unlock

A **verified market list** — which countries Gcalls can actually supply numbers
in, and under what conditions. With that evidence, §M can be reopened and the
page can state coverage instead of requests. Without it, the current framing is
the strongest honest position available.
