/**
 * Approved content for /tich-hop/zendesk/ — Checkpoint INT-05.
 *
 * Final page of Integration Cluster V1.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED.
 * ---------------------------------------------------------------------------
 * Every string below comes from the approved INT-05 source. Do not rewrite,
 * shorten, paraphrase or "improve" it, and do not add capabilities, Zendesk
 * fields, ticket behaviours, plans or benefits that are not here.
 *
 * NOT A RENAMED FRESHDESK FILE. INT-05 §1 explicitly forbids copying INT-04 text
 * and swapping the vendor. The approved copy differs (hero value points,
 * problems, use case 4, benefit 2), and every sentence authored here for the
 * shared components — flow details, capability details, notes — is written for
 * Zendesk's own angle rather than lifted from `freshdeskIntegration.ts`. That
 * angle is MULTI-AGENT HANDOVER: §3 names loss of conversation context on
 * ownership change as a core pain, and §17 use case 4 is an enterprise workflow
 * where several agents work one request. Keep that thread if you edit.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING (INT-05 §28)
 * ---------------------------------------------------------------------------
 * Never publish without explicit current evidence:
 *   Click-to-Call · answering calls inside Zendesk ·
 *   "mỗi cuộc gọi tự động tạo ticket" · "đồng bộ toàn bộ trường ticket" ·
 *   "ghi âm được đồng bộ vào Zendesk" · cập nhật trạng thái/tag/disposition ·
 *   "hỗ trợ mọi gói Zendesk" · "real-time guaranteed" ·
 *   "cài đặt trong vài phút" / any fixed duration · any productivity
 *   percentage · "đối tác chính thức của Zendesk" · "được Zendesk chứng nhận" ·
 *   any marketplace listing · any SLA.
 *
 * Required register instead: "có thể", "hỗ trợ", "theo cấu hình", "theo phạm vi
 * tích hợp", "khi nền tảng và cấu hình cho phép", "tùy API", "cần khảo sát".
 *
 * ---------------------------------------------------------------------------
 * EVIDENCE BASE — HELPDESK, NOT CRM
 * ---------------------------------------------------------------------------
 * Zendesk is governed by the HELPDESK evidence base, which is materially
 * NARROWER than the CRM base used by INT-01/02/03:
 *
 *  - `src/data/estimator.ts`, solution `helpdesk`: `helpdeskPlatform` names
 *    Freshdesk, ZENDESK and "Khác"; `helpdeskNeeds` enumerates EXACTLY TWO
 *    connection needs — "Gắn cuộc gọi vào ticket" (LINKING) and "Lịch sử cuộc
 *    gọi trong hồ sơ hỗ trợ" (history in the support record).
 *  - `src/data/helpdeskIntegration.ts` (S02, approved & locked): four
 *    conditional capabilities — Call Context, Ticket / Support Record
 *    CONNECTION, Interaction History, Customer Identification — plus Zendesk
 *    named as a routed platform with CONNECTION SCOPE ONLY, plus an approved
 *    support-context CATEGORY list.
 *  - `src/data/gcallsPlus.ts` (P01, approved): call history and activity data
 *    affirmed as a Gcalls product capability.
 *  - `src/data/qaQcCenter.ts` (P02, approved): the QA workflow runs "từ bản ghi
 *    cuộc gọi", which affirms recordings can exist in Gcalls.
 *
 * THE DECISIVE CONTRAST. `crmNeeds` enumerates FOUR needs and INCLUDES
 * `click-to-call`; `helpdeskNeeds` enumerates TWO and includes NO calling
 * mechanism at all. That is why this page publishes fewer capabilities than the
 * Salesforce or Zoho pages, and it must not be "fixed" by borrowing from them.
 *
 * ---------------------------------------------------------------------------
 * EVIDENCE PRINCIPLE (§10) — THE SOURCE ITSELF SAYS "CẦN KIỂM TRA"
 * ---------------------------------------------------------------------------
 * Historical SEO and public material mentions Click-to-Call, receiving calls,
 * ticket creation, call history, recording and customer context for Zendesk.
 * §10 states plainly that the CURRENT SEO WORKBOOK MARKS THIS INTEGRATION
 * "Cần kiểm tra" — the source flags itself as unverified. That is stronger
 * grounds for withholding than INT-04 had for Freshdesk, not weaker.
 *
 * §10 also sets a ceiling: a Zendesk platform page must not claim more than the
 * generic Helpdesk Integration page, the current estimator configuration, or
 * verified current product evidence. The locked S02 page publishes four
 * capabilities and Click-to-Call is not among them, so neither is it here.
 *
 * Home marketing copy is not an evidence base either — `IntegrationsSection`
 * renders a "Zendesk ✓" badge and a vendor tile, and S01 already declined
 * recording sync despite a comparable Home line.
 *
 * ---------------------------------------------------------------------------
 * CAPABILITY EVIDENCE GATES (§11) — TWELVE DECISIONS
 * ---------------------------------------------------------------------------
 * A. CLICK-TO-CALL — WITHHELD.
 * `helpdeskNeeds` — the same approved config that names Zendesk — enumerates two
 * needs and Click-to-Call is not one of them. In this repository Click-to-Call
 * exists ONLY as a CRM capability (`crmIntegration.ts`, `crmNeeds`), and §11A
 * explicitly forbids inheriting it from the CRM integrations. S03 §13 set the
 * same rule when it withheld Click-to-Call for POS. §28 names it as a
 * must-not-publish item. FAQ 2 therefore uses the §24 "IF NOT VERIFIED" wording,
 * the hero claims no calling mechanism, and the flow/Before-After copy says
 * "configured call action".
 *
 * B. INCOMING CALL / EMBEDDED CALL BOX — WITHHELD (embedded box).
 * §11B requires the two halves be differentiated and NOT merged:
 *   "Gcalls receives an incoming call" — VERIFIED. This is a Gcalls product
 *     capability (`gcallsPlus.ts`; the approved call-box surfaces in
 *     `@/components/product-ui`). It is depicted and described ONLY as the
 *     Gcalls calling layer.
 *   "the call is answered inside Zendesk" — WITHHELD. Nothing evidences an
 *     embedded Zendesk call box. No capability card, and no copy says a call is
 *     answered inside Zendesk.
 * §19 requires the visual carrying "GCALLS · CUỘC GỌI ĐẾN" to be captioned so a
 * reader cannot mistake it for an embedded Zendesk call box; `layerNote` below is
 * that caption and is rendered under both visuals that show the panel.
 *
 * C. CUSTOMER CONTEXT / SIDE PANEL — CONTEXT ONLY.
 * S02 publishes "Call Context" and "Customer Identification" conditionally, and
 * that is the whole of it. NO Zendesk side panel or app-sidebar placement is
 * evidenced, so none is claimed. No exact Zendesk field name is published; §15's
 * categories are published as POSSIBLE context with an explicit scope line.
 *
 * D. TICKET CONNECTION — VERIFIED & PUBLISHED, scoped to CONTEXT + LINKING.
 * §11D requires all four sub-capabilities be differentiated:
 *   view ticket context   → PUBLISHED (conditional). S02 "Call Context".
 *   link call with ticket → PUBLISHED (conditional). `helpdeskNeeds` offers
 *                           "Gắn cuộc gọi vào ticket"; S02's capability comment
 *                           states it describes LINKING and deliberately not
 *                           creating.
 *   update ticket         → WITHHELD. No evidence of any write to a ticket.
 *   create ticket         → WITHHELD. See gates E and F.
 *
 * E. MANUAL TICKET CREATION — WITHHELD. No approved source evidences Gcalls
 * creating a Zendesk ticket. `helpdeskNeeds` offers no creation option.
 *
 * F. AUTOMATIC TICKET CREATION — WITHHELD. The strongest historical claim with
 * the least support. S02's own gate closed it NEGATIVE and the S02 claim guard
 * names "tự động tạo ticket" as a forbidden universal behaviour. Nothing on this
 * page implies any call creates a ticket.
 *
 * G. UNKNOWN-CALLER CONTACT CREATION — WITHHELD. No approved source evidences
 * Gcalls writing a new contact into Zendesk. Not published in any form,
 * including as a workflow step.
 *
 * H. CALL ACTIVITY / HISTORY — TWO DECISIONS, never merged (§11H).
 *    GCALLS CALL HISTORY — VERIFIED & PUBLISHED. `gcallsPlus.ts` FAQ (approved)
 *      affirms it: "Gcalls Plus hỗ trợ theo dõi lịch sử và dữ liệu hoạt động
 *      cuộc gọi".
 *    ZENDESK HISTORY SYNC — CONDITIONAL ONLY. `helpdeskNeeds` offers "Lịch sử
 *      cuộc gọi trong hồ sơ hỗ trợ" and S02 publishes "Interaction History"
 *      conditionally — published, but never as automatic, complete or
 *      field-guaranteed. §11H is explicit that storing a call in Gcalls is NOT
 *      proof it is written into Zendesk, so capability 03 carries both halves in
 *      its own wording and FAQ 5 makes storage location a survey item.
 *
 * I. RECORDING — TWO DECISIONS, never merged (§11I).
 *    RECORDING IN GCALLS — VERIFIED & PUBLISHED, conditional register.
 *      `qaQcCenter.ts` (approved) runs QA "từ bản ghi cuộc gọi". Stated ONLY in
 *      FAQ 6, and NOT as a Zendesk-integration capability, because it is not one.
 *    RECORDING SYNC TO ZENDESK — WITHHELD. S02's gate closed this NEGATIVE, and
 *      S01, INT-02, INT-03 and INT-04 all reached the same conclusion.
 *
 * J. TAGS / DISPOSITIONS / STATUS UPDATE — WITHHELD.
 * Nothing evidences Gcalls writing a tag, disposition or ticket status into
 * Zendesk. VERIFIED FIELDS: none.
 * IMPORTANT DISTINCTION, do not blur it: "Trạng thái hiện tại" appears in the
 * §15 support-context categories as something an agent may READ, which is what
 * S02 already approved. Reading a status as context is not updating it. No copy
 * or visual anywhere depicts Gcalls setting a status, applying a tag or writing a
 * disposition.
 *
 * PARTNERSHIP / ZENDESK CERTIFICATION / MARKETPLACE / SLA — NOT PUBLISHED.
 * No evidence exists; `docs/CHECKPOINT_S02_HELPDESK_INTEGRATION.md` records the
 * same finding for Zendesk. Naming Zendesk asserts CONNECTION EXPERIENCE ONLY.
 *
 * PLAN COVERAGE — NOT PUBLISHED. Nothing evidences which Zendesk plans support
 * the integration, so none is named and no "every plan" claim appears.
 *
 * SETUP INSTRUCTIONS — NOT PUBLISHED as universal (§18). Nothing evidences which
 * connection method is current, so setup step 5 says "phương thức kết nối hiện
 * hành" and names no app, extension or API version.
 *
 * ---------------------------------------------------------------------------
 * SEO OWNERSHIP
 * ---------------------------------------------------------------------------
 * This page owns Zendesk-specific commercial intent (MOFU/BOFU): "tổng đài tích
 * hợp Zendesk", "Gcalls Zendesk", "tích hợp Gcalls Zendesk", "Zendesk call
 * center", "gọi điện trên Zendesk", "click to call Zendesk", "cuộc gọi và ticket
 * Zendesk", "customer context Zendesk", "lịch sử cuộc gọi Zendesk", "tổng đài
 * cho đội support".
 *
 * NOTE ON "click to call Zendesk". It is a listed §4 secondary keyword, but gate
 * A is WITHHELD, so the page does not claim the capability. The keyword is served
 * HONESTLY: FAQ 2 answers the question a searcher is asking by explaining that
 * the mechanism depends on configuration and will be scoped in survey. Ranking
 * for a question is not asserting a feature. The SEO title likewise avoids it.
 *
 * Generic Helpdesk intent ("tổng đài tích hợp Helpdesk") belongs to
 * /tong-dai-tich-hop-helpdesk/ and is NOT competed for here — §20's routing block
 * hands that visitor over. Freshdesk intent belongs to /tich-hop/freshdesk/; it
 * appears once, as a routed link, with no superiority comparison (§21).
 *
 * Legacy canonicals /gcalls-tich-hop-zendesk/ and /tong-dai-tich-hop-zendesk/ are
 * NOT used; the canonical is derived from the route by `buildCanonical`.
 *
 * ---------------------------------------------------------------------------
 * BOUNDARIES
 * ---------------------------------------------------------------------------
 * This page owns the Zendesk support workflow. Generic Helpdesk evaluation
 * belongs to Helpdesk Integration, CRM records and lead data to CRM Integration,
 * omnichannel conversations to Gcalls CX, AI-assisted call quality review to QA
 * QC Center, and the calling layer itself to Gcalls Plus. This page does not
 * introduce, teach, review or compare Zendesk.
 */

