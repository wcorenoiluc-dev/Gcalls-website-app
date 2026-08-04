# WordPress Headless CMS Readiness Audit

**Date:** 2026-07-27 · **Type:** AUDIT ONLY — nothing was changed
**Target architecture:** GitHub → Astro + React → Cloudflare Pages → `gcalls.co`;
WordPress → `cms.gcalls.co` (REST content API); Cloudflare Pages Function → `/api/leads`

---

## 0. Method and its limits — read this first

Everything below was gathered by **unauthenticated, read-only HTTP requests** to
public endpoints of `gcalls.co`, plus public DNS and WHOIS. No credentials were
used, nothing was written, and no plugin, theme, setting or content was touched.

**This means a whole class of facts could not be verified.** I have no hosting
control panel, no WordPress admin, and no database access. Anything requiring
them is marked **UNKNOWN** rather than guessed — most importantly the hosting
plan, its cost, disk/bandwidth allowances, backup configuration, and whether
subdomains can be added. Those questions are answerable in about ten minutes
with panel access; see §13.

Where a number is stated, it was observed. Where it was inferred, that is said.

---

## 1. Current infrastructure

| Item | Value | Source |
|---|---|---|
| Public URL | `https://gcalls.co` | direct |
| Origin IP | `202.92.5.49` | DNS A record |
| Hosting provider | **iNET Media Company Limited** (Hà Nội, VN) | WHOIS `netname: INET-VNNIC-VN` |
| Web server | **LiteSpeed** | `server:` header |
| PHP | **7.4.33** | `x-powered-by:` header |
| DNS | **Cloudflare** (`cesar.ns` / `marjory.ns.cloudflare.com`) | NS records |
| Apex `gcalls.co` | `202.92.5.49` — **DNS-only (grey cloud)** | resolves to origin |
| `www.gcalls.co` | `172.67.214.170`, `104.21.37.227` — **Cloudflare-proxied** | resolves to CF |
| `cms.gcalls.co` | **does not exist** (no DNS record) | NXDOMAIN |
| Mail | **Zoho** (`mx.zoho.com`) | MX records |
| Control-panel ports (2082/2083/2086/2087/2222) | closed/filtered from outside | TCP probe |

> **Notable:** DNS already runs on Cloudflare. The target architecture's DNS
> layer is therefore already in place — adding `cms.gcalls.co` is a record in
> an account that exists, not a migration.
>
> **Also notable:** apex is unproxied while `www` is proxied. Inconsistent, and
> worth deciding deliberately before the cutover.

---

## 2. WordPress

| Item | Value |
|---|---|
| WordPress version | **6.4.3** (inferred from `wp-emoji-release.min.js?ver=6.4.3` and `block-library/style.min.css?ver=6.4.3`) |
| PHP version | **7.4.33** |
| Database engine/version | **UNKNOWN** — requires admin/DB access |
| Theme | **`applounge`** (commercial; `radiantthemes-addons` present) |
| Child theme | **UNKNOWN** — only `themes/applounge` appears in front-end asset paths |
| Multisite | **No** (single-site REST root, single `wp-json` namespace set) |
| Site language | Vietnamese (content); `WPLANG` **UNKNOWN** |
| Timezone | `gmt_offset: 7` (UTC+7); `timezone_string` **empty** |
| Permalink structure | **`/%postname%/`** with **category base removed** |
| Homepage | static page, ID `5947` |

### Version currency

- **WordPress 6.4.3** was released January 2024 — roughly two years behind current.
- **PHP 7.4 reached end of life in November 2022.** It receives no security
  patches from the PHP project. This is the single most significant technical
  risk found.

### Plugins detected

Via REST namespaces and front-end asset paths. This is **not** the complete list
— plugins that neither register a REST namespace nor load front-end assets are
invisible to an unauthenticated audit, and **inactive and must-use plugins
cannot be seen at all**.

