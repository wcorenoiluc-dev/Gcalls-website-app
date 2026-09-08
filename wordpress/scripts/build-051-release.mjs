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
 * bootstrap. So Core is assembled as exact 0.10.1 (hash-pinned) plus a named
 * list of reviewed files, form runtime reverted, and asserted to differ from
 * 0.10.1 only by those files. Theme is untouched by default: the stylesheet
 * ships from the plugin, so no theme release is part of this unless the theme
 * source genuinely differs.
 *
 * ---------------------------------------------------------------------------
 * GCALLS-053 HARDENING — WHY THE GATES BELOW EXIST
 * ---------------------------------------------------------------------------
 * The audit in docs/content-review/gcalls-053/build-graph-audit.md found this
 * script's real defect: it never ran the generators. It packaged whatever
 * manifest and Elementor JSON happened to be sitting in the working tree, so a
 * stale artifact would have shipped silently — and the content gate, which only
 * counts 6/6 audiences, 30/30 checkpoints and 12/12 notes, would still have
 * passed, because stale data satisfies those counts too.
 *
 * The version is now a REQUIRED argument rather than a constant, because the
 * same script must be able to build a provisional artifact before the homepage
 * merge and the real release after it, and because a version baked into source
 * is a version that gets reused.
 *
 *   node wordpress/scripts/build-051-release.mjs --version 0.10.10-rc053
 *   node wordpress/scripts/build-051-release.mjs --version 0.10.11 --final
 *
 * 0.10.11 is refused without --final: it is reserved for the integrated
 * artifact built after Homepage 052 merges, and --final additionally requires
 * the homepage generator's output to be current.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { buildZip, verifyZip, describe, vet } from './lib/package.mjs'

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')

const argv = process.argv.slice(2)
const argOf = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null }
const FINAL = argv.includes('--final')
const VERSION = argOf('--version')

const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const die = (m) => { console.error(`FATAL: ${m}`); process.exit(2) }
const ok = (m) => console.log(`  gate  ${m}`)

if (!VERSION) die('--version is required. Refusing to bake a release number into source.')
if (!/^\d+\.\d+\.\d+(-[A-Za-z0-9.]+)?$/.test(VERSION)) die(`--version "${VERSION}" is not a version`)

/* 0.10.11 is reserved for the integrated artifact built AFTER Homepage 052
 * merges. Anything earlier that claims the number would make the number a lie. */
const RESERVED_FINAL = '0.10.11'
if (VERSION === RESERVED_FINAL && !FINAL) {
  die(`${RESERVED_FINAL} is reserved for the final integrated artifact. Pass --final, or pick a provisional name such as 0.10.10-rc053.`)
}
if (FINAL && VERSION !== RESERVED_FINAL) die(`--final builds ${RESERVED_FINAL}, not ${VERSION}`)

const OUT = process.env.GCALLS_RELEASE_OUT ||
  path.join(REPO, FINAL ? 'wordpress/.release-053' : `wordpress/.release-053-${VERSION}`)

const ZIP_0101 = process.env.GCALLS_0101_ZIP ||
  '/Users/macos/Desktop/gcalls-core-0.10.1-CANDIDATE-do-not-deploy-yet/gcalls-core-0.10.1.zip'
const ZIP_0101_SHA = '52ffe873880a304714a858ff69e680ec48c6d741cf90e744d4e46d0f695a0c48'

/* The live baseline. 0.10.11 must be a superset of what 0.10.8 already ships,
 * so the reconciled hash from Phase F0 is pinned here and the overlay set is
 * asserted against the ZIP's own contents rather than against a memory of it. */
const ZIP_0108 = process.env.GCALLS_0108_ZIP || path.join(REPO, 'wordpress/.release-047/gcalls-core-0.10.8.zip')
const ZIP_0108_SHA = '0357782e9786b214dcbec6e1f391701da4256c5597f8fce6cb1f1afb5218d657'

/* The commit that first carried the WordPress source into the integration
 * branch. Building from a tree that predates it produces a plugin with no
 * Content_Pages at all, and 31 pages render blank. */
const WP_SOURCE_COMMIT = '63e93ae'

const CORE_SRC = path.join(REPO, 'wordpress/wp-content/plugins/gcalls-core')
const THEME_SRC = path.join(REPO, 'wordpress/wp-content/themes/gcalls-theme')

const git = (...a) => execFileSync('git', ['-C', REPO, ...a], { encoding: 'utf8' }).trim()

/* ---- gate 0: provenance ------------------------------------------------- */
let HEAD = ''
try { HEAD = git('rev-parse', 'HEAD') } catch { die('not a git checkout — a release must be traceable to a commit') }

try { git('merge-base', '--is-ancestor', WP_SOURCE_COMMIT, 'HEAD') }
catch { die(`WordPress source commit ${WP_SOURCE_COMMIT} is not an ancestor of HEAD (${HEAD.slice(0, 7)}). This tree cannot contain the shipped plugin source.`) }
ok(`provenance: ${WP_SOURCE_COMMIT} is an ancestor of HEAD ${HEAD.slice(0, 7)}`)

/* A release must be rebuildable from a commit, so the source it is built from
 * may not have uncommitted edits. Only the paths that actually enter the ZIP
 * are checked — an unrelated dirty file elsewhere is not this gate's business. */
const dirty = git('status', '--porcelain', '--', 'wordpress/wp-content/plugins/gcalls-core', 'wordpress/wp-content/themes/gcalls-theme', 'wordpress/scripts')
  .split('\n').filter(Boolean)
if (dirty.length) die(`packaged source has uncommitted changes:\n    ${dirty.join('\n    ')}`)
ok('packaged source is committed')

/* Source-tree hash: one digest over every file that can influence the package,
 * recorded in the manifest so a future build can prove it used the same input. */
const treeHash = (() => {
  const h = crypto.createHash('sha256')
  const walkSrc = (d, base) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(d, e.name)
      if (e.isDirectory()) { walkSrc(full, base); continue }
      h.update(path.relative(base, full)).update('\0').update(fs.readFileSync(full)).update('\0')
    }
  }
  walkSrc(CORE_SRC, REPO)
  walkSrc(THEME_SRC, REPO)
  return h.digest('hex')
})()
ok(`source-tree hash ${treeHash.slice(0, 16)}…`)

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

/* ---- 0b. RUN THE GENERATORS, then prove the artifacts came from this run ----
 *
 * This is the gap the F1 audit found. Previously the script copied whatever
 * data/*.json happened to be in the tree. Now every artifact that HAS a
 * generator is regenerated here, before anything is packaged, and the result is
 * compared against what was committed.
 *
 * The generators are deterministic: build-homepage-template.mjs states that its
 * element ids are a hash of a counter and that reruns are byte-identical, and
 * the product/estimator generators derive from committed source data. So a
 * regeneration that CHANGES a file means the committed artifact was stale, and
 * that is a build failure rather than something to paper over by shipping the
 * fresh copy — the stale file is committed, and the commit is what reviewers
 * read.
 *
 * Four artifacts have no generator: content-pages.json, section-components.json,
 * media-frames.json and content-inventory.json were produced by one-off
 * migration and scan scripts (port-content-044, build-icon-registry, scan-039/040,
 * build-content-inventory-047) that are not reproducible transformations of
 * current source. They are hashed and recorded instead, and the manifest says so
 * rather than implying they were regenerated.
 */
const GENERATORS = [
  { script: 'build-product-content.mjs', writes: ['data/product-pages.json'] },
  { script: 'build-estimator-config.mjs', writes: ['data/estimator-config.json'] },
  { script: 'build-loss-estimator-config.mjs', writes: ['data/loss-estimator-config.json'] },
  { script: 'build-homepage-template.mjs', writes: ['data/homepage-elementor.json', 'data/homepage-inventory.json'] },
]
const NOT_GENERATED = [
  'data/content-pages.json', 'data/section-components.json',
  'data/media-frames.json', 'data/content-inventory.json',
]

const genStart = Date.now()
const before = new Map()
for (const g of GENERATORS) for (const w of g.writes) before.set(w, sha(path.join(CORE_SRC, w)))

for (const g of GENERATORS) {
  try {
    execFileSync('node', [path.join(REPO, 'wordpress/scripts', g.script)], { cwd: REPO, stdio: 'pipe' })
  } catch (e) {
    die(`generator failed: ${g.script}\n    ${String(e.stderr || e.message).slice(0, 400)}`)
  }
}
const drifted = []
for (const [w, h] of before) if (sha(path.join(CORE_SRC, w)) !== h) drifted.push(w)
if (drifted.length) {
  die(`generated artifact(s) are stale in the commit — regenerating changed them:\n    ${drifted.join('\n    ')}\n` +
      `  Commit the regenerated files, then build again.`)
}
ok(`generators ran (${GENERATORS.length}) — every generated artifact reproduced byte-identically`)

