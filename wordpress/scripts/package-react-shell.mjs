#!/usr/bin/env node
/**
 * Builds the deployable gcalls-react-shell ZIP.
 *
 * Differs from package-plugin.mjs (gcalls-core) in one respect: gcalls-core
 * ships hand-written PHP with nothing to compile, so `git ls-files` is a
 * complete and correct file list. gcalls-react-shell ships a compiled React
 * bundle under dist/, which is intentionally gitignored (a build artefact of
 * a commit, not a second copy of source truth to drift from) — so this
 * script takes the PHP/JSON/README source from git (same "must correspond to
 * a commit" guarantee as package-plugin.mjs) and takes dist/ from whatever
 * `npm run build:wordpress` just produced on disk.
 *
 * The vetting, zipping and verification are the same shared implementation
 * used for gcalls-core — one set of rules, not two.
 *
 * This script does NOT deploy. It writes an archive and prints its digest.
 *
 * Usage: node wordpress/scripts/package-react-shell.mjs [--out <path>]
 */
import { execFileSync } from 'node:child_process'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildZip, describe, verifyZip, vet, writeDigest } from './lib/package.mjs'

const WP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = path.resolve(WP_DIR, '..')
const SLUG = 'gcalls-react-shell'
const SOURCE = `wordpress/wp-content/plugins/${SLUG}`

const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' })

/* --- 1. Source (non-dist) files must correspond to a commit ---------------- */

const head = git('rev-parse', 'HEAD').trim()
const shortHead = head.slice(0, 7)

const sourceDirty = git('status', '--porcelain', '--', SOURCE)
  .trim()
  .split('\n')
  .filter(Boolean)
  .filter((line) => !line.slice(3).startsWith(`${SOURCE}/dist/`))

if (sourceDirty.length) {
  console.error(`package-react-shell: ${SOURCE} has uncommitted source changes:\n${sourceDirty.join('\n')}`)
  console.error('Commit or stash them — a deployable ZIP must match a commit.')
  process.exit(1)
}

const trackedSource = git('ls-files', '-z', '--', SOURCE)
  .split('\0')
  .filter(Boolean)
  .map((file) => path.relative(SOURCE, file))
  .sort()

if (trackedSource.length === 0) {
  console.error(`package-react-shell: no tracked source files under ${SOURCE}`)
  process.exit(1)
}

/* --- 2. dist/ comes from disk — it must exist and be non-empty ------------- */

const root = path.join(ROOT, SOURCE)
const distDir = path.join(root, 'dist')

async function walk(dir, base = '') {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) out.push(...(await walk(path.join(dir, entry.name), rel)))
    else out.push(`dist/${rel}`)
  }
  return out
}

const distFiles = await walk(distDir)

if (distFiles.length === 0) {
  console.error(`package-react-shell: no build output at ${SOURCE}/dist — run \`npm run build:wordpress\` first`)
  process.exit(1)
}

const manifestPresent = distFiles.some((f) => f.endsWith('manifest.json'))
if (!manifestPresent) {
  console.error('package-react-shell: dist/ has no Vite manifest.json — the build is incomplete or misconfigured')
  process.exit(1)
}

const tracked = [...trackedSource, ...distFiles].sort()

/* --- 3. Vet every path and its content -------------------------------------- */

const problems = await vet(root, tracked)

if (problems.length) {
  console.error('package-react-shell: refusing to build\n')
  for (const problem of problems) console.error(`  FAIL ${problem}`)
  process.exit(1)
}

/* --- 4. Read and cross-check the version ------------------------------------ */

const mainFile = await readFile(path.join(root, `${SLUG}.php`), 'utf8')
const headerVersion = mainFile.match(/^\s*\*\s*Version:\s*(\S+)\s*$/m)?.[1]

if (!headerVersion) {
  console.error('package-react-shell: no "Version:" in the plugin header — WordPress needs it to track updates')
  process.exit(1)
}

/* --- 5. Build, then verify the built archive -------------------------------- */

const outArg = process.argv.indexOf('--out')
const outPath =
  outArg !== -1 && process.argv[outArg + 1]
    ? path.resolve(process.argv[outArg + 1])
    : path.join(WP_DIR, 'dist', `${SLUG}-${headerVersion}.zip`)

await buildZip({ root, relativePaths: tracked, rootName: SLUG, outPath })

const verifyProblems = await verifyZip(outPath, SLUG, tracked)

if (verifyProblems.length) {
  console.error('package-react-shell: the built archive is not what was intended\n')
  for (const problem of verifyProblems) console.error(`  FAIL ${problem}`)
  process.exit(1)
}

const info = await describe(outPath)
await writeDigest(outPath, info.sha256)

console.log(`package-react-shell: ${SLUG} ${headerVersion} @ ${shortHead} (source), dist/ from disk`)
console.log(`  path      ${outPath}`)
console.log(`  size      ${info.bytes} bytes`)
console.log(`  files     ${info.files} (+${info.directories} directory entries)`)
console.log(`  sha256    ${info.sha256}`)
console.log(`  unzip -t  OK`)
console.log(`  root      one (${SLUG}/)`)
