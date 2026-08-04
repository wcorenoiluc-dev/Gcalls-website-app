/**
 * Approved content for the six navigation hubs — Boss Demo V1, Phase 2.
 *
 * Routes: /san-pham/ · /giai-phap/ · /tich-hop/ · /nganh/ · /tai-nguyen/ ·
 * /cong-ty/
 *
 * ---------------------------------------------------------------------------
 * SCOPE — A HUB ROUTES, IT DOES NOT SELL
 * ---------------------------------------------------------------------------
 * Each hub explains its category, shows its children, and helps a visitor pick
 * the right one. It deliberately does NOT reproduce a product or solution
 * page's full argument: that would compete with the very pages it exists to
 * send people to, and would duplicate their keywords. Depth belongs on the
 * child page.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING
 * ---------------------------------------------------------------------------
 * NOTHING here may assert a number, a count, a duration, a saving, a
 * certification or a partnership. Specifically withheld across all six hubs
 * because no verified evidence exists in this repository:
 *
 *   "10+ năm kinh nghiệm" · "1.000+ khách hàng" · "30+ CRM" · "70+ quốc gia" ·
 *   "đối tác chính thức / được chứng nhận" of any platform · any customer,
 *   revenue, headcount, uptime, SLA or award figure · any content count
 *   ("50 bài viết", "10 case studies") · any market-share or ranking claim.
 *
 * PLATFORM NAMES (Integration hub): exactly the five platforms that have a
 * route in the locked sitemap — HubSpot, Salesforce, Zoho CRM, Freshdesk,
 * Zendesk. Names only. No logo, no vendor mark, no partnership or
 * certification wording, and no assertion that capability is identical across
 * platforms. Platform child pages remain Phase 2 work; the cards route to
 * them, and the per-platform note keeps scope conditional.
 *
 * RESOURCE HUB: no content count and no publication date is claimed. Where a
 * category has no published item yet, the card says the content is being
 * edited — which is what the approved sitemap intros already say — rather than
 * implying a library exists.
 *
 * COMPANY HUB: the corporate overview is built from what this repository can
 * actually support — what Gcalls builds, who it is for, how it works with
 * customers, and how to reach the team. No history, scale, funding or
 * accolade is stated.
 */

import { ROUTES, type RoutePath } from '@/config/navigation'
import type { LeadCtaContext } from '@/lib/leads/ctaLink'

/* ------------------------------------------------------------------ *
 * Shape
 * ------------------------------------------------------------------ */

export interface HubCard {
  title: string
  /** Secondary label, e.g. "Powered by QC Bot AI". */
  supportingLabel?: string
  detail: string
  /** Short capability/scope chips. Never benefits, never figures. */
  points?: readonly string[]
  path: string
  cta: string
}

export interface HubDecisionRow {
  problem: string
  /** The destination's name, rendered as the link label. */
  solution: string
  reason: string
  path: string
}

export interface HubContent {
  /** Used for element ids and the JSON-LD node id. */
  id: string
  route: RoutePath
  breadcrumbLabel: string
  lead: LeadCtaContext
  hero: {
    eyebrow: string
    h1: string
    description: string
    primaryCta: { label: string }
    secondaryCta: { label: string; path: string }
  }
  directAnswer: {
    eyebrow: string
    question: string
    answer: string
  }
  cards: {
    eyebrow: string
    h2: string
    lead?: string
    items: readonly HubCard[]
    note?: string
  }
  decisionGuide?: {
    eyebrow: string
    h2: string
    lead?: string
    rows: readonly HubDecisionRow[]
    note?: string
  }
  links: {
    h2: string
    items: readonly { label: string; path: string }[]
  }
  finalCta: {
    eyebrow: string
    h2: string
    description: string
    primaryCta: { label: string; path: string }
    secondaryCta: { label: string; path: string }
  }
}

/* ------------------------------------------------------------------ *
 * /san-pham/ — Product hub
 * ------------------------------------------------------------------ */

/**
 * Three products, and the boundary between them stated plainly.
 *
 * The boundary is the point of this hub: the most common reason a visitor picks
 * wrong is assuming Gcalls Plus, QA QC Center and Gcalls CX are tiers of one
 * product. They are not — they answer different questions.
 */
