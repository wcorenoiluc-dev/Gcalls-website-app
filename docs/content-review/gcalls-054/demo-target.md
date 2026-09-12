# Demo Target — Confirmed

**Signal: `DEMO_TARGET_CONFIRMED`**

| Field | Value | Evidence |
|---|---|---|
| Demo URL | `https://ashernguyenxuanthuy.com/` | `GCALLS-BOSS-DEMO-CHECKLIST.md` ("Demo URL:"), `RUNBOOK_003A_LIVE_HARDENING.md`, GCALLS-007/008/040/047/048 acceptance |
| wp-admin URL | `https://ashernguyenxuanthuy.com/wp-admin/` | 302 → `wp-login.php` (verified) |
| wp-login URL | `https://ashernguyenxuanthuy.com/wp-login.php` | owner must log in here for the authenticated half |
| Server IP | 103.75.184.31 (1Panel / iNET OnePortal) | RUNBOOK_003A |
| Docroot | `/home/xvfjmtpchosting/domains/ashernguyenxuanthuy.com` | RUNBOOK_003A |
| Site title | `Gcalls` | `GET /wp-json/` → `name` |
| Site description | `Giải pháp tổng đài và chăm sóc khách hàng` | `/wp-json/` |
| Home URL | `https://ashernguyenxuanthuy.com` | `/wp-json/` → `home` |
| Site URL | `https://ashernguyenxuanthuy.com` | `/wp-json/` → `url` |
| Timezone | Asia/Ho_Chi_Minh (gmt_offset 7) | `/wp-json/` |
| Environment | **Private content-review demo** (not staging, not production) | `PRIVATE_DEMO_SETUP.md` + `x-robots-tag: noindex, nofollow, noarchive, nosnippet, noimageindex` on every page |
| Redirect to another domain? | **No.** Root returns 200; home/url self-consistent; no redirect to `gcalls.co` | verified headers |

## Why this is safe to treat as the target
- The URL is named as the demo in the repo's own runbook and boss-demo checklist — not inferred.
- Every response carries `x-robots-tag: noindex,nofollow` → this is the out-of-search review demo
  described in `PRIVATE_DEMO_SETUP.md`, which "talks to no production system".
- `gcalls.co` was never contacted and is explicitly NOT the target.

## Access reality
- Anonymous HTTP + WP REST (published content) + headless Chrome: **available** (all evidence here).
- Authenticated wp-admin / SSH / 1Panel: **NOT available to this session** — `/wp-admin/` redirects to
  the login screen; no session cookie exists. The authenticated half of the audit is blocked and listed
  per section. See `[[gcalls-demo-host-no-agent-access]]`.
