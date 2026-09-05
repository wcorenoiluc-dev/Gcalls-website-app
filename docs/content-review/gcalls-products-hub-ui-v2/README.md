# GCALLS UI V2 — Products hub `/san-pham/`

- Nhánh: `feature/gcalls-products-hub-ui-v2`
- Worktree: `/Users/macos/Desktop/Gcalls/App/Gcalls-products-hub-ui-v2`
- Base SHA (immutable): `9c562e7278f3acfe832e4244d6ca81aaaf5d0a04`
- Chưa push, chưa deploy, không port WordPress.

---

## 0. Một quyết định của chủ sở hữu đã thay đổi phạm vi

Brief yêu cầu **đúng ba sản phẩm** và gate phải fail nếu `PRODUCTS_HUB` bị thay
đổi. Nhưng tại base SHA, `PRODUCTS_HUB` có **bốn** product card — Gcalls Voicebot
AI được thêm ở `b26db78` — và **năm chuỗi copy** viết cứng "bốn sản phẩm":

| Trường | Trước |
|---|---|
| `hero.description` | "Gcalls có **bốn** sản phẩm phục vụ **bốn** bài toán…" |
| `directAnswer.answer` | "Gcalls có **bốn** sản phẩm: … **Bốn** sản phẩm giải quyết…" |
| `cards.eyebrow` | "**BỐN SẢN PHẨM**" |
| `cards.note` | "**Bốn** sản phẩm có thể dùng độc lập…" |
| `decisionGuide.h2` | "Ranh giới giữa **bốn** sản phẩm" |

`decisionGuide` cũng có **5 dòng** (4 sản phẩm + tích hợp), không phải "bốn bài
toán" như brief mô tả. Đạt 3 sản phẩm mà không sửa `hubs.ts` là **không thể**:
lọc card ở tầng component sẽ để trang tự mâu thuẫn (5 chỗ vẫn nói "bốn" bên cạnh
3 card) và làm mất một trường của `PRODUCTS_HUB`.

**Chủ sở hữu đã chọn: sửa `PRODUCTS_HUB` về ba sản phẩm.** Đây là override có
chủ đích đối với quy tắc "không sửa `hubs.ts`" và "không viết lại copy", giới hạn
trong `PRODUCTS_HUB`.

### Đã sửa những gì

- 5 chuỗi "bốn" → "ba" (thay đổi số đếm tối thiểu, không thêm claim mới)
- `directAnswer.answer`: bỏ mệnh đề Voicebot
- `hero.description`: bỏ "và tự động hóa các cuộc gọi lặp lại"
- `cards.items`: bỏ card "Gcalls Voicebot AI" (4 → 3)
- `decisionGuide.rows`: bỏ dòng Voicebot (5 → 4)
- docstring phía trên `PRODUCTS_HUB`: ghi lại lý do và ngày

### Đã chứng minh phạm vi

Băm SHA-256 từng hub khác **trước và sau** khi sửa:

| Hub | Trước | Sau | |
|---|---|---|---|
| `SOLUTIONS_HUB` | `faf1ed4ec32c30ae` | `faf1ed4ec32c30ae` | IDENTICAL |
| `INTEGRATIONS_HUB` | `0f91cc1b70f05254` | `0f91cc1b70f05254` | IDENTICAL |
| `INDUSTRIES_HUB` | `2520886e30a54a57` | `2520886e30a54a57` | IDENTICAL |
| `RESOURCES_HUB` | `12b683272b14d357` | `12b683272b14d357` | IDENTICAL |
| `COMPANY_HUB` | `a6da9f1f6525cf03` | `a6da9f1f6525cf03` | IDENTICAL |

Gate `verify-products-hub.mjs` assert lại 5 băm này mỗi lần chạy.

### Việc còn treo (KHÔNG làm ở checkpoint này)

`SOLUTIONS_HUB` **chưa có** card Voicebot. Route `/voicebot-ai/` vẫn tồn tại và
vẫn vào được từ header, nên không có gì bị mồ côi — nhưng cho tới khi thêm một
card Voicebot vào hub giải pháp, Voicebot không có card ở hub nào. Sửa việc đó
đòi viết copy đã duyệt cho **một hub khác**, ngoài phạm vi checkpoint này.

---

## 1. Content-field reconciliation

Trang render **toàn bộ 42 chuỗi** mà `PRODUCTS_HUB` khai báo — gate đối chiếu
tự động, không phải kiểm tay.

