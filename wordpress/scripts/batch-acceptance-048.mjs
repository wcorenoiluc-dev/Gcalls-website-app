#!/usr/bin/env node
/**
 * GCALLS — per-batch acceptance gate for the live demo.
 * WORKER D. Read-only against the live site. Never writes to WordPress.
 *
 * WHAT CHANGED AND WHY THIS SCRIPT LOOKS LIKE THIS
 * The original brief assumed each batch CREATES 163 drafts. It does not: all
 * 250 posts are already in the database (18 publish / 230 draft / 2 private /
 * 1 trash). So the operation being gated is one of:
 *   (a) the corpus MEDIA migration — downloads images, rewrites draft bodies;
 *   (b) a selective draft -> publish of an approved batch.
 * Both are "change what is already there" operations, so the gate is a
 * before/after differential, not a creation count.
 *
 * TWO MODES
 *   --capture   Snapshot the live site BEFORE the operation. Writes JSON.
 *   --verify    Snapshot again AFTER and compare. Exits non-zero on failure.
 *
 * Run capture immediately before each batch and verify immediately after.
 * A verify without a --before snapshot still runs every absolute check, but
 * the differential checks (homepage drift, page drift) degrade to comparing
 * against the committed GCALLS-047 reference instead, which is weaker.
 *
 * USAGE
 *   node /tmp/workerD-batch-acceptance.mjs --capture --out /tmp/b01-before.json
 *   ...run the batch...
 *   node /tmp/workerD-batch-acceptance.mjs --verify \
 *        --before /tmp/b01-before.json \
 *        --batch B01 \
 *        --counts all=250,publish=18,draft=230,private=2,trash=1 \
 *        --expect-counts all=250,publish=18,draft=230,private=2,trash=1 \
 *        --out /tmp/b01-after.json
 *
 * --counts is what you READ OFF the WordPress Posts screen after the batch
 * (Tất cả / Đã xuất bản / Bản nháp / Riêng tư / Thùng rác), or the output of
 * the read-only probe in /tmp/workerD-status-probe.php. --expect-counts is
 * what the batch was approved to produce. A media-migration batch expects the
 * counts UNCHANGED. A publish batch expects publish +N and draft -N.
 *
 * EXIT CODES
 *   0  every check passed
 *   1  at least one check FAILED (each printed with what and why)
 *   2  the script could not run (bad arguments, missing reference file)
 */

import fs from 'node:fs'
import crypto from 'node:crypto'

/* ----------------------------------------------------------------- args */

const argv = process.argv.slice(2)
const has = (n) => argv.includes(`--${n}`)
const arg = (n, d = '') => {
  const i = argv.indexOf(`--${n}`)
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d
}

const ORIGIN = arg('origin', process.env.ORIGIN || 'https://ashernguyenxuanthuy.com').replace(/\/$/, '')
const REPO = arg('repo', process.cwd()).replace(/\/$/, '')
const MODE = has('capture') ? 'capture' : has('verify') ? 'verify' : ''
const TIMEOUT = Number(arg('timeout', '45000'))

const REF = {
  /* The 18 published articles, captured before any import work. */
  protected18: arg('baseline', `${REPO}/docs/content-review/gcalls-048/baseline-18-pre-import.json`),
  /* The 37 canonical content pages. */
  inventory37: arg('inventory', `${REPO}/docs/content-review/gcalls-044/inventory-044.json`),
  /* Last accepted live measurement of those 37, used when no --before exists. */
  live047: arg('live047', `${REPO}/docs/content-review/gcalls-047/live-verify-047.json`),
  /* Batch membership + the exclusion lists that must never go public. */
  dryrun: arg('dryrun', `${REPO}/docs/content-review/gcalls-047/blog-dryrun-047.json`),
}

if (!MODE) {
  console.error('ERROR: pass --capture or --verify. See the header of this file.')
  process.exit(2)
}

/* ------------------------------------------------------------- helpers */

