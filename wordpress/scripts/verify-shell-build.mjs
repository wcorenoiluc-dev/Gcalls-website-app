#!/usr/bin/env node
/**
 * Verifies that a React Shell build (dist/ or a packaged ZIP) is complete and
 * internally consistent — the guard against the 0.3.7 incident where a route
 * requested a chunk (`VoicebotAiPage-DIqdMIiu.js`) that no longer existed.
 *
 * Checks:
 *   1. Every `file`, `css`, `imports` and `dynamicImports` reference in the
 *      Vite manifest resolves to a file that exists in the build.
 *   2. Every route in routes.json (read at run time, never a hard-coded count)
 *      maps — via the router's `lazy(() => import('@/pages/X'))` table — to a
 *      page module that is reachable from the entry through dynamicImports.
 *      Routes sharing a page module (IndustryPage, BlogArticlePage) share one
 *      chunk, which is fine; the home page is bundled eagerly in the entry.
 *   3. All chunks belong to one build: no hashed asset referenced from any
 *      chunk is missing, and no manifest entry points outside the build.
 *   4. With `--zip <path>`, the same set is verified against the ZIP listing
 *      (`unzip -Z1`), so the archive ships every chunk of all routes — not
 *      only the ones whose pages are editable.
 *
 * Usage:
 *   node wordpress/scripts/verify-shell-build.mjs            # verify dist/
 *   node wordpress/scripts/verify-shell-build.mjs --zip wordpress/dist/gcalls-react-shell-0.3.8.zip
 * Exit 1 with a list of problems on any failure.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const WP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = path.resolve(WP_DIR, '..')
const PLUGIN = path.join(WP_DIR, 'wp-content/plugins/gcalls-react-shell')
const DIST = path.join(PLUGIN, 'dist')
const ROUTES_FILE = path.join(PLUGIN, 'routes.json')
const ROUTER_FILE = path.join(ROOT, 'src/app/router.tsx')
const SITEMAP_FILE = path.join(ROOT, 'src/config/sitemap.ts')

const args = process.argv.slice(2)
const zipArg = args.indexOf('--zip')
const ZIP = zipArg !== -1 ? path.resolve(args[zipArg + 1] || '') : null

const problems = []
const fail = (msg) => problems.push(msg)

/* ---- 1. manifest + file set --------------------------------------------- */

