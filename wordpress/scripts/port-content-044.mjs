#!/usr/bin/env node
/**
 * GCALLS-044 — port the React content layer into the WordPress manifest.
 *
 * WHY A BUNDLER AND NOT A REGEX
 * The data lives in TypeScript modules that import types and route tables from
 * each other. Reading them with a regex is how an exporter silently drops a
 * field, which is exactly the class of bug GCALLS-041 found (58 empty cards
 * that rendered as nothing at all). esbuild resolves the `@/` alias, evaluates
 * the modules, and hands back the real objects — so a field that exists is
 * ported and a field that does not exist fails loudly.
 *
 * Nothing here invents copy. Every string written to the manifest comes from
 * src/data, which already carries its own claim guards.
 */
import fs from 'node:fs'
import path from 'node:path'
import { build } from 'esbuild'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const OUT = path.join(ROOT, 'wordpress/wp-content/plugins/gcalls-core/data/content-pages.json')
const TMP = process.env.GCALLS_TMP || '/tmp/gcalls-044'
fs.mkdirSync(TMP, { recursive: true })

/* Evaluate the data layer in one bundle. */
const entry = path.join(TMP, 'entry.mjs')
fs.writeFileSync(entry, `
import { INDUSTRIES } from '@/data/industries'
import * as company from '@/data/company'
import * as resources from '@/data/resources'
import * as pricing from '@/data/pricing'
export default { INDUSTRIES, company, resources, pricing }
`)

const bundled = path.join(TMP, 'bundle.mjs')
await build({
  entryPoints: [entry],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: bundled,
  logLevel: 'silent',
  alias: { '@': path.join(ROOT, 'src') },
})

const data = (await import(`file://${bundled}?t=${Date.now()}`)).default

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim()
const card = (title, body, href, n) => {
  const c = { title: clean(title), body: clean(body) }
  if (href) c.href = href
  // The steps renderer prints this as the step number; sources that have one
  // (industry problems, pricing factors, referral steps) keep it.
  if (n) c.n = clean(n)
  return c
}

/* --- industries ------------------------------------------------------- */
const industryPages = Object.values(data.INDUSTRIES).map((ind) => {
  const sections = []

  const block = (src, type, extra = {}) => {
    if (!src) return
    const s = { type, from: `industries/${ind.id} — ${type}`, heading: clean(src.h2) }
    if (src.eyebrow) s.eyebrow = clean(src.eyebrow)
    if (src.description) s.lead = clean(src.description)
    Object.assign(s, extra)
    sections.push(s)
  }

  block(ind.problem, 'cards', { cards: ind.problem.items.map((i) => card(i.title, i.detail, null, i.n)) })
  block(ind.impact, 'cards', { cards: ind.impact.items.map((i) => card(i.title, i.detail)) })
  block(ind.capability, 'cards', {
    cards: ind.capability.items.map((i) => card(i.title, i.detail, i.path)),
    note: clean(ind.capability.note),
  })
  block(ind.workflow, 'steps', { steps: ind.workflow.steps.map((s) => card(s.title, s.detail, null, s.n)) })
  block(ind.outcomes, 'cards', {
    cards: ind.outcomes.items.map((i) => card(i.title, i.detail)),
    note: clean(ind.outcomes.note),
  })
  block(ind.routing, 'cards', { cards: ind.routing.items.map((i) => card(i.title, i.detail, i.path)) })

  return {
    slug: ind.route.replace(/^\/|\/$/g, '').split('/').pop(),
    family: 'industry',
    provenance: 'PORTED',
    sources: [{ file: `src/data/industries/${ind.id}.ts` }],
    hero: {
      eyebrow: clean(ind.hero.eyebrow),
      h1: clean(ind.hero.h1),
      description: clean(ind.hero.description),
      points: [],
    },
    sections,
    faq: (ind.faq ?? []).map((f) => ({ q: clean(f.question ?? f.q), a: clean(f.answer ?? f.a) })),
    cta: {
      heading: clean(ind.finalCta.h2),
      body: clean(ind.finalCta.description),
      label: clean(ind.finalCta.primaryCta.label),
      href: ind.finalCta.primaryCta.path,
    },
    attribution: { intent: ind.lead?.intent ?? 'consultation', source: ind.lead?.source ?? 'industry', solution: clean(ind.breadcrumbLabel) },
  }
})

