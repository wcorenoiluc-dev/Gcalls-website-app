/*
 * Reproduce, byte for byte, what Home_Layout::apply() writes into
 * `_elementor_data`, and print its SHA-256.
 *
 * WHY THIS EXISTS
 * ---------------
 * The Apply screen shows a hash of what is already on the page, and a release
 * is only safe to apply if you know the hash it will produce BEFORE you press
 * the button. Until this script the only way to learn that was to press it and
 * read the result, which is the wrong order.
 *
 * It also makes the running layout reproducible from a commit, which is what
 * lets a pre-Apply snapshot be a verified file rather than a hope.
 *
 * THE ENCODING
 * ------------
 * apply() runs `wp_json_encode( $source['sections'] )` over the array that came
 * back from `json_decode( file_get_contents( layout.json ), true )`. Matching
 * that needs three things PHP does and JSON.stringify does not:
 *
 *   1. compact, no whitespace        — JSON.stringify already does this
 *   2. escape "/" as "\/"            — PHP escapes slashes by default
 *   3. escape non-ASCII as \uXXXX    — PHP escapes unicode by default
 *
 * and one that is easy to miss. `json_decode( $json, true )` turns an empty
 * JSON object into an empty PHP ARRAY, and PHP re-encodes that as `[]`, not
 * `{}`. This layout carries several — `"border_width": {}` on every button —
 * so without that step the hash is wrong while the byte LENGTH is identical,
 * which is a thoroughly misleading way to be wrong.
 *
 *   node wordpress/scripts/elementor-data-hash.mjs [envelope.json] [--write out]
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const DEFAULT_ENVELOPE = 'wordpress/wp-content/plugins/gcalls-core/data/homepage-elementor.json'

/** PHP's json_encode() default flags, as wp_json_encode() applies them. */
export function phpJsonEncode(value) {
  const json = JSON.stringify(value, (_key, v) => {
    if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) return []
    return v
  })

  return json
    .replace(/\//g, '\\/')
    .replace(/[-￿]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`)
}

const args = process.argv.slice(2)
const envelopePath = args.find((a) => !a.startsWith('--')) ?? DEFAULT_ENVELOPE
const writeIdx = args.indexOf('--write')
const outPath = writeIdx === -1 ? '' : args[writeIdx + 1]

const envelope = JSON.parse(fs.readFileSync(envelopePath, 'utf8'))

if (envelope.type !== 'page') {
  console.error(`not a page envelope: ${envelopePath}`)
  process.exit(2)
}

const sections = envelope.content

if (!Array.isArray(sections) || sections.length === 0) {
  console.error('envelope carries no sections')
  process.exit(2)
}

const encoded = phpJsonEncode(sections)
const sha = crypto.createHash('sha256').update(encoded, 'utf8').digest('hex')

if (outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, encoded)
}

console.log(`envelope   ${envelopePath}`)
console.log(`sections   ${sections.length}`)
console.log(`bytes      ${Buffer.byteLength(encoded, 'utf8')}`)
console.log(`sha256     ${sha}`)
if (outPath) console.log(`written    ${outPath}`)
