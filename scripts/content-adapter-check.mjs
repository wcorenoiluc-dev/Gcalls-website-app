// Runtime check for the Gcalls Content Studio adapter: published overrides, preview-update/focus/ready, SEO override, malformed bootstrap. Usage: node scripts/content-adapter-check.mjs (needs ./dist from `npm run build`).
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
const port = '4193'
const s = spawn('npx', ['vite', 'preview', '--port', port, '--strictPort'], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 2500))
const b = await chromium.launch({ channel: 'chrome' })
const fails = []
const check = (ok, msg) => { if (!ok) fails.push(msg); console.log((ok ? 'ok  ' : 'FAIL') + ' ' + msg) }
try {
  // 1. Published override on /gcalls-plus-webphone/ (hero h1 + problems card + faq) and SEO
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.addInitScript(() => {
    window.__GCALLS_SHELL_CONFIG__ = {
      routePath: '/gcalls-plus-webphone/', routeKey: 'gcallsPlus',
      gcallsContent: {
        restUrl: '', nonce: null, schemaVersion: 2, version: 3, previewMode: false,
        publishedContent: { sections: {
          hero: { h1: 'H1 ĐÃ XUẤT BẢN', bogus: 'x', valuePoints: [{ title: 'VP1' }] },
          problems: { items: [{ title: 'BÀI TOÁN 1' }] },
          faq: { items: [{ q: 'CÂU HỎI 1', a: 'TRẢ LỜI 1' }] },
          testimonials: { items: [{ quote: 'QUOTE A' }] },
          unknownSection: { h2: 'nope' },
        } },
        seo: { title: 'SEO TITLE OVERRIDE', description: 'SEO DESC', noindex: true, ogImage: { id: 1, url: 'https://example.com/og.png' } },
      },
    }
  })
  const p = await ctx.newPage()
  await p.goto(`http://localhost:${port}/gcalls-plus-webphone/`, { waitUntil: 'networkidle' })
  await p.waitForSelector('main h1')
  check((await p.textContent('main h1')).trim() === 'H1 ĐÃ XUẤT BẢN', 'published h1 override renders')
  const vp = await p.evaluate(() => [...document.querySelectorAll('main > section:first-of-type li p')].map((e) => e.textContent.trim()))
  check(vp[0] === 'VP1', 'repeater item merged over default item (title)')
  check(vp.length >= 2 && vp[1].length > 0, 'repeater item keeps default detail when only title sent')
  const problems = await p.evaluate(() => document.querySelector('section[aria-labelledby="bai-toan"] li h3')?.textContent.trim())
  check(problems === 'BÀI TOÁN 1', 'problems card title override')
  const faq = await p.evaluate(() => document.querySelector('section[aria-labelledby="faq-gcalls-plus"] button')?.textContent.trim())
  check(faq && faq.includes('CÂU HỎI 1'), 'faq override via page-level section')
  const quote = await p.evaluate(() => document.querySelector('[data-testimonial] blockquote')?.textContent.trim())
  check(quote && quote.includes('QUOTE A'), 'testimonial override')
  check(await p.title() === 'SEO TITLE OVERRIDE', 'SEO title override')
  const robots = await p.evaluate(() => document.querySelector('meta[name="robots"]')?.getAttribute('content'))
  check(robots === 'noindex, nofollow', 'SEO noindex override')
  const og = await p.evaluate(() => document.querySelector('meta[property="og:image"]')?.getAttribute('content'))
  check(og === 'https://example.com/og.png', 'SEO og:image override')
  await ctx.close()

  // 2. Malformed bootstrap must not blank the page; header/footer stay.
  const ctx2 = await b.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx2.addInitScript(() => {
    window.__GCALLS_SHELL_CONFIG__ = { routePath: '/', routeKey: 'home', gcallsContent: { publishedContent: 'garbage', previewMode: 'yes', seo: 42 } }
  })
  const p2 = await ctx2.newPage()
  const errors = []
  p2.on('pageerror', (e) => errors.push(e.message))
  await p2.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' })
  await p2.waitForSelector('main h1')
  check(errors.length === 0, 'malformed bootstrap: no page errors')
  check((await p2.locator('header').count()) === 1 && (await p2.locator('footer').count()) === 1, 'malformed bootstrap: header + footer present')
  check((await p2.textContent('main h1')).includes('Tổng Đài'), 'malformed bootstrap: default hero renders')
  await ctx2.close()

  // 3. Preview mode: preview-ready is posted to parent; preview-update from parent re-renders; preview-focus scrolls.
  const ctx4 = await b.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx4.addInitScript(() => {
    if (window !== window.parent) {
      window.__GCALLS_SHELL_CONFIG__ = { routePath: '/qc-bot-ai/', routeKey: 'qcCenter', gcallsContent: { restUrl: '', nonce: 'n', schemaVersion: 2, version: 1, previewMode: true, previewSection: 'hero', publishedContent: { sections: {} } } }
    }
  })
  const p4 = await ctx4.newPage()
  await p4.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' }) // same-origin parent document
  await p4.evaluate((port) => {
    document.body.innerHTML = `<iframe id="f" style="width:1200px;height:800px" src="http://localhost:${port}/qc-bot-ai/"></iframe>`
    window.__ready = new Promise((resolve) => window.addEventListener('message', (e) => { if (e.data && e.data.type === 'preview-ready' && e.data.source === 'gcalls-react-shell') resolve(e.data.route) }))
  }, port)
  const readyRoute = await p4.evaluate(() => Promise.race([window.__ready, new Promise((r) => setTimeout(() => r('TIMEOUT'), 8000))]))
  check(readyRoute === '/qc-bot-ai/', 'preview-ready posted to parent with route (' + readyRoute + ')')
  const frame = p4.frames().find((f) => f.url().includes('/qc-bot-ai/'))
  await frame.waitForSelector('main h1')
  await p4.evaluate(() => {
    document.getElementById('f').contentWindow.postMessage({ source: 'gcalls-content-studio', type: 'preview-update', route: '/qc-bot-ai/', section: 'hero', fields: { h1: 'PREVIEW H1 [PREVIEW TEST]' } }, window.location.origin)
  })
  await frame.waitForFunction(() => document.querySelector('main h1')?.textContent.includes('[PREVIEW TEST]'), null, { timeout: 5000 }).catch(() => {})
  check((await frame.textContent('main h1')).includes('[PREVIEW TEST]'), 'preview-update re-renders hero without reload')
  await p4.evaluate(() => {
    document.getElementById('f').contentWindow.postMessage({ source: 'gcalls-content-studio', type: 'preview-focus', route: '/qc-bot-ai/', section: 'faq', selector: 'section[aria-labelledby="faq-qa-qc"]' }, window.location.origin)
  })
  await frame.waitForTimeout(900)
  const scrolled = await frame.evaluate(() => window.scrollY > 500)
  check(scrolled, 'preview-focus scrolls the section into view')
  // spoofed source (message from a different window) must be ignored: simulate via the iframe itself posting to itself
  await frame.evaluate(() => window.postMessage({ source: 'gcalls-content-studio', type: 'preview-update', route: '/qc-bot-ai/', section: 'hero', fields: { h1: 'SPOOFED' } }, window.location.origin))
  await frame.waitForTimeout(300)
  check(!(await frame.textContent('main h1')).includes('SPOOFED'), 'preview-update from a non-parent source is ignored')
  await ctx4.close()
} finally {
  await b.close(); s.kill()
}
console.log(fails.length ? `ADAPTER CHECK FAILED (${fails.length})` : 'ADAPTER CHECK PASSED')
process.exit(fails.length ? 1 : 0)
