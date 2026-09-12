# CHECKPOINT GCALLS-040 — FINAL LOCAL CANDIDATE

Local/private. 2026-09-02. **Không commit. Không push. Không deploy.**

## Trạng thái

| | |
| --- | --- |
| `LOCAL_FUNCTIONAL_QA` | **PASS** — 18 route × 5 breakpoint = **90/90**, trên WordPress sạch cài từ ZIP, homepage render bằng Elementor thật |
| `VISUAL_REVIEW_PENDING_OWNER` | Ảnh desktop/mobile đã chụp và kiểm PII. **Một hạng mục cần chủ sở hữu quyết**: KPI bịa trong mockup hero (§8.1) |
| `LIVE_DEPLOYMENT_BLOCKED` | Repo vẫn Public với lịch sử PII (Gate A1) · media PII trên live vẫn công khai (Gate A2) |

Homepage đã được nghiệm thu thật, không còn là blocker. Bản 13-section trước đây
"không tồn tại ở nền nào" — nay đã được **tạo bằng generator** và chạy qua
Elementor 3.19.4 trên WordPress 6.4.10.

---

## 1. ZIP cuối và SHA-256

| | Core | Theme |
| --- | --- | --- |
| File | `gcalls-core-0.10.3.zip` | `gcalls-theme-0.8.6.zip` |
| Bytes | 446 240 | 99 021 |
| SHA-256 | `22eb0cdc72eefe437b911579dac6b58ef635141d606b3e6e4b6b2eaca8843c9e` | `3f3f8648a499f938cdd2dbf864853f34a41311766ca6123d9b5fd40fa803d26a` |
| `unzip -t` | No errors detected | No errors detected |
| Root | đúng một: `gcalls-core/` | đúng một: `gcalls-theme/` |
| Files | 39 | 25 |

Đường dẫn: `wordpress/.release-040/`. **ZIP của 039 không bị ghi đè** — vẫn ở
`wordpress/.release/` (`gcalls-core-0.10.2.zip`, `gcalls-theme-0.8.6.zip`).

Core giảm 889 048 → 446 240 byte: đúng phần sáu ảnh REFUSED rời khỏi gói.

**Theme:** nội dung **byte-identical** với artifact theme của 039 (`diff -rq`),
chỉ khác hash zip vì archive lưu mtime mới. Version giữ **0.8.6** vì theme không
đổi gì — nhịp homepage được viết trong file dữ liệu của Core, đúng như 033 đã
kết luận là nơi nên viết.

Nền: Core **đúng 0.10.1** (`52ffe873880a3047…`, hash-gated khi build) ·
Theme **đúng 0.8.5** (`theme.css` = `aea2b9536c85c017…`). Không merge nhánh
0.9.7 có form.

---

## 2. Mapping homepage 18 → 13

Nguồn: `HomePage.tsx` có 13 composition; Elementor tách 3 trong số đó thành
section anh em. Mapping này là bản đã duyệt ở
`docs/content-review/gcalls-033` §1.2 — tôi dựng lại nó bằng generator chứ
không đi tìm một file JSON chưa từng được tạo.

| # | Composition | Section cũ | Root section mới |
| --- | --- | --- | --- |
| 1 | `HeroSection` | 0 | 1 |
| 2 | `PainPointsSection` (heading + cards + `LossEstimator`) | 1, 2, 3 | 1 |
| 3 | `SolutionBridgeSection` | 4 | 1 |
| 4 | `EcosystemSection` (header + products + solutions + CTAs) | 5, 6, 7, 8 | 1 |
| 5 | `CallTimelineSection` | 9 | 1 |
| 6 | `CRMSection` | 10 | 1 |
| 7 | `AnalyticsSection` | 11 | 1 |
| 8 | `CloudSection` | 12 | 1 |
| 9 | `CustomerPopupSection` | 13 | 1 |
| 10 | `CallWidgetSection` | 14 | 1 |
| 11 | `IntegrationsSection` | 15 | 1 |
| 12 | `WorkFromAnywhereSection` | 16 | 1 |
| 13 | `UseCasesFinalCtaSection` | 17 | 1 |

18 − 2 (gộp 3 thành 1) − 3 (gộp 4 thành 1) = **13**. Mọi section cũ đều có đích
đến; **không section nào bị loại**, nên không có "lý do loại" nào phải ghi.

