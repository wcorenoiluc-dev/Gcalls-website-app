/**
 * Captures the eighteen published articles as the live site serves them.
 *
 * WHAT THIS CAN AND CANNOT SEE
 * There is no database access from this machine, so this cannot read
 * post_content and cannot hash it. What it can do is fetch each article and
 * hash the rendered body — and for the question actually being asked, "did the
 * deploy change any of these eighteen articles", that is the better
 * instrument: it compares what a reader receives, which is what a UI deploy
 * could plausibly break.
 *
 * It is a proxy, and the report says so. A rendered-body hash moves for
 * reasons post_content did not — a plugin adding a wrapper, a filter changing
 * — and that is precisely what should be caught here rather than dismissed.
 * Drafts and private posts are not public and are outside its reach entirely.
 *
 * Run it before a deploy and again afterwards:
 *
 *   node wordpress/scripts/live-baseline.mjs --out before.json
 *   …deploy…
 *   node wordpress/scripts/live-baseline.mjs --out after.json --compare before.json
 *
 * Read-only: it issues GETs to the demo domain and writes one JSON file.
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'dist')

const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i !== -1 ? args[i + 1] : fallback
}

const ORIGIN = (arg('origin', 'https://ashernguyenxuanthuy.com')).replace(/\/$/, '')
const OUT_FILE = path.resolve(arg('out', path.join(OUT, 'live-baseline.json')))
const COMPARE = arg('compare', '')

/* The eighteen, from the snapshot taken before any of this work started. */
const snapshotPath = path.join(process.env.HOME ?? '', 'Desktop/GCALLS-009-REPORT/blog-snapshot-before.json')
const auditPath = path.join(OUT, 'corpus-audit.json')

let articles = []

if (fs.existsSync(snapshotPath)) {
  articles = JSON.parse(fs.readFileSync(snapshotPath, 'utf8')).map((r) => ({ id: r.ID, slug: r.post_name }))
} else if (fs.existsSync(auditPath)) {
  articles = JSON.parse(fs.readFileSync(auditPath, 'utf8'))
    .filter((r) => r.status === 'publish')
    .map((r) => ({ id: r.id, slug: r.slug }))
} else {
  console.error('no article list available — run audit-corpus.mjs first')
  process.exit(2)
}

const between = (html, open, close) => {
  const a = html.indexOf(open)
  if (a === -1) return ''
  const b = html.indexOf(close, a + open.length)
  return b === -1 ? '' : html.slice(a + open.length, b)
}

const metaContent = (html, attr, value) => {
  const re = new RegExp(`<meta[^>]+${attr}=["']${value}["'][^>]*>`, 'i')
  const tag = html.match(re)?.[0] ?? ''
  return tag.match(/content=["']([^"']*)["']/i)?.[1] ?? ''
}

const sha = (s) => crypto.createHash('sha256').update(s ?? '').digest('hex')

const rows = []

for (const article of articles) {
  const url = `${ORIGIN}/${article.slug}/`
  const record = { id: article.id, slug: article.slug, url, http: 0 }

  let html = ''
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000) })
    record.http = res.status
    html = await res.text()
  } catch (error) {
    record.error = String(error).slice(0, 80)
    rows.push(record)
    console.log(`  ${article.id}  FETCH FAILED  ${article.slug}`)
    continue
  }

  /*
   * The article body, not the whole document. Hashing the page would move on
   * every header, footer or nav change and report an article edit that never
   * happened — the point is to isolate the article.
   */
  const body = between(html, '<div class="gcalls-prose', '</article>')

  record.title = between(html, '<h1', '</h1>').replace(/^[^>]*>/, '').trim()
  record.h1_count = (html.match(/<h1\b/gi) ?? []).length
  record.hub = (html.match(/\/hub\/([a-z0-9-]+)\//i) ?? [])[1] ?? ''
  record.published = html.match(/<time[^>]+datetime="([^"]+)"/i)?.[1] ?? ''
  record.modified = (html.match(/<time[^>]+class="gcalls-meta__updated"[^>]+datetime="([^"]+)"/i) ?? [])[1] ?? ''
  record.seo_title = between(html, '<title>', '</title>').trim()
  record.seo_description = metaContent(html, 'name', 'description')
  record.canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ?? ''
  record.robots = metaContent(html, 'name', 'robots')
  record.body_bytes = body.length
  record.body_sha256 = sha(body)
  record.images = (body.match(/<img\b/gi) ?? []).length
  record.faq_present = /gcalls-faq|itemtype="https:\/\/schema.org\/FAQPage"|FAQPage/i.test(html)

  rows.push(record)
  console.log(`  ${article.id}  ${record.http}  h1=${record.h1_count}  body=${String(record.body_bytes).padStart(6)}  ${record.body_sha256.slice(0, 12)}  ${article.slug.slice(0, 44)}`)
}

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
fs.writeFileSync(OUT_FILE, JSON.stringify(rows, null, 2))

console.log(`\ncaptured ${rows.length} article(s) → ${path.relative(process.cwd(), OUT_FILE)}`)

const ok = rows.filter((r) => r.http === 200).length
const oneH1 = rows.filter((r) => r.h1_count === 1).length
console.log(`  HTTP 200: ${ok}/${rows.length}   exactly one H1: ${oneH1}/${rows.length}`)

/* ------------------------------------------------------------- compare */

if (COMPARE) {
  if (!fs.existsSync(COMPARE)) {
    console.error(`\ncomparison file not found: ${COMPARE}`)
    process.exit(2)
  }

  const before = new Map(JSON.parse(fs.readFileSync(COMPARE, 'utf8')).map((r) => [r.id, r]))

  const FIELDS = ['title', 'slug', 'hub', 'published', 'seo_title', 'seo_description', 'canonical', 'robots', 'body_sha256']

  let changed = 0
  console.log('\nCOMPARISON AGAINST ' + path.basename(COMPARE))
  console.log('-'.repeat(72))

  for (const now of rows) {
    const was = before.get(now.id)
    if (!was) {
      console.log(`  ${now.id}  NEW — not in the baseline`)
      changed += 1
      continue
    }

    const moved = FIELDS.filter((f) => (was[f] ?? '') !== (now[f] ?? ''))

    if (moved.length === 0) {
      console.log(`  ${now.id}  unchanged`)
      continue
    }

    changed += 1
    console.log(`  ${now.id}  CHANGED: ${moved.join(', ')}`)
    for (const field of moved) {
      console.log(`        ${field}`)
      console.log(`          was: ${String(was[field] ?? '').slice(0, 90)}`)
      console.log(`          now: ${String(now[field] ?? '').slice(0, 90)}`)
    }
  }

  console.log('-'.repeat(72))
  console.log(`${rows.length - changed} unchanged, ${changed} changed`)

  if (changed > 0) {
    console.log('\nAny change here that is not explained by a global renderer is a FAIL.')
    process.exitCode = 1
  }
}
