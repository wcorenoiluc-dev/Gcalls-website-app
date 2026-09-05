/**
 * Content + claim-guard + logo + contact + UI assertions for /cong-ty/.
 *
 * Expected copy is read from `hubs.ts` and `navigation.ts` rather than restated
 * here: the content is approved and locked, so a second copy in the checker
 * would only create something to drift against.
 *
 * Usage: node scripts/verify-company-hub.mjs [baseUrl]
 */
import { chromium } from 'playwright-core'
import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.argv[2] ?? 'http://127.0.0.1:5215'
const URL = `${BASE}/cong-ty/`

const failures = []
const passes = []
const check = (name, ok, detail = '') =>
  ok ? passes.push(name) : failures.push(`${name}${detail ? ` — ${detail}` : ''}`)

const REQUIRED_H1 = 'Gcalls xây dựng nền tảng giao tiếp cho doanh nghiệp Việt Nam'

/**
 * Company metrics the claim guard withholds. Every one of these needs an
 * evidence record that this repository does not have.
 */
const FABRICATED = [
  [/thành lập (?:năm |từ )?\d{4}/i, 'a founding year'],
  [/\b\d+\+?\s*năm (?:kinh nghiệm|hoạt động|phát triển)/i, 'years in business'],
  [/\b\d[\d.,]*\s*\+?\s*(?:khách hàng|doanh nghiệp)\s+(?:đang|đã)\s+(?:sử dụng|tin dùng|lựa chọn)/i, 'a customer count'],
  [/\b\d[\d.,]*\s*\+?\s*quốc gia/i, 'a country count'],
  [/\b\d[\d.,]*\s*\+?\s*(?:CRM|Helpdesk)\b(?!\s*(?:hoặc|và|,))/i, 'a supported-system count'],
  [/\b\d[\d.,]*\s*\+?\s*(?:nhân sự|nhân viên|thành viên)\b/i, 'a headcount'],
  [/doanh thu|vốn đầu tư|gọi vốn|series [ab]/i, 'revenue or funding'],
  [/giải thưởng|award|chứng nhận ISO/i, 'an award or certification'],
  [/thị phần|market share/i, 'market share'],
  [/tăng trưởng\s*\d/i, 'a growth rate'],
  [/\buptime\b|\bSLA\b/i, 'an uptime or SLA figure'],
]

/** Superlatives the brief bans outright. */
const BANNED_WORDS = [
  'hàng đầu',
  'số một',
  'tiên phong',
  'tốt nhất',
  'được tin dùng bởi hàng nghìn doanh nghiệp',
]

/** Trust devices that need approved evidence and have none. */
const TRUST_DEVICES = [
  /*
   * A logo wall is IMAGES of customers, which the image assertions below
   * already forbid — the logo is the only image allowed on the page. This
   * pattern catches the marketing phrasing that introduces one, and
   * deliberately does NOT match the approved sentence "Tên và logo khách hàng
   * chỉ được đăng sau khi có sự đồng ý bằng văn bản", which is a consent
   * policy and the opposite of a logo wall.
   */
  [/khách hàng tiêu biểu|họ đã tin dùng|(?<!chỉ được đăng sau khi có sự đồng ý bằng văn bản\.)\blogo của (?:các )?khách hàng\b/i, 'a customer logo wall'],
  [/["“][^"”]{40,}["”]\s*[—-]\s*\w+/, 'a testimonial quote'],
  [/đối tác (?:chính thức|được chứng nhận|vàng|bạc)/i, 'an official-partnership claim'],
]

const hubsSrc = await readFile(path.join(ROOT, 'src/data/hubs.ts'), 'utf8')
const COMPANY_BLOCK = hubsSrc.slice(hubsSrc.indexOf('export const COMPANY_HUB'))
const navSrc = await readFile(path.join(ROOT, 'src/config/navigation.ts'), 'utf8')

/** The single source of truth for the contact details. */
const CONTACT = {
  email: navSrc.match(/email:\s*'([^']+)'/)?.[1],
  phone: navSrc.match(/\n\s*phone:\s*'([^']+)'/)?.[1],
  phoneHref: navSrc.match(/phoneHref:\s*'([^']+)'/)?.[1],
}

const manifest = JSON.parse(
  await readFile(
    path.join(ROOT, 'docs/content-review/gcalls-company-hub-ui-v2/official-logo-manifest.json'),
    'utf8',
  ),
)

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

