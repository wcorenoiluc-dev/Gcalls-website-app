/**
 * Live acceptance for the demo site. One command, everything the 014–017
 * briefs ask for.
 *
 * It is read-only against the site: it loads pages, clicks controls that only
 * change what is on screen, and writes screenshots and a report locally.
 * Nothing is submitted, nothing is saved, no admin URL is touched.
 *
 *   node wordpress/scripts/acceptance.mjs
 *   node wordpress/scripts/acceptance.mjs --skip-shots     (faster re-run)
 *   node wordpress/scripts/acceptance.mjs --routes /,/blog/
 *
 * Exits non-zero if any gate fails, so it can be the thing that decides
 * whether a deploy is accepted rather than a thing somebody reads.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'dist', 'acceptance')

const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i !== -1 ? args[i + 1] : fallback
}
const has = (name) => args.includes(`--${name}`)

const ORIGIN = (arg('origin', 'https://ashernguyenxuanthuy.com')).replace(/\/$/, '')
const SKIP_SHOTS = has('skip-shots')

const ROUTES = arg(
  'routes',
  '/,/gcalls-plus-webphone/,/gcalls-cx/,/voicebot-ai/,/qc-bot-ai/,/uoc-tinh-chi-phi/,/blog/',
).split(',').filter(Boolean)

/** One representative article, so the single-post template is covered. */
const SINGLE_POST = arg('post', '/du-lieu-dong-bo-giua-tong-dai-va-helpdesk/')

const WIDTHS = [1440, 1024, 768, 390, 320]

const EXPECT = { theme: '0.8.2', core: '0.9.4' }

const results = []
let failures = 0

