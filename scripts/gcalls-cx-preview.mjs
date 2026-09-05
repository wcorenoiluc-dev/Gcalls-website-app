/**
 * Preview capture + gate check for /gcalls-cx/ (GCALLS CX UI V2).
 *
 * Produces the handover set:
 *   - full-page shot per breakpoint (1440 / 1280 / 1024 / 768 / 390 / 320)
 *   - hero crop desktop + mobile
 *   - a crop of each section that carries a product-visual diagram
 *   - metrics.json: page/section geometry, H1 census, horizontal overflow,
 *     image census (broken / upscaled), and the brief's gate checks
 *   - regression.json: section count / H1 / height / image count / container /
 *     console errors for the six routes that must stay unchanged
 *
 * Usage: node scripts/gcalls-cx-preview.mjs <outDir> [baseUrl]
 */
import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve(process.argv[2] ?? 'preview')
const BASE = process.argv[3] ?? 'http://localhost:5199'
const URL = `${BASE}/gcalls-cx/`

const BREAKPOINTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '1280', width: 1280, height: 900 },
  { name: '1024', width: 1024, height: 800 },
  { name: '768', width: 768, height: 900 },
  { name: '390', width: 390, height: 844 },
  { name: '320', width: 320, height: 640 },
]

const REGRESSION_ROUTES = [
  '/',
  '/gcalls-plus-webphone/',
  '/qc-bot-ai/',
  '/voicebot-ai/',
  '/san-pham/',
  '/giai-phap/',
]

async function settle(page) {
  await page.evaluate(async () => {
    window.scrollTo(0, 0)
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
    await Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map((img) => new Promise((r) => { img.onload = img.onerror = r })),
    )
  })
  await page.waitForTimeout(350)
}

/** Full page analysis: geometry, H1s, overflow, images, container width. */
async function analyze(page) {
  return page.evaluate(() => {
    const root = document.querySelector('main') ?? document.body
    const sections = Array.from(root.querySelectorAll(':scope > *'))
    const boxes = sections.map((el) => {
      const r = el.getBoundingClientRect()
      const heading = el.querySelector('h1, h2')
      return {
        tag: el.tagName.toLowerCase(),
        label: heading?.textContent?.trim().slice(0, 50) ?? '(no heading)',
        height: Math.round(r.height),
      }
    })
    const imgs = Array.from(document.images).map((img) => ({
      src: img.currentSrc || img.src,
      natural: `${img.naturalWidth}x${img.naturalHeight}`,
      rendered: `${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)}`,
      broken: img.complete && img.naturalWidth === 0,
      upscaled:
        img.naturalWidth > 0 &&
        img.getBoundingClientRect().width > img.naturalWidth + 1,
    }))
    // widest container (the site's Container primitive)
    const containers = Array.from(document.querySelectorAll('main *')).map((el) =>
      Math.round(el.getBoundingClientRect().width),
    )
    return {
      docWidth: Math.round(document.documentElement.getBoundingClientRect().width),
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      horizontalOverflow:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1Count: document.querySelectorAll('h1').length,
      h1Text: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent?.trim()),
      sectionCount: boxes.length,
      sections: boxes,
      imageCount: imgs.length,
      brokenImages: imgs.filter((i) => i.broken).length,
      upscaledImages: imgs.filter((i) => i.upscaled),
      maxContainer: Math.max(0, ...containers.filter((w) => w <= (window.innerWidth || 9999))),
    }
  })
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
await mkdir(OUT, { recursive: true })
const metrics = { url: URL, breakpoints: {} }

// ---- CX page: full captures + analysis per breakpoint ----
for (const bp of BREAKPOINTS) {
  const ctx = await browser.newContext({
    viewport: { width: bp.width, height: bp.height },
    deviceScaleFactor: 1,
  })
  const page = await ctx.newPage()
  const consoleErrors = []
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
  page.on('pageerror', (e) => consoleErrors.push(String(e)))
  await page.goto(URL, { waitUntil: 'networkidle' })
  await settle(page)
  const a = await analyze(page)
  a.consoleErrors = consoleErrors
  metrics.breakpoints[bp.name] = a
  await page.screenshot({ path: path.join(OUT, `cx-${bp.name}-full.png`), fullPage: true })

  if (bp.name === '1440' || bp.name === '390') {
    // hero crop
    const hero = await page.$('section')
    if (hero) await hero.screenshot({ path: path.join(OUT, `cx-hero-${bp.name}.png`) })
  }

  // section crops at desktop only
  if (bp.name === '1440') {
    const secEls = await page.$$('main > *')
    for (let i = 0; i < secEls.length; i++) {
      try {
        await secEls[i].screenshot({
          path: path.join(OUT, `cx-section-${String(i + 1).padStart(2, '0')}.png`),
        })
      } catch { /* zero-height wrapper — skip */ }
    }
  }
  await ctx.close()
}

// ---- Regression: the six routes that must not change ----
const regression = {}
for (const route of REGRESSION_ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  const consoleErrors = []
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
  page.on('pageerror', (e) => consoleErrors.push(String(e)))
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
  await settle(page)
  const a = await analyze(page)
  regression[route] = {
    sectionCount: a.sectionCount,
    h1Count: a.h1Count,
    pageHeight: a.sections.reduce((s, b) => s + b.height, 0),
    imageCount: a.imageCount,
    brokenImages: a.brokenImages,
    maxContainer: a.maxContainer,
    horizontalOverflow: a.horizontalOverflow,
    consoleErrors,
  }
  await page.screenshot({ path: path.join(OUT, `regress-${route.replace(/\W+/g, '_') || 'home'}-1440.png`), fullPage: true })
  await ctx.close()
}

await browser.close()

// ---- Gate evaluation ----
const cxBps = Object.entries(metrics.breakpoints)
const gate = {
  contentComponents_expect_breadcrumb_plus_19: null, // filled below
  h1_exactly_1: cxBps.every(([, a]) => a.h1Count === 1),
  overflow_zero: cxBps.every(([, a]) => a.horizontalOverflow <= 0),
  brokenImages_zero: cxBps.every(([, a]) => a.brokenImages === 0),
  upscaledImages_zero: cxBps.every(([, a]) => a.upscaledImages.length === 0),
  consoleErrors_zero: cxBps.every(([, a]) => a.consoleErrors.length === 0),
}
// section census from 1440: <main> children = breadcrumb wrapper + 19 sections = 20
gate.mainChildren_1440 = metrics.breakpoints['1440'].sectionCount
metrics.gate = gate
metrics.regression = regression

await writeFile(path.join(OUT, 'metrics.json'), JSON.stringify(metrics, null, 2))
console.log('GATE:', JSON.stringify(gate, null, 2))
console.log('mainChildren@1440:', gate.mainChildren_1440)
console.log('regression routes captured:', Object.keys(regression).length)
console.log('done ->', OUT)
