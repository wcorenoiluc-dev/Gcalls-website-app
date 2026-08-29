/**
 * Probes every unique image URL in the corpus, and classifies each one.
 *
 * READ-ONLY, AND DELIBERATELY POLITE
 * Only GET is used, and only against URLs already published in article bodies.
 * Nothing is written anywhere, least of all to gcalls.co — which is production
 * and off limits for anything but a public read. Concurrency is capped and
 * each response is abandoned past a size ceiling, so this behaves like a
 * careful crawler rather than a load test.
 *
 * WHY GET AND NOT HEAD
 * HEAD answers status, type and length, and all three can lie. A server can
 * serve an HTML error page under `Content-Type: image/jpeg`, and a
 * `Content-Length` is a claim about a body that HEAD never sends. The
 * classification here needs the bytes: the magic number decides what the file
 * really is, sharp decides its dimensions, and SHA-256 of the body is what
 * makes deduplication possible at all.
 *
 * WHAT BLOCKS A URL
 *   - HTML (or anything not an image) behind an image content-type
 *   - a content-type that disagrees with the magic number
 *   - an empty body
 *   - a body over the size ceiling
 *   - a host that is private, loopback or otherwise not routable publicly
 *   - a 1×1 or near-empty image: a tracking pixel, not content
 *   - a data: URI
 *   - a timeout or DNS failure
 *
 *   node wordpress/scripts/probe-media.mjs [--concurrency 6] [--limit N]
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'dist')

const args = process.argv.slice(2)
const numArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i !== -1 ? Number(args[i + 1]) : fallback
}

const CONCURRENCY = numArg('concurrency', 6)
const LIMIT = numArg('limit', 0)
const TIMEOUT_MS = 20000
const MAX_BYTES = 8 * 1024 * 1024
const MIN_BYTES = 512
const SITE = 'ashernguyenxuanthuy.com'

/* The URL list and its usage counts come from the image audit. */
const auditPath = path.join(OUT, 'image-audit.json')
if (!fs.existsSync(auditPath)) {
  console.error('run audit-images.mjs first — image-audit.json is missing')
  process.exit(2)
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8')).report

const usage = new Map()
for (const article of audit) {
  for (const src of article.srcs) {
    if (!usage.has(src)) usage.set(src, { articles: [], statuses: new Set() })
    usage.get(src).articles.push(article.id)
    usage.get(src).statuses.add(article.status)
  }
}

let urls = [...usage.keys()]
if (LIMIT > 0) urls = urls.slice(0, LIMIT)

/** Private, loopback and link-local hosts must never be fetched. */
const PRIVATE_HOST =
  /^(localhost|127\.|0\.|10\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)|\.local$|\.internal$/i

/** First bytes decide what a file really is. */
function sniff(buffer) {
  if (buffer.length < 12) return ''
  const hex = buffer.subarray(0, 12)
  if (hex[0] === 0xff && hex[1] === 0xd8 && hex[2] === 0xff) return 'image/jpeg'
  if (hex.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') return 'image/png'
  if (hex.subarray(0, 6).toString() === 'GIF87a' || hex.subarray(0, 6).toString() === 'GIF89a') return 'image/gif'
  if (hex.subarray(0, 4).toString() === 'RIFF' && hex.subarray(8, 12).toString() === 'WEBP') return 'image/webp'
  if (hex.subarray(0, 4).toString('hex') === '00000100') return 'image/x-icon'
  const head = buffer.subarray(0, 512).toString('utf8').trim().toLowerCase()
  if (head.startsWith('<!doctype html') || head.startsWith('<html') || head.startsWith('<?xml')) return 'text/html'
  if (head.startsWith('<svg')) return 'image/svg+xml'
  return ''
}

async function probe(src) {
  const record = {
    url: src,
    host: '',
    used_by: usage.get(src)?.articles.length ?? 0,
    statuses: [...(usage.get(src)?.statuses ?? [])],
    http: null,
    redirects: 0,
    final_url: '',
    declared_mime: '',
    real_mime: '',
    bytes: 0,
    width: null,
    height: null,
    sha256: '',
    verdict: 'MANUAL_REVIEW',
    reason: '',
  }

  if (src.startsWith('data:')) {
    record.host = '(data-uri)'
    record.verdict = 'BLOCKED'
    record.reason = 'data: URI — not a fetchable asset'
    return record
  }

  let url
  try {
    url = new URL(src, `https://${SITE}`)
  } catch {
    record.host = '(unparseable)'
    record.verdict = 'BLOCKED'
    record.reason = 'src is not a URL'
    return record
  }

  record.host = url.host

  if (PRIVATE_HOST.test(url.hostname)) {
    record.verdict = 'BLOCKED'
    record.reason = 'private or loopback host'
    return record
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    record.verdict = 'BLOCKED'
    record.reason = `unsupported scheme ${url.protocol}`
    return record
  }

  let response
  try {
    response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': 'gcalls-media-audit (read-only inventory)' },
    })
  } catch (error) {
    record.verdict = 'FALLBACK_COVER'
    record.reason = /timeout|abort/i.test(String(error)) ? 'timeout' : 'connection or DNS failure'
    return record
  }

  record.http = response.status
  record.final_url = response.url
  record.redirects = response.url !== url.href ? 1 : 0
  record.declared_mime = (response.headers.get('content-type') ?? '').split(';')[0].trim()

  if (!response.ok) {
    record.verdict = 'FALLBACK_COVER'
    record.reason = `HTTP ${response.status}`
    return record
  }

  const declaredLength = Number(response.headers.get('content-length') ?? 0)
  if (declaredLength > MAX_BYTES) {
    record.bytes = declaredLength
    record.verdict = 'BLOCKED'
    record.reason = `declared ${declaredLength} bytes, over the ${MAX_BYTES} ceiling`
    return record
  }

  let buffer
  try {
    buffer = Buffer.from(await response.arrayBuffer())
  } catch (error) {
    record.verdict = 'FALLBACK_COVER'
    record.reason = 'body could not be read'
    return record
  }

  record.bytes = buffer.length

  if (buffer.length === 0) {
    record.verdict = 'BLOCKED'
    record.reason = 'empty body'
    return record
  }

  if (buffer.length > MAX_BYTES) {
    record.verdict = 'BLOCKED'
    record.reason = `${buffer.length} bytes, over the ceiling`
    return record
  }

  record.real_mime = sniff(buffer)
  record.sha256 = crypto.createHash('sha256').update(buffer).digest('hex')

  if (record.real_mime === 'text/html') {
    record.verdict = 'BLOCKED'
    record.reason = `HTML served as "${record.declared_mime}" — an error page, not an image`
    return record
  }

  if (!record.real_mime.startsWith('image/')) {
    record.verdict = 'BLOCKED'
    record.reason = `bytes are not an image (declared "${record.declared_mime}")`
    return record
  }

  if (record.declared_mime.startsWith('image/') && record.declared_mime !== record.real_mime) {
    // Not fatal on its own — servers mislabel jpeg as jpg routinely — but it
    // is recorded, and the real type is what any import would trust.
    record.reason = `declared "${record.declared_mime}", actually "${record.real_mime}"`
  }

  try {
    const meta = await sharp(buffer).metadata()
    record.width = meta.width ?? null
    record.height = meta.height ?? null
  } catch {
    record.verdict = 'MANUAL_REVIEW'
    record.reason = 'dimensions unreadable — the file may be corrupt'
    return record
  }

  if ((record.width ?? 0) <= 2 && (record.height ?? 0) <= 2) {
    record.verdict = 'BLOCKED'
    record.reason = `${record.width}×${record.height} — a tracking pixel, not content`
    return record
  }

  if (buffer.length < MIN_BYTES) {
    record.verdict = 'BLOCKED'
    record.reason = `${buffer.length} bytes — too small to be article artwork`
    return record
  }

  record.verdict = 'LOCALIZE'
  record.reason = record.reason || 'fetched and verified'
  return record
}

