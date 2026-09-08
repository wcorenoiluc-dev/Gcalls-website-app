#!/usr/bin/env node
/**
 * GCALLS-051 — source → manifest parity for the two content gaps GCALLS-046 found.
 *
 * WHY THIS EXISTS
 * content-completeness-test.php passes a card as long as it has a title OR a
 * body. The Guides "paths" cards each had a title and an EMPTY body, so that
 * test — and the live section counter — stayed green while the audience sentence
 * and all thirty checkpoints were missing. Counting cards cannot see a field
 * that is gone. This asserts the FIELDS, per section id, against the source of
 * truth in src/data, and proves the assertion by mutating a copy and watching it
 * fail.
 *
 * Scope (exactly what the brief locks):
 *   GUIDES_SOURCE_PARITY — 6 audience + 30 checkpoints (content AND order).
 *   PROSE_NOTES_12        — 12 prose `note` fields present to be rendered.
 *
 * This checks source → manifest. The manifest → DOM half is verified against the
 * really-rendered page in verify-guides-notes-dom-051.mjs after install.
 *
 * Run:  node wordpress/scripts/verify-guides-notes-051.mjs
 * Exit: 0 all pass · 1 a real check failed · 2 harness/setup error.
 */
import { build } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const MANIFEST = process.env.GCALLS_MANIFEST ||
  path.join(ROOT, 'wordpress/wp-content/plugins/gcalls-core/data/content-pages.json')

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim()
const die = (m) => { console.error(`FATAL: ${m}`); process.exit(2) }

/* The twelve prose notes the audit inventoried, by page. A prose section that
 * carries a note must render it; the count and distribution are locked so that
 * dropping one from the manifest fails here rather than silently. */
const EXPECTED_NOTE_PAGES = {
  'case-studies': 2, 'doi-tac': 2, ebook: 2, faq: 1, glossary: 1, guides: 2, 'khach-hang': 2,
}

/* ---- source of truth: bundle the guides module and read the real objects ---- */
async function loadGuides() {
  const tmp = process.env.GCALLS_TMP || '/tmp/gcalls-051-parity'
  fs.mkdirSync(tmp, { recursive: true })
  const entry = path.join(tmp, 'entry.mjs')
  fs.writeFileSync(entry, "import { GUIDES } from '@/data/resources/guides'\nexport default GUIDES\n")
  const out = path.join(tmp, 'bundle.mjs')
  await build({
    entryPoints: [entry], bundle: true, format: 'esm', platform: 'node',
    outfile: out, logLevel: 'silent', alias: { '@': path.join(ROOT, 'src') },
  })
  return (await import(`file://${out}?t=${Date.now()}`)).default
}

/* ---- the assertions, as a pure function so a mutated manifest can be re-run --- */
function runChecks(manifest, guidesSrc) {
  const results = []
  const ok = (name, cond, detail = '') => results.push({ name, pass: !!cond, detail })

  const pages = new Map(manifest.pages.map((p) => [p.slug, p]))

  /* GUIDES_SOURCE_PARITY */
  const guides = pages.get('guides')
  const paths = guides?.sections?.find((s) => s.from === 'guides — paths')
  const srcItems = guidesSrc.paths.items

  ok('guides paths section present', !!paths)
  ok('guides paths has 6 cards', (paths?.cards?.length ?? 0) === 6,
    `got ${paths?.cards?.length ?? 0}`)

  let audienceCount = 0
  let checkpointCount = 0

  for (let i = 0; i < srcItems.length; i++) {
    const src = srcItems[i]
    const card = paths?.cards?.[i] ?? {}
    const wantTitle = clean(src.title)
    const wantAudience = clean(src.audience)
    const wantChecks = (src.checkpoints ?? []).map(clean)

    ok(`path ${i + 1} title matches source`, clean(card.title) === wantTitle,
      `\n      want: ${wantTitle}\n      got:  ${clean(card.title)}`)

    // audience is the card body — a title with an empty body is the exact defect.
    const gotAudience = clean(card.body)
    ok(`path ${i + 1} audience present & matches source`,
      gotAudience !== '' && gotAudience === wantAudience,
      `\n      want: ${wantAudience}\n      got:  ${gotAudience}`)
    if (gotAudience !== '' && gotAudience === wantAudience) audienceCount++

    // checklist — content AND order, exactly five.
    const gotChecks = (card.checklist ?? []).map(clean)
    const orderedMatch = gotChecks.length === wantChecks.length &&
      wantChecks.every((c, k) => c === gotChecks[k])
    ok(`path ${i + 1} has 5 checkpoints in source order`,
      gotChecks.length === 5 && orderedMatch,
      `\n      want(${wantChecks.length}): ${JSON.stringify(wantChecks)}\n      got(${gotChecks.length}):  ${JSON.stringify(gotChecks)}`)
    if (orderedMatch) checkpointCount += gotChecks.length
  }

  ok('GUIDES: 6 audience total', audienceCount === 6, `got ${audienceCount}`)
  ok('GUIDES: 30 checkpoints total', checkpointCount === 30, `got ${checkpointCount}`)

  /* PROSE_NOTES_12 */
  const notePages = {}
  let noteTotal = 0
  for (const p of manifest.pages) {
    for (const s of p.sections ?? []) {
      if (s.type === 'prose' && clean(s.note) !== '') {
        notePages[p.slug] = (notePages[p.slug] ?? 0) + 1
        noteTotal++
      }
    }
  }
  ok('PROSE_NOTES: exactly 12 prose notes', noteTotal === 12, `got ${noteTotal}`)
  for (const [slug, want] of Object.entries(EXPECTED_NOTE_PAGES)) {
    ok(`PROSE_NOTES: ${slug} carries ${want} note(s)`, (notePages[slug] ?? 0) === want,
      `got ${notePages[slug] ?? 0}`)
  }
  // No stray note-bearing prose page outside the inventoried seven.
  const stray = Object.keys(notePages).filter((s) => !(s in EXPECTED_NOTE_PAGES))
  ok('PROSE_NOTES: no unexpected note pages', stray.length === 0, stray.join(','))

  return results
}

