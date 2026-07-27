/**
 * Approved content for /gcalls-plus-webphone/.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED.
 * ---------------------------------------------------------------------------
 * Every string below is taken verbatim from the approved SEO/AIO + Website
 * Master source (src/imports/pasted_text/gcalls-website-update-scope.json §09,
 * §10). Do not rewrite, shorten, paraphrase or "improve" it, and do not add
 * claims, benefits, statistics or feature names that are not here.
 *
 * Claim-safety rules that apply to this page (source doc §14):
 * no efficiency percentages, no savings percentages, no "100% calls analysed",
 * no 5/30-minute deployment, no uptime figure, no customer counts.
 *
 * Positioning is deliberately narrow: browser-based Call Center / Webphone for
 * Sales and CSKH. The broader "nền tảng giao tiếp doanh nghiệp" positioning
 * belongs to Home, not here.
 * ---------------------------------------------------------------------------
 */

import { ROUTES } from '@/config/navigation'

export const GP_HERO = {
  eyebrow: 'Gcalls Plus • Webphone',
  h1: 'Gcalls Plus Webphone – tổng đài chuyên nghiệp chạy trên trình duyệt',
  description:
    'Gcalls Plus Webphone giúp đội Sales và CSKH nghe gọi, quản lý danh bạ, lịch sử tương tác, ghi chú và theo dõi hoạt động cuộc gọi ngay trên trình duyệt.',
  keyPoints: [
    'Nghe gọi trực tiếp trên trình duyệt',
    'Quản lý danh bạ và lịch sử tương tác',
    'Ghi chú, nhắc nhở và phân loại cuộc gọi',
    'Theo dõi lịch sử, thống kê và hiệu suất đội ngũ',
  ],
  primaryCta: { label: 'Đăng ký tư vấn', path: ROUTES.pricing },
  secondaryCta: { label: 'Khám phá tính năng', href: '#tinh-nang' },
} as const

export const GP_PROBLEMS = {
  eyebrow: 'Bài toán',
  h2: 'Những điểm nghẽn làm giảm hiệu suất nghe gọi của đội Sales và CSKH',
  description:
    'Khi dữ liệu khách hàng, lịch sử cuộc gọi và công cụ làm việc nằm ở nhiều nơi, đội ngũ dễ mất ngữ cảnh và tốn thời gian cho thao tác thủ công.',
  items: [
    { n: '01', text: 'Dữ liệu khách hàng và lịch sử cuộc gọi bị phân tán' },
    { n: '02', text: 'Nhân viên phải chuyển đổi giữa nhiều công cụ khi gọi và ghi chú' },
    { n: '03', text: 'Khó theo dõi trạng thái và lịch sử tương tác của từng khách hàng' },
    { n: '04', text: 'Quản lý thiếu dữ liệu tập trung để theo dõi hoạt động và hiệu suất' },
  ],
} as const

export const GP_OVERVIEW = {
  eyebrow: 'Gcalls Plus',
  h2: 'Call Center tinh gọn hoạt động ngay trên trình duyệt',
  description:
    'Gcalls Plus tập trung các chức năng nghe gọi, danh bạ, lịch sử tương tác, ghi chú và thống kê vào một giao diện Webphone để đội Sales và CSKH vận hành đơn giản hơn.',
  capabilities: [
    'Webphone chạy trên trình duyệt',
    'IVR và Call Flow theo nhu cầu vận hành',
    'Danh bạ thông minh với lịch sử tương tác',
    'Ghi chú, nhắc nhở và phân loại cuộc gọi',
    'Lịch sử và thống kê cuộc gọi',
    'Khả năng tích hợp CRM',
  ],
} as const

export const GP_FEATURES = {
  eyebrow: 'Tính năng',
  h2: 'Các công cụ cần thiết cho quy trình nghe gọi hằng ngày',
  items: [
    {
      n: '01',
      title: 'Webphone trên trình duyệt',
      detail:
        'Nghe gọi trong một giao diện web, phù hợp với đội ngũ cần thao tác tập trung.',
    },
    {
      n: '02',
      title: 'Danh bạ khách hàng',
      detail:
        'Quản lý thông tin liên hệ và ngữ cảnh khách hàng bên cạnh hoạt động cuộc gọi.',
    },
    {
      n: '03',
      title: 'Lịch sử tương tác',
      detail: 'Theo dõi các hoạt động và cuộc gọi đã diễn ra theo từng khách hàng.',
    },
    {
      n: '04',
      title: 'Ghi chú & nhắc nhở',
      detail: 'Ghi lại nội dung trao đổi và thông tin cần follow-up.',
    },
    {
      n: '05',
      title: 'IVR & Call Flow',
      detail:
        'Cấu hình luồng tiếp nhận và phân phối cuộc gọi theo nhu cầu vận hành.',
    },
    {
      n: '06',
      title: 'Thống kê & hiệu suất',
      detail: 'Theo dõi hoạt động và dữ liệu phục vụ quản lý đội ngũ.',
    },
  ],
} as const

