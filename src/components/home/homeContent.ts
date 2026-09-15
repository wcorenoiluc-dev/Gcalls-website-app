/**
 * Homepage copy — the DEFAULT content for every homepage section, moved out
 * of the section components so Gcalls Content Studio can publish overrides
 * for it (see `src/content/sections/home.ts`).
 *
 * ---------------------------------------------------------------------------
 * THIS IS THE APPROVED HOMEPAGE COPY. Every string here was previously inline
 * in `src/components/home/*.tsx` and was moved verbatim — nothing was
 * rewritten. The claim-safety notes that sat beside each block in the
 * component files still apply: no ROI figures, no setup-time claims, no
 * "100%" coverage, no uptime, no customer counts.
 * ---------------------------------------------------------------------------
 *
 * Shape rules (so `useGcallsContent` can merge published overrides safely):
 *  - only strings, booleans, string[] and arrays of flat string objects;
 *  - icons, colours and routes stay in the component (parallel style arrays
 *    keyed by index), so an editor can change words but never a link target
 *    or a brand colour.
 *
 * A plain `.ts` module (not `.tsx`) so React Fast Refresh keeps working for
 * the component files.
 */

export const HOME_PAIN_POINTS = {
  badge: 'NỖI ĐAU DOANH NGHIỆP',
  heading: '“Khoảng Trống” Vận Hành Khiến Doanh Nghiệp',
  headingHighlight: 'Rò Rỉ Khách Hàng Và Thất Thoát Doanh Thu',
  description:
    'Đội Sales và CSKH có thể mất nhiều thời gian và dữ liệu khi hệ thống nghe gọi, quản lý khách hàng và báo cáo vận hành hoạt động rời rạc.',
  /** The six approved pain points — wording is fixed. */
  items: [
    {
      title: 'Gián đoạn hoạt động telesales khi số gọi ra bị khóa hoặc bị người nhận báo cáo spam',
      desc: 'Chiến dịch gọi ra đang chạy có thể dừng giữa chừng, đội ngũ phải chờ xử lý đầu số trước khi tiếp tục liên hệ khách hàng.',
    },
    {
      title: 'Khách hàng e ngại và từ chối cuộc gọi đến từ số lạ',
      desc: 'Khi cuộc gọi không mang dấu hiệu nhận diện, người nhận khó biết ai đang gọi và thường bỏ qua trước khi nghe nội dung tư vấn.',
    },
    {
      title: 'Quản lý khó kiểm soát chất lượng tư vấn thực tế',
      desc: 'Nếu không có ghi âm, ghi chú và tiêu chí đánh giá tập trung, quản lý chỉ nắm được một phần nội dung trao đổi giữa nhân viên và khách hàng.',
    },
    {
      title: 'Thiếu dữ liệu thời gian thực để đánh giá hiệu suất đội ngũ',
      desc: 'Báo cáo tổng hợp thủ công thường đến sau khi vấn đề đã xảy ra, khiến quản lý khó điều phối nguồn lực trong ngày.',
    },
    {
      title: 'Chi phí cao và tỷ lệ bắt máy thấp khi liên hệ thị trường quốc tế',
      desc: 'Gọi ra thị trường nước ngoài bằng đầu số không phù hợp làm tăng chi phí liên lạc và giảm khả năng khách hàng nhận máy.',
    },
    {
      title: 'Nhân viên mất thời gian nhập liệu và đối chiếu thông tin thủ công',
      desc: 'Mỗi cuộc gọi kéo theo thao tác sao chép, nhập lại và kiểm tra chéo giữa các hệ thống, làm chậm quy trình và dễ phát sinh sai sót.',
    },
  ],
}

export const HOME_SOLUTION_BRIDGE = {
  badge: 'GIẢI PHÁP TỔNG ĐÀI GCALLS',
  heading: 'Tổng Đài Thông Minh Gcalls: Bứt Phá Doanh Số Đội Ngũ & Nâng Cao Trải Nghiệm Khách Hàng',
  description:
    'Gcalls kết nối hoạt động nghe gọi, dữ liệu khách hàng, lịch sử chăm sóc và báo cáo vận hành trong một hệ thống thống nhất, đồng thời hỗ trợ tích hợp với CRM, Helpdesk, POS và các giải pháp tự động hóa phù hợp.',
  /** Capability chips — every one names a CAPABILITY, not an outcome. */
  chips: [
    'Vận hành trên trình duyệt',
    'Tích hợp CRM, POS và Helpdesk',
    'Hỗ trợ nhu cầu liên lạc quốc tế',
    'Báo cáo theo thời gian thực',
  ],
  ctaLabel: 'Khám phá hệ sinh thái Gcalls',
  secondaryLabel: 'Hoặc trao đổi trực tiếp với đội ngũ Gcalls',
}

