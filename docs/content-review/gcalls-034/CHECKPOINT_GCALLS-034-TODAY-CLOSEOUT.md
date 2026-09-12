# CHECKPOINT GCALLS-034 — TODAY CLOSEOUT

Ngày: 2026-08-31. Live: **Core 0.10.0**, **Theme 0.8.5** (không đổi trong phiên này).

**Không tuyên bố hoàn tất website.** PII chưa được gỡ, Batch 2 chưa chạy được,
visual release chưa bắt đầu. Chi tiết bên dưới.

Quy ước: PII chỉ gọi bằng mã asset, không in lại dữ liệu gốc.

| Mã | Attachment ID | File |
| --- | --- | --- |
| PII-01 | 35 | `…advanced-filter-desktop-v1.webp` |
| PII-02 | 38 | `…click-to-call-config-desktop-v1.webp` |
| PII-03 | 40 | `…contact-profile-desktop-v1.webp` |
| PII-04 | 42 | `…integrations-desktop-v1.webp` |
| PII-05 | 39 | `…webphone-desktop-v1.webp` |

---

## Tóm tắt trạng thái

| Hạng mục | Trạng thái |
| --- | --- |
| A. PII website | **BLOCKED** — không containment được bằng quyền hiện có |
| A. PII git | **REPOSITORY_STILL_PUBLIC** — mọi push đã dừng |
| A3. Sanitized v2 | **PASS** — 5/5 qua toàn bộ gate |
| B. Batch 2 | **KHÔNG CHẠY** — chưa nhận `CORE_0.10.1_UPLOADED` |
| C. Visual release 0.10.2 | **KHÔNG BẮT ĐẦU** — phụ thuộc A và B |
| D. Form | Visual preview giữ nguyên; runtime **chưa merge** |
| E. Deploy | **KHÔNG THỰC HIỆN** |

---

## A1. Inventory chính xác

### Bốn remote branches chứa `a1832c0`

- `origin/feature/gcalls-wordpress-migration`
- `origin/feature/gcalls-batch2-integrations`
- `origin/feature/gcalls-all-pages-content`
- `origin/feature/gcalls-website-foundation`

Không có trên `main`. Repo: `wcorenoiluc-dev/Gcalls-website-app`,
`private: false`, `visibility: public`, 0 forks, 0 watchers.

### Năm source image paths

Tất cả dưới `public/images/products/gcalls-plus/`, mỗi blob xuất hiện ở **đúng
một path**, không rename, không copy — đã kiểm bằng cách duyệt mọi tree trong
`git rev-list --all`.

### Attachment IDs — đính chính so với GCALLS-033

Báo cáo hôm qua ghi "4 attachment" và "click-to-call-config chưa xác minh".
Đã xác minh: **cả 5 đều nằm trong Media Library**. PII-02 là **orphan** — không
trang nào dùng, nhưng vẫn được phục vụ công khai.

### Số URL công khai — đính chính: 20, không phải 12

Mỗi asset sinh 4 kích thước (`full`, `medium 300`, `thumbnail 150x150`,
`medium_large 768`). Con số 12 hôm qua chỉ đếm URL **được render trên trang**;
bản `150x150` không xuất hiện trong markup nên bị bỏ sót, và PII-02 không được
đếm vì không trang nào dùng.

- 5 asset × 4 size = **20 URL** dưới `/wp-content/uploads/2026/08/`
- 12 trong số đó được `/gcalls-plus-webphone/` render trực tiếp
- 8 còn lại chỉ truy cập được nếu biết URL

HTTP/cache status (đo trên PII-03, đại diện):

```
200 · content-type: image/webp
cache-control: public, max-age=604800     ← bản cache sống 7 ngày
expires: Mon, 07 Sep 2026
x-robots-tag: noindex, nofollow, noarchive, nosnippet, noimageindex
```

`x-robots-tag` là điểm giảm nhẹ thật: search engine được yêu cầu không index.
Không thấy header CDN/edge (`x-cache`, `cf-cache-status`) trên đường dẫn uploads.

### Page/reference đang dùng

Quét toàn bộ **38 pages**: chỉ `page#47 /gcalls-plus-webphone/` render PII-01,
-03, -04, -05. PII-02 không được dùng ở đâu.

Tham chiếu **không nằm trong nội dung trang**. Nội dung thật của page 47 chỉ là
83 ký tự: `[gcalls_product_page id="gcalls-plus"]`. Ảnh do plugin render qua
`[gcalls_media id="GP-XX"]` → `Importer::find_media()` → tra post meta
`_gcalls_media_id`.

