/**
 * Industries hub (/nganh/) — browser QA + route verification + capture.
 * System Chrome via playwright-core. Dev server must be up on :5213.
 *   node scripts/industries-hub-qa-capture.mjs
 */
import { chromium } from 'playwright-core'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'

const BASE = 'http://127.0.0.1:5213'
const OUT = path.resolve('docs/content-review/gcalls-industries-hub-ui-v2')
const SHOTS = path.join(OUT, 'screenshots')
const BREAKPOINTS = [1440, 1280, 1024, 768, 390, 320]

const CHILD_ROUTES = {
  'Giáo dục': '/nganh/giao-duc/',
  'Tài chính': '/nganh/tai-chinh/',
  'Bảo hiểm': '/nganh/bao-hiem/',
  'Bất động sản': '/nganh/bat-dong-san/',
  'Thương mại điện tử': '/nganh/thuong-mai-dien-tu/',
  'BPO': '/nganh/bpo/',
}
const EXPECTED_TAGS = {
  'Giáo dục': ['Gcalls Plus', 'Tích hợp CRM'],
  'Tài chính': ['Gcalls Plus', 'QA QC Center'],
  'Bảo hiểm': ['Gcalls Plus', 'QA QC Center'],
  'Bất động sản': ['Gcalls Plus', 'Tích hợp CRM'],
  'Thương mại điện tử': ['Tích hợp POS', 'Gcalls CX'],
  'BPO': ['Gcalls CX', 'QA QC Center'],
}
const REGRESSION = ['/', '/san-pham/', '/giai-phap/', '/tich-hop/', '/tai-nguyen/', '/cong-ty/',
  ...Object.values(CHILD_ROUTES)]

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((res) => { let y = 0; const t = setInterval(() => { window.scrollBy(0, 500); y += 500; if (y >= document.body.scrollHeight) { clearInterval(t); res() } }, 50) })
  })
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300)
}

async function probe(page) {
  return page.evaluate(() => {
    const main = document.querySelector('main#main-content') || document.querySelector('main') || document.body
    const h1s = [...document.querySelectorAll('h1')]
    const container = main.querySelector('.mx-auto')
    const cardsList = main.querySelector('section[aria-labelledby$="-cards"] ul')
    const cardEls = cardsList ? [...cardsList.querySelectorAll(':scope > li')] : []
    const cards = cardEls.map((li) => ({
      title: (li.querySelector('h3')?.textContent || '').trim(),
      tags: [...li.querySelectorAll('ul li')].map((t) => t.textContent.trim()),
      cta: li.querySelector('a')?.getAttribute('href') || '',
    }))
    return {
      h1Count: h1s.length,
      h1Text: h1s.map((h) => h.textContent.trim()),
      containerWidth: container ? Math.round(container.getBoundingClientRect().width) : null,
      cards,
      imageCount: document.querySelectorAll('img').length,
      brokenImages: [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length,
      hashHrefs: [...document.querySelectorAll('a[href="#"]')].length,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      pageHeight: Math.round(document.body.scrollHeight),
      sectionCount: main.querySelectorAll('section').length,
      rawShortcode: /\[(?:\/)?[a-z_]+[^\]]*\]/i.test(document.body.innerText),
    }
  })
}

async function main() {
  await rm(SHOTS, { recursive: true, force: true }); await mkdir(SHOTS, { recursive: true })
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const qa = { url: `${BASE}/nganh/`, breakpoints: {} }

  for (const bp of BREAKPOINTS) {
    const ctx = await browser.newContext({ viewport: { width: bp, height: 900 }, deviceScaleFactor: 2 })
    const page = await ctx.newPage()
    const consoleErrors = []
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
    page.on('pageerror', (e) => consoleErrors.push(String(e)))
    await page.goto(`${BASE}/nganh/`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
    await page.waitForTimeout(400); await autoScroll(page)
    await page.screenshot({ path: path.join(SHOTS, `nganh-${bp}.png`), fullPage: true })
    const m = await probe(page)
    qa.breakpoints[bp] = { ...m, consoleErrors }
    if (bp === 1440 || bp === 390) {
      await page.locator('section').first().screenshot({ path: path.join(SHOTS, `hero-${bp}.png`) }).catch(() => {})
    }
    if (bp === 1440 || bp === 768) {
      // The cards grid crop (3x2 desktop / 2x3 tablet)
      await page.locator('section[aria-labelledby$="-cards"] ul').first().screenshot({ path: path.join(SHOTS, `grid-${bp}.png`) }).catch(() => {})
    }
    await ctx.close()
  }
  await writeFile(path.join(OUT, 'qa-report.json'), JSON.stringify(qa, null, 2))

  // Route verification: each child route → status 200 + one H1
  const routes = { note: 'Each industry child route loaded directly.', results: {} }
  for (const [name, route] of Object.entries(CHILD_ROUTES)) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
    const page = await ctx.newPage()
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => null)
    await page.waitForTimeout(300)
    const h1 = await page.evaluate(() => [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()))
    const finalUrl = page.url()
    routes.results[name] = {
      route, status: resp ? resp.status() : null, finalPath: new URL(finalUrl).pathname,
      redirectedAway: !finalUrl.endsWith(route), h1Count: h1.length, h1: h1[0] || null,
    }
    await ctx.close()
  }
  await writeFile(path.join(OUT, 'route-verification.json'), JSON.stringify({ ...routes, expectedTags: EXPECTED_TAGS }, null, 2))

  // Regression metrics
  const reg = { base_sha: '9c562e7', note: 'Only /nganh/ files changed vs base; other routes are byte-identical. Live metrics are a sanity check.', routes: {} }
  for (const route of REGRESSION) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()
    const errs = []
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
    page.on('pageerror', (e) => errs.push(String(e)))
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
    await page.waitForTimeout(250); await autoScroll(page)
    const m = await probe(page)
    reg.routes[route] = { sectionCount: m.sectionCount, h1Count: m.h1Count, containerWidth: m.containerWidth, imageCount: m.imageCount, brokenImages: m.brokenImages, overflow: m.overflow, pageHeight: m.pageHeight, consoleErrors: errs }
    await ctx.close()
  }
  await writeFile(path.join(OUT, 'regression.json'), JSON.stringify(reg, null, 2))

  await browser.close()
  console.log('Industries hub QA + capture complete →', OUT)
}
main().catch((e) => { console.error(e); process.exit(1) })
