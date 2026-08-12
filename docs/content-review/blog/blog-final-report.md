# Blog inventory and reconciliation — Checkpoint GCALLS-BLOG-COMPLETE-001

**Type:** ANALYSIS ONLY — no article was written, rewritten or migrated
**Date:** 2026-08-12 · **Base commit:** `b3c927f`
**Result:** inventory complete; content work **BLOCKED** pending a scope decision

---

## 1. The headline finding

The checkpoint asks to inventory "100% of blog articles in the Gcalls source"
and expects roughly 46. Neither number matches what is on disk. There are three
different populations, and conflating them is what produced the 46:

| Where | Count | What it is |
|---|---:|---|
| This React repository | **0** | `/blog/` is an editorial *foundation* page. It publishes six category scopes and states plainly that no article exists. |
| Live `gcalls.co` WordPress | **211** | Real published posts, measured (not sampled) in July 2026. |
| Checkpoint expectation | ~46 | Matches no population — but see §2. |

**The article prose is not in this repository.** What exists locally is a
metadata inventory — title, slug, URL, word count, heading count, meta
description, featured image — captured at
`gcalls-recovery-2026-07-29/untracked/docs/blog-url-inventory.csv`, which is
outside the repo and untracked. No `post_content` is stored anywhere on this
machine. That is why sections D, E, F and I of the checkpoint cannot be
executed: there is nothing on disk to rewrite.

### The source of "46"

`HUB-03 Telesales và Sales Operations` contains **exactly 46 posts**. That is
almost certainly the origin of the figure — a single hub's worth of the corpus,
carried forward as if it were the whole blog.

### Why the source has zero articles, deliberately

`src/data/resources/blog.ts` and `src/data/resources/types.ts` carry an explicit
guard, written in an earlier checkpoint:

> NOT PERMITTED HERE, EVER, UNTIL A REAL ARTICLE EXISTS: article titles,
> authors, publication dates, reading times, view counts, thumbnails, "coming
> soon" cards that look like articles, and `Article` or `BlogPosting`
> structured data.

Authoring 46 articles into this source to satisfy a count would breach that
guard and the checkpoint's own instruction — *"Không tự tạo đủ 46 chỉ để khớp
số cũ."* It was not done.

---

## 2. Corpus profile (211 live posts)

**Hub distribution** — every post classified against the ten hubs in §C:

| Hub | Posts |
|---|---:|
| HUB-08 Kiến thức vận hành doanh nghiệp | 90 |
| HUB-03 Telesales và Sales Operations | 46 |
| HUB-01 Tổng đài và Call Center | 41 |
| HUB-04 Customer Service và Customer Experience | 21 |
| HUB-02 CRM, Helpdesk và tích hợp | 6 |
| HUB-05 QA/QC và quản trị chất lượng | 3 |
| HUB-09 Hướng dẫn sử dụng Gcalls | 3 |
| HUB-06 Voicebot, AI và tự động hóa | 1 |
| HUB-07 Tổng đài quốc tế | 0 |
| HUB-10 Case study | **0 — none created; requires real, permissioned data** |

The shape is worth noting: the corpus is heavily weighted toward generic
business knowledge (HUB-08, 43%) and thin exactly where Gcalls now sells —
integrations (6), QA/QC (3), Voicebot (1), international (0).

**Length and quality:**

| Tier (by current length) | Posts | Target |
|---|---:|---|
| PILLAR (≥2,000 words) | 48 | 2,000–3,000 |
| SUPPORTING (1,200–1,999) | 87 | 1,200–2,000 |
| SHORT_GUIDE (<1,200) | 76 | 900–1,200 |

| Quality band | Posts |
|---|---:|
| STRONG | 44 |
| ADEQUATE | 91 |
| ADEQUATE_SHORT | 55 |
| BELOW_STANDARD (600–899 words) | 5 |
| THIN (<600 words) | 16 |

Median 1,369 words; range 166–7,299.

---

## 3. Defects found

### 3.1 Injected gambling spam — 3 posts, live and indexable

| post_id | Title | Category | Words |
|---|---|---|---:|
| 18101 | Экспресс Дня 6 Февраля Ставки И Прогнозы На Футбол… | Kiến thức | 2,970 |
| 18122 | Ставки На Футбол Webmoney Категор | mostbet-ru-serg | 3,692 |
| 18144 | Ознакомительный Первый Пост Ставки Начинающие… | Kiến thức | 3,055 |

~9,700 words of Russian gambling content on the corporate domain, all three
serving `robots: index, follow`. Two are filed under the legitimate "Kiến thức"
category, so they are not visually quarantined. This is hacked-content
injection, not editorial error.