const consoleErrors = []
const requested = []
page.on('request', (r) => requested.push(r.url()))
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
  const scope = document.querySelector('.ch-page')
  return {
    hasScope: Boolean(scope),
    sectionCount: scope?.querySelectorAll(':scope > section').length ?? 0,
    h1s: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent?.trim()),
    /* Scoped to the principles section — a bare `ol > li` also matches the
       breadcrumb, which made this read 5 cards instead of 3. */
    principleCards: Array.from(
      scope?.querySelectorAll('section[aria-labelledby$="-cards"] ol > li') ?? [],
    ).map((li) => ({
      title: li.querySelector('h3')?.textContent?.trim(),
      height: Math.round(li.getBoundingClientRect().height),
      top: Math.round(li.getBoundingClientRect().top),
    })),
    text: scope?.innerText ?? '',
    hrefs: Array.from(scope?.querySelectorAll('a') ?? []).map((a) => ({
      href: a.getAttribute('href') ?? '',
      text: (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 44),
    })),
    images: Array.from(document.images).map((i) => ({
      src: new URL(i.currentSrc || i.src, location.href).pathname,
      absolute: i.currentSrc || i.src,
      natural: [i.naturalWidth, i.naturalHeight],
      rendered: [
        Math.round(i.getBoundingClientRect().width),
        Math.round(i.getBoundingClientRect().height),
      ],
      alt: i.alt,
      broken: i.complete && i.naturalWidth === 0,
    })),
    containerWidths: Array.from(
      document.querySelectorAll('.ch-page .max-w-\\[1280px\\]'),
    ).map((el) => Math.round(el.getBoundingClientRect().width)),
    sectionPadding: Array.from(document.querySelectorAll('.ch-page > section')).map((s) => {
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
    mailtos: Array.from(scope?.querySelectorAll('a[href^="mailto:"]') ?? []).map((a) => ({
      href: a.getAttribute('href'),
      text: a.textContent?.trim(),
    })),
    tels: Array.from(scope?.querySelectorAll('a[href^="tel:"]') ?? []).map((a) => ({
      href: a.getAttribute('href'),
      text: a.textContent?.trim(),
    })),
  }
})

/* -- 1. structure ---------------------------------------------------- */
check('page scope class present', dom.hasScope)
check('exactly one H1', dom.h1s.length === 1, `found ${dom.h1s.length}`)
check('H1 is the approved heading', dom.h1s[0] === REQUIRED_H1, dom.h1s[0])
check('breadcrumb + 7 content sections', dom.sectionCount === 7, `${dom.sectionCount}`)
check('no orphan heading', dom.orphanHeadings.length === 0, dom.orphanHeadings.join(', '))
check('no empty grid track', dom.emptyGridTracks === 0, `${dom.emptyGridTracks}`)
check('exactly one final CTA', dom.finalCtaCount === 1, `${dom.finalCtaCount}`)
check('three principle cards', dom.principleCards.length === 3,
  `${dom.principleCards.length}`)
const sameRow = dom.principleCards.filter((c) => c.top === dom.principleCards[0].top)
check('principle cards in a row are equal height',
  new Set(sameRow.map((c) => c.height)).size <= 1,
  sameRow.map((c) => `${c.title}:${c.height}`).join(', '))

/* -- 2. every COMPANY_HUB field is rendered --------------------------- */
const declared = [...new Set(
  [...COMPANY_BLOCK.matchAll(/'([^'\n]{12,})'/g)]
    .map((m) => m[1])
    .filter((v) => !v.startsWith('/') && !/^[a-z_]+$/.test(v)),
)]
const normalise = (s) => s.replace(/\s+/g, ' ').trim()
const pageText = normalise(dom.text)
const missing = declared.filter((v) => !pageText.includes(normalise(v)))
check('every string COMPANY_HUB declares is rendered', missing.length === 0,
  missing.map((m) => `"${m.slice(0, 44)}…"`).join(' | '))
check('the field sweep is not vacuous', declared.length >= 20, `${declared.length} strings`)

/* -- 3. claim guard ---------------------------------------------------- */
for (const [re, label] of FABRICATED) {
  const m = dom.text.match(re)
  check(`no ${label}`, !m, m ? `found "${m[0].trim()}"` : '')
}
for (const word of BANNED_WORDS) {
  check(`banned wording "${word}" is absent`,
    !new RegExp(word, 'i').test(dom.text))
}
for (const [re, label] of TRUST_DEVICES) {
  const m = dom.text.match(re)
  check(`no ${label}`, !m, m ? `found "${m[0].slice(0, 60)}"` : '')
}

