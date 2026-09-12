# CHECKPOINT GCALLS-037 — REAL WORDPRESS RENDER VERIFICATION

Local/private. 2026-09-01. **Không deploy. Không push. Không commit.**

## Kết luận một dòng

**Mục tiêu của checkpoint này KHÔNG đạt được.** Renderer PHP và mockup thật
**chưa từng chạy**, vì máy không có PHP runtime và chủ sở hữu đã chọn **hoãn**
việc cài môi trường. Không có ảnh WordPress thật để duyệt.

> **PHP runtime: NOT EXECUTED**
> **Visual parity: NOT VERIFIED**
> **Bốn product page: NOT VERIFIED — không PASS, không FAIL**

Không tạo thêm ảnh stub để thay thế bước này, và không tạo thêm một vòng
"preview complete".

---

## 1. Khoá trạng thái

Toàn bộ sửa đổi 036C được giữ nguyên, không hoàn tác gì.

| Mục | Giá trị |
| --- | --- |
| Branch | `feature/gcalls-wordpress-migration` |
| HEAD | `d8d8615fbd7650576d04b4aebcae21c3c35300ee` |
| Tracked file đã sửa | 8 |
| Untracked file | 165 |
| SHA-256 của `git diff HEAD` | `b2cdee7c69dfe448c8fbe01934c2c182ae1283de096090afcc5349c1dac720f3` |

Hash artifact candidate:

| Artifact | SHA-256 |
| --- | --- |
| `data/product-pages.json` | `b4768f16464941ce27b88549fa1a7d43a643768facd412879fe2b14851aeb23c` |
| `data/section-components.json` | `ad01fae2d4af91e7de0b287fa8ac0668a5323c0e5bafa44f89d30f83523bf79f` |
| `themes/gcalls-theme/assets/css/gc-components.css` | `edc122ac97e55b7bc4357eb9229f397d34757762833f6997d8766f92c04cb575` |
| `includes/class-sections.php` | `860083c97d171934d975a30e2cbb86700a5c4de284bf5094197176d9fd5db682` |
| `includes/class-mockups.php` | `48dafdeff2e3d2a7083a3f2571e41e6a5378b30b377ae532d86b01edad2d0987` |
| `.pkg/content-pages-0.10.1.json` | `f39f52ae6895533f995d4056b18aa387e506c6d8b636f42f13993591c6ce7b8c` |

Gói nguồn: `gcalls-core-0.10.1.zip` = `52ffe873880a304714a858ff69e680ec48c6d741cf90e744d4e46d0f695a0c48`,
khớp file `.sha256` đi kèm.

---

## 2. Môi trường PHP — kiểm tra read-only

Đã dò, **không sửa gì**:

| Thành phần | Kết quả |
| --- | --- |
| `php`, `php8`, `php8.1/8.2/8.3` | **không có** |
| `docker`, `docker-compose`, `podman`, `colima`, `orbstack`, `lima` | **không có** |
| `brew`, `composer`, `wp` (wp-cli) | **không có** |
| `mysql`, `mariadb` | **không có** |
| `sqlite3` | có (`/usr/bin/sqlite3`, của hệ điều hành) |
| App dev (Local, MAMP, XAMPP, Herd, DBngin, DevKinsta) | **không có** — `/Applications` chỉ có VS Code |
| Quét toàn ổ tìm binary `php` | **0 kết quả** |
| Quét tìm `wp-load.php` | **0 kết quả** — không có WordPress nào trên máy |
| Máy | macOS 13.6.7, x86_64 (Intel) |

macOS 12 trở đi không còn kèm PHP, nên đây là trạng thái mong đợi chứ không phải
cấu hình hỏng.

**PHP version cần khớp: 8.3** — `docs/RUNBOOK_003A_LIVE_HARDENING.md` §7.1 xác
định host chạy PHP 8.3 CLI; plugin và theme khai `Requires PHP: 8.1`.

### Yêu cầu cài đặt — CHỜ CHỦ SỞ HỮU (một yêu cầu duy nhất)

Đề xuất **đúng một** phương án, cô lập hoàn toàn, không chạm hệ thống:

| | |
| --- | --- |
| **Phần mềm** | PHP 8.3 **static binary** (static-php-cli) · WordPress core (tarball wordpress.org) · plugin SQLite database integration |
| **Nơi lưu** | `~/Desktop/Gcalls/gcalls-037-testbed/` — binary, WP core, wp-content, và `db.sqlite` đều nằm trong đây |
| **Phạm vi thay đổi** | Chỉ thư mục trên. **Không** sửa PATH, không launchd, không quyền admin, không package manager, không service nền |
| **Gỡ bỏ** | Xoá thư mục là hết dấu vết |
| **Dữ liệu** | Fixture tối thiểu (~10 trang), **không** dùng production database |
| **An toàn** | `wp_mail()` bị chặn, importer/Corpus không chạy, chỉ media đã duyệt |
| **Cần mạng** | Có — tải binary PHP bên thứ ba và WP core |

