import type { BlogArticleBody } from '../types'

/**
 * GC-B01-15 · HUB-08 · SUPPORTING · net-new.
 *
 * Definitional entry point for the hub. Distinguishes the three terms by what
 * the CALLER has to do, which is the only distinction that survives contact
 * with vendors using the words interchangeably.
 */
export const article: BlogArticleBody = {
  slug: 'voicebot-ivr-va-tong-dai-tu-dong-khac-nhau-the-nao',

  directAnswer: {
    question: 'Voicebot, IVR và tổng đài tự động khác nhau thế nào?',
    answer:
      'Khác nhau ở việc người gọi phải làm gì để hệ thống hiểu. IVR yêu cầu bấm phím theo menu. Tổng đài tự động phát thông báo và định tuyến theo quy tắc cố định, thường không cần tương tác. Voicebot cho phép người gọi nói bằng lời và hệ thống diễn giải ý định. Ba mức này có thể cùng tồn tại trong một luồng.',
  },

  body: `
## Vì sao ba khái niệm này hay bị dùng lẫn nhau

Trong các cuộc trao đổi với nhà cung cấp, ba từ này thường được dùng thay thế cho nhau. Điều đó tạo ra kỳ vọng lệch: doanh nghiệp nghĩ mình đang mua khả năng hiểu ngôn ngữ tự nhiên, và nhận về một menu bấm phím.

Cách phân biệt bền nhất không dựa vào công nghệ bên dưới mà dựa vào **người gọi phải làm gì để hệ thống hiểu họ muốn gì**. Câu hỏi đó trả lời được ngay trong một cuộc gọi thử và không phụ thuộc vào cách gọi tên của từng nhà cung cấp.

## Ba mức, phân biệt theo hành động của người gọi

### Tổng đài tự động: người gọi không cần làm gì

Hệ thống phát lời chào, có thể thông báo giờ làm việc, rồi định tuyến cuộc gọi theo quy tắc cố định — theo thứ tự, theo nhóm, hoặc theo khung giờ. Người gọi chỉ nghe và chờ.

Đây là mức cơ bản nhất và cũng là mức đủ dùng cho nhiều doanh nghiệp nhỏ. Nếu chỉ có một nhóm tiếp nhận, việc thêm một menu bấm phím không cải thiện gì mà chỉ kéo dài thời gian chờ.

### IVR: người gọi bấm phím theo menu

Hệ thống đọc danh sách lựa chọn và người gọi bấm số tương ứng. Ưu điểm là gần như không có rủi ro hiểu sai: phím 1 là phím 1.

Nhược điểm nằm ở trải nghiệm. Người gọi phải nghe hết menu mới biết lựa chọn nào phù hợp, và khi có nhiều cấp menu lồng nhau, họ thường bấm bừa để gặp người thật.

### Voicebot: người gọi nói bằng lời

Hệ thống nhận câu nói, diễn giải ý định và phản hồi. Ưu điểm là người gọi trình bày trực tiếp thay vì tìm mình thuộc mục nào trong menu. Nhược điểm là có xác suất hiểu sai, và xác suất đó phụ thuộc vào chất lượng đường truyền, môi trường xung quanh và cách người gọi diễn đạt.

## Bảng đối chiếu theo tình huống

| Tình huống | Tổng đài tự động | IVR | Voicebot |
|---|---|---|---|
| Chỉ có một nhóm tiếp nhận | Phù hợp | Thừa | Thừa |
| Ba tới năm nhóm rõ ràng | Không đủ | Phù hợp | Có thể, nhưng IVR đơn giản hơn |
| Người gọi không biết mình thuộc nhóm nào | Không đủ | Gây khó chịu | Phù hợp |
| Cần thu thập thông tin trước khi chuyển tiếp | Không làm được | Chỉ với dữ liệu dạng số | Phù hợp |
| Môi trường gọi thường ồn | Phù hợp | Phù hợp | Rủi ro cao hơn |
| Người gọi lớn tuổi hoặc không quen công nghệ | Phù hợp | Có thể gây khó | Tuỳ cách thiết kế câu hỏi |

Bảng này cho thấy Voicebot không phải mức cao nhất luôn nên hướng tới. Ở nhiều tình huống, IVR ba lựa chọn cho trải nghiệm tốt hơn một hệ thống hiểu ngôn ngữ tự nhiên.

> **Cách kiểm tra nhanh khi trao đổi với nhà cung cấp.** Hỏi một câu duy nhất: người gọi phải bấm phím, phải nói, hay không cần làm gì. Câu trả lời phân loại ngay hệ thống đang được chào bán, bất kể nó được đặt tên là gì.

## Ba mức cùng tồn tại trong một luồng

Trong thực tế, một luồng cuộc gọi tốt thường dùng cả ba.

1. **Tổng đài tự động** phát lời chào và xử lý các trường hợp không cần tương tác: ngoài giờ làm việc, ngày nghỉ, thông báo chung.
2. **IVR** phân nhánh ở mức thô cho những lựa chọn rõ ràng và ổn định, ví dụ phân biệt khách hàng hiện hữu và khách hàng mới.
3. **Voicebot** xử lý phần cần thu thập thông tin hoặc phần mà người gọi khó tự phân loại mình.

Thiết kế theo hướng này giữ được ưu điểm của từng mức và giới hạn rủi ro của mức phức tạp nhất vào đúng chỗ nó tạo ra giá trị.

Việc chọn phần nào của luồng đưa vào kịch bản tự động được trình bày chi tiết ở bài [loại cuộc gọi nào phù hợp đưa vào kịch bản Voicebot](/loai-cuoc-goi-phu-hop-dua-vao-kich-ban-voicebot/).

## Một cách viết lời chào ngắn hơn

Ở cả ba mức, phần người gọi tiếp xúc đầu tiên là lời chào — và đây là nơi dễ cải thiện nhất mà ít được chú ý.

Lời chào phổ biến bắt đầu bằng giới thiệu doanh nghiệp, cảm ơn vì đã gọi, rồi mới tới nội dung hữu ích. Người gọi phải chờ qua phần không mang thông tin trước khi biết mình cần làm gì.

Cách viết hiệu quả hơn đảo thứ tự: nêu tên doanh nghiệp trong một câu ngắn, rồi vào ngay lựa chọn. Phần cảm ơn và các thông báo phụ, nếu cần, đặt ở cuối hoặc bỏ hẳn. Một lời chào ngắn hơn vài giây, nhân với toàn bộ cuộc gọi trong tháng, là khoảng thời gian chờ đáng kể mà người gọi không phải chịu.

Nguyên tắc tương tự áp dụng cho câu hỏi trong kịch bản Voicebot: câu hỏi càng ngắn và càng cụ thể thì câu trả lời càng dễ diễn giải đúng.

## Checklist khi thiết kế luồng thoại tự động

- [ ] Đã xác định số nhóm tiếp nhận thực sự cần phân biệt
- [ ] Menu IVR không quá năm lựa chọn ở mỗi cấp
- [ ] Số cấp menu lồng nhau không quá hai
- [ ] Lựa chọn phổ biến nhất được đọc trước
- [ ] Có lối gặp nhân viên ở mọi cấp và được nhắc tới rõ ràng
- [ ] Có phương án cho trường hợp ngoài giờ trực, không kết thúc trong ngõ cụt
- [ ] Đã thử luồng bằng cách gọi thật, không chỉ xem sơ đồ
- [ ] Đã xác nhận nghĩa vụ thông báo cho người gọi theo quy định áp dụng

## Sai lầm thường gặp

- **Xây menu IVR theo sơ đồ tổ chức.** Người gọi không biết doanh nghiệp có những phòng ban nào; họ chỉ biết mình cần gì. Menu nên phản ánh nhu cầu, không phản ánh cơ cấu nội bộ.
- **Quá nhiều cấp menu.** Mỗi cấp làm tăng tỷ lệ người gọi bấm bừa để gặp người thật.
- **Đọc lựa chọn phổ biến nhất ở cuối.** Phần lớn người gọi phải nghe hết menu cho một lựa chọn lẽ ra nên đứng đầu.
- **Giấu lối gặp nhân viên.** Người gọi sẽ tìm kênh khác, thường tốn kém hơn, và mang theo ấn tượng xấu.
- **Chọn Voicebot vì nghe hiện đại hơn.** Với ba lựa chọn rõ ràng, IVR đơn giản cho trải nghiệm tốt hơn và ít rủi ro hơn.
- **Không gọi thử.** Sơ đồ luôn trông hợp lý; vấn đề chỉ lộ ra khi nghe lời chào dài bao nhiêu giây trong thực tế.

## Kết luận

Ba khái niệm này phân biệt được bằng một câu hỏi duy nhất: người gọi phải làm gì. Trả lời được câu đó thì mọi cuộc trao đổi với nhà cung cấp trở nên rõ ràng hơn, và doanh nghiệp tránh được việc mua một mức phức tạp mình không cần.

Bước tiếp theo là quyết định phần nào của luồng nên tự động hoá — nội dung của bài [loại cuộc gọi nào phù hợp đưa vào kịch bản Voicebot](/loai-cuoc-goi-phu-hop-dua-vao-kich-ban-voicebot/). Nếu doanh nghiệp còn đang xây dựng luồng tiếp nhận cơ bản, hãy bắt đầu từ [dịch vụ call center là gì và ai thực sự cần](/5-linh-vuc-rat-can-dich-vu-call-center-trung-tam-cuoc-goi/).

Xem phạm vi Gcalls tư vấn, kết nối và tích hợp tại [giải pháp Voicebot AI](/voicebot-ai/).
`,

  faq: [
    {
      q: 'IVR có lỗi thời không?',
      a: 'Không. Với những lựa chọn ít và rõ ràng, IVR cho trải nghiệm nhanh và gần như không có rủi ro hiểu sai. Vấn đề của IVR không nằm ở công nghệ mà ở cách thiết kế: menu quá dài, quá nhiều cấp, và xây theo cơ cấu tổ chức thay vì theo nhu cầu người gọi.',
    },
    {
      q: 'Voicebot có hiểu được giọng địa phương không?',
      a: 'Mức độ nhận dạng phụ thuộc vào công nghệ được tích hợp, dữ liệu huấn luyện và điều kiện thực tế của cuộc gọi như tiếng ồn và chất lượng đường truyền. Đây là hạng mục cần thử nghiệm với chính tệp khách hàng của doanh nghiệp thay vì kết luận từ mô tả kỹ thuật.',
    },
    {
      q: 'Nên có bao nhiêu lựa chọn trong một menu IVR?',
      a: 'Không quá năm ở mỗi cấp, và không quá hai cấp lồng nhau. Ngoài ra nên đọc lựa chọn phổ biến nhất trước, vì phần lớn người gọi sẽ dừng ở đó và không phải nghe hết phần còn lại.',
    },
    {
      q: 'Có thể dùng cả ba trong một luồng không?',
      a: 'Có, và đây thường là thiết kế tốt nhất. Tổng đài tự động xử lý lời chào và các trường hợp không cần tương tác, IVR phân nhánh ở mức thô, còn Voicebot xử lý phần cần thu thập thông tin hoặc phần người gọi khó tự phân loại.',
    },
    {
      q: 'Chi phí ba mức này khác nhau nhiều không?',
      a: 'Cấu trúc chi phí khác nhau: tổng đài tự động và IVR chủ yếu là chi phí cấu hình một lần và bảo trì khi thay đổi, trong khi Voicebot còn có chi phí theo mức sử dụng và chi phí duy trì kịch bản. Con số cụ thể phụ thuộc phạm vi triển khai nên cần khảo sát riêng.',
    },
  ],

  images: [
    {
      id: 'featured',
      role: 'featured',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ đối chiếu ba mức',
      shows:
        'Ba cột tương ứng ba mức, mỗi cột nêu hành động của người gọi và cách hệ thống hiểu yêu cầu. Trục ngang thể hiện mức độ tương tác tăng dần.',
      placement: 'Ảnh đại diện, hiển thị đầu bài',
      source: 'Thiết kế mới theo bộ nhận diện Gcalls',
      masking: 'Không có dữ liệu thật; không dùng logo bên thứ ba.',
      alt: 'Sơ đồ đối chiếu tổng đài tự động, IVR và Voicebot theo hành động mà người gọi phải thực hiện',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho nội dung khái niệm trong HUB-08',
    },
  ],
}
