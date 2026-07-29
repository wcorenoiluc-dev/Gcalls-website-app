/**
 * Approved content for /tong-dai-tich-hop-pos/ — Checkpoint S03.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED.
 * ---------------------------------------------------------------------------
 * Every string below comes from the approved S03 source. Do not rewrite,
 * shorten, paraphrase or "improve" it, and do not add capabilities, POS
 * vendors, data fields or benefits that are not here.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING (S03 §29)
 * ---------------------------------------------------------------------------
 * Never publish without verified evidence:
 *   "tăng 30–50% hiệu suất" · "đồng bộ 100%" · "tự động lấy toàn bộ lịch sử
 *   đơn hàng" · "nhận diện khách hàng tức thì" · "hỗ trợ mọi POS" · "đồng bộ
 *   toàn bộ dữ liệu giao dịch" · "real-time guaranteed" · "xóa bỏ hoàn toàn
 *   thao tác tra cứu" · "không bỏ sót đơn hàng / lead".
 *
 * Required register instead: "phù hợp", "hỗ trợ", "có thể", "theo cấu hình",
 * "theo API", "dữ liệu phù hợp", "phạm vi tích hợp", "customer context".
 *
 * ---------------------------------------------------------------------------
 * EVIDENCE GATES — ALL FOUR CLOSED NEGATIVE (do not reverse without evidence)
 * ---------------------------------------------------------------------------
 * The only POS evidence in this repository is the approved estimator config
 * (`src/data/estimator.ts`, solution `pos`): a `posPlatform` select, a
 * `locations` count, agents, and a `posNeeds` multi-select offering exactly two
 * data categories — "Dữ liệu khách hàng" and "Dữ liệu đơn hàng".
 *
 * ORDER DATA (§11) — GENERIC SALES CONTEXT ONLY. `posNeeds` evidences order
 * data as a connectable CATEGORY, not as any specific field. Nothing evidences
 * order status, SKU, purchase value, payment data or full purchase history. All
 * copy therefore says "dữ liệu bán hàng phù hợp" and never "đơn hàng chi tiết".
 *
 * INCOMING CUSTOMER POPUP (§12) — NOT PUBLISHED. No POS-specific popup
 * behaviour is evidenced anywhere. The `CustomerPopupMockup` and S01's
 * "Customer Popup" capability are CRM-scoped, and §12 explicitly forbids
 * inheriting them. Only Customer Identification / Customer Context are
 * published, both conditional on platform and configuration.
 *
 * POS CLICK-TO-CALL (§13) — NOT PUBLISHED. Click-to-Call appears in this
 * repository only inside the CRM estimator field and CRM copy. §13 explicitly
 * forbids inheriting it into POS. No Click-to-Call claim appears on this page.
 *
 * POS PLATFORM NAMES (§19) — NONE. GENERIC POSITIONING ONLY. §19 requires BOTH
 * current sitemap relevance AND product evidence. The locked sitemap contains
 * NO POS vendor route, so a vendor keyword would have nowhere to route. Vendor
 * names exist only as options in the estimator's scoping select — an internal
 * input helping a visitor describe their own system, not published proof of an
 * integration. The historical material's names (Pancake, Nhanh.vn, Táo Quân) do
 * not even match that list, confirming the vendor set is unverified. Current
 * SEO guidance is explicit: "Bỏ tên nền tảng chưa xác minh." No POS vendor is
 * named anywhere on this page, and no vendor route is created.
 *
 * F&B USE CASE (§18) — NOT PUBLISHED. No F&B workflow evidence exists: there is
 * no F&B industry route in the locked sitemap and no F&B content in the data
 * layer. Including it would be keyword expansion, which §18 forbids.
 *
 * ---------------------------------------------------------------------------
 * BOUNDARIES
 * ---------------------------------------------------------------------------
 * This page owns customer + sales context from a retail/order workflow. Lead
 * and contact workflow belongs to CRM Integration, ticket workflow to Helpdesk
 * Integration, multi-channel conversations to Gcalls CX, and the calling layer
 * itself to Gcalls Plus. Social-inbox channels (Facebook/Zalo) are NOT this
 * page's territory — they belong to Gcalls CX.
 */

import { ROUTES } from '@/config/navigation'

