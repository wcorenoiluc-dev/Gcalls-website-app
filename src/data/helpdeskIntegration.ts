/**
 * Approved content for /tong-dai-tich-hop-helpdesk/ — Checkpoint S02.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED.
 * ---------------------------------------------------------------------------
 * Every string below comes from the approved S02 source. Do not rewrite,
 * shorten, paraphrase or "improve" it, and do not add capabilities, Helpdesk
 * vendors, synced fields or benefits that are not here.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING (S02 §25)
 * ---------------------------------------------------------------------------
 * Never publish without verified evidence:
 *   "tăng 30–50% hiệu suất" · "đồng bộ 100% cuộc gọi" · "tất cả nền tảng
 *   Helpdesk" · "tự động tạo ticket" (as a universal behaviour) ·
 *   "real-time guaranteed" · "xóa bỏ hoàn toàn nhập liệu thủ công" ·
 *   "tự động đồng bộ ghi âm" · "unlimited" anything.
 *
 * Required register instead: "giảm thao tác", "hỗ trợ", "có thể", "theo cấu
 * hình", "tùy nền tảng", "tùy API", "phạm vi tích hợp".
 *
 * ---------------------------------------------------------------------------
 * EVIDENCE GATES (do not reverse without evidence)
 * ---------------------------------------------------------------------------
 * AUTOMATIC TICKET CREATION — NOT PUBLISHED. S02 §11 warns that a historical
 * SEO question ("can it create tickets after calls?") is not evidence. The
 * approved estimator config (`src/data/estimator.ts`, solution `helpdesk`,
 * field `helpdeskNeeds`) enumerates exactly two connection needs — "Gắn cuộc
 * gọi vào ticket" and "Lịch sử cuộc gọi trong hồ sơ hỗ trợ". Neither is ticket
 * CREATION, and nothing else in this repository evidences it. The page
 * therefore publishes LINKING calls to existing tickets/records, never
 * automatic creation, and FAQ 4 answers conservatively.
 *
 * RECORDING SYNC — NOT PUBLISHED. S02 §12 explicitly forbids assuming parity
 * with CRM Integration. No recording-synchronisation evidence exists anywhere
 * in this repository (the only matches are S01's own "not published" notes).
 * Omitted rather than written speculatively.
 *
 * HELPDESK VENDORS — exactly the two evidenced by that same estimator config:
 * Freshdesk and Zendesk (plus a neutral "Khác"). Both also have declared
 * routes in the locked sitemap. Naming a platform asserts connection
 * experience ONLY — never partner status, certified integration, marketplace
 * listing or strategic partnership. No evidence for any of those exists.
 *
 * ---------------------------------------------------------------------------
 * SEO OWNERSHIP / CANNIBALIZATION (S02 §3)
 * ---------------------------------------------------------------------------
 * This page owns "tổng đài tích hợp Helpdesk" only. Zendesk- and
 * Freshdesk-specific intent belongs to /tich-hop/zendesk/ and
 * /tich-hop/freshdesk/. Vendor names therefore appear once, in a routed
 * ecosystem grid, and are not repeated as keyword targets — including in the
 * FAQ, which answers the vendor question generically.
 *
 * BOUNDARIES. This page owns the ticket/support workflow. CRM records and
 * lead data belong to CRM Integration, multi-channel operations to Gcalls CX,
 * and lightweight browser calling to Gcalls Plus.
 */

import { ROUTES } from '@/config/navigation'

/**
 * Conversion context for Helpdesk Integration CTAs.
 *
 * `intent: 'consultation'` per S02 §5 and §22. `source` and `solution` are the
 * most specific values the shared lead model already supports:
 * `helpdesk_integration` (LeadSource) and 'Tích hợp Helpdesk' (LEAD_NEEDS) —
 * both pre-existing, so no shared type changed.
 */
export const HELPDESK_LEAD = {
  intent: 'consultation',
  source: 'helpdesk_integration',
  solution: 'Tích hợp Helpdesk',
} as const

