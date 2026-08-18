/**
 * Approved content for /nganh/tai-chinh/ — Checkpoint WEB-IND-001.
 *
 * ICP — PRIMARY: businesses already running a CRM (ICP 3). Finance is the
 * clearest case of the audience priority's first tier — the phone system and
 * the system of record are both already in place, and the cost is that they do
 * not talk to each other.
 * ICP — SECONDARY: large operations needing quality monitoring (ICP 5), because
 * in finance the reason to review calls is governance, not coaching alone.
 *
 * No third ICP. See the claim guard in `./types.ts`.
 *
 * SECTOR CAUTION. This page describes INTERNAL management value only. It must
 * never state or imply that Gcalls makes a business compliant with any
 * financial, data-protection or telecoms regulation, that recordings satisfy a
 * legal retention requirement, or that call review meets an audit standard.
 * No such assessment exists in this repository. Register: "phục vụ mục đích
 * quản lý nội bộ", "theo yêu cầu nội bộ của doanh nghiệp".
 */

import { ROUTES } from '@/config/navigation'
import type { IndustryContent } from './types'

export const FINANCE: IndustryContent = {
  id: 'finance',
  route: ROUTES.finance,
  breadcrumbLabel: 'Tài chính',
  lead: {
    intent: 'consultation',
    source: 'consultation',
    solution: 'Giải pháp cho ngành tài chính',
  },

  hero: {
    eyebrow: 'GIẢI PHÁP CHO NGÀNH TÀI CHÍNH',
    h1: 'Cuộc gọi và dữ liệu khách hàng trong cùng một luồng làm việc',
    description:
      'Doanh nghiệp tài chính thường đã có hệ thống quản lý khách hàng. Vấn đề nằm ở chỗ hoạt động nghe gọi diễn ra bên ngoài hệ thống đó, nên lịch sử tương tác không bao giờ đầy đủ. Gcalls kết nối hai lớp này lại với nhau.',
    primaryCta: { label: 'Đăng ký tư vấn cho doanh nghiệp tài chính' },
    secondaryCta: {
      label: 'Xem Gcalls hỗ trợ những gì',
      href: '#gcalls-ho-tro-tai-chinh',
    },
    microcopy:
      'Gcalls khảo sát hệ thống hiện có, xác định phạm vi tích hợp khả thi và đề xuất cấu hình theo yêu cầu quản lý nội bộ của doanh nghiệp.',
  },

  problem: {
    eyebrow: 'BÀI TOÁN VẬN HÀNH',
    h2: 'Khi tổng đài và hệ thống quản lý khách hàng chạy song song',
    description:
      'Hai hệ thống cùng phục vụ một khách hàng nhưng không chia sẻ dữ liệu là nguồn gốc của phần lớn công việc thủ công dưới đây.',
    items: [
      {
        n: '01',
        title: 'Nhân viên copy và nhập lại số điện thoại',
        detail:
          'Mỗi lần liên hệ là một lần chuyển qua lại giữa hồ sơ khách hàng và điện thoại. Thao tác này lặp lại hàng trăm lần mỗi ngày và là nơi sai sót dữ liệu bắt đầu.',
      },
      {
        n: '02',
        title: 'Hồ sơ khách hàng thiếu, trùng hoặc không khớp nhau',
        detail:
          'Khi thông tin liên hệ được nhập thủ công ở nhiều nơi, cùng một khách hàng có thể tồn tại dưới vài bản ghi khác nhau, và không bản ghi nào đầy đủ.',
      },
      {
        n: '03',
        title: 'Ghi âm và lịch sử trao đổi nằm rải rác',
        detail:
          'File ghi âm ở một hệ thống, ghi chú ở hệ thống khác, còn kết quả trao đổi nằm trong trí nhớ của nhân viên phụ trách. Khi cần tra cứu lại một giao dịch, phải ghép từ nhiều nguồn.',
      },
    ],
  },

  impact: {
    eyebrow: 'TÁC ĐỘNG TỚI HOẠT ĐỘNG',
    h2: 'Dữ liệu không liền mạch làm chậm cả đội ngũ lẫn quản lý',
    description:
      'Với doanh nghiệp tài chính, chất lượng dữ liệu tương tác không chỉ là vấn đề tiện lợi — nó quyết định khả năng kiểm soát của quản lý.',
    items: [
      {
        title: 'Rủi ro mất dữ liệu khi nhân sự nghỉ việc',
        detail:
          'Nếu ngữ cảnh khách hàng nằm ở nhân viên chứ không nằm ở hệ thống, mỗi lần thay đổi nhân sự là một lần doanh nghiệp mất một phần lịch sử quan hệ khách hàng.',
      },
      {
        title: 'Quản lý khó đánh giá chất lượng tư vấn',
        detail:
          'Nghe lại thủ công chỉ bao phủ được một phần rất nhỏ số cuộc gọi. Phần còn lại không có cơ sở để đánh giá, nên vấn đề chỉ lộ ra khi đã thành khiếu nại.',
      },
      {
        title: 'Quy trình thủ công cản trở mở rộng quy mô',
        detail:
          'Cách làm phụ thuộc thao tác tay vẫn vận hành được ở quy mô nhỏ, nhưng chi phí quản lý tăng nhanh hơn số nhân sự khi đội ngũ lớn dần.',
      },
    ],
  },

  capability: {
    eyebrow: 'GCALLS HỖ TRỢ NHỮNG GÌ',
    h2: 'Kết nối tổng đài với hệ thống doanh nghiệp đang dùng',
    description:
      'Gcalls không thay thế hệ thống quản lý khách hàng hiện có. Vai trò của Gcalls là lớp kết nối giữa hoạt động nghe gọi và hệ thống đó.',
    anchorId: 'gcalls-ho-tro-tai-chinh',
    items: [
      {
        title: 'Gọi trực tiếp từ hồ sơ khách hàng',
        detail:
          'Click-to-Call cho phép nhân viên bắt đầu cuộc gọi ngay trong quy trình đang làm việc, khi tính năng này được hỗ trợ và cấu hình trên nền tảng đang dùng, thay vì nhập lại số điện thoại.',
        path: ROUTES.crmIntegration,
        linkLabel: 'Xem tổng đài tích hợp CRM',
      },
      {
        title: 'Thông tin khách hàng hiển thị khi có cuộc gọi',
        detail:
          'Khi cuộc gọi đến được đối chiếu với dữ liệu trong hệ thống, nhân viên nhìn thấy ngữ cảnh trước khi bắt máy thay vì hỏi lại khách hàng từ đầu.',
        path: ROUTES.crmIntegration,
        linkLabel: 'Xem cách hiển thị context khách hàng',
      },
      {
        title: 'Lịch sử cuộc gọi, ghi chú và ghi âm về đúng hồ sơ',
        detail:
          'Kết quả trao đổi được đồng bộ về bản ghi khách hàng tương ứng theo phạm vi tích hợp đã thống nhất, để lịch sử quan hệ khách hàng nằm ở hệ thống chứ không ở cá nhân.',
        path: ROUTES.integrations,
        linkLabel: 'Xem danh mục nền tảng tích hợp',
      },
      {
        title: 'Đánh giá chất lượng hội thoại có hệ thống',
        detail:
          'QA QC Center chuyển hội thoại thành transcript và hỗ trợ chấm điểm theo bộ tiêu chí do doanh nghiệp định nghĩa, để việc kiểm tra không còn phụ thuộc vào việc nghe lại thủ công từng cuộc.',
        path: ROUTES.qcCenter,
        linkLabel: 'Xem QA QC Center',
      },
    ],
    /**
     * NEEDS_GCALLS_VERIFICATION — the ICP source offers "30+ tích hợp" and a
     * "30%–50% productivity improvement". Neither is evidenced here: the
     * repository names exactly five platforms with routes (HubSpot,
     * Salesforce, Zoho CRM, Freshdesk, Zendesk) and holds no productivity
     * study. Both are withheld; the note below states scope conditionally.
     *
     * NEEDS_GCALLS_VERIFICATION — the source also lists SDK/API integration for
     * custom applications. Referenced only as something surveyed, never as a
     * published SDK with documented capability.
     */
    note: 'Khả năng tích hợp cụ thể phụ thuộc vào nền tảng, phiên bản và API mà hệ thống hiện tại cung cấp. Với ứng dụng nội bộ, phương án kết nối được khảo sát riêng theo từng trường hợp. Gcalls xác định phạm vi khả thi trước khi triển khai.',
  },

  workflow: {
    eyebrow: 'ĐƯA VÀO QUY TRÌNH HIỆN TẠI',
    h2: 'Giữ nguyên hệ thống lõi, bổ sung lớp kết nối',
    description:
      'Doanh nghiệp tài chính hiếm khi có thể thay hệ thống lõi. Cách triển khai dưới đây được thiết kế để không yêu cầu điều đó.',
    steps: [
      {
        n: '01',
        title: 'Khảo sát hệ thống hiện có',
        detail:
          'Xác định nền tảng đang dùng, phiên bản, API sẵn có và những điểm dữ liệu cần đồng bộ hai chiều.',
      },
      {
        n: '02',
        title: 'Xác định phạm vi tích hợp',
        detail:
          'Thống nhất trường dữ liệu, quyền truy cập và những gì được ghi lại, theo yêu cầu quản lý nội bộ của doanh nghiệp.',
      },
      {
        n: '03',
        title: 'Thiết lập và kiểm thử',
        detail:
          'Cấu hình hotline, phân quyền theo nhóm nghiệp vụ và chạy thử trên một nhóm người dùng trước khi mở rộng.',
      },
      {
        n: '04',
        title: 'Theo dõi và điều chỉnh',
        detail:
          'Sau khi vận hành, bộ tiêu chí đánh giá và cấu hình báo cáo được điều chỉnh theo thực tế sử dụng.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'GIÁ TRỊ KỲ VỌNG',
    h2: 'Những thay đổi thường được đặt làm mục tiêu',
    description:
      'Đây là các mục tiêu doanh nghiệp tài chính thường đặt ra khi kết nối tổng đài với hệ thống quản lý khách hàng.',
    items: [
      {
        title: 'Giảm thao tác nhập liệu thủ công',
        detail:
          'Bớt các bước copy, tra cứu và nhập lại thông tin trong mỗi lần liên hệ khách hàng.',
      },
      {
        title: 'Lịch sử tương tác nhất quán hơn',
        detail:
          'Dữ liệu liên hệ và kết quả trao đổi nằm ở hệ thống, theo phạm vi tích hợp đã triển khai.',
      },
      {
        title: 'Quản lý nhìn được chất lượng tư vấn',
        detail:
          'Đánh giá dựa trên transcript và bộ tiêu chí thay vì chỉ dựa trên số cuộc nghe lại được.',
      },
      {
        title: 'Nền tảng để mở rộng đội ngũ',
        detail:
          'Quy trình bớt phụ thuộc thao tác tay, nên chi phí quản lý không tăng cùng nhịp với số nhân sự.',
      },
    ],
    /**
     * NEEDS_GCALLS_VERIFICATION — "tăng 30%–50% năng suất Sales/CS" from the
     * ICP source. No approved case study or product source in this repository
     * supports it, so no figure appears above.
     */
    note: 'Đây là mục tiêu vận hành, không phải cam kết kết quả, và không phải một đánh giá tuân thủ quy định. Gcalls chưa công bố số liệu đo lường cho ngành tài chính; mức thay đổi thực tế phụ thuộc hệ thống hiện có và phạm vi tích hợp được triển khai.',
  },

  routing: {
    eyebrow: 'XEM THÊM',
    h2: 'Các trang liên quan tới bài toán tài chính',
    description:
      'Nếu một trong các nhu cầu dưới đây là ưu tiên hiện tại, đây là trang nên xem trước.',
    items: [
      {
        title: 'Tổng đài tích hợp CRM',
        detail:
          'Khi ưu tiên là đưa cuộc gọi vào cùng luồng làm việc với hệ thống quản lý khách hàng đang dùng.',
        path: ROUTES.crmIntegration,
        cta: 'Xem tổng đài tích hợp CRM',
      },
      {
        title: 'QA QC Center',
        detail:
          'Khi ưu tiên là đánh giá chất lượng hội thoại của đội ngũ trên diện rộng hơn khả năng nghe lại thủ công.',
        path: ROUTES.qcCenter,
        cta: 'Xem QA QC Center',
      },
      {
        title: 'Danh mục tích hợp',
        detail:
          'Xem các nền tảng đã có trang trình bày riêng và phạm vi kết nối tương ứng.',
        path: ROUTES.integrations,
        cta: 'Xem danh mục tích hợp',
      },
    ],
  },

  faq: [
    {
      q: 'Gcalls có thay thế hệ thống quản lý khách hàng hiện tại không?',
      a: 'Không. Gcalls đóng vai trò lớp kết nối giữa hoạt động nghe gọi và hệ thống doanh nghiệp đang dùng. Hệ thống lõi giữ nguyên; cuộc gọi và dữ liệu tương tác được đưa vào cùng một luồng làm việc theo phạm vi tích hợp đã thống nhất.',
      link: { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
    },
    {
      q: 'Gcalls có giúp doanh nghiệp đáp ứng quy định của ngành không?',
      a: 'Gcalls cung cấp công cụ phục vụ mục đích quản lý nội bộ: lịch sử tương tác, ghi âm theo cấu hình và hỗ trợ đánh giá chất lượng hội thoại. Việc đáp ứng quy định pháp lý cụ thể thuộc trách nhiệm của doanh nghiệp và cần được đơn vị chuyên môn đánh giá; Gcalls không đưa ra kết luận về tuân thủ.',
    },
    {
      q: 'Có tích hợp được với hệ thống nội bộ tự phát triển không?',
      a: 'Khả năng kết nối với ứng dụng nội bộ phụ thuộc vào API và dữ liệu mà hệ thống đó cung cấp. Đây là nội dung được khảo sát riêng cho từng trường hợp trước khi xác định phạm vi triển khai.',
    },
    {
      q: 'QA QC Center có đánh giá được toàn bộ cuộc gọi không?',
      a: 'Phạm vi cuộc gọi được xử lý phụ thuộc vào cấu hình triển khai và dữ liệu được kết nối. QA QC Center hỗ trợ mở rộng khả năng đánh giá so với cách nghe lại thủ công, nhưng phạm vi cụ thể cần được xác định theo từng dự án.',
      link: { label: 'QA QC Center', path: ROUTES.qcCenter },
    },
  ],

  finalCta: {
    eyebrow: 'TÀI CHÍNH',
    h2: 'Trao đổi về hệ thống và quy trình hiện tại của doanh nghiệp',
    description:
      'Chia sẻ nền tảng đang dùng, cách đội ngũ liên hệ khách hàng và yêu cầu quản lý nội bộ để Gcalls xác định phạm vi tích hợp phù hợp.',
    primaryCta: {
      label: 'Đăng ký tư vấn cho doanh nghiệp tài chính',
      path: ROUTES.contact,
    },
  },
}
