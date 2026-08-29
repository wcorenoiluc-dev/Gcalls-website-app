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
 * `visual` names a media id, a diagram id, or a demo mockup to place with the
 * section. Only Gcalls Plus has approved product screenshots; CX, Voicebot and
 * QA/QC get brand diagrams and DEMO mockups built from their own functionality,
 * never a Gcalls Plus screenshot relabelled as another product.
 *
 * The demo mockups were authorised in the 007 addendum: a product with no
 * screenshot may show a demonstration interface, provided the data is visibly
 * invented and the caption says so. Each of those three products gets the three
 * the addendum asks for — a hero mockup, a workflow visual and a
 * dashboard/feature visual.
 */
const PAGES = [
  {
    id: 'gcalls-plus',
    heroMockup: 'plus_gallery',
    route: '/gcalls-plus-webphone/',
    file: 'gcallsPlus.ts',
    lead: { intent: 'consultation', source: 'gcalls_plus', product: 'Gcalls Plus Webphone' },
    sections: [
      // All thirteen approved screenshots land here, each beside the section it
      // actually shows. Gcalls Plus is the only product with real screenshots,
      // so spreading them thinly across other pages would mean showing the
      // wrong product; concentrating them here is what makes this page the one
      // with genuine evidence behind it.
      ['GP_PROBLEMS', { media: 'GP-13' }], ['GP_OVERVIEW', { media: 'GP-09' }], ['GP_FEATURES', { media: 'GP-14' }],
      ['GP_HISTORY', { media: 'GP-15' }], ['GP_CONTEXT', { media: 'GP-10' }],
      ['GP_WORKFLOW', { media: 'GP-07' }], ['GP_PERFORMANCE', { media: 'GP-05' }],
      ['GP_INTEGRATION', { media: 'GP-12' }], ['GP_USE_CASES', { media: 'GP-03' }],
      ['GP_BOUNDARIES', { media: 'GP-02' }], ['GP_DEPLOYMENT', { media: 'GP-11' }],
      ['GP_PRICING'], ['GP_STORY'], ['GP_FINAL_CTA'],
    ],
  },
  {
    id: 'cx',
    heroMockup: 'cx_inbox',
    route: '/gcalls-cx/',
    file: 'gcallsCx.ts',
    lead: { intent: 'consultation', source: 'gcalls_cx', product: 'Gcalls CX' },
    sections: [
      ['CX_PROBLEMS'], ['CX_OVERVIEW', { mockup: 'cx_inbox' }], ['CX_CHANNELS'],
      ['CX_INBOX', { mockup: 'cx_inbox' }], ['CX_TICKETS'], ['CX_CONTEXT', { mockup: 'crm' }],
      ['CX_HOW_IT_WORKS', { diagram: 'flow' }], ['CX_REPORTING', { mockup: 'analytics' }], ['CX_BENEFITS'],
      ['CX_USE_CASES'], ['CX_INTEGRATION'], ['CX_BOUNDARIES'], ['CX_DEPLOYMENT'], ['CX_TRUST'],
      ['CX_PRICING'], ['CX_FINAL_CTA'],
    ],
  },
  {
    id: 'voicebot',
    heroMockup: 'voicebot_builder',
    route: '/voicebot-ai/',
    file: 'voicebotAi.ts',
    lead: { intent: 'consultation', source: 'voicebot_ai', product: 'Gcalls Voicebot AI' },
    sections: [
      ['VB_PROBLEMS'], ['VB_USE_CASES', { mockup: 'voicebot_builder' }], ['VB_HOW_IT_WORKS', { diagram: 'flow' }],
      ['VB_CAPABILITIES', { mockup: 'voicebot_builder' }], ['VB_HUMAN_AI', { diagram: 'handover' }],
      ['VB_INTEGRATION'], ['VB_INDUSTRIES'], ['VB_DEPLOYMENT'], ['VB_OUTCOMES', { mockup: 'analytics' }],
      ['VB_FINAL_CTA'],
    ],
  },
  {
    id: 'qa-qc',
    heroMockup: 'qc_transcript',
    route: '/qc-bot-ai/',
    file: 'qaQcCenter.ts',
    lead: { intent: 'consultation', source: 'qa_qc_center', product: 'QA QC Center' },
    sections: [
      ['QQ_PROBLEMS'], ['QQ_OVERVIEW', { mockup: 'qc_transcript' }], ['QQ_HOW_IT_WORKS', { diagram: 'flow' }],
      ['QQ_CAPABILITIES'], ['QQ_SCORING', { mockup: 'qc_transcript' }], ['QQ_SIGNALS'], ['QQ_HUMAN_LOOP'],
      ['QQ_DASHBOARD', { mockup: 'analytics' }], ['QQ_BENEFITS'], ['QQ_USE_CASES'], ['QQ_INTEGRATION'], ['QQ_BOUNDARIES'],
      ['QQ_PRICING'], ['QQ_STORY'], ['QQ_FINAL_CTA'],
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

  /*
   * WHICH KEY THE LIST CAME FROM DECIDES HOW IT IS RENDERED.
   *
   * React draws two different things from these sections. `items`, `steps`,
   * `rows` and `channels` become CARDS — a title with a passage under it, and
   * the title heads that passage. `capabilities`, `points` and `valuePoints`
   * become a BULLET LIST inside one card, where each line is a row and heading
   * it would announce a section with no content.
   *
   * Guessing at it from the item's shape does not work, and both guesses have
   * shipped: heading every title gave /gcalls-cx/ 76 headings against the
   * reference's 59, heading none gave 31, and heading only those with a body
   * gave 53 — it drops the deployment steps, which React heads and which carry
   * no description. The source data already knows the answer.
   */
  const CARD_KEYS = ['items', 'steps', 'rows', 'channels']
  const BULLET_KEYS = ['capabilities', 'points', 'valuePoints']

  const listKey = [...CARD_KEYS, ...BULLET_KEYS].find(
    (key) => Array.isArray(raw[key]) && raw[key].length,
  )
  const list = listKey ? raw[listKey] : undefined
  const cards = CARD_KEYS.includes(listKey)

  const items = (list ?? [])
    .map((item) => {
      if (typeof item === 'string') return { label: '', title: item, body: '' }
      if (!item || typeof item !== 'object') return null
      return {
        label: pick(item, ['n', 'step', 'badge', 'tag']),
        // `role` and `segment` are what the use-case and industry sections
        // call their titles. Without them those sections rendered as a run of
        // unlabelled paragraphs — five industries on Gcalls Plus and four on
        // CX, each described but never named.
        title: pick(item, ['title', 'name', 'role', 'segment', 'label', 'question', 'heading']),
        body: pick(item, ['detail', 'description', 'body', 'answer', 'text', 'copy']),
      }
    })
    .filter((item) => item && (item.title || item.body))

  if (!heading && !lead && items.length === 0) return null

  return { eyebrow, heading, lead, cards, items }
}

const problems = []
const output = { generator: 'wordpress/scripts/build-product-content.mjs', pages: {} }

for (const page of PAGES) {
  const module = await load(page.file)

  const heroRaw = module[Object.keys(module).find((k) => k.endsWith('_HERO'))]
  /*
   * THE HERO'S VISUAL IS PART OF THE HERO, AND HAS TO BE GENERATED WITH IT.
   *
   * Checkpoint 008 added a visual to each product hero by editing
   * product-pages.json directly. That worked and made the file unreproducible:
   * the next `npm run wp:product` — the ordinary way to push a copy fix —
   * regenerated the JSON without the `mockup` key and silently removed all
   * four hero visuals. Nothing would have failed; the pages would just have
   * gone back to being walls of text.
   */
  if (!page.heroMockup) problems.push(`${page.id}: no heroMockup declared`)

  const hero = {
    mockup: page.heroMockup ?? '',
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

  /*
   * The direct answer and the FAQ were being dropped, and they are the two
   * parts of these pages a visitor is most likely to have come for. The direct
   * answer is the "X là gì?" paragraph React places immediately after the hero
   * — plain visible text, never inside a tab or an accordion, because it is
   * what an answer engine quotes. The FAQ is six to eight questions per page.
   *
   * They are carried apart from `sections` because their shapes are their own:
   * one is a question and an answer, the other is a list of them, and folding
   * either into the generic section renderer would lose that.
   */
  const directRaw = module[Object.keys(module).find((k) => k.endsWith('_DIRECT_ANSWER'))]
  const faqRaw = module[Object.keys(module).find((k) => k.endsWith('_FAQ'))]

  const direct = directRaw
    ? { question: pick(directRaw, ['question', 'q', 'h2']), answer: pick(directRaw, ['answer', 'a', 'body']) }
    : null

  const faq = (Array.isArray(faqRaw) ? faqRaw : [])
    .map((item) => ({ question: pick(item, ['q', 'question']), answer: pick(item, ['a', 'answer']) }))
    .filter((item) => item.question && item.answer)

  if (direct && !(direct.question && direct.answer)) problems.push(`${page.id}: direct answer is incomplete`)
  if (faq.length === 0) problems.push(`${page.id}: no FAQ items`)

  output.pages[page.id] = {
    route: page.route,
    // The FAQ heading names the product — "Câu hỏi thường gặp về Gcalls CX",
    // not a bare "Câu hỏi thường gặp". On a page this long the reader has
    // scrolled a long way from the title by the time they reach it.
    product: page.lead.product ?? '',
    hero,
    direct,
    faq,
    lead: page.lead,
    sections,
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, `${JSON.stringify(output, null, 2)}\n`)

console.log(`build-product-content: ${path.relative(REPO, OUT)}`)
for (const [id, page] of Object.entries(output.pages)) {
  const items = page.sections.reduce((n, s) => n + s.items.length, 0)
  console.log(
    `  ${id.padEnd(12)} ${String(page.sections.length).padStart(2)} sections, ${String(items).padStart(3)} items, ` +
      `${String(page.faq.length).padStart(2)} faq, hero "${page.hero.heading.slice(0, 38)}…"`,
  )
}

if (problems.length) {
  console.log('\nPROBLEMS')
  for (const problem of problems) console.log(`  - ${problem}`)
  process.exit(1)
}

console.log('\nbuild-product-content: OK')
