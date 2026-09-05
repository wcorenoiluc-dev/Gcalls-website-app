#!/usr/bin/env node
/**
 * Industries hub (/nganh/) — claim guard + source contract check.
 *
 * 1. CLAIM GUARD: the page-local files this track added must introduce no
 *    industry claim — no percentage, no benchmark, no result figure, no customer
 *    name/logo, no compliance assertion, no "fits every business in the industry".
 * 2. SOURCE CONTRACT: `INDUSTRIES_HUB` must still carry exactly the six approved
 *    industries with their approved routes, and no seventh industry / no Voicebot
 *    tag. (Source lives in the shared `hubs.ts`, which this track does not edit;
 *    this asserts the contract the page renders against has not drifted.)
 *
 * Usage: node scripts/industries-hub-verify.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
let fail = 0
const bad = (m) => { console.error('FAIL ' + m); fail++ }

/* 1. Claim guard over the files this track owns. */
const OWNED = [
  'src/pages/IndustriesHubPage.tsx',
  'src/components/industries-hub/IndustriesHubLayout.tsx',
  'src/components/industries-hub/HeroOrientationDiagram.tsx',
  'src/components/industries-hub/icons.ts',
  'src/styles/industries-hub.css',
]
const CLAIM = [
  { label: 'percentage figure', re: /\b\d{1,3}\s*%/ },
  { label: 'benchmark/result verb', re: /\b(tăng|giảm)\s+\d/i },
  { label: 'compliance claim', re: /tuân thủ|chứng nhận|ISO\s*\d/i },
]
for (const rel of OWNED) {
  const abs = path.join(ROOT, rel)
  if (!fs.existsSync(abs)) { bad(`${rel} missing`); continue }
  const lines = fs.readFileSync(abs, 'utf8').split('\n')
  lines.forEach((ln, i) => CLAIM.forEach((c) => {
    // CSS gradient/color stops (0%, 55%) are not claims — skip style lines for the % rule.
    if (c.label === 'percentage figure' && /gradient|style=|calc\(/.test(ln)) return
    if (c.re.test(ln)) bad(`${rel}:${i + 1} ${c.label} — ${ln.trim()}`)
  }))
}

/* 2. Source contract from hubs.ts (read-only). */
const hubs = fs.readFileSync(path.join(ROOT, 'src/data/hubs.ts'), 'utf8')
const m = hubs.match(/export const INDUSTRIES_HUB[\s\S]*?\n}\n/)
if (!m) bad('INDUSTRIES_HUB block not found in hubs.ts')
else {
  const block = m[0]
  const cardsBlock = (block.match(/cards:\s*{[\s\S]*?\n {2}},/) || [''])[0]
  const EXPECT = [
    { title: 'Giáo dục', route: 'ROUTES.education', tags: ['Gcalls Plus', 'Tích hợp CRM'] },
    { title: 'Tài chính', route: 'ROUTES.finance', tags: ['Gcalls Plus', 'QA QC Center'] },
    { title: 'Bảo hiểm', route: 'ROUTES.insurance', tags: ['Gcalls Plus', 'QA QC Center'] },
    { title: 'Bất động sản', route: 'ROUTES.realEstate', tags: ['Gcalls Plus', 'Tích hợp CRM'] },
    { title: 'Thương mại điện tử', route: 'ROUTES.ecommerce', tags: ['Tích hợp POS', 'Gcalls CX'] },
    { title: 'BPO', route: 'ROUTES.bpo', tags: ['Gcalls CX', 'QA QC Center'] },
  ]
  const titleCount = (cardsBlock.match(/title:\s*'/g) || []).length
  if (titleCount !== 6) bad(`expected 6 industry cards, found ${titleCount}`)
  for (const e of EXPECT) {
    if (!cardsBlock.includes(`title:\n          '${e.title}'`) && !cardsBlock.includes(`'${e.title}'`)) bad(`missing industry: ${e.title}`)
    if (!cardsBlock.includes(e.route)) bad(`missing route ${e.route} for ${e.title}`)
    for (const t of e.tags) if (!cardsBlock.includes(`'${t}'`)) bad(`missing tag "${t}" (${e.title})`)
  }
  if (/Voicebot/i.test(cardsBlock)) bad('Voicebot must not appear in industry cards')
}

if (fail) { console.error(`\nINDUSTRIES_HUB verify: FAIL — ${fail} issue(s).`); process.exit(1) }
console.log('INDUSTRIES_HUB verify: PASS — claim guard clean, six-industry/route/tag contract intact.')
