# GCALLS-035 — trạng thái gate

Local/private. 2026-09-01. Live: **Core 0.10.0**, **Theme 0.8.5** — không đổi.
Không xuất bản trang công khai nào trong phiên này; checkpoint GCALLS-034 giữ nguyên local.

| Gate | Token | Trạng thái |
| --- | --- | --- |
| 1 · Repository Private | `REPOSITORY_PRIVATE_CONFIRMED` | **CHƯA NHẬN** — và repo đo được hôm nay vẫn `visibility: public` → **REPOSITORY_STILL_PUBLIC**. Không push gì. |
| 2 · Xoá Media PII | `AUTHORIZE_DELETE_MEDIA_IDS_35_38_39_40_42` | **CHƯA NHẬN** — 5 điều kiện tiền-xoá đã PASS, sẵn sàng |
| 3 · Git history | `AUTHORIZE_TARGETED_PII_HISTORY_PURGE` | **CHƯA NHẬN** — chuẩn bị xong, chưa chạy |
| 4 · Batch 2 | `CORE_0.10.1_UPLOADED` | **CHƯA NHẬN** — package đã sẵn, chưa upload |
| 5 · Core 0.10.2 | — | **CHƯA BẮT ĐẦU** — phụ thuộc 1–4 |
| 6 · Deploy | — | **CHƯA BẮT ĐẦU** |

Không có gì được xoá, push, rewrite, upload hay deploy trong phiên này.
`git status` không có file tracked nào bị sửa.

## Gate 1 — đo hôm nay, FAIL

`gate1-verify-anonymous-access.sh` chạy baseline: **34/34 đường ẩn danh vẫn mở**,
gồm API repo, API blob theo SHA, trang blob của cả 4 branch, `raw.githubusercontent`
(4 branch × 5 file, cộng 5 URL theo commit SHA), archive `codeload`, `git ls-remote`,
và **fetch ẩn danh `refs/pull/2/head` thành công**.

Chạy lại đúng script này sau khi có token; PASS khi không đường nào trả 200/206.

## Gate 2 — 5 điều kiện tiền-xoá: PASS

| Điều kiện | Kết quả |
| --- | --- |
| Backup đủ 5 file ngoài repo | **PASS** — dựng lại, cộng thêm cả 20 size để khôi phục được nguyên trạng |
| SHA-256 backup khớp nguồn | **PASS** — 5/5 khớp byte với bản live, cũng khớp working tree |
| Danh sách đủ 20 URL generated sizes | **PASS** — lấy từ `/wp-json/wp/v2/media/{id}`, không đoán; 20/20 vẫn trả bytes ảnh hôm nay |
| Năm ảnh v2 vẫn PASS | **PASS** — OCR/regex, metadata, strings, no-upscale; hash trùng bảng GCALLS-034 |
| Ghi ID/filename/hash vào incident record | **PASS** — `INCIDENT-RECORD.md`, không nhúng ảnh |

Renderer khi thiếu attachment đã kiểm bằng code: `Shortcodes::media()` trả `''`,
shortcode ghép trần vào `<section>` — vùng rỗng có kiểm soát, không raw URL,
không icon ảnh vỡ. Sẽ xác nhận lại trên live sau khi xoá.

Baseline trang `/gcalls-plus-webphone/` trước khi xoá, để so sau:
17 `<img>`, 11 `srcset`, 0 preload, 44 tham chiếu `uploads/2026/08`,
21 `gcalls-product__section`, 17 `gcalls-product__heading`,
12 URL PII xuất hiện trong markup.

Script sẵn sàng: `gate2-verify-media-purged.sh` (20 URL × 3 vòng),
`gate2-verify-page-references.sh` (HTML/src/srcset/preload/orphan).

## Gate 3 — chuẩn bị xong

`PURGE-RUNBOOK-v2.md`. Bản GCALLS-034 đã bị thay vì vi phạm quy tắc 4/5/6.
Ba việc quan trọng: bundle backup đã dựng lại (bản cũ mất cùng /tmp, và lệnh cũ
`--all` chỉ đóng gói được 1 ref), PR refs của PR #2 mang đủ 5 blob và **không thể
rewrite**, `git-filter-repo` 2.47.0 tương thích Python 3.9.6 sẵn có.

## Gate 4 — package đã sẵn, chờ owner upload

`gcalls-core-0.10.1.zip` — hai bản trên Desktop, byte-identical
(`52ffe873880a3047…`), 843 KB, zip integrity OK, một root `gcalls-core`,
header `Version: 0.10.1`. Live vẫn `?ver=0.10.0`.

## Ghi chú cho Gate 5 (chưa bắt đầu)

Core 0.10.1 nằm trên `feature/gcalls-batch2-integrations`; công việc visual
(13 section, seam 50px) nằm trên `feature/gcalls-wordpress-migration`, nhánh này
có header plugin **0.9.7**. Để 0.10.2 là strict superset của 0.10.1, hai dòng
lịch sử phải được hợp nhất — và cả hai đều nằm trong phạm vi rewrite của Gate 3,
nên thứ tự đúng là purge trước, hợp nhất sau.
