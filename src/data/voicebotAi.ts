/**
 * Approved content for /voicebot-ai/ — Gcalls Voicebot AI.
 *
 * ---------------------------------------------------------------------------
 * SCOPE REVERSAL — READ FIRST
 * ---------------------------------------------------------------------------
 * `src/config/sitemap.ts` previously recorded Voicebot as deliberately OUT OF
 * SCOPE. Checkpoint WEB-PRO-004 reverses that decision and publishes the page.
 * The reversal is a product decision, not new evidence: this repository still
 * contains no Voicebot product config, estimator field, screenshot or scope
 * document. Everything below therefore comes from the WEB-PRO-004 brief's
 * approved positioning and nothing else.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING (WEB-PRO-004 §5)
 * ---------------------------------------------------------------------------
 * The following must NEVER appear on this page without written product
 * confirmation. Every one of them is currently UNVERIFIED:
 *   · "tiết kiệm 1.200 giờ/tháng" or any hour/cost saving figure
 *   · "giảm 30% vắng hẹn" or any percentage outcome
 *   · "giọng nói tự nhiên đa vùng miền"
 *   · speech-recognition accuracy of any kind
 *   · number of concurrent calls
 *   · number of supported languages
 *   · "hoạt động 24/7" with an SLA
 *   · "thay thế hoàn toàn nhân viên telesales"
 *   · a named CRM with an out-of-the-box Voicebot connector
 *   · inbound/outbound support as a guarantee
 *   · a fixed deployment duration
 *   · the name of the underlying voice/AI technology vendor
 *
 * Allowed register: "có thể", "được khảo sát", "theo kịch bản đã thiết lập",
 * "tùy phạm vi triển khai", "trong quá trình tư vấn".
 *
 * POSITIONING. Gcalls is presented as the party that CONSULTS, CONNECTS and
 * INTEGRATES a Voicebot solution into the customer's operation. The page never
 * asserts that Gcalls built the Voicebot engine itself — the repository does
 * not establish that.
 *
 * BOUNDARIES. This page owns automated outbound-style call tasks only. AI call
 * quality assurance belongs to /qc-bot-ai/, omnichannel conversations to
 * /gcalls-cx/, and deep CRM call workflow to /tong-dai-tich-hop-crm/.
 * ---------------------------------------------------------------------------
 */

import { ROUTES } from '@/config/navigation'

/**
 * Conversion context for Voicebot AI CTAs.
 *
 * The brief proposed `intent=voicebot_consultation`, `source_page=voicebot-ai`
 * and `product=voicebot-ai`. This project already has a tracking standard
 * (`src/lib/leads/ctaLink.ts`), and §7 of the brief says not to invent a second
 * one — so the same three facts are carried in the existing typed slots:
 *
 *   intent  → 'consultation'        — an existing `LeadIntent` member
 *   source  → 'voicebot_ai'         — a new `LeadSource` member; every product
 *                                     page has its own (gcalls_plus,
 *                                     qa_qc_center, gcalls_cx), so this is the
 *                                     established shape, not a new mechanism
 *   product → 'Gcalls Voicebot AI'  — also added to LEAD_NEEDS so the contact
 *                                     form's "Nhu cầu" select pre-selects it
 *
 * `sourcePath` is captured by `normalizeLeadPayload` from the live pathname, so
 * the origin page is recorded without a bespoke `source_page` parameter.
 */
export const VB_CONSULT_LEAD = {
  intent: 'consultation',
  source: 'voicebot_ai',
  product: 'Gcalls Voicebot AI',
} as const

/* ── 01 · Hero ──────────────────────────────────────────────────── */

export const VB_HERO = {
  eyebrow: 'VOICEBOT AI CHO DOANH NGHIỆP',
  h1: 'Tự động hóa các cuộc gọi lặp lại bằng Voicebot AI',
  description:
    'Gcalls giúp doanh nghiệp triển khai Voicebot cho các tác vụ như nhắc lịch, xác nhận thông tin, sàng lọc nhu cầu và xử lý bước đầu ngoài giờ — để đội ngũ tập trung vào những tương tác cần chuyên môn và sự thấu hiểu của con người.',
  primaryCta: { label: 'Đăng ký tư vấn Voicebot' },
  secondaryCta: {
    label: 'Khám phá tình huống ứng dụng',
    href: '#tinh-huong-ung-dung',
  },
  microcopy:
    'Gcalls khảo sát quy trình, tư vấn phương án và xác định phạm vi tích hợp phù hợp với hệ thống hiện tại của doanh nghiệp.',
} as const

