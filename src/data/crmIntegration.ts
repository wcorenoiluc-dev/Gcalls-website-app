/**
 * Approved content for /tong-dai-tich-hop-crm/ — Checkpoint S01.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED.
 * ---------------------------------------------------------------------------
 * Every string below comes from the approved S01 source. Do not rewrite,
 * shorten, paraphrase or "improve" it, and do not add capabilities, CRM
 * vendors, synced fields or benefits that are not here.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING (S01 §24)
 * ---------------------------------------------------------------------------
 * Historical internal material contains "tăng 30–50% hiệu suất", "đồng bộ
 * 100%" and "xóa bỏ hoàn toàn nhập liệu thủ công". None is approved as public
 * proof, and none appears on this page. Also never publish "tích hợp mọi CRM"
 * or "real-time guaranteed".
 *
 * Required register instead: "giảm thao tác thủ công", "hỗ trợ", "có thể",
 * "theo cấu hình", "tùy nền tảng", "phạm vi tích hợp".
 *
 * ---------------------------------------------------------------------------
 * SCOPE DECISIONS (do not reverse without evidence)
 * ---------------------------------------------------------------------------
 * RECORDING SYNC — NOT PUBLISHED. S01 §10 allows it only if the current
 * implementation verifies it. The estimator's `crmNeeds` field
 * (`src/data/estimator.ts`, solution `crm`) enumerates exactly four integration
 * needs — click-to-call, customer-context, call-history, workflow — and no
 * recording option. Nothing else in this repository evidences recording
 * synchronisation, so the optional capability is omitted rather than written
 * speculatively.
 *
 * CRM VENDORS — exactly the three evidenced by that same approved estimator
 * config: HubSpot, Salesforce, Zoho CRM (plus a neutral "Khác"). Naming a
 * platform asserts connection experience ONLY. It does not assert partner
 * status, marketplace certification or preferred-vendor status — no evidence
 * for any of those exists, so no such wording appears anywhere below.
 *
 * ---------------------------------------------------------------------------
 * SEO OWNERSHIP / CANNIBALIZATION (S01 §27)
 * ---------------------------------------------------------------------------
 * This page owns "tổng đài tích hợp CRM" only. The vendor keywords
 * ("tổng đài tích hợp HubSpot/Salesforce/Zoho CRM") belong to the platform
 * pages, Helpdesk to /tong-dai-tich-hop-helpdesk/ and POS to
 * /tong-dai-tich-hop-pos/. Vendor names therefore appear here as a routed
 * ecosystem list, not as repeated keyword targets, and the vendor-specific
 * FAQs that used to live here were removed for the same reason.
 *
 * BOUNDARIES. This page owns the CRM integration workflow. Ticket/support
 * workflow belongs to Helpdesk Integration, multi-channel operations to Gcalls
 * CX, and lightweight browser calling to Gcalls Plus.
 */

import { ROUTES } from '@/config/navigation'

/**
 * Conversion context for CRM Integration CTAs.
 *
 * `intent: 'consultation'` per S01 §5 and §22 — this is a scoping
 * conversation about an existing CRM, not a demo booking. `source` is the
 * existing `crm_integration` LeadSource enum member.
 */
export const CRM_LEAD = {
  intent: 'consultation',
  source: 'crm_integration',
  solution: 'Tích hợp CRM',
} as const

export const CRM_HERO = {
  eyebrow: 'GCALLS • CRM INTEGRATION',
  h1: 'Tổng đài tích hợp CRM – kết nối cuộc gọi với dữ liệu khách hàng',
  description:
    'Đưa hoạt động nghe gọi vào quy trình CRM để đội Sales và CSKH có thể gọi trực tiếp từ hệ thống, nhận biết khách hàng khi có cuộc gọi và lưu lại lịch sử tương tác tập trung hơn.',
  valuePoints: [
    {
      title: 'Gọi trực tiếp từ CRM',
      detail:
        'Click-to-Call giúp nhân viên bắt đầu cuộc gọi ngay trong quy trình đang làm việc thay vì nhập lại số điện thoại.',
    },
    {
      title: 'Nhận biết khách hàng khi có cuộc gọi',
      detail:
        'Popup thông tin hỗ trợ nhân viên xem customer context trước hoặc trong quá trình trao đổi.',
    },
    {
      title: 'Giữ lịch sử tương tác tập trung',
      detail:
        'Dữ liệu cuộc gọi và thông tin liên quan có thể được đồng bộ về CRM theo phạm vi tích hợp được cấu hình.',
    },
  ],
  primaryCta: { label: 'Tư vấn tích hợp CRM' },
  secondaryCta: {
    label: 'Khám phá cách tích hợp hoạt động',
    href: '#cach-hoat-dong',
  },
} as const

