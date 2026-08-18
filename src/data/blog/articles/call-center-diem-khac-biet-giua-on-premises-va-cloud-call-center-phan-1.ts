import type { BlogArticleBody } from '../types'

/**
 * GC-B01-02 · HUB-01 · PILLAR · written from scratch.
 *
 * Replaces the split legacy pair 2768 / 2811 with a single decision article.
 * The URL keeps its `-phan-1` suffix because §D of the rebuild locked URL
 * preservation and forbids a redirect sweep; the suffix is a historical
 * artefact of the legacy slug, not a statement about this article.
 */
export const article: BlogArticleBody = {
  slug: 'call-center-diem-khac-biet-giua-on-premises-va-cloud-call-center-phan-1',

  directAnswer: {
    question: 'Tổng đài đặt tại chỗ và tổng đài đám mây khác nhau ở đâu?',
    answer:
      'Khác biệt cốt lõi là ai sở hữu và vận hành hạ tầng. Tổng đài đặt tại chỗ dùng thiết bị đặt trong doanh nghiệp, do đội kỹ thuật nội bộ chịu trách nhiệm. Tổng đài đám mây chạy trên hạ tầng của nhà cung cấp và doanh nghiệp sử dụng qua mạng. Lựa chọn giữa hai mô hình quyết định chi phí, tốc độ thay đổi và mức phụ thuộc vào bên thứ ba.',
  },

  body: `
## Vì sao đây là quyết định khó đảo ngược

Chọn mô hình triển khai tổng đài không giống chọn một phần mềm văn phòng. Quyết định này kéo theo hợp đồng viễn thông, cách đội kỹ thuật làm việc, cách dữ liệu cuộc gọi được lưu và một khoản đầu tư khó thu hồi nếu đổi ý sau sáu tháng.

Đó là lý do bài này không đưa ra một kết luận chung. Không có mô hình nào "tốt hơn" — có mô hình phù hợp hơn với ràng buộc cụ thể của một doanh nghiệp. Phần dưới đi qua bảy tiêu chí, mỗi tiêu chí kèm câu hỏi để tự trả lời.

### Hai mô hình, mô tả ngắn gọn

**Tổng đài đặt tại chỗ (on-premises)** là hệ thống chạy trên thiết bị đặt trong hạ tầng của doanh nghiệp. Doanh nghiệp mua thiết bị, cấu hình, và chịu trách nhiệm về nguồn điện, đường truyền, sao lưu, bản vá và thay thế khi hỏng.

**Tổng đài đám mây (cloud)** là dịch vụ chạy trên hạ tầng của nhà cung cấp. Doanh nghiệp trả phí theo thoả thuận sử dụng, truy cập qua trình duyệt hoặc ứng dụng, và không quản lý phần cứng.

Giữa hai mô hình còn có phương án lai — giữ một phần thiết bị tại chỗ cho luồng nội bộ và đưa phần còn lại lên đám mây. Phương án lai giải quyết được ràng buộc đặc thù nhưng làm tăng số điểm cần bảo trì, nên chỉ hợp lý khi có lý do rõ ràng.

## Bảy tiêu chí đối chiếu

| Tiêu chí | Đặt tại chỗ | Đám mây |
|---|---|---|
| Quyền kiểm soát hạ tầng | Doanh nghiệp toàn quyền cấu hình và can thiệp | Cấu hình trong phạm vi nhà cung cấp mở ra |
| Cấu trúc chi phí | Đầu tư ban đầu lớn, chi phí vận hành phân tán | Chi phí định kỳ theo quy mô sử dụng |
| Thời gian thay đổi cấu hình | Phụ thuộc lịch của đội kỹ thuật nội bộ | Thường thao tác được trên giao diện quản trị |
| Mở rộng khi tăng nhân sự | Cần bổ sung năng lực thiết bị | Điều chỉnh theo số người dùng |
| Làm việc ngoài văn phòng | Cần thiết lập truy cập từ xa riêng | Truy cập qua mạng là mặc định |
| Tích hợp với hệ thống khác | Phụ thuộc khả năng của thiết bị và đội phát triển | Phụ thuộc API nhà cung cấp công bố |
| Rủi ro chính | Sự cố phần cứng và nhân sự kỹ thuật nghỉ việc | Phụ thuộc nhà cung cấp và điều kiện đường truyền |

Bảng trên là điểm khởi đầu, không phải kết luận. Ba tiêu chí dưới đây thường quyết định nhiều hơn cả và đáng được xem xét riêng.

### Chi phí: phần không nằm trên báo giá

So sánh chi phí hai mô hình bằng cách đặt giá thiết bị cạnh giá thuê bao là cách so sánh sai. Mô hình đặt tại chỗ có những khoản chi phí thật nhưng không xuất hiện trong bảng báo giá ban đầu:

- Thời gian của đội kỹ thuật nội bộ dành cho cấu hình, xử lý sự cố và bản vá.
- Chi phí dự phòng: nguồn điện, đường truyền thứ hai, thiết bị thay thế.
- Chi phí gián đoạn khi hệ thống hỏng ngoài giờ và người biết cách xử lý không có mặt.
- Chi phí đào tạo lại khi người phụ trách hệ thống nghỉ việc.

Mô hình đám mây cũng có khoản ẩn tương ứng: chi phí tăng theo số người dùng khi đội mở rộng, và chi phí chuyển đổi nếu sau này muốn rời nhà cung cấp. Cách so sánh trung thực là dựng chi phí theo một khung thời gian đủ dài cho cả hai phương án, gồm cả nhân sự vận hành. [Công cụ ước tính chi phí](/uoc-tinh-chi-phi/) giúp mô tả cấu hình đội ngũ trước khi trao đổi con số cụ thể.

### Tốc độ thay đổi: tiêu chí bị đánh giá thấp

Trong vận hành thật, cấu hình tổng đài không đứng yên. Thêm một nhóm, đổi kịch bản chào, chuyển hướng cuộc gọi trong đợt cao điểm, mở thêm một hotline cho chiến dịch — đây là những yêu cầu xuất hiện hằng tháng.

Câu hỏi cần trả lời không phải "hệ thống có làm được không" mà **"từ lúc có yêu cầu tới lúc cấu hình xong mất bao lâu, và ai làm"**. Nếu mọi thay đổi đều phải qua một người duy nhất trong đội kỹ thuật, đó là nút thắt thật, bất kể mô hình nào.

### Tích hợp: nơi hai mô hình thật sự chia đường

Phần lớn giá trị của một hệ thống nghe gọi hiện đại nằm ở chỗ nó kết nối được với nơi lưu hồ sơ khách hàng. Ở mô hình đặt tại chỗ, khả năng tích hợp phụ thuộc vào thiết bị và vào việc doanh nghiệp có đội phát triển hay không. Ở mô hình đám mây, nó phụ thuộc vào những gì nhà cung cấp công bố qua API.

Cả hai đều có giới hạn, chỉ khác nguồn gốc của giới hạn. Trước khi chốt, nên đọc [checklist đánh giá mức độ sẵn sàng tích hợp với CRM](/checklist-danh-gia-san-sang-tich-hop-tong-dai-voi-crm/) và đối chiếu với hệ thống doanh nghiệp đang dùng.

### Mở rộng và thu hẹp: hai chiều không đối xứng

Phần lớn tài liệu so sánh chỉ nói về việc mở rộng khi đội ngũ tăng. Chiều ngược lại quan trọng không kém và ít được nhắc.

Ở mô hình đặt tại chỗ, năng lực đã đầu tư không thu hồi được. Một doanh nghiệp trang bị hệ thống cho quy mô dự kiến rồi thu hẹp đội ngũ vẫn giữ nguyên chi phí bảo trì và khấu hao. Ở mô hình đám mây, việc giảm quy mô thường phản ánh vào chi phí định kỳ, nhưng lại phụ thuộc vào điều khoản cam kết trong hợp đồng — một cam kết dài hạn có thể xoá bỏ hoàn toàn lợi thế đó.

Câu hỏi cần đặt ra là: nếu sáu tháng tới quy mô đội ngũ thay đổi hai mươi phần trăm theo bất kỳ chiều nào, chi phí sẽ đi theo hay đứng yên. Đây là câu hỏi về hợp đồng nhiều hơn là về công nghệ.

### Bảo trì, bản vá và nâng cấp

Hai mô hình chia trách nhiệm bảo trì rất khác nhau, và sự khác nhau đó thể hiện rõ nhất vào lúc có sự cố chứ không phải lúc vận hành bình thường.

Với hệ thống đặt tại chỗ, doanh nghiệp quyết định khi nào cập nhật. Đó vừa là ưu điểm — không bị thay đổi giao diện giữa mùa cao điểm — vừa là rủi ro, vì một hệ thống đang chạy ổn thường không được ai đề xuất cập nhật cho tới khi buộc phải làm.

Với dịch vụ đám mây, nhà cung cấp quyết định nhịp cập nhật. Doanh nghiệp nhận được cải tiến mà không phải làm gì, nhưng cũng phải chấp nhận rằng giao diện hoặc luồng thao tác có thể thay đổi vào thời điểm mình không chọn. Điều đáng hỏi trước khi ký là nhà cung cấp thông báo thay đổi trước bao lâu và bằng kênh nào.

## Nỗi đau thường gặp ở mỗi mô hình

Không mô hình nào miễn nhiễm với vấn đề. Biết trước dạng vấn đề mình sẽ gặp là cách chuẩn bị tốt hơn là hy vọng không gặp.

**Ở mô hình đặt tại chỗ**, vấn đề hay gặp nhất là kiến thức tập trung vào một người. Hệ thống chạy ổn định trong thời gian dài, không ai ghi lại cấu hình, rồi người phụ trách nghỉ việc và cấu hình trở thành hộp đen. Vấn đề thứ hai là chu kỳ nâng cấp: thiết bị vẫn chạy nên không ai đề xuất thay, cho tới lúc nó không hỗ trợ được yêu cầu mới.

**Ở mô hình đám mây**, vấn đề hay gặp nhất là chất lượng đường truyền tại văn phòng. Hệ thống hoạt động tốt trên giấy nhưng nhân viên phản ánh thoại chập chờn, và nguyên nhân nằm ở mạng nội bộ chứ không ở nhà cung cấp. Vấn đề thứ hai là mức phụ thuộc: khi toàn bộ lịch sử tương tác nằm trên hệ thống bên ngoài, điều khoản về xuất dữ liệu trở nên quan trọng ngang tính năng.

> **Điều nên hỏi nhà cung cấp trước khi ký.** Dữ liệu cuộc gọi và bản ghi được xuất ra ở định dạng nào, do ai yêu cầu, trong bao lâu. Đây là câu hỏi ít được đặt ra nhất và là câu hỏi có hậu quả lớn nhất nếu sau này cần chuyển đổi.

## Khung quyết định trong năm bước

1. **Liệt kê ràng buộc bắt buộc.** Yêu cầu về nơi lưu trữ dữ liệu, quy định ngành, hạ tầng sẵn có. Ràng buộc bắt buộc loại bỏ phương án trước khi so sánh, nên phải đứng đầu.
2. **Ước lượng nhịp thay đổi cấu hình.** Trong sáu tháng gần nhất, đội ngũ đã cần thay đổi luồng cuộc gọi bao nhiêu lần. Con số này dự báo tiêu chí "tốc độ thay đổi" quan trọng đến đâu.
3. **Kiểm kê năng lực kỹ thuật nội bộ.** Có bao nhiêu người thực sự cấu hình được hệ thống, và điều gì xảy ra khi người đó nghỉ.
4. **Dựng chi phí theo khung nhiều năm cho cả hai phương án**, gồm nhân sự vận hành và chi phí gián đoạn ước tính.
5. **Kiểm tra khả năng tích hợp với hệ thống đang dùng** trước khi chốt, không phải sau khi ký.

Bước 5 là bước hay bị đẩy xuống cuối và là nguyên nhân phổ biến nhất khiến dự án phải làm lại.

## Checklist đối chiếu trước khi chốt phương án

- [ ] Đã xác định ràng buộc bắt buộc về nơi lưu trữ và quy định áp dụng
- [ ] Đã đếm số lần thay đổi cấu hình trong sáu tháng gần nhất
- [ ] Đã biết ai trong nội bộ cấu hình được hệ thống và ai là phương án dự phòng
- [ ] Đã dựng chi phí nhiều năm cho cả hai phương án, gồm nhân sự vận hành
- [ ] Đã kiểm tra chất lượng đường truyền tại từng văn phòng, không chỉ tại trụ sở
- [ ] Đã xác nhận phạm vi tích hợp với hệ thống lưu hồ sơ khách hàng hiện tại
- [ ] Đã có điều khoản rõ ràng về xuất dữ liệu và bản ghi khi kết thúc hợp tác
- [ ] Đã chọn một nhóm thí điểm thay vì chuyển toàn bộ trong một lần

## Sai lầm thường gặp

- **So sánh giá thiết bị với giá thuê bao.** Hai con số này không cùng đơn vị và bỏ sót toàn bộ chi phí nhân sự vận hành.
- **Giả định đám mây luôn nhanh hơn để thay đổi.** Điều đó chỉ đúng nếu quyền cấu hình thực sự được giao cho người vận hành, không phải vẫn phải mở phiếu yêu cầu.
- **Bỏ qua mạng nội bộ.** Rất nhiều phàn nàn về chất lượng thoại có nguyên nhân trong văn phòng chứ không ở nhà cung cấp.
- **Chọn mô hình trước, mới hỏi về tích hợp.** Phạm vi tích hợp nên là tiêu chí loại trừ, không phải phần thưởng thêm.
- **Không viết lại cấu hình.** Ở cả hai mô hình, cấu hình không được ghi chép là rủi ro nhân sự, không phải rủi ro kỹ thuật.

## Kết luận

Câu hỏi "on-premises hay cloud" thật ra là ba câu hỏi khác nhau đội lốt một câu: ai chịu trách nhiệm khi hệ thống hỏng, đội ngũ cần thay đổi cấu hình nhanh tới mức nào, và dữ liệu cuộc gọi phải nói chuyện được với hệ thống nào.

Trả lời được ba câu đó thì phương án gần như tự hiện ra. Nếu doanh nghiệp còn đang ở bước trước — chưa chắc có cần một hệ thống chung hay không — hãy bắt đầu từ [dịch vụ call center là gì và ai thực sự cần](/5-linh-vuc-rat-can-dich-vu-call-center-trung-tam-cuoc-goi/). Nếu đã rõ nhu cầu nhưng chưa rõ thời điểm, [khi nào nên chuyển sang tổng đài ảo](/4-ly-do-su-dung-tong-dai-ao-call-center-la-can-thiet-voi-mot-doanh-nghiep/) đi sâu hơn vào phần đó.

Để trao đổi về mô hình Cloud Call Center phù hợp với quy mô hiện tại, [mô tả hiện trạng hệ thống cho Gcalls](/lien-he/).
`,

  faq: [
    {
      q: 'Tổng đài đám mây có an toàn bằng tổng đài đặt tại chỗ không?',
      a: 'Hai mô hình có dạng rủi ro khác nhau chứ không xếp hạng được bằng một câu. Đặt tại chỗ giữ dữ liệu trong hạ tầng doanh nghiệp nhưng phụ thuộc vào năng lực bảo mật nội bộ. Đám mây chuyển trách nhiệm hạ tầng cho nhà cung cấp nhưng đòi hỏi doanh nghiệp kiểm tra kỹ điều khoản về truy cập, lưu trữ và xuất dữ liệu.',
    },
    {
      q: 'Có thể chuyển từ đặt tại chỗ sang đám mây mà giữ nguyên đầu số không?',
      a: 'Khả năng giữ đầu số phụ thuộc vào loại số, nhà mạng đang cấp và quy định hiện hành, nên đây là câu hỏi cần xác nhận với nhà mạng và nhà cung cấp trước khi lập kế hoạch chuyển đổi. Không nên coi việc giữ số là mặc định trong mọi trường hợp.',
    },
    {
      q: 'Mô hình lai có phải lựa chọn an toàn không?',
      a: 'Mô hình lai giải quyết được ràng buộc đặc thù, chẳng hạn khi một phần luồng bắt buộc phải nằm trong hạ tầng nội bộ. Đổi lại, số điểm cần bảo trì và số nơi có thể hỏng đều tăng lên, nên nó chỉ hợp lý khi có lý do cụ thể chứ không phải như một cách tránh quyết định.',
    },
    {
      q: 'Đường truyền cần điều kiện gì để thoại ổn định?',
      a: 'Yếu tố quyết định không chỉ là băng thông mà còn là độ trễ, độ ổn định và cách mạng nội bộ ưu tiên lưu lượng thoại. Nên đo thử tại từng vị trí làm việc thực tế thay vì suy ra từ gói dịch vụ đang dùng, vì kết quả khác nhau đáng kể giữa các văn phòng.',
    },
    {
      q: 'Nên thí điểm với bao nhiêu người?',
      a: 'Đủ để gặp các tình huống thật nhưng đủ nhỏ để sửa nhanh — thường là một nhóm có luồng công việc trọn vẹn, chẳng hạn một nhóm tiếp nhận cuộc gọi đến. Thí điểm với những người dùng dễ tính nhất sẽ không phát hiện được vấn đề, nên nhóm thí điểm cần có cả tình huống khó.',
    },
    {
      q: 'Chi phí nào thường bị bỏ sót khi so sánh?',
      a: 'Ba khoản hay bị bỏ sót là thời gian của đội kỹ thuật nội bộ, chi phí gián đoạn khi hệ thống hỏng ngoài giờ làm việc, và chi phí chuyển đổi nếu sau này rời nhà cung cấp. Cả ba đều là chi phí thật nhưng không xuất hiện trên báo giá của bất kỳ bên nào.',
    },
  ],

  images: [
    {
      id: 'featured',
      role: 'featured',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ đối chiếu hai mô hình',
      shows:
        'Hai cột song song: bên trái là thiết bị đặt trong doanh nghiệp với các nhãn nguồn điện, đường truyền, sao lưu, đội kỹ thuật; bên phải là dịch vụ trên hạ tầng nhà cung cấp với nhãn truy cập qua mạng, cấu hình trên giao diện quản trị. Ranh giới trách nhiệm được vẽ rõ.',
      placement: 'Ảnh đại diện, hiển thị đầu bài',
      source: 'Thiết kế mới theo bộ nhận diện Gcalls',
      masking: 'Không có dữ liệu thật; không dùng logo bên thứ ba.',
      alt: 'Sơ đồ đối chiếu tổng đài đặt tại chỗ và tổng đài đám mây theo ranh giới trách nhiệm vận hành',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho nội dung so sánh mô hình trong HUB-01',
    },
    {
      id: 'inline-1',
      role: 'in-article',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ chi phí theo thời gian',
      shows:
        'Đường chi phí tích luỹ của hai mô hình theo thời gian, có đánh dấu các khoản không nằm trên báo giá. Trục không gắn con số cụ thể vì chưa có dữ liệu giá được duyệt.',
      placement: 'Sau mục "Chi phí: phần không nằm trên báo giá"',
      source: 'Thiết kế mới',
      masking: 'Không hiển thị bất kỳ con số giá nào chưa được duyệt.',
      alt: 'Sơ đồ khái niệm về chi phí tích luỹ của hai mô hình tổng đài theo thời gian, không kèm con số cụ thể',
      dimensions: '1600×900',
      reusable: 'KHÔNG — riêng cho bài này',
    },
  ],
}
