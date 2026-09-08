# GCALLS-053 Phase F1 — Audit build graph (`build-051-release.mjs`)

Read-only audit. Chưa sửa script, chưa build.

## Điều script làm đúng

Nó **không** zip working tree. Core được lắp từ ZIP 0.10.1 ghim hash
(`52ffe873…`, đã xác minh) cộng một danh sách file đã duyệt, rồi assert rằng kết
quả chỉ khác 0.10.1 đúng ở các file đó. Cụ thể tốt:

* Hash-gate ZIP base trước khi giải nén (`:87`).
* `lead_form()` bị thay bằng thân 0.10.1, `lead_state()` và
  `lead_current_path()` bị cắt (`:139-149`) — đây là cơ chế fail-closed.
* Gate từ chối package nếu tên file khớp `lead-form|class-leads` (`:184`), và
  từ chối nếu còn tham chiếu `Leads::` thực thi sau khi bóc comment (`:187-191`).
* Xoá ảnh REFUSED theo SHA ghim, và từ chối xoá nếu registry ghi `PASS`
  (`:110-124`).
* Từ chối nếu package đánh rơi file không nằm trong danh sách được duyệt
  (`:176-181`).
* Gate nội dung kiểm **cả manifest lẫn renderer**, vì "manifest và renderer đồng
  ý với nhau không phải là bằng chứng".

## Lỗ hổng so với build order bắt buộc của F1

| # | Bước bắt buộc | Hiện trạng |
|---|---|---|
| 1 | Verify integration HEAD | **THIẾU** |
| 2 | Verify source tree clean / ghi source-tree hash | **THIẾU** |
| 3 | Generate content-pages manifest | **THIẾU** |
| 4 | Generate product data | **THIẾU** |
| 5 | Generate estimator/loss config | **THIẾU** |
| 6 | Generate media registry | **THIẾU** |
| 7 | Generate homepage 13-section Elementor JSON | **THIẾU** |
| 8 | Schema validation | một phần (chỉ content gate) |
| 9 | Source/component allowlist | **THIẾU** (`unmappedPolicy: fail` không được chạy) |
| 10 | PII / refused-media scan | một phần (chỉ refused-media theo hash; **không có PII scan**) |
| 11 | Package Core | có |
| 12 | Package Theme nếu theme đổi | **THIẾU** (script không xử lý theme) |
| 13 | Extract ZIP | có (`verifyZip`) |
| 14 | Test extracted files | một phần (chỉ đối chiếu danh sách file) |
| 15 | Compute SHA-256 | có |
| 16 | Write release manifest | một phần (chỉ `SHA256SUMS`) |

### Lỗ hổng nghiêm trọng nhất

**Script không bao giờ chạy generator.** Nó copy nguyên `content-pages.json`,
`product-pages.json`, `homepage-elementor.json`, `homepage-inventory.json`,
`media-frames.json` đang nằm sẵn trong working tree (`:100-106`).

Đây đúng là rủi ro "đóng gói trước khi generator hoàn tất" mà brief nêu. Nếu các
file đó cũ so với source React, ZIP ship nội dung cũ **một cách im lặng** — và
content gate vẫn pass, vì nó chỉ đếm 6/6 audience, 30/30 checkpoint, 12/12 note,
những con số mà dữ liệu cũ cũng thoả.

## Fail condition bắt buộc so với hiện trạng

| Điều kiện phải fail | Hiện trạng |
|---|---|
| Generator chạy sau packaging | không phát hiện được |
| File generated mới hơn ZIP | **THIẾU** |
| Plugin header/version khác release version | có (`:158-159`) |
| Hai ZIP cùng version khác hash | **THIẾU** |
| Working tree có source liên quan chưa commit | **THIẾU** |
| Artifact chứa file private/review/PII | một phần (`vet()`) |
| Homepage không đúng 13 section | **THIẾU** |

## Việc cần làm ở F1

Viết `build-053-release.mjs` mới (không sửa tại chỗ script 051, để 0.10.10 vẫn
tái lập được): chạy generator **trước** packaging, ghi mtime của mọi file
generated và fail nếu bất kỳ file nào mới hơn ZIP, ghi source HEAD +
source-tree hash, đếm 13 section của Elementor artifact, quét PII trên cây
build, và ghi release manifest đầy đủ.

## Chặn ngoài phạm vi script

Phase G không thể chạy trên máy này. Xem báo cáo chính.