/** Direct answer / AIO. Plain visible text, never collapsed into an accordion. */
export const CRM_DIRECT_ANSWER = {
  question: 'Tổng đài tích hợp CRM là gì?',
  answer:
    'Tổng đài tích hợp CRM là mô hình kết nối chức năng nghe gọi với hệ thống quản lý khách hàng để nhân viên có thể thực hiện cuộc gọi ngay trong CRM, nhận biết khách hàng khi có cuộc gọi và lưu lịch sử tương tác về cùng một quy trình dữ liệu. Với Gcalls, phạm vi đồng bộ phụ thuộc vào nền tảng CRM và cấu hình tích hợp thực tế của doanh nghiệp.',
} as const

export const CRM_PROBLEMS = {
  eyebrow: 'BÀI TOÁN VẬN HÀNH',
  h2: 'Khi CRM và tổng đài hoạt động riêng, nhân viên phải tự nối hai quy trình bằng thao tác thủ công',
  items: [
    {
      n: '01',
      title: 'Nhập lại số điện thoại',
      detail:
        'Nhân viên phải copy số từ CRM sang công cụ gọi, tạo thêm thao tác không cần thiết trong mỗi lần liên hệ.',
    },
    {
      n: '02',
      title: 'Không có customer context khi chuông reo',
      detail:
        'Nếu dữ liệu khách hàng và cuộc gọi nằm ở hai hệ thống khác nhau, nhân viên cần mất thêm thời gian để xác định người đang liên hệ.',
    },
    {
      n: '03',
      title: 'Lịch sử cuộc gọi nằm ngoài CRM',
      detail:
        'Khi hoạt động gọi không được ghi nhận cùng dữ liệu khách hàng, đội Sales và CSKH khó theo dõi toàn bộ hành trình tương tác trong một nơi.',
    },
    {
      n: '04',
      title: 'Quản lý khó theo dõi quy trình xuyên hệ thống',
      detail:
        'Dữ liệu phân mảnh khiến việc kiểm tra lịch sử chăm sóc, follow-up và hoạt động đội ngũ trở nên phức tạp hơn.',
    },
  ],
} as const

export const CRM_OVERVIEW = {
  eyebrow: 'CRM + CALLING',
  h2: 'Đưa hoạt động cuộc gọi vào nơi đội Sales và CSKH đang làm việc',
  description:
    'Thay vì bắt nhân viên chuyển qua lại giữa CRM và hệ thống nghe gọi, Gcalls tập trung vào việc kết nối hai luồng để cuộc gọi trở thành một phần của quy trình quản lý khách hàng.',
  /** Core flow, rendered by the existing workflow diagram component. */
  flow: [
    { n: '01', label: 'CRM record', detail: 'Dữ liệu khách hàng nằm trong CRM.' },
    { n: '02', label: 'Click-to-Call', detail: 'Bắt đầu cuộc gọi từ quy trình đang làm việc.' },
    { n: '03', label: 'Call', detail: 'Cuộc gọi được thực hiện qua hệ thống Gcalls.' },
    { n: '04', label: 'Customer context', detail: 'Thông tin liên quan hỗ trợ nhân viên khi trao đổi.' },
    { n: '05', label: 'Interaction history', detail: 'Dữ liệu tương tác được ghi nhận theo cấu hình.' },
    { n: '06', label: 'Follow-up', detail: 'Đội ngũ tiếp tục chăm sóc trong CRM.' },
  ],
} as const

