/**
 * Approved content for /tich-hop/salesforce/ — Checkpoint INT-02.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED.
 * ---------------------------------------------------------------------------
 * Every string below comes from the approved INT-02 source. Do not rewrite,
 * shorten, paraphrase or "improve" it, and do not add capabilities, Salesforce
 * objects, synced fields, editions, plans or benefits that are not here.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING (INT-02 §27)
 * ---------------------------------------------------------------------------
 * Never publish without explicit current evidence:
 *   "tăng 25–30% hiệu suất" · "tăng 30–50% hiệu suất" · "đồng bộ 100%" ·
 *   "zero manual work" / "xóa bỏ hoàn toàn nhập liệu thủ công" ·
 *   "cài đặt trong vài phút" / any fixed setup duration ·
 *   "hỗ trợ mọi gói / mọi edition Salesforce" · "đồng bộ toàn bộ object" ·
 *   "đối tác chính thức của Salesforce" · "được Salesforce chứng nhận" ·
 *   any AppExchange listing wording · "real-time guaranteed" · customer counts.
 *
 * Required register instead: "giảm thao tác", "hỗ trợ", "có thể", "theo cấu
 * hình", "khi tích hợp được cấu hình", "theo phạm vi tích hợp", "tùy workflow".
 *
 * Historical Gcalls Salesforce marketing material is NOT a source of copy. It
 * was read only as a list of claims to TEST; every numeric claim and every
 * unverifiable capability it carried is withheld below.
 *
 * ---------------------------------------------------------------------------
 * EVIDENCE BASE
 * ---------------------------------------------------------------------------
 * Salesforce evidence in this repository:
 *
 *  - `src/data/estimator.ts`, solution `crm`: a `crmPlatform` select naming
 *    HubSpot, SALESFORCE, Zoho CRM and "Khác", and a `crmNeeds` multi-select
 *    enumerating EXACTLY FOUR integration needs — Click-to-Call, Customer
 *    context, Call history, Workflow integration.
 *  - `src/data/crmIntegration.ts` (S01, approved): three verified CRM
 *    capabilities — Click-to-Call, Customer Popup, Interaction History Sync —
 *    each already worded conditionally, plus Salesforce named as a routed CRM
 *    platform with CONNECTION SCOPE ONLY.
 *  - `src/components/product-ui`: the approved Gcalls-side customer-popup and
 *    call-activity surfaces used on Home, S01 and INT-01.
 *
 * The four capabilities published below map 1:1 onto that evidence. Nothing
 * beyond it is claimed. Note what the evidence does NOT contain: no Salesforce
 * object list, no edition/licence tier, no API mechanism, no partner status.
 *
 * ---------------------------------------------------------------------------
 * EVIDENCE GATES — ALL THREE CLOSED (do not reverse without evidence)
 * ---------------------------------------------------------------------------
 * SALESFORCE POPUP (§11) — CONTEXT ONLY, automatic popup NOT claimed.
 * INT-02 §11 notes that SEO material treats "popup khách hàng Salesforce" as a
 * core topic. What this repository actually evidences is the S01 CRM-layer
 * capability "Customer Popup", worded conditionally ("Hiển thị thông tin khách
 * hàng liên quan khi có cuộc gọi"), plus the estimator's `customer-context`
 * need. That is CRM-GENERIC evidence. Nothing evidences Salesforce-specific
 * popup behaviour, and nothing evidences that the display is AUTOMATIC on an
 * incoming call for a Salesforce org.
 *
 * Decisively, INT-01 faced the identical evidence standing for HubSpot — also
 * one of the same three estimator platforms — and published conservative
 * "Customer Context" wording rather than a popup capability or a popup section.
 * Reversing that here for Salesforce, on no additional evidence, would make the
 * two pages assert different product behaviour from one shared evidence base.
 *
 * So: no dedicated popup section renders, the word "popup" does not appear, and
 * capability 02 and FAQ 3 stay in the customer-context register. The Home page
 * line "Gcalls tự động kéo thông tin từ CRM và hiển thị popup ngay lập tức" is
 * NOT treated as an evidence base — S01 already declined recording sync despite
 * a comparable Home claim, and that precedent is followed here.
 *
 * SMS / BRANDNAME (§12) — WITHHELD COMPLETELY.
 * Historical public material mentions SMS Brandname alongside the Salesforce
 * integration. §12 forbids inheriting it automatically, and it cannot be
 * verified here. The only SMS evidence anywhere in this project belongs to a
 * DIFFERENT product — Gcalls CX, where SMS is one of five omnichannel channels
 * (`src/data/gcallsCx.ts`, estimator field `channels`). Pulling a Gcalls CX
 * channel onto a CRM integration page is the cross-product inheritance S03 §12
 * forbade for POS and INT-01 §12 forbade for HubSpot. Decisively: the approved
 * `crmNeeds` field enumerates four needs and SMS is not one of them.
 * The rendered page therefore contains NO occurrence of "SMS" or "Brandname",
 * and nothing implies SMS is part of any deployment.
 *
 * RECORDING SYNC (§13) — WITHHELD.
 * Historical SEO content mentions recording synchronisation. No implementation
 * evidence exists here: `crmNeeds` enumerates four needs and recording is not
 * one of them, and both S01 §10 and S02 §12 already resolved this same gate
 * NEGATIVE on the same evidence. The approved conditional sentence from §13 is
 * therefore NOT published, and FAQ 5 uses the §13 "IF NOT VERIFIED" wording.
 *
 * PARTNERSHIP / CERTIFICATION / APPEXCHANGE — NOT PUBLISHED. No partner status,
 * certification or marketplace-listing evidence exists anywhere in this
 * repository. Naming Salesforce asserts CONNECTION EXPERIENCE ONLY, exactly as
 * S01 established and INT-01 repeated.
 *
 * EDITION / PLAN COVERAGE — NOT PUBLISHED. Nothing evidences which Salesforce
 * editions, licences or clouds support the integration, so none is named and no
 * "every edition" claim appears. §18 forbids it explicitly.
 *
 * ---------------------------------------------------------------------------
 * SEO OWNERSHIP
 * ---------------------------------------------------------------------------
 * This page owns Salesforce-specific commercial intent (BOFU): "tổng đài tích
 * hợp Salesforce", "Gcalls Salesforce", "Salesforce call center", "tích hợp
 * Gcalls Salesforce", "click to call Salesforce", "gọi điện trên Salesforce",
 * "đồng bộ cuộc gọi Salesforce", "Salesforce CRM call integration",
 * "call history Salesforce".
 *
 * Generic CRM intent ("tổng đài tích hợp CRM") belongs to
 * /tong-dai-tich-hop-crm/ and is NOT competed for here — §20's routing block
 * exists to hand that visitor over rather than keep them. HubSpot and Zoho
 * intent belongs to their own pages; they appear once, as routed links, never as
 * comparison claims.
 *
 * Legacy canonicals /gcalls-tich-hop-salesforce/ and
 * /tong-dai-tich-hop-salesforce/ are NOT used. The canonical is derived from the
 * route by `buildCanonical`, so it is `https://gcalls.co/tich-hop/salesforce/`.
 *
 * ---------------------------------------------------------------------------
 * BOUNDARIES
 * ---------------------------------------------------------------------------
 * This page owns the Salesforce workflow. Generic CRM evaluation belongs to CRM
 * Integration, the calling layer itself to Gcalls Plus, AI-supported call
 * quality review to QA QC Center, and multi-channel conversations to Gcalls CX.
 * This page does not introduce, teach, review or compare Salesforce, and QA is
 * never presented as a Salesforce-native feature (§17).
 */