/* Every generated artifact must carry an mtime from THIS run. A file the
 * generator did not touch is a file the generator did not actually produce. */
const notTouched = []
for (const g of GENERATORS) for (const w of g.writes) {
  if (fs.statSync(path.join(CORE_SRC, w)).mtimeMs < genStart) notTouched.push(w)
}
if (notTouched.length) die(`generator did not rewrite: ${notTouched.join(', ')} — it cannot be proven current`)
ok('generated artifacts carry this run\u2019s mtime')

/* ---- 0c. locked contracts on the generated homepage artifact ---- */
const homeDoc = JSON.parse(fs.readFileSync(path.join(CORE_SRC, 'data/homepage-elementor.json'), 'utf8'))
const homeContent = Array.isArray(homeDoc) ? homeDoc : (homeDoc.content ?? [])
const topSections = homeContent.filter((e) => e.elType === 'section')
if (topSections.length !== 13) die(`homepage artifact has ${topSections.length} top-level sections, not 13`)
let widgetCount = 0
const countWidgets = (e) => { if (e.elType === 'widget') widgetCount++; (e.elements ?? []).forEach(countWidgets) }
homeContent.forEach(countWidgets)
if (widgetCount !== 67) die(`homepage artifact has ${widgetCount} widgets, locked contract is 67`)
const homeInv = JSON.parse(fs.readFileSync(path.join(CORE_SRC, 'data/homepage-inventory.json'), 'utf8'))
const invLen = Array.isArray(homeInv) ? homeInv.length : (homeInv.sections?.length ?? -1)
if (invLen !== 13) die(`homepage inventory has ${invLen} entries, not 13`)
ok(`homepage artifact: 13 top-level sections, 67 widgets, inventory 13`)

/* --final additionally requires the homepage to carry the merged 052 content.
 * Building 0.10.11 from a homepage that predates the merge is exactly the
 * "stale artifact" failure this release exists to avoid. */
if (FINAL) {
  const homeJson = fs.readFileSync(path.join(CORE_SRC, 'data/homepage-elementor.json'), 'utf8')
  if (!/ph\u00e2n quy\u1ec1n|TeamPermissions/i.test(homeJson)) {
    die('--final: the homepage artifact does not carry the §12 team-permissions content from Homepage 052. Merge it first.')
  }
}

/* ---- 1. exact 0.10.1, hash-checked ---- */
if (!fs.existsSync(ZIP_0101)) die(`0.10.1 zip not found: ${ZIP_0101}`)
if (sha(ZIP_0101) !== ZIP_0101_SHA) die(`0.10.1 zip hash mismatch\n  want ${ZIP_0101_SHA}\n  got  ${sha(ZIP_0101)}`)

const base = path.join(OUT, '_base')
fs.mkdirSync(base, { recursive: true })
execFileSync('unzip', ['-q', '-o', ZIP_0101, '-d', base])
const baseCore = path.join(base, 'gcalls-core')
if (!fs.existsSync(baseCore)) die('0.10.1 zip did not contain gcalls-core/')
ok(`0.10.1 base verified ${ZIP_0101_SHA.slice(0, 16)}\u2026`)

/* ---- 1b. the LIVE baseline: 0.10.8, and the superset assertion ----
 *
 * 0.10.11 replaces 0.10.8 on the demo, so it must contain everything 0.10.8
 * contains. Comparing the candidate only against 0.10.1 would let a file that
 * 0.10.8 added silently disappear. The sidecar is checked as well as the ZIP,
 * because a hash nobody verifies is decoration. */
if (!fs.existsSync(ZIP_0108)) die(`live baseline 0.10.8 zip not found: ${ZIP_0108}`)
if (sha(ZIP_0108) !== ZIP_0108_SHA) die(`0.10.8 zip hash mismatch\n  want ${ZIP_0108_SHA}\n  got  ${sha(ZIP_0108)}`)
const sidecar = path.join(path.dirname(ZIP_0108), 'SHA256SUMS')
if (fs.existsSync(sidecar)) {
  const line = fs.readFileSync(sidecar, 'utf8').split('\n').find((l) => l.includes('gcalls-core-0.10.8.zip'))
  if (!line) die('0.10.8 sidecar does not mention the zip')
  if (!line.trim().startsWith(ZIP_0108_SHA)) die(`0.10.8 sidecar disagrees with the reconciled baseline:\n  ${line.trim()}`)
  ok('0.10.8 baseline + sidecar verified against the F0 reconciliation')
} else {
  die(`0.10.8 sidecar missing next to ${ZIP_0108} — refusing to trust an unverified baseline`)
}
const base8 = path.join(OUT, '_base8')
fs.mkdirSync(base8, { recursive: true })
execFileSync('unzip', ['-q', '-o', ZIP_0108, '-d', base8])
const baseCore8 = path.join(base8, 'gcalls-core')
if (!fs.existsSync(baseCore8)) die('0.10.8 zip did not contain gcalls-core/')

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

