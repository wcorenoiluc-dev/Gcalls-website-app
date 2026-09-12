# CHECKPOINT GCALLS-033-VISUAL-PREVIEW

**Trạng thái: CHƯA DEPLOY.** Không có file theo dõi nào bị sửa, không có package nào được dựng,
không có gì được tải lên host. Toàn bộ thay đổi hình ảnh trong tài liệu này tồn tại dưới dạng
preview dựng bằng Playwright trên chính markup production, cộng một stylesheet ứng viên trong
`candidate/`.

Ngày đo: 2026-08-31. Live: **Core 0.10.0**, **Theme 0.8.5**.

---

## 0. Hai việc chặn, cần chủ sở hữu quyết trước

### 0.1 `PII_REPOSITORY_EXPOSURE` — và nặng hơn dự kiến

Gate §3 yêu cầu xác định 5 ảnh PII đã push lên remote chưa. **Đã push.** Ngoài ra còn một
tình huống mà brief chưa lường tới: **4 trong 5 ảnh đang được phục vụ công khai trên website.**

**Git**

| Hạng mục | Giá trị |
| --- | --- |
| Commit | `a1832c0` — "feat: integrate approved Gcalls product imagery" |
| Remote | `https://github.com/wcorenoiluc-dev/Gcalls-website-app.git` |
| Repo | Đọc được ẩn danh — `GET /repos/...` trả **200** không cần xác thực |
| Nhánh remote chứa commit | `origin/feature/gcalls-all-pages-content`, `origin/feature/gcalls-batch2-integrations`, `origin/feature/gcalls-website-foundation`, `origin/feature/gcalls-wordpress-migration` |

Cả 5 file vẫn hiện diện ở HEAD của **cả 4** nhánh remote, tại
`public/images/products/gcalls-plus/`:

- `gcalls-plus-advanced-filter-desktop-v1.webp`
- `gcalls-plus-click-to-call-config-desktop-v1.webp`
- `gcalls-plus-contact-profile-desktop-v1.webp`
- `gcalls-plus-integrations-desktop-v1.webp`
- `gcalls-plus-webphone-desktop-v1.webp`

**Website — phơi nhiễm trực tiếp, không cần truy cập Git**

`/gcalls-plus-webphone/` render 4 trong 5 ảnh này từ WP media library. WordPress đã sinh thêm
bản resize, nên mỗi ảnh có 3 URL công khai — **12 URL**, tất cả dưới
`https://ashernguyenxuanthuy.com/wp-content/uploads/2026/08/`:

```
gcalls-plus-advanced-filter-desktop-v1{,-300x257,-768x659}.webp
gcalls-plus-contact-profile-desktop-v1{,-300x163,-768x418}.webp
gcalls-plus-integrations-desktop-v1{,-300x183,-768x469}.webp
gcalls-plus-webphone-desktop-v1{,-300x159,-768x407}.webp
```

`click-to-call-config` không được tham chiếu trên các trang đã quét; **chưa xác minh** nó có nằm
trong media library hay không — cần chủ sở hữu kiểm tra trong wp-admin.

Đây là đường rò nghiêm trọng hơn Git: không cần biết repo, chỉ cần mở trang sản phẩm.

**Theo §3, tôi đã dừng và không làm gì thêm với ảnh.** Không force-push, không rewrite history,
không xoá. Một commit xoá bình thường không gỡ PII khỏi lịch sử Git, và xoá file khỏi WP cũng
không gỡ ảnh khỏi cache/CDN hay khỏi bên đã tải về.

**Việc §4 (dựng bản `-v2`) chưa được thực hiện** — gate chặn trước đó.

**Hệ quả phát sinh trong chính phiên này:** ảnh chụp "before" của `/gcalls-plus-webphone/` do tôi
tạo cũng chứa PII đó. Tôi đã đưa 20 file ra khỏi repo, sang thư mục cách ly ngoài git
(`scratchpad/PII-QUARANTINE/`). Không file PII nào nằm trong `docs/content-review/gcalls-033/`.

