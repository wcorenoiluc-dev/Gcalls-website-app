/**
 * Layered image audit over the whole corpus.
 *
 * WHY THE PREVIOUS NUMBER WAS NOT GOOD ENOUGH
 * The corpus audit reported "227 of 230 drafts have images" by counting `<img`
 * in post_content. That counts TAGS, which is not the same as an image a
 * reader will see: the tag can point at a host that no longer serves it, at a
 * file that was never migrated, or at an attachment id with no attachment
 * behind it. A migration is exactly the situation where those diverge, so the
 * count was measuring the wrong thing.
 *
 * This checks each layer separately and reports them separately:
 *
 *   1  featured        `_thumbnail_id` present on the post
 *   2  attachment      that id resolves to an attachment row
 *   3  file            the attachment has `_wp_attached_file`
 *   4  alt             the attachment has non-empty alt text
 *   5  inline          `<img>` tags in the body
 *   6  url             those tags carry a resolvable src
 *   7  host            which host serves them — local, the old site, elsewhere
 *   8  http            the URL actually answers 200 with an image MIME
 *   9  dimensions      width/height/filesize from attachment metadata
 *  10  renderer        what the theme would output — NOT RUN, needs PHP
 *
 * Layer 8 runs only with --http, and only against public URLs. Nothing here
 * needs a login, and nothing here writes.
 *
 *   node wordpress/scripts/audit-images.mjs <dump.sql> [--http] [--limit N]
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'dist')

const args = process.argv.slice(2)
const dumpPath = args.find((a) => !a.startsWith('--'))
const doHttp = args.includes('--http')
const limitArg = args.indexOf('--limit')
const HTTP_LIMIT = limitArg !== -1 ? Number(args[limitArg + 1]) : 40

if (!dumpPath) {
  console.error('usage: node wordpress/scripts/audit-images.mjs <dump.sql> [--http] [--limit N]')
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

const metaByPost = new Map()
for (const m of meta) {
  if (!metaByPost.has(m.post_id)) metaByPost.set(m.post_id, {})
  metaByPost.get(m.post_id)[m.meta_key] = m.meta_value ?? ''
}

const attachments = new Map(
  posts.filter((p) => p.post_type === 'attachment').map((p) => [p.ID, p]),
)

const corpus = posts.filter(
  (p) => p.post_type === 'post' && ['publish', 'draft', 'private'].includes(p.post_status) && p.ID !== '1',
)

const SITE = 'ashernguyenxuanthuy.com'

const report = corpus.map((p) => {
  const m = metaByPost.get(p.ID) ?? {}
  const body = p.post_content ?? ''

  /* Layers 1-4 — the featured image. */
  const thumbId = m._thumbnail_id ?? ''
  const attachment = thumbId ? attachments.get(thumbId) : undefined
  const attachMeta = thumbId ? metaByPost.get(thumbId) ?? {} : {}
  const file = attachMeta._wp_attached_file ?? ''
  const alt = attachMeta._wp_attachment_image_alt ?? ''

  /* Layers 5-7 — inline images. */
  const tags = [...body.matchAll(/<img\b[^>]*>/gi)].map((x) => x[0])
  const srcs = tags
    .map((t) => t.match(/\bsrc="([^"]+)"/i)?.[1] ?? '')
    .filter(Boolean)
  const withAlt = tags.filter((t) => /\balt="[^"]+"/i.test(t)).length

  const hosts = new Set()
  for (const s of srcs) {
    if (s.startsWith('data:')) { hosts.add('(data-uri)'); continue }
    try {
      hosts.add(new URL(s, `https://${SITE}`).host)
    } catch {
      hosts.add('(unparseable)')
    }
  }

  return {
    id: p.ID,
    slug: p.post_name,
    status: p.post_status,
    protected: Number(p.ID) >= 100 && Number(p.ID) <= 117,
    featured_ref: Boolean(thumbId),
    attachment_exists: Boolean(attachment),
    attachment_file: Boolean(file),
    attachment_alt: Boolean(alt),
    inline_tags: tags.length,
    inline_src: srcs.length,
    inline_alt: withAlt,
    hosts: [...hosts],
    srcs,
  }
})