/* ── 02 · Operational problem ───────────────────────────────────── */

export const VB_PROBLEMS = {
  eyebrow: 'BÀI TOÁN VẬN HÀNH',
  h2: 'Khi những cuộc gọi lặp lại chiếm quá nhiều nguồn lực',
  description:
    'Nhiều đội ngũ đang dùng cùng một nguồn lực cho hai loại cuộc gọi rất khác nhau: những cuộc gọi có kịch bản cố định và những cuộc trao đổi cần tư vấn thật sự.',
  items: [
    {
      n: '01',
      title: 'Thời gian dồn vào các cuộc gọi có kịch bản giống nhau',
      detail:
        'Nhắc lịch, xác nhận thông tin hay nhắc thanh toán thường lặp lại gần như nguyên vẹn ở mỗi cuộc gọi, nhưng vẫn cần nhân viên thực hiện thủ công từng cuộc.',
    },
    {
      n: '02',
      title: 'Khó mở rộng số lượng cuộc gọi trong giai đoạn cao điểm',
      detail:
        'Khi chiến dịch cần liên hệ một lượng lớn khách hàng trong thời gian ngắn, khối lượng cuộc gọi bị giới hạn bởi số nhân sự đang có mặt.',
    },
    {
      n: '03',
      title: 'Ít thời gian còn lại cho khách hàng cần tư vấn chuyên sâu',
      detail:
        'Những tình huống cần giải thích, thương lượng hoặc xử lý khiếu nại là nơi nhân viên tạo ra giá trị rõ nhất, nhưng lại thường bị chia sẻ nguồn lực với các cuộc gọi thủ tục.',
    },
  ],
} as const

/* ── 03 · Use cases ─────────────────────────────────────────────── */

/**
 * The six use cases named in the brief §4. No seventh scenario is added, and
 * none of them is described as running without configuration or testing.
 */
export const VB_USE_CASES = {
  anchorId: 'tinh-huong-ung-dung',
  eyebrow: 'TÌNH HUỐNG ỨNG DỤNG',
  h2: 'Những tình huống cuộc gọi có thể cân nhắc đưa vào Voicebot',
  description:
    'Voicebot phù hợp nhất với các cuộc gọi có mục tiêu rõ ràng và kịch bản ổn định. Mỗi tình huống dưới đây cần được xem xét theo quy trình và dữ liệu thực tế của doanh nghiệp trước khi triển khai.',
  items: [
    {
      n: '01',
      title: 'Nhắc lịch hẹn',
      detail:
        'Gọi nhắc khách hàng về lịch hẹn đã đặt và ghi nhận phản hồi xác nhận, dời lịch hoặc cần liên hệ lại.',
    },
    {
      n: '02',
      title: 'Nhắc thanh toán',
      detail:
        'Thực hiện các cuộc gọi nhắc kỳ thanh toán theo kịch bản đã được doanh nghiệp duyệt, với nội dung và thời điểm do doanh nghiệp quy định.',
    },
    {
      n: '03',
      title: 'Xác nhận thông tin',
      detail:
        'Xác nhận đơn hàng, lịch giao nhận hoặc thông tin giao dịch, và ghi nhận kết quả xác nhận để chuyển sang bước xử lý tiếp theo.',
    },
    {
      n: '04',
      title: 'Sàng lọc nhu cầu',
      detail:
        'Liên hệ data thô để xác định mức độ quan tâm trước khi chuyển những trường hợp phù hợp cho nhân viên tư vấn.',
    },
    {
      n: '05',
      title: 'Chiến dịch gọi hàng loạt',
      detail:
        'Thực hiện các cuộc gọi lặp lại theo chiến dịch với cùng một kịch bản, thay vì phân bổ toàn bộ danh sách cho đội ngũ.',
    },
    {
      n: '06',
      title: 'Xử lý bước đầu ngoài giờ',
      detail:
        'Tiếp nhận và ghi nhận nhu cầu ở bước đầu tiên ngoài khung giờ làm việc, sau đó chuyển lại cho đội ngũ xử lý trong giờ hành chính.',
    },
  ],
} as const

/* ── 04 · How it works ──────────────────────────────────────────── */

/**
 * Six steps. Steps 1, 2, 5 and 6 are explicitly human-owned in the copy — the
 * page must not read as if a campaign configures and improves itself.
 */
