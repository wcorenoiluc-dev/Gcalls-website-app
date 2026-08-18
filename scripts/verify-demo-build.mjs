/**
 * Private-demo build QA — §I and §J of Checkpoint GCALLS-DEMO-IMAGE-FOUNDATION-001.
 *
 * Serves `dist/` with an SPA fallback and drives the real Chrome through
 * playwright-core (no Chromium download — there is no macOS 13 build), then
 * reports per route:
 *
 *   · console errors and failed network requests
 *   · exactly one H1
 *   · robots meta, canonical, JSON-LD
 *   · every <img> loaded, with intrinsic width/height and a loading attribute
 *   · horizontal overflow at 1440 / 1024 / 768 / 390 / 320
 *
 * and site-wide: total image weight, first-viewport image count and the LCP
 * image on the P0 pages.
 *
 *   VITE_BLOG_PREVIEW=true VITE_ALLOW_INDEXING=false npm run build
 *   node scripts/verify-demo-build.mjs
 */
import { chromium } from 'playwright-core'
import { createServer } from 'node:http'
import { readFile, stat, mkdir, writeFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const DIST = path.resolve('dist')
const OUT = path.resolve('docs/content-review/images/demo-qa')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const VIEWPORTS = [1440, 1024, 768, 390, 320]

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.json': 'application/json', '.txt': 'text/plain', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

/* ---------------------------------------------------------------- server -- */

/** 404s the server actually served, in order, so each route can claim its own. */
const server404 = []

const server = createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0])
  const direct = path.join(DIST, url)
  let file = null
  try {
    const s = await stat(direct)
    file = s.isDirectory() ? path.join(direct, 'index.html') : direct
    await stat(file)
  } catch {
    file = null
  }
  // SPA fallback: anything without a file extension renders index.html.
  if (!file) {
    if (path.extname(url)) {
      server404.push(url)
      res.writeHead(404).end('not found')
      return
    }
    file = path.join(DIST, 'index.html')
  }
  try {
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
})
await new Promise((r) => server.listen(0, r))
const BASE = `http://localhost:${server.address().port}`

/* ----------------------------------------------------------------- routes -- */

const siteSrc = await readFile('src/config/sitemap.ts', 'utf8')
const routesBlock = siteSrc.slice(siteSrc.indexOf('export const ROUTES = {'), siteSrc.indexOf('} as const'))
const SITE_ROUTES = [...routesBlock.matchAll(/:\s*'(\/[^']*)'/g)].map((m) => m[1])

const catalogSrc = await readFile('src/data/blog/catalog.ts', 'utf8')
const SLUGS = [...catalogSrc.matchAll(/^\s{4}slug:\s*'([^']+)'/gm)].map((m) => m[1])
const ARTICLE_ROUTES = SLUGS.map((s) => `/${s}/`)

const TARGETS = [
  ...SITE_ROUTES.map((p) => ({ path: p, kind: 'website' })),
  ...ARTICLE_ROUTES.map((p) => ({ path: p, kind: 'article' })),
  { path: '/khong-ton-tai-checkpoint-001/', kind: '404' },
]

console.log(`routes: ${SITE_ROUTES.length} website (incl. /blog/) · ${ARTICLE_ROUTES.length} articles · 1 not-found = ${TARGETS.length}`)

/* --------------------------------------------------------------- browser -- */

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ executablePath: CHROME })
const results = []

