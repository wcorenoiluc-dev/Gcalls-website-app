# CHECKPOINT GCALLS-036C — CONTENT AND CONVERSION PREVIEW

Local/private. 2026-09-01. **Preview only. Không deploy, không push, không commit.**
Live vẫn Core 0.10.0 · Theme 0.8.5, không đụng tới. Mọi PASS của 036B giữ nguyên.

---

## 0. Bản này sửa gì so với bản 036C trước đó

Bản trước đã chạy đúng exporter và đúng contract, nhưng **đo trên một preview
không đại diện cho renderer sẽ ship**. Bốn điểm dưới đây là phát hiện mới của
lần chạy này, không phải mô tả lại kết quả cũ:

| # | Vấn đề | Ảnh hưởng tới kết luận cũ |
| --- | --- | --- |
| 1 | `contract-test` báo `UNMAPPED_SOURCE (content): none` khi **kiểm 0 source** — gói package không tồn tại, `catch {}` nuốt lỗi | "17/17 ok" có một mục **rỗng nghĩa**; giờ kiểm thật 133 content source |
| 2 | `preview-sections.mjs` **hard-code** label + href của hero CTA, và ghi đè href của final CTA | Toàn bộ CTA inventory cũ đo preview, không đo candidate |
| 3 | Preview **không vẽ hero mockup**, trong khi PHP có vẽ | Một phần chênh lệch chiều cao là thiếu sót của harness, không phải mất nội dung |
| 4 | **Cả hai renderer** bỏ `href` của card | 39 đích điều hướng có trong manifest nhưng không tới được trên trang |

Điểm 4 là lỗi **sẽ ship**, không phải lỗi preview. Điểm 2 và 3 là lỗi harness
làm sai số đo. Điểm 1 làm một cổng kiểm luôn xanh mà không kiểm gì.

---

## 1. Bốn CONTENT_MISSING — đã đóng

Chạy lại `build-product-content.mjs` (locked module, `import()` sau khi viết lại
alias; không chép tay). Nguyên nhân không đồng nhất:

| Source | Chẩn đoán | Nguyên nhân |
| --- | --- | --- |
| `CX_BOUNDARIES` | **EXPORT_FAILURE** | bảng `{need, product, path}`; `need`/`product` không có trong pick list → title rỗng, body rỗng, bị filter bỏ |
| `QQ_BOUNDARIES` | **EXPORT_FAILURE** | như trên |
| `GP_BOUNDARIES` | **EXPORT_FAILURE** | hai nhóm `fitTitle/fitItems` + `expandTitle/expandItems`; không key nào được biết |
| `GP_STORY` | **EMPTY BY DESIGN** | React tự render `placeholder` + `placeholderNote` + link blog vì chưa có câu chuyện khách hàng nào được duyệt công bố |

Ba cái đầu là lỗi export; cái thứ tư không phải lỗi — và trước đây cả bốn trông
giống hệt nhau. Manifest nay mang cờ `emptyByDesign`, completeness report đếm
riêng, builder **fail** nếu một section có heading mà không có gì render và
không được đánh dấu cố ý.

**Provenance đã xác minh độc lập** (`shasum -a 256` trên file nguồn, đối chiếu
với giá trị exporter ghi vào manifest — khớp cả bốn):

| Page | Source | SHA-256 |
| --- | --- | --- |
| gcalls-plus | `src/data/gcallsPlus.ts` | `edf15f8bc57d4992e32d3eeb8da9795ad6799054092995e4d48184821ebc20a1` |
| cx | `src/data/gcallsCx.ts` | `a3ae6e13746d4c3bff0b5ea7d2972c91b950b565bd68c1a59bb29b6d055e6a85` |
| voicebot | `src/data/voicebotAi.ts` | `575f1770a95c02ecae265c331162f9bbfb1852e4668f0a4adcdc787f01763629` |
| qa-qc | `src/data/qaQcCenter.ts` | `62d17e7d5f867193924e1fb79e91ebbab5721ba62923e1a4de4b82bf2c1e08ce` |

Ba component vì hình dạng dữ liệu đòi hỏi: `gc-groups`, `gc-decision`,
`gc-placeholder`.

**CONTENT_MISSING: 4 → 0** trên cả bốn product page.

Export hiện tại: gcalls-plus 14 section / 49 item / 1 empty-by-design · cx 16/54
· voicebot 10/39 · qa-qc 15/37 · mỗi trang 6 FAQ.

