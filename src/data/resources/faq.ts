/**
 * Approved content for /tai-nguyen/faq/ — Checkpoint WEB-RES-001.
 *
 * Twenty-one questions in six groups. The FAQPage JSON-LD is generated from THIS
 * array, so every question and answer below appears verbatim in the DOM and the
 * two cannot drift.
 *
 * ---------------------------------------------------------------------------
 * ANSWER RULES
 * ---------------------------------------------------------------------------
 *  · Separate CAPABILITY from AVAILABILITY. "Gcalls kết nối được với CRM" is a
 *    capability statement; whether it works with the reader's CRM, at their
 *    version, for the data they need, is a deployment question and the answer
 *    must say so.
 *  · Never claim universal integration compatibility. Every integration answer
 *    is bounded by what the third-party platform's API allows.
 *  · Never say AI replaces staff. AI supports review and handles scripted
 *    calls; the conclusion about a person stays with a person.
 *  · International availability depends on the destination country, its
 *    regulator and the documents the business can supply — never a country
 *    count, never a blanket yes.
 *  · Voice Brandname depends on carrier approval, and Gcalls has published no
 *    carrier list or market scope. The answer says exactly that.
 *  · No guaranteed outcome, saving, uptime, accuracy or deployment duration.
 *    Where a reader expects a number, the answer explains what the number
 *    depends on instead.
 *  · Route to a completed page wherever one owns the topic.
 */

import { ROUTES } from '@/config/navigation'
import type { FaqContent } from './types'

