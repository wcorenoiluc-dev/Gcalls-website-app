# GCALLS-053 F3 — field parity closeout

Ngày 2026-09-08. Chạy trên PHP 8.3 thật (Playground WASM), trên một cây **đúng
hình dạng gói phát hành**: bản build 0.10.11 đã đóng gói, chỉ chồng lên các file
mà phiên này thay đổi. Không có backend lead trong cây đó.

Nối tiếp `react-wordpress-component-map.md` (Trap A) và commit `068c4b0`.

---

## 1. Một lỗi thật trong artifact 0.10.11 đã phát hành

`content-completeness-test` **FAIL** trên chính gói 0.10.11
(`e1f0008b…`): `cong-ty — 4 section(s), inventory expects 1`.

Hai file dữ liệu trong cùng một gói mâu thuẫn nhau. `068c4b0` port
`/cong-ty/` từ 1 section lên 4 nhưng không regenerate
`data/content-inventory.json`, vốn khoá con số cũ. Commit đó ghi
"content-completeness 4 ok, 0 failed" — con số đó không đúng với trạng
thái cuối cùng.

**Phạm vi staleness:** đã kiểm **cả 31 trang** bằng
`build-content-inventory-047.mjs --check`, so cả section count lẫn danh
sách heading. Chỉ 3 trang lệch, và cả ba đều là trang phiên này/`068c4b0`
cố ý đổi: `cong-ty` 1→4, `nganh` 1→3, `tai-nguyen` 1→3. 28 trang còn lại
khớp chính xác. Đây **không** phải một class of problem rộng hơn — nó là
một bước regenerate bị bỏ sót.

Đã regenerate và review diff (chỉ 3 số + 3 danh sách heading + khối
reconciliation mới).

---

## 2. 31 trang so với 38 — nay có cái gì assert điều đó

`manifestPages: 31` là số trang trong bảng của `Content_Pages`. Bảy trang
còn lại dùng renderer khác. Trước đây **không có gì phát biểu điều đó**,
nên một trang sản phẩm bị rơi khỏi export sẽ để lại 30 và mọi gate vẫn
xanh — 30 là một con số hoàn toàn nhất quán với chính nó.

`build-content-inventory-047.mjs` nay đối chiếu từng slug với
`wordpress/imports/content-manifest.json` (38 trang) và **từ chối khoá
inventory** nếu: một slug được hai renderer nhận, một slug được render
nhưng không phải trang của site, hoặc một trang của site không renderer
nào nhận. Bảy renderer khác được ghi tên kèm file:

| slug | renderer |
|---|---|
| `trang-chu` | Elementor layout — `class-home-layout.php` |
| `gcalls-plus-webphone` | `[gcalls_product_page id=gcalls-plus]` |
| `qc-bot-ai` | `[gcalls_product_page id=qa-qc]` |
| `gcalls-cx` | `[gcalls_product_page id=cx]` |
| `voicebot-ai` | `[gcalls_product_page id=voicebot]` |
| `uoc-tinh-chi-phi` | `[gcalls_estimator]` |
| `blog` | posts page — theme `home.php` |

`content-manifest.json` không nằm trong gói, nên tổng số (`siteRoutes: 38`)
đi cùng inventory và `content-completeness-test.php` assert
`31 + 7 === 38` **trong PHP**, trong gói. 31 → 30 nay là một FAIL.

---

## 3. `/blog/` — trạng thái rỗng có thể hiện ra với 18 bài đã publish

Đây là lỗi nghiêm trọng nhất tìm được trong phiên.

`home.php` vào nhánh grouped chỉ dựa trên `taxonomy_exists('gcalls_hub')`.
Plugin đăng ký taxonomy đó khi load, nên câu trả lời luôn là **có** trên
mọi site có gcalls-core — kể cả site chưa xếp bài nào vào hub. Nhánh đó
rồi thấy `get_terms(hide_empty => true)` rỗng và rẽ sang `else` của
CHÍNH NÓ, in `template-parts/content-none.php`:

> Chưa có bài viết nào trong mục này.

trên một archive có **18 bài đã publish**. Các bài viết chưa từng được
hỏi tới; chỉ có các term được hỏi.

**Đã sửa.** `$hub_terms` được lấy trước, và "có ít nhất một term" là một
phần của điều kiện. Không có hub term thì template rơi xuống vòng lặp
thường — vòng lặp đọc chính các bài viết — và trạng thái rỗng chỉ còn
đến được từ `have_posts()` là false.