---

## 2. CTA inventory — đo lại trên renderer đã sửa

**Số cũ không dùng được.** `heroBlock()` in cứng chuỗi `Đăng ký tư vấn` trỏ
`/lien-he/` trần, còn `finalBlock()` ghi đè mọi href thành
`/lien-he/?intent=…`. `class-shortcodes.php` thì luôn đọc `hero.cta` và luôn tôn
trọng `href` của nút đóng. Hậu quả trên bản đo cũ:

- **3/4 hero hiển thị sai nhãn** — cx, qa-qc phải là *Yêu cầu demo*, voicebot là
  *Đăng ký tư vấn Voicebot*; preview in *Đăng ký tư vấn* cho cả bốn.
- **Toàn bộ hero mất attribution** — `source` và `product` bị bỏ.
- **gcalls-plus có duplicate final CTA giả** — nút *Ước tính cấu hình* (đi
  `/uoc-tinh-chi-phi/`) bị ép về `/lien-he/?intent=consultation`, trùng đích với
  nút bên cạnh. Đây đúng là thứ gate cấm, và nó do renderer tạo ra.
- **Mọi final CTA mất `source`/`product`**, chỉ còn `intent`.

Manifest luôn đúng; chỉ preview sai. Sau khi sửa, inventory thật:

| Page | Section | Label | Đích | intent | source | product | Quyết định |
| --- | --- | --- | --- | --- | --- | --- | --- |
| gcalls-plus | hero | Đăng ký tư vấn | `/lien-he/` | consultation | gcalls_plus | Gcalls Plus Webphone | **Keep** |
| | GP_VENDORS | Khám phá Tổng đài tích hợp CRM | `/tong-dai-tich-hop-crm/` | — | — | — | **Keep** (điều hướng) |
| | GP_PRICING | Ước tính cấu hình & chi phí | `/uoc-tinh-chi-phi/?product=gcalls-plus` | — | — | — | **Keep** (công cụ) |
| | GP_PRICING | Xem bảng giá Gcalls | `/bang-gia/` | — | — | — | **Keep**, xem §7 |
| | final | Đăng ký tư vấn | `/lien-he/` | consultation | gcalls_plus | Gcalls Plus Webphone | **Keep** — final duy nhất |
| | final | Ước tính cấu hình | `/uoc-tinh-chi-phi/?product=gcalls-plus` | — | — | — | **Keep** — mục tiêu khác |
| cx | hero | Yêu cầu demo Gcalls CX | `/lien-he/` | demo | gcalls_cx | Gcalls CX | **Keep** |
| | CX_TRUST | Yêu cầu demo theo workflow… | `/lien-he/` | demo | gcalls_cx | Gcalls CX | **Keep** — decision point |
| | CX_TRUST | Đọc bài viết trên Blog Gcalls | `/blog/` | — | — | — | **Keep** (điều hướng) |
| | CX_PRICING | Ước tính cấu hình & chi phí | `/uoc-tinh-chi-phi/?product=gcalls-cx` | — | — | — | **Keep** |
| | CX_PRICING | Xem bảng giá Gcalls | `/bang-gia/` | — | — | — | **Keep** |
| | final | Yêu cầu demo Gcalls CX | `/lien-he/` | demo | gcalls_cx | Gcalls CX | **Keep** |
| | final | Đăng ký tư vấn | `/lien-he/` | consultation | gcalls_cx | Gcalls CX | **Keep** — intent khác |
| voicebot | hero | Đăng ký tư vấn Voicebot | `/lien-he/` | consultation | voicebot_ai | Gcalls Voicebot AI | **Keep** |
| | final | Đăng ký tư vấn Voicebot | `/lien-he/` | consultation | voicebot_ai | Gcalls Voicebot AI | **Keep** |
| qa-qc | hero | Yêu cầu demo QA QC Center | `/lien-he/` | demo | qa_qc_center | QA QC Center | **Keep** |
| | QQ_PRICING | Ước tính cấu hình & chi phí | `/uoc-tinh-chi-phi/?product=qa-qc` | — | — | — | **Keep** |
| | QQ_PRICING | Xem bảng giá Gcalls | `/bang-gia/` | — | — | — | **Keep** |
| | QQ_STORY | Yêu cầu demo theo quy trình QA… | `/lien-he/` | demo | qa_qc_center | QA QC Center | **Keep** — decision point |
| | QQ_STORY | Đọc bài viết trên Blog Gcalls | `/blog/` | — | — | — | **Keep** (điều hướng) |
| | final | Yêu cầu demo QA QC Center | `/lien-he/` | demo | qa_qc_center | QA QC Center | **Keep** |
| | final | Đăng ký tư vấn | `/lien-he/` | consultation | qa_qc_center | QA QC Center | **Keep** |

