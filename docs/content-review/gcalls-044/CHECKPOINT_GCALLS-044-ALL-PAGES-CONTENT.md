# CHECKPOINT GCALLS-044 — NỘI DUNG CHO TẤT CẢ TRANG NGOÀI BLOG

Local/private. 2026-09-02. **Không commit. Không push. Chưa deploy.**
Nội dung/hình ảnh đã duyệt: giữ nguyên. Blog và Corpus Execute: **không đụng tới**.

## Trạng thái

| | |
| --- | --- |
| Tổng canonical page ngoài blog | **37** |
| Hoàn chỉnh **local** | **37 / 37** |
| Hoàn chỉnh **live** | **12 / 37** |
| Còn thiếu (chỉ trên live) | **25** — đã có nội dung trong candidate, chờ deploy |
| `NEW_DRAFT` cần chủ sở hữu viết mới | **0** |

**Chưa gọi `CONTENT_COMPLETE`** — 25 trang vẫn là shell trên demo. Local xong,
live thì chưa; hai cột riêng, không dùng cột này thay cột kia.

---

## 1. Phạm vi thật — 37 trang, không phải 18

Danh sách dựng từ ba nguồn rồi gộp: **WordPress REST** (`/wp-json/wp/v2/pages`,
`X-WP-Total: 38`), route matrix của các checkpoint trước, và `src/config/`
+ `src/pages/` của React. Trừ `/blog/` (ngoài phạm vi) → **37 canonical page**.

GCALLS-040→043 chỉ nghiệm thu **18 route P0**. Đo trên live cho thấy **25 trang
là shell** — khoảng 100–122 từ, tức chỉ có menu và footer, không có nội dung.

Phân loại trước khi làm:

| Nhóm | Số trang | |
| --- | --- | --- |
| **A** — đã có trong candidate, chưa deploy | 7 | `/tich-hop/` + 5 vendor + `/lien-he/` |
| **B** — có source React, chưa port | **18** | ngành, tài nguyên, công ty, bảng giá, referral |
| **C** — chưa có nội dung, cần biên soạn | **0** | — |
| **D** — có nội dung nhưng thiếu section | 0 | — |

Không có trang nào thuộc nhóm C: **React đã có sẵn toàn bộ nội dung**, chỉ chưa
được port sang manifest của WordPress. Không trang nào bị gỡ khỏi menu hay đổi
thành "Sắp ra mắt".

---

## 2. Đã port 18 trang từ source

Công cụ: `wordpress/scripts/port-content-044.mjs`.

**Dùng bundler, không dùng regex.** Dữ liệu nằm trong các module TypeScript
import lẫn nhau; esbuild phân giải alias `@/` và *chạy* chúng, nên trường nào có
thật thì được port, trường nào không có thì báo lỗi ngay. Đọc bằng regex chính
là cách một exporter âm thầm đánh rơi dữ liệu — đúng lỗi GCALLS-041 đã tìm ra.

| Trang | Section | Card | FAQ | Provenance |
| --- | --- | --- | --- | --- |
| `/nganh/giao-duc/` … `/nganh/bpo/` (6 trang) | 6 mỗi trang | 21 mỗi trang | 4 | **PORTED** |
| `/cong-ty/khach-hang/` | 9 | 38 | 5 | **PORTED** |
| `/cong-ty/doi-tac/` | 9 | 42 | 6 | **PORTED** |
| `/tai-nguyen/guides/` | 4 | 9 | 4 | **PORTED** |
| `/tai-nguyen/ebook/` | 5 | 14 | 3 | **PORTED** |
| `/tai-nguyen/case-studies/` | 6 | 20 | 4 | **PORTED** |
| `/tai-nguyen/glossary/` | 9 | 27 | 3 | **PORTED** |
| `/tai-nguyen/faq/` | 9 | 24 | — | **PORTED** |
| `/referral/` | 2 | 3 | — | **PORTED** |
| `/nganh/` | 1 | 6 | — | **ADAPTED** |
| `/tai-nguyen/` | 1 | 6 | — | **ADAPTED** |
| `/cong-ty/` | 1 | 2 | — | **ADAPTED** |
| `/bang-gia/` | 6 | 26 | 7 | **ADAPTED** |

