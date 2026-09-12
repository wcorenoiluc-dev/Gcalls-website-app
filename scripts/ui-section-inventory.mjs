#!/usr/bin/env node
/**
 * GCALLS-036 — structural section inventory for React vs WordPress.
 *
 * WHY NOT A TEXT DIFF
 * GCALLS-034 proved the sub-pages can carry the right words and still look raw:
 * every section rendered as the same card grid. So this records the things a
 * reviewer actually looks at — order, column count, background alternation,
 * card grouping, icons, media, CTAs, padding and the seam between sections —
 * and does it identically on both targets so the two can be diffed.
 *
 * A "section" is a top-level <section> inside <main>: one that has no <section>
 * ancestor. That definition holds for the React pages and for the WordPress
 * product renderer alike.
 *
 *   node scripts/ui-section-inventory.mjs [--routes=a,b] [--targets=react,wp]
 */
import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('docs/content-review/gcalls-036/inventory')
const WIDTHS = [1440, 390]
const TARGETS = {
  react: 'http://localhost:5173',
  wp: 'https://ashernguyenxuanthuy.com',
}

// Batch UI-1 — the ten conversion routes, in brief order.
const ROUTES = [
  ['gcalls-plus', '/gcalls-plus-webphone/'],
  ['gcalls-cx', '/gcalls-cx/'],
  ['voicebot-ai', '/voicebot-ai/'],
  ['qc-bot-ai', '/qc-bot-ai/'],
  ['san-pham', '/san-pham/'],
  ['giai-phap', '/giai-phap/'],
  ['tich-hop', '/tich-hop/'],
  ['lien-he', '/lien-he/'],
  ['bang-gia', '/bang-gia/'],
  ['uoc-tinh-chi-phi', '/uoc-tinh-chi-phi/'],
]

const arg = (k, d) => {
  const m = process.argv.find((a) => a.startsWith(`--${k}=`))
  return m ? m.split('=')[1] : d
}
const wantRoutes = arg('routes', '').split(',').filter(Boolean)
const wantTargets = arg('targets', 'react,wp').split(',').filter(Boolean)
const routes = wantRoutes.length ? ROUTES.filter(([s]) => wantRoutes.includes(s)) : ROUTES

