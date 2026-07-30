/**
 * Approved content for /tich-hop/freshdesk/ — Checkpoint INT-04.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED.
 * ---------------------------------------------------------------------------
 * Every string below comes from the approved INT-04 source. Do not rewrite,
 * shorten, paraphrase or "improve" it, and do not add capabilities, Freshdesk
 * fields, ticket behaviours, plans or benefits that are not here.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING (INT-04 §28)
 * ---------------------------------------------------------------------------
 * Never publish without explicit current evidence:
 *   "mỗi cuộc gọi tự động tạo ticket" · "đồng bộ toàn bộ trường ticket" ·
 *   "ghi âm được đồng bộ vào Freshdesk" · "Click-to-SMS có sẵn" ·
 *   "popup khách hàng trên mọi triển khai" · "hỗ trợ mọi gói Freshdesk" ·
 *   "real-time guaranteed" · "cài đặt trong vài phút" / any fixed duration ·
 *   any productivity percentage · "đối tác chính thức của Freshdesk" ·
 *   "được Freshworks chứng nhận" · any marketplace listing · any SLA.
 *
 * Required register instead: "có thể", "hỗ trợ", "theo cấu hình", "theo phạm vi
 * tích hợp", "khi nền tảng và cấu hình cho phép", "tùy API", "cần khảo sát".
 *
 * ---------------------------------------------------------------------------
 * EVIDENCE BASE — HELPDESK, NOT CRM
 * ---------------------------------------------------------------------------
 * This is the single most important thing to understand before editing this
 * file. Freshdesk is governed by the HELPDESK evidence base, which is
 * materially NARROWER than the CRM one used by INT-01/02/03:
 *
 *  - `src/data/estimator.ts`, solution `helpdesk`: `helpdeskPlatform` names
 *    FRESHDESK, Zendesk and "Khác"; `helpdeskNeeds` enumerates EXACTLY TWO
 *    connection needs — "Gắn cuộc gọi vào ticket" (LINKING) and "Lịch sử cuộc
 *    gọi trong hồ sơ hỗ trợ" (history in the support record).
 *  - `src/data/helpdeskIntegration.ts` (S02, approved & locked): four
 *    capabilities — Call Context, Ticket / Support Record CONNECTION,
 *    Interaction History, Customer Identification — all conditionally worded,
 *    plus Freshdesk named as a routed platform with CONNECTION SCOPE ONLY, plus
 *    an approved support-context CATEGORY list.
 *  - `src/data/gcallsPlus.ts` (P01, approved): call history and activity data
 *    are affirmed as a Gcalls product capability.
 *  - `src/data/qaQcCenter.ts` (P02, approved): the QA workflow runs "từ bản ghi
 *    cuộc gọi", which affirms recordings can exist in Gcalls.
 *
 * CONTRAST WITH THE CRM BASE. `crmNeeds` enumerates FOUR needs and INCLUDES
 * `click-to-call`; `helpdeskNeeds` enumerates TWO and includes NO calling
 * mechanism at all. That single difference is why this page publishes fewer
 * capabilities than the Salesforce or Zoho pages, and it must not be "fixed" by
 * borrowing from them.
 *
 * NOT AN EVIDENCE BASE. Historical official Gcalls material (§10) described
 * Click-to-Call in Freshdesk, an incoming call box, Click-to-SMS, a customer
 * iframe, recent-ticket fields, manual ticket creation, automatic per-call
 * ticket creation and contact creation for unknown numbers. §10 is explicit
 * that a feature must not be published merely because an old page described it.
 * None of it could be verified in the current repository, so all of it is
 * withheld below. Home marketing copy is likewise not an evidence base — S01
 * already declined recording sync despite a comparable Home line.
 *
 * ---------------------------------------------------------------------------
 * CAPABILITY EVIDENCE GATES (§11) — ELEVEN DECISIONS
 * ---------------------------------------------------------------------------
 * A. CLICK-TO-CALL — WITHHELD.
 * `helpdeskNeeds`, the same approved config that names Freshdesk, enumerates two
 * needs and Click-to-Call is not one of them. In this repository Click-to-Call
 * exists ONLY as a CRM capability (`crmIntegration.ts`, `crmNeeds`). S03 §13
 * already established that it must not be inherited out of the CRM category —
 * it was withheld for POS on exactly this reasoning — and Freshdesk is a
 * Helpdesk platform, not a CRM. Decisively: the locked S02 GENERIC Helpdesk page
 * publishes four capabilities and Click-to-Call is not among them; a
 * platform-specific page cannot claim MORE than the category page it
 * specialises, from a narrower evidence base. FAQ 2 therefore uses the §24
 * "IF NOT VERIFIED" wording, the hero avoids any calling-mechanism claim, and
 * the flow/workflow copy says "call action" rather than naming a mechanism.
 *
 * B. INCOMING CALL / CALL BOX — WITHHELD.
 * Nothing evidences answering a call INSIDE Freshdesk. §11B is explicit that
 * this must not be claimed without current evidence. INT-01 published an
 * incoming call-box card for HubSpot on CRM-scoped S01 evidence; no equivalent
 * exists in the Helpdesk base. No capability card, and no copy anywhere says a
 * call is answered inside Freshdesk.
 *
 * C. CUSTOMER CONTEXT / IFRAME — CONTEXT ONLY.
 * S02 publishes "Call Context" and "Customer Identification" conditionally, and
 * that is the whole of it. NO iframe of any kind is evidenced, so no iframe,
 * embedded panel or in-Freshdesk widget is claimed. §11C forbids field-level
 * detail without current evidence: the support-context section therefore
 * publishes only the CATEGORY list S02 already approved, and explicitly does NOT
 * publish the two extra items §15 lists as merely "possible" — `company` and
 * `assigned agent` — because neither appears in any approved source.
 *
 * D. TICKET CONNECTION — VERIFIED & PUBLISHED, scoped to CONTEXT + LINKING.
 * `helpdeskNeeds` literally offers "Gắn cuộc gọi vào ticket", and S02 publishes
 * "Ticket / Support Record Connection" whose own code comment states it
 * describes LINKING and "deliberately does not describe creating one". §11D
 * requires the four sub-capabilities be differentiated, so:
 *   ticket context  → PUBLISHED (conditional)
 *   ticket linking  → PUBLISHED (conditional)
 *   ticket creation → WITHHELD (gates E and F)
 *   ticket update   → WITHHELD (no evidence; FAQ 4 defers it to survey)
 *
 * E. MANUAL TICKET CREATION — WITHHELD. No approved source evidences Gcalls
 * creating a Freshdesk ticket, manually or otherwise. `helpdeskNeeds` offers no
 * creation option.
 *
 * F. AUTOMATIC TICKET CREATION — WITHHELD. This is the strongest historical
 * claim and it has the least support. S02's own evidence gate already closed it
 * NEGATIVE, and the S02 claim guard names "tự động tạo ticket" as a forbidden
 * universal behaviour. Nothing on this page implies any call creates a ticket.
 *
 * G. CONTACT CREATION FOR UNKNOWN CALLERS — WITHHELD. No approved source
 * evidences Gcalls writing a new contact into Freshdesk. Not published in any
 * form, including as a workflow step.
 *
 * H. CLICK-TO-SMS — WITHHELD. The only SMS evidence in this project belongs to a
 * DIFFERENT product — Gcalls CX, where SMS is one of five omnichannel channels
 * (`gcallsCx.ts`, estimator field `channels`). `helpdeskNeeds` offers no SMS
 * option. Withheld for the fourth consecutive checkpoint (INT-01 §12,
 * INT-02 §12, INT-03 §10D). The rendered page contains NO occurrence of "SMS".
 *
 * I. CALL HISTORY — TWO SEPARATE DECISIONS, never merged (§11I).
 *    GCALLS CALL HISTORY — VERIFIED & PUBLISHED. `gcallsPlus.ts` FAQ (approved)
 *    affirms it directly: "Gcalls Plus hỗ trợ theo dõi lịch sử và dữ liệu hoạt
 *    động cuộc gọi". This is a Gcalls-side capability and is stated as such.
 *    FRESHDESK HISTORY SYNC — CONDITIONAL ONLY. `helpdeskNeeds` offers "Lịch sử
 *    cuộc gọi trong hồ sơ hỗ trợ" and S02 publishes "Interaction History"
 *    conditionally, so it is published — but never as automatic, complete or
 *    field-guaranteed. Which fields, and where data is stored, are explicitly
 *    survey items (FAQ 5).
 *
 * J. RECORDING — TWO SEPARATE DECISIONS, never merged (§11J).
 *    RECORDING IN GCALLS — VERIFIED & PUBLISHED, conditional register.
 *    `qaQcCenter.ts` (approved) runs its QA workflow "từ bản ghi cuộc gọi",
 *    which affirms recordings can exist in Gcalls when the service is
 *    configured. Stated ONLY in FAQ 6, and NOT as a Freshdesk-integration
 *    capability, because it is not one.
 *    RECORDING SYNC TO FRESHDESK — WITHHELD. S02's evidence gate already closed
 *    this NEGATIVE, and S01/S02/INT-02/INT-03 all reached the same conclusion.
 *    No capability, benefit, workflow step or visual depicts it.
 *
 * PARTNERSHIP / FRESHWORKS CERTIFICATION / MARKETPLACE / SLA — NOT PUBLISHED.
 * No evidence exists anywhere; `docs/CHECKPOINT_S02_HELPDESK_INTEGRATION.md`
 * records the same finding for Freshdesk. Naming Freshdesk asserts CONNECTION
 * EXPERIENCE ONLY.
 *
 * PLAN COVERAGE — NOT PUBLISHED. Nothing evidences which Freshdesk plans
 * support the integration, so none is named and no "every plan" claim appears.
 *
 * EXTENSION INSTRUCTIONS — NOT PUBLISHED (§18). Historical material described a
 * browser-extension setup. Nothing evidences that this is the current or
 * universal method, so setup step 5 says "phương thức kết nối hiện hành" and
 * names no extension, app or API version.
 *
 * ---------------------------------------------------------------------------
 * SEO OWNERSHIP
 * ---------------------------------------------------------------------------
 * This page owns Freshdesk-specific commercial intent (MOFU/BOFU): "tổng đài
 * tích hợp Freshdesk", "Gcalls Freshdesk", "tích hợp Gcalls Freshdesk",
 * "Freshdesk call center", "gọi điện trên Freshdesk", "click to call Freshdesk",
 * "cuộc gọi và ticket Freshdesk", "customer context Freshdesk", "lịch sử cuộc
 * gọi Freshdesk", "tổng đài cho đội support".
 *
 * NOTE ON "click to call Freshdesk". It is a listed secondary keyword, but gate
 * A is WITHHELD, so this page does NOT claim the capability. The keyword is
 * addressed HONESTLY — FAQ 2 answers the question a searcher is asking by
 * explaining that the mechanism depends on configuration and will be scoped in
 * survey. Ranking for a question is not the same as asserting a feature, and
 * this is deliberately not resolved by publishing an unverified claim. The SEO
 * title likewise avoids it (§5).
 *
 * Generic Helpdesk intent ("tổng đài tích hợp Helpdesk") belongs to
 * /tong-dai-tich-hop-helpdesk/ and is NOT competed for here — §20's routing
 * block exists to hand that visitor over. Zendesk intent belongs to
 * /tich-hop/zendesk/; it appears once, as a routed link, never as a comparison.
 *
 * Legacy canonicals /gcalls-tich-hop-freshdesk/ and
 * /tong-dai-tich-hop-freshdesk/ are NOT used; the canonical is derived from the
 * route by `buildCanonical`.
 *
 * ---------------------------------------------------------------------------
 * BOUNDARIES
 * ---------------------------------------------------------------------------
 * This page owns the Freshdesk support workflow. Generic Helpdesk evaluation
 * belongs to Helpdesk Integration, CRM records and lead data to CRM
 * Integration, omnichannel conversations to Gcalls CX, AI-assisted call quality
 * review to QA QC Center, and the calling layer itself to Gcalls Plus. This page
 * does not introduce, teach, review or compare Freshdesk, and it is NOT a CRM
 * record workflow — tickets and support requests are the axis throughout.
 */

