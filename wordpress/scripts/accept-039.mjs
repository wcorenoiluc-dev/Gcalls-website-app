#!/usr/bin/env node
/**
 * GCALLS-039 acceptance — run against a WordPress that was installed FROM THE
 * TWO ZIPS, never against mounted source.
 *
 * Every check here is one of the brief's, and each returns evidence rather than
 * a boolean, so a FAIL says what it saw.
 */
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-core'

const BASE = process.env.GCALLS_BASE || 'http://127.0.0.1:9400'
const SHOTS = process.env.GCALLS_SHOTS || '/tmp/rc-shots'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const ALL_ROUTES = [
  '/gcalls-plus-webphone/', '/gcalls-cx/', '/voicebot-ai/', '/qc-bot-ai/',
  '/tich-hop/', '/tich-hop/freshdesk/', '/tich-hop/hubspot/', '/tich-hop/salesforce/',
  '/tich-hop/zendesk/', '/tich-hop/zoho-crm/',
  '/san-pham/', '/giai-phap/', '/lien-he/',
]
/* A single route can be re-run on its own: this local PHP-WASM server returns
   an occasional 503 under a six-worker parallel load, which is a property of
   the harness and not of the page, and must be retried rather than recorded. */
const ROUTES = process.env.GCALLS_ROUTES ? process.env.GCALLS_ROUTES.split(',') : ALL_ROUTES
const WIDTHS = [1440, 1024, 768, 390, 320]

fs.mkdirSync(SHOTS, { recursive: true })

const browser = await chromium.launch({ executablePath: CHROME })
const results = []

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    const consoleErrors = []
    const failedRequests = []
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)) })
    page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + String(e).slice(0, 200)))
    page.on('requestfailed', (r) => failedRequests.push(r.url().slice(0, 160)))

    const resp = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(250)

    const probe = await page.evaluate(() => {
      const txt = document.body.innerText
      const html = document.documentElement.outerHTML

      const h1s = [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()).filter((t) => t.length)

      // Horizontal overflow: the document must not be wider than the viewport.
      const overflow = Math.max(
        document.documentElement.scrollWidth - document.documentElement.clientWidth, 0)
      const wideEls = overflow > 1
        ? [...document.querySelectorAll('body *')]
            .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
            .slice(0, 4)
            .map((el) => (el.tagName + '.' + (el.className || '')).slice(0, 80))
        : []

      const brokenImgs = [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src)

      // An empty grid track: a grid/flex container that renders no children.
      const emptyGrids = [...document.querySelectorAll('div,ul,section')]
        .filter((el) => {
          const cs = getComputedStyle(el)
          if (cs.display !== 'grid' && cs.display !== 'flex') return false
          if (el.children.length > 0) return false
          return el.getBoundingClientRect().height > 0 || (el.className || '').includes('grid')
        })
        .slice(0, 5)
        .map((el) => (el.tagName + '.' + (el.className || '')).slice(0, 80))

      // A heading orphan: a heading whose section contributes nothing after it.
      const orphans = [...document.querySelectorAll('h2,h3')]
        .filter((h) => {
          const sec = h.closest('section, .gc-page__section, .gcalls-product__section')
          if (!sec) return false
          const after = sec.innerText.replace(h.textContent, '').trim()
          return after.length === 0
        })
        .slice(0, 5)
        .map((h) => h.textContent.trim().slice(0, 60))

      const finals = document.querySelectorAll('.gcalls-product__final, .gc-cta').length

      const heroCta = [...document.querySelectorAll('a[href*="intent"], a[data-intent], .gcalls-product__hero a')]
        .slice(0, 3)
        .map((a) => a.getAttribute('href') || '')

      return {
        h1s, overflow, wideEls, brokenImgs, emptyGrids, orphans, finals, heroCta,
        rawShortcode: (txt.match(/\[gcalls_[a-z_]+/g) || []),
        phpErr: (html.match(/(Fatal error|Warning:|Notice:|Deprecated:)/g) || []).slice(0, 3),
        imgCount: document.images.length,
        text: txt,
        html,
      }
    })

    const checks = {
      http200: resp && resp.status() === 200,
      oneH1: probe.h1s.length === 1,
      noOverflow: probe.overflow <= 1,
      noBrokenImg: probe.brokenImgs.length === 0,
      noRawShortcode: probe.rawShortcode.length === 0,
      noPhpError: probe.phpErr.length === 0,
      noConsoleError: consoleErrors.length === 0,
      noEmptyGrid: probe.emptyGrids.length === 0,
      noHeadingOrphan: probe.orphans.length === 0,
    }
    const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k)

    results.push({
      route, width, status: resp && resp.status(), verdict: failed.length ? 'FAIL' : 'PASS', failed,
      h1s: probe.h1s, overflow: probe.overflow, wideEls: probe.wideEls,
      brokenImgs: probe.brokenImgs, emptyGrids: probe.emptyGrids, orphans: probe.orphans,
      finals: probe.finals, heroCta: probe.heroCta, consoleErrors, failedRequests,
      imgCount: probe.imgCount,
    })

    if (width === 1440 || width === 390) {
      const name = 'rc' + route.replace(/\//g, '-').replace(/-$/, '') + '-' + width + '.png'
      await page.screenshot({ path: path.join(SHOTS, name), fullPage: width === 1440 })
    }
    if (width === 1440) {
      fs.writeFileSync(path.join(SHOTS, 'html' + route.replace(/\//g, '-').replace(/-$/, '') + '.html'), probe.html)
      fs.writeFileSync(path.join(SHOTS, 'text' + route.replace(/\//g, '-').replace(/-$/, '') + '.txt'), probe.text)
    }
    await ctx.close()
  }
  process.stdout.write('.')
}
await browser.close()

fs.writeFileSync(path.join(SHOTS, process.env.GCALLS_ROUTES ? 'acceptance-039-retry.json' : 'acceptance-039.json'), JSON.stringify(results, null, 1))

const fails = results.filter((r) => r.verdict === 'FAIL')
console.log(`\n\n${results.length - fails.length}/${results.length} PASS`)
for (const f of fails) {
  console.log(`FAIL ${f.route} @${f.width}: ${f.failed.join(', ')}`)
  if (f.failed.includes('oneH1')) console.log(`      h1s=${JSON.stringify(f.h1s)}`)
  if (f.failed.includes('noOverflow')) console.log(`      overflow=${f.overflow}px  ${JSON.stringify(f.wideEls)}`)
  if (f.failed.includes('noEmptyGrid')) console.log(`      grids=${JSON.stringify(f.emptyGrids)}`)
  if (f.failed.includes('noHeadingOrphan')) console.log(`      orphans=${JSON.stringify(f.orphans)}`)
  if (f.failed.includes('noConsoleError')) console.log(`      console=${JSON.stringify(f.consoleErrors.slice(0, 2))}`)
  if (f.failed.includes('noBrokenImg')) console.log(`      imgs=${JSON.stringify(f.brokenImgs)}`)
}
