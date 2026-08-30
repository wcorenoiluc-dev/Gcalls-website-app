/*
 * Completeness check: every approved export must be either MAPPED into the
 * manifest or explicitly EXCLUDED with a reason.
 *
 * Without this, a mapper that misses an export produces a page that looks fine
 * and is quietly missing a section — which is exactly what happened on
 * /tong-dai-quoc-te/, whose data file names its sections differently from the
 * CRM one.
 */
import fs from 'node:fs'

const EXTRACT = 'wordpress/content/extracted'
const MANIFEST = 'wordpress/wp-content/plugins/gcalls-core/data/content-pages.json'

/* Exports that are deliberately not page sections. */
const EXCLUDE = {
  _LEAD: 'CTA attribution, carried on the cta not as a section',
  _ESTIMATOR_HREF: 'link target used by a CTA',
  _PLATFORM_NOTE: 'rendered inside the platforms section',
  _PLATFORM_SECTION: 'heading for the platforms section',
  _FAQ: 'rendered as the faq block',
  _FINAL_CTA: 'rendered as the cta block',
  _HERO: 'rendered as the hero block',
  _PRICING: 'pricing lives on /bang-gia/ — cross-page, not duplicated here',
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
const byslug = Object.fromEntries(manifest.pages.map((p) => [p.slug, p]))

let problems = 0

for (const file of fs.readdirSync(EXTRACT).filter((f) => f.endsWith('.json') && !f.startsWith('_'))) {
  const src = JSON.parse(fs.readFileSync(`${EXTRACT}/${file}`, 'utf8'))
  const page = byslug[src.slug]
  if (!page) continue

  const mapped = new Set(page.sections.map((s) => s.from))
  const rows = []

  for (const key of Object.keys(src.exports)) {
    const name = key.split('::')[1]
    const suffix = '_' + name.split('_').slice(1).join('_')
    const excluded = Object.keys(EXCLUDE).find((e) => name.endsWith(e))
    const isMapped = [...mapped].some((m) => name.endsWith(m))
    rows.push({ name, status: isMapped ? 'MAPPED' : excluded ? 'EXCLUDED' : 'ORPHAN', why: excluded ? EXCLUDE[excluded] : '' })
  }

  const orphans = rows.filter((r) => r.status === 'ORPHAN')
  console.log(`\n${src.slug}  (${rows.length} exports)`)
  console.log(`  mapped=${rows.filter((r) => r.status === 'MAPPED').length} excluded=${rows.filter((r) => r.status === 'EXCLUDED').length} orphan=${orphans.length}`)
  for (const o of orphans) console.log(`    ORPHAN  ${o.name}`)
  problems += orphans.length
}

console.log(`\n${problems === 0 ? 'COMPLETE — no orphan content' : `INCOMPLETE — ${problems} orphan export(s)`}`)
process.exitCode = problems ? 1 : 0
