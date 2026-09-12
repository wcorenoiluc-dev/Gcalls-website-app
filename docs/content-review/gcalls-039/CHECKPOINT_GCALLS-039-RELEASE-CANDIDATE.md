# CHECKPOINT GCALLS-039 — FINAL VISUAL RELEASE CANDIDATE

Local/private. 2026-09-02. **Không commit. Không push. Không deploy.**

## Trạng thái cuối

> ## `BLOCKED_HOMEPAGE_13_SECTION_NOT_IN_ANY_BASE`

Package đã dựng lại, cài từ ZIP vào WordPress 6.4.10 sạch, và **65/65 route ×
breakpoint PASS**. Toàn bộ gate của §2, §3, §4, §6 và §7 đạt.

Nhưng §5 bắt buộc nghiệm thu homepage với **13 root section** và **regroup
18 → 13**. Đo được: `data/homepage-elementor.json` có **18 root section**, và
file này **giống hệt nhau từng byte** ở cả ba nơi — Core 0.10.1 (nền), working
tree, và candidate 0.10.2. **Bản 13-section không tồn tại ở bất kỳ nền nào.**
Không có gì để nghiệm thu. §3 đã lường trước điều này ("homepage 13-section
*nếu đã đủ acceptance*"), nên việc loại nó khỏi candidate là đúng — nhưng khi đó
§5 không thể tuyên bố PASS.

Homepage 18-section hiện tại cũng không render được ở đây: nó là dữ liệu
`_elementor_data`, cần Elementor — plugin bên thứ ba không có trong môi trường,
không thuộc release này, và §6 cấm chạy Homepage Layout ngoài quy trình release.

Không gọi `DEPLOY_READY`: repo vẫn Public với lịch sử PII (Gate A1 chưa xử lý).

---

## 1. Mockup Analytics — remap, không phải bỏ trống

Báo cáo 038 xác định `analytics-dashboard` REFUSED. Kiểm tra bằng ảnh thật cho
thấy **cả sáu** frame raster của `mock_plus_gallery` đều vi phạm:

| Frame | Vi phạm |
| --- | --- |
| `analytics-dashboard` | KPI + biểu đồ xu hướng như kết quả đo được · `UNAPPROVED_DOMAIN_01` · 5 agent có tên |
| `agent-performance` | tile Total Calls / Answered / Avg Talk Time / CSAT · bảng agent có tên |
| `webphone-overview` | `UNAPPROVED_DOMAIN_01` · tên liên hệ · số điện thoại |
| `customer-profile` | `UNAPPROVED_DOMAIN_01` · danh bạ đầy tên người + số |
| `call-history` | `UNAPPROVED_DOMAIN_01` · tên người · rating sao từng cuộc gọi |
| `click-to-call` | `UNAPPROVED_DOMAIN_01` · bảng công ty/người bịa |

Đây là ảnh bitmap; số liệu, domain và tên người nằm trong pixel, không tạo được
bản trung tính. Theo §1 bullet 5, **toàn bộ gallery raster bị gỡ**.

### Lỗi mà checkpoint trước bỏ sót

Bản 039 trước cho `[gcalls_mockup id="analytics"]` trả **chuỗi rỗng**. Điều đó
trông như miễn phí khi chỉ đo bốn trang sản phẩm — không trang nào gọi id này.
**Home page thì có.** Root section 11 của `homepage-elementor.json` là:

```
[title]     Theo dõi hiệu suất đội ngũ theo thời gian thực
[editor]    Dashboard trực quan giúp quản lý theo dõi tình trạng cuộc gọi…
[shortcode] [gcalls_mockup id="analytics"]
```

Một heading, một đoạn văn, và shortcode này là **hình ảnh duy nhất** của section.
Trả rỗng ở đó để lại **heading treo trên một cột trống** — đúng thứ §5 gọi là
"grid track rỗng / heading orphan" và fail một route.

Đối chiếu nền: Core 0.10.1 **không có** danh sách refused nào; `mock_analytics()`
vẫn render bình thường. Nghĩa là dashboard bịa (114 · 73% · 3:25) **đang chạy
trên homepage live**, và bản sửa trước sẽ thay nó bằng một khoảng trống.

### Bản trung tính

Theo §1 bullet 3, `analytics` nay **remap sang `reporting`** — một panel mới,
không phải `mock_analytics` được gắn nhãn lại:

- Chrome cửa sổ "Báo cáo vận hành".
- Chip khoảng thời gian Ngày / Tuần / Tháng vẽ bằng `<span>`, **không phải
  `<button>`**: không có gì trong một mockup tĩnh phản hồi khi bấm, và một
  control trông sống mà không sống thì đọc như trang hỏng.
- Bốn hàng chỉ số — Tổng cuộc gọi, Tỷ lệ bắt máy, Thời lượng trung bình, Đánh
  giá sau cuộc gọi — **mọi giá trị là dấu "—"**. Tên chỉ số là phát biểu về
  tính năng và đúng; điền số vào là phát biểu về kết quả.
- Khối trạng thái: "Chọn khoảng thời gian và bộ lọc để xem số liệu của bạn."
- Nhãn cố định **"Giao diện minh hoạ · Dữ liệu mẫu"**, đọc từ chính
  `media-frames.json` để không trôi khỏi nhãn của ảnh raster.

Ảnh: `screenshots/rc-analytics-neutral-1440.png`, `…-390.png` — chụp qua HTTP
thật từ package đã cài.

`mock_analytics()` và `mock_plus_gallery()` vẫn còn trong file để quyết định
xem lại được, nhưng bị chặn theo **tên method** (`REFUSED_METHODS`), không theo
id — nên một id mới thêm sau này cũng không mở lại được chúng.

---

## 2. Lỗ gallery hardcode — đã đóng

Trước: hai danh sách frame hard-code (`mock_plus_gallery`, `showcase()`) tự ghép
URL, không qua media policy.

Nay: một registry duy nhất — `data/media-frames.json`. Mỗi frame khai `id`,
`file`, `provenance`, `verdict`, `kind` (`real_product` | `illustrative`),
`reason`, `alt`, `label`. `Mockups::frame()` là **nơi duy nhất** ghép URL ảnh, và
nó **không nhận filename hay URL** — chỉ nhận id. Fail-closed: id lạ, thiếu,
verdict ≠ PASS, hoặc file không tồn tại → trả rỗng. **9 frame: 3 PASS, 6 REFUSED.**

`wordpress/tests/media-frames-test.php` — **19 assertion, 0 fail**, PHP 8.3, chạy
trên **plugin giải nén từ ZIP**, không phải source mount:

| | |
| --- | --- |
| registry loads · mọi frame khai đủ id/provenance/verdict/kind | ok |
| mọi PASS frame có alt + nhãn cố định | ok |
| sáu frame vi phạm đều REFUSED · không frame REFUSED nào render | ok |
| `plus_gallery` render rỗng | ok |
| **`analytics` render panel trung tính, không phải rỗng** | ok |
| **không còn 114 / 73% / 3:25 / `data-mock-series` / "Gcalls Analytics"** | ok |
| **không `<strong>` nào chứa chữ số** | ok |
| panel mang nhãn cố định | ok |
| **`mock_analytics` không tới được bằng bất kỳ id nào** (7 biến thể) | ok |
| id lạ render rỗng · không smuggle filename/URL/path traversal qua id | ok |
| không filename REFUSED hard-code trong `class-mockups.php` | ok |
| chỉ `frame()` ghép URL product-gallery (2 vị trí) | ok |
| mọi PASS frame có file trên đĩa | ok |
| **9 id mockup homepage đều tìm thấy và đều render** | ok |

Hai assertion cuối là bài học của lần này: nếu chúng tồn tại từ đầu, lỗi cột
trống ở section 11 đã không lọt qua.

`wordpress/tests/renderer-test.php`: **30 assertion, 0 fail**, cũng chạy trên
package — bao gồm **0 database write, 1 read**.

### Scan output cuối — `wordpress/scripts/scan-039.mjs`

13 route đã render, đọc từ HTML/text mà trình duyệt thật thấy:

| Mục | Kết quả |
| --- | --- |
| `UNAPPROVED_DOMAIN_01` · `PII_USERNAME_01/02` · `FABRICATED_IDENTITY_01` | **0** |
| chuỗi `REFUSED` · KPI 114 / 73% / 3:25 · `Gcalls Analytics` · `data-mock-series` | **0** |
| media `product-gallery/` ngoài allowlist | **0** |
| email lạ | **0** (chỉ `sales@gcalls.co` — địa chỉ công bố của Gcalls) |
| số điện thoại lạ | **0** (chỉ hotline `028 7302 5469` của Gcalls) |
| host ngoài không mong đợi | **0** (`api.w.org`/`s.w.org` là của WordPress core) |
| `<img>` trên bốn trang sản phẩm | **0** |

Hai chi tiết liên hệ của chính công ty được **in ra chứ không im lặng bỏ qua**:
"không có email nào" và "chỉ có email của công ty" là hai kết quả khác nhau, gate
không được làm mờ ranh giới đó. Bộ dò số điện thoại phiên bản đầu **trượt** đúng
hotline này (`028 7302 5469`) vì khớp nhóm chữ số quá cứng — đã sửa để đọc text
hiển thị và link `tel:` thay vì markup, nơi dữ liệu path SVG gây báo giả.

---

## 3. Nền release — và tại sao không đóng gói working tree

Đo được, không suy đoán: `gcalls-core.php` trong working tree ghi
**`Version: 0.9.7`** (thấp hơn 0.10.1) và **thay** `require class-content-pages.php`
+ `Content_Pages::init()` bằng `class-leads.php` + `Leads::init()`.

Đóng gói working tree sẽ **hạ số phiên bản** và **âm thầm gỡ renderer của cả 13
route content**. Vì vậy 0.10.2 = **đúng 0.10.1** (hash-checked) + danh sách diff
đã duyệt; build **fail** nếu hash nền sai.

| | |
| --- | --- |
| Core base | `gcalls-core-0.10.1.zip` · `52ffe873880a3047…` ✓ |
| Theme base | `theme.css` = `aea2b9536c85c017…`, byte-identical live 0.8.5 ✓ |

**Loại trừ tuyệt đối, đã kiểm trên package đã cài:** `class-leads.php` **0** ·
`lead-form.js` **0** · `lead-form.css` **0** · `leads-test.php` **0** ·
`Leads::` **0** · `class_exists('Gcalls\Core\Leads')` → **false** ·
`?page=gcalls-leads` → **403** · `<form>` trên `/lien-he/` → **0**.

`lead_form()` hoàn nguyên về bản 0.10.1: panel fail-closed in ra "Biểu mẫu sẽ
được bật trong một bản phát hành riêng", kèm email và hotline. Hai helper runtime
(`lead_state`, `lead_current_path`) bị bỏ.

---

## 4. Package

| | Core | Theme |
| --- | --- | --- |
| File | `gcalls-core-0.10.2.zip` | `gcalls-theme-0.8.6.zip` |
| Bytes | 889 048 | 99 021 |
| SHA-256 | `79ae8615f755b677…b489f6` | `1b0e19708ecc10d6…48a94d` |
| `unzip -t` | No errors detected | No errors detected |
| Root | đúng một: `gcalls-core/` | đúng một: `gcalls-theme/` |
| Files | 45 (0.10.1 có 41) | 25 (0.8.5 có 24) |

**Core 0.10.1 → 0.10.2:** +4 (`media-frames.json`, `section-components.json`,
`class-icons.php`, `class-sections.php`), ~6 (`mockups.css`, `product-pages.json`,
`gcalls-core.php`, `class-content-pages.php`, `class-mockups.php`,
`class-shortcodes.php`), **−0 → strict superset ✓**

**Theme 0.8.5 → 0.8.6:** +`gc-components.css`, ~`inc/assets.php`, ~`style.css`;
`theme.css` không đổi → **strict superset ✓**

> **Sửa số liệu:** manifest trước ghi 889 856 / 100 352 byte cho **cùng một
> SHA-256**. Đó là số block-rounded, không phải kích thước file. Số đúng ở trên.

Chi tiết: `wordpress/.release/PACKAGE-MANIFEST.md`, `SHA256SUMS`, `core-delta.json`.

### Cài thử bằng ZIP thật

WordPress **6.4.10 sạch** (tải từ wordpress.org, SQLite, PHP 8.3). Plugin và
theme cài **chỉ từ hai ZIP** qua blueprint `installPlugin`/`installTheme` —
không mount source. Sau khi khởi động lại server:

| Kiểm | Kết quả |
| --- | --- |
| `get_plugin_data()` | **Gcalls Core 0.10.2**, active |
| `wp_get_theme()` | **Gcalls 0.8.6** |
| `/wp-admin/`, Settings, Plugins, Themes, Pages | **200**, 0 lỗi PHP |
| `?page=gcalls-import` / `gcalls-corpus-migration` / `gcalls-home-layout` | **200** |
| `?page=gcalls-leads` | **403** — menu Leads không tồn tại |

---

## 5. Acceptance — 65/65 PASS

13 route × 5 breakpoint (1440/1024/768/390/320), Chrome thật, **đăng xuất**.
Harness: `wordpress/scripts/accept-039.mjs`; kết quả thô:
`acceptance-039.json`, `acceptance-039-retry.json`.

| Route | 1440 | 1024 | 768 | 390 | 320 |
| --- | --- | --- | --- | --- | --- |
| `/gcalls-plus-webphone/` | PASS | PASS | PASS | PASS | PASS |
| `/gcalls-cx/` | PASS | PASS | PASS | PASS | PASS |
| `/voicebot-ai/` | PASS | PASS | PASS | PASS | PASS |
| `/qc-bot-ai/` | PASS | PASS | PASS | PASS | PASS |
| `/tich-hop/` | PASS | PASS | PASS | PASS | PASS |
| `/tich-hop/freshdesk/` | PASS | PASS | PASS | PASS | PASS |
| `/tich-hop/hubspot/` | PASS | PASS | PASS | PASS | PASS |
| `/tich-hop/salesforce/` | PASS | PASS | PASS | PASS | PASS |
| `/tich-hop/zendesk/` | PASS | PASS | PASS | PASS | PASS |
| `/tich-hop/zoho-crm/` | PASS | PASS | PASS | PASS | PASS |
| `/san-pham/` | PASS | PASS | PASS | PASS | PASS |
| `/giai-phap/` | PASS | PASS | PASS | PASS | PASS |
| `/lien-he/` | PASS | PASS | PASS | PASS | PASS |
| **Homepage** | — | — | — | — | — **KHÔNG CHẠY ĐƯỢC** |

Mỗi ô kiểm: HTTP 200 · đúng một H1 không rỗng · không overflow ngang · không ảnh
hỏng · không raw shortcode · không PHP warning/fatal · không JS/console error ·
không grid track rỗng · không heading orphan.

**Final CTA:** 12/13 route có **đúng một** (`.gcalls-product__final` hoặc
`.gcalls-cp__cta`). `/lien-he/` có **0** — đúng chủ ý: trang liên hệ *là* đích
của CTA, đặt CTA "liên hệ" trên đó là vòng tròn.

**Hero CTA** giữ đủ attribution, ví dụ:
`/lien-he/?intent=consultation&source=crm_integration&product=Zoho%20CRM&solution=Tích%20hợp%20CRM`.

**Mockup** chạy thật qua `class-mockups.php`, **0 preview stub**, **0 `<img>`**
trên bốn trang sản phẩm.

Ảnh: 26 file `rc-<route>-{1440,390}.png` (ngoài repo, 15 MB). Bộ rút gọn không
PII trong `screenshots/`.

### Ba điều acceptance làm rõ

**a) Hai H1 — là lỗi fixture, không phải lỗi sản phẩm.** Lần chạy đầu mọi route
đều có `h1=2`: một từ `gcalls-page-header__title` của `page.php`, một từ hero.
Nguyên nhân: fixture chưa gán page template. Template
`page-templates/full-width.php` được viết đúng để tránh việc này — nó render
nội dung trước, hỏi `stripos($content, '<h1')`, và chỉ tự in H1 nếu chưa có.
Gán template xong: **13/13 route có đúng một H1**. Ghi lại vì kết quả acceptance
**phụ thuộc vào page template**, và checkpoint trước không ghi mình đã dùng cái nào.

