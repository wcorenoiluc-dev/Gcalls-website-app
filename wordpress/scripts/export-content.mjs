#!/usr/bin/env node
/**
 * React source -> WordPress import manifest.
 *
 * The React app stays the content reference; this script turns the parts of it
 * that WordPress needs into one JSON file the `wp gcalls import` command can
 * consume.
 *
 * WHY REGEX AND NOT AN IMPORT
 * `src/config/sitemap.ts` and `src/data/blog/catalog.ts` are TypeScript modules
 * that read `import.meta.env` and resolve the `@/` path alias. Importing them
 * from a plain Node script means standing up Vite's module runner just to read
 * two arrays of literals — a heavier dependency, on a build system this script
 * exists to leave behind. Both files are hand-authored literals with no
 * computed keys, so a field extractor is enough. The verification step at the
 * bottom is what keeps that assumption honest: if either file ever stops being
 * literal, the counts stop matching and this script fails loudly instead of
 * emitting a short manifest.
 *
 * BODIES ARE NOT EXPORTED BY DEFAULT
 * Checkpoint 003A builds the content model and the pipeline; it does not
 * migrate the 38 pages or the 18 articles. `--with-bodies` is wired for 003B
 * and is deliberately not used yet.
 *
 * Usage:
 *   node wordpress/scripts/export-content.mjs
 *   node wordpress/scripts/export-content.mjs --out=<path> [--with-bodies]
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '../..')
const OUT_DEFAULT = path.join(REPO, 'wordpress/imports/content-manifest.json')

const args = process.argv.slice(2)
const outPath = (args.find((a) => a.startsWith('--out=')) ?? `--out=${OUT_DEFAULT}`).slice(6)
const withBodies = args.includes('--with-bodies')

const EXPECTED_ROUTES = 38
const EXPECTED_ARTICLES = 18

const read = (rel) => fs.readFileSync(path.join(REPO, rel), 'utf8')

/* ------------------------------------------------------------------ *
 * Field extraction
 * ------------------------------------------------------------------ */

/**
 * Reads `key: '...'` out of an object literal block.
 *
 * Handles the value sitting on the next line (Prettier moves long Vietnamese
 * strings down) and backslash-escaped quotes inside it. Returns null rather
 * than '' so a missing field is distinguishable from an empty one.
 */
function field(block, key) {
  const match = block.match(new RegExp(`\\b${key}:\\s*(?:\\n\\s*)?'((?:[^'\\\\]|\\\\.)*)'`))
  return match ? match[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\') : null
}

/**
 * Splits the entries of a top-level array literal into object blocks.
 *
 * Scans from the opening bracket to its matching close, tracking depth while
 * skipping over string literals and comments — the catalog's Vietnamese prose
 * contains both brackets and braces, and a marker-based end search silently
 * ran two arrays together when one of them was empty.
 */
function entries(source, startMarker) {
  const start = source.indexOf(startMarker)
  if (start === -1) throw new Error(`marker not found: ${startMarker}`)

  let i = start + startMarker.length
  let arrayDepth = 1
  let objectDepth = 0
  let current = ''
  const blocks = []

  while (i < source.length && arrayDepth > 0) {
    const char = source[i]
    const next = source[i + 1]

    // Comments: copied through verbatim would be harmless, but a bracket
    // inside one would not be.
    if (char === '/' && next === '/') {
      const eol = source.indexOf('\n', i)
      i = eol === -1 ? source.length : eol
      continue
    }
    if (char === '/' && next === '*') {
      const close = source.indexOf('*/', i + 2)
      i = close === -1 ? source.length : close + 2
      continue
    }

    // String literals: consumed whole, so quotes and brackets inside prose
    // never move the depth counters.
    if (char === "'" || char === '"' || char === '`') {
      const quote = char
      let j = i + 1
      while (j < source.length) {
        if (source[j] === '\\') {
          j += 2
          continue
        }
        if (source[j] === quote) break
        j += 1
      }
      if (objectDepth >= 1) current += source.slice(i, j + 1)
      i = j + 1
      continue
    }

    if (char === '[') arrayDepth += 1
    if (char === ']') {
      arrayDepth -= 1
      if (arrayDepth === 0) break
    }

    if (char === '{') {
      objectDepth += 1
      if (objectDepth === 1) {
        current = ''
        i += 1
        continue
      }
    }
    if (char === '}') {
      objectDepth -= 1
      if (objectDepth === 0) {
        blocks.push(current)
        i += 1
        continue
      }
    }

    if (objectDepth >= 1) current += char
    i += 1
  }

  return blocks
}

/* ------------------------------------------------------------------ *
 * Routes -> WordPress pages
 * ------------------------------------------------------------------ */

const sitemapSrc = read('src/config/sitemap.ts')

// ROUTES is the URL table; SITEMAP carries the title and description per route.
const routeTable = {}
const routesBlock = sitemapSrc.slice(
  sitemapSrc.indexOf('export const ROUTES = {'),
  sitemapSrc.indexOf('} as const'),
)

for (const [, key, value] of routesBlock.matchAll(/^\s*(\w+):\s*'([^']+)',/gm)) {
  routeTable[key] = value
}

