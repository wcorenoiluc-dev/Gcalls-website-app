# CHECKPOINT GCALLS-038 — INSTALL LOCAL WORDPRESS · REAL RENDER

Local/private. 2026-09-02. **Không deploy. Không push. Không commit.**
Gate A1 vẫn chưa xử lý; hạn chế push/deploy và PII giữ nguyên.

## Kết luận một dòng

WordPress thật đã chạy. Renderer PHP và `class-mockups.php` thật đã thực thi.
Bốn trang sản phẩm render HTTP 200 với mockup thật, không stub. `renderer-test.php`
chạy lần đầu tiên trong đời: **30 assertion, 0 fail**.

**Nhưng có một phát hiện chặn duyệt** — xem §9. Ảnh gallery trên
`/gcalls-plus-webphone/` mang số liệu bịa, domain chưa được duyệt và tên người
bịa, và **không** có nhãn `Dữ liệu minh hoạ`.

---

## 1. Môi trường

| | |
| --- | --- |
| Thư mục | `/Users/macos/Desktop/Gcalls/GCALLS-WP-LOCAL/` (mới tạo) |
| Runtime | WordPress Playground CLI **3.1.52** (pin exact, `package-lock.json` giữ lại) |
| PHP | **8.3 — WASM (php.wasm), KHÔNG phải native PHP** |
| Database | **SQLite** (`wp-content/database/.ht.sqlite`, 424 KB) — **KHÔNG phải MySQL** |
| WordPress | **6.4.10** |
| Node / npm | v24.14.0 / 11.9.0 |
| Máy | macOS 13.6.7, x86_64 |

**Về phiên bản WordPress:** production được ghi nhận là **6.4.3** (suy ra từ
`?ver=6.4.3` trong `docs/WORDPRESS_HEADLESS_AUDIT.md`, không xác minh lại trong
phiên này). Playground chỉ nhận `major.minor`; `--wp 6.4.3` báo `fetch failed`.
`--wp 6.4` cài **6.4.10** — cùng dòng 6.4, lệch 7 bản vá. Đây **không** phải bản
production chính xác và không được coi là tương đương.

**Về PHP:** runbook 003A §7.1 ghi host chạy PHP 8.3. **Chưa xác minh lại** trong
phiên này — không có bằng chứng mới. WASM 8.3 khớp *số hiệu* phiên bản, không
khớp SAPI, extension set hay opcode cache của host.

### Cấu trúc, cô lập

```
GCALLS-WP-LOCAL/
├── runtime/      830M  node_modules, package-lock.json, .npm-cache (cache trong dự án)
├── site/          76M  wordpress/ (WP core + wp-content + .ht.sqlite), fixtures/, tests/
├── candidate/    2.2M  gcalls-core, gcalls-theme, mu-plugins  ← copy, KHÔNG symlink
├── logs/         668K  server.log, renderer-test.log, blueprint.log, html/
└── screenshots/   16M  8 ảnh 1440/390 + 1 ảnh bằng chứng
```

Không sudo, không Homebrew, không Docker, không cài global. Không sửa shell
profile, PATH hay cấu hình Chrome. Không đọc cookie/credential. `HOME` và
`CODEX_HOME` không đổi. Không mount toàn bộ source repo, không mount quarantine.
Symlink trong candidate: **0**.

---

## 2. Hai vấn đề môi trường phải xử lý để chạy được

### 2.1 IPv6 blackhole làm hỏng tải WordPress

`fetch failed` khi boot. Đo được: `curl` tới wordpress.org → 200; Node `fetch` →
`UND_ERR_CONNECT_TIMEOUT`. Nguyên nhân: DNS trả cả A và AAAA; **IPv4 kết nối
được, IPv6 timeout**, và undici không fallback kịp.

Khắc phục **trong phạm vi tiến trình**, không đổi cấu hình hệ thống:

```
NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection"
```

### 2.2 CLI bind 0.0.0.0 — LAN truy cập được