| # | Khối | Trường | Render |
|---|---|---|---|
| 1 | Breadcrumb | `breadcrumbLabel` | ✓ |
| 2 | Hero | `hero.eyebrow`, `h1`, `description`, `primaryCta`, `secondaryCta` | ✓ |
| 3 | Direct answer | `directAnswer.eyebrow`, `question`, `answer` | ✓ |
| 4 | Product cards | `cards.eyebrow`, `h2`, `items[3]` (title, supportingLabel, detail, points, path, cta) | ✓ |
| 5 | Ghi chú quan hệ | `cards.note` | ✓ |
| 6 | Decision guide | `decisionGuide.eyebrow`, `h2`, `lead`, `rows[4]` | ✓ |
| 7 | Onward links | `links.h2`, `items[5]` | ✓ |
| 8 | Final CTA | `finalCta.eyebrow`, `h2`, `description`, 2 CTA | ✓ |

`cards.lead` và `decisionGuide.note` là optional và không tồn tại trong
`PRODUCTS_HUB` — layout xử lý cả hai trường hợp.

**Một H1 duy nhất**, đúng chuỗi yêu cầu:
*"Hệ sinh thái sản phẩm Gcalls cho đội Sales, CSKH và QA"*.

---

## 2. Taxonomy test

| Assertion | Kết quả |
|---|---|
| `PRODUCTS_HUB` khai báo đúng 3 product card | PASS |
| Trang render đúng 3 product card | PASS |
| Ba route đúng: `/gcalls-plus-webphone/`, `/qc-bot-ai/`, `/gcalls-cx/` | PASS |
| Không sản phẩm nào xuất hiện hai lần | PASS |
| Không có Voicebot trong product card (DOM) | PASS |
| Không có card Voicebot trong dữ liệu | PASS |
| Không có dòng Voicebot trong decision guide | PASS |
| Mọi product card có đường dẫn trang con | PASS |
| Vẫn đúng 3 card ở cả 6 breakpoint | PASS |
| Năm hub còn lại byte-identical | PASS |

---

## 3. Product / media mapping

Media ánh xạ theo **route**, không theo vị trí mảng hay tiêu đề — đổi tên hoặc
đổi thứ tự card không thể lặng lẽ gán ảnh của sản phẩm này cho sản phẩm khác.

| Sản phẩm | Media | Loại | Nhãn | Phân biệt |
|---|---|---|---|---|
| Gcalls Plus Webphone | webphone workspace thật, đã che | **capture thật** | "Ảnh chụp thật, dữ liệu khách hàng đã được che vĩnh viễn" | nghe gọi |
| QA QC Center | Audio → Transcript → Bộ tiêu chí → Human review | diagram trung tính | **"Sơ đồ quy trình minh họa"** | kiểm soát chất lượng |
| Gcalls CX | 4 kênh → một hàng đợi hội thoại | diagram trung tính | **"Sơ đồ quy trình minh họa"** | giao tiếp đa kênh |

Băm nguồn: xem `media-hashes.md`.

- Chọn `webphone-desktop` chứ **không** dùng `overview-activity`: ảnh sau là
  empty-state, brief cấm dùng empty-state khi đã có capture mạnh hơn.
- Không có KPI, không có dữ liệu cá nhân, không hotlink, không upscale.
- Gate assert **không hai card nào dùng chung visual** (so chữ ký DOM).
- Không có visual Voicebot trên trang.

### Vì sao CX là slot trung tính

Tại base SHA **không có** asset CX sanitized nào được commit.
`docs/screenshots/gcalls-cx/` là ảnh chụp **website** (full.webp là 1440×13533 —
đúng bằng chiều cao trang CX), không phải ảnh sản phẩm. Checkpoint CX đang chạy
ở worktree khác và brief cấm đọc file chưa commit của worker khác, nên slot này
giữ diagram trung tính cho tới khi có asset kèm băm.
→ `PRODUCTS_HUB_CX_MEDIA_PENDING`

### Vì sao QA/QC là diagram

Image master map ghi route này `PRODUCT_SCREENSHOT_REQUIRED / NOT DELIVERED`.
Diagram không có điểm số, mã cuộc gọi hay hội thoại nào.
→ `PRODUCTS_HUB_QA_REAL_MEDIA_REQUIRED`

---

## 4. UI

| Hạng mục | Trước | Sau |
|---|---|---|
| Container | 1280px | **1180px** (chỉ trong `.ph-page`) |
| Seam giữa composition | 192px @1440 | **50px** (25px mỗi bên) |
| Hero | copy full-width, không visual | **44% copy / 56% ba product tile** |
| Product card | chỉ chữ, không media | **media riêng + tên + supporting label + mô tả + 3 điểm + CTA** |
| Decision guide | card 2 cột, problem + reason | **Bài toán → Lớp cần giải quyết → Trang nên xem** |

