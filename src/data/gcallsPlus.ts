/**
 * Approved content for /gcalls-plus-webphone/.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED.
 * ---------------------------------------------------------------------------
 * Every string below is taken verbatim from the approved SEO/AIO + Website
 * Master source — the hero from Checkpoint P01, the remaining sections from
 * Checkpoint P01-B. Do not rewrite, shorten, paraphrase or "improve" it, and
 * do not add claims, benefits, statistics or feature names that are not here.
 *
 * Claim-safety rules that apply to this page (source doc §14, P01-B §24):
 * no efficiency percentages, no savings percentages, no "100% calls analysed",
 * no 5/30-minute deployment, no "không cần IT", no uptime figure, no customer
 * counts. Numbers rendered inside the demo mockups are demo data and must
 * never be quoted as marketing proof.
 *
 * Positioning is deliberately narrow: browser-based Call Center / Webphone for
 * Sales and CSKH. The broader "nền tảng giao tiếp doanh nghiệp" positioning
 * belongs to Home, not here.
 * ---------------------------------------------------------------------------
 */

import { ROUTES } from '@/config/navigation'

export const GP_HERO = {
  eyebrow: 'GCALLS PLUS WEBPHONE',
  h1: 'Gcalls Plus Webphone – tổng đài doanh nghiệp ngay trên trình duyệt',
  description:
    'Nghe gọi, quản lý danh bạ, theo dõi lịch sử tương tác và hoạt động của đội ngũ Sales/CSKH trong một giao diện Webphone tập trung.',
  /**
   * Three value points, each with its own supporting line. Checkpoint P01
   * replaced the previous four-item flat checklist: the hero now has to carry
   * the positioning (browser-native, customer context, team activity), not just
   * list features.
   */
  valuePoints: [
    {
      title: 'Làm việc ngay trên trình duyệt',
      detail:
        'Đưa hoạt động nghe gọi vào môi trường làm việc trên máy tính thay vì phụ thuộc vào một hệ thống điện thoại rời rạc.',
    },
    {
      title: 'Theo dõi context khách hàng',
      detail:
        'Danh bạ, lịch sử tương tác, ghi chú và thông tin cuộc gọi được tổ chức để nhân viên dễ tiếp tục cuộc hội thoại.',
    },
    {
      title: 'Quản lý hoạt động đội ngũ',
      detail:
        'Theo dõi lịch sử và dữ liệu hoạt động cuộc gọi để hỗ trợ quản lý vận hành.',
    },
  ],
  /**
   * Primary CTA goes through the shared lead-capture architecture
   * (`leadCtaHref`), not to a static route. See GP_LEAD_CONTEXT.
   */
  primaryCta: { label: 'Đăng ký tư vấn' },
  secondaryCta: { label: 'Khám phá tính năng', href: '#tinh-nang' },
} as const

/**
 * Conversion context for every Gcalls Plus CTA that opens the shared LeadForm.
 *
 * The checkpoint brief specifies `product = gcalls-plus`, `intent =
 * consultation`, `source = gcalls`. Mapped onto the existing shared lead model
 * (`src/lib/leads/types.ts`) that is:
 *
 *   product → 'Gcalls Plus Webphone'  — the approved LEAD_NEEDS label; the raw
 *             slug would not match the need list and the form could not
 *             pre-select it.
 *   source  → 'gcalls_plus'           — 'gcalls' is not a member of LeadSource;
 *             'gcalls_plus' is the enum value that means "originated on the
 *             Gcalls Plus page" and preserves per-page attribution.
 *   intent  → 'consultation'          — verbatim.
 */
export const GP_LEAD_CONTEXT = {
  intent: 'consultation',
  source: 'gcalls_plus',
  product: 'Gcalls Plus Webphone',
} as const

/**
 * Direct answer / AIO block. Rendered as plain visible text immediately after
 * the hero — never inside a tab, modal or collapsed element — so both readers
 * and answer engines get the definition without interaction.
 *
 * This is also the single natural placement of the primary keyword
 * "phần mềm tổng đài webphone". It appears once, in the first clause, and is
 * not repeated elsewhere on the page.
 */
export const GP_DIRECT_ANSWER = {
  question: 'Gcalls Plus Webphone là gì?',
  answer:
    'Gcalls Plus Webphone là phần mềm tổng đài Webphone hoạt động trực tiếp trên trình duyệt, giúp đội Sales và Chăm sóc khách hàng thực hiện cuộc gọi, quản lý danh bạ, theo dõi lịch sử tương tác, ghi chú và hoạt động cuộc gọi trên một giao diện tập trung. Giải pháp phù hợp với các đội ngũ cần triển khai kênh nghe gọi chuyên nghiệp nhưng muốn giữ quy trình vận hành đơn giản.',
} as const