export const CRM_HOW_IT_WORKS = {
  anchorId: 'cach-hoat-dong',
  eyebrow: 'CÁCH TÍCH HỢP HOẠT ĐỘNG',
  h2: 'Từ dữ liệu CRM đến cuộc gọi và lịch sử tương tác',
  steps: [
    {
      n: '01',
      title: 'Nhân viên làm việc trên CRM',
      detail:
        'Thông tin khách hàng, lead hoặc contact tiếp tục được quản lý trong hệ thống CRM doanh nghiệp đang sử dụng.',
    },
    {
      n: '02',
      title: 'Bắt đầu cuộc gọi',
      detail:
        'Khi nền tảng hỗ trợ và tích hợp được cấu hình, nhân viên có thể thực hiện cuộc gọi trực tiếp từ giao diện CRM.',
    },
    {
      n: '03',
      title: 'Hiển thị customer context',
      detail:
        'Thông tin khách hàng liên quan hỗ trợ nhân viên xác định bối cảnh trước hoặc trong quá trình trao đổi.',
    },
    {
      n: '04',
      title: 'Ghi nhận hoạt động',
      detail:
        'Lịch sử liên hệ và dữ liệu cuộc gọi phù hợp có thể được đưa trở lại CRM theo cấu hình tích hợp.',
    },
    {
      n: '05',
      title: 'Tiếp tục workflow',
      detail:
        'Sales hoặc CSKH tiếp tục follow-up trong hệ thống đang quản lý khách hàng thay vì xây dựng một luồng dữ liệu riêng bên ngoài.',
    },
  ],
} as const

/**
 * Core capabilities — exactly three.
 *
 * Recording sync is deliberately absent; see the SCOPE DECISIONS note in the
 * file header. Every description defers to platform and configuration, so no
 * capability reads as identical across every connector.
 */
export const CRM_CAPABILITIES = {
  eyebrow: 'NĂNG LỰC TÍCH HỢP',
  h2: 'Ba năng lực cốt lõi giúp kết nối cuộc gọi với CRM',
  items: [
    {
      n: '01',
      title: 'Click-to-Call',
      detail:
        'Thực hiện cuộc gọi từ CRM khi nền tảng và cấu hình tích hợp hỗ trợ, giúp giảm thao tác nhập số thủ công.',
    },
    {
      n: '02',
      title: 'Customer Popup',
      detail:
        'Hiển thị thông tin khách hàng liên quan khi có cuộc gọi để nhân viên có thêm context trước khi trao đổi.',
    },
    {
      n: '03',
      title: 'Interaction History Sync',
      detail:
        'Đồng bộ lịch sử liên hệ và dữ liệu cuộc gọi phù hợp về CRM theo phạm vi tích hợp được cấu hình.',
    },
  ],
} as const

/**
 * Before / after. A workflow illustration only — S01 §11 forbids attaching
 * ROI, time-saved or productivity numbers to it, so none exists here.
 */
export const CRM_BEFORE_AFTER = {
  eyebrow: 'TRƯỚC & SAU TÍCH HỢP',
  h2: 'Giảm những điểm chuyển đổi thủ công trong quy trình Sales và CSKH',
  before: {
    label: 'Trước tích hợp',
    steps: [
      'CRM',
      'Copy số điện thoại',
      'Công cụ gọi',
      'Cuộc gọi',
      'Ghi chú thủ công',
      'Quay lại CRM',
      'Cập nhật thủ công',
    ],
  },
  after: {
    label: 'Sau tích hợp',
    steps: [
      'CRM',
      'Click-to-Call',
      'Cuộc gọi',
      'Dữ liệu tương tác',
      'Workflow CRM tiếp tục',
    ],
  },
} as const

/**
 * CRM platforms.
 *
 * Exactly the entities evidenced by the approved estimator config. Each
 * description states connection scope only — no partnership, certification or
 * preferred-vendor wording. Vendor pages own the vendor keywords, so each card
 * routes to its own page rather than expanding here.
 */
export const CRM_PLATFORMS = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    detail:
      'Kết nối hoạt động nghe gọi với dữ liệu khách hàng trên HubSpot theo phạm vi tích hợp được xác nhận.',
    path: ROUTES.hubspot,
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    detail:
      'Kết nối hoạt động nghe gọi với dữ liệu khách hàng trên Salesforce theo phạm vi tích hợp được xác nhận.',
    path: ROUTES.salesforce,
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    detail:
      'Kết nối hoạt động nghe gọi với dữ liệu khách hàng trên Zoho CRM theo phạm vi tích hợp được xác nhận.',
    path: ROUTES.zohoCrm,
  },
  {
    id: 'other',
    name: 'Khác',
    detail:
      'Với hệ thống CRM khác, Gcalls sẽ khảo sát khả năng kết nối trước khi đề xuất phương án tích hợp.',
    path: ROUTES.integrations,
  },
] as const

