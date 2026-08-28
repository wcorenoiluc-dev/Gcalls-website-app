# Gcalls WordPress source

Checkpoint `GCALLS-WORDPRESS-MIGRATION-003A`.

The website handed over at the end of this migration runs **WordPress/PHP with
a custom theme and Elementor**. The React/Vite application in `src/` stays in
this repository as the design, content and comparison reference — it is not
deployed to the demo host any more, and its build output is never used as the
WordPress site.

---

## 1. What is in here

```
wordpress/
├── wp-content/
│   ├── themes/gcalls-theme/     custom classic PHP theme, Elementor-compatible
│   └── plugins/gcalls-core/     behaviour that must survive a theme change
├── config/                      server configuration to deploy, not to commit as-is
├── elementor-templates/         exported Elementor sections, reviewable in Git
├── imports/                     generated content manifest for the importer
├── scripts/                     export, lint and QA tooling
└── README.md
```

### The blog corpus export is not in here either

`export-blog-corpus.mjs` reads a WordPress WXR file that is **deliberately not
committed**: it is a 12 MB dump of a site that was serving injected gambling
spam, and dumps do not belong in Git. Pass its path:

```
npm run wp:corpus -- --wxr ~/Downloads/<export>.xml
```

The manifest records the file's SHA-256, so a later run can prove it read the
same export. The dry run must print `DRY RUN: PASS` before anything is packaged
— `build-corpus-package.mjs` refuses to package a failing run, which is the only
thing that makes the dry run a gate rather than a report.

**Not in here, on purpose:** WordPress core, `wp-config.php`, uploads, caches,
database dumps, and any third-party theme or plugin. Core is installed and
updated on the host — a copy in Git goes stale and publishes the exact version
an attacker would like to know. Elementor and Rank Math are installed from
wordpress.org on the host. See the `wordpress/` block in `.gitignore`.

---

## 2. Theme and plugin, and the line between them

`gcalls-theme` is presentation: templates, tokens, header, footer, asset
loading, Elementor compatibility.

`gcalls-core` is everything that would be **lost or broken by switching
themes**, which is the whole test for what belongs there:

| Module | Why it cannot live in the theme |
| --- | --- |
| `gcalls_hub` taxonomy | Terms and their assignments outlive any theme |
| FAQ meta + FAQPage schema | Structured data is content, not layout |
| Breadcrumbs | The trail and its JSON-LD must agree; one owner |
| Redirect map (301/302/410) | URLs must not change with a theme |
| Import pipeline | Migration is a site operation |
| Hardening | XML-RPC and user enumeration are site policy |

`gcalls-core` deliberately writes **no** meta title, description, canonical,
Open Graph tag or XML sitemap. Rank Math owns the document head. Two plugins
writing the same head tags produce duplicates, and a duplicated canonical is
worse than none. The SEO module only feeds Rank Math's own post meta, so
migrated values stay editable in the Rank Math UI after import.

### Design tokens

`assets/css/theme.css` and `theme.json` carry the same values, transcribed from
`src/styles/theme.css`:

| Token | Value |
| --- | --- |
| Primary | `#673ab7` |
| Primary dark | `#4a2391` |
| Primary light | `#f5f1fc` |
| Text | `#1e2026` — muted `#5b5f6b` |
| Border | `#e8e5ef` |
| Font | Open Sans (DM Mono for code) |
| Container | 1280px, gutter 20px / 32px ≥1024px |
| Reading measure | 760px |
| Radius | 0.625rem |

They are duplicated rather than imported: the React build is not deployed with
this site, so an import would be a broken link. **When a token changes in the
React source it must change here in the same commit.**

### Elementor

- Enabled for **Pages only**. Posts stay in the block editor — the 18 articles
  are long-form prose with FAQ and internal links, and prose stored as
  Elementor widgets cannot be exported, diffed or re-imported.
- The theme adds one page template, *Toàn chiều rộng (Elementor)*, which keeps
  the theme header and footer while removing the content container. Elementor's
  own Canvas and Full Width templates remain available.
- **No Elementor Pro.** Nothing in the theme or plugin requires it, and no Pro
  widget appears in `elementor-templates/`. Basic content editing after
  handover must not need a licence.

