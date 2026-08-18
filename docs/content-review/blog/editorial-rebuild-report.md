# Gcalls blog — editorial rebuild system

**Checkpoint:** GCALLS-BLOG-EDITORIAL-REBUILD-003, corrected at
GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING · **Date:** 2026-08-13, revised 2026-08-15
**Input:** `…WordPress.2026-08-12.xml` — 263 posts (191 publish, 70 draft, 2 private)
**Type:** PLANNING, plus Batch 1 authored. Batches 2–13 remain planning only. No
image produced, no import, no push, no deploy.

> **Correction, 2026-08-15.** The Batch 1 slate this report originally described
> was wrong: fifteen of its eighteen articles were competitor reviews, an
> angel-investor piece, a referral-programme page and a DIY call-recording
> tutorial, and fourteen of the eighteen sat in a single hub. Asher approved a
> replacement slate of eighteen articles across seven strategic hubs
> (3/2/3/2/3/2/3), and those eighteen are now written. Sections 2, 5, 10 and 12
> below are updated; everything else stands.

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
| RETIRE_410 | **24** | Non-editorial or off-ICP, previously published; 410 Gone |
| RETIRE_NO_PUBLIC_URL | **1** | Never published, no public URL to retire; no 410, no redirect |
| MANUAL_DECISION | **2** | Non-Vietnamese body; still open |
| **Total** | **263** | ✅ |

### RETIRE_NO_PUBLIC_URL — a new verb, and why it was needed

`RETIRE_410` presupposes a URL that once resolved. WordPress only assigns
`post_name` on publish, so a draft that was never published has no pretty
permalink at all — only `?p=<id>`. Returning 410 for a URL that never existed
publishes information about a resource nobody could ever reach, and it cannot be
implemented, because there is no path to attach the status to.

`RETIRE_NO_PUBLIC_URL` records the same editorial outcome (the post does not
enter the new blog) with the correct HTTP consequence: nothing. No 410, no
redirect, and specifically no redirect to the homepage.

The rule that decides between the two verbs:

| Was there ever a public URL? | Decision | HTTP |
|---|---|---|
| Yes — `post_status=publish` and `post_name` set | `RETIRE_410` | 410 Gone |
| No — draft, `post_name` empty, only `?p=<id>` | `RETIRE_NO_PUBLIC_URL` | none |

`scripts/verify-blog-batch-01.mjs` validates the vocabulary and asserts the
decision total is still 263.

### The three manual decisions Asher resolved

| ID | Title | Evidence | Decision |
|---|---|---|---|
| 9980 | Tai nghe EPOS Sennheiser 30 USB CTRL | `post_status=PUBLISH`, `post_name=tai-nghe-epos-sennheiser-30-usb-ctrl`, public URL existed | `RETIRE_410` — headset products never enter the blog |
| 9991 | Tai nghe EPOS Sennheiser SC 60 USB CTRL | `post_status=PUBLISH`, `post_name=tai-nghe-epos-sennheiser-sc-60-usb-ctrl`, public URL existed | `RETIRE_410` — same |
| 15328 | salesforce | `post_status=DRAFT`, `post_name` empty, permalink only `?p=15328` | `RETIRE_NO_PUBLIC_URL` |

None of the three redirects anywhere, and none redirects to the homepage.

