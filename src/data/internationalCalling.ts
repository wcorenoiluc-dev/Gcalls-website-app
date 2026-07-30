/**
 * Approved content for /tong-dai-quoc-te/ — Checkpoint S04.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED.
 * ---------------------------------------------------------------------------
 * Every string below is authored against the evidence available in this
 * repository. Do not rewrite, shorten, paraphrase or "improve" it, and do not
 * add markets, number types, timelines, savings or service guarantees that are
 * not here.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING (S04 §CG)
 * ---------------------------------------------------------------------------
 * Historical Gcalls material for international calling carries five claims.
 * ALL FIVE ARE WITHHELD because no current evidence exists in this repository:
 *
 *   1. "70+ quốc gia"          — no verified market/coverage list exists.
 *   2. "tiết kiệm 80–90%"      — no cost baseline, benchmark or study exists.
 *   3. "triển khai 1 ngày – 1 tuần" — no timeline evidence exists.
 *   4. "Brandname"             — no evidence of brandname/CLI display support
 *                                for international numbers; display rules are
 *                                also regulated per country.
 *   5. "SLA"                   — no signed or published SLA document exists.
 *
 * Also never publish: "gọi quốc tế không giới hạn", "đầu số mọi quốc gia",
 * "kết nối tức thì", "chất lượng thoại đảm bảo", "hợp pháp tại mọi thị trường",
 * "giảm X% chi phí viễn thông", any uptime figure, any per-minute rate.
 *
 * Required register instead: "nhiều thị trường", "tùy quốc gia",
 * "tùy quy định", "tùy đầu số", "theo phạm vi triển khai", "theo cấu hình",
 * "Gcalls hỗ trợ khảo sát thủ tục", "cần xác nhận theo từng thị trường".
 *
 * ---------------------------------------------------------------------------
 * EVIDENCE BASE
 * ---------------------------------------------------------------------------
 * The international evidence in this repository is:
 *
 *  - `src/data/estimator.ts`, solution `international`: a `markets`
 *    multi-select (Mỹ, Anh, Singapore, Úc, Nhật Bản, Hàn Quốc, Thị trường
 *    khác) with the hint "Cước và hồ sơ đăng ký khác nhau theo từng thị
 *    trường"; an `intlNumbers` count; an `intlMinutes` volume; and an
 *    `intlPurpose` multi-select (Local presence, Sales, Customer Service,
 *    BPO / Operations).
 *  - `src/data/pricing.ts`, solution `international`: pricing model
 *    "Theo quốc gia + loại đầu số + lưu lượng gọi", `pricingConfigured: false`,
 *    the `intl-numbers` add-on, and the approved FAQ answer naming the four
 *    cost factors: quốc gia, loại đầu số, hồ sơ đăng ký, lưu lượng.
 *  - `src/lib/estimate.ts`: international numbers stand alone — selecting this
 *    solution implies no other product.
 *
 * ---------------------------------------------------------------------------
 * EVIDENCE GATES
 * ---------------------------------------------------------------------------
 * MARKET NAMES (§M) — PUBLISHED AS *REQUESTED* MARKETS ONLY, NEVER AS
 * COVERAGE. The six named markets are exactly the options the approved
 * estimator already shows to visitors. In the estimator they are an INPUT: a
 * visitor describing where they need to operate. They are NOT evidence that
 * Gcalls supplies numbers there. This page may therefore reference them only
 * as markets businesses commonly ask about, and every rendering of the list
 * MUST carry the structural qualifier below (`INTL_MARKETS.qualifier`) plus a
 * per-card "Cần khảo sát" state. Any copy that reads as an availability list,
 * a coverage count, or a coverage map is forbidden. This mirrors the S03 §19
 * decision on POS vendor names, adapted to the fact that these names are
 * already public in the estimator.
 *
 * NUMBER TYPES (§T) — CONCEPT ONLY. "Local", "toll-free" and "national" are
 * industry categories describing what an international number can be, and
 * `pricing.ts` evidences "loại đầu số" as a real cost driver. The page may
 * therefore explain the categories, but must state that which categories exist
 * — and who may hold them — differs per country. No category is claimed as
 * available in any specific market.
 *
 * BRANDNAME / CALLER-ID DISPLAY (§B) — NOT PUBLISHED. Outbound copy says the
 * number presented on outbound calls follows configuration and each country's
 * rules. It never promises a brandname, a fixed display, or that any specific
 * number will show.
 *
 * SETUP TIMELINE (§D) — NOT PUBLISHED. The deployment section lists ORDERED
 * STEPS with no duration on any step and no total. Registration time is
 * explicitly stated as country- and document-dependent.
 *
 * VOICE QUALITY / UPTIME (§Q) — NOT PUBLISHED. No SLA, uptime percentage,
 * latency figure, MOS score or "chất lượng đảm bảo" claim appears.
 *
 * TRUST (§TR) — NEUTRAL. No international customer case, logo, quote, figure
 * or saving exists in this repository, so none is published.
 *
 * ---------------------------------------------------------------------------
 * BOUNDARIES
 * ---------------------------------------------------------------------------
 * This page owns international numbers and multi-market calling configuration.
 * The calling layer itself belongs to Gcalls Plus; lead/contact workflow to CRM
 * Integration; ticket workflow to Helpdesk Integration; sales/order context to
 * POS Integration; multi-channel conversations to Gcalls CX. This page does not
 * sell minutes, resell carriers, or provide legal advice on telecom regulation.
 */