**Cần chủ sở hữu quyết:** thứ tự xử lý (gỡ khỏi web trước, rồi mới tính Git), có cho phép rewrite
lịch sử 4 nhánh hay không, và có cần thông báo cho người bị lộ thông tin không.

### 0.2 Batch 2 chưa chạy được — `0.10.1` chưa được tải lên

Fingerprint live: `gcalls-core/assets/css/mockups.css?ver=**0.10.0**`,
`gcalls-theme/assets/css/theme.css?ver=**0.8.5**`.

Core vẫn là 0.10.0, nên §2 acceptance chưa có gì để nghiệm thu. Tôi đã chụp **baseline "before"**
để lần sau chỉ cần chạy vế "after":
`before/batch2-baseline-core-0.10.0.json`.

| Route | HTTP | Số từ | H1 | FAQ | CTA | Overflow 1440/1024/768/390/320 |
| --- | --- | --- | --- | --- | --- | --- |
| `/tich-hop/` | 200 | 139 | 1 | 0 | 2 | không |
| `/tich-hop/hubspot/` | 200 | 125 | 1 | 0 | 2 | không |
| `/tich-hop/salesforce/` | 200 | 125 | 1 | 0 | 2 | không |
| `/tich-hop/zoho-crm/` | 200 | 127 | 1 | 0 | 2 | không |
| `/tich-hop/freshdesk/` | 200 | 125 | 1 | 0 | 2 | không |
| `/tich-hop/zendesk/` | 200 | 125 | 1 | 0 | 2 | không |

Cả 6 là **vỏ rỗng** (125–139 từ, 0 FAQ) — đúng phần nội dung mà 0.10.1 phải lấp. Không có
raw shortcode, không ảnh hỏng, không overflow ở cả 5 breakpoint.

Rollback nếu smoke test fail: **Core 0.10.0**, giữ nguyên Theme 0.8.5.

---

## 1. Homepage — trước/sau

Đo trên markup production thật, không phải trên bản dựng lại.

| Chỉ số | Trước | Sau | Đổi |
| --- | --- | --- | --- |
| Top-level sections | 18 | **13** | khớp đúng React |
| Page height @1440 | 13.135px | **12.151px** | −984px (−7,5%) |
| Page height @390 | 22.722px | **21.305px** | −1.417px (−6,2%) |
| Khoảng cách lớn nhất @1440 | 174px | **51px** | −123px |
| Khoảng cách lớn nhất @390 | 174px | **41px** | −133px |
| Mockup giả liên tiếp | **8** | 5 | 5 còn lại đều có nhãn |
| Section dùng ảnh thật | 0 | **3** | |
| Composition lặp | 1 cụm (5 lần) | 1 cụm (5 lần) | nội dung, không phải layout |
| H1 | 1 | 1 | |
| Ảnh hỏng | 0 | 0 | |

Sau khi sửa, **mọi seam đều là 50px**: `[50,50,51,50,50,50,50,50,50,50,50,50]` (51 là làm tròn
sub-pixel). Trước đó là `[174,0,48,140,140,56,64,30,109,140,140,140,140,140,140,140,140]`.

### 1.1 Rhythm nằm ở đâu — đo trước, không đoán

Brief nói "không giữ 104px". Đo thực tế cho thấy 104px chỉ là padding của **hero**; nhịp chung
của homepage là **padding 70px/70px**, nên mỗi seam đọc ra **140px**, và seam hero→painpoints là
**174px** (104+70). Homepage không có section margin nào — khác hẳn trang sản phẩm, nơi nhịp là
`margin-bottom`.

"50px rhythm" được hiểu là **khoảng cách giữa hai composition**, đúng như cách Theme 0.8.5 đã áp
cho trang sản phẩm. Hai section liền kề mỗi bên góp một nửa: 25px + 25px = seam 50px.

