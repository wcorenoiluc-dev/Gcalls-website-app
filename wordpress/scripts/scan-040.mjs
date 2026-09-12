#!/usr/bin/env node
/**
 * GCALLS-040 final-output scan.
 *
 * Reads the HTML the acceptance run captured from the installed package and
 * looks for the things the brief forbids on a rendered page. The literals are
 * held base64 for the same reason scripts/redact-checkpoints.mjs holds them
 * that way: a scanner that contains the strings it bans cannot be run over the
 * repository that contains it.
 */
import fs from 'node:fs'
import path from 'node:path'

const DIR = process.env.GCALLS_SHOTS || '/tmp/rc-shots'
const d = (b) => Buffer.from(b, 'base64').toString()

const BANNED = [
  ['UNAPPROVED_DOMAIN_01', d('YXBwLmdjYWxscy5wbHVz')],
  ['PII_USERNAME_01', d('Z2lhbmdwdGw=')],
  ['PII_USERNAME_02', d('dGhhbnZpZW4uYQ==')],
  ['FABRICATED_IDENTITY_01', d('bGluaC50cmFuQGRlbW8uZ2NhbGxzLmNv')],
  ['REFUSED marker', 'REFUSED'],
  ['refused KPI 114', '>114<'],
  ['refused KPI 73%', '73%'],
  ['refused KPI 3:25', '3:25'],
  /*
   * The refused drawing's WINDOW TITLE, not the product name.
   * "Gcalls Analytics" is also the name of a real product and appears in body
   * copy on the home page ("Các chỉ số Gcalls Analytics theo dõi") — banning
   * the bare string would fail a page for naming its own feature. What must
   * never appear is the string as a mockup's chrome.
   */
  ['legacy analytics chrome', 'gcalls-mock__title">Gcalls Analytics'],
  ['legacy trend markup', 'data-mock-series'],
]

/* GCALLS-040: the six withheld files must not be referenced by any page. A
 * reference would now be a 404 as well as a policy breach. */
const WITHHELD = [
  'webphone-overview.webp', 'customer-profile.webp', 'call-history.webp',
  'analytics-dashboard.webp', 'agent-performance.webp', 'click-to-call.webp',
]

/* Frames the registry approves. Anything else under product-gallery/ is a leak. */
const registry = JSON.parse(fs.readFileSync(
  process.env.GCALLS_REGISTRY || 'wordpress/.release-040/gcalls-core/data/media-frames.json', 'utf8'))
const allowed = new Set(Object.values(registry.frames)
  .filter((f) => f.verdict === 'PASS').map((f) => f.file))

const files = fs.readdirSync(DIR).filter((f) => f.startsWith('html') && f.endsWith('.html'))
if (!files.length) { console.error(`no captured HTML in ${DIR}`); process.exit(2) }

let hits = 0
const perRoute = []

