# GCALLS-035 — Incident record (PII derivatives)

Local/private. **Không nhúng ảnh PII vào file này** — chỉ ID, filename, hash.
Ngày lập: 2026-09-01. Trạng thái: **chưa xoá gì, chưa push gì.**

## 1. Năm attachment được uỷ quyền xoá

Token yêu cầu: `AUTHORIZE_DELETE_MEDIA_IDS_35_38_39_40_42` — **chưa nhận**.

| Mã | Attachment ID | Filename (`/wp-content/uploads/2026/08/`) | Kích thước gốc | Bytes | SHA-256 (live == backup) |
| --- | --- | --- | --- | --- | --- |
| PII-01 | 35 | `gcalls-plus-advanced-filter-desktop-v1.webp` | 821×704 | 23 020 | `adf8896d6a0efe91306ba57b3c81f9fd35c075c14124f687dcf125d704f5b753` |
| PII-02 | 38 | `gcalls-plus-click-to-call-config-desktop-v1.webp` | 809×352 | 16 868 | `3069220d5fe8e7856d75cc7c21e44648abe45e854a7de59c8dd1ab8999aa3137` |
| PII-05 | 39 | `gcalls-plus-webphone-desktop-v1.webp` | 809×429 | 34 468 | `7e5b9d4729cd92fa8320dc93cab18095e108ff1b0ab0402a5895217e69086450` |
| PII-03 | 40 | `gcalls-plus-contact-profile-desktop-v1.webp` | 809×440 | 33 880 | `84dd46837304c6796cdaa381e72eb1895c24c334e796fa9bdfea14435b3bf979` |
| PII-04 | 42 | `gcalls-plus-integrations-desktop-v1.webp` | 809×494 | 37 100 | `3936f9e8f1fe3a9a0270334c1aed8fd11defbec17d924cd4366af3615a4e7054` |

Không attachment nào khác được phép xoá.

Mapping media id → attachment (từ post meta `_gcalls_media_id`): `GP-03`→35,
`GP-09`→39, `GP-10`→40, `GP-12`→42. PII-02 (38) là **orphan**, không trang nào
tham chiếu nhưng vẫn được phục vụ công khai.

## 2. Backup — đã dựng lại (bản GCALLS-034 đã mất)

Bản cách ly của GCALLS-034 nằm trong `scratchpad/` của phiên cũ dưới `/private/tmp`
và **đã bị xoá cùng /tmp**: cả 5 ảnh gốc, 20 screenshot, và bundle 97 MB đều không
còn. Đã dựng lại toàn bộ trong phiên này.

Vị trí mới, ngoài repo và ngoài public web root, quyền `go-rwx`:

    /Users/macos/Desktop/Gcalls/PII-QUARANTINE-035/
      originals/          5 file gốc
      all-20-sizes/       cả 20 URL đã tải về (đủ để khôi phục nguyên trạng)
      SHA256SUMS-originals.txt
      SHA256SUMS-all-20.txt
      pii-urls-20.txt
      git/pre-purge-all-refs.bundle   (97 MB, 15 ref)
      git/SHA256SUM-bundle.txt

**Đối chiếu hash:** 5/5 bản backup **khớp byte với bản live** trên
`ashernguyenxuanthuy.com` (tải về, hash, so sánh, xoá bản tạm). Cũng khớp với bản
trong working tree Git. → điều kiện *"SHA-256 backup khớp nguồn"* **PASS**.

Đính chính kỹ thuật: lệnh `git bundle create … --all` mà runbook GCALLS-034 ghi
tạo ra bundle chỉ chứa **1 ref** trên repo này (git loại các ref còn lại kèm cảnh
báo `excluded by the rev-list options`). Bundle mới liệt kê ref tường minh và
`git bundle list-heads` xác nhận đủ **15 ref**, gồm cả refs/pull.

## 3. Hai mươi URL công khai

Liệt kê đầy đủ trong `PII-QUARANTINE-035/pii-urls-20.txt`, lấy từ
`/wp-json/wp/v2/media/{id}` (không đoán), 5 asset × 4 size:
`full`, `medium`, `medium_large 768`, `thumbnail 150x150`.

Đo lúc 2026-09-01: **20/20 vẫn trả bytes ảnh** (`206`/`image/webp` khi request
range). Header đại diện (PII-03 full):

    HTTP/2 200 · content-type: image/webp · content-length: 33880
    cache-control: public, max-age=604800
    expires: Tue, 08 Sep 2026 01:30:31 GMT
    last-modified: Fri, 28 Aug 2026 16:29:05 GMT
    x-robots-tag: noindex, nofollow, noarchive, nosnippet, noimageindex

Không thấy header CDN/edge trên đường dẫn uploads. `max-age` 7 ngày nghĩa là bản
đã cache sống tới **2026-09-08** nếu không purge thủ công.

## 4. Năm ảnh v2 — vẫn PASS

Chạy lại gate hôm nay trên `docs/content-review/gcalls-034/media-v2/`:

- OCR 4× + regex (email, số dài, URL, domain, IP, username đã biết, token): **PASS 5/5**
- Metadata (exif/icc/iptc/xmp): **PASS 5/5**
- `strings`: 5/5 sạch — các hit ban đầu là nhiễu nhị phân của webp, không phải chuỗi đọc được
- Không upscale: **PASS 5/5**, v2 trùng đúng kích thước v1

