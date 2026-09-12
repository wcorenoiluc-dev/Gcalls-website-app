# CHECKPOINT GCALLS-036B — SEMANTIC RENDERER

Local/private. 2026-09-01. **Preview only. Không deploy, không push, không commit.**
Live vẫn Core 0.10.0 · Theme 0.8.5, không đụng tới.

## 13. Gate A1 state — trước tiên

Repo đo lại lúc viết: `visibility: public` → **REPOSITORY_STILL_PUBLIC**.
Token `REPOSITORY_PRIVATE_CONFIRMED` **chưa nhận**, nên 34 anonymous probes chưa
chạy lại. Không push, không deploy. Gate A2 và purge token cũng chưa nhận.
Không làm thêm backup; quarantine 035 giữ nguyên.

## 1. Route/package matrix — đã sửa

`ROUTE-PACKAGE-MATRIX.md`. Đính chính: Core 0.10.1 Batch 2 chỉ gồm sáu route
`/tich-hop/*`. `/bang-gia/` **không có manifest trong bất kỳ gói nào** — đó là
batch còn thiếu, không phải Batch 2 chưa upload. `/uoc-tinh-chi-phi/` là
shortcode estimator, không thuộc hệ section renderer. `/san-pham/`,
`/giai-phap/`, `/lien-he/` đã có từ 0.10.0.

## 2. React measurement — đã ổn định

Exit 143 lần trước là SIGTERM do chính tôi kill, không phải React lỗi.
Lần này: `npx vite --port 5174 --strictPort`, PID ghi ra file, poll đến khi
`HTTP 200` (sẵn sàng sau 3s), đo xong mới kill và xác nhận port trống.

## 3. Semantic renderer

`includes/class-sections.php` thay vòng lặp cũ trong `Shortcodes::product_page`.
Discriminator là `section.source` (product) / `section.from` (content), tra
allowlist `data/section-components.json`. **188 source được map**, 0
UNMAPPED_SOURCE. Source thô không bao giờ thành class; source lạ render rỗng và
được ghi lại, không im lặng rơi về generic grid.

## 4. Feature Split

Desktop `minmax(0,43fr) minmax(0,54fr)` → đo được **487.6px / 612.4px = 44% / 56%**
ở 1440, đúng dải brief (copy 40–44%, visual 52–56%). Mobile một cột, copy trước.
Dùng nguyên 11 mockup có sẵn trong `class-mockups.php`, không viết lại.

Splits đo được (React → candidate): gcalls-plus 6→4, cx 5→4, voicebot 3→1,
qa-qc 5→2.

## 5. CTA nhân đôi — đã sửa

Bốn source `*_FINAL_CTA` đánh dấu `skip` trong contract; `page.finalCta` render
đúng một lần. Acceptance kiểm `finalCtaCount === 1` trên mọi route trừ
`/lien-he/` (phải là 0, vì nó là đích của mọi CTA). **85/85 PASS.**

## 6. Grid

`auto-fit` bị bỏ. Số cột lấy từ `rules.gridColumnsByCount` trong contract, cả
PHP lẫn Node cùng đọc. **zeroTracks = 0** trên toàn bộ 85 phép đo (trước: 3 section
có track 0px).

## 7. Alt section

`--alt` không còn là panel bo góc có viền. Giờ là dải nền full-bleed, band liền
nhau, padding `--gc-section-pad: 50px`. `worstGap` = 0 và `gapRange` = 0–0 trên
cả React lẫn candidate. Không negative margin, không `!important`.

## 8. Icon registry

`includes/class-icons.php` **sinh tự động** từ `lucide-react@0.487.0` trong
node_modules — cùng bộ icon React dùng, từ một dependency đã pin, không phải SVG
tuỳ ý.

- Unique React icons: **73**
- Registry keys: **51**, distinct lucide icons **51**, reused mappings **0**
- Icon keys contract tham chiếu: **39**, missing: **0**
- Mọi icon `aria-hidden="true" focusable="false"`; manifest không thể truyền SVG.

Icon đo được (React → candidate): 90→33, 125→40, 66→23, 82→31. Không MISSING về
ngữ nghĩa; chênh lệch là số lượng, ghi ở mục 11.