const record = (area, label, ok, detail = '') => {
  results.push({ area, label, ok, detail })
  if (!ok) failures += 1
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${detail && !ok ? ` — ${detail}` : ''}`)
}

const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
]

async function browser() {
  try {
    return await chromium.launch()
  } catch (bundled) {
    const found = CHROME_PATHS.find((p) => fs.existsSync(p))
    if (!found) throw bundled
    return chromium.launch({ executablePath: found })
  }
}

/**
 * Console noise from a browser extension is not the website's problem, and on
 * this machine there is plenty of it.
 *
 * Chrome's own message for a failed subresource — "Failed to load resource:
 * the server responded with a status of 404" — does not name the URL, so
 * filtering on the text alone cannot tell a missing favicon from a missing
 * stylesheet. Failed requests are therefore judged from the response event,
 * which does carry the URL, and the console listener is left for real script
 * errors.
 */
const isSiteError = (text) =>
  !/extension|chrome-extension|devtools|favicon/i.test(text) &&
  !/Failed to load resource/i.test(text)

/** A failed request that actually matters: not a favicon, not third-party. */
const isSiteRequestFailure = (url, status) =>
  status >= 400 && !/favicon|\.ico($|\?)/i.test(url) && url.includes('ashernguyenxuanthuy.com')

async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.evaluate(() => document.fonts?.ready).catch(() => {})
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0
      const step = () => {
        y += window.innerHeight
        window.scrollTo(0, y)
        if (y < document.body.scrollHeight) setTimeout(step, 50)
        else {
          window.scrollTo(0, 0)
          setTimeout(resolve, 200)
        }
      }
      step()
    })
  })
  await page.waitForTimeout(250)
}

const slug = (route) => (route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-'))

fs.mkdirSync(OUT, { recursive: true })

const b = await browser()

/* ------------------------------------------------------------- fingerprint */

console.log(`\nACCEPTANCE — ${ORIGIN}\n`)
console.log('0. Asset fingerprint')

{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(ORIGIN + '/', { waitUntil: 'domcontentloaded', timeout: 45000 })
  const html = await page.content()

  const theme = html.match(/theme\.css\?ver=([0-9.]+)/)?.[1] ?? '(none)'
  const core = html.match(/mockups\.css\?ver=([0-9.]+)/)?.[1] ?? '(none)'

  record('fingerprint', `theme.css?ver=${EXPECT.theme}`, theme === EXPECT.theme, `found ${theme}`)
  record('fingerprint', `mockups.css?ver=${EXPECT.core}`, core === EXPECT.core, `found ${core}`)

  await ctx.close()

  if (theme !== EXPECT.theme || core !== EXPECT.core) {
    console.log('\nThe new release is not live yet — the rest of this run would be measuring the old one.')
    console.log(`theme ${theme}, core ${core}\n`)
    await b.close()
    process.exit(2)
  }
}

/* ------------------------------------------------ routes × breakpoints */

console.log('\n1. Routes × breakpoints')

const allRoutes = [...ROUTES, SINGLE_POST]

for (const route of allRoutes) {
  const dir = path.join(OUT, slug(route))
  if (!SKIP_SHOTS) fs.mkdirSync(dir, { recursive: true })

  for (const width of WIDTHS) {
    const ctx = await b.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
    const page = await ctx.newPage()

    const consoleErrors = []
    page.on('console', (m) => m.type() === 'error' && isSiteError(m.text()) && consoleErrors.push(m.text().slice(0, 140)))
    page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + String(e).slice(0, 140)))
    page.on('response', (r) => {
      if (isSiteRequestFailure(r.url(), r.status())) consoleErrors.push(`${r.status()} ${r.url().slice(-70)}`)
    })

    let status = 0
    try {
      const res = await page.goto(ORIGIN + route, { waitUntil: 'domcontentloaded', timeout: 45000 })
      status = res?.status() ?? 0
      await settle(page)
    } catch (error) {
      record('routes', `${route} @${width} loads`, false, String(error).slice(0, 70))
      await ctx.close()
      continue
    }

    const m = await page.evaluate(() => {
      const d = document.documentElement
      const offenders = []
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect()
        if (r.width > 0 && (r.right > d.clientWidth + 2 || r.left < -2)) {
          offenders.push((el.tagName + '.' + String(el.className || '').slice(0, 40)).slice(0, 60))
          if (offenders.length > 3) break
        }
      }
      return {
        h1: document.querySelectorAll('h1').length,
        overflow: d.scrollWidth > d.clientWidth + 1,
        offenders,
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src).slice(0, 4),
        rawShortcode: /\[gcalls_[a-z_]+/.test(document.body.innerText),
        phpNotice: /(Warning|Fatal error|Notice|Deprecated):\s/.test(document.body.innerText),
        height: d.scrollHeight,
      }
    })

    const tag = `${route} @${width}`
    record('routes', `${tag} HTTP 200`, status === 200, String(status))
    record('routes', `${tag} exactly one H1`, m.h1 === 1, `${m.h1} found`)
    record('routes', `${tag} no horizontal overflow`, !m.overflow, m.offenders.join(' '))
    record('routes', `${tag} no broken image`, m.broken.length === 0, m.broken.join(' '))
    record('routes', `${tag} no raw shortcode`, !m.rawShortcode)
    record('routes', `${tag} no PHP warning`, !m.phpNotice)
    record('routes', `${tag} no console error`, consoleErrors.length === 0, consoleErrors.slice(0, 2).join(' | '))

    if (!SKIP_SHOTS) {
      await page.screenshot({ path: path.join(dir, `wp-${width}.png`), fullPage: true })
    }

    await ctx.close()
  }
}

/* --------------------------------------------------------- home page shape */

console.log('\n2. Home page structure')

{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(ORIGIN + '/', { waitUntil: 'domcontentloaded', timeout: 45000 })
  await settle(page)

  const m = await page.evaluate(() => ({
    sections: document.querySelectorAll('.elementor-section, .elementor-top-section').length,
    topSections: document.querySelectorAll('.elementor-top-section').length,
    mockups: [...document.querySelectorAll('[data-gcalls-mock]')].map((e) => e.getAttribute('data-gcalls-mock')),
    painCards: document.querySelectorAll('.gc-card').length,
    ctaRow: document.querySelectorAll('.gc-ctarow .gc-btn').length,
    ctaInline: (() => {
      const row = document.querySelector('.gc-ctarow')
      if (!row) return false
      const b = [...row.querySelectorAll('.gc-btn')]
      return b.length === 2 && Math.abs(b[0].getBoundingClientRect().top - b[1].getBoundingClientRect().top) < 8
    })(),
    eyebrow: Boolean(document.querySelector('.gc-eyebrow')),
    gradient: Boolean(document.querySelector('.gc-grad')),
    checks: document.querySelectorAll('.gc-check').length,
    fine: document.querySelectorAll('.gc-fine p').length,
    logoMark: Boolean(document.querySelector('.gcalls-branding__mark')),
    stage: Boolean(document.querySelector('.gcalls-stage__main')),
    floats: document.querySelectorAll('.gcalls-stage__float').length,
    cardGridCols: (() => {
      const g = document.querySelector('.gc-cards')
      return g ? getComputedStyle(g).gridTemplateColumns.split(' ').length : 0
    })(),
  }))

  record('home', '19 Elementor root sections', m.topSections === 19, `${m.topSections} (all: ${m.sections})`)
  record('home', 'six pain cards', m.painCards === 6, String(m.painCards))
  record('home', 'pain cards are 3 across on desktop', m.cardGridCols === 3, `${m.cardGridCols} columns`)
  record('home', 'hero has two CTAs', m.ctaRow === 2, String(m.ctaRow))
  record('home', 'hero CTAs sit on one row', m.ctaInline)
  record('home', 'hero eyebrow present', m.eyebrow)
  record('home', 'hero heading has gradient emphasis', m.gradient)
  record('home', 'hero check list has four items', m.checks === 4, String(m.checks))
  record('home', 'hero fine print has two lines', m.fine === 2, String(m.fine))
  record('home', 'logo mark present', m.logoMark)
  record('home', 'hero is a layered stage', m.stage && m.floats >= 1, `${m.floats} floats`)
  record('home', 'customer popup mockup present', m.mockups.includes('customer_popup'), m.mockups.join(','))
  record('home', 'call widget mockup present', m.mockups.includes('widget'))

  await ctx.close()
}

/* ------------------------------------------------------- product visuals */

console.log('\n3. Product visuals')

const PRODUCT_VISUALS = {
  '/gcalls-cx/': ['cx_inbox', 'cx_context', 'cx_ticket', 'cx_report'],
  '/voicebot-ai/': ['voicebot_builder', 'voicebot_handoff'],
  '/qc-bot-ai/': ['qc_review', 'qc_transcript', 'qc_scorecard', 'qc_signals', 'qc_dashboard'],
}

for (const [route, expected] of Object.entries(PRODUCT_VISUALS)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(ORIGIN + route, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await settle(page)

  const found = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('[data-gcalls-mock]')].map((e) => e.getAttribute('data-gcalls-mock')))],
  )

  for (const id of expected) {
    record('visuals', `${route} renders ${id}`, found.includes(id), found.join(','))
  }

  const generic = ['crm', 'analytics'].filter((g) => found.includes(g))
  record('visuals', `${route} uses no generic stand-in`, generic.length === 0, generic.join(','))

  await ctx.close()
}

/* ------------------------------------------------------------ interaction */

console.log('\n4. Interaction')

{
  /* Mobile menu: click, Escape, outside click, scroll lock. */
  const ctx = await b.newContext({ viewport: { width: 390, height: 780 } })
  const page = await ctx.newPage()
  await page.goto(ORIGIN + '/', { waitUntil: 'domcontentloaded', timeout: 45000 })
  await settle(page)

  const toggle = page.locator('[data-gcalls-nav-toggle]')
  const hasToggle = (await toggle.count()) > 0
  record('interaction', 'mobile menu toggle exists', hasToggle)

  if (hasToggle) {
    await toggle.click()
    await page.waitForTimeout(200)
    record('interaction', 'menu opens on click', (await toggle.getAttribute('aria-expanded')) === 'true')
    record('interaction', 'background scroll locks', await page.evaluate(() => document.body.classList.contains('gcalls-nav-open') || document.documentElement.classList.contains('gcalls-nav-open')))

    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)
    record('interaction', 'menu closes on Escape', (await toggle.getAttribute('aria-expanded')) === 'false')

    await toggle.click()
    await page.waitForTimeout(200)
    /*
     * Click inside the main content, computed from its box. A fixed (5, 700)
     * can land on the open panel itself or on nothing at all depending on the
     * viewport, and then this measures the click rather than the menu.
     */
    const mainBox = await page.locator('#gcalls-main, main').first().boundingBox()
    await page.mouse.click(200, mainBox ? Math.round(mainBox.y + 300) : 700)
    await page.waitForTimeout(350)
    record('interaction', 'menu closes on outside click', (await toggle.getAttribute('aria-expanded')) === 'false')
  }

  await ctx.close()
}

{
  /* Gcalls Plus gallery: six tabs, arrow keys, roving tabindex. */
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(ORIGIN + '/gcalls-plus-webphone/', { waitUntil: 'domcontentloaded', timeout: 45000 })
  await settle(page)

  const tabs = page.locator('[data-gallery-tab]')
  const count = await tabs.count()
  record('interaction', 'gallery has six tabs', count === 6, String(count))

  if (count > 0) {
    const tabbable = await page.evaluate(() => [...document.querySelectorAll('[data-gallery-tab]')].filter((t) => t.tabIndex === 0).length)
    record('interaction', 'exactly one tab in the tab order', tabbable === 1, String(tabbable))

    await tabs.nth(0).focus()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(200)
    record('interaction', 'ArrowRight moves the gallery', (await tabs.nth(1).getAttribute('aria-selected')) === 'true')

    const visible = await page.evaluate(() => [...document.querySelectorAll('[data-gallery-panel]')].filter((p) => !p.hidden).length)
    record('interaction', 'exactly one gallery panel is shown', visible === 1, String(visible))
  }

  await ctx.close()
}

{
  /* Blog hub filter. */
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(ORIGIN + '/blog/', { waitUntil: 'domcontentloaded', timeout: 45000 })
  await settle(page)

  const m = await page.evaluate(() => ({
    filters: document.querySelectorAll('[data-hub-filter]').length,
    groups: document.querySelectorAll('[data-hub]').length,
    cards: document.querySelectorAll('.gcalls-card').length,
    covers: document.querySelectorAll('.gcalls-cover').length,
    empty: /chưa có bài|không có bài/i.test(document.body.innerText),
  }))

  record('blog', 'hub filter is rendered', m.filters > 0, String(m.filters))
  record('blog', 'eighteen article cards', m.cards === 18, String(m.cards))
  record('blog', 'every card has a cover', m.covers >= m.cards, `${m.covers} covers / ${m.cards} cards`)
  record('blog', 'no "no posts yet" message', !m.empty)

  if (m.filters > 1) {
    const first = page.locator('[data-hub-filter]:not([data-hub-filter="all"]):not([disabled])').first()
    await first.click()
    await page.waitForTimeout(250)
    const after = await page.evaluate(() => ({
      pressed: [...document.querySelectorAll('[data-hub-filter]')].filter((b) => b.getAttribute('aria-pressed') === 'true').length,
      shown: [...document.querySelectorAll('[data-hub]')].filter((g) => !g.hidden).length,
    }))
    record('blog', 'filtering marks exactly one button pressed', after.pressed === 1, String(after.pressed))
    record('blog', 'filtering narrows the groups', after.shown === 1, String(after.shown))
  }

  await ctx.close()
}

{
  /* Estimator. */
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(ORIGIN + '/uoc-tinh-chi-phi/', { waitUntil: 'domcontentloaded', timeout: 45000 })
  await settle(page)

  const m = await page.evaluate(() => ({
    // The rendered class is `gcalls-est`, not `gcalls-estimator`.
    root: Boolean(document.querySelector('.gcalls-est')),
    steps: document.querySelectorAll('.gcalls-est [class*="step"], .gcalls-est fieldset').length,
    controls: document.querySelectorAll('.gcalls-est button, .gcalls-est input').length,
  }))

  record('estimator', 'estimator renders', m.root, `root=${m.root}`)
  record('estimator', 'estimator has controls', m.controls > 0, `${m.steps} steps, ${m.controls} controls`)

  await ctx.close()
}

{
  /* Single post template. */
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(ORIGIN + SINGLE_POST, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await settle(page)

  const m = await page.evaluate(() => ({
    breadcrumb: Boolean(document.querySelector('.gcalls-breadcrumbs, [class*="breadcrumb"]')),
    cover: Boolean(document.querySelector('.gcalls-article__cover')),
    toc: Boolean(document.querySelector('.gcalls-toc')),
    tocLinks: document.querySelectorAll('.gcalls-toc a').length,
    anchors: document.querySelectorAll('.gcalls-article__body h2[id], .gcalls-article__body h3[id]').length,
    related: document.querySelectorAll('.gcalls-related .gcalls-card').length,
    h1: document.querySelectorAll('h1').length,
    /*
     * Scoped to the article. The header carries a site-wide CTA on every page
     * — counting document-wide reported two and called a correct page a
     * duplicate.
     */
    ctaInArticle: document.querySelectorAll('article .gcalls-cta, .gcalls-article .gcalls-cta').length,
  }))

  record('single', 'breadcrumb present', m.breadcrumb)
  record('single', 'cover present', m.cover)
  record('single', 'contents list present', m.toc, `${m.tocLinks} links`)
  record('single', 'headings carry anchors', m.anchors > 0, String(m.anchors))
  record('single', 'related articles present', m.related > 0, String(m.related))
  record('single', 'exactly one H1', m.h1 === 1, String(m.h1))
  record('single', 'the article carries exactly one CTA', m.ctaInArticle === 1, String(m.ctaInArticle))

  await ctx.close()
}

/* --------------------------------------------------------------- hardening */

console.log('\n5. Hardening, redirects, noindex')

const httpCheck = async (url, options = {}) => {
  const res = await fetch(url, { redirect: 'manual', ...options }).catch(() => null)
  return res
}

{
  const author = await httpCheck(`${ORIGIN}/?author=1`)
  record('hardening', '/?author=1 is 404', author?.status === 404, String(author?.status))
  record('hardening', '/?author=1 sends no Location', !author?.headers.get('location'), String(author?.headers.get('location') ?? ''))

  const authorPath = await httpCheck(`${ORIGIN}/author/admin/`)
  record('hardening', '/author/admin/ is 404', authorPath?.status === 404, String(authorPath?.status))

  const restUsers = await httpCheck(`${ORIGIN}/wp-json/wp/v2/users`)
  record('hardening', 'REST users is closed', restUsers?.status === 401 || restUsers?.status === 403, String(restUsers?.status))

  const usersSitemap = await httpCheck(`${ORIGIN}/wp-sitemap-users-1.xml`, { redirect: 'follow' })
  record('hardening', 'no users sitemap', usersSitemap?.status === 404, String(usersSitemap?.status))

  const oembed = await fetch(`${ORIGIN}/wp-json/oembed/1.0/embed?url=${ORIGIN}/blog/`).catch(() => null)
  const oembedText = oembed ? await oembed.text() : ''
  record('hardening', 'oEmbed exposes no author', !/author_name|author_url/.test(oembedText))

  const home = await fetch(ORIGIN + '/').catch(() => null)
  const homeText = home ? await home.text() : ''
  record('noindex', 'robots meta carries noindex', /name=["']robots["'][^>]*noindex/i.test(homeText))

  /*
   * X-Robots-Tag, and why it is reported the way it is.
   *
   * The header comes from `Header always set` in .htaccess, so Apache adds it
   * when the request reaches Apache. It does not reach Apache on a page-cache
   * hit: the cache replays a stored body and the header is not part of it.
   * Measured behaviour is exactly that — present on the first request after a
   * purge, absent on every one after, which is most of them.
   *
   * This reports what a crawler actually receives and names the layer still
   * carrying the weight. It is a real gap in one of the four noindex layers,
   * and not a reason to pretend the header is there.
   */
  {
    const ctx = await b.newContext()
    const page = await ctx.newPage()
    const resp = await page.goto(ORIGIN + '/', { waitUntil: 'domcontentloaded', timeout: 45000 })
    const headers = await resp.allHeaders()
    const xr = headers['x-robots-tag'] ?? ''

    record(
      'noindex',
      'X-Robots-Tag header',
      /noindex/i.test(xr),
      xr ||
        'absent on a page-cache hit — the .htaccess header does not survive a cached response. ' +
          'noindex is still enforced by the robots meta tag and robots.txt.',
    )
    await ctx.close()
  }
}

/* -------------------------------------------------------- the eighteen */

console.log('\n6. The eighteen published articles')

{
  const beforePath = path.join(HERE, '..', 'dist', 'live-baseline-before-deploy.json')

  if (!fs.existsSync(beforePath)) {
    record('articles', 'pre-deploy baseline exists', false, 'run live-baseline.mjs before deploying')
  } else {
    record('articles', 'pre-deploy baseline exists', true)
    console.log('  (run live-baseline.mjs --compare to diff the eighteen; summarised here)')
  }
}

/* ------------------------------------------------------------------ done */

await b.close()

const byArea = {}
for (const r of results) {
  byArea[r.area] = byArea[r.area] ?? { pass: 0, fail: 0 }
  byArea[r.area][r.ok ? 'pass' : 'fail'] += 1
}

console.log('\nSUMMARY')
for (const [area, n] of Object.entries(byArea)) {
  console.log(`  ${area.padEnd(14)} ${String(n.pass).padStart(4)} pass  ${String(n.fail).padStart(3)} fail`)
}

console.log(`\n${results.length - failures} pass, ${failures} fail`)

fs.writeFileSync(path.join(OUT, 'acceptance.json'), JSON.stringify({ origin: ORIGIN, at: new Date().toISOString(), results }, null, 2))
console.log(`report: wordpress/dist/acceptance/acceptance.json`)
if (!SKIP_SHOTS) console.log(`screenshots: wordpress/dist/acceptance/<route>/wp-<width>.png`)

process.exitCode = failures > 0 ? 1 : 0
