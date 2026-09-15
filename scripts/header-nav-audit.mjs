#!/usr/bin/env node
/**
 * Header / navigation regression audit (React Shell 0.3.4).
 *
 * Reads the canonical route list from routes.json at run time (never a
 * hard-coded count) and, at 1440 / 1024 / 768 / 390 px, asserts:
 *
 *  desktop (>= 768):
 *   - exactly one <header>, one official logo, six top-level menu buttons;
 *   - a real pointer click (hover → down → up) opens a NON-EMPTY panel;
 *   - aria-expanded mirrors state; aria-controls targets a unique element;
 *   - only one panel open at a time; outside click closes; Escape closes and
 *     returns focus; ArrowDown opens and focuses the first link; Tab walks
 *     into the panel; the open button is visually highlighted;
 *   - the panel is not clipped (fully inside the viewport, above content);
 *  mobile (< 768):
 *   - desktop nav hidden, hamburger visible, drawer opens, six accordions
 *     with aria-expanded/aria-controls, links >= 44px, CTA visible, body
 *     scroll locked only while open, Escape closes;
 *  every viewport / every route:
 *   - no horizontal overflow, header CTA foreground is white, logo count 1.
 *  link audit: every href in desktop menus + mobile drawer is a canonical
 *  route and navigating to it does not render the 404 page.
 *
 * Usage:
 *   node scripts/header-nav-audit.mjs --serve              # vite preview ./dist
 *   node scripts/header-nav-audit.mjs --base https://ashernguyenxuanthuy.com
 *   flags: --out <file>  --routes <n>  --vp <name>  --quick (interaction checks on "/" only)
 */
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
import fs from 'node:fs'

const args = process.argv.slice(2)
const flag = (n) => args.includes(n)
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d }

const ROUTES_FILE = 'wordpress/wp-content/plugins/gcalls-react-shell/routes.json'
const OUT = opt('--out', 'scripts/header-nav-results.json')
const SERVE = flag('--serve')
const QUICK = flag('--quick')
const PORT = 4174
const BASE = opt('--base', `http://localhost:${PORT}`).replace(/\/$/, '')
const LIMIT = Number(opt('--routes', 0)) || 0
const ONLY_VP = opt('--vp', '')
const EXPECTED_GROUPS = ['Sản phẩm', 'Giải pháp', 'Tích hợp', 'Theo ngành', 'Tài nguyên', 'Bảng giá']
const VIEWPORTS = [
  { name: 'desktop_1440', width: 1440, height: 900, mobile: false },
  { name: 'desktop_1024', width: 1024, height: 768, mobile: false },
  { name: 'tablet_768', width: 768, height: 1024, mobile: false },
  { name: 'mobile_390', width: 390, height: 844, mobile: true },
]

const canonical = JSON.parse(fs.readFileSync(ROUTES_FILE, 'utf8')).map((r) => r.path)
const CANONICAL_ROUTE_COUNT = canonical.length
let routes = LIMIT ? canonical.slice(0, LIMIT) : canonical
const norm = (p) => (p.endsWith('/') ? p : p + '/')

let server
if (SERVE) {
  server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
  const deadline = Date.now() + 30000
  while (Date.now() < deadline) {
    try { const r = await fetch(BASE + '/'); if (r.ok) break } catch {}
    await new Promise((r) => setTimeout(r, 300))
  }
}

const failures = []
const fail = (scope, msg) => { failures.push(`${scope}: ${msg}`); console.log('  FAIL', scope, '-', msg) }

const BTN = 'header nav[data-gcalls-desktop-nav] button[aria-haspopup]'

