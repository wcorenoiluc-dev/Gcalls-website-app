/**
 * Approved content for /tong-dai-tich-hop-crm/.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED and CLAIMS ARE CONSTRAINED.
 * ---------------------------------------------------------------------------
 * Positioning is specifically GCALLS CALL CENTER + CRM INTEGRATION, not a
 * generic CRM page.
 *
 * Two constraints apply throughout and are worth restating because they shape
 * the wording of almost every string below:
 *
 *  1. No numerical productivity claims. No "giảm 40% thao tác", no time saved,
 *     no efficiency percentage — none is approved.
 *  2. No capability is asserted as identical across CRM platforms, and no
 *     automatic-synchronisation behaviour is described, because nothing in the
 *     source material or codebase confirms it. Platform copy stays neutral and
 *     defers to "theo cấu hình triển khai".
 * ---------------------------------------------------------------------------
 */

import { ROUTES } from '@/config/navigation'

export const CRM_HERO = {
  eyebrow: 'Tích hợp CRM',
  h1: 'Tổng đài tích hợp CRM giúp đội Sales và CSKH làm việc ngay trên dữ liệu khách hàng',
  description:
    'Kết nối Gcalls với CRM để nhân viên có thể thực hiện cuộc gọi, xem ngữ cảnh khách hàng và theo dõi lịch sử tương tác trong workflow đang sử dụng.',
  keyPoints: [
    'Click-to-Call từ workflow CRM',
    'Nhận diện và xem ngữ cảnh khách hàng khi xử lý cuộc gọi',
    'Quản lý lịch sử tương tác tập trung hơn',
    'Giảm việc chuyển đổi liên tục giữa nhiều công cụ',
  ],
  primaryCta: { label: 'Tư vấn tích hợp CRM', path: ROUTES.costEstimator },
  secondaryCta: { label: 'Xem cách hoạt động', href: '#cach-hoat-dong' },
} as const

export const CRM_PROBLEMS = {
  eyebrow: 'Bài toán',
  h2: 'CRM có dữ liệu khách hàng nhưng cuộc gọi vẫn nằm ngoài workflow',
  items: [
    {
      n: '01',
      title: 'Nhập số điện thoại thủ công',
      detail: 'Nhân viên phải copy số từ CRM sang công cụ gọi.',
    },
    {
      n: '02',
      title: 'Thiếu ngữ cảnh khi gọi',
      detail: 'Thông tin khách hàng và lịch sử tương tác không nằm cạnh cuộc gọi.',
    },
    {
      n: '03',
      title: 'Nhập liệu sau cuộc gọi',
      detail: 'Ghi chú và trạng thái follow-up có thể phải cập nhật ở nhiều nơi.',
    },
    {
      n: '04',
      title: 'Khó theo dõi toàn bộ hành trình',
      detail:
        'Quản lý thiếu góc nhìn liên tục từ dữ liệu CRM đến hội thoại thực tế.',
    },
  ],
} as const

export const CRM_DEFINITION = {
  eyebrow: 'Tổng đài + CRM',
  h2: 'Đưa cuộc gọi trở thành một phần của quy trình CRM',
  /** Direct-answer paragraph, for both readers and answer engines. */
  directAnswer:
    'Tổng đài tích hợp CRM kết nối chức năng gọi điện với dữ liệu khách hàng trong CRM, giúp đội ngũ thực hiện cuộc gọi, nhận biết khách hàng và quản lý lịch sử tương tác trong một workflow liên kết hơn.',
  capabilities: [
    'Click-to-Call',
    'Customer context',
    'Call history',
    'Notes / interaction data',
    'Integration configuration',
  ],
} as const

export const CRM_WORKFLOW = {
  h2: 'Cuộc gọi đi qua workflow CRM như thế nào?',
  steps: [
    { n: '01', label: 'CRM Lead / Contact', detail: 'Dữ liệu khách hàng có sẵn trong CRM.' },
    { n: '02', label: 'Customer Record', detail: 'Nhân viên mở hồ sơ khách hàng cần liên hệ.' },
    { n: '03', label: 'Click-to-Call', detail: 'Bắt đầu cuộc gọi ngay tại điểm làm việc.' },
    { n: '04', label: 'Gcalls Call', detail: 'Cuộc gọi được thực hiện qua hệ thống Gcalls.' },
    { n: '05', label: 'Conversation', detail: 'Trao đổi với khách hàng kèm ngữ cảnh sẵn có.' },
    { n: '06', label: 'Call History / Note', detail: 'Ghi nhận kết quả và nội dung trao đổi.' },
    { n: '07', label: 'Follow-up', detail: 'Tiếp tục chăm sóc theo trạng thái đã ghi nhận.' },
  ],
} as const