**14 PORTED · 4 ADAPTED · 0 NEW_DRAFT.** Không trang nào phải viết mới từ đầu,
nên không có mục nào chờ chủ sở hữu duyệt nội dung mới ngoài `/bang-gia/` (§3).

### Sáu trang ngành là sáu bài khác nhau

§3 cấm sao chép một bài rồi thay tên ngành. Đo độ trùng tiêu đề card giữa các
cặp trang: **trung bình 3,1%, cao nhất 7,7%**. Mỗi trang có H1, bài toán, tác
động và workflow riêng của ngành đó.

---

## 3. Một lỗi export tôi tự tạo ra rồi tự bắt được

Bản porter đầu tiên xuất `/tai-nguyen/glossary/` với **3 card** từ một file
nguồn 425 dòng, và `/tai-nguyen/faq/` với **3 card**.

Nguyên nhân: `GLOSSARY.groups` và `FAQ.groups` là **mảng ở cấp cao nhất** của
trang (6 nhóm × 4 mục = 24 mục mỗi trang). Hàm map chỉ hiểu object có `h2` nên
trả `null`; và bản kiểm "unmapped" đầu tiên chỉ soi object **không phải mảng**,
nên 24 thuật ngữ và 24 câu hỏi biến mất **không một dòng cảnh báo**.

Đây đúng là loại lỗi GCALLS-041 đã tìm thấy (58 card rỗng), và tôi tái tạo nó
trong chính exporter mình vừa viết comment cảnh báo. Đã sửa hai chỗ: xử lý mảng
group ở cấp cao nhất, và **báo mọi khoá không map được, kể cả mảng**.

Sau khi sửa: glossary **9 section / 27 card**, faq **9 section / 24 card**,
và **0 khoá unmapped** trên cả 13 trang chạy qua porter chung.

---

## 4. `/bang-gia/` — chi phí và tư vấn cấu hình, không có giá

`src/data/pricing.ts` khai `PRICING_CONFIGURED = false`. Porter **dừng build**
nếu giá trị này đổi, để không ai vô tình publish giá chưa duyệt.

Trang gồm: 6 yếu tố quyết định chi phí (`PRICING_FACTORS`), 7 sản phẩm/giải pháp
được báo giá (`SOLUTION_PRICING`), 7 hạng mục bổ sung (`PRICING_ADDONS`),
4 nhóm thông tin cần cung cấp để nhận báo giá, một đoạn phân biệt **ước tính**
với **báo giá chính thức**, liên kết `/uoc-tinh-chi-phi/`, và 7 FAQ.

Quét toàn bộ 18 trang mới: **0 số tiền · 0 tên gói (Basic/Pro/Enterprise) ·
0 tỷ lệ phần trăm**. Ba lần xuất hiện chữ "SLA" đều nằm trong **định nghĩa
thuật ngữ** ở glossary, không phải cam kết dịch vụ.

`/referral/` giữ nguyên nguyên tắc của source: **không mức hoa hồng, không tỷ
lệ, không kỳ thanh toán** — chỉ mô tả quy trình.

---

## 5. Kết quả render local

Đo trên WordPress 7.1 + Elementor 4.2.3 chạy Core 0.10.5:

| Trang | Live (shell) | Local (sau port) |
| --- | --- | --- |
| `/nganh/giao-duc/` | 104 từ | **2 539 từ** |
| `/nganh/bpo/` | 102 từ | **2 502 từ** |
| `/tai-nguyen/glossary/` | 101 từ | **3 202 từ** |
| `/tai-nguyen/faq/` | 102 từ | **3 130 từ** |
| `/cong-ty/khach-hang/` | 102 từ | **3 443 từ** |
| `/cong-ty/doi-tac/` | 103 từ | **3 577 từ** |
| `/bang-gia/` | 116 từ | **1 846 từ** |
| `/referral/` | 100 từ | **1 115 từ** |
| `/nganh/` · `/tai-nguyen/` · `/cong-ty/` | 108–122 từ | **1 098–1 383 từ** |

Mỗi trang: **đúng một H1**, section có nội dung thật, card có body, không heading
đứng một mình.

