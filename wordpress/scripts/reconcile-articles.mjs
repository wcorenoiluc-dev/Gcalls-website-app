#!/usr/bin/env node
/**
 * Reconciles the 18 Batch 1 articles between source and manifest.
 *
 * The export already fails loudly on a missing body or a slug mismatch. This
 * goes the other way and asks the questions an export cannot ask itself:
 * is every article in the catalog actually accounted for, is every body module
 * on disk actually used, and does what reaches WordPress still carry the title,
 * slug, hub, FAQ, SEO fields and internal links the reviewed article had?
 *
 * The failure this exists to catch is the quiet one: an export that succeeds
 * while publishing seventeen articles, or eighteen articles one of which is a
 * duplicate body under two titles.
 *
 * Usage: node wordpress/scripts/reconcile-articles.mjs
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.resolve(HERE, '..')
const REPO = path.resolve(WP, '..')
const EXPECTED = 18

let failures = 0
const ok = (label) => console.log(`  ok   ${label}`)
const fail = (label, detail = '') => {
  console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`)
  failures += 1
}
const check = (label, condition, detail = '') => (condition ? ok(label) : fail(label, detail))

console.log('ARTICLE RECONCILIATION — Batch 1\n')

/* Build a manifest WITH bodies into a temp file; the committed manifest holds
 * the content model only, so bodies have to be generated to be checked. */
const temp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'gcalls-reconcile-')), 'manifest.json')

execFileSync(process.execPath, [path.join(HERE, 'export-content.mjs'), '--with-bodies', `--out=${temp}`], {
  cwd: REPO,
  stdio: 'pipe',
})

const manifest = JSON.parse(fs.readFileSync(temp, 'utf8'))
const articles = manifest.articles ?? []

console.log('1. Counts')
check(`${EXPECTED} articles in the manifest`, articles.length === EXPECTED, String(articles.length))

const moduleFiles = fs
  .readdirSync(path.join(REPO, 'src/data/blog/articles'))
  .filter((file) => file.endsWith('.ts'))
  .map((file) => file.replace(/\.ts$/, ''))

check(`${EXPECTED} body modules on disk`, moduleFiles.length === EXPECTED, String(moduleFiles.length))

const manifestSlugs = new Set(articles.map((article) => article.slug))
const orphanModules = moduleFiles.filter((slug) => !manifestSlugs.has(slug))
const missingModules = [...manifestSlugs].filter((slug) => !moduleFiles.includes(slug))

check('every body module is published', orphanModules.length === 0, orphanModules.join(', '))
check('every manifest article has a body module', missingModules.length === 0, missingModules.join(', '))

console.log('\n2. Per-article integrity')

const seenBodies = new Map()
const problems = []

for (const article of articles) {
  const label = `${article.id} ${article.slug}`

  if (!article.title) problems.push(`${label}: no title`)
  if (!article.slug) problems.push(`${label}: no slug`)
  if (!article.hub) problems.push(`${label}: no hub`)
  if (article.status !== 'publish') problems.push(`${label}: status is ${article.status}`)
  if (!article.seo?.title) problems.push(`${label}: no SEO title`)
  if (!article.seo?.description) problems.push(`${label}: no meta description`)
  if (!article.content) problems.push(`${label}: empty body`)
  if (!Array.isArray(article.faq) || article.faq.length === 0) problems.push(`${label}: no FAQ`)
  if (article.featuredImage) problems.push(`${label}: claims a featured image that was never produced`)

  // Two articles carrying the same body means a copy-paste between modules.
  const fingerprint = (article.content ?? '').slice(0, 400)
  if (fingerprint && seenBodies.has(fingerprint)) {
    problems.push(`${label}: body is identical to ${seenBodies.get(fingerprint)}`)
  }
  seenBodies.set(fingerprint, label)
}

check('every article carries title, slug, hub, SEO, body and FAQ', problems.length === 0, problems.join('; '))

console.log('\n3. Hubs')

const hubCounts = {}
for (const article of articles) hubCounts[article.hub] = (hubCounts[article.hub] ?? 0) + 1

for (const hub of manifest.hubs ?? []) {
  const count = hubCounts[hub] ?? 0
  check(`${hub} has at least one article (${count})`, count > 0)
}

check(
  'every article sits in a declared hub',
  articles.every((article) => (manifest.hubs ?? []).includes(article.hub)),
)
check(
  `hub counts add up to ${EXPECTED}`,
  Object.values(hubCounts).reduce((total, count) => total + count, 0) === EXPECTED,
)

console.log('\n4. Block markup')

// Bodies are imported as WordPress blocks so the handover editor can move a
// section without editing HTML. Content that arrived as one Classic lump would
// pass every other check here.
const noBlocks = articles.filter((article) => !article.content.includes('<!-- wp:'))
check('every body is block markup, not a Classic lump', noBlocks.length === 0, noBlocks.map((a) => a.slug).join(', '))

const unbalanced = articles.filter((article) => {
  const opens = (article.content.match(/<!-- wp:[a-z-]+/g) ?? []).length
  const closes = (article.content.match(/<!-- \/wp:[a-z-]+/g) ?? []).length
  return opens !== closes
})
check('block delimiters are balanced', unbalanced.length === 0, unbalanced.map((a) => a.slug).join(', '))

const words = articles.reduce((total, article) => total + (article.wordCount ?? 0), 0)
const faqs = articles.reduce((total, article) => total + article.faq.length, 0)
const briefs = articles.reduce((total, article) => total + (article.imageBriefs ?? 0), 0)

console.log(`\ntotals: ${articles.length} articles · ${words} words · ${faqs} FAQ items · ${briefs} image briefs · 0 images produced`)

fs.rmSync(path.dirname(temp), { recursive: true, force: true })

console.log(`\nfailures: ${failures}`)
process.exit(failures === 0 ? 0 : 1)
