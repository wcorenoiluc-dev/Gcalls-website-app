/**
 * Approved content for /tai-nguyen/case-studies/ — Checkpoint WEB-RES-001.
 *
 * This page publishes ZERO case studies, and that is the point of it. What it
 * publishes instead is the evidence standard a case study must meet before it
 * appears here — which is itself useful to a reader deciding how much weight to
 * put on anybody's published results.
 *
 * ---------------------------------------------------------------------------
 * ABSOLUTE RESTRICTIONS
 * ---------------------------------------------------------------------------
 *  · No case study, real or illustrative. No "example" narrative that could be
 *    read as a customer.
 *  · No customer quote, no attributed testimonial, no customer logo, no
 *    customer name. Names that appear in supplied planning material are NOT
 *    customer consent and must not be published here.
 *  · No metric, percentage, saving, time-to-value or headcount figure — the
 *    entire point of the standard below is that a number without a measurement
 *    period and a calculation method is not evidence.
 *  · No `Review`, `Rating`, `AggregateRating` or result structured data.
 *
 * The filter dimensions are STRUCTURE, not a working filter: they describe how
 * the library will be organised once entries exist. The page says so, because
 * a filter UI over an empty set implies the set is merely filtered to nothing.
 */

import { ROUTES } from '@/config/navigation'
import type { CaseStudiesContent } from './types'