**Drop:** CTA trong card — React không làm, và lặp ask ở mọi card làm ask mất giá
trị. **Không thêm:** CTA giữa trang của voicebot — nó nằm trong page component
React chứ không trong data; thêm vào là bịa. Vì vậy voicebot dừng ở 2/3, có chủ ý.

Không chạy theo con số 29. Số React thật trong `<main>` là 20; candidate đạt
**5/5, 6/6, 6/6** và **2/3**.

### Gate CTA

| Gate | Kết quả |
| --- | --- |
| Mỗi CTA có label và href hợp lệ | ok — 21/21 |
| Không CTA rỗng | ok — CTA không label bị bỏ, không thành nút rỗng |
| Không duplicate final CTA | ok — **duplicate giả trên gcalls-plus đã hết** |
| Không heading-only CTA | ok — 4/4 product page, 0 heading orphan |
| Source attribution đúng route | ok — 4 khoá, không khoá rỗng |
| CTA không trỏ tới form giả gửi được | ok — **không có `<form>` nào trong 17 preview** |

---

## 3. Lead attribution

Đi qua `Shortcodes::lead_href()` — nơi duy nhất ghép attribution — nhận **đúng
bốn khoá** `intent` · `source` · `product` · `solution`, mỗi giá trị qua
`sanitize_text_field()`, giá trị rỗng bị bỏ hẳn (`?intent=` không cùng nghĩa với
không có intent), URL dựng bằng `add_query_arg()` trên `home_url()`. Manifest
**không thể** thêm query parameter, chỉ điền vào một trong bốn. `leadHref()`
phía Node phản chiếu đúng như vậy và nay được cả hero, final và section CTA dùng
chung — trước đây chỉ section CTA dùng.

Link điều hướng (`gc-decision`, `gc-groups`, card, `/blog/`, `/bang-gia/`) là
link thường, **không** mang attribution: biến chúng thành contact link sẽ đặt
thêm nhiều ask lên một trang mà nhiệm vụ lúc đó là gửi người đọc đi nơi phù hợp.

`/lien-he/` khi form runtime chưa sẵn sàng hiển thị đúng như yêu cầu — contact
card với hotline và email, kèm câu *"Biểu mẫu trực tuyến chưa mở. Trong lúc này,
hai kênh dưới đây nhận yêu cầu ngay."* Không giả success, không form gửi được.

---

## 4. Figure-tile verdict

Nhãn được đặt **trong helper `tiles()`**, không phải ở từng caller: mọi caller
của helper đó theo định nghĩa đang in một con số tổng hợp, nên caller mới không
thể quên. Ba caller: `mock_cx_report`, `mock_voicebot_builder`,
`mock_qc_dashboard`.

| Mockup | Tile | Verdict |
| --- | --- | --- |
| `mock_cx_report` | 312, 47 | **giữ + nhãn `Dữ liệu minh hoạ`** |
| `mock_voicebot_builder` | 480, 312, 198, 24 | **giữ + nhãn** |
| `mock_qc_dashboard` | 86, 81, 34 | **giữ + nhãn** |
| `mock_analytics` | 114 / 73% / 3:25 + giá trị cột | **LOẠI** — `render()` từ chối id này |
| `mock_qc_scorecard` | 20/30/30/20% | giữ, **không cần nhãn** — trọng số tiêu chí, tức cấu hình, không phải kết quả |
| thời lượng, timestamp, trạng thái, số máy nhánh | `3:42`, `09:14`, `2:14` | giữ, không cần nhãn — đồ đạc giao diện |

Nhãn nằm ngay cạnh dải tile, **không có rule `display:none` ở bất kỳ breakpoint
nào** — hiện ở cả desktop lẫn mobile, không chỉ trong alt text. Lý do không để ở
caption đáy: trên điện thoại caption có thể cách dải số cả màn hình, và một con
số đọc như kết quả đo được thì không được cách phần đính chính một cú scroll.