**b) Hai FAIL của `/voicebot-ai/` là do harness, không do trang.** Lần chạy đầu
báo `503 Service Unavailable` ở 1440 và 768. Chạy lại riêng route đó:
**5/5 PASS**, và 6 lần curl liên tiếp đều 200. Server PHP-WASM cục bộ thỉnh
thoảng trả 503 dưới tải sáu worker song song — thuộc tính của harness, phải retry
chứ không ghi nhận. Harness nay nhận `GCALLS_ROUTES` để chạy lại từng route.

**c) 128/158 card của content page không có đích.** Renderer xử lý `href` đúng;
**dữ liệu** thiếu — cùng gốc lỗi export. Cần re-export `content-pages.json`,
ngoài phạm vi release này. Card vẫn hiển thị tiêu đề nên không chặn acceptance.

---

## 6. Regression và bảo vệ dữ liệu

| Kiểm | Kết quả |
| --- | --- |
| `class-corpus-migration.php`, `class-importer.php`, `class-home-layout.php`, `class-admin.php` | **byte-identical 0.10.1** (không nằm trong 6 file đổi) |
| `gcalls_corpus_migration_state` | **absent** — Corpus Execute không chạy |
| `gcalls_home_layout_state` / `_backup` / `gcalls_import_state` | **absent** — Homepage Layout không chạy |
| Pages có `_elementor_data` | **0** |
| Writer thực thi trong 6 file PHP đổi/thêm | **0** (4 kết quả grep ban đầu là chữ trong comment "IT WRITES NOTHING") |
| Attachment trong site thử | **0** — không có media PII |
| DB khi render | **0 writes, 1 read** (đọc attachment cho approved media) |
| Live site | **không đụng tới** |

