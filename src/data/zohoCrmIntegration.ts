/**
 * Approved content for /tich-hop/zoho-crm/ — Checkpoint INT-03.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED.
 * ---------------------------------------------------------------------------
 * Every string below comes from the approved INT-03 source. Do not rewrite,
 * shorten, paraphrase or "improve" it, and do not add capabilities, Zoho
 * modules, synced fields, editions, plans or benefits that are not here.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING (INT-03 §25)
 * ---------------------------------------------------------------------------
 * Never publish without explicit current evidence:
 *   Click-to-SMS · automatic popup · recording sync ·
 *   "tăng 25–30% hiệu suất" · "tăng 30–50% hiệu suất" · "đồng bộ 100%" ·
 *   "cài đặt trong vài phút" / any fixed setup duration ·
 *   "hỗ trợ mọi gói / mọi edition Zoho" · "đồng bộ toàn bộ trường dữ liệu" ·
 *   "đối tác chính thức của Zoho" · "được Zoho chứng nhận" ·
 *   any marketplace-listing wording · customer counts.
 *
 * Required register instead: "giảm thao tác", "hỗ trợ", "có thể", "theo cấu
 * hình", "khi integration được cấu hình phù hợp", "theo phạm vi tích hợp",
 * "nơi được hỗ trợ", "tùy workflow".
 *
 * Historical Gcalls Zoho marketing/SEO material is NOT a source of copy. It was
 * read only as a list of claims to TEST; §10 required each capability to be
 * gated independently rather than inherited from HubSpot (INT-01) or Salesforce
 * (INT-02), and two of the five gates closed against publication.
 *
 * ---------------------------------------------------------------------------
 * EVIDENCE BASE
 * ---------------------------------------------------------------------------
 * Zoho CRM evidence in this repository:
 *
 *  - `src/data/estimator.ts`, solution `crm`: a `crmPlatform` select naming
 *    HubSpot, Salesforce, ZOHO CRM and "Khác", and a `crmNeeds` multi-select
 *    enumerating EXACTLY FOUR integration needs — Click-to-Call, Customer
 *    context, Call history, Workflow integration.
 *  - `src/data/crmIntegration.ts` (S01, approved): three verified CRM
 *    capabilities — Click-to-Call, Customer Popup, Interaction History Sync —
 *    each already worded conditionally, plus Zoho CRM named as a routed CRM
 *    platform with CONNECTION SCOPE ONLY.
 *  - `src/data/hubs.ts`: the integration-hub Zoho card, connection scope only.
 *  - `src/components/product-ui`: the approved Gcalls-side customer-record,
 *    customer-context and call-activity surfaces used on Home and S01.
 *
 * The four capabilities published below map onto that evidence. Nothing beyond
 * it is claimed. Note what the evidence does NOT contain: no Zoho module list,
 * no edition/licence tier, no API or marketplace mechanism, no partner status,
 * no SMS, no recording synchronisation.
 *
 * REJECTED FALSE POSITIVE. `docs/WORDPRESS_HEADLESS_AUDIT.md` records that
 * Gcalls' own company MAIL runs on Zoho (`mx.zoho.com`). That is Gcalls'
 * internal email vendor and is NOT evidence of a Zoho CRM product integration,
 * a partnership, or anything else on this page. It was not used.
 *
 * NOT AN EVIDENCE BASE. The Home page markets "Đồng bộ hai chiều với HubSpot,
 * Salesforce, Zoho CRM và Freshsales" and "Đồng bộ liên hệ, lịch sử, ghi âm tự
 * động". S01 already declined recording sync despite that same Home line, so
 * Home marketing copy is not treated as capability evidence here either.
 *
 * ---------------------------------------------------------------------------
 * CAPABILITY EVIDENCE GATES (§10) — GATED INDEPENDENTLY, NOT INHERITED
 * ---------------------------------------------------------------------------
 * A. CLICK-TO-CALL — VERIFIED & PUBLISHED, conditional register.
 * The approved estimator `crmNeeds` field offers Click-to-Call as a scoped
 * integration need for the `crm` solution, whose `crmPlatform` select names Zoho
 * CRM explicitly; S01's approved CRM capability set publishes Click-to-Call in
 * conditional wording on a page that routes Zoho CRM as one of exactly three
 * platforms. That is first-party approved config naming Zoho, not inherited
 * HubSpot/Salesforce copy, and no Zoho-specific counter-evidence exists.
 * Published with the §10A wording verbatim, which is itself conditional.
 * NOT verified, and therefore NOT stated anywhere: the Zoho-side MECHANISM
 * (extension, marketplace app, API, telephony-provider slot). Setup step 5 and
 * FAQ 2 both defer that to survey rather than naming one.
 *
 * B. INCOMING CUSTOMER CONTEXT / POPUP — CONTEXT ONLY.
 * What the repository evidences is the S01 CRM-layer capability "Customer
 * Popup", already worded conditionally, plus the estimator's `customer-context`
 * need. That is CRM-GENERIC. Nothing evidences Zoho-specific popup behaviour and
 * nothing evidences that any display is AUTOMATIC on an incoming call for a Zoho
 * account. INT-01 and INT-02 both resolved this identical gate conservatively on
 * the identical evidence; a third page asserting more from the same base would
 * make the three contradict each other. §10B forbids the word "Popup" unless
 * verified, so it appears NOWHERE on this page. Customer identification is
 * published only with the explicit "nơi được hỗ trợ" hedge.
 *
 * C. CALL ACTIVITY / HISTORY — CONDITIONAL ONLY.
 * Evidenced by `crmNeeds` (`call-history`) and S01's "Interaction History Sync".
 * Published, but every sentence stays in the conditional register ("có thể được
 * ghi nhận hoặc liên kết", "theo phạm vi tích hợp") — nothing is asserted as
 * automatic, complete or guaranteed on any Zoho account.
 *
 * D. CLICK-TO-SMS — WITHHELD.
 * Historical material mentions Click-to-SMS. §10D forbids publishing merely
 * because an old SEO sheet mentions it, and it cannot be verified here. The only
 * SMS evidence in the project belongs to a DIFFERENT product — Gcalls CX, where
 * SMS is one of five omnichannel channels (`src/data/gcallsCx.ts`, estimator
 * field `channels`). Decisively: the approved `crmNeeds` field enumerates four
 * needs and SMS is not one of them. NO SMS capability card is rendered and no
 * benefit, use case, workflow step or setup step mentions SMS. The ONLY SMS
 * mention on the page is FAQ 5, whose question §22 mandates and whose answer is
 * the §22 "IF NOT VERIFIED" wording — a defer-to-survey answer, not a claim.
 *
 * E. RECORDING SYNC — WITHHELD.
 * `crmNeeds` enumerates four needs and recording is not one of them. S01 §10 and
 * S02 §12 already resolved this same gate NEGATIVE on the same evidence, and
 * INT-02 §13 repeated it. Not published as a capability, benefit or workflow
 * step. The only recording mention is FAQ 6's question, answered with the §22
 * "IF NOT VERIFIED" wording.
 *
 * PARTNERSHIP / CERTIFICATION / MARKETPLACE — NOT PUBLISHED. No evidence exists
 * anywhere in this repository; `docs/CHECKPOINT_S01_CRM_INTEGRATION.md` records
 * the same finding for Zoho. Naming Zoho CRM asserts CONNECTION EXPERIENCE ONLY.
 *
 * EDITION / PLAN COVERAGE — NOT PUBLISHED. Nothing evidences which Zoho editions
 * or licences support the integration, so none is named and no "every plan"
 * claim appears. §16 forbids it explicitly.
 *
 * ---------------------------------------------------------------------------
 * SEO OWNERSHIP
 * ---------------------------------------------------------------------------
 * This page owns Zoho CRM-specific commercial intent (MOFU/BOFU): "tổng đài tích
 * hợp Zoho CRM", "Gcalls Zoho CRM", "Zoho CRM call center", "tích hợp Gcalls
 * Zoho CRM", "click to call Zoho CRM", "gọi điện trên Zoho CRM", "đồng bộ cuộc
 * gọi Zoho CRM", "customer context Zoho CRM", "call history Zoho CRM".
 *
 * The SEO title deliberately avoids "Popup khách hàng", "Click-to-SMS" and
 * "đồng bộ ghi âm" (§5) because gates B, D and E did not verify them. INT-02
 * had to be corrected for exactly that mismatch; this page does not repeat it.
 *
 * Generic CRM intent ("tổng đài tích hợp CRM") belongs to
 * /tong-dai-tich-hop-crm/ and is NOT competed for here — §18's routing block
 * exists to hand that visitor over. HubSpot and Salesforce intent belongs to
 * their own pages; they appear once, as routed links, never as comparison
 * claims.
 *
 * Legacy canonicals /gcalls-tich-hop-zoho-crm/ and /tong-dai-tich-hop-zoho-crm/
 * are NOT used. The canonical is derived from the route by `buildCanonical`.
 *
 * ---------------------------------------------------------------------------
 * BOUNDARIES
 * ---------------------------------------------------------------------------
 * This page owns the Zoho CRM workflow. Generic CRM evaluation belongs to CRM
 * Integration, the calling layer itself to Gcalls Plus, and omnichannel
 * conversations to Gcalls CX. This page does not introduce, teach, review or
 * compare Zoho CRM, and it is not a generic SME call-center article.
 */