/* in-page helpers */
const pageState = () => {
  const header = document.querySelectorAll('header')
  const logo = document.querySelectorAll('header img[alt="Gcalls"]')
  const cta = document.querySelector('header a[data-gcalls-button][data-variant="primary"]')
  const ctaCs = cta ? getComputedStyle(cta) : null
  const fill = ctaCs && ctaCs.webkitTextFillColor
  const ctaFg = ctaCs ? (fill && fill !== ctaCs.color ? fill : ctaCs.color) : null
  const ctaVisible = cta && cta.getBoundingClientRect().width > 0
  const headerCs = header[0] ? getComputedStyle(header[0]) : null
  return {
    headers: header.length,
    logos: logo.length,
    ctaFg,
    ctaVisible: !!ctaVisible,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    headerPosition: headerCs?.position,
    headerTop: header[0]?.getBoundingClientRect().top,
    headerZ: headerCs?.zIndex,
    headerOverflow: headerCs?.overflow,
    is404: !!document.querySelector('main h1') && document.querySelector('main h1').textContent.trim() === 'Không tìm thấy trang',
  }
}

const browser = await chromium.launch({ channel: 'chrome' })
const results = { base: BASE, canonicalRouteCount: CANONICAL_ROUTE_COUNT, viewports: {}, menuLinks: {}, brokenLinks: [] }
const menuHrefs = new Set()

