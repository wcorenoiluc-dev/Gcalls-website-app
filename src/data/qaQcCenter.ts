/**
 * Approved content for /qc-bot-ai/ — QA QC Center, powered by QC Bot AI.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED.
 * ---------------------------------------------------------------------------
 * Every string below comes from the approved Checkpoint P02 source. Do not
 * rewrite, shorten, paraphrase or "improve" it, and do not add capabilities,
 * benefits, statistics or connector names that are not here.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING (P02 §23)
 * ---------------------------------------------------------------------------
 * The following must NEVER appear as verified fact on this page:
 *   "100% cuộc gọi" · "chính xác 100%" · "thay thế hoàn toàn QA" ·
 *   "phát hiện mọi vi phạm" · "đảm bảo compliance" · any "giảm/tăng X%"
 *   figure · perfect sentiment detection · guaranteed scoring accuracy ·
 *   "chỉ nghe được 1–2%" as an industry fact.
 *
 * Internal or historical material may contain these. They are NOT approved
 * website proof. Allowed register: "hỗ trợ", "có thể", "theo cấu hình",
 * "dữ liệu được đưa vào hệ thống", "tín hiệu cần xem xét", "QA xác nhận".
 *
 * The product must never be positioned as replacing human QA — see
 * QQ_HUMAN_LOOP, which exists specifically to prevent that.
 * ---------------------------------------------------------------------------
 *
 * NAMING. One product, one page identity:
 *   QA QC Center  └── powered by QC Bot AI
 * "QA QC Center" is the product/page identity; "QC Bot AI" names the AI
 * capability. They are not two competing products.
 * ---------------------------------------------------------------------------
 */

import { ROUTES } from '@/config/navigation'

/**
 * Conversion context for QA QC Center CTAs.
 *
 * P02 shipped `intent: 'product_information'` because `LeadIntent` had no
 * `demo` member at the time. P03 added one, and this CTA was migrated to it —
 * a conversion-model correction only. No P02 page copy, layout or component
 * changed; intent is pass-through data that no rendered text depends on.
 *
 * `source` and `product` are exact matches to the existing enum / LEAD_NEEDS:
 * `qa_qc_center` and `QA QC Center`.
 */
export const QQ_DEMO_LEAD = {
  intent: 'demo',
  source: 'qa_qc_center',
  product: 'QA QC Center',
} as const

export const QQ_CONSULT_LEAD = {
  intent: 'consultation',
  source: 'qa_qc_center',
  product: 'QA QC Center',
} as const

export const QQ_HERO = {
  eyebrow: 'QA QC CENTER • POWERED BY QC BOT AI',
  h1: 'QA QC Center – AI hỗ trợ kiểm soát chất lượng cuộc gọi',
  description:
    'Chuyển nội dung cuộc gọi thành dữ liệu có cấu trúc, áp dụng tiêu chí QA và làm nổi bật những tín hiệu cần kiểm tra để đội quản lý tập trung vào các hội thoại quan trọng.',
  valuePoints: [
    {
      title: 'Chuyển hội thoại thành dữ liệu',
      detail:
        'Speech-to-Text giúp đội QA đọc, tìm kiếm và xem lại nội dung cuộc gọi thuận tiện hơn.',
    },
    {
      title: 'Chuẩn hóa tiêu chí đánh giá',
      detail:
        'Áp dụng bộ tiêu chí và trọng số QA được cấu hình để hỗ trợ quá trình chấm điểm nhất quán hơn.',
    },
    {
      title: 'Ưu tiên cuộc gọi cần xem lại',
      detail:
        'Từ khóa, tín hiệu cảm xúc và kết quả phân tích giúp đội QA xác định những hội thoại cần chú ý.',
    },
  ],
  primaryCta: { label: 'Yêu cầu demo QA QC Center' },
  secondaryCta: { label: 'Khám phá cách hoạt động', href: '#cach-hoat-dong' },
} as const

/**
 * Direct answer / AIO block. Plain visible text immediately after the hero —
 * never inside a tab, modal or collapsed element. Also the natural placement
 * of the primary keyword "phần mềm QA cuộc gọi" is NOT here; see QQ_OVERVIEW.
 */