Mapping đã xác định từ `product-pages.json` live ghép với thứ tự render:

| Media ID | Attachment | Mã |
| --- | --- | --- |
| `GP-03` | 35 | PII-01 |
| `GP-09` | 39 | PII-05 |
| `GP-10` | 40 | PII-03 |
| `GP-12` | 42 | PII-04 |

### 20 screenshot cách ly

Đã chuyển ra `scratchpad/PII-QUARANTINE/` từ GCALLS-033, vẫn nằm ngoài repo.

---

## A2. Website containment — BLOCKED

Đã hoàn thành bước 1 và 2:

1. **Sao lưu có kiểm soát** — 5 file gốc trong
   `PII-QUARANTINE/originals/`, ngoài repo và ngoài public web root.
2. **SHA-256 đã lưu và đối chiếu** — cả 5 bản live **khớp byte** với bản cách ly
   (so sánh hash trong trình duyệt, chỉ trả về boolean, không in hash ra report).

Bước 3–5 **không thực hiện được**. Lý do kỹ thuật, đã kiểm chứng từng khả năng:

| Cách | Kết quả |
| --- | --- |
| Sửa nội dung page 47 | Không được — ảnh không nằm trong content, chỉ có shortcode |
| Sửa `product-pages.json` của plugin | Cần quyền file trên server; không có SSH/1Panel |
| Trỏ `_gcalls_media_id` sang placeholder | Meta **không đăng ký `show_in_rest`** và attachment **không có UI Custom Fields** → không ghi được từ wp-admin |
| Plugin "replace media" | Không có. Site chỉ cài Elementor, Gcalls Core, Rank Math, UpdraftPlus |
| WordPress image editor (crop/scale) | Ghi ra file `-e{timestamp}` mới; file gốc **vẫn nằm nguyên** ở URL cũ → không containment |
| Chạy importer để gán lại media | Ngoài phạm vi và rủi ro cao; không thực hiện |

Placeholder đã dựng sẵn (4 ảnh, đúng kích thước gốc để không gây layout shift,
`~4.5–4.9KB`) nhưng **không có đường đưa vào trang**, nên chưa dùng.

**Kết luận:** với quyền hiện có, chỉ có **xoá attachment** mới thực sự gỡ được
PII khỏi 20 URL. Đó là A4 và cần chủ sở hữu.

> Không tuyên bố PII đã được gỡ. Trang vẫn đang render 12 URL, và cả 20 URL vẫn
> trả 200 kèm bytes gốc.

### `PUBLIC_MEDIA_CACHE_BLOCKED`

Chưa purge được OneShield/CDN. Ngay cả sau khi xoá, `max-age=604800` nghĩa là
bản đã cache còn sống tới **07/09/2026** nếu không purge thủ công.

---

## A3. Sanitized v2 — PASS

Năm derivative `-v2` đã dựng và qua **toàn bộ** gate.

### Cách làm và vì sao

Che **theo vùng**, không theo từ. OCR ở cỡ chữ ~8px của giao diện gần như không
đọc được gì (152 từ trên ảnh dày đặc, và chỉ 1 hit khớp mẫu PII — đúng một ký tự
`@`), nên bất kỳ cách che nào dựa trên bounding box của OCR đều sẽ **bỏ sót**.
Vì vậy mọi panel chứa dữ liệu bị phủ kín bằng **lớp đặc**, rồi vẽ lại nội dung
demo. OCR chỉ dùng để **xác minh** sau đó, trên bản phóng 4× của output.

Phát hiện quan trọng: ảnh nguồn chứa PII **nhiều hơn hẳn** những gì manifest
GCALLS-032 ghi — toàn bộ danh bạ trái (~20 tên + số), toàn bộ danh sách cuộc gọi
phải, header liên hệ, email, điện thoại, chip tài khoản, dòng hoạt động, và tên
nhóm có chứa tên người. Bản v1 che thiếu ở diện rộng, đó là lý do nó bị BLOCKED.

Ánh xạ thay thế đúng quy ước đã chốt: username → `gcalls_demo`, nhân viên →
`Nhân viên 01`, liên hệ → `Khách hàng A`, điện thoại → `090 *** **12`, email →
`demo@example.com`, URL → `icon-demo.svg`, công ty → `Công ty Demo`,
ID/token → `demo-000X`.

### Kết quả gate

