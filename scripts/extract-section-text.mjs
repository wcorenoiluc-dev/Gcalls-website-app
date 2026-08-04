/**
 * Second pass: extract the real text content of each captured section, in the
 * SAME order/selection as capture-pages.mjs, and merge it into manifest.json
 * as `sections[i].heading` + `sections[i].text`. Screenshots are untouched.
 */
import { chromium } from 'playwright-core'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BASE = 'http://localhost:5173'
const OUT_DIR = path.resolve('docs/screenshots')
const MANIFEST = path.join(OUT_DIR, 'manifest.json')
const VIEWPORT = { width: 1440, height: 900 }
const MAX = Infinity // char cap per section body — image carries the rest

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 })
const page = await context.newPage()

for (const p of manifest) {
  console.log(`→ ${p.title}`)
  await page.goto(BASE + p.path, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => { })
  await page.waitForTimeout(500)

  // Same selection as capture: main direct children with height>=140 & width>=200
  const data = await page.evaluate(() => {
    const main = document.querySelector('main#main-content') || document.querySelector('main')
    if (!main) return []
    const out = []
    for (const el of main.children) {
      const r = el.getBoundingClientRect()
      if (r.height >= 140 && r.width >= 200) {
        const h = el.querySelector('h1,h2,h3')
        const eyebrow = el.querySelector('[class*="eyebrow" i],[data-eyebrow]')
        const clean = (t) => (t || '').replace(/\s+/g, ' ').trim()
        out.push({
          heading: clean(h && h.textContent),
          eyebrow: clean(eyebrow && eyebrow.textContent),
          text: clean(el.innerText),
        })
      }
    }
    return out
  })

  // Merge positionally into existing sections
  p.sections.forEach((s, i) => {
    const d = data[i] || {}
    s.heading = d.heading || s.label || ''
    s.eyebrow = d.eyebrow || ''
    let body = d.text || ''
    // Drop the leading heading text from the body to avoid duplication
    if (s.heading && body.startsWith(s.heading)) body = body.slice(s.heading.length).trim()
    if (body.length > MAX) body = body.slice(0, MAX).trim() + '…'
    s.text = body
  })
  console.log(`   ${p.sections.length} sections, ${data.length} extracted`)
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2))
await browser.close()
console.log('\nManifest updated with section text.')