## 9. Media verdict — bảy ảnh v1

**Đính chính GCALLS-036.** Tôi đã báo bảy ảnh này "chưa qua bất kỳ gate PII nào".
Sai — chúng đã được audit trong `docs/content-review/images/product-media-manifest.json`
(file chưa track, tôi chưa mở). Audit độc lập lần này (OCR 4× + regex +
metadata + soi mắt từng ảnh) **đồng ý với audit cũ ở cả bảy**.

| Ảnh | OCR | Soi mắt | Verdict |
| --- | --- | --- | --- |
| call-history | 19 số `09xxxxxxxx` — dãy cấp số cộng bước 137, tức sinh máy | `nhanvien.a–d`, `Khách hàng 01–19` | **PASS** |
| timeline-history | cùng dãy sinh máy | `demo.user`, `Nhóm 01–06`, hotline `1900 0000` | **PASS** |
| overview-activity | sạch | empty state, `demo.user` | **PASS** · giá trị thấp |
| agent-status-log | chỉ ngày tháng | `nhanvien.a/.b`, `demo.user` | **PASS** |
| activity-type-dropdown | sạch | `Demo Workspace` | **PASS** |
| integration-config | sạch | bảng rỗng "Không có dữ liệu" | **PASS** · giá trị thấp |
| keypad-mobile | 12 từ | bàn phím thuần, không dữ liệu | **PASS** |

Cả bảy có **nhãn in sẵn trong ảnh**: "Ảnh minh hoạ — dữ liệu đã được che".
Metadata sạch 7/7, không exif/icc/iptc/xmp. Không ảnh nào bị đưa vào repo/report.

Bảy media id tương ứng (GP-13, GP-14, GP-15, GP-07, GP-05, GP-02, GP-11) được
ghi `approved` trong contract; bốn id PII (GP-09, GP-10, GP-12, GP-03) ghi
`PII_BLOCKED`, chờ v2. Renderer fail-closed: id không nằm trong danh sách thì
không render, rơi về diagram có nhãn.

### Mockup verdict

Quét `class-mockups.php` rồi đọc lại từng chỗ khớp:

- **REFUSED_DATA**: `mock_analytics` — KPI `114` / `73%` / `3:25` và giá trị cột
  biểu đồ đều là số bịa. Không dùng ở đâu, và **không** được chọn làm thay thế
  cho `GP_PERFORMANCE` dù đó là mockup hợp chủ đề duy nhất.
- **NEEDS_OWNER_REVIEW**: `mock_hero`, `mock_cx_report`, `mock_qc_dashboard`,
  `mock_voicebot_builder` — có ô số đứng riêng (312/47, 86/81/34, 480/312/198/24).
- **ILLUSTRATIVE_MOCKUP**: 19 mockup còn lại. Phần lớn cảnh báo ban đầu là
  thời lượng cuộc gọi và mốc giờ, tức đồ đạc giao diện, không phải tuyên bố.

Sáu mockup hero 1600×900 (`analytics-dashboard`, `agent-performance`,
`customer-profile`, `call-history`, `click-to-call`, `webphone-overview`)
**không có mặt** trong candidate: renderer mới không đọc bộ đó.

Ba thay thế có nhãn, dùng mockup sạch sẵn có, khai báo rõ
`mockupSubstituted: true` trong contract: GP_OVERVIEW→`widget`,
GP_HISTORY→`call_timeline`, GP_CONTEXT→`customer_popup`.

## 10. Preview local

`scripts/preview-sections.mjs` → **17 trang**, 0 UNMAPPED_SOURCE.
Không phải renderer thứ hai: cả PHP và Node đọc **cùng một** contract cho
source→component, class modifier, icon key **và** bảng số cột. Thứ duy nhất lặp
lại là ghép chuỗi HTML.

`contract-test-sections.mjs`: **12/12 ok** — không UNMAPPED_SOURCE, icon key đủ,
hai bên xử lý cùng tập component, cả hai đọc `gridColumnsByCount` từ contract,
mọi class phát ra đều có rule trong CSS, bốn `*_FINAL_CTA` đánh dấu skip, không
`!important`.