| Plugin | Evidence | Relevance |
|---|---|---|
| **Yoast SEO** | `yoast/v1` | SEO source of truth |
| **Elementor** + **Elementor Pro** | `elementor/v1`, `elementor-pro/v1` | Page builder — main content-portability risk |
| **ElementsKit** + Lite | `elementskit/*` (13 namespaces) | Elementor addon; registers a post type |
| **Essential Addons for Elementor** | asset path | Elementor addon |
| **PowerPack Elements** | asset path | Elementor addon |
| **RadiantThemes Addons** | asset path | Theme addon |
| **Wordfence** | `wordfence/v1` | Security — currently blocking probes correctly |
| **LiteSpeed Cache** | `litespeed/v1`, `x-turbo-charged-by` | Caching |
| **Contact Form 7** | `contact-form-7/v1` | Existing forms |
| **FluentSMTP** | `fluent-smtp` | Transactional mail |
| **HubSpot (Leadin)** | `leadin/v1` | **See §11 — directly relevant to the lead backend** |
| **Google Site Kit** | `google-site-kit/v1` | Analytics |
| **Redux Framework** | `redux/v1` | Theme options |
| **Templately** | `templately/v1` | Elementor templates |
| **Extendify** | namespace | Gutenberg patterns |
| **BSF Core** | `bsf-core/v1` | Brainstorm Force framework |
| ar-contactus, highwaypro, link-whisper-premium, wp-responsive-table | asset paths | misc |

---

## 3. REST API

**Fully available and unauthenticated for reads.** No security plugin is
blocking it.

| Endpoint | HTTP | `X-WP-Total` |
|---|---|---|
| `/wp-json/` | 200 | — |
| `/wp/v2/posts` | 200 | **211** |
| `/wp/v2/pages` | 200 | **61** |
| `/wp/v2/categories` | 200 | **26** |
| `/wp/v2/tags` | 200 | **260** |
| `/wp/v2/media` | 200 | **2450** |
| `/wp/v2/comments` | 200 | 0 |
| `/wp/v2/types` | 200 | — |
| `/wp/v2/taxonomies` | 200 | — |
| `/wp/v2/users` | **401** | — |

- Authentication required: **no**, for content reads.
- Blocked by security plugin: **no**.
- Unexpected redirect: **no**.
- CORS: **not tested for cross-origin browser reads.** Astro will fetch at
  build time (server-side), where CORS does not apply, so this is not a
  blocker — but confirm before any client-side fetch.
- `users` returning 401 is WordPress default and is **good** — author
  enumeration is closed.

> Counts above are **published items only**. Draft/pending counts require
> authentication and are **UNKNOWN**.

---

## 4. Content inventory

| Type | Published | Notes |
|---|---|---|
| Posts | **211** | 212 URLs in `post-sitemap.xml` (includes the `/blog/` listing URL) |
| Pages | **61** | 56 URLs in `page-sitemap.xml` |
| Categories | **26** | 17 in sitemap (only non-empty ones) |
| Tags | **260** | not in sitemap |
| Media | **2450** | |
| Comments | 0 | |
| Users | UNKNOWN | endpoint returns 401 |

**Total unique public paths in sitemaps: 284.**

### URL patterns — the important finding

Posts, pages **and category archives all live at the site root**:

```
post      https://gcalls.co/quan-tri-theo-muc-tieu-smart-la-gi/
page      https://gcalls.co/chinh-sach-bao-mat/
category  https://gcalls.co/ban-hang/        ← no /category/ base
```

There is **no `/blog/` prefix** on posts, and **no `/category/` base** on
archives. Everything shares one flat namespace with the new site's routes.

---

## 5. SEO

**System: Yoast SEO**, and it is exposed through REST via `yoast_head_json` on
every object.

Measured across **all 211 posts**:

| Field | Coverage |
|---|---|
| `yoast_head_json` present | **211 / 211 (100%)** |
| Meta description | 174 / 211 (**82.5%**) |
| `og_image` | 191 / 211 (**90.5%**) |
| Canonical | present on all sampled |
| `robots` object | present on all sampled |
| Schema (`@graph`) | present on all sampled |
| Marked `noindex` | **0** |

This is the strongest single finding in the audit: **SEO metadata is fully
portable through the API**, including canonical, robots directives, Open Graph
and JSON-LD schema. No scraping or database extraction is needed.

`robots.txt` is `Disallow:` (nothing blocked). Sitemap index at
`/sitemap_index.xml` (Yoast); `/wp-sitemap.xml` 301-redirects to it.

---

## 6. Custom content

| Item | Finding |
|---|---|
| Custom post types | **Only `elementskit_content`** (plugin-owned, 5 URLs). No Guide / Case Study / Ebook / Glossary / FAQ types exist. |
| Custom taxonomies | **None.** Only `category`, `post_tag` and WP internals. |
| Custom fields exposed via REST | **Effectively none** — `meta` returns only `content-type` and `footnotes` |
| ACF | **Not detected.** No `acf/v3` namespace, no `acf` field on REST objects. |
| Page builder | **Elementor + Elementor Pro**, heavily extended (ElementsKit, Essential Addons, PowerPack) |
| Gutenberg | Present but barely used in posts (1 of 211) |

