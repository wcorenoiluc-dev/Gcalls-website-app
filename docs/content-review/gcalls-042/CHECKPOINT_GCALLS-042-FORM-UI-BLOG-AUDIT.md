# CHECKPOINT GCALLS-042 — FORM, UI VÀ ĐỐI CHIẾU BLOG

Local/private. 2026-09-02. **Không commit. Không push. Không deploy.**
Nội dung và hình ảnh: `CONTENT_APPROVED · MEDIA_APPROVED` — không mở lại vòng duyệt.

## Trạng thái cuối

| | |
| --- | --- |
| **`FORM_FRONTEND_PASS`** | Form active trên homepage và `/lien-he/`, một component, submit lưu lead thật, 6 trạng thái đã chụp |
| **`CHROME_CONNECTOR_DISABLED`** | Không có browser connector trong phiên này ⇒ không triển khai demo |
| **BLOG: 191 cũ · 18 trên demo · 184 thiếu · 7 thay đổi · 0 chưa xác minh** | **KHÔNG** phải `BLOG_MIGRATION_VERIFIED` |
| **`UI_REVIEW_PENDING_OWNER`** | Ảnh trước/sau đã xuất; chờ duyệt |

---

## A. Vì sao frontend vẫn render `FORM_BLOCKED_RUNTIME`

Truy nguyên xong. Không phải lỗi runtime, mà là **quyết định đóng gói** từ 039.

Kiểm tra từng mục brief yêu cầu:

| Kiểm | Kết quả |
| --- | --- |
| ZIP đang cài có phải bản chứa form đã test? | **KHÔNG.** `.release-041/gcalls-core` không có `class-leads.php`; `grep "Leads::"` = **0** |
| Homepage JSON gọi shortcode nào? | `[gcalls_lead_form title="Đăng ký tư vấn"]` — đúng shortcode, đúng chỗ |
| Feature flag nào đưa form về blocked? | Hai cái, độc lập nhau (xem dưới) |
| Có trộn Core visual với Core form branch? | **Có, theo chiều ngược lại**: build script *chủ động* ghép `lead_form()` của 0.10.1 (disabled) đè lên bản working tree |

**Cơ chế 1 — build script.** Từ 039, `build-*-release.mjs` cắt `lead_form()` của
working tree và dán bản 0.10.1 vào. Bản đó in ra đúng notice trong ảnh của chủ
sở hữu và `<form onsubmit="return false">` bọc `<fieldset disabled>`. Đúng khi
backend chưa được chứng minh; sai từ 041, khi backend đã đạt 65/65 + E2E.

**Cơ chế 2 — `content-pages.json`.** `/lien-he/` mang
`"form_slot": { "state": "blocked_runtime" }`, nên renderer vẽ một note thay vì
form. Đây là flag thứ hai, nằm ở dữ liệu chứ không ở code.

**Đã sửa cả hai.** Core **0.10.5** ship `class-leads.php`, `lead-form.js`,
`lead-form.css`; bootstrap `require` và `Leads::init()`. Build gate được **đảo
chiều**: nay **fail** nếu markup placeholder hoặc notice lọt vào gói, nếu
`lead_form()` không nối `Leads::ACTION`, hoặc nếu thiếu một trong ba file form.

**Không sửa bằng cách bỏ `disabled`.** Form hiển thị active vì nó *thật sự* nối
handler đã qua test — chứng minh bằng submit E2E ở §C.

---

## B. Thiết kế lại form

Nội dung đã duyệt giữ nguyên; chỉ tổ chức lại UI.

**Desktop** — grid đo được **567.8px / 784.2px = 42% / 58%**. Cột trái: eyebrow,
heading, mô tả, ba lợi ích, email + hotline. Cột phải: card trắng, radius 20px,
border nhẹ, shadow mềm.

**Form** — Họ tên + Công ty một hàng; Email + SĐT một hàng; Nhu cầu quan tâm và
Lời nhắn full width; consent một dòng; submit **"Nhận tư vấn giải pháp"**.
Input `min-height: 48px`, label thật (placeholder chỉ dùng làm ví dụ ở trường
optional), focus ring `3px` riêng, lỗi ngay dưới field.

