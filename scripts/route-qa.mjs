import { chromium } from 'playwright-core'

const BASE = 'https://ashernguyenxuanthuy.com'
const ROUTES = ['/', '/gcalls-plus-webphone/', '/gcalls-cx/', '/voicebot-ai/', '/qc-bot-ai/', '/uoc-tinh-chi-phi/', '/blog/']
const WIDTHS = [1440, 1024, 768, 390, 320]

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const rows = []

for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await context.newPage()
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 90)) })
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 90)))

  for (const route of ROUTES) {
    errors.length = 0
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(700)

    const r = await page.evaluate(() => {
      const bar = document.getElementById('wpadminbar')
      if (bar) bar.remove()
      const html = document.documentElement.innerHTML
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
        images: document.images.length,
        phpNotice: /(<b>Warning<\/b>|<b>Fatal error<\/b>|<b>Notice<\/b>|Deprecated:)/.test(html) ? 1 : 0,
        unrenderedShortcode: (html.match(/\[gcalls_/g) || []).length,
        h1: document.querySelectorAll('h1').length,
      }
    })

    rows.push({ width, route, ...r, jsErrors: errors.length })
  }

  await context.close()
}

await browser.close()

const w = (s, n) => String(s).padEnd(n).slice(0, n)
console.log(`${w('W', 6)}${w('ROUTE', 24)}${w('OVERFLOW', 10)}${w('BROKEN', 8)}${w('IMGS', 6)}${w('PHP', 5)}${w('SHORTCODE', 11)}${w('H1', 4)}JS`)
for (const r of rows) {
  console.log(
    `${w(r.width, 6)}${w(r.route, 24)}${w(r.overflow, 10)}${w(r.brokenImages, 8)}${w(r.images, 6)}` +
      `${w(r.phpNotice, 5)}${w(r.unrenderedShortcode, 11)}${w(r.h1, 4)}${r.jsErrors}`,
  )
}

const fails = rows.filter((r) => r.overflow > 0 || r.brokenImages > 0 || r.phpNotice > 0 || r.unrenderedShortcode > 0 || r.h1 !== 1)
console.log(`\n${rows.length} route × breakpoint checks, ${fails.length} failing`)
for (const f of fails) console.log(`  FAIL ${f.route} @ ${f.width}: overflow ${f.overflow}, broken ${f.brokenImages}, php ${f.phpNotice}, shortcode ${f.unrenderedShortcode}, h1 ${f.h1}`)