### Content portability — measured over all 211 posts

| Category | Count | Share |
|---|---|---|
| **Portable** (plain HTML, no builder, no shortcodes) | **126** | **59.7%** |
| **Elementor-dependent** | **69** | **32.7%** |
| Contains shortcodes | 16 | 7.6% |
| Gutenberg blocks | 1 | 0.5% |
| Empty | 0 | 0% |

Shortcode tags found: `[newline]` ×29, `[Link]` ×3, `[X]` ×2, `[email]` ×2,
`[Gcalls]` ×1 — mostly stray text artifacts rather than functional shortcodes.

**Pages: 10 of 10 sampled are Elementor-built (100%).**

> I initially sampled five posts, all of which were clean HTML, and nearly
> concluded that blog content was fully portable. Scanning the whole corpus
> showed a third of it is Elementor-dependent. The five-post sample was not
> representative; the 211-post number is the one to plan against.

**Verdict: partially portable.** Roughly 126 posts can be migrated as-is.
Roughly 69 need conversion or manual rework. Pages do not need to migrate at
all — the new site rebuilds them.

---

## 7. Media

| Item | Finding |
|---|---|
| Upload path | `https://gcalls.co/wp-content/uploads/YYYY/MM/` |
| Media host | **`gcalls.co`** — the same domain the new frontend will occupy |
| Registered sizes | `thumbnail`, `medium`, `full` only |
| Formats | Predominantly PNG; JPEG present; **1 WebP** in sample; **0 AVIF** |
| Alt text | **0% in a 37-item sample** |
| Total items | 2450 |

Two consequences:

1. **Media URL dependency is a real migration issue.** Every historical post
   references `gcalls.co/wp-content/uploads/...`. Once `gcalls.co` serves the
   Astro site, those URLs must still resolve — either by keeping a path
   passthrough on the apex, rewriting content to `cms.gcalls.co`, or moving
   files to object storage. This must be decided before cutover.
2. **Alt-text coverage is effectively zero**, which is both an accessibility
   and an image-SEO gap. It is independent of the migration and can be fixed
   at any time.

---

## 8. Users & workflow

**Not auditable without credentials.** `/wp/v2/users` returns 401 and author
archives 404, so user count, roles and custom roles are **UNKNOWN**.

WordPress's built-in roles (Administrator / Editor / Author / Contributor) map
onto a Writer → Review → Publisher flow natively: Contributor or Author writes,
Editor reviews and publishes. Whether that is how the site is currently
configured cannot be determined from outside.

---

## 9. Security

Audit only — nothing was changed. No secrets, tokens or credentials were
accessed, and none appear in this document.

| Check | Result | Assessment |
|---|---|---|
| `/xmlrpc.php` | **403** | ✅ blocked |
| `/?author=1` | **404** | ✅ user enumeration blocked |
| `/readme.html` | **403** | ✅ version disclosure blocked |
| `/wp-content/debug.log` | **406** | ✅ blocked (Wordfence signature) |
| `/.env` | **403** | ✅ blocked |
| `/wp-json/wp/v2/users` | **401** | ✅ requires auth |
| `/wp-admin/` | **302** → login | ✅ correct |
| `/wp-login.php` | **200** | ⚠️ publicly reachable (standard, but a brute-force surface) |
| Debug mode | no debug output observed | ✅ appears off |
| Public backups | none found at common paths | ✅ none visible |

**Wordfence is active and working.** The runtime posture is good.

The risks are versions, not configuration:

- 🔴 **PHP 7.4.33 — end of life since November 2022.** No security patches.
- 🟠 **WordPress 6.4.3 — roughly two years behind.**
- 🟠 Plugin/theme currency **UNKNOWN** (requires admin). Elementor and its
  addon ecosystem have a history of severe vulnerabilities, so a large
  Elementor surface on an unpatched stack deserves attention.

---

## 10. Performance

| Metric | Observed |
|---|---|
| Homepage TTFB | 0.15 – 0.54 s (3 runs) |
| Homepage total | 1.14 – 1.56 s |
| Homepage transfer size | **755 KB** |
| REST `posts?per_page=10` | TTFB ~1.03 s, total ~2.96 s |
| Cache headers (homepage) | `cache-control: no-store, no-cache, must-revalidate` |
| CDN in front of apex | **none** (apex is DNS-only) |

