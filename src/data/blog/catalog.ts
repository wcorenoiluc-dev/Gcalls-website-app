/**
 * Batch 1 catalog — the LOCKED 18-article replacement slate approved by Asher
 * at Checkpoint GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING.
 *
 * Distribution is fixed at 3 / 2 / 3 / 2 / 3 / 2 / 3 across HUB-01, HUB-02,
 * HUB-03, HUB-06, HUB-07, HUB-08, HUB-09 — seven strategic hubs, eight pillars,
 * ten supporting articles, seven re-scoped legacy topics, eleven net-new.
 * `scripts/verify-blog-batch-01.mjs` fails the build if any of that drifts.
 *
 * WHAT IS DELIBERATELY ABSENT, and must never be added to Batch 1:
 * competitor reviews (HubSpot / Zoho / Salesforce / Zendesk / Getfly / Pancake
 * POS / Sapo POS), the angel-investor article, the referral-programme article
 * and the DIY call-recording tutorial. Those fifteen topics were the defect
 * this checkpoint corrects; they are re-homed in the editorial system, not
 * deleted — see `docs/content-review/blog/editorial-batch-plan.csv`.
 *
 * URL POLICY (locked at §D of the rebuild): the seven legacy rows KEEP their
 * published root URL even where the new title is a re-scope, because the URL
 * carries the accumulated history and the checkpoint forbids a redirect sweep.
 * The eleven net-new rows mint new root-level URLs in the same shape.
 *
 * Metadata lives HERE and nowhere else. Article body modules under `articles/`
 * carry prose, FAQ and image briefs only.
 */

import { SITE_ORIGIN } from '@/config/site'
import type { BlogArticleMeta, BlogHubId } from './types'

export const BLOG_AUTHOR = 'Đội ngũ Gcalls'

export const BLOG_HUB_LABELS: Record<BlogHubId, string> = {
  'HUB-01': 'Tổng đài và Call Center',
  'HUB-02': 'Gcalls Plus Webphone',
  'HUB-03': 'CRM, Helpdesk và tích hợp',
  'HUB-06': 'Gcalls CX',
  'HUB-07': 'QA/QC và quản trị chất lượng',
  'HUB-08': 'Voicebot, AI và tự động hóa',
  'HUB-09': 'Tổng đài quốc tế',
}

/** Batch 1 was authored in one pass; both dates are the authoring date. */
const AUTHORED_AT = '2026-08-15'

type CatalogSeed = Omit<
  BlogArticleMeta,
  'url' | 'canonical' | 'status' | 'author' | 'hubLabel' | 'createdAt' | 'updatedAt'
>

/**
 * Whether this build ships draft articles.
 *
 * Written as a direct `import.meta.env` expression rather than imported from
 * `visibility.ts` ON PURPOSE. Vite substitutes both flags at build time, so the
 * expression folds to a literal `false` in a normal production build, which
 * lets Rollup drop `DRAFT_SEEDS` entirely — titles, descriptions and excerpts
 * included. Imported through another module the fold is not guaranteed, and the
 * draft table would ship as inert data inside the main bundle.
 *
 * `visibility.ts` re-derives the same value for runtime checks; the two agree
 * by construction because both read the same two env flags.
 */
const SHIP_DRAFTS: boolean =
  import.meta.env.DEV || import.meta.env.VITE_BLOG_PREVIEW === 'true'

/**
 * PUBLISHING AN ARTICLE IS A TWO-PART EDIT, ON PURPOSE.
 *
 * Move its seed from `DRAFT_SEEDS` to `PUBLISHED_SEEDS` and add its body loader
 * to `PUBLISHED_BODY_LOADERS` in `./index.ts`. Both are reviewed edits to
 * version-controlled files, which is exactly the gate an unreviewed draft must
 * not be able to slip through. Nothing about `VITE_ALLOW_INDEXING` or any other
 * runtime flag can publish an article on its own.
 *
 * Batch 1 is entirely draft, so `PUBLISHED_SEEDS` is empty today.
 */
const PUBLISHED_SEEDS: readonly CatalogSeed[] = []