Thêm một lỗ thứ hai cùng chỗ: bài đã publish **không mang hub term nào**
không xuất hiện trong bất kỳ nhóm nào, mà trang một là toàn bộ archive
(`is_paged()` đã loại nhánh phân trang). Bài đó sẽ live, được index, và
không thể tới được từ chính index của nó. Nay có một truy vấn
`NOT EXISTS` gom chúng vào một nhóm "Chưa xếp nhóm", chỉ render khi có.

**Bằng chứng, không phải lập luận.** `wordpress/tests/blog-index-test.php`
chạy chính template thật với các stub WordPress và assert trên HTML.
Trên `HEAD` (trước sửa) nó **FAIL 5/10**, với đúng hình dạng live —
18 bài, 0 hub term — cho ra `0 card(s)` và chuỗi "Chưa có bài viết".
Sau sửa: **10 ok, 0 failed**.

Mọi con số về blog đều được **đếm**, không viết sẵn:
- `/tai-nguyen/` thẻ Blog: manifest mang `count_source: "published_posts"`,
  renderer gọi `wp_count_posts()` mỗi request. Không có số nào bị đóng
  băng vào manifest (parity test assert điều này).
- Theme: `$term->count` và `$rendered` — cả hai đều từ dữ liệu.
- `grep "Chưa có bài viết"` trong toàn bộ plugin: **0 hit** ngoài một
  comment PHP giải thích tại sao chuỗi đó không được port.

---

## 4. `/cong-ty/` — kết quả port, và những gì đã bỏ

`068c4b0` đã port đầy đủ từ `COMPANY_HUB` đọc dưới dạng dữ liệu. Phiên này
đã **xác minh lại**, không port lại: chạy `--check` cho ra "already
ported", nghĩa là nội dung trên đĩa bằng đúng những gì script sinh ra từ
nguồn đã duyệt. Toàn bộ 10 key của `COMPANY_HUB` được kể tới; 4 section +
hero + CTA.

**Claim guard chạy trên output đã sinh** (không phải trên nguồn) và từ
chối: năm thành lập, số khách hàng, số quốc gia, giải thưởng, doanh thu,
headcount, testimonial, superlative, con số uptime/SLA, và mọi tham chiếu
ảnh. Kết quả: **clean**.

**Những claim vô căn cứ đã bỏ khỏi trang này: không có.** `COMPANY_HUB`
không chứa claim nào thuộc các nhóm trên — đó là kết quả kiểm tra, không
phải giả định. Hai điều đáng ghi:

1. Guard từng bắt `logo khách hàng` — **false positive**: chuỗi nằm trong
   "Tên và logo khách hàng chỉ được đăng sau khi có sự đồng ý bằng văn
   bản", tức một disclaimer về đồng ý, ngược hẳn với một logo wall. Giữ.
2. Logo chính thức (`gcalls-official-logo-137x40.png`) **vẫn chưa được
   port** — chưa có entry trong media registry, và guard từ chối mọi tham
   chiếu ảnh. Cần owner/registry, không phải script.

Claim bị bỏ ở nơi khác — xem §5.

---

## 5. Một claim bị trung hoà, không port

`/tai-nguyen/` — `RESOURCES_HUB.directAnswer` kết thúc bằng:

> Glossary, FAQ và Guides đã có nội dung đầy đủ; Blog, Case Studies và
> Ebook nêu rõ phạm vi nội dung và trạng thái thật của từng danh mục.

Đúng với bản preview React (mọi entry catalog là draft) và **sai với
WordPress**, nơi `/blog/` là posts page của các bài đã publish. Cùng một
sai lệch với thẻ "Chưa có bài viết" cũ, chỉ ở dạng văn xuôi.

Câu đó bị **bỏ**; `port-hub-shape-053.mjs` in ra chính xác nó đã bỏ gì và
vì sao, và **die** nếu câu trong nguồn đổi đi (khiến phép bỏ trượt) hoặc
nếu văn bản còn lại vẫn nói blog rỗng. Không có chữ nào được viết thêm.

---

## 6. `/nganh/` và `/tai-nguyen/` — hai card wall thật

Cả hai là **một** section `cards(6)` và không gì khác: một h1, sáu hộp,
không có câu trả lời phía trên, không có đường đi tiếp phía dưới. Sáu hub
route còn lại đều có direct answer → cards → (decision guide) → link row.

