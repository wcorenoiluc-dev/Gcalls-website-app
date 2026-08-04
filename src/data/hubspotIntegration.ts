/**
 * Approved content for /tich-hop/hubspot/ — Checkpoint INT-01.
 *
 * ---------------------------------------------------------------------------
 * COPY IS LOCKED.
 * ---------------------------------------------------------------------------
 * Every string below comes from the approved INT-01 source. Do not rewrite,
 * shorten, paraphrase or "improve" it, and do not add capabilities, HubSpot
 * features, synced fields, plans or benefits that are not here.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING (INT-01 §25)
 * ---------------------------------------------------------------------------
 * Never publish without explicit current evidence:
 *   "tăng 25–30% hiệu suất" · "tăng 30–50% hiệu suất" · "đồng bộ 100%" ·
 *   "zero manual work" / "xóa bỏ hoàn toàn nhập liệu thủ công" ·
 *   "cài đặt trong vài phút" / "kích hoạt tức thì" / any fixed setup duration ·
 *   "đối tác chính thức của HubSpot" · "được HubSpot chứng nhận" ·
 *   "hỗ trợ mọi gói HubSpot" · "đồng bộ toàn bộ trường dữ liệu" ·
 *   "real-time guaranteed" · any marketplace-listing or certification wording.
 *
 * Required register instead: "giảm thao tác", "hỗ trợ", "có thể", "theo cấu
 * hình", "khi tích hợp được cấu hình", "theo phạm vi tích hợp", "tùy workflow".
 *
 * The historical Gcalls HubSpot marketing page is NOT a source of copy. It was
 * read only as product-capability evidence; nothing was copied wholesale, and
 * every numeric claim it carried is withheld above.
 *
 * ---------------------------------------------------------------------------
 * EVIDENCE BASE
 * ---------------------------------------------------------------------------
 * HubSpot evidence in this repository:
 *
 *  - `src/data/estimator.ts`, solution `crm`: a `crmPlatform` select naming
 *    HubSpot, Salesforce, Zoho CRM and "Khác", and a `crmNeeds` multi-select
 *    enumerating EXACTLY FOUR integration needs — Click-to-Call, Customer
 *    context, Call history, Workflow integration.
 *  - `src/data/crmIntegration.ts` (S01, approved): three verified CRM
 *    capabilities — Click-to-Call, Customer Popup, Interaction History Sync —
 *    each already worded conditionally, plus HubSpot named as a routed
 *    platform with connection scope only.
 *  - `src/components/product-ui`: the approved Gcalls-side call box /
 *    customer-popup and call-activity surfaces used on Home and S01.
 *
 * The four capabilities published below map 1:1 onto that evidence. Nothing
 * beyond it is claimed.
 *
 * ---------------------------------------------------------------------------
 * EVIDENCE GATES — BOTH CLOSED NEGATIVE (do not reverse without evidence)
 * ---------------------------------------------------------------------------
 * CLICK-TO-SMS (§12) — WITHHELD. The brief notes that Gcalls product/support
 * material documents Click-to-SMS inside the HubSpot integration. That material
 * is not present in this repository and could not be verified here. The only
 * SMS evidence anywhere in this project belongs to a DIFFERENT product —
 * Gcalls CX, where SMS is one of five omnichannel conversation channels
 * (`src/data/gcallsCx.ts`, estimator field `channels`). Inheriting a Gcalls CX
 * channel into a CRM integration page is precisely the cross-product
 * inheritance S03 §12/§13 forbade for POS. Decisively: the approved `crmNeeds`
 * field enumerates four needs and SMS is not one of them. Not published.
 *
 * TICKET CREATION (§13) — WITHHELD. No HubSpot ticket evidence exists in this
 * repository. The closely analogous gate was already resolved NEGATIVE at S02
 * for Helpdesk, on STRONGER evidence: there, the estimator literally offers
 * "Gắn cuộc gọi vào ticket", and S02 §11 still judged that to be LINKING to an
 * existing ticket, never CREATION. Here the `crmNeeds` field offers no ticket
 * option at all. Additionally, ticket/support workflow is owned by
 * /tong-dai-tich-hop-helpdesk/ under the standing boundary rules. FAQ 5
 * therefore uses the conservative conditional wording, and no ticket capability
 * card is rendered.
 *
 * PARTNERSHIP / CERTIFICATION — NOT PUBLISHED. No partner status, marketplace
 * listing or certification evidence exists anywhere in this repository. Naming
 * HubSpot asserts CONNECTION EXPERIENCE ONLY, exactly as S01 established.
 *
 * PLAN COVERAGE — NOT PUBLISHED. Nothing evidences which HubSpot tiers or
 * subscriptions support the integration, so no plan is named and no
 * "every plan" claim appears.
 *
 * ---------------------------------------------------------------------------
 * SEO OWNERSHIP
 * ---------------------------------------------------------------------------
 * This page owns HubSpot-specific commercial intent: "tổng đài tích hợp
 * HubSpot", "Gcalls HubSpot", "click to call HubSpot", "gọi điện trên HubSpot",
 * "đồng bộ cuộc gọi HubSpot", "customer popup HubSpot".
 *
 * Generic CRM intent ("tổng đài tích hợp CRM") belongs to
 * /tong-dai-tich-hop-crm/ and is NOT competed for here — §19's routing block
 * exists to hand that visitor over rather than keep them. Salesforce and Zoho
 * intent belongs to their own pages; they appear once, as routed links, never
 * as comparison claims.
 *
 * ---------------------------------------------------------------------------
 * BOUNDARIES
 * ---------------------------------------------------------------------------
 * This page owns the HubSpot workflow. Generic CRM evaluation belongs to CRM
 * Integration, ticket/support workflow to Helpdesk Integration, multi-channel
 * conversations to Gcalls CX, and the calling layer itself to Gcalls Plus.
 * This page does not introduce, teach or review HubSpot.
 */