export const CRM_PLATFORM_SECTION = {
  eyebrow: 'CRM ECOSYSTEM',
  h2: 'Triển khai theo nền tảng CRM doanh nghiệp đang sử dụng',
} as const

export const CRM_PLATFORM_NOTE =
  'Khả năng kết nối và phạm vi dữ liệu có thể khác nhau giữa các nền tảng, và được Gcalls xác nhận theo hệ thống thực tế của doanh nghiệp.'

export const CRM_CONTEXT = {
  eyebrow: 'CUSTOMER CONTEXT',
  h2: 'Biết khách hàng đang nói chuyện với mình là ai trước khi tiếp tục xử lý',
  description:
    'Khi CRM và cuộc gọi được kết nối, nhân viên có thể sử dụng thông tin khách hàng và lịch sử liên quan để hiểu bối cảnh thay vì bắt đầu mỗi cuộc hội thoại từ đầu.',
  points: [
    'Contact profile',
    'Lead / company context',
    'Hoạt động gần đây',
    'Lịch sử tương tác',
    'Thông tin cuộc gọi',
  ],
} as const

/** Data sync. Scope is always conditional — never "every field, every CRM". */
export const CRM_DATA_SYNC = {
  eyebrow: 'DỮ LIỆU TƯƠNG TÁC',
  h2: 'Giữ dữ liệu cuộc gọi gần với hồ sơ khách hàng',
  description:
    'Tùy nền tảng và phạm vi tích hợp, lịch sử cuộc gọi và dữ liệu liên quan có thể được ghi nhận vào CRM để đội ngũ theo dõi hành trình khách hàng tập trung hơn.',
  points: [
    'Phạm vi dữ liệu được xác định theo cấu hình tích hợp',
    'Khả năng ghi nhận tùy thuộc nền tảng CRM',
    'Chỉ đồng bộ dữ liệu phù hợp với quy trình doanh nghiệp',
    'Các trường cụ thể được thống nhất trong khảo sát kỹ thuật',
  ],
} as const

export const CRM_SALES_USE_CASE = {
  eyebrow: 'SALES',
  h2: 'Giảm thao tác giữa gọi điện và quản lý cơ hội bán hàng',
  description:
    'Sales có thể bắt đầu cuộc gọi từ context của lead hoặc contact và tiếp tục follow-up trong CRM sau tương tác, thay vì duy trì một lịch sử cuộc gọi tách biệt.',
  points: [
    'Prospecting',
    'Follow-up',
    'Lead context',
    'Call activity',
    'Pipeline workflow',
  ],
} as const

export const CRM_SERVICE_USE_CASE = {
  eyebrow: 'CUSTOMER SERVICE',
  h2: 'Đưa customer context vào quy trình tiếp nhận cuộc gọi',
  description:
    'Đội CSKH có thể sử dụng thông tin khách hàng và lịch sử tương tác từ CRM để hiểu bối cảnh trước khi tiếp tục hỗ trợ.',
  points: [
    'Customer identification',
    'Previous interaction',
    'Context',
    'Follow-up',
    'Activity history',
  ],
} as const

/**
 * Integration-boundary routing. Required by S01 §17.
 *
 * Each row sends a need to the page that owns it, which is also what keeps
 * this page off the Helpdesk, CX and Gcalls Plus keyword territory.
 */
