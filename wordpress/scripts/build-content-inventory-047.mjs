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
const IMPORTS = path.join(ROOT, 'wordpress/imports/content-manifest.json')

const doc = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
const check = process.argv.includes('--check')

/*
 * THE SEVEN ROUTES THAT ARE NOT IN content-pages.json, AND WHY.
 *
 * The site has 38 pages; the Content_Pages renderer's table holds 31. The
 * difference is not a gap — each of these seven is rendered by something else —
 * but until now NOTHING said so, which meant a product page dropped from the
 * export would leave 30 in the table and every gate would still be green,
 * because 30 is a perfectly consistent number on its own.
 *
 * So the seven are named, with the renderer that owns each, and the check below
 * requires 31 + 7 to reconcile against the import manifest EXACTLY: no route
 * unaccounted for, no slug here that the site does not have, no slug claimed by
 * both. Moving a page between the two sets is then a diff someone has to
 * justify, which is the same contract the section counts already have.
 */
const OTHER_RENDERERS = {
  'trang-chu': 'Elementor layout — includes/class-home-layout.php',
  'gcalls-plus-webphone': '[gcalls_product_page id=gcalls-plus] — includes/class-shortcodes.php',
  'qc-bot-ai': '[gcalls_product_page id=qa-qc] — includes/class-shortcodes.php',
  'gcalls-cx': '[gcalls_product_page id=cx] — includes/class-shortcodes.php',
  'voicebot-ai': '[gcalls_product_page id=voicebot] — includes/class-shortcodes.php',
  'uoc-tinh-chi-phi': '[gcalls_estimator] — includes/class-shortcodes.php',
  blog: 'posts page — theme home.php',
}

/** Reconciles the two sets against the import manifest. Returns problem lines. */
function reconcile(slugs) {
  if (!fs.existsSync(IMPORTS)) return ['wordpress/imports/content-manifest.json is missing']

  const site = JSON.parse(fs.readFileSync(IMPORTS, 'utf8')).pages ?? []
  const known = new Set(site.map((p) => p.slug))
  const problems = []

  for (const slug of slugs) {
    if (OTHER_RENDERERS[slug]) problems.push(`${slug}: claimed by BOTH the manifest and another renderer`)
    if (!known.has(slug)) problems.push(`${slug}: rendered but not a page of this site`)
  }

  for (const slug of Object.keys(OTHER_RENDERERS)) {
    if (!known.has(slug)) problems.push(`${slug}: named as another renderer's page but not a page of this site`)
  }

  for (const slug of known) {
    if (!slugs.includes(slug) && !OTHER_RENDERERS[slug]) {
      problems.push(`${slug}: a page of this site that NOTHING renders`)
    }
  }

  const total = slugs.length + Object.keys(OTHER_RENDERERS).length
  if (total !== known.size) {
    problems.push(`${slugs.length} manifest + ${Object.keys(OTHER_RENDERERS).length} other = ${total}, site has ${known.size}`)
  }

  return problems
}

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
  /*
   * The whole site, so the PHP suite can check the same reconciliation the Node
   * gate does. content-manifest.json is not packaged, so the number is carried
   * rather than recomputed at test time — and it is locked here only after
   * reconcile() has proved it against that file, slug by slug.
   */
  siteRoutes: JSON.parse(fs.readFileSync(IMPORTS, 'utf8')).pages.length,
  otherRenderers: OTHER_RENDERERS,
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

  problems.push(...reconcile(Object.keys(shape)))

  if (problems.length) {
    console.error(`content inventory MISMATCH (${problems.length}):`)
    for (const p of problems) console.error(`  ${p}`)
    process.exit(1)
  }

  console.log(`content inventory OK — ${Object.keys(shape).length} pages match, ` +
    `+${Object.keys(OTHER_RENDERERS).length} rendered elsewhere = the whole site`)
  process.exit(0)
}

const routeProblems = reconcile(Object.keys(shape))
if (routeProblems.length) {
  console.error(`route reconciliation FAILED (${routeProblems.length}) — refusing to lock:`)
  for (const p of routeProblems) console.error(`  ${p}`)
  process.exit(1)
}

fs.writeFileSync(INVENTORY, `${JSON.stringify(next, null, 2)}\n`)
const total = Object.values(shape).reduce((n, s) => n + s.sections, 0)
console.log(`locked ${Object.keys(shape).length} pages, ${total} sections → ${path.relative(ROOT, INVENTORY)}`)
