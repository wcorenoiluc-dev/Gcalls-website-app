# GCALLS PRODUCT UI V2 — Step 2: `/qc-bot-ai/` (QA QC Center)

- Nhánh: `feature/gcalls-qaqc-ui-v2`
- Worktree: `/Users/macos/Desktop/Gcalls/App/gcalls-qaqc-ui-v2`
- **Base SHA: `9c562e7278f3acfe832e4244d6ca81aaaf5d0a04`**
- Chưa push, chưa deploy, không sửa WordPress, không chạm homepage.

## 0. Bước git đã thực hiện

Worktree Gcalls Plus đã PASS: `/Users/macos/Desktop/Gcalls/App/gcalls-plus-ui-v2`
(`feature/gcalls-plus-ui-v2`). Chạy lại trước khi commit:

| Gate | Kết quả |
|---|---|
| `npm run typecheck` | PASS |
| `npm run test` | PASS |
| `npm run build` | PASS |
| verify script | **78 passed / 0 failed** → `GCALLS_PLUS_CONTENT_PASS` |

> Brief ghi `scripts/verify-gcalls-plus-ui.mjs`. File thực tế tên là
> `scripts/verify-gcalls-plus.mjs` — cùng một script, chỉ khác tên.

Gcalls Plus khi đó vẫn là thay đổi chưa commit → đã tạo local checkpoint commit
`9c562e7` sau khi 4 gate PASS. Không push. Worktree QA/QC tạo từ SHA này, đúng
yêu cầu "không dùng `origin/main` nếu ref đó thiếu media" (main vẫn thiếu toàn
bộ ảnh sản phẩm — xem checkpoint Step 1 §0).

---

## 1. Hợp đồng nội dung — PASS

Breadcrumb (`div`) + **18 content section** (`section`), đúng thứ tự brief.
Tài liệu ghi 19 vì tính breadcrumb. Đúng **1 H1**.

**Không sửa một ký tự copy nào.** `src/data/qaQcCenter.ts` không thay đổi
(xem `file-diff.txt` — file không có trong diff).

### Content reconciliation

Mọi field trong data source đều được render:

| Const | Field | Render |
|---|---|---|
| `QQ_HERO` | eyebrow, h1, description, valuePoints, primaryCta, secondaryCta | ✓ |
| `QQ_DIRECT_ANSWER` | question, answer | ✓ |
| `QQ_PROBLEMS` | eyebrow, h2, description, items | ✓ |
| `QQ_OVERVIEW` | eyebrow, h2, description, keywordLead, components | ✓ |
| `QQ_HOW_IT_WORKS` | anchorId, eyebrow, h2, steps | ✓ |
| `QQ_CAPABILITIES` | eyebrow, h2, items | ✓ |
| `QQ_SCORING` | eyebrow, h2, description, points | ✓ |
| `QQ_SIGNALS` | eyebrow, h2, description, points | ✓ (points cũng cấp nhãn cho SignalsMockup) |
| `QQ_HUMAN_LOOP` | eyebrow, h2, description, roles | ✓ |
| `QQ_DASHBOARD` | eyebrow, h2, description | ✓ |
| `QQ_BENEFITS` | eyebrow, h2, items.title/detail | ✓ |
| `QQ_USE_CASES` | eyebrow, h2, items, links | ✓ |
| `QQ_INTEGRATION` | eyebrow, h2, description, links | ✓ |
| `QQ_BOUNDARIES` | eyebrow, h2, items, allSolutions | ✓ |
| `QQ_STORY` | eyebrow, h2, description, cta, link | ✓ |
| `QQ_PRICING` | eyebrow, h2, description, 2 CTA | ✓ |
| `QQ_FAQ` | 6 mục | ✓ |
| `QQ_FINAL_CTA` | eyebrow, h2, description, 2 CTA | ✓ |

**Field duy nhất không hiển thị:** `QQ_BENEFITS.items[].n`. Card lợi ích cố ý
không đánh số — chúng là một tập giá trị, không phải một trình tự. Không có nội
dung nào bị cắt hay viết lại.

---

## 2. Audit mockup — mọi mục trong brief đều đã được xử lý

**Không tồn tại screenshot QA/QC thật.**
`docs/content-review/images/website-image-master-map.csv` ghi route này là
`PRODUCT_SCREENSHOT_REQUIRED` / `NOT DELIVERED`, kèm chỉ dẫn *"Do not stage a
fake scoring screen."* → phát tín hiệu `QAQC_REAL_MEDIA_SOURCE_REQUIRED`.

### Mockup replacement matrix

