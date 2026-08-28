#!/usr/bin/env node
/**
 * Packages the full blog corpus for import.
 *
 * Checkpoint GCALLS-WORDPRESS-FULL-BLOG-MIGRATION-004.
 *
 * The dry run runs FIRST and its exit code gates the package. A corpus manifest
 * that fails validation must not be sitting on someone's Desktop next to four
 * that passed, looking exactly like them — the whole point of the dry run is
 * that it stops the migration, and it can only do that if nothing downstream
 * ignores it.
 *
 * The WordPress export itself is never packaged. It is a 12 MB dump of a site
 * that was serving injected spam; the manifest records its SHA-256 so the
 * package can be traced to it without carrying it.
 *
 * Usage:
 *   node wordpress/scripts/build-corpus-package.mjs --wxr <path> [--out <dir>]
 */
import { execFileSync } from 'node:child_process'
import { copyFile, mkdir, readFile, rm } from 'node:fs/promises'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildZip, describe, verifyZip, vet, writeDigest } from './lib/package.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.resolve(HERE, '..')
const REPO = path.resolve(WP, '..')

const arg = (name, fallback = null) => {
  const index = process.argv.indexOf(`--${name}`)
  return index !== -1 && process.argv[index + 1] ? process.argv[index + 1] : fallback
}

const wxr = arg('wxr')
const OUT = path.resolve(arg('out', path.join(process.env.HOME ?? '/tmp', 'Desktop')))

if (!wxr || !fs.existsSync(wxr)) {
  console.error('build-corpus-package: --wxr <path> is required and must exist.')
  process.exit(1)
}

const git = (...args) => execFileSync('git', args, { cwd: REPO, encoding: 'utf8' }).trim()
const head = git('rev-parse', 'HEAD')
const short = head.slice(0, 7)
const branch = git('rev-parse', '--abbrev-ref', 'HEAD')

const dirty = git('status', '--porcelain', '--', 'wordpress', 'docs/content-review')

if (dirty) {
  console.error('build-corpus-package: the decision sources or the pipeline have uncommitted changes:')
  console.error(dirty.split('\n').map((line) => `  ${line}`).join('\n'))
  console.error('\nCommit them first — a corpus package must name the commit its decisions came from.')
  process.exit(1)
}

/* --- 1. Dry run gates everything ------------------------------------------ */

const stage = path.join(REPO, 'wordpress/dist/corpus-stage')
await rm(stage, { recursive: true, force: true })
await mkdir(stage, { recursive: true })

const manifestPath = path.join(stage, 'blog-corpus-manifest.json')

console.log(`build-corpus-package — ${branch} @ ${short}\n`)

try {
  const output = execFileSync(
    process.execPath,
    [path.join(HERE, 'export-blog-corpus.mjs'), '--wxr', wxr, '--out', manifestPath],
    { cwd: REPO, encoding: 'utf8' },
  )
  console.log(output)
} catch (error) {
  console.error(error.stdout ?? '')
  console.error('build-corpus-package: the dry run did not pass — nothing was packaged.')
  process.exit(1)
}

/* --- 2. Package ----------------------------------------------------------- */

const files = ['blog-corpus-manifest.json']
const problems = await vet(stage, files, { maxFileBytes: 16 * 1024 * 1024 })

if (problems.length) {
  console.error('build-corpus-package: refusing to package\n')
  for (const problem of problems) console.error(`  FAIL ${problem}`)
  process.exit(1)
}

const outPath = path.join(OUT, 'gcalls-content-full-blog-004.zip')
await mkdir(OUT, { recursive: true })
await buildZip({ root: stage, relativePaths: files, rootName: 'gcalls-content-full-blog', outPath })

const verifyProblems = await verifyZip(outPath, 'gcalls-content-full-blog', files)

if (verifyProblems.length) {
  console.error('build-corpus-package: the built archive is not what was intended\n')
  for (const problem of verifyProblems) console.error(`  FAIL ${problem}`)
  process.exit(1)
}

/* --- 3. Re-read the packaged manifest, not the one we just wrote ---------- */

const extracted = path.join(REPO, 'wordpress/dist/corpus-verify')
await rm(extracted, { recursive: true, force: true })
execFileSync('unzip', ['-q', outPath, '-d', extracted])

const manifest = JSON.parse(await readFile(path.join(extracted, 'gcalls-content-full-blog/blog-corpus-manifest.json'), 'utf8'))
const info = await describe(outPath)
await writeDigest(outPath, info.sha256)

await rm(stage, { recursive: true, force: true })
await rm(extracted, { recursive: true, force: true })

console.log('ARTIFACT\n')
console.log(`  ${path.basename(outPath)}`)
console.log(`    path      ${outPath}`)
console.log(`    bytes     ${info.bytes}`)
console.log(`    files     ${info.files} (+${info.directories} dirs)`)
console.log(`    sha256    ${info.sha256}`)
console.log(`    source    ${manifest.source.wxr}`)
console.log(`    wxr sha   ${manifest.source.wxrSha256}`)
console.log(`    commit    ${head}`)
console.log('')
console.log('  counts (re-read from inside the archive)')
for (const [key, value] of Object.entries(manifest.counts)) {
  console.log(`    ${key.padEnd(22)}${value}`)
}
console.log('')
console.log(`build-corpus-package: OK — dry run passed, archive verified.`)
console.log('This package is NOT imported. A live import needs an explicit go-ahead.')
