#!/usr/bin/env node
/**
 * Per-page visual/content QA (Page 03 polish, React Shell 0.3.5).
 *
 * For one route at 1440 / 1024 / 768 / 390 asserts:
 *   - exactly one <h1>;
 *   - no horizontal overflow;
 *   - 0 broken images (complete && naturalWidth 0, or failed load);
 *   - every image / product-media frame stays inside its own <section>;
 *   - no image overlaps text outside its own frame (elementFromPoint probe
 *     on the frame's centre and corners must resolve inside the frame);
 *   - 0 retired placeholder strings, 0 old captions, >= 1 standard caption;
 *   - >= N testimonial cards ([data-testimonial]);
 *   - header: 1, official logo: 1, header CTA foreground white;
 * and writes full-page screenshots at 1440 and 390.
 *
 * Usage:
 *   node scripts/page-audit.mjs --route /gcalls-plus-webphone/ --serve
 *   node scripts/page-audit.mjs --route /gcalls-plus-webphone/ --base https://ashernguyenxuanthuy.com
 *   flags: --shots <dir>  --min-testimonials <n>  --out <file>
 */
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const flag = (n) => args.includes(n)
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d }

const ROUTE = opt('--route', '/gcalls-plus-webphone/')
const SERVE = flag('--serve')
const PORT = 4176
const BASE = opt('--base', `http://localhost:${PORT}`).replace(/\/$/, '')
const SHOTS = opt('--shots', 'docs/screenshots/page-audit')
const OUT = opt('--out', 'scripts/page-audit-results.json')
const MIN_TESTIMONIALS = Number(opt('--min-testimonials', 3))
const VIEWPORTS = [
  { name: 'desktop_1440', width: 1440, height: 900, shot: true },
  { name: 'tablet_1024', width: 1024, height: 768, shot: false },
  { name: 'tablet_768', width: 768, height: 1024, shot: false },
  { name: 'mobile_390', width: 390, height: 844, shot: true },
]
const PLACEHOLDERS = ['Ảnh minh hoạ đang được cập nhật', 'Nội dung khách hàng đang được cập nhật']
const OLD_CAPTIONS = ['Ảnh chụp thật từ môi trường demo nội bộ']
const STANDARD_CAPTION = 'Giao diện mô phỏng · Dữ liệu mẫu, không chứa thông tin khách hàng thật.'

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

const inspect = ({ placeholders, oldCaptions, standardCaption }) => {
  const text = document.body.innerText
  const count = (needle) => text.split(needle).length - 1
  const imgs = [...document.querySelectorAll('main img')]
  const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.getBoundingClientRect().width > 0).map((i) => i.getAttribute('src'))
  const inside = (r, c) => r.left >= c.left - 1 && r.right <= c.right + 1 && r.top >= c.top - 1 && r.bottom <= c.bottom + 1
  const escapes = []
  const overlaps = []
  const frames = [...document.querySelectorAll('main [data-product-media-frame], main img')]
  for (const el of frames) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const section = el.closest('section') || el.closest('main')
    const c = section.getBoundingClientRect()
    if (!inside(r, c)) escapes.push(`${el.tagName}${el.id ? '#' + el.id : ''} escapes ${section.tagName} by ${Math.round(Math.max(c.left - r.left, r.right - c.right, c.top - r.top, r.bottom - c.bottom))}px`)
    const vw = document.documentElement.clientWidth
    if (r.right > vw + 1 || r.left < -1) escapes.push(`${el.tagName} exceeds viewport (${Math.round(r.left)}..${Math.round(r.right)})`)
    // overlap probe: scroll element into view, sample points
    el.scrollIntoView({ block: 'center' })
    const rr = el.getBoundingClientRect()
    const pts = [
      [rr.left + rr.width / 2, rr.top + rr.height / 2],
      [rr.left + 24, rr.top + 24],
      [rr.right - 24, rr.top + 24],
      [rr.left + 24, rr.bottom - 24],
      [rr.right - 24, rr.bottom - 24],
    ]
    for (const [x, y] of pts) {
      if (y < 0 || y > window.innerHeight) continue
      const top = document.elementFromPoint(x, y)
      if (!top) continue
      if (el.contains(top) || top === el) continue
      if (top.contains(el)) continue // an ancestor paints behind the element (rounded corner / padding), not over it
      if (top.closest('header')) continue // fixed header legitimately covers the top edge while scrolled
      overlaps.push(`${el.tagName} covered by ${top.tagName}.${String(top.className).slice(0, 40)} at (${Math.round(x)},${Math.round(y)})`)
      break
    }
  }
  window.scrollTo(0, 0)
  const header = document.querySelectorAll('header')
  const cta = document.querySelector('header a[data-gcalls-button][data-variant="primary"]')
  const cs = cta && getComputedStyle(cta)
  return {
    h1: document.querySelectorAll('h1').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    images: imgs.length,
    broken,
    escapes,
    overlaps,
    placeholders: placeholders.map((p) => [p, count(p)]).filter(([, n]) => n > 0),
    oldCaptions: oldCaptions.map((p) => [p, count(p)]).filter(([, n]) => n > 0),
    standardCaptions: count(standardCaption),
    testimonials: document.querySelectorAll('[data-testimonial]').length,
    headers: header.length,
    logos: document.querySelectorAll('header img[alt="Gcalls"]').length,
    ctaFg: cs ? (cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color ? cs.webkitTextFillColor : cs.color) : null,
    footer: document.querySelectorAll('footer').length,
  }
}

