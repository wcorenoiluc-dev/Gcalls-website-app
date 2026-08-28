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
 * BODIES — `--with-bodies`, turned on in 003B P0
 * Article bodies are authored in the restricted Markdown of
 * `src/lib/blog/markdown.ts`. That module is imported DIRECTLY here (Node 24
 * strips TypeScript types natively) rather than re-implemented, because a
 * second parser would be a second grammar and the two would drift silently.
 * The article body modules import nothing but types, so they load the same way.
 * `catalog.ts` still goes through the field extractor below: it imports the
 * `@/` alias, which a plain Node run cannot resolve.
 *
 * Page bodies are BASELINE content, not final copy — a one-paragraph summary
 * and, for a hub, links to its children. Checkpoint 003B P0 builds five pages
 * in Elementor; the other 33 must still be readable rather than blank, and
 * Elementor overwrites post_content on the pages it does own.
 *
 * Usage:
 *   node wordpress/scripts/export-content.mjs
 *   node wordpress/scripts/export-content.mjs --out=<path> [--with-bodies]
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { bodyToWp, collectLinks, esc } from './lib/blocks.mjs'

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

/**
 * NAVIGATION PARENT IS NOT URL PARENT.
 *
 * `sitemap.ts` gives most routes a `parent`, and that field answers "where does
 * this sit in the menu", not "what is its URL". For ten of the 38 routes the two
 * disagree, and WordPress builds a page's permalink from `post_parent`, so
 * importing the menu grouping as hierarchy would silently rewrite ten published
 * URLs:
 *
 *   /gcalls-plus-webphone/  is filed under Sản phẩm  -> would become /san-pham/gcalls-plus-webphone/
 *   /tong-dai-tich-hop-crm/ is filed under Giải pháp -> would become /giai-phap/tong-dai-tich-hop-crm/
 *   /uoc-tinh-chi-phi/      is filed under Bảng giá  -> would become /bang-gia/uoc-tinh-chi-phi/
 *   /blog/                  is filed under Tài nguyên-> would become /tai-nguyen/blog/
 *
 * `/blog/` is the worst of them: it is the WordPress POSTS PAGE, addressed by
 * `page_for_posts`, and it is the URL every one of the 18 root-level articles
 * links back to.
 *
 * The rule is derived rather than a hand-kept exception list, so a route added
 * later cannot miss it: a page gets a `post_parent` only when its own path is
 * genuinely nested under the parent's path. `/tich-hop/hubspot/` is; the ten
 * above are not. Navigation keeps the grouping either way — the menu builder
 * below reads `navParentRoute`, so Blog still appears under Tài nguyên in the
 * header.
 */
function urlParentFor(route, navParent) {
  if (!navParent || navParent === '/') return null

  return route.startsWith(navParent) ? navParent : null
}

const pages = entries(sitemapSrc, 'export const SITEMAP: SitemapEntry[] = [')
  .map((block) => {
    const routeKey = block.match(/\broute:\s*ROUTES\.(\w+)/)?.[1] ?? null
    const parentKey = block.match(/\bparent:\s*ROUTES\.(\w+)/)?.[1] ?? null
    const routePath = routeKey ? routeTable[routeKey] : null

    if (!routePath) return null

    const navParent = parentKey ? routeTable[parentKey] : null

    return {
      id: (field(block, 'id') ?? routeKey).toLowerCase(),
      kind: 'page',
      route: routePath,
      // WordPress addresses a page by its slug, and a nested route keeps its
      // full path so /nganh/bpo/ stays /nganh/bpo/ rather than collapsing to
      // /bpo/. The importer resolves the parent from `parentRoute`.
      slug: routePath === '/' ? 'trang-chu' : routePath.replace(/^\/|\/$/g, '').split('/').pop(),
      parentRoute: urlParentFor(routePath, navParent),
      // Kept even when it is not the page parent, so the menu builder and any
      // later audit can still see where navigation files this route.
      navParentRoute: navParent,
      title: field(block, 'label') ?? '',
      // 003A exported drafts because it migrated no content. With bodies, a
      // draft page is a 404 to every logged-out visitor, which would make the
      // "expected live routes" line of a handover report false. Staying out of
      // search is the site-wide noindex posture's job, exactly as it already is
      // for the 18 articles.
      status: withBodies ? 'publish' : 'draft',
      isFrontPage: routePath === '/',
      isPostsPage: routePath === '/blog/',
      template: 'page-templates/full-width.php',
      summary: field(block, 'summary') ?? '',
      seo: {
        title: field(block, 'title') ?? '',
        description: field(block, 'description') ?? '',
      },
    }
  })
  .filter(Boolean)

