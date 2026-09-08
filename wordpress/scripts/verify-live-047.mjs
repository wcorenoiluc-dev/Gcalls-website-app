#!/usr/bin/env node
/**
 * GCALLS-045 §4 — verify every canonical URL on the demo AFTER deploy.
 *
 * A 200 and a version bump are not evidence that a page has content. Each URL
 * is fetched and judged on what a reader would actually get: one h1, real body
 * text, the destination it claims, no raw shortcode and no PHP error.
 */
import fs from 'node:fs'

const ORIGIN = process.env.ORIGIN || 'https://ashernguyenxuanthuy.com'
const inv = JSON.parse(fs.readFileSync('docs/content-review/gcalls-044/inventory-044.json', 'utf8'))

/*
 * The shells measured 100–122 words before this deploy, and the thinnest real
 * page is well above 600. 400 sits between them, so "has content" cannot be
 * satisfied by chrome alone.
 */
const SHELL_WORDS = 400

/*
 * A word count alone is the wrong instrument, and using it as the pass
 * criterion produced four false failures: /cong-ty/, /tai-nguyen/, /referral/
 * and /lien-he/ are signpost pages — an intro and a short list of destinations
 * — and they are COMPLETE at 235–377 words. Lowering the threshold until they
 * went green would have been fitting the measurement to the answer.
 *
 * So a manifest-driven page is judged on whether it rendered every section its
 * manifest declares. The word count is still reported, because "complete" and
 * "substantial" are different things the reader deserves to see separately.
 */
const manifest = JSON.parse(fs.readFileSync(
  process.env.MANIFEST || 'wordpress/.release-045/gcalls-core/data/content-pages.json', 'utf8'))
const bySlug = new Map(manifest.pages.map((p) => [p.slug, p]))
const slugOf = (path) => path === '/' ? 'trang-chu' : path.replace(/^\/|\/$/g, '').split('/').pop()

const out = []

for (const row of inv) {
  const url = ORIGIN + row.path
  const r = { path: row.path, family: row.family }

  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(45000) })
    const h = await res.text()
    const stripped = h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')
    const text = stripped.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')

    r.status = res.status
    r.finalPath = new URL(res.url).pathname
    r.words = text.split(' ').filter(Boolean).length
    r.h1 = (h.match(/<h1\b/g) || []).length
    r.h2 = (h.match(/<h2\b/g) || []).length
    r.cards = (h.match(/<article class="gcalls-cp__card"/g) || []).length
    r.rawShortcode = (h.match(/\[gcalls_[a-z_]+/g) || []).length
    r.phpError = /Fatal error|Warning:|Notice:/.test(h)
    r.cpSections = (h.match(/class="gcalls-cp__section/g) || []).length
  } catch (e) {
    r.status = 'ERR'
    r.error = String(e.message).slice(0, 60)
  }

  const page = bySlug.get(slugOf(row.path))

  if (page) {
    // Manifest-driven: every declared section must appear, plus the CTA block
    // when the entry has one.
    r.expectedSections = page.sections.length + (page.cta ? 1 : 0)
    r.renderedSections = r.cpSections
    r.hasContent = r.renderedSections >= r.expectedSections
    r.contentBasis = 'manifest sections'
  } else {
    // Not manifest-driven (home, products, estimator): fall back to body text.
    r.hasContent = typeof r.words === 'number' && r.words > SHELL_WORDS
    r.contentBasis = 'word count'
  }

  r.verdict = (r.status === 200 && r.h1 === 1 && r.hasContent &&
    !r.rawShortcode && !r.phpError && r.finalPath === row.path) ? 'LIVE_PASS' : 'FAIL'

  if (r.verdict === 'FAIL') {
    r.why = [
      r.status !== 200 && `http ${r.status}`,
      r.h1 !== 1 && `h1=${r.h1}`,
      !r.hasContent && (r.contentBasis === 'manifest sections'
        ? `rendered ${r.renderedSections}/${r.expectedSections} sections`
        : `only ${r.words} words`),
      r.rawShortcode && 'raw shortcode',
      r.phpError && 'php error',
      r.finalPath && r.finalPath !== row.path && `redirected to ${r.finalPath}`,
    ].filter(Boolean).join(', ')
  }

  out.push(r)
  process.stderr.write(r.verdict === 'LIVE_PASS' ? '.' : 'X')
}

fs.writeFileSync(process.env.OUT || '/tmp/live-verify-045.json', JSON.stringify(out, null, 1))

const pass = out.filter((x) => x.verdict === 'LIVE_PASS').length
console.log(`\n\n${pass}/${out.length} LIVE_PASS\n`)
console.log('URL'.padEnd(32) + 'HTTP'.padStart(5) + 'Words'.padStart(7) + 'H1'.padStart(4) + 'Cards'.padStart(6) + 'Sec'.padStart(5) + '  Verdict')
for (const r of out) {
  console.log(r.path.padEnd(32) + String(r.status).padStart(5) + String(r.words ?? '-').padStart(7) +
    String(r.h1 ?? '-').padStart(4) + String(r.cards ?? '-').padStart(6) + String(r.renderedSections ?? '-').padStart(5) + '  ' + r.verdict + (r.why ? ` (${r.why})` : ''))
}
