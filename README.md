# GCALLS Website

**CALL SMARTER, GROW FASTER** — The Integration & Communication Standard.

Marketing website for GCALLS. React 18 + Vite 6 + Tailwind CSS v4 + React Router 7.

> This repository is the **production source of truth**.
> The original Figma Make file is frozen as a **visual reference only** — changes made here do not sync back to it.
> See [`docs/FIGMA_MAKE_HANDOFF.md`](docs/FIGMA_MAKE_HANDOFF.md).

---

## Requirements

- Node.js >= 20 (developed on v24)
- npm (see [Package manager](#package-manager))

## Getting started

```bash
npm install
npm run dev     # http://localhost:5173/
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server on http://localhost:5173/ |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --build` — must pass before every commit |
| `npm run lint` | ESLint (correctness rules; style is not enforced) |
| `npm run check` | `typecheck` + `lint` + `build` — run this before opening a PR |

## Package manager

**npm.** Standardised in Checkpoint 2. `package-lock.json` is committed and must stay in sync.

The Figma Make export shipped a `pnpm-workspace.yaml` that pinned `supportedArchitectures.os` to `linux` only — a build-sandbox artifact that broke macOS installs. It has been removed. Do not reintroduce pnpm without updating that config first.

## Project structure

```
src/
├── app/
│   ├── App.tsx           # Root — mounts the router
│   ├── router.tsx        # Route table
│   └── components/ui/    # shadcn/ui kit (retained, not yet adopted)
├── layouts/
│   └── SiteLayout.tsx    # Header + <Outlet/> + Footer
├── components/
│   ├── navigation/       # Header, DesktopNav, MobileMenu
│   ├── layout/           # Footer, Breadcrumb, PageShell
│   ├── common/           # ResponsiveProductVisual, SEO metadata
│   └── home/             # Home page sections
├── pages/                # One file per route
├── config/
│   ├── navigation.ts     # Single source of truth for nav + footer IA
│   └── seo.ts            # Per-route title / description / canonical
└── styles/               # Tailwind entry + design tokens
```

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/gcalls-plus-webphone/` | Gcalls Plus Webphone |
| `/tong-dai-tich-hop-crm/` | Tích hợp CRM |
| `/tong-dai-tich-hop-helpdesk/` | Tích hợp Helpdesk |
| `/tong-dai-tich-hop-pos/` | Tích hợp POS |
| `/tong-dai-quoc-te/` | Tổng đài quốc tế |
| `/qc-bot-ai/` | QA QC Center |
| `/gcalls-cx/` | Gcalls CX |
| `/bang-gia/` | Bảng giá |
| `/uoc-tinh-chi-phi/` | Ước tính chi phí |

Every route except `/` is currently a **page shell** — real, navigable, and correctly wired into navigation and SEO metadata, with content to be built out in later checkpoints.

## ⚠️ Search indexing is disabled

This build ships `noindex, nofollow`. That is **intentional** for pre-launch.

Indexing is controlled by a single flag — see [`src/config/seo.ts`](src/config/seo.ts) and the go-live checklist in [`docs/LAUNCH_CHECKLIST.md`](docs/LAUNCH_CHECKLIST.md). Do not remove it ad hoc.

## Documentation

- [`docs/FIGMA_MAKE_HANDOFF.md`](docs/FIGMA_MAKE_HANDOFF.md) — stack, architecture, migration risks
- [`docs/GCALLS_WEBSITE_AUDIT.md`](docs/GCALLS_WEBSITE_AUDIT.md) — prioritised P0/P1/P2 findings
- [`docs/LAUNCH_CHECKLIST.md`](docs/LAUNCH_CHECKLIST.md) — what must happen before production
- [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md) — third-party licences

## Known dependency advisories

| Package | Status |
|---|---|
| `react-router` 7.18.1 | 1 remaining advisory, **RSC-mode only**. This is a client-only SPA with no server, so it is not reachable. The fix requires React Router 8, which requires React 19 — deferred to a dedicated migration. |
| `eslint` toolchain | Transitive `brace-expansion`/`minimatch` DoS advisories. Dev dependencies only, never shipped. No non-breaking fix published yet. |
