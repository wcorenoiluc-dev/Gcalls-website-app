#!/usr/bin/env node
/**
 * CTA contrast / visibility audit + regression guard.
 *
 * Walks every React Shell route (wordpress/.../routes.json) at 1440 / 768 /
 * 390 px, inspects every visible <a>, <button> and [role=button], and FAILS
 * (exit 1) when any solid-purple control:
 *   - has an empty accessible name;
 *   - is not visibly rendered (opacity chain 0, visibility hidden, zero box,
 *     text-indent off-label, clip-path/overflow clipping the label);
 *   - has a non-white computed foreground (color or -webkit-text-fill-color);
 *   - has text contrast < 4.5:1 against its own background;
 *   - has an icon whose computed colour is not the label colour;
 *   - is covered by another element at the label's centre (overlay);
 *   - matches an `:visited` rule whose colour is not white;
 *   - carries a purple background but no `data-gcalls-button` tag;
 * and when any `data-variant="light"` / `"outline"` control does not render a
 * brand-purple label, or when the page overflows horizontally.
 * Hover / focus-visible / active are exercised on every tagged primary at the
 * 1440 viewport (pointer states are identical at the other widths).
 *
 * Usage:
 *   node scripts/cta-contrast-audit.mjs --serve            # builds nothing; runs `vite preview` on ./dist
 *   node scripts/cta-contrast-audit.mjs --base http://localhost:5173
 *   node scripts/cta-contrast-audit.mjs --base https://ashernguyenxuanthuy.com --out docs/.../live.json
 * Flags:
 *   --wp-sim   inject WordPress's unlayered `a:where(:not(.wp-element-button)) {color}`
 *              and `a:visited` rules into each page — the hostile cascade the shell
 *              must survive — so the guard means something off a WP install too.
 *   --routes <n>  limit to the first n routes (debug)
 */
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const flag = (n) => args.includes(n)
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d }

const ROUTES_FILE = 'wordpress/wp-content/plugins/gcalls-react-shell/routes.json'
const OUT = opt('--out', 'scripts/cta-contrast-results.json')
const WP_SIM = flag('--wp-sim')
const SERVE = flag('--serve')
const PORT = 4173
let BASE = opt('--base', `http://localhost:${PORT}`)
const LIMIT = Number(opt('--routes', 0)) || 0
const VIEWPORTS = [
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'mobile_390', width: 390, height: 844 },
]

let routes = JSON.parse(fs.readFileSync(ROUTES_FILE, 'utf8')).map((r) => r.path)
if (LIMIT) routes = routes.slice(0, LIMIT)

let server
if (SERVE) {
  server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
  const deadline = Date.now() + 30000
  while (Date.now() < deadline) {
    try { const r = await fetch(BASE + '/'); if (r.ok) break } catch {}
    await new Promise((r) => setTimeout(r, 300))
  }
}

const WP_HOSTILE_CSS = `
  a:where(:not(.wp-element-button)) { color: var(--wp--preset--color--brand, #673ab7); text-decoration: underline; }
  a { color: #673ab7; }
  a:visited { color: #4a2391; }
  a:hover, a:focus { color: #4a2391; }
  button { color: #673ab7; }
`