export const HOME_ECOSYSTEM = {
  badge: 'HỆ SINH THÁI GCALLS',
  heading: 'Hệ sinh thái sản phẩm và',
  headingHighlight: 'giải pháp Gcalls',
  description:
    'Doanh nghiệp có thể bắt đầu từ một sản phẩm phù hợp với nhu cầu hiện tại, sau đó mở rộng sang các giải pháp tích hợp khi quy mô vận hành thay đổi.',
  productsEyebrow: 'Sản phẩm',
  productsTitle: 'Sản phẩm Gcalls',
  productsLead:
    'Ba nền tảng Gcalls xây dựng cho hoạt động nghe gọi, kiểm soát chất lượng và chăm sóc khách hàng đa kênh.',
  /** Three products Gcalls builds. `supporting` is the small label under the name. */
  products: [
    {
      name: 'Gcalls Plus Webphone',
      supporting: '',
      desc: 'Tổng đài trên trình duyệt hỗ trợ nghe gọi, lịch sử cuộc gọi, ghi âm, danh bạ và theo dõi hoạt động đội ngũ.',
    },
    {
      name: 'QA/QC Center',
      supporting: 'QC Bot AI',
      desc: 'Hỗ trợ chuyển giọng nói thành văn bản, phân tích từ khóa, chấm điểm theo tiêu chí và tổng hợp dữ liệu phục vụ kiểm soát chất lượng.',
    },
    {
      name: 'Gcalls CX',
      supporting: '',
      desc: 'Nền tảng Contact Center hỗ trợ quản lý tương tác đa kênh và quy trình chăm sóc khách hàng.',
    },
  ],
  solutionsEyebrow: 'Giải pháp',
  solutionsTitle: 'Giải pháp Gcalls',
  solutionsLead:
    'Các cấu hình triển khai theo hệ thống, thị trường và nhu cầu tự động hóa doanh nghiệp đang vận hành.',
  /** Voicebot is a SOLUTION, not a Gcalls product — do not move it. */
  solutions: [
    {
      name: 'Giải pháp tích hợp Voicebot AI',
      desc: 'Gcalls tư vấn, kết nối và tích hợp Voicebot vào hệ thống tổng đài theo kịch bản và phạm vi triển khai của doanh nghiệp.',
    },
    { name: 'Tổng đài tích hợp CRM', desc: 'Kết nối cuộc gọi với dữ liệu và quy trình trên CRM của doanh nghiệp.' },
    { name: 'Tổng đài tích hợp Helpdesk', desc: 'Đưa cuộc gọi vào quy trình hỗ trợ và ticket của đội CSKH.' },
    { name: 'Tổng đài tích hợp POS', desc: 'Kết nối cuộc gọi với dữ liệu bán hàng và đơn hàng trên hệ thống POS.' },
    { name: 'Tổng đài quốc tế', desc: 'Đầu số và phương án liên lạc theo từng thị trường doanh nghiệp phục vụ.' },
    { name: 'Cloud Call Center', desc: 'Hệ thống tổng đài vận hành trên nền tảng Cloud với SIP, IVR và điều hướng cuộc gọi.' },
    { name: 'Call Button Widget', desc: 'Nút gọi nhúng vào website để khách truy cập để lại số điện thoại cho đội ngũ liên hệ lại.' },
  ],
  primaryCtaLabel: 'Xem tất cả sản phẩm',
  secondaryCtaLabel: 'Xem tất cả giải pháp',
}

