# GCALLS Website — Prioritised Audit

**Audit date:** 2026-07-27
**Baseline:** commit `f476b59` (Figma Make export)
**Branch:** `feature/gcalls-website-foundation`
**Scope:** Audit only. No layout, content, navigation, colour, hierarchy, product scope, SEO copy or demo imagery was changed.

**Brand context:** GCALLS · *CALL SMARTER, GROW FASTER* · The Integration & Communication Standard · Primary `#673AB7` · Open Sans · **mobile-first, primary viewport 390 px**.

---

## Severity key

| Level | Meaning |
|---|---|
| **P0** | Blocks local development, the build, or shipping to production at all |
| **P1** | Blocks mobile, SEO, or conversion — the three stated priorities |
| **P2** | Cleanup / refactor — real debt, no immediate user impact |

**Headline:** the project **builds and runs cleanly with zero code changes**. There are no P0 build failures. Every P0 below is a *shipping* blocker, not a *running* blocker.

---

## P0 — Blocks local / build / launch

### P0-1 · `noindex, nofollow` is hardcoded in `index.html`
`index.html:9` — `<meta name="robots" content="noindex, nofollow" />`
A Figma Make preview default. If it reaches production, GCALLS is invisible to every search engine. Single highest-risk line in the repository.

### P0-2 · No `.gitignore`
After `npm install` + `npm run build`, `git status` lists `node_modules/`, `dist/` and `package-lock.json` as untracked. `node_modules/` will eventually be committed. Needs a `.gitignore` before any further commits — and `package-lock.json` should be committed deliberately.

### P0-3 · No TypeScript configuration or compiler
`.tsx` sources, but no `tsconfig.json`, no `typescript` package, no `@types/react`. `npm run typecheck` does not exist. esbuild strips annotations without checking them, so type errors surface only at runtime. This must exist **before** the monolith is refactored, or the refactor is unverifiable.

### P0-4 · No lint, no format, no tests, no CI
No ESLint, no Prettier, no test runner, no test files, no CI workflow. `npm run lint` and `npm test` do not exist. Nothing prevents a regression from reaching `main`.

### P0-5 · No lockfile was exported
Figma Make committed no lockfile, so installs were non-deterministic. Compounded by React being declared only as an **optional `peerDependency`** — `react`/`react-dom` are absent from `dependencies` entirely and resolved only because npm 7+ auto-installs peer deps. A different package manager or `--legacy-peer-deps` install produces a project with no React. `react` and `react-dom` belong in `dependencies`.

### P0-6 · Package-manager signals conflict
`pnpm-workspace.yaml` + a `pnpm.overrides` key point to pnpm; `README.md` says npm; no lockfile breaks the tie. Worse, `pnpm-workspace.yaml` pins `supportedArchitectures.os` to **`linux` only** — a Figma Make sandbox artifact that would fetch wrong-platform binaries on macOS. **Resolved for now as npm** (README-documented, only PM installed, no lockfile to preserve). Must be ratified by the team and the stale pnpm file fixed or removed.

### P0-7 · Two high-severity dependency advisories
- `react-router@7.13.0` — **12 advisories** (RCE via turbo-stream deserialization, XSS, open redirect, CSRF, DoS). **The package is never imported.** Removing it eliminates the entire class.
- `vite@6.3.5` — 7 advisories (dev-server path traversal, arbitrary file read via WebSocket, `server.fs.deny` bypass). Dev-time only; patch before exposing the dev server on any network.

### P0-8 · Placeholder project identity
`package.json` name is `@figma/my-make-file`. `<title>` is `Gcalls -` (trailing dash, no keywords). `README.md` is Figma Make boilerplate pointing at the frozen Figma file. No favicon. All ship as-is today.

---

## P1 — Blocks mobile / SEO / conversion

### Mobile

Measured in-browser via a same-origin iframe at exact viewport widths (Chrome clamps real window width on macOS, so window resizing could not reach 390 px).

