/**
 * Approved content for /gcalls-cx/ — Gcalls CX, omnichannel Contact Center.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED.
 * ---------------------------------------------------------------------------
 * Every string below comes from the approved Checkpoint P03 source. Do not
 * rewrite, shorten, paraphrase or "improve" it, and do not add channels,
 * capabilities, connectors, metrics or benefits that are not here.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING (P03 §27)
 * ---------------------------------------------------------------------------
 * Never publish without verified evidence:
 *   "không bao giờ bỏ sót lead" · "100% không bỏ sót" · "hợp nhất mọi nền
 *   tảng" · "hỗ trợ mọi kênh" · "real-time guaranteed" · "unlimited agents"
 *   · "unlimited conversations" · any "X% productivity / cost reduction" ·
 *   "guaranteed response time".
 *
 * Required register instead: "giảm nguy cơ bỏ sót tương tác", "tập trung
 * hơn", "theo cấu hình", "các kênh được kết nối", "khi được triển khai",
 * "phụ thuộc workflow và phạm vi tích hợp".
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 * SCOPE DECISIONS (do not reverse without evidence)
 * ---------------------------------------------------------------------------
 * AUTO CALL / AUTO DIALER — NOT PUBLISHED. Historical material mentions it
 * inside Gcalls CX, but this repository holds no evidence for it: no product
 * config, no estimator field, no scope-document capability entry. The section
 * is therefore omitted entirely rather than written speculatively.
 *
 * VOICEBOT — out of scope FOR THIS PAGE. It now has its own route,
 * `/voicebot-ai/` (WEB-PRO-004), and is still not mentioned anywhere here:
 * automated script-driven calling is that page's subject, not Gcalls CX's.
 *
 * CHANNELS — exactly five, and only because each is independently evidenced by
 * the existing approved estimator config (`src/data/estimator.ts`, solution
 * `cx`, field `channels`): voice, zalo, facebook, sms, email. No sixth channel
 * and no universal connector guarantee.
 * ---------------------------------------------------------------------------
 *
 * BOUNDARIES. This page owns omnichannel contact center only. Browser calling
 * belongs to Gcalls Plus, AI call QA to QA QC Center, deep CRM workflow to CRM
 * Integration, cross-border calling to International Calling.
 */

import { ROUTES } from '@/config/navigation'

/**
 * Conversion context for Gcalls CX CTAs.
 *
 * `intent: 'demo'` is the shared LeadIntent member added in P03 — a demo
 * request is a scheduled, sales-assisted session, distinct from
 * `product_information` and `consultation`. `source` and `product` are exact
 * matches to the existing enum / LEAD_NEEDS.
 */
export const CX_DEMO_LEAD = {
  intent: 'demo',
  source: 'gcalls_cx',
  product: 'Gcalls CX',
} as const

export const CX_CONSULT_LEAD = {
  intent: 'consultation',
  source: 'gcalls_cx',
  product: 'Gcalls CX',
} as const

export const CX_HERO = {
  eyebrow: 'GCALLS CX • OMNICHANNEL CONTACT CENTER',
  h1: 'Gcalls CX – hợp nhất mọi điểm chạm khách hàng trên một màn hình',
  description:
    'Tập trung Voice, Zalo, Facebook, SMS, Email và quy trình hỗ trợ khách hàng vào một không gian làm việc để đội CSKH dễ theo dõi hội thoại, ticket và customer context hơn.',
  valuePoints: [
    {
      title: 'Hợp nhất điểm chạm',
      detail:
        'Đưa các kênh giao tiếp được triển khai vào một không gian làm việc tập trung hơn.',
    },
    {
      title: 'Quản lý xử lý rõ ràng hơn',
      detail:
        'Tổ chức hội thoại, ticket và trạng thái xử lý để đội ngũ dễ theo dõi công việc đang diễn ra.',
    },
    {
      title: 'Có thêm context khi chăm sóc khách hàng',
      detail:
        'Kết nối lịch sử tương tác và dữ liệu liên quan để nhân viên hiểu bối cảnh trước khi phản hồi.',
    },
  ],
  primaryCta: { label: 'Yêu cầu demo Gcalls CX' },
  secondaryCta: {
    label: 'Khám phá cách Gcalls CX hoạt động',
    href: '#cach-hoat-dong',
  },
} as const