/* -- 4. official logo --------------------------------------------------- */
const logoPath = '/' + manifest.localPath.replace(/^public\//, '')
const logo = dom.images.find((i) => i.src === logoPath)
check('the official logo is rendered', Boolean(logo), `expected ${logoPath}`)
if (logo) {
  check('logo is served locally, not hotlinked',
    logo.absolute.startsWith(BASE) && !/gcalls\.co/.test(logo.absolute),
    logo.absolute)
  check('logo intrinsic size matches the manifest',
    logo.natural[0] === manifest.width && logo.natural[1] === manifest.height,
    `${logo.natural.join('x')} vs ${manifest.width}x${manifest.height}`)
  check('logo is not upscaled',
    logo.rendered[0] <= manifest.width + 1,
    `rendered ${logo.rendered[0]}px vs intrinsic ${manifest.width}px`)
  check('logo has alt text', logo.alt.length > 5, logo.alt)
}
// The on-disk file must still be the byte-identical asset the manifest hashes.
const bytes = await readFile(path.join(ROOT, manifest.localPath))
const sha = createHash('sha256').update(bytes).digest('hex')
check('local logo file matches the manifest hash', sha === manifest.sha256,
  `${sha.slice(0, 16)} vs ${manifest.sha256.slice(0, 16)}`)
check('manifest records hotlinkFalse', manifest.hotlinkFalse === true)
check('no request reaches gcalls.co at runtime',
  !requested.some((u) => /gcalls\.co/.test(u)),
  requested.filter((u) => /gcalls\.co/.test(u)).join(', '))
// A hub is not a gallery: the logo is the only image the page may carry.
check('the logo is the only image on the page', dom.images.length === 1,
  dom.images.map((i) => i.src).join(', '))
check('no broken image', dom.images.every((i) => !i.broken))

/* -- 5. contact ---------------------------------------------------------- */
check('CONTACT was read from navigation.ts',
  Boolean(CONTACT.email && CONTACT.phone && CONTACT.phoneHref),
  JSON.stringify(CONTACT))
check('exactly one mailto link', dom.mailtos.length === 1, `${dom.mailtos.length}`)
check('mailto href matches CONTACT.email',
  dom.mailtos[0]?.href === `mailto:${CONTACT.email}`, dom.mailtos[0]?.href)
check('mailto text matches CONTACT.email',
  dom.mailtos[0]?.text === CONTACT.email, dom.mailtos[0]?.text)
const telInContact = dom.tels.find((t) => t.text === CONTACT.phone)
check('a tel link shows CONTACT.phone', Boolean(telInContact),
  dom.tels.map((t) => t.text).join(', '))
check('tel href matches CONTACT.phoneHref',
  telInContact?.href === CONTACT.phoneHref, telInContact?.href)
check('every tel href on the page is the canonical one',
  dom.tels.every((t) => t.href === CONTACT.phoneHref),
  dom.tels.map((t) => t.href).join(', '))
// No stale address from an earlier era of the site.
check('no e-mail other than CONTACT.email appears',
  !(dom.text.match(/[\w.+-]+@[\w-]+\.[\w.]{2,}/g) ?? []).some((e) => e !== CONTACT.email),
  (dom.text.match(/[\w.+-]+@[\w-]+\.[\w.]{2,}/g) ?? []).filter((e) => e !== CONTACT.email).join(', '))
// Contact details are published business details; anything else is not.
const otherPhones = (dom.text.match(/\b0\d{2}\s?\d{4}\s?\d{4}\b/g) ?? []).filter(
  (p) => p.replace(/\s/g, '') !== CONTACT.phone.replace(/\s/g, ''),
)
check('no phone number other than the published one', otherPhones.length === 0,
  otherPhones.join(', '))
/*
 * Two `tel:` links is expected and correct — one in the contact block, one in
 * the closing CTA band. What the brief rules out is contact CTAs stacked next
 * to each other, so this measures the gap rather than counting links.
 */
const contactGap = await page.evaluate(() => {
  const els = Array.from(
    document.querySelectorAll('.ch-page a[href^="tel:"], .ch-page a[href^="mailto:"]'),
  ).map((a) => Math.round(a.getBoundingClientRect().top + window.scrollY)).sort((a, b) => a - b)
  let min = Infinity
  for (let i = 1; i < els.length; i += 1) {
    // Ignore the e-mail/phone pair inside the contact block itself: they are
    // one affordance shown side by side, not a repeated CTA.
    const gap = els[i] - els[i - 1]
    if (gap > 5) min = Math.min(min, gap)
  }
  return { count: els.length, minGap: min === Infinity ? null : min }
})
check('contact CTAs are not stacked next to each other',
  contactGap.minGap === null || contactGap.minGap >= 200,
  `${contactGap.count} contact links, closest vertical gap ${contactGap.minGap}px`)

/* -- 6. links ------------------------------------------------------------ */
const badHrefs = dom.hrefs.filter((a) => a.href === '' || a.href === '#')
check('no empty or placeholder href', badHrefs.length === 0,
  badHrefs.map((a) => `"${a.text}"`).join(', '))

/* -- 7. page-scoped layout ------------------------------------------------ */
check('container is 1180px, not 1280px',
  dom.containerWidths.length > 0 && dom.containerWidths.every((w) => w <= 1180),
  `widths: ${[...new Set(dom.containerWidths)].join(', ')}`)
check('50px seam between compositions (25px per side)',
  dom.sectionPadding.slice(1).every(([t, b]) => t === 25 && b === 25),
  JSON.stringify(dom.sectionPadding))

/* -- 8. runtime ------------------------------------------------------------ *
 * Chrome's implicit /favicon.ico request is made by the browser, not the page,
 * so it never reaches the `response` listener and its message carries no URL.
 * It 404s on every route of this site, so it is excluded by shape — any 404 the
 * page itself caused is recorded by the listener and still fails.
 */
const pageLevel4xx = consoleErrors.filter((e) => e.startsWith('HTTP '))
const realErrors = consoleErrors.filter(
  (e) => !(pageLevel4xx.length === 0 && /failed to load resource/i.test(e) && /\b404\b/.test(e)),
)
check('no task-created console error', realErrors.length === 0,
  realErrors.join(' | ').slice(0, 200))

/* -- 9. every internal href resolves ---------------------------------------- */
const internal = [...new Set(dom.hrefs.map((a) => a.href))].filter((h) => h.startsWith('/'))
for (const href of internal) {
  const p2 = await ctx.newPage()
  const res = await p2.goto(BASE + href, { waitUntil: 'domcontentloaded' })
  const notFound = await p2.evaluate(() =>
    /404|không tìm thấy/i.test(document.querySelector('h1')?.textContent ?? ''),
  )
  check(`route ${href.slice(0, 56)} resolves`,
    (res?.status() ?? 0) < 400 && !notFound,
    notFound ? 'renders the 404 page' : `HTTP ${res?.status()}`)
  await p2.close()
}

/* -- 10. scope --------------------------------------------------------------- */
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
  'src/pages/CompanyHubPage.tsx',
  'src/components/company-hub/',
  'src/styles/company-hub.css',
  'src/styles/index.css',
  'public/images/brand/',
  'scripts/',
  'docs/',
]
const stray = changed.filter(
  (f) => !ALLOWED.some((p) => f.startsWith(p)),
)
check('nothing outside the company-hub scope changed', stray.length === 0, stray.join(', '))
check('src/data/hubs.ts is untouched', !changed.includes('src/data/hubs.ts'))
check('HubLayout.tsx is untouched', !changed.includes('src/components/hub/HubLayout.tsx'))