> **Two MANUAL_DECISION rows are still open, and they are not the ones the
> checkpoint named.** The checkpoint listed 9980, 9991 and 15328 as the three
> `MANUAL_DECISION` rows. In the system as built, 9980 and 9991 were already
> `RETIRE_410` in Batch 0 — the actual unresolved pair is **10732** ("Ebook: Bí
> quyết telesales hiệu quả", draft) and **14773** ("Best Virtual Phone System
> For Small Medium Business 2023", published). Asher's instruction has been
> applied verbatim to all three named IDs, and the decision on 15328 is now
> recorded. 10732 and 14773 were NOT auto-retired: both are on-topic articles
> whose only defect is language, and retiring 14773 in particular would discard
> a published, topically relevant URL. They need Asher's call: re-scope into
> Vietnamese, or retire.

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
| HUB-03 CRM, Helpdesk và tích hợp | 15 | 2 | 17 | ADEQUATE |
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
| **TOTAL** | **227** | **13** | **240** | |

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
| 1 | **Corrected slate — 18 P0 articles across 7 strategic hubs** | 7 | 11 |
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
| 13 | **Integration landscape** — competitor and platform comparisons, third-party facts must be verified before authoring | 10 | — |

Batches 4, 6 and 11 contain **no legacy rows at all** — they are entirely
net-new, which is exactly what the hub table predicts.

### What happened to the fifteen articles removed from Batch 1

Nothing was deleted from the editorial system. Each row was re-homed:

| Rows | Destination | Reason |
|---|---|---|
| 2621, 2437, 2850, 2819, 2835, 2864, 2883, 2584, 15380, 15384 | **Batch 13 — integration landscape** | Competitor and platform reviews. They may be written only after third-party facts are verified, which is not something this batch could do. |
| 2244 | Batch 7 (Gcalls CX & Customer Service) | Genuine CX scaling topic; hub corrected to HUB-05. |
| 1967 | Batch 6 (Tổng đài quốc tế) | Genuine international topic; hub confirmed HUB-09. |
| 553 | `MANUAL_REVIEW` | Referral-programme content, not blog editorial. |
| 16271 | `MANUAL_REVIEW` | Angel investors — outside the Gcalls ICP entirely. |
| 16324 | `MANUAL_REVIEW` | DIY call-recording tutorial; recording obligations are jurisdiction-dependent and the topic does not serve the ICP. |

## 11. Article standard (§J)

Every rebuilt article is briefed for: one H1; a 40–80 word direct answer; table
of contents; logical H2/H3; concept; real operational pain; process or
application; checklist; 4–6 question FAQ; matched CTA; 2–5 internal links; SEO
title; meta description; self-canonical; Article + Breadcrumb schema; new
featured image; 1–3 new in-article images. Length: pillar 2,000–3,000,
supporting 1,200–2,000, narrow topics ≥900.

## 12. Batch 1 — written

Eighteen articles, all written from a blank page, all `status: draft`, none
indexed. Locked distribution:

| HUB | Articles | Pillar | Supporting |
|---|---:|---:|---:|
| HUB-01 Tổng đài và Call Center | 3 | 2 | 1 |
| HUB-02 Gcalls Plus Webphone | 2 | 1 | 1 |
| HUB-03 CRM, Helpdesk và tích hợp | 3 | 1 | 2 |
| HUB-06 Gcalls CX | 2 | 1 | 1 |
| HUB-07 QA/QC và quản trị chất lượng | 3 | 1 | 2 |
| HUB-08 Voicebot, AI và tự động hóa | 2 | 1 | 1 |
| HUB-09 Tổng đài quốc tế | 3 | 1 | 2 |
| **Total** | **18** | **8** | **10** |

Seven re-scoped legacy topics keeping their published root URL, eleven net-new.
No competitor review, no angel-investor article, no referral-programme article,
no DIY call-recording tutorial.

The articles live in `src/data/blog/`, not in `content/blog/*.md`. The reasoning
is written out at the head of `src/data/blog/types.ts`: this repository has no
Markdown or YAML dependency and no network install was permitted, so a `.md`
pipeline would have meant a hand-rolled parser and an untyped second content
source beside the typed one — the exact "two content sources" the checkpoint
forbids. Every frontmatter field the checkpoint specified is present on
`BlogArticleMeta` under the same name.

## 13. What happens next

1. **Image production.** Thirty briefs are written and not one asset exists.
   Nothing in Batch 1 can be published until they are produced and, for the
   product screenshots, masked.
2. **Two MANUAL_DECISION rows are still open** — 10732 and 14773. See §2.
3. **The net-new slate is still too small.** Thirteen articles will not fix four
   hubs that are empty or near-empty. Batch 1 proves the format; the slate
   should now expand substantially.
4. **Batch 13 needs a verification method before it can start.** Competitor
   comparisons cannot be written from memory, and the checkpoint is explicit
   that third-party facts must be verified.