import { ROUTES } from '@/config/navigation'

/**
 * Conversion context for HubSpot Integration CTAs.
 *
 * NO HubSpot-specific `LeadSource` exists in the shared model
 * (`src/lib/leads/types.ts`), and INT-01 §7 forbids inventing incompatible
 * strings — so the closest existing typed member, `crm_integration`, is used.
 *
 * The platform itself is carried in `product`, which is the only typed slot
 * that survives normalisation to the server. `solution` stays at the approved
 * `LEAD_NEEDS` value so the form's "Nhu cầu" select still pre-selects; the
 * shared form resolves `product`, then falls back to `solution`.
 *
 * Two contexts because §23 asks for two different intents on the final band.
 */
export const HUBSPOT_DEMO_LEAD = {
  intent: 'demo',
  source: 'crm_integration',
  product: 'HubSpot',
  solution: 'Tích hợp CRM',
} as const

export const HUBSPOT_CONSULT_LEAD = {
  intent: 'consultation',
  source: 'crm_integration',
  product: 'HubSpot',
  solution: 'Tích hợp CRM',
} as const

/* ── 01 · Hero ──────────────────────────────────────────────────── */

export const HS_HERO = {
  eyebrow: 'GCALLS × HUBSPOT',
  h1: 'Tổng đài Gcalls tích hợp HubSpot – đưa cuộc gọi vào quy trình CRM',
  description:
    'Kết nối chức năng nghe gọi của Gcalls với HubSpot để đội Sales và CSKH có thể thực hiện cuộc gọi, nhận biết customer context và theo dõi hoạt động tương tác mà không phải tách quy trình làm việc thành nhiều hệ thống rời rạc.',
  valuePoints: [
    {
      title: 'Gọi trực tiếp từ HubSpot',
      detail:
        'Click-to-Call giúp nhân viên bắt đầu cuộc gọi từ số điện thoại hoặc hồ sơ khách hàng trong CRM khi tích hợp được cấu hình.',
    },
    {
      title: 'Nhận biết khách hàng khi có cuộc gọi',
      detail:
        'Thông tin liên quan từ HubSpot giúp nhân viên có thêm context trước khi tiếp tục cuộc hội thoại.',
    },
    {
      title: 'Giữ hoạt động cuộc gọi gần CRM',
      detail:
        'Dữ liệu tương tác phù hợp có thể được ghi nhận trong workflow HubSpot để đội ngũ tiếp tục follow-up thuận tiện hơn.',
    },
  ],
  primaryCta: { label: 'Xem demo tích hợp HubSpot' },
  secondaryCta: { label: 'Xem cách hoạt động', href: '#workflow-hubspot' },
} as const

/* ── 02 · Direct answer / AIO ───────────────────────────────────── */