/* ------------------------------------------------------------------ *
 * Baseline page bodies
 * ------------------------------------------------------------------ */

/**
 * Minimal, honest page content.
 *
 * Checkpoint 003B P0 lays out five pages in Elementor. The other 33 routes have
 * to exist with real hierarchy and something to read, or the demo is a menu of
 * blank pages. This writes one summary paragraph plus, for a page that has
 * children, a list linking to them — navigable, and obviously baseline rather
 * than finished copy.
 *
 * The meta description is deliberately NOT reused as body text: it is written
 * for a search result, and duplicating it into the page is the oldest way to
 * end up with a page that reads like its own snippet.
 */
function baselinePageContent(page, all) {
  const parts = []

  if (page.summary) {
    parts.push(`<!-- wp:paragraph -->\n<p>${esc(page.summary)}</p>\n<!-- /wp:paragraph -->`)
  }

  const children = all.filter((candidate) => candidate.navParentRoute === page.route)

  if (children.length > 0) {
    parts.push(
      `<!-- wp:heading {"anchor":"noi-dung-trong-muc-nay"} -->\n<h2 class="wp-block-heading" id="noi-dung-trong-muc-nay">Nội dung trong mục này</h2>\n<!-- /wp:heading -->`,
    )
    const items = children
      .map(
        (child) =>
          `<!-- wp:list-item -->\n<li><a href="${child.route}">${esc(child.title)}</a></li>\n<!-- /wp:list-item -->`,
      )
      .join('\n')
    parts.push(`<!-- wp:list -->\n<ul class="wp-block-list">${items}</ul>\n<!-- /wp:list -->`)
  }

  return parts.join('\n\n')
}

if (withBodies) {
  for (const page of pages) page.content = baselinePageContent(page, pages)
}

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
      // Replaced with the real values below when --with-bodies is on.
      faq: [],
    }
  })
  .filter(Boolean)

/* ------------------------------------------------------------------ *
 * Article bodies
 * ------------------------------------------------------------------ */

/**
 * Loads each article body module and converts it to WordPress block markup.
 *
 * The body modules are imported, not scraped. They declare `import type` only,
 * so Node's type stripping loads them as-is, and the parser that reads their
 * Markdown is the one the React app uses — see lib/blocks.mjs for why that
 * matters. A missing or mismatched module fails the export rather than
 * producing a short article.
 */
async function loadArticleBodies(list) {
  const { parseBody } = await import(path.join(REPO, 'src/lib/blog/markdown.ts'))
  const issues = []
  const linkTargets = new Map()

  for (const article of list) {
    const modulePath = path.join(REPO, 'src/data/blog/articles', `${article.slug}.ts`)

    if (!fs.existsSync(modulePath)) {
      issues.push(`article ${article.id}: body module missing (${path.relative(REPO, modulePath)})`)
      continue
    }

    const module = await import(modulePath)
    const body = module.article

    if (!body) {
      issues.push(`article ${article.id}: body module exports no \`article\``)
      continue
    }

    // The body carries its own slug precisely so a copy-paste between files is
    // caught rather than silently publishing one article's prose under
    // another's title and URL.
    if (body.slug !== article.slug) {
      issues.push(`article ${article.id}: body slug "${body.slug}" != catalog slug "${article.slug}"`)
      continue
    }

    const blocks = parseBody(body.body)

    article.content = bodyToWp(blocks, body.directAnswer)
    article.faq = (body.faq ?? []).map((item) => ({
      question: String(item.question ?? ''),
      answer: String(item.answer ?? ''),
    }))
    // Image BRIEFS, not files. Every one of these is still unproduced, so the
    // count travels with the manifest as a reminder and no featured image is
    // ever invented for an article that has not earned one.
    article.imageBriefs = (body.images ?? []).length
    article.wordCount = body.body.trim().split(/\s+/).length

    linkTargets.set(article.slug, collectLinks(blocks))
  }

  return { issues, linkTargets }
}

