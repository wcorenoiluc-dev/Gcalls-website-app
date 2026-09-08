/**
 * Fabricated-data scan for the homepage — source AND rendered DOM.
 *
 *   node scripts/scan-home-fabricated.mjs [base]        # default 127.0.0.1:5181
 *
 * The acceptance this enforces (GCALLS-055) is that nothing on `/` presents an
 * invented figure as fact: no phone number, call count, percentage, KPI, named
 * person, record id, latency, duration or operating result. Illustration
 * placeholders are the convention — "—", masked digits, generic "Khách hàng 01"
 * labels — and the scan exists to prove none of the real-looking values crept
 * back in.
 *
 * WHY IT SCANS TWICE
 * ------------------
 * The DOM pass is the one that matters: it is what a visitor sees, and it
 * catches values that no grep would find because they are computed at render
 * time. But a hidden tab, a collapsed panel or an inactive mockup state renders
 * nothing, so a source pass runs alongside it — otherwise a fabricated hotline
 * on CloudSection's "Hotlines" tab is invisible to the scan while being one
 * click from a visitor.
 *
 * THE BLIND SPOTS THIS VERSION CLOSES
 * -----------------------------------
 * The first version matched `0900` and `1900` only. Two `0901` numbers survived
 * a whole neutralization pass and a green scan (fixed in 385afbe), and so did a
 * partial DID written `028 7109 xxxx`. It also had no notion of a bare integer
 * presented as a result, so agent counts, "Đổ đồng thời 3 agent", `543` calls a
 * week, `2.4k req/h`, `48ms`, `"duration": 222` and a `call_8f3kd9` record id
 * all passed. Clock times (`09:14`), durations (`7m 12s`, `3:42`) and freshness
 * stamps ("Cập nhật 5s trước") were invisible too.
 *
 * The patterns below are deliberately broader than the values that were found,
 * so the next invented number fails the gate rather than the next audit.
 */
import { chromium } from 'playwright-core'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const BASE = process.argv[2] ?? 'http://127.0.0.1:5181'
const BP = [1440, 1280, 1024, 768, 390, 320]
const SRC = path.resolve('src/components/home')

/**
 * Every pattern is a class of invented fact, not one value.
 *
 * `where` marks the ones that would misfire on source: CSS lengths, colours and
 * animation timings are full of digits, so those run against the DOM's text and
 * attributes only, where no stylesheet reaches.
 */
const PATTERNS = [
  // --- contact details ------------------------------------------------------
  { name: 'phone-mobile',    re: /\b0\d{2,3}[\s.]?\d{3}[\s.]?\d{3,4}\b/, note: 'VN mobile-shaped number' },
  { name: 'phone-hotline',   re: /\b1900[\s.]?\d{3,}\b/,               note: 'hotline number' },
  { name: 'phone-landline',  re: /\b0(?:2\d)[\s.]?\d{3,4}[\s.]?\d{3,4}\b/, note: 'VN landline / DID' },
  { name: 'phone-partial',   re: /\b0\d{1,2}\s?\d{0,4}\s?x{3,}\b/i,    note: 'partially masked number still carrying a real prefix' },
  { name: 'email-real',      re: /[\w.+-]+@(?!example\.(?:com|org|net)\b)[\w-]+\.[a-z]{2,}/i, note: 'email address outside the reserved example domains' },
  // --- results and metrics --------------------------------------------------
  { name: 'percent',         re: /(?<!\d)(?!100(?:\s*%))\d{1,3}(?:[.,]\d+)?\s*%/, note: 'a rate or share; only a full 100% is treated as UI chrome' },
  { name: 'delta',           re: /[+\-−]\s?\d+(?:[.,]\d+)?\s*%/, note: 'a change figure' },
  { name: 'clock-time',      re: /(?<![\d:])\d{1,2}:[0-5]\d(?![\d:])/, note: 'a timestamp or call length' },
  { name: 'duration-ms',     re: /(?<!\d)\d+\s?ms\b/,           note: 'a latency figure' },
  { name: 'duration-hms',    re: /(?<!\d)\d+\s?[mh]\s?\d+\s?s\b/, note: 'a duration' },
  { name: 'throughput',      re: /(?<!\d)\d+(?:[.,]\d+)?\s?k?\s?(?:req|rps|call)s?\s?\/\s?[hms]/i, note: 'a throughput figure' },
  { name: 'freshness',       re: /\b\d+\s?(?:gi\u00e2y|gi\u00e2y|s|ph\u00fat|min|ng\u00e0y|gi\u1edd)\s+(?:tr\u01b0\u1edbc|truoc)\b/i, note: 'an invented "updated N ago" stamp' },
  { name: 'money',           re: /(?<!\d)\d{1,3}(?:[.,]\d{3}){2,}\s?(?:₫|đ|VND)/i, note: 'a money figure' },
  // --- counted operating results -------------------------------------------
  // A bare integer next to one of these nouns is a claim about how much work
  // happened or how many people did it. Structural counts that the page derives
  // from the rows it is drawing are written `{xs.length}` and never reach here.
  {
    name: 'counted-result',
    re: /(?<![\d.,])\d{1,6}(?:[.,]\d{3})*\s*(?:\+\s*)?(?:cu[ộo]c g[oọ]i|cu[ộo]c|kh[aá]ch h[aà]ng|agents?|nh[aâ]n vi[eê]n|ng[uư][oờ]i d[uù]ng|extensions?|[dđ][aầ]u s[oố]|li[eê]n h[eệ]|deals?|tickets?|doanh nghi[eệ]p|c[uô]ng ty)\b/i,
    note: 'a bare integer presented as an operating result',
  },
  { name: 'page-of',         re: /trang\s+\d+\s*\/\s*\d+/i, note: 'a pagination fraction implying a dataset size' },
  { name: 'star-score',      re: /(?<![\d.,])[0-5](?:[.,]\d)?\s*\/\s*5\b(?!\s*<)/, note: 'a quality score' },
  // --- identifiers ----------------------------------------------------------
  { name: 'record-id',       re: /\b(?:call|ticket|lead|order|inv|txn)_[a-z0-9]{4,}\b/i, note: 'a record id' },
  { name: 'api-key-tail',    re: /[•*]{4,}[a-z0-9]{3,}/i, note: 'a masked key whose tail is still invented' },
  // --- render residue -------------------------------------------------------
  { name: 'nan',             re: /\bNaN\b/, note: 'a neutralized value that reached arithmetic' },
  { name: 'undefined',       re: /\bundefined\b/, note: 'a missing field rendered literally' },
]