**It is the most urgent item in this report and it is independent of the
migration.** Recommended: remove from the live site and return `410 Gone`;
do not migrate and do not redirect. Recorded in `blog-claim-register.csv`.

### 3.2 URL namespace change — 211 redirects required

Every live post sits at **site root**: `https://gcalls.co/<slug>/`, path depth 1
for all 211. The React route registry namespaces the blog at `/blog/`
(`src/config/sitemap.ts`). Migration therefore moves every post to
`/blog/<slug>/` — 211 redirects, on URLs with up to five years of accumulated
authority.

Full mapping in `blog-redirect-map.csv`, all rows `NOT_APPLIED`. Two options
worth weighing before anything is written: keep posts at root and change the
React registry, or accept the move and apply 301s. The first preserves URLs;
the second gives a cleaner IA. This is a decision, not a detail.

### 3.3 Metadata gaps

| Issue | Posts |
|---|---:|
| SEO title differs from article title | 91 |
| Missing meta description | 37 |
| Missing featured image | 27 |
| Zero headings in body | 1 |
| Duplicate slugs | 0 ✅ |
| Missing schema | 0 ✅ |

### 3.4 Content-builder dependency

From the July analysis: 142 STANDARD (plain HTML, directly usable), 68
ELEMENTOR_NORMALIZATION_REQUIRED, 1 MANUAL_REVIEW. Prose is 100% recoverable
from the Elementor set by unwrapping content widgets.

---

## 4. Claim safety

Only **2 posts** show a blocked-claim pattern in their title or meta
description: one `24/7` availability claim, one unverified price. Both are in
`blog-claim-register.csv` as `VERIFY_REQUIRED`.

**This number must not be read as reassuring.** Only metadata was scanned,
because only metadata is on disk. The bodies of all 211 posts — roughly 354,000
words — are **unscanned**, and the corpus predates every claim-safety checkpoint
applied to this site. Posts from 2020–2021 with titles like *"Tổng Đài Ảo Call
Center 24/7"* are exactly where the withheld claims (24/7, 100%, 40%, 30–50%
uplift, unlimited scale) are most likely to sit. A body-level scan is mandatory
before any post is republished, and it requires the `post_content` export.

---

## 5. Deliverables produced

| File | Rows | Content |
|---|---:|---|
| `blog-inventory.csv` | 211 | All 24 required columns, hub-mapped, tiered, quality-banded |
| `blog-redirect-map.csv` | 211 | Root → `/blog/` mapping; spam marked 410; all `NOT_APPLIED` |
| `blog-internal-link-map.csv` | 211 | Planned related posts (by hub) + product/solution links per §F |
| `blog-claim-register.csv` | 7 | Detected claims, spam entries, and the unscanned-body caveat |

Fields that genuinely cannot be determined without the article bodies are
marked `VERIFY_REQUIRED` or `UNKNOWN_NOT_IN_SOURCE` rather than guessed:
primary/secondary keywords, target persona, H1 count, inbound internal links.

---

## 6. Not done, and why

| Checkpoint section | Status | Reason |
|---|---|---|
| §D article standard | NOT APPLIED | No article exists in source to apply it to |
| §E SEO/AIO per article | PARTIAL | Planned in inventory; cannot implement without bodies |
| §F product link map | PLANNED | Mapped per hub in the link map; not implemented in code |
| §H image briefs | PARTIAL | Featured-image presence recorded; briefs need article context |
| §I code implementation | NOT STARTED | No blog detail route, article model or content pipeline exists |
| §K commit | NOT CREATED | See below |

**No commit was created.** The prescribed message —
`feat: complete Gcalls blog content and SEO structure` — would assert that blog
content is complete. It is not: zero articles were written or migrated. A commit
under that message would misreport the state of the work. The four analysis
files are on disk, uncommitted, ready to commit under an accurate message on
request.

---

## 7. Recommended sequence

1. **Remove the three spam posts from `gcalls.co` and return 410.** Independent
   of everything else; the longer they stay indexed the more damage they do.
2. **Decide the URL namespace** — keep posts at root, or accept `/blog/` and
   apply the 301 map.
3. **Export `post_content` for all 211 posts** via the read-only REST API, into
   the repo. Nothing downstream is possible without it.
4. **Run a body-level claim scan** across the full corpus.
5. **Triage, don't rewrite everything.** 350,000 words is not one checkpoint.
   A defensible first tranche: the 21 posts under 900 words (rewrite or retire),
   the 44 STRONG posts (normalise and keep), and net-new pillars for the three
   hubs where Gcalls sells but has almost nothing — integrations, QA/QC,
   Voicebot, international.
6. **Then** build the blog detail route, categories, related posts and schema.