| Gate | Kết quả |
| --- | --- |
| Visual inspection ở kích thước gốc | PASS — soi từng ảnh, 4 lỗi tìm thấy và đã sửa |
| OCR/regex (email, phone, URL, domain, IP, username, token) | PASS 5/5 |
| Metadata/EXIF scan | PASS — không exif/icc/iptc/xmp |
| Secret / embedded-string scan | PASS — `strings` sạch cả 5 |
| Không upscale | PASS — output = source ở cả 5 |
| PII trong filename/alt/caption | PASS — tên file chỉ mô tả tính năng |

Bốn lỗi bắt được bằng mắt mà OCR **không** bắt được, đã sửa:

1. Số hotline thật lộ ở `x452–500` — nằm lệch khỏi vị trí header gợi ý.
2. Avatar chữ cái đầu tên thật (`H`) nằm **ngoài** khung che dòng hoạt động.
3. Lớp che avatar vẽ sau nên cắt mất `gc` của `gcalls_demo`.
4. Chữ demo trong bảng lệch dần (bước hàng thật 18,75px, không phải 19,2px).

Ngoài ra một dương tính giả bị loại: OCR đọc chữ demo `00/00/00` của chính tôi
thành `0500100`; đã đổi sang `hôm nay`.

### Sản phẩm

`docs/content-review/gcalls-034/media-v2/` — 5 file, kèm script dựng
(`build-media-v2.mjs`) và script gate (`verify-media-v2.mjs`) để chạy lại được.

| File | Kích thước | Dung lượng | sha256 (16 ký tự đầu) |
| --- | --- | --- | --- |
| `…advanced-filter-desktop-v2` | 821×704 | 24,3 KB | `da65a8e1e19cc4a1` |
| `…click-to-call-config-desktop-v2` | 809×352 | 18,2 KB | `9e4eb653c952e841` |
| `…contact-profile-desktop-v2` | 809×440 | 37,8 KB | `f5f1836bcd1ce227` |
| `…integrations-desktop-v2` | 809×494 | 42,2 KB | `3445d4a84894f044` |
| `…webphone-desktop-v2` | 809×429 | 39,3 KB | `2348e6db045e9afb` |

**Chưa upload và chưa push** — xem A5.

---

## A4. Media Library — dừng tại gate

Bốn điều kiện tiền xoá đã xác nhận:

- Attachment ID và đủ generated sizes: **xong** (5 ID, mỗi cái 4 size).
- Không trang nào khác dùng: **xong** (quét 38 pages; chỉ page 47, PII-02 orphan).
- v2 đã live: **CHƯA** — không có đường đưa v2 lên (xem A2).
- Snapshot/hash giữ ngoài public web root: **xong**.

> **`READY_TO_DELETE_OLD_MEDIA` — cần chủ sở hữu.**

Tôi không tự xoá: đây là xoá vĩnh viễn dữ liệu, và điều kiện "v2 đã live" chưa
đạt nên xoá ngay sẽ để lại khoảng trống trên trang (plugin render rỗng khi thiếu
attachment — hành vi này có chủ đích, không phải ảnh vỡ).

Thứ tự tôi đề nghị, và lý do đảo so với A2/A3:

1. **Xoá 5 attachment ngay** nếu chấp nhận trang tạm khuyết 4 ảnh. Đây là bước
   duy nhất thật sự dừng phơi nhiễm, và khoảng trống là vô hại.
2. Purge cache WordPress + OneShield + CDN.
3. Kiểm 20 URL cũ, tối thiểu 3 request liên tiếp mỗi URL; PASS chỉ khi tất cả
   trả 404/410.
4. Sau đó mới đưa v2 lên qua Core 0.10.2 (C), nơi media mapping được gán đúng
   bằng quy trình release thay vì sửa tay.

---

## A5. Git containment — `REPOSITORY_STILL_PUBLIC`

Repo vẫn `private: false`. Theo brief, **mọi push đã dừng**. v2 **không** được
push lên bất kỳ branch nào đang mang lịch sử PII.

Đã chuẩn bị:

- **Backup bundle** `pre-purge-all-refs.bundle` (97,0 MB), `git bundle --all`,
  nằm ngoài repo và ngoài public web root.
- **Bản đồ commit/path** — 1 commit (`a1832c0`), 5 path, 5 blob, không rename,
  không copy.
- **Lệnh `git filter-repo` chính xác** — `PURGE-RUNBOOK.md`.

Lưu ý chặn: **`git-filter-repo` chưa được cài** trên máy này (cả binary lẫn
module Python; Homebrew cũng không có). Runbook ghi cách cài. `git filter-branch`
cố ý không được đề xuất thay thế.

> Chưa chạy rewrite hay force-push. Đang chờ `AUTHORIZE_TARGETED_PII_HISTORY_PURGE`
> **và** repo chuyển Private trước.

