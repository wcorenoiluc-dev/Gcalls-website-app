# CHECKPOINT GCALLS-041 — CHỐT PHẠM VI BÀN GIAO 04/09

Local/private. 2026-09-02. **Không commit. Không push. Không deploy.**

## Trạng thái

| Mốc | Trạng thái |
| --- | --- |
| `LOCAL_PASS` | **ĐẠT** — 18 route × 5 breakpoint = **90/90**, trên **đúng stack của live**: WordPress 7.1 + Elementor 4.2.3 |
| `OWNER_APPROVED` | **CHƯA** — cần duyệt hero trước/sau (§1) và 4 quyết định nội dung (§2, §3) |
| `LIVE_VERIFIED` | **CHƯA** — chưa deploy. Repo Public + PII (Gate A1/A2) vẫn chặn phát hành |

---

## 0. Phát hiện quan trọng nhất: local đã chạy sai stack

GCALLS-040 nghiệm thu trên **WP 6.4.10 + Elementor 3.19.4**, chọn theo dòng
"Tested up to: 6.4" trong readme của Elementor. Đúng như §5 cảnh báo, dòng đó
không chứng minh gì cả.

Đo trên live bằng phương thức chỉ-đọc (`<meta name="generator">`, URL asset của
Elementor, `readme.txt` công khai, `/feed/`):

| | Local 040 | **Live thực tế** |
| --- | --- | --- |
| WordPress | 6.4.10 | **7.1** |
| Elementor | 3.19.4 | **4.2.3** |
| Gcalls Core | — | 0.10.0 |
| Gcalls Theme | — | 0.8.5 |

Elementor 4.2.3 đòi WP ≥ 6.8, nên hai con số này đi cùng nhau. Toàn bộ nghiệm
thu 040 vì thế chạy trên một nền khác nền phát hành.

**Đã dựng lại và chạy lại trên đúng stack**: WP 7.1 + Elementor 4.2.3
(SHA-256 `506a136dc68ecf9187be2175dbd79c9a6d67cfa441a03f5f9f71c27b0334ab72`).
Kết quả: cấu trúc `section`/`column` của Elementor v3 **vẫn render đúng** dưới
Elementor 4 — 13 root section, 7 inner section, một H1, 9 mockup, 0 lỗi PHP/JS,
seam vẫn đúng 50px ở cả 5 breakpoint. **90/90 PASS.** Rủi ro lớn nhất đã đóng.

---

## 1. Hero — áp dụng quy tắc Analytics, không thiết kế lại

Đề xuất được thực hiện đúng phạm vi: **giữ bố cục, kích thước, lớp nổi và chức
năng minh hoạ**; chỉ thay số.

Ảnh trước/sau: `screenshots/hero-before-1440.png`, `hero-after-1440.png`, và
bản 390 tương ứng. **Đây là đề xuất, chưa phải giao diện được duyệt.**

### Không chỉ hero — component dùng chung có 5 nơi

§1 yêu cầu "test mọi nơi dùng chung component". Việc đó tìm ra bốn surface nữa
mang cùng loại số liệu bịa, trên cả ba trang sản phẩm:

| Mockup | Route | Số liệu đã gỡ |
| --- | --- | --- |
| `hero` | trang chủ | 84 · 73% · 5:24 · 11 |
| `cx_report` | `/gcalls-cx/` | 312 · 47, số ticket theo trạng thái, % theo kênh |
| `voicebot_builder` | `/voicebot-ai/` | 480 · 312 · 198 · 24, % kết quả |
| `qc_dashboard` | `/qc-bot-ai/` | 1.248 · 86 · **81 (điểm QA)** · 34 |
| `qc_scorecard` | `/qc-bot-ai/` | **78 (điểm đề xuất)** |

Hai cái cuối là **điểm số** — thứ §1 của GCALLS-039 nêu đích danh. Surface thứ
năm (`qc_scorecard`) chỉ lộ ra khi bài test quét *mọi* id, không phải khi xem
trang chủ.

### Cách sửa: chữ ký hàm là cơ chế thi hành

`tiles()` nay nhận **nhãn**, không nhận cặp nhãn/giá trị. Một caller **không
thể** truyền số nữa — giống `frame()` không nhận filename. Đổi nhãn thì người
sau vẫn gõ số vào được; bỏ tham số thì không.

### Ngoại lệ duy nhất, có chủ đích