Hero và CTA cuối chỉ giữ 56px ở **cạnh ngoài** (giáp header/footer); cạnh trong vẫn theo nhịp, nên
chúng không tạo ra seam 81px.

### 1.2 Regroup 18 → 13

React `HomePage.tsx` có 13 composition top-level. Elementor tách 3 trong số đó thành nhiều section
anh em. Gộp lại, **không xoá nội dung nào**, thứ tự giữ nguyên:

| # | Composition React | Elementor trước | Sau |
| --- | --- | --- | --- |
| 1 | `Hero` | 0 | 1 |
| 2 | `PainPointsSection` (chứa `LossEstimator`) | 1, 2, 3 | 1 |
| 3 | `SolutionBridgeSection` | 4 | 1 |
| 4 | `EcosystemSection` | 5, 6, 7, 8 | 1 |
| 5 | `CallTimelineSection` | 9 | 1 |
| 6 | `CRMSection` | 10 | 1 |
| 7 | `AnalyticsSection` | 11 | 1 |
| 8 | `CloudSection` | 12 | 1 |
| 9 | `CustomerPopupSection` | 13 | 1 |
| 10 | `CallWidgetSection` | 14 | 1 |
| 11 | `IntegrationCtaSection` | 15 | 1 |
| 12 | `WorkFromAnywhereSection` | 16 | 1 |
| 13 | `UseCasesFinalCtaSection` | 17 | 1 |

18 − 2 (gộp 3 thành 1) − 3 (gộp 4 thành 1) = **13**.

Bên trong một composition, các thành viên chuyển sang khoảng cách nội bộ 44px (dải 36–56px), nên
khoảng trống **bên trong** một composition không bao giờ lớn hơn khoảng trống **giữa** hai
composition — đó chính là điều làm trang trông vụn.

### 1.3 Ảnh thật và diagram

3 composition đổi từ mockup CSS sang ảnh sản phẩm thật đã PASS; 5 composition còn giữ diagram
được gắn nhãn **"Giao diện minh hoạ"**:

| # | Composition | Trước | Sau |
| --- | --- | --- | --- |
| 5 | `CallTimelineSection` | mockup CSS | **ảnh thật** `timeline-history` |
| 6 | `CRMSection` | mockup CSS | diagram + nhãn *(chờ `contact-profile-v2`)* |
| 7 | `AnalyticsSection` | mockup CSS | diagram + nhãn *(ảnh thật REFUSED)* |
| 8 | `CloudSection` | mockup CSS | diagram + nhãn |
| 9 | `CustomerPopupSection` | mockup CSS | diagram + nhãn *(chờ `contact-profile-v2`)* |
| 10 | `CallWidgetSection` | mockup CSS | diagram + nhãn |
| 11 | `IntegrationCtaSection` | mockup CSS | **ảnh thật** `integration-config` |
| 12 | `WorkFromAnywhereSection` | mockup CSS | **ảnh thật** `webphone-keypad-mobile` |

Chuỗi mockup giả liên tiếp giảm từ **8 xuống 5**, và 5 cái còn lại không còn giả làm ảnh sản phẩm
nữa vì đã có nhãn. Muốn xuống thấp hơn phải chờ `contact-profile-v2` — tức là chờ gate PII.

Ảnh đặt trong browser frame dựng bằng CSS, có `width`/`height`/`srcset`/`sizes`, lazy-load, caption
"Giao diện Gcalls — dữ liệu đã được ẩn danh". **Không ảnh nào bị phóng to quá độ phân giải gốc:**

| Ảnh | Gốc | Render @1440 | Render @390 |
| --- | --- | --- | --- |
| `timeline-history` | 809×443 | 578px | 368px |
| `integration-config` | 809×446 | 807px | 368px |
| `webphone-keypad-mobile` | 576×1092 | 298px | 298px |