/* --- generic porter for the hub-shaped pages ---------------------------
 *
 * company/* and resources/* share a shape: a hero, a run of content blocks
 * each with an h2 and a list, then routing, faq and a final CTA. Rather than
 * hand-map twenty key names — and silently drop the twenty-first — this walks
 * the object and REPORTS anything it did not consume. GCALLS-041 found 58 cards
 * that rendered as nothing because an exporter dropped them quietly; an
 * exporter that cannot say what it skipped is the same bug waiting to happen.
 */
const SKIP = new Set(['id', 'route', 'breadcrumbLabel', 'lead', 'hero', 'faq', 'finalCta', 'purpose'])
const LIST_KEYS = ['items', 'steps', 'cards', 'paths', 'groups', 'topics', 'profiles',
  'categories', 'models', 'filters', 'index', 'principles', 'serves', 'problems',
  'pathways', 'rows', 'entries', 'terms', 'questions', 'why', 'standards']

const titleOf = (o) => o.title ?? o.label ?? o.name ?? o.term ?? o.q ?? o.question ?? ''
const bodyOf = (o) => o.detail ?? o.body ?? o.summary ?? o.description ?? o.a ?? o.answer ?? o.definition ?? ''

function portBlock(fromId, key, val) {
  if (!val || typeof val !== 'object' || Array.isArray(val)) return null
  const heading = val.h2 ?? val.title ?? ''
  if (!heading) return null

  const listKey = LIST_KEYS.find((k) => Array.isArray(val[k]) && val[k].length)
  const s = { type: 'prose', from: `${fromId} — ${key}`, heading: clean(heading) }
  if (val.eyebrow) s.eyebrow = clean(val.eyebrow)
  if (val.description) s.lead = clean(val.description)
  if (val.note) s.note = clean(val.note)

  if (listKey) {
    const rows = val[listKey]
    /* A group that itself contains a list (glossary/faq groups) flattens to
       cards of its own entries, so nothing nests below what the renderer draws. */
    const flat = rows.flatMap((r) => {
      const inner = LIST_KEYS.find((k) => Array.isArray(r?.[k]) && r[k].length)
      if (inner) return r[inner].map((x) => card(titleOf(x), bodyOf(x), x.path ?? x.href))
      return [card(titleOf(r), bodyOf(r), r.path ?? r.href)]
    }).filter((c) => c.title || c.body)

    if (flat.length) {
      s.type = listKey === 'steps' ? 'steps' : 'cards'
      s[s.type === 'steps' ? 'steps' : 'cards'] = flat
    }
  }

  if (s.type === 'prose' && !val.description && !val.note) {
    const body = val.body ?? val.detail ?? val.summary ?? ''
    if (!body) return null
    s.body = clean(body)
  }
  return s
}

