# RUNBOOK — GCALLS-WORDPRESS-LIVE-HARDENING-003A

Domain: `ashernguyenxuanthuy.com` (103.75.184.31)
Hosting account: `xvfjmtpchosting` · iNET OnePortal / 1Panel 3.8.87
Document root: `/home/xvfjmtpchosting/domains/ashernguyenxuanthuy.com`

> **There is no `public_html` under that path.** `wp-config.php`, `.htaccess`
> and `wp-cron.php` sit directly in the domain directory. An earlier draft of
> this runbook appended `/public_html`; every path below has been corrected.
> A cron line built on the wrong root fails silently under `>/dev/null 2>&1`.

> **Scope of this document.** The source-side work (author-enumeration fix and
> its regression tests) is committed. Everything below runs on the live host and
> needs 1Panel / phpMyAdmin / wp-admin, or SSH. The session that wrote this had
> neither, so nothing in sections 2–9 has been executed. Sections marked
> **[VERIFIED]** were confirmed from outside over plain HTTPS.

Never touch on this hosting: `gcalls.co`, `lamwebsite.click`,
`daisuyeuthuong.com`, or any other domain.

---

## 1. Live baseline (measured 2026-08-27/28, read-only)

| Check | Result |
| --- | --- |
| `https://…/` | **200** [VERIFIED] |
| `http://…/` → HTTPS | 301 → apex [VERIFIED] |
| `https://www…/` → non-www | 301 → apex [VERIFIED] |
| `/wp-login.php` | 200 [VERIFIED] |
| `/wp-json/` | 200 [VERIFIED] |
| Permalinks `/%postname%/` | `…/hello-world/` resolves [VERIFIED] |
| `X-Robots-Tag` | `noindex, nofollow, noarchive, nosnippet, noimageindex` [VERIFIED] |
| `robots.txt` | physical file, `Disallow: /` [VERIFIED] |
| `/xmlrpc.php` | 403 [VERIFIED] |
| `/wp-json/wp/v2/users` | 401 [VERIFIED] |
| Active theme | `gcalls-theme` [VERIFIED] |
| Elementor | 4.2.3 [VERIFIED] |
| `/wp-cron.php?doing_wp_cron` over HTTPS | 200 — the WAF does **not** block it [VERIFIED] |

Content that the admin deletion must preserve: **1 post** (id `1`,
`hello-world`, author `1`) and **3 pages** (front page id `13`, blog id `16`).

---

## 2. The author-enumeration leak, and why its order matters

Measured on the live host:

| Request | Response |
| --- | --- |
| `GET /?author=1` (admin, owns 1 post) | **301 → `/author/admin/`** — leaks the login slug |
| `GET /author/admin/` | 404 |
| `GET /?author=2` (gcalls_owner, owns nothing) | 404 |
| `GET /?author=999` (no such user) | 404 |
| `GET /wp-json/oembed/1.0/embed?url=…/hello-world/` | **200 with `"author_name":"admin"` and `"author_url":"…/author/admin/"`** |

`Hardening::block_author_archives()` was already correct — it just never ran for
`?author=1`. It shared **priority 10** on `template_redirect` with core's
`redirect_canonical()`, and equal priorities run in registration order, so core
went first, emitted the 301 and exited. `redirect_canonical()` rewrites the ID
form to the pretty URL only when `count_user_posts()` is non-zero.

**The leak therefore follows post ownership, not the account.** `?author=2`
404s today only because `gcalls_owner` owns nothing yet. Attributing the post to
`gcalls_owner` in section 8 would make `?author=2` start leaking `gcalls_owner`
— the fix relocates rather than closes unless the plugin ships first.

**Hard ordering constraint: deploy §6 before §8.**

The fix (committed in this repo, `includes/class-hardening.php`):

- registers the author block at **priority 0**, ahead of `redirect_canonical()`;
- calls `remove_action( 'template_redirect', 'redirect_canonical' )` for author
  requests only, so no `Location` header can carry a `user_nicename`, while
  canonical redirects keep working for every other URL;
