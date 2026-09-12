#!/usr/bin/env node
/**
 * GCALLS-050 — extract what each of the 163 articles is ABOUT, and what each
 * image in it is standing next to.
 *
 * WHY THIS FILE EXISTS
 * The brief is explicit: "Đọc body và heading thực tế của từng bài, không chọn
 * ảnh chỉ bằng tiêu đề." A title is not enough to choose an image. So this
 * pulls, per article: the headings in order, the opening prose, and for every
 * <img> the paragraph before and after it — which is the only evidence of what
 * that image was there to explain.
 *
 * Bodies come from the WXR, which GCALLS-048 proved byte-identical to the live
 * drafts (704 imgs / 288 links / 239 dead refs all reproduce). Reading the file
 * therefore needs no live access and cannot perturb the site.
 *
 * Usage: node wordpress/scripts/extract-bodies-050.mjs --wxr <path>
 */
import fs from 'node:fs'
import crypto from 'node:crypto'

const wxr = process.argv[process.argv.indexOf('--wxr') + 1]
if (!wxr || !fs.existsSync(wxr)) { console.error('need --wxr <path>'); process.exit(2) }

const EXPECT = '175876aff0f312782bda607bac28efd5e5db723d180f2a05740ddf169487f510'
const raw = fs.readFileSync(wxr)
const got = crypto.createHash('sha256').update(raw).digest('hex')
if (got !== EXPECT) { console.error(`WXR sha256 mismatch\n  want ${EXPECT}\n  got  ${got}`); process.exit(2) }

const verdicts = JSON.parse(fs.readFileSync('docs/content-review/gcalls-048/blog-verdicts-048.json', 'utf8'))
const want = new Map(verdicts.articles.map((a) => [a.legacyId, a]))

const xml = raw.toString('utf8')
const items = xml.split('<item>').slice(1)

const cdata = (s) => s.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '')
const pick = (block, tag) => {
  const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))
  return m ? cdata(m[1]).trim() : ''
}
const strip = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"').replace(/&#8217;/g, '’').replace(/\s+/g, ' ').trim()

const out = []
for (const block of items) {
  const id = Number(pick(block, 'wp:post_id'))
  if (!want.has(id)) continue
  const body = pick(block, 'content:encoded')

  /* Headings in document order — the article's actual skeleton. */
  const headings = [...body.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((m) => ({ level: Number(m[1]), text: strip(m[2]) }))
    .filter((h) => h.text)

  /* Paragraph text, in order, for lead + context lookup. */
  const paras = [...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => strip(m[1])).filter((t) => t.length > 40)

  /*
   * For each <img>, the nearest text before and after. This is the whole point
   * of the file: an image's meaning is the prose it sits between, and choosing
   * a replacement without it is choosing by filename.
   */
  const images = []
  const re = /<img[^>]*>/gi
  let m
  while ((m = re.exec(body))) {
    const tag = m[0]
    const src = (tag.match(/\ssrc=["']([^"']+)["']/i) || [])[1] || null
    const alt = (tag.match(/\salt=["']([^"']*)["']/i) || [])[1] ?? null
    const before = strip(body.slice(Math.max(0, m.index - 1400), m.index)).slice(-320)
    const after = strip(body.slice(m.index + tag.length, m.index + tag.length + 1400)).slice(0, 320)
    /* Which heading section the image falls under. */
    let section = ''
    for (const h of headings) {
      const at = body.indexOf(h.text.slice(0, 30))
      if (at !== -1 && at < m.index) section = h.text
    }
    images.push({
      src, alt,
      inCaption: /\[caption/.test(body.slice(Math.max(0, m.index - 200), m.index)),
      section, before, after,
    })
  }

  const v = want.get(id)
  out.push({
    legacyId: id,
    livePostId: v.livePostId,
    slug: v.slug,
    title: v.title,
    hub: v.hub,
    plannedDecision: v.plannedDecision,
    wordCount: strip(body).split(/\s+/).length,
    headings,
    lead: paras.slice(0, 2).join(' ').slice(0, 700),
    paraSample: paras.slice(2, 8).map((p) => p.slice(0, 220)),
    imageCount: images.length,
    images,
  })
}

if (out.length !== 163) { console.error(`extracted ${out.length}, expected 163`); process.exit(1) }
fs.mkdirSync('.media-050', { recursive: true })
fs.writeFileSync('.media-050/bodies-163.json', JSON.stringify(out, null, 1))
console.log(`extracted ${out.length} articles`)
console.log(`  headings total : ${out.reduce((n, a) => n + a.headings.length, 0)}`)
console.log(`  images total   : ${out.reduce((n, a) => n + a.imageCount, 0)}`)
console.log(`  no headings    : ${out.filter((a) => !a.headings.length).length}`)
console.log(`  wrote .media-050/bodies-163.json (${(fs.statSync('.media-050/bodies-163.json').size / 1e6).toFixed(1)} MB)`)