| Metric | **390 px** | 768 px | 1024 px | 1440 px |
|---|---|---|---|---|
| Document height | **33,127 px** | 22,782 px | 16,645 px | 16,186 px |
| Elements overflowing their container | **100** | 43 | 8 | 3 |
| Text nodes actually cut off | **6** | 2 | 0 | 0 |
| Unintended horizontal scrollbars | **2** | 0 | 0 | 0 |
| Interactive elements < 44 px | **72 / 100** | 84 / 100 | 81 / 100 | 84 / 100 |
| Text nodes < 14 px | **655** | 655 | 655 | 655 |
| Text nodes < 12 px | **499** | 499 | 499 | 499 |
| Absolutely positioned elements | 74 | 74 | 74 | 74 |

---

#### P1-1 · Typography is not responsive at any breakpoint — *highest-impact mobile issue*
The `< 14 px` (655) and `< 12 px` (499) counts are **byte-identical at 390, 768, 1024 and 1440 px**. Nothing scales.

| Size | Text nodes | Hardcoded utilities in `App.tsx` |
|---|---|---|
| 8 px | 23 | `text-[8px]` × 5 |
| 9 px | 136 | `text-[9px]` × 47 |
| 10 px | 204 | `text-[10px]` × 91 |
| 11 px | 136 | `text-[11px]` × 41 |
| 12 px | 151 | — |
| 13 px | 5 | `text-[13px]` × 1 |

8–11 px type was chosen to make desktop product mockups look dense. On a 390 px phone it is the same 8–11 px. Examples measured live: `text-[8px]` weekday labels (`T2`, `T3`), `text-[9px]` status lines (`Đang gọi · 04:12`), `text-[10px]` phone numbers and timestamps, `text-[11px]` KPI captions (`Cuộc gọi hôm nay (minh họa)`).

#### P1-2 · Mobile navigation does not exist
`src/app/App.tsx:49-121`. `NavBar` declares `const [mobileOpen, setMobileOpen] = useState(false)` and toggles the icon between `<MoreHorizontal>` and `<X>` — but **no drawer, sheet or menu is ever rendered anywhere in the component**.

Verified in-browser at 390 px: clicking the hamburger leaves header height at 65 px, produces no overlay (`[role=dialog]` count 0), and the link count stays at 5 — all still inside `<nav class="hidden md:flex …">`, i.e. `display:none`.

**A mobile visitor has zero navigation links and no way to reach any part of the site except scrolling 33,127 px.**

#### P1-3 · Hero mockup composite collapses at 390 px
The floating `FloatingTimeline` / `FloatingCRM` / `FloatingAnalytics` / `FloatingDialpad` / `DashboardMain` cards are absolutely positioned at desktop geometry (74 absolutely positioned elements, unchanged at every breakpoint). At 390 px they overlap each other and are cut off on both edges: KPI labels truncate mid-word (`Cuộc gọi hôm nay` clipped, its value hidden), the CRM card runs off the left edge, and the dialpad renders on top of the team list. Visually unreadable.

#### P1-4 · `overflow-x-hidden` on the root masks all overflow
`src/app/App.tsx:4666` — `<div className="relative bg-background text-foreground overflow-x-hidden">`.

Because of this, `document.scrollWidth` equals the viewport at every size and the page *appears* to have no overflow. In reality **100 elements overflow at 390 px**; their content is silently clipped rather than reflowed. This hides the problem from casual testing and from most automated overflow checks.

Confirmed genuinely-cut-off text at 390 px (not decorative): `Đã nghe` (7 px cut), `166 s` (5 px), `Thêm` (36 px), `Ready` (33 px), `Cuộc gọi đến · 1900 1234` (25 px), `Từ chối` (24 px).

#### P1-5 · Two unintended horizontal scrollbars at 390 px
- Status-filter tab row (`div.flex.gap-1.px-4.pt-3`): 267 px visible, 519 px content — **252 px hidden**. The `Vắng mặt` and `Ngoại tuyến` filters are unreachable without a horizontal drag most users will not discover.
- Activity-history panel: 140 px visible, 146 px content — 6 px hidden.

