# Gcalls blog — editorial rebuild system

**Checkpoint:** GCALLS-BLOG-EDITORIAL-REBUILD-003 · **Date:** 2026-08-13
**Input:** `…WordPress.2026-08-12.xml` — 263 posts (191 publish, 70 draft, 2 private)
**Type:** PLANNING ONLY — no article body written, no image produced, no import,
no push, no deploy.

---

## 1. What this system is

Every article that survives triage is **written from scratch**. The XML is used
only as a list of topics, URLs, slugs, IDs and statuses. No legacy prose,
outline, metadata, CTA, FAQ, claim, internal link or image is carried forward.

Legacy bodies were read for exactly three purposes, all mechanical:

1. detecting exact draft re-imports (Jaccard on distinctive vocabulary),
2. confirming no spam or injected markup remains,
3. disambiguating a hub when the title alone was not decisive (~30 rows).

No sentence, heading or structure from a legacy post enters the new corpus.

## 2. Editorial decisions — all 263 rows

| Decision | Rows | Meaning |
|---|---:|---|
| REBUILD_KEEP_URL | **126** | Topic on-target; legacy root URL preserved; article 100% new |
| REBUILD_UPDATE_TOPIC | **101** | Topic re-scoped to the Gcalls ICP; article 100% new |
| MERGE_INTO_PRIMARY | **9** | Duplicate intent; consolidated onto one primary URL |
| RETIRE_410 | **24** | Non-editorial or off-ICP; no replacement |
| MANUAL_DECISION | **3** | Non-Vietnamese body; needs a human call |
| **Total** | **263** | ✅ |

**227 new articles** will be written from the legacy corpus, plus **12 net-new**
in the starved hubs = **239 planned articles**.

The legacy verbs `KEEP_AS_IS`, `NORMALIZE`, `EXPAND_LEGACY` and
`REFRESH_METADATA_ONLY` from EXPORT-AUDIT-002 are **not used anywhere** — they
presuppose republishing old prose, which this system forbids.

## 3. Deduplication (§F)

`MERGE_INTO_PRIMARY` was resolved with union-find over the strict duplicate
pairs, choosing one primary per cluster by: published beats draft → more words
→ lower post ID. All 9 merge rows carry a primary post ID and a final URL.

Also removed ahead of hub assignment:

- **Headset product listings** (Jabra, EPOS, Sennheiser) — e-commerce entries, not editorial.
- **HR job adverts** (intern, fulltime, parttime) — recruitment, not ICP content.
- **Off-ICP marketplace content** (Lazada advertising, real-estate sales process) where it sat in the generic hub.
- **3 non-Vietnamese posts** — held for manual decision, not auto-retired.

One intent keeps one primary URL. No redirect is proposed to a target of a
different intent, and nothing is redirected to the homepage.

## 4. URL policy applied (§D locked decision)

| | Rows |
|---|---:|
| Legacy root URL preserved | **202** |
| New root URL (never-published draft, no legacy URL to keep) | 25 |
| Consolidated onto a primary | 9 |
| Retired to 410 | 24 |
| Held | 3 |

`/blog/` remains the **archive**. No bulk move to `/blog/<slug>/`, no 301 sweep.
The 25 new URLs are for drafts that were never published — WordPress only
assigns `post_name` on publish, so 32 drafts have no slug at all and nothing to
preserve.

## 5. Hub distribution — rebuilt articles

| Hub | Rebuilt | Net-new | Total | Verdict |
|---|---:|---:|---:|---|
| HUB-01 Tổng đài và Call Center | 42 | 0 | 42 | ADEQUATE |
| HUB-02 Gcalls Plus Webphone | 1 | 1 | 2 | **THIN** |
| HUB-03 CRM, Helpdesk và tích hợp | 15 | 1 | 16 | ADEQUATE |
| HUB-04 Telesales và Sales Operations | 77 | 0 | 77 | ADEQUATE |
| HUB-05 Customer Service và CX | 34 | 0 | 34 | ADEQUATE |
| HUB-06 Gcalls CX | **0** | 2 | 2 | **NO LEGACY CONTENT** |
| HUB-07 QA/QC và quản trị chất lượng | 3 | 2 | 5 | **THIN** |
| HUB-08 Voicebot, AI và tự động hóa | 3 | 2 | 5 | **THIN** |
| HUB-09 Tổng đài quốc tế | 1 | 3 | 4 | **THIN** |
| HUB-10 Cloud Call Center và làm việc từ xa | 2 | 0 | 2 | **THIN** |
| HUB-11 Vận hành doanh nghiệp | 49 | 0 | 49 | ADEQUATE |
| HUB-12 Hướng dẫn sử dụng Gcalls | **0** | 1 | 1 | **NO LEGACY CONTENT** |
| HUB-13 Case study | **0** | 0 | 0 | Requires permissioned data |
| **TOTAL** | **227** | **12** | **239** | |

