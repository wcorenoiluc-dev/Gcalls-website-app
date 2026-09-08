#!/usr/bin/env node
/**
 * GCALLS-053 F3 — restore the card fields the Industries and Resources hubs lost.
 *
 * WHAT THIS DOES, AND WHAT IT DELIBERATELY DOES NOT
 * ---------------------------------------------------------------------------
 * /nganh/ and /tai-nguyen/ ship six cards each that carry only a title, a body
 * and an href. Their React V2 counterparts carry two more things per card: the
 * labels describing what the card covers, and the card's own call to action.
 * Both were dropped on the way into the manifest, so every card linked out with
 * a generic "Tìm hiểu thêm" and the Resources hub lost the status that says
 * whether a category has anything published in it at all.
 *
 * This ENRICHES, it does not overwrite. No title, body, href, heading, hero or
 * slug is touched, because those are locked copy — and on these two pages they
 * come from a DIFFERENT approved source than the React hub does:
 *
 *   WordPress /nganh/      <- src/data/industries/index.ts (INDUSTRIES)
 *   React     hub cards    <- src/data/hubs.ts (INDUSTRIES_HUB)
 *
 * The two sources agree on the six titles and their order but not on the prose,
 * so the prose is left exactly as approved and only the additive fields are
 * taken across. Cards are matched by exact title; an unmatched title is a fatal
 * error rather than a silent skip, because a silent skip is how the fields went
 * missing in the first place.
 *
 * /cong-ty/ is NOT touched. Its two cards are the child-route links; the React
 * company hub's three cards are principles pointing at other pages entirely.
 * That is new copy, not a dropped field, so it needs owner approval rather than
 * a porting script.
 *
 * Run: node wordpress/scripts/port-hubs-053.mjs [--check]
 *   --check  report what would change and exit non-zero if anything would.
 */
import esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import Module from 'node:module'

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const MANIFEST = path.join(REPO, 'wordpress/wp-content/plugins/gcalls-core/data/content-pages.json')
const CHECK = process.argv.includes('--check')
const die = (m) => { console.error(`FATAL: ${m}`); process.exit(2) }

/* Load the React hub data as data, so the copy is verbatim by construction
 * rather than transcribed by hand. */
const bundled = esbuild.buildSync({
  entryPoints: [path.join(REPO, 'src/data/hubs.ts')],
  bundle: true, format: 'cjs', write: false, platform: 'node',
  loader: { '.ts': 'ts' }, logLevel: 'silent',
  alias: { '@': path.join(REPO, 'src') },
}).outputFiles[0].text
const mod = new Module('hubs')
mod._compile(bundled, path.join(REPO, 'src/data/hubs.js'))
const HUBS = mod.exports

const PORTS = [
  { slug: 'nganh', hub: 'INDUSTRIES_HUB', sectionFrom: 'industries/index — hub', expect: 6 },
  { slug: 'tai-nguyen', hub: 'RESOURCES_HUB', sectionFrom: 'resources/index — RESOURCE_NAV', expect: 6 },
]

const doc = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
const changes = []
const withheld = []

