# Gcalls React Shell

Serves the built React marketing site for an explicit allowlist of routes.
Entirely separate from `gcalls-core` — no shared files, no shared options.

## Safety

- Ships **disabled**. Activating this plugin alone changes nothing on the
  front end.
- Settings → Gcalls React Shell has three states: Disabled, Homepage only,
  All 38 marketing routes. Switching back to Disabled (or deactivating the
  plugin) restores normal WordPress rendering immediately — no data is
  written to any post, and no other plugin's tables or options are touched.
- Never intercepts `/wp-admin/`, `/wp-login.php`, `/wp-json/`, AJAX,
  admin-post, cron, feeds, sitemaps, or preview requests — see
  `Gcalls_React_Shell::is_excluded_request()`.
- Does not modify or downgrade `gcalls-core`, Elementor data, blog posts,
  taxonomy, or the Media Library.

## Build

From the repo root:

```
npm run build:wordpress     # builds the React app for this plugin's dist/
npm run package:react-shell # zips wordpress/dist/gcalls-react-shell-<version>.zip
npm run release:react-shell # build:wordpress + package:react-shell
```

`routes.json` is generated from `src/config/sitemap.ts` (the single source of
truth for the React app's routes) — see
`wordpress/scripts/generate-shell-routes.mjs`. It is not hand-maintained.

## Known limitation (Phase 1)

The app is client-hydrated: WordPress serves a minimal HTML shell and React
takes over in the browser. `wp_head()` is preserved (title/meta/canonical
still come from WordPress), but there is no server-side rendering or
pre-rendering yet. Full SEO parity with a server-rendered page is a Phase 2
item.

Content on these routes is not Elementor-editable in Phase 1 — the source of
truth is the React app's source code. Editable structured fields (ACF/REST/
generated templates) are a planned Phase 2, not implemented here.

## Cache & chunks

- The HTML document for every shell route is sent with `nocache_headers()`
  (`Cache-Control: no-cache, must-revalidate, max-age=0, no-store, private`),
  so a visitor never receives a stale bootstrap that points at an old build.
- Everything under `dist/assets/` is content-hashed (`main-XXXXXXXX.js`,
  `VoicebotAiPage-XXXXXXXX.js`, …). A file name is immutable for the life of a
  build and may be cached for as long as the host allows; a new build uses new
  names.
- Replacing the plugin ZIP deletes the previous `dist/`. A tab opened before
  the replace still holds the old entry bundle, whose lazy imports name chunks
  that no longer exist. Two layers cover that tab:
  1. `src/lib/preloadRecovery.ts` reloads the page once per build id on
     `vite:preloadError` / "Failed to fetch dynamically imported module" and
     never loops (the marker lives in `sessionStorage`).
  2. `RouteErrorBoundary` (every lazy route and the layout route) shows
     "Trang chưa tải được" with a reload button inside the normal header and
     footer if the retry did not help.
- `npm run verify:shell` (also run automatically by `npm run
  package:react-shell`, against `dist/` and again against the ZIP) proves the
  build is complete: every manifest reference exists, every routes.json route
  has a reachable chunk, and the archive contains all of them.
- After a deploy, hard-refresh and run the audits from a fresh browser
  context with a cache-busting query — a tab that merely shows header and
  footer has not proven that the lazy page module loaded.

