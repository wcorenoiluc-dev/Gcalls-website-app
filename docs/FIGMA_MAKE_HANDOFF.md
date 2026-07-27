# GCALLS Website — Figma Make Handoff

**Status:** Baseline captured. Figma Make is frozen as a visual/reference baseline only.
**This Git repository is now the production source of truth.** No changes will sync back to Figma Make.

---

## 1. Export metadata

| Item | Value |
|---|---|
| Export date (commit date) | 2026-07-27 |
| Baseline commit | `f476b59` — "Add files from Figma Make" |
| Initial commit | `5224277` |
| Figma source (reference only) | `https://www.figma.com/design/wRJWKf3TdhGG364RrBchX0/Gcalls--` |
| Audit date | 2026-07-27 |
| Audit branch | `feature/gcalls-website-foundation` |
| Package name in `package.json` | `@figma/my-make-file` (placeholder, not renamed) |

---

## 2. Current framework & stack

| Layer | Detected | Notes |
|---|---|---|
| Framework | **React 18.3.1** (SPA) | Not Next.js. No SSR/SSG. |
| Build tool | **Vite 6.3.5** | `@vitejs/plugin-react` |
| Language | TSX source | **No TypeScript compiler installed, no `tsconfig.json`** — types are stripped by esbuild, never checked |
| Package manager | **npm** (see §4) | No lockfile was committed by Figma Make |
| Routing | **None** | `react-router@7.13.0` is a dependency but is *never imported*. Single-page scroll layout. |
| Styling | **Tailwind CSS v4.1.12** (via `@tailwindcss/vite`) + heavy inline `style={{}}` | Design tokens defined in `src/styles/theme.css` but largely bypassed |
| Component library | shadcn/ui (43 components) + Radix primitives | **Entirely unreferenced by the application** |
| Icons | `lucide-react` 0.487.0 | 60+ icons imported into one file |
| Fonts | Open Sans + DM Mono | Loaded from Google Fonts CDN at runtime |
| State | Local `useState` only | 27 `useState` calls, no global state, no data layer |
| Tests | **None** | No test runner, no test files |
| Lint / format | **None** | No ESLint, no Prettier, no config files |
| CI | **None** | No workflows |

---

## 3. Repository architecture

```
.
├── index.html                      # Vite entry; contains ALL SEO metadata
├── package.json                    # name: @figma/my-make-file — only `dev` + `build` scripts
├── package-lock.json               # generated during this audit (was absent)
├── vite.config.ts                  # react + tailwind plugins, @ alias, figma:asset resolver
├── postcss.config.mjs              # empty (Tailwind v4 handles PostCSS itself)
├── pnpm-workspace.yaml             # Figma Make artifact — linux/x64 only (see §7)
├── default_shadcn_theme.css        # UNUSED — not imported anywhere
├── README.md                       # Figma Make boilerplate
├── ATTRIBUTIONS.md                 # shadcn/ui + Unsplash licences
├── guidelines/Guidelines.md        # empty Figma Make template (all content commented out)
└── src/
    ├── main.tsx                    # 6 lines — createRoot(<App />)
    ├── app/
    │   ├── App.tsx                 # ⚠️ 4,679 lines / 237 KB — THE ENTIRE WEBSITE
    │   └── components/
    │       ├── ui/                 # 43 shadcn components — 0 referenced
    │       └── figma/
    │           └── ImageWithFallback.tsx   # 0 referenced
    ├── styles/
    │   ├── index.css               # imports fonts + tailwind + theme
    │   ├── fonts.css               # Google Fonts @import
    │   ├── tailwind.css            # Tailwind v4 entry + tw-animate-css
    │   ├── theme.css               # design tokens (--primary: #673ab7, Open Sans)
    │   └── globals.css             # EMPTY, and never imported
    └── imports/
        ├── SEO-AIO-...pdf          # ⚠️ 2.4 MB PDF committed to the repo
        └── pasted_text/            # gcalls-website-update.md + ...-scope.json (source briefs)
```

