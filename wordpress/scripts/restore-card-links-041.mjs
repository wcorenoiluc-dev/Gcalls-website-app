#!/usr/bin/env node
/**
 * GCALLS-041 §2 — restore destinations the export dropped.
 *
 * ONLY where the destination is provable. A card is given an href when its
 * title names a route that exists and answers 200 on the live site. Anything
 * else is left alone and reported: no '#', no invented paths, and nothing
 * pointed at /lien-he/ because it was the nearest page that exists.
 *
 * Informational cards are not touched at all — they are statements, and a
 * statement with a link is a worse defect than one without.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const DATA = path.join(ROOT, 'wordpress/wp-content/plugins/gcalls-core/data/content-pages.json')
const AUDIT = process.env.GCALLS_CARD_AUDIT || '/tmp/card-audit-041.json'
const LIVE = process.env.GCALLS_LIVE_ROUTES

const doc = JSON.parse(fs.readFileSync(DATA, 'utf8'))
const audit = JSON.parse(fs.readFileSync(AUDIT, 'utf8'))
const live = LIVE && fs.existsSync(LIVE)
  ? new Map(JSON.parse(fs.readFileSync(LIVE, 'utf8')).map((r) => [r.route, r.status]))
  : new Map()

if (!live.size) {
  console.error('refusing to run without a live route probe: a destination must be verified, not assumed')
  process.exit(2)
}

const restorable = audit.filter((r) => r.kind === 'navigation' && !r.href && r.proposed && live.get(r.proposed) === 200)
const key = (p, s, i) => `${p}::${s}::${i}`
const want = new Map(restorable.map((r) => [key(r.page, r.section, r.index), r.proposed]))

let applied = 0
for (const page of doc.pages) {
  for (const sec of page.sections ?? []) {
    const heading = (sec.heading ?? '').trim() || '(untitled)'
    for (const [i, card] of (sec.cards ?? []).entries()) {
      const target = want.get(key(page.slug, heading, i))
      if (!target) continue
      if ((card.href ?? '').trim()) continue
      card.href = target
      applied += 1
    }
  }
}

fs.writeFileSync(DATA, `${JSON.stringify(doc, null, 2)}\n`)
console.log(`restored ${applied} navigation destination(s), each verified 200 on live`)

const unresolved = audit.filter((r) => r.kind === 'navigation' && !r.href && !r.proposed)
console.log(`\nleft for an owner decision — no route exists for these titles (${unresolved.length}):`)
for (const r of unresolved) console.log(`  ${r.page.padEnd(14)} ${r.section.slice(0, 20).padEnd(22)} ${r.title}`)