import { ROUTES } from '@/config/navigation'

/**
 * Conversion context for Zendesk Integration CTAs (§6, §25, §29).
 *
 * `helpdesk_integration` is a pre-existing typed `LeadSource` and
 * 'Tích hợp Helpdesk' a pre-existing approved `LEAD_NEEDS` value, so this is the
 * most specific valid combination already supported and no shared type changed.
 *
 * The platform travels in `product`, the only typed slot that both survives
 * normalisation and is rendered back to the visitor — via the
 * `PRODUCT_DISPLAY_LABELS` allow-list in `src/lib/leads/ctaLink.ts`, whose
 * `Zendesk` entry is what makes §25's "Zendesk context is visibly retained" true
 * rather than merely present in the URL.
 */
export const ZENDESK_DEMO_LEAD = {
  intent: 'demo',
  source: 'helpdesk_integration',
  product: 'Zendesk',
  solution: 'Tích hợp Helpdesk',
} as const

export const ZENDESK_CONSULT_LEAD = {
  intent: 'consultation',
  source: 'helpdesk_integration',
  product: 'Zendesk',
  solution: 'Tích hợp Helpdesk',
} as const

/**
 * Estimator link (§26).
 *
 * Reuses the EXISTING generic slug. `helpdesk-integration` is already in
 * `PRODUCT_SLUG_ALIASES` (`src/components/estimator/Estimator.tsx`) where it maps
 * to the `helpdesk` solution and preselects it. A `zendesk` key would resolve to
 * no solution and silently drop the visitor on the "choose a solution" step.
 *
 * Zendesk context is preserved separately on the LeadForm via the two lead
 * contexts above, so nothing is lost by using the generic estimator key.
 */