fs.mkdirSync(SHOTS, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const results = { base: BASE, route: ROUTE, viewports: {} }
const slug = ROUTE.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home'

for (const vp of VIEWPORTS) {
  const scope = `${vp.name} ${ROUTE}`
  console.log(`\n== ${scope}`)
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  const failedLoads = []
  page.on('response', (r) => { if (r.request().resourceType() === 'image' && r.status() >= 400) failedLoads.push(r.url()) })
  await page.goto(BASE + ROUTE, { waitUntil: 'networkidle' })
  // force lazy images to load
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) }
    window.scrollTo(0, 0)
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r }))))
  })
  await page.waitForTimeout(300)
  const r = await page.evaluate(inspect, { placeholders: PLACEHOLDERS, oldCaptions: OLD_CAPTIONS, standardCaption: STANDARD_CAPTION })
  r.failedLoads = failedLoads
  results.viewports[vp.name] = r
  if (r.h1 !== 1) fail(scope, `h1 count ${r.h1}`)
  if (r.overflow > 0) fail(scope, `horizontal overflow ${r.overflow}px`)
  if (r.broken.length) fail(scope, `broken images: ${r.broken.join(', ')}`)
  if (failedLoads.length) fail(scope, `image requests failed: ${failedLoads.join(', ')}`)
  if (r.escapes.length) fail(scope, `media escapes container: ${r.escapes.join(' | ')}`)
  if (r.overlaps.length) fail(scope, `media overlap: ${r.overlaps.join(' | ')}`)
  if (r.placeholders.length) fail(scope, `placeholder strings: ${JSON.stringify(r.placeholders)}`)
  if (r.oldCaptions.length) fail(scope, `old captions: ${JSON.stringify(r.oldCaptions)}`)
  if (r.standardCaptions < 1) fail(scope, 'no standard caption present')
  if (r.testimonials < MIN_TESTIMONIALS) fail(scope, `testimonial cards ${r.testimonials} < ${MIN_TESTIMONIALS}`)
  if (r.headers !== 1) fail(scope, `header count ${r.headers}`)
  if (r.footer !== 1) fail(scope, `footer count ${r.footer}`)
  if (r.logos !== 1) fail(scope, `logo count ${r.logos}`)
  if (vp.width >= 768 && r.ctaFg !== 'rgb(255, 255, 255)') fail(scope, `header CTA foreground ${r.ctaFg}`)
  console.log(`  h1=${r.h1} overflow=${r.overflow} images=${r.images} broken=${r.broken.length} escapes=${r.escapes.length} overlaps=${r.overlaps.length} placeholders=${r.placeholders.length} oldCaptions=${r.oldCaptions.length} stdCaptions=${r.standardCaptions} testimonials=${r.testimonials}`)
  if (vp.shot) {
    const file = path.join(SHOTS, `${slug}-${vp.name}.png`)
    await page.screenshot({ path: file, fullPage: true })
    console.log(`  screenshot ${file}`)
  }
  await ctx.close()
}

await browser.close()
if (server) server.kill()
results.failures = failures
fs.writeFileSync(OUT, JSON.stringify(results, null, 2))
console.log(`\nfailures ${failures.length}`)
console.log(failures.length ? 'PAGE AUDIT FAILED' : 'PAGE AUDIT PASSED')
process.exit(failures.length ? 1 : 0)