Lần dựng đầu `integration-config` render ở **1178px** trên khung 809px — đã sửa bằng cách chặn
`max-width` đúng bằng chiều rộng gốc của từng ảnh.

---

## 2. Bốn trang sản phẩm — đã đạt nhịp, vấn đề nằm chỗ khác

| Trang | Sections | Height @1440 | Height @390 | Mockup liên tiếp | Ảnh thật |
| --- | --- | --- | --- | --- | --- |
| `/gcalls-plus-webphone/` | 18 | 15.552px | 17.951px | 0 | 4 ảnh **PII đang live** + 6 ảnh dựng |
| `/gcalls-cx/` | 20 | 13.412px | 18.960px | 3 | 0 |
| `/voicebot-ai/` | 13 | 10.414px | 15.693px | 1 | 0 |
| `/qc-bot-ai/` | 19 | 11.593px | 16.522px | 2 | 0 |

**Đính chính một phép đo của chính tôi.** Ban đầu tôi báo khoảng cách 112–114px trên các trang này.
Con số đó sai vì cộng cả ruột panel. Cấu trúc thật là xen kẽ:

- section trong suốt, `padding 8px`, `margin-bottom 50px`
- panel `--alt`, nền `#faf9fc`, bo 24px, `padding 56px` **mọi phía**

56px của panel là **inset ngang lẫn dọc của chính panel**, nằm trong dải 36–56px mà §5 cho phép,
không phải khoảng trắng chết giữa hai section. Khoảng cách thật giữa hai composition là
**50 + 8 = 58px**. Theme 0.8.5 đã làm đúng phần này rồi.

**Kết luận: bốn trang sản phẩm không cần đổi nhịp.** Homepage mới là chỗ lệch, và giờ đã khớp.

### 2.1 Ảnh dựng có số liệu bịa đang chạy trên hero Gcalls Plus

Hero `/gcalls-plus-webphone/` render 6 file trong
`plugins/gcalls-core/assets/images/product-gallery/`, tất cả 1600×900 (một cái 1448×1086) — lớn hơn
hẳn mức 821px của mọi ảnh chụp thật, tức chúng **không phải screenshot**.

Kiểm tra trực tiếp `agent-performance.webp` và `customer-profile.webp`: đây là **mockup marketing
dựng sẵn với số liệu bịa** — "1.248 cuộc gọi", "986 answered", "CSAT 4.7/5", tên nhân viên hư cấu
(Linh Trần, An Nguyễn, Mia Phạm…), khách hàng hư cấu (Minh Anh / Nova Education),
email `FABRICATED_IDENTITY_01`, domain `UNAPPROVED_DOMAIN_01`. Không có nhãn "Giao diện minh hoạ".

Điều này đi thẳng vào hai điều đã chốt: §1 *"không dựng số liệu như ảnh sản phẩm thật"* và §6
*"không phát sinh screenshot giả bằng AI"*. Đáng chú ý, hai trong sáu file tên đúng bằng hai chủ đề
đang **REFUSED** (`agent-performance`, `analytics-dashboard`).

Ba file `*-demo.webp` cho CX/Voicebot/QC cùng lô nhưng **hiện không được render** trên trang nào.

**Đề xuất:** thay bằng ảnh PASS ở chỗ có, còn lại vẽ lại thành diagram HTML/CSS có nhãn. Chưa làm
gì — cần chủ sở hữu xác nhận vì đây là ảnh đã nằm sẵn trên production.

### 2.2 CX, Voicebot, QA/QC — không có ảnh đúng sản phẩm

Manifest ghi `REAL_PRODUCT_MEDIA_MISSING` cho cả ba. Ba trang này hiện dùng 100% diagram, **không
mượn ảnh Gcalls Plus** — đúng §6. Giữ nguyên hướng đó, chỉ bổ sung nhãn "Giao diện minh hoạ".

---

## 3. Kiểm kê ảnh — PASS / BLOCKED / REFUSED

