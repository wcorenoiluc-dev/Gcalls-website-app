/**
 * Shared packaging: vetting, zipping, and verifying the built archive.
 *
 * Extracted from package-plugin.mjs when 003B P0 needed to ship four artifacts
 * instead of one. The rules must be identical across all of them — a secret
 * scan that runs on the plugin but not on the content package is a secret scan
 * that will eventually be bypassed by putting the file in the other package.
 */
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { cp, lstat, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

/** Extensions a WordPress deliverable may legitimately ship. */
export const ALLOWED_EXTENSIONS = new Set([
  '.php', '.txt', '.css', '.js', '.json', '.md', '.po', '.mo', '.pot',
  '.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.woff', '.woff2',
])

/** Path segments that must never appear, whatever the extension. */
const FORBIDDEN_SEGMENTS = [/^\./, /^node_modules$/i, /^vendor$/i, /^tests?$/i, /^__MACOSX$/]

/** Filename shapes that are never deployment artefacts. */
const FORBIDDEN_NAMES = [
  /(^|\.)env($|\.)/i,
  /\.(sql|dump|bak|log|zip|tar|gz|pem|key|crt|p12|pfx|sqlite|db)$/i,
  /^(\.DS_Store|Thumbs\.db|composer\.(json|lock)|package(-lock)?\.json)$/i,
  /(credential|htpasswd)/i,
]

/**
 * Credential shapes, matched on assigned VALUES only.
 *
 * A bare word list cannot be used: `class-hardening.php` legitimately explains
 * that XML-RPC serves "password spraying", and the lead shortcode has a field
 * labelled "Số điện thoại". These require an assignment to a literal.
 */
export const SECRET_PATTERNS = [
  { name: 'private key block', re: /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/ },
  { name: 'AWS access key id', re: /\bAKIA[0-9A-Z]{16}\b/ },
  {
    name: 'assigned secret literal',
    re: /\b(?:api[_-]?key|secret|passwd|password|token|auth[_-]?key|salt)\b\s*(?:=>|[:=])\s*['"][^'"\s]{8,}['"]/i,
  },
  { name: 'bearer token', re: /\bBearer\s+[A-Za-z0-9._-]{20,}/ },
  { name: 'WordPress salt constant', re: /define\(\s*['"](?:AUTH|SECURE_AUTH|LOGGED_IN|NONCE)_(?:KEY|SALT)['"]/ },
]

/** Formats that are size- and name-checked but not scanned for secrets. */
const BINARY = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.mo', '.woff', '.woff2'])

/**
 * Vets a list of relative paths under a root.
 *
 * @returns {Promise<string[]>} problems; empty means safe to ship.
 */
export async function vet(root, relativePaths, { maxFileBytes = 2 * 1024 * 1024 } = {}) {
  const problems = []

  for (const rel of relativePaths) {
    const segments = rel.split('/')

    if (path.isAbsolute(rel) || segments.includes('..')) problems.push(`${rel} — path escapes the root`)

    for (const segment of segments.slice(0, -1)) {
      for (const re of FORBIDDEN_SEGMENTS) {
        if (re.test(segment)) problems.push(`${rel} — forbidden directory segment "${segment}"`)
      }
    }

    const name = segments.at(-1)
    for (const re of FORBIDDEN_NAMES) {
      if (re.test(name)) problems.push(`${rel} — filename is not a deployment artefact`)
    }

    const ext = path.extname(name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      problems.push(`${rel} — extension "${ext || '(none)'}" is not on the allowlist`)
    }

    const absolute = path.join(root, rel)
    const stats = await lstat(absolute).catch(() => null)

    if (!stats) {
      problems.push(`${rel} — listed but missing on disk`)
      continue
    }
    if (stats.isSymbolicLink()) problems.push(`${rel} — symlink; a package must be self-contained`)
    if (stats.size > maxFileBytes) problems.push(`${rel} — ${stats.size} bytes exceeds the ${maxFileBytes} byte cap`)

    if (BINARY.has(ext)) continue

    const source = await readFile(absolute, 'utf8')
    for (const { name: label, re } of SECRET_PATTERNS) {
      const hit = source.match(re)
      if (hit) problems.push(`${rel} — possible ${label} at "${hit[0].slice(0, 40)}"`)
    }
  }

  return problems
}

/**
 * Stages files under a single root directory and zips it.
 *
 * WordPress' uploader installs an archive as `wp-content/<type>/<root dir>`, so
 * exactly one top-level directory is not a stylistic choice — two roots, or
 * files at the archive root, and the install either fails or scatters the
 * package across the directory.
 *
 * @returns {Promise<{files: string[]}>}
 */
export async function buildZip({ root, relativePaths, rootName, outPath }) {
  await mkdir(path.dirname(outPath), { recursive: true })
  await rm(outPath, { force: true })

  const stage = await mkdtemp(path.join(tmpdir(), 'gcalls-pkg-'))

  try {
    for (const rel of relativePaths) {
      const target = path.join(stage, rootName, rel)
      await mkdir(path.dirname(target), { recursive: true })
      await cp(path.join(root, rel), target)
    }

    // -X drops extended attributes and the macOS resource forks that would ride
    // along as ._ files; COPYFILE_DISABLE stops the OS re-adding them.
    execFileSync('zip', ['-r', '-X', '-q', outPath, rootName], {
      cwd: stage,
      env: { ...process.env, COPYFILE_DISABLE: '1' },
    })
  } finally {
    await rm(stage, { recursive: true, force: true })
  }

  return { files: relativePaths };
}

/**
 * Verifies a BUILT archive rather than the intent behind it.
 *
 * @returns {Promise<string[]>} problems; empty means the archive is as expected.
 */
export async function verifyZip(outPath, rootName, expectedRelativePaths) {
  const problems = []

  try {
    execFileSync('unzip', ['-tqq', outPath], { stdio: 'pipe' })
  } catch (error) {
    problems.push(`unzip -t failed: ${String(error)}`)
    return problems
  }

  const entries = execFileSync('unzip', ['-Z1', outPath], { encoding: 'utf8' }).split('\n').filter(Boolean)
  const roots = new Set(entries.map((entry) => entry.split('/')[0]))

  if (roots.size !== 1 || !roots.has(rootName)) {
    problems.push(`archive must have exactly one root "${rootName}/", found: ${[...roots].join(', ')}`)
  }

  const files = entries.filter((entry) => !entry.endsWith('/'))
  const expected = new Set(expectedRelativePaths.map((rel) => `${rootName}/${rel}`))

  for (const entry of files) if (!expected.has(entry)) problems.push(`unexpected entry: ${entry}`)
  for (const entry of expected) if (!files.includes(entry)) problems.push(`missing entry: ${entry}`)

  return problems
}

/** Size, SHA-256 and entry counts of a finished file. */
export async function describe(filePath, { isZip = true } = {}) {
  const bytes = await readFile(filePath)
  const sha256 = createHash('sha256').update(bytes).digest('hex')

  let files = 1
  let directories = 0

  if (isZip) {
    const entries = execFileSync('unzip', ['-Z1', filePath], { encoding: 'utf8' }).split('\n').filter(Boolean)
    files = entries.filter((entry) => !entry.endsWith('/')).length
    directories = entries.length - files
  }

  return { path: filePath, bytes: bytes.length, sha256, files, directories }
}

/** Writes the `<name>.sha256` sidecar in the usual shasum format. */
export async function writeDigest(filePath, sha256) {
  await writeFile(`${filePath}.sha256`, `${sha256}  ${path.basename(filePath)}\n`)
}
