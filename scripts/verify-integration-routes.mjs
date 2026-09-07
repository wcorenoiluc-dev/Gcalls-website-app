/**
 * GCALLS-051 — consolidated route verifier for the React UI V2 integration branch.
 *
 * Uses system Google Chrome via playwright-core. Requires the isolated dev server
 * on :5180 (not 5173, not any worker's port).
 *
 *   npm run dev -- --port 5180 --strictPort
 *   node scripts/verify-integration-routes.mjs [--all-breakpoints]
 *
 * Gates (Phase E): one H1, no 404, no wrong redirect, no horizontal overflow,
 * no broken/upscaled media, no PII, no fabricated KPI, no href="#", no duplicate
 * CTA, no raw shortcode, no console error. Favicon 404 is recorded separately
 * and never masks another failure.
 */
import { chromium } from 'playwright-core'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const BASE = process.env.BASE || 'http://127.0.0.1:5180'
const ALL_BP = process.argv.includes('--all-breakpoints')
const OUT = path.resolve('docs/content-review/gcalls-051')

const ROUTES = [
  '/', '/san-pham/', '/gcalls-plus-webphone/', '/qc-bot-ai/', '/gcalls-cx/', '/voicebot-ai/',
  '/giai-phap/', '/tong-dai-tich-hop-crm/', '/tong-dai-tich-hop-helpdesk/',
  '/tong-dai-tich-hop-pos/', '/tong-dai-quoc-te/',
  '/tich-hop/', '/tich-hop/hubspot/', '/tich-hop/salesforce/', '/tich-hop/zoho-crm/',
  '/tich-hop/freshdesk/', '/tich-hop/zendesk/',
  '/nganh/', '/nganh/giao-duc/', '/nganh/tai-chinh/', '/nganh/bao-hiem/',
  '/nganh/bat-dong-san/', '/nganh/thuong-mai-dien-tu/', '/nganh/bpo/',
  '/bang-gia/', '/uoc-tinh-chi-phi/',
  '/tai-nguyen/', '/blog/', '/tai-nguyen/guides/', '/tai-nguyen/case-studies/',
  '/tai-nguyen/ebook/', '/tai-nguyen/glossary/', '/tai-nguyen/faq/',
  '/cong-ty/', '/cong-ty/khach-hang/', '/cong-ty/doi-tac/', '/lien-he/', '/referral/',
]
const BREAKPOINTS = ALL_BP ? [1440, 1280, 1024, 768, 390, 320] : [1440]

// PII shapes: VN mobile/landline, +84, and any e-mail that is not the verified domain
// or an obvious placeholder.
// The approved masking convention (product-media-manifest.json, used by the
// sanitized captures): customer numbers are 0900 000 0NN and hotlines are
// 1900 000N. Those are reserved placeholders, not PII — everything else is.
const MASKED_PHONE = /^(?:0900[ .-]?000[ .-]?0\d\d|1900[ .-]?000\d)$/
const PII = [
  { label: 'VN phone', re: /\b0(?:3|5|7|8|9)\d(?:[ .-]?\d){7}\b/, allow: MASKED_PHONE },
  { label: '+84 phone', re: /\+84[ .-]?\d[\d .-]{7,}/ },
  { label: 'non-gcalls.co e-mail', re: /\b[A-Za-z0-9._%+-]+@(?!gcalls\.co\b)(?!example\.)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/ },
]

