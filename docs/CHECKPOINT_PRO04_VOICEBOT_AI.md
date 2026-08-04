# Checkpoint WEB-PRO-004 — /voicebot-ai/ (Gcalls Voicebot AI)

Full production build of the Voicebot AI product page. Home, Gcalls Plus,
QA QC Center, Gcalls CX and every integration page were not touched, apart from
two stale comments that said Voicebot had no route.

---

## 0. Baseline audit (before work)

| Aspect | Finding |
|---|---|
| Route state | **DID NOT EXIST.** `/voicebot-ai/` was not in `ROUTES`, `SITEMAP`, `SHELL_ROUTES` or the router. |
| Prior decision | `src/config/sitemap.ts` recorded Voicebot as **deliberately out of scope**; `src/data/gcallsCx.ts` and `src/pages/GcallsCxPage.tsx` repeated it. |
| Product evidence in repo | **NONE.** No Voicebot config, no estimator solution/field, no capability entry, no screenshot, no doc. `grep -ri voicebot` returned only the three out-of-scope notes above. |
| Reference page | `/qc-bot-ai/` (QA QC Center) — the closest analogue: an AI product page with data file + sections + visuals and a claim guard. |
| Reusable components | `Container` / `Section` / `SectionHeader` / `Card` / `Eyebrow` / `GradientHeading` / `FeatureSplit` / `ProductVisual` / `FaqAccordion` / `FinalCtaBand` / `Breadcrumb` / `JsonLd`. All reused; none modified. |
| Conversion route | `/lien-he/` via `leadCtaHref()` — the site's single lead surface. Reused as-is. |
| Dependencies | None added. |

## 1. The scope reversal

The brief instructs the page to be built, which reverses a decision the
repository had recorded as "do not reverse without evidence". **The reversal
added no evidence.** It is a product decision, so the page is written entirely
inside the brief's approved positioning and nothing beyond it. The reversal is
documented at the top of `src/config/sitemap.ts` and `src/data/voicebotAi.ts`
rather than being made silently.

Positioning published: Gcalls **tư vấn, kết nối và tích hợp** a Voicebot
solution. The page never claims Gcalls built the Voicebot engine — the
repository does not establish that.

## 2. SEO ownership

| Field | Value |
|---|---|
| SEO title | `Voicebot AI cho doanh nghiệp \| Tự động hóa cuộc gọi \| Gcalls` (`exactTitle: true`) |
| Meta description | `Khám phá giải pháp Voicebot AI giúp doanh nghiệp tự động hóa các cuộc gọi lặp lại, ghi nhận phản hồi và chuyển những tình huống cần thiết cho nhân viên.` |
| Canonical | `https://gcalls.co/voicebot-ai/` |
| Robots | `noindex, nofollow` — the site-wide pre-launch flag, unchanged. `indexable: true` on the entry, so it flips with the rest of the site at go-live. |
| H1 | Exactly one: "Tự động hóa các cuộc gọi lặp lại bằng Voicebot AI" |
| Open Graph | title / description / type / url / site_name / locale, from the shared `Seo` component |

Keywords appear in body copy at natural density; nothing is stuffed.

## 3. Content structure — 12 sections

| # | Section | Component |
|---|---|---|
| 01 | Hero | `VoicebotHero` |
| 02 | Bài toán vận hành | `VoicebotProblems` |
| 03 | Tình huống ứng dụng (anchor `#tinh-huong-ung-dung`) | `VoicebotUseCases` |
| 04 | Quy trình hoạt động | `VoicebotHowItWorks` |
| 05 | Khả năng giải pháp | `VoicebotCapabilities` |
| 06 | Con người và AI | `VoicebotHumanAi` |
| 07 | Tích hợp vào quy trình | `VoicebotIntegration` |
| 08 | Ngành phù hợp | `VoicebotIndustries` |
| 09 | Quy trình triển khai | `VoicebotDeployment` |
| 10 | Giá trị đầu ra | `VoicebotOutcomes` |
| 11 | FAQ | `FaqAccordion` (shared) |
| 12 | Final CTA | `FinalCtaBand` (shared) |

## 4. Claim decisions

Not published, because the repository holds no evidence for any of them:

hour/cost savings · percentage outcomes · multi-region natural voice ·
recognition accuracy · concurrent-call count · language count · 24/7 with SLA ·
"thay thế nhân viên telesales" · a named CRM with an out-of-the-box Voicebot
connector · inbound/outbound guarantee · fixed deployment duration · the
underlying technology vendor.

The guard list lives at the top of `src/data/voicebotAi.ts` so the next editor
meets it before the copy. Register used throughout: "có thể", "được khảo sát",
"theo kịch bản đã thiết lập", "tùy phạm vi triển khai".

Section 06 is load-bearing: it is what keeps the page from reading as "AI thay
thế nhân viên".

## 5. Visual sources

No Voicebot screenshot exists in this repository, so none is shown. Two
conceptual surfaces were built from the design system in
`src/components/voicebot/visuals.tsx`:

- `VoicebotCampaignMockup` — campaign, connection status, response outcomes,
  the group needing a human, interaction history. Hero.
- `VoicebotHandoffMockup` — the handoff queue. Section 05.

Both render inside `ProductVisual` with an explicit **"Minh họa giao diện"**
caption stating they are not a picture of a running system. Contacts are masked
IDs; no PII, no fabricated customer names, no concurrency/accuracy figure.
Replace at this file when authentic screenshots exist.

## 6. Internal link map