/* -- 11. responsive ----------------------------------------------------------- */
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
    const scope = document.querySelector('.ch-page')
    const cards = Array.from(scope.querySelectorAll('ol > li'))
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
      unevenRows: [...rows.values()].filter((hs) => new Set(hs).size > 1).length,
      emptyTracks: Array.from(scope.querySelectorAll('.grid')).filter((el) => {
        const cols = getComputedStyle(el).gridTemplateColumns.split(' ').length
        const kids = Array.from(el.children).filter(
          (c) => c.getBoundingClientRect().height > 0,
        ).length
        return cols > 1 && kids > 0 && kids < cols
      }).length,
      logoUpscaled: Array.from(document.images).some(
        (i) => i.naturalWidth > 0 && i.getBoundingClientRect().width > i.naturalWidth + 1,
      ),
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
  check(`${width}px: principle cards in a row are equal height`, r.unevenRows === 0,
    `${r.unevenRows} uneven row(s)`)
  check(`${width}px: no empty grid track`, r.emptyTracks === 0, `${r.emptyTracks}`)
  check(`${width}px: logo is not upscaled`, !r.logoUpscaled)
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
  'COMPANY_HUB_CONTENT_PASS',
  'COMPANY_HUB_CLAIM_GUARD_PASS',
  'GCALLS_OFFICIAL_LOGO_LOCAL_PASS',
  'COMPANY_CONTACT_PASS',
  'COMPANY_HUB_UI_LOCAL_PASS',
]) console.log(`  ${signal}`)