for (const vp of VIEWPORTS.filter((v) => !ONLY_VP || v.name === ONLY_VP)) {
  console.log(`\n== ${vp.name} (${vp.width}x${vp.height})`)
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  const vpResult = { routes: 0, failuresBefore: failures.length }
  // A page that shows only header + footer has NOT loaded: the lazy page
  // module may have failed (stale chunk after a deploy). Console/page errors
  // from the app fail the route too; favicon 404s are noise.
  const consoleErrors = []
  // Resource failures are reported with their URL from the response/requestfailed
  // hooks (the console line for them has no URL); favicon and third-party font
  // hosts are noise, first-party 4xx/5xx and app errors are not.
  const NOISE = /favicon|fonts\.googleapis\.com|fonts\.gstatic\.com/i
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/i.test(m.text())) consoleErrors.push(m.text().slice(0, 160)) })
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + String(e.message).slice(0, 160)))
  page.on('response', (r) => { if (r.status() >= 400 && !NOISE.test(r.url())) consoleErrors.push(`HTTP ${r.status()} ${r.url().slice(0, 140)}`) })
  page.on('requestfailed', (r) => { if (!NOISE.test(r.url())) consoleErrors.push(`request failed ${r.url().slice(0, 140)}`) })

  for (const route of routes) {
    const scope = `${vp.name} ${route}`
    consoleErrors.length = 0
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    const mainLoaded = await page.waitForSelector('main h1', { timeout: 15000 }).then(() => true).catch(() => false)
    if (!mainLoaded) fail(scope, 'main content did not load (no <main> h1 within 15s — lazy chunk missing?)')
    if (await page.locator('text=Unexpected Application Error').count()) fail(scope, 'default React Router error screen rendered')
    for (const err of consoleErrors) fail(scope, `console error: ${err}`)
    const st = await page.evaluate(pageState)
    vpResult.routes++
    if (st.headers !== 1) fail(scope, `header count ${st.headers}`)
    if (st.logos !== 1) fail(scope, `logo count ${st.logos}`)
    if (st.overflow > 0) fail(scope, `horizontal overflow ${st.overflow}px`)
    if (st.headerPosition !== 'fixed' || st.headerTop !== 0) fail(scope, `header not fixed at top (${st.headerPosition}, top ${st.headerTop})`)
    if (!vp.mobile) {
      if (!st.ctaVisible) fail(scope, 'header CTA not visible')
      if (st.ctaFg !== 'rgb(255, 255, 255)') fail(scope, `header CTA foreground ${st.ctaFg}`)
      const n = await page.locator(BTN).count()
      if (n !== EXPECTED_GROUPS.length) fail(scope, `desktop menu buttons ${n}`)
      const navHidden = await page.locator('header nav[data-gcalls-desktop-nav]').isHidden()
      if (navHidden) fail(scope, 'desktop nav hidden')
      // every panel target exists + unique
      const ctl = await page.evaluate((sel) => [...document.querySelectorAll(sel)].map((b) => {
        const id = b.getAttribute('aria-controls')
        return { id, count: id ? document.querySelectorAll('#' + CSS.escape(id)).length : 0, exp: b.getAttribute('aria-expanded') }
      }), BTN)
      for (const c of ctl) {
        if (!c.id || c.count !== 1) fail(scope, `aria-controls "${c.id}" resolves to ${c.count} element(s)`)
        if (c.exp !== 'false') fail(scope, `aria-expanded initially ${c.exp}`)
      }
    } else {
      const navVisible = await page.locator('header nav[data-gcalls-desktop-nav]').isVisible().catch(() => false)
      if (navVisible) fail(scope, 'desktop nav visible at mobile width')
      const toggle = page.locator('header button[aria-haspopup="dialog"]')
      if (!(await toggle.isVisible())) fail(scope, 'hamburger not visible')
    }

    /* Interaction checks: on "/" (and every route unless --quick). */
    const interact = !QUICK || route === '/'
    if (!interact) continue

    if (!vp.mobile) {
      const buttons = page.locator(BTN)
      const labels = (await buttons.allTextContents()).map((t) => t.trim())
      if (JSON.stringify(labels) !== JSON.stringify(EXPECTED_GROUPS)) fail(scope, `menu labels ${JSON.stringify(labels)}`)

      for (let i = 0; i < EXPECTED_GROUPS.length; i++) {
        const btn = buttons.nth(i)
        const label = EXPECTED_GROUPS[i]
        const box = await btn.boundingBox()
        // real pointer sequence: move (hover) → down → up
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
        await page.waitForTimeout(60)
        await page.mouse.down(); await page.mouse.up()
        await page.waitForTimeout(120)
        const exp = await btn.getAttribute('aria-expanded')
        if (exp !== 'true') fail(scope, `${label}: aria-expanded ${exp} after real click`)
        const panelId = await btn.getAttribute('aria-controls')
        const panel = page.locator('#' + panelId)
        if (!(await panel.isVisible())) fail(scope, `${label}: panel not visible after click`)
        const info = await panel.evaluate((el, w) => {
          const r = el.getBoundingClientRect()
          const links = [...el.querySelectorAll('a[href]')]
          const centre = links[0] && links[0].getBoundingClientRect()
          const top = centre && document.elementFromPoint(centre.left + centre.width / 2, centre.top + centre.height / 2)
          return {
            links: links.length,
            hrefs: links.map((a) => a.getAttribute('href')),
            overview: !!el.querySelector('[data-menu-overview]'),
            cta: !!el.querySelector('[data-menu-cta]'),
            inViewport: r.left >= 0 && r.right <= w && r.top >= 0,
            firstLinkOnTop: !!top && !!links[0] && links[0].contains(top),
          }
        }, vp.width)
        if (info.links === 0) fail(scope, `${label}: panel empty`)
        if (!info.overview) fail(scope, `${label}: no overview row`)
        if (!info.cta) fail(scope, `${label}: no bottom CTA`)
        if (!info.inViewport) fail(scope, `${label}: panel clipped by viewport`)
        if (!info.firstLinkOnTop) fail(scope, `${label}: panel covered by another element`)
        info.hrefs.forEach((h) => menuHrefs.add(h))
        results.menuLinks[label] = info.hrefs
        // exactly one open
        const openCount = await page.locator(`${BTN}[aria-expanded="true"]`).count()
        if (openCount !== 1) fail(scope, `${label}: ${openCount} menus open at once`)
        // highlight — the button has a 150ms colour transition; poll past it
        // instead of sampling mid-transition on a slow host.
        let bg = ''
        for (let t = 0; t < 8; t++) {
          bg = await btn.evaluate((b) => getComputedStyle(b).backgroundColor)
          if (bg === 'rgb(246, 243, 252)') break
          await page.waitForTimeout(100)
        }
        if (bg !== 'rgb(246, 243, 252)') fail(scope, `${label}: open button not highlighted (${bg})`)
        // second click closes
        await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(100)
        if ((await btn.getAttribute('aria-expanded')) !== 'false') fail(scope, `${label}: second click did not close`)
        if (await panel.isVisible()) fail(scope, `${label}: panel still visible after close`)
      }

      // outside click closes
      const first = buttons.nth(0)
      await first.click(); await page.waitForTimeout(100)
      if ((await first.getAttribute('aria-expanded')) !== 'true') fail(scope, 'outside-click test: could not open')
      await page.mouse.click(vp.width / 2, vp.height - 40); await page.waitForTimeout(100)
      if ((await first.getAttribute('aria-expanded')) !== 'false') fail(scope, 'outside click did not close')

      // keyboard: Enter opens, Escape closes + returns focus
      await page.mouse.move(vp.width / 2, vp.height / 2)
      await first.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(100)
      if ((await first.getAttribute('aria-expanded')) !== 'true') fail(scope, 'Enter did not open')
      await page.keyboard.press('Escape'); await page.waitForTimeout(100)
      if ((await first.getAttribute('aria-expanded')) !== 'false') fail(scope, 'Escape did not close')
      if (!(await first.evaluate((b) => document.activeElement === b))) fail(scope, 'Escape did not return focus')
      // Space opens
      await page.keyboard.press('Space'); await page.waitForTimeout(100)
      if ((await first.getAttribute('aria-expanded')) !== 'true') fail(scope, 'Space did not open')
      await page.keyboard.press('Escape'); await page.waitForTimeout(60)
      // ArrowDown opens + focuses first link
      await page.keyboard.press('ArrowDown'); await page.waitForTimeout(120)
      if ((await first.getAttribute('aria-expanded')) !== 'true') fail(scope, 'ArrowDown did not open')
      const firstLinkFocused = await page.evaluate((sel) => {
        const b = document.querySelector(sel)
        const p = document.getElementById(b.getAttribute('aria-controls'))
        return p.querySelector('a[href]') === document.activeElement
      }, BTN)
      if (!firstLinkFocused) fail(scope, 'ArrowDown did not focus first item')
      // Tab moves through links inside panel
      await page.keyboard.press('Tab'); await page.waitForTimeout(60)
      const tabInside = await page.evaluate((sel) => {
        const b = document.querySelector(sel)
        const p = document.getElementById(b.getAttribute('aria-controls'))
        return p.contains(document.activeElement) && document.activeElement.tagName === 'A'
      }, BTN)
      if (!tabInside) fail(scope, 'Tab did not move to next link in panel')
      // Escape from inside panel returns focus to button
      await page.keyboard.press('Escape'); await page.waitForTimeout(100)
      if (!(await first.evaluate((b) => document.activeElement === b))) fail(scope, 'Escape from panel did not return focus')
      // one-open-at-a-time via hover across groups
      const b0 = await buttons.nth(0).boundingBox(); const b1 = await buttons.nth(1).boundingBox()
      await page.mouse.move(b0.x + 5, b0.y + 5); await page.waitForTimeout(80)
      await page.mouse.move(b1.x + 5, b1.y + 5); await page.waitForTimeout(80)
      const openViaHover = await page.locator(`${BTN}[aria-expanded="true"]`).count()
      if (openViaHover > 1) fail(scope, `${openViaHover} menus open after hover move`)
      await page.mouse.move(vp.width / 2, vp.height / 2); await page.waitForTimeout(80)
    } else {
      const toggle = page.locator('header button[aria-haspopup="dialog"]')
      await toggle.click(); await page.waitForTimeout(150)
      if ((await toggle.getAttribute('aria-expanded')) !== 'true') fail(scope, 'hamburger aria-expanded not true')
      const dialog = page.locator('[role="dialog"][aria-modal="true"]')
      if (!(await dialog.isVisible())) fail(scope, 'drawer not visible')
      const st2 = await page.evaluate(() => ({
        overflow: document.body.style.overflow,
        scrollW: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        acc: [...document.querySelectorAll('[role="dialog"] h3 button')].map((b) => ({
          t: b.textContent.trim(), exp: b.getAttribute('aria-expanded'), ctl: b.getAttribute('aria-controls'),
          h: b.getBoundingClientRect().height,
        })),
        cta: (() => { const c = document.querySelector('[role="dialog"] a[data-gcalls-button][data-variant="primary"]'); if (!c) return null; const cs = getComputedStyle(c); return { fg: cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color ? cs.webkitTextFillColor : cs.color, w: c.getBoundingClientRect().width } })(),
      }))
      if (st2.overflow !== 'hidden') fail(scope, `body scroll not locked (${st2.overflow})`)
      if (st2.scrollW > 0) fail(scope, `drawer horizontal overflow ${st2.scrollW}px`)
      const accLabels = st2.acc.map((a) => a.t)
      if (JSON.stringify(accLabels) !== JSON.stringify(EXPECTED_GROUPS)) fail(scope, `accordion labels ${JSON.stringify(accLabels)}`)
      if (!st2.cta || st2.cta.w === 0) fail(scope, 'drawer CTA missing')
      else if (st2.cta.fg !== 'rgb(255, 255, 255)') fail(scope, `drawer CTA foreground ${st2.cta.fg}`)
      // each accordion: open, check aria + links >= 44px, then collect hrefs
      const acc = page.locator('[role="dialog"] h3 button')
      for (let i = 0; i < EXPECTED_GROUPS.length; i++) {
        const b = acc.nth(i)
        await b.scrollIntoViewIfNeeded()
        if ((await b.getAttribute('aria-expanded')) !== 'true') { await b.click(); await page.waitForTimeout(100) }
        const r = await b.evaluate((el) => {
          const id = el.getAttribute('aria-controls')
          const panel = id && document.getElementById(id)
          const links = panel ? [...panel.querySelectorAll('a[href]')] : []
          return {
            exp: el.getAttribute('aria-expanded'), ok: !!panel, btnH: el.getBoundingClientRect().height,
            links: links.length, short: links.filter((a) => a.getBoundingClientRect().height < 44).length,
            hrefs: links.map((a) => a.getAttribute('href')),
          }
        })
        if (r.exp !== 'true' || !r.ok) fail(scope, `${EXPECTED_GROUPS[i]}: accordion aria (expanded=${r.exp}, target=${r.ok})`)
        if (r.links === 0) fail(scope, `${EXPECTED_GROUPS[i]}: accordion empty`)
        if (r.short > 0) fail(scope, `${EXPECTED_GROUPS[i]}: ${r.short} links under 44px`)
        if (r.btnH < 44) fail(scope, `${EXPECTED_GROUPS[i]}: accordion button ${r.btnH}px`)
        r.hrefs.forEach((h) => menuHrefs.add(h))
      }
      // Escape closes + unlocks scroll
      await page.keyboard.press('Escape'); await page.waitForTimeout(150)
      if (await dialog.isVisible().catch(() => false)) fail(scope, 'Escape did not close drawer')
      const unlocked = await page.evaluate(() => document.body.style.overflow)
      if (unlocked === 'hidden') fail(scope, 'body scroll still locked after close')
      if ((await toggle.getAttribute('aria-expanded')) !== 'false') fail(scope, 'hamburger aria-expanded not reset')
    }
  }
  vpResult.failures = failures.length - vpResult.failuresBefore
  results.viewports[vp.name] = vpResult
  await ctx.close()
}