/** Plain rendered HTML. Never hidden in tabs or an accordion. */
export const HS_DIRECT_ANSWER = {
  question: 'Tổng đài tích hợp HubSpot là gì?',
  answer:
    'Tổng đài tích hợp HubSpot kết nối chức năng nghe gọi của Gcalls với quy trình CRM HubSpot để nhân viên có thể thực hiện cuộc gọi từ CRM, nhận biết khách hàng khi có cuộc gọi và ghi nhận dữ liệu tương tác phù hợp vào workflow đang sử dụng. Phạm vi chức năng phụ thuộc vào cấu hình Gcalls, HubSpot và yêu cầu triển khai của doanh nghiệp.',
} as const

/* ── 03 · Business problems ─────────────────────────────────────── */

export const HS_PROBLEMS = {
  eyebrow: 'BÀI TOÁN',
  h2: 'HubSpot quản lý khách hàng, nhưng cuộc gọi vẫn có thể nằm ngoài workflow',
  items: [
    {
      n: '01',
      title: 'Phải copy số điện thoại để gọi',
      detail:
        'Nhân viên tìm contact trong HubSpot nhưng lại thực hiện cuộc gọi trên một công cụ khác, tạo thêm thao tác trong mỗi lần follow-up.',
    },
    {
      n: '02',
      title: 'Không biết ngay ai đang gọi',
      detail:
        'Khi cuộc gọi đến không gắn với customer context, agent cần tìm lại hồ sơ trước khi hiểu lịch sử khách hàng.',
    },
    {
      n: '03',
      title: 'Call activity bị tách khỏi CRM',
      detail:
        'Nếu hoạt động gọi không được ghi nhận cùng customer record, Sales và CSKH khó nhìn lại toàn bộ quá trình tương tác.',
    },
    {
      n: '04',
      title: 'Follow-up dễ trở thành quy trình thủ công',
      detail:
        'Nhân viên phải tự ghi chú hoặc cập nhật lại HubSpot sau cuộc gọi nếu hai hệ thống chưa được kết nối phù hợp.',
    },
  ],
} as const

/* ── 04 · Overview ──────────────────────────────────────────────── */

export const HS_OVERVIEW = {
  eyebrow: 'GCALLS FOR HUBSPOT',
  h2: 'Đưa lớp giao tiếp thoại vào nơi đội ngũ đang quản lý khách hàng',
  description:
    'Gcalls không thay thế HubSpot. Giải pháp bổ sung lớp giao tiếp thoại để cuộc gọi trở thành một phần gần hơn với customer record và workflow Sales/Customer Service hiện tại.',
  flow: [
    {
      n: '01',
      label: 'HubSpot Contact',
      detail: 'Nhân viên làm việc trên dữ liệu khách hàng đang quản lý.',
    },
    {
      n: '02',
      label: 'Click-to-Call',
      detail: 'Cuộc gọi bắt đầu từ hồ sơ khi tích hợp được cấu hình.',
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
      label: 'Call activity',
      detail: 'Dữ liệu tương tác phù hợp được ghi nhận.',
    },
    {
      n: '06',
      label: 'Follow-up in HubSpot',
      detail: 'Đội ngũ tiếp tục workflow trong CRM.',
    },
  ],
} as const

/* ── 05 · Verified core capabilities ────────────────────────────── */

/**
 * Exactly four — each mapped to the evidence base in the file header.
 *
 * Click-to-SMS and Ticket creation are deliberately ABSENT; see the evidence
 * gates. Every description defers to configuration, so no capability reads as
 * guaranteed on every HubSpot account.
 */
export const HS_CAPABILITIES = {
  eyebrow: 'TÍNH NĂNG TÍCH HỢP',
  h2: 'Những năng lực giúp kết nối cuộc gọi với workflow HubSpot',
  items: [
    {
      n: '01',
      title: 'Click-to-Call',
      detail:
        'Cho phép bắt đầu cuộc gọi từ số điện thoại hoặc contact trong HubSpot khi extension/integration được cấu hình.',
    },
    {
      n: '02',
      title: 'Incoming Call Notification',
      detail:
        'Khi có cuộc gọi đến, Gcalls có thể cung cấp call box để nhân viên tiếp nhận cuộc gọi trong môi trường làm việc tích hợp.',
    },
    {
      n: '03',
      title: 'Customer Context',
      detail:
        'Thông tin liên quan giúp nhân viên nhận biết khách hàng và truy cập customer record trước hoặc trong quá trình trao đổi.',
    },
    {
      n: '04',
      title: 'Call Activity / History',
      detail:
        'Thông tin cuộc gọi phù hợp có thể được ghi nhận để đội ngũ tiếp tục theo dõi quá trình tương tác.',
    },
  ],
} as const

/* ── 06 · Workflow ──────────────────────────────────────────────── */