### Root section và nội dung bên trong

Comment cũ trong generator đổ lỗi cho "Elementor's lack of nesting". Điều đó
không đúng: Elementor **có** inner section, và inner section xếp dọc trong một
column — đúng hình dạng mà một composition bị tách cần.

Composition bị tách nay là **một root section** chứa một column, trong đó mỗi
section cũ thành một **inner section**. Đo trên trang render thật: root section
2 có **3 inner**, root section 4 có **4 inner** — tổng **7 inner section**.

**Không mất nội dung.** So khớp widget-for-widget giữa layout 18 và 13:

```
widgets before: 67   after: 67
order preserved: True
settings identical: True
```

Build fail nếu một section cũ không thuộc composition nào, bị hai composition
tranh nhau, hoặc nếu một section có background bị gộp (gộp sẽ đổi màu). Cả hai
nhóm gộp đều không có background, nên gộp là trung tính về thị giác.

### Hình học — 50px là khoảng nhìn thấy, không phải con số viết hai bên

Mục tiêu là khoảng cách **người đọc thấy** giữa hai composition. Hai section kề
nhau mỗi bên góp một nửa: **25 + 25 = seam 50px**. Viết 50 ở cả hai bên sẽ ra
100 — đúng lỗi brief cảnh báo.

Đo trên trang render thật (`.elementor-top-section`), cả 5 breakpoint:

```
home @1440: sections=13 inner=7 seams=[50,50,50,50,50,50,50,50,50,50,50,50]
home @1024: sections=13 inner=7 seams=[50,50,50,50,50,50,50,50,50,50,50,50]
home @768:  sections=13 inner=7 seams=[50,50,50,50,50,50,50,50,50,50,50,50]
home @390:  sections=13 inner=7 seams=[50,50,50,50,50,50,50,50,50,50,50,50]
home @320:  sections=13 inner=7 seams=[50,50,50,50,50,50,50,50,50,50,50,50]
```

Khoảng cách **bên trong** một composition đo được **44px** ở cả hai nhóm gộp —
nhỏ hơn seam 50px, đúng yêu cầu của 033 rằng khoảng trống bên trong không bao
giờ được lớn hơn khoảng trống giữa hai composition. Hero giữ 56px ở cạnh trên,
CTA cuối giữ 56px ở cạnh dưới (giáp header/footer).

### Các điểm bắt buộc giữ

| Yêu cầu | Đo trên trang render thật |
| --- | --- |
| Hero không clipping | **PASS** ở cả 5 breakpoint |
| Đúng một H1 | **1** |
| Hệ sinh thái 3 sản phẩm + 7 giải pháp | inner 1 = header · inner 2 = **3 card** · inner 3 = **7 card** · inner 4 = 2 CTA overview |
| Analytics/Cloud + CTA | còn nguyên; section cuối giữ CTA `?intent=demo&source=consultation` và `?intent=consultation&source=consultation` |
| Analytics dùng neutral reporting panel | `data-gcalls-mock="reporting"` — 4 hàng chỉ số toàn dấu "—", nhãn `Giao diện minh hoạ · Dữ liệu mẫu` |
| Registry chặn `mock_analytics` | `mock_analytics` và `mock_plus_gallery` bị chặn theo **tên method**, không theo id; 7 biến thể id đều không tới được |

9 mockup homepage đều render: `hero`, `call_timeline`, `crm`, `reporting`,
`cloud`, `customer_popup`, `widget`, `integrations`, `work_anywhere`.

---

## 3. Sáu asset loại khỏi package

Gate cũ "strict superset mọi file" đã được thay bằng
**FUNCTIONAL_PRESERVATION_WITH_APPROVED_REMOVALS**: mọi route, nội dung, CTA và
chức năng của 0.10.1 phải còn; chỉ sáu file dưới đây được phép biến mất.