Trọng số tiêu chí của `qc_scorecard` (20/30/30/20, cộng lại bằng 100) **được
giữ**: nó định nghĩa thang chấm, không báo cáo kết quả. Bỏ đi thì scorecard
không còn trọng số. Nó được đánh dấu `gcalls-crit__w` để bài quét miễn trừ đúng
một thứ này và không thứ gì khác.

Nhãn: mọi mockup nay dùng **cùng một câu** với registry ảnh —
`Giao diện minh hoạ · Dữ liệu mẫu` — ở 12px sentence case thay cho 11px viết hoa
(tiếng Việt có dấu viết hoa khó đọc hơn rõ rệt).

**Kiểm chứng:** `media-frames-test.php` **33 assertion, 0 fail**, gồm một vòng
quét *mọi* id: không mockup nào in ra chữ số trong phần tử giá trị, và mọi
mockup render đều mang nhãn cố định. Scan 18 route: **0 finding** (040 báo 1).

---

## 2. Phân loại 239 card — con số thật là 36, không phải 208

GCALLS-040 báo "208/238 card không có đích", gộp cả bộ thành lỗi. Phân loại theo
**mục đích của section** cho kết quả khác hẳn:

| Loại | Số lượng | Kết luận |
| --- | --- | --- |
| **Informational** | **115** | Là phát biểu, **không cần link**. Renderer đã đúng: không href, không affordance bấm được. Gắn link vào đây mới là lỗi |
| **Navigation** | **66** | Cần đích thật. 30 đã có, **36 thiếu** ← đây mới là lỗi |
| **Empty** | **58** | Không title, không body, không href — **lỗ hổng export**, không phải lỗi link |
| **Action** | **0** | Không có card nào thực thi hành vi; nút gửi form nằm ở shortcode riêng |

Bảng đầy đủ theo route + section + card: `card-audit-041.json`.

### Đã khôi phục 32 đích

Mỗi đích được **xác minh 200 trên live trước khi ghi**. Script từ chối chạy nếu
không có kết quả probe — một đích phải được chứng minh, không phải phỏng đoán.
Không dùng `#`, không bịa đường dẫn, và **không gắn card nào về `/lien-he/`** vì
đó là trang gần nhất đang tồn tại.

Nhóm được khôi phục: "Xem thêm" và "Doanh nghiệp đang sử dụng CRM/Helpdesk
khác?" trên 5 trang integration-detail — chúng trỏ sang trang anh em và trang
tổng quan.

### 4 card cần chủ sở hữu quyết

| Trang | Section | Tiêu đề | Vấn đề |
| --- | --- | --- | --- |
| freshdesk | Xem thêm | Tổng đài cho Thương mại điện tử | route ngành chưa tồn tại |
| freshdesk | Xem thêm | Tổng đài cho BPO | route ngành chưa tồn tại |
| zendesk | Xem thêm | Tổng đài cho Thương mại điện tử | route ngành chưa tồn tại |
| zendesk | Xem thêm | Tổng đài cho BPO | route ngành chưa tồn tại |

Hai trang ngành này chưa có. Chọn một: tạo trang, trỏ tạm về `/nganh/`, hoặc bỏ
card. Tôi không tự chọn vì cả ba đều là quyết định nội dung.

### Accessible name — một lỗi thật đã sửa

Mọi link card đều in ra chữ "Tìm hiểu thêm". Người dùng bàn phím hoặc trình đọc
màn hình lấy danh sách link sẽ thấy hàng chục mục **giống hệt nhau**, không phân
biệt được. Nay link mang `aria-label="Tìm hiểu thêm về <tiêu đề>"`; chữ hiển thị
không đổi.

Canonical URL: mọi đích khôi phục là đường dẫn nội bộ tuyệt đối, đi qua
`safe_href()` (chỉ cho phép path cùng site), và tất cả đều 200 trên live —
không redirect.

---

## 3. Inventory toàn website — 22 canonical route

Không dùng "18 URL đã test" làm đại diện. 22 route dưới đây là toàn bộ đích nội
bộ mà dữ liệu đang trỏ tới. Cột **Live** đo bằng probe chỉ-đọc hôm nay.

P0 = menu và CTA đang dẫn tới. P1 = còn lại.