| Mockup | Dữ liệu giả đã gỡ | Thay bằng |
|---|---|---|
| `ReviewWorkspaceMockup` → **`ReviewPipelineMockup`** | hội thoại khách hàng dựng sẵn (3 lượt), điểm `78`, verdict đạt/không đạt | Composition khái niệm **Audio → Transcript → Criteria → Human review**, dòng placeholder hình học |
| `TranscriptMockup` | hội thoại dựng sẵn (4 lượt), mã `#A-1042`, timestamp cuộc gọi | Nhãn vai nói + **dòng placeholder hình học**, timestamp `--:--`, chip "Từ khóa theo cấu hình" |
| `ScoreCardMockup` | điểm đề xuất `78`, verdict đạt/không đạt từng tiêu chí | Tên tiêu chí + trọng số **20/30/30/20 trình bày là cấu hình mẫu, hiển thị Tổng trọng số 100%**; giá trị kết quả = `—` |
| `SignalsMockup` | `#A-1042`, `#A-1039`, `#A-1035`, `#A-1028` + verdict cảm xúc từng cuộc | 4 **nhóm tín hiệu chung** (Từ khóa · Tín hiệu cảm xúc · Dấu hiệu bất thường · Xu hướng); trạng thái = `—` |
| `QualityDashboardMockup` | `1.248` / `86` / `81` / `34`, biểu đồ `62/74/58/88/79/41` | **Trạng thái rỗng**: 4 tile `—`, panel xu hướng ghi "Biểu đồ hiển thị khi có dữ liệu của doanh nghiệp" |

Trọng số `20/30/30/20` được giữ đúng theo điều kiện brief cho phép: hiển thị
dưới tiêu đề "Cấu hình mẫu", có hàng **Tổng trọng số 100%**, và mọi cột kết quả
để `—`.

### Vì sao caption không đủ

Phiên bản cũ đã gắn "Dữ liệu mẫu" dưới mọi mockup. Trên một trang mà **chủ đề
chính là chấm điểm**, một điểm số bịa chính là claim: người đọc không có cách
nào phân biệt `81` minh họa với `81` đo được. Cách sửa là bỏ con số, không phải
bỏ thêm chú thích.

### Nhãn hiện tại

Mỗi surface có **hai** lớp nhãn, đều được assert:
1. Badge `MINH HỌA` ngay trong khung.
2. Caption dưới khung: *"Giao diện minh họa mô tả quy trình QA. Không phải ảnh
   chụp sản phẩm và không chứa dữ liệu vận hành của khách hàng."*

---

## 3. Media inventory

| # | Section | Visual | Loại | Nguồn | PII |
|---|---|---|---|---|---|
| 01 | Hero | `ReviewPipelineMockup` | Diagram quy trình | DOM, design system | N/A — không có dữ liệu |
| 04 | Tổng quan | `TranscriptMockup` | Mockup trung tính | DOM | N/A |
| 07 | QA scoring | `ScoreCardMockup` | Rubric config | DOM | N/A |
| 08 | Signals | `SignalsMockup` | Nhóm tín hiệu | DOM, nhãn ràng buộc vào `QQ_SIGNALS.points` | N/A |
| 10 | Dashboard | `QualityDashboardMockup` | Trạng thái rỗng | DOM | N/A |

Các section còn lại (02, 03, 05, 06, 09, 11–18) là card/process/comparison/CTA,
không có visual — đúng thiết kế, để nhịp trang luân phiên.

- **0 file ảnh** được request trên trang (đã assert) → không hotlink, không
  upscale, không lặp dashboard.
- Không dùng ảnh của sản phẩm khác thay thế.

---

## 4. UI

| Hạng mục | Trước | Sau |
|---|---|---|
| Container | 1280px | **1180px** (chỉ trong `.qq-page`) |
| Seam giữa section | 192px @1440 | **50px** (25px mỗi bên) |
| Hero desktop | 50 / 50 | **44 / 56** |
| Internal gap | không đổi | không đổi (card/FAQ/panel giữ nguyên) |

Bố cục luân phiên: hero-split → panel → cards 2 → split → process 5 → cards 3 →
split → split → cards 3 → split → cards 4 → cards 4 → center links → cards 4 →
proof card → band → accordion → band.

Không dùng `ProductVisualWithSupport` (hình học của nó vẫn lỗi với ảnh dọc, và
ba trang khác đang dùng). Thay vào đó tạo page-local `QaQcStage.tsx`, đúng như
brief gợi ý — shared `common/ProductVisual` **không bị sửa**.

### Sửa phát sinh khi ép 44/56

Cột copy hẹp lại làm hai CTA hero vỡ chữ giữa cụm ("Khám phá cách / hoạt động").
Đã cho **hàng** CTA xuống dòng thay vì nhãn: `sm:flex-wrap` + `sm:whitespace-nowrap`.
`whitespace-nowrap` cố ý chỉ áp dụng từ `sm` trở lên — bản đầu áp dụng ở mọi
breakpoint và **gây overflow ngang ở 320px**, đo được rồi mới sửa.