18 bài viết live: **không áp dụng ở đây** — đây là fixture sạch, không import
production. Bảo đảm thực chất: không đường nào trong checkpoint này chạm live, và
toàn bộ mã import/corpus giống hệt 0.10.1.

---

## 7. Rollback

`wordpress/.release/ROLLBACK.md`. Cả hai artifact đã verify hash trong lần chạy này:

| | Artifact | SHA-256 |
| --- | --- | --- |
| Core 0.10.0 | `~/Desktop/gcalls-core-0.10.0-release/…zip` | `929a55d6555cdd25…` ✓ |
| Theme 0.8.5 | `~/Desktop/GCALLS-026-DEPLOY/gcalls-theme-0.8.5-d8d8615.zip` | `83bc1ff8bc576020…` ✓ |

Rollback về **0.10.0**, không phải 0.10.1 — 0.10.1 là *nền build*, chưa từng
deploy (thư mục của nó tên `…-CANDIDATE-do-not-deploy-yet`).

Candidate không migration, không cron, không ghi database, nên rollback chỉ là
thay file. **Nhưng** rollback trả lại dashboard Analytics bịa trên homepage và
sáu frame raster REFUSED trên `/gcalls-plus-webphone/` — an toàn cho site, là
hồi quy cho §1. Cân nhắc theo đó.

