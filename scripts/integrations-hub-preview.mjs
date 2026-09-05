/**
 * Preview + gate + route-verify + regression for /tich-hop/.
 * Usage: node scripts/integrations-hub-preview.mjs <outDir> [baseUrl]
 */
import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve(process.argv[2] ?? 'preview')
const BASE = process.argv[3] ?? 'http://127.0.0.1:5213'
const HUB_URL = `${BASE}/tich-hop/`

const BREAKPOINTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '1280', width: 1280, height: 900 },
  { name: '1024', width: 1024, height: 800 },
  { name: '768', width: 768, height: 900 },
  { name: '390', width: 390, height: 844 },
  { name: '320', width: 320, height: 640 },
]

const PLATFORM_ROUTES = [
  '/tich-hop/hubspot/',
  '/tich-hop/salesforce/',
  '/tich-hop/zoho-crm/',
  '/tich-hop/freshdesk/',
  '/tich-hop/zendesk/',
]
const REGRESSION_ROUTES = [
  '/', '/san-pham/', '/giai-phap/', '/nganh/', '/tai-nguyen/', '/cong-ty/',
  ...PLATFORM_ROUTES,
]
const BANNED = [
  'đối tác chính thức', 'certified partner', 'được chứng nhận', 'native integration',
  'one-click', 'đồng bộ toàn bộ', 'hỗ trợ mọi trường dữ liệu', 'tích hợp sẵn',
]

async function settle(page) {
  await page.evaluate(async () => {
    window.scrollTo(0, 0)
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50))
    }
    window.scrollTo(0, 0)
    await Promise.all(Array.from(document.images).filter((i) => !i.complete)
      .map((i) => new Promise((r) => { i.onload = i.onerror = r })))
  })
  await page.waitForTimeout(300)
}

async function analyze(page, platformPaths) {
  return page.evaluate((platformPaths) => {
    const main = document.querySelector('main') ?? document.body
    const boxes = Array.from(main.querySelectorAll(':scope > *')).map((el) => {
      const r = el.getBoundingClientRect()
      const h = el.querySelector('h1,h2')
      return { tag: el.tagName.toLowerCase(), label: h?.textContent?.trim().slice(0, 40) ?? '(none)', height: Math.round(r.height) }
    })
    const imgs = Array.from(document.images).map((img) => ({
      broken: img.complete && img.naturalWidth === 0,
      upscaled: img.naturalWidth > 0 && img.getBoundingClientRect().width > img.naturalWidth + 1,
    }))
    const anchors = Array.from(document.querySelectorAll('a[href]'))
    const hashLinks = anchors.filter((a) => a.getAttribute('href') === '#').length
    const platformLinks = platformPaths.filter((p) =>
      anchors.some((a) => new URL(a.href, location.origin).pathname === p))
    // count cards under CRM/Helpdesk groups by the platform links present
    const bodyText = (document.body.innerText || '').toLowerCase()
    return {
      h1Count: document.querySelectorAll('h1').length,
      h1Text: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent?.trim()),
      sectionCount: boxes.length,
      sections: boxes,
      imageCount: imgs.length,
      brokenImages: imgs.filter((i) => i.broken).length,
      upscaledImages: imgs.filter((i) => i.upscaled).length,
      hashLinks,
      platformLinksFound: platformLinks,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      maxContainer: Math.max(0, ...Array.from(main.querySelectorAll('*'))
        .map((el) => Math.round(el.getBoundingClientRect().width))
        .filter((w) => w <= (window.innerWidth || 9999))),
      bodyText,
    }
  }, platformPaths)
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
await mkdir(OUT, { recursive: true })
const metrics = { url: HUB_URL, breakpoints: {} }