/* ---- link audit --------------------------------------------------------- */
console.log('\n== link audit')
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const canonicalSet = new Set(canonical.map(norm))
for (const href of [...menuHrefs].sort()) {
  const pathOnly = href.replace(/^https?:\/\/[^/]+/, '').split(/[?#]/)[0]
  if (!canonicalSet.has(norm(pathOnly))) { fail('links', `${href} not in routes.json`); results.brokenLinks.push(href); continue }
  await page.goto(BASE + pathOnly, { waitUntil: 'networkidle' })
  const st = await page.evaluate(pageState)
  if (st.is404) { fail('links', `${href} renders 404`); results.brokenLinks.push(href) }
}
console.log(`  ${menuHrefs.size} distinct menu hrefs checked, ${results.brokenLinks.length} broken`)
await ctx.close()
await browser.close()
if (server) server.kill()

results.menuHrefCount = menuHrefs.size
results.failures = failures
fs.writeFileSync(OUT, JSON.stringify(results, null, 2))
console.log(`\ncanonical routes: ${CANONICAL_ROUTE_COUNT}; audited ${routes.length}; failures ${failures.length}`)
console.log(failures.length ? 'HEADER AUDIT FAILED' : 'HEADER AUDIT PASSED')
process.exit(failures.length ? 1 : 0)