| # | Route | Ưu tiên | Nội dung | Source duyệt | Local render | Visual | CTA/form | Live | Còn lại |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `/` | P0 | đủ | có | PASS | ảnh có | CTA ok | 200 · 2864 từ | duyệt hero |
| 2 | `/gcalls-plus-webphone/` | P0 | đủ | có | PASS | ảnh có | CTA ok | 200 · 1863 | — |
| 3 | `/gcalls-cx/` | P0 | đủ | có | PASS | ảnh có | CTA ok | 200 · 2413 | — |
| 4 | `/voicebot-ai/` | P0 | đủ | có | PASS | ảnh có | CTA ok | 200 · 2357 | — |
| 5 | `/qc-bot-ai/` | P0 | đủ | có | PASS | ảnh có | CTA ok | 200 · 2344 | — |
| 6 | `/san-pham/` | P0 | đủ | có | PASS | — | CTA ok | 200 · 750 | — |
| 7 | `/giai-phap/` | P0 | đủ | có | PASS | — | CTA ok | 200 · 993 | — |
| 8 | `/lien-he/` | P0 | đủ | có | PASS | ảnh có | **panel fail-closed** | 200 · 235 | bật form (§4) |
| 9 | `/tich-hop/` | P0 | đủ | có | PASS | — | CTA ok | 200 · **213 (shell)** | deploy candidate |
| 10–14 | `/tich-hop/{freshdesk,hubspot,salesforce,zendesk,zoho-crm}/` | P0 | đủ ở candidate | có | PASS | — | CTA ok | 200 · **198–202 (shell)** | deploy candidate; 4 card §2 |
| 15 | `/tong-dai-quoc-te/` | P0 | đủ | có | PASS | — | CTA ok | 200 · 2292 | — |
| 16 | `/tong-dai-tich-hop-crm/` | P0 | đủ | có | PASS | — | CTA ok | 200 · 1791 | — |
| 17 | `/tong-dai-tich-hop-helpdesk/` | P0 | đủ | có | PASS | — | CTA ok | 200 · 1710 | — |
| 18 | `/tong-dai-tich-hop-pos/` | P0 | đủ | có | PASS | — | CTA ok | 200 · 1746 | — |
| 19 | `/uoc-tinh-chi-phi/` | P1 | đủ | có | **chưa test** | — | — | 200 · 831 | đưa vào ma trận |
| 20 | `/blog/` | P1 | đủ (18 bài) | có | **chưa test** | — | — | 200 · 2545 | đưa vào ma trận |
| 21 | `/bang-gia/` | P1 | **shell** | **KHÔNG** | — | — | — | 200 · **216** | cần bảng giá thật |
| 22 | `/nganh/` | P1 | **shell** | **KHÔNG** | — | — | — | 200 · **221** | cần nội dung ngành |

**Ba route P0 shell (`/tich-hop/` + 5 vendor) đã có nội dung trong candidate** —
đó chính là thứ bản phát hành này mang lại: live 198–213 từ, local ~1500–1700 từ.

**Route chưa làm được, và tại sao:** `/bang-gia/` và `/nganh/` là shell và
**không có source được duyệt**. Không tự viết: §3 cấm bịa giá, cam kết hiệu quả,
chính sách và SLA — bảng giá là đúng loại nội dung đó. **Không ẩn/xoá menu.**

`/uoc-tinh-chi-phi/` và `/blog/` có nội dung thật trên live nhưng chưa nằm trong
ma trận nghiệm thu; đưa vào là việc cơ học, không cần quyết định nội dung.

---

## 4. Form — luồng kiểm thử riêng, chạy thật lần đầu

Chạy trên nhánh riêng `feature/gcalls-lead-form-runtime` và một site local
riêng. **Không code form nào vào ZIP giao diện** — build gate xác nhận
`form artifacts: 0`, `Leads:: 0`.

### Bộ test hành vi: 65 pass, 0 fail

Lần đầu tiên chạy được (trước đây máy không có PHP runtime). Chúng dùng
`Leads::handle()` thật, chỉ stub bề mặt WordPress.

| Yêu cầu §4 | Test |
| --- | --- |
| Lưu lead thành công **trước khi** báo nhận | #16 lỗi lưu ⇒ không hiện thành công, có báo lỗi, **không gửi mail cho lead chưa lưu** |
| Ghi thất bại không báo thành công | #16 |
| **Email thất bại không mất lead** | #15 lead vẫn lưu, vẫn báo thành công cho khách, đánh dấu `failed`, tăng bộ đếm admin |
| Chống submit trùng | #10 cùng idempotency token ⇒ 1 lead, 1 email, cùng mã tham chiếu |
| Validation | #3–#6 thiếu tên/sai SĐT/sai email/thiếu đồng ý ⇒ từ chối, không lưu |
| Quyền truy cập | #12 nonce sai · #13 khác origin · #14 GET ⇒ từ chối |
| Chống bot | #7 honeypot · #8 submit tức thì · #9 rate limit |
| CTA giữ attribution | #2 intent/source/product/utm_* vào lead **và** vào email |
| Header injection | #19 không CR/LF vào subject, không chèn Bcc |
| **Recipient cấu hình** | #22 `socialgcall@gmail.com` được dùng; cấu hình sai ⇒ quay về mặc định |
| **Không dùng Gmail làm From** | #21/#22 From luôn trên domain site; **không gì gửi From gmail.com** |

