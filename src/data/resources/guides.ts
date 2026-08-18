/**
 * Approved content for /tai-nguyen/guides/ — Checkpoint WEB-RES-001.
 *
 * The guides are ON THIS PAGE. There is no PDF, no download and no gated file,
 * and the page says so rather than showing a download button that resolves to
 * nothing. Each path is a real decision aid: the question a reader is actually
 * asking, who it applies to, what they should assess before committing, and the
 * completed page that goes deeper.
 *
 * CLAIM GUARD — the checkpoints below describe what to ASSESS, never what
 * Gcalls guarantees. No deployment duration, saving, coverage or success rate
 * appears anywhere on this page; where a reader would expect one, the text says
 * the answer depends on the survey. In particular Auto Dialer is not offered as
 * an assessable Gcalls capability (see `src/data/industries/types.ts`), and
 * international coverage is never expressed as a country count.
 */

import { ROUTES } from '@/config/navigation'
import type { GuidesContent } from './types'

export const GUIDES: GuidesContent = {
  id: 'guides',
  route: ROUTES.guides,
  breadcrumbLabel: 'Guides',
  lead: {
    intent: 'consultation',
    source: 'consultation',
    solution: 'Tư vấn triển khai',
  },

  hero: {
    eyebrow: 'GUIDES GCALLS',
    h1: 'Lộ trình đánh giá trước khi triển khai hệ thống liên lạc với khách hàng',
    description:
      'Sáu lộ trình dưới đây đi theo đúng thứ tự câu hỏi mà một doanh nghiệp gặp phải khi thay đổi cách đội ngũ liên lạc với khách hàng: cần làm rõ điều gì, dựa trên căn cứ nào, và bước tiếp theo là gì. Mỗi lộ trình nêu rõ những gì phải khảo sát riêng cho từng doanh nghiệp.',
    primaryCta: { label: 'Đăng ký tư vấn theo lộ trình' },
    secondaryCta: { label: 'Xem sáu lộ trình', href: '#sau-lo-trinh' },
    microcopy:
      'Nội dung hướng dẫn nằm trực tiếp trên trang này. Gcalls chưa phát hành bản tải về, nên trang không có nút tải tài liệu.',
  },

  purpose: {
    eyebrow: 'MỤC ĐÍCH VÀ ĐỐI TƯỢNG',
    h2: 'Dành cho người phải chuẩn bị quyết định, không chỉ người tìm hiểu',
    description:
      'Mỗi lộ trình được viết cho thời điểm doanh nghiệp đã nhận ra vấn đề nhưng chưa biết cần làm rõ những gì trước khi chọn phương án hoặc yêu cầu báo giá.',
    audience: [
      {
        title: 'Người đề xuất phương án nội bộ',
        detail:
          'Cần một danh sách hạng mục cần làm rõ để trình bày với ban lãnh đạo, thay vì chỉ so sánh tính năng giữa các nhà cung cấp.',
      },
      {
        title: 'Người phụ trách vận hành sẽ dùng hệ thống',
        detail:
          'Cần biết thay đổi này ảnh hưởng thế nào tới thao tác hằng ngày của đội ngũ và cần chuẩn bị gì trước khi chuyển đổi.',
      },
      {
        title: 'Người phụ trách hệ thống và dữ liệu',
        detail:
          'Cần xác định phạm vi kết nối kỹ thuật khả thi với hệ thống hiện có và những gì phụ thuộc vào nền tảng bên thứ ba.',
      },
    ],
    note: 'Các lộ trình này giúp chuẩn bị câu hỏi đúng. Kết luận cuối cùng — phạm vi, cấu hình và thời gian triển khai — chỉ có sau bước khảo sát hệ thống thực tế của doanh nghiệp.',
  },

  paths: {
    eyebrow: 'SÁU LỘ TRÌNH',
    h2: 'Chọn lộ trình theo câu hỏi đang cần trả lời',
    description:
      'Mỗi lộ trình gồm câu hỏi vận hành, đối tượng áp dụng, những hạng mục cần đánh giá và trang đã hoàn thiện trình bày chi tiết hơn.',
    anchorId: 'sau-lo-trinh',
    items: [
      {
        id: 'chon-tong-dai-trinh-duyet',
        n: '01',
        question: 'Doanh nghiệp có nên chuyển sang tổng đài hoạt động trên trình duyệt không?',
        title: 'Chọn hệ thống tổng đài trên trình duyệt',
        audience:
          'Doanh nghiệp đang dùng điện thoại bàn, máy cá nhân hoặc tổng đài đặt tại chỗ, và bắt đầu gặp giới hạn khi mở rộng đội ngũ.',
        checkpoints: [
          'Số người thật sự cần nghe gọi hằng ngày, và trong đó bao nhiêu người làm việc ngoài văn phòng.',
          'Hiện có bao nhiêu đầu số, ai đang quản lý và điều gì xảy ra khi một nhân sự nghỉ việc.',
          'Thông tin nào bắt buộc phải được ghi nhận sau mỗi cuộc gọi, và hiện đang được ghi ở đâu.',
          'Chất lượng đường truyền tại từng địa điểm làm việc, vì đây là điều kiện kỹ thuật của mọi hệ thống chạy trên trình duyệt.',
          'Ai cần xem báo cáo hoạt động cuộc gọi, và họ cần thấy những chỉ số nào.',
        ],
        related: [
          { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
          { label: 'Bảng giá Gcalls', path: ROUTES.pricing },
        ],
        nextAction: {
          label: 'Ước tính chi phí theo quy mô đội ngũ',
          path: ROUTES.costEstimator,
        },
      },
      {
        id: 'ke-hoach-tich-hop-crm',
        n: '02',
        question: 'Cần chuẩn bị gì trước khi kết nối tổng đài với CRM hoặc Helpdesk?',
        title: 'Lập kế hoạch tích hợp tổng đài với CRM hoặc Helpdesk',
        audience:
          'Doanh nghiệp đã dùng CRM hoặc phần mềm quản lý yêu cầu khách hàng và muốn cuộc gọi hoạt động cùng dữ liệu đó.',
        checkpoints: [
          'Tên và phiên bản chính xác của nền tảng đang dùng, vì khả năng kết nối phụ thuộc vào API mà phiên bản đó cung cấp.',
          'Dữ liệu nào cần đi theo chiều nào: hiển thị thông tin khách khi có cuộc gọi, đồng bộ lịch sử cuộc gọi, hay cả hai.',
          'Ai là chủ sở hữu dữ liệu khách hàng và ai có quyền cấp quyền truy cập kỹ thuật.',
          'Cách xử lý trùng lặp khi một số điện thoại khớp với nhiều hồ sơ trong hệ thống.',
          'Quy trình hiện tại sẽ thay đổi ở bước nào, và ai cần được hướng dẫn lại thao tác.',
        ],
        related: [
          { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
          { label: 'Tổng đài tích hợp Helpdesk', path: ROUTES.helpdeskIntegration },
          { label: 'Tất cả nền tảng tích hợp', path: ROUTES.integrations },
        ],
        nextAction: {
          label: 'Xem các nền tảng đã có trang tích hợp',
          path: ROUTES.integrations,
        },
      },
      {
        id: 'trien-khai-so-quoc-te',
        n: '03',
        question: 'Doanh nghiệp cần chuẩn bị gì để liên lạc với khách hàng ở nước ngoài?',
        title: 'Chuẩn bị triển khai đầu số quốc tế',
        audience:
          'Doanh nghiệp có khách hàng, đối tác hoặc đội ngũ ở ngoài Việt Nam và cần một cách liên lạc ổn định theo từng thị trường.',
        checkpoints: [
          'Danh sách quốc gia thật sự cần đầu số, tách khỏi danh sách quốc gia chỉ cần gọi tới.',
          'Yêu cầu hồ sơ và điều kiện đăng ký của từng quốc gia, vì quy định do nhà chức trách sở tại đặt ra, không do nhà cung cấp quyết định.',
          'Ai sẽ trực nhận cuộc gọi ở múi giờ tương ứng, và ngoài giờ đó cuộc gọi được xử lý thế nào.',
          'Ngôn ngữ hỗ trợ cần thiết cho từng thị trường và cách định tuyến cuộc gọi theo ngôn ngữ.',
          'Yêu cầu lưu trữ và xử lý dữ liệu áp dụng cho từng thị trường mà doanh nghiệp phục vụ.',
        ],
        related: [{ label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling }],
        nextAction: {
          label: 'Trao đổi về thị trường cần triển khai',
          path: ROUTES.contact,
        },
      },
      {
        id: 'thiet-ke-cham-soc-da-kenh',
        n: '04',
        question: 'Làm thế nào để yêu cầu khách hàng từ nhiều kênh không bị bỏ sót?',
        title: 'Thiết kế luồng chăm sóc khách hàng đa kênh',
        audience:
          'Doanh nghiệp đang tiếp nhận khách hàng qua hotline, Zalo, Facebook, email hoặc SMS bằng những công cụ tách rời nhau.',
        checkpoints: [
          'Liệt kê đầy đủ các kênh khách hàng đang thực sự dùng, kể cả kênh không chính thức.',
          'Xác định kênh nào bắt buộc phải trả lời trong khung thời gian cam kết, và cam kết đó hiện được theo dõi ra sao.',
          'Cách một yêu cầu được chuyển giữa các bộ phận, và thông tin nào thường bị mất trong lúc chuyển.',
          'Ngữ cảnh nào cần được giữ lại khi khách hàng đổi kênh giữa chừng.',
          'Cách đo lường hiện tại: doanh nghiệp đang biết gì và không biết gì về hoạt động chăm sóc khách hàng.',
        ],
        related: [
          { label: 'Gcalls CX', path: ROUTES.gcallsCx },
          { label: 'Tổng đài tích hợp Helpdesk', path: ROUTES.helpdeskIntegration },
        ],
        nextAction: { label: 'Xem Gcalls CX', path: ROUTES.gcallsCx },
      },
      {
        id: 'dua-voicebot-vao-quy-trinh',
        n: '05',
        question: 'Loại cuộc gọi nào nên đưa vào kịch bản tự động, loại nào không?',
        title: 'Đưa Voicebot vào một quy trình đang chạy',
        audience:
          'Doanh nghiệp có lượng lớn cuộc gọi lặp lại theo cùng một kịch bản và muốn giảm khối lượng thao tác thủ công của đội ngũ.',
        checkpoints: [
          'Xác định các cuộc gọi có nội dung gần như không đổi — nhắc lịch, xác nhận thông tin, sàng lọc nhu cầu — và ước lượng tỷ trọng của chúng.',
          'Với mỗi loại cuộc gọi, xác định điều kiện phải chuyển cho nhân viên thay vì tiếp tục kịch bản.',
          'Nội dung nào bắt buộc phải do người thực hiện vì liên quan tới tư vấn, khiếu nại hoặc cam kết tài chính.',
          'Dữ liệu đầu vào cho chiến dịch đến từ hệ thống nào và được cập nhật theo tần suất nào.',
          'Cách doanh nghiệp sẽ đánh giá kết quả sau khi chạy, trước khi mở rộng phạm vi.',
        ],
        related: [{ label: 'Gcalls Voicebot AI', path: ROUTES.voicebotAi }],
        nextAction: { label: 'Xem Gcalls Voicebot AI', path: ROUTES.voicebotAi },
      },
      {
        id: 'giam-sat-chat-luong-cuoc-goi',
        n: '06',
        question: 'Làm sao kiểm soát chất lượng hội thoại khi không thể nghe lại toàn bộ?',
        title: 'Thiết lập giám sát chất lượng cuộc gọi có hỗ trợ AI',
        audience:
          'Doanh nghiệp có bộ phận kiểm soát chất lượng, hoặc có quản lý đang phải tự nghe lại cuộc gọi để đánh giá nhân viên.',
        checkpoints: [
          'Bộ tiêu chí đánh giá hiện có: ai xây dựng, cập nhật lần cuối khi nào, và có được áp dụng thống nhất không.',
          'Tỷ lệ cuộc gọi thực tế đang được nghe lại, và tiêu chí chọn mẫu hiện tại là gì.',
          'Những lỗi hội thoại gây hậu quả lớn nhất cho doanh nghiệp, để ưu tiên khi thiết kế tiêu chí.',
          'Cách kết quả đánh giá được phản hồi cho nhân viên và có gắn với đào tạo hay không.',
          'Ai chịu trách nhiệm kiểm chứng kết quả do hệ thống đưa ra trước khi dùng để đánh giá con người.',
        ],
        related: [{ label: 'QA QC Center', path: ROUTES.qcCenter }],
        nextAction: { label: 'Xem QA QC Center', path: ROUTES.qcCenter },
      },
    ],
    note: 'Các hạng mục ở trên là những gì cần làm rõ, không phải cam kết về phạm vi Gcalls sẽ triển khai. Kết quả khảo sát có thể cho thấy một phần nhu cầu nằm ngoài phạm vi sản phẩm hiện tại, và Gcalls nêu rõ điều đó trong quá trình tư vấn.',
  },

  status: {
    eyebrow: 'ĐỊNH DẠNG NỘI DUNG',
    h2: 'Hướng dẫn nằm trên trang, chưa có bản tải về',
    description:
      'Gcalls chưa phát hành tài liệu hướng dẫn dạng tệp tải về. Trang này không có nút tải, không có biểu mẫu đổi lấy tài liệu, và không hiển thị tên tài liệu chưa tồn tại.',
    points: [
      'Toàn bộ nội dung hướng dẫn hiển thị trực tiếp trên trang, không yêu cầu để lại thông tin để đọc.',
      'Khi một tài liệu được biên soạn và duyệt phát hành, đường dẫn tải sẽ được bổ sung tại đây kèm mô tả nội dung thật.',
      'Các lộ trình dẫn tới trang sản phẩm, giải pháp, theo ngành và liên hệ — tất cả đều là trang đã hoàn thiện.',
    ],
    linksHeading: 'Trang liên quan tới các lộ trình ở trên',
    links: [
      { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
      { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
      { label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling },
      { label: 'Gcalls CX', path: ROUTES.gcallsCx },
      { label: 'QA QC Center', path: ROUTES.qcCenter },
      { label: 'Gcalls Voicebot AI', path: ROUTES.voicebotAi },
    ],
    note: 'Trang Ebook mô tả các chủ đề chuyên sâu đang được chuẩn bị ở dạng tài liệu dài hơn.',
  },

  routing: {
    eyebrow: 'XEM THÊM',
    h2: 'Đi tiếp theo hướng đang quan tâm',
    description:
      'Sau khi xác định được lộ trình phù hợp, đây là những nơi nên xem tiếp.',
    items: [
      {
        title: 'Giải pháp theo ngành',
        detail:
          'Cùng một hệ thống được vận hành khác nhau giữa giáo dục, tài chính, bảo hiểm, bất động sản, thương mại điện tử và dịch vụ thuê ngoài.',
        path: ROUTES.industries,
        cta: 'Xem giải pháp theo ngành',
      },
      {
        title: 'Ước tính chi phí',
        detail:
          'Nhập quy mô đội ngũ, nhu cầu sử dụng và phạm vi tích hợp để xem các yếu tố cấu thành chi phí trước khi nhận báo giá.',
        path: ROUTES.costEstimator,
        cta: 'Ước tính chi phí',
      },
      {
        title: 'Thuật ngữ trong tài liệu',
        detail:
          'Giải thích ngắn gọn các thuật ngữ xuất hiện trong lộ trình: IVR, call flow, Webphone, SLA, API và các khái niệm liên quan.',
        path: ROUTES.glossary,
        cta: 'Xem Glossary',
      },
    ],
  },

  faq: [
    {
      q: 'Có thể tải các hướng dẫn này về không?',
      a: 'Hiện chưa có bản tải về. Toàn bộ nội dung hiển thị trực tiếp trên trang và không yêu cầu để lại thông tin để đọc. Khi Gcalls phát hành tài liệu dạng tệp, đường dẫn tải sẽ được bổ sung tại đây.',
    },
    {
      q: 'Làm theo lộ trình này thì mất bao lâu để triển khai xong?',
      a: 'Không có mốc thời gian chung. Thời gian phụ thuộc vào số người dùng, số hotline, phạm vi tích hợp và mức độ sẵn sàng của hệ thống hiện có. Gcalls đưa ra mốc cụ thể sau bước khảo sát.',
    },
    {
      q: 'Doanh nghiệp nhỏ có cần đi qua toàn bộ các hạng mục đánh giá không?',
      a: 'Không nhất thiết. Mỗi lộ trình liệt kê những gì thường ảnh hưởng tới kết quả triển khai; doanh nghiệp có thể bỏ qua hạng mục không áp dụng cho mình. Điều nên giữ lại là các hạng mục liên quan tới dữ liệu, quyền truy cập và quy định.',
    },
    {
      q: 'Gcalls có hỗ trợ trong quá trình đánh giá không?',
      a: 'Có. Bước khảo sát trong quá trình tư vấn chính là nơi các hạng mục này được làm rõ cùng đội ngũ Gcalls, dựa trên hệ thống và quy trình thực tế của doanh nghiệp.',
      link: { label: 'Đăng ký tư vấn', path: ROUTES.contact },
    },
  ],

  finalCta: {
    eyebrow: 'GUIDES',
    h2: 'Đi qua lộ trình cùng đội ngũ Gcalls',
    description:
      'Chia sẻ hệ thống đang dùng, quy mô đội ngũ và mục tiêu vận hành để Gcalls cùng làm rõ các hạng mục cần đánh giá và đề xuất phạm vi triển khai phù hợp.',
    primaryCta: { label: 'Đăng ký tư vấn theo lộ trình', path: ROUTES.contact },
  },
}