`mock_analytics` **không** được thay bằng số bịa mới rồi bỏ nhãn. Thân hàm còn
nguyên trong file để chủ sở hữu quyết định xoá; không đường nào tới được nó.

**Chưa xử lý:** `mock_hero` có tile `84` / `11` / `73%` và nằm trên **homepage
đang đóng băng**. Không đụng tới — sửa nó là sửa homepage, cần chủ sở hữu quyết.

---

## 5. Media usage

`approvedMedia.approved` là allowlist, renderer fail-closed: id không có trong
danh sách thì không render. Đã **đối chiếu tự động với media manifest**
(`contract-test` mục mới):

| Kiểm | Kết quả |
| --- | --- |
| 7 id được duyệt đều `sanitization_status = PASS` | ok |
| 7 id được duyệt đều `upscaled = false` | ok |
| Không ảnh BLOCKED/REFUSED nào nằm trong allowlist | ok |
| Mọi ảnh bị giữ lại đều có mặt trong `approvedMedia.blocked` | ok — 7/7 |

**Sửa một thiếu sót của bản trước:** bản ghi `blocked` chỉ liệt kê **4** trong
**5** ảnh PII, và **không** liệt kê 2 ảnh REFUSED. Nay đủ 7: `GP-03`, `GP-08`,
`GP-09`, `GP-10`, `GP-12` là PII_BLOCKED; `GP-04` (agent-performance) và `GP-06`
(analytics-dashboard) là REFUSED — refusal không phải hàng đợi khử trùng, bản
`-v2` không mở khoá cho chúng. Enforcement vẫn là allowlist; bản ghi này là lý
do, và nay có test giữ cho nó không lệch khỏi manifest nữa.

Hai ảnh empty-state bị giới hạn theo section:

| Asset | Cho phép | Chặn ở |
| --- | --- | --- |
| `GP-14` overview-activity | `GP_DEPLOYMENT` | **`GP_FEATURES`** — đó là feature proof, và ảnh cho thấy không có chức năng nào đang dùng |
| `GP-11` integration-config | `GP_DEPLOYMENT`, `GP_INTEGRATION` | — |

Caption thống nhất: `Giao diện Gcalls — dữ liệu đã được ẩn danh`. Badge che dữ
liệu in sẵn trong ảnh vẫn còn (ba ảnh được duyệt vẫn `contains_pii = true` nhưng
`sanitization_status = PASS` — chính badge làm nên khác biệt đó, nên nó phải còn
nhìn thấy). Không upscale. Không ảnh before chứa PII trong checkpoint này.

---

## 6. Renderer parity — chạy lại toàn bộ

| Kiểm tra | Kết quả |
| --- | --- |
| 17 route × 5 breakpoint | **85/85, 0 vấn đề** |
| Contract test | **28 ok, 0 failed** (trước: 17, trong đó 1 rỗng nghĩa) |
| UNMAPPED_SOURCE product | 0 — **55 source được kiểm** |
| UNMAPPED_SOURCE content | 0 — **133 source được kiểm** (trước: 0 source) |
| Icon missing | **0** (39 key tham chiếu, 51 đăng ký) |
| CONTENT_MISSING | **0** |
| Negative: unknown source | ok |
| Negative: empty grid | ok |
| Negative: duplicate final CTA | ok — thêm test dữ liệu, không chỉ test `skip` |
| Negative: missing lead attribution | ok |
| Negative: CTA không label | ok |
| Mới: hero CTA đọc từ manifest | ok |
| Mới: final CTA tôn trọng `href` riêng | ok |
| Mới: mọi lead CTA mang `source` + `product` | ok |
| Mới: card có `href` render thành link (Node + PHP) | ok |
| Mới: media được duyệt vẫn PASS trong manifest | ok |
| php-lint / css-lint | 41 file · 8 file, 0 problem |

Bốn product page: h1 = 1, heading orphan = 0, PII = 0, fake claim = 0, không
generic grid fallback.

### Lỗi renderer đã sửa — card mất đích điều hướng

**Cả `section-contract.mjs` lẫn `class-sections.php`** đọc `title` và `body` của
card nhưng bỏ `href`. Khối *"Xem thêm"* trên các trang hub là điều hướng thuần —
mọi card có `href`, `body` rỗng — nên chúng render thành một tiêu đề trên năm
nhãn chết. Đây là lỗi sẽ ship, không phải lỗi preview.

