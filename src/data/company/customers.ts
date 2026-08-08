/**
 * Approved content for /cong-ty/khach-hang/ — Checkpoint WEB-COMPANY-001.
 *
 * This page publishes NO customer. Not a name, not a logo, not a text-only
 * stand-in for a logo, not a quote, not a metric, not an anonymised story
 * specific enough to identify anyone. This repository contains no permission
 * record for any customer, and a name appearing in a supplied planning source
 * is not permission — see the permission guard in `./types.ts`.
 *
 * What replaces the customer wall is the thing a visitor actually wants from
 * one: a way to judge whether Gcalls fits how their own team works. Operational
 * profiles do that honestly, require nobody's consent, and are more useful than
 * a grid of marks a reader cannot map onto their own situation.
 *
 * CLAIM GUARD: no ROI figure from the ICP table appears here — not "2.5%", not
 * "30–50%", not "40%", not "50–90%". The working model describes PHASES and
 * never durations, so "cài đặt trong 30 phút" and "triển khai trong một ngày"
 * have nowhere to appear.
 */

import { ROUTES } from '@/config/navigation'
import type { CustomersContent } from './types'

export const CUSTOMERS: CustomersContent = {
  id: 'customers',
  route: ROUTES.customers,
  breadcrumbLabel: 'Khách hàng',
  lead: {
    intent: 'consultation',
    source: 'consultation',
    solution: 'Tư vấn phù hợp giải pháp',
  },

  hero: {
    eyebrow: 'KHÁCH HÀNG CỦA GCALLS',
    h1: 'Gcalls được xây dựng cho những đội ngũ làm việc bằng cuộc gọi mỗi ngày',
    description:
      'Thay vì trưng ra một dãy logo mà bạn không đối chiếu được với hoàn cảnh của mình, trang này mô tả các mô hình vận hành mà Gcalls phục vụ: đội ngũ làm việc ra sao, dữ liệu nằm ở đâu, và vấn đề thường phát sinh ở chỗ nào.',
    primaryCta: { label: 'Đăng ký tư vấn cho đội ngũ của bạn' },
    secondaryCta: { label: 'Xem các mô hình vận hành', href: '#nhom-khach-hang' },
    microcopy:
      'Trang này chưa công bố tên hay logo khách hàng nào. Danh tính và kết quả của một doanh nghiệp chỉ được đăng sau khi doanh nghiệp đó đồng ý bằng văn bản.',
  },

  purpose: {
    eyebrow: 'MỤC ĐÍCH VÀ ĐỐI TƯỢNG',
    h2: 'Để bạn tự trả lời câu hỏi "Gcalls có hợp với đội của mình không?"',
    description:
      'Trang này viết cho thời điểm bạn đang cân nhắc, chưa muốn nói chuyện với đội kinh doanh, và cần một cách đối chiếu Gcalls với cách đội ngũ mình đang làm việc.',
    audience: [
      {
        title: 'Doanh nghiệp đang đánh giá mức độ phù hợp',
        detail:
          'Cần biết Gcalls được thiết kế cho kiểu vận hành nào, và quan trọng không kém: kiểu vận hành nào thì chưa cần tới nó.',
      },
      {
        title: 'Người phụ trách vận hành đội nghe gọi',
        detail:
          'Cần so sánh cách đội mình đang phân bổ cuộc gọi, ghi nhận thông tin và bàn giao khách hàng với các mô hình được mô tả ở đây.',
      },
      {
        title: 'Người chuẩn bị đề xuất nội bộ',
        detail:
          'Cần hiểu quá trình làm việc với Gcalls gồm những bước nào để dự trù nguồn lực và thời gian của các bộ phận liên quan.',
      },
      {
        title: 'Doanh nghiệp đang dùng Gcalls',
        detail:
          'Cần biết Gcalls sẽ hỏi những gì và công bố những gì nếu bạn cân nhắc chia sẻ câu chuyện triển khai của mình.',
      },
    ],
    note: 'Trang này không thay thế bước khảo sát. Mức độ phù hợp thực tế phụ thuộc vào hệ thống hiện có, quy mô đội ngũ và quy định áp dụng cho từng doanh nghiệp.',
  },

  serves: {
    eyebrow: 'GCALLS PHỤC VỤ AI',
    h2: 'Điều kiện khiến một doanh nghiệp thật sự cần tới Gcalls',
    description:
      'Yếu tố quyết định không phải quy mô doanh nghiệp mà là cách hoạt động liên hệ khách hàng đang được tổ chức. Bốn dấu hiệu dưới đây là những gì thường xuất hiện trước khi một doanh nghiệp cần hệ thống tập trung.',
    items: [
      {
        title: 'Nhiều người cùng nghe gọi khách hàng',
        detail:
          'Khi hoạt động gọi không còn nằm ở một người, việc phân bổ cuộc gọi, theo dõi trạng thái trực và biết ai đã nói gì với khách hàng bắt đầu cần tới hệ thống thay vì trao đổi miệng.',
      },
      {
        title: 'Lịch sử liên hệ cần nằm ngoài máy cá nhân',
        detail:
          'Khi một nhân sự nghỉ việc hoặc chuyển nhóm, nội dung đã trao đổi với khách hàng phải ở lại với doanh nghiệp. Đây thường là lý do trực tiếp khiến việc dùng máy cá nhân dừng lại.',
      },
      {
        title: 'Đã có nơi lưu dữ liệu khách hàng',
        detail:
          'Khi doanh nghiệp đã dùng CRM, Helpdesk hoặc hệ thống bán hàng, giá trị lớn nhất đến từ việc cuộc gọi hoạt động cùng dữ liệu đó thay vì tồn tại song song.',
      },
      {
        title: 'Chất lượng hội thoại cần được kiểm soát',
        detail:
          'Khi nội dung cuộc gọi ảnh hưởng tới cam kết, khiếu nại hoặc tuân thủ, doanh nghiệp cần cách rà soát hội thoại vượt quá khả năng nghe lại thủ công của quản lý.',
      },
    ],
    note: 'Ngược lại, nếu doanh nghiệp chỉ có một hoặc hai người thỉnh thoảng gọi khách và không có nhu cầu lưu vết, một hệ thống tập trung thường chưa cần thiết. Gcalls nêu rõ điều này trong quá trình tư vấn thay vì đề xuất một cấu hình không dùng tới.',
  },

  profiles: {
    eyebrow: 'NĂM MÔ HÌNH VẬN HÀNH',
    h2: 'Các mô hình vận hành Gcalls đang phục vụ',
    description:
      'Mỗi mô hình mô tả cách một đội ngũ làm việc, không mô tả một doanh nghiệp cụ thể. Đối chiếu với cách đội bạn đang vận hành để biết nên bắt đầu từ đâu.',
    anchorId: 'nhom-khach-hang',
    items: [
      {
        id: 'telesales-goi-ra',
        n: '01',
        title: 'Đội telesales gọi ra khối lượng lớn',
        detail:
          'Danh sách khách hàng tiềm năng đổ về liên tục từ quảng cáo, sự kiện hoặc landing page, và được đội ngũ liên hệ qua điện thoại trong nhiều ngày hoặc nhiều tuần.',
        signals: [
          'Số lượng cuộc gọi mỗi người mỗi ngày là chỉ số vận hành chính',
          'Kết quả từng cuộc gọi cần được phân loại ngay để biết bước tiếp theo',
          'Quản lý cần nhìn được hoạt động của cả đội mà không phải hỏi từng người',
        ],
        links: [
          { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
          { label: 'Ước tính chi phí theo quy mô đội', path: ROUTES.costEstimator },
        ],
      },
      {
        id: 'cham-soc-goi-ra',
        n: '02',
        title: 'Đội chăm sóc khách hàng chủ động liên hệ',
        detail:
          'Cuộc gọi không nhằm bán hàng mà để nhắc lịch, xác nhận thông tin, theo dõi sau bán hoặc xử lý hồ sơ đang dở dang.',
        signals: [
          'Thời điểm liên hệ quan trọng không kém nội dung liên hệ',
          'Một khách hàng có thể được liên hệ nhiều lần bởi nhiều người khác nhau',
          'Nội dung đã trao đổi phải đọc được ngay ở lần liên hệ kế tiếp',
        ],
        links: [
          { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
          { label: 'Gcalls CX', path: ROUTES.gcallsCx },
        ],
      },
      {
        id: 'da-dung-crm-helpdesk',
        n: '03',
        title: 'Doanh nghiệp đã dùng CRM hoặc Helpdesk',
        detail:
          'Dữ liệu khách hàng và quy trình xử lý yêu cầu đã có nơi ở ổn định; điều còn thiếu là cuộc gọi hoạt động cùng dữ liệu đó thay vì là một hệ thống tách rời.',
        signals: [
          'Nhân viên đang phải tra cứu thủ công trước mỗi cuộc gọi',
          'Thông tin sau cuộc gọi được nhập lại bằng tay, nên thường thiếu',
          'Phạm vi kết nối phụ thuộc vào API và gói dịch vụ của nền tảng đang dùng',
        ],
        links: [
          { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
          { label: 'Tổng đài tích hợp Helpdesk', path: ROUTES.helpdeskIntegration },
          { label: 'Các nền tảng đã có trang tích hợp', path: ROUTES.integrations },
        ],
      },
      {
        id: 'thi-truong-quoc-te',
        n: '04',
        title: 'Doanh nghiệp liên lạc với thị trường nước ngoài',
        detail:
          'Khách hàng, đối tác hoặc đội ngũ nằm ngoài Việt Nam, nên cách liên lạc phải tính tới đầu số theo quốc gia, hồ sơ pháp lý và chênh lệch múi giờ.',
        signals: [
          'Điều kiện cấp số khác nhau theo quy định của từng quốc gia',
          'Cần xác định ai trực nhận cuộc gọi ở múi giờ tương ứng',
          'Yêu cầu về lưu trữ và xử lý dữ liệu có thể khác nhau theo thị trường',
        ],
        links: [{ label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling }],
      },
      {
        id: 'quy-mo-lon-tu-dong-hoa',
        n: '05',
        title: 'Đơn vị vận hành quy mô lớn đang tìm hiểu tự động hóa',
        detail:
          'Khối lượng hội thoại đã vượt khả năng rà soát thủ công, và một phần đáng kể cuộc gọi lặp lại theo cùng một kịch bản.',
        signals: [
          'Chỉ một phần nhỏ cuộc gọi thực tế được nghe lại và đánh giá',
          'Cần phân biệt rõ cuộc gọi có thể tự động hóa và cuộc gọi bắt buộc do người thực hiện',
          'Kết quả phân tích tự động vẫn cần người kiểm chứng trước khi dùng để đánh giá nhân sự',
        ],
        links: [
          { label: 'QA QC Center', path: ROUTES.qcCenter },
          { label: 'Gcalls Voicebot AI', path: ROUTES.voicebotAi },
        ],
      },
    ],
    note: 'Một doanh nghiệp thường thuộc nhiều mô hình cùng lúc. Thứ tự triển khai được xác định theo mức độ ưu tiên thực tế trong quá trình khảo sát, không theo thứ tự liệt kê ở đây.',
  },

  problems: {
    eyebrow: 'NHỮNG VẤN ĐỀ NÊN LÀM RÕ',
    h2: 'Các vấn đề Gcalls giúp doanh nghiệp đánh giá',
    description:
      'Đây là những vấn đề mà một buổi khảo sát thường tập trung vào. Chúng cũng là cách nhanh nhất để bạn tự kiểm tra doanh nghiệp mình đang đứng ở đâu.',
    items: [
      {
        title: 'Hoạt động liên hệ khách hàng đang nằm ở đâu',
        detail:
          'Cuộc gọi thực hiện bằng thiết bị nào, ai quản lý đầu số, và điều gì xảy ra với dữ liệu liên hệ khi một nhân sự rời đi.',
      },
      {
        title: 'Thông tin nào thất thoát sau mỗi cuộc gọi',
        detail:
          'Những gì được ghi nhận, những gì phụ thuộc vào trí nhớ của nhân viên, và phần nào trong đó ảnh hưởng tới lần liên hệ kế tiếp.',
      },
      {
        title: 'Cuộc gọi và dữ liệu khách hàng có làm việc cùng nhau không',
        detail:
          'Hệ thống nào đang giữ dữ liệu khách hàng, nền tảng đó mở ra những gì qua API, và phạm vi đồng bộ nào là khả thi.',
      },
      {
        title: 'Yêu cầu khách hàng đi qua bao nhiêu kênh',
        detail:
          'Kênh nào đang được dùng thật sự, kênh nào bị bỏ sót, và ngữ cảnh nào mất đi khi khách hàng chuyển kênh giữa chừng.',
      },
      {
        title: 'Chất lượng hội thoại đang được kiểm soát ra sao',
        detail:
          'Bộ tiêu chí đánh giá hiện có, tỷ lệ cuộc gọi thực tế được rà soát, và ai chịu trách nhiệm kiểm chứng kết quả.',
      },
      {
        title: 'Ràng buộc pháp lý và dữ liệu áp dụng cho doanh nghiệp',
        detail:
          'Yêu cầu về lưu vết hội thoại, thời gian lưu trữ và quyền truy cập, đặc biệt trong các ngành có quy định chặt.',
      },
    ],
    note: 'Kết quả khảo sát có thể cho thấy một phần nhu cầu nằm ngoài phạm vi sản phẩm hiện tại. Gcalls nêu rõ điều đó thay vì mở rộng phạm vi cam kết.',
  },

  pathways: {
    eyebrow: 'HƯỚNG GIẢI PHÁP',
    h2: 'Từ mô hình vận hành tới giải pháp tương ứng',
    description:
      'Nếu bạn đã nhận ra mô hình của mình ở trên, đây là trang đã hoàn thiện trình bày giải pháp tương ứng.',
    items: [
      {
        title: 'Kênh nghe gọi tập trung cho đội ngũ',
        detail:
          'Thực hiện và nhận cuộc gọi trên trình duyệt, kèm danh bạ, ghi chú, phân loại kết quả và theo dõi hoạt động của cả đội.',
        path: ROUTES.gcallsPlus,
        cta: 'Xem Gcalls Plus Webphone',
      },
      {
        title: 'Cuộc gọi hoạt động cùng dữ liệu khách hàng',
        detail:
          'Nhận diện người gọi theo hồ sơ, gọi trực tiếp từ giao diện đang dùng và ghi lịch sử liên hệ về đúng nơi lưu dữ liệu.',
        path: ROUTES.crmIntegration,
        cta: 'Xem tổng đài tích hợp CRM',
      },
      {
        title: 'Chăm sóc khách hàng trên nhiều kênh',
        detail:
          'Hợp nhất hội thoại từ hotline, Zalo, Facebook, email và SMS vào một luồng công việc để không kênh nào bị bỏ sót.',
        path: ROUTES.gcallsCx,
        cta: 'Xem Gcalls CX',
      },
      {
        title: 'Liên lạc với khách hàng ngoài Việt Nam',
        detail:
          'Đầu số theo từng thị trường, với điều kiện đăng ký và hồ sơ được xác nhận theo quy định của quốc gia tương ứng.',
        path: ROUTES.internationalCalling,
        cta: 'Xem tổng đài quốc tế',
      },
      {
        title: 'Kiểm soát chất lượng hội thoại',
        detail:
          'Rà soát hội thoại với sự hỗ trợ của QC Bot AI, dựa trên bộ tiêu chí do doanh nghiệp xây dựng.',
        path: ROUTES.qcCenter,
        cta: 'Xem QA QC Center',
      },
      {
        title: 'Tự động hóa cuộc gọi có kịch bản',
        detail:
          'Chuyển các cuộc gọi lặp lại theo kịch bản cố định sang Voicebot, với điểm chuyển tiếp cho nhân viên được định nghĩa rõ.',
        path: ROUTES.voicebotAi,
        cta: 'Xem Gcalls Voicebot AI',
      },
    ],
  },

  workingModel: {
    eyebrow: 'CÁCH GCALLS LÀM VIỆC VỚI KHÁCH HÀNG',
    h2: 'Bảy giai đoạn từ khảo sát tới vận hành',
    description:
      'Đây là các giai đoạn công việc, không phải một lịch trình cố định. Mỗi giai đoạn có thể dài ngắn khác nhau tùy phạm vi triển khai và mức độ sẵn sàng của hệ thống hiện có.',
    steps: [
      {
        n: '01',
        title: 'Khảo sát vận hành',
        detail:
          'Xác định đội ngũ đang làm việc thế nào, dữ liệu nằm ở đâu và vấn đề nào đang gây tốn kém nhất.',
      },
      {
        n: '02',
        title: 'Đánh giá kỹ thuật và tích hợp',
        detail:
          'Xác định nền tảng đang dùng, khả năng kết nối thực tế qua API, quyền truy cập cần cấp và điều kiện hạ tầng tại nơi làm việc.',
      },
      {
        n: '03',
        title: 'Xác định phạm vi',
        detail:
          'Chốt số người dùng, số hotline, các kênh và phạm vi tích hợp sẽ triển khai — kèm những gì nằm ngoài phạm vi lần này.',
      },
      {
        n: '04',
        title: 'Kế hoạch cấu hình và tích hợp',
        detail:
          'Thiết kế luồng tiếp nhận cuộc gọi, phân quyền theo nhóm và phương án đồng bộ dữ liệu với hệ thống hiện có.',
      },
      {
        n: '05',
        title: 'Kiểm thử',
        detail:
          'Chạy thử trên một nhóm nhỏ, đối chiếu dữ liệu giữa hai hệ thống và xử lý các tình huống phát sinh trước khi mở rộng.',
      },
      {
        n: '06',
        title: 'Chuẩn bị vận hành chính thức',
        detail:
          'Hướng dẫn thao tác cho người dùng, chuyển đổi đầu số theo kế hoạch và thống nhất cách xử lý khi có sự cố.',
      },
      {
        n: '07',
        title: 'Rà soát vận hành và hỗ trợ',
        detail:
          'Xem lại cách hệ thống đang được sử dụng thực tế và điều chỉnh cấu hình, trong phạm vi hỗ trợ đã thống nhất trong hợp đồng.',
      },
    ],
    note: 'Gcalls không đưa ra một mốc thời gian chung cho toàn bộ quá trình. Thời gian cụ thể chỉ được cam kết sau bước khảo sát và đánh giá kỹ thuật, theo phạm vi đã xác định.',
  },

  evidenceStandard: {
    eyebrow: 'TIÊU CHUẨN CÔNG BỐ',
    h2: 'Vì sao trang này không có tên hay logo khách hàng',
    description:
      'Việc để trống là một quyết định, không phải thiếu sót. Bốn nguyên tắc dưới đây quyết định khi nào một doanh nghiệp được nêu tên trên website của Gcalls.',
    items: [
      {
        title: 'Danh tính khách hàng thuộc về khách hàng',
        detail:
          'Tên doanh nghiệp và logo là tài sản của họ. Không có văn bản đồng ý thì không công bố, kể cả khi quan hệ hợp tác là có thật.',
      },
      {
        title: 'Tên trong tài liệu nội bộ không phải sự đồng ý',
        detail:
          'Một cái tên xuất hiện trong tài liệu giới thiệu, hồ sơ năng lực hay tài liệu lập kế hoạch không cho phép công bố công khai.',
      },
      {
        title: 'Kết quả phải nêu được cách đo',
        detail:
          'Một con số không kèm phạm vi triển khai, kỳ đo và cách tính thì không được công bố, vì người đọc không có cách nào kiểm chứng nó.',
      },
      {
        title: 'Ẩn danh vẫn phải đủ bằng chứng',
        detail:
          'Một câu chuyện không nêu tên khách hàng vẫn phải có đủ phạm vi, kỳ đo và cách tính mới được đăng. Ẩn danh không phải là cách hạ tiêu chuẩn.',
      },
    ],
    methodologyLink: {
      label: 'Xem tám điều kiện bằng chứng đầy đủ',
      path: `${ROUTES.caseStudies}#tieu-chuan-bang-chung`,
    },
    note: 'Cùng tiêu chuẩn này áp dụng cho mọi nội dung Gcalls công bố, kể cả trên trang Case Studies và trong tài liệu gửi cho doanh nghiệp.',
  },

  status: {
    eyebrow: 'TRẠNG THÁI HIỆN TẠI',
    h2: 'Thư viện khách hàng công khai đang được chuẩn bị',
    description:
      'Gcalls đang làm việc với các doanh nghiệp đang sử dụng hệ thống để chuẩn bị nội dung theo tiêu chuẩn trên. Trước khi hoàn tất, trang này không hiển thị bất kỳ nội dung mô phỏng nào.',
    points: [
      'Không có tên khách hàng, logo, trích dẫn hay số liệu nào được hiển thị, vì chưa có nội dung nào được duyệt công bố.',
      'Không có lưới logo trống, băng chuyền rỗng hay ô giữ chỗ nào được đặt sẵn trên trang.',
      'Việc trang này để trống không phản ánh số lượng khách hàng của Gcalls — nó phản ánh trạng thái của quyền công bố.',
      'Trang không phát sinh dữ liệu có cấu trúc nêu tên khách hàng hay tuyên bố quan hệ với bất kỳ tổ chức nào.',
    ],
    linksHeading: 'Cách đánh giá Gcalls khi chưa có câu chuyện khách hàng',
    links: [
      { label: 'Tiêu chuẩn bằng chứng cho case study', path: ROUTES.caseStudies },
      { label: 'Sáu lộ trình tự đánh giá trước khi quyết định', path: ROUTES.guides },
      { label: 'Phạm vi năng lực theo từng sản phẩm', path: ROUTES.products },
      { label: 'Khả năng tích hợp theo từng nền tảng', path: ROUTES.integrations },
      { label: 'Giải pháp theo ngành', path: ROUTES.industries },
      { label: 'Bảng giá Gcalls', path: ROUTES.pricing },
    ],
    note: 'Doanh nghiệp đang dùng Gcalls và muốn chia sẻ câu chuyện triển khai có thể liên hệ để bắt đầu quy trình duyệt nội dung. Doanh nghiệp giữ quyền quyết định ở mọi bước, kể cả sau khi đã duyệt bản thảo.',
    /*
     * `approvedLogos` intentionally omitted. It renders nothing while absent —
     * see `ApprovedLogo` in `./types.ts`. Populating it requires an approved
     * asset in this repository AND a permission record, both of which are
     * missing today.
     */
  },

  routing: {
    eyebrow: 'THEO NGÀNH',
    h2: 'Đặc thù vận hành theo ngành',
    description:
      'Cùng một hệ thống được sử dụng rất khác nhau giữa các ngành. Nếu ngành của bạn có trang riêng, đó thường là nơi mô tả sát nhất bài toán bạn đang gặp.',
    items: [
      {
        title: 'Giáo dục',
        detail:
          'Tư vấn tuyển sinh theo mùa vụ, danh sách người quan tâm lớn và lịch sử tư vấn kéo dài nhiều tuần.',
        path: ROUTES.education,
        cta: 'Xem giải pháp cho ngành giáo dục',
      },
      {
        title: 'Tài chính',
        detail:
          'Yêu cầu chặt về lưu vết hội thoại, nội dung bắt buộc trong cuộc gọi và kiểm soát chất lượng tư vấn.',
        path: ROUTES.finance,
        cta: 'Xem giải pháp cho ngành tài chính',
      },
      {
        title: 'Bảo hiểm',
        detail:
          'Hoạt động tư vấn, nhắc phí và xử lý hồ sơ trải dài theo vòng đời hợp đồng của khách hàng.',
        path: ROUTES.insurance,
        cta: 'Xem giải pháp cho ngành bảo hiểm',
      },
      {
        title: 'Bất động sản',
        detail:
          'Chu kỳ ra quyết định dài, nhiều lần liên hệ và nhu cầu giữ lại toàn bộ mạch trao đổi với khách hàng.',
        path: ROUTES.realEstate,
        cta: 'Xem giải pháp cho ngành bất động sản',
      },
      {
        title: 'Thương mại điện tử',
        detail:
          'Khối lượng đơn hàng lớn, nhiều kênh liên hệ và nhu cầu xác nhận, chăm sóc sau bán ở quy mô cao.',
        path: ROUTES.ecommerce,
        cta: 'Xem giải pháp cho thương mại điện tử',
      },
      {
        title: 'Dịch vụ thuê ngoài (BPO)',
        detail:
          'Nhiều chiến dịch và nhiều khách hàng cùng vận hành trên một hệ thống, với yêu cầu báo cáo tách bạch.',
        path: ROUTES.bpo,
        cta: 'Xem giải pháp cho ngành BPO',
      },
    ],
  },

  faq: [
    {
      q: 'Vì sao trang khách hàng không có logo doanh nghiệp nào?',
      a: 'Vì việc sử dụng tên và logo của một doanh nghiệp cần sự đồng ý bằng văn bản của chính doanh nghiệp đó, và Gcalls chưa hoàn tất quy trình này cho nội dung công bố công khai. Gcalls chọn để trống thay vì hiển thị logo chưa được cấp phép hoặc ô giữ chỗ trông như đang có nội dung.',
    },
    {
      q: 'Gcalls có khách hàng thật không?',
      a: 'Có. Điều chưa có là quyền công bố danh tính và bộ bằng chứng đầy đủ cho từng câu chuyện. Đó là hai việc khác nhau, và việc trang này để trống chỉ phản ánh việc thứ hai.',
      link: { label: 'Xem tiêu chuẩn bằng chứng', path: ROUTES.caseStudies },
    },
    {
      q: 'Làm sao đánh giá Gcalls khi chưa có câu chuyện khách hàng công khai?',
      a: 'Cách hợp lý là đối chiếu phạm vi năng lực được trình bày trên các trang sản phẩm và tích hợp với hệ thống bạn đang dùng, rồi đi qua lộ trình tự đánh giá trên trang Guides để xác định những hạng mục cần làm rõ. Sau đó, một buổi khảo sát sẽ trả lời phần còn lại dựa trên hoàn cảnh cụ thể.',
      link: { label: 'Xem Guides', path: ROUTES.guides },
    },
    {
      q: 'Doanh nghiệp quy mô nhỏ có được hỗ trợ như doanh nghiệp lớn không?',
      a: 'Quy trình khảo sát và xác định phạm vi áp dụng như nhau. Điều khác biệt là phạm vi triển khai và mức hỗ trợ được thống nhất trong hợp đồng theo nhu cầu thực tế, nên một doanh nghiệp nhỏ không phải trả cho những hạng mục mình không dùng tới.',
    },
    {
      q: 'Doanh nghiệp muốn chia sẻ câu chuyện triển khai thì bắt đầu thế nào?',
      a: 'Liên hệ với đội ngũ Gcalls để bắt đầu quy trình. Hai bên sẽ thống nhất phạm vi thông tin được công bố, cùng xác định chỉ số và cách đo, và Gcalls chỉ đăng sau khi doanh nghiệp duyệt bản thảo và đồng ý bằng văn bản.',
      link: { label: 'Liên hệ Gcalls', path: ROUTES.contact },
    },
  ],

  finalCta: {
    eyebrow: 'KHÁCH HÀNG',
    h2: 'Đối chiếu mô hình vận hành của bạn với đội ngũ Gcalls',
    description:
      'Chia sẻ cách đội ngũ đang liên hệ khách hàng, hệ thống đang sử dụng và vấn đề đang gây tốn kém nhất để Gcalls đánh giá mức độ phù hợp và đề xuất phạm vi triển khai.',
    primaryCta: { label: 'Đăng ký tư vấn cho đội ngũ của bạn', path: ROUTES.contact },
  },
}