export const QQ_DIRECT_ANSWER = {
  question: 'QA QC Center là gì?',
  answer:
    'QA QC Center sử dụng năng lực QC Bot AI để chuyển nội dung cuộc gọi thành transcript, đánh giá theo các tiêu chí QA được cấu hình và làm nổi bật những tín hiệu cần kiểm tra như từ khóa, cảm xúc hoặc mức độ tuân thủ. Giải pháp giúp đội QA và quản lý tập trung vào các hội thoại cần được xem xét thay vì phụ thuộc hoàn toàn vào việc nghe lại thủ công.',
} as const

export const QQ_PROBLEMS = {
  eyebrow: 'BÀI TOÁN QA',
  h2: 'Khi số lượng cuộc gọi tăng, nghe lại thủ công không còn đủ để kiểm soát chất lượng',
  description:
    'Đội QA thường phải chọn một phần nhỏ cuộc gọi để nghe lại, trong khi những cuộc hội thoại còn lại vẫn có thể chứa vấn đề về quy trình, trải nghiệm khách hàng hoặc cách nhân viên xử lý tình huống.',
  /**
   * No sampling percentage appears here. "Chỉ nghe được 1–2%" is explicitly
   * unapproved as a universal industry fact (P02 §7) and must not return
   * without verified evidence.
   */
  items: [
    {
      n: '01',
      title: 'Khó xem xét toàn bộ khối lượng hội thoại',
      detail:
        'Số lượng cuộc gọi lớn khiến đội QA phải ưu tiên mẫu kiểm tra thay vì có góc nhìn có cấu trúc trên toàn bộ dữ liệu được đưa vào hệ thống.',
    },
    {
      n: '02',
      title: 'Chấm điểm dễ phụ thuộc vào cách đánh giá của từng người',
      detail:
        'Nếu tiêu chí và trọng số chưa được chuẩn hóa, kết quả đánh giá giữa các QA có thể thiếu nhất quán.',
    },
    {
      n: '03',
      title: 'Tốn thời gian tìm cuộc gọi có vấn đề',
      detail:
        'QA phải nghe lại nhiều cuộc gọi để xác định những hội thoại có từ khóa, nội dung hoặc dấu hiệu cần được kiểm tra.',
    },
    {
      n: '04',
      title: 'Dữ liệu QA khó tổng hợp thành xu hướng',
      detail:
        'Khi đánh giá nằm ở nhiều file hoặc thao tác thủ công, người quản lý khó nhìn thấy xu hướng chất lượng theo đội ngũ và thời gian.',
    },
  ],
} as const

/**
 * Overview. Carries the single natural occurrence of the primary keyword
 * "phần mềm QA cuộc gọi" in its lead sentence.
 */
export const QQ_OVERVIEW = {
  eyebrow: 'QC BOT AI',
  h2: 'Biến cuộc gọi thành dữ liệu có thể tìm kiếm, đánh giá và xem lại',
  description:
    'QA QC Center kết hợp dữ liệu hội thoại với bộ tiêu chí đánh giá để hỗ trợ đội QA theo dõi chất lượng cuộc gọi theo một quy trình có cấu trúc hơn.',
  /** Primary-keyword sentence. One occurrence, in body copy, not the hero. */
  keywordLead:
    'Là phần mềm QA cuộc gọi, QA QC Center tập hợp bảy thành phần dưới đây thành một quy trình kiểm soát chất lượng duy nhất.',
  components: [
    'Transcript',
    'QA criteria',
    'Scoring',
    'Keyword signals',
    'Sentiment signals',
    'Conversation review',
    'Quality dashboard',
  ],
} as const