export const CRM_CLICK_TO_CALL = {
  eyebrow: 'Click-to-Call',
  h2: 'Từ dữ liệu khách hàng đến cuộc gọi chỉ trong cùng workflow',
  description:
    'Click-to-Call giúp nhân viên bắt đầu cuộc gọi từ điểm làm việc đang có dữ liệu khách hàng, thay vì phải sao chép và quay số thủ công.',
  points: [
    'Gọi trực tiếp từ nơi đang có dữ liệu khách hàng',
    'Không cần sao chép và quay số thủ công',
    'Phạm vi áp dụng phụ thuộc vào nền tảng và cấu hình triển khai',
  ],
} as const

export const CRM_CONTEXT = {
  eyebrow: 'Customer context',
  h2: 'Hiển thị thông tin cần thiết khi xử lý cuộc gọi',
  description:
    'Ngữ cảnh khách hàng giúp đội Sales và CSKH biết họ đang trao đổi với ai và lịch sử tương tác trước đó như thế nào.',
  points: [
    'Thông tin liên hệ',
    'Ghi chú',
    'Lịch sử tương tác',
    'Trạng thái follow-up',
  ],
} as const

export const CRM_HISTORY = {
  eyebrow: 'Lịch sử',
  h2: 'Giữ lịch sử hội thoại gần dữ liệu khách hàng hơn',
  description:
    'Lịch sử cuộc gọi và tương tác giúp đội ngũ tiếp tục chăm sóc khách hàng với ngữ cảnh rõ ràng hơn.',
  points: [
    'Xem lại hoạt động và cuộc gọi theo dòng thời gian',
    'Tra cứu lịch sử cuộc gọi theo trạng thái và hotline',
    'Giữ ghi chú và kết quả trao đổi cùng hồ sơ khách hàng',
  ],
} as const

export const CRM_CONFIG = {
  eyebrow: 'Cấu hình',
  h2: 'Kết nối Gcalls với hệ thống CRM doanh nghiệp đang sử dụng',
  /** Deliberately process-level only — no keys, secrets or tenant data. */
  steps: [
    { n: '01', title: 'Chọn tích hợp', detail: 'Xác định hệ thống cần kết nối.' },
    { n: '02', title: 'Cấu hình kết nối', detail: 'Thiết lập kết nối theo yêu cầu triển khai.' },
    { n: '03', title: 'Kiểm thử workflow', detail: 'Chạy thử luồng làm việc trước khi sử dụng.' },
    { n: '04', title: 'Đưa vào vận hành', detail: 'Sử dụng trong quy trình hằng ngày.' },
  ],
} as const

/**
 * CRM platforms.
 *
 * Only entities already approved in the project source appear here. Each
 * description is neutral and makes no claim that capabilities behave
 * identically across platforms — scope is confirmed per deployment.
 */
export const CRM_PLATFORMS = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    detail:
      'Kết nối hoạt động nghe gọi với dữ liệu khách hàng trên HubSpot theo phạm vi tích hợp được xác nhận.',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    detail:
      'Kết nối hoạt động nghe gọi với dữ liệu khách hàng trên Salesforce theo phạm vi tích hợp được xác nhận.',
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    detail:
      'Kết nối hoạt động nghe gọi với dữ liệu khách hàng trên Zoho CRM theo phạm vi tích hợp được xác nhận.',
  },
  {
    id: 'other',
    name: 'Khác',
    detail:
      'Với hệ thống CRM khác, Gcalls sẽ khảo sát khả năng kết nối trước khi đề xuất phương án tích hợp.',
  },
] as const

export const CRM_PLATFORM_NOTE =
  'Khả năng kết nối và phạm vi dữ liệu có thể khác nhau giữa các nền tảng, và được Gcalls xác nhận theo hệ thống thực tế của doanh nghiệp.'

export const CRM_BENEFITS = {
  h2: 'Khi dữ liệu và cuộc gọi được đặt trong cùng một workflow',
  items: [
    'Giảm thao tác chuyển đổi công cụ',
    'Giữ customer context rõ ràng hơn',
    'Hạn chế nhập liệu lặp lại',
    'Dễ theo dõi follow-up',
    'Tạo dữ liệu vận hành tập trung hơn',
  ],
} as const

export const CRM_USE_CASES = {
  h2: 'Phù hợp với những workflow nào?',
  items: [
    { role: 'Sales', flow: 'Lead → Call → Note → Follow-up' },
    { role: 'Customer Service', flow: 'Customer → Context → Conversation → History' },
    { role: 'Education / Admissions', flow: 'Lead học viên → tư vấn → follow-up' },
    { role: 'Real Estate', flow: 'Lead → Agent → Call → Appointment' },
    { role: 'BPO', flow: 'Customer record → agent workflow → call history' },
  ],
} as const