Playground CLI gọi `server.listen(port, cb)` **không có host**, nên Node bind mọi
interface. Đo trước khi sửa: `http://192.168.0.51:9400/` → **HTTP 200 từ địa chỉ
LAN**. Brief yêu cầu chỉ 127.0.0.1.

CLI không có tuỳ chọn bind. Đã vá bản vendored bằng `runtime/patch-loopback.mjs`
(idempotent, chạy lại được sau `npm ci`, `start.sh` tự gọi). Sau khi vá:

| Kiểm | Kết quả |
| --- | --- |
| `lsof` listener | `node 127.0.0.1:9400` |
| `http://127.0.0.1:9400/` | **200** |
| `http://192.168.0.51:9400/` | **000 — refused** |

Không tunnel, không mở LAN.

---

## 3. Nạp candidate

Copy chọn lọc, hash khớp bản khoá ở GCALLS-037:

| Artifact | SHA-256 |
| --- | --- |
| `data/product-pages.json` | `b4768f16464941ce27b88549fa1a7d43a643768facd412879fe2b14851aeb23c` |
| `data/section-components.json` | `ad01fae2d4af91e7de0b287fa8ac0668a5323c0e5bafa44f89d30f83523bf79f` |
| `includes/class-sections.php` | `860083c97d171934d975a30e2cbb86700a5c4de284bf5094197176d9fd5db682` |
| `includes/class-mockups.php` | `48dafdeff2e3d2a7083a3f2571e41e6a5378b30b377ae532d86b01edad2d0987` |
| `themes/.../gc-components.css` | `edc122ac97e55b7bc4357eb9229f397d34757762833f6997d8766f92c04cb575` |

Gói tham chiếu `gcalls-core-0.10.1.zip` = `52ffe873880a3047…` (khớp `.sha256` đi kèm).

**Chặn gửi ra ngoài trước khi kích hoạt candidate:** `mu-plugins/gcalls-000-airgap.php`
(mu-plugin nên nạp trước plugin thường) chặn `pre_wp_mail` và `pre_http_request`,
tắt `blog_public`. Trong toàn bộ phiên: **0 lần bị chặn — nghĩa là không có gì
cố gửi ra ngoài.**

Trang được tạo bằng **fixture blueprint cục bộ** (`site/fixtures/blueprint.json`),
**không** dùng importer/Corpus production. Không import database production,
không copy ảnh PII.

---

## 4. Bốn trang render bằng code thật

| Route | HTTP | H1 | gc-section | `gcalls-mock` | stub | lỗi PHP |
| --- | --- | --- | --- | --- | --- | --- |
| `/gcalls-plus-webphone/` | 200 | 1 | 13 | 49 | 0 | 0 |
| `/gcalls-cx/` | 200 | 1 | 15 | 54 | 0 | 0 |
| `/voicebot-ai/` | 200 | 1 | 9 | 19 | 0 | 0 |
| `/qc-bot-ai/` | 200 | 1 | 14 | 45 | 0 | 0 |

`data-preview-stub`: **0** trên cả bốn. Shortcode chưa nở: **0**. Mockup là bản
vẽ thật của `class-mockups.php`, CSS enqueue thật, icon SVG thật.

### Một H1 — và cái bẫy fixture đã suýt báo sai

Lần render đầu cho **2 H1** mỗi trang. Không phải lỗi sản phẩm: `page.php` in
tiêu đề trang cho page thường, còn production dùng template
**`page-templates/full-width.php`**, template này render nội dung trước rồi chỉ
in tiêu đề *nếu nội dung chưa có `<h1>`*. Fixture thiếu `page_template`. Sau khi
đặt đúng: **1 H1/trang**. Logic theme đúng; fixture sai.

---

## 5. `renderer-test.php` chạy thật lần đầu — và nó hỏng ngay

Chạy qua PHP 8.3 WASM (CLI SAPI, exit code truyền nguyên). **Không phải native
CLI** — chưa từng chạy trên PHP native.