export const HOME_CALL_TIMELINE = {
  badge: 'Hoạt động cuộc gọi Realtime',
  heading: 'Theo dõi toàn bộ hoạt động cuộc gọi',
  headingHighlight: 'theo thời gian thực',
  description:
    'Từ cuộc gọi đến, cuộc gọi đi, cuộc gọi nhỡ, ghi âm, ghi chú đến đánh giá chất lượng cuộc gọi — tất cả đều được lưu trữ tập trung trên Gcalls Webphone.',
  features: [
    'Lưu lịch sử cuộc gọi tự động',
    'Ghi âm và nghe lại cuộc gọi',
    'Gắn nhãn và phân loại khách hàng',
    'Ghi chú sau mỗi cuộc gọi',
    'Theo dõi trạng thái cuộc gọi',
    'Tìm kiếm lịch sử nhanh chóng',
  ],
  highlightHeading: 'Mỗi cuộc gọi đều trở thành',
  highlightHighlight: 'dữ liệu giá trị',
  highlightDescription:
    'Lịch sử trao đổi, ghi âm, ghi chú và kết quả cuộc gọi được lưu lại giúp đội Sales và CSKH tiếp nối công việc với đầy đủ ngữ cảnh của lần liên hệ trước.',
  ctaLabel: 'Xem tính năng Timeline',
}

export const HOME_CRM = {
  badge: 'CRM Mini Tích Hợp',
  heading: 'Quản lý khách hàng',
  headingHighlight: 'tập trung',
  headingTail: 'ngay trên Gcalls',
  description:
    'Toàn bộ thông tin khách hàng, lịch sử tương tác và ghi chú chăm sóc được lưu trữ tập trung giúp đội Sales và CSKH làm việc hiệu quả hơn.',
  features: [
    'Danh bạ khách hàng tập trung',
    'Hồ sơ khách hàng chi tiết',
    'Ghi chú và lịch sử chăm sóc',
    'Phân loại khách hàng bằng Tag',
    'Tìm kiếm khách hàng nhanh chóng',
    'Theo dõi hoạt động theo thời gian thực',
  ],
  highlightHeading: 'Mỗi khách hàng đều có',
  highlightHighlight: 'một hồ sơ riêng',
  highlightDescription:
    'Khi có cuộc gọi đến hoặc đi, nhân viên có thể xem ngay thông tin khách hàng, lịch sử chăm sóc, ghi chú và các hoạt động liên quan mà không cần chuyển đổi giữa nhiều hệ thống.',
  useCases: [
    { role: 'Sales Team', points: ['Xem hồ sơ KH trước khi gọi', 'Ghi chú kết quả tư vấn ngay sau cuộc gọi', 'Theo dõi pipeline theo từng KH'] },
    { role: 'CSKH Team', points: ['Biết ngay lịch sử KH khi nhận cuộc gọi', 'Gắn nhãn phân loại mức độ ưu tiên', 'Ghi nhận phản hồi và yêu cầu hỗ trợ'] },
    { role: 'Manager', points: ['Theo dõi tương tác toàn đội ngũ', 'Kiểm soát chất lượng chăm sóc KH', 'Báo cáo hoạt động theo KH / nhân viên'] },
  ],
}

export const HOME_ANALYTICS = {
  badge: 'Analytics & KPI Dashboard',
  heading: 'Theo dõi hiệu suất đội ngũ',
  headingHighlight: 'theo thời gian thực',
  description:
    'Dashboard trực quan giúp quản lý theo dõi tình trạng cuộc gọi, hiệu suất nhân viên và chất lượng vận hành chỉ trong vài giây.',
  features: [
    'Thống kê cuộc gọi theo ngày, tuần, tháng',
    'Theo dõi hiệu suất từng nhân viên',
    'Báo cáo cuộc gọi đến và đi',
    'Theo dõi cuộc gọi nhỡ',
    'Đo lường thời lượng cuộc gọi',
    'Dashboard realtime',
  ],
  highlightHeading: 'Ra quyết định nhanh hơn với',
  highlightHighlight: 'dữ liệu trực quan',
  highlightDescription:
    'Không cần tổng hợp báo cáo thủ công từ nhiều nguồn. Mọi chỉ số quan trọng đều được hiển thị trực quan giúp quản lý nhanh chóng nắm bắt tình hình vận hành.',
  ctaLabel: 'Khám phá Analytics',
  metricsHeading: 'Các chỉ số quan trọng trong',
  metricsHighlight: 'một màn hình',
  /** ILLUSTRATIVE FIGURES caption — must stay with the metric grid. */
  metricsNote:
    'Các chỉ số Gcalls Analytics theo dõi. Số liệu bên dưới là dữ liệu minh họa, không phải kết quả đo được của một doanh nghiệp cụ thể.',
  useCasesHeading: 'Dành cho',
  useCasesHighlight: 'quản lý, trưởng nhóm và chủ doanh nghiệp',
  useCases: [
    { role: 'Sales Manager', desc: 'Theo dõi KPI từng nhân viên Sales, phân tích tỷ lệ chốt deal và hiệu quả cuộc gọi.' },
    { role: 'CSKH Manager', desc: 'Giám sát chất lượng phục vụ, theo dõi thời gian xử lý và mức độ hài lòng khách hàng.' },
    { role: 'Business Owner', desc: 'Nắm tổng quan hiệu suất vận hành, so sánh theo giai đoạn và ra quyết định chiến lược.' },
    { role: 'Operation Team', desc: 'Cấu hình báo cáo tự động, phân tích tắc nghẽn luồng cuộc gọi và tối ưu phân công.' },
  ],
}

