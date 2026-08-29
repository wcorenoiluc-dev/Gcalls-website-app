/**
 * Image Master Map — every visual on the demo, where it is, and what replaces it.
 *
 * The addendum asks for `product | route | section | filename | type | replacement
 * rule`. The point of the last column is that a real screenshot must be able to
 * arrive later without a layout change: media and mockups are both placed by a
 * shortcode, so swapping one for the other is a one-line edit in the generator,
 * never a rebuild of the section.
 */
import fs from 'node:fs'

const manifest = JSON.parse(fs.readFileSync('wordpress/imports/content-manifest.json', 'utf8'))
const products = JSON.parse(fs.readFileSync('wordpress/wp-content/plugins/gcalls-core/data/product-pages.json', 'utf8'))
const homeTemplate = fs.readFileSync('wordpress/elementor-templates/gcalls-homepage.json', 'utf8')

const mediaById = new Map(manifest.media.map((m) => [m.id, m]))
const rows = []

/* Home page, read out of the generated Elementor template in section order. */
const homeShortcodes = [...homeTemplate.matchAll(/\[gcalls_(media|mockup) id=\\"([a-z0-9_-]+)\\"/gi)]
homeShortcodes.forEach(([, kind, id], index) => {
  rows.push({
    product: 'Trang chủ',
    route: '/',
    section: `section ${index + 1}`,
    filename: kind === 'media' ? (mediaById.get(id)?.file.split('/').pop() ?? id) : `mockup:${id}`,
    type: kind === 'media' ? 'real (masked screenshot)' : 'demo (ported React component)',
    replacement: kind === 'media' ? 'swap the file, keep the media id' : `replace [gcalls_mockup id="${id}"] with [gcalls_media id="<new id>"]`,
  })
})

/* Product pages. */
for (const [product, page] of Object.entries(products.pages)) {
  for (const section of page.sections) {
    if (!section.media && !section.mockup && !section.diagram) continue
    const kind = section.media ? 'media' : section.mockup ? 'mockup' : 'diagram'
    const id = section.media ?? section.mockup ?? section.diagram
    rows.push({
      product,
      route: page.route,
      section: section.source,
      filename: kind === 'media' ? (mediaById.get(id)?.file.split('/').pop() ?? id) : `${kind}:${id}`,
      type: kind === 'media' ? 'real (masked screenshot)' : kind === 'mockup' ? 'demo (mockup, fake data)' : 'demo (brand diagram)',
      replacement: kind === 'media'
        ? 'swap the file, keep the media id'
        : `replace the ${kind} entry in build-product-content.mjs with { media: '<new id>' }`,
    })
  }
}

const w = (s, n) => String(s).padEnd(n).slice(0, n)
console.log(`${w('PRODUCT',13)}${w('ROUTE',24)}${w('SECTION',22)}${w('FILENAME',52)}${w('TYPE',30)}REPLACEMENT RULE`)
for (const r of rows) {
  console.log(`${w(r.product,13)}${w(r.route,24)}${w(r.section,22)}${w(r.filename,52)}${w(r.type,30)}${r.replacement}`)
}

const used = new Set(rows.filter((r) => r.type.startsWith('real')).map((r) => r.filename))
console.log(`\n${rows.length} visuals placed`)
console.log(`  real screenshots in use : ${used.size} / ${manifest.media.length}`)
console.log(`  demo mockups            : ${rows.filter((r) => r.type.includes('mockup')).length}`)
console.log(`  brand diagrams          : ${rows.filter((r) => r.type.includes('diagram')).length}`)

const unused = manifest.media.filter((m) => !used.has(m.file.split('/').pop()))
if (unused.length) {
  console.log(`\n  in the library, not yet placed (${unused.length}):`)
  for (const m of unused) console.log(`    ${m.id}  ${m.file.split('/').pop()}`)
}

fs.writeFileSync('docs/content-review/images/image-master-map-007.json', JSON.stringify(rows, null, 2))