- disables `do_redirect_guess_404_permalink` on those requests;
- strips `author_name` / `author_url` from `oembed_response_data`;
- drops the core `users` sitemap provider.

---

## 0. Two scripts do most of this

| Script | Where | What it settles |
| --- | --- | --- |
| `wordpress/scripts/live-003a-backup.sh` | **on the host** (1Panel terminal or SSH) | §3 in full — root verification, filesystem archive, database dump, integrity checks, SHA-256, and §7.1 PHP 8.3 CLI discovery. Non-destructive; exits non-zero if any gate fails. |
| `npm run wp:live-verify` | **on the laptop** | Every 003A gate answerable over plain HTTPS with no login. Run it after each live step. |

```bash
# host
bash live-003a-backup.sh          # must exit 0 before §6, §7, §8, §9, §10

# laptop, after each step
npm run wp:live-verify
```

`wp:live-verify` measured **20/22** external gates passing on 2026-08-28. The
two failures are `?author=1` and the oEmbed author fields — exactly what §6
deploys. It ends with a NOT CHECKABLE list; those rows need wp-admin and are
the operator's to confirm.

The backup script never prints a database credential: it parses `wp-config.php`
into a `0600` defaults-file, passes that to `mysqldump`, and deletes it on exit.
Credentials never appear in argv, in the output, or in the archive listing.

---

## 3. BACKUP — gate for everything destructive

Nothing in §6–§9 may start until this section passes. `live-003a-backup.sh`
performs everything below; the commands are kept here so the script can be
audited rather than trusted.

```bash
# Prove the root rather than assuming it. There is no public_html here.
DOMDIR=/home/xvfjmtpchosting/domains/ashernguyenxuanthuy.com
cd "$DOMDIR" && pwd && realpath . && ls -la
test -f "$DOMDIR/wp-config.php" || echo "WRONG ROOT — STOP"
test -f "$DOMDIR/wp-cron.php"   || echo "WRONG ROOT — STOP"

BK=/home/xvfjmtpchosting/backups/003a          # outside the web root
mkdir -p "$BK"
STAMP=$(date +%Y%m%d-%H%M%S)
```

Filesystem archive — must include `wp-config.php`, `.htaccess`, `robots.txt`,
`wp-content` (theme, plugins, uploads):

```bash
tar -czf "$BK/files-$STAMP.tar.gz" -C "$DOMDIR" .
tar -tzf "$BK/files-$STAMP.tar.gz" | grep -E '^\./(wp-config\.php|\.htaccess|robots\.txt)$'
tar -tzf "$BK/files-$STAMP.tar.gz" | grep -c '^\./wp-content/'
tar -tzf "$BK/files-$STAMP.tar.gz" >/dev/null && echo "ARCHIVE LISTS OK"
ls -l "$BK/files-$STAMP.tar.gz"
sha256sum "$BK/files-$STAMP.tar.gz" | tee "$BK/files-$STAMP.tar.gz.sha256"
```

Database — export from **phpMyAdmin** (1Panel → Database → phpMyAdmin): SQL
format, gzip compression, "Add DROP TABLE" on. Save to `$BK`, never under
`$DOMDIR`. phpMyAdmin is already authenticated, so no credential needs to be
typed, read or printed anywhere.

```bash
gzip -t "$BK/db-$STAMP.sql.gz" && echo "SQL GZIP OK"
test -s "$BK/db-$STAMP.sql.gz" && echo "SQL NOT EMPTY"
zcat "$BK/db-$STAMP.sql.gz" | grep -c 'CREATE TABLE'      # expect ≥ 12
zcat "$BK/db-$STAMP.sql.gz" | tail -3                     # complete final statement
ls -l "$BK/db-$STAMP.sql.gz"
sha256sum "$BK/db-$STAMP.sql.gz" | tee "$BK/db-$STAMP.sql.gz.sha256"
```

Download both archives **and** both `.sha256` files, then re-verify locally:

```bash
shasum -a 256 -c files-$STAMP.tar.gz.sha256
shasum -a 256 -c db-$STAMP.sql.gz.sha256
```

