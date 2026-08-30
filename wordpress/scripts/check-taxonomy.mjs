/*
 * Taxonomy consistency: the home page, /san-pham/ and /giai-phap/ must agree.
 *
 * The audit record in `taxonomy_override` deliberately retains the ORIGINAL
 * strings, "bốn sản phẩm" among them. A naive scan of the page object finds
 * those and reports a failure that is actually the audit trail working, so the
 * override record is excluded here and checked separately.
 */
import fs from 'node:fs'

const m = JSON.parse(fs.readFileSync('wordpress/wp-content/plugins/gcalls-core/data/content-pages.json', 'utf8'))
const by = Object.fromEntries(m.pages.map((p) => [p.slug, p]))
const cards = (slug) => (by[slug].sections.find((s) => s.from === 'cards')?.cards) ?? []

const products = cards('san-pham')
const solutions = cards('giai-phap')
const titles = [...products, ...solutions].map((c) => c.title)

let fail = 0
const ok = (name, cond, detail = '') => {
  if (cond) { console.log(`  ok   ${name}`); return }
  fail++; console.log(`  FAIL ${name}${detail ? ' — ' + detail : ''}`)
}

console.log('TAXONOMY 3+7\n')
ok('/san-pham/ has exactly 3 products', products.length === 3, String(products.length))
ok('/giai-phap/ has exactly 7 solutions', solutions.length === 7, String(solutions.length))
ok('no eighth offering', titles.length === 10, String(titles.length))
ok('Voicebot is a solution, not a product', !products.some((c) => /voicebot/i.test(c.title)) && solutions.some((c) => /voicebot/i.test(c.title)))
ok('the forbidden name "Gcalls Voicebot AI" is absent', !titles.includes('Gcalls Voicebot AI'))
ok('Voicebot appears exactly once', titles.filter((t) => /voicebot/i.test(t)).length === 1)
ok('Cloud Call Center is present', titles.includes('Cloud Call Center'))
ok('Call Button Widget is present', titles.includes('Call Button Widget'))
ok('every offering card has a real href', [...products, ...solutions].every((c) => c.href))
ok('no duplicate offering titles', new Set(titles).size === titles.length)

/* Count words must not survive in RENDERED copy — the override record keeps them. */
const rendered = JSON.stringify(['san-pham', 'giai-phap'].map((s) => {
  const { taxonomy_override, ...rest } = by[s]
  return rest
}))
ok('no "bốn sản phẩm" in rendered copy', !/bốn sản phẩm/i.test(rendered))
ok('no "BỐN NHÓM GIẢI PHÁP" in rendered copy', !/bốn nhóm giải pháp/i.test(rendered))
ok('the override record retains the originals for audit',
  /bốn sản phẩm/i.test(JSON.stringify(by['san-pham'].taxonomy_override)))
ok('override records a reason for every change',
  by['san-pham'].taxonomy_override.changes.every((c) => c.reason) &&
  by['giai-phap'].taxonomy_override.changes.every((c) => c.reason))

console.log(`\n${fail === 0 ? 'TAXONOMY: PASS' : `TAXONOMY: ${fail} FAIL`}`)
process.exitCode = fail ? 1 : 0
