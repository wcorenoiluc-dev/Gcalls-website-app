#!/usr/bin/env node
/**
 * GCALLS-WORDPRESS-LIVE-HARDENING-003A — live gate check.
 *
 * Every 003A gate that can be settled from OUTSIDE, over plain HTTPS, with no
 * login. Run it from the laptop after each live step:
 *
 *   node wordpress/scripts/live-003a-verify.mjs
 *   node wordpress/scripts/live-003a-verify.mjs https://other-host.example
 *
 * Exit 0 only when every external gate passes. The gates that genuinely need
 * wp-admin — Site Health, the Elementor editor, blog_public, PHP memory,
 * Site Health's cron report, responsive QA — are listed at the end as NOT
 * CHECKABLE rather than silently omitted, because the point of this file is to
 * be honest about which half of 003A it can actually answer.
 *
 * Nothing here writes to the site. Every request is GET or HEAD.
 */

const BASE = (process.argv[2] ?? 'https://ashernguyenxuanthuy.com').replace(/\/$/, '')
const HOST = new URL(BASE).host
const APEX = HOST.replace(/^www\./, '')

const results = []
const record = (name, pass, detail) => {
  results.push({ name, pass, detail })
  console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
}

/** GET without following redirects, so a Location header stays visible. */
async function get(url, { method = 'GET' } = {}) {
  const response = await fetch(url, { method, redirect: 'manual', headers: { 'User-Agent': 'Gcalls-003A-Verify/1.0' } })
  const body = response.status < 400 || response.status === 401 || response.status === 403
    ? await response.text().catch(() => '')
    : ''
  return { status: response.status, location: response.headers.get('location') ?? '', headers: response.headers, body }
}

const section = (title) => console.log(`\n${title}`)

console.log(`003A LIVE GATES — ${BASE}\n`)

/* ---------------------------------------------------------------- reachability */
section('1. Reachability')
const front = await get(`${BASE}/`)
record('homepage 200', front.status === 200, `got ${front.status}`)
const blog = await get(`${BASE}/blog/`)
record('/blog/ 200', blog.status === 200, `got ${blog.status}`)
const login = await get(`${BASE}/wp-login.php`)
record('wp-login.php reachable', login.status === 200, `got ${login.status}`)
const post = await get(`${BASE}/hello-world/`)
record('permalink /%postname%/ resolves', post.status === 200, `/hello-world/ -> ${post.status}`)

/* ------------------------------------------------------------------ redirects */
section('2. Canonical host and scheme')
const insecure = await get(`http://${APEX}/`)
record('http -> https', insecure.status === 301 && insecure.location.startsWith('https://'), `${insecure.status} ${insecure.location}`)
const www = await get(`https://www.${APEX}/`)
record('www -> non-www', www.status === 301 && !/\/\/www\./.test(www.location), `${www.status} ${www.location}`)

/* -------------------------------------------------------------- front/posts page */
section('3. Reading settings')
// WordPress advertises the queried object as a rel="alternate" JSON link.
const frontLink = /wp-json\/wp\/v2\/pages\/(\d+)/.exec(front.headers.get('link') ?? '')
record('front page is id 13', frontLink?.[1] === '13', frontLink ? `id ${frontLink[1]}` : 'no page link header')
const page16 = await get(`${BASE}/wp-json/wp/v2/pages/16?_fields=id,slug,link`)
let page16Slug = ''
try { page16Slug = JSON.parse(page16.body).slug ?? '' } catch { /* reported below */ }
record('posts page is id 16 (slug "blog")', page16Slug === 'blog', page16Slug || `HTTP ${page16.status}`)

/* ------------------------------------------------------------------------ REST */
section('4. REST')
const restRoot = await get(`${BASE}/wp-json/`)
record('REST root 200', restRoot.status === 200, `got ${restRoot.status}`)
const restUsers = await get(`${BASE}/wp-json/wp/v2/users`)
record('REST users closed to anonymous', restUsers.status === 401, `got ${restUsers.status}`)