const readJson = (p, required = true) => {
  if (!fs.existsSync(p)) {
    if (!required) return null
    console.error(`ERROR: reference file not found: ${p}\n       pass --repo <path to Gcalls-website-app> or the explicit flag.`)
    process.exit(2)
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch (e) {
    console.error(`ERROR: ${p} is not valid JSON: ${e.message}`)
    process.exit(2)
  }
}

const sha = (s) => crypto.createHash('sha256').update(s ?? '').digest('hex')

/* Identical extraction to wordpress/scripts/live-baseline.mjs. Do not "improve"
 * it: the committed baseline hashes were produced by exactly this slice, and a
 * different slice would make every comparison fail for the wrong reason. */
const between = (html, open, close) => {
  const a = html.indexOf(open)
  if (a === -1) return ''
  const b = html.indexOf(close, a + open.length)
  return b === -1 ? '' : html.slice(a + open.length, b)
}

const get = async (url) => {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT) })
    return { ok: true, status: res.status, url: res.url, headers: res.headers, text: await res.text() }
  } catch (e) {
    return { ok: false, status: 0, url, headers: new Headers(), text: '', error: String(e.message).slice(0, 120) }
  }
}

/*
 * A page fingerprint that a deploy cannot move for cosmetic reasons but a
 * content change always moves. Nonces, cache-buster query strings and Elementor
 * per-request ids are stripped first, because they differ on every single
 * request and would make "unchanged" impossible to ever assert.
 */
