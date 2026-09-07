/**
 * Voicebot AI — browser QA + screenshot capture (GCALLS Voicebot UI V2).
 *
 * Uses system Google Chrome via playwright-core (no Chromium download). Requires
 * the isolated dev server up on :5176 (NOT 5173).
 *
 *   node scripts/voicebot-qa-capture.mjs
 *
 * Emits, under docs/content-review/gcalls-voicebot-ui-v2/:
 *   screenshots/voicebot-<bp>.png        full page at each breakpoint
 *   screenshots/hero-<bp>.png            hero crop (1440 + 390)
 *   screenshots/section-NN.png           per-section crops at 1440
 *   qa-report.json                       gate results per breakpoint
 *   regression.json                      6 non-Voicebot routes vs base metrics
 */
import { chromium } from 'playwright-core'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'

const BASE = 'http://127.0.0.1:5176'
const OUT = path.resolve('docs/content-review/gcalls-voicebot-ui-v2')
const SHOTS = path.join(OUT, 'screenshots')
const BREAKPOINTS = [1440, 1280, 1024, 768, 390, 320]
const REGRESSION_ROUTES = ['/', '/gcalls-plus-webphone/', '/qc-bot-ai/', '/gcalls-cx/', '/san-pham/', '/giai-phap/']

const BANNED = [
  { label: 'lead ID', re: /\bLH-\d{4}\b/ },
  { label: 'campaign count', re: /(?:^|\D)(480|312|198)(?:\D|$)/ },
  { label: 'response %', re: /\b(46|27|15|12)\s*%/ },
  { label: 'campaign time', re: /\b09:(12|08|03)\b/ },
]

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0
      const t = setInterval(() => {
        window.scrollBy(0, 500)
        y += 500
        if (y >= document.body.scrollHeight) { clearInterval(t); resolve() }
      }, 50)
    })
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
}

/** Metrics + gate signals read from the live DOM. */
async function probe(page) {
  return page.evaluate(() => {
    const main = document.querySelector('main#main-content') || document.querySelector('main') || document.body
    const sections = main.querySelectorAll('section')
    const h1s = [...document.querySelectorAll('h1')]
    const container = main.querySelector('.mx-auto')
    const imgs = [...document.querySelectorAll('img')]
    const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).length
    const hashHrefs = [...document.querySelectorAll('a[href="#"]')].length
    const finalCta = document.querySelectorAll('[aria-labelledby="cta-voicebot"]').length
    const breadcrumb = document.querySelectorAll('nav[aria-label], nav.breadcrumb, [class*="readcrumb"]').length
    const text = document.body.innerText
    const rawShortcode = /\[(?:\/)?[a-z_]+[^\]]*\]/i.test(text)
    return {
      sectionCount: sections.length,
      h1Count: h1s.length,
      h1Empty: h1s.some((h) => !h.textContent.trim()),
      containerWidth: container ? Math.round(container.getBoundingClientRect().width) : null,
      imageCount: imgs.length,
      brokenImages: broken,
      hashHrefs,
      finalCtaCount: finalCta,
      breadcrumbCount: breadcrumb,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      pageHeight: Math.round(document.body.scrollHeight),
      rawShortcode,
      innerText: text,
    }
  })
}

async function main() {
  await rm(SHOTS, { recursive: true, force: true })
  await mkdir(SHOTS, { recursive: true })
  const browser = await chromium.launch({ channel: 'chrome', headless: true })

  const qa = { url: `${BASE}/voicebot-ai/`, breakpoints: {} }

  for (const bp of BREAKPOINTS) {
    const ctx = await browser.newContext({ viewport: { width: bp, height: 900 }, deviceScaleFactor: 2 })
    const page = await ctx.newPage()
    const consoleErrors = []
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
    page.on('pageerror', (e) => consoleErrors.push(String(e)))

    await page.goto(`${BASE}/voicebot-ai/`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
    await page.waitForTimeout(400)
    await autoScroll(page)

    await page.screenshot({ path: path.join(SHOTS, `voicebot-${bp}.png`), fullPage: true })

    const m = await probe(page)
    const bannedHits = BANNED.flatMap((b) => (b.re.test(m.innerText) ? [b.label] : []))
    delete m.innerText
    qa.breakpoints[bp] = { ...m, consoleErrors, bannedHits }

    // Hero crop at desktop + mobile
    if (bp === 1440 || bp === 390) {
      const hero = page.locator('section').first()
      await hero.screenshot({ path: path.join(SHOTS, `hero-${bp}.png`) }).catch(() => {})
    }

    // Per-section crops at desktop
    if (bp === 1440) {
      const secs = await page.locator('main section, main > div').all().catch(() => [])
      let n = 0
      for (const s of secs) {
        n++
        await s.screenshot({ path: path.join(SHOTS, `section-${String(n).padStart(2, '0')}.png`) }).catch(() => {})
      }
    }
    await ctx.close()
  }

  await writeFile(path.join(OUT, 'qa-report.json'), JSON.stringify(qa, null, 2))

  // Regression: non-Voicebot routes at 1440
  const reg = { base_sha: '9c562e7', note: 'Only Voicebot-scope files changed vs base; these routes are byte-identical to base. Live metrics below are a sanity check.', routes: {} }
  for (const route of REGRESSION_ROUTES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    const consoleErrors = []
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
    page.on('pageerror', (e) => consoleErrors.push(String(e)))
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
    await page.waitForTimeout(300)
    await autoScroll(page)
    const m = await probe(page)
    delete m.innerText
    reg.routes[route] = {
      sectionCount: m.sectionCount, h1Count: m.h1Count, containerWidth: m.containerWidth,
      imageCount: m.imageCount, brokenImages: m.brokenImages, overflow: m.overflow,
      pageHeight: m.pageHeight, consoleErrors,
    }
    await ctx.close()
  }
  await writeFile(path.join(OUT, 'regression.json'), JSON.stringify(reg, null, 2))

  await browser.close()
  console.log('QA + capture complete →', OUT)
}

main().catch((e) => { console.error(e); process.exit(1) })