| Route | Đích bị bỏ |
| --- | --- |
| `/giai-phap/` | 12 |
| `/tich-hop/` | 10 |
| `/san-pham/` | 8 |
| cx (`CX_BOUNDARIES`) | 5 — component `decision`, **vốn đã đúng** |
| qa-qc (`QQ_BOUNDARIES`) | 4 — component `decision`, **vốn đã đúng** |

30 đích trong `grid()` đã được nối lại ở **cả hai renderer, cùng một hình dạng
markup** (`<h3 class="gc-card__title"><a href="…">`), 9 đích còn lại vốn đã hoạt
động. Tổng 39/39 tới được. Có test giữ cả hai phía.

---

## 7. So sánh React → candidate

### 1440

| Route | sec | CTA | split | FAQ | height | worst gap |
| --- | --- | --- | --- | --- | --- | --- |
| gcalls-plus | 17 → **17** | 5 → **5** | 6 → **6** | 6 → **6** | 13 360 → 11 302 | 0 → 0 |
| cx | 19 → **19** | 6 → **6** | 5 → 6 | 6 → **6** | 13 533 → 13 322 | 0 → 0 |
| voicebot | 12 → **12** | 3 → 2 | 3 → 2 | 6 → **6** | 10 222 → 8 156 | 0 → 0 |
| qa-qc | 18 → **18** | 6 → **6** | 5 → 4 | 6 → **6** | 12 783 → 11 907 | 0 → 0 |

### 390

| Route | sec | CTA | split | height | worst gap |
| --- | --- | --- | --- | --- | --- |
| gcalls-plus | 17 → **17** | 5 → **5** | 0 → **0** | 21 465 → 16 404 | 0 → 0 |
| cx | 19 → **19** | 6 → **6** | 0 → **0** | 21 235 → 18 311 | 0 → 0 |
| voicebot | 12 → **12** | 3 → 2 | 0 → **0** | 18 054 → 13 348 | 0 → 0 |
| qa-qc | 18 → **18** | 6 → **6** | 0 → **0** | 20 087 → 16 769 | 0 → 0 |

**Section count khớp tuyệt đối 4/4 ở cả hai bề rộng. FAQ khớp 6 = 6 cả bốn.**

FAQ được so ở **mức dữ liệu** (`GP_FAQ`/`CX_FAQ`/`VB_FAQ`/`QQ_FAQ` trong React
so với `page.faq` trong manifest), không qua selector DOM — bản trước phải bỏ
hàng này vì selector `faqItems` trả 0 cho React. Item count và media count vẫn
**không so được** bằng DOM: React lồng `<li>` điều hướng vào nội dung
(React 106 vs candidate 57 trên cx là khác quy ước, không phải mất nội dung), và
`media` đếm 0 cho React trên ba trang vì React dùng element khác. Báo giới hạn
đó thay vì báo một con số trông chính xác mà không phải.

### Diễn giải chênh lệch chiều cao — không bù bằng padding

**Không thêm một dòng padding hay `min-height` nào.** Chênh lệch giải thích được
bằng inventory:

1. **Preview vẽ mockup bằng ô 16:10 phẳng, không phải bản vẽ thật của
   `class-mockups.php`.** Mọi section có visual vì thế thấp hơn thực tế. Đây là
   giới hạn của harness — chiều cao đo được là **sàn**, không phải chiều cao
   trang sẽ ship.
2. **Bản trước còn không vẽ hero visual.** PHP luôn render `hero.mockup` vào
   `.gcalls-product__hero-visual` (product.css: grid `0.82fr / 1.18fr`); preview
   không vẽ gì, nên mỗi hero hụt ~400px và bị chấm là *không có split*. Sau khi
   sửa, gcalls-plus về đúng **6/6 split**, và phần "thiếu feature split" trong
   kết luận cũ nhỏ hơn nhiều so với báo cáo.
3. **Icon: React 90 vs candidate 42** trên gcalls-plus. React rải nhiều SVG
   trang trí hơn; đó là chênh lệch mật độ trang trí, không phải nội dung.
4. **voicebot −20%** là chênh lệch thật và có lý do đã nêu: thiếu 1 CTA và 1
   split nằm trong page component React chứ không trong data. Bổ sung sẽ phải
   bịa nội dung; chọn không làm.

