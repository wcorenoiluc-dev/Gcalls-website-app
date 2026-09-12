# CHECKPOINT GCALLS-048 — DI TRÚ BLOG 163 BÀI

2026-09-03. **Không ghi gì lên live.** Không import, không publish, không đổi
trạng thái bài nào, không chạy Corpus Migration, không push, không sửa Git.

## Trạng thái cuối

> ## `BLOG_PREPARED_163_OF_163`
> ## `BLOG_IMPORTED_DRAFT_163_OF_163` — **đã đúng từ trước phiên này**
> ## `BLOG_PUBLISHED_0_OF_163`
> ## `PROTECTED_18_PASS`
>
> Chặn publish: `BLOCKED_MEDIA_NOT_LOCALISED` · `BLOCKED_OWNER_DECISIONS_10`

---

## 1. Tiền đề của brief đã sai — và đây là phát hiện quan trọng nhất

Brief GCALLS-048 giả định 163 bài **chưa** được nhập và cần "nhập an toàn dưới
dạng draft". Kiểm tra trực tiếp trên database live cho thấy:

**163/163 bài đã có sẵn trong WordPress, đều ở trạng thái draft, đúng slug đích.**

Không còn gì để import. Bước import đã hoàn tất từ trước (đợt 003A/004).

Đọc qua REST API đã xác thực (`X-WP-Nonce` từ phiên admin), không phải suy đoán:

| Kiểm | Kết quả |
| --- | --- |
| 163 slug đích có trong DB | **163/163** |
| Trạng thái | **163/163 `draft`** — 0 bài đã publish |
| Thân bài rỗng | **0** — ngắn nhất 3 125 ký tự, trung vị 9 165, dài nhất 44 426 |
| 20 bài `RETIRED_410` | **vắng mặt hoàn toàn** — đúng, chưa từng được nhập |
| Bài tiếng Anh 14773 (`MANUAL_DECISION`) | **CÓ mặt** — draft **post 324** |

### Đối chiếu đủ 250 bài trên live

`Tất cả (250) · Đã xuất bản (18) · Bản nháp (230) · Riêng tư (2) · Thùng rác (1)`

Theo quy ước WordPress, "Tất cả (250)" **không** tính thùng rác, nên 250 là tổng
của publish + draft + private:

163 ứng viên + 1 bài tiếng Anh 14773 + 18 bài đã publish + 66 draft cũ của site
gốc + 2 riêng tư = **250**. Khớp chính xác. (1 bài trong thùng rác nằm ngoài,
không đụng tới.)

### Corpus Migration **không phải** importer

Màn hình `tools.php?page=gcalls-corpus-migration` tự ghi rõ: *"Tải ảnh bài viết
về site này và viết lại URL trong thân bài. Không đụng 18 bài publish, không đổi
trạng thái bài nào, không chạy importer."* Đây là công cụ **media**, không tạo
bài. Trong plugin không có importer nào đang chờ chạy cho 163 bài này.

---

## 2. Bản nháp trên live là bản sao trung thực của WXR

Đây là kiểm chứng chéo có sức nặng nhất trong phiên. Ba worker phân tích **file
WXR**; tôi đếm độc lập trên **database live**. Mọi con số trùng khít:

| Chỉ số | Phân tích WXR | Đếm trên DB live |
| --- | --- | --- |
| Ảnh trong thân bài | 704 | **704** |
| Link tuyệt đối `gcalls.co` | 288 | **288** |
| Tham chiếu `cdn.cdn.gcalls.co` (host chết) | 239 | **239** |
| Tham chiếu `cdn.gcalls.co` | 5 | **5** |
| `<img>` trỏ `gcalls.co/wp-content/uploads` | 456 | **456** |
| Link `googleusercontent.com` | 3 | **3** |
| Bài dính `data-sheets-*` | 22 | **22** |
| Bài dính DOM ChatGPT | 6 | **6** |
| SHA-256 thân bài khớp nguồn | 163/163 | — |

Nghĩa là: kết luận của cả ba worker áp dụng **trực tiếp** cho các draft đang nằm
trên live, không cần diễn giải lại. Bản nháp chưa hề được xử lý — vẫn nguyên URL
tên miền cũ.

**Và 163/163 bài không có ảnh đại diện** (`featured_media = 0`). Không bài nào có
`rank_math_title` hay `rank_math_description`.