import { ROUTES } from '@/config/navigation'

/**
 * Conversion context for Zoho CRM Integration CTAs (§6, §23, §26).
 *
 * No Zoho-specific `LeadSource` exists in the shared model
 * (`src/lib/leads/types.ts`) and inventing an untyped string would break
 * normalisation, so the MOST SPECIFIC VALID member already supported is used:
 * `crm_integration`.
 *
 * The platform is carried in `product`, the only typed slot that both survives
 * normalisation and is rendered back to the visitor — via the
 * `PRODUCT_DISPLAY_LABELS` allow-list in `src/lib/leads/ctaLink.ts`, whose
 * `Zoho CRM` entry is what makes §23's "Zoho CRM context is visibly retained"
 * true rather than merely present in the URL.
 *
 * `solution` stays at the approved `LEAD_NEEDS` value so the form's "Nhu cầu"
 * select still pre-selects; the shared form resolves `product`, then falls back
 * to `solution`.
 */
export const ZOHO_DEMO_LEAD = {
  intent: 'demo',
  source: 'crm_integration',
  product: 'Zoho CRM',
  solution: 'Tích hợp CRM',
} as const

export const ZOHO_CONSULT_LEAD = {
  intent: 'consultation',
  source: 'crm_integration',
  product: 'Zoho CRM',
  solution: 'Tích hợp CRM',
} as const

