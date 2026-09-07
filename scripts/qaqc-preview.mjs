/**
 * Preview capture for /qc-bot-ai/ (QA QC Center).
 *
 * Produces the handover set required by the Gcalls Plus UI v2 brief:
 *   - one full-page shot per breakpoint (1440 / 1024 / 768 / 390 / 320)
 *   - hero crops at desktop and mobile
 *   - a crop of every section that carries a real product screenshot
 *   - metrics.json: page height, per-section height, gap between sections,
 *     horizontal-overflow check and mockup census
 *
 * The metrics file is what the before/after comparison is built from, so the
 * numbers in the report are measured rather than estimated.
 *
 * Usage: node scripts/qaqc-preview.mjs <outDir> [baseUrl]
 */
import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve(process.argv[2] ?? 'preview')
const BASE = process.argv[3] ?? 'http://localhost:5201'
const URL = `${BASE}/qc-bot-ai/`

const BREAKPOINTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '1280', width: 1280, height: 900 },
  { name: '1024', width: 1024, height: 800 },
  { name: '768', width: 768, height: 900 },
  { name: '390', width: 390, height: 844 },
  { name: '320', width: 320, height: 640 },
]

/** Let lazy images and the gradient headings settle before shooting. */
async function settle(page) {
  await page.evaluate(async () => {
    window.scrollTo(0, 0)
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
    await Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map((img) => new Promise((r) => { img.onload = img.onerror = r })),
    )
  })
  await page.waitForTimeout(400)
}

/**
 * Section geometry.
 *
 * `main > *` is the page's section list. The gap is the distance between one
 * section's painted bottom and the next one's top — which is what the brief's
 * "khoảng cách giữa hai composition" refers to, not the CSS padding value.
 */
async function measure(page) {
  return page.evaluate(() => {
    const root =
      document.querySelector('.qq-page') ?? document.querySelector('main') ?? document.body
    const sections = Array.from(root.querySelectorAll(':scope > *'))
    const boxes = sections.map((el) => {
      const r = el.getBoundingClientRect()
      const heading = el.querySelector('h1, h2')
      return {
        tag: el.tagName.toLowerCase(),
        label: heading?.textContent?.trim().slice(0, 60) ?? '(no heading)',
        top: Math.round(r.top + window.scrollY),
        height: Math.round(r.height),
      }
    })
    const gaps = boxes.slice(1).map((b, i) => {
      const prev = boxes[i]
      return {
        between: `${prev.label} → ${b.label}`,
        gap: b.top - (prev.top + prev.height),
      }
    })
    return {
      pageHeight: Math.round(document.documentElement.scrollHeight),
      docWidth: Math.round(document.documentElement.scrollWidth),
      viewportWidth: window.innerWidth,
      horizontalOverflow:
        document.documentElement.scrollWidth > window.innerWidth + 1,
      h1Count: document.querySelectorAll('h1').length,
      h2Count: document.querySelectorAll('h2').length,
      sectionCount: boxes.length,
      images: Array.from(document.images).map((img) => ({
        src: new URL(img.currentSrc || img.src, location.href).pathname,
        natural: `${img.naturalWidth}x${img.naturalHeight}`,
        rendered: `${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)}`,
        upscaled:
          img.naturalWidth > 0 &&
          img.getBoundingClientRect().width > img.naturalWidth + 1,
        altLength: img.alt.length,
      })),
      sections: boxes,
      gaps,
    }
  })
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const metrics = {}

await mkdir(OUT, { recursive: true })

for (const bp of BREAKPOINTS) {
  const ctx = await browser.newContext({
    viewport: { width: bp.width, height: bp.height },
    deviceScaleFactor: 1,
  })
  const page = await ctx.newPage()
  const consoleErrors = []
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
  page.on('pageerror', (e) => consoleErrors.push(String(e)))

  await page.goto(URL, { waitUntil: 'networkidle' })
  await settle(page)

  // The page-scope class only exists once the layout pass has been applied, so
  // the "before" run has to fall back to `main`.
  const rootSel = (await page.locator('.qq-page').count()) ? '.qq-page' : 'main'

  await page.screenshot({
    path: path.join(OUT, `fullpage-${bp.name}.png`),
    fullPage: true,
  })

  metrics[bp.name] = { ...(await measure(page)), consoleErrors }

  // Hero crop at the two breakpoints the brief calls out by name.
  if (bp.name === '1440' || bp.name === '390') {
    const hero = page.locator(`${rootSel} > section`).first()
    await hero.screenshot({ path: path.join(OUT, `hero-${bp.name}.png`) })
  }

  // One crop per section carrying a real product screenshot, desktop only.
  if (bp.name === '1440') {
    const sections = page.locator(`${rootSel} > section`)
    const n = await sections.count()
    for (let i = 0; i < n; i += 1) {
      const s = sections.nth(i)
      // QA/QC surfaces are DOM, not <img>, so key on the stage marker.
      if ((await s.locator('[data-qq-visual]').count()) === 0) continue
      const label = (await s.locator('h1, h2').first().textContent()) ?? `section-${i}`
      const slug = label
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/gi, 'd')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 48)
      await s.screenshot({
        path: path.join(OUT, `section-${String(i + 1).padStart(2, '0')}-${slug}.png`),
      })
    }
  }

  await ctx.close()
}

await browser.close()
await writeFile(path.join(OUT, 'metrics.json'), JSON.stringify(metrics, null, 2))

for (const [name, m] of Object.entries(metrics)) {
  console.log(
    `${name.padEnd(5)} h=${String(m.pageHeight).padStart(6)}px  sections=${m.sectionCount}  h1=${m.h1Count}  overflow=${m.horizontalOverflow}  upscaled=${m.images.filter((i) => i.upscaled).length}  errors=${m.consoleErrors.length}`,
  )
}