import { ROUTES } from '@/config/navigation'

/**
 * Conversion context for Salesforce Integration CTAs (§6, §25, §28).
 *
 * NO Salesforce-specific `LeadSource` exists in the shared model
 * (`src/lib/leads/types.ts`), and inventing an untyped string would break
 * normalisation on the way to the server — so the MOST SPECIFIC VALID member
 * already supported is used: `crm_integration`.
 *
 * The platform itself is carried in `product`, the only typed slot that both
 * survives normalisation and is rendered back to the visitor (via the
 * `PRODUCT_DISPLAY_LABELS` allow-list in `src/lib/leads/ctaLink.ts` — the
 * Salesforce entry there is what makes §28's "Salesforce context is visible on
 * the Contact form" true rather than merely present in the URL).
 *
 * `solution` stays at the approved `LEAD_NEEDS` value so the form's "Nhu cầu"
 * select still pre-selects; the shared form resolves `product`, then falls back
 * to `solution`.
 *
 * Two contexts because §25 asks for two different intents on the final band.
 */
export const SALESFORCE_DEMO_LEAD = {
  intent: 'demo',
  source: 'crm_integration',
  product: 'Salesforce',
  solution: 'Tích hợp CRM',
} as const

export const SALESFORCE_CONSULT_LEAD = {
  intent: 'consultation',
  source: 'crm_integration',
  product: 'Salesforce',
  solution: 'Tích hợp CRM',
} as const