import { ROUTES } from '@/config/navigation'

/**
 * Conversion context for International Calling CTAs.
 *
 * `source: 'international'` and the need label 'Tổng đài quốc tế' are both
 * pre-existing values in the shared lead model (`src/lib/leads/types.ts`), so
 * no shared type changed for this page.
 */
export const INTL_LEAD = {
  intent: 'consultation',
  source: 'international',
  solution: 'Tổng đài quốc tế',
} as const

/* ── 01 · Hero ──────────────────────────────────────────────────── */

export const INTL_HERO = {
  eyebrow: 'GCALLS • INTERNATIONAL CALLING',
  h1: 'Tổng đài quốc tế – kết nối doanh nghiệp với khách hàng tại nhiều thị trường',
  description:
    'Gcalls hỗ trợ doanh nghiệp thiết lập và vận hành hoạt động nghe gọi cho thị trường quốc tế: xác định đầu số phù hợp, chuẩn bị hồ sơ đăng ký theo quy định từng quốc gia và đưa cuộc gọi vào quy trình làm việc của đội ngũ.',
  valuePoints: [
    {
      title: 'Hiện diện tại thị trường mục tiêu',
      detail:
        'Sử dụng đầu số phù hợp với từng thị trường để khách hàng liên hệ theo cách quen thuộc tại quốc gia của họ.',
    },
    {
      title: 'Cấu hình theo quy định từng quốc gia',
      detail:
        'Loại đầu số, hồ sơ và điều kiện sử dụng khác nhau tùy quốc gia. Gcalls hỗ trợ khảo sát thủ tục trước khi triển khai.',
    },
    {
      title: 'Vận hành trên cùng một hệ thống',
      detail:
        'Đội ngũ nghe gọi, theo dõi hoạt động và quản lý đầu số quốc tế trong cùng nền tảng đang sử dụng.',
    },
  ],
  primaryCta: { label: 'Tư vấn tổng đài quốc tế' },
  secondaryCta: {
    label: 'Khám phá cách triển khai',
    href: '#cach-hoat-dong',
  },
} as const

/* ── 02 · Direct answer / AIO ───────────────────────────────────── */

/** Plain visible text, never collapsed into an accordion. */
export const INTL_DIRECT_ANSWER = {
  question: 'Tổng đài quốc tế là gì?',
  answer:
    'Tổng đài quốc tế là mô hình tổng đài doanh nghiệp sử dụng đầu số và cấu hình liên lạc gắn với các thị trường nước ngoài, để đội ngũ có thể nhận cuộc gọi từ khách hàng quốc tế và gọi ra tới các thị trường đó trong cùng một hệ thống. Loại đầu số có thể sử dụng, hồ sơ cần chuẩn bị và điều kiện vận hành khác nhau tùy quốc gia và tùy quy định của từng thị trường, nên phạm vi triển khai được xác định theo từng yêu cầu cụ thể.',
} as const

/* ── 03 · Problems ──────────────────────────────────────────────── */

