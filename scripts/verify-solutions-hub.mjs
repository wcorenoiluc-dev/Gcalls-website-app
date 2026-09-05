/**
 * Content + taxonomy + link-attribution + UI assertions for /giai-phap/.
 *
 * The seven solutions are ported from the homepage roster, which is a
 * module-private const on an out-of-scope file. This script reads that file as
 * text and fails if the hub has drifted from it — the "builder or verification
 * must fail on upstream change" requirement.
 *
 * Usage: node scripts/verify-solutions-hub.mjs [baseUrl]
 */
import { chromium } from 'playwright-core'
import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.argv[2] ?? 'http://localhost:5211'
const URL = `${BASE}/giai-phap/`

const failures = []
const passes = []
const check = (name, ok, detail = '') =>
  ok ? passes.push(name) : failures.push(`${name}${detail ? ` — ${detail}` : ''}`)

/** The seven solutions, in the order the hub renders them. */
const EXPECTED_TITLES = [
  'Tổng đài tích hợp CRM',
  'Tổng đài tích hợp Helpdesk',
  'Tổng đài tích hợp POS',
  'Tổng đài quốc tế',
  'Giải pháp tích hợp Voicebot AI',
  'Cloud Call Center',
  'Call Button Widget',
]

/** The three offerings this checkpoint restored. */
const RESTORED = ['Giải pháp tích hợp Voicebot AI', 'Cloud Call Center', 'Call Button Widget']

/** Products must never appear as solution cards. */
const PRODUCT_TITLES = ['Gcalls Plus Webphone', 'QA QC Center', 'Gcalls CX']

const FABRICATED = [
  [/\b\d[\d.,]*\s*\+?\s*(?:khách hàng|doanh nghiệp|quốc gia|CRM)\b/i, 'a count claim'],
  [/\b\d{1,3}\s*%/, 'a percentage figure'],
  [/\b\d+\+?\s*năm kinh nghiệm/i, 'an experience claim'],
  [/\buptime\b|\bSLA\b/i, 'an uptime/SLA claim'],
  [/đối tác (?:chính thức|được chứng nhận)/i, 'a partnership claim'],
  [/\b\d[\d.,]*\s*(?:VND|đ|USD)\b/i, 'a price'],
  [/24\s*\/\s*7/, 'a 24/7 availability claim'],
]

const PII_PATTERNS = [
  [/\b0(?!9?0{6,})(?:3|5|7|8|9)\d{8}\b/, 'a Vietnamese mobile number'],
  [
    /\b[\w.+-]+@(?!example\.com|gcalls\.co)[\w-]+\.[\w.]{2,}\b/,
    'a third-party e-mail address',
  ],
]

const hubsSrc = await readFile(path.join(ROOT, 'src/data/hubs.ts'), 'utf8')
/**
 * The solutions block, INCLUDING the two lead-context consts declared just
 * above `export const SOLUTIONS_HUB`. Slicing from the export alone left those
 * outside the block, so the attribution assertions below could never see them.
 */
const SOLUTIONS_START = (() => {
  const lead = hubsSrc.indexOf('const CLOUD_CALL_CENTER_LEAD')
  const hub = hubsSrc.indexOf('export const SOLUTIONS_HUB')
  return lead !== -1 && lead < hub ? lead : hub
})()
const SOLUTIONS_BLOCK = hubsSrc.slice(
  SOLUTIONS_START,
  hubsSrc.indexOf('export const INTEGRATIONS_HUB'),
)
/** Code only — the guard comments legitimately quote forbidden strings. */
const SOLUTIONS_CODE = SOLUTIONS_BLOCK.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')

const ecoSrc = await readFile(
  path.join(ROOT, 'src/components/home/EcosystemSection.tsx'), 'utf8',
)

/* ------------------------------------------------------------------ *
 * 1. UPSTREAM PARITY — the hub must still match the homepage roster.
 * ------------------------------------------------------------------ */