export const HD_HERO = {
  eyebrow: 'GCALLS • HELPDESK INTEGRATION',
  h1: 'Tổng đài tích hợp Helpdesk – kết nối cuộc gọi với ticket và lịch sử hỗ trợ',
  description:
    'Đưa cuộc gọi vào quy trình hỗ trợ để nhân viên có thêm context khách hàng, theo dõi ticket và lịch sử tương tác tập trung hơn thay vì phải chuyển đổi liên tục giữa Helpdesk và hệ thống nghe gọi.',
  valuePoints: [
    {
      title: 'Cuộc gọi gắn với quy trình hỗ trợ',
      detail:
        'Kết nối hoạt động nghe gọi với hồ sơ hoặc ticket hỗ trợ theo khả năng của nền tảng và cấu hình tích hợp.',
    },
    {
      title: 'Có thêm context khi xử lý ticket',
      detail:
        'Giúp nhân viên xem thông tin và lịch sử liên quan trước khi tiếp tục hỗ trợ khách hàng.',
    },
    {
      title: 'Theo dõi lịch sử hỗ trợ tập trung hơn',
      detail:
        'Dữ liệu cuộc gọi phù hợp có thể được ghi nhận cùng workflow Helpdesk để đội ngũ tiếp tục xử lý thuận tiện hơn.',
    },
  ],
  primaryCta: { label: 'Tư vấn tích hợp Helpdesk' },
  secondaryCta: {
    label: 'Khám phá cách tích hợp hoạt động',
    href: '#cach-hoat-dong',
  },
} as const

/** Direct answer / AIO. Plain visible text, never collapsed into an accordion. */
export const HD_DIRECT_ANSWER = {
  question: 'Tổng đài tích hợp Helpdesk là gì?',
  answer:
    'Tổng đài tích hợp Helpdesk là mô hình kết nối hoạt động nghe gọi với hệ thống quản lý yêu cầu hỗ trợ để nhân viên có thể sử dụng cuộc gọi, ticket và lịch sử tương tác trong cùng một quy trình chăm sóc khách hàng. Phạm vi đồng bộ phụ thuộc vào nền tảng Helpdesk, API và cấu hình tích hợp thực tế của doanh nghiệp.',
} as const

export const HD_PROBLEMS = {
  eyebrow: 'BÀI TOÁN HỖ TRỢ KHÁCH HÀNG',
  h2: 'Khi cuộc gọi và ticket nằm ở hai nơi, đội CSKH phải tự ghép lại hành trình hỗ trợ',
  items: [
    {
      n: '01',
      title: 'Nhân viên phải chuyển đổi giữa nhiều công cụ',
      detail:
        'Agent tiếp nhận cuộc gọi trên một hệ thống nhưng lại quản lý yêu cầu hỗ trợ trên Helpdesk, khiến workflow bị chia thành nhiều bước.',
    },
    {
      n: '02',
      title: 'Ticket thiếu context cuộc gọi',
      detail:
        'Nếu dữ liệu nghe gọi không gắn với hồ sơ hỗ trợ, nhân viên có thể phải tìm lại thông tin trước khi tiếp tục xử lý.',
    },
    {
      n: '03',
      title: 'Lịch sử hỗ trợ bị phân mảnh',
      detail:
        'Cuộc gọi, ticket, ghi chú và các lần tương tác khác nằm ở nhiều nơi khiến quá trình hỗ trợ khó được theo dõi xuyên suốt.',
    },
    {
      n: '04',
      title: 'Nhập lại thông tin làm tăng thao tác thủ công',
      detail:
        'Khi hai hệ thống không kết nối, nhân viên có thể phải ghi lại cùng một nội dung nhiều lần để duy trì lịch sử hỗ trợ.',
    },
  ],
} as const

export const HD_OVERVIEW = {
  eyebrow: 'HELPDESK + CALLING',
  h2: 'Đưa cuộc gọi vào quy trình xử lý yêu cầu hỗ trợ',
  description:
    'Gcalls kết nối lớp giao tiếp thoại với Helpdesk để đội CSKH có thể xử lý cuộc gọi trong bối cảnh ticket, lịch sử hỗ trợ và customer context đang có.',
  /** Core flow, rendered by the existing workflow diagram component. */
  flow: [
    { n: '01', label: 'Customer', detail: 'Khách hàng cần được hỗ trợ.' },
    { n: '02', label: 'Call', detail: 'Cuộc gọi diễn ra qua hệ thống Gcalls.' },
    {
      n: '03',
      label: 'Identification / Context',
      detail: 'Thông tin liên quan giúp agent xác định bối cảnh.',
    },
    {
      n: '04',
      label: 'Support record / ticket',
      detail: 'Cuộc gọi được gắn với hồ sơ hỗ trợ theo cấu hình.',
    },
    {
      n: '05',
      label: 'Interaction history',
      detail: 'Lịch sử liên hệ phù hợp được ghi nhận.',
    },
    { n: '06', label: 'Follow-up', detail: 'Đội ngũ tiếp tục xử lý trong Helpdesk.' },
  ],
} as const

