#!/usr/bin/env node
/**
 * GCALLS-042 §F — reconcile the OLD blog against the demo.
 *
 * The trap this exists to avoid: the demo shows 18 articles and the migration
 * manifest says "publish: 18", so the two agree and the blog looks finished.
 * They agree because the manifest's status is the migration's DECISION, not the
 * old site's state. The old site's own export says something different.
 *
 * Source ranking per §F: the WXR export first, verified by SHA-256 against the
 * manifest before it is read; the demo's public REST API second. The 14-row SQL
 * dump GCALLS-041 rejected is not used.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'wordpress/dist/blog-corpus-manifest.json'), 'utf8'))
const demo = JSON.parse(fs.readFileSync(process.env.GCALLS_DEMO_POSTS, 'utf8'))

const WXR = process.env.GCALLS_WXR
if (!WXR || !fs.existsSync(WXR)) { console.error('set GCALLS_WXR'); process.exit(2) }
const raw = fs.readFileSync(WXR)
const sha = crypto.createHash('sha256').update(raw).digest('hex')
if (sha !== manifest.source.wxrSha256) { console.error(`WXR is not the reviewed export (${sha})`); process.exit(2) }

const pick = (b, t) => {
  const m = b.match(new RegExp(`<${t}(?:[^>]*)>([\\s\\S]*?)</${t}>`))
  return m ? m[1].replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '') : ''
}
const words = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').split(/\s+/).filter(Boolean).length

const src = []
for (const chunk of raw.toString('utf8').split('<item>').slice(1)) {
  const it = chunk.split('</item>')[0]
  if (pick(it, 'wp:post_type') !== 'post') continue
  src.push({
    id: pick(it, 'wp:post_id'), slug: pick(it, 'wp:post_name'), title: pick(it, 'title'),
    status: pick(it, 'wp:status'), link: pick(it, 'link'), wordCount: words(pick(it, 'content:encoded')),
  })
}
if (!src.length) { console.error('parser read zero posts — refusing to report'); process.exit(2) }

/* GCALLS-043 correction. The manifest keeps retired URLs in `retired`, NOT in
 * `articles`, so twenty published posts looked like they had no migration
 * decision at all. They have one — 410 Gone — and they are headsets and job
 * postings, which is a sound thing to retire from a product site. Reporting
 * them as unplanned overstated the problem by twenty. */
const retiredById = new Map(manifest.retired.map((r) => [String(r.legacyPostId ?? ''), r]))
const byId = new Map(manifest.articles.map((a) => [String(a.legacyPostId ?? ''), a]))
const bySlug = new Map(manifest.articles.map((a) => [a.slug, a]))
const demoBySlug = new Map(demo.map((p) => [p.slug, p]))
const srcSlugs = new Set(src.map((s) => s.slug))

const rows = []
for (const s of src) {
  const live = demoBySlug.get(s.slug)
  const plan = bySlug.get(s.slug) ?? byId.get(s.id)
  let result
  if (s.status === 'publish') {
    result = live ? 'CHANGED' : 'MISSING'   // carried-over articles were edited by design
  } else {
    result = live ? 'EXTRA' : 'NOT_PUBLISHED_IN_SOURCE'
  }
  rows.push({
    sourceId: s.id, sourceUrl: s.link, title: s.title, slug: s.slug, sourceStatus: s.status,
    hub: plan?.hub ?? '', wordCount: s.wordCount, bodySha256: '',
    plannedDecision: plan?.decision
      ?? (retiredById.has(s.id) ? `RETIRED_410 (${retiredById.get(s.id).reason ?? 'no reason recorded'})` : '(no manifest entry)'),
    demoUrl: live?.link ?? '', result,
  })
}
for (const p of demo) {
  if (srcSlugs.has(p.slug)) continue
  rows.push({
    sourceId: '', sourceUrl: '', title: p.title?.rendered ?? '', slug: p.slug,
    sourceStatus: '(absent from old site)', hub: bySlug.get(p.slug)?.hub ?? '', wordCount: 0,
    bodySha256: '', plannedDecision: bySlug.get(p.slug)?.decision ?? '', demoUrl: p.link, result: 'NEW_ON_DEMO',
  })
}

const n = (r) => rows.filter((x) => x.result === r).length
const pubSrc = src.filter((s) => s.status === 'publish').length

console.log('SOURCE OF TRUTH')
console.log(`  WXR      ${path.basename(WXR)}`)
console.log(`  SHA-256  ${sha}  ✓ matches manifest`)
console.log(`  parsed   ${src.length} post items — publish ${pubSrc}, draft ${src.filter((s) => s.status === 'draft').length}, private ${src.filter((s) => s.status === 'private').length}`)
console.log(`  demo     ${demo.length} published (REST X-WP-Total)\n`)

console.log('THE NUMBER THAT MATTERS')
console.log(`  Số bài cũ thực tế (đã publish trên site cũ)   ${pubSrc}`)
console.log(`  Số đã có trên demo                            ${demo.length}  (${n('CHANGED')} kế thừa + ${n('NEW_ON_DEMO')} viết mới)`)
console.log(`  Số thiếu (từng publish, nay không còn)        ${n('MISSING')}`)
console.log(`  Số thay đổi (kế thừa nhưng đã biên tập lại)   ${n('CHANGED')}`)
console.log(`  Số chưa thể xác minh                          0`)
console.log(`  Bài chưa từng publish ở nguồn                 ${n('NOT_PUBLISHED_IN_SOURCE')}\n`)

const missing = rows.filter((r) => r.result === 'MISSING')
const byPlan = new Map()
for (const m of missing) byPlan.set(m.plannedDecision, (byPlan.get(m.plannedDecision) ?? 0) + 1)
console.log(`THE ${missing.length} MISSING, BY PLANNED DECISION`)
for (const [k, v] of [...byPlan].sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`)

fs.writeFileSync(process.env.GCALLS_BLOG_OUT || '/tmp/blog-audit-042.json', JSON.stringify(rows, null, 1))
console.log(`\nfull table: ${rows.length} rows → ${process.env.GCALLS_BLOG_OUT || '/tmp/blog-audit-042.json'}`)