import { ROUTES } from '@/config/navigation'

/**
 * Conversion context for Freshdesk Integration CTAs (§6, §25, §29).
 *
 * Unlike the CRM platform pages, a well-matched `LeadSource` already exists:
 * `helpdesk_integration`. Paired with `solution: 'Tích hợp Helpdesk'` (an
 * approved `LEAD_NEEDS` value) it is the most specific valid combination in the
 * shared model, so no shared type changed.
 *
 * The platform is carried in `product`, the only typed slot that both survives
 * normalisation and is rendered back to the visitor — via the
 * `PRODUCT_DISPLAY_LABELS` allow-list in `src/lib/leads/ctaLink.ts`, whose
 * `Freshdesk` entry is what makes §25's "Freshdesk context is visibly retained"
 * true rather than merely present in the URL.
 */
export const FRESHDESK_DEMO_LEAD = {
  intent: 'demo',
  source: 'helpdesk_integration',
  product: 'Freshdesk',
  solution: 'Tích hợp Helpdesk',
} as const

export const FRESHDESK_CONSULT_LEAD = {
  intent: 'consultation',
  source: 'helpdesk_integration',
  product: 'Freshdesk',
  solution: 'Tích hợp Helpdesk',
} as const

/**
 * Estimator link (§26).
 *
 * Deliberately reuses the EXISTING generic slug rather than minting a Freshdesk
 * key. `helpdesk-integration` is already in `PRODUCT_SLUG_ALIASES`
 * (`src/components/estimator/Estimator.tsx`), where it maps to the `helpdesk`
 * solution and preselects it. A new `freshdesk` key would resolve to no solution
 * and silently fall through to the "choose a solution" step.
 *
 * Freshdesk context is preserved separately, on the LeadForm, via the two lead
 * contexts above — so nothing is lost by using the generic estimator key.
 */