### `src/app/App.tsx` structure

A single 4,679-line module containing **~40 top-level components and ~30 data constants**, none exported:

- Chrome: `Logo`, `NavBar`
- 9 page sections: `Hero`, `PainPointsSection`, `CallTimelineSection`, `CRMSection`, `TeamSection`, `AnalyticsSection`, `CloudSection`, `IntegrationsSection`, `WorkFromAnywhereSection`
- ~14 product "mockup" components that redraw the GCALLS product UI in DOM/SVG: `DashboardMain`, `FloatingTimeline`, `FloatingCRM`, `FloatingAnalytics`, `FloatingDialpad`, `CallTimelineMockup`, `CRMMockup`, `TeamMgmtMockup`, `AnalyticsDashboardMockup`, `CloudMockup`, `APIManagerMockup`, `CustomerPopupMockup`, `WidgetMockup`, `DialpadMockup`, `SoftphoneMockup`, `UserStatusDashboard`
- Mock datasets hardcoded inline (`callLog`, `contacts`, `kpiData`, `crmContacts`, `agentRows`, `sipAccounts`, `ivrTree`, …)

There is **no `<footer>`**.

---

## 4. Package manager decision

Figma Make committed **no lockfile**. Signals conflicted:

| Signal | Points to |
|---|---|
| `pnpm-workspace.yaml` present | pnpm |
| `pnpm.overrides` key in `package.json` | pnpm |
| `README.md` says "Run `npm i`" | npm |
| Lockfile present | *(none — no tiebreaker)* |

**Decision: npm.** Rationale:
1. No lockfile exists, so no established install is being changed.
2. `README.md` — the only human-facing instruction in the export — documents npm.
3. `pnpm-workspace.yaml` pins `supportedArchitectures` to **`os: linux`** only. That is a Figma Make build-sandbox artifact and would fetch the wrong platform binaries on the macOS development machine.
4. npm is the only package manager installed on the target machine (Node v24.14.0 / npm 11.9.0).

`package-lock.json` was generated during this audit and should be committed. Revisit only if the team standardises on pnpm — at which point `pnpm-workspace.yaml` must be corrected or deleted first.

---

## 5. Run & build commands

Only two scripts exist. **No `typecheck`, `lint`, `test`, `preview`, `format`, or `start` script is defined.**

```bash
npm install          # 285 packages, ~1 min
npm run dev          # vite      → http://localhost:5173/
npm run build        # vite build → dist/
```

| Command | Result |
|---|---|
| `npm install` | ✅ Success. 285 packages. 2 high-severity advisories (`react-router`, `vite`). |
| `npm run dev` | ✅ Success. Ready in 434 ms at **http://localhost:5173/** |
| `npm run build` | ✅ Success in 4.05 s. 1,599 modules. |
| `npm run typecheck` | ❌ **Script does not exist.** TypeScript is not installed and there is no `tsconfig.json`. |
| `npm run lint` | ❌ **Script does not exist.** No linter is installed or configured. |
| `npm test` | ❌ **Script does not exist.** No test infrastructure. |

### Build output

```
dist/index.html                   0.79 kB │ gzip:  0.44 kB
dist/assets/index-CbuneHcH.css   96.62 kB │ gzip: 15.73 kB
dist/assets/index-DakCt2BI.js   344.21 kB │ gzip: 82.56 kB
```

Single JS chunk — no code splitting (there is nothing to split: one route, one file).

**No fixes were required to make the project run.** The export builds and serves as-is.

---

## 6. Route inventory

The application is a **single-route SPA**. `react-router` is installed but never imported, and `src/main.tsx` renders `<App />` directly with no router provider.