File này chưa bao giờ được thực thi, và nó **không chạy nổi**. Bốn lỗi thật, sửa
lần lượt:

| # | Lỗi khi chạy | Bản chất |
| --- | --- | --- |
| 1 | `//wp-content/...` không tồn tại | `dirname(__DIR__)` giả định layout repo → thêm `--core-dir` |
| 2 | `Class "Shortcodes" not found` | test chỉ nạp Icons + Sections; `Sections::visual()` cần Shortcodes **và** Mockups |
| 3 | `Undefined constant Gcalls\Core\VERSION` | hằng do bootstrap plugin định nghĩa, test không nạp bootstrap |
| 4 | `Call to undefined function add_query_arg()` | thiếu stub WordPress |

### Hai lỗi nghiêm trọng hơn trong chính assertion

**a) Assertion "no database access" là một tautology.** Nguyên văn cũ:
`check( true, 'no database access during rendering (get_posts stub would have thrown)' )`.
`check(true, …)` luôn ok bất kể renderer làm gì.

Chạy thật cho thấy **renderer CÓ đọc database**: section mang `media` đã duyệt đi
`Sections::visual()` → `Shortcodes::media()` → `Importer::find_media()`, và hàm
đó gọi `get_posts()`. Stub cũ *ném exception*, nên một truy vấn hợp lệ biến
thành fatal error.

Đã thay bằng kế toán thật: đọc được **đếm**, ghi phải **bằng 0** (`$wpdb` stub
ném khi insert/update/delete/query). Kết quả: **0 writes, 1 read**. Khẳng định
"zero database writes" vẫn đúng; khẳng định "no database access" thì **sai** và
đã được sửa cho đúng sự thật.

**b) Assertion escaping báo FAIL giả.** `strpos($out,'onerror=')` khớp cả chuỗi
đã escape. Dump thực tế:

```
&quot;&gt;&lt;img src=x onerror=alert(1)&gt;
```

— văn bản trơ trong `<p>`, không có tag sống, không có `<script>`. **Escaping
đúng; assertion sai.** Đã đổi sang hỏi đúng câu hỏi: có tag nào mọc thuộc tính
`on*=` không (`/<[a-z][a-z0-9]*[^>]*\son[a-z]+\s*=/i`).

### Kết quả cuối

```
renderer-test: 30 ok, 0 failed (30 assertions ran)   exit 0
```

Semantics fail-closed giữ nguyên dưới WASM:

| Trường hợp | Kết quả |
| --- | --- |
| hash manifest sai | `FATAL: manifest hash mismatch` → **exit 2** |
| manifest thiếu | **exit 2** |
| chạy < `--min-checks` | **exit 2** |

---

## 6. Nghiệm thu 1440 / 390 (Chrome thật)

| Route | w | HTTP | H1 | height | overflow-X | img hỏng | 0-track | JS err |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| gcalls-plus | 1440 | 200 | 1 | 11 539 | không | 0 | 0 | 0 |
| cx | 1440 | 200 | 1 | 14 305 | không | 0 | 0 | 0 |
| voicebot | 1440 | 200 | 1 | 8 759 | không | 0 | 0 | 0 |
| qa-qc | 1440 | 200 | 1 | 12 519 | không | 0 | 0 | 0 |
| gcalls-plus | 390 | 200 | 1 | 16 910 | không | 0 | 0 | 0 |
| cx | 390 | 200 | 1 | 20 003 | không | 0 | 0 | 0 |
| voicebot | 390 | 200 | 1 | 13 963 | không | 0 | 0 | 0 |
| qa-qc | 390 | 200 | 1 | 18 063 | không | 0 | 0 | 0 |

Ảnh: `screenshots/<route>-<width>.png` (8 file). Không ảnh nào chứa PII —
attachment media đã duyệt không tồn tại trong fixture nên `Shortcodes::media()`
trả rỗng; ảnh duy nhất render là gallery vẽ sẵn (xem §9).