/**
 * Conversion context for POS Integration CTAs.
 *
 * `intent: 'consultation'` per S03 §5 and §26. `source` and `solution` are the
 * most specific values the shared lead model already supports:
 * `pos_integration` (LeadSource) and 'Tích hợp POS' (LEAD_NEEDS) — both
 * pre-existing, so no shared type changed.
 */
export const POS_LEAD = {
  intent: 'consultation',
  source: 'pos_integration',
  solution: 'Tích hợp POS',
} as const

export const POS_HERO = {
  eyebrow: 'GCALLS • POS INTEGRATION',
  h1: 'Tổng đài tích hợp POS – kết nối cuộc gọi với dữ liệu bán hàng',
  description:
    'Kết nối hoạt động nghe gọi với dữ liệu khách hàng và thông tin bán hàng phù hợp để đội Sales/CSKH có thêm context khi tư vấn, xử lý đơn hàng hoặc chăm sóc sau mua.',
  valuePoints: [
    {
      title: 'Nhận biết customer context',
      detail:
        'Thông tin liên quan giúp nhân viên hiểu khách hàng trước hoặc trong quá trình trao đổi.',
    },
    {
      title: 'Tra cứu dữ liệu bán hàng thuận tiện hơn',
      detail:
        'Khi hệ thống và cấu hình tích hợp hỗ trợ, dữ liệu liên quan tới khách hàng hoặc giao dịch có thể được đưa gần hơn với quy trình gọi.',
    },
    {
      title: 'Theo dõi quá trình chăm sóc',
      detail:
        'Lịch sử tương tác phù hợp có thể được ghi nhận để đội ngũ tiếp tục follow-up trong quy trình đang sử dụng.',
    },
  ],
  primaryCta: { label: 'Tư vấn tích hợp POS' },
  secondaryCta: {
    label: 'Khám phá cách tích hợp hoạt động',
    href: '#cach-hoat-dong',
  },
} as const

/** Direct answer / AIO. Plain visible text, never collapsed into an accordion. */
export const POS_DIRECT_ANSWER = {
  question: 'Tổng đài tích hợp POS là gì?',
  answer:
    'Tổng đài tích hợp POS là mô hình kết nối hoạt động nghe gọi với hệ thống bán hàng để nhân viên có thể sử dụng thông tin khách hàng, dữ liệu bán hàng phù hợp và lịch sử tương tác trong cùng quy trình chăm sóc. Phạm vi dữ liệu hiển thị hoặc đồng bộ phụ thuộc vào nền tảng POS, API và cấu hình tích hợp thực tế của doanh nghiệp.',
} as const

export const POS_PROBLEMS = {
  eyebrow: 'BÀI TOÁN BÁN HÀNG',
  h2: 'Khi dữ liệu bán hàng và cuộc gọi nằm ở hai nơi, nhân viên phải tự tìm context trong lúc khách hàng đang chờ',
  items: [
    {
      n: '01',
      title: 'Khó nhận biết khách hàng khi có cuộc gọi',
      detail:
        'Nếu hệ thống nghe gọi không kết nối với dữ liệu bán hàng, nhân viên cần tra cứu thủ công trước khi hiểu khách hàng đang liên hệ.',
    },
    {
      n: '02',
      title: 'Dữ liệu mua hàng không nằm cạnh cuộc hội thoại',
      detail:
        'Thông tin giao dịch và lịch sử gọi bị tách rời khiến nhân viên mất thêm thời gian tìm context phù hợp.',
    },
    {
      n: '03',
      title: 'Chăm sóc sau mua bị phân mảnh',
      detail:
        'Lịch sử bán hàng và lịch sử tương tác nằm ở nhiều nơi khiến quá trình follow-up khó được theo dõi liên tục.',
    },
    {
      n: '04',
      title: 'Nhập lại thông tin tạo thêm thao tác',
      detail:
        'Nhân viên có thể phải ghi chép hoặc chuyển dữ liệu giữa hệ thống gọi và phần mềm bán hàng nếu hai luồng không kết nối.',
    },
  ],
} as const

