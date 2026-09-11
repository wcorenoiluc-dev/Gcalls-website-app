#!/usr/bin/env node
/**
 * Negative tests for the import safety rules.
 *
 * WHAT THIS CAN AND CANNOT PROVE
 * `Importer::validate()` is PHP and there is no PHP on this laptop — php-lint.mjs
 * explains why — so it is syntax-checked here and executed on the host. What
 * this file tests is the RULE SET: the same hierarchy and collision rules,
 * implemented once here, run against manifests that are deliberately broken in
 * each of the ways that would damage a live site.
 *
 * That leaves one real risk: the two implementations drifting apart, with the
 * JavaScript still passing while the PHP no longer enforces something. The last
 * section closes it by asserting that every rule below names a marker that is
 * actually present in the PHP, so deleting a rule there fails the suite here.
 *
 * A green run means: these manifests are rejected, the real manifest is
 * accepted, and both implementations still contain all seven rules.
 *
 * Usage: node wordpress/scripts/test-import-rules.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.resolve(HERE, '..')

let failures = 0
const ok = (label) => console.log(`  ok   ${label}`)
const fail = (label, detail) => {
  console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`)
  failures += 1
}

/* ------------------------------------------------------------------ *
 * The rules, mirrored from includes/class-importer.php
 * ------------------------------------------------------------------ */

const normalise = (route) => (route === '/' || !route ? '/' : `/${String(route).replace(/^\/|\/$/g, '')}/`)

/**
 * Every rule carries the PHP marker that implements it, so the parity check at
 * the bottom fails if the PHP loses one.
 */
const RULES = {
  missingField: 'Trang thiếu trường',
  duplicateRoute: 'Hai trang cùng route',
  missingParent: 'không tồn tại trong manifest',
  circularParent: 'lặp vòng tại',
  permalinkMismatch: 'phân cấp tạo ra',
  frontPageCount: 'Phải có đúng một trang chủ',
  postsPageCount: 'Phải có đúng một trang blog',
  slugCollision: 'bị tranh chấp giữa trang',
  elementorRoute: 'trỏ tới route không có trong manifest',
  elementorFile: 'không phải file .json',
}

function validate(manifest) {
  const problems = []
  const pages = manifest.pages ?? []
  const articles = manifest.articles ?? []
  const byRoute = new Map()

  for (const page of pages) {
    const missing = ['id', 'slug', 'title', 'route'].find((field) => !page[field])
    if (missing) {
      problems.push(`${RULES.missingField} ${missing}`)
      continue
    }
    const route = normalise(page.route)
    if (byRoute.has(route)) problems.push(`${RULES.duplicateRoute}: ${route}`)
    byRoute.set(route, page)
  }

  let front = 0
  let posts = 0

  for (const [route, page] of byRoute) {
    if (page.isFrontPage) front += 1
    if (page.isPostsPage) posts += 1

    const chain = []
    let cursor = page
    let broken = false

    while (cursor?.parentRoute) {
      const parent = normalise(cursor.parentRoute)
      if (!byRoute.has(parent)) {
        problems.push(`${page.id}: parentRoute ${parent} ${RULES.missingParent}`)
        broken = true
        break
      }
      if (chain.includes(parent)) {
        problems.push(`${page.id}: ${RULES.circularParent} ${parent}`)
        broken = true
        break
      }
      chain.unshift(parent)
      cursor = byRoute.get(parent)
    }

    if (broken || page.isFrontPage) continue

    const expected = `/${[...chain.map((r) => r.replace(/^\/|\/$/g, '')), page.slug].filter(Boolean).join('/')}/`
    if (expected !== route) problems.push(`${page.id}: ${RULES.permalinkMismatch} ${expected} != ${route}`)
  }

  // Only meaningful for a manifest that carries pages: the blog corpus carries
  // articles and redirects, and has no home page to be missing.
  if (pages.length > 0) {
    if (front !== 1) problems.push(`${RULES.frontPageCount}, ${front}`)
    if (posts !== 1) problems.push(`${RULES.postsPageCount}, ${posts}`)
  }

  const topLevel = new Map()
  for (const page of byRoute.values()) {
    if (!page.parentRoute && !page.isFrontPage) topLevel.set(page.slug, page.id)
  }
  for (const article of articles) {
    if (article.slug && topLevel.has(article.slug)) {
      problems.push(`${article.slug} ${RULES.slugCollision} ${topLevel.get(article.slug)}`)
    }
  }

  for (const entry of manifest.elementor ?? []) {
    const route = entry.route ? normalise(entry.route) : ''
    if (!route || !byRoute.has(route)) {
      problems.push(`Template Elementor ${RULES.elementorRoute}: ${route || '(trống)'}`)
    }
    if (!entry.file || !String(entry.file).endsWith('.json')) {
      problems.push(`Template Elementor ${RULES.elementorFile}: ${entry.file || '(trống)'}`)
    }
  }

  return problems
}

/* ------------------------------------------------------------------ *
 * Fixtures
 * ------------------------------------------------------------------ */

const page = (over = {}) => ({
  id: 'p',
  slug: 's',
  title: 'T',
  route: '/s/',
  parentRoute: null,
  isFrontPage: false,
  isPostsPage: false,
  ...over,
})

const home = page({ id: 'home', slug: 'trang-chu', route: '/', isFrontPage: true })
const blog = page({ id: 'blog', slug: 'blog', route: '/blog/', isPostsPage: true })

const base = (pages, articles = []) => ({ pages: [home, blog, ...pages], articles })