export const HOME_CLOUD = {
  badge: 'Cloud Call Center',
  heading: 'Xây dựng hệ thống tổng đài doanh nghiệp',
  headingHighlight: 'trên nền tảng Cloud',
  description:
    'Từ doanh nghiệp nhỏ đến Contact Center nhiều chi nhánh, Gcalls giúp triển khai hệ thống tổng đài linh hoạt, dễ mở rộng và vận hành hoàn toàn trên nền tảng điện toán đám mây.',
  features: [
    'SIP Account Management',
    'IVR nhiều cấp',
    'Call Routing thông minh',
    'Nhóm đổ chuông',
    'Chuyển tiếp cuộc gọi',
    'Hotline đa đầu số',
  ],
  highlightHeading: 'Điều hướng cuộc gọi đến',
  highlightHighlight: 'đúng người phụ trách',
  highlightDescription:
    'Cấu hình luồng cuộc gọi tới đúng bộ phận, đúng nhân viên hoặc đúng chi nhánh, kèm nhóm đổ chuông và chuyển tiếp cho trường hợp không có người nhận máy.',
  ctaLabel: 'Xem Cloud PBX',
  gridHeading: 'Đầy đủ tính năng',
  gridHighlight: 'Cloud PBX doanh nghiệp',
  gridItems: [
    { label: 'SIP Account', desc: 'Tài khoản SIP cho từng nhân viên, đa thiết bị' },
    { label: 'IVR', desc: 'Cây menu tự động nhiều cấp, cấu hình linh hoạt' },
    { label: 'Call Routing', desc: 'Điều hướng thông minh theo kỹ năng, thời gian' },
    { label: 'Ring Group', desc: 'Đổ chuông đồng thời hoặc tuần tự nhiều agent' },
    { label: 'Multi Branch', desc: 'Kết nối nhiều văn phòng, chi nhánh trên 1 hệ thống' },
    { label: 'Số quốc tế', desc: 'DID nội địa & quốc tế, số ảo nhiều vùng' },
    { label: 'Call Forwarding', desc: 'Chuyển tiếp đến di động, email hoặc voicemail' },
    { label: 'Voicemail', desc: 'Hộp thư thoại, nhận qua email, ghi âm lưu trữ' },
  ],
  flowHeading: 'Hành trình cuộc gọi từ',
  flowHighlight: 'đầu đến cuối',
  flowNote: 'Các bước một cuộc gọi đi qua, theo luồng doanh nghiệp cấu hình',
  flowSteps: [
    { label: 'Khách hàng gọi đến', note: '1900 1234 · 028 xxxx' },
    { label: 'IVR', note: 'Bấm 1–Sales, 2–CSKH' },
    { label: 'Call Routing', note: 'Phân phối thông minh' },
    { label: 'Ring Group', note: 'Đổ chuông đồng thời' },
    { label: 'Agent', note: 'Nhân viên nhận máy' },
    { label: 'Recording', note: 'Ghi âm tự động cuộc gọi' },
    { label: 'Analytics', note: 'Báo cáo realtime' },
  ],
}

