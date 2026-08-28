#!/usr/bin/env node
/**
 * Full blog corpus -> WordPress import manifest.
 *
 * Checkpoint GCALLS-WORDPRESS-FULL-BLOG-MIGRATION-004.
 *
 * FOUR SOURCES, ONE DECISION EACH
 *   - the WXR export supplies BODIES, dates, authors, excerpts and legacy meta;
 *   - editorial-master-map.csv supplies the DECISION, the final slug, the title
 *     and the hub;
 *   - editorial-url-plan.csv supplies the redirect type for anything retired or
 *     merged;
 *   - blog-security-incident.csv supplies twenty URLs that must never resolve.
 *
 * They are joined on the legacy post id, and the join is asserted rather than
 * assumed: 263 rows, 263 items, and a mismatch fails the export.
 *
 * THE EXPORT FILE IS NOT IN THIS REPOSITORY, ON PURPOSE
 * It is a 12 MB dump of a site that was serving injected gambling spam. Dumps do
 * not belong in Git (see the `wordpress/` block in .gitignore), and this one
 * least of all. Its path is passed in, and the manifest records its SHA-256 so a
 * later run can prove it read the same file.
 *
 * WHAT IS DELIBERATELY NOT CARRIED OVER
 *   - Authors. The legacy usernames are not WordPress users on the target and
 *     this pipeline does not create users — 003A deleted the original
 *     administrator on purpose, and an importer that silently recreates accounts
 *     undoes that. The legacy name is preserved as post meta instead.
 *   - Featured images. The export is posts-only: it has no `attachment` items,
 *     so `_thumbnail_id` points at attachments that do not exist here. The id is
 *     preserved as a reference and counted as a missing image.
 *   - Yoast fields as Yoast. This site runs Rank Math, so the four fields that
 *     have an equivalent are mapped and the rest are dropped rather than written
 *     into meta nobody reads.
 *
 * Usage:
 *   node wordpress/scripts/export-blog-corpus.mjs --wxr <path> [--out <path>]
 */
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseWxr } from './lib/wxr.mjs'
import { bodyToWp } from './lib/blocks.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.resolve(HERE, '..')
const REPO = path.resolve(WP, '..')
const REVIEW = path.join(REPO, 'docs/content-review/blog')

const EXPECTED_ROWS = 263
const EXPECTED_POSTS = 239
const EXPECTED_RETIRED = 24

const arg = (name, fallback = null) => {
  const index = process.argv.indexOf(`--${name}`)
  return index !== -1 && process.argv[index + 1] ? process.argv[index + 1] : fallback
}

const wxrPath = arg('wxr')
const outPath = path.resolve(arg('out', path.join(REPO, 'wordpress/dist/blog-corpus-manifest.json')))

if (!wxrPath || !fs.existsSync(wxrPath)) {
  console.error('export-blog-corpus: --wxr <path> is required and must exist.')
  console.error('The WordPress export is not kept in this repository; point at your local copy.')
  process.exit(1)
}

/* ------------------------------------------------------------------ *
 * CSV
 * ------------------------------------------------------------------ */

/** RFC4180-ish reader. The editorial CSVs quote Vietnamese prose containing commas. */
function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]

    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"'
        i += 1
      } else if (char === '"') {
        quoted = false
      } else {
        cell += char
      }
      continue
    }

    if (char === '"') { quoted = true; continue }
    if (char === ',') { row.push(cell); cell = ''; continue }
    if (char === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; continue }
    if (char === '\r') continue
    cell += char
  }

  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows
}

function readCsv(file) {
  const rows = parseCsv(fs.readFileSync(path.join(REVIEW, file), 'utf8')).filter((row) => row.length > 1)
  const head = rows[0]
  return rows.slice(1).map((row) => Object.fromEntries(head.map((key, i) => [key, (row[i] ?? '').trim()])))
}

/* ------------------------------------------------------------------ *
 * Sources
 * ------------------------------------------------------------------ */

const xml = fs.readFileSync(wxrPath, 'utf8')
const wxrSha = createHash('sha256').update(xml).digest('hex')
const items = parseWxr(xml)
const byLegacyId = new Map(items.map((item) => [item.postId, item]))

