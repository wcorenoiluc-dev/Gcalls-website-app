import type { BlogArticleBody } from '../types'

/**
 * GC-B01-04 · HUB-02 · PILLAR · net-new.
 *
 * The product-defining pillar HUB-02 was missing. Written as a working day
 * rather than a feature tour, because the hub's problem is that readers cannot
 * picture the daily motion — a feature list does not fix that.
 */
export const article: BlogArticleBody = {
  slug: 'tong-dai-tren-trinh-duyet-hoat-dong-the-nao',

  directAnswer: {
    question: 'Tổng đài trên trình duyệt hoạt động thế nào?',
    answer:
      'Tổng đài trên trình duyệt đưa toàn bộ thao tác nghe gọi vào một tab web: nhân viên đăng nhập, nhận cuộc gọi đến theo hàng đợi, gọi ra từ danh bạ, ghi chú ngay trong lúc trao đổi và chuyển tiếp cho đồng nghiệp khi cần. Mọi thao tác đều để lại dữ liệu, nên ngữ cảnh khách hàng không còn nằm trong máy cá nhân.',
  },

  body: `
## Webphone là gì và vì sao nó thay đổi thói quen làm việc

Webphone là phần mềm nghe gọi chạy trong trình duyệt. Không có máy bàn, không cài đặt phức tạp, không phụ thuộc vào một chiếc máy cụ thể đặt ở một chỗ cụ thể. Nhân viên đăng nhập ở đâu thì làm việc ở đó.

Mô tả kỹ thuật đó đúng nhưng chưa nói lên điều quan trọng nhất. Thay đổi lớn nhất mà webphone tạo ra không nằm ở chỗ gọi được từ trình duyệt, mà ở chỗ **mọi thao tác trong cuộc gọi đều nằm cùng một nơi với dữ liệu khách hàng**. Nhân viên không còn phải nhớ để nhập lại sau, vì việc nhập diễn ra ngay trong lúc nói chuyện.

Bài này mô tả một ngày làm việc thật với webphone, theo trình tự thời gian, để người đọc hình dung được đội ngũ sẽ thao tác gì và điều gì quyết định chất lượng dữ liệu thu được.

### Ba thứ luôn xuất hiện trên màn hình

- **Vùng cuộc gọi.** Trạng thái hiện tại, nút nhận và kết thúc, giữ máy, chuyển tiếp, tắt tiếng.
- **Vùng ngữ cảnh khách hàng.** Ai đang gọi, đã liên hệ lần nào, ghi chú của những lần trước.
- **Vùng ghi nhận.** Kết quả cuộc gọi và ghi chú, điền được ngay trong lúc trao đổi.

Ba vùng này phải nhìn thấy cùng lúc. Nếu ngữ cảnh nằm ở một tab khác và ghi chú nằm ở tab thứ ba, thao tác chuyển qua lại sẽ ăn mất phần lớn lợi ích.

## Buổi sáng: nhận ca và chuẩn bị

### Đăng nhập và trạng thái sẵn sàng

Việc đầu tiên trong ngày là đăng nhập và chuyển trạng thái sang sẵn sàng nhận cuộc gọi. Bước nhỏ này quyết định nhiều thứ: hệ thống chỉ định tuyến cuộc gọi tới người đang sẵn sàng, nên một nhân viên quên đổi trạng thái sẽ không nhận được cuộc gọi nào trong khi vẫn ngồi tại chỗ.

Ở chiều ngược lại, trạng thái cũng là dữ liệu. Người quản lý nhìn vào đó để biết đội đang có bao nhiêu người trực, thay vì đi hỏi từng bàn.

### Kiểm tra thiết bị âm thanh

Trước cuộc gọi đầu tiên, nhân viên kiểm tra tai nghe và micro trong trình duyệt. Đây là bước hay bị bỏ qua và là nguyên nhân phổ biến nhất của những phàn nàn "hệ thống nghe không rõ" trong tuần đầu triển khai. Trong phần lớn trường hợp, vấn đề nằm ở thiết bị hoặc quyền truy cập micro của trình duyệt, không ở hệ thống thoại.

### Xem lại việc còn tồn từ hôm trước

Trước khi bắt đầu, nhân viên xem danh sách cuộc gọi cần liên hệ lại: cuộc gọi nhỡ chưa xử lý, khách đã hẹn gọi lại, việc bàn giao từ ca trước. Đây là thứ mà cách làm bằng máy cá nhân không tạo ra được — không có danh sách nào tồn tại nếu cuộc gọi nhỡ không được ghi lại.

## Giữa buổi: cuộc gọi đến và cuộc gọi ra

### Khi có cuộc gọi đến

Hệ thống định tuyến cuộc gọi theo quy tắc đã cấu hình — theo nhóm, theo thứ tự, hoặc theo người phụ trách khách hàng đó. Trên màn hình nhân viên, ngữ cảnh hiện ra trước khi họ bấm nhận: số gọi đến, tên khách nếu đã có trong hệ thống, và những lần liên hệ gần nhất.

Sự khác biệt nằm ở mấy giây đó. Nhân viên mở đầu bằng "Chào anh, về việc hôm thứ Ba anh có hỏi…" thay vì "Dạ em nghe, anh cần gì ạ?". Cùng một con người, khác nhau ở chỗ có ngữ cảnh hay không.

### Trong lúc trao đổi

Ba thao tác diễn ra thường xuyên nhất:

- **Ghi chú ngay trong lúc nói.** Ô ghi chú nằm cạnh vùng cuộc gọi để nhân viên không phải nhớ rồi nhập lại sau — và điều gì phải nhớ để nhập lại sau thường sẽ không được nhập.
- **Chuyển tiếp cho đồng nghiệp.** Khi câu hỏi vượt phạm vi xử lý, cuộc gọi được chuyển kèm ngữ cảnh, thay vì bảo khách gọi lại số khác.
- **Giữ máy để tra cứu.** Có thông báo rõ cho khách và có ghi nhận thời gian, nên chuyện này đo được thay vì phụ thuộc lời kể.

### Khi gọi ra theo danh sách

Chiều gọi ra có nhịp khác. Nhân viên làm việc theo danh sách đã phân bổ, gọi lần lượt, ghi nhận kết quả từng liên hệ và chuyển sang liên hệ tiếp theo. Phần tổ chức danh sách, phân bổ và các giới hạn cần biết nằm ở bài [gọi ra theo danh sách](/phan-mem-goi-tu-dong-va-loi-ich-doi-voi-chien-luoc-ban-hang/).

Điều đáng lưu ý ở đây là **kết quả cuộc gọi phải là một lựa chọn có sẵn, không phải một ô văn bản tự do**. Ô tự do tạo ra hai mươi cách viết cho cùng một trạng thái và không tổng hợp được.

## Cuối ngày: ghi nhận và bàn giao

### Ba trường tối thiểu sau mỗi cuộc gọi

Nếu chỉ chọn được ba thứ để bắt buộc ghi nhận, ba thứ đó nên là:

| Trường | Vì sao cần | Dạng dữ liệu nên dùng |
|---|---|---|
| Kết quả cuộc gọi | Là cơ sở duy nhất để tổng hợp theo nhóm và theo thời gian | Danh sách chọn, không quá bảy lựa chọn |
| Việc cần làm tiếp theo | Quyết định cuộc gọi này có được nối tiếp hay rơi vào quên lãng | Danh sách chọn kèm ngày |
| Ghi chú ngữ cảnh | Là thứ người tiếp theo đọc để không bắt khách kể lại | Văn bản ngắn, một tới ba câu |

Danh sách dài hơn sẽ giảm tỷ lệ được điền. Một trường bắt buộc mà nhân viên điền cho có còn tệ hơn không có trường đó, vì nó tạo cảm giác dữ liệu đầy đủ trong khi nội dung rỗng.

### Bàn giao ca

Cuối ngày, những việc chưa xong chuyển sang danh sách của ca sau: khách hẹn gọi lại, cuộc gọi nhỡ chưa liên hệ được, vấn đề đang chờ bộ phận khác trả lời. Bàn giao bằng hệ thống thay vì bằng lời nói là điểm khác biệt lớn nhất giữa một đội có công cụ chung và một đội không có.

> **Điều quyết định thành bại của tuần đầu tiên.** Không phải tính năng, mà là việc đội ngũ có thống nhất được danh sách kết quả cuộc gọi trước khi bắt đầu hay không. Thống nhất sau khi đã chạy một tháng đồng nghĩa với một tháng dữ liệu không dùng được.

## Người quản lý nhìn thấy gì trong cùng một ngày

Webphone không chỉ thay đổi công việc của nhân viên. Nó thay đổi thứ mà người quản lý có trong tay khi phải ra quyết định giữa ca.

- **Ai đang trực và ai đang bận.** Thay vì đi một vòng phòng, người quản lý nhìn trạng thái sẵn sàng của cả đội. Khi hàng đợi dài lên, việc điều thêm người trở thành một thao tác chứ không phải một cuộc trao đổi.
- **Cuộc gọi nào chưa được xử lý lại.** Danh sách cuộc gọi nhỡ là danh sách việc, không phải một con số thống kê cuối tháng.
- **Nhóm nào đang chịu tải nặng hơn.** Phân bổ lại giữa các nhóm cần cơ sở, và cơ sở đó chỉ tồn tại khi mọi cuộc gọi đi qua cùng một hệ thống.
- **Cuộc gọi nào nên nghe lại.** Không phải để giám sát từng người, mà để chọn mẫu cho hoạt động đánh giá chất lượng. Cách chọn mẫu và cách chấm điểm nằm ở bài [xây dựng bộ tiêu chí đánh giá chất lượng cuộc gọi](/xay-dung-bo-tieu-chi-danh-gia-chat-luong-cuoc-goi/).

Điều cần tránh là biến những dữ liệu này thành bảng xếp hạng số cuộc gọi. Chỉ số đó tăng khi nhân viên rút ngắn cuộc trao đổi, nên nó khuyến khích đúng hành vi mà đội chăm sóc khách hàng cần tránh.

## Ba tình huống thường gặp và cách xử lý

### Khách gọi vào ngoài giờ làm việc

Cuộc gọi ngoài giờ vẫn cần một điểm đến. Phương án phổ biến là lời chào thông báo giờ làm việc kèm ghi âm lời nhắn, và cuộc gọi đó xuất hiện trong danh sách việc tồn của ca sau. Điều quan trọng không phải là có trả lời ngay hay không, mà là cuộc gọi có để lại dấu vết hay không.

### Nhiều người cùng phụ trách một khách hàng

Khi một khách hàng làm việc với cả bộ phận bán hàng và bộ phận hỗ trợ, quy tắc định tuyến cần quyết định ai nhận trước. Cách làm ít gây tranh cãi nhất là định tuyến theo bản chất cuộc gọi chứ không theo người: cuộc gọi vào hotline hỗ trợ đi về nhóm hỗ trợ, kể cả khi khách quen với một nhân viên bán hàng cụ thể.

### Nhân viên nghỉ đột xuất

Danh sách việc tồn và các cuộc hẹn gọi lại của người đó phải chuyển được sang người khác mà không cần mở máy tính của họ. Đây là phép thử đơn giản nhất cho câu hỏi "ngữ cảnh đang nằm trong hệ thống hay trong đầu một người".

## Checklist triển khai cho nhóm đầu tiên

- [ ] Đã kiểm tra tai nghe và quyền truy cập micro của trình duyệt trên từng máy
- [ ] Đã đo chất lượng đường truyền tại đúng vị trí ngồi làm việc
- [ ] Đã thống nhất danh sách kết quả cuộc gọi, tối đa bảy lựa chọn
- [ ] Đã quy định ba trường bắt buộc ghi nhận sau cuộc gọi
- [ ] Đã cấu hình quy tắc định tuyến cho cuộc gọi đến, gồm cả trường hợp không ai sẵn sàng
- [ ] Đã hướng dẫn thao tác chuyển tiếp kèm ngữ cảnh, không chỉ chuyển số
- [ ] Đã thống nhất cách bàn giao việc tồn cuối ca
- [ ] Đã chỉ định người kiểm tra chất lượng ghi nhận trong hai tuần đầu

## Sai lầm thường gặp

- **Đào tạo tính năng thay vì đào tạo luồng công việc.** Nhân viên nhớ được nút nào làm gì nhưng không biết khi nào dùng. Nên dạy theo tình huống: khách hỏi việc ngoài phạm vi thì làm gì, khách hẹn gọi lại thì làm gì.
- **Để ô kết quả cuộc gọi là văn bản tự do.** Kết quả là dữ liệu không tổng hợp được, và mọi báo cáo sau đó đều phải làm thủ công.
- **Không ai kiểm tra chất lượng ghi nhận trong tuần đầu.** Thói quen hình thành rất nhanh, và thói quen sai cũng vậy.
- **Bỏ qua bước kiểm tra thiết bị âm thanh.** Phần lớn phàn nàn về chất lượng thoại trong tuần đầu có nguyên nhân ở đây.
- **Không cấu hình trường hợp không ai bắt máy.** Nếu không có hộp thư hoặc quy tắc dự phòng, cuộc gọi vẫn rơi ra ngoài đúng như trước khi có hệ thống.

## Kết luận

Một tổng đài trên trình duyệt không tạo ra giá trị vì nó chạy trong trình duyệt. Nó tạo ra giá trị vì mọi thao tác trong ngày làm việc đều để lại dữ liệu ở cùng một chỗ với hồ sơ khách hàng — nên ngữ cảnh không còn phụ thuộc vào trí nhớ của một người.

Điều đó chỉ xảy ra nếu ba quyết định được chốt trước khi triển khai: danh sách kết quả cuộc gọi, ba trường bắt buộc, và người chịu trách nhiệm kiểm tra chất lượng ghi nhận. Công cụ hỗ trợ phần còn lại.

Để xem cách webphone tổ chức thao tác hằng ngày, hãy xem [Gcalls Plus Webphone](/gcalls-plus-webphone/). Nếu đội ngũ còn đang cân nhắc có cần một hệ thống chung hay chưa, bắt đầu từ [dịch vụ call center là gì và ai thực sự cần](/5-linh-vuc-rat-can-dich-vu-call-center-trung-tam-cuoc-goi/). Để trao đổi về phạm vi triển khai cho đội ngũ cụ thể, [mô tả hiện trạng cho Gcalls](/lien-he/).
`,

  faq: [
    {
      q: 'Webphone có cần cài đặt gì không?',
      a: 'Về nguyên tắc, webphone chạy trong trình duyệt nên không cần phần mềm riêng. Điều cần chuẩn bị là quyền truy cập micro cho trang web, một bộ tai nghe phù hợp và đường truyền ổn định tại vị trí ngồi. Ba thứ này quyết định trải nghiệm nhiều hơn cấu hình máy tính.',
    },
    {
      q: 'Nhân viên làm việc tại nhà có dùng được không?',
      a: 'Được, vì webphone không gắn với một máy bàn đặt tại văn phòng. Điều cần lưu ý là chất lượng đường truyền tại nhà thay đổi nhiều hơn tại văn phòng, nên nên kiểm tra thực tế tại từng vị trí thay vì suy ra từ gói mạng đang dùng.',
    },
    {
      q: 'Nếu mất mạng giữa cuộc gọi thì sao?',
      a: 'Cuộc gọi đang diễn ra sẽ bị gián đoạn như mọi hình thức thoại qua mạng khác. Điều quan trọng là hệ thống có ghi nhận lại cuộc gọi đó để liên hệ lại hay không, và có quy tắc dự phòng cho cuộc gọi đến khi không ai sẵn sàng hay không. Cả hai đều là hạng mục cấu hình cần thống nhất trước.',
    },
    {
      q: 'Có bắt buộc dùng tai nghe không?',
      a: 'Không bắt buộc về mặt kỹ thuật, nhưng loa và micro tích hợp của máy tính thường gây vọng tiếng và tạp âm trong môi trường văn phòng nhiều người. Trong thực tế, đây là khoản đầu tư nhỏ ảnh hưởng tới trải nghiệm khách hàng nhiều hơn hầu hết các thiết lập khác.',
    },
    {
      q: 'Bao lâu thì đội ngũ quen với cách làm việc mới?',
      a: 'Thời gian phụ thuộc vào độ phức tạp của luồng và mức độ thay đổi so với cách cũ, nên không có con số chung. Yếu tố rút ngắn thời gian rõ nhất là đào tạo theo tình huống thay vì theo tính năng, và có người kiểm tra chất lượng ghi nhận trong hai tuần đầu.',
    },
    {
      q: 'Dữ liệu cuộc gọi có tự động vào CRM không?',
      a: 'Chỉ khi hai hệ thống được kết nối và phạm vi đồng bộ đã được xác định. Những trường nào đi qua, theo chiều nào, phụ thuộc vào API mà nền tảng CRM công bố, nên đây là hạng mục cần khảo sát riêng trước khi triển khai.',
      link: {
        label: 'Đọc: phạm vi và giới hạn khi đồng bộ với CRM',
        path: '/dong-bo-hoa-du-lieu-la-gi-tai-sao-nen-dong-bo-du-lieu/',
      },
    },
  ],

  images: [
    {
      id: 'featured',
      role: 'featured',
      status: 'PRODUCT_SCREENSHOT_REQUIRED',
      kind: 'Ảnh chụp màn hình sản phẩm',
      shows:
        'Giao diện Gcalls Plus Webphone trong trạng thái đang có cuộc gọi: vùng cuộc gọi, vùng ngữ cảnh khách hàng và ô ghi chú cùng hiển thị trên một màn hình.',
      placement: 'Ảnh đại diện, hiển thị đầu bài',
      source:
        'Ảnh chụp thật từ môi trường demo nội bộ. KHÔNG dựng giao diện giả, KHÔNG dùng UI của sản phẩm khác.',
      masking:
        'Che tên khách hàng, số điện thoại, nội dung ghi chú thật, tên nhân viên và tên tenant. Gắn nhãn "ảnh minh hoạ" trên ảnh.',
      alt: 'Ảnh chụp giao diện webphone Gcalls Plus với vùng cuộc gọi, ngữ cảnh khách hàng và ô ghi chú, dữ liệu đã được che',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho các bài trong HUB-02 khi cần minh hoạ màn hình chính',
    },
    {
      id: 'inline-1',
      role: 'in-article',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ trình tự một ngày làm việc',
      shows:
        'Trục thời gian một ngày: nhận ca, kiểm tra thiết bị, xử lý việc tồn, cuộc gọi đến, cuộc gọi ra, ghi nhận, bàn giao. Mỗi mốc gắn với dữ liệu được tạo ra.',
      placement: 'Sau mục "Ba thứ luôn xuất hiện trên màn hình"',
      source: 'Thiết kế mới theo bộ nhận diện Gcalls',
      masking: 'Không có dữ liệu thật.',
      alt: 'Sơ đồ trình tự một ngày làm việc trên webphone, từ nhận ca tới bàn giao cuối ngày',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho nội dung đào tạo vận hành',
    },
    {
      id: 'inline-2',
      role: 'in-article',
      status: 'PRODUCT_SCREENSHOT_REQUIRED',
      kind: 'Ảnh chụp màn hình sản phẩm',
      shows:
        'Ô ghi nhận sau cuộc gọi với danh sách kết quả dạng lựa chọn và trường việc cần làm tiếp theo.',
      placement: 'Sau bảng "Ba trường tối thiểu sau mỗi cuộc gọi"',
      source: 'Ảnh chụp thật từ môi trường demo nội bộ',
      masking:
        'Che toàn bộ dữ liệu khách hàng và nội dung ghi chú thật; giữ lại cấu trúc trường.',
      alt: 'Ảnh chụp ô ghi nhận sau cuộc gọi với danh sách kết quả dạng lựa chọn, dữ liệu đã được che',
      dimensions: '1600×900',
      reusable: 'KHÔNG — riêng cho bài này',
    },
  ],

  plannedLinks: [
    {
      label: 'Thiết lập luồng tiếp nhận cuộc gọi đến cho đội nhiều nhóm',
      target: 'HUB-12 · Batch 11',
      reason:
        'Mục "Khi có cuộc gọi đến" cần một hướng dẫn cấu hình định tuyến chi tiết; bài chưa tồn tại nên không render liên kết.',
    },
  ],
}