export const HOME_CUSTOMER_POPUP = {
  badge: 'Customer Popup',
  heading: 'Nhận diện khách hàng',
  headingHighlight: 'ngay khi cuộc gọi đến',
  description:
    'Khi có cuộc gọi đến, nhân viên xem được thông tin khách hàng lấy từ hệ thống đã kết nối — trong phạm vi tích hợp được cấu hình cho doanh nghiệp.',
  benefits: [
    'Biết khách hàng là ai trước khi bắt máy',
    'Xem lịch sử chăm sóc và ghi chú đã lưu',
    'Không cần hỏi lại thông tin đã có',
    'Giữ ngữ cảnh trao đổi giữa các lần liên hệ',
  ],
  note: 'Thông tin hiển thị theo dữ liệu có trong hệ thống đã kết nối',
}

export const HOME_CALL_WIDGET = {
  badge: 'Call Button Widget',
  heading: 'Biến khách truy cập website',
  headingHighlight: 'thành cuộc gọi',
  description:
    'Nhúng nút gọi vào website chỉ với vài dòng code. Khách truy cập để lại số điện thoại và đội ngũ gọi lại theo cấu hình phân phối cuộc gọi của doanh nghiệp.',
  benefits: [
    'Tăng tỷ lệ chuyển đổi từ visitor thành lead',
    'Thu thập số điện thoại và gọi lại tức thì',
    'Theo dõi nguồn cuộc gọi từ từng trang web',
  ],
  callbackChip: 'Gọi lại theo cấu hình',
  ecosystemHeading: 'Hệ sinh thái',
  ecosystemHighlight: 'tích hợp của Gcalls',
  ecosystemNote: 'Các nền tảng Gcalls có thể kết nối, theo phạm vi tích hợp được xác nhận',
}

export const HOME_INTEGRATION_CTA = {
  badge: 'Integration CTA',
  heading: 'Kết nối Gcalls với',
  headingHighlight: 'hệ thống CRM',
  headingTail: 'của doanh nghiệp bạn',
  description:
    'Gcalls giúp doanh nghiệp đồng bộ dữ liệu khách hàng, cuộc gọi và hoạt động chăm sóc khách hàng với CRM, Helpdesk và các hệ thống nội bộ thông qua API mở và Webhook.',
  /** Conditionally worded on purpose — see the claim register in IntegrationsSection.tsx. */
  features: [
    { label: 'Open API', desc: 'API để kết nối Gcalls với hệ thống nội bộ. Phạm vi được xác nhận theo yêu cầu triển khai.' },
    { label: 'Webhook', desc: 'Nhận sự kiện cuộc gọi để hệ thống của doanh nghiệp xử lý tiếp, theo cấu hình.' },
    { label: 'Customer Context', desc: 'Hiển thị thông tin khách hàng lấy từ hệ thống đã kết nối, theo phạm vi cấu hình.' },
    { label: 'Click To Call', desc: 'Gọi từ hệ thống đang dùng, ở những nền tảng có hỗ trợ trong phạm vi tích hợp.' },
    { label: 'CRM Integration', desc: 'Kết nối cuộc gọi với HubSpot, Salesforce và Zoho CRM. Mỗi nền tảng có trang riêng.' },
    { label: 'Data Sync', desc: 'Đồng bộ liên hệ và lịch sử tương tác theo cấu hình, thay cho nhập liệu thủ công.' },
  ],
  ctaBadge: 'Tích hợp theo phạm vi được xác nhận',
  ctaHeading: 'Trao đổi phạm vi tích hợp cùng đội ngũ Gcalls',
  ctaDescription:
    'Từ CRM, Helpdesk đến các hệ thống nội bộ — Gcalls kết nối qua API mở. Phạm vi và công việc cần thiết được đánh giá trong quá trình khảo sát kỹ thuật.',
  ctaPrimaryLabel: 'Đăng ký demo',
  ctaSecondaryLabel: 'Tư vấn tích hợp',
  ctaNote: 'Đăng ký để nhận tư vấn cấu hình phù hợp với nhu cầu',
}