export const HS_WORKFLOW = {
  anchorId: 'workflow-hubspot',
  eyebrow: 'QUY TRÌNH',
  h2: 'Từ HubSpot contact đến cuộc gọi và follow-up',
  steps: [
    {
      n: '01',
      title: 'Mở contact hoặc customer record',
      detail:
        'Nhân viên tiếp tục làm việc trên dữ liệu đang được quản lý trong HubSpot.',
    },
    {
      n: '02',
      title: 'Bắt đầu hoặc tiếp nhận cuộc gọi',
      detail:
        'Click-to-Call hoặc call box hỗ trợ hoạt động thoại theo cấu hình tích hợp.',
    },
    {
      n: '03',
      title: 'Xem customer context',
      detail:
        'Thông tin liên quan giúp agent hiểu người đang trao đổi và lịch sử trước đó.',
    },
    {
      n: '04',
      title: 'Thực hiện cuộc hội thoại',
      detail: 'Gcalls xử lý lớp giao tiếp thoại trong workflow được triển khai.',
    },
    {
      n: '05',
      title: 'Ghi nhận hoạt động phù hợp',
      detail:
        'Call activity và dữ liệu liên quan có thể được ghi nhận theo phạm vi tích hợp.',
    },
    {
      n: '06',
      title: 'Tiếp tục Sales / Service workflow',
      detail:
        'Nhân viên follow-up trong HubSpot thay vì duy trì một luồng dữ liệu riêng bên ngoài CRM.',
    },
  ],
} as const

/* ── 07 · Benefits ──────────────────────────────────────────────── */

/** Operational value only. No percentage appears anywhere (§15, §25). */
export const HS_BENEFITS = {
  eyebrow: 'GIÁ TRỊ VẬN HÀNH',
  h2: 'Giảm những điểm chuyển đổi không cần thiết trong quy trình HubSpot',
  items: [
    {
      n: '01',
      title: 'Giảm thao tác copy số',
      detail:
        'Click-to-Call giúp đưa thao tác gọi gần hơn với customer record đang được xử lý.',
    },
    {
      n: '02',
      title: 'Có context trước cuộc hội thoại',
      detail:
        'Thông tin khách hàng giúp agent chuẩn bị tốt hơn trước khi tư vấn hoặc hỗ trợ.',
    },
    {
      n: '03',
      title: 'Theo dõi tương tác tập trung hơn',
      detail:
        'Call activity phù hợp được đặt gần workflow CRM để đội ngũ dễ tiếp tục follow-up.',
    },
    {
      n: '04',
      title: 'Giảm dữ liệu bị phân mảnh',
      detail:
        'Kết nối hai hệ thống giúp hạn chế việc duy trì lịch sử khách hàng ở những luồng tách rời.',
    },
  ],
} as const

/* ── 08 · Use cases ─────────────────────────────────────────────── */

/** No conversion percentage, no result claim (§16). */
export const HS_USE_CASES = {
  eyebrow: 'TÌNH HUỐNG SỬ DỤNG',
  h2: 'Gcalls × HubSpot phù hợp với những workflow nào?',
  items: [
    {
      role: 'Inbound Sales',
      flow: 'Sales nhận lead trong HubSpot, thực hiện cuộc gọi và tiếp tục follow-up từ customer context hiện có.',
    },
    {
      role: 'Lead Follow-up',
      flow: 'Nhân viên làm việc với danh sách lead/contact và gọi theo quy trình thay vì duy trì danh sách số điện thoại riêng.',
    },
    {
      role: 'Customer Service',
      flow: 'Agent sử dụng customer record và lịch sử liên quan để có thêm bối cảnh khi khách hàng gọi đến.',
    },
    {
      role: 'Customer Success',
      flow: 'Đội CS có thể giữ hoạt động gọi gần hơn với dữ liệu vòng đời khách hàng đang quản lý trên HubSpot.',
    },
  ],
} as const

/* ── 09 · Setup ─────────────────────────────────────────────────── */

/**
 * Setup process.
 *
 * §17 applies twice over: no duration is attached to any step or in total, and
 * no historical instruction involving deprecated credentials is reproduced.
 * Step 4 deliberately says "phương thức kết nối hiện hành" rather than naming
 * any specific key or token type, because nothing in this repository evidences
 * which mechanism is current.
 */
