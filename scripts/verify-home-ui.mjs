/**
 * Homepage V2 gate — GCALLS-051 Phase D.
 *
 * Uses system Google Chrome via playwright-core. Requires the isolated dev
 * server on :5180.
 *
 *   npm run dev -- --port 5180 --strictPort
 *   node scripts/verify-home-ui.mjs
 *
 * Asserts the acceptance criteria for `/` as written in the brief, and the
 * couplings `src/styles/home.css` depends on — notably the 1180px container,
 * which is reached through `.max-w-7xl` rather than the shared `Container`'s
 * `.max-w-[1280px]`. If a section ever migrates to `Container`, the measured
 * width changes and this fails loudly instead of the page silently going wide.
 */
import { chromium } from 'playwright-core'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const BASE = process.env.BASE || 'http://localhost:5180'
const BREAKPOINTS = [1440, 1280, 1024, 768, 390, 320]
const OUT = path.resolve('docs/content-review/gcalls-051')

/**
 * Values retired from the homepage. Every one was an invented figure or an
 * invented person presented as operational data. The masked replacements
 * (Khách hàng NN, 0900 000 0NN, 1900 000N) are the convention the sanitized
 * product captures already use.
 */
const RETIRED = [
  'Nguyễn Văn Minh', 'Trần Thị Lan', 'Lê Hoàng Phúc', 'Phạm Thu Hà', 'Võ Minh Tuấn',
  'Nguyễn Hằng', 'Trần Minh Tuấn', 'Lê Phương Linh', 'Phạm Đức Dương', 'Võ Thị Thanh', 'Đỗ Quang Hải',
  '0901 234 567', '0912 345 678', '0888 901 234', '0976 543 210', '0933 210 987',
  '1900 1234', '1900 5678',
  'Công ty TNHH Bình Minh', 'CTCP Việt Phát', 'Tập đoàn Sao Việt', 'StartupHub Việt Nam',
  'binhminh.vn', 'vietphat.com', 'saoviet.vn', 'startuphub.vn',
  'gcalls.vn',
]

let passed = 0
const failures = []
const check = (name, ok, detail = '') => {
  if (ok) { passed++; console.log(`  ok   ${name}`) }
  else { failures.push(`${name}${detail ? ` — ${detail}` : ''}`); console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`) }
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const perBp = {}

for (const bp of BREAKPOINTS) {
  const ctx = await browser.newContext({ viewport: { width: bp, height: 900 }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  const consoleErrors = []
  const badResponses = []
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
  page.on('response', (r) => { if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url()}`) })

  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 45000 })
  await page.waitForFunction(
    () => document.querySelector('.home-page') && document.querySelectorAll('h1').length > 0,
    { timeout: 20000 },
  ).catch(() => {})
  await page.waitForTimeout(400)

  const m = await page.evaluate((retired) => {
    const wrap = document.querySelector('.home-page')
    const secs = wrap ? [...wrap.children].filter((e) => e.tagName === 'SECTION') : []
    const seams = []
    for (let i = 1; i < secs.length; i++) {
      seams.push(
        parseFloat(getComputedStyle(secs[i - 1]).paddingBottom) +
        parseFloat(getComputedStyle(secs[i]).paddingTop),
      )
    }
    const container = wrap?.querySelector('.max-w-7xl')
    const W = document.documentElement.clientWidth
    const clipped = []
    for (const el of document.querySelectorAll('.home-page *')) {
      const t = (el.innerText || '').trim()
      if (!t || el.children.length > 0) continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.left < -1000) continue   // off-screen honeypot
      if (r.right > W + 1 || r.left < -1) clipped.push(`${t.slice(0, 30)} [${Math.round(r.left)}->${Math.round(r.right)}]`)
    }
    const text = document.body.innerText
    return {
      sections: secs.length,
      h1: document.querySelectorAll('h1').length,
      h1Text: document.querySelector('h1')?.innerText.trim().slice(0, 60) ?? '',
      seams,
      containerWidth: container ? Math.round(container.getBoundingClientRect().width) : null,
      docOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      clipped,
      forms: wrap ? wrap.querySelectorAll('form').length : 0,
      captions: document.querySelectorAll('[data-mockup-caption]').length,
      images: document.images.length,
      brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
      hashHrefs: wrap ? wrap.querySelectorAll('a[href="#"]').length : 0,
      rawShortcode: /\[(?:gcalls|contact)[a-z_]*\b/i.test(text),
      retiredHits: retired.filter((r) => text.includes(r)),
      pageHeight: document.documentElement.scrollHeight,
    }
  }, RETIRED)

  /**
   * Classify by URL, not by console text. Chrome logs "Failed to load resource:
   * ... 404" with NO url, so the site-wide /favicon.ico 404 is indistinguishable
   * from an application error by text alone. If the only 4xx seen on this load
   * was the favicon, a generic HTTP console error is attributed to it.
   */
  m.badResponses = badResponses.filter((u) => !/favicon/i.test(u))
  m.faviconOnly = badResponses.filter((u) => /favicon/i.test(u)).length
  m.consoleErrors = consoleErrors
    .filter((e) => !/favicon/i.test(e))
    .filter((e) => !(/Failed to load resource/i.test(e) && m.badResponses.length === 0))
  perBp[bp] = m
  await ctx.close()
}
await browser.close()

