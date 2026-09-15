#!/usr/bin/env node
/**
 * Single-line CTA regression audit (Page 05, React Shell 0.3.6).
 *
 * For one route, at 1440 / 1280 / 1100 / 1024 / 980 / 900 / 768 / 430 / 390,
 * for every `[data-gcalls-button]` inside <main>:
 *   - computed `white-space: nowrap`;
 *   - the label renders on ONE visual line (Range line rects);
 *   - the label does not overflow the control (scrollWidth <= clientWidth);
 *   - the control does not exceed its container or the viewport;
 *   - it does not intersect a sibling CTA;
 *   - primary: purple background + white foreground; outline / light /
 *     outline-dark: brand or white foreground per the colour contract;
 *   - font-size >= 14px; touch target height >= 44px;
 *   - hover / focus-visible / active keep the same foreground colour
 *     (checked at 1440 on every control).
 * Also: no horizontal overflow. Screenshots at 1440 / 1024 / 768 / 390.
 *
 * Usage:
 *   node scripts/cta-line-audit.mjs --route /gcalls-cx/ --serve
 *   node scripts/cta-line-audit.mjs --route /gcalls-cx/ --base https://ashernguyenxuanthuy.com
 */
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const flag = (n) => args.includes(n)
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d }

const ROUTE = opt('--route', '/gcalls-cx/')
const SERVE = flag('--serve')
const PORT = 4178
const BASE = opt('--base', `http://localhost:${PORT}`).replace(/\/$/, '')
const SHOTS = opt('--shots', 'docs/screenshots/cta-line-audit')
const OUT = opt('--out', 'scripts/cta-line-audit-results.json')
const WIDTHS = [1440, 1280, 1100, 1024, 980, 900, 768, 430, 390]
const SHOT_WIDTHS = new Set([1440, 1024, 768, 390])
const WHITE = 'rgb(255, 255, 255)'
const PURPLES = new Set(['rgb(103, 58, 183)', 'rgb(74, 35, 145)', 'rgb(89, 41, 168)'])

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
  const vw = document.documentElement.clientWidth
  const ctas = [...document.querySelectorAll('main [data-gcalls-button]')]
  const inter = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
  const fg = (cs) => (cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color ? cs.webkitTextFillColor : cs.color)
  const list = ctas.map((el, i) => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    // Count visual text lines from the TEXT nodes only (an inline icon sits on
    // the same line but has a different top, so it must not count as a line).
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5
    const tops = []
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim()) continue
      const rg = document.createRange(); rg.selectNodeContents(n)
      for (const x of rg.getClientRects()) if (x.width > 0 && x.height > 0) tops.push(x.top)
    }
    tops.sort((a, b) => a - b)
    let lines = tops.length ? 1 : 0
    for (let k = 1; k < tops.length; k++) if (tops[k] - tops[k - 1] > lh * 0.6) lines++
    const parent = el.parentElement.getBoundingClientRect()
    const siblings = ctas.filter((o) => o !== el && o.parentElement === el.parentElement)
    return {
      i, label: el.textContent.trim().slice(0, 48), variant: el.getAttribute('data-variant'),
      ws: cs.whiteSpace, lines, w: Math.round(r.width), h: Math.round(r.height),
      overflowLabel: el.scrollWidth > el.clientWidth + 1,
      exceedsParent: r.right > parent.right + 1 || r.left < parent.left - 1,
      exceedsViewport: r.right > vw + 1 || r.left < -1,
      intersects: siblings.some((o) => inter(r, o.getBoundingClientRect())),
      fs: parseFloat(cs.fontSize), fg: fg(cs), bg: cs.backgroundColor, visible: r.width > 0 && r.height > 0,
    }
  })
  return { vw, overflow: document.documentElement.scrollWidth - vw, ctas: list }
}