/** Runs in the page. Returns the structural inventory. */
function probe() {
  const px = (v) => Math.round(parseFloat(v) || 0)
  const main = document.querySelector('main') || document.body
  const all = [...main.querySelectorAll('section')]
  const tops = all.filter((s) => !s.parentElement?.closest('section'))
  // Some builds wrap everything in one <section>; fall back to its children.
  const sections = tops.length === 1 && tops[0].querySelectorAll('section').length > 1
    ? [...tops[0].querySelectorAll('section')].filter((s) => s.parentElement.closest('section') === tops[0])
    : tops

  const norm = (t) => (t || '').replace(/\s+/g, ' ').trim()
  const rgb = (c) => (c === 'rgba(0, 0, 0, 0)' || c === 'transparent' ? null : c)

  const out = sections.map((s, i) => {
    const cs = getComputedStyle(s)
    const r = s.getBoundingClientRect()
    const next = sections[i + 1]
    const seam = next
      ? Math.round(next.getBoundingClientRect().top - r.bottom)
      : null

    const h2 = s.querySelector('h2, h1')
    const heads = [...s.querySelectorAll('h1,h2,h3,h4')].map((h) => ({
      tag: h.tagName, text: norm(h.textContent).slice(0, 90),
    }))
    const paras = [...s.querySelectorAll('p')]
    const lead = paras.length ? norm(paras[0].textContent).slice(0, 140) : null

    // Card grouping: the widest grid/flex container with >=2 similar children.
    let grid = null
    for (const el of s.querySelectorAll('*')) {
      const g = getComputedStyle(el)
      if (g.display !== 'grid' && g.display !== 'flex') continue
      const kids = [...el.children].filter((k) => k.getBoundingClientRect().height > 24)
      if (kids.length < 2) continue
      const cols = g.display === 'grid'
        ? g.gridTemplateColumns.split(' ').filter(Boolean).length
        : new Set(kids.map((k) => Math.round(k.getBoundingClientRect().top))).size
          ? Math.round(kids.length / new Set(kids.map((k) => Math.round(k.getBoundingClientRect().top))).size)
          : kids.length
      const cand = { cols, count: kids.length, gap: px(g.gap || g.columnGap), display: g.display }
      if (!grid || cand.count > grid.count) grid = cand
    }

    // Two-column split: a direct-ish container whose two children sit side by side.
    let split = false
    for (const el of s.querySelectorAll('*')) {
      const kids = [...el.children].filter((k) => k.getBoundingClientRect().width > 120)
      if (kids.length !== 2) continue
      const [a, b] = kids.map((k) => k.getBoundingClientRect())
      if (Math.abs(a.top - b.top) < 60 && a.right <= b.left + 8 && a.width > 200 && b.width > 200) { split = true; break }
    }

    const imgs = [...s.querySelectorAll('img')].map((im) => ({
      src: (im.currentSrc || im.src || '').split('/').pop(),
      w: im.getAttribute('width'), h: im.getAttribute('height'),
      natural: im.naturalWidth + 'x' + im.naturalHeight,
      rendered: Math.round(im.getBoundingClientRect().width),
      srcset: !!im.getAttribute('srcset'),
      loading: im.getAttribute('loading'),
      alt: (im.getAttribute('alt') || '').slice(0, 60),
      broken: im.complete && im.naturalWidth === 0,
    }))

    const svgs = [...s.querySelectorAll('svg')].filter((v) => v.getBoundingClientRect().width >= 12).length
    const ctas = [...s.querySelectorAll('a')]
      .filter((a) => /lien-he|bang-gia|uoc-tinh|demo|tu-van/.test(a.getAttribute('href') || ''))
      .map((a) => ({ text: norm(a.textContent).slice(0, 40), href: a.getAttribute('href') }))

    return {
      i,
      heading: h2 ? norm(h2.textContent).slice(0, 90) : null,
      headings: heads.length,
      headingTags: heads.map((h) => h.tag).join(','),
      lead,
      height: Math.round(r.height),
      padTop: px(cs.paddingTop),
      padBottom: px(cs.paddingBottom),
      bg: rgb(cs.backgroundColor),
      seamToNext: seam,
      split,
      grid,
      imgs,
      icons: svgs,
      ctas,
      textLen: norm(s.textContent).length,
      cls: (s.className || '').toString().slice(0, 70),
    }
  })

  const de = document.documentElement
  return {
    sections: out,
    page: {
      height: Math.round(de.scrollHeight),
      h1: document.querySelectorAll('h1').length,
      h1Text: norm(document.querySelector('h1')?.textContent || '').slice(0, 90),
      overflowX: de.scrollWidth > de.clientWidth + 1,
      scrollW: de.scrollWidth,
      clientW: de.clientWidth,
      rawShortcode: /\[gcalls_[a-z_]+/.test(document.body.innerText),
      brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
      totalImgs: document.images.length,
      sectionCount: out.length,
    },
  }
}

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const results = {}

for (const target of wantTargets) {
  const base = TARGETS[target]
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    const errors = []
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)) })
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)))

    for (const [slug, route] of routes) {
      errors.length = 0
      const key = `${target}|${width}|${slug}`
      try {
        const resp = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 70000 })
        await page.evaluate(async () => {
          await new Promise((res) => {
            let y = 0
            const t = setInterval(() => {
              window.scrollBy(0, 900); y += 900
              if (y >= document.body.scrollHeight) { clearInterval(t); window.scrollTo(0, 0); res() }
            }, 60)
          })
        })
        await page.waitForTimeout(500)
        const data = await page.evaluate(probe)
        data.status = resp?.status() ?? 0
        data.errors = [...new Set(errors)]
        results[key] = data
        const p = data.page
        console.log(`${target.padEnd(5)} ${String(width).padEnd(5)} ${slug.padEnd(18)} ${p.sectionCount} sec  ${p.height}px  h1=${p.h1}  ovf=${p.overflowX ? 'YES' : '-'}  brokenImg=${p.brokenImgs}  err=${data.errors.length}`)
      } catch (e) {
        results[key] = { error: String(e).slice(0, 160) }
        console.log(`${target.padEnd(5)} ${String(width).padEnd(5)} ${slug.padEnd(18)} ERROR ${String(e).slice(0, 90)}`)
      }
    }
    await ctx.close()
  }
}

await browser.close()
await writeFile(path.join(OUT, 'section-inventory.json'), JSON.stringify(results, null, 1))
console.log('\nwrote', path.join(OUT, 'section-inventory.json'))
