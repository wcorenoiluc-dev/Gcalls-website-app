#!/usr/bin/env node
/**
 * GCALLS-039 — build the release candidate from the correct bases.
 *
 * WHY THIS IS NOT "ZIP THE WORKING TREE"
 * The working tree is NOT the release base. Measured: its gcalls-core.php
 * carries version 0.9.7 (a downgrade from 0.10.1), and it REPLACED the
 * `Content_Pages` require and init with `Leads` — so packaging the working tree
 * would ship a lower version number and silently drop the renderer for all
 * thirteen content routes. Core 0.10.2 is therefore assembled as exact 0.10.1
 * plus a named list of reviewed changes, and asserted to be a strict superset.
 *
 * The form backend is a separate release. Nothing named below brings it, and
 * the build fails if any leads artifact or `Leads::` call reaches the package.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const OUT = process.env.GCALLS_RELEASE_OUT || path.join(REPO, 'wordpress/.release')
const ZIP_0101 = process.env.GCALLS_0101_ZIP ||
  '/Users/macos/Desktop/gcalls-core-0.10.1-CANDIDATE-do-not-deploy-yet/gcalls-core-0.10.1.zip'
const ZIP_0101_SHA = '52ffe873880a304714a858ff69e680ec48c6d741cf90e744d4e46d0f695a0c48'

const CORE_SRC = path.join(REPO, 'wordpress/wp-content/plugins/gcalls-core')
const THEME_SRC = path.join(REPO, 'wordpress/wp-content/themes/gcalls-theme')

const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const die = (m) => { console.error(`FATAL: ${m}`); process.exit(2) }

/* Reviewed changes to Core, and nothing else. */
const CORE_ADD = [
  'includes/class-icons.php',
  'includes/class-sections.php',
  'data/section-components.json',
  'data/media-frames.json',
]
const CORE_MODIFY = [
  // Renders a heading over an empty grid when every card in a section is
  // blank — 14 such sections ship in 0.10.1's own content-pages.json.
  'includes/class-content-pages.php',
  'includes/class-mockups.php',
  'assets/css/mockups.css',
  'data/product-pages.json',
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

/* ---- 3. class-shortcodes.php: renderer changes WITHOUT the form runtime ----
 * The working-tree file has the verified hero/final CTA and product_page
 * changes, and also the live form: lead_form() rewritten to post to Leads, plus
 * two new helpers. Those three functions are reverted to 0.10.1, which renders
 * the form as a disabled panel and references no Leads class at all. */
const takeFn = (src, name) => {
  const start = src.indexOf(`\tpublic static function ${name}(`) >= 0
    ? src.indexOf(`\tpublic static function ${name}(`)
    : src.indexOf(`\tprivate static function ${name}(`)
  if (start < 0) return null
  // walk back over the docblock
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

/* ---- 4. bootstrap: 0.10.1's, at 0.10.2, plus the two new requires ---- */
let boot = fs.readFileSync(path.join(baseCore, 'gcalls-core.php'), 'utf8')
boot = boot.replace(' * Version:           0.10.1', ' * Version:           0.10.2')
boot = boot.replace("const VERSION = '0.10.1';", "const VERSION = '0.10.2';")
boot = boot.replace(
  "require_once GCALLS_CORE_DIR . 'includes/class-shortcodes.php';",
  "require_once GCALLS_CORE_DIR . 'includes/class-icons.php';\n" +
  "require_once GCALLS_CORE_DIR . 'includes/class-sections.php';\n" +
  "require_once GCALLS_CORE_DIR . 'includes/class-shortcodes.php';")
if (!boot.includes('class-icons.php')) die('could not add the new requires to the bootstrap')
fs.writeFileSync(path.join(build, 'gcalls-core.php'), boot)

/* ---- 5. theme 0.8.6 from the live 0.8.5 tree ---- */
const THEME_CSS_0085 = 'aea2b9536c85c01799a9c65e55545106fddb0d49968b6b56b9c3b85c97e3f6f1'
if (sha(path.join(THEME_SRC, 'assets/css/theme.css')) !== THEME_CSS_0085) {
  die('theme.css is not byte-identical to live 0.8.5 — wrong theme base')
}
const themeBuild = path.join(OUT, 'gcalls-theme')
fs.cpSync(THEME_SRC, themeBuild, { recursive: true })
let style = fs.readFileSync(path.join(themeBuild, 'style.css'), 'utf8')
style = style.replace('Version: 0.8.5', 'Version: 0.8.6')
fs.writeFileSync(path.join(themeBuild, 'style.css'), style)

/* ---- 6. gates ---- */
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
if (lost.length) die(`Core 0.10.2 is NOT a superset of 0.10.1 — missing: ${lost.join(', ')}`)

const leaked = buildFiles.filter((f) => FORBIDDEN.includes(f) || /lead-form|class-leads/.test(f))
if (leaked.length) die(`form artifacts leaked into Core: ${leaked.join(', ')}`)

for (const f of buildFiles.filter((f) => f.endsWith('.php'))) {
  const t = fs.readFileSync(path.join(build, f), 'utf8')
  if (/\bLeads::/.test(t)) die(`Leads:: reference survives in ${f}`)
  if (/Leads::init/.test(t)) die(`Leads::init survives in ${f}`)
}

console.log(`Core 0.10.2:  ${buildFiles.length} files (0.10.1 had ${baseFiles.length}, +${buildFiles.length - baseFiles.length})`)
console.log(`  added:    ${buildFiles.filter((f) => !baseFiles.includes(f)).join(', ')}`)
console.log(`Theme 0.8.6:  ${walk(themeBuild).length} files`)
console.log(`form artifacts: 0   Leads:: references: 0`)
console.log(`\nstaged in ${OUT}`)