Nguồn: `docs/content-review/images/product-media-manifest.json`. Tất cả nguồn ≤ 821px, không upscale.

**PASS — 8 ảnh, dùng được**

| File | Kích thước | Dung lượng |
| --- | --- | --- |
| `gcalls-plus-timeline-history-desktop-v1.webp` | 809×443 | 32KB |
| `gcalls-plus-call-history-desktop-v1.webp` | 808×983 | 73KB |
| `gcalls-plus-integration-config-desktop-v1.webp` | 809×446 | 7KB |
| `gcalls-plus-overview-activity-desktop-v1.webp` | 810×450 | 10KB |
| `gcalls-plus-agent-status-log-desktop-v1.webp` | 809×295 | 11KB |
| `gcalls-plus-activity-type-dropdown-desktop-v1.webp` | 808×240 | 10KB |
| `gcalls-plus-webphone-keypad-mobile-v1.webp` | 576×1092 | 12KB |
| `gcalls-plus-webphone-active-call-mobile-v1.webp` | 553×1084 | 20KB |

Mọi ảnh đều dưới ngưỡng hero 300KB và dưới-fold 350KB, không cần nén thêm.

**BLOCKED — 5 ảnh, còn PII sau khi mask, chưa dựng `-v2`** *(gate §3 chặn)*

| File | PII còn lại |
| --- | --- |
| `gcalls-plus-contact-profile-desktop-v1.webp` | tên liên hệ, số điện thoại, email, chip `PII_USERNAME_01` |
| `gcalls-plus-webphone-desktop-v1.webp` | như trên (contact profile + keypad) |
| `gcalls-plus-integrations-desktop-v1.webp` | tên liên hệ, chip `PII_USERNAME_01` |
| `gcalls-plus-advanced-filter-desktop-v1.webp` | `PII_USERNAME_02`, avatar `H`, glyph lòi ra ngoài mask |
| `gcalls-plus-click-to-call-config-desktop-v1.webp` | tên công ty, số điện thoại, URL nội bộ |

**REFUSED — 2 ảnh, giữ nguyên quyết định**

`gcalls-plus-agent-performance.png`, `gcalls-plus-analytics-dashboard.png` — dữ liệu hiệu suất và
danh sách nhân viên thật. Thay bằng diagram có nhãn "Giao diện minh hoạ".

---

## 4. Form đăng ký — visual preview

`candidate/lead-form-preview.html` → ảnh trong `after/form/`.

**Không có `<form>`, không `action`, không `method`, không script.** Không thể gửi, không thể giả
success. Ba trạng thái (mặc định / focus / lỗi) được dựng tĩnh, nên không có input live nào tồn tại.

Trường, nhãn, danh sách `LEAD_NEEDS` và heading lấy trực tiếp từ `src/components/lead/LeadForm.tsx`
và `src/lib/leads/types.ts`.

| Yêu cầu §7 | Mục tiêu | Đo được |
| --- | --- | --- |
| Chiều cao input | 46–50px | **48px** |
| Khoảng cách trường | 16–20px | **18px** |
| Card radius | 18–24px | **20px** (18px mobile) |
| Mobile một cột | có | `1fr` @390 |
| Label luôn hiện | có | có |
| Error/focus rõ | có | viền + ring đỏ/tím |
| CTA | rõ, không nặng | 50px |

Thông tin công khai trên trang: `sales@gcalls.co` · `028 7302 5469`. Recipient nội bộ
`socialgcall@gmail.com` là cấu hình server-side và **không xuất hiện trong markup**.

**Bốn điều kiện §7 chưa cái nào được xác nhận** — PHP lead tests, capability regression,
loại `/lien-he/` khỏi OneShield full-page cache, cấu hình recipient. Form giữ nguyên trạng thái
preview cho tới khi cả bốn xanh.

---

## 5. Regression