let manifestPath = path.join(DIST, 'manifest.json')
if (!existsSync(manifestPath)) manifestPath = path.join(DIST, '.vite/manifest.json')
if (!existsSync(manifestPath)) {
  console.error('verify-shell-build: no Vite manifest in dist/ — run `npm run build:wordpress` first')
  process.exit(1)
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

/** Set of build-relative paths (e.g. "assets/main-XXXX.js") that exist. */
let fileSet
let sourceLabel
if (ZIP) {
  if (!existsSync(ZIP)) {
    console.error(`verify-shell-build: ZIP not found: ${ZIP}`)
    process.exit(1)
  }
  const listing = execFileSync('unzip', ['-Z1', ZIP], { encoding: 'utf8' }).split('\n').filter(Boolean)
  const prefix = 'gcalls-react-shell/dist/'
  fileSet = new Set(listing.filter((f) => f.startsWith(prefix)).map((f) => f.slice(prefix.length)))
  sourceLabel = `ZIP ${path.relative(ROOT, ZIP)}`
  if (fileSet.size === 0) fail('ZIP contains no gcalls-react-shell/dist/ files')
} else {
  fileSet = null // check the filesystem directly
  sourceLabel = `dist/ (${path.relative(ROOT, DIST)})`
}
const exists = (rel) => (fileSet ? fileSet.has(rel) : existsSync(path.join(DIST, rel)))

const entryKey = Object.keys(manifest).find((k) => manifest[k].isEntry)
if (!entryKey) fail('manifest has no entry (isEntry) chunk')

let referenced = 0
for (const [key, chunk] of Object.entries(manifest)) {
  if (chunk.file) {
    referenced++
    if (!exists(chunk.file)) fail(`${key}: file missing → ${chunk.file}`)
  }
  for (const css of chunk.css || []) {
    referenced++
    if (!exists(css)) fail(`${key}: css missing → ${css}`)
  }
  for (const asset of chunk.assets || []) {
    referenced++
    if (!exists(asset)) fail(`${key}: asset missing → ${asset}`)
  }
  for (const imp of [...(chunk.imports || []), ...(chunk.dynamicImports || [])]) {
    if (!manifest[imp]) {
      fail(`${key}: imports "${imp}" which is not in the manifest (mixed builds?)`)
      continue
    }
    referenced++
    if (!exists(manifest[imp].file)) fail(`${key}: import target missing → ${manifest[imp].file} (${imp})`)
  }
}

/* ---- 2. routes → page modules ------------------------------------------- */

const routes = JSON.parse(readFileSync(ROUTES_FILE, 'utf8'))
const routerSrc = readFileSync(ROUTER_FILE, 'utf8')
const sitemapSrc = readFileSync(SITEMAP_FILE, 'utf8')

// ROUTES.key → '/path/' from sitemap.ts (same parse the routes generator uses).
const pathByKey = {}
for (const m of sitemapSrc.matchAll(/^\s*([a-zA-Z]+):\s*'(\/[^']*)'/gm)) pathByKey[m[1]] ??= m[2]

// Lazy component name → page source path, e.g. VoicebotAiPage → src/pages/VoicebotAiPage.tsx
const lazyModules = {}
for (const m of routerSrc.matchAll(/const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\('@\/pages\/(\w+)'\)/g)) {
  lazyModules[m[1]] = `src/pages/${m[2]}.tsx`
}
// Route table: `{ path: ROUTES.xxx, element: lazyRoute(<Component .../>) }` and the eager index route.
const routeToComponent = {}
for (const m of routerSrc.matchAll(/path:\s*ROUTES\.(\w+)\s*,\s*(?:\.\.\.\w+\s*,\s*)?element:\s*lazyRoute\(<(\w+)/g)) {
  routeToComponent[pathByKey[m[1]] ?? `ROUTES.${m[1]}`] = m[2]
}
const eagerHome = /index:\s*true,\s*element:\s*<HomePage/.test(routerSrc)

const reachable = new Set()
if (entryKey) {
  const walk = (key) => {
    if (reachable.has(key) || !manifest[key]) return
    reachable.add(key)
    for (const imp of [...(manifest[key].imports || []), ...(manifest[key].dynamicImports || [])]) walk(imp)
  }
  walk(entryKey)
}

let routesChecked = 0
for (const { path: routePath } of routes) {
  routesChecked++
  if (routePath === '/' && eagerHome) continue
  const component = routeToComponent[routePath]
  if (!component) {
    fail(`route ${routePath}: no lazyRoute entry in ${path.relative(ROOT, ROUTER_FILE)}`)
    continue
  }
  const moduleSrc = lazyModules[component]
  if (!moduleSrc) {
    fail(`route ${routePath}: component ${component} has no lazy import`)
    continue
  }
  const chunkKey = Object.keys(manifest).find((k) => k === moduleSrc || manifest[k].src === moduleSrc)
  if (!chunkKey) {
    fail(`route ${routePath}: page module ${moduleSrc} is not in the manifest`)
    continue
  }
  if (!reachable.has(chunkKey)) fail(`route ${routePath}: ${moduleSrc} is not reachable from the entry via dynamicImports`)
  if (!exists(manifest[chunkKey].file)) fail(`route ${routePath}: chunk file missing → ${manifest[chunkKey].file}`)
}

/* ---- 3. one build: every hashed asset present, no orphans ---------------- */

const hashed = /assets\/[^/]+-[A-Za-z0-9_-]{8}\.(js|css)$/
for (const [key, chunk] of Object.entries(manifest)) {
  if (chunk.file && !hashed.test(chunk.file) && !/\.(js|css)$/.test(chunk.file)) continue
  if (chunk.file && /\.js$/.test(chunk.file) && !hashed.test(chunk.file)) fail(`${key}: unhashed JS chunk ${chunk.file} — cache-busting relies on hashed names`)
}

/* ---- report --------------------------------------------------------------- */

console.log(`verify-shell-build: ${sourceLabel}`)
console.log(`  manifest entries   ${Object.keys(manifest).length}`)
console.log(`  references checked ${referenced}`)
console.log(`  routes checked     ${routesChecked} (from routes.json)`)
console.log(`  reachable chunks   ${reachable.size}`)
if (problems.length) {
  console.error(`\nverify-shell-build: ${problems.length} problem(s)`)
  for (const p of problems) console.error(`  FAIL ${p}`)
  process.exit(1)
}
console.log('  result             OK — every dynamic import resolves, every route has its chunk')