| id | path trong plugin | SHA-256 | verdict |
| --- | --- | --- | --- |
| `webphone-overview` | `assets/images/product-gallery/webphone-overview.webp` | `1ea97958d1d26af6fc3ffda8b32b4d929b51b24dc568c9f4ff745820d705c965` | REFUSED |
| `customer-profile` | `assets/images/product-gallery/customer-profile.webp` | `926de3b7385b311bed87d758d04f0b631423b3c6a15bc7a09b29786a13cc8099` | REFUSED |
| `call-history` | `assets/images/product-gallery/call-history.webp` | `0da67896db7940b1d727e508d8183e34e0106d18f75fef95c9e006254c1bf675` | REFUSED |
| `analytics-dashboard` | `assets/images/product-gallery/analytics-dashboard.webp` | `3369ece36e9ac83449d31f44d24ed386ebecdcca9cd54bbc8db5a7bfec5767b2` | REFUSED |
| `agent-performance` | `assets/images/product-gallery/agent-performance.webp` | `6bbaf13f3e8d8360859c54e438a3f6555d0a38adbcceed6832a096d944e796ca` | REFUSED |
| `click-to-call` | `assets/images/product-gallery/click-to-call.webp` | `72b8782477a6948d276868ffd6db975bd57aa10d1bd34b07c00d79b45c557b67` | REFUSED |

**Cách loại — không dùng glob.** Mỗi file được pin bằng SHA-256; build dừng nếu
hash không khớp (nghĩa là file không phải ảnh đã duyệt). Ngoài ra build **đối
chiếu độc lập với registry**: chỉ xoá khi `media-frames.json` cũng gọi id đó là
không-PASS, và tên file trong registry khớp bảng removal. Sau khi xoá, build
kiểm mọi frame `PASS` vẫn còn file, và `lost ⊆ approved` với đúng 6 phần tử.

**Nơi tham chiếu, và xử lý:**

| Tham chiếu | Xử lý |
| --- | --- |
| `data/media-frames.json` — bản ghi registry | **Giữ**. Verdict REFUSED + provenance phải còn để fail-closed và để tra cứu. Thêm `in_package: false` để dữ liệu tự khai là không được đóng gói |
| `data/section-components.json` — ghi chú REFUSED dạng văn xuôi | Giữ (tài liệu) |
| `wordpress/scripts/qa-foundation.mjs` — assert sáu ảnh có mặt | Giữ nguyên: nó kiểm **repo**, và repo vẫn giữ bản gốc làm bằng chứng |
| `data/estimator-config.json` — chuỗi `call-history`, `click-to-call` | Không liên quan: đó là tên tính năng của estimator, không phải ảnh |
| `includes/class-mockups.php` | Không hard-code filename nào — test khẳng định điều này |

**Bằng chứng gốc, lịch sử Git và media live: không đụng tới.** Sáu file vẫn nằm
trong repo. Việc loại là loại khỏi **artifact**, và đó chính là điều ngăn chúng
bị tải bằng URL trực tiếp sau khi deploy.

**Không còn URL hỏng, tab trống hay vùng ảnh rỗng:**

- Bốn trang sản phẩm: **0 `<img>`** — chúng chưa bao giờ tham chiếu sáu ảnh này
  (gallery đã bị gỡ ở 039), nên không có khung ảnh nào trống đi.
- Scan 18 route: **0 tham chiếu** tới sáu filename.
- Gọi trực tiếp URL của ảnh đã loại → **301 về trang chủ, trả HTML, không ảnh**
  (canonical redirect của WordPress; máy chủ thật sẽ trả 404). Ba ảnh `PASS`
  vẫn **200**.

---

## 4. Ảnh WordPress thật (đã kiểm PII)

`docs/content-review/gcalls-040/screenshots/` — chụp từ Chrome thật trên site đã
cài từ ZIP, homepage do Elementor render. **Không dùng HTML harness hay preview
stub.**

| File | Nội dung |
| --- | --- |
| `home-s02.png` | Desktop — composition 2 đã gộp (heading + 6 pain card + LossEstimator) |
| `home-s04.png` | Desktop — hệ sinh thái đã gộp (3 sản phẩm + 7 giải pháp + CTA) |
| `home-s07.png` | Desktop — Analytics với neutral reporting panel |
| `home-m01.png` | Mobile 390 — hero |
| `home-m04.png` | Mobile 390 — hệ sinh thái |
| `home-m07.png` | Mobile 390 — Analytics |
| `home-m13.png` | Mobile 390 — CTA cuối |
| `rc40-home-390.png` | Mobile 390 — trang chủ |
| `rc40-gcalls-plus-webphone-390.png`, `rc40-lien-he-390.png` | Mobile 390 — sản phẩm và liên hệ |