/* Runs in the page. Self-contained: no imports. */
const inspect = () => {
  const PURPLES = new Set(['rgb(103, 58, 183)', 'rgb(74, 35, 145)', 'rgb(89, 41, 168)'])
  const WHITE = 'rgb(255, 255, 255)'
  const parse = (c) => {
    const m = c && c.match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const [r, g, b, a = '1'] = m[1].split(',').map((s) => parseFloat(s))
    return { r, g, b, a: a === undefined ? 1 : a }
  }
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const contrast = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) }
  const isPurple = (c) => { const p = parse(c); return !!p && p.a > 0.5 && PURPLES.has(`rgb(${p.r}, ${p.g}, ${p.b})`) }
  const isWhite = (c) => { const p = parse(c); return !!p && p.a > 0.99 && p.r === 255 && p.g === 255 && p.b === 255 }
  const effectiveBg = (el) => {
    let n = el
    while (n && n !== document.documentElement) {
      const p = parse(getComputedStyle(n).backgroundColor)
      if (p && p.a > 0.5) return `rgb(${p.r}, ${p.g}, ${p.b})`
      n = n.parentElement
    }
    return WHITE
  }
  const opacityChain = (el) => { let o = 1, n = el; while (n) { o *= parseFloat(getComputedStyle(n).opacity || '1'); n = n.parentElement } return o }
  const accName = (el) => (el.getAttribute('aria-label') || el.textContent || el.getAttribute('title') || [...el.querySelectorAll('img[alt]')].map((i) => i.alt).join(' ') || '').replace(/\s+/g, ' ').trim()
  const visitedRules = []
  const importantRules = []
  for (const s of document.styleSheets) {
    let rules; try { rules = s.cssRules } catch { continue }
    for (const r of rules) {
      if (!r.selectorText || !r.style || !r.style.color) continue
      if (/:visited/.test(r.selectorText)) visitedRules.push({ sel: r.selectorText, color: r.style.color, important: r.style.getPropertyPriority('color') === 'important' })
      else if (r.style.getPropertyPriority('color') === 'important') importantRules.push({ sel: r.selectorText, color: r.style.color })
    }
  }
  const out = []
  const controls = [...document.querySelectorAll('a, button, [role="button"]')]
  for (const el of controls) {
    const cs = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    const visible = cs.display !== 'none' && cs.visibility !== 'hidden' && rect.width > 0 && rect.height > 0
    if (!visible) continue
    // Skip links are sr-only by design (off-canvas until focused) — not a CTA.
    if (/\bsr-only\b/.test(String(el.className))) continue
    const variant = el.getAttribute('data-variant')
    const tagged = el.hasAttribute('data-gcalls-button')
    const bgOwn = cs.backgroundColor
    const purpleBg = isPurple(bgOwn)
    const interesting = tagged || purpleBg
    if (!interesting) continue
    const name = accName(el)
    const fill = cs.webkitTextFillColor
    const fg = fill && fill !== cs.color ? fill : cs.color
    const bg = purpleBg ? bgOwn : (isWhite(bgOwn) || parse(bgOwn)?.a > 0.5 ? bgOwn : effectiveBg(el))
    const fgP = parse(fg), bgP = parse(bg)
    const ratio = fgP && bgP ? contrast(fgP, bgP) : 0
    const opacity = opacityChain(el)
    const textIndent = parseFloat(cs.textIndent) || 0
    const clipped = el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1
    const clipPath = cs.clipPath !== 'none' || cs.clip !== 'auto'
    const offscreen = rect.right <= 0 || rect.left >= window.innerWidth || rect.bottom <= 0
    // overlay check at the label centre (first text node), scrolled into view
    let overlay = null
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    let tn; while ((tn = walker.nextNode())) if (tn.textContent.trim()) break
    if (tn) {
      const range = document.createRange(); range.selectNodeContents(tn)
      const tr = range.getBoundingClientRect()
      const cx = tr.left + tr.width / 2, cy = tr.top + tr.height / 2
      if (cx >= 0 && cy >= 0 && cx < window.innerWidth && cy < window.innerHeight) {
        const hit = document.elementFromPoint(cx, cy)
        if (hit && hit !== el && !el.contains(hit) && !hit.contains(el)) overlay = hit.tagName + (hit.className ? '.' + String(hit.className).split(' ')[0] : '')
      }
    }
    const svgs = [...el.querySelectorAll('svg')]
    const icons = svgs.map((s) => { const c = getComputedStyle(s); return { color: c.color, stroke: c.stroke, fill: c.fill } })
    const iconOk = svgs.every((s, i) => parse(icons[i].color) && fgP && parse(icons[i].color).r === fgP.r && parse(icons[i].color).g === fgP.g && parse(icons[i].color).b === fgP.b)
    // A :visited rule only wins if nothing matching the element sets colour with !important
    // (an !important white rule — buttons.css — beats any non-important :visited colour).
    const matches = (sel) => { try { return el.matches(sel.replace(/:visited/g, '')) } catch { return false } }
    const shielded = importantRules.some((r) => matches(r.sel) && /rgb\(255, 255, 255\)|#fff/i.test(r.color)) || visitedRules.some((r) => r.important && matches(r.sel) && /rgb\(255, 255, 255\)|#fff/i.test(r.color))
    const badVisited = shielded ? [] : visitedRules.filter((vr) => matches(vr.sel) && !/rgb\(255, 255, 255\)|#fff/i.test(vr.color))
    out.push({ tag: el.tagName.toLowerCase(), name: name.slice(0, 60), variant, tagged, purpleBg, bg, fg, ratio: +ratio.toFixed(2), opacity, textIndent, clipped, clipPath, offscreen, overlay, icons: icons.length, iconOk, badVisited: badVisited.map((v) => `${v.sel} -> ${v.color}`), pressed: el.getAttribute('aria-pressed'), top: Math.round(rect.top + window.scrollY), left: Math.round(rect.left), w: Math.round(rect.width), h: Math.round(rect.height), cls: String(el.className).slice(0, 60) })
  }
  return { controls: out, pageOverflow: document.documentElement.scrollWidth > window.innerWidth + 1, scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, version: window.__GCALLS_SHELL_CONFIG__?.pluginVersion || null }
}

const judge = (c, ctx) => {
  const fails = []
  const whiteFg = /^rgb\(255, 255, 255\)$/.test(c.fg)
  const purpleFg = /^rgb\((103, 58, 183|74, 35, 145)\)$/.test(c.fg)
  const solid = c.purpleBg || c.variant === 'primary'
  if (solid) {
    if (!c.tagged && c.pressed === null) fails.push('untagged-purple-control')
    if (!c.name) fails.push('empty-accessible-name')
    if (!whiteFg) fails.push(`foreground-not-white(${c.fg})`)
    if (c.ratio < 4.5) fails.push(`contrast-${c.ratio}`)
    if (c.icons && !c.iconOk) fails.push('icon-not-label-colour')
    if (c.badVisited.length) fails.push(`visited-rule(${c.badVisited.join('; ')})`)
  }
  if (c.variant === 'light' || c.variant === 'outline') {
    if (!purpleFg) fails.push(`foreground-not-purple(${c.fg})`)
    if (c.ratio < 4.5) fails.push(`contrast-${c.ratio}`)
    if (c.icons && !c.iconOk) fails.push('icon-not-label-colour')
  }
  if (c.variant === 'outline-dark' && !whiteFg) fails.push(`foreground-not-white(${c.fg})`)
  if (c.tagged || solid) {
    if (c.opacity < 0.55) fails.push(`opacity-${c.opacity}`)
    if (Math.abs(c.textIndent) > c.w) fails.push('text-indent-offscreen')
    if (c.clipped) fails.push('label-clipped')
    if (c.clipPath) fails.push('clip-path')
    if (c.offscreen) fails.push('offscreen')
    if (c.overlay) fails.push(`overlay(${c.overlay})`)
    if (!c.name) fails.push('empty-accessible-name')
  }
  return fails
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const results = []
let liveVersion = null
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  for (const route of routes) {
    const url = BASE.replace(/\/$/, '') + route
    const rec = { route, viewport: vp.name, url, controls: [], failures: [], states: [] }
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      if (WP_SIM) await page.addStyleTag({ content: WP_HOSTILE_CSS })
      await page.waitForTimeout(400)
      // scroll the whole page so lazy content mounts, then back to top
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)) } window.scrollTo(0, 0) })
      await page.waitForTimeout(200)
      let snap = await page.evaluate(inspect)
      liveVersion = liveVersion || snap.version
      rec.pageOverflow = snap.pageOverflow; rec.scrollWidth = snap.scrollWidth
      rec.controls = snap.controls.map((c) => ({ ...c, fails: judge(c, rec) }))
      if (snap.pageOverflow) rec.failures.push(`page-horizontal-overflow(${snap.scrollWidth}>${snap.innerWidth})`)
      // mobile nav: open the menu and audit its CTAs too
      if (vp.width < 768) {
        const toggle = page.locator('button[aria-label="Mở menu"]').first()
        if (await toggle.count()) {
          await toggle.click(); await page.waitForTimeout(350)
          const menuSnap = await page.evaluate(inspect)
          const seen = new Set(rec.controls.map((c) => c.name + c.top + c.cls))
          for (const c of menuSnap.controls) if (!seen.has(c.name + c.top + c.cls)) rec.controls.push({ ...c, inMobileMenu: true, fails: judge(c, rec) })
          await page.keyboard.press('Escape').catch(() => {})
        }
      }
      // interaction states on tagged primaries (desktop only)
      if (vp.width === 1440) {
        const handles = await page.$$('[data-gcalls-button][data-variant="primary"]')
        for (const h of handles) {
          const name = (await h.evaluate((e) => (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 40))) || '(no name)'
          const read = () => h.evaluate((e) => { const s = getComputedStyle(e); return s.webkitTextFillColor && s.webkitTextFillColor !== s.color ? s.webkitTextFillColor : s.color })
          const st = { name }
          try {
            await h.scrollIntoViewIfNeeded()
            await h.hover({ force: true }); await page.waitForTimeout(60); st.hover = await read()
            await page.mouse.down(); await page.waitForTimeout(40); st.active = await read(); await page.mouse.up()
            await page.keyboard.press('Escape').catch(() => {})
            await h.focus(); await page.waitForTimeout(40); st.focus = await read()
            await h.evaluate((e) => e.blur())
          } catch (e) { st.error = String(e).slice(0, 80) }
          for (const k of ['hover', 'active', 'focus']) if (st[k] && st[k] !== 'rgb(255, 255, 255)') rec.failures.push(`state-${k}-not-white(${name}:${st[k]})`)
          rec.states.push(st)
        }
        // if the state test navigated away (mouse.down/up = click), reload is handled by next goto
      }
    } catch (e) { rec.error = String(e).slice(0, 200); rec.failures.push('page-error') }
    for (const c of rec.controls) for (const f of c.fails) rec.failures.push(`${c.tag}[${c.variant || 'untagged'}] "${c.name}" @${c.top}: ${f}`)
    results.push(rec)
    process.stdout.write(`${rec.failures.length ? 'FAIL' : 'ok  '} ${vp.name.padEnd(12)} ${route.padEnd(32)} ctrls=${rec.controls.length}${rec.failures.length ? ' ' + rec.failures.slice(0, 3).join(' | ') : ''}\n`)
  }
  await ctx.close()
}
await browser.close()
if (server) server.kill()

