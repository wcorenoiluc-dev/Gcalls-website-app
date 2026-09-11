/**
 * Dry run over all 250 articles. Plans; writes nothing.
 *
 * WHAT "DRY RUN" MEANS HERE, EXACTLY
 * This script has no write path. It opens a database dump, reads, and produces
 * a plan plus a rollback manifest as JSON in wordpress/dist/. It cannot reach
 * WordPress, cannot publish a draft, cannot create an attachment and cannot
 * touch the importer. The plan it emits is what a later, separate, approved
 * step would carry out — and that step does not exist yet.
 *
 * THE OUTCOMES, AND WHY EACH EXISTS
 *   SKIP_PROTECTED      IDs 100–117. Published, being edited by a person now.
 *                       Nothing may touch their body, meta or modified date.
 *   SKIP_HUMAN_EDITED   Body hash moved since the baseline. Someone is working
 *                       on it; a batch must not land on top of that.
 *   MANUAL_REVIEW       An editor has to decide. Empty bodies, articles whose
 *                       hub cannot be inferred with confidence, and media that
 *                       cannot be localized safely.
 *   ELIGIBLE            Could be processed by the later step, unattended.
 *
 * MEDIA
 * Not one image in the corpus is hosted on this site. 169 articles hotlink
 * gcalls.co, which is production and off limits for anything but a public GET;
 * 87 point at cdn.gcalls.co / cdn.cdn.gcalls.co, which do not resolve at all.
 * The plan therefore splits into LOCALIZE (fetchable, real image bytes) and
 * FALLBACK_COVER (unreachable — the drawn HUB cover stands in, and no broken
 * image is ever rendered).
 *
 *   node wordpress/scripts/corpus-dry-run.mjs <dump.sql> [--http N]
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'dist')
const PLUGIN = path.join(HERE, '..', 'wp-content/plugins/gcalls-core')

const args = process.argv.slice(2)
const dumpPath = args.find((a) => !a.startsWith('--'))
const httpArg = args.indexOf('--http')
const HTTP_N = httpArg !== -1 ? Number(args[httpArg + 1]) : 0

if (!dumpPath) {
  console.error('usage: node wordpress/scripts/corpus-dry-run.mjs <dump.sql> [--http N]')
  process.exit(2)
}

const sql = fs.readFileSync(dumpPath, 'utf8')
const PREFIX = 'Qyr_default'

function columns(table) {
  const m = sql.match(new RegExp('CREATE TABLE `' + table + '` \\(([\\s\\S]*?)\\n\\) ENGINE'))
  if (!m) throw new Error(`no CREATE TABLE for ${table}`)
  return [...m[1].matchAll(/^\s*`([a-zA-Z0-9_]+)`\s+[a-z]/gm)].map((x) => x[1])
}

function rows(table) {
  const cols = columns(table)
  const out = []
  const marker = 'INSERT INTO `' + table + '` VALUES '
  let idx = 0
  while ((idx = sql.indexOf(marker, idx)) !== -1) {
    let i = idx + marker.length
    while (i < sql.length) {
      if (sql[i] === ';') { i++; break }
      if (sql[i] !== '(') { i++; continue }
      i++
      const vals = []
      let cur = ''
      let inStr = false
      while (i < sql.length) {
        const c = sql[i]
        if (inStr) {
          if (c === '\\') {
            const n = sql[i + 1]
            const map = { n: '\n', r: '\r', t: '\t', 0: '\0', b: '\b', Z: '\x1a' }
            cur += n in map ? map[n] : n
            i += 2
            continue
          }
          if (c === "'") { inStr = false; i++; continue }
          cur += c; i++; continue
        }
        if (c === "'") { inStr = true; i++; continue }
        if (c === ',') { vals.push(cur.trim()); cur = ''; i++; continue }
        if (c === ')') { vals.push(cur.trim()); i++; break }
        cur += c; i++
      }
      const rec = {}
      cols.forEach((c, k) => (rec[c] = vals[k]))
      out.push(rec)
      while (i < sql.length && (sql[i] === ',' || sql[i] === ' ' || sql[i] === '\n')) i++
    }
    idx = i
  }
  return out
}

const posts = rows(PREFIX + 'posts')
const meta = rows(PREFIX + 'postmeta')
const trel = rows(PREFIX + 'term_relationships')
const ttax = rows(PREFIX + 'term_taxonomy')
const terms = rows(PREFIX + 'terms')

const termById = Object.fromEntries(terms.map((t) => [t.term_id, t]))
const hubTt = new Map(
  ttax.filter((t) => t.taxonomy === 'gcalls_hub').map((t) => [t.term_taxonomy_id, termById[t.term_id]]),
)
const hubOf = new Map()
for (const r of trel) {
  const term = hubTt.get(r.term_taxonomy_id)
  if (term) hubOf.set(r.object_id, term)
}

const metaByPost = new Map()
for (const m of meta) {
  if (!metaByPost.has(m.post_id)) metaByPost.set(m.post_id, {})
  metaByPost.get(m.post_id)[m.meta_key] = m.meta_value ?? ''
}

/* Canonical hubs, parsed from the plugin. */
const hubSrc = fs.readFileSync(path.join(PLUGIN, 'includes/class-hub-taxonomy.php'), 'utf8')
const hubsBlock = hubSrc.slice(hubSrc.indexOf('private const HUBS = array('), hubSrc.indexOf('\n\t);', hubSrc.indexOf('private const HUBS')))
const CANONICAL = [...hubsBlock.matchAll(/'(HUB-\d+)'\s*=>\s*array\(\s*'slug'\s*=>\s*'([^']+)',\s*'name'\s*=>\s*'([^']+)'/g)]
  .map(([, id, slug, name]) => ({ id, slug, name }))

/**
 * Keyword evidence per hub, for proposing a hub to an article that has none.
 * Deliberately small and literal: a proposal an editor cannot check is not a
 * proposal. Anything that does not score clearly becomes MANUAL_REVIEW.
 */
const HUB_KEYWORDS = {
  'tong-dai-va-call-center': ['tổng đài', 'call center', 'virtual phone', 'phone system', 'pbx', 'hotline', 'ivr'],
  'gcalls-plus-webphone': ['webphone', 'trình duyệt', 'browser', 'softphone', 'click-to-call'],
  'crm-helpdesk-va-tich-hop': ['crm', 'helpdesk', 'tích hợp', 'integration', 'salesforce', 'hubspot', 'zendesk'],
  'telesales-va-sales-operations': ['telesales', 'telemarketing', 'chốt sale', 'sales operations', 'kịch bản bán hàng'],
  'customer-service-va-customer-experience': ['chăm sóc khách hàng', 'cskh', 'trải nghiệm khách hàng', 'customer experience', 'customer service'],
  'gcalls-cx': ['đa kênh', 'omnichannel', 'contact center'],
  'qa-qc-va-quan-tri-chat-luong': ['chất lượng cuộc gọi', 'qa', 'qc', 'chấm điểm', 'kiểm soát chất lượng'],
  'voicebot-ai-va-tu-dong-hoa': ['voicebot', 'chatbot', 'tự động hóa', 'ai '],
  'tong-dai-quoc-te': ['quốc tế', 'international', 'đầu số nước ngoài'],
  'cloud-call-center-va-lam-viec-tu-xa': ['cloud', 'làm việc từ xa', 'remote work', 'work from home'],
  'van-hanh-doanh-nghiep': ['vận hành', 'quy trình', 'quản trị doanh nghiệp', 'kpi'],
  'huong-dan-su-dung-gcalls': ['hướng dẫn sử dụng', 'cách cài đặt'],
  'case-study': ['case study', 'câu chuyện khách hàng'],
}

const strip = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')

/** Scores an article against the hub keyword sets. */
function proposeHub(title, body) {
  const text = (title + ' ' + strip(body)).toLowerCase()
  const scored = CANONICAL.map((hub) => {
    const words = HUB_KEYWORDS[hub.slug] ?? []
    const hits = words
      .map((w) => ({ w, n: text.split(w).length - 1 }))
      .filter((h) => h.n > 0)
    return { hub, score: hits.reduce((a, h) => a + h.n, 0), hits }
  }).sort((a, b) => b.score - a.score)

  const [best, second] = scored
  if (!best || best.score === 0) return { hub: null, confidence: 'none', evidence: [], alternative: null }

  // A proposal is only high-confidence when it clearly beats the runner-up.
  const margin = best.score - (second?.score ?? 0)
  const confidence = best.score >= 6 && margin >= 3 ? 'high' : best.score >= 3 ? 'medium' : 'low'

  return {
    hub: best.hub,
    confidence,
    evidence: best.hits.slice(0, 5).map((h) => `"${h.w}" ×${h.n}`),
    alternative: second && second.score > 0 ? second.hub : null,
  }
}

/* ------------------------------------------------------------- baseline */

const baselineFile = path.join(OUT, 'corpus-audit.json')
const baseline = fs.existsSync(baselineFile)
  ? new Map(JSON.parse(fs.readFileSync(baselineFile, 'utf8')).map((r) => [r.id, r.body_sha256]))
  : new Map()

/* ------------------------------------------------------------- the plan */

const PROTECTED = new Set(Array.from({ length: 18 }, (_, i) => String(100 + i)))
const SITE = 'ashernguyenxuanthuy.com'

const corpus = posts.filter(
  (p) => p.post_type === 'post' && ['publish', 'draft', 'private'].includes(p.post_status) && p.ID !== '1',
)

const mediaIndex = new Map() // url -> { articles: [], host }

const plan = corpus.map((p) => {
  const body = p.post_content ?? ''
  const m = metaByPost.get(p.ID) ?? {}
  const hub = hubOf.get(p.ID) ?? null
  const hash = crypto.createHash('sha256').update(body).digest('hex')

  const srcs = [...body.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)].map((x) => x[1])
  for (const src of srcs) {
    if (!mediaIndex.has(src)) {
      let host = '(unparseable)'
      try {
        host = src.startsWith('data:') ? '(data-uri)' : new URL(src, `https://${SITE}`).host
      } catch { /* keep the placeholder */ }
      mediaIndex.set(src, { articles: [], host })
    }
    mediaIndex.get(src).articles.push(p.ID)
  }

  const actions = []
  const reasons = []

  let outcome = 'ELIGIBLE'

  if (PROTECTED.has(p.ID)) {
    outcome = 'SKIP_PROTECTED'
    reasons.push('published article 100–117, under editorial edit')
  } else if (baseline.has(p.ID) && baseline.get(p.ID) !== hash) {
    outcome = 'SKIP_HUMAN_EDITED'
    reasons.push('body hash moved since the baseline')
  }

  /* What the later step would do, per article. */
  if (outcome === 'ELIGIBLE') {
    if (srcs.length > 0) actions.push(`rewrite ${srcs.length} image URL(s)`)
    if (!hub) {
      const proposal = proposeHub(p.post_title ?? '', body)
      if (proposal.confidence === 'high') {
        actions.push(`assign hub ${proposal.hub.slug}`)
      } else {
        outcome = 'MANUAL_REVIEW'
        reasons.push(
          proposal.hub
            ? `hub proposal only ${proposal.confidence} confidence (${proposal.hub.slug})`
            : 'no hub could be inferred',
        )
      }
    }
    if (strip(body).trim().length < 40) {
      outcome = 'MANUAL_REVIEW'
      reasons.push('body is empty or near-empty')
    }
  }

  /* Runtime renderers change nothing in the database. Recorded so the plan
   * shows what the reader gets without a write behind it. */
  const runtime = []
  if (!/gcalls-cta|\/lien-he\//.test(body)) runtime.push('CTA from HUB renderer')
  runtime.push('related articles from HUB renderer')
  if (!m.rank_math_title) runtime.push('SEO title fallback')
  if (!m.rank_math_description) runtime.push(p.post_excerpt ? 'SEO description from excerpt' : 'SEO description from body opening')
  if (!m._gcalls_faq) runtime.push('no FAQ — nothing rendered, nothing generated')
  if (srcs.length === 0) runtime.push('HUB cover (drawn)')

  return {
    id: p.ID,
    slug: p.post_name,
    status: p.post_status,
    hub: hub?.slug ?? '',
    outcome,
    reasons,
    db_actions: actions,
    runtime_only: runtime,
    images: srcs.length,
    body_sha256: hash,
  }
})

/* --------------------------------------------------------- media triage */

const UNREACHABLE_HOSTS = new Set(['cdn.gcalls.co', 'cdn.cdn.gcalls.co'])

const media = [...mediaIndex.entries()].map(([url, info]) => {
  const protectedOnly = info.articles.every((id) => PROTECTED.has(id))
  let verdict = 'LOCALIZE'
  let reason = 'reachable host; fetch, verify MIME, dedupe by hash, import'

  if (UNREACHABLE_HOSTS.has(info.host)) {
    verdict = 'FALLBACK_COVER'
    reason = 'host does not resolve — cannot be fetched at all'
  } else if (info.host === '(data-uri)' || info.host === '(unparseable)') {
    verdict = 'MANUAL_REVIEW'
    reason = 'src is not a fetchable URL'
  } else if (info.host !== 'gcalls.co' && !info.host.endsWith('googleusercontent.com')) {
    verdict = 'MANUAL_REVIEW'
    reason = `unexpected host ${info.host} — ownership unverified`
  }

  if (protectedOnly) {
    verdict = 'SKIP_PROTECTED'
    reason = 'only used by protected published articles; their bodies are not rewritten'
  }

  return { url, host: info.host, used_by: info.articles.length, verdict, reason }
})

/* Optional live probe, public GET only. */
if (HTTP_N > 0) {
  const sample = media.filter((m) => m.verdict === 'LOCALIZE').slice(0, HTTP_N)
  process.stdout.write(`probing ${sample.length} candidate image URL(s)…\n`)
  for (const item of sample) {
    try {
      const res = await fetch(item.url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) })
      item.http = res.status
      item.mime = res.headers.get('content-type') ?? ''
      item.bytes = Number(res.headers.get('content-length') ?? 0)
      if (res.status !== 200 || !item.mime.startsWith('image/')) {
        item.verdict = 'FALLBACK_COVER'
        item.reason = `probe: status ${res.status}, type "${item.mime}"`
      }
    } catch (error) {
      item.http = 0
      item.verdict = 'FALLBACK_COVER'
      item.reason = 'probe: connection failed'
    }
  }
}