**Trạng thái: chủ sở hữu chọn HOÃN.** Không cài gì. Checkpoint này dừng tại đây.

Hai phương án còn lại đã cân nhắc và không chọn: Docker Desktop (là cài đặt
toàn hệ thống, cần quyền admin, chạy VM thường trực — brief yêu cầu tránh); và
chủ sở hữu tự chạy trên host/staging đã có PHP 8.3.

---

## 3. Kiểm đúng artifact — ĐÃ LÀM (không cần runtime)

Đây là phần duy nhất của §3 làm được mà không có PHP, và nó sửa lỗi thật.

### `wordpress/tests/renderer-test.php` — nhận artifact bằng tham số

Trước: đường dẫn manifest **hard-code**; `file_get_contents` thất bại thì
`json_decode(false)` trả `null`, vòng lặp cảnh báo rồi **chạy tiếp**; và
`exit($fail > 0 ? 1 : 0)` nghĩa là **0 test = exit 0 = xanh**.

Sau:

| Cơ chế | Hành vi |
| --- | --- |
| `--manifest=PATH` / `$GCALLS_MANIFEST` | chọn artifact tường minh, mặc định là manifest của plugin |
| `--sha256=HEX` / `$GCALLS_MANIFEST_SHA256` | so hash bằng `hash_equals()`; lệch → **exit 2** |
| manifest thiếu / không đọc được / không decode | **exit 2**, không chạy tiếp |
| thiếu bất kỳ route nào trong bốn route | **exit 2**, kèm tên route thiếu |
| `--min-checks=N` (mặc định 15) | chạy ít hơn N assertion → **exit 2** |

`EXPECTED_ROUTES` = `/gcalls-plus-webphone/`, `/gcalls-cx/`, `/voicebot-ai/`,
`/qc-bot-ai/`.

### NOT CHECKED không còn được tính là release PASS

`contract-test-sections.mjs` có thêm chế độ `--release-gate` (hoặc
`$GCALLS_RELEASE_GATE=1`): còn bất kỳ mục nào NOT CHECKED thì **exit 2**, dù
không có FAIL nào. 0 assertion cũng **exit 2**.

Đã kiểm cả ba chế độ:

| Chế độ | Kết quả |
| --- | --- |
| Bình thường, có package | `28 ok, 0 failed` → exit 0 |
| Release gate, có package | `28 ok, 0 failed` → exit 0 |
| Release gate, **thiếu** package | `FATAL: release gate refuses 1 NOT CHECKED item(s)` → **exit 2** |

Workflow CI nay truyền manifest tường minh cho PHP test, và có thêm một bước
release gate riêng, tách khỏi lần chạy mang tính thông tin.

**Lưu ý:** các thay đổi trên là mã nguồn; chúng **chưa từng được PHP thực thi**.
`php-lint` chỉ xác nhận **cú pháp** (php-parser trong Node), không phải hành vi.

---

## 4. Render bốn trang bằng code thật — KHÔNG THỰC HIỆN

| Route | Trạng thái |
| --- | --- |
| `/gcalls-plus-webphone/` | **NOT RENDERED** |
| `/gcalls-cx/` | **NOT RENDERED** |
| `/voicebot-ai/` | **NOT RENDERED** |
| `/qc-bot-ai/` | **NOT RENDERED** |

Không có WordPress, không có `class-mockups.php` chạy thật, không có CSS enqueue
thật, không có font/icon thật. **Không xuất ảnh nào.** Không dựng ảnh stub thay
thế — đó chính là điều brief cấm.

---

## 5. Các lỗi đã phát hiện — trạng thái kiểm chứng

Phân biệt rõ hai mức: **kiểm ở mức manifest/contract (Node, đã chạy)** so với
**kiểm khi PHP render thật (chưa chạy)**.

| Mục | Manifest/contract (Node) | PHP runtime |
| --- | --- | --- |
| Bốn section thiếu dữ liệu đã xử lý | ✅ CONTENT_MISSING = 0 | ⛔ chưa chạy |
| `GP_STORY` empty-by-design có lý do từ source | ✅ cờ `emptyByDesign`, React tự render placeholder | ⛔ chưa chạy |
| 39 đích điều hướng còn đủ href/label | ✅ 30 qua `grid()` + 9 qua `decision` | ⛔ chưa chạy |
| Hero CTA đúng label/intent/source/product | ✅ 4/4 | ⛔ chưa chạy |
| Exactly one final CTA | ✅ 4/4 | ⛔ chưa chạy |
| Estimator CTA không bị ghi đè href | ✅ `/uoc-tinh-chi-phi/?product=gcalls-plus` giữ nguyên | ⛔ chưa chạy |
| Unknown source làm build/test thất bại | ✅ contract + `exit 2` | ⛔ chưa chạy |
| Không raw shortcode / lỗi PHP / icon thiếu | ⚠️ icon 0 thiếu (39/51) — phần còn lại **không kiểm được** khi không render | ⛔ chưa chạy |