/* ── 01 · Hero (§6) ─────────────────────────────────────────────── */

export const SF_HERO = {
  eyebrow: 'GCALLS × SALESFORCE',
  h1: 'Tổng đài tích hợp Salesforce cho đội Sales và Customer Service',
  description:
    'Kết nối chức năng nghe gọi của Gcalls với Salesforce để nhân viên có thể thực hiện cuộc gọi, nhận biết customer context và theo dõi hoạt động tương tác gần hơn với quy trình CRM đang sử dụng.',
  valuePoints: [
    {
      title: 'Gọi từ customer record',
      detail:
        'Click-to-Call giúp nhân viên bắt đầu cuộc gọi từ dữ liệu đang xử lý trong Salesforce khi tích hợp được cấu hình.',
    },
    {
      title: 'Có context khi cuộc gọi bắt đầu',
      detail:
        'Thông tin liên quan giúp nhân viên nhận biết khách hàng trước hoặc trong quá trình trao đổi.',
    },
    {
      title: 'Giữ call activity gần CRM',
      detail:
        'Dữ liệu tương tác phù hợp có thể được ghi nhận theo phạm vi tích hợp để đội ngũ tiếp tục follow-up trong Salesforce.',
    },
  ],
  primaryCta: { label: 'Xem demo tích hợp Salesforce' },
  secondaryCta: { label: 'Xem workflow tích hợp', href: '#workflow-salesforce' },
} as const

/* ── 02 · Direct answer / AIO (§7) ──────────────────────────────── */

/** Plain rendered HTML. Never hidden in tabs or an accordion. */
export const SF_DIRECT_ANSWER = {
  question: 'Tổng đài tích hợp Salesforce là gì?',
  answer:
    'Tổng đài tích hợp Salesforce kết nối chức năng nghe gọi của Gcalls với quy trình CRM Salesforce để nhân viên có thể thực hiện cuộc gọi từ customer record, nhận biết khách hàng khi có cuộc gọi và ghi nhận dữ liệu tương tác phù hợp vào workflow đang sử dụng. Phạm vi chức năng phụ thuộc vào cấu hình Gcalls, Salesforce và yêu cầu triển khai của doanh nghiệp.',
} as const

/* ── 03 · Business problems (§8) ────────────────────────────────── */

/** Descriptive only — §8 forbids productivity percentages. None appears. */
export const SF_PROBLEMS = {
  eyebrow: 'BÀI TOÁN ENTERPRISE CRM',
  h2: 'Salesforce quản lý quy trình khách hàng, nhưng cuộc gọi vẫn có thể nằm ngoài dữ liệu CRM',
  items: [
    {
      n: '01',
      title: 'Nhân viên phải copy số để gọi',
      detail:
        'Customer record nằm trong Salesforce nhưng thao tác nghe gọi diễn ra ở một hệ thống riêng, tạo thêm bước trong quy trình Sales và Service.',
    },
    {
      n: '02',
      title: 'Cuộc gọi đến thiếu customer context',
      detail:
        'Khi call system chưa kết nối phù hợp, nhân viên cần tìm lại hồ sơ trước khi hiểu người đang liên hệ.',
    },
    {
      n: '03',
      title: 'Call history bị phân mảnh',
      detail:
        'Thông tin cuộc gọi nằm ngoài Salesforce khiến đội ngũ khó nhìn lại đầy đủ quá trình tương tác với khách hàng.',
    },
    {
      n: '04',
      title: 'Dữ liệu khó tiếp tục khi ownership thay đổi',
      detail:
        'Khi lịch sử liên hệ không nằm gần customer record, nhân viên tiếp nhận mới có thể thiếu bối cảnh để tiếp tục follow-up.',
    },
  ],
} as const