export const HD_HOW_IT_WORKS = {
  anchorId: 'cach-hoat-dong',
  eyebrow: 'CÁCH TÍCH HỢP HOẠT ĐỘNG',
  h2: 'Từ cuộc gọi đến ticket và bước xử lý tiếp theo',
  steps: [
    {
      n: '01',
      title: 'Khách hàng liên hệ',
      detail:
        'Khách hàng gọi đến hoặc nhân viên thực hiện cuộc gọi trong phạm vi giải pháp được triển khai.',
    },
    {
      n: '02',
      title: 'Xác định customer context',
      detail:
        'Thông tin liên quan giúp nhân viên hiểu khách hàng hoặc yêu cầu hỗ trợ đang xử lý.',
    },
    {
      n: '03',
      title: 'Kết nối với hồ sơ Helpdesk',
      detail:
        'Dữ liệu cuộc gọi phù hợp được liên kết với workflow hỗ trợ theo khả năng nền tảng và cấu hình tích hợp.',
    },
    {
      n: '04',
      title: 'Cập nhật lịch sử tương tác',
      detail:
        'Thông tin liên quan đến cuộc gọi có thể được ghi nhận để đội ngũ tiếp tục theo dõi trong quy trình hỗ trợ.',
    },
    {
      n: '05',
      title: 'Tiếp tục ticket / follow-up',
      detail:
        'Agent xử lý các bước tiếp theo trong Helpdesk thay vì duy trì một lịch sử riêng bên ngoài hệ thống.',
    },
  ],
} as const

/**
 * Core capabilities — exactly four.
 *
 * Note capability 2: it describes LINKING call data to an existing ticket or
 * support record. It deliberately does not describe creating one. See the
 * evidence gates in the file header.
 */
export const HD_CAPABILITIES = {
  eyebrow: 'NĂNG LỰC TÍCH HỢP',
  h2: 'Kết nối cuộc gọi với những dữ liệu đội CSKH cần để xử lý ticket',
  items: [
    {
      n: '01',
      title: 'Call Context',
      detail:
        'Đưa thông tin liên quan đến cuộc gọi vào bối cảnh hỗ trợ để agent dễ xác định khách hàng và yêu cầu đang xử lý.',
    },
    {
      n: '02',
      title: 'Ticket / Support Record Connection',
      detail:
        'Liên kết dữ liệu cuộc gọi với ticket hoặc hồ sơ hỗ trợ khi nền tảng Helpdesk và cấu hình tích hợp cho phép.',
    },
    {
      n: '03',
      title: 'Interaction History',
      detail:
        'Ghi nhận lịch sử liên hệ phù hợp trong workflow hỗ trợ để nhân viên có thể tiếp tục xử lý với nhiều context hơn.',
    },
    {
      n: '04',
      title: 'Customer Identification',
      detail:
        'Hỗ trợ nhận biết khách hàng hoặc hồ sơ liên quan khi dữ liệu và nền tảng tích hợp cho phép.',
    },
  ],
} as const

export const HD_SUPPORT_CONTEXT = {
  eyebrow: 'SUPPORT CONTEXT',
  h2: 'Hiểu lịch sử hỗ trợ trước khi tiếp tục cuộc hội thoại',
  description:
    'Khi ticket, thông tin khách hàng và lịch sử liên quan được đặt gần dữ liệu cuộc gọi, agent có thể hiểu bối cảnh tốt hơn trước khi phản hồi hoặc follow-up.',
  points: [
    'Customer identity',
    'Ticket đang xử lý',
    'Ticket trước đó',
    'Tương tác gần đây',
    'Ghi chú',
    'Trạng thái hiện tại',
  ],
} as const

/**
 * Before / after. A workflow illustration only — S02 §14 forbids attaching ROI
 * or productivity numbers to it, so none exists here.
 */