---

## 8. Còn chặn

| # | Vấn đề | Ai xử lý |
| --- | --- | --- |
| 1 | **Homepage 13-section không tồn tại ở nền nào** — cả ba bản `homepage-elementor.json` đều 18 section và giống nhau từng byte. §5 yêu cầu nghiệm thu một thứ chưa được dựng | chủ sở hữu: dựng bản 13-section rồi nghiệm thu riêng, hoặc bỏ điều khoản đó khỏi release này |
| 2 | **Homepage 18-section không render được cục bộ** — cần Elementor; §6 cấm chạy Home Layout ngoài quy trình release. Thay đổi duy nhất của candidate chạm homepage là shortcode `analytics`, đã verify riêng qua HTTP thật | chủ sở hữu quyết cách nghiệm thu homepage |
| 3 | **Gate A1: repo vẫn Public với lịch sử PII** | chủ sở hữu |
| 4 | **Media PII trên WordPress live vẫn công khai** (Gate A2, 5 attachment) — không đổi từ 035 | chủ sở hữu |
| 5 | **Sáu ảnh REFUSED vẫn nằm trong package** — không render được, nhưng vẫn tải được bằng URL trực tiếp sau deploy. Gỡ chúng sẽ **phá strict-superset** mà §3 bắt buộc, nên tôi giữ superset và báo mâu thuẫn thay vì tự chọn | chủ sở hữu: cho phép subtraction có chủ đích, hoặc chặn ở tầng server |
| 6 | 128 card content-page không có đích — cần re-export `content-pages.json` | batch sau |
| 7 | 3 frame PASS (`cx-omnichannel`, `voicebot-flow`, `qc-scoring`) đã đăng ký nhưng **không section nào tham chiếu** | chủ sở hữu quyết có gắn vào section không |
| 8 | PHP **native** vẫn chưa chạy test — mới chỉ WASM 8.3 | CI sau Gate A |

Điểm 5 là mâu thuẫn thật giữa hai yêu cầu trong brief, không phải thiếu sót.

---

## 9. Thay đổi trong repo (chưa commit)

| File | |
| --- | --- |
| `includes/class-mockups.php` | `analytics` → `reporting`; `mock_reporting()` mới; `REFUSED_METHODS`; `illustrative_label()` |
| `assets/css/mockups.css` | style cho chip tĩnh, hàng chỉ số "—", khối trạng thái |
| `data/media-frames.json` | registry frame |
| `includes/class-content-pages.php` | từ 0.10.1 + sửa grid rỗng |
| `data/content-pages.json` | từ 0.10.1 — working tree thiếu |
| `tests/media-frames-test.php` | 12 → **19 assertion**, thêm guard homepage |
| `scripts/build-039-release.mjs` | build có gate |
| `scripts/accept-039.mjs` | **mới** — acceptance 13×5, retry theo route |
| `scripts/scan-039.mjs` | **mới** — scan PII/claim/domain/media |
| `docs/content-review/gcalls-039/` | checkpoint này, JSON kết quả, ảnh an toàn |

Artifact build ở `wordpress/.release/` (đã gitignore, không commit).

**Dừng ở release candidate cục bộ. Chờ chủ sở hữu.**