Bộ đầy đủ 36 ảnh (`rc40-<route>-{1440,390}.png`) nằm ngoài repo vì dung lượng.

**Kiểm PII:** scan 18 route cho **0** kết quả với domain bị cấm, PII username,
danh tính bịa, tên người, email lạ và số điện thoại lạ. Chỉ xuất hiện hai chi
tiết liên hệ **của chính Gcalls** (`sales@gcalls.co`, `028 7302 5469`) — được in
ra chứ không im lặng bỏ qua, vì "không có email nào" và "chỉ có email công ty"
là hai kết quả khác nhau.

### Nhận xét bằng mắt (desktop và mobile, không suy từ DOM)

- **Phân cấp chữ**: eyebrow → H2 gradient → lead → nội dung, đọc rõ ở cả hai
  khổ. Trên mobile H2 xuống 2 dòng, không vỡ chữ.
- **Độ thoáng**: seam 50px giữa composition và 44px bên trong tạo nhịp đúng
  hướng — các phần của một composition gần nhau hơn khoảng cách giữa hai
  composition. Đây là điều layout 18-section **không** làm được, vì khi đó cả
  hai loại khoảng cách đều là một ranh giới section.
- **Tỷ lệ ảnh**: 0 ảnh raster trên homepage và trên bốn trang sản phẩm; mọi
  hình là mockup vẽ bằng HTML/CSS, co giãn theo container, không méo.
- **Lặp lại mockup**: 9 mockup khác nhau, **không id nào lặp**, và không còn
  chuỗi mockup giả liên tiếp.
- **Vị trí CTA**: hero có CTA đôi; CTA cuối nằm ở composition 13 với đủ
  attribution.
- **Nit về câu chữ (không phải lỗi an toàn)**: đoạn dẫn của Analytics vẫn viết
  "Số liệu **bên dưới** là dữ liệu minh họa…", trong khi bên dưới nay là bốn dấu
  "—". Câu không sai, chỉ thừa; nên rút gọn ở batch nội dung sau.

---

## 5. Ma trận route × breakpoint

**Danh sách URL cụ thể — 18 route.** Số phép kiểm tính từ danh sách này:
**18 × 5 = 90**. Không dùng tổng 65 của 039 làm expected value.

Canonical của Batch 2 (`/tich-hop/<vendor>/`) lấy từ bảng probe live trong
033 §, không suy đoán. Solution detail là top-level `/tong-dai-*/`.

| # | URL | Nhóm | 1440 | 1024 | 768 | 390 | 320 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `/` | homepage | PASS | PASS | PASS | PASS | PASS |
| 2 | `/gcalls-plus-webphone/` | product | PASS | PASS | PASS | PASS | PASS |
| 3 | `/gcalls-cx/` | product | PASS | PASS | PASS | PASS | PASS |
| 4 | `/voicebot-ai/` | product | PASS | PASS | PASS | PASS | PASS |
| 5 | `/qc-bot-ai/` | product | PASS | PASS | PASS | PASS | PASS |
| 6 | `/san-pham/` | batch1 overview | PASS | PASS | PASS | PASS | PASS |
| 7 | `/giai-phap/` | batch1 overview | PASS | PASS | PASS | PASS | PASS |
| 8 | `/lien-he/` | batch1 contact | PASS | PASS | PASS | PASS | PASS |
| 9 | `/tong-dai-quoc-te/` | solution detail | PASS | PASS | PASS | PASS | PASS |
| 10 | `/tong-dai-tich-hop-crm/` | solution detail | PASS | PASS | PASS | PASS | PASS |
| 11 | `/tong-dai-tich-hop-helpdesk/` | solution detail | PASS | PASS | PASS | PASS | PASS |
| 12 | `/tong-dai-tich-hop-pos/` | solution detail | PASS | PASS | PASS | PASS | PASS |
| 13 | `/tich-hop/` | batch2 | PASS | PASS | PASS | PASS | PASS |
| 14 | `/tich-hop/freshdesk/` | batch2 | PASS | PASS | PASS | PASS | PASS |
| 15 | `/tich-hop/hubspot/` | batch2 | PASS | PASS | PASS | PASS | PASS |
| 16 | `/tich-hop/salesforce/` | batch2 | PASS | PASS | PASS | PASS | PASS |
| 17 | `/tich-hop/zendesk/` | batch2 | PASS | PASS | PASS | PASS | PASS |
| 18 | `/tich-hop/zoho-crm/` | batch2 | PASS | PASS | PASS | PASS | PASS |

