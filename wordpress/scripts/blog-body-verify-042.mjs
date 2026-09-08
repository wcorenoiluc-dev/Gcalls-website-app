#!/usr/bin/env node
/**
 * GCALLS-042 §F — compare the WORDS of each published article against the WXR.
 *
 * The stored body_sha256 hashes the source post_content, and the demo serves
 * rendered HTML through a theme that adds a cover, anchor ids and a related
 * block, so the hashes can never agree. Comparing the TEXT can: strip both to
 * words and a markup change is invisible while an edited sentence is not.
 *
 * The WXR is the source §F ranks first, and its SHA-256 is checked against the
 * manifest before a single byte is read — the failure mode GCALLS-041 hit was
 * trusting a dump that turned out to be a different site.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'wordpress/dist/blog-corpus-manifest.json'), 'utf8'))
const WXR = process.env.GCALLS_WXR
if (!WXR || !fs.existsSync(WXR)) { console.error('set GCALLS_WXR to the export'); process.exit(2) }

const raw = fs.readFileSync(WXR)
const sha = crypto.createHash('sha256').update(raw).digest('hex')
if (sha !== manifest.source.wxrSha256) {
  console.error(`WXR hash mismatch — this is not the reviewed export\n  want ${manifest.source.wxrSha256}\n  got  ${sha}`)
  process.exit(2)
}
console.log(`WXR verified: ${sha}\n`)

const xml = raw.toString('utf8')

/* Pull <item> blocks and read the fields we need. CDATA everywhere. */
const pick = (block, tag) => {
  const m = block.match(new RegExp(`<${tag}(?:[^>]*)>([\\s\\S]*?)</${tag}>`))
  if (!m) return ''
  return m[1].replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '')
}

const items = xml.split('<item>').slice(1).map((chunk) => chunk.split('</item>')[0])
const source = new Map()
for (const it of items) {
  const type = pick(it, 'wp:post_type')
  if (type !== 'post') continue
  source.set(pick(it, 'wp:post_name'), {
    status: pick(it, 'wp:status'),
    title: pick(it, 'title'),
    id: pick(it, 'wp:post_id'),
    link: pick(it, 'link'),
    content: pick(it, 'content:encoded'),
  })
}
console.log(`WXR posts parsed: ${source.size}`)
if (source.size === 0) { console.error('parser read zero posts — refusing to report anything'); process.exit(2) }

const ENT = { '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'", '&#8217;': '’', '&hellip;': '…' }
const words = (html) => html
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
  .replace(/\[[^\]]*\]/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#0-9]+;/gi, (e) => ENT[e] ?? ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .split(' ')
  .filter(Boolean)

const demo = JSON.parse(fs.readFileSync(process.env.GCALLS_DEMO_POSTS, 'utf8'))
const published = [...source.entries()].filter(([, v]) => v.status === 'publish')

console.log(`WXR published: ${published.length}\n`)
console.log('slug'.padEnd(50) + 'src'.padStart(6) + 'live'.padStart(7) + '  verdict')

let same = 0, diff = 0, unfetched = 0
const rows = []

for (const [slug, src] of published.sort((a, b) => a[0].localeCompare(b[0]))) {
  const live = demo.find((p) => p.slug === slug)
  if (!live) { rows.push({ slug, verdict: 'MISSING' }); continue }

  let html = ''
  try {
    const res = await fetch(live.link, { signal: AbortSignal.timeout(40000) })
    html = res.status === 200 ? await res.text() : ''
  } catch { html = '' }

  if (!html) { unfetched += 1; rows.push({ slug, verdict: 'UNVERIFIED (fetch failed)' }); continue }

  /* The article body only: the theme wraps it in gcalls-article__body. */
  const a = html.indexOf('gcalls-article__body')
  let body = html
  if (a !== -1) {
    const start = html.indexOf('>', a) + 1
    const end = html.indexOf('<footer', start)
    body = html.slice(start, end === -1 ? start + 200000 : end)
  }

  const srcWords = words(src.content)
  const liveWords = words(body)
  const srcSet = srcWords.join(' ')

  /* Every source word must survive, in order, inside the rendered text. The
   * theme adds words around the article; it must not remove any from it. */
  const contained = liveWords.join(' ').includes(srcSet)
  const verdict = contained ? 'MATCH' : 'CHANGED'
  if (contained) same += 1; else diff += 1

  rows.push({ slug, srcWords: srcWords.length, liveWords: liveWords.length, verdict })
  console.log(slug.slice(0, 48).padEnd(50) + String(srcWords.length).padStart(6) + String(liveWords.length).padStart(7) + '  ' + verdict)
}

console.log(`\n${same} MATCH, ${diff} CHANGED, ${unfetched} UNVERIFIED, of ${published.length} published`)
fs.writeFileSync(process.env.GCALLS_BODY_OUT || '/tmp/blog-body-042.json', JSON.stringify(rows, null, 1))
if (diff) {
  console.log('\nCHANGED — the source text does not appear intact in the rendering:')
  for (const r of rows.filter((x) => x.verdict === 'CHANGED')) console.log(`  ${r.slug}  src ${r.srcWords} words, live ${r.liveWords}`)
}
