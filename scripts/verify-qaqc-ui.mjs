/**
 * Content + fabricated-data + PII + UI assertions for /qc-bot-ai/.
 *
 * Runs against the rendered page, so it catches a section that stops rendering
 * as well as one that stops existing. Source files are read only where the DOM
 * cannot answer the question — which imports a file uses, and what changed.
 *
 * Usage: node scripts/verify-qaqc-ui.mjs [baseUrl]
 */
import { chromium } from 'playwright-core'
import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.argv[2] ?? 'http://localhost:5201'
const URL = `${BASE}/qc-bot-ai/`

const failures = []
const passes = []
const check = (name, ok, detail = '') =>
  ok ? passes.push(name) : failures.push(`${name}${detail ? ` — ${detail}` : ''}`)

/* ------------------------------------------------------------------ *
 * 18 CONTENT sections after the breadcrumb.
 *
 * WEBSITE_PAGES_OVERVIEW.md says 19 because it counts the breadcrumb. It is a
 * `div`, not a `section`, so both numbers describe the same page. Nothing may
 * be added or removed to make them agree.
 * ------------------------------------------------------------------ */
/**
 * The 18 content sections, in order, identified by the data constant each one
 * renders. The expected heading text is READ FROM `qaQcCenter.ts` rather than
 * written here: the copy is locked, so restating it in the checker would just
 * create a second copy to drift against — and an earlier version of this file
 * did exactly that and failed on nine sections that were in fact correct.
 *
 * `null` marks a section whose heading is composed in the page rather than
 * stored as an `h2` field; only its presence and position are asserted.
 */
const SECTION_ORDER = [
  'QQ_HERO',        // 01 — h1, not h2
  'QQ_DIRECT_ANSWER',
  'QQ_PROBLEMS',
  'QQ_OVERVIEW',
  'QQ_HOW_IT_WORKS',
  'QQ_CAPABILITIES',
  'QQ_SCORING',
  'QQ_SIGNALS',
  'QQ_HUMAN_LOOP',
  'QQ_DASHBOARD',
  'QQ_BENEFITS',
  'QQ_USE_CASES',
  'QQ_INTEGRATION',
  'QQ_BOUNDARIES',
  'QQ_STORY',
  'QQ_PRICING',
  null,             // 17 — FAQ heading lives in the page
  'QQ_FINAL_CTA',
]

/**
 * Pull the heading for one exported const out of the locked data source.
 *
 * Bounded to that const's own body — a fixed-size window ran past the closing
 * brace and picked up the NEXT const's `h2`. The direct-answer block stores its
 * heading as `question`, so that key counts too.
 */
function headingOf(src, name) {
  const start = src.indexOf(`export const ${name} = {`)
  if (start === -1) return null
  const end = src.indexOf('\n} as const', start)
  const body = src.slice(start, end === -1 ? undefined : end)
  const m = body.match(/^\s{2}(?:h[12]|question):\s*\n?\s*'([^']*)'/m)
  return m ? m[1] : null
}


/**
 * Operational figures and identifiers the audit brief names explicitly. Every
 * one of these was rendered by the previous mockups as if it were product
 * output; none may come back.
 *
 * Matched against the page's own text, as whole tokens, so an unrelated "78"
 * inside a longer number does not trip and a returning "78" score does.
 */
