/**
 * Content + taxonomy + media + UI assertions for /san-pham/.
 *
 * Runs against the rendered page. Expected copy is READ FROM `hubs.ts` rather
 * than restated here: the content is approved and locked, so a second copy in
 * the checker would only create something to drift against.
 *
 * Usage: node scripts/verify-products-hub.mjs [baseUrl]
 */
import { chromium } from 'playwright-core'
import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.argv[2] ?? 'http://localhost:5203'
const URL = `${BASE}/san-pham/`

const failures = []
const passes = []
const check = (name, ok, detail = '') =>
  ok ? passes.push(name) : failures.push(`${name}${detail ? ` — ${detail}` : ''}`)

/** The three products this hub must carry, by route. */
const EXPECTED_PRODUCT_PATHS = [
  '/gcalls-plus-webphone/',
  '/qc-bot-ai/',
  '/gcalls-cx/',
]
const REQUIRED_H1 = 'Hệ sinh thái sản phẩm Gcalls cho đội Sales, CSKH và QA'

/** Hub content is claim-guarded: no count, duration, saving or certification. */
const FABRICATED = [
  [/\b\d[\d.,]*\s*\+?\s*(?:khách hàng|doanh nghiệp|quốc gia|CRM)\b/i, 'a count claim'],
  [/\b\d{1,3}\s*%/, 'a percentage figure'],
  [/\b\d+\+?\s*năm kinh nghiệm/i, 'an experience claim'],
  [/\buptime\b|\bSLA\b/i, 'an uptime/SLA claim'],
  [/đối tác (?:chính thức|được chứng nhận)/i, 'a partnership claim'],
  [/\b\d[\d.,]*\s*(?:VND|đ|USD)\b/i, 'a price'],
]

const PII_PATTERNS = [
  [/\b0(?!9?0{6,})(?:3|5|7|8|9)\d{8}\b/, 'a Vietnamese mobile number'],
  [
    /\b[\w.+-]+@(?!example\.com|gcalls\.co)[\w-]+\.[\w.]{2,}\b/,
    'a third-party e-mail address',
  ],
]

const hubsSrc = await readFile(path.join(ROOT, 'src/data/hubs.ts'), 'utf8')
const PRODUCTS_BLOCK = hubsSrc.slice(
  hubsSrc.indexOf('export const PRODUCTS_HUB'),
  hubsSrc.indexOf('export const SOLUTIONS_HUB'),
)

/** Every string literal PRODUCTS_HUB declares — nothing may go unrendered. */
function declaredStrings() {
  const out = new Set()
  // Newlines are excluded from the class on purpose: without that the match
  // runs from one quote to a quote several lines away and captures source code
  // rather than a string literal.
  for (const m of PRODUCTS_BLOCK.matchAll(/'([^'\n]{12,})'/g)) {
    const v = m[1].replace(/\\'/g, "'")
    // Skip route constants and identifiers; those are not visible copy.
    if (v.startsWith('/') || /^[a-z_]+$/.test(v)) continue
    out.add(v)
  }
  return [...out]
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

const consoleErrors = []
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
page.on('pageerror', (e) => consoleErrors.push(String(e)))
page.on('response', (r) => {
  if (r.status() >= 400) consoleErrors.push(`HTTP ${r.status()} ${r.url()}`)
})

await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 40))
  }
  window.scrollTo(0, 0)
})
await page.waitForTimeout(500)