/* ── 04 · Overview (§9) ─────────────────────────────────────────── */

/**
 * Overview and core flow.
 *
 * The six flow NODES are the approved §9 chain verbatim. The one-line details
 * under each node are the minimum the shared `IntegrationWorkflow` component
 * requires; each restates the node in the approved conditional register and
 * adds no capability beyond §10.
 */
export const SF_OVERVIEW = {
  eyebrow: 'GCALLS FOR SALESFORCE',
  h2: 'Đưa lớp giao tiếp thoại vào workflow Salesforce',
  description:
    'Salesforce tiếp tục là hệ thống quản lý khách hàng và quy trình. Gcalls bổ sung lớp nghe gọi để cuộc hội thoại và dữ liệu tương tác được đặt gần hơn với customer record đang được xử lý.',
  flow: [
    {
      n: '01',
      label: 'Salesforce record',
      detail: 'Nhân viên làm việc trên dữ liệu đang được quản lý trong Salesforce.',
    },
    {
      n: '02',
      label: 'Click-to-Call',
      detail: 'Cuộc gọi bắt đầu từ customer record khi tích hợp được cấu hình.',
    },
    {
      n: '03',
      label: 'Gcalls conversation',
      detail: 'Gcalls xử lý lớp giao tiếp thoại.',
    },
    {
      n: '04',
      label: 'Customer context',
      detail: 'Thông tin liên quan hỗ trợ nhân viên trong cuộc trao đổi.',
    },
    {
      n: '05',
      label: 'Call activity',
      detail: 'Dữ liệu tương tác phù hợp được ghi nhận theo phạm vi tích hợp.',
    },
    {
      n: '06',
      label: 'Sales / Service follow-up',
      detail: 'Đội ngũ tiếp tục workflow trong Salesforce.',
    },
  ],
} as const

/* ── 05 · Verified core capabilities (§10) ──────────────────────── */

/**
 * Exactly four — each mapped to the evidence base in the file header.
 *
 * Capability 02 is deliberately "Incoming Customer Context", NOT a popup: the
 * §11 gate is CONTEXT ONLY. SMS (§12) and recording sync (§13) are absent for
 * the same reason. Every description defers to configuration, so no capability
 * reads as guaranteed on every Salesforce org.
 */
export const SF_CAPABILITIES = {
  eyebrow: 'TÍNH NĂNG TÍCH HỢP',
  h2: 'Những năng lực cốt lõi khi kết nối Gcalls với Salesforce',
  items: [
    {
      n: '01',
      title: 'Click-to-Call',
      detail:
        'Bắt đầu cuộc gọi từ số điện thoại hoặc customer record trong Salesforce khi integration được cấu hình phù hợp.',
    },
    {
      n: '02',
      title: 'Incoming Customer Context',
      detail:
        'Thông tin liên quan hỗ trợ nhân viên nhận biết khách hàng khi cuộc gọi đến và truy cập customer record phù hợp.',
    },
    {
      n: '03',
      title: 'Call Activity',
      detail:
        'Dữ liệu cuộc gọi phù hợp có thể được ghi nhận hoặc liên kết theo phạm vi tích hợp.',
    },
    {
      n: '04',
      title: 'Interaction History',
      detail:
        'Lịch sử tương tác giúp Sales và Service tiếp tục xử lý với nhiều bối cảnh hơn thay vì duy trì một lịch sử riêng bên ngoài CRM.',
    },
  ],
} as const

/* ── 06 · Workflow (§14) ────────────────────────────────────────── */