for (const file of files.sort()) {
  const html = fs.readFileSync(path.join(DIR, file), 'utf8')
  const route = file.replace(/^html/, '').replace(/\.html$/, '').replace(/-/g, '/') || '/'
  const found = []
  const expected = []
  const reported = []

  for (const [label, needle] of BANNED) {
    if (needle && html.includes(needle)) found.push(`${label} (${html.split(needle).length - 1}x)`)
  }

  /*
   * Emails. Gcalls' own published contact address is the point of a contact
   * page, so it is expected rather than a finding — but it is still printed,
   * because "no email at all" and "only the company's own" are different
   * results and the gate must not blur them.
   */
  const emails = [...new Set(html.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || [])]
    .filter((e) => !e.endsWith('@example.com'))
  const corporate = emails.filter((e) => /@gcalls\.co$/i.test(e))
  const foreign = emails.filter((e) => !/@gcalls\.co$/i.test(e))
  if (foreign.length) found.push(`email: ${foreign.slice(0, 3).join(',')}`)
  expected.push(...corporate)

  /*
   * Vietnamese numbers, matched loosely and then filtered by digit count, so a
   * spacing variant cannot slip past a rigid group pattern — the first version
   * of this rule missed the company's own hotline (028 7302 5469) and so
   * reported "no phone numbers" on a page that plainly shows one.
   *
   * The mockups mask their numbers (090 *** **12); Gcalls' published hotline is
   * expected. An unmasked number belonging to anyone else is the finding.
   */
  const HOTLINE = '02873025469'
  /*
   * Read the RENDERED TEXT, not the markup: matching digit runs in HTML picks
   * up SVG path data and CSS lengths ("0 7.19.5 19.5 0 0") and drowns the
   * signal. A number a visitor can see is in innerText; a number they can tap
   * is in a tel: href. Those are the two places worth reading.
   */
  const tels = (html.match(/tel:\+?[\d .()-]{6,16}/gi) || []).join(' ')
  const visible = (fs.existsSync(path.join(DIR, file.replace(/^html/, 'text').replace(/\.html$/, '.txt')))
    ? fs.readFileSync(path.join(DIR, file.replace(/^html/, 'text').replace(/\.html$/, '.txt')), 'utf8')
    : '') + ' ' + tels

  const phones = [...new Set(visible.match(/\b0[\d][\d .\u2013-]{6,13}\d\b/g) || [])]
    .map((m) => ({ raw: m.trim(), digits: m.replace(/\D/g, '') }))
    .filter((p) => p.digits.length >= 9 && p.digits.length <= 11)
  const ownPhones = phones.filter((p) => p.digits === HOTLINE)
  const otherPhones = phones.filter((p) => p.digits !== HOTLINE)
  if (otherPhones.length) found.push(`phone: ${otherPhones.slice(0, 3).map((p) => p.raw).join(',')}`)
  expected.push(...ownPhones.map((p) => p.raw))

  const withheld = WITHHELD.filter((f) => html.includes(f))
  if (withheld.length) found.push(`withheld asset referenced: ${withheld.join(',')}`)

  /*
   * Numeric KPI tiles inside a mockup. These are REPORTED, not failed: the
   * hero mockup's strip is a decision already on the record (the deltas were
   * dropped, the values kept under a caption). Reporting them means the
   * checkpoint cannot claim a page is free of performance figures when it is
   * not — which is exactly what a bare pass/fail hid before.
   */
  const kpiTiles = [...html.matchAll(/gcalls-mock__kpi"><span>([^<]{1,40})<\/span><strong>([^<]{1,12})</g)]
    .map((m) => `${m[1]}=${m[2]}`)
  if (kpiTiles.length) reported.push(`mockup KPI tiles: ${kpiTiles.join(' · ')}`)

  // Any product-gallery image the registry does not approve.
  const media = [...new Set(html.match(/product-gallery\/[A-Za-z0-9._-]+/g) || [])]
    .map((m) => m.split('/')[1]).filter((f) => !allowed.has(f))
  if (media.length) found.push(`unallowlisted media: ${media.join(',')}`)

  // External hosts, so an unexpected one is visible rather than assumed absent.
  const hosts = [...new Set((html.match(/https?:\/\/([a-z0-9.-]+)/gi) || [])
    .map((u) => u.replace(/^https?:\/\//i, '').toLowerCase()))]
    // 127.0.0.1 is this fixture; w.org/w3.org/gmpg/schema are WordPress core's
    // own link headers and profile URLs; fonts.* is the theme's declared
    // dependency. Anything else is worth a human look.
    /*
     * example.com and its subdomains are IANA-reserved for documentation, so an
     * API sample that points at api.example.com is doing the right thing — it
     * is the alternative to printing a real endpoint in a mockup.
     */
    .filter((h) => !/^127\.0\.0\.1|^localhost|^www\.w3\.org|^gmpg\.org|^schema\.org|^(api|s)\.w\.org|(^|\.)example\.(com|org|net)|^fonts\.(googleapis|gstatic)\.com/.test(h))

  perRoute.push({ route, found, hosts, expected: [...new Set(expected)], reported })
  hits += found.length
}

for (const r of perRoute) {
  const note = r.expected.length ? `clean (expected: ${r.expected.join(',')})` : 'clean'
  console.log(`${r.found.length ? 'HIT ' : 'ok  '} ${r.route.padEnd(26)} ${r.found.join(' | ') || note}`)
  if (r.hosts.length) console.log(`       UNEXPECTED external hosts: ${r.hosts.join(', ')}`)
  for (const line of r.reported) console.log(`       note: ${line}`)
}
console.log(`\nscan-040: ${files.length} route(s), ${hits} finding(s)`)
process.exit(hits > 0 ? 1 : 0)
