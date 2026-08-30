/*
 * Completeness check: no approved content may go missing between the React
 * source and the page manifest.
 *
 * Without this, a mapper that misses an export produces a page that looks fine
 * and is quietly missing a section — which is exactly what happened on
 * /tong-dai-quoc-te/, whose data file names its sections differently from the
 * CRM one.
 *
 * WHY THIS IS ASKED PER FAMILY
 * The first version asked one question of every extract: "is each export either
 * MAPPED into this slug's sections or EXCLUDED?" That is the right question for
 * a DETAIL page, whose extract is one data file rendered as that page's
 * sections. It is a category error for an OVERVIEW page. `giai-phap.json` is an
 * aggregate: it fingerprints the five data files behind the solution DETAIL
 * pages (route-matrix.json records exactly that pairing), while the hub's own
 * four sections are built from src/data/hubs.ts and the live homepage envelope
 * — a different source entirely. So the two sides were unrelated by
 * construction, and the check reported all 94 of those exports as orphans even
 * though 81 of them are already MAPPED, with orphan=0, under their own detail
 * slugs. The same export cannot be both complete and missing.
 *
 * So each family is asked the question its extract can answer:
 *   solution-detail    every export is MAPPED or EXCLUDED  (unchanged)
 *   *-overview         the fingerprinted source set is exactly what
 *                      route-matrix.json declares for that route, and the hub
 *                      renders sections of its own
 * Card coverage for the hubs (3 products, 7 solutions, Voicebot once) is not
 * repeated here — check-taxonomy.mjs owns it.
 *
 * Every family additionally re-verifies its recorded sha256 against the file on
 * disk, so a source edited after extraction cannot ship behind a stale
 * fingerprint. Paths are repo-relative: this runs in CI with no checkout of its
 * own to locate.
 */
import fs from 'node:fs'
import crypto from 'node:crypto'

const EXTRACT = 'wordpress/content/extracted'
const MANIFEST = 'wordpress/wp-content/plugins/gcalls-core/data/content-pages.json'
const MATRIX = 'wordpress/content/route-matrix.json'

/* Exports that are deliberately not page sections. */
const EXCLUDE = {
  _LEAD: 'CTA attribution, carried on the cta not as a section',
  _ESTIMATOR_HREF: 'link target used by a CTA',
  _PLATFORM_NOTE: 'rendered inside the platforms section',
  _PLATFORM_SECTION: 'heading for the platforms section',
  _FAQ: 'rendered as the faq block',
  _FINAL_CTA: 'rendered as the cta block',
  _HERO: 'rendered as the hero block',
  _PRICING: 'pricing lives on /bang-gia/ — cross-page, not duplicated here',
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
const byslug = Object.fromEntries(manifest.pages.map((p) => [p.slug, p]))
const matrix = JSON.parse(fs.readFileSync(MATRIX, 'utf8'))
const routeOf = Object.fromEntries(matrix.map((r) => [r.route.replace(/^\/|\/$/g, ''), r]))

let fail = 0
const ok = (name, cond, detail = '') => {
  if (cond) { console.log(`  ok   ${name}`); return }
  fail++
  console.log(`  FAIL ${name}${detail ? ' — ' + detail : ''}`)
}

const base = (f) => f.split('/').pop()

console.log('CONTENT COMPLETENESS')

for (const file of fs.readdirSync(EXTRACT).filter((f) => f.endsWith('.json') && !f.startsWith('_'))) {
  const src = JSON.parse(fs.readFileSync(`${EXTRACT}/${file}`, 'utf8'))
  const page = byslug[src.slug]

  console.log(`\n${src.slug}  (${src.family}, ${Object.keys(src.exports).length} exports)`)

  /* A silent `continue` here was how an extract with no page could pass. */
  if (!page) { ok(`${src.slug} has a page in the manifest`, false, 'extract has no manifest page'); continue }

  /* Every family: the recorded fingerprint must still describe the file. */
  for (const s of src.sources) {
    if (!fs.existsSync(s.file)) { ok(`source present: ${base(s.file)}`, false, s.file); continue }
    const actual = crypto.createHash('sha256').update(fs.readFileSync(s.file)).digest('hex')
    ok(`fingerprint matches: ${base(s.file)}`, actual === s.sha256,
      `recorded ${s.sha256.slice(0, 12)}… actual ${actual.slice(0, 12)}…`)
  }

  if (src.family.endsWith('-overview')) {
    /* The aggregate's job is traceability, so check it against the record that
     * declares which data files the route is built from. */
    const route = routeOf[src.slug]
    ok('route-matrix declares this route', !!route)
    if (route) {
      const declared = route.react_data.split(',').map((s) => base(s.trim())).sort()
      const actual = src.sources.map((s) => base(s.file)).sort()
      ok('fingerprints exactly the sources route-matrix declares',
        JSON.stringify(declared) === JSON.stringify(actual),
        `declared [${declared}] vs extracted [${actual}]`)
    }
    ok('the hub renders sections of its own', page.sections.length > 0, `sections=${page.sections.length}`)
    continue
  }

  /* Detail families: the original question, unchanged. */
  const mapped = new Set(page.sections.map((s) => s.from))
  const rows = []
  for (const key of Object.keys(src.exports)) {
    const name = key.split('::')[1]
    const excluded = Object.keys(EXCLUDE).find((e) => name.endsWith(e))
    const isMapped = [...mapped].some((m) => name.endsWith(m))
    rows.push({ name, status: isMapped ? 'MAPPED' : excluded ? 'EXCLUDED' : 'ORPHAN' })
  }
  const orphans = rows.filter((r) => r.status === 'ORPHAN')
  console.log(`  mapped=${rows.filter((r) => r.status === 'MAPPED').length} excluded=${rows.filter((r) => r.status === 'EXCLUDED').length} orphan=${orphans.length}`)
  for (const o of orphans) console.log(`    ORPHAN  ${o.name}`)
  ok('every export is mapped or excluded', orphans.length === 0, `${orphans.length} orphan(s)`)
}

console.log(`\n${fail === 0 ? 'COMPLETE — no orphan content' : `INCOMPLETE — ${fail} failure(s)`}`)
process.exitCode = fail ? 1 : 0
