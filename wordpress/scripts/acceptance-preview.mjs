#!/usr/bin/env node
/**
 * GCALLS-036B — local acceptance over the source previews.
 *
 * SOURCE PREVIEW, NOT LIVE ACCEPTANCE. These are file:// pages drawn from the
 * manifests through the shared contract. They prove component choice, DOM
 * hierarchy, grid geometry and CTA counts. They cannot prove anything about
 * the host, the cache, or WordPress's own output.
 */
import { chromium } from 'playwright-core'
import { readdir, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const DIR = path.resolve('docs/content-review/gcalls-036b/preview')
const OUT = path.resolve('docs/content-review/gcalls-036b')
const WIDTHS = [1440, 1024, 768, 390, 320]

function probe() {
  const de = document.documentElement
  const secs = [...document.querySelectorAll('main > section')]
  const norm = (t) => (t || '').replace(/\s+/g, ' ').trim()

  const sections = secs.map((s, i) => {
    const r = s.getBoundingClientRect()
    const cs = getComputedStyle(s)
    const next = secs[i + 1]
    const grid = s.querySelector('.gc-grid, .gc-steps, .gc-vendors, .gc-compare-flow, .gc-related')
    let cols = null, tracks = null, zero = 0
    if (grid) {
      const g = getComputedStyle(grid)
      tracks = g.gridTemplateColumns
      const t = tracks.split(' ').filter(Boolean)
      cols = t.length
      zero = t.filter((x) => Math.round(parseFloat(x)) === 0).length
    }
    const split = s.querySelector('.gc-split')
    let splitRatio = null
    if (split) {
      const kids = [...split.children].map((k) => k.getBoundingClientRect())
      if (kids.length === 2 && Math.abs(kids[0].top - kids[1].top) < 40 && kids[0].right <= kids[1].left + 8) {
        const total = kids[0].width + kids[1].width
        splitRatio = [Math.round((kids[0].width / total) * 100), Math.round((kids[1].width / total) * 100)]
      }
    }
    return {
      i,
      cls: s.className,
      component: (s.className.match(/gc-section--([a-z]+)/) || [])[1] || null,
      heading: norm(s.querySelector('h1,h2')?.textContent).slice(0, 60),
      height: Math.round(r.height),
      padTop: Math.round(parseFloat(cs.paddingTop)),
      padBottom: Math.round(parseFloat(cs.paddingBottom)),
      seamToNext: next ? Math.round(next.getBoundingClientRect().top - r.bottom) : null,
      bg: cs.backgroundColor,
      cols, tracks, zeroTracks: zero,
      split: !!split, splitRatio,
      icons: [...s.querySelectorAll('svg')].filter((v) => v.getBoundingClientRect().width >= 10).length,
      bodyText: norm(s.textContent).length,
      // A section is an orphan when it has a heading but no content component
      // under it. Comparing text lengths missed the case of heading + lead and
      // nothing else, which is exactly what an unmapped data shape produces.
      headingOnly: !!s.querySelector('h1,h2') && !s.querySelector(
        '.gc-grid, .gc-steps, .gc-split, .gc-prose, .gc-taglist, .gc-checks, .gc-vendors,' +
        ' .gc-trustbar, .gc-compare-flow, .gc-faq, .gc-cta__row, .gc-related, .gc-leadslot__row,' +
        ' .gc-groups, .gc-decision, .gc-placeholder'
      ),
    }
  })

  const finals = secs.filter((s) => /gc-section--final/.test(s.className))
  return {
    sections,
    page: {
      h1: document.querySelectorAll('h1').length,
      emptyH1: [...document.querySelectorAll('h1')].filter((h) => !norm(h.textContent)).length,
      sectionCount: sections.length,
      height: Math.round(de.scrollHeight),
      overflowX: de.scrollWidth > de.clientWidth + 1,
      overflowBy: de.scrollWidth - de.clientWidth,
      finalCtaCount: finals.length,
      isContact: /gc-page--contact/.test(document.body.className),
      leadSlots: document.querySelectorAll('.gc-leadslot').length,
      formEls: document.querySelectorAll('form, input[type=submit], button[type=submit]').length,
      ctas: document.querySelectorAll('a.gc-btn').length,
      ctaNoLabel: [...document.querySelectorAll('a.gc-btn')].filter((a) => !norm(a.textContent)).length,
      ctaNoHref: [...document.querySelectorAll('a.gc-btn')].filter((a) => !a.getAttribute('href')).length,
      ctaEmptyQuery: [...document.querySelectorAll('a[href*="lien-he"]')]
        .filter((a) => /[?&](intent|source|product|solution)=(&|$)/.test(a.getAttribute('href') || '')).length,
      finalCtaButtons: finals.reduce((n, s) => n + s.querySelectorAll('a').length, 0),
      icons: [...document.querySelectorAll('svg')].filter((v) => v.getBoundingClientRect().width >= 10).length,
      zeroTracks: sections.reduce((n, s) => n + s.zeroTracks, 0),
      headingOrphans: sections.filter((s) => s.headingOnly).length,
      emptySections: sections.filter((s) => s.bodyText === 0).length,
      rawShortcode: /\[gcalls_[a-z_]+/.test(document.body.innerText),
      stubs: document.querySelectorAll('[data-preview-stub]').length,
      brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
      genericGrid: document.querySelectorAll('.gcalls-product__grid').length,
    },
  }
}

const files = (await readdir(DIR)).filter((f) => f.endsWith('.html')).sort()
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const results = {}
const rows = []

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await ctx.newPage()
  const errs = []
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 100)))
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 100)) })
  for (const f of files) {
    errs.length = 0
    await page.goto('file://' + path.join(DIR, f), { waitUntil: 'load' })
    await page.waitForTimeout(120)
    const d = await page.evaluate(probe)
    d.errors = [...new Set(errs)]
    results[`${f}|${width}`] = d
    const p = d.page
    const bad = []
    if (p.h1 !== 1) bad.push(`h1=${p.h1}`)
    if (p.emptyH1) bad.push(`emptyH1=${p.emptyH1}`)
    if (p.overflowX) bad.push(`overflow+${p.overflowBy}`)
    if (p.zeroTracks) bad.push(`zeroTracks=${p.zeroTracks}`)
    if (p.headingOrphans) bad.push(`orphan=${p.headingOrphans}`)
    if (p.emptySections) bad.push(`empty=${p.emptySections}`)
    /*
     * /lien-he/ is where every CTA on the site points, so it must NOT carry a
     * final CTA band aimed back at itself. What it must carry instead is a
     * contact slot, and it must contain no form controls while the runtime is
     * unmerged.
     */
    if (p.isContact) {
      if (p.finalCtaCount !== 0) bad.push(`contactHasFinalCta=${p.finalCtaCount}`)
      if (p.leadSlots !== 1) bad.push(`leadSlot=${p.leadSlots}`)
      if (p.formEls) bad.push(`formControls=${p.formEls}`)
    } else if (p.finalCtaCount !== 1) {
      bad.push(`finalCta=${p.finalCtaCount}`)
    }
    if (p.rawShortcode) bad.push('rawShortcode')
    if (p.ctaNoLabel) bad.push(`ctaNoLabel=${p.ctaNoLabel}`)
    if (p.ctaNoHref) bad.push(`ctaNoHref=${p.ctaNoHref}`)
    if (p.ctaEmptyQuery) bad.push(`ctaEmptyQuery=${p.ctaEmptyQuery}`)
    if (p.genericGrid) bad.push(`genericGrid=${p.genericGrid}`)
    if (d.errors.length) bad.push(`err=${d.errors.length}`)
    rows.push([f.replace(/\.html$/, ''), width, p.sectionCount, p.height, p.icons, p.finalCtaButtons, bad])
  }
  await ctx.close()
}
await browser.close()

await mkdir(OUT, { recursive: true })
await writeFile(path.join(OUT, 'acceptance-preview.json'), JSON.stringify(results, null, 1))

let failures = 0
console.log('route                          w     sec   height  icons  ctaBtn  issues')
for (const [f, w, sec, h, ic, cta, bad] of rows) {
  if (bad.length) failures++
  console.log(`${f.padEnd(30)} ${String(w).padEnd(5)} ${String(sec).padStart(3)} ${String(h).padStart(8)} ${String(ic).padStart(6)} ${String(cta).padStart(7)}  ${bad.join(' ') || '—'}`)
}
console.log(`\n${rows.length} page/width combinations, ${failures} with issues`)
process.exit(failures ? 1 : 0)