export const GP_PROBLEMS = {
  eyebrow: 'BÀI TOÁN',
  h2: 'Một đội ngũ nhỏ cũng cần quy trình nghe gọi chuyên nghiệp',
  description:
    'Khi dữ liệu cuộc gọi, ghi chú và lịch sử khách hàng nằm rải rác, ngay cả một đội Sales hoặc CSKH nhỏ cũng có thể mất nhiều thời gian để theo dõi và tiếp tục từng cuộc hội thoại.',
  items: [
    {
      n: '01',
      title: 'Thông tin cuộc gọi nằm rời rạc',
      detail:
        'Nhân viên gọi điện nhưng lịch sử trao đổi, ghi chú và thông tin khách hàng không nằm trong cùng một luồng làm việc.',
    },
    {
      n: '02',
      title: 'Khó theo dõi những gì đã trao đổi',
      detail:
        'Khi khách hàng quay lại, nhân viên cần biết ai đã liên hệ, trao đổi nội dung gì và bước tiếp theo là gì.',
    },
    {
      n: '03',
      title: 'Quản lý khó nhìn thấy hoạt động của đội ngũ',
      detail:
        'Không có dữ liệu tập trung khiến việc theo dõi lượng cuộc gọi và hoạt động của nhân viên trở nên khó khăn hơn.',
    },
    {
      n: '04',
      title: 'Giải pháp quá phức tạp so với nhu cầu thực tế',
      detail:
        'SME có thể chỉ cần một hệ thống nghe gọi gọn nhẹ thay vì bắt đầu bằng một Contact Center với quá nhiều lớp vận hành.',
    },
  ],
} as const

export const GP_OVERVIEW = {
  eyebrow: 'GCALLS PLUS WEBPHONE',
  h2: 'Webphone đưa chức năng tổng đài vào trình duyệt',
  description:
    'Gcalls Plus tập trung các chức năng nghe gọi và quản lý tương tác vào giao diện Webphone để nhân viên có thể xử lý công việc trên máy tính.',
  /**
   * The four things this section must establish (P01-B §4), as live text:
   * browser-based, calling-focused, lighter than a full omnichannel Contact
   * Center, and aimed at Sales / Customer Service. Nothing beyond that — the
   * omnichannel positioning belongs to Gcalls CX.
   */
  capabilities: [
    'Hoạt động trực tiếp trên trình duyệt',
    'Tập trung vào hoạt động nghe gọi và quản lý tương tác',
    'Gọn nhẹ hơn so với một Contact Center đa kênh đầy đủ',
    'Phù hợp với đội Sales và Chăm sóc khách hàng',
  ],
} as const

export const GP_FEATURES = {
  eyebrow: 'NĂNG LỰC CỐT LÕI',
  h2: 'Các chức năng cần thiết cho hoạt động nghe gọi hằng ngày',
  items: [
    {
      n: '01',
      title: 'Webphone',
      detail:
        'Thực hiện và tiếp nhận cuộc gọi trực tiếp từ giao diện làm việc trên trình duyệt.',
    },
    {
      n: '02',
      title: 'IVR & Call Flow',
      detail:
        'Thiết lập lời chào và luồng xử lý cuộc gọi phù hợp với cách doanh nghiệp tổ chức tiếp nhận khách hàng.',
    },
    {
      n: '03',
      title: 'Quản lý danh bạ',
      detail:
        'Quản lý thông tin liên hệ phục vụ hoạt động Sales hoặc Chăm sóc khách hàng.',
    },
    {
      n: '04',
      title: 'Lịch sử tương tác',
      detail:
        'Theo dõi lịch sử tương tác để nhân viên có thêm context khi tiếp tục làm việc với khách hàng.',
    },
    {
      n: '05',
      title: 'Ghi chú & Follow-up',
      detail:
        'Ghi lại thông tin liên quan đến cuộc gọi và hỗ trợ nhân viên tiếp tục xử lý ở bước tiếp theo.',
    },
    {
      n: '06',
      title: 'Phân loại cuộc gọi',
      detail:
        'Phân loại cuộc gọi theo nội dung hoặc mục đích để thuận tiện cho quản lý và báo cáo.',
    },
  ],
} as const