const ecoSolutions = ecoSrc.slice(
  ecoSrc.indexOf('const solutions: EcosystemCard[]'),
  ecoSrc.indexOf('function Card('),
)
const upstream = [...ecoSolutions.matchAll(/name:\s*"([^"]+)"[\s\S]*?desc:\s*"([^"]+)"/g)].map(
  (m) => ({ name: m[1], desc: m[2] }),
)
// The roster declares icon/href between name and desc, so also capture hrefs.
/**
 * `href` is either `ROUTES.x` or a whole `leadCtaHref({ ... })` call. The call
 * contains commas, so a `[^,]+` capture stopped inside it and the solution
 * label was never seen — hence this matches to end of line instead.
 */
const upstreamHrefs = [...ecoSolutions.matchAll(/name:\s*"([^"]+)"[\s\S]*?href:\s*(.+)$/gm)].map(
  (m) => ({ name: m[1], href: m[2].trim().replace(/,$/, '') }),
)

check('homepage roster still declares 7 solutions', upstream.length === 7,
  `found ${upstream.length}: ${upstream.map((u) => u.name).join(', ')}`)
check('homepage roster names match the expected seven',
  JSON.stringify(upstream.map((u) => u.name).sort()) ===
    JSON.stringify([...EXPECTED_TITLES].sort()),
  upstream.map((u) => u.name).join(', '))

// Every upstream title and description must be present verbatim in the hub.
for (const u of upstream) {
  check(`upstream title "${u.name.slice(0, 34)}" is in SOLUTIONS_HUB`,
    SOLUTIONS_BLOCK.includes(u.name))
}
for (const name of RESTORED) {
  const u = upstream.find((x) => x.name === name)
  check(`upstream description for "${name.slice(0, 28)}" ported verbatim`,
    Boolean(u) && SOLUTIONS_BLOCK.includes(u.desc),
    u ? `expected: ${u.desc.slice(0, 60)}…` : 'not found upstream')
}
for (const { name, href } of upstreamHrefs) {
  if (!RESTORED.includes(name)) continue
  // ROUTES.* references must match; leadCtaHref calls are compared by solution.
  if (href.startsWith('ROUTES.')) {
    check(`"${name}" destination matches upstream (${href})`,
      SOLUTIONS_CODE.includes(`path: ${href}`), `hub does not use ${href}`)
  } else {
    const sol = href.match(/solution:\s*"([^"]+)"/)?.[1]
    check(`"${name}" lead attribution matches upstream (solution="${sol}")`,
      Boolean(sol) && SOLUTIONS_CODE.includes(`solution: '${sol}'`),
      'hub does not carry the same solution attribution')
  }
}

/* ------------------------------------------------------------------ *
 * 2. Rendered page
 * ------------------------------------------------------------------ */
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
await page.waitForTimeout(500)

const dom = await page.evaluate(() => {
  const scope = document.querySelector('.sh-page')
  const cards = Array.from(scope?.querySelectorAll('li') ?? []).filter((li) =>
    li.querySelector('h4'),
  )
  return {
    hasScope: Boolean(scope),
    sectionCount: scope?.querySelectorAll(':scope > section').length ?? 0,
    h1s: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent?.trim()),
    groupHeadings: Array.from(scope?.querySelectorAll('h3') ?? []).map((h) =>
      h.textContent?.trim(),
    ),
    cards: cards.map((li) => {
      const links = Array.from(li.querySelectorAll('a'))
      return {
        title: li.querySelector('h4')?.textContent?.trim(),
        linkCount: links.length,
        href: links[0]?.getAttribute('href') ?? '',
        ariaLabel: links[0]?.getAttribute('aria-label') ?? '',
        hasGlyph: Boolean(li.querySelector('svg')),
        height: Math.round(li.getBoundingClientRect().height),
        top: Math.round(li.getBoundingClientRect().top),
      }
    }),
    nestedLinks: Array.from(scope?.querySelectorAll('a a') ?? []).length,
    hrefs: Array.from(scope?.querySelectorAll('a') ?? []).map((a) => ({
      href: a.getAttribute('href') ?? '',
      text: (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 44),
    })),
    text: scope?.innerText ?? '',
    images: Array.from(document.images).length,
    containerWidths: Array.from(
      document.querySelectorAll('.sh-page .max-w-\\[1280px\\]'),
    ).map((el) => Math.round(el.getBoundingClientRect().width)),
    sectionPadding: Array.from(document.querySelectorAll('.sh-page > section')).map((s) => {
      const cs = getComputedStyle(s)
      return [parseFloat(cs.paddingTop), parseFloat(cs.paddingBottom)]
    }),
    orphanHeadings: Array.from(scope?.querySelectorAll(':scope > section') ?? [])
      .filter((s) => {
        const h = s.querySelector('h1, h2')
        if (!h) return false
        return s.innerText.replace(h.textContent ?? '', '').trim().length < 20
      })
      .map((s) => s.querySelector('h1, h2')?.textContent?.trim().slice(0, 36)),
    emptyGridTracks: Array.from(scope?.querySelectorAll('.grid') ?? []).filter((el) => {
      const cols = getComputedStyle(el).gridTemplateColumns.split(' ').length
      const kids = Array.from(el.children).filter(
        (c) => c.getBoundingClientRect().height > 0,
      ).length
      return cols > 1 && kids > 0 && kids < cols
    }).length,
    finalCtaCount: Array.from(scope?.querySelectorAll('section') ?? []).filter((s) =>
      s.getAttribute('aria-labelledby')?.endsWith('-cta'),
    ).length,
  }
})