/* ── 01 · Hero (§6) ─────────────────────────────────────────────── */

export const ZH_HERO = {
  eyebrow: 'GCALLS × ZOHO CRM',
  h1: 'Tổng đài tích hợp Zoho CRM cho đội Sales và CSKH',
  description:
    'Kết nối hoạt động nghe gọi của Gcalls với Zoho CRM để đội ngũ có thể sử dụng customer context, theo dõi lịch sử tương tác và tiếp tục follow-up gần hơn với quy trình CRM đang sử dụng.',
  valuePoints: [
    {
      title: 'Đưa cuộc gọi gần customer record',
      detail:
        'Nhân viên có thể làm việc với cuộc gọi trong bối cảnh dữ liệu khách hàng đang được quản lý trên Zoho CRM theo phạm vi tích hợp.',
    },
    {
      title: 'Có thêm context khi trao đổi',
      detail:
        'Thông tin liên quan giúp Sales và CSKH hiểu khách hàng trước hoặc trong quá trình xử lý cuộc gọi.',
    },
    {
      title: 'Theo dõi tương tác tập trung hơn',
      detail:
        'Call activity phù hợp có thể được ghi nhận hoặc liên kết để đội ngũ tiếp tục follow-up trong CRM.',
    },
  ],
  primaryCta: { label: 'Xem demo tích hợp Zoho CRM' },
  secondaryCta: { label: 'Xem workflow tích hợp', href: '#workflow-zoho-crm' },
} as const

/* ── 02 · Direct answer / AIO (§7) ──────────────────────────────── */

/** Plain rendered HTML. Never hidden in tabs or an accordion. */
export const ZH_DIRECT_ANSWER = {
  question: 'Tổng đài tích hợp Zoho CRM là gì?',
  answer:
    'Tổng đài tích hợp Zoho CRM kết nối hoạt động nghe gọi của Gcalls với quy trình quản lý khách hàng trên Zoho CRM để nhân viên có thể sử dụng customer context, theo dõi dữ liệu cuộc gọi phù hợp và tiếp tục follow-up trong workflow đang sử dụng. Phạm vi chức năng phụ thuộc vào cấu hình Gcalls, Zoho CRM và yêu cầu triển khai của doanh nghiệp.',
} as const