for (const target of TARGETS) {
  const consoleErrors = []
  const netFailures = []
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  /**
   * Chrome probes /favicon.ico itself. That request is browser-level, so it
   * never reaches Playwright's `response` event — the only trace is a generic
   * "Failed to load resource: 404" console line with no URL in it. The site
   * declares no favicon and ships none, so every route produces one.
   *
   * Attribute it from the server side: record which paths the server 404'd
   * while this route loaded, and drop exactly as many generic 404 lines as
   * there were favicon 404s. Anything else still counts as a real error.
   */
  const server404Start = server404.length
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200))
  })
  page.on('response', (r) => {
    if (r.status() >= 400) netFailures.push(`${r.status()} ${r.url().replace(BASE, '')}`)
  })
  page.on('requestfailed', (r) => netFailures.push(`FAILED ${r.url().replace(BASE, '')}`))

  await page.goto(`${BASE}${target.path}`, { waitUntil: 'networkidle', timeout: 30000 })

  const info = await page.evaluate(() => {
    const canonical = document.querySelector('link[rel="canonical"]')
    const robots = document.querySelector('meta[name="robots"]')
    const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
    let jsonLdValid = true
    const jsonLdTypes = []
    for (const s of jsonLd) {
      try {
        const parsed = JSON.parse(s.textContent)
        const arr = Array.isArray(parsed) ? parsed : [parsed]
        arr.forEach((o) => jsonLdTypes.push(o['@type'] ?? '?'))
      } catch {
        jsonLdValid = false
      }
    }
    const imgs = [...document.querySelectorAll('img')].map((el) => ({
      src: el.getAttribute('src') ?? '',
      loaded: el.complete && el.naturalWidth > 0,
      hasDims: el.hasAttribute('width') && el.hasAttribute('height'),
      loading: el.getAttribute('loading') ?? '(none)',
      alt: el.getAttribute('alt'),
      inFirstViewport: el.getBoundingClientRect().top < window.innerHeight,
      // Rendered area, not intrinsic pixels: LCP is decided by what the user
      // sees, so a tall portrait capture shown at 300px wide must not outrank
      // the wider hero image next to it.
      area: Math.round(el.getBoundingClientRect().width * el.getBoundingClientRect().height),
    }))
    return {
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      canonical: canonical?.getAttribute('href') ?? null,
      robots: robots?.getAttribute('content') ?? null,
      jsonLdCount: jsonLd.length,
      jsonLdValid,
      jsonLdTypes,
      imgs,
      is404: /không tìm thấy|404/i.test(document.body.innerText.slice(0, 400)),
    }
  })

  /**
   * Lazy images below the fold are correctly still unfetched at `networkidle`.
   * Scroll the page so they load, then confirm every image resolves. This
   * distinguishes "lazy-loading works" from "the file is missing".
   */
  await page.evaluate(async () => {
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(400)
  const afterScroll = await page.evaluate(() =>
    [...document.querySelectorAll('img')].map((el) => ({
      src: el.getAttribute('src') ?? '',
      loaded: el.complete && el.naturalWidth > 0,
    })),
  )
  info.imgs = info.imgs.map((i) => ({
    ...i,
    loadedAfterScroll: afterScroll.find((a) => a.src === i.src)?.loaded ?? false,
  }))

  const faviconProbes = server404
    .slice(server404Start)
    .filter((u) => u === '/favicon.ico').length
  for (let n = 0; n < faviconProbes; n += 1) {
    const at = consoleErrors.findIndex((e) => /Failed to load resource.*404/.test(e))
    if (at !== -1) consoleErrors.splice(at, 1)
  }
  const faviconMissing = faviconProbes > 0

  const overflow = {}
  for (const w of VIEWPORTS) {
    await page.setViewportSize({ width: w, height: 900 })
    await page.waitForTimeout(120)
    overflow[w] = await page.evaluate(
      (vw) => document.documentElement.scrollWidth > vw + 1,
      w,
    )
  }

  results.push({ ...target, ...info, consoleErrors, netFailures, overflow, faviconMissing })
  await context.close()
}

/* ------------------------------------------------------- screenshot set -- */

const SHOTS = [
  { name: 'homepage', path: '/' },
  { name: 'gcalls-plus', path: '/gcalls-plus-webphone/' },
  { name: 'blog-archive', path: '/blog/' },
  { name: 'pillar', path: `/${SLUGS[0]}/` },
  { name: 'supporting', path: `/${SLUGS[SLUGS.length - 1]}/` },
]

for (const shot of SHOTS) {
  for (const [label, width] of [['desktop', 1440], ['mobile', 390]]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await context.newPage()
    await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(300)
    await page.screenshot({ path: path.join(OUT, `${shot.name}-${label}-${width}.png`), fullPage: false })
    await context.close()
  }
}

await browser.close()
server.close()

/* --------------------------------------------------------------- report -- */

const imgDir = path.join(DIST, 'images')
async function weigh(dir) {
  let total = 0
  const files = []
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      const sub = await weigh(p)
      total += sub.total
      files.push(...sub.files)
    } else {
      const s = await stat(p)
      total += s.size
      files.push({ path: p.replace(DIST + '/', ''), bytes: s.size })
    }
  }
  return { total, files }
}
const imageWeight = await weigh(imgDir)

