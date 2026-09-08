#!/usr/bin/env node
/**
 * GCALLS-053 F3 — port /cong-ty/ from the approved React source.
 *
 * WHY THIS IS A REPLACEMENT AND NOT AN ENRICHMENT
 * The Industries and Resources hubs were missing FIELDS: their six cards
 * matched React one for one and only `tags` and `cta` had been dropped, so
 * those were added without touching the approved prose. /cong-ty/ is a
 * different case. WordPress carried one section holding two cards — links to
 * the two child pages — while the approved React hub is a direct answer, three
 * principles, a four-row guide to the information pages, an onward link row and
 * a closing CTA. There was no field to restore; the content was simply not
 * there.
 *
 * So this generates the page from src/data/hubs.ts COMPANY_HUB, read as data
 * rather than transcribed, and follows the section shape the other hubs already
 * use — decisionGuide rows become numbered steps titled by their `solution`,
 * exactly as /tich-hop/ and /giai-phap/ do.
 *
 * WHAT IT REFUSES TO PUBLISH
 * The owner's constraint on this page is that nothing about the company is
 * asserted without evidence. The claim guard below runs over the generated
 * output and fails the port on a founding year, a customer or country count,
 * awards, revenue, headcount, testimonials or a superlative. It is deliberately
 * blunt: a false positive costs a minute, and a false negative publishes a
 * claim Gcalls cannot support.
 *
 * Run: node wordpress/scripts/port-company-hub-053.mjs [--check]
 */
import esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import Module from 'node:module'

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const MANIFEST = path.join(REPO, 'wordpress/wp-content/plugins/gcalls-core/data/content-pages.json')
const CHECK = process.argv.includes('--check')
const die = (m) => { console.error(`FATAL: ${m}`); process.exit(2) }

const bundled = esbuild.buildSync({
  entryPoints: [path.join(REPO, 'src/data/hubs.ts')],
  bundle: true, format: 'cjs', write: false, platform: 'node',
  loader: { '.ts': 'ts' }, logLevel: 'silent',
  alias: { '@': path.join(REPO, 'src') },
}).outputFiles[0].text
const mod = new Module('hubs')
mod._compile(bundled, path.join(REPO, 'src/data/hubs.js'))
const HUB = mod.exports.COMPANY_HUB
if (!HUB) die('COMPANY_HUB not exported from src/data/hubs.ts')

const txt = (v) => String(v ?? '').trim()

/* ---- build the sections, in the shape the other hubs already use ---- */
const sections = []

if (HUB.directAnswer) {
  sections.push({
    type: 'prose',
    from: 'directAnswer',
    heading: txt(HUB.directAnswer.question),
    body: txt(HUB.directAnswer.answer),
  })
}

if (HUB.cards?.items?.length) {
  sections.push({
    type: 'cards',
    from: 'cards',
    eyebrow: txt(HUB.cards.eyebrow),
    heading: txt(HUB.cards.h2),
    cards: HUB.cards.items.map((i) => {
      const c = { title: txt(i.title), body: txt(i.detail) }
      if (i.path) c.href = i.path
      if (txt(i.cta)) c.cta = txt(i.cta)
      return c
    }),
  })
}

if (HUB.decisionGuide?.rows?.length) {
  /* rows -> numbered steps: title is the destination, body is the situation
   * followed by what the page contains. Same mapping as /tich-hop/. */
  sections.push({
    type: 'steps',
    from: 'decisionGuide',
    eyebrow: txt(HUB.decisionGuide.eyebrow),
    heading: txt(HUB.decisionGuide.h2),
    lead: txt(HUB.decisionGuide.lead),
    steps: HUB.decisionGuide.rows.map((r, n) => ({
      n: n + 1,
      title: txt(r.solution),
      body: [txt(r.problem), txt(r.reason)].filter(Boolean).join(' '),
    })),
    note: txt(HUB.decisionGuide.note),
  })
}

if (HUB.links?.items?.length) {
  sections.push({
    type: 'cards',
    from: 'links',
    heading: txt(HUB.links.h2),
    cards: HUB.links.items.map((i) => ({ title: txt(i.label), body: '', href: i.path })),
  })
}

/* ---- claim guard, over what will actually be published ---- */
const generated = JSON.stringify(sections)
const FORBIDDEN = [
  { name: 'founding year', re: /\b(?:thành lập|từ năm|since)\s*(?:năm\s*)?(?:19|20)\d{2}\b/i },
  { name: 'customer count', re: /\b\d[\d.,]*\s*(?:\+\s*)?(?:khách hàng|doanh nghiệp|clients?|customers?)\b/i },
  { name: 'country count', re: /\b\d+\s*(?:quốc gia|nước|countries)\b/i },
  { name: 'award', re: /giải thưởng|award|chứng nhận|certified/i },
  { name: 'revenue', re: /doanh thu|revenue|tỷ đồng|triệu (?:USD|đô)/i },
  { name: 'headcount', re: /\b\d+\s*(?:nhân viên|nhân sự|thành viên|người)\b/i },
  { name: 'testimonial', re: /testimonial|khách hàng nói|đánh giá của khách/i },
  { name: 'superlative', re: /hàng đầu|số một|số 1|tiên phong|tốt nhất|duy nhất/i },
  { name: 'uptime/SLA figure', re: /\b\d{2,3}[.,]?\d*\s*%\s*(?:uptime|SLA|thời gian hoạt động)/i },
]
const hits = FORBIDDEN.flatMap((f) => {
  const m = generated.match(f.re)
  return m ? [`${f.name}: "${m[0]}"`] : []
})
if (hits.length) die(`claim guard rejected the generated /cong-ty/:\n    ${hits.join('\n    ')}`)

/* The page must carry no image beyond what the media registry approves, and the
 * official logo has no registry entry yet — so the port must not reference one. */
if (/\.(png|jpe?g|webp|svg)\b/i.test(generated)) die('generated /cong-ty/ references an image; no company image is registered yet')

const doc = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
const page = doc.pages.find((p) => p.slug === 'cong-ty')
if (!page) die('manifest has no page "cong-ty"')

const before = { sections: page.sections.length, cards: (page.sections[0]?.cards ?? []).length }

const next = {
  ...page,
  provenance: 'PORTED',
  sources: [{ file: 'src/data/hubs.ts (COMPANY_HUB)' }],
  hero: {
    eyebrow: txt(HUB.hero?.eyebrow),
    h1: txt(HUB.hero?.h1),
    description: txt(HUB.hero?.description),
    points: [],
  },
  sections,
  cta: {
    heading: txt(HUB.finalCta?.h2),
    body: txt(HUB.finalCta?.description),
    label: txt(HUB.finalCta?.primaryCta?.label),
    href: HUB.finalCta?.primaryCta?.path ?? '/lien-he/',
  },
}

const changed = JSON.stringify(page) !== JSON.stringify(next)
if (!changed) { console.log('port-company-hub-053: already ported'); process.exit(0) }

console.log(`  /cong-ty/  ${before.sections} section(s)/${before.cards} card(s) -> ${sections.length} section(s)`)
for (const s of sections) {
  console.log(`    ${s.type.padEnd(6)} from=${String(s.from).padEnd(14)} items=${(s.cards ?? s.steps ?? []).length}`)
}
console.log(`  hero h1: "${next.hero.h1}"`)
console.log('  claim guard: clean')

if (CHECK) { console.log('\n--check: not written'); process.exit(1) }

Object.assign(page, next)
fs.writeFileSync(MANIFEST, JSON.stringify(doc, null, 2) + '\n')
console.log('\nport-company-hub-053: written')