/* -------------------------------------------------------- author enumeration */
section('5. Author enumeration (§6 of the runbook)')
for (const id of [1, 2]) {
  const probe = await get(`${BASE}/?author=${id}`)
  const leaks = probe.status >= 300 && probe.status < 400 && /\/author\//.test(probe.location)
  record(
    `?author=${id} does not disclose a username`,
    !leaks && probe.status === 404,
    `${probe.status}${probe.location ? ` -> ${probe.location}` : ''}`,
  )
}
const archive = await get(`${BASE}/author/admin/`)
record('/author/admin/ returns 404', archive.status === 404, `got ${archive.status}`)

const oembed = await get(`${BASE}/wp-json/oembed/1.0/embed?url=${encodeURIComponent(`${BASE}/hello-world/`)}`)
let oembedClean = false
try {
  const data = JSON.parse(oembed.body)
  oembedClean = !('author_name' in data) && !('author_url' in data)
  record('oEmbed carries no author identity', oembedClean, oembedClean ? '' : `author_name=${data.author_name ?? '-'}`)
} catch {
  record('oEmbed carries no author identity', false, `unparseable response (HTTP ${oembed.status})`)
}

/* -------------------------------------------------------------------- noindex */
section('6. Noindex — four layers')
const xRobots = front.headers.get('x-robots-tag') ?? ''
record(
  'X-Robots-Tag has all five directives',
  ['noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex'].every((d) => xRobots.includes(d)),
  xRobots || 'header absent',
)
const metaRobots = /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i.exec(front.body)?.[1] ?? ''
record(
  'HTML meta robots is noindex, nofollow',
  /noindex/i.test(metaRobots) && /nofollow/i.test(metaRobots),
  metaRobots || 'no meta robots tag — check Settings > Reading (blog_public)',
)
const robots = await get(`${BASE}/robots.txt`)
record('robots.txt disallows everything', /User-agent:\s*\*/i.test(robots.body) && /^Disallow:\s*\/\s*$/im.test(robots.body), `HTTP ${robots.status}`)

/* ------------------------------------------------------------------- security */
section('7. Security surface')
const xmlrpc = await get(`${BASE}/xmlrpc.php`)
record('xmlrpc.php blocked', xmlrpc.status === 403 || xmlrpc.status === 404, `got ${xmlrpc.status}`)
const listing = await get(`${BASE}/wp-content/uploads/`)
record('no directory listing on uploads', listing.status !== 200 || !/Index of/i.test(listing.body), `got ${listing.status}`)
const cron = await get(`${BASE}/wp-cron.php?doing_wp_cron`)
record('wp-cron.php still answers (HTTP fallback viable)', cron.status === 200, `got ${cron.status}`)

/* ------------------------------------------------------------ PHP diagnostics */
section('8. PHP output health')
const noticeRe = /(Warning|Notice|Deprecated|Fatal error|Parse error):\s/i
record('homepage carries no PHP warning/fatal', !noticeRe.test(front.body), noticeRe.exec(front.body)?.[0] ?? '')
record('/blog/ carries no PHP warning/fatal', !noticeRe.test(blog.body), noticeRe.exec(blog.body)?.[0] ?? '')

/* --------------------------------------------------------------------- report */
console.log('\nNOT CHECKABLE from outside — needs wp-admin or the panel:')
for (const item of [
  'gcalls_owner login and Administrator role',
  'old admin deleted, content attributed to gcalls_owner',
  'Elementor editor opens on page 13',
  'Rank Math active',
  'Site Health free of scheduled-event errors',
  'system cron actually ran (DISABLE_WP_CRON gate)',
  'WP_MEMORY_LIMIT 256M / PHP memory_limit 512M',
  'installed themes after cleanup',
  'responsive QA at 1440/1024/768/390/320',
]) console.log(`  --    ${item}`)

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} external gates pass`)
if (failed.length) {
  console.log('\nFAILING:')
  for (const f of failed) console.log(`  - ${f.name}${f.detail ? `  (${f.detail})` : ''}`)
}
process.exit(failed.length === 0 ? 0 : 1)