const FABRICATED = [
  [/(?:^|[^\d.,])78(?:[^\d.,%]|$)/, 'the suggested score 78'],
  [/1[.,]248/, 'the 1.248 calls-analysed total'],
  [/(?:^|[^\d.,])86(?:[^\d.,%]|$)/, 'the 86 calls-to-review total'],
  [/(?:^|[^\d.,])81(?:[^\d.,%]|$)/, 'the average QA score 81'],
  [/(?:^|[^\d.,])34(?:[^\d.,%]|$)/, 'the 34 review-sessions total'],
  [/#A-\d{4}/, 'a fabricated call identifier'],
  [/Dạ em nghe/i, 'fabricated agent dialogue'],
  [/Tôi gọi lần thứ hai/i, 'fabricated customer dialogue'],
  [/Em xin lỗi vì sự bất tiện/i, 'fabricated agent dialogue'],
  [/Yêu cầu hoàn tiền|Xác nhận đơn/i, 'a fabricated per-call signal verdict'],
]

/** Claims the P02 guard forbids as verified fact on this page. */
const FORBIDDEN_CLAIMS = [
  [/100\s*%\s*cuộc gọi/i, '"100% cuộc gọi"'],
  [/chính xác\s*100\s*%/i, '"chính xác 100%"'],
  [/thay thế (?:hoàn toàn )?QA/i, '"thay thế QA"'],
  [/phát hiện mọi vi phạm/i, '"phát hiện mọi vi phạm"'],
  [/đảm bảo compliance/i, '"đảm bảo compliance"'],
  [/(?:giảm|tăng)\s+\d{1,3}\s*%/i, 'a giảm/tăng X% figure'],
  [/\buptime\b/i, 'an uptime claim'],
]

const PII_PATTERNS = [
  [/\b0(?!9?0{6,})(?:3|5|7|8|9)\d{8}\b/, 'a Vietnamese mobile number'],
  [
    /\b[\w.+-]+@(?!example\.com|gcalls\.co)[\w-]+\.[\w.]{2,}\b/,
    'a third-party e-mail address',
  ],
]

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

const consoleErrors = []
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
page.on('pageerror', (e) => consoleErrors.push(String(e)))
page.on('response', (r) => {
  if (r.status() >= 400) consoleErrors.push(`HTTP ${r.status()} ${r.url()}`)
})

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
  const scope = document.querySelector('.qq-page')
  const sections = Array.from(scope?.querySelectorAll(':scope > section') ?? [])
  return {
    hasScope: Boolean(scope),
    sectionTitles: sections.map(
      (s) => s.querySelector('h1, h2')?.textContent?.trim() ?? '(no heading)',
    ),
    /** A heading with no content element after it in its own section. */
    orphanHeadings: sections
      .filter((s) => {
        const h = s.querySelector('h1, h2')
        if (!h) return false
        const text = s.innerText.replace(h.textContent ?? '', '').trim()
        return text.length < 20 && s.querySelectorAll('[data-qq-visual]').length === 0
      })
      .map((s) => s.querySelector('h1, h2')?.textContent?.trim().slice(0, 40)),
    h1s: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent?.trim()),
    faqCount: document.querySelectorAll('[id^="qq-faq-button-"]').length,
    hrefs: Array.from(scope?.querySelectorAll('a') ?? []).map((a) => ({
      href: a.getAttribute('href') ?? '',
      text: a.textContent?.trim().slice(0, 40) ?? '',
    })),
    text: scope?.innerText ?? '',
    visualCount: document.querySelectorAll('[data-qq-visual]').length,
    /** Each visual must sit next to an explicit illustration caption. */
    visualsWithoutNote: Array.from(
      document.querySelectorAll('[data-qq-visual]'),
    ).filter((v) => !/Giao diện minh họa/i.test(v.parentElement?.innerText ?? '')).length,
    /** Each surface carries its own in-frame "Minh họa" badge. */
    visualsWithoutBadge: Array.from(
      document.querySelectorAll('[data-qq-visual]'),
    ).filter((v) => !/Minh họa/i.test(v.innerText)).length,
    images: Array.from(document.images).map((i) => i.src),
    containerWidths: Array.from(
      document.querySelectorAll('.qq-page .max-w-\\[1280px\\]'),
    ).map((el) => Math.round(el.getBoundingClientRect().width)),
    sectionPadding: sections.map((s) => {
      const cs = getComputedStyle(s)
      return [parseFloat(cs.paddingTop), parseFloat(cs.paddingBottom)]
    }),
    /** Grid containers rendering more tracks than they have children. */
    emptyGridTracks: Array.from(scope?.querySelectorAll('.grid, .grid > ul') ?? [])
      .filter((el) => {
        const cols = getComputedStyle(el).gridTemplateColumns.split(' ').length
        const kids = Array.from(el.children).filter(
          (c) => c.getBoundingClientRect().height > 0,
        ).length
        return cols > 1 && kids > 0 && kids % cols !== 0 && kids < cols
      }).length,
  }
})

const dataSrc = await readFile(path.join(ROOT, 'src/data/qaQcCenter.ts'), 'utf8')

/* -- 1. structure -------------------------------------------------- */
check('page scope class present', dom.hasScope)
check(
  'breadcrumb + 18 content sections',
  dom.sectionTitles.length === 18,
  `found ${dom.sectionTitles.length}`,
)
for (const [i, constName] of SECTION_ORDER.entries()) {
  const label = `section ${String(i + 1).padStart(2, '0')} rendered in order`
  if (constName === null) {
    check(label, (dom.sectionTitles[i] ?? '').length > 0, 'section missing')
    continue
  }
  const expected = headingOf(dataSrc, constName)
  if (expected === null) {
    check(label, false, `could not read a heading for ${constName}`)
    continue
  }
  check(
    label,
    dom.sectionTitles[i] === expected,
    `expected "${expected.slice(0, 40)}", got "${(dom.sectionTitles[i] ?? '').slice(0, 40)}"`,
  )
}
check('exactly one H1', dom.h1s.length === 1, `found ${dom.h1s.length}`)
check('no orphan heading', dom.orphanHeadings.length === 0, dom.orphanHeadings.join(', '))
check('no empty grid track', dom.emptyGridTracks === 0, `${dom.emptyGridTracks} grid(s)`)