export const FD_ESTIMATOR_HREF = `${ROUTES.costEstimator}?product=helpdesk-integration`

/* ── 01 · Hero (§6) ─────────────────────────────────────────────── */

/**
 * Note what the value points do NOT say. None claims Click-to-Call, a call box
 * inside Freshdesk, or ticket creation — gates A, B, E and F are all closed.
 * Value 1 places voice activity NEAR the support workflow; it does not claim a
 * mechanism for starting the call.
 */
export const FD_HERO = {
  eyebrow: 'GCALLS × FRESHDESK',
  h1: 'Tổng đài tích hợp Freshdesk cho đội CSKH và Support',
  description:
    'Kết nối hoạt động nghe gọi của Gcalls với Freshdesk để nhân viên có thể sử dụng customer context, ticket liên quan và lịch sử hỗ trợ gần hơn với quy trình đang xử lý.',
  valuePoints: [
    {
      title: 'Đưa cuộc gọi vào workflow hỗ trợ',
      detail:
        'Hoạt động thoại được đặt gần hơn với hồ sơ và quy trình hỗ trợ đang được quản lý trong Freshdesk.',
    },
    {
      title: 'Có customer context khi tiếp nhận cuộc gọi',
      detail:
        'Thông tin liên quan giúp nhân viên hiểu khách hàng và yêu cầu hỗ trợ trước khi tiếp tục xử lý.',
    },
    {
      title: 'Theo dõi cuộc gọi và ticket tập trung hơn',
      detail:
        'Dữ liệu phù hợp có thể được liên kết hoặc ghi nhận theo phạm vi tích hợp để đội ngũ tiếp tục follow-up.',
    },
  ],
  primaryCta: { label: 'Xem demo tích hợp Freshdesk' },
  secondaryCta: { label: 'Xem workflow tích hợp', href: '#workflow-freshdesk' },
} as const

/* ── 02 · Direct answer / AIO (§7) ──────────────────────────────── */

