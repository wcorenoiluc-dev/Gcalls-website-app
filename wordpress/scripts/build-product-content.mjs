#!/usr/bin/env node
/**
 * Exports the four product pages from React into the plugin.
 *
 * WHY THESE FOUR PAGES NEEDED THIS
 * After 003B they were a title and one sentence of baseline copy. The React
 * originals carry 12–19 sections each — problems, capabilities, workflow, use
 * cases, integration, boundaries, deployment — and all of that already exists,
 * reviewed, in `src/data/*.ts`. Retyping it into WordPress would be four
 * transcription jobs that go stale on the next editorial change.
 *
 * WHAT IS DELIBERATELY NOT COPIED
 * `*_PRICING`, `*_ESTIMATOR_HREF` and the lead-context objects: pricing has no
 * approved figures (see estimate.ts) and the lead context is rendered by the CTA
 * shortcode, not as body copy. `*_FAQ` is skipped here because the FAQ already
 * has its own home in `_gcalls_faq` meta and its own renderer — duplicating it
 * would put the questions on the page twice and give the FAQPage schema a
 * second, disagreeing source.
 *
 * The section ORDER is transcribed from the React page components, verified
 * against `section-inventory.mjs --pages`, because the order is an editorial
 * decision: problem before product, boundaries before the ask.
 *
 * Usage: node wordpress/scripts/build-product-content.mjs
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.resolve(HERE, '..')
const REPO = path.resolve(WP, '..')
const OUT = path.join(WP, 'wp-content/plugins/gcalls-core/data/product-pages.json')

/* The route table, so the aliased import can be rewritten away. */
const sitemapSrc = fs.readFileSync(path.join(REPO, 'src/config/sitemap.ts'), 'utf8')
const routesBlock = sitemapSrc.slice(sitemapSrc.indexOf('export const ROUTES = {'), sitemapSrc.indexOf('} as const'))
const routes = {}
for (const [, key, value] of routesBlock.matchAll(/^\s*(\w+):\s*'([^']+)',/gm)) routes[key] = value

/** Loads a data module by rewriting its `@/` imports to inline values. */
async function load(file) {
  const source = fs.readFileSync(path.join(REPO, 'src/data', file), 'utf8')
  const patched = source
    .replace(/^import .*from '@\/config\/navigation'$/m, `const ROUTES = ${JSON.stringify(routes)}\ntype RoutePath = string`)
    .replace(/^import .*from '@\/config\/sitemap'$/m, `const ROUTES2 = ${JSON.stringify(routes)}`)
    .replace(/^import .*from '@\/[^']*'$/gm, '')
  const temp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'gcalls-prod-')), file)
  fs.writeFileSync(temp, patched)
  const loaded = await import(temp)
  fs.rmSync(path.dirname(temp), { recursive: true, force: true })
  return loaded
}

/**
 * Section order, transcribed from the React page components.
 *
 * `visual` names a media id or a diagram id to place with the section. Only
 * Gcalls Plus has approved product screenshots; CX, Voicebot and QA/QC get a
 * brand diagram, never a Gcalls Plus screenshot relabelled as another product.
 */
const PAGES = [
  {
    id: 'gcalls-plus',
    route: '/gcalls-plus-webphone/',
    file: 'gcallsPlus.ts',
    lead: { intent: 'consultation', source: 'gcalls_plus', product: 'Gcalls Plus Webphone' },
    sections: [
      ['GP_PROBLEMS'], ['GP_OVERVIEW', { media: 'GP-09' }], ['GP_FEATURES'],
      ['GP_HISTORY', { media: 'GP-15' }], ['GP_CONTEXT', { media: 'GP-10' }],
      ['GP_WORKFLOW'], ['GP_PERFORMANCE', { media: 'GP-05' }],
      ['GP_INTEGRATION', { media: 'GP-12' }], ['GP_USE_CASES'],
      ['GP_BOUNDARIES'], ['GP_DEPLOYMENT'],
    ],
  },
  {
    id: 'cx',
    route: '/gcalls-cx/',
    file: 'gcallsCx.ts',
    lead: { intent: 'consultation', source: 'gcalls_cx', product: 'Gcalls CX' },
    sections: [
      ['CX_PROBLEMS'], ['CX_OVERVIEW', { diagram: 'omnichannel' }], ['CX_CHANNELS'],
      ['CX_INBOX'], ['CX_TICKETS'], ['CX_CONTEXT'],
      ['CX_HOW_IT_WORKS', { diagram: 'flow' }], ['CX_REPORTING'], ['CX_BENEFITS'],
      ['CX_USE_CASES'], ['CX_INTEGRATION'], ['CX_BOUNDARIES'], ['CX_DEPLOYMENT'], ['CX_TRUST'],
    ],
  },
  {
    id: 'voicebot',
    route: '/voicebot-ai/',
    file: 'voicebotAi.ts',
    lead: { intent: 'consultation', source: 'voicebot_ai', product: 'Gcalls Voicebot AI' },
    sections: [
      ['VB_PROBLEMS'], ['VB_USE_CASES'], ['VB_HOW_IT_WORKS', { diagram: 'flow' }],
      ['VB_CAPABILITIES'], ['VB_HUMAN_AI', { diagram: 'handover' }],
      ['VB_INTEGRATION'], ['VB_INDUSTRIES'], ['VB_DEPLOYMENT'], ['VB_OUTCOMES'],
    ],
  },
  {
    id: 'qa-qc',
    route: '/qc-bot-ai/',
    file: 'qaQcCenter.ts',
    lead: { intent: 'consultation', source: 'qa_qc_center', product: 'QA QC Center' },
    sections: [
      ['QQ_PROBLEMS'], ['QQ_OVERVIEW', { diagram: 'scoring' }], ['QQ_HOW_IT_WORKS', { diagram: 'flow' }],
      ['QQ_CAPABILITIES'], ['QQ_SCORING'], ['QQ_SIGNALS'], ['QQ_HUMAN_LOOP'],
      ['QQ_DASHBOARD'], ['QQ_BENEFITS'], ['QQ_USE_CASES'], ['QQ_INTEGRATION'], ['QQ_BOUNDARIES'],
    ],
  },
]

