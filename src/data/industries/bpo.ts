/**
 * Approved content for /nganh/bpo/ — Checkpoint WEB-IND-001.
 *
 * ICP — PRIMARY: large operations needing automation, quality monitoring and
 * scale (ICP 5). BPO is the clearest case: the product being sold to the end
 * client IS call quality, so measuring it is not an internal nicety.
 * ICP — SECONDARY: businesses serving international markets (ICP 4), because a
 * large share of Vietnamese BPO work is delivered across borders.
 *
 * No third ICP. See the claim guard in `./types.ts`.
 *
 * ---------------------------------------------------------------------------
 * TWO GUARDS THAT BITE HARDEST ON THIS PAGE
 * ---------------------------------------------------------------------------
 * AI. Never state that AI replaces agents, that transcription or scoring is
 * accurate to any degree, or that every call is analysed. QA QC Center produces
 * INPUT FOR HUMAN REVIEW. Register: "hỗ trợ", "làm nổi bật tín hiệu cần kiểm
 * tra", "tùy phạm vi triển khai".
 *
 * INTERNATIONAL. `src/data/internationalCalling.ts` withholds "70+ quốc gia",
 * "tiết kiệm 80–90%", deployment timelines, brandname and SLA. This page
 * inherits every one of those. Say "nhiều thị trường" and "tùy quốc gia", link
 * to /tong-dai-quoc-te/, and let that page own the subject.
 */

import { ROUTES } from '@/config/navigation'
import type { IndustryContent } from './types'