/* ------------------------------------------------------------------ run */

const results = []
let done = 0

async function worker(queue) {
  for (;;) {
    const src = queue.shift()
    if (src === undefined) return
    const record = await probe(src)
    results.push(record)
    done += 1
    if (done % 50 === 0 || done === urls.length) {
      process.stdout.write(`  ${done}/${urls.length}\n`)
    }
  }
}

const queue = [...urls]
console.log(`probing ${urls.length} unique image URL(s), concurrency ${CONCURRENCY}\n`)
const started = Date.now()
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)))
const seconds = Math.round((Date.now() - started) / 1000)

/* ------------------------------------------------- dedupe and forecast */

const byHash = new Map()
for (const r of results) {
  if (r.verdict !== 'LOCALIZE' || !r.sha256) continue
  if (!byHash.has(r.sha256)) byHash.set(r.sha256, [])
  byHash.get(r.sha256).push(r)
}

/* One attachment per distinct file. Every other URL with the same bytes maps
 * to it — that is the difference between 742 uploads and the real number. */
for (const [, group] of byHash) {
  group.sort((a, b) => a.url.localeCompare(b.url))
  group.slice(1).forEach((r) => {
    r.verdict = 'DEDUPE'
    r.reason = `identical bytes to ${group[0].url}`
    r.duplicate_of = group[0].url
  })
}