**PASS:** không mất nội dung (section count khớp tuyệt đối, mọi item trong
manifest đều render, 39/39 đích điều hướng tới được), hierarchy đúng (h1 = 1,
0 heading orphan), **worst gap = 0 trên toàn bộ 8 phép đo** — không có khoảng
trắng chết ở đâu cả.

---

## 8. `/bang-gia/` — MISSING_BATCH

Chi tiết: `BANG-GIA-MISSING-BATCH-SCOPE.md`. Không thuộc Core 0.10.1, **không**
đề xuất đưa vào 0.10.2 (sẽ mở rộng release ngoài Batch UI-1 đã duyệt). Đề xuất
**Batch UI-4 / Core 0.10.3**.

Điểm quan trọng nhất: `PRICING_CONFIGURED = false`, mọi money field `null`.
**Không có bảng giá nào để port** — port đúng là port trạng thái chưa có giá, 6
yếu tố chi phí và 7 câu FAQ. Không sáng tác giá, không sáng tác chính sách
thương mại.

Phát sinh, xác nhận lại trong inventory §2: **ba trong bốn product page** có link
*"Xem bảng giá Gcalls"* → `/bang-gia/`, hiện là trang trống 905px trên live. Ba
conversion path đang dẫn tới một trang rỗng.

`/uoc-tinh-chi-phi/` tiếp tục là shortcode `[gcalls_estimator]` với config
riêng; **không** ép qua content-page renderer.

---

## 9. PHP CI plan

**Không gọi PHP runtime PASS.** Máy này không có PHP (`php not found`); renderer
PHP **chưa từng chạy**. Mọi kết quả PHP trong tài liệu này là phân tích tĩnh và
lint, không phải thực thi.

Đã chuẩn bị, chưa chạy: `.github/workflows/php-renderer.yml` (PHP 8.1/8.2/8.3,
matrix `fail-fast: false`) và `wordpress/tests/renderer-test.php` — **19 điểm
assert** (bản trước ghi 20; đếm lại là 19), WordPress được stub thay vì boot, và
`get_posts()` stub **ném exception** nên "có ghi database không" được trả lời
bằng việc test chạy xong, không bằng đọc code.

Phủ: contract load · UNMAPPED_SOURCE · render 4 trang · không `<h1>` trong body
section · không generic grid · CONTENT_MISSING · unknown source · escaping
(`<script>`, `onerror=`, class breakout) · source id không lọt vào markup · CTA
attribution 4 khoá và loại khoá lạ · icon registry · zero DB write.

**Giới hạn được khai báo, không bị giấu:** manifest content-page là artifact
build của Core 0.10.1, không nằm trong repo, nên CI không kiểm được nửa đó.
Workflow đặt `GCALLS_CONTENT_PKG_OPTIONAL=1`, và ở chế độ đó test **in rõ
`SKIP … NOT CHECKED`**, không đếm là ok. Mặc định (không có biến) là **fail
cứng**, nên máy dev không thể vô tình kiểm rỗng như trước.

Không cài runtime, không đổi hạ tầng.

### Sửa kèm: hai script trỏ vào đường dẫn đã chết

`preview-sections.mjs` và `contract-test-sections.mjs` hard-code một đường dẫn
tuyệt đối vào scratchpad của **phiên làm việc trước**. Thư mục đó biến mất khi
phiên kết thúc: preview crash, còn contract test **im lặng kiểm 0 source rồi báo
"none"**. Nay cả hai dùng `lib/pkg-dir.mjs` (`$GCALLS_PKG` → `wordpress/.pkg`),
và thiếu dữ liệu là lỗi ồn ào. `wordpress/.pkg/` đã vào `.gitignore` và vào diff
gate mục "không build artifact".

Gói 0.10.1 dùng để dựng lại đã kiểm hash: `52ffe873880a3047…`, khớp file
`.sha256` đi kèm.

---

## 10. Redaction

`scripts/redact-checkpoints.mjs`, chạy lại được, idempotent — lần chạy này
**0 file thay đổi**, tức bản redact đã ổn định.

| Mã | Thay cho | Số chỗ |
| --- | --- | --- |
| `PII_USERNAME_01` | username lộ trong ảnh nguồn | 6 |
| `PII_USERNAME_02` | username thứ hai | 2 |
| `UNAPPROVED_DOMAIN_01` | domain giả trên hero | 4 |
| `FABRICATED_IDENTITY_01` | email/tên bịa trong mockup | 3 |

