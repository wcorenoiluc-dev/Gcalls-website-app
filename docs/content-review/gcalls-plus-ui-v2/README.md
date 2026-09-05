# GCALLS PRODUCT UI V2 — Step 1: `/gcalls-plus-webphone/`

Vòng CONTENT + IMAGE + UI trên React. Chưa port WordPress, chưa deploy, chưa
sang trang khác.

- Nhánh: `feature/gcalls-plus-ui-v2`
- Worktree: `/Users/macos/Desktop/Gcalls/App/gcalls-plus-ui-v2`
- Điểm xuất phát: `d8d8615` (đầu nhánh `feature/gcalls-wordpress-migration`)
- Chưa push, chưa deploy, không sửa WordPress.

---

## 0. Một sai lệch so với brief, đã cân nhắc

Brief yêu cầu tạo clean worktree từ `origin/main`. **Không làm được như vậy**:
`origin/main` không chứa nội dung Gcalls Plus đã duyệt và **không chứa một tấm
ảnh sản phẩm nào** — toàn bộ 13 file `public/images/products/gcalls-plus/` và
bản `gcallsPlus.ts` đã duyệt nằm ở commit `a1832c0` và `1401f6b`, chỉ có trên
nhánh migration. Base theo đúng chữ nghĩa của brief sẽ xoá mất chính nguồn mà
brief chỉ định là nguồn chính thức.

Vì vậy worktree được tạo từ `d8d8615` — commit sạch, mới nhất, chứa đủ nội dung
và ảnh đã duyệt. 6 commit gần nhất trên nhánh đó **không chạm vào `src/`** (đã
kiểm: `git diff origin/feature/gcalls-wordpress-migration..HEAD -- src/` rỗng),
nên phần React vẫn đúng bằng bản đã push.

---

## 1. Hợp đồng nội dung — PASS

Breadcrumb (`div`) + **17 content section** (`section`), đúng thứ tự brief liệt
kê. `WEBSITE_PAGES_OVERVIEW.md` ghi 18 vì tính cả breadcrumb; không thêm/bớt
component nào để khớp thành 18.

Toàn bộ copy vẫn lấy nguyên từ `src/data/gcallsPlus.ts`. **Không sửa một ký tự
nội dung nào** trong vòng này — không viết lại claim, không rút gọn, không thêm
số liệu, giá hay gói, không đổi đường dẫn CTA.

| # | Section | Nguồn dữ liệu | Trạng thái |
|---|---------|---------------|-----------|
| 01 | Hero | `GP_HERO` | giữ nguyên |
| 02 | Gcalls Plus là gì | `GP_DIRECT_ANSWER` | giữ nguyên |
| 03 | Bài toán đội ngũ nhỏ | `GP_PROBLEMS` | giữ nguyên |
| 04 | Tổng quan Webphone | `GP_OVERVIEW` | giữ nguyên (đổi ảnh) |
| 05 | Chức năng nghe gọi | `GP_FEATURES` | giữ nguyên |
| 06 | Lịch sử tương tác | `GP_HISTORY` | giữ nguyên (đổi bố cục + ảnh) |
| 07 | Ngữ cảnh khách hàng | `GP_CONTEXT` | giữ nguyên (sửa composition) |
| 08 | Workflow follow-up | `GP_WORKFLOW` | giữ nguyên |
| 09 | Hiệu suất đội ngũ | `GP_PERFORMANCE` | giữ nguyên (đổi ảnh) |
| 10 | Tích hợp CRM | `GP_INTEGRATION` | giữ nguyên |
| 11 | Nhóm người dùng | `GP_USE_CASES` | giữ nguyên |
| 12 | Phạm vi & giới hạn | `GP_BOUNDARIES` | giữ nguyên |
| 13 | Triển khai | `GP_DEPLOYMENT` | giữ nguyên |
| 14 | Chi phí/cấu hình | `GP_PRICING` | giữ nguyên |
| 15 | Customer story | `GP_STORY` | giữ nguyên (vẫn là placeholder đã duyệt) |
| 16 | FAQ | `GP_FAQ` (6 mục) | giữ nguyên |
| 17 | Final CTA | `GP_FINAL_CTA` | giữ nguyên |