#### P1-6 · 72 % of tap targets are below the 44 px minimum
72 of 100 interactive elements at 390 px are under 44 × 44 px (Apple HIG / WCAG 2.5.5 minimum). Worst offenders are inside the interactive mockups — dialpad keys, playback controls, filter chips, tab buttons. The ratio does not improve at larger viewports (84/100 at 768 px), confirming sizes are fixed rather than responsive.

#### P1-7 · Desktop-first breakpoint strategy contradicts the mobile-first mandate
Across 4,679 lines: **13** `sm:` utilities, **33** `md:`, **45** `lg:`. Mobile layout is the residue left when desktop rules stop applying, not a designed state. This is the structural cause of P1-1 through P1-6.

#### P1-8 · Page is 2× too long on mobile
33,127 px at 390 px vs 16,186 px at 1440 px. Nine full-bleed `min-h-screen` sections with no mobile-specific density, collapsing, or progressive disclosure.

---

### SEO

#### P1-9 · `<html lang="en">` but 100 % of content is Vietnamese
`index.html:3`. Misdeclares the document language to search engines, screen readers and translation tooling. Should be `vi` (and an hreflang strategy decided if English is planned).

#### P1-10 · Meta description is English, content is Vietnamese
`index.html:8` — *"Streamline your sales and customer service operations with a powerful webphone platform…"*. Mismatched with every visible string on the page and with the Vietnamese search intent the site targets.

#### P1-11 · `<title>` is a placeholder
`Gcalls -`. No brand positioning, no tagline, no keyword, trailing dash. Nothing to rank on.

#### P1-12 · No social, canonical, structured data or favicon
Measured on the rendered document:

| Tag | Count |
|---|---|
| `<link rel="canonical">` | **0** |
| `og:*` | **0** |
| `twitter:*` | **0** |
| `application/ld+json` | **0** |
| `<link rel="icon">` | **0** |

No Organization / SoftwareApplication / Product / FAQPage schema. A shared GCALLS link renders with no preview card at all.

#### P1-13 · Zero real images
**0 `<img>` elements**; all 335 visuals are inline SVG or DOM redraws. Consequences: no image search presence, no OG preview image available, no `alt` text surface, and every "product screenshot" must be re-coded by hand rather than swapped as a file.

#### P1-14 · No anchorable sections and no working links
- 0 of 9 `<section>` elements have an `id`.
- All 5 nav links are `href="#"`.
- **Total distinct `href` values in the entire document: 1** (`#`).

There is no internal linking, no deep-linkable section, and nothing for a crawler to follow.

#### P1-15 · Client-rendered SPA with no SSR
517 KB of DOM built entirely in the browser from a single 344 KB JS chunk. Workable for modern crawlers, but a structural ceiling for a marketing site whose positioning is "The Integration & Communication Standard". **The Next.js/Astro question should be decided at this checkpoint** — not after the site is rebuilt in Vite.

#### P1-16 · Missing conversion-critical pages
Nav advertises **Bảng giá** (pricing) and **FAQ**; neither exists in any form. Pricing and FAQ pages are typically the highest-intent organic entry points for B2B SaaS, and FAQ content is the natural home for `FAQPage` structured data.

---

### Conversion

#### P1-17 · Every call-to-action is inert
| Check | Result |
|---|---|
| Primary CTAs | 9 |
| CTAs with an `onClick` handler | **0** |
| CTAs wrapped in an anchor | **0** |
| Total `<button>` elements | 93 |
| Buttons with a click handler | **0** |
| Buttons with a `type` attribute | **0** |

Affected: `Đăng ký tư vấn` (×5), `Khám phá tính năng`, `Khám phá Gcalls Webphone`, `Khám phá Analytics`, `Tư vấn tích hợp`.

#### P1-18 · No lead-capture mechanism
**0 `<form>` elements.** 1 `<input>` on the whole page — a decorative dialpad field inside a mockup. No contact form, no demo request, no email capture, no phone/Zalo link, no calendar embed.

**The site cannot capture a single lead.**