fs.mkdirSync(SHOTS, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const results = { base: BASE, route: ROUTE, viewports: {} }
const slug = ROUTE.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home'
let ctaTotal = 0, singleLine = 0, overflowing = 0

for (const w of WIDTHS) {
  const scope = `${w} ${ROUTE}`
  console.log(`\n== ${scope}`)
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE + ROUTE, { waitUntil: 'networkidle' })
  await page.waitForSelector('main [data-gcalls-button]', { timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(300)
  const r = await page.evaluate(inspect)
  results.viewports[w] = r
  if (r.ctas.length === 0) fail(scope, 'no CTA found in main (page did not render)')
  if (r.overflow > 0) fail(scope, `horizontal overflow ${r.overflow}px`)
  for (const c of r.ctas.filter((x) => x.visible)) {
    ctaTotal++
    const id = `CTA "${c.label}" [${c.variant}]`
    if (c.ws !== 'nowrap') fail(scope, `${id} white-space ${c.ws}`)
    if (c.lines === 1) singleLine++; else fail(scope, `${id} renders ${c.lines} lines`)
    if (c.overflowLabel) { overflowing++; fail(scope, `${id} label overflows control`) }
    if (c.exceedsParent) { overflowing++; fail(scope, `${id} exceeds container`) }
    if (c.exceedsViewport) fail(scope, `${id} exceeds viewport`)
    if (c.intersects) fail(scope, `${id} overlaps sibling CTA`)
    if (c.fs < 14) fail(scope, `${id} font-size ${c.fs}px < 14`)
    if (c.h < 44) fail(scope, `${id} height ${c.h}px < 44`)
    if (c.variant === 'primary' && (!PURPLES.has(c.bg) || c.fg !== WHITE)) fail(scope, `${id} colours bg=${c.bg} fg=${c.fg}`)
    if ((c.variant === 'outline' || c.variant === 'light') && !PURPLES.has(c.fg)) fail(scope, `${id} fg ${c.fg} not brand`)
    if (c.variant === 'outline-dark' && c.fg !== WHITE) fail(scope, `${id} fg ${c.fg} not white`)
  }
  console.log(`  ctas=${r.ctas.length} overflow=${r.overflow}`)
  // pointer / keyboard states at desktop only
  if (w === 1440) {
    const n = await page.locator('main [data-gcalls-button]').count()
    for (let i = 0; i < n; i++) {
      const el = page.locator('main [data-gcalls-button]').nth(i)
      if (!(await el.isVisible())) continue
      const label = (await el.textContent()).trim().slice(0, 40)
      const base = await el.evaluate((e) => { const cs = getComputedStyle(e); return cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color ? cs.webkitTextFillColor : cs.color })
      await el.scrollIntoViewIfNeeded(); await el.hover(); await page.waitForTimeout(80)
      const hov = await el.evaluate((e) => { const cs = getComputedStyle(e); return cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color ? cs.webkitTextFillColor : cs.color })
      if (hov !== base) fail(scope, `"${label}" hover fg ${hov} != ${base}`)
      await page.mouse.move(5, 5)
      await el.focus(); await page.waitForTimeout(60)
      const foc = await el.evaluate((e) => { const cs = getComputedStyle(e); return cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color ? cs.webkitTextFillColor : cs.color })
      if (foc !== base) fail(scope, `"${label}" focus fg ${foc} != ${base}`)
      // active last: mouseup may navigate (internal Link), so measure on mousedown then restore the page
      await el.hover(); await page.mouse.down(); await page.waitForTimeout(60)
      const act = await el.evaluate((e) => { const cs = getComputedStyle(e); return cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color ? cs.webkitTextFillColor : cs.color })
      await page.mouse.up(); await page.waitForTimeout(120)
      if (act !== base) fail(scope, `"${label}" active fg ${act} != ${base}`)
      // a navigation may have happened on mousedown/up of a hash link; reload if route changed
      if (!page.url().endsWith(ROUTE)) { await page.goto(BASE + ROUTE, { waitUntil: 'networkidle' }) }
    }
  }
  if (SHOT_WIDTHS.has(w)) {
    await page.goto(BASE + ROUTE, { waitUntil: 'networkidle' })
    const file = path.join(SHOTS, `${slug}-${w}.png`)
    await page.screenshot({ path: file, fullPage: true })
    console.log(`  screenshot ${file}`)
  }
  await ctx.close()
}

await browser.close()
if (server) server.kill()
results.failures = failures
results.totals = { ctaChecks: ctaTotal, singleLine, overflowing }
fs.writeFileSync(OUT, JSON.stringify(results, null, 2))
console.log(`\nCTA checks ${ctaTotal} across ${WIDTHS.length} viewports; single-line ${singleLine}; overflowing ${overflowing}; failures ${failures.length}`)
console.log(failures.length ? 'CTA LINE AUDIT FAILED' : 'CTA LINE AUDIT PASSED')
process.exit(failures.length ? 1 : 0)