export const INTL_PROBLEMS = {
  eyebrow: 'BÀI TOÁN ĐA THỊ TRƯỜNG',
  h2: 'Khi khách hàng ở nhiều quốc gia, hoạt động liên lạc dễ bị phân mảnh theo từng thị trường',
  items: [
    {
      n: '01',
      title: 'Khách hàng quốc tế khó liên hệ lại',
      detail:
        'Nếu doanh nghiệp chỉ có đầu số trong nước, khách hàng tại thị trường khác phải gọi quốc tế và thường ngần ngại liên hệ.',
    },
    {
      n: '02',
      title: 'Mỗi thị trường một cách làm khác nhau',
      detail:
        'Đầu số, quy định sử dụng và hồ sơ đăng ký khác nhau tùy quốc gia, khiến việc mở rộng sang thị trường mới mất nhiều thời gian tìm hiểu.',
    },
    {
      n: '03',
      title: 'Hoạt động nghe gọi nằm rải rác',
      detail:
        'Khi mỗi thị trường dùng một kênh liên lạc riêng, doanh nghiệp khó theo dõi hoạt động và lịch sử trao đổi một cách thống nhất.',
    },
    {
      n: '04',
      title: 'Thủ tục đăng ký đầu số không rõ ràng',
      detail:
        'Yêu cầu giấy tờ và điều kiện sử dụng đầu số thay đổi theo quy định từng quốc gia, nên đội ngũ nội bộ khó tự xác định cần chuẩn bị những gì.',
    },
  ],
} as const

/* ── 04 · International number concept ──────────────────────────── */

/**
 * The number concept. §T applies: categories are explained, never claimed as
 * available in a specific market.
 */
export const INTL_NUMBER_CONCEPT = {
  eyebrow: 'ĐẦU SỐ QUỐC TẾ',
  h2: 'Đầu số quốc tế là cách doanh nghiệp hiện diện tại một thị trường mà không cần đặt tổng đài ở đó',
  description:
    'Đầu số quốc tế là số điện thoại thuộc một quốc gia hoặc vùng lãnh thổ, được cấu hình để cuộc gọi đi và đến được xử lý trên hệ thống tổng đài của doanh nghiệp. Khách hàng tại thị trường đó liên hệ theo cách quen thuộc, còn đội ngũ vẫn làm việc trên nền tảng hiện tại.',
  /** Industry categories only. Availability per market is not claimed. */
  types: [
    {
      n: '01',
      title: 'Đầu số nội địa của thị trường',
      detail:
        'Số gắn với một quốc gia hoặc khu vực cụ thể, thường dùng khi doanh nghiệp muốn khách hàng tại thị trường đó liên hệ như với một số trong nước.',
    },
    {
      n: '02',
      title: 'Đầu số miễn phí cuộc gọi đến',
      detail:
        'Loại đầu số mà người gọi không phải trả phí. Điều kiện cung cấp và cách tính cước khác nhau tùy quốc gia.',
    },
    {
      n: '03',
      title: 'Đầu số phạm vi toàn quốc',
      detail:
        'Số không gắn với một khu vực cụ thể trong quốc gia đó, phù hợp khi doanh nghiệp phục vụ khách hàng trên toàn thị trường.',
    },
  ],
  note: 'Không phải quốc gia nào cũng cung cấp đủ các loại đầu số trên, và điều kiện để doanh nghiệp nước ngoài được sử dụng từng loại cũng khác nhau. Gcalls xác định loại đầu số phù hợp theo từng thị trường trong quá trình khảo sát.',
} as const

/* ── 05 · Country / regulation differences ──────────────────────── */

/**
 * Regulation differences.
 *
 * Categories of difference, not a per-country rulebook. Gcalls surveys
 * procedures; it does not provide legal advice, and this copy says so.
 */
export const INTL_REGULATION = {
  eyebrow: 'KHÁC BIỆT THEO QUỐC GIA',
  h2: 'Mỗi thị trường có quy định riêng về đầu số và điều kiện sử dụng',
  description:
    'Viễn thông được quản lý ở cấp quốc gia, nên cùng một nhu cầu có thể cần cách triển khai khác nhau ở hai thị trường. Bốn nhóm khác biệt dưới đây là những yếu tố cần xác định trước khi triển khai.',
  items: [
    {
      n: '01',
      title: 'Hồ sơ doanh nghiệp',
      detail:
        'Giấy tờ pháp lý cần cung cấp để đăng ký đầu số khác nhau tùy quốc gia và tùy loại đầu số.',
    },
    {
      n: '02',
      title: 'Yêu cầu hiện diện tại thị trường',
      detail:
        'Một số thị trường yêu cầu doanh nghiệp có địa chỉ, pháp nhân hoặc đại diện tại quốc gia đó mới được sử dụng đầu số nội địa.',
    },
    {
      n: '03',
      title: 'Loại đầu số được phép sử dụng',
      detail:
        'Không phải loại đầu số nào cũng mở cho doanh nghiệp nước ngoài. Danh mục khả dụng cần được kiểm tra theo từng thị trường.',
    },
    {
      n: '04',
      title: 'Điều kiện vận hành và thời gian xử lý',
      detail:
        'Quy định về mục đích sử dụng, cách hiển thị số gọi ra và thời gian xét hồ sơ phụ thuộc vào cơ quan quản lý và nhà cung cấp tại từng quốc gia.',
    },
  ],
  note: 'Gcalls hỗ trợ khảo sát thủ tục và chuẩn bị hồ sơ theo yêu cầu của từng thị trường. Gcalls không thay thế tư vấn pháp lý, và điều kiện cuối cùng do quy định tại quốc gia đó quyết định.',
} as const

