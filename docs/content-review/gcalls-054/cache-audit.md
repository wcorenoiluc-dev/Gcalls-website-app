# Cache & OneShield Audit (read-only)

**Conclusion: `CONTACT_CACHE_UNSAFE`** — and the infra blocker `INFRA_ONESHIELD_BLOCKED` is
**reproduced today (2026-09-08)**, unchanged from the 2026-08-30 finding. No configuration was changed
and no cache was purged.

## Method
Repeated anonymous `GET` sampling of the `x-osh-cache` edge header and a count of the four security
headers (`X-Robots-Tag`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) per response.
Sampled repeatedly (not once) because a single check can land on a MISS and look clean.

## Results
| Path | Samples | `x-osh-cache: HIT` | Security headers on HIT | On MISS/none |
|---|--:|--:|--:|--:|
| `/` | 8 | 6 | **0/4** | 4/4 |
| `/lien-he/` | 8 | 6 | **0/4** | 4/4 |
| `/lien-he/?cb=<ts>` (cache-buster) | 3 | 3 | 0/4 | — |
| `/wp-login.php` | 2 | 0 (never cached) | 4/4 | 4/4 |

- **Full-page cache is active** at the OneShield edge on both `/` and `/lien-he/`.
- Correlation is exact: `HIT ⇒ 0/4` security headers (the edge strips them after PHP; the origin sends
  them correctly, so a PHP/.htaccess fix cannot help — it must be fixed in OneShield config).
- **Query string is NOT part of the cache key**: `/lien-he/?cb=…` still returns HIT, so a cache-busting
  param does not bypass the cache.
- Two consecutive anonymous `/lien-he/` fetches returned 200 with no `Set-Cookie`; no per-request nonce
  was observable in the anonymous HTML (the current page renders no server nonce we could read, but that
  does not make caching safe — see below).

## Why `CONTACT_CACHE_UNSAFE`
`/lien-he/` is served from full-page cache to anonymous visitors, and the cache key ignores the query
string. Any nonce-bearing WordPress form placed on `/lien-he/` would have its nonce cached and served
**stale and shared** to other visitors (it expires), and the security headers are stripped on the cached
response. Per the standing rule, a lead form must never ship while `/lien-he/` returns cache HIT.

## Required before any form ships (Phase H / infra)
1. Exclude `/lien-he/` (and any form/nonce route) from OneShield full-page cache.
2. Restore the four security headers on cached responses (OneShield config, not PHP).
3. Re-sample repeatedly to confirm `/lien-he/` returns no `x-osh-cache: HIT` and 4/4 headers.

Until then keep open: `INFRA_ONESHIELD_BLOCKED`, `CONTACT_CACHE_UNSAFE`. Not verifiable from here
(no edge/1Panel access): the OneShield rule screen itself — owner must inspect it.

## Cache plugin / CDN
- No `x-cache` / `cf-cache-status` / `cf-ray` / `via` / `age` / `x-powered-by` headers were exposed;
  the only caching layer visible anonymously is the **OneShield edge** (`x-osh-cache`).
- Whether a WordPress full-page-cache plugin is also installed cannot be determined anonymously →
  needs wp-admin (plugin list).
