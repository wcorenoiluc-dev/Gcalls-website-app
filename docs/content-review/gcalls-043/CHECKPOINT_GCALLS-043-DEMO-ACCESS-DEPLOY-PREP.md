# CHECKPOINT GCALLS-043 — TRUY CẬP DEMO, ĐỐI CHIẾU VÀ CHUẨN BỊ TRIỂN KHAI

Local/private. 2026-09-02. **Không commit. Không push. Chưa triển khai.**
Nội dung và hình ảnh: `CONTENT_APPROVED · MEDIA_APPROVED`.

## Trạng thái

> ## `DEMO_ACCESS_PASS`

Đã vào được wp-admin thật của demo bằng Chrome, đọc DOM, liệt kê plugin/theme.
Không gặp trang đăng nhập, không xin và không in credential.

| | |
| --- | --- |
| Demo vs candidate | Demo **Core 0.10.0** — chậm hơn candidate **0.10.5** năm phiên bản |
| Form trên demo | **Vẫn là placeholder cũ** — đúng như ảnh chủ sở hữu gửi |
| Frontend form (candidate) | Hoàn thiện, ảnh desktop/mobile từ bản chạy thật |
| Triển khai | **Đã chuẩn bị, CHƯA chạy** — 6 điều kiện chưa đạt |
| Blog | 191 bài cũ, **184 thiếu đã truy đủ 100%** |

---

## 1. Đối chiếu phiên bản demo ↔ candidate

Đọc trực tiếp từ `wp-admin/plugins.php` và asset URL của front-end:

| | Demo (live) | Candidate | Chênh |
| --- | --- | --- | --- |
| WordPress | **7.1** | 7.1 (fixture) | khớp |
| Elementor | **4.2.3** | 4.2.3 (fixture) | khớp |
| **Gcalls Core** | **0.10.0** | **0.10.5** | **5 phiên bản** |
| **Gcalls Theme** | **0.8.5** | **0.8.6** | 1 phiên bản |
| `gc-components.css` | **không có** | có | — |
| `lead-form.css` | **không có** | có | — |

Plugin khác đang chạy: Rank Math SEO 1.0.276, UpdraftPlus 1.26.7.

Điều này xác nhận lại kết luận GCALLS-041: stack của live là WP 7.1 +
Elementor 4.2.3, và toàn bộ nghiệm thu 042 đã chạy trên đúng stack đó.

---

## 2. Form trên demo: vẫn là placeholder

Đo trực tiếp trên trang thật, không suy đoán.

**Trang chủ `/`:**

| Kiểm | Live | Candidate |
| --- | --- | --- |
| `<fieldset disabled>` | **1** | 0 |
| Notice "chưa được kết nối" | **có** | không |
| `<form>` hoạt động | 1 (nhưng disabled) | 1 (hoạt động) |
| Top section | **18** | 13 |
| Inner section | **0** | 7 |
| Mockup `analytics` | **render** | remap → `reporting` |
| KPI bịa hiển thị | **84 · 73% · 5:24 · 11 · 114 · 73% · 3:25** | không còn |

**`/lien-he/`:**

| Kiểm | Live | Candidate |
| --- | --- | --- |
| `<form>` | **0** | 1 |
| `.gcalls-cp__slot` (note) | **1** | 0 |
| "bản phát hành riêng" | **có** | không |
| `.gcalls-lead__card` | 0 | 1 |

Ảnh chủ sở hữu gửi là **đúng và vẫn đang đúng trên live**. Nguyên nhân đã truy
xong ở GCALLS-042: quyết định đóng gói từ 039 giữ form ra ngoài, cộng với flag
`form_slot.state = blocked_runtime` trong dữ liệu. Cả hai đã sửa ở Core 0.10.5 —
**nhưng bản đó chưa được cài lên demo.**

---

## 3. Frontend form — ảnh từ bản chạy thật

`screenshots/` chụp từ WordPress 7.1 + Elementor 4.2.3 chạy Core 0.10.5:

| File | |
| --- | --- |
| `form-home-desktop.png` / `form-home-mobile.png` | form trên trang chủ |
| `form-lien-he-desktop.png` / `form-lien-he-mobile.png` | form trên `/lien-he/` |
| `home-fold-desktop.png` | màn hình đầu trang chủ |

Đo lại trên bản vừa dựng: **overflow ngang = 0**, **input disabled = 0**,
**form = 1** ở cả 4 tổ hợp trang × khổ.

**Một sửa nhỏ trong lần này:** placeholder của "Nhu cầu quan tâm" bị cắt ở 390
("…đội Sales 10 ng"). Rút gọn còn "VD: tổng đài cho đội Sales" nên không còn
cắt chữ. Đây là thay đổi trình bày, không đụng nội dung đã duyệt.

Sau khi sửa đã **đóng gói và test lại chính ZIP cuối**: leads **65/65**,
media-frames **33/33**.

---

## 4. Gói triển khai — đã chuẩn bị, chưa chạy

`wordpress/.deploy-043/` gồm candidate, rollback, `SHA256SUMS` và `DEPLOY.md`.

### Fingerprint

**Trước (live, đo hôm nay):** Core `0.10.0` · Theme `0.8.5` · WP 7.1 ·
Elementor 4.2.3 · 18 top section · form disabled · 18 bài publish.

**Sau (candidate):**

| | SHA-256 |
| --- | --- |
| `gcalls-core-0.10.5.zip` | `4b20ff1627e79d9586b41a3a51220cd8af1dbbfa82f7b994c9a4c99acd706a6b` |
| `gcalls-theme-0.8.6.zip` | `4027f98fbabd08573891725c467c36550c16ce5b2229f30f79a291593d51c976` |

**Rollback** (khớp đúng fingerprint đang chạy):