/* ---- negative controls: a copy is mutated, and the checks MUST catch it ---- */
function mutant(manifest, fn) {
  const copy = JSON.parse(JSON.stringify(manifest))
  fn(copy)
  return copy
}
function guidesPaths(m) {
  return m.pages.find((p) => p.slug === 'guides').sections.find((s) => s.from === 'guides — paths')
}

/* ---- main ---- */
const guidesSrc = await loadGuides().catch((e) => die(`bundling guides.ts: ${e.message}`))
if (!fs.existsSync(MANIFEST)) die(`manifest not found: ${MANIFEST}`)
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))

const real = runChecks(manifest, guidesSrc)
const failed = real.filter((r) => !r.pass)

console.log('GCALLS-051 SOURCE → MANIFEST PARITY\n')
console.log(`manifest: ${MANIFEST}\n`)
for (const r of real) console.log(`  ${r.pass ? 'ok  ' : 'FAIL'} ${r.name}${r.pass ? '' : r.detail}`)
console.log(`\n  GUIDES_SOURCE_PARITY + PROSE_NOTES_12: ${real.length - failed.length}/${real.length} checks passed`)

/* Negative tests — each mutation must produce at least one NEW failure vs the
 * clean baseline. If a mutation slips through green, the test is decorative. */
const negatives = [
  ['drop one checkpoint', (m) => { guidesPaths(m).cards[0].checklist.splice(2, 1) }],
  ['blank one audience', (m) => { guidesPaths(m).cards[1].body = '' }],
  ['keep title, drop body + checklist', (m) => { const c = guidesPaths(m).cards[2]; c.body = ''; c.checklist = [] }],
  ['reorder checkpoints', (m) => { const cl = guidesPaths(m).cards[3].checklist; [cl[0], cl[1]] = [cl[1], cl[0]] }],
  ['drop a prose note', (m) => { const g = m.pages.find((p) => p.slug === 'glossary'); const s = g.sections.find((x) => x.type === 'prose' && x.note); s.note = '' }],
]

console.log('\nNEGATIVE CONTROLS (each mutation MUST fail):')
let negBad = 0
for (const [label, fn] of negatives) {
  const res = runChecks(mutant(manifest, fn), guidesSrc)
  const caught = res.some((r) => !r.pass)
  console.log(`  ${caught ? 'ok  ' : 'LEAK'} ${label} → ${caught ? 'FAILED as required' : 'slipped through GREEN'}`)
  if (!caught) negBad++
}

const verdict = failed.length === 0 && negBad === 0
console.log(`\nGUIDES_SOURCE_PARITY: ${failed.some((f) => f.name.startsWith('path') || f.name.startsWith('GUIDES') || f.name.startsWith('guides')) ? 'FAIL' : 'PASS'}`)
console.log(`PROSE_NOTES_12:       ${failed.some((f) => f.name.startsWith('PROSE')) ? 'FAIL' : 'PASS'}`)
console.log(`NEGATIVE_CONTROLS:    ${negBad === 0 ? 'PASS' : 'FAIL'}`)
process.exit(verdict ? 0 : 1)
