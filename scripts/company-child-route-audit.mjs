/**
 * Child-route audit for the company hub.
 *
 * A 200 proves the route resolves; it says nothing about whether the page has
 * real content. This records both, plus the things an owner has to decide on:
 * placeholder copy, claims needing approval, and whether a form is live.
 *
 * Usage: node scripts/company-child-route-audit.mjs [baseUrl]
 */
import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://127.0.0.1:5215'
const ROUTES = ['/cong-ty/khach-hang/', '/cong-ty/doi-tac/', '/referral/', '/lien-he/']

/** Wording that marks content as not yet written. */
const PLACEHOLDER = /đang được cập nhật|đang cập nhật|sắp ra mắt|coming soon|đang biên tập/i
/** Claim shapes an owner must sign off before they can be published. */
const NEEDS_APPROVAL = [
  [/\b\d[\d.,]*\s*\+?\s*(?:khách hàng|doanh nghiệp|đối tác)\b/i, 'a customer/partner count'],
  [/\b\d{1,3}\s*%/, 'a percentage (commission or performance)'],
  [/hoa hồng|chiết khấu/i, 'commission or discount terms'],
  [/đối tác (?:chính thức|được chứng nhận)|chứng nhận/i, 'a certification or official-partner claim'],
  [/giải thưởng|award/i, 'an award'],
  [/hàng đầu|số một|tiên phong|tốt nhất/i, 'a superiority claim'],
]

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const rows = []

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  const res = await page.goto(BASE + route, { waitUntil: 'networkidle' })
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 30))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(300)

  const d = await page.evaluate(() => {
    const main = document.querySelector('main') ?? document.body
    return {
      h1: document.querySelector('h1')?.textContent?.trim() ?? '(none)',
      h1Count: document.querySelectorAll('h1').length,
      sections: main.querySelectorAll('section').length,
      words: (main.innerText.match(/\S+/g) ?? []).length,
      text: main.innerText,
      // A live form needs a submit control and at least one input.
      inputs: main.querySelectorAll('input, textarea, select').length,
      submits: main.querySelectorAll(
        'button[type="submit"], input[type="submit"]',
      ).length,
      forms: main.querySelectorAll('form').length,
      ctas: Array.from(main.querySelectorAll('a'))
        .filter((a) => /đăng ký|liên hệ|nhận tư vấn|gửi|tư vấn|xem/i.test(a.textContent ?? ''))
        .slice(0, 4)
        .map((a) => `${a.textContent?.trim().slice(0, 30)} → ${a.getAttribute('href')}`),
    }
  })

  const placeholder = PLACEHOLDER.test(d.text)
  /**
   * Raw regex hits, plus the matched text, so a reader can adjudicate rather
   * than trust the pattern. Both hits on the current pages are false positives
   * and are annotated as such in the checkpoint: a list numeral "03" read as a
   * customer count, and a sentence on /cong-ty/doi-tac/ that DISTINGUISHES
   * technical integration from an official partnership — a disclaimer, not a
   * claim. An audit that cries wolf is worse than no audit.
   */
  const approvals = NEEDS_APPROVAL.filter(([re]) => re.test(d.text)).map(([re, l]) => {
    const m = d.text.match(re)
    return `${l} — matched: ${JSON.stringify((m?.[0] ?? '').replace(/\s+/g, ' ').slice(0, 80))}`
  })

  rows.push({
    route,
    status: res?.status() ?? 0,
    h1: d.h1,
    h1Count: d.h1Count,
    sections: d.sections,
    words: d.words,
    content: placeholder ? 'PLACEHOLDER present' : d.words < 150 ? 'THIN' : 'real content',
    form: d.forms > 0 ? `${d.forms} form, ${d.inputs} fields, ${d.submits} submit` : 'no form',
    ctas: d.ctas,
    approvals: approvals.length ? approvals : ['none detected'],
  })

  await ctx.close()
}

await browser.close()

console.log('# Child-route audit\n')
for (const r of rows) {
  console.log(`## ${r.route}`)
  console.log(`- HTTP status: ${r.status}`)
  console.log(`- H1: "${r.h1}" (${r.h1Count} on page)`)
  console.log(`- Sections: ${r.sections}`)
  console.log(`- Body words: ${r.words}`)
  console.log(`- Content: ${r.content}`)
  console.log(`- Form: ${r.form}`)
  console.log(`- CTAs: ${r.ctas.length ? r.ctas.join(' | ') : '(none matched)'}`)
  console.log(`- Needs owner approval: ${r.approvals.join(', ')}`)
  console.log('')
}
console.log('A 200 status is not evidence that a page is finished — see the Content line.')
