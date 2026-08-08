/**
 * Approved content for /tai-nguyen/glossary/ — Checkpoint WEB-RES-001.
 *
 * ---------------------------------------------------------------------------
 * THE DEFINITION RULE
 * ---------------------------------------------------------------------------
 * `definition` explains the CONCEPT as the industry uses it, with no reference
 * to Gcalls. `gcallsNote` — optional — is where the relationship to Gcalls goes,
 * and it is always qualified. The two must never be merged, because a glossary
 * that defines a term as "what our product does" is not a glossary.
 *
 * This separation is also what lets terms like Auto Dialer and Voice Brandname
 * appear here at all while remaining WITHHELD as Gcalls capabilities elsewhere:
 * defining an industry concept is not a claim to sell it. Read their
 * `gcallsNote` values before editing either — both say explicitly that Gcalls
 * has not published the capability or its scope, and neither may be softened
 * into an implied availability.
 *
 * `link` may only point at a route that is COMPLETE. A term whose topic has no
 * finished page simply carries no link.
 *
 * No ROI, saving, accuracy or coverage figure may appear in any definition.
 *
 * The `id` of every term is an ASCII slug and becomes the anchor target, so the
 * index at the top of the page and the DefinedTermSet JSON-LD are generated
 * from this one array and cannot drift from the rendered DOM.
 */

import { ROUTES } from '@/config/navigation'
import type { GlossaryContent } from './types'

