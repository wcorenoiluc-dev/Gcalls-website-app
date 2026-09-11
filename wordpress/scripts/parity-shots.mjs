/**
 * Full-page screenshots of the React source and the WordPress site, side by
 * side, at the five breakpoints the 010 brief names.
 *
 * The React app is the source of truth, so it is the left-hand column in every
 * comparison. Nothing here edits anything: it loads two URLs and writes PNGs.
 *
 *   node wordpress/scripts/parity-shots.mjs [--routes /,/gcalls-cx/] [--only react|wp]
 *
 * Output lands in wordpress/dist/parity/<route>/<source>-<width>.png, and a
 * summary line per shot reports the full-page height and whether the document
 * scrolled sideways — horizontal overflow is an acceptance gate, and it is
 * measured here rather than eyeballed.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'dist', 'parity')

const REACT = process.env.REACT_ORIGIN ?? 'http://localhost:5177'
const WP = process.env.WP_ORIGIN ?? 'https://ashernguyenxuanthuy.com'

const WIDTHS = [1440, 1024, 768, 390, 320]

const arg = (name, fallback) => {
  const hit = process.argv.find(a => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}

const ROUTES = arg('routes', '/,/gcalls-plus-webphone/,/gcalls-cx/,/voicebot-ai/,/qc-bot-ai/,/uoc-tinh-chi-phi/,/blog/')
  .split(',')
  .filter(Boolean)

const ONLY = arg('only', 'both')

/**
 * What to call the shot on disk.
 *
 * The label used to be hardwired to the origin's role — "react" for whatever
 * REACT_ORIGIN pointed at. Pointing that at the WordPress preview renderer
 * then produced files named `react-1440.png` that were in fact WordPress
 * output, which is evidence that argues against itself. The label is now
 * explicit, so a file called wp-preview-1440.png was produced by the
 * WordPress renderer and nothing else.
 */
const LABEL = arg('label', '')

// The dot matters: a route like /preview.html would otherwise name its output
// directory "preview.html", and mkdir then collides with the file of that name
// sitting beside it.
const slug = route =>
  route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-')

/**
 * Playwright 1.62 refuses to download a chromium build for macOS 13, which is
 * what this machine runs, so its own browser cache is empty and
 * `chromium.launch()` fails outright. The installed Google Chrome is the same
 * engine and Playwright can drive it directly, so that is what this uses —
 * with the bundled build as the first choice, for whoever runs this on a
 * newer machine or in CI.
 */
const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
]

async function browser() {
  try {
    return await chromium.launch()
  } catch (bundled) {
    const { existsSync } = await import('node:fs')
    const found = CHROME_PATHS.find(p => existsSync(p))
    if (!found) throw bundled
    console.log(`(no bundled chromium — driving ${path.basename(found)})\n`)
    return chromium.launch({ executablePath: found })
  }
}

/** Waits for the network to settle, then for fonts, so text is not mid-swap. */
async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.evaluate(() => document.fonts?.ready).catch(() => {})
  // Lazy images below the fold never load unless the page is scrolled.
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let y = 0
      const step = () => {
        y += window.innerHeight
        window.scrollTo(0, y)
        if (y < document.body.scrollHeight) setTimeout(step, 60)
        else {
          window.scrollTo(0, 0)
          setTimeout(resolve, 250)
        }
      }
      step()
    })
  })
  await page.waitForTimeout(350)
}

const rows = []

const b = await browser()

for (const route of ROUTES) {
  const dir = path.join(OUT, slug(route))
  await mkdir(dir, { recursive: true })

  for (const [role, origin] of [
    ['react', REACT],
    ['wp', WP],
  ]) {
    if (ONLY !== 'both' && ONLY !== role) continue
    const label = LABEL || role

    for (const width of WIDTHS) {
      const ctx = await b.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36 gcalls-parity-audit',
      })
      const page = await ctx.newPage()

      const consoleErrors = []
      page.on('console', m => m.type() === 'error' && consoleErrors.push(m.text().slice(0, 120)))
      page.on('pageerror', e => consoleErrors.push('pageerror: ' + String(e).slice(0, 120)))

      const url = origin.replace(/\/$/, '') + route
      let status = 0
      try {
        const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
        status = resp?.status() ?? 0
        await settle(page)
      } catch (err) {
        rows.push({ route, label, width, status: 0, note: 'LOAD FAILED ' + String(err).slice(0, 60) })
        await ctx.close()
        continue
      }

      const metrics = await page.evaluate(() => {
        const d = document.documentElement
        // Which elements actually stick out past the viewport, if any.
        const over = []
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect()
          if (r.width > 0 && (r.right > d.clientWidth + 2 || r.left < -2)) {
            over.push((el.tagName + '.' + (el.className || '').toString().slice(0, 40)).slice(0, 60))
            if (over.length > 4) break
          }
        }
        return {
          height: d.scrollHeight,
          overflow: d.scrollWidth > d.clientWidth + 1,
          scrollWidth: d.scrollWidth,
          clientWidth: d.clientWidth,
          offenders: over,
          h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim().slice(0, 60)),
          brokenImages: [...document.images]
            .filter(i => i.complete && i.naturalWidth === 0)
            .map(i => i.currentSrc || i.src)
            .slice(0, 5),
        }
      })

      await page.screenshot({ path: path.join(dir, `${label}-${width}.png`), fullPage: true })
      await ctx.close()

      rows.push({
        route,
        label,
        width,
        status,
        height: metrics.height,
        overflow: metrics.overflow,
        over: metrics.overflow ? `${metrics.scrollWidth}>${metrics.clientWidth} ${metrics.offenders.join(' ')}` : '',
        h1: metrics.h1.length,
        broken: metrics.brokenImages.length,
        errors: consoleErrors.length,
        errorText: consoleErrors.slice(0, 2).join(' | '),
      })

      console.log(
        `${slug(route).padEnd(22)} ${label.padEnd(5)} ${String(width).padStart(4)}  ` +
          `${status}  h=${String(metrics.height).padStart(6)}  ` +
          `${metrics.overflow ? 'OVERFLOW' : 'ok      '}  h1=${metrics.h1.length}  ` +
          `broken=${metrics.brokenImages.length}  err=${consoleErrors.length}`
      )
    }
  }
}

await b.close()
await writeFile(path.join(OUT, 'parity-metrics.json'), JSON.stringify(rows, null, 2))
console.log(`\nshots + metrics in ${OUT}`)
