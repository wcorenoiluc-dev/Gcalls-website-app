/**
 * Approved content for /blog/ — Checkpoint WEB-RES-001.
 *
 * This is an editorial FOUNDATION, not a blog index. This repository holds no
 * approved article, so the page publishes what genuinely exists — the editorial
 * scope, the six categories, and routing into the pages that are finished — and
 * states plainly that no article has been published yet.
 *
 * NOT PERMITTED HERE, EVER, UNTIL A REAL ARTICLE EXISTS:
 * article titles, authors, publication dates, reading times, view counts,
 * thumbnails, "coming soon" cards that look like articles, and `Article` or
 * `BlogPosting` structured data. `category.topics` are SUBJECTS the category
 * covers, deliberately phrased so none of them can be mistaken for a headline.
 *
 * See the fabrication and claim guards in `./types.ts`.
 */

import { ROUTES } from '@/config/navigation'
import type { BlogContent } from './types'

export const BLOG: BlogContent = {
  id: 'blog',
  route: ROUTES.blog,
  breadcrumbLabel: 'Blog',
  lead: {
    intent: 'consultation',
    source: 'consultation',
    solution: 'Tư vấn vận hành',
  },

  hero: {
    eyebrow: 'BLOG GCALLS',
    h1: 'Góc nhìn vận hành về tổng đài, tích hợp hệ thống và chất lượng hội thoại',
    description:
      'Blog Gcalls tập trung vào bốn nhóm chủ đề: cách tổ chức hoạt động nghe gọi hằng ngày, cách kết nối cuộc gọi với CRM và Helpdesk, cách vận hành chăm sóc khách hàng đa kênh, và cách kiểm soát chất lượng hội thoại với sự hỗ trợ của AI. Nội dung viết cho người trực tiếp vận hành, không viết cho người đang tìm từ khóa.',
    primaryCta: { label: 'Đăng ký tư vấn vận hành' },
    secondaryCta: {
      label: 'Xem các chủ đề biên tập',
      href: '#chu-de-bien-tap',
    },
    microcopy:
      'Blog đang ở giai đoạn xây dựng. Trang này mô tả phạm vi biên tập và dẫn tới những trang đã hoàn thiện — không hiển thị bài viết chưa tồn tại.',
  },

  purpose: {
    eyebrow: 'MỤC ĐÍCH VÀ ĐỐI TƯỢNG',
    h2: 'Viết cho người phải trả lời câu hỏi "đội mình đang vận hành thế nào?"',
    description:
      'Mỗi bài viết trên blog này nhắm tới một quyết định vận hành cụ thể mà người đọc đang phải đưa ra, và nêu rõ điều gì phụ thuộc vào hệ thống, quy trình hoặc quy định của từng doanh nghiệp.',
    audience: [
      {
        title: 'Trưởng nhóm Sales có đội gọi ra',
        detail:
          'Người chịu trách nhiệm về khối lượng liên hệ, chất lượng ghi nhận thông tin và việc bàn giao khách hàng giữa các nhân sự.',
      },
      {
        title: 'Quản lý chăm sóc khách hàng',
        detail:
          'Người phải bảo đảm yêu cầu từ hotline, Zalo, Facebook hay email đều được tiếp nhận và không rơi giữa các kênh.',
      },
      {
        title: 'Người phụ trách chất lượng hội thoại',
        detail:
          'Người xây dựng bộ tiêu chí đánh giá, nghe lại cuộc gọi và cần cách kiểm soát chất lượng ở quy mô lớn hơn khả năng nghe thủ công.',
      },
      {
        title: 'Người phụ trách hệ thống và tích hợp',
        detail:
          'Người đánh giá khả năng kết nối giữa tổng đài và CRM, Helpdesk hoặc hệ thống bán hàng đang dùng, và phạm vi dữ liệu được đồng bộ.',
      },
    ],
    note: 'Blog không thay thế tư vấn triển khai. Những nội dung phụ thuộc vào hệ thống hiện tại, quy mô đội ngũ hoặc quy định viễn thông đều được nêu rõ là cần khảo sát riêng.',
  },

  categories: {
    eyebrow: 'SÁU DANH MỤC',
    h2: 'Phạm vi biên tập của blog',
    description:
      'Sáu danh mục dưới đây là phạm vi nội dung đã được xác định. Mỗi danh mục nêu các chủ đề sẽ được viết và dẫn tới trang đã hoàn thiện đang trình bày cùng vấn đề.',
    anchorId: 'chu-de-bien-tap',
    items: [
      {
        id: 'van-hanh-call-center',
        title: 'Vận hành call center',
        detail:
          'Cách tổ chức hoạt động nghe gọi hằng ngày của một đội ngũ: phân bổ hotline, luồng tiếp nhận cuộc gọi đến, ghi nhận thông tin sau cuộc gọi và theo dõi hoạt động của đội.',
        topics: [
          'Cách thiết kế luồng tiếp nhận cuộc gọi đến cho đội ngũ nhiều nhóm',
          'Những thông tin nên được ghi nhận ngay trong cuộc gọi thay vì sau đó',
          'Cách quản lý nhìn được hoạt động gọi của đội mà không cần nghe lại toàn bộ',
        ],
        links: [
          { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
          { label: 'Bảng giá Gcalls', path: ROUTES.pricing },
        ],
      },
      {
        id: 'tich-hop-crm-helpdesk',
        title: 'Tích hợp CRM và Helpdesk',
        detail:
          'Cách để cuộc gọi hoạt động cùng dữ liệu khách hàng: hiển thị thông tin khách khi có cuộc gọi, đồng bộ lịch sử liên hệ về đúng hồ sơ, và gắn cuộc gọi với ticket đang xử lý.',
        topics: [
          'Cần chuẩn bị gì trước khi kết nối tổng đài với CRM đang dùng',
          'Khác biệt giữa đồng bộ lịch sử cuộc gọi và đồng bộ toàn bộ dữ liệu khách hàng',
          'Vì sao phạm vi tích hợp phụ thuộc vào API mà nền tảng đó cung cấp',
        ],
        links: [
          { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
          { label: 'Tổng đài tích hợp Helpdesk', path: ROUTES.helpdeskIntegration },
          { label: 'Tất cả nền tảng tích hợp', path: ROUTES.integrations },
        ],
      },
      {
        id: 'giao-tiep-quoc-te',
        title: 'Giao tiếp quốc tế',
        detail:
          'Những điều cần cân nhắc khi doanh nghiệp liên hệ khách hàng ngoài Việt Nam: đầu số theo quốc gia, hồ sơ pháp lý, và cách tổ chức đội ngũ làm việc lệch múi giờ.',
        topics: [
          'Vì sao khả năng cấp số ở mỗi quốc gia phụ thuộc quy định sở tại',
          'Những hồ sơ thường được yêu cầu khi đăng ký số quốc tế',
          'Cách tổ chức hoạt động hỗ trợ khách hàng ở nhiều múi giờ',
        ],
        links: [
          { label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling },
        ],
      },
      {
        id: 'trai-nghiem-da-kenh',
        title: 'Trải nghiệm khách hàng đa kênh',
        detail:
          'Cách hợp nhất hội thoại từ hotline, Zalo, Facebook, email và SMS về một nơi, và cách giữ ngữ cảnh khách hàng khi họ chuyển kênh giữa chừng.',
        topics: [
          'Điều gì thất lạc khi mỗi kênh được xử lý bằng một công cụ riêng',
          'Cách phân loại yêu cầu khách hàng để không có kênh nào bị bỏ sót',
          'Khi nào một doanh nghiệp thật sự cần nền tảng đa kênh',
        ],
        links: [
          { label: 'Gcalls CX', path: ROUTES.gcallsCx },
          { label: 'Tổng đài tích hợp Helpdesk', path: ROUTES.helpdeskIntegration },
        ],
      },
      {
        id: 'voicebot-va-ai-qc',
        title: 'Voicebot và AI QC',
        detail:
          'Vai trò thực tế của AI trong hoạt động thoại: tự động hóa cuộc gọi có kịch bản cố định, và hỗ trợ đánh giá chất lượng hội thoại ở quy mô lớn hơn khả năng nghe thủ công.',
        topics: [
          'Loại cuộc gọi nào phù hợp để đưa vào kịch bản tự động, loại nào không',
          'Cách xây dựng bộ tiêu chí đánh giá trước khi nghĩ tới chấm điểm tự động',
          'Vì sao kết quả phân tích của AI vẫn cần người kiểm chứng',
        ],
        links: [
          { label: 'Gcalls Voicebot AI', path: ROUTES.voicebotAi },
          { label: 'QA QC Center', path: ROUTES.qcCenter },
        ],
      },
      {
        id: 'van-hanh-theo-nganh',
        title: 'Vận hành theo ngành',
        detail:
          'Cùng một hệ thống tổng đài được dùng rất khác nhau giữa các ngành. Danh mục này viết về đặc thù vận hành của từng ngành và điều đó thay đổi cách triển khai ra sao.',
        topics: [
          'Điểm khác nhau giữa gọi ra tuyển sinh và gọi ra thu hồi công nợ',
          'Yêu cầu về lưu vết hội thoại trong các ngành có quy định chặt',
          'Cách đội thuê ngoài vận hành nhiều chiến dịch trên cùng một hệ thống',
        ],
        links: [{ label: 'Giải pháp theo ngành', path: ROUTES.industries }],
      },
    ],
    note: 'Danh mục là phạm vi biên tập đã xác định, không phải danh sách bài viết đã có. Khi một bài viết được duyệt đăng, bài đó sẽ xuất hiện trong danh mục tương ứng kèm thông tin tác giả và ngày đăng thật.',
  },

  status: {
    eyebrow: 'TRẠNG THÁI NỘI DUNG',
    h2: 'Hiện chưa có bài viết nào được đăng tải',
    description:
      'Gcalls chọn không hiển thị bài viết mẫu, tiêu đề giả hay thẻ bài viết trống để trang trông có nội dung. Dưới đây là tình trạng thật của blog tại thời điểm này.',
    points: [
      'Không có bài viết, tác giả hoặc ngày đăng nào được hiển thị, vì chưa có bài viết nào được duyệt đăng.',
      'Sáu danh mục phía trên mô tả phạm vi biên tập đã được xác định, không phải nội dung đã hoàn thành.',
      'Trang này không phát sinh dữ liệu có cấu trúc dạng bài viết, để công cụ tìm kiếm không ghi nhận nội dung không tồn tại.',
    ],
    linksHeading: 'Nội dung đã hoàn thiện, có thể đọc ngay',
    links: [
      { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
      { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
      { label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling },
      { label: 'Guides — lộ trình triển khai', path: ROUTES.guides },
      { label: 'Glossary — thuật ngữ', path: ROUTES.glossary },
      { label: 'FAQ — câu hỏi thường gặp', path: ROUTES.faq },
    ],
    note: 'Nếu có chủ đề bạn muốn Gcalls viết trước, gửi câu hỏi qua trang liên hệ — câu hỏi được nhiều doanh nghiệp quan tâm sẽ được ưu tiên đưa vào kế hoạch biên tập.',
  },

  routing: {
    eyebrow: 'BẮT ĐẦU TỪ BÀI TOÁN',
    h2: 'Bắt đầu từ vấn đề vận hành đang gặp',
    description:
      'Nếu bạn tới đây để tìm câu trả lời cho một tình huống cụ thể, đây là trang đã hoàn thiện đang trình bày đúng vấn đề đó.',
    items: [
      {
        title: 'Đội ngũ gọi ra bằng máy cá nhân, quản lý không nắm được hoạt động',
        detail:
          'Cuộc gọi, danh bạ và ghi chú nằm rải rác trên thiết bị của từng người, nên không có bức tranh chung về hoạt động liên hệ khách hàng.',
        path: ROUTES.gcallsPlus,
        cta: 'Xem Gcalls Plus Webphone',
      },
      {
        title: 'Cuộc gọi và dữ liệu khách hàng nằm ở hai hệ thống khác nhau',
        detail:
          'Nhân viên phải tra cứu thủ công trước mỗi cuộc gọi và nhập lại thông tin sau đó, khiến lịch sử liên hệ không đầy đủ.',
        path: ROUTES.crmIntegration,
        cta: 'Xem tổng đài tích hợp CRM',
      },
      {
        title: 'Yêu cầu khách hàng đến từ nhiều kênh và dễ bị bỏ sót',
        detail:
          'Hotline, Zalo, Facebook và email được xử lý bằng các công cụ riêng, nên không ai nắm được toàn bộ lịch sử của một khách hàng.',
        path: ROUTES.gcallsCx,
        cta: 'Xem Gcalls CX',
      },
      {
        title: 'Cần liên hệ khách hàng ở thị trường nước ngoài',
        detail:
          'Doanh nghiệp cần đầu số và cách tổ chức liên lạc phù hợp với từng quốc gia, kèm yêu cầu hồ sơ khác nhau theo quy định sở tại.',
        path: ROUTES.internationalCalling,
        cta: 'Xem tổng đài quốc tế',
      },
      {
        title: 'Không đủ nhân lực nghe lại và đánh giá chất lượng cuộc gọi',
        detail:
          'Việc chấm điểm hội thoại phụ thuộc vào số giờ nghe thủ công, nên chỉ một phần nhỏ cuộc gọi được kiểm tra.',
        path: ROUTES.qcCenter,
        cta: 'Xem QA QC Center',
      },
      {
        title: 'Bài toán mang đặc thù của một ngành cụ thể',
        detail:
          'Cách vận hành khác nhau đáng kể giữa giáo dục, tài chính, bảo hiểm, bất động sản, thương mại điện tử và dịch vụ thuê ngoài.',
        path: ROUTES.industries,
        cta: 'Xem giải pháp theo ngành',
      },
    ],
  },

  faq: [
    {
      q: 'Vì sao blog chưa có bài viết nào?',
      a: 'Gcalls đang xây dựng nội dung theo sáu danh mục đã xác định và chỉ đăng bài khi nội dung được duyệt. Trang này hiển thị đúng tình trạng đó thay vì tạo bài viết mẫu hoặc thẻ bài viết trống để lấp chỗ.',
    },
    {
      q: 'Trong lúc chờ bài viết, có thể đọc gì?',
      a: 'Các trang sản phẩm, giải pháp và theo ngành đã hoàn thiện đều trình bày chi tiết bài toán vận hành tương ứng. Trang Guides mô tả lộ trình đánh giá theo từng nhu cầu, trang Glossary giải thích thuật ngữ và trang FAQ tổng hợp câu hỏi thường gặp.',
      link: { label: 'Xem Guides', path: ROUTES.guides },
    },
    {
      q: 'Blog có nhận bài viết hoặc chủ đề đề xuất không?',
      a: 'Có. Bạn có thể gửi chủ đề hoặc câu hỏi vận hành qua trang liên hệ. Câu hỏi được nhiều doanh nghiệp cùng quan tâm sẽ được ưu tiên trong kế hoạch biên tập.',
      link: { label: 'Gửi câu hỏi cho Gcalls', path: ROUTES.contact },
    },
    {
      q: 'Nội dung blog có thay thế được bước tư vấn triển khai không?',
      a: 'Không. Blog giúp người đọc hiểu vấn đề và biết cần đánh giá những gì, nhưng phạm vi triển khai thực tế phụ thuộc vào hệ thống hiện có, quy mô đội ngũ và quy định áp dụng cho từng doanh nghiệp, nên vẫn cần một bước khảo sát riêng.',
    },
  ],

  finalCta: {
    eyebrow: 'BLOG',
    h2: 'Có câu hỏi vận hành chưa tìm được câu trả lời?',
    description:
      'Mô tả tình huống đội ngũ đang gặp để Gcalls trao đổi trực tiếp. Nếu là câu hỏi nhiều doanh nghiệp cùng quan tâm, nội dung sẽ được đưa vào kế hoạch biên tập của blog.',
    primaryCta: { label: 'Đăng ký tư vấn vận hành', path: ROUTES.contact },
  },
}