export const GP_HISTORY = {
  eyebrow: 'LỊCH SỬ TƯƠNG TÁC',
  h2: 'Theo dõi hành trình tương tác thay vì chỉ nhìn từng cuộc gọi riêng lẻ',
  description:
    'Lịch sử tương tác giúp nhân viên xem lại những lần liên hệ trước, nội dung đã ghi chú và các hoạt động liên quan trước khi tiếp tục xử lý khách hàng.',
  /** Live text so the meaning does not depend on reading the screenshot. */
  points: [
    'Lịch sử cuộc gọi',
    'Thời gian tương tác',
    'Ghi chú',
    'Phân loại',
    'Hoạt động liên quan',
  ],
} as const

export const GP_CONTEXT = {
  eyebrow: 'CUSTOMER CONTEXT',
  h2: 'Hiểu khách hàng trước khi tiếp tục cuộc hội thoại',
  description:
    'Khi thông tin liên hệ, lịch sử cuộc gọi và ghi chú được tập trung trong cùng một giao diện, nhân viên có thể nhanh chóng xem lại những gì đã diễn ra trước khi tiếp tục trao đổi với khách hàng.',
  /**
   * Drawn directly from the approved copy above. Deliberately not framed as a
   * CRM replacement (P01-B §7) — this is the Gcalls side of the call workflow.
   */
  points: ['Thông tin liên hệ', 'Lịch sử cuộc gọi', 'Ghi chú'],
} as const

export const GP_WORKFLOW = {
  eyebrow: 'QUY TRÌNH',
  h2: 'Từ cuộc gọi đến bước follow-up tiếp theo',
  steps: [
    {
      n: '01',
      title: 'Tiếp nhận hoặc thực hiện cuộc gọi',
      detail: 'Nhân viên xử lý cuộc gọi trên Webphone.',
    },
    {
      n: '02',
      title: 'Xem context liên hệ',
      detail:
        'Thông tin khách hàng và lịch sử tương tác hỗ trợ nhân viên hiểu bối cảnh trước khi trao đổi.',
    },
    {
      n: '03',
      title: 'Ghi lại nội dung quan trọng',
      detail: 'Nhân viên thêm ghi chú, phân loại hoặc thông tin cần follow-up.',
    },
    {
      n: '04',
      title: 'Theo dõi lịch sử',
      detail:
        'Hoạt động được lưu trong lịch sử để đội ngũ có thể tiếp tục xử lý ở lần tương tác tiếp theo.',
    },
  ],
} as const

export const GP_PERFORMANCE = {
  eyebrow: 'QUẢN LÝ HOẠT ĐỘNG',
  h2: 'Theo dõi hoạt động cuộc gọi của đội ngũ từ dữ liệu tập trung',
  description:
    'Lịch sử và dữ liệu hoạt động cuộc gọi giúp người quản lý có thêm cơ sở để theo dõi cách đội Sales/CSKH đang vận hành thay vì chỉ dựa vào báo cáo thủ công từ từng nhân viên.',
  /** No percentage, rate or improvement figure is approved for this page. */
  points: [
    'Lịch sử cuộc gọi của đội ngũ',
    'Dữ liệu hoạt động tập trung',
    'Trạng thái Agent trong quá trình vận hành',
  ],
} as const

/**
 * CRM / system integration — SUPPORTING CONTEXT ONLY.
 *
 * The keyword "tổng đài tích hợp CRM" is owned by /tong-dai-tich-hop-crm/.
 * This section deliberately carries no capability bullet list: it states the
 * boundary and hands off. Do not grow it back into a second CRM landing page.
 */