const fingerprint = (html) => {
  const stable = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/name="_wpnonce"[^>]*value="[^"]*"/g, 'name="_wpnonce"')
    .replace(/"nonce":"[^"]*"/g, '"nonce":""')
    .replace(/\bnonce=[A-Za-z0-9]+/g, 'nonce=')
    .replace(/[?&]ver=[^"'&\s]+/g, '')
    .replace(/\s+/g, ' ')
  return sha(stable)
}

const measure = (html) => {
  const stripped = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')
  const text = stripped.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  return {
    words: text.split(' ').filter(Boolean).length,
    h1: (html.match(/<h1\b/g) || []).length,
    h2: (html.match(/<h2\b/g) || []).length,
    cards: (html.match(/<article class="gcalls-cp__card"/g) || []).length,
    cpSections: (html.match(/class="gcalls-cp__section/g) || []).length,
    images: (html.match(/<img\b/gi) || []).length,
    rawShortcode: (html.match(/\[gcalls_[a-z_]+/g) || []).length,
    phpError: /Fatal error|Warning:|Notice:|Deprecated:/.test(html),
    fingerprint: fingerprint(html),
  }
}

/* ------------------------------------------------------------- snapshot */

async function snapshot () {
  const baseline = readJson(REF.protected18)
  const inventory = readJson(REF.inventory37)

  const snap = {
    kind: 'gcalls-batch-acceptance-snapshot',
    takenAt: new Date().toISOString(),
    origin: ORIGIN,
    articles: [],
    pages: [],
    home: null,
    publishedPosts: null,
    publishedPages: null,
  }

  process.stderr.write('articles ')
  for (const a of baseline) {
    const r = await get(`${ORIGIN}/${a.slug}/`)
    const body = between(r.text, '<div class="gcalls-prose', '</article>')
    snap.articles.push({
      id: a.id,
      slug: a.slug,
      http: r.status,
      finalPath: r.ok ? new URL(r.url).pathname : '',
      title: between(r.text, '<h1', '</h1>').replace(/^[^>]*>/, '').trim(),
      h1_count: (r.text.match(/<h1\b/gi) || []).length,
      modified: (r.text.match(/<time[^>]+class="gcalls-meta__updated"[^>]+datetime="([^"]+)"/i) || [])[1] || '',
      body_bytes: body.length,
      body_sha256: sha(body),
      images: (body.match(/<img\b/gi) || []).length,
      error: r.error || '',
    })
    process.stderr.write(r.status === 200 ? '.' : 'X')
  }

  process.stderr.write('\npages    ')
  for (const row of inventory) {
    const r = await get(ORIGIN + row.path)
    snap.pages.push({
      path: row.path,
      family: row.family,
      http: r.status,
      finalPath: r.ok ? new URL(r.url).pathname : '',
      ...measure(r.text),
      error: r.error || '',
    })
    if (row.path === '/') snap.home = snap.pages[snap.pages.length - 1]
    process.stderr.write(r.status === 200 ? '.' : 'X')
  }

  /* Public REST enumeration. Only published objects are visible here, which is
   * exactly the population that must not grow without approval. */
  process.stderr.write('\nrest     ')
  snap.publishedPosts = await restList('posts')
  snap.publishedPages = await restList('pages')
  process.stderr.write('\n')

  return snap
}

async function restList (type) {
  const out = { total: null, slugs: [], error: '' }
  let page = 1
  let pages = 1
  while (page <= pages && page <= 20) {
    const r = await get(`${ORIGIN}/wp-json/wp/v2/${type}?per_page=100&page=${page}&status=publish&_fields=id,slug,status,modified`)
    if (!r.ok || r.status !== 200) {
      out.error = `HTTP ${r.status}${r.error ? ' ' + r.error : ''}`
      return out
    }
    if (page === 1) {
      out.total = Number(r.headers.get('x-wp-total') || '0')
      pages = Number(r.headers.get('x-wp-totalpages') || '1')
    }
    let rows
    try { rows = JSON.parse(r.text) } catch { out.error = 'REST returned non-JSON'; return out }
    for (const row of rows) out.slugs.push({ id: row.id, slug: row.slug, modified: row.modified })
    page += 1
    process.stderr.write('.')
  }
  return out
}

/* ------------------------------------------------------------- checking */

const failures = []
const passes = []
const warnings = []
const check = (name, ok, detail) => {
  if (ok) passes.push(name)
  else failures.push({ name, detail })
}

function parseCounts (s) {
  if (!s) return null
  const out = {}
  for (const part of s.split(',')) {
    const [k, v] = part.split('=').map((x) => x.trim())
    if (!k) continue
    if (!/^\d+$/.test(v || '')) {
      console.error(`ERROR: --counts/--expect-counts value for "${k}" is not a number: ${v}`)
      process.exit(2)
    }
    out[k.toLowerCase()] = Number(v)
  }
  return out
}

function batchSlugs (dryrun, batchId, legacyIdsRaw) {
  const byLegacy = new Map()
  for (const b of dryrun.proposal.batches) for (const a of b.articles) byLegacy.set(String(a.legacyId), { ...a, batchId: b.batchId })

  if (legacyIdsRaw) {
    const ids = legacyIdsRaw.split(',').map((x) => x.trim()).filter(Boolean)
    const missing = ids.filter((id) => !byLegacy.has(id))
    if (missing.length) {
      console.error(`ERROR: legacy ids not in the approved proposal: ${missing.join(', ')}`)
      process.exit(2)
    }
    return ids.map((id) => byLegacy.get(id))
  }
  if (!batchId) return []
  const b = dryrun.proposal.batches.find((x) => x.batchId === batchId)
  if (!b) {
    console.error(`ERROR: no such batch "${batchId}". Known: ${dryrun.proposal.batches.map((x) => x.batchId).join(', ')}`)
    process.exit(2)
  }
  return b.articles.map((a) => ({ ...a, batchId }))
}

async function verify () {
  const baseline = readJson(REF.protected18)
  const dryrun = readJson(REF.dryrun)
  const live047 = readJson(REF.live047, false)
  const before = arg('before') ? readJson(arg('before')) : null

  if (!before) warnings.push('no --before snapshot: drift checks fall back to the committed GCALLS-047 measurement, which is a weaker reference')

  /* Resolved BEFORE the network work: a mistyped batch id should cost a
   * second, not a full crawl of the site. */
  const approved = batchSlugs(dryrun, arg('batch'), arg('legacy-ids'))
  parseCounts(arg('counts'))
  parseCounts(arg('expect-counts'))

  const after = await snapshot()

  /* ---- CHECK 1. The 18 protected articles are byte-identical. ---- */
  const byBaseSlug = new Map(baseline.map((r) => [r.slug, r]))
  const artProblems = []
  for (const a of after.articles) {
    const b = byBaseSlug.get(a.slug)
    if (!b) { artProblems.push(`${a.slug}: not in the baseline file`); continue }
    if (a.http !== 200) { artProblems.push(`${a.slug}: HTTP ${a.http}${a.error ? ' ' + a.error : ''}`); continue }
    if (a.body_sha256 !== b.body_sha256) {
      artProblems.push(`${a.slug}: body sha256 ${b.body_sha256.slice(0, 12)} -> ${a.body_sha256.slice(0, 12)} (bytes ${b.body_bytes} -> ${a.body_bytes})`)
      continue
    }
    if (a.body_bytes !== b.body_bytes) artProblems.push(`${a.slug}: body bytes ${b.body_bytes} -> ${a.body_bytes} with an equal hash (impossible; check the extractor)`)
    if (a.images !== b.images) artProblems.push(`${a.slug}: image count ${b.images} -> ${a.images}`)
    if (b.modified && a.modified && a.modified !== b.modified) artProblems.push(`${a.slug}: modified ${b.modified} -> ${a.modified}`)
  }
  if (after.articles.length !== baseline.length) artProblems.push(`fetched ${after.articles.length} articles but the baseline has ${baseline.length}`)
  check(`PROTECTED_18_BYTE_IDENTICAL (${baseline.length} articles vs ${REF.protected18.split('/').pop()})`, artProblems.length === 0, artProblems)

  /* ---- CHECK 2. The 37 pages still serve their content. ---- */
  const refPages = new Map()
  if (before) for (const p of before.pages) refPages.set(p.path, p)
  else if (live047) for (const p of live047) refPages.set(p.path, p)

  const pageProblems = []
  for (const p of after.pages) {
    const ref = refPages.get(p.path)
    if (p.http !== 200) { pageProblems.push(`${p.path}: HTTP ${p.http}${p.error ? ' ' + p.error : ''}`); continue }
    if (p.finalPath !== p.path) pageProblems.push(`${p.path}: redirected to ${p.finalPath}`)
    if (p.h1 !== 1) pageProblems.push(`${p.path}: h1 count ${p.h1}, expected 1`)
    if (p.rawShortcode) pageProblems.push(`${p.path}: ${p.rawShortcode} unrendered shortcode(s) in the output`)
    if (p.phpError) pageProblems.push(`${p.path}: PHP error text in the output`)
    if (!ref) { pageProblems.push(`${p.path}: no reference measurement to compare against`); continue }
    const refSections = ref.cpSections ?? ref.renderedSections
    if (typeof refSections === 'number' && p.cpSections < refSections) {
      pageProblems.push(`${p.path}: sections ${refSections} -> ${p.cpSections} (content disappeared)`)
    }
    if (typeof ref.cards === 'number' && p.cards < ref.cards) pageProblems.push(`${p.path}: cards ${ref.cards} -> ${p.cards}`)
    if (typeof ref.words === 'number' && p.words < Math.floor(ref.words * 0.98)) {
      pageProblems.push(`${p.path}: words ${ref.words} -> ${p.words} (>2% loss)`)
    }
  }
  if (after.pages.length !== 37) pageProblems.push(`fetched ${after.pages.length} pages but the inventory declares 37`)
  check(`PAGES_37_STILL_RENDER (vs ${before ? '--before snapshot' : 'live-verify-047.json'})`, pageProblems.length === 0, pageProblems)

  /* ---- CHECK 3. Post counts by status match what the batch was approved to produce. ---- */
  const observed = parseCounts(arg('counts')) || (arg('probe-json') ? countsFromProbe(readJson(arg('probe-json'))) : null)
  const expected = parseCounts(arg('expect-counts'))

  if (!observed || !expected) {
    check('POST_COUNTS_BY_STATUS', false, [
      'not supplied. Post status counts are not public, so this script cannot read them by itself.',
      'Open wp-admin > Bài viết and read the row of links, then pass both:',
      '  --counts all=250,publish=18,draft=230,private=2,trash=1        (what you SEE now)',
      '  --expect-counts all=250,publish=18,draft=230,private=2,trash=1 (what the batch was APPROVED to produce)',
      'For a media-migration batch the two are identical: it changes no status.',
      'Or run /tmp/workerD-status-probe.php and pass --probe-json <its output>.',
      'Pass --allow-missing-counts only if you accept this gate being blind to a status change.',
    ])
  } else {
    const keys = [...new Set([...Object.keys(expected), ...Object.keys(observed)])]
    const diffs = keys.filter((k) => observed[k] !== expected[k])
      .map((k) => `${k}: expected ${expected[k] ?? '(absent)'}, observed ${observed[k] ?? '(absent)'}`)
    check('POST_COUNTS_BY_STATUS', diffs.length === 0, diffs)
  }
  if (has('allow-missing-counts') && !observed) {
    const i = failures.findIndex((f) => f.name === 'POST_COUNTS_BY_STATUS')
    if (i !== -1) { warnings.push('POST_COUNTS_BY_STATUS skipped by --allow-missing-counts'); failures.splice(i, 1) }
  }

  /* ---- CHECK 4. No published post appeared that the batch did not approve. ---- */
  const approvedSlugs = new Set(approved.map((a) => a.slug))
  const baselineSlugs = new Set(baseline.map((r) => r.slug))
  const beforePublished = before?.publishedPosts?.slugs ? new Set(before.publishedPosts.slugs.map((r) => r.slug)) : null

  if (after.publishedPosts.error) {
    check('NO_UNAPPROVED_PUBLISHED_POST', false, [`could not enumerate published posts: ${after.publishedPosts.error}`])
  } else {
    const seen = after.publishedPosts.slugs.map((r) => r.slug)
    const allowed = new Set([...baselineSlugs, ...approvedSlugs, ...(beforePublished || [])])
    const unapproved = seen.filter((s) => !allowed.has(s))
    const vanished = [...baselineSlugs].filter((s) => !seen.includes(s))
    const problems = []
    if (unapproved.length) problems.push(`published but not approved: ${unapproved.join(', ')}`)
    if (vanished.length) problems.push(`a protected article is no longer published: ${vanished.join(', ')}`)
    if (after.publishedPosts.total !== null && after.publishedPosts.total !== seen.length) {
      problems.push(`X-WP-Total says ${after.publishedPosts.total} published posts but ${seen.length} were enumerated`)
    }
    check(`NO_UNAPPROVED_PUBLISHED_POST (${seen.length} published; ${approvedSlugs.size} approved by ${arg('batch') || 'the id list'})`, problems.length === 0, problems)
  }

  /* ---- CHECK 4b. The permanently excluded never become public. ---- */
  const retired = new Set(dryrun.exclusions.retired410.articles.map((a) => a.slug))
  const manual = new Set(dryrun.exclusions.manualDecision.articles.map((a) => a.slug))
  const publicSlugs = new Set((after.publishedPosts.slugs || []).map((r) => r.slug))
  const leaked = [...publicSlugs].filter((s) => retired.has(s) || manual.has(s))
  const inApproved = [...approvedSlugs].filter((s) => retired.has(s) || manual.has(s))
  check(`EXCLUSIONS_STILL_EXCLUDED (${retired.size} RETIRED_410 + ${manual.size} MANUAL_DECISION)`,
    leaked.length === 0 && inApproved.length === 0,
    [
      ...leaked.map((s) => `PUBLISHED an excluded article: ${s}`),
      ...inApproved.map((s) => `the batch itself contains an excluded article: ${s}`),
    ])

  /* ---- CHECK 5. The homepage is unchanged. ---- */
  const homeRef = before?.home || (live047 ? live047.find((r) => r.path === '/') : null)
  const home = after.home
  const homeProblems = []
  if (!home) homeProblems.push('the homepage was not fetched')
  else if (home.http !== 200) homeProblems.push(`HTTP ${home.http}${home.error ? ' ' + home.error : ''}`)
  else if (!homeRef) homeProblems.push('no reference measurement for the homepage')
  else {
    for (const k of ['h1', 'h2', 'cards', 'cpSections']) {
      if (typeof homeRef[k] === 'number' && home[k] !== homeRef[k]) homeProblems.push(`${k}: ${homeRef[k]} -> ${home[k]}`)
    }
    if (typeof homeRef.words === 'number' && Math.abs(home.words - homeRef.words) > Math.ceil(homeRef.words * 0.005)) {
      homeProblems.push(`words: ${homeRef.words} -> ${home.words} (>0.5% change)`)
    }
    if (homeRef.fingerprint && home.fingerprint !== homeRef.fingerprint) {
      homeProblems.push(`markup fingerprint moved: ${homeRef.fingerprint.slice(0, 12)} -> ${home.fingerprint.slice(0, 12)}`)
    }
    if (!homeRef.fingerprint) warnings.push('homepage fingerprint not in the reference (that reference predates this script); only the structural counts were compared')
  }
  check('HOMEPAGE_UNCHANGED', homeProblems.length === 0, homeProblems)

  /* ---- CHECK 6. Published pages did not change in number. ---- */
  if (!after.publishedPages.error) {
    const refTotal = before?.publishedPages?.total
    const problems = []
    if (typeof refTotal === 'number' && after.publishedPages.total !== refTotal) {
      problems.push(`published pages ${refTotal} -> ${after.publishedPages.total}`)
    }
    check('PUBLISHED_PAGE_COUNT_STABLE', problems.length === 0, problems)
  }

  return after
}

function countsFromProbe (probe) {
  if (!probe || typeof probe !== 'object') return null
  const src = probe.counts || probe
  const out = {}
  for (const [k, v] of Object.entries(src)) if (typeof v === 'number') out[k.toLowerCase()] = v
  if (out.publish !== undefined && out.all === undefined) {
    out.all = Object.entries(out).filter(([k]) => k !== 'trash').reduce((s, [, v]) => s + v, 0)
  }
  return Object.keys(out).length ? out : null
}

/* ----------------------------------------------------------------- main */

const OUT = arg('out', MODE === 'capture' ? '/tmp/gcalls-acceptance-before.json' : '/tmp/gcalls-acceptance-after.json')

if (MODE === 'capture') {
  const snap = await snapshot()
  fs.writeFileSync(OUT, JSON.stringify(snap, null, 1))
  const bad = [
    ...snap.articles.filter((a) => a.http !== 200).map((a) => `article ${a.slug} HTTP ${a.http}`),
    ...snap.pages.filter((p) => p.http !== 200).map((p) => `page ${p.path} HTTP ${p.http}`),
    snap.publishedPosts.error ? `REST posts: ${snap.publishedPosts.error}` : '',
  ].filter(Boolean)

  console.log(`\nCAPTURED ${snap.articles.length} articles, ${snap.pages.length} pages, ${snap.publishedPosts.total} published posts -> ${OUT}`)
  if (bad.length) {
    console.error('\nThe site was not healthy at capture time. Fix this BEFORE running the batch,')
    console.error('otherwise the "after" comparison inherits a broken baseline:\n')
    for (const b of bad) console.error(`  - ${b}`)
    process.exit(1)
  }
  console.log('Site healthy at capture time. Safe to run the batch.')
  process.exit(0)
}

const after = await verify()
fs.writeFileSync(OUT, JSON.stringify(after, null, 1))

console.log('\n' + '='.repeat(72))
console.log(`BATCH ACCEPTANCE — ${arg('batch') || arg('legacy-ids') || '(no batch named)'} — ${ORIGIN}`)
console.log('='.repeat(72))
for (const p of passes) console.log(`  PASS  ${p}`)
for (const w of warnings) console.log(`  WARN  ${w}`)
for (const f of failures) {
  console.log(`  FAIL  ${f.name}`)
  for (const d of [].concat(f.detail || [])) console.log(`          ${d}`)
}
console.log('-'.repeat(72))
console.log(`snapshot written to ${OUT}`)

if (failures.length) {
  console.log(`\n${failures.length} CHECK(S) FAILED — DO NOT PROCEED TO THE NEXT BATCH.`)
  console.log('Roll this batch back before doing anything else.')
  process.exit(1)
}
console.log('\nALL CHECKS PASSED.')
process.exit(0)