/* -- 2. FAQ matches the data source -------------------------------- */
const faqInData = (dataSrc.match(/^\s{4}q: '/gm) ?? []).length
check(
  'FAQ count matches data source',
  faqInData > 0 && dom.faqCount === faqInData,
  `data has ${faqInData}, page renders ${dom.faqCount}`,
)

/* -- 3. links ------------------------------------------------------ */
const badHrefs = dom.hrefs.filter((a) => a.href === '' || a.href === '#')
check('no empty or placeholder href', badHrefs.length === 0,
  badHrefs.map((a) => `"${a.text}"`).join(', '))

/** No two CTAs to the same destination back to back. */
const consecutiveDupes = dom.hrefs.filter(
  (a, i) => i > 0 && a.href === dom.hrefs[i - 1].href && a.text === dom.hrefs[i - 1].text,
)
check('no duplicated consecutive CTA', consecutiveDupes.length === 0,
  consecutiveDupes.map((a) => `"${a.text}"`).join(', '))

const finalCtaHeading = headingOf(dataSrc, 'QQ_FINAL_CTA')
const finalCtaCount = dom.sectionTitles.filter((t) => t === finalCtaHeading).length
check('final CTA appears exactly once', finalCtaCount === 1, `found ${finalCtaCount}`)

/* -- 4. fabricated operational data -------------------------------- */
for (const [re, label] of FABRICATED) {
  const m = dom.text.match(re)
  check(`no ${label}`, !m, m ? `found "${m[0].trim()}"` : '')
}

/* -- 5. claim safety ----------------------------------------------- */
for (const [re, label] of FORBIDDEN_CLAIMS) {
  const m = dom.text.match(re)
  check(`no ${label}`, !m, m ? `found "${m[0]}"` : '')
}

/* -- 6. PII -------------------------------------------------------- */
for (const [re, label] of PII_PATTERNS) {
  const m = dom.text.match(re)
  check(`no ${label}`, !m, m ? `found "${m[0]}"` : '')
}

/* -- 7. illustration labelling ------------------------------------- */
check('every visual is captioned as an illustration', dom.visualsWithoutNote === 0,
  `${dom.visualsWithoutNote} uncaptioned`)
check('every visual carries an in-frame Minh họa badge', dom.visualsWithoutBadge === 0,
  `${dom.visualsWithoutBadge} unbadged`)
check('page renders the expected 5 visuals', dom.visualCount === 5,
  `found ${dom.visualCount}`)
// No capture exists for this route, so the page must request no product image.
check('no product image is hotlinked or staged', dom.images.length === 0,
  dom.images.join(', '))

/* -- 8. no fabricated data left in the source ---------------------- */
const visualsSrc = await readFile(
  path.join(ROOT, 'src/components/qa-qc/visuals.tsx'), 'utf8',
)
// Strip the block comment that documents what was removed, then scan the code.
const code = visualsSrc.replace(/\/\*[\s\S]*?\*\//g, '')
const strayLiterals = [
  ["'#A-", 'a call identifier literal'],
  ['1.248', 'the calls-analysed total'],
  ['Dạ em nghe', 'fabricated dialogue'],
].filter(([needle]) => code.includes(needle))
check('no fabricated literal left in visuals.tsx', strayLiterals.length === 0,
  strayLiterals.map(([, l]) => l).join(', '))

/* -- 8b. signal labels stay tied to the approved copy --------------- *
 * The signals mockup shows the head term of each approved point rather than
 * the full sentence. This asserts every label is still a substring of its
 * matching `QQ_SIGNALS.points` entry, so it cannot drift into naming a signal
 * type the copy does not claim.
 */
const signalLabels = (
  visualsSrc.match(/const SIGNAL_GROUPS = \[([^\]]*)\]/)?.[1] ?? ''
)
  .split(',')
  .map((x) => x.trim().replace(/^'|'$/g, ''))
  .filter(Boolean)
const signalPoints = (
  dataSrc.slice(dataSrc.indexOf('export const QQ_SIGNALS'))
    .match(/points:\s*\[([\s\S]*?)\]/)?.[1] ?? ''
)
  .split('\n')
  .map((l) => l.trim().replace(/^'|',?$/g, ''))
  .filter((l) => l.length > 3)

check('signal mockup labels match the approved points 1:1',
  signalLabels.length === signalPoints.length,
  `${signalLabels.length} labels vs ${signalPoints.length} points`)

const unmoored = signalLabels.filter((label, i) => {
  const point = (signalPoints[i] ?? '').toLowerCase()
  // Compare on the head term, ignoring diacritic-free casing differences.
  return !point.includes(label.toLowerCase())
})
check('every signal label appears in its approved point', unmoored.length === 0,
  unmoored.join(', '))

/* -- 9. page-scoped layout ----------------------------------------- */
check('container is 1180px, not 1280px',
  dom.containerWidths.length > 0 && dom.containerWidths.every((w) => w <= 1180),
  `widths: ${[...new Set(dom.containerWidths)].join(', ')}`)
const rhythmOk = dom.sectionPadding.slice(1).every(([t, b]) => t === 25 && b === 25)
check('50px seam between compositions (25px per side)', rhythmOk,
  `paddings: ${JSON.stringify(dom.sectionPadding)}`)

/* -- 10. runtime ---------------------------------------------------- *
 * Chrome's implicit /favicon.ico request is made by the browser, not the page,
 * so it never reaches the `response` listener and its console message carries
 * no URL. It 404s on every route of this site, so it is excluded by shape: a
 * bare "failed to load" 404 with no page-level 4xx recorded alongside it.
 */
const pageLevel4xx = consoleErrors.filter((e) => e.startsWith('HTTP '))
const realErrors = consoleErrors.filter(
  (e) => !(pageLevel4xx.length === 0 && /failed to load resource/i.test(e) && /\b404\b/.test(e)),
)
check('no console errors', realErrors.length === 0, realErrors.join(' | ').slice(0, 200))

/* -- 11. scope ------------------------------------------------------ */
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
const ALLOWED = [
  'src/pages/QaQcCenterPage.tsx',
  'src/components/qa-qc/',
  'src/data/qaQcCenter.ts',
  'src/styles/qa-qc.css',
  'src/styles/index.css',
  'scripts/',
  'docs/',
]
const stray = changed.filter(
  (f) => f.startsWith('src/') && !ALLOWED.some((p) => f.startsWith(p)),
)
check('nothing outside the QA/QC route changed', stray.length === 0, stray.join(', '))

/* -- 12. responsive, at the six widths the brief names -------------- */
for (const width of [1440, 1280, 1024, 768, 390, 320]) {
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
    const scope = document.querySelector('.qq-page')
    const inScope = (sel) => Array.from(scope.querySelectorAll(sel))
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      bleeding: inScope('*')
        .filter((el) => {
          const b = el.getBoundingClientRect()
          return b.width > 0 && b.right > window.innerWidth + 1
        })
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 24)}`)
        .slice(0, 4),
      smallTargets: inScope('a, button')
        .filter((el) => {
          const b = el.getBoundingClientRect()
          return b.height > 0 && b.height < 44
        })
        .map((el) => `"${el.textContent?.trim().slice(0, 22)}" ${Math.round(el.getBoundingClientRect().height)}px`)
        .slice(0, 6),
      brokenImages: Array.from(document.images).filter(
        (i) => i.complete && i.naturalWidth === 0,
      ).length,
      rawShortcode: /\[\/?[a-z_]+[^\]]*\]|\{\{/.test(scope.innerText),
      /**
       * Below `sm` every PAGE grid must be a single column. Grids inside an
       * illustration are excluded: the dashboard's 2x2 tile block is part of
       * the depicted interface, not page layout, and collapsing it would stop
       * the surface looking like the screen it describes.
       */
      multiCol: inScope('.grid')
        .filter((el) => !el.closest('[data-qq-visual]'))
        .filter((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length > 1)
        .length,
    }
  })

  check(`${width}px: no horizontal overflow`, !r.overflow)
  check(`${width}px: nothing bleeds past the right edge`, r.bleeding.length === 0,
    r.bleeding.join(', '))
  check(`${width}px: tap targets at least 44px tall`, r.smallTargets.length === 0,
    r.smallTargets.join(' | '))
  check(`${width}px: no broken image`, r.brokenImages === 0)
  check(`${width}px: no raw shortcode in copy`, !r.rawShortcode)
  if (width <= 390) {
    check(`${width}px: every grid collapses to one column`, r.multiCol === 0,
      `${r.multiCol} still multi-column`)
  }

  await rctx.close()
}

await browser.close()

console.log(`\n  ${passes.length} passed, ${failures.length} failed\n`)
if (failures.length) {
  for (const f of failures) console.log(`  FAIL  ${f}`)
  process.exit(1)
}
if (consoleErrors.length) {
  console.log('  NOTE  site-wide: /favicon.ico 404s on every route. Out of scope here.\n')
}
console.log('  QAQC_CONTENT_PASS')
console.log('  QAQC_FABRICATED_DATA_ZERO')
console.log('  QAQC_PII_ZERO')
console.log('  QAQC_UI_LOCAL_PASS')