SHA-256 của v2 trùng với bảng ghi trong GCALLS-034 → file không đổi kể từ đó.
Script chạy lại: `docs/content-review/gcalls-035/verify-media-v2.mjs`
(bản 034 trỏ vào scratchpad đã mất nên không chạy được).

## 5. Renderer khi thiếu attachment — đã kiểm bằng code

`Shortcodes::media()` (`class-shortcodes.php:583`) trả `''` khi
`Importer::find_media()` không tìm ra attachment, và shortcode được ghép **trần**
vào `<section>` (`:1009`) — không `<figure>`, không caption, không fallback URL.

→ Xoá attachment tạo **vùng rỗng có kiểm soát**: section giữ eyebrow/heading/lead,
mất đúng ảnh. Không raw URL, không icon ảnh vỡ. Vẫn phải xác nhận lại trên live
sau khi xoá.

## 6. Git — inventory đã xác minh lại hôm nay

Một commit: `a1832c051741a5bbeb5730c5babc519f4c2dc25d` (2026-08-18), parent
`1d056dc7`. Commit này thêm 12 webp; chỉ **5** trong số đó nằm trong phạm vi purge.

| Blob (đủ 40) | Path |
| --- | --- |
| `f98ea14c588203a694512d7f57647241bceaa262` | `public/images/products/gcalls-plus/gcalls-plus-advanced-filter-desktop-v1.webp` |
| `40cec62ff6c24a6ea3fbf245f74bd9897e687204` | `public/images/products/gcalls-plus/gcalls-plus-click-to-call-config-desktop-v1.webp` |
| `249f22fd39551c4d664d42322dc2e3e51cba072d` | `public/images/products/gcalls-plus/gcalls-plus-contact-profile-desktop-v1.webp` |
| `e8900d80286857dfc8e17ef5bbf10570dc69d6fe` | `public/images/products/gcalls-plus/gcalls-plus-integrations-desktop-v1.webp` |
| `88a881c4f397bed4369f7c3e79399b8a83b32cf8` | `public/images/products/gcalls-plus/gcalls-plus-webphone-desktop-v1.webp` |

Mỗi blob ở đúng một path, không rename, không copy.

### Ref nào bị ảnh hưởng

| Ref | Old tip SHA | `a1832c0` là ancestor | Blob ở tip |
| --- | --- | --- | --- |
| `refs/heads/feature/gcalls-all-pages-content` | `1f5fa57aab7b05c3749e12d8a232a9fc9c38df8c` | có | 5 |
| `refs/heads/feature/gcalls-batch2-integrations` | `a68f386e88723cffbd6c4f1aec346ff664360952` | có | 5 |
| `refs/heads/feature/gcalls-website-foundation` | `1f9baac7c7a36d84d75a0ee760a26c250a7e792e` | có | 5 |
| `refs/heads/feature/gcalls-wordpress-migration` | `25f0420ef52eb985cc2bca3317b83cc5c7360812` | có | 5 |
| `refs/heads/main` | `21f90842c233e465f4eed41bb6ed0847168bf71b` | **không** | 0 |
| `refs/tags/gcalls-website-demo-v1` | `cd3b77ad4e0042a2fd044cb38b4b06706e72a97b` | **không** | 0 |
| `refs/pull/1/head` | `003662edef6ec3a514e3fbdba265be2169817b06` | **không** | 0 |
| `refs/pull/2/head` | `1f9baac7c7a36d84d75a0ee760a26c250a7e792e` | **có** | 5 |
| `refs/pull/2/merge` | `1527c669d5072834ac144476d22239b609934145` | **có** | 5 |

`main`, tag và PR#1 **không được rewrite** (quy tắc 6 của Gate 3).

### Phát hiện mới, không có trong GCALLS-034: PR refs

`refs/pull/2/head` và `refs/pull/2/merge` mang đủ 5 blob. **Chủ repo không thể
force-push hay xoá refs/pull/\*** — đó là ref phía máy chủ, chỉ đọc. Nghĩa là:

- History purge + force-push cả 4 branch **vẫn để lại** 5 blob truy cập được qua
  `git fetch origin refs/pull/2/head` **chừng nào repo còn public**.
- Vì vậy **Gate 1 (chuyển Private) mới là containment thật cho phía Git**; Gate 3
  là dọn dẹp, và chỉ khép kín sau khi GitHub Support GC các object không còn
  reachable **và** xử lý PR refs.

### Không có

`0` release, `0` release asset, `0` tag trên remote, `0` fork, không dùng Git LFS.

### Việc local chưa push cần bảo toàn

`feature/gcalls-wordpress-migration` local đang **6 commit** trước remote
(`fb18a72` → `d8d8615`). Không commit nào chạm 5 path PII, nhưng sau rewrite
chúng phải được replay lên lịch sử mới, nếu không sẽ mất.

Ngoài ra worktree `/private/tmp/gcalls-content` đã biến mất cùng /tmp và đang ở
trạng thái `prunable`; vô hại với purge (chạy trên mirror clone mới), chỉ cần
`git worktree prune` khi tiện.
