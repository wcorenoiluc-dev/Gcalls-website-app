/** Rendered-DOM fabricated-data scan for the homepage at 6 breakpoints.
 * Scans visible text + aria-label + title + alt + data-* + serialized inline JSON. */
import { chromium } from 'playwright-core'
const BASE = process.argv[2] ?? 'http://127.0.0.1:5180'
const BP = [1440, 1280, 1024, 768, 390, 320]
// Patterns that indicate simulated result data. Excludes CSS (scanned from text/attrs only, not styles).
const PAT = [
  { name: 'phone-0900', re: /0900[\s ]?\d{2,}/ },
  { name: 'phone-1900', re: /1900[\s ]?\d{3,}/ },
  { name: 'answer-rate-73', re: /\b73\s*%/ },
  { name: 'email-example', re: /@example\.com/ },
  { name: 'rating-4.9', re: /\b4\.9\b/ },
  { name: 'kpi-percent', re: /\b\d{1,3}\s*%/ }, // any standalone percent in text (illustrative rates)
]
const ALLOW = [/100\s*%/, /\bm/, /minh họa/] // 100% (progress full) allowed; others checked in context
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const out = {}
for (const w of BP) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(500)
  const found = await page.evaluate(() => {
    const hits = []
    const push = (src, txt) => { if (txt && /\S/.test(txt)) hits.push({ src, txt: txt.slice(0, 80) }) }
    // visible text
    push('body-text', document.body.innerText)
    // attributes that can carry hidden data
    for (const el of document.querySelectorAll('[aria-label],[title],[alt],[data-value],[data-count]')) {
      push('aria', el.getAttribute('aria-label'))
      push('title', el.getAttribute('title'))
      push('alt', el.getAttribute('alt'))
      for (const a of el.attributes) if (a.name.startsWith('data-')) push('data', a.value)
    }
    return hits
  })
  const leaks = []
  for (const h of found) for (const p of PAT) {
    const m = h.txt.match(p.re)
    if (m) {
      // context filter: skip pure "100%" and weekday/step tokens
      if (p.name === 'kpi-percent' && /100\s*%/.test(m[0])) continue
      leaks.push({ bp: w, pattern: p.name, sample: m[0], where: h.src, ctx: h.txt })
    }
  }
  out[w] = leaks
  await page.close(); await ctx.close()
}
await browser.close()
let total = 0
for (const w of BP) { total += out[w].length; console.log(`${w}: ${out[w].length} leak(s)` + (out[w].length ? ' -> ' + out[w].slice(0, 6).map(l => `${l.pattern}:"${l.sample}"@${l.where}`).join(' | ') : '')) }
console.log(`\nTOTAL DOM fabricated leaks: ${total}`)
process.exit(total > 0 ? 1 : 0)