/**
 * Capture full-page + per-section screenshots for every content page and emit
 * a JSON manifest the doc generator consumes.
 *
 * Uses the system Google Chrome via playwright-core (no Chromium download,
 * which has no macOS 13 build). Run with the dev server up on :5173.
 *
 *   node scripts/capture-pages.mjs
 */
import { chromium } from 'playwright-core'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'

const BASE = 'http://localhost:5173'
const OUT_DIR = path.resolve('docs/screenshots')
const VIEWPORT = { width: 1440, height: 900 }

// Content pages worth documenting. Order = doc order.
const PAGES = [
  { slug: 'home', title: 'Trang chủ', path: '/', group: 'Cốt lõi' },
  { slug: 'gcalls-plus', title: 'Gcalls Plus Webphone', path: '/gcalls-plus-webphone/', group: 'Sản phẩm' },
  { slug: 'qc-bot-ai', title: 'QA/QC Center (QC Bot AI)', path: '/qc-bot-ai/', group: 'Sản phẩm' },
  { slug: 'gcalls-cx', title: 'Gcalls CX', path: '/gcalls-cx/', group: 'Sản phẩm' },
  { slug: 'voicebot-ai', title: 'Voicebot AI', path: '/voicebot-ai/', group: 'Sản phẩm' },
  { slug: 'crm-integration', title: 'Tổng đài tích hợp CRM', path: '/tong-dai-tich-hop-crm/', group: 'Giải pháp' },
  { slug: 'helpdesk-integration', title: 'Tổng đài tích hợp Helpdesk', path: '/tong-dai-tich-hop-helpdesk/', group: 'Giải pháp' },
  { slug: 'pos-integration', title: 'Tổng đài tích hợp POS', path: '/tong-dai-tich-hop-pos/', group: 'Giải pháp' },
  { slug: 'international-calling', title: 'Tổng đài quốc tế', path: '/tong-dai-quoc-te/', group: 'Giải pháp' },
  { slug: 'hubspot', title: 'Tích hợp HubSpot', path: '/tich-hop/hubspot/', group: 'Tích hợp' },
  { slug: 'salesforce', title: 'Tích hợp Salesforce', path: '/tich-hop/salesforce/', group: 'Tích hợp' },
  { slug: 'zoho-crm', title: 'Tích hợp Zoho CRM', path: '/tich-hop/zoho-crm/', group: 'Tích hợp' },
  { slug: 'freshdesk', title: 'Tích hợp Freshdesk', path: '/tich-hop/freshdesk/', group: 'Tích hợp' },
  { slug: 'zendesk', title: 'Tích hợp Zendesk', path: '/tich-hop/zendesk/', group: 'Tích hợp' },
  { slug: 'pricing', title: 'Bảng giá', path: '/bang-gia/', group: 'Định giá' },
  { slug: 'cost-estimator', title: 'Ước tính chi phí', path: '/uoc-tinh-chi-phi/', group: 'Định giá' },
]

/** Scroll through the page to trigger lazy content, then return to top. */
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0
      const step = 400
      const timer = setInterval(() => {
        window.scrollBy(0, step)
        y += step
        if (y >= document.body.scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 60)
    })
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(400)
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true })
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()
  const manifest = []

  for (const p of PAGES) {
    const dir = path.join(OUT_DIR, p.slug)
    await mkdir(dir, { recursive: true })
    console.log(`→ ${p.title}  (${p.path})`)
    await page.goto(BASE + p.path, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
    await page.waitForTimeout(600)
    await autoScroll(page)

    // Full page
    const fullRel = path.join(p.slug, 'full.png')
    await page.screenshot({ path: path.join(OUT_DIR, fullRel), fullPage: true })

    // Per-section: direct children of <main> with meaningful height
    const boxes = await page.evaluate(() => {
      const main = document.querySelector('main#main-content') || document.querySelector('main')
      if (!main) return []
      const out = []
      let i = 0
      for (const el of main.children) {
        const r = el.getBoundingClientRect()
        const label =
          el.getAttribute('aria-label') ||
          (el.querySelector('h1,h2') && el.querySelector('h1,h2').textContent.trim().slice(0, 80)) ||
          ''
        if (r.height >= 140 && r.width >= 200) {
          out.push({ index: i, height: Math.round(r.height), label })
        }
        i++
      }
      return out
    })

    const sections = []
    let n = 0
    for (const b of boxes) {
      n++
      const rel = path.join(p.slug, `section-${String(n).padStart(2, '0')}.png`)
      const handle = await page.evaluateHandle(
        (idx) => {
          const main = document.querySelector('main#main-content') || document.querySelector('main')
          return main.children[idx]
        },
        b.index,
      )
      const elem = handle.asElement()
      try {
        await elem.scrollIntoViewIfNeeded()
        await page.waitForTimeout(150)
        await elem.screenshot({ path: path.join(OUT_DIR, rel) })
        sections.push({ file: rel, label: b.label, height: b.height })
      } catch (e) {
        console.log(`   skip section ${n}: ${e.message.split('\n')[0]}`)
      }
    }

    manifest.push({ ...p, full: fullRel, sections })
    console.log(`   full + ${sections.length} sections`)
  }

  await writeFile(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
  await browser.close()
  console.log(`\nDone. ${manifest.length} pages captured → ${OUT_DIR}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