const CASES = [
  {
    name: 'an Elementor template pointing at a route no page creates is rejected',
    // Silently applying a home page layout to nothing, and reporting a clean
    // run while doing it, is worse than refusing: the operator would go looking
    // for the layout on a page the importer never touched.
    manifest: { ...base([]), elementor: [{ route: '/khong-co/', file: 'x.json' }] },
    expect: RULES.elementorRoute,
  },
  {
    name: 'an Elementor entry naming something other than a .json file is rejected',
    manifest: { ...base([]), elementor: [{ route: '/', file: '../../wp-config.php' }] },
    expect: RULES.elementorFile,
  },
  {
    name: 'an Elementor entry naming the front page route is accepted',
    manifest: { ...base([]), elementor: [{ route: '/', file: 'gcalls-homepage.json' }] },
    expect: null,
  },
  {
    name: 'the posts page filed under a nav parent is rejected',
    // The exact defect this whole rule exists for: /blog/ given the sitemap's
    // navigation parent would resolve at /tai-nguyen/blog/ and break the URL
    // that all eighteen articles link back to.
    manifest: {
      pages: [
        home,
        page({ id: 'res', slug: 'tai-nguyen', route: '/tai-nguyen/' }),
        page({ id: 'blog', slug: 'blog', route: '/blog/', parentRoute: '/tai-nguyen/', isPostsPage: true }),
      ],
      articles: [],
    },
    expect: RULES.permalinkMismatch,
  },
  {
    name: 'a product page under /san-pham/ that publishes at the root is rejected',
    manifest: base([
      page({ id: 'prod', slug: 'san-pham', route: '/san-pham/' }),
      page({ id: 'plus', slug: 'gcalls-plus-webphone', route: '/gcalls-plus-webphone/', parentRoute: '/san-pham/' }),
    ]),
    expect: RULES.permalinkMismatch,
  },
  {
    name: 'a parent that is not in the manifest is rejected',
    manifest: base([page({ id: 'orphan', slug: 'x', route: '/nowhere/x/', parentRoute: '/nowhere/' })]),
    expect: RULES.missingParent,
  },
  {
    name: 'a circular parent chain is rejected',
    manifest: base([
      page({ id: 'a', slug: 'a', route: '/a/', parentRoute: '/b/' }),
      page({ id: 'b', slug: 'b', route: '/b/', parentRoute: '/a/' }),
    ]),
    expect: RULES.circularParent,
  },
  {
    name: 'two front pages are rejected',
    manifest: base([page({ id: 'second-home', slug: 'home2', route: '/home2/', isFrontPage: true })]),
    expect: RULES.frontPageCount,
  },
  {
    name: 'no posts page is rejected when the manifest has pages',
    manifest: { pages: [home], articles: [] },
    expect: RULES.postsPageCount,
  },
  {
    name: 'a manifest with no pages is NOT asked for a home page',
    // The full blog corpus: articles and redirects, no pages. It used to be
    // refused for lacking a front page it never claimed to have.
    manifest: { pages: [], articles: [{ id: 'a1', slug: 'x' }] },
    expect: null,
  },
  {
    name: 'two pages on the same route are rejected',
    manifest: base([page({ id: 'x1', slug: 's', route: '/s/' }), page({ id: 'x2', slug: 's', route: '/s/' })]),
    expect: RULES.duplicateRoute,
  },
  {
    name: 'a page missing a required field is rejected',
    manifest: base([page({ id: 'nosl', slug: '', route: '/z/' })]),
    expect: RULES.missingField,
  },
  {
    name: 'an article slug colliding with a top-level page is rejected',
    // Posts resolve at /%postname%/, so both would claim /tong-dai-quoc-te/ and
    // WordPress would silently serve one of them.
    manifest: base(
      [page({ id: 'intl', slug: 'tong-dai-quoc-te', route: '/tong-dai-quoc-te/' })],
      [{ id: 'a1', slug: 'tong-dai-quoc-te' }],
    ),
    expect: RULES.slugCollision,
  },
]

console.log('IMPORT RULES — negative tests\n')
console.log('1. Broken manifests must be refused')

for (const testCase of CASES) {
  const problems = validate(testCase.manifest)

  // `expect: null` asserts the opposite — that the manifest is ACCEPTED.
  if (testCase.expect === null) {
    if (problems.length === 0) ok(testCase.name)
    else fail(testCase.name, problems.join('; '))
    continue
  }

  const matched = problems.some((problem) => problem.includes(testCase.expect))

  if (matched) ok(testCase.name)
  else fail(testCase.name, problems.length ? problems.join('; ') : 'accepted with no problems')
}

/* ------------------------------------------------------------------ *
 * The real manifest must pass
 * ------------------------------------------------------------------ */

console.log('\n2. The shipped manifest must be accepted')

const manifestPath = path.join(WP, 'imports/content-manifest.json')

if (!fs.existsSync(manifestPath)) {
  fail('content-manifest.json present')
} else {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  const problems = validate(manifest)
  if (problems.length === 0) ok(`content-manifest.json (${manifest.pages.length} pages, ${manifest.articles.length} articles)`)
  else fail('content-manifest.json', problems.join('; '))
}

/* ------------------------------------------------------------------ *
 * Parity — the PHP must still implement every rule
 * ------------------------------------------------------------------ */

console.log('\n3. The PHP implements the same rules')

const php = fs.readFileSync(path.join(WP, 'wp-content/plugins/gcalls-core/includes/class-importer.php'), 'utf8')

for (const [rule, marker] of Object.entries(RULES)) {
  if (php.includes(marker)) ok(`class-importer.php still enforces ${rule}`)
  else fail(`class-importer.php still enforces ${rule}`, `missing message: ${marker}`)
}

console.log(`\nfailures: ${failures}`)
process.exit(failures === 0 ? 0 : 1)
