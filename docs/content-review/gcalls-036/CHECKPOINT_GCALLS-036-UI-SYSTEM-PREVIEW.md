# CHECKPOINT GCALLS-036 — UI SYSTEM PREVIEW

Local/private. 2026-09-01. **Chưa deploy, chưa push.** Live vẫn Core 0.10.0 ·
Theme 0.8.5. Không file tracked nào ngoài phần việc UI dưới đây bị sửa.

## 1. Gate PII state

| Gate | Token | Trạng thái |
| --- | --- | --- |
| A1 · Repository Private | `REPOSITORY_PRIVATE_CONFIRMED` | **CHƯA NHẬN**. Đo lại hôm nay: `private: false`, `visibility: public` → **REPOSITORY_STILL_PUBLIC**. |
| A2 · Xoá Media | `AUTHORIZE_DELETE_MEDIA_IDS_35_38_39_40_42` | **CHƯA NHẬN**, và bị chặn sau A1. |
| Purge lịch sử | `AUTHORIZE_TARGETED_PII_HISTORY_PURGE` | **CHƯA NHẬN**. Không rewrite, không force-push. |

Theo quyết định của chủ sở hữu, phiên này **không làm thêm backup**.
Quarantine `PII-QUARANTINE-035/` giữ nguyên, không xoá, không kiểm lại.
Toàn bộ việc UI làm local; không branch nào được push.

Script chạy lại 34 probe khi có token: `../gcalls-035/gate1-verify-anonymous-access.sh`.

## 2. React → WordPress component map

`REACT-WP-COMPONENT-MAP.md` — 16 component × 11 cột, dựng từ đo đạc thật chứ
không từ đọc code. Kết quả: **0 PASS · 12 DRIFT · 4 MISSING**.

Bốn thứ MISSING hoàn toàn: Feature Split, Trust bar, Comparison table,
Related navigation.

## 3. Before / React / After — 10 Conversion routes

**Chưa có ảnh chụp.** Thay vào đó phiên này lấy **inventory cấu trúc** ở 1440 và
390 cho cả 10 route, cả hai phía, bằng `scripts/ui-section-inventory.mjs` —
đó là thứ đo được và diff được, còn ảnh chụp là bước tiếp theo. Dữ liệu:
`inventory/section-inventory.json`.

Lý do hoãn ảnh: ảnh before của `/gcalls-plus-webphone/` chứa PII, phải nằm ngoài
repo; và "after" chưa tồn tại vì renderer chưa đổi.

## 4. Section inventory

Toàn văn trong `REACT-WP-COMPONENT-MAP.md` §1. Những con số quyết định:

- Icon: React **69** / WP **0** trên `/gcalls-plus-webphone/`.
- Grid: React **22** loại / WP **9**, tất cả cùng một class.
- Feature split: React 3 / WP **0** (gcalls-plus), React 2 / WP **0** (voicebot).
- Padding dọc WP dùng **6 giá trị**: 72, 40, 8, 56, 0, 64.
- `.gcalls-product__grid` dùng `auto-fit` nên sinh **track 0px** ở section 2, 6, 8.
- Section CTA bị render **hai lần** trên cả 4 route; bản đầu 0 CTA.

### Nguyên nhân gốc của CTA trùng lặp — đã xác định

Manifest có section `*_FINAL_CTA` **và** object `page.finalCta` riêng. React chỉ
render `finalCta`; WordPress render cả hai. Đúng 4/4 trang. Sửa: renderer bỏ qua
section có `source` kết thúc bằng `_FINAL_CTA`.

## 5. Page height và worst gap

| Route | React 1440 | WP 1440 | Δ | React 390 | WP 390 |
| --- | --- | --- | --- | --- | --- |
| gcalls-plus | 13 360 | 15 552 | +2 192 | 21 465 | 17 951 |
| gcalls-cx | 13 533 | 13 412 | −121 | 21 235 | 18 960 |
| voicebot-ai | 10 222 | 10 414 | +192 | 18 054 | 15 693 |
| qc-bot-ai | 12 783 | 11 593 | −1 190 | 20 087 | 16 522 |

Worst gap: seam giữa section = **50px** đều trên toàn bộ WP (đúng), nhưng
padding trong section nhảy 8 ↔ 56, nên dải `--alt` nổi thành hộp rời.
`gcalls-plus` cao hơn React 2 192px chủ yếu vì 11 ảnh screenshot xếp liên tiếp.

## 6. Media / diagram mapping

`inventory/section-component-assignment.json` — 51 section body, kèm layout React
đo được (SPLIT / CARDS-n / PLAIN), số icon, và media/mockup/diagram của manifest.

- **gcalls-plus**: manifest gán `media` cho **11/13** section → WordPress xếp 11
  screenshot liên tiếp. React chỉ dùng **3** screenshot nội dung + 2 ảnh hero.
  Vi phạm "không tạo chuỗi tám browser mockup liên tiếp".
- **cx / voicebot / qa-qc**: không có `media`, dùng `mockup`/`diagram`. Cả **11**
  mockup id manifest tham chiếu đều đã có hàm trong `class-mockups.php` — nội
  dung có, chỉ **layout sai**: WordPress render mockup full-width xếp dọc, React
  đặt copy trái / mockup phải. Đây là lỗi bố cục, không phải thiếu nội dung.