- Hero không có dashboard, không KPI, không floating card.
- Desktop 3 cột; tablet 2 cột với card thứ ba **căn giữa và span cả hai track**
  nên không để lại track rỗng; mobile 1 cột.
- Card cùng hàng bằng chiều cao — assert ở cả 6 breakpoint.
- Một link duy nhất trong mỗi card → **không nested link**; mỗi CTA có
  `aria-label` riêng ("Xem Gcalls CX — Gcalls CX").
- Final CTA đúng **một** lần.
- Dòng "Giải pháp tích hợp" trong guide được phân biệt rõ: viền nét đứt, nền
  khác, và cột giữa đổi tiêu đề thành **"KHÔNG PHẢI CHỌN SẢN PHẨM"** — nên không
  đọc thành sản phẩm thứ tư.

### `ProductsHubLayout` page-local

`HubLayout` phục vụ sáu hub, nên **không bị sửa**. Hub sản phẩm cần media slot
mỗi card, hero dạng tile và guide ba cột — những thứ năm hub kia không được
nhận. Layout mới không chứa một chuỗi text nào; mọi copy đọc từ `HubContent`.

---

## 5. Before / after

| Breakpoint | Trước | Sau | Chênh |
|---|---|---|---|
| 1440 | 4 916px | **3 996px** | −920px (−18.7%) |
| 1280 | 4 916px | **3 996px** | −920px (−18.7%) |
| 1024 | 5 346px | **4 370px** | −976px (−18.3%) |
| 768 | 6 070px | **5 412px** | −658px (−10.8%) |
| 390 | 8 126px | **8 011px** | −115px (−1.4%) |
| 320 | 8 790px | **8 518px** | −272px (−3.1%) |

Trang thấp hơn **dù đã thêm ba media slot và một hero visual** — nhịp 50px và
container 1180px bù lại nhiều hơn phần media chiếm.

---

## 6. Gate

`node scripts/verify-products-hub.mjs` → **101 passed / 0 failed**.

Bao gồm: 3 product card · Voicebot vắng mặt ở cả DOM lẫn dữ liệu · 1 H1 đúng
chuỗi · 0 fabricated KPI (count/%/năm kinh nghiệm/uptime/đối tác/giá) · 0 PII ·
0 broken image · 0 upscale · 0 overflow · 0 empty grid track · 0 heading orphan ·
0 `href="#"` · **mọi internal href được điều hướng thật và phải trả về trang
không-404** · 42/42 chuỗi `PRODUCTS_HUB` được render · 5 hub khác byte-identical ·
container 1180 · seam 25/25 · card cùng hàng bằng chiều cao · tap target ≥44px ·
6 breakpoint.

`typecheck` / `test` / `lint` / `build`: PASS.
Lint giữ nguyên **6 warning** như base (đã tách `productVisuals.tsx` khỏi
`productMedia.tsx` để không thêm warning mới).

### Regression — `regression-report.txt`

| Route | Kết quả |
|---|---|
| `/` · `/giai-phap/` · `/tich-hop/` · `/nganh/` · `/tai-nguyen/` · `/cong-ty/` | IDENTICAL |
| `/gcalls-plus-webphone/` · `/qc-bot-ai/` · `/gcalls-cx/` | IDENTICAL |
| `/san-pham/` | CHANGED — trong phạm vi |

**Unexpected route changes: 0.**

---

## 7. Ghi chú ngoài phạm vi

`/favicon.ico` trả 404 trên mọi route (không có icon trong `index.html` và
`public/`). Thiếu sót toàn site.

---

## 8. Tín hiệu

- `PRODUCTS_HUB_CONTENT_PASS`
- `PRODUCTS_HUB_TAXONOMY_3_PASS`
- `PRODUCTS_HUB_VOICEBOT_SOLUTION_ONLY`
- `PRODUCTS_HUB_PII_ZERO`
- `PRODUCTS_HUB_FABRICATED_DATA_ZERO`
- `PRODUCTS_HUB_UI_LOCAL_PASS`
- `PRODUCTS_HUB_MEDIA_REVIEW_PENDING_OWNER`
- `PRODUCTS_HUB_CX_MEDIA_PENDING`
- `PRODUCTS_HUB_QA_REAL_MEDIA_REQUIRED`

## Nội dung thư mục

- `README.md` — checkpoint này (§0 quyết định taxonomy, §1 reconciliation, §2 taxonomy test, §3 media mapping)
- `media-hashes.md` — băm nguồn của từng media slot
- `preview/` — 6 full-page, hero desktop/mobile, crop 3 product card, crop decision guide, `metrics.json`
- `regression-report.txt` — so sánh 10 route với base SHA
- `verify-output.txt` — kết quả gate
- `file-diff.txt` — diffstat + file mới + full diff