/* ── 03 · Business problems (§8) ────────────────────────────────── */

/** Descriptive only — §8 forbids ROI and productivity percentages. */
export const ZH_PROBLEMS = {
  eyebrow: 'BÀI TOÁN',
  h2: 'Zoho CRM quản lý khách hàng, nhưng hoạt động gọi vẫn có thể nằm ngoài workflow',
  items: [
    {
      n: '01',
      title: 'Phải chuyển đổi giữa CRM và công cụ gọi',
      detail:
        'Nhân viên làm việc với contact trong Zoho CRM nhưng lại thực hiện cuộc gọi trên một hệ thống riêng.',
    },
    {
      n: '02',
      title: 'Thiếu customer context khi cuộc gọi bắt đầu',
      detail:
        'Khi dữ liệu CRM và cuộc gọi chưa kết nối phù hợp, nhân viên cần tự tìm hồ sơ trước khi tiếp tục trao đổi.',
    },
    {
      n: '03',
      title: 'Lịch sử tương tác bị phân mảnh',
      detail:
        'Call activity nằm ngoài CRM khiến đội ngũ khó nhìn lại toàn bộ quá trình tư vấn và chăm sóc khách hàng.',
    },
    {
      n: '04',
      title: 'Follow-up phụ thuộc vào ghi chú thủ công',
      detail:
        'Nhân viên có thể phải nhập lại dữ liệu sau cuộc gọi để giữ Zoho CRM cập nhật.',
    },
  ],
} as const

/* ── 04 · Overview (§9) ─────────────────────────────────────────── */

/**
 * Overview and core flow.
 *
 * The six flow NODES are the approved §9 chain verbatim — note node 02 is
 * "call action", not "Click-to-Call": §9 words it generically, and keeping it
 * generic here means the flow diagram does not assert a mechanism the evidence
 * does not name. The one-line details are the minimum the shared
 * `IntegrationWorkflow` component requires and add no capability beyond §11.
 */
export const ZH_OVERVIEW = {
  eyebrow: 'GCALLS FOR ZOHO CRM',
  h2: 'Kết nối lớp giao tiếp thoại với CRM đội ngũ đang sử dụng',
  description:
    'Zoho CRM tiếp tục quản lý customer record và workflow. Gcalls bổ sung lớp nghe gọi để cuộc hội thoại và dữ liệu tương tác được đặt gần hơn với quá trình Sales và CSKH.',
  flow: [
    {
      n: '01',
      label: 'Zoho CRM record',
      detail: 'Đội ngũ làm việc trên dữ liệu khách hàng đang được quản lý.',
    },
    {
      n: '02',
      label: 'Call action',
      detail: 'Cuộc gọi bắt đầu theo capability và cấu hình được triển khai.',
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
      label: 'CRM follow-up',
      detail: 'Đội ngũ tiếp tục workflow trong Zoho CRM.',
    },
  ],
} as const

/* ── 05 · Core capabilities (§11) ───────────────────────────────── */

/**
 * Four cards — only what passed the §10 gates.
 *
 * Card 01 is gate A (VERIFIED), using the §10A wording verbatim.
 * Card 02 covers the §11 baseline items "Customer Context" AND "Customer
 * Identification where supported" — merged deliberately rather than split into
 * two near-identical cards, with the "nơi được hỗ trợ" hedge kept explicit so
 * nothing is silently dropped or silently strengthened.
 * Card 03 is gate C (CONDITIONAL ONLY). Card 04 is the §11 baseline
 * "CRM Workflow Continuity".
 *
 * Click-to-SMS (gate D) and recording sync (gate E) have NO card. §11 is
 * explicit: do not create feature cards pretending unverified capabilities
 * exist. The word "Popup" appears nowhere, per gate B.
 */