**90/90 PASS.** Kết quả thô: `acceptance-040.json`.

Mỗi ô kiểm: HTTP 200 · đúng một H1 không rỗng · không overflow ngang · không ảnh
hỏng · không raw shortcode · không PHP warning/fatal · không JS/console error ·
không grid track rỗng · không heading orphan · không final CTA trùng. Homepage
thêm: đúng 13 root section · hero không bị cắt.

### Các gate còn lại

| Gate | Kết quả |
| --- | --- |
| Final CTA | 16/18 route có **đúng một**. `/lien-he/` có **0** (đúng chủ ý: trang liên hệ *là* đích của CTA). Homepage dùng markup Elementor: CTA cuối nằm ở composition 13 |
| Link/CTA giữ destination + attribution | ví dụ `/lien-he/?intent=consultation&source=crm_integration&product=Zoho%20CRM&solution=Tích%20hợp%20CRM` |
| Homepage đúng inventory | inventory 13 composition = layout 13 root section; 18 section cũ được claim đúng một lần |
| Registry không cho render REFUSED | `media-frames-test.php` **29 ok, 0 failed** trên ZIP cuối |
| Package không chứa sáu asset REFUSED | **0** |
| Form backend/artifacts vắng mặt | `class-leads.php`/`lead-form.js`/`lead-form.css`/`leads-test.php` = **0** · `Leads::` = **0** · `?page=gcalls-leads` → **403** · `<form>` trên `/lien-he/` = **0** |
| wp-admin và Settings | `/wp-admin/`, Settings, Plugins, Themes, `?page=gcalls-import`, `gcalls-corpus-migration`, `gcalls-home-layout`, `?page=elementor` — tất cả **200** |
| Renderer | `renderer-test.php` **30 ok, 0 failed** — **0 DB write, 1 read** |

---

## 6. Route còn thiếu nội dung hoặc chưa nghiệm thu

| Vấn đề | Chi tiết |
| --- | --- |
| **208/238 card của content page không có đích** | Renderer xử lý `href` đúng; **dữ liệu** thiếu — cùng gốc lỗi export. Card vẫn hiển thị tiêu đề nên không fail acceptance. Cần re-export `content-pages.json`. (039 báo 128/158 trên 12 route; con số ở đây đo trên đủ 12 route content của 040) |
| **3 frame PASS không được tham chiếu** | `cx-omnichannel`, `voicebot-flow`, `qc-scoring` đã đăng ký và có file trong gói, nhưng không section nào gọi — bốn trang sản phẩm hiện không có ảnh raster nào. Tình trạng có sẵn từ trước |
| **Route ngoài phạm vi** | Blog/bài viết, `/uoc-tinh-chi-phi/`, và mọi route không nằm trong 18 URL trên **chưa được nghiệm thu** trong checkpoint này |
| **Contact form backend** | Vẫn là release riêng. `/lien-he/` hiển thị panel fail-closed ("Biểu mẫu sẽ được bật trong một bản phát hành riêng") kèm email và hotline |

---

## 7. Hướng dẫn cài và rollback

### Cài (local đã làm đúng quy trình này)

1. WordPress **6.4.10** sạch.
2. Cài **Elementor 3.19.4** (`236fd32dc550070715f18b85ad97a6317a5481c63b0777c6eb70a5145747e2e8`).
3. Cài `gcalls-core-0.10.3.zip`, kích hoạt.
4. Cài `gcalls-theme-0.8.6.zip`, kích hoạt.
5. Tạo trang chủ, đặt template **Toàn chiều rộng (Elementor)**, đặt làm Front page.
6. **Chạy guard trước khi ghi layout**: `wordpress/tests/local-only-guard.php`.
7. *Gcalls → Home Layout* → tick xác nhận → **Ghi layout vào trang chủ**.
8. Khởi động lại, kiểm version qua asset URL và plugin/theme header.

