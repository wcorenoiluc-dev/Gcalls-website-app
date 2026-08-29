# Checkpoint 007 — báo cáo nghiệm thu

Đo trên live `https://ashernguyenxuanthuy.com`, đối chiếu bản React trong
repository (`npm run dev`, `http://localhost:5173`).

Tất cả số dưới đây do script sinh, không gõ tay:

| Số liệu | Lệnh |
| --- | --- |
| Điểm parity | `node scripts/parity-score.mjs` |
| Ảnh 7 route × 5 breakpoint | `node scripts/parity-shots.mjs` |
| Overflow / ảnh vỡ / PHP / h1 | `node scripts/route-qa.mjs` |

---

## 1. Parity theo route (1440px)

| Route | Tổng | Heading | Visual | CTA | Nhịp dọc |
| --- | --- | --- | --- | --- | --- |
| `/` | **95.0%** | 100% | 100% | 100% | 75.0% |
| `/voicebot-ai/` | 87.4% | 87.3% | 100% | 80% | 83.9% |
| `/gcalls-plus-webphone/` | 86.1% | 75.4% | 100% | 100% | 92.1% |
| `/uoc-tinh-chi-phi/` | 84.4% | 89.7% | 100% | 66.7% | 72.8% |
| `/qc-bot-ai/` | 78.3% | 81.0% | 100% | 66.7% | 63.9% |
| `/gcalls-cx/` | 74.7% | 72.5% | 100% | 66.7% | 67.5% |
| `/blog/` | 64.4% | 48.3% | 100% | 75% | 69.7% |

**Trung bình 81.5%.** Đầu phiên là 44.0%.

Cách tính được viết trong `scripts/parity-score.mjs`, ngay đầu file, để con số
không đọc thành ý kiến: heading 0.50 (so theo dãy con chung dài nhất — sai thứ
tự bị trừ, thiếu hẳn bị trừ gấp đôi), visual 0.15, CTA 0.15, chiều cao trang
0.20. Mọi tỉ lệ đều là min/max nên vượt cũng bị trừ như thiếu.

### Gate trang chủ ≥ 95%: **ĐẠT** (95.0%)

Trang chủ có đủ 41 heading, đủ 11 link vào `/lien-he/`, đủ visual của bản
React. Phần còn thiếu duy nhất là chiều cao: 14.0k px so với 18.7k px. Không
phải thiếu nội dung — cùng ngần ấy chữ, cùng ngần ấy mục — mà là các mockup
port sang HTML/CSS gọn hơn component React. Tôi **không** độn thêm khoảng
trắng để đẩy con số: khoảng đệm section đã đặt đúng 104px, là trung bình của
96 và 112 mà React dùng, và dừng ở đó.

### Các route chưa đạt 95%

Ba nguyên nhân, không phải một:

1. **`/blog/` (64.4%)** — thấp nhất, và một phần là **cố ý**. Bản React nói
   blog *chưa có bài nào*, trong một mục riêng và trong hai câu FAQ. Đúng ở
   đó, sai ở đây: bản này có 18 bài đã đăng, liệt kê ngay trên cùng màn hình.
   Chép sang sẽ là một câu sai hiển nhiên nằm ngay trên những bài nó phủ nhận
   — và sẽ **làm điểm cao hơn**. Ba heading chênh còn lại là h1 (React dùng câu
   dài, WordPress dùng tiêu đề trang "Blog") và cách gộp số bài vào tên nhóm.

2. **Trang sản phẩm (74.7–87.4%)** — WordPress đang render *nhiều* heading hơn
   React (76 so với 59 trên `/gcalls-cx/`), vì mỗi mục con trong section là một
   `h3` còn React vẽ chúng như thẻ. Đây là chênh lệch cần sửa tiếp, không phải
   thiếu nội dung.

3. **CTA 66.7% trên `cx` / `qc-bot` / `uoc-tinh`** — React có 6 link vào
   `/lien-he/`, bản này có 4.

---

## 2. QA 7 route × 5 breakpoint — 35/35 ĐẠT

`node scripts/route-qa.mjs`

| Kiểm tra | Kết quả |
| --- | --- |
| Tràn ngang tại 1440/1024/768/390/320 | **0** trên cả 35 |
| Ảnh vỡ | **0** |
| Warning / Fatal / Deprecated của PHP | **0** |
| Shortcode chưa render (`[gcalls_…`) | **0** |
| Đúng một `h1` mỗi trang | **35/35** |

Ảnh chụp: `docs/content-review/parity-006/` — 70 file, React và WordPress cạnh
nhau ở cả 5 breakpoint. Không commit vào repo (92 MB, sinh lại được bằng
`npm run` ở trên); số đo nằm trong `parity-results.json` và
`parity-score-1440.json`.

---

## 3. Redirect — 42/42 ĐẠT

Từng URL được gọi riêng, đọc mã trạng thái và header `Location` thật:

- 8 rule `301` → tới đúng slug đích
- 34 rule `410` → trả đúng 410, không phải 404 mềm

Bản kế hoạch URL có **44** dòng. Hai dòng không sinh được rule vì cột "Final
URL" của chúng ghi `(primary is draft — slug TBD)` — không phải một đường dẫn.
Đây là cảnh báo đã được báo từ checkpoint 004 và vẫn còn: **42/44**, phần
thiếu nằm ở dữ liệu biên tập, không ở code.

---

## 4. Số đếm và an toàn SEO

| Số liệu | Giá trị |
| --- | --- |
| Bài viết đã đăng | 18 |
| Trang đã đăng | 38 |
| Bài trong corpus (đã đăng + nháp + riêng tư) | 250 |
| `X-Robots-Tag` trên cả 7 route | `noindex, nofollow, noarchive, nosnippet, noimageindex` |

Toàn site vẫn `noindex`. Không đụng `gcalls.co`.

---

## 5. Những lỗi thật tìm được trong checkpoint này

Đáng ghi lại vì **không có gate nào bắt được chúng** — cả năm đều lọt qua
manifest hợp lệ, import báo thành công và QA xanh:

1. **FAQ của 18 bài đăng ghi "undefined".** Module bài viết dùng khóa `q`/`a`,
   bộ xuất đọc `question`/`answer` rồi bọc `String()`. `String(undefined)` là
   chuỗi `"undefined"` — nên nó tạo ra mục FAQ *hợp lệ hoàn toàn* ghi
   "undefined / undefined", 5 mục mỗi bài. Giờ thiếu chữ là gãy build.

2. **`/blog/` phát 6 accordion "undefined" của một bài khác.** Thân trang chạy
   qua `the_content()` ngoài vòng lặp, nên `[gcalls_faq]` gọi `get_the_ID()` và
   nhận về bài mà vòng lặp để lại.

3. **4 trang sản phẩm và `/uoc-tinh-chi-phi/` không có `h1` nào.** Template
   full-width không in tiêu đề, hero là `<p>`.

4. **Trang chủ có hai `h1`** — tên công ty ở header, đứng trước h1 thật.

5. **Elementor element cache** giữ HTML đã render trong post meta: dữ liệu
   trong database đúng, màn hình sai, không header cache nào giải thích.

Chi tiết trong `git log`.

---

## 6. Còn lại

- Heading của trang sản phẩm đang nhiều hơn React (mục con nên là thẻ, không
  phải `h3`).
- 2 CTA còn thiếu trên `cx` / `qc-bot` / `uoc-tinh`.
- 2/44 redirect chờ biên tập chốt slug.
- Chiều cao trang chủ còn 75% so với React.