export const HS_SETUP = {
  eyebrow: 'THIẾT LẬP',
  h2: 'Tích hợp theo cấu hình HubSpot và workflow doanh nghiệp đang sử dụng',
  steps: [
    { n: '01', title: 'Khảo sát workflow HubSpot hiện tại' },
    { n: '02', title: 'Xác định user và hotline' },
    { n: '03', title: 'Xác định capability cần sử dụng' },
    { n: '04', title: 'Kiểm tra quyền truy cập và phương thức kết nối hiện hành' },
    { n: '05', title: 'Cấu hình integration / extension cần thiết' },
    { n: '06', title: 'Kiểm thử Click-to-Call, incoming call và dữ liệu' },
    { n: '07', title: 'Hướng dẫn người dùng' },
    { n: '08', title: 'Go-live' },
  ],
  note: 'Phạm vi và thời gian triển khai phụ thuộc vào hotline, số lượng người dùng, quyền truy cập và capability cần sử dụng, nên được xác định sau bước khảo sát thay vì theo một mốc cố định.',
} as const

/* ── 10 · UI preview ────────────────────────────────────────────── */

export const HS_UI_PREVIEW = {
  eyebrow: 'GIAO DIỆN TÍCH HỢP',
  h2: 'Giữ customer context gần cuộc gọi',
  description:
    'Các giao diện dưới đây là bề mặt phía Gcalls trong luồng tích hợp: thao tác gọi từ hồ sơ khách hàng, call box khi có cuộc gọi đến và hoạt động tương tác được ghi nhận.',
  note: 'Giao diện minh họa phía Gcalls với dữ liệu mẫu. Đây không phải ảnh chụp màn hình HubSpot, và bố cục thực tế phụ thuộc vào cấu hình tích hợp của doanh nghiệp.',
} as const

/* ── 11 · HubSpot vs generic CRM page ───────────────────────────── */

