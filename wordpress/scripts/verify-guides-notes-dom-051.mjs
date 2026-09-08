#!/usr/bin/env node
/**
 * GCALLS-051 — manifest → DOM parity, against the really-rendered pages.
 *
 * The pages were fetched from the local WordPress (PHP 8.3) with Core 0.10.10
 * installed, saved to a directory this reads. It asserts the reader actually
 * SEES what the source and manifest carry:
 *   - Guides: six audience sentences, thirty checkpoints in source order, each
 *     inside the checklist markup (6 <ol>, 30 <li>).
 *   - The twelve prose notes each rendered inside a <p class="gcalls-cp__note">.
 *
 * Usage: node wordpress/scripts/verify-guides-notes-dom-051.mjs <html-dir>
 */
import { build } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const DIR = process.argv[2] || die('need <html-dir> with <slug>.html files')
const MANIFEST = process.env.GCALLS_MANIFEST || path.join(ROOT, 'wordpress/wp-content/plugins/gcalls-core/data/content-pages.json')

function die(m) { console.error(`FATAL: ${m}`); process.exit(2) }
const decode = (s) => String(s ?? '')
  .replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
  .replace(/&#8217;/g, '’').replace(/&#8211;/g, '–').replace(/&#8220;|&#8221;/g, '"')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
const clean = (s) => decode(s).replace(/\s+/g, ' ').trim()
const text = (html) => clean(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' '))
const read = (slug) => {
  const p = path.join(DIR, `${slug}.html`)
  if (!fs.existsSync(p)) die(`missing rendered page: ${p}`)
  return fs.readFileSync(p, 'utf8')
}

async function loadGuides() {
  const tmp = '/tmp/gcalls-051-dom'; fs.mkdirSync(tmp, { recursive: true })
  const entry = path.join(tmp, 'e.mjs')
  fs.writeFileSync(entry, "import { GUIDES } from '@/data/resources/guides'\nexport default GUIDES\n")
  const out = path.join(tmp, 'b.mjs')
  await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent', alias: { '@': path.join(ROOT, 'src') } })
  return (await import(`file://${out}?t=${Date.now()}`)).default
}

const results = []
const ok = (name, cond, detail = '') => results.push({ name, pass: !!cond, detail })

/* ---------- GUIDES: source → DOM ---------- */
const guidesSrc = await loadGuides().catch((e) => die(e.message))
const gHtml = read('guides')
const gText = text(gHtml)

const olCount = (gHtml.match(/class="gcalls-cp__checklist"/g) || []).length
const liCount = (gHtml.match(/gcalls-cp__checklist-item/g) || []).length
ok('guides: 6 checklist <ol> rendered', olCount === 6, `got ${olCount}`)
ok('guides: 30 checklist <li> rendered', liCount === 30, `got ${liCount}`)

let aud = 0
let cp = 0
let ordered = true
let lastIdx = -1
for (const item of guidesSrc.paths.items) {
  if (gText.includes(clean(item.audience))) aud++
  for (const c of item.checkpoints) {
    const needle = clean(c)
    const at = gText.indexOf(needle)
    if (at >= 0) cp++
    if (at >= 0 && at < lastIdx) ordered = false
    if (at >= 0) lastIdx = at
  }
}
ok('guides: 6/6 audience sentences visible in DOM', aud === 6, `got ${aud}`)
ok('guides: 30/30 checkpoints visible in DOM', cp === 30, `got ${cp}`)
ok('guides: checkpoints appear in source order', ordered)

/* ---------- NOTES: manifest → DOM ---------- */
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
const noteExpect = {}
for (const p of manifest.pages) {
  for (const s of p.sections || []) {
    if (s.type === 'prose' && clean(s.note) !== '') {
      (noteExpect[p.slug] ||= []).push(clean(s.note))
    }
  }
}
let noteTotal = 0
let noteSeen = 0
for (const [slug, notes] of Object.entries(noteExpect)) {
  const html = read(slug)
  // every gcalls-cp__note paragraph's cleaned text
  const paras = [...html.matchAll(/<p class="gcalls-cp__note">([\s\S]*?)<\/p>/g)].map((m) => clean(m[1]))
  for (const note of notes) {
    noteTotal++
    const rendered = paras.some((p) => p === note || p.includes(note))
    if (rendered) noteSeen++
    else ok(`note not rendered on ${slug}`, false, `\n      ${note.slice(0, 60)}...`)
  }
}
ok(`NOTES: 12 prose notes rendered in <p class="gcalls-cp__note"> (${noteSeen}/${noteTotal})`, noteSeen === 12 && noteTotal === 12, `seen ${noteSeen}, expected 12`)

/* ---------- report ---------- */
const failed = results.filter((r) => !r.pass)
console.log('GCALLS-051 MANIFEST → DOM (real WordPress render)\n')
console.log(`html dir: ${DIR}\n`)
for (const r of results) console.log(`  ${r.pass ? 'ok  ' : 'FAIL'} ${r.name}${r.pass ? '' : r.detail}`)
console.log(`\nGUIDES_DOM_PARITY: ${results.some((r) => r.name.startsWith('guides') && !r.pass) ? 'FAIL' : 'PASS'}`)
console.log(`PROSE_NOTES_12_DOM: ${results.some((r) => r.name.startsWith('NOTES') && !r.pass) || results.some((r) => r.name.startsWith('note not') ) ? 'FAIL' : 'PASS'}`)
process.exit(failed.length ? 1 : 0)