Acceptance mở rộng từ 18 lên **37 route**, chạy desktop 1440 và mobile 390:
**37 × 2 = 74 checks · 74/74 PASS**. Mỗi ô kiểm: HTTP 200 · đúng một H1 · không
overflow ngang · không ảnh hỏng · không raw shortcode · không PHP/JS error ·
không grid rỗng · không heading orphan · không final CTA trùng · **không input
disabled ngoài trạng thái submitting**. Trang chủ giữ 13 section và seam 50px ở
cả hai khổ.

Scan nội dung trên 37 route: **0 finding** — không PII, không domain bị cấm,
không số liệu bịa; chỉ có `sales@gcalls.co` và hotline `028 7302 5469` của
chính Gcalls.

Kết quả và ảnh: `acceptance-044.json`, thư mục `screenshots/`.

---

## 6. Bảng inventory đầy đủ

`inventory-044.json` — 37 dòng với cột: URL · Family · Nguồn · Section · Local ·
Live · Còn thiếu. Tóm tắt:

| Family | Trang | Local | Live |
| --- | --- | --- | --- |
| home | 1 | ✓ | ✓ |
| product | 4 | ✓ | ✓ |
| product/solution overview | 2 | ✓ | ✓ |
| solution-detail | 4 | ✓ | ✓ |
| tool (`/uoc-tinh-chi-phi/`) | 1 | ✓ | ✓ |
| contact | 1 | ✓ | shell |
| integration (overview + 5) | 6 | ✓ | shell |
| **industry (overview + 6)** | **7** | ✓ | shell |
| **resource (overview + 5)** | **6** | ✓ | shell |
| **company (overview + 2)** | **3** | ✓ | shell |
| **pricing** | **1** | ✓ | shell |
| **referral** | **1** | ✓ | shell |
| **Tổng** | **37** | **37** | **12** |

---

## 7. Gói phát hành nội dung

`wordpress/.release-042/` — Core **0.10.5**, Theme **0.8.6**.

| | SHA-256 |
| --- | --- |
| `gcalls-core-0.10.5.zip` | `1315acc3df46d777c6d3e8a267141fc2d3dff27b9e2b720008383fe4a906d32f` |
| `gcalls-theme-0.8.6.zip` | `de45de7daa1f0e6b77a4fe1c60fc73339298aa3a9e217b09bcf6aa468a3bfd73` |

Gói này **chỉ** mang renderer, manifest và asset cho các trang nội dung. Theo §5:

- **Không** đổi homepage layout, **không** chạy Homepage Apply.
- **Không** đổi form backend hay cấu hình SMTP.
- **Không** hạ cấp theme.
- **Không** đụng blog.
- **Không** splice file placeholder — build gate của 042 vẫn fail nếu markup
  placeholder lọt vào.

Vì các trang nội dung **không phụ thuộc form**, **SMTP không phải điều kiện
chặn gói này**. Form vẫn ship trong Core 0.10.5 và vẫn cần SMTP trước khi
tuyên bố hoạt động — nhưng nội dung 25 trang thì không chờ điều đó.

### 18 trang mới cần được tạo trên demo

Manifest render theo **slug**, nên mỗi trang phải tồn tại trong WordPress. 18
trang này **đã có sẵn trên demo** (đếm được 38 page qua REST), nên chỉ cần cài
plugin — không phải tạo page mới.

---

## 8. Thao tác cần chủ sở hữu duyệt

1. **Cài Core 0.10.5 + Theme 0.8.6 lên demo.** Đây là thao tác duy nhất biến
   25 shell thành trang có nội dung. Rollback đã verify ở
   `wordpress/.deploy-043/`.
2. **Xem lại `/bang-gia/`** — trang không công bố giá vì `PRICING_CONFIGURED`
   là `false`. Nếu đã có bảng giá được duyệt, cần thay bằng nguồn chính thức.
3. **SMTP + cache + inbox** cho form (không chặn gói nội dung này).
4. **Gate A1/A2** — repo Public với lịch sử PII, media PII còn công khai.

Chưa có gì được deploy. Sau khi được phép, mỗi canonical URL cần được xác minh
lại trên demo và ghi vào cột **Live** — không dùng "source-complete" thay cho
"live-complete".
