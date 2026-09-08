# GCALLS-053 · TASK 054 — Playground runtime restored and verified

Local only. Nothing deployed, nothing committed, no live host touched.
Date of run: 2026-09-08. Machine: macOS (darwin 22.6.0), Node v24.14.0, npm 11.9.0.

---

## 1. Verdict

**YES — the Playground runtime is usable for installing plugin ZIPs and running HTTP
route tests.** Nothing needed reinstalling: `runtime/node_modules` was intact with
`@wp-playground/cli@3.1.52` still present and still carrying the loopback patch. The
fixture booted, served all four product routes at HTTP 200, returned a real 404 for a
non-existent route, survived a stop/start cycle, and accepted a plugin ZIP install
live with no restart.

One real fix was applied to the fixture's own `start.sh` (§8).

---

## 2. Fixture inventory

`/Users/macos/Desktop/Gcalls/GCALLS-WP-LOCAL/`

| Path | Size | State |
| --- | --- | --- |
| `runtime/` | 795M | intact — `node_modules` 574M, `.npm-cache` 221M, `package.json`, `package-lock.json`, `patch-loopback.mjs`, `.npmrc` |
| `site/` | 76M | intact — `wordpress/` (WP core + wp-content + SQLite DB), `fixtures/`, `tests/` |
| `site-rc/` | 76M | present (the GCALLS-039 release-candidate site, installed from ZIPs, WP 6.4.10 too) |
| `candidate/` | 2.2M | `gcalls-core`, `gcalls-theme`, `mu-plugins` |
| `logs/` | 616K | server.log etc. |
| `screenshots/` | 38M | 8 acceptance shots + evidence |
| scripts | — | `start.sh`, `stop.sh`, `start-rc.sh`, `stop-rc.sh`, plus `acceptance-rc.mjs`, `shots.mjs`, `hero-check.mjs`, `orphan-probe.mjs`, `sheet.mjs`, `gallery-shot.mjs` |
| `probe-054/` | 231M | **new, created by this task** — see §8 |

There is no `package.json` at the fixture root; the only one is `runtime/package.json`
(name `gcalls-037-testbed-runtime`), and `runtime/.npmrc` pins the cache to
`runtime/.npm-cache`, so npm never touches `~/.npm`.

**node_modules is intact.** `npm ls --depth=0` in `runtime/` prints exactly:

```
gcalls-037-testbed-runtime@1.0.0 /Users/macos/Desktop/Gcalls/GCALLS-WP-LOCAL/runtime
└── @wp-playground/cli@3.1.52
```

**Loopback patch still applied.** Both vendored bundles still contain
`listen(e.port, '127.0.0.1'` (1 occurrence each in `run-cli-DnHtP68W.js` and
`run-cli-C1asOWCe.cjs`). `patch-loopback.mjs` is idempotent and `start.sh` re-runs it.

**Nothing had to be reinstalled**, so the offline-restore question was never forced.
I did verify the pinned tarball is in the project-local cache and would satisfy an
offline `npm ci`:

- index key `make-fetch-happen:request-cache:https://registry.npmjs.org/@wp-playground/cli/-/cli-3.1.52.tgz`
- integrity `sha512-NXApYcnZwKGOL/E6rdAwHKXbyPFMRIBKF9SX/TlxH9TOgBef0eblwjylnxnYzdAuiOzdJT7PhO4gJw2WSFTZAw==`, identical to the lockfile entry
- the content blob exists on disk: `.npm-cache/_cacache/content-v2/sha512/35/70/2961c9…`, 398 172 bytes

**I did not actually run `npm ci --offline`** — doing so would have wiped the patched
`node_modules` for no benefit, since it was already correct. So "offline restore works"
is *evidenced but not executed*.

---

## 3. Exact versions, and how each was verified

Verified against the running site at `http://127.0.0.1:9400/` via a probe script
(`site/wordpress/gc-probe-054.php`) that `require`s `wp-load.php` and prints real
runtime values.