#### P1-19 · No analytics or tracking
No Google Analytics, no GTM, no Meta Pixel, no consent banner. Launching without this means zero attribution data from day one and no baseline to measure the redesign against.

#### P1-20 · No footer
The page ends at `WorkFromAnywhereSection`. No footer, no contact details, no address, no legal links, no sitemap links, no social profiles. Costs both trust signals and internal-linking SEO value.

---

### Accessibility *(overlaps mobile + SEO)*

#### P1-21 · No accessibility affordances
- **0** `aria-label` attributes across the entire document.
- 93 buttons, none with `type`; the hamburger has no `aria-expanded` / `aria-controls`.
- Hover states are applied via imperative JS `onMouseEnter`/`onMouseLeave` (30 handlers) and therefore **never trigger on keyboard focus**.
- 655 text nodes below 14 px and 499 below 12 px present serious contrast/legibility problems independent of colour.

---

## P2 — Cleanup / refactor later

### P2-1 · 4,679-line single-file monolith
`src/app/App.tsx` — 237 KB, ~40 components, ~30 inline datasets, nothing exported. Blocks parallel work and code review. **Do not split until P0-3 (typecheck) and P0-4 (lint) are in place.**

Suggested target: `src/components/layout/`, `src/sections/` (9 files), `src/components/mockups/` (14 files), `src/data/` (extracted constants).

### P2-2 · Design tokens defined but bypassed
`src/styles/theme.css` correctly defines `--primary: #673ab7`, `--font-sans: 'Open Sans'`, radii and semantic colours. `App.tsx` ignores them:

| Pattern | Count |
|---|---|
| Inline `style={{ … }}` objects | 691 |
| Hardcoded hex colours | 845 (65 distinct) |
| Hardcoded `#673ab7` | **218** |
| Inline `fontFamily` repeats | 72 |

A brand-colour change costs 218 edits instead of 1. Prerequisite for any systematic redesign.

### P2-3 · Dead code and repository weight

| Item | Size | Status |
|---|---|---|
| `src/app/components/ui/**` (43 shadcn components) | ~200 KB | 0 references |
| `src/app/components/figma/ImageWithFallback.tsx` | — | 0 references |
| `src/imports/SEO-AIO-…pdf` | **2.4 MB** | Binary in git, unused by code |
| `default_shadcn_theme.css` | 4.3 KB | Never imported |
| `src/styles/globals.css` | 0 bytes | Empty *and* never imported |
| `guidelines/Guidelines.md` | — | Unmodified Figma Make template |

Note: the shadcn kit is tree-shaken out of the bundle. It is repo/install weight and dependency surface, not payload. **Keep the kit** if the redesign will adopt shadcn; delete it if not — decide deliberately.

