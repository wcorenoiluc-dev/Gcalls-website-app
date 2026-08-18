/**
 * GCALLS pricing configuration — single source of truth.
 *
 * Consumed by BOTH `/bang-gia/` and `/uoc-tinh-chi-phi/`. Do not duplicate
 * pricing constants anywhere else; add them here and read them through the
 * helpers at the bottom of this file.
 *
 * ---------------------------------------------------------------------------
 * ⚠️ NO APPROVED PUBLIC PRICING EXISTS YET
 * ---------------------------------------------------------------------------
 * Every entry below has `pricingConfigured: false` and null money fields.
 * While that is the case the UI must render a quote-request state
 * ("Nhận báo giá" / "Liên hệ"), never a number — and never `0₫`, "Free" or a
 * discount.
 *
 * When approved rates arrive: fill `monthlyPrice` / `annualPrice` /
 * `oneTimeFee`, flip `pricingConfigured` to true, and the existing components
 * render them with no structural change. `formatPrice()` is the only place
 * that decides between a number and the fallback label.
 *
 * The same gate applies to JSON-LD: `buildPricingJsonLd()` omits `Offer.price`
 * entirely until pricing is configured, so no fake zero reaches search engines.
 * ---------------------------------------------------------------------------
 */

import { ROUTES, type RoutePath } from '@/config/navigation'

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

/** How a given product's cost is arrived at. Qualitative, never numeric. */
export type PricingMode =
  | 'package'          // tiered packages + team size
  | 'usage'            // driven by volume / traffic
  | 'integration'      // driven by integration scope
  | 'custom'           // scoped per engagement

export interface PlanFeature {
  label: string
  /** Only rendered once entitlements are approved. */
  value?: string
  included?: boolean
}

export interface PricingPlan {
  id: string
  name: string
  /** Who the tier is for. Safe, non-committal positioning copy. */
  audience: string
  description?: string
  pricingMode: PricingMode
  /** VND per user per month. null until approved. */
  monthlyPrice: number | null
  annualPrice: number | null
  oneTimeFee: number | null
  /** Entitlements. Empty until verified — never pad this to look complete. */
  features: PlanFeature[]
  cta: { label: string; path: RoutePath }
  /** Gate. While false, no numeric value may be rendered for this plan. */
  pricingConfigured: boolean
  /** Optional non-superlative highlight label. */
  highlight?: string
}

export interface SolutionPricing {
  id: string
  name: string
  summary: string
  /** Plain-language description of what drives cost. */
  pricingModel: string
  cta: { label: string; path: RoutePath }
  pricingConfigured: boolean
  /** Extra estimator field this solution needs, if any. */
  estimatorField?: { id: string; label: string; unit: string }
}

/* ------------------------------------------------------------------ *
 * Global gate
 * ------------------------------------------------------------------ */

/** True only when every published product has approved rates. */
export const PRICING_CONFIGURED = false

/** Labels used wherever a price would otherwise appear. */
export const PRICE_FALLBACK = {
  quote: 'Nhận báo giá',
  contact: 'Liên hệ',
  byConfig: 'Theo cấu hình',
  consult: 'Tư vấn theo nhu cầu',
  estimator: 'Liên hệ để nhận báo giá',
} as const

export const PRICING_NOTE = 'Chi phí phụ thuộc cấu hình'

/* ------------------------------------------------------------------ *
 * Gcalls Plus packages
 *
 * Tier names are structural placeholders carried over from the previous
 * Gcalls pricing model. No limits, minutes, storage, SLA, support level or
 * feature entitlement is asserted — none is approved.
 * ------------------------------------------------------------------ */

export const GCALLS_PLUS_PLANS: PricingPlan[] = [
  {
    id: 'startup',
    name: 'Startup',
    audience: 'Đội ngũ nhỏ bắt đầu triển khai kênh nghe gọi chuyên nghiệp.',
    pricingMode: 'package',
    monthlyPrice: null,
    annualPrice: null,
    oneTimeFee: null,
    features: [],
    cta: { label: 'Tư vấn gói Startup', path: ROUTES.costEstimator },
    pricingConfigured: false,
  },
  {
    id: 'business',
    name: 'Business',
    audience:
      'Đội Sales/CSKH cần quản lý cuộc gọi và dữ liệu vận hành tập trung hơn.',
    pricingMode: 'package',
    monthlyPrice: null,
    annualPrice: null,
    oneTimeFee: null,
    features: [],
    cta: { label: 'Tư vấn gói Business', path: ROUTES.costEstimator },
    pricingConfigured: false,
    highlight: 'Gợi ý cho đội ngũ đang mở rộng',
  },
  {
    id: 'professional',
    name: 'Professional',
    audience:
      'Đội ngũ có quy mô lớn hơn và yêu cầu quản trị, báo cáo hoặc tích hợp sâu hơn.',
    pricingMode: 'package',
    monthlyPrice: null,
    annualPrice: null,
    oneTimeFee: null,
    features: [],
    cta: { label: 'Tư vấn gói Professional', path: ROUTES.costEstimator },
    pricingConfigured: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    audience:
      'Doanh nghiệp cần cấu hình, tích hợp và quy trình triển khai theo yêu cầu riêng.',
    pricingMode: 'custom',
    monthlyPrice: null,
    annualPrice: null,
    oneTimeFee: null,
    features: [],
    cta: { label: 'Trao đổi với Gcalls', path: ROUTES.costEstimator },
    pricingConfigured: false,
  },
]

