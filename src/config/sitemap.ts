/**
 * GCALLS website sitemap — the single source of truth for site architecture.
 *
 * Navigation, mega menus, the footer, breadcrumbs, per-route SEO metadata and
 * (later) sitemap.xml and internal-link audits are all derived from this one
 * array. Do not hardcode a URL string anywhere else in the app.
 *
 * ---------------------------------------------------------------------------
 * PRODUCT SCOPE
 * ---------------------------------------------------------------------------
 * There are deliberately NO standalone routes for Sales, Customer Service or
 * Quality Assurance. They are use cases, not products, and map onto real
 * routes:
 *
 *   Sales             -> Gcalls Plus + CRM Integration
 *   Customer Service  -> Gcalls Plus + Helpdesk + Gcalls CX
 *   Quality Assurance -> QA QC Center
 *
 * They appear as navigation aids on the solutions hub without minting routes.
 *
 * VOICEBOT was on that list until Checkpoint WEB-PRO-004, which reversed the
 * decision and minted `/voicebot-ai/` as a product route. The reversal is a
 * product decision, not new evidence — this repository still holds no Voicebot
 * config, estimator field or screenshot, so the page copy is bounded by the
 * claim guard at the top of `src/data/voicebotAi.ts`.
 * ---------------------------------------------------------------------------
 */

/* ------------------------------------------------------------------ *
 * Routes
 * ------------------------------------------------------------------ */

