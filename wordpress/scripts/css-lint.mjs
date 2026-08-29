/**
 * Parses every stylesheet this repository ships.
 *
 * WHY THIS EXISTS
 * There is no PHP binary and no WordPress on the build machine, so the theme
 * and the mockups cannot be rendered here — the first time this CSS is applied
 * to real markup is on the live site. A stylesheet with an unbalanced brace
 * does not fail loudly: the browser discards from the error to the next rule
 * it can resynchronise on, so one typo silently deletes a section's styling and
 * everything downstream of it in the file. That is a plausible way to ship a
 * broken hero while every other gate stays green.
 *
 * PostCSS is already a dependency, and its parser rejects exactly the
 * structural mistakes hand-written CSS makes: unclosed blocks, unterminated
 * strings and comments, stray at-rules.
 *
 * It also reports selectors defined twice in one file. Those are WARNINGS, not
 * failures: this codebase layers deliberately — a later "design system"
 * section refines `.gcalls-header` and `.gcalls-prose h2` on purpose — so a
 * repeat is usually intent. It is still worth printing, because the two real
 * collisions this found on its first run were both of that shape: a new rule
 * that happened to reuse a class another component already owned, silently
 * repainting it. Read the list; do not assume it is noise.
 *
 * Usage: node wordpress/scripts/css-lint.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.resolve(HERE, '..')
const REPO = path.resolve(WP, '..')

const ROOTS = [
  path.join(WP, 'wp-content/themes/gcalls-theme'),
  path.join(WP, 'wp-content/plugins/gcalls-core'),
]

const files = []
const walk = (dir) => {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith('.css')) files.push(full)
  }
}
ROOTS.forEach(walk)

let problems = 0
let warnings = 0

for (const file of files) {
  const rel = path.relative(REPO, file)
  const source = fs.readFileSync(file, 'utf8')

  let root
  try {
    root = postcss.parse(source, { from: file })
  } catch (error) {
    console.log(`  FAIL ${rel} — ${error.reason ?? error.message} (line ${error.line ?? '?'})`)
    problems++
    continue
  }

  // A selector written twice in one file: the second wins, so the first is
  // dead code that still reads as if it applies.
  const seen = new Map()
  const duplicates = []
  root.walkRules((rule) => {
    // Rules inside @media legitimately repeat a selector to override it.
    if (rule.parent?.type === 'atrule') return
    const key = rule.selector.replace(/\s+/g, ' ').trim()
    if (seen.has(key)) duplicates.push(`${key} (lines ${seen.get(key)} and ${rule.source.start.line})`)
    else seen.set(key, rule.source.start.line)
  })

  const empty = []
  root.walkRules((rule) => {
    if (rule.nodes.length === 0) empty.push(`${rule.selector} (line ${rule.source.start.line})`)
  })

  const rules = root.nodes.filter((n) => n.type === 'rule').length
  console.log(`  ok   ${rel} — parsed, ${rules} top-level rule(s)`)

  for (const duplicate of duplicates) {
    console.log(`       warn: duplicate selector — ${duplicate}`)
    warnings++
  }
  for (const rule of empty) {
    console.log(`       empty rule: ${rule}`)
    problems++
  }
}

console.log(
  `\ncss-lint: ${files.length} file(s), ${problems} problem(s), ${warnings} duplicate-selector warning(s)`
)

// Only a parse error or an empty rule fails the run. A duplicate is reported
// and left to a human, because in this stylesheet it is usually deliberate.
process.exitCode = problems > 0 ? 1 : 0