**Mobile 390** — một cột (`grid-template-columns: 342px`), card có inset riêng,
**overflow ngang = 0**, submit full width, email/hotline là `mailto:`/`tel:`.

**Hai thay đổi vượt ra ngoài trình bày, nêu rõ:**

1. **Lời nhắn thành optional.** Server trước đây bắt buộc `message`. Tên, số
   điện thoại và consent là đủ để gọi lại; bắt viết một đoạn trước khi cho phép
   điều đó biến chuyển đổi rẻ nhất thành bài tập viết. Không test nào khoá hành
   vi cũ.
2. **Thêm trường "Nhu cầu quan tâm" (`need`).** Backend **đã lưu** `need` và đưa
   vào email từ trước — chỉ là **không trang nào render nó**, nên mọi lead từ
   trước tới nay đều có ô này rỗng.

Ảnh: `screenshots/form-states/form-1-empty-desktop.png`, `…-mobile.png`.

---

## C. Form trên homepage và `/lien-he/`

**Một component.** `/lien-he/` không tự vẽ form nữa; `Content_Pages::form_slot()`
gọi chính `[gcalls_lead_form]`. Attribution của trang đi vào **shortcode
attribute**; query string **thắng** attribute, vì người bấm CTA "demo" trên hero
Gcalls Plus được mô tả đúng hơn bởi CTA đó than bởi trang họ đáp xuống.

| Nguồn | Kết quả đo |
| --- | --- |
| `/lien-he/` (không query) | `intent=consultation`, `source=contact` ✓ |
| `/?intent=demo&source=gcalls_plus&product=Gcalls Plus` | `intent=demo`, `source=gcalls_plus`, `product=Gcalls Plus` ✓ |

**Sáu trạng thái, chụp thật** (`screenshots/form-states/`):

| # | Trạng thái | Bằng chứng |
| --- | --- | --- |
| 1 | Empty | desktop + mobile |
| 2 | Focus | focus ring nhìn rõ |
| 3 | Validation error | submit rỗng → `?gcalls_lead=error&code=invalid&fields=name,phone,consent` — **query string không chứa PII** |
| 4 | Submitting | nút chuyển trạng thái |
| 5 | Success | confirmation card **trong đúng card cũ**, mã `GC-260902-0023`, layout không nhảy |
| 6 | Mail failed, lead vẫn lưu | lead `#25` `notify=failed`, khách vẫn thấy thành công |

**Trạng thái 6 chạy thật**, không suy luận: một mu-plugin ép `wp_mail()` trả
`false` ở priority 20 (sau plugin capture — `pre_wp_mail` là một chuỗi, và filter
trả `true` vô điều kiện sẽ ghi đè lên một thất bại).