/* ---- 5b. superset of live 0.10.8 ---- */
const files8 = walk(baseCore8)
const missingFrom8 = files8.filter((f) => !buildFiles.includes(f) && !approvedPaths.has(f))
if (missingFrom8.length) die(`Core ${VERSION} is NOT a superset of live 0.10.8 — missing: ${missingFrom8.join(', ')}`)
ok(`superset of live 0.10.8 (${files8.length} files accounted for)`)

/* ---- 5c. PII and banned-content scan of the BUILT tree ----
 *
 * vet() covers secrets and file shapes. This covers the content rules this
 * project keeps re-learning: a real mailbox, a real phone number, an
 * unevidenced domain, or a retired fabricated identity reaching a package.
 * The masked convention (0900 000 0NN / 1900 000N) is what the approved
 * sanitized captures use and is explicitly allowed. */
const PII_RULES = [
  { name: 'real VN phone', re: /\b0(?:3|5|7|8|9)\d(?:[ .-]?\d){7}\b/g, allow: /^(?:0900[ .-]?000[ .-]?0\d\d|1900[ .-]?000\d)$/ },
  { name: 'non-published e-mail', re: /\b[A-Za-z0-9._%+-]+@(?!gcalls\.co\b)(?!example\.(?:com|org|test|invalid)\b)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
  { name: 'unevidenced domain', re: /\bgcalls\.vn\b/g },
  { name: 'retired identity', re: /Nguy\u1ec5n V\u0103n Minh|Tr\u1ea7n Th\u1ecb Lan|L\u00ea Ho\u00e0ng Ph\u00fac|Ph\u1ea1m Thu H\u00e0|V\u00f5 Minh Tu\u1ea5n|Nguy\u1ec5n H\u1eb1ng|\u0110\u1ed7 Quang H\u1ea3i/g },
]
const TEXTUAL = /\.(php|json|css|js|txt|md)$/i
const piiHits = []
for (const f of buildFiles.filter((f) => TEXTUAL.test(f))) {
  const text = fs.readFileSync(path.join(build, f), 'utf8')
  for (const rule of PII_RULES) {
    for (const m of new Set(text.match(rule.re) ?? [])) {
      if (rule.allow && rule.allow.test(m.trim())) continue
      piiHits.push(`${f}: ${rule.name} "${m}"`)
    }
  }
}
if (piiHits.length) die(`PII/banned-content scan failed on the built tree:\n    ${piiHits.slice(0, 20).join('\n    ')}`)
ok(`PII/banned-content scan clean across ${buildFiles.filter((f) => TEXTUAL.test(f)).length} text files`)

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

/* ---- 7. one version, one hash --------------------------------------------
 * A version that names two different archives is worse than no version. Every
 * previously staged release directory is searched for this version, and a
 * disagreement is fatal rather than a warning. */
const clashes = []
for (const d of fs.readdirSync(path.join(REPO, 'wordpress'), { withFileTypes: true })) {
  if (!d.isDirectory() || !/^\.(release|deploy)/.test(d.name)) continue
  const dir = path.join(REPO, 'wordpress', d.name)
  const stack = [dir]
  while (stack.length) {
    const cur = stack.pop()
    for (const e of fs.readdirSync(cur, { withFileTypes: true })) {
      const full = path.join(cur, e.name)
      if (e.isDirectory()) { stack.push(full); continue }
      if (e.name !== `gcalls-core-${VERSION}.zip`) continue
      if (path.resolve(full) === path.resolve(zipPath)) continue
      const other = sha(full)
      if (other !== info.sha256) clashes.push(`${path.relative(REPO, full)}  ${other}`)
    }
  }
}
if (clashes.length) {
  die(`version ${VERSION} already names a DIFFERENT archive:\n    ${clashes.join('\n    ')}\n` +
      `  built now: ${info.sha256}\n  Pick an unused version.`)
}
ok(`version ${VERSION} names exactly one archive`)

/* ---- 8. theme: package only if the theme genuinely differs ----------------
 * The working tree declares 0.8.5 while carrying 0.8.6's content — a stale
 * header, not a change. Bumping a theme version to keep numbers tidy makes the
 * version meaningless, so the theme is compared byte-for-byte against the last
 * shipped theme and reused when identical. */
const THEME_REF = path.join(REPO, 'wordpress/.release-047/gcalls-theme')
let themeNote = 'not packaged — no reference theme to compare against'
if (fs.existsSync(THEME_REF)) {
  const relTheme = walk(THEME_SRC)
  const differing = relTheme.filter((f) => {
    const a = path.join(THEME_SRC, f), b = path.join(THEME_REF, f)
    if (!fs.existsSync(b)) return true
    if (f === 'style.css') {
      const strip = (t) => t.replace(/^\s*\*?\s*Version:.*$/gim, '')
      return strip(fs.readFileSync(a, 'utf8')) !== strip(fs.readFileSync(b, 'utf8'))
    }
    return sha(a) !== sha(b)
  })
  const onlyInRef = walk(THEME_REF).filter((f) => !relTheme.includes(f))
  if (differing.length === 0 && onlyInRef.length === 0) {
    themeNote = 'unchanged vs 0.8.6 (version header ignored) — theme stays 0.8.6, not repackaged'
    ok('theme is byte-identical to 0.8.6 apart from its version header — not bumping')
  } else {
    themeNote = `THEME DIFFERS from 0.8.6: ${[...differing, ...onlyInRef.map((f) => `(removed) ${f}`)].join(', ')}`
    console.log(`  note  ${themeNote}`)
    console.log('  note  a real theme change needs its own version bump; this script does not invent one')
  }
}

/* ---- 9. release manifest -------------------------------------------------- */
fs.writeFileSync(path.join(OUT, 'SHA256SUMS'), `${info.sha256}  gcalls-core-${VERSION}.zip\n`)
const manifest = {
  version: VERSION,
  final: FINAL,
  builtAt: new Date().toISOString(),
  source: {
    head: HEAD,
    wordpressSourceCommit: WP_SOURCE_COMMIT,
    sourceTreeSha256: treeHash,
    workingTreeClean: true,
  },
  baselines: {
    assembledFrom: { zip: path.relative(REPO, ZIP_0101), sha256: ZIP_0101_SHA, version: '0.10.1' },
    supersetOf: { zip: path.relative(REPO, ZIP_0108), sha256: ZIP_0108_SHA, version: '0.10.8' },
  },
  generators: {
    executed: GENERATORS.map((g) => g.script),
    reproducedByteIdentical: true,
    notGenerated: NOT_GENERATED,
    notGeneratedNote: 'produced by one-off migration/scan scripts; hashed, not regenerated',
    notGeneratedHashes: Object.fromEntries(NOT_GENERATED.map((f) => [f, sha(path.join(CORE_SRC, f))])),
  },
  contracts: { homepageTopLevelSections: topSections.length, homepageWidgets: widgetCount, homepageInventory: invLen, manifestPages: cpDoc.pages.length },
  leadBackend: { packaged: false, forbidden: FORBIDDEN, executableLeadsReferences: 0 },
  theme: { version: '0.8.6', note: themeNote },
  artifact: { file: `gcalls-core-${VERSION}.zip`, bytes: info.bytes, files: info.files, sha256: info.sha256 },
}
fs.writeFileSync(path.join(OUT, 'release-manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
fs.writeFileSync(path.join(OUT, 'zip-file-inventory.txt'), rel.slice().sort().join('\n') + '\n')

fs.rmSync(base, { recursive: true, force: true })
fs.rmSync(base8, { recursive: true, force: true })

console.log(`\nARTIFACT  gcalls-core-${VERSION}.zip${FINAL ? '' : '   (PROVISIONAL — not a release)'}`)
console.log(`  bytes   ${info.bytes}`)
console.log(`  files   ${info.files}`)
console.log(`  sha256  ${info.sha256}`)
console.log(`  source  ${HEAD.slice(0, 7)}  tree ${treeHash.slice(0, 16)}\u2026`)
console.log(`  theme   ${themeNote}`)
console.log(`\nstaged in ${path.relative(REPO, OUT)}`)
if (!FINAL) console.log('\nThis is NOT release-ready and must not be deployed or called 0.10.11.')