/** Direct answer / AIO. Plain visible text, never collapsed. */
export const CX_DIRECT_ANSWER = {
  question: 'Gcalls CX là gì?',
  answer:
    'Gcalls CX là giải pháp Contact Center đa kênh giúp doanh nghiệp tập trung các điểm chạm như Voice, Zalo, Facebook, SMS và Email vào một không gian quản lý. Nền tảng hỗ trợ đội CSKH theo dõi hội thoại, ticket, customer context và hoạt động vận hành tập trung hơn thay vì xử lý từng kênh trên các hệ thống rời rạc.',
} as const

export const CX_PROBLEMS = {
  eyebrow: 'BÀI TOÁN ĐA KÊNH',
  h2: 'Nhiều kênh giao tiếp không đồng nghĩa với một trải nghiệm liền mạch',
  description:
    'Khi mỗi kênh được vận hành trên một công cụ khác nhau, đội CSKH dễ mất context, khó theo dõi trạng thái xử lý và khó có một bức tranh thống nhất về hành trình tương tác của khách hàng.',
  items: [
    {
      n: '01',
      title: 'Hội thoại nằm ở nhiều nơi',
      detail:
        'Tin nhắn, cuộc gọi và yêu cầu hỗ trợ được xử lý trên các công cụ riêng khiến nhân viên phải liên tục chuyển đổi giữa nhiều màn hình.',
    },
    {
      /** Deliberately "khó được phát hiện kịp thời" — never "không bao giờ bỏ sót". */
      n: '02',
      title: 'Tương tác dễ bị bỏ sót',
      detail:
        'Khi khối lượng trao đổi tăng, những hội thoại chưa được phản hồi hoặc chưa có người xử lý có thể khó được phát hiện kịp thời.',
    },
    {
      n: '03',
      title: 'Customer context bị phân mảnh',
      detail:
        'Nhân viên khó nhìn lại lịch sử tương tác khi dữ liệu khách hàng nằm rải rác giữa các kênh.',
    },
    {
      n: '04',
      title: 'Quản lý khó theo dõi hiệu suất đa kênh',
      detail:
        'Dữ liệu riêng lẻ ở từng công cụ khiến người quản lý khó có góc nhìn tập trung về workload, trạng thái xử lý và hoạt động của đội ngũ.',
    },
  ],
} as const

export const CX_OVERVIEW = {
  eyebrow: 'OMNICHANNEL WORKSPACE',
  h2: 'Một không gian làm việc cho nhiều điểm chạm khách hàng',
  description:
    'Gcalls CX tập trung các kênh giao tiếp và quy trình chăm sóc vào một workspace để nhân viên có thể theo dõi hội thoại, customer context và trạng thái xử lý thuận tiện hơn.',
  /** Every entry is evidenced — see the CHANNELS note in the file header. */
  components: [
    'Omnichannel Inbox',
    'Voice / Hotline',
    'Zalo OA',
    'Facebook',
    'SMS',
    'Email',
    'Ticket / Workflow',
    'Customer Context',
    'Reporting',
  ],
} as const

/**
 * Channels. Exactly the five evidenced by the approved estimator config.
 * Each description is conditional on deployment — no universal connector
 * guarantee is made for any channel.
 */
export const CX_CHANNELS = {
  eyebrow: 'ĐIỂM CHẠM',
  h2: 'Kết nối những kênh khách hàng đang sử dụng',
  items: [
    {
      name: 'Voice / Hotline',
      detail:
        'Tiếp nhận và quản lý tương tác thoại trong cùng hệ sinh thái vận hành.',
    },
    {
      name: 'Zalo OA',
      detail:
        'Đưa hội thoại từ Zalo OA vào luồng xử lý tập trung khi kênh này được cấu hình triển khai.',
    },
    {
      name: 'Facebook',
      detail:
        'Theo dõi hội thoại từ Facebook Fanpage cùng với các kênh chăm sóc khác.',
    },
    {
      name: 'SMS',
      detail:
        'Bổ sung SMS vào hành trình giao tiếp khi doanh nghiệp sử dụng kênh nhắn tin này.',
    },
    {
      name: 'Email',
      detail:
        'Quản lý email như một phần của quy trình hỗ trợ đa kênh nếu được cấu hình.',
    },
  ],
} as const

