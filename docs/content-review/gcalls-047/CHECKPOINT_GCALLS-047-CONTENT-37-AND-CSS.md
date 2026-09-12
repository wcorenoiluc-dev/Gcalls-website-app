# CHECKPOINT GCALLS-047 — NỘI DUNG 37/37 VÀ CSS

2026-09-02. **Đã triển khai.** Không push, không rewrite Git.
**https://ashernguyenxuanthuy.com** — Core **0.10.8**, Theme **0.8.5** (không đổi).

## Trạng thái

| | |
| --- | --- |
| **CONTENT_LOCAL** | **37 / 37** |
| **CONTENT_LIVE** | **37 / 37** |
| **CSS_APPLIED** | 30/30 tổ hợp route × breakpoint đạt |
| **FORM** | local đạt · live **chưa bật** · SMTP chưa · cache **chặn** · inbox chưa |
| **BLOG** | dry-run 163 bài đã xuất, **chưa import** |

Cả hai mốc đạt: `CONTENT_37_OF_37` và `CONTENT_UI_STYLED`.

---

## Artifact đã cài

| | |
| --- | --- |
| File | `gcalls-core-0.10.8.zip` |
| SHA-256 | `0357782e9786b214dcbec6e1f391701da4256c5597f8fce6cb1f1afb5218d657` |
| Bytes | 504 110 |
| Nguồn | `wordpress/.release-047/` |

Nền: live **0.10.7**, giữ nguyên hình dạng content-only (**0 file form**). Theme
**không** cần đổi — stylesheet mới ship từ plugin. Artifact các checkpoint trước
không bị ghi đè.

---

## 1. Nội dung: một lỗi exporter, mười bốn triệu chứng

Phạm vi thật lớn hơn con số 5 trang đã báo ở GCALLS-045. Bài test completeness
đọc thẳng dữ liệu cho ra: **14 section rỗng trên 9 trang, 58 card** — đúng bằng
con số 58 mà GCALLS-041 từng báo.

Nguyên nhân **không phải mười bốn lỗi riêng lẻ** mà là **một** lỗi từ vựng:

| Shape nguồn | Khoá | Export | Card |
| --- | --- | --- | --- |
| product-boundary | `{product, need, path}` | FD/SF/ZD/ZH/INTL/CRM/HD/POS_BOUNDARY | 34 |
| use-case | `{role, flow}` | FD/SF/ZD/ZH/HS/INTL_USE_CASES | 24 |

Exporter đọc tiêu đề qua `title|label|name|term|q|question` và nội dung qua
`detail|body|summary|description|a|answer|definition`. `product`/`role` và
`need`/`flow` **không nằm trong cả hai**, nên cùng ra chuỗi rỗng. Link chết theo
cùng cách: exporter đọc `item.href`, nguồn mang `item.path`.

**Vì sao im lặng:** exporter map 1:1 không lọc, nên số card trong manifest khớp
đúng số item nguồn (5,4,4,4,4,4,4,4,4,4,5,4,4,4 = **58**). Manifest trông đầy
đủ; mất mát chỉ lộ ra khi render.

**Phân loại: 58/58 là lỗi export thật, 0 rỗng có chủ đích.**

Đã port nguyên văn từ `src/data`, không tự viết chữ nào. Ba chi tiết được giữ
theo hành vi React: card `current` không tự link về chính trang đang xem,
`eyebrow` được khôi phục, và mọi `href` đã qua `safe_href()`.

**Thêm 4 link chết đã sửa** — cùng gốc `path`/`href`: hai card "Tổng đài cho
Thương mại điện tử" và "Tổng đài cho BPO" trên freshdesk và zendesk. Đây đúng là
4 card mà GCALLS-041 để lại cho chủ sở hữu quyết vì "chưa có route" — nguồn React
đã có sẵn đường dẫn, và hai trang ngành đó **nay đã tồn tại** sau GCALLS-044.

### Kết quả đo trên live

| Route | Trước | Sau |
| --- | --- | --- |
| `/tich-hop/freshdesk/` | 16 section · 1 816 từ | **18 · 2 042** |
| `/tich-hop/zendesk/` | 16 · 1 803 | **18 · 2 026** |
| `/tich-hop/salesforce/` | 15 · 1 634 | **17 · 1 839** |
| `/tich-hop/zoho-crm/` | 15 · 1 687 | **17 · 1 891** |
| `/tich-hop/hubspot/` | 14 · 1 686 | **15 · 1 790** |
| `/tong-dai-quoc-te/` | 14 · 2 263 | **16 · 2 474** |
| `/tong-dai-tich-hop-crm/` | 15 · 1 776 | **16 · 1 863** |
| `/tong-dai-tich-hop-helpdesk/` | 13 · 1 695 | **14 · 1 785** |
| `/tong-dai-tich-hop-pos/` | 14 · 1 734 | **15 · 1 825** |

