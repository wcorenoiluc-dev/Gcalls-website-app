# GCALLS-053 Phase F0 — Core 0.10.1 / 0.10.8 / candidate reconciliation

Ngày 2026-09-08. **Read-only.** Không build, không đóng gói, không deploy, không
ghi vào root worktree.

## Ba cây đã xác định (không đoán)

| Cây | Nguồn | SHA-256 (16 ký tự đầu) | Files | Header |
|---|---|---|---|---|
| Base 0.10.1 | `/Users/macos/Desktop/gcalls-core-0.10.1-CANDIDATE-do-not-deploy-yet/gcalls-core-0.10.1.zip` | `52ffe873880a3047` | 41 | `0.10.1` |
| **0.10.8 (đang live)** | `wordpress/.release-047/gcalls-core-0.10.8.zip` | `0357782e9786b214` | 41 | `0.10.8` |
| 0.10.10 (đã build, chưa deploy) | `wordpress/.release-051/gcalls-core-0.10.10.zip` | `c1dd7c6b12f049fb` | 41 | `0.10.10` |

**ZIP 0.10.8 còn nguyên — không phải trích xuất từ demo.** Sidecar xác minh khớp:
`.release-047/SHA256SUMS` ghi `0357782e…` và ZIP băm ra đúng giá trị đó. Sidecar
0.10.1 cũng khớp (`52ffe873…`). `CORE_0108_BASELINE_RECONCILED` đạt được **không
cần** truy cập host demo.

## Phát hiện chặn — nguồn WordPress KHÔNG nằm trong integration branch

Brief giả định candidate source đến từ integration HEAD `5835a0b`. Thực tế
không phải. Nhánh tích hợp mang cây WordPress thời `d8d8615` (**0.9.7**) và
**thiếu hẳn 6 file** mà 0.10.8 đang chạy trên demo:

| File | 0.10.1 | 0.10.8 | 0.10.10 | Root WT | Integration `5835a0b` |
|---|---|---|---|---|---|
| `includes/class-content-pages.php` | 003c215 | 1734442 | 0cf86f1 | 0cf86f1 | **THIẾU** |
| `includes/class-sections.php` | — | 860083c | 860083c | 860083c | **THIẾU** |
| `includes/class-icons.php` | — | 797b951 | 797b951 | 797b951 | **THIẾU** |
| `data/content-pages.json` | f39f52a | f31233f | 67b7ec5 | 67b7ec5 | **THIẾU** |
| `data/section-components.json` | — | ad01fae | ad01fae | ad01fae | **THIẾU** |
| `data/media-frames.json` | — | c234921 | c234921 | c234921 | **THIẾU** |
| `data/content-inventory.json` | — | cfcdc73 | cfcdc73 | cfcdc73 | **THIẾU** |
| `assets/css/content-pages.css` | — | 2e4a42f | a248fad | a248fad | **THIẾU** |
| `assets/css/mockups.css` | 68797f6 | e90f169 | e90f169 | e90f169 | 68797f6 (cũ) |
| `data/homepage-elementor.json` | fac8538 | ff46ae9 | ff46ae9 | ff46ae9 | fac8538 (cũ) |
| `data/homepage-inventory.json` | 241b001 | 7ab4efa | 7ab4efa | 7ab4efa | 241b001 (cũ) |
| `data/product-pages.json` | db6932f | 6c5c048 | 6c5c048 | 6c5c048 | db6932f (cũ) |
| `includes/class-mockups.php` | 17d4d93 | 0737dc1 | 0737dc1 | 0737dc1 | 17d4d93 (cũ) |
| `gcalls-core.php` | 55c7297 | e9d0a9f | 5d6c9a5 | 9c3403c | 59a3cce (0.9.7) |
| `includes/class-shortcodes.php` | c24afe8 | d8cc3eb | d8cc3eb | a6a460b | fbd8eb2 (cũ) |
| `readme.txt` | 4491e84 | 4491e84 | 4491e84 | b5b37eb | b5b37eb |
| `data/corpus-migration.json` | dd829c2 | dd829c2 | dd829c2 | 2f915c1 | 2f915c1 |
| 24 file còn lại | — | đồng nhất ở cả 5 cột | | | |

