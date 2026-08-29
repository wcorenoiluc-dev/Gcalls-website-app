/** Cuts a full-page parity shot into readable bands. */
import sharp from 'sharp'
import path from 'node:path'
import { mkdir } from 'node:fs/promises'
const [,, file, bandArg, outDir] = process.argv
const BAND = Number(bandArg ?? 1800)
const img = sharp(file)
const { width, height } = await img.metadata()
const out = outDir ?? path.join(path.dirname(file), 'bands')
await mkdir(out, { recursive: true })
const base = path.basename(file, '.png')
let i = 0
for (let top = 0; top < height; top += BAND, i++) {
  const h = Math.min(BAND, height - top)
  await sharp(file).extract({ left: 0, top, width, height: h }).resize({ width: 900 }).png()
    .toFile(path.join(out, `${base}-b${String(i).padStart(2,'0')}.png`))
}
console.log(`${base}: ${width}x${height} -> ${i} bands in ${out}`)
