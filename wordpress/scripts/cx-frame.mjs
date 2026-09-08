/**
 * GCALLS CX media — wrap a sanitized screenshot in a light browser frame.
 * Thin chrome, rounded 22px, 1px neutral border, soft shadow, no 3D tilt.
 * Content is the sanitized screenshot only — nothing regenerated, no added metrics.
 * Usage: node wordpress/scripts/cx-frame.mjs <sanitized-id> <out-name>
 */
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const PRIV = '/private/tmp/claude-501/-Users-macos-Desktop-Gcalls-App-Gcalls-website-app/b7dfb14f-1396-4073-af6e-1992e5951510/scratchpad/cx-media'
const id = process.argv[2]
const outName = process.argv[3] || `mockup-${id}.png`
const src = path.join(PRIV, 'sanitized', `${id}-sanitized-v1.png`)
const OUT = path.join(PRIV, 'deliverables'); fs.mkdirSync(OUT, { recursive: true })

const m = await sharp(src).metadata()
const iw = m.width, ih = m.height
const barH = Math.round(iw * 0.026)
const frameW = iw, frameH = ih + barH
const rx = 22

const chrome = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${frameW}" height="${frameH}">
  <rect width="${frameW}" height="${frameH}" fill="#ffffff"/>
  <rect width="${frameW}" height="${barH}" fill="#f5f6f8"/>
  <circle cx="${barH * 0.7}" cy="${barH / 2}" r="${barH * 0.16}" fill="#e2666b"/>
  <circle cx="${barH * 1.3}" cy="${barH / 2}" r="${barH * 0.16}" fill="#e7b04e"/>
  <circle cx="${barH * 1.9}" cy="${barH / 2}" r="${barH * 0.16}" fill="#69b578"/>
  <rect x="${barH * 2.6}" y="${barH * 0.28}" width="${frameW * 0.5}" height="${barH * 0.44}" rx="${barH * 0.22}" fill="#e9ebef"/>
</svg>`)
const shot = await sharp(src).toBuffer()
const framed = await sharp(chrome).composite([{ input: shot, top: barH, left: 0 }]).png().toBuffer()
const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${frameW}" height="${frameH}"><rect width="${frameW}" height="${frameH}" rx="${rx}" ry="${rx}" fill="#fff"/></svg>`)
const rounded = await sharp(framed).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()

const padS = Math.round(iw * 0.03)
const canvasW = frameW + padS * 2, canvasH = frameH + padS * 2
const shadow = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}"><rect x="${padS}" y="${padS + 6}" width="${frameW}" height="${frameH}" rx="${rx}" fill="#000" opacity="0.10"/></svg>`)
const border = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}"><rect x="${padS}" y="${padS}" width="${frameW}" height="${frameH}" rx="${rx}" fill="none" stroke="#e4e6ea" stroke-width="1"/></svg>`)
await sharp({ create: { width: canvasW, height: canvasH, channels: 4, background: '#ffffff00' } })
  .composite([
    { input: await sharp(shadow).blur(8).png().toBuffer(), top: 0, left: 0 },
    { input: rounded, top: padS, left: padS },
    { input: border, top: 0, left: 0 },
  ]).png().toFile(path.join(OUT, outName))
console.log(`${outName}  ${canvasW}x${canvasH}`)