export const ZD_ESTIMATOR_HREF = `${ROUTES.costEstimator}?product=helpdesk-integration`

/* ── 01 · Hero (§6) ─────────────────────────────────────────────── */

/**
 * Note what the value points do NOT say: none claims Click-to-Call, an embedded
 * Zendesk call box, or ticket creation. Value 1 places voice activity NEAR the
 * ticket workflow; it asserts no mechanism for starting the call.
 */
export const ZD_HERO = {
  eyebrow: 'GCALLS × ZENDESK',
  h1: 'Tổng đài tích hợp Zendesk cho đội CSKH và Support',
  description:
    'Kết nối hoạt động nghe gọi của Gcalls với Zendesk để nhân viên có thể sử dụng customer context, ticket liên quan và dữ liệu hỗ trợ gần hơn với quy trình đang xử lý.',
  valuePoints: [
    {
      title: 'Đưa cuộc gọi gần ticket workflow',
      detail:
        'Hoạt động thoại được đặt gần hơn với hồ sơ và quy trình hỗ trợ đang được quản lý trong Zendesk.',
    },
    {
      title: 'Có customer context khi hỗ trợ',
      detail:
        'Thông tin liên quan giúp nhân viên hiểu khách hàng và yêu cầu trước khi tiếp tục cuộc hội thoại.',
    },
    {
      title: 'Theo dõi lịch sử hỗ trợ tập trung hơn',
      detail:
        'Dữ liệu phù hợp có thể được liên kết hoặc ghi nhận theo phạm vi tích hợp để đội ngũ tiếp tục follow-up.',
    },
  ],
  primaryCta: { label: 'Xem demo tích hợp Zendesk' },
  secondaryCta: { label: 'Xem workflow tích hợp', href: '#workflow-zendesk' },
} as const