let articleIssues = []
let articleLinks = new Map()

if (withBodies) {
  const loaded = await loadArticleBodies(articles)
  articleIssues = loaded.issues
  articleLinks = loaded.linkTargets
}

/* ------------------------------------------------------------------ *
 * Navigation -> WordPress menus
 * ------------------------------------------------------------------ */

/**
 * The header and footer are real PHP templates driven by `wp_nav_menu()`, so
 * with no menu assigned they render a header with no navigation at all. Nobody
 * is going to hand-build a 38-item information architecture in wp-admin twice
 * (once for the header, once for the footer) and get the grouping right, so the
 * IA is exported and the importer builds the menus.
 *
 * `navigation.ts` cannot be imported: it resolves the `@/` alias. The shapes
 * here are regular enough to extract, and every route is checked against the
 * route table below, so a typo fails the export rather than producing a menu
 * item pointing at nothing.
 */
const navSrc = read('src/config/navigation.ts')

/** Pulls `item(ROUTES.key)` / `item(ROUTES.key, { label: '...' })` in order. */
function navItems(source) {
  const out = []

  for (const match of source.matchAll(/item\(ROUTES\.(\w+)(?:,\s*\{([^}]*)\})?\)/g)) {
    const overrideLabel = match[2] ? field(match[2], 'label') : null
    out.push({ routeKey: match[1], label: overrideLabel })
  }

  return out
}

const pageByRoute = new Map(pages.map((page) => [page.route, page]))

/** Resolves an extracted nav entry to a manifest route + title. */
function navEntry({ routeKey, label }) {
  const route = routeTable[routeKey]
  if (!route) return { error: `navigation references unknown route key: ${routeKey}` }

  return {
    route,
    title: label ?? pageByRoute.get(route)?.title ?? route,
  }
}

const menuProblems = []

const primaryMenu = entries(navSrc, 'export const NAV_GROUPS: NavGroup[] = [')
  .map((block) => {
    // The group's own label is the first `label:` in the block — it is declared
    // before `overview:` and before any column, so nested overrides cannot win.
    const label = field(block, 'label') ?? ''
    const overviewSrc = block.slice(block.indexOf('overview:'), block.indexOf('columns:'))
    const columnsSrc = block.slice(block.indexOf('columns:'))

    const overview = block.includes('overview:') ? navItems(overviewSrc)[0] : null
    const children = navItems(columnsSrc)

    const resolved = []

    for (const child of children) {
      const entry = navEntry(child)
      if (entry.error) {
        menuProblems.push(entry.error)
        continue
      }
      // The group CTA repeats the overview route; one menu item is enough.
      if (resolved.some((existing) => existing.route === entry.route)) continue
      resolved.push(entry)
    }

    const top = overview ? navEntry(overview) : null
    if (top?.error) menuProblems.push(top.error)

    return {
      label,
      // A group without an overview page (Bảng giá) becomes a label-only parent
      // that is not itself a link — WordPress supports that as a custom item
      // with href '#'.
      route: top && !top.error ? top.route : null,
      children: resolved.filter((child) => !top || child.route !== top.route),
    }
  })
  .filter((group) => group.label !== '')

const footerMenu = entries(navSrc, 'export const FOOTER_COLUMNS: FooterColumn[] = [')
  .map((block) => {
    const label = field(block, 'label') ?? ''
    const children = navItems(block.slice(block.indexOf('items:')))
      .map(navEntry)
      .filter((entry) => {
        if (entry.error) {
          menuProblems.push(entry.error)
          return false
        }
        return true
      })

    return { label, route: null, children }
  })
  .filter((column) => column.label !== '')

/**
 * Blog is promoted to a top-level header item.
 *
 * `navigation.ts` files it inside the Tài nguyên mega menu, which is right for a
 * mega menu and wrong for the WordPress header: the theme renders a two-level
 * bar with no mega menu, so the blog — the only part of this demo with 250
 * pieces of content behind it — was two hovers deep. It STAYS in the Tài nguyên
 * group as well, because removing it there would break the grouping the sitemap
 * defines.
 */
const blogPage = pageByRoute.get('/blog/')