export const VB_HOW_IT_WORKS = {
  eyebrow: 'QUY TRÌNH HOẠT ĐỘNG',
  h2: 'Một chiến dịch Voicebot diễn ra như thế nào',
  description:
    'Quy trình dưới đây mô tả cách một chiến dịch được chuẩn bị và vận hành. Việc bước nào được tự động hóa đến đâu phụ thuộc vào phạm vi triển khai được thống nhất với doanh nghiệp.',
  steps: [
    {
      n: '01',
      title: 'Xác định mục tiêu chiến dịch',
      detail:
        'Doanh nghiệp và Gcalls thống nhất chiến dịch cần đạt điều gì: nhắc lịch, xác nhận, sàng lọc hay thu thập phản hồi.',
    },
    {
      n: '02',
      title: 'Chuẩn bị dữ liệu và kịch bản',
      detail:
        'Danh sách liên hệ và nội dung hội thoại được doanh nghiệp chuẩn bị, rà soát và duyệt trước khi đưa vào chiến dịch.',
    },
    {
      n: '03',
      title: 'Voicebot thực hiện cuộc gọi',
      detail:
        'Các cuộc gọi được thực hiện theo kịch bản và cấu hình đã thiết lập cho chiến dịch.',
    },
    {
      n: '04',
      title: 'Ghi nhận kết quả phản hồi',
      detail:
        'Phản hồi của người nghe được ghi nhận lại theo cách đã được cấu hình cho từng kịch bản.',
    },
    {
      n: '05',
      title: 'Chuyển trường hợp cần thiết cho nhân viên',
      detail:
        'Những tình huống nằm ngoài kịch bản hoặc cần trao đổi thêm được đưa sang đội ngũ để tiếp tục xử lý.',
    },
    {
      n: '06',
      title: 'Theo dõi và tối ưu',
      detail:
        'Đội ngũ xem lại kết quả chiến dịch để điều chỉnh kịch bản, dữ liệu hoặc cách phân luồng cho các đợt tiếp theo.',
    },
  ],
} as const

/* ── 05 · Solution capabilities ─────────────────────────────────── */

/**
 * Deliberately neutral. These are the capabilities a Voicebot deployment is
 * scoped around — not a committed feature list, and not a claim about voice
 * quality, recognition accuracy or concurrency.
 */
export const VB_CAPABILITIES = {
  eyebrow: 'KHẢ NĂNG GIẢI PHÁP',
  h2: 'Những gì một triển khai Voicebot được xây dựng xoay quanh',
  description:
    'Phạm vi cụ thể của từng khả năng được xác định trong quá trình khảo sát và kiểm thử, dựa trên use case và hệ thống hiện tại của doanh nghiệp.',
  points: [
    'Thực hiện tác vụ gọi theo kịch bản đã thiết lập.',
    'Ghi nhận phản hồi của khách hàng trong cuộc gọi.',
    'Phân loại kết quả cuộc gọi theo các nhóm đã được cấu hình.',
    'Chuyển các tình huống cần con người xử lý sang đội ngũ.',
    'Cung cấp dữ liệu phục vụ theo dõi chiến dịch.',
  ],
  note: 'Đây là các khả năng được đưa vào phạm vi khảo sát, không phải danh sách tính năng đã cam kết cho mọi triển khai.',
} as const

/* ── 06 · Human + AI ────────────────────────────────────────────── */

/**
 * STRATEGICALLY LOAD-BEARING. This section is what keeps the page from reading
 * as "Voicebot thay thế nhân viên". Do not delete or weaken it.
 */
export const VB_HUMAN_AI = {
  eyebrow: 'CON NGƯỜI VÀ AI',
  h2: 'AI xử lý tác vụ lặp lại, con người xử lý tương tác có giá trị cao',
  description:
    'Voicebot được đặt vào quy trình để gánh phần việc có kịch bản rõ ràng. Những cuộc trao đổi cần chuyên môn, sự linh hoạt và khả năng đọc ngữ cảnh vẫn thuộc về đội ngũ.',
  columns: [
    {
      role: 'Voicebot đảm nhận',
      detail: 'Các tác vụ gọi có quy trình và kịch bản rõ ràng, lặp lại theo chiến dịch.',
      items: [
        'Cuộc gọi có nội dung ổn định',
        'Tác vụ lặp lại với số lượng lớn',
        'Bước ghi nhận phản hồi ban đầu',
      ],
    },
    {
      role: 'Nhân viên tiếp nhận',
      detail:
        'Những trường hợp cần tư vấn, thương lượng hoặc hiểu bối cảnh riêng của khách hàng.',
      items: [
        'Tình huống nằm ngoài kịch bản',
        'Khách hàng cần tư vấn chuyên sâu',
        'Trao đổi cần thương lượng hoặc xử lý khiếu nại',
      ],
    },
  ],
  closing:
    'Định hướng của giải pháp là hỗ trợ đội ngũ mở rộng khả năng xử lý cuộc gọi, không phải thay thế vai trò của nhân viên.',
} as const

