#!/usr/bin/env node
/**
 * GCALLS-047 — lock the expected shape of every content page.
 *
 * WHY THIS FILE EXISTS
 * `content-completeness-test.php` can see that a section is empty, but not that
 * a section is GONE: delete one and everything left is still valid, so the test
 * stays green. This writes down what each page is supposed to contain, so a
 * deletion becomes a diff someone has to justify.
 *
 * It is the same convention `build-homepage-template.mjs` already uses for the
 * home page — "the section COUNT is never a magic number: the QA gate reads
 * this inventory and requires them to agree". Regenerating it is deliberate:
 * run it when you have MEANT to change a page's shape, and review the diff.
 *
 * Usage: node wordpress/scripts/build-content-inventory-047.mjs [--check]
 *   --check  exit non-zero if the manifest disagrees with the stored inventory,
 *            without rewriting it (for CI / pre-release).
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const DATA = path.join(ROOT, 'wordpress/wp-content/plugins/gcalls-core/data')
const MANIFEST = path.join(DATA, 'content-pages.json')
const INVENTORY = path.join(DATA, 'content-inventory.json')

const doc = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
const check = process.argv.includes('--check')

const shape = {}
for (const page of doc.pages) {
  const sections = page.sections ?? []
  shape[page.slug] = {
    sections: sections.length,
    // Headings are recorded too, so a section that is REPLACED rather than
    // removed still shows up as a diff. A count alone would hide that.
    headings: sections.map((s) => (s.heading ?? '').slice(0, 80)),
    faq: (page.faq ?? []).length,
    cta: Boolean(page.cta),
  }
}

const next = {
  note: 'GCALLS-047. The expected shape of every content page. content-completeness-test.php reads this so that DELETING a section fails, not just emptying one. Regenerate deliberately and review the diff.',
  generated_at_gmt: new Date().toISOString(),
  pages: Object.fromEntries(Object.entries(shape).map(([k, v]) => [k, v.sections])),
  detail: shape,
}

if (check) {
  if (!fs.existsSync(INVENTORY)) {
    console.error('no inventory to check against — run without --check first')
    process.exit(2)
  }

  const stored = JSON.parse(fs.readFileSync(INVENTORY, 'utf8'))
  const problems = []

  for (const [slug, want] of Object.entries(stored.pages ?? {})) {
    const have = shape[slug]?.sections
    if (have === undefined) problems.push(`${slug}: page gone (inventory expects ${want} sections)`)
    else if (have !== want) problems.push(`${slug}: ${have} sections, inventory expects ${want}`)
  }

  for (const slug of Object.keys(shape)) {
    if (!(slug in (stored.pages ?? {}))) problems.push(`${slug}: not in the inventory`)
  }

  /* Heading drift: same count, different content. */
  for (const [slug, want] of Object.entries(stored.detail ?? {})) {
    const have = shape[slug]
    if (!have) continue
    const a = (want.headings ?? []).join('|')
    const b = have.headings.join('|')
    if (a !== b) problems.push(`${slug}: section headings changed`)
  }

  if (problems.length) {
    console.error(`content inventory MISMATCH (${problems.length}):`)
    for (const p of problems) console.error(`  ${p}`)
    process.exit(1)
  }

  console.log(`content inventory OK — ${Object.keys(shape).length} pages match`)
  process.exit(0)
}

fs.writeFileSync(INVENTORY, `${JSON.stringify(next, null, 2)}\n`)
const total = Object.values(shape).reduce((n, s) => n + s.sections, 0)
console.log(`locked ${Object.keys(shape).length} pages, ${total} sections → ${path.relative(ROOT, INVENTORY)}`)