/**
 * Markets — §M GATE APPLIES.
 *
 * These are exactly the estimator's `markets` options, published as markets
 * businesses commonly REQUEST. Never as coverage, never with a count, never
 * with a map. The qualifier and the per-item state are mandatory and must be
 * rendered with the list.
 */
export const INTL_MARKETS = {
  eyebrow: 'THỊ TRƯỜNG THƯỜNG ĐƯỢC YÊU CẦU',
  h2: 'Doanh nghiệp Việt Nam thường bắt đầu từ những thị trường nào',
  description:
    'Đây là các thị trường doanh nghiệp thường nêu khi trao đổi với Gcalls, cũng là các lựa chọn trong công cụ ước tính chi phí. Danh sách này mô tả nhu cầu thường gặp, không phải danh sách quốc gia được cam kết cung cấp đầu số.',
  items: [
    'Mỹ',
    'Anh',
    'Singapore',
    'Úc',
    'Nhật Bản',
    'Hàn Quốc',
    'Thị trường khác',
  ],
  /** Structural qualifier — must appear wherever `items` is rendered. */
  qualifier: 'Cần khảo sát',
  note: 'Khả năng cung cấp đầu số, loại đầu số và hồ sơ cần thiết tại mỗi thị trường được Gcalls xác nhận theo từng yêu cầu cụ thể, dựa trên quy định hiện hành tại quốc gia đó.',
} as const

/* ── 06 · How it works ──────────────────────────────────────────── */

export const INTL_HOW_IT_WORKS = {
  anchorId: 'cach-hoat-dong',
  eyebrow: 'CÁCH TRIỂN KHAI HOẠT ĐỘNG',
  h2: 'Từ thị trường mục tiêu đến đầu số hoạt động trong quy trình của đội ngũ',
  steps: [
    {
      n: '01',
      title: 'Xác định thị trường mục tiêu',
      detail:
        'Doanh nghiệp cho biết cần hiện diện hoặc liên lạc tại những quốc gia nào và phục vụ nhu cầu gì.',
    },
    {
      n: '02',
      title: 'Khảo sát quy định và loại đầu số',
      detail:
        'Gcalls kiểm tra loại đầu số khả dụng, điều kiện sử dụng và hồ sơ cần chuẩn bị theo quy định từng thị trường.',
    },
    {
      n: '03',
      title: 'Chuẩn bị hồ sơ đăng ký',
      detail:
        'Doanh nghiệp cung cấp giấy tờ theo danh mục đã được xác định. Gcalls hỗ trợ hoàn thiện và gửi hồ sơ.',
    },
    {
      n: '04',
      title: 'Cấp và cấu hình đầu số',
      detail:
        'Sau khi hồ sơ được chấp thuận, đầu số được cấu hình trên hệ thống Gcalls theo luồng gọi vào và gọi ra đã thống nhất.',
    },
    {
      n: '05',
      title: 'Kiểm thử luồng gọi',
      detail:
        'Cuộc gọi đến và cuộc gọi ra được kiểm thử theo từng thị trường trước khi đưa vào vận hành.',
    },
    {
      n: '06',
      title: 'Vận hành và theo dõi',
      detail:
        'Đội ngũ nghe gọi trên nền tảng Gcalls; hoạt động cuộc gọi và lịch sử tương tác được theo dõi theo cấu hình.',
    },
  ],
} as const

/* ── 07 · Inbound ───────────────────────────────────────────────── */