const all = results.flatMap((r) => r.controls.map((c) => ({ ...c, route: r.route, viewport: r.viewport })))
const purple = all.filter((c) => c.purpleBg || c.variant === 'primary')
const summary = {
  base: BASE, wpSim: WP_SIM, routes: routes.length, liveVersion,
  PURPLE_CTA_TOTAL: purple.length,
  PURPLE_CTA_WHITE_TEXT: purple.filter((c) => c.fg === 'rgb(255, 255, 255)').length,
  PURPLE_CTA_CONTRAST_FAILURES: purple.filter((c) => c.ratio < 4.5).length,
  EMPTY_OR_INVISIBLE_LABELS: all.filter((c) => c.fails.some((f) => /empty-accessible-name|opacity|text-indent|clipped|clip-path|offscreen|overlay/.test(f))).length,
  WHITE_CTA_PURPLE_TEXT: `${all.filter((c) => c.variant === 'light' && /^rgb\((103, 58, 183|74, 35, 145)\)$/.test(c.fg)).length}/${all.filter((c) => c.variant === 'light').length}`,
  OUTLINE_CTA_PURPLE_TEXT: `${all.filter((c) => c.variant === 'outline' && /^rgb\((103, 58, 183|74, 35, 145)\)$/.test(c.fg)).length}/${all.filter((c) => c.variant === 'outline').length}`,
  UNTAGGED_PURPLE: purple.filter((c) => !c.tagged).map((c) => `${c.route}@${c.viewport} ${c.tag} "${c.name}"`),
  perViewport: Object.fromEntries(VIEWPORTS.map((v) => { const rs = results.filter((r) => r.viewport === v.name); return [v.name, { routes: rs.length, failingRoutes: rs.filter((r) => r.failures.length).length, controls: rs.reduce((n, r) => n + r.controls.length, 0) }] })),
  failingRoutes: results.filter((r) => r.failures.length).map((r) => ({ route: r.route, viewport: r.viewport, failures: r.failures })),
}
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify({ summary, results }, null, 2))
console.log('\n' + JSON.stringify(summary, null, 2))
const failed = summary.failingRoutes.length > 0
console.log(failed ? `\nCTA AUDIT FAILED: ${summary.failingRoutes.length} route/viewport combinations` : '\nCTA AUDIT PASSED')
process.exit(failed ? 1 : 0)