/* ------------------------------------------------------------------ *
 * Solutions — also drives the product selector and the estimator
 * ------------------------------------------------------------------ */

export const SOLUTION_PRICING: SolutionPricing[] = [
  {
    id: 'gcalls-plus',
    name: 'Gcalls Plus',
    summary: 'Browser-based Webphone / Call Center tinh gọn.',
    pricingModel: 'Theo gói + quy mô người dùng',
    cta: { label: 'Xem Gcalls Plus', path: ROUTES.gcallsPlus },
    pricingConfigured: false,
    estimatorField: { id: 'minutes', label: 'Lưu lượng gọi ước tính', unit: 'phút/tháng' },
  },
  {
    id: 'crm',
    name: 'Tích hợp CRM',
    summary: 'Kết nối cuộc gọi với dữ liệu và workflow CRM.',
    pricingModel: 'Theo số người dùng + phạm vi tích hợp + triển khai',
    cta: { label: 'Xem tích hợp CRM', path: ROUTES.crmIntegration },
    pricingConfigured: false,
    estimatorField: { id: 'integrations', label: 'Số hệ thống cần tích hợp', unit: 'hệ thống' },
  },
  {
    id: 'helpdesk',
    name: 'Tích hợp Helpdesk',
    summary: 'Kết nối cuộc gọi với quy trình hỗ trợ khách hàng.',
    pricingModel: 'Theo người dùng + tích hợp + yêu cầu workflow',
    cta: { label: 'Xem tích hợp Helpdesk', path: ROUTES.helpdeskIntegration },
    pricingConfigured: false,
    estimatorField: { id: 'integrations', label: 'Số hệ thống cần tích hợp', unit: 'hệ thống' },
  },
  {
    id: 'pos',
    name: 'Tích hợp POS',
    summary: 'Kết nối giao tiếp với dữ liệu bán hàng / khách hàng.',
    pricingModel: 'Theo hệ thống tích hợp và phạm vi triển khai',
    cta: { label: 'Xem tích hợp POS', path: ROUTES.posIntegration },
    pricingConfigured: false,
    estimatorField: { id: 'integrations', label: 'Số hệ thống cần tích hợp', unit: 'hệ thống' },
  },
  {
    id: 'international',
    name: 'Tổng đài quốc tế',
    summary: 'Đầu số và hạ tầng liên lạc theo thị trường.',
    pricingModel: 'Theo quốc gia + loại đầu số + lưu lượng gọi',
    cta: { label: 'Xem tổng đài quốc tế', path: ROUTES.internationalCalling },
    pricingConfigured: false,
    estimatorField: { id: 'numbers', label: 'Số đầu số quốc tế', unit: 'đầu số' },
  },
  {
    id: 'qa-qc',
    name: 'QA QC Center',
    summary: 'AI hỗ trợ kiểm soát chất lượng hội thoại.',
    pricingModel:
      'Theo quy mô đội ngũ + khối lượng hội thoại cần phân tích + cấu hình QA',
    cta: { label: 'Xem QA QC Center', path: ROUTES.qcCenter },
    pricingConfigured: false,
    estimatorField: { id: 'qcVolume', label: 'Hội thoại cần phân tích', unit: 'hội thoại/tháng' },
  },
  {
    id: 'cx',
    name: 'Gcalls CX',
    summary: 'Contact Center đa kênh.',
    pricingModel: 'Theo Agent + kênh giao tiếp + tích hợp + quy mô vận hành',
    cta: { label: 'Xem Gcalls CX', path: ROUTES.gcallsCx },
    pricingConfigured: false,
    estimatorField: { id: 'channels', label: 'Số kênh giao tiếp', unit: 'kênh' },
  },
]

/* ------------------------------------------------------------------ *
 * Cost factors
 * ------------------------------------------------------------------ */