/** Plain rendered HTML. Never hidden in an accordion, tab or modal. */
export const FD_DIRECT_ANSWER = {
  question: 'Tổng đài tích hợp Freshdesk là gì?',
  answer:
    'Tổng đài tích hợp Freshdesk kết nối hoạt động nghe gọi của Gcalls với quy trình hỗ trợ trên Freshdesk để nhân viên có thể sử dụng customer context, ticket liên quan và dữ liệu tương tác phù hợp trong cùng workflow CSKH. Phạm vi chức năng phụ thuộc vào cấu hình Gcalls, Freshdesk, API và yêu cầu triển khai của doanh nghiệp.',
} as const

/* ── 03 · Business problems (§8) ────────────────────────────────── */

/** Descriptive only — §8 forbids productivity percentages. None appears. */
export const FD_PROBLEMS = {
  eyebrow: 'BÀI TOÁN SUPPORT',
  h2: 'Freshdesk quản lý ticket, nhưng cuộc gọi vẫn có thể nằm ngoài lịch sử hỗ trợ',
  items: [
    {
      n: '01',
      title: 'Nhân viên phải chuyển đổi giữa hai hệ thống',
      detail:
        'Agent xử lý ticket trong Freshdesk nhưng lại thực hiện cuộc gọi bằng một công cụ riêng, khiến workflow bị chia thành nhiều bước.',
    },
    {
      n: '02',
      title: 'Cuộc gọi đến thiếu customer context',
      detail:
        'Khi Freshdesk và hệ thống gọi chưa được kết nối phù hợp, nhân viên phải tự tìm contact hoặc ticket trong lúc khách hàng đang chờ.',
    },
    {
      n: '03',
      title: 'Ticket thiếu lịch sử cuộc hội thoại',
      detail:
        'Nếu dữ liệu cuộc gọi nằm ngoài workflow hỗ trợ, nhân viên tiếp nhận sau có thể thiếu bối cảnh để tiếp tục xử lý.',
    },
    {
      n: '04',
      title: 'Follow-up phụ thuộc vào ghi chú thủ công',
      detail:
        'Nhân viên có thể phải nhập lại thông tin sau cuộc gọi để giữ lịch sử hỗ trợ cập nhật.',
    },
  ],
} as const

/* ── 04 · Overview (§9) ─────────────────────────────────────────── */

/**
 * Overview and core flow.
 *
 * The six flow NODES are the approved §9 chain verbatim. Node 02 is
 * "call action / incoming call" as approved — generic on purpose, since gates A
 * and B are closed and the diagram must not assert a mechanism. The one-line
 * details are the minimum the shared `IntegrationWorkflow` component requires
 * and add no capability beyond §12.
 */
export const FD_OVERVIEW = {
  eyebrow: 'GCALLS FOR FRESHDESK',
  h2: 'Đưa lớp giao tiếp thoại vào nơi đội Support đang quản lý yêu cầu khách hàng',
  description:
    'Freshdesk tiếp tục quản lý ticket và support workflow. Gcalls bổ sung lớp nghe gọi để customer context, cuộc gọi và bước follow-up được đặt gần hơn với quy trình hỗ trợ hiện tại.',
  flow: [
    {
      n: '01',
      label: 'Freshdesk contact / ticket',
      detail: 'Agent làm việc trên yêu cầu hỗ trợ đang được quản lý.',
    },
    {
      n: '02',
      label: 'Call action / incoming call',
      detail: 'Hoạt động thoại diễn ra theo capability và cấu hình đã triển khai.',
    },
    {
      n: '03',
      label: 'Gcalls conversation',
      detail: 'Gcalls xử lý lớp giao tiếp thoại.',
    },
    {
      n: '04',
      label: 'Customer context',
      detail: 'Thông tin liên quan hỗ trợ agent trong cuộc trao đổi.',
    },
    {
      n: '05',
      label: 'Support activity',
      detail: 'Dữ liệu phù hợp được ghi nhận hoặc liên kết theo phạm vi tích hợp.',
    },
    {
      n: '06',
      label: 'Ticket follow-up',
      detail: 'Đội Support tiếp tục workflow trong Freshdesk.',
    },
  ],
} as const

/* ── 05 · Core capabilities (§12) ───────────────────────────────── */

/**
 * The four §12 safe-baseline capabilities — and ONLY those.
 *
 * Click-to-Call (gate A), incoming call / call box (gate B), Click-to-SMS
 * (gate H), manual ticket creation (gate E), automatic ticket creation (gate F)
 * and unknown-caller contact creation (gate G) all failed their gates, so none
 * has a card. §12 is explicit that these appear only if their individual gates
 * pass.
 *
 * Card 02 carries the gate I SPLIT in its own wording: history in Gcalls is
 * affirmed, writing it into Freshdesk stays conditional. Do not collapse those
 * two halves into one sentence.
 * Card 03 is ticket CONTEXT and LINKING only — never creation or update.
 */