export const INTL_INBOUND = {
  eyebrow: 'CUỘC GỌI ĐẾN',
  h2: 'Nhận cuộc gọi từ khách hàng quốc tế trên cùng hệ thống với đội ngũ trong nước',
  description:
    'Cuộc gọi tới đầu số quốc tế được đưa về hệ thống Gcalls và phân phối cho đội ngũ theo cấu hình doanh nghiệp thiết lập, thay vì phải bố trí một tổng đài riêng cho từng thị trường.',
  points: [
    'Định tuyến cuộc gọi theo đầu số hoặc theo thị trường',
    'Phân phối tới nhóm hoặc người phụ trách phù hợp',
    'Ghi nhận hoạt động cuộc gọi theo cấu hình',
    'Xử lý cuộc gọi ngoài giờ theo thiết lập',
  ],
  note: 'Cách định tuyến và các thiết lập ngoài giờ được cấu hình theo quy trình vận hành của doanh nghiệp và theo điều kiện của từng đầu số.',
} as const

/* ── 08 · Outbound ──────────────────────────────────────────────── */

/**
 * Outbound. §B GATE APPLIES — no brandname, no fixed caller-ID promise, no
 * per-minute rate, no cost-saving figure.
 */
export const INTL_OUTBOUND = {
  eyebrow: 'CUỘC GỌI RA',
  h2: 'Gọi ra thị trường quốc tế từ chính công cụ đội ngũ đang dùng',
  description:
    'Đội Sales và CSKH thực hiện cuộc gọi ra tới khách hàng ở thị trường nước ngoài trên nền tảng Gcalls, không cần chuyển sang thiết bị hay ứng dụng khác.',
  points: [
    'Gọi ra từ giao diện làm việc hằng ngày',
    'Chọn đầu số sử dụng cho cuộc gọi theo cấu hình',
    'Ghi nhận lịch sử cuộc gọi cho từng khách hàng',
    'Theo dõi lưu lượng gọi ra theo thị trường',
  ],
  note: 'Số hiển thị với người nhận phụ thuộc vào cấu hình đầu số và quy định về hiển thị số tại quốc gia được gọi đến. Cước gọi ra thay đổi theo thị trường và được xác nhận trong báo giá.',
} as const

/* ── 09 · Number registration / documentation ───────────────────── */

/** §D applies: ordered steps, no duration on any step and no total. */
export const INTL_REGISTRATION = {
  eyebrow: 'ĐĂNG KÝ ĐẦU SỐ',
  h2: 'Quy trình chuẩn bị hồ sơ và đăng ký đầu số theo từng thị trường',
  description:
    'Đăng ký đầu số quốc tế là một quy trình có hồ sơ, không phải một thao tác cấu hình. Gcalls hỗ trợ doanh nghiệp xác định và hoàn thiện các bước dưới đây.',
  steps: [
    { n: '01', title: 'Xác định thị trường và loại đầu số cần đăng ký' },
    { n: '02', title: 'Nhận danh mục giấy tờ theo yêu cầu của thị trường đó' },
    { n: '03', title: 'Doanh nghiệp chuẩn bị hồ sơ pháp lý và thông tin sử dụng' },
    { n: '04', title: 'Gcalls rà soát hồ sơ trước khi gửi' },
    { n: '05', title: 'Gửi hồ sơ tới nhà cung cấp hoặc cơ quan quản lý liên quan' },
    { n: '06', title: 'Bổ sung thông tin nếu hồ sơ được yêu cầu làm rõ' },
    { n: '07', title: 'Đầu số được cấp và bàn giao để cấu hình' },
  ],
  note: 'Thời gian xử lý phụ thuộc vào quốc gia, loại đầu số và tính đầy đủ của hồ sơ, nên không có mốc thời gian chung cho mọi thị trường. Gcalls thông báo yêu cầu và tiến độ theo từng hồ sơ cụ thể.',
} as const

/* ── 10 · Operational management ────────────────────────────────── */