export const FAQ: FaqContent = {
  id: 'faq',
  route: ROUTES.faq,
  breadcrumbLabel: 'FAQ',
  lead: {
    intent: 'consultation',
    source: 'consultation',
    solution: 'Tư vấn giải pháp',
  },

  hero: {
    eyebrow: 'FAQ GCALLS',
    h1: 'Câu hỏi thường gặp về giải pháp, tích hợp và triển khai Gcalls',
    description:
      'Hai mươi mốt câu hỏi được tổng hợp từ những gì doanh nghiệp hỏi nhiều nhất trong quá trình tìm hiểu. Câu trả lời nêu rõ điều gì là năng lực chung của hệ thống và điều gì phụ thuộc vào hệ thống, quy mô hoặc quy định của từng doanh nghiệp.',
    primaryCta: { label: 'Đăng ký tư vấn giải pháp' },
    secondaryCta: { label: 'Xem sáu nhóm câu hỏi', href: '#nhom-cau-hoi' },
    microcopy:
      'Mỗi trang sản phẩm và giải pháp đều có phần câu hỏi riêng theo chủ đề, thường là nơi trả lời chi tiết hơn cho một sản phẩm cụ thể.',
  },

  purpose: {
    eyebrow: 'MỤC ĐÍCH VÀ ĐỐI TƯỢNG',
    h2: 'Trả lời trước những câu hỏi thường xuất hiện ở cuộc gọi tư vấn đầu tiên',
    description:
      'Trang này dành cho người đang tìm hiểu và muốn tự trả lời phần lớn câu hỏi trước khi trao đổi với đội ngũ kinh doanh, để cuộc trao đổi sau đó tập trung vào bối cảnh riêng của doanh nghiệp.',
    audience: [
      {
        title: 'Doanh nghiệp đang tìm hiểu lần đầu',
        detail:
          'Cần biết Gcalls có những sản phẩm nào, khác nhau ra sao và sản phẩm nào phù hợp với bài toán hiện tại.',
      },
      {
        title: 'Người phụ trách hệ thống đang thẩm định kỹ thuật',
        detail:
          'Cần biết phạm vi tích hợp, cách dữ liệu được đồng bộ và những gì phụ thuộc vào nền tảng bên thứ ba.',
      },
      {
        title: 'Doanh nghiệp đang chuẩn bị mở rộng phạm vi sử dụng',
        detail:
          'Cần biết những gì thay đổi khi tăng số người dùng, thêm kênh, thêm thị trường hoặc thêm yêu cầu kiểm soát chất lượng.',
      },
    ],
    note: 'Nếu câu hỏi của bạn không có ở đây, hoặc phụ thuộc vào hệ thống cụ thể doanh nghiệp đang dùng, hãy gửi trực tiếp cho đội ngũ Gcalls.',
  },

  index: {
    eyebrow: 'DANH MỤC',
    h2: 'Sáu nhóm câu hỏi',
    description: 'Chọn một nhóm để chuyển tới phần tương ứng.',
    anchorId: 'nhom-cau-hoi',
  },

  groups: [
    {
      id: 'chon-giai-phap',
      label: 'Chọn giải pháp',
      description:
        'Phân biệt các sản phẩm và xác định đâu là điểm bắt đầu phù hợp với bài toán hiện tại.',
      items: [
        {
          q: 'Gcalls có những sản phẩm nào và khác nhau ở đâu?',
          a: 'Gcalls có bốn sản phẩm giải quyết bốn bài toán khác nhau: Gcalls Plus Webphone là kênh nghe gọi và quản lý hoạt động cuộc gọi trên trình duyệt; QA QC Center hỗ trợ đánh giá chất lượng hội thoại; Gcalls CX là nền tảng chăm sóc khách hàng đa kênh; Gcalls Voicebot AI dành cho các cuộc gọi lặp lại theo kịch bản. Đây không phải bốn mức giá của cùng một sản phẩm — chúng trả lời những câu hỏi khác nhau và có thể dùng độc lập hoặc kết hợp.',
          link: { label: 'Xem tất cả sản phẩm', path: ROUTES.products },
        },
        {
          q: 'Doanh nghiệp nhỏ có phù hợp với Gcalls không?',
          a: 'Yếu tố quyết định không phải quy mô doanh nghiệp mà là cách đội ngũ đang liên lạc với khách hàng. Nếu nhiều người cùng gọi ra hoặc nhận cuộc gọi, và doanh nghiệp cần lịch sử liên hệ không nằm rải rác trên máy cá nhân, thì hệ thống tập trung đã có ích. Cấu hình phù hợp cho một đội nhỏ được xác định theo số người dùng và nhu cầu thực tế.',
          link: { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
        },
        {
          q: 'Nên bắt đầu từ sản phẩm nào?',
          a: 'Thông thường nên bắt đầu từ bài toán gây khó nhất hiện tại. Nếu vấn đề nằm ở việc gọi và ghi nhận thông tin, điểm bắt đầu là Gcalls Plus. Nếu vấn đề là dữ liệu khách hàng và cuộc gọi tách rời nhau, điểm bắt đầu là tích hợp CRM. Nếu vấn đề là yêu cầu khách hàng đến từ nhiều kênh, điểm bắt đầu là Gcalls CX. Nếu vấn đề là không kiểm soát được chất lượng hội thoại, điểm bắt đầu là QA QC Center.',
          link: { label: 'Xem sáu lộ trình đánh giá', path: ROUTES.guides },
        },
        {
          q: 'Chi phí được tính như thế nào?',
          a: 'Chi phí phụ thuộc vào sản phẩm, số người dùng, số hotline, lưu lượng sử dụng và phạm vi tích hợp. Trang bảng giá trình bày các yếu tố cấu thành, còn công cụ ước tính giúp doanh nghiệp chuẩn bị cấu hình trước khi nhận báo giá chính thức. Báo giá cuối cùng được đưa ra sau khi xác định phạm vi triển khai.',
          link: { label: 'Xem bảng giá', path: ROUTES.pricing },
        },
      ],
    },
    {
      id: 'tich-hop',
      label: 'Tích hợp CRM và Helpdesk',
      description:
        'Phạm vi kết nối giữa hoạt động nghe gọi và các hệ thống doanh nghiệp đang sử dụng.',
      items: [
        {
          q: 'Gcalls tích hợp được với mọi CRM không?',
          a: 'Không. Khả năng tích hợp phụ thuộc vào API mà nền tảng CRM đó cung cấp, phiên bản và gói dịch vụ doanh nghiệp đang dùng, cùng quyền truy cập được cấp. Gcalls đã triển khai với một số nền tảng phổ biến và mỗi nền tảng có trang riêng mô tả phạm vi thực tế. Với hệ thống không nằm trong danh sách đó, cần một bước đánh giá kỹ thuật trước khi kết luận.',
          link: { label: 'Xem các nền tảng tích hợp', path: ROUTES.integrations },
        },
        {
          q: 'Tích hợp thì dữ liệu nào được đồng bộ?',
          a: 'Thường gồm hai hướng: hiển thị thông tin khách hàng khi có cuộc gọi, và ghi thông tin cuộc gọi — thời điểm, thời lượng, người thực hiện, kết quả, ghi chú — về đúng hồ sơ. Trường dữ liệu cụ thể, chiều đồng bộ và tần suất được xác định theo khả năng của nền tảng đích và thống nhất trong quá trình triển khai, không áp dụng một cấu hình mặc định.',
          link: { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
        },
        {
          q: 'Doanh nghiệp dùng hệ thống tự phát triển thì tích hợp được không?',
          a: 'Có thể, nếu hệ thống đó có API cho phép đọc và ghi dữ liệu cần thiết, hoặc doanh nghiệp có nguồn lực phát triển để nhúng chức năng nghe gọi vào ứng dụng của mình. Đây là trường hợp bắt buộc phải đánh giá kỹ thuật riêng: phạm vi khả thi phụ thuộc vào thiết kế của hệ thống nội bộ đó.',
        },
        {
          q: 'Tích hợp có làm thay đổi quy trình hiện tại của nhân viên không?',
          a: 'Có, ở mức thao tác. Mục tiêu thường là giảm số bước thủ công — gọi trực tiếp từ giao diện đang dùng, không phải nhập lại thông tin sau cuộc gọi. Mức độ thay đổi và nhu cầu hướng dẫn lại cho đội ngũ được xác định khi khảo sát quy trình hiện tại.',
          link: { label: 'Xem lộ trình lập kế hoạch tích hợp', path: ROUTES.guides },
        },
      ],
    },
    {
      id: 'goi-quoc-te',
      label: 'Gọi quốc tế',
      description:
        'Đầu số theo quốc gia, điều kiện đăng ký và cách tổ chức liên lạc xuyên biên giới.',
      items: [
        {
          q: 'Gcalls cung cấp được đầu số ở những quốc gia nào?',
          a: 'Khả năng cung cấp số được xác nhận theo từng quốc gia và từng trường hợp, vì điều kiện cấp số do cơ quan quản lý viễn thông của quốc gia đó quy định. Một số thị trường yêu cầu doanh nghiệp có pháp nhân hoặc địa chỉ tại nước sở tại, một số thị trường yêu cầu hồ sơ bổ sung. Hãy nêu danh sách quốc gia cần triển khai khi liên hệ để được xác nhận cụ thể.',
          link: { label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling },
        },
        {
          q: 'Cần chuẩn bị hồ sơ gì để đăng ký số quốc tế?',
          a: 'Yêu cầu hồ sơ khác nhau theo từng quốc gia và có thể thay đổi theo quy định hiện hành. Các nhóm hồ sơ thường gặp gồm giấy tờ pháp lý của doanh nghiệp, xác nhận địa chỉ và mô tả mục đích sử dụng. Danh sách chính xác được cung cấp sau khi xác định thị trường cần triển khai.',
        },
        {
          q: 'Cuộc gọi ra có hiển thị tên thương hiệu thay vì dãy số không?',
          a: 'Việc hiển thị tên thương hiệu khi gọi là dịch vụ do nhà mạng cung cấp và phê duyệt, nên điều kiện đăng ký, phạm vi áp dụng và thời gian xử lý do nhà mạng quyết định. Gcalls chưa công bố danh sách nhà mạng hay phạm vi thị trường cho dịch vụ này, nên khả năng áp dụng cho một doanh nghiệp cụ thể cần được xác nhận riêng trước khi đưa vào kế hoạch, và không mặc định áp dụng cho đầu số quốc tế.',
          link: { label: 'Xem giải thích thuật ngữ', path: ROUTES.glossary },
        },
      ],
    },
    {
      id: 'da-kenh',
      label: 'Vận hành đa kênh',
      description:
        'Hợp nhất hội thoại từ hotline, Zalo, Facebook, email và SMS trong một luồng làm việc.',
      items: [
        {
          q: 'Gcalls CX khác gì với việc mở nhiều công cụ cùng lúc?',
          a: 'Khác biệt nằm ở chỗ lịch sử khách hàng có được chia sẻ giữa các kênh hay không. Khi mỗi kênh là một công cụ riêng, nhân viên phải tự ghép thông tin và khách hàng thường phải kể lại từ đầu khi đổi kênh. Mô hình hợp nhất đưa các kênh đã kết nối vào cùng một luồng công việc, nên ngữ cảnh được giữ lại.',
          link: { label: 'Xem Gcalls CX', path: ROUTES.gcallsCx },
        },
        {
          q: 'Những kênh nào có thể được kết nối?',
          a: 'Các kênh được kết nối trong một triển khai cụ thể được xác định theo nhu cầu của doanh nghiệp và điều kiện kỹ thuật của từng nền tảng, vì mỗi nền tảng có quy định riêng về cách kết nối và loại tài khoản được phép. Danh sách kênh áp dụng cho doanh nghiệp được xác nhận trong quá trình khảo sát.',
        },
        {
          q: 'Doanh nghiệp đã dùng phần mềm quản lý ticket thì có cần Gcalls CX không?',
          a: 'Không nhất thiết. Nếu phần mềm hiện tại đã đáp ứng việc quản lý yêu cầu và điều còn thiếu chỉ là cuộc gọi gắn với ticket, thì hướng phù hợp hơn thường là tích hợp tổng đài với helpdesk đang dùng. Gcalls CX phù hợp khi bài toán nằm ở lớp vận hành đa kênh rộng hơn kênh thoại đơn thuần.',
          link: {
            label: 'Tổng đài tích hợp Helpdesk',
            path: ROUTES.helpdeskIntegration,
          },
        },
      ],
    },
    {
      id: 'voicebot-ai-qc',
      label: 'Voicebot và AI QC',
      description:
        'Vai trò và giới hạn của tự động hóa cuộc gọi và đánh giá chất lượng có hỗ trợ AI.',
      items: [
        {
          q: 'Voicebot có thay thế nhân viên không?',
          a: 'Không. Voicebot phù hợp với những cuộc gọi lặp lại theo kịch bản cố định như nhắc lịch, xác nhận thông tin hoặc sàng lọc nhu cầu. Những tình huống cần tư vấn, xử lý khiếu nại hoặc ra cam kết vẫn do nhân viên thực hiện, và một triển khai có trách nhiệm luôn định nghĩa rõ điều kiện chuyển cuộc gọi cho nhân viên khi vượt ngoài kịch bản.',
          link: { label: 'Xem Gcalls Voicebot AI', path: ROUTES.voicebotAi },
        },
        {
          q: 'Kết quả đánh giá chất lượng của AI có chính xác không?',
          a: 'Kết quả phân tích tự động phụ thuộc vào chất lượng âm thanh, giọng vùng miền, tiếng ồn nền và độ rõ ràng của bộ tiêu chí, nên nên được xem là dữ liệu hỗ trợ để khoanh vùng cuộc gọi cần xem lại. Gcalls không công bố mức độ chính xác, và mọi kết luận dùng để đánh giá nhân sự vẫn cần người kiểm chứng.',
          link: { label: 'Xem QA QC Center', path: ROUTES.qcCenter },
        },
        {
          q: 'Cần chuẩn bị gì trước khi áp dụng đánh giá chất lượng có hỗ trợ AI?',
          a: 'Điều quan trọng nhất là bộ tiêu chí đánh giá: tiêu chí mơ hồ sẽ cho kết quả không dùng được, dù chấm bằng người hay bằng công cụ. Trước khi triển khai, doanh nghiệp nên xác định những lỗi hội thoại gây hậu quả lớn nhất, cách phản hồi kết quả cho nhân viên và ai chịu trách nhiệm kiểm chứng kết quả.',
          link: { label: 'Xem lộ trình giám sát chất lượng', path: ROUTES.guides },
        },
      ],
    },
    {
      id: 'trien-khai-bao-mat',
      label: 'Triển khai, bảo mật và hỗ trợ',
      description:
        'Quá trình đưa hệ thống vào vận hành và những gì diễn ra sau khi hệ thống chạy.',
      items: [
        {
          q: 'Triển khai mất bao lâu?',
          a: 'Không có mốc thời gian chung. Thời gian phụ thuộc vào số người dùng, số hotline, phạm vi tích hợp với hệ thống hiện có và mức độ sẵn sàng của dữ liệu. Gcalls đưa ra mốc thời gian cụ thể sau bước khảo sát, thay vì áp dụng một thời hạn cố định cho mọi doanh nghiệp.',
        },
        {
          q: 'Cần chuẩn bị hạ tầng gì tại doanh nghiệp?',
          a: 'Vì hệ thống hoạt động trên trình duyệt, điều kiện quan trọng nhất là chất lượng và độ ổn định của đường truyền Internet tại từng nơi làm việc, cùng thiết bị nghe gọi phù hợp cho nhân viên. Yêu cầu cụ thể được xác nhận khi khảo sát địa điểm và cách làm việc của đội ngũ.',
        },
        {
          q: 'Dữ liệu cuộc gọi và thông tin khách hàng được xử lý thế nào?',
          a: 'Phạm vi dữ liệu được thu thập, nơi lưu trữ, thời gian lưu và quyền truy cập của từng nhóm người dùng được xác định theo cấu hình triển khai và thống nhất trong hợp đồng dịch vụ. Nếu doanh nghiệp thuộc lĩnh vực có quy định riêng về lưu trữ và xử lý dữ liệu, hãy nêu yêu cầu đó ngay từ bước khảo sát.',
        },
        {
          q: 'Sau khi triển khai thì được hỗ trợ như thế nào?',
          a: 'Phạm vi hỗ trợ, kênh tiếp nhận và mức cam kết dịch vụ áp dụng cho một doanh nghiệp được thống nhất trong hợp đồng theo phạm vi triển khai đã xác định. Nếu doanh nghiệp có yêu cầu cụ thể về thời gian phản hồi hoặc hỗ trợ ngoài giờ, đây là hạng mục cần nêu trước khi ký kết.',
          link: { label: 'Liên hệ Gcalls', path: ROUTES.contact },
        },
      ],
    },
  ],

  note: 'Câu trả lời trên mô tả cách hệ thống hoạt động ở mức chung. Những nội dung phụ thuộc vào nền tảng doanh nghiệp đang dùng, quy định áp dụng cho ngành hoặc thị trường triển khai đều cần được xác nhận riêng trong quá trình khảo sát.',

  routing: {
    eyebrow: 'XEM THÊM',
    h2: 'Câu hỏi theo từng chủ đề cụ thể',
    description:
      'Mỗi trang sản phẩm và giải pháp có phần câu hỏi riêng đi sâu hơn vào chủ đề của trang đó.',
    items: [
      {
        title: 'Sản phẩm Gcalls',
        detail:
          'Ranh giới giữa Gcalls Plus, QA QC Center, Gcalls CX và Gcalls Voicebot AI, kèm câu hỏi riêng của từng sản phẩm.',
        path: ROUTES.products,
        cta: 'Xem tất cả sản phẩm',
      },
      {
        title: 'Giải pháp tích hợp',
        detail:
          'Câu hỏi về phạm vi kết nối với CRM, Helpdesk, hệ thống bán hàng và các nền tảng cụ thể.',
        path: ROUTES.solutions,
        cta: 'Xem tất cả giải pháp',
      },
      {
        title: 'Giải pháp theo ngành',
        detail:
          'Câu hỏi gắn với đặc thù vận hành của giáo dục, tài chính, bảo hiểm, bất động sản, thương mại điện tử và dịch vụ thuê ngoài.',
        path: ROUTES.industries,
        cta: 'Xem giải pháp theo ngành',
      },
    ],
  },

  finalCta: {
    eyebrow: 'FAQ',
    h2: 'Câu hỏi của bạn chưa có trong danh sách?',
    description:
      'Gửi câu hỏi kèm bối cảnh doanh nghiệp — hệ thống đang dùng, quy mô đội ngũ và mục tiêu vận hành — để đội ngũ Gcalls trả lời đúng trường hợp của bạn.',
    primaryCta: { label: 'Đăng ký tư vấn giải pháp', path: ROUTES.contact },
  },
}