/* ── 02 · Direct answer / AIO (§7) ──────────────────────────────── */

/** Plain rendered HTML. Never hidden in an accordion, tab or modal. */
export const ZD_DIRECT_ANSWER = {
  question: 'Tổng đài tích hợp Zendesk là gì?',
  answer:
    'Tổng đài tích hợp Zendesk kết nối hoạt động nghe gọi của Gcalls với quy trình hỗ trợ trên Zendesk để nhân viên có thể sử dụng customer context, ticket liên quan và dữ liệu tương tác phù hợp trong cùng workflow CSKH. Phạm vi chức năng phụ thuộc vào cấu hình Gcalls, Zendesk, API và yêu cầu triển khai của doanh nghiệp.',
} as const

/* ── 03 · Business problems (§8) ────────────────────────────────── */

/** Descriptive only — §8 forbids a numeric productivity claim. None appears. */
export const ZD_PROBLEMS = {
  eyebrow: 'BÀI TOÁN SUPPORT',
  h2: 'Zendesk quản lý ticket, nhưng cuộc gọi vẫn có thể nằm ngoài lịch sử hỗ trợ',
  items: [
    {
      n: '01',
      title: 'Nhân viên phải chuyển đổi giữa nhiều công cụ',
      detail:
        'Agent quản lý ticket trong Zendesk nhưng thực hiện cuộc gọi ở một hệ thống riêng, khiến quy trình hỗ trợ bị chia thành nhiều bước.',
    },
    {
      n: '02',
      title: 'Thiếu customer context khi cuộc gọi bắt đầu',
      detail:
        'Nếu dữ liệu Zendesk và hoạt động gọi chưa kết nối phù hợp, nhân viên phải tự tìm contact hoặc ticket trong lúc khách hàng chờ.',
    },
    {
      n: '03',
      title: 'Lịch sử cuộc hội thoại bị phân mảnh',
      detail:
        'Call activity nằm ngoài ticket workflow khiến nhân viên tiếp nhận sau có thể thiếu bối cảnh để tiếp tục xử lý.',
    },
    {
      n: '04',
      title: 'Follow-up phụ thuộc vào ghi chú thủ công',
      detail:
        'Nhân viên có thể phải nhập lại nội dung sau cuộc gọi để giữ lịch sử hỗ trợ cập nhật.',
    },
  ],
} as const

/* ── 04 · Overview (§9) ─────────────────────────────────────────── */

/**
 * Overview and core flow.
 *
 * The six flow NODES are the approved §9 chain verbatim. Node 02 is "configured
 * call action" as approved — generic on purpose, because gates A and B are closed
 * and this diagram must not assert a mechanism. The one-line details are the
 * minimum the shared `IntegrationWorkflow` component requires; each is written
 * for this page and carries the handover thread where it fits.
 */
export const ZD_OVERVIEW = {
  eyebrow: 'GCALLS FOR ZENDESK',
  h2: 'Đưa lớp giao tiếp thoại vào nơi đội Support đang quản lý ticket',
  description:
    'Zendesk tiếp tục quản lý ticket và support workflow. Gcalls bổ sung lớp nghe gọi để customer context, call activity và bước follow-up được đặt gần hơn với quy trình hỗ trợ hiện tại.',
  flow: [
    {
      n: '01',
      label: 'Zendesk contact / ticket',
      detail: 'Yêu cầu hỗ trợ đang được quản lý trong Zendesk.',
    },
    {
      n: '02',
      label: 'Configured call action',
      detail: 'Cuộc gọi diễn ra theo capability và cấu hình đã triển khai.',
    },
    {
      n: '03',
      label: 'Gcalls conversation',
      detail: 'Lớp giao tiếp thoại do Gcalls xử lý.',
    },
    {
      n: '04',
      label: 'Customer context',
      detail: 'Thông tin liên quan giúp agent nắm tình huống.',
    },
    {
      n: '05',
      label: 'Support activity',
      detail: 'Dữ liệu phù hợp được ghi nhận hoặc liên kết theo phạm vi tích hợp.',
    },
    {
      n: '06',
      label: 'Ticket follow-up',
      detail: 'Người phụ trách tiếp theo tiếp tục xử lý trong Zendesk.',
    },
  ],
} as const

