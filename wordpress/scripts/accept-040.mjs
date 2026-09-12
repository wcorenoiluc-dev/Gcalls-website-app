#!/usr/bin/env node
/**
 * GCALLS-040 acceptance — the eighteen canonical routes, against a WordPress
 * that was installed from the ZIPs, with real Elementor rendering the home page.
 *
 * The route list is written out in full and the check count is derived from it.
 * GCALLS-039 reported "65/65", a number that silently encoded a shorter list;
 * anything derived from a total rather than from the list hides what was missed.
 */
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-core'

const BASE = process.env.GCALLS_BASE || 'http://127.0.0.1:9410'
const SHOTS = process.env.GCALLS_SHOTS || '/tmp/rc40-shots'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const ALL_ROUTES = [
  { url: '/', group: 'home' },
  { url: '/gcalls-plus-webphone/', group: 'product' },
  { url: '/gcalls-cx/', group: 'product' },
  { url: '/voicebot-ai/', group: 'product' },
  { url: '/qc-bot-ai/', group: 'product' },
  { url: '/san-pham/', group: 'batch1-overview' },
  { url: '/giai-phap/', group: 'batch1-overview' },
  { url: '/lien-he/', group: 'batch1-contact' },
  { url: '/tong-dai-quoc-te/', group: 'solution-detail' },
  { url: '/tong-dai-tich-hop-crm/', group: 'solution-detail' },
  { url: '/tong-dai-tich-hop-helpdesk/', group: 'solution-detail' },
  { url: '/tong-dai-tich-hop-pos/', group: 'solution-detail' },
  { url: '/tich-hop/', group: 'batch2' },
  { url: '/tich-hop/freshdesk/', group: 'batch2' },
  { url: '/tich-hop/hubspot/', group: 'batch2' },
  { url: '/tich-hop/salesforce/', group: 'batch2' },
  { url: '/tich-hop/zendesk/', group: 'batch2' },
  { url: '/tich-hop/zoho-crm/', group: 'batch2' },
]
const WIDTHS = process.env.GCALLS_WIDTHS
  ? process.env.GCALLS_WIDTHS.split(',').map(Number)
  : [1440, 1024, 768, 390, 320]

/* GCALLS-044 extends the matrix from the 18 P0 routes to the whole non-blog
 * inventory. The extra routes are appended rather than replacing the list, so
 * the P0 set stays exactly what earlier checkpoints measured. */
const EXTRA_ROUTES = [
  { url: '/nganh/', group: 'industry-overview' },
  { url: '/nganh/giao-duc/', group: 'industry' },
  { url: '/nganh/tai-chinh/', group: 'industry' },
  { url: '/nganh/bao-hiem/', group: 'industry' },
  { url: '/nganh/bat-dong-san/', group: 'industry' },
  { url: '/nganh/thuong-mai-dien-tu/', group: 'industry' },
  { url: '/nganh/bpo/', group: 'industry' },
  { url: '/tai-nguyen/', group: 'resource-overview' },
  { url: '/tai-nguyen/guides/', group: 'resource' },
  { url: '/tai-nguyen/ebook/', group: 'resource' },
  { url: '/tai-nguyen/case-studies/', group: 'resource' },
  { url: '/tai-nguyen/glossary/', group: 'resource' },
  { url: '/tai-nguyen/faq/', group: 'resource' },
  { url: '/cong-ty/', group: 'company-overview' },
  { url: '/cong-ty/khach-hang/', group: 'company' },
  { url: '/cong-ty/doi-tac/', group: 'company' },
  { url: '/bang-gia/', group: 'pricing' },
  { url: '/referral/', group: 'referral' },
  { url: '/uoc-tinh-chi-phi/', group: 'tool' },
]
if (process.env.GCALLS_ALL) ALL_ROUTES.push(...EXTRA_ROUTES)

const ROUTES = process.env.GCALLS_ROUTES
  ? ALL_ROUTES.filter((r) => process.env.GCALLS_ROUTES.split(',').includes(r.url))
  : ALL_ROUTES