| Destination | Route | Where |
|---|---|---|
| Hub Sản phẩm | `/san-pham/` | Breadcrumb + section 07 |
| Hub Giải pháp | `/giai-phap/` | Section 07 |
| Tổng đài tích hợp CRM | `/tong-dai-tich-hop-crm/` | Section 07, FAQ 3 |
| Gcalls CX | `/gcalls-cx/` | Section 07 |
| QC Bot AI | `/qc-bot-ai/` | Section 07 |
| Đăng ký tư vấn | `/lien-he/` | Hero, section 09, FAQ 6, final CTA |
| Ngành | `/nganh/tai-chinh/`, `/nganh/bao-hiem/`, `/nganh/giao-duc/`, `/nganh/thuong-mai-dien-tu/`, `/nganh/bpo/` | Section 08 |

Every target already existed. No route was invented and no page was created
besides this one. Zero `href="#"` and zero dead links on the rendered page.

## 7. Lead capture

The brief proposed `intent=voicebot_consultation`, `source_page=voicebot-ai`,
`product=voicebot-ai`. The project already has a tracking standard, and the
brief says not to invent a second one, so the same three facts ride the existing
typed slots:

```
/lien-he/?intent=consultation&source=voicebot_ai&product=Gcalls+Voicebot+AI
```

- `voicebot_ai` was added to `LeadSource` — every product page has its own
  (`gcalls_plus`, `qa_qc_center`, `gcalls_cx`), so this is the established
  shape, not a new mechanism.
- `Gcalls Voicebot AI` was added to `LEAD_NEEDS` (additive; no existing option
  moved) and to `PRODUCT_DISPLAY_LABELS`, so the contact form pre-selects the
  need. Verified in the browser.
- The origin page is captured by `normalizeLeadPayload` as `sourcePath`; no
  bespoke `source_page` parameter was introduced.

## 8. Responsive & accessibility — actually rendered

Verified in Chrome against the dev server.

| Viewport | Result |
|---|---|
| ~390px (same-origin iframe probe) | `scrollWidth` 371 vs viewport 386 — **no horizontal overflow**; 0 elements exceed the viewport; 12 sections; 1 H1 |
| 1440px | No overflow; hero, capability split and use-case grid render as designed |

- Every link/button in `main` measures ≥ 44px tall on mobile (smallest: 44px).
- Focus states come from the shared components (`focus-visible:outline-2`).
- Anchor target uses `scroll-mt-24`, so the sticky header does not cover the
  heading — measured 96px below the top after the jump.
- Text is live text outside every mockup; no text sits on an image.
- No new animation was added, so nothing to gate behind `prefers-reduced-motion`.

## 9. Structured data

Three nodes: `BreadcrumbList`, `Service`, `FAQPage`.

`Service` rather than `Product`/`SoftwareApplication`: the approved positioning
is consulting/integration, and the repository does not establish that Gcalls
authors the engine. No `Offer`, price, `AggregateRating` or `Review` is emitted.
The FAQ node is generated from the same array the page renders, so the two
cannot drift.

## 10. Verification

| Check | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run lint` | 0 errors; 6 pre-existing warnings in the untouched shadcn kit |
| `npm run build` | Pass — `VoicebotAiPage-*.js` 34.11 kB / 8.63 kB gzip |
| Route loads | `/voicebot-ai/` → 200, renders |
| Console | No errors or React warnings (Vite/React DevTools notices only) |
| Primary CTA | Lands on `/lien-he/` with the need pre-selected as "Gcalls Voicebot AI" |
| Secondary CTA | Jumps to `#tinh-huong-ung-dung` |
| Regression spot-check | `/qc-bot-ai/` and `/san-pham/` unchanged: 1 H1, no overflow |

## 11. Files changed

| File | Purpose |
|---|---|
| `src/data/voicebotAi.ts` | **New.** All copy, lead context, claim guard, JSON-LD builder. |
| `src/components/voicebot/sections.tsx` | **New.** Sections 01–10. |
| `src/components/voicebot/visuals.tsx` | **New.** Two illustrative mockups. |
| `src/pages/VoicebotAiPage.tsx` | **New.** Page composition, breadcrumb, FAQ, final CTA. |
| `src/config/sitemap.ts` | Route `voicebotAi`, entry `WEB-037`, scope note rewritten. |
| `src/app/router.tsx` | Lazy route registration. |
| `src/lib/leads/types.ts` | `voicebot_ai` source, `Gcalls Voicebot AI` need. |
| `src/lib/leads/ctaLink.ts` | Same two values in the allow-lists. |
| `src/data/gcallsCx.ts`, `src/pages/GcallsCxPage.tsx` | Comment-only: Voicebot now has its own route. |
| `docs/CHECKPOINT_PRO04_VOICEBOT_AI.md` | This document. |

## 12. Deliberately NOT done

- **Header, footer and products hub were not touched.** `NAV_GROUPS`,
  `FOOTER_COLUMNS` and `src/data/hubs.ts` are shared surfaces and were out of
  scope, so `/voicebot-ai/` is currently reachable only by direct URL. The
  sitemap entry carries `navVisibility: false` / `footerVisibility: false` to
  record that honestly. **This is the first thing the next checkpoint should
  fix.**
- No estimator solution for Voicebot, so no "Ước tính chi phí" deep link.
- No pricing band — no Voicebot pricing exists to reference.

## Remaining product questions

Every item in §4 needs written product confirmation before it can appear on the
page. In addition:

1. Does Gcalls build the Voicebot, or integrate a partner's? The page currently
   says the latter.
2. Is there a real deployment whose screenshots could replace the mockups?
3. Should Voicebot become an estimator solution?
