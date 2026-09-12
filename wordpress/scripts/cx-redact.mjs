/**
 * GCALLS CX media — redact PII / fabricated KPIs from a screenshot, verifiably.
 *
 * Method (safety-critical — this project has real PII-exposure history):
 *  1. OCR the image (word + line boxes).
 *  2. Mark for masking every token matching a PII/KPI pattern OR the fixed
 *     denylist of demo names/companies that recur across the set.
 *  3. Add per-image region boxes for zones OCR under-reads (avatars, dense lists).
 *  4. Cover each with a neutral fill; optional neutral replacement label.
 *  5. Stamp a visible "Dữ liệu minh hoạ" badge.
 *  6. GATE: re-OCR the output and assert zero PII tokens remain. Non-zero → exit 1.
 *
 * Originals are never modified. Output is <id>-sanitized-v1.png.
 *
 * Usage: node wordpress/scripts/cx-redact.mjs <id>   (spec from cx-redact-spec.json)
 */
import { createWorker } from 'tesseract.js'
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const PRIV = '/private/tmp/claude-501/-Users-macos-Desktop-Gcalls-App-Gcalls-website-app/b7dfb14f-1396-4073-af6e-1992e5951510/scratchpad/cx-media'
const WORK = path.join(PRIV, 'work')
const SAN = path.join(PRIV, 'sanitized'); fs.mkdirSync(SAN, { recursive: true })
const id = process.argv[2] || (() => { console.error('need <id>'); process.exit(2) })()
const spec = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'cx-redact-spec.json'), 'utf8'))[id] || {}

/* Demo identities that recur across the CX set — box on sight. */
const NAMES = ['Trần Thị Bích', 'Nguyễn Văn An', 'Lê Văn Cường', 'Phạm Thị Dung', 'John Doe',
  'Võ Minh Hiếu', 'Linh Nguyễn', 'Bùi Thanh Tùng', 'Dương Thế Anh', 'Trần Quang Huy',
  'Lý Thanh Xuân', 'Bùi Quang Hải', 'Minh Nguyễn', 'Minh Trần', 'Trần Văn Tài', 'Nguyễn Thị Lan',
  'Bích', 'Tùng']
const COMPANIES = ['ABC Corporation', 'AutoDrive Corp', 'SmartCity Solutions', 'BuildPro VN',
  'Innovate Tech', 'Mobile Tech', 'DataPro', 'AutoDrive', 'abccorp', 'autodrive']
const deny = [...NAMES, ...COMPANIES].map((s) => s.toLowerCase())

const isPII = (t) => {
  const s = t.trim()
  if (!s) return false
  if (/\+?\s?84[\s0-9]{6,}/.test(s)) return true              // phone +84 ...
  if (/0\d{2}[\s.]?\d{3}[\s.]?\d{3,4}/.test(s)) return true    // phone 09x...
  if (/@[A-Za-z0-9.]+/.test(s)) return true                   // email
  if (/[A-Za-z0-9._%+-]+@/.test(s)) return true
  if (/\$\s?[\d.,]{2,}/.test(s)) return true                  // $ money
  if (/[\d.,]{2,}\s?(VND|đ|₫)/i.test(s)) return true          // VND money
  if (/\b\d{1,3}([.,]\d{3}){1,}\b/.test(s)) return true       // grouped thousands
  if (/\d+\s?%/.test(s)) return true                          // percent
  if (/#(KH|INV|C)[\s-]?\d/i.test(s)) return true             // ids: #KH, #INV, Conv #C
  if (/#\d{3,}/.test(s)) return true                          // ticket #1235
  const low = s.toLowerCase()
  return deny.some((d) => low.includes(d) || d.includes(low) && low.length > 3)
}

async function ocrBoxes(img) {
  const worker = await createWorker('eng', 1, { langPath: process.cwd(), gzip: false, cachePath: '/tmp/tesscache' })
  const { data } = await worker.recognize(img, {}, { blocks: true })
  await worker.terminate()
  const words = []
  for (const b of data.blocks || []) for (const p of b.paragraphs || []) for (const l of p.lines || []) for (const w of l.words || []) words.push(w)
  return words
}

const img = path.join(WORK, `${id}.png`)
const meta = await sharp(img).metadata()
const W = meta.width, H = meta.height

const words = await ocrBoxes(img)
const boxes = []
for (const w of words) {
  if (isPII(w.text)) {
    const b = w.bbox
    boxes.push({ x: b.x0 - 3, y: b.y0 - 2, w: b.x1 - b.x0 + 6, h: b.y1 - b.y0 + 4 })
  }
}
// per-image manual region boxes (1600w coord space)
for (const r of spec.regions || []) boxes.push(r)

// Build SVG overlay: neutral fills + optional replacement labels + badge.
const rects = boxes.map((b) => {
  const x = Math.max(0, b.x), y = Math.max(0, b.y)
  const fill = b.fill || '#e9ebef'
  return `<rect x="${x}" y="${y}" width="${b.w}" height="${b.h}" rx="4" fill="${fill}"/>` +
    (b.label ? `<text x="${x + 8}" y="${y + b.h * 0.72}" font-family="Arial, sans-serif" font-size="${Math.round(b.h * 0.6)}" fill="#8a8f98">${b.label}</text>` : '')
}).join('')

const badgeW = 168, badgeH = 34
const badge = `<g>
  <rect x="${W - badgeW - 20}" y="20" width="${badgeW}" height="${badgeH}" rx="17" fill="#111827" opacity="0.82"/>
  <text x="${W - badgeW - 20 + badgeW / 2}" y="${20 + 23}" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#ffffff">Dữ liệu minh hoạ</text>
</g>`

// Composite redaction rects first (NO badge yet), so the gate re-OCRs only the
// scrubbed content and does not trip on the badge's own words.
const redactSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${rects}</svg>`)
const scrubbed = await sharp(img).composite([{ input: redactSvg, top: 0, left: 0 }]).png().toBuffer()

// GATE: re-OCR the scrubbed image; assert no PII tokens survive.
const tmp = path.join(SAN, `.gate-${id}.png`); fs.writeFileSync(tmp, scrubbed)
const after = await ocrBoxes(tmp); fs.rmSync(tmp)
const leaks = after.filter((w) => isPII(w.text)).map((w) => w.text)

// Now stamp the badge and write the final asset.
const outPath = path.join(SAN, `${id}-sanitized-v1.png`)
await sharp(scrubbed).composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${badge}</svg>`), top: 0, left: 0 }]).png().toFile(outPath)

console.log(`${id}: ${boxes.length} boxes (${boxes.length - (spec.regions || []).length} OCR + ${(spec.regions || []).length} region) → ${path.basename(outPath)}`)
if (leaks.length) {
  console.log(`  RE-OCR LEAKS (${leaks.length}): ${leaks.slice(0, 20).join(' | ')}`)
  process.exit(1)
}
console.log('  re-OCR: 0 PII tokens remain ✓ (visual check still required)')
