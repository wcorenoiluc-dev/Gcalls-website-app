# WordPress export — body-level audit

**Checkpoint:** GCALLS-BLOG-EXPORT-AUDIT-002 · **Date:** 2026-08-13
**Export:** `gcalls-giiphptngichmsckhchhngdnhchodoanhnghip.WordPress.2026-08-12.xml`
(12 MB, WXR 1.2, exported 2026-08-12)
**Type:** ANALYSIS ONLY — no post written, edited, migrated or published; live
WordPress untouched.

---

## 1. What the export contains

| Field | Value |
|---|---|
| Total items | **263** |
| `post_type` | **`post` only** — 0 pages, 0 attachments, 0 comments |
| Status | **191 publish · 70 draft · 2 private** |
| Bodies present | **261 of 263** (2 empty; one has 0 words) |
| Elementor markup in body | 51 posts |
| `_elementor_data` meta | 118 posts |
| `_thumbnail_id` (featured image) | 252 posts |

**Body content is present** — `content:encoded` is populated, so §C's stop
condition is not triggered and the audit proceeded.

**One real gap:** the export is posts-only. With no `attachment` items, the
featured-image *IDs* are present but the image *URLs* are not resolvable from
this file alone. Media URLs must come from the July metadata snapshot or a
second export before any migration.

## 2. Reconciliation with the July snapshot — the corpus moved

| | Count |
|---|---:|
| July 2026 snapshot (published) | 211 |
| August 12 export (published) | **191** |
| Present in both | 191 |
| In July, gone by August | **20** |
| New since July (all unpublished) | **72** — 70 draft + 2 private |

Every one of the 211 July posts that still exists is still `publish`. The 72
new items are Vietnamese articles sitting in draft/private, and ~10 of them are
**exact re-imports of already-published posts** (Jaccard ≥ 0.99).

## 3. Security — the incident is contained ✅

The three post IDs this checkpoint asked to audit are **no longer in
WordPress**:

| Post ID | Status in Aug 12 export |
|---|---|
| 18101 | **ABSENT — removed** |
| 18122 | **ABSENT — removed** |
| 18144 | **ABSENT — removed** |

Of the 20 posts removed between 2026-07-29 and 2026-08-12, **19 were injected
gambling spam** (Russian, Polish and Turkish casino/betting content). The single
non-spam removal was `18048 "HR Parttime Copy"`, a 525-word internal duplicate.

**Residual scan of all 263 current posts: zero spam, zero `<script>`, zero
`<iframe>`.** 260 posts are Vietnamese; 3 are non-Vietnamese and flagged
`MANUAL_REVIEW` (they are not gambling content).

Recorded in `blog-security-incident.csv`. Two caveats: the July snapshot held
metadata only, so **author, outbound domains and script indicators for the
removed posts were never captured** and cannot be recovered from local
evidence — the register records them as `NOT_CAPTURED` rather than inventing
values. And removal from WordPress is not the same as containment: the entry
vector is still unknown. Worth confirming no attacker user account, scheduled
task or plugin backdoor remains, and that the 20 URLs return **410**.

## 4. Body-level findings (263 posts)

**Word count** — median 1,454, max 7,367, min 0:

| Band | Threshold | Posts |
|---|---|---:|
| THIN | < 600 words | **19** |
| BELOW_STANDARD | 600–899 | 5 |
| ADEQUATE_SHORT | 900–1,199 | 56 |
| ADEQUATE | 1,200–1,999 | 104 |
| STRONG | ≥ 2,000 | 79 |

**Structure.** Only 8 posts contain an `<h1>` in the body — correct, since
WordPress renders the post title as the page H1; a body H1 would *duplicate* it.
One post has 2 body H1s (real duplicate-H1 defect). Three posts have no headings
at all.

**Duplicates.** Naïve shingle matching flagged 123 posts, which was inflated by
shared boilerplate. After removing tokens appearing in >40% of documents and
requiring Jaccard ≥ 0.45 on distinctive vocabulary, the real figure is **18
pairs / 32 posts**, in three clean groups: draft re-imports of published posts,
Jabra/EPOS headset product listings, and HR job adverts.

**Links.** No broken-link check was performed — that requires live HTTP requests
to hundreds of third-party URLs and was out of scope here. Outbound domains per
post are recorded in `blog-body-audit.csv` for review.

**Images.** 11 posts have no featured image. 252 have an ID but no resolvable
URL from this export (see §1).

**CTA.** 11 posts have no Gcalls CTA in their closing section.

## 5. Claims — the material risk

**79 of 263 posts (30%) carry at least one blocked-claim pattern in the body.**
102 individual claim instances, all recorded in `blog-claim-register.csv`:

| Pattern | Instances | Priority |
|---|---:|---|
| `customer_named` (case-study / named-customer language) | 21 | **P1 — VERIFY_LEGAL** |
| `always_247` | 19 | P2 |
| `unlimited` | 19 | P2 |
| `pricing` (prices, plans, free-trial periods) | 16 | P2 |
| `setup_time` | 9 | P2 |
| `sla_uptime` | 5 | P2 |
| `perf_30_50` | 3 | **P1** |
| `countries_70` | 3 | **P1** |
| `qc_100` | 3 | **P1** |
| `never_miss` | 2 | P2 |
| `save_50_80` | 2 | **P1** |

This is the single largest obstacle to republishing. The 21 `customer_named`
posts need **written customer permission**, not just Product sign-off, and the
site already has a documented policy of publishing no customer name without it.

## 6. Hub distribution — totals to 263

| Hub | Total | Publish | Draft/Private |
|---|---:|---:|---:|
| HUB-01 Tổng đài và Call Center | 49 | 41 | 8 |
| HUB-02 CRM, Helpdesk và tích hợp | 14 | 6 | 8 |
| HUB-03 Telesales và Sales Operations | 67 | 47 | 20 |
| HUB-04 Customer Service và CX | 53 | 26 | 27 |
| HUB-05 QA/QC và quản trị chất lượng | 1 | 1 | 0 |
| HUB-06 Voicebot, AI và tự động hóa | 1 | 1 | 0 |
| HUB-07 Tổng đài quốc tế | **0** | 0 | 0 |
| HUB-08 Kiến thức vận hành doanh nghiệp | 78 | 69 | 9 |
| HUB-09 Hướng dẫn sử dụng Gcalls | **0** | 0 | 0 |
| HUB-10 Case study | **0** | 0 | 0 |
| **TOTAL** | **263** | **191** | **72** |

The imbalance is the strategic finding: 78 posts of generic business knowledge
and 67 on telesales, against **2 posts total** across QA/QC and Voicebot, and
**nothing at all** on international calling — the four areas Gcalls now sells.

## 7. Answering the count questions (§G)

- **ADEQUATE_SHORT** = 900–1,199 words. Long enough to publish, short of the
  1,200-word supporting-article target. **56 posts.**
- **THIN** = under 600 words. Below any publishable standard; default action
  `RETIRE_410`. **19 posts.**
- **Bands are mutually exclusive** — each post falls in exactly one, so a post
  cannot be both. The earlier report's "55 ADEQUATE_SHORT / 16 THIN" came from
  the July *metadata* word counts; these figures come from measuring the actual
  bodies, which is why they moved.

## 8. Triage

| Action | Posts |
|---|---:|
| KEEP_AS_IS | 89 |
| NORMALIZE (Elementor unwrap) | 67 |
| VERIFY_PRODUCT | 54 |
| RETIRE_410 | 20 |
| VERIFY_LEGAL | 17 |
| MANUAL_REVIEW | 6 |
| REFRESH_METADATA | 6 |
| MERGE | 2 |
| EXPAND | 2 |
| **Total** | **263** |

Priority: **P1 47 · P2 189 · P3 27**.

## 9. Batch plan

| Batch | Scope | Posts |
|---|---|---:|
| 0 | Spam / security containment | **0 — already removed; verification only** |
| 1 | STRONG posts, normalise & keep | 29 |
| 2 | CRM / Helpdesk / Integration | 6 |
| 3 | QA/QC | 1 |
| 4 | Voicebot & AI | 1 |
| 5 | Tổng đài quốc tế | **0 — no content exists** |
| 6 | Telesales / Call Center / CX | 83 |
| 7 | Kiến thức vận hành doanh nghiệp | 54 |
| 8 | Non-editorial & draft duplicates | 89 |
| | **Total** | **263** |

Batches 3, 4 and 5 are nearly empty because the content does not exist. They are
served by the gap map, not by migration.

## 10. Permalink decision — applied

Locked and applied to `blog-redirect-map.csv`: `/blog/` is the archive, all 263
post URLs **stay at root**, no bulk move, **no 301s**. Every row now reads
`KEEP_EXISTING_URL`. The 20 removed URLs are `SECURITY_REVIEW`, pending a 410
decision — not redirected.

## 11. Net-new content gaps

12 proposed articles across the four starved hubs (CRM/Helpdesk 3, QA/QC 3,
Voicebot 3, International 3) in `blog-content-gap.csv`, each with keyword,
intent, persona, funnel stage, tier, target product, link targets, claim
constraint and image brief. No case study proposed — none can exist without
permissioned customer data.

## 12. Recommended next steps

1. **Verify containment**, not just removal: confirm no attacker account,
   scheduled task or plugin backdoor remains, and set the 20 URLs to 410.
2. **Second export including attachments**, to resolve featured-image URLs.
3. **Batch 0.5 — claim remediation.** 79 posts and 102 claims; the 21
   `customer_named` posts need legal clearance. This gates republication more
   than any content work.
4. **Batch 8 first, not last.** 89 non-editorial and duplicate items (headset
   listings, job ads, draft re-imports) should leave the blog corpus before
   anyone counts articles again.
5. Then Batch 1, and the gap map in parallel — the empty hubs are where Gcalls
   sells.