export const CRM_BOUNDARIES = {
  eyebrow: 'CHỌN ĐÚNG LUỒNG TÍCH HỢP',
  h2: 'CRM, Helpdesk và Omnichannel giải quyết những phần khác nhau của hành trình khách hàng',
  items: [
    {
      product: 'CRM Integration',
      need: 'Sales/CSKH đã vận hành quanh CRM record và dữ liệu khách hàng.',
      path: ROUTES.crmIntegration,
      /** This page. Rendered as a marked card, never as a self-link. */
      current: true,
    },
    {
      product: 'Helpdesk Integration',
      need: 'Đội hỗ trợ vận hành quanh ticket và quy trình xử lý yêu cầu.',
      path: ROUTES.helpdeskIntegration,
    },
    {
      product: 'Gcalls CX',
      need: 'Doanh nghiệp cần tập trung giao tiếp trên nhiều kênh khách hàng.',
      path: ROUTES.gcallsCx,
    },
    {
      product: 'Gcalls Plus',
      need: 'Đội ngũ chủ yếu cần nghe gọi gọn nhẹ trên trình duyệt.',
      path: ROUTES.gcallsPlus,
    },
  ],
  /**
   * Adjacent flows. POS is a separate integration solution, and QA QC Center
   * works on the calls this integration produces — both are worth reaching
   * from here, but neither competes for the CRM keyword.
   */
  related: {
    lead: 'Các luồng liên quan khác:',
    links: [
      { label: 'Tổng đài tích hợp POS', path: ROUTES.posIntegration },
      { label: 'QA QC Center', path: ROUTES.qcCenter },
    ],
  },
} as const

/** Deployment. No fixed implementation time is promised — none is evidenced. */
export const CRM_DEPLOYMENT = {
  eyebrow: 'TRIỂN KHAI',
  h2: 'Từ kết nối đến vận hành theo quy trình rõ ràng',
  steps: [
    { n: '01', title: 'Khảo sát hệ thống và quy trình hiện tại' },
    { n: '02', title: 'Xác định nền tảng CRM và capability cần tích hợp' },
    { n: '03', title: 'Kết nối hoặc cấu hình theo nhu cầu' },
    { n: '04', title: 'Kiểm thử dữ liệu và luồng làm việc' },
    { n: '05', title: 'Hướng dẫn người dùng' },
    { n: '06', title: 'Đưa vào vận hành và theo dõi' },
  ],
} as const

/**
 * Deep link that pre-selects CRM Integration in the shared estimator.
 *
 * The public slug is `crm-integration` (per the approved brief); the
 * estimator's internal solution id is `crm` (`src/data/estimator.ts`). The
 * estimator resolves the alias — the same mechanism P03 established for
 * `gcalls-cx` — so this is a working key, not a decorative parameter.
 */
export const CRM_ESTIMATOR_HREF = `${ROUTES.costEstimator}?product=crm-integration`

export const CRM_PRICING = {
  eyebrow: 'CẤU HÌNH & CHI PHÍ',
  h2: 'Chi phí phụ thuộc vào nền tảng, người dùng và phạm vi tích hợp',
  description:
    'Cấu hình tổng đài tích hợp CRM có thể thay đổi theo số lượng người dùng, nền tảng CRM, hotline, dữ liệu cần đồng bộ và yêu cầu workflow. Gcalls sẽ xác định phạm vi kỹ thuật trước khi đưa ra báo giá chính thức.',
  primaryCta: { label: 'Ước tính cấu hình & chi phí', path: CRM_ESTIMATOR_HREF },
  secondaryCta: { label: 'Xem bảng giá Gcalls', path: ROUTES.pricing },
} as const

/**
 * Trust — NEUTRAL.
 *
 * The previous implementation carried no CRM Integration customer story, and
 * no verified case exists in this repository. Nothing is fabricated: no logo,
 * quote, result, figure or case study.
 */
export const CRM_TRUST = {
  eyebrow: 'BỐI CẢNH TRIỂN KHAI',
  h2: 'Tích hợp cần bắt đầu từ workflow thực tế của doanh nghiệp',
  description:
    'Mỗi CRM có cấu trúc dữ liệu, permission và quy trình vận hành khác nhau. Vì vậy phạm vi tích hợp cần được xác định từ hệ thống đang sử dụng thay vì áp dụng một cấu hình giống nhau cho mọi doanh nghiệp.',
  cta: { label: 'Trao đổi về hệ thống CRM đang sử dụng' },
  link: { label: 'Đọc bài viết trên Blog Gcalls', path: ROUTES.blog },
} as const

export interface CrmFaqItem {
  q: string
  a: string
  link?: { label: string; path: string }
}

