/**
 * Resources Hub — audit + preview + regression capture for /tai-nguyen/.
 * Real Chrome via playwright-core. Local only.
 *
 * Usage: node scripts/resources-hub-preview.mjs <outDir> [baseUrl] [mode]
 *   mode = "audit" (child routes: status/H1/sections) | "preview" (hub shots + regression)
 */
import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve(process.argv[2] ?? 'preview')
const BASE = process.argv[3] ?? 'http://127.0.0.1:5214'
const MODE = process.argv[4] ?? 'preview'
await mkdir(OUT, { recursive: true })

const CHILD = ['/blog/', '/tai-nguyen/guides/', '/tai-nguyen/case-studies/', '/tai-nguyen/ebook/', '/tai-nguyen/glossary/', '/tai-nguyen/faq/']
const REGRESSION = ['/', '/san-pham/', '/giai-phap/', '/tich-hop/', '/nganh/', '/cong-ty/', ...CHILD]
const BREAKPOINTS = [1440, 1280, 1024, 768, 390, 320]

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const probe = async (page, url) => {
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(400)
  const m = await page.evaluate(() => {
    const main = document.querySelector('main') || document.body
    const imgs = [...document.querySelectorAll('img')]
    return {
      h1Count: document.querySelectorAll('h1').length,
      h1Text: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      sectionCount: main.querySelectorAll('section').length,
      mainChildren: main.children.length,
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      brokenImages: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
      upscaled: imgs.filter((i) => i.naturalWidth > 0 && i.clientWidth > i.naturalWidth + 1).length,
      links: [...main.querySelectorAll('a')].map((a) => ({ href: a.getAttribute('href'), name: (a.getAttribute('aria-label') || a.textContent).trim() })),
    }
  })
  return { url, status: resp.status(), overflow: m.scrollW > m.clientW + 1 ? m.scrollW - m.clientW : 0, errors: [...new Set(errors)], ...m }
}

const result = { base: BASE, mode: MODE }

if (MODE === 'audit') {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  result.childRoutes = []
  for (const r of CHILD) {
    const page = await ctx.newPage()
    result.childRoutes.push(await probe(page, BASE + r))
    await page.close()
  }
} else {
  // hub full-page shots at each breakpoint + card-grid crop
  result.hub = {}
  for (const w of BREAKPOINTS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } })
    const page = await ctx.newPage()
    const info = await probe(page, BASE + '/tai-nguyen/')
    await page.screenshot({ path: path.join(OUT, `hub-${w}-full.png`), fullPage: true })
    result.hub[w] = info
    if (w === 1440 || w === 768 || w === 390) {
      const grid = await page.$('[data-cards-grid]')
      if (grid) await grid.screenshot({ path: path.join(OUT, `hub-cards-${w}.png`) })
    }
    await page.close(); await ctx.close()
  }
  // regression
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  result.regression = []
  for (const r of REGRESSION) {
    const page = await ctx.newPage()
    const info = await probe(page, BASE + r)
    result.regression.push({ route: r, status: info.status, h1: info.h1Count, sections: info.sectionCount, overflow: info.overflow, broken: info.brokenImages, errors: info.errors.length })
    await page.close()
  }
  await ctx.close()
}

await browser.close()
await writeFile(path.join(OUT, `${MODE}.json`), JSON.stringify(result, null, 2))
console.log(JSON.stringify(result.childRoutes ?? result.regression ?? result.hub, null, 1).slice(0, 3000))
console.log(`\n${MODE} -> ${OUT}`)
