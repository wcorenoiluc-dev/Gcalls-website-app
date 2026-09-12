#!/usr/bin/env node
/**
 * GCALLS-048 — merge the four worker verdict sets into ONE row per article.
 *
 * WHY THIS FILE EXISTS
 * The brief asks for a single 163-row table. Three workers produced three
 * independent JSON files keyed on legacyId, each with its own verdict
 * vocabulary. Reading them side by side is how a per-article blocker gets
 * lost between two documents.
 *
 * It also attaches the LIVE post id. The premise of the brief was that the
 * 163 still had to be imported; they are already in the database as drafts,
 * so every row here names the post it is actually talking about.
 *
 * Usage: node wordpress/scripts/merge-048-verdicts.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const OUT = path.join(ROOT, 'docs/content-review/gcalls-048/blog-verdicts-048.json')

const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const dry = read(path.join(ROOT, 'docs/content-review/gcalls-047/blog-dryrun-047.json'))
const A = read('/tmp/workerA-content-verdicts.json')
const B = read('/tmp/workerB-media-map.json')
const C = read('/tmp/workerC-seo-links.json')

/* Live post ids, in dry-run batch order — read out of the authenticated REST
 * API on the demo, matched to the manifest by slug. */
const LIVE_IDS = '190,189,271,187,186,208,251,252,302,303,306,309,304,310,314,315,317,318,321,320,328,330,322,337,338,339,359,363,366,368,376,185,341,344,346,348,347,191,284,188,270,274,275,199,200,201,202,203,276,204,205,206,207,277,209,279,210,211,280,212,213,214,281,215,216,217,222,282,283,268,269,226,223,227,261,293,292,295,298,299,316,325,334,345,353,369,370,371,374,377,184,195,313,326,329,331,333,336,340,350,349,351,352,354,355,358,364,372,375,378,380,382,393,294,312,391,228,196,198,192,193,183,272,194,197,225,285,286,399,287,289,288,291,290,319,323,327,332,335,343,356,357,360,361,362,365,367,373,379,381,383,384,386,385,387,390,392,389,388,395,394,396,398'
  .split(',').map(Number)

const order = dry.proposal.batches.flatMap((b) => b.articles)
if (order.length !== LIVE_IDS.length) throw new Error(`order ${order.length} vs ids ${LIVE_IDS.length}`)

const byId = (rows) => new Map(rows.map((r) => [r.legacyId, r]))
const a = byId(A.articles)
const b = byId(B.articles)
const c = byId(C.articles)

/*
 * The overall verdict is the WORST of the three, not an average. A blocker in
 * any one dimension blocks the article: an article whose every image 404s is
 * not "mostly fine" because its SEO parses.
 */
const RANK = { PASS: 0, FIX: 1, MISSING: 2, MANUAL_REVIEW: 3, DUPLICATE: 3 }
const tier = (v) => RANK[String(v).replace(/^(CONTENT|MEDIA|SEO)_/, '')] ?? 3

const rows = order.map((art, i) => {
  const ra = a.get(art.legacyId)
  const rb = b.get(art.legacyId)
  const rc = c.get(art.legacyId)
  if (!ra || !rb || !rc) throw new Error(`missing worker row for ${art.legacyId}`)

  const three = [ra.verdict, rb.verdict, rc.verdict]
  const worst = three.reduce((w, v) => (tier(v) > tier(w) ? v : w), three[0])

  /* Blockers are the reasons a human has to look, stated per dimension so the
   * row says WHICH worker is holding it up. */
  const blockers = []
  if (tier(ra.verdict) >= 3) blockers.push(`content: ${(ra.reasons ?? []).slice(0, 2).join('; ') || ra.verdict}`)
  if (tier(rb.verdict) >= 2) blockers.push(`media: ${rb.verdict_reason ?? rb.verdict}`)
  if (tier(rc.verdict) >= 3) blockers.push(`seo: ${(rc.issues ?? []).slice(0, 2).join('; ') || rc.verdict}`)

  return {
    legacyId: art.legacyId,
    livePostId: LIVE_IDS[i],
    liveStatus: 'draft',
    slug: art.slug,
    title: art.title,
    hub: art.hub,
    batchId: dry.proposal.batches.find((x) => x.articles.includes(art)).batchId,
    plannedDecision: art.plannedDecision,
    verdicts: { content: ra.verdict, media: rb.verdict, seo: rc.verdict, overall: worst },
    readyToPublish: tier(worst) === 0,
    blockers,
    media: {
      totalRefs: rb.counts?.total ?? 0,
      bodyImages: rb.counts?.body ?? 0,
      dropReference: rb.counts?.drop_reference ?? 0,
      uploadFresh: rb.counts?.upload_fresh ?? 0,
      holdFetchAndVerify: rb.counts?.hold_fetch_and_verify ?? 0,
      noneAvailable: rb.counts?.none_available ?? 0,
      bodyWithoutAlt: rb.counts?.body_without_alt ?? 0,
      /* An article whose every body image is on the dead CDN imports as a wall
       * of text. That is a content change by omission, so it is called out
       * rather than folded into the media count. */
      losesAllBodyImages: (rb.counts?.body ?? 0) > 0 && (rb.counts?.drop_reference ?? 0) >= (rb.counts?.body ?? 0),
      featuredResolvable: rb.verdict !== 'MEDIA_MISSING',
      mediaIfFeaturedFetched: rb.verdict_if_featured_fetch_succeeds ?? null,
    },
    seo: {
      titleState: rc.seoTitleState ?? null,
      deadInternalLinks: rc.deadInternalCount ?? 0,
      oldSlugAliases: (rc.legacyOldSlugs ?? []).length,
      headingIssues: (rc.issues ?? []).filter((s) => /heading|h1|h2/i.test(s)).length,
    },
    contentFixes: (ra.fixes ?? []).length,
  }
})

const tally = (pick) => rows.reduce((m, r) => { const k = pick(r); m[k] = (m[k] ?? 0) + 1; return m }, {})

const doc = {
  kind: 'GCALLS-048 merged blog verdicts',
  status: 'ANALYSIS_ONLY — no post was created, edited, published or deleted',
  generatedAt: new Date().toISOString(),
  premiseCorrection:
    'The brief assumed the 163 still had to be imported. They are ALREADY in the demo database as drafts, at their exact target slugs, with byte-faithful legacy bodies. Verified against the authenticated REST API. Nothing remains to import; what remains is media localisation, link/SEO repair, and the publish decision.',
  liveState: {
    totalPosts: 250,
    published: 18,
    draft: 230,
    private: 2,
    trash: 1,
    the163: 'all present, all draft, 0 published',
    retired410: 'all 20 correctly ABSENT — never imported',
    englishManualDecision: 'legacy 14773 IS present as draft 324, though the dry-run excluded it pending an owner decision',
  },
  articleCount: rows.length,
  aggregate: {
    overall: tally((r) => r.verdicts.overall),
    content: tally((r) => r.verdicts.content),
    media: tally((r) => r.verdicts.media),
    seo: tally((r) => r.verdicts.seo),
    readyToPublishNow: rows.filter((r) => r.readyToPublish).length,
  },
  articles: rows,
}

fs.writeFileSync(OUT, `${JSON.stringify(doc, null, 2)}\n`)
console.log(`merged ${rows.length} rows → ${path.relative(ROOT, OUT)}`)
console.log('overall:', JSON.stringify(doc.aggregate.overall))
console.log('ready to publish with no human decision:', doc.aggregate.readyToPublishNow)