const master = readCsv('editorial-master-map.csv')
const inventory = readCsv('blog-inventory.csv')
const urlPlan = readCsv('editorial-url-plan.csv')
const incident = readCsv('blog-security-incident.csv')

const inventoryById = new Map(inventory.map((row) => [row['Post ID'], row]))
const urlPlanById = new Map(urlPlan.map((row) => [row['Legacy Post ID'], row]))
const masterById = new Map(master.map((row) => [row['Legacy Post ID'], row]))

const problems = []

/**
 * Things worth printing that must NOT stop the run.
 *
 * A problem means "this manifest would damage the site if imported". A warning
 * means "something upstream is incomplete and the export handled it". Two rows
 * of the URL plan have a note where a destination should be; skipping their
 * redirect leaves those URLs 404ing, which is exactly where they already are.
 * Failing the whole corpus for that would block 250 posts over two rules that
 * change nothing.
 */
const warnings = []

if (master.length !== EXPECTED_ROWS) problems.push(`master map has ${master.length} rows, expected ${EXPECTED_ROWS}`)
if (items.length !== EXPECTED_ROWS) problems.push(`WXR has ${items.length} items, expected ${EXPECTED_ROWS}`)

for (const row of master) {
  if (!byLegacyId.has(row['Legacy Post ID'])) {
    problems.push(`master map row ${row['Legacy Post ID']} has no matching WXR item`)
  }
}

/* ------------------------------------------------------------------ *
 * The 18 edited articles
 * ------------------------------------------------------------------ */

/**
 * Batch 1 is authoritative wherever it exists.
 *
 * Seven of the eighteen rewrite a legacy post and appear in the master map;
 * eleven are net-new and appear nowhere in the 263. Both kinds must carry the
 * SAME source id the 003B manifest used, or a re-import creates a second copy of
 * an article somebody has already edited — which is the one outcome this
 * checkpoint names first.
 */
const catalogSrc = fs.readFileSync(path.join(REPO, 'src/data/blog/catalog.ts'), 'utf8')
const { parseBody } = await import(path.join(REPO, 'src/lib/blog/markdown.ts'))

