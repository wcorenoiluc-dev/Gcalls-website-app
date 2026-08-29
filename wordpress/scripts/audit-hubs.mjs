/**
 * Reconciles every taxonomy term attached to the corpus against the canonical
 * HUB list the plugin registers.
 *
 * WHY THIS IS SEPARATE FROM audit-corpus.mjs
 * That script reports the HUB name it finds on each article. It says nothing
 * about terms that exist but are unused, about terms in OTHER taxonomies
 * sitting on the same posts, or about whether a name matches the canonical
 * list — and "how many HUBs are in use" turns out to depend entirely on which
 * of those you count.
 *
 * Read-only. It renames nothing, merges nothing and deletes nothing.
 *
 *   node wordpress/scripts/audit-hubs.mjs <dump.sql>
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'dist')
const PLUGIN = path.join(HERE, '..', 'wp-content/plugins/gcalls-core')

const dumpPath = process.argv[2]
if (!dumpPath) {
  console.error('usage: node wordpress/scripts/audit-hubs.mjs <dump.sql>')
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
const terms = rows(PREFIX + 'terms')
const ttax = rows(PREFIX + 'term_taxonomy')
const trel = rows(PREFIX + 'term_relationships')

const termById = Object.fromEntries(terms.map((t) => [t.term_id, t]))

/* Canonical list, read from the plugin rather than retyped here. */
const hubSrc = fs.readFileSync(path.join(PLUGIN, 'includes/class-hub-taxonomy.php'), 'utf8')

/*
 * Parse the HUBS constant specifically, not every 'a' => 'b' pair in the file.
 * A looser regex picks up the register_taxonomy() labels array as well and
 * reports 27 canonical HUBs, which then makes all thirteen real ones look like
 * partial matches — a broken measurement that reads as a broken database.
 */
const hubsBlock = hubSrc.slice(hubSrc.indexOf('private const HUBS = array('), hubSrc.indexOf('\n\t);', hubSrc.indexOf('private const HUBS')))
const canonical = [...hubsBlock.matchAll(/'(HUB-\d+)'\s*=>\s*array\(\s*'slug'\s*=>\s*'([^']+)',\s*'name'\s*=>\s*'([^']+)'/g)]
  .map(([, id, slug, name]) => ({ id, slug, name }))

if (canonical.length === 0) {
  console.error('could not parse the canonical HUB list from class-hub-taxonomy.php')
  process.exit(1)
}
const canonicalNames = new Set(canonical.map((c) => c.name))
const canonicalSlugs = new Set(canonical.map((c) => c.slug))

/* Which posts are corpus: articles, excluding the WordPress sample. */
const statusOf = new Map()
for (const p of posts) {
  if (p.post_type === 'post' && ['publish', 'draft', 'private'].includes(p.post_status) && p.ID !== '1') {
    statusOf.set(p.ID, p.post_status)
  }
}

/* Every term_taxonomy row, with the corpus posts attached to it. */
const table = ttax.map((tt) => {
  const term = termById[tt.term_id] ?? {}
  const attached = trel.filter((r) => r.term_taxonomy_id === tt.term_taxonomy_id).map((r) => r.object_id)
  const corpus = attached.filter((id) => statusOf.has(id))

  const counts = { publish: 0, draft: 0, private: 0 }
  for (const id of corpus) counts[statusOf.get(id)] += 1

  const isHub = tt.taxonomy === 'gcalls_hub'
  const nameMatches = canonicalNames.has(term.name)
  const slugMatches = canonicalSlugs.has(term.slug)

  let verdict = 'review'
  let reason = ''

  if (!isHub) {
    verdict = 'keep'
    reason = `not a HUB — taxonomy "${tt.taxonomy}"; counted separately`
  } else if (nameMatches && slugMatches) {
    verdict = 'keep'
    reason = corpus.length === 0 ? 'canonical HUB, currently unused' : 'canonical HUB'
  } else if (nameMatches || slugMatches) {
    verdict = 'review'
    reason = 'partial match against the canonical list — slug or name drifted'
  } else {
    verdict = 'review'
    reason = 'not in the canonical list'
  }

  return {
    term_id: tt.term_id,
    term_taxonomy_id: tt.term_taxonomy_id,
    taxonomy: tt.taxonomy,
    slug: term.slug ?? '',
    name: term.name ?? '',
    publish: counts.publish,
    draft: counts.draft,
    private: counts.private,
    corpus_total: corpus.length,
    canonical: isHub && nameMatches && slugMatches
      ? (canonical.find((c) => c.slug === term.slug)?.id ?? term.slug)
      : '',
    duplicate_of: '',
    legacy: false,
    verdict,
    reason,
  }
})

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, 'hub-audit.json'), JSON.stringify(table, null, 2))

/* -------------------------------------------------------------- report */

const hubs = table.filter((r) => r.taxonomy === 'gcalls_hub')
const others = table.filter((r) => r.taxonomy !== 'gcalls_hub' && r.corpus_total > 0)

console.log(`canonical HUBs registered by the plugin: ${canonical.length}`)
console.log(`gcalls_hub terms in the database:        ${hubs.length}`)
console.log(`  of those, carrying at least one article: ${hubs.filter((r) => r.corpus_total > 0).length}`)
console.log(`  of those, unused:                        ${hubs.filter((r) => r.corpus_total === 0).length}`)
console.log(`non-HUB taxonomy terms on corpus posts:  ${others.length}`)

const pad = (s, n) => String(s).padEnd(n).slice(0, n)
console.log(
  `\n${pad('id', 5)} ${pad('taxonomy', 12)} ${pad('slug', 42)} ${pad('name', 40)} ${pad('pub', 4)}${pad('drf', 5)}${pad('prv', 4)} ${pad('verdict', 8)} reason`,
)
console.log('-'.repeat(170))
for (const r of [...hubs, ...others].sort((a, b) => b.corpus_total - a.corpus_total)) {
  console.log(
    `${pad(r.term_id, 5)} ${pad(r.taxonomy, 12)} ${pad(r.slug, 42)} ${pad(r.name, 40)} ` +
      `${pad(r.publish, 4)}${pad(r.draft, 5)}${pad(r.private, 4)} ${pad(r.verdict, 8)} ${r.reason}`,
  )
}

/* Articles with no HUB at all. */
const hubTtIds = new Set(hubs.map((r) => r.term_taxonomy_id))
const hubbed = new Set(trel.filter((r) => hubTtIds.has(r.term_taxonomy_id)).map((r) => r.object_id))
const orphans = [...statusOf.keys()].filter((id) => !hubbed.has(id))

console.log(`\narticles with no HUB: ${orphans.length}`)
for (const id of orphans) {
  const p = posts.find((x) => x.ID === id)
  console.log(`  ID ${id}  ${p.post_status.padEnd(8)} ${p.post_name}`)
  console.log(`     title: ${p.post_title}`)
}

console.log('\nwritten: wordpress/dist/hub-audit.json')
console.log('No term was renamed, merged or deleted. This run is read-only.')