/* -- structure ------------------------------------------------------- */
check('page scope class present', dom.hasScope)
check('exactly one H1', dom.h1s.length === 1, `found ${dom.h1s.length}`)
check('breadcrumb + 6 content sections', dom.sectionCount === 6, `${dom.sectionCount}`)
check('no orphan heading', dom.orphanHeadings.length === 0, dom.orphanHeadings.join(', '))
check('no empty grid track', dom.emptyGridTracks === 0, `${dom.emptyGridTracks}`)
check('exactly one final CTA', dom.finalCtaCount === 1, `${dom.finalCtaCount}`)
check('two visual groups rendered', dom.groupHeadings.length === 2,
  dom.groupHeadings.join(' | '))

/* -- taxonomy -------------------------------------------------------- */
const titles = dom.cards.map((c) => c.title)
check('exactly 7 solution cards', dom.cards.length === 7, `found ${dom.cards.length}`)
check('the seven are exactly the expected roster',
  JSON.stringify([...titles].sort()) === JSON.stringify([...EXPECTED_TITLES].sort()),
  titles.join(', '))
check('no eighth solution', dom.cards.length <= 7)
for (const t of EXPECTED_TITLES) {
  check(`"${t.slice(0, 32)}" appears exactly once`,
    titles.filter((x) => x === t).length === 1,
    `${titles.filter((x) => x === t).length} occurrence(s)`)
}
check('Voicebot appears exactly once in the solution cards',
  titles.filter((t) => /voicebot/i.test(t ?? '')).length === 1)
check('Voicebot card uses the approved solution name',
  titles.includes('Giải pháp tích hợp Voicebot AI'))
check('the forbidden product name is not rendered',
  !/Gcalls Voicebot AI/.test(dom.text))
check('the forbidden product name is not in SOLUTIONS_HUB code',
  !/Gcalls Voicebot AI/.test(SOLUTIONS_CODE))
for (const p of PRODUCT_TITLES) {
  check(`product "${p}" is not a solution card`, !titles.includes(p))
}
check('Cloud Call Center is present', titles.includes('Cloud Call Center'))
check('Call Button Widget is present', titles.includes('Call Button Widget'))

/* -- taxonomy leftovers ---------------------------------------------- */
check('no "bốn nhóm giải pháp" left in the rendered page',
  !/bốn nhóm giải pháp/i.test(dom.text))
check('no "BỐN NHÓM GIẢI PHÁP" eyebrow left', !/BỐN NHÓM GIẢI PHÁP/.test(dom.text))
check('the cards eyebrow states seven', /BẢY GIẢI PHÁP/.test(dom.text))

/* -- link attribution ------------------------------------------------ */
const CANONICAL = {
  'Cloud Call Center': '/lien-he/?intent=consultation&source=consultation&solution=Cloud+Call+Center',
  'Call Button Widget': '/lien-he/?intent=consultation&source=consultation&solution=Call+Button+Widget',
}
for (const [title, want] of Object.entries(CANONICAL)) {
  const card = dom.cards.find((c) => c.title === title)
  check(`"${title}" keeps its lead attribution`, card?.href === want,
    `got ${card?.href}`)
}
check('no card links to a placeholder', dom.cards.every((c) => c.href && c.href !== '#'))
check('no empty or placeholder href anywhere',
  dom.hrefs.every((a) => a.href !== '' && a.href !== '#'),
  dom.hrefs.filter((a) => !a.href || a.href === '#').map((a) => a.text).join(', '))