export const INTL_OPERATIONS = {
  eyebrow: 'QUẢN LÝ VẬN HÀNH',
  h2: 'Quản lý đầu số, đội ngũ và hoạt động gọi ở nhiều thị trường trong một nền tảng',
  description:
    'Khi doanh nghiệp vận hành nhiều thị trường, phần khó không chỉ là có đầu số mà là quản lý hoạt động liên lạc một cách thống nhất.',
  items: [
    {
      n: '01',
      title: 'Quản lý danh mục đầu số',
      detail:
        'Theo dõi các đầu số đang sử dụng và mục đích sử dụng của từng đầu số theo thị trường.',
    },
    {
      n: '02',
      title: 'Phân quyền và phân công đội ngũ',
      detail:
        'Gán đầu số hoặc luồng gọi cho nhóm phụ trách tương ứng theo cấu hình doanh nghiệp thiết lập.',
    },
    {
      n: '03',
      title: 'Theo dõi hoạt động cuộc gọi',
      detail:
        'Xem hoạt động nghe gọi và lưu lượng theo đầu số hoặc theo nhóm, theo phạm vi dữ liệu hệ thống ghi nhận.',
    },
    {
      n: '04',
      title: 'Lịch sử tương tác tập trung',
      detail:
        'Giữ lịch sử trao đổi với khách hàng ở các thị trường khác nhau trong cùng một nơi để đội ngũ tiếp tục follow-up.',
    },
  ],
} as const

/* ── 11 · International use cases ───────────────────────────────── */

/** The four purposes evidenced by the estimator's `intlPurpose` field. */
export const INTL_USE_CASES = {
  eyebrow: 'NHU CẦU THƯỜNG GẶP',
  h2: 'Doanh nghiệp dùng tổng đài quốc tế cho những bài toán nào',
  items: [
    {
      role: 'Local presence',
      flow: 'Doanh nghiệp muốn khách hàng tại thị trường nước ngoài thấy một đầu số quen thuộc để dễ liên hệ.',
    },
    {
      role: 'Sales',
      flow: 'Đội bán hàng gọi ra tới khách hàng và đối tác ở thị trường quốc tế từ cùng một hệ thống.',
    },
    {
      role: 'Customer Service',
      flow: 'Đội CSKH tiếp nhận yêu cầu từ khách hàng nước ngoài và theo dõi lịch sử hỗ trợ tập trung.',
    },
    {
      role: 'BPO / Operations',
      flow: 'Đơn vị vận hành dịch vụ cho khách hàng ở nhiều quốc gia cần nhiều đầu số và phân công theo dự án.',
    },
  ],
} as const

/* ── 12 · Product boundaries ────────────────────────────────────── */

export const INTL_BOUNDARIES = {
  eyebrow: 'CHỌN ĐÚNG GIẢI PHÁP',
  h2: 'Tổng đài quốc tế giải quyết bài toán thị trường, không thay thế các luồng tích hợp',
  items: [
    {
      product: 'Tổng đài quốc tế',
      need: 'Doanh nghiệp cần đầu số và cấu hình liên lạc cho một hoặc nhiều thị trường nước ngoài.',
      path: ROUTES.internationalCalling,
      /** This page. Rendered as a marked card, never as a self-link. */
      current: true,
    },
    {
      product: 'Gcalls Plus Webphone',
      need: 'Đội ngũ cần kênh nghe gọi trên trình duyệt và quản lý hoạt động cuộc gọi.',
      path: ROUTES.gcallsPlus,
    },
    {
      product: 'CRM Integration',
      need: 'Sales/CSKH vận hành quanh lead, contact và workflow quản lý khách hàng.',
      path: ROUTES.crmIntegration,
    },
    {
      product: 'Gcalls CX',
      need: 'Doanh nghiệp cần hội thoại tập trung trên nhiều kênh giao tiếp, không chỉ kênh thoại.',
      path: ROUTES.gcallsCx,
    },
  ],
  related: {
    lead: 'Các luồng liên quan khác:',
    links: [
      { label: 'Tích hợp Helpdesk', path: ROUTES.helpdeskIntegration },
      { label: 'Tích hợp POS', path: ROUTES.posIntegration },
      { label: 'Xem tất cả giải pháp', path: ROUTES.solutions },
    ],
  },
} as const

/* ── 13 · Deployment ────────────────────────────────────────────── */

/** §D applies: no timeline is promised on any step or in total. */
export const INTL_DEPLOYMENT = {
  eyebrow: 'TRIỂN KHAI',
  h2: 'Triển khai theo từng thị trường và theo quy định áp dụng',
  steps: [
    { n: '01', title: 'Trao đổi nhu cầu và thị trường mục tiêu' },
    { n: '02', title: 'Khảo sát quy định và loại đầu số theo từng quốc gia' },
    { n: '03', title: 'Xác định phạm vi triển khai và cấu hình cần thiết' },
    { n: '04', title: 'Chuẩn bị và gửi hồ sơ đăng ký đầu số' },
    { n: '05', title: 'Cấu hình luồng gọi vào và gọi ra' },
    { n: '06', title: 'Kiểm thử theo từng đầu số và từng thị trường' },
    { n: '07', title: 'Hướng dẫn đội Sales/CSKH sử dụng' },
    { n: '08', title: 'Đưa vào vận hành và theo dõi' },
  ],
} as const

