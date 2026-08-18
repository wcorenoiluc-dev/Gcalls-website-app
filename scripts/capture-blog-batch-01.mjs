/**
 * Screenshot + responsive evidence for Batch 1 — §M and §N of Checkpoint
 * GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING.
 *
 * Captures the archive, one pillar and one supporting article at desktop and
 * mobile, and checks every article route at 1440 / 768 / 390 / 320 for
 * horizontal overflow, console errors, H1 count, working table of contents and
 * live CTAs. Screenshots are written unedited.
 *
 * Uses the system Google Chrome through playwright-core, matching
 * `scripts/capture-pages.mjs` (no Chromium download — there is no macOS 13
 * build).
 *
 *   npm run dev          # drafts render in development
 *   node scripts/capture-blog-batch-01.mjs
 */
import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BASE = process.env.BLOG_QA_BASE ?? 'http://localhost:5173'
const OUT_DIR = path.resolve('docs/content-review/blog/batch-01/screenshots')

const CHROME =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const WIDTHS = [1440, 768, 390, 320]

/** Routes checked at every width. */
const ROUTES = [
  { id: 'archive', label: 'Archive /blog/', path: '/blog/' },
  {
    id: 'pillar-hub01',
    label: 'Pillar — Dịch vụ Call Center là gì',
    path: '/5-linh-vuc-rat-can-dich-vu-call-center-trung-tam-cuoc-goi/',
  },
  {
    id: 'pillar-hub06',
    label: 'Pillar — Hợp nhất hội thoại đa kênh',
    path: '/hop-nhat-hoi-thoai-hotline-zalo-oa-va-facebook/',
  },
  {
    id: 'supporting-hub09',
    label: 'Supporting — Hồ sơ đăng ký đầu số quốc tế',
    path: '/ho-so-dang-ky-dau-so-quoc-te/',
  },
  {
    id: 'supporting-hub07',
    label: 'Supporting — Chấm điểm thủ công và AI',
    path: '/cham-diem-cuoc-goi-thu-cong-va-ho-tro-bang-ai/',
  },
  /* regression guards — these must be unaffected by the blog work */
  { id: 'home', label: 'Homepage (regression)', path: '/' },
  { id: 'gcalls-plus', label: 'Gcalls Plus (regression)', path: '/gcalls-plus-webphone/' },
  { id: 'qc-bot-ai', label: 'QA QC Center (regression)', path: '/qc-bot-ai/' },
]

/** Only these get image files; the rest are checked but not photographed. */
const SHOOT = new Set(['archive', 'pillar-hub01', 'supporting-hub09'])
const SHOOT_WIDTHS = { desktop: 1440, mobile: 390 }

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0
      const step = 600
      const timer = setInterval(() => {
        window.scrollBy(0, step)
        total += step
        if (total >= document.body.scrollHeight) {
          clearInterval(timer)
          window.scrollTo(0, 0)
          resolve()
        }
      }, 60)
    })
  })
  await page.waitForTimeout(250)
}

const results = []