Giới hạn phải nói rõ: máy này **không có PHP runtime**, nên contract test không
so HTML thật. Nó chứng minh hai bên không thể bất đồng về *lựa chọn*, không
chứng minh output byte-identical. Mockup trong preview là hộp thay thế có
`data-preview-stub`, không phải bản vẽ thật.

## 11. Acceptance local

`acceptance-preview.mjs`, 17 route × 5 breakpoint = **85 phép đo, 0 vấn đề**:
một H1 không rỗng, không overflow, 0 empty track, 0 heading orphan, 0 empty
section, đúng 1 final CTA (0 trên `/lien-he/` kèm 1 lead slot và **0 form control**),
không raw shortcode, 0 `.gcalls-product__grid` còn sót, không lỗi console.

### So React → candidate (1440)

| Route | sec | splits | icons | height | zeroTrk | CTA |
| --- | --- | --- | --- | --- | --- | --- |
| gcalls-plus | 17→15 | 6→4 | 90→33 | 13 360→9 941 | 0→0 | 7→3 |
| cx | 19→18 | 5→4 | 125→40 | 13 533→12 355 | 0→0 | 8→3 |
| voicebot | 12→12 | 3→1 | 66→23 | 10 222→8 075 | 0→0 | 6→2 |
| qa-qc | 18→17 | 5→2 | 82→31 | 12 783→11 090 | 0→0 | 8→3 |

## 12. DRIFT còn lại

1. **CONTENT_MISSING — 4 section bị bỏ.** `GP_BOUNDARIES`, `GP_STORY`,
   `CX_BOUNDARIES`, `QQ_BOUNDARIES` chỉ có heading, không có body trong manifest,
   trong khi React vẽ card thật ở đó. Renderer bỏ hẳn section thay vì để lại
   heading orphan, và **không** viết nội dung thay thế. Cần chạy lại exporter.
2. **Splits 11/19.** Thiếu chủ yếu ở voicebot và qa-qc, nơi React có split mà
   manifest không có mockup, và ở `GP_PERFORMANCE` (chỉ `mock_analytics` hợp chủ đề, đã REFUSED).
3. **Icon 127 vs 363.** Không thiếu về ngữ nghĩa; React rải icon trong nhiều
   danh sách hơn. Sẽ thu hẹp khi split và card tăng.
4. **CTA 11 vs 29.** React đặt CTA giữa trang; candidate mới chỉ có hero + final +
   pricing. Cần plumb attribution (`page.lead`) xuống section.
5. **Page height thấp hơn React 8–26%** — hệ quả trực tiếp của 1, 2 và 4.
6. `/bang-gia/` chưa có manifest.

## 12b. Kế hoạch Core 0.10.2 + Theme 0.8.6

**Core 0.10.2** (chưa đóng gói): `class-sections.php`, `class-icons.php`,
`data/section-components.json`, sửa `class-shortcodes.php` (bỏ vòng lặp cũ, bọc
`.gc-page--product`, require hai file mới). Batch 2 của 0.10.1 giữ nguyên.

**Theme 0.8.6**: chỉ thêm `assets/css/gc-components.css` và một enqueue.
`theme.css` 0.8.5 **không đổi một byte** — vẫn khớp live (`aea2b953…`). Rollback
= gỡ đúng một `wp_enqueue_style` và một class.

Scope CSS đã chuyển từ `body:not(.home)` sang `.gc-page` (89 selector), nên
không chạm blog, estimator hay plugin khác. Enqueue có fingerprint
`GCALLS_THEME_VERSION . '.' . filemtime()`.

## 14. Protection

Không sửa live, không sửa 18 bài, không sửa corpus, không sửa homepage, không
đụng Media Library, không đụng remote, không rewrite history. `git status`: chỉ
file mới trong `docs/`, `wordpress/scripts/`, `wordpress/wp-content/…` và ba file
tracked được sửa (`class-shortcodes.php`, `gcalls-core.php`, `inc/assets.php`).
Chưa commit — repo còn Public.

lint: `php-lint` 40 file 0 problem · `css-lint` 8 file 0 problem ·
`contract-test` 12/12 · `acceptance-preview` 85/85.