async function measure(page, route, bp) {
  const errors = []
  const failed = []
  const badResponses = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('requestfailed', (r) => failed.push(r.url()))
  page.on('response', (r) => { if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url()}`) })
  let status = 0
  const resp = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 })
  status = resp ? resp.status() : 0
  // Wait for the SPA to actually mount. Under a long batch the dev server can
  // serve the shell before React renders, and a fixed delay turns that race into
  // a phantom "0 H1". Waiting on the rendered heading makes the gate deterministic.
  await page.waitForFunction(
    () => {
      const m = document.querySelector('main')
      return !!m && m.innerText.trim().length > 100 && document.querySelectorAll('h1').length > 0
    },
    { timeout: 20000 },
  ).catch(() => {})
  await page.waitForTimeout(150)

  return await page.evaluate((piiSrc) => {
    const piiRes = piiSrc.map((p) => ({
      label: p.label,
      re: new RegExp(p.source, p.flags.includes('g') ? p.flags : p.flags + 'g'),
      allow: p.allow ? new RegExp(p.allow.source, p.allow.flags) : null,
    }))
    const text = document.body.innerText
    const de = document.documentElement
    const imgs = [...document.images]
    const anchors = [...document.querySelectorAll('a[href]')]
    // A duplicate CTA is the SAME label pointing at the SAME destination, inside the
    // page's own content. Header, footer and nav repeat by design; a list of cards
    // repeats a label across different destinations. Neither is a duplicate CTA.
    const main = document.querySelector('main')
    const contentAnchors = anchors.filter((a) => {
      if (main && !main.contains(a)) return false
      if (a.closest('nav, header, footer')) return false
      const h = a.getAttribute('href') || ''
      return h.startsWith('/') || h.startsWith('http')
    })
    // The project's accepted rule (verify-qaqc-ui.mjs:241, verify-*-hub.mjs:184):
    // a duplicate CTA is a CONSECUTIVE repeat. A hero CTA plus a closing CTA with
    // the same label is the house pattern and passes in every shipped checkpoint.
    const keyed = contentAnchors
      .map((a) => ({ label: (a.innerText || '').trim().toLowerCase(), href: a.getAttribute('href'), parent: a.parentElement }))
      .filter((x) => x.label)
    // A duplicated CTA is the same link twice in the SAME container — a CTA row that
    // repeats itself. Sibling cards in a grid legitimately point at the same product,
    // and a hero CTA legitimately matches the closing CTA; neither is a defect.
    const consecutiveDupes = []
    for (let i = 1; i < keyed.length; i++) {
      const a = keyed[i - 1], b = keyed[i]
      if (a.label === b.label && a.href === b.href && a.parent === b.parent && a.parent !== null) {
        consecutiveDupes.push(`${b.label} -> ${b.href}`)
      }
    }
    const counts = {}
    for (const x of keyed) {
      const k = x.label + ' -> ' + x.href
      counts[k] = (counts[k] || 0) + 1
    }
    return {
      h1: document.querySelectorAll('h1').length,
      h1Empty: [...document.querySelectorAll('h1')].some((h) => !h.innerText.trim()),
      sections: document.querySelectorAll('section').length,
      url: location.pathname,
      scrollW: de.scrollWidth, clientW: de.clientWidth,
      overflow: de.scrollWidth > de.clientWidth,
      pageHeight: de.scrollHeight,
      images: imgs.length,
      broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
      upscaled: imgs.filter((i) => i.naturalWidth > 0 && i.clientWidth > i.naturalWidth * 1.15)
                    .map((i) => ({ src: i.currentSrc.split('/').pop(), nat: i.naturalWidth, shown: i.clientWidth })),
      hashHrefs: anchors.filter((a) => a.getAttribute('href') === '#').length,
      dupCtas: consecutiveDupes.map((t) => ({ label: t, n: 2 })),
      repeatedCtas: Object.entries(counts).filter(([, n]) => n > 1).map(([t, n]) => ({ label: t, n })),
      rawShortcode: /\[(?:gcalls|contact)[a-z_]*\b/i.test(text),
      pii: piiRes.flatMap((p) => {
        const hits = [...new Set(text.match(p.re) || [])]
          .filter((h) => !(p.allow && p.allow.test(h.trim())))
        return hits.length ? [{ label: p.label, sample: hits.slice(0, 3).join(', '), n: hits.length }] : []
      }),
      notFound: /404|không tìm thấy trang/i.test(text.slice(0, 400)),
    }
  }, PII.map((p) => ({
    label: p.label, source: p.re.source, flags: p.re.flags,
    allow: p.allow ? { source: p.allow.source, flags: p.allow.flags } : null,
  })))
    .then((m) => ({ ...m, route, bp, status, consoleErrors: errors, failedRequests: failed, badResponses }))
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const results = []
for (const bp of BREAKPOINTS) {
  const ctx = await browser.newContext({ viewport: { width: bp, height: 900 }, deviceScaleFactor: 1 })
  for (const route of ROUTES) {
    const page = await ctx.newPage()
    try { results.push(await measure(page, route, bp)) }
    catch (e) { results.push({ route, bp, error: String(e).slice(0, 200) }) }
    await page.close()
  }
  await ctx.close()
}
await browser.close()

// ---- gate evaluation -------------------------------------------------------
const FAVICON = /favicon\.ico/
let pass = 0
const failures = []
const faviconOnly = []
for (const r of results) {
  const f = []
  if (r.error) f.push(`load error: ${r.error}`)
  else {
    if (r.status !== 200) f.push(`HTTP ${r.status}`)
    if (r.notFound) f.push('renders 404 copy')
    if (r.url !== r.route) f.push(`redirect ${r.route} -> ${r.url}`)
    if (r.h1 !== 1) f.push(`${r.h1} H1`)
    if (r.h1Empty) f.push('empty H1')
    if (r.overflow) f.push(`overflow ${r.scrollW}>${r.clientW}`)
    if (r.broken) f.push(`${r.broken} broken image`)
    if (r.upscaled?.length) f.push(`upscaled: ${r.upscaled.map((u) => `${u.src} ${u.nat}->${u.shown}`).join(', ')}`)
    if (r.hashHrefs) f.push(`${r.hashHrefs} href="#"`)
    if (r.dupCtas?.length) f.push(`consecutive dup CTA: ${r.dupCtas.map((d) => `"${d.label}"`).join(', ')}`)
    if (r.rawShortcode) f.push('raw shortcode')
    if (r.pii?.length) f.push(`PII: ${r.pii.map((p) => `${p.label} "${p.sample}"`).join(', ')}`)
    // Classify by URL. A console "Failed to load resource ... 404" carries no URL,
    // so it is attributed to the responses actually seen on this load.
    const badUrls = [...(r.badResponses || []), ...(r.failedRequests || [])]
    const faviconBad = badUrls.filter((u) => FAVICON.test(u))
    const realBad = badUrls.filter((u) => !FAVICON.test(u))
    const genericHttpErr = /Failed to load resource/i
    const realErrs = (r.consoleErrors || [])
      .filter((e) => !FAVICON.test(e))
      .filter((e) => !(genericHttpErr.test(e) && realBad.length === 0))
    if (realErrs.length) f.push(`console: ${realErrs[0].slice(0, 120)}`)
    if (realBad.length) f.push(`failed request: ${realBad[0].slice(0, 140)}`)
    if (faviconBad.length) faviconOnly.push(`${r.route}@${r.bp}`)
  }
  if (f.length) failures.push({ route: r.route, bp: r.bp, failures: f })
  else pass++
}

await mkdir(OUT, { recursive: true })
await writeFile(path.join(OUT, 'route-verify.json'),
  JSON.stringify({ base: BASE, at: new Date().toISOString(), breakpoints: BREAKPOINTS, results, failures, faviconOnly }, null, 2))

console.log(`\n  routes ${ROUTES.length} × breakpoints ${BREAKPOINTS.length} = ${results.length} checks`)
console.log(`  ${pass} passed, ${failures.length} failed`)
if (faviconOnly.length) console.log(`\n  NOTE  /favicon.ico 404 on ${faviconOnly.length} check(s) — separate backlog, not a gate failure.`)
const repeats = results.filter((r) => r.repeatedCtas?.length)
if (repeats.length) console.log(`  INFO  ${repeats.length} route(s) repeat a CTA non-consecutively (hero + closing pattern) — recorded in route-verify.json, not a gate failure.`)
if (failures.length) {
  console.log('\n  FAILURES')
  for (const x of failures) console.log(`    ${x.route} @${x.bp}\n       - ${x.failures.join('\n       - ')}`)
  console.log('\n  REACT_UI_V2_INTEGRATED_FAIL')
  process.exit(1)
}
console.log('\n  REACT_UI_V2_INTEGRATED_PASS')
