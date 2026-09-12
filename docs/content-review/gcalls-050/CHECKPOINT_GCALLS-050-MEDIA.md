# CHECKPOINT GCALLS-050 — CẬP NHẬT MEDIA CHO 163 BÀI DRAFT

2026-09-03. Không import lại bài. Không publish bài nào. Không dùng
`class-corpus-migration.php`. Không push, không sửa lịch sử Git.

## Trạng thái cuối

> ## `FEATURED_IMAGE_162_OF_163`
> ## `BODY_MEDIA_0_REPLACED` — có chủ ý, xem §3
> ## `PROTECTED_18_PASS` · `PAGES_37_PASS` · `PUBLISHED_NEW_0`
>
> Còn chờ chủ sở hữu: `NEEDS_SOURCE 188 ảnh` · `LOCALISE 445 ảnh` · 1 bài UNASSIGNED

**Tất cả 163 bài vẫn là `draft`. Số bài publish vẫn đúng 18.**

---

## 1. Không có công cụ tạo ảnh — nên toàn bộ ảnh là hình vẽ code-native

Phiên này **không có** công cụ sinh ảnh. Theo §3 (*"Nếu không có công cụ tạo ảnh
được phép, chuẩn bị prompt và sơ đồ code-native"*), toàn bộ ảnh mới được **vẽ
bằng HTML/CSS**, render qua headless Chrome → WebP.

Chrome được chọn thay cho librsvg vì nhãn là tiếng Việt: librsvg đánh rơi dấu,
và một ảnh bìa hiện "Tông đai" thay vì "Tổng đài" còn tệ hơn là không có ảnh.

**Hệ thống có 8 archetype**, chọn theo *nội dung thật* của bài (heading + lead),
không theo tiêu đề:

| Archetype | Dùng cho | Số bài |
| --- | --- | --- |
| `CRITERIA_GRID` | chỉ số, tiêu chí | 34 |
| `LAYERED_STACK` | IVR/SIP/VoIP, kiến trúc | 31 |
| `PROCESS_FLOW` | quy trình, N bước | 31 |
| `DEFINITION_ANCHOR` | "X là gì" | 17 |
| `SPLIT_COMPARE` | A vs B | 16 |
| `CONVERSATION_MOMENT` | kỹ năng, tình huống | 15 |
| `CHANNEL_MAP` | đa kênh, hội tụ | 13 |
| `TIMELINE_TREND` | xu hướng | 5 |

Không archetype nào chiếm quá 22%, và không có hai bài cùng hub cạnh nhau dùng
chung archetype.

**Ràng buộc cấu trúc quan trọng nhất: không archetype nào nhận số.** Không phần
trăm, không KPI, không giá. Đây không phải quy ước mà là thiết kế — dự án này đã
từng đăng số liệu bịa ("1,248 total calls", "CSAT 4.7/5") trong ảnh chụp màn hình
giả. Một hệ thống *không thể* nhận số thì không thể lặp lại lỗi đó. Mọi nhãn đều
lấy từ heading của chính bài viết.

Mỗi ảnh đều có caption nói rõ **đây là hình vẽ mới, không phải ảnh chụp màn hình
sản phẩm**.

### Nguồn ảnh có sẵn: không dùng được cái nào cho featured

| Nguồn | Kết luận |
| --- | --- |
| `product-gallery/*.webp` (9 file, 1600×900) | **FORBIDDEN_FABRICATED** — mockup bịa, số liệu/nhân sự/khách hàng đều là giả |
| Screenshot sản phẩm thật (15 file) | Rộng nhất **821px**; featured cần 1200×630 và **cấm upscale** → **không file nào dùng được** |
| 7 file | **FORBIDDEN_PII** (5 BLOCKED + 2 REFUSED) |

Câu trả lời cho "ảnh thật có lấp được slot featured không" là **không, không file
nào** — không phải "rất ít".

---

## 2. Đã làm: 162/163 ảnh đại diện

Trước đợt này **cả 163 bài đều `featured_media = 0`** — không bài nào có ảnh đại
diện, nên cũng không có ảnh chia sẻ mạng xã hội.

| | |
| --- | --- |
| Ảnh đã tạo và upload | **162** (1200×630, WebP, chất lượng ~91) |
| Bài đã gán featured | **162 / 163** |
| Attachment mới | id **808–969**, 162 file, **0 trùng lặp** |
| Alt text | **162/162** có, mô tả đúng nội dung ảnh |
| Caption | **162/162**, đều nói rõ là hình vẽ minh hoạ |
| Tổng dung lượng | 4,7 MB (trung bình 29 KB/ảnh) |
| Metadata EXIF/GPS | **0 file còn sót** |

Theme render đúng: `wp-post-image`, WordPress sinh đủ biến thể responsive
(300/768/1024), và **Rank Math nhận làm `og:image`** — trước đây các bài này
không có ảnh share nào.

### 1 bài UNASSIGNED — không ép cho đủ số

**Post 398** `9-viec-nen-va-khong-nen-lam-trong-quy-trinh-danh-gia-nhan-vien`.
Tiêu đề hứa 9 NÊN / 9 KHÔNG NÊN, nhưng 9 heading trong thân bài chỉ ghi
"Sai lầm 1:" … "Sai lầm 9:" **và không có chữ nào phía sau**. Không có nhãn thật
để vẽ, mà bịa ra 9 nhãn là điều bị cấm. Nên bài này ship với
`archetype: UNASSIGNED`, cần biên tập viên quyết.

### Một chỗ coordinator đổi so với đề xuất của worker

**Post 200** `top-10-phan-mem-theo-doi-ban-hang`: worker chọn `CHANNEL_MAP`, vẽ 5
tên **đối thủ** (Pipedrive, HubSpot, Bitrix24…) hội tụ bằng mũi tên vào một điểm.
Hai vấn đề: mũi tên hội tụ hàm ý *tích hợp* chứ không phải *so sánh*; và nó đặt
tên 5 đối thủ lên ảnh chia sẻ mang thương hiệu Gcalls. Đã đổi sang
`CRITERIA_GRID` với đúng 3 tiêu chí mà **chính bài viết mở đầu** (heading 0–3).

---

## 3. Ảnh trong bài: **0 ảnh bị thay** — và đây là kết luận đúng, không phải bỏ sót

Ba worker đọc độc lập. Kết quả hợp nhất trên **704 lượt ảnh body**:

| Hành động | Số lượt |
| --- | --- |
| `LOCALISE` (ảnh còn sống, giữ nguyên, chỉ cần tải về) | **445** |
| `NEEDS_SOURCE` (giữ lại chờ nguồn thật) | **188** |
| `DROP_BOILERPLATE` (banner lặp) | **57** |
| `KEEP` | **14** |
| **`REPLACE`** | **0** |

**143 lượt ban đầu được đề xuất REPLACE đã bị hạ xuống `NEEDS_SOURCE`**, vì một
trong hai lý do:

1. **Có worker phản đối** — bảo vệ theo nguyên tắc **hợp (union), không phải đa
   số**: chỉ cần *một* worker cho rằng ảnh mang thông tin là đủ để giữ. Con số
   biện minh cho lựa chọn này: trong 201 slot được bảo vệ, **chỉ 14 slot được cả
   ba worker đồng ý**, còn **157 slot chỉ do một worker phát hiện**. Lấy đa số sẽ
   vứt bỏ phần lớn cảnh báo thật.
2. **Chứng cứ yếu** — worker A tự khai **117/158 REPLACE của chính nó dựa trên
   chứng cứ yếu** (host chết, không caption, không alt, không biết ảnh vẽ gì).
   Đoán mò không phải là giấy phép để vẽ đè lên hình của người khác.

### Vì sao gần như không ảnh nào vẽ lại được

Trong 182 URL ảnh chết (thuộc 56 bài mất sạch ảnh), **chỉ 2 ảnh có thể vẽ lại một
cách trung thực**. Lý do: **100 trong 187 lượt ảnh chết có ngay dòng
`Nguồn ảnh:` / `Nguồn:` phía sau** — chúng là **ảnh stock và ảnh chụp màn hình
sản phẩm của đối thủ** (blog.close.com, HubSpot, Salesforce, Pipedrive, Zoho,
Bitrix24, istockphoto, pinterest…). Vẽ lại dashboard của đối thủ rồi ký tên
Gcalls là **bịa đặt**, không phải minh hoạ.

Đây là lý do §4 được tôn trọng triệt để: **không ảnh nào bị thay bằng hình trang
trí, và không đoạn văn tham chiếu hình nào bị xoá** để làm cho kiểm tra chuyển
xanh.

Các trường hợp nặng nhất, đều `NEEDS_SOURCE`:

- **861** `11-chi-so-danh-gia…` — 11 ảnh có caption **"Hình 1." … "Hình 11."**
  đánh số liên tục. Đánh số là một hệ quy chiếu; bỏ ảnh là làm gãy nó.
- **1082** `top-10-phan-mem-theo-doi-ban-hang` — 10 ảnh chụp CRM của đối thủ, mỗi
  ảnh kèm một dòng ghi nguồn.
- **872** — "Hình 1./2./3.", chết cả ba.
- **694** — bài viết ghi *"thích chia sẻ **biểu đồ này**"* rồi phân tích nó; biểu
  đồ đã chết, không mô tả ở đâu.
- **quyet-toan-thue-tncn** — "(hình minh hoạ bên dưới)" trỏ vào bảng lương có
  dòng thuế TNCN thật. **Không vẽ phiếu lương mẫu.**

### Banner lặp: 57 lượt, không phải 56

URL `…Screenshot-2021-06-21-at-17.51.50.png` xuất hiện **57 lần / 57 bài** — 56
lần qua `cdn.cdn.gcalls.co` và **1 lần qua `cdn.gcalls.co`**. De-dupe chỉ theo
`cdn.cdn` sẽ bỏ sót đúng một cái. Nó là **ảnh chụp thanh share của theme cũ**,
tức là giao diện website, không phải nội dung bài — và luôn kèm dòng chữ rơi vãi
"Share on facebook Share on twitter Share on linkedin".

**Chưa xử lý trong đợt này**, vì gỡ dòng chữ đó là **sửa văn bản**, mà §1 cấm sửa
văn bản trong đợt media. Cần một đợt riêng.

---

## 4. Pilot 8 bài — PASS toàn bộ

Chọn 8 bài, mỗi bài một `intent` khác nhau, gồm cả hai ca xấu nhất (post 251 với
17 ảnh phải giữ, post 200 là bài toàn ảnh đối thủ).

| Kiểm tra sau khi ghi | Kết quả |
| --- | --- |
| 8 bài vẫn `draft` | ✓ |
| Featured resolve đúng attachment | ✓ 8/8, 1200×630 WebP |
| `post_content` không đổi | ✓ hash trước = hash sau |
| Văn bản, số link, số ảnh không đổi | ✓ |
| 18 bài publish | ✓ không đụng |
| Chạy lại không tạo attachment trùng | ✓ |

**Khoá idempotency là TÊN FILE, không phải slug.** Pilot phát hiện đúng chỗ này:
attachment cho post 343 bị WordPress đổi slug thành
`dich-vu-voice-brandname-la-gi-**2**` vì đụng slug của chính bài viết. Nếu tra
theo slug, mẻ 154 bài sau đó đã tạo ra một bản trùng.

---

## 5. Không hồi quy — đo bằng bất biến, không bằng cảm tính

**Bất biến dùng để kiểm:** đợt này chỉ đổi `featured_media`, nên **hash của phần
văn bản (đã bóc hết thẻ HTML) phải giống hệt trước và sau**.

| Kiểm | Kết quả |
| --- | --- |
| **Hash tổng hợp văn bản của cả 163 bài** so với nguồn WXR | `75d23ab90d62d28f8bd0345e` = `75d23ab90d62d28f8bd0345e` — **GIỐNG HỆT** |
| Tổng số ảnh trong thân bài | **704** (không đổi) |
| Tổng số link | **439** (không đổi) |
| Bài không còn ở trạng thái draft | **0** |
| **18 bài publish** (chạy `live-baseline.mjs --compare`) | **18 unchanged, 0 changed** |
| **37 trang** | **37/37 HTTP 200, đúng 1 H1, 0 shortcode thô, 0 lỗi PHP** |
| Homepage | **18 top section** — y nguyên |
| Bài publish mới | **0** |

### Một cảnh báo giả mà tôi suýt báo nhầm

Lần kiểm đầu tiên trên 18 bài publish cho **FAIL cả 18**. Nguyên nhân là **cách
đo của tôi sai**, không phải nội dung đổi: `between()` thật **loại bỏ** chuỗi mở
đầu (tôi giữ lại), và script gốc fetch ở trạng thái **đăng xuất** (tôi fetch kèm
cookie admin, nên WordPress chèn thêm admin bar). Chạy đúng
`wordpress/scripts/live-baseline.mjs` cho **18 unchanged**. Việc 18/18 cùng sai
theo một kiểu chính là dấu hiệu của lỗi phương pháp, không phải 18 lần sửa nội
dung.

---

## 6. Hai vấn đề phải báo

### 6.1 PII đang sống trên demo — Gate A2, có ID cụ thể

Thư viện media có 13 file Gcalls Plus từ trước. **Năm file trong đó là bản dẫn
xuất của nguồn bị chặn:**

| Attachment | File | Manifest |
| --- | --- | --- |
| **35** | `gcalls-plus-advanced-filter-desktop-v1` | `BLOCKED` — tên nhân viên |
| **38** | `gcalls-plus-click-to-call-config-desktop-v1` | `BLOCKED` — tên công ty, SĐT, URL nội bộ |
| **39** | `gcalls-plus-webphone-desktop-v1` | `BLOCKED` |
| **40** | `gcalls-plus-contact-profile-desktop-v1` | `BLOCKED` — tên liên hệ, SĐT, email, tên tài khoản |
| **42** | `gcalls-plus-integrations-desktop-v1` | `BLOCKED` — tên liên hệ, tên tài khoản |

Manifest ghi `sanitization_status: BLOCKED` và
`source_approval: WITHHELD — còn PII sau khi mask` — bị từ chối **vì che rồi vẫn
còn PII**. Cùng bộ file này cũng đang **được git theo dõi** trong `public/` và
`dist/`. Đợt này **không đụng, không tái sử dụng, không trỏ lại** các ID đó.

### 6.2 Một file rác do tôi gây ra

**Attachment 807** `chrome.webp` (1200×630, không gắn với bài nào). Tôi thử cơ
chế upload bằng cách gắn một ảnh probe vào input của trang, tưởng rằng nó chỉ
"gắn" chứ chưa gửi — nhưng input đó là input HTML5 **tự động upload**. Tôi đã báo
sai ở thời điểm đó ("chưa gửi gì"). File nằm trong `orphans` của
`rollback-journal-050.json`. **Chưa xoá** — xoá là quyết định của chủ sở hữu.

---

## 7. Rollback

`rollback-journal-050.json` — bản đồ đầy đủ **162 post → attachment**.

Rollback đơn giản một cách bất thường, vì đợt này **không ghi một byte nào vào
`post_content`**:

- **Featured:** đặt `featured_media = 0` cho 162 post id. Giá trị cũ của **cả 162
  bài đều là 0** (đã kiểm từng bài ngay trước khi ghi), nên đây là khôi phục
  hoàn toàn.
- **Thân bài:** không cần — không có gì để hoàn nguyên.
- **Attachment:** id **808–969** là do đợt này tạo. **Không đụng id ≤ 806.**

---

## 8. Việc còn lại

| # | Việc | Ghi chú |
| --- | --- | --- |
| 1 | **445 lượt ảnh `LOCALISE`** | Ảnh còn sống trên `gcalls.co`. Cần bước **tải về + kiểm chứng**, tức là tải hàng loạt — chưa được duyệt trong phiên này |
| 2 | **188 lượt `NEEDS_SOURCE`** | Quyết định biên tập; xem danh sách trong `image-map-050.json` |
| 3 | **57 lượt banner + dòng chữ "Share on facebook…"** | Gỡ ảnh là media, gỡ chữ là **sửa văn bản** — cần đợt riêng |
| 4 | **11 asset Gcalls tự sở hữu** | Webphone UI, thống kê Gcalls Plus… — **chụp lại từ sản phẩm thật**, tuyệt đối không dựng mockup |
| 5 | **Post 398** | Thân bài chỉ có "Sai lầm 1..9" rỗng |
| 6 | **Post 16611** | 3 screenshot chưa ai soi PII |
| 7 | **Attachment 35/38/39/40/42** | Gate A2 |
| 8 | **Attachment 807** | Rác do tôi tạo, chờ duyệt xoá |

**Hoàn thiện ảnh không đồng nghĩa đủ điều kiện publish.** Các vấn đề SEO và nội
dung của GCALLS-048 (76/163 title là biến mẫu `%%title%%`, 0/263 có canonical,
84 link nội bộ chết, 13 structured data trỏ tiền tố WPML đã chết) vẫn còn nguyên
và được theo dõi riêng.

---

## 9. Sản phẩm bàn giao

| File | Nội dung |
| --- | --- |
| `image-map-050.json` | Bản đồ ảnh hợp nhất: 163 bài × mọi slot, hành động + lý do + ai bảo vệ |
| `rollback-journal-050.json` | 162 post→attachment, cách rollback, orphan |
| `pilot8-snapshot-before.json` | Snapshot trước khi ghi |
| `pilot8-contact-sheet.png` | Contact sheet pilot (§8) |
| `variety-24-contact-sheet.png` | 24 ảnh trải đủ 8 archetype |
| `wordpress/scripts/render-media-050.mjs` | Renderer spec → WebP |
| `wordpress/scripts/lib/archetypes-050.mjs` | Hệ 8 archetype |
| `wordpress/scripts/extract-bodies-050.mjs` | Bóc heading + ngữ cảnh quanh từng ảnh |
| `wordpress/scripts/merge-050-imagemap.mjs` | Hợp nhất verdict 3 worker theo phép hợp |