export const CX_INBOX = {
  eyebrow: 'OMNICHANNEL INBOX',
  h2: 'Giảm việc chuyển đổi giữa nhiều màn hình khi xử lý khách hàng',
  description:
    'Thay vì mở từng ứng dụng riêng lẻ, đội CSKH có thể làm việc trên một giao diện tập trung hơn để theo dõi hội thoại và trạng thái xử lý của các kênh được kết nối.',
  points: [
    'Xem hội thoại theo kênh',
    'Theo dõi trạng thái xử lý',
    'Xác định hội thoại cần tiếp tục',
    'Hỗ trợ phân công xử lý khi workflow được cấu hình',
    'Duy trì customer context liên quan',
  ],
} as const

/** Ticket & workflow. No exact SLA automation is claimed — none is verified. */
export const CX_TICKETS = {
  eyebrow: 'TICKET & WORKFLOW',
  h2: 'Biến hội thoại thành công việc có trạng thái và người chịu trách nhiệm',
  description:
    'Khi một yêu cầu cần được theo dõi qua nhiều bước, ticket và workflow giúp đội ngũ tổ chức việc tiếp nhận, phân công và tiếp tục xử lý rõ ràng hơn.',
  points: [
    'Tạo hoặc quản lý ticket theo workflow được triển khai',
    'Theo dõi trạng thái xử lý',
    'Phân công người phụ trách',
    'Duy trì lịch sử liên quan',
    'Hỗ trợ quá trình follow-up',
  ],
} as const

/** Customer context. Never framed as replacing every CRM. */
export const CX_CONTEXT = {
  eyebrow: 'CUSTOMER CONTEXT',
  h2: 'Hiểu những gì đã xảy ra trước khi phản hồi khách hàng',
  description:
    'Lịch sử tương tác và dữ liệu liên quan giúp nhân viên có thêm bối cảnh khi tiếp nhận một hội thoại mới hoặc tiếp tục yêu cầu đang xử lý.',
  points: [
    'Hồ sơ khách hàng',
    'Lịch sử theo kênh',
    'Tương tác gần đây',
    'Lịch sử ticket',
    'Trạng thái xử lý',
    'Ghi chú và context liên quan',
  ],
} as const

export const CX_HOW_IT_WORKS = {
  anchorId: 'cach-hoat-dong',
  eyebrow: 'CÁCH HOẠT ĐỘNG',
  h2: 'Từ nhiều điểm chạm đến một quy trình chăm sóc tập trung hơn',
  steps: [
    {
      n: '01',
      title: 'Khách hàng liên hệ qua kênh phù hợp',
      detail:
        'Tương tác có thể bắt đầu từ Voice, Zalo, Facebook, SMS, Email hoặc kênh được doanh nghiệp triển khai.',
    },
    {
      n: '02',
      title: 'Gcalls CX tập trung hội thoại',
      detail:
        'Các điểm chạm được kết nối được đưa vào workspace để đội ngũ theo dõi thuận tiện hơn.',
    },
    {
      n: '03',
      title: 'Xác định context và trạng thái',
      detail:
        'Nhân viên xem thông tin liên quan, lịch sử tương tác và trạng thái xử lý trước khi tiếp tục.',
    },
    {
      n: '04',
      title: 'Phân công hoặc tiếp tục xử lý',
      detail:
        'Hội thoại hoặc ticket được xử lý theo workflow vận hành của doanh nghiệp.',
    },
    {
      n: '05',
      title: 'Theo dõi hoạt động và kết quả',
      detail:
        'Dữ liệu vận hành được tổng hợp để người quản lý có thêm góc nhìn về hoạt động chăm sóc khách hàng.',
    },
  ],
} as const