Backup is PASS only when host and local hashes match for both files. Backups are
never committed to Git — `.gitignore` already covers uploads, `wp-config.php`
and `*.sql`.

### Rollback procedure

| Failure | Action |
| --- | --- |
| Plugin fatal after §6 | Rename `wp-content/plugins/gcalls-core` to `gcalls-core.off` over SFTP; the site loads with the plugin inactive. Restore the directory from `files-$STAMP.tar.gz`. |
| `wp-config.php` broken (§5, §7) | `cp "$BK/wp-config.php.bak-$STAMP" "$DOMDIR/wp-config.php"`. |
| Cron wrong / site events stall (§7) | Remove the cron entry, then delete the `DISABLE_WP_CRON` line. WordPress reverts to HTTP cron immediately. |
| Content lost in §8 | Restore the database from `db-$STAMP.sql.gz` through phpMyAdmin (import overwrites, DROP TABLE is in the dump). |
| Total | Extract `files-$STAMP.tar.gz` over `$DOMDIR`, then import the SQL dump. |

---

## 4. VERIFY gcalls_owner — gate for §8

Do this before, not after, the deletion.

1. Private/incognito window, or log out first.
2. Log in as `gcalls_owner` — **the operator types the password; it is never
   pasted into chat, a ticket, or this file.**
3. Confirm reachable: Dashboard, Users, Plugins, Themes, Settings.
4. Confirm role reads **Administrator** on the Users screen.
5. Evidence: screenshots cropped to exclude the email column, or a note of the
   five screens and the role. No cookie, password or email is recorded.

If any of this fails, `admin` is not deleted.

---

## 5. WP MEMORY — `wp-config.php`

Insert **above** the `/* That's all, stop editing! … */` line:

```php
define( 'WP_MEMORY_LIMIT', '256M' );
define( 'WP_MAX_MEMORY_LIMIT', '512M' );
```

Prove neither constant already exists — a duplicate `define()` emits a PHP
notice on every request — and take a copy first:

```bash
grep -nE "WP_MEMORY_LIMIT|WP_MAX_MEMORY_LIMIT|DISABLE_WP_CRON" "$DOMDIR/wp-config.php"   # expect nothing
cp "$DOMDIR/wp-config.php" "$BK/wp-config.php.bak-$STAMP"
```

`DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_HOST` and the salts are not touched,
and the file is never displayed or pasted anywhere.

Verify in **Elementor → Tools → System Info**: `WP Memory Limit = 256M`.
`WP_MAX_MEMORY_LIMIT` (512M) must be ≤ PHP `memory_limit` (512M after §9);
equal is correct — if PHP were lower, admin-side allocation would fail before
WordPress's own ceiling was reached.

---

## 6. DEPLOY the gcalls-core fix — after §3, before §8

Build from the committed source, not from any older ZIP.

```bash
# on the laptop, from the repo root, on feature/gcalls-wordpress-migration
cd wordpress/wp-content/plugins
zip -rqX /tmp/gcalls-core.zip gcalls-core \
  -x '*.DS_Store' -x '*/.git/*' -x '*/node_modules/*' -x '*.env*'
unzip -t /tmp/gcalls-core.zip && echo "ZIP OK"
unzip -l /tmp/gcalls-core.zip | head          # exactly one root dir: gcalls-core/
unzip -l /tmp/gcalls-core.zip | grep -Ei '\.env|\.git|node_modules|\.sql|secret|credential' \
  && echo "CONTAMINATED — DO NOT DEPLOY"
shasum -a 256 /tmp/gcalls-core.zip
```

Deploy via **Plugins → Add New → Upload Plugin → Replace current with uploaded**,
or by replacing the directory over SFTP. Then activate/upgrade and confirm the
uploaded file's SHA-256 matches what was built.

Verify live immediately:

```bash
D=ashernguyenxuanthuy.com
curl -sS -o /dev/null -w "?author=1  -> %{http_code} loc=%{redirect_url}\n" "https://$D/?author=1"      # 404, no Location
curl -sS -o /dev/null -w "?author=2  -> %{http_code} loc=%{redirect_url}\n" "https://$D/?author=2"      # 404, no Location
curl -sS -o /dev/null -w "/author/admin/ -> %{http_code}\n" "https://$D/author/admin/"                  # 404
curl -sS "https://$D/wp-json/oembed/1.0/embed?url=https%3A%2F%2F$D%2Fhello-world%2F" | grep -c author_  # 0
curl -sS -o /dev/null -w "REST users -> %{http_code}\n" "https://$D/wp-json/wp/v2/users"                # 401
curl -sS -o /dev/null -w "REST root  -> %{http_code}\n" "https://$D/wp-json/"                           # 200
curl -sS -o /dev/null -w "front      -> %{http_code}\n" "https://$D/"                                   # 200
curl -sS -o /dev/null -w "blog       -> %{http_code}\n" "https://$D/blog/"                              # 200
```

Then open the Elementor editor on page 13 and confirm it loads. Check the PHP
error log for new warnings or fatals. On any failure, roll the plugin back per
§3 before continuing.

---

## 7. WP-CRON

`DISABLE_WP_CRON` is never set before a system cron has demonstrably run. A
cron entry that merely exists is not evidence.

### 7.1 Find the real PHP 8.3 CLI binary — do not guess

```bash
command -v php; php -v
ls -la /usr/local/php83/bin/php /opt/php83/bin/php /usr/bin/php8.3 /opt/alt/php83/usr/bin/php 2>/dev/null
<CANDIDATE> -v                                  # must print "PHP 8.3.x (cli)"
<CANDIDATE> -i | grep -E "^(Loaded Configuration File|memory_limit)"
test -f /home/xvfjmtpchosting/domains/ashernguyenxuanthuy.com/wp-cron.php && echo "TARGET EXISTS"
```

### 7.2 Preferred — PHP CLI, absolute path, bypasses the WAF

```cron
*/5 * * * * [PHP_8_3_BINARY] -q /home/xvfjmtpchosting/domains/ashernguyenxuanthuy.com/wp-cron.php >/dev/null 2>&1
```

Run the same command by hand first, **without** the output suppression, and
record the exit code:

```bash
[PHP_8_3_BINARY] -q /home/xvfjmtpchosting/domains/ashernguyenxuanthuy.com/wp-cron.php; echo "exit=$?"
```

### 7.3 Fallback — HTTP, only if PHP CLI is unavailable

Already proven reachable: `/wp-cron.php?doing_wp_cron` returns 200, so the WAF
does not block it [VERIFIED].

```cron
*/5 * * * * curl -fsS --max-time 60 -A "Gcalls-WP-Cron/1.0" "https://ashernguyenxuanthuy.com/wp-cron.php?doing_wp_cron" >/dev/null 2>&1
```

### 7.4 Only after a successful run — `wp-config.php`, above "That's all"

```php
define( 'DISABLE_WP_CRON', true );
```

### 7.5 Evidence required

- Manual run exited **0** with no fatal.
- A scheduled event's next-run timestamp advances across two windows — check
  twice, at least 5 minutes apart. `action_scheduler_run_queue` too if Action
  Scheduler is installed.
- Site Health reports no missed or failed scheduled event.
- Site Health → Info → WordPress Constants shows `DISABLE_WP_CRON: true`.
- The WAF stays on. No site-wide whitelist. Path-level exceptions only, and
  only if the HTTP fallback is used and actually blocked.

If the system cron fails, remove `DISABLE_WP_CRON` immediately.

---

## 8. DELETE the old admin

Gates: §3 backup PASS · §4 gcalls_owner PASS · §6 plugin live PASS.

1. Note what `admin` owns — 1 post (`hello-world`) as of the baseline.
2. Signed in **as `gcalls_owner`**, go to Users → `admin` → Delete.
3. Choose **"Attribute all content to: `gcalls_owner`"**. Never "Delete all
   content".