/* ── 05 · Core capabilities (§12) ───────────────────────────────── */

/**
 * The four §12 safe-baseline capabilities, in §12's order — and ONLY those.
 *
 * Click-to-Call (A), embedded call box (B), manual ticket creation (E),
 * automatic ticket creation (F), unknown-caller contact creation (G) and
 * tags/dispositions/status writes (J) all failed their gates, so none has a card.
 *
 * Card 03 carries the gate H SPLIT in its own wording: history in Gcalls is
 * affirmed, writing it into Zendesk stays conditional. Do not collapse the two
 * halves into one sentence.
 * Card 02 is ticket CONTEXT and LINKING only — never creation or update.
 */
export const ZD_CAPABILITIES = {
  eyebrow: 'NĂNG LỰC TÍCH HỢP',
  h2: 'Những năng lực được xác nhận khi kết nối Gcalls với Zendesk',
  items: [
    {
      n: '01',
      title: 'Customer Context',
      detail:
        'Agent có thể nắm thông tin khách hàng liên quan trước khi trả lời, trong phạm vi mà dữ liệu, permission và cấu hình tích hợp cho phép.',
    },
    {
      n: '02',
      title: 'Ticket / Support Record Context',
      detail:
        'Cuộc gọi có thể được đặt cạnh và liên kết với ticket hoặc hồ sơ hỗ trợ đang tồn tại, khi nền tảng và cấu hình tích hợp cho phép.',
    },
    {
      n: '03',
      title: 'Call Activity',
      detail:
        'Lịch sử và dữ liệu hoạt động cuộc gọi được lưu trong Gcalls. Việc đưa dữ liệu đó sang Zendesk phụ thuộc vào phạm vi tích hợp và khả năng của nền tảng.',
    },
    {
      n: '04',
      title: 'Support Workflow Continuity',
      detail:
        'Khi một yêu cầu đi qua nhiều người phụ trách, bối cảnh cuộc hội thoại nằm gần ticket thay vì ở một luồng dữ liệu riêng ngoài Zendesk.',
    },
  ],
} as const

/* ── 06 · Workflow (§13) ────────────────────────────────────────── */

export const ZD_WORKFLOW = {
  anchorId: 'workflow-zendesk',
  eyebrow: 'QUY TRÌNH',
  h2: 'Từ Zendesk contact hoặc ticket đến cuộc gọi và bước hỗ trợ tiếp theo',
  steps: [
    {
      n: '01',
      title: 'Mở contact hoặc ticket',
      detail:
        'Nhân viên tiếp tục làm việc trên yêu cầu hỗ trợ đang được quản lý trong Zendesk.',
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
        'Agent follow-up trong Zendesk thay vì duy trì lịch sử hỗ trợ ở một luồng riêng ngoài Helpdesk.',
    },
  ],
} as const

/* ── 07 · Before / after (§14) ──────────────────────────────────── */

/**
 * Illustrative only. §14 forbids an ROI percentage, and the shared component
 * renders no metrics slot, so one cannot be added without changing it too.
 *
 * The AFTER chain says "configured call action", not Click-to-Call — gate A is
 * closed and this diagram must not become where the claim slips in.
 */
