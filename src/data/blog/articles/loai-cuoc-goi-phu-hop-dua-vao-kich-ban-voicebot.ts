import type { BlogArticleBody } from '../types'

/**
 * GC-B01-14 · HUB-08 · PILLAR · net-new.
 *
 * Carries the §J Voicebot constraint verbatim in the body: Gcalls advises,
 * connects and integrates Voicebot within the deployment scope, and does not
 * claim to own the whole engine. No automation-rate or deflection figure
 * appears anywhere.
 */
export const article: BlogArticleBody = {
  slug: 'loai-cuoc-goi-phu-hop-dua-vao-kich-ban-voicebot',

  directAnswer: {
    question: 'Cuộc gọi nào phù hợp để đưa vào kịch bản Voicebot?',
    answer:
      'Phù hợp nhất là những cuộc gọi lặp lại nhiều, có cấu trúc rõ ràng, cần ít thông tin đầu vào và có kết quả xác định trước — như xác nhận lịch hẹn, tra cứu trạng thái hoặc nhắc thanh toán. Cuộc gọi cần phán đoán, đàm phán hoặc xử lý cảm xúc thì không phù hợp và nên giữ cho nhân viên.',
  },

  body: `
## Câu hỏi đúng không phải "có nên dùng Voicebot"

Phần lớn thảo luận về Voicebot dừng lại ở mức có nên hay không nên. Câu hỏi đó không dẫn tới quyết định nào, vì câu trả lời luôn là "tuỳ".

Câu hỏi dẫn tới quyết định là: **trong toàn bộ cuộc gọi mà doanh nghiệp đang xử lý, nhóm nào có thể đưa vào kịch bản mà không làm xấu trải nghiệm**. Đó là một bài toán phân loại, và bài này đưa ra bốn tiêu chí để làm việc đó.

Trước khi bắt đầu, một điểm cần nói rõ về phạm vi: **Gcalls tư vấn, kết nối và tích hợp Voicebot theo phạm vi triển khai của từng dự án.** Bài viết này bàn về cách chọn loại cuộc gọi để tự động hoá, không phải về việc so sánh các công nghệ nhận dạng giọng nói.

## Bốn tiêu chí sàng lọc

Một loại cuộc gọi phù hợp với kịch bản tự động khi thoả mãn cả bốn tiêu chí dưới đây. Thiếu một tiêu chí là dấu hiệu cần cân nhắc; thiếu hai trở lên thì gần như chắc chắn không phù hợp.

### Tiêu chí 1 — Lặp lại đủ nhiều

Xây dựng và duy trì một kịch bản có chi phí. Nếu loại cuộc gọi đó chỉ xuất hiện vài lần mỗi tháng, chi phí duy trì kịch bản lớn hơn công sức nhân viên xử lý trực tiếp.

Cách kiểm tra: nhóm các cuộc gọi trong một tháng theo mục đích, rồi xem nhóm nào chiếm tỷ trọng lớn. Nếu chưa có phân loại kết quả cuộc gọi, đây là việc phải làm trước.

### Tiêu chí 2 — Cấu trúc hội thoại xác định trước

Cuộc gọi phù hợp là cuộc gọi mà toàn bộ đường đi có thể vẽ thành sơ đồ trước khi nó xảy ra: hỏi gì, nhận câu trả lời nào, rẽ nhánh ra sao, kết thúc thế nào.

Nếu sơ đồ đó có quá nhiều nhánh, hoặc nếu có những nhánh chỉ xuất hiện khi đã nghe khách nói, cuộc gọi thuộc loại cần phán đoán.

### Tiêu chí 3 — Ít thông tin đầu vào cần thu thập

Mỗi thông tin mà hệ thống phải thu từ giọng nói là một điểm có thể sai: khách nói không rõ, môi trường ồn, cách đọc số khác nhau. Kịch bản cần thu năm thông tin có xác suất hoàn tất thấp hơn nhiều so với kịch bản chỉ cần xác nhận có hay không.

Nguyên tắc thực tế: những gì hệ thống đã biết thì đừng hỏi lại. Nếu đã biết mã đơn hàng vì đang gọi ra theo danh sách, hãy đọc lại để khách xác nhận thay vì yêu cầu khách đọc mã.

### Tiêu chí 4 — Kết quả xác định và ít hệ quả nếu sai

Cuộc gọi xác nhận lịch hẹn có hệ quả thấp nếu hiểu nhầm: khách gọi lại hoặc nhân viên gọi lại. Cuộc gọi chốt một giao dịch tài chính thì không.

Mức hệ quả nên quyết định cả việc có tự động hoá hay không, và nếu có thì điểm chuyển sang nhân viên đặt ở đâu. Với những loại cuộc gọi có hệ quả trung bình, một cách xử lý phổ biến là để kịch bản thu thập thông tin và xác nhận, nhưng bước quyết định cuối cùng vẫn do nhân viên thực hiện.

## Ma trận phân loại

| Loại cuộc gọi | Lặp lại | Cấu trúc | Thông tin cần thu | Hệ quả nếu sai | Kết luận |
|---|---|---|---|---|---|
| Xác nhận lịch hẹn | Cao | Rõ | Ít | Thấp | Phù hợp |
| Nhắc lịch thanh toán | Cao | Rõ | Ít | Trung bình | Phù hợp, cần điểm chuyển tiếp rõ |
| Tra cứu trạng thái đơn hàng | Cao | Rõ | Trung bình | Thấp | Phù hợp |
| Khảo sát ngắn sau cuộc gọi | Cao | Rõ | Ít | Thấp | Phù hợp |
| Tiếp nhận và phân loại yêu cầu ban đầu | Cao | Trung bình | Trung bình | Thấp | Phù hợp phần đầu, chuyển tiếp phần sau |
| Xử lý khiếu nại | Trung bình | Không rõ | Nhiều | Cao | Không phù hợp |
| Tư vấn sản phẩm có nhiều lựa chọn | Trung bình | Không rõ | Nhiều | Trung bình | Không phù hợp |
| Đàm phán điều khoản | Thấp | Không rõ | Nhiều | Cao | Không phù hợp |

Ma trận này là điểm khởi đầu, không phải kết luận cho mọi doanh nghiệp. Cùng một loại cuộc gọi có thể phù hợp ở ngành này và không phù hợp ở ngành khác, tuỳ mức hệ quả và kỳ vọng của khách hàng.

## Ba nhóm cuộc gọi không nên tự động hoá

### Cuộc gọi có yếu tố cảm xúc

Khách hàng đang bức xúc cần được nghe bởi một người có thể thừa nhận vấn đề và điều chỉnh cách nói. Đưa nhóm này vào kịch bản làm tăng mức bức xúc thay vì giảm khối lượng công việc.

### Cuộc gọi mà kết quả phụ thuộc vào phán đoán

Nếu câu trả lời đúng phụ thuộc vào việc cân nhắc nhiều yếu tố không có trong dữ liệu — lịch sử quan hệ với khách hàng, mức độ ưu tiên, khả năng linh hoạt về điều khoản — thì kịch bản không thể chứa đủ nhánh.

### Cuộc gọi hiếm

Không phải vì khó mà vì không đáng. Một kịch bản được dùng vài lần mỗi tháng vẫn cần được kiểm tra và cập nhật như mọi kịch bản khác.

> **Nguyên tắc an toàn.** Khi phân vân giữa tự động hoá và giữ cho nhân viên, hãy giữ cho nhân viên. Một cuộc gọi được xử lý bởi người thì tệ nhất là tốn thời gian; một cuộc gọi bị kịch bản xử lý sai thì có thể mất khách.

## Thiết kế điểm chuyển tiếp sang nhân viên

Đây là phần quyết định chất lượng trải nghiệm nhiều hơn cả bản thân kịch bản.

1. **Luôn có lối ra.** Người gọi phải chuyển được sang nhân viên ở bất kỳ bước nào, bằng một cách rõ ràng và được nhắc tới.
2. **Chuyển tiếp sau hai lần không hiểu.** Nếu hệ thống không nhận được câu trả lời hợp lệ hai lần liên tiếp, chuyển tiếp thay vì hỏi lại lần thứ ba.
3. **Chuyển tiếp kèm ngữ cảnh.** Nhân viên nhận cuộc gọi phải thấy được kịch bản đã đi tới đâu và đã thu được thông tin gì. Bắt khách kể lại từ đầu sau khi đã nói chuyện với hệ thống là trải nghiệm tệ nhất trong toàn bộ luồng.
4. **Có phương án khi không còn nhân viên trực.** Ghi nhận yêu cầu và cam kết liên hệ lại, thay vì để cuộc gọi kết thúc trong ngõ cụt.

Điểm 3 phụ thuộc vào việc Voicebot được tích hợp vào cùng hệ thống thoại mà đội ngũ đang dùng, chứ không chạy tách rời. Đây là lý do phạm vi tích hợp quan trọng ngang với chất lượng nhận dạng giọng nói.

## Chuẩn bị dữ liệu trước khi xây kịch bản

Một kịch bản chỉ tốt bằng dữ liệu mà nó dựa vào. Ba việc chuẩn bị dưới đây quyết định chất lượng nhiều hơn bản thân công nghệ.

### Phân loại cuộc gọi theo mục đích

Không thể chọn nhóm nào để tự động hoá nếu chưa biết các nhóm hiện có. Nếu kết quả cuộc gọi đang được ghi bằng văn bản tự do, việc đầu tiên là chuyển sang một danh sách lựa chọn cố định và thu thập dữ liệu trong một khoảng đủ dài.

### Viết lại kịch bản mà nhân viên đang dùng

Nhân viên giỏi nhất trong đội đã có sẵn một kịch bản trong đầu cho loại cuộc gọi đó. Nghe lại vài chục cuộc và viết ra cách họ hỏi, theo đúng thứ tự, thường cho ra bản thiết kế tốt hơn bất kỳ mẫu kịch bản nào có sẵn.

Điều quan trọng là ghi lại cả những chỗ nhân viên đi chệch khỏi trình tự — đó chính là các nhánh mà kịch bản tự động sẽ phải xử lý hoặc phải chuyển tiếp.

### Chuẩn bị nguồn dữ liệu mà kịch bản cần tra cứu

Nếu kịch bản phải trả lời trạng thái đơn hàng, hệ thống lưu trạng thái đó phải truy vấn được và trả kết quả đủ nhanh cho một cuộc trò chuyện. Đây là ràng buộc kỹ thuật hay bị phát hiện muộn, sau khi kịch bản đã được thiết kế xong.

Cũng cần quyết định điều gì xảy ra khi tra cứu thất bại: chuyển tiếp sang nhân viên là phương án an toàn, còn việc đọc một câu trả lời chung chung sẽ khiến người gọi phải liên hệ lại.

Ngoài ba việc trên, nên chuẩn bị sẵn một tập cuộc gọi mẫu để thử kịch bản trước khi đưa vào hoạt động thật. Tập mẫu tốt gồm cả những cách diễn đạt khác thường mà nhân viên đã gặp, không chỉ những câu trả lời lý tưởng — vì chính các trường hợp khác thường mới quyết định kịch bản có bền hay không.

## Checklist trước khi đưa một loại cuộc gọi vào kịch bản

- [ ] Đã phân loại cuộc gọi theo mục đích và biết tỷ trọng của từng nhóm
- [ ] Đã vẽ được sơ đồ hội thoại đầy đủ trước khi xây dựng
- [ ] Số thông tin cần thu từ giọng nói đã được giảm tới mức tối thiểu
- [ ] Đã đánh giá mức hệ quả nếu hệ thống hiểu sai
- [ ] Có lối chuyển sang nhân viên ở mọi bước và được nhắc tới rõ ràng
- [ ] Có quy tắc chuyển tiếp sau số lần không hiểu xác định trước
- [ ] Ngữ cảnh được chuyển kèm khi cuộc gọi sang nhân viên
- [ ] Có phương án cho trường hợp ngoài giờ trực
- [ ] Đã xác nhận nghĩa vụ thông báo cho người gọi theo quy định áp dụng
- [ ] Đã có cách đo tỷ lệ hoàn tất kịch bản và tỷ lệ chuyển tiếp
- [ ] Đã chạy thử trên tập nhỏ và nghe lại kết quả trước khi mở rộng

## Sai lầm thường gặp

- **Chọn loại cuộc gọi theo mức độ khó chịu thay vì theo mức độ phù hợp.** Nhóm cuộc gọi khiến nhân viên mệt nhất thường là nhóm có yếu tố cảm xúc — nhóm không nên tự động hoá.
- **Thu quá nhiều thông tin trong một kịch bản.** Mỗi thông tin là một điểm có thể sai, và tỷ lệ hoàn tất giảm nhanh theo số lượng.
- **Giấu lối chuyển sang nhân viên.** Người gọi sẽ tìm cách khác để liên hệ, thường là kênh tốn kém hơn, và mang theo ấn tượng xấu.
- **Chuyển tiếp mà không kèm ngữ cảnh.** Khách phải kể lại từ đầu và toàn bộ phần tự động trở thành thời gian lãng phí của họ.
- **Không đo tỷ lệ chuyển tiếp.** Đây là chỉ số cho biết kịch bản có hoạt động hay không, và nó thường bị bỏ qua để nhường chỗ cho chỉ số số cuộc gọi đã xử lý.
- **Mở rộng trước khi nghe lại kết quả tập thử.** Vấn đề trong cách đặt câu hỏi chỉ lộ ra khi nghe cuộc gọi thật.

## Kết luận

Voicebot không phải là quyết định có hoặc không mà là một bài toán phân loại cuộc gọi. Bốn tiêu chí ở trên áp dụng được ngay với dữ liệu mà phần lớn doanh nghiệp đã có, miễn là cuộc gọi được phân loại theo mục đích.

Nếu ba khái niệm Voicebot, IVR và tổng đài tự động còn đang bị dùng lẫn nhau trong nội bộ, hãy bắt đầu từ bài [Voicebot, IVR và tổng đài tự động khác nhau thế nào](/voicebot-ivr-va-tong-dai-tu-dong-khac-nhau-the-nao/). Nếu chưa có phân loại kết quả cuộc gọi, đó là việc phải làm trước — cách tổ chức nằm ở [cách một ngày làm việc trên webphone diễn ra](/tong-dai-tren-trinh-duyet-hoat-dong-the-nao/).

Xem phạm vi Gcalls tư vấn, kết nối và tích hợp tại [giải pháp Voicebot AI](/voicebot-ai/), hoặc [mô tả luồng cuộc gọi hiện tại để trao đổi](/lien-he/).
`,

  faq: [
    {
      q: 'Voicebot có thay thế được nhân viên tổng đài không?',
      a: 'Không. Voicebot xử lý được những cuộc gọi lặp lại và có cấu trúc xác định trước, đồng thời cần một điểm chuyển tiếp rõ ràng sang nhân viên cho mọi tình huống nằm ngoài kịch bản. Những cuộc gọi cần phán đoán, đàm phán hoặc xử lý cảm xúc vẫn thuộc về con người.',
    },
    {
      q: 'Gcalls có tự phát triển công nghệ Voicebot không?',
      a: 'Gcalls tư vấn, kết nối và tích hợp Voicebot theo phạm vi triển khai của từng dự án. Trọng tâm nằm ở việc đưa luồng tự động vào đúng chỗ trong hoạt động thoại hiện có và bảo đảm việc chuyển tiếp sang nhân viên diễn ra kèm ngữ cảnh.',
    },
    {
      q: 'Kịch bản nên dài bao nhiêu bước?',
      a: 'Càng ngắn càng tốt. Mỗi bước là một điểm có thể hiểu sai và mỗi thông tin cần thu là một điểm có thể thất bại. Nếu sơ đồ hội thoại không vẽ vừa trên một trang, đó là dấu hiệu loại cuộc gọi này chưa phù hợp để đưa vào kịch bản.',
    },
    {
      q: 'Làm sao biết kịch bản đang hoạt động tốt?',
      a: 'Hai chỉ số quan trọng nhất là tỷ lệ hoàn tất kịch bản và tỷ lệ chuyển tiếp sang nhân viên, xem cùng nhau. Ngoài ra nên nghe lại một phần cuộc gọi thật định kỳ, vì nhiều vấn đề trong cách đặt câu hỏi chỉ lộ ra khi nghe chứ không hiện lên trong số liệu.',
    },
    {
      q: 'Có cần thông báo cho người gọi rằng họ đang nói chuyện với hệ thống không?',
      a: 'Nghĩa vụ thông báo phụ thuộc vào quy định áp dụng cho từng ngành và từng loại cuộc gọi, nên đây là hạng mục cần xác nhận với bộ phận pháp chế. Ngoài khía cạnh pháp lý, việc nói rõ ngay từ đầu thường làm giảm đáng kể phản ứng tiêu cực của người nghe.',
    },
    {
      q: 'Nên bắt đầu từ cuộc gọi ra hay cuộc gọi đến?',
      a: 'Cuộc gọi ra thường dễ hơn để bắt đầu, vì hệ thống đã biết trước đang gọi cho ai và về việc gì, nên số thông tin cần thu từ giọng nói ít hơn. Cuộc gọi đến khó hơn vì phải xác định mục đích của người gọi trước khi làm bất cứ việc gì khác.',
    },
  ],

  images: [
    {
      id: 'featured',
      role: 'featured',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ ma trận phân loại',
      shows:
        'Ma trận hai trục — mức độ lặp lại và độ phức tạp của hội thoại — với vùng phù hợp cho kịch bản tự động được tô rõ và các loại cuộc gọi đặt vào từng ô.',
      placement: 'Ảnh đại diện, hiển thị đầu bài',
      source: 'Thiết kế mới theo bộ nhận diện Gcalls',
      masking: 'Không có dữ liệu thật; không dùng tên khách hàng hoặc đối tác.',
      alt: 'Sơ đồ ma trận phân loại cuộc gọi theo mức độ lặp lại và độ phức tạp, đánh dấu vùng phù hợp với Voicebot',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho nội dung tự động hoá thoại trong HUB-08',
    },
    {
      id: 'inline-1',
      role: 'in-article',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ luồng chuyển tiếp',
      shows:
        'Luồng một cuộc gọi qua kịch bản với bốn điểm chuyển tiếp sang nhân viên: yêu cầu chủ động, hai lần không hiểu, nằm ngoài phạm vi, và ngoài giờ trực.',
      placement: 'Trong mục "Thiết kế điểm chuyển tiếp sang nhân viên"',
      source: 'Thiết kế mới',
      masking: 'Không có dữ liệu thật.',
      alt: 'Sơ đồ luồng kịch bản Voicebot với bốn điểm chuyển tiếp sang nhân viên',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho tài liệu thiết kế luồng thoại',
    },
  ],
}
