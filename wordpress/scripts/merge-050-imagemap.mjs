#!/usr/bin/env node
/**
 * GCALLS-050 — one image map, from three independent readings.
 *
 * WHY THIS FILE EXISTS
 * Workers A, C and D each answered §4 ("which images carry information we
 * cannot honestly recreate") separately, and they DISAGREE — A found 27 prose
 * pointers, C found 5, D found 26 HIGH and argues the real binding is the
 * [caption] shortcode rather than the prose. Disagreement is the useful signal
 * here: the safe set is the UNION, not the majority. Replacing an
 * information-bearing figure with decoration is the worst outcome available in
 * this task, so any single worker's objection is enough to protect an image.
 *
 * Usage: node wordpress/scripts/merge-050-imagemap.mjs
 */
import fs from 'node:fs'

const A = JSON.parse(fs.readFileSync('/tmp/workerA-imagemap-050.json', 'utf8'))
const C = JSON.parse(fs.readFileSync('/tmp/workerC-body-specs-050.json', 'utf8'))
const D = JSON.parse(fs.readFileSync('/tmp/workerD-figure-refs-050.json', 'utf8'))

/* --- protected sets, one per worker, keyed by "<legacyId>#<bodyIndex>" ----
 * Each worker keyed its findings differently — A by slot, C by image URL, D by
 * article+index — so each is normalised onto the same key before the union. */
const protectedBy = new Map()
const protect = (key, who, why) => {
  if (!protectedBy.has(key)) protectedBy.set(key, { key, by: [], why: [] })
  const e = protectedBy.get(key)
  if (!e.by.includes(who)) { e.by.push(who); e.why.push(`${who}: ${String(why).slice(0, 160)}`) }
}
const bodyIndex = (slot) => { const m = /^body\[(\d+)\]$/.exec(slot ?? ''); return m ? Number(m[1]) : null }

/* C keyed NEEDS_SOURCE by image URL, so it protects every slot using that URL. */
const cByUrl = new Map()
for (const n of C.needsSource ?? []) cByUrl.set(n.src, n)

for (const art of A.articles) {
  for (const im of art.imageSlots ?? []) {
    const bi = bodyIndex(im.slot)
    if (bi === null) continue
    const key = `${art.legacyId}#${bi}`
    if (im.action === 'NEEDS_SOURCE') protect(key, 'A', im.actionReason)
    if (im.prosePointsAtFigure) protect(key, 'A', 'prose points at figure')
    const c = cByUrl.get(im.oldUrl)
    if (c) protect(key, 'C', c.whyNotRedrawable ?? c.subtype ?? 'NEEDS_SOURCE')
  }
}
for (const f of D.findings ?? []) {
  if (!['HIGH', 'MEDIUM'].includes(String(f.confidence).toUpperCase())) continue
  protect(`${f.article.legacyId}#${f.image_index}`, 'D',
    `${f.confidence}: ${f.strongest_direct_match ?? f.caption_text ?? f.basis ?? 'figure ref'}`)
}

/* --- assemble ------------------------------------------------------------- */
const BANNER = 'Screenshot-2021-06-21-at-17.51.50.png'
const rows = []
const stats = {}
const bump = (k) => { stats[k] = (stats[k] ?? 0) + 1 }

for (const art of A.articles) {
  const feat = (art.imageSlots ?? []).find((im) => im.slot === 'featured') ?? null
  const body = (art.imageSlots ?? []).filter((im) => bodyIndex(im.slot) !== null)

  const images = body.map((im) => {
    const i = bodyIndex(im.slot)
    const prot = protectedBy.get(`${art.legacyId}#${i}`)
    let action = im.action
    let downgraded = null

    if ((im.oldUrl ?? '').includes(BANNER)) { action = 'DROP_BOILERPLATE' }
    else if (action === 'REPLACE' && prot) { action = 'NEEDS_SOURCE'; downgraded = 'protected by ' + prot.by.join('+') }
    /* A reported 117 of its own REPLACEs as weak evidence. A guess is not a
     * licence to draw over someone else's figure, so those are held too. */
    else if (action === 'REPLACE' && im.evidence === 'weak') { action = 'NEEDS_SOURCE'; downgraded = 'evidence: weak' }

    bump(action)
    return {
      index: i, oldUrl: im.oldUrl, role: im.role, hostStatus: im.oldHostStatus,
      action, originalAction: im.action, downgraded,
      reason: im.actionReason, evidence: im.evidence ?? null,
      protectedBy: prot ? prot.by : [], protectionWhy: prot ? prot.why : [],
    }
  })

  rows.push({
    legacyId: art.legacyId, livePostId: art.livePostId, slug: art.slug, title: art.title,
    hub: art.hub, topic: art.topic, intent: art.intent, keyPoints: art.keyPoints,
    visualConcept: art.visualConcept,
    featured: { action: feat?.action ?? 'REPLACE', oldUrl: feat?.oldUrl ?? null, evidence: feat?.evidence ?? null,
      note: 'featured URLs are INFERRED from Schema Pro JSON-LD, not from an attachment record; none has been fetched' },
    images,
    bodyImageCount: images.length,
    needsSourceCount: images.filter((x) => x.action === 'NEEDS_SOURCE').length,
  })
}

const doc = {
  kind: 'GCALLS-050 merged image map',
  status: 'ANALYSIS_ONLY — nothing uploaded, nothing written to WordPress',
  generatedAt: new Date().toISOString(),
  reconciliation: {
    note: 'Protection is a UNION across three independent readings. Any one worker objecting is enough.',
    protectedSlots: protectedBy.size,
    byWorkerCount: [...protectedBy.values()].reduce((m, e) => { m[e.by.length] = (m[e.by.length] ?? 0) + 1; return m }, {}),
    agreedByAllThree: [...protectedBy.values()].filter((e) => e.by.length === 3).length,
    flaggedByOnlyOne: [...protectedBy.values()].filter((e) => e.by.length === 1).length,
  },
  bodyActionTotals: stats,
  downgradedReplaces: rows.flatMap((r) => r.images).filter((i) => i.downgraded).length,
  articleCount: rows.length,
  articles: rows,
}
fs.writeFileSync('docs/content-review/gcalls-050/image-map-050.json', JSON.stringify(doc, null, 1))
console.log('protected slots (union):', protectedBy.size, JSON.stringify(doc.reconciliation.byWorkerCount))
console.log('body actions:', JSON.stringify(stats))
console.log('articles with >=1 NEEDS_SOURCE:', rows.filter((r) => r.needsSourceCount).length)
