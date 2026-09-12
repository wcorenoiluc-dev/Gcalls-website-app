# GCALLS-036 — React → WordPress component map

Đo trực tiếp 2026-09-01, không suy đoán: React trên `localhost:5173`, WordPress
trên `ashernguyenxuanthuy.com` (Core 0.10.0 · Theme 0.8.5), cùng viewport 1440 và
390, cùng script `scripts/ui-section-inventory.mjs`. Dữ liệu thô:
`inventory/section-inventory.json`.

## 0. Kết luận một dòng

Nội dung đã sang WordPress gần như đủ; **hệ thống component thì chưa sang**.
WordPress render 14 section khác nhau về ý nghĩa bằng **đúng một** class
`gcalls-product__section` và **đúng một** `.gcalls-product__grid`, không icon,
không feature split, không diagram. Đó chính là "generic card wall" mà brief cấm.

## 1. Bằng chứng đo được

### 1.1 Section count và chiều cao, 1440

| Route | React sec | WP sec | React h | WP h | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| `/gcalls-plus-webphone/` | 17 | 18 | 13 360 | 15 552 | WP +1 = section CTA trùng lặp |
| `/gcalls-cx/` | 19 | 20 | 13 533 | 13 412 | như trên |
| `/voicebot-ai/` | 12 | 13 | 10 222 | 10 414 | như trên |
| `/qc-bot-ai/` | 18 | 19 | 12 783 | 11 593 | như trên |
| `/san-pham/` | 6 | 5 | 4 916 | 2 560 | Batch 2 chưa lên live |
| `/giai-phap/` | 6 | 5 | 4 671 | 3 227 | như trên |
| `/tich-hop/` | 6 | **0** | 4 773 | **1 011** | vỏ rỗng |
| `/lien-he/` | 3 | 2 | 2 798 | 1 019 | vỏ rỗng |
| `/bang-gia/` | 10 | **0** | 8 869 | **905** | vỏ rỗng |
| `/uoc-tinh-chi-phi/` | 7 | 1 | 5 197 | 3 682 | chỉ có estimator |

Sáu route cuối vẫn là Core 0.10.0 nên **không thể lấy làm "before" cho UI work**;
chúng trống vì Batch 2 nằm trong 0.10.1 chưa upload, không phải vì lỗi giao diện.

### 1.2 Grid — WordPress có đúng một loại

Trên `/gcalls-plus-webphone/` 1440:

| | React | WordPress |
| --- | --- | --- |
| Số grid trên trang | 22 | 9 |
| Loại grid | 2-col split 580/580 gap 56 · card 2/3/4 cột · grid lồng cho diagram | **chỉ** `.gcalls-product__grid` |
| Card padding | 24px (một chỗ 32px) | 28px, mọi nơi |
| Card radius | 14px | 14px |
| Gap | 20px card, 56px split | 20px, mọi nơi |
| SVG icon trong card/split | 1–6 mỗi khối | **0** |

WordPress còn sinh **track rỗng**: section 2 là `345px ×4 + 0px`, section 6 và 8 là
`466px ×3 + 0px + 0px`. Track 0px là khoảng trắng chết do `repeat(auto-fill)`.

### 1.3 Icon — thiếu toàn bộ

Tổng SVG ≥12px trên `/gcalls-plus-webphone/`: React **69**, WordPress **0**.
Trên `/gcalls-cx/`: React 68, WordPress 1. Đây là khác biệt thị giác lớn nhất.

### 1.4 Feature split — thiếu toàn bộ trên trang chính

Số section bố cục hai cột thực sự:

| Route | React | WP |
| --- | --- | --- |
| `/gcalls-plus-webphone/` | 3 | **0** |
| `/gcalls-cx/` | 5 | 3 |
| `/voicebot-ai/` | 2 | **0** |
| `/qc-bot-ai/` | 2 | 1 |

### 1.5 Padding dọc — WordPress dùng sáu giá trị khác nhau

| Wrapper | WP padding | React |
| --- | --- | --- |
| `__hero` | 72 / 72 | 128 / 96 |
| `__direct` | 40 / 40 | 96 / 96 |
| `__section` | **8 / 8** | 96 / 96 |
| `__section--alt` | 56 / 56 | 96 / 96 |
| `__faq` | **0 / 0** | 96 / 96 |
| `__final` | 64 / 64 | 96 / 96 |

Section thường và section `--alt` xen kẽ nhau, nên padding nhảy 8 → 56 → 8 → 56
suốt trang, cộng thêm seam 50px giữa các band. Dải màu `--alt` vì thế nổi lên như
những hộp rời, không phải nhịp. Token brief (50px đều, band liền nhau) sửa đúng chỗ này.

### 1.6 CTA section bị render hai lần

Trên cả bốn product route, heading của final CTA xuất hiện **hai lần**:

| Route | Lần 1 | Lần 2 |
| --- | --- | --- |
| `/gcalls-plus-webphone/` | W15 `__section--alt`, 203 ký tự, **0 CTA** | W17 `__final`, 214 ký tự, 2 CTA |
| `/gcalls-cx/` | W17, 0 CTA | W19, 2 CTA |
| `/voicebot-ai/` | W10, 0 CTA | W12, 1 CTA |
| `/qc-bot-ai/` | W16, 0 CTA | W18, 2 CTA |

Lần 1 là **heading orphan** — có tiêu đề và lead, không nút, không nội dung.
Đây là +1 section so với React và vi phạm hai mục acceptance ("không empty
section", "không heading orphan").

### 1.7 Ảnh

`/gcalls-plus-webphone/` WordPress dùng **11 ảnh `-v1`** trong nội dung, cộng
**6 ảnh hero** 1600×900.

- 4 trong 11 là ảnh PII đã có bản v2 chờ thay: webphone (W3), contact-profile (W6),
  integrations (W9), advanced-filter (W10).
- **7 ảnh `-v1` còn lại chưa qua gate PII nào** và chưa có bản v2:
  `webphone-keypad-mobile`, `overview-activity`, `timeline-history`,
  `call-history`, `agent-status-log`, `activity-type-dropdown`,
  `integration-config`. `call-history` đáng ngờ nhất vì cùng chủ đề với các ảnh
  đã bị kết luận là lộ danh sách cuộc gọi.
- 6 ảnh hero là bộ mockup dựng 1600×900, trong đó có `analytics-dashboard.webp`
  và `agent-performance.webp` — đúng hai chủ đề đã bị REFUSED — cộng
  `customer-profile`, `call-history`, `click-to-call`, `webphone-overview`.
  Chỉ ảnh đầu hiển thị; năm ảnh còn lại `naturalWidth=0`, `rendered=0`.

React chỉ dùng **6 ảnh**, tất cả `-v1` full-size, không srcset.

### 1.8 Những thứ WordPress đang làm ĐÚNG

Không phải chỗ nào cũng hỏng, và những chỗ này phải giữ:

- `srcset` + `width`/`height` + `loading=lazy` trên cả 11 ảnh nội dung — React **không** có.
- Đúng một `<h1>` trên cả 20 lượt đo.
- Không overflow ngang ở cả 1440 và 390, cả 10 route.
- Không raw shortcode, không ảnh vỡ, không lỗi console (trừ 1 lỗi trên gcalls-plus).
- Seam giữa section = 50px, ổn định.
- Thứ tự section trùng React từ đầu đến trước FAQ.

## 2. Bản đồ component

Cột **Visual state**: PASS = đã đúng; DRIFT = có nhưng lệch; MISSING = chưa có.

| # | React component | React source | Data shape | WP renderer | CSS component | Routes | Visual state | Responsive | Media | Accessibility | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `GcallsPlusHero` / `*Hero` | `src/components/gcalls-plus/GcallsPlusHero.tsx` | `page.hero{eyebrow,h1,lead,points[],cta[],visual}` | `Shortcodes::product_page` → `.gcalls-product__hero` | `gc-hero` | 4 product | **DRIFT** — WP 72/72 vs React 128/96; WP mất 2-col split; WP nhồi 6 mockup 1600×900 | 1 cột <1024 | 6 mockup dựng, phải loại | `<h1>` duy nhất ✓, alt cần viết lại | DRIFT |
| 2 | Trust/Context bar | `src/components/home/*` (chưa dùng ở product) | `trust[]{label,value}` | — | `gc-trustbar` | — | **MISSING** | — | icon | — | MISSING |
| 3 | `DirectAnswer` | `src/components/common/primitives.tsx` + page | `page.direct{q,a}` | `.gcalls-product__direct` | `gc-direct` | 4 product | **DRIFT** — WP 40/40 padding, 226px cao vs React 520px; mất icon | reading width | — | cần `aria-labelledby` | DRIFT |
| 4 | Product/Solution grid | `src/components/hub/*` | `items[]{title,desc,href,icon}` | `.gcalls-product__grid` | `gc-cardgrid` | hub routes | **DRIFT** — 1 grid cho mọi thứ, có track 0px | auto-fill → 1 cột 390 | icon | link cần text rõ | DRIFT |
| 5 | `FeatureSplit` | `src/components/common/FeatureSplit.tsx` | `{eyebrow,title,lead,points[],visual,reverse}` | — | `gc-split` | 4 product + solutions | **MISSING** — 0/3 trên gcalls-plus, 0/2 voicebot | `grid-cols-1 lg:grid-cols-2`, gap 40→56 | ảnh v2 hoặc diagram | checklist `<ul>`, icon `aria-hidden` | MISSING |
| 6 | `ProductScreenshot` | `src/components/common/ProductScreenshot.tsx` | `{mediaId,alt,caption}` | `Shortcodes::media` | `gc-shot` | gcalls-plus | **DRIFT** — WP hơn React (có srcset/w/h/lazy) nhưng đang trỏ ảnh PII v1 | srcset đủ | **chỉ `-v2` đã PASS** | caption bắt buộc | DRIFT |
| 7 | Illustrated diagram | `src/components/product-ui/`, grid lồng trong `InteractionHistory`/`PerformanceSection` | `{rows[],cols[]}` | `Mockups::render` | `gc-diagram` | cx, voicebot, qa-qc | **DRIFT** — WP có `class-mockups.php` nhưng không được gọi trên 4 route đo | co giãn, scroll ngang nếu cần | không ảnh | cần nhãn `Giao diện minh hoạ` | DRIFT |
| 8 | Benefits grid | `src/components/gcalls-plus/*` | `items[]{title,desc,icon}` | `.gcalls-product__grid` | `gc-benefits` | mọi product | **DRIFT** — cùng một card cho benefit, feature, use case | 3→2→1 cột | icon | H3 trong card | DRIFT |
| 9 | `WorkflowSection` (process) | `src/components/gcalls-plus/WorkflowSection.tsx` | `steps[]{n,title,desc}` | `.gcalls-product__grid` | `gc-steps` | 4 product | **DRIFT** — render thành card, mất số thứ tự và đường nối | ngang → dọc ở 768 | icon số | `<ol>` | DRIFT |
| 10 | `IntegrationSection` | `src/components/gcalls-plus/IntegrationSection.tsx` | `vendors[]{name,logo,href}` | `.gcalls-product__grid` | `gc-vendors` | gcalls-plus, tich-hop | **DRIFT** — thành card chữ, không logo | 5→3→2 cột | logo vendor | alt = tên vendor | DRIFT |
| 11 | Comparison table | `src/components/pricing/*` | `rows[]{feature,plans[]}` | — | `gc-compare` | bang-gia | **MISSING** | scroll ngang <768 | — | `<table>` + `<th scope>` | MISSING |
| 12 | `UseCases` | `src/components/gcalls-plus/UseCases.tsx` | `cases[]{title,desc,industry}` | `.gcalls-product__grid` | `gc-usecases` | 4 product | **DRIFT** — không phân biệt được với benefits | 4→2→1 | icon ngành | — | DRIFT |
| 13 | `FaqAccordion` | `src/components/common/FaqAccordion.tsx` | `faq[]{q,a}` | `Faq::render` → `.gcalls-product__faq` | `gc-faq` | mọi route | **DRIFT** — WP padding 0/0, mất icon mở/đóng | reading width | — | `<details>`/`aria-expanded`, focus thấy được | DRIFT |
| 14 | `FinalCtaBand` | `src/components/common/FinalCtaBand.tsx` | `finalCta{title,lead,cta[]}` | `.gcalls-product__final` | `gc-cta` | mọi route | **DRIFT** — bị render **hai lần**, bản đầu 0 CTA | nút xuống dòng ở 390 | — | nút là `<a>` có text rõ | DRIFT |
| 15 | Lead form slot | `src/components/lead/*` | `lead{title,lead,fields}` | `Shortcodes::lead_form` | `gc-leadslot` | lien-he + CTA | **DRIFT** — hiện là heading orphan (mục 1.6); phải thành contact card tĩnh | 1 cột | — | không giả khả năng submit | DRIFT |
| 16 | Related navigation | `src/components/navigation/*` | `related[]{title,href}` | — | `gc-related` | mọi route | **MISSING** | 3→1 cột | — | `<nav aria-label>` | MISSING |

Tổng: **4 MISSING**, **12 DRIFT**, **0 PASS**.

## 3. Thứ tự sửa, theo mức độ đổi hình

1. **Icon system** — 0 → ~69 icon/trang. Đổi nhiều nhất, rẻ nhất (inline SVG sprite trong theme).
2. **`gc-split`** — dựng Feature Split, chuyển 3–5 section/trang từ card sang hai cột.
3. **Chuẩn hoá padding** — 6 giá trị → 1 token 50px, band liền nhau.
4. **Tách `gc-cardgrid` thành 5 biến thể** theo ý nghĩa (benefits/steps/vendors/usecases/product) thay vì một `.gcalls-product__grid`.
5. **Bỏ section CTA trùng lặp** — xoá heading orphan.
6. **Ảnh** — thay 4 ảnh PII bằng v2; đưa 7 ảnh v1 còn lại qua gate hoặc thay bằng diagram; gỡ 6 mockup hero.
7. **Track rỗng** — bỏ `auto-fill`, dùng số cột tường minh theo số phần tử.

## 4. Chưa xác minh được trong phiên này

- Sáu route Batch 2 (`san-pham`, `giai-phap`, `tich-hop`, `lien-he`, `bang-gia`,
  `uoc-tinh-chi-phi`) — live vẫn 0.10.0 nên "before" không dùng được. Cần dựng WordPress
  local hoặc upload 0.10.1 mới so được.
- Batch UI-2 và UI-3 chưa đo.
- Screenshot before/after: chưa chụp. Ảnh before của `/gcalls-plus-webphone/`
  sẽ chứa PII nên phải nằm ngoài repo, trong `PII-QUARANTINE-035/`.