| Kiểm tra | Kết quả |
| --- | --- |
| `verify-blog-batch-01.mjs` | **PASS** — 18 bài, 29.248 từ, 97 câu FAQ, phân bổ HUB nguyên vẹn |
| Corpus | **Không đụng tới** — `corpus-migration.json` và `wordpress/dist/` không có diff |
| Importer / Corpus Execute / Elementor importer / Homepage Layout | **Không chạy** |
| File theo dõi bị sửa | **Không có** — `git status` chỉ có file mới chưa track trong `docs/` |
| Homepage H1 | 1, trước và sau |
| Raw shortcode | Không có, cả 5 trang |
| Ảnh hỏng | 0 |
| Console | 1 lỗi 404 trên homepage, **có sẵn trong baseline**, không do việc này gây ra và chưa truy được nguồn |

---

## 6. Kế hoạch version — chưa đóng gói

| Thành phần | Hiện tại | Đề xuất | Điều kiện |
| --- | --- | --- | --- |
| Theme | 0.8.5 | **0.8.6** | chỉ khi rhythm homepage đi qua CSS theme |
| Core | 0.10.0 live / 0.10.1 chờ upload | **0.10.2** | sau khi 0.10.1 nghiệm thu xong |
| Core (form backend) | 0.9.7 trên HEAD | **không merge** | §8 |

Nhánh visual phải mang **Theme 0.8.5** hiện tại; không lấy 0.8.3 từ nhánh Batch 2. Không force-push,
không rebase, không amend commit đã push.

**Đường deploy đúng của rhythm homepage không phải CSS.** Padding homepage nằm trong dữ liệu
Elementor — `data/homepage-elementor.json` có 12 section ở `padding: 104px 0` — và Elementor phát ra
selector `.elementor-<page> .elementor-element.elementor-element-<id>`, thắng mọi selector viết tay.
Ép từ stylesheet sẽ phải dùng `!important` (đúng thứ file preview đang dùng, và là lý do nó **không**
được ship). Thay đổi nên ship là **regenerate `homepage-elementor.json`** với padding đích và các
section đã gộp. Nếu làm vậy thì Theme **không đổi** và chỉ Core lên 0.10.2.

---

## 7. Cần chủ sở hữu quyết

1. **PII** — thứ tự xử lý web trước hay Git trước; có cho rewrite lịch sử 4 nhánh không; có nghĩa vụ
   thông báo không. Kiểm tra giúp `click-to-call-config` có trong media library không.
2. **Ảnh dựng số liệu bịa** trên hero Gcalls Plus — xác nhận thay/vẽ lại.
3. **Duyệt hình ảnh** homepage before/after trong `before/` và `after/`.
4. **Upload `gcalls-core-0.10.1.zip`** để chạy Batch 2 acceptance.
5. **Chọn đường ship rhythm**: regenerate Elementor JSON (Core 0.10.2) hay CSS theme (Theme 0.8.6).

---

## Phụ lục — file

```
docs/content-review/gcalls-033/
├─ CHECKPOINT_GCALLS-033-VISUAL-PREVIEW.md
├─ candidate/
│  ├─ home-visual.css              stylesheet ứng viên (preview-only)
│  └─ lead-form-preview.html       form preview, không có input live
├─ before/
│  ├─ audit-before.json            số đo 5 trang × 1440/390
│  ├─ batch2-baseline-core-0.10.0.json
│  ├─ 1440/  home-full.png, gcalls-cx|voicebot-ai|qc-bot-ai-full.png, */
│  └─ 390/   như trên
└─ after/
   ├─ audit-after.json
   ├─ form/  lead-form-1440.png, lead-form-390.png
   ├─ 1440/  home-full.png, home-sections/s01..s13.png
   └─ 390/   home-full.png
```

Ảnh `/gcalls-plus-webphone/` **cố ý không có ở đây** — chúng chứa PII và đã được cách ly ra ngoài
repo.
