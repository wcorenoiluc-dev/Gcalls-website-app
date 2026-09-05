/**
 * Contact page /lien-he/ — capture + gates + attribution + PII + regression.
 * Runs against a PRODUCTION preview with NO backend (success is impossible here).
 * Usage: node scripts/contact-preview.mjs <outDir> [baseUrl]
 */
import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve(process.argv[2] ?? 'preview')
const BASE = process.argv[3] ?? 'http://127.0.0.1:5217'
const CONTACT_URL = `${BASE}/lien-he/`

const BREAKPOINTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '1280', width: 1280, height: 900 },
  { name: '1024', width: 1024, height: 800 },
  { name: '768', width: 768, height: 900 },
  { name: '390', width: 390, height: 844 },
  { name: '320', width: 320, height: 640 },
]
const REGRESSION_ROUTES = [
  '/', '/lien-he/', '/uoc-tinh-chi-phi/', '/gcalls-plus-webphone/',
  '/gcalls-cx/', '/qc-bot-ai/', '/voicebot-ai/',
]
// PII tokens we type into the form; none may ever appear in URL / console / analytics.
const PII = {
  name: 'Nguyen Van Test', company: 'Test Co', email: 'tester@example.com',
  phone: '0900000000', message: 'noi dung kiem thu trung tinh',
}

async function analyze(page) {
  return page.evaluate(() => {
    const main = document.querySelector('main') ?? document.body
    const rect = (el) => el.getBoundingClientRect()
    // honeypot: the website input must be off-screen / not visible
    const honeypot = document.querySelector('input[name="text"], input#\\:r0\\:-website, input[autocomplete="off"][tabindex="-1"]')
      || Array.from(document.querySelectorAll('input')).find((i) => /website/i.test(i.id))
    const honeypotVisible = honeypot
      ? (() => { const r = rect(honeypot); return r.width > 0 && r.right > 0 && r.left < window.innerWidth && r.bottom > 0 })()
      : false
    const fields = Array.from(document.querySelectorAll('form input, form select, form textarea'))
    const disabledFields = fields.filter((f) => f.disabled && !/website/i.test(f.id)).length
    const imgs = Array.from(document.images)
    const mailto = document.querySelector('a[href^="mailto:"]')
    const tel = document.querySelector('a[href^="tel:"]')
    const bodyText = document.body.innerText
    return {
      h1Count: document.querySelectorAll('h1').length,
      h1Text: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent?.trim()),
      h2Count: document.querySelectorAll('h2').length,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      // widest CONTENT element (exclude full-bleed backgrounds that span the viewport)
      maxContainer: Math.max(0, ...Array.from(main.querySelectorAll('*'))
        .map((el) => Math.round(rect(el).width)).filter((w) => w < (window.innerWidth || 9999))),
      brokenImages: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
      honeypotVisible,
      disabledFields,
      mailtoHref: mailto?.getAttribute('href') ?? null,
      telHref: tel?.getAttribute('href') ?? null,
      mailtoName: mailto?.getAttribute('aria-label') ?? mailto?.textContent?.trim() ?? null,
      telName: tel?.getAttribute('aria-label') ?? tel?.textContent?.trim() ?? null,
      hasDevNotice: /Đang phát triển|chưa được kết nối/i.test(bodyText),
      hasRawShortcode: /\[[a-z_]+[^\]]*\]/i.test(bodyText),
    }
  })
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
await mkdir(OUT, { recursive: true })
const metrics = { url: CONTACT_URL, breakpoints: {} }

// ---- 6-breakpoint capture + analysis ----
for (const bp of BREAKPOINTS) {
  const ctx = await browser.newContext({ viewport: { width: bp.width, height: bp.height }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  const errs = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  page.on('pageerror', (e) => errs.push(String(e)))
  await page.goto(CONTACT_URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(250)
  const a = await analyze(page)
  a.consoleErrors = errs
  metrics.breakpoints[bp.name] = a
  await page.screenshot({ path: path.join(OUT, `contact-${bp.name}-full.png`), fullPage: true })
  if (bp.name === '1440' || bp.name === '390') {
    await page.screenshot({ path: path.join(OUT, `contact-hero-${bp.name}.png`) })
  }
  await ctx.close()
}

// ---- Form states (production build, NO backend) ----
const states = {}
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } })
  const page = await ctx.newPage()
  const consoleMsgs = []
  page.on('console', (m) => consoleMsgs.push(m.text()))
  await page.goto(CONTACT_URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)

  // default
  await page.screenshot({ path: path.join(OUT, 'state-01-default.png') })

  // focus
  const nameSel = 'form input#\\:r1\\:-name, form input[autocomplete="name"]'
  await page.locator('form input[autocomplete="name"]').first().focus()
  await page.screenshot({ path: path.join(OUT, 'state-02-focus.png') })

  // validation error: submit empty
  await page.locator('form button[type="submit"]').click()
  await page.waitForTimeout(300)
  const validationErrors = await page.locator('[role="alert"]').count()
  await page.screenshot({ path: path.join(OUT, 'state-03-validation.png') })

  // not-configured: fill valid + submit → NOT_CONFIGURED (no backend)
  await page.locator('form input[autocomplete="name"]').first().fill(PII.name)
  await page.locator('form input[autocomplete="organization"]').first().fill(PII.company)
  await page.locator('form input[autocomplete="email"]').first().fill(PII.email)
  await page.locator('form input[autocomplete="tel"]').first().fill(PII.phone)
  await page.locator('form textarea').first().fill(PII.message)
  await page.waitForTimeout(2600) // clear the MIN_FILL_MS bot gate
  await page.locator('form button[type="submit"]').click()
  await page.waitForTimeout(400)
  const notConfiguredText = await page.evaluate(() =>
    /chưa được kết nối/i.test(document.body.innerText))
  const successAfterSubmit = await page.evaluate(() =>
    /Đã nhận yêu cầu/i.test(document.body.innerText))
  await page.screenshot({ path: path.join(OUT, 'state-05-not-configured.png') })

  // PII safety after typing + submitting
  const urlAfter = page.url()
  const piiInUrl = Object.values(PII).filter((v) => urlAfter.includes(encodeURIComponent(v)) || urlAfter.includes(v))
  const piiInConsole = consoleMsgs.filter((m) => Object.values(PII).some((v) => m.includes(v)))

  states.production = {
    validationErrors, notConfiguredText, successAfterSubmit,
    urlAfter, piiInUrl, piiInConsoleCount: piiInConsole.length,
    fieldsPreserved: await page.evaluate(() =>
      document.querySelector('form input[autocomplete="name"]')?.value || ''),
  }
  await ctx.close()
}