export const ZH_CAPABILITIES = {
  eyebrow: 'NĂNG LỰC TÍCH HỢP',
  h2: 'Những năng lực được xác nhận khi kết nối Gcalls với Zoho CRM',
  items: [
    {
      n: '01',
      title: 'Click-to-Call',
      detail:
        'Nhân viên có thể bắt đầu cuộc gọi từ số điện thoại hoặc customer record trong Zoho CRM khi integration được cấu hình phù hợp.',
    },
    {
      n: '02',
      title: 'Customer Context',
      detail:
        'Thông tin khách hàng liên quan hỗ trợ đội ngũ có thêm bối cảnh khi xử lý cuộc gọi, và nhận biết khách hàng ở nơi dữ liệu cùng cấu hình tích hợp hỗ trợ.',
    },
    {
      n: '03',
      title: 'Call Activity / Interaction History',
      detail:
        'Dữ liệu cuộc gọi phù hợp có thể được ghi nhận hoặc liên kết theo phạm vi tích hợp để đội ngũ nhìn lại quá trình tương tác.',
    },
    {
      n: '04',
      title: 'CRM Workflow Continuity',
      detail:
        'Sales và CSKH tiếp tục follow-up trong Zoho CRM thay vì duy trì một luồng dữ liệu cuộc gọi riêng bên ngoài hệ thống.',
    },
  ],
} as const

/* ── 06 · Workflow (§12) ────────────────────────────────────────── */

export const ZH_WORKFLOW = {
  anchorId: 'workflow-zoho-crm',
  eyebrow: 'QUY TRÌNH',
  h2: 'Từ Zoho CRM record đến cuộc gọi và bước follow-up tiếp theo',
  steps: [
    {
      n: '01',
      title: 'Mở lead hoặc contact',
      detail:
        'Nhân viên tiếp tục làm việc trên dữ liệu khách hàng đang được quản lý trong Zoho CRM.',
    },
    {
      n: '02',
      title: 'Bắt đầu hoặc tiếp nhận cuộc gọi',
      detail:
        'Hoạt động thoại được thực hiện theo capability và cấu hình tích hợp được triển khai.',
    },
    {
      n: '03',
      title: 'Sử dụng customer context',
      detail: 'Thông tin liên quan giúp nhân viên hiểu khách hàng và lịch sử trước đó.',
    },
    {
      n: '04',
      title: 'Thực hiện cuộc hội thoại',
      detail: 'Gcalls xử lý lớp giao tiếp thoại trong workflow được cấu hình.',
    },
    {
      n: '05',
      title: 'Ghi nhận dữ liệu phù hợp',
      detail:
        'Call activity hoặc dữ liệu liên quan có thể được ghi nhận theo phạm vi tích hợp.',
    },
    {
      n: '06',
      title: 'Tiếp tục Sales / CSKH workflow',
      detail:
        'Nhân viên follow-up trong Zoho CRM thay vì duy trì lịch sử riêng bên ngoài hệ thống.',
    },
  ],
} as const

/* ── 07 · Before / after (§13) ──────────────────────────────────── */

/**
 * A WORKFLOW ILLUSTRATION, not a measurement. §13 forbids attaching a
 * time-saving or productivity percentage, and the shared component renders no
 * metrics slot, so one cannot be added without changing that component too.
 *
 * "Configured call action" rather than "Click-to-Call" keeps the diagram aligned
 * with the §13 chain as approved.
 */
export const ZH_BEFORE_AFTER = {
  eyebrow: 'TRƯỚC & SAU TÍCH HỢP',
  h2: 'Giảm những bước thủ công giữa Zoho CRM và hệ thống gọi',
  before: {
    label: 'Trước tích hợp',
    steps: [
      'Zoho CRM',
      'Copy phone number',
      'Call tool',
      'Conversation',
      'Manual note',
      'Quay lại CRM',
      'Follow-up',
    ],
  },
  after: {
    label: 'Sau tích hợp',
    steps: [
      'Zoho CRM record',
      'Configured call action',
      'Conversation',
      'Call activity',
      'CRM workflow tiếp tục',
    ],
  },
} as const

/* ── 08 · Benefits (§14) ────────────────────────────────────────── */

/**
 * Four conservative statements, exactly as approved. No percentage, time-saved
 * or efficiency figure — the shared `IntegrationBenefits` component takes plain
 * strings, so there is no slot to smuggle a number into.
 */
export const ZH_BENEFITS = {
  eyebrow: 'GIÁ TRỊ VẬN HÀNH',
  h2: 'Giữ hoạt động gọi gần hơn với dữ liệu Sales và CSKH',
  items: [
    'Giảm thao tác chuyển đổi giữa nhiều công cụ',
    'Có thêm customer context khi trao đổi',
    'Theo dõi tương tác tập trung hơn',
    'Dễ tiếp tục follow-up khi người phụ trách thay đổi',
  ],
} as const