/* ── 07 · Integration ───────────────────────────────────────────── */

/**
 * No confirmed integration list exists for Voicebot in this repository, so the
 * register is strictly "có thể được khảo sát tích hợp" — never "tích hợp sẵn".
 * The links point only to Gcalls routes that actually exist.
 */
export const VB_INTEGRATION = {
  eyebrow: 'TÍCH HỢP VÀO QUY TRÌNH',
  h2: 'Voicebot có thể được khảo sát tích hợp vào hệ thống đang vận hành',
  description:
    'Phạm vi kết nối được xác định trong quá trình khảo sát. Gcalls đánh giá hệ thống hiện tại, dữ liệu sẵn có và cách đội ngũ đang làm việc trước khi đề xuất phương án tích hợp.',
  items: [
    {
      title: 'Hệ thống tổng đài',
      detail:
        'Có thể được khảo sát tích hợp để cuộc gọi Voicebot nằm chung luồng vận hành thoại của doanh nghiệp.',
    },
    {
      title: 'CRM',
      detail:
        'Có thể được khảo sát tích hợp để dữ liệu liên hệ và kết quả cuộc gọi nằm cùng nơi đội ngũ đang làm việc.',
    },
    {
      title: 'Dữ liệu chiến dịch',
      detail:
        'Có thể được khảo sát tích hợp để danh sách liên hệ và trạng thái chiến dịch được đồng bộ theo quy trình hiện tại.',
    },
    {
      title: 'Quy trình chăm sóc khách hàng',
      detail:
        'Có thể được khảo sát tích hợp để những trường hợp cần con người xử lý đi vào đúng luồng chăm sóc đang có.',
    },
    {
      title: 'Hệ thống báo cáo',
      detail:
        'Có thể được khảo sát tích hợp để dữ liệu cuộc gọi phục vụ hoạt động theo dõi và báo cáo nội bộ.',
    },
  ],
  /** Only routes that exist today. */
  links: [
    { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
    { label: 'Gcalls CX', path: ROUTES.gcallsCx },
    { label: 'QC Bot AI', path: ROUTES.qcCenter },
  ],
  hubLinks: [
    { label: 'Xem tất cả sản phẩm', path: ROUTES.products },
    { label: 'Xem tất cả giải pháp', path: ROUTES.solutions },
  ],
} as const

/* ── 08 · Industries ────────────────────────────────────────────── */

/**
 * One scenario per industry, no ROI figure anywhere. Each links to the industry
 * route that already exists in the sitemap.
 */
export const VB_INDUSTRIES = {
  eyebrow: 'NGÀNH PHÙ HỢP',
  h2: 'Những nhóm ngành thường có nhiều cuộc gọi lặp lại',
  description:
    'Mỗi ngành có một nhóm cuộc gọi thủ tục riêng. Đây là điểm bắt đầu thường gặp khi doanh nghiệp cân nhắc đưa Voicebot vào vận hành.',
  items: [
    {
      title: 'Tài chính và bảo hiểm',
      detail:
        'Gọi nhắc kỳ thanh toán hoặc nhắc lịch làm việc theo danh sách đã được duyệt.',
      links: [
        { label: 'Tài chính', path: ROUTES.finance },
        { label: 'Bảo hiểm', path: ROUTES.insurance },
      ],
    },
    {
      title: 'Giáo dục',
      detail:
        'Gọi nhắc lịch học, lịch tư vấn hoặc xác nhận thông tin ghi danh với số lượng lớn trong thời gian ngắn.',
      links: [{ label: 'Giáo dục', path: ROUTES.education }],
    },
    {
      title: 'Thương mại điện tử và bán lẻ',
      detail:
        'Gọi xác nhận đơn hàng và ghi nhận phản hồi của khách trước bước giao nhận.',
      links: [{ label: 'Thương mại điện tử', path: ROUTES.ecommerce }],
    },
    {
      title: 'BPO và Outsourcing',
      detail:
        'Sàng lọc data thô theo chiến dịch trước khi chuyển những liên hệ phù hợp cho nhân viên.',
      links: [{ label: 'BPO', path: ROUTES.bpo }],
    },
  ],
} as const

/* ── 09 · Deployment ────────────────────────────────────────────── */

/** Five steps. No duration is published — none is verified. */
export const VB_DEPLOYMENT = {
  eyebrow: 'QUY TRÌNH TRIỂN KHAI',
  h2: 'Từ khảo sát nhu cầu đến vận hành và tối ưu',
  description:
    'Thời gian của mỗi bước phụ thuộc vào use case, dữ liệu và mức độ tích hợp, nên được xác định cụ thể trong quá trình tư vấn.',
  steps: [
    {
      n: '01',
      title: 'Khảo sát nhu cầu',
      detail:
        'Xem xét quy trình cuộc gọi hiện tại, khối lượng và cách đội ngũ đang xử lý.',
    },
    {
      n: '02',
      title: 'Xác định use case',
      detail:
        'Chọn tình huống cuộc gọi phù hợp để bắt đầu, thay vì đưa toàn bộ hoạt động gọi vào cùng lúc.',
    },
    {
      n: '03',
      title: 'Xây dựng kịch bản',
      detail:
        'Thống nhất nội dung hội thoại, các nhánh phản hồi và điều kiện chuyển sang nhân viên.',
    },
    {
      n: '04',
      title: 'Thiết lập và kiểm thử',
      detail:
        'Cấu hình chiến dịch và kiểm thử trên phạm vi giới hạn trước khi mở rộng.',
    },
    {
      n: '05',
      title: 'Vận hành và tối ưu',
      detail:
        'Theo dõi kết quả thực tế và điều chỉnh kịch bản, dữ liệu hoặc phân luồng theo từng đợt.',
    },
  ],
} as const

/* ── 10 · Outcomes ──────────────────────────────────────────────── */

/** Qualitative only. No percentage, no hour count, no cost figure. */
export const VB_OUTCOMES = {
  eyebrow: 'GIÁ TRỊ ĐẦU RA',
  h2: 'Những thay đổi doanh nghiệp có thể hướng tới',
  description:
    'Kết quả cụ thể phụ thuộc vào use case, chất lượng dữ liệu và cách chiến dịch được thiết kế. Dưới đây là những giá trị mà doanh nghiệp thường đặt làm mục tiêu khi bắt đầu.',
  items: [
    {
      title: 'Mở rộng khả năng xử lý cuộc gọi',
      detail:
        'Khối lượng cuộc gọi thủ tục không còn bị giới hạn hoàn toàn bởi số nhân sự trực tại một thời điểm.',
    },
    {
      title: 'Tăng tính nhất quán của tác vụ lặp lại',
      detail:
        'Cùng một kịch bản được sử dụng cho toàn bộ chiến dịch, thay vì thay đổi theo từng người thực hiện.',
    },
    {
      title: 'Giúp nhân viên tập trung vào tương tác quan trọng',
      detail:
        'Đội ngũ dành thời gian cho những khách hàng cần tư vấn, thương lượng hoặc xử lý tình huống riêng.',
    },
    {
      title: 'Dữ liệu cuộc gọi rõ ràng hơn',
      detail:
        'Kết quả chiến dịch được ghi nhận theo cấu hình, phục vụ việc theo dõi và rà soát nội bộ.',
    },
    {
      title: 'Linh hoạt thử nghiệm theo từng use case',
      detail:
        'Doanh nghiệp có thể bắt đầu từ một tình huống cuộc gọi và mở rộng dần theo kết quả thực tế.',
    },
  ],
} as const

/* ── 11 · FAQ ───────────────────────────────────────────────────── */

export interface VbFaqItem {
  q: string
  a: string
  link?: { label: string; path: string }
}

/**
 * Six questions, matching the brief §11. The cost answer is scope-dependent by
 * requirement — never a number and never a range.
 */
export const VB_FAQ: VbFaqItem[] = [
  {
    q: 'Voicebot AI phù hợp với doanh nghiệp nào?',
    a: 'Voicebot phù hợp với doanh nghiệp có nhiều cuộc gọi lặp lại theo cùng một kịch bản, chẳng hạn nhắc lịch, xác nhận thông tin hoặc sàng lọc danh sách liên hệ. Mức độ phù hợp được xác định dựa trên quy trình và khối lượng cuộc gọi thực tế.',
  },
  {
    q: 'Voicebot có thể áp dụng cho tình huống nào?',
    a: 'Các tình huống thường được cân nhắc gồm nhắc lịch hẹn, nhắc thanh toán, xác nhận thông tin, sàng lọc nhu cầu, chiến dịch gọi hàng loạt và xử lý bước đầu ngoài giờ. Mỗi tình huống cần kịch bản riêng và được kiểm thử trước khi mở rộng.',
  },
  {
    q: 'Có thể kết nối Voicebot với hệ thống hiện tại không?',
    a: 'Khả năng kết nối với tổng đài, CRM, dữ liệu chiến dịch, quy trình chăm sóc khách hàng và hệ thống báo cáo có thể được khảo sát trong quá trình tư vấn. Phạm vi tích hợp cụ thể phụ thuộc vào hệ thống và dữ liệu hiện có của doanh nghiệp.',
    link: { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
  },
  {
    q: 'Khi nào cuộc gọi cần chuyển sang nhân viên?',
    a: 'Những tình huống nằm ngoài kịch bản, cần tư vấn chuyên sâu, thương lượng hoặc xử lý khiếu nại nên được chuyển cho nhân viên. Điều kiện chuyển tiếp được thống nhất khi xây dựng kịch bản chứ không cố định cho mọi doanh nghiệp.',
  },
  {
    q: 'Doanh nghiệp bắt đầu triển khai như thế nào?',
    a: 'Thông thường sẽ bắt đầu bằng việc khảo sát nhu cầu, chọn một use case cụ thể, xây dựng kịch bản, thiết lập và kiểm thử trên phạm vi giới hạn, sau đó mới vận hành và tối ưu theo kết quả thực tế.',
  },
  {
    q: 'Chi phí Voicebot được xác định ra sao?',
    a: 'Chi phí phụ thuộc vào use case được triển khai, lưu lượng cuộc gọi, mức độ tích hợp với hệ thống hiện tại và phạm vi triển khai. Gcalls xác định phương án phù hợp sau bước khảo sát thay vì áp dụng một mức giá chung.',
    link: { label: 'Đăng ký tư vấn Voicebot', path: ROUTES.contact },
  },
]

/* ── 12 · Final CTA ─────────────────────────────────────────────── */

export const VB_FINAL_CTA = {
  eyebrow: 'VOICEBOT AI CHO DOANH NGHIỆP',
  h2: 'Bắt đầu từ một tình huống cuộc gọi phù hợp với doanh nghiệp',
  description:
    'Chia sẻ quy trình hiện tại để đội ngũ Gcalls cùng bạn xác định use case, phạm vi tích hợp và phương án triển khai Voicebot phù hợp.',
  /**
   * One action only. A secondary button here would either compete with the
   * conversion or be an in-page hash — and a hash link inside this SPA does not
   * scroll on its own (`ScrollToTop` only reacts to pathname), so it would read
   * as a dead control. The in-page jump to the use cases lives in the hero,
   * where it is a plain anchor the browser handles natively.
   */
  primaryCta: { label: 'Đăng ký tư vấn Voicebot', path: ROUTES.contact },
} as const

/* ── Structured data ────────────────────────────────────────────── */

/**
 * Three nodes only.
 *
 * `Service` rather than `Product` / `SoftwareApplication`: this repository does
 * not establish that Gcalls builds the Voicebot engine, and the approved
 * positioning is consulting, connecting and integrating. Publishing a
 * SoftwareApplication node would assert authorship the evidence does not
 * support. No Offer, price, AggregateRating or Review is emitted — none is
 * verified.
 *
 * The FAQPage node is built from the SAME array the page renders, so the
 * structured data cannot drift from the visible FAQ.
 */
export function buildVoicebotJsonLd(origin: string) {
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
            name: 'Gcalls Voicebot AI',
            item: `${origin}${ROUTES.voicebotAi}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: 'Gcalls Voicebot AI',
        serviceType: 'Voicebot AI cho doanh nghiệp',
        description: VB_HERO.description,
        provider: { '@type': 'Organization', name: 'Gcalls' },
        areaServed: 'VN',
        url: `${origin}${ROUTES.voicebotAi}`,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: VB_USE_CASES.h2,
          itemListElement: VB_USE_CASES.items.map((item) => ({
            '@type': 'OfferCatalog',
            name: item.title,
            description: item.detail,
          })),
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: VB_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
