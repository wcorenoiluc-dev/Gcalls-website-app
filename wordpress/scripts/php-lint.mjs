/**
 * PHP syntax check.
 *
 * The hosting box has PHP; this laptop does not, and macOS 13 stopped shipping
 * one. `php -l` is therefore unavailable locally, and shipping PHP that has
 * never been parsed is how a white screen reaches a demo. php-parser is a
 * complete PHP 8 parser in JavaScript, so the gate runs in the same `npm`
 * toolchain as the rest of the repo and needs no PHP installed.
 *
 * This checks SYNTAX, not behaviour. It cannot tell you that a WordPress
 * function was misspelled — only that the file parses. Run WordPress's own
 * checks on the host for the rest.
 *
 * Usage: node wordpress/scripts/php-lint.mjs [dir ...]
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import parser from 'php-parser'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const targets = process.argv.slice(2).length ? process.argv.slice(2) : [ROOT]

/** Recursively collects .php files. */
async function collect(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await collect(full)))
    else if (entry.name.endsWith('.php')) out.push(full)
  }
  return out
}

const engine = new parser.Engine({
  parser: { suppressErrors: false, version: 803 },
  ast: { withPositions: true },
})

let files = []
for (const target of targets) files.push(...(await collect(path.resolve(target))))
files = [...new Set(files)].sort()

let failed = 0

for (const file of files) {
  const source = await readFile(file, 'utf8')
  const rel = path.relative(path.resolve(ROOT, '..'), file)

  try {
    engine.parseCode(source, file)
  } catch (error) {
    failed += 1
    const line = error?.lineNumber ?? error?.line ?? '?'
    console.log(`  FAIL ${rel}:${line} — ${error.message.split('\n')[0]}`)
    continue
  }

  // Two rules that a parser cannot express but that matter in WordPress:
  // a file that opens with anything before <?php emits output before headers,
  // and a closing ?> at end of file is the classic source of a stray newline
  // in the response body.
  if (!source.startsWith('<?php')) {
    failed += 1
    console.log(`  FAIL ${rel} — file must start with <?php and nothing before it`)
  }

  if (/\?>\s*$/.test(source)) {
    failed += 1
    console.log(`  FAIL ${rel} — remove the closing ?> at end of file`)
  }
}

console.log(`\nphp-lint: ${files.length} file(s), ${failed} problem(s)`)
process.exit(failed === 0 ? 0 : 1)
