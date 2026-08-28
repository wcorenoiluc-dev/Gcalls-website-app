import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = 'docs/content-review/parity-006'
const BASE = 'https://ashernguyenxuanthuy.com'
const MISSING = [
  ['estimator', '/uoc-tinh-chi-phi/', 1440], ['blog', '/blog/', 1440],
  ['gcalls-plus', '/gcalls-plus-webphone/', 768], ['voicebot', '/voicebot-ai/', 768],
  ['qa-qc', '/qc-bot-ai/', 768], ['estimator', '/uoc-tinh-chi-phi/', 768],
  ['blog', '/blog/', 768], ['blog', '/blog/', 390],
]

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const results = []

for (const [name, route, width] of MISSING) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  const file = path.join(OUT, `${name}-${width}-wp.png`)
  try {
    // domcontentloaded rather than networkidle: the blog archive keeps a couple
    // of connections warm and never reaches idle inside the timeout.
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(2500)
    const overflow = await page.evaluate(() => {
      const bar = document.getElementById('wpadminbar')
      if (bar) bar.remove()
      return document.documentElement.scrollWidth - document.documentElement.clientWidth
    })
    await page.screenshot({ path: file, fullPage: true, timeout: 60000 })
    results.push({ route, width, overflow, ok: true })
  } catch (error) {
    results.push({ route, width, ok: false, error: String(error).split('\n')[0].slice(0, 70) })
  }
  await context.close()
}

await browser.close()
for (const r of results) {
  console.log(`  ${String(r.width).padEnd(6)}${r.route.padEnd(24)}${r.ok ? `overflow ${r.overflow}` : r.error}`)
}
console.log(`\n${results.filter(r=>r.ok).length}/${results.length} recovered`)