**Các guard khác:** submit tức thì → `code=too_fast`; honeypot ở ngoài tab order
và `aria-hidden`, autofill hợp lệ không bị loại (lead #23/#25 đều qua);
rate limit không chặn kiểm thử hợp lệ (3 lead liên tiếp đều lưu).

**Lead đã lưu — đo trên DB:**

```
#23  Nguoi Dung Bon Hai   ref=GC-260902-0023  notify=sent    source=contact
#24  Nguoi Dung Mail Fail ref=GC-260902-0024  notify=sent    source=contact
#25  Mail Fail Runtime    ref=GC-260902-0025  notify=failed  source=contact
```

Mail bắt được: `to=socialgcall@gmail.com`,
`From: Gcalls Website <wordpress@127.0.0.1>` — **From trên domain site, không
phải Gmail**. Local dùng mail capture, không gửi thư thật.

### Hai lỗi thật chỉ lộ ra khi render

1. **`lead-form.css` không hề được enqueue trên `/lien-he/`.**
   `Leads::assets()` tìm shortcode trong `post_content` và `_elementor_data`;
   content page không có cả hai — form của nó đến từ manifest. Kết quả: form
   render **không style**, full width, **honeypot hiện ra**. Đã thêm
   `Content_Pages::renders_form()` để enqueue hỏi thẳng renderer.
2. **Eyebrow trùng heading.** Cả hai in "Đăng ký tư vấn" chồng lên nhau vì
   eyebrow cố định còn title mặc định đúng bằng chuỗi đó.

---

## D. UI 18 route P0

`90/90` trên WP 7.1 + Elementor 4.2.3, gồm **gate mới**: không input/fieldset
`disabled` nào ngoài trạng thái submitting — chính lỗi trong ảnh của chủ sở hữu.

Homepage giữ **13 section**, **seam 50px** ở cả 5 breakpoint, 7 inner section.
`imgs=0` trên mọi route (mockup vẽ bằng HTML/CSS). **Không sửa nội dung, không
thay ảnh đã duyệt.**

Ảnh trước/sau: `screenshots/before/` và `screenshots/after/` cho Homepage,
Gcalls Plus, Gcalls CX, Voicebot AI, QA/QC Center, Liên hệ.

Khác biệt thấy được nằm ở `/lien-he/`: từ một note "chưa được kết nối" thành
form hai cột hoạt động. Năm route còn lại **không đổi** — §1 của brief khoá nội
dung và ảnh, nên đây là kết quả đúng, không phải thiếu sót. Tôi **không** gọi UI
là đạt chỉ vì DOM xanh: đánh giá bằng mắt ở §B/§C dựa trên ảnh render thật.

---

## E. Claude in Chrome và website demo

Kiểm theo đúng thứ tự brief:

| # | Kiểm | Kết quả |
| --- | --- | --- |
| 1 | Browser connector có bật? | **KHÔNG** — không có tool điều khiển trình duyệt nào đăng ký trong phiên này |
| 2 | Phiên wp-admin còn đăng nhập? | Không kiểm được từ đây; probe HTTP ẩn danh → **302 về `wp-login.php`** cho `/wp-admin/`, `plugins.php`, `elementor-tools`, `gcalls-home-layout` |
| 3–5 | DOM wp-admin, Plugins/Elementor Tools, upload | **Không tới được** — chặn ở bước 1 |

> ## `CHROME_CONNECTOR_DISABLED`

Vì bước 1 fail, **không triển khai** lên demo. Không xin và không in credential.

**Điều đọc được mà không cần quyền:** REST API công khai của demo trả
`X-WP-Total: 18` — nguồn đối chiếu #2 của §F, dùng ở dưới.

---

## F. Đối chiếu toàn bộ blog cũ

**Nguồn:** WXR export của site cũ, `gcalls-…2026-08-12.xml`, SHA-256
`175876aff0f312782bda607bac28efd5e5db723d180f2a05740ddf169487f510` — **khớp
đúng hash ghi trong manifest**, kiểm trước khi đọc. Cộng REST API của demo.
**Không** dùng dump 14 rows; parser đọc **263 post item** (fail-closed nếu 0).

### Con số

| | |
| --- | --- |
| **Số bài cũ thực tế (đã publish trên site cũ)** | **191** |
| **Số đã có trên demo** | **18** — 7 kế thừa + 11 viết mới |
| **Số thiếu** | **184** |
| **Số thay đổi** | **7** (bài kế thừa, đã biên tập lại) |
| **Số chưa thể xác minh** | **0** |
| Bài chưa từng publish ở nguồn | 72 (70 draft + 2 private) |

Bảng đầy đủ theo URL/ID nguồn, tiêu đề, slug, trạng thái, hub, word count, URL
demo và kết quả: **`blog-audit-042.json`** (274 dòng).

### Cái bẫy mà số liệu này phá

Manifest ghi `counts.publish = 18` và demo có đúng 18 bài, nên hai bên khớp và
blog **trông như đã xong**. Chúng khớp vì `18` là **quyết định migration**, không
phải trạng thái site cũ. `wp:status` trong chính export của site cũ nói khác:
**191 publish**.

### 184 bài thiếu, theo quyết định đã lập kế hoạch

| Số | Quyết định trong manifest |
| --- | --- |
| 119 | `REBUILD_KEEP_URL` |
| 44 | `REBUILD_UPDATE_TOPIC` |
| 20 | *(không có entry trong manifest)* |
| 1 | `MANUAL_DECISION` |

163/184 là bài **đã có kế hoạch dựng lại** nhưng chưa dựng. **20 bài không có
entry nào** — đó là nhóm đáng lo nhất, vì chúng không nằm trong kế hoạch nào cả.

### 7 bài "thay đổi"

7 bài kế thừa đều có word count lệch so với nguồn (ví dụ 7299 → 2062 từ). Đây là
**biên tập có chủ ý** ở Batch 1 (`editedFromBatch1: 18`), không phải hỏng dữ
liệu. Ghi là `CHANGED` chứ không phải `MATCH` vì chữ đã khác — nói "khớp" sẽ là
sai sự thật.

**Không import bài thiếu.** Không chạy Corpus Execute. Không đổi nội dung 18 bài
hiện có. Dry-run report cho 184 bài là việc của checkpoint sau, cần duyệt trước.

---

## G. Acceptance

18 route × 5 breakpoint (1440/1024/768/390/320) = **90 checks · 90/90 PASS**,
trên WordPress **7.1** + Elementor **4.2.3** — đúng stack của live.

| Gate | Kết quả |
| --- | --- |
| Đúng một H1 | ✓ 18/18 |
| Không overflow ngang | ✓ |
| Không raw shortcode | ✓ |
| **Không input disabled ngoài submitting** | ✓ **0** (gate mới) |
| Không PHP/JS error | ✓ |
| Submit local tạo đúng một lead | ✓ mỗi submit → đúng 1 lead |
| Attribution đầy đủ | ✓ intent/source/product/solution |
| Admin lead list hoạt động | ✓ 200, liệt kê đủ lead, settings hiện `socialgcall@gmail.com` |
| 13 homepage section, seam 50px | ✓ cả 5 breakpoint |
| Nội dung và ảnh không bị thay | ✓ `imgs=0`, media registry không đổi |
| PII scan | ✓ **0 finding** trên 18 route |

**Một sửa chữa trong harness:** acceptance từng timeout vì Playwright chờ
`networkidle` trong khi trang tải font từ `fonts.googleapis.com`. Nay mọi request
ngoài loopback bị chặn — nghiệm thu không được phụ thuộc vào một CDN bên thứ ba,
và font đã có fallback thật.

---

## Candidate

| | Core | Theme |
| --- | --- | --- |
| File | `gcalls-core-0.10.5.zip` | `gcalls-theme-0.8.6.zip` |
| SHA-256 | `908ef6c7ca882785484d86f9d5bb94870ed37b1b451c4022812dfa86f5617515` | `39a95ff08468d70628af9cb554516f4a376286b4f73a766f39c12c099ee5b7b3` |
| Bytes | 467 966 | 99 021 |

Ở `wordpress/.release-042/`. **Artifact 040 (`0.10.3`) và 041 (`0.10.4`) giữ
nguyên**, không ghi đè. Changelog đầy đủ: `PACKAGE-MANIFEST.md`.

Test trên **chính ZIP cuối đã giải nén**: leads **65/65**, media-frames
**33/33**, renderer **30/30** (0 DB write).

**Đường dẫn local để duyệt:** `http://127.0.0.1:9440/` (18 route + form).

---

## Chủ sở hữu cần làm

**SMTP / inbox** — ba mốc vẫn tách bạch:

| Mốc | Trạng thái |
| --- | --- |
| Lead đã lưu | ✅ chứng minh trên DB |
| Mail transport chấp nhận | ✅ với mail capture cục bộ |
| **Inbox xác nhận** | ❌ **chưa** — cần SMTP xác thực trên host |

1. Cấu hình SMTP xác thực cho domain gửi. **Không dùng Gmail làm From** —
   `From` phải ở trên domain site (mã đã làm đúng); Gmail chỉ là *recipient*.
2. Gửi thử và xác nhận thư vào `socialgcall@gmail.com`.
3. **Cache:** loại `/lien-he/` và trang chủ khỏi page cache ở tầng edge —
   nonce và idempotency token bị cache sẽ được phục vụ lại cho người khác.
   **Chưa kiểm tra được**, không có quyền cấu hình.
4. **Gate A1/A2** vẫn chặn phát hành: repo Public với lịch sử PII, media PII
   trên live còn công khai.
5. **Blog:** quyết định xử lý **184 bài thiếu** — đặc biệt **20 bài không nằm
   trong kế hoạch migration nào**.

**Chỉ gọi form là hoàn tất sau khi kiểm thử trên môi trường triển khai và inbox
được xác nhận.** Website chưa hoàn tất: `/bang-gia/`, `/nganh/` và 184 bài blog
vẫn còn.