/* ── 09 · Use cases (§15) ───────────────────────────────────────── */

/** Four workflows. No performance result claim of any kind (§15). */
export const ZH_USE_CASES = {
  eyebrow: 'TÌNH HUỐNG SỬ DỤNG',
  h2: 'Gcalls × Zoho CRM phù hợp với những workflow nào?',
  items: [
    {
      role: 'SME Sales',
      flow: 'Đội Sales làm việc với lead/contact trong Zoho CRM và tiếp tục follow-up dựa trên customer context đang có.',
    },
    {
      role: 'Startup Sales Operations',
      flow: 'Đội vận hành có thể tổ chức hoạt động gọi gần hơn với dữ liệu CRM thay vì duy trì các danh sách rời rạc.',
    },
    {
      role: 'Customer Service',
      flow: 'Agent sử dụng thông tin khách hàng và lịch sử liên quan để có thêm bối cảnh khi xử lý cuộc gọi.',
    },
    {
      role: 'Customer Success',
      flow: 'Đội CS giữ hoạt động liên hệ gần hơn với dữ liệu vòng đời khách hàng đang theo dõi trong Zoho CRM.',
    },
  ],
} as const

/* ── 10 · Setup (§16) ───────────────────────────────────────────── */

/**
 * Setup process — nine steps, no duration on any step or in total (§16).
 *
 * Step 5 says "Kiểm tra permission/API" only. No specific module, field, API
 * version, marketplace app, extension or credential is named, because nothing in
 * this repository evidences which mechanism is current for Zoho (gate A verified
 * the capability, not the mechanism). The note also refuses the edition-coverage
 * claim §16 forbids.
 */
export const ZH_SETUP = {
  eyebrow: 'THIẾT LẬP',
  h2: 'Tích hợp theo cấu hình Zoho CRM và workflow doanh nghiệp đang sử dụng',
  steps: [
    { n: '01', title: 'Khảo sát quy trình Zoho CRM' },
    { n: '02', title: 'Xác định module/record liên quan' },
    { n: '03', title: 'Xác định user và hotline' },
    { n: '04', title: 'Xác định capability cần tích hợp' },
    { n: '05', title: 'Kiểm tra permission/API' },
    { n: '06', title: 'Cấu hình integration' },
    { n: '07', title: 'Kiểm thử cuộc gọi và dữ liệu' },
    { n: '08', title: 'Hướng dẫn đội ngũ' },
    { n: '09', title: 'Go-live' },
  ],
  note: 'Phạm vi và thời gian triển khai phụ thuộc vào module, permission, số lượng người dùng, hotline và capability cần sử dụng, nên được xác định sau bước khảo sát thay vì theo một mốc cố định. Gcalls không mặc định mọi gói hoặc edition Zoho CRM đều hỗ trợ cùng một phạm vi tích hợp.',
} as const

/* ── 11 · UI preview (§17) ──────────────────────────────────────── */

/**
 * UI preview copy.
 *
 * §17 sets a priority order for the visual. Tier 2 ("existing approved CRM
 * visual") was tried and REJECTED on evidence grounds: the approved `CRMMockup`
 * and `CallTimelineMockup` both render a recording row, and a recording sitting
 * inside a customer record on a Zoho page invites exactly the inference gate E
 * (recording sync) refuses. The incoming-popup surface is out for the same reason
 * under gate B. This section therefore falls through to §17 tier 3 — a
 * conceptual, deliberately unbranded Gcalls-side panel built for this page,
 * depicting only the verified set. See `@/components/zoho/visuals`.
 *
 * The note is structural, not decorative: it is what stops a reader inferring
 * this is a Zoho CRM screenshot. §17 forbids fabricating Zoho CRM UI and forbids
 * displaying a third-party logo as proof of partnership.
 */
export const ZH_UI_PREVIEW = {
  eyebrow: 'GIAO DIỆN TÍCH HỢP',
  h2: 'Giữ customer context gần hoạt động gọi',
  description:
    'Giao diện dưới đây là bề mặt phía Gcalls trong luồng tích hợp: thông tin khách hàng liên quan và các nhóm dữ liệu lịch sử tương tác được đặt cạnh hoạt động nghe gọi.',
  note: 'Giao diện minh họa phía Gcalls với dữ liệu mẫu đã ẩn thông tin nhận dạng. Đây không phải ảnh chụp màn hình Zoho CRM, và bố cục thực tế phụ thuộc vào cấu hình tích hợp của doanh nghiệp.',
} as const