**Nội dung bị regroup:** 1 — section 06. Năm điểm của `GP_HISTORY.points` chuyển
từ danh sách dọc cạnh ảnh thành hàng chip ngang phía trên ảnh. Chữ giữ nguyên.

**Nội dung bị loại:** 0. Mọi mục trong data source đều có vị trí hiển thị.

---

## 2. Media inventory

### 2.1 Ảnh đang dùng (8/13)

| Section | Ý nghĩa | Media trước | Media hiện tại | Nguồn file | PII | Cách hiển thị |
|---|---|---|---|---|---|---|
| 01 Hero | Webphone trên trình duyệt | ảnh thật + phone card đè hỏng | webphone desktop + active call mobile | `gcalls-plus-webphone-desktop-v1.webp` (809×429), `…-active-call-mobile-v1.webp` (553×1084) | PASS — che vĩnh viễn | main 594px + phone 150px đè góc dưới phải |
| 04 Tổng quan | Workspace trên trình duyệt | **`DashboardMain` — mockup vẽ, số liệu giả** | activity console thật | `…-overview-activity-desktop-v1.webp` (810×450) | PASS | split, ảnh 530px |
| 06 Lịch sử tương tác | Hành trình tương tác | call history table (808×983, lệch khung) | timeline thật | `…-timeline-history-desktop-v1.webp` (809×443) | PASS | showcase, ảnh 809px đúng kích thước gốc |
| 07 Ngữ cảnh KH | Hồ sơ khách hàng | ảnh thật + keypad đè lên chính chủ thể | contact profile + keypad | `…-contact-profile-desktop-v1.webp` (809×440), `…-keypad-mobile-v1.webp` (576×1092) | PASS | main 530px + keypad 150px đè góc |
| 09 Hiệu suất | Trạng thái Agent | **`AnalyticsDashboardMockup` + `UserStatusDashboard` — 2 mockup vẽ, KPI/nhân viên/SĐT giả** | agent status log thật | `…-agent-status-log-desktop-v1.webp` (809×295) | PASS — tên nhân viên đã che (`nhanvien.a`) | split, ảnh 530px |
| 10 Tích hợp CRM | Menu connector | ảnh thật | không đổi | `…-integrations-desktop-v1.webp` (809×494) | PASS | split, ảnh 530px |

Không ảnh nào bị phóng quá kích thước gốc (đã assert ở cả 5 breakpoint).
Không hotlink. Không lặp ảnh giữa các section.

### 2.2 Ảnh thật chưa dùng (5/13) — có lý do

| File | Lý do không dùng |
|---|---|
| `…-call-history-desktop-v1.webp` | Cùng bề mặt với timeline ở section 06. 808×983 quá cao cho cột split; lặp lại một bề mặt để lấp chỗ là điều media rule cấm. |
| `…-advanced-filter-desktop-v1.webp` | Là hộp thoại lọc, không phải bề mặt giá trị sản phẩm. |
| `…-activity-type-dropdown-desktop-v1.webp` | Dropdown 808×240, quá nhỏ về ngữ nghĩa để đứng thành visual của một section. |
| `…-integration-config-desktop-v1.webp` | Thuộc `/tong-dai-tich-hop-crm/`. Section 10 chỉ là hand-off, không được phình thành landing page CRM thứ hai (P01-B §10). |
| `…-click-to-call-config-desktop-v1.webp` | Như trên. |

### 2.3 Điểm cần chủ sở hữu quyết — `GCALLS_PLUS_MEDIA_REVIEW_PENDING_OWNER`

1. **Section 04 dùng ảnh empty-state.** `overview-activity` là ảnh thật nhưng
   vùng giữa và phải đang trống. Trung thực, nhưng yếu về mặt trưng bày sản
   phẩm. Đề nghị bổ sung một capture workspace **có dữ liệu đã che** cho riêng
   section này ở vòng media sau.
