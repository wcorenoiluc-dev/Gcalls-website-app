/*
 * Build the two overview pages, applying the GCALLS-028 taxonomy override.
 *
 * WHY AN OVERRIDE EXISTS AT ALL
 * Two approved sources disagreed. src/data/hubs.ts says "BỐN SẢN PHẨM" and
 * carries Voicebot as a product; src/components/home/EcosystemSection.tsx says
 * three products and seven solutions, with Voicebot as a solution, and carries a
 * checkpoint forbidding the product placement and the name "Gcalls Voicebot AI"
 * because it asserts Gcalls owns the engine. The Ecosystem taxonomy is newer, is
 * checkpointed, and is what is live on the home page — so /san-pham/ cannot
 * contradict a page one click away.
 *
 * NOTHING IS CHANGED SILENTLY. Every edit is declared below with the exact
 * `from` string, and the build FAILS if a `from` no longer matches — so if the
 * approved copy is revised upstream, this stops rather than pretending.
 * The full list is written into the manifest as `taxonomy_override` for audit,
 * alongside the untouched source hash.
 *
 * The 3+7 roster is not retyped either: it is read from the live, verified
 * homepage envelope this same plugin ships.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const REPO = process.env.GCALLS_REPO || '/Users/macos/Desktop/Gcalls/App/Gcalls-website-app'
const OUT = 'wordpress/wp-content/plugins/gcalls-core/data/content-pages.json'
const ENVELOPE = 'wordpress/wp-content/plugins/gcalls-core/data/homepage-elementor.json'

const hubs = await import(path.join(REPO, 'src/data/hubs.ts'))
const nav = await import(path.join(REPO, 'src/config/navigation.ts'))

const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const HUBS_FILE = path.join(REPO, 'src/data/hubs.ts')

/* ------------------------------------------ the live 3+7 roster ---- */

function liveRoster() {
  const env = JSON.parse(fs.readFileSync(ENVELOPE, 'utf8'))
  const htmls = []
  const walk = (n) => { if (n?.settings?.html) htmls.push(n.settings.html); (n.elements || []).forEach(walk) }
  env.content.forEach(walk)

  const re = /<a class="gc-eco-card gc-eco-card--([a-z]+)" href="([^"]*)">([\s\S]*?)<\/a>/g
  const out = []
  for (const h of htmls.filter((x) => x.includes('gc-eco-card'))) {
    let m
    while ((m = re.exec(h))) {
      const [, accent, href, inner] = m
      const g = (c) => (inner.match(new RegExp(`class="gc-eco-card__${c}">([^<]*)`)) || ['', ''])[1]
      out.push({ accent, href, title: g('name'), supportingLabel: g('supporting'),
        detail: g('body'), cta: (inner.match(/gc-eco-card__cta">([^<]*)/) || ['', ''])[1].trim() })
    }
  }
  if (out.length !== 10) throw new Error(`expected 10 ecosystem cards in the live envelope, found ${out.length}`)
  return { products: out.slice(0, 3), solutions: out.slice(3) }
}

const roster = liveRoster()

/* ------------------------------------------------ declared overrides */

const OVERRIDES = []
const rewrite = (obj, key, from, to, reason) => {
  const cur = obj[key]
  if (cur !== from) throw new Error(`override no longer matches at ${key}\n  expected: ${from}\n  actual:   ${cur}`)
  obj[key] = to
  OVERRIDES.push({ field: key, from, to, reason })
}

const P = structuredClone(hubs.PRODUCTS_HUB)
const S = structuredClone(hubs.SOLUTIONS_HUB)

const REASON = 'GCALLS-028 DECISION 1 — taxonomy governed by EcosystemSection.tsx / GCALLS-020 (3 products, 7 solutions, Voicebot is a solution)'

rewrite(P.hero, 'description',
  'Gcalls có bốn sản phẩm phục vụ bốn bài toán khác nhau trong hoạt động giao tiếp với khách hàng: kênh nghe gọi cho đội ngũ, kiểm soát chất lượng hội thoại, vận hành chăm sóc khách hàng đa kênh, và tự động hóa các cuộc gọi lặp lại.',
  'Gcalls có ba sản phẩm phục vụ ba bài toán khác nhau trong hoạt động giao tiếp với khách hàng: kênh nghe gọi cho đội ngũ, kiểm soát chất lượng hội thoại, và vận hành chăm sóc khách hàng đa kênh.',
  REASON + ' — the automation clause described Voicebot, which is now a solution')

rewrite(P.directAnswer, 'answer',
  'Gcalls có bốn sản phẩm: Gcalls Plus Webphone là kênh nghe gọi và quản lý hoạt động cuộc gọi trên trình duyệt; QA QC Center sử dụng QC Bot AI để hỗ trợ đánh giá chất lượng hội thoại; Gcalls CX là nền tảng chăm sóc khách hàng đa kênh; Gcalls Voicebot AI dành cho các cuộc gọi lặp lại theo kịch bản đã thiết lập. Bốn sản phẩm giải quyết các bài toán khác nhau, không phải bốn mức giá của cùng một sản phẩm, và được chọn theo nhu cầu vận hành thực tế của doanh nghiệp.',
  'Gcalls có ba sản phẩm: Gcalls Plus Webphone là kênh nghe gọi và quản lý hoạt động cuộc gọi trên trình duyệt; QA QC Center sử dụng QC Bot AI để hỗ trợ đánh giá chất lượng hội thoại; Gcalls CX là nền tảng chăm sóc khách hàng đa kênh. Ba sản phẩm giải quyết các bài toán khác nhau, không phải ba mức giá của cùng một sản phẩm, và được chọn theo nhu cầu vận hành thực tế của doanh nghiệp.',
  REASON + ' — the Voicebot clause moves to /giai-phap/')

rewrite(P.cards, 'eyebrow', 'BỐN SẢN PHẨM', 'BA SẢN PHẨM', REASON)
rewrite(P.cards, 'note',
  'Bốn sản phẩm có thể dùng độc lập hoặc cùng nhau. Cấu hình phù hợp phụ thuộc vào quy mô đội ngũ, kênh giao tiếp và nhu cầu kiểm soát chất lượng của doanh nghiệp.',
  'Ba sản phẩm có thể dùng độc lập hoặc cùng nhau. Cấu hình phù hợp phụ thuộc vào quy mô đội ngũ, kênh giao tiếp và nhu cầu kiểm soát chất lượng của doanh nghiệp.',
  REASON)
rewrite(P.decisionGuide, 'h2', 'Ranh giới giữa bốn sản phẩm', 'Ranh giới giữa ba sản phẩm', REASON)

/* The Voicebot product card and its decision-guide row move to solutions. */
const voicebotCard = P.cards.items.find((i) => i.title === 'Gcalls Voicebot AI')
if (!voicebotCard) throw new Error('expected a Gcalls Voicebot AI product card to move')
P.cards.items = P.cards.items.filter((i) => i !== voicebotCard)
OVERRIDES.push({ field: 'PRODUCTS_HUB.cards.items', from: '4 items incl. "Gcalls Voicebot AI"', to: '3 items', reason: REASON + ' — card moved to SOLUTIONS_HUB intact' })

const voicebotRow = P.decisionGuide.rows.find((r) => r.solution === 'Gcalls Voicebot AI')
if (!voicebotRow) throw new Error('expected a Voicebot decision-guide row to move')
P.decisionGuide.rows = P.decisionGuide.rows.filter((r) => r !== voicebotRow)

rewrite(S.cards, 'eyebrow', 'BỐN NHÓM GIẢI PHÁP', 'BẢY GIẢI PHÁP', REASON)
rewrite(S.directAnswer, 'answer',
  'Gcalls có bốn nhóm giải pháp. Ba nhóm đầu là tích hợp hệ thống: kết nối tổng đài với CRM, với Helpdesk và với hệ thống bán hàng/POS, để cuộc gọi hoạt động cùng dữ liệu và quy trình doanh nghiệp đang sử dụng. Nhóm thứ tư là tổng đài quốc tế, dành cho doanh nghiệp cần đầu số và cấu hình liên lạc tại thị trường nước ngoài. Phạm vi triển khai của mỗi giải pháp được xác định theo hệ thống, dữ liệu và quy định thực tế.',
  'Gcalls có bảy giải pháp. Ba nhóm đầu là tích hợp hệ thống: kết nối tổng đài với CRM, với Helpdesk và với hệ thống bán hàng/POS, để cuộc gọi hoạt động cùng dữ liệu và quy trình doanh nghiệp đang sử dụng. Tổng đài quốc tế dành cho doanh nghiệp cần đầu số và cấu hình liên lạc tại thị trường nước ngoài. Ba giải pháp còn lại là tích hợp Voicebot AI, Cloud Call Center và Call Button Widget. Phạm vi triển khai của mỗi giải pháp được xác định theo hệ thống, dữ liệu và quy định thực tế.',
  REASON + ' — enumerates the same seven cards shown below it')

/*
 * The Voicebot card keeps its approved detail and points; its TITLE takes the
 * live-approved wording, because "Gcalls Voicebot AI" is the exact string the
 * EcosystemSection checkpoint forbids — it asserts Gcalls owns the engine.
 */
const live = Object.fromEntries(roster.solutions.map((s) => [s.href, s]))
const movedVoicebot = { ...voicebotCard, title: live['/voicebot-ai/'].title }
OVERRIDES.push({ field: 'voicebot card title', from: voicebotCard.title, to: movedVoicebot.title,
  reason: REASON + ' — the old title asserts Gcalls owns the voicebot engine, which the checkpoint forbids' })

/* The two offerings with no page of their own come wholly from the live roster. */
const extras = roster.solutions
  .filter((s) => s.href.startsWith('/lien-he/'))
  .map((s) => ({ title: s.title, detail: s.detail, points: [], path: s.href, cta: s.cta }))

S.cards.items = [movedVoicebot, ...S.cards.items, ...extras]
OVERRIDES.push({ field: 'SOLUTIONS_HUB.cards.items', from: '4 items', to: '7 items',
  reason: REASON + ' — Voicebot moved in; Cloud Call Center and Call Button Widget taken from the live homepage roster' })

S.decisionGuide.rows = [...S.decisionGuide.rows, { ...voicebotRow, solution: movedVoicebot.title }]

/* -------------------------------------------------------- to sections */

const str = (v) => (typeof v === 'string' ? v : '')
const cardsOf = (items) => items.map((i) => ({
  title: str(i.title), body: str(i.detail),
  href: str(i.path) || str(i.href), cta: str(i.cta),
  tags: Array.isArray(i.points) ? i.points.map(str) : [],
  supporting: str(i.supportingLabel),
}))

function hubPage(h, slug) {
  const sections = []

  if (h.directAnswer?.answer) {
    sections.push({ type: 'prose', from: 'directAnswer',
      heading: str(h.directAnswer.h2) || str(h.directAnswer.question), body: str(h.directAnswer.answer) })
  }
  if (h.cards?.items?.length) {
    sections.push({ type: 'cards', from: 'cards', eyebrow: str(h.cards.eyebrow),
      heading: str(h.cards.h2), cards: cardsOf(h.cards.items), note: str(h.cards.note) })
  }
  if (h.decisionGuide?.rows?.length) {
    sections.push({ type: 'steps', from: 'decisionGuide', eyebrow: str(h.decisionGuide.eyebrow),
      heading: str(h.decisionGuide.h2), lead: str(h.decisionGuide.lead),
      steps: h.decisionGuide.rows.map((r, i) => ({ n: i + 1, title: str(r.solution), body: `${str(r.problem)} ${str(r.reason)}`.trim() })),
      note: str(h.decisionGuide.note) })
  }
  if (h.links) {
    const items = h.links.items || h.links
    if (Array.isArray(items) && items.length) {
      sections.push({ type: 'cards', from: 'links', heading: str(h.links.h2) || 'Xem thêm',
        cards: items.map((l) => ({ title: str(l.title) || str(l.label), body: str(l.detail), href: str(l.path) || str(l.href) })) })
    }
  }

  return {
    slug, family: slug === 'san-pham' ? 'product-overview' : 'solution-overview',
    sources: [{ file: 'src/data/hubs.ts', sha256: sha(HUBS_FILE) }],
    taxonomy_override: {
      source: 'GCALLS-020 / src/components/home/EcosystemSection.tsx',
      roster_source: 'wordpress/wp-content/plugins/gcalls-core/data/homepage-elementor.json (live-verified)',
      changes: OVERRIDES.filter((o) => o.field.startsWith(slug === 'san-pham' ? 'PRODUCTS' : 'SOLUTIONS') || !o.field.includes('_HUB')),
    },
    hero: { eyebrow: str(h.hero.eyebrow), h1: str(h.hero.h1), description: str(h.hero.description), points: [] },
    sections,
    faq: [],
    cta: h.finalCta ? { heading: str(h.finalCta.h2) || str(h.finalCta.heading), body: str(h.finalCta.lead) || str(h.finalCta.body), label: str(h.finalCta.cta) || str(h.finalCta.label) } : null,
    attribution: h.lead || null,
  }
}

/* ------------------------------------------------------------ contact */

function contactPage() {
  return {
    slug: 'lien-he', family: 'contact',
    sources: [{ file: 'src/pages/ContactPage.tsx', sha256: sha(path.join(REPO, 'src/pages/ContactPage.tsx')) },
              { file: 'src/config/navigation.ts (CONTACT)', sha256: sha(path.join(REPO, 'src/config/navigation.ts')) }],
    /*
     * React's /lien-he/ is a direct-contact card plus the shared LeadForm and
     * nothing else. No need groups, no response-time promise, no privacy copy
     * and no FAQ exist in the source, so none is written here.
     */
    hero: { eyebrow: '', h1: 'Liên hệ Gcalls', description: '', points: [] },
    sections: [{
      type: 'cards', from: 'ContactPage.tsx — direct contact card',
      heading: 'Liên hệ trực tiếp',
      cards: [
        { title: 'Email', body: nav.CONTACT.email, href: '' },
        { title: 'Hotline', body: nav.CONTACT.phone, href: '' },
      ],
    }],
    form_slot: { state: 'blocked_runtime',
      note: 'The lead form ships in a separate Core release and is not in this one. Rendered here as a blocked slot; never as a form that appears to send.' },
    faq: [], cta: null,
    attribution: { intent: 'consultation', source: 'contact' },
  }
}

/* --------------------------------------------------------------- emit */

const existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')).pages : []
const keep = existing.filter((p) => p.family === 'solution-detail')

const pages = [...keep, hubPage(P, 'san-pham'), hubPage(S, 'giai-phap'), contactPage()]
  .sort((a, b) => a.slug.localeCompare(b.slug))

fs.writeFileSync(OUT, JSON.stringify({
  schema: 1,
  generated_at_gmt: new Date().toISOString(),
  note: 'Rendered read-only at request time. Nothing here is written to the database. See docs/CONTENT-RENDER-ADR.md.',
  pages,
}, null, 2) + '\n')

console.log(`content-pages.json — ${pages.length} page(s)`)
for (const p of pages) {
  const cards = p.sections.filter((s) => s.type === 'cards').reduce((a, s) => a + s.cards.length, 0)
  console.log(`  ${p.slug.padEnd(30)} ${p.family.padEnd(18)} sections=${String(p.sections.length).padStart(2)} items=${String(cards).padStart(2)} faq=${String(p.faq.length).padStart(2)}`)
}
console.log(`\ntaxonomy overrides recorded: ${OVERRIDES.length}`)
for (const o of OVERRIDES) console.log(`  ${o.field}`)
console.log(`\nsha256 ${crypto.createHash('sha256').update(fs.readFileSync(OUT)).digest('hex')}`)