check('every card CTA has its own accessible name',
  new Set(dom.cards.map((c) => c.ariaLabel)).size === dom.cards.length &&
    dom.cards.every((c) => c.ariaLabel.length > 0),
  dom.cards.map((c) => c.ariaLabel).join(' | '))
check('one link per card (no nested navigation)',
  dom.cards.every((c) => c.linkCount === 1),
  dom.cards.map((c) => `${c.title}:${c.linkCount}`).join(', '))
check('no nested anchors', dom.nestedLinks === 0)
check('every card has a glyph', dom.cards.every((c) => c.hasGlyph))

/* -- every SOLUTIONS_HUB string is rendered --------------------------- */
const declared = [...new Set(
  [...SOLUTIONS_BLOCK.matchAll(/'([^'\n]{12,})'/g)]
    .map((m) => m[1])
    .filter((v) => !v.startsWith('/') && !/^[a-z_]+$/.test(v)),
)]
const normalise = (s) => s.replace(/\s+/g, ' ').trim()
const pageText = normalise(dom.text)
const missing = declared.filter((v) => !pageText.includes(normalise(v)))
check('every string SOLUTIONS_HUB declares is rendered', missing.length === 0,
  missing.map((m) => `"${m.slice(0, 44)}…"`).join(' | '))

/* -- claim safety and PII --------------------------------------------- */
for (const [re, label] of FABRICATED) {
  const m = dom.text.match(re)
  check(`no ${label}`, !m, m ? `found "${m[0].trim()}"` : '')
}
for (const [re, label] of PII_PATTERNS) {
  const m = dom.text.match(re)
  check(`no ${label}`, !m, m ? `found "${m[0]}"` : '')
}
// A hub routes; it must not stage product screenshots.
check('no screenshot or dashboard image on the hub', dom.images === 0, `${dom.images}`)

/* -- the five out-of-scope hubs --------------------------------------- */
const OTHER_HUBS = {
  PRODUCTS_HUB: '772eea1f838aa2eaddd93a52919667cc',
  INTEGRATIONS_HUB: '0f91cc1b70f052546e1167dc6c88ea45',
  INDUSTRIES_HUB: '2520886e30a54a57cf06ca60d6fd4908',
  RESOURCES_HUB: '12b683272b14d357531f6d678fbf9263',
  COMPANY_HUB: 'a6da9f1f6525cf03b9f8df034c2d45c2',
}
const drifted = Object.entries(OTHER_HUBS).filter(([name, want]) => {
  const i = hubsSrc.indexOf(`export const ${name}`)
  if (i < 0) return true
  const rest = hubsSrc.slice(i)
  // `want` is a recorded prefix, so compare on the same number of characters.
  const got = createHash('sha256')
    .update(rest.slice(0, rest.indexOf('\n}\n')))
    .digest('hex')
    .slice(0, want.length)
  return got !== want
})
check('the five out-of-scope hubs are byte-equivalent', drifted.length === 0,
  drifted.map(([n]) => n).join(', '))

/* -- page-scoped layout ------------------------------------------------ */
check('container is 1180px, not 1280px',
  dom.containerWidths.length > 0 && dom.containerWidths.every((w) => w <= 1180),
  `widths: ${[...new Set(dom.containerWidths)].join(', ')}`)
check('50px seam between compositions (25px per side)',
  dom.sectionPadding.slice(1).every(([t, b]) => t === 25 && b === 25),
  JSON.stringify(dom.sectionPadding))

/* -- runtime ----------------------------------------------------------- *
 * Chrome's implicit /favicon.ico request is made by the browser, not the page,
 * so it never reaches the `response` listener and its message carries no URL.
 * It 404s on every route of this site, so it is excluded by shape.
 */
const pageLevel4xx = consoleErrors.filter((e) => e.startsWith('HTTP '))
const realErrors = consoleErrors.filter(
  (e) => !(pageLevel4xx.length === 0 && /failed to load resource/i.test(e) && /\b404\b/.test(e)),
)
check('no console errors', realErrors.length === 0, realErrors.join(' | ').slice(0, 200))