---

## 3. Tooling

Run from the repository root:

```bash
npm run wp:lint     # PHP syntax check (php-parser — no local PHP needed)
npm run wp:export   # React source -> wordpress/imports/content-manifest.json
npm run wp:qa       # full §K foundation QA
```

`wp:lint` exists because macOS 13 ships no PHP and this machine has none.
`php-parser` is a complete PHP 8 parser in JavaScript, so the gate runs in the
same toolchain as the rest of the repo. It checks **syntax only** — it cannot
tell you a WordPress function was misspelled.

`wp:qa` prints, at the end, the checks it could **not** run because they need a
live WordPress. That list is part of the report, not a footnote.

---

## 4. Install runbook (on the host)

Nothing below has been executed: this checkpoint had no hosting access. Run it
in order once SSH or SFTP is available.

```bash
# 1. WordPress core, in the document root
wp core download --locale=vi
wp config create --dbname=<db> --dbuser=<user> --dbprefix=gc_$(openssl rand -hex 3)_ --prompt=dbpass
wp core install --url=https://ashernguyenxuanthuy.com --title="Gcalls" \
                --admin_user=<not "admin"> --admin_email=<email> --prompt=admin_password

# 2. Settings the checkpoint fixes
wp option update blog_public 0                 # discourage search engines — ON
wp option update timezone_string Asia/Ho_Chi_Minh
wp rewrite structure '/%postname%/' --hard
wp language core install vi && wp site switch-language vi

# 3. Front page and posts page
wp post create --post_type=page --post_title='Trang chủ' --post_status=publish --porcelain
wp post create --post_type=page --post_title='Blog' --post_status=publish --porcelain
wp option update show_on_front page
wp option update page_on_front <front-page-id>
wp option update page_for_posts <blog-page-id>

# 4. Plugins, from wordpress.org only
wp plugin install elementor seo-by-rank-math --activate

# 5. This repository's theme and plugin
#    Upload wp-content/themes/gcalls-theme and wp-content/plugins/gcalls-core
wp theme activate gcalls-theme
wp plugin activate gcalls-core

# 6. Server configuration
#    config/htaccess-wordpress.conf -> <document root>/.htaccess
#    config/robots.txt              -> <document root>/robots.txt

# 7. Verify
wp gcalls robots
wp option get blog_public        # must print 0
curl -sSI https://ashernguyenxuanthuy.com/ | grep -i x-robots-tag
```

Passwords are entered interactively via `--prompt=`. **No credential belongs in
this repository, in `.env`, or in a report.**

### Content import (checkpoint 003B, not now)

```bash
npm run wp:export                                    # regenerate the manifest
wp gcalls import --manifest=wordpress/imports/content-manifest.json          # dry run
wp gcalls import --manifest=wordpress/imports/content-manifest.json --execute
wp gcalls rollback --execute                         # undo the last run
```

The importer is idempotent: every object carries `_gcalls_source_id`, matched
before the slug, so a re-run updates instead of duplicating even after an
editorial rename. Fields an editor is expected to change are written once and
then left alone unless `--force` is passed — an import that silently reverts a
correction is worse than one that skips.

---

## 5. Search-engine posture

The demo is **public but noindex**, on four independent layers:

1. WordPress *Discourage search engines* (`blog_public = 0`);
2. `gcalls-core` strengthens that to `noindex, nofollow, noarchive, nosnippet,
   noimageindex`;
3. the `X-Robots-Tag` header in `.htaccess` — the only layer covering assets
   fetched directly, since a `.webp` never parses an HTML meta tag;
4. `config/robots.txt`, which overrides WordPress's virtual one.

**At go-live all four change together**, along with the Reading setting. One
without the others either leaves the site unindexable or exposes the preview.

---

## 6. Media

Only the **13 masked WebP** captures are importable. `GP-04` (agent
performance) and `GP-06` (analytics dashboard) were never produced: both carry
real operating figures, which masking cannot remove, so there is no file to
import. `wp:export` fails if either ever appears in the manifest, and no raw
PNG or QA screenshot is included.