export const GP_INTEGRATION = {
  eyebrow: 'KẾT NỐI HỆ THỐNG',
  h2: 'Mở rộng Gcalls Plus vào quy trình CRM khi doanh nghiệp cần',
  description:
    'Khi quy trình Sales hoặc CSKH đã vận hành trên CRM, Gcalls có thể mở rộng từ Webphone sang mô hình tích hợp sâu hơn để hoạt động cuộc gọi gắn với dữ liệu và workflow hiện có của doanh nghiệp.',
  cta: { label: 'Khám phá Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
} as const

export const GP_USE_CASES = {
  eyebrow: 'TÌNH HUỐNG SỬ DỤNG',
  h2: 'Gcalls Plus phù hợp với những đội ngũ nào?',
  items: [
    {
      role: 'Sales',
      detail:
        'Quản lý hoạt động gọi lead, lịch sử liên hệ, ghi chú và follow-up trong một luồng làm việc gọn hơn.',
    },
    {
      role: 'Chăm sóc khách hàng',
      detail:
        'Tiếp nhận cuộc gọi và xem lại lịch sử tương tác trước khi hỗ trợ khách hàng.',
    },
    {
      role: 'Giáo dục',
      detail:
        'Phù hợp với đội tư vấn tuyển sinh và chăm sóc học viên cần xử lý lượng liên hệ thường xuyên.',
      link: { label: 'Giải pháp cho ngành Giáo dục', path: ROUTES.education },
    },
    {
      role: 'Dịch vụ',
      detail:
        'Phù hợp với các doanh nghiệp dịch vụ cần hotline và hệ thống quản lý hoạt động gọi tập trung.',
    },
    {
      role: 'Thương mại điện tử',
      detail:
        'Hỗ trợ đội bán hàng hoặc CSKH xử lý cuộc gọi liên quan tới tư vấn, đơn hàng và chăm sóc sau bán.',
      link: {
        label: 'Giải pháp cho ngành Thương mại điện tử',
        path: ROUTES.ecommerce,
      },
    },
  ],
} as const

/**
 * Product boundaries.
 *
 * Semantically the most important section on the page: it states what Gcalls
 * Plus is for and routes every adjacent need to the product that actually owns
 * it. Gcalls Plus must never be implied to do all four jobs itself.
 *
 * The eyebrow is a structural label added for visual consistency with the
 * other sections; it is not a product claim.
 */
export const GP_BOUNDARIES = {
  eyebrow: 'PHẠM VI PHÙ HỢP',
  h2: 'Phù hợp khi doanh nghiệp cần sự gọn nhẹ trước khi cần một Contact Center phức tạp',
  fitTitle: 'PHÙ HỢP VỚI GCALLS PLUS',
  fitItems: [
    'SME / Startup',
    'Sales team',
    'Customer Service team',
    'Đội ngũ quy mô nhỏ và vừa',
    'Doanh nghiệp cần quản lý cuộc gọi tập trung',
  ],
  expandTitle: 'KHI NHU CẦU MỞ RỘNG',
  expandItems: [
    {
      need: 'CRM workflow sâu hơn',
      solution: 'Tổng đài tích hợp CRM',
      path: ROUTES.crmIntegration,
    },
    { need: 'Giao tiếp đa kênh', solution: 'Gcalls CX', path: ROUTES.gcallsCx },
    {
      need: 'Kiểm soát chất lượng hội thoại bằng AI',
      solution: 'QA QC Center',
      path: ROUTES.qcCenter,
    },
    {
      need: 'Liên lạc quốc tế',
      solution: 'International Calling',
      path: ROUTES.internationalCalling,
    },
  ],
} as const

/**
 * Deployment.
 *
 * The description states explicitly that timing depends on configuration.
 * "Cài đặt trong 30 phút" and "Không cần IT" are NOT approved as absolute
 * promises and must not return without formally approved evidence.
 */
export const GP_DEPLOYMENT = {
  eyebrow: 'TRIỂN KHAI',
  h2: 'Triển khai theo nhu cầu vận hành thực tế',
  description:
    'Gcalls Plus được thiết kế theo mô hình Webphone để giảm độ phức tạp khi triển khai cho đội ngũ cần một hệ thống nghe gọi tập trung. Thời gian triển khai thực tế phụ thuộc vào cấu hình hotline, call flow, số lượng người dùng và yêu cầu tích hợp của doanh nghiệp.',
  steps: [
    { n: '01', title: 'Khảo sát nhu cầu' },
    { n: '02', title: 'Xác định hotline và người dùng' },
    { n: '03', title: 'Thiết lập call flow' },
    { n: '04', title: 'Kiểm thử' },
    { n: '05', title: 'Hướng dẫn sử dụng' },
    { n: '06', title: 'Vận hành' },
  ],
} as const

/** Deep link that pre-selects Gcalls Plus in the estimator. */
export const GP_ESTIMATOR_HREF = `${ROUTES.costEstimator}?product=gcalls-plus`

export const GP_PRICING = {
  eyebrow: 'CẤU HÌNH & CHI PHÍ',
  h2: 'Chi phí phụ thuộc vào cấu hình đội ngũ và nhu cầu sử dụng',
  description:
    'Quy mô người dùng, hotline, lưu lượng gọi và yêu cầu tích hợp có thể ảnh hưởng đến cấu hình giải pháp. Sử dụng công cụ ước tính để mô tả nhu cầu trước khi nhận tư vấn.',
  primaryCta: { label: 'Ước tính cấu hình & chi phí', path: GP_ESTIMATOR_HREF },
  secondaryCta: { label: 'Xem bảng giá Gcalls', path: ROUTES.pricing },
} as const

/**
 * Trust section.
 *
 * No approved customer logo assets exist in this project and no public case
 * content has been cleared, so this stays a clean placeholder. Per P01-B §15
 * nothing is invented here — no testimonial, quote, percentage improvement,
 * case study or customer count.
 */
export const GP_STORY = {
  eyebrow: 'KHÁCH HÀNG',
  h2: 'Đồng hành cùng nhiều mô hình doanh nghiệp khác nhau',
  placeholder: 'Nội dung khách hàng đang được cập nhật',
  placeholderNote:
    'Câu chuyện khách hàng sẽ được bổ sung khi có thông tin được duyệt công bố.',
  link: { label: 'Đọc bài viết trên Blog Gcalls', path: ROUTES.blog },
} as const

export interface GpFaqItem {
  q: string
  a: string
  link?: { label: string; path: string }
}

export const GP_FAQ: GpFaqItem[] = [
  {
    q: 'Gcalls Plus Webphone là gì?',
    a: 'Gcalls Plus Webphone là giải pháp tổng đài hoạt động trên trình duyệt giúp doanh nghiệp thực hiện cuộc gọi và quản lý các thông tin liên quan đến hoạt động tương tác trong một giao diện tập trung.',
  },
  {
    q: 'Gcalls Plus có cần điện thoại bàn không?',
    a: 'Webphone được thiết kế để hoạt động thông qua môi trường trình duyệt trên máy tính. Yêu cầu thiết bị và cấu hình thực tế sẽ tùy thuộc vào mô hình triển khai.',
  },
  {
    q: 'Gcalls Plus có lưu lịch sử cuộc gọi không?',
    a: 'Có. Gcalls Plus hỗ trợ theo dõi lịch sử và dữ liệu hoạt động cuộc gọi để nhân viên và người quản lý có thêm context trong quá trình làm việc.',
  },
  {
    q: 'Gcalls Plus có tích hợp CRM không?',
    a: 'Gcalls có khả năng kết nối hoạt động nghe gọi với CRM. Với doanh nghiệp cần workflow sâu hơn như Click-to-Call, context khách hàng hoặc đồng bộ lịch sử cuộc gọi, hãy tham khảo giải pháp Tổng đài tích hợp CRM.',
    link: { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
  },
  {
    q: 'Gcalls Plus phù hợp với ai?',
    a: 'Gcalls Plus hướng tới các SME và đội Sales/CSKH cần một hệ thống nghe gọi tập trung trên trình duyệt nhưng chưa cần một Contact Center đa kênh phức tạp.',
  },
  {
    q: 'Tôi có thể biết chi phí trước khi tư vấn không?',
    a: 'Doanh nghiệp có thể sử dụng công cụ Ước tính cấu hình & chi phí để mô tả quy mô và nhu cầu trước khi nhận báo giá chính thức.',
    link: { label: 'Ước tính cấu hình & chi phí', path: GP_ESTIMATOR_HREF },
  },
]

export const GP_FINAL_CTA = {
  eyebrow: 'GCALLS PLUS WEBPHONE',
  h2: 'Bắt đầu với một hệ thống nghe gọi phù hợp với cách đội ngũ của bạn đang làm việc',
  description:
    'Chia sẻ quy mô Sales/CSKH, số hotline và quy trình hiện tại để Gcalls tư vấn cấu hình Webphone phù hợp.',
  primaryCta: { label: 'Đăng ký tư vấn', path: ROUTES.contact },
  secondaryCta: { label: 'Ước tính cấu hình', path: GP_ESTIMATOR_HREF },
} as const

/**
 * Structured data.
 *
 * Four nodes only — BreadcrumbList, Product, SoftwareApplication, FAQPage.
 * No Offer/price is emitted (public pricing does not exist, and a zero or
 * invented price would publish a false claim), and no AggregateRating, Review,
 * customer count, award or unverified statistic.
 */
export function buildGcallsPlusJsonLd(origin: string) {
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
            name: 'Gcalls Plus Webphone',
            item: `${origin}${ROUTES.gcallsPlus}`,
          },
        ],
      },
      {
        '@type': 'Product',
        name: 'Gcalls Plus Webphone',
        description: GP_DIRECT_ANSWER.answer,
        brand: { '@type': 'Brand', name: 'Gcalls' },
        category: 'Call Center Software',
        url: `${origin}${ROUTES.gcallsPlus}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Gcalls Plus Webphone',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Call Center Software',
        operatingSystem: 'Web browser',
        description: GP_OVERVIEW.description,
        url: `${origin}${ROUTES.gcallsPlus}`,
        featureList: GP_FEATURES.items.map((f) => f.title),
        provider: { '@type': 'Organization', name: 'Gcalls' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: GP_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