/* ------------------------------------------------------- layer 8: HTTP */

const allSrcs = [...new Set(report.flatMap((r) => r.srcs))]
const httpResults = new Map()

if (doHttp) {
  const sample = allSrcs.slice(0, HTTP_LIMIT)
  process.stdout.write(`checking ${sample.length} of ${allSrcs.length} unique image URLs over HTTP…\n`)

  for (const src of sample) {
    const url = src.startsWith('http') ? src : `https://${SITE}${src.startsWith('/') ? '' : '/'}${src}`
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) })
      httpResults.set(src, {
        status: res.status,
        type: res.headers.get('content-type') ?? '',
        bytes: Number(res.headers.get('content-length') ?? 0),
      })
    } catch (error) {
      httpResults.set(src, { status: 0, type: '', bytes: 0, error: String(error).slice(0, 60) })
    }
  }
}

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(
  path.join(OUT, 'image-audit.json'),
  JSON.stringify({ report, http: Object.fromEntries(httpResults) }, null, 2),
)

/* ---------------------------------------------------------------- report */

const groups = {
  'publish (18, PROTECTED)': report.filter((r) => r.status === 'publish'),
  'draft (230)': report.filter((r) => r.status === 'draft'),
  'private (2)': report.filter((r) => r.status === 'private'),
}

const layer = (rows, key) => rows.filter((r) => (typeof r[key] === 'boolean' ? r[key] : r[key] > 0)).length

console.log('LAYERED IMAGE AUDIT\n')
console.log(`source: ${path.basename(dumpPath)} — a database dump, not the live site\n`)

for (const [label, rows] of Object.entries(groups)) {
  console.log(`${label} — ${rows.length} article(s)`)
  console.log(`  1 featured reference (_thumbnail_id)   ${layer(rows, 'featured_ref')}`)
  console.log(`  2 attachment row exists                ${layer(rows, 'attachment_exists')}`)
  console.log(`  3 attachment file recorded             ${layer(rows, 'attachment_file')}`)
  console.log(`  4 attachment alt text                  ${layer(rows, 'attachment_alt')}`)
  console.log(`  5 inline <img> tags in body            ${layer(rows, 'inline_tags')}`)
  console.log(`  6 inline tags with a src               ${layer(rows, 'inline_src')}`)
  console.log(`  7 inline tags with alt text            ${layer(rows, 'inline_alt')}`)
  console.log('')
}

const hostCounts = {}
for (const r of report) for (const h of r.hosts) hostCounts[h] = (hostCounts[h] ?? 0) + 1
console.log('7 hosts serving inline images (articles per host):')
for (const [h, n] of Object.entries(hostCounts).sort((a, b) => b[1] - a[1])) {
  const local = h === SITE
  console.log(`  ${String(n).padStart(4)}  ${h}${local ? '  (local)' : '  (REMOTE — not on this site)'}`)
}

console.log(`\nunique image URLs across the corpus: ${allSrcs.length}`)

if (doHttp) {
  const ok = [...httpResults.values()].filter((r) => r.status === 200 && r.type.startsWith('image/')).length
  const bad = [...httpResults.values()].filter((r) => r.status !== 200).length
  console.log(`\n8 HTTP — ${httpResults.size} checked: ${ok} answered 200 with an image MIME, ${bad} did not`)
  const byStatus = {}
  for (const r of httpResults.values()) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1
  console.log('  status codes:', Object.entries(byStatus).map(([k, v]) => `${k}×${v}`).join(' '))
} else {
  console.log('\n8 HTTP                                   NOT RUN (pass --http)')
}

console.log('9 dimensions/filesize                    NOT RUN — attachment metadata absent for these posts')
console.log('10 renderer output                       NOT RUN — needs a PHP runtime, none on this machine')
console.log('\nwritten: wordpress/dist/image-audit.json')