export const SF_WORKFLOW = {
  anchorId: 'workflow-salesforce',
  eyebrow: 'QUY TRÌNH',
  h2: 'Từ Salesforce record đến cuộc gọi và bước xử lý tiếp theo',
  steps: [
    {
      n: '01',
      title: 'Mở lead, contact hoặc customer record',
      detail: 'Nhân viên tiếp tục làm việc trên dữ liệu được quản lý trong Salesforce.',
    },
    {
      n: '02',
      title: 'Bắt đầu hoặc tiếp nhận cuộc gọi',
      detail:
        'Click-to-Call hoặc lớp call integration hỗ trợ hoạt động thoại theo cấu hình triển khai.',
    },
    {
      n: '03',
      title: 'Xem customer context',
      detail: 'Thông tin liên quan giúp nhân viên hiểu khách hàng và lịch sử trước đó.',
    },
    {
      n: '04',
      title: 'Thực hiện cuộc hội thoại',
      detail: 'Gcalls xử lý lớp giao tiếp thoại trong workflow được triển khai.',
    },
    {
      n: '05',
      title: 'Ghi nhận call activity phù hợp',
      detail:
        'Dữ liệu cuộc gọi có thể được liên kết hoặc ghi nhận theo phạm vi tích hợp.',
    },
    {
      n: '06',
      title: 'Tiếp tục Sales hoặc Service workflow',
      detail:
        'Nhân viên follow-up trong Salesforce thay vì duy trì dữ liệu cuộc gọi ở một luồng riêng.',
    },
  ],
} as const

/* ── 07 · Before / after (§15) ──────────────────────────────────── */

/**
 * A WORKFLOW ILLUSTRATION, not a measurement. §15 forbids attaching an ROI
 * percentage, and the shared component renders no metrics slot, so one cannot
 * be added here without also changing that component.
 */
export const SF_BEFORE_AFTER = {
  eyebrow: 'TRƯỚC & SAU TÍCH HỢP',
  h2: 'Giảm những bước chuyển đổi thủ công giữa Salesforce và hệ thống gọi',
  before: {
    label: 'Trước tích hợp',
    steps: [
      'Salesforce record',
      'Copy phone number',
      'Call tool',
      'Conversation',
      'Manual note',
      'Quay lại Salesforce',
      'Cập nhật follow-up',
    ],
  },
  after: {
    label: 'Sau tích hợp',
    steps: [
      'Salesforce record',
      'Click-to-Call',
      'Conversation',
      'Call activity',
      'Workflow tiếp tục',
    ],
  },
} as const

/* ── 08 · Benefits (§16) ────────────────────────────────────────── */

/**
 * Four conservative statements, exactly as approved. No percentage, time-saved
 * or efficiency figure — the shared `IntegrationBenefits` component takes plain
 * strings, so there is no slot to smuggle a number into.
 */
export const SF_BENEFITS = {
  eyebrow: 'GIÁ TRỊ VẬN HÀNH',
  h2: 'Giữ dữ liệu cuộc gọi gần hơn với quy trình Sales và Service',
  items: [
    'Giảm thao tác copy số',
    'Có customer context trước cuộc hội thoại',
    'Theo dõi call activity tập trung hơn',
    'Dễ tiếp tục xử lý khi ownership thay đổi',
  ],
} as const

/* ── 09 · Use cases (§17) ───────────────────────────────────────── */

/**
 * Four workflows. No conversion percentage and no result claim.
 *
 * QA is deliberately NOT one of them: §17 forbids presenting call-quality
 * review as a Salesforce-native feature. `SF_USE_CASES.qaNote` carries the
 * contextual hand-off to QA QC Center instead.
 */
export const SF_USE_CASES = {
  eyebrow: 'TÌNH HUỐNG SỬ DỤNG',
  h2: 'Gcalls × Salesforce phù hợp với những workflow nào?',
  items: [
    {
      role: 'Enterprise Sales',
      flow: 'Sales làm việc với lead và opportunity trong Salesforce, thực hiện cuộc gọi và tiếp tục follow-up từ customer context hiện có.',
    },
    {
      role: 'Sales Operations',
      flow: 'Đội vận hành có thêm dữ liệu cuộc gọi phù hợp để theo dõi quy trình tương tác gần hơn với CRM.',
    },
    {
      role: 'Customer Service',
      flow: 'Agent sử dụng customer record và lịch sử liên quan để có thêm context khi tiếp nhận cuộc gọi.',
    },
    {
      role: 'Account Management',
      flow: 'Người phụ trách tài khoản có thể giữ hoạt động liên hệ gần hơn với dữ liệu và quá trình chăm sóc khách hàng.',
    },
  ],
  qaNote: {
    lead: 'Đánh giá chất lượng cuộc gọi không phải là chức năng của lớp tích hợp Salesforce. Nhu cầu này thuộc về',
    link: { label: 'QA QC Center', path: ROUTES.qcCenter },
  },
} as const

