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
import crypto from 'node:crypto'
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
 *
 * 0.8.6 briefly made the hero on those three a drawn WebP. 0.9.0 puts the
 * ported components back, because the React source is the reference and it
 * leads each of those pages with an interactive panel, not a picture. The
 * three images stay in the repository as a fallback for a product that ends
 * up with no component at all; nothing renders them today.
 *
 * Every mockup below is now the component React places in that exact section
 * — the mapping was read off src/components/<product>/sections.tsx. The port
 * used to answer four CX sections with two panels plus a generic CRM and a
 * generic analytics mockup, so "báo cáo vận hành" and "hồ sơ khách hàng" drew
 * the same picture under different headings. A visual that does not depict
 * its own section teaches the reader that the visuals are decorative.
 *
 * Where React places no visual, neither does this. VB_USE_CASES and
 * VB_OUTCOMES lost theirs for that reason: both were the generic mockups
 * again, and Voicebot has exactly two visuals in the reference.
 */
const PAGES = [
  {
    id: 'gcalls-plus',
    // GCALLS-039: was 'plus_gallery', a six-frame raster gallery whose every
    // frame is REFUSED (unapproved domain, fabricated identities, invented
    // KPIs). 'customer_popup' is drawn by class-mockups.php and shows only a
    // call duration, a timestamp and a status — figures the checkpoint keeps
    // without a claim warning.
    heroMockup: 'customer_popup',
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
      ['CX_PROBLEMS'], ['CX_OVERVIEW', { mockup: 'cx_context' }], ['CX_CHANNELS'],
      ['CX_INBOX', { mockup: 'cx_inbox' }], ['CX_TICKETS', { mockup: 'cx_ticket' }], ['CX_CONTEXT', { mockup: 'cx_context' }],
      ['CX_HOW_IT_WORKS', { diagram: 'flow' }], ['CX_REPORTING', { mockup: 'cx_report' }], ['CX_BENEFITS'],
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
      ['VB_PROBLEMS'], ['VB_USE_CASES'], ['VB_HOW_IT_WORKS', { diagram: 'flow' }],
      ['VB_CAPABILITIES', { mockup: 'voicebot_handoff' }], ['VB_HUMAN_AI', { diagram: 'handover' }],
      ['VB_INTEGRATION'], ['VB_INDUSTRIES'], ['VB_DEPLOYMENT'], ['VB_OUTCOMES'],
      ['VB_FINAL_CTA'],
    ],
  },
  {
    id: 'qa-qc',
    heroMockup: 'qc_review',
    route: '/qc-bot-ai/',
    file: 'qaQcCenter.ts',
    lead: { intent: 'consultation', source: 'qa_qc_center', product: 'QA QC Center' },
    sections: [
      ['QQ_PROBLEMS'], ['QQ_OVERVIEW', { mockup: 'qc_transcript' }], ['QQ_HOW_IT_WORKS', { diagram: 'flow' }],
      ['QQ_CAPABILITIES'], ['QQ_SCORING', { mockup: 'qc_scorecard' }], ['QQ_SIGNALS', { mockup: 'qc_signals' }], ['QQ_HUMAN_LOOP'],
      ['QQ_DASHBOARD', { mockup: 'qc_dashboard' }], ['QQ_BENEFITS'], ['QQ_USE_CASES'], ['QQ_INTEGRATION'], ['QQ_BOUNDARIES'],
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

  /*
   * GP_BOUNDARIES is two labelled groups, not one list: `fitTitle`/`fitItems`
   * ("who this suits") beside `expandTitle`/`expandItems` ("what to move to
   * when you outgrow it"). Neither key was known here, so the section exported
   * with an empty list. Flattening the two groups into one would lose the
   * contrast that IS the section, so they are kept as groups and the renderer
   * places them side by side, which is what React does.
   */
  const GROUPS = [
    ['fitTitle', 'fitItems'],
    ['expandTitle', 'expandItems'],
  ]
  const groups = GROUPS
    .filter(([, itemsKey]) => Array.isArray(raw[itemsKey]) && raw[itemsKey].length)
    .map(([titleKey, itemsKey]) => ({
      label: pick(raw, [titleKey]),
      items: raw[itemsKey]
        .map((item) =>
          typeof item === 'string'
            ? { title: item, body: '', href: '' }
            : {
                title: pick(item, ['need', 'title', 'name', 'label']),
                body: pick(item, ['solution', 'product', 'detail', 'description']),
                href: pick(item, ['path', 'href']),
              },
        )
        .filter((item) => item.title || item.body),
    }))
    .filter((group) => group.items.length)

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
        /*
         * `need` was the missing one, and it cost three whole sections.
         * CX_BOUNDARIES and QQ_BOUNDARIES are decision tables — each row is
         * {need, product, path}: "what you are trying to do" answered by
         * "which product does it". Neither key was in either list, so every row
         * normalised to an empty title AND an empty body, the filter below
         * dropped all of them, and the section arrived carrying a heading and
         * nothing else. It read as an export success because the heading was
         * there.
         */
        title: pick(item, ['title', 'name', 'role', 'segment', 'label', 'question', 'heading', 'need']),
        body: pick(item, ['detail', 'description', 'body', 'answer', 'text', 'copy', 'product', 'solution']),
        // The row's own destination. These are navigation, not lead capture:
        // they send a reader to the product that fits, and the CTA inventory
        // counts them separately for that reason.
        href: pick(item, ['path', 'href']),
      }
    })
    .filter((item) => item && (item.title || item.body))

  /*
   * EMPTY BY DESIGN IS NOT AN EXPORT FAILURE, AND THE TWO MUST NOT LOOK ALIKE.
   *
   * GP_STORY has no customer story because none has been approved for
   * publication — React itself renders `placeholder` and `placeholderNote`
   * there. Exporting that as "produced nothing" would have the builder demand
   * a fix for something that is working as intended, and rendering it as an
   * empty section would drop copy the reference shows. So it is carried, with
   * a flag, and the completeness report counts it separately.
   */
  const placeholder = pick(raw, ['placeholder'])
  const placeholderNote = pick(raw, ['placeholderNote'])
  const link = raw.link && typeof raw.link === 'object'
    ? { label: pick(raw.link, ['label']), href: pick(raw.link, ['path', 'href']) }
    : null

  if (placeholder && items.length === 0 && groups.length === 0) {
    return { eyebrow, heading, lead, cards: false, items: [], groups: [], emptyByDesign: true, placeholder, placeholderNote, link }
  }

  if (!heading && !lead && items.length === 0 && groups.length === 0) return null

  return { eyebrow, heading, lead, cards, items, groups }
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

  /*
   * The hero's own call to action, with the attribution React gives it.
   *
   * The port rendered one generic "Đăng ký tư vấn" per hero, so the four
   * product pages carried four lead links where React carries six — and the
   * two missing ones are the DEMO asks, the highest-intent link on the page.
   * Both the label and the intent come from the product's own data
   * (`primaryCta.label` and `_DEMO_LEAD`), so nothing here is invented and the
   * lead still arrives tagged with the page that produced it.
   */
  const demoLead = module[Object.keys(module).find((k) => k.endsWith('_DEMO_LEAD'))]

  const heroCta = {
    label: pick(heroRaw?.primaryCta ?? {}, ['label']),
    intent: demoLead?.intent ?? page.lead.intent,
    source: demoLead?.source ?? page.lead.source,
    product: demoLead?.product ?? page.lead.product,
  }

  if (!heroCta.label) problems.push(`${page.id}: hero has no primary CTA label`)

  /*
   * The closing band, which React gives its own heading, its own sentence and
   * TWO asks: a demo and a conversation. The port had one generic line and one
   * generic button, so the page ended more weakly than the reference and lost
   * the demo request entirely.
   */
  const finalRaw = module[Object.keys(module).find((k) => k.endsWith('_FINAL_CTA'))]

  /**
   * One closing button: a lead ask when it points at the contact page, a plain
   * link to wherever else it points.
   */
  const ask = (raw, leadSource) => {
    const label = pick(raw ?? {}, ['label'])

    if (!label) return null

    const target = String(raw?.path ?? '')
    const isLead = target === '' || target.startsWith(routes.contact ?? '/lien-he/')

    return isLead
      ? {
          label,
          intent: leadSource?.intent ?? page.lead.intent,
          source: leadSource?.source ?? page.lead.source,
          product: leadSource?.product ?? page.lead.product,
        }
      : { label, href: target }
  }
  const consultLead = module[Object.keys(module).find((k) => /_(CONSULT_LEAD|LEAD_CONTEXT)$/.test(k))]

  const finalCta = finalRaw
    ? {
        heading: pick(finalRaw, ['h2', 'title', 'heading']),
        lead: pick(finalRaw, ['description', 'lead']),
        // NOT every closing button is a lead. Gcalls Plus offers "Ước tính cấu
        // hình", which goes to the estimator; forcing lead attribution onto it
        // turned a tool link into a fifth contact link on a page the reference
        // gives four. The path decides.
        primary: ask(finalRaw.primaryCta, demoLead ?? consultLead),
        secondary: ask(finalRaw.secondaryCta, consultLead),
      }
    : null

  if (finalCta && !finalCta.heading) problems.push(`${page.id}: final CTA has no heading`)

  const hero = {
    mockup: page.heroMockup ?? '',
    cta: heroCta,
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
      problems.push(`${page.id}: section ${name} produced nothing (EXPORT_FAILURE)`)
      continue
    }

    /*
     * The check GCALLS-036B needed and did not have. A section that arrives
     * with a heading and no body renders as a heading orphan or gets dropped,
     * and both were happening silently. Now the build fails, and it fails with
     * the distinction that matters: nothing to render is an EXPORT_FAILURE
     * unless the source says the emptiness is intentional.
     */
    const renderable =
      normalised.items.length > 0 ||
      (normalised.groups && normalised.groups.length > 0) ||
      normalised.emptyByDesign === true ||
      Boolean(normalised.lead)

    if (!renderable) {
      problems.push(`${page.id}: section ${name} has a heading and no body (EXPORT_FAILURE)`)
    }

    /*
     * Section-level CTAs, taken from the React data rather than placed by
     * judgement. Only four constants carry one — the pricing sections
     * (estimator + price list), CX_TRUST, QQ_STORY and GP_INTEGRATION — and
     * that restraint is the point: React does not repeat its ask under every
     * heading, so neither does this. `ask()` is the same allowlist the hero and
     * the closing band use, so a manifest cannot introduce a query parameter.
     */
    const rawSection = module[name]

    /*
     * Two exclusions, both to stop the same ask appearing twice.
     *
     * `*_FINAL_CTA` sections are already skipped by the renderer — the closing
     * band comes from `page.finalCta` — so exporting their buttons here would
     * put the page's two closing asks into the manifest a second time.
     *
     * A section that is empty by design renders its own `link` inside the
     * placeholder (GP_STORY's "Đọc bài viết trên Blog Gcalls" is part of the
     * placeholder, not a separate ask), so taking `link` again would duplicate
     * it directly underneath itself.
     */
    const ctaKeys = normalised.emptyByDesign
      ? ['primaryCta', 'secondaryCta', 'cta']
      : ['primaryCta', 'secondaryCta', 'cta', 'link']

    const sectionCta = name.endsWith('_FINAL_CTA')
      ? []
      : ctaKeys
          .map((key) => ask(rawSection?.[key], key === 'cta' ? demoLead ?? consultLead : consultLead ?? demoLead))
          .filter(Boolean)

    sections.push({ source: name, ...normalised, ...extra, cta: sectionCta })
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

  /*
   * Provenance, so a later reader can prove which revision of the React source
   * a section's copy came from without diffing prose. GCALLS-036B could not
   * answer "is this stale or was it never exported" for the four empty
   * sections; a path and a hash answers it.
   */
  const sourcePath = `src/data/${page.file}`
  const sourceSha = crypto
    .createHash('sha256')
    .update(fs.readFileSync(path.join(REPO, sourcePath)))
    .digest('hex')

  output.pages[page.id] = {
    route: page.route,
    source: { path: sourcePath, sha256: sourceSha },
    // The FAQ heading names the product — "Câu hỏi thường gặp về Gcalls CX",
    // not a bare "Câu hỏi thường gặp". On a page this long the reader has
    // scrolled a long way from the title by the time they reach it.
    product: page.lead.product ?? '',
    hero,
    finalCta,
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
  const items = page.sections.reduce((n, s) => n + s.items.length + (s.groups ?? []).reduce((m, g) => m + g.items.length, 0), 0)
  const byDesign = page.sections.filter((s) => s.emptyByDesign).length
  const grouped = page.sections.filter((s) => (s.groups ?? []).length).length
  console.log(
    `  ${id.padEnd(12)} ${String(page.sections.length).padStart(2)} sections, ${String(items).padStart(3)} items, ` +
      `${String(grouped)} grouped, ${String(byDesign)} empty-by-design, ${String(page.faq.length).padStart(2)} faq`,
  )
}

if (problems.length) {
  console.log('\nPROBLEMS')
  for (const problem of problems) console.log(`  - ${problem}`)
  process.exit(1)
}

console.log('\nbuild-product-content: OK')
