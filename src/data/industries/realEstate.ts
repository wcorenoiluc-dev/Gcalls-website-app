/**
 * Approved content for /nganh/bat-dong-san/ — Checkpoint WEB-IND-001.
 *
 * ICP — PRIMARY: high-density outbound telesales teams (ICP 1). This is the
 * purest expression of that ICP in the source: very large lead lists, very high
 * call frequency, and the "running out of usable numbers" trigger that comes
 * with it.
 * ICP — SECONDARY: businesses already using a CRM (ICP 3), because lead
 * ownership and follow-up state are the second half of the same problem.
 *
 * No third ICP. See the claim guard in `./types.ts`.
 *
 * The temptation on this page is to answer the number-burn problem with Auto
 * Dialer and number rotation, because that is what the ICP source says. Do not.
 * Neither is published in this repository. The problem is named honestly, the
 * consequence is named honestly, and the answer is a consultation — which is
 * also the truthful answer, since the right configuration genuinely depends on
 * the operator and the regulations in force.
 */

import { ROUTES } from '@/config/navigation'
import type { IndustryContent } from './types'

export const REAL_ESTATE: IndustryContent = {
  id: 'real-estate',
  route: ROUTES.realEstate,
  breadcrumbLabel: 'Bất động sản',
  lead: {
    intent: 'consultation',
    source: 'consultation',
    solution: 'Giải pháp cho ngành bất động sản',
  },

  hero: {
    eyebrow: 'GIẢI PHÁP CHO NGÀNH BẤT ĐỘNG SẢN',
    h1: 'Quản lý lượng lead lớn mà không mất dấu khách hàng nào',
    description:
      'Đội kinh doanh bất động sản làm việc với hàng nghìn lead và gọi ra với tần suất rất cao. Gcalls giúp toàn bộ hoạt động gọi đó diễn ra trên một hệ thống, để trạng thái của từng khách hàng luôn rõ ràng và không phụ thuộc vào máy cá nhân của agent.',
    primaryCta: { label: 'Đăng ký tư vấn cho doanh nghiệp bất động sản' },
    secondaryCta: {
      label: 'Xem Gcalls hỗ trợ những gì',
      href: '#gcalls-ho-tro-bat-dong-san',
    },
    microcopy:
      'Gcalls khảo sát cách đội ngũ đang phân bổ lead và gọi ra, sau đó đề xuất cấu hình phù hợp với quy mô và hệ thống hiện tại.',
  },

  problem: {
    eyebrow: 'BÀI TOÁN VẬN HÀNH',
    h2: 'Ba nút thắt quen thuộc của đội kinh doanh bất động sản',
    description:
      'Ở tần suất gọi ra cao, những vấn đề dưới đây không còn là sự cố lẻ tẻ mà trở thành đặc điểm thường trực của hoạt động hằng ngày.',
    items: [
      {
        n: '01',
        title: 'Đầu số gọi ra nhanh chóng bị đánh dấu và bị chặn',
        detail:
          'Khi một số di động gọi ra liên tục, số đó dễ bị người nhận báo cáo hoặc bị nhà mạng hạn chế theo quy định hiện hành. Đội ngũ mất dần số dùng được và phải mua, thay SIM nhiều lần.',
      },
      {
        n: '02',
        title: 'Gọi thủ công từ danh sách làm hao thời gian bán hàng',
        detail:
          'Phần lớn số trong danh sách không bắt máy, sai số hoặc không liên lạc được, nhưng agent vẫn phải bấm từng số mới biết. Thời gian dồn vào thao tác thay vì vào cuộc trao đổi.',
      },
      {
        n: '03',
        title: 'Trạng thái lead nằm trong máy từng agent',
        detail:
          'Ai đã gọi cho khách hàng nào, đã trao đổi những gì và hẹn liên hệ lại khi nào thường chỉ agent đó biết. Khi agent nghỉ việc, phần dữ liệu ấy đi theo.',
      },
    ],
  },

  impact: {
    eyebrow: 'TÁC ĐỘNG TỚI HOẠT ĐỘNG',
    h2: 'Chi phí dồn vào lead đã mua nhưng không khai thác được',
    description:
      'Lead trong bất động sản có chi phí cao. Mỗi nút thắt ở trên đều làm giảm phần giá trị thu được từ chi phí đã bỏ ra.',
    items: [
      {
        title: 'Agent ngồi chờ vì không còn số để gọi ra',
        detail:
          'Khi các đầu số đang dùng bị hạn chế cùng lúc, cả nhóm rơi vào trạng thái không thể triển khai chiến dịch — chi phí nhân sự vẫn phát sinh nhưng không có cuộc gọi nào diễn ra.',
      },
      {
        title: 'Chi phí thay đầu số lặp lại và khó dự đoán',
        detail:
          'Việc liên tục mua và thay SIM tạo ra một khoản chi phí vận hành phát sinh đều đặn mà quản lý rất khó đưa vào kế hoạch.',
      },
      {
        title: 'Lead cũ không được khai thác lại',
        detail:
          'Khi lịch sử liên hệ không tập trung, doanh nghiệp gần như không thể tổ chức các đợt chăm sóc lại đối với lead đã tiếp cận ở dự án trước.',
      },
    ],
  },

  capability: {
    eyebrow: 'GCALLS HỖ TRỢ NHỮNG GÌ',
    h2: 'Đưa toàn bộ hoạt động gọi và trạng thái lead về một hệ thống',
    description:
      'Bốn nhóm năng lực dưới đây là những gì Gcalls thực hiện được cho bối cảnh kinh doanh bất động sản.',
    anchorId: 'gcalls-ho-tro-bat-dong-san',
    items: [
      {
        title: 'Kênh nghe gọi tập trung cho toàn đội kinh doanh',
        detail:
          'Agent gọi ra và nhận cuộc gọi trên trình duyệt. Hoạt động gọi không còn gắn với SIM cá nhân, nên doanh nghiệp giữ được quyền quản lý đối với kênh liên hệ khách hàng.',
        path: ROUTES.gcallsPlus,
        linkLabel: 'Xem Gcalls Plus Webphone',
      },
      {
        title: 'Trạng thái và lịch sử liên hệ của từng lead',
        detail:
          'Cuộc gọi, ghi chú, phân loại kết quả và lịch hẹn follow-up được ghi lại tập trung, để quản lý biết lead đang ở bước nào mà không phải hỏi từng agent.',
        path: ROUTES.gcallsPlus,
        linkLabel: 'Xem cách theo dõi lịch sử tương tác',
      },
      {
        title: 'Đồng bộ lead với CRM đang dùng',
        detail:
          'Khi doanh nghiệp đã có CRM, thông tin liên hệ và kết quả cuộc gọi có thể được đồng bộ về đúng hồ sơ theo phạm vi tích hợp đã thống nhất, thay vì nhập lại thủ công.',
        path: ROUTES.crmIntegration,
        linkLabel: 'Xem tổng đài tích hợp CRM',
      },
      {
        title: 'Bàn giao lead không mất ngữ cảnh',
        detail:
          'Khi agent thay đổi, người tiếp nhận đọc được lịch sử trao đổi trước đó trên hệ thống thay vì bắt đầu lại từ một số điện thoại trống.',
        path: ROUTES.crmIntegration,
        linkLabel: 'Xem cách đồng bộ dữ liệu khách hàng',
      },
    ],
    /**
     * NEEDS_GCALLS_VERIFICATION — this is the page where the ICP source's
     * Auto Dialer, outbound number rotation and randomised outbound calling
     * would carry the most weight, and where withholding them costs the most.
     * They stay withheld: `src/data/gcallsCx.ts` records that no product
     * config, estimator field or scope-document entry exists for any of them.
     * Publish them here the moment product confirms, as a fifth card answering
     * problems 01 and 02 directly.
     */
    note: 'Cách tổ chức hoạt động gọi ra ở tần suất cao — số lượng đầu số, cách phân bổ giữa các nhóm và trình tự gọi — phụ thuộc vào quy mô đội ngũ và quy định viễn thông hiện hành, nên được khảo sát riêng cho từng doanh nghiệp thay vì áp dụng một cấu hình mặc định.',
  },

  workflow: {
    eyebrow: 'ĐƯA VÀO QUY TRÌNH HIỆN TẠI',
    h2: 'Giữ nguyên cách phân bổ lead, thay đổi nơi dữ liệu được lưu',
    description:
      'Cách chia lead và cơ cấu đội kinh doanh giữ nguyên. Điều thay đổi là hoạt động gọi diễn ra trên hệ thống của doanh nghiệp.',
    steps: [
      {
        n: '01',
        title: 'Khảo sát cách phân bổ lead',
        detail:
          'Xác định nguồn lead, cách chia cho từng nhóm và các trạng thái đang dùng để theo dõi tiến độ.',
      },
      {
        n: '02',
        title: 'Thiết lập hotline và nhóm agent',
        detail:
          'Cấu hình đầu số, phân quyền theo nhóm kinh doanh và định nghĩa luồng tiếp nhận cuộc gọi đến.',
      },
      {
        n: '03',
        title: 'Kết nối CRM hoặc hệ thống quản lý lead',
        detail:
          'Xác định phạm vi đồng bộ dữ liệu theo khả năng thực tế của nền tảng doanh nghiệp đang dùng.',
      },
      {
        n: '04',
        title: 'Chạy thử theo một dự án',
        detail:
          'Triển khai trên một nhóm hoặc một dự án trước, rồi mở rộng khi cách vận hành đã ổn định.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'GIÁ TRỊ KỲ VỌNG',
    h2: 'Những thay đổi thường được đặt làm mục tiêu',
    description:
      'Đây là các mục tiêu doanh nghiệp bất động sản thường đặt ra khi tập trung hoạt động gọi ra về một hệ thống.',
    items: [
      {
        title: 'Doanh nghiệp giữ quyền quản lý kênh liên hệ',
        detail:
          'Hoạt động gọi diễn ra trên hệ thống của doanh nghiệp thay vì trên SIM cá nhân của agent.',
      },
      {
        title: 'Trạng thái lead luôn rõ ràng',
        detail:
          'Quản lý biết lead đang ở bước nào mà không cần tổng hợp thủ công từ từng agent.',
      },
      {
        title: 'Bàn giao không làm mất lịch sử',
        detail:
          'Khi nhân sự thay đổi, ngữ cảnh trao đổi trước đó vẫn nằm ở hồ sơ khách hàng.',
      },
      {
        title: 'Có cơ sở để chăm sóc lại lead cũ',
        detail:
          'Lịch sử liên hệ tập trung giúp tổ chức các đợt tiếp cận lại cho dự án mới.',
      },
    ],
    /**
     * NEEDS_GCALLS_VERIFICATION — "tăng 2.5% tỷ lệ kết nối thành công" and any
     * claim about reduced SIM replacement cost. The source flags the first as
     * requiring verification; the second depends on a capability this
     * repository does not publish. Neither appears above.
     */
    note: 'Đây là mục tiêu vận hành, không phải cam kết kết quả. Gcalls chưa công bố số liệu đo lường cho ngành bất động sản; mức thay đổi thực tế phụ thuộc quy mô đội ngũ, chất lượng dữ liệu lead và cách vận hành của từng doanh nghiệp.',
  },

  routing: {
    eyebrow: 'XEM THÊM',
    h2: 'Các trang liên quan tới bài toán bất động sản',
    description:
      'Nếu một trong các nhu cầu dưới đây là ưu tiên hiện tại, đây là trang nên xem trước.',
    items: [
      {
        title: 'Gcalls Plus Webphone',
        detail:
          'Kênh nghe gọi trên trình duyệt cho đội kinh doanh, kèm danh bạ, ghi chú và theo dõi hoạt động cuộc gọi.',
        path: ROUTES.gcallsPlus,
        cta: 'Xem Gcalls Plus Webphone',
      },
      {
        title: 'Tổng đài tích hợp CRM',
        detail:
          'Khi ưu tiên là đồng bộ lead và kết quả cuộc gọi với CRM hoặc hệ thống quản lý lead đang dùng.',
        path: ROUTES.crmIntegration,
        cta: 'Xem tổng đài tích hợp CRM',
      },
      {
        title: 'Ước tính chi phí',
        detail:
          'Nhập quy mô đội kinh doanh và nhu cầu sử dụng để xem các yếu tố cấu thành chi phí triển khai.',
        path: ROUTES.costEstimator,
        cta: 'Ước tính chi phí',
      },
    ],
  },

  faq: [
    {
      q: 'Gcalls giải quyết được việc đầu số bị chặn không?',
      a: 'Việc một đầu số bị hạn chế phụ thuộc vào quy định viễn thông, hành vi người nhận cuộc gọi và cách doanh nghiệp tổ chức hoạt động gọi ra, nên không có một cấu hình chung cho mọi trường hợp. Gcalls khảo sát số lượng đầu số đang dùng, tần suất liên hệ và quy trình hiện tại để đề xuất phương án phù hợp trong quá trình tư vấn.',
    },
    {
      q: 'Agent nghỉ việc thì dữ liệu khách hàng có mất không?',
      a: 'Khi hoạt động gọi diễn ra trên hệ thống của doanh nghiệp, lịch sử cuộc gọi, ghi chú và trạng thái liên hệ được lưu ở hồ sơ khách hàng thay vì trên máy cá nhân. Phạm vi dữ liệu được giữ lại phụ thuộc vào cấu hình và phạm vi tích hợp đã triển khai.',
      link: { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
    },
    {
      q: 'Có dùng được cho nhiều dự án và nhiều nhóm kinh doanh không?',
      a: 'Hotline, người dùng và phân quyền được thiết lập theo cơ cấu đội ngũ của doanh nghiệp, nên có thể tổ chức theo nhóm hoặc theo dự án. Cấu hình cụ thể được xác định trong quá trình khảo sát.',
    },
    {
      q: 'Triển khai có cần thay đổi cách chia lead hiện tại không?',
      a: 'Không nhất thiết. Cách phân bổ lead và cơ cấu đội kinh doanh thường được giữ nguyên; điều thay đổi là nơi hoạt động gọi diễn ra và nơi dữ liệu được lưu lại.',
    },
  ],

  finalCta: {
    eyebrow: 'BẤT ĐỘNG SẢN',
    h2: 'Trao đổi về cách đội kinh doanh đang vận hành',
    description:
      'Chia sẻ quy mô đội ngũ, nguồn lead và cách gọi ra hiện tại để Gcalls đề xuất cấu hình phù hợp.',
    primaryCta: {
      label: 'Đăng ký tư vấn cho doanh nghiệp bất động sản',
      path: ROUTES.contact,
    },
  },
}