const dom = await page.evaluate(() => {
  const scope = document.querySelector('.ph-page')
  const cardList = scope?.querySelectorAll('section ul > li h3')
  const cards = Array.from(scope?.querySelectorAll('li') ?? []).filter((li) =>
    li.querySelector('h3'),
  )
  return {
    hasScope: Boolean(scope),
    sectionCount: scope?.querySelectorAll(':scope > section').length ?? 0,
    h1s: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent?.trim()),
    productTitles: Array.from(cardList ?? []).map((h) => h.textContent?.trim()),
    /** Each product card: its single CTA href and accessible name. */
    productCards: cards.map((li) => {
      const links = Array.from(li.querySelectorAll('a'))
      return {
        title: li.querySelector('h3')?.textContent?.trim(),
        linkCount: links.length,
        href: links[0]?.getAttribute('href') ?? '',
        ariaLabel: links[0]?.getAttribute('aria-label') ?? '',
        hasMedia: Boolean(li.querySelector('figure')),
        mediaLabel: li.querySelector('figcaption')?.textContent?.trim() ?? '',
        // A card's media must be its own, not a clone of another's.
        mediaSignature: li.querySelector('figure > div')?.innerHTML.slice(0, 400) ?? '',
        height: Math.round(li.getBoundingClientRect().height),
        top: Math.round(li.getBoundingClientRect().top),
      }
    }),
    /** Nested links inside any one card would be an a11y defect. */
    nestedLinks: Array.from(scope?.querySelectorAll('a a') ?? []).length,
    hrefs: Array.from(scope?.querySelectorAll('a') ?? []).map((a) => ({
      href: a.getAttribute('href') ?? '',
      text: (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 44),
    })),
    text: scope?.innerText ?? '',
    images: Array.from(document.images).map((i) => ({
      src: new URL(i.currentSrc || i.src, location.href).pathname,
      broken: i.complete && i.naturalWidth === 0,
      upscaled: i.naturalWidth > 0 && i.getBoundingClientRect().width > i.naturalWidth + 1,
      alt: i.alt,
    })),
    containerWidths: Array.from(
      document.querySelectorAll('.ph-page .max-w-\\[1280px\\]'),
    ).map((el) => Math.round(el.getBoundingClientRect().width)),
    sectionPadding: Array.from(
      document.querySelectorAll('.ph-page > section'),
    ).map((s) => {
      const cs = getComputedStyle(s)
      return [parseFloat(cs.paddingTop), parseFloat(cs.paddingBottom)]
    }),
    orphanHeadings: Array.from(scope?.querySelectorAll(':scope > section') ?? [])
      .filter((s) => {
        const h = s.querySelector('h1, h2')
        if (!h) return false
        return s.innerText.replace(h.textContent ?? '', '').trim().length < 20
      })
      .map((s) => s.querySelector('h1, h2')?.textContent?.trim().slice(0, 40)),
    emptyGridTracks: Array.from(scope?.querySelectorAll('.grid') ?? []).filter((el) => {
      const cols = getComputedStyle(el).gridTemplateColumns.split(' ').length
      const kids = Array.from(el.children).filter(
        (c) => c.getBoundingClientRect().height > 0,
      ).length
      return cols > 1 && kids > 0 && kids < cols
    }).length,
    finalCtaCount: Array.from(scope?.querySelectorAll('section') ?? []).filter((s) =>
      s.id?.endsWith('-cta') || s.getAttribute('aria-labelledby')?.endsWith('-cta'),
    ).length,
  }
})

/* -- 1. structure --------------------------------------------------- */
check('page scope class present', dom.hasScope)
check('exactly one H1', dom.h1s.length === 1, `found ${dom.h1s.length}`)
check('H1 is the approved heading', dom.h1s[0] === REQUIRED_H1, dom.h1s[0])
check('breadcrumb + 6 content sections', dom.sectionCount === 6,
  `found ${dom.sectionCount}`)
check('no orphan heading', dom.orphanHeadings.length === 0,
  dom.orphanHeadings.join(', '))
check('no empty grid track', dom.emptyGridTracks === 0, `${dom.emptyGridTracks}`)
check('exactly one final CTA', dom.finalCtaCount === 1, `found ${dom.finalCtaCount}`)

/* -- 2. taxonomy ---------------------------------------------------- */
const dataCardPaths = [...PRODUCTS_BLOCK.matchAll(/path: ROUTES\.(\w+),\n        cta:/g)]
  .map((m) => m[1])
check('PRODUCTS_HUB declares exactly 3 product cards', dataCardPaths.length === 3,
  `found ${dataCardPaths.length}: ${dataCardPaths.join(', ')}`)
check('page renders exactly 3 product cards', dom.productCards.length === 3,
  `found ${dom.productCards.length}: ${dom.productCards.map((c) => c.title).join(', ')}`)
check('product routes are the three expected',
  JSON.stringify(dom.productCards.map((c) => c.href).sort()) ===
    JSON.stringify([...EXPECTED_PRODUCT_PATHS].sort()),
  dom.productCards.map((c) => c.href).join(', '))
