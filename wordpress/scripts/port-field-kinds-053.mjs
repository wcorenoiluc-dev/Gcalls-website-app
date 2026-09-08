#!/usr/bin/env node
/**
 * GCALLS-053 F3 — the field kinds the card vocabulary still has no place for.
 *
 * WHAT IS LEFT AFTER port-hubs-053 AND port-company-hub-053
 * Those two closed `supporting`, `tags`, `cta`, `current` and the section
 * `note`. Three kinds survived them, and each one is lost in a different way.
 *
 * 1. `audience` — DROPPED ENTIRELY, on six pages.
 *    Every resource page and both company pages carry a required "purpose and
 *    audience" section: a paragraph saying who the page is written for, then
 *    three or four named readers with a sentence each (ResourcePurpose.audience
 *    / CompanyPurpose.audience). The migration kept the paragraph and the note
 *    and dropped the readers, so the section arrives as a heading over one
 *    sentence and the page never says who it is for. Nineteen items, on
 *    /tai-nguyen/faq/, /ebook/, /glossary/, /case-studies/, /guides/ and
 *    /cong-ty/khach-hang/.
 *
 * 2. `need` + `product` + `path` — PORTED, THEN FLATTENED.
 *    The boundary sections are decision tables: each row answers "what are you
 *    trying to do" with "which product does it". The migration mapped `need` to
 *    a card title and the product name to a card body, which inverts them — the
 *    row is then a long sentence with a product name underneath, laid out in
 *    the same three-column card grid as everything else. The manifest keeps the
 *    text but no longer says which half is the need and which is the answer, so
 *    the renderer cannot lay it out as the table it is.
 *
 * 3. `role` + `flow` — same shape, same loss.
 *    The use-case sections name a role and describe what that role does with
 *    the product. Ported as title and body, indistinguishable from a feature
 *    card.
 *
 * WHAT THIS DOES ABOUT IT
 * It reads the React source as data — never transcribing — and writes back only
 * ADDITIVE keys: `audience` on the purpose sections, and on the boundary and
 * use-case sections a `variant` plus the per-row `need`/`product`/`role`/`flow`
 * the manifest had already melted into title and body. Existing `title`, `body`
 * and `href` are asserted to match and are never rewritten, so the completeness
 * and parity suites see the same content they saw before, plus the structure.
 *
 * `variant` is also stamped from data/section-components.json where the
 * reviewed component plan already says a section is a `related` link row rather
 * than a card grid — the plan existed and the content renderer was not reading
 * it.
 *
 * NOTHING HERE INVENTS COPY. Every string written comes out of a React module
 * by property access. A row whose React source and manifest card disagree is
 * reported and skipped rather than reconciled.
 *
 * Run: node wordpress/scripts/port-field-kinds-053.mjs [--check]
 */
import esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import Module from 'node:module'

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const DATA = path.join(REPO, 'wordpress/wp-content/plugins/gcalls-core/data')
const MANIFEST = path.join(DATA, 'content-pages.json')
const PLAN = path.join(DATA, 'section-components.json')
const CHECK = process.argv.includes('--check')

const die = (m) => { console.error(`FATAL: ${m}`); process.exit(2) }
const txt = (v) => String(v ?? '').trim()

/** Loads one TypeScript data module and returns its exports. */
function load(relative) {
  const entry = path.join(REPO, 'src/data', relative)
  const out = esbuild.buildSync({
    entryPoints: [entry],
    bundle: true, format: 'cjs', write: false, platform: 'node',
    loader: { '.ts': 'ts' }, logLevel: 'silent',
    alias: { '@': path.join(REPO, 'src') },
  }).outputFiles[0].text
  const mod = new Module(relative)
  mod._compile(out, entry.replace(/\.ts$/, '.js'))
  return mod.exports
}

/* ------------------------------------------------------------------ 1. audience
 *
 * slug -> [module, export, section `from`]. The `from` string is the one the
 * migration wrote, so the audience lands on the section it belongs to instead
 * of being appended somewhere plausible.
 */
const PURPOSE = [
  ['faq', 'resources/faq.ts', 'FAQ', 'faq — purpose'],
  ['ebook', 'resources/ebook.ts', 'EBOOK', 'ebook — purpose'],
  ['glossary', 'resources/glossary.ts', 'GLOSSARY', 'glossary — purpose'],
  ['case-studies', 'resources/caseStudies.ts', 'CASE_STUDIES', 'case-studies — purpose'],
  ['guides', 'resources/guides.ts', 'GUIDES', 'guides — purpose'],
  ['khach-hang', 'company/customers.ts', 'CUSTOMERS', 'customers — purpose'],
  ['doi-tac', 'company/partners.ts', 'PARTNERS', 'partners — purpose'],
]

/* ------------------------------------------------ 2/3. decision and use-case
 *
 * Only the modules that actually hold one. The shape is detected, not assumed:
 * a row with `need` and a product name and a path is a decision row; a row with
 * `role` and a sentence is a use-case row. A module whose symbol stops matching
 * that shape drops out of the port and is reported.
 */
const STRUCTURED_MODULES = [
  'internationalCalling.ts', 'crmIntegration.ts', 'helpdeskIntegration.ts',
  'posIntegration.ts', 'salesforceIntegration.ts', 'hubspotIntegration.ts',
  'zendeskIntegration.ts', 'zohoCrmIntegration.ts', 'freshdeskIntegration.ts',
]

const symbols = new Map()
for (const file of STRUCTURED_MODULES) {
  for (const [name, value] of Object.entries(load(file))) {
    if (value && typeof value === 'object' && Array.isArray(value.items)) {
      symbols.set(name, { file, items: value.items })
    }
  }
}