export const HD_BEFORE_AFTER = {
  eyebrow: 'TRƯỚC & SAU TÍCH HỢP',
  h2: 'Giảm những bước chuyển đổi thủ công trong quy trình CSKH',
  before: {
    label: 'Trước tích hợp',
    steps: [
      'Hệ thống nghe gọi',
      'Xác định khách hàng thủ công',
      'Mở Helpdesk',
      'Tìm ticket',
      'Nhập ghi chú',
      'Tiếp tục hỗ trợ',
    ],
  },
  after: {
    label: 'Sau tích hợp',
    steps: [
      'Cuộc gọi / workflow Helpdesk',
      'Customer context',
      'Ticket hoặc hồ sơ hỗ trợ liên quan',
      'Lịch sử tương tác',
      'Follow-up',
    ],
  },
} as const

/**
 * Helpdesk platforms.
 *
 * Exactly the entities evidenced by the approved estimator config, both of
 * which also have declared routes. Each description states connection scope
 * only — no partnership, certification or marketplace wording. Vendor pages
 * own the vendor keywords, so each card routes to its own page.
 */
export const HD_PLATFORMS = [
  {
    id: 'freshdesk',
    name: 'Freshdesk',
    detail:
      'Kết nối hoạt động nghe gọi với quy trình hỗ trợ trên Freshdesk theo phạm vi tích hợp được xác nhận.',
    path: ROUTES.freshdesk,
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    detail:
      'Kết nối hoạt động nghe gọi với quy trình hỗ trợ trên Zendesk theo phạm vi tích hợp được xác nhận.',
    path: ROUTES.zendesk,
  },
  {
    id: 'other',
    name: 'Khác',
    detail:
      'Với Helpdesk khác, Gcalls sẽ khảo sát API và khả năng kết nối trước khi đề xuất phương án tích hợp.',
    path: ROUTES.integrations,
  },
] as const

export const HD_PLATFORM_SECTION = {
  eyebrow: 'HELPDESK ECOSYSTEM',
  h2: 'Triển khai theo Helpdesk doanh nghiệp đang sử dụng',
} as const

export const HD_PLATFORM_NOTE =
  'Khả năng kết nối, dữ liệu khả dụng và luồng xử lý có thể khác nhau giữa từng nền tảng Helpdesk, và được Gcalls xác nhận theo hệ thống thực tế của doanh nghiệp.'

export const HD_USE_CASES = {
  eyebrow: 'TÌNH HUỐNG SỬ DỤNG',
  h2: 'Phù hợp với những đội hỗ trợ cần theo dõi cuộc gọi và ticket trong cùng hành trình',
  items: [
    {
      n: '01',
      title: 'SaaS Customer Support',
      detail:
        'Hỗ trợ agent theo dõi cuộc gọi cùng ticket và lịch sử xử lý khi khách hàng cần hỗ trợ sản phẩm hoặc dịch vụ.',
    },
    {
      n: '02',
      title: 'E-commerce Customer Service',
      detail:
        'Giúp đội CSKH kết nối cuộc gọi với yêu cầu hỗ trợ để tiếp tục quá trình xử lý khách hàng có context hơn.',
      link: { label: 'Giải pháp cho Thương mại điện tử', path: ROUTES.ecommerce },
    },
    {
      n: '03',
      title: 'Service Operations',
      detail:
        'Phù hợp với doanh nghiệp dịch vụ có nhiều yêu cầu cần follow-up sau khi khách hàng gọi đến.',
    },
    {
      n: '04',
      title: 'BPO / Support Center',
      detail:
        'Hỗ trợ đội vận hành xử lý lượng lớn cuộc gọi và ticket theo workflow có cấu trúc hơn.',
      link: { label: 'Giải pháp cho BPO', path: ROUTES.bpo },
    },
  ],
} as const

/**
 * Integration-boundary routing. Required by S02 §17.
 *
 * Same routing table as S01 with the Helpdesk row marked current — which is
 * also what keeps each page off the others' keyword territory.
 */
