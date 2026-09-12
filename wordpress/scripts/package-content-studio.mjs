#!/usr/bin/env node
/**
 * Builds the deployable gcalls-content-studio ZIP.
 *
 * Same shape as package-plugin.mjs (gcalls-core): this plugin ships
 * hand-written PHP/JS/CSS with no compile step, so `git ls-files` is a
 * complete and correct file list, and the archive must correspond to a
 * commit. Shares the same vetting/zipping/verification implementation as
 * every other Gcalls plugin package — one set of rules, not a third one.
 *
 * This script does NOT deploy. It writes an archive and prints its digest.
 *
 * Usage: node wordpress/scripts/package-content-studio.mjs [--out <path>]
 */
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildZip, describe, verifyZip, vet, writeDigest } from './lib/package.mjs'

const WP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = path.resolve(WP_DIR, '..')
const SLUG = 'gcalls-content-studio'
const SOURCE = `wordpress/wp-content/plugins/${SLUG}`

const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' })

/* --- 1. The archive must correspond to a commit ---------------------------- */

const head = git('rev-parse', 'HEAD').trim()
const shortHead = head.slice(0, 7)
const dirty = git('status', '--porcelain', '--', SOURCE).trim()

if (dirty) {
  console.error(`package-content-studio: ${SOURCE} has uncommitted changes:\n${dirty}`)
  console.error('Commit or stash them — a deployable ZIP must match a commit.')
  process.exit(1)
}

const tracked = git('ls-files', '-z', '--', SOURCE)
  .split('\0')
  .filter(Boolean)
  .map((file) => path.relative(SOURCE, file))
  .sort()

if (tracked.length === 0) {
  console.error(`package-content-studio: no tracked files under ${SOURCE}`)
  process.exit(1)
}

/* --- 2. Vet every path and its content ------------------------------------- */

const root = path.join(ROOT, SOURCE)
const problems = await vet(root, tracked)

if (problems.length) {
  console.error('package-content-studio: refusing to build\n')
  for (const problem of problems) console.error(`  FAIL ${problem}`)
  process.exit(1)
}

/* --- 3. Read and cross-check the version ----------------------------------- */

const mainFile = await readFile(path.join(root, `${SLUG}.php`), 'utf8')
const headerVersion = mainFile.match(/^\s*\*\s*Version:\s*(\S+)\s*$/m)?.[1]
const constVersion = mainFile.match(/const VERSION\s*=\s*'([^']+)'/)?.[1]

if (!headerVersion) {
  console.error('package-content-studio: no "Version:" in the plugin header — WordPress needs it to track updates')
  process.exit(1)
}
if (headerVersion !== constVersion) {
  console.error(`package-content-studio: header version ${headerVersion} != const VERSION ${constVersion}`)
  process.exit(1)
}

/* --- 4. Build, then verify the built archive ------------------------------- */

const outArg = process.argv.indexOf('--out')
const outPath =
  outArg !== -1 && process.argv[outArg + 1]
    ? path.resolve(process.argv[outArg + 1])
    : path.join(WP_DIR, 'dist', `${SLUG}-${headerVersion}-${shortHead}.zip`)

await buildZip({ root, relativePaths: tracked, rootName: SLUG, outPath })

const verifyProblems = await verifyZip(outPath, SLUG, tracked)

if (verifyProblems.length) {
  console.error('package-content-studio: the built archive is not what was intended\n')
  for (const problem of verifyProblems) console.error(`  FAIL ${problem}`)
  process.exit(1)
}

const info = await describe(outPath)
await writeDigest(outPath, info.sha256)

console.log(`package-content-studio: ${SLUG} ${headerVersion} @ ${shortHead}`)
console.log(`  path      ${outPath}`)
console.log(`  size      ${info.bytes} bytes`)
console.log(`  files     ${info.files} (+${info.directories} directory entries)`)
console.log(`  sha256    ${info.sha256}`)
console.log(`  unzip -t  OK`)
console.log(`  root      one (${SLUG}/)`)