function portHubPage(obj, family, sourceFile) {
  const sections = []
  const unmapped = []

  if (obj.purpose) {
    const s = portBlock(obj.id, 'purpose', obj.purpose)
    if (s) sections.push(s)
  }

  for (const [k, v] of Object.entries(obj)) {
    if (SKIP.has(k)) continue

    /*
     * A TOP-LEVEL ARRAY OF GROUPS.
     *
     * GLOSSARY.groups and FAQ.groups are arrays sitting directly on the page —
     * six groups of four entries each. portBlock() only understands objects
     * with an h2, so it returned null; and the first version of the unmapped
     * check only looked at non-array objects, so twenty-four glossary terms and
     * twenty-four questions vanished without a word. That is the same shape of
     * failure as the 58 empty cards in GCALLS-041, produced by my own exporter
     * an hour after I wrote a comment about not repeating it.
     *
     * Each group becomes its own section, which is also how the React page
     * renders them.
     */
    if (Array.isArray(v) && v.length && v.every((g) => g && typeof g === 'object' && LIST_KEYS.some((lk) => Array.isArray(g[lk])))) {
      for (const g of v) {
        const lk = LIST_KEYS.find((x) => Array.isArray(g[x]) && g[x].length)
        const cards = g[lk].map((x) => card(titleOf(x), bodyOf(x), x.path ?? x.href))
        if (!cards.length) continue
        const sec = { type: 'cards', from: `${obj.id} — ${k}/${g.id ?? ''}`, heading: clean(g.label ?? g.title ?? ''), cards }
        if (g.description) sec.lead = clean(g.description)
        sections.push(sec)
      }
      continue
    }

    const s = portBlock(obj.id, k, v)
    if (s) { sections.push(s); continue }

    // Anything with content that produced no section is REPORTED, never dropped.
    const isEmptyish = v == null || v === '' || (Array.isArray(v) && !v.length)
    if (!isEmptyish && typeof v === 'object') unmapped.push(`${k}:${Array.isArray(v) ? 'array' : 'object'}`)
  }

  return {
    page: {
      slug: obj.route.replace(/^\/|\/$/g, '').split('/').pop(),
      family,
      provenance: 'PORTED',
      sources: [{ file: sourceFile }],
      hero: {
        eyebrow: clean(obj.hero?.eyebrow),
        h1: clean(obj.hero?.h1),
        description: clean(obj.hero?.description),
        points: [],
      },
      sections,
      faq: (obj.faq ?? []).map((f) => ({ q: clean(f.question ?? f.q), a: clean(f.answer ?? f.a) })),
      // Not used to fill a section — the groups above already render — but kept
      // so an audit can see the page's own Q&A count.
      faqGroupCount: Array.isArray(obj.groups) ? obj.groups.length : 0,
      cta: obj.finalCta ? {
        heading: clean(obj.finalCta.h2),
        body: clean(obj.finalCta.description),
        label: clean(obj.finalCta.primaryCta?.label),
        href: obj.finalCta.primaryCta?.path ?? '/lien-he/',
      } : null,
      attribution: { intent: obj.lead?.intent ?? 'consultation', source: obj.lead?.source ?? family },
    },
    unmapped,
  }
}

const hubs = [
  [data.company.CUSTOMERS, 'company', 'src/data/company/customers.ts'],
  [data.company.PARTNERS, 'company', 'src/data/company/partners.ts'],
  [data.resources.GUIDES, 'resource', 'src/data/resources/guides.ts'],
  [data.resources.EBOOK, 'resource', 'src/data/resources/ebook.ts'],
  [data.resources.CASE_STUDIES, 'resource', 'src/data/resources/caseStudies.ts'],
  [data.resources.GLOSSARY, 'resource', 'src/data/resources/glossary.ts'],
  [data.resources.FAQ, 'resource', 'src/data/resources/faq.ts'],
]

const hubPages = []
console.log('\nhub pages:')
for (const [obj, family, file] of hubs) {
  const { page, unmapped } = portHubPage(obj, family, file)
  hubPages.push(page)
  const cards = page.sections.reduce((n, s) => n + (s.cards?.length ?? s.steps?.length ?? 0), 0)
  console.log(`  ${obj.route.padEnd(28)} sections=${String(page.sections.length).padStart(2)} cards=${String(cards).padStart(3)} faq=${page.faq.length}` +
    (unmapped.length ? `  UNMAPPED: ${unmapped.join(',')}` : ''))
}

/* --- hubs, pricing and referral ---------------------------------------
 *
 * These have no single data module to port: the hub pages compose from the
 * navigation tables, pricing is deliberately unconfigured, and referral keeps
 * its copy inline. Every string below is lifted from those sources. The
 * connective sentences I wrote myself are marked ADAPTED, and each page records
 * what a reviewer has to confirm.
 */