---

## 5. Before / after

### Chiều cao trang

| Breakpoint | Trước | Sau | Chênh |
|---|---|---|---|
| 1440 | 12 783px | **10 556px** | −2 227px (−17.4%) |
| 1280 | 12 783px | **10 556px** | −2 227px (−17.4%) |
| 1024 | 13 690px | **11 229px** | −2 461px (−18.0%) |
| 768 | 15 714px | **14 030px** | −1 684px (−10.7%) |
| 390 | 20 087px | **19 023px** | −1 064px (−5.3%) |
| 320 | 21 788px | **20 793px** | −995px (−4.6%) |

### Dữ liệu vận hành giả

| | Trước | Sau |
|---|---|---|
| Điểm QA bịa hiển thị | 2 (`78` × 2) | **0** |
| Tổng số vận hành bịa | 4 (`1.248`, `86`, `81`, `34`) | **0** |
| Điểm biểu đồ bịa | 6 (`62/74/58/88/79/41`) | **0** |
| Mã cuộc gọi bịa | 5 (`#A-1042` × 2, `#A-1039`, `#A-1035`, `#A-1028`) | **0** |
| Lượt hội thoại dựng sẵn | 7 | **0** |
| Verdict đạt/không đạt bịa | 7 | **0** |

---

## 6. Gate

`node scripts/verify-qaqc-ui.mjs` → **89 passed / 0 failed**.

18 content section + breadcrumb · 1 H1 · 0 overflow (6 breakpoint) · 0 broken
image · 0 empty grid track · 0 heading orphan · 0 fabricated KPI · 0 PII ·
0 raw shortcode · 0 CTA trùng · final CTA đúng 1 lần · container 1180 ·
seam 25/25 · tap target ≥44px · 0 thay đổi ngoài route QA/QC.

Kỳ vọng thứ tự section **đọc từ `qaQcCenter.ts`**, không viết lại trong checker —
bản đầu viết tay và báo sai 9 section vốn đúng.

Nhãn trong `SignalsMockup` là **head term** của từng point đã duyệt, không phải
câu đầy đủ: in nguyên câu thì mockup chỉ lặp lại đúng danh sách gạch đầu dòng
nằm ngay cạnh nó. Ràng buộc được **kiểm tự động** — checker assert mỗi nhãn vẫn
là substring của point tương ứng, nên nhãn không thể trôi khỏi copy đã khóa.

`typecheck` / `test` / `lint` / `build`: PASS (6 warning có sẵn ở
`src/app/components/ui/*`, không liên quan).

### Regression — `regression-report.txt`

Dựng pristine worktree tại `9c562e7`, so 1440px:

| Route | Kết quả |
|---|---|
| `/` | IDENTICAL |
| `/gcalls-plus-webphone/` | IDENTICAL (10 578px, 1180px, 8 ảnh) |
| `/gcalls-cx/` | IDENTICAL |
| `/voicebot-ai/` | IDENTICAL |
| `/san-pham/` | IDENTICAL |
| `/giai-phap/` | IDENTICAL |
| `/qc-bot-ai/` | CHANGED — trong phạm vi |

**Unexpected route changes: 0.**

---

## 7. Ghi chú ngoài phạm vi

`/favicon.ico` trả 404 trên mọi route (không có icon trong `index.html` và
`public/`). Thiếu sót toàn site, sửa sẽ chạm mọi route.

---

## 8. Tín hiệu

- `QAQC_CONTENT_PASS`
- `QAQC_FABRICATED_DATA_ZERO`
- `QAQC_PII_ZERO`
- `QAQC_UI_LOCAL_PASS`
- `QAQC_MEDIA_REVIEW_PENDING_OWNER`
- `QAQC_REAL_MEDIA_SOURCE_REQUIRED`

Chưa push, chưa deploy, chưa port WordPress, chưa bắt đầu Gcalls CX.

### Cần chủ sở hữu quyết

Trang hiện **không có một ảnh sản phẩm nào** vì chưa ai giao. Các surface hiện
tại mô tả quy trình một cách trung thực nhưng không chứng minh được sản phẩm
tồn tại. Để trang này thuyết phục, cần cấp capture thật của: màn transcript,
màn cấu hình tiêu chí QA, và quality dashboard — đã che PII, và **không kèm số
liệu vận hành thật** (số liệu thật là claim chưa duyệt, giống trường hợp
analytics của Gcalls Plus).

## Nội dung thư mục

- `README.md` — checkpoint này
- `preview/` — full-page 6 breakpoint, hero desktop/mobile, crop 5 section có visual, `metrics.json`
- `file-diff.txt` — diffstat + danh sách file mới + full diff
- `regression-report.txt` — so sánh 7 route
- `verify-output.txt` — kết quả gate