export const GLOSSARY: GlossaryContent = {
  id: 'glossary',
  route: ROUTES.glossary,
  breadcrumbLabel: 'Glossary',
  lead: {
    intent: 'consultation',
    source: 'consultation',
    solution: 'Tư vấn giải pháp',
  },

  hero: {
    eyebrow: 'GLOSSARY',
    h1: 'Thuật ngữ tổng đài, tích hợp hệ thống và chất lượng hội thoại',
    description:
      'Hai mươi bốn thuật ngữ thường gặp khi doanh nghiệp đánh giá hoặc triển khai hệ thống liên lạc với khách hàng. Mỗi mục giải thích khái niệm theo cách ngành đang dùng trước, rồi mới nói tới liên quan với Gcalls nếu có.',
    primaryCta: { label: 'Đăng ký tư vấn giải pháp' },
    secondaryCta: { label: 'Xem danh mục thuật ngữ', href: '#danh-muc-thuat-ngu' },
    microcopy:
      'Một số thuật ngữ mô tả năng lực chung của ngành, không đồng nghĩa với việc Gcalls cung cấp năng lực đó. Những trường hợp như vậy được ghi rõ ngay trong mục tương ứng.',
  },

  purpose: {
    eyebrow: 'MỤC ĐÍCH VÀ ĐỐI TƯỢNG',
    h2: 'Để đọc tài liệu và báo giá mà không phải đoán nghĩa',
    description:
      'Tài liệu kỹ thuật và báo giá trong lĩnh vực này dùng rất nhiều thuật ngữ tiếng Anh, và cùng một từ đôi khi được các nhà cung cấp hiểu khác nhau. Trang này giải thích nghĩa phổ biến của từng thuật ngữ để người đọc hỏi lại đúng chỗ.',
    audience: [
      {
        title: 'Người đọc báo giá và hồ sơ giải pháp',
        detail:
          'Cần hiểu chính xác từng hạng mục được chào để so sánh giữa các nhà cung cấp trên cùng một mặt bằng.',
      },
      {
        title: 'Người mới tiếp nhận công việc vận hành tổng đài',
        detail:
          'Cần nắm nhanh các khái niệm mà đội ngũ đang dùng hằng ngày trong trao đổi nội bộ.',
      },
      {
        title: 'Người phối hợp giữa bộ phận kinh doanh và bộ phận kỹ thuật',
        detail:
          'Cần cùng một cách hiểu về API, SDK, đồng bộ dữ liệu và cam kết dịch vụ để trao đổi không lệch nhau.',
      },
    ],
    note: 'Nếu một thuật ngữ xuất hiện trong báo giá bạn đang đọc mà không có ở đây, hãy hỏi nhà cung cấp mô tả chính xác phạm vi của nó trước khi so sánh giá.',
  },

  index: {
    eyebrow: 'DANH MỤC',
    h2: 'Sáu nhóm thuật ngữ',
    description:
      'Chọn một nhóm để chuyển tới phần tương ứng, hoặc đọc lần lượt từ trên xuống.',
    anchorId: 'danh-muc-thuat-ngu',
  },

  groups: [
    {
      id: 'nen-tang-tong-dai',
      label: 'Nền tảng tổng đài',
      description:
        'Các khái niệm mô tả bản thân hệ thống tổng đài và nơi nó được vận hành.',
      terms: [
        {
          id: 'tong-dai-dam-may',
          term: 'Tổng đài đám mây',
          aka: ['Cloud PBX', 'Tổng đài ảo'],
          definition:
            'Hệ thống tổng đài được vận hành trên hạ tầng của nhà cung cấp dịch vụ và truy cập qua Internet, thay vì đặt thiết bị tổng đài tại văn phòng doanh nghiệp. Doanh nghiệp sử dụng dịch vụ theo cấu hình đã đăng ký, còn phần hạ tầng máy chủ và kết nối viễn thông do nhà cung cấp vận hành.',
          gcallsNote:
            'Các sản phẩm Gcalls hoạt động theo mô hình này. Chất lượng sử dụng phụ thuộc vào đường truyền Internet tại nơi làm việc, nên đây là hạng mục được khảo sát trước khi triển khai.',
          link: { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
        },
        {
          id: 'call-center',
          term: 'Call Center',
          aka: ['Trung tâm cuộc gọi'],
          definition:
            'Bộ phận hoặc hệ thống chuyên xử lý liên lạc với khách hàng qua kênh thoại — gọi đến, gọi đi hoặc cả hai. Đặc trưng của một call center là công việc được tổ chức quanh cuộc gọi: phân bổ cuộc gọi cho nhân viên, theo dõi trạng thái trực và ghi nhận kết quả từng cuộc.',
        },
        {
          id: 'contact-center',
          term: 'Contact Center',
          aka: ['Trung tâm liên lạc'],
          definition:
            'Mở rộng của call center sang nhiều kênh liên lạc ngoài thoại: chat, mạng xã hội, email, SMS. Điểm khác biệt không nằm ở số lượng kênh mà ở chỗ các kênh được quản lý trong cùng một luồng công việc, nên lịch sử của một khách hàng không bị chia nhỏ theo kênh.',
          gcallsNote:
            'Gcalls CX là sản phẩm hướng tới mô hình này. Các kênh được kết nối trong từng triển khai cụ thể được xác định theo nhu cầu và điều kiện kỹ thuật của doanh nghiệp.',
          link: { label: 'Gcalls CX', path: ROUTES.gcallsCx },
        },
        {
          id: 'webphone',
          term: 'Webphone',
          aka: ['Softphone trên trình duyệt'],
          definition:
            'Phần mềm cho phép thực hiện và nhận cuộc gọi ngay trong trình duyệt web, không cần điện thoại bàn hay ứng dụng cài đặt riêng. Nhân viên đăng nhập bằng tài khoản, và số máy gắn với tài khoản đó thay vì gắn với một thiết bị vật lý.',
          gcallsNote:
            'Gcalls Plus là sản phẩm webphone của Gcalls, kèm danh bạ, ghi chú và lịch sử cuộc gọi trong cùng giao diện.',
          link: { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
        },
      ],
    },
    {
      id: 'luong-tuong-tac',
      label: 'Luồng cuộc gọi và kênh tương tác',
      description:
        'Các khái niệm mô tả cách một cuộc gọi hoặc một yêu cầu của khách hàng đi qua hệ thống.',
      terms: [
        {
          id: 'ivr',
          term: 'IVR',
          aka: ['Interactive Voice Response', 'Trả lời tự động'],
          definition:
            'Hệ thống phát lời thoại tự động cho người gọi và nhận lựa chọn của họ qua phím bấm hoặc giọng nói, để dẫn cuộc gọi tới đúng bộ phận. IVR quyết định ấn tượng đầu tiên của người gọi, nên số tầng lựa chọn và độ dài lời thoại là quyết định vận hành chứ không chỉ là cấu hình kỹ thuật.',
          gcallsNote:
            'Cấu trúc IVR được thiết kế theo sơ đồ tổ chức và luồng tiếp nhận thực tế của từng doanh nghiệp trong quá trình triển khai.',
        },
        {
          id: 'call-flow',
          term: 'Call Flow',
          aka: ['Luồng cuộc gọi'],
          definition:
            'Sơ đồ mô tả đường đi của một cuộc gọi từ lúc kết nối tới lúc kết thúc: qua IVR nào, tới nhóm nào, chờ bao lâu, và xử lý ra sao khi không ai nghe máy hoặc ngoài giờ làm việc. Đây là tài liệu vận hành, cần được thống nhất trước khi cấu hình hệ thống.',
        },
        {
          id: 'click-to-call',
          term: 'Click-to-Call',
          aka: ['Gọi một chạm'],
          definition:
            'Cách thực hiện cuộc gọi bằng một thao tác nhấp chuột lên số điện thoại đang hiển thị trong một phần mềm khác — thường là CRM hoặc trang web — thay vì bấm lại số trên bàn phím. Giá trị của nó không chỉ là tiết kiệm thao tác mà còn là loại bỏ lỗi bấm nhầm số.',
          gcallsNote:
            'Trong các triển khai có tích hợp, thao tác này được thực hiện ngay trên giao diện hệ thống doanh nghiệp đang dùng. Phạm vi cụ thể phụ thuộc vào nền tảng được tích hợp.',
          link: { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
        },
        {
          id: 'goi-ra',
          term: 'Gọi ra (Outbound calling)',
          aka: ['Outbound'],
          definition:
            'Hoạt động chủ động gọi tới khách hàng: tư vấn, chăm sóc sau bán, nhắc lịch, thu hồi công nợ hoặc khảo sát. Khác với cuộc gọi đến, hoạt động gọi ra chịu ràng buộc về thời điểm liên hệ và quy định về quảng cáo qua điện thoại, nên cách tổ chức phải tính tới các ràng buộc đó.',
        },
        {
          id: 'omnichannel',
          term: 'Omnichannel',
          aka: ['Đa kênh hợp nhất'],
          definition:
            'Cách tổ chức trong đó mọi kênh liên lạc chia sẻ chung một lịch sử khách hàng, nên khách hàng chuyển từ kênh này sang kênh khác mà không phải kể lại từ đầu. Cần phân biệt với multichannel — nhiều kênh cùng tồn tại nhưng dữ liệu tách rời, mỗi kênh một hệ thống.',
          gcallsNote:
            'Gcalls CX hướng tới mô hình hợp nhất này cho các kênh được kết nối trong phạm vi triển khai đã thống nhất.',
          link: { label: 'Gcalls CX', path: ROUTES.gcallsCx },
        },
      ],
    },
    {
      id: 'goi-ra-quy-mo',
      label: 'Gọi ra quy mô lớn và nhận diện cuộc gọi',
      description:
        'Các khái niệm liên quan tới hoạt động gọi ra khối lượng lớn và cách người nhận nhìn thấy cuộc gọi.',
      terms: [
        {
          id: 'auto-dialer',
          term: 'Auto Dialer',
          aka: ['Auto Call', 'Quay số tự động'],
          definition:
            'Nhóm công cụ tự động quay số từ một danh sách thay vì để nhân viên bấm từng số, và chỉ chuyển máy cho nhân viên khi cuộc gọi được kết nối. Đây là năng lực phổ biến trong ngành call center, với nhiều biến thể khác nhau về cách quay số và cách phân bổ cuộc gọi.',
          gcallsNote:
            'Gcalls chưa công bố tính năng quay số tự động trên website này, nên thuật ngữ ở đây được giải thích như một khái niệm của ngành, không phải một tính năng đang được chào bán. Doanh nghiệp có bài toán gọi ra khối lượng lớn nên nêu cụ thể khi liên hệ để được trao đổi về phạm vi khả thi.',
        },
        {
          id: 'voice-brandname',
          term: 'Voice Brandname',
          aka: ['Hiển thị tên thương hiệu khi gọi'],
          definition:
            'Dịch vụ hiển thị tên thương hiệu doanh nghiệp thay cho dãy số khi gọi tới thuê bao, nhằm giúp người nhận nhận diện được người gọi. Đây là dịch vụ do nhà mạng cung cấp và phê duyệt, nên điều kiện đăng ký, phạm vi áp dụng và thời gian xử lý do nhà mạng quyết định.',
          gcallsNote:
            'Gcalls chưa công bố danh sách nhà mạng, phạm vi thị trường hay điều kiện áp dụng cho dịch vụ này, nên khả năng triển khai cho một doanh nghiệp cụ thể là hạng mục phải xác nhận riêng trước khi cam kết. Dịch vụ này cũng không được áp dụng mặc định cho đầu số quốc tế.',
        },
        {
          id: 'so-dien-thoai-quoc-te',
          term: 'Số điện thoại quốc tế',
          aka: ['Đầu số quốc tế', 'International phone number'],
          definition:
            'Đầu số thuộc mã vùng của một quốc gia khác, cho phép doanh nghiệp hiển thị và nhận cuộc gọi như một đơn vị hiện diện tại thị trường đó. Điều kiện cấp số, hồ sơ pháp lý và yêu cầu về địa chỉ đăng ký do cơ quan quản lý của từng quốc gia quy định và khác nhau đáng kể giữa các nước.',
          gcallsNote:
            'Khả năng cung cấp số tại một quốc gia cụ thể được xác nhận theo từng trường hợp, dựa trên quy định sở tại và hồ sơ mà doanh nghiệp có thể cung cấp.',
          link: { label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling },
        },
      ],
    },
    {
      id: 'tich-hop-he-thong',
      label: 'Tích hợp hệ thống',
      description:
        'Các khái niệm mô tả việc kết nối tổng đài với những phần mềm doanh nghiệp đang dùng.',
      terms: [
        {
          id: 'tich-hop-crm',
          term: 'Tích hợp CRM',
          aka: ['CRM integration'],
          definition:
            'Việc kết nối hệ thống tổng đài với phần mềm quản lý quan hệ khách hàng, để cuộc gọi và dữ liệu khách hàng làm việc cùng nhau: nhận diện người gọi theo hồ sơ, gọi trực tiếp từ giao diện CRM, và lưu kết quả cuộc gọi về đúng hồ sơ. Phạm vi khả thi luôn phụ thuộc vào API mà nền tảng CRM đó mở ra.',
          gcallsNote:
            'Gcalls có trang riêng cho từng nền tảng đã được triển khai, mô tả phạm vi kết nối thực tế thay vì một tuyên bố tương thích chung.',
          link: { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
        },
        {
          id: 'tich-hop-helpdesk',
          term: 'Tích hợp Helpdesk',
          aka: ['Helpdesk integration'],
          definition:
            'Việc kết nối tổng đài với phần mềm quản lý yêu cầu hỗ trợ, để cuộc gọi gắn với ticket đang xử lý: tạo ticket từ cuộc gọi, xem lịch sử hỗ trợ khi khách gọi tới, và ghi nhận nội dung trao đổi vào ticket tương ứng.',
          gcallsNote:
            'Phạm vi tích hợp phụ thuộc vào nền tảng helpdesk cụ thể và gói dịch vụ doanh nghiệp đang dùng ở nền tảng đó.',
          link: {
            label: 'Tổng đài tích hợp Helpdesk',
            path: ROUTES.helpdeskIntegration,
          },
        },
        {
          id: 'popup-thong-tin-khach-hang',
          term: 'Popup thông tin khách hàng',
          aka: ['Screen pop', 'Customer information popup'],
          definition:
            'Cửa sổ hiển thị thông tin người gọi ngay khi cuộc gọi đến, dựa trên việc đối chiếu số điện thoại với dữ liệu trong hệ thống doanh nghiệp. Chất lượng của tính năng này phụ thuộc hoàn toàn vào chất lượng dữ liệu: số điện thoại không được chuẩn hóa hoặc trùng ở nhiều hồ sơ sẽ làm giảm độ chính xác của việc nhận diện.',
          gcallsNote:
            'Thông tin hiển thị được lấy từ hệ thống được tích hợp, nên nội dung popup phụ thuộc vào dữ liệu và phạm vi kết nối của từng triển khai.',
          link: { label: 'Tổng đài tích hợp CRM', path: ROUTES.crmIntegration },
        },
        {
          id: 'dong-bo-lich-su-cuoc-goi',
          term: 'Đồng bộ lịch sử cuộc gọi',
          aka: ['Call history synchronization'],
          definition:
            'Việc ghi thông tin cuộc gọi — thời điểm, thời lượng, người thực hiện, kết quả và ghi chú — về hệ thống lưu hồ sơ khách hàng, để lịch sử liên hệ nằm cùng chỗ với dữ liệu khách hàng thay vì nằm riêng trong hệ thống tổng đài.',
          gcallsNote:
            'Trường dữ liệu nào được đồng bộ, theo chiều nào và với tần suất ra sao được xác định theo khả năng của nền tảng đích và thống nhất trong quá trình triển khai.',
        },
      ],
    },
    {
      id: 'ai-chat-luong',
      label: 'AI và chất lượng hội thoại',
      description:
        'Các khái niệm liên quan tới tự động hóa cuộc gọi và đánh giá chất lượng hội thoại.',
      terms: [
        {
          id: 'voicebot',
          term: 'Voicebot',
          aka: ['Trợ lý thoại tự động'],
          definition:
            'Hệ thống thực hiện hoặc tiếp nhận cuộc gọi bằng giọng nói tự động theo kịch bản đã thiết lập, thường dùng cho các tác vụ lặp lại như nhắc lịch, xác nhận thông tin hoặc sàng lọc nhu cầu. Một triển khai voicebot có trách nhiệm luôn định nghĩa rõ điều kiện chuyển cuộc gọi cho nhân viên khi tình huống vượt ngoài kịch bản.',
          gcallsNote:
            'Gcalls tư vấn, kết nối và tích hợp Voicebot vào quy trình của doanh nghiệp. Kịch bản, phạm vi áp dụng và điểm chuyển tiếp nhân viên được thiết kế theo từng trường hợp.',
          link: { label: 'Gcalls Voicebot AI', path: ROUTES.voicebotAi },
        },
        {
          id: 'ai-qc',
          term: 'AI QC (QC Bot)',
          aka: ['Kiểm soát chất lượng có hỗ trợ AI'],
          definition:
            'Việc dùng công cụ tự động để hỗ trợ đánh giá chất lượng hội thoại, thay vì chỉ dựa vào việc nghe lại thủ công một phần nhỏ cuộc gọi. Công cụ hỗ trợ phát hiện và sắp xếp thứ tự ưu tiên, còn kết luận đánh giá liên quan tới con người vẫn cần người kiểm chứng.',
          gcallsNote:
            'QA QC Center là sản phẩm của Gcalls cho nhóm bài toán này. Bộ tiêu chí đánh giá được xây dựng theo yêu cầu của từng doanh nghiệp.',
          link: { label: 'QA QC Center', path: ROUTES.qcCenter },
        },
        {
          id: 'speech-to-text',
          term: 'Speech-to-Text',
          aka: ['Chuyển giọng nói thành văn bản', 'STT'],
          definition:
            'Công nghệ chuyển nội dung hội thoại từ âm thanh sang văn bản, để hội thoại có thể tìm kiếm và phân tích được. Độ chính xác phụ thuộc vào chất lượng âm thanh, giọng vùng miền, tiếng ồn nền và mật độ thuật ngữ chuyên ngành, nên bản ghi văn bản luôn cần được xem như tài liệu tham chiếu chứ không phải biên bản tuyệt đối.',
          gcallsNote:
            'Trong QA QC Center, bản chuyển văn bản là đầu vào cho việc rà soát hội thoại. Gcalls không công bố mức độ chính xác cho ngôn ngữ hay bối cảnh cụ thể.',
          link: { label: 'QA QC Center', path: ROUTES.qcCenter },
        },
        {
          id: 'cham-diem-cuoc-goi',
          term: 'Chấm điểm cuộc gọi',
          aka: ['Call scoring', 'Đánh giá theo kịch bản'],
          definition:
            'Việc đánh giá một cuộc gọi theo bộ tiêu chí đã định sẵn — ví dụ có chào đúng chuẩn không, có xác nhận thông tin không, có nêu đủ điều khoản bắt buộc không. Chất lượng của việc chấm điểm phụ thuộc vào bộ tiêu chí nhiều hơn phụ thuộc vào công cụ: tiêu chí mơ hồ sẽ cho kết quả không dùng được, dù chấm bằng người hay bằng máy.',
          gcallsNote:
            'Kết quả chấm điểm tự động nên được dùng như dữ liệu hỗ trợ, và cần người kiểm chứng trước khi sử dụng để đánh giá nhân sự.',
          link: { label: 'QA QC Center', path: ROUTES.qcCenter },
        },
        {
          id: 'phan-tich-cam-xuc',
          term: 'Phân tích cảm xúc',
          aka: ['Sentiment analysis'],
          definition:
            'Việc phân loại sắc thái của một hội thoại — tích cực, trung tính, tiêu cực — dựa trên ngôn từ và đôi khi cả đặc trưng giọng nói. Kết quả mang tính xác suất và nhạy cảm với ngữ cảnh, cách nói mỉa mai hay đặc thù vùng miền, nên phù hợp để phát hiện xu hướng và khoanh vùng cuộc gọi cần xem lại hơn là để kết luận về một cuộc gọi đơn lẻ.',
          gcallsNote:
            'Gcalls không công bố độ chính xác cho phân tích cảm xúc. Đây là công cụ khoanh vùng để con người xem lại, không phải kết luận cuối cùng.',
        },
      ],
    },
    {
      id: 'ky-thuat-cam-ket',
      label: 'Kỹ thuật và cam kết dịch vụ',
      description:
        'Các khái niệm xuất hiện trong hợp đồng, tài liệu kỹ thuật và trao đổi với bộ phận IT.',
      terms: [
        {
          id: 'api',
          term: 'API',
          aka: ['Application Programming Interface', 'Giao diện lập trình ứng dụng'],
          definition:
            'Tập hợp các điểm kết nối do một phần mềm mở ra để phần mềm khác đọc hoặc ghi dữ liệu theo cách đã quy định. Trong bối cảnh tổng đài, API là thứ quyết định hai hệ thống có thể trao đổi được những gì — nên câu hỏi "có tích hợp được không" thực chất là câu hỏi "API của nền tảng đó cho phép làm gì".',
        },
        {
          id: 'sdk',
          term: 'SDK',
          aka: ['Software Development Kit', 'Bộ công cụ phát triển'],
          definition:
            'Bộ thư viện và công cụ giúp lập trình viên nhúng tính năng của một hệ thống vào phần mềm của mình, thay vì tự gọi từng API. SDK thường được dùng khi doanh nghiệp muốn đưa khả năng nghe gọi vào ứng dụng nội bộ hoặc sản phẩm riêng.',
          gcallsNote:
            'Việc sử dụng SDK cho một hệ thống nội bộ cụ thể cần được đánh giá về phạm vi kỹ thuật và nguồn lực phát triển của doanh nghiệp trong quá trình tư vấn.',
        },
        {
          id: 'sla',
          term: 'SLA',
          aka: ['Service Level Agreement', 'Cam kết mức dịch vụ'],
          definition:
            'Văn bản cam kết mức dịch vụ giữa nhà cung cấp và khách hàng: những chỉ số nào được cam kết, đo bằng cách nào, và điều gì xảy ra khi không đạt. Một SLA có giá trị phải nêu được cả cách đo lẫn cơ chế xử lý khi vi phạm — nếu thiếu, đó chỉ là một tuyên bố về mục tiêu.',
          gcallsNote:
            'Mức cam kết áp dụng cho một doanh nghiệp cụ thể được thống nhất trong hợp đồng dịch vụ, theo phạm vi triển khai đã xác định.',
        },
      ],
    },
  ],

  note: 'Các định nghĩa trên mô tả cách thuật ngữ được dùng phổ biến trong ngành. Một thuật ngữ xuất hiện ở đây không có nghĩa Gcalls cung cấp năng lực tương ứng — những trường hợp cần xác nhận riêng đã được ghi rõ trong phần mô tả của mục đó.',

  routing: {
    eyebrow: 'XEM THÊM',
    h2: 'Từ thuật ngữ tới trang trình bày chi tiết',
    description:
      'Mỗi nhóm thuật ngữ ở trên đều có một trang đã hoàn thiện trình bày chủ đề tương ứng ở mức chi tiết hơn.',
    items: [
      {
        title: 'Gcalls Plus Webphone',
        detail:
          'Kênh nghe gọi trên trình duyệt, danh bạ, ghi chú và theo dõi hoạt động cuộc gọi của đội ngũ.',
        path: ROUTES.gcallsPlus,
        cta: 'Xem Gcalls Plus Webphone',
      },
      {
        title: 'Tổng đài tích hợp CRM',
        detail:
          'Phạm vi kết nối giữa hoạt động nghe gọi và dữ liệu khách hàng trong hệ thống doanh nghiệp đang dùng.',
        path: ROUTES.crmIntegration,
        cta: 'Xem tổng đài tích hợp CRM',
      },
      {
        title: 'QA QC Center',
        detail:
          'Cách tổ chức đánh giá chất lượng hội thoại với sự hỗ trợ của QC Bot AI và giới hạn của công cụ.',
        path: ROUTES.qcCenter,
        cta: 'Xem QA QC Center',
      },
    ],
  },

  faq: [
    {
      q: 'Vì sao một số thuật ngữ có ghi chú "cần xác nhận riêng"?',
      a: 'Vì thuật ngữ đó mô tả năng lực phổ biến của ngành, nhưng Gcalls chưa công bố phạm vi áp dụng cụ thể cho năng lực đó trên website này. Ghi chú giúp người đọc phân biệt giữa "khái niệm tồn tại trong ngành" và "Gcalls đang cung cấp", thay vì để người đọc tự suy ra.',
    },
    {
      q: 'Thuật ngữ trong báo giá không có ở đây thì tra ở đâu?',
      a: 'Hãy yêu cầu nhà cung cấp mô tả phạm vi chính xác của hạng mục đó bằng ngôn ngữ vận hành: nó làm được gì, phụ thuộc vào điều kiện nào và không bao gồm những gì. Bạn cũng có thể gửi câu hỏi cho Gcalls để được giải thích.',
      link: { label: 'Gửi câu hỏi cho Gcalls', path: ROUTES.contact },
    },
    {
      q: 'Trang này có bổ sung thêm thuật ngữ không?',
      a: 'Có. Danh mục được mở rộng theo các thuật ngữ xuất hiện thường xuyên trong trao đổi với doanh nghiệp. Thuật ngữ mới chỉ được thêm khi có định nghĩa chính xác, không thêm để tăng số lượng mục.',
    },
  ],

  finalCta: {
    eyebrow: 'GLOSSARY',
    h2: 'Cần làm rõ một hạng mục trong báo giá hoặc hồ sơ kỹ thuật?',
    description:
      'Gửi hạng mục bạn đang cần hiểu rõ cùng bối cảnh doanh nghiệp. Đội ngũ Gcalls sẽ giải thích phạm vi thực tế của hạng mục đó và những gì phụ thuộc vào hệ thống hiện có.',
    primaryCta: { label: 'Đăng ký tư vấn giải pháp', path: ROUTES.contact },
  },
}