Post id của 163 bài: `batch-postids-048.json`. Bản join từ `gc-db.sql` của
Worker D và bản đọc live của tôi **khớp 163/163**, xác nhận độc lập.

---

## 3. Bảng verdict hợp nhất — 163 dòng

`blog-verdicts-048.json`. Mỗi dòng gộp verdict của 3 chiều; verdict tổng lấy
**mức xấu nhất**, không lấy trung bình — một bài mà toàn bộ ảnh 404 thì không
phải "gần ổn" chỉ vì SEO parse được.

| Chiều | Kết quả |
| --- | --- |
| Nội dung (A) | `CONTENT_FIX` 95 · `MANUAL_REVIEW` 68 · `CONTENT_PASS` **0** |
| Media (B) | `MANUAL_REVIEW` 147 · `MEDIA_MISSING` 15 · `MEDIA_PASS` 1 |
| SEO/link (C) | `SEO_FIX` 145 · `MANUAL_REVIEW` 14 · `SEO_PASS` 4 |
| **Tổng** | `MANUAL_REVIEW` 148 · `MEDIA_MISSING` 14 · `CONTENT_FIX` 1 |

> **Sẵn sàng publish mà không cần quyết định của con người: 0/163.**

### 148 `MANUAL_REVIEW` không phải 148 quyết định riêng

146 trong số đó bị giữ vì **đúng một lỗ hổng chung**: WXR **không chứa item
attachment nào**, nên `_thumbnail_id` (có trên 162/163 bài) trỏ tới ID không tồn
tại trong file. Worker B khôi phục được 146 URL ảnh đại diện từ JSON-LD của
Schema Pro — nhưng đó là **suy luận, không phải bản ghi attachment**, và chưa URL
nào được tải về kiểm chứng.

Nếu đóng riêng lỗ hổng đó, bức tranh đổi hẳn:

| | Hiện tại | Sau khi fetch ảnh đại diện |
| --- | --- | --- |
| `MEDIA_PASS` | 1 | **90** |
| `MEDIA_FIX` | 0 | 57 |
| `MEDIA_MISSING` | 15 | 15 |
| **Tổng thể `MANUAL_REVIEW`** | **148** | **73** |

Đây là **phép chiếu, không phải kết quả**. Không thay cho việc tải thật.

---

## 4. Vì sao chưa publish bài nào

### 4.1 244/704 ảnh đã chết ngay tại nguồn

`cdn.cdn.gcalls.co` (lỗi search-replace nhân đôi subdomain trên site cũ) mang 239
tham chiếu và **không có bản ghi DNS A**. `cdn.gcalls.co` thêm 5 tham chiếu, phân
giải được nhưng từ chối HTTPS và 404 qua HTTP. Ánh xạ lại sang
`gcalls.co/wp-content/uploads/` trả 404 ở mọi mẫu thử — **không cứu được bằng
đổi host**.

**56 bài mất toàn bộ ảnh thân bài.** Nặng nhất: legacy 2784 (18/18), 861 (12/12),
1082 (11/11), 1198 (11/11). Những bài này lên trang sẽ là **tường chữ liền mạch**.
Đó là **thay đổi nội dung bằng cách lược bỏ** — quyết định biên tập, không phải
kỹ thuật.

456 tham chiếu còn lại trỏ `gcalls.co/wp-content/uploads/` đều trả 200 và tải
được bình thường.

### 4.2 Công cụ media: **NO-GO**, ba chặn độc lập

`class-corpus-migration.php` là công cụ đúng về mặt ý đồ, nhưng chưa chạy được:

**A — Không chạy nổi trên live.** Preflight (dòng 253) đòi
`$manifest['plugin_version'] === VERSION`. Mọi release từ 0.10.1 đều đóng gói
manifest vẫn đóng dấu `0.10.1`, kể cả bản đang chạy **0.10.8**. Nút "Bật ghi
thật" render `disabled`, và `ajax_step()` (dòng 512) chuyển sang `S_PAUSED_ERROR`
ở **mọi** bước — kể cả dry run. Đó chính là lý do màn hình vẫn đứng ở
`PREPARED · DRY RUN`: nó **chưa từng bước thành công lần nào**.
`qa-foundation.mjs:1393` đã có sẵn check cho đúng hiện tượng trôi này, nhưng
không chặn release.