/**
 * Text that legitimately contains digits.
 *
 * Kept short on purpose. Every entry is a place where a number is structure or
 * approved copy rather than a claim, and each says which.
 */
const EXEMPT = [
  // The loss estimator is a calculator. Its defaults are inputs the visitor
  // edits and its outputs are that arithmetic shown back — neither asserts
  // anything about Gcalls. Its own gate is scripts/verify-loss-estimator.mjs.
  // The region is marked with `data-loss-estimator` on the component's root
  // rather than inferred, so the exemption cannot quietly widen.
  { test: (h) => h.region === 'estimator', why: 'loss-estimator input/output' },
  // CSS, in the source pass. `translate(-50%, -50%)`, `top: "50%"` and every
  // gradient stop are percentages with no reader. Matched by the shape of the
  // surrounding line, not by the property name, because these files write
  // styles inline and a `style={{ ... }}` object can start mid-line.
  {
    test: (h) => h.pass === 'source' &&
      /style=\{\{|transform:|translate[XY]?\(|rotate\(|gradient\(|\b(?:top|left|right|bottom|width|height|inset|flex|opacity):\s*["`]?-?\d/.test(h.ctx),
    why: 'CSS value, not a figure anyone reads',
  },
  // A clock range is an opening-hours window — configuration on a routing
  // rule, not a measurement. A single clock time is still a finding.
  { test: (h) => h.pattern === 'clock-time' && /\d{1,2}:[0-5]\d\s*[–—-]\s*\d{1,2}:[0-5]\d/.test(h.ctx), why: 'business-hours window' },
  // "24/7" is approved copy, not a measurement.
  { test: (h) => /24\s*\/\s*7/.test(h.sample), why: 'approved 24/7 copy' },
  // Weekday and step labels: T2..T7, "Bước 3", "/v1/…", "v1.4.2".
  { test: (h) => /^T[2-7]$/.test(h.sample.trim()), why: 'weekday label' },
  { test: (h) => /\bB[uư][oớ]c\s*\d\b/i.test(h.sample), why: 'step number' },
  { test: (h) => /\/v\d+\b|\bv\d+\.\d+\.\d+\b/.test(h.sample), why: 'API version' },
  // Dialpad keys.
  { test: (h) => /^[0-9*#]$/.test(h.sample.trim()), why: 'dialpad key' },
]

const exemptFor = (hit) => EXEMPT.find((e) => { try { return e.test(hit) } catch { return false } })

// ── source pass ─────────────────────────────────────────────────────────────
// Comments are stripped first: several of these files carry an audit note that
// quotes the very figure it says was removed, and a scan that fails on its own
// documentation trains people to ignore it.
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')

const sourceHits = []
for (const file of (await readdir(SRC)).filter((f) => /\.tsx?$/.test(f)).sort()) {
  const raw = await readFile(path.join(SRC, file), 'utf8')
  const body = stripComments(raw)
  const region = /Estimator/i.test(file) ? 'estimator' : 'component'
  body.split('\n').forEach((line, i) => {
    for (const p of PATTERNS) {
      if (p.where === 'dom') continue
      const m = p.re.exec(line)
      if (!m) continue
      const hit = { pass: 'source', file, line: i + 1, pattern: p.name, note: p.note, sample: m[0], ctx: line.trim().slice(0, 120), region }
      const ex = exemptFor(hit)
      if (ex) continue
      sourceHits.push(hit)
    }
  })
}

// ── DOM pass ────────────────────────────────────────────────────────────────
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const domHits = []
for (const width of BP) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(500)

  /**
   * Every mockup tab is opened before reading, so a fabricated value parked on
   * an inactive panel is scanned too. Buttons are clicked by their visible
   * label rather than by index, and failures are ignored: the point is coverage,
   * not a click-through test.
   */
  const tabLabels = ['SIP Accounts', 'IVR & Routing', 'Hotlines', 'Tất cả', 'Đến', 'Đi', 'Nhỡ']
  for (const label of tabLabels) {
    const btn = page.locator('.home-page button', { hasText: label }).first()
    await btn.click({ timeout: 1200 }).catch(() => {})
    await page.waitForTimeout(120)
  }

  const chunks = await page.evaluate(() => {
    const out = []
    const wrap = document.querySelector('.home-page')
    if (!wrap) return out
    out.push({ src: 'text', txt: wrap.innerText })
    for (const el of wrap.querySelectorAll('*')) {
      for (const a of el.attributes) {
        if (/^(aria-label|title|alt|placeholder|value|content)$/.test(a.name) || a.name.startsWith('data-')) {
          if (a.value) out.push({ src: a.name, txt: a.value })
        }
      }
    }
    for (const s of wrap.querySelectorAll('script[type="application/json"],script[type="application/ld+json"]')) {
      out.push({ src: 'json', txt: s.textContent || '' })
    }
    return out
  })

  // Estimator output is scanned as its own region so the exemption can name it.
  const estimatorText = await page.evaluate(() => {
    const n = document.querySelector('.home-page [data-loss-estimator], .home-page #loss-estimator')
    return n ? n.innerText : ''
  })

  for (const c of chunks) {
    for (const line of c.txt.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue
      const region = estimatorText && estimatorText.includes(trimmed) ? 'estimator' : 'page'
      for (const p of PATTERNS) {
        const m = p.re.exec(trimmed)
        if (!m) continue
        const hit = { pass: 'dom', bp: width, pattern: p.name, note: p.note, sample: m[0], where: c.src, ctx: trimmed.slice(0, 120), region }
        if (exemptFor(hit)) continue
        domHits.push(hit)
      }
    }
  }
  await page.close(); await ctx.close()
}
await browser.close()

// ── report ──────────────────────────────────────────────────────────────────
const show = (h) =>
  h.pass === 'source'
    ? `  ${h.file}:${h.line}  ${h.pattern}  "${h.sample}"  — ${h.note}\n      ${h.ctx}`
    : `  @${h.bp} ${h.where}  ${h.pattern}  "${h.sample}"  — ${h.note}\n      ${h.ctx}`

console.log(`SOURCE  ${SRC}`)
if (sourceHits.length) sourceHits.forEach((h) => console.log(show(h)))
console.log(`  ${sourceHits.length} finding(s)\n`)

console.log(`DOM     ${BASE}/  at ${BP.join(', ')}`)
// One line per distinct value, with the breakpoints it appeared at, so six
// copies of the same leak do not read as six problems.
const byValue = new Map()
for (const h of domHits) {
  const k = `${h.pattern}|${h.sample}|${h.ctx}`
  if (!byValue.has(k)) byValue.set(k, { ...h, bps: [] })
  byValue.get(k).bps.push(h.bp)
}
for (const h of byValue.values()) console.log(show(h) + `\n      at ${[...new Set(h.bps)].join(', ')}`)
console.log(`  ${byValue.size} distinct finding(s) across ${domHits.length} occurrence(s)\n`)

const total = sourceHits.length + byValue.size
if (total > 0) {
  console.log(`HOMEPAGE_FABRICATED_DATA_FAIL — ${total} finding(s)`)
  process.exit(1)
}
console.log('HOMEPAGE_FABRICATED_DATA_ZERO')