export const FD_CAPABILITIES = {
  eyebrow: 'NĂNG LỰC TÍCH HỢP',
  h2: 'Những năng lực được xác nhận khi kết nối Gcalls với Freshdesk',
  items: [
    {
      n: '01',
      title: 'Customer Context',
      detail:
        'Thông tin khách hàng liên quan hỗ trợ agent nhận biết người đang liên hệ và yêu cầu hỗ trợ, ở phạm vi mà dữ liệu, permission và cấu hình tích hợp cho phép.',
    },
    {
      n: '02',
      title: 'Call Activity',
      detail:
        'Gcalls lưu lịch sử và dữ liệu hoạt động cuộc gọi. Việc đưa dữ liệu đó vào Freshdesk có thể được thực hiện theo phạm vi tích hợp và khả năng của nền tảng.',
    },
    {
      n: '03',
      title: 'Ticket / Support Record Context',
      detail:
        'Dữ liệu cuộc gọi có thể được liên kết với ticket hoặc hồ sơ hỗ trợ đang tồn tại khi nền tảng và cấu hình tích hợp cho phép.',
    },
    {
      n: '04',
      title: 'Support Workflow Continuity',
      detail:
        'Đội Support tiếp tục xử lý trong Freshdesk thay vì duy trì lịch sử hỗ trợ ở một luồng dữ liệu riêng bên ngoài Helpdesk.',
    },
  ],
} as const

/* ── 06 · Workflow (§13) ────────────────────────────────────────── */

export const FD_WORKFLOW = {
  anchorId: 'workflow-freshdesk',
  eyebrow: 'QUY TRÌNH',
  h2: 'Từ Freshdesk contact hoặc ticket đến cuộc gọi và bước hỗ trợ tiếp theo',
  steps: [
    {
      n: '01',
      title: 'Mở contact hoặc ticket',
      detail:
        'Nhân viên tiếp tục làm việc trên yêu cầu hỗ trợ đang được quản lý trong Freshdesk.',
    },
    {
      n: '02',
      title: 'Bắt đầu hoặc tiếp nhận cuộc gọi',
      detail:
        'Hoạt động thoại được thực hiện theo capability và cấu hình tích hợp đã triển khai.',
    },
    {
      n: '03',
      title: 'Sử dụng customer context',
      detail:
        'Thông tin liên quan giúp agent hiểu khách hàng, ticket hoặc lịch sử hỗ trợ trước đó.',
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
        'Call activity hoặc dữ liệu liên quan có thể được ghi nhận hay liên kết theo phạm vi tích hợp.',
    },
    {
      n: '06',
      title: 'Tiếp tục ticket workflow',
      detail:
        'Agent follow-up trong Freshdesk thay vì duy trì lịch sử hỗ trợ ở một luồng riêng bên ngoài Helpdesk.',
    },
  ],
} as const

/* ── 07 · Before / after (§14) ──────────────────────────────────── */

/**
 * Illustrative only. §14 forbids an ROI percentage, and the shared component
 * renders no metrics slot, so one cannot be added without changing it too.
 *
 * The AFTER chain says "configured call action", not Click-to-Call — gate A is
 * closed and this diagram must not become the place the claim slips in.
 */
export const FD_BEFORE_AFTER = {
  eyebrow: 'TRƯỚC & SAU TÍCH HỢP',
  h2: 'Giảm những bước chuyển đổi thủ công giữa Freshdesk và hệ thống gọi',
  before: {
    label: 'Trước tích hợp',
    steps: [
      'Freshdesk ticket',
      'Copy phone number',
      'Call tool',
      'Conversation',
      'Manual note',
      'Quay lại Freshdesk',
      'Cập nhật ticket',
    ],
  },
  after: {
    label: 'Sau tích hợp',
    steps: [
      'Freshdesk contact / ticket',
      'Configured call action',
      'Conversation',
      'Support activity',
      'Ticket workflow tiếp tục',
    ],
  },
} as const

/* ── 08 · Support context (§15) ─────────────────────────────────── */

/**
 * Support context CATEGORIES.
 *
 * §15 lists candidate content and permits it "only where verified". The list
 * below is exactly the category set the locked S02 page already publishes, so it
 * asserts nothing new.
 *
 * DELIBERATELY EXCLUDED: `company` and `assigned agent`. §15 lists both as
 * possible, but neither appears in any approved source, and §11C forbids
 * field-level detail without current evidence. Do not add them back without it.
 *
 * The scope line is not decoration — it is what keeps this a list of POSSIBLE
 * context rather than a promise of synced fields.
 */
export const FD_SUPPORT_CONTEXT = {
  eyebrow: 'CUSTOMER & TICKET CONTEXT',
  h2: 'Hiểu yêu cầu hỗ trợ trước khi tiếp tục cuộc hội thoại',
  description:
    'Khi customer context, ticket liên quan và lịch sử hỗ trợ được đặt gần hoạt động gọi, agent có thể hiểu tình huống tốt hơn trước khi phản hồi hoặc follow-up.',
  points: [
    'Customer identity',
    'Ticket đang xử lý',
    'Ticket trước đó',
    'Tương tác gần đây',
    'Ghi chú',
    'Trạng thái hiện tại',
  ],
  scopeNote:
    'Đây là các nhóm dữ liệu có thể sử dụng, không phải danh sách trường được đồng bộ mặc định. Phạm vi thông tin thực tế phụ thuộc vào dữ liệu, permission và cấu hình tích hợp, và cần được xác định trong bước khảo sát kỹ thuật.',
} as const

/* ── 09 · Benefits (§16) ────────────────────────────────────────── */

/**
 * Four conservative statements, exactly as approved. No percentage, time-saved
 * or efficiency figure — the shared `IntegrationBenefits` component takes plain
 * strings, so there is no slot to smuggle a number into.
 */
