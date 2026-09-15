#!/usr/bin/env node
/**
 * Page-scoped heading regression audit (Page 04, React Shell 0.3.6).
 *
 * For one route, at 1440 / 1280 / 1100 / 1024 / 900 / 768 / 390, for every
 * <h1> and <h2> inside <main>:
 *   - exactly one <h1> on the page;
 *   - no fixed `height` / `max-height` (computed max-height must be none);
 *   - not clipped: scrollHeight <= clientHeight, and for gradient
 *     (background-clip: text) headings the painted box must cover the glyph
 *     extent — checked via a Range over the text: every line rect must lie
 *     inside the heading's padding box;
 *   - gap to the next element is >= 0 (and >= 20px when it is a paragraph);
 *   - bounding box does not intersect the next element or the previous
 *     badge/eyebrow;
 *   - heading does not exceed its parent container's width;
 *   - line-height / font-size >= 1.22;
 * plus page-level: no horizontal overflow, 0 broken images, no card
 * (<li> inside a grid) outside the viewport or its container; and header /
 * footer / CTA sanity. Screenshots at 1440 / 1024 / 768 / 390.
 *
 * Usage:
 *   node scripts/heading-audit.mjs --route /qc-bot-ai/ --serve
 *   node scripts/heading-audit.mjs --route /qc-bot-ai/ --base https://ashernguyenxuanthuy.com
 *   flags: --shots <dir>  --out <file>
 */
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const flag = (n) => args.includes(n)
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d }

const ROUTE = opt('--route', '/qc-bot-ai/')
const SERVE = flag('--serve')
const PORT = 4177
const BASE = opt('--base', `http://localhost:${PORT}`).replace(/\/$/, '')
const SHOTS = opt('--shots', 'docs/screenshots/heading-audit')
const OUT = opt('--out', 'scripts/heading-audit-results.json')
const WIDTHS = [1440, 1280, 1100, 1024, 900, 768, 390]
const SHOT_WIDTHS = new Set([1440, 1024, 768, 390])

let server
if (SERVE) {
  server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
  const deadline = Date.now() + 30000
  while (Date.now() < deadline) {
    try { const r = await fetch(BASE + '/'); if (r.ok) break } catch {}
    await new Promise((r) => setTimeout(r, 300))
  }
}

const failures = []
const fail = (scope, msg) => { failures.push(`${scope}: ${msg}`); console.log('  FAIL', scope, '-', msg) }

const inspect = () => {
  const out = { headings: [], cards: [], overflow: 0, broken: [], h1: 0 }
  const vw = document.documentElement.clientWidth
  out.overflow = document.documentElement.scrollWidth - vw
  out.h1 = document.querySelectorAll('h1').length
  out.broken = [...document.querySelectorAll('main img')].filter((i) => i.complete && i.naturalWidth === 0 && i.getBoundingClientRect().width > 0).map((i) => i.getAttribute('src'))
  const inter = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
  for (const h of document.querySelectorAll('main h1, main h2')) {
    const cs = getComputedStyle(h)
    const r = h.getBoundingClientRect()
    const fs = parseFloat(cs.fontSize)
    const lh = cs.lineHeight === 'normal' ? fs * 1.2 : parseFloat(cs.lineHeight)
    // glyph extent via Range
    const range = document.createRange(); range.selectNodeContents(h)
    const lines = [...range.getClientRects()].filter((x) => x.width > 0)
    const pad = { top: r.top, bottom: r.bottom, left: r.left, right: r.right }
    let glyphOut = 0
    for (const l of lines) glyphOut = Math.max(glyphOut, pad.top - l.top, l.bottom - pad.bottom)
    const next = h.nextElementSibling
    const nr = next && next.getBoundingClientRect()
    const prev = h.previousElementSibling
    const pr = prev && prev.getBoundingClientRect()
    const parent = h.parentElement.getBoundingClientRect()
    out.headings.push({
      tag: h.tagName, text: h.textContent.trim().slice(0, 48),
      fs, lh, ratio: +(lh / fs).toFixed(3), height: Math.round(r.height), scrollH: h.scrollHeight, clientH: h.clientHeight,
      styleHeight: h.style.height || '', maxHeight: cs.maxHeight, overflowY: cs.overflowY,
      gradient: cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text',
      glyphOut: +glyphOut.toFixed(1),
      lineCount: lines.length ? new Set(lines.map((l) => Math.round(l.top))).size : 0,
      nextTag: next ? next.tagName : null, gapNext: nr ? +(nr.top - r.bottom).toFixed(1) : null,
      intersectsNext: nr ? inter(r, nr) : false,
      intersectsPrev: pr ? inter(r, pr) : false,
      exceedsParent: r.right > parent.right + 1 || r.left < parent.left - 1,
      lastWord: (h.textContent.trim().split(/\s+/).pop() || ''),
    })
  }
  for (const li of document.querySelectorAll('main ul li, main ol li')) {
    const ul = li.parentElement
    if (!/grid/.test(getComputedStyle(ul).display)) continue
    const r = li.getBoundingClientRect(); if (r.width === 0) continue
    const c = ul.getBoundingClientRect()
    if (r.left < c.left - 1 || r.right > c.right + 1 || r.right > vw + 1 || r.left < -1) out.cards.push(`${li.textContent.trim().slice(0, 30)} (${Math.round(r.left)}..${Math.round(r.right)} in ${Math.round(c.left)}..${Math.round(c.right)})`)
  }
  const header = document.querySelectorAll('header').length
  const footer = document.querySelectorAll('footer').length
  const cta = document.querySelector('header a[data-gcalls-button][data-variant="primary"]')
  const ccs = cta && getComputedStyle(cta)
  out.chrome = { header, footer, logos: document.querySelectorAll('header img[alt="Gcalls"]').length, ctaFg: ccs ? (ccs.webkitTextFillColor && ccs.webkitTextFillColor !== ccs.color ? ccs.webkitTextFillColor : ccs.color) : null }
  return out
}