Two observations:

- **LiteSpeed Cache is installed but the homepage is served uncached**
  (`no-store`). Whatever the reason, page caching is not currently benefiting
  the apex.
- **The REST API is slow** — ~3 s for ten posts. For Astro this is a *build-time*
  cost, not a visitor-facing one, so it is tolerable; 211 posts will simply make
  builds take a few minutes. It would be a problem only if the new site fetched
  from WordPress at request time, which this architecture does not.

Frontend performance of WordPress itself is not worth optimising — it becomes a
backend.

---

## 11. HubSpot is already installed — relevant to the lead backend

The REST namespace **`leadin/v1`** indicates the **HubSpot WordPress plugin** is
active on this site.

That is directly relevant to the open question from Checkpoint 5A, where the
lead pipeline was completed but left unconnected for want of a place to hold a
credential. If HubSpot is already the CRM of record, the `/api/leads` Cloudflare
Pages Function has an obvious destination, and `HubSpotLeadProvider` becomes the
first adapter.

**What this audit cannot tell you:** whether the HubSpot account is active,
which portal it belongs to, or whether a private-app token can be issued. Worth
confirming before Checkpoint 2 — it could collapse two open problems into one.

---

## 12. Existing URL preservation

284 unique public paths were inventoried from the Yoast sitemaps
(212 post + 56 page + 17 category, deduplicated).

### Collisions with the new 37-route sitemap

Comparing existing paths against `src/config/sitemap.ts`:

| New route | Currently on WordPress | Note |
|---|---|---|
| `/` | Homepage (page 5947) | Expected — replaced at cutover |
| **`/san-pham/`** | **Category archive** — "Sản phẩm Archives" | ⚠️ real collision |
| **`/blog/`** | **Existing post** — "Blog" listing | ⚠️ real collision |

The other **34 new routes are free**. That is a much better outcome than the
flat namespace suggested, but the two genuine collisions need decisions:

- `/san-pham/` currently ranks as a category archive. The new Products hub wants
  the same path. Either redirect the archive to the new hub (likely correct, the
  intent matches) or move the new hub.
- `/blog/` currently exists as a post. The new site plans `/blog/` as its blog
  index. Same choice.

### Legacy patterns worth flagging

- `hr-parttime-copy` — a `-copy` slug published and indexed; likely accidental.
- Category `case-study` exists with **0 posts**; category `app` likewise.
- Several product-catalogue posts (`/tai-nghe-jabra-…`, `/tai-nghe-epos-…`)
  read like commerce listings inside the blog post type.

**No old URL should be deleted.** A full OLD → NEW → status map is Checkpoint 2
work; this audit establishes the inventory it will be built from.

---

## 13. Hosting — what could not be determined

These require the iNET hosting panel and are **UNKNOWN**. They matter, and I am
not going to guess at them:

| Question | Status |
|---|---|
| Hosting plan name | UNKNOWN |
| **Annual/monthly cost** | UNKNOWN |
| Disk allocation and current usage | UNKNOWN |
| Bandwidth allowance | UNKNOWN |
| Automatic backups / retention | UNKNOWN |
| Manual backup capability | UNKNOWN |
| SSH / SFTP access | UNKNOWN |
| Cron support | UNKNOWN |
| PHP configuration (memory, limits) | UNKNOWN |
| Database access method | UNKNOWN |
| **Can `cms.gcalls.co` be added on the current plan?** | **UNKNOWN — the critical open question** |

**How to close these quickly:** log in to the iNET control panel and read the
plan page and the subdomain page. Nearly every shared plan permits subdomains,
and DNS is already on Cloudflare, so the likely answer is yes — but "likely" is
not a basis for an architecture decision, and I would rather mark it UNKNOWN
than assert it.

---

## 14. Headless readiness

| # | Question | Answer |
|---|---|---|
| A | Can WordPress serve blog content through REST? | ✅ **Yes** — open, unauthenticated, 211 posts |
| B | Can it serve media? | ✅ **Yes** — 2450 items, but see the URL-dependency caveat (§7) |
| C | Can it expose SEO metadata? | ✅ **Yes** — Yoast `yoast_head_json` on 100% of posts |
| D | Can we add custom SEO/AIO fields safely? | ✅ **Yes** — standard `register_post_meta` with `show_in_rest`; no conflict observed |
| E | Can it support custom post types later (Guide, Case Study, Ebook, Glossary, FAQ)? | ✅ **Yes** — none exist yet; all are addable with `show_in_rest: true` |
| F | Can the hosting support `cms.gcalls.co`? | ❓ **UNKNOWN** — see §13 |
| G | Are security plugins blocking API access? | ✅ **No** — Wordfence blocks probes but permits the REST content API |