export const FD_BENEFITS = {
  eyebrow: 'GIÁ TRỊ VẬN HÀNH',
  h2: 'Giữ cuộc gọi gần hơn với quy trình ticket và customer support',
  items: [
    'Giảm chuyển đổi giữa nhiều công cụ',
    'Có thêm context khi tiếp nhận cuộc gọi',
    'Theo dõi lịch sử hỗ trợ tập trung hơn',
    'Dễ tiếp tục xử lý khi ticket chuyển người phụ trách',
  ],
} as const

/* ── 10 · Use cases (§17) ───────────────────────────────────────── */

/** Four support workflows. No result claim of any kind (§17). */
export const FD_USE_CASES = {
  eyebrow: 'TÌNH HUỐNG SỬ DỤNG',
  h2: 'Gcalls × Freshdesk phù hợp với những workflow hỗ trợ nào?',
  items: [
    {
      role: 'Inbound Customer Support',
      flow: 'Agent tiếp nhận cuộc gọi trong bối cảnh contact và yêu cầu hỗ trợ đang được quản lý trong Freshdesk.',
    },
    {
      role: 'Ticket Follow-up',
      flow: 'Nhân viên gọi lại cho khách hàng và tiếp tục xử lý ticket từ context hiện có.',
    },
    {
      role: 'SaaS Support',
      flow: 'Đội Support theo dõi cuộc gọi và ticket gần hơn trong quá trình xử lý vấn đề sản phẩm hoặc dịch vụ.',
    },
    {
      role: 'E-commerce Customer Service',
      flow: 'Đội CSKH sử dụng customer và support context để tiếp tục giải quyết yêu cầu sau cuộc gọi.',
    },
  ],
} as const

/* ── 11 · Setup (§18) ───────────────────────────────────────────── */

/**
 * Setup process — nine steps, no duration on any step or in total (§18).
 *
 * Step 5 says "phương thức kết nối hiện hành" and names NO extension, app, API
 * version or credential type. §18 explicitly forbids publishing old extension
 * instructions as the current or universal implementation method, and nothing in
 * this repository evidences which mechanism is current for Freshdesk.
 *
 * The note also refuses the plan-coverage claim §18 forbids.
 */
export const FD_SETUP = {
  eyebrow: 'THIẾT LẬP',
  h2: 'Tích hợp theo cấu hình Freshdesk và workflow hỗ trợ đang sử dụng',
  steps: [
    { n: '01', title: 'Khảo sát Freshdesk workflow' },
    { n: '02', title: 'Xác định contact, ticket và dữ liệu liên quan' },
    { n: '03', title: 'Xác định user và hotline' },
    { n: '04', title: 'Xác định capability cần triển khai' },
    { n: '05', title: 'Kiểm tra permission, API và phương thức kết nối hiện hành' },
    { n: '06', title: 'Cấu hình integration' },
    { n: '07', title: 'Kiểm thử cuộc gọi, context và ticket workflow' },
    { n: '08', title: 'Hướng dẫn đội Support' },
    { n: '09', title: 'Go-live' },
  ],
  note: 'Phạm vi và thời gian triển khai phụ thuộc vào cấu trúc ticket, permission, API, số lượng người dùng, hotline và capability cần sử dụng, nên được xác định sau bước khảo sát thay vì theo một mốc cố định. Gcalls không mặc định mọi gói Freshdesk đều hỗ trợ cùng một phạm vi tích hợp, và phương thức kết nối cần được xác nhận theo hệ thống thực tế.',
} as const

/* ── 12 · UI preview (§19) ──────────────────────────────────────── */

/**
 * UI preview copy.
 *
 * §19 priority 1 is a real, currently approved Freshdesk screenshot — none
 * exists in this repository, and §19 also requires verifying that any such
 * screenshot represents CURRENT behaviour, which cannot be done here. Priority 2
 * (a real Gcalls-side integration screenshot) does not exist either. The page
 * therefore uses priority 3: the conceptual, deliberately unbranded support
 * surfaces from `@/components/helpdesk/visuals`.
 *
 * Those surfaces are reused rather than cloned, and they are already correct for
 * this page's gate set: they depict LINKING a call to an existing support record
 * and carrying interaction history, and their own file header states that no
 * ticket is shown being created because automatic creation is not verified.
 *
 * The note is structural, not decorative: it is what stops a reader inferring
 * these are Freshdesk screenshots. §19 forbids fabricating Freshdesk UI, forbids
 * a fake branded ticket screen, and forbids using any screenshot as proof of
 * official partnership.
 */
export const FD_UI_PREVIEW = {
  eyebrow: 'GIAO DIỆN TÍCH HỢP',
  h2: 'Giữ customer context và ticket gần hoạt động nghe gọi',
  description:
    'Sơ đồ dưới đây minh họa lớp tích hợp phía Gcalls: cuộc gọi được xử lý trên Gcalls và liên kết với hồ sơ hỗ trợ đang tồn tại, cùng những nhóm dữ liệu context mà agent có thể sử dụng.',
  note: 'Đây là sơ đồ khái niệm phía Gcalls với dữ liệu mẫu đã ẩn thông tin nhận dạng, không phải ảnh chụp màn hình Freshdesk và không mô phỏng giao diện Freshdesk. Bố cục cùng phạm vi dữ liệu thực tế phụ thuộc vào cấu hình tích hợp của doanh nghiệp.',
} as const

/* ── 13 · Freshdesk vs generic Helpdesk (§20) ───────────────────── */