export const PRICING_FACTORS = [
  {
    n: '01',
    title: 'Sản phẩm / giải pháp',
    detail: 'Gcalls Plus, tích hợp, quốc tế, QA QC Center hoặc Gcalls CX.',
  },
  {
    n: '02',
    title: 'Số lượng Agent',
    detail: 'Quy mô người dùng ảnh hưởng tới cấu hình cần triển khai.',
  },
  {
    n: '03',
    title: 'Lưu lượng sử dụng',
    detail:
      'Phút gọi hoặc khối lượng tương tác có thể ảnh hưởng tới chi phí vận hành.',
  },
  {
    n: '04',
    title: 'Hotline & đầu số',
    detail: 'Loại và số lượng đầu số cần sử dụng.',
  },
  {
    n: '05',
    title: 'Tích hợp',
    detail: 'CRM, Helpdesk, POS hoặc hệ thống doanh nghiệp.',
  },
  {
    n: '06',
    title: 'Yêu cầu triển khai',
    detail: 'Phạm vi cấu hình, dữ liệu và yêu cầu kỹ thuật thực tế.',
  },
] as const

/* ------------------------------------------------------------------ *
 * Decision comparison — qualitative values only
 * ------------------------------------------------------------------ */

export const COMPARISON_COLUMNS = [
  'Gcalls Plus',
  'Integration',
  'International',
  'QA QC Center',
  'Gcalls CX',
] as const

export const COMPARISON_ROWS: Array<{ label: string; values: string[] }> = [
  {
    label: 'Phù hợp khi',
    values: [
      'Cần kênh nghe gọi chuyên nghiệp trên trình duyệt',
      'Đã có CRM/Helpdesk/POS cần gắn cuộc gọi vào quy trình',
      'Cần liên lạc với thị trường ngoài Việt Nam',
      'Cần kiểm soát chất lượng hội thoại',
      'Cần vận hành nhiều kênh giao tiếp',
    ],
  },
  {
    label: 'Quy mô',
    values: ['Theo nhu cầu', 'Theo nhu cầu', 'Theo nhu cầu', 'Theo nhu cầu', 'Theo nhu cầu'],
  },
  {
    label: 'Kênh giao tiếp',
    values: ['Thoại', 'Thoại', 'Thoại', 'Thoại', 'Đa kênh'],
  },
  {
    label: 'Tích hợp',
    values: ['Tùy cấu hình', 'Trọng tâm', 'Tùy cấu hình', 'Tùy cấu hình', 'Tùy cấu hình'],
  },
  {
    label: 'AI / QA',
    values: [
      'Không phải trọng tâm',
      'Không phải trọng tâm',
      'Không phải trọng tâm',
      'Trọng tâm',
      'Tùy cấu hình',
    ],
  },
  {
    label: 'Quốc tế',
    values: ['Tùy cấu hình', 'Tùy cấu hình', 'Trọng tâm', 'Không phải trọng tâm', 'Tùy cấu hình'],
  },
  {
    label: 'Mô hình báo giá',
    values: [
      'Theo gói + người dùng',
      'Theo người dùng + tích hợp',
      'Theo đầu số + lưu lượng',
      'Theo đội ngũ + khối lượng',
      'Theo Agent + kênh',
    ],
  },
]

/* ------------------------------------------------------------------ *
 * Add-ons
 * ------------------------------------------------------------------ */

export const PRICING_ADDONS = [
  { id: 'hotline', title: 'Đầu số / Hotline' },
  { id: 'minutes', title: 'Lưu lượng gọi' },
  { id: 'integration', title: 'CRM / Helpdesk / POS Integration' },
  { id: 'intl-numbers', title: 'Đầu số quốc tế' },
  { id: 'qc-volume', title: 'QA QC volume' },
  { id: 'omnichannel', title: 'Omnichannel channels' },
  { id: 'custom', title: 'Custom implementation' },
] as const

export const ADDON_PRICE_LABEL = 'Báo giá theo nhu cầu'

/* ------------------------------------------------------------------ *
 * FAQ
 * ------------------------------------------------------------------ */