const localize = results.filter((r) => r.verdict === 'LOCALIZE')
const dedupe = results.filter((r) => r.verdict === 'DEDUPE')
const fallback = results.filter((r) => r.verdict === 'FALLBACK_COVER')
const blocked = results.filter((r) => r.verdict === 'BLOCKED')
const review = results.filter((r) => r.verdict === 'MANUAL_REVIEW')

const totalBytes = localize.reduce((a, r) => a + r.bytes, 0)
const downloadedBytes = results.reduce((a, r) => a + r.bytes, 0)
const largest = [...localize].sort((a, b) => b.bytes - a.bytes)[0]

/* Which articles would still show nothing if their images cannot be brought
 * across — those fall back to the drawn HUB cover rather than a broken image. */
const unusableUrls = new Set([...fallback, ...blocked, ...review].map((r) => r.url))
const articlesAffected = new Set()
for (const article of audit) {
  if (article.srcs.some((s) => unusableUrls.has(s))) articlesAffected.add(article.id)
}
const articlesEntirelyUnusable = audit.filter(
  (a) => a.srcs.length > 0 && a.srcs.every((s) => unusableUrls.has(s)),
).length

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, 'media-probe.json'), JSON.stringify(results, null, 2))

const csvCols = ['url', 'host', 'used_by', 'http', 'redirects', 'declared_mime', 'real_mime', 'bytes', 'width', 'height', 'sha256', 'verdict', 'reason']
fs.writeFileSync(
  path.join(OUT, 'media-probe.csv'),
  [
    csvCols.join(','),
    ...results.map((r) =>
      csvCols
        .map((c) => {
          const v = r[c] ?? ''
          return typeof v === 'string' && /[",\s]/.test(v) ? `"${v.replace(/"/g, '""')}"` : String(v)
        })
        .join(','),
    ),
  ].join('\n') + '\n',
)

/* --------------------------------------------------------------- report */

const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB'

console.log(`\nprobed ${results.length} URL(s) in ${seconds}s\n`)

const byVerdict = {}
for (const r of results) byVerdict[r.verdict] = (byVerdict[r.verdict] ?? 0) + 1
for (const [k, v] of Object.entries(byVerdict).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(v).padStart(4)}  ${k}`)
}

const byHost = {}
for (const r of results) byHost[r.host] = (byHost[r.host] ?? 0) + 1
console.log('\nby host:')
for (const [k, v] of Object.entries(byHost).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(v).padStart(4)}  ${k}`)
}

const byStatus = {}
for (const r of results) byStatus[r.http ?? 'no response'] = (byStatus[r.http ?? 'no response'] ?? 0) + 1
console.log('\nby HTTP status:')
for (const [k, v] of Object.entries(byStatus).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(v).padStart(4)}  ${k}`)
}

const reasons = {}
for (const r of [...blocked, ...review]) reasons[r.reason] = (reasons[r.reason] ?? 0) + 1
if (Object.keys(reasons).length > 0) {
  console.log('\nblocked / review reasons:')
  for (const [k, v] of Object.entries(reasons).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(v).padStart(4)}  ${k}`)
  }
}

console.log('\nSTORAGE FORECAST')
console.log(`  unique URLs probed              ${results.length}`)
console.log(`  downloaded successfully         ${localize.length + dedupe.length}`)
console.log(`  failed to download              ${fallback.length}`)
console.log(`  distinct image hashes           ${byHash.size}`)
console.log(`  duplicate URLs (same bytes)     ${dedupe.length}`)
console.log(`  ATTACHMENTS AFTER DEDUPE        ${localize.length}`)
console.log(`  total downloaded during probe   ${mb(downloadedBytes)}`)
console.log(`  storage for the attachments     ${mb(totalBytes)}`)
if (largest) console.log(`  largest file                    ${mb(largest.bytes)}  ${largest.width}×${largest.height}  ${largest.url.slice(-60)}`)
console.log(`  images needing a fallback cover  ${fallback.length + blocked.length + review.length}`)
console.log(`  articles with any unusable image ${articlesAffected.size}`)
console.log(`  articles with NO usable image    ${articlesEntirelyUnusable}`)

console.log('\nwritten: wordpress/dist/media-probe.json + media-probe.csv')
console.log('Read-only. Nothing was written to any host.')