/** Which variant, if any, a React item list is. Returns null for anything else. */
function variantOf(items) {
  if (!items.length) return null
  const every = (fn) => items.every((i) => i && typeof i === 'object' && fn(i))
  if (every((i) => txt(i.need) && (txt(i.product) || txt(i.solution)) && txt(i.path))) {
    return 'decision'
  }
  if (every((i) => txt(i.role) && (txt(i.flow) || txt(i.detail)))) return 'usecases'
  return null
}

/* ---------------------------------------------------------------- the manifest */
const doc = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
const plan = JSON.parse(fs.readFileSync(PLAN, 'utf8'))
const before = JSON.stringify(doc)

const added = { audience: 0, decision: 0, usecases: 0, related: 0 }
const skipped = []

/* --- audience --- */
for (const [slug, file, exp, from] of PURPOSE) {
  const page = doc.pages.find((p) => p.slug === slug)
  if (!page) { skipped.push(`${slug}: page not in the manifest`); continue }

  const source = load(file)[exp]
  const list = source?.purpose?.audience
  if (!Array.isArray(list) || !list.length) {
    skipped.push(`${slug}: ${exp}.purpose.audience is empty`)
    continue
  }

  const section = page.sections.find((s) => s.from === from)
  if (!section) { skipped.push(`${slug}: no section from="${from}"`); continue }

  /* The paragraph already on the section must be the one this audience belongs
   * under. If the migration's lead has drifted from React's description the
   * pairing is not proven and the port stops rather than guessing. */
  if (txt(section.lead) && txt(section.lead) !== txt(source.purpose.description)) {
    skipped.push(`${slug}: section lead differs from ${exp}.purpose.description`)
    continue
  }

  const audience = list.map((i) => ({ title: txt(i.title), body: txt(i.detail) }))
  if (audience.some((a) => !a.title || !a.body)) {
    skipped.push(`${slug}: an audience row has no title or no detail`)
    continue
  }

  if (JSON.stringify(section.audience) !== JSON.stringify(audience)) {
    section.audience = audience
    added.audience += audience.length
  }
}

/* --- decision / use-case variants --- */
for (const page of doc.pages) {
  for (const section of page.sections ?? []) {
    const from = txt(section.from)
    const source = symbols.get(from)
    if (!source) continue

    const variant = variantOf(source.items)
    if (!variant) continue

    const cards = section.cards
    if (!Array.isArray(cards) || cards.length !== source.items.length) {
      skipped.push(`${page.slug}/${from}: ${cards?.length ?? 0} card(s) vs ${source.items.length} React item(s)`)
      continue
    }

    /* Every string written below already exists on the card. This asserts that
     * before writing, so a manifest edited by hand since the migration is
     * reported rather than silently re-derived from React. */
    const mismatch = []
    cards.forEach((card, i) => {
      const item = source.items[i]
      const title = variant === 'decision' ? txt(item.need) : txt(item.role)
      const body = variant === 'decision'
        ? txt(item.product || item.solution)
        : txt(item.flow || item.detail)
      // The migration wrote need->title, product->body for decisions and
      // role->title, flow->body for use cases. Either half may legitimately be
      // absent from the card; what may NOT happen is the card carrying
      // something else.
      if (txt(card.title) && txt(card.title) !== title && txt(card.title) !== body) {
        mismatch.push(`row ${i + 1} title`)
      }
      if (txt(card.body) && txt(card.body) !== body && txt(card.body) !== title) {
        mismatch.push(`row ${i + 1} body`)
      }
    })

    if (mismatch.length) {
      skipped.push(`${page.slug}/${from}: ${mismatch.join(', ')} disagree with React`)
      continue
    }

    section.variant = variant

    cards.forEach((card, i) => {
      const item = source.items[i]
      if (variant === 'decision') {
        card.need = txt(item.need)
        card.product = txt(item.product || item.solution)
      } else {
        card.role = txt(item.role)
        card.flow = txt(item.flow || item.detail)
      }
    })

    added[variant] += cards.length
  }
}

/* --- `related` from the reviewed component plan ---
 *
 * The plan marks eighteen sections `related`. Only some of them are link rows:
 * the `*_LINKS` sections carry a label and a destination and nothing else,
 * while the `*_RELATED` sections on the five integration pages carry a
 * sentence about each destination — "Kết nối hoạt động nghe gọi với workflow
 * Salesforce" — which is a card, and collapsing it to a pill would delete the
 * sentence. So the variant is decided by whether every row is bodiless, and
 * this branch is AUTHORITATIVE: a section that no longer qualifies has the
 * variant removed rather than left behind by an earlier run.
 */
for (const page of doc.pages) {
  for (const section of page.sections ?? []) {
    const entry = plan.content?.[txt(section.from)]
    const bodiless = Array.isArray(section.cards) && section.cards.length &&
      section.cards.every((c) => !txt(c.body) && txt(c.href) && txt(c.title))

    if (entry?.component === 'related' && bodiless) {
      if (section.variant !== 'related') added.related += 1
      section.variant = 'related'
    } else if (section.variant === 'related') {
      delete section.variant
    }
  }
}

/* ------------------------------------------------------------------- report */
console.log('port-field-kinds-053')
console.log(`  audience rows added  ${added.audience}`)
console.log(`  decision rows marked ${added.decision}`)
console.log(`  usecase rows marked  ${added.usecases}`)
console.log(`  related sections     ${added.related}`)

if (skipped.length) {
  console.log('\n  NOT PORTED:')
  for (const line of skipped) console.log(`    ${line}`)
}

const after = JSON.stringify(doc)
if (after === before) { console.log('\n  nothing to write'); process.exit(0) }
if (CHECK) { console.log('\n--check: not written'); process.exit(1) }

fs.writeFileSync(MANIFEST, JSON.stringify(doc, null, 2) + '\n')
console.log('\n  written')
