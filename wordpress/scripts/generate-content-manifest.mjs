#!/usr/bin/env node
/**
 * Generates gcalls-react-shell/content-manifest.json from src/content/manifest.ts.
 *
 * The manifest is the single schema Gcalls Content Studio reads (contract §1):
 * routes in routes.json order, and for editable pages every section's field
 * schema + default content, inferred from the same TypeScript data objects
 * the React components render. No schema is hand-written in PHP.
 *
 * Bundles the TypeScript entry with esbuild (platform node, `@` alias, CSS
 * and static assets stubbed, JSX automatic) and executes it. Output is
 * deterministic: stable key order, no timestamps, no git data — so two
 * builds of the same commit are byte-identical.
 *
 * Usage: node wordpress/scripts/generate-content-manifest.mjs [--check]
 *   --check  exit 1 if the committed file differs from the generated one
 */
import { build } from 'esbuild'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const WP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = path.resolve(WP_DIR, '..')
const PLUGIN = path.join(WP_DIR, 'wp-content/plugins/gcalls-react-shell')
const ROUTES_FILE = path.join(PLUGIN, 'routes.json')
const OUT = path.join(PLUGIN, 'content-manifest.json')
const ENTRY = path.join(ROOT, 'src/content/manifest.ts')
const CHECK = process.argv.includes('--check')

const routes = JSON.parse(await readFile(ROUTES_FILE, 'utf8'))
if (!Array.isArray(routes) || routes.length === 0) {
  console.error('generate-content-manifest: routes.json is empty or invalid')
  process.exit(1)
}

/** Stubs for imports the data modules pull in transitively but Node never needs. */
const stubPlugin = {
  name: 'gcalls-node-stubs',
  setup(b) {
    b.onResolve({ filter: /^figma:asset\// }, (args) => ({ path: args.path, namespace: 'stub-asset' }))
    b.onResolve({ filter: /\.(css|svg|png|jpe?g|webp|gif|csv)$/ }, (args) => ({ path: args.path, namespace: 'stub-asset' }))
    b.onLoad({ filter: /.*/, namespace: 'stub-asset' }, (args) => ({ contents: `export default ${JSON.stringify(args.path)}`, loader: 'js' }))
  },
}

const tmp = await mkdtemp(path.join(tmpdir(), 'gcalls-manifest-'))
const bundle = path.join(tmp, 'manifest.mjs')
try {
  await build({
    entryPoints: [ENTRY],
    outfile: bundle,
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    jsx: 'automatic',
    logLevel: 'silent',
    alias: { '@': path.join(ROOT, 'src') },
    plugins: [stubPlugin],
    define: { 'import.meta.env.DEV': 'false', 'import.meta.env.PROD': 'true', 'import.meta.env.MODE': '"production"' },
  })
  // A DOM-free `window` so modules that probe `typeof window` at load stay on their non-browser branch.
  const mod = await import(pathToFileURL(bundle).href)
  const manifest = mod.buildManifest(routes.map((r) => ({ key: String(r.key), path: String(r.path) })))
  const json = JSON.stringify(manifest, null, 2) + '\n'

  const editable = manifest.pages.filter((p) => p.status === 'editable')
  const sectionCount = editable.reduce((n, p) => n + p.sections.length, 0)
  const fieldCount = editable.reduce((n, p) => n + p.sections.reduce((m, s) => m + Object.keys(s.fields).length, 0), 0)

  if (CHECK) {
    const current = await readFile(OUT, 'utf8').catch(() => '')
    if (current !== json) {
      console.error('generate-content-manifest: content-manifest.json is stale — run `npm run content:manifest`')
      process.exit(1)
    }
    console.log(`generate-content-manifest: up to date (${manifest.pages.length} pages, ${editable.length} editable, ${sectionCount} sections, ${fieldCount} fields)`)
  } else {
    await writeFile(OUT, json)
    console.log(`generate-content-manifest: wrote ${path.relative(ROOT, OUT)} — ${manifest.pages.length} pages (${editable.length} editable), ${sectionCount} sections, ${fieldCount} fields`)
  }
} catch (error) {
  console.error(`generate-content-manifest: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
} finally {
  await rm(tmp, { recursive: true, force: true })
}