/** Pulls the first present key from an object. */
const pick = (object, keys) => {
  for (const key of keys) if (object && typeof object[key] === 'string' && object[key].trim()) return object[key].trim()
  return ''
}

/** Normalises one section object into the shape the renderer understands. */
function normalise(raw) {
  if (!raw || typeof raw !== 'object') return null

  const heading = pick(raw, ['h2', 'h3', 'title', 'heading'])
  const lead = pick(raw, ['description', 'lead', 'intro', 'body', 'detail'])
  const eyebrow = pick(raw, ['eyebrow', 'label'])

  const list = [raw.items, raw.steps, raw.capabilities, raw.points, raw.valuePoints, raw.rows, raw.channels]
    .find((candidate) => Array.isArray(candidate) && candidate.length)

  const items = (list ?? [])
    .map((item) => {
      if (typeof item === 'string') return { label: '', title: item, body: '' }
      if (!item || typeof item !== 'object') return null
      return {
        label: pick(item, ['n', 'step', 'badge', 'tag']),
        title: pick(item, ['title', 'name', 'label', 'question', 'heading']),
        body: pick(item, ['detail', 'description', 'body', 'answer', 'text', 'copy']),
      }
    })
    .filter((item) => item && (item.title || item.body))

  if (!heading && !lead && items.length === 0) return null

  return { eyebrow, heading, lead, items }
}

const problems = []
const output = { generator: 'wordpress/scripts/build-product-content.mjs', pages: {} }

for (const page of PAGES) {
  const module = await load(page.file)

  const heroRaw = module[Object.keys(module).find((k) => k.endsWith('_HERO'))]
  const hero = {
    eyebrow: pick(heroRaw ?? {}, ['eyebrow']),
    heading: pick(heroRaw ?? {}, ['h1', 'title', 'heading']),
    lead: pick(heroRaw ?? {}, ['description', 'lead', 'subtitle', 'sub']),
    points: (heroRaw?.valuePoints ?? [])
      .map((p) => (typeof p === 'string' ? p : pick(p, ['title', 'label', 'text'])))
      .filter(Boolean),
  }

  if (!hero.heading) problems.push(`${page.id}: no hero heading`)

  const sections = []

  for (const [name, extra = {}] of page.sections) {
    const normalised = normalise(module[name])

    if (!normalised) {
      problems.push(`${page.id}: section ${name} produced nothing`)
      continue
    }

    sections.push({ source: name, ...normalised, ...extra })
  }

  if (sections.length < 6) problems.push(`${page.id}: only ${sections.length} sections`)

  output.pages[page.id] = { route: page.route, hero, lead: page.lead, sections }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, `${JSON.stringify(output, null, 2)}\n`)

console.log(`build-product-content: ${path.relative(REPO, OUT)}`)
for (const [id, page] of Object.entries(output.pages)) {
  const items = page.sections.reduce((n, s) => n + s.items.length, 0)
  console.log(`  ${id.padEnd(12)} ${String(page.sections.length).padStart(2)} sections, ${String(items).padStart(3)} items, hero "${page.hero.heading.slice(0, 42)}…"`)
}

if (problems.length) {
  console.log('\nPROBLEMS')
  for (const problem of problems) console.log(`  - ${problem}`)
  process.exit(1)
}

console.log('\nbuild-product-content: OK')