export const PRICING_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Gcalls tính phí theo user hay theo phút gọi?',
    a: 'Cách tính chi phí phụ thuộc vào sản phẩm và cấu hình sử dụng. Một số giải pháp có thể liên quan đến số lượng Agent, lưu lượng gọi, đầu số, tích hợp hoặc khối lượng dữ liệu cần xử lý.',
  },
  {
    q: 'Gcalls Plus có gói dành cho SME không?',
    a: 'Gcalls Plus được thiết kế cho nhiều quy mô đội ngũ, trong đó có doanh nghiệp SME cần triển khai Webphone và quản lý hoạt động nghe gọi trên trình duyệt. Gói phù hợp sẽ được xác định dựa trên số người dùng và nhu cầu vận hành.',
  },
  {
    q: 'Tích hợp CRM có được tính trong gói Gcalls Plus không?',
    a: 'Chi phí tích hợp phụ thuộc vào nền tảng, phạm vi dữ liệu và yêu cầu triển khai. Gcalls sẽ xác nhận cấu hình trước khi báo giá.',
  },
  {
    q: 'Tổng đài quốc tế tính giá như thế nào?',
    a: 'Chi phí phụ thuộc vào quốc gia, loại đầu số, hồ sơ đăng ký và lưu lượng sử dụng tại từng thị trường.',
  },
  {
    q: 'QA QC Center được tính chi phí như thế nào?',
    a: 'Cấu hình QA QC Center có thể phụ thuộc vào quy mô đội ngũ, khối lượng hội thoại cần phân tích và bộ tiêu chí QA cần áp dụng.',
  },
  {
    q: 'Gcalls CX tính theo Agent hay theo kênh?',
    a: 'Mô hình chi phí Gcalls CX phụ thuộc vào quy mô Agent, số kênh giao tiếp, tích hợp và yêu cầu vận hành thực tế.',
  },
  {
    q: 'Tôi có thể nhận báo giá chính xác bằng cách nào?',
    a: 'Sử dụng công cụ Ước tính chi phí để chuẩn bị cấu hình ban đầu, sau đó gửi yêu cầu để đội ngũ Gcalls xác nhận phạm vi và báo giá chính thức.',
  },
]

/* ------------------------------------------------------------------ *
 * Helpers — the ONLY place that decides number vs fallback
 * ------------------------------------------------------------------ */

/**
 * Renders a plan's price state.
 *
 * Returns the quote-request label whenever pricing is not configured or the
 * value is missing. Never returns "0₫" — a zero reads as a real quote and is
 * worse than no number at all.
 */
export function formatPrice(
  plan: Pick<PricingPlan, 'monthlyPrice' | 'pricingConfigured' | 'pricingMode'>,
  fallback: string = PRICE_FALLBACK.quote,
): string {
  if (!PRICING_CONFIGURED || !plan.pricingConfigured) return fallback
  if (plan.monthlyPrice == null || plan.monthlyPrice <= 0) return fallback
  return `${plan.monthlyPrice.toLocaleString('vi-VN')}₫`
}

/** Whether a numeric price may be rendered at all. */
export function hasApprovedPrice(
  plan: Pick<PricingPlan, 'monthlyPrice' | 'pricingConfigured'>,
): boolean {
  return (
    PRICING_CONFIGURED && plan.pricingConfigured && (plan.monthlyPrice ?? 0) > 0
  )
}

/** Shared estimator result state — also used by /uoc-tinh-chi-phi/. */
export function estimateCost(): {
  configured: boolean
  label: string
  note: string
} {
  if (!PRICING_CONFIGURED) {
    return {
      configured: false,
      label: PRICE_FALLBACK.estimator,
      note: 'Cấu hình đã sẵn sàng để đội ngũ Gcalls xác nhận và báo giá.',
    }
  }
  // Pricing engine hooks in here once approved rates exist.
  return { configured: true, label: PRICE_FALLBACK.estimator, note: '' }
}

/**
 * Structured data for the pricing page.
 *
 * ---------------------------------------------------------------------------
 * WHY THERE IS NO Product, Offer OR OfferCatalog NODE — WEB-SITE-QA-001
 * ---------------------------------------------------------------------------
 * There used to be all three, and the previous comment here explained only half
 * the problem. Omitting `price` was correct but insufficient: the node also
 * emitted `availability: https://schema.org/InStock` and
 * `offerCount: 4`, which together assert that four purchasable plans are
 * available right now. That is a product-availability claim, and this repository
 * has no approved rate and no confirmed public plan scope — `PRICING_CONFIGURED`
 * is false, and the page itself renders `PRICE_FALLBACK` copy rather than
 * numbers. Structured data was making a stronger claim than the page it
 * described.
 *
 * `OfferCatalog` went for the same reason: it is commerce vocabulary that reads
 * as a priced catalogue. The solutions it listed are real routes, so the list
 * itself is honest — it is now an `ItemList`, which says "these pages exist"
 * without implying "these are offers you can buy".
 *
 * Do not reintroduce Product/Offer/AggregateOffer here until an approved rate
 * card exists AND the visible page publishes it. Emitting availability or price
 * ahead of the page is the same defect in the other direction.
 */
export function buildPricingJsonLd(origin: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Bảng giá', item: `${origin}${ROUTES.pricing}` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Giải pháp Gcalls',
        itemListElement: SOLUTION_PRICING.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Service',
            name: s.name,
            description: s.summary,
            url: `${origin}${s.cta.path}`,
            provider: { '@type': 'Organization', name: 'Gcalls' },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: PRICING_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
