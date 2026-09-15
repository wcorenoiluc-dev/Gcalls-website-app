#!/usr/bin/env node
/**
 * Generates gcalls-react-shell/routes.json from src/config/sitemap.ts, the
 * single source of truth for the React app's routes (see router.tsx). Routes
 * are never hand-typed here — this parses the real TypeScript source so the
 * plugin cannot silently drift from the app it is shipping.
 *
 * Usage: node wordpress/scripts/generate-shell-routes.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const WP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = path.resolve(WP_DIR, '..')
const SITEMAP_SRC = path.join(ROOT, 'src/config/sitemap.ts')
const OUT = path.join(
  WP_DIR,
  'wp-content/plugins/gcalls-react-shell/routes.json',
)

const source = await readFile(SITEMAP_SRC, 'utf8')

// Matches lines like:  home: '/',  or  gcallsPlus: '/gcalls-plus-webphone/',
// inside the ROUTES object literal — a plain key/string-literal pair.
const ROUTE_LINE = /^\s*([a-zA-Z]+):\s*'(\/[^']*)'/gm

const routes = []
const seenPaths = new Set()
let match
while ((match = ROUTE_LINE.exec(source))) {
  const [, key, routePath] = match
  if (seenPaths.has(routePath)) continue
  seenPaths.add(routePath)
  routes.push({ key, path: routePath })
}

// Cross-check against the number of keys in the ROUTES object literal itself
// (no hard-coded count): every `key: '/path/'` line must have been captured.
const routesBlock = source.match(/export const ROUTES\s*=\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''
const declaredKeys = (routesBlock.match(/^\s*[a-zA-Z]+:\s*'\//gm) ?? []).length
if (routes.length === 0 || routes.length !== declaredKeys) {
  console.error(
    `generate-shell-routes: parsed ${routes.length} routes but ROUTES declares ${declaredKeys}. ` +
      'Refusing to write routes.json — check that ROUTES parsing still matches the source shape.',
  )
  process.exit(1)
}

await writeFile(OUT, JSON.stringify(routes, null, 2) + '\n')
console.log(`generate-shell-routes: wrote ${routes.length} routes to ${path.relative(ROOT, OUT)}`)