export const HD_BOUNDARIES = {
  eyebrow: 'CHỌN ĐÚNG LUỒNG TÍCH HỢP',
  h2: 'CRM, Helpdesk và Omnichannel giải quyết những phần khác nhau của hành trình khách hàng',
  items: [
    {
      product: 'Helpdesk Integration',
      need: 'Đội hỗ trợ vận hành quanh ticket, case và quy trình xử lý yêu cầu.',
      path: ROUTES.helpdeskIntegration,
      /** This page. Rendered as a marked card, never as a self-link. */
      current: true,
    },
    {
      product: 'CRM Integration',
      need: 'Sales/CSKH chủ yếu vận hành quanh CRM record, lead và dữ liệu khách hàng.',
      path: ROUTES.crmIntegration,
    },
    {
      product: 'Gcalls CX',
      need: 'Doanh nghiệp cần tập trung hội thoại trên nhiều kênh khách hàng.',
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
   * works on the calls this integration produces — both worth reaching from
   * here, neither competing for the Helpdesk keyword.
   */
  related: {
    lead: 'Các luồng liên quan khác:',
    links: [
      { label: 'Tổng đài tích hợp POS', path: ROUTES.posIntegration },
      { label: 'QA QC Center', path: ROUTES.qcCenter },
    ],
  },
} as const

/** Deployment. No fixed timeline is promised — none is evidenced. */
export const HD_DEPLOYMENT = {
  eyebrow: 'TRIỂN KHAI',
  h2: 'Kết nối Helpdesk theo workflow hỗ trợ doanh nghiệp đang sử dụng',
  steps: [
    { n: '01', title: 'Khảo sát Helpdesk và quy trình hiện tại' },
    { n: '02', title: 'Xác định dữ liệu/capability cần kết nối' },
    { n: '03', title: 'Thiết kế luồng cuộc gọi và ticket' },
    { n: '04', title: 'Cấu hình tích hợp' },
    { n: '05', title: 'Kiểm thử dữ liệu và workflow' },
    { n: '06', title: 'Hướng dẫn đội CSKH' },
    { n: '07', title: 'Đưa vào vận hành' },
  ],
} as const

/**
 * Deep link that pre-selects Helpdesk Integration in the shared estimator.
 *
 * The public slug is `helpdesk-integration`; the estimator's internal solution
 * id is `helpdesk` (`src/data/estimator.ts`). The estimator resolves the alias
 * — the same narrow mechanism P03 established and S01 extended — so this is a
 * working key, not a decorative parameter.
 */
export const HD_ESTIMATOR_HREF = `${ROUTES.costEstimator}?product=helpdesk-integration`

export const HD_PRICING = {
  eyebrow: 'CẤU HÌNH & CHI PHÍ',
  h2: 'Chi phí phụ thuộc vào nền tảng, người dùng và phạm vi tích hợp',
  description:
    'Phạm vi triển khai có thể thay đổi theo Helpdesk doanh nghiệp đang sử dụng, số lượng người dùng, hotline, dữ liệu cần đồng bộ và workflow hỗ trợ. Gcalls sẽ xác định yêu cầu kỹ thuật trước khi đưa ra báo giá chính thức.',
  primaryCta: { label: 'Ước tính cấu hình & chi phí', path: HD_ESTIMATOR_HREF },
  secondaryCta: { label: 'Xem bảng giá Gcalls', path: ROUTES.pricing },
} as const

/**
 * Trust — NEUTRAL.
 *
 * No verified Helpdesk Integration customer case exists in this repository.
 * Nothing is fabricated: no logo, quote, result, figure or case study.
 */
export const HD_TRUST = {
  eyebrow: 'TRIỂN KHAI THEO WORKFLOW THỰC TẾ',
  h2: 'Mỗi Helpdesk có cấu trúc ticket và dữ liệu khác nhau',
  description:
    'Field, permission, API và quy trình xử lý khác nhau giữa từng nền tảng. Vì vậy phạm vi tích hợp cần được xác định từ hệ thống doanh nghiệp đang sử dụng thay vì áp dụng cùng một cấu hình cho mọi tổ chức.',
  cta: { label: 'Trao đổi về Helpdesk đang sử dụng' },
  link: { label: 'Đọc bài viết trên Blog Gcalls', path: ROUTES.blog },
} as const

export interface HdFaqItem {
  q: string
  a: string
  link?: { label: string; path: string }
}

/**
 * FAQ — exactly the six approved questions.
 *
 * FAQ 2's closing sentence names Freshdesk and Zendesk, which S02 §21 permits
 * only if both are verified. Both are: each is an option in the approved
 * estimator config AND has a declared route in the locked sitemap.
 *
 * FAQ 4 uses the conservative NOT-VERIFIED wording — automatic ticket creation
 * is not evidenced. See the evidence gates in the file header.
 */
export const HD_FAQ: HdFaqItem[] = [
  {
    q: 'Tổng đài tích hợp Helpdesk là gì?',
    a: 'Tổng đài tích hợp Helpdesk kết nối hoạt động nghe gọi với hệ thống quản lý yêu cầu hỗ trợ để nhân viên có thể sử dụng cuộc gọi, ticket và lịch sử tương tác trong cùng một quy trình CSKH.',
  },
  {
    q: 'Gcalls có thể tích hợp với Helpdesk nào?',
    a: 'Khả năng tích hợp phụ thuộc vào nền tảng, API và yêu cầu triển khai. Gcalls hiện có các trang giải pháp riêng cho những nền tảng đã được xác nhận như Freshdesk và Zendesk.',
    link: { label: 'Xem các tích hợp Gcalls', path: ROUTES.integrations },
  },
  {
    q: 'Cuộc gọi có thể được gắn với ticket không?',
    a: 'Với nền tảng và cấu hình phù hợp, dữ liệu cuộc gọi có thể được liên kết với ticket hoặc hồ sơ hỗ trợ để agent có thêm context khi xử lý yêu cầu.',
  },
  {
    q: 'Gcalls có tự động tạo ticket sau cuộc gọi không?',
    a: 'Khả năng tạo hoặc cập nhật ticket phụ thuộc vào nền tảng Helpdesk và workflow tích hợp. Gcalls cần khảo sát hệ thống hiện tại để xác định luồng xử lý có thể triển khai.',
  },
  {
    q: 'Lịch sử cuộc gọi có được lưu trong Helpdesk không?',
    a: 'Dữ liệu lịch sử cuộc gọi có thể được ghi nhận hoặc liên kết theo phạm vi tích hợp và khả năng của nền tảng. Các trường dữ liệu cụ thể cần được xác định trong quá trình khảo sát kỹ thuật.',
  },
  {
    q: 'Helpdesk Integration khác Gcalls CX như thế nào?',
    a: 'Helpdesk Integration tập trung kết nối cuộc gọi với ticket và workflow hỗ trợ hiện có. Gcalls CX giải quyết bài toán rộng hơn về quản lý giao tiếp đa kênh trên một Contact Center tập trung.',
    link: { label: 'Gcalls CX', path: ROUTES.gcallsCx },
  },
]

export const HD_FINAL_CTA = {
  eyebrow: 'HELPDESK INTEGRATION',
  h2: 'Đưa cuộc gọi vào đúng quy trình hỗ trợ đội CSKH đang sử dụng',
  description:
    'Chia sẻ nền tảng Helpdesk, cấu trúc ticket và workflow hiện tại để Gcalls xác định cách tích hợp phù hợp.',
  primaryCta: { label: 'Tư vấn tích hợp Helpdesk', path: ROUTES.contact },
  secondaryCta: { label: 'Ước tính cấu hình', path: HD_ESTIMATOR_HREF },
} as const

/**
 * Structured data.
 *
 * Four nodes only — Service is the accurate top-level type for an integration
 * offering, plus SoftwareApplication, BreadcrumbList and FAQPage. No Offer,
 * price, AggregateRating, Review, partnership assertion, SLA or performance
 * metric is emitted; none is verified.
 */
export function buildHelpdeskJsonLd(origin: string) {
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
            name: 'Tổng đài tích hợp Helpdesk',
            item: `${origin}${ROUTES.helpdeskIntegration}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: 'Tổng đài tích hợp Helpdesk',
        serviceType: 'Helpdesk Telephony Integration',
        description: HD_DIRECT_ANSWER.answer,
        provider: { '@type': 'Organization', name: 'Gcalls' },
        url: `${origin}${ROUTES.helpdeskIntegration}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Gcalls Helpdesk Integration',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Helpdesk Telephony Integration',
        operatingSystem: 'Web browser',
        description: HD_OVERVIEW.description,
        url: `${origin}${ROUTES.helpdeskIntegration}`,
        featureList: HD_CAPABILITIES.items.map((c) => c.title),
        provider: { '@type': 'Organization', name: 'Gcalls' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: HD_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
