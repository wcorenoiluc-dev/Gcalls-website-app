#!/usr/bin/env node
/**
 * GCALLS-041 §2 — classify every content-page card by PURPOSE.
 *
 * GCALLS-040 reported "208/238 cards with no destination", which framed the
 * whole set as broken. Most of them are not links and were never meant to be:
 * a card describing a capability needs no href, and giving it one — or worse,
 * a clickable look with nowhere to go — is a defect, not a fix.
 *
 * Three classes:
 *   navigation    — a card whose whole job is to send the reader somewhere.
 *                   Needs a real destination.
 *   action        — a card that performs something (submit, open a tool).
 *                   Needs a control with real behaviour.
 *   informational — a statement. No href, and no clickable affordance.
 *
 * The classification comes from the SECTION's purpose, because that is where
 * the intent lives: `content-pages.json` cards carry only title/body/href.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const DATA = path.join(ROOT, 'wordpress/wp-content/plugins/gcalls-core/data/content-pages.json')
const doc = JSON.parse(fs.readFileSync(DATA, 'utf8'))

/* Routes this project actually has a page for. A destination is only restored
 * when it resolves to one of these — never invented, never '#'. Populated from
 * the live probe when one is supplied, else from the shipped manifests. */
const liveFile = process.env.GCALLS_LIVE_ROUTES
const live = liveFile && fs.existsSync(liveFile)
  ? new Map(JSON.parse(fs.readFileSync(liveFile, 'utf8')).map((r) => [r.route, r]))
  : new Map()

/* A "see more" / "using something else?" section is a link list. Everything
 * else on these pages is prose in a box. */
const NAV_HEADINGS = [/^Xem thêm$/i, /đang sử dụng .* khác\?/i, /nền tảng đang có trang tích hợp riêng/i,
  /^Chọn theo hệ thống/i, /^Mỗi sản phẩm giải quyết/i]

/* Titles that name a destination, mapped to the route that serves it. Only
 * pairs where the target is a real route are listed; anything unresolved is
 * reported for an owner decision rather than guessed. */
const TITLE_ROUTES = new Map(Object.entries({
  'Tất cả sản phẩm': '/san-pham/', 'Tất cả giải pháp': '/giai-phap/',
  'Danh mục tích hợp': '/tich-hop/', 'Giải pháp theo ngành': '/nganh/',
  'Bảng giá Gcalls': '/bang-gia/', 'Ước tính chi phí': '/uoc-tinh-chi-phi/',
  'Blog Gcalls': '/blog/', 'Liên hệ': '/lien-he/',
  'Gcalls Plus Webphone': '/gcalls-plus-webphone/', 'Gcalls CX': '/gcalls-cx/',
  'Voicebot AI': '/voicebot-ai/', 'QC Bot AI': '/qc-bot-ai/',
  'Tổng đài quốc tế': '/tong-dai-quoc-te/',
  'Tổng đài tích hợp CRM': '/tong-dai-tich-hop-crm/',
  'Tổng đài tích hợp Helpdesk': '/tong-dai-tich-hop-helpdesk/',
  'Tổng đài tích hợp POS': '/tong-dai-tich-hop-pos/',
  Freshdesk: '/tich-hop/freshdesk/', HubSpot: '/tich-hop/hubspot/',
  Salesforce: '/tich-hop/salesforce/', Zendesk: '/tich-hop/zendesk/',
  'Zoho CRM': '/tich-hop/zoho-crm/',
}))

const rows = []
for (const page of doc.pages) {
  for (const sec of page.sections ?? []) {
    const cards = sec.cards ?? []
    if (!cards.length) continue
    const heading = (sec.heading ?? '').trim()
    const isNavSection = NAV_HEADINGS.some((re) => re.test(heading)) ||
      cards.some((c) => (c.href ?? '').trim())

    for (const [i, card] of cards.entries()) {
      const title = (card.title ?? '').trim()
      const body = (card.body ?? '').trim()
      const href = (card.href ?? '').trim()

      let kind
      if (!title && !body && !href) kind = 'empty'
      else if (isNavSection) kind = 'navigation'
      else kind = 'informational'

      let status = 'ok'
      let proposed = ''
      if (kind === 'navigation' && !href) {
        proposed = TITLE_ROUTES.get(title) ?? ''
        if (!proposed) status = 'UNRESOLVED — no known route for this title'
        else if (live.size && !(live.get(proposed)?.status === 200)) status = `TARGET NOT LIVE (${live.get(proposed)?.status ?? 'unknown'})`
        else status = 'RESTORABLE'
      } else if (kind === 'empty') {
        status = 'EMPTY — content export gap'
      }

      rows.push({ page: page.slug, section: heading || '(untitled)', index: i, kind, title, href, proposed, status })
    }
  }
}

const by = (k) => rows.filter((r) => r.kind === k).length
console.log(`cards: ${rows.length}   navigation ${by('navigation')}   informational ${by('informational')}   empty ${by('empty')}\n`)

const nav = rows.filter((r) => r.kind === 'navigation')
const missing = nav.filter((r) => !r.href)
console.log(`navigation cards: ${nav.length}, of which ${nav.length - missing.length} already have a destination and ${missing.length} do not\n`)

console.log('NAVIGATION CARDS WITHOUT A DESTINATION')
console.log('page'.padEnd(26) + 'section'.padEnd(34) + 'title'.padEnd(32) + 'proposed / status')
for (const r of missing) {
  console.log(r.page.padEnd(26) + r.section.slice(0, 32).padEnd(34) + r.title.slice(0, 30).padEnd(32) + (r.proposed || r.status))
}

const empties = rows.filter((r) => r.kind === 'empty')
if (empties.length) {
  console.log(`\nEMPTY CARDS (${empties.length}) — no title, no body, no href. The renderer drops these, so the section they belong to never appears.`)
  const bySec = new Map()
  for (const e of empties) bySec.set(`${e.page} :: ${e.section}`, (bySec.get(`${e.page} :: ${e.section}`) ?? 0) + 1)
  for (const [k, n] of bySec) console.log(`  ${k}  (${n} cards)`)
}

fs.writeFileSync(process.env.GCALLS_CARD_OUT || '/tmp/card-audit-041.json', JSON.stringify(rows, null, 1))
console.log(`\ninformational cards need no destination and correctly have none: ${rows.filter((r) => r.kind === 'informational' && !r.href).length}`)
