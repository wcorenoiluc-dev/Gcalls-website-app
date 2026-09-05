/**
 * Contact form transport states — TEST FIXTURE via a MOCK endpoint.
 *
 * Requires a dev/preview server started with VITE_LEAD_API_URL=/api/leads so the
 * real submitLead() takes its fetch path. Playwright intercepts /api/leads and
 * fulfils it — no real API is ever called, no lead is created, data is neutral.
 * These states (submitting / success / server-error / network-error) are
 * TEST-ONLY and must never be shown on the production /lien-he/ (no backend there).
 *
 * Usage: node scripts/contact-states.mjs <outDir> [baseUrl]
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve(process.argv[2] ?? 'preview')
const BASE = process.argv[3] ?? 'http://127.0.0.1:5218'
const URL = `${BASE}/lien-he/`
// Neutral fixture data — not a real person, company, email or phone.
const FIX = { name: 'Người Dùng Thử', company: 'Công Ty Mẫu', email: 'mau@example.test', phone: '0000000000', message: 'noi dung kiem thu' }

await mkdir(OUT, { recursive: true })

async function fill(page) {
  await page.locator('form input[autocomplete="name"]').first().fill(FIX.name)
  await page.locator('form input[autocomplete="organization"]').first().fill(FIX.company)
  await page.locator('form input[autocomplete="email"]').first().fill(FIX.email)
  await page.locator('form input[autocomplete="tel"]').first().fill(FIX.phone)
  await page.locator('form textarea').first().fill(FIX.message)
  await page.waitForTimeout(2600) // clear MIN_FILL_MS bot gate so submitLead() actually runs
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const results = {}

// submitting — hold the response open, screenshot the in-flight state
{
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1000 } })).newPage()
  let hit = false
  await page.route('**/api/leads', async (route) => {
    hit = true
    await new Promise((r) => setTimeout(r, 2500))
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ leadId: 'TEST' }) })
  })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await fill(page)
  await page.locator('form button[type="submit"]').click()
  await page.waitForTimeout(500)
  const submittingText = await page.evaluate(() => /Đang gửi/i.test(document.body.innerText))
  await page.screenshot({ path: path.join(OUT, 'state-04-submitting.png') })
  results.submitting = { requestIntercepted: hit, submittingText }
  await page.waitForTimeout(2500)
  await page.context().close()
}

// success — TEST ONLY (mock 200)
{
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1000 } })).newPage()
  await page.route('**/api/leads', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ leadId: 'TEST-0001' }) }))
  await page.goto(URL, { waitUntil: 'networkidle' })
  await fill(page)
  await page.locator('form button[type="submit"]').click()
  await page.waitForTimeout(600)
  const successText = await page.evaluate(() => /Đã nhận yêu cầu/i.test(document.body.innerText))
  await page.screenshot({ path: path.join(OUT, 'state-06-success-TEST.png') })
  results.success = { successText }
  await page.context().close()
}

// server error (500)
{
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1000 } })).newPage()
  await page.route('**/api/leads', (route) => route.fulfill({ status: 500, body: 'err' }))
  await page.goto(URL, { waitUntil: 'networkidle' })
  await fill(page)
  await page.locator('form button[type="submit"]').click()
  await page.waitForTimeout(500)
  const errText = await page.evaluate(() => /Không thể gửi yêu cầu/i.test(document.body.innerText))
  await page.screenshot({ path: path.join(OUT, 'state-07-server-error.png') })
  results.serverError = { errText }
  await page.context().close()
}

// network error (abort)
{
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1000 } })).newPage()
  await page.route('**/api/leads', (route) => route.abort())
  await page.goto(URL, { waitUntil: 'networkidle' })
  await fill(page)
  await page.locator('form button[type="submit"]').click()
  await page.waitForTimeout(500)
  const netText = await page.evaluate(() => /Không thể gửi yêu cầu/i.test(document.body.innerText))
  await page.screenshot({ path: path.join(OUT, 'state-08-network-error.png') })
  results.networkError = { netText }
  await page.context().close()
}

await browser.close()
console.log('STATES:', JSON.stringify(results, null, 2))
