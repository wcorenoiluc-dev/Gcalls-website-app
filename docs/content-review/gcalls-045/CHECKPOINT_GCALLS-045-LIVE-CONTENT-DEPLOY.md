# CHECKPOINT GCALLS-045 — TRIỂN KHAI NỘI DUNG LÊN DEMO

2026-09-02. **Đã triển khai.** Không push, không sửa lịch sử Git.

## Trạng thái cuối

> ## `LIVE_CONTENT_32_OF_37`
> **Không** phải `LIVE_CONTENT_COMPLETE_37_OF_37`.

**Website demo: https://ashernguyenxuanthuy.com**

25 trang từ shell (~100 từ) thành trang có nội dung đầy đủ. 5 trang còn thiếu
đúng 2 section mỗi trang vì lỗ hổng export đã biết từ GCALLS-041 — không phải
hồi quy của lần triển khai này.

---

## 1. Xác minh package — và cái bẫy đã tránh được

**Hai artifact khác nhau cùng mang tên `gcalls-core-0.10.5.zip`:**

| Nguồn | SHA-256 | Manifest |
| --- | --- | --- |
| `.deploy-043/candidate/` | `4b20ff1627e79d95…` | **13 trang** |
| `.release-042/` | `1315acc3df46d777…` | **31 trang** |

Chọn theo tên file sẽ cài bản 043 — **thiếu toàn bộ 18 trang nội dung mới**,
trong khi plugin vẫn báo "0.10.5". 25 shell sẽ vẫn là shell.

Vì thế phiên bản được nâng: **một artifact, một số hiệu**. Hai bản không bao giờ
được dùng chung số nữa.

### Bản đã cài

| | SHA-256 | Ghi chú |
| --- | --- | --- |
| `gcalls-core-0.10.6.zip` | `dee7edb8c783192322d36fb82a0eb6d8c910c016d0dfdc71b166a21f6a5373e3` | cài lần 1 |
| **`gcalls-core-0.10.7.zip`** | **`e97be64dc46127aac493118488c3ed9a8de72dc2c989b357d7fb345a319249bc`** | **đang chạy** — sửa số thứ tự step |

Theme **không** được cài: `gcalls-cp__*` không có CSS trong cả 0.8.5 lẫn 0.8.6,
nên nội dung không cần nâng theme. Live giữ **Theme 0.8.5**.

Kiểm trên chính ZIP sắp upload (không phải working tree): glossary **9 section /
27 card**, sáu trang ngành, tài nguyên, bảng giá đều đúng; manifest 31 trang;
acceptance **72/74** — 72/72 route nội dung PASS, 2 "fail" là gate
`thirteenSections` trên homepage của fixture chưa chạy Home Layout, đúng thứ §3
cấm làm.

Artifact các checkpoint trước **giữ nguyên**, không ghi đè.

---

## 2. Form KHÔNG được đưa lên live — và vì sao

Candidate 042 mang form hoạt động. §2 yêu cầu xác minh cache/nonce **trước** khi
đưa form đó lên live, và việc đó cần quyền cấu hình edge cache mà phiên này
không có. Một nonce bị cache sẽ được phục vụ lại cho người kế tiếp.

Nên bản triển khai là **content-only**: `class-leads.php`, `lead-form.js`,
`lead-form.css` **không có trong gói** (build gate fail nếu chúng lọt vào).
`/lien-he/` tự fail-closed — `Content_Pages::form_slot()` kiểm
`class_exists(Leads)` trước khi render form, nên không cần sửa lại manifest.

**Trạng thái form:**

| Mốc | |
| --- | --- |
| Giao diện | Đã dựng và kiểm ở GCALLS-042/043, **chưa lên live** |
| Lưu lead | Đã chứng minh local (65/65 + E2E) |
| Mail transport | Chỉ chứng minh bằng **mail capture cục bộ** |
| **Inbox** | **Chưa** — cần SMTP thật |

Form sẽ là **Core 0.10.8**, sau khi cache và SMTP xong.

---

## 3. Pre-deploy và bảo vệ

| Kiểm | Kết quả |
| --- | --- |
| Chrome + phiên `gcalls_owner` | ✓ đăng nhập sẵn, không gặp trang login |
| Live trước deploy | Core **0.10.0** · Theme **0.8.5** · WP 7.1 · Elementor 4.2.3 |
| Rollback khớp bản đang chạy | ✓ `929a55d6…` (0.10.0) và `83bc1ff8…` (0.8.5) |
| Baseline 18 bài blog | ✓ `baseline-blog-pre-deploy.json` |
| Baseline homepage | ✓ `baseline-homepage-pre-deploy.json` |
| wp-admin/Settings trước khi ghi | ✓ 200, không fatal, menu Gcalls đủ |

**Chặn còn hiệu lực, việc cho phép deploy này không bỏ qua:** Gate A1 (repo
Public + lịch sử PII), Gate A2 (media PII công khai), SMTP, page cache.

Không chạy Corpus Execute, Gcalls Import hay Homepage Layout Apply. Không đổi
menu, slug, post status hay cấu hình index.

---

## 4. Kết quả live — 32/37

Bảng đầy đủ: `live-verify-045.json`.

### Sản phẩm & tổng quan (7) — tất cả LIVE_PASS
`/` 2 869 từ · `/gcalls-plus-webphone/` 2 099 · `/gcalls-cx/` 2 438 ·
`/voicebot-ai/` 2 014 · `/qc-bot-ai/` 2 359 · `/san-pham/` 750 ·
`/giai-phap/` 993

