import type { BlogArticleBody } from '../types'

/**
 * GC-B01-06 · HUB-03 · PILLAR · net-new.
 *
 * The highest-intent integration topic in the hub and the one the legacy corpus
 * had nothing equivalent to — the legacy CRM rows were all competitor reviews,
 * which is exactly what this batch removes.
 */
export const article: BlogArticleBody = {
  slug: 'checklist-danh-gia-san-sang-tich-hop-tong-dai-voi-crm',

  directAnswer: {
    question: 'Cần chuẩn bị gì trước khi tích hợp tổng đài với CRM?',
    answer:
      'Trước khi kết nối, doanh nghiệp cần trả lời năm nhóm câu hỏi: ai có quyền truy cập hệ thống, dữ liệu khách hàng đã đủ sạch chưa, quy tắc xử lý bản ghi trùng là gì, API của CRM cho phép làm những gì, và ai chịu trách nhiệm nghiệm thu. Thiếu bất kỳ nhóm nào, dự án sẽ dừng lại ở giữa chừng.',
  },

  body: `
## Vì sao dự án tích hợp thất bại ở bước chuẩn bị

Phần lớn dự án kết nối tổng đài với CRM không thất bại vì kỹ thuật. Chúng thất bại vì bắt đầu trước khi doanh nghiệp trả lời được những câu hỏi mà chỉ doanh nghiệp mới trả lời được.

Nhà cung cấp có thể nói API hỗ trợ ghi lịch sử cuộc gọi vào hồ sơ khách hàng. Nhưng "hồ sơ khách hàng nào" là câu hỏi nội bộ. Nếu cùng một khách hàng đang tồn tại ở ba bản ghi với ba cách viết tên, việc ghi lịch sử cuộc gọi vào sẽ tạo ra lịch sử rải rác trên ba hồ sơ — kết quả tệ hơn trước khi tích hợp.

Bài này tổ chức phần chuẩn bị thành năm nhóm. Mỗi nhóm có câu hỏi cụ thể và một mức điểm, để cuối bài doanh nghiệp biết mình đang ở đâu.

## Nhóm 1 — Quyền truy cập và trách nhiệm

Đây là nhóm nghe hành chính nhất và là nhóm chặn dự án lâu nhất trong thực tế.

### Ai sở hữu tài khoản quản trị CRM

Câu trả lời "phòng IT" không đủ. Cần một cá nhân có quyền tạo kết nối, cấp khoá truy cập và phê duyệt phạm vi dữ liệu. Nếu tài khoản quản trị thuộc về một đơn vị triển khai bên ngoài đã kết thúc hợp đồng, đó là việc phải xử lý trước, không phải trong lúc triển khai.

### Ai quyết định phạm vi dữ liệu được chia sẻ

Tích hợp nghĩa là dữ liệu đi qua ranh giới hệ thống. Cần một người có thẩm quyền quyết định trường nào được đồng bộ và trường nào không, và quyết định đó nên được ghi lại.

### Ai nghiệm thu

Người nghiệm thu phải là người sẽ dùng kết quả — thường là trưởng nhóm bán hàng hoặc trưởng nhóm chăm sóc khách hàng, không phải người phụ trách kỹ thuật. Nếu không chỉ định trước, dự án sẽ "xong" mà không ai xác nhận là dùng được.

## Nhóm 2 — Chất lượng dữ liệu khách hàng

### Định danh khách hàng có nhất quán không

Câu hỏi cụ thể: khi một cuộc gọi đến từ số điện thoại X, hệ thống có tìm được đúng một hồ sơ khách hàng không? Nếu số điện thoại được lưu ở nhiều trường khác nhau, với nhiều định dạng khác nhau, câu trả lời là không.

### Định dạng số điện thoại đã chuẩn hoá chưa

Một danh sách thực tế thường chứa cùng một số ở nhiều dạng: có mã quốc gia, không có mã quốc gia, có dấu cách, có dấu chấm, có ký tự thừa. Việc đối chiếu số gọi đến với hồ sơ chỉ hoạt động khi định dạng được chuẩn hoá về một dạng duy nhất.

### Tỷ lệ bản ghi trùng đã biết chưa

Không cần bằng không, nhưng cần biết. Nếu chưa từng đo, hãy đo trước khi bắt đầu — vì sau khi tích hợp, mỗi bản trùng sẽ nhân đôi thành hai luồng lịch sử tương tác.

## Nhóm 3 — Quy tắc nghiệp vụ

Đây là nhóm cần quyết định của người vận hành, không phải của kỹ thuật.

| Tình huống | Câu hỏi phải trả lời trước | Hậu quả nếu bỏ qua |
|---|---|---|
| Cuộc gọi từ số chưa có trong CRM | Tạo hồ sơ mới hay để chờ xác nhận | Hệ thống sinh ra hàng loạt hồ sơ rác |
| Số điện thoại khớp nhiều hồ sơ | Chọn hồ sơ nào để ghi lịch sử | Lịch sử rơi vào hồ sơ sai và không ai phát hiện |
| Cuộc gọi nhỡ | Có tạo bản ghi hoạt động không | Mất dấu vết của phần lớn nhu cầu chưa được đáp ứng |
| Nhân viên gọi từ số cá nhân | Có ghi nhận không, và ghi vào đâu | Dữ liệu thiếu mảng và không so sánh được giữa các nhóm |
| Khách hàng thuộc nhiều người phụ trách | Ai được ghi nhận là người tương tác | Tranh chấp nội bộ về chỉ tiêu, và dữ liệu bị sửa tay |

Bảng này nên được điền trước khi bất kỳ ai viết dòng cấu hình đầu tiên. Mỗi ô trống là một quyết định sẽ phải đưa ra trong lúc triển khai, dưới áp lực thời gian, bởi người không có thẩm quyền.

## Nhóm 4 — Phạm vi kỹ thuật của CRM

### API cho phép làm gì

Phạm vi tích hợp bị giới hạn bởi những gì nền tảng CRM công bố qua API, không bởi mong muốn của doanh nghiệp. Ba câu hỏi cần xác nhận bằng tài liệu, không bằng lời hứa:

- Có ghi được bản ghi hoạt động vào hồ sơ khách hàng không, và với những trường nào.
- Có tra cứu được hồ sơ theo số điện thoại không, và tốc độ phản hồi ra sao.
- Có nhận được thông báo khi hồ sơ thay đổi không, hay phải chủ động hỏi định kỳ.

### Có giới hạn số lượng yêu cầu không

Gần như mọi nền tảng đều đặt hạn mức số lượng yêu cầu trong một khoảng thời gian. Điều này ít quan trọng với đội nhỏ và trở thành ràng buộc thật khi khối lượng cuộc gọi tăng, nên cần biết con số trước.

### Phiên bản và gói dịch vụ

Nhiều nền tảng chỉ mở API ở một số gói nhất định. Đây là hạng mục xác nhận với nhà cung cấp CRM, không phải giả định.

Phần chi tiết về những trường dữ liệu thực sự đi qua nằm ở bài [đồng bộ dữ liệu giữa tổng đài và CRM: phạm vi và giới hạn](/dong-bo-hoa-du-lieu-la-gi-tai-sao-nen-dong-bo-du-lieu/).

## Nhóm 5 — Kế hoạch triển khai và nghiệm thu

### Phạm vi thí điểm

Chọn một nhóm có luồng công việc trọn vẹn thay vì bật cho toàn bộ tổ chức. Nhóm thí điểm cần đủ đa dạng để gặp tình huống khó — nếu chỉ chọn những người dùng dễ tính nhất, giai đoạn thí điểm không phát hiện được gì.

### Tiêu chí nghiệm thu viết trước

Nghiệm thu phải là những câu kiểm chứng được, chẳng hạn: khi có cuộc gọi đến từ số đã có trong CRM, hồ sơ đúng hiện ra trước khi nhân viên bấm nhận; sau khi kết thúc, bản ghi hoạt động xuất hiện trong hồ sơ đó kèm ghi chú. Tiêu chí kiểu "tích hợp hoạt động tốt" không nghiệm thu được.

### Phương án khi kết nối gián đoạn

Nếu CRM tạm thời không phản hồi, cuộc gọi vẫn phải thực hiện được và dữ liệu phải được giữ lại để đồng bộ sau. Đây là hạng mục cần hỏi rõ, vì cách xử lý khác nhau giữa các phương án triển khai.

> **Nguyên tắc quan trọng nhất của phần chuẩn bị.** Tích hợp không sửa được dữ liệu bẩn. Nó chỉ làm cho hậu quả của dữ liệu bẩn hiện ra nhanh hơn và ở nhiều nơi hơn.

## Ba tình huống hay gặp và cách xử lý

### Doanh nghiệp đang dùng hai CRM song song

Tình huống này phổ biến hơn nhiều người nghĩ: một hệ thống do đội bán hàng dùng, một hệ thống cũ vẫn còn dữ liệu lịch sử. Việc kết nối tổng đài vào cả hai gần như luôn tạo ra hai bản ghi cho một cuộc gọi và không hệ thống nào phản ánh đúng thực tế.

Cách xử lý là chọn một hệ thống làm nơi lưu hồ sơ chính thức và tích hợp vào đó, đồng thời có kế hoạch riêng cho dữ liệu lịch sử của hệ thống còn lại. Đây là quyết định tổ chức, không phải quyết định kỹ thuật, và nó phải có trước.

### Bộ phận IT không có nhân sự cho dự án

Khi không có người trong nội bộ chịu trách nhiệm kỹ thuật, dự án vẫn triển khai được nhưng phải bù bằng hai thứ: tài liệu cấu hình được viết lại đầy đủ, và một người nghiệp vụ hiểu đủ sâu để nghiệm thu. Không có cả hai, hệ thống sẽ trở thành hộp đen ngay sau khi đơn vị triển khai rời đi.

### Đội ngũ đã có thói quen nhập tay

Nếu nhân viên đã quen ghi hoạt động cuộc gọi vào CRM bằng tay, việc bật đồng bộ tự động mà không thông báo sẽ tạo ra bản ghi trùng trong vài tuần đầu. Cần một buổi trao đổi ngắn để thống nhất: từ thời điểm nào ngừng nhập tay, và ai kiểm tra dữ liệu trong tuần chuyển tiếp.

## Bảng chấm điểm mức độ sẵn sàng

- [ ] Đã xác định cá nhân sở hữu tài khoản quản trị CRM và người đó còn hoạt động
- [ ] Đã có người quyết định phạm vi dữ liệu được chia sẻ, và quyết định được ghi lại
- [ ] Đã chỉ định người nghiệm thu là người sẽ dùng kết quả
- [ ] Số điện thoại trong CRM đã được chuẩn hoá về một định dạng
- [ ] Đã đo tỷ lệ bản ghi trùng và biết con số cụ thể
- [ ] Đã quyết định cách xử lý cuộc gọi từ số chưa có trong CRM
- [ ] Đã quyết định cách chọn hồ sơ khi một số khớp nhiều bản ghi
- [ ] Đã quyết định cuộc gọi nhỡ có tạo bản ghi hoạt động hay không
- [ ] Đã xác nhận phạm vi API bằng tài liệu của nền tảng CRM
- [ ] Đã biết hạn mức số lượng yêu cầu của gói dịch vụ đang dùng
- [ ] Đã chọn nhóm thí điểm có luồng công việc trọn vẹn
- [ ] Đã viết tiêu chí nghiệm thu dưới dạng câu kiểm chứng được
- [ ] Đã thống nhất phương án khi kết nối tạm thời gián đoạn

Cách dùng bảng này hiệu quả nhất là điền cùng nhau trong một buổi làm việc có mặt cả người phụ trách kỹ thuật và người phụ trách nghiệp vụ. Điền riêng lẻ thường cho ra hai bức tranh khác nhau về cùng một hệ thống, và sự khác nhau đó chính là thứ cần phát hiện trước khi dự án bắt đầu.

Tích được từ mười một ô trở lên: có thể khởi động. Từ bảy tới mười: cần một buổi làm việc nội bộ trước. Dưới bảy: việc cần làm là dọn dữ liệu và phân định trách nhiệm, không phải chọn phương án tích hợp.

## Sai lầm thường gặp

- **Bắt đầu từ danh sách tính năng thay vì từ dữ liệu.** Tính năng luôn nghe hợp lý; dữ liệu mới quyết định tính năng có chạy được không.
- **Để kỹ thuật quyết định quy tắc nghiệp vụ.** Người viết cấu hình sẽ chọn phương án dễ triển khai nhất, không phải phương án đúng với cách đội ngũ làm việc.
- **Bỏ qua trường hợp cuộc gọi nhỡ.** Đây thường là nhóm dữ liệu có giá trị nhất và hay bị quên nhất trong bản thiết kế ban đầu.
- **Không đo trước khi tích hợp.** Không có mốc so sánh thì không chứng minh được dự án tạo ra thay đổi gì.
- **Nghiệm thu bằng cảm nhận.** Nếu tiêu chí không viết được thành câu kiểm chứng, dự án sẽ kéo dài vô hạn trong trạng thái "gần xong".
- **Bật cho toàn bộ tổ chức cùng lúc.** Mọi vấn đề xuất hiện đồng thời và không ai truy được nguyên nhân.

## Kết luận

Mức độ sẵn sàng tích hợp không phải là câu hỏi kỹ thuật mà là câu hỏi về dữ liệu, quy tắc và trách nhiệm. Năm nhóm ở trên đều trả lời được trong nội bộ, trước khi liên hệ bất kỳ nhà cung cấp nào — và trả lời trước sẽ rút ngắn phần còn lại đáng kể.

Sau khi hoàn tất checklist, hai bài tiếp theo đi sâu vào phạm vi thực tế: [đồng bộ dữ liệu giữa tổng đài và CRM](/dong-bo-hoa-du-lieu-la-gi-tai-sao-nen-dong-bo-du-lieu/) cho phía CRM, và [dữ liệu nào thực sự đồng bộ giữa tổng đài và Helpdesk](/du-lieu-dong-bo-giua-tong-dai-va-helpdesk/) cho phía hỗ trợ khách hàng.

Xem phạm vi kết nối Gcalls hỗ trợ tại [tổng đài tích hợp CRM](/tong-dai-tich-hop-crm/), hoặc [gửi hiện trạng hệ thống để Gcalls trao đổi](/lien-he/).
`,

  faq: [
    {
      q: 'Tích hợp mất bao lâu?',
      a: 'Thời gian phụ thuộc vào nền tảng CRM, tình trạng dữ liệu và số quy tắc nghiệp vụ cần cấu hình, nên không có con số áp dụng chung. Yếu tố rút ngắn thời gian rõ nhất không phải là kỹ thuật mà là việc doanh nghiệp đã trả lời xong năm nhóm câu hỏi trong bài trước khi bắt đầu.',
    },
    {
      q: 'CRM tự phát triển nội bộ có tích hợp được không?',
      a: 'Được, với điều kiện hệ thống đó cung cấp giao diện lập trình cho phép tra cứu hồ sơ và ghi bản ghi hoạt động. Điểm khác biệt so với nền tảng thương mại là doanh nghiệp phải tự chịu trách nhiệm về tài liệu, phiên bản và việc duy trì giao diện đó khi hệ thống thay đổi.',
    },
    {
      q: 'Nếu dữ liệu khách hàng còn lộn xộn thì có nên tích hợp không?',
      a: 'Nên dọn trước ở mức tối thiểu: chuẩn hoá định dạng số điện thoại và xử lý các bản ghi trùng rõ ràng. Tích hợp không làm sạch dữ liệu; nó chỉ khiến hậu quả của dữ liệu bẩn xuất hiện nhanh hơn và ở nhiều nơi hơn, nên việc dọn trước tiết kiệm hơn dọn sau.',
    },
    {
      q: 'Ai nên là người nghiệm thu dự án tích hợp?',
      a: 'Người sẽ dùng kết quả hằng ngày, thường là trưởng nhóm bán hàng hoặc trưởng nhóm chăm sóc khách hàng. Nếu chỉ có bộ phận kỹ thuật nghiệm thu, tiêu chí sẽ là "kết nối chạy" thay vì "đội ngũ làm việc được", và khoảng cách giữa hai điều đó thường rất lớn.',
    },
    {
      q: 'Có cần dừng hoạt động trong lúc tích hợp không?',
      a: 'Thông thường không, vì việc kết nối diễn ra ở lớp cấu hình chứ không thay đổi cách nghe gọi. Điều cần chuẩn bị là phương án khi kết nối tạm gián đoạn: cuộc gọi vẫn phải thực hiện được và dữ liệu phải được giữ lại để đồng bộ sau.',
    },
    {
      q: 'Nên tích hợp với CRM hay với Helpdesk trước?',
      a: 'Ưu tiên hệ thống nào đang là nơi lưu hồ sơ khách hàng chính thức. Nếu đội bán hàng làm việc trên CRM và đội hỗ trợ làm việc trên Helpdesk, hãy bắt đầu từ đội đang chịu thiệt hại rõ hơn vì thiếu ngữ cảnh cuộc gọi, rồi mở rộng sang hệ thống còn lại.',
      link: {
        label: 'Đọc: dữ liệu nào đồng bộ giữa tổng đài và Helpdesk',
        path: '/du-lieu-dong-bo-giua-tong-dai-va-helpdesk/',
      },
    },
  ],

  images: [
    {
      id: 'featured',
      role: 'featured',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ năm nhóm kiểm tra',
      shows:
        'Năm khối xếp theo trình tự — quyền truy cập, chất lượng dữ liệu, quy tắc nghiệp vụ, phạm vi API, kế hoạch nghiệm thu — với cổng kiểm tra giữa các khối.',
      placement: 'Ảnh đại diện, hiển thị đầu bài',
      source: 'Thiết kế mới theo bộ nhận diện Gcalls',
      masking: 'Không có dữ liệu thật; không hiển thị logo nền tảng bên thứ ba.',
      alt: 'Sơ đồ năm nhóm kiểm tra mức độ sẵn sàng trước khi tích hợp tổng đài với CRM',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho các bài tích hợp khác trong HUB-03',
    },
    {
      id: 'inline-1',
      role: 'in-article',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ cây quyết định',
      shows:
        'Cây quyết định cho cuộc gọi đến: số có trong CRM hay không, khớp một hay nhiều hồ sơ, và hành động tương ứng ở mỗi nhánh.',
      placement: 'Sau bảng ở mục "Nhóm 3 — Quy tắc nghiệp vụ"',
      source: 'Thiết kế mới',
      masking: 'Không có dữ liệu thật.',
      alt: 'Sơ đồ cây quyết định xử lý cuộc gọi đến khi số điện thoại khớp không, một hoặc nhiều hồ sơ CRM',
      dimensions: '1600×900',
      reusable: 'KHÔNG — riêng cho bài này',
    },
  ],

  plannedLinks: [
    {
      label: 'So sánh phạm vi API giữa các nền tảng CRM phổ biến',
      target: 'Batch "integration landscape" (chưa lên lịch)',
      reason:
        'Nội dung này bắt buộc phải kiểm chứng thông tin bên thứ ba trước khi viết, nên không thuộc Batch 1 và không được render liên kết.',
    },
  ],
}