/** Reporting. No KPI value or percentage is asserted in copy. */
export const CX_REPORTING = {
  eyebrow: 'BÁO CÁO VẬN HÀNH',
  h2: 'Theo dõi hoạt động đa kênh từ dữ liệu tập trung',
  description:
    'Dữ liệu từ các kênh và workflow được triển khai giúp người quản lý có thêm góc nhìn về workload, trạng thái xử lý và hoạt động của đội CSKH.',
  points: [
    'Khối lượng hội thoại',
    'Trạng thái ticket',
    'Phân bổ theo kênh',
    'Workload của đội ngũ',
  ],
} as const

export const CX_BENEFITS = {
  eyebrow: 'GIÁ TRỊ VẬN HÀNH',
  h2: 'Giúp đội CSKH làm việc với ít điểm đứt gãy hơn',
  items: [
    {
      n: '01',
      title: 'Giảm phân mảnh công cụ',
      detail:
        'Đưa nhiều điểm chạm vào cùng một luồng làm việc giúp nhân viên hạn chế việc chuyển đổi giữa các hệ thống rời rạc.',
    },
    {
      /** "Giảm nguy cơ" — the approved register. Never "zero missed lead". */
      n: '02',
      title: 'Giảm nguy cơ bỏ sót tương tác',
      detail:
        'Trạng thái xử lý tập trung giúp đội ngũ dễ nhận biết những hội thoại cần tiếp tục.',
    },
    {
      n: '03',
      title: 'Giữ customer context xuyên kênh',
      detail:
        'Lịch sử liên quan giúp nhân viên hiểu những tương tác đã diễn ra trước đó.',
    },
    {
      n: '04',
      title: 'Có thêm dữ liệu cho quản lý',
      detail:
        'Reporting giúp người quản lý quan sát hoạt động đa kênh thay vì chỉ theo dõi từng công cụ riêng biệt.',
    },
  ],
} as const

/** Industry links point only at routes that exist in the sitemap. */
export const CX_USE_CASES = {
  eyebrow: 'TÌNH HUỐNG SỬ DỤNG',
  h2: 'Gcalls CX phù hợp với những mô hình có nhiều điểm chạm khách hàng',
  items: [
    {
      role: 'Tài chính',
      detail:
        'Hỗ trợ đội chăm sóc quản lý lượng tương tác lớn và theo dõi yêu cầu trên nhiều điểm chạm.',
      link: { label: 'Giải pháp cho ngành Tài chính', path: ROUTES.finance },
    },
    {
      role: 'Bảo hiểm',
      detail:
        'Tập trung hội thoại và quá trình follow-up khi khách hàng tương tác qua nhiều kênh.',
      link: { label: 'Giải pháp cho ngành Bảo hiểm', path: ROUTES.insurance },
    },
    {
      role: 'Bất động sản',
      detail:
        'Hỗ trợ đội tư vấn và CSKH theo dõi hội thoại, lead và quá trình chăm sóc trên nhiều điểm chạm.',
      link: { label: 'Giải pháp cho ngành Bất động sản', path: ROUTES.realEstate },
    },
    {
      role: 'Doanh nghiệp tăng trưởng nhanh',
      detail:
        'Phù hợp khi số lượng kênh, nhân viên và tương tác tăng khiến mô hình xử lý riêng lẻ không còn dễ quản lý.',
    },
  ],
} as const

/**
 * CRM / system integration — hand-off only.
 *
 * "Tổng đài tích hợp CRM" is owned by /tong-dai-tich-hop-crm/. Do not
 * duplicate that page's content here.
 */
