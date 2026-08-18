import type { BlogArticleBody } from '../types'

/**
 * GC-B01-12 · HUB-07 · SUPPORTING · net-new.
 *
 * This is the article that carries the §J QA/QC constraint explicitly: AI does
 * not replace human verification. No coverage percentage, no hours-saved
 * figure and no accuracy claim appears anywhere, because none is evidenced.
 */
export const article: BlogArticleBody = {
  slug: 'cham-diem-cuoc-goi-thu-cong-va-ho-tro-bang-ai',

  directAnswer: {
    question: 'Chấm điểm thủ công và chấm điểm có AI hỗ trợ khác nhau thế nào?',
    answer:
      'Chấm thủ công cho kết quả có ngữ cảnh và giải thích được, nhưng bị giới hạn bởi số giờ người nghe. Phân tích tự động xử lý được khối lượng lớn hơn và phát hiện dấu hiệu cần xem xét, nhưng không đưa ra kết luận cuối cùng. Trong thực tế, hai cách bổ sung cho nhau: máy sàng lọc, người kiểm chứng và quyết định.',
  },

  body: `
## Hai cách làm giải quyết hai bài toán khác nhau

Câu hỏi "nên chấm thủ công hay dùng AI" đặt sai vấn đề, vì hai cách này không cạnh tranh trực tiếp.

Chấm thủ công trả lời câu hỏi **"cuộc gọi này tốt hay chưa tốt, và vì sao"**. Người nghe hiểu ngữ cảnh, nhận ra sự mỉa mai, biết khi nào một câu trả lời ngắn là phù hợp và khi nào là cụt lủn.

Phân tích tự động trả lời câu hỏi **"trong hàng nghìn cuộc gọi tuần này, những cuộc nào đáng để người nghe lại"**. Nó không thay thế phán đoán mà thu hẹp phạm vi cần phán đoán.

Đội ngũ nào hiểu được sự phân công này thường triển khai thành công. Đội ngũ nào kỳ vọng công cụ thay hẳn con người thường dừng lại sau vài tháng, khi phát hiện kết quả tự động không dùng được làm căn cứ trao đổi với nhân viên.

## Bảng đối chiếu theo từng loại việc

| Loại việc | Chấm thủ công | Phân tích tự động |
|---|---|---|
| Kiểm tra câu thông báo bắt buộc | Làm được nhưng tốn thời gian | Phù hợp — đây là việc có quy tắc rõ ràng |
| Phát hiện từ ngữ không được dùng | Phụ thuộc trí nhớ người nghe | Phù hợp — so khớp danh sách |
| Đánh giá cách xử lý phản đối | Phù hợp — cần hiểu ngữ cảnh | Chỉ nên dùng để đánh dấu cần xem lại |
| Nhận biết khách hàng bức xúc | Phù hợp | Có thể gợi ý, cần người xác nhận |
| Đo tỷ lệ nói của hai bên | Tốn thời gian, dễ sai | Phù hợp — đây là phép đo cơ học |
| Kết luận cuộc gọi đạt hay không đạt | Thuộc về người phụ trách | Không phù hợp làm kết luận cuối |
| Chọn mẫu cuộc gọi để xem lại | Ngẫu nhiên hoặc theo phàn nàn | Phù hợp — thu hẹp theo dấu hiệu |

Dòng áp chót là ranh giới quan trọng nhất và cần được nói rõ trong mọi cuộc trao đổi về công cụ: **kết luận về chất lượng và hành động tiếp theo thuộc về người phụ trách, không thuộc về hệ thống**.

## Vì sao bước kiểm chứng của con người không bỏ được

Có ba lý do thực tế, không phải ba lý do nguyên tắc.

### Ngữ cảnh nghiệp vụ nằm ngoài bản ghi

Một nhân viên trả lời ngắn gọn có thể là đang xử lý đúng theo hướng dẫn cho tình huống đó. Hệ thống không biết hướng dẫn nội bộ tuần này đã thay đổi.

### Kết quả cần giải thích được cho người bị đánh giá

Khi trao đổi với nhân viên về một cuộc gọi chưa đạt, người quản lý phải giải thích được vì sao. Một kết quả không giải thích được sẽ không tạo ra thay đổi hành vi, chỉ tạo ra phản ứng phòng vệ.

### Trách nhiệm không chuyển giao được

Nếu một đánh giá dẫn tới quyết định về nhân sự, trách nhiệm về quyết định đó thuộc về người ra quyết định. Đây là ràng buộc về quản trị chứ không phải về công nghệ, nên không có công cụ nào gỡ được.

> **Cách Gcalls đặt vấn đề.** Công cụ mở rộng phạm vi kiểm tra và chỉ ra những cuộc gọi đáng xem xét. Việc xác nhận kết quả và quyết định hành động tiếp theo vẫn thuộc về người phụ trách chất lượng.

## Quy trình kết hợp hai cách

1. **Chạy phân tích tự động trên toàn bộ cuộc gọi trong kỳ.** Mục tiêu là đánh dấu, không phải chấm điểm.
2. **Lọc ra nhóm cần người nghe lại.** Gồm cuộc gọi có dấu hiệu bất thường, cuộc gọi thuộc nhóm tuân thủ và một phần chọn ngẫu nhiên để tránh mẫu bị lệch.
3. **Người chấm nghe và chấm theo bộ tiêu chí.** Đây là bước tạo ra kết quả chính thức.
4. **Đối chiếu kết quả người chấm với dấu hiệu tự động.** Nơi hai bên lệch nhau nhiều là nơi cần chỉnh lại quy tắc phát hiện.
5. **Trả kết quả về cho nhân viên kèm bản ghi cụ thể.** Không có bước này thì bốn bước trên chỉ tạo ra một bảng số.

Bước 4 là bước khiến hệ thống tốt lên theo thời gian, và cũng là bước hay bị bỏ vì nó không tạo ra kết quả nhìn thấy ngay.

Một lưu ý về nhịp: quy trình này không cần chạy hằng ngày. Chu kỳ theo tuần hoặc theo kỳ đánh giá thường đủ, miễn là mẫu cuộc gọi được lấy trải đều trong kỳ chứ không dồn vào vài ngày cuối. Mẫu dồn cục phản ánh một giai đoạn cụ thể — chẳng hạn tuần cao điểm hoặc tuần có nhân sự mới — chứ không phản ánh chất lượng chung của kỳ đó.

## Checklist trước khi đưa công cụ vào quy trình QA

- [ ] Đã có bộ tiêu chí đánh giá được hiệu chuẩn trước khi nghĩ tới công cụ
- [ ] Đã xác định rõ tiêu chí nào giao cho công cụ, tiêu chí nào giữ cho người
- [ ] Đã thống nhất kết luận cuối cùng thuộc về người phụ trách chất lượng
- [ ] Đã có cách chọn mẫu kết hợp dấu hiệu tự động và chọn ngẫu nhiên
- [ ] Đã có bước đối chiếu định kỳ giữa kết quả người chấm và dấu hiệu tự động
- [ ] Đã thông báo với đội ngũ về phạm vi và giới hạn của công cụ
- [ ] Đã xác nhận việc lưu trữ và xử lý bản ghi phù hợp quy định áp dụng cho doanh nghiệp

## Sai lầm thường gặp

- **Đưa công cụ vào khi chưa có bộ tiêu chí.** Không có chuẩn thì không có gì để đối chiếu, và kết quả tự động trở thành những con số không diễn giải được. Bắt đầu từ [xây dựng bộ tiêu chí đánh giá chất lượng cuộc gọi](/xay-dung-bo-tieu-chi-danh-gia-chat-luong-cuoc-goi/).
- **Coi kết quả tự động là kết luận chính thức.** Nhân viên mất niềm tin ngay lần đầu một đánh giá sai không giải thích được.
- **Chỉ chọn mẫu theo dấu hiệu tự động.** Mẫu bị lệch về phía các cuộc gọi bất thường và không phản ánh chất lượng chung.
- **Không đối chiếu lại quy tắc phát hiện.** Hệ thống giữ nguyên sai sót ban đầu và không cải thiện theo thời gian.
- **Không nói rõ phạm vi với đội ngũ.** Cảm giác bị giám sát toàn diện làm hỏng quan hệ làm việc nhiều hơn bất kỳ lợi ích nào công cụ mang lại.

## Kết luận

Phân tích tự động thay đổi phạm vi của hoạt động đánh giá chất lượng, không thay đổi ai chịu trách nhiệm về kết luận. Cách triển khai bền là để công cụ làm phần sàng lọc và các tiêu chí có quy tắc rõ ràng, còn phần phán đoán và phần trao đổi với nhân viên vẫn thuộc về người.

Nếu đội ngũ chưa có bộ tiêu chí được hiệu chuẩn, đó là việc phải làm trước. Nếu đã có và đang tìm cách biến điểm số thành thay đổi hành vi thật, phần đó nằm ở bài [dùng biểu mẫu đánh giá cuộc gọi để cải thiện trải nghiệm khách hàng](/cai-thien-trai-nghiem-khach-hang-bang-bieu-mau-cham-diem-danh-gia-cuoc-goi/).

Xem cách Gcalls tổ chức phần này tại [QA QC Center](/qc-bot-ai/), hoặc [trao đổi về quy trình phù hợp với đội ngũ](/lien-he/).
`,

  faq: [
    {
      q: 'AI có chấm điểm chính xác không?',
      a: 'Mức chính xác phụ thuộc vào loại tiêu chí. Với những tiêu chí có quy tắc rõ ràng, kết quả thường ổn định. Với những tiêu chí cần hiểu ngữ cảnh, kết quả chỉ nên dùng làm dấu hiệu cần xem lại. Gcalls không công bố con số về độ chính xác vì con số đó phụ thuộc dữ liệu và bộ tiêu chí của từng doanh nghiệp.',
    },
    {
      q: 'Có thể bỏ hẳn việc nghe lại cuộc gọi không?',
      a: 'Không. Công cụ thu hẹp phạm vi cần nghe nhưng không loại bỏ bước nghe. Kết luận về chất lượng cần giải thích được cho người bị đánh giá, và trách nhiệm về quyết định dựa trên đánh giá đó vẫn thuộc về người ra quyết định.',
    },
    {
      q: 'Nên bắt đầu từ công cụ hay từ bộ tiêu chí?',
      a: 'Từ bộ tiêu chí. Không có chuẩn thì kết quả tự động không đối chiếu được với gì, và đội ngũ không có cơ sở để tranh luận khi không đồng ý. Công cụ đưa vào sau, khi đã biết rõ tiêu chí nào phù hợp để tự động hoá.',
    },
    {
      q: 'Đội ngũ phản ứng thế nào khi biết cuộc gọi được phân tích?',
      a: 'Phản ứng phụ thuộc vào việc phạm vi có được nói rõ hay không. Khi đội ngũ biết công cụ dùng để chọn mẫu và kết luận vẫn do người đưa ra, mức chấp nhận cao hơn nhiều so với khi họ cảm thấy đang bị chấm điểm bởi một hệ thống không giải thích được.',
    },
    {
      q: 'Cần chuẩn bị gì về mặt dữ liệu và quy định?',
      a: 'Việc ghi âm, lưu trữ và phân tích hội thoại đều liên quan tới quy định áp dụng cho từng ngành và từng doanh nghiệp, gồm cả nghĩa vụ thông báo cho người gọi. Đây là hạng mục cần xác nhận với bộ phận pháp chế trước khi triển khai, không phải sau.',
    },
  ],

  images: [
    {
      id: 'featured',
      role: 'featured',
      status: 'PRODUCT_SCREENSHOT_REQUIRED',
      kind: 'Ảnh chụp màn hình sản phẩm',
      shows:
        'Màn hình kết quả phân tích hội thoại trong QA QC Center với các dấu hiệu được đánh dấu và ô xác nhận của người chấm còn ở trạng thái chưa xác nhận.',
      placement: 'Ảnh đại diện, hiển thị đầu bài',
      source: 'Ảnh chụp thật từ môi trường demo nội bộ. Không dựng giao diện giả.',
      masking:
        'Che nội dung hội thoại, tên khách hàng, tên nhân viên, số điện thoại và tên tenant. Gắn nhãn "ảnh minh hoạ".',
      alt: 'Ảnh chụp màn hình kết quả phân tích hội thoại kèm bước xác nhận của người chấm, dữ liệu đã được che',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho nội dung QA/QC có yếu tố công cụ',
    },
    {
      id: 'inline-1',
      role: 'in-article',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ quy trình kết hợp',
      shows:
        'Năm bước của quy trình kết hợp, với ranh giới rõ giữa phần công cụ sàng lọc và phần người kiểm chứng, và vòng phản hồi từ bước đối chiếu quay lại quy tắc phát hiện.',
      placement: 'Trong mục "Quy trình kết hợp hai cách"',
      source: 'Thiết kế mới theo bộ nhận diện Gcalls',
      masking: 'Không có dữ liệu thật.',
      alt: 'Sơ đồ quy trình kết hợp giữa phân tích tự động và chấm điểm thủ công trong hoạt động QA',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho nội dung QA/QC ở các batch sau',
    },
  ],
}