export const QQ_HOW_IT_WORKS = {
  anchorId: 'cach-hoat-dong',
  eyebrow: 'CÁCH HOẠT ĐỘNG',
  h2: 'Từ bản ghi cuộc gọi đến phiên đánh giá QA',
  /**
   * Step 5 is deliberately the human step. AI output is never presented as a
   * final, unquestionable judgment — human review stays in the workflow.
   */
  steps: [
    {
      n: '01',
      title: 'Tiếp nhận dữ liệu cuộc gọi',
      detail: 'Cuộc gọi được đưa vào luồng phân tích theo cấu hình của hệ thống.',
    },
    {
      n: '02',
      title: 'Chuyển giọng nói thành văn bản',
      detail:
        'Speech-to-Text tạo transcript để nội dung hội thoại có thể được đọc và xử lý dưới dạng dữ liệu.',
    },
    {
      n: '03',
      title: 'Áp dụng tiêu chí QA',
      detail:
        'Hệ thống sử dụng bộ tiêu chí và trọng số được cấu hình để hỗ trợ đánh giá nội dung cuộc gọi.',
    },
    {
      n: '04',
      title: 'Phát hiện tín hiệu cần chú ý',
      detail:
        'Từ khóa, tín hiệu cảm xúc và các điều kiện đánh giá giúp làm nổi bật những cuộc gọi cần được xem xét.',
    },
    {
      n: '05',
      title: 'QA xem lại và phân tích',
      detail:
        'Đội QA sử dụng transcript, scoring và context của cuộc gọi để kiểm tra, xác nhận và tiếp tục quá trình coaching hoặc cải thiện vận hành.',
    },
  ],
} as const

export const QQ_CAPABILITIES = {
  eyebrow: 'NĂNG LỰC AI',
  h2: 'Các năng lực cốt lõi hỗ trợ đội QA',
  items: [
    {
      n: '01',
      title: 'Speech-to-Text',
      detail:
        'Chuyển nội dung hội thoại thành transcript để hỗ trợ tìm kiếm, đọc và xem lại cuộc gọi.',
    },
    {
      n: '02',
      title: 'QA Criteria',
      detail:
        'Thiết lập các tiêu chí đánh giá phù hợp với quy trình chất lượng của doanh nghiệp.',
    },
    {
      n: '03',
      title: 'AI-assisted Scoring',
      detail:
        'Hỗ trợ chấm điểm trên dữ liệu đã được phân tích dựa trên bộ tiêu chí và trọng số được cấu hình.',
    },
    {
      n: '04',
      title: 'Keyword Analysis',
      detail: 'Phát hiện các từ khóa hoặc cụm nội dung cần được đội QA chú ý.',
    },
    {
      n: '05',
      title: 'Sentiment Signals',
      detail:
        'Làm nổi bật tín hiệu cảm xúc trong hội thoại để hỗ trợ quá trình xem xét.',
    },
    {
      n: '06',
      title: 'Conversation Review',
      detail:
        'Tập trung transcript, kết quả đánh giá và các tín hiệu liên quan để QA xem lại cuộc gọi hiệu quả hơn.',
    },
    {
      n: '07',
      title: 'Quality Dashboard',
      detail:
        'Tổng hợp dữ liệu đánh giá để người quản lý theo dõi chất lượng và xu hướng vận hành.',
    },
  ],
} as const

/** Scoring. Never claims the AI score is correct or replaces manual scoring. */
export const QQ_SCORING = {
  eyebrow: 'QA SCORING',
  h2: 'Chuẩn hóa chấm điểm cuộc gọi theo tiêu chí rõ ràng',
  description:
    'Thay vì chỉ dựa vào cảm nhận khi nghe lại, doanh nghiệp có thể cấu hình bộ tiêu chí và trọng số để tạo một khung đánh giá nhất quán hơn.',
  points: [
    'Thiết lập tiêu chí QA',
    'Gán trọng số theo mức độ quan trọng',
    'Hỗ trợ scoring trên dữ liệu được phân tích',
    'Đưa cuộc gọi cần chú ý vào luồng review',
    'Cho phép QA xem lại context trước khi kết luận',
  ],
} as const

/**
 * Conversation signals. The approved register is "tín hiệu cảm xúc" — a signal
 * to review, not a claim of perfect emotion detection.
 */
