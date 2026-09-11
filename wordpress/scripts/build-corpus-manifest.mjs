/**
 * Builds the manifest the corpus migration tool works from.
 *
 * WHY THE TOOL DOES NOT DECIDE ANYTHING FOR ITSELF
 * The admin screen accepts no post id, no URL and no filter from the browser.
 * Everything it may touch is in this file, which ships inside the plugin —
 * so what the tool can do is fixed at build time, reviewable in a diff, and
 * identical on every run. A screen that took ids from a form would be a
 * bulk-edit endpoint with a nonce on it.
 *
 * The hashes here are what a fresh live read is compared against. If an
 * article's body has moved since this was built, the tool skips it as
 * human-edited rather than writing over somebody's work.
 *
 *   node wordpress/scripts/build-corpus-manifest.mjs <dump.sql>
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'dist')
const PLUGIN = path.join(HERE, '..', 'wp-content/plugins/gcalls-core')

const dumpPath = process.argv[2]
if (!dumpPath) {
  console.error('usage: node wordpress/scripts/build-corpus-manifest.mjs <dump.sql>')
  process.exit(2)
}

for (const required of ['media-probe.json', 'storage-forecast.json', 'corpus-audit.json']) {
  if (!fs.existsSync(path.join(OUT, required))) {
    console.error(`missing ${required} — run the audit and probe scripts first`)
    process.exit(2)
  }
}

const probe = JSON.parse(fs.readFileSync(path.join(OUT, 'media-probe.json'), 'utf8'))
const forecast = JSON.parse(fs.readFileSync(path.join(OUT, 'storage-forecast.json'), 'utf8'))
const audit = JSON.parse(fs.readFileSync(path.join(OUT, 'corpus-audit.json'), 'utf8'))
const imageAudit = JSON.parse(fs.readFileSync(path.join(OUT, 'image-audit.json'), 'utf8')).report

const version = fs.readFileSync(path.join(PLUGIN, 'gcalls-core.php'), 'utf8').match(/^const VERSION = '([^']+)';$/m)?.[1] ?? '0.0.0'

/* Files the large-file policy holds back. */
const heldUrls = new Set(forecast.manual_review.map((m) => m.url))

/* url -> what to do with it. */
const media = probe.map((item) => {
  let verdict = item.verdict
  let reason = item.reason

  if (verdict === 'LOCALIZE' && heldUrls.has(item.url)) {
    verdict = 'MANUAL_REVIEW'
    reason = forecast.manual_review.find((m) => m.url === item.url)?.reason ?? 'held by the large-file policy'
  }

  return {
    url: item.url,
    sha256: item.sha256,
    bytes: item.bytes,
    mime: item.real_mime,
    width: item.width,
    height: item.height,
    verdict,
    reason,
    duplicate_of: item.duplicate_of ?? '',
  }
})

const usableUrls = new Set(media.filter((m) => m.verdict === 'LOCALIZE' || m.verdict === 'DEDUPE').map((m) => m.url))

/* -------------------------------------------------------------- articles */

const PROTECTED = new Set(Array.from({ length: 18 }, (_, i) => String(100 + i)))
const ALWAYS_REVIEW = new Set(['267', '342'])
const HUB_ASSIGN = { 324: 'tong-dai-va-call-center' }

const srcsById = new Map(imageAudit.map((a) => [a.id, a.srcs]))

const articles = audit.map((a) => {
  const srcs = srcsById.get(a.id) ?? []
  const rewritable = srcs.filter((s) => usableUrls.has(s))

  let outcome = 'ELIGIBLE'
  let reason = ''

  if (PROTECTED.has(a.id)) {
    outcome = 'PROTECTED_PUBLISH'
    reason = 'published article under editorial edit — never written to'
  } else if (ALWAYS_REVIEW.has(a.id)) {
    outcome = 'MANUAL_REVIEW'
    reason = 'empty body; an editor decides what this article is'
  } else if (rewritable.length === 0 && !(a.id in HUB_ASSIGN)) {
    outcome = 'NO_WORK'
    reason = srcs.length > 0 ? 'every image is unreachable; the drawn cover stands in' : 'no images to rewrite'
  }

  return {
    id: a.id,
    slug: a.slug,
    status: a.status,
    body_sha256: a.body_sha256,
    hub: a.hub,
    assign_hub: HUB_ASSIGN[a.id] ?? '',
    urls: srcs,
    rewritable,
    outcome,
    reason,
  }
})

const manifest = {
  schema: 1,
  generated_at_gmt: new Date().toISOString(),
  built_from: path.basename(dumpPath),
  plugin_version: version,
  policy: {
    protected_ids: [...PROTECTED],
    always_manual_review: [...ALWAYS_REVIEW],
    hub_assignments: HUB_ASSIGN,
    max_auto_bytes: 2 * 1024 * 1024,
    mime_allowlist: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    never_change_status: true,
    never_publish_draft: true,
  },
  forecast: {
    attachments_after_dedupe: media.filter((m) => m.verdict === 'LOCALIZE').length,
    original_bytes: forecast.original_bytes,
    derivative_bytes: forecast.derivative_bytes,
    required_free_bytes: forecast.required_free_bytes,
    worst_case_bytes: forecast.worst_case_bytes,
  },
  media,
  articles,
}

const target = path.join(PLUGIN, 'data/corpus-migration.json')
fs.writeFileSync(target, JSON.stringify(manifest, null, 2) + '\n')

/* --------------------------------------------------------------- report */

const byOutcome = {}
for (const a of articles) byOutcome[a.outcome] = (byOutcome[a.outcome] ?? 0) + 1

const byVerdict = {}
for (const m of media) byVerdict[m.verdict] = (byVerdict[m.verdict] ?? 0) + 1

console.log(`corpus manifest — plugin ${version}\n`)
console.log('articles:')
for (const [k, v] of Object.entries(byOutcome).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`)
console.log('\nmedia:')
for (const [k, v] of Object.entries(byVerdict).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`)

const rewrites = articles.filter((a) => a.outcome === 'ELIGIBLE').reduce((n, a) => n + a.rewritable.length, 0)
console.log(`\nURL rewrites on eligible articles: ${rewrites}`)
console.log(`attachments to create:              ${byVerdict.LOCALIZE ?? 0}`)
console.log(`\nwritten: ${path.relative(path.join(HERE, '..', '..'), target)} (${(fs.statSync(target).size / 1024).toFixed(0)} KB)`)