const at1440 = perBp[1440]

console.log('\n  STRUCTURE')
check('exactly 13 sections', at1440.sections === 13, `${at1440.sections}`)
check('exactly one H1', at1440.h1 === 1, `${at1440.h1}`)
check('H1 is not empty', at1440.h1Text.length > 0, at1440.h1Text)
check('a lead form at the end of the page', at1440.forms === 1, `${at1440.forms} form(s)`)

console.log('\n  RHYTHM')
check('12 seams (13 sections)', at1440.seams.length === 12, `${at1440.seams.length}`)
for (const bp of BREAKPOINTS) {
  const s = perBp[bp].seams
  check(`every seam is 50px @${bp}`, s.length === 12 && s.every((x) => x === 50),
    s.filter((x) => x !== 50).length ? `off: ${[...new Set(s.filter((x) => x !== 50))].join(', ')}` : '')
}
check('container is 1180px @1440', at1440.containerWidth === 1180, `${at1440.containerWidth}px`)

console.log('\n  RESPONSIVE')
for (const bp of BREAKPOINTS) {
  const b = perBp[bp]
  check(`no document overflow @${bp}`, !b.docOverflow)
  check(`no clipped text @${bp}`, b.clipped.length === 0, b.clipped.slice(0, 3).join(' | '))
}

console.log('\n  HONESTY')
check('no retired fabricated value renders', at1440.retiredHits.length === 0, at1440.retiredHits.join(', '))
check('every drawn mockup carries an illustration label', at1440.captions >= 7, `${at1440.captions} caption(s)`)
check('no broken image', at1440.brokenImages === 0, `${at1440.brokenImages}`)
check('no href="#"', at1440.hashHrefs === 0, `${at1440.hashHrefs}`)
check('no raw shortcode', !at1440.rawShortcode)

console.log('\n  RUNTIME')
for (const bp of BREAKPOINTS) {
  check(`no console error @${bp}`, perBp[bp].consoleErrors.length === 0, perBp[bp].consoleErrors[0]?.slice(0, 100) ?? '')
  check(`no failed request @${bp}`, perBp[bp].badResponses.length === 0, perBp[bp].badResponses[0]?.slice(0, 100) ?? '')
}

await mkdir(OUT, { recursive: true })
await writeFile(path.join(OUT, 'home-ui-report.json'),
  JSON.stringify({ base: BASE, at: new Date().toISOString(), perBp, passed, failures }, null, 2))

console.log(`\n  ${passed} passed, ${failures.length} failed`)
console.log('  NOTE  site-wide: /favicon.ico 404s on every route. Out of scope here.')
if (failures.length) { console.log('\n  HOMEPAGE_UI_V2_LOCAL_FAIL'); process.exit(1) }
console.log('\n  HOMEPAGE_UI_V2_LOCAL_PASS')