`port-hub-shape-053.mjs` thêm `directAnswer` và `links` từ hub React đã
duyệt. **Không** đụng hero, h1, sáu card, hay CTA đóng trang: chúng đến
từ nguồn khác (`src/data/industries/index.ts`,
`src/data/resources/index.ts`) và prose/h1 của chúng phân kỳ với hub
React. Thay chúng là một quyết định nội dung + SEO của owner, không phải
việc của một script port; thêm hai section trang chưa từng có thì không.

    /nganh/      1 section  → 3   (prose · cards(6) · related(5))
    /tai-nguyen/ 1 section  → 3   (prose · cards(6) · related(5))

**Chưa làm, cần owner:** h1 và prose vẫn theo nguồn cũ; hero diagram của
layout React chưa port.

---

## 7. Mười hai field kind — cái nào render riêng, cái nào không

| kind | trạng thái | render như thế nào |
|---|---|---|
| `supporting` | RENDERS | `.gcalls-cp__card-supporting` (Trap A, đã có) |
| `tags` | RENDERS | `<ul class="gcalls-cp__tags">` (đã có) |
| CTA | RENDERS | nhãn riêng của card thắng nhãn mặc định (đã có) |
| `current` | RENDERS — **mở rộng** | content pages: hàng decision `aria-current` + chữ. Product pages: **mới** — `CX_BOUNDARIES`/`QQ_BOUNDARIES` trước đây mất cờ này và tự link về chính trang đang đọc |
| `note` | RENDERS — **mở rộng** | prose/cards/steps (đã có) + **mới** `.gc-section__note` trên product pages |
| `checkpoints` | RENDERS | `<ol class="gcalls-cp__checklist">` — Guides, 5 mục/lộ trình (đã có) |
| `audience` | **MỚI** | `<dl class="gcalls-cp__audience">` dưới đoạn purpose. **23 hàng trên 7 trang** trước đây bị bỏ hoàn toàn |
| `need` | **MỚI** | `.gcalls-cp__decision-need` — vế câu hỏi của bảng quyết định |
| `product` | **MỚI** | `.gcalls-cp__decision-product` — vế trả lời, mang link |
| `role` | **MỚI** | `.gcalls-cp__usecase-role` — nhãn, không phải heading |
| `flow` | **MỚI** | `.gcalls-cp__usecase-flow` |
| `path` | RENDERS | href của hàng; trên các section chỉ-liên-kết nay là `.gcalls-cp__related-link` thay vì một card rỗng có chữ "Tìm hiểu thêm" |

**Không còn là card wall:** 8 section decision (34 hàng), 6 section
use-case (24 hàng), 11 hàng related link, 7 khối audience.

**Vẫn render dạng grid, và đúng như vậy:** `GP_USE_CASES`,
`CX_USE_CASES`, `QQ_USE_CASES`, `QQ_HUMAN_LOOP` trên product page —
React cũng dùng grid ở đó (`reactLayout: "grid"`), nên grid là parity,
không phải flattening.

**`audience` KHÔNG port ở một chỗ:** `PRICING_PLANS.audience` trong
`src/data/pricing.ts`. `/bang-gia/` của WordPress cố ý không dựng theo
gói/bậc giá — nó dùng `PRICING_FACTORS`/`SOLUTION_PRICING`/`PRICING_ADDONS`
và không nêu giá. Port `audience` ở đó đòi port cả bậc giá, tức nội dung
mới, cần owner duyệt.

---

## 8. Product export — sáu section đến rỗng, nay không

Từ vựng key của `build-product-content.mjs` thiếu sáu tên. Một key không
ai liệt kê là một list không ai đọc, và mỗi cái mất trọn một section:

| section | key bị bỏ | mất gì |
|---|---|---|
| `QQ_HUMAN_LOOP` | `roles` | ba vai AI / QA / Manager — chính là luận điểm của section |
| `CX_OVERVIEW` | `components` | 9 thành phần workspace |
| `QQ_OVERVIEW` | `components`, `keywordLead` | 7 thành phần, dưới một câu nói "bảy thành phần dưới đây" trỏ vào hư không |
| `VB_HUMAN_AI` | `columns`, `closing` | hai cột ranh giới bot/người, **và câu "không phải thay thế vai trò của nhân viên"** |
| `CX_INTEGRATION` | `relatedLinks`, `primaryLink` | ba đích đến |
| `QQ_INTEGRATION` | `links` | ba đích đến |

Đo được sau khi sửa (render thật, PHP 8.3):

    VB_HUMAN_AI      546 →  4146 bytes   2 cột + 2 lead + closing note
    QQ_HUMAN_LOOP    0   →  2258 bytes   3 hàng vai
    CX_OVERVIEW      0   →  4935 bytes   checklist 9 mục cạnh mockup
    CX_INTEGRATION   0   →  2007 bytes   3 link
    QQ_BOUNDARIES    —   →  2057 bytes   4 hàng, 1 hàng "Trang bạn đang xem", 3 link

