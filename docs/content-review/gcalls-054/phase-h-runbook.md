# Phase H — Demo Deployment Runbook (PROPOSAL, not executed)

Nothing here has been run. This is the ordered plan to execute **only after** GCALLS-053 produces a
Core `0.10.11` ZIP that passes Phase G, and after the owner supplies the missing access/snapshots.

## Preconditions (all must be true before starting)
- [ ] Core `0.10.11` ZIP exists and **Phase G PASS** (GCALLS-053). *(Today: latest local is 0.10.10 → BLOCKED.)*
- [ ] Owner has an authenticated **wp-admin** session (this session does not). *(Today: BLOCKED.)*
- [ ] Pre-deploy **DB + uploads snapshot** taken and confirmed restorable (see rollback-readiness.md). *(Today: MISSING.)*
- [ ] Current-version rollback ZIPs staged: Core `0.10.8`, Theme `0.8.5` (present locally).
- [ ] Owner decision on the OneShield cache blocker (see §"Infra gate").

## Deployment manifest (proposal)
**Include:**
- Plugin candidate: `gcalls-core-0.10.11.zip` (once built + Phase G PASS + SHA verified).
- Theme candidate: only if 0.10.11 requires a theme bump; otherwise keep live `gcalls-theme 0.8.5`.
- Targeted content manifest: only the 37 approved content pages' updates that ship with 0.10.11.
- Homepage artifact: the approved homepage Elementor layout (single apply).
- Approved media allowlist: only owner-approved, PII-cleared product imagery.

**Exclude (hard):**
- Blog articles and the 163 migration drafts.
- Retired redirects not part of this release.
- Corpus Execute (do not run).
- Lead backend / form transport, SMTP settings, cache settings.
- PII / private assets / refused media.

## Ordered steps (Phase H)
1. **Reconfirm target** — `ashernguyenxuanthuy.com` is the demo (re-check `/wp-json/` name/home; confirm not gcalls.co).
2. **Snapshot** — DB export + uploads snapshot + menu export + live homepage `_elementor_data` export.
3. **Verify ZIP SHA** — record SHA-256 of `gcalls-core-0.10.11.zip`; confirm it matches the Phase G-approved artifact.
4. **Upload Core** — via wp-admin Plugins → Add New → Upload (owner).
5. **Activate / update** — activate 0.10.11; confirm no fatal, no white screen.
6. **Verify child routes** — all 37 routes return 200 / one H1 (compare to `route-baseline-before.json`).
7. **Apply homepage once** — run the homepage layout apply exactly once; verify one H1 + section count vs `homepage-baseline.json`.
8. **Purge cache in-scope** — purge OneShield/edge for the deployed routes; then **exclude `/lien-he/` from full-page cache** before any form use.
9. **Anonymous regression** — re-run this collector; diff against the baselines (routes, homepage, 18 posts, 38 pages, menus).
10. **Owner review** — visual sign-off.
11. **Rollback if P0 FAIL** — restore Core `0.10.8` + Theme `0.8.5` ZIPs, then restore DB/uploads/menus/homepage from the step-2 snapshot.

## Post-deploy regression baselines to diff against
- `route-baseline-before.json` (37 routes: status, H1, sections, wordcount, shortcodes, broken imgs, overflow, content hash).
- `homepage-baseline.json` (H1, 18 sections, 67 widgets, form present, content hash).
- `published-18-baseline.json` (18 posts must stay published, same IDs/slugs/hashes).
- `page-status-baseline.json` (38 pages must stay `publish` — detect draft-flips / content loss).
- `menu-baseline.json` (header 36 / footer 25 anonymous nav links).

## Infra gate (independent of the 0.10.11 deploy)
`INFRA_ONESHIELD_BLOCKED` / `CONTACT_CACHE_UNSAFE`: `/lien-he/` is full-page cached and strips security
headers on HIT; a cache-buster query does not bypass it. This must be fixed in OneShield config (not
PHP/.htaccess) and re-verified before any lead form is treated as live. Do not emit `FORM_LIVE_PASS`.