| Thing | Value | Evidence |
| --- | --- | --- |
| Playground CLI | **3.1.52** | `runtime/node_modules/@wp-playground/cli/package.json` → `"version": "3.1.52"`; lockfile pins the same; `npm ls` agrees |
| WordPress | **6.4.10** | probe `WP_VERSION=6.4.10`; also `site/wordpress/wp-includes/version.php:19` → `$wp_version = '6.4.10'` |
| PHP | **8.3.32**, SAPI `cli`, WASM | probe `PHP_VERSION=8.3.32`, `PHP_SAPI=cli`; response header `x-powered-by: PHP/8.3.32`; loaded extensions include `wasm_memory_storage` and `post_message_to_js`, which only exist in php.wasm |
| Database engine | **SQLite** | probe `DB_CLASS=WP_SQLite_DB`, `DB_FILE=/wordpress/wp-content/database/.ht.sqlite`. Note `DB_SERVER_INFO=8.0.38-mysql-on-sqlite-3.0.0` — that is the SQLite-integration shim reporting a *fake* MySQL banner, not MySQL. Host file: `site/wordpress/wp-content/database/.ht.sqlite`, **446 464 bytes** |
| Elementor | **NOT INSTALLED** in the main fixture | probe `PLUGIN=` lines list only akismet 5.3.2, gcalls-core 0.10.10 (active), hello.php 1.7.2. No elementor directory under `site/wordpress/wp-content/plugins/` |
| Active theme | Gcalls 0.8.5 | probe `THEME=Gcalls 0.8.5` |
| Active plugin | Gcalls Core **0.10.10** | probe; note this is newer than the 0.9.7 the GCALLS-038 checkpoint recorded |

Route smoke test after a clean restart (cookie jar used, because `--login` makes the
first hit a 302):

| Route | HTTP |
| --- | --- |
| `/` | 200 |
| `/gcalls-plus-webphone/` | 200 |
| `/gcalls-cx/` | 200 |
| `/voicebot-ai/` | 200 |
| `/qc-bot-ai/` | 200 |
| `/wp-admin/plugins.php` | 200 |
| `/no-such-page-054/` | **404** (so 200s are real, not a catch-all) |

Pages that exist in the DB: `/case-studies/`, `/ebook/`, `/faq/`, `/gcalls-cx/`,
`/gcalls-plus-webphone/`, `/glossary/`, `/guides/`, `/khach-hang/`, `/qc-bot-ai/`,
`/sample-page/`, `/voicebot-ai/`, `/doi-tac/`. The hub routes (`/giai-phap/`,
`/tich-hop/`, `/san-pham/`, `/lien-he/`) are **not** in this fixture — same gap the
GCALLS-038 checkpoint flagged.

---

## 4. The version question — answered

The brief asks for WordPress 7.1 and Elementor 4.2.3. The GCALLS-038 checkpoint says
Playground "only accepts major.minor" and that the fixture is stuck on 6.4.10.
**Both of those claims are now wrong.** Measured today, with the pinned CLI 3.1.52:

### What the fixture actually has now

WordPress **6.4.10**, no Elementor. Unchanged since GCALLS-038.

### What CLI 3.1.52 can actually install — tested, not assumed

The CLI resolves `--wp` in this order (read out of
`node_modules/@wp-playground/wordpress/index.js`): a URL is used verbatim;
`trunk`/`nightly` → GitHub master.zip; otherwise it queries
`https://api.wordpress.org/core/version-check/1.7/?channel=beta` and takes the first
`autoupdate` offer whose version **starts with** the string you gave; if nothing
matches it falls back to the *inferred* URL `https://wordpress.org/wordpress-<v>.zip`.
The accept regex is
`/^latest$|^beta$|^trunk$|^nightly$|^(?:(\d+)\.(\d+)(?:\.(\d+))?)((?:-beta(?:\d+)?)|(?:-RC(?:\d+)?))?$/`.

Runs I actually performed, each into a fresh empty mount:

| `--wp` value | Result | Evidence |
| --- | --- | --- |
| `7.1` | **SUCCESS** | log: `Resolved WordPress release URL: https://downloads.w.org/release/wordpress-7.1.zip`; booted on port 9600; `version.php` → `$wp_version = '7.1'`; probe `WP_VERSION=7.1` |
| `6.4.3` | **SUCCESS** | log: `Resolved WordPress release URL: https://wordpress.org/wordpress-6.4.3.zip`; booted on port 9700; `version.php` → `$wp_version = '6.4.3'` |
| `6.4` | SUCCESS (the running fixture) | resolves via API to 6.4.10 |
| `6.4.99` | **FAILS** | `Error: PHP.run() failed with exit code 255.` … `Uncaught Exception: Could not unzip file. Error code: 19. File size: 18 bytes.` — i.e. the inferred URL 404s and the 18-byte error page is fed to unzip. Ugly, but it is a hard failure, not a silent substitution |
| `foo` | **FAILS** | `Error: Unrecognized WordPress version. Please use "latest", "beta", "trunk", "nightly", a URL, or a numeric version such as "6.2", "6.0.1", "6.2-beta1", or "6.2-RC1" (see --help for details).` |

So: **patch versions do work.** GCALLS-038's `fetch failed` on `--wp 6.4.3` was the
IPv6 blackhole (§7), not a CLI limitation. The exact production version 6.4.3 is
installable today if that is ever wanted for a like-for-like comparison.

`https://api.wordpress.org/core/stable-check/1.0/` currently lists 884 releases; the
newest are `7.0`, `7.0.1`, `7.0.2`, `7.0.3`, `7.0.4`, `7.1`, and **`7.1` is flagged
`latest`**.

### Is WordPress 7.1 installable with this pinned CLI?

**Yes — verified by running it, not by inference.** WP 7.1 booted on PHP 8.3.32 WASM
with SQLite under CLI 3.1.52, on port 9600, and served requests.

### Is Elementor 4.2.3 installable, and how?

**Yes — verified by installing it.** I downloaded
`https://downloads.wordpress.org/plugin/elementor.4.2.3.zip`
(23 767 245 bytes, sha256 `506a136dc68ecf9187be2175dbd79c9a6d67cfa441a03f5f9f71c27b0334ab72`)
and installed it through a Playground v1 blueprint `installPlugin` step using a
`bundled` file reference. The probe on the 7.1 site reports:

```
PLUGIN=elementor/elementor.php | Elementor | 4.2.3 | active=1
```

**One constraint that matters for the next task.** The plugin API says Elementor 4.2.3
declares `requires: 6.8`, `requires_php: 7.4`, `tested: 7.1`. So Elementor 4.2.3
**cannot be paired with the existing 6.4.10 fixture** — the two halves of the brief
are only compatible on WordPress ≥ 6.8. Elementor's own current release is 4.2.4;
4.2.3 is one patch behind and still downloadable.

### Plain statement, no substitution

- WordPress **7.1 + Elementor 4.2.3 is achievable**, and I have a working instance of
  exactly that pair at `probe-054/site71/` (server currently stopped).
- The **existing** fixture is **6.4.10** and Elementor 4.2.3 will not run on it.
- Someone has to decide which site the route tests run against. These are different
  questions: 6.4.10 is the site that has the Gcalls pages, plugin and theme in it;
  7.1 + Elementor 4.2.3 is a bare site with Twenty Twenty-Five. **I did not merge
  them, and I did not upgrade the existing fixture.** Upgrading 6.4.10 → 7.1 in place
  is a three-major-version jump against a DB built on 6.4 and is not something to do
  silently.

---

## 5. How to start and stop it

```bash
# start (foreground wrapper; the server itself is nohup'd)
/Users/macos/Desktop/Gcalls/GCALLS-WP-LOCAL/start.sh
# prints: ready: http://127.0.0.1:9400/

# different port
PORT=9401 /Users/macos/Desktop/Gcalls/GCALLS-WP-LOCAL/start.sh

# stop
/Users/macos/Desktop/Gcalls/GCALLS-WP-LOCAL/stop.sh
```