/** Largest image inside the first viewport — the LCP candidate. */
const lcpOf = (r) =>
  [...r.imgs].filter((i) => i.inFirstViewport).sort((a, b) => b.area - a.area)[0]

/** Which gate a route trips, so a failure names its own reason. */
const failReasons = (r) => {
  const out = []
  if (r.consoleErrors.length) out.push(`console errors: ${r.consoleErrors.length}`)
  if (r.netFailures.length) out.push(`network failures: ${r.netFailures.length}`)
  if (r.kind !== '404' && r.h1Count !== 1) out.push(`h1 count ${r.h1Count}`)
  if (!r.jsonLdValid) out.push('invalid JSON-LD')
  const ov = Object.entries(r.overflow).filter(([, v]) => v).map(([w]) => w)
  if (ov.length) out.push(`horizontal overflow at ${ov.join(', ')}`)
  const bad = r.imgs.filter((i) => !i.loadedAfterScroll || !i.hasDims)
  if (bad.length) out.push(`images unusable: ${bad.map((i) => i.src).join(', ')}`)
  if (lcpOf(r)?.loading === 'lazy') out.push('LCP image is lazy')
  return out
}

/**
 * A route fails if it trips any gate. Delegates to `failReasons` so the
 * pass/fail decision and the explanation can never drift apart.
 */
const fail = (r) => failReasons(r).length > 0

const failures = results.filter(fail)
const drafts = results.filter((r) => r.kind === 'article')
const badRobots = drafts.filter(
  (r) => r.robots !== 'noindex,nofollow,noarchive,nosnippet,noimageindex',
)
const indexable = results.filter((r) => r.robots && !/noindex/.test(r.robots))
const allImgs = results.flatMap((r) => r.imgs)
const over500 = imageWeight.files.filter((f) => f.bytes > 500 * 1024)

const p0 = ['/', '/gcalls-plus-webphone/', '/blog/']
const perP0 = p0.map((p) => {
  const r = results.find((x) => x.path === p)
  const paths = new Set(r.imgs.map((i) => i.src))
  const bytes = imageWeight.files
    .filter((f) => paths.has('/' + f.path))
    .reduce((a, f) => a + f.bytes, 0)
  return { path: p, images: r.imgs.length, firstViewport: r.imgs.filter((i) => i.inFirstViewport).length, bytes }
})

const gp = results.find((r) => r.path === '/gcalls-plus-webphone/')
const lcpCandidate = lcpOf(gp)

