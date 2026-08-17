import type { BlogArticleBody } from '../types'

/**
 * GC-B01-05 · HUB-02 · SUPPORTING · written from scratch.
 *
 * Re-scoped from legacy post 1368, which was auto-dialer marketing copy. The
 * new article is an operational guide and states the limits plainly, including
 * the regulatory ones — the legacy angle ("lợi ích") could not do that without
 * contradicting itself.
 */
export const article: BlogArticleBody = {
  slug: 'phan-mem-goi-tu-dong-va-loi-ich-doi-voi-chien-luoc-ban-hang',

  directAnswer: {
    question: 'Gọi ra theo danh sách được tổ chức thế nào?',
    answer:
      'Gọi ra theo danh sách là cách đội ngũ liên hệ lần lượt một tập khách hàng đã được chuẩn bị trước, ghi nhận kết quả từng liên hệ và chuyển sang liên hệ tiếp theo. Chất lượng của cách làm này phụ thuộc vào dữ liệu đầu vào, quy tắc phân bổ và danh sách kết quả thống nhất — nhiều hơn là vào tốc độ quay số.',
  },

  body: `
## Vì sao danh sách quan trọng hơn công cụ

Khi một đội bán hàng bắt đầu gọi ra có tổ chức, phản xạ đầu tiên thường là tìm công cụ quay số nhanh hơn. Đó là tối ưu sai chỗ.

Trong thực tế, thứ quyết định kết quả của một đợt gọi ra là **chất lượng danh sách và cách ghi nhận kết quả**, không phải số giây tiết kiệm được giữa hai cuộc gọi. Một danh sách có ba mươi phần trăm số sai sẽ làm hỏng mọi phép đo hiệu quả, bất kể công cụ nhanh tới đâu.

Bài này đi qua sáu bước tổ chức một đợt gọi ra và bốn giới hạn mà đội ngũ thường phát hiện quá muộn.

## Sáu bước tổ chức một đợt gọi ra

### 1. Xác định mục tiêu của đợt gọi

Một đợt gọi ra chỉ nên có một mục tiêu chính: xác minh thông tin, mời tham dự, nhắc lịch, khảo sát sau bán, hay tiếp cận khách hàng tiềm năng. Gộp hai mục tiêu vào một đợt khiến kịch bản dài ra và kết quả không phân tích được.

### 2. Làm sạch dữ liệu đầu vào

Trước khi gọi, danh sách cần qua ba bước tối thiểu: loại bỏ bản ghi trùng, chuẩn hoá định dạng số điện thoại, và loại những liên hệ đã yêu cầu không nhận cuộc gọi. Bước thứ ba là nghĩa vụ, không phải tuỳ chọn.

### 3. Phân bổ cho nhân sự

Phân bổ nên dựa trên tiêu chí rõ ràng — khu vực, nhóm sản phẩm, người phụ trách trước đó — chứ không chia đều một cách máy móc. Chia đều làm mất ngữ cảnh: một khách hàng đã trao đổi với nhân viên A tuần trước lại nhận cuộc gọi từ nhân viên B.

### 4. Thống nhất danh sách kết quả

Đây là bước quyết định và cũng là bước hay bị bỏ. Kết quả cuộc gọi phải là danh sách chọn cố định, không phải ô văn bản tự do. Một danh sách gọn thường gồm: liên hệ được và quan tâm, liên hệ được và chưa quan tâm, hẹn gọi lại, không bắt máy, số không đúng, và yêu cầu không liên hệ nữa.

### 5. Chạy thử trên tập nhỏ

Gọi thử vài chục liên hệ đầu tiên rồi dừng lại xem kết quả. Nếu tỷ lệ số sai cao bất thường hoặc kịch bản gây phản ứng tiêu cực, sửa trước khi chạy toàn bộ. Bước này tiết kiệm nhiều hơn mọi tối ưu tốc độ.

### 6. Rà soát và xử lý phần tồn

Kết thúc đợt không phải là kết thúc công việc. Nhóm "hẹn gọi lại" và nhóm "không bắt máy" cần lịch xử lý tiếp, nếu không toàn bộ công sức chỉ tạo ra một bảng thống kê.

## Bốn giới hạn cần biết trước

| Giới hạn | Biểu hiện | Cách xử lý |
|---|---|---|
| Chất lượng dữ liệu | Số sai, số trùng, thông tin cũ | Làm sạch trước, và ghi nhận số sai như một kết quả để dữ liệu tự cải thiện |
| Quy định về liên hệ | Yêu cầu về sự đồng ý và danh sách từ chối | Xác nhận với bộ phận pháp chế trước mỗi loại chiến dịch |
| Khả năng tiếp nhận của đội | Gọi nhiều hơn khả năng xử lý phần hẹn lại | Đặt hạn mức theo ngày dựa trên năng lực xử lý, không theo số liên hệ có sẵn |
| Phản ứng của người nhận | Cuộc gọi lặp lại gây khó chịu và ảnh hưởng uy tín đầu số | Đặt quy tắc số lần liên hệ tối đa và khoảng cách giữa các lần |

Giới hạn thứ hai đáng được nhấn mạnh. Yêu cầu pháp lý về liên hệ khách hàng phụ thuộc vào loại chiến dịch, nguồn dữ liệu và quy định áp dụng cho từng ngành, nên đây là hạng mục phải xác nhận cụ thể chứ không thể suy đoán.

> **Một nguyên tắc thực tế.** Nếu không ghi nhận được lý do một liên hệ thất bại, đợt gọi tiếp theo sẽ lặp lại đúng lỗi đó. Ghi nhận "số không đúng" là cách duy nhất khiến danh sách sạch dần thay vì hỏng dần.

## Đo cái gì để biết đợt gọi có hiệu quả

Chỉ số phổ biến nhất — số cuộc gọi thực hiện — là chỉ số tệ nhất, vì nó tăng khi nhân viên trao đổi qua loa. Bốn chỉ số dưới đây khó nguỵ tạo hơn và phản ánh đúng thứ đợt gọi cần đạt.

- **Tỷ lệ liên hệ được.** Số liên hệ nói chuyện được trên tổng số đã gọi. Chỉ số này nói về chất lượng danh sách và khung giờ gọi, không phải về nhân viên.
- **Tỷ lệ số không đúng.** Đo trực tiếp chất lượng dữ liệu đầu vào và là cơ sở để yêu cầu cải thiện nguồn dữ liệu.
- **Tỷ lệ hoàn tất ghi nhận.** Bao nhiêu phần trăm cuộc gọi có đủ kết quả và việc cần làm tiếp theo. Nếu chỉ số này thấp, mọi phân tích phía sau đều không đáng tin.
- **Tỷ lệ nhóm hẹn gọi lại được xử lý đúng hạn.** Đây là nơi giá trị thật của đợt gọi nằm, và cũng là nơi hay thất thoát nhất.

Bốn chỉ số này nên được xem cùng nhau. Tỷ lệ liên hệ được cao nhưng tỷ lệ hoàn tất ghi nhận thấp nghĩa là đội đã nói chuyện với khách nhưng doanh nghiệp không giữ lại được gì từ những cuộc trao đổi đó.

## Checklist trước khi bắt đầu một đợt gọi

- [ ] Đợt gọi có đúng một mục tiêu chính, viết được thành một câu
- [ ] Danh sách đã loại bản ghi trùng và chuẩn hoá định dạng số
- [ ] Đã loại các liên hệ từng yêu cầu không nhận cuộc gọi
- [ ] Đã xác nhận cơ sở pháp lý cho loại chiến dịch này với bộ phận phụ trách
- [ ] Danh sách kết quả cuộc gọi đã thống nhất và là lựa chọn cố định
- [ ] Quy tắc phân bổ giữ được ngữ cảnh người phụ trách trước đó
- [ ] Đã đặt số lần liên hệ tối đa và khoảng cách giữa các lần
- [ ] Đã chạy thử trên tập nhỏ và xem kết quả trước khi mở rộng
- [ ] Đã có lịch xử lý nhóm hẹn gọi lại sau khi đợt kết thúc

## Sai lầm thường gặp

- **Đo thành công bằng số cuộc gọi thực hiện.** Chỉ số này tăng khi đội gọi nhanh hơn và giảm khi họ trao đổi kỹ hơn, nên nó khuyến khích đúng hành vi sai.
- **Để ô kết quả là văn bản tự do.** Kết quả không tổng hợp được, và mọi báo cáo phải làm lại thủ công.
- **Không ghi nhận số sai.** Danh sách không bao giờ sạch hơn, và mỗi đợt sau lại mất công cho cùng những số đó.
- **Chia danh sách đều cho cả đội.** Ngữ cảnh của người phụ trách trước bị bỏ, và khách hàng nhận ra ngay điều đó.
- **Chạy toàn bộ danh sách trước khi xem kết quả tập đầu.** Nếu kịch bản có vấn đề, cả đợt hỏng thay vì vài chục liên hệ.
- **Bỏ qua nhóm hẹn gọi lại.** Đây thường là nhóm có khả năng chuyển đổi cao nhất và cũng là nhóm hay bị bỏ quên nhất.

## Kết luận

Gọi ra theo danh sách là một quy trình dữ liệu nhiều hơn là một hoạt động thoại. Sáu bước ở trên đều nằm ngoài phần bấm nút gọi, và chúng quyết định phần lớn kết quả.

Nếu đội ngũ chưa có một nơi chung để thực hiện và ghi nhận cuộc gọi, hãy bắt đầu từ [cách một ngày làm việc trên webphone diễn ra](/tong-dai-tren-trinh-duyet-hoat-dong-the-nao/), rồi xem [Gcalls Plus Webphone](/gcalls-plus-webphone/). Nếu danh sách đến từ CRM và cần đồng bộ kết quả ngược lại, phần phạm vi và giới hạn nằm ở bài [đồng bộ dữ liệu giữa tổng đài và CRM](/dong-bo-hoa-du-lieu-la-gi-tai-sao-nen-dong-bo-du-lieu/).

Để trao đổi về cách tổ chức đợt gọi ra cho đội ngũ cụ thể, [mô tả tình huống cho Gcalls](/lien-he/).
`,

  faq: [
    {
      q: 'Gọi ra theo danh sách có phải là quay số tự động không?',
      a: 'Không nhất thiết. Gọi ra theo danh sách là cách tổ chức công việc; quay số tự động là một cách thực hiện nó. Nhiều đội vận hành hiệu quả với danh sách hiển thị trên màn hình và nhân viên chủ động bấm gọi, vì cách này giữ được khoảng dừng để đọc ngữ cảnh trước mỗi cuộc.',
    },
    {
      q: 'Nên gọi lại bao nhiêu lần cho một liên hệ không bắt máy?',
      a: 'Không có con số đúng cho mọi trường hợp, nhưng nguyên tắc là phải có giới hạn được thống nhất trước và khoảng cách giữa các lần đủ xa. Không đặt giới hạn dẫn tới cuộc gọi lặp lại gây khó chịu và ảnh hưởng tới cách người nhận phản ứng với đầu số của doanh nghiệp.',
    },
    {
      q: 'Dữ liệu khách hàng lấy từ đâu là hợp lệ?',
      a: 'Tính hợp lệ phụ thuộc vào nguồn dữ liệu, sự đồng ý của người được liên hệ và quy định áp dụng cho ngành, nên đây là câu hỏi cần xác nhận với bộ phận pháp chế của doanh nghiệp. Bài viết này không thay thế được bước xác nhận đó.',
    },
    {
      q: 'Làm sao biết kịch bản gọi có vấn đề?',
      a: 'Dấu hiệu sớm nhất là tỷ lệ kết thúc cuộc gọi rất sớm ở tập liên hệ đầu tiên. Đó là lý do nên chạy thử vài chục liên hệ và nghe lại một phần trong số đó trước khi mở rộng, thay vì chờ hết đợt mới phân tích.',
    },
    {
      q: 'Kết quả cuộc gọi nên có bao nhiêu lựa chọn?',
      a: 'Đủ để phân biệt các tình huống cần hành động khác nhau, và không nhiều hơn. Khi danh sách vượt quá khoảng bảy lựa chọn, nhân viên bắt đầu chọn theo thói quen thay vì theo tình huống thật, và dữ liệu mất giá trị phân tích.',
    },
  ],

  images: [
    {
      id: 'featured',
      role: 'featured',
      status: 'PRODUCT_SCREENSHOT_REQUIRED',
      kind: 'Ảnh chụp màn hình sản phẩm',
      shows:
        'Màn hình danh sách gọi ra trong Gcalls Plus với cột trạng thái từng liên hệ và ô ghi nhận kết quả dạng lựa chọn.',
      placement: 'Ảnh đại diện, hiển thị đầu bài',
      source: 'Ảnh chụp thật từ môi trường demo nội bộ. Không dựng giao diện giả.',
      masking:
        'Che tên, số điện thoại và ghi chú thật của mọi liên hệ; che tên nhân viên và tên tenant. Gắn nhãn "ảnh minh hoạ".',
      alt: 'Ảnh chụp danh sách gọi ra với cột trạng thái từng liên hệ, dữ liệu khách hàng đã được che',
      dimensions: '1600×900',
      reusable: 'KHÔNG — riêng cho bài này',
    },
    {
      id: 'inline-1',
      role: 'in-article',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ quy trình sáu bước',
      shows:
        'Sáu bước tổ chức đợt gọi ra xếp tuyến tính, có nhánh quay lại từ bước chạy thử về bước làm sạch dữ liệu.',
      placement: 'Trước mục "Bốn giới hạn cần biết trước"',
      source: 'Thiết kế mới theo bộ nhận diện Gcalls',
      masking: 'Không có dữ liệu thật.',
      alt: 'Sơ đồ sáu bước tổ chức một đợt gọi ra, có nhánh quay lại làm sạch dữ liệu sau khi chạy thử',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho nội dung telesales ở các batch sau',
    },
  ],
}