export const BPO: IndustryContent = {
  id: 'bpo',
  route: ROUTES.bpo,
  breadcrumbLabel: 'BPO',
  lead: {
    intent: 'consultation',
    source: 'consultation',
    solution: 'Giải pháp cho doanh nghiệp BPO',
  },

  hero: {
    eyebrow: 'GIẢI PHÁP CHO DOANH NGHIỆP BPO',
    h1: 'Vận hành nhiều nhóm agent với cùng một mức kiểm soát chất lượng',
    description:
      'Với doanh nghiệp BPO, chất lượng cuộc gọi chính là sản phẩm bàn giao cho khách hàng. Gcalls hỗ trợ tập trung hoạt động nghe gọi của nhiều nhóm dự án và đưa việc đánh giá chất lượng ra khỏi giới hạn của việc nghe lại thủ công.',
    primaryCta: { label: 'Đăng ký tư vấn cho doanh nghiệp BPO' },
    secondaryCta: {
      label: 'Xem Gcalls hỗ trợ những gì',
      href: '#gcalls-ho-tro-bpo',
    },
    microcopy:
      'Gcalls khảo sát cơ cấu dự án, khối lượng cuộc gọi và yêu cầu báo cáo của từng khách hàng trước khi đề xuất cấu hình triển khai.',
  },

  problem: {
    eyebrow: 'BÀI TOÁN VẬN HÀNH',
    h2: 'Quy mô lớn làm lộ ra giới hạn của cách kiểm soát thủ công',
    description:
      'Những cách làm vẫn hiệu quả với một nhóm nhỏ thường không còn hiệu quả khi doanh nghiệp vận hành nhiều dự án song song.',
    items: [
      {
        n: '01',
        title: 'Kiểm tra chất lượng chỉ bao phủ một phần rất nhỏ',
        detail:
          'Đánh giá thủ công đòi hỏi người nghe lại từng cuộc gọi, nên trên thực tế chỉ một tỷ lệ nhỏ được kiểm tra. Phần còn lại không có cơ sở đánh giá nào.',
      },
      {
        n: '02',
        title: 'Quản lý mất rất nhiều giờ cho việc nghe lại',
        detail:
          'Thời gian của đội quản lý và QA dồn vào thao tác nghe và ghi chép, thay vì vào việc phân tích nguyên nhân và huấn luyện đội ngũ.',
      },
      {
        n: '03',
        title: 'Chất lượng không đồng đều giữa các nhóm dự án',
        detail:
          'Mỗi dự án có kịch bản và tiêu chí riêng. Khi không có cách đo chung, doanh nghiệp khó biết nhóm nào đang lệch chuẩn cho tới khi khách hàng phản hồi.',
      },
    ],
  },

  impact: {
    eyebrow: 'TÁC ĐỘNG TỚI HOẠT ĐỘNG',
    h2: 'Chất lượng không đo được là rủi ro hợp đồng',
    description:
      'Trong mô hình BPO, khả năng chứng minh chất lượng với khách hàng có giá trị ngang với việc tạo ra chất lượng đó.',
    items: [
      {
        title: 'Khó chứng minh chất lượng với khách hàng',
        detail:
          'Khi báo cáo chỉ dựa trên một mẫu nhỏ được nghe lại, doanh nghiệp khó đưa ra cơ sở thuyết phục về chất lượng của toàn bộ khối lượng công việc đã thực hiện.',
      },
      {
        title: 'Rủi ro chỉ được phát hiện khi đã thành khiếu nại',
        detail:
          'Những sai lệch so với kịch bản hoặc dấu hiệu bất mãn của khách hàng cuối thường chỉ lộ ra sau khi vấn đề đã phát sinh hậu quả.',
      },
      {
        title: 'Chi phí quản lý tăng nhanh hơn quy mô',
        detail:
          'Mỗi dự án mới kéo theo thêm nhân sự giám sát và thêm báo cáo phải tổng hợp thủ công, làm biên lợi nhuận giảm dần khi mở rộng.',
      },
    ],
  },

  capability: {
    eyebrow: 'GCALLS HỖ TRỢ NHỮNG GÌ',
    h2: 'Một lớp vận hành và giám sát chung cho nhiều nhóm dự án',
    description:
      'Gcalls đóng vai trò lớp kết nối và giám sát tập trung, làm việc cùng hệ thống mà doanh nghiệp và khách hàng của họ đang dùng.',
    anchorId: 'gcalls-ho-tro-bpo',
    items: [
      {
        title: 'Đánh giá chất lượng hội thoại có hệ thống',
        detail:
          'QA QC Center chuyển hội thoại thành transcript, hỗ trợ chấm điểm theo bộ tiêu chí của từng dự án và làm nổi bật những tín hiệu cần kiểm tra. Kết quả là đầu vào cho đội QA rà soát, không phải kết luận tự động.',
        path: ROUTES.qcCenter,
        linkLabel: 'Xem QA QC Center',
      },
      {
        title: 'Vận hành đa kênh cho các dự án chăm sóc khách hàng',
        detail:
          'Gcalls CX đưa các kênh liên hệ được kết nối về cùng một màn hình, để agent xử lý yêu cầu trên cùng một ngữ cảnh thay vì mở nhiều công cụ.',
        path: ROUTES.gcallsCx,
        linkLabel: 'Xem Gcalls CX',
      },
      {
        title: 'Tự động hóa các tác vụ gọi có kịch bản cố định',
        detail:
          'Những tác vụ lặp lại như nhắc lịch, xác nhận thông tin hay sàng lọc danh sách có thể được cân nhắc chuyển sang Voicebot, để agent tập trung vào tình huống cần xử lý bởi con người.',
        path: ROUTES.voicebotAi,
        linkLabel: 'Xem Gcalls Voicebot AI',
      },
      {
        title: 'Hoạt động nghe gọi cho khách hàng ở thị trường nước ngoài',
        detail:
          'Với dự án phục vụ khách hàng quốc tế, Gcalls hỗ trợ xác định loại đầu số phù hợp cho từng thị trường và chuẩn bị hồ sơ đăng ký theo quy định của quốc gia đó.',
        path: ROUTES.internationalCalling,
        linkLabel: 'Xem tổng đài quốc tế',
      },
    ],
    /**
     * NEEDS_GCALLS_VERIFICATION — the ICP source describes Gcalls as a central
     * integration layer connecting specialised AI partners, and names AI QC
     * keyword detection and call-quality scoring. QA QC Center covers the
     * evidenced part; the AI-partner ecosystem, sentiment detection and any
     * accuracy or coverage figure are NOT evidenced here and are withheld.
     *
     * NEEDS_GCALLS_VERIFICATION — "70+ quốc gia" for the international card.
     * Withheld per the claim guard in `src/data/internationalCalling.ts`; the
     * copy says "từng thị trường" and links to the page that owns the subject.
     */
    note: 'Phạm vi cuộc gọi được xử lý, bộ tiêu chí áp dụng và các chỉ số hiển thị trên báo cáo phụ thuộc vào cấu hình triển khai và dữ liệu được kết nối cho từng dự án. Với thị trường nước ngoài, loại đầu số và thủ tục đăng ký khác nhau tùy quốc gia.',
  },

  workflow: {
    eyebrow: 'ĐƯA VÀO QUY TRÌNH HIỆN TẠI',
    h2: 'Triển khai theo từng dự án, không thay đổi toàn bộ cùng lúc',
    description:
      'Cơ cấu dự án và cách tổ chức đội ngũ giữ nguyên. Việc triển khai thường bắt đầu từ một dự án rồi mở rộng.',
    steps: [
      {
        n: '01',
        title: 'Khảo sát cơ cấu dự án',
        detail:
          'Xác định số nhóm agent, khối lượng cuộc gọi và yêu cầu báo cáo của từng khách hàng đang phục vụ.',
      },
      {
        n: '02',
        title: 'Xây dựng bộ tiêu chí đánh giá',
        detail:
          'Định nghĩa tiêu chí chất lượng riêng cho từng dự án, dựa trên kịch bản và cam kết với khách hàng của dự án đó.',
      },
      {
        n: '03',
        title: 'Kết nối hệ thống và kênh liên hệ',
        detail:
          'Xác định phạm vi tích hợp với hệ thống của doanh nghiệp hoặc của khách hàng, theo khả năng thực tế của nền tảng đó.',
      },
      {
        n: '04',
        title: 'Chạy thử rồi mở rộng',
        detail:
          'Triển khai trên một dự án trước, đối chiếu kết quả với cách đánh giá hiện tại, sau đó áp dụng cho các dự án còn lại.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'GIÁ TRỊ KỲ VỌNG',
    h2: 'Những thay đổi thường được đặt làm mục tiêu',
    description:
      'Đây là các mục tiêu doanh nghiệp BPO thường đặt ra khi đưa hoạt động giám sát chất lượng về một hệ thống chung.',
    items: [
      {
        title: 'Giảm khối lượng nghe lại thủ công',
        detail:
          'Đội QA làm việc trên transcript và tín hiệu được làm nổi bật thay vì nghe lại tuần tự từng cuộc.',
      },
      {
        title: 'Cách đo chất lượng nhất quán giữa các dự án',
        detail:
          'Mỗi dự án có bộ tiêu chí riêng nhưng cùng một cơ chế đánh giá và báo cáo.',
      },
      {
        title: 'Phát hiện rủi ro sớm hơn',
        detail:
          'Các tín hiệu cần kiểm tra được đưa ra để đội QA rà soát, thay vì chờ tới khi có khiếu nại.',
      },
      {
        title: 'Chi phí quản lý bớt tăng theo quy mô',
        detail:
          'Việc tổng hợp báo cáo bớt phụ thuộc vào thao tác thủ công khi thêm dự án mới.',
      },
    ],
    /**
     * NEEDS_GCALLS_VERIFICATION — every figure the ICP source attaches to this
     * ICP: hours of manual review saved, percentage of calls analysed, staffing
     * cost reduction, and service availability beyond working hours. None is
     * evidenced. No figure appears above, and nothing states that AI replaces
     * agents or reviews 100% of calls.
     */
    note: 'Đây là mục tiêu vận hành, không phải cam kết kết quả. QA QC Center hỗ trợ đội QA chứ không thay thế việc rà soát của con người, và phạm vi cuộc gọi được xử lý phụ thuộc cấu hình triển khai. Gcalls chưa công bố số liệu đo lường cho mô hình BPO.',
  },

  routing: {
    eyebrow: 'XEM THÊM',
    h2: 'Các trang liên quan tới bài toán BPO',
    description:
      'Nếu một trong các nhu cầu dưới đây là ưu tiên hiện tại, đây là trang nên xem trước.',
    items: [
      {
        title: 'QA QC Center',
        detail:
          'Khi ưu tiên là mở rộng phạm vi đánh giá chất lượng hội thoại vượt quá khả năng nghe lại thủ công.',
        path: ROUTES.qcCenter,
        cta: 'Xem QA QC Center',
      },
      {
        title: 'Gcalls CX',
        detail:
          'Khi dự án yêu cầu xử lý liên hệ của khách hàng cuối trên nhiều kênh khác nhau.',
        path: ROUTES.gcallsCx,
        cta: 'Xem Gcalls CX',
      },
      {
        title: 'Tổng đài quốc tế',
        detail:
          'Khi dự án phục vụ khách hàng ở thị trường nước ngoài và cần đầu số phù hợp theo từng quốc gia.',
        path: ROUTES.internationalCalling,
        cta: 'Xem tổng đài quốc tế',
      },
    ],
  },

  faq: [
    {
      q: 'QA QC Center có đánh giá được toàn bộ cuộc gọi không?',
      a: 'Phạm vi cuộc gọi được xử lý phụ thuộc vào cấu hình triển khai và dữ liệu được kết nối cho từng dự án. QA QC Center hỗ trợ mở rộng phạm vi đánh giá so với cách nghe lại thủ công, nhưng kết quả là đầu vào cho đội QA rà soát chứ không phải kết luận tự động thay cho con người.',
      link: { label: 'QA QC Center', path: ROUTES.qcCenter },
    },
    {
      q: 'Mỗi dự án có bộ tiêu chí riêng thì cấu hình thế nào?',
      a: 'Bộ tiêu chí đánh giá được định nghĩa theo từng dự án, dựa trên kịch bản và cam kết với khách hàng của dự án đó. Cách tổ chức tiêu chí và báo cáo được xác định trong quá trình khảo sát.',
    },
    {
      q: 'Có hỗ trợ dự án phục vụ khách hàng ở nước ngoài không?',
      a: 'Gcalls hỗ trợ xác định loại đầu số phù hợp cho từng thị trường và chuẩn bị hồ sơ đăng ký theo quy định của quốc gia đó. Loại đầu số có thể sử dụng, thủ tục và điều kiện vận hành khác nhau tùy quốc gia, nên phạm vi triển khai được xác định theo từng yêu cầu cụ thể.',
      link: { label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling },
    },
    {
      q: 'Gcalls có thay thế hệ thống của khách hàng cuối không?',
      a: 'Không. Gcalls đóng vai trò lớp vận hành và kết nối, làm việc cùng hệ thống mà doanh nghiệp BPO hoặc khách hàng của họ đang dùng. Phạm vi tích hợp cụ thể phụ thuộc vào nền tảng và API mà hệ thống đó cung cấp.',
    },
  ],

  finalCta: {
    eyebrow: 'BPO',
    h2: 'Trao đổi về cơ cấu dự án và yêu cầu chất lượng hiện tại',
    description:
      'Chia sẻ số nhóm agent, khối lượng cuộc gọi và yêu cầu báo cáo của khách hàng để Gcalls đề xuất cấu hình triển khai phù hợp.',
    primaryCta: {
      label: 'Đăng ký tư vấn cho doanh nghiệp BPO',
      path: ROUTES.contact,
    },
  },
}