export const ZD_BEFORE_AFTER = {
  eyebrow: 'TRƯỚC & SAU TÍCH HỢP',
  h2: 'Giảm những bước chuyển đổi thủ công giữa Zendesk và hệ thống gọi',
  before: {
    label: 'Trước tích hợp',
    steps: [
      'Zendesk ticket',
      'Copy phone number',
      'Call tool',
      'Conversation',
      'Manual note',
      'Quay lại Zendesk',
      'Cập nhật ticket',
    ],
  },
  after: {
    label: 'Sau tích hợp',
    steps: [
      'Zendesk contact / ticket',
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
 * §15 permits these "only where verified". The six below map onto the category
 * set the locked S02 page already publishes, so nothing new is asserted.
 *
 * "Trạng thái hỗ trợ" is a READ category — something an agent may see. Gate J
 * withholds WRITING a status, tag or disposition, and nothing here implies Gcalls
 * sets any of them. Do not let the two blur together.
 *
 * No exact Zendesk field name appears, and `assigned agent` / `company` are
 * deliberately absent: neither is evidenced in any approved source (the same
 * exclusion INT-04 made). The scope line is what keeps this POSSIBLE context
 * rather than a promise of synced fields.
 */
export const ZD_SUPPORT_CONTEXT = {
  eyebrow: 'CUSTOMER & TICKET CONTEXT',
  h2: 'Hiểu yêu cầu hỗ trợ trước khi tiếp tục cuộc hội thoại',
  description:
    'Khi customer context, ticket liên quan và lịch sử hỗ trợ được đặt gần hoạt động gọi, agent có thể hiểu tình huống tốt hơn trước khi phản hồi hoặc follow-up.',
  points: [
    'Customer identity',
    'Ticket đang xử lý',
    'Ticket trước đó',
    'Tương tác gần đây',
    'Trạng thái hỗ trợ',
    'Ghi chú',
  ],
  scopeNote:
    'Đây là các nhóm dữ liệu agent có thể xem, không phải danh sách trường được đồng bộ mặc định và không bao gồm việc Gcalls cập nhật trạng thái hay tag trên ticket. Phạm vi thông tin thực tế phụ thuộc vào dữ liệu, permission và cấu hình tích hợp, cần được xác định trong bước khảo sát kỹ thuật.',
} as const

/* ── 09 · Benefits (§16) ────────────────────────────────────────── */

/**
 * Four conservative statements, exactly as approved. No percentage, time-saved
 * or efficiency figure — the shared `IntegrationBenefits` component takes plain
 * strings, so there is no slot to smuggle a number into.
 */
export const ZD_BENEFITS = {
  eyebrow: 'GIÁ TRỊ VẬN HÀNH',
  h2: 'Giữ cuộc gọi gần hơn với quy trình ticket và customer support',
  items: [
    'Giảm chuyển đổi giữa nhiều công cụ',
    'Có thêm context khi tiếp nhận yêu cầu',
    'Theo dõi lịch sử hỗ trợ tập trung hơn',
    'Dễ tiếp tục xử lý khi ticket thay đổi người phụ trách',
  ],
} as const

/* ── 10 · Use cases (§17) ───────────────────────────────────────── */

/** Four support workflows. No claimed result of any kind (§17). */
export const ZD_USE_CASES = {
  eyebrow: 'TÌNH HUỐNG SỬ DỤNG',
  h2: 'Gcalls × Zendesk phù hợp với những workflow hỗ trợ nào?',
  items: [
    {
      role: 'Inbound Customer Support',
      flow: 'Agent tiếp nhận yêu cầu trong bối cảnh contact và ticket đang được quản lý trong Zendesk.',
    },
    {
      role: 'Ticket Follow-up',
      flow: 'Nhân viên gọi lại cho khách hàng và tiếp tục xử lý ticket từ context hiện có.',
    },
    {
      role: 'SaaS Support',
      flow: 'Đội Support theo dõi cuộc gọi và ticket gần hơn khi xử lý vấn đề sản phẩm hoặc dịch vụ.',
    },
    {
      role: 'Enterprise Customer Service',
      flow: 'Đội CSKH duy trì customer và support context khi nhiều nhân viên cùng tham gia xử lý một yêu cầu.',
    },
  ],
} as const

/* ── 11 · Setup (§18) ───────────────────────────────────────────── */

/**
 * Setup process — nine steps, no duration on any step or in total (§18).
 *
 * Step 5 says "phương thức kết nối hiện hành" and names NO app, extension, API
 * version or credential type. §18 forbids publishing old setup instructions as a
 * universal current method, and §10 records that the source workbook itself marks
 * this integration "Cần kiểm tra" — so nothing here asserts a mechanism.
 *
 * The note also refuses the plan-coverage claim §18 forbids.
 */
export const ZD_SETUP = {
  eyebrow: 'THIẾT LẬP',
  h2: 'Tích hợp theo cấu hình Zendesk và workflow hỗ trợ đang sử dụng',
  steps: [
    { n: '01', title: 'Khảo sát Zendesk workflow' },
    { n: '02', title: 'Xác định contact, ticket và dữ liệu liên quan' },
    { n: '03', title: 'Xác định user và hotline' },
    { n: '04', title: 'Xác định capability cần triển khai' },
    { n: '05', title: 'Kiểm tra permission, API và phương thức kết nối hiện hành' },
    { n: '06', title: 'Cấu hình integration' },
    { n: '07', title: 'Kiểm thử cuộc gọi, context và ticket workflow' },
    { n: '08', title: 'Hướng dẫn đội Support' },
    { n: '09', title: 'Go-live' },
  ],
  note: 'Phạm vi và thời gian triển khai phụ thuộc vào ticket form, field, permission, API, số lượng người dùng, hotline và capability cần sử dụng, nên được xác định sau bước khảo sát thay vì theo một mốc cố định. Gcalls không mặc định mọi gói Zendesk đều hỗ trợ cùng một phạm vi tích hợp, và phương thức kết nối cần được xác nhận theo hệ thống thực tế.',
} as const

/* ── 12 · UI preview (§19) ──────────────────────────────────────── */

/**
 * UI preview copy.
 *
 * §19 priority 1 is a current approved Zendesk screenshot — none exists here, and
 * §19 also requires verifying that any such screenshot reflects CURRENT
 * behaviour, which cannot be done. Priority 2 (a real Gcalls-side integration
 * screenshot) does not exist either. The page uses priority 3: conceptual,
 * deliberately unbranded surfaces.
 *
 * `layerNote` exists because §19 requires it explicitly. §19 names the string
 * "GCALLS · CUỘC GỌI ĐẾN" as the case needing a clarifying label or caption; this
 * page's visual goes further and labels the block "GCALLS · LỚP NGHE GỌI" — the
 * Gcalls calling layer — in the component itself, so the distinction is made at
 * the label level rather than only in a caption. `layerNote` is the caption on top
 * of that, and it is rendered under BOTH places the visual appears (hero and this
 * section) because gate B is the one a reader is most likely to over-read.
 */
export const ZD_UI_PREVIEW = {
  eyebrow: 'GIAO DIỆN TÍCH HỢP',
  h2: 'Giữ customer context và ticket gần hoạt động nghe gọi',
  description:
    'Sơ đồ dưới đây minh họa lớp tích hợp phía Gcalls: cuộc gọi được xử lý trên Gcalls và liên kết với hồ sơ hỗ trợ đang tồn tại, cùng bối cảnh mà người phụ trách tiếp theo có thể xem lại.',
  layerNote:
    'Khối "GCALLS · LỚP NGHE GỌI" là lớp nghe gọi của Gcalls, không phải call box được nhúng trong Zendesk. Trang này không tuyên bố khả năng trả lời cuộc gọi ngay trong giao diện Zendesk.',
  note: 'Đây là sơ đồ khái niệm phía Gcalls với dữ liệu mẫu đã ẩn thông tin nhận dạng, không phải ảnh chụp màn hình Zendesk và không mô phỏng giao diện Zendesk. Bố cục cùng phạm vi dữ liệu thực tế phụ thuộc vào cấu hình tích hợp của doanh nghiệp.',
} as const

/* ── 13 · Zendesk vs generic Helpdesk (§20) ─────────────────────── */

export const ZD_VS_HELPDESK = {
  eyebrow: 'ZENDESK-SPECIFIC WORKFLOW',
  h2: 'Trang này dành cho doanh nghiệp đã sử dụng Zendesk',
  description:
    'Nếu doanh nghiệp đang đánh giá tổng đài tích hợp Helpdesk nói chung, hãy xem giải pháp Helpdesk Integration. Trang này tập trung vào workflow khi Zendesk đã là hệ thống quản lý ticket và hỗ trợ hiện tại.',
  cta: {
    label: 'Xem giải pháp Tổng đài tích hợp Helpdesk',
    path: ROUTES.helpdeskIntegration,
  },
} as const

/* ── 14 · Related Helpdesk platforms (§21) ──────────────────────── */

/**
 * Routing only. §21 forbids a feature superiority comparison, so each
 * description states connection scope and nothing else — no comparison adjective
 * appears anywhere.
 */
export const ZD_RELATED = {
  h2: 'Doanh nghiệp đang sử dụng Helpdesk khác?',
  description:
    'Mỗi nền tảng Helpdesk có cấu trúc ticket và cách kết nối riêng. Xem trang tương ứng với hệ thống doanh nghiệp đang sử dụng.',
  items: [
    {
      name: 'Freshdesk',
      detail: 'Kết nối hoạt động nghe gọi với quy trình hỗ trợ trên Freshdesk.',
      path: ROUTES.freshdesk,
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
 * A ROUTING TABLE, not a capability list (§22). It exists so each need reaches
 * the page that owns it, and so this page keeps Zendesk intent instead of
 * competing with the generic Helpdesk page or being mistaken for the calling
 * product or the omnichannel product. The Zendesk row is marked `current` and is
 * never rendered as a self-link.
 */
export const ZD_BOUNDARY = {
  eyebrow: 'PHÂN BIỆT SẢN PHẨM',
  h2: 'Zendesk Integration nằm ở đâu trong hệ sản phẩm Gcalls?',
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
      product: 'Zendesk Integration',
      need: 'Workflow riêng cho đội Support đã sử dụng Zendesk để quản lý ticket.',
      path: ROUTES.zendesk,
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
 * No partner status, Zendesk certification, marketplace listing, customer count,
 * productivity percentage or SLA. None is evidenced.
 */
export const ZD_TRUST = {
  eyebrow: 'PHẠM VI TRIỂN KHAI',
  h2: 'Tích hợp Zendesk cần bắt đầu từ ticket structure, permission và workflow thực tế',
  description:
    'Field, ticket form, permission, user role và support workflow có thể khác nhau giữa từng tài khoản Zendesk. Phạm vi tích hợp cần được xác định qua khảo sát và kiểm thử thay vì áp dụng cùng một cấu hình cho mọi doanh nghiệp.',
  cta: { label: 'Trao đổi về workflow Zendesk hiện tại' },
  links: [
    { label: 'Ước tính cấu hình & chi phí', path: ZD_ESTIMATOR_HREF },
    { label: 'Xem bảng giá Gcalls', path: ROUTES.pricing },
  ],
} as const

/* ── 17 · FAQ (§24) ─────────────────────────────────────────────── */

export interface ZdFaqItem {
  q: string
  a: string
  link?: { label: string; path: string }
}

/**
 * FAQ — the seven approved questions.
 *
 * FAQ 2 uses the §24 "IF NOT VERIFIED" wording verbatim (gate A WITHHELD).
 * FAQ 3 uses the §24 "IF NOT VERIFIED" wording verbatim (gate C CONTEXT ONLY —
 *   no exact Zendesk field is evidenced).
 * FAQ 4 uses the §24 "IF NOT VERIFIED" wording verbatim (gates E, F WITHHELD).
 *   Never rewrite it to assert automatic creation.
 * FAQ 5 is the approved answer, which already carries the gate H split.
 * FAQ 6 uses the §24 "IF NOT VERIFIED" wording verbatim, which is exactly the
 *   gate I split — recording in Gcalls affirmed conditionally, sync to Zendesk
 *   requiring separate verification. Do not merge the halves.
 */
export const ZD_FAQ: ZdFaqItem[] = [
  {
    q: 'Tổng đài tích hợp Zendesk là gì?',
    a: 'Đây là mô hình kết nối hoạt động nghe gọi của Gcalls với Zendesk để đội Support có thể sử dụng customer context, ticket liên quan và dữ liệu tương tác phù hợp trong cùng workflow CSKH.',
  },
  {
    q: 'Gcalls có hỗ trợ Click-to-Call trên Zendesk không?',
    a: 'Khả năng thực hiện cuộc gọi từ Zendesk phụ thuộc vào phương thức tích hợp và cấu hình triển khai hiện tại. Gcalls sẽ xác định capability phù hợp trong quá trình khảo sát.',
  },
  {
    q: 'Khi khách hàng gọi đến có thể xem ticket liên quan không?',
    a: 'Khả năng hiển thị ticket và customer context phụ thuộc vào dữ liệu, permission và cấu hình tích hợp. Phạm vi thông tin cần được xác định trong bước khảo sát kỹ thuật.',
  },
  {
    q: 'Gcalls có tự động tạo ticket sau cuộc gọi không?',
    a: 'Khả năng tạo hoặc cập nhật ticket phụ thuộc vào workflow và cấu hình tích hợp hiện tại. Gcalls cần khảo sát hệ thống trước khi xác nhận luồng có thể triển khai.',
  },
  {
    q: 'Lịch sử cuộc gọi có được lưu trong Zendesk không?',
    a: 'Dữ liệu cuộc gọi có thể được lưu trong Gcalls hoặc được liên kết với Zendesk theo phạm vi tích hợp. Cần xác định rõ trường dữ liệu và nơi lưu trong quá trình khảo sát.',
  },
  {
    q: 'Ghi âm có được đồng bộ vào Zendesk không?',
    a: 'Ghi âm có thể được lưu trong hệ thống Gcalls khi cấu hình dịch vụ hỗ trợ. Việc đồng bộ hoặc liên kết bản ghi với Zendesk cần được xác minh riêng theo phạm vi triển khai.',
  },
  {
    q: 'Zendesk Integration khác Gcalls CX như thế nào?',
    a: 'Zendesk Integration tập trung kết nối hoạt động thoại với ticket và support workflow hiện có. Gcalls CX giải quyết bài toán rộng hơn về quản lý giao tiếp đa kênh trên một Contact Center tập trung.',
    link: { label: 'Gcalls CX', path: ROUTES.gcallsCx },
  },
]

/* ── 18 · Final CTA (§25) ───────────────────────────────────────── */

export const ZD_FINAL_CTA = {
  eyebrow: 'GCALLS × ZENDESK',
  h2: 'Xem hoạt động nghe gọi vận hành trong workflow Zendesk của đội Support',
  description:
    'Chia sẻ cấu trúc ticket, user và quy trình CSKH hiện tại để Gcalls xác định phạm vi tích hợp và demo phù hợp.',
  primaryCta: { label: 'Xem demo tích hợp Zendesk' },
  secondaryCta: { label: 'Tư vấn tích hợp' },
} as const

/* ── 19 · Onward internal links (§27) ───────────────────────────── */

/**
 * Contextual, not a link dump (§27).
 *
 * The generic Helpdesk page, the integration hub, Freshdesk, Gcalls Plus, Gcalls
 * CX, QA QC Center, the estimator and pricing are all linked from their own
 * dedicated sections above, so they are not repeated here.
 *
 * The two industry links are earned rather than dumped: BPO / support centre is a
 * §3 persona, and SaaS Support plus Enterprise Customer Service are §17 use cases
 * that map onto the e-commerce and BPO service pages.
 */
export const ZD_LINKS = {
  h2: 'Xem thêm',
  items: [
    { label: 'Tổng đài cho BPO', path: ROUTES.bpo },
    { label: 'Tổng đài cho Thương mại điện tử', path: ROUTES.ecommerce },
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
 * the four published capabilities, so the structured data cannot assert more than
 * the visible page — in particular it does not mention Click-to-Call, an embedded
 * call box, ticket creation, status/tag writes or recording synchronisation.
 */
export function buildZendeskJsonLd(origin: string) {
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
            name: 'Zendesk',
            item: `${origin}${ROUTES.zendesk}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: 'Tổng đài tích hợp Zendesk',
        serviceType: 'Zendesk Telephony Integration',
        description: ZD_DIRECT_ANSWER.answer,
        provider: { '@type': 'Organization', name: 'Gcalls' },
        url: `${origin}${ROUTES.zendesk}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Gcalls for Zendesk',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Helpdesk Telephony Integration',
        operatingSystem: 'Web browser',
        description: ZD_OVERVIEW.description,
        url: `${origin}${ROUTES.zendesk}`,
        featureList: ZD_CAPABILITIES.items.map((c) => c.title),
        provider: { '@type': 'Organization', name: 'Gcalls' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: ZD_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
