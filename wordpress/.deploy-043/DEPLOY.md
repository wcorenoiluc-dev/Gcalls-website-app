# GCALLS-043 — deployment package (PREPARED, NOT DEPLOYED)

Nothing here has been applied to the demo. Admin access was confirmed this
session (`DEMO_ACCESS_PASS`), so the blockers below are the reason, not the
access.

## Live fingerprint — BEFORE (measured 2026-09-02, read-only)

| | |
| --- | --- |
| WordPress | **7.1** (`branch-7-1`, admin body class) |
| Elementor | **4.2.3** (active) |
| Gcalls Core | **0.10.0** (asset `?ver=0.10.0`) |
| Gcalls Theme | **0.8.5** (asset `?ver=0.8.5`) |
| Other active plugins | Rank Math SEO 1.0.276, UpdraftPlus 1.26.7 |
| `gc-components.css` | **absent** |
| `lead-form.css` | **absent** |
| Home page | **18** top sections, **0** inner sections |
| Home form | `<fieldset disabled>` + "chưa được kết nối" notice |
| Home mockup figures | hero 84 / 73% / 5:24 / 11 · analytics **114 / 73% / 3:25** |
| `/lien-he/` | **0 forms**, `.gcalls-cp__slot` note |
| Published posts | **18** (REST `X-WP-Total`) |

## Candidate — AFTER

| | File | SHA-256 |
| --- | --- | --- |
| Core | `candidate/gcalls-core-0.10.5.zip` | `4b20ff1627e79d9586b41a3a51220cd8af1dbbfa82f7b994c9a4c99acd706a6b` |
| Theme | `candidate/gcalls-theme-0.8.6.zip` | `4027f98fbabd08573891725c467c36550c16ce5b2229f30f79a291593d51c976` |

Local QA on the same stack as live (WP 7.1 + Elementor 4.2.3): acceptance
**90/90**, leads **65/65**, media-frames **33/33**, renderer **30/30**,
output scan **0 findings**.

## Rollback — verified in this package

| | File | SHA-256 |
| --- | --- | --- |
| Core 0.10.0 | `rollback/gcalls-core-0.10.0.zip` | `929a55d6555cdd25ba94c71bf25a67b16eadf0762217cf369322e5340656d8f8` |
| Theme 0.8.5 | `rollback/gcalls-theme-0.8.5-d8d8615.zip` | `83bc1ff8bc5760204871c2b71f8f7eb7953a1e0158e466a38c185683db2833e8` |

Both match the live fingerprint above, so a rollback restores exactly what is
running now. **Order matters:** if the home layout is applied, undo it from
*Gcalls → Home Layout → Khôi phục* BEFORE downgrading the plugin — the
rollback snapshot lives in a plugin option.

## Conditions still unmet — deployment must not proceed until these are resolved

| # | Condition | Owner action | Why it blocks |
| --- | --- | --- | --- |
| 1 | **SMTP not configured** | Set up authenticated sending for the site domain | The form would store leads and silently fail to notify. `From` must stay on the site domain; Gmail is the recipient only |
| 2 | **Inbox unconfirmed** | Send a test and confirm arrival at `socialgcall@gmail.com` | "Transport accepted" has only been proven against a local capture |
| 3 | **Page cache untested** | Exclude `/` and `/lien-he/` from edge/page cache, then retest | A cached nonce and idempotency token get served to the next visitor. No access to test this |
| 4 | **Gate A1 — repo Public with PII history** | Owner decision | Unchanged since 035 |
| 5 | **Gate A2 — PII media public on live** | Owner decision | Unchanged since 035 |
| 6 | **Home layout write** | Approve running *Gcalls → Home Layout → Apply* on live | Replaces `_elementor_data` on the front page; 18 → 13 sections. Destructive, snapshot-backed, and not covered by a plugin upload |

Items 1–3 gate the FORM. Items 4–5 gate the RELEASE. Item 6 is a separate,
explicit write that a plugin upload does not perform on its own.

## Sequence, when the conditions are met

1. UpdraftPlus backup (database + plugins + themes).
2. Upload and activate `gcalls-theme-0.8.6.zip`.
3. Upload and activate `gcalls-core-0.10.5.zip`.
4. Confirm asset URLs report `0.10.5` / `0.8.6` and `lead-form.css` is present.
5. Set *Leads → Cấu hình* recipient to `socialgcall@gmail.com`.
6. Only then: *Gcalls → Home Layout → Apply* (item 6 above).
7. Submit one real lead and confirm both the admin list and the inbox.
