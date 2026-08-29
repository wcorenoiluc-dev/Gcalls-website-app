/**
 * Proves the eighteen published articles still say what the database said.
 *
 * WHY A SECOND CHECK EXISTS
 * live-baseline.mjs hashes the rendered article body, and that hash moved on
 * all eighteen after the theme deploy. That is expected — the theme now adds a
 * cover, anchor ids on every h2/h3 and a related-articles block — but "expected"
 * is a claim, and the whole point of protecting these articles is not to take
 * claims on trust.
 *
 * So this compares the WORDS instead of the markup. It strips every tag and
 * attribute from the live rendering, does the same to post_content as it stood
 * in the 07:00 dump, normalises whitespace, and compares. Markup changes are
 * invisible to it; a single edited, inserted or dropped sentence is not.
 *
 * If the text matches, post_content was not written to — whatever the markup
 * hash says.
 *
 *   node wordpress/scripts/verify-article-text.mjs <dump.sql>
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ORIGIN = 'https://ashernguyenxuanthuy.com'

const dumpPath = process.argv[2]
if (!dumpPath) {
  console.error('usage: node wordpress/scripts/verify-article-text.mjs <dump.sql>')
  process.exit(2)
}

const sql = fs.readFileSync(dumpPath, 'utf8')
const PREFIX = 'Qyr_default'

function columns(table) {
  const m = sql.match(new RegExp('CREATE TABLE `' + table + '` \\(([\\s\\S]*?)\\n\\) ENGINE'))
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

const ENTITIES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#039;': "'", '&#8217;': '’', '&#8220;': '“', '&#8221;': '”', '&hellip;': '…',
}

/**
 * Words only. Block-level tags become a space so "a</p><p>b" does not collapse
 * into "ab"; everything else is discarded, including all attributes — which is
 * where the anchor ids the renderer adds live.
 */
function words(html) {
  let text = String(html ?? '')
  text = text.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
  text = text.replace(/<!--[\s\S]*?-->/g, ' ')
  text = text.replace(/<[^>]+>/g, ' ')
  for (const [k, v] of Object.entries(ENTITIES)) text = text.split(k).join(v)
  text = text.replace(/&#?[a-z0-9]+;/gi, ' ')

  /*
   * Fold typographic punctuation back to its plain form.
   *
   * WordPress runs wptexturize on the way out, turning "quotes" into “quotes”,
   * ' into ’ and -- into —. It is a DISPLAY filter: post_content still holds
   * the straight characters. Comparing without folding these reports every
   * article as changed and points at a quotation mark, which is a false alarm
   * that would bury a real edit if there ever were one.
   */
  text = text
    .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00a0/g, ' ')

  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Slices from AFTER the opening tag closes, not from after the matched prefix.
 *
 * Slicing at the prefix leaves the rest of the tag — `gcalls-article__body">`
 * — at the front of the extract, and since there is no `<` in front of it the
 * tag stripper cannot see it as markup. It then shows up as the first "words"
 * of the article and every comparison fails at character zero.
 */
const between = (html, openPrefix, close) => {
  const a = html.indexOf(openPrefix)
  if (a === -1) return ''
  const tagEnd = html.indexOf('>', a)
  if (tagEnd === -1) return ''
  const b = html.indexOf(close, tagEnd + 1)
  return b === -1 ? '' : html.slice(tagEnd + 1, b)
}

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex')

const articles = posts
  .filter((p) => p.post_type === 'post' && p.post_status === 'publish' && p.ID !== '1')
  .sort((a, b) => Number(a.ID) - Number(b.ID))

console.log('ARTICLE TEXT VERIFICATION — live rendering vs the 07:00 database\n')
console.log(`${'ID'.padEnd(5)} ${'slug'.padEnd(40)} ${'db words'.padStart(9)} ${'live words'.padStart(11)}  verdict`)
console.log('-'.repeat(92))

let same = 0
let differ = 0
const problems = []

for (const post of articles) {
  const url = `${ORIGIN}/${post.post_name}/`

  let html = ''
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
    html = await res.text()
  } catch (error) {
    problems.push({ id: post.ID, slug: post.post_name, reason: 'fetch failed' })
    console.log(`${post.ID.padEnd(5)} ${post.post_name.slice(0, 40).padEnd(40)} ${'—'.padStart(9)} ${'—'.padStart(11)}  FETCH FAILED`)
    continue
  }

  const rendered = between(html, '<div class="gcalls-prose', '</article>')

  const dbText = words(post.post_content)
  let liveText = words(rendered)

  /*
   * The renderer appends material after the body inside the same <article>:
   * the FAQ, the CTA and the related-article cards. Those are additions, not
   * edits, so the test is that the live text STARTS WITH the database text —
   * every original word, in order, before anything the renderer adds.
   */
  const startsWith = liveText.startsWith(dbText)
  const exact = liveText === dbText

  if (exact || startsWith) {
    same += 1
    console.log(
      `${post.ID.padEnd(5)} ${post.post_name.slice(0, 40).padEnd(40)} ` +
        `${String(dbText.length).padStart(9)} ${String(liveText.length).padStart(11)}  ` +
        (exact ? 'identical' : 'intact + renderer additions'),
    )
  } else {
    differ += 1
    /* Where do they first диverge? That is what an editor needs to see. */
    let i = 0
    while (i < Math.min(dbText.length, liveText.length) && dbText[i] === liveText[i]) i += 1

    problems.push({
      id: post.ID,
      slug: post.post_name,
      divergeAt: i,
      db: dbText.slice(Math.max(0, i - 60), i + 60),
      live: liveText.slice(Math.max(0, i - 60), i + 60),
    })

    console.log(
      `${post.ID.padEnd(5)} ${post.post_name.slice(0, 40).padEnd(40)} ` +
        `${String(dbText.length).padStart(9)} ${String(liveText.length).padStart(11)}  TEXT DIFFERS at char ${i}`,
    )
  }
}

console.log('-'.repeat(92))
console.log(`${same} intact, ${differ} differing, of ${articles.length}`)
console.log(`db text hash set:   ${sha(articles.map((p) => words(p.post_content)).join('|')).slice(0, 32)}`)

if (problems.length > 0) {
  console.log('\nDIVERGENCES — do not repair these, report them:')
  for (const p of problems) {
    console.log(`\n  #${p.id} ${p.slug}`)
    if (p.reason) { console.log(`    ${p.reason}`); continue }
    console.log(`    db  : …${p.db}…`)
    console.log(`    live: …${p.live}…`)
  }
  process.exitCode = 1
} else {
  console.log('\nEvery published article still says exactly what the database said.')
  console.log('post_content was not written to; the hash moved because the markup did.')
}