4. Verify:
   ```bash
   D=ashernguyenxuanthuy.com
   curl -sS -D - -o /dev/null "https://$D/wp-json/wp/v2/posts?per_page=1" | grep -i x-wp-total   # 1
   curl -sS -D - -o /dev/null "https://$D/wp-json/wp/v2/pages?per_page=1" | grep -i x-wp-total   # 3
   curl -sS "https://$D/wp-json/wp/v2/posts?_fields=id,author,slug"                              # author 2
   curl -sS -o /dev/null -w "?author=2 -> %{http_code} loc=%{redirect_url}\n" "https://$D/?author=2"
   ```
   The last line is the one that proves §6 did its job: `gcalls_owner` now owns a
   published post, which is exactly the condition that used to trigger the 301.
   It must still be **404 with no Location**.
5. Log out and log back in as `gcalls_owner` in a private window.
6. Confirm `gcalls_owner` is the only Administrator and `admin` no longer exists.

---

## 9. PHP LIMITS — domain scope only

In 1Panel, for `ashernguyenxuanthuy.com` **only** — never the hosting-wide PHP
config, which would affect the other domains on this account:

```
upload_max_filesize = 256M
post_max_size       = 256M
memory_limit        = 512M
```

Leave `max_execution_time` as it is unless a real timeout appears.
`post_max_size` must be ≥ `upload_max_filesize`; keep them equal at 256M.

Verify against the running PHP-FPM pool, not the panel form — panels routinely
write a value the active pool never loads:

- wp-admin → Tools → **Site Health → Info → Server**, and
- Elementor → Tools → **System Info**.

Both must agree. If they disagree with the panel, the pool did not reload —
restart PHP-FPM for the domain and re-check.

---

## 10. THEMES

- Keep `gcalls-theme` active [VERIFIED].
- Keep **Twenty Twenty-Five** as the core fallback if `gcalls-theme` ever fatals.
- Delete Twenty Twenty-Four and Twenty Twenty-Three.

```bash
curl -sS -o /dev/null -w "front %{http_code}\n" https://ashernguyenxuanthuy.com/
curl -sS -o /dev/null -w "blog  %{http_code}\n" https://ashernguyenxuanthuy.com/blog/
curl -sS -o /dev/null -w "post  %{http_code}\n" https://ashernguyenxuanthuy.com/hello-world/
```

---

## 11. FINAL 003A CHECKLIST

| # | Check | Source | State |
| --- | --- | --- | --- |
| 1 | Homepage 200 | curl | [VERIFIED] |
| 2 | `/blog/` 200 | `wp:live-verify` | [VERIFIED] |
| 3 | wp-admin works | browser | pending |
| 4 | `gcalls_owner` login | §4 | pending |
| 5 | old `admin` deleted, content attributed | §8 | pending |
| 6 | front page id 13 · posts page id 16 | `wp:live-verify` | [VERIFIED] |
| 7 | permalinks `/%postname%/` | curl | [VERIFIED] |
| 8 | Elementor editor opens | browser | pending |
| 9 | Rank Math active | browser | pending |
| 10 | gcalls-core active, no fatal | §6 | pending |
| 11 | REST root 200 | curl | [VERIFIED] |
| 12 | REST users 401 | curl | [VERIFIED] |
| 13 | author enumeration closed | §6 | **source fixed, not deployed** |
| 14 | XML-RPC 403 | curl | [VERIFIED] |
| 15 | WP-Cron runs from system cron | §7.5 | pending |
| 16 | `DISABLE_WP_CRON` only after cron PASS | §7.4 | pending |
| 17 | WP 256M / PHP 512M | §5, §9 | pending |
| 18 | Site Health free of scheduled-event errors | browser | pending |
| 19 | noindex — all four layers | `wp:live-verify` | [VERIFIED] — header, meta `noindex, nofollow`, robots.txt |
| 20 | no PHP warning/fatal | `wp:live-verify` (rendered HTML) | [VERIFIED] on `/` and `/blog/`; error log still to check |
| 21 | responsive 1440/1024/768/390/320 | browser | pending |
| 22 | backup integrity | §3 | pending |

003A is PASS only when every row is PASS. 003B does not start before that.
