/**
 * Approved content for /nganh/thuong-mai-dien-tu/ — Checkpoint WEB-IND-001.
 *
 * ICP — PRIMARY: outbound customer-care teams (ICP 2). E-commerce is the
 * source's lead example, and its distinguishing problem is not lead volume but
 * RECOGNITION: the business is calling people who are already customers, and
 * they still do not pick up.
 * ICP — SECONDARY: businesses already running a CRM or order system (ICP 3),
 * because an outbound care call without order context is a wasted call.
 *
 * No third ICP. See the claim guard in `./types.ts`.
 *
 * ---------------------------------------------------------------------------
 * VOICE BRANDNAME — READ BEFORE EDITING THE CAPABILITY SECTION
 * ---------------------------------------------------------------------------
 * EVIDENCE CLASSIFICATION (corrected in WEB-IND-001A):
 * `SOURCE-DOCUMENTED — PRODUCT SCOPE CONFIRMATION REQUIRED`
 *
 * The claim IS documented in supplied Gcalls material — the ICP table for
 * outbound customer care names Voice Brandname as ICP 2's answer. What does
 * NOT exist is a product configuration in this repository establishing its
 * operational scope: no carrier list, no market coverage, no approval record,
 * no estimator field. A planning document proves the capability was proposed;
 * it does not establish where it works or what it delivers.
 *
 * Separately, `src/data/internationalCalling.ts` withholds brandname outright
 * for INTERNATIONAL numbers. That guard is untouched — the scoping below is
 * what keeps this page from contradicting it.
 *
 * It is referenced here under three hard conditions, all of which must survive
 * any future edit:
 *
 *   1. It is described as something Gcalls SURVEYS AND SUPPORTS REGISTRATION
 *      FOR with network operators — never as an active, shipped Gcalls feature.
 *   2. Availability is stated as conditional on carrier, market, recipient
 *      device and approval — never universal, never guaranteed.
 *   3. It is explicitly scoped to domestic numbers, so this page cannot be read
 *      as contradicting the international claim guard.
 *
 * If any of those three cannot be kept true, remove the card rather than soften
 * the wording.
 */

import { ROUTES } from '@/config/navigation'
import type { IndustryContent } from './types'

