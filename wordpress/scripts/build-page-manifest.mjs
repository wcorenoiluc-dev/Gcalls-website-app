/*
 * Normalise the extracted React exports into one page manifest per route.
 *
 * SHAPE-DRIVEN, NOT NAME-DRIVEN. The first version of this mapped known export
 * names — CRM_PROBLEMS, CRM_CAPABILITIES and so on — and produced a perfectly
 * plausible manifest that silently dropped 23 sections, because the other three
 * data files name their sections differently. /tong-dai-quoc-te/ came out with
 * five sections where it has fourteen.
 *
 * So nothing is matched by name. Every export is classified by its SHAPE:
 * an object carrying `items` is a card grid, one carrying `steps` or `flow` is a
 * numbered sequence, one carrying `points` or `columns` is a split, a bare
 * string is prose. The completeness check then requires every export to be
 * either mapped or explicitly excluded with a reason, so the next data file with
 * new section names fails the gate instead of quietly losing content.
 *
 * Wording is copied, never rewritten. Each section records the export it came
 * from, and each route records the SHA-256 of its source files.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const IN = 'wordpress/content/extracted'
const OUT = 'wordpress/wp-content/plugins/gcalls-core/data/content-pages.json'

/** Exports that are page furniture, not body sections. */
export const NON_SECTION = {
  HERO: 'rendered as the hero block',
  LEAD: 'CTA attribution, carried on the cta',
  FINAL_CTA: 'rendered as the cta block',
  FAQ: 'rendered as the faq block',
  ESTIMATOR_HREF: 'link target used by a CTA',
  PLATFORM_NOTE: 'rendered inside the platforms section',
  PLATFORM_SECTION: 'heading for the platforms section',
  PRICING: 'pricing is owned by /bang-gia/ and is not duplicated here',
}

const isNonSection = (name) =>
  Object.keys(NON_SECTION).find((k) => name === k || name.endsWith('_' + k))

const str = (v) => (typeof v === 'string' ? v : '')
const head = (o) => str(o.heading) || str(o.title) || str(o.h2) || ''
const lead = (o) => str(o.lead) || str(o.description) || str(o.intro) || ''
const body = (o) => str(o.detail) || str(o.body) || str(o.description) || str(o.answer) || str(o.text) || ''

const asItems = (arr) =>
  (arr || []).map((i) =>
    typeof i === 'string'
      ? { title: '', body: i }
      : { title: str(i.title) || str(i.name) || str(i.label) || '', body: body(i), href: str(i.href) },
  )

/** Classify one export by shape. Returns null when it carries no body. */
function toSection(name, v) {
  if (typeof v === 'string') {
    return v.trim() ? { type: 'prose', from: name, heading: '', body: v } : null
  }
  if (Array.isArray(v)) {
    const items = asItems(v)
    return items.length ? { type: 'cards', from: name, heading: '', lead: '', cards: items } : null
  }
  if (!v || typeof v !== 'object') return null

  const seq = v.steps || v.flow || v.timeline || v.stages
  if (Array.isArray(seq) && seq.length) {
    return { type: 'steps', from: name, heading: head(v), lead: lead(v),
      steps: asItems(seq).map((s, i) => ({ n: i + 1, ...s })) }
  }

  const split = v.points || v.columns || v.rows
  if (Array.isArray(split) && split.length) {
    const items = asItems(split)
    /*
     * A list of short bare labels — "Contact profile", "Follow-up" — is a set
     * of tags, not a set of cards. Rendered as cards they became three columns
     * of one-line boxes stretched to equal height, which is a lot of empty box
     * for two words. The shape decides the presentation.
     */
    const allLabels = items.every((i) => !i.title && i.body.length <= 60)
    if (allLabels) {
      return { type: 'taglist', from: name, eyebrow: str(v.eyebrow), heading: head(v),
        lead: lead(v), tags: items.map((i) => i.body) }
    }
    return { type: 'split', from: name, heading: head(v), lead: lead(v), columns: items }
  }

  /*
   * A before/after comparison: two LABELLED flows, each a list of short steps.
   * Flattening the two into one list would lose which side each step belongs
   * to, and the whole point of the section is the contrast, so it gets its own
   * type and the renderer draws two labelled columns.
   */
  const pair = (x) => x && typeof x === 'object' && Array.isArray(x.steps)
  if (pair(v.before) && pair(v.after)) {
    return { type: 'comparison', from: name, eyebrow: str(v.eyebrow), heading: head(v),
      before: { label: str(v.before.label), steps: v.before.steps.map(str) },
      after: { label: str(v.after.label), steps: v.after.steps.map(str) } }
  }

  const grid = v.items || v.cards || v.list || v.markets || v.features
  if (Array.isArray(grid) && grid.length) {
    return { type: 'cards', from: name, heading: head(v), lead: lead(v), cards: asItems(grid) }
  }

  const prose = body(v)
  if (head(v) || prose) {
    return prose || head(v) ? { type: 'prose', from: name, heading: head(v), body: prose } : null
  }
  return null
}

const built = []

for (const file of fs.readdirSync(IN).filter((f) => f.endsWith('.json') && !f.startsWith('_'))) {
  const src = JSON.parse(fs.readFileSync(path.join(IN, file), 'utf8'))
  if (src.family !== 'solution-detail') continue

  const ex = src.exports
  const get = (suffix) => {
    const k = Object.keys(ex).find((x) => x.split('::')[1].endsWith(suffix))
    return k ? ex[k] : null
  }

  const hero = get('_HERO')
  const faq = get('_FAQ')
  const cta = get('_FINAL_CTA')
  const attribution = get('_LEAD')

  const sections = []
  for (const key of Object.keys(ex)) {
    const name = key.split('::')[1]
    if (isNonSection(name)) continue
    const s = toSection(name, ex[key])
    if (s) sections.push(s)
  }

  built.push({
    slug: src.slug,
    family: src.family,
    sources: src.sources,
    hero: hero
      ? { eyebrow: str(hero.eyebrow), h1: str(hero.h1), description: str(hero.description),
          points: asItems(hero.valuePoints) }
      : null,
    sections,
    faq: Array.isArray(faq) ? faq.map((f) => ({ q: str(f.question) || str(f.q), a: str(f.answer) || str(f.a) })) : [],
    cta: cta ? { heading: head(cta), body: body(cta), label: str(cta.ctaLabel) || str(cta.label) } : null,
    attribution: attribution || null,
  })
}

const manifest = {
  schema: 1,
  generated_at_gmt: new Date().toISOString(),
  note: 'Rendered read-only at request time. Nothing here is written to the database. See docs/CONTENT-RENDER-ADR.md.',
  pages: built.sort((a, b) => a.slug.localeCompare(b.slug)),
}

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n')

console.log(`content-pages.json — ${built.length} page(s)`)
for (const p of built) {
  const n = (t) => p.sections.filter((s) => s.type === t).length
  const cards = p.sections.filter((s) => s.type === 'cards').reduce((a, s) => a + s.cards.length, 0)
  console.log(`  ${p.slug.padEnd(30)} sections=${String(p.sections.length).padStart(2)} (cards=${n('cards')} steps=${n('steps')} split=${n('split')} prose=${n('prose')}) items=${String(cards).padStart(2)} faq=${String(p.faq.length).padStart(2)}`)
}
console.log(`sha256 ${crypto.createHash('sha256').update(fs.readFileSync(OUT)).digest('hex')}`)
