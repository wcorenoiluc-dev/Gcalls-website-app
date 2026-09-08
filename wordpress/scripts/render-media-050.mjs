#!/usr/bin/env node
/**
 * GCALLS-050 — render image specs to WebP, deterministically.
 *
 * WHY THIS FILE EXISTS
 * There is no image-generation tool in this session, so §3's fallback applies:
 * illustrations are CODE-NATIVE. Headless Chrome is used rather than librsvg
 * because the labels are Vietnamese and librsvg's text shaping drops or
 * misplaces diacritics — a cover that renders "Tông đai" instead of "Tổng đài"
 * is worse than no cover.
 *
 * Every image this produces is a DRAWN ILLUSTRATION. It is never a product
 * screenshot and never carries a figure we did not verify: the archetypes take
 * labels only, and any archetype that would need a number is not offered.
 *
 * Usage:
 *   node wordpress/scripts/render-media-050.mjs --specs <file> [--only <slug,...>] [--out .media-050/out]
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { chromium } from 'playwright-core'
import sharp from 'sharp'
import { ARCHETYPES, shell } from './lib/archetypes-050.mjs'

const arg = (n, d) => { const i = process.argv.indexOf(n); return i === -1 ? d : process.argv[i + 1] }
const specsPath = arg('--specs')
const outDir = arg('--out', '.media-050/out')
const only = (arg('--only', '') || '').split(',').filter(Boolean)
if (!specsPath) { console.error('need --specs <file>'); process.exit(2) }

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'))
const rows = (specs.articles ?? specs.images ?? specs).filter((r) => !only.length || only.includes(r.slug))

fs.mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch({ executablePath: CHROME })
const journal = []
let failed = 0

for (const spec of rows) {
  const arch = ARCHETYPES[spec.archetype ?? spec.diagramType]
  if (!arch) {
    console.error(`  SKIP ${spec.filename}: unknown archetype "${spec.archetype ?? spec.diagramType}"`)
    failed++
    continue
  }

  /*
   * Body images are capped at 960px wide per §5; featured images are exactly
   * 1200x630 per §5. deviceScaleFactor 2 renders at 2x then sharp downsamples,
   * which keeps small Vietnamese diacritics crisp instead of aliasing them away.
   */
  const w = spec.width ?? (spec.role === 'featured' ? 1200 : 960)
  const h = spec.height ?? (spec.role === 'featured' ? 630 : 540)

  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })
  /* Nothing external may load: no fonts, no CDN, no tracking. A cover that
   * depends on the network is a cover that renders differently each run. */
  await page.route('**/*', (route) => {
    const u = route.request().url()
    if (u.startsWith('data:') || u === 'about:blank') return route.continue()
    return route.abort()
  })
  await page.setContent(shell(arch.body(spec), w, h), { waitUntil: 'load' })

  const png = await page.screenshot({ type: 'png' })
  await page.close()

  const file = path.join(outDir, spec.filename)
  await sharp(png).resize(w, h, { fit: 'fill' })
    /* Strip every metadata block: sharp drops EXIF/GPS/ICC unless told to keep
     * it, and §5 requires no stray metadata. */
    .webp({ quality: 90 }).toFile(file)

  const buf = fs.readFileSync(file)
  const meta = await sharp(buf).metadata()
  journal.push({
    filename: spec.filename,
    slug: spec.slug ?? null,
    legacyId: spec.legacyId ?? null,
    livePostId: spec.livePostId ?? null,
    role: spec.role ?? 'featured',
    archetype: spec.archetype ?? spec.diagramType,
    width: meta.width, height: meta.height,
    bytes: buf.length,
    sha256: crypto.createHash('sha256').update(buf).digest('hex'),
    altText: spec.altText ?? null,
    caption: spec.caption ?? null,
  })
  process.stdout.write('.')
}

await browser.close()
fs.writeFileSync(path.join(outDir, '_journal.json'), JSON.stringify(journal, null, 2))
console.log(`\nrendered ${journal.length}${failed ? `, ${failed} FAILED` : ''} → ${outDir}`)
const dupes = journal.length - new Set(journal.map((j) => j.sha256)).size
console.log(`identical outputs: ${dupes}${dupes ? '  ← same picture used twice; check archetype variety' : ''}`)
if (failed) process.exit(1)
