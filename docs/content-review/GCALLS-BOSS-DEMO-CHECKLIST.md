# Gcalls — Checklist duyệt demo

**Demo URL:** https://ashernguyenxuanthuy.com/

Trang này dành cho buổi trình duyệt. Nó nói rõ nên xem gì, theo thứ tự nào, và
**những gì chưa phải hàng thật** — phần cuối quan trọng ngang phần đầu.

---

## 1. Thứ tự bảy trang nên duyệt

| # | Trang | Mục tiêu của trang | Nên thử |
| --- | --- | --- | --- |
| 1 | [`/`](https://ashernguyenxuanthuy.com/) | Toàn cảnh: vấn đề → sản phẩm → bằng chứng → lời mời | Bấm tab trong bảng lịch sử cuộc gọi; đổi Ngày/Tuần/Tháng ở biểu đồ; bấm nút phát bản ghi |
| 2 | [`/gcalls-plus-webphone/`](https://ashernguyenxuanthuy.com/gcalls-plus-webphone/) | Sản phẩm có ảnh thật — nơi có bằng chứng thật nhất | Xem 13 ảnh sản phẩm đã che dữ liệu |
| 3 | [`/gcalls-cx/`](https://ashernguyenxuanthuy.com/gcalls-cx/) | Contact Center đa kênh | Xem inbox hợp nhất (giao diện minh họa) |
| 4 | [`/voicebot-ai/`](https://ashernguyenxuanthuy.com/voicebot-ai/) | Tự động hóa cuộc gọi lặp lại | Xem trình dựng kịch bản (giao diện minh họa) |
| 5 | [`/qc-bot-ai/`](https://ashernguyenxuanthuy.com/qc-bot-ai/) | Kiểm soát chất lượng có AI hỗ trợ | Xem transcript + tiêu chí chấm điểm (giao diện minh họa) |
| 6 | [`/uoc-tinh-chi-phi/`](https://ashernguyenxuanthuy.com/uoc-tinh-chi-phi/) | Thu thập yêu cầu, không phải báo giá | Chạy hết 4 bước — xem kịch bản mẫu bên dưới |
| 7 | [`/blog/`](https://ashernguyenxuanthuy.com/blog/) | Chiều sâu nội dung: 18 bài theo 7 nhóm chủ đề | Mở một bài, xem FAQ và bài liên quan |

## 2. CTA cần thử

Mọi nút "Đăng ký tư vấn" đều dẫn về `/lien-he/` **kèm tham số nguồn**, ví dụ
`?intent=demo&source=consultation&product=Gcalls%20Plus%20Webphone`. Đó là cách
lead ghi lại được nó đến từ trang nào.

- Nút trên header (mọi trang)
- Nút trong hero trang chủ
- Nút cuối mỗi trang sản phẩm
- Nút cuối mỗi bài blog (mang theo nhóm chủ đề trong `source`)

## 3. Kịch bản mẫu cho Ước tính chi phí

1. Chọn **Gcalls Plus Webphone**
2. Bước Quy mô: để **5 agent**, nhập **3000** phút gọi/tháng, **1** hotline
3. Bước Yêu cầu thêm: tick **Có cần tích hợp CRM**
4. Xem kết quả

Kết quả đúng phải là: giải pháp chính **Gcalls Plus Webphone**, gợi ý thêm
**Tích hợp CRM**, bảng tóm tắt đúng những gì vừa nhập, và ô chi phí ghi
**"Chi phí theo cấu hình"** — không phải một con số.

## 4. Bài blog mẫu

[Tổng đài trên trình duyệt hoạt động thế nào trong một ngày](https://ashernguyenxuanthuy.com/tong-dai-tren-trinh-duyet-hoat-dong-the-nao/)

Bài này có đủ: breadcrumb, thân bài, 6 câu FAQ, CTA và 3 bài liên quan cùng nhóm.

---

## 5. Giới hạn — cần nói rõ khi trình bày

Đây là phần dễ bị bỏ qua nhất và cũng là phần dễ gây hiểu lầm nhất nếu bỏ qua.

| Hạng mục | Trạng thái thật |
| --- | --- |
| **Ảnh sản phẩm** | Chỉ **Gcalls Plus** có ảnh chụp thật (13 ảnh, đã che dữ liệu khách hàng). |
| **CX / Voicebot / QC** | Dùng **giao diện minh họa và sơ đồ thương hiệu**, dữ liệu hoàn toàn giả lập. Mỗi hình đều có chú thích "Giao diện minh họa – dữ liệu demo". |
| **Số liệu trên biểu đồ** | Là hình dạng minh họa, **không phải kết quả đo được** của bất kỳ doanh nghiệp nào. |
| **Form liên hệ** | **Chưa nối hệ thống tiếp nhận.** Form hiển thị thông báo và đưa email + hotline. Lead gửi qua form sẽ không tới đâu cả. |
| **Blog** | 18 bài đã biên tập được publish. **230 bài draft + 2 bài private** đã import nhưng không công khai — chúng chờ biên tập. |
| **Lập chỉ mục** | Site đang `noindex` toàn bộ ở 4 lớp. Không có nội dung nào lên Google. Bật index là một bước riêng khi go-live. |
| **34 route còn lại** | Có header/footer/CTA và nội dung nền, nhưng **chưa dựng section đầy đủ** như 7 trang P0. |

## 6. Tuyệt đối không nói

- ❌ "Website đã production-ready" — chưa; đây là demo trên host review, đang noindex.
- ❌ "Form đã nhận lead" — chưa nối endpoint.
- ❌ "Đây là ảnh chụp sản phẩm Gcalls CX / Voicebot / QC" — là giao diện minh họa.
- ❌ Đọc bất kỳ con số nào trên biểu đồ như thành tích của Gcalls hoặc của khách hàng.
- ❌ "Đã có 250 bài blog" — có 250 bài trong hệ thống, **18 bài đã biên tập và publish**.