Purge lịch sử **không** ảnh hưởng phơi nhiễm website — hai đường độc lập.

---

## B. Batch 2 — không chạy

Chưa nhận `CORE_0.10.1_UPLOADED`. Fingerprint live vẫn `?ver=0.10.0`.
Baseline "before" cho 6 route đã có từ GCALLS-033
(`gcalls-033/before/batch2-baseline-core-0.10.0.json`): cả 6 là vỏ rỗng,
125–139 từ, 0 FAQ, không overflow ở 5 breakpoint.

## C. Visual release Core 0.10.2 — không bắt đầu

Điều kiện vào (A containment PASS **và** B PASS) đều chưa đạt.

Đã sẵn sàng từ GCALLS-033, chưa đóng gói: regroup 18→13 section, seam 50px,
đường ship đúng là regenerate `homepage-elementor.json` (không dùng `!important`
cho production). Ba ảnh thật PASS đã chọn.

**Mockup hư cấu** — chưa loại, vì chưa build package. Danh sách cần xử lý ở C:
`agent-performance.webp`, `analytics-dashboard.webp` và 4 file cùng lô 1600×900
đang render trên hero Gcalls Plus, chứa `1.248`, `CSAT 4.7/5`,
`UNAPPROVED_DOMAIN_01`, tên người và doanh nghiệp hư cấu. Gate repository-wide cho
các chuỗi này sẽ chạy khi build 0.10.2.

## D. Form

Visual preview giữ nguyên từ GCALLS-033 (default + error, không `<form>`,
không action, không script). **Chưa thêm success preview** — sẽ làm cùng C.
Runtime **chưa merge**; 6 điều kiện chưa cái nào được xác nhận.

## E. Deploy — không thực hiện

Không package, không upload, không Homepage Layout, không Regenerate, không purge.

## 18 bài và Corpus

`verify-blog-batch-01.mjs`: **PASS** — 18 bài, 29.248 từ, 97 câu FAQ.
Corpus **không đụng tới**. `git status` chỉ có file mới chưa track trong `docs/`;
không file theo dõi nào bị sửa.

---

## Incident timeline

| Thời điểm | Sự kiện |
| --- | --- |
| 2026-08-18 | `a1832c0` đưa 5 derivative thiếu mask vào Git |
| 2026-08-28 16:29 GMT | 5 ảnh upload lên WP Media Library (ID 33–45) |
| 2026-08-30 | GCALLS-033 phát hiện: đã push, repo public |
| 2026-08-30 | Phát hiện thêm: 4 ảnh đang render công khai; cách ly 20 screenshot |
| 2026-08-31 | Xác minh cả 5 đều trong Media Library; số URL thật là 20 |
| 2026-08-31 | Backup + hash đối chiếu; xác định A2 không containment được |
| 2026-08-31 | Dựng và verify xong 5 bản `-v2` (PASS) |
| 2026-08-31 | Backup bundle + runbook purge; dừng tại 2 gate |

## Rollback artifacts

| Artifact | Vị trí |
| --- | --- |
| 5 ảnh gốc + hash | `PII-QUARANTINE/originals/` (ngoài repo) |
| Backup toàn bộ ref | `PII-QUARANTINE/git/pre-purge-all-refs.bundle` |
| 20 screenshot chứa PII | `PII-QUARANTINE/` |
| Rollback Core | 0.10.0 đang live; không có gì để rollback |

---

## Việc còn cần chủ sở hữu

1. **Chuyển repo sang Private.** Rẻ nhất, nhanh nhất, và đang chặn mọi thứ phía Git.
2. **Xoá 5 attachment** (ID 35, 38, 39, 40, 42) trong wp-admin → token
   `READY_TO_DELETE_OLD_MEDIA`. Đây là bước duy nhất thật sự dừng phơi nhiễm web.
3. **Purge OneShield/CDN** sau khi xoá; cache sống tới 07/09/2026 nếu không purge.
4. **Cài `git-filter-repo`** rồi cấp `AUTHORIZE_TARGETED_PII_HISTORY_PURGE`.
5. **Upload `gcalls-core-0.10.1.zip`** → token `CORE_0.10.1_UPLOADED` để chạy B.
6. **Xác nhận hướng xử lý ảnh dựng số liệu bịa** trên hero Gcalls Plus.

Hoặc, nếu muốn có đường đưa v2 lên trang mà không chờ 0.10.2: cấp quyền file
(SSH/1Panel) để sửa `product-pages.json`, hoặc cài một plugin cho phép ghi post
meta — cả hai đều cần chủ sở hữu quyết.