**37/37 LIVE_PASS.** Bảng đầy đủ: `live-verify-047.json`.

---

## 2. Test âm — và một lỗ hổng trong chính bài test của tôi

Bài test mới `wordpress/tests/content-completeness-test.php` hỏi điều mà
renderer-test và live-verify **không thể** hỏi: manifest có **mang** nội dung mà
nó khai không. Renderer và manifest khớp nhau suốt thời gian đó — chúng khớp
nhau *là* vấn đề.

Ba đột biến, chạy trên baseline sạch:

| Đột biến | Kết quả |
| --- | --- |
| baseline sạch | **4 ok, 0 fail** |
| làm rỗng **một** card trong ba | **FAIL** |
| làm rỗng **toàn bộ** card của một section | **FAIL** |
| **xoá hẳn** một section | **FAIL** |

Trường hợp thứ ba ban đầu **KHÔNG fail**. Xoá một section thì phần còn lại vẫn
hợp lệ, nên bài test xanh — chính là lỗ hổng nó sinh ra để bịt. Đã bổ sung
`data/content-inventory.json` khoá hình dạng kỳ vọng (31 trang, 239 section, kèm
danh sách heading để phát hiện cả trường hợp *thay* chứ không *xoá*), theo đúng
quy ước `build-homepage-template.mjs` đang dùng cho trang chủ.

Cũng đã sửa hai lỗi đo trong chính bài test trước khi tin số liệu: `taglist`
mang chuỗi thuần nên cast sang mảng làm 118 tag tốt bị đếm nhầm là rỗng; và
section `prose` có heading + lead vẫn render bình thường, không phải lỗ.

---

## 3. CSS: 123 rule không bao giờ khớp một phần tử nào

Truy vết `gc-components.css` cho kết quả dứt khoát:

| Câu hỏi | Trả lời |
| --- | --- |
| Có trong ZIP đang chạy? | **Không** — theme live 0.8.5 chỉ có `theme.css`; URL trả **404** |
| Có được enqueue? | Có, nhưng chỉ trong theme **0.8.6**, bản không được cài |
| Selector khớp `gcalls-cp__*`? | **0/123 rule** — 122 rule scope `.gc-page`, 1 rule `:root`; chuỗi `gcalls-cp` xuất hiện **0 lần** |
| Có stylesheet nào trong repo nhắm `gcalls-cp__*`? | **Không có, chưa từng có** |
| Trang live tải gì? | 3 stylesheet: block-library, Google Fonts, `theme.css?ver=0.8.5` — `theme.css` chứa **0** lần `gcalls-cp` |

Nên "trang không có CSS" không phải suy đoán từ giao diện thô: markup dùng một
từ vựng chưa từng có stylesheet, và `theme.css:199` đặt
`.gcalls-page--full-width { width: 100% }` không kèm `max-width` — đó là lý do
nó tràn sát mép chứ không chỉ đơn thuần là chữ trơn.

**Bản sửa:** `assets/css/content-pages.css` ship **từ plugin**, vì plugin sở hữu
markup này. Tách markup và trình bày sang hai release khác nhịp chính là cách
`gc-components.css` được viết cho một từ vựng renderer không hề phát ra. Hệ quả
tốt: sửa được live **mà không cần release theme** — live giữ Theme 0.8.5.

Tái sử dụng nguyên vẹn ngôn ngữ thiết kế của `gc-components.css`: container
1220px, measure 660px, nhịp section 50px, radius 20/12px, padding card 28/22px,
gap 20px, hai giá trị shadow, và palette `--gcalls-*`. Không màu mới, không
`!important`, không negative margin.

**Đo trên live, 6 route × 5 breakpoint = 30/30 đạt:** stylesheet tải thật, 64
rule parse được, `padding-inline` 110px @1440 và 20px @320, `h1` 45.6px @1440 và
30.4px @320, **overflow ngang = 0** ở mọi khổ.

Mọi selector đều bắt đầu bằng `.gcalls-cp` — kiểm chứng bằng cách đếm trên trang
chủ: `content-pages.css` xuất hiện **0 lần**, không rò sang Elementor.

Ảnh trước/sau: `screenshots/live47-*` (1440 và 390).

---

## 4. Không hồi quy