export const POS_OVERVIEW = {
  eyebrow: 'POS + CALLING',
  h2: 'Đưa dữ liệu bán hàng vào đúng thời điểm khách hàng đang tương tác',
  description:
    'Gcalls tập trung vào việc kết nối lớp nghe gọi với dữ liệu bán hàng phù hợp để đội ngũ có thêm context khi tư vấn, hỗ trợ đơn hàng hoặc chăm sóc khách hàng sau giao dịch.',
  /** Core flow, rendered by the existing workflow diagram component. */
  flow: [
    { n: '01', label: 'Customer', detail: 'Khách hàng cần tư vấn hoặc hỗ trợ.' },
    { n: '02', label: 'Call', detail: 'Cuộc gọi diễn ra qua hệ thống Gcalls.' },
    {
      n: '03',
      label: 'Identification',
      detail: 'Hồ sơ liên quan được xác định khi cấu hình cho phép.',
    },
    {
      n: '04',
      label: 'Sales / Order Context',
      detail: 'Dữ liệu bán hàng phù hợp được đưa gần quy trình gọi.',
    },
    {
      n: '05',
      label: 'Conversation',
      detail: 'Nhân viên trao đổi với nhiều context hơn.',
    },
    {
      n: '06',
      label: 'Interaction History',
      detail: 'Lịch sử tương tác phù hợp được ghi nhận.',
    },
    { n: '07', label: 'Follow-up', detail: 'Đội ngũ tiếp tục chăm sóc khách hàng.' },
  ],
} as const

export const POS_HOW_IT_WORKS = {
  anchorId: 'cach-hoat-dong',
  eyebrow: 'CÁCH TÍCH HỢP HOẠT ĐỘNG',
  h2: 'Từ cuộc gọi đến customer context và bước chăm sóc tiếp theo',
  steps: [
    {
      n: '01',
      title: 'Khách hàng liên hệ',
      detail:
        'Khách hàng gọi đến hoặc nhân viên thực hiện cuộc gọi trong quy trình bán hàng/chăm sóc.',
    },
    {
      n: '02',
      title: 'Xác định khách hàng',
      detail:
        'Dữ liệu liên quan hỗ trợ hệ thống xác định hồ sơ khách hàng khi nền tảng và cấu hình tích hợp cho phép.',
    },
    {
      n: '03',
      title: 'Hiển thị sales context phù hợp',
      detail:
        'Nhân viên có thể xem thông tin liên quan từ hệ thống bán hàng theo phạm vi dữ liệu được tích hợp.',
    },
    {
      n: '04',
      title: 'Thực hiện cuộc hội thoại',
      detail:
        'Agent tư vấn, xử lý yêu cầu hoặc chăm sóc khách hàng với nhiều context hơn.',
    },
    {
      n: '05',
      title: 'Ghi nhận tương tác',
      detail:
        'Lịch sử cuộc gọi hoặc dữ liệu phù hợp có thể được ghi nhận theo phạm vi tích hợp.',
    },
    {
      n: '06',
      title: 'Tiếp tục follow-up',
      detail:
        'Đội ngũ tiếp tục quá trình bán hàng hoặc chăm sóc trong workflow doanh nghiệp đang sử dụng.',
    },
  ],
} as const

/**
 * Core capabilities — exactly four.
 *
 * Click-to-Call and an automatic incoming popup are deliberately absent; see
 * the evidence gates in the file header. Capability 3 stays at the level of
 * "dữ liệu bán hàng phù hợp" because no specific order field is evidenced.
 */
export const POS_CAPABILITIES = {
  eyebrow: 'NĂNG LỰC TÍCH HỢP',
  h2: 'Kết nối cuộc gọi với những dữ liệu đội bán hàng và CSKH cần',
  items: [
    {
      n: '01',
      title: 'Customer Identification',
      detail:
        'Hỗ trợ nhận biết khách hàng hoặc hồ sơ liên quan khi dữ liệu và nền tảng tích hợp cho phép.',
    },
    {
      n: '02',
      title: 'Customer Context',
      detail:
        'Đưa thông tin khách hàng phù hợp vào bối cảnh cuộc gọi để nhân viên hiểu người đang liên hệ.',
    },
    {
      n: '03',
      title: 'Sales Data Context',
      detail:
        'Hiển thị dữ liệu bán hàng phù hợp theo khả năng của nền tảng và phạm vi tích hợp được cấu hình.',
    },
    {
      n: '04',
      title: 'Interaction History',
      detail:
        'Ghi nhận hoặc liên kết lịch sử tương tác để hỗ trợ quá trình tư vấn và chăm sóc tiếp theo.',
    },
  ],
} as const