export const GP_HISTORY = {
  eyebrow: 'Lịch sử tương tác',
  h2: 'Theo dõi lịch sử và hoạt động cuộc gọi trên một nơi',
  description:
    'Giữ lại ngữ cảnh của các lần tương tác để đội ngũ dễ tiếp tục follow-up mà không phải tìm kiếm thông tin ở nhiều công cụ.',
  /** Live text so the meaning does not depend on reading the screenshot. */
  points: [
    'Xem lại hoạt động và cuộc gọi theo dòng thời gian',
    'Tra cứu lịch sử cuộc gọi theo trạng thái và hotline',
    'Lọc theo tiêu chí cần thiết khi rà soát lại tương tác',
  ],
} as const

export const GP_CONTEXT = {
  eyebrow: 'Khách hàng',
  h2: 'Giữ thông tin và lịch sử tương tác ngay cạnh cuộc gọi',
  description:
    'Nhân viên có thể xem thông tin khách hàng, ghi chú và lịch sử tương tác trong cùng workflow nghe gọi.',
  points: [
    'Thông tin liên hệ hiển thị cùng màn hình nghe gọi',
    'Ghi chú và phân loại ngay trong lúc trao đổi',
    'Lịch sử tương tác của từng khách hàng ở cùng một nơi',
  ],
} as const

export const GP_PERFORMANCE = {
  eyebrow: 'Hiệu suất',
  h2: 'Theo dõi hoạt động và hiệu suất đội ngũ bằng dữ liệu',
  description:
    'Các màn hình thống kê giúp quản lý theo dõi hoạt động cuộc gọi, trạng thái Agent và những chỉ số vận hành cần thiết.',
  points: [
    'Theo dõi hoạt động cuộc gọi của đội ngũ',
    'Xem trạng thái Agent trong quá trình vận hành',
    'Sử dụng dữ liệu thống kê phục vụ quản lý',
  ],
} as const

export const GP_INTEGRATION = {
  eyebrow: 'Tích hợp',
  h2: 'Kết nối Gcalls Plus với hệ thống doanh nghiệp đang sử dụng',
  description:
    'Gcalls Plus có thể được kết nối với CRM và các hệ thống vận hành để đưa cuộc gọi và ngữ cảnh khách hàng vào workflow hiện tại.',
  points: [
    'Cấu hình kết nối theo hệ thống doanh nghiệp đang dùng',
    'Đưa cuộc gọi và ngữ cảnh khách hàng vào workflow hiện tại',
    'Thiết lập click-to-call trong công cụ làm việc',
  ],
  cta: { label: 'Khám phá giải pháp tích hợp CRM', path: ROUTES.crmIntegration },
} as const

export const GP_USE_CASES = {
  eyebrow: 'Phù hợp với',
  h2: 'Phù hợp với đội ngũ cần một hệ thống nghe gọi tinh gọn',
  items: [
    {
      role: 'Sales',
      detail:
        'Quản lý cuộc gọi, ghi chú và follow-up khách hàng trong một workflow tập trung.',
    },
    {
      role: 'Customer Service',
      detail:
        'Giữ lịch sử và ngữ cảnh khách hàng để xử lý cuộc gọi nhất quán hơn.',
    },
    {
      role: 'Education / Admissions',
      detail:
        'Theo dõi các cuộc trao đổi với người quan tâm và giữ lại thông tin cần follow-up.',
    },
    {
      role: 'Service Businesses',
      detail:
        'Tiếp nhận và xử lý cuộc gọi của khách hàng theo một quy trình thống nhất.',
    },
    {
      role: 'E-commerce support',
      detail:
        'Xử lý cuộc gọi liên quan tới đơn hàng và giữ lại ngữ cảnh trao đổi với khách hàng.',
    },
  ],
} as const