Bước 5 quan trọng: `page-templates/full-width.php` render nội dung trước rồi mới
hỏi đã có `<h1>` chưa. Không đặt template này thì `page.php` in thêm tiêu đề và
mọi route có **hai H1** — đó là lỗi fixture, không phải lỗi sản phẩm, và 039 đã
không ghi lại mình dùng template nào.

### Rollback

`wordpress/.release-040/ROLLBACK.md`. Cả hai artifact đã verify hash trong lần
chạy này:

| | Artifact | SHA-256 |
| --- | --- | --- |
| Core 0.10.0 | `~/Desktop/gcalls-core-0.10.0-release/…zip` | `929a55d6555cdd25…` ✓ |
| Theme 0.8.5 | `~/Desktop/GCALLS-026-DEPLOY/gcalls-theme-0.8.5-d8d8615.zip` | `83bc1ff8bc576020…` ✓ |

**Hoàn tác layout trang chủ TRƯỚC khi hạ plugin** — snapshot rollback nằm trong
một option của plugin. Sau đó thay file; không có migration, cron hay ghi DB nào
phải đảo ngược.

Rollback về **0.10.0**, không phải 0.10.1 (0.10.1 là nền build, chưa từng
deploy). Rollback sẽ trả lại sáu ảnh REFUSED, dashboard Analytics bịa trên
homepage, và layout 18-section.

---

## 8. Bảo vệ dữ liệu và báo cáo trung thực

### 8.1 Cần chủ sở hữu quyết — KPI bịa trong mockup hero

Đây là phát hiện đáng kể nhất của 040, và nó chỉ lộ ra vì đây là lần đầu
homepage được render thật.

Mockup `hero` in bốn ô KPI ngay trên màn hình đầu của trang chủ:

```
Cuộc gọi hôm nay = 84 · Tỷ lệ nghe máy = 73% · Thời gian TB = 5:24 · Đã chốt deal = 11
```

Đây **cùng loại** với thứ `mock_analytics` bị REFUSED ở 036B/039 §1: một tổng,
một tỷ lệ, một thời lượng trung bình và một số đếm, không có phép đo nào phía
sau. Khác biệt là hero chỉ mang caption chung `Giao diện minh họa – dữ liệu demo`,
không có câu mạnh hơn ("không phải kết quả đo được của một doanh nghiệp cụ thể")
mà `mock_analytics` từng có.

**Tôi không tự sửa.** Đây là quyết định đã có trên hồ sơ — comment trong
`mock_hero()` cho thấy các delta (+12%, +4%, −0:18) đã được cân nhắc và bỏ đi,
còn giá trị thì giữ lại có chủ ý. Sửa nó sẽ đổi bố cục hero đã duyệt và nằm
ngoài phạm vi 040. Nhưng scan sẽ **luôn báo** nó, để không checkpoint nào có thể
tuyên bố trang sạch số liệu hiệu suất trong khi không phải vậy.

Scan 18 route: **đúng 1 finding**, chính là mục này.

### 8.2 18 bài viết — **NOT VERIFIED**

Phân biệt rõ hai loại bằng chứng, đúng như §E yêu cầu:

**Fixture chứng minh renderer không ghi dữ liệu** — đã có:
`renderer-test.php` đo **0 write, 1 read**; 0 writer thực thi trong 6 file PHP
đổi/thêm; `gcalls_corpus_migration_state` **absent**; Corpus Execute **không
chạy**; site thử có **0 attachment**.

**Đối chiếu baseline thật** — **chưa đạt**:

- Ở mức markup: đã chạy `live-baseline.mjs` đối chiếu với
  `live-baseline-2026-08-30-pre-deploy.json`. Cả **18/18 bài đều HTTP 200, đúng
  một H1**, và **chỉ `body_sha256` đổi** — không bài nào đổi title, slug, hub,
  seo_title, seo_description, canonical hay robots. Kết quả:
  `live-baseline-040.json`.
- Ở mức **nội dung** (so từ, bỏ markup): **NOT VERIFIED**. Dump SQL duy nhất có
  trên máy (28-08-2026) chỉ chứa **14 dòng bảng posts và đúng 1 bài published** —
  đó không phải database của corpus. Không có nguồn sự thật nào cho phần chữ của
  18 bài ở local.

