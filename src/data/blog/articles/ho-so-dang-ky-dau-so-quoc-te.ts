import type { BlogArticleBody } from '../types'

/**
 * GC-B01-17 · HUB-09 · SUPPORTING · net-new.
 *
 * High-intent and jurisdiction-dependent. Every requirement is stated as
 * "thường được yêu cầu" and the article says plainly that the authoritative
 * answer comes from the regulator or the provider for that specific market —
 * because a definitive list here would be a claim we cannot evidence.
 */
export const article: BlogArticleBody = {
  slug: 'ho-so-dang-ky-dau-so-quoc-te',

  directAnswer: {
    question: 'Đăng ký đầu số quốc tế cần hồ sơ gì?',
    answer:
      'Hồ sơ thường xoay quanh bốn nhóm: giấy tờ chứng minh tư cách pháp nhân, chứng minh địa chỉ, giấy tờ người đại diện, và cam kết về mục đích sử dụng số. Yêu cầu cụ thể khác nhau theo quốc gia và theo loại số, do quy định của cơ quan quản lý viễn thông sở tại, nên phải xác nhận cho từng thị trường.',
  },

  body: `
## Vì sao không có một danh sách hồ sơ chung

Câu trả lời trung thực cho câu hỏi "cần giấy tờ gì" là: tuỳ quốc gia, tuỳ loại số, và tuỳ thời điểm.

Việc cấp số điện thoại chịu sự quản lý của cơ quan viễn thông tại từng nước, và mỗi nước có quy định riêng về ai được cấp loại số nào, với điều kiện gì. Quy định này cũng thay đổi theo thời gian.

Vì vậy bài này không đưa ra một danh sách áp dụng chung. Thay vào đó, nó mô tả **bốn nhóm giấy tờ thường được yêu cầu**, giải thích lý do đằng sau mỗi nhóm, và đưa ra cách chuẩn bị để giảm số lần phải nộp bổ sung.

## Bốn nhóm giấy tờ thường được yêu cầu

### Nhóm 1 — Chứng minh tư cách pháp nhân

Mục đích là xác nhận doanh nghiệp tồn tại và đang hoạt động hợp pháp. Giấy tờ thường được yêu cầu gồm giấy chứng nhận đăng ký doanh nghiệp và các tài liệu tương đương.

Hai lưu ý thực tế:

- **Bản dịch công chứng thường là bắt buộc** khi giấy tờ gốc không phải bằng ngôn ngữ được chấp nhận tại nước đó.
- **Thời hạn của bản sao** đôi khi được quy định — một bản trích lục quá cũ có thể không được chấp nhận.

### Nhóm 2 — Chứng minh địa chỉ

Đây là nhóm gây khó nhất cho doanh nghiệp nước ngoài, vì nhiều thị trường yêu cầu một địa chỉ tại chính quốc gia đó cho các loại số gắn với khu vực địa lý.

Giấy tờ thường được yêu cầu là hoá đơn dịch vụ, hợp đồng thuê văn phòng, hoặc tài liệu tương đương thể hiện địa chỉ. Điều cần xác nhận sớm là **loại số nào yêu cầu địa chỉ tại nước sở tại, và loại nào không** — vì câu trả lời quyết định phương án khả thi.

### Nhóm 3 — Giấy tờ người đại diện

Xác nhận người ký hồ sơ có thẩm quyền đại diện cho doanh nghiệp. Thường gồm giấy tờ tuỳ thân của người đại diện và văn bản uỷ quyền nếu người ký không phải người đại diện theo pháp luật.

Đây là nhóm hay bị chậm nhất, không phải vì khó chuẩn bị mà vì thường được để tới cuối và cần chữ ký của người bận nhất.

### Nhóm 4 — Cam kết về mục đích sử dụng

Nhiều thị trường yêu cầu mô tả mục đích sử dụng số và cam kết tuân thủ quy định về liên hệ khách hàng. Nội dung cam kết khác nhau đáng kể, và ở một số nơi việc sử dụng sai mục đích đã khai báo có thể dẫn tới thu hồi số.

Điều nên làm là mô tả mục đích đúng với thực tế dự kiến, kể cả khi mô tả đó hẹp hơn mong muốn ban đầu — mở rộng sau dễ hơn nhiều so với xử lý hậu quả của một khai báo không chính xác.

## Bảng chuẩn bị theo nhóm

| Nhóm | Ai chuẩn bị | Thời gian thường cần | Điểm hay bị vướng |
|---|---|---|---|
| Tư cách pháp nhân | Bộ phận pháp chế hoặc hành chính | Ngắn nếu hồ sơ sẵn có | Bản dịch công chứng và thời hạn bản sao |
| Chứng minh địa chỉ | Bộ phận hành chính | Dài nhất nếu chưa có hiện diện tại nước sở tại | Yêu cầu địa chỉ tại chính quốc gia đó |
| Người đại diện | Người đại diện và pháp chế | Ngắn nhưng phụ thuộc lịch ký | Uỷ quyền thiếu hoặc sai thẩm quyền |
| Mục đích sử dụng | Bộ phận vận hành | Ngắn | Mô tả quá rộng hoặc không khớp thực tế sử dụng |

Bảng này giúp phân công ngay từ đầu. Trong thực tế, nhóm 2 là nhóm quyết định tiến độ và nên được xác nhận trước tiên, vì nếu không đáp ứng được thì các nhóm còn lại không có ý nghĩa.

> **Câu hỏi nên đặt đầu tiên với nhà cung cấp.** Ở thị trường này, loại số nào cấp được cho một doanh nghiệp có hồ sơ như của chúng tôi, và điều kiện về địa chỉ là gì. Trả lời được câu này thì phần còn lại chỉ là công việc hành chính.

## Checklist chuẩn bị hồ sơ

- [ ] Đã xác nhận loại số mục tiêu và điều kiện cấp cho loại số đó
- [ ] Đã hỏi rõ yêu cầu về địa chỉ tại nước sở tại trước khi chuẩn bị các nhóm khác
- [ ] Đã kiểm tra ngôn ngữ được chấp nhận và nhu cầu dịch công chứng
- [ ] Đã kiểm tra thời hạn hiệu lực của các bản sao giấy tờ
- [ ] Đã xác định người ký và chuẩn bị văn bản uỷ quyền nếu cần
- [ ] Đã mô tả mục đích sử dụng khớp với kế hoạch thực tế
- [ ] Đã hỏi về nghĩa vụ duy trì hồ sơ sau khi được cấp số
- [ ] Đã lưu một bộ hồ sơ hoàn chỉnh để tái sử dụng cho thị trường tiếp theo

Ô cuối cùng tiết kiệm nhiều công sức nhất. Phần lớn giấy tờ ở nhóm 1 và nhóm 3 dùng lại được cho các thị trường khác, nên việc chuẩn bị một bộ chuẩn ngay từ thị trường đầu tiên là đầu tư có lãi.

## Sai lầm thường gặp

- **Chuẩn bị hồ sơ trước khi xác nhận điều kiện.** Nếu thị trường yêu cầu địa chỉ tại nước sở tại mà doanh nghiệp không có, toàn bộ công sức chuẩn bị các nhóm khác trở nên vô ích.
- **Giả định yêu cầu giống thị trường trước.** Mỗi quốc gia có quy định riêng và không suy được từ nơi khác.
- **Bỏ qua bản dịch công chứng.** Đây là nguyên nhân phổ biến nhất của việc phải nộp lại hồ sơ.
- **Để phần uỷ quyền tới cuối.** Nhóm giấy tờ dễ chuẩn bị nhất lại thường là nhóm làm chậm cả bộ hồ sơ.
- **Khai mục đích sử dụng quá rộng.** Ở một số thị trường, việc sử dụng khác với khai báo có thể dẫn tới thu hồi số.
- **Không lưu bộ hồ sơ đã dùng.** Thị trường tiếp theo lại bắt đầu từ đầu.

## Kết luận

Chuẩn bị hồ sơ đăng ký đầu số quốc tế là công việc hành chính có trình tự rõ ràng, với một điều kiện: phải xác nhận yêu cầu cụ thể của từng thị trường trước khi bắt đầu. Nhóm chứng minh địa chỉ quyết định tính khả thi và nên được hỏi đầu tiên.

Nếu doanh nghiệp đang ở giai đoạn sớm hơn — chưa chắc cần gì để bắt đầu liên hệ khách hàng ngoài Việt Nam — hãy đọc [doanh nghiệp cần gì khi gọi ra thị trường nước ngoài](/doanh-nghiep-can-gi-khi-goi-ra-thi-truong-nuoc-ngoai/) trước. Nếu đang lập kế hoạch mở rộng ở cấp chiến lược, phần đó nằm ở [mở rộng thị trường quốc tế: vai trò của hệ thống liên lạc](/tong-dai-quoc-te-mo-rong-thi-truong/).

Xem phạm vi Gcalls hỗ trợ tại [tổng đài quốc tế](/tong-dai-quoc-te/), hoặc [nêu thị trường mục tiêu để Gcalls xác nhận điều kiện cụ thể](/lien-he/).
`,

  faq: [
    {
      q: 'Có quốc gia nào không yêu cầu địa chỉ tại nước sở tại không?',
      a: 'Có, nhưng điều này phụ thuộc quốc gia và loại số, và quy định có thể thay đổi theo thời gian. Đây là câu hỏi phải xác nhận cho từng thị trường tại thời điểm đăng ký thay vì dựa vào kinh nghiệm ở thị trường khác hoặc thông tin cũ.',
    },
    {
      q: 'Hồ sơ cần dịch sang ngôn ngữ nào?',
      a: 'Tuỳ yêu cầu của cơ quan quản lý tại nước đó. Nhiều thị trường chấp nhận tiếng Anh, một số yêu cầu ngôn ngữ bản địa, và phần lớn yêu cầu bản dịch có công chứng khi giấy tờ gốc bằng ngôn ngữ khác. Nên hỏi rõ trước khi dịch để tránh phải làm lại.',
    },
    {
      q: 'Bao lâu thì được cấp số?',
      a: 'Thời gian phụ thuộc quốc gia, loại số và tính đầy đủ của hồ sơ, nên không có mốc chung. Yếu tố rút ngắn thời gian rõ nhất là nộp đủ ngay từ lần đầu, vì mỗi lần bổ sung thường khởi động lại quá trình xem xét.',
    },
    {
      q: 'Có thể dùng lại hồ sơ cho thị trường khác không?',
      a: 'Phần lớn giấy tờ chứng minh tư cách pháp nhân và giấy tờ người đại diện dùng lại được, với điều kiện còn trong thời hạn và được dịch sang ngôn ngữ phù hợp. Phần chứng minh địa chỉ và cam kết mục đích sử dụng thường phải làm riêng cho từng thị trường.',
    },
    {
      q: 'Sau khi được cấp số có nghĩa vụ gì không?',
      a: 'Nhiều thị trường yêu cầu duy trì tính chính xác của thông tin đã đăng ký và sử dụng số đúng mục đích đã khai báo. Ở một số nơi, việc sử dụng sai mục đích hoặc thông tin không còn chính xác có thể dẫn tới thu hồi số, nên đây là hạng mục cần hỏi rõ ngay từ đầu.',
    },
  ],

  images: [
    {
      id: 'featured',
      role: 'featured',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ quy trình chuẩn bị hồ sơ',
      shows:
        'Trình tự bốn nhóm giấy tờ với cổng kiểm tra đầu tiên là điều kiện về địa chỉ, và nhánh dừng lại nếu điều kiện đó không đáp ứng được.',
      placement: 'Ảnh đại diện, hiển thị đầu bài',
      source: 'Thiết kế mới theo bộ nhận diện Gcalls',
      masking:
        'Không hiển thị giấy tờ thật, không hiển thị tên doanh nghiệp hay thông tin cá nhân nào.',
      alt: 'Sơ đồ trình tự chuẩn bị bốn nhóm hồ sơ đăng ký đầu số quốc tế, bắt đầu từ điều kiện về địa chỉ',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho nội dung thủ tục trong HUB-09',
    },
  ],
}
