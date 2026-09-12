# Chrome Preflight — read-only

**Target:** https://ashernguyenxuanthuy.com/ (confirmed demo host, per GCALLS-054).
**Result: `OWNER_LOGIN_REQUIRED`.** No live changes.

- `GET /wp-admin/` → **HTTP 302 → `/wp-login.php?redirect_to=…&reauth=1`**. This session (Claude Code CLI,
  fresh headless Chrome, no shared cookie jar) has **no authenticated wp-admin session**. Per the standing
  project reality, authenticated 1Panel/wp-admin access is not available to this CLI — it is a
  Claude-in-Chrome capability the owner must provide.
- Credentials were neither requested nor printed. No login attempted.

## Authenticated inventory — BLOCKED (owner must be logged in)
Cannot read without a session: WordPress version, PHP version, active Core/Theme versions (admin-confirmed),
Elementor version (admin), draft post count, active theme/plugin fingerprint, homepage page ID + template
(admin), `_elementor_data` presence/revision count, menu locations + assigned menus, OneShield/cache plugin
presence, SMTP plugin presence/config, backup/export capability, media count.

## What IS known anonymously (from GCALLS-054 preflight, still valid)
- Site "Gcalls", `noindex` demo, HTTP 200, no cross-domain redirect.
- Frontend fingerprint: Core **0.10.8**, Theme **0.8.5**, Elementor **4.2.3** (this is the CURRENTLY-DEPLOYED
  demo, i.e. the rollback baseline — NOT the 0.10.11/0.8.7 artifacts, which are unbuilt-on-host).
- 18 published posts (REST `X-WP-Total=18`); 38 published pages; homepage one H1 / 18 sections / 67 widgets / form present.
- Cache: `INFRA_ONESHIELD_BLOCKED` — `/` and `/lien-he/` full-page cached (`x-osh-cache: HIT`), security
  headers stripped on HIT, query string not in cache key → `CONTACT_CACHE_UNSAFE`.

## To lift OWNER_LOGIN_REQUIRED
Owner logs into `https://ashernguyenxuanthuy.com/wp-login.php` in a browser shared with a Claude-in-Chrome
session (not this CLI), then the read-only authenticated inventory can be captured.