/* ------------------------------------------------------------- rollback */

const rollback = {
  taken_from: path.basename(dumpPath),
  generated_at_gmt: new Date().toISOString(),
  note: 'Restores body and hub for every article the plan would write to. No write has occurred.',
  articles: plan
    .filter((r) => r.db_actions.length > 0 && r.outcome === 'ELIGIBLE')
    .map((r) => ({ id: r.id, slug: r.slug, body_sha256: r.body_sha256, hub: r.hub })),
}

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, 'corpus-dry-run.json'), JSON.stringify({ plan, media }, null, 2))
fs.writeFileSync(path.join(OUT, 'corpus-rollback-manifest.json'), JSON.stringify(rollback, null, 2))

/* --------------------------------------------------------------- report */

const counts = {}
for (const r of plan) counts[r.outcome] = (counts[r.outcome] ?? 0) + 1

console.log('CORPUS DRY RUN — nothing was written\n')
console.log(`articles considered: ${plan.length}`)
for (const [k, v] of Object.entries(counts).sort()) console.log(`  ${String(v).padStart(4)}  ${k}`)

const byStatus = {}
for (const r of plan) {
  const key = `${r.status}/${r.outcome}`
  byStatus[key] = (byStatus[key] ?? 0) + 1
}
console.log('\nby status:')
for (const [k, v] of Object.entries(byStatus).sort()) console.log(`  ${String(v).padStart(4)}  ${k}`)

