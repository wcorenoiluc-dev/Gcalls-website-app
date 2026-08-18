/**
 * Approved content for /nganh/giao-duc/ — Checkpoint WEB-IND-001.
 *
 * ICP — PRIMARY: high-density outbound telesales teams (ICP 1), in the
 * admissions-counselling form the education sector runs it: large enquiry
 * lists from ads, fairs and landing pages, worked by phone over weeks.
 * ICP — SECONDARY: businesses already using a CRM (ICP 3), because the
 * follow-up history is where admissions work actually lives or dies.
 *
 * No third ICP. See the claim guard in `./types.ts` before editing anything
 * below — in particular, this page must not publish Auto Dialer, outbound
 * number rotation, or the "2.5%" connection-rate figure from the ICP source.
 */

import { ROUTES } from '@/config/navigation'
import type { IndustryContent } from './types'

export const EDUCATION: IndustryContent = {
  id: 'education',
  route: ROUTES.education,
  breadcrumbLabel: 'Giáo dục',
  lead: {
    intent: 'consultation',
    source: 'consultation',
    solution: 'Giải pháp cho ngành giáo dục',
  },

  hero: {
    eyebrow: 'GIẢI PHÁP CHO NGÀNH GIÁO DỤC',
    h1: 'Giữ liên lạc xuyên suốt hành trình tuyển sinh và chăm sóc người học',
    description:
      'Một người quan tâm hiếm khi ra quyết định sau cuộc gọi đầu tiên. Gcalls giúp tổ chức giáo dục thực hiện, ghi nhận và theo dõi toàn bộ những lần trao đổi đó trên một hệ thống, để tư vấn viên biết đã nói gì với ai và cần quay lại vào lúc nào.',
    primaryCta: { label: 'Đăng ký tư vấn cho tổ chức giáo dục' },
    secondaryCta: {
      label: 'Xem Gcalls hỗ trợ những gì',
      href: '#gcalls-ho-tro-giao-duc',
    },
    microcopy:
      'Gcalls khảo sát quy trình tuyển sinh hiện tại, xác định phạm vi triển khai và đề xuất cấu hình phù hợp với hệ thống đang dùng.',
  },

  problem: {
    eyebrow: 'BÀI TOÁN VẬN HÀNH',
    h2: 'Nơi hoạt động tư vấn tuyển sinh thường bị hao hụt',
    description:
      'Ba tình huống dưới đây lặp lại ở phần lớn tổ chức giáo dục có đội tư vấn gọi ra thường xuyên, bất kể quy mô.',
    items: [
      {
        n: '01',
        title: 'Danh sách người quan tâm lớn, nhưng tỷ lệ kết nối được thấp',
        detail:
          'Dữ liệu từ quảng cáo, hội thảo và landing page đổ về liên tục. Một phần đáng kể là số sai, số không liên lạc được hoặc người nhận không bắt máy — nhưng tư vấn viên vẫn phải gọi từng số mới biết.',
      },
      {
        n: '02',
        title: 'Gọi thủ công làm gián đoạn nhịp tư vấn',
        detail:
          'Mỗi lần chuyển giữa danh sách, phần mềm quản lý và điện thoại là một lần ngắt mạch. Thời gian dồn vào thao tác tra số và nhập lại thông tin thay vì vào nội dung trao đổi với người học.',
      },
      {
        n: '03',
        title: 'Số gọi ra bị đánh dấu làm phiền và phải thay liên tục',
        detail:
          'Khi một số di động gọi ra với tần suất cao, số đó dễ bị báo cáo hoặc bị chặn. Đội ngũ mất dần số dùng được, phải mua và thay SIM nhiều lần, và mỗi lần thay là một lần chiến dịch bị gián đoạn.',
      },
    ],
  },

  impact: {
    eyebrow: 'TÁC ĐỘNG TỚI HOẠT ĐỘNG',
    h2: 'Chi phí thật sự nằm ở những lần không kết nối được',
    description:
      'Những vấn đề trên không dừng ở mức bất tiện cho tư vấn viên — chúng ảnh hưởng trực tiếp tới hiệu quả của cả mùa tuyển sinh.',
    items: [
      {
        title: 'Ngân sách tuyển sinh không được khai thác hết',
        detail:
          'Chi phí đã bỏ ra để có một người quan tâm là chi phí cố định. Mỗi hồ sơ không liên lạc được là phần ngân sách đó không tạo ra cơ hội tư vấn nào.',
      },
      {
        title: 'Tư vấn viên có mặt nhưng không có việc để làm',
        detail:
          'Khi không còn đầu số gọi ra dùng được, đội ngũ rơi vào trạng thái chờ. Đây là chi phí nhân sự phát sinh mà không gắn với bất kỳ cuộc trao đổi nào.',
      },
      {
        title: 'Lịch sử tư vấn biến mất khi nhân sự thay đổi',
        detail:
          'Ngành giáo dục có mùa vụ rõ rệt và biến động nhân sự theo mùa. Nếu nội dung trao đổi chỉ nằm trong máy cá nhân của tư vấn viên, người tiếp nhận sau phải hỏi lại từ đầu.',
      },
    ],
  },

  capability: {
    eyebrow: 'GCALLS HỖ TRỢ NHỮNG GÌ',
    h2: 'Đưa hoạt động gọi ra và lịch sử tư vấn về cùng một chỗ',
    description:
      'Bốn nhóm năng lực dưới đây là những gì Gcalls thực hiện được cho bối cảnh tuyển sinh. Mỗi nhóm dẫn tới trang trình bày chi tiết, nếu có.',
    anchorId: 'gcalls-ho-tro-giao-duc',
    items: [
      {
        title: 'Kênh nghe gọi tập trung trên trình duyệt',
        detail:
          'Tư vấn viên thực hiện và nhận cuộc gọi ngay trên trình duyệt, kèm danh bạ, ghi chú và phân loại cuộc gọi. Không cần thiết bị riêng cho từng người, và hoạt động gọi ra không còn gắn với máy cá nhân.',
        path: ROUTES.gcallsPlus,
        linkLabel: 'Xem Gcalls Plus Webphone',
      },
      {
        title: 'Lịch sử trao đổi gắn với từng người quan tâm',
        detail:
          'Khi tổ chức đã dùng CRM, cuộc gọi, ghi chú và lịch sử liên hệ có thể được đồng bộ về đúng hồ sơ. Người tiếp nhận sau đọc được toàn bộ mạch trao đổi trước đó thay vì bắt đầu lại.',
        path: ROUTES.crmIntegration,
        linkLabel: 'Xem tổng đài tích hợp CRM',
      },
      {
        title: 'Quản lý hotline và người dùng tập trung',
        detail:
          'Hotline, người dùng và luồng tiếp nhận được thiết lập và quản lý ở một nơi, thay vì mỗi tư vấn viên tự quản lý số của mình. Quản lý nhìn được hoạt động gọi của cả đội trên cùng một hệ thống.',
        path: ROUTES.gcallsPlus,
        linkLabel: 'Xem cách quản lý hoạt động đội ngũ',
      },
      {
        title: 'Tự động hóa những cuộc gọi lặp lại theo kịch bản',
        detail:
          'Các tác vụ có kịch bản cố định — nhắc lịch phỏng vấn, xác nhận thông tin nhập học, nhắc hạn hồ sơ — có thể được cân nhắc chuyển sang Voicebot, để tư vấn viên tập trung vào cuộc trao đổi cần thuyết phục.',
        path: ROUTES.voicebotAi,
        linkLabel: 'Xem Gcalls Voicebot AI',
      },
    ],
    /**
     * NEEDS_GCALLS_VERIFICATION — the ICP source lists Auto Dialer, outbound
     * number rotation and randomised outbound calling as the answer to problem
     * 03 above. None of the three is published anywhere in this repository
     * (see the scope decision in `src/data/gcallsCx.ts`: no product config, no
     * estimator field, no scope-document entry). The problem is therefore
     * stated and routed to consultation, and the mechanism is NOT named. Once
     * product confirms the capability, add it here as a fifth card.
     */
    note: 'Cách tổ chức hoạt động gọi ra ở quy mô lớn — số lượng đầu số, cách phân bổ và trình tự gọi — được khảo sát theo quy trình và quy định thực tế của từng tổ chức trong quá trình tư vấn, không áp dụng một cấu hình mặc định.',
  },

  workflow: {
    eyebrow: 'ĐƯA VÀO QUY TRÌNH HIỆN TẠI',
    h2: 'Triển khai theo quy trình tuyển sinh đang chạy, không thay thế nó',
    description:
      'Mục tiêu là tư vấn viên vẫn làm việc theo cách quen thuộc, chỉ khác ở chỗ cuộc gọi và dữ liệu không còn rời nhau.',
    steps: [
      {
        n: '01',
        title: 'Khảo sát quy trình tuyển sinh',
        detail:
          'Xác định nguồn dữ liệu người quan tâm, các bước tư vấn và những điểm hiện đang phải nhập liệu thủ công.',
      },
      {
        n: '02',
        title: 'Xác định hotline và người dùng',
        detail:
          'Thiết lập đầu số, phân quyền theo nhóm tư vấn và định nghĩa luồng tiếp nhận cuộc gọi đến.',
      },
      {
        n: '03',
        title: 'Kết nối hệ thống đang dùng',
        detail:
          'Xác định phạm vi tích hợp với CRM hoặc phần mềm quản lý tuyển sinh hiện có, theo khả năng thực tế của nền tảng đó.',
      },
      {
        n: '04',
        title: 'Kiểm thử và hướng dẫn sử dụng',
        detail:
          'Chạy thử trên một nhóm nhỏ trước khi mở rộng cho toàn đội, kèm hướng dẫn thao tác cho tư vấn viên.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'GIÁ TRỊ KỲ VỌNG',
    h2: 'Những thay đổi thường được đặt làm mục tiêu',
    description:
      'Đây là các mục tiêu mà tổ chức giáo dục thường đặt ra khi tập trung hoạt động gọi ra về một hệ thống.',
    items: [
      {
        title: 'Thời gian dồn vào cuộc trao đổi thật',
        detail:
          'Giảm số thao tác thủ công giữa danh sách, phần mềm và điện thoại trong mỗi lần liên hệ.',
      },
      {
        title: 'Mạch tư vấn được giữ lại',
        detail:
          'Lịch sử trao đổi nằm ở hồ sơ người quan tâm, không nằm trong máy cá nhân của tư vấn viên.',
      },
      {
        title: 'Quản lý nhìn được hoạt động của đội',
        detail:
          'Hoạt động gọi của cả đội hiển thị trên cùng một hệ thống thay vì phải tổng hợp thủ công.',
      },
      {
        title: 'Ít gián đoạn giữa mùa tuyển sinh',
        detail:
          'Hotline và người dùng được quản lý tập trung, nên thay đổi nhân sự không kéo theo thay đổi đầu số liên hệ.',
      },
    ],
    /**
     * NEEDS_GCALLS_VERIFICATION — the ICP source states a "tăng 2.5%" increase
     * in successful outbound connection rate. No internal source in this
     * repository supports it, and the source document itself flags it as
     * requiring verification, so no figure appears above.
     */
    note: 'Đây là mục tiêu vận hành, không phải cam kết kết quả. Gcalls chưa công bố số liệu đo lường cho ngành giáo dục; mức thay đổi thực tế phụ thuộc quy trình, chất lượng dữ liệu và cách đội ngũ sử dụng hệ thống.',
  },

  routing: {
    eyebrow: 'XEM THÊM',
    h2: 'Các trang liên quan tới bài toán tuyển sinh',
    description:
      'Nếu một trong các nhu cầu dưới đây là ưu tiên hiện tại, đây là trang nên xem trước.',
    items: [
      {
        title: 'Gcalls Plus Webphone',
        detail:
          'Kênh nghe gọi trên trình duyệt, danh bạ, ghi chú và theo dõi hoạt động cuộc gọi của đội tư vấn.',
        path: ROUTES.gcallsPlus,
        cta: 'Xem Gcalls Plus Webphone',
      },
      {
        title: 'Tổng đài tích hợp CRM',
        detail:
          'Khi tổ chức đã có CRM hoặc phần mềm quản lý tuyển sinh và cần cuộc gọi hoạt động cùng dữ liệu đó.',
        path: ROUTES.crmIntegration,
        cta: 'Xem tổng đài tích hợp CRM',
      },
      {
        title: 'Ước tính chi phí',
        detail:
          'Nhập quy mô đội tư vấn và nhu cầu sử dụng để xem các yếu tố cấu thành chi phí triển khai.',
        path: ROUTES.costEstimator,
        cta: 'Ước tính chi phí',
      },
    ],
  },

  faq: [
    {
      q: 'Gcalls phù hợp với loại tổ chức giáo dục nào?',
      a: 'Gcalls phù hợp với tổ chức có đội ngũ liên hệ người quan tâm qua điện thoại thường xuyên và cần theo dõi lịch sử trao đổi — trung tâm đào tạo, trường học, đơn vị tư vấn du học hoặc nền tảng học trực tuyến. Mức độ phù hợp được xác định theo quy trình và khối lượng cuộc gọi thực tế.',
    },
    {
      q: 'Có kết nối được với phần mềm quản lý tuyển sinh đang dùng không?',
      a: 'Khả năng kết nối phụ thuộc vào nền tảng, phiên bản và API mà phần mềm đó cung cấp. Gcalls có kinh nghiệm tích hợp với nhiều hệ thống CRM; phạm vi cụ thể được khảo sát trước khi triển khai.',
      link: { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
    },
    {
      q: 'Gcalls xử lý thế nào khi số gọi ra bị đánh dấu làm phiền?',
      a: 'Đây là vấn đề gắn với quy định viễn thông và cách tổ chức hoạt động gọi ra, nên không có một cấu hình chung cho mọi trường hợp. Gcalls khảo sát cách đội ngũ đang gọi, số lượng đầu số đang dùng và tần suất liên hệ để đề xuất phương án phù hợp trong quá trình tư vấn.',
    },
    {
      q: 'Triển khai mất bao lâu?',
      a: 'Thời gian phụ thuộc vào số lượng người dùng, số hotline và phạm vi tích hợp với hệ thống hiện có. Gcalls đưa ra mốc thời gian cụ thể sau bước khảo sát, không áp dụng một thời hạn cố định cho mọi tổ chức.',
    },
  ],

  finalCta: {
    eyebrow: 'GIÁO DỤC',
    h2: 'Trao đổi về quy trình tuyển sinh hiện tại của tổ chức',
    description:
      'Chia sẻ cách đội tư vấn đang làm việc, nguồn dữ liệu người quan tâm và hệ thống đang dùng để Gcalls đề xuất cấu hình phù hợp.',
    primaryCta: {
      label: 'Đăng ký tư vấn cho tổ chức giáo dục',
      path: ROUTES.contact,
    },
  },
}