const DRAFT_SEEDS: readonly CatalogSeed[] = [
  /* ── HUB-01 Tổng đài và Call Center — 3 ─────────────────────────────── */
  {
    id: 'GC-B01-01',
    legacyPostId: 566,
    title: 'Dịch vụ Call Center là gì và doanh nghiệp nào thực sự cần',
    slug: '5-linh-vuc-rat-can-dich-vu-call-center-trung-tam-cuoc-goi',
    hub: 'HUB-01',
    cluster: 'Nền tảng call center',
    primaryKeyword: 'dịch vụ call center là gì',
    secondaryKeywords: [
      'trung tâm cuộc gọi',
      'call center cho doanh nghiệp',
      'tổng đài chăm sóc khách hàng',
    ],
    searchIntent: 'informational-definition',
    persona: 'Trưởng phòng vận hành / Call Center Manager',
    funnelStage: 'TOFU',
    contentTier: 'PILLAR',
    seoTitle: 'Dịch vụ Call Center là gì và doanh nghiệp nào thực sự cần',
    metaDescription:
      'Call Center là gì, khác gì một nhóm nhân viên dùng điện thoại cá nhân, và bốn dấu hiệu cho thấy doanh nghiệp đã đến lúc cần một hệ thống tổng đài thật sự.',
    featuredImage: null,
    featuredImageAlt:
      'Sơ đồ luồng cuộc gọi đến đi qua hàng đợi, nhóm tiếp nhận và bản ghi tương tác trong một trung tâm cuộc gọi',
    productCta: ['cloud-call-center', 'gcalls-plus'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '2000-3000',
    excerpt:
      'Định nghĩa call center theo góc nhìn vận hành, và cách nhận ra doanh nghiệp đã vượt qua ngưỡng dùng máy lẻ cá nhân.',
  },
  {
    id: 'GC-B01-02',
    legacyPostId: 2768,
    title: 'Call Center On-Premises và Cloud khác nhau ở đâu',
    slug: 'call-center-diem-khac-biet-giua-on-premises-va-cloud-call-center-phan-1',
    hub: 'HUB-01',
    cluster: 'Nền tảng call center',
    primaryKeyword: 'on-premises và cloud call center',
    secondaryKeywords: [
      'tổng đài đám mây',
      'tổng đài truyền thống',
      'chi phí đầu tư tổng đài',
    ],
    searchIntent: 'commercial-investigation',
    persona: 'IT Manager / Trưởng dự án hạ tầng',
    funnelStage: 'MOFU',
    contentTier: 'PILLAR',
    seoTitle: 'Call Center On-Premises và Cloud khác nhau ở đâu',
    metaDescription:
      'So sánh tổng đài đặt tại chỗ và tổng đài đám mây theo bảy tiêu chí vận hành thật: quyền kiểm soát, chi phí, thời gian thay đổi, tích hợp và rủi ro phụ thuộc.',
    featuredImage: null,
    featuredImageAlt:
      'Sơ đồ đối chiếu hai mô hình triển khai tổng đài: thiết bị đặt tại doanh nghiệp và dịch vụ vận hành trên hạ tầng nhà cung cấp',
    productCta: ['cloud-call-center', 'cost-estimator'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '2000-3000',
    excerpt:
      'Bảy tiêu chí để chọn giữa tổng đài đặt tại chỗ và tổng đài đám mây, gồm cả những chi phí không nằm trên báo giá.',
  },
  {
    id: 'GC-B01-03',
    legacyPostId: 647,
    title: 'Khi nào doanh nghiệp nên chuyển sang tổng đài ảo',
    slug: '4-ly-do-su-dung-tong-dai-ao-call-center-la-can-thiet-voi-mot-doanh-nghiep',
    hub: 'HUB-01',
    cluster: 'Thời điểm chuyển đổi',
    primaryKeyword: 'khi nào nên chuyển sang tổng đài ảo',
    secondaryKeywords: [
      'tổng đài ảo',
      'dấu hiệu cần đổi tổng đài',
      'chuyển đổi hệ thống nghe gọi',
    ],
    searchIntent: 'commercial-investigation',
    persona: 'Chủ doanh nghiệp / Giám đốc điều hành SME',
    funnelStage: 'MOFU',
    contentTier: 'SUPPORTING',
    seoTitle: 'Khi nào doanh nghiệp nên chuyển sang tổng đài ảo',
    metaDescription:
      'Sáu dấu hiệu cho thấy cách nghe gọi hiện tại đã hết dư địa, và ba tình huống nên hoãn việc chuyển đổi tổng đài ảo lại thay vì làm ngay.',
    featuredImage: null,
    featuredImageAlt:
      'Sơ đồ mốc quyết định chuyển đổi từ nghe gọi rời rạc sang tổng đài ảo theo quy mô đội ngũ',
    productCta: ['cloud-call-center', 'cost-estimator'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '1200-2000',
    excerpt:
      'Sáu dấu hiệu nên chuyển và ba tình huống nên hoãn — một khung quyết định thay cho danh sách lý do.',
  },

  /* ── HUB-02 Gcalls Plus Webphone — 2 ────────────────────────────────── */
  {
    id: 'GC-B01-04',
    legacyPostId: null,
    title: 'Tổng đài trên trình duyệt hoạt động thế nào trong một ngày làm việc',
    slug: 'tong-dai-tren-trinh-duyet-hoat-dong-the-nao',
    hub: 'HUB-02',
    cluster: 'Webphone và thao tác hằng ngày',
    primaryKeyword: 'tổng đài trên trình duyệt',
    secondaryKeywords: ['webphone là gì', 'gọi điện trên trình duyệt', 'ghi chú sau cuộc gọi'],
    searchIntent: 'informational-howto',
    persona: 'Trưởng nhóm Sales có đội gọi ra',
    funnelStage: 'MOFU',
    contentTier: 'PILLAR',
    seoTitle: 'Tổng đài trên trình duyệt hoạt động thế nào trong một ngày',
    metaDescription:
      'Một ngày làm việc của nhân viên dùng webphone, từ ca sáng tới bàn giao cuối ngày, và những thao tác quyết định chất lượng dữ liệu cuộc gọi.',
    featuredImage: null,
    featuredImageAlt:
      'Ảnh chụp giao diện webphone Gcalls Plus với vùng quay số, danh bạ và ô ghi chú sau cuộc gọi, đã che dữ liệu khách hàng',
    productCta: ['gcalls-plus', 'consult'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '2000-3000',
    excerpt:
      'Webphone nhìn từ thao tác thật: nhận ca, gọi ra, ghi nhận, chuyển tiếp và bàn giao cuối ngày.',
  },
  {
    id: 'GC-B01-05',
    legacyPostId: 1368,
    title: 'Gọi ra theo danh sách: cách tổ chức và những giới hạn cần biết',
    slug: 'phan-mem-goi-tu-dong-va-loi-ich-doi-voi-chien-luoc-ban-hang',
    hub: 'HUB-02',
    cluster: 'Chiến dịch gọi ra',
    primaryKeyword: 'gọi ra theo danh sách',
    secondaryKeywords: ['danh sách gọi ra', 'phân bổ lead cho đội gọi', 'chiến dịch gọi ra'],
    searchIntent: 'informational-howto',
    persona: 'Trưởng nhóm Telesales',
    funnelStage: 'MOFU',
    contentTier: 'SUPPORTING',
    seoTitle: 'Gọi ra theo danh sách: cách tổ chức và giới hạn cần biết',
    metaDescription:
      'Cách chuẩn bị, phân bổ và kiểm soát một danh sách gọi ra, cùng bốn giới hạn kỹ thuật và pháp lý mà đội ngũ thường phát hiện quá muộn.',
    featuredImage: null,
    featuredImageAlt:
      'Ảnh chụp màn hình danh sách gọi ra trong Gcalls Plus với trạng thái từng liên hệ, đã che tên và số điện thoại khách hàng',
    productCta: ['gcalls-plus', 'consult'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '1200-2000',
    excerpt:
      'Quy trình sáu bước cho một danh sách gọi ra, và bốn giới hạn phải biết trước khi bấm nút bắt đầu.',
  },

  /* ── HUB-03 CRM, Helpdesk và tích hợp — 3 ───────────────────────────── */
  {
    id: 'GC-B01-06',
    legacyPostId: null,
    title: 'Checklist đánh giá mức độ sẵn sàng tích hợp tổng đài với CRM',
    slug: 'checklist-danh-gia-san-sang-tich-hop-tong-dai-voi-crm',
    hub: 'HUB-03',
    cluster: 'Tích hợp CRM',
    primaryKeyword: 'tích hợp tổng đài với CRM',
    secondaryKeywords: [
      'checklist tích hợp CRM',
      'chuẩn bị dữ liệu trước khi tích hợp',
      'API của CRM',
    ],
    searchIntent: 'commercial-investigation',
    persona: 'IT Manager / Trưởng dự án tích hợp',
    funnelStage: 'BOFU',
    contentTier: 'PILLAR',
    seoTitle: 'Checklist đánh giá sẵn sàng tích hợp tổng đài với CRM',
    metaDescription:
      'Năm nhóm câu hỏi cần trả lời trước khi kết nối tổng đài với CRM: quyền truy cập, chất lượng dữ liệu, quy tắc trùng lặp, phạm vi API và người chịu trách nhiệm.',
    featuredImage: null,
    featuredImageAlt:
      'Sơ đồ năm nhóm kiểm tra trước khi tích hợp tổng đài với CRM, từ quyền truy cập tới nghiệm thu',
    productCta: ['crm-integration', 'consult'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '2000-3000',
    excerpt:
      'Năm nhóm kiểm tra và một bảng chấm điểm để biết dự án tích hợp CRM đã sẵn sàng khởi động hay chưa.',
  },
  {
    id: 'GC-B01-07',
    legacyPostId: 15743,
    title: 'Đồng bộ dữ liệu giữa tổng đài và CRM: phạm vi và giới hạn',
    slug: 'dong-bo-hoa-du-lieu-la-gi-tai-sao-nen-dong-bo-du-lieu',
    hub: 'HUB-03',
    cluster: 'Tích hợp CRM',
    primaryKeyword: 'đồng bộ dữ liệu tổng đài và CRM',
    secondaryKeywords: ['đồng bộ một chiều', 'đồng bộ hai chiều', 'lịch sử cuộc gọi trong CRM'],
    searchIntent: 'informational-definition',
    persona: 'IT Manager / Trưởng dự án tích hợp',
    funnelStage: 'MOFU',
    contentTier: 'SUPPORTING',
    seoTitle: 'Đồng bộ dữ liệu giữa tổng đài và CRM: phạm vi và giới hạn',
    metaDescription:
      'Đồng bộ dữ liệu tổng đài và CRM thực sự chuyển những trường nào, khác gì đồng bộ hai chiều, và vì sao phạm vi luôn phụ thuộc API của nền tảng.',
    featuredImage: null,
    featuredImageAlt:
      'Sơ đồ chiều dữ liệu giữa hệ thống tổng đài và CRM, phân biệt trường đồng bộ một chiều và hai chiều',
    productCta: ['crm-integration'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '1200-2000',
    excerpt:
      'Những trường dữ liệu thực sự đi qua giữa tổng đài và CRM, và ranh giới mà API của mỗi nền tảng đặt ra.',
  },
  {
    id: 'GC-B01-08',
    legacyPostId: null,
    title: 'Dữ liệu nào thực sự đồng bộ giữa tổng đài và Helpdesk',
    slug: 'du-lieu-dong-bo-giua-tong-dai-va-helpdesk',
    hub: 'HUB-03',
    cluster: 'Tích hợp Helpdesk',
    primaryKeyword: 'đồng bộ dữ liệu tổng đài và helpdesk',
    secondaryKeywords: ['cuộc gọi gắn với ticket', 'lịch sử hỗ trợ khách hàng', 'ticket từ cuộc gọi'],
    searchIntent: 'informational-definition',
    persona: 'Helpdesk Lead / Trưởng nhóm hỗ trợ khách hàng',
    funnelStage: 'MOFU',
    contentTier: 'SUPPORTING',
    seoTitle: 'Dữ liệu nào thực sự đồng bộ giữa tổng đài và Helpdesk',
    metaDescription:
      'Cuộc gọi trở thành ticket ở mức nào, trường nào đi kèm, trường nào không, và vì sao vòng đời ticket quyết định phạm vi đồng bộ với tổng đài.',
    featuredImage: null,
    featuredImageAlt:
      'Sơ đồ vòng đời ticket hỗ trợ khách hàng và các điểm dữ liệu cuộc gọi được ghi vào từng giai đoạn',
    productCta: ['helpdesk-integration'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '1200-2000',
    excerpt:
      'Ranh giới đồng bộ ở phía Helpdesk: cuộc gọi, ticket, vòng đời xử lý và những gì không nên đẩy qua.',
  },

  /* ── HUB-06 Gcalls CX — 2 ───────────────────────────────────────────── */
  {
    id: 'GC-B01-09',
    legacyPostId: null,
    title: 'Hợp nhất hội thoại hotline, Zalo OA và Facebook về một nơi',
    slug: 'hop-nhat-hoi-thoai-hotline-zalo-oa-va-facebook',
    hub: 'HUB-06',
    cluster: 'Vận hành đa kênh',
    primaryKeyword: 'hợp nhất hội thoại đa kênh',
    secondaryKeywords: ['zalo oa cho doanh nghiệp', 'quản lý tin nhắn nhiều kênh', 'lịch sử khách hàng'],
    searchIntent: 'informational-howto',
    persona: 'Quản lý chăm sóc khách hàng',
    funnelStage: 'MOFU',
    contentTier: 'PILLAR',
    seoTitle: 'Hợp nhất hội thoại hotline, Zalo OA và Facebook về một nơi',
    metaDescription:
      'Cách gom hội thoại từ hotline, Zalo OA, Facebook và email vào một hàng đợi chung, giữ ngữ cảnh khi khách chuyển kênh và phân công không chồng chéo.',
    featuredImage: null,
    featuredImageAlt:
      'Ảnh chụp màn hình hàng đợi hội thoại đa kênh trong Gcalls CX, đã che tên khách hàng và nội dung tin nhắn',
    productCta: ['gcalls-cx', 'helpdesk-integration'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '2000-3000',
    excerpt:
      'Từ bốn hộp thư rời rạc tới một hàng đợi chung: mô hình dữ liệu, quy tắc phân công và cách giữ ngữ cảnh.',
  },
  {
    id: 'GC-B01-10',
    legacyPostId: null,
    title: 'Khi nào doanh nghiệp thực sự cần nền tảng đa kênh',
    slug: 'khi-nao-doanh-nghiep-can-nen-tang-da-kenh',
    hub: 'HUB-06',
    cluster: 'Vận hành đa kênh',
    primaryKeyword: 'nền tảng đa kênh cho doanh nghiệp',
    secondaryKeywords: ['omnichannel là gì', 'đa kênh và hợp kênh', 'chi phí nền tảng đa kênh'],
    searchIntent: 'commercial-investigation',
    persona: 'Giám đốc dịch vụ khách hàng',
    funnelStage: 'MOFU',
    contentTier: 'SUPPORTING',
    seoTitle: 'Khi nào doanh nghiệp thực sự cần nền tảng đa kênh',
    metaDescription:
      'Bốn ngưỡng vận hành cho thấy đã đến lúc cần nền tảng đa kênh, và ba trường hợp một hộp thư dùng chung vẫn là lựa chọn đúng.',
    featuredImage: null,
    featuredImageAlt:
      'Minh họa biên tập về bốn ngưỡng vận hành khiến doanh nghiệp cần hợp nhất kênh liên lạc',
    productCta: ['gcalls-cx', 'consult'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '1200-2000',
    excerpt:
      'Một khung ngưỡng thay cho lời khuyên chung: khi nào nên đầu tư nền tảng đa kênh, khi nào chưa.',
  },

  /* ── HUB-07 QA/QC và quản trị chất lượng — 3 ────────────────────────── */
  {
    id: 'GC-B01-11',
    legacyPostId: null,
    title: 'Xây dựng bộ tiêu chí đánh giá chất lượng cuộc gọi từ đầu',
    slug: 'xay-dung-bo-tieu-chi-danh-gia-chat-luong-cuoc-goi',
    hub: 'HUB-07',
    cluster: 'Quản trị chất lượng hội thoại',
    primaryKeyword: 'bộ tiêu chí đánh giá chất lượng cuộc gọi',
    secondaryKeywords: ['tiêu chí QA call center', 'trọng số chấm điểm', 'hiệu chuẩn người chấm'],
    searchIntent: 'informational-howto',
    persona: 'QA Lead / Trưởng nhóm chất lượng',
    funnelStage: 'MOFU',
    contentTier: 'PILLAR',
    seoTitle: 'Xây dựng bộ tiêu chí đánh giá chất lượng cuộc gọi từ đầu',
    metaDescription:
      'Cách dựng bộ tiêu chí QA từ con số không: chọn hành vi quan sát được, đặt trọng số, viết mô tả mức điểm và hiệu chuẩn giữa những người chấm.',
    featuredImage: null,
    featuredImageAlt:
      'Sơ đồ cấu trúc bộ tiêu chí đánh giá cuộc gọi gồm nhóm tiêu chí, trọng số và mức điểm mô tả',
    productCta: ['qa-qc-center', 'consult'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '2000-3000',
    excerpt:
      'Bốn bước dựng bộ tiêu chí QA quan sát được, có trọng số và hiệu chuẩn được giữa nhiều người chấm.',
  },
  {
    id: 'GC-B01-12',
    legacyPostId: null,
    title: 'Chấm điểm thủ công và hỗ trợ bằng AI khác nhau ở đâu',
    slug: 'cham-diem-cuoc-goi-thu-cong-va-ho-tro-bang-ai',
    hub: 'HUB-07',
    cluster: 'Quản trị chất lượng hội thoại',
    primaryKeyword: 'chấm điểm cuộc gọi bằng AI',
    secondaryKeywords: ['QA tự động', 'phân tích hội thoại', 'người kiểm chứng kết quả AI'],
    searchIntent: 'commercial-investigation',
    persona: 'QA Lead / Trưởng phòng chăm sóc khách hàng',
    funnelStage: 'MOFU',
    contentTier: 'SUPPORTING',
    seoTitle: 'Chấm điểm thủ công và hỗ trợ bằng AI khác nhau ở đâu',
    metaDescription:
      'AI thay đổi độ phủ và tốc độ của hoạt động QA, nhưng không thay thế bước kiểm chứng của con người. Đây là ranh giới giữa hai cách làm.',
    featuredImage: null,
    featuredImageAlt:
      'Ảnh chụp màn hình kết quả phân tích hội thoại trong QA QC Center kèm bước xác nhận của người chấm, đã che dữ liệu khách hàng',
    productCta: ['qa-qc-center', 'consult'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '1200-2000',
    excerpt:
      'Việc nào AI làm được, việc nào bắt buộc còn người, và cách ghép hai cách chấm điểm vào một quy trình.',
  },
  {
    id: 'GC-B01-13',
    legacyPostId: 1828,
    title: 'Dùng biểu mẫu đánh giá cuộc gọi để cải thiện trải nghiệm khách hàng',
    slug: 'cai-thien-trai-nghiem-khach-hang-bang-bieu-mau-cham-diem-danh-gia-cuoc-goi',
    hub: 'HUB-07',
    cluster: 'Vòng phản hồi chất lượng',
    primaryKeyword: 'biểu mẫu đánh giá cuộc gọi',
    secondaryKeywords: ['scorecard cuộc gọi', 'phản hồi cho nhân viên', 'cải thiện trải nghiệm khách hàng'],
    searchIntent: 'informational-howto',
    persona: 'QA Lead / Trưởng nhóm chất lượng',
    funnelStage: 'MOFU',
    contentTier: 'SUPPORTING',
    seoTitle: 'Dùng biểu mẫu đánh giá cuộc gọi để cải thiện trải nghiệm',
    metaDescription:
      'Biểu mẫu chấm điểm chỉ tạo ra thay đổi khi gắn với vòng phản hồi. Cách thiết kế biểu mẫu, trả kết quả và biến điểm số thành hành động cụ thể.',
    featuredImage: null,
    featuredImageAlt:
      'Minh họa biên tập về vòng phản hồi từ biểu mẫu chấm điểm cuộc gọi tới buổi trao đổi với nhân viên',
    productCta: ['qa-qc-center'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '1200-2000',
    excerpt:
      'Biểu mẫu là công cụ, vòng phản hồi mới là cơ chế. Cách nối hai thứ đó lại với nhau.',
  },

  /* ── HUB-08 Voicebot, AI và tự động hóa — 2 ─────────────────────────── */
  {
    id: 'GC-B01-14',
    legacyPostId: null,
    title: 'Loại cuộc gọi nào phù hợp đưa vào kịch bản Voicebot',
    slug: 'loai-cuoc-goi-phu-hop-dua-vao-kich-ban-voicebot',
    hub: 'HUB-08',
    cluster: 'Voicebot và tự động hóa thoại',
    primaryKeyword: 'kịch bản voicebot',
    secondaryKeywords: ['tự động hóa cuộc gọi', 'chuyển tiếp sang nhân viên', 'cuộc gọi lặp lại'],
    searchIntent: 'commercial-investigation',
    persona: 'Trưởng phòng vận hành / Call Center Manager',
    funnelStage: 'MOFU',
    contentTier: 'PILLAR',
    seoTitle: 'Loại cuộc gọi nào phù hợp đưa vào kịch bản Voicebot',
    metaDescription:
      'Bốn tiêu chí sàng lọc cuộc gọi phù hợp với Voicebot, ba nhóm cuộc gọi không nên tự động hóa, và cách thiết kế điểm chuyển tiếp sang nhân viên.',
    featuredImage: null,
    featuredImageAlt:
      'Sơ đồ phân loại cuộc gọi theo mức độ lặp lại và độ phức tạp, đánh dấu vùng phù hợp với kịch bản tự động',
    productCta: ['voicebot-ai', 'consult'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '2000-3000',
    excerpt:
      'Một ma trận sàng lọc để biết cuộc gọi nào nên tự động hóa, cuộc gọi nào phải giữ cho người.',
  },
  {
    id: 'GC-B01-15',
    legacyPostId: null,
    title: 'Voicebot, IVR và tổng đài tự động khác nhau thế nào',
    slug: 'voicebot-ivr-va-tong-dai-tu-dong-khac-nhau-the-nao',
    hub: 'HUB-08',
    cluster: 'Voicebot và tự động hóa thoại',
    primaryKeyword: 'voicebot và IVR',
    secondaryKeywords: ['IVR là gì', 'tổng đài tự động', 'nhận dạng giọng nói'],
    searchIntent: 'informational-definition',
    persona: 'Trưởng phòng vận hành / IT Manager',
    funnelStage: 'TOFU',
    contentTier: 'SUPPORTING',
    seoTitle: 'Voicebot, IVR và tổng đài tự động khác nhau thế nào',
    metaDescription:
      'Ba khái niệm thường bị dùng lẫn nhau. Bài viết tách rõ IVR bấm phím, tổng đài tự động và Voicebot hiểu ngôn ngữ, kèm bảng đối chiếu theo tình huống.',
    featuredImage: null,
    featuredImageAlt:
      'Sơ đồ đối chiếu ba mô hình tự động hóa thoại theo cách người gọi tương tác và cách hệ thống hiểu yêu cầu',
    productCta: ['voicebot-ai'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '1200-2000',
    excerpt:
      'Tách ba khái niệm hay bị gộp làm một, bằng cách hỏi người gọi phải làm gì để hệ thống hiểu.',
  },

  /* ── HUB-09 Tổng đài quốc tế — 3 ────────────────────────────────────── */
  {
    id: 'GC-B01-16',
    legacyPostId: null,
    title: 'Doanh nghiệp cần gì khi gọi ra thị trường nước ngoài',
    slug: 'doanh-nghiep-can-gi-khi-goi-ra-thi-truong-nuoc-ngoai',
    hub: 'HUB-09',
    cluster: 'Liên lạc xuyên biên giới',
    primaryKeyword: 'gọi ra thị trường nước ngoài',
    secondaryKeywords: ['đầu số quốc tế', 'cuộc gọi quốc tế cho doanh nghiệp', 'múi giờ và ca trực'],
    searchIntent: 'informational-definition',
    persona: 'Giám đốc kinh doanh thị trường quốc tế',
    funnelStage: 'TOFU',
    contentTier: 'PILLAR',
    seoTitle: 'Doanh nghiệp cần gì khi gọi ra thị trường nước ngoài',
    metaDescription:
      'Năm nhóm điều kiện phải chuẩn bị trước khi liên hệ khách hàng ngoài Việt Nam: đầu số, hồ sơ, chất lượng thoại, múi giờ và cách ghi nhận dữ liệu.',
    featuredImage: null,
    featuredImageAlt:
      'Sơ đồ năm nhóm điều kiện cần chuẩn bị khi doanh nghiệp bắt đầu gọi ra thị trường nước ngoài',
    productCta: ['international', 'consult'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '2000-3000',
    excerpt:
      'Năm nhóm điều kiện, từ đầu số và hồ sơ tới ca trực lệch múi giờ, cho lần đầu gọi ra nước ngoài.',
  },
  {
    id: 'GC-B01-17',
    legacyPostId: null,
    title: 'Hồ sơ thường được yêu cầu khi đăng ký đầu số quốc tế',
    slug: 'ho-so-dang-ky-dau-so-quoc-te',
    hub: 'HUB-09',
    cluster: 'Liên lạc xuyên biên giới',
    primaryKeyword: 'đăng ký đầu số quốc tế',
    secondaryKeywords: ['hồ sơ đăng ký số điện thoại', 'yêu cầu địa chỉ tại quốc gia', 'thời gian cấp số'],
    searchIntent: 'informational-howto',
    persona: 'Người phụ trách pháp chế và vận hành',
    funnelStage: 'BOFU',
    contentTier: 'SUPPORTING',
    seoTitle: 'Hồ sơ thường được yêu cầu khi đăng ký đầu số quốc tế',
    metaDescription:
      'Các nhóm giấy tờ thường gặp khi xin cấp đầu số ở nước ngoài, vì sao yêu cầu khác nhau theo quốc gia, và cách chuẩn bị để không phải nộp lại.',
    featuredImage: null,
    featuredImageAlt:
      'Sơ đồ quy trình chuẩn bị hồ sơ đăng ký đầu số quốc tế theo bốn nhóm giấy tờ thường được yêu cầu',
    productCta: ['international', 'consult'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '1200-2000',
    excerpt:
      'Bốn nhóm giấy tờ thường gặp, lý do yêu cầu khác nhau giữa các quốc gia, và cách chuẩn bị một lần cho đúng.',
  },
  {
    id: 'GC-B01-18',
    legacyPostId: 1968,
    title: 'Mở rộng thị trường quốc tế: vai trò của hệ thống liên lạc',
    slug: 'tong-dai-quoc-te-mo-rong-thi-truong',
    hub: 'HUB-09',
    cluster: 'Liên lạc xuyên biên giới',
    primaryKeyword: 'mở rộng thị trường quốc tế',
    secondaryKeywords: ['hiện diện tại thị trường mới', 'đội ngũ bán hàng xuyên biên giới', 'kênh liên lạc quốc tế'],
    searchIntent: 'informational-general',
    persona: 'Giám đốc kinh doanh',
    funnelStage: 'TOFU',
    contentTier: 'SUPPORTING',
    seoTitle: 'Mở rộng thị trường quốc tế: vai trò của hệ thống liên lạc',
    metaDescription:
      'Hệ thống liên lạc quyết định điều gì trong một kế hoạch mở rộng thị trường, và ở giai đoạn nào nó chuyển từ chi phí phụ thành nút thắt thật sự.',
    featuredImage: null,
    featuredImageAlt:
      'Minh họa biên tập về ba giai đoạn mở rộng thị trường quốc tế và vai trò của hệ thống liên lạc ở từng giai đoạn',
    productCta: ['international', 'consult'],
    claimStatus: 'NO_UNVERIFIED_CLAIM',
    targetWordCount: '1200-2000',
    excerpt:
      'Ba giai đoạn mở rộng thị trường và thời điểm hệ thống liên lạc chuyển từ chi tiết phụ thành nút thắt.',
  },
]

function hydrate(seed: CatalogSeed, status: BlogArticleMeta['status']): BlogArticleMeta {
  return {
    ...seed,
    url: `/${seed.slug}/`,
    canonical: `${SITE_ORIGIN}/${seed.slug}/`,
    status,
    author: BLOG_AUTHOR,
    hubLabel: BLOG_HUB_LABELS[seed.hub],
    createdAt: AUTHORED_AT,
    updatedAt: AUTHORED_AT,
  }
}

/**
 * The catalog this build ships.
 *
 * In a normal production build `SHIP_DRAFTS` folds to `false`, so this is
 * `PUBLISHED_SEEDS` alone — an empty array today — and `DRAFT_SEEDS` is dropped
 * from the bundle rather than shipped as unreachable data.
 *
 * `scripts/verify-blog-batch-01.mjs` reads the SOURCE, not this value, so the
 * eighteen-article lock is verified regardless of which build is running.
 */
export const BLOG_CATALOG: readonly BlogArticleMeta[] = SHIP_DRAFTS
  ? [
      ...PUBLISHED_SEEDS.map((seed) => hydrate(seed, 'published')),
      ...DRAFT_SEEDS.map((seed) => hydrate(seed, 'draft')),
    ]
  : PUBLISHED_SEEDS.map((seed) => hydrate(seed, 'published'))

export const BLOG_BY_SLUG: Record<string, BlogArticleMeta> = Object.fromEntries(
  BLOG_CATALOG.map((entry) => [entry.slug, entry]),
)

export const BLOG_BY_ROUTE: Record<string, BlogArticleMeta> = Object.fromEntries(
  BLOG_CATALOG.map((entry) => [entry.url, entry]),
)

/** Hub order used by the archive. Matches the approved 3/2/3/2/3/2/3 slate. */
export const BLOG_HUB_ORDER: readonly BlogHubId[] = [
  'HUB-01',
  'HUB-02',
  'HUB-03',
  'HUB-06',
  'HUB-07',
  'HUB-08',
  'HUB-09',
]
