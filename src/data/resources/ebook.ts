/**
 * Approved content for /tai-nguyen/ebook/ — Checkpoint WEB-RES-001.
 *
 * No ebook exists in this repository, so this page publishes no ebook. What it
 * publishes is the subject areas long-form material will cover and the quality
 * bar such a document has to clear — both of which are true today.
 *
 * NOT PERMITTED UNTIL AN APPROVED FILE EXISTS: ebook titles that read as
 * published works, cover images, mock-ups of covers, download buttons, "get
 * the ebook" forms, page counts, and any lead-magnet gate. `topics[].title` is
 * a SUBJECT AREA and `topics[].contents` are QUESTIONS the document would
 * answer — neither may be written as a book title.
 *
 * CLAIM GUARD: the questions listed below must not smuggle in a claim through
 * their phrasing. "Tiết kiệm bao nhiêu phần trăm chi phí" would assert that a
 * saving exists; "những khoản chi phí nào thay đổi khi chuyển sang tổng đài
 * đám mây" does not. See `./types.ts`.
 */

import { ROUTES } from '@/config/navigation'
import type { EbookContent } from './types'

export const EBOOK: EbookContent = {
  id: 'ebook',
  route: ROUTES.ebook,
  breadcrumbLabel: 'Ebook',
  lead: {
    intent: 'consultation',
    source: 'consultation',
    solution: 'Tư vấn chuyên sâu',
  },

  hero: {
    eyebrow: 'EBOOK GCALLS',
    h1: 'Tài liệu chuyên sâu về tổ chức hoạt động liên lạc với khách hàng',
    description:
      'Có những chủ đề không trình bày hết được trong một trang web hay một bài viết: chúng cần bối cảnh, ví dụ và các bước kiểm tra đi kèm. Trang này mô tả năm nhóm chủ đề Gcalls đang chuẩn bị ở dạng tài liệu dài, và tiêu chuẩn nội dung áp dụng cho chúng.',
    primaryCta: { label: 'Đăng ký tư vấn chuyên sâu' },
    secondaryCta: { label: 'Xem năm nhóm chủ đề', href: '#nhom-chu-de' },
    microcopy:
      'Thư viện tài liệu đang được chuẩn bị. Trang này không có nút tải và không có biểu mẫu đổi thông tin lấy tài liệu, vì chưa có tài liệu nào được phát hành.',
  },

  purpose: {
    eyebrow: 'MỤC ĐÍCH VÀ ĐỐI TƯỢNG',
    h2: 'Dành cho người phải xây dựng phương án, không chỉ chọn công cụ',
    description:
      'Tài liệu dài phù hợp khi người đọc cần hiểu toàn bộ một chủ đề để tự thiết kế cách làm cho doanh nghiệp mình, thay vì tìm câu trả lời cho một câu hỏi đơn lẻ.',
    audience: [
      {
        title: 'Người xây dựng quy trình vận hành',
        detail:
          'Cần một khung tham chiếu đầy đủ để thiết kế luồng làm việc, phân vai và tiêu chí đánh giá cho đội ngũ.',
      },
      {
        title: 'Người chuẩn bị dự án chuyển đổi hệ thống',
        detail:
          'Cần hiểu các hạng mục kỹ thuật, dữ liệu và quản trị thay đổi trước khi lập kế hoạch triển khai.',
      },
      {
        title: 'Người phụ trách chất lượng và tuân thủ',
        detail:
          'Cần nắm cách thiết lập tiêu chí, cách lưu vết hội thoại và ranh giới khi dùng kết quả phân tích tự động để đánh giá con người.',
      },
    ],
    note: 'Nếu bạn chỉ cần trả lời một câu hỏi cụ thể, trang FAQ và trang Guides thường nhanh hơn tài liệu dài.',
  },

  topics: {
    eyebrow: 'NĂM NHÓM CHỦ ĐỀ',
    h2: 'Các chủ đề đang được chuẩn bị ở dạng tài liệu chuyên sâu',
    description:
      'Mỗi nhóm dưới đây nêu những câu hỏi mà một tài liệu chuyên sâu về chủ đề đó cần trả lời, kèm trang đã hoàn thiện đang trình bày phần cốt lõi.',
    anchorId: 'nhom-chu-de',
    items: [
      {
        id: 'goi-dien-tich-hop-crm',
        title: 'Hoạt động gọi điện gắn với dữ liệu CRM',
        detail:
          'Cách để cuộc gọi và hồ sơ khách hàng hoạt động như một, từ chuẩn bị dữ liệu tới thay đổi thao tác hằng ngày của nhân viên.',
        contents: [
          'Những dữ liệu nào cần được chuẩn hóa trước khi kết nối hai hệ thống',
          'Cách xử lý khi một số điện thoại trùng với nhiều hồ sơ khách hàng',
          'Thao tác nào của nhân viên thay đổi sau khi tích hợp, và cần hướng dẫn lại những gì',
          'Cách kiểm tra tính đầy đủ của lịch sử liên hệ sau khi hệ thống chạy',
        ],
        links: [
          { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
          { label: 'Các nền tảng đã có trang tích hợp', path: ROUTES.integrations },
        ],
      },
      {
        id: 'giao-tiep-quoc-te',
        title: 'Giao tiếp với khách hàng ở thị trường nước ngoài',
        detail:
          'Những yếu tố quyết định cách một doanh nghiệp tổ chức liên lạc quốc tế: quy định sở tại, hồ sơ, múi giờ và ngôn ngữ.',
        contents: [
          'Vì sao điều kiện cấp số khác nhau giữa các quốc gia và điều đó ảnh hưởng thế nào tới kế hoạch',
          'Các nhóm hồ sơ thường được yêu cầu khi đăng ký đầu số ở nước ngoài',
          'Cách tổ chức ca trực và định tuyến cuộc gọi khi đội ngũ và khách hàng lệch múi giờ',
          'Những hạng mục cần làm rõ về lưu trữ và xử lý dữ liệu theo từng thị trường',
        ],
        links: [{ label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling }],
      },
      {
        id: 'trai-nghiem-da-kenh',
        title: 'Trải nghiệm khách hàng đa kênh',
        detail:
          'Cách thiết kế luồng tiếp nhận khi khách hàng đến từ hotline, Zalo, Facebook, email và SMS, và cách giữ ngữ cảnh khi họ đổi kênh.',
        contents: [
          'Cách lập bản đồ toàn bộ điểm chạm hiện có, kể cả kênh không chính thức',
          'Nguyên tắc phân loại và ưu tiên yêu cầu để không kênh nào bị bỏ sót',
          'Thông tin nào cần đi theo khách hàng khi hội thoại chuyển giữa các bộ phận',
          'Những chỉ số vận hành nên theo dõi và ý nghĩa thực tế của từng chỉ số',
        ],
        links: [
          { label: 'Gcalls CX', path: ROUTES.gcallsCx },
          { label: 'Tổng đài tích hợp Helpdesk', path: ROUTES.helpdeskIntegration },
        ],
      },
      {
        id: 'trien-khai-voicebot',
        title: 'Đưa Voicebot vào vận hành',
        detail:
          'Cách xác định phạm vi phù hợp cho cuộc gọi tự động, thiết kế kịch bản và định nghĩa điểm chuyển cho nhân viên.',
        contents: [
          'Tiêu chí phân loại cuộc gọi có thể tự động hóa và cuộc gọi bắt buộc do người thực hiện',
          'Cách viết kịch bản có nhánh xử lý cho tình huống ngoài dự kiến',
          'Cách định nghĩa điều kiện chuyển tiếp cho nhân viên và những gì cần bàn giao kèm theo',
          'Cách đánh giá kết quả một chiến dịch trước khi mở rộng phạm vi',
        ],
        links: [{ label: 'Gcalls Voicebot AI', path: ROUTES.voicebotAi }],
      },
      {
        id: 'quan-tri-ai-qc',
        title: 'Quản trị chất lượng hội thoại có hỗ trợ AI',
        detail:
          'Cách xây dựng bộ tiêu chí, cách sử dụng kết quả phân tích tự động một cách có trách nhiệm, và ranh giới của công cụ.',
        contents: [
          'Cách xây dựng bộ tiêu chí đánh giá phản ánh đúng điều doanh nghiệp quan tâm',
          'Cách chọn mẫu cuộc gọi để đánh giá khi không thể nghe lại toàn bộ',
          'Vì sao kết quả phân tích tự động cần người kiểm chứng trước khi dùng để đánh giá nhân sự',
          'Cách phản hồi kết quả cho nhân viên và gắn với hoạt động đào tạo',
        ],
        links: [{ label: 'QA QC Center', path: ROUTES.qcCenter }],
      },
    ],
    note: 'Đây là nhóm chủ đề và câu hỏi cần trả lời, không phải tên tài liệu đã xuất bản. Chưa có tài liệu nào trong số này được phát hành.',
  },

  standard: {
    eyebrow: 'TIÊU CHUẨN NỘI DUNG',
    h2: 'Một tài liệu chuyên sâu của Gcalls cần có gì',
    description:
      'Tiêu chuẩn dưới đây quyết định tài liệu nào được phát hành. Nó cũng là lý do thư viện hiện còn trống: viết một tài liệu đạt các điều kiện này mất nhiều thời gian hơn viết một tài liệu tiếp thị.',
    items: [
      {
        title: 'Trả lời được một câu hỏi vận hành cụ thể',
        detail:
          'Tài liệu bắt đầu từ một quyết định người đọc đang phải đưa ra, không bắt đầu từ danh sách tính năng của sản phẩm.',
      },
      {
        title: 'Nêu rõ điều gì phụ thuộc vào từng doanh nghiệp',
        detail:
          'Mọi nội dung phụ thuộc vào hệ thống hiện có, quy mô hoặc quy định đều được nêu rõ là cần khảo sát riêng, thay vì trình bày như một công thức chung.',
      },
      {
        title: 'Không công bố số liệu không nêu được cách đo',
        detail:
          'Nếu một con số không kèm phạm vi, kỳ đo và cách tính thì con số đó không xuất hiện trong tài liệu.',
      },
      {
        title: 'Dùng được kể cả khi doanh nghiệp chọn nhà cung cấp khác',
        detail:
          'Phần khung tham chiếu, danh mục kiểm tra và cách đặt câu hỏi phải có giá trị độc lập với việc doanh nghiệp có dùng Gcalls hay không.',
      },
      {
        title: 'Nêu rõ giới hạn của công cụ',
        detail:
          'Tài liệu nói rõ những gì hệ thống không giải quyết được và những gì vẫn phụ thuộc vào con người và quy trình.',
      },
      {
        title: 'Có thể đọc mà không cần để lại thông tin',
        detail:
          'Khi tài liệu được phát hành, phần nội dung chính có thể tiếp cận trực tiếp. Việc để lại thông tin liên hệ là lựa chọn, không phải điều kiện.',
      },
    ],
    note: 'Tiêu chuẩn này áp dụng cho toàn bộ nội dung Gcalls công bố, và là cùng một tiêu chuẩn dùng cho blog, guides và case studies.',
  },

  status: {
    eyebrow: 'TRẠNG THÁI THƯ VIỆN',
    h2: 'Thư viện tài liệu đang được chuẩn bị',
    description:
      'Chưa có tài liệu nào được phát hành. Trang này không hiển thị tên sách, ảnh bìa hay nút tải để tạo cảm giác đã có nội dung.',
    points: [
      'Không có nút tải, đường dẫn tải hay biểu mẫu đổi thông tin lấy tài liệu, vì chưa có tệp nào tồn tại.',
      'Năm nhóm chủ đề phía trên là phạm vi nội dung đã xác định, không phải danh mục sách đã xuất bản.',
      'Khi một tài liệu được duyệt phát hành, nó sẽ xuất hiện tại đây kèm mô tả nội dung thật và đường dẫn tải thật.',
    ],
    linksHeading: 'Nội dung chuyên sâu đã có sẵn trên website',
    links: [
      { label: 'Guides — sáu lộ trình đánh giá', path: ROUTES.guides },
      { label: 'Glossary — thuật ngữ', path: ROUTES.glossary },
      { label: 'FAQ — câu hỏi thường gặp', path: ROUTES.faq },
      { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
      { label: 'Gcalls CX', path: ROUTES.gcallsCx },
      { label: 'QA QC Center', path: ROUTES.qcCenter },
    ],
    note: 'Nếu doanh nghiệp cần tài liệu cho một chủ đề cụ thể để trình bày nội bộ, hãy nêu nhu cầu khi liên hệ — đội ngũ Gcalls có thể trao đổi trực tiếp về chủ đề đó.',
  },

  routing: {
    eyebrow: 'XEM THÊM',
    h2: 'Đi theo hướng giải pháp đang quan tâm',
    description:
      'Mỗi nhóm chủ đề phía trên đều có một trang giải pháp hoặc sản phẩm đã hoàn thiện trình bày phần cốt lõi.',
    items: [
      {
        title: 'Tổng đài tích hợp CRM',
        detail:
          'Cách cuộc gọi hoạt động cùng dữ liệu khách hàng, phạm vi đồng bộ và những gì phụ thuộc vào nền tảng CRM đang dùng.',
        path: ROUTES.crmIntegration,
        cta: 'Xem tổng đài tích hợp CRM',
      },
      {
        title: 'Gcalls CX',
        detail:
          'Nền tảng hợp nhất hội thoại từ nhiều kênh về một nơi cho đội chăm sóc khách hàng.',
        path: ROUTES.gcallsCx,
        cta: 'Xem Gcalls CX',
      },
      {
        title: 'QA QC Center',
        detail:
          'Cách tổ chức đánh giá chất lượng hội thoại với sự hỗ trợ của QC Bot AI, và ranh giới của công cụ.',
        path: ROUTES.qcCenter,
        cta: 'Xem QA QC Center',
      },
    ],
  },

  faq: [
    {
      q: 'Có tài liệu nào tải về được ngay không?',
      a: 'Hiện chưa có. Gcalls chưa phát hành tài liệu dạng tệp, nên trang này không có nút tải. Nội dung chuyên sâu hiện có nằm trực tiếp trên các trang Guides, Glossary, FAQ và các trang sản phẩm, giải pháp.',
      link: { label: 'Xem Guides', path: ROUTES.guides },
    },
    {
      q: 'Có phải để lại email mới đọc được tài liệu không?',
      a: 'Không. Khi tài liệu được phát hành, phần nội dung chính sẽ tiếp cận được trực tiếp. Việc để lại thông tin liên hệ là lựa chọn của người đọc, không phải điều kiện để đọc.',
    },
    {
      q: 'Vì sao năm nhóm chủ đề không có tên sách cụ thể?',
      a: 'Vì chưa có tài liệu nào được viết xong và duyệt phát hành. Đặt tên sách trước khi có nội dung sẽ khiến trang trông như đang có tài liệu, nên trang chỉ nêu chủ đề và những câu hỏi mà tài liệu đó cần trả lời.',
    },
  ],

  finalCta: {
    eyebrow: 'EBOOK',
    h2: 'Cần nội dung chuyên sâu cho một chủ đề cụ thể?',
    description:
      'Nêu chủ đề và bối cảnh doanh nghiệp đang cần làm rõ. Đội ngũ Gcalls có thể trao đổi trực tiếp, và chủ đề được nhiều doanh nghiệp quan tâm sẽ được ưu tiên biên soạn.',
    primaryCta: { label: 'Đăng ký tư vấn chuyên sâu', path: ROUTES.contact },
  },
}