/* ── 10 · Setup (§18) ───────────────────────────────────────────── */

/**
 * Setup process — nine steps, no duration on any step or in total (§18).
 *
 * Step 5 says "quyền truy cập / API" only. No specific object, field, API
 * version, credential or connection mechanism is named, because nothing in this
 * repository evidences which is current for Salesforce. The note also refuses
 * the edition-coverage claim §18 forbids.
 */
export const SF_SETUP = {
  eyebrow: 'THIẾT LẬP',
  h2: 'Tích hợp theo cấu hình Salesforce và workflow doanh nghiệp đang sử dụng',
  steps: [
    { n: '01', title: 'Khảo sát Salesforce workflow' },
    { n: '02', title: 'Xác định object/record liên quan' },
    { n: '03', title: 'Xác định user và hotline' },
    { n: '04', title: 'Xác định capability cần tích hợp' },
    { n: '05', title: 'Kiểm tra quyền truy cập/API' },
    { n: '06', title: 'Cấu hình integration' },
    { n: '07', title: 'Kiểm thử cuộc gọi và dữ liệu' },
    { n: '08', title: 'Hướng dẫn người dùng' },
    { n: '09', title: 'Go-live' },
  ],
  note: 'Phạm vi và thời gian triển khai phụ thuộc vào object, permission, số lượng người dùng, hotline và capability cần sử dụng, nên được xác định sau bước khảo sát thay vì theo một mốc cố định. Gcalls không mặc định mọi edition hoặc gói Salesforce đều hỗ trợ cùng một phạm vi tích hợp.',
} as const

/* ── 11 · UI preview (§19) ──────────────────────────────────────── */

/**
 * UI preview copy.
 *
 * §19 sets a preference order for the visual, and tiers 1–2 are BOTH available
 * in this repository, so no conceptual panel is needed in this section: the page
 * uses the approved Gcalls-side customer-context surface plus the approved
 * call-activity surface from `@/components/product-ui`.
 *
 * The note is structural, not decorative: it is what stops a reader inferring
 * these are Salesforce screenshots. §19 forbids fabricating a Salesforce
 * interface and forbids using Salesforce branding as proof of partnership.
 */
export const SF_UI_PREVIEW = {
  eyebrow: 'GIAO DIỆN TÍCH HỢP',
  h2: 'Giữ customer context gần hoạt động nghe gọi',
  description:
    'Các giao diện dưới đây là bề mặt phía Gcalls trong luồng tích hợp: customer context khi có cuộc gọi đến, thao tác gọi từ customer record và hoạt động tương tác được ghi nhận.',
  note: 'Giao diện minh họa phía Gcalls với dữ liệu mẫu. Đây không phải ảnh chụp màn hình Salesforce, và bố cục thực tế phụ thuộc vào cấu hình tích hợp của doanh nghiệp.',
} as const

/* ── 12 · Salesforce vs generic CRM (§20) ───────────────────────── */