**B — Không giới hạn được tập con. Không có pilot.** `importable_media()` trả về
**toàn bộ** 724 file; `step_posts()` duyệt **toàn bộ** 170 bài. Pha media phải
xong hết mới sang pha ghi thân bài. Nút "Tạm dừng" chỉ dừng driver JS, nên chạy
dở = "N mục đầu theo thứ tự URL" — một **tiền tố tuỳ tiện**, không phải tập con
được chọn. Không thể làm pilot 5 bài nếu không sửa code.

**C — Phạm vi không trùng 163 bài đã duyệt.** Chỉ 107/163 nằm trong tập
`ELIGIBLE`; **63 bài nó sẽ ghi lại không thuộc 163**, trong đó có **2 bài riêng
tư** (234, 297) và **post 324 — chính bài tiếng Anh 14773 mà chủ sở hữu đang tạm
gác**. `policy.hub_assignments` còn gán hub cho đúng bài đó.

**Điều công cụ làm đúng:** ba lớp bảo vệ độc lập cho 18 bài publish; không bao
giờ đổi `post_status`, title hay slug (`wp_update_post` chỉ truyền `post_content`);
`admin-ajax` không đăng ký `nopriv_`; idempotent theo URL và content hash.

**Rollback hẹp hơn tên gọi:** chỉ phục hồi `post_content` của `run_id` hiện tại.
**Không** phục hồi attachment (tới 724 file ở lại trên đĩa và trong thư viện —
code có ghi chú hứa "orphan report" nhưng `grep` không tìm thấy đoạn nào tạo ra
nó), không xoá `gcalls_corpus_media_map`, không gỡ hub đã gán. **Backup
UpdraftPlus mới là rollback thật.**

### 4.3 SEO: không có gì dùng lại được

Export mang meta **Yoast** (populated), nhưng live chạy **Rank Math** — không có
ánh xạ 1:1. **76/163 title chỉ là biến mẫu** (`%%title%%`…), 23 bài không có
title; chỉ **64 bài** có title viết tay thật. **0/263 bài có canonical.** Toàn bộ
163 bài mang `wp_schema_pro_optimized_structured_data` đóng băng, `@type` là
`NewsArticle` sai loại, `@id` trỏ tuyệt đối về `gcalls.co`, trong đó **13 trỏ
tới tiền tố WPML đã chết** (`/en/`, `/ja/`) — **phải bỏ khi import, không mang
theo**.

**84 link nội bộ chết** (20 đường dẫn khác nhau). Đề xuất ánh xạ độ tin cậy cao
đã có trong `seo-links-048.json`; riêng `/gcalls-tu-van-giai-phap-tong-dai/`
xuất hiện **57 lần** (banner CTA cuối bài) → `/lien-he/`.

**11 link không có đích vì site thiếu trang**, không phải lỗi bài viết: `/blog/`
(chưa có trang index blog trong 37 trang), `/chinh-sach-bao-mat/` và
`/dieu-khoan-dich-vu/` (**chưa tồn tại**). Và **33 bài mang 36 `_wp_old_slug`** —
URL cũ từng chạy được, hiện chưa có trong kế hoạch redirect nào.

### 4.4 PII và nội dung cần người quyết

- **Manifest media không hề đánh giá PII** — trường `reason` chỉ ghi trạng thái
  tải. **3 ảnh screenshot sẽ được import thật** (post legacy 16611), bytes đã tải
  về nhưng **chưa ai xem**. Không import khi chưa soi.
- **6 bài là output ChatGPT dán nguyên DOM** (`AIPRM__conversation__response`,
  `dark:bg-[#444654]`): legacy 15884, 15993, 15775, 16201, 16035, 15646. Gỡ
  wrapper là việc trình bày; **có nên đăng lại nội dung AI không công bố hay
  không là quyết định của chủ sở hữu**.
- **17741** `thu-thuat-tang-traffic-website-uy-tin-tai-trafficseo` — bài guest
  post bán link: 2 link dofollow ra `trafficseo.net`, là bài **duy nhất** trong
  163 không có bất kỳ link nào về `gcalls.co`. Đề xuất chuyển sang `RETIRED_410`.