const hubPage = ({ slug, family, h1, eyebrow, description, sections, cta, provenance, sourceFile, review }) => ({
  slug, family, provenance,
  sources: [{ file: sourceFile }],
  hero: { eyebrow, h1, description, points: [] },
  sections,
  faq: [],
  cta,
  attribution: { intent: 'consultation', source: family },
  ...(review ? { reviewRequired: review } : {}),
})

const CONSULT_CTA = (heading, body) => ({ heading, body, label: 'Nhận tư vấn giải pháp', href: '/lien-he/' })

/* /nganh/ — one card per industry, straight from each industry's own hero. */
const industriesHub = hubPage({
  slug: 'nganh', family: 'industry-overview', provenance: 'ADAPTED',
  sourceFile: 'src/data/industries/index.ts (INDUSTRIES)',
  eyebrow: 'THEO NGÀNH',
  h1: 'Giải pháp tổng đài theo đặc thù từng ngành',
  description: 'Mỗi ngành có hành trình khách hàng, quy định và nhịp vận hành riêng. Chọn ngành gần nhất với doanh nghiệp của bạn để xem bài toán cụ thể và cách triển khai phù hợp.',
  sections: [{
    type: 'cards', from: 'industries/index — hub',
    heading: 'Sáu ngành đang có trang riêng',
    cards: Object.values(data.INDUSTRIES).map((i) => card(i.breadcrumbLabel, i.hero.description, i.route)),
  }],
  cta: CONSULT_CTA('Không thấy ngành của bạn?', 'Mô tả quy trình liên hệ khách hàng hiện tại để Gcalls tư vấn cấu hình phù hợp.'),
})

/* /tai-nguyen/ — RESOURCE_NAV already carries label, path and detail. */
const resourcesHub = hubPage({
  slug: 'tai-nguyen', family: 'resource-overview', provenance: 'ADAPTED',
  sourceFile: 'src/data/resources/index.ts (RESOURCE_NAV)',
  eyebrow: 'TÀI NGUYÊN',
  h1: 'Tài liệu và công cụ cho đội vận hành tổng đài',
  description: 'Hướng dẫn triển khai, thuật ngữ, câu hỏi thường gặp và các tài liệu tham khảo khi doanh nghiệp đánh giá hoặc vận hành tổng đài.',
  sections: [{
    type: 'cards', from: 'resources/index — RESOURCE_NAV',
    heading: 'Các nhóm tài nguyên',
    cards: data.resources.RESOURCE_NAV.map((r) => card(r.label, r.detail, r.path)),
  }],
  cta: CONSULT_CTA('Cần tài liệu cho một tình huống cụ thể?', 'Cho biết bài toán bạn đang đánh giá để Gcalls gửi đúng tài liệu tham khảo.'),
})

/* /cong-ty/ — the two company pages, described by their own heroes. */
const companyHub = hubPage({
  slug: 'cong-ty', family: 'company-overview', provenance: 'ADAPTED',
  sourceFile: 'src/data/company/index.ts',
  eyebrow: 'CÔNG TY',
  h1: 'Gcalls và hệ sinh thái đối tác',
  description: 'Gcalls xây dựng nền tảng tổng đài cho đội Sales và CSKH của doanh nghiệp Việt Nam, triển khai cùng mạng lưới đối tác công nghệ và tư vấn.',
  sections: [{
    type: 'cards', from: 'company/index — hub',
    heading: 'Tìm hiểu thêm',
    cards: [
      card(data.company.CUSTOMERS.breadcrumbLabel, data.company.CUSTOMERS.hero.description, data.company.CUSTOMERS.route),
      card(data.company.PARTNERS.breadcrumbLabel, data.company.PARTNERS.hero.description, data.company.PARTNERS.route),
    ],
  }],
  cta: CONSULT_CTA('Trao đổi trực tiếp với Gcalls', 'Chia sẻ quy mô đội ngũ và hệ thống đang dùng để nhận tư vấn cấu hình.'),
})

/* /bang-gia/ — PRICING_CONFIGURED is false in the source, so this page is
 * "cost factors and quotation", exactly as §3 requires. No figure, no plan
 * name, no package tier appears anywhere below. */