`start.sh` already sets the required environment itself:

```
NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection"
```

That is still needed — it is set only in the command environment, nothing system-wide
was changed. The underlying invocation is:

```bash
cd /Users/macos/Desktop/Gcalls/GCALLS-WP-LOCAL/runtime
NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection" \
./node_modules/.bin/wp-playground-cli server \
  --php 8.3 --wp 6.4 --port 9400 \
  --mount-before-install /Users/macos/Desktop/Gcalls/GCALLS-WP-LOCAL/site/wordpress:/wordpress \
  --wordpress-install-mode install-from-existing-files-if-needed \
  --login
```

**URL: `http://127.0.0.1:9400/`.** Because of `--login`, an un-cookied first request
returns 302; use a cookie jar (`curl -L -c jar -b jar`) or the test client will
mis-read every route as a redirect.

Restart durability re-confirmed this session: stop → port free → start → all four
product routes 200 again, DB file unchanged at 446 464 bytes.

---

## 6. How a ZIP gets installed

Three mechanisms exist. **Two are verified, one is not.**

**(a) Extract into the mounted host plugins directory — VERIFIED, no restart needed.**
`site/wordpress` is bind-mounted into the VFS, so host writes are visible to the
running server immediately. I built a throwaway plugin ZIP, ran
`unzip -qo gc-zip-probe.zip` inside
`site/wordpress/wp-content/plugins/`, and the already-running site reported it on the
very next request:

```
PLUGIN=gc-zip-probe/gc-zip-probe.php | GC ZIP Probe 054 | 0.0.1 | active=0
```

I then deleted it; the plugins directory is back to `akismet`, `gcalls-core`,
`hello.php`, `index.php`. This is the simplest path for the candidate ZIPs, and it
persists across restarts because it lives on the host disk.

**(b) Blueprint `installPlugin` step — VERIFIED (on the 7.1 probe).** Schema:
`{"step":"installPlugin","pluginData":{"resource":"bundled","path":"<file>.zip"},"options":{"activate":true}}`.
Pass the blueprint with `--blueprint <file>` plus `--blueprint-may-read-adjacent-files`
(required for `bundled`, which resolves relative to the blueprint file). This both
installs *and* activates, which (a) does not. Example that worked verbatim:
`probe-054/blueprint-71.json`.

**(c) wp-cli — NOT VERIFIED.** The CLI has no wp-cli subcommand. Top-level commands are
`start`, `server`, `run-blueprint`, `build-snapshot`, `php`. You could in principle run
a wp-cli phar through `wp-playground-cli php`, but **I did not test that**, so do not
plan on it.

`candidate/` holds **real copies, not symlinks** — the checkpoint's claim holds:
`find candidate -type l | wc -l` → **0**.

Per the brief I installed **no real candidate ZIP**.

---

## 7. Isolation

- **Bind address: 127.0.0.1 only.** `lsof` shows the main listener as
  `node … TCP 127.0.0.1:9400 (LISTEN)`, and all six ephemeral worker listeners are
  also on `127.0.0.1`. Nothing on `0.0.0.0` or `*`. This depends on
  `runtime/patch-loopback.mjs`, which is still applied and which `start.sh` re-runs.
- **Site URL is local.** Probe: `SITEURL=http://127.0.0.1:9400`, `HOME=http://127.0.0.1:9400`.
  Scanning the SQLite file for URLs finds only `127.0.0.1` hosts plus WordPress's own
  stock defaults (`wordpress.org`, `automattic.com`, `rpc.pingomatic.com`,
  `en.gravatar.com`) that ship in a fresh options table.
- **`blog_public=0`** on the main fixture, and the mu-plugin
  `gcalls-000-airgap.php` is loaded: it short-circuits `pre_wp_mail`, returns a
  `WP_Error` from `pre_http_request`, and forces `blog_public` to `0`. Nothing can
  leave the site.
