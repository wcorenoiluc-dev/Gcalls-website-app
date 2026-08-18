/**
 * Approved content for /cong-ty/doi-tac/ — Checkpoint WEB-COMPANY-001.
 *
 * A partnership FRAMEWORK, not a partner directory. This repository contains no
 * partnership agreement, no partner-status record and no approved third-party
 * mark, so this page names no partner and displays no logo.
 *
 * ---------------------------------------------------------------------------
 * THE ONE MISTAKE THIS PAGE MUST NOT MAKE
 * ---------------------------------------------------------------------------
 * Gcalls integrates with HubSpot, Salesforce, Zoho CRM, Freshdesk and Zendesk,
 * and each has a completed integration page in this repository. That is a
 * TECHNICAL fact about what connects to what. It establishes no commercial
 * relationship whatsoever, and this page has a section of its own saying so,
 * because a partners page that lists platforms it merely integrates with is the
 * most common way this exact claim gets fabricated.
 *
 * Never written here: "đối tác chính thức", "đối tác được chứng nhận", "đối tác
 * công nghệ", "đối tác chiến lược", "nhà phân phối ủy quyền", "nhà cung cấp ưu
 * tiên", "tích hợp native", or any statement of universal compatibility.
 *
 * Approved register instead: "có thể tích hợp với…", "phạm vi tích hợp phụ
 * thuộc API, gói dịch vụ và yêu cầu triển khai", "nền tảng được đánh giá trong
 * quá trình khảo sát kỹ thuật".
 *
 * The categories below are PROSPECTIVE relationship types. Every one of them is
 * phrased as a category of organisation, never as an organisation Gcalls works
 * with, and `PartnerModel.availability` carries the condition on each model so
 * no card reads as an open offer.
 */

import { ROUTES } from '@/config/navigation'
import type { PartnersContent } from './types'