export const QQ_SIGNALS = {
  eyebrow: 'CONVERSATION SIGNALS',
  h2: 'Nhận diện từ khóa và tín hiệu hội thoại cần được chú ý',
  description:
    'Không phải mọi cuộc gọi đều cần mức độ kiểm tra như nhau. Các tín hiệu từ nội dung hội thoại có thể giúp đội QA ưu tiên những cuộc gọi cần xem lại trước.',
  points: [
    'Tìm từ khóa/cụm nội dung theo cấu hình',
    'Làm nổi bật tín hiệu cảm xúc',
    'Xác định hội thoại có dấu hiệu bất thường',
    'Theo dõi xu hướng thay vì chỉ nhìn từng cuộc gọi riêng lẻ',
  ],
} as const

/**
 * AI + human QA loop.
 *
 * STRATEGICALLY LOAD-BEARING. This section is what keeps the page from reading
 * as "AI replaces QA". Do not delete it, weaken it, or move it below the fold
 * of the AI capability sections.
 */
export const QQ_HUMAN_LOOP = {
  eyebrow: 'AI + HUMAN QA',
  h2: 'AI hỗ trợ sàng lọc dữ liệu, con người vẫn giữ vai trò đánh giá và cải thiện',
  description:
    'QA QC Center giúp tự động hóa các bước xử lý dữ liệu và làm nổi bật tín hiệu, nhưng quyết định đánh giá, coaching và thay đổi quy trình vẫn cần được đặt trong bối cảnh vận hành thực tế của doanh nghiệp.',
  roles: [
    { role: 'AI hỗ trợ', detail: 'Phân tích dữ liệu và phát hiện tín hiệu.' },
    { role: 'QA xác nhận', detail: 'Xem lại transcript, scoring và context.' },
    {
      role: 'Manager cải thiện',
      detail: 'Sử dụng dữ liệu để coaching hoặc điều chỉnh quy trình.',
    },
  ],
} as const

export const QQ_DASHBOARD = {
  eyebrow: 'QUALITY DASHBOARD',
  h2: 'Từ từng cuộc gọi đến góc nhìn chất lượng của cả đội ngũ',
  description:
    'Dashboard tập hợp dữ liệu đánh giá để QA Manager và người vận hành theo dõi các cuộc gọi cần chú ý, kết quả scoring và xu hướng chất lượng theo thời gian.',
} as const

/** Operational value. No percentage improvement is attached to any benefit. */
export const QQ_BENEFITS = {
  eyebrow: 'GIÁ TRỊ VẬN HÀNH',
  h2: 'Giúp đội QA tập trung thời gian vào việc cần con người xử lý',
  items: [
    {
      n: '01',
      title: 'Giảm thời gian tìm cuộc gọi cần kiểm tra',
      detail:
        'Sử dụng dữ liệu và tín hiệu để ưu tiên review thay vì phải tìm thủ công trong danh sách lớn.',
    },
    {
      n: '02',
      title: 'Chuẩn hóa khung đánh giá',
      detail:
        'Tiêu chí và trọng số được cấu hình giúp đội QA làm việc trên cùng một framework.',
    },
    {
      n: '03',
      title: 'Dễ phát hiện xu hướng',
      detail:
        'Dashboard và dữ liệu có cấu trúc giúp người quản lý theo dõi các mẫu vấn đề lặp lại theo thời gian.',
    },
    {
      n: '04',
      title: 'Hỗ trợ coaching có context',
      detail:
        'Transcript và kết quả review tạo thêm dữ liệu để trao đổi với nhân viên về những tình huống cụ thể.',
    },
  ],
} as const

/** Use cases. No regulatory compliance certification is claimed anywhere. */
export const QQ_USE_CASES = {
  eyebrow: 'TÌNH HUỐNG SỬ DỤNG',
  h2: 'QA QC Center phù hợp với những hoạt động nào?',
  items: [
    {
      role: 'Customer Service QA',
      detail:
        'Kiểm tra cách đội CSKH giao tiếp, xử lý tình huống và tuân thủ quy trình dịch vụ.',
    },
    {
      role: 'Telesales QA',
      detail:
        'Theo dõi nội dung tư vấn, cách trình bày thông tin và những tín hiệu cần coaching trong cuộc gọi bán hàng.',
    },
    {
      role: 'BPO / Contact Center',
      detail:
        'Hỗ trợ đội QA xử lý lượng lớn dữ liệu hội thoại và ưu tiên những cuộc gọi cần review.',
      links: [{ label: 'Giải pháp cho ngành BPO', path: ROUTES.bpo }],
    },
    {
      role: 'Finance & Insurance',
      detail:
        'Hỗ trợ quy trình QA đối với những cuộc gọi có tiêu chí đánh giá rõ ràng và yêu cầu kiểm tra nội dung hội thoại.',
      links: [
        { label: 'Tài chính', path: ROUTES.finance },
        { label: 'Bảo hiểm', path: ROUTES.insurance },
      ],
    },
  ],
} as const

