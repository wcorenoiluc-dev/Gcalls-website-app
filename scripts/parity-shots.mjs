import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = 'docs/content-review/parity-006'
const WIDTHS = [1440, 1024, 768, 390, 320]
const ROUTES = [
  ['home', '/'],
  ['gcalls-plus', '/gcalls-plus-webphone/'],
  ['gcalls-cx', '/gcalls-cx/'],
  ['voicebot', '/voicebot-ai/'],
  ['qa-qc', '/qc-bot-ai/'],
  ['estimator', '/uoc-tinh-chi-phi/'],
  ['blog', '/blog/'],
]
const TARGETS = [
  ['react', 'http://localhost:5173'],
  ['wp', 'https://ashernguyenxuanthuy.com'],
]

fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const results = []

for (const [target, base] of TARGETS) {
  for (const width of WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
    const page = await context.newPage()

    for (const [name, route] of ROUTES) {
      const file = path.join(OUT, `${name}-${width}-${target}.png`)
      try {
        await page.goto(base + route, { waitUntil: 'networkidle', timeout: 45000 })
        await page.waitForTimeout(900)
        const overflow = await page.evaluate(() => {
          const bar = document.getElementById('wpadminbar')
          if (bar) bar.remove()
          return document.documentElement.scrollWidth - document.documentElement.clientWidth
        })
        await page.screenshot({ path: file, fullPage: true })
        const bytes = fs.statSync(file).size
        results.push({ target, route, width, overflow, bytes, file })
      } catch (error) {
        results.push({ target, route, width, overflow: null, error: String(error).split('\n')[0] })
      }
    }

    await context.close()
  }
}

await browser.close()

const w = (s, n) => String(s).padEnd(n).slice(0, n)
console.log(`${w('TARGET',7)}${w('ROUTE',24)}${w('WIDTH',7)}${w('OVERFLOW',10)}SHOT`)
for (const r of results) {
  console.log(`${w(r.target,7)}${w(r.route,24)}${w(r.width,7)}${w(r.overflow ?? 'ERR',10)}${r.file ? path.basename(r.file) : r.error}`)
}
const bad = results.filter((r) => r.overflow === null || r.overflow > 0)
console.log(`\n${results.length} shots, ${bad.length} with overflow or error`)
fs.writeFileSync(path.join(OUT, 'parity-results.json'), JSON.stringify(results, null, 2))