check('no product appears twice',
  new Set(dom.productCards.map((c) => c.href)).size === dom.productCards.length)
check('no Voicebot product card',
  !dom.productCards.some((c) => /voicebot/i.test(`${c.title} ${c.href}`)),
  dom.productCards.map((c) => c.title).join(', '))
check('no Voicebot card in the PRODUCTS_HUB data',
  !/title: 'Gcalls Voicebot AI'/.test(PRODUCTS_BLOCK))
check('no Voicebot row in the decision guide',
  !/ROUTES\.voicebotAi/.test(PRODUCTS_BLOCK))
check('every product card links to a child page',
  dom.productCards.every((c) => c.href && c.href !== '#'),
  dom.productCards.map((c) => `${c.title}:${c.href}`).join(', '))

/* -- 3. cards: media, a11y, equal height ---------------------------- */
check('every product card has its own media slot',
  dom.productCards.every((c) => c.hasMedia),
  dom.productCards.filter((c) => !c.hasMedia).map((c) => c.title).join(', '))
const signatures = dom.productCards.map((c) => c.mediaSignature)
check('no two product cards share the same visual',
  new Set(signatures).size === signatures.length)
check('every product CTA has its own accessible name',
  new Set(dom.productCards.map((c) => c.ariaLabel)).size === dom.productCards.length &&
    dom.productCards.every((c) => c.ariaLabel.length > 0),
  dom.productCards.map((c) => c.ariaLabel).join(' | '))
check('one link per product card (no nested navigation)',
  dom.productCards.every((c) => c.linkCount === 1),
  dom.productCards.map((c) => `${c.title}:${c.linkCount}`).join(', '))
check('no nested anchors anywhere on the page', dom.nestedLinks === 0)
const sameRow = dom.productCards.filter((c) => c.top === dom.productCards[0].top)
check('cards on the same row have equal height',
  new Set(sameRow.map((c) => c.height)).size <= 1,
  sameRow.map((c) => `${c.title}:${c.height}`).join(', '))
// Every non-capture visual must say so.
const diagramCards = dom.productCards.filter((c) => !/qc-bot|gcalls-plus/.test(c.href) || /qc-bot/.test(c.href))
check('every diagram slot is labelled "Sơ đồ quy trình minh họa"',
  dom.productCards
    .filter((c) => c.href !== '/gcalls-plus-webphone/')
    .every((c) => /Sơ đồ quy trình minh họa/.test(c.mediaLabel)),
  dom.productCards.map((c) => `${c.title}: ${c.mediaLabel}`).join(' | '))

/* -- 4. decision guide ---------------------------------------------- */
const guideRows = [...PRODUCTS_BLOCK.matchAll(/^        problem:/gm)].length
check('decision guide keeps all four problems', guideRows === 4, `found ${guideRows}`)
check('the integration row is distinguished from the three products',
  dom.text.includes('KHÔNG PHẢI CHỌN SẢN PHẨM') ||
    dom.text.includes('Không phải chọn sản phẩm'),
  'the integration row must not read as a fourth product')

/* -- 5. no PRODUCTS_HUB field is lost -------------------------------- */
const normalise = (s) => s.replace(/\s+/g, ' ').trim()
const pageText = normalise(dom.text)
const missing = declaredStrings().filter((v) => !pageText.includes(normalise(v)))
check('every string PRODUCTS_HUB declares is rendered', missing.length === 0,
  missing.map((m) => `"${m.slice(0, 46)}…"`).join(' | '))

/* -- 6. links -------------------------------------------------------- */
const badHrefs = dom.hrefs.filter((a) => a.href === '' || a.href === '#')
check('no empty or placeholder href', badHrefs.length === 0,
  badHrefs.map((a) => `"${a.text}"`).join(', '))

/* -- 7. claim safety and PII ----------------------------------------- */
for (const [re, label] of FABRICATED) {
  const m = dom.text.match(re)
  check(`no ${label}`, !m, m ? `found "${m[0].trim()}"` : '')
}
for (const [re, label] of PII_PATTERNS) {
  const m = dom.text.match(re)
  check(`no ${label}`, !m, m ? `found "${m[0]}"` : '')
}