const writes = plan.filter((r) => r.outcome === 'ELIGIBLE' && r.db_actions.length > 0)
const urlRewrites = writes.reduce((a, r) => a + r.images, 0)

console.log('\nwhat a later approved step would do:')
console.log(`  posts written                 ${writes.length}`)
console.log(`  image URLs rewritten          ${urlRewrites}`)
console.log(`  hub assignments               ${writes.filter((r) => r.db_actions.some((a) => a.startsWith('assign hub'))).length}`)

const mediaCounts = {}
for (const m of media) mediaCounts[m.verdict] = (mediaCounts[m.verdict] ?? 0) + 1
console.log(`\nunique image URLs: ${media.length}`)
for (const [k, v] of Object.entries(mediaCounts).sort()) console.log(`  ${String(v).padStart(4)}  ${k}`)

const localize = media.filter((m) => m.verdict === 'LOCALIZE')
console.log(`  attachments that would be created (before dedupe): ${localize.length}`)

console.log('\nno-HUB articles:')
for (const r of plan.filter((r) => !r.hub)) {
  const post = corpus.find((p) => p.ID === r.id)
  const proposal = proposeHub(post.post_title ?? '', post.post_content ?? '')
  console.log(`\n  ID ${r.id} — ${post.post_title}`)
  console.log(`    status      ${r.status}`)
  console.log(`    body        ${strip(post.post_content ?? '').trim().length} chars`)
  console.log(`    proposal    ${proposal.hub ? proposal.hub.slug : '(none)'}  confidence: ${proposal.confidence}`)
  console.log(`    evidence    ${proposal.evidence.join(', ') || '(no keyword matched)'}`)
  console.log(`    alternative ${proposal.alternative ? proposal.alternative.slug : '(none)'}`)
  console.log(`    outcome     ${r.outcome}${r.reasons.length ? ' — ' + r.reasons.join('; ') : ''}`)
}

console.log('\nwritten: wordpress/dist/corpus-dry-run.json + corpus-rollback-manifest.json')
console.log('NO LIVE WRITE OCCURRED. This script has no write path.')