**Kết luận:** build Core 0.10.11 từ `5835a0b` sẽ tạo ra một plugin **không có
`Content_Pages`** — đúng chế độ hỏng mà Worker 3 đã cảnh báo: 31 trang render
trắng. Integration branch chỉ mang phần React V2; nó chưa bao giờ mang phần
WordPress.

### Nguồn WordPress thật nằm ở đâu

Trong **root worktree đang dirty**, chưa commit. Root WT khớp 0.10.10 ở **mọi
file** trừ bốn:

| File | Root WT | 0.10.10 | Giải thích |
|---|---|---|---|
| `gcalls-core.php` | 9c3403c | 5d6c9a5 | Root là bootstrap 0.9.7 (không require `class-content-pages.php`). Release script thay bằng bản ghim 0.10.1 — đúng thiết kế |
| `includes/class-shortcodes.php` | a6a460b | d8cc3eb | Root có lead form **sống**; release script thay `lead_form()` bằng thân 0.10.1 fail-closed. `d8cc3eb` xuất hiện ở cả 0.10.8 và 0.10.10, nên phép biến đổi này đã được chứng minh hai lần |
| `readme.txt` | b5b37eb | 4491e84 | Release script viết lại Stable tag |
| `data/corpus-migration.json` | 2f915c1 | dd829c2 | Khác từ trước 0.10.1; cần xác định thuộc phạm vi nào |

→ Nghĩa là: **0.10.10 đã là superset của 0.10.8**, và root WT là source của
0.10.10. 0.10.11 phải build từ root WT (qua release script), **không** từ
`5835a0b`.

### Vì sao đây là stop point của F1

Brief F1 yêu cầu build **fail** nếu "Working tree có source liên quan chưa
commit", và yêu cầu "Verify source tree clean hoặc ghi exact source-tree hash".
Toàn bộ source WordPress hiện **chưa commit**. Không thể vừa tuân thủ quy tắc đó
vừa build từ cây hiện tại. Phải commit phần WordPress lên một nhánh trước —
đó là một quyết định phạm vi, không phải thao tác cơ học, nên dừng lại để hỏi.

## Delta 0.10.1 → 0.10.8 mà 0.10.11 phải là superset

**Thêm mới (6):** `content-pages.css`, `content-inventory.json`,
`media-frames.json`, `section-components.json`, `class-icons.php`,
`class-sections.php`.

**Sửa (9):** `mockups.css`, `content-pages.json`, `homepage-elementor.json`,
`homepage-inventory.json`, `product-pages.json`, `gcalls-core.php`,
`class-content-pages.php`, `class-mockups.php`, `class-shortcodes.php`.

**Delta 0.10.8 → 0.10.10 (4):** `content-pages.css`, `content-pages.json`,
`gcalls-core.php`, `class-content-pages.php` — công việc guides checklist.

## Trap A và Trap C vẫn sống trong chính cây sẽ ship

Xác minh trực tiếp trên `v0.10.10/gcalls-core` (= root WT):

`class-content-pages.php :: card()` chỉ đọc **bốn** key: `title`, `body`,
`checklist`, `href`.

Manifest đang mang: **`supporting` ×15, `tags` ×27, `cta` ×46, `current` ×8** —
tất cả bị bỏ im lặng. Section không rỗng nên `content-completeness-test.php`
vẫn pass; renderer tuân đúng manifest nên `renderer-test.php` cũng pass.

`seo` xuất hiện **0 lần** trong manifest, trong khi renderer đăng ký hai filter
`rank_math/frontend/*` đọc `$page['seo']` → Trap C xác nhận: hai filter chết.

## Việc chưa làm ở F0

Chưa lập bảng cho Theme (0.8.5 header / 0.8.6 nội dung) — sẽ làm cùng F6.
`corpus-migration.json` khác biệt chưa truy nguyên.
