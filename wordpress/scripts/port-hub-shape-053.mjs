#!/usr/bin/env node
/**
 * GCALLS-053 F3 — /nganh/ and /tai-nguyen/ are one card grid and nothing else.
 *
 * WHAT IS WRONG WITH THEM
 * Six of the eight hub routes carry the same shape: a direct answer to the
 * question the route is asking, the cards, sometimes a decision guide, and a
 * row of onward links. /san-pham/, /giai-phap/, /tich-hop/ and now /cong-ty/
 * all have it. /nganh/ and /tai-nguyen/ have ONE `cards` section holding six
 * cards, so each is a wall of six boxes under an h1 with no answer above it and
 * no way onward below it. port-hubs-053 gave those cards their missing `tags`
 * and `cta` — a card-level fix that could not change the page's shape.
 *
 * WHAT THIS ADDS, AND WHAT IT DELIBERATELY DOES NOT TOUCH
 * Adds the `directAnswer` and `links` sections from the approved React hub
 * (src/data/hubs.ts, INDUSTRIES_HUB and RESOURCES_HUB), read as data.
 *
 * It does NOT touch the hero, the h1, the six cards or the closing CTA. Those
 * came from a DIFFERENT source — src/data/industries/index.ts and
 * src/data/resources/index.ts — and their prose and h1 diverge from the React
 * hub's. Replacing them is an SEO and copy decision for the owner, not
 * something a port script gets to make; adding the two sections the page never
 * had is not.
 *
 * ONE CLAIM IS NEUTRALISED RATHER THAN PORTED
 * RESOURCES_HUB's direct answer ends by dividing the six categories into ones
 * that "đã có nội dung đầy đủ" and ones that only "nêu rõ phạm vi nội dung và
 * trạng thái thật", with Blog in the second group. That is true of the React
 * preview, where every catalog entry is a draft — and false of WordPress, where
 * /blog/ is the posts page for real published articles. It is the same
 * falsehood as the "Chưa có bài viết" tag the Blog card used to carry, in prose
 * form. The sentence is dropped, and the script prints that it was.
 *
 * The claim guard from port-company-hub-053 runs over the generated output.
 *
 * Run: node wordpress/scripts/port-hub-shape-053.mjs [--check]
 */
import esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import Module from 'node:module'

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const MANIFEST = path.join(REPO, 'wordpress/wp-content/plugins/gcalls-core/data/content-pages.json')
const CHECK = process.argv.includes('--check')
const die = (m) => { console.error(`FATAL: ${m}`); process.exit(2) }
const txt = (v) => String(v ?? '').trim()

const entry = path.join(REPO, 'src/data/hubs.ts')
const bundled = esbuild.buildSync({
  entryPoints: [entry],
  bundle: true, format: 'cjs', write: false, platform: 'node',
  loader: { '.ts': 'ts' }, logLevel: 'silent',
  alias: { '@': path.join(REPO, 'src') },
}).outputFiles[0].text
const mod = new Module('hubs')
mod._compile(bundled, entry.replace(/\.ts$/, '.js'))

/*
 * Sentences that must not be published as written, with the reason. Matched
 * literally against the React string — a source edit that changes the wording
 * makes the removal MISS, so the guard below also refuses to publish a direct
 * answer that still asserts Blog has no articles.
 */
const NEUTRALISE = [
  {
    hub: 'RESOURCES_HUB',
    sentence: ' Glossary, FAQ và Guides đã có nội dung đầy đủ; Blog, Case Studies và Ebook nêu rõ phạm vi nội dung và trạng thái thật của từng danh mục.',
    why: 'places Blog among the categories with no articles. On WordPress /blog/ is the posts page for published articles, so the claim is false here.',
  },
]

/* Nothing may be published that still says the Blog is empty, however phrased. */
const BLOG_EMPTY = /Blog[^.]*(?:chưa có|trạng thái thật|đang xây dựng)/i

const TARGETS = [
  { slug: 'nganh', hub: 'INDUSTRIES_HUB' },
  { slug: 'tai-nguyen', hub: 'RESOURCES_HUB' },
]

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

const doc = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
const before = JSON.stringify(doc)
const dropped = []

for (const { slug, hub } of TARGETS) {
  const HUB = mod.exports[hub]
  if (!HUB) die(`${hub} not exported from src/data/hubs.ts`)

  const page = doc.pages.find((p) => p.slug === slug)
  if (!page) die(`manifest has no page "${slug}"`)

  /* --- direct answer --- */
  if (HUB.directAnswer && !page.sections.some((s) => s.from === 'directAnswer')) {
    let answer = txt(HUB.directAnswer.answer)

    for (const rule of NEUTRALISE) {
      if (rule.hub !== hub) continue
      if (!answer.includes(rule.sentence.trim())) {
        die(`${hub}: the sentence to neutralise is no longer in the source — re-read it before porting:\n    "${rule.sentence.trim()}"`)
      }
      answer = answer.replace(rule.sentence, '').replace(/\s+/g, ' ').trim()
      dropped.push(`/${slug}/ — dropped: "${rule.sentence.trim()}"\n      reason: ${rule.why}`)
    }

    if (BLOG_EMPTY.test(answer)) {
      die(`${slug}: the direct answer still says the Blog has no articles`)
    }

    page.sections.unshift({
      type: 'prose',
      from: 'directAnswer',
      heading: txt(HUB.directAnswer.question),
      body: answer,
    })
  }

  /* --- onward links --- */
  if (HUB.links?.items?.length && !page.sections.some((s) => s.from === 'links')) {
    page.sections.push({
      type: 'cards',
      from: 'links',
      variant: 'related',
      heading: txt(HUB.links.h2),
      cards: HUB.links.items.map((i) => ({ title: txt(i.label), body: '', href: i.path })),
    })
  }

  const generated = JSON.stringify(page.sections)
  const hits = FORBIDDEN.flatMap((f) => {
    const m = generated.match(f.re)
    return m ? [`${f.name}: "${m[0]}"`] : []
  })
  if (hits.length) die(`claim guard rejected /${slug}/:\n    ${hits.join('\n    ')}`)
  if (/\.(png|jpe?g|webp|svg)\b/i.test(generated)) die(`/${slug}/ references an image; none is registered`)

  console.log(`  /${slug}/  ${page.sections.length} section(s): ` +
    page.sections.map((s) => `${s.type}(${(s.cards ?? s.steps ?? []).length})`).join(' '))
  console.log(`    hero h1 unchanged: "${txt(page.hero?.h1)}"`)
}

if (dropped.length) {
  console.log('\n  NEUTRALISED:')
  for (const line of dropped) console.log(`    ${line}`)
}

const after = JSON.stringify(doc)
if (after === before) { console.log('\nport-hub-shape-053: already ported'); process.exit(0) }
if (CHECK) { console.log('\n--check: not written'); process.exit(1) }

fs.writeFileSync(MANIFEST, JSON.stringify(doc, null, 2) + '\n')
console.log('\nport-hub-shape-053: written')