function catalogField(block, key) {
  const match = block.match(new RegExp(`\\b${key}:\\s*(?:\\n\\s*)?'((?:[^'\\\\]|\\\\.)*)'`))
  return match ? match[1].replace(/\\'/g, "'") : null
}

const editedBySlug = new Map()

for (const block of catalogSrc.split(/\n\s*\{\s*\n/).slice(1)) {
  const slug = catalogField(block, 'slug')
  const id = catalogField(block, 'id')
  if (!slug || !id) continue

  const modulePath = path.join(REPO, 'src/data/blog/articles', `${slug}.ts`)
  if (!fs.existsSync(modulePath)) continue

  const body = (await import(modulePath)).article
  if (!body || body.slug !== slug) {
    problems.push(`batch 1 body module mismatch for ${slug}`)
    continue
  }

  editedBySlug.set(slug, {
    id: id.toLowerCase(),
    slug,
    title: catalogField(block, 'title') ?? '',
    excerpt: catalogField(block, 'excerpt') ?? '',
    hub: block.match(/\bhub:\s*'(HUB-\d+)'/)?.[1] ?? null,
    legacyPostId: block.match(/\blegacyPostId:\s*(\d+)/)?.[1] ?? null,
    seo: {
      title: catalogField(block, 'seoTitle') ?? '',
      description: catalogField(block, 'metaDescription') ?? '',
      focus_keyword: catalogField(block, 'primaryKeyword') ?? '',
    },
    content: bodyToWp(parseBody(body.body), body.directAnswer),
    faq: (body.faq ?? []).map((item) => ({ question: String(item.question), answer: String(item.answer) })),
  })
}

if (editedBySlug.size !== 18) problems.push(`expected 18 edited articles, found ${editedBySlug.size}`)

const editedByLegacyId = new Map(
  [...editedBySlug.values()].filter((a) => a.legacyPostId).map((a) => [a.legacyPostId, a]),
)

/* ------------------------------------------------------------------ *
 * Body handling
 * ------------------------------------------------------------------ */

/**
 * Legacy HTML is kept as-is inside one Classic block, not converted to blocks.
 *
 * These 232 bodies are drafts awaiting editorial rework. Converting a decade of
 * hand-built HTML — 118 of them carrying Elementor markup — into block markup
 * would be a lossy guess dressed up as a migration: the editor would inherit
 * mangled layout with no way to see the original. Wrapping the original in a
 * Classic block keeps every byte, renders correctly, and converts to blocks on
 * demand with the editor's own "Convert to blocks" button, which is the tool
 * built for exactly this and which a human can supervise one article at a time.
 *
 * The 18 edited articles do NOT come through here — they are already block
 * markup, authored in the reviewed Markdown.
 */
function legacyBody(html) {
  const trimmed = (html ?? '').trim()
  if (!trimmed) return ''

  // Elementor's own shortcodes reference layouts that do not exist on the new
  // site; left live they render an error box. Neutralised, not deleted, so the
  // editor can still see what was there.
  const neutralised = trimmed.replace(/\[elementor-template([^\]]*)\]/gi, '<!-- elementor-template$1 -->')

  return `<!-- wp:freeform -->\n${neutralised}\n<!-- /wp:freeform -->`
}

/** Yoast keys that Rank Math has an equivalent for. Everything else is dropped. */
function rankMathFromYoast(meta, fallback) {
  const seo = {
    title: meta._yoast_wpseo_title || fallback.title || '',
    description: meta._yoast_wpseo_metadesc || fallback.description || '',
    focus_keyword: meta._yoast_wpseo_focuskw || fallback.focusKeyword || '',
  }

  const canonical = meta._yoast_wpseo_canonical || ''
  if (canonical) seo.canonical = canonical

  return seo
}

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */

const posts = []
const retired = []
const redirects = {}
const counters = {
  sourceRows: master.length,
  publish: 0,
  draft: 0,
  private: 0,
  redirect301: 0,
  gone410: 0,
  missingBody: 0,
  duplicateSlug: 0,
  duplicateCanonical: 0,
  imageReference: 0,
  noImageReference: 0,
  retiredWithoutPath: 0,
  redirectTargetNotAUrl: 0,
  editedFromBatch1: 0,
  legacyBodies: 0,
  netNew: 0,
}

const seenSlug = new Map()
const seenCanonical = new Map()

for (const row of master) {
  const legacyId = row['Legacy Post ID']
  const item = byLegacyId.get(legacyId)
  const decision = row.Decision
  const plan = urlPlanById.get(legacyId)

  if (!item) continue

  /* --- retired: no post, a 410 instead ---------------------------------- */
  if (decision === 'RETIRE_410') {
    // The path comes from the URL PLAN's recorded Legacy URL, never from a
    // slugified title. Post 17846 is why: it is an unpublished draft whose only
    // URL was ever `?p=17846`, and slugifying its title produced the pretty URL
    // of a DIFFERENT retired post (2425). That silently overwrote one 410 with
    // another — 23 entries where there should be 24, pointing one of them at the
    // wrong page.
    const legacyUrl = plan?.['Legacy URL'] ?? ''
    const rawPath = legacyUrl.replace(/^https?:\/\/[^/]+/, '').replace(/#.*$/, '')

    retired.push({
      legacyPostId: legacyId,
      legacyUrl,
      reason: plan?.Reason || 'RETIRE_410',
      // A `?p=<id>` URL has no path to serve a 410 at: WordPress resolved it by
      // id, and once the post does not exist the id resolves to nothing. It is
      // recorded rather than invented so the count stays honest at 24.
      path: /^\/\?/.test(rawPath) || rawPath === '' ? null : `/${rawPath.replace(/^\/|\/$/g, '')}/`,
    })
    continue
  }

  /* --- everything else becomes a post ----------------------------------- */
  const edited = editedByLegacyId.get(legacyId)

  // Requirement 6: keep the old slug unless a URL decision changed it. The
  // master map's Final Slug IS that decision, so it wins where it is set; an
  // empty one means no decision was taken and the legacy slug stands. 32 legacy
  // drafts never had a slug at all, so those fall back to the title.
  // A MERGE_INTO_PRIMARY row is content being folded INTO another post. It must
  // not claim that post's URL — four of the nine collide head-on with their own
  // primary, because the audit records them as `Duplicate Of` each other and the
  // editorial plan gave the primary the shared Final Slug. Left alone, WordPress
  // would quietly append `-2` to whichever it saved second, and which one that
  // is depends on import order.
  //
  // The merge source is still imported: it is a draft an editor has to read in
  // order to fold it in, and dropping it would be the content loss this
  // checkpoint exists to prevent. It just gets a slug that is obviously not a
  // destination, and its old URL 301s to the primary.
  const isMerge = decision === 'MERGE_INTO_PRIMARY'
  const primaryRow = row['Primary Post ID'] ? masterById.get(row['Primary Post ID']) : null
  const preferredSlug = edited?.slug || row['Final Slug'] || item.slug || slugify(item.title)
  const slug = isMerge ? `${preferredSlug}-merge-${legacyId}` : preferredSlug
  const title = edited?.title || row['New Title'] || item.title
  // A merge source has no hub of its own — the editorial map leaves the column
  // blank because the row is not going to be a published article. Inheriting the
  // primary's hub is what puts the draft in front of the editor who owns that
  // hub, instead of leaving nine drafts in a bucket nobody browses.
  const hubSource = row.HUB || (isMerge ? primaryRow?.HUB : '') || ''
  const hub = edited?.hub ?? (hubSource ? hubSource.split(' ')[0] : null)

  const inventoryRow = inventoryById.get(legacyId)
  const seoFallback = {
    title: inventoryRow?.['SEO Title'] ?? '',
    description: inventoryRow?.['Meta Description'] ?? '',
    focusKeyword: row['Primary Keyword'] || inventoryRow?.['Primary Keyword'] || '',
  }

  let status
  let content
  let faq = []

  if (edited) {
    // Requirement 3: the eighteen stay published, with the edited body.
    status = 'publish'
    content = edited.content
    faq = edited.faq
    counters.editedFromBatch1 += 1
  } else {
    // Requirement 4, with one exception the checkpoint asks to be reported
    // rather than flattened: a legacy PRIVATE post stays private. Publishing it
    // would expose something deliberately withheld, and drafting it would lose
    // the distinction.
    status = item.status === 'private' ? 'private' : 'draft'
    content = legacyBody(item.content)
    if (content) counters.legacyBodies += 1
  }

  if (!content) counters.missingBody += 1
  status === 'publish' ? (counters.publish += 1) : status === 'private' ? (counters.private += 1) : (counters.draft += 1)

  const seo = edited ? { ...edited.seo } : rankMathFromYoast(item.meta, seoFallback)

  if (seenSlug.has(slug)) {
    counters.duplicateSlug += 1
    problems.push(`duplicate slug "${slug}": ${seenSlug.get(slug)} and ${legacyId}`)
  }
  seenSlug.set(slug, legacyId)

  // A merge source is a working draft, not a page with a canonical URL. Giving
  // it one would tell search engines two URLs are the same page while the
  // editorial decision is that only one of them should exist at all.
  if (!isMerge) {
    const canonical = seo.canonical || `/${slug}/`

    if (seenCanonical.has(canonical)) {
      counters.duplicateCanonical += 1
      problems.push(`duplicate canonical "${canonical}": ${seenCanonical.get(canonical)} and ${legacyId}`)
    }
    seenCanonical.set(canonical, legacyId)
  }

  const thumbnailId = item.meta._thumbnail_id || ''
  if (thumbnailId) counters.imageReference += 1
  else counters.noImageReference += 1

  if (plan?.Redirect === '301 to primary' && plan['Final URL']) {
    const from = `/${(item.slug || slugify(item.title)).replace(/^\/|\/$/g, '')}/`
    const to = plan['Final URL'].replace(/^https?:\/\/[^/]+/, '').trim()

    // The Final URL column is edited by hand and two rows carry a note rather
    // than a URL — `(primary is draft — slug TBD)`. Emitted verbatim, that
    // became a live 301 pointing at a page that does not exist, which is worse
    // than no redirect: a crawler reads a 301 as a deliberate destination and
    // follows it into a 404.
    if (!/^\/[A-Za-z0-9%._~/-]*$/.test(to)) {
      counters.redirectTargetNotAUrl += 1
      warnings.push(`url plan row ${legacyId}: no redirect emitted — Final URL is not a path (${JSON.stringify(plan['Final URL'])})`)
    } else if (from !== to) {
      redirects[from] = { type: '301', target: to, reason: 'MERGE_INTO_PRIMARY', legacyPostId: legacyId }
      counters.redirect301 += 1
    }
  }

  posts.push({
    id: edited ? edited.id : `legacy-${legacyId}`,
    kind: 'article',
    legacyPostId: Number(legacyId),
    slug,
    title,
    status,
    decision,
    hub,
    excerpt: edited?.excerpt || item.excerpt || '',
    // Preserved verbatim so the archive keeps its real chronology rather than
    // showing 239 posts all published on migration day.
    date: item.postDate || '',
    dateGmt: item.postDateGmt || '',
    legacyAuthor: item.creator || '',
    legacyCategories: item.categories.filter((c) => c.domain === 'category').map((c) => c.slug),
    legacyThumbnailId: thumbnailId ? Number(thumbnailId) : null,
    hasEditedBody: Boolean(edited),
    // Set only on a merge source, so the editor opening this draft can see
    // which post it is meant to be folded into.
    // The PRIMARY's slug, not this row's. They are usually the same string —
    // which is exactly why four of them collided — but the target of a merge is
    // the other post, and saying so explicitly is what makes this field useful
    // to the editor who has to perform the merge.
    mergeIntoSlug: isMerge ? primaryRow?.['Final Slug'] || preferredSlug : null,
    seo,
    faq,
    content,
  })
}

/* --- retired URLs into the redirect map -------------------------------- */

for (const entry of retired) {
  counters.gone410 += 1

  if (!entry.path) {
    counters.retiredWithoutPath += 1
    continue
  }

  if (redirects[entry.path]) {
    problems.push(`two retired posts claim ${entry.path}`)
    continue
  }

  redirects[entry.path] = {
    type: '410',
    reason: entry.reason,
    legacyPostId: entry.legacyPostId,
  }
}

/* --- the eleven net-new Batch 1 articles, which are in no legacy row ----- */

for (const article of editedBySlug.values()) {
  if (article.legacyPostId) continue

  counters.netNew += 1
  counters.publish += 1
  counters.editedFromBatch1 += 1
  counters.noImageReference += 1

  if (seenSlug.has(article.slug)) {
    counters.duplicateSlug += 1
    problems.push(`duplicate slug "${article.slug}" between a legacy row and net-new Batch 1`)
  }
  seenSlug.set(article.slug, article.id)

  posts.push({
    id: article.id,
    kind: 'article',
    legacyPostId: null,
    slug: article.slug,
    title: article.title,
    status: 'publish',
    decision: 'NET_NEW_BATCH_1',
    hub: article.hub,
    excerpt: article.excerpt,
    date: '',
    dateGmt: '',
    legacyAuthor: '',
    legacyCategories: [],
    legacyThumbnailId: null,
    hasEditedBody: true,
    seo: article.seo,
    faq: article.faq,
    content: article.content,
  })
}

/* --- the twenty removed spam URLs -------------------------------------- */

/**
 * These are NOT part of the 263.
 *
 * Their post ids (18048-18223) are all above the export's highest id (17924):
 * they were injected, then removed, before the export was taken. They appear in
 * no editorial row and become no post. They are here because the security
 * record gives every one of them a recommended final status of 410, and a URL
 * that once served gambling spam must not come back as a soft 404 that search
 * engines keep revisiting.
 */
let spamCount = 0

for (const row of incident) {
  const url = row.URL || ''
  const legacyPath = url.replace(/^https?:\/\/[^/]+/, '').replace(/[?#].*$/, '')
  if (!legacyPath || legacyPath === '/') continue

  const normalised = `/${legacyPath.replace(/^\/|\/$/g, '')}/`

  if (redirects[normalised]) continue

  redirects[normalised] = {
    type: '410',
    reason: 'SECURITY_INCIDENT — injected content, removed before export',
    legacyPostId: row['Post ID'] || null,
  }
  spamCount += 1
}

/* ------------------------------------------------------------------ *
 * Verification
 * ------------------------------------------------------------------ */

const retiredCount = retired.length

if (posts.length !== EXPECTED_POSTS + counters.netNew) {
  problems.push(`built ${posts.length} posts, expected ${EXPECTED_POSTS + counters.netNew}`)
}
if (retiredCount !== EXPECTED_RETIRED) {
  problems.push(`built ${retiredCount} retired URLs, expected ${EXPECTED_RETIRED}`)
}
if (counters.editedFromBatch1 !== 18) {
  problems.push(`expected 18 edited articles in the manifest, found ${counters.editedFromBatch1}`)
}

const missingHub = posts.filter((post) => !post.hub)
const unknownHub = posts.filter(
  (post) => post.hub && !/^HUB-(0[1-9]|1[0-3])$/.test(post.hub),
)
if (unknownHub.length) problems.push(`posts with an unrecognised hub id: ${unknownHub.map((p) => p.hub).join(', ')}`)

/* ------------------------------------------------------------------ *
 * Output
 * ------------------------------------------------------------------ */

const manifest = {
  generator: 'wordpress/scripts/export-blog-corpus.mjs',
  checkpoint: 'GCALLS-WORDPRESS-FULL-BLOG-MIGRATION-004',
  source: {
    wxr: path.basename(wxrPath),
    wxrSha256: wxrSha,
    wxrItems: items.length,
    masterMapRows: master.length,
  },
  counts: {
    sourceRows: counters.sourceRows,
    posts: posts.length,
    publish: counters.publish,
    draft: counters.draft,
    private: counters.private,
    retired410: retiredCount,
    securityGone410: spamCount,
    redirect301: counters.redirect301,
    missingBody: counters.missingBody,
    duplicateSlug: counters.duplicateSlug,
    duplicateCanonical: counters.duplicateCanonical,
    // "Missing image" has two distinct meanings here and conflating them would
    // hide the bigger number. No post gets a featured image from this migration:
    // the export is posts-only, so even a reference that exists cannot resolve.
    imageReference: counters.imageReference,
    noImageReference: counters.noImageReference,
    imagesImportable: 0,
    retiredWithoutPath: counters.retiredWithoutPath,
    redirectTargetNotAUrl: counters.redirectTargetNotAUrl,
    editedFromBatch1: counters.editedFromBatch1,
    netNewBatch1: counters.netNew,
    legacyBodies: counters.legacyBodies,
    missingHub: missingHub.length,
  },
  hubs: [...new Set(posts.map((post) => post.hub).filter(Boolean))].sort(),
  articles: posts,
  retired,
  redirects,
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`)

/* ------------------------------------------------------------------ *
 * Dry-run report
 * ------------------------------------------------------------------ */

const line = (label, value) => console.log(`  ${String(label).padEnd(42)}${value}`)

console.log(`FULL BLOG CORPUS — dry run\n`)
console.log(`source: ${path.basename(wxrPath)}`)
console.log(`sha256: ${wxrSha}\n`)

console.log('COUNTS')
line('tổng source (master map rows)', counters.sourceRows)
line('  → thành Post', posts.length)
line('  → 410 (retire)', retiredCount)
console.log('')
line('publish', counters.publish)
line('draft', counters.draft)
line('private', counters.private)
line('redirect 301', counters.redirect301)
line('  Final URL không phải path (bỏ)', counters.redirectTargetNotAUrl)
line('410 (retire)', retiredCount)
line('  trong đó không có path công khai', counters.retiredWithoutPath)
line('410 (spam đã gỡ)', spamCount)
console.log('')
line('thiếu body', counters.missingBody)
line('trùng slug', counters.duplicateSlug)
line('trùng canonical', counters.duplicateCanonical)
line('thiếu hình ảnh (không có tham chiếu)', counters.noImageReference)
line('  có tham chiếu nhưng không giải được', counters.imageReference)
line('  ảnh import được', 0)
line('thiếu HUB', missingHub.length)
console.log('')
line('body đã biên tập (Batch 1)', counters.editedFromBatch1)
line('  trong đó net-new', counters.netNew)
line('body legacy giữ nguyên', counters.legacyBodies)
console.log('')
line('manifest', path.relative(REPO, outPath))
line('manifest bytes', fs.statSync(outPath).size.toLocaleString('en-US'))

if (warnings.length) {
  console.log('\nWARNINGS (không chặn — đã xử lý)')
  for (const warning of warnings) console.log(`  ! ${warning}`)
}

if (problems.length) {
  console.log('\nPROBLEMS')
  for (const problem of problems) console.log(`  - ${problem}`)
  console.log(`\nDRY RUN: FAIL (${problems.length})`)
  process.exit(1)
}

console.log(`\nDRY RUN: PASS${warnings.length ? ` (${warnings.length} cảnh báo)` : ''}`)