const report = {
  generatedFor: 'GCALLS-DEMO-IMAGE-FOUNDATION-001 §I §J',
  routesTested: results.length,
  websiteRoutes: SITE_ROUTES.length,
  articleRoutes: ARTICLE_ROUTES.length,
  routesFailing: failures.length,
  failures: failures.map((f) => ({
    path: f.path, reasons: failReasons(f), imgs: f.imgs,
    h1Count: f.h1Count, consoleErrors: f.consoleErrors,
    netFailures: f.netFailures, overflow: f.overflow,
    brokenImages: f.imgs.filter((i) => !i.loadedAfterScroll || !i.hasDims),
    lcpImage: lcpOf(f) ?? null,
  })),
  draftRobots: { articles: drafts.length, wrong: badRobots.map((r) => ({ path: r.path, robots: r.robots })) },
  indexablePages: indexable.map((r) => ({ path: r.path, robots: r.robots })),
  canonicalMissing: results.filter((r) => r.kind !== '404' && !r.canonical).map((r) => r.path),
  structuredData: {
    pagesWithJsonLd: results.filter((r) => r.jsonLdCount > 0).length,
    invalid: results.filter((r) => !r.jsonLdValid).map((r) => r.path),
  },
  images: {
    totalOnDisk: imageWeight.files.length,
    totalBytes: imageWeight.total,
    totalKB: +(imageWeight.total / 1024).toFixed(1),
    over500KB: over500,
    renderedTotal: allImgs.length,
    missingDimensions: allImgs.filter((i) => !i.hasDims).length,
    missingAlt: allImgs.filter((i) => i.alt === null).length,
    decorativeAlt: allImgs.filter((i) => i.alt === '').length,
    lazyCoverage: `${allImgs.filter((i) => i.loading === 'lazy').length}/${allImgs.length}`,
    eager: allImgs.filter((i) => i.loading === 'eager').map((i) => i.src),
    notLoaded: allImgs.filter((i) => !i.loadedAfterScroll).map((i) => i.src),
    deferredUntilScroll: allImgs.filter((i) => !i.loaded && i.loadedAfterScroll).length,
  },
  p0Pages: perP0,
  gcallsPlusLcpImage: lcpCandidate
    ? { src: lcpCandidate.src, loading: lcpCandidate.loading, inFirstViewport: lcpCandidate.inFirstViewport }
    : null,
  responsive: {
    viewports: VIEWPORTS,
    routesWithHorizontalOverflow: results.filter((r) => Object.values(r.overflow).some(Boolean)).map((r) => r.path),
  },
  lazyRuleViolations: results
    .filter((r) => lcpOf(r)?.loading === 'lazy')
    .map((r) => ({ path: r.path, src: lcpOf(r).src })),
  knownGaps: {
    faviconMissing: results.filter((r) => r.faviconMissing).length,
    note: 'No favicon is declared in index.html and none exists in public/. Chrome probes /favicon.ico on every route and gets a 404. Pre-existing; needs a brand asset, not a code fix.',
  },
  notFound: (() => {
    const r = results.find((x) => x.kind === '404')
    return { path: r.path, rendered404: r.is404, robots: r.robots }
  })(),
}

await writeFile(path.join(OUT, 'demo-qa-report.json'), `${JSON.stringify(report, null, 2)}\n`)

console.log('\n--- DEMO QA ---')
console.log(`routes tested            ${report.routesTested} (${report.websiteRoutes} website + ${report.articleRoutes} articles + 1 not-found)`)
console.log(`routes failing           ${report.routesFailing}`)
for (const f of report.failures) console.log(`  ${f.path} -> ${f.reasons.join(' | ') || '(no reason matched — check fail())'}`)
console.log(`draft articles rendered  ${drafts.length}`)
console.log(`draft robots wrong       ${badRobots.length}`)
console.log(`indexable pages          ${indexable.length}`)
console.log(`canonical missing        ${report.canonicalMissing.length}`)
console.log(`json-ld invalid          ${report.structuredData.invalid.length}`)
console.log(`horizontal overflow      ${report.responsive.routesWithHorizontalOverflow.length}`)
console.log(`images on disk           ${report.images.totalOnDisk} · ${report.images.totalKB} KB`)
console.log(`images over 500 KB       ${over500.length}`)
console.log(`img missing width/height ${report.images.missingDimensions}`)
console.log(`img failed to load       ${report.images.notLoaded.length}`)
console.log(`img deferred until scroll ${report.images.deferredUntilScroll} (lazy working as intended)`)
console.log(`favicon 404 on routes    ${report.knownGaps.faviconMissing} (pre-existing: no favicon asset)`)
console.log(`LCP image lazy           ${report.lazyRuleViolations.length}`)
console.log(`lazy coverage            ${report.images.lazyCoverage}`)
console.log(`eager images             ${JSON.stringify(report.images.eager)}`)
for (const p of perP0) console.log(`P0 ${p.path.padEnd(26)} ${p.images} img · ${p.firstViewport} in first viewport · ${(p.bytes / 1024).toFixed(1)} KB`)
console.log(`\nreport  ${path.relative(process.cwd(), path.join(OUT, 'demo-qa-report.json'))}`)
