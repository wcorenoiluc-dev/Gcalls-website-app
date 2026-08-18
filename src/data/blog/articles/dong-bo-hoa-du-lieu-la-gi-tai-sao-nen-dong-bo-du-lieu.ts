import type { BlogArticleBody } from '../types'

/**
 * GC-B01-07 · HUB-03 · SUPPORTING · written from scratch.
 *
 * Re-scoped from legacy post 15743, a generic "what is data synchronisation"
 * definition piece. The new scope is the integration boundary between a phone
 * system and a CRM, which is the question the hub's readers actually arrive
 * with — and it is a concept article, not a competitor review.
 */
export const article: BlogArticleBody = {
  slug: 'dong-bo-hoa-du-lieu-la-gi-tai-sao-nen-dong-bo-du-lieu',

  directAnswer: {
    question: 'Đồng bộ dữ liệu giữa tổng đài và CRM là đồng bộ những gì?',
    answer:
      'Trong hầu hết trường hợp, phần đi từ tổng đài sang CRM là bản ghi hoạt động cuộc gọi: thời điểm, hướng gọi, thời lượng, kết quả và ghi chú. Phần đi ngược lại là thông tin nhận diện khách hàng để hiển thị khi có cuộc gọi. Phạm vi cụ thể luôn bị giới hạn bởi API mà nền tảng CRM công bố.',
  },

  body: `
## Đồng bộ dữ liệu nghĩa là gì trong bối cảnh tổng đài

Cụm từ "đồng bộ dữ liệu" thường được hiểu là hai hệ thống lúc nào cũng giống hệt nhau. Trong bối cảnh tổng đài và CRM, cách hiểu đó gần như luôn sai và dẫn tới kỳ vọng lệch.

Thực tế, hai hệ thống này lưu hai loại thông tin khác nhau. CRM lưu **khách hàng là ai và đang ở giai đoạn nào**. Tổng đài lưu **chuyện gì đã xảy ra trong một cuộc gọi**. Đồng bộ ở đây không phải là làm cho hai bên giống nhau, mà là để mỗi bên có đúng phần thông tin nó cần từ bên kia.

Đặt đúng câu hỏi từ đầu sẽ tránh được phần lớn tranh cãi về sau: không phải "hai hệ thống có đồng bộ không", mà **"trường nào đi theo chiều nào, vào lúc nào"**.

## Ba chiều dữ liệu và ý nghĩa của từng chiều

### Chiều từ CRM sang tổng đài

Mục đích duy nhất của chiều này là nhận diện. Khi có cuộc gọi đến, hệ thống cần biết số điện thoại đó thuộc về ai để hiển thị cho nhân viên trước khi họ bấm nhận.

Thông tin cần thiết cho việc này ít hơn nhiều so với mong đợi: tên, định danh hồ sơ, người phụ trách, và có thể là trạng thái hiện tại. Đưa toàn bộ trường dữ liệu khách hàng sang tổng đài không tạo thêm giá trị nhưng làm tăng phạm vi dữ liệu đi qua ranh giới hệ thống — điều mà bộ phận phụ trách dữ liệu thường không chấp thuận.

### Chiều từ tổng đài sang CRM

Đây là chiều mang lại giá trị rõ nhất và cũng là chiều được triển khai nhiều nhất. Kết quả là một bản ghi hoạt động gắn vào hồ sơ khách hàng.

| Trường | Nguồn | Vì sao cần |
|---|---|---|
| Thời điểm cuộc gọi | Hệ thống thoại | Dựng lại trình tự tương tác với khách hàng |
| Hướng gọi | Hệ thống thoại | Phân biệt khách chủ động liên hệ và doanh nghiệp chủ động |
| Thời lượng | Hệ thống thoại | Phân biệt cuộc trao đổi thật với cuộc gọi không kết nối |
| Kết quả cuộc gọi | Nhân viên chọn | Cơ sở duy nhất để tổng hợp theo nhóm và theo thời gian |
| Ghi chú | Nhân viên nhập | Là thứ người tiếp theo đọc để không bắt khách kể lại |
| Người thực hiện | Hệ thống thoại | Gắn hoạt động với người phụ trách |
| Liên kết tới bản ghi âm | Hệ thống thoại | Cho phép nghe lại khi cần đối chiếu |

Trường cuối cùng đáng lưu ý: thứ được đồng bộ thường là **đường dẫn tới bản ghi**, không phải tệp âm thanh. Việc lưu tệp ghi âm bên trong CRM làm phát sinh vấn đề về dung lượng và về phạm vi lưu trữ dữ liệu, nên đây là hạng mục cần quyết định có chủ đích.

### Chiều hai bên cùng ghi

Có những trường mà cả hai hệ thống đều muốn ghi — ví dụ trạng thái liên hệ của khách hàng. Đây là nguồn gốc của gần như mọi sự cố dữ liệu trong dự án tích hợp.

Nguyên tắc an toàn là **mỗi trường chỉ có một hệ thống là nguồn sự thật**. Hệ thống còn lại đọc, không ghi. Khi hai bên cùng ghi được, sớm muộn sẽ có một lần ghi đè xoá mất thông tin và không ai truy được nguyên nhân.

> **Câu hỏi phải trả lời cho từng trường.** Hệ thống nào là nguồn sự thật? Nếu không trả lời được, đừng đồng bộ trường đó cho tới khi trả lời được.

## Bốn giới hạn thực tế

- **Phạm vi API.** Doanh nghiệp chỉ đồng bộ được những gì nền tảng CRM cho phép qua API. Đây là giới hạn cứng và cần xác nhận bằng tài liệu, không bằng lời hứa.
- **Độ trễ.** Rất ít kết nối là tức thời. Bản ghi hoạt động thường xuất hiện sau khi cuộc gọi kết thúc, và khoảng trễ đó cần được nêu rõ để đội ngũ không tưởng là mất dữ liệu.
- **Hạn mức yêu cầu.** Nền tảng thường giới hạn số lượng yêu cầu trong một khoảng thời gian. Với khối lượng cuộc gọi lớn, đây trở thành ràng buộc thật.
- **Trường tuỳ chỉnh.** Nếu CRM đã được tuỳ biến nhiều, các trường riêng có thể không nằm trong phạm vi API tiêu chuẩn và cần xử lý riêng.

Bốn giới hạn này đều xác định được trước khi bắt đầu. Phần chuẩn bị đầy đủ nằm ở [checklist đánh giá mức độ sẵn sàng tích hợp](/checklist-danh-gia-san-sang-tich-hop-tong-dai-voi-crm/).

## Cách kiểm tra phạm vi trước khi triển khai

Có một phép thử đơn giản để biết phạm vi đồng bộ đã được xác định đủ rõ hay chưa: **viết ra một cuộc gọi giả định và mô tả từng thứ sẽ xuất hiện ở đâu**.

Ví dụ: khách hàng đã có trong CRM gọi vào lúc mười giờ, nói chuyện bốn phút, nhân viên chọn kết quả "hẹn gọi lại" và ghi một câu ghi chú. Sau cuộc gọi đó, trong CRM phải xuất hiện những gì, ở hồ sơ nào, trong bao lâu, và ai nhìn thấy được.

Nếu mô tả này viết ra được thành câu cụ thể, phạm vi đã đủ rõ để triển khai. Nếu phải dùng những cụm như "hệ thống sẽ tự cập nhật", phạm vi chưa được xác định — và đó là lúc dự án sẽ phát sinh yêu cầu bổ sung giữa chừng.

Nên làm bài tập này cho ít nhất bốn tình huống: cuộc gọi đến từ số đã biết, cuộc gọi đến từ số chưa biết, cuộc gọi ra, và cuộc gọi nhỡ. Bốn tình huống này bao phủ gần như toàn bộ các quyết định cần đưa ra.

## Checklist xác định phạm vi đồng bộ

- [ ] Đã liệt kê từng trường cần đồng bộ, không mô tả chung chung
- [ ] Mỗi trường đã được chỉ định đúng một hệ thống làm nguồn sự thật
- [ ] Đã quyết định bản ghi âm được đồng bộ dưới dạng đường dẫn hay tệp
- [ ] Đã xác nhận từng trường nằm trong phạm vi API bằng tài liệu nền tảng
- [ ] Đã biết độ trễ dự kiến và thông báo cho đội ngũ sử dụng
- [ ] Đã kiểm tra hạn mức yêu cầu so với khối lượng cuộc gọi thực tế
- [ ] Đã quyết định cách xử lý khi kết nối gián đoạn và dữ liệu tồn đọng

## Sai lầm thường gặp

- **Yêu cầu "đồng bộ tất cả".** Yêu cầu này không thực hiện được và che giấu việc chưa ai xác định thứ gì thực sự cần.
- **Cho phép hai hệ thống cùng ghi một trường.** Đây là nguyên nhân phổ biến nhất của mất dữ liệu trong dự án tích hợp.
- **Đồng bộ tệp ghi âm vào CRM mà không cân nhắc.** Phát sinh vấn đề dung lượng và phạm vi lưu trữ dữ liệu, thường được phát hiện sau vài tháng.
- **Không thông báo độ trễ cho người dùng.** Đội ngũ tưởng dữ liệu bị mất và bắt đầu nhập tay song song, tạo ra bản ghi trùng.
- **Bỏ qua cuộc gọi nhỡ.** Nhóm dữ liệu này thường có giá trị cao nhất về mặt cơ hội và hay bị loại khỏi phạm vi ban đầu.

## Kết luận

Đồng bộ giữa tổng đài và CRM là một tập hợp các quyết định về từng trường, không phải một công tắc bật tắt. Cách tiếp cận hiệu quả là liệt kê trường, chỉ định nguồn sự thật cho từng trường, rồi đối chiếu với phạm vi API — theo đúng thứ tự đó.

Ở phía hỗ trợ khách hàng, ranh giới đồng bộ có logic khác vì vòng đời ticket khác vòng đời cơ hội bán hàng; phần đó nằm ở bài [dữ liệu nào thực sự đồng bộ giữa tổng đài và Helpdesk](/du-lieu-dong-bo-giua-tong-dai-va-helpdesk/).

Xem phạm vi Gcalls hỗ trợ tại [tổng đài tích hợp CRM](/tong-dai-tich-hop-crm/).
`,

  faq: [
    {
      q: 'Đồng bộ một chiều và hai chiều khác nhau thế nào?',
      a: 'Một chiều nghĩa là dữ liệu chỉ đi theo một hướng, thường là từ tổng đài ghi bản ghi hoạt động sang CRM. Hai chiều nghĩa là cả hai hệ thống cùng ghi được. Hai chiều nghe linh hoạt hơn nhưng đòi hỏi quy tắc rõ ràng về nguồn sự thật cho từng trường, nếu không sẽ xảy ra ghi đè.',
    },
    {
      q: 'Bản ghi âm có được lưu trong CRM không?',
      a: 'Thông thường thứ được đồng bộ là đường dẫn tới bản ghi chứ không phải tệp âm thanh, vì lưu tệp trong CRM phát sinh vấn đề dung lượng và phạm vi lưu trữ. Quyết định này nên có chủ đích và cần đối chiếu với quy định về lưu trữ dữ liệu áp dụng cho doanh nghiệp.',
    },
    {
      q: 'Vì sao bản ghi hoạt động xuất hiện chậm hơn cuộc gọi?',
      a: 'Vì bản ghi chỉ hoàn chỉnh sau khi cuộc gọi kết thúc và nhân viên nhập kết quả. Ngoài ra, mỗi kết nối đều có độ trễ kỹ thuật nhất định. Điều quan trọng là độ trễ này được nêu rõ với đội ngũ, để không ai nhập tay song song và tạo ra bản ghi trùng.',
    },
    {
      q: 'Nếu CRM có trường tuỳ chỉnh thì sao?',
      a: 'Trường tuỳ chỉnh có thể nằm ngoài phạm vi API tiêu chuẩn của nền tảng, nên cần kiểm tra riêng từng trường thay vì giả định tất cả đều truy cập được. Đây là hạng mục nên xác nhận sớm vì nó thường quyết định phạm vi khả thi của cả dự án.',
    },
    {
      q: 'Cuộc gọi nhỡ có nên được đồng bộ không?',
      a: 'Nên, vì đây thường là nhóm dữ liệu phản ánh nhu cầu chưa được đáp ứng. Điều cần quyết định trước là cuộc gọi nhỡ tạo bản ghi hoạt động dạng nào và có kích hoạt việc cần làm tiếp theo hay không, để nó không trở thành dữ liệu chỉ nằm đó.',
    },
  ],

  images: [
    {
      id: 'featured',
      role: 'featured',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ chiều dữ liệu',
      shows:
        'Hai hệ thống đặt hai bên, ba nhóm mũi tên: CRM sang tổng đài (nhận diện), tổng đài sang CRM (bản ghi hoạt động), và vùng cảnh báo cho các trường hai bên cùng ghi.',
      placement: 'Ảnh đại diện, hiển thị đầu bài',
      source: 'Thiết kế mới theo bộ nhận diện Gcalls',
      masking: 'Không có dữ liệu thật; không hiển thị logo nền tảng bên thứ ba.',
      alt: 'Sơ đồ ba chiều dữ liệu giữa hệ thống tổng đài và CRM, gồm vùng cảnh báo trường hai bên cùng ghi',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho nội dung tích hợp trong HUB-03',
    },
  ],
}