if (blogPage) {
  primaryMenu.push({ label: blogPage.title, route: '/blog/', children: [] })
}

const menus = {
  primary: primaryMenu,
  'footer-nav': footerMenu,
}

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
  checkpoint: withBodies ? 'GCALLS-WORDPRESS-003B-P0' : 'GCALLS-WORDPRESS-MIGRATION-003A',
  withBodies,
  counts: {
    pages: pages.length,
    articles: articles.length,
    media: media.length,
    menuItems:
      primaryMenu.reduce((total, group) => total + 1 + group.children.length, 0) +
      footerMenu.reduce((total, column) => total + 1 + column.children.length, 0),
  },
  hubs: [...new Set(articles.map((a) => a.hub).filter(Boolean))].sort(),
  pages,
  articles,
  media,
  menus,
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

problems.push(...menuProblems)
problems.push(...articleIssues)

/* --- hierarchy: a page's parent must exist, and the chain must be acyclic --- */
const routeSet = new Set(pages.map((page) => page.route))

for (const page of pages) {
  if (page.parentRoute && !routeSet.has(page.parentRoute)) {
    problems.push(`page ${page.id} has parentRoute ${page.parentRoute}, which is not a route`)
  }

  // The permalink WordPress will build from the parent chain has to be the
  // route the React site published. This is the check that would have caught
  // /blog/ being filed under /tai-nguyen/.
  const chain = []
  let cursor = page

  while (cursor?.parentRoute) {
    if (chain.includes(cursor.parentRoute)) {
      problems.push(`page ${page.id}: parent chain is circular at ${cursor.parentRoute}`)
      break
    }
    chain.unshift(cursor.parentRoute)
    cursor = pageByRoute.get(cursor.parentRoute)
  }

  if (!page.isFrontPage) {
    const expected = `/${[...chain.map((route) => route.replace(/^\/|\/$/g, '')), page.slug]
      .filter(Boolean)
      .join('/')}/`

    if (expected !== page.route) {
      problems.push(`page ${page.id}: hierarchy yields ${expected} but the route is ${page.route}`)
    }
  }
}

if (pages.filter((page) => page.isFrontPage).length !== 1) {
  problems.push('exactly one page must be the front page')
}
if (pages.filter((page) => page.isPostsPage).length !== 1) {
  problems.push('exactly one page must be the posts page')
}

/* --- bodies --- */
if (withBodies) {
  for (const article of articles) {
    if (!article.content) problems.push(`article ${article.id} has no body content`)
    if (!Array.isArray(article.faq) || article.faq.length === 0) {
      problems.push(`article ${article.id} has no FAQ items`)
    }
  }

  // Every internal link in an article body must resolve to a route or to
  // another Batch 1 article. A dead link inside imported prose is invisible
  // until a reader clicks it.
  const articleSlugs = new Set(articles.map((article) => article.slug))

  for (const [slug, links] of articleLinks) {
    for (const link of links) {
      if (!link.startsWith('/')) continue

      const normalised = link.split('#')[0]
      const bare = normalised.replace(/^\/|\/$/g, '')

      if (routeSet.has(normalised) || articleSlugs.has(bare)) continue

      problems.push(`article ${slug}: internal link goes nowhere: ${link}`)
    }
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`pages    ${pages.length}`)
console.log(`articles ${articles.length}`)
console.log(`media    ${media.length}`)
console.log(`menus    primary ${primaryMenu.length} groups, footer ${footerMenu.length} columns, ${manifest.counts.menuItems} items`)
console.log(`hubs     ${manifest.hubs.join(' ')}`)
console.log(
  `bodies   ${
    withBodies
      ? `included — ${articles.reduce((total, article) => total + (article.wordCount ?? 0), 0)} words, ` +
        `${articles.reduce((total, article) => total + article.faq.length, 0)} FAQ items, ` +
        `${articles.reduce((total, article) => total + (article.imageBriefs ?? 0), 0)} image briefs (0 files — none produced)`
      : 'excluded (003A builds the model, not the content)'
  }`,
)
console.log(`manifest ${path.relative(REPO, outPath)}`)

if (problems.length) {
  console.log('\nPROBLEMS')
  for (const problem of problems) console.log(`  - ${problem}`)
  process.exit(1)
}

console.log('\nexport-content: OK')