export const HOME_WORK_FROM_ANYWHERE = {
  badge: 'Work From Anywhere',
  heading: 'Mang tổng đài doanh nghiệp',
  headingHighlight: 'theo bạn đến bất kỳ đâu',
  description:
    'Dù đang ở văn phòng, làm việc tại nhà hay di chuyển gặp khách hàng, đội ngũ vẫn có thể tiếp nhận và thực hiện cuộc gọi như đang ngồi tại tổng đài.',
  quickBenefits: [
    'Đăng nhập trên trình duyệt',
    'Không cần cài đặt phức tạp',
    'Làm việc mọi nơi',
    'Đồng bộ dữ liệu realtime',
  ],
  featuresHeading: 'Chỉ cần trình duyệt là',
  featuresHighlight: 'có thể bắt đầu',
  features: [
    { label: 'Webphone', desc: 'Gọi điện trực tiếp trên Chrome, Edge, Safari — không cài extension' },
    { label: 'Softphone', desc: 'Chất lượng âm thanh HD, noise cancellation, dễ cấu hình' },
    { label: 'Cloud System', desc: 'Dữ liệu lưu trên Cloud, truy cập bất cứ đâu, không phụ thuộc server nội bộ' },
    { label: 'Auto Sync', desc: 'Lịch sử, ghi chú, trạng thái đồng bộ tức thì giữa các thiết bị' },
  ],
  statusHeading: 'Biết đội ngũ đang làm gì',
  statusHighlight: 'theo thời gian thực',
  statusDescription:
    'Quản lý theo dõi trạng thái từng nhân viên, lịch sử hoạt động và hiệu suất — dù đội ngũ đang làm việc từ bất kỳ đâu.',
  statusBenefits: [
    { label: 'Quản lý từ xa', desc: 'Theo dõi đội ngũ làm việc ở mọi nơi' },
    { label: 'Activity Tracking', desc: 'Ghi lại mọi thay đổi trạng thái' },
    { label: 'KPI Support', desc: 'Dữ liệu hỗ trợ đánh giá năng suất' },
    { label: 'Minh bạch hoạt động', desc: 'Mọi hành động đều được ghi nhận' },
  ],
}

export const HOME_USE_CASES_FINAL_CTA = {
  badge: 'USE CASES',
  heading: 'Tổng đài doanh nghiệp',
  headingHighlight: 'luôn đồng hành',
  headingTail: 'cùng đội ngũ của bạn',
  description:
    'Không cần phần cứng, không cần cài đặt phức tạp — chỉ cần trình duyệt và kết nối internet, đội ngũ của bạn đã có thể bắt đầu ngay.',
  useCasesHeading: 'Gcalls phù hợp với',
  useCasesHighlight: 'mô hình đội ngũ nào',
  /** The four approved homepage use cases (§13). "ghi âm 100%" is withheld. */
  useCases: [
    { role: 'Sales Team', points: ['Gọi cho KH từ bất kỳ đâu', 'Xem hồ sơ KH ngay trên trình duyệt', 'Ghi chú kết quả sau mỗi cuộc gọi'] },
    { role: 'Remote Team', points: ['Làm việc từ xa như tại văn phòng', 'Quản lý theo dõi realtime', 'Không cần VPN hay thiết bị đặc biệt'] },
    { role: 'Multi Branch', points: ['Kết nối nhiều chi nhánh trên 1 hệ thống', 'Đổ chuông liên chi nhánh', 'Báo cáo tổng hợp toàn bộ'] },
    { role: 'Contact Center', points: ['Điều phối đội ngũ theo ca', 'Giám sát trạng thái realtime', 'Ghi âm cuộc gọi theo cấu hình'] },
  ],
  ctaBadge: 'Sẵn sàng triển khai cùng đội ngũ Gcalls',
  ctaHeading: 'Bắt đầu với đội ngũ hiện tại của bạn',
  ctaDescription:
    'Đội ngũ Gcalls trao đổi về quy mô, hệ thống đang dùng và quy trình vận hành để đề xuất cấu hình phù hợp trước khi triển khai.',
  ctaPrimaryLabel: 'Đăng ký demo',
  ctaSecondaryLabel: 'Nhận tư vấn giải pháp',
  ctaNote: 'Đội ngũ Gcalls hỗ trợ cấu hình và triển khai theo nhu cầu thực tế',
}