/**
 * FAQ — exactly the six approved questions.
 *
 * The old vendor-specific trio ("Gcalls có tích hợp HubSpot/Salesforce/Zoho
 * không?") was removed: those keywords belong to the platform pages, and
 * repeating them here is the cannibalization S01 §27 forbids. FAQ 2 answers
 * the vendor question generically and routes to the integrations hub instead.
 */
export const CRM_FAQ: CrmFaqItem[] = [
  {
    q: 'Tổng đài tích hợp CRM là gì?',
    a: 'Tổng đài tích hợp CRM kết nối chức năng nghe gọi với hệ thống quản lý khách hàng để nhân viên có thể thực hiện cuộc gọi, nhận biết khách hàng và theo dõi lịch sử tương tác trong cùng quy trình dữ liệu.',
  },
  {
    q: 'Gcalls tích hợp được những CRM nào?',
    a: 'Gcalls có kinh nghiệm tích hợp với nhiều nền tảng CRM. Khả năng cụ thể cần được xác định theo nền tảng, phiên bản, API và phạm vi tính năng doanh nghiệp cần triển khai.',
    link: { label: 'Xem các tích hợp Gcalls', path: ROUTES.integrations },
  },
  {
    q: 'Click-to-Call là gì?',
    a: 'Click-to-Call cho phép nhân viên bắt đầu cuộc gọi từ số điện thoại hoặc hồ sơ khách hàng trong CRM khi tính năng này được hỗ trợ và cấu hình.',
  },
  {
    q: 'Khi có cuộc gọi đến, CRM có thể hiển thị thông tin khách hàng không?',
    a: 'Với nền tảng và cấu hình phù hợp, hệ thống có thể hỗ trợ hiển thị thông tin khách hàng liên quan để nhân viên có thêm context khi tiếp nhận cuộc gọi.',
  },
  {
    q: 'Lịch sử cuộc gọi có được đồng bộ về CRM không?',
    a: 'Dữ liệu lịch sử cuộc gọi có thể được đồng bộ theo phạm vi tích hợp và khả năng của nền tảng CRM. Các trường dữ liệu cụ thể cần được xác định trong quá trình khảo sát kỹ thuật.',
  },
  {
    q: 'Tích hợp CRM có thay thế CRM hiện tại không?',
    a: 'Không. Mục tiêu của giải pháp là kết nối hoạt động nghe gọi với CRM doanh nghiệp đang sử dụng, thay vì yêu cầu đội ngũ thay đổi toàn bộ hệ thống quản lý khách hàng.',
  },
]

export const CRM_FINAL_CTA = {
  eyebrow: 'CRM INTEGRATION',
  h2: 'Đưa cuộc gọi vào đúng quy trình Sales và CSKH đang sử dụng',
  description:
    'Chia sẻ nền tảng CRM, số lượng người dùng và workflow hiện tại để Gcalls xác định cách kết nối phù hợp.',
  primaryCta: { label: 'Tư vấn tích hợp CRM', path: ROUTES.contact },
  secondaryCta: { label: 'Ước tính cấu hình', path: CRM_ESTIMATOR_HREF },
} as const

/**
 * Structured data.
 *
 * Four nodes only — Service is the accurate top-level type for an integration
 * offering, plus SoftwareApplication, BreadcrumbList and FAQPage. No Offer,
 * price, AggregateRating, Review, partnership assertion or performance metric
 * is emitted; none is verified.
 */
export function buildCrmJsonLd(origin: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${origin}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Giải pháp',
            item: `${origin}${ROUTES.solutions}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Tổng đài tích hợp CRM',
            item: `${origin}${ROUTES.crmIntegration}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: 'Tổng đài tích hợp CRM',
        serviceType: 'CRM Telephony Integration',
        description: CRM_DIRECT_ANSWER.answer,
        provider: { '@type': 'Organization', name: 'Gcalls' },
        url: `${origin}${ROUTES.crmIntegration}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Gcalls CRM Integration',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'CRM Telephony Integration',
        operatingSystem: 'Web browser',
        description: CRM_OVERVIEW.description,
        url: `${origin}${ROUTES.crmIntegration}`,
        featureList: CRM_CAPABILITIES.items.map((c) => c.title),
        provider: { '@type': 'Organization', name: 'Gcalls' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: CRM_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