export const PRODUCTS_HUB: HubContent = {
  id: 'products',
  route: ROUTES.products,
  breadcrumbLabel: 'Sản phẩm',
  lead: { intent: 'product_information', source: 'consultation' },
  hero: {
    eyebrow: 'SẢN PHẨM GCALLS',
    h1: 'Hệ sinh thái sản phẩm Gcalls cho đội Sales, CSKH và QA',
    description:
      'Gcalls có ba sản phẩm phục vụ ba bài toán khác nhau trong hoạt động giao tiếp với khách hàng: kênh nghe gọi cho đội ngũ, kiểm soát chất lượng hội thoại, và vận hành chăm sóc khách hàng đa kênh.',
    primaryCta: { label: 'Đăng ký tư vấn sản phẩm' },
    secondaryCta: { label: 'Xem bảng giá', path: ROUTES.pricing },
  },
  directAnswer: {
    eyebrow: 'Tổng quan',
    question: 'Gcalls có những sản phẩm nào?',
    answer:
      'Gcalls có ba sản phẩm: Gcalls Plus Webphone là kênh nghe gọi và quản lý hoạt động cuộc gọi trên trình duyệt; QA QC Center sử dụng QC Bot AI để hỗ trợ đánh giá chất lượng hội thoại; Gcalls CX là nền tảng chăm sóc khách hàng đa kênh. Ba sản phẩm giải quyết các bài toán khác nhau, không phải ba mức giá của cùng một sản phẩm, và được chọn theo nhu cầu vận hành thực tế của doanh nghiệp.',
  },
  cards: {
    eyebrow: 'BA SẢN PHẨM',
    h2: 'Mỗi sản phẩm giải quyết một bài toán vận hành khác nhau',
    items: [
      {
        title: 'Gcalls Plus Webphone',
        detail:
          'Kênh nghe gọi trên trình duyệt cho đội Sales và CSKH, kèm danh bạ, lịch sử tương tác, ghi chú và theo dõi hoạt động cuộc gọi.',
        points: ['Webphone', 'Call management', 'Interaction history'],
        path: ROUTES.gcallsPlus,
        cta: 'Xem Gcalls Plus Webphone',
      },
      {
        title: 'QA QC Center',
        supportingLabel: 'Powered by QC Bot AI',
        detail:
          'Đưa hội thoại thành dữ liệu có thể đánh giá: transcript, hỗ trợ chấm điểm theo bộ tiêu chí QA và làm nổi bật các tín hiệu cần kiểm tra.',
        points: ['Transcript', 'QA scoring', 'Quality signals'],
        path: ROUTES.qcCenter,
        cta: 'Xem QA QC Center',
      },
      {
        title: 'Gcalls CX',
        detail:
          'Hợp nhất hội thoại từ nhiều kênh giao tiếp vào một màn hình để đội CSKH quản lý yêu cầu và ngữ cảnh khách hàng tập trung hơn.',
        points: ['Omnichannel', 'Ticket', 'Customer context'],
        path: ROUTES.gcallsCx,
        cta: 'Xem Gcalls CX',
      },
    ],
    note: 'Ba sản phẩm có thể dùng độc lập hoặc cùng nhau. Cấu hình phù hợp phụ thuộc vào quy mô đội ngũ, kênh giao tiếp và nhu cầu kiểm soát chất lượng của doanh nghiệp.',
  },
  decisionGuide: {
    eyebrow: 'CHỌN ĐÚNG SẢN PHẨM',
    h2: 'Ranh giới giữa ba sản phẩm',
    lead: 'Nếu bài toán hiện tại thuộc một trong các trường hợp dưới đây, đây là sản phẩm nên xem trước.',
    rows: [
      {
        problem:
          'Đội ngũ cần một kênh nghe gọi ổn định và cần biết ai đã gọi cho khách hàng, khi nào, nội dung ra sao.',
        solution: 'Gcalls Plus Webphone',
        reason:
          'Bài toán nằm ở lớp thực hiện cuộc gọi và quản lý hoạt động nghe gọi hằng ngày.',
        path: ROUTES.gcallsPlus,
      },
      {
        problem:
          'Quản lý cần đánh giá chất lượng hội thoại của đội ngũ nhưng không thể nghe lại toàn bộ cuộc gọi.',
        solution: 'QA QC Center',
        reason:
          'Bài toán nằm ở lớp kiểm soát chất lượng: cần transcript và bộ tiêu chí để đánh giá có hệ thống.',
        path: ROUTES.qcCenter,
      },
      {
        problem:
          'Khách hàng liên hệ qua nhiều kênh khác nhau và đội CSKH phải mở nhiều công cụ để trả lời.',
        solution: 'Gcalls CX',
        reason:
          'Bài toán nằm ở lớp vận hành đa kênh, rộng hơn kênh thoại đơn thuần.',
        path: ROUTES.gcallsCx,
      },
      {
        problem:
          'Doanh nghiệp cần cuộc gọi hoạt động cùng dữ liệu trong CRM, Helpdesk hoặc hệ thống bán hàng đang dùng.',
        solution: 'Xem các giải pháp tích hợp',
        reason:
          'Đây là bài toán giải pháp, không phải chọn sản phẩm: sản phẩm giữ nguyên và được kết nối với hệ thống hiện có.',
        path: ROUTES.solutions,
      },
    ],
  },
  links: {
    h2: 'Xem thêm',
    items: [
      { label: 'Tất cả giải pháp', path: ROUTES.solutions },
      { label: 'Danh mục tích hợp', path: ROUTES.integrations },
      { label: 'Bảng giá Gcalls', path: ROUTES.pricing },
      { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
      { label: 'Giải pháp theo ngành', path: ROUTES.industries },
    ],
  },
  finalCta: {
    eyebrow: 'BẮT ĐẦU',
    h2: 'Chưa rõ sản phẩm nào phù hợp với đội ngũ hiện tại?',
    description:
      'Chia sẻ quy mô đội ngũ, kênh khách hàng đang dùng và hệ thống nội bộ để Gcalls đề xuất sản phẩm và cấu hình phù hợp.',
    primaryCta: { label: 'Đăng ký tư vấn', path: ROUTES.contact },
    secondaryCta: { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
  },
}

/* ------------------------------------------------------------------ *
 * /giai-phap/ — Solution hub
 * ------------------------------------------------------------------ */

/**
 * Four solutions, organised as a decision guide.
 *
 * Sales, Customer Service and Quality Assurance are deliberately NOT routes
 * (see the scope note at the head of `src/config/sitemap.ts`). They appear in
 * the decision guide as ways of describing a need, each mapping onto real
 * pages, without minting pages that would compete for the same queries.
 */
export const SOLUTIONS_HUB: HubContent = {
  id: 'solutions',
  route: ROUTES.solutions,
  breadcrumbLabel: 'Giải pháp',
  lead: { intent: 'consultation', source: 'consultation' },
  hero: {
    eyebrow: 'GIẢI PHÁP GCALLS',
    h1: 'Giải pháp giao tiếp theo bài toán vận hành của doanh nghiệp',
    description:
      'Giải pháp Gcalls được tổ chức theo bài toán thực tế, không theo danh sách tính năng: kết nối cuộc gọi với hệ thống doanh nghiệp đang dùng, và thiết lập liên lạc cho các thị trường doanh nghiệp cần phục vụ.',
    primaryCta: { label: 'Đăng ký tư vấn giải pháp' },
    secondaryCta: { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
  },
  directAnswer: {
    eyebrow: 'Tổng quan',
    question: 'Giải pháp Gcalls gồm những gì?',
    answer:
      'Gcalls có bốn nhóm giải pháp. Ba nhóm đầu là tích hợp hệ thống: kết nối tổng đài với CRM, với Helpdesk và với hệ thống bán hàng/POS, để cuộc gọi hoạt động cùng dữ liệu và quy trình doanh nghiệp đang sử dụng. Nhóm thứ tư là tổng đài quốc tế, dành cho doanh nghiệp cần đầu số và cấu hình liên lạc tại thị trường nước ngoài. Phạm vi triển khai của mỗi giải pháp được xác định theo hệ thống, dữ liệu và quy định thực tế.',
  },
  cards: {
    eyebrow: 'BỐN NHÓM GIẢI PHÁP',
    h2: 'Chọn theo hệ thống và thị trường doanh nghiệp đang vận hành',
    items: [
      {
        title: 'Tổng đài tích hợp CRM',
        detail:
          'Kết nối cuộc gọi với dữ liệu và workflow bán hàng: gọi trực tiếp từ hệ thống, nhận diện khách hàng và ghi nhận lịch sử tương tác theo cấu hình.',
        points: ['Click-to-Call', 'Customer context', 'Lead workflow'],
        path: ROUTES.crmIntegration,
        cta: 'Xem tích hợp CRM',
      },
      {
        title: 'Tổng đài tích hợp Helpdesk',
        detail:
          'Đưa hoạt động nghe gọi vào quy trình hỗ trợ và ticket để đội CSKH xử lý yêu cầu với ngữ cảnh đầy đủ hơn.',
        points: ['Ticket workflow', 'Support context', 'Lịch sử hỗ trợ'],
        path: ROUTES.helpdeskIntegration,
        cta: 'Xem tích hợp Helpdesk',
      },
      {
        title: 'Tổng đài tích hợp POS',
        detail:
          'Kết nối cuộc gọi với dữ liệu khách hàng và thông tin bán hàng phù hợp để đội ngũ có thêm context khi tư vấn hoặc chăm sóc sau mua.',
        points: ['Customer context', 'Sales data', 'Follow-up'],
        path: ROUTES.posIntegration,
        cta: 'Xem tích hợp POS',
      },
      {
        title: 'Tổng đài quốc tế',
        detail:
          'Thiết lập đầu số và cấu hình liên lạc cho thị trường nước ngoài, kèm khảo sát thủ tục và hồ sơ theo quy định từng quốc gia.',
        points: ['Đầu số quốc tế', 'Inbound / Outbound', 'Hồ sơ đăng ký'],
        path: ROUTES.internationalCalling,
        cta: 'Xem tổng đài quốc tế',
      },
    ],
    note: 'Các giải pháp trên đều triển khai cùng lớp nghe gọi của Gcalls. Phạm vi dữ liệu, khả năng kết nối và điều kiện triển khai được Gcalls xác nhận theo hệ thống và thị trường thực tế của doanh nghiệp.',
  },
  decisionGuide: {
    eyebrow: 'BÀI TOÁN → GIẢI PHÁP',
    h2: 'Bắt đầu từ bài toán của đội ngũ',
    lead: 'Sales, Customer Service và Quality Assurance là cách mô tả nhu cầu vận hành. Mỗi nhu cầu được giải quyết bằng sản phẩm và giải pháp tương ứng.',
    rows: [
      {
        problem:
          'Sales — đội ngũ gọi ra nhiều, quản lý lead và cần theo dõi follow-up trên dữ liệu khách hàng.',
        solution: 'Tổng đài tích hợp CRM',
        reason:
          'Cuộc gọi cần gắn với lead và contact trong CRM, cùng lớp nghe gọi của Gcalls Plus.',
        path: ROUTES.crmIntegration,
      },
      {
        problem:
          'Customer Service — tiếp nhận và xử lý yêu cầu khách hàng, cần ngữ cảnh đầy đủ cho từng lần liên hệ.',
        solution: 'Tổng đài tích hợp Helpdesk',
        reason:
          'Cuộc gọi cần nằm trong quy trình ticket. Nếu khách hàng liên hệ qua nhiều kênh, xem thêm Gcalls CX.',
        path: ROUTES.helpdeskIntegration,
      },
      {
        problem:
          'Quality Assurance — cần đánh giá và kiểm soát chất lượng hội thoại của đội ngũ một cách có hệ thống.',
        solution: 'QA QC Center',
        reason:
          'Đây là bài toán sản phẩm, không phải tích hợp: cần transcript và bộ tiêu chí để chấm điểm.',
        path: ROUTES.qcCenter,
      },
      {
        problem:
          'Mở rộng thị trường — doanh nghiệp cần khách hàng ở nước ngoài liên hệ được và đội ngũ gọi ra tới các thị trường đó.',
        solution: 'Tổng đài quốc tế',
        reason:
          'Bài toán nằm ở đầu số và quy định từng quốc gia, cần khảo sát trước khi triển khai.',
        path: ROUTES.internationalCalling,
      },
    ],
    note: 'Nếu doanh nghiệp có nhiều bài toán cùng lúc, các giải pháp trên có thể triển khai kết hợp. Gcalls xác định thứ tự ưu tiên trong quá trình khảo sát.',
  },
  links: {
    h2: 'Xem thêm',
    items: [
      { label: 'Tất cả sản phẩm', path: ROUTES.products },
      { label: 'Danh mục tích hợp', path: ROUTES.integrations },
      { label: 'Giải pháp theo ngành', path: ROUTES.industries },
      { label: 'Bảng giá Gcalls', path: ROUTES.pricing },
      { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
    ],
  },
  finalCta: {
    eyebrow: 'BẮT ĐẦU',
    h2: 'Cần xác định giải pháp phù hợp với hệ thống hiện tại?',
    description:
      'Chia sẻ hệ thống doanh nghiệp đang sử dụng, quy mô đội ngũ và thị trường cần phục vụ để Gcalls đề xuất phạm vi triển khai phù hợp.',
    primaryCta: { label: 'Đăng ký tư vấn', path: ROUTES.contact },
    secondaryCta: { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
  },
}

/* ------------------------------------------------------------------ *
 * /tich-hop/ — Integration hub
 * ------------------------------------------------------------------ */

/**
 * Exactly the five platforms with a route in the locked sitemap.
 *
 * Names only. No logo, no partnership or certification wording, and the note
 * states that scope differs per platform — which is what stops the grid from
 * reading as "everything works identically everywhere".
 */
export const INTEGRATIONS_HUB: HubContent = {
  id: 'integrations',
  route: ROUTES.integrations,
  breadcrumbLabel: 'Tích hợp',
  lead: { intent: 'integration', source: 'consultation' },
  hero: {
    eyebrow: 'TÍCH HỢP GCALLS',
    h1: 'Kết nối Gcalls với hệ thống doanh nghiệp đang sử dụng',
    description:
      'Gcalls có thể kết nối với các hệ thống doanh nghiệp đang dùng để đưa cuộc gọi và ngữ cảnh khách hàng vào workflow hiện tại, thay vì buộc đội ngũ chuyển sang một công cụ mới.',
    primaryCta: { label: 'Tư vấn tích hợp' },
    secondaryCta: { label: 'Xem tất cả giải pháp', path: ROUTES.solutions },
  },
  directAnswer: {
    eyebrow: 'Tổng quan',
    question: 'Gcalls tích hợp được với những hệ thống nào?',
    answer:
      'Gcalls hướng tới kết nối tổng đài với hai nhóm hệ thống chính: CRM, nơi đội Sales quản lý lead và khách hàng, và Helpdesk, nơi đội CSKH xử lý ticket. Ngoài ra còn có hệ thống bán hàng/POS theo phạm vi triển khai. Khả năng kết nối và phạm vi dữ liệu khác nhau giữa các nền tảng, phụ thuộc vào API, quyền truy cập và cấu hình thực tế, nên Gcalls xác nhận phạm vi theo hệ thống cụ thể của doanh nghiệp.',
  },
  cards: {
    eyebrow: 'NỀN TẢNG',
    h2: 'Các nền tảng đang có trang tích hợp riêng',
    lead: 'Mỗi trang mô tả phạm vi kết nối với nền tảng tương ứng. Danh sách này là các nền tảng đang được trình bày trên website, không phải danh sách đầy đủ mọi hệ thống có thể kết nối.',
    items: [
      {
        title: 'HubSpot',
        supportingLabel: 'CRM',
        detail:
          'Đưa hoạt động nghe gọi vào workflow dữ liệu khách hàng trong HubSpot.',
        path: ROUTES.hubspot,
        cta: 'Xem tích hợp HubSpot',
      },
      {
        title: 'Salesforce',
        supportingLabel: 'CRM',
        detail:
          'Đưa hoạt động nghe gọi vào workflow dữ liệu khách hàng trong Salesforce.',
        path: ROUTES.salesforce,
        cta: 'Xem tích hợp Salesforce',
      },
      {
        title: 'Zoho CRM',
        supportingLabel: 'CRM',
        detail:
          'Đưa hoạt động nghe gọi vào workflow dữ liệu khách hàng trong Zoho CRM.',
        path: ROUTES.zohoCrm,
        cta: 'Xem tích hợp Zoho CRM',
      },
      {
        title: 'Freshdesk',
        supportingLabel: 'Helpdesk',
        detail: 'Gắn hoạt động nghe gọi vào quy trình hỗ trợ và ticket Freshdesk.',
        path: ROUTES.freshdesk,
        cta: 'Xem tích hợp Freshdesk',
      },
      {
        title: 'Zendesk',
        supportingLabel: 'Helpdesk',
        detail: 'Gắn hoạt động nghe gọi vào quy trình hỗ trợ và ticket Zendesk.',
        path: ROUTES.zendesk,
        cta: 'Xem tích hợp Zendesk',
      },
    ],
    note: 'Tên nền tảng ở đây chỉ để mô tả hệ thống doanh nghiệp có thể đang sử dụng. Khả năng kết nối, trường dữ liệu và hành vi cụ thể có thể khác nhau giữa các nền tảng, và được Gcalls xác nhận theo hệ thống thực tế trước khi triển khai.',
  },
  decisionGuide: {
    eyebrow: 'BẮT ĐẦU TỪ LOẠI HỆ THỐNG',
    h2: 'Nếu chưa rõ nên bắt đầu từ đâu',
    lead: 'Trang tổng quan theo loại hệ thống mô tả cách tích hợp hoạt động, trước khi đi vào từng nền tảng cụ thể.',
    rows: [
      {
        problem:
          'Đội Sales làm việc quanh lead, contact và pipeline trong một CRM.',
        solution: 'Tổng quan tích hợp CRM',
        reason:
          'Mô tả luồng Click-to-Call, nhận diện khách hàng và ghi nhận lịch sử tương tác.',
        path: ROUTES.crmIntegration,
      },
      {
        problem: 'Đội CSKH làm việc quanh ticket và quy trình xử lý yêu cầu.',
        solution: 'Tổng quan tích hợp Helpdesk',
        reason: 'Mô tả cách cuộc gọi gắn vào ticket và lịch sử hỗ trợ.',
        path: ROUTES.helpdeskIntegration,
      },
      {
        problem:
          'Doanh nghiệp có hoạt động bán lẻ hoặc thương mại và dữ liệu nằm ở hệ thống bán hàng.',
        solution: 'Tổng quan tích hợp POS',
        reason: 'Mô tả cách customer context và dữ liệu bán hàng đến gần cuộc gọi.',
        path: ROUTES.posIntegration,
      },
      {
        problem:
          'Hệ thống doanh nghiệp đang dùng không nằm trong danh sách nền tảng ở trên.',
        solution: 'Trao đổi với Gcalls',
        reason:
          'Khả năng kết nối phụ thuộc vào API và quyền truy cập của hệ thống đó, cần khảo sát kỹ thuật để xác định.',
        path: ROUTES.contact,
      },
    ],
  },
  links: {
    h2: 'Xem thêm',
    items: [
      { label: 'Tất cả giải pháp', path: ROUTES.solutions },
      { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
      { label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling },
      { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
      { label: 'Bảng giá Gcalls', path: ROUTES.pricing },
    ],
  },
  finalCta: {
    eyebrow: 'TÍCH HỢP',
    h2: 'Cho Gcalls biết hệ thống doanh nghiệp đang sử dụng',
    description:
      'Chia sẻ nền tảng hiện tại, dữ liệu cần dùng trong cuộc gọi và quy trình đội ngũ để Gcalls xác định phạm vi tích hợp khả thi.',
    primaryCta: { label: 'Đăng ký tư vấn tích hợp', path: ROUTES.contact },
    secondaryCta: { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
  },
}

/* ------------------------------------------------------------------ *
 * /nganh/ — Industry hub
 * ------------------------------------------------------------------ */

/**
 * Six industries, each stated as problem → destination.
 *
 * The card text describes an operating CONTEXT, never a result. No industry
 * benchmark, conversion figure or customer count appears, because none is
 * evidenced.
 */
export const INDUSTRIES_HUB: HubContent = {
  id: 'industries',
  route: ROUTES.industries,
  breadcrumbLabel: 'Theo ngành',
  lead: { intent: 'consultation', source: 'consultation' },
  hero: {
    eyebrow: 'THEO NGÀNH',
    h1: 'Giải pháp giao tiếp theo bối cảnh vận hành của từng ngành',
    description:
      'Mỗi ngành có cách làm việc với khách hàng khác nhau: số lần liên hệ, thông tin cần sẵn có và yêu cầu kiểm soát chất lượng đều không giống nhau. Các trang dưới đây mô tả cách Gcalls được áp dụng theo từng bối cảnh.',
    primaryCta: { label: 'Đăng ký tư vấn theo ngành' },
    secondaryCta: { label: 'Xem tất cả giải pháp', path: ROUTES.solutions },
  },
  directAnswer: {
    eyebrow: 'Tổng quan',
    question: 'Gcalls phù hợp với những ngành nào?',
    answer:
      'Gcalls phù hợp với doanh nghiệp có hoạt động liên hệ khách hàng thường xuyên qua điện thoại và cần theo dõi lịch sử trao đổi. Website hiện trình bày sáu bối cảnh ngành: giáo dục, tài chính, bảo hiểm, bất động sản, thương mại điện tử và BPO. Sản phẩm và giải pháp được chọn theo bài toán vận hành của ngành đó, không phải theo một cấu hình mặc định.',
  },
  cards: {
    eyebrow: 'SÁU BỐI CẢNH NGÀNH',
    h2: 'Bài toán của ngành và hướng giải quyết tương ứng',
    items: [
      {
        title: 'Giáo dục',
        detail:
          'Tư vấn tuyển sinh cần theo dõi nhiều lần trao đổi với người quan tâm và giữ lại thông tin để follow-up.',
        points: ['Gcalls Plus', 'Tích hợp CRM'],
        path: ROUTES.education,
        cta: 'Xem giải pháp cho giáo dục',
      },
      {
        title: 'Tài chính',
        detail:
          'Hoạt động liên hệ khách hàng cần quy trình rõ ràng và lịch sử tương tác đầy đủ cho mục đích quản lý nội bộ.',
        points: ['Gcalls Plus', 'QA QC Center'],
        path: ROUTES.finance,
        cta: 'Xem giải pháp cho tài chính',
      },
      {
        title: 'Bảo hiểm',
        detail:
          'Vòng đời hợp đồng gắn với nhiều lần trao đổi, đòi hỏi ngữ cảnh khách hàng luôn sẵn có khi liên hệ.',
        points: ['Gcalls Plus', 'QA QC Center'],
        path: ROUTES.insurance,
        cta: 'Xem giải pháp cho bảo hiểm',
      },
      {
        title: 'Bất động sản',
        detail:
          'Đội ngũ làm việc với lượng lead lớn và cần theo dõi trạng thái liên hệ của từng khách hàng.',
        points: ['Gcalls Plus', 'Tích hợp CRM'],
        path: ROUTES.realEstate,
        cta: 'Xem giải pháp cho bất động sản',
      },
      {
        title: 'Thương mại điện tử',
        detail:
          'Phát sinh nhiều cuộc gọi liên quan tới đơn hàng, đổi trả và hỗ trợ sau bán.',
        points: ['Tích hợp POS', 'Gcalls CX'],
        path: ROUTES.ecommerce,
        cta: 'Xem giải pháp cho thương mại điện tử',
      },
      {
        title: 'BPO',
        detail:
          'Vận hành nhiều nhóm agent theo từng dự án, cần theo dõi hoạt động và chất lượng cuộc gọi tập trung.',
        points: ['Gcalls CX', 'QA QC Center'],
        path: ROUTES.bpo,
        cta: 'Xem giải pháp cho BPO',
      },
    ],
    note: 'Các nhãn sản phẩm trên mỗi thẻ là hướng thường phù hợp với bối cảnh ngành đó, không phải cấu hình bắt buộc. Cấu hình cuối cùng được xác định theo quy trình và hệ thống thực tế của doanh nghiệp.',
  },
  links: {
    h2: 'Xem thêm',
    items: [
      { label: 'Tất cả sản phẩm', path: ROUTES.products },
      { label: 'Tất cả giải pháp', path: ROUTES.solutions },
      { label: 'Danh mục tích hợp', path: ROUTES.integrations },
      { label: 'Case Studies', path: ROUTES.caseStudies },
      { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
    ],
  },
  finalCta: {
    eyebrow: 'THEO NGÀNH',
    h2: 'Trao đổi về bối cảnh vận hành của doanh nghiệp',
    description:
      'Mỗi doanh nghiệp trong cùng một ngành vẫn vận hành khác nhau. Chia sẻ quy trình hiện tại để Gcalls đề xuất cấu hình phù hợp.',
    primaryCta: { label: 'Đăng ký tư vấn', path: ROUTES.contact },
    secondaryCta: { label: 'Xem bảng giá', path: ROUTES.pricing },
  },
}

/* ------------------------------------------------------------------ *
 * /tai-nguyen/ — Resource hub
 * ------------------------------------------------------------------ */

/**
 * Six resource categories.
 *
 * NO content count, NO article title and NO publication date is claimed. Cards
 * describe what each category is FOR. Where nothing is published yet, the copy
 * says the content is being edited — the same honest wording the approved
 * sitemap intros use.
 */
export const RESOURCES_HUB: HubContent = {
  id: 'resources',
  route: ROUTES.resources,
  breadcrumbLabel: 'Tài nguyên',
  lead: { intent: 'product_information', source: 'consultation' },
  hero: {
    eyebrow: 'TÀI NGUYÊN',
    h1: 'Kiến thức về Call Center, CRM, CX và AI cho đội ngũ vận hành',
    description:
      'Nơi tập hợp nội dung Gcalls biên tập cho đội Sales, CSKH và QA: cách tổ chức hoạt động nghe gọi, cách kết nối hệ thống, và cách kiểm soát chất lượng hội thoại.',
    primaryCta: { label: 'Đăng ký tư vấn' },
    secondaryCta: { label: 'Xem tất cả sản phẩm', path: ROUTES.products },
  },
  directAnswer: {
    eyebrow: 'Tổng quan',
    question: 'Trung tâm tài nguyên Gcalls có những gì?',
    answer:
      'Trung tâm tài nguyên được chia thành sáu danh mục theo mục đích sử dụng: Blog cho góc nhìn vận hành, Guides cho hướng dẫn thực hành, Case Studies cho câu chuyện triển khai, Ebook cho tài liệu chuyên sâu, Glossary cho thuật ngữ và FAQ cho câu hỏi thường gặp. Nội dung đang được biên tập và sẽ được đăng tải theo từng danh mục.',
  },
  cards: {
    eyebrow: 'SÁU DANH MỤC',
    h2: 'Chọn danh mục theo mục đích đang cần',
    items: [
      {
        title: 'Blog',
        detail:
          'Góc nhìn về vận hành Call Center, tích hợp hệ thống và chăm sóc khách hàng.',
        points: ['Đang biên tập'],
        path: ROUTES.blog,
        cta: 'Xem Blog',
      },
      {
        title: 'Guides',
        detail:
          'Hướng dẫn thực hành về triển khai tổng đài và tổ chức quy trình nghe gọi.',
        points: ['Đang biên tập'],
        path: ROUTES.guides,
        cta: 'Xem Guides',
      },
      {
        title: 'Case Studies',
        detail:
          'Câu chuyện triển khai thực tế, đăng tải khi có nội dung được duyệt công bố.',
        points: ['Chờ duyệt công bố'],
        path: ROUTES.caseStudies,
        cta: 'Xem Case Studies',
      },
      {
        title: 'Ebook',
        detail:
          'Tài liệu chuyên sâu về tổ chức hoạt động giao tiếp với khách hàng.',
        points: ['Đang biên tập'],
        path: ROUTES.ebook,
        cta: 'Xem Ebook',
      },
      {
        title: 'Glossary',
        detail:
          'Giải thích ngắn gọn các thuật ngữ thường gặp trong Call Center, CRM và CX.',
        points: ['Đang biên tập'],
        path: ROUTES.glossary,
        cta: 'Xem Glossary',
      },
      {
        title: 'FAQ',
        detail:
          'Câu hỏi thường gặp về sản phẩm, giải pháp, tích hợp và chi phí, tổng hợp theo chủ đề.',
        points: ['Đang biên tập'],
        path: ROUTES.faq,
        cta: 'Xem FAQ',
      },
    ],
    note: 'Các trang sản phẩm và giải pháp đều có phần FAQ riêng theo chủ đề, nên đó thường là nơi trả lời nhanh nhất cho câu hỏi về một sản phẩm cụ thể.',
  },
  links: {
    h2: 'Trong lúc chờ nội dung, có thể xem',
    items: [
      { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
      { label: 'QA QC Center', path: ROUTES.qcCenter },
      { label: 'Gcalls CX', path: ROUTES.gcallsCx },
      { label: 'Tất cả giải pháp', path: ROUTES.solutions },
      { label: 'Bảng giá Gcalls', path: ROUTES.pricing },
    ],
  },
  finalCta: {
    eyebrow: 'TÀI NGUYÊN',
    h2: 'Có câu hỏi chưa được trả lời trong tài nguyên?',
    description:
      'Gửi câu hỏi cho đội ngũ Gcalls. Nếu là câu hỏi nhiều doanh nghiệp cùng quan tâm, nội dung sẽ được bổ sung vào trung tâm tài nguyên.',
    primaryCta: { label: 'Đặt câu hỏi cho Gcalls', path: ROUTES.contact },
    secondaryCta: { label: 'Xem bảng giá', path: ROUTES.pricing },
  },
}

/* ------------------------------------------------------------------ *
 * /cong-ty/ — Company hub
 * ------------------------------------------------------------------ */

/**
 * Corporate overview built only from what this repository can support.
 *
 * WITHHELD: years in business, customer count, number of supported CRMs,
 * country coverage, headcount, funding, awards, certifications, named
 * customers and any logo wall. None of these is verified here.
 *
 * What replaces them is substance a reader can actually check against the rest
 * of the site: what Gcalls builds, who it is for, and how it works with a
 * customer. That is credible without being unverifiable.
 */
export const COMPANY_HUB: HubContent = {
  id: 'company',
  route: ROUTES.company,
  breadcrumbLabel: 'Về Gcalls',
  lead: { intent: 'consultation', source: 'contact' },
  hero: {
    eyebrow: 'VỀ GCALLS',
    h1: 'Gcalls xây dựng nền tảng giao tiếp cho doanh nghiệp Việt Nam',
    description:
      'Gcalls phát triển nền tảng giúp doanh nghiệp kết nối cuộc gọi với dữ liệu khách hàng và quy trình vận hành, để hoạt động liên hệ khách hàng được tổ chức và theo dõi rõ ràng hơn.',
    primaryCta: { label: 'Liên hệ đội ngũ Gcalls' },
    secondaryCta: { label: 'Xem tất cả sản phẩm', path: ROUTES.products },
  },
  directAnswer: {
    eyebrow: 'Tổng quan',
    question: 'Gcalls là công ty gì?',
    answer:
      'Gcalls là đơn vị phát triển nền tảng giao tiếp doanh nghiệp, tập trung vào tổng đài trên trình duyệt và việc kết nối hoạt động nghe gọi với hệ thống doanh nghiệp đang sử dụng như CRM, Helpdesk và hệ thống bán hàng. Sản phẩm của Gcalls dành cho đội Sales, đội chăm sóc khách hàng và đội kiểm soát chất lượng — những nhóm cần cuộc gọi gắn với dữ liệu, không chỉ cần một thiết bị để gọi.',
  },
  cards: {
    eyebrow: 'CÁCH GCALLS LÀM VIỆC',
    h2: 'Ba nguyên tắc trong cách Gcalls xây dựng và triển khai sản phẩm',
    items: [
      {
        title: 'Cuộc gọi gắn với dữ liệu',
        detail:
          'Gcalls không xem cuộc gọi là một hoạt động tách rời. Sản phẩm được thiết kế để hoạt động nghe gọi nằm cùng dữ liệu khách hàng và quy trình đội ngũ đang dùng.',
        path: ROUTES.products,
        cta: 'Xem sản phẩm',
      },
      {
        title: 'Triển khai theo hệ thống thực tế',
        detail:
          'Mỗi doanh nghiệp có hệ thống, quyền truy cập và quy trình khác nhau. Gcalls khảo sát trước khi xác nhận phạm vi triển khai, thay vì áp một cấu hình mặc định.',
        path: ROUTES.solutions,
        cta: 'Xem giải pháp',
      },
      {
        title: 'Nói rõ phạm vi trước khi cam kết',
        detail:
          'Khả năng tích hợp, dữ liệu khả dụng và điều kiện triển khai được xác nhận theo từng trường hợp, và được nêu rõ trước khi doanh nghiệp ra quyết định.',
        path: ROUTES.contact,
        cta: 'Trao đổi với Gcalls',
      },
    ],
  },
  decisionGuide: {
    eyebrow: 'TÌM HIỂU THÊM',
    h2: 'Các trang thông tin về Gcalls',
    rows: [
      {
        problem: 'Muốn biết doanh nghiệp nào đang sử dụng Gcalls.',
        solution: 'Khách hàng',
        reason:
          'Thông tin khách hàng được đăng tải khi có nội dung được duyệt công bố.',
        path: ROUTES.customers,
      },
      {
        problem:
          'Là đơn vị triển khai, tư vấn hoặc tích hợp hệ thống và muốn hợp tác.',
        solution: 'Đối tác',
        reason: 'Thông tin về chương trình hợp tác triển khai và tích hợp.',
        path: ROUTES.partners,
      },
      {
        problem: 'Muốn giới thiệu Gcalls tới doanh nghiệp có nhu cầu.',
        solution: 'Chương trình giới thiệu',
        reason:
          'Dành cho cá nhân và tổ chức muốn giới thiệu giải pháp. Điều khoản được trao đổi trực tiếp.',
        path: ROUTES.referral,
      },
      {
        problem: 'Cần trao đổi trực tiếp với đội ngũ Gcalls.',
        solution: 'Liên hệ',
        reason: 'Gửi thông tin nhu cầu hoặc liên hệ qua email và số điện thoại.',
        path: ROUTES.contact,
      },
    ],
  },
  links: {
    h2: 'Xem thêm',
    items: [
      { label: 'Khách hàng', path: ROUTES.customers },
      { label: 'Đối tác', path: ROUTES.partners },
      { label: 'Liên hệ', path: ROUTES.contact },
      { label: 'Tài nguyên', path: ROUTES.resources },
      { label: 'Bảng giá Gcalls', path: ROUTES.pricing },
    ],
  },
  finalCta: {
    eyebrow: 'LIÊN HỆ',
    h2: 'Trao đổi với Gcalls về bài toán giao tiếp của doanh nghiệp',
    description:
      'Chia sẻ quy mô đội ngũ, hệ thống đang sử dụng và nhu cầu hiện tại để đội ngũ Gcalls có thông tin trước khi trao đổi.',
    primaryCta: { label: 'Liên hệ Gcalls', path: ROUTES.contact },
    secondaryCta: { label: 'Xem bảng giá', path: ROUTES.pricing },
  },
}