for (const bp of BREAKPOINTS) {
  const ctx = await browser.newContext({ viewport: { width: bp.width, height: bp.height }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  const errs = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  page.on('pageerror', (e) => errs.push(String(e)))
  await page.goto(HUB_URL, { waitUntil: 'networkidle' })
  await settle(page)
  const a = await analyze(page, PLATFORM_ROUTES)
  a.consoleErrors = errs
  a.bannedFound = BANNED.filter((b) => a.bodyText.includes(b.toLowerCase()))
  delete a.bodyText
  metrics.breakpoints[bp.name] = a
  await page.screenshot({ path: path.join(OUT, `hub-${bp.name}-full.png`), fullPage: true })
  if (bp.name === '1440' || bp.name === '390') {
    const hero = await page.$('section')
    if (hero) await hero.screenshot({ path: path.join(OUT, `hub-hero-${bp.name}.png`) })
  }
  if (bp.name === '1440') {
    const secs = await page.$$('main > *')
    for (let i = 0; i < secs.length; i++) {
      try { await secs[i].screenshot({ path: path.join(OUT, `hub-section-${String(i + 1).padStart(2, '0')}.png`) }) } catch {}
    }
  }
  await ctx.close()
}

// Route verification
const routeVerify = {}
for (const r of [HUB_URL.replace(BASE, ""), ...PLATFORM_ROUTES]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  const errs = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  page.on('pageerror', (e) => errs.push(String(e)))
  const resp = await page.goto(`${BASE}${r}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const finalPath = new URL(page.url()).pathname
  const h1s = await page.$$eval('h1', (els) => els.map((e) => e.textContent?.trim()))
  const looks404 = await page.evaluate(() =>
    /404|không tìm thấy|not found/i.test(document.body.innerText.slice(0, 400)))
  routeVerify[r] = {
    httpStatus: resp?.status() ?? null,
    finalPath,
    noRedirect: finalPath === r,
    h1Count: h1s.length,
    h1: h1s[0] ?? null,
    looks404,
    consoleErrors: errs.length,
  }
  await ctx.close()
}

// Regression
const regression = {}
for (const r of REGRESSION_ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  const errs = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  page.on('pageerror', (e) => errs.push(String(e)))
  await page.goto(`${BASE}${r}`, { waitUntil: 'networkidle' })
  await settle(page)
  const a = await analyze(page, PLATFORM_ROUTES)
  regression[r] = {
    sectionCount: a.sectionCount, h1Count: a.h1Count,
    pageHeight: a.sections.reduce((s, b) => s + b.height, 0),
    imageCount: a.imageCount, brokenImages: a.brokenImages,
    maxContainer: a.maxContainer, horizontalOverflow: a.horizontalOverflow,
    consoleErrors: errs.length,
  }
  await ctx.close()
}

await browser.close()

const bps = Object.entries(metrics.breakpoints)
const gate = {
  h1_exactly_1: bps.every(([, a]) => a.h1Count === 1),
  overflow_zero: bps.every(([, a]) => a.horizontalOverflow <= 0),
  brokenImages_zero: bps.every(([, a]) => a.brokenImages === 0),
  upscaledImages_zero: bps.every(([, a]) => a.upscaledImages === 0),
  hashLinks_zero: bps.every(([, a]) => a.hashLinks === 0),
  platformLinks_5: metrics.breakpoints['1440'].platformLinksFound.length === 5,
  bannedPhrases_zero: bps.every(([, a]) => a.bannedFound.length === 0),
  consoleErrors_zero: bps.every(([, a]) => a.consoleErrors.length === 0),
  mainChildren_1440: metrics.breakpoints['1440'].sectionCount,
}
const routesOk = Object.values(routeVerify).every(
  (v) => v.noRedirect && v.h1Count === 1 && !v.looks404)
metrics.gate = gate
metrics.routeVerify = routeVerify
metrics.routesAllPass = routesOk
metrics.regression = regression

await writeFile(path.join(OUT, 'metrics.json'), JSON.stringify(metrics, null, 2))
console.log('GATE:', JSON.stringify(gate, null, 2))
console.log('ROUTES all pass:', routesOk)
for (const [r, v] of Object.entries(routeVerify))
  console.log(`  ${v.noRedirect && v.h1Count === 1 && !v.looks404 ? 'OK ' : 'FAIL'} ${r} h1=${v.h1Count} redirect=${!v.noRedirect} 404=${v.looks404} h1="${v.h1}"`)
console.log('done ->', OUT)