fs.mkdirSync(SHOTS, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const results = { base: BASE, route: ROUTE, viewports: {} }
const slug = ROUTE.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home'
let totalHeadings = 0, totalClipped = 0

for (const w of WIDTHS) {
  const scope = `${w} ${ROUTE}`
  console.log(`\n== ${scope}`)
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE + ROUTE, { waitUntil: 'networkidle' })
  await page.waitForSelector('main h1', { timeout: 15000 }).catch(() => {})
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)) } window.scrollTo(0, 0) })
  await page.waitForTimeout(300)
  const r = await page.evaluate(inspect)
  results.viewports[w] = r
  if (r.h1 !== 1) fail(scope, `h1 count ${r.h1}`)
  if (r.headings.length === 0) fail(scope, 'no headings found in main (page did not render)')
  if (r.overflow > 0) fail(scope, `horizontal overflow ${r.overflow}px`)
  if (r.broken.length) fail(scope, `broken images ${r.broken.join(', ')}`)
  if (r.cards.length) fail(scope, `cards clipped: ${r.cards.join(' | ')}`)
  if (r.chrome.header !== 1 || r.chrome.footer !== 1 || r.chrome.logos !== 1) fail(scope, `chrome header=${r.chrome.header} footer=${r.chrome.footer} logos=${r.chrome.logos}`)
  if (w >= 768 && r.chrome.ctaFg !== 'rgb(255, 255, 255)') fail(scope, `header CTA fg ${r.chrome.ctaFg}`)
  let clipped = 0
  for (const h of r.headings) {
    totalHeadings++
    const id = `${h.tag} "${h.text}"`
    const isClipped = h.scrollH > h.clientH + 1 || (h.gradient && h.glyphOut > 1.5)
    if (isClipped) { clipped++; fail(scope, `${id} clipped (scroll ${h.scrollH} > client ${h.clientH}, glyph out ${h.glyphOut}px)`) }
    if (h.styleHeight || h.maxHeight !== 'none') fail(scope, `${id} fixed height (${h.styleHeight || h.maxHeight})`)
    if (h.overflowY === 'hidden' || h.overflowY === 'clip') fail(scope, `${id} overflow ${h.overflowY}`)
    if (h.ratio < 1.22) fail(scope, `${id} line-height ratio ${h.ratio}`)
    if (h.gapNext !== null && h.gapNext < 0) fail(scope, `${id} negative gap to next (${h.gapNext})`)
    if (h.nextTag === 'P' && h.gapNext !== null && h.gapNext < 20) fail(scope, `${id} gap to paragraph ${h.gapNext}px < 20`)
    if (h.intersectsNext) fail(scope, `${id} intersects next element`)
    if (h.intersectsPrev) fail(scope, `${id} intersects previous element (badge)`)
    if (h.exceedsParent) fail(scope, `${id} exceeds container`)
  }
  totalClipped += clipped
  console.log(`  headings=${r.headings.length} clipped=${clipped} overflow=${r.overflow} cards-clipped=${r.cards.length} broken=${r.broken.length}`)
  if (SHOT_WIDTHS.has(w)) {
    const file = path.join(SHOTS, `${slug}-${w}.png`)
    await page.screenshot({ path: file, fullPage: true })
    console.log(`  screenshot ${file}`)
  }
  await ctx.close()
}

await browser.close()
if (server) server.kill()
results.failures = failures
results.totals = { headingsTested: totalHeadings, clipped: totalClipped }
fs.writeFileSync(OUT, JSON.stringify(results, null, 2))
console.log(`\nheadings tested ${totalHeadings} (across ${WIDTHS.length} viewports), clipped ${totalClipped}, failures ${failures.length}`)
console.log(failures.length ? 'HEADING AUDIT FAILED' : 'HEADING AUDIT PASSED')
process.exit(failures.length ? 1 : 0)
