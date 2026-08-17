import type { BlogArticleBody } from '../types'

/**
 * GC-B01-08 · HUB-03 · SUPPORTING · net-new.
 *
 * The Helpdesk side of the hub had no non-competitor legacy article at all.
 * Intent overlaps deliberately with GC-B01-07 (both definitional) but the
 * subject differs: ticket lifecycle, not CRM record lifecycle. The distinction
 * is recorded in editorial-cannibalization-map.csv so it is intentional rather
 * than accidental.
 */
export const article: BlogArticleBody = {
  slug: 'du-lieu-dong-bo-giua-tong-dai-va-helpdesk',

  directAnswer: {
    question: 'Dữ liệu nào đồng bộ giữa tổng đài và Helpdesk?',
    answer:
      'Phần cốt lõi là liên kết giữa một cuộc gọi và một ticket: cuộc gọi tạo ticket mới hoặc gắn vào ticket đang mở, kèm thời điểm, người xử lý, ghi chú và đường dẫn bản ghi. Chiều ngược lại đưa trạng thái ticket sang màn hình nhân viên. Vòng đời ticket, chứ không phải hồ sơ khách hàng, quyết định phạm vi đồng bộ.',
  },

  body: `
## Vì sao phía Helpdesk có logic khác phía CRM

Khi kết nối tổng đài với CRM, đơn vị dữ liệu trung tâm là **hồ sơ khách hàng** — một thực thể tồn tại lâu dài và tích luỹ lịch sử. Khi kết nối với Helpdesk, đơn vị trung tâm là **ticket** — một thực thể có vòng đời ngắn, có trạng thái, và sẽ đóng lại.

Khác biệt đó thay đổi mọi thứ. Một bản ghi hoạt động gắn vào hồ sơ khách hàng thì luôn hợp lệ. Một cuộc gọi gắn vào ticket thì phải trả lời được câu hỏi: ticket nào, và nếu chưa có thì có tạo mới không.

Bài này đi qua bốn quyết định phải đưa ra trước, ranh giới dữ liệu thực tế, và những gì không nên đẩy qua ranh giới đó.

## Bốn quyết định phải có trước khi cấu hình

### 1. Cuộc gọi đến có tự tạo ticket không

Có hai trường phái, và cả hai đều có lý.

**Tự tạo mọi cuộc gọi thành ticket** cho phép không bỏ sót yêu cầu nào, nhưng tạo ra nhiều ticket rác từ những cuộc gọi nhầm số hoặc hỏi thông tin đơn giản. Hệ quả là chỉ số về khối lượng ticket mất ý nghĩa.

**Để nhân viên chủ động tạo ticket** giữ dữ liệu sạch hơn nhưng phụ thuộc vào thói quen, và những yêu cầu không được tạo ticket sẽ biến mất khỏi mọi báo cáo.

Phương án trung gian phổ biến là tự tạo bản ghi cuộc gọi cho mọi cuộc, nhưng chỉ nâng thành ticket khi nhân viên xác nhận có yêu cầu cần xử lý.

### 2. Gắn vào ticket đang mở hay tạo ticket mới

Khi khách hàng gọi lại về một việc đang xử lý, cuộc gọi nên gắn vào ticket cũ. Câu hỏi là hệ thống nhận ra điều đó bằng cách nào. Trong thực tế, quyết định này thường phải giao cho nhân viên: hệ thống hiển thị các ticket đang mở của khách hàng đó và nhân viên chọn.

Tự động gắn vào ticket mở gần nhất nghe tiện nhưng sai trong trường hợp khách có nhiều việc song song — và sai kiểu này rất khó phát hiện về sau.

### 3. Ai là người xử lý được ghi nhận

Nếu cuộc gọi được chuyển tiếp qua hai người, ticket ghi nhận ai. Quy tắc cần thống nhất trước, vì nó ảnh hưởng tới cách đánh giá khối lượng công việc của từng nhóm.

### 4. Ticket đóng thì cuộc gọi sau đó đi đâu

Khách gọi lại sau khi ticket đã đóng là tình huống thường xuyên. Quy tắc phổ biến là mở lại ticket cũ nếu trong một khoảng thời gian nhất định, và tạo ticket mới nếu ngoài khoảng đó. Khoảng thời gian đó là quyết định nghiệp vụ, không phải mặc định kỹ thuật.

## Ranh giới dữ liệu thực tế

| Dữ liệu | Chiều | Ghi chú |
|---|---|---|
| Thời điểm, hướng gọi, thời lượng | Tổng đài → Helpdesk | Nền tảng của mọi bản ghi tương tác |
| Số điện thoại và định danh người gọi | Tổng đài → Helpdesk | Dùng để tra cứu khách hàng và ticket đang mở |
| Ghi chú của nhân viên | Tổng đài → Helpdesk | Nên là một bản ghi trong ticket, không ghi đè mô tả gốc |
| Đường dẫn bản ghi âm | Tổng đài → Helpdesk | Đường dẫn, không phải tệp; cần kiểm tra quy định lưu trữ |
| Danh sách ticket đang mở | Helpdesk → Tổng đài | Để nhân viên chọn đúng ticket khi nhận cuộc gọi |
| Trạng thái và người phụ trách ticket | Helpdesk → Tổng đài | Giúp nhân viên biết việc đang ở đâu trước khi trả lời |
| Nội dung trao đổi qua kênh khác | Helpdesk → Tổng đài | Chỉ khi thực sự cần; đây là phạm vi dữ liệu nhạy cảm |

Dòng cuối cùng đáng cân nhắc kỹ. Việc đưa toàn bộ nội dung trao đổi qua email hoặc tin nhắn sang màn hình nhân viên thoại giúp có ngữ cảnh, nhưng đồng thời mở rộng phạm vi dữ liệu đi qua ranh giới hệ thống. Nếu chỉ cần biết "có việc gì đang mở", tiêu đề và trạng thái là đủ.

> **Nguyên tắc chung với cả hai phía.** Mỗi trường chỉ nên có một hệ thống là nguồn sự thật. Trạng thái ticket thuộc về Helpdesk; dữ liệu cuộc gọi thuộc về tổng đài. Khi hai bên cùng ghi được một trường, sớm muộn sẽ có một lần ghi đè không truy được nguyên nhân.

## Những gì không nên đẩy qua ranh giới

- **Tệp ghi âm.** Dung lượng lớn và làm phát sinh câu hỏi về nơi dữ liệu được lưu. Đường dẫn có kiểm soát truy cập là phương án gọn hơn.
- **Toàn bộ trường dữ liệu khách hàng.** Nhân viên thoại cần đủ để nhận diện và xử lý, không cần toàn bộ hồ sơ.
- **Dữ liệu nhạy cảm không phục vụ xử lý cuộc gọi.** Mỗi trường thêm vào là một trường phải bảo vệ ở cả hai phía.
- **Ghi chú nội bộ mang tính đánh giá nhân sự.** Đây là dữ liệu quản trị nội bộ, không thuộc về bản ghi ticket.

## Checklist xác định phạm vi phía Helpdesk

- [ ] Đã quyết định cuộc gọi đến có tự tạo ticket hay không
- [ ] Đã quyết định cách gắn cuộc gọi vào ticket đang mở, tự động hay do nhân viên chọn
- [ ] Đã thống nhất người xử lý được ghi nhận khi cuộc gọi qua nhiều người
- [ ] Đã đặt quy tắc mở lại ticket đã đóng và khoảng thời gian áp dụng
- [ ] Đã liệt kê từng trường đồng bộ và chiều đi của nó
- [ ] Đã chỉ định nguồn sự thật cho từng trường
- [ ] Đã xác nhận cách xử lý bản ghi âm phù hợp với quy định lưu trữ của doanh nghiệp
- [ ] Đã giới hạn dữ liệu Helpdesk hiển thị trên màn hình thoại ở mức cần thiết

## Sai lầm thường gặp

- **Tự động tạo ticket cho mọi cuộc gọi mà không lọc.** Khối lượng ticket tăng vọt và mọi chỉ số về hỗ trợ khách hàng mất ý nghĩa so sánh.
- **Tự động gắn vào ticket mở gần nhất.** Sai trong trường hợp khách có nhiều việc song song, và sai kiểu này rất khó phát hiện.
- **Ghi đè mô tả gốc của ticket bằng ghi chú cuộc gọi.** Mất ngữ cảnh ban đầu, là thứ người xử lý tiếp theo cần nhất.
- **Đưa toàn bộ nội dung trao đổi các kênh sang màn hình thoại.** Mở rộng phạm vi dữ liệu nhạy cảm mà không thêm giá trị xử lý tương ứng.
- **Không định nghĩa quy tắc mở lại ticket.** Đội ngũ tự xử lý theo cách khác nhau và dữ liệu không so sánh được giữa các nhóm.

## Kết luận

Phạm vi đồng bộ với Helpdesk được quyết định bởi vòng đời ticket, không bởi mong muốn có nhiều dữ liệu. Bốn quyết định ở đầu bài đều là quyết định nghiệp vụ và nên được chốt trước khi bất kỳ cấu hình nào được viết.

Phía CRM có logic khác vì đơn vị dữ liệu là hồ sơ khách hàng chứ không phải ticket; phần đó nằm ở bài [đồng bộ dữ liệu giữa tổng đài và CRM](/dong-bo-hoa-du-lieu-la-gi-tai-sao-nen-dong-bo-du-lieu/). Phần chuẩn bị chung cho cả hai phía nằm ở [checklist đánh giá mức độ sẵn sàng tích hợp](/checklist-danh-gia-san-sang-tich-hop-tong-dai-voi-crm/).

Xem phạm vi Gcalls hỗ trợ tại [tổng đài tích hợp Helpdesk](/tong-dai-tich-hop-helpdesk/).
`,

  faq: [
    {
      q: 'Có nên để mọi cuộc gọi tự tạo ticket không?',
      a: 'Cách này bảo đảm không bỏ sót nhưng tạo ra nhiều ticket từ cuộc gọi nhầm số hoặc hỏi thông tin đơn giản, khiến chỉ số khối lượng mất ý nghĩa. Phương án cân bằng phổ biến là ghi nhận mọi cuộc gọi, nhưng chỉ nâng thành ticket khi nhân viên xác nhận có yêu cầu cần xử lý.',
    },
    {
      q: 'Khách gọi lại về việc cũ thì xử lý thế nào?',
      a: 'Nếu ticket còn mở, cuộc gọi nên gắn vào ticket đó. Nếu ticket đã đóng, cần một quy tắc thống nhất: mở lại trong một khoảng thời gian nhất định, hoặc tạo ticket mới có liên kết tới ticket cũ. Khoảng thời gian đó là quyết định nghiệp vụ, nên do đội hỗ trợ đặt ra.',
    },
    {
      q: 'Bản ghi âm có nên nằm trong ticket không?',
      a: 'Nên là đường dẫn có kiểm soát truy cập chứ không phải tệp âm thanh gắn kèm. Cách này tránh vấn đề dung lượng và giữ được kiểm soát về nơi dữ liệu được lưu, vốn là hạng mục cần đối chiếu với quy định lưu trữ áp dụng cho doanh nghiệp.',
    },
    {
      q: 'Nhân viên thoại có cần thấy toàn bộ nội dung email của khách không?',
      a: 'Thường là không cần. Tiêu đề, trạng thái và người phụ trách của các ticket đang mở đã đủ để trả lời có ngữ cảnh. Đưa toàn bộ nội dung trao đổi sang màn hình thoại mở rộng phạm vi dữ liệu nhạy cảm mà không thêm giá trị xử lý tương ứng.',
    },
    {
      q: 'Nếu doanh nghiệp dùng cả CRM và Helpdesk thì nối vào đâu?',
      a: 'Nguyên tắc là mỗi loại dữ liệu chỉ có một điểm đến chính: bản ghi hoạt động bán hàng vào CRM, bản ghi hỗ trợ vào Helpdesk. Kết nối cả hai vào cùng một loại dữ liệu sẽ tạo ra hai bản ghi cho một cuộc gọi và không hệ thống nào phản ánh đúng thực tế.',
    },
  ],

  images: [
    {
      id: 'featured',
      role: 'featured',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ vòng đời ticket',
      shows:
        'Vòng đời một ticket từ lúc tạo tới lúc đóng, với các điểm dữ liệu cuộc gọi được ghi vào ở từng giai đoạn và nhánh mở lại sau khi đóng.',
      placement: 'Ảnh đại diện, hiển thị đầu bài',
      source: 'Thiết kế mới theo bộ nhận diện Gcalls',
      masking: 'Không có dữ liệu thật; không hiển thị logo nền tảng bên thứ ba.',
      alt: 'Sơ đồ vòng đời ticket hỗ trợ và các điểm dữ liệu cuộc gọi được ghi vào từng giai đoạn',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho nội dung Helpdesk trong HUB-03',
    },
    {
      id: 'inline-1',
      role: 'in-article',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ ranh giới dữ liệu',
      shows:
        'Hai vùng hệ thống với danh sách trường được phép đi qua ranh giới và vùng "không nên đẩy qua" được đánh dấu rõ.',
      placement: 'Sau bảng ranh giới dữ liệu',
      source: 'Thiết kế mới',
      masking: 'Không có dữ liệu thật.',
      alt: 'Sơ đồ ranh giới dữ liệu giữa tổng đài và Helpdesk, phân biệt trường nên và không nên đồng bộ',
      dimensions: '1600×900',
      reusable: 'KHÔNG — riêng cho bài này',
    },
  ],
}
