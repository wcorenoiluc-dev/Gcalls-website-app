#!/usr/bin/env node
/**
 * React section inventory — the input to Checkpoint 003B.
 *
 * 003B rebuilds 38 React routes as WordPress pages. The first question for
 * every one of them is "what sections does it consist of, and which of them
 * already exist somewhere else on the site", because a section that appears on
 * nine pages is authored once as an Elementor template and a section that
 * appears once is not.
 *
 * The answer is derived here rather than transcribed into a document, so the
 * mapping in `docs/INVENTORY_003B_SECTION_MAPPING.md` can be re-checked against
 * the source at any point instead of quietly going stale as pages change.
 *
 * WHAT IT READS
 * Each file in `src/pages`: its named imports from `@/components/**` (skipping
 * `ui/` and `figma/`, which are shadcn primitives, not sections) and the order
 * in which those names first appear as JSX tags. First appearance is the right
 * order because these pages render each section once, top to bottom.
 *
 * WHAT IT CANNOT SEE
 * A section rendered conditionally, or inside a `.map()`, is reported once at
 * the position of its first tag. Layout primitives (`Section`, `Container`,
 * `Card`, …) are excluded from the section count by name — they are the grid,
 * not the content — but they are still listed under --reuse so the Elementor
 * container settings they imply are not forgotten.
 *
 * Usage:
 *   node wordpress/scripts/section-inventory.mjs [--pages] [--reuse] [--interactive]
 *   (no flag = all three)
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const PAGES_DIR = path.join(REPO, 'src/pages')
const COMPONENTS_DIR = path.join(REPO, 'src/components')

/**
 * Layout primitives and head-only helpers.
 *
 * These are not sections and must not inflate a page's section count: `Section`
 * and `Container` become Elementor container settings, `JsonLd` and `Breadcrumb`
 * are already owned by gcalls-core on the WordPress side.
 */
const PRIMITIVES = new Set([
  'Container', 'Section', 'SectionHeader', 'Card', 'Eyebrow', 'GradientHeading',
  'JsonLd', 'RouteFallback', 'Breadcrumb',
])

const flags = process.argv.slice(2)
const want = (name) => flags.length === 0 || flags.includes(`--${name}`)

/** Named imports from feature component directories, mapped name -> module. */
function featureImports(source) {
  const imports = new Map()
  for (const match of source.matchAll(/import\s*\{([^}]+)\}\s*from\s*'(@\/components\/[^']+)'/g)) {
    if (match[2].includes('/ui/') || match[2].includes('/figma/')) continue
    for (const raw of match[1].split(',')) {
      const name = raw.trim().split(' as ').pop()
      if (name) imports.set(name, match[2])
    }
  }
  return imports
}

/** Names in first-JSX-use order, filtered to the imported set. */
function jsxOrder(source, imports) {
  const order = []
  for (const match of source.matchAll(/<([A-Z][A-Za-z0-9_]*)/g)) {
    if (imports.has(match[1]) && !order.includes(match[1])) order.push(match[1])
  }
  return order
}

const pageFiles = (await readdir(PAGES_DIR)).filter((f) => f.endsWith('.tsx')).sort()
const pages = []

for (const file of pageFiles) {
  const source = await readFile(path.join(PAGES_DIR, file), 'utf8')
  const imports = featureImports(source)
  const order = jsxOrder(source, imports)
  pages.push({
    name: file.replace('.tsx', ''),
    imports,
    sections: order.filter((n) => !PRIMITIVES.has(n)),
    primitives: order.filter((n) => PRIMITIVES.has(n)),
  })
}

if (want('pages')) {
  console.log('# Sections per page component (layout primitives excluded)\n')
  let total = 0
  for (const page of pages) {
    total += page.sections.length
    console.log(`${page.name.padEnd(28)} ${String(page.sections.length).padStart(2)}  ${page.sections.join(', ')}`)
  }
  console.log(`\n${pages.length} page components, ${total} section instances\n`)
}

if (want('reuse')) {
  console.log('# Reuse — how many page components render each section\n')
  const freq = new Map()
  for (const page of pages) {
    for (const name of [...page.sections, ...page.primitives]) {
      if (!freq.has(name)) freq.set(name, { module: page.imports.get(name), pages: [] })
      freq.get(name).pages.push(page.name)
    }
  }
  const rows = [...freq].sort((a, b) => b[1].pages.length - a[1].pages.length || a[0].localeCompare(b[0]))
  for (const [name, info] of rows) {
    const kind = PRIMITIVES.has(name) ? 'primitive' : 'section'
    console.log(`${String(info.pages.length).padStart(2)}x  ${name.padEnd(28)} ${kind.padEnd(10)} ${info.module}`)
  }
  console.log(`\n${rows.length} distinct components\n`)
}

if (want('interactive')) {
  console.log('# Interactive components — these cannot be static Elementor markup\n')

  const walk = async (dir) => {
    const out = []
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (!['ui', 'figma'].includes(entry.name)) out.push(...(await walk(full)))
      } else if (/\.tsx?$/.test(entry.name)) {
        out.push(full)
      }
    }
    return out
  }

  const files = (await walk(COMPONENTS_DIR)).sort()
  let interactive = 0

  for (const file of files) {
    const source = await readFile(file, 'utf8')
    const hooks = [...new Set([...source.matchAll(/\buse(State|Reducer|Effect|Memo|Callback|Ref|Id|Form)\b/g)].map((m) => `use${m[1]}`))]
    const events = [...new Set([...source.matchAll(/\bon(Click|Change|Submit|Input|KeyDown|Select)=/g)].map((m) => `on${m[1]}`))]
    const chart = /recharts|<(Area|Bar|Line|Pie)Chart/.test(source)
    const network = /react-hook-form|fetch\(|submitLead/.test(source)
    if (!hooks.length && !events.length && !chart && !network) continue

    interactive += 1
    const tags = [
      hooks.length ? `hooks:${hooks.join('/')}` : '',
      events.length ? `events:${events.join('/')}` : '',
      chart ? 'CHART' : '',
      network ? 'FORM/NETWORK' : '',
    ].filter(Boolean).join('  ')
    const rel = path.relative(COMPONENTS_DIR, file)
    console.log(`  ${rel.padEnd(42)} ${String(source.split('\n').length).padStart(4)}L  ${tags}`)
  }

  console.log(`\n${interactive} of ${files.length} component files are interactive\n`)
}