const pages = entries(sitemapSrc, 'export const SITEMAP: SitemapEntry[] = [')
  .map((block) => {
    const routeKey = block.match(/\broute:\s*ROUTES\.(\w+)/)?.[1] ?? null
    const parentKey = block.match(/\bparent:\s*ROUTES\.(\w+)/)?.[1] ?? null
    const routePath = routeKey ? routeTable[routeKey] : null

    if (!routePath) return null

    return {
      id: (field(block, 'id') ?? routeKey).toLowerCase(),
      kind: 'page',
      route: routePath,
      // WordPress addresses a page by its slug, and a nested route keeps its
      // full path so /nganh/bpo/ stays /nganh/bpo/ rather than collapsing to
      // /bpo/. The importer resolves the parent from `parentRoute`.
      slug: routePath === '/' ? 'trang-chu' : routePath.replace(/^\/|\/$/g, '').split('/').pop(),
      parentRoute: parentKey ? routeTable[parentKey] : null,
      title: field(block, 'label') ?? '',
      status: 'draft',
      isFrontPage: routePath === '/',
      // Elementor lays these out; the body arrives in 003B.
      template: 'page-templates/full-width.php',
      seo: {
        title: field(block, 'title') ?? '',
        description: field(block, 'description') ?? '',
      },
      ...(withBodies ? { content: '' } : {}),
    }
  })
  .filter(Boolean)

/* ------------------------------------------------------------------ *
 * Blog catalog -> WordPress posts
 * ------------------------------------------------------------------ */

const catalogSrc = read('src/data/blog/catalog.ts')

// The catalog is assembled from two seed arrays: PUBLISHED_SEEDS (empty while
// Batch 1 is unreviewed) and DRAFT_SEEDS. Reading both means an article that
// gets promoted to published later still appears here, with no edit to this
// script.
const articleBlocks = [
  ...entries(catalogSrc, 'const PUBLISHED_SEEDS: readonly CatalogSeed[] = ['),
  ...entries(catalogSrc, 'const DRAFT_SEEDS: readonly CatalogSeed[] = ['),
]

const articles = articleBlocks
  .map((block) => {
    const slug = field(block, 'slug')
    const id = field(block, 'id')

    if (!slug || !id) return null

    return {
      id: id.toLowerCase(),
      kind: 'article',
      slug,
      title: field(block, 'title') ?? '',
      excerpt: field(block, 'excerpt') ?? '',
      hub: block.match(/\bhub:\s*'(HUB-\d+)'/)?.[1] ?? null,
      tier: field(block, 'contentTier'),
      legacyPostId: Number(block.match(/\blegacyPostId:\s*(\d+)/)?.[1] ?? 0) || null,
      // Published so anyone with the link can read the demo. Staying out of
      // search is the site-wide noindex posture's job, not post status.
      status: 'publish',
      seo: {
        title: field(block, 'seoTitle') ?? '',
        description: field(block, 'metaDescription') ?? '',
        focus_keyword: field(block, 'primaryKeyword') ?? '',
      },
      // FAQ items and body prose migrate in 003B.
      faq: [],
      ...(withBodies ? { content: '' } : {}),
    }
  })
  .filter(Boolean)

/* ------------------------------------------------------------------ *
 * Media
 * ------------------------------------------------------------------ */

/**
 * Parses one CSV row, honouring quoted fields.
 *
 * The inventory's alt text is Vietnamese prose: some rows quote it because it
 * contains a comma and some do not, and column positions shift when a field is
 * quoted. Splitting on commas — or matching the alt text by shape — drops the
 * unquoted rows silently, which is how two of the thirteen images lost their
 * alt text the first time this ran.
 */
