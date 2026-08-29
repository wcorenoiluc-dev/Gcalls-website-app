# Checkpoint 008 — báo cáo nghiệm thu

Đo trên live `https://ashernguyenxuanthuy.com`, đối chiếu React trong repository
(`npm run dev`). Mọi con số dưới đây do script sinh:

| Số liệu | Lệnh |
| --- | --- |
| Parity | `node scripts/parity-score.mjs` |
| 7 route × 5 breakpoint | `node scripts/route-qa.mjs` |
| Ảnh so sánh | `node scripts/parity-shots.mjs` |
| Gallery (click/bàn phím/mobile) | `node scripts/gallery-qa.mjs` |
| Hardening 003A | `npm run wp:live-verify` |

---

## 1. Parity theo route (1440px)

| Route | 007 | Sau gói 008 | Sau 008 hoàn thiện |
| --- | --- | --- | --- |
| `/gcalls-cx/` | 74.7% | 69.4% | **96.2%** |
| `/` | 95.0% | 95.0% | **95.0%** |
| `/gcalls-plus-webphone/` | 86.1% | 70.9% | **94.4%** |
| `/qc-bot-ai/` | 78.3% | 67.8% | **92.9%** |
| `/voicebot-ai/` | 87.4% | 62.1% | **91.7%** |
| `/uoc-tinh-chi-phi/` | 84.4% | 84.4% | **85.8%** |
| `/blog/` | 64.4% | 64.4% | **75.0%** |
| **Trung bình** | **81.5%** | **73.4%** | **90.1%** |

Gói 008 nguyên trạng **làm giảm** trung bình từ 81.5% xuống 73.4%: nó sửa
nhịp dọc rất tốt (cx 67.5% → 98.9%) nhưng hạ toàn bộ card title xuống `<p>`,
làm heading rơi từ 72–87% xuống 36–49%.

## 2. QA 7 route × 5 breakpoint — 35/35 ĐẠT

| Kiểm tra | Kết quả |
| --- | --- |
| Tràn ngang | **0**/35 |
| Ảnh vỡ | **0**/35 |
| PHP warning/fatal | **0**/35 |
| Shortcode thô | **0**/35 |
| Đúng một `h1` | **35/35** |

70 ảnh React↔WordPress trong `docs/content-review/parity-006/`.

## 3. Gallery Gcalls Plus — 17/17 ĐẠT

Đo ở 1440px và 390px: 6 tab; click đổi đúng ảnh; `aria-selected` theo click;
đúng **một** tab trong tab order (roving tabindex); `ArrowRight`/`ArrowLeft`
đổi tab **và** đổi ảnh; thanh tab cuộn ngang ở 390px; 0 ảnh vỡ.

Sáu ảnh WebP: HTTP 200, đúng magic bytes `RIFF…WEBP`, tổng 448 KB, mỗi ảnh
< 500 KB. Không có chrome của công cụ tạo ảnh.

## 4. Redirect, SEO, hardening

- Redirect: **42/42** (8×301 đúng đích, 34×410). 2 rule còn thiếu trong kế
  hoạch 44 dòng vì cột "Final URL" ghi `(primary is draft — slug TBD)`.
- `noindex` bốn lớp: **PASS** trên cả 7 route.
- Author enumeration + hardening 003A: **22/22 PASS**.

Hai gate trước đây báo FAIL là **canary hỏng, không phải site hỏng**: chúng
thử `/hello-world/`, bài mẫu mà checkpoint 007 đã bỏ vào Thùng rác. Canary giờ
lấy bài publish từ REST index của chính site.

## 5. Số đếm — không đổi

| | Trước | Sau |
| --- | --- | --- |
| Trang publish | 38 | 38 |
| Bài publish | 18 | 18 |
| Corpus | 250 (230 draft / 2 private) | 250 (230 / 2) |
| HUB | 13 | 13 |
| Redirect | 42 | 42 |

Không chạy lại import 250 bài. Không xóa gì.

## 6. Lỗi thật tìm được

1. **Hero visual của 4 sản phẩm không tái tạo được.** 008 sửa thẳng vào
   `product-pages.json`; lần `npm run wp:product` kế tiếp sẽ xoá cả bốn. Không
   gate nào báo — trang chỉ lặng lẽ quay về toàn chữ.
2. **Câu hỏi "card title có phải heading không" nhận ba câu trả lời sai liên
   tiếp:** tất cả là `h3` (76 heading / React 59), tất cả là `<p>` (31), chỉ
   heading khi có mô tả (53 — mất các bước triển khai). Đáp án nằm sẵn trong
   dữ liệu: `items`/`steps`/`rows`/`channels` là thẻ, `capabilities`/`points`
   là gạch đầu dòng.
3. **`/blog/` in một `h2` ghi "undefined"** — `finalCta` dùng khoá `h2`, bộ
   xuất đọc `title`. Lần thứ hai đúng lỗi này lên site. `esc()` giờ ném lỗi.
4. **Hai heading FAQ chồng nhau** trên `/blog/` và `/uoc-tinh-chi-phi/`.
5. **CTA phụ của Gcalls Plus trỏ tới trang ước tính** nhưng bị gắn attribution
   lead — một link công cụ đếm thành liên hệ thứ năm.
6. **Tiêu đề blog là "Blog"** — nhãn menu, đúng và vô nghĩa.

## 7. Chưa đạt

- `/blog/` 75.0%. Ba heading còn thiếu là **cố ý**: React nói blog chưa có bài
  nào, ở đây có 18 bài. Chép sang sẽ **làm điểm cao hơn** và là câu sai.
- Nhịp dọc trang chủ 75% (14.0k px so với 18.7k) — mockup port gọn hơn
  component React.
- CTA `/uoc-tinh-chi-phi/` 66.7%: React 2 link, bản này 3.
- 2/44 redirect chờ biên tập chốt slug.