export const ROUTES = {
  // Core
  home: '/',

  // Products
  products: '/san-pham/',
  gcallsPlus: '/gcalls-plus-webphone/',
  qcCenter: '/qc-bot-ai/',
  gcallsCx: '/gcalls-cx/',
  voicebotAi: '/voicebot-ai/',

  // Solutions
  solutions: '/giai-phap/',
  crmIntegration: '/tong-dai-tich-hop-crm/',
  helpdeskIntegration: '/tong-dai-tich-hop-helpdesk/',
  posIntegration: '/tong-dai-tich-hop-pos/',
  internationalCalling: '/tong-dai-quoc-te/',

  // Integrations
  integrations: '/tich-hop/',
  hubspot: '/tich-hop/hubspot/',
  salesforce: '/tich-hop/salesforce/',
  zohoCrm: '/tich-hop/zoho-crm/',
  freshdesk: '/tich-hop/freshdesk/',
  zendesk: '/tich-hop/zendesk/',

  // Industries
  industries: '/nganh/',
  education: '/nganh/giao-duc/',
  finance: '/nganh/tai-chinh/',
  insurance: '/nganh/bao-hiem/',
  realEstate: '/nganh/bat-dong-san/',
  ecommerce: '/nganh/thuong-mai-dien-tu/',
  bpo: '/nganh/bpo/',

  // Pricing
  pricing: '/bang-gia/',
  costEstimator: '/uoc-tinh-chi-phi/',

  // Resources
  resources: '/tai-nguyen/',
  blog: '/blog/',
  guides: '/tai-nguyen/guides/',
  caseStudies: '/tai-nguyen/case-studies/',
  ebook: '/tai-nguyen/ebook/',
  glossary: '/tai-nguyen/glossary/',
  faq: '/tai-nguyen/faq/',

  // Company
  company: '/cong-ty/',
  customers: '/cong-ty/khach-hang/',
  partners: '/cong-ty/doi-tac/',
  contact: '/lien-he/',

  // Referral
  referral: '/referral/',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

/**
 * Build status. Internal only — never surfaced to public visitors. It exists
 * so the team can see coverage at a glance and so tooling can prioritise work.
 */
export type PageStatus = 'complete' | 'in_progress' | 'shell'

export type NavGroupId =
  | 'core'
  | 'products'
  | 'solutions'
  | 'integrations'
  | 'industries'
  | 'pricing'
  | 'resources'
  | 'company'

export interface SitemapEntry {
  /** Stable identifier from the content plan, e.g. WEB-003. */
  id: string
  label: string
  route: RoutePath
  parent: RoutePath | null
  group: NavGroupId
  /** Relative importance, 1.0 highest. Feeds sitemap.xml later. */
  priority: number
  status: PageStatus
  /** Whether this route should ever be indexed once the site goes live. */
  indexable: boolean
  navVisibility: boolean
  footerVisibility: boolean

  /** SEO title. Entity-specific — never a generated template. */
  title: string
  /** Suffix with "| Gcalls" unless the title already carries the brand. */
  exactTitle?: boolean
  description: string

  /** Short lead paragraph rendered on the page itself. */
  intro?: string
  /** Eyebrow label for the page header. */
  eyebrow?: string
  /** Optional supporting label, e.g. "QC Bot AI". */
  supportingLabel?: string
  /** Short description used on parent hub cards and mega menus. */
  summary?: string
}

/* ------------------------------------------------------------------ *
 * The sitemap
 * ------------------------------------------------------------------ */

export const SITEMAP: SitemapEntry[] = [
  /* ── Core ─────────────────────────────────────────────────────── */
  {
    id: 'WEB-001',
    label: 'Trang chủ',
    route: ROUTES.home,
    parent: null,
    group: 'core',
    priority: 1.0,
    status: 'complete',
    indexable: true,
    navVisibility: false,
    footerVisibility: false,
    /*
      Retitled in Checkpoint HOME-CONTENT-IMPLEMENTATION-001, and ONLY because
      the page beneath it changed. The old pair described a single product —
      "Gcalls Plus Webphone giúp đội Sales và CSKH nghe gọi…" — while the
      homepage now opens on "Tổng Đài Ảo Tích Hợp CRM" and maps the whole
      product and solution ecosystem. A title that names a narrower thing than
      the H1 is a mismatch a crawler and a visitor both notice.

      The description is the approved hero copy, trimmed to fit. Note what it
      still does NOT contain: no setup time, no integration count, no saving
      percentage. The source content's hero paragraph carried all three.
    */
    title: 'Gcalls — Tổng đài ảo tích hợp CRM cho đội Sales và CSKH',
    exactTitle: true,
    description:
      'Giải pháp tổng đài thông minh giúp đội Sales và CSKH gọi trên trình duyệt, lưu lịch sử và ghi âm, quản lý khách hàng, theo dõi hiệu suất và kết nối với hệ thống quản trị doanh nghiệp.',
  },

  /* ── Products ─────────────────────────────────────────────────── */
  {
    id: 'WEB-002',
    label: 'Tổng quan sản phẩm',
    route: ROUTES.products,
    parent: ROUTES.home,
    group: 'products',
    priority: 0.9,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Sản phẩm',
    title: 'Sản phẩm Gcalls | Webphone, QA QC Center và Contact Center',
    exactTitle: true,
    description:
      'Tổng quan hệ sinh thái sản phẩm Gcalls: Gcalls Plus Webphone, QA QC Center, Gcalls CX và Gcalls Voicebot AI cho đội Sales, CSKH và QA.',
    intro:
      'Bốn sản phẩm Gcalls phục vụ các bài toán khác nhau trong hoạt động giao tiếp với khách hàng, từ kênh nghe gọi tinh gọn đến kiểm soát chất lượng, vận hành đa kênh và tự động hóa cuộc gọi lặp lại.',
    summary: 'Toàn bộ sản phẩm Gcalls.',
  },
  {
    id: 'WEB-003',
    label: 'Gcalls Plus Webphone',
    route: ROUTES.gcallsPlus,
    parent: ROUTES.products,
    group: 'products',
    priority: 0.9,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    title: 'Gcalls Plus Webphone | Tổng đài trên trình duyệt cho Sales & CSKH',
    exactTitle: true,
    description:
      'Gcalls Plus Webphone giúp doanh nghiệp nghe gọi, quản lý danh bạ, lịch sử tương tác và hoạt động cuộc gọi ngay trên trình duyệt, phù hợp cho Sales và CSKH.',
    summary: 'Webphone & Call Center tinh gọn.',
  },
  {
    id: 'WEB-004',
    label: 'QA QC Center',
    route: ROUTES.qcCenter,
    parent: ROUTES.products,
    group: 'products',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    supportingLabel: 'QC Bot AI',
    eyebrow: 'Sản phẩm',
    title: 'QA QC Center | AI kiểm soát chất lượng cuộc gọi | Gcalls',
    exactTitle: true,
    description:
      'QA QC Center của Gcalls sử dụng QC Bot AI để chuyển cuộc gọi thành transcript, hỗ trợ chấm điểm theo tiêu chí QA và làm nổi bật các tín hiệu cần kiểm tra.',
    intro:
      'QA QC Center hỗ trợ đội QA đưa hội thoại thành dữ liệu có thể đánh giá, phục vụ việc kiểm soát chất lượng cuộc gọi của đội Sales và CSKH.',
    summary: 'QC Bot AI & Quality Management.',
  },
  {
    id: 'WEB-005',
    label: 'Gcalls CX',
    route: ROUTES.gcallsCx,
    parent: ROUTES.products,
    group: 'products',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    eyebrow: 'Sản phẩm',
    title: 'Gcalls CX | Contact Center đa kênh cho Zalo, Facebook, Hotline',
    exactTitle: true,
    description:
      'Gcalls CX hợp nhất Zalo OA, Facebook Fanpage, SMS, Email và Hotline vào một màn hình để đội CSKH quản lý hội thoại, ticket và customer context tập trung hơn.',
    intro:
      'Gcalls CX tập trung vào trải nghiệm khách hàng trên nhiều kênh giao tiếp, dành cho đội ngũ cần vận hành hoạt động chăm sóc khách hàng ở quy mô rộng hơn kênh thoại.',
    summary: 'Omnichannel Contact Center.',
  },
  {
    id: 'WEB-037',
    label: 'Gcalls Voicebot AI',
    route: ROUTES.voicebotAi,
    parent: ROUTES.products,
    group: 'products',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    /**
     * Flipped to true in Checkpoint WEB-IND-001, which did the shared-surface
     * work WEB-PRO-004 deferred: `/voicebot-ai/` is now the fourth item in the
     * products mega menu and the footer's product column, and the fourth card
     * on the products hub. Keep these three in step with these flags.
     */
    navVisibility: true,
    footerVisibility: true,
    supportingLabel: 'Voicebot AI',
    eyebrow: 'Sản phẩm',
    title: 'Voicebot AI cho doanh nghiệp | Tự động hóa cuộc gọi | Gcalls',
    exactTitle: true,
    description:
      'Khám phá giải pháp Voicebot AI giúp doanh nghiệp tự động hóa các cuộc gọi lặp lại, ghi nhận phản hồi và chuyển những tình huống cần thiết cho nhân viên.',
    intro:
      'Gcalls tư vấn, kết nối và tích hợp Voicebot AI vào quy trình gọi hiện tại của doanh nghiệp, bắt đầu từ những tác vụ có kịch bản rõ ràng.',
    summary: 'Tự động hóa cuộc gọi lặp lại.',
  },

  /* ── Solutions ────────────────────────────────────────────────── */
  {
    id: 'WEB-006',
    label: 'Tổng quan giải pháp',
    route: ROUTES.solutions,
    parent: ROUTES.home,
    group: 'solutions',
    priority: 0.9,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Giải pháp',
    title: 'Giải pháp Gcalls | Tích hợp hệ thống và tổng đài quốc tế',
    exactTitle: true,
    description:
      'Giải pháp giao tiếp Gcalls theo bài toán vận hành: tích hợp CRM, Helpdesk, POS và tổng đài quốc tế cho doanh nghiệp.',
    intro:
      'Giải pháp Gcalls được tổ chức theo bài toán vận hành thực tế của doanh nghiệp, thay vì theo danh sách tính năng.',
    summary: 'Toàn bộ giải pháp Gcalls.',
  },
  {
    id: 'WEB-007',
    label: 'Tích hợp CRM',
    route: ROUTES.crmIntegration,
    parent: ROUTES.solutions,
    group: 'solutions',
    priority: 0.9,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    title: 'Tổng đài tích hợp CRM | Click-to-Call & dữ liệu khách hàng',
    exactTitle: true,
    description:
      'Gcalls kết nối tổng đài với CRM để đội Sales và CSKH gọi trực tiếp từ hệ thống, nhận diện khách hàng khi có cuộc gọi và đồng bộ lịch sử tương tác theo cấu hình.',
    summary: 'Kết nối cuộc gọi với dữ liệu và workflow CRM.',
  },
  {
    id: 'WEB-008',
    label: 'Tích hợp Helpdesk',
    route: ROUTES.helpdeskIntegration,
    parent: ROUTES.solutions,
    group: 'solutions',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    eyebrow: 'Giải pháp',
    title: 'Tổng đài tích hợp Helpdesk | Kết nối cuộc gọi & Ticket CSKH',
    exactTitle: true,
    description:
      'Gcalls kết nối tổng đài với Helpdesk để đội CSKH quản lý cuộc gọi, ticket và lịch sử hỗ trợ trong cùng quy trình, giảm việc chuyển đổi giữa nhiều công cụ.',
    intro:
      'Tích hợp Helpdesk đưa hoạt động nghe gọi vào quy trình hỗ trợ khách hàng, giúp đội CSKH xử lý yêu cầu với ngữ cảnh đầy đủ hơn.',
    summary: 'Đưa cuộc gọi vào quy trình hỗ trợ và ticket.',
  },
  {
    id: 'WEB-009',
    label: 'Tích hợp POS',
    route: ROUTES.posIntegration,
    parent: ROUTES.solutions,
    group: 'solutions',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    eyebrow: 'Giải pháp',
    title: 'Tổng đài tích hợp POS | Kết nối cuộc gọi với dữ liệu bán hàng',
    exactTitle: true,
    description:
      'Gcalls kết nối tổng đài với POS để đội bán hàng và CSKH sử dụng customer context, dữ liệu bán hàng và lịch sử tương tác trong cùng quy trình chăm sóc.',
    intro:
      'Tích hợp POS kết nối hoạt động giao tiếp với dữ liệu khách hàng và bán hàng, phù hợp với doanh nghiệp có hoạt động bán lẻ hoặc thương mại.',
    summary: 'Kết nối cuộc gọi với dữ liệu bán hàng.',
  },
  {
    id: 'WEB-010',
    label: 'Tổng đài quốc tế',
    route: ROUTES.internationalCalling,
    parent: ROUTES.solutions,
    group: 'solutions',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    eyebrow: 'Giải pháp',
    title: 'Tổng đài quốc tế | Đầu số và liên lạc đa thị trường | Gcalls',
    exactTitle: true,
    description:
      'Giải pháp tổng đài quốc tế của Gcalls với đầu số và hạ tầng liên lạc theo từng thị trường doanh nghiệp cần hiện diện.',
    intro:
      'Tổng đài quốc tế phục vụ doanh nghiệp cần hiện diện và liên lạc tại nhiều thị trường, với đầu số và cấu hình theo từng quốc gia.',
    summary: 'Đầu số và liên lạc theo thị trường.',
  },

  /* ── Integrations ─────────────────────────────────────────────── */
  {
    id: 'WEB-011',
    label: 'Tổng quan tích hợp',
    route: ROUTES.integrations,
    parent: ROUTES.home,
    group: 'integrations',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    eyebrow: 'Tích hợp',
    title: 'Tích hợp Gcalls | Kết nối tổng đài với hệ thống doanh nghiệp',
    exactTitle: true,
    description:
      'Danh mục tích hợp Gcalls với CRM, Helpdesk và các hệ thống doanh nghiệp đang sử dụng, theo phạm vi triển khai được xác nhận.',
    intro:
      'Gcalls có thể kết nối với các hệ thống doanh nghiệp đang sử dụng để đưa cuộc gọi và ngữ cảnh khách hàng vào workflow hiện tại.',
    summary: 'Danh mục nền tảng kết nối.',
  },
  {
    id: 'WEB-012',
    label: 'HubSpot',
    route: ROUTES.hubspot,
    parent: ROUTES.integrations,
    group: 'integrations',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Tích hợp CRM',
    /* Locked at Checkpoint INT-01 §6. Do not reword. */
    title: 'Tổng đài tích hợp HubSpot | Click-to-Call & dữ liệu cuộc gọi | Gcalls',
    exactTitle: true,
    description:
      'Gcalls tích hợp HubSpot giúp đội Sales và CSKH gọi từ CRM, nhận biết khách hàng khi có cuộc gọi và ghi nhận lịch sử tương tác theo cấu hình.',
    intro:
      'Kết nối Gcalls với HubSpot để đưa hoạt động nghe gọi vào workflow dữ liệu khách hàng. Phạm vi tích hợp được xác nhận theo hệ thống thực tế.',
    summary: 'Kết nối tổng đài với HubSpot.',
  },
  {
    id: 'WEB-013',
    label: 'Salesforce',
    route: ROUTES.salesforce,
    parent: ROUTES.integrations,
    group: 'integrations',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Tích hợp CRM',
    /*
      Locked at Checkpoint INT-02 §5, corrected at INT-03 Part A. Do not reword.

      The original locked title said "Click-to-Call & Popup khách hàng". The
      §11 popup gate resolved CONTEXT ONLY — the page publishes no automatic
      popup claim and the word "popup" appears nowhere in its body — so the
      title was the only place a reader could read a popup claim off this page.
      Corrected to match the body. Do not reintroduce "Popup khách hàng" unless
      the popup gate is reopened with current implementation evidence.
    */
    title: 'Tổng đài tích hợp Salesforce | Click-to-Call & dữ liệu cuộc gọi',
    exactTitle: true,
    description:
      'Gcalls tích hợp Salesforce giúp đội Sales và Service gọi từ CRM, nhận biết khách hàng khi có cuộc gọi và ghi nhận lịch sử tương tác theo cấu hình.',
    intro:
      'Kết nối Gcalls với Salesforce để đưa hoạt động nghe gọi vào workflow dữ liệu khách hàng. Phạm vi tích hợp được xác nhận theo hệ thống thực tế.',
    summary: 'Kết nối tổng đài với Salesforce.',
  },
  {
    id: 'WEB-014',
    label: 'Zoho CRM',
    route: ROUTES.zohoCrm,
    parent: ROUTES.integrations,
    group: 'integrations',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Tích hợp CRM',
    /*
      Locked at Checkpoint INT-03 §5. Do not reword.

      Deliberately carries NO "Popup khách hàng", "Click-to-SMS" or "đồng bộ ghi
      âm": the §10 B/D/E gates did not verify any of them, and INT-02 had to be
      corrected for exactly that title/body mismatch. Do not add one back unless
      the corresponding gate is reopened with current implementation evidence.
    */
    title: 'Tổng đài tích hợp Zoho CRM | Cuộc gọi & dữ liệu khách hàng',
    exactTitle: true,
    description:
      'Gcalls tích hợp Zoho CRM giúp đội Sales và CSKH kết nối hoạt động nghe gọi với customer context và lịch sử tương tác theo phạm vi cấu hình.',
    intro:
      'Kết nối Gcalls với Zoho CRM để đưa hoạt động nghe gọi vào workflow dữ liệu khách hàng. Phạm vi tích hợp được xác nhận theo hệ thống thực tế.',
    summary: 'Kết nối tổng đài với Zoho CRM.',
  },
  {
    id: 'WEB-015',
    label: 'Freshdesk',
    route: ROUTES.freshdesk,
    parent: ROUTES.integrations,
    group: 'integrations',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Tích hợp Helpdesk',
    /*
      Locked at Checkpoint INT-04 §5. Do not reword.

      Deliberately carries NO "Click-to-Call", "Popup khách hàng",
      "Click-to-SMS", "tự động tạo ticket" or "đồng bộ ghi âm": every one of
      those gates closed against publication (§11 A, B, E–H, J). INT-02 had to be
      corrected for exactly this kind of title/body mismatch — do not add one
      back unless the corresponding gate is reopened with current evidence.
    */
    title: 'Tổng đài tích hợp Freshdesk | Kết nối cuộc gọi với ticket CSKH',
    exactTitle: true,
    description:
      'Gcalls tích hợp Freshdesk giúp đội CSKH kết nối hoạt động nghe gọi với customer context, ticket và lịch sử hỗ trợ theo phạm vi cấu hình.',
    intro:
      'Kết nối Gcalls với Freshdesk để gắn hoạt động nghe gọi vào quy trình hỗ trợ. Phạm vi tích hợp được xác nhận theo hệ thống thực tế.',
    summary: 'Kết nối tổng đài với Freshdesk.',
  },
  {
    id: 'WEB-016',
    label: 'Zendesk',
    route: ROUTES.zendesk,
    parent: ROUTES.integrations,
    group: 'integrations',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Tích hợp Helpdesk',
    /*
      Locked at Checkpoint INT-05 §5. Do not reword.

      Deliberately carries NO "Click-to-Call", "Popup khách hàng", "tự động tạo
      ticket" or "đồng bộ ghi âm": every one of those gates closed against
      publication (§11 A, B, E–G, I, J). INT-02 had to be corrected for exactly
      this kind of title/body mismatch — do not add one back unless the
      corresponding gate is reopened with current evidence.
    */
    title: 'Tổng đài tích hợp Zendesk | Kết nối cuộc gọi với ticket CSKH',
    exactTitle: true,
    description:
      'Gcalls tích hợp Zendesk giúp đội CSKH kết nối hoạt động nghe gọi với customer context, ticket và lịch sử hỗ trợ theo phạm vi cấu hình.',
    intro:
      'Kết nối Gcalls với Zendesk để gắn hoạt động nghe gọi vào quy trình hỗ trợ. Phạm vi tích hợp được xác nhận theo hệ thống thực tế.',
    summary: 'Kết nối tổng đài với Zendesk.',
  },

  /* ── Industries ───────────────────────────────────────────────── */
  {
    id: 'WEB-017',
    label: 'Giải pháp theo ngành',
    route: ROUTES.industries,
    parent: ROUTES.home,
    group: 'industries',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    eyebrow: 'Theo ngành',
    title: 'Giải pháp Gcalls theo ngành | Bối cảnh vận hành từng lĩnh vực',
    exactTitle: true,
    description:
      'Cách Gcalls được áp dụng theo bối cảnh vận hành của từng ngành: giáo dục, tài chính, bảo hiểm, bất động sản, thương mại điện tử và BPO.',
    intro:
      'Mỗi ngành có bối cảnh giao tiếp khách hàng khác nhau. Các trang dưới đây mô tả cách Gcalls được áp dụng theo từng bối cảnh vận hành.',
    summary: 'Giải pháp theo bối cảnh ngành.',
  },
  {
    id: 'WEB-018',
    label: 'Giáo dục',
    route: ROUTES.education,
    parent: ROUTES.industries,
    group: 'industries',
    priority: 0.6,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Theo ngành',
    title: 'Giải pháp tổng đài cho giáo dục | Tư vấn tuyển sinh | Gcalls',
    exactTitle: true,
    description:
      'Cách các tổ chức giáo dục sử dụng Gcalls để tư vấn tuyển sinh, theo dõi trao đổi với người học và giữ lại thông tin cần follow-up.',
    intro:
      'Tổ chức giáo dục thường cần theo dõi nhiều cuộc trao đổi với người quan tâm trong suốt quá trình tuyển sinh và chăm sóc học viên.',
    summary: 'Tư vấn tuyển sinh và chăm sóc người học.',
  },
  {
    id: 'WEB-019',
    label: 'Tài chính',
    route: ROUTES.finance,
    parent: ROUTES.industries,
    group: 'industries',
    priority: 0.6,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Theo ngành',
    title: 'Giải pháp tổng đài cho ngành tài chính | Gcalls',
    exactTitle: true,
    description:
      'Cách doanh nghiệp tài chính sử dụng Gcalls để quản lý hoạt động liên hệ khách hàng và giữ lịch sử tương tác rõ ràng.',
    intro:
      'Doanh nghiệp tài chính thường cần quy trình liên hệ khách hàng rõ ràng và lịch sử tương tác đầy đủ cho mục đích quản lý nội bộ.',
    summary: 'Quản lý liên hệ và lịch sử tương tác.',
  },
  {
    id: 'WEB-020',
    label: 'Bảo hiểm',
    route: ROUTES.insurance,
    parent: ROUTES.industries,
    group: 'industries',
    priority: 0.6,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Theo ngành',
    title: 'Giải pháp tổng đài cho ngành bảo hiểm | Gcalls',
    exactTitle: true,
    description:
      'Cách doanh nghiệp bảo hiểm sử dụng Gcalls trong hoạt động tư vấn, chăm sóc khách hàng và theo dõi lịch sử trao đổi.',
    intro:
      'Hoạt động bảo hiểm gắn với nhiều lần trao đổi trong suốt vòng đời hợp đồng, đòi hỏi ngữ cảnh khách hàng luôn sẵn có.',
    summary: 'Tư vấn và chăm sóc theo vòng đời hợp đồng.',
  },
  {
    id: 'WEB-021',
    label: 'Bất động sản',
    route: ROUTES.realEstate,
    parent: ROUTES.industries,
    group: 'industries',
    priority: 0.6,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Theo ngành',
    title: 'Giải pháp tổng đài cho bất động sản | Quản lý lead | Gcalls',
    exactTitle: true,
    description:
      'Cách doanh nghiệp bất động sản sử dụng Gcalls để quản lý lead, theo dõi cuộc gọi và phối hợp giữa các agent.',
    intro:
      'Đội ngũ bất động sản thường làm việc với lượng lead lớn và cần theo dõi trạng thái liên hệ của từng khách hàng.',
    summary: 'Quản lý lead và theo dõi liên hệ.',
  },
  {
    id: 'WEB-022',
    label: 'Thương mại điện tử',
    route: ROUTES.ecommerce,
    parent: ROUTES.industries,
    group: 'industries',
    priority: 0.6,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Theo ngành',
    title: 'Giải pháp tổng đài cho thương mại điện tử | Gcalls',
    exactTitle: true,
    description:
      'Cách doanh nghiệp thương mại điện tử sử dụng Gcalls để xử lý cuộc gọi liên quan tới đơn hàng và hỗ trợ khách hàng.',
    intro:
      'Thương mại điện tử phát sinh nhiều cuộc gọi liên quan tới đơn hàng, đổi trả và hỗ trợ sau bán.',
    summary: 'Hỗ trợ đơn hàng và sau bán.',
  },
  {
    id: 'WEB-023',
    label: 'BPO',
    route: ROUTES.bpo,
    parent: ROUTES.industries,
    group: 'industries',
    priority: 0.6,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Theo ngành',
    title: 'Giải pháp tổng đài cho BPO | Vận hành đội ngũ quy mô lớn | Gcalls',
    exactTitle: true,
    description:
      'Cách doanh nghiệp BPO sử dụng Gcalls để vận hành đội ngũ agent, theo dõi hoạt động và quản lý chất lượng cuộc gọi.',
    intro:
      'Doanh nghiệp BPO vận hành nhiều nhóm agent theo từng dự án, cần công cụ theo dõi hoạt động và chất lượng cuộc gọi tập trung.',
    summary: 'Vận hành đội ngũ agent theo dự án.',
  },

  /* ── Pricing ──────────────────────────────────────────────────── */
  {
    id: 'WEB-024',
    label: 'Bảng giá Gcalls',
    route: ROUTES.pricing,
    parent: ROUTES.home,
    group: 'pricing',
    priority: 0.9,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    title: 'Bảng giá Gcalls | Gói tổng đài cho SME & giải pháp doanh nghiệp',
    exactTitle: true,
    description:
      'Xem bảng giá Gcalls cho Webphone SME, tích hợp CRM/Helpdesk, tổng đài quốc tế, Gcalls CX và giải pháp AI theo nhu cầu doanh nghiệp.',
    summary: 'Xem mô hình chi phí theo sản phẩm và giải pháp.',
  },
  {
    id: 'APP-001',
    label: 'Ước tính chi phí',
    route: ROUTES.costEstimator,
    parent: ROUTES.pricing,
    group: 'pricing',
    priority: 0.9,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    title: 'Ước tính chi phí Gcalls | Chọn cấu hình theo nhu cầu doanh nghiệp',
    exactTitle: true,
    description:
      'Chọn sản phẩm Gcalls, quy mô đội ngũ, lưu lượng sử dụng và nhu cầu tích hợp để chuẩn bị cấu hình và chi phí tham khảo trước khi nhận báo giá.',
    summary: 'Chuẩn bị cấu hình theo nhu cầu doanh nghiệp.',
  },

  /* ── Resources ────────────────────────────────────────────────── */
  {
    id: 'WEB-025',
    label: 'Trung tâm tài nguyên',
    route: ROUTES.resources,
    parent: ROUTES.home,
    group: 'resources',
    priority: 0.7,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: false,
    eyebrow: 'Tài nguyên',
    title: 'Tài nguyên Gcalls | Kiến thức Call Center, CRM, CX và AI',
    exactTitle: true,
    description:
      'Trung tâm tài nguyên Gcalls: blog, guides, case studies, ebook, glossary và FAQ về Call Center, CRM, CX và AI.',
    intro:
      'Nơi tập hợp kiến thức về Call Center, CRM, CX và AI dành cho đội ngũ Sales, CSKH và QA.',
    summary: 'Toàn bộ tài nguyên Gcalls.',
  },
  {
    id: 'WEB-026',
    label: 'Blog',
    route: ROUTES.blog,
    parent: ROUTES.resources,
    group: 'resources',
    priority: 0.7,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    eyebrow: 'Tài nguyên',
    title: 'Blog Gcalls | Kiến thức vận hành Call Center và CRM',
    exactTitle: true,
    /**
     * Describes the EDITORIAL SCOPE, not an article inventory. WEB-RES-001
     * built the blog as a foundation page: no article exists yet, so a
     * description promising "bài viết của Gcalls" would be a search result that
     * lies about what the page contains.
     */
    description:
      'Phạm vi biên tập của blog Gcalls theo sáu danh mục: vận hành call center, tích hợp CRM và Helpdesk, giao tiếp quốc tế, trải nghiệm đa kênh, Voicebot và AI QC, vận hành theo ngành.',
    intro:
      'Sáu danh mục biên tập và lối vào các trang đã hoàn thiện theo từng bài toán vận hành.',
    summary: 'Phạm vi biên tập và góc nhìn vận hành.',
  },
  {
    id: 'WEB-027',
    label: 'Guides',
    route: ROUTES.guides,
    parent: ROUTES.resources,
    group: 'resources',
    priority: 0.6,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    eyebrow: 'Tài nguyên',
    title: 'Guides Gcalls | Hướng dẫn triển khai tổng đài và tích hợp',
    exactTitle: true,
    description:
      'Sáu lộ trình đánh giá trước khi triển khai: chọn tổng đài trên trình duyệt, lập kế hoạch tích hợp CRM, đầu số quốc tế, chăm sóc đa kênh, Voicebot và giám sát chất lượng cuộc gọi.',
    intro:
      'Sáu lộ trình nêu rõ cần làm rõ những gì trước khi chọn phương án hoặc yêu cầu báo giá.',
    summary: 'Sáu lộ trình đánh giá trước triển khai.',
  },
  {
    id: 'WEB-028',
    label: 'Case Studies',
    route: ROUTES.caseStudies,
    parent: ROUTES.resources,
    group: 'resources',
    priority: 0.6,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    eyebrow: 'Tài nguyên',
    title: 'Case Studies | Tiêu chuẩn bằng chứng triển khai của Gcalls',
    exactTitle: true,
    /**
     * The page publishes the evidence STANDARD, not case studies. The
     * description says so, because a snippet promising customer stories on a
     * page that deliberately has none is the same fabrication as a fake card.
     */
    description:
      'Tám điều kiện bằng chứng bắt buộc trước khi Gcalls công bố một câu chuyện triển khai, kèm cấu trúc phân loại của thư viện case study đang được thu thập.',
    intro:
      'Tiêu chuẩn bằng chứng áp dụng cho mọi câu chuyện triển khai Gcalls công bố.',
    summary: 'Tiêu chuẩn bằng chứng triển khai.',
  },
  {
    id: 'WEB-029',
    label: 'Ebook',
    route: ROUTES.ebook,
    parent: ROUTES.resources,
    group: 'resources',
    priority: 0.5,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    eyebrow: 'Tài nguyên',
    title: 'Ebook Gcalls | Chủ đề tài liệu chuyên sâu đang chuẩn bị',
    exactTitle: true,
    description:
      'Năm nhóm chủ đề tài liệu chuyên sâu Gcalls đang chuẩn bị và tiêu chuẩn nội dung áp dụng cho chúng. Chưa có tài liệu nào được phát hành, nên trang không có nút tải.',
    intro:
      'Năm nhóm chủ đề chuyên sâu và tiêu chuẩn nội dung áp dụng khi phát hành.',
    summary: 'Chủ đề chuyên sâu đang chuẩn bị.',
  },
  {
    id: 'WEB-030',
    label: 'Glossary',
    route: ROUTES.glossary,
    parent: ROUTES.resources,
    group: 'resources',
    priority: 0.5,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    eyebrow: 'Tài nguyên',
    title: 'Glossary | Thuật ngữ Call Center, CRM và CX | Gcalls',
    exactTitle: true,
    description:
      'Hai mươi bốn thuật ngữ thường gặp khi triển khai tổng đài: tổng đài đám mây, IVR, call flow, Webphone, Click-to-Call, omnichannel, Voicebot, AI QC, SLA, API và SDK.',
    intro:
      'Hai mươi bốn thuật ngữ, giải thích khái niệm trước rồi mới nói tới liên quan với Gcalls.',
    summary: 'Hai mươi bốn thuật ngữ thường gặp.',
  },
  {
    id: 'WEB-031',
    label: 'FAQ',
    route: ROUTES.faq,
    parent: ROUTES.resources,
    group: 'resources',
    priority: 0.6,
    status: 'complete',
    indexable: true,
    navVisibility: true,
    footerVisibility: true,
    eyebrow: 'Tài nguyên',
    title: 'FAQ Gcalls | Câu hỏi thường gặp về tổng đài và tích hợp',
    exactTitle: true,
    description:
      'Hai mươi mốt câu hỏi thường gặp theo sáu nhóm: chọn giải pháp, tích hợp CRM và Helpdesk, gọi quốc tế, vận hành đa kênh, Voicebot và AI QC, triển khai và hỗ trợ.',
    intro:
      'Hai mươi mốt câu hỏi theo sáu nhóm chủ đề. Mỗi trang sản phẩm cũng có phần FAQ riêng.',
    summary: 'Hai mươi mốt câu hỏi theo sáu nhóm.',
  },

  /* ── Company ──────────────────────────────────────────────────── */
  {
    id: 'WEB-032',
    label: 'Về Gcalls',
    route: ROUTES.company,
    parent: ROUTES.home,
    group: 'company',
    priority: 0.6,
    status: 'complete',
    indexable: true,
    navVisibility: false,
    footerVisibility: true,
    eyebrow: 'Về Gcalls',
    title: 'Về Gcalls | Nền tảng giao tiếp cho doanh nghiệp Việt Nam',
    exactTitle: true,
    description:
      'Giới thiệu về Gcalls và định hướng xây dựng nền tảng giao tiếp tích hợp cho đội Sales, CSKH và QA của doanh nghiệp.',
    intro:
      'Gcalls xây dựng nền tảng giao tiếp giúp doanh nghiệp kết nối cuộc gọi với dữ liệu khách hàng và quy trình vận hành.',
    summary: 'Giới thiệu về Gcalls.',
  },
  {
    id: 'WEB-033',
    label: 'Khách hàng',
    route: ROUTES.customers,
    parent: ROUTES.company,
    group: 'company',
    priority: 0.5,
    status: 'complete',
    indexable: true,
    navVisibility: false,
    footerVisibility: true,
    eyebrow: 'Về Gcalls',
    /**
     * Title and description describe OPERATIONAL PROFILES, not a customer list.
     * WEB-COMPANY-001 built this page without a single customer name, because
     * no permission record exists — so a snippet promising "doanh nghiệp đang
     * sử dụng" would advertise content the page deliberately does not contain.
     */
    title: 'Khách hàng của Gcalls | Mô hình vận hành được phục vụ',
    exactTitle: true,
    description:
      'Năm mô hình vận hành Gcalls phục vụ, các vấn đề nên làm rõ trước khi triển khai, và bảy giai đoạn làm việc từ khảo sát tới vận hành.',
    intro:
      'Các mô hình vận hành Gcalls phục vụ và cách hai bên làm việc từ khảo sát tới vận hành.',
    summary: 'Mô hình vận hành Gcalls phục vụ.',
  },
  {
    id: 'WEB-034',
    label: 'Đối tác',
    route: ROUTES.partners,
    parent: ROUTES.company,
    group: 'company',
    priority: 0.5,
    status: 'complete',
    indexable: true,
    navVisibility: false,
    footerVisibility: true,
    eyebrow: 'Về Gcalls',
    /**
     * "Khung hợp tác", never "chương trình hợp tác". The page describes how a
     * partnership would be assessed; it does not announce an open programme,
     * and the metadata must not either.
     */
    title: 'Đối tác Gcalls | Khung hợp tác và tiêu chí đánh giá',
    exactTitle: true,
    description:
      'Sáu nhóm hợp tác Gcalls sẵn sàng trao đổi, các hình thức hợp tác kèm điều kiện áp dụng, và chín hạng mục được làm rõ trước khi hai bên cam kết.',
    intro:
      'Khung hợp tác, tiêu chí đánh giá và ranh giới giữa tích hợp kỹ thuật với quan hệ đối tác.',
    summary: 'Khung hợp tác và tiêu chí đánh giá.',
  },
  {
    id: 'WEB-035',
    label: 'Liên hệ',
    route: ROUTES.contact,
    parent: ROUTES.home,
    group: 'company',
    priority: 0.8,
    status: 'complete',
    indexable: true,
    navVisibility: false,
    footerVisibility: true,
    eyebrow: 'Liên hệ',
    title: 'Liên hệ Gcalls | Tư vấn giải pháp tổng đài cho doanh nghiệp',
    exactTitle: true,
    description:
      'Liên hệ đội ngũ Gcalls qua email sales@gcalls.co hoặc số 028 7302 5469 để được tư vấn giải pháp tổng đài phù hợp.',
    intro:
      'Chia sẻ nhu cầu hiện tại để đội ngũ Gcalls có thêm thông tin trước khi trao đổi cùng doanh nghiệp.',
    summary: 'Liên hệ đội ngũ Gcalls.',
  },

  /* ── Referral ─────────────────────────────────────────────────── */
  {
    id: 'WEB-036',
    label: 'Referral',
    route: ROUTES.referral,
    parent: ROUTES.home,
    group: 'company',
    priority: 0.5,
    status: 'complete',
    indexable: true,
    navVisibility: false,
    footerVisibility: true,
    eyebrow: 'Referral',
    title: 'Chương trình giới thiệu Gcalls | Referral',
    exactTitle: true,
    description:
      'Thông tin về chương trình giới thiệu của Gcalls dành cho cá nhân và tổ chức muốn giới thiệu giải pháp tới doanh nghiệp.',
    intro:
      'Dành cho cá nhân và tổ chức muốn giới thiệu Gcalls tới doanh nghiệp có nhu cầu. Điều khoản cụ thể được trao đổi trực tiếp với đội ngũ Gcalls.',
    summary: 'Giới thiệu Gcalls tới doanh nghiệp.',
  },
]

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const BY_ROUTE = new Map(SITEMAP.map((entry) => [entry.route as string, entry]))

export function getEntry(route: string): SitemapEntry | undefined {
  return BY_ROUTE.get(route)
}

export function getChildren(route: RoutePath): SitemapEntry[] {
  return SITEMAP.filter((entry) => entry.parent === route)
}

export function getByGroup(group: NavGroupId): SitemapEntry[] {
  return SITEMAP.filter((entry) => entry.group === group)
}

/** Ancestor chain from the site root down to (but excluding) `route`. */
export function getBreadcrumbTrail(route: string): SitemapEntry[] {
  const trail: SitemapEntry[] = []
  let current = BY_ROUTE.get(route)

  while (current) {
    trail.unshift(current)
    current = current.parent ? BY_ROUTE.get(current.parent) : undefined
  }

  // Drop home — the Breadcrumb component always prepends it.
  return trail.filter((entry) => entry.route !== ROUTES.home)
}

export function getAllRoutes(): RoutePath[] {
  return SITEMAP.map((entry) => entry.route)
}

/** Build-status counts. Internal reporting only; never rendered publicly. */
export function statusSummary() {
  return SITEMAP.reduce<Record<PageStatus, number>>(
    (acc, entry) => {
      acc[entry.status] += 1
      return acc
    },
    { complete: 0, in_progress: 0, shell: 0 },
  )
}