/* ── 12 · Zoho-specific vs generic CRM (§18) ────────────────────── */

export const ZH_VS_CRM = {
  eyebrow: 'ZOHO CRM WORKFLOW',
  h2: 'Trang này dành cho doanh nghiệp đã sử dụng Zoho CRM',
  description:
    'Nếu doanh nghiệp đang đánh giá tổng đài tích hợp CRM nói chung, hãy xem giải pháp CRM Integration. Trang này tập trung vào workflow khi Zoho CRM đã là hệ thống quản lý khách hàng hiện tại.',
  cta: { label: 'Xem giải pháp Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
} as const

/* ── 13 · Related integrations (§19) ────────────────────────────── */

/** Routing only. No vendor comparison claim of any kind (§19). */
export const ZH_RELATED = {
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
      name: 'Salesforce',
      detail: 'Kết nối hoạt động nghe gọi với workflow Salesforce.',
      path: ROUTES.salesforce,
    },
    {
      name: 'Danh mục tích hợp',
      detail: 'Xem toàn bộ nền tảng đang có trang tích hợp riêng.',
      path: ROUTES.integrations,
    },
  ],
} as const

/* ── 14 · Product boundary (§20) ────────────────────────────────── */

/**
 * A ROUTING TABLE, not a capability list (§20).
 *
 * It exists so each need reaches the page that owns it, and so this page keeps
 * Zoho intent instead of competing with the generic CRM page or being mistaken
 * for the calling product itself. The Zoho row is marked `current` and is never
 * rendered as a self-link.
 */
export const ZH_BOUNDARY = {
  eyebrow: 'PHÂN BIỆT SẢN PHẨM',
  h2: 'Zoho CRM Integration nằm ở đâu trong hệ sản phẩm Gcalls?',
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
      product: 'Zoho CRM Integration',
      need: 'Workflow riêng cho doanh nghiệp đã sử dụng Zoho CRM làm hệ thống khách hàng.',
      path: ROUTES.zohoCrm,
      current: true,
    },
    {
      product: 'Gcalls CX',
      need: 'Giao tiếp đa kênh khi doanh nghiệp cần hợp nhất nhiều điểm chạm khách hàng.',
      path: ROUTES.gcallsCx,
    },
  ],
} as const

/* ── 15 · Trust (§21) ───────────────────────────────────────────── */

/**
 * Trust — NEUTRAL DEPLOYMENT PROOF ONLY (§21).
 *
 * No partner status, certification, marketplace listing, customer count or
 * productivity percentage. None is evidenced, and §21 requires verification
 * before publishing even if evidence were found.
 */
export const ZH_TRUST = {
  eyebrow: 'PHẠM VI TRIỂN KHAI',
  h2: 'Tích hợp Zoho CRM cần bắt đầu từ module, permission và workflow thực tế',
  description:
    'Module, field, permission, user role và workflow có thể khác nhau giữa từng tài khoản Zoho CRM. Phạm vi tích hợp cần được xác định qua khảo sát và kiểm thử thay vì áp dụng cùng một cấu hình cho mọi doanh nghiệp.',
  cta: { label: 'Trao đổi về workflow Zoho CRM hiện tại' },
  links: [
    {
      label: 'Ước tính cấu hình & chi phí',
      path: `${ROUTES.costEstimator}?product=crm-integration`,
    },
    { label: 'Xem bảng giá Gcalls', path: ROUTES.pricing },
  ],
} as const

/* ── 16 · FAQ (§22) ─────────────────────────────────────────────── */

export interface ZhFaqItem {
  q: string
  a: string
  link?: { label: string; path: string }
}

/**
 * FAQ — the seven approved questions.
 *
 * FAQ 2 uses the VERIFIED branch (gate A) — but states only the behaviour the
 * evidence supports and defers the connection MECHANISM to survey, because no
 * mechanism is evidenced.
 * FAQ 3 stays in the customer-context register (gate B is CONTEXT ONLY).
 * FAQ 5 uses the §22 "IF NOT VERIFIED" wording verbatim (gate D WITHHELD).
 * FAQ 6 uses the §22 "IF NOT VERIFIED" wording verbatim (gate E WITHHELD).
 * Do not rewrite any of them to assert more.
 */