/* ── 14 · Configuration & cost ──────────────────────────────────── */

/**
 * Deep link that pre-selects International Calling in the shared estimator.
 *
 * The estimator's internal solution id is already `international`
 * (`src/data/estimator.ts`), so no slug alias is needed — unlike the CRM,
 * Helpdesk, POS and CX pages.
 */
export const INTL_ESTIMATOR_HREF = `${ROUTES.costEstimator}?product=international`

/**
 * Cost. The four factors are exactly the ones the approved pricing FAQ names:
 * quốc gia, loại đầu số, hồ sơ đăng ký, lưu lượng. No rate, no saving.
 */
export const INTL_PRICING = {
  eyebrow: 'CẤU HÌNH & CHI PHÍ',
  h2: 'Chi phí phụ thuộc vào quốc gia, loại đầu số, hồ sơ đăng ký và lưu lượng sử dụng',
  description:
    'Mỗi thị trường có mức cước và yêu cầu hồ sơ riêng, nên chi phí được xác định theo phạm vi triển khai thực tế: số thị trường, số đầu số, loại đầu số và lưu lượng gọi dự kiến. Gcalls xác nhận yêu cầu trước khi đưa ra báo giá chính thức.',
  factors: [
    'Quốc gia / thị trường',
    'Loại đầu số',
    'Hồ sơ đăng ký',
    'Lưu lượng gọi',
  ],
  primaryCta: { label: 'Ước tính cấu hình & chi phí', path: INTL_ESTIMATOR_HREF },
  secondaryCta: { label: 'Xem bảng giá Gcalls', path: ROUTES.pricing },
} as const

/* ── 15 · Trust ─────────────────────────────────────────────────── */

/**
 * Trust — NEUTRAL (§TR).
 *
 * No international customer case, logo, quote, coverage count, saving figure,
 * SLA or uptime number exists in this repository, so none appears. What this
 * section offers instead is the honest operating position: the work is a
 * per-market survey, and Gcalls does it before committing to anything.
 */