// ---- Attribution (clean + hostile) ----
const attribution = {}
for (const [key, qs] of [
  ['clean', '?intent=demo&source=gcalls_plus&product=Gcalls%20Plus%20Webphone'],
  ['hostile', '?intent=EVIL&source=notallowed&product=%3Cscript%3Ealert(1)%3C%2Fscript%3E'],
  ['unlisted', '?product=' + encodeURIComponent('Sản phẩm không có thật XYZ')],
]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(`${CONTACT_URL}${qs}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)
  attribution[key] = await page.evaluate(() => ({
    h1Count: document.querySelectorAll('h1').length,
    hasScriptText: /<script>|alert\(1\)/i.test(document.body.innerHTML),
    interested: /Bạn đang quan tâm|Quan tâm:/.test(document.body.innerText),
    bodyMentionsXYZ: /không có thật XYZ/i.test(document.body.innerText),
  }))
  if (key === 'clean') await page.screenshot({ path: path.join(OUT, 'state-attribution-clean.png') })
  await ctx.close()
}

// ---- Regression ----
const regression = {}
for (const r of REGRESSION_ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  const errs = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  page.on('pageerror', (e) => errs.push(String(e)))
  await page.goto(`${BASE}${r}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)
  regression[r] = await page.evaluate(() => ({
    h1Count: document.querySelectorAll('h1').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    hasForm: !!document.querySelector('form'),
  }))
  regression[r].consoleErrors = errs.length
  await ctx.close()
}

await browser.close()

const bps = Object.entries(metrics.breakpoints)
const gate = {
  h1_exactly_1: bps.every(([, a]) => a.h1Count === 1),
  overflow_zero: bps.every(([, a]) => a.horizontalOverflow <= 0),
  brokenImages_zero: bps.every(([, a]) => a.brokenImages === 0),
  honeypot_hidden: bps.every(([, a]) => a.honeypotVisible === false),
  noDisabledFields_default: bps.every(([, a]) => a.disabledFields === 0),
  container_max_1180: bps.every(([, a]) => a.maxContainer <= 1180),
  mailto_present: bps.every(([, a]) => (a.mailtoHref || '').startsWith('mailto:sales@gcalls.co')),
  tel_present: bps.every(([, a]) => (a.telHref || '').startsWith('tel:')),
  noDevNotice: bps.every(([, a]) => a.hasDevNotice === false),
  noRawShortcode: bps.every(([, a]) => a.hasRawShortcode === false),
  consoleErrors_zero: bps.every(([, a]) => a.consoleErrors.length === 0),
  // production-route behaviour
  noSuccessOnContact: states.production.successAfterSubmit === false,
  notConfiguredShown: states.production.notConfiguredText === true,
  fieldsPreservedAfterError: states.production.fieldsPreserved === PII.name,
  // pii
  pii_not_in_url: states.production.piiInUrl.length === 0,
  pii_not_in_console: states.production.piiInConsoleCount === 0,
  // attribution
  attr_clean_shows: attribution.clean.interested === true && attribution.clean.h1Count === 1,
  attr_hostile_no_injection: attribution.hostile.hasScriptText === false && attribution.hostile.h1Count === 1,
  attr_unlisted_suppressed: attribution.unlisted.bodyMentionsXYZ === false,
}
metrics.gate = gate
metrics.states = states
metrics.attribution = attribution
metrics.regression = regression
metrics.regressionAllPass = Object.values(regression).every((v) => v.h1Count === 1 && v.overflow <= 0 && v.consoleErrors === 0)

await writeFile(path.join(OUT, 'metrics.json'), JSON.stringify(metrics, null, 2))
console.log('GATE:', JSON.stringify(gate, null, 2))
console.log('regression all pass:', metrics.regressionAllPass)
console.log('done ->', OUT)
