/**
 * Read-only audit of the whole 250-article corpus.
 *
 * WHAT IT IS FOR
 * GCALLS-011 asks for a matrix over every article before anything is changed
 * in bulk: what each one has, what it is missing, and which ones must not be
 * touched. This produces that matrix and nothing else. It opens a database
 * dump, reads, and writes two files into wordpress/dist/. It cannot reach the
 * live site, cannot publish a draft, and has no write path of any kind.
 *
 * WHY A DUMP AND NOT THE LIVE DATABASE
 * There is no database access from this machine. The dump taken at 07:00 on
 * 2026-08-29 is the corpus as it stood before this work started, which is
 * exactly the baseline a "before" matrix wants. Every count it reports is
 * therefore a statement about that dump, and says so — not a guess about live.
 *
 * THE EIGHTEEN
 * IDs 100–117 are published and are being edited by a person right now. They
 * are audited like everything else, but the report marks them PROTECTED and no
 * remediation this matrix suggests may ever be applied to them.
 *
 * HUMAN-EDITED DETECTION
 * Every article's body is hashed. A later run can be handed the same baseline
 * and will mark anything whose hash moved as human-edited, which is the signal
 * for "skip this one" when a batch fix is eventually written.
 *
 *   node wordpress/scripts/audit-corpus.mjs <dump.sql> [--baseline <json>]
 *
 * Outputs wordpress/dist/corpus-audit.json and corpus-audit.csv.
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'dist')

const args = process.argv.slice(2)
const dumpPath = args.find((a) => !a.startsWith('--'))
const baselineArg = args.indexOf('--baseline')
const baselinePath = baselineArg !== -1 ? args[baselineArg + 1] : null

if (!dumpPath) {
  console.error('usage: node wordpress/scripts/audit-corpus.mjs <dump.sql> [--baseline <json>]')
  process.exit(2)
}

const sql = fs.readFileSync(dumpPath, 'utf8')
const PREFIX = 'Qyr_default'

function columns(table) {
  const m = sql.match(new RegExp('CREATE TABLE `' + table + '` \\(([\\s\\S]*?)\\n\\) ENGINE'))
  if (!m) throw new Error(`no CREATE TABLE for ${table} — wrong dump?`)
  return [...m[1].matchAll(/^\s*`([a-zA-Z0-9_]+)`\s+[a-z]/gm)].map((x) => x[1])
}

/** Walks INSERT tuples by hand; quoting and escapes make a regex wrong. */
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

const termName = Object.fromEntries(terms.map((t) => [t.term_id, t.name]))
const taxOf = Object.fromEntries(
  ttax.map((tt) => [tt.term_taxonomy_id, { tax: tt.taxonomy, name: termName[tt.term_id] }]),
)

const metaByPost = new Map()
for (const m of meta) {
  if (!metaByPost.has(m.post_id)) metaByPost.set(m.post_id, {})
  metaByPost.get(m.post_id)[m.meta_key] = m.meta_value ?? ''
}

const termsByPost = new Map()
for (const r of trel) {
  const t = taxOf[r.term_taxonomy_id]
  if (!t) continue
  if (!termsByPost.has(r.object_id)) termsByPost.set(r.object_id, [])
  termsByPost.get(r.object_id).push(t)
}

/* WordPress ships "Hello world!" on every install. It is not corpus. */
const HELLO = '1'
const PROTECTED = new Set(Array.from({ length: 18 }, (_, i) => String(100 + i)))

const corpus = posts.filter(
  (p) => p.post_type === 'post' && ['publish', 'draft', 'private'].includes(p.post_status) && p.ID !== HELLO,
)

const baseline = baselinePath && fs.existsSync(baselinePath)
  ? new Map(JSON.parse(fs.readFileSync(baselinePath, 'utf8')).map((r) => [r.id, r.body_sha256]))
  : null

const strip = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ')