/* -- every internal href resolves --------------------------------------- */
const internal = [...new Set(dom.hrefs.map((a) => a.href))].filter((h) => h.startsWith('/'))
for (const href of internal) {
  const p2 = await ctx.newPage()
  const res = await p2.goto(BASE + href, { waitUntil: 'domcontentloaded' })
  const notFound = await p2.evaluate(() =>
    /404|không tìm thấy/i.test(document.querySelector('h1')?.textContent ?? ''),
  )
  check(`route ${href.slice(0, 58)} resolves`,
    (res?.status() ?? 0) < 400 && !notFound,
    notFound ? 'renders the 404 page' : `HTTP ${res?.status()}`)
  await p2.close()
}

/* -- scope --------------------------------------------------------------- */
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
  'src/pages/SolutionsHubPage.tsx',
  'src/components/solutions-hub/',
  'src/data/hubs.ts', // SOLUTIONS_HUB only — the other five are hashed above
  'src/styles/solutions-hub.css',
  'src/styles/index.css',
  'scripts/',
  'docs/',
]
const stray = changed.filter(
  (f) => f.startsWith('src/') && !ALLOWED.some((p) => f.startsWith(p)),
)
check('nothing outside the solutions-hub scope changed', stray.length === 0, stray.join(', '))

/* -- responsive ---------------------------------------------------------- */
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
    const scope = document.querySelector('.sh-page')
    const cards = Array.from(scope.querySelectorAll('li')).filter((li) =>
      li.querySelector('h4'),
    )
    const rows = new Map()
    for (const c of cards) {
      const t = Math.round(c.getBoundingClientRect().top)
      rows.set(t, [...(rows.get(t) ?? []), Math.round(c.getBoundingClientRect().height)])
    }
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      bleeding: Array.from(scope.querySelectorAll('*'))
        .filter((el) => {
          const b = el.getBoundingClientRect()
          return b.width > 0 && b.right > window.innerWidth + 1
        })
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 22)}`)
        .slice(0, 4),
      cardCount: cards.length,
      unevenRows: [...rows.values()].filter((hs) => new Set(hs).size > 1).length,
      emptyTracks: Array.from(scope.querySelectorAll('.grid')).filter((el) => {
        const cols = getComputedStyle(el).gridTemplateColumns.split(' ').length
        const kids = Array.from(el.children).filter(
          (c) => c.getBoundingClientRect().height > 0,
        ).length
        return cols > 1 && kids > 0 && kids < cols
      }).length,
      smallTargets: Array.from(scope.querySelectorAll('a, button'))
        .filter((el) => {
          const b = el.getBoundingClientRect()
          return b.height > 0 && b.height < 44
        })
        .map((el) => `"${el.textContent?.trim().slice(0, 18)}"`)
        .slice(0, 5),
      rawShortcode: /\[\/?[a-z_]+[^\]]*\]|\{\{/.test(scope.innerText),
    }
  })

  check(`${width}px: no horizontal overflow`, !r.overflow)
  check(`${width}px: nothing bleeds past the right edge`, r.bleeding.length === 0,
    r.bleeding.join(', '))
  check(`${width}px: still exactly 7 solution cards`, r.cardCount === 7, `${r.cardCount}`)
  check(`${width}px: cards in a row are equal height`, r.unevenRows === 0,
    `${r.unevenRows} uneven row(s)`)
  check(`${width}px: no empty grid track`, r.emptyTracks === 0, `${r.emptyTracks}`)
  check(`${width}px: tap targets at least 44px tall`, r.smallTargets.length === 0,
    r.smallTargets.join(' | '))
  check(`${width}px: no raw shortcode`, !r.rawShortcode)

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
for (const signal of [
  'SOLUTIONS_HUB_CONTENT_PASS',
  'SOLUTIONS_HUB_TAXONOMY_7_PASS',
  'VOICEBOT_SOLUTION_CARD_PASS',
  'VOICEBOT_PRODUCT_CARD_ZERO',
  'SOLUTIONS_HUB_LINKS_PASS',
  'SOLUTIONS_HUB_UI_LOCAL_PASS',
  'UNAFFECTED_HUBS_BYTE_EQUIVALENT',
]) console.log(`  ${signal}`)