| Route | Page / component | Status | Working? | SEO metadata? | Mobile status | Notes |
|---|---|---|---|---|---|---|
| `/` | `src/app/App.tsx` → `App()` | Exists | ⚠️ Renders, but every control is inert | ⚠️ Static, in `index.html`, **`noindex, nofollow`** | ❌ Broken | The entire website. 9 sections, 33,127 px tall at 390 px. |
| `/` → `#` "Tổng quan" | *(none)* | Missing | ❌ `href="#"` | ❌ | — | Nav link jumps to top |
| `/` → `#` "Tính năng" | *(none)* | Missing | ❌ `href="#"` | ❌ | — | Nav link jumps to top |
| `/` → `#` "Bảng giá" | *(none)* | Missing | ❌ `href="#"` | ❌ | — | **No pricing content exists anywhere on the site** |
| `/` → `#` "Tích hợp" | *(none)* | Missing | ❌ `href="#"` | ❌ | — | Content exists as a section but has no `id` to anchor to |
| `/` → `#` "FAQ" | *(none)* | Missing | ❌ `href="#"` | ❌ | — | **No FAQ content exists anywhere on the site** |
| *(any other path)* | — | Missing | ❌ | ❌ | — | No 404 handling; dev server rewrites all paths to `index.html` |

**Anchor targets:** 0 of 9 `<section>` elements carry an `id`. All 5 navigation links resolve to `href="#"`. Total distinct `href` values in the entire document: **one** (`#`).

**In-page sections rendered under `/`** (not routes — scroll positions only):

| # | Component | Heading level |
|---|---|---|
| 1 | `Hero` | `h1` (the only `h1`) |
| 2 | `PainPointsSection` | `h2` |
| 3 | `CallTimelineSection` | `h2` |
| 4 | `CRMSection` | `h2` |
| 5 | `TeamSection` | `h2` |
| 6 | `AnalyticsSection` | `h2` |
| 7 | `CloudSection` | `h2` |
| 8 | `IntegrationsSection` | `h2` |
| 9 | `WorkFromAnywhereSection` | `h2` |

Heading counts: 1 × `h1`, 8 × `h2`, 24 × `h3`.

---

## 7. Major technical debt

### 7.1 Single-file monolith
`src/app/App.tsx` is **4,679 lines / 237 KB** containing ~40 components and ~30 datasets. Nothing is exported or reusable. Any two people editing the site will conflict on the same file.

### 7.2 Design tokens bypassed
`src/styles/theme.css` correctly defines `--primary: #673ab7`, `--font-sans: 'Open Sans'`, radii and semantic colours. The application almost entirely ignores them:

| Pattern | Count in `App.tsx` |
|---|---|
| Inline `style={{ … }}` objects | **691** |
| Hardcoded hex colours | **845** (65 distinct) |
| Hardcoded `#673ab7` literals | **218** |
| Inline `fontFamily: "'Open Sans', sans-serif"` repeats | **72** |

A brand colour change today requires 218 find-and-replace edits instead of one token change.

### 7.3 No TypeScript safety
`.tsx` files with no `tsconfig.json`, no `typescript` package, and no `@types/react`. Vite/esbuild strips annotations without type-checking. Type errors are invisible until runtime.

### 7.4 Dead code and dead weight

| Item | Size / count | Status |
|---|---|---|
| `src/app/components/ui/**` (shadcn) | 43 components | Unreferenced by the app |
| `src/app/components/figma/ImageWithFallback.tsx` | 1 component | Unreferenced |
| `src/imports/SEO-AIO-…pdf` | **2.4 MB** | Committed binary, not used by code |
| `default_shadcn_theme.css` | 4.3 KB | Not imported anywhere |
| `src/styles/globals.css` | 0 bytes | Empty *and* not imported |
| `guidelines/Guidelines.md` | — | Unmodified Figma Make template |
| Unused npm dependencies | **14 of 55** | See below |