const audit = corpus.map((p) => {
  const body = p.post_content ?? ''
  const m = metaByPost.get(p.ID) ?? {}
  const t = termsByPost.get(p.ID) ?? []

  const hub = t.find((x) => x.tax === 'gcalls_hub')?.name ?? ''
  const words = strip(body).split(/\s+/).filter(Boolean).length

  const h2 = (body.match(/<h2[\s>]/gi) ?? []).length
  const h3 = (body.match(/<h3[\s>]/gi) ?? []).length
  const images = (body.match(/<img[\s>]/gi) ?? []).length
  const links = [...body.matchAll(/<a[^>]+href="([^"]+)"/gi)].map((x) => x[1])
  const internal = links.filter((h) => h.startsWith('/') || h.includes('ashernguyenxuanthuy')).length
  const external = links.length - internal

  const faqRaw = m._gcalls_faq ?? ''
  let faqItems = 0
  if (faqRaw) {
    // Stored serialised; counting entries is enough for a matrix.
    faqItems = (faqRaw.match(/"question"/g) ?? []).length || (faqRaw.match(/s:8:"question"/g) ?? []).length
  }

  const bodyHash = crypto.createHash('sha256').update(body).digest('hex')

  const issues = []
  if (words < 300) issues.push('thin-body')
  if (h2 === 0) issues.push('no-h2')
  if (images === 0) issues.push('no-image')
  if (!hub) issues.push('no-hub')
  if (!faqItems) issues.push('no-faq')
  if (!m.rank_math_title) issues.push('no-seo-title')
  if (!m.rank_math_description) issues.push('no-seo-desc')
  if (!m.rank_math_focus_keyword) issues.push('no-focus-kw')
  if (internal === 0) issues.push('no-internal-link')
  if (!/gcalls_cta|\/lien-he\//.test(body)) issues.push('no-cta')

  const humanEdited = baseline ? baseline.has(p.ID) && baseline.get(p.ID) !== bodyHash : false

  return {
    id: p.ID,
    slug: p.post_name,
    status: p.post_status,
    protected: PROTECTED.has(p.ID),
    human_edited: humanEdited,
    modified_gmt: p.post_modified_gmt,
    hub,
    words,
    h2,
    h3,
    images,
    internal_links: internal,
    external_links: external,
    faq_items: faqItems,
    seo_title: Boolean(m.rank_math_title),
    seo_desc: Boolean(m.rank_math_description),
    focus_kw: Boolean(m.rank_math_focus_keyword),
    featured_image: Boolean(m._thumbnail_id),
    body_bytes: Buffer.byteLength(body),
    body_sha256: bodyHash,
    issues,
  }
})

audit.sort((a, b) => Number(a.id) - Number(b.id))

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, 'corpus-audit.json'), JSON.stringify(audit, null, 2))

const cols = [
  'id', 'slug', 'status', 'protected', 'human_edited', 'hub', 'words', 'h2', 'h3',
  'images', 'internal_links', 'faq_items', 'seo_title', 'seo_desc', 'focus_kw',
  'featured_image', 'body_sha256', 'issues',
]
const csv = [
  cols.join(','),
  ...audit.map((r) =>
    cols.map((c) => {
      const v = c === 'issues' ? r.issues.join(' ') : r[c]
      return typeof v === 'string' && /[",\s]/.test(v) ? `"${v.replace(/"/g, '""')}"` : String(v)
    }).join(','),
  ),
].join('\n')
fs.writeFileSync(path.join(OUT, 'corpus-audit.csv'), csv + '\n')

/* ------------------------------------------------------------------ report */

const byStatus = {}
for (const r of audit) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1

const issueCounts = {}
for (const r of audit) for (const i of r.issues) issueCounts[i] = (issueCounts[i] ?? 0) + 1

const hubCounts = {}
for (const r of audit) hubCounts[r.hub || '(none)'] = (hubCounts[r.hub || '(none)'] ?? 0) + 1

console.log(`corpus audit — ${path.basename(dumpPath)}\n`)
console.log(`articles audited: ${audit.length}  (Hello World excluded)`)
console.log('by status:', Object.entries(byStatus).map(([k, v]) => `${k} ${v}`).join(' · '))
console.log(`protected (IDs 100–117): ${audit.filter((r) => r.protected).length}`)
if (baseline) console.log(`human-edited since baseline: ${audit.filter((r) => r.human_edited).length}`)

console.log(`\nHUB coverage (${Object.keys(hubCounts).filter((k) => k !== '(none)').length} hubs):`)
for (const [hub, n] of Object.entries(hubCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${hub}`)
}

console.log('\nissues, by how many articles have them:')
for (const [issue, n] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${issue}`)
}

const clean = audit.filter((r) => r.issues.length === 0).length
console.log(`\nclean articles: ${clean} / ${audit.length}`)
console.log(`\nwritten: wordpress/dist/corpus-audit.json + .csv`)