### Tích hợp (6) — 2 PASS, 4 thiếu section
`/tich-hop/` 721 ✓ · `/tich-hop/hubspot/` 1 686 ✓
`/tich-hop/freshdesk/` 1 816 **(16/17)** · `/tich-hop/salesforce/` 1 634 **(15/16)** ·
`/tich-hop/zendesk/` 1 803 **(16/17)** · `/tich-hop/zoho-crm/` 1 687 **(15/16)**

### Giải pháp (4) — 3 PASS, 1 thiếu section
`/tong-dai-tich-hop-crm/` 1 776 ✓ · `/tong-dai-tich-hop-helpdesk/` 1 695 ✓ ·
`/tong-dai-tich-hop-pos/` 1 734 ✓ · `/tong-dai-quoc-te/` 2 263 **(14/15)**

### Theo ngành (7) — tất cả LIVE_PASS
`/nganh/` 606 · `giao-duc` 1 761 · `tai-chinh` 1 686 · `bao-hiem` 1 682 ·
`bat-dong-san` 1 663 · `thuong-mai-dien-tu` 1 751 · `bpo` 1 700

### Tài nguyên (6) — tất cả LIVE_PASS
`/tai-nguyen/` 342 · `guides` 915 · `ebook` 1 241 · `case-studies` 1 649 ·
`glossary` **2 367 (27 card)** · `faq` **2 321 (24 card)**

### Công ty, giá, referral, công cụ, liên hệ (7) — tất cả LIVE_PASS
`/cong-ty/` 377 · `khach-hang` 2 571 · `doi-tac` 2 724 ·
`/bang-gia/` 1 080 · `/referral/` 358 · `/uoc-tinh-chi-phi/` 831 · `/lien-he/` 235

### 5 trang FAIL — nguyên nhân chính xác

Mỗi trang có **2 section mà toàn bộ card đều rỗng** (không title, không body).
Renderer **cố ý bỏ** những section đó để một heading không đứng trên lưới trống
— đúng cơ chế đã sửa ở GCALLS-039. Đây là **lỗ hổng export** ghi nhận trong
GCALLS-041 (58 card rỗng / 14 section), không phải lỗi của lần triển khai này.

Ví dụ `/tich-hop/freshdesk/`: "Freshdesk Integration nằm ở đâu trong hệ sản phẩm
Gcalls?" (5 card rỗng) và "Gcalls × Freshdesk phù hợp với những workflow hỗ trợ
nào?" (4 card rỗng). Trang vẫn có 1 816 từ nội dung thật.

### Một sửa đo lường, không phải sửa số liệu

Lần chạy đầu báo 33/37 với 4 fail vì ngưỡng "≥400 từ". Nhưng `/cong-ty/` (377),
`/tai-nguyen/` (342), `/referral/` (358) và `/lien-he/` (235) là **trang chỉ
đường** — chúng **đủ nội dung** ở độ dài đó. Hạ ngưỡng cho tới khi xanh sẽ là
chỉnh thước đo cho vừa đáp án. Thay vào đó bài kiểm chuyển sang hỏi: **trang có
render đủ số section mà manifest khai không** — và chính phép đo đúng đó mới lộ
ra 5 trang thiếu section ở trên.

---

## 5. Không hồi quy

| Kiểm | Kết quả |
| --- | --- |
| **18 bài blog** so baseline ngay trước deploy | **18 unchanged, 0 changed** |
| **Homepage** | **18 top section, 1 H1, 9 mockup — y nguyên.** Không chạy Home Layout Apply, không đòi 13 section trên live |
| wp-admin / Settings / menu Gcalls | 200, không fatal, đủ 4 mục |
| PHP error trên 37 trang | 0 |
| Overflow ngang (desktop + mobile, 12 lượt chụp) | 0 |

**Một thay đổi có chủ ý trên homepage:** mockup `analytics` → `reporting`. Số
liệu bịa **114 · 73% · 3:25** và **84 · 73% · 5:24 · 11** đã biến mất khỏi trang
chủ live, thay bằng dấu "—". Layout không đổi.

---

## 6. Ảnh bàn giao

`screenshots/` — desktop 1440 và mobile 390:
`live-tich-hop-freshdesk-*` · `live-nganh-giao-duc-*` ·
`live-tai-nguyen-glossary-*` · `live-bang-gia-*` · `live-cong-ty-doi-tac-*` ·
`live-tai-nguyen-*`

---

## 7. Việc còn lại — không mở thêm vòng thiết kế

| # | Việc | Ghi chú |
| --- | --- | --- |
| 1 | **Trang nội dung chưa có CSS riêng** | `gcalls-cp__*` không có stylesheet ở bất kỳ phiên bản theme nào. Nội dung đọc được nhưng là văn bản thuần, tràn sát mép. Đây là tình trạng có sẵn của renderer, không phải do lần này. Cần một đợt UI riêng |
| 2 | **58 card rỗng / 14 section** | Cần re-export `content-pages.json`; ảnh hưởng 5 trang ở trên |
| 3 | **SMTP + inbox** | Chặn form |
| 4 | **Page cache cho `/lien-he/` và `/`** | Chặn form |
| 5 | **Gate A1 / A2** | Repo Public + PII, media PII công khai |
| 6 | **Form lên live** | Core 0.10.8, sau (3) và (4) |
| 7 | `/bang-gia/` | Đang theo hướng yếu tố chi phí, chưa công bố giá — đúng như đã chốt |

**Rollback:** `wordpress/.deploy-045/rollback/` — Core 0.10.0 `929a55d6…`,
Theme 0.8.5 `83bc1ff8…`. Theme không bị đụng nên chỉ cần hạ Core nếu muốn quay
lại.

Dừng ở đây để chủ sở hữu mở website xem.