**Overall: CONDITIONAL YES.** The API, the SEO data and the content model are
all ready. Three things stand between here and a decision: the subdomain
question, the Elementor-dependent third of the archive, and the EOL PHP version.

---

## 15. Migration risks

### P0 — blockers

| Risk | Detail |
|---|---|
| **`cms.gcalls.co` feasibility unverified** | The entire architecture assumes a subdomain on existing hosting. Unconfirmed (§13). |
| **Media URL dependency** | 2450 items on `gcalls.co/wp-content/uploads/`. When the apex becomes Astro, these must still resolve. Needs a decision: apex passthrough, content rewrite to `cms.`, or move to object storage. |
| **PHP 7.4 EOL** | Unpatched since Nov 2022. Should be raised before exposing the install as a production API dependency. |

### P1 — solve before the headless switch

| Risk | Detail |
|---|---|
| **69 Elementor-dependent posts (32.7%)** | Their REST `content.rendered` carries builder markup and CSS-class dependencies that will not style correctly outside the theme. Needs conversion, rework, or a decision to retire. |
| **`/san-pham/` and `/blog/` collisions** | Both are live indexed URLs wanted by new routes (§12). |
| **WordPress 6.4.3 outdated** | Two years of security and API fixes missing. |
| **284 legacy URLs need a redirect map** | Must be authored before cutover or ranking is lost. |
| **Apex/www proxy inconsistency** | Apex DNS-only, `www` proxied. Resolve deliberately at cutover. |
| **No draft/user visibility** | Editorial workflow cannot be planned without admin access. |

### P2 — later

| Risk | Detail |
|---|---|
| Alt text ~0% | Accessibility and image SEO; independent of migration. |
| Only 3 image sizes; almost no WebP/AVIF | Media optimisation opportunity. |
| Homepage served `no-store` despite LiteSpeed Cache | Irrelevant once WordPress is backend-only. |
| Stray legacy slugs (`hr-parttime-copy`), empty categories | Content hygiene. |
| 260 tags for 211 posts | Taxonomy sprawl; worth pruning before migration. |

---

## 16. Cost impact

**No provider pricing is invented here.** The hosting plan and its cost are not
visible without panel access (§13).

| Question | Answer |
|---|---|
| Can current hosting continue? | **UNKNOWN** — technically it is serving the API fine today; plan limits unverified |
| Can `cms.gcalls.co` run on the same plan? | **UNKNOWN** — the one question to resolve first |
| Does this architecture require a new VPS? | **No** — nothing observed suggests it |
| A new database? | **No** — WordPress keeps its own |
| Supabase? | **No** — no requirement identified |
| Vercel? | **No** — Cloudflare Pages covers hosting and the `/api/leads` function |

**Expected new recurring infrastructure cost: none identified.** Cloudflare DNS
is already in use; Cloudflare Pages has a free tier that covers this workload;
no new database or platform is required. The only possible new cost is a
hosting-plan change *if* the current plan disallows subdomains — which is
precisely the UNKNOWN in §13.

---

## 17. Recommendations

### Immediately (no code, ~30 minutes, needs panel access)

1. **Confirm `cms.gcalls.co` can be created** on the current iNET plan. This one
   answer determines whether the architecture proceeds as designed.
2. **Record the plan name, cost, disk and bandwidth** so §16 can be answered.
3. **Check whether the HubSpot account behind the `leadin` plugin is active**
   (§11) — it may resolve the lead-backend question at the same time.

### Before the headless switch

4. Raise **PHP to 8.1+** and WordPress to current, on a staging copy first.
   Elementor plus a large addon surface makes an in-place jump risky.
5. Decide the **media strategy** (§7) — this shapes the cutover.
6. Triage the **69 Elementor posts**: convert, rewrite, or retire. Sorting by
   traffic first will likely show most of them are not worth converting.
7. Author the **284-URL redirect map**, resolving `/san-pham/` and `/blog/`.

### Deliberately not recommended

- Do **not** migrate content into a new CMS. WordPress already exposes
  everything needed, editors know it, and Yoast data comes through the API
  intact. Replacing it would add cost and risk for no gain.
- Do **not** put WordPress behind the Cloudflare proxy on the apex before the
  cutover plan is settled.