**CTA và điều hướng, đo trên HTML thật:**

- Hero CTA đúng nhãn + đủ `intent`/`source`/`product` trên **4/4**
  (vd. `/lien-he/?intent=demo&source=qa_qc_center&product=QA%20QC%20Center`).
- **Đúng một** `gcalls-product__final` mỗi trang.
- Estimator CTA **không bị ghi đè**: `/uoc-tinh-chi-phi/?product=gcalls-plus`.
- `gc-decision` links: cx **5**, qa-qc **4** — hoạt động.
- Nhãn `Dữ liệu minh hoạ`: cx/voicebot/qa-qc mỗi trang 1; **gcalls-plus: 0**.

Card-link (30 đích trên trang hub) **chưa kiểm ở đây** — checkpoint này chỉ tạo
bốn trang sản phẩm; `/giai-phap/`, `/tich-hop/`, `/san-pham/` chưa dựng fixture.

---

## 7. Admin smoke

| Màn hình | HTTP | lỗi PHP / permission |
| --- | --- | --- |
| `/wp-admin/` | 200 | 0 |
| `/wp-admin/plugins.php` | 200 | 0 |
| `/wp-admin/themes.php` | 200 | 0 |
| `/wp-admin/options-general.php` | 200 | 0 |
| `edit.php?post_type=gcalls_lead` | 200 | **0** |
| `admin.php?page=gcalls-lead-settings` | 200 | **0** |

Plugin **active**, có link Deactivate. Sự cố capability ở release trước **không
tái diễn**: danh sách lead mở được, không có "Sorry, you are not allowed".

**Ghi nhận:** plugins.php hiển thị **Version 0.9.7** — header plugin
(`const VERSION = '0.9.7'`) chưa được đặt về candidate 0.10.2. Tương tự
`gcalls-theme/style.css` vẫn ghi **0.8.5** chứ không phải 0.8.6. Cần sửa trước
khi đóng gói, và là đúng thứ `RELEASE-COMPOSITION.md` cảnh báo về nhánh header 0.9.7.

---

## 8. Bền vững qua restart

`./stop.sh` → cổng nhả → `./start.sh` → cả bốn trang **vẫn 200**, database và
trang còn nguyên trong `site/wordpress/wp-content/database/.ht.sqlite`. Không dữ
liệu chính nào nằm trong `/tmp`.

| | |
| --- | --- |
| Khởi động | `/Users/macos/Desktop/Gcalls/GCALLS-WP-LOCAL/start.sh` |
| Dừng | `/Users/macos/Desktop/Gcalls/GCALLS-WP-LOCAL/stop.sh` |
| Cổng | 9400 (đổi bằng `PORT=… ./start.sh`) |
| PID hiện tại | 37236 (file `logs/server.pid`, listener 37242) |
| Log | `logs/server.log`, `logs/renderer-test.log`, `logs/blueprint.log` |
| URL | http://127.0.0.1:9400/ |

Server **vẫn đang chạy** để chủ sở hữu xem trực tiếp.

---

## 9. ⚠ PHÁT HIỆN CHẶN DUYỆT — ảnh gallery bịa số liệu trên trang sản phẩm

`class-mockups.php` có một gallery tab hard-code 6 ảnh raster trong
`assets/images/product-gallery/`, **không đi qua allowlist `approvedMedia`** mà
GCALLS-036C dựng. Allowlist đó chỉ chi phối `section.media` (GP-xx); gallery là
đường code khác.

Ảnh bằng chứng: `screenshots/_evidence-gallery-analytics.png` (tab "Thống kê").
Nội dung ảnh:

