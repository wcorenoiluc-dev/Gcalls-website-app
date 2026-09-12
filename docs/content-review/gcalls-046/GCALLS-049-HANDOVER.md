# GCALLS-049 — Pilot 8 bài blog (draft) · Bàn giao cho coordinator

**Worker role:** chỉ đọc/dựng payload + kiểm scope. Không đăng nhập, không Chrome/wp-admin,
không ghi DB, không nhấn Execute. Các bước có đăng nhập (preflight, ghi DB, preview,
đọc lại 8 draft, so PROTECTED_18 / PAGES_37) **thuộc coordinator**. Vì vậy
**KHÔNG** phát PILOT_DRAFT_8_OF_8_PASS ở lần này — chưa đọc lại được 8 bài trên demo.

## 1. Danh sách 8 bài + nguồn + hash

Nguồn payload: `wordpress/dist/blog-corpus-manifest.json` (bản rebuild đã chuẩn bị).
CSV chốt: `batch-1-dryrun.csv` — SHA-256 `99f645a4aa2c7748b31358e3a258dda323abbdb51a34591ab75a77a574b02aae`.
Manifest pilot đã dựng (scope đúng 8): `pilot-8-manifest.json` — SHA-256
`3152fb017def9de20314cb66e71a98e41493e2820e8568a2629961593864eb99`.

| # | legacy ID (nguồn cũ) | importer id / `_gcalls_source_id` | status | body SHA-256 (12) | slug (KEEP_URL) |
| --- | --- | --- | --- | --- | --- |
| 1 | 588 | legacy-588 | draft | 31dfd2f263d2 | call-center-la-mot-trai-nghiem-thuong-hieu-trong-nganh-dich-vu-suc-khoe |
| 2 | 2784 | legacy-2784 | draft | 7298618865e0 | loi-ich-ma-giai-phap-tich-hop-dien-thoai-may-tinh-dem-den-cho-call-center |
| 3 | 1231 | legacy-1231 | draft | f6e898c077e3 | tuong-lai-cua-tong-dai-doanh-nghiep-10-xu-huong-noi-bat-nhat |
| 4 | 2811 | legacy-2811 | draft | bd1e47b072b0 | call-center-diem-khac-biet-giua-on-premises-va-cloud-call-center-phan-cuoi |
| 5 | 603 | legacy-603 | draft | 8e32afc59ae3 | 10-thong-ke-ve-he-thong-voip-chung-minh-tam-quan-trong-cua-cong-nghe |
| 6 | 15738 | legacy-15738 | draft | 9997ca022e2f | tai-sao-dich-vu-tong-dai-ao-danh-cho-startup-bung-no-2023 |
| 7 | 13483 | legacy-13483 | draft | c0b63b8ca3a7 | tong-dai-cong-nghe-la-gi-co-nen-dau-tu-vao-tong-dai-ao |
| 8 | 654 | legacy-654 | draft | 0eba4c58af99 | 5-loi-ich-cua-viec-su-dung-bao-cao-tong-dai-call-center-phan-cuoi |

**Nguồn cũ ≠ body nhập.** Cả 8 là `decision=REBUILD_KEEP_URL`, `hasEditedBody=false`:
KEEP_URL chỉ giữ **slug/URL cũ**; **body là bản rebuild** trong manifest (8.9k–44.8k ký tự),
không phải post_content gốc gcalls.co. body SHA ở trên là của bản rebuild sẽ nhập.

Loại trừ đã kiểm: không có bài nào trong 44 UPDATE_TOPIC, 20 retired, bài tiếng Anh 14773,
hay 18 bài đang publish. Tất cả `status=draft`, `hub=HUB-01`.

## 3. Scope importer — GO/NO-GO (đã audit `class-importer.php`, `class-admin.php`, `class-cli.php`)

**Importer KHÔNG có allowlist theo source ID.** `run()` chỉ lọc theo **section**
(`only ∈ {hubs,media,pages,articles,elementor,menus,redirects}` — `class-importer.php:105`).
`only=['articles']` nhập **toàn bộ** `articles` trong manifest được truyền vào, không phải 8.
→ Scope 8 phải đến từ **nội dung manifest**, không từ tham số importer.

- **Nút Execute trong wp-admin = NO-GO cho pilot.** `class-admin.php:429-446` chạy `run()`
  trên manifest được chọn với `dry_run = empty($_POST['confirm'])`. Nếu trỏ vào manifest
  Corpus đầy đủ, `only=articles`+confirm sẽ nhập **cả ~163 bài**; bỏ trống `only` còn chạy
  pages/redirects/elementor. Không giới hạn được 8. **Không nhấn.**