export const INTL_TRUST = {
  eyebrow: 'CÁCH GCALLS LÀM VIỆC',
  h2: 'Mỗi thị trường được khảo sát trước khi cam kết phạm vi triển khai',
  description:
    'Thay vì đưa ra một danh sách quốc gia chung, Gcalls kiểm tra điều kiện thực tế của từng thị trường doanh nghiệp cần: loại đầu số khả dụng, hồ sơ theo quy định hiện hành và cấu hình phù hợp với quy trình vận hành. Phạm vi và chi phí chỉ được xác nhận sau bước này.',
  cta: { label: 'Trao đổi về thị trường doanh nghiệp cần' },
  links: [
    { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
    { label: 'Xem tất cả giải pháp', path: ROUTES.solutions },
  ],
} as const

/* ── 16 · FAQ ───────────────────────────────────────────────────── */

export interface IntlFaqItem {
  q: string
  a: string
  link?: { label: string; path: string }
}

/**
 * FAQ — seven approved questions.
 *
 * Deliberately answers the three questions the withheld claims used to answer
 * (how many countries, how fast, how much cheaper) by SCOPE rather than by
 * number, because no number is evidenced.
 */
export const INTL_FAQ: IntlFaqItem[] = [
  {
    q: 'Tổng đài quốc tế là gì?',
    a: 'Tổng đài quốc tế là mô hình tổng đài doanh nghiệp sử dụng đầu số và cấu hình liên lạc gắn với thị trường nước ngoài, để đội ngũ nhận và thực hiện cuộc gọi với khách hàng quốc tế trong cùng một hệ thống.',
  },
  {
    q: 'Gcalls hỗ trợ đầu số tại những quốc gia nào?',
    a: 'Khả năng cung cấp đầu số phụ thuộc vào quy định và điều kiện tại từng quốc gia, nên Gcalls xác nhận theo từng yêu cầu cụ thể thay vì công bố một danh sách chung. Doanh nghiệp cho biết thị trường cần triển khai, Gcalls sẽ khảo sát và phản hồi phạm vi khả thi.',
  },
  {
    q: 'Doanh nghiệp cần chuẩn bị hồ sơ gì để đăng ký đầu số quốc tế?',
    a: 'Danh mục giấy tờ khác nhau tùy quốc gia và tùy loại đầu số. Thông thường liên quan tới hồ sơ pháp lý của doanh nghiệp và thông tin về mục đích sử dụng. Gcalls hỗ trợ khảo sát thủ tục và cung cấp danh mục cụ thể cho thị trường được yêu cầu.',
  },
  {
    q: 'Mất bao lâu để có đầu số quốc tế?',
    a: 'Thời gian phụ thuộc vào quốc gia, loại đầu số và tính đầy đủ của hồ sơ, nên không có mốc thời gian áp dụng cho mọi thị trường. Gcalls thông báo yêu cầu và tiến độ theo từng hồ sơ cụ thể.',
  },
  {
    q: 'Chi phí tổng đài quốc tế được tính như thế nào?',
    a: 'Chi phí phụ thuộc vào quốc gia, loại đầu số, hồ sơ đăng ký và lưu lượng sử dụng tại từng thị trường. Doanh nghiệp có thể dùng công cụ ước tính để chuẩn bị cấu hình trước khi nhận báo giá chính thức.',
    link: { label: 'Ước tính chi phí', path: INTL_ESTIMATOR_HREF },
  },
  {
    q: 'Khách hàng ở nước ngoài sẽ thấy số nào khi doanh nghiệp gọi ra?',
    a: 'Số hiển thị phụ thuộc vào cấu hình đầu số và quy định về hiển thị số tại quốc gia được gọi đến. Gcalls sẽ xác nhận cách hiển thị khả thi cho từng thị trường trong quá trình khảo sát.',
  },
  {
    q: 'Tổng đài quốc tế khác gì so với Gcalls Plus Webphone?',
    a: 'Gcalls Plus là lớp nghe gọi và quản lý hoạt động cuộc gọi cho đội ngũ. Tổng đài quốc tế giải quyết bài toán đầu số và cấu hình liên lạc cho thị trường nước ngoài, và được triển khai cùng lớp nghe gọi đó.',
    link: { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
  },
]

/* ── 17 · Final CTA ────────────────────────────────────────────── */

export const INTL_FINAL_CTA = {
  eyebrow: 'INTERNATIONAL CALLING',
  h2: 'Cho Gcalls biết thị trường doanh nghiệp cần, phần thủ tục để Gcalls khảo sát',
  description:
    'Chia sẻ quốc gia cần hiện diện, mục đích sử dụng và quy mô đội ngũ để Gcalls xác định loại đầu số, hồ sơ cần chuẩn bị và phạm vi triển khai phù hợp.',
  primaryCta: { label: 'Đăng ký tư vấn tổng đài quốc tế', path: ROUTES.contact },
  secondaryCta: { label: 'Ước tính cấu hình', path: INTL_ESTIMATOR_HREF },
} as const

/* ------------------------------------------------------------------ *
 * Structured data
 * ------------------------------------------------------------------ */

/**
 * Four nodes only — Service is the accurate top-level type for a
 * telecommunications configuration offering, plus SoftwareApplication,
 * BreadcrumbList and FAQPage.
 *
 * Deliberately emits NO `areaServed`, no country list, no Offer, no price, no
 * AggregateRating, no Review and no SLA/uptime property. `areaServed` in
 * particular would be a machine-readable coverage claim, which §M forbids.
 */
export function buildIntlJsonLd(origin: string) {
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
            name: 'Tổng đài quốc tế',
            item: `${origin}${ROUTES.internationalCalling}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: 'Tổng đài quốc tế',
        serviceType: 'International Business Calling',
        description: INTL_DIRECT_ANSWER.answer,
        provider: { '@type': 'Organization', name: 'Gcalls' },
        url: `${origin}${ROUTES.internationalCalling}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Gcalls International Calling',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'International Business Telephony',
        operatingSystem: 'Web browser',
        description: INTL_NUMBER_CONCEPT.description,
        url: `${origin}${ROUTES.internationalCalling}`,
        featureList: INTL_OPERATIONS.items.map((item) => item.title),
        provider: { '@type': 'Organization', name: 'Gcalls' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: INTL_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