fs.mkdirSync(SHOTS, { recursive: true })
const slug = (u) => (u === '/' ? 'home' : u.replace(/^\/|\/$/g, '').replace(/\//g, '-'))

const browser = await chromium.launch({ executablePath: CHROME })
const results = []

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
    const page = await ctx.newPage()

    /*
     * Acceptance must not depend on a third-party CDN being reachable.
     * The theme pulls Open Sans and DM Mono from fonts.googleapis.com, and
     * `networkidle` waits for them — so a slow or suspended network turned a
     * passing page into a 60s timeout that looked like a page fault. The fonts
     * declare real fallbacks, and none of the gates measure typeface, so the
     * requests are aborted and the page is judged on what this release ships.
     */
    await page.route('**://*', (route) => {
      const host = new URL(route.request().url()).hostname
      return /^(127\.0\.0\.1|localhost)$/.test(host) ? route.continue() : route.abort()
    })
    const consoleErrors = []
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)) })
    page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + String(e).slice(0, 200)))

    const resp = await page.goto(BASE + route.url, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(300)

    const probe = await page.evaluate(() => {
      const html = document.documentElement.outerHTML
      const h1s = [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()).filter(Boolean)

      const overflow = Math.max(document.documentElement.scrollWidth - document.documentElement.clientWidth, 0)
      const wideEls = overflow > 1
        ? [...document.querySelectorAll('body *')]
            .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
            .slice(0, 4).map((el) => (el.tagName + '.' + (el.className || '')).slice(0, 90))
        : []

      const brokenImgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src)

      const emptyGrids = [...document.querySelectorAll('div,ul,section')].filter((el) => {
        const cs = getComputedStyle(el)
        if (cs.display !== 'grid' && cs.display !== 'flex') return false
        if (el.children.length > 0) return false
        return el.getBoundingClientRect().height > 0 || (el.className || '').includes('grid')
      }).slice(0, 5).map((el) => (el.tagName + '.' + (el.className || '')).slice(0, 90))

      const orphans = [...document.querySelectorAll('h2,h3')].filter((h) => {
        const sec = h.closest('section, .gc-page__section, .gcalls-product__section, .elementor-top-section')
        if (!sec) return false
        return sec.innerText.replace(h.textContent, '').trim().length === 0
      }).slice(0, 5).map((h) => h.textContent.trim().slice(0, 60))

      const finals = document.querySelectorAll('.gcalls-product__final, .gcalls-cp__cta').length

      /* GCALLS-042 §G: nothing may be disabled except while submitting. The
       * placeholder form shipped a <fieldset disabled>, which looked like a
       * form and could not be typed into; this fails a route for it. */
      const disabled = [...document.querySelectorAll('input:disabled, textarea:disabled, select:disabled, fieldset:disabled')]
        .filter((el) => !el.closest('[data-submitting]'))
        .slice(0, 4)
        .map((el) => (el.tagName + '.' + (el.className || '')).slice(0, 60))

      /* Home page geometry: the SEEN gap between two adjacent top sections. */
      const tops = [...document.querySelectorAll('.elementor-top-section')]
      const seams = []
      for (let i = 1; i < tops.length; i++) {
        const prev = tops[i - 1].getBoundingClientRect()
        const cur = tops[i].getBoundingClientRect()
        seams.push(Math.round(cur.top - prev.bottom))
      }
      // The visible seam is the whitespace between the CONTENT of two
      // sections, which is each section's padding plus any gap between boxes.
      const contentSeams = []
      for (let i = 1; i < tops.length; i++) {
        const a = tops[i - 1]
        const b = tops[i]
        const ac = a.lastElementChild?.getBoundingClientRect() ?? a.getBoundingClientRect()
        const bc = b.firstElementChild?.getBoundingClientRect() ?? b.getBoundingClientRect()
        contentSeams.push(Math.round(bc.top - ac.bottom))
      }

      const hero = document.querySelector('.gc-hero') || tops[0]
      let heroClipped = false
      if (hero) {
        const r = hero.getBoundingClientRect()
        heroClipped = r.right > document.documentElement.clientWidth + 1 || r.left < -1
      }

      return {
        h1s, overflow, wideEls, brokenImgs, emptyGrids, orphans, finals, disabled,
        rawShortcode: html.match(/\[gcalls_[a-z_]+/g) || [],
        phpErr: (html.match(/(Fatal error|Warning:|Notice:|Deprecated:)/g) || []).slice(0, 3),
        topSections: tops.length,
        innerSections: document.querySelectorAll('.elementor-inner-section').length,
        seams, contentSeams, heroClipped,
        ecoProducts: document.querySelectorAll('.gc-eco-group--product .gc-eco-card, .gc-eco-card').length,
        mockups: [...document.querySelectorAll('[data-gcalls-mock]')].map((m) => m.dataset.gcallsMock),
        imgCount: document.images.length,
        html,
        text: document.body.innerText,
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
      noDuplicateFinalCta: probe.finals <= 1,
      noDisabledInputs: probe.disabled.length === 0,
    }
    if (route.group === 'home') {
      checks.thirteenSections = probe.topSections === 13
      checks.heroNotClipped = !probe.heroClipped
    }

    const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k)
    results.push({
      route: route.url, group: route.group, width, status: resp && resp.status(),
      verdict: failed.length ? 'FAIL' : 'PASS', failed,
      h1s: probe.h1s, overflow: probe.overflow, wideEls: probe.wideEls,
      brokenImgs: probe.brokenImgs, emptyGrids: probe.emptyGrids, orphans: probe.orphans,
      finals: probe.finals, disabled: probe.disabled, consoleErrors, topSections: probe.topSections,
      innerSections: probe.innerSections, seams: probe.seams, contentSeams: probe.contentSeams,
      mockups: probe.mockups, imgCount: probe.imgCount,
    })

    if (width === 1440 || width === 390) {
      await page.screenshot({
        path: path.join(SHOTS, `rc40-${slug(route.url)}-${width}.png`),
        fullPage: width === 1440,
      })
    }
    if (width === 1440) {
      fs.writeFileSync(path.join(SHOTS, `html-${slug(route.url)}.html`), probe.html)
      fs.writeFileSync(path.join(SHOTS, `text-${slug(route.url)}.txt`), probe.text)
    }
    await ctx.close()
  }
  process.stdout.write('.')
}
await browser.close()

