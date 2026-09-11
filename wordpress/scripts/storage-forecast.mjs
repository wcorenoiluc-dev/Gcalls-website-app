/**
 * Applies the large-file policy and forecasts what the media import costs on disk.
 *
 * WHY THE ATTACHMENT COUNT IS NOT THE STORAGE NUMBER
 * WordPress does not store one file per attachment. It generates a derivative
 * for every registered size the original is bigger than, and each of those is
 * a real file. Forecasting from originals alone understates the disk cost by
 * roughly the number of sizes registered — which on a shared demo host is how
 * an import fills the partition halfway through and leaves the library in a
 * state nobody planned for.
 *
 * WHICH SIZES
 * The theme registers `post-thumbnails` support and calls add_image_size()
 * nowhere; the plugin registers none either. So the set is WordPress core's
 * own, listed below. If a theme later adds one, this forecast is wrong and the
 * gate that reads this file will say so rather than quietly under-count.
 *
 * HOW THE BYTES ARE ESTIMATED, AND HOW WRONG IT CAN BE
 * A derivative's size is estimated by scaling the original's byte count by the
 * ratio of pixel areas, times 0.85 for the re-encode. That is an
 * approximation: JPEG bytes track pixel count closely at a fixed quality, PNG
 * much less so, and a re-encode at WordPress's default quality of 82 usually
 * lands smaller than the source. The estimate is therefore biased HIGH for PNG
 * and roughly right for JPEG, which is the direction a disk forecast should
 * err. A safety factor is applied on top and stated separately.
 *
 *   node wordpress/scripts/storage-forecast.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'dist')
const THEME = path.join(HERE, '..', 'wp-content/themes/gcalls-theme')
const PLUGIN = path.join(HERE, '..', 'wp-content/plugins/gcalls-core')

const probePath = path.join(OUT, 'media-probe.json')
if (!fs.existsSync(probePath)) {
  console.error('run probe-media.mjs first')
  process.exit(2)
}

const probe = JSON.parse(fs.readFileSync(probePath, 'utf8'))

/* ------------------------------------------------------- size registry */

/**
 * WordPress core's default sizes, as of 5.3+. `crop` matters only for the
 * thumbnail, which is cropped square; the rest are bounding boxes.
 */
const CORE_SIZES = [
  { name: 'thumbnail', w: 150, h: 150, crop: true },
  { name: 'medium', w: 300, h: 300, crop: false },
  { name: 'medium_large', w: 768, h: 0, crop: false },
  { name: 'large', w: 1024, h: 1024, crop: false },
  { name: '1536x1536', w: 1536, h: 1536, crop: false },
  { name: '2048x2048', w: 2048, h: 2048, crop: false },
]

/** Originals wider than this get a -scaled copy and the original is kept. */
const BIG_IMAGE_THRESHOLD = 2560

