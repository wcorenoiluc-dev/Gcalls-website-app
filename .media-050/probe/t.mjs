import sharp from 'sharp'
import fs from 'node:fs'
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<rect width="1200" height="630" fill="#F5F3F8"/>
<rect x="0" y="0" width="1200" height="8" fill="#673AB7"/>
<circle cx="980" cy="315" r="180" fill="#673AB7" opacity="0.12"/>
<text x="80" y="300" font-family="Helvetica,Arial,sans-serif" font-size="54" font-weight="700" fill="#1A1523">Tổng đài đám mây</text>
<text x="80" y="366" font-family="Helvetica,Arial,sans-serif" font-size="28" fill="#5B5566">Kiến thức vận hành call center</text>
</svg>`
await sharp(Buffer.from(svg), { density: 144 }).webp({ quality: 86 }).toFile('.media-050/probe/probe.webp')
const md = await sharp('.media-050/probe/probe.webp').metadata()
console.log('sharp OK:', md.format, md.width + 'x' + md.height, fs.statSync('.media-050/probe/probe.webp').size, 'bytes')