export const HS_VS_CRM = {
  eyebrow: 'HUBSPOT-SPECIFIC WORKFLOW',
  h2: 'Trang này dành cho doanh nghiệp đã chọn HubSpot làm CRM',
  description:
    'Nếu doanh nghiệp đang đánh giá cách tích hợp tổng đài với CRM nói chung, hãy xem giải pháp Tổng đài tích hợp CRM. Trang này tập trung vào workflow khi HubSpot đã là hệ thống quản lý khách hàng hiện tại.',
  cta: { label: 'Xem giải pháp Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
} as const

/* ── 12 · Related integrations ──────────────────────────────────── */

/** Routing only. No vendor comparison claim of any kind (§20). */
export const HS_RELATED = {
  h2: 'Doanh nghiệp đang sử dụng CRM khác?',
  description:
    'Mỗi nền tảng CRM có cấu trúc dữ liệu và cách kết nối riêng. Xem trang tương ứng với hệ thống doanh nghiệp đang sử dụng.',
  items: [
    {
      name: 'Salesforce',
      detail: 'Kết nối hoạt động nghe gọi với workflow Salesforce.',
      path: ROUTES.salesforce,
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

/* ── 13 · Trust ─────────────────────────────────────────────────── */

/**
 * Trust — NEUTRAL (§21).
 *
 * No partner status, certification, marketplace listing, customer count or
 * percentage improvement. None is evidenced, and §21 requires reporting before
 * publishing even if evidence were found.
 */
export const HS_TRUST = {
  eyebrow: 'PHẠM VI TRIỂN KHAI',
  h2: 'Tích hợp cần bắt đầu từ workflow và dữ liệu doanh nghiệp đang sử dụng',
  description:
    'Permission, cấu trúc dữ liệu, user, hotline và yêu cầu đồng bộ có thể khác nhau giữa từng tài khoản HubSpot. Vì vậy phạm vi triển khai cần được xác định trong bước khảo sát và kiểm thử.',
  cta: { label: 'Trao đổi về workflow HubSpot hiện tại' },
  links: [
    { label: 'Ước tính cấu hình & chi phí', path: `${ROUTES.costEstimator}?product=crm-integration` },
    { label: 'Xem bảng giá Gcalls', path: ROUTES.pricing },
  ],
} as const

/* ── 14 · FAQ ───────────────────────────────────────────────────── */

export interface HsFaqItem {
  q: string
  a: string
  link?: { label: string; path: string }
}

/**
 * FAQ — the seven approved questions.
 *
 * FAQ 5 uses the CONSERVATIVE wording because the ticket-creation gate is
 * closed negative; it must not be rewritten to assert ticket creation without
 * evidence. FAQ 7 answers the duration question by scope, never by a number.
 */
export const HS_FAQ: HsFaqItem[] = [
  {
    q: 'Tổng đài tích hợp HubSpot là gì?',
    a: 'Đây là mô hình kết nối chức năng nghe gọi của Gcalls với workflow HubSpot để nhân viên có thể thực hiện cuộc gọi, nhận biết customer context và ghi nhận dữ liệu tương tác phù hợp trong quy trình CRM.',
  },
  {
    q: 'Gcalls có hỗ trợ Click-to-Call trên HubSpot không?',
    a: 'Có. Trong cấu hình tích hợp phù hợp, nhân viên có thể bắt đầu cuộc gọi từ số điện thoại hoặc customer record trên HubSpot thông qua lớp tích hợp Gcalls.',
  },
  {
    q: 'Khi khách hàng gọi đến có thể xem thông tin HubSpot không?',
    a: 'Gcalls có thể hỗ trợ hiển thị thông tin liên quan để nhân viên nhận biết khách hàng và truy cập customer record khi cấu hình tích hợp phù hợp.',
  },
  {
    q: 'Dữ liệu cuộc gọi có được lưu lại không?',
    a: 'Thông tin cuộc gọi phù hợp có thể được ghi nhận hoặc liên kết theo phạm vi tích hợp để đội ngũ tiếp tục theo dõi lịch sử tương tác.',
  },
  {
    q: 'Gcalls có thể tạo Ticket trên HubSpot không?',
    a: 'Khả năng tạo hoặc cập nhật Ticket phụ thuộc vào workflow và cấu hình tích hợp hiện tại. Gcalls sẽ xác định luồng phù hợp trong quá trình khảo sát hệ thống.',
    link: {
      label: 'Tổng đài tích hợp Helpdesk',
      path: ROUTES.helpdeskIntegration,
    },
  },
  {
    q: 'Gcalls tích hợp HubSpot có thay thế HubSpot không?',
    a: 'Không. HubSpot tiếp tục là hệ thống CRM của doanh nghiệp; Gcalls bổ sung lớp giao tiếp thoại và dữ liệu tương tác vào workflow đang sử dụng.',
  },
  {
    q: 'Tích hợp HubSpot mất bao lâu?',
    a: 'Thời gian phụ thuộc vào hotline, số lượng người dùng, quyền truy cập, capability cần triển khai và yêu cầu kiểm thử. Gcalls sẽ xác định phạm vi sau khi khảo sát hệ thống.',
  },
]

/* ── 15 · Final CTA ─────────────────────────────────────────────── */

export const HS_FINAL_CTA = {
  eyebrow: 'GCALLS × HUBSPOT',
  h2: 'Xem hoạt động nghe gọi vận hành ngay trong workflow HubSpot của doanh nghiệp bạn',
  description:
    'Chia sẻ cách đội Sales/CSKH đang sử dụng HubSpot để Gcalls tư vấn phạm vi tích hợp và demo workflow phù hợp.',
  primaryCta: { label: 'Xem demo tích hợp HubSpot' },
  secondaryCta: { label: 'Tư vấn tích hợp' },
} as const

/* ── 16 · Onward internal links ─────────────────────────────────── */

/**
 * Contextual, not an SEO link dump (§24).
 *
 * The CRM solution page, the integration hub, Salesforce and Zoho are already
 * linked from their own dedicated sections above, so they are not repeated
 * here — this row carries the remaining destinations only.
 */
export const HS_LINKS = {
  h2: 'Xem thêm',
  items: [
    { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
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
 * Four nodes — BreadcrumbList, Service, SoftwareApplication, FAQPage (§26).
 *
 * Deliberately emits NO Offer, price, AggregateRating, Review, performance
 * metric or partner/certification property. `featureList` carries exactly the
 * four verified capabilities, so the structured data cannot assert more than
 * the visible page does.
 */
export function buildHubspotJsonLd(origin: string) {
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
            name: 'HubSpot',
            item: `${origin}${ROUTES.hubspot}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: 'Tổng đài tích hợp HubSpot',
        serviceType: 'HubSpot Telephony Integration',
        description: HS_DIRECT_ANSWER.answer,
        provider: { '@type': 'Organization', name: 'Gcalls' },
        url: `${origin}${ROUTES.hubspot}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Gcalls for HubSpot',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'CRM Telephony Integration',
        operatingSystem: 'Web browser',
        description: HS_OVERVIEW.description,
        url: `${origin}${ROUTES.hubspot}`,
        featureList: HS_CAPABILITIES.items.map((c) => c.title),
        provider: { '@type': 'Organization', name: 'Gcalls' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: HS_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
