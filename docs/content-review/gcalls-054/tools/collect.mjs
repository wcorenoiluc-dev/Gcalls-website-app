/**
 * GCALLS-054 demo deployment preflight — READ-ONLY collector.
 *
 * Anonymous only: HTTP headers, WP REST API (published content), and rendered
 * DOM via headless Chrome. NO writes, NO auth, NO form submit, NO cache purge.
 * Target is the confirmed demo host only.
 */
import { chromium } from 'playwright-core'
import { writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

const BASE = 'https://ashernguyenxuanthuy.com'
const OUT = path.resolve(process.argv[2] ?? '.')
const UA = 'Gcalls-054-preflight-readonly'
const H = { 'User-Agent': UA }
await mkdir(OUT, { recursive: true })
await mkdir(path.join(OUT, 'screenshots'), { recursive: true })

const ROUTES = [
  '/', '/san-pham/', '/gcalls-plus-webphone/', '/gcalls-cx/', '/qc-bot-ai/', '/voicebot-ai/',
  '/giai-phap/', '/tong-dai-tich-hop-crm/', '/tong-dai-tich-hop-helpdesk/', '/tong-dai-tich-hop-pos/',
  '/tong-dai-quoc-te/', '/tich-hop/', '/tich-hop/hubspot/', '/tich-hop/salesforce/', '/tich-hop/zoho-crm/',
  '/tich-hop/freshdesk/', '/tich-hop/zendesk/', '/nganh/', '/nganh/tai-chinh/', '/nganh/bao-hiem/',
  '/nganh/bat-dong-san/', '/nganh/giao-duc/', '/nganh/thuong-mai-dien-tu/', '/nganh/bpo/',
  '/tai-nguyen/', '/tai-nguyen/case-studies/', '/tai-nguyen/ebook/', '/tai-nguyen/faq/',
  '/tai-nguyen/glossary/', '/tai-nguyen/guides/', '/cong-ty/', '/cong-ty/khach-hang/', '/cong-ty/doi-tac/',
  '/lien-he/', '/uoc-tinh-chi-phi/', '/bang-gia/', '/referral/',
] // 37 content routes (blog index handled by the blog baseline)

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim()
const sha256 = (s) => createHash('sha256').update(s).digest('hex')

async function getJSON(url) {
  try {
    const r = await fetch(url, { headers: H })
    if (!r.ok) return { _status: r.status }
    return { _status: r.status, _total: r.headers.get('x-wp-total'), _totalPages: r.headers.get('x-wp-totalpages'), data: await r.json() }
  } catch (e) { return { _error: String(e) } }
}

// ---------- 1. Runtime fingerprint (headers + asset ?ver) ----------
const fingerprint = { base: BASE, capturedAt: null, note: 'versions from frontend asset ?ver= and REST; PHP/exact WP need admin' }
{
  const r = await fetch(`${BASE}/`, { headers: H })
  const html = await r.text()
  const hdr = Object.fromEntries([...r.headers.entries()])
  fingerprint.rootStatus = r.status
  fingerprint.headers = {
    server: hdr['server'], xRobots: hdr['x-robots-tag'], contentType: hdr['content-type'],
    xCache: hdr['x-cache'] ?? hdr['x-proxy-cache'] ?? hdr['cf-cache-status'] ?? null,
    age: hdr['age'] ?? null, cacheControl: hdr['cache-control'] ?? null,
    via: hdr['via'] ?? null, cfRay: hdr['cf-ray'] ?? null, altSvc: hdr['alt-svc'] ?? null,
    xPoweredBy: hdr['x-powered-by'] ?? null, setCookiePresent: !!hdr['set-cookie'],
  }
  const gen = html.match(/<meta name="generator" content="([^"]+)"/i)
  fingerprint.generatorMeta = gen ? gen[1] : null
  const vers = {}
  for (const m of html.matchAll(/wp-content\/(plugins|themes)\/([a-z0-9_-]+)\/[^"']*\?ver=([0-9][0-9a-z.\-]*)/gi)) {
    const key = `${m[1]}/${m[2]}`; vers[key] = vers[key] || m[3]
  }
  for (const m of html.matchAll(/wp-includes\/[^"']*\?ver=([0-9][0-9a-z.\-]*)/gi)) {
    vers['wp-includes'] = vers['wp-includes'] || m[1]
  }
  fingerprint.assetVersions = vers
  const plugins = [...new Set([...html.matchAll(/wp-content\/plugins\/([a-z0-9_-]+)\//gi)].map((m) => m[1]))]
  const themes = [...new Set([...html.matchAll(/wp-content\/themes\/([a-z0-9_-]+)\//gi)].map((m) => m[1]))]
  fingerprint.pluginsSeenOnFrontend = plugins.sort()
  fingerprint.themesSeenOnFrontend = themes.sort()
}
// REST site + namespaces
{
  const j = await getJSON(`${BASE}/wp-json/`)
  if (j.data) {
    fingerprint.site = { name: j.data.name, description: j.data.description, url: j.data.url, home: j.data.home, timezone: j.data.timezone_string, gmt_offset: j.data.gmt_offset }
    fingerprint.restNamespaces = j.data.namespaces
    fingerprint.restAuthentication = Object.keys(j.data.authentication || {})
  }
}

// ---------- Cache audit: two consecutive anonymous requests ----------
async function cachePair(route) {
  const grab = async () => {
    const r = await fetch(`${BASE}${route}`, { headers: H, redirect: 'manual' })
    const body = await r.text()
    const nonce = (body.match(/name="_wpnonce" value="([^"]+)"/) || [])[1]
      || (body.match(/"nonce":"([0-9a-f]+)"/) || [])[1] || null
    return { status: r.status, xCache: r.headers.get('x-cache') ?? r.headers.get('cf-cache-status') ?? r.headers.get('x-proxy-cache') ?? null, age: r.headers.get('age'), cacheControl: r.headers.get('cache-control'), setCookie: !!r.headers.get('set-cookie'), nonce, len: body.length }
  }
  const a = await grab(); const b = await grab()
  return { route, first: a, second: b, sameNonce: a.nonce === b.nonce, nonceObserved: a.nonce !== null }
}
const cache = { home: await cachePair('/'), contact: await cachePair('/lien-he/'), withQuery: await cachePair('/lien-he/?utm_test=1') }

// ---------- Blog baseline (published posts, no PII) ----------
const blog = {}
{
  const j = await getJSON(`${BASE}/wp-json/wp/v2/posts?per_page=100&status=publish&_fields=id,slug,status,title,date,modified,featured_media,link`)
  blog.publishedTotalHeader = j._total ?? null
  blog.published = (j.data || []).map((p) => ({ id: p.id, slug: p.slug, status: p.status, title: norm(p.title?.rendered), date: p.date, modified: p.modified, featured_media: p.featured_media, link: p.link }))
  blog.publishedCount = blog.published.length
  // anonymous cannot see drafts; record what the API exposes
  const d = await getJSON(`${BASE}/wp-json/wp/v2/posts?per_page=1&status=draft`)
  blog.draftQueryStatus = d._status ?? (d._error ? 'error' : 'ok')
  blog.draftTotalHeaderAnon = d._total ?? null
  blog.draftNote = 'Draft enumeration requires auth; anonymous REST returns only published. Expected 163 migration drafts to be confirmed by owner in wp-admin.'
}

// ---------- Page status baseline (published pages via REST) ----------
const pages = {}
{
  const j = await getJSON(`${BASE}/wp-json/wp/v2/pages?per_page=100&status=publish&_fields=id,slug,status,link,template,modified,featured_media,parent`)
  pages.total = j._total ?? null
  pages.items = (j.data || []).map((p) => ({ id: p.id, slug: p.slug, status: p.status, link: p.link, template: p.template, modified: p.modified, featured_media: p.featured_media, parent: p.parent }))
}

// ---------- Menus (try anonymously) ----------
const menus = {}
{
  const j = await getJSON(`${BASE}/wp-json/wp/v2/menus?per_page=100`)
  menus.restStatus = j._status ?? (j._error ? 'error' : 'ok')
  menus.data = j.data && Array.isArray(j.data) ? j.data.map((m) => ({ id: m.id, name: m.name, slug: m.slug, locations: m.locations })) : null
  menus.note = menus.restStatus === 200 ? 'menus readable' : 'menus REST not anonymously readable; header/footer nav captured from rendered DOM instead'
}

// ---------- Rendered analysis (Playwright) ----------
const browser = await chromium.launch({ channel: 'chrome', headless: true })
async function analyzeRoute(route, { shots = false } = {}) {
  const rec = { url: `${BASE}${route}` }
  for (const bp of shots ? [1440, 390] : [1440]) {
    const ctx = await browser.newContext({ viewport: { width: bp, height: bp === 1440 ? 900 : 844 }, userAgent: UA })
    const page = await ctx.newPage()
    const errs = []
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
    page.on('pageerror', (e) => errs.push(String(e)))
    let resp
    try { resp = await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 45000 }) } catch (e) { rec.error = String(e); await ctx.close(); return rec }
    await page.waitForTimeout(900)
    const data = await page.evaluate(() => {
      const main = document.querySelector('main, .elementor, #content, body')
      const topSections = document.querySelectorAll('.elementor-top-section, .elementor > .e-con, [data-elementor-type] > .elementor-section, [data-elementor-type] > .e-con').length
      const innerSections = document.querySelectorAll('.elementor-inner-section, .e-con-inner').length
      const widgets = document.querySelectorAll('.elementor-widget').length
      const imgs = Array.from(document.images)
      const bodyText = document.body.innerText || ''
      const shortcodes = (bodyText.match(/\[[a-z][a-z0-9_-]*(?:\s[^\]]*)?\]/gi) || []).length
      return {
        h1Count: document.querySelectorAll('h1').length,
        h1Text: Array.from(document.querySelectorAll('h1')).map((h) => (h.textContent || '').trim().slice(0, 120)),
        topSections, innerSections, widgets,
        wordCount: bodyText.split(/\s+/).filter(Boolean).length,
        shortcodeCount: shortcodes,
        imageCount: imgs.length,
        brokenImages: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
        hasForm: !!document.querySelector('form'),
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        mainText: (document.querySelector('main, .elementor, #content, body')?.innerText || '').replace(/\s+/g, ' ').trim(),
      }
    })
    if (bp === 1440) {
      rec.httpStatus = resp?.status() ?? null
      rec.finalUrl = page.url()
      rec.redirected = page.url() !== `${BASE}${route}`
      rec.h1Count = data.h1Count; rec.h1Text = data.h1Text
      rec.topSections = data.topSections; rec.innerSections = data.innerSections; rec.widgets = data.widgets
      rec.wordCount = data.wordCount; rec.shortcodeCount = data.shortcodeCount
      rec.imageCount = data.imageCount; rec.brokenImages = data.brokenImages
      rec.hasForm = data.hasForm
      rec.overflow1440 = data.horizontalOverflow
      rec.contentHash = sha256(data.mainText).slice(0, 32)
      rec.consoleErrors = errs.length
    } else {
      rec.overflow390 = data.horizontalOverflow
    }
    if (shots) await page.screenshot({ path: path.join(OUT, 'screenshots', `${(route === '/' ? 'home' : route.replace(/\W+/g, '_'))}-${bp}.png`), fullPage: true })
    await ctx.close()
  }
  return rec
}

// homepage with shots
const homepage = await analyzeRoute('/', { shots: true })
// remaining routes (home already done) — screenshots only for home per brief; overflow both bp for all is heavy, do 1440 + 390 overflow quick
const routeBaseline = [homepage]
for (const r of ROUTES.slice(1)) {
  routeBaseline.push(await analyzeRoute(r, { shots: false }))
}
// also capture 390 overflow for all by a light second pass at 390 (status/overflow only)
for (const rec of routeBaseline) {
  const route = rec.url.replace(BASE, '')
  if (rec.overflow390 !== undefined) continue
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA })
  const page = await ctx.newPage()
  try { await page.goto(rec.url, { waitUntil: 'domcontentloaded', timeout: 45000 }); await page.waitForTimeout(500)
    rec.overflow390 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  } catch { rec.overflow390 = null }
  await ctx.close()
}

await browser.close()

// ---------- Write outputs ----------
fingerprint.capturedAt = 'see file mtime'
await writeFile(path.join(OUT, 'runtime-fingerprint.json'), JSON.stringify(fingerprint, null, 2))
await writeFile(path.join(OUT, 'cache-audit-raw.json'), JSON.stringify(cache, null, 2))
await writeFile(path.join(OUT, 'published-18-baseline.json'), JSON.stringify(blog, null, 2))
await writeFile(path.join(OUT, 'draft-count-baseline.json'), JSON.stringify({ publishedCount: blog.publishedCount, draftQueryStatus: blog.draftQueryStatus, draftTotalHeaderAnon: blog.draftTotalHeaderAnon, expectedMigrationDrafts: 163, note: blog.draftNote }, null, 2))
await writeFile(path.join(OUT, 'page-status-baseline.json'), JSON.stringify(pages, null, 2))
await writeFile(path.join(OUT, 'menu-baseline.json'), JSON.stringify(menus, null, 2))
await writeFile(path.join(OUT, 'homepage-baseline.json'), JSON.stringify(homepage, null, 2))
await writeFile(path.join(OUT, 'route-baseline-before.json'), JSON.stringify({ base: BASE, count: routeBaseline.length, routes: routeBaseline }, null, 2))

// summary to stdout
const pass = routeBaseline.filter((r) => r.httpStatus === 200 && r.h1Count === 1 && r.brokenImages === 0 && (r.overflow1440 ?? 0) <= 0)
console.log('FINGERPRINT versions:', JSON.stringify(fingerprint.assetVersions))
console.log('site:', JSON.stringify(fingerprint.site))
console.log('plugins on frontend:', fingerprint.pluginsSeenOnFrontend.join(', '))
console.log('routes:', routeBaseline.length, ' 200+1H1+0broken+0overflow:', pass.length)
console.log('non-200 or multi-H1:', routeBaseline.filter((r) => r.httpStatus !== 200 || r.h1Count !== 1).map((r) => `${r.url.replace(BASE,'')}(${r.httpStatus}/H1=${r.h1Count})`).join(' '))
console.log('published posts:', blog.publishedCount, ' header total:', blog.publishedTotalHeader)
console.log('published pages:', pages.total, ' items:', pages.items.length)
console.log('menus REST:', menus.restStatus)
console.log('homepage: H1=%s sections(top/inner)=%s/%s widgets=%s form=%s', homepage.h1Count, homepage.topSections, homepage.innerSections, homepage.widgets, homepage.hasForm)
console.log('cache home xCache/age/sameNonce:', cache.home.first.xCache, cache.home.first.age, cache.home.sameNonce, 'nonceObserved:', cache.home.nonceObserved)
console.log('cache contact sameNonce/nonceObserved/setCookie:', cache.contact.sameNonce, cache.contact.nonceObserved, cache.contact.first.setCookie)
console.log('DONE')
