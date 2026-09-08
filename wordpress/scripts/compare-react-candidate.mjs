#!/usr/bin/env node
/**
 * GCALLS-036B — React reference vs the WordPress candidate preview.
 *
 * Not a pixel diff. The comparison is on the axes the brief names: section
 * count, component type, layout direction, grid columns, icon presence,
 * mockup placement, CTA count, page height and worst gap.
 */
import { chromium } from 'playwright-core'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const REACT = process.env.REACT_BASE || 'http://localhost:5174'
const PREVIEW = path.resolve('docs/content-review/gcalls-036b/preview')
const WIDTHS = [1440, 390]
const ROUTES = [
  ['gcalls-plus', '/gcalls-plus-webphone/', 'product-gcalls-plus.html'],
  ['cx', '/gcalls-cx/', 'product-cx.html'],
  ['voicebot', '/voicebot-ai/', 'product-voicebot.html'],
  ['qa-qc', '/qc-bot-ai/', 'product-qa-qc.html'],
]

function probe() {
  const norm = (t) => (t || '').replace(/\s+/g, ' ').trim()
  const main = document.querySelector('main') || document.body
  const secs = [...main.querySelectorAll('section')].filter((s) => !s.parentElement?.closest('section'))
  const gaps = []
  const rows = secs.map((s, i) => {
    const r = s.getBoundingClientRect()
    const next = secs[i + 1]
    if (next) gaps.push(Math.round(next.getBoundingClientRect().top - r.bottom))
    // a split = two side-by-side children of one container, both wide
    let split = null
    for (const el of s.querySelectorAll('*')) {
      const kids = [...el.children].filter((k) => k.getBoundingClientRect().width > 150)
      if (kids.length !== 2) continue
      const [a, b] = kids.map((k) => k.getBoundingClientRect())
      // Vertical OVERLAP, not matching tops: a centred split whose two columns
      // differ in height has tops that differ by half that difference, and
      // comparing tops silently scored a correct two-column layout as absent.
      const overlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
      if (overlap > 40 && a.right <= b.left + 8 && a.width > 220 && b.width > 220) {
        const tot = a.width + b.width
        split = { ratio: [Math.round((a.width / tot) * 100), Math.round((b.width / tot) * 100)], copyFirst: true }
        break
      }
    }
    let cols = null
    for (const el of s.querySelectorAll('*')) {
      const g = getComputedStyle(el)
      if (g.display !== 'grid') continue
      const t = g.gridTemplateColumns.split(' ').filter(Boolean)
      const kids = [...el.children].filter((k) => k.getBoundingClientRect().height > 24)
      if (kids.length < 2 || t.length < 2) continue
      if (cols === null || kids.length > cols.n) cols = { n: kids.length, tracks: t.length, zero: t.filter((x) => Math.round(parseFloat(x)) === 0).length }
    }
    return {
      i,
      heading: norm(s.querySelector('h1,h2')?.textContent).slice(0, 46),
      height: Math.round(r.height),
      split, cols,
      icons: [...s.querySelectorAll('svg')].filter((v) => v.getBoundingClientRect().width >= 10).length,
    }
  })
  const de = document.documentElement
  return {
    rows,
    n: rows.length,
    height: Math.round(de.scrollHeight),
    icons: [...document.querySelectorAll('svg')].filter((v) => v.getBoundingClientRect().width >= 10).length,
    splits: rows.filter((r) => r.split).length,
    zeroTracks: rows.reduce((a, r) => a + (r.cols?.zero || 0), 0),
    worstGap: gaps.length ? Math.max(...gaps) : 0,
    gapSpread: gaps.length ? `${Math.min(...gaps)}–${Math.max(...gaps)}` : '—',
    // Conversion links only: /lien-he/, the estimator and the price list.
    // Header and footer are excluded by scoping to <main>.
    ctas: main.querySelectorAll('a[href*="lien-he"], a[href*="uoc-tinh"], a[href*="bang-gia"]').length,
    items: main.querySelectorAll('article, li').length,
    media: main.querySelectorAll('img, [data-preview-stub], figure').length,
    faq: rows.filter((r) => /câu hỏi|faq/i.test(r.heading)).reduce((n, r) => n + 1, 0),
    faqItems: main.querySelectorAll('.gc-faq__item, [class*="faq"] h3').length,
    overflowX: de.scrollWidth > de.clientWidth + 1,
  }
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const out = {}
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await ctx.newPage()
  for (const [slug, route, file] of ROUTES) {
    for (const [side, url] of [['react', REACT + route], ['candidate', 'file://' + path.join(PREVIEW, file)]]) {
      await page.goto(url, { waitUntil: side === 'react' ? 'networkidle' : 'load', timeout: 70000 })
      if (side === 'react') {
        await page.evaluate(async () => {
          await new Promise((res) => { let y = 0; const t = setInterval(() => { window.scrollBy(0, 900); y += 900; if (y >= document.body.scrollHeight) { clearInterval(t); window.scrollTo(0, 0); res() } }, 50) })
        })
        await page.waitForTimeout(400)
      }
      out[`${slug}|${width}|${side}`] = await page.evaluate(probe)
    }
  }
  await ctx.close()
}
await browser.close()
await writeFile('docs/content-review/gcalls-036b/react-vs-candidate.json', JSON.stringify(out, null, 1))

console.log('route          w     side       sec  splits  icons  zeroTrk  height  worstGap  gapRange  CTA')
for (const width of WIDTHS) {
  for (const [slug] of ROUTES) {
    for (const side of ['react', 'candidate']) {
      const d = out[`${slug}|${width}|${side}`]
      console.log(
        `${slug.padEnd(13)} ${String(width).padEnd(5)} ${side.padEnd(10)} ${String(d.n).padStart(3)} ${String(d.splits).padStart(6)} ${String(d.icons).padStart(6)} ${String(d.zeroTracks).padStart(7)} ${String(d.height).padStart(7)} ${String(d.worstGap).padStart(9)} ${d.gapSpread.padStart(9)} ${String(d.ctas).padStart(4)}`
      )
    }
  }
  console.log('')
}