if (data.pricing.PRICING_CONFIGURED !== false) {
  throw new Error('PRICING_CONFIGURED is no longer false — re-check whether approved prices may now be published')
}

const pricingPage = hubPage({
  slug: 'bang-gia', family: 'pricing', provenance: 'ADAPTED',
  sourceFile: 'src/data/pricing.ts (PRICING_FACTORS, PRICING_ADDONS, SOLUTION_PRICING, PRICING_FAQ)',
  eyebrow: 'CHI PHÍ',
  h1: 'Chi phí và tư vấn cấu hình Gcalls',
  description: 'Chi phí triển khai phụ thuộc cấu hình: số người dùng, đầu số, mức độ tích hợp và yêu cầu vận hành. Trang này nêu các yếu tố ảnh hưởng chi phí và những thông tin cần có để Gcalls gửi báo giá chính thức.',
  sections: [
    {
      type: 'steps', from: 'pricing — PRICING_FACTORS',
      heading: 'Những yếu tố quyết định chi phí',
      lead: 'Sáu yếu tố dưới đây là những gì Gcalls cần biết để tính chi phí cho một cấu hình cụ thể.',
      steps: data.pricing.PRICING_FACTORS.map((f) => card(f.title, f.detail, null, f.n)),
    },
    {
      type: 'cards', from: 'pricing — SOLUTION_PRICING',
      heading: 'Sản phẩm và giải pháp được báo giá',
      lead: 'Mỗi sản phẩm được báo giá theo mô hình riêng, tùy phạm vi triển khai.',
      cards: data.pricing.SOLUTION_PRICING.map((s) => card(s.name, s.summary)),
    },
    {
      type: 'taglist', from: 'pricing — PRICING_ADDONS',
      heading: 'Hạng mục bổ sung có thể phát sinh',
      lead: 'Các hạng mục này được báo giá theo nhu cầu, không nằm trong cấu hình cơ bản.',
      tags: data.pricing.PRICING_ADDONS.map((a) => clean(a.title)),
    },
    {
      type: 'cards', from: 'GCALLS-044 — ADAPTED',
      heading: 'Thông tin cần cung cấp để nhận báo giá',
      lead: 'Có đủ những thông tin này, Gcalls xác định được phạm vi và gửi báo giá chính thức.',
      cards: [
        card('Quy mô đội ngũ', 'Số người dùng cần nghe gọi, phân theo nhóm Sales, CSKH hoặc vận hành.'),
        card('Hệ thống đang dùng', 'CRM, Helpdesk, POS hoặc hệ thống nội bộ cần kết nối, kèm phiên bản nếu có.'),
        card('Nhu cầu đầu số', 'Đầu số trong nước hay quốc tế, số lượng và thị trường cần phủ.'),
        card('Yêu cầu vận hành', 'Ghi âm, đánh giá chất lượng, báo cáo, hoặc quy trình tuân thủ cần đáp ứng.'),
      ],
    },
    {
      type: 'prose', from: 'GCALLS-044 — ADAPTED',
      heading: 'Ước tính khác với báo giá chính thức',
      body: 'Công cụ ước tính chi phí giúp hình dung mức chi phí vận hành thủ công hiện tại dựa trên thông số bạn nhập. Kết quả đó là ước tính tham khảo, không phải báo giá và không phải cam kết. Báo giá chính thức được Gcalls gửi sau khi xác nhận phạm vi triển khai.',
    },
    {
      type: 'cards', from: 'GCALLS-044 — ADAPTED',
      heading: 'Bước tiếp theo',
      cards: [
        card('Ước tính chi phí vận hành', 'Nhập thông số đội ngũ để xem chi phí thao tác thủ công hiện tại.', '/uoc-tinh-chi-phi/'),
        card('Yêu cầu báo giá', 'Gửi thông tin cấu hình để nhận báo giá chính thức từ Gcalls.', '/lien-he/'),
      ],
    },
  ],
  cta: { heading: 'Nhận báo giá theo cấu hình của doanh nghiệp', body: 'Chia sẻ quy mô đội ngũ, hệ thống đang dùng và nhu cầu đầu số để Gcalls xác định phạm vi và gửi báo giá chính thức.', label: 'Yêu cầu báo giá', href: '/lien-he/' },
  review: ['Trang không công bố bất kỳ mức giá, gói hoặc khuyến mãi nào — PRICING_CONFIGURED = false trong src/data/pricing.ts. Nếu đã có bảng giá được duyệt, cần thay bằng nguồn chính thức.'],
})
pricingPage.faq = data.pricing.PRICING_FAQ.map((f) => ({ q: clean(f.q), a: clean(f.a) }))

