import type { BlogArticleBody } from '../types'

/**
 * GC-B01-11 · HUB-07 · PILLAR · net-new.
 *
 * Product-defining pillar for QA/QC Center. Carries the §J constraint: nothing
 * here claims that automated analysis replaces human verification, and no
 * coverage or time-saving figure appears anywhere.
 */
export const article: BlogArticleBody = {
  slug: 'xay-dung-bo-tieu-chi-danh-gia-chat-luong-cuoc-goi',

  directAnswer: {
    question: 'Bộ tiêu chí đánh giá chất lượng cuộc gọi được xây dựng thế nào?',
    answer:
      'Bắt đầu bằng việc chọn những hành vi quan sát được trong một bản ghi, nhóm chúng theo mục đích, gán trọng số phản ánh mức độ quan trọng, rồi viết mô tả cụ thể cho từng mức điểm. Bước cuối và bắt buộc là hiệu chuẩn: nhiều người cùng chấm một cuộc gọi cho tới khi kết quả của họ hội tụ.',
  },

  body: `
## Vì sao phần lớn bộ tiêu chí không dùng được

Rất nhiều đội đã từng xây dựng một biểu mẫu chấm điểm cuộc gọi, dùng vài tuần, rồi bỏ. Nguyên nhân gần như luôn nằm ở một trong ba chỗ.

**Tiêu chí không quan sát được.** Những mục như "thái độ chuyên nghiệp" hay "thể hiện sự đồng cảm" nghe hợp lý nhưng hai người chấm sẽ cho hai kết quả khác nhau cho cùng một cuộc gọi. Khi điểm số phụ thuộc vào người chấm, nhân viên không tin vào kết quả và bộ tiêu chí mất tác dụng.

**Biểu mẫu quá dài.** Ba mươi tiêu chí nghe đầy đủ nhưng khiến việc chấm một cuộc gọi mất quá nhiều thời gian, và số lượng cuộc gọi được đánh giá giảm xuống mức không còn ý nghĩa thống kê.

**Không có vòng phản hồi.** Điểm số được ghi vào một bảng và không ai làm gì với nó. Nhân viên nhanh chóng nhận ra điều đó.

Bài này đi qua bốn bước xây dựng một bộ tiêu chí tránh được cả ba vấn đề trên.

## Bước 1 — Chọn hành vi quan sát được

Một tiêu chí dùng được phải trả lời được bằng "có" hoặc "không" khi nghe lại bản ghi, mà không cần suy đoán về ý định của nhân viên.

| Cách viết không dùng được | Cách viết quan sát được |
|---|---|
| Chào hỏi chuyên nghiệp | Xưng tên và tên doanh nghiệp trong ba câu đầu |
| Lắng nghe khách hàng | Nhắc lại yêu cầu của khách bằng lời của mình trước khi trả lời |
| Thái độ tích cực | Không ngắt lời khách khi khách đang trình bày |
| Xử lý tốt phản đối | Đưa ra ít nhất một phương án thay thế khi không đáp ứng được yêu cầu |
| Kết thúc cuộc gọi tốt | Xác nhận lại việc sẽ làm tiếp theo và thời điểm trước khi kết thúc |

Cột bên phải khó viết hơn nhưng là thứ duy nhất tạo ra điểm số mà nhân viên tranh luận được — và khả năng tranh luận là dấu hiệu của một tiêu chí công bằng.

### Nguồn để lấy tiêu chí

Không nên bắt đầu từ một biểu mẫu mẫu tải trên mạng. Ba nguồn thực tế hơn:

- **Nghe lại các cuộc gọi đã có phàn nàn.** Điều gì đã xảy ra trong những cuộc đó mà lẽ ra không nên xảy ra.
- **Nghe lại các cuộc gọi có kết quả tốt.** Người làm tốt đã làm gì mà người khác không làm.
- **Hỏi chính đội ngũ.** Nhân viên biết rõ điều gì khiến một cuộc gọi khó, và tiêu chí xuất phát từ đó được chấp nhận dễ hơn.

## Bước 2 — Nhóm tiêu chí theo mục đích

Một bộ tiêu chí dùng được thường có ba tới bốn nhóm, mỗi nhóm ba tới năm tiêu chí. Tổng cộng nằm trong khoảng mười tới mười lăm.

- **Nhóm tuân thủ.** Những điều bắt buộc phải làm hoặc bắt buộc không được làm: xác minh danh tính, thông báo ghi âm, không cam kết ngoài thẩm quyền.
- **Nhóm quy trình.** Các bước xử lý theo đúng luồng đã thống nhất.
- **Nhóm giao tiếp.** Cách trao đổi với khách hàng, viết dưới dạng hành vi quan sát được.
- **Nhóm kết quả.** Yêu cầu của khách có được giải quyết hoặc chuyển tiếp đúng chỗ hay không.

Nhóm tuân thủ nên được xử lý khác các nhóm còn lại: một vi phạm tuân thủ thường khiến cả cuộc gọi không đạt, bất kể điểm các nhóm khác. Trộn nó vào điểm trung bình sẽ che mất vấn đề nghiêm trọng.

## Bước 3 — Gán trọng số

Trọng số phản ánh mức độ quan trọng, và cách đặt trọng số nói lên ưu tiên thật của tổ chức. Ba nguyên tắc thực tế:

1. **Trọng số phải chênh lệch rõ.** Nếu mọi tiêu chí đều ngang nhau, điểm tổng không phân biệt được cuộc gọi tốt và cuộc gọi trung bình.
2. **Nhóm tuân thủ tách riêng.** Không cộng vào điểm chung mà đánh dấu đạt hoặc không đạt.
3. **Trọng số được xem lại định kỳ.** Ưu tiên của doanh nghiệp thay đổi, và bộ tiêu chí phải theo kịp.

> **Một dấu hiệu cảnh báo.** Nếu sau khi chấm một tháng mà gần như mọi cuộc gọi đều đạt điểm cao, bộ tiêu chí đang đo những thứ ai cũng làm được. Nó không sai, nhưng nó không giúp cải thiện điều gì.

## Bước 4 — Hiệu chuẩn giữa những người chấm

Đây là bước quyết định và cũng là bước hay bị bỏ nhất.

Cách làm: chọn năm cuộc gọi, để tất cả những người sẽ chấm điểm cùng chấm độc lập, rồi so kết quả. Ở đâu có chênh lệch lớn, tiêu chí đó chưa đủ rõ và cần viết lại — chứ không phải người chấm sai.

Lặp lại cho tới khi kết quả của những người chấm hội tụ ở mức chấp nhận được. Sau đó nên lặp lại định kỳ, vì cách hiểu trôi dần theo thời gian.

Hiệu chuẩn cũng là cách tốt nhất để phát hiện tiêu chí thừa: nếu một tiêu chí luôn được chấm giống hệt nhau ở mọi cuộc gọi, nó không phân biệt được gì và có thể bỏ.

## Viết mô tả cho từng mức điểm

Một tiêu chí quan sát được vẫn có thể gây tranh cãi nếu thang điểm không có mô tả. "Cho điểm từ 1 đến 5 về khả năng xác nhận yêu cầu" đẩy toàn bộ phán đoán về phía người chấm.

Có hai cách xử lý, và cách thứ nhất thường tốt hơn với đội mới bắt đầu.

### Thang nhị phân

Mỗi tiêu chí chỉ có đạt hoặc không đạt. Ưu điểm là gần như không có chênh lệch giữa những người chấm, và việc trao đổi với nhân viên rất rõ ràng. Nhược điểm là không phân biệt được mức độ: một người xác nhận yêu cầu sơ sài và một người xác nhận đầy đủ đều được tính là đạt.

Với phần lớn đội ngũ mới xây dựng chương trình chất lượng, thang nhị phân là điểm xuất phát đúng. Nó cho kết quả ổn định ngay và giảm thời gian hiệu chuẩn đáng kể.

### Thang nhiều mức có mô tả

Nếu cần phân biệt mức độ, mỗi mức phải có mô tả cụ thể chứ không chỉ có nhãn. Ví dụ cho tiêu chí xác nhận việc sẽ làm tiếp theo:

| Mức | Mô tả |
|---|---|
| Không đạt | Kết thúc cuộc gọi mà không nhắc tới việc tiếp theo |
| Đạt cơ bản | Nói rằng sẽ xử lý nhưng không nêu việc cụ thể hoặc thời điểm |
| Đạt đầy đủ | Nêu rõ việc sẽ làm và thời điểm, và khách xác nhận lại |

Ba mức có mô tả dùng được lâu dài hơn năm mức không có mô tả. Số lượng mức không phải thước đo chất lượng của biểu mẫu.

### Xử lý trường hợp không áp dụng

Mọi biểu mẫu đều cần một lựa chọn "không áp dụng" cho những tiêu chí không liên quan tới cuộc gọi cụ thể đó — chẳng hạn tiêu chí về xử lý phản đối trong một cuộc gọi khách chỉ hỏi thông tin. Thiếu lựa chọn này, người chấm sẽ buộc phải cho một điểm nào đó, và điểm tổng mất ý nghĩa so sánh.

## Vòng phản hồi: phần khiến bộ tiêu chí có ý nghĩa

Bộ tiêu chí chỉ tạo ra thay đổi khi kết quả quay về với nhân viên dưới dạng có thể hành động được. Phần chi tiết về cách thiết kế biểu mẫu và tổ chức buổi phản hồi nằm ở bài [dùng biểu mẫu đánh giá cuộc gọi để cải thiện trải nghiệm khách hàng](/cai-thien-trai-nghiem-khach-hang-bang-bieu-mau-cham-diem-danh-gia-cuoc-goi/).

Điểm cần nhớ ở đây: điểm số là công cụ chẩn đoán, không phải công cụ xếp hạng. Dùng nó để xếp hạng nhân sự sẽ khiến người chấm chịu áp lực làm đẹp số liệu, và dữ liệu mất giá trị ngay sau đó.

## Vai trò của phân tích tự động

Khi khối lượng cuộc gọi vượt khả năng nghe thủ công, công cụ phân tích tự động giúp mở rộng phạm vi kiểm tra: phát hiện cuộc gọi có dấu hiệu bất thường, đánh dấu những cuộc cần người nghe lại, và xử lý các tiêu chí có tính chất máy móc như việc câu thông báo bắt buộc có được đọc hay không.

Điều cần nói rõ: **kết quả phân tích tự động vẫn cần người kiểm chứng**. Công cụ giúp chọn ra cuộc gọi đáng xem xét; quyết định cuối cùng về chất lượng và về hành động tiếp theo vẫn thuộc về người phụ trách. Ranh giới cụ thể giữa hai cách làm nằm ở bài [chấm điểm thủ công và hỗ trợ bằng AI khác nhau ở đâu](/cham-diem-cuoc-goi-thu-cong-va-ho-tro-bang-ai/).

Một cách kiểm tra nhanh trước khi công bố bộ tiêu chí: đưa nó cho một người chưa từng tham gia xây dựng và nhờ họ chấm một cuộc gọi. Chỗ nào họ phải hỏi lại là chỗ mô tả chưa đủ rõ, và đó là những chỗ sẽ gây tranh cãi khi áp dụng thật.

## Checklist xây dựng bộ tiêu chí

- [ ] Mỗi tiêu chí trả lời được bằng có hoặc không khi nghe lại bản ghi
- [ ] Tổng số tiêu chí nằm trong khoảng mười tới mười lăm
- [ ] Tiêu chí được chia thành ba tới bốn nhóm theo mục đích
- [ ] Nhóm tuân thủ được tách riêng, không cộng vào điểm trung bình
- [ ] Trọng số chênh lệch rõ giữa các tiêu chí
- [ ] Mỗi mức điểm có mô tả cụ thể, không chỉ có con số
- [ ] Đã hiệu chuẩn với ít nhất năm cuộc gọi và nhiều người chấm
- [ ] Đã loại các tiêu chí không phân biệt được gì sau hiệu chuẩn
- [ ] Đã thống nhất cách chọn mẫu cuộc gọi để chấm
- [ ] Đã có kế hoạch trả kết quả về cho nhân viên dưới dạng hành động được
- [ ] Đã đặt lịch xem lại bộ tiêu chí định kỳ

## Sai lầm thường gặp

- **Viết tiêu chí bằng tính từ.** "Chuyên nghiệp", "nhiệt tình", "chu đáo" đều không quan sát được và tạo ra điểm số phụ thuộc người chấm.
- **Biểu mẫu quá dài.** Số cuộc gọi được đánh giá giảm tới mức mẫu không còn đại diện cho hoạt động thật.
- **Trộn tiêu chí tuân thủ vào điểm trung bình.** Một vi phạm nghiêm trọng bị pha loãng bởi điểm cao ở các mục khác.
- **Bỏ qua hiệu chuẩn.** Nhân viên nhận ra điểm phụ thuộc vào ai chấm và ngừng tin vào kết quả.
- **Dùng điểm để xếp hạng nhân sự.** Người chấm chịu áp lực làm đẹp số liệu và dữ liệu mất giá trị chẩn đoán.
- **Không xem lại bộ tiêu chí.** Sau vài tháng, tiêu chí đo những thứ không còn là ưu tiên của tổ chức.
- **Coi công cụ tự động là kết luận cuối.** Kết quả phân tích cần người kiểm chứng trước khi trở thành đánh giá chính thức.

## Kết luận

Một bộ tiêu chí dùng được không phải là bộ tiêu chí đầy đủ nhất mà là bộ tiêu chí mà hai người chấm độc lập cho ra kết quả gần nhau. Điều đó chỉ đạt được qua hành vi quan sát được, số lượng tiêu chí có giới hạn, và hiệu chuẩn lặp lại.

Sau khi có bộ tiêu chí, hai việc tiếp theo là thiết kế vòng phản hồi và quyết định phần nào sẽ được công cụ hỗ trợ. Cả hai đều được trình bày ở các bài liên quan trong cùng chủ đề.

Xem cách Gcalls tổ chức hoạt động đánh giá chất lượng hội thoại tại [QA QC Center](/qc-bot-ai/), hoặc [trao đổi về cách áp dụng cho đội ngũ cụ thể](/lien-he/).
`,

  faq: [
    {
      q: 'Nên có bao nhiêu tiêu chí trong một biểu mẫu?',
      a: 'Khoảng mười tới mười lăm là mức nhiều đội duy trì được lâu dài. Ít hơn thì không phân biệt được các mức chất lượng; nhiều hơn thì thời gian chấm mỗi cuộc gọi tăng lên và số lượng cuộc được đánh giá giảm tới mức mẫu không còn đại diện.',
    },
    {
      q: 'Chọn cuộc gọi nào để chấm điểm?',
      a: 'Kết hợp hai cách: chọn ngẫu nhiên để mẫu phản ánh hoạt động thật, và chọn có chủ đích những cuộc có dấu hiệu cần xem xét. Chỉ chọn ngẫu nhiên sẽ bỏ sót các trường hợp nghiêm trọng; chỉ chọn có chủ đích sẽ tạo ra bức tranh lệch về chất lượng chung.',
    },
    {
      q: 'Ai nên là người chấm điểm?',
      a: 'Người hiểu nghiệp vụ đủ sâu để phân biệt cách xử lý đúng và sai, và không trực tiếp chịu trách nhiệm về chỉ tiêu của người được chấm. Khi người quản lý trực tiếp vừa chấm điểm vừa chịu trách nhiệm về kết quả của nhóm, xung đột lợi ích là khó tránh.',
    },
    {
      q: 'Có nên cho nhân viên xem trước bộ tiêu chí không?',
      a: 'Nên, và đây là điều kiện để bộ tiêu chí có tác dụng cải thiện. Một tiêu chí giữ kín chỉ dùng để bắt lỗi; một tiêu chí công khai trở thành hướng dẫn hành vi. Việc mời chính đội ngũ tham gia xây dựng cũng làm tăng đáng kể mức độ chấp nhận.',
    },
    {
      q: 'AI có thay được người chấm điểm không?',
      a: 'Không. Công cụ phân tích tự động giúp mở rộng phạm vi kiểm tra và chỉ ra những cuộc gọi đáng xem xét, nhưng kết quả vẫn cần người kiểm chứng trước khi trở thành đánh giá chính thức. Quyết định về chất lượng và hành động tiếp theo thuộc về người phụ trách.',
      link: {
        label: 'Đọc: ranh giới giữa chấm thủ công và hỗ trợ bằng AI',
        path: '/cham-diem-cuoc-goi-thu-cong-va-ho-tro-bang-ai/',
      },
    },
    {
      q: 'Bao lâu nên xem lại bộ tiêu chí một lần?',
      a: 'Không có chu kỳ chung, nhưng nên xem lại khi có thay đổi về sản phẩm, quy trình hoặc ưu tiên của tổ chức, và khi kết quả chấm điểm trở nên đồng đều tới mức không phân biệt được gì. Dấu hiệu thứ hai cho thấy bộ tiêu chí đang đo những việc ai cũng làm được.',
    },
  ],

  images: [
    {
      id: 'featured',
      role: 'featured',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ cấu trúc bộ tiêu chí',
      shows:
        'Cấu trúc phân cấp: nhóm tiêu chí, tiêu chí, mức điểm có mô tả, và trọng số. Nhóm tuân thủ được tách ra khỏi phần tính điểm trung bình.',
      placement: 'Ảnh đại diện, hiển thị đầu bài',
      source: 'Thiết kế mới theo bộ nhận diện Gcalls',
      masking: 'Không có dữ liệu thật; nhãn là nhãn khái niệm.',
      alt: 'Sơ đồ cấu trúc bộ tiêu chí đánh giá cuộc gọi gồm nhóm tiêu chí, trọng số và mức điểm có mô tả',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho nội dung QA/QC ở các batch sau',
    },
    {
      id: 'inline-1',
      role: 'in-article',
      status: 'CUSTOM_DIAGRAM_REQUIRED',
      kind: 'Sơ đồ vòng hiệu chuẩn',
      shows:
        'Vòng lặp hiệu chuẩn: nhiều người chấm độc lập, so sánh kết quả, viết lại tiêu chí có chênh lệch lớn, lặp lại.',
      placement: 'Trong mục "Bước 4 — Hiệu chuẩn giữa những người chấm"',
      source: 'Thiết kế mới',
      masking: 'Không có dữ liệu thật.',
      alt: 'Sơ đồ vòng lặp hiệu chuẩn giữa nhiều người chấm điểm cuộc gọi',
      dimensions: '1600×900',
      reusable: 'CÓ — dùng lại cho tài liệu đào tạo QA',
    },
  ],
}