### P2-4 · 14 unused dependencies of 55
`@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `@mui/material`, `@popperjs/core`, `canvas-confetti`, `date-fns`, `motion`, `react-dnd`, `react-dnd-html5-backend`, `react-popper`, `react-responsive-masonry`, `react-router`, `react-slick`.

MUI + Emotion alongside Tailwind is a second, unused styling system. `react-router` removal also clears P0-7.
*(`tw-animate-css` looks unused but is imported by `src/styles/tailwind.css` — keep it.)*

### P2-5 · Fragile imperative hover pattern
30 `onMouseEnter`/`onMouseLeave` handlers mutate `.style` directly; **8 use `e.target` instead of `e.currentTarget`** (`App.tsx:83, 84, 87, 88, 106, 109, 448, 449`). On today's text-only buttons this works, so it is not a live bug — but it breaks the moment an icon or `<span>` is nested inside: the style lands on the child and the hover state sticks. Replace with CSS `:hover`/`:focus-visible`, which also fixes the keyboard gap in P1-21.

### P2-6 · Stale Vite config
`vite.config.ts` registers a `figmaAssetResolver` plugin that maps `figma:asset/*` to `src/assets/`. **`src/assets/` does not exist and there are 0 `figma:asset` imports.** Dead plugin. `postcss.config.mjs` is also an empty placeholder.

### P2-7 · Hardcoded mock data inline
~30 datasets (`callLog`, `contacts`, `kpiData`, `crmContacts`, `agentRows`, `sipAccounts`, `hotlines`, `ivrTree`, `apiEndpoints`, `rolePermissions`, …) live inline in `App.tsx`. Extract to `src/data/` so content can be edited without touching layout — a prerequisite for any future CMS.

### P2-8 · No code splitting
Single 344 KB / 82.6 KB gzip chunk. Not a problem for one route; will become one as routes are added.

### P2-9 · Fonts loaded via runtime `@import`
`src/styles/fonts.css` uses a Google Fonts `@import`, which blocks render and adds a third-party dependency. Self-host Open Sans or use `<link rel="preconnect">` + `preload`.

### P2-10 · Product mockups encode undocumented design intent
The 14 mockup components carry substantial product detail (SIP accounts, IVR trees, API endpoints, role permissions, agent status models). With Figma Make frozen, **this code is the only remaining record of that intent.** Capture it as documentation before any simplification.

### P2-11 · Source briefs not yet reconciled
`src/imports/pasted_text/gcalls-website-update.md` and `gcalls-website-update-scope.json`, plus the 2.4 MB SEO PDF, were **not reviewed in this audit** (content changes were out of scope). They must be read before any copy or scope decision.

---

## Summary counts

| Priority | Findings |
|---|---|
| **P0** | 8 |
| **P1** | 21 (8 mobile · 8 SEO · 4 conversion · 1 accessibility) |
| **P2** | 11 |
| **Total** | **40** |

---

## Recommended next checkpoint

**Checkpoint 2 — Technical foundation (no visual change).**

Ordered so that each step makes the next one safe:

1. **Decide and record** — package manager (npm vs pnpm), and **SSR vs SPA** (Next.js/Astro vs staying on Vite). The SSR decision determines whether the refactor below targets the right structure; making it after the rebuild wastes the rebuild.
2. **P0-2** — add `.gitignore`; commit `package-lock.json`.
3. **P0-5** — move `react`/`react-dom` into `dependencies`.
4. **P0-3** — add `tsconfig.json`, `typescript`, `@types/react`, `@types/react-dom`; add a `typecheck` script; fix whatever it surfaces.
5. **P0-4** — add ESLint + Prettier + `lint` script; add CI running `typecheck`, `lint`, `build` on every PR.
6. **P0-7 / P2-4** — remove the 14 unused dependencies (clears 12 `react-router` CVEs); patch Vite.
7. **P0-8** — rename the package, set a real `<title>`, add a favicon, rewrite `README.md`.
8. **P2-1** — split `App.tsx` into layout / sections / mockups / data. **Only after steps 4–5**, so the split is verified rather than hoped.

Explicitly **deferred to Checkpoint 3** (they are design and content decisions, not technical ones): the mobile-first rebuild (P1-1 → P1-8), the SEO metadata rewrite (P1-9 → P1-16), and the conversion layer (P1-17 → P1-20).

**P0-1 (`noindex, nofollow`) is deliberately left in place** — it is correct for a pre-launch site and must be removed as part of the go-live checklist, not now. It is recorded here so it cannot be forgotten.

---

## Verification notes

- All viewport measurements were taken against the live dev server (`http://localhost:5173/`) inside a same-origin iframe sized to exactly 390 / 768 / 1024 / 1440 px CSS pixels. Chrome on macOS clamps real window width (~800 px minimum), so window resizing could not reach 390 px; the iframe was width-corrected for scrollbar inset and verified to report the exact target `clientWidth` before each measurement.
- Mobile-menu, CTA and tap-target findings were confirmed by live DOM interaction, not by reading source alone.
- Dependency usage was derived by extracting every bare module specifier under `src/` and diffing against `package.json` `dependencies`; the `tw-animate-css` false positive was identified and excluded.
- Build, dev-server and install results are reproducible with the commands in [`FIGMA_MAKE_HANDOFF.md` §5](./FIGMA_MAKE_HANDOFF.md#5-run--build-commands).