/**
 * Sales context.
 *
 * The point list stays at CATEGORY level — no specific order field is claimed,
 * because none is evidenced. The closing note makes the per-system scoping
 * explicit rather than leaving the list to read as a guarantee.
 */
export const POS_SALES_CONTEXT = {
  eyebrow: 'SALES CONTEXT',
  h2: 'Sử dụng dữ liệu phù hợp để hiểu khách hàng trước khi tư vấn',
  description:
    'Thông tin khách hàng và dữ liệu bán hàng liên quan giúp nhân viên có thêm bối cảnh khi tư vấn, hỗ trợ hoặc tiếp tục quá trình chăm sóc.',
  points: [
    'Hồ sơ khách hàng liên quan',
    'Dữ liệu bán hàng phù hợp',
    'Lịch sử tương tác',
    'Ghi chú liên quan',
  ],
  note: 'Các trường dữ liệu cụ thể phụ thuộc vào hệ thống bán hàng, API và phạm vi tích hợp, và được Gcalls xác định trong quá trình khảo sát kỹ thuật.',
} as const

/**
 * Before / after. A workflow illustration only — S03 §14 forbids attaching a
 * time-saving percentage to it, so none exists here.
 */
export const POS_BEFORE_AFTER = {
  eyebrow: 'TRƯỚC & SAU TÍCH HỢP',
  h2: 'Giảm việc tra cứu thủ công giữa cuộc gọi và hệ thống bán hàng',
  before: {
    label: 'Trước tích hợp',
    steps: [
      'Cuộc gọi',
      'Hỏi lại thông tin khách hàng',
      'Mở hệ thống bán hàng',
      'Tra cứu thủ công',
      'Xem sales context',
      'Quay lại quy trình gọi',
      'Ghi chú tương tác thủ công',
    ],
  },
  after: {
    label: 'Sau tích hợp',
    steps: [
      'Cuộc gọi',
      'Customer identification',
      'Sales context phù hợp',
      'Cuộc hội thoại',
      'Lịch sử tương tác',
      'Follow-up',
    ],
  },
} as const

export const POS_RETAIL = {
  eyebrow: 'BÁN LẺ',
  h2: 'Kết nối cuộc gọi với quá trình chăm sóc khách hàng tại cửa hàng hoặc chuỗi',
  description:
    'Đội bán hàng và CSKH có thể sử dụng customer context liên quan để hiểu khách hàng trước khi tư vấn hoặc tiếp tục hỗ trợ sau mua.',
  /** No inventory-management scenario — none is evidenced. */
  points: [
    'Customer inquiry',
    'Tư vấn sản phẩm / dịch vụ',
    'Hỗ trợ sau mua',
    'Follow-up',
  ],
} as const

export const POS_ECOMMERCE = {
  eyebrow: 'THƯƠNG MẠI ĐIỆN TỬ',
  h2: 'Giữ cuộc gọi gần hơn với quy trình bán hàng trực tuyến',
  description:
    'Khi khách hàng liên hệ qua điện thoại, đội ngũ có thể sử dụng dữ liệu bán hàng phù hợp để hỗ trợ quá trình tư vấn hoặc chăm sóc tiếp theo.',
  link: { label: 'Giải pháp cho Thương mại điện tử', path: ROUTES.ecommerce },
} as const

/**
 * Integration-boundary routing. Required by S03 §20.
 *
 * Same routing table the other integration pages use, with the POS row marked
 * current — which is also what keeps each page off the others' keywords.
 */
export const POS_BOUNDARIES = {
  eyebrow: 'CHỌN ĐÚNG LUỒNG TÍCH HỢP',
  h2: 'CRM, Helpdesk và POS cung cấp những loại customer context khác nhau',
  items: [
    {
      product: 'POS Integration',
      need: 'Đội ngũ cần customer context và dữ liệu bán hàng từ workflow bán lẻ hoặc quản lý đơn hàng.',
      path: ROUTES.posIntegration,
      /** This page. Rendered as a marked card, never as a self-link. */
      current: true,
    },
    {
      product: 'CRM Integration',
      need: 'Sales/CSKH vận hành quanh lead, contact và workflow quản lý khách hàng.',
      path: ROUTES.crmIntegration,
    },
    {
      product: 'Helpdesk Integration',
      need: 'Đội hỗ trợ vận hành quanh ticket và quy trình xử lý yêu cầu.',
      path: ROUTES.helpdeskIntegration,
    },
    {
      product: 'Gcalls CX',
      need: 'Doanh nghiệp cần hội thoại tập trung trên nhiều kênh giao tiếp.',
      path: ROUTES.gcallsCx,
    },
  ],
  related: {
    lead: 'Các luồng liên quan khác:',
    links: [
      { label: 'Xem tất cả giải pháp', path: ROUTES.solutions },
      { label: 'QA QC Center', path: ROUTES.qcCenter },
    ],
  },
} as const