- **2811** là "(Phần cuối)" trong khi "(Phần 1)" đã publish dưới bài **viết lại**
  với slug khác — đăng phần cuối ở URL cũ sẽ trỏ về một Phần 1 nay là bài khác.
- **439** không có h2/h3 nào: 531 từ prose liền khối. Thêm heading là sửa nội dung.
- **Chuỗi bài inbound/outbound bị gãy**: `phan-1` không nằm trong 163, không
  trong 18 bài live, cũng không trong danh sách retired.
- **221/704 ảnh thiếu alt** — nhưng 213 nằm trên CDN chết và sẽ bị bỏ, nên
  **chỉ 8 ảnh trên 5 bài** thực sự cần viết alt.

---

## 5. Không hồi quy

| Kiểm | Kết quả |
| --- | --- |
| **18 bài publish** so baseline | **18/18 khớp id + tiêu đề, 0 thay đổi** |
| Bài publish ngoài dự kiến | **0** |
| Số bài publish | **18**, đúng bằng baseline |
| 20 bài `RETIRED_410` | vẫn vắng mặt, chưa bài nào được publish |
| Ghi lên live trong phiên này | **không có** |

Baseline: `baseline-18-pre-import.json`.

---

## 6. Cần chủ sở hữu quyết trước khi publish

| # | Việc | Ghi chú |
| --- | --- | --- |
| 1 | **Tải + kiểm 146 URL ảnh đại diện** | Đóng lỗ hổng này đưa `MANUAL_REVIEW` 148 → 73 |
| 2 | **56 bài mất toàn bộ ảnh** | Đăng dạng tường chữ, hay giữ lại chờ ảnh mới? |
| 3 | **15 bài không có ảnh đại diện** | 14502, 14568, 14870, 15221, 15332, 15380, 15681, 15713, 15765, 16131, 16145, 16176, 16271, 16324, 17741 |
| 4 | **3 screenshot chưa soi PII** (post 16611) | Phải xem trước khi import |
| 5 | **6 bài ChatGPT** | Đăng lại hay không |
| 6 | **17741 trafficseo** | Đề xuất `RETIRED_410` |
| 7 | **2811 / chuỗi phan-1** | Gộp hay retire |
| 8 | **Post 324 (14773 tiếng Anh)** | Đã nằm trong DB dù dry-run loại trừ — giữ draft hay xoá? |
| 9 | **44 bài `REBUILD_UPDATE_TOPIC` chưa có slug mới** | Chưa quyết được thì chưa lập được redirect |
| 10 | **Sửa `plugin_version` trong manifest** | Chặn A; là thay đổi code + release, không sửa trên màn hình live |

Chặn cũ vẫn còn hiệu lực, phiên này không bỏ qua: Gate A1 (repo Public + lịch sử
PII), Gate A2 (media PII công khai), SMTP, page cache cho `/lien-he/`.

---

## 7. Sản phẩm bàn giao

| File | Nội dung |
| --- | --- |
| `blog-verdicts-048.json` | **Bảng 163 dòng hợp nhất** — verdict 3 chiều + tổng, post id live, blocker |
| `content-fidelity-048.json` | Worker A — SHA-256, HTML, shortcode, trùng lặp |
| `media-map-048.json` | Worker B — 867 tham chiếu ảnh, hành động đề xuất, ước tính dung lượng |
| `seo-links-048.json` | Worker C — SEO, slug, 288 link nội bộ, 2 đề xuất redirect |
| `batch-postids-048.json` | Worker D — batch → legacyId → **post id live** → trạng thái |
| `baseline-18-pre-import.json` | Baseline 18 bài publish |
| `wordpress/scripts/merge-048-verdicts.mjs` | Script gộp verdict |
| `wordpress/scripts/batch-acceptance-048.mjs` | Acceptance vi sai trước/sau, exit≠0 khi fail |

Nếu bước tiếp theo là **publish chọn lọc** thì đó là đường sạch nhất: không cần
importer, chỉ đổi status trên tập post id đã biết trong `batch-postids-048.json`,
và rollback = đặt lại đúng các id đó về `draft`.

**Ước tính dung lượng nếu localise media:** 443 attachment, tải 78,9 MiB bản gốc,
derivative ~75,0 MiB, **cần trống ~233 MiB** — chưa tính 144 URL ảnh đại diện
chưa kiểm (thêm ~15–26 MiB, nâng tổng attachment lên ~587).