- **Đường an toàn = WP-CLI với manifest pilot đã scope + `--only=articles`, dry-run trước.**
  `class-cli.php` nhận `--path=<manifest>`; `dry_run` mặc định, chỉ ghi khi có `--execute`.
  Truyền `pilot-8-manifest.json` (đúng 8 articles, retired/redirects rỗng) → nhập đúng 8.

  ```
  wp gcalls validate --path=pilot-8-manifest.json
  wp gcalls import   --path=pilot-8-manifest.json --only=articles          # dry-run
  # coordinator xác nhận report: created=8, errors=0, không đụng section khác
  wp gcalls import   --path=pilot-8-manifest.json --only=articles --execute # ghi draft
  wp gcalls rollback --execute   # nếu cần, chỉ xoá bài mang _gcalls_source_id lần chạy này
  ```

**Draft từ server:** `status_for()` mặc định `draft`, chỉ publish khi item ghi rõ `publish`
(`class-importer.php:535`). Cả 8 = draft → không publish. ✓

**Bảo toàn 18 bài (force=false):** bài đã tồn tại + không force → chỉ `apply_derived`
(refresh meta), **không** ghi đè body (`class-importer.php:288-296`). 8 pilot không trùng 18. ✓

## Rủi ro coordinator phải xử lý (có đăng nhập)

1. **Dedup KHÔNG bắt trash.** `find_existing()` dùng `post_status=>'any'`
   (`class-importer.php:507`) — WP loại `trash`/`auto-draft` khỏi `any`. Nếu 1 trong 8 slug
   đang ở **trash**, importer không thấy → `wp_insert_post` tạo slug `-2`, **vỡ KEEP_URL**.
   → Preflight (mục 2) phải quét trùng ở **mọi** trạng thái publish/draft/pending/private/**trash**
   bằng phiên admin, không chỉ URL công khai.
2. **Ảnh trong bài LOCALIZE sẽ hỏng nếu chỉ chạy `only=articles`.** 62 ảnh trong 8 body:
   **36 FALLBACK_COVER** (cdn.cdn.gcalls.co DNS chết → dùng cover fallback đã duyệt),
   **26 LOCALIZE** (phải tải & rehost). Section `media` bị bỏ khi `only=articles` → `<img>`
   còn trỏ cdn chết. → Hoặc chạy `--only=media,articles`, hoặc chấp nhận ảnh in-body hỏng
   trong draft và ghi rõ. Ảnh đại diện dùng **fallback cover đã duyệt** (không hotlink).
3. **7 link nội bộ trỏ tới đích chưa live** (sau khi loại các slug đã sống trên demo —
   7 CHANGED + 11 NEW): 2 tới bài blog chưa nhập, 5 tới đích chưa rõ
   (`gcalls-tu-van-giai-phap-tong-dai`, ...). Không được để 404, không `href="#"`.
   → Danh sách relink: `link-relink-needed.csv`. Xử lý: giữ text hoặc trỏ trang đã hoàn chỉnh.
   (Ghi chú: một số link như `4-ly-do-...` trỏ bài ĐÃ sống trên demo — coordinator xác nhận
   khi preflight.)

## Việc coordinator cần chạy (mục 2 & 4), rồi báo lại để tôi tổng hợp

- Preflight có đăng nhập: source/migration ID, slug/URL đích, trùng ở **mọi** trạng thái
  (gồm trash). Nếu bài đã tồn tại → báo conflict, đối chiếu; **không** tạo thêm/ghi đè,
  **không** thay bằng bài thứ 9.
- Lưu baseline mới 18 bài publish (raw post_content + trường bảo vệ), snapshot/rollback
  phạm vi pilot, nhật ký media tạo mới.
- Chạy CLI dry-run → xác nhận report → `--execute` (một lượt).
- Sau nhập: đọc lại đúng 8 target ID = draft; so raw post_content với body SHA ở bảng trên
  (theo chuẩn hoá đã ghi); kiểm ảnh/heading/taxonomy/link; mở authenticated preview
  desktop+mobile (không publish); so baseline 18 và xác nhận 37 trang ngoài blog không đổi.

## Trạng thái phát tín hiệu

- PILOT_DRAFT_8_OF_8: **CHƯA** — chưa ghi DB, chưa đọc lại 8 bài (cần coordinator).
- PROTECTED_18: **PENDING** — chỉ xác nhận được sau khi so baseline hậu-nhập.
- PAGES_37_UNCHANGED: **PENDING** — pilot dùng `only=articles`, không đụng pages/redirects;
  xác nhận cuối sau nhập.

**Batch tiếp theo đề xuất:** 6 bài HUB-03 REBUILD_KEEP_URL (CRM/Helpdesk — đã có trang
`/tong-dai-tich-hop-crm/`, `/tong-dai-tich-hop-helpdesk/`), chỉ chạy **sau** khi pilot 8 PASS.
Không tự chạy 155 bài còn lại, không publish sau pilot.