Incident record giữ nguyên: commit id, attachment id, hash, thời gian, gate
result, quyết định remediation đều còn đọc được.

**Hai chỗ xử lý khác:** trong `verify-media-v2.mjs` (dưới `gcalls-034/` và
`gcalls-035/`) và `build-product-media-manifest.mjs`, username là **luật phát
hiện OCR** — thay bằng mã sẽ tắt detector mà scan vẫn xanh. Ở đó chuỗi được
**mã hoá base64**: plaintext rời khỏi repo, luật vẫn khớp. File `.json` là dữ
liệu chứ không phải code nên nhận mã, không nhận biểu thức.

**Scan độc lập lần này** (quét toàn cây, loại `node_modules`/`.git`/`.pkg`, loại
chính file redactor): **0 raw hit** trên cả bốn chuỗi. Mã thay thế không tính là
failure.

---

## 11. Core / Theme release composition

`RELEASE-COMPOSITION.md`. Core từ đúng `gcalls-core-0.10.1.zip`
(`52ffe873880a3047…`, đã xác minh hash); Theme từ nhánh migration vì `theme.css`
ở đó **byte-identical với live 0.8.5** (nhánh batch2 mang 0.8.3). Không merge
nguyên nhánh header 0.9.7. Form backend không nằm trong release.

Core 0.10.2 thêm: `class-sections.php`, `class-icons.php`,
`section-components.json` (mới); sửa `class-shortcodes.php`, `class-mockups.php`,
`mockups.css`, `gcalls-core.php`; tái sinh `product-pages.json` kèm provenance.
Theme 0.8.6 thêm `gc-components.css` + một `wp_enqueue_style`; `theme.css` không
đổi một byte.

Diff gate phải chứng minh: Core ⊇ 0.10.1 · Theme ⊇ 0.8.5 · không PII originals ·
không quarantine · không checkpoint chưa redact · không build artifact chung
(nay gồm cả `wordpress/.pkg/`).

---

## 12. Gate A1

Probe ẩn danh chạy lại lúc viết, không dùng credential:

```
GET https://api.github.com/repos/…/Gcalls-website-app   → HTTP 200
GET https://github.com/…/Gcalls-website-app             → HTTP 200
"private": false
```

→ **REPOSITORY_STILL_PUBLIC.** Token `REPOSITORY_PRIVATE_CONFIRMED` chưa nhận.

Vì vậy: **không commit, không push, không upload package, không xoá remote ref,
không rewrite lịch sử.** Local preview tiếp tục. Khi chủ sở hữu gửi
`REPOSITORY_PRIVATE_CONFIRMED`, chạy lại **toàn bộ** anonymous probe trước khi
làm bước kế tiếp.

---

## 13. Protection

Không sửa live, 18 bài, corpus, homepage, Media Library, remote, lịch sử.

File tracked bị sửa trong phiên này, **chưa commit**:

| File | Thay đổi |
| --- | --- |
| `wordpress/scripts/preview-sections.mjs` | hero CTA từ manifest · hero visual · final CTA tôn trọng href · bỏ đường dẫn chết |
| `wordpress/scripts/contract-test-sections.mjs` | bỏ đường dẫn chết · bỏ pass rỗng nghĩa · +11 kiểm tra |
| `wordpress/scripts/lib/section-contract.mjs` | card href → link · export `leadHref` |
| `wordpress/scripts/lib/pkg-dir.mjs` | **mới** — phân giải vị trí package |
| `wordpress/wp-content/plugins/gcalls-core/includes/class-sections.php` | card href → link (khớp Node) |
| `wordpress/wp-content/plugins/gcalls-core/data/section-components.json` | bản ghi `blocked` đủ 7 |
| `.github/workflows/php-renderer.yml` | khai báo giới hạn CI |
| `.gitignore` | `wordpress/.pkg/` |
| `docs/content-review/gcalls-036c/*` | checkpoint này + diff gate |

Ngoài ra, từ các phiên trước và vẫn chưa commit: `class-shortcodes.php`,
`class-mockups.php`, `gcalls-core.php`, `inc/assets.php`,
`build-product-content.mjs`, `mockups.css`, `product-pages.json`.

**Dừng ở preview. Không deploy.**
