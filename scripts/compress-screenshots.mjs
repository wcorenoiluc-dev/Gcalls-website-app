/**
 * Convert every captured PNG to WebP (high quality) and rewrite manifest paths.
 * Full-page shots can be >16000px tall (over WebP's 16383 limit), so we fit
 * inside 1440×16000 preserving aspect. PNGs are removed after conversion.
 */
import sharp from 'sharp'
import { readFile, writeFile, readdir, unlink, stat } from 'node:fs/promises'
import path from 'node:path'

const OUT_DIR = path.resolve('docs/screenshots')
const MANIFEST = path.join(OUT_DIR, 'manifest.json')

async function convert(absPng) {
  const absWebp = absPng.replace(/\.png$/, '.webp')
  await sharp(absPng)
    .resize({ width: 1440, height: 16000, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(absWebp)
  await unlink(absPng)
  return absWebp
}

// Convert all PNGs under docs/screenshots/*
let before = 0
let after = 0
const dirs = await readdir(OUT_DIR, { withFileTypes: true })
for (const d of dirs) {
  if (!d.isDirectory()) continue
  const sub = path.join(OUT_DIR, d.name)
  for (const f of await readdir(sub)) {
    if (!f.endsWith('.png')) continue
    const abs = path.join(sub, f)
    before += (await stat(abs)).size
    const webp = await convert(abs)
    after += (await stat(webp)).size
  }
  console.log(`✓ ${d.name}`)
}

// Rewrite manifest paths .png -> .webp
const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))
for (const p of manifest) {
  p.full = p.full.replace(/\.png$/, '.webp')
  for (const s of p.sections) s.file = s.file.replace(/\.png$/, '.webp')
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2))

const mb = (b) => (b / 1048576).toFixed(1)
console.log(`\nPNG ${mb(before)}MB → WebP ${mb(after)}MB (${(100 - (after / before) * 100).toFixed(0)}% smaller)`)