Declared but never imported: `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `@mui/material`, `@popperjs/core`, `canvas-confetti`, `date-fns`, `motion`, `react-dnd`, `react-dnd-html5-backend`, `react-popper`, `react-responsive-masonry`, `react-router`, `react-slick`.
*(`tw-animate-css` is unused in TS/JS but is legitimately imported by `src/styles/tailwind.css`.)*

The shadcn kit and unused deps are **not** in the production bundle (Vite tree-shakes them out) — they are repository and install-time weight, and a security surface.

### 7.5 Security advisories
2 high-severity npm advisories:
- **`react-router` 7.13.0** — 12 advisories including RCE via turbo-stream deserialization, XSS, open redirect, CSRF, DoS. **The package is not even used** — pure liability.
- **`vite` 6.3.5** — 7 advisories (dev-server path traversal, arbitrary file read, `server.fs.deny` bypass). Dev-time only, but relevant if the dev server is ever exposed on a network.

### 7.6 No `.gitignore`
The repository has no `.gitignore`. After `npm install` + `npm run build`, `git status` reports `node_modules/`, `dist/`, and `package-lock.json` as untracked. `node_modules/` will be accidentally committed sooner or later.

### 7.7 Zero conversion path
- **0 `<form>` elements.** 1 `<input>` on the entire page (a decorative dialpad field inside a mockup).
- **93 `<button>` elements, 0 with a click handler, 0 with `type`.**
- **9 primary CTAs** — "Đăng ký tư vấn" (×5), "Khám phá tính năng", "Khám phá Gcalls Webphone", "Khám phá Analytics", "Tư vấn tích hợp" — **all completely inert**. No `onClick`, no `href`, no anchor wrapper.
- No analytics, no tag manager, no tracking of any kind.

The site currently cannot capture a single lead.

### 7.8 Fragile hover pattern
30 `onMouseEnter`/`onMouseLeave` handlers apply styles imperatively; 8 use `e.target` instead of `e.currentTarget`. On the current text-only buttons this happens to work, but it breaks the moment an icon or `<span>` is nested inside — the style lands on the child, and the hover state sticks. Also means hover effects are unavailable to keyboard focus.

### 7.9 Placeholder identity
`package.json` name is `@figma/my-make-file`. `<title>` is `Gcalls -`. `README.md` is Figma Make boilerplate. No favicon.

---

## 8. Mobile issues (summary)

Full detail and prioritisation in **[`GCALLS_WEBSITE_AUDIT.md`](./GCALLS_WEBSITE_AUDIT.md)**.

Measured at 390 / 768 / 1024 / 1440 px using a same-origin iframe at exact viewport widths.

| Metric | 390 px | 768 px | 1024 px | 1440 px |
|---|---|---|---|---|
| Document height | **33,127 px** | 22,782 px | 16,645 px | 16,186 px |
| Elements overflowing their container | **100** | 43 | 8 | 3 |
| Text nodes actually cut off | **6** | 2 | 0 | 0 |
| Unintended horizontal scrollbars | **2** (one hides 252 px) | 0 | 0 | 0 |
| Interactive elements < 44 px tap target | **72 / 100** | 84 / 100 | 81 / 100 | 84 / 100 |
| Text nodes < 14 px | **655** | 655 | 655 | 655 |
| Text nodes < 12 px | **499** | 499 | 499 | 499 |
| Absolutely positioned elements | 74 | 74 | 74 | 74 |

**Headline findings:**

1. **Typography is not responsive at all.** The `< 14 px` and `< 12 px` counts are byte-identical at every viewport. 8 px, 9 px, 10 px and 11 px text designed for desktop product mockups renders at exactly the same size on a 390 px phone. There are 184 hardcoded `text-[8px]`–`text-[11px]` utilities.
2. **The page is desktop-first, not mobile-first.** Across 4,679 lines there are only **13** `sm:` utilities, versus 33 `md:` and 45 `lg:`. The mobile layout is what is left over when desktop rules stop applying.
3. **`overflow-x-hidden` on the root masks the damage.** The root `<div>` in `App()` sets `overflow-x-hidden`, so `document.scrollWidth` equals the viewport at every size and the page *looks* like it has no overflow. In reality 100 elements overflow at 390 px — their content is silently clipped rather than reflowed.
4. **The mobile menu does not exist.** `NavBar` holds a `mobileOpen` state and toggles the icon between `MoreHorizontal` and `X`, but **no drawer, sheet or panel is ever rendered**. Verified in-browser: clicking the hamburger leaves header height at 65 px, link count at 5 (all still `display:none`), and creates no overlay. Since `<nav>` is `hidden md:flex`, **a mobile visitor has zero navigation links.**
5. **The hero mockup composite collapses.** The floating dashboard/CRM/analytics/dialpad cards are absolutely positioned at desktop geometry. At 390 px they overlap each other and are cut off on both edges — KPI labels truncate mid-word and the dialpad sits on top of the team list.
6. **The page is 2× too long on mobile** — 33,127 px at 390 px versus 16,186 px at 1440 px.

---

## 9. Migration risks

| # | Risk | Impact | Likelihood |
|---|---|---|---|
| 1 | **Figma Make is frozen.** Any redesign must be authored in code. The 4,679-line monolith is the only remaining source of truth for the visual design. | High | Certain |
| 2 | **Refactoring the monolith without types or tests.** Splitting `App.tsx` into components with no `tsconfig.json`, no linter and no test suite means regressions are invisible until someone looks at the page. Establish typecheck + lint **before** the split. | High | High |
| 3 | **`noindex, nofollow` shipping to production.** The meta tag is correct for a Figma Make preview and catastrophic for a marketing site. If it survives launch, GCALLS is invisible to search. | Critical | Medium |
| 4 | **SPA with no SSR has a low SEO ceiling.** All 517 KB of DOM is client-rendered. If organic search matters — and "The Integration & Communication Standard" positioning implies it does — a Next.js/Astro migration should be decided *now*, not after the site is rebuilt in Vite. | High | Medium |
| 5 | **No real images.** 0 `<img>` elements; all 335 visuals are inline SVG/DOM redraws of the product. No image SEO, no OG preview image, and every "screenshot" must be re-implemented by hand rather than replaced with a file. | Medium | Certain |
| 6 | **Content is Vietnamese, `<html lang="en">`, meta description is English.** Any i18n or hreflang plan must be settled before content is rewritten. | Medium | High |
| 7 | **Mockup components are the product spec.** The 14 mockup components encode a great deal of product detail (SIP accounts, IVR trees, API endpoints, role permissions). Deleting or "simplifying" them loses design intent that no longer exists anywhere else. | Medium | Medium |
| 8 | **Package manager may be re-litigated.** If the team later moves to pnpm, `pnpm-workspace.yaml`'s `os: linux` pin will break macOS installs. Fix or delete that file as part of any such move. | Low | Medium |
| 9 | **`react-router` carries 12 high-severity CVEs while unused.** Removing it is safe today; adding routing later means adopting a patched version deliberately. | Low | Low |
| 10 | **Brand/product scope is unverified.** `src/imports/pasted_text/` contains the source briefs and a 2.4 MB SEO PDF that were **not** reviewed in this audit (out of scope — no content changes). Copy decisions must reconcile against them. | Medium | Medium |

---

## 10. What was changed during this audit

Per the audit brief, **no layout, content, navigation, colour, visual hierarchy, product scope, SEO copy or demo imagery was modified.**

| Change | Reason |
|---|---|
| `npm install` run | Required to build/serve. Generated `package-lock.json` (previously absent). |
| Branch `feature/gcalls-website-foundation` created | Task 8 — keep `main` as the untouched Figma Make baseline. |
| `docs/FIGMA_MAKE_HANDOFF.md` added | This document. |
| `docs/GCALLS_WEBSITE_AUDIT.md` added | Prioritised findings. |

No source file was edited. `dist/` and `node_modules/` are build artifacts and should not be committed — a `.gitignore` is recommended as the first P0 fix.