for (const port of PORTS) {
  const hub = HUBS[port.hub]
  if (!hub) die(`${port.hub} not exported from src/data/hubs.ts`)

  const page = doc.pages.find((p) => p.slug === port.slug)
  if (!page) die(`manifest has no page "${port.slug}"`)

  const section = (page.sections ?? []).find((s) => s.from === port.sectionFrom)
  if (!section) die(`${port.slug}: no section with from="${port.sectionFrom}"`)

  const items = hub.cards?.items ?? []
  if (items.length !== port.expect) die(`${port.hub} has ${items.length} cards, locked contract is ${port.expect}`)
  if ((section.cards ?? []).length !== port.expect) {
    die(`${port.slug} manifest has ${(section.cards ?? []).length} cards, locked contract is ${port.expect}`)
  }

  const byTitle = new Map(items.map((i) => [i.title, i]))

  /**
   * ONE STATUS IS NOT PORTED, ON PURPOSE.
   *
   * RESOURCES_HUB tags the Blog card "Chưa có bài viết". In WordPress that is
   * simply false: /blog/ is the posts page for eighteen published articles.
   * Porting it would put a demonstrably untrue statement on a live page, and
   * "the React source said so" is not a defence when the two sites hold
   * different content.
   *
   * The card keeps its CTA and its approved body. Only the status claim is
   * withheld, and it is withheld loudly rather than quietly dropped — which is
   * the failure this whole task exists to undo.
   */
  const SKIP_TAGS = new Map([
    ['tai-nguyen::Blog', 'WordPress /blog/ holds 18 published articles; "Chưa có bài viết" would be false there'],
  ])

  for (const card of section.cards) {
    const src = byTitle.get(card.title)
    if (!src) die(`${port.slug}: manifest card "${card.title}" has no counterpart in ${port.hub} — refusing to guess`)

    /* Tags. On Industries these name the products that usually suit the
     * context; on Resources they are the publication status of the category. */
    const tags = Array.isArray(src.points)
      ? src.points.map(String).map((t) => t.trim()).filter(Boolean)
      : []
    const skipReason = SKIP_TAGS.get(`${port.slug}::${card.title}`)

    if (skipReason) {
      withheld.push(`${port.slug}/${card.title}: tags NOT ported — ${skipReason}`)
    } else if (tags.length && JSON.stringify(card.tags ?? null) !== JSON.stringify(tags)) {
      changes.push(`${port.slug}/${card.title}: tags -> ${JSON.stringify(tags)}`)
      card.tags = tags
    }

    /* The card's own CTA text, so the link stops saying "Tìm hiểu thêm". */
    const cta = typeof src.cta === 'string' ? src.cta.trim() : ''
    if (cta && card.cta !== cta) {
      changes.push(`${port.slug}/${card.title}: cta -> "${cta}"`)
      card.cta = cta
    }

    /* The href must already agree; a mismatch means the two sources have
     * diverged on routing and that is not something to silently reconcile. */
    if (src.path && card.href && src.path !== card.href) {
      die(`${port.slug}: "${card.title}" routes to ${card.href} in the manifest but ${src.path} in ${port.hub}`)
    }
  }

  /* The section note — on Industries it is the claim guard saying the product
   * labels are not a mandatory configuration. */
  const note = typeof hub.cards?.note === 'string' ? hub.cards.note.trim() : ''
  if (note && (section.note ?? '') !== note) {
    changes.push(`${port.slug}: section note -> "${note.slice(0, 60)}…"`)
    section.note = note
  }
}

/* Contract guards the brief names explicitly. */
const nganh = doc.pages.find((p) => p.slug === 'nganh')
const nganhCards = nganh.sections.find((s) => s.from === 'industries/index — hub').cards
if (nganhCards.length !== 6) die(`/nganh/ must have exactly 6 cards, has ${nganhCards.length}`)
const voicebotTag = nganhCards.flatMap((c) => c.tags ?? []).find((t) => /voicebot/i.test(t))
if (voicebotTag) die(`/nganh/ carries a Voicebot tag ("${voicebotTag}") — Voicebot is a solution, not an industry product label`)
const resources = doc.pages.find((p) => p.slug === 'tai-nguyen')
const resCards = resources.sections.find((s) => s.from === 'resources/index — RESOURCE_NAV').cards
if (resCards.length !== 6) die(`/tai-nguyen/ must have exactly 6 cards, has ${resCards.length}`)

for (const w of withheld) console.log(`  withheld  ${w}`)

if (!changes.length) {
  console.log('port-hubs-053: nothing to change — manifest already carries every field')
  process.exit(0)
}

if (CHECK) {
  console.log(`port-hubs-053 --check: ${changes.length} field(s) would change:`)
  for (const c of changes) console.log(`  ${c}`)
  process.exit(1)
}

fs.writeFileSync(MANIFEST, JSON.stringify(doc, null, 2) + '\n')
console.log(`port-hubs-053: ${changes.length} field(s) restored`)
for (const c of changes) console.log(`  ${c}`)