## 7. Fake visual đã loại — danh sách đề xuất, chưa thực hiện

Chưa gỡ gì khỏi production (không deploy). Danh sách phải loại khi build 0.10.2:

| Asset | Lý do |
| --- | --- |
| `analytics-dashboard.webp` | chủ đề đã REFUSED, số liệu hư cấu |
| `agent-performance.webp` | chủ đề đã REFUSED, tên nhân viên bịa |
| `customer-profile.webp` | khách hàng bịa, `FABRICATED_IDENTITY_01` |
| `call-history.webp` (1600×900 hero) | cùng lô dựng |
| `click-to-call.webp` | cùng lô dựng, domain `UNAPPROVED_DOMAIN_01` |
| `webphone-overview.webp` | cùng lô dựng — ảnh duy nhất đang hiển thị |

Sáu ảnh này đang nằm trên hero `/gcalls-plus-webphone/`; năm ảnh không hiển thị
(`naturalWidth=0`) nhưng vẫn trong DOM.

### Phát sinh mới cần chủ sở hữu quyết

Ngoài 5 ảnh PII đã biết, `/gcalls-plus-webphone/` còn dùng **7 ảnh `-v1` khác
chưa qua bất kỳ gate PII nào** và chưa có bản v2: `webphone-keypad-mobile`,
`overview-activity`, `timeline-history`, `call-history`, `agent-status-log`,
`activity-type-dropdown`, `integration-config`. `call-history` đáng ngờ nhất —
cùng chủ đề với các ảnh đã kết luận là lộ danh sách cuộc gọi.
Brief mục E chỉ cho dùng derivative `-v2` đã PASS, mà hiện chỉ có 5 bản v2.

## 8. Core / Theme diff plan

**Theme 0.8.6** — đã bắt đầu, xuất phát từ đúng bản live:
`theme.css` trong nhánh này **byte-identical** với live 0.8.5
(`sha aea2b953…`, 58 916 byte). Lưu ý cho mục G: nhánh `batch2-integrations`
(nền Core 0.10.1) mang Theme **0.8.3**, khác bản live — nên integration branch
phải lấy **Core từ batch2** và **Theme từ nhánh này**.

Đã thêm trong phiên này:

- `assets/css/gc-components.css` — 498 dòng, 60 rule, token + 16 component,
  namespace `gc-`, `body:not(.home)` xuyên suốt. **0 `!important`**, 0 negative
  margin, 0 `min-height`. `css-lint`: ok, 0 problem, 0 duplicate.
- `inc/assets.php` — enqueue handle `gcalls-components`, phụ thuộc `gcalls-theme`,
  nạp sau nên thắng theo thứ tự chứ không theo `!important`. `php-lint`: 38 file, 0 problem.

Token đã chốt: container 1220, reading 660, section padding 50, gap section 36,
heading→desc 18, desc→body 32, card padding 28/22, radius 20, icon 20/box 40.
Band `--alt` chuyển từ panel bo góc có viền sang **dải nền full-bleed liền nhau**.

**Core 0.10.2** — chưa động vào. Việc cần làm, theo thứ tự:

1. Renderer đọc `source` của section làm discriminator component (dữ liệu đã có sẵn, chỉ chưa dùng).
2. Bỏ qua section `*_FINAL_CTA` (sửa lỗi trùng lặp).
3. Bọc header + mockup vào `gc-split` cho các section React dùng split.
4. Thay `auto-fit` bằng số cột tường minh theo số item.
5. Thêm icon sprite; gắn icon vào card, checklist, step, FAQ.
6. Giảm `media` trên gcalls-plus từ 11 xuống đúng tập ảnh v2 được duyệt.

## 9. 18 bài và Corpus regression

Chưa chạm. Phiên này không import, không đổi post status, không ghi database,
không sửa file corpus. `git status`: thay đổi duy nhất là
`inc/assets.php` (+1 enqueue) và file CSS mới; phần còn lại là tài liệu chưa track.
Regression 18 bài và Corpus sẽ chạy khi có candidate 0.10.2 để so.

## 10. ETA

| Hạng mục | Ước tính |
| --- | --- |
| Core renderer đọc `source` + bỏ CTA trùng + split wrapper | 1 phiên |
| Icon sprite + gắn vào 5 component | 1 phiên |
| Batch UI-1: 4 product route đạt parity, có before/after 1440+390 | 1–2 phiên |
| Batch UI-1: 6 route Batch 2 | **chặn** — cần Core 0.10.1 live hoặc WordPress local |
| Batch UI-2 (9 route) | 2 phiên sau khi UI-1 PASS |
| Batch UI-3 (phần còn lại) | 2–3 phiên |

## Chặn thật sự

1. **Repo vẫn public** → không push được gì.
2. **Sáu route Batch 2 trống trên live** (Core 0.10.0) → không có "before" dùng được.
   Cần upload 0.10.1, hoặc dựng WordPress local. Chưa có PHP/WordPress local trong repo này.
3. **Chỉ có 5 ảnh v2**, trong khi trang đang dùng 11 ảnh v1 + 6 mockup dựng.