const outFile = process.env.GCALLS_ROUTES ? 'acceptance-040-retry.json' : 'acceptance-040.json'
fs.writeFileSync(path.join(SHOTS, outFile), JSON.stringify(results, null, 1))

const fails = results.filter((r) => r.verdict === 'FAIL')
console.log(`\n\nroutes ${ROUTES.length} x breakpoints ${WIDTHS.length} = ${ROUTES.length * WIDTHS.length} checks`)
console.log(`${results.length - fails.length}/${results.length} PASS`)
for (const f of fails) {
  console.log(`FAIL ${f.route} @${f.width}: ${f.failed.join(', ')}`)
  if (f.failed.includes('oneH1')) console.log(`      h1s=${JSON.stringify(f.h1s)}`)
  if (f.failed.includes('noOverflow')) console.log(`      overflow=${f.overflow}px ${JSON.stringify(f.wideEls)}`)
  if (f.failed.includes('noEmptyGrid')) console.log(`      grids=${JSON.stringify(f.emptyGrids)}`)
  if (f.failed.includes('noHeadingOrphan')) console.log(`      orphans=${JSON.stringify(f.orphans)}`)
  if (f.failed.includes('noConsoleError')) console.log(`      console=${JSON.stringify(f.consoleErrors.slice(0, 2))}`)
  if (f.failed.includes('noBrokenImg')) console.log(`      imgs=${JSON.stringify(f.brokenImgs)}`)
  if (f.failed.includes('thirteenSections')) console.log(`      topSections=${f.topSections}`)
  if (f.failed.includes('noDisabledInputs')) console.log(`      disabled=${JSON.stringify(f.disabled)}`)
}
const home = results.filter((r) => r.group === 'home')
for (const h of home) {
  console.log(`home @${h.width}: sections=${h.topSections} inner=${h.innerSections} seams=${JSON.stringify(h.contentSeams)}`)
}