/** Relationship to the calling layer. Does not duplicate the Gcalls Plus page. */
export const POS_PLUS_RELATION = {
  eyebrow: 'LỚP NGHE GỌI',
  h2: 'Kết nối tổng đài với dữ liệu bán hàng khi đội ngũ cần nhiều context hơn',
  description:
    'Gcalls Plus giải quyết nhu cầu Webphone và quản lý hoạt động nghe gọi. POS Integration mở rộng luồng này bằng cách đưa dữ liệu bán hàng phù hợp vào workflow khi doanh nghiệp cần kết nối với hệ thống bán hàng.',
  link: { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
} as const

/** Deployment. No fixed timeline is promised — none is evidenced. */
export const POS_DEPLOYMENT = {
  eyebrow: 'TRIỂN KHAI',
  h2: 'Tích hợp theo hệ thống bán hàng và dữ liệu doanh nghiệp đang sử dụng',
  steps: [
    { n: '01', title: 'Khảo sát hệ thống POS / sales system' },
    { n: '02', title: 'Xác định dữ liệu cần sử dụng trong call workflow' },
    { n: '03', title: 'Kiểm tra API và khả năng kết nối' },
    { n: '04', title: 'Thiết kế luồng customer identification / context' },
    { n: '05', title: 'Cấu hình tích hợp' },
    { n: '06', title: 'Kiểm thử dữ liệu và cuộc gọi' },
    { n: '07', title: 'Hướng dẫn đội Sales/CSKH' },
    { n: '08', title: 'Đưa vào vận hành' },
  ],
} as const

/**
 * Deep link that pre-selects POS Integration in the shared estimator.
 *
 * The public slug is `pos-integration`; the estimator's internal solution id is
 * `pos` (`src/data/estimator.ts`). The estimator resolves the alias — the same
 * narrow mechanism P03 established and S01/S02 extended — so this is a working
 * key, not a decorative parameter.
 */
export const POS_ESTIMATOR_HREF = `${ROUTES.costEstimator}?product=pos-integration`

export const POS_PRICING = {
  eyebrow: 'CẤU HÌNH & CHI PHÍ',
  h2: 'Chi phí phụ thuộc vào hệ thống, người dùng và phạm vi dữ liệu tích hợp',
  description:
    'Phạm vi triển khai có thể thay đổi theo hệ thống bán hàng doanh nghiệp đang sử dụng, số lượng người dùng, hotline, dữ liệu cần kết nối và workflow chăm sóc. Gcalls sẽ xác định yêu cầu kỹ thuật trước khi đưa ra báo giá chính thức.',
  primaryCta: { label: 'Ước tính cấu hình & chi phí', path: POS_ESTIMATOR_HREF },
  secondaryCta: { label: 'Xem bảng giá Gcalls', path: ROUTES.pricing },
} as const

/**
 * Trust — NEUTRAL.
 *
 * No verified POS customer case exists in this repository. Nothing is
 * fabricated: no logo, quote, result, figure or case study. This section also
 * carries the generic-platform position, which is why the page needs no vendor
 * ecosystem grid.
 */
export const POS_TRUST = {
  eyebrow: 'TÍCH HỢP THEO DỮ LIỆU THỰC TẾ',
  h2: 'Mỗi hệ thống bán hàng có cấu trúc dữ liệu và API khác nhau',
  description:
    'Customer fields, dữ liệu bán hàng, permission và workflow khác nhau giữa từng nền tảng. Phạm vi tích hợp cần được xác định từ hệ thống doanh nghiệp đang sử dụng.',
  cta: { label: 'Trao đổi về hệ thống bán hàng hiện tại' },
  links: [
    { label: 'Xem các tích hợp Gcalls', path: ROUTES.integrations },
    { label: 'Đọc bài viết trên Blog Gcalls', path: ROUTES.blog },
  ],
} as const

export interface PosFaqItem {
  q: string
  a: string
  link?: { label: string; path: string }
}

/**
 * FAQ — exactly the six approved questions.
 *
 * FAQ 5 deliberately names NO vendor: S03 §25 forbids listing unverified
 * platform names, and §19 resolved to generic positioning. FAQ 3 answers the
 * order-data question by scope rather than by field, because no field is
 * evidenced.
 */
export const POS_FAQ: PosFaqItem[] = [
  {
    q: 'Tổng đài tích hợp POS là gì?',
    a: 'Tổng đài tích hợp POS kết nối hoạt động nghe gọi với hệ thống bán hàng để nhân viên có thể sử dụng customer context, dữ liệu bán hàng phù hợp và lịch sử tương tác trong cùng quy trình chăm sóc.',
  },
  {
    q: 'Tích hợp POS giúp nhân viên nhận biết khách hàng như thế nào?',
    a: 'Khả năng nhận biết khách hàng phụ thuộc vào dữ liệu và API của hệ thống POS. Khi cấu hình phù hợp, thông tin liên quan có thể được sử dụng để hỗ trợ agent xác định customer context khi xử lý cuộc gọi.',
  },
  {
    q: 'Nhân viên có xem được thông tin đơn hàng khi khách gọi không?',
    a: 'Phạm vi thông tin bán hàng hoặc đơn hàng hiển thị phụ thuộc vào hệ thống POS, API và dữ liệu doanh nghiệp cho phép tích hợp. Gcalls sẽ xác định các trường dữ liệu cụ thể trong quá trình khảo sát kỹ thuật.',
  },
  {
    q: 'Lịch sử cuộc gọi có được lưu cùng dữ liệu khách hàng không?',
    a: 'Lịch sử tương tác phù hợp có thể được ghi nhận hoặc liên kết theo phạm vi tích hợp và khả năng của hệ thống bán hàng.',
  },
  {
    q: 'Gcalls tích hợp được những phần mềm POS nào?',
    a: 'Khả năng tích hợp cần được xác định theo nền tảng, API và yêu cầu triển khai. Gcalls sẽ kiểm tra hệ thống doanh nghiệp đang sử dụng trước khi xác nhận phạm vi kết nối.',
  },
  {
    q: 'POS Integration khác CRM Integration như thế nào?',
    a: 'CRM Integration tập trung vào lead, contact và workflow quản lý khách hàng; POS Integration tập trung vào customer context và dữ liệu bán hàng liên quan tới quy trình retail hoặc thương mại điện tử.',
    link: { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
  },
]

export const POS_FINAL_CTA = {
  eyebrow: 'POS INTEGRATION',
  h2: 'Đưa customer context và dữ liệu bán hàng vào đúng lúc đội ngũ đang trao đổi với khách hàng',
  description:
    'Chia sẻ hệ thống bán hàng, dữ liệu cần sử dụng và workflow hiện tại để Gcalls xác định phạm vi tích hợp phù hợp.',
  primaryCta: { label: 'Tư vấn tích hợp POS', path: ROUTES.contact },
  secondaryCta: { label: 'Ước tính cấu hình', path: POS_ESTIMATOR_HREF },
} as const

/**
 * Structured data.
 *
 * Four nodes only — Service is the accurate top-level type for an integration
 * offering, plus SoftwareApplication, BreadcrumbList and FAQPage. No Offer,
 * price, AggregateRating, Review, partnership assertion or ROI metric is
 * emitted; none is verified.
 */
export function buildPosJsonLd(origin: string) {
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
            name: 'Tổng đài tích hợp POS',
            item: `${origin}${ROUTES.posIntegration}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: 'Tổng đài tích hợp POS',
        serviceType: 'POS Telephony Integration',
        description: POS_DIRECT_ANSWER.answer,
        provider: { '@type': 'Organization', name: 'Gcalls' },
        url: `${origin}${ROUTES.posIntegration}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Gcalls POS Integration',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'POS Telephony Integration',
        operatingSystem: 'Web browser',
        description: POS_OVERVIEW.description,
        url: `${origin}${ROUTES.posIntegration}`,
        featureList: POS_CAPABILITIES.items.map((c) => c.title),
        provider: { '@type': 'Organization', name: 'Gcalls' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: POS_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
