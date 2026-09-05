/**
 * Content + media + UI assertions for /gcalls-plus-webphone/.
 *
 * Runs against the rendered page rather than the source, so it catches a
 * section that stops rendering as well as one that stops existing. Source
 * files are read only where the rendered DOM cannot show the answer — which
 * imports a component uses, and whether other routes were touched.
 *
 * Usage: node scripts/verify-gcalls-plus.mjs [baseUrl]
 * Exits non-zero on the first failing group, and prints every failure.
 */
import { chromium } from 'playwright-core'
import { readFile, readdir } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.argv[2] ?? 'http://localhost:5199'
const URL = `${BASE}/gcalls-plus-webphone/`

const failures = []
const passes = []
const check = (name, ok, detail = '') =>
  ok ? passes.push(name) : failures.push(`${name}${detail ? ` — ${detail}` : ''}`)

/* ------------------------------------------------------------------ *
 * Expected structure. 17 CONTENT sections after the breadcrumb.
 *
 * WEBSITE_PAGES_OVERVIEW.md says 18 because it counts the breadcrumb as a
 * section. It is a `div`, not a `section`, so the two numbers describe the
 * same page. Nothing may be added or removed to make them match.
 * ------------------------------------------------------------------ */
const EXPECTED_SECTIONS = [
  'Gcalls Plus Webphone – tổng đài doanh nghiệp ngay trên trình duyệt',
  'Gcalls Plus Webphone là gì?',
  'Một đội ngũ nhỏ cũng cần quy trình nghe gọi chuyên nghiệp',
  'Webphone đưa chức năng tổng đài vào trình duyệt',
  'Các chức năng cần thiết cho hoạt động nghe gọi hằng ngày',
  'Theo dõi hành trình tương tác thay vì chỉ nhìn từng cuộc gọi riêng lẻ',
  'Hiểu khách hàng trước khi tiếp tục cuộc hội thoại',
  'Từ cuộc gọi đến bước follow-up tiếp theo',
  'Theo dõi hoạt động cuộc gọi của đội ngũ từ dữ liệu tập trung',
  'Mở rộng Gcalls Plus vào quy trình CRM khi doanh nghiệp cần',
  'Gcalls Plus phù hợp với những đội ngũ nào?',
  'Phù hợp khi doanh nghiệp cần sự gọn nhẹ trước khi cần một Contact Center phức tạp',
  'Triển khai theo nhu cầu vận hành thực tế',
  'Chi phí phụ thuộc vào cấu hình đội ngũ và nhu cầu sử dụng',
  'Đồng hành cùng nhiều mô hình doanh nghiệp khác nhau',
  'Câu hỏi thường gặp về Gcalls Plus Webphone',
  'Bắt đầu với một hệ thống nghe gọi phù hợp với cách đội ngũ của bạn đang làm việc',
]

/** Only these files may be requested by this page. */
const MEDIA_ALLOWLIST = new Set([
  'gcalls-plus-webphone-desktop-v1.webp',
  'gcalls-plus-webphone-active-call-mobile-v1.webp',
  'gcalls-plus-webphone-keypad-mobile-v1.webp',
  'gcalls-plus-overview-activity-desktop-v1.webp',
  'gcalls-plus-timeline-history-desktop-v1.webp',
  'gcalls-plus-contact-profile-desktop-v1.webp',
  'gcalls-plus-agent-status-log-desktop-v1.webp',
  'gcalls-plus-integrations-desktop-v1.webp',
])

/**
 * Claims the approved source forbids on this page (source doc §14, P01-B §24).
 * Each is a regex over the page's visible text.
 */