**Tôi không thay thế bằng HTTP 200 hay bằng việc đếm đủ 18 bài.** Hash markup
đổi ở cả 18 bài là *dự kiến* sau các lần deploy theme/core từ 30-08, nhưng "dự
kiến" là một khẳng định, và việc chứng minh nó cần so chữ — điều chưa làm được.

**Một lỗi thật đã sửa nhân đây:** `verify-article-text.mjs` chỉ hiểu dạng
`INSERT INTO t VALUES`, trong khi dump dùng dạng `INSERT INTO t (cols) VALUES`.
Nó đọc **0 dòng** rồi in ra *"Every published article still says exactly what
the database said."* Một test to tiếng nhất đúng lúc nó biết ít nhất. Nay nó đọc
được cả hai dạng, và **thoát với lỗi nếu không so được bài nào**.

### 8.3 Bảo vệ

Không ghi database live · không import Corpus · không chạy Corpus Execute ·
không đổi trạng thái bài viết · không xoá media live · không push · không rewrite
Git · không deploy.

Homepage Layout **chỉ** chạy trên fixture local, sau khi
`wordpress/tests/local-only-guard.php` xác nhận từng điều kiện:

```
ok  home = http://127.0.0.1:9410      ok  DB_HOST = localhost
ok  siteurl = http://127.0.0.1:9410   ok  SQLite = /wordpress/wp-content/database/.ht.sqlite
ok  published posts = 1 (fixture)     ok  attachments = 0
LOCAL FIXTURE CONFIRMED — Homepage Layout may run here.
```

Guard từ chối (exit 1) nếu host không phải loopback, nếu `DB_HOST` trỏ ra ngoài,
hoặc nếu site đang giữ nội dung thật. **Lệnh cấm chạy Homepage Layout trên live
giữ nguyên.**

### 8.4 Dependency và quyền cần nêu chính xác

- **Phiên bản Elementor của live không được ghi ở bất kỳ đâu trong repo.** Tôi
  đã tìm trong docs, config và mọi baseline đã lưu — không có. Tôi chọn
  **3.19.4** vì readme của nó ghi *Tested up to: 6.4*, khớp WordPress 6.4.10 của
  fixture (Elementor 4.x hiện tại đòi WP ≥ 6.8, không cài được). **Cần chủ sở
  hữu xác nhận phiên bản Elementor thật trên live** trước khi deploy.
- **Phiên bản WordPress của live** cũng không được ghi; fixture dùng 6.4.10 để
  nối tiếp 038/039.
- Không phát sinh yêu cầu cấp quyền mới. Truy cập SSH/1Panel vào host demo vẫn
  không có, nhưng checkpoint này không cần đến.

---

## 9. Thay đổi trong repo (chưa commit)

| File | |
| --- | --- |
| `scripts/build-homepage-template.mjs` | **§B** — `COMPOSITIONS` 18→13, inner section, seam 25/25 + edge 56, inventory suy ra từ mapping + `mergedFrom` |
| `data/homepage-elementor.json` | 13 root section, 7 inner, 67 widget không đổi |
| `data/homepage-inventory.json` | 13 composition, mỗi mục ghi `mergedFrom` |
| `data/media-frames.json` | thêm `in_package` |
| `wordpress/scripts/build-040-release.mjs` | **mới** — `APPROVED_REMOVALS` pin bằng SHA-256, gate FUNCTIONAL_PRESERVATION |
| `wordpress/scripts/accept-040.mjs` | **mới** — 18 route × 5 breakpoint, đo seam/inner/hero |
| `wordpress/scripts/scan-040.mjs` | **mới** — chrome-scoped, báo KPI tile, cho phép `example.com` |
| `wordpress/scripts/verify-article-text.mjs` | sửa parse `INSERT (cols) VALUES`, bỏ pass rỗng |
| `wordpress/tests/local-only-guard.php` | **mới** — §A.2 |
| `wordpress/tests/media-frames-test.php` | 19 → **29 assertion** |
| `docs/content-review/gcalls-040/` | checkpoint này, ảnh, JSON kết quả |

Artifact build ở `wordpress/.release-040/` (gitignore, không commit).

**Dừng ở candidate và ảnh duyệt.** Website **chưa** hoàn tất: form backend và
các route ngoài 18 URL trên vẫn chưa xong.