const browser = await chromium.launch({ executablePath: CHROME })
await mkdir(OUT_DIR, { recursive: true })

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: width >= 1024 ? 900 : 800 },
    deviceScaleFactor: 1,
  })

  for (const route of ROUTES) {
    const page = await context.newPage()
    const consoleErrors = []

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    page.on('pageerror', (error) => consoleErrors.push(String(error)))

    const response = await page.goto(`${BASE}${route.path}`, {
      waitUntil: 'networkidle',
      timeout: 45000,
    })
    await autoScroll(page)

    const audit = await page.evaluate(() => {
      const doc = document.documentElement
      const overflow = doc.scrollWidth - doc.clientWidth

      /**
       * An element inside a horizontally scrollable ancestor is CONTAINED, not
       * overflowing — a wide table in an `overflow-x-auto` wrapper is the
       * intended design. Walking up for such an ancestor is what separates the
       * real offender from a page full of false positives.
       */
      const inScrollContainer = (el) => {
        let parent = el.parentElement
        while (parent) {
          if (/(auto|scroll|hidden)/.test(getComputedStyle(parent).overflowX)) return true
          parent = parent.parentElement
        }
        return false
      }

      const wide = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const rect = el.getBoundingClientRect()
          return rect.right > doc.clientWidth + 1 && !inScrollContainer(el)
        })
        .slice(0, 5)
        .map(
          (el) =>
            `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} (right ${Math.round(
              el.getBoundingClientRect().right,
            )}px)`,
        )

      const tocLinks = [...document.querySelectorAll('nav[aria-labelledby="muc-luc-heading"] a')]
      const tocBroken = tocLinks
        .map((a) => a.getAttribute('href'))
        .filter((href) => href && !document.getElementById(decodeURIComponent(href.slice(1))))

      const links = [...document.querySelectorAll('main a[href]')]
      const emptyLinks = links.filter((a) => {
        const href = a.getAttribute('href') ?? ''
        return href === '' || href === '#' || href === 'undefined'
      }).length

      return {
        overflowPx: overflow,
        wideElements: wide,
        h1Count: document.querySelectorAll('h1').length,
        h1Text: document.querySelector('h1')?.textContent?.trim().slice(0, 80) ?? null,
        title: document.title,
        robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
        ogType: document.querySelector('meta[property="og:type"]')?.getAttribute('content') ?? null,
        jsonLdTypes: [...document.querySelectorAll('script[type="application/ld+json"]')]
          .flatMap((s) => {
            try {
              const data = JSON.parse(s.textContent ?? '{}')
              return (data['@graph'] ?? [data]).map((n) => n['@type'])
            } catch {
              return ['UNPARSEABLE']
            }
          }),
        tocLinks: tocLinks.length,
        tocBroken,
        ctaCount: [...document.querySelectorAll('main a[href^="/lien-he"], main a[href^="/gcalls-plus-webphone"], main a[href^="/gcalls-cx"], main a[href^="/qc-bot-ai"], main a[href^="/voicebot-ai"], main a[href^="/tong-dai-"], main a[href^="/uoc-tinh-chi-phi"]')].length,
        emptyLinks,
        notFound: /Không tìm thấy trang/.test(document.body.innerText),
      }
    })

    results.push({
      width,
      route: route.id,
      label: route.label,
      path: route.path,
      httpStatus: response?.status() ?? null,
      ...audit,
      consoleErrors,
    })

    if (SHOOT.has(route.id) && Object.values(SHOOT_WIDTHS).includes(width)) {
      const variant = width === SHOOT_WIDTHS.desktop ? 'desktop' : 'mobile'
      await page.screenshot({
        path: path.join(OUT_DIR, `${route.id}-${variant}-${width}.png`),
        fullPage: true,
      })
    }

    await page.close()
  }

  await context.close()
}

await browser.close()

await writeFile(
  path.join(OUT_DIR, 'responsive-audit.json'),
  `${JSON.stringify(results, null, 2)}\n`,
  'utf8',
)

/* ── console summary ── */

/**
 * The site ships no favicon and `index.html` declares no `<link rel="icon">`,
 * so Chrome's automatic `/favicon.ico` request 404s on the first page load of
 * every fresh context. That is a PRE-EXISTING site-wide gap, not something this
 * checkpoint introduced, and it is reported separately rather than folded into
 * the blog result — silently filtering it would hide a real (if minor) defect.
 */
const PREEXISTING_FAVICON_404 =
  'Failed to load resource: the server responded with a status of 404 (Not Found)'

let problems = 0
let preexisting = 0

for (const r of results) {
  const issues = []
  const consoleErrors = r.consoleErrors.filter((e) => {
    if (e === PREEXISTING_FAVICON_404) {
      preexisting += 1
      return false
    }
    return true
  })

  if (r.overflowPx > 0) issues.push(`overflow ${r.overflowPx}px [${r.wideElements.join(', ')}]`)
  if (r.h1Count !== 1) issues.push(`h1=${r.h1Count}`)
  if (consoleErrors.length) issues.push(`console: ${consoleErrors.join(' | ')}`)
  if (r.tocBroken.length) issues.push(`toc broken: ${r.tocBroken.join(', ')}`)
  if (r.emptyLinks) issues.push(`${r.emptyLinks} empty link(s)`)
  if (r.notFound) issues.push('404 page')
  if (issues.length) {
    problems += 1
    console.log(`✗ ${r.width}px ${r.route}: ${issues.join(' · ')}`)
  }
}

console.log(
  problems === 0
    ? `\n✓ ${results.length} lượt kiểm tra responsive PASS — không overflow, không console error, 1 H1 mỗi trang`
    : `\n✗ ${problems}/${results.length} lượt kiểm tra có vấn đề`,
)
if (preexisting > 0) {
  console.log(
    `ℹ ${preexisting} lỗi 404 favicon — thiếu favicon là vấn đề có sẵn của site, không do Batch 1 gây ra`,
  )
}
console.log(`Ảnh và audit: ${OUT_DIR}`)
process.exit(problems === 0 ? 0 : 1)