Kiểm phụ đã chạy lại trong phiên này: contract-test **28 ok / 0 failed**
(có `--release-gate`), exporter OK, php-lint 41 file 0 vấn đề (**cú pháp**),
redaction 0 file thay đổi.

### Admin smoke — chỉ đọc mã, chưa chạy

Sự cố capability ở release trước (`2ba4c5b`) đã được sửa theo cách được hỗ trợ,
xác nhận **bằng đọc mã**:

- `capability_type => array('gcalls_lead','gcalls_leads')` + `map_meta_cap => true`,
  không còn ghi đè `read_post`/`delete_post` bằng primitive.
- `create_posts => 'do_not_allow'`.
- `grant_capabilities()` hook vào **`admin_init`**, không chỉ activation — nên
  bản cập nhật plugin (không bắn activation hook) vẫn tự lành. Idempotent nhờ
  kiểm `has_cap()` trước.
- Chỉ `administrator` được cấp; submenu dùng `manage_options`.

**Chưa xác minh khi chạy:** menu có hiện không, trang danh sách lead có mở được
không, có `WP_Error` hay thông báo capability nào không. Đó đúng là thứ chỉ
runtime trả lời được.

---

## 6. Nghiệm thu giao diện thật — KHÔNG THỰC HIỆN

Không chạy 1440/1024/768/390/320 trên WordPress thật. Không đo H1, overflow,
grid track rỗng, feature split, nhãn dữ liệu minh hoạ, bàn phím, heading orphan
hay chiều cao trang **trong WordPress**.

Số liệu 036C vẫn còn giá trị nhưng **đúng phạm vi của nó**: đó là preview Node
file:// với mockup vẽ bằng ô 16:10 phẳng, không phải bản vẽ thật của
`class-mockups.php`. Chiều cao đo được ở đó là **sàn**, không phải chiều cao
trang sẽ ship — nên chênh lệch chiều cao với React **vẫn chưa được giải thích
xong**, và sẽ chỉ giải thích xong sau khi render thật.

Không xuất ảnh React/WordPress. Không có ảnh nào chứa PII được đưa vào báo cáo
hay repo.

---

## 7. Quyền và sự cố PII

| Gate | Trạng thái |
| --- | --- |
| Gate A1 (repo Private) | **CHƯA XỬ LÝ** — đo lần cuối ở 036C: `"private": false`, HTTP 200 ẩn danh |
| Push / deploy / upload package | **CHẶN**, giữ nguyên hạn chế |
| Sửa lịch sử Git | **KHÔNG** làm |
| Xoá media | **KHÔNG** làm |
| Backup thêm ngoài quarantine hiện có | **KHÔNG** tạo |
| Công việc local với asset an toàn | tiếp tục |

Không chạy lại anonymous probe trong checkpoint này vì không có thao tác nào cần
tới nó; kết quả 036C vẫn là kết quả hiện hành và vẫn là FAIL.

---

## 8. Việc còn thiếu để deploy

Theo thứ tự chặn:

1. **Cấp môi trường PHP** — yêu cầu ở §2, đang chờ chủ sở hữu. Chặn toàn bộ
   GCALLS-037.
2. **Chạy `renderer-test.php` thật** trên PHP 8.1/8.2/8.3. Hiện là 19 điểm
   assert chưa bao giờ thực thi.
3. **Render bốn trang trong WordPress thật**, mockup thật, rồi xuất ảnh
   1440/390 để chủ sở hữu duyệt.
4. **Nghiệm thu giao diện** 5 breakpoint trên bản render thật, và giải thích
   chênh lệch chiều cao bằng component thật.
5. **Admin smoke** trên WordPress thật, tập trung vào capability của lead CPT.
6. **Gate A1** — repo về Private, chạy lại toàn bộ anonymous probe.
7. **Gate A2 / purge** theo `gcalls-035/PURGE-RUNBOOK-v2.md`.
8. **Dựng integration branch + diff gate** theo
   `gcalls-036c/RELEASE-COMPOSITION.md`.

Trước khi 1–5 xong, không có cơ sở nào để gọi renderer PHP là PASS.

---

## 9. Thay đổi trong phiên này

| File | Thay đổi |
| --- | --- |
| `wordpress/tests/renderer-test.php` | nhận `--manifest` / `--sha256` / `--min-checks`; fatal khi thiếu manifest, thiếu route, lệch hash, hoặc chạy quá ít assertion |
| `wordpress/scripts/contract-test-sections.mjs` | thêm `--release-gate`: NOT CHECKED và 0 assertion đều **exit 2** |
| `.github/workflows/php-renderer.yml` | truyền manifest tường minh cho PHP test; thêm bước release gate riêng |
| `docs/content-review/gcalls-037/` | checkpoint này |

Không sửa live, corpus, homepage, Media Library, remote hay lịch sử. Chưa commit.

**Dừng ở đây. Chờ chủ sở hữu quyết định về môi trường PHP.**