export const CRM_DEPLOYMENT = {
  eyebrow: 'Triển khai',
  h2: 'Tích hợp từ workflow hiện tại thay vì thay đổi toàn bộ hệ thống',
  /** No setup-time claim appears anywhere. */
  steps: [
    { n: '01', title: 'Xác định CRM và nhu cầu tích hợp' },
    { n: '02', title: 'Thống nhất dữ liệu / workflow cần kết nối' },
    { n: '03', title: 'Cấu hình và kiểm thử' },
    { n: '04', title: 'Đưa vào vận hành' },
  ],
} as const

export const CRM_PRICING = {
  eyebrow: 'Chi phí',
  h2: 'Ước tính cấu hình tích hợp CRM theo hệ thống hiện tại',
  description:
    'Chi phí phụ thuộc vào quy mô Agent, nền tảng CRM, phạm vi dữ liệu và yêu cầu triển khai.',
  primaryCta: { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
  secondaryCta: { label: 'Xem bảng giá', path: ROUTES.pricing },
} as const

export const CRM_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Tổng đài tích hợp CRM là gì?',
    a: 'Tổng đài tích hợp CRM kết nối chức năng gọi điện với dữ liệu khách hàng trong CRM, giúp đội ngũ thực hiện cuộc gọi, nhận biết khách hàng và quản lý lịch sử tương tác trong một workflow liên kết hơn.',
  },
  {
    q: 'Click-to-Call hoạt động như thế nào?',
    a: 'Click-to-Call cho phép nhân viên bắt đầu cuộc gọi từ điểm làm việc đang có dữ liệu khách hàng, thay vì sao chép số và quay số thủ công. Phạm vi áp dụng phụ thuộc vào nền tảng và cấu hình tích hợp thực tế.',
  },
  {
    q: 'Gcalls có thể hiển thị thông tin khách hàng khi có cuộc gọi không?',
    a: 'Gcalls có khả năng hiển thị ngữ cảnh khách hàng trong quá trình xử lý cuộc gọi. Thông tin hiển thị cụ thể phụ thuộc vào dữ liệu sẵn có và phạm vi tích hợp được thiết lập.',
  },
  {
    q: 'Lịch sử cuộc gọi có thể được đưa vào workflow CRM không?',
    a: 'Lịch sử cuộc gọi có thể được đưa vào workflow CRM tùy theo cấu hình tích hợp. Phạm vi dữ liệu và cách ghi nhận sẽ được Gcalls xác nhận theo hệ thống doanh nghiệp đang sử dụng.',
  },
  {
    q: 'Gcalls có tích hợp HubSpot không?',
    a: 'HubSpot nằm trong nhóm nền tảng CRM mà Gcalls có thể kết nối. Phạm vi tích hợp và các chức năng khả dụng được xác nhận theo yêu cầu triển khai thực tế.',
  },
  {
    q: 'Gcalls có tích hợp Salesforce không?',
    a: 'Salesforce nằm trong nhóm nền tảng CRM mà Gcalls có thể kết nối. Phạm vi tích hợp và các chức năng khả dụng được xác nhận theo yêu cầu triển khai thực tế.',
  },
  {
    q: 'Gcalls có tích hợp Zoho CRM không?',
    a: 'Zoho CRM nằm trong nhóm nền tảng CRM mà Gcalls có thể kết nối. Phạm vi tích hợp và các chức năng khả dụng được xác nhận theo yêu cầu triển khai thực tế.',
  },
  {
    q: 'Chi phí tích hợp CRM được tính như thế nào?',
    a: 'Chi phí phụ thuộc vào quy mô Agent, nền tảng CRM, phạm vi dữ liệu và yêu cầu triển khai. Doanh nghiệp có thể sử dụng công cụ Ước tính chi phí để chuẩn bị cấu hình ban đầu trước khi nhận báo giá chính thức.',
  },
]

export const CRM_FINAL_CTA = {
  h2: 'Đang sử dụng CRM nhưng cuộc gọi vẫn nằm ngoài workflow?',
  description:
    'Chia sẻ CRM đang sử dụng và quy trình Sales/CSKH hiện tại để Gcalls đề xuất cấu hình tích hợp phù hợp.',
  primaryCta: { label: 'Tư vấn tích hợp CRM', path: ROUTES.costEstimator },
  secondaryCta: { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
} as const

/** Structured data. No Offer/price — public pricing does not exist. */
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
            item: `${origin}${ROUTES.gcallsPlus}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Tích hợp CRM',
            item: `${origin}${ROUTES.crmIntegration}`,
          },
        ],
      },
      {
        '@type': 'Product',
        name: 'Gcalls — Tổng đài tích hợp CRM',
        description: CRM_HERO.description,
        brand: { '@type': 'Brand', name: 'Gcalls' },
        category: 'CRM Call Center Integration',
        url: `${origin}${ROUTES.crmIntegration}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Gcalls CRM Integration',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'CRM Telephony Integration',
        operatingSystem: 'Web browser',
        description: CRM_DEFINITION.directAnswer,
        url: `${origin}${ROUTES.crmIntegration}`,
        featureList: [...CRM_DEFINITION.capabilities],
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
