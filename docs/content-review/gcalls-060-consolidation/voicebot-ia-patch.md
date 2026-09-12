# Voicebot IA/SEO Patch — verified still-needed against 466fcda

Owner taxonomy (per coordinator prompt, already decided): **3 products, 7 solutions; Voicebot is
solution-only, reachable, not a product card.** Task 059 proposed this against `1053d44`; re-verified against
the authoritative tip `466fcda` — it is **still unapplied there**, and `466fcda` is internally contradictory
(`hubs.ts` says "ba sản phẩm" / three, while `sitemap.ts` + `navigation.ts` still treat Voicebot as the 4th product).

## Exact field-level changes (apply on a branch from 466fcda)
`src/config/sitemap.ts` — entry WEB-037 (`/voicebot-ai/`):
- `parent: ROUTES.products` → `ROUTES.solutions`
- `group: 'products'` → `'solutions'`
- `eyebrow: 'Sản phẩm'` → `'Giải pháp'`
- `label: 'Gcalls Voicebot AI'` → `'Voicebot AI'` (hubs.ts forbids the "Gcalls-built engine" reading)
- Rewrite the WEB-037 comment block (currently: "`/voicebot-ai/` is now the fourth item in the products mega
  menu and the footer's product column, and the fourth card on the products hub") to describe it as a solution.
- Scope comment lines ~21–25 ("minted `/voicebot-ai/` as a product route … a product decision") — mark corrected to solution-only.
- WEB-002 products-hub description (~line 195) lists "…Gcalls CX và Gcalls Voicebot AI" → remove Voicebot from the products overview (products = three).

`src/config/navigation.ts`:
- Products mega-menu column (~line 68): remove `item(ROUTES.voicebotAi)`.
- Footer products column `footer-products` (~line 204): remove `item(ROUTES.voicebotAi)`.
- Add `item(ROUTES.voicebotAi)` to the Solutions mega-menu and `footer-solutions` (confirm it is not already present there).

Already correct in 466fcda (leave as-is): `hubs.ts` PRODUCTS_HUB = three products ("BA SẢN PHẨM"); `SOLUTIONS_HUB`
carries the Voicebot solution card/decision row; `/voicebot-ai/` route remains reachable.

## Post-apply consequences (must all hold)
- Products = exactly 3 (Gcalls Plus, QA QC Center, Gcalls CX). Solutions = exactly 7 incl. Voicebot.
- Voicebot breadcrumb becomes `Giải pháp › Voicebot AI`; remove all "bốn sản phẩm / fourth product" wording.
- `/voicebot-ai/` still returns 200 and is reachable from Solutions hub + Solutions menu + footer-solutions.
- Touches locked shared files (sitemap.ts, navigation.ts) → this is a **coordinator-applied** consolidated
  change, not a worker change, and it **supersedes Core 0.10.11 → rebuild as 0.10.12** (Theme 0.8.7 unchanged).

## Why this is NOT yet applied by this coordinator
`466fcda` is a live, actively-moving shared branch owned by the WordPress/integration worker (GCALLS-053).
Committing taxonomy edits directly onto it risks colliding with in-flight work. Recommended: apply on an
isolated branch cut from the current tip, QA, and hand the exact diff to the single WordPress owner for the
0.10.12 build — or the owner applies it directly on their branch. Confirm target branch before I edit source.