**The strategic finding survives the rebuild.** 77 telesales and 49 generic
operations articles against 2 for Gcalls CX, 5 for QA/QC, 5 for Voicebot and 4
for international. Rewriting the legacy corpus does not fix this; only net-new
does. Twelve proposals are a floor, not a plan.

## 6. Priority

**P0 22 · P1 145 · P2 49 · P3 47.** P0 is small because the legacy corpus barely
touches the P0 hubs — which is the point of the gap.

## 7. Keyword cannibalization

15 primary-keyword collisions covering 33 articles, all recorded in
`editorial-cannibalization-map.csv` with a designated pillar and the instruction
to re-scope the non-pillar titles to distinct long-tail intents at authoring
time. Nothing is left as an accidental duplicate target.

## 8. Image policy (§L)

All images new. Classification per hub:

| Classification | Applies to |
|---|---|
| PRODUCT_SCREENSHOT_REQUIRED | Gcalls Plus, Gcalls CX, QA/QC, Hướng dẫn |
| CUSTOM_DIAGRAM_REQUIRED | Call Center, CRM/Helpdesk, Voicebot, International, Cloud |
| EDITORIAL_ILLUSTRATION_REQUIRED | Telesales, Customer Service, Vận hành |
| BRAND_VISUAL_REQUIRED | Case study |
| NO_IMAGE_BEYOND_FEATURED | available where an article needs no in-body visual |

Every brief carries what it must show, 16:9 at 1600×900, source, masking rules,
planned alt text, usage and reusability. Product screenshots must mask customer
names, phone numbers, recordings, agent identities and tenant name, and be
labelled illustrative. **No legacy featured image or Elementor layout is
reused. The ICP image `20260716-222433.png` is not used anywhere.**

## 9. Claim safety

No blocked claim may appear in any rebuilt article: 30–50%, 40%, 50–80%, 70+
countries, 100%, 1,200 hours, 24/7, SLA/uptime, 5-minute/30-minute/one-day
deployment, AI fully replacing humans, never-miss-a-lead, unverified pricing,
unpermissioned customer names.

Because every article is written new, the 102 claim instances found in the
legacy bodies at EXPORT-AUDIT-002 are **not inherited** — they die with the old
prose. That is the strongest argument for rebuilding rather than normalising.

Voicebot copy is fixed: *Gcalls tư vấn, kết nối và tích hợp Voicebot* — no
engine-ownership claim. QA/QC copy may not claim AI replaces human verification.

## 10. Batch plan

| Batch | Scope | Legacy rows | Net-new |
|---|---|---:|---:|
| 0 | Dedupe, URL decisions, security exclusions, non-editorial filtering | 36 | — |
| 1 | Top 18 P0 conversion articles | 18 | — |
| 2 | Gcalls Plus & Call Center | 42 | 1 |
| 3 | CRM / Helpdesk | 3 | 1 |
| 4 | QA/QC | 0 | 2 |
| 5 | Voicebot / AI | 2 | 2 |
| 6 | Tổng đài quốc tế | 0 | 3 |
| 7 | Gcalls CX & Customer Service | 34 | 2 |
| 8 | Telesales / Sales Operations | 77 | — |
| 9 | Cloud Call Center & remote | 2 | — |
| 10 | Vận hành doanh nghiệp | 49 | — |
| 11 | Hướng dẫn sử dụng Gcalls | 0 | 1 |
| 12 | Remaining supporting content | 0 | — |

Batches 4, 6 and 11 contain **no legacy rows at all** — they are entirely
net-new, which is exactly what the hub table predicts.

## 11. Article standard (§J)

Every rebuilt article is briefed for: one H1; a 40–80 word direct answer; table
of contents; logical H2/H3; concept; real operational pain; process or
application; checklist; 4–6 question FAQ; matched CTA; 2–5 internal links; SEO
title; meta description; self-canonical; Article + Breadcrumb schema; new
featured image; 1–3 new in-article images. Length: pillar 2,000–3,000,
supporting 1,200–2,000, narrow topics ≥900.

## 12. What happens next

Batch 1 is authorable now — 18 P0 articles with hub, intent, persona, funnel
stage, keyword, CTA, link targets and image briefs all assigned. Two things
should be settled alongside it:

1. **The 3 MANUAL_DECISION rows** need a human call.
2. **The net-new slate is too small.** Twelve articles will not fix four hubs
   that are empty or near-empty. Expect to expand it substantially once Batch 1
   proves the format.
