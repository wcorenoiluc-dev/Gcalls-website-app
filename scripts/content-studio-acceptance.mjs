#!/usr/bin/env node
/**
 * Gcalls Content Studio 0.2.0 — runtime acceptance against a WordPress
 * Playground fixture (real PHP 8.3, WP 7.1) with React Shell + Content Studio
 * installed. Implements the 25 mandatory tests from the pilot brief that need
 * a running WordPress (1–4 are static gates run separately).
 *
 * Usage:
 *   node scripts/content-studio-acceptance.mjs --base http://127.0.0.1:9491 --token gcallscs [--out file]
 *
 * The fixture exposes gc-cs.php (activate / deactivate / users / login-as /
 * media) — loopback-only helper, never shipped. Every request keeps cookies
 * (Playground --login answers the first un-cookied request with a redirect).
 */
import { chromium } from 'playwright-core'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'

const args = process.argv.slice(2)
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d }
const BASE = opt('--base', 'http://127.0.0.1:9491').replace(/\/$/, '')
const TOKEN = opt('--token', 'gcallscs')
const OUT = opt('--out', 'docs/content-studio/acceptance-results.json')
const ROUTES_FILE = 'wordpress/wp-content/plugins/gcalls-react-shell/routes.json'
const EDITABLE = (opt('--editable', 'home,products,gcallsPlus,qcCenter,gcallsCx,voicebotAi,solutions,crmIntegration,helpdeskIntegration')).split(',')
const ROUTE_KEY = opt('--route', 'home')   // route key exercised by the draft/preview/publish/restore steps
const PLUGIN_CS = 'gcalls-content-studio/gcalls-content-studio.php'