export const ZH_FAQ: ZhFaqItem[] = [
  {
    q: 'Tổng đài tích hợp Zoho CRM là gì?',
    a: 'Đây là mô hình kết nối hoạt động nghe gọi của Gcalls với Zoho CRM để đội ngũ có thể sử dụng customer context, dữ liệu cuộc gọi phù hợp và tiếp tục follow-up trong workflow CRM.',
  },
  {
    q: 'Gcalls có hỗ trợ Click-to-Call trên Zoho CRM không?',
    a: 'Có. Khi integration được cấu hình phù hợp, nhân viên có thể bắt đầu cuộc gọi từ số điện thoại hoặc customer record trong Zoho CRM. Phương thức kết nối cụ thể được Gcalls xác định trong quá trình khảo sát hệ thống.',
  },
  {
    q: 'Khi khách hàng gọi đến có thể xem thông tin Zoho CRM không?',
    a: 'Khả năng hiển thị customer context phụ thuộc vào dữ liệu, permission và cấu hình tích hợp. Gcalls sẽ xác định phạm vi phù hợp trong quá trình khảo sát.',
  },
  {
    q: 'Lịch sử cuộc gọi có được ghi nhận trong Zoho CRM không?',
    a: 'Dữ liệu cuộc gọi phù hợp có thể được ghi nhận hoặc liên kết theo phạm vi tích hợp và khả năng của hệ thống.',
  },
  {
    q: 'Gcalls có hỗ trợ gửi SMS từ Zoho CRM không?',
    a: 'Khả năng gửi SMS phụ thuộc vào cấu hình, nhà cung cấp dịch vụ và phạm vi tích hợp. Gcalls cần kiểm tra hệ thống trước khi xác nhận.',
  },
  {
    q: 'Ghi âm có được đồng bộ vào Zoho CRM không?',
    a: 'Khả năng đồng bộ hoặc liên kết bản ghi phụ thuộc vào cấu hình Gcalls, Zoho CRM và phạm vi triển khai.',
  },
  {
    q: 'Gcalls có thay thế Zoho CRM không?',
    a: 'Không. Zoho CRM tiếp tục là hệ thống quản lý khách hàng; Gcalls bổ sung lớp giao tiếp thoại và dữ liệu tương tác vào workflow đang sử dụng.',
  },
]

/* ── 17 · Final CTA (§23) ───────────────────────────────────────── */

export const ZH_FINAL_CTA = {
  eyebrow: 'GCALLS × ZOHO CRM',
  h2: 'Xem hoạt động nghe gọi vận hành trong workflow Zoho CRM của doanh nghiệp',
  description:
    'Chia sẻ module, user và quy trình Sales/CSKH hiện tại để Gcalls xác định phạm vi tích hợp và demo phù hợp.',
  primaryCta: { label: 'Xem demo tích hợp Zoho CRM' },
  secondaryCta: { label: 'Tư vấn tích hợp' },
} as const

/* ── 18 · Onward internal links (§24) ───────────────────────────── */

/**
 * Contextual, not a link dump (§24).
 *
 * The CRM solution page, the integration hub, HubSpot, Salesforce, Gcalls Plus
 * and Gcalls CX are already linked from their own dedicated sections above, so
 * they are not repeated here — this row carries only the remaining required
 * destinations.
 */
export const ZH_LINKS = {
  h2: 'Xem thêm',
  items: [
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
 * four published capabilities, so the structured data cannot assert more than
 * the visible page — in particular it does not mention popup, SMS or recording
 * synchronisation.
 */
export function buildZohoCrmJsonLd(origin: string) {
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
            name: 'Zoho CRM',
            item: `${origin}${ROUTES.zohoCrm}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: 'Tổng đài tích hợp Zoho CRM',
        serviceType: 'Zoho CRM Telephony Integration',
        description: ZH_DIRECT_ANSWER.answer,
        provider: { '@type': 'Organization', name: 'Gcalls' },
        url: `${origin}${ROUTES.zohoCrm}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Gcalls for Zoho CRM',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'CRM Telephony Integration',
        operatingSystem: 'Web browser',
        description: ZH_OVERVIEW.description,
        url: `${origin}${ROUTES.zohoCrm}`,
        featureList: ZH_CAPABILITIES.items.map((c) => c.title),
        provider: { '@type': 'Organization', name: 'Gcalls' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: ZH_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