export const ECOMMERCE: IndustryContent = {
  id: 'ecommerce',
  route: ROUTES.ecommerce,
  breadcrumbLabel: 'Thương mại điện tử',
  lead: {
    intent: 'consultation',
    source: 'consultation',
    solution: 'Giải pháp cho ngành thương mại điện tử',
  },

  hero: {
    eyebrow: 'GIẢI PHÁP CHO NGÀNH THƯƠNG MẠI ĐIỆN TỬ',
    h1: 'Gọi cho khách hàng của chính mình mà vẫn được nhận ra',
    description:
      'Xác nhận đơn, xử lý đổi trả, khảo sát sau bán và các chiến dịch chăm sóc lại đều là cuộc gọi tới người đã mua hàng. Gcalls giúp hoạt động gọi ra đó diễn ra tập trung, có ngữ cảnh đơn hàng và gắn với nhận diện của doanh nghiệp.',
    primaryCta: { label: 'Đăng ký tư vấn cho doanh nghiệp thương mại điện tử' },
    secondaryCta: {
      label: 'Xem Gcalls hỗ trợ những gì',
      href: '#gcalls-ho-tro-thuong-mai-dien-tu',
    },
    microcopy:
      'Gcalls khảo sát các luồng gọi ra hiện tại, hệ thống đơn hàng đang dùng và điều kiện đăng ký với nhà mạng trước khi đề xuất phương án.',
  },

  problem: {
    eyebrow: 'BÀI TOÁN VẬN HÀNH',
    h2: 'Khách hàng đã mua hàng, nhưng vẫn không bắt máy',
    description:
      'Khác với bán hàng ra thị trường lạnh, thương mại điện tử gọi cho người đã có quan hệ với doanh nghiệp — nên tỷ lệ không bắt máy là một vấn đề khác hẳn về bản chất.',
    items: [
      {
        n: '01',
        title: 'Số lạ hiện lên và khách hàng không nhận ra thương hiệu',
        detail:
          'Trên màn hình khách hàng chỉ có một dãy số. Không có gì cho biết đây là shop họ vừa đặt hàng, nên phản xạ mặc định là không nghe hoặc từ chối cuộc gọi.',
      },
      {
        n: '02',
        title: 'Mỗi nhân viên dùng một số riêng',
        detail:
          'Khi mỗi người chăm sóc khách hàng gọi từ số của mình, doanh nghiệp không đồng bộ được nhận diện, không quản lý được chất lượng và khách hàng nhận mỗi lần một số khác nhau.',
      },
      {
        n: '03',
        title: 'Nhân viên gọi mà không có ngữ cảnh đơn hàng',
        detail:
          'Thông tin đơn hàng nằm ở hệ thống bán hàng, còn cuộc gọi diễn ra ở nơi khác. Nhân viên phải tra cứu song song hoặc hỏi lại khách hàng những thông tin doanh nghiệp đã có.',
      },
    ],
  },

  impact: {
    eyebrow: 'TÁC ĐỘNG TỚI HOẠT ĐỘNG',
    h2: 'Không liên lạc được với khách hàng cũ là chi phí kép',
    description:
      'Tệp khách hàng đã mua là tài sản đắt nhất của một doanh nghiệp thương mại điện tử. Không tiếp cận được tệp đó ảnh hưởng tới cả doanh thu lẫn hình ảnh thương hiệu.',
    items: [
      {
        title: 'Ngân sách remarketing không tới được người nhận',
        detail:
          'Các chiến dịch chăm sóc lại và khảo sát sau bán chỉ tạo ra giá trị khi khách hàng nghe máy. Tỷ lệ bắt máy thấp làm hỏng hiệu quả của cả chiến dịch.',
      },
      {
        title: 'Cuộc gọi chăm sóc bị hiểu nhầm là làm phiền',
        detail:
          'Khi cuộc gọi từ doanh nghiệp không khác gì một số lạ, khách hàng có thể báo cáo làm phiền — và uy tín thương hiệu chịu tác động từ chính hoạt động chăm sóc khách hàng.',
      },
      {
        title: 'Đơn hàng chậm được xác nhận',
        detail:
          'Với mô hình thanh toán khi nhận hàng, mỗi lần không liên hệ được là một lần đơn hàng bị treo, kéo theo chi phí giao hàng và tồn kho phát sinh.',
      },
    ],
  },

  capability: {
    eyebrow: 'GCALLS HỖ TRỢ NHỮNG GÌ',
    h2: 'Tập trung hoạt động gọi ra và gắn nó với dữ liệu đơn hàng',
    description:
      'Bốn nhóm năng lực dưới đây là những gì Gcalls thực hiện được cho hoạt động chăm sóc khách hàng sau bán.',
    anchorId: 'gcalls-ho-tro-thuong-mai-dien-tu',
    items: [
      {
        title: 'Gọi ra tập trung từ hệ thống của doanh nghiệp',
        detail:
          'Nhân viên gọi trên trình duyệt thay vì bằng số cá nhân, nên doanh nghiệp quản lý được nhận diện gọi ra, chất lượng cuộc gọi và lịch sử liên hệ ở một nơi.',
        path: ROUTES.gcallsPlus,
        linkLabel: 'Xem Gcalls Plus Webphone',
      },
      {
        title: 'Ngữ cảnh đơn hàng có sẵn khi gọi',
        detail:
          'Khi kết nối được với hệ thống bán hàng hoặc CRM đang dùng, thông tin đơn hàng có thể hiển thị cùng cuộc gọi, để nhân viên không phải tra cứu song song hoặc hỏi lại khách hàng.',
        path: ROUTES.posIntegration,
        linkLabel: 'Xem tổng đài tích hợp POS',
      },
      {
        title: 'Hợp nhất kênh liên hệ sau bán',
        detail:
          'Khi khách hàng liên hệ qua nhiều kênh khác nhau, Gcalls CX đưa các kênh được kết nối về cùng một màn hình để đội chăm sóc theo dõi yêu cầu trên cùng một ngữ cảnh.',
        path: ROUTES.gcallsCx,
        linkLabel: 'Xem Gcalls CX',
      },
      {
        /**
         * NEEDS_GCALLS_VERIFICATION — Voice Brandname. No product config,
         * carrier agreement, coverage list or approval record exists in this
         * repository. Published only under the three conditions in the file
         * header: consultation-and-registration support, conditional
         * availability, domestic scope. Do not restate it as a Gcalls feature.
         */
        title: 'Hiển thị tên thương hiệu khi gọi ra (Voice Brandname)',
        /**
         * The domestic scope lives in THIS string, not only in the section
         * note below it. `capability.items[].detail` is what the JSON-LD
         * `hasPart` ItemList emits, so a scope stated only in the note would be
         * absent from the structured data — and the card is also what a reader
         * sees first. WEB-IND-001A found that framing ambiguous and moved the
         * scope inline.
         */
        detail:
          'Voice Brandname là dịch vụ do nhà mạng trong nước cung cấp, cho phép hiển thị tên doanh nghiệp thay vì dãy số trên máy người nhận, và chỉ áp dụng cho đầu số trong nước. Gcalls hỗ trợ khảo sát điều kiện và chuẩn bị hồ sơ đăng ký với nhà mạng; việc kích hoạt do nhà mạng phê duyệt, không phải mặc định có sẵn. Khả năng hiển thị thực tế phụ thuộc nhà mạng, thiết bị của người nhận và kết quả phê duyệt, nên cần được xác nhận theo từng trường hợp.',
      },
    ],
    note: 'Voice Brandname áp dụng cho đầu số trong nước và không phải là cam kết hiển thị trên mọi thiết bị hay mọi nhà mạng. Với cuộc gọi tới thị trường nước ngoài, quy định hiển thị số khác nhau theo từng quốc gia và được khảo sát riêng.',
  },

  workflow: {
    eyebrow: 'ĐƯA VÀO QUY TRÌNH HIỆN TẠI',
    h2: 'Triển khai theo các luồng gọi ra đang chạy',
    description:
      'Không cần thay hệ thống bán hàng. Việc triển khai bắt đầu từ chính những luồng gọi ra doanh nghiệp đang thực hiện mỗi ngày.',
    steps: [
      {
        n: '01',
        title: 'Xác định các luồng gọi ra',
        detail:
          'Liệt kê những tình huống doanh nghiệp chủ động gọi khách hàng: xác nhận đơn, đổi trả, khảo sát, chăm sóc lại.',
      },
      {
        n: '02',
        title: 'Tập trung đầu số và người dùng',
        detail:
          'Chuyển hoạt động gọi ra từ số cá nhân sang hotline doanh nghiệp, kèm phân quyền theo nhóm chăm sóc khách hàng.',
      },
      {
        n: '03',
        title: 'Kết nối hệ thống đơn hàng',
        detail:
          'Xác định phạm vi tích hợp với nền tảng bán hàng hoặc CRM hiện có, theo khả năng thực tế của nền tảng đó.',
      },
      {
        n: '04',
        title: 'Khảo sát điều kiện đăng ký với nhà mạng',
        detail:
          'Nếu doanh nghiệp muốn hiển thị tên thương hiệu khi gọi ra, Gcalls hỗ trợ xác định điều kiện và hồ sơ cần chuẩn bị.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'GIÁ TRỊ KỲ VỌNG',
    h2: 'Những thay đổi thường được đặt làm mục tiêu',
    description:
      'Đây là các mục tiêu doanh nghiệp thương mại điện tử thường đặt ra khi tập trung hoạt động gọi ra sau bán.',
    items: [
      {
        title: 'Nhận diện thương hiệu nhất quán hơn',
        detail:
          'Khách hàng nhận cuộc gọi từ đầu số doanh nghiệp thay vì mỗi lần một số cá nhân khác nhau.',
      },
      {
        title: 'Cuộc gọi có ngữ cảnh đơn hàng',
        detail:
          'Nhân viên nắm thông tin đơn trước khi trao đổi, theo phạm vi tích hợp đã triển khai.',
      },
      {
        title: 'Hoạt động chăm sóc được quản lý tập trung',
        detail:
          'Lịch sử liên hệ nằm ở hệ thống, làm cơ sở cho các đợt chăm sóc lại về sau.',
      },
      {
        title: 'Giảm rủi ro bị hiểu nhầm là làm phiền',
        detail:
          'Hoạt động gọi ra gắn với nhận diện doanh nghiệp thay vì một dãy số không rõ nguồn.',
      },
    ],
    /**
     * NEEDS_GCALLS_VERIFICATION — the ICP source's claim of improved answer
     * rates through brand recognition, and any percentage attached to it. No
     * measurement exists in this repository, so no figure appears above and the
     * outcomes are stated as directional only.
     */
    note: 'Đây là mục tiêu vận hành, không phải cam kết kết quả. Gcalls chưa công bố số liệu về mức cải thiện tỷ lệ nghe máy; kết quả thực tế phụ thuộc tệp khách hàng, nội dung cuộc gọi, thiết bị người nhận và điều kiện của nhà mạng.',
  },

  routing: {
    eyebrow: 'XEM THÊM',
    h2: 'Các trang liên quan tới bài toán thương mại điện tử',
    description:
      'Nếu một trong các nhu cầu dưới đây là ưu tiên hiện tại, đây là trang nên xem trước.',
    items: [
      {
        title: 'Tổng đài tích hợp POS',
        detail:
          'Khi ưu tiên là đưa thông tin đơn hàng vào cùng luồng làm việc với cuộc gọi chăm sóc khách hàng.',
        path: ROUTES.posIntegration,
        cta: 'Xem tổng đài tích hợp POS',
      },
      {
        title: 'Gcalls CX',
        detail:
          'Khi khách hàng liên hệ qua nhiều kênh và đội chăm sóc đang phải mở nhiều công cụ để trả lời.',
        path: ROUTES.gcallsCx,
        cta: 'Xem Gcalls CX',
      },
      {
        title: 'Tổng đài tích hợp CRM',
        detail:
          'Khi doanh nghiệp đã có CRM và cần lịch sử chăm sóc nằm cùng hồ sơ khách hàng.',
        path: ROUTES.crmIntegration,
        cta: 'Xem tổng đài tích hợp CRM',
      },
    ],
  },

  faq: [
    {
      q: 'Voice Brandname có dùng được cho mọi khách hàng không?',
      a: 'Không. Voice Brandname là dịch vụ do nhà mạng trong nước cung cấp, chỉ áp dụng cho đầu số trong nước, và phụ thuộc vào nhà mạng, thiết bị của người nhận cũng như kết quả phê duyệt hồ sơ. Gcalls hỗ trợ khảo sát điều kiện và chuẩn bị hồ sơ đăng ký, nhưng việc kích hoạt do nhà mạng quyết định và khả năng hiển thị thực tế cần được xác nhận theo từng trường hợp cụ thể. Với cuộc gọi tới thị trường nước ngoài, quy định hiển thị số khác nhau theo từng quốc gia và được khảo sát riêng.',
    },
    {
      q: 'Có kết nối được với nền tảng bán hàng đang dùng không?',
      a: 'Khả năng kết nối phụ thuộc vào nền tảng, phiên bản và API mà nền tảng đó cung cấp. Phạm vi tích hợp cụ thể được khảo sát trước khi triển khai.',
      link: { label: 'Tổng đài tích hợp POS', path: ROUTES.posIntegration },
    },
    {
      q: 'Đội chăm sóc đang dùng nhiều kênh thì xử lý thế nào?',
      a: 'Gcalls CX hợp nhất các kênh được kết nối vào một màn hình để đội chăm sóc theo dõi yêu cầu của khách hàng trên cùng một ngữ cảnh. Các kênh có thể kết nối được xác định theo phạm vi triển khai.',
      link: { label: 'Gcalls CX', path: ROUTES.gcallsCx },
    },
    {
      q: 'Có cần bỏ số điện thoại nhân viên đang dùng không?',
      a: 'Việc chuyển hoạt động gọi ra về hotline doanh nghiệp thường được triển khai theo từng nhóm thay vì thay đổi toàn bộ cùng lúc. Lộ trình cụ thể được xác định trong quá trình khảo sát.',
    },
  ],

  finalCta: {
    eyebrow: 'THƯƠNG MẠI ĐIỆN TỬ',
    h2: 'Trao đổi về các luồng gọi ra sau bán của doanh nghiệp',
    description:
      'Chia sẻ cách đội chăm sóc đang liên hệ khách hàng và nền tảng bán hàng đang dùng để Gcalls đề xuất phương án phù hợp.',
    primaryCta: {
      label: 'Đăng ký tư vấn cho doanh nghiệp thương mại điện tử',
      path: ROUTES.contact,
    },
  },
}