function csvRow(line) {
  const cells = []
  let cell = ''
  let quoted = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]

    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        cell += '"'
        i += 1
      } else if (char === '"') {
        quoted = false
      } else {
        cell += char
      }
      continue
    }

    if (char === '"') quoted = true
    else if (char === ',') {
      cells.push(cell)
      cell = ''
    } else cell += char
  }

  cells.push(cell)
  return cells
}

const inventoryLines = read('docs/content-review/images/image-source-inventory.csv')
  .split('\n')
  .filter((line) => line.trim() !== '')

const inventoryHeader = csvRow(inventoryLines[0])
const col = (name) => {
  const index = inventoryHeader.indexOf(name)
  if (index === -1) throw new Error(`inventory column missing: ${name}`)
  return index
}

// Only assets that were actually produced enter the manifest. GP-04 (agent
// performance) and GP-06 (analytics dashboard) are NOT PRODUCED: both carry
// real operating figures, which masking cannot remove, so there is no file to
// import and no way for this script to import one by mistake.
const media = inventoryLines
  .slice(1)
  .map((line) => {
    const cells = csvRow(line)
    const finalPath = (cells[col('finalPath')] ?? '').trim()

    if (!finalPath.startsWith('public/images/')) return null

    return {
      id: cells[col('assetId')].trim(),
      file: finalPath,
      alt: (cells[col('altText')] ?? '').trim(),
      width: Number(cells[col('width')]) || null,
      height: Number(cells[col('height')]) || null,
    }
  })
  .filter(Boolean)

/* ------------------------------------------------------------------ *
 * Manifest
 * ------------------------------------------------------------------ */

const manifest = {
  generator: 'wordpress/scripts/export-content.mjs',
  checkpoint: 'GCALLS-WORDPRESS-MIGRATION-003A',
  withBodies,
  counts: {
    pages: pages.length,
    articles: articles.length,
    media: media.length,
  },
  hubs: [...new Set(articles.map((a) => a.hub).filter(Boolean))].sort(),
  pages,
  articles,
  media,
  // Populated from the editorial decision file in 003B. An empty map is a
  // valid map: the importer stores it verbatim and nothing redirects.
  redirects: {},
}

/* ------------------------------------------------------------------ *
 * Verification — the counts are the contract
 * ------------------------------------------------------------------ */

const problems = []

if (pages.length !== EXPECTED_ROUTES) {
  problems.push(`expected ${EXPECTED_ROUTES} pages, extracted ${pages.length}`)
}
if (articles.length !== EXPECTED_ARTICLES) {
  problems.push(`expected ${EXPECTED_ARTICLES} articles, extracted ${articles.length}`)
}

const dupSlugs = (list) =>
  Object.entries(
    list.reduce((acc, item) => ({ ...acc, [item.slug]: (acc[item.slug] ?? 0) + 1 }), {}),
  ).filter(([, count]) => count > 1)

for (const [slug, count] of dupSlugs(articles)) problems.push(`duplicate article slug ${slug} x${count}`)

for (const article of articles) {
  if (!article.hub) problems.push(`article ${article.id} has no hub`)
  if (!article.seo.title) problems.push(`article ${article.id} has no SEO title`)
}

for (const page of pages) {
  if (!page.title) problems.push(`page ${page.id} has no title`)
}

if (media.some((m) => m.id === 'GP-04' || m.id === 'GP-06')) {
  problems.push('GP-04 / GP-06 must never enter the manifest — unapproved operating figures')
}

for (const item of media) {
  if (!item.alt) problems.push(`media ${item.id} has no alt text`)
  if (!fs.existsSync(path.join(REPO, item.file))) problems.push(`media ${item.id} file missing: ${item.file}`)
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`pages    ${pages.length}`)
console.log(`articles ${articles.length}`)
console.log(`media    ${media.length}`)
console.log(`hubs     ${manifest.hubs.join(' ')}`)
console.log(`bodies   ${withBodies ? 'included' : 'excluded (003A builds the model, not the content)'}`)
console.log(`manifest ${path.relative(REPO, outPath)}`)

if (problems.length) {
  console.log('\nPROBLEMS')
  for (const problem of problems) console.log(`  - ${problem}`)
  process.exit(1)
}

console.log('\nexport-content: OK')