export const CX_INTEGRATION = {
  eyebrow: 'KẾT NỐI HỆ THỐNG',
  h2: 'Kết nối giao tiếp đa kênh với dữ liệu và quy trình doanh nghiệp',
  description:
    'Gcalls CX tập trung vào vận hành giao tiếp đa kênh. Khi doanh nghiệp cần kết nối sâu hoạt động cuộc gọi với CRM, Gcalls có giải pháp tích hợp riêng cho workflow Sales và Customer Service.',
  primaryLink: { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
  relatedLinks: [
    { label: 'QA QC Center', path: ROUTES.qcCenter },
    { label: 'Gcalls Plus', path: ROUTES.gcallsPlus },
  ],
} as const

export const CX_BOUNDARIES = {
  eyebrow: 'CHỌN ĐÚNG GIẢI PHÁP',
  h2: 'Mỗi bài toán giao tiếp cần một lớp sản phẩm khác nhau',
  items: [
    {
      need: 'Nghe gọi tập trung trên trình duyệt',
      product: 'Gcalls Plus Webphone',
      path: ROUTES.gcallsPlus,
    },
    {
      need: 'Quản lý giao tiếp đa kênh',
      product: 'Gcalls CX',
      path: ROUTES.gcallsCx,
      /** This page. Rendered as a marked card, never as a self-link. */
      current: true,
    },
    {
      need: 'Kiểm soát chất lượng cuộc gọi bằng AI',
      product: 'QA QC Center',
      path: ROUTES.qcCenter,
    },
    {
      need: 'Tích hợp cuộc gọi sâu vào CRM',
      product: 'CRM Integration',
      path: ROUTES.crmIntegration,
    },
    {
      need: 'Liên lạc với thị trường quốc tế',
      product: 'International Calling',
      path: ROUTES.internationalCalling,
    },
  ],
  allSolutions: { label: 'Xem tất cả giải pháp', path: ROUTES.solutions },
} as const

/** Deployment. No fixed duration is promised — none is evidenced. */
export const CX_DEPLOYMENT = {
  eyebrow: 'TRIỂN KHAI',
  h2: 'Thiết kế cấu hình theo kênh và workflow doanh nghiệp đang sử dụng',
  description:
    'Phạm vi triển khai Gcalls CX phụ thuộc vào các kênh cần kết nối, quy trình ticket, số lượng người dùng và hệ thống doanh nghiệp liên quan.',
  steps: [
    { n: '01', title: 'Khảo sát các điểm chạm hiện tại' },
    { n: '02', title: 'Xác định kênh cần kết nối' },
    { n: '03', title: 'Thiết kế workflow xử lý' },
    { n: '04', title: 'Cấu hình người dùng và phân quyền' },
    { n: '05', title: 'Kiểm thử' },
    { n: '06', title: 'Hướng dẫn vận hành' },
    { n: '07', title: 'Go-live theo phạm vi đã thống nhất' },
  ],
} as const

/**
 * Deep link that pre-selects Gcalls CX in the shared estimator.
 *
 * The public slug is `gcalls-cx` (per the approved brief); the estimator's
 * internal solution id is `cx`. The estimator resolves the alias, so the
 * marketing URL stays stable and readable without renaming product data.
 */
export const CX_ESTIMATOR_HREF = `${ROUTES.costEstimator}?product=gcalls-cx`

export const CX_PRICING = {
  eyebrow: 'CẤU HÌNH & CHI PHÍ',
  h2: 'Chi phí phụ thuộc vào số kênh, người dùng và phạm vi triển khai',
  description:
    'Cấu hình Gcalls CX có thể thay đổi theo số lượng Agent, các kênh cần kết nối, workflow ticket và yêu cầu tích hợp hệ thống. Công cụ ước tính giúp doanh nghiệp mô tả nhu cầu trước khi nhận báo giá chính thức.',
  primaryCta: { label: 'Ước tính cấu hình & chi phí', path: CX_ESTIMATOR_HREF },
  secondaryCta: { label: 'Xem bảng giá Gcalls', path: ROUTES.pricing },
} as const

/**
 * Trust — NEUTRAL.
 *
 * No verified Gcalls CX customer case exists in this repository, so none is
 * shown. Nothing is fabricated: no logo, quote, result, figure or case study.
 */
export const CX_TRUST = {
  eyebrow: 'TRIỂN KHAI THEO BỐI CẢNH THỰC TẾ',
  h2: 'Mỗi hành trình khách hàng cần một workflow khác nhau',
  description:
    'Kênh giao tiếp, cấu trúc đội ngũ và cách xử lý ticket khác nhau giữa từng doanh nghiệp. Gcalls CX cần được cấu hình theo quy trình vận hành thực tế thay vì áp dụng một mô hình giống nhau cho mọi tổ chức.',
  cta: { label: 'Yêu cầu demo theo workflow của doanh nghiệp' },
  link: { label: 'Đọc bài viết trên Blog Gcalls', path: ROUTES.blog },
} as const

export interface CxFaqItem {
  q: string
  a: string
  link?: { label: string; path: string }
}

/**
 * FAQ. FAQ 2's wording is load-bearing: channel support is stated as
 * dependent on channel, account and configuration — never promised for every
 * deployment.
 */
export const CX_FAQ: CxFaqItem[] = [
  {
    q: 'Gcalls CX là gì?',
    a: 'Gcalls CX là giải pháp Contact Center đa kênh giúp doanh nghiệp tập trung các điểm chạm giao tiếp và quy trình chăm sóc khách hàng trong một không gian làm việc thống nhất hơn.',
  },
  {
    q: 'Gcalls CX hỗ trợ những kênh nào?',
    a: 'Theo phạm vi sản phẩm hiện tại, Gcalls CX có thể hỗ trợ các điểm chạm như Voice/Hotline, Zalo OA, Facebook Fanpage, SMS và Email. Khả năng triển khai cụ thể phụ thuộc vào kênh, tài khoản và cấu hình của doanh nghiệp.',
  },
  {
    q: 'Gcalls CX có quản lý ticket không?',
    a: 'Có. Quản lý ticket là một trong những năng lực của Gcalls CX, giúp đội ngũ theo dõi trạng thái và quá trình xử lý yêu cầu theo workflow được cấu hình.',
  },
  {
    q: 'Gcalls CX khác Gcalls Plus như thế nào?',
    a: 'Gcalls Plus tập trung vào hoạt động nghe gọi Webphone gọn nhẹ, trong khi Gcalls CX được thiết kế cho bài toán Contact Center đa kênh với nhiều điểm chạm và quy trình chăm sóc khách hàng phức tạp hơn.',
    link: { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
  },
  {
    q: 'Gcalls CX có thay thế CRM không?',
    a: 'Gcalls CX tập trung vào giao tiếp và quy trình Contact Center đa kênh. CRM vẫn có vai trò quản lý dữ liệu và quy trình khách hàng; tùy mô hình triển khai, Gcalls có thể kết nối với CRM để hai hệ thống hỗ trợ nhau.',
    link: { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
  },
  {
    q: 'Gcalls CX phù hợp với doanh nghiệp nào?',
    a: 'Gcalls CX phù hợp với doanh nghiệp có lượng tương tác lớn hoặc nhiều kênh chăm sóc khách hàng và cần quản lý hội thoại, ticket, customer context và hoạt động đội ngũ tập trung hơn.',
  },
]

export const CX_FINAL_CTA = {
  eyebrow: 'GCALLS CX • OMNICHANNEL CONTACT CENTER',
  h2: 'Xem Gcalls CX hoạt động trên chính hành trình chăm sóc khách hàng của doanh nghiệp bạn',
  description:
    'Chia sẻ các kênh đang sử dụng, cấu trúc đội CSKH và workflow hiện tại để Gcalls tư vấn cấu hình Contact Center phù hợp.',
  primaryCta: { label: 'Yêu cầu demo Gcalls CX', path: ROUTES.contact },
  secondaryCta: { label: 'Đăng ký tư vấn', path: ROUTES.contact },
} as const

/**
 * Structured data.
 *
 * Three nodes — BreadcrumbList, SoftwareApplication, FAQPage. Corrected in
 * Checkpoint WEB-SITE-QA-001: the breadcrumb node was missing the "Sản phẩm"
 * level the page actually renders, and the `Product` node was dropped as a
 * duplicate of `SoftwareApplication` that pulled commerce vocabulary onto a page
 * with no approved price or availability. See `src/data/gcallsPlus.ts` for the
 * full reasoning.
 *
 * Still deliberately absent: Offer, price, availability, AggregateRating,
 * Review, customerCount, channel count and uptime — none is verified.
 */
export function buildGcallsCxJsonLd(origin: string) {
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
            name: 'Sản phẩm',
            item: `${origin}${ROUTES.products}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Gcalls CX',
            item: `${origin}${ROUTES.gcallsCx}`,
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Gcalls CX',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Omnichannel Contact Center Software',
        operatingSystem: 'Web browser',
        description: CX_OVERVIEW.description,
        url: `${origin}${ROUTES.gcallsCx}`,
        featureList: CX_OVERVIEW.components,
        provider: { '@type': 'Organization', name: 'Gcalls' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: CX_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