export const SF_VS_CRM = {
  eyebrow: 'SALESFORCE-SPECIFIC WORKFLOW',
  h2: 'Trang này dành cho doanh nghiệp đã sử dụng Salesforce',
  description:
    'Nếu doanh nghiệp đang đánh giá tổng đài tích hợp CRM nói chung, hãy xem giải pháp CRM Integration. Trang này tập trung vào cách Gcalls hỗ trợ workflow khi Salesforce đã là hệ thống quản lý khách hàng hiện tại.',
  cta: { label: 'Xem giải pháp Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
} as const

/* ── 13 · Related integrations (§21) ────────────────────────────── */

/** Routing only. No vendor comparison claim of any kind (§21). */
export const SF_RELATED = {
  h2: 'Doanh nghiệp đang sử dụng CRM khác?',
  description:
    'Mỗi nền tảng CRM có cấu trúc dữ liệu và cách kết nối riêng. Xem trang tương ứng với hệ thống doanh nghiệp đang sử dụng.',
  items: [
    {
      name: 'HubSpot',
      detail: 'Kết nối hoạt động nghe gọi với workflow HubSpot.',
      path: ROUTES.hubspot,
    },
    {
      name: 'Zoho CRM',
      detail: 'Kết nối hoạt động nghe gọi với workflow Zoho CRM.',
      path: ROUTES.zohoCrm,
    },
    {
      name: 'Danh mục tích hợp',
      detail: 'Xem toàn bộ nền tảng đang có trang tích hợp riêng.',
      path: ROUTES.integrations,
    },
  ],
} as const

/* ── 14 · Product relationships (§22) ───────────────────────────── */

/**
 * A ROUTING TABLE, not a capability list (§22).
 *
 * It exists so each need reaches the page that owns it, and so this page keeps
 * Salesforce intent instead of competing with the generic CRM page or being
 * mistaken for the calling product itself. The Salesforce row is marked
 * `current` and is never rendered as a self-link.
 */
export const SF_RELATIONSHIPS = {
  eyebrow: 'PHÂN BIỆT SẢN PHẨM',
  h2: 'Salesforce Integration nằm ở đâu trong hệ sản phẩm Gcalls?',
  items: [
    {
      product: 'Gcalls Plus',
      need: 'Lớp nghe gọi trên trình duyệt — phần thực hiện cuộc gọi của doanh nghiệp.',
      path: ROUTES.gcallsPlus,
    },
    {
      product: 'CRM Integration',
      need: 'Giải pháp tích hợp CRM nói chung, khi doanh nghiệp chưa xác định nền tảng.',
      path: ROUTES.crmIntegration,
    },
    {
      product: 'Salesforce Integration',
      need: 'Workflow riêng cho doanh nghiệp đã sử dụng Salesforce làm hệ thống khách hàng.',
      path: ROUTES.salesforce,
      current: true,
    },
    {
      product: 'QA QC Center',
      need: 'Đánh giá chất lượng cuộc gọi với hỗ trợ của AI — không phải chức năng của lớp tích hợp CRM.',
      path: ROUTES.qcCenter,
    },
  ],
} as const

/* ── 15 · Trust (§23) ───────────────────────────────────────────── */

/**
 * Trust — NEUTRAL DEPLOYMENT PROOF ONLY (§23).
 *
 * No partner status, certification, AppExchange listing, customer count or
 * performance percentage. None is evidenced, and §23 requires verification
 * before publishing even if evidence were found.
 */
export const SF_TRUST = {
  eyebrow: 'PHẠM VI TRIỂN KHAI',
  h2: 'Tích hợp Salesforce cần bắt đầu từ object, permission và workflow thực tế',
  description:
    'Object, field, permission, user role và quy trình Sales/Service có thể khác nhau giữa từng Salesforce organization. Phạm vi tích hợp cần được xác định qua khảo sát và kiểm thử thay vì áp dụng một cấu hình giống nhau cho mọi doanh nghiệp.',
  cta: { label: 'Trao đổi về Salesforce workflow hiện tại' },
  links: [
    {
      label: 'Ước tính cấu hình & chi phí',
      path: `${ROUTES.costEstimator}?product=crm-integration`,
    },
    { label: 'Xem bảng giá Gcalls', path: ROUTES.pricing },
  ],
} as const

/* ── 16 · FAQ (§24) ─────────────────────────────────────────────── */

export interface SfFaqItem {
  q: string
  a: string
  link?: { label: string; path: string }
}

/**
 * FAQ — the seven approved questions.
 *
 * FAQ 3 stays in the customer-context register because the §11 popup gate is
 * CONTEXT ONLY. FAQ 5 uses the §13 "IF NOT VERIFIED" wording verbatim because
 * the recording-sync gate is WITHHELD. FAQ 7 answers the duration question by
 * scope, never by a number. Do not rewrite either to assert more.
 */
export const SF_FAQ: SfFaqItem[] = [
  {
    q: 'Tổng đài tích hợp Salesforce là gì?',
    a: 'Đây là mô hình kết nối chức năng nghe gọi của Gcalls với Salesforce để nhân viên có thể thực hiện cuộc gọi, nhận biết customer context và ghi nhận dữ liệu tương tác phù hợp trong workflow CRM.',
  },
  {
    q: 'Gcalls có hỗ trợ Click-to-Call trên Salesforce không?',
    a: 'Trong cấu hình tích hợp phù hợp, nhân viên có thể bắt đầu cuộc gọi từ số điện thoại hoặc customer record đang xử lý trong Salesforce.',
  },
  {
    q: 'Khi khách hàng gọi đến có thể xem thông tin Salesforce không?',
    a: 'Khả năng hiển thị customer context phụ thuộc vào dữ liệu, quyền truy cập và cấu hình tích hợp. Gcalls sẽ xác định phạm vi phù hợp trong quá trình khảo sát.',
  },
  {
    q: 'Lịch sử cuộc gọi có được ghi nhận trong Salesforce không?',
    a: 'Dữ liệu cuộc gọi phù hợp có thể được ghi nhận hoặc liên kết theo phạm vi tích hợp và khả năng của hệ thống.',
  },
  {
    q: 'Ghi âm có được đồng bộ vào Salesforce không?',
    a: 'Khả năng đồng bộ hoặc liên kết bản ghi phụ thuộc vào cấu hình Gcalls, Salesforce và phạm vi triển khai. Gcalls cần kiểm tra hệ thống trước khi xác nhận.',
  },
  {
    q: 'Gcalls có thay thế Salesforce không?',
    a: 'Không. Salesforce tiếp tục là hệ thống CRM của doanh nghiệp; Gcalls bổ sung lớp giao tiếp thoại và dữ liệu cuộc gọi vào workflow đang sử dụng.',
  },
  {
    q: 'Tích hợp Salesforce mất bao lâu?',
    a: 'Thời gian phụ thuộc vào object, permission, số lượng người dùng, hotline, capability cần triển khai và yêu cầu kiểm thử.',
  },
]

/* ── 17 · Final CTA (§25) ───────────────────────────────────────── */

export const SF_FINAL_CTA = {
  eyebrow: 'GCALLS × SALESFORCE',
  h2: 'Xem hoạt động nghe gọi vận hành trong workflow Salesforce của doanh nghiệp',
  description:
    'Chia sẻ object, user role và quy trình Sales/Service hiện tại để Gcalls xác định phạm vi tích hợp và demo phù hợp.',
  primaryCta: { label: 'Xem demo tích hợp Salesforce' },
  secondaryCta: { label: 'Tư vấn tích hợp' },
} as const

/* ── 18 · Onward internal links (§26) ───────────────────────────── */

/**
 * Contextual, not a footer-style link dump (§26).
 *
 * The CRM solution page, the integration hub, HubSpot, Zoho, Gcalls Plus and
 * QA QC Center are already linked from their own dedicated sections above, so
 * they are not repeated here — this row carries only the remaining required
 * destinations.
 */
export const SF_LINKS = {
  h2: 'Xem thêm',
  items: [
    { label: 'Gcalls CX', path: ROUTES.gcallsCx },
    { label: 'Bảng giá Gcalls', path: ROUTES.pricing },
    { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
    { label: 'Blog Gcalls', path: ROUTES.blog },
    { label: 'Liên hệ', path: ROUTES.contact },
  ],
} as const

/* ------------------------------------------------------------------ *
 * Structured data
 * ------------------------------------------------------------------ */

/**
 * Four nodes — BreadcrumbList, Service, SoftwareApplication, FAQPage.
 *
 * Deliberately emits NO Offer, price, AggregateRating, Review, performance
 * metric, partner or certification property. `featureList` carries exactly the
 * four verified capabilities, so the structured data cannot assert more than the
 * visible page does — in particular it does not mention popup, SMS or recording
 * synchronisation.
 */
export function buildSalesforceJsonLd(origin: string) {
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
            name: 'Tích hợp',
            item: `${origin}${ROUTES.integrations}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Salesforce',
            item: `${origin}${ROUTES.salesforce}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: 'Tổng đài tích hợp Salesforce',
        serviceType: 'Salesforce Telephony Integration',
        description: SF_DIRECT_ANSWER.answer,
        provider: { '@type': 'Organization', name: 'Gcalls' },
        url: `${origin}${ROUTES.salesforce}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Gcalls for Salesforce',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'CRM Telephony Integration',
        operatingSystem: 'Web browser',
        description: SF_OVERVIEW.description,
        url: `${origin}${ROUTES.salesforce}`,
        featureList: SF_CAPABILITIES.items.map((c) => c.title),
        provider: { '@type': 'Organization', name: 'Gcalls' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: SF_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