/**
 * Integration. No connector list is invented — only the Gcalls products that
 * genuinely sit alongside this one are named.
 */
export const QQ_INTEGRATION = {
  eyebrow: 'KẾT NỐI DỮ LIỆU',
  h2: 'Kết nối dữ liệu cuộc gọi với hệ thống vận hành khi cần',
  description:
    'QA QC Center có thể nằm trong hệ sinh thái giao tiếp Gcalls và được triển khai cùng các giải pháp nghe gọi hoặc tích hợp hệ thống tùy theo kiến trúc của doanh nghiệp.',
  links: [
    { label: 'Gcalls Plus', path: ROUTES.gcallsPlus },
    { label: 'CRM Integration', path: ROUTES.crmIntegration },
    { label: 'Gcalls CX', path: ROUTES.gcallsCx },
  ],
} as const

/**
 * Product boundaries. Prevents overlap with the sibling products: each need is
 * routed to the page that owns it, and the current page is marked as such
 * rather than linking to itself.
 */
export const QQ_BOUNDARIES = {
  eyebrow: 'CHỌN SẢN PHẨM',
  h2: 'Chọn đúng sản phẩm theo bài toán cần giải quyết',
  items: [
    {
      need: 'Nghe gọi trên trình duyệt',
      product: 'Gcalls Plus Webphone',
      path: ROUTES.gcallsPlus,
    },
    {
      need: 'Quản lý giao tiếp đa kênh',
      product: 'Gcalls CX',
      path: ROUTES.gcallsCx,
    },
    {
      need: 'Tích hợp cuộc gọi sâu vào CRM',
      product: 'CRM Integration',
      path: ROUTES.crmIntegration,
    },
    {
      need: 'Kiểm soát chất lượng hội thoại',
      product: 'QA QC Center',
      path: ROUTES.qcCenter,
      /** This page. Rendered as a marked card, never as a self-link. */
      current: true,
    },
  ],
  allSolutions: { label: 'Xem tất cả giải pháp', path: ROUTES.solutions },
} as const

/**
 * Customer story — NEUTRAL.
 *
 * No verified QC Bot customer case exists in this repository, so none is
 * shown. Nothing is fabricated: no results, quotes, logos or figures.
 */
export const QQ_STORY = {
  eyebrow: 'QUY TRÌNH QA',
  h2: 'Xây dựng quy trình QA dựa trên dữ liệu hội thoại',
  description:
    'Mỗi doanh nghiệp có bộ tiêu chí, quy trình kiểm tra và mục tiêu chất lượng khác nhau. QA QC Center cần được cấu hình theo bối cảnh vận hành thực tế trước khi dữ liệu được sử dụng cho đánh giá hoặc coaching.',
  cta: { label: 'Yêu cầu demo theo quy trình QA của doanh nghiệp' },
  link: { label: 'Đọc bài viết trên Blog Gcalls', path: ROUTES.blog },
} as const

/** Deep link that pre-selects QA QC Center in the shared estimator. */
export const QQ_ESTIMATOR_HREF = `${ROUTES.costEstimator}?product=qa-qc`

/**
 * Configuration & cost.
 *
 * Renders no price. The description is reused verbatim from the existing
 * approved estimator FAQ copy (src/data/estimator.ts) rather than authored
 * here; the heading is a structural label pending its own approval.
 */