/* -- 8. media provenance --------------------------------------------- */
check('no broken image', dom.images.every((i) => !i.broken),
  dom.images.filter((i) => i.broken).map((i) => i.src).join(', '))
check('no upscaled image', dom.images.every((i) => !i.upscaled),
  dom.images.filter((i) => i.upscaled).map((i) => i.src).join(', '))
check('every image has descriptive alt text',
  dom.images.every((i) => i.alt && i.alt.length > 20),
  dom.images.filter((i) => !i.alt || i.alt.length <= 20).map((i) => i.src).join(', '))
// Only the approved Gcalls Plus capture may be requested by this hub.
const offList = dom.images
  .map((i) => i.src)
  .filter((s) => s !== '/images/products/gcalls-plus/gcalls-plus-webphone-desktop-v1.webp')
check('only the approved Gcalls Plus capture is used', offList.length === 0,
  offList.join(', '))

/* -- 9. the five other hubs are untouched ---------------------------- */
const OTHER_HUBS = {
  SOLUTIONS_HUB: 'faf1ed4ec32c30ae',
  INTEGRATIONS_HUB: '0f91cc1b70f05254',
  INDUSTRIES_HUB: '2520886e30a54a57',
  RESOURCES_HUB: '12b683272b14d357',
  COMPANY_HUB: 'a6da9f1f6525cf03',
}
const drifted = Object.entries(OTHER_HUBS).filter(([name, want]) => {
  const i = hubsSrc.indexOf(`export const ${name}`)
  if (i < 0) return true
  const rest = hubsSrc.slice(i)
  const got = createHash('sha256')
    .update(rest.slice(0, rest.indexOf('\n}\n')))
    .digest('hex')
    .slice(0, 16)
  return got !== want
})
check('the other five hubs are byte-identical', drifted.length === 0,
  drifted.map(([n]) => n).join(', '))

/* -- 10. page-scoped layout ------------------------------------------ */
check('container is 1180px, not 1280px',
  dom.containerWidths.length > 0 && dom.containerWidths.every((w) => w <= 1180),
  `widths: ${[...new Set(dom.containerWidths)].join(', ')}`)
check('50px seam between compositions (25px per side)',
  dom.sectionPadding.slice(1).every(([t, b]) => t === 25 && b === 25),
  JSON.stringify(dom.sectionPadding))

/* -- 11. runtime ------------------------------------------------------ *
 * Chrome's implicit /favicon.ico request is made by the browser, not the page,
 * so it never reaches the `response` listener and its console message carries
 * no URL. It 404s on every route of this site, so it is excluded by shape.
 */
const pageLevel4xx = consoleErrors.filter((e) => e.startsWith('HTTP '))
const realErrors = consoleErrors.filter(
  (e) => !(pageLevel4xx.length === 0 && /failed to load resource/i.test(e) && /\b404\b/.test(e)),
)
check('no console errors', realErrors.length === 0, realErrors.join(' | ').slice(0, 200))

/* -- 12. every internal href resolves to a real page ------------------ */
const internal = [...new Set(dom.hrefs.map((a) => a.href.split('?')[0]))].filter((h) =>
  h.startsWith('/'),
)
for (const href of internal) {
  const p2 = await ctx.newPage()
  const res = await p2.goto(BASE + href, { waitUntil: 'domcontentloaded' })
  const isNotFound = await p2.evaluate(() =>
    /404|không tìm thấy/i.test(document.querySelector('h1')?.textContent ?? ''),
  )
  check(`route ${href} resolves`, (res?.status() ?? 0) < 400 && !isNotFound,
    isNotFound ? 'renders the 404 page' : `HTTP ${res?.status()}`)
  await p2.close()
}

/* -- 13. scope -------------------------------------------------------- */
let changed = []
try {
  const tracked = execFileSync('git', ['diff', '--name-only', 'HEAD'], { cwd: ROOT })
  const untracked = execFileSync(
    'git', ['ls-files', '--others', '--exclude-standard'], { cwd: ROOT },
  )
  changed = `${tracked}${untracked}`.toString().trim().split('\n').filter(Boolean)
} catch {
  changed = []
}
const ALLOWED = [
  'src/pages/ProductsHubPage.tsx',
  'src/components/products-hub/',
  'src/data/hubs.ts', // PRODUCTS_HUB only — proven byte-identical above
  'src/styles/products-hub.css',
  'src/styles/index.css',
  'scripts/',
  'docs/',
]
const stray = changed.filter(
  (f) => f.startsWith('src/') && !ALLOWED.some((p) => f.startsWith(p)),
)
check('nothing outside the products-hub scope changed', stray.length === 0,
  stray.join(', '))

