# GCALLS-053 F3 — React V2 → WordPress port status by route

Ngày 2026-09-08. Chạy trên PHP 8.3.32 thật (Playground WASM), không phải suy luận từ source.

## Trap A — 15 card mất dữ liệu: ĐÃ SỬA

`class-content-pages.php :: card()` chỉ đọc `title`, `body`, `checklist`, `href`.
Manifest mang thêm `supporting` (15), `tags` (27), `cta` (46), `current` (8) —
tất cả bị bỏ im lặng. Section không rỗng nên completeness test pass; renderer
tuân đúng manifest nên renderer test pass.

Nay renderer đọc cả bốn, chỉ render khi manifest thực sự có giá trị (nhiều card
có `supporting: ""` và `tags: []` — không được sinh element rỗng).

| Route | Trước | Sau | Bằng chứng |
|---|---|---|---|
| `/san-pham/` | 3 card: title + body | + 1 supporting, 3 tag list, 3 CTA riêng | parity test |
| `/giai-phap/` | 7 card: title + body | + 1 supporting, 5 tag list, 7 CTA riêng | parity test |
| `/tich-hop/` | 5 card: title + body | + 5 supporting, 5 CTA riêng | parity test |
| `/nganh/` | 6 card trần | + 6 tag list, 6 CTA riêng, section note | port-hubs-053 |
| `/tai-nguyen/` | 6 card trần | + 5 tag list, 6 CTA riêng, section note | port-hubs-053 |
| 8 trang boundary | không có dấu "trang hiện tại" | `aria-current="true"` + nhãn chữ | parity test |
| 3 section `steps` | note bị bỏ | note render | parity test |

CTA: 15 card có nhãn riêng trong manifest đều đang bị ghi đè thành "Tìm hiểu
thêm". Nay dùng đúng nhãn của card; fallback giữ nguyên cho card không có.

**Quan trọng nhất về mặt claim:** `/cong-ty/doi-tac/` kết thúc hành trình 5 bước
bằng note "Không bước nào ở trên tạo ra quan hệ đối tác trước khi có thỏa
thuận…". Note đó đang bị bỏ, nên trang **ngụ ý một quan hệ đối tác chưa hề có**.
Nay render.

## Một status bị GIỮ LẠI có chủ ý

`RESOURCES_HUB` gắn thẻ Blog là **"Chưa có bài viết"**. Trên WordPress điều đó
**sai**: `/blog/` là posts page của **18 bài đã publish**. Port nó sang sẽ đăng
một phát biểu sai lên trang. Card giữ CTA và body đã duyệt; chỉ status bị giữ
lại, và script in rõ đã giữ lại cái gì + vì sao.

→ Cần owner quyết: sửa status trong React (`src/data/hubs.ts`) cho khớp thực tế,
hay giữ nguyên và WordPress vĩnh viễn không port field đó.

## Trap B — ba hub chưa port cấu trúc

| Hub | React V2 | WordPress | Trạng thái |
|---|---|---|---|
| `/nganh/` | layout riêng + hero diagram + 6 card 3×2 | 1 section, 6 card | **Field parity xong.** Layout riêng + hero diagram: chưa port |
| `/tai-nguyen/` | layout riêng 262 dòng, 6 card | 1 section, 6 card | **Field parity xong.** Layout riêng: chưa port |
| `/cong-ty/` | 382 dòng: principles, logo chính thức, contact đã xác minh | 1 section, **2 card** | **CHƯA PORT — cần owner** |

`/cong-ty/` không phải "thiếu field". Hai card của nó là link trang con
(Khách hàng, Đối tác); ba card của React là **principles** trỏ sang
`/san-pham/`, `/giai-phap/`, `/lien-he/`. Đó là **copy mới**, không phải field bị
rơi, nên cần owner duyệt chứ không phải một script port. Logo chính thức
(`gcalls-official-logo-137x40.png`, đã hash trong `e60b714`) cũng chưa có
đường vào WordPress media registry.

## Nguồn copy phân kỳ — cần biết trước khi port tiếp

`/nganh/` và `/tai-nguyen/` trong WordPress dựng từ **nguồn khác** với React hub:

| | WordPress | React V2 |
|---|---|---|
| `/nganh/` | `src/data/industries/index.ts` | `src/data/hubs.ts` (`INDUSTRIES_HUB`) |
| `/tai-nguyen/` | `src/data/resources/index.ts` | `src/data/hubs.ts` (`RESOURCES_HUB`) |

Hai nguồn **khớp tiêu đề và thứ tự 6 thẻ** nhưng **khác prose và khác hero h1**.
Vì copy đang khoá, port chỉ lấy field bổ sung (`tags`, `cta`, `note`) và không
đụng title/body/hero. Nếu owner muốn WordPress dùng đúng prose của React V2 thì
đó là một quyết định nội dung riêng, có đổi H1 và SEO.

## Bốn trang sản phẩm

Chưa port trong phiên này. Renderer sản phẩm (`class-sections.php`) đã pass
renderer-test 30/30 với source hiện tại. Việc còn lại theo brief F3:
ProductStage page-local, CX real-media từ `f4dddfb`, QA/QC neutral diagrams,
Voicebot media slot — cần chạy sau khi 052 chốt homepage để tránh port hai lần.

## Test đã chạy trên PHP thật

| Test | Kết quả |
|---|---|
| `content-card-parity-test.php` (mới) | **50 ok, 0 failed** |
| `renderer-test.php` | 30 ok, 0 failed |
| `content-completeness-test.php` | 4 ok, 0 failed |
| `media-frames-test.php` | 31 ok, 0 failed |

Contract test khoá **expected inventory** chứ không phải "không rỗng" — một con
số phải bằng 6 sẽ fail khi thành 5; một con số chỉ cần khác 0 thì không bao giờ
fail. Và nó assert trên **markup đã render**, vì manifest tự đồng ý với chính nó
đúng là trạng thái đang tồn tại khi các field bị rơi.

`CONTENT_CARD_FIELD_PARITY_PASS`