export const PARTNERS: PartnersContent = {
  id: 'partners',
  route: ROUTES.partners,
  breadcrumbLabel: 'Đối tác',
  /**
   * `intent: 'partnership'` is an approved `LeadIntent` — no enum was invented.
   * `source` has no partnership value in `LeadSource`; `'contact'` is the
   * nearest valid general-contact source and keeps attribution intact. See §I
   * of the checkpoint report.
   */
  lead: {
    intent: 'partnership',
    source: 'contact',
    solution: 'Hợp tác và tích hợp',
  },

  hero: {
    eyebrow: 'HỢP TÁC VỚI GCALLS',
    h1: 'Khung hợp tác giữa Gcalls và các đơn vị cùng phục vụ một khách hàng',
    description:
      'Trang này mô tả các hình thức hợp tác Gcalls sẵn sàng trao đổi, những tiêu chí được đánh giá trước khi hai bên cam kết, và ranh giới giữa việc tích hợp kỹ thuật với một quan hệ đối tác chính thức. Đây là khung làm việc, không phải danh sách đối tác hiện có.',
    primaryCta: { label: 'Trao đổi về hợp tác' },
    secondaryCta: { label: 'Xem các nhóm hợp tác', href: '#nhom-hop-tac' },
    microcopy:
      'Gcalls chưa công bố danh sách đối tác. Tên và logo của một tổ chức chỉ xuất hiện tại đây khi có thỏa thuận và quyền sử dụng thương hiệu được xác nhận bằng văn bản.',
  },

  purpose: {
    eyebrow: 'MỤC ĐÍCH VÀ ĐỐI TƯỢNG',
    h2: 'Dành cho tổ chức đang cân nhắc làm việc cùng Gcalls',
    description:
      'Trang này viết cho thời điểm bạn muốn biết hợp tác với Gcalls sẽ diễn ra thế nào, cần chuẩn bị gì, và điều gì phải được thống nhất trước khi bất kỳ bên nào nói tới cam kết công khai.',
    audience: [
      {
        title: 'Đơn vị triển khai và tư vấn hệ thống',
        detail:
          'Đang triển khai CRM, Helpdesk hoặc hệ thống vận hành cho doanh nghiệp và cần bổ sung phần kênh thoại vào phạm vi của mình.',
      },
      {
        title: 'Nhà cung cấp công nghệ và nền tảng',
        detail:
          'Có sản phẩm mà khách hàng thường dùng song song với tổng đài, và muốn đánh giá khả năng kết nối kỹ thuật giữa hai hệ thống.',
      },
      {
        title: 'Đơn vị giới thiệu và kinh doanh giải pháp',
        detail:
          'Có tệp khách hàng doanh nghiệp và muốn tìm hiểu hình thức giới thiệu hoặc phân phối giải pháp, cùng ranh giới thương mại đi kèm.',
      },
      {
        title: 'Đội ngũ nội bộ đang thẩm định nhà cung cấp',
        detail:
          'Cần biết Gcalls đặt ra tiêu chí gì cho một quan hệ hợp tác, vì đó cũng là cách Gcalls tự ràng buộc mình trong quan hệ đó.',
      },
    ],
    note: 'Trang này không cam kết rằng mọi hình thức hợp tác đều đang mở. Hình thức khả thi cho một tổ chức cụ thể được xác định sau khi hai bên trao đổi.',
  },

  why: {
    eyebrow: 'VÌ SAO CẦN HỆ SINH THÁI',
    h2: 'Một hệ thống liên lạc hiếm khi đứng một mình',
    description:
      'Tổng đài luôn nằm cạnh những hệ thống khác trong doanh nghiệp. Chất lượng triển khai vì thế phụ thuộc vào việc các bên liên quan làm việc với nhau tới đâu.',
    items: [
      {
        title: 'Dữ liệu khách hàng nằm ở hệ thống khác',
        detail:
          'Giá trị của kênh thoại phần lớn đến từ việc nó hoạt động cùng nơi đang lưu dữ liệu khách hàng, nên đơn vị quản trị hệ thống đó luôn là một bên liên quan.',
      },
      {
        title: 'Triển khai thường cần hiểu biết về ngành',
        detail:
          'Cùng một cấu hình có thể phù hợp với ngành này và sai với ngành khác. Đơn vị am hiểu nghiệp vụ của một ngành đóng góp phần mà nhà cung cấp phần mềm không tự có.',
      },
      {
        title: 'Hạ tầng viễn thông có ràng buộc riêng',
        detail:
          'Đầu số, điều kiện đăng ký và phạm vi dịch vụ do nhà cung cấp viễn thông và quy định sở tại quyết định, không do nền tảng phần mềm quyết định.',
      },
      {
        title: 'Trách nhiệm hỗ trợ cần rõ ràng từ đầu',
        detail:
          'Khi nhiều bên cùng tham gia một hệ thống, điều khiến khách hàng khổ nhất không phải lỗi kỹ thuật mà là không biết sự cố thuộc trách nhiệm của ai.',
      },
    ],
    note: 'Đây là lý do Gcalls mô tả tiêu chí và ranh giới trước, thay vì công bố quan hệ hợp tác rồi mới làm rõ phạm vi.',
  },

  categories: {
    eyebrow: 'SÁU NHÓM HỢP TÁC',
    h2: 'Các nhóm hợp tác Gcalls sẵn sàng trao đổi',
    description:
      'Đây là các nhóm quan hệ tiềm năng, mô tả theo loại tổ chức. Không nhóm nào ở đây là danh sách đối tác hiện có, và việc một nền tảng được nêu tên trên website Gcalls không đồng nghĩa với việc tổ chức đó là đối tác.',
    anchorId: 'nhom-hop-tac',
    items: [
      {
        id: 'crm-helpdesk',
        title: 'Hệ sinh thái CRM và Helpdesk',
        detail:
          'Các nền tảng quản lý dữ liệu khách hàng và yêu cầu hỗ trợ, nơi kênh thoại cần hoạt động cùng hồ sơ và ticket đang xử lý.',
        examples: [
          'Nền tảng CRM có API mở cho ứng dụng bên thứ ba',
          'Nền tảng quản lý yêu cầu hỗ trợ khách hàng',
          'Đơn vị phát triển ứng dụng trên các nền tảng đó',
        ],
        links: [
          { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
          { label: 'Tổng đài tích hợp Helpdesk', path: ROUTES.helpdeskIntegration },
        ],
      },
      {
        id: 'vien-thong',
        title: 'Viễn thông và đầu số quốc tế',
        detail:
          'Các đơn vị cung cấp hạ tầng thoại và đầu số theo thị trường, nơi điều kiện dịch vụ do quy định sở tại và nhà cung cấp quyết định.',
        examples: [
          'Đơn vị cung cấp đầu số theo quốc gia',
          'Đơn vị cung cấp hạ tầng kết nối thoại',
          'Đơn vị hỗ trợ hồ sơ pháp lý theo thị trường',
        ],
        links: [{ label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling }],
      },
      {
        id: 'ai-tu-dong-hoa',
        title: 'AI và tự động hóa',
        detail:
          'Các đơn vị cung cấp năng lực xử lý ngôn ngữ, nhận dạng giọng nói hoặc tự động hóa quy trình có thể bổ sung cho hoạt động thoại.',
        examples: [
          'Đơn vị cung cấp công nghệ nhận dạng và tổng hợp giọng nói',
          'Đơn vị phát triển trợ lý thoại theo kịch bản',
          'Đơn vị cung cấp công cụ phân tích hội thoại',
        ],
        links: [
          { label: 'Gcalls Voicebot AI', path: ROUTES.voicebotAi },
          { label: 'QA QC Center', path: ROUTES.qcCenter },
        ],
      },
      {
        id: 'trien-khai-tu-van',
        title: 'Đơn vị triển khai và tư vấn hệ thống',
        detail:
          'Các đội ngũ đang triển khai hệ thống vận hành cho doanh nghiệp và muốn đưa phần kênh thoại vào phạm vi dự án của mình.',
        examples: [
          'Đơn vị triển khai CRM hoặc ERP cho doanh nghiệp',
          'Đơn vị tư vấn chuyển đổi quy trình vận hành',
          'Đội ngũ kỹ thuật thực hiện tích hợp hệ thống',
        ],
        links: [
          { label: 'Các nền tảng đã có trang tích hợp', path: ROUTES.integrations },
          { label: 'Sáu lộ trình triển khai', path: ROUTES.guides },
        ],
      },
      {
        id: 'gioi-thieu-phan-phoi',
        title: 'Giới thiệu và phân phối giải pháp',
        detail:
          'Các cá nhân và tổ chức có tệp khách hàng doanh nghiệp, quan tâm tới hình thức giới thiệu hoặc kinh doanh lại giải pháp.',
        examples: [
          'Đơn vị đang phục vụ cùng tệp khách hàng doanh nghiệp',
          'Đơn vị tư vấn có nhu cầu giới thiệu giải pháp cho khách hàng',
          'Tổ chức muốn trao đổi về hình thức phân phối',
        ],
        links: [{ label: 'Chương trình giới thiệu', path: ROUTES.referral }],
      },
      {
        id: 'cong-nghe-theo-nganh',
        title: 'Công nghệ chuyên biệt theo ngành',
        detail:
          'Các nhà cung cấp phần mềm nghiệp vụ cho một ngành cụ thể, nơi hoạt động liên hệ khách hàng gắn chặt với quy trình riêng của ngành đó.',
        examples: [
          'Phần mềm quản lý tuyển sinh và đào tạo',
          'Phần mềm nghiệp vụ tài chính, bảo hiểm hoặc bất động sản',
          'Nền tảng bán hàng và quản lý đơn hàng',
        ],
        links: [{ label: 'Giải pháp theo ngành', path: ROUTES.industries }],
      },
    ],
    note: 'Các ví dụ ở trên mô tả loại tổ chức, không nêu tên tổ chức nào. Gcalls không công bố tên một bên thứ ba trước khi có thỏa thuận và quyền sử dụng thương hiệu bằng văn bản.',
  },

  models: {
    eyebrow: 'HÌNH THỨC HỢP TÁC',
    h2: 'Các hình thức hợp tác có thể trao đổi',
    description:
      'Mỗi hình thức đi kèm điều kiện riêng. Chúng được mô tả để hai bên có cùng ngôn ngữ khi trao đổi, không phải để khẳng định tất cả đều đang sẵn sàng.',
    items: [
      {
        title: 'Tích hợp kỹ thuật',
        detail:
          'Kết nối giữa Gcalls và một hệ thống khác để cuộc gọi hoạt động cùng dữ liệu của hệ thống đó.',
        availability:
          'Phạm vi khả thi phụ thuộc API, gói dịch vụ và quyền truy cập mà nền tảng đó cho phép; được đánh giá trong quá trình khảo sát kỹ thuật.',
      },
      {
        title: 'Cùng đánh giá giải pháp cho một khách hàng',
        detail:
          'Hai bên cùng khảo sát nhu cầu của một doanh nghiệp và đề xuất phạm vi phù hợp cho phần việc của mỗi bên.',
        availability:
          'Áp dụng theo từng cơ hội cụ thể, sau khi thống nhất vai trò và trách nhiệm của mỗi bên với khách hàng đó.',
      },
      {
        title: 'Giới thiệu khách hàng',
        detail:
          'Một bên giới thiệu doanh nghiệp có nhu cầu để bên còn lại tiếp nhận và tư vấn.',
        availability:
          'Điều khoản, phạm vi và cách ghi nhận được trao đổi trực tiếp; trang Chương trình giới thiệu mô tả hình thức dành cho cá nhân và tổ chức.',
      },
      {
        title: 'Hỗ trợ triển khai',
        detail:
          'Đơn vị đối tác đảm nhận một phần công việc triển khai hoặc hướng dẫn sử dụng tại doanh nghiệp khách hàng.',
        availability:
          'Cần thống nhất trước phạm vi công việc, ranh giới hỗ trợ và quy trình chuyển tiếp sự cố giữa hai bên.',
      },
      {
        title: 'Trao đổi về phân phối',
        detail:
          'Hình thức kinh doanh lại giải pháp, với trách nhiệm thương mại và hỗ trợ được phân định rõ.',
        availability:
          'Chưa phải chương trình mở công khai. Mọi trao đổi về phân phối được xử lý theo từng trường hợp và cần thỏa thuận bằng văn bản.',
      },
      {
        title: 'Truyền thông chung',
        detail:
          'Việc hai bên cùng xuất hiện trong nội dung truyền thông, hội thảo hoặc tài liệu giới thiệu.',
        availability:
          'Chỉ thực hiện sau khi có văn bản chấp thuận của cả hai bên, bao gồm quyền sử dụng tên và logo cho từng nội dung cụ thể.',
      },
    ],
    note: 'Không hình thức nào ở trên được xem là đã thiết lập cho tới khi hai bên ký thỏa thuận xác định phạm vi, trách nhiệm và ranh giới thương mại.',
  },

  principles: {
    eyebrow: 'TIÊU CHÍ ĐÁNH GIÁ',
    h2: 'Chín hạng mục được làm rõ trước khi hai bên cam kết',
    description:
      'Danh sách này áp dụng cho cả hai phía. Nó tồn tại để tránh tình huống phổ biến nhất trong hợp tác công nghệ: hai bên công bố quan hệ trước, rồi mới phát hiện không thống nhất về trách nhiệm.',
    items: [
      {
        n: '01',
        title: 'Mức độ phù hợp về sản phẩm và khách hàng',
        detail:
          'Hai bên có phục vụ cùng một nhóm khách hàng không, và việc hợp tác có giải quyết vấn đề thật của họ không.',
      },
      {
        n: '02',
        title: 'Khả năng tương thích kỹ thuật',
        detail:
          'Hai hệ thống kết nối được tới đâu trên thực tế, dựa trên tài liệu kỹ thuật chứ không dựa trên mong muốn.',
      },
      {
        n: '03',
        title: 'Mức độ sẵn sàng của API và bảo mật',
        detail:
          'API có ổn định và có tài liệu không, cơ chế xác thực ra sao, và yêu cầu bảo mật của mỗi bên là gì.',
      },
      {
        n: '04',
        title: 'Trách nhiệm hỗ trợ',
        detail:
          'Ai tiếp nhận yêu cầu của khách hàng trước, ai xử lý phần nào, và cách hai bên phối hợp khi sự cố nằm ở ranh giới.',
      },
      {
        n: '05',
        title: 'Ranh giới thương mại',
        detail:
          'Phạm vi kinh doanh của mỗi bên, cách xử lý khi cùng tiếp cận một khách hàng, và điều gì được phép cam kết thay bên kia.',
      },
      {
        n: '06',
        title: 'Quyền sở hữu dữ liệu',
        detail:
          'Dữ liệu khách hàng thuộc về ai, bên nào được truy cập phần nào, và điều gì xảy ra với dữ liệu khi hợp tác kết thúc.',
      },
      {
        n: '07',
        title: 'Quyền sử dụng thương hiệu',
        detail:
          'Mỗi bên được dùng tên và logo của bên kia trong bối cảnh nào, và nội dung nào cần được duyệt trước khi công bố.',
      },
      {
        n: '08',
        title: 'Quy trình xử lý khiếu nại của khách hàng',
        detail:
          'Cách một vấn đề được chuyển tiếp giữa hai bên, ai giữ vai trò liên hệ chính, và cam kết thời gian phản hồi.',
      },
      {
        n: '09',
        title: 'Thỏa thuận bằng văn bản',
        detail:
          'Toàn bộ các hạng mục trên được ghi trong thỏa thuận. Không có văn bản thì không có quan hệ đối tác, dù hai bên đã làm việc cùng nhau trên thực tế.',
      },
    ],
    note: 'Đây cũng là lý do Gcalls không mô tả các nền tảng đã tích hợp là đối tác: những hạng mục trên chưa được thống nhất bằng văn bản với các nền tảng đó.',
  },

  journey: {
    eyebrow: 'QUÁ TRÌNH TRAO ĐỔI',
    h2: 'Từ liên hệ ban đầu tới thỏa thuận',
    description:
      'Các bước dưới đây mô tả trình tự công việc, không kèm mốc thời gian cố định. Quá trình có thể dừng ở bất kỳ bước nào nếu hai bên thấy chưa phù hợp.',
    steps: [
      {
        n: '01',
        title: 'Liên hệ và giới thiệu',
        detail:
          'Tổ chức quan tâm gửi thông tin về lĩnh vực hoạt động, tệp khách hàng và hình thức hợp tác đang cân nhắc.',
      },
      {
        n: '02',
        title: 'Trao đổi mức độ phù hợp',
        detail:
          'Hai bên xác định có cùng phục vụ một nhóm khách hàng không và việc hợp tác giải quyết vấn đề gì cho họ.',
      },
      {
        n: '03',
        title: 'Đánh giá kỹ thuật',
        detail:
          'Nếu hợp tác có phần tích hợp, hai bên xem xét tài liệu API, cơ chế xác thực và phạm vi dữ liệu khả thi.',
      },
      {
        n: '04',
        title: 'Xác định phạm vi và trách nhiệm',
        detail:
          'Thống nhất phần việc của mỗi bên, ranh giới thương mại, trách nhiệm hỗ trợ và quy trình xử lý sự cố.',
      },
      {
        n: '05',
        title: 'Thử nghiệm có kiểm soát',
        detail:
          'Khi cần, hai bên chạy thử trên một phạm vi giới hạn để kiểm chứng giả định kỹ thuật và cách phối hợp.',
      },
      {
        n: '06',
        title: 'Thỏa thuận bằng văn bản',
        detail:
          'Các nội dung đã thống nhất được đưa vào văn bản, bao gồm quyền sử dụng thương hiệu và điều kiện công bố.',
      },
      {
        n: '07',
        title: 'Công bố nếu hai bên đồng ý',
        detail:
          'Chỉ sau bước này, tên và logo của đối tác mới có thể xuất hiện trên website, và chỉ trong phạm vi đã được chấp thuận.',
      },
    ],
    note: 'Không bước nào ở trên tạo ra quan hệ đối tác trước khi có thỏa thuận bằng văn bản. Việc hai bên đang trao đổi không được nêu ra như một quan hệ đã thiết lập.',
  },

  status: {
    eyebrow: 'TRẠNG THÁI DANH SÁCH',
    h2: 'Hiện chưa có danh sách đối tác công khai',
    description:
      'Gcalls chưa công bố danh mục đối tác trên website. Điều này phản ánh trạng thái của quyền công bố và hồ sơ thỏa thuận, không phải một tuyên bố về hoạt động hợp tác.',
    points: [
      'Không có tên, logo hay thẻ đối tác nào được hiển thị, vì chưa có hồ sơ thỏa thuận và quyền sử dụng thương hiệu nào được xác nhận cho mục đích công bố.',
      'Việc Gcalls tích hợp với một nền tảng không được trình bày như quan hệ đối tác của nền tảng đó.',
      'Logo của bên thứ ba chỉ được sử dụng khi có tệp tài sản được cấp phép và hồ sơ ghi nhận quyền sử dụng.',
      'Trang không phát sinh dữ liệu có cấu trúc nêu tên hay tuyên bố quan hệ với bất kỳ tổ chức nào.',
    ],
    linksHeading: 'Nội dung kỹ thuật có thể xem ngay',
    links: [
      { label: 'Các nền tảng đã có trang tích hợp', path: ROUTES.integrations },
      { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
      { label: 'Tổng đài tích hợp Helpdesk', path: ROUTES.helpdeskIntegration },
      { label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling },
      { label: 'Tất cả sản phẩm Gcalls', path: ROUTES.products },
      { label: 'Chương trình giới thiệu', path: ROUTES.referral },
    ],
    note: 'Tổ chức muốn trao đổi về hợp tác có thể liên hệ trực tiếp. Gcalls sẽ nêu rõ hình thức nào đang khả thi trước khi hai bên đi tiếp.',
  },

  clarification: {
    eyebrow: 'PHÂN BIỆT QUAN TRỌNG',
    h2: 'Tích hợp kỹ thuật không đồng nghĩa với quan hệ đối tác',
    description:
      'Gcalls có thể tích hợp với HubSpot, Salesforce, Zoho CRM, Freshdesk và Zendesk, và mỗi nền tảng có một trang riêng mô tả phạm vi kết nối thực tế. Đó là thông tin kỹ thuật, và nó không nói gì về quan hệ thương mại.',
    items: [
      {
        title: 'Tích hợp là năng lực kỹ thuật',
        detail:
          'Nó mô tả hai hệ thống trao đổi được dữ liệu gì, trong phạm vi mà API của nền tảng đó cho phép. Phạm vi này phụ thuộc phiên bản và gói dịch vụ doanh nghiệp đang dùng.',
      },
      {
        title: 'Đối tác là quan hệ có ràng buộc',
        detail:
          'Nó đòi hỏi thỏa thuận bằng văn bản về trách nhiệm hỗ trợ, ranh giới thương mại, quyền sử dụng thương hiệu và cách xử lý khiếu nại của khách hàng.',
      },
      {
        title: 'Gcalls không tự nhận tư cách đối tác của nền tảng',
        detail:
          'Website này không mô tả Gcalls là đối tác chính thức, đối tác được chứng nhận hay nhà phân phối ủy quyền của bất kỳ nền tảng nào, vì không có hồ sơ nào trong repository xác nhận tư cách đó.',
      },
      {
        title: 'Khả năng tương thích luôn có điều kiện',
        detail:
          'Không có tuyên bố tương thích với mọi hệ thống. Với nền tảng chưa có trang tích hợp riêng, khả năng kết nối cần một bước đánh giá kỹ thuật trước khi kết luận.',
      },
    ],
    note: 'Nếu bạn cần biết Gcalls kết nối được gì với hệ thống cụ thể của mình, trang tích hợp của nền tảng đó là nơi mô tả phạm vi thực tế — chính xác hơn bất kỳ tuyên bố quan hệ nào.',
  },

  routing: {
    eyebrow: 'XEM THÊM',
    h2: 'Nội dung kỹ thuật liên quan tới hợp tác',
    description:
      'Trước khi trao đổi về hợp tác, đây thường là những trang giúp đánh giá điểm giao nhau giữa hai hệ thống.',
    items: [
      {
        title: 'Các nền tảng đã có trang tích hợp',
        detail:
          'Mỗi nền tảng có trang riêng mô tả phạm vi kết nối thực tế, thay vì một tuyên bố tương thích chung.',
        path: ROUTES.integrations,
        cta: 'Xem các nền tảng tích hợp',
      },
      {
        title: 'Tổng đài tích hợp CRM',
        detail:
          'Cách cuộc gọi hoạt động cùng dữ liệu khách hàng, và những gì phụ thuộc vào API của nền tảng đang dùng.',
        path: ROUTES.crmIntegration,
        cta: 'Xem tổng đài tích hợp CRM',
      },
      {
        title: 'Tổng đài quốc tế',
        detail:
          'Điều kiện cấp số theo từng quốc gia và những ràng buộc do quy định sở tại đặt ra.',
        path: ROUTES.internationalCalling,
        cta: 'Xem tổng đài quốc tế',
      },
      {
        title: 'Tất cả sản phẩm Gcalls',
        detail:
          'Ranh giới giữa Gcalls Plus, QA QC Center, Gcalls CX và Gcalls Voicebot AI, để xác định điểm giao nhau phù hợp.',
        path: ROUTES.products,
        cta: 'Xem tất cả sản phẩm',
      },
      {
        title: 'Tất cả giải pháp',
        detail:
          'Các nhóm bài toán Gcalls đang phục vụ, hữu ích khi đánh giá phần việc mỗi bên có thể đảm nhận.',
        path: ROUTES.solutions,
        cta: 'Xem tất cả giải pháp',
      },
      {
        title: 'Chương trình giới thiệu',
        detail:
          'Hình thức dành cho cá nhân và tổ chức muốn giới thiệu giải pháp tới doanh nghiệp có nhu cầu.',
        path: ROUTES.referral,
        cta: 'Xem chương trình giới thiệu',
      },
    ],
  },

  faq: [
    {
      q: 'Gcalls có phải đối tác chính thức của HubSpot, Salesforce hay Zendesk không?',
      a: 'Website này không đưa ra tuyên bố đó. Gcalls có thể tích hợp với các nền tảng này và mỗi nền tảng có một trang mô tả phạm vi kết nối thực tế, nhưng khả năng tích hợp là thông tin kỹ thuật và không xác lập tư cách đối tác chính thức, đối tác được chứng nhận hay nhà phân phối ủy quyền.',
      link: { label: 'Xem các trang tích hợp', path: ROUTES.integrations },
    },
    {
      q: 'Vì sao trang này không có danh sách đối tác?',
      a: 'Vì việc nêu tên và sử dụng logo của một tổ chức cần thỏa thuận và quyền sử dụng thương hiệu được xác nhận bằng văn bản, và Gcalls chưa hoàn tất hồ sơ này cho mục đích công bố. Gcalls chọn để trống thay vì tạo thẻ đối tác không có cơ sở.',
    },
    {
      q: 'Hình thức hợp tác nào đang mở?',
      a: 'Điều này phụ thuộc vào loại tổ chức và bối cảnh cụ thể, nên không có câu trả lời chung. Một số hình thức — đặc biệt là phân phối — chưa phải chương trình mở công khai và được xử lý theo từng trường hợp. Gcalls sẽ nêu rõ hình thức nào khả thi ngay trong lần trao đổi đầu tiên.',
    },
    {
      q: 'Tích hợp với hệ thống của chúng tôi mất bao lâu?',
      a: 'Không có mốc thời gian chung. Thời gian phụ thuộc vào tài liệu API sẵn có, phạm vi dữ liệu cần trao đổi, yêu cầu xác thực và nguồn lực kỹ thuật của mỗi bên. Mốc cụ thể chỉ được đưa ra sau bước đánh giá kỹ thuật.',
    },
    {
      q: 'Chương trình giới thiệu và hợp tác đối tác khác nhau thế nào?',
      a: 'Chương trình giới thiệu dành cho cá nhân và tổ chức muốn giới thiệu doanh nghiệp có nhu cầu tới Gcalls, với điều khoản được trao đổi trực tiếp. Hợp tác đối tác rộng hơn, thường bao gồm phần kỹ thuật, trách nhiệm triển khai hoặc hỗ trợ, và luôn cần thỏa thuận bằng văn bản.',
      link: { label: 'Xem chương trình giới thiệu', path: ROUTES.referral },
    },
    {
      q: 'Chúng tôi muốn trao đổi về hợp tác thì bắt đầu thế nào?',
      a: 'Gửi thông tin về lĩnh vực hoạt động, tệp khách hàng và hình thức hợp tác đang cân nhắc qua trang liên hệ. Hai bên sẽ trao đổi mức độ phù hợp trước, rồi mới tới phần kỹ thuật và phạm vi trách nhiệm.',
      link: { label: 'Liên hệ Gcalls', path: ROUTES.contact },
    },
  ],

  finalCta: {
    eyebrow: 'HỢP TÁC',
    h2: 'Trao đổi về khả năng hợp tác với Gcalls',
    description:
      'Chia sẻ lĩnh vực hoạt động, tệp khách hàng bạn đang phục vụ và hình thức hợp tác đang cân nhắc. Gcalls sẽ trao đổi thẳng về hình thức nào khả thi và những gì cần làm rõ trước.',
    primaryCta: { label: 'Trao đổi về hợp tác', path: ROUTES.contact },
  },
}