### Chạy thật end-to-end trên WP 7.1 + Elementor 4.2.3

Site riêng, mu-plugin **mail capture** (không gửi email thật):

1. Form render đủ: nonce, idempotency token, honeypot, mốc thời gian, consent.
2. Submit tức thì → `code=too_fast` (guard hoạt động).
3. Submit sau độ trễ thật → **303** → `gcalls_lead=ok&ref=GC-260902-0008`.
4. Lead **đã lưu**, `post_status=private`, đủ attribution
   (`intent=consultation`, `source=crm_integration`, `product=HubSpot`),
   `_gcalls_requester_hash` thay vì IP thô.
5. Mail bắt được: **to = socialgcall@gmail.com**,
   `From: Gcalls Website <wordpress@127.0.0.1>`, `Reply-To` = email khách.
6. wp-admin: Settings 200, danh sách lead hiện đủ, trang **Cấu hình nhận lead**
   (`edit.php?post_type=gcalls_lead&page=gcalls-lead-settings`) 200 và hiển thị
   đúng recipient. **Không lỗi capability** — post type dùng
   `capability_type` riêng với `map_meta_cap`, không remap cap lõi.

### Ba mốc — phân biệt rõ

| Mốc | Trạng thái |
| --- | --- |
| **Lead đã lưu** | ✅ đã chứng minh (DB + admin list) |
| **Mail transport chấp nhận** | ✅ đã chứng minh **với mail capture cục bộ** — `wp_mail()` trả true |
| **Inbox xác nhận** | ❌ **CHƯA** — cần SMTP thật trên host triển khai |

**Chưa gọi form là hoàn tất.** Cần chủ sở hữu: cấu hình SMTP xác thực cho
domain gửi (không dùng Gmail làm From), rồi gửi thử và xác nhận thư vào hộp
`socialgcall@gmail.com`. **Không cần và không xin mật khẩu Gmail.**

**Cache form: CHƯA KIỂM TRA.** Trang có form không được cache nguyên trang, vì
nonce và idempotency token sẽ bị phục vụ lại cho người khác. Cần chủ sở hữu loại
`/lien-he/` khỏi page cache ở tầng edge/OneShield rồi mới đo lại — tôi không có
quyền cấu hình đó.

---

## 5. Trước triển khai

- **Elementor thực tế: 4.2.3** — đã xác minh, đã test lại candidate trên đúng
  phiên bản. WordPress live là **7.1**.
- **Baseline 18 bài: NOT VERIFIED (hồi tố).** Dump SQL duy nhất trên máy
  (28-08) chỉ có 14 dòng bảng posts và 1 bài published — **không phải database
  của corpus**, nên không dùng được. Không thay bằng HTTP 200 hay số lượng bài.
- **Đã tạo baseline hiện tại cho lần triển khai sắp tới:**
  `live-baseline-040.json` (18 bài, `body_sha256`, 200, đúng một H1 mỗi bài).
  So với baseline 30-08: cả 18 bài **chỉ đổi `body_sha256`**, không bài nào đổi
  title/slug/hub/SEO/canonical/robots. Ở mức markup thì nhất quán; ở mức chữ thì
  **không chứng minh hồi tố được** vì thiếu bản gốc đúng.
- Không đổi post status, không chạy Corpus Execute, không ghi database live.

---

## 6. Bàn giao

### Candidate

| | Core | Theme |
| --- | --- | --- |
| File | `gcalls-core-0.10.4.zip` | `gcalls-theme-0.8.6.zip` |
| SHA-256 | `b7dde3b8ca6b477cdbdefed52eee716a199d9a9fea8e16a946b86c8c6805321b` | `42a875db8bf3c6d6a934eee73dca8cc4013bb1730b24c61cc29c6afa9c389b66` |
| Bytes | 447 261 | 99 021 |

Ở `wordpress/.release-041/`. **Artifact 040 giữ nguyên** ở
`wordpress/.release-040/` để đối chiếu. Changelog: `PACKAGE-MANIFEST.md`.

### Đường dẫn local để duyệt