export const GP_DEPLOYMENT = {
  eyebrow: 'Triển khai',
  h2: 'Bắt đầu từ nhu cầu hiện tại và mở rộng khi đội ngũ phát triển',
  /** No timeframe is stated anywhere — none is approved. */
  steps: [
    { n: '01', title: 'Khảo sát nhu cầu nghe gọi' },
    { n: '02', title: 'Cấu hình Webphone và luồng vận hành' },
    { n: '03', title: 'Thiết lập người dùng, đầu số và tích hợp nếu cần' },
    { n: '04', title: 'Kiểm thử và đưa vào sử dụng' },
  ],
} as const

export const GP_PRICING = {
  eyebrow: 'Chi phí',
  h2: 'Ước tính cấu hình Gcalls Plus theo quy mô đội ngũ',
  description:
    'Chi phí phụ thuộc vào số lượng Agent, lưu lượng sử dụng, đầu số và phạm vi tích hợp thực tế.',
  primaryCta: { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
  secondaryCta: { label: 'Xem bảng giá', path: ROUTES.pricing },
} as const

export const GP_STORY = {
  eyebrow: 'Câu chuyện khách hàng',
  h2: 'Gcalls Plus trong hoạt động thực tế',
  /**
   * No approved public case content exists. Per the brief, show a clean
   * placeholder rather than inventing metrics, quotes, results or testimonials.
   */
  placeholder: 'Case Study đang được cập nhật',
  placeholderNote:
    'Nội dung câu chuyện khách hàng sẽ được bổ sung khi có thông tin được duyệt công bố.',
} as const

export const GP_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Gcalls Plus Webphone là gì?',
    a: 'Gcalls Plus Webphone là giải pháp Call Center chạy trên trình duyệt, giúp đội Sales và CSKH nghe gọi, quản lý danh bạ, lịch sử tương tác, ghi chú và theo dõi hoạt động cuộc gọi trong một hệ thống.',
  },
  {
    q: 'Gcalls Plus có cần cài đặt phần mềm không?',
    a: 'Gcalls Plus được thiết kế để sử dụng qua trình duyệt web. Yêu cầu triển khai cụ thể có thể phụ thuộc vào thiết bị, đầu số và cấu hình doanh nghiệp.',
  },
  {
    q: 'Gcalls Plus phù hợp với doanh nghiệp nào?',
    a: 'Gcalls Plus phù hợp với đội ngũ Sales và CSKH cần một hệ thống nghe gọi tập trung, đặc biệt khi doanh nghiệp muốn bắt đầu từ một mô hình Call Center tinh gọn.',
  },
  {
    q: 'Gcalls Plus có quản lý lịch sử cuộc gọi không?',
    a: 'Gcalls Plus hỗ trợ theo dõi lịch sử và hoạt động cuộc gọi để đội ngũ có thêm ngữ cảnh khi tiếp tục tương tác với khách hàng.',
  },
  {
    q: 'Gcalls Plus có thể tích hợp CRM không?',
    a: 'Gcalls Plus có khả năng kết nối với CRM và hệ thống doanh nghiệp theo cấu hình tích hợp phù hợp.',
  },
  {
    q: 'Gcalls Plus có hỗ trợ IVR và Call Flow không?',
    a: 'Gcalls Plus có các khả năng IVR và Call Flow để hỗ trợ tổ chức luồng nghe gọi theo nhu cầu vận hành.',
  },
  {
    q: 'Gcalls Plus khác Gcalls CX như thế nào?',
    a: 'Gcalls Plus tập trung vào Call Center/Webphone và workflow nghe gọi tinh gọn. Gcalls CX hướng tới Contact Center đa kênh và các quy trình giao tiếp rộng hơn.',
  },
  {
    q: 'Chi phí Gcalls Plus được tính như thế nào?',
    a: 'Chi phí phụ thuộc vào cấu hình sử dụng như số lượng Agent, lưu lượng gọi, đầu số và phạm vi tích hợp. Doanh nghiệp có thể sử dụng công cụ Ước tính chi phí để chuẩn bị cấu hình ban đầu trước khi nhận báo giá chính thức.',
  },
]

export const GP_FINAL_CTA = {
  eyebrow: 'Bắt đầu',
  h2: 'Sẵn sàng xây dựng kênh nghe gọi chuyên nghiệp cho đội ngũ?',
  description:
    'Chia sẻ quy mô đội Sales/CSKH và nhu cầu vận hành hiện tại để Gcalls đề xuất cấu hình phù hợp.',
  primaryCta: { label: 'Đăng ký tư vấn', path: ROUTES.pricing },
  secondaryCta: { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
} as const

/**
 * Structured data. No Offer/price is emitted — public pricing does not exist,
 * and a zero or invented price would publish a false claim.
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
        description: GP_HERO.description,
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
        featureList: GP_OVERVIEW.capabilities,
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