- **No fixture script or config points at a live Gcalls host.** The only `gcalls.co`
  strings under the fixture (outside `node_modules`) are inside
  `candidate/gcalls-core/` — the plugin header `Plugin URI`/`Author URI`, and a list of
  legacy media URLs inside `data/corpus-migration.json`. Those are inert data, and the
  airgap mu-plugin blocks outbound HTTP anyway. Nothing was fetched from them.
- Caveat, stated because it is a difference from the main fixture: the 7.1 probe I
  created has `blog_public=1` and **no airgap mu-plugin**, since it was booted bare to
  test versions. If that site is ever reused for real work, drop the airgap mu-plugin
  into it first.

---

## 8. What I changed inside the fixture

All inside `/Users/macos/Desktop/Gcalls/GCALLS-WP-LOCAL/`. Nothing else on disk was
modified; no git command of any kind was run.

1. **`start.sh` — one-line bug fix.** The readiness loop was
   `code="$(curl … 2>/dev/null)"`. Under `set -euo pipefail`, curl's exit 7
   ("connection refused") during the boot window aborted the script, so `start.sh`
   printed `started pid …` and then exited silently *without ever printing
   `ready:`* — it looked like a failed start even though the server came up fine.
   Added `|| true` to the substitution, with a comment. Verified: `start.sh` now
   prints `ready: http://127.0.0.1:9400/`. Original saved as `start.sh.bak-054`.
   (`start-rc.sh` has the identical bug; I left it alone since it was out of the
   critical path.)
2. **`site/wordpress/gc-probe-054.php`** — a read-only diagnostic that prints PHP/WP/DB
   versions and the plugin list. Left in place because the next task will want it. It
   is inside the isolated fixture and must never be copied into a release.
3. **`probe-054/`** — new scratch directory, 231M:
   - `elementor.4.2.3.zip` (23M, sha256 above)
   - `blueprint-71.json`
   - `site71/` (208M) — a working **WordPress 7.1 + Elementor 4.2.3 active** site,
     Twenty Twenty-Five, server stopped
   - `site643/` (74M) — a **WordPress 6.4.3** site proving the patch version installs,
     server stopped
   - `logs/` — `probe71.log`, `probe643.log`, `bad-foo.log`, `bad-6.4.99.log`
   - `gc-zip-probe.zip` (496 B) — the throwaway plugin used for the ZIP-install proof
   - Delete the whole directory if the disk is wanted back; nothing else depends on it.
4. Temporarily created and then **removed**
   `site/wordpress/wp-content/plugins/gc-zip-probe/`.

Left running at the end of the session: the main fixture on
`http://127.0.0.1:9400/` (pid file `logs/server.pid`). The 9600/9700/9800 probe
servers were stopped.

---

## 9. Blockers

**None for the runtime itself.** It boots, serves, installs ZIPs, and survives restart
under Node/npm alone, with no sudo, Homebrew, Docker, native PHP, MySQL, global npm
install, or shell/PATH change.

One decision is owed by the owner before route tests are written, and it is a real
fork, not a formality:

> **Elementor 4.2.3 requires WordPress ≥ 6.8, so it cannot run on the existing 6.4.10
> fixture.** Either the route tests run on 6.4.10 (which has the Gcalls pages, plugin
> 0.10.10 and theme, but no Elementor), or on a WordPress 7.1 site (which has Elementor
> 4.2.3 but is otherwise bare and would need the Gcalls content rebuilt in it). Those
> are not interchangeable. I did not pick one and did not upgrade anything in place.

Two smaller notes:

- The IPv6 workaround is still required. Without
  `NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection"`,
  any Playground run that downloads WordPress will fail. It stays in the command
  environment; no system config was touched.
- This fixture has **no hub-route fixtures** (`/giai-phap/`, `/tich-hop/`,
  `/san-pham/`, `/lien-he/`). Route tests covering those need pages created first.
