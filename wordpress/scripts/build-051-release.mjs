#!/usr/bin/env node
/**
 * GCALLS-051 — CONTENT-ONLY release: Core 0.10.10.
 *
 * WHAT THIS ADDS OVER LIVE 0.10.8
 * Two source-content gaps GCALLS-046 found and GCALLS-051 closed, both dropped
 * fields the section counter could not see:
 *   1. Guides "sáu lộ trình": each of the six paths now carries its audience
 *      sentence (card body) and its five checkpoints (an in-card <ol>), ported
 *      verbatim from src/data/resources/guides.ts.
 *   2. Twelve prose `note` fields now render — the prose branch printed only the
 *      body, so every note was dropped.
 * The change set is exactly three files already on the 0.10.8 overlay list:
 * data/content-pages.json, includes/class-content-pages.php, assets/css/content-pages.css.
 *
 * WHY 0.10.10 AND NOT 0.10.9
 * 0.10.9 is reserved for the lead form, which ships only after cache and SMTP
 * are settled (GCALLS-047 §5). This is content, so it takes the next free
 * number and the form stays out — the same gates as 0.10.8 enforce that.
 *
 * WHY THIS IS NOT "ZIP THE WORKING TREE"
 * The working tree's gcalls-core.php carries 0.9.7 and swaps in the Leads
 * bootstrap. So Core 0.10.10 is assembled as exact 0.10.1 (hash-pinned) plus a
 * named list of reviewed files, form runtime reverted, and asserted to differ
 * from 0.10.1 only by those files. Theme is untouched: the stylesheet ships from
 * the plugin, so no theme release is part of this.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { buildZip, verifyZip, describe, vet } from './lib/package.mjs'

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const OUT = process.env.GCALLS_RELEASE_OUT || path.join(REPO, 'wordpress/.release-051')
const VERSION = '0.10.10'
const ZIP_0101 = process.env.GCALLS_0101_ZIP ||
  '/Users/macos/Desktop/gcalls-core-0.10.1-CANDIDATE-do-not-deploy-yet/gcalls-core-0.10.1.zip'
const ZIP_0101_SHA = '52ffe873880a304714a858ff69e680ec48c6d741cf90e744d4e46d0f695a0c48'

const CORE_SRC = path.join(REPO, 'wordpress/wp-content/plugins/gcalls-core')

const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const die = (m) => { console.error(`FATAL: ${m}`); process.exit(2) }

/* Reviewed changes to Core, and nothing else — identical set to 0.10.8. The
 * GCALLS-051 edits live inside three of these files. */
const CORE_ADD = [
  'assets/css/content-pages.css',
  'data/content-inventory.json',
  'includes/class-icons.php',
  'includes/class-sections.php',
  'data/section-components.json',
  'data/media-frames.json',
]
const CORE_MODIFY = [
  'data/homepage-elementor.json',
  'data/homepage-inventory.json',
  'includes/class-content-pages.php',
  'data/content-pages.json',
  'includes/class-mockups.php',
  'assets/css/mockups.css',
  'data/product-pages.json',
]

/* Approved REFUSED-image removals, pinned by SHA — carried forward from 0.10.8. */
const APPROVED_REMOVALS = [
  { id: 'webphone-overview', file: 'assets/images/product-gallery/webphone-overview.webp', sha256: '1ea97958d1d26af6fc3ffda8b32b4d929b51b24dc568c9f4ff745820d705c965' },
  { id: 'customer-profile', file: 'assets/images/product-gallery/customer-profile.webp', sha256: '926de3b7385b311bed87d758d04f0b631423b3c6a15bc7a09b29786a13cc8099' },
  { id: 'call-history', file: 'assets/images/product-gallery/call-history.webp', sha256: '0da67896db7940b1d727e508d8183e34e0106d18f75fef95c9e006254c1bf675' },
  { id: 'analytics-dashboard', file: 'assets/images/product-gallery/analytics-dashboard.webp', sha256: '3369ece36e9ac83449d31f44d24ed386ebecdcca9cd54bbc8db5a7bfec5767b2' },
  { id: 'agent-performance', file: 'assets/images/product-gallery/agent-performance.webp', sha256: '6bbaf13f3e8d8360859c54e438a3f6555d0a38adbcceed6832a096d944e796ca' },
  { id: 'click-to-call', file: 'assets/images/product-gallery/click-to-call.webp', sha256: '72b8782477a6948d276868ffd6db975bd57aa10d1bd34b07c00d79b45c557b67' },
]

/* Never, under any name. */
const FORBIDDEN = [
  'includes/class-leads.php', 'assets/js/lead-form.js',
  'assets/css/lead-form.css', 'tests/leads-test.php',
]

fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(OUT, { recursive: true })

/* ---- 1. exact 0.10.1, hash-checked ---- */
if (!fs.existsSync(ZIP_0101)) die(`0.10.1 zip not found: ${ZIP_0101}`)
if (sha(ZIP_0101) !== ZIP_0101_SHA) die(`0.10.1 zip hash mismatch\n  want ${ZIP_0101_SHA}\n  got  ${sha(ZIP_0101)}`)

const base = path.join(OUT, '_base')
fs.mkdirSync(base, { recursive: true })
execFileSync('unzip', ['-q', '-o', ZIP_0101, '-d', base])
const baseCore = path.join(base, 'gcalls-core')
if (!fs.existsSync(baseCore)) die('0.10.1 zip did not contain gcalls-core/')

const build = path.join(OUT, 'gcalls-core')
fs.cpSync(baseCore, build, { recursive: true })

/* ---- 2. overlay the reviewed changes ---- */
for (const rel of [...CORE_ADD, ...CORE_MODIFY]) {
  const src = path.join(CORE_SRC, rel)
  if (!fs.existsSync(src)) die(`reviewed file missing from working tree: ${rel}`)
  fs.mkdirSync(path.dirname(path.join(build, rel)), { recursive: true })
  fs.copyFileSync(src, path.join(build, rel))
}

/* ---- 2b. remove the approved REFUSED assets, each verified by hash ---- */
const registry = JSON.parse(fs.readFileSync(path.join(build, 'data/media-frames.json'), 'utf8'))
for (const item of APPROVED_REMOVALS) {
  const target = path.join(build, item.file)
  if (!fs.existsSync(target)) die(`approved removal not found in the build: ${item.file}`)
  const actual = sha(target)
  if (actual !== item.sha256) die(`${item.file} is not the reviewed image\n  want ${item.sha256}\n  got  ${actual}`)
  const entry = registry.frames?.[item.id]
  if (!entry) die(`${item.id} is not in the media registry — refusing to remove an unregistered file`)
  if (entry.verdict === 'PASS') die(`${item.id} is PASS in the registry — removing it would break a rendering frame`)
  if (entry.file !== path.basename(item.file)) die(`${item.id} registry filename disagrees with the removal table`)
  fs.rmSync(target)
}
for (const [id, frame] of Object.entries(registry.frames ?? {})) {
  if (frame.verdict !== 'PASS') continue
  const kept = path.join(build, 'assets/images/product-gallery', frame.file)
  if (!fs.existsSync(kept)) die(`PASS frame ${id} lost its file: ${frame.file}`)
}

/* ---- 3. class-shortcodes.php: renderer changes WITHOUT the form runtime ---- */
const takeFn = (src, name) => {
  const start = src.indexOf(`\tpublic static function ${name}(`) >= 0
    ? src.indexOf(`\tpublic static function ${name}(`)
    : src.indexOf(`\tprivate static function ${name}(`)
  if (start < 0) return null
  let docStart = src.lastIndexOf('\t/**', start)
  const between = src.slice(docStart, start)
  if (docStart < 0 || between.includes('}\n')) docStart = start
  const end = src.indexOf('\n\t}\n', start) + 4
  return { start: docStart, end, text: src.slice(docStart, end) }
}

let sc = fs.readFileSync(path.join(CORE_SRC, 'includes/class-shortcodes.php'), 'utf8')
const sc0101 = fs.readFileSync(path.join(baseCore, 'includes/class-shortcodes.php'), 'utf8')
for (const fn of ['lead_state', 'lead_current_path']) {
  const cut = takeFn(sc, fn)
  if (cut) sc = sc.slice(0, cut.start) + sc.slice(cut.end)
}
const mine = takeFn(sc, 'lead_form')
const theirs = takeFn(sc0101, 'lead_form')
if (!mine || !theirs) die('could not locate lead_form() in both versions')
sc = sc.slice(0, mine.start) + theirs.text + sc.slice(mine.end)
fs.writeFileSync(path.join(build, 'includes/class-shortcodes.php'), sc)

/* ---- 4. bootstrap: 0.10.1's, at 0.10.10, plus the two new requires ---- */
let boot = fs.readFileSync(path.join(baseCore, 'gcalls-core.php'), 'utf8')
boot = boot.replace(' * Version:           0.10.1', ` * Version:           ${VERSION}`)
boot = boot.replace("const VERSION = '0.10.1';", `const VERSION = '${VERSION}';`)
boot = boot.replace(
  "require_once GCALLS_CORE_DIR . 'includes/class-shortcodes.php';",
  "require_once GCALLS_CORE_DIR . 'includes/class-icons.php';\n" +
  "require_once GCALLS_CORE_DIR . 'includes/class-sections.php';\n" +
  "require_once GCALLS_CORE_DIR . 'includes/class-shortcodes.php';")
if (!boot.includes('class-icons.php')) die('could not add the new requires to the bootstrap')
if (!boot.includes(` * Version:           ${VERSION}`)) die('version header not set')
fs.writeFileSync(path.join(build, 'gcalls-core.php'), boot)