| | SHA-256 |
| --- | --- |
| `gcalls-core-0.10.0.zip` | `929a55d6555cdd25ba94c71bf25a67b16eadf0762217cf369322e5340656d8f8` |
| `gcalls-theme-0.8.5-d8d8615.zip` | `83bc1ff8bc5760204871c2b71f8f7eb7953a1e0158e466a38c185683db2833e8` |

### Điều kiện còn thiếu — tôi không tự bỏ qua cái nào

| # | Điều kiện | Chặn cái gì |
| --- | --- | --- |
| 1 | **SMTP chưa cấu hình** | Form sẽ lưu lead rồi im lặng không báo |
| 2 | **Inbox chưa xác nhận** | Mới chỉ chứng minh với mail capture cục bộ |
| 3 | **Page cache chưa kiểm tra** | Nonce và idempotency token bị cache sẽ phục vụ lại cho người khác. Tôi không có quyền cấu hình edge |
| 4 | **Gate A1 — repo Public + lịch sử PII** | Phát hành |
| 5 | **Gate A2 — media PII còn công khai** | Phát hành |
| 6 | **Ghi Home Layout trên live** | 18 → 13 section; thao tác ghi đè `_elementor_data`, cần chấp thuận riêng |

1–3 chặn **form**. 4–5 chặn **phát hành**. 6 là một lệnh ghi riêng mà việc
upload plugin **không** tự thực hiện.

**Có quyền admin không có nghĩa là được phép ghi.** Truy cập đã đạt; các điều
kiện trên thì chưa, nên tôi dừng ở bước chuẩn bị.

---

## 5. Đối chiếu đủ 191 bài — đã truy hết 184

Câu hỏi của chủ sở hữu: **184 so với 163 + 20 = 183, thiếu 1 bài.**

**Bài còn thiếu đó:**

| | |
| --- | --- |
| Source ID | **14773** |
| Slug | `best-virtual-phone-system-for-small-medium-business-2023` |
| Tiêu đề | Best Virtual Phone System For Small Medium Business 2023 |
| URL cũ | `https://gcalls.co/best-virtual-phone-system-for-small-medium-business-2023/` |
| Word count | 1 879 |
| Hub | **không có** |
| Quyết định | **`MANUAL_DECISION`** |

Đây là **bài tiếng Anh duy nhất** trong toàn corpus. Site mới là tiếng Việt, nên
nó không rơi vào bất kỳ hub nào và được đánh dấu chờ quyết định thủ công — không
phải bỏ sót.

### Và 20 bài "không có entry" — tôi đã báo sai ở 042

Ở GCALLS-042 tôi gọi 20 bài này là "nhóm đáng lo nhất vì không nằm trong kế
hoạch nào". **Sai.** Manifest giữ URL đã nghỉ hưu ở khối `retired`, **không**
phải `articles`, nên script tra nhầm chỗ. Cả 20 đều có quyết định: **410 Gone**.

Nội dung của chúng cũng cho thấy đó là quyết định đúng: **7 trang sản phẩm tai
nghe** (`tai-nghe-jabra-*`, `tai-nghe-epos-*`, `tai-nghe-logitech-*`),
**9 tin tuyển dụng** (`tuyen-dung-*`, `hr-intern`, `hr-parttime`,
`chuyen-vien-tu-van-doanh-nghiep`, `thuc-tap-sinh-*`), và 3 bài marketing sàn
TMĐT (Shopee, Lazada, COVID). Không bài nào là nội dung sản phẩm.

Script `blog-audit-042.mjs` đã sửa để đọc cả `retired`.

### Bảng cuối — 184 truy hết 100%

| Số | Quyết định | Ghi chú |
| --- | --- | --- |
| 119 | `REBUILD_KEEP_URL` | dựng lại, giữ URL |
| 44 | `REBUILD_UPDATE_TOPIC` | dựng lại, đổi chủ đề |
| 18 | `RETIRED_410` | "Non-editorial / off-ICP; no same-intent target so no redirect" |
| 2 | `RETIRED_410` | tai nghe — từng publish nên trả 410, không redirect |
| 1 | `MANUAL_DECISION` | bài tiếng Anh ở trên |
| **184** | | **119 + 44 + 20 + 1 = 184 ✓** |

Tổng thể: **191 bài cũ · 18 trên demo (7 kế thừa đã biên tập + 11 viết mới) ·
184 thiếu · 7 thay đổi · 0 chưa xác minh.**

Bảng đầy đủ: `blog-audit-043.json` (274 dòng, có URL nguồn, ID, tiêu đề, slug,
trạng thái, hub, word count, URL demo, kết quả).

**Chưa chạy Corpus Execute. Chưa import bài nào. Chưa đụng 18 bài hiện có.**

---

## Việc chủ sở hữu cần làm

1. **SMTP** xác thực cho domain gửi, rồi gửi thử và xác nhận thư vào
   `socialgcall@gmail.com`. Gmail chỉ là *người nhận*, không bao giờ là `From`.
2. **Loại `/` và `/lien-he/` khỏi page cache** ở tầng edge, rồi báo lại để đo.
3. **Gate A1/A2** — repo Public với lịch sử PII, media PII còn công khai.
4. **Chấp thuận cài Core 0.10.5 + Theme 0.8.6** lên demo (gói đã sẵn ở
   `wordpress/.deploy-043/`, kèm rollback đã verify).
5. **Chấp thuận riêng cho Home Layout Apply** trên live — đây là lệnh ghi đè
   `_elementor_data`, không tự chạy khi upload plugin.
6. **Quyết định 184 bài blog**: 163 dựng lại, 20 giữ 410, 1 bài tiếng Anh.

Website vẫn **chưa hoàn tất**: `/bang-gia/`, `/nganh/` và 184 bài blog còn đó.