/* Confirm nothing in this repository adds a size, so the list above is complete. */
const themeSrc = fs.readdirSync(path.join(THEME, 'inc')).map((f) => fs.readFileSync(path.join(THEME, 'inc', f), 'utf8')).join('\n')
const pluginSrc = fs.readdirSync(path.join(PLUGIN, 'includes')).map((f) => fs.readFileSync(path.join(PLUGIN, 'includes', f), 'utf8')).join('\n')
const customSizes = (themeSrc + pluginSrc).match(/add_image_size\(/g)?.length ?? 0

/* ------------------------------------------------- large-file policy (D) */

const MIME_ALLOWLIST = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_AUTO_BYTES = 2 * 1024 * 1024
const MAX_PIXELS = 40_000_000 // ~40MP: past this, resizing is a memory risk on shared hosting.
const MAX_GIF_BYTES = 1 * 1024 * 1024

const policy = []

for (const item of probe) {
  if (item.verdict !== 'LOCALIZE') continue

  const pixels = (item.width ?? 0) * (item.height ?? 0)
  let verdict = 'LOCALIZE'
  let reason = ''

  if (!MIME_ALLOWLIST.has(item.real_mime)) {
    verdict = 'MANUAL_REVIEW'
    reason = `MIME ${item.real_mime} is not on the import allowlist`
  } else if (item.bytes > MAX_AUTO_BYTES) {
    verdict = 'MANUAL_REVIEW'
    reason = `${(item.bytes / 1048576).toFixed(1)} MB is over the 2 MB automatic ceiling`
  } else if (item.real_mime === 'image/gif' && item.bytes > MAX_GIF_BYTES) {
    // Converting a large GIF to a still would drop the animation, and the
    // animation is usually the whole point of the figure. A person decides.
    verdict = 'MANUAL_REVIEW'
    reason = `animated GIF at ${(item.bytes / 1048576).toFixed(1)} MB — converting it would lose the animation`
  } else if (!item.width || !item.height) {
    verdict = 'MANUAL_REVIEW'
    reason = 'dimensions unreadable'
  } else if (pixels > MAX_PIXELS) {
    verdict = 'MANUAL_REVIEW'
    reason = `${(pixels / 1e6).toFixed(1)} MP is an abnormal pixel count`
  }

  policy.push({ ...item, policy_verdict: verdict, policy_reason: reason })
}

const importable = policy.filter((p) => p.policy_verdict === 'LOCALIZE')
const held = policy.filter((p) => p.policy_verdict !== 'LOCALIZE')

/* ------------------------------------------------- derivative forecast */

const RE_ENCODE = 0.85
const FLOOR_BYTES = 3 * 1024

function derivativesFor(item) {
  const out = []
  const w = item.width
  const h = item.height
  const area = w * h

  for (const size of CORE_SIZES) {
    // A derivative exists only when the original exceeds the box.
    const boxW = size.w
    const boxH = size.h === 0 ? Infinity : size.h

    if (w <= boxW && h <= boxH) continue

    let dw
    let dh

    if (size.crop) {
      dw = Math.min(boxW, w)
      dh = Math.min(boxH, h)
    } else {
      const scale = Math.min(boxW / w, boxH === Infinity ? boxW / w : boxH / h)
      dw = Math.round(w * scale)
      dh = Math.round(h * scale)
    }

    const bytes = Math.max(FLOOR_BYTES, Math.round(item.bytes * ((dw * dh) / area) * RE_ENCODE))
    out.push({ name: size.name, w: dw, h: dh, bytes })
  }

  if (w > BIG_IMAGE_THRESHOLD || h > BIG_IMAGE_THRESHOLD) {
    const scale = BIG_IMAGE_THRESHOLD / Math.max(w, h)
    const bytes = Math.max(FLOOR_BYTES, Math.round(item.bytes * (scale * scale) * RE_ENCODE))
    out.push({ name: 'scaled', w: Math.round(w * scale), h: Math.round(h * scale), bytes })
  }

  return out
}

let originalBytes = 0
let derivativeBytes = 0
let derivativeCount = 0
const perSize = {}
let maxDerivatives = 0

for (const item of importable) {
  originalBytes += item.bytes
  const derivatives = derivativesFor(item)
  maxDerivatives = Math.max(maxDerivatives, derivatives.length)

  for (const d of derivatives) {
    derivativeBytes += d.bytes
    derivativeCount += 1
    perSize[d.name] = perSize[d.name] ?? { count: 0, bytes: 0 }
    perSize[d.name].count += 1
    perSize[d.name].bytes += d.bytes
  }
}

/*
 * Some hosts generate a WebP alongside every JPEG/PNG. This one's behaviour is
 * unknown until an admin screen can be read, so it is forecast as a separate,
 * clearly-labelled line rather than folded into the total — WebP is typically
 * 70% of the JPEG it replaces.
 */
const webpIfEnabled = Math.round((originalBytes + derivativeBytes) * 0.7)

const SAFETY = 1.5
const subtotal = originalBytes + derivativeBytes
const withSafety = Math.round(subtotal * SAFETY)
const worstCase = Math.round((subtotal + webpIfEnabled) * SAFETY)

/* --------------------------------------------------------------- report */

const mb = (n) => (n / 1048576).toFixed(1) + ' MB'
const pad = (s, n) => String(s).padEnd(n)
const num = (n, w = 6) => String(n).padStart(w)

console.log('STORAGE FORECAST — media import\n')

console.log('Registered image sizes')
console.log(`  WordPress core defaults        ${CORE_SIZES.length}`)
console.log(`  add_image_size() in this repo  ${customSizes}`)
console.log(`  -scaled copies over            ${BIG_IMAGE_THRESHOLD}px`)
console.log(`  maximum derivatives per image  ${maxDerivatives}`)

console.log('\nLarge-file policy')
console.log(`  ${num(importable.length)}  importable automatically`)
console.log(`  ${num(held.length)}  held for MANUAL_REVIEW`)
for (const item of held) {
  console.log(`        ${(item.bytes / 1048576).toFixed(1)} MB  ${item.real_mime}  ${item.width}×${item.height}  ${item.url.slice(-52)}`)
  console.log(`              ${item.policy_reason}`)
}

console.log('\nMIME distribution (importable)')
const mime = {}
for (const i of importable) mime[i.real_mime] = (mime[i.real_mime] ?? 0) + 1
for (const [k, v] of Object.entries(mime).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${num(v)}  ${k}`)
}

console.log('\nDerivatives, by size')
console.log(`  ${pad('size', 14)} ${pad('files', 7)} bytes`)
for (const size of [...CORE_SIZES.map((s) => s.name), 'scaled']) {
  const row = perSize[size]
  console.log(`  ${pad(size, 14)} ${pad(row ? row.count : 0, 7)} ${row ? mb(row.bytes) : '0.0 MB'}`)
}

console.log('\nDisk')
console.log(`  originals                      ${num(importable.length)} files   ${mb(originalBytes)}`)
console.log(`  derivatives                    ${num(derivativeCount)} files   ${mb(derivativeBytes)}`)
console.log(`  subtotal                       ${num(importable.length + derivativeCount)} files   ${mb(subtotal)}`)
console.log(`  WebP copies, IF the host makes them        ${mb(webpIfEnabled)}`)
console.log(`  safety factor                  ×${SAFETY}`)
console.log(`  REQUIRED FREE DISK             ${mb(withSafety)}`)
console.log(`  worst case, with host WebP     ${mb(worstCase)}`)

console.log('\nLargest importable files')
for (const item of [...importable].sort((a, b) => b.bytes - a.bytes).slice(0, 5)) {
  console.log(`  ${mb(item.bytes).padStart(8)}  ${String(item.width).padStart(5)}×${String(item.height).padEnd(5)} ${item.real_mime.padEnd(11)} ${item.url.slice(-50)}`)
}

fs.writeFileSync(
  path.join(OUT, 'storage-forecast.json'),
  JSON.stringify(
    {
      sizes: CORE_SIZES,
      custom_sizes_in_repo: customSizes,
      max_derivatives_per_image: maxDerivatives,
      importable: importable.length,
      manual_review: held.map((h) => ({ url: h.url, bytes: h.bytes, mime: h.real_mime, reason: h.policy_reason })),
      original_bytes: originalBytes,
      derivative_bytes: derivativeBytes,
      derivative_count: derivativeCount,
      subtotal_bytes: subtotal,
      webp_if_enabled_bytes: webpIfEnabled,
      safety_factor: SAFETY,
      required_free_bytes: withSafety,
      worst_case_bytes: worstCase,
      per_size: perSize,
    },
    null,
    2,
  ),
)

console.log('\nFREE DISK ON THE HOST: NOT RUN — needs an authenticated admin session.')
console.log('Execute must stay disabled until it is read and compared against the figure above.')
console.log('\nwritten: wordpress/dist/storage-forecast.json')