2. **Section 09 không có analytics.** `productImages.ts` ghi rõ hai capture hợp
   nhất cho section này — analytics dashboard và bảng hiệu suất nhân viên — đã
   bị giữ lại vì mang **số liệu vận hành thật**, tức là claim chưa được duyệt
   dù có che tên hay không. Section hiện dùng agent status log (bề mặt sản
   phẩm, không có KPI). Nếu muốn có analytics ở đây, cần duyệt số liệu trước.

---

## 3. React source → section → media

| # | Component | Bố cục | Media |
|---|---|---|---|
| 01 | `GcallsPlusHero.tsx` | split 44/56 | webphone desktop + active call mobile |
| 02 | `DirectAnswer.tsx` | panel giữa trang | — |
| 03 | `GcallsPlusProblems.tsx` | card 2 cột | — |
| 04 | `GcallsPlusOverview.tsx` | split (ảnh phải) | overview activity |
| 05 | `GcallsPlusFeatures.tsx` | grid 3 cột | — |
| 06 | `InteractionHistory.tsx` | **showcase full-width** | timeline history |
| 07 | `CustomerContext.tsx` | split (ảnh trái) | contact profile + keypad |
| 08 | `WorkflowSection.tsx` | process 4 bước | — |
| 09 | `PerformanceSection.tsx` | split (ảnh trái) | agent status log |
| 10 | `IntegrationSection.tsx` | split (ảnh phải) | integrations menu |
| 11 | `UseCases.tsx` | card 3 cột | — |
| 12 | `ProductBoundaries.tsx` | comparison 2 nhóm | — |
| 13 | `DeploymentSection.tsx` | process 6 bước | — |
| 14 | `PricingCTA.tsx` | band | — |
| 15 | `CustomerStory.tsx` | proof card | — |
| 16 | FAQ (trong page) | accordion | — |
| 17 | Final CTA (trong page) | band | — |

Bố cục luân phiên: split → grid → showcase → split → process → split → card →
comparison → process → band. Không có hai section liền nhau cùng dạng
copy-trái/mockup-phải.

---

## 4. Before / after

### 4.1 Chiều cao trang

| Breakpoint | Trước | Sau | Chênh |
|---|---|---|---|
| 1440 | 13 360px | **10 578px** | −2 782px (−20.8%) |
| 1024 | 14 045px | **11 269px** | −2 776px (−19.8%) |
| 768 | 19 275px | **14 613px** | −4 662px (−24.2%) |
| 390 | 21 465px | **18 024px** | −3 441px (−16.0%) |
| 320 | 22 714px | **19 479px** | −3 235px (−14.2%) |

### 4.2 Khoảng cách

Nhịp giữa hai composition: **192px → 50px** ở 1440 (112px → 50px ở 390).
Thực hiện bằng `padding-block: 25px` mỗi bên ranh giới section — cùng cách hiểu
"50px là khoảng GIỮA các section" mà bản WordPress đã duyệt ở `d8d8615` dùng.
Padding trong card, FAQ, panel định nghĩa và gutter ngang **không đụng tới**.

Container: **1280px → 1180px**, chỉ trong phạm vi `.gp-page`.

### 4.3 Số mockup giả

| | Trước | Sau |
|---|---|---|
| Mockup vẽ tay có dữ liệu bịa | **3** (`DashboardMain`, `AnalyticsDashboardMockup`, `UserStatusDashboard`) | **0** |
| Ảnh chụp sản phẩm thật | 6 | **8** |
| Import `@/components/product-ui` trong trang | 2 file | **0** |

Cụ thể những gì đã gỡ khỏi trang:

- Section 04 hiển thị khách hàng bịa (*Nguyễn Văn Minh, Trần Thị Lan, Lê Hoàng
  Phúc, Phạm Thu Hà*), số điện thoại bịa (*0901 234 567, 0912 345 678,
  0888 901 234, 0976 543 210*) và KPI bịa (*84 cuộc gọi, 73% tỷ lệ nghe máy,
  5:24, 11 đã chốt deal, +12%, +4%, +3*).