export const FD_VS_HELPDESK = {
  eyebrow: 'FRESHDESK-SPECIFIC WORKFLOW',
  h2: 'Trang này dành cho doanh nghiệp đã sử dụng Freshdesk',
  description:
    'Nếu doanh nghiệp đang đánh giá tổng đài tích hợp Helpdesk nói chung, hãy xem giải pháp Helpdesk Integration. Trang này tập trung vào workflow khi Freshdesk đã là hệ thống quản lý ticket và hỗ trợ hiện tại.',
  cta: {
    label: 'Xem giải pháp Tổng đài tích hợp Helpdesk',
    path: ROUTES.helpdeskIntegration,
  },
} as const

/* ── 14 · Related Helpdesk platforms (§21) ──────────────────────── */

/**
 * Routing only. §21 forbids saying which vendor is better and forbids feature
 * superiority claims, so each description states connection scope and nothing
 * else — no comparison adjective appears.
 */
export const FD_RELATED = {
  h2: 'Doanh nghiệp đang sử dụng Helpdesk khác?',
  description:
    'Mỗi nền tảng Helpdesk có cấu trúc ticket và cách kết nối riêng. Xem trang tương ứng với hệ thống doanh nghiệp đang sử dụng.',
  items: [
    {
      name: 'Zendesk',
      detail: 'Kết nối hoạt động nghe gọi với quy trình hỗ trợ trên Zendesk.',
      path: ROUTES.zendesk,
    },
    {
      name: 'Danh mục tích hợp',
      detail: 'Xem toàn bộ nền tảng đang có trang tích hợp riêng.',
      path: ROUTES.integrations,
    },
  ],
} as const

/* ── 15 · Product boundaries (§22) ──────────────────────────────── */

/**
 * A ROUTING TABLE, not a capability list (§22).
 *
 * It exists so each need reaches the page that owns it, and so this page keeps
 * Freshdesk intent instead of competing with the generic Helpdesk page or being
 * mistaken for the calling product or the omnichannel product. The Freshdesk row
 * is marked `current` and is never rendered as a self-link.
 */
export const FD_BOUNDARY = {
  eyebrow: 'PHÂN BIỆT SẢN PHẨM',
  h2: 'Freshdesk Integration nằm ở đâu trong hệ sản phẩm Gcalls?',
  items: [
    {
      product: 'Gcalls Plus',
      need: 'Lớp nghe gọi trên trình duyệt — phần thực hiện cuộc gọi của doanh nghiệp.',
      path: ROUTES.gcallsPlus,
    },
    {
      product: 'Helpdesk Integration',
      need: 'Giải pháp tích hợp Helpdesk nói chung, khi doanh nghiệp chưa xác định nền tảng.',
      path: ROUTES.helpdeskIntegration,
    },
    {
      product: 'Freshdesk Integration',
      need: 'Workflow riêng cho đội Support đã sử dụng Freshdesk để quản lý ticket.',
      path: ROUTES.freshdesk,
      current: true,
    },
    {
      product: 'Gcalls CX',
      need: 'Quản lý giao tiếp đa kênh khi doanh nghiệp cần hợp nhất nhiều điểm chạm khách hàng.',
      path: ROUTES.gcallsCx,
    },
    {
      product: 'QA QC Center',
      need: 'Đánh giá chất lượng cuộc gọi với hỗ trợ của AI — không phải chức năng của lớp tích hợp Helpdesk.',
      path: ROUTES.qcCenter,
    },
  ],
} as const

/* ── 16 · Trust (§23) ───────────────────────────────────────────── */

/**
 * Trust — NEUTRAL DEPLOYMENT PROOF ONLY (§23).
 *
 * No partner status, Freshworks certification, marketplace listing, customer
 * count, productivity percentage or SLA. None is evidenced.
 */
export const FD_TRUST = {
  eyebrow: 'PHẠM VI TRIỂN KHAI',
  h2: 'Tích hợp Freshdesk cần bắt đầu từ ticket structure, permission và workflow thực tế',
  description:
    'Field, ticket type, permission, user role và quy trình hỗ trợ có thể khác nhau giữa từng tài khoản Freshdesk. Phạm vi tích hợp cần được xác định qua khảo sát và kiểm thử thay vì áp dụng cùng một cấu hình cho mọi doanh nghiệp.',
  cta: { label: 'Trao đổi về workflow Freshdesk hiện tại' },
  links: [
    { label: 'Ước tính cấu hình & chi phí', path: FD_ESTIMATOR_HREF },
    { label: 'Xem bảng giá Gcalls', path: ROUTES.pricing },
  ],
} as const

/* ── 17 · FAQ (§24) ─────────────────────────────────────────────── */

export interface FdFaqItem {
  q: string
  a: string
  link?: { label: string; path: string }
}

/**
 * FAQ — the seven approved questions.
 *
 * FAQ 2 uses the §24 "IF NOT VERIFIED" wording verbatim (gate A WITHHELD).
 * FAQ 3 uses the §24 "IF NOT VERIFIED" wording verbatim (gate C CONTEXT ONLY —
 *   no recent-ticket field list is evidenced).
 * FAQ 4 uses the §24 "IF NOT VERIFIED" wording verbatim (gates E and F
 *   WITHHELD). It must never be rewritten to assert automatic creation.
 * FAQ 5 is the approved answer, which already carries the gate I split: data may
 *   live in Gcalls OR be linked to Freshdesk, and where it is stored is a survey
 *   item.
 * FAQ 6 uses the §24 "IF NOT VERIFIED" wording verbatim, which is exactly the
 *   gate J split: recording in Gcalls affirmed conditionally, sync to Freshdesk
 *   requiring separate verification. Do not merge the two halves.
 */