/* -- 14. responsive, at the six widths the brief names ---------------- */
for (const width of [1440, 1280, 1024, 768, 390, 320]) {
  const rctx = await browser.newContext({ viewport: { width, height: 900 } })
  const rp = await rctx.newPage()
  await rp.goto(URL, { waitUntil: 'networkidle' })
  await rp.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 30))
    }
    window.scrollTo(0, 0)
  })
  await rp.waitForTimeout(300)

  const r = await rp.evaluate(() => {
    const scope = document.querySelector('.ph-page')
    const cards = Array.from(scope.querySelectorAll('li')).filter((li) =>
      li.querySelector('h3'),
    )
    const rows = new Map()
    for (const c of cards) {
      const t = Math.round(c.getBoundingClientRect().top)
      rows.set(t, [...(rows.get(t) ?? []), Math.round(c.getBoundingClientRect().height)])
    }
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      bleeding: Array.from(scope.querySelectorAll('*'))
        .filter((el) => {
          const b = el.getBoundingClientRect()
          return b.width > 0 && b.right > window.innerWidth + 1
        })
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 24)}`)
        .slice(0, 4),
      unevenRows: [...rows.values()].filter((hs) => new Set(hs).size > 1).length,
      cardCount: cards.length,
      smallTargets: Array.from(scope.querySelectorAll('a, button'))
        .filter((el) => {
          const b = el.getBoundingClientRect()
          return b.height > 0 && b.height < 44
        })
        .map((el) => `"${el.textContent?.trim().slice(0, 20)}"`)
        .slice(0, 5),
      brokenImages: Array.from(document.images).filter(
        (i) => i.complete && i.naturalWidth === 0,
      ).length,
      emptyTracks: Array.from(scope.querySelectorAll('.grid')).filter((el) => {
        const cols = getComputedStyle(el).gridTemplateColumns.split(' ').length
        const kids = Array.from(el.children).filter(
          (c) => c.getBoundingClientRect().height > 0,
        ).length
        return cols > 1 && kids > 0 && kids < cols
      }).length,
      rawShortcode: /\[\/?[a-z_]+[^\]]*\]|\{\{/.test(scope.innerText),
    }
  })

  check(`${width}px: no horizontal overflow`, !r.overflow)
  check(`${width}px: nothing bleeds past the right edge`, r.bleeding.length === 0,
    r.bleeding.join(', '))
  check(`${width}px: still exactly 3 product cards`, r.cardCount === 3, `${r.cardCount}`)
  check(`${width}px: cards in a row are equal height`, r.unevenRows === 0,
    `${r.unevenRows} uneven row(s)`)
  check(`${width}px: no empty grid track`, r.emptyTracks === 0, `${r.emptyTracks}`)
  check(`${width}px: tap targets at least 44px tall`, r.smallTargets.length === 0,
    r.smallTargets.join(' | '))
  check(`${width}px: no broken image`, r.brokenImages === 0)
  check(`${width}px: no raw shortcode`, !r.rawShortcode)

  await rctx.close()
}

await browser.close()

console.log(`\n  ${passes.length} passed, ${failures.length} failed\n`)
if (failures.length) {
  for (const f of failures) console.log(`  FAIL  ${f}`)
  process.exit(1)
}
if (consoleErrors.length) {
  console.log('  NOTE  site-wide: /favicon.ico 404s on every route. Out of scope here.\n')
}
for (const signal of [
  'PRODUCTS_HUB_CONTENT_PASS',
  'PRODUCTS_HUB_TAXONOMY_3_PASS',
  'PRODUCTS_HUB_VOICEBOT_SOLUTION_ONLY',
  'PRODUCTS_HUB_PII_ZERO',
  'PRODUCTS_HUB_FABRICATED_DATA_ZERO',
  'PRODUCTS_HUB_UI_LOCAL_PASS',
]) console.log(`  ${signal}`)
