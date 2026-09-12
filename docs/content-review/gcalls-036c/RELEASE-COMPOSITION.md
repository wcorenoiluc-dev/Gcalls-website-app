# GCALLS-036C — Release composition plan

Chỉ thực hiện **sau** Gate A1 (repo Private) và Gate purge. Không nhánh nào
được push khi repo còn Public.

## Nguồn của từng phần

| Thành phần | Lấy từ | Vì sao |
| --- | --- | --- |
| **Core base** | đúng `gcalls-core-0.10.1.zip` (`52ffe873880a3047…`) | Batch 2 sáu route `/tich-hop/*` chỉ tồn tại ở đây |
| **Theme base** | `theme.css` trên `feature/gcalls-wordpress-migration` | **byte-identical với live 0.8.5** (`aea2b953…`); nhánh batch2 mang Theme 0.8.3, khác bản live |
| Renderer + content | replay có chọn lọc từ nhánh migration | không merge nguyên nhánh: header plugin ở đó là 0.9.7 |
| Form backend | **không nằm trong release** | runtime chưa qua test, 6 điều kiện chưa cái nào xác nhận |

## Core 0.10.2 — thêm gì so với 0.10.1

| File | Loại |
| --- | --- |
| `includes/class-sections.php` | mới |
| `includes/class-icons.php` | mới, sinh tự động |
| `data/section-components.json` | mới |
| `includes/class-shortcodes.php` | sửa — bỏ vòng lặp section cũ, bọc `.gc-page--product` |
| `includes/class-mockups.php` | sửa — nhãn `Dữ liệu minh hoạ` trên figure tile, từ chối `mock_analytics` |
| `assets/css/mockups.css` | sửa — style cho nhãn |
| `data/product-pages.json` | tái sinh từ exporter, kèm provenance |
| `gcalls-core.php` | sửa — require hai file mới |

Superset check: 0.10.1 không có file nào bị xoá; `content-pages.json` giữ nguyên
byte; sáu route Batch 2 không đụng tới.

## Theme 0.8.6 — thêm gì so với 0.8.5

| File | Loại |
| --- | --- |
| `assets/css/gc-components.css` | mới |
| `inc/assets.php` | sửa — một `wp_enqueue_style` kèm fingerprint |
| `style.css` | sửa — bump version |

`theme.css` **không đổi một byte**. Rollback = gỡ enqueue.

## Diff gate phải chứng minh

1. Core 0.10.2 ⊇ 0.10.1 — mọi file 0.10.1 còn nguyên hoặc chỉ được thêm vào.
2. Theme 0.8.6 ⊇ 0.8.5 — `theme.css` hash không đổi.
3. Không chứa 5 ảnh PII gốc, không `-v1` của 5 file đó.
4. Không chứa `PII-QUARANTINE-035/` hoặc bất kỳ đường dẫn nào tới nó.
5. Không chứa checkpoint chưa redact — `scripts/redact-checkpoints.mjs` phải
   chạy sạch (0 file thay đổi) ngay trước khi đóng gói.
6. Không build artifact chung: `node_modules`, `dist`, `eng.traineddata`,
   `docs/content-review/gcalls-036b/preview/` và `wordpress/.pkg/` đều không vào
   package. `wordpress/.pkg/` là dữ liệu giải nén từ chính `gcalls-core-0.10.1.zip`
   để contract test và preview chạy được; đã thêm vào `.gitignore`, tái tạo bằng
   cách giải nén lại, không bao giờ commit.

## Thứ tự bắt buộc

1. Gate A1 PASS (repo Private, 34 probe).
2. Gate A2 (xoá 5 attachment) + purge cache + kiểm 20 URL.
3. Token purge → rewrite lịch sử theo `gcalls-035/PURGE-RUNBOOK-v2.md`.
4. Replay 6 commit local bằng `format-patch` đã xuất.
5. Tạo integration branch sạch từ Core 0.10.1.
6. Port renderer/content có chọn lọc.
7. Đóng gói, chạy diff gate, xuất preview 1440/390.
8. Chờ chủ sở hữu duyệt preview → mới upload.