| Trong ảnh | Vấn đề |
| --- | --- |
| `248` tổng cuộc gọi · `68.4%` tỷ lệ kết nối · `02m 48s` · `8.1%` + biểu đồ xu hướng | **số liệu bịa trình bày như kết quả đo được** |
| Thanh địa chỉ trình duyệt vẽ `UNAPPROVED_DOMAIN_01` | **`UNAPPROVED_DOMAIN_01`** — chính chuỗi mà `redact-checkpoints.mjs` đã xoá khỏi tài liệu, vẫn nằm trong ảnh đang render |
| Bảng "TOP HIỆU SUẤT AGENT": Linh Tran, Nguyen, Minh Pham, Quang Le, Hoang Ha kèm điểm số | **danh tính bịa** (cùng họ với `FABRICATED_IDENTITY_01`) |
| Caption dưới ảnh: "Dashboard thống kê hiệu suất cuộc gọi" | mô tả, **không** phải đính chính |
| Nhãn `Dữ liệu minh hoạ` | **không có** — gcalls-plus đo được 0 nhãn |

Đây đúng là thứ 036C đã **REFUSED** cho `mock_analytics` (bản vẽ HTML, đã bị
`render()` chặn). Bản raster cùng chủ đề thì vẫn render, và nó là **tab thứ 4
của gallery ngay trên trang sản phẩm chính**.

`agent-performance.webp` cùng loại. Cả hai trùng tên với hai asset mà media
manifest xếp **REFUSED**.

Chiếu theo gate §5/§6: **"Không fake claim" FAIL**, **"Nhãn dữ liệu minh hoạ hiện
đúng" FAIL** cho `/gcalls-plus-webphone/`.

**Chưa sửa** — đây là quyết định nội dung của chủ sở hữu, và 038 có phạm vi cài +
render + chụp bằng chứng. Ba hướng: (a) bỏ hai tab analytics/agents khỏi gallery,
(b) vẽ lại không có KPI, domain và tên người, (c) thêm nhãn `Dữ liệu minh hoạ`
trong ảnh — nhưng (c) không xử lý được domain và tên người.

---

## 10. Trạng thái gate

| Gate | Trạng thái |
| --- | --- |
| WordPress boot | **PASS** |
| Plugin/theme activation | **PASS** |
| Bốn trang HTTP 200, renderer + mockup thật | **PASS** |
| PHP error log | **PASS** — 0 lỗi |
| `renderer-test.php` (PHP 8.3 WASM) | **PASS** — 30/30, exit 0 |
| Một H1, không overflow, không 0-track, 0 JS error | **PASS** — 8/8 |
| Hero CTA attribution · một final CTA · estimator href | **PASS** |
| Admin + capability | **PASS** |
| Bền vững qua restart | **PASS** |
| Loopback-only | **PASS** (sau khi vá) |
| **Fake claim / nhãn dữ liệu minh hoạ** | **FAIL** — §9 |
| PHP native CLI | **CHƯA CHẠY** — chỉ WASM |
| Gate A1 (repo Private) | **CHƯA XỬ LÝ** |

## 11. Còn thiếu để deploy

1. Quyết định của chủ sở hữu về §9 (chặn).
2. Đặt lại version: Core `0.9.7` → 0.10.2, Theme `0.8.5` → 0.8.6.
3. Chạy `renderer-test.php` trên **PHP native 8.1/8.2/8.3** qua GitHub Actions.
4. Fixture cho trang hub để kiểm 30 card-link còn lại.
5. Đối chiếu WordPress 6.4.10 (test) với 6.4.3 (production).
6. Gate A1 → A2 → purge → integration branch + diff gate.

## 12. Thay đổi trong repo nguồn (chưa commit)

| File | Thay đổi |
| --- | --- |
| `wordpress/tests/renderer-test.php` | `--core-dir`; nạp Importer/Mockups/Shortcodes; hằng `VERSION`; stub `add_query_arg` và 8 hàm khác; kế toán DB read/write thay cho tautology; sửa assertion escaping |
| `docs/content-review/gcalls-038/` | checkpoint này |

Không sửa live, corpus, homepage, Media Library, remote hay lịch sử Git.

**Dừng ở preview. Chờ chủ sở hữu duyệt ảnh WordPress thật và quyết định §9.**