export const FD_FAQ: FdFaqItem[] = [
  {
    q: 'Tổng đài tích hợp Freshdesk là gì?',
    a: 'Đây là mô hình kết nối hoạt động nghe gọi của Gcalls với Freshdesk để đội Support có thể sử dụng customer context, ticket liên quan và dữ liệu tương tác phù hợp trong cùng workflow CSKH.',
  },
  {
    q: 'Gcalls có hỗ trợ Click-to-Call trên Freshdesk không?',
    a: 'Khả năng thực hiện cuộc gọi từ Freshdesk phụ thuộc vào phương thức tích hợp và cấu hình triển khai hiện tại. Gcalls sẽ xác định capability phù hợp trong quá trình khảo sát.',
  },
  {
    q: 'Khi khách hàng gọi đến có thể xem ticket gần nhất không?',
    a: 'Khả năng hiển thị ticket và customer context phụ thuộc vào dữ liệu, permission và cấu hình tích hợp. Phạm vi thông tin cần được xác định trong bước khảo sát kỹ thuật.',
  },
  {
    q: 'Gcalls có tự động tạo ticket sau mỗi cuộc gọi không?',
    a: 'Khả năng tạo hoặc cập nhật ticket phụ thuộc vào workflow và cấu hình tích hợp hiện tại. Gcalls cần khảo sát hệ thống trước khi xác nhận luồng có thể triển khai.',
  },
  {
    q: 'Lịch sử cuộc gọi có được lưu trong Freshdesk không?',
    a: 'Dữ liệu cuộc gọi có thể được lưu trong Gcalls hoặc được liên kết với Freshdesk theo phạm vi tích hợp. Cần xác định rõ trường dữ liệu và nơi lưu trong quá trình khảo sát.',
  },
  {
    q: 'Ghi âm có được đồng bộ vào Freshdesk không?',
    a: 'Ghi âm có thể được lưu trong hệ thống Gcalls khi cấu hình dịch vụ hỗ trợ. Việc đồng bộ hoặc liên kết bản ghi với Freshdesk cần được xác minh riêng theo phạm vi triển khai.',
  },
  {
    q: 'Freshdesk Integration khác Gcalls CX như thế nào?',
    a: 'Freshdesk Integration tập trung kết nối hoạt động thoại với ticket và workflow hỗ trợ hiện có. Gcalls CX giải quyết bài toán rộng hơn về quản lý giao tiếp đa kênh trên một Contact Center tập trung.',
    link: { label: 'Gcalls CX', path: ROUTES.gcallsCx },
  },
]

/* ── 18 · Final CTA (§25) ───────────────────────────────────────── */

export const FD_FINAL_CTA = {
  eyebrow: 'GCALLS × FRESHDESK',
  h2: 'Xem hoạt động nghe gọi vận hành trong workflow Freshdesk của đội Support',
  description:
    'Chia sẻ cấu trúc ticket, user và quy trình CSKH hiện tại để Gcalls xác định phạm vi tích hợp và demo phù hợp.',
  primaryCta: { label: 'Xem demo tích hợp Freshdesk' },
  secondaryCta: { label: 'Tư vấn tích hợp' },
} as const

/* ── 19 · Onward internal links (§27) ───────────────────────────── */

/**
 * Contextual, not a link dump (§27).
 *
 * The generic Helpdesk page, the integration hub, Zendesk, Gcalls Plus, Gcalls
 * CX, QA QC Center, the estimator and pricing are all linked from their own
 * dedicated sections above, so they are not repeated here.
 *
 * The two industry links are contextually earned rather than dumped: SaaS
 * Support and E-commerce Customer Service are two of the four §17 use cases, and
 * BPO / support centre is one of the §3 personas.
 */
export const FD_LINKS = {
  h2: 'Xem thêm',
  items: [
    { label: 'Tổng đài cho Thương mại điện tử', path: ROUTES.ecommerce },
    { label: 'Tổng đài cho BPO', path: ROUTES.bpo },
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
 * metric, SLA, partner or certification property. `featureList` carries exactly
 * the four published capabilities, so the structured data cannot assert more
 * than the visible page — in particular it does not mention Click-to-Call, an
 * incoming call box, SMS, ticket creation or recording synchronisation.
 */
export function buildFreshdeskJsonLd(origin: string) {
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
            name: 'Freshdesk',
            item: `${origin}${ROUTES.freshdesk}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: 'Tổng đài tích hợp Freshdesk',
        serviceType: 'Freshdesk Telephony Integration',
        description: FD_DIRECT_ANSWER.answer,
        provider: { '@type': 'Organization', name: 'Gcalls' },
        url: `${origin}${ROUTES.freshdesk}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Gcalls for Freshdesk',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Helpdesk Telephony Integration',
        operatingSystem: 'Web browser',
        description: FD_OVERVIEW.description,
        url: `${origin}${ROUTES.freshdesk}`,
        featureList: FD_CAPABILITIES.items.map((c) => c.title),
        provider: { '@type': 'Organization', name: 'Gcalls' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FD_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