| Kiểm | Kết quả |
| --- | --- |
| 18 bài blog vs baseline trước deploy | **18 unchanged, 0 changed** |
| Homepage | 18 section · 1 H1 · 9 mockup — **y nguyên** |
| `content-pages.css` trên homepage | **0** (scope hoạt động) |
| wp-admin / Settings / menu Gcalls | 200, không fatal, đủ 4 mục |
| Homepage Layout Apply | **không chạy** |
| Corpus Execute / Import / redirect | **không chạy** |

---

## 5. Form — chưa bật, và lý do mạnh hơn trước

Diff so với live 0.10.7 chỉ **3 file thêm + 1 file thay + 2 dòng bootstrap**.
`Content_Pages::form_slot()` trên live đã sẵn nhánh render form, khoá sau
`class_exists(Leads)` — thêm class là form tự bật.

**Nhưng cache vẫn chặn, và vấn đề nặng hơn nonce hết hạn.** Đọc implementation
thật: `lead-form.js` không gọi mạng, không có REST route, không có nonce-refresh
— **không tồn tại đường an toàn với cache**. Ba token nằm trong HTML:

1. `gcalls_lead_nonce` — hết hạn ~24h → submit bị từ chối.
2. **`gcalls_idempotency`** — sinh mới mỗi lần render. Dưới full-page cache
   **mọi khách nhận cùng một token**: khách A gửi và token vào transient 6 giờ;
   khách B gửi, trúng nhánh idempotency, **lead của B không bao giờ được lưu**,
   và B thấy màn hình thành công mang **mã tham chiếu của A**. Đây là mất lead
   im lặng, đội lốt thành công.
3. `gcalls_started` — vô hại.

Cộng thêm: OneShield trả `x-osh-cache: HIT` trên `/lien-he/` và **không tính
query string vào cache key**, trong khi toàn bộ thiết kế là POST → redirect →
GET `?gcalls_lead=ok&ref=…`. Khách điền form, trang tải lại y hệt, không thông
báo gì.

Ba mốc: **lead đã lưu** ✅ local · **transport chấp nhận** ✅ chỉ với mail capture
cục bộ · **inbox** ❌ chưa. Form sẽ là **Core 0.10.9** sau khi cache và SMTP xong.

---

## 6. Blog — dry-run, chưa import

Số liệu xác nhận lại qua đúng pipeline cũ: **191 bài cũ publish · 18 trên demo
(7 kế thừa + 11 mới) · 184 thiếu** = 119 KEEP_URL + 44 UPDATE_TOPIC + 20
RETIRED_410 + 1 MANUAL_DECISION.

`/tmp/workerD-dryrun.json` — **163 bài, 15 batch** (≤20 bài/batch, xếp theo
decision → hub → ngày cũ nhất). KEEP_URL và UPDATE_TOPIC không bao giờ chung
batch vì xử lý URL khác nhau. Nếu được duyệt, mỗi batch **chỉ tạo draft**.

Loại trừ ghi rõ trong file: **20 URL retired** (tai nghe + tin tuyển dụng) và
**1 bài tiếng Anh** id 14773 chờ quyết định. 163 + 20 + 1 = 184.

18 bài live được bảo vệ bằng ba lớp: chúng không thuộc tập `MISSING`; **0 trùng
slug**; và import chỉ tạo draft. **0/163 bài có body hỏng** — bộ phân loại không
phải hình thức: chạy trên toàn bộ 263 item nó tìm ra 2 bài không có prose, cả
hai đều ngoài đề xuất.

---

## 7. Chủ sở hữu cần làm

| # | Việc | Chặn gì |
| --- | --- | --- |
| 1 | **Loại `/lien-he/` khỏi full-page cache** và **đưa query string vào cache key** ở OneShield; loại cả `/wp-admin/admin-post.php` | Form — không làm thì mất lead im lặng |
| 2 | Cấu hình SMTP cho domain gửi; đặt recipient `socialgcall@gmail.com` trong wp-admin. **`From` giữ `wordpress@<domain site>`, không bao giờ là Gmail** | Form |
| 3 | Xác nhận thư vào hộp `socialgcall@gmail.com` (kể cả Spam) | Mốc inbox |
| 4 | Duyệt/điều chỉnh dry-run 163 bài blog; quyết định bài tiếng Anh 14773 | Blog |
| 5 | **Gate A1 / A2** — repo Public + lịch sử PII, media PII công khai | Phát hành |

**Rollback:** `wordpress/.deploy-045/rollback/` — Core 0.10.0 `929a55d6…`,
Theme 0.8.5 `83bc1ff8…`. Theme chưa từng bị đụng qua cả hai lần deploy.

Dừng ở đây để chủ sở hữu xem website.