export const CASE_STUDIES: CaseStudiesContent = {
  id: 'case-studies',
  route: ROUTES.caseStudies,
  breadcrumbLabel: 'Case Studies',
  lead: {
    intent: 'consultation',
    source: 'consultation',
    solution: 'Trao đổi triển khai thực tế',
  },

  hero: {
    eyebrow: 'CASE STUDIES',
    h1: 'Tiêu chuẩn bằng chứng trước khi Gcalls công bố một câu chuyện triển khai',
    description:
      'Trang này chưa công bố case study nào. Thay vì đăng câu chuyện chưa được kiểm chứng hoặc số liệu không nêu được cách đo, Gcalls công khai tiêu chuẩn bằng chứng mà một case study phải đạt được — và chỉ đăng khi đủ điều kiện đó.',
    primaryCta: { label: 'Trao đổi về triển khai thực tế' },
    secondaryCta: {
      label: 'Xem tiêu chuẩn bằng chứng',
      href: '#tieu-chuan-bang-chung',
    },
    microcopy:
      'Không có tên khách hàng, trích dẫn, logo hay số liệu nào được hiển thị trên trang này khi chưa có sự đồng ý và chưa kiểm chứng được cách đo.',
  },

  purpose: {
    eyebrow: 'MỤC ĐÍCH VÀ ĐỐI TƯỢNG',
    h2: 'Dành cho người phải thẩm định một tuyên bố kết quả',
    description:
      'Người đọc case study thường đang cân nhắc một quyết định có chi phí. Điều họ cần không phải là một con số ấn tượng, mà là đủ thông tin để biết con số đó có áp dụng được cho hoàn cảnh của mình hay không.',
    audience: [
      {
        title: 'Người phải trình bày phương án với ban lãnh đạo',
        detail:
          'Cần biết một kết quả được đo trong bao lâu, trên phạm vi nào và tính bằng cách nào, để không dẫn lại một con số không bảo vệ được.',
      },
      {
        title: 'Người phụ trách vận hành đang so sánh nhà cung cấp',
        detail:
          'Cần phân biệt giữa kết quả gắn với một hoàn cảnh cụ thể và tuyên bố chung áp dụng cho mọi doanh nghiệp.',
      },
      {
        title: 'Doanh nghiệp đang dùng Gcalls và cân nhắc chia sẻ câu chuyện',
        detail:
          'Cần biết trước Gcalls sẽ hỏi những gì, công bố những gì và doanh nghiệp giữ quyền quyết định tới đâu.',
      },
    ],
    note: 'Tiêu chuẩn dưới đây áp dụng cho mọi nội dung Gcalls công bố, không chỉ cho case study.',
  },

  whyEvidence: {
    eyebrow: 'VÌ SAO CẦN BẰNG CHỨNG VẬN HÀNH',
    h2: 'Một con số không kèm cách đo thì không nói lên điều gì',
    description:
      'Phần lớn tuyên bố kết quả trong ngành phần mềm doanh nghiệp thiếu ba thông tin khiến chúng có thể kiểm chứng được: đo trên phạm vi nào, trong bao lâu, và so với trạng thái ban đầu ra sao.',
    items: [
      {
        title: 'Không có trạng thái ban đầu thì không có thay đổi',
        detail:
          'Một cải thiện chỉ có nghĩa khi biết điểm xuất phát. Nếu doanh nghiệp không đo lường trước khi triển khai, kết quả sau đó không quy được cho nguyên nhân nào.',
      },
      {
        title: 'Phạm vi triển khai quyết định khả năng áp dụng',
        detail:
          'Kết quả của một nhóm mười người trong một chiến dịch ngắn không suy ra được cho một trung tâm dịch vụ khách hàng vận hành liên tục.',
      },
      {
        title: 'Cách tính phải nêu được, nếu không thì chỉ là ấn tượng',
        detail:
          'Cùng một chỉ số có thể được tính theo nhiều cách cho ra kết quả rất khác nhau. Nếu không nêu được cách tính, con số không nên được công bố.',
      },
      {
        title: 'Quyền của khách hàng đứng trên nhu cầu tiếp thị',
        detail:
          'Tên doanh nghiệp, logo và phát biểu của người đại diện là tài sản của khách hàng. Không có văn bản đồng ý thì không công bố, kể cả khi thông tin đó có thật.',
      },
    ],
    note: 'Đây cũng là lý do các trang khác trên website này không công bố tỷ lệ cải thiện, mức tiết kiệm hay thời gian triển khai cố định: những số liệu đó chưa đạt tiêu chuẩn ở phần dưới.',
  },

  filters: {
    eyebrow: 'CẤU TRÚC THƯ VIỆN',
    h2: 'Case study sẽ được phân loại theo năm chiều',
    description:
      'Năm chiều dưới đây là cấu trúc phân loại đã được xác định cho thư viện case study. Đây là mô tả cấu trúc, không phải bộ lọc đang hoạt động — chưa có mục nào để lọc.',
    anchorId: 'cau-truc-thu-vien',
    items: [
      {
        id: 'nganh',
        title: 'Ngành',
        detail:
          'Đặc thù vận hành theo ngành ảnh hưởng trực tiếp tới cách hệ thống được cấu hình và tới ý nghĩa của kết quả.',
        values: [
          'Giáo dục',
          'Tài chính',
          'Bảo hiểm',
          'Bất động sản',
          'Thương mại điện tử',
          'Dịch vụ thuê ngoài (BPO)',
        ],
      },
      {
        id: 'bai-toan',
        title: 'Bài toán vận hành',
        detail:
          'Vấn đề doanh nghiệp cần giải quyết khi bắt đầu, phát biểu theo ngôn ngữ vận hành chứ không theo tên tính năng.',
        values: [
          'Hoạt động gọi ra phân tán',
          'Lịch sử liên hệ không đầy đủ',
          'Yêu cầu khách hàng thất lạc giữa các kênh',
          'Không kiểm soát được chất lượng hội thoại',
          'Liên lạc với khách hàng ở thị trường nước ngoài',
        ],
      },
      {
        id: 'giai-phap',
        title: 'Giải pháp Gcalls',
        detail:
          'Sản phẩm và cấu hình thực tế được triển khai, để người đọc biết kết quả gắn với phạm vi nào.',
        values: [
          'Gcalls Plus Webphone',
          'Gcalls CX',
          'QA QC Center',
          'Gcalls Voicebot AI',
          'Tổng đài quốc tế',
        ],
      },
      {
        id: 'nen-tang-tich-hop',
        title: 'Nền tảng tích hợp',
        detail:
          'Hệ thống doanh nghiệp đang dùng mà tổng đài được kết nối tới, vì phạm vi tích hợp phụ thuộc vào nền tảng cụ thể.',
        values: [
          'HubSpot',
          'Salesforce',
          'Zoho CRM',
          'Freshdesk',
          'Zendesk',
          'Hệ thống nội bộ qua API',
        ],
      },
      {
        id: 'loai-ket-qua',
        title: 'Loại kết quả',
        detail:
          'Nhóm kết quả được ghi nhận. Mỗi mục công bố sẽ kèm kỳ đo và cách tính, không đứng một mình dưới dạng con số.',
        values: [
          'Thay đổi trong cách tổ chức công việc',
          'Mức độ đầy đủ của dữ liệu liên hệ',
          'Khả năng giám sát của quản lý',
          'Phạm vi kiểm soát chất lượng hội thoại',
        ],
      },
    ],
    note: 'Chưa có case study nào được phân loại theo cấu trúc này. Giao diện lọc chỉ được bổ sung khi thư viện có nội dung thật, để tránh tạo cảm giác đang có nội dung bị lọc mất.',
  },

  standard: {
    eyebrow: 'TIÊU CHUẨN BẰNG CHỨNG',
    h2: 'Tám điều kiện bắt buộc trước khi một case study được công bố',
    description:
      'Một câu chuyện triển khai chỉ được đăng khi đủ cả tám điều kiện dưới đây. Thiếu bất kỳ điều kiện nào, nội dung không được công bố — kể cả khi kết quả có lợi cho Gcalls.',
    anchorId: 'tieu-chuan-bang-chung',
    items: [
      {
        n: '01',
        title: 'Khách hàng đồng ý bằng văn bản',
        detail:
          'Doanh nghiệp được nêu trong nội dung đã đọc bản thảo và đồng ý công bố. Đồng ý bằng lời trong một cuộc trao đổi không đủ.',
      },
      {
        n: '02',
        title: 'Phạm vi triển khai được nêu rõ',
        detail:
          'Số người dùng, bộ phận tham gia, sản phẩm và cấu hình được triển khai. Nếu chỉ áp dụng cho một nhóm, nội dung phải nói rõ là một nhóm.',
      },
      {
        n: '03',
        title: 'Trạng thái ban đầu được ghi nhận',
        detail:
          'Doanh nghiệp đang làm việc thế nào trước khi triển khai, và chỉ số nào được đo tại thời điểm đó.',
      },
      {
        n: '04',
        title: 'Kỳ đo lường được xác định',
        detail:
          'Khoảng thời gian kết quả được đo, nêu cụ thể từ khi nào tới khi nào, thay vì một mốc thời gian chung chung.',
      },
      {
        n: '05',
        title: 'Cách tính được mô tả',
        detail:
          'Công thức hoặc phương pháp tính từng chỉ số, kèm nguồn dữ liệu dùng để tính. Nếu không mô tả được, chỉ số đó không được công bố.',
      },
      {
        n: '06',
        title: 'Kết quả được đối chiếu với dữ liệu',
        detail:
          'Con số công bố khớp với dữ liệu hệ thống hoặc báo cáo do doanh nghiệp cung cấp, và được cả hai bên xác nhận.',
      },
      {
        n: '07',
        title: 'Trích dẫn được người phát biểu duyệt',
        detail:
          'Mọi phát biểu phải do người thật nói, được ghi nhận đầy đủ và được chính người đó duyệt nội dung cùng chức danh trước khi đăng.',
      },
      {
        n: '08',
        title: 'Quyền sử dụng danh tính được cấp riêng',
        detail:
          'Việc nêu tên doanh nghiệp và sử dụng logo là một quyền riêng, phải được cấp riêng. Không có quyền này, case study được công bố ở dạng ẩn danh hoặc không công bố.',
      },
    ],
    note: 'Tiêu chuẩn này áp dụng cả cho nội dung ẩn danh: một câu chuyện không nêu tên khách hàng vẫn phải có đủ phạm vi, kỳ đo và cách tính thì mới được công bố.',
  },

  status: {
    eyebrow: 'TRẠNG THÁI THU THẬP',
    h2: 'Thư viện case study đang trong giai đoạn thu thập bằng chứng',
    description:
      'Gcalls đang làm việc với các doanh nghiệp đang sử dụng hệ thống để chuẩn bị nội dung theo tiêu chuẩn trên. Trước khi hoàn tất, trang này không hiển thị bất kỳ nội dung mô phỏng nào.',
    points: [
      'Không có tên khách hàng, logo, trích dẫn hay số liệu nào được hiển thị, vì chưa có nội dung nào hoàn tất đủ tám điều kiện.',
      'Tên doanh nghiệp xuất hiện trong tài liệu nội bộ hoặc tài liệu giới thiệu không được xem là sự đồng ý công bố, và không được đăng tại đây.',
      'Trang này không phát sinh dữ liệu có cấu trúc dạng đánh giá, xếp hạng hay kết quả, vì không có kết quả nào được công bố.',
    ],
    linksHeading: 'Trong lúc chờ, có thể xem cách Gcalls trình bày phạm vi năng lực',
    links: [
      { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
      { label: 'Gcalls CX', path: ROUTES.gcallsCx },
      { label: 'QA QC Center', path: ROUTES.qcCenter },
      { label: 'Giải pháp theo ngành', path: ROUTES.industries },
      { label: 'Guides — lộ trình đánh giá', path: ROUTES.guides },
    ],
    note: 'Doanh nghiệp đang dùng Gcalls và muốn chia sẻ câu chuyện triển khai có thể liên hệ để bắt đầu quy trình duyệt nội dung. Doanh nghiệp giữ quyền quyết định ở mọi bước, kể cả sau khi đã duyệt bản thảo.',
  },

  routing: {
    eyebrow: 'XEM THÊM',
    h2: 'Những nơi có thể đánh giá Gcalls mà không cần case study',
    description:
      'Khi chưa có bằng chứng từ khách hàng, cách đánh giá hợp lý là xem phạm vi năng lực được trình bày và đối chiếu với hệ thống hiện tại của doanh nghiệp.',
    items: [
      {
        title: 'Phạm vi năng lực theo sản phẩm',
        detail:
          'Mỗi trang sản phẩm nêu rõ sản phẩm làm được gì, không làm gì và ranh giới với các sản phẩm còn lại.',
        path: ROUTES.products,
        cta: 'Xem tất cả sản phẩm',
      },
      {
        title: 'Khả năng tích hợp theo nền tảng',
        detail:
          'Mỗi nền tảng có trang riêng mô tả phạm vi kết nối thực tế, thay vì một tuyên bố tương thích chung.',
        path: ROUTES.integrations,
        cta: 'Xem các nền tảng tích hợp',
      },
      {
        title: 'Lộ trình tự đánh giá trước khi quyết định',
        detail:
          'Sáu lộ trình liệt kê những hạng mục doanh nghiệp nên làm rõ trước khi chọn phương án hoặc yêu cầu báo giá.',
        path: ROUTES.guides,
        cta: 'Xem Guides',
      },
    ],
  },

  faq: [
    {
      q: 'Vì sao trang này không có case study nào?',
      a: 'Vì chưa có nội dung nào hoàn tất đủ tám điều kiện bằng chứng ở trên, bao gồm sự đồng ý bằng văn bản của khách hàng và khả năng nêu được cách tính cho mọi con số công bố. Gcalls chọn để trống thay vì đăng nội dung chưa kiểm chứng.',
    },
    {
      q: 'Gcalls có khách hàng thật không?',
      a: 'Có. Điều chưa có là quyền công bố và bộ bằng chứng đầy đủ theo tiêu chuẩn trên. Danh tính khách hàng chỉ được nêu khi doanh nghiệp đó đồng ý bằng văn bản, nên việc trang này để trống không phản ánh số lượng khách hàng.',
    },
    {
      q: 'Doanh nghiệp muốn chia sẻ câu chuyện triển khai thì bắt đầu thế nào?',
      a: 'Liên hệ với đội ngũ Gcalls để bắt đầu quy trình. Gcalls sẽ thống nhất phạm vi thông tin được công bố, cùng xác định chỉ số và cách đo, gửi bản thảo để doanh nghiệp duyệt, và chỉ đăng sau khi có văn bản đồng ý.',
      link: { label: 'Liên hệ Gcalls', path: ROUTES.contact },
    },
    {
      q: 'Case study được đăng có thể ẩn danh không?',
      a: 'Có. Nếu doanh nghiệp không muốn nêu tên, nội dung được công bố ở dạng ẩn danh với mô tả ngành và quy mô. Các điều kiện còn lại về phạm vi, kỳ đo và cách tính vẫn áp dụng đầy đủ.',
    },
  ],

  finalCta: {
    eyebrow: 'CASE STUDIES',
    h2: 'Trao đổi về một triển khai thực tế',
    description:
      'Nếu doanh nghiệp muốn tìm hiểu Gcalls được triển khai như thế nào trong hoàn cảnh tương tự, hoặc muốn chia sẻ câu chuyện của chính mình, hãy trao đổi trực tiếp với đội ngũ Gcalls.',
    primaryCta: { label: 'Trao đổi về triển khai thực tế', path: ROUTES.contact },
  },
}