const FORBIDDEN_CLAIMS = [
  [/\b\d{1,3}\s*%/, 'a percentage figure'],
  [/\b(?:cài đặt|triển khai)\s+(?:trong\s+)?\d+\s*phút/i, 'a deployment-time promise'],
  [/không\s+cần\s+IT/i, '"không cần IT"'],
  [/\buptime\b/i, 'an uptime claim'],
  [/\b\d[\d.,]*\+?\s*(?:khách hàng|doanh nghiệp)\s+(?:đang|đã)\s+(?:sử dụng|tin dùng)/i, 'a customer count'],
  [/tiết kiệm\s+\d/i, 'a savings figure'],
]

/**
 * PII shapes. The captures are masked to all-zero numbers and example.com, so
 * anything matching a REAL Vietnamese subscriber number or a non-example
 * address in the page text is a regression.
 */
const PII_PATTERNS = [
  [/\b0(?!9?0{6,})(?:3|5|7|8|9)\d{8}\b/, 'a Vietnamese mobile number'],
  // `example.com` is what the masker writes over real addresses, and
  // `gcalls.co` is Gcalls' own published contact domain — neither is a leak.
  [/\b[\w.+-]+@(?!example\.com|gcalls\.co)[\w-]+\.[\w.]{2,}\b/, 'a third-party e-mail address'],
]

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

const requested = []
const consoleErrors = []
page.on('request', (r) => requested.push(r.url()))
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
page.on('response', (r) => {
  if (r.status() >= 400) consoleErrors.push(`HTTP ${r.status()} ${r.url()}`)
})
page.on('pageerror', (e) => consoleErrors.push(String(e)))

await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 40))
  }
  window.scrollTo(0, 0)
})
await page.waitForTimeout(600)

const dom = await page.evaluate(() => {
  const scope = document.querySelector('.gp-page')
  return {
    hasScope: Boolean(scope),
    breadcrumbs: scope ? scope.querySelectorAll('nav[aria-label], .breadcrumb, ol').length : 0,
    sectionTitles: Array.from(scope?.querySelectorAll(':scope > section') ?? []).map(
      (s) => s.querySelector('h1, h2')?.textContent?.trim() ?? '(no heading)',
    ),
    h1s: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent?.trim()),
    // Triggers only. The open panel also carries a `gp-faq-` id, so a plain
    // prefix match returns one more than there are questions.
    faqCount: document.querySelectorAll('[id^="gp-faq-button-"]').length,
    hrefs: Array.from(document.querySelectorAll('a')).map((a) => ({
      href: a.getAttribute('href') ?? '',
      text: a.textContent?.trim().slice(0, 40) ?? '',
    })),
    text: document.querySelector('.gp-page')?.innerText ?? '',
    images: Array.from(document.images).map((img) => ({
      file: new URL(img.currentSrc || img.src, location.href).pathname.split('/').pop(),
      alt: img.alt,
      w: img.getBoundingClientRect().width,
      natural: img.naturalWidth,
    })),
    containerWidths: Array.from(
      document.querySelectorAll('.gp-page .max-w-\\[1280px\\]'),
    ).map((el) => Math.round(el.getBoundingClientRect().width)),
    sectionPadding: Array.from(document.querySelectorAll('.gp-page > section')).map((s) => {
      const cs = getComputedStyle(s)
      return [parseFloat(cs.paddingTop), parseFloat(cs.paddingBottom)]
    }),
  }
})

/* -- 1. structure ------------------------------------------------- */
check('page scope class present', dom.hasScope)
check(
  'breadcrumb + 17 content sections',
  dom.sectionTitles.length === 17,
  `found ${dom.sectionTitles.length}`,
)
for (const [i, expected] of EXPECTED_SECTIONS.entries()) {
  check(
    `section ${String(i + 1).padStart(2, '0')} rendered in order`,
    dom.sectionTitles[i] === expected,
    `expected "${expected.slice(0, 44)}", got "${(dom.sectionTitles[i] ?? '').slice(0, 44)}"`,
  )
}
check('exactly one H1', dom.h1s.length === 1, `found ${dom.h1s.length}: ${dom.h1s.join(' | ')}`)

