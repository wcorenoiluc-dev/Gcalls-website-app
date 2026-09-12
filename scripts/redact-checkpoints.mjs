#!/usr/bin/env node
/**
 * GCALLS-036C — redact the checkpoint documents before they can be committed.
 *
 * WHAT IS AND IS NOT REMOVED
 * The incident record stays. Commit ids, attachment ids, hashes, timestamps,
 * gate results and remediation decisions are all evidence and all remain
 * readable. What goes is the raw value of the thing that leaked: a username, an
 * unapproved domain, a fabricated identity. Each is replaced by a stable code
 * so two documents referring to the same leak still obviously refer to the same
 * leak, and so a future reader can ask about it without the document itself
 * being a copy of the exposure.
 *
 * WHY ONE FILE IS TREATED DIFFERENTLY
 * `verify-media-v2.mjs` and `build-product-media-manifest.mjs` contain the
 * username as part of an OCR DETECTION RULE. Replacing it with a code would
 * quietly turn the detector off — the scan would keep passing and stop looking
 * for the one string it was written to find. Those occurrences are encoded
 * instead: the plaintext is gone from the repository, the rule still matches.
 * A .json detector file is data, not code, so it gets the code — an encoded
 * expression sitting in a JSON string is neither the value nor the label.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const CODES = [
  // Held base64 so this script does not contain the very strings it removes —
  // the first version redacted itself and could never run twice.
  ['Z2lhbmdwdGw=', 'PII_USERNAME_01'],
  ['dGhhbnZpZW4uYQ==', 'PII_USERNAME_02'],
  ['YXBwLmdjYWxscy5wbHVz', 'UNAPPROVED_DOMAIN_01'],
  ['bGluaC50cmFuQGRlbW8uZ2NhbGxzLmNv', 'FABRICATED_IDENTITY_01'],
].map(([b64, code]) => [Buffer.from(b64, 'base64').toString(), code])

/** Files where the literal is a detection rule, not prose. */
const DETECTORS = new Set([
  'docs/content-review/gcalls-034/verify-media-v2.mjs',
  'docs/content-review/gcalls-035/verify-media-v2.mjs',
  'scripts/build-product-media-manifest.mjs',
  'docs/content-review/images/product-media-manifest.json',
])

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name)
    if (name === 'node_modules' || name === '.git') continue
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (/\.(md|mjs|js|json|html|css|php|txt)$/.test(name)) out.push(p)
  }
  return out
}

// Never rewrite this file: its own table would become codes mapping to codes.
const SELF = 'scripts/redact-checkpoints.mjs'
const targets = [...walk('docs'), ...walk('scripts')].filter((f) => f !== SELF)
let changed = 0
const report = []

for (const file of targets) {
  const before = await readFile(file, 'utf8')
  let after = before
  const isDetector = DETECTORS.has(file)

  for (const [raw, code] of CODES) {
    if (!after.includes(raw)) continue
    if (isDetector && !file.endsWith('.json')) {
      // Encode so the plaintext leaves the repo but the rule still fires.
      const b64 = Buffer.from(raw, 'utf8').toString('base64')
      after = after.replaceAll(
        raw,
        `\${Buffer.from('${b64}','base64').toString()}`,
      )
      report.push(`${file}: ${code} encoded (detection rule preserved)`)
    } else {
      after = after.replaceAll(raw, code)
      report.push(`${file}: ${code}`)
    }
  }

  if (after !== before) {
    await writeFile(file, after)
    changed++
  }
}

console.log(`redact: ${changed} file(s) changed`)
for (const line of report) console.log(`  ${line}`)