- Section 09 hiển thị 6 nhân viên bịa (*Nguyễn Hằng, Trần M. Tuấn, Lê P. Linh,
  Phạm Đ. Dương, Võ Thị Thanh, Đỗ Quang Hải*), số điện thoại bịa và tỷ lệ nghe
  máy bịa (*97%, 92%, 98%, 86%*).

Caption "dữ liệu mẫu" bên dưới **không** làm cho những con số đó an toàn: brief
cấm bịa nhân viên, số điện thoại và KPI, và cấm vẽ lại giao diện khi đã có ảnh
thật. Đã có ảnh thật.

### 4.4 Lỗi bố cục đã sửa

| Lỗi | Trước | Sau |
|---|---|---|
| Hero: phone card 300px đè lên nửa ảnh webphone và tràn lên header | có | card còn 150px, neo đáy trong stage có padding — chỉ đè góc dưới phải |
| Section 07: keypad đè lên chính contact profile — chủ thể của section | có | như trên |
| Section 09 cao 1 211px, khoảng trắng chết bên phải | có | 475px |
| Section 06: ảnh 808×983 cạnh ~300px chữ | có | showcase, ảnh 809px đúng gốc |
| React log warning `fetchPriority` mỗi lần render | có | 0 console error |

---

## 5. Kiểm tra tự động

`node scripts/verify-gcalls-plus.mjs` — **78 pass / 0 fail**, in ra
`GCALLS_PLUS_CONTENT_PASS`.

Nội dung assert: breadcrumb + 17 section đúng thứ tự; đúng 1 H1; FAQ khớp data
source; không href rỗng/`#`; không claim cấm (%, thời gian triển khai, "không
cần IT", uptime, số khách hàng, số tiền tiết kiệm); không chuỗi PII; media nằm
trong allowlist, không lặp, không upscale, đủ alt; không component nào của trang
còn import mockup barrel; container 1180px; nhịp 25/25px; không console error;
không route khác bị đổi. Cộng với 5 breakpoint: overflow ngang, tràn mép phải,
tap target ≥44px, ảnh vỡ, ảnh méo, ảnh upscale, raw shortcode, và split gập cột.

`npm run typecheck`, `npm run test`, `npm run build` đều pass.

### Không ảnh hưởng route khác — đã đo, không phải suy đoán

Dựng song song bản gốc `d8d8615` và bản hiện tại, so 8 route:

`/`, `/tong-dai-tich-hop-crm/`, `/tich-hop/hubspot/`, `/tich-hop/salesforce/`,
`/bang-gia/`, `/gcalls-cx/`, `/qc-bot-ai/`, `/blog/`

→ **8/8 giống hệt** về chiều cao trang, bề rộng container, số section, số ảnh.
Ba route đầu tiên là những route dùng chung `ProductVisualWithSupport`, nên
component đó được giữ nguyên và composition đã sửa nằm ở file riêng của trang
(`src/components/gcalls-plus/ProductStage.tsx`).

---

## 6. Ghi chú ngoài phạm vi

`/favicon.ico` trả 404 trên **mọi** route — `index.html` không khai báo icon và
`public/` không có file. Là thiếu sót toàn site, không phải lỗi của trang này;
sửa sẽ chạm mọi route nên không làm ở checkpoint này.

---

## 7. Điểm dừng

- `GCALLS_PLUS_CONTENT_PASS` — đạt, tự động kiểm.
- `GCALLS_PLUS_MEDIA_REVIEW_PENDING_OWNER` — chờ duyệt, xem §2.3.
- `GCALLS_PLUS_UI_REVIEW_PENDING_OWNER` — chờ duyệt, xem `preview/`.

Chưa push, chưa deploy, chưa sửa WordPress, chưa bắt đầu QA/QC Center.

Ảnh bàn giao: `preview/` — 5 ảnh full-page (1440/1024/768/390/320), hero crop
desktop + mobile, crop từng section có ảnh sản phẩm thật, và `metrics.json`
chứa số đo thô.