/* ---- 5. gates ---- */
const walk = (d, p = '', o = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const rel = p ? `${p}/${e.name}` : e.name
    e.isDirectory() ? walk(path.join(d, e.name), rel, o) : o.push(rel)
  }
  return o
}
const baseFiles = walk(baseCore)
const buildFiles = walk(build)

const lost = baseFiles.filter((f) => !buildFiles.includes(f))
const approvedPaths = new Set(APPROVED_REMOVALS.map((r) => r.file))
const unapproved = lost.filter((f) => !approvedPaths.has(f))
if (unapproved.length) die(`Core ${VERSION} drops file(s) nobody approved: ${unapproved.join(', ')}`)
const notRemoved = APPROVED_REMOVALS.filter((r) => buildFiles.includes(r.file))
if (notRemoved.length) die(`approved removal(s) still in the package: ${notRemoved.map((r) => r.id).join(', ')}`)
if (lost.length !== APPROVED_REMOVALS.length) die(`expected exactly ${APPROVED_REMOVALS.length} removal(s), found ${lost.length}`)

const leaked = buildFiles.filter((f) => FORBIDDEN.includes(f) || /lead-form|class-leads/.test(f))
if (leaked.length) die(`form artifacts leaked into Core: ${leaked.join(', ')}`)

for (const f of buildFiles.filter((f) => f.endsWith('.php'))) {
  const t = fs.readFileSync(path.join(build, f), 'utf8')
  const code = t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  if (/\bLeads::/.test(code)) die(`executable Leads:: reference survives in ${f}`)
}

/* Content gate specific to this release: the manifest must CARRY the restored
 * fields, or the package would ship the same empty cards it set out to fix. */
const cpDoc = JSON.parse(fs.readFileSync(path.join(build, 'data/content-pages.json'), 'utf8'))
if (cpDoc.pages.length < 31) die(`content manifest has only ${cpDoc.pages.length} pages`)
const gp = cpDoc.pages.find((p) => p.slug === 'guides')?.sections?.find((s) => s.from === 'guides — paths')
const audiences = (gp?.cards ?? []).filter((c) => String(c.body ?? '').trim() !== '').length
const checkpoints = (gp?.cards ?? []).reduce((n, c) => n + (Array.isArray(c.checklist) ? c.checklist.length : 0), 0)
if (audiences !== 6) die(`guides paths ships ${audiences}/6 audience bodies`)
if (checkpoints !== 30) die(`guides paths ships ${checkpoints}/30 checkpoints`)
const notes = cpDoc.pages.reduce((n, p) => n + (p.sections ?? []).filter((s) => s.type === 'prose' && String(s.note ?? '').trim() !== '').length, 0)
if (notes !== 12) die(`manifest carries ${notes}/12 prose notes`)

/* The renderer must actually emit both — not just carry them in the manifest. */
const renderer = fs.readFileSync(path.join(build, 'includes/class-content-pages.php'), 'utf8')
if (!renderer.includes('gcalls-cp__checklist')) die('renderer does not emit the checklist markup')
// The prose branch reads $s['note'] and emits gcalls-cp__note; the cards branch
// already emitted the class, so parity means the note class appears twice.
const proseBranch = renderer.slice(renderer.indexOf("'prose' === $type"), renderer.indexOf("'cards' === $type"))
if (!proseBranch.includes("$s['note']") || !proseBranch.includes('gcalls-cp__note')) {
  die('renderer prose branch does not emit the note')
}

console.log(`Core ${VERSION}:  ${buildFiles.length} files (0.10.1 had ${baseFiles.length}: +${buildFiles.filter((f) => !baseFiles.includes(f)).length} added, -${lost.length} approved removals)`)
console.log(`content gate: 6/6 audience · 30/30 checkpoints · 12/12 notes · manifest pages ${cpDoc.pages.length}`)
console.log(`form artifacts: 0   Leads:: references: 0`)

/* ---- 6. reproducible zip + digest (fixed mtimes → content-only SHA) ---- */
const rel = walk(build)
const problems = await vet(build, rel)
if (problems.length) die(`package vet failed:\n  ${problems.join('\n  ')}`)

const zipPath = path.join(OUT, `gcalls-core-${VERSION}.zip`)
await buildZip({ root: build, relativePaths: rel, rootName: 'gcalls-core', outPath: zipPath })
const zipProblems = await verifyZip(zipPath, 'gcalls-core', rel)
if (zipProblems.length) die(`zip verify failed:\n  ${zipProblems.join('\n  ')}`)

const info = await describe(zipPath)
fs.writeFileSync(path.join(OUT, 'SHA256SUMS'), `${info.sha256}  gcalls-core-${VERSION}.zip\n`)
fs.rmSync(base, { recursive: true, force: true })

console.log(`\nARTIFACT  gcalls-core-${VERSION}.zip`)
console.log(`  bytes   ${info.bytes}`)
console.log(`  files   ${info.files}`)
console.log(`  sha256  ${info.sha256}`)
console.log(`\nstaged in ${OUT}`)
