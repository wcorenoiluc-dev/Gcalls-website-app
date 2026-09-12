/**
 * A3 verification gate.
 *
 * OCR runs on a 4x upscaled copy of the OUTPUT — upscaling here is an analysis
 * step and never touches the published asset, and it makes 8px UI text legible
 * to tesseract, which at native size reads almost nothing.
 */
import { createWorker } from 'tesseract.js'
import sharp from '/Users/macos/Desktop/Gcalls/App/Gcalls-website-app/node_modules/sharp/dist/index.cjs'
import { readdir, mkdir } from 'node:fs/promises'

const V2 = '/Users/macos/Desktop/Gcalls/App/Gcalls-website-app/docs/content-review/gcalls-034/media-v2/'
const TMP = '/private/tmp/claude-501/-Users-macos-Desktop-Gcalls-App-Gcalls-website-app/04b85c54-96a9-4a53-8456-056503907fa7/scratchpad/v2-ocr/'

const RULES = [
  ['email', /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g],
  ['phone/long-digits', /\d{6,}/g],
  ['url', /https?:\/\/\S+/gi],
  ['domain', /\b[a-z0-9-]+\.(com|vn|co|net|io|org)\b/gi],
  ['ip', /\b\d{1,3}(?:\.\d{1,3}){3}\b/g],
  ['known-username', /${Buffer.from('Z2lhbmdwdGw=','base64').toString()}|hau[.\s]?ngo|thanvien[.\s]?a|nhanvien[.\s]?a/gi],
  ['token-like', /\b[A-Za-z0-9_-]{24,}\b/g],
]
// Values the sanitisation is SUPPOSED to introduce.
const ALLOW = [/^demo@example\.com$/i, /^gcalls_demo$/i, /^example\.com$/i]

await mkdir(TMP, { recursive: true })
const files = (await readdir(V2)).filter(f => f.endsWith('.webp'))
const worker = await createWorker('eng')
let anyFail = false

for (const f of files) {
  const src = V2 + f
  const meta = await sharp(src).metadata()
  const up = TMP + f.replace('.webp', '-4x.png')
  await sharp(src).resize(meta.width * 4, meta.height * 4, { kernel: 'lanczos3' }).png().toFile(up)

  const { data } = await worker.recognize(up)
  const text = (data.text || '').replace(/\s+/g, ' ')

  const findings = []
  for (const [name, re] of RULES) {
    for (const m of text.match(re) || []) {
      if (ALLOW.some(a => a.test(m))) continue
      findings.push(`${name}: ${JSON.stringify(m)}`)
    }
  }
  // metadata / embedded-text scan on the published bytes
  const m2 = await sharp(src).metadata()
  const metaLeak = ['exif', 'icc', 'iptc', 'xmp'].filter(k => m2[k])

  const ok = findings.length === 0 && metaLeak.length === 0
  if (!ok) anyFail = true
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${f}  ${m2.width}x${m2.height}`)
  if (metaLeak.length) console.log(`        metadata present: ${metaLeak.join(', ')}`)
  for (const x of [...new Set(findings)].slice(0, 25)) console.log(`        ${x}`)
}
await worker.terminate()
console.log(anyFail ? '\nGATE: FAIL' : '\nGATE: PASS')