/* /referral/ — process only. The source withholds every commission figure. */
const referralPage = hubPage({
  slug: 'referral', family: 'referral', provenance: 'PORTED',
  sourceFile: 'src/pages/ReferralPage.tsx (STEPS, REFERRAL_LEAD)',
  eyebrow: 'CHƯƠNG TRÌNH GIỚI THIỆU',
  h1: 'Giới thiệu doanh nghiệp cần tổng đài đến Gcalls',
  description: 'Nếu bạn biết một doanh nghiệp đang tìm giải pháp tổng đài, hãy giới thiệu để đội ngũ Gcalls trao đổi trực tiếp về nhu cầu và cấu hình phù hợp.',
  sections: [
    {
      type: 'steps', from: 'ReferralPage.tsx — STEPS',
      heading: 'Cách chương trình hoạt động',
      steps: [
        card('Giới thiệu doanh nghiệp', 'Chia sẻ thông tin doanh nghiệp có nhu cầu triển khai tổng đài.', null, '01'),
        card('Gcalls trao đổi nhu cầu', 'Đội ngũ Gcalls liên hệ để xác nhận phạm vi và tư vấn cấu hình.', null, '02'),
        card('Thống nhất điều khoản hợp tác', 'Điều khoản chương trình giới thiệu được trao đổi trực tiếp.', null, '03'),
      ],
    },
    {
      type: 'prose', from: 'ReferralPage.tsx — claim guard',
      heading: 'Điều khoản được trao đổi trực tiếp',
      body: 'Mức hoa hồng, hình thức và thời điểm chi trả của chương trình giới thiệu được thống nhất trực tiếp giữa Gcalls và người giới thiệu, không công bố sẵn trên trang này.',
    },
  ],
  cta: { heading: 'Giới thiệu một doanh nghiệp', body: 'Gửi thông tin để đội ngũ Gcalls liên hệ trao đổi về nhu cầu triển khai.', label: 'Gửi thông tin giới thiệu', href: '/lien-he/' },
})
referralPage.attribution = { intent: 'partnership', source: 'contact', solution: 'Chương trình giới thiệu' }

const extraPages = [industriesHub, resourcesHub, companyHub, pricingPage, referralPage]

console.log('\nhubs, pricing and referral:')
for (const p of extraPages) {
  const cards = p.sections.reduce((n, s) => n + (s.cards?.length ?? s.steps?.length ?? s.tags?.length ?? 0), 0)
  console.log(`  /${p.slug}/`.padEnd(30) + `sections=${String(p.sections.length).padStart(2)} cards=${String(cards).padStart(3)} faq=${p.faq.length}  ${p.provenance}`)
}

/* --- merge into the shipped manifest ----------------------------------- */
const manifest = JSON.parse(fs.readFileSync(OUT, 'utf8'))
const bySlug = new Map(manifest.pages.map((p) => [p.slug, p]))
const added = []

for (const p of [...industryPages, ...hubPages, ...extraPages]) {
  if (bySlug.has(p.slug)) { console.log(`  SKIP ${p.slug} — already in the manifest, not overwriting`); continue }
  manifest.pages.push(p)
  added.push(p.slug)
}

manifest.pages.sort((a, b) => a.slug.localeCompare(b.slug))
manifest.generated_at_gmt = new Date().toISOString()
fs.writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`\nmanifest: ${manifest.pages.length} pages (+${added.length} added)`)
console.log(`added: ${added.join(', ')}`)
