import type { BlogArticleBody } from '../types'

/**
 * GC-B01-09 · HUB-06 · PILLAR · net-new.
 *
 * HUB-06 had ZERO legacy rows — the entire hub is net-new. This is its
 * defining pillar.
 */
export const article: BlogArticleBody = {
  slug: 'hop-nhat-hoi-thoai-hotline-zalo-oa-va-facebook',

  directAnswer: {
    question: 'Hợp nhất hội thoại đa kênh nghĩa là gì?',
    answer:
      'Hợp nhất hội thoại là đưa yêu cầu từ hotline, Zalo OA, Facebook và email vào cùng một hàng đợi, gắn với cùng một hồ sơ khách hàng, để bất kỳ nhân viên nào tiếp nhận cũng đọc được toàn bộ lịch sử. Điều khó không nằm ở việc kết nối kênh mà ở việc nhận ra hai hội thoại khác kênh là của cùng một người.',
  },

  body: `
## Vấn đề thật sự không phải là số lượng kênh

Khi một doanh nghiệp mở thêm Zalo OA và Facebook bên cạnh hotline, cảm giác ban đầu là phục vụ khách hàng tốt hơn. Vấn đề xuất hiện sau vài tháng, và nó không phải vấn đề về số lượng.

Vấn đề là **mỗi kênh sinh ra một phiên bản khác nhau của cùng một khách hàng**. Người gọi hotline hôm thứ Hai và người nhắn Zalo hôm thứ Tư là một người, nhưng với doanh nghiệp thì đó là hai cuộc trao đổi không liên quan, do hai nhân viên xử lý, không ai biết chuyện của người kia.

Hậu quả không phải là chậm trễ. Hậu quả là khách hàng phải kể lại từ đầu, và đội ngũ trả lời mâu thuẫn với nhau mà không ai nhận ra.

### Bốn thứ thất lạc khi mỗi kênh dùng một công cụ

- **Ngữ cảnh.** Người trả lời tin nhắn không biết khách vừa gọi điện sáng nay về đúng việc đó.
- **Quyền sở hữu.** Không rõ ai chịu trách nhiệm khi một yêu cầu đi qua hai kênh.
- **Trạng thái.** Một việc đã xử lý xong ở kênh này vẫn hiện là chưa trả lời ở kênh kia.
- **Số liệu.** Không tổng hợp được khối lượng thật, vì mỗi công cụ đếm theo cách riêng.

Thứ tư là thứ khiến người quản lý phát hiện vấn đề muộn: mỗi công cụ đều báo cáo con số đẹp trong phạm vi của nó.

## Hợp nhất nghĩa là gì về mặt kỹ thuật

Hợp nhất hội thoại thường bị hiểu là "đăng nhập một chỗ để xem tất cả". Đó là phần dễ nhất và cũng là phần ít giá trị nhất. Ba lớp dưới đây mới là nội dung thật.

### Lớp 1 — Gom về một hàng đợi

Mọi yêu cầu, bất kể đến từ kênh nào, xuất hiện trong cùng một danh sách việc cần xử lý. Nhân viên không phải mở bốn cửa sổ và tự luân phiên giữa chúng.

Ở lớp này, điều cần quyết định là **thứ tự ưu tiên giữa các kênh**. Một cuộc gọi đang chờ máy khác một tin nhắn gửi ba mươi phút trước: cuộc gọi cần phản hồi tức thời, tin nhắn thì không. Nếu hàng đợi xếp thuần theo thời gian, trải nghiệm thoại sẽ xấu đi.

### Lớp 2 — Nhận ra cùng một khách hàng

Đây là lớp khó nhất và là nơi phần lớn dự án dừng lại ở mức nửa vời.

Số điện thoại nhận diện được người gọi hotline. Zalo OA và Facebook lại dùng định danh riêng của nền tảng, không phải số điện thoại. Việc nối hai định danh đó với nhau đòi hỏi hoặc khách hàng chủ động cung cấp thông tin, hoặc nhân viên gộp thủ công khi phát hiện.

Không có cách tự động hoàn toàn cho việc này, và bất kỳ ai nói ngược lại đều đang bỏ qua cách các nền tảng nhắn tin hoạt động. Điều thực tế cần chuẩn bị là một quy trình gộp hồ sơ rõ ràng và một người chịu trách nhiệm rà soát.

### Lớp 3 — Giữ ngữ cảnh khi khách chuyển kênh

Khi khách nhắn tin rồi gọi điện, nhân viên nhận cuộc gọi cần thấy đoạn trao đổi trước đó. Điều này chỉ xảy ra nếu lớp 2 đã hoạt động — nên thứ tự triển khai không thể đảo.

## Bảng đối chiếu đặc tính từng kênh

| Kênh | Kỳ vọng thời gian phản hồi | Định danh khách | Ràng buộc cần biết |
|---|---|---|---|
| Hotline | Ngay lập tức | Số điện thoại | Cần người trực trong khung giờ công bố |
| Zalo OA | Trong ngày làm việc | Định danh của nền tảng | Chính sách và khả năng nhắn tin do nền tảng quy định |
| Facebook | Trong ngày làm việc | Định danh của nền tảng | Tương tự, phụ thuộc chính sách nền tảng |
| Email | Chậm hơn, tính bằng giờ | Địa chỉ email | Dễ mất dấu khi nhiều người cùng truy cập một hộp thư |

Bảng này giải thích vì sao gộp thuần tuý theo thời gian là sai: bốn kênh có bốn kỳ vọng khác nhau, và hàng đợi phải phản ánh điều đó.

> **Điều cần xác nhận với từng nền tảng.** Khả năng nhắn tin chủ động, thời hạn được phép trả lời và loại nội dung được gửi đều do nền tảng quy định và thay đổi theo thời gian. Đây là hạng mục kiểm tra tại thời điểm triển khai, không phải giả định.

## Quy trình triển khai theo bốn giai đoạn

1. **Kiểm kê hiện trạng.** Liệt kê mọi kênh đang mở, ai đang phụ trách kênh nào, và công cụ nào đang dùng. Nhiều doanh nghiệp phát hiện có kênh vẫn mở nhưng không còn ai theo dõi.
2. **Chuẩn hoá phân loại yêu cầu.** Một bộ phân loại dùng chung cho mọi kênh. Nếu mỗi kênh phân loại theo cách riêng, việc gộp hàng đợi không tạo ra số liệu so sánh được.
3. **Gom hàng đợi cho hai kênh trước.** Thường là hotline và kênh nhắn tin có khối lượng lớn nhất. Mở rộng sau khi quy tắc ưu tiên đã ổn định.
4. **Thiết lập quy trình gộp hồ sơ khách hàng.** Ai gộp, dựa trên căn cứ nào, và làm sao hoàn tác khi gộp nhầm. Bước này quyết định lớp 2 có hoạt động hay không.

Giai đoạn 2 hay bị bỏ qua vì nó không tạo ra thay đổi nhìn thấy được ngay. Nhưng nếu bỏ, mọi báo cáo sau đó đều phải làm thủ công.

Về thứ tự, cũng nên lưu ý rằng giai đoạn 4 không phải bước cuối mà là bước chạy song song và không bao giờ kết thúc. Hồ sơ khách hàng mới liên tục xuất hiện, và việc gộp là công việc định kỳ chứ không phải một đợt dọn dẹp một lần.

## Phân công công việc khi hàng đợi đã chung

Gom bốn kênh vào một hàng đợi không tự nó giải quyết được câu hỏi ai làm việc gì. Ba mô hình phân công dưới đây đều đang được dùng trong thực tế, và mỗi mô hình phù hợp với một dạng đội ngũ.

### Mô hình một người xử lý mọi kênh

Mỗi nhân viên nhận việc từ đầu hàng đợi bất kể kênh nào. Ưu điểm là tải được cân bằng tự nhiên và không có kênh nào bị bỏ. Nhược điểm là mỗi lần chuyển giữa cuộc gọi và tin nhắn đều tốn thời gian tập trung lại, nên năng suất giảm khi cả hai loại đều nhiều.

Mô hình này phù hợp với đội nhỏ, nơi việc tách nhóm sẽ tạo ra người rảnh trong khi người khác quá tải.

### Mô hình tách theo kênh trong ca

Trong mỗi ca, một số người chỉ nhận cuộc gọi, số còn lại chỉ xử lý tin nhắn, và vị trí luân phiên giữa các ca. Ưu điểm là mỗi người giữ được nhịp làm việc; nhược điểm là cần đủ nhân sự để tách và cần người điều phối khi tải lệch.

### Mô hình tách theo loại yêu cầu

Phân công theo nội dung — ví dụ nhóm xử lý vấn đề kỹ thuật, nhóm xử lý đơn hàng — bất kể yêu cầu đến từ kênh nào. Đây là mô hình cho chất lượng trả lời tốt nhất và cũng đòi hỏi nhiều nhất: phải có bộ phân loại yêu cầu chuẩn và cơ chế định tuyến theo phân loại đó.

Với đội đang bắt đầu, mô hình thứ nhất là điểm xuất phát hợp lý. Chuyển sang mô hình thứ ba khi khối lượng đủ lớn và bộ phân loại đã ổn định.

Dù chọn mô hình nào, điều cần tránh là để cùng một yêu cầu xuất hiện trong danh sách việc của nhiều người mà không ai được đánh dấu là người chịu trách nhiệm. Đây là nguyên nhân trực tiếp của tình huống hai người cùng trả lời một khách hàng theo hai hướng khác nhau.

## Đo lường sau khi hợp nhất

Một trong những lý do khiến dự án hợp nhất khó bảo vệ về sau là số liệu thay đổi theo hướng trông có vẻ xấu đi. Khối lượng yêu cầu ghi nhận được tăng lên, vì trước đó nhiều yêu cầu không được đếm. Thời gian xử lý trung bình cũng có thể tăng, vì những việc phức tạp trước đây rơi ra ngoài nay được ghi nhận đầy đủ.

Đây không phải là hệ thống làm mọi thứ tệ đi mà là hệ thống bắt đầu nhìn thấy thứ trước đó vô hình. Để tránh hiểu nhầm, nên thống nhất trước ba điều:

- **Số liệu trước và sau không so sánh trực tiếp được.** Cần nói rõ điều này với người ra quyết định ngay từ đầu.
- **Chỉ số nên tập trung vào trải nghiệm khách hàng.** Số lần khách phải nhắc lại thông tin đã cung cấp, và số yêu cầu bị trả lời hai lần khác nhau, là hai chỉ số phản ánh đúng vấn đề mà việc hợp nhất giải quyết.
- **Cần một khoảng thời gian ổn định trước khi kết luận.** Vài tuần đầu phản ánh quá trình làm quen, không phản ánh năng lực của cách tổ chức mới.

## Checklist trước khi hợp nhất kênh

- [ ] Đã liệt kê đầy đủ các kênh đang mở, kể cả kênh không còn ai theo dõi
- [ ] Đã xác định người chịu trách nhiệm cho từng kênh trong giai đoạn chuyển tiếp
- [ ] Đã thống nhất một bộ phân loại yêu cầu dùng chung cho mọi kênh
- [ ] Đã đặt quy tắc ưu tiên phản ánh kỳ vọng thời gian phản hồi của từng kênh
- [ ] Đã có quy trình gộp hồ sơ khách hàng và người chịu trách nhiệm rà soát
- [ ] Đã có cách hoàn tác khi gộp nhầm hai khách hàng khác nhau
- [ ] Đã xác nhận chính sách nhắn tin hiện hành của từng nền tảng
- [ ] Đã quyết định phạm vi lịch sử hiển thị cho nhân viên khi nhận cuộc gọi
- [ ] Đã thống nhất cách đo khối lượng để so sánh được với trước khi hợp nhất

## Sai lầm thường gặp

- **Gộp hàng đợi thuần theo thời gian.** Cuộc gọi đang chờ máy bị xếp sau tin nhắn cũ, và trải nghiệm thoại xấu đi ngay tuần đầu.
- **Kỳ vọng hệ thống tự nhận ra khách hàng qua mọi kênh.** Các nền tảng nhắn tin không cung cấp số điện thoại, nên phải có quy trình gộp thủ công.
- **Gộp hồ sơ mà không có cách hoàn tác.** Một lần gộp nhầm hai khách hàng khác nhau sẽ tạo ra lịch sử sai và rất khó tách lại.
- **Mở tất cả kênh cùng lúc.** Quy tắc ưu tiên chưa ổn định thì thêm kênh chỉ làm hàng đợi khó đọc hơn.
- **Bỏ qua bước chuẩn hoá phân loại.** Hàng đợi chung nhưng dữ liệu vẫn không so sánh được giữa các kênh.
- **Hiển thị toàn bộ lịch sử mọi kênh cho mọi nhân viên.** Mở rộng phạm vi dữ liệu nhạy cảm mà phần lớn không cần cho việc đang xử lý.

## Kết luận

Hợp nhất hội thoại không phải là bài toán gom giao diện mà là bài toán nhận diện khách hàng và ưu tiên công việc. Lớp 1 làm được nhanh, lớp 3 là thứ khách hàng cảm nhận, nhưng lớp 2 mới quyết định hai lớp còn lại có ý nghĩa hay không.

Nếu doanh nghiệp chưa chắc đã đến lúc đầu tư, bài [khi nào doanh nghiệp thực sự cần nền tảng đa kênh](/khi-nao-doanh-nghiep-can-nen-tang-da-kenh/) đưa ra bốn ngưỡng cụ thể để tự đối chiếu. Nếu yêu cầu hỗ trợ đã được quản lý bằng ticket, phần ranh giới dữ liệu nằm ở [dữ liệu nào đồng bộ giữa tổng đài và Helpdesk](/du-lieu-dong-bo-giua-tong-dai-va-helpdesk/).

Xem cách Gcalls tổ chức hàng đợi hội thoại đa kênh tại [Gcalls CX](/gcalls-cx/).
`,

  faq: [
    {
      q: 'Hệ thống có tự nhận ra khách nhắn Zalo và khách gọi hotline là một người không?',
      a: 'Không tự động trong mọi trường hợp, vì các nền tảng nhắn tin dùng định danh riêng chứ không cung cấp số điện thoại. Việc nối hai định danh cần khách hàng chủ động cung cấp thông tin hoặc nhân viên gộp hồ sơ khi phát hiện, nên doanh nghiệp cần một quy trình gộp rõ ràng.',
    },
    {
      q: 'Nên bắt đầu hợp nhất từ kênh nào?',
      a: 'Thường là hotline cùng kênh nhắn tin có khối lượng lớn nhất, vì đây là cặp kênh mà khách hàng chuyển qua lại nhiều nhất. Mở rộng sang các kênh còn lại sau khi quy tắc ưu tiên đã ổn định, thay vì bật tất cả cùng lúc.',
    },
    {
      q: 'Hàng đợi chung có làm chậm việc trả lời cuộc gọi không?',
      a: 'Có, nếu hàng đợi xếp thuần theo thời gian đến. Cuộc gọi cần phản hồi tức thời trong khi tin nhắn có kỳ vọng chậm hơn, nên quy tắc ưu tiên phải phản ánh sự khác biệt đó. Đây là hạng mục cấu hình cần quyết định trước khi gộp.',
    },
    {
      q: 'Có giới hạn nào khi nhắn tin qua Zalo OA hoặc Facebook không?',
      a: 'Có. Khả năng nhắn tin chủ động, thời hạn được phép trả lời và loại nội dung được gửi đều do từng nền tảng quy định và có thể thay đổi. Đây là hạng mục cần kiểm tra tại thời điểm triển khai với chính sách hiện hành của nền tảng đó.',
    },
    {
      q: 'Nhân viên có nên thấy toàn bộ lịch sử của khách trên mọi kênh không?',
      a: 'Nên giới hạn ở phạm vi cần cho việc đang xử lý. Hiển thị toàn bộ lịch sử mọi kênh cho mọi nhân viên mở rộng phạm vi dữ liệu nhạy cảm mà phần lớn không phục vụ cho yêu cầu hiện tại, nên cần quyết định phạm vi có chủ đích.',
    },
    {
      q: 'Làm sao chứng minh việc hợp nhất có hiệu quả?',
      a: 'Cần số liệu trước khi hợp nhất để so sánh. Hai chỉ số dễ đo và phản ánh đúng vấn đề là số lần khách phải nhắc lại thông tin đã cung cấp, và số yêu cầu được xử lý ở hai kênh mà không bên nào biết bên kia đang làm gì.',
    },
  ],

  images: [
    {
      id: 'featured',
      role: 'featured',
      status: 'PRODUCT_SCREENSHOT_REQUIRED',
      kind: 'Ảnh chụp màn hình sản phẩm',
      shows:
        'Hàng đợi hội thoại đa kênh trong Gcalls CX với các mục đến từ nhiều kênh khác nhau và nhãn kênh hiển thị rõ.',
      placement: 'Ảnh đại diện, hiển thị đầu bài',
      source: 'Ảnh chụp thật từ môi trường demo nội bộ. Không dựng giao diện giả.',
      masking:
        'Che tên khách hàng, ảnh đại diện, nội dung tin nhắn, số điện thoại, tên nhân viên và tên tenant. Gắn nhãn "ảnh minh hoạ".',
      alt: 'Ảnh chụp hàng đợi hội thoại đa kênh trong Gcalls CX, dữ liệu khách hàng đã được che',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho các bài trong HUB-06',
    },
    {
      id: 'inline-1',
      role: 'in-article',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ ba lớp hợp nhất',
      shows:
        'Ba lớp xếp chồng: gom hàng đợi, nhận diện cùng một khách hàng, giữ ngữ cảnh khi chuyển kênh. Lớp giữa được đánh dấu là lớp khó nhất.',
      placement: 'Đầu mục "Hợp nhất nghĩa là gì về mặt kỹ thuật"',
      source: 'Thiết kế mới theo bộ nhận diện Gcalls',
      masking: 'Không có dữ liệu thật; không dùng logo nền tảng bên thứ ba.',
      alt: 'Sơ đồ ba lớp hợp nhất hội thoại đa kênh, từ gom hàng đợi tới giữ ngữ cảnh khi khách chuyển kênh',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho nội dung đa kênh ở các batch sau',
    },
  ],
}
