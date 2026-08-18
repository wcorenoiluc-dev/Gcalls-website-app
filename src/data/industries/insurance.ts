/**
 * Approved content for /nganh/bao-hiem/ — Checkpoint WEB-IND-001.
 *
 * ICP — PRIMARY: high-density outbound telesales teams (ICP 1). Insurance sits
 * squarely in the source's ICP 1 industry list, and its distinguishing feature
 * is that the same customer is called repeatedly across a long contract
 * lifecycle, not once at the point of sale.
 * ICP — SECONDARY: operations needing quality monitoring (ICP 5), because what
 * an advisor said during a sale matters months later.
 *
 * No third ICP. See the claim guard in `./types.ts`.
 *
 * SECTOR CAUTION — same as `./finance.ts`. This page must never state or imply
 * that Gcalls makes an insurer compliant with any regulation, that recordings
 * satisfy a legal retention or evidentiary requirement, or that call review
 * meets a supervisory standard. No such assessment exists in this repository.
 * It must also never describe or endorse a sales script, because mis-selling
 * exposure is the customer's to manage, not a website's to advise on.
 */

import { ROUTES } from '@/config/navigation'
import type { IndustryContent } from './types'

export const INSURANCE: IndustryContent = {
  id: 'insurance',
  route: ROUTES.insurance,
  breadcrumbLabel: 'Bảo hiểm',
  lead: {
    intent: 'consultation',
    source: 'consultation',
    solution: 'Giải pháp cho ngành bảo hiểm',
  },

  hero: {
    eyebrow: 'GIẢI PHÁP CHO NGÀNH BẢO HIỂM',
    h1: 'Giữ ngữ cảnh khách hàng xuyên suốt vòng đời hợp đồng',
    description:
      'Một hợp đồng bảo hiểm kéo theo nhiều lần liên hệ trong nhiều năm: tư vấn, xác nhận, nhắc đóng phí, tái tục và xử lý quyền lợi. Gcalls giúp mỗi lần liên hệ đó diễn ra với đầy đủ ngữ cảnh của những lần trước.',
    primaryCta: { label: 'Đăng ký tư vấn cho doanh nghiệp bảo hiểm' },
    secondaryCta: {
      label: 'Xem Gcalls hỗ trợ những gì',
      href: '#gcalls-ho-tro-bao-hiem',
    },
    microcopy:
      'Gcalls khảo sát quy trình tư vấn và chăm sóc hợp đồng hiện tại, sau đó đề xuất cấu hình theo yêu cầu quản lý nội bộ của doanh nghiệp.',
  },

  problem: {
    eyebrow: 'BÀI TOÁN VẬN HÀNH',
    h2: 'Liên hệ nhiều lần, nhưng mỗi lần lại bắt đầu từ con số không',
    description:
      'Đặc thù của bảo hiểm là chu kỳ liên hệ dài. Ba vấn đề dưới đây đều bắt nguồn từ việc ngữ cảnh không đi cùng khách hàng qua các lần liên hệ đó.',
    items: [
      {
        n: '01',
        title: 'Khối lượng gọi ra lớn và tỷ lệ bắt máy thấp',
        detail:
          'Đội tư vấn gọi ra liên tục từ danh sách khách hàng tiềm năng. Khách hàng không nhận ra số gọi đến nên thường không bắt máy, và thời gian đội ngũ dồn vào những cuộc gọi không có người nghe.',
      },
      {
        n: '02',
        title: 'Số gọi ra bị chặn hoặc bị báo cáo làm phiền',
        detail:
          'Tần suất gọi cao từ một đầu số khiến số đó nhanh chóng bị đánh dấu. Đội ngũ phải thay số nhiều lần, và mỗi lần thay là một lần khách hàng cũ không còn nhận ra số liên hệ quen thuộc.',
      },
      {
        n: '03',
        title: 'Ngữ cảnh hợp đồng không đi cùng cuộc gọi',
        detail:
          'Khi tư vấn viên phụ trách thay đổi, người tiếp nhận sau thường không biết khách hàng đã được tư vấn những gì, đã từ chối điều gì và đang ở giai đoạn nào của hợp đồng.',
      },
    ],
  },

  impact: {
    eyebrow: 'TÁC ĐỘNG TỚI HOẠT ĐỘNG',
    h2: 'Mất ngữ cảnh làm hỏng cả trải nghiệm lẫn khả năng kiểm soát',
    description:
      'Trong bảo hiểm, hậu quả của một lần liên hệ thiếu ngữ cảnh thường chỉ xuất hiện rất lâu sau đó.',
    items: [
      {
        title: 'Khách hàng phải kể lại từ đầu',
        detail:
          'Với sản phẩm mà niềm tin là yếu tố quyết định, việc phải giải thích lại tình huống của mình ở mỗi lần liên hệ làm giảm đáng kể thiện chí của khách hàng.',
      },
      {
        title: 'Chi phí thay đầu số và gián đoạn chiến dịch',
        detail:
          'Mỗi lần mất một đầu số dùng được là một lần phát sinh chi phí thay thế và một khoảng thời gian đội ngũ không có số để gọi ra.',
      },
      {
        title: 'Vấn đề chất lượng tư vấn chỉ lộ ra khi đã muộn',
        detail:
          'Nghe lại thủ công chỉ bao phủ một phần rất nhỏ số cuộc gọi, nên những sai lệch trong cách tư vấn thường chỉ được phát hiện khi khách hàng đã khiếu nại.',
      },
    ],
  },

  capability: {
    eyebrow: 'GCALLS HỖ TRỢ NHỮNG GÌ',
    h2: 'Một hệ thống cho cả hoạt động gọi ra và lịch sử chăm sóc',
    description:
      'Bốn nhóm năng lực dưới đây là những gì Gcalls thực hiện được cho bối cảnh bảo hiểm.',
    anchorId: 'gcalls-ho-tro-bao-hiem',
    items: [
      {
        title: 'Kênh nghe gọi tập trung cho cả đội tư vấn',
        detail:
          'Tư vấn viên gọi ra và nhận cuộc gọi trên trình duyệt, kèm danh bạ, ghi chú và phân loại kết quả. Hoạt động liên hệ không còn gắn với máy cá nhân của từng người.',
        path: ROUTES.gcallsPlus,
        linkLabel: 'Xem Gcalls Plus Webphone',
      },
      {
        title: 'Lịch sử trao đổi gắn với hồ sơ khách hàng',
        detail:
          'Khi doanh nghiệp đã dùng CRM, ghi chú và lịch sử liên hệ có thể được đồng bộ về đúng hồ sơ, để người tiếp nhận sau đọc được toàn bộ mạch trao đổi trước đó.',
        path: ROUTES.crmIntegration,
        linkLabel: 'Xem tổng đài tích hợp CRM',
      },
      {
        title: 'Đánh giá chất lượng tư vấn theo bộ tiêu chí',
        detail:
          'QA QC Center chuyển hội thoại thành transcript và hỗ trợ chấm điểm theo bộ tiêu chí do doanh nghiệp tự định nghĩa, làm nổi bật những tín hiệu cần kiểm tra thêm.',
        path: ROUTES.qcCenter,
        linkLabel: 'Xem QA QC Center',
      },
      {
        title: 'Tự động hóa các cuộc gọi định kỳ theo kịch bản',
        detail:
          'Nhắc đóng phí, nhắc tái tục hay xác nhận thông tin là những tác vụ có kịch bản cố định và có thể được cân nhắc chuyển sang Voicebot, tùy phạm vi triển khai.',
        path: ROUTES.voicebotAi,
        linkLabel: 'Xem Gcalls Voicebot AI',
      },
    ],
    /**
     * NEEDS_GCALLS_VERIFICATION — Auto Dialer, outbound number rotation and
     * randomised outbound calling are the ICP source's stated answer to
     * problems 01 and 02. All three remain unpublished in this repository (see
     * `src/data/gcallsCx.ts`), so the mechanism is not named here.
     */
    note: 'Cách tổ chức hoạt động gọi ra ở tần suất cao — số lượng đầu số, cách phân bổ và trình tự gọi — được khảo sát theo quy trình và quy định thực tế của từng doanh nghiệp, không áp dụng một cấu hình mặc định.',
  },

  workflow: {
    eyebrow: 'ĐƯA VÀO QUY TRÌNH HIỆN TẠI',
    h2: 'Triển khai theo vòng đời hợp đồng đang vận hành',
    description:
      'Quy trình chăm sóc hợp đồng giữ nguyên. Điều thay đổi là ngữ cảnh đi cùng khách hàng qua từng giai đoạn.',
    steps: [
      {
        n: '01',
        title: 'Khảo sát các điểm liên hệ',
        detail:
          'Xác định những giai đoạn doanh nghiệp chủ động liên hệ khách hàng và thông tin cần có sẵn ở mỗi giai đoạn.',
      },
      {
        n: '02',
        title: 'Thiết lập hotline và phân quyền',
        detail:
          'Cấu hình đầu số, nhóm tư vấn và luồng tiếp nhận cuộc gọi đến theo cơ cấu đội ngũ hiện tại.',
      },
      {
        n: '03',
        title: 'Kết nối dữ liệu hợp đồng',
        detail:
          'Xác định phạm vi tích hợp với hệ thống quản lý khách hàng, theo khả năng thực tế của nền tảng đang dùng.',
      },
      {
        n: '04',
        title: 'Thiết lập bộ tiêu chí đánh giá',
        detail:
          'Định nghĩa tiêu chí chất lượng hội thoại theo yêu cầu nội bộ, rồi điều chỉnh sau khi có dữ liệu thực tế.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'GIÁ TRỊ KỲ VỌNG',
    h2: 'Những thay đổi thường được đặt làm mục tiêu',
    description:
      'Đây là các mục tiêu doanh nghiệp bảo hiểm thường đặt ra khi tập trung hoạt động liên hệ về một hệ thống.',
    items: [
      {
        title: 'Ngữ cảnh sẵn có ở mỗi lần liên hệ',
        detail:
          'Người tiếp nhận đọc được lịch sử trao đổi trước đó thay vì hỏi lại khách hàng từ đầu.',
      },
      {
        title: 'Ít gián đoạn khi nhân sự thay đổi',
        detail:
          'Lịch sử chăm sóc nằm ở hệ thống, nên bàn giao không kéo theo mất dữ liệu quan hệ khách hàng.',
      },
      {
        title: 'Phạm vi kiểm tra chất lượng rộng hơn',
        detail:
          'Đánh giá dựa trên transcript và bộ tiêu chí, thay vì chỉ dựa trên số cuộc nghe lại được.',
      },
      {
        title: 'Thời gian dồn vào tư vấn thật',
        detail:
          'Các tác vụ định kỳ có kịch bản cố định có thể được tách khỏi công việc của tư vấn viên.',
      },
    ],
    /**
     * NEEDS_GCALLS_VERIFICATION — the ICP source's "tăng 2.5%" connection-rate
     * figure, and any claim that AI review covers 100% of calls or is perfectly
     * accurate. All withheld; no figure appears above.
     */
    note: 'Đây là mục tiêu vận hành, không phải cam kết kết quả, và không phải một đánh giá tuân thủ quy định. Gcalls chưa công bố số liệu đo lường cho ngành bảo hiểm; phạm vi và mức độ thay đổi phụ thuộc cấu hình triển khai thực tế.',
  },

  routing: {
    eyebrow: 'XEM THÊM',
    h2: 'Các trang liên quan tới bài toán bảo hiểm',
    description:
      'Nếu một trong các nhu cầu dưới đây là ưu tiên hiện tại, đây là trang nên xem trước.',
    items: [
      {
        title: 'Gcalls Plus Webphone',
        detail:
          'Kênh nghe gọi trên trình duyệt cho đội tư vấn, kèm danh bạ, ghi chú và theo dõi hoạt động cuộc gọi.',
        path: ROUTES.gcallsPlus,
        cta: 'Xem Gcalls Plus Webphone',
      },
      {
        title: 'QA QC Center',
        detail:
          'Khi ưu tiên là kiểm soát chất lượng tư vấn trên diện rộng hơn khả năng nghe lại thủ công.',
        path: ROUTES.qcCenter,
        cta: 'Xem QA QC Center',
      },
      {
        title: 'Tổng đài tích hợp CRM',
        detail:
          'Khi ưu tiên là đưa lịch sử chăm sóc hợp đồng về đúng hồ sơ khách hàng trong hệ thống đang dùng.',
        path: ROUTES.crmIntegration,
        cta: 'Xem tổng đài tích hợp CRM',
      },
    ],
  },

  faq: [
    {
      q: 'Gcalls phù hợp với đơn vị nào trong ngành bảo hiểm?',
      a: 'Gcalls phù hợp với doanh nghiệp bảo hiểm, đại lý và đơn vị phân phối có đội ngũ liên hệ khách hàng qua điện thoại thường xuyên và cần theo dõi lịch sử trao đổi theo vòng đời hợp đồng. Mức độ phù hợp được xác định theo quy trình và khối lượng cuộc gọi thực tế.',
    },
    {
      q: 'Ghi âm cuộc gọi có đáp ứng yêu cầu lưu trữ của ngành không?',
      a: 'Gcalls hỗ trợ ghi âm theo cấu hình triển khai, phục vụ mục đích quản lý nội bộ. Việc yêu cầu lưu trữ pháp lý cụ thể có được đáp ứng hay không cần được doanh nghiệp và đơn vị chuyên môn đánh giá; Gcalls không đưa ra kết luận về tuân thủ.',
    },
    {
      q: 'QA QC Center có phát hiện được sai lệch trong tư vấn không?',
      a: 'QA QC Center hỗ trợ phát hiện các tín hiệu cần kiểm tra dựa trên transcript và bộ tiêu chí do doanh nghiệp định nghĩa. Kết quả là đầu vào cho việc rà soát của con người, không phải kết luận tự động về chất lượng của một cuộc tư vấn.',
      link: { label: 'QA QC Center', path: ROUTES.qcCenter },
    },
    {
      q: 'Xử lý thế nào khi đầu số gọi ra bị chặn?',
      a: 'Đây là vấn đề gắn với quy định viễn thông và cách tổ chức hoạt động gọi ra, nên không có một cấu hình chung cho mọi trường hợp. Gcalls khảo sát số lượng đầu số đang dùng, tần suất liên hệ và quy trình hiện tại để đề xuất phương án trong quá trình tư vấn.',
    },
  ],

  finalCta: {
    eyebrow: 'BẢO HIỂM',
    h2: 'Trao đổi về quy trình tư vấn và chăm sóc hợp đồng hiện tại',
    description:
      'Chia sẻ cách đội ngũ đang liên hệ khách hàng qua từng giai đoạn hợp đồng để Gcalls đề xuất cấu hình phù hợp.',
    primaryCta: {
      label: 'Đăng ký tư vấn cho doanh nghiệp bảo hiểm',
      path: ROUTES.contact,
    },
  },
}