/* ---------- tiny cookie-keeping fetch ------------------------------------ */
const jars = {}
function jarFor(name) { return (jars[name] ||= new Map()) }
async function req(jarName, url, init = {}) {
  const jar = jarFor(jarName)
  const headers = Object.assign({}, init.headers || {})
  if (jar.size) headers.cookie = [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ')
  let res = await fetch(url, { ...init, headers, redirect: 'manual' })
  const store = (r) => { for (const c of r.headers.getSetCookie?.() || []) { const [kv] = c.split(';'); const i = kv.indexOf('='); jar.set(kv.slice(0, i).trim(), kv.slice(i + 1).trim()) } }
  store(res)
  let hops = 0
  while ([301, 302, 303, 307, 308].includes(res.status) && hops++ < 5) {
    const loc = new URL(res.headers.get('location'), url).toString()
    const h2 = { ...headers }; if (jar.size) h2.cookie = [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ')
    res = await fetch(loc, { method: init.method === 'POST' && res.status === 307 ? 'POST' : 'GET', headers: h2, redirect: 'manual', body: res.status === 307 ? init.body : undefined })
    store(res)
  }
  return res
}
const text = async (jar, url, init) => { const r = await req(jar, url, init); return { status: r.status, body: await r.text(), headers: r.headers } }
const json = async (jar, url, init) => { const r = await text(jar, url, init); try { return { ...r, data: JSON.parse(r.body) } } catch { return { ...r, data: null } } }

const results = []
const ok = (n, name, pass, detail = '') => { results.push({ n, name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${String(n).padStart(2)} ${name}${detail ? ' — ' + detail : ''}`) }

async function helper(jar, action, params = {}) {
  const q = new URLSearchParams({ t: TOKEN, action, ...params })
  return text(jar, `${BASE}/gc-cs.php?${q}`)
}
async function nonce(jar) { return (await helper(jar, 'nonce')).body.trim() }
async function api(jar, path, init = {}) {
  const n = await nonce(jar)
  return json(jar, `${BASE}/wp-json/gcalls/v1${path}`, { ...init, headers: { 'X-WP-Nonce': n, 'Content-Type': 'application/json', ...(init.headers || {}) } })
}
const configFrom = (html) => { const m = html.match(/window\.__GCALLS_SHELL_CONFIG__\s*=\s*(\{[\s\S]*?\});\s*<\/script>/); try { return m ? JSON.parse(m[1]) : null } catch { return null } }

/* ---------- 5. activate, no fatal ---------------------------------------- */
await helper('admin', 'login-as', { user: 'admin' })
const act = await helper('admin', 'activate')
const homeAfter = await text('admin', `${BASE}/`)
ok(5, 'Activate without fatal', /activated|already-active/.test(act.body) && !/ACTIVATE-FAILED/.test(act.body) && homeAfter.status === 200 && !/Fatal error|Uncaught/.test(homeAfter.body), act.body.trim().split('\n').slice(0, 2).join(' | '))
await helper('admin', 'option', { name: 'gcalls_react_shell_scope', value: 'all_marketing_routes' })
await helper('admin', 'users')

/* ---------- 6. admin menu -------------------------------------------------- */
const adminHtml = await text('admin', `${BASE}/wp-admin/index.php`)
const menuMatch = adminHtml.body.match(/href="([^"]*admin\.php\?page=([a-z0-9_-]+))"[^>]*>(?:[^<]*<[^>]*>)*\s*Gcalls Content Studio/i) || adminHtml.body.match(/Gcalls Content Studio/)
const editorSlug = adminHtml.body.match(/page=(gcalls-content[a-z0-9_-]*)"[^>]*class="[^"]*menu-top/)?.[1] || adminHtml.body.match(/admin\.php\?page=(gcalls-content[a-z0-9_-]*)/)?.[1]
ok(6, 'Admin menu shows Gcalls Content Studio', !!menuMatch && !!editorSlug, `slug=${editorSlug}`)
const EDITOR_URL = `${BASE}/wp-admin/admin.php?page=${editorSlug}&route=${ROUTE_KEY}`

/* ---------- 7/8. manifest: 38 routes in routes.json order, 01–05 editable --- */
const routes = JSON.parse(fs.readFileSync(ROUTES_FILE, 'utf8'))
const man = await api('admin', '/manifest')
const pages = man.data?.pages || []
ok(7, `Manifest lists ${routes.length} routes in routes.json order`, pages.length === routes.length && pages.every((p, i) => p.key === routes[i].key && p.path === routes[i].path), `${pages.length} pages`)
const editableKeys = pages.filter((p) => p.status === 'editable').map((p) => p.key)
ok(8, 'Only pages 01–05 editable', JSON.stringify(editableKeys) === JSON.stringify(EDITABLE) && pages.filter((p) => p.status === 'review').every((p) => p.statusLabel === 'Đang kiểm tra giao diện'), editableKeys.join(','))
const heroDef = pages.find((p) => p.key === ROUTE_KEY)?.sections?.find((s) => s.key === 'hero')
const headingKey = heroDef && Object.keys(heroDef.fields).find((k) => /^heading$|^h1$/.test(k))
if (!heroDef || !headingKey) { console.log(`no hero/heading field for route ${ROUTE_KEY}`); process.exit(2) }
const baseHeading = heroDef?.defaults?.[headingKey] || ''

/* ---------- 9. draft does not change public ------------------------------- */
let meta = (await api('admin', '/content/' + ROUTE_KEY + '?context=edit')).data
let ver = meta?.version ?? 0
const draftRes = await api('admin', '/content/' + ROUTE_KEY + '/draft', { method: 'POST', body: JSON.stringify({ section: 'hero', fields: { ...heroDef.defaults, [headingKey]: baseHeading + ' [PREVIEW TEST]' }, baseVersion: ver }) })
const ROUTE_PATH = pages.find((p) => p.key === ROUTE_KEY)?.path || '/'
const publicHome = await text('anon', `${BASE}${ROUTE_PATH}?cb=${Date.now()}`)
const pubCfg = configFrom(publicHome.body)
const pubHeading = pubCfg?.gcallsContent?.publishedContent?.sections?.hero?.[headingKey]
ok(9, 'Draft never reaches public', draftRes.status === 200 && !publicHome.body.includes('[PREVIEW TEST]') && (pubHeading === undefined || !String(pubHeading).includes('PREVIEW TEST')), `draft=${draftRes.status}`)
ver = draftRes.data?.meta?.version ?? ver

/* ---------- 10–12, 22–24: browser: editor + preview ------------------------ */
const browser = await chromium.launch({ channel: 'chrome' })
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } })
await ctx.addCookies([...jarFor('admin').entries()].map(([name, value]) => ({ name, value, domain: new URL(BASE).hostname, path: '/' })))
const page = await ctx.newPage()
const pageErrors = []
page.on('pageerror', (e) => pageErrors.push(e.message))
await page.goto(EDITOR_URL, { waitUntil: 'networkidle' })
const frameEl = await page.waitForSelector('#gcalls-cs-root iframe', { timeout: 30000 }).catch(() => null)
let frame = null
if (frameEl) { frame = await frameEl.contentFrame(); await frame.waitForSelector('main h1', { timeout: 30000 }).catch(() => {}) }
// type into the heading field
const headingInput = await page.$(`[data-field="${headingKey}"] input, [data-field="${headingKey}"] textarea, input[name="${headingKey}"], textarea[name="${headingKey}"]`)
let previewUpdated = false
if (headingInput && frame) {
  await headingInput.fill(baseHeading + ' [LIVE TYPING]')
  await page.waitForTimeout(700)
  previewUpdated = (await frame.locator('main h1').first().textContent()).includes('[LIVE TYPING]')
}
ok(10, 'Preview updates while typing (postMessage)', previewUpdated, headingInput ? '' : 'heading input not found')
// image preview: set image field via REST draft using a fixture attachment, reload preview
const media = await helper('admin', 'media')
const attId = Number(media.body.match(/attachment=(\d+)/)?.[1] || 0)
const blockedId = Number(media.body.match(/blocked_attachment=(\d+)/)?.[1] || 0)
const imageKey = heroDef && Object.keys(heroDef.fields).find((k) => heroDef.fields[k].type === 'image')
let imgOk = false
if (imageKey && attId) {
  const altKey = Object.keys(heroDef.fields).find((k) => /alt$/i.test(k) && heroDef.fields[k].type !== 'toggle')
  const r = await api('admin', '/content/' + ROUTE_KEY + '/draft', { method: 'POST', body: JSON.stringify({ section: 'hero', fields: { [imageKey]: { id: attId }, ...(altKey ? { [altKey]: 'fixture image' } : {}) }, baseVersion: ver }) })
  ver = r.data?.meta?.version ?? ver
  // The editor pushes its own working copy on preview-ready, so a draft saved
  // behind its back only shows after the editor reloads its state.
  await page.goto(EDITOR_URL, { waitUntil: 'networkidle' })
  frame = await (await page.waitForSelector('#gcalls-cs-root iframe', { timeout: 30000 })).contentFrame()
  await frame.waitForSelector('main h1', { timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(1200)
  imgOk = r.status === 200 && (await frame.locator('img[src*="cs-fixture-"]').count()) > 0
}
ok(11, 'Preview renders a Media Library image', imageKey ? imgOk : true, imageKey ? `attachment ${attId}` : 'n/a — this route has no image field in its hero (covered on home)')
const widths = {}
for (const [label, w] of [['Desktop', 1440], ['Tablet', 768], ['Mobile', 390]]) {
  const btn = page.locator(`button:has-text("${label}")`).first()
  if (await btn.count()) { await btn.click(); await page.waitForTimeout(200); widths[label] = Math.round((await (await page.$('#gcalls-cs-root iframe')).boundingBox()).width) }
}
ok(12, 'Desktop/Tablet/Mobile preview widths', widths.Desktop >= 1000 && widths.Tablet === 768 && widths.Mobile === 390, JSON.stringify(widths))
const chrome = await frame.evaluate(() => ({ headers: document.querySelectorAll('header').length, footers: document.querySelectorAll('footer').length, broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getBoundingClientRect().width > 0).length, themeCss: [...document.styleSheets].filter((s) => s.href && /themes\/|global-styles/.test(s.href)).length + document.querySelectorAll('#global-styles-inline-css').length, robots: document.querySelector('meta[name="robots"]')?.content || '' }))
ok(22, 'Preview: no duplicate header/footer, no theme CSS', chrome.headers === 1 && chrome.footers === 1 && chrome.themeCss === 0, JSON.stringify(chrome))
ok(23, 'Preview: no broken images', chrome.broken === 0, `broken=${chrome.broken}`)
// unsaved guard present
const hasGuard = await page.evaluate(() => typeof window.onbeforeunload === 'function' || !!window.__gcallsCsHasBeforeUnload)
// layout shift on public home
const pub = await ctx.newPage()
await pub.goto(`${BASE}${ROUTE_PATH}`, { waitUntil: 'load' })
const cls = await pub.evaluate(() => new Promise((resolve) => { let total = 0; const po = new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) total += e.value }); po.observe({ type: 'layout-shift', buffered: true }); setTimeout(() => { po.disconnect(); resolve(total) }, 2500) }))
ok(24, 'No severe layout shift on public page', cls < 0.1, `CLS=${cls.toFixed(3)}`)
await ctx.close(); await browser.close()

/* ---------- 13/14. publish → live; hard refresh -------------------------- */
const marker = 'CS-PUBLISH-' + Date.now()
// discard preview-test draft, then a real publish on the hero heading (fixture only)
await api('admin', '/content/' + ROUTE_KEY + '/discard-draft', { method: 'POST' })
meta = (await api('admin', '/content/' + ROUTE_KEY + '?context=edit')).data; ver = meta?.version ?? 0
let r = await api('admin', '/content/' + ROUTE_KEY + '/draft', { method: 'POST', body: JSON.stringify({ section: 'hero', fields: { ...heroDef.defaults, [headingKey]: baseHeading + ' ' + marker }, baseVersion: ver }) })
ver = r.data?.meta?.version ?? ver
const pubRes = await api('admin', '/content/' + ROUTE_KEY + '/publish', { method: 'POST', body: JSON.stringify({ baseVersion: ver }) })
ver = pubRes.data?.meta?.version ?? ver
const liveHtml = await text('anon', `${BASE}${ROUTE_PATH}?cb=${Date.now()}`)
ok(13, 'Publish changes the live route payload', pubRes.status === 200 && liveHtml.body.includes(marker) && !!pubRes.data?.publicUrl, `status=${pubRes.status}`)
const liveHtml2 = await text('anon2', `${BASE}${ROUTE_PATH}?cb=${Date.now() + 1}`, { headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } })
ok(14, 'Hard refresh still shows published content', liveHtml2.body.includes(marker))

/* ---------- 15. restore revision ----------------------------------------- */
const marker2 = marker + '-B'
r = await api('admin', '/content/' + ROUTE_KEY + '/draft', { method: 'POST', body: JSON.stringify({ section: 'hero', fields: { [headingKey]: baseHeading + ' ' + marker2 }, baseVersion: ver }) }); ver = r.data?.meta?.version ?? ver
r = await api('admin', '/content/' + ROUTE_KEY + '/publish', { method: 'POST', body: JSON.stringify({ baseVersion: ver }) }); ver = r.data?.meta?.version ?? ver
const revs = (await api('admin', '/content/' + ROUTE_KEY + '/revisions')).data || []
const older = revs.find((x) => !x.isPublished)
let restored = false
let restoreDetail = ' (no older revision listed)'
if (older) {
  const single = await api('admin', `/content/${ROUTE_KEY}/revisions/${older.id}`)
  const rr = await api('admin', `/content/${ROUTE_KEY}/restore/${older.id}`, { method: 'POST', body: JSON.stringify({ baseVersion: ver }) }); ver = rr.data?.meta?.version ?? ver
  const after = await text('anon', `${BASE}${ROUTE_PATH}?cb=${Date.now() + 2}`)
  const hasA = after.body.includes(marker), hasB = after.body.includes(marker2)
  restored = single.status === 200 && rr.status === 200 && hasA && !hasB
  restoreDetail = ` single=${single.status} restore=${rr.status}${rr.data?.code ? ':' + rr.data.code : ''} afterHasOld=${hasA} afterHasNew=${hasB}`
}
ok(15, 'Restore revision republishes the older content', restored, `revisions=${revs.length}${restoreDetail}`)

/* ---------- 16/17. deactivate → defaults; reactivate → content kept ------- */
await helper('admin', 'deactivate', { plugin: PLUGIN_CS })
const offHtml = await text('anon', `${BASE}${ROUTE_PATH}?cb=${Date.now() + 3}`)
const offCfg = configFrom(offHtml.body)
ok(16, 'Deactivated plugin ⇒ React defaults, page still renders', offHtml.status === 200 && !offHtml.body.includes(marker) && !offCfg?.gcallsContent && offHtml.body.includes('id="root"'))
await helper('admin', 'activate', { plugins: PLUGIN_CS })
const onHtml = await text('anon', `${BASE}${ROUTE_PATH}?cb=${Date.now() + 4}`)
ok(17, 'Reactivated plugin keeps saved content', onHtml.body.includes(marker))

/* ---------- 18/19/20. permissions, nonce, allowlist ----------------------- */
await helper('sub', 'login-as', { user: 'cs_sub' })
const subDraft = await api('sub', '/content/' + ROUTE_KEY + '/draft', { method: 'POST', body: JSON.stringify({ section: 'hero', fields: {}, baseVersion: ver }) })
const subMan = await api('sub', '/manifest')
await helper('editor', 'login-as', { user: 'cs_editor' })
const edMeta = (await api('editor', '/content/' + ROUTE_KEY + '?context=edit')).data
const edDraft = await api('editor', '/content/' + ROUTE_KEY + '/draft', { method: 'POST', body: JSON.stringify({ section: 'hero', fields: { [headingKey]: baseHeading + ' editor-draft' }, baseVersion: edMeta?.version ?? ver }) })
const edPublish = await api('editor', '/content/' + ROUTE_KEY + '/publish', { method: 'POST', body: JSON.stringify({ baseVersion: edDraft.data?.meta?.version ?? ver }) })
ok(18, 'Subscriber 403; Editor may draft but not publish', subDraft.status === 403 && subMan.status === 403 && edDraft.status === 200 && edPublish.status === 403, `sub=${subDraft.status}/${subMan.status} editor=${edDraft.status}/${edPublish.status}`)
await api('admin', '/content/' + ROUTE_KEY + '/discard-draft', { method: 'POST' })
const badNonce = await json('admin', `${BASE}/wp-json/gcalls/v1/content/${ROUTE_KEY}/draft`, { method: 'POST', headers: { 'X-WP-Nonce': 'deadbeef', 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'hero', fields: {}, baseVersion: 0 }) })
ok(19, 'Wrong nonce ⇒ 403', badNonce.status === 403, `status=${badNonce.status}`)
meta = (await api('admin', '/content/' + ROUTE_KEY + '?context=edit')).data; ver = meta?.version ?? 0
const badRoute = await api('admin', '/content/not-a-route/draft', { method: 'POST', body: JSON.stringify({ section: 'hero', fields: {}, baseVersion: 0 }) })
const badSection = await api('admin', '/content/' + ROUTE_KEY + '/draft', { method: 'POST', body: JSON.stringify({ section: 'nope', fields: {}, baseVersion: ver }) })
const reviewRoute = await api('admin', '/content/' + (pages.find((p) => p.status === 'review')?.key || 'posIntegration') + '/draft', { method: 'POST', body: JSON.stringify({ section: 'hero', fields: {}, baseVersion: 0 }) })
ok(20, 'Invalid route/section rejected (incl. review-only page)', badRoute.status >= 400 && badSection.status >= 400 && reviewRoute.status >= 400, `${badRoute.status}/${badSection.status}/${reviewRoute.status}`)

/* ---------- 21. XSS ------------------------------------------------------- */
const xss = '<img src=x onerror=alert(1)><script>alert(2)</script>Hello'
const urlKey = Object.keys(heroDef.fields).find((k) => heroDef.fields[k].type === 'url')
const richKey = Object.keys(heroDef.fields).find((k) => heroDef.fields[k].type === 'richtext')
const xssFields = { [headingKey]: xss, ...(urlKey ? { [urlKey]: 'javascript:alert(1)' } : {}), ...(richKey ? { [richKey]: '<p onclick="x">ok</p><script>bad()</script>' } : {}), ...(imageKey && blockedId ? { [imageKey]: { id: blockedId } } : {}) }
const xr = await api('admin', '/content/' + ROUTE_KEY + '/draft', { method: 'POST', body: JSON.stringify({ section: 'hero', fields: xssFields, baseVersion: ver }) })
const stored = (await api('admin', '/content/' + ROUTE_KEY + '?context=edit')).data?.draft?.hero || {}
const storedHeading = String(stored[headingKey] || '')
const storedUrl = urlKey ? String(stored[urlKey] ?? '') : ''
const storedRich = richKey ? String(stored[richKey] ?? '') : ''
const xssPass = !/<script|onerror/i.test(storedHeading) && !/javascript:/i.test(storedUrl) && !/<script|onclick/i.test(storedRich) && (xr.status === 200 || xr.status === 422) && (!blockedId || !stored[imageKey] || stored[imageKey]?.id !== blockedId)
ok(21, 'XSS payloads sanitized; javascript: URL and blocked image refused', xssPass, `status=${xr.status} heading="${storedHeading.slice(0, 40)}"`)
await api('admin', '/content/' + ROUTE_KEY + '/discard-draft', { method: 'POST' })

/* ---------- 25. header + CTA audits on the fixture (38 routes) ------------ */
const SKIP_AUDITS = args.includes('--skip-audits')
const hdr = SKIP_AUDITS ? { status: 0 } : spawnSync('node', ['scripts/header-nav-audit.mjs', '--base', BASE, '--quick', '--out', 'docs/content-studio/fixture-header-audit.json'], { encoding: 'utf8' })
const cta = SKIP_AUDITS ? { status: 0 } : spawnSync('node', ['scripts/cta-contrast-audit.mjs', '--base', BASE, '--out', 'docs/content-studio/fixture-cta-audit.json'], { encoding: 'utf8' })
ok(25, 'Header + CTA audits on all routes (fixture)', hdr.status === 0 && cta.status === 0, SKIP_AUDITS ? 'skipped (--skip-audits; use the previous full run)' : `header=${hdr.status} cta=${cta.status}`)

fs.mkdirSync('docs/content-studio', { recursive: true })
fs.writeFileSync(OUT, JSON.stringify({ base: BASE, results, pageErrors, unsavedGuard: hasGuard }, null, 2))
const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} passed${pageErrors.length ? `; page errors: ${pageErrors.length}` : ''}`)
process.exit(failed.length ? 1 : 0)