export const QQ_PRICING = {
  eyebrow: 'CẤU HÌNH & CHI PHÍ',
  h2: 'Cấu hình QA QC Center theo quy mô và bộ tiêu chí QA',
  description:
    'Cấu hình QA QC Center có thể phụ thuộc vào quy mô đội ngũ, khối lượng hội thoại cần phân tích và bộ tiêu chí QA cần áp dụng.',
  primaryCta: { label: 'Ước tính cấu hình & chi phí', path: QQ_ESTIMATOR_HREF },
  secondaryCta: { label: 'Xem bảng giá Gcalls', path: ROUTES.pricing },
} as const

export interface QqFaqItem {
  q: string
  a: string
  link?: { label: string; path: string }
}

/**
 * FAQ. The wording of FAQ 6 is REQUIRED — the answer to "does it analyse every
 * call" is scope-dependent, never "Yes, 100%".
 */
export const QQ_FAQ: QqFaqItem[] = [
  {
    q: 'QA QC Center là gì?',
    a: 'QA QC Center là giải pháp sử dụng QC Bot AI để chuyển cuộc gọi thành transcript, hỗ trợ đánh giá theo tiêu chí QA và làm nổi bật những tín hiệu cần được đội kiểm soát chất lượng xem xét.',
  },
  {
    q: 'QC Bot AI có thể tự động chấm điểm cuộc gọi không?',
    a: 'QC Bot AI có thể hỗ trợ chấm điểm trên dữ liệu cuộc gọi dựa trên bộ tiêu chí và trọng số được cấu hình. Kết quả cần được sử dụng phù hợp với quy trình QA và bối cảnh vận hành của doanh nghiệp.',
  },
  {
    q: 'QC Bot có phân tích từ khóa và cảm xúc không?',
    a: 'QA QC Center có thể làm nổi bật từ khóa và các tín hiệu cảm xúc trong hội thoại để hỗ trợ đội QA xác định những cuộc gọi cần chú ý.',
  },
  {
    q: 'AI có thay thế hoàn toàn nhân viên QA không?',
    a: 'Không nên xem QA QC Center là công cụ thay thế hoàn toàn vai trò QA. AI hỗ trợ xử lý dữ liệu, scoring và phát hiện tín hiệu; đội QA vẫn cần xem xét context, xác nhận kết quả và thực hiện coaching hoặc cải thiện quy trình.',
  },
  {
    q: 'QA QC Center phù hợp với doanh nghiệp nào?',
    a: 'Giải pháp phù hợp với doanh nghiệp có lượng cuộc gọi đáng kể và cần một quy trình có cấu trúc để theo dõi chất lượng hội thoại, đặc biệt ở Customer Service, Telesales, Contact Center và BPO.',
  },
  {
    q: 'QA QC Center có phân tích tất cả cuộc gọi không?',
    a: 'Phạm vi phân tích phụ thuộc vào dữ liệu cuộc gọi được đưa vào hệ thống, cấu hình triển khai và điều kiện kỹ thuật thực tế. Gcalls sẽ xác định phạm vi phù hợp trong quá trình tư vấn và kiểm thử.',
  },
]

export const QQ_FINAL_CTA = {
  eyebrow: 'QA QC CENTER • POWERED BY QC BOT AI',
  h2: 'Xem QA QC Center hoạt động trên chính bộ tiêu chí của đội ngũ bạn',
  description:
    'Chia sẻ quy trình QA, tiêu chí đánh giá và cách đội ngũ đang kiểm tra cuộc gọi để Gcalls tư vấn cấu hình phù hợp.',
  primaryCta: { label: 'Yêu cầu demo QA QC Center', path: ROUTES.contact },
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
 * Review, customerCount, accuracy percentage and coverage percentage — none is
 * verified, and publishing one would be a false claim.
 */
export function buildQaQcJsonLd(origin: string) {
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
            name: 'QA QC Center',
            item: `${origin}${ROUTES.qcCenter}`,
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'QA QC Center',
        alternateName: 'QC Bot AI',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Call Quality Assurance Software',
        operatingSystem: 'Web browser',
        description: QQ_OVERVIEW.description,
        url: `${origin}${ROUTES.qcCenter}`,
        featureList: QQ_CAPABILITIES.items.map((c) => c.title),
        provider: { '@type': 'Organization', name: 'Gcalls' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: QQ_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