`VB_HUMAN_AI` cũng đổi component trong `section-components.json` từ
`grid` sang `groups`: React dựng hai cột đối lập, một grid 3-up không
diễn đạt được sự đối lập đó.

10 section product khác vẫn không có list — đã đối chiếu nguồn React:
chúng thật sự chỉ có heading + description + CTA (`*_FINAL_CTA`,
`*_PRICING`, `GP_INTEGRATION`, `CX_TRUST`, `QQ_DASHBOARD`, `QQ_STORY`).
Không mất gì.

---

## 9. Lead backend

Không đụng tới. Trong cây đúng hình dạng gói dùng để chạy test:

- 4 file trong danh sách cấm (`class-leads.php`, `lead-form.js`,
  `lead-form.css`, `leads-test.php`): **không có mặt**.
- Tham chiếu `Leads::` thực thi được: **0** (một hit duy nhất nằm trong
  comment).
- `/lien-he/` mang `form_slot.state = active`, và slot quyết định ở
  **runtime**: chỉ render form khi cả shortcode lẫn class `Leads` tồn
  tại. Không có backend → render một `role="note"`, **không `<form>`,
  không `<input>`, không `<button>`**. Nay có assert cho cả ba (parity
  test), vì một manifest nói "active" sẽ không bị bắt bởi bất cứ thứ gì
  chỉ đọc manifest.

---

## 10. Test đã chạy — output thật

Trên PHP 8.3 (Playground WASM), cây = build 0.10.11 đã đóng gói + các file
phiên này đổi:

| suite | kết quả |
|---|---|
| `renderer-test` | **30 ok, 0 failed** |
| `content-card-parity-test` | **149 ok, 0 failed** (58 trước phiên này) |
| `content-completeness-test` | **5 ok, 0 failed** (FAIL 1 trên HEAD) |
| `media-frames-test --expect-package` | **33 ok, 0 failed** |
| `blog-index-test` (mới) | **10 ok, 0 failed** (5 FAIL trên HEAD) |

Node gate: `php-lint` 47 file 0 problem · `css-lint` 9 file 0 problem ·
`build-content-inventory-047 --check` OK 31+7=38 ·
`build-product-content` tái lập byte-identical · cả ba port script
idempotent.

Test chạy trong một cây **riêng** dựng trong scratchpad, chỉ dùng lại
binary `wp-playground-cli` của `GCALLS-WP-LOCAL/runtime` ở chế độ đọc.
Không có file nào trong `GCALLS-WP-LOCAL` bị đọc-ghi, không `npm install`,
không server thứ hai.

---

## 11. Chưa làm — và lý do chính xác

1. **Không sinh artifact homepage.** Agent khác đang sửa homepage;
   `homepage-elementor.json` / `homepage-inventory.json` giữ nguyên như
   0.10.11. Mọi generator homepage KHÔNG được chạy trong phiên này.
2. **Không đóng gói release mới.** Cây test là bản 0.10.11 chồng file, để
   chạy được `--expect-package` mà không sinh ra một artifact tạm. Bản
   0.10.12/0.10.11-rebuild phải do main session dựng **sau** khi merge
   homepage.
3. **Version header không đổi.** `build-051-release.mjs` viết version vào
   header **lúc build** (`boot.replace(' * Version:           0.10.1', …)`)
   từ `--version`. `0.9.7` trong source là di sản của baseline và không
   phải version được đóng gói — sửa nó sẽ làm hỏng phép thay chuỗi đó.
4. **Theme đã đổi (`home.php`) → cần đóng gói lại theme.**
   `release-manifest.json` ghi "theme stays 0.8.6, not repackaged"; bản
   sửa trạng-thái-rỗng của `/blog/` nằm trong theme, nên câu đó không còn
   đúng. Header theme vẫn ghi `0.8.5` (release manifest ghi 0.8.6 và nói
   rõ "version header ignored") — **không tự bump**, cần main session
   quyết cách đánh số và có đóng gói theme cùng đợt hay không.
5. **Logo chính thức `/cong-ty/`** — chưa có media registry entry.
6. **`PRICING_PLANS.audience`** — cần quyết định nội dung (xem §7).
7. **h1/prose của `/nganh/`, `/tai-nguyen/`, và hero diagram** — quyết
   định nội dung + SEO của owner (xem §6).
8. **Không chạm bài viết.** Không có script nào trong phiên này ghi vào
   post, meta hay option; `Content_Pages` vẫn không có writer nào.