| Site | URL | Nội dung |
| --- | --- | --- |
| Giao diện (WP 7.1 + Elementor 4.2.3) | `http://127.0.0.1:9420/` | 18 route, homepage 13 section |
| Form runtime (site riêng) | `http://127.0.0.1:9430/form-runtime-test/` | form thật + mail capture |

Khởi động lại: `npx @wp-playground/cli server --port=9420 --php=8.3
--wordpress-install-mode=do-not-attempt-installing --mount-before-install
<scratch>/site41/wordpress:/wordpress`.

### Ảnh (đã kiểm PII)

`screenshots/` — hero trước/sau (1440 + 390), homepage và 4 trang sản phẩm
desktop/mobile. Scan 18 route: 0 domain cấm, 0 PII, 0 danh tính bịa; chỉ có
`sales@gcalls.co` và hotline `028 7302 5469` của chính Gcalls.

---

## 7. Kết luận

### Đã hoàn thành

1. Phát hiện và sửa sai lệch stack: nghiệm thu lại **90/90 trên WP 7.1 +
   Elementor 4.2.3**, đúng nền live.
2. Gỡ số liệu bịa khỏi **5 mockup trên 4 route**, và làm cho việc tái phạm bất
   khả thi ở tầng chữ ký hàm. Scan còn **0 finding**.
3. Phân loại 239 card: **36** lỗi navigation thật (không phải 208). Khôi phục
   **32** đích đã xác minh 200 trên live; sửa accessible name của mọi link card.
4. Inventory **22 canonical route** với 7 cột trạng thái mỗi route.
5. Form: **65/65** test hành vi + chạy thật end-to-end (lead lưu, mail bắt được
   đúng recipient, admin không lỗi capability) — trên nhánh và site riêng.
6. Tạo baseline 18 bài hiện tại cho lần deploy tới.

### Chủ sở hữu cần duyệt

1. **Hero trước/sau** và 4 mockup sản phẩm còn lại — đây là đề xuất, không phải
   giao diện đã duyệt.
2. **4 card** trỏ tới trang ngành chưa tồn tại (Thương mại điện tử, BPO).
3. **Nội dung `/bang-gia/` và `/nganh/`** — không có source duyệt; tôi không bịa
   giá.
4. **SMTP + inbox** cho `socialgcall@gmail.com`, và **loại `/lien-he/` khỏi page
   cache**.
5. **Gate A1/A2**: repo còn Public với lịch sử PII, media PII trên live còn công
   khai. Đây là việc của chủ sở hữu và vẫn chặn phát hành.

### Còn lại bao nhiêu

| Hạng mục | Số lượng |
| --- | --- |
| Route P0 chưa xong | **0** (8 route đang shell trên live đã có nội dung trong candidate) |
| Route P1 chưa có nội dung/source | **2** — `/bang-gia/`, `/nganh/` |
| Route P1 chưa vào ma trận nghiệm thu | **2** — `/uoc-tinh-chi-phi/`, `/blog/` |
| Lỗi navigation còn lại | **4** card, chờ quyết định nội dung |
| Card informational | 115 — **không phải lỗi** |
| Card rỗng do export | **58** (14 section không hiển thị) — cần re-export |
| Mốc form chưa đạt | **1** — inbox xác nhận |

### Mốc 04/09 — phạm vi khả thi

**Khả thi, dựa trên công việc đã kiểm tra:**

- Toàn bộ **18 route P0** với giao diện đã nghiệm thu trên đúng stack live, gồm
  6 route Batch 2 hiện đang là shell trên live.
- **Form đăng ký hoạt động**, với điều kiện chủ sở hữu hoàn tất SMTP và cache.
  Phần mã đã kiểm thử xong; phần còn lại là cấu hình hạ tầng, không phải code.

**Không khả thi trước 04/09, và tôi khuyến nghị loại khỏi phạm vi bàn giao:**

- `/bang-gia/` và `/nganh/` — chặn bởi nội dung, không bởi kỹ thuật. Không có
  cách rút ngắn nào không đi qua việc bịa giá.
- Re-export 58 card rỗng — cần chạy lại exporter, ngoài phạm vi bản này.
- `LIVE_VERIFIED` — chặn bởi Gate A1/A2, là quyết định của chủ sở hữu.

**Đề xuất phạm vi bàn giao 04/09:** 18 route P0 + form (sau khi cấu hình
hạ tầng), giữ `/bang-gia/` và `/nganh/` ở trạng thái shell hiện tại **và không
ẩn khỏi menu**, kèm danh sách trên như phần việc còn lại.