/* -- 2. FAQ matches the data source ------------------------------- */
const dataSrc = await readFile(path.join(ROOT, 'src/data/gcallsPlus.ts'), 'utf8')
const faqInData = (dataSrc.match(/^\s{4}q: '/gm) ?? []).length
check(
  'FAQ count matches data source',
  faqInData > 0 && dom.faqCount === faqInData,
  `data has ${faqInData}, page renders ${dom.faqCount}`,
)

/* -- 3. links ------------------------------------------------------ */
const badHrefs = dom.hrefs.filter((a) => a.href === '' || a.href === '#')
check(
  'no empty or placeholder href',
  badHrefs.length === 0,
  badHrefs.map((a) => `"${a.text}"`).join(', '),
)

/* -- 4. claim safety ----------------------------------------------- */
for (const [re, label] of FORBIDDEN_CLAIMS) {
  const m = dom.text.match(re)
  check(`no ${label}`, !m, m ? `found "${m[0]}"` : '')
}

/* -- 5. PII -------------------------------------------------------- */
for (const [re, label] of PII_PATTERNS) {
  const m = dom.text.match(re)
  check(`no ${label} in page text`, !m, m ? `found "${m[0]}"` : '')
}

/* -- 6. media ------------------------------------------------------ */
const shown = dom.images.map((i) => i.file)
const offList = shown.filter((f) => !MEDIA_ALLOWLIST.has(f))
check('every image is on the allowlist', offList.length === 0, offList.join(', '))
check('no duplicate image on the page', new Set(shown).size === shown.length,
  shown.filter((f, i) => shown.indexOf(f) !== i).join(', '))
const upscaled = dom.images.filter((i) => i.natural > 0 && i.w > i.natural + 1)
check('no image upscaled past its intrinsic width', upscaled.length === 0,
  upscaled.map((i) => `${i.file} ${Math.round(i.w)}>${i.natural}`).join(', '))
const noAlt = dom.images.filter((i) => !i.alt || i.alt.length < 20)
check('every image has descriptive alt text', noAlt.length === 0,
  noAlt.map((i) => i.file).join(', '))

/* -- 7. no drawn mockups remain on this page ----------------------- */
const gpDir = path.join(ROOT, 'src/components/gcalls-plus')
const gpFiles = (await readdir(gpDir)).filter((f) => f.endsWith('.tsx'))
const usesMockups = []
for (const f of gpFiles) {
  const src = await readFile(path.join(gpDir, f), 'utf8')
  // A docstring may name the barrel; an import statement may not.
  if (/^\s*import[^\n]*@\/components\/product-ui/m.test(src)) usesMockups.push(f)
}
check('no gcalls-plus component imports the demo-mockup barrel', usesMockups.length === 0,
  usesMockups.join(', '))

/* -- 8. page-scoped layout is actually applied --------------------- */
check('container is 1180px, not 1280px',
  dom.containerWidths.length > 0 && dom.containerWidths.every((w) => w <= 1180),
  `widths: ${[...new Set(dom.containerWidths)].join(', ')}`)
// 25px each side of a section boundary is the 50px between compositions.
const rhythmOk = dom.sectionPadding
  .slice(1)
  .every(([top, bottom]) => top === 25 && bottom === 25)
check('50px rhythm between compositions (25px per side)', rhythmOk,
  `paddings: ${JSON.stringify(dom.sectionPadding)}`)

/* -- 9. runtime cleanliness ---------------------------------------- */
/**
 * Chrome's implicit /favicon.ico request is made by the browser, not the page,
 * so Playwright's `response` listener never sees it and the console message it
 * logs carries no URL. It 404s on every route of this site — `index.html`
 * declares no icon and `public/` holds none — so it is a site-wide asset gap,
 * not a defect of this page, and fixing it would touch every route.
 *
 * It is therefore excluded by SHAPE, narrowly: a bare "failed to load" 404 with
 * no corresponding page-level 4xx response. Any 404 the page itself caused
 * would have been recorded by the `response` listener above and still fails.
 */
const pageLevel4xx = consoleErrors.filter((e) => e.startsWith('HTTP '))
const realErrors = consoleErrors.filter(
  (e) =>
    !(
      pageLevel4xx.length === 0 &&
      /failed to load resource/i.test(e) &&
      /\b404\b/.test(e)
    ),
)
check('no console errors', realErrors.length === 0, realErrors.join(' | ').slice(0, 200))
if (realErrors.length === 0 && consoleErrors.length > 0) {
  console.log(
    '  NOTE  site-wide: /favicon.ico 404s on every route (no icon in index.html or public/). Out of scope here.',
  )
}
const offListRequests = requested
  .filter((u) => /\/images\/products\//.test(u))
  .map((u) => u.split('/').pop())
  .filter((f) => !MEDIA_ALLOWLIST.has(f))
check('no off-allowlist product image requested', offListRequests.length === 0,
  offListRequests.join(', '))

/* -- 10. no other route changed ------------------------------------ */
/**
 * What THIS checkpoint changed — working tree against the commit the branch
 * was created from, plus anything newly added. `origin/main...HEAD` would be
 * wrong: `feature/gcalls-plus-ui-v2` forks from the WordPress migration
 * branch, so that range also lists every file that branch touched.
 */
let changed = []
try {
  const tracked = execFileSync('git', ['diff', '--name-only', 'HEAD'], { cwd: ROOT })
  const untracked = execFileSync(
    'git', ['ls-files', '--others', '--exclude-standard'], { cwd: ROOT },
  )
  changed = `${tracked}${untracked}`.toString().trim().split('\n').filter(Boolean)
} catch {
  changed = []
}
const ALLOWED_PREFIXES = [
  'src/components/gcalls-plus/',
  'src/pages/GcallsPlusPage.tsx',
  'src/data/gcallsPlus.ts',
  'src/data/productImages.ts',
  'src/components/common/ProductScreenshot.tsx',
  'src/styles/gcalls-plus.css',
  'src/styles/index.css',
  'public/images/products/gcalls-plus/',
  'scripts/',
  'docs/',
  'wordpress/',
  '.gitignore',
  '.github/',
]
const strayPages = changed.filter(
  (f) => f.startsWith('src/') && !ALLOWED_PREFIXES.some((p) => f.startsWith(p)),
)
check('no other route or shared page component changed', strayPages.length === 0,
  strayPages.join(', '))

/* -- 11. responsive ------------------------------------------------ *
 * The brief names five widths. Everything below is measured at each of them
 * rather than inferred from the classes.
 */
for (const width of [1440, 1024, 768, 390, 320]) {
  const rctx = await browser.newContext({ viewport: { width, height: 900 } })
  const rp = await rctx.newPage()
  await rp.goto(URL, { waitUntil: 'networkidle' })
  await rp.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 30))
    }
    window.scrollTo(0, 0)
  })
  await rp.waitForTimeout(300)

  const r = await rp.evaluate(() => {
    const scope = document.querySelector('.gp-page')
    const inScope = (sel) => Array.from(scope.querySelectorAll(sel))
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      // Any element painting past the right edge of the viewport.
      bleeding: inScope('*')
        .filter((el) => {
          const b = el.getBoundingClientRect()
          return b.width > 0 && b.right > window.innerWidth + 1
        })
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 30)}`)
        .slice(0, 4),
      // Tap targets: the brief sets a 44px floor.
      smallTargets: inScope('a, button')
        .filter((el) => {
          const b = el.getBoundingClientRect()
          return b.height > 0 && b.height < 44
        })
        .map((el) => `${el.tagName.toLowerCase()} "${el.textContent?.trim().slice(0, 24)}" ${Math.round(el.getBoundingClientRect().height)}px`)
        .slice(0, 6),
      brokenImages: Array.from(document.images)
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.src.split('/').pop()),
      /**
       * A screenshot squeezed out of its own aspect ratio.
       *
       * Compared RELATIVELY, not as an absolute difference of the two ratios.
       * `height: auto` rounds to a sub-pixel, and on a very wide capture — the
       * agent status log is 809x295, so ratio 2.74 — that rounding moves the
       * absolute ratio by more than a squashed 4:3 image would, which made an
       * absolute threshold flag correct images at narrow widths.
       */
      distorted: Array.from(document.images)
        .filter((i) => {
          if (!i.naturalWidth) return false
          const b = i.getBoundingClientRect()
          if (!b.width || !b.height) return false
          const rendered = b.width / b.height
          const intrinsic = i.naturalWidth / i.naturalHeight
          return Math.abs(rendered / intrinsic - 1) > 0.02
        })
        .map((i) => i.src.split('/').pop()),
      upscaled: Array.from(document.images)
        .filter((i) => i.naturalWidth > 0 && i.getBoundingClientRect().width > i.naturalWidth + 1)
        .map((i) => i.src.split('/').pop()),
      // Unrendered template syntax leaking into copy.
      rawShortcode: /\[\/?[a-z_]+[^\]]*\]|\{\{/.test(scope.innerText),
      /**
       * Multi-column grids still laid out side by side.
       *
       * Only asserted at phone widths. At 768px the six card grids are
       * `sm:grid-cols-2` and two columns is the intended tablet layout — the
       * brief's one-column rule is about mobile. The copy/media splits are
       * `lg:grid-cols-*` and so are already single-column below 1024.
       */
      multiColumnSplits: inScope('.grid').filter((el) => {
        const cols = getComputedStyle(el).gridTemplateColumns.split(' ').length
        return cols > 1
      }).length,
    }
  })

  check(`${width}px: no horizontal overflow`, !r.overflow)
  check(`${width}px: nothing bleeds past the right edge`, r.bleeding.length === 0, r.bleeding.join(', '))
  check(`${width}px: tap targets at least 44px tall`, r.smallTargets.length === 0, r.smallTargets.join(' | '))
  check(`${width}px: no broken image`, r.brokenImages.length === 0, r.brokenImages.join(', '))
  check(`${width}px: no distorted image`, r.distorted.length === 0, r.distorted.join(', '))
  check(`${width}px: no upscaled image`, r.upscaled.length === 0, r.upscaled.join(', '))
  check(`${width}px: no raw shortcode in copy`, !r.rawShortcode)
  if (width <= 390) {
    check(`${width}px: every grid collapses to one column`, r.multiColumnSplits === 0,
      `${r.multiColumnSplits} grid(s) still multi-column`)
  }
  if (width === 768) {
    /**
     * The copy/media splits must already be stacked here.
     *
     * A split is a grid that goes multi-column only at `lg`. Card grids also
     * carry an `lg:grid-cols-3`, but they carry `sm:grid-cols-2` too and are
     * legitimately two-up at 768 — so the absence of an `sm:` variant is what
     * distinguishes the two.
     */
    const splitCols = await rp.evaluate(() =>
      Array.from(document.querySelectorAll('.gp-page .grid'))
        .filter((el) => {
          const c = String(el.className)
          return /lg:grid-cols/.test(c) && !/sm:grid-cols/.test(c)
        })
        .filter((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length > 1).length,
    )
    check('768px: copy/media splits are stacked', splitCols === 0, `${splitCols} still side by side`)
  }

  await rctx.close()
}

await browser.close()

console.log(`\n  ${passes.length} passed, ${failures.length} failed\n`)
if (failures.length) {
  for (const f of failures) console.log(`  FAIL  ${f}`)
  process.exit(1)
}
console.log('  GCALLS_PLUS_CONTENT_PASS')
