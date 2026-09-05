import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const SAN = '/private/tmp/claude-501/-Users-macos-Desktop-Gcalls-App-Gcalls-website-app/b7dfb14f-1396-4073-af6e-1992e5951510/scratchpad/cx-media/sanitized'
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../..')
const PUB = path.join(ROOT, 'public/images/products/gcalls-cx')
const DELIV = path.join(ROOT, 'docs/content-review/gcalls-cx-ui-v2/media/sanitized-review')
fs.mkdirSync(PUB, { recursive: true })
fs.mkdirSync(DELIV, { recursive: true })

// Crop regions in the 1600w sanitized coord space; clamped to real dims.
// All regions are content/side-panel areas that exclude the top-left PitelCX
// logo (x<46) and the top-right "Dữ liệu minh hoạ" badge, and sit over already
// PII-masked pixels.
const specs = [
  { src: 'workspace', out: 'cx-channels-rail', x: 46, y: 40, w: 318, h: 366, alt: 'Cột kênh của Gcalls CX: các kênh Cuộc gọi, Social, Email, SMS và bộ lọc phân công; dữ liệu mẫu, đã ẩn thông tin' },
  { src: 'workspace', out: 'cx-omnichannel-activity', x: 1308, y: 396, w: 292, h: 388, alt: 'Dòng hoạt động đa kênh trong Gcalls CX: sự kiện Zalo, cuộc gọi, email và Facebook trên một timeline; dữ liệu mẫu, đã ẩn thông tin' },
  { src: 'workspace-ticket-chi-tiet', out: 'cx-ticket-full', x: 358, y: 96, w: 948, h: 806, alt: 'Chi tiết ticket trong Gcalls CX: theo dõi SLA, mô tả vấn đề và thông tin ticket; các trường nhận dạng đã được ẩn' },
  { src: 'workspace-ticket-chi-tiet', out: 'cx-ticket-compact', x: 358, y: 96, w: 948, h: 430, alt: 'Theo dõi SLA và mô tả vấn đề của một ticket trong Gcalls CX; dữ liệu mẫu, đã ẩn thông tin' },
  { src: 'workspace-call-in-progress', out: 'cx-call-info', x: 358, y: 116, w: 948, h: 250, alt: 'Thẻ thông tin cuộc gọi đến trong Gcalls CX: chiều gọi, hàng đợi và thời gian chờ; số điện thoại và nhân viên đã được ẩn' },
]

const manifest = []
for (const s of specs) {
  const f = path.join(SAN, `${s.src}-sanitized-v1.png`)
  const m = await sharp(f).metadata()
  const x = Math.max(0, Math.min(s.x, m.width - 2))
  const y = Math.max(0, Math.min(s.y, m.height - 2))
  const w = Math.min(s.w, m.width - x)
  const h = Math.min(s.h, m.height - y)
  const outPath = path.join(PUB, `${s.out}-v1.webp`)
  await sharp(f).extract({ left: x, top: y, width: w, height: h }).webp({ quality: 92 }).toFile(outPath)
  fs.copyFileSync(outPath, path.join(DELIV, `${s.out}-v1.webp`))
  const buf = fs.readFileSync(outPath)
  const sha = crypto.createHash('sha256').update(buf).digest('hex')
  manifest.push({ out: `${s.out}-v1.webp`, src: s.src, region: [x, y, w, h], width: w, height: h, bytes: buf.length, sha256: sha, alt: s.alt })
  console.log(`${s.out}-v1.webp  ${w}x${h}  ${(buf.length / 1024) | 0}KB  sha=${sha.slice(0, 12)}`)
}
fs.writeFileSync(path.join(ROOT, 'docs/content-review/gcalls-cx-ui-v2/media/crops-manifest.json'), JSON.stringify(manifest, null, 2))
