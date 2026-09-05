# GCALLS UI V2 — Solutions hub `/giai-phap/`

- Nhánh: `feature/gcalls-solutions-hub-ui-v2`
- Worktree: `/Users/macos/Desktop/Gcalls/App/gcalls-solutions-hub-ui-v2`
- Base SHA: `b8128fb` (Products Hub checkpoint)
- Chưa push, chưa deploy, không port WordPress.

---

## 1. Taxonomy before / after

| | Trước | Sau |
|---|---|---|
| Solution cards | **4** | **7** |
| Voicebot | vắng mặt ở cả hai hub | **1 solution card** |
| Cloud Call Center | vắng mặt | **có** |
| Call Button Widget | vắng mặt | **có** |
| Cards eyebrow | "BỐN NHÓM GIẢI PHÁP" | **"BẢY GIẢI PHÁP"** |
| Decision guide rows | 4 | **5** (thêm Voicebot) |
| Product cards trong hub này | 0 | 0 |

Trước checkpoint này, homepage giới thiệu bảy giải pháp còn hub họ bấm sang chỉ
có bốn — Voicebot, Cloud Call Center và Call Button Widget biến mất. Sau
Products Hub checkpoint, Voicebot còn không có card ở hub nào. Nay đã đúng chỗ.

Trạng thái taxonomy toàn site: **3 sản phẩm / 7 giải pháp**, Voicebot chỉ thuộc
giải pháp.

---

## 2. Roster bảy giải pháp

| # | Nhóm | Tên | Đích | Loại đích |
|---|---|---|---|---|
| 1 | A — Hệ thống & thị trường | Tổng đài tích hợp CRM | `ROUTES.crmIntegration` | route |
| 2 | A | Tổng đài tích hợp Helpdesk | `ROUTES.helpdeskIntegration` | route |
| 3 | A | Tổng đài tích hợp POS | `ROUTES.posIntegration` | route |
| 4 | A | Tổng đài quốc tế | `ROUTES.internationalCalling` | route |
| 5 | B — Tự động hóa & bổ sung | **Giải pháp tích hợp Voicebot AI** | `ROUTES.voicebotAi` | route |
| 6 | B | **Cloud Call Center** | `leadCtaHref({…solution:'Cloud Call Center'})` | lead |
| 7 | B | **Call Button Widget** | `leadCtaHref({…solution:'Call Button Widget'})` | lead |

Không có giải pháp thứ tám. Gate assert mỗi tên xuất hiện **đúng một lần**.

Hai nhóm chỉ là **nhãn UI** để lưới 7 card dễ quét — không phải taxonomy thứ hai,
không phải claim SEO. Card nào không thuộc nhóm nào vẫn render ở khối thứ ba,
nên một giải pháp thêm sau này không thể lặng lẽ biến mất.

---

## 3. Source-to-hub mapping

Nguồn: `src/components/home/EcosystemSection.tsx`, mảng `solutions`.

Mảng đó là `const` **module-private** trên một file ngoài phạm vi, nên không
import được. Thay vì chép tay rồi hy vọng, `scripts/verify-solutions-hub.mjs`
**đọc chính file đó** và fail nếu hub lệch:

| Assertion | Nội dung |
|---|---|
| roster upstream vẫn có 7 mục | fail nếu homepage thêm/bớt |
| tên upstream khớp bộ bảy | fail nếu đổi tên |
| mỗi title upstream có mặt trong `SOLUTIONS_HUB` | fail nếu drift |
| description của 3 mục mới port **nguyên văn** | so khớp chuỗi đầy đủ |
| đích `ROUTES.*` khớp upstream | Voicebot |
| `solution` attribution khớp upstream | Cloud Call Center, Call Button Widget |

Ba mô tả mới lấy nguyên văn từ homepage. Bốn card cũ giữ nguyên copy hub đã
duyệt (chi tiết hơn) — brief cấm sửa copy không liên quan.

---

## 4. Field override audit

| field | from | to | source evidence | reason |
|---|---|---|---|---|
| docstring `SOLUTIONS_HUB` | "Four solutions…" | "Seven solutions…" + ghi chú nguồn/Voicebot/lead links | roster homepage | số lượng sai |
| `hero.description` | "…hệ thống doanh nghiệp đang dùng, và thiết lập liên lạc cho các thị trường…" | "…, thiết lập liên lạc cho các thị trường…, và bổ sung các khả năng tự động hóa hoặc mở rộng kênh tiếp nhận khi cần." | roster có nhóm B | hero giới hạn còn 4 |
| `directAnswer.answer` | "Gcalls có **bốn nhóm giải pháp**… Nhóm thứ tư là tổng đài quốc tế…" | "Gcalls có **bảy giải pháp**. Bốn giải pháp gắn với hệ thống và thị trường… Ba giải pháp còn lại bổ sung khả năng vận hành: tích hợp Voicebot AI…, Cloud Call Center…, Call Button Widget…" | roster homepage | enumeration chỉ có bốn |
| `cards.eyebrow` | "BỐN NHÓM GIẢI PHÁP" | "BẢY GIẢI PHÁP" | roster homepage | chuỗi bị cấm |
| `cards.h2` | "Chọn theo hệ thống và thị trường doanh nghiệp đang vận hành" | "Chọn theo hệ thống, thị trường và cách đội ngũ đang vận hành" | nhóm B không phải hệ thống/thị trường | heading loại trừ 3 card mới |
| `cards.items` | 4 mục | **7 mục** (+ Voicebot, Cloud Call Center, Call Button Widget) | roster homepage, nguyên văn | thiếu 3 giải pháp |
| `cards.note` | *không đổi* | — | — | vẫn đúng với 7 |
| `decisionGuide.rows` | 4 dòng | **5 dòng** (+ Voicebot) | copy đã duyệt, chuyển từ `PRODUCTS_HUB` | brief yêu cầu bổ sung Voicebot |
| `decisionGuide.h2` / `lead` / `note` | *không đổi* | — | — | vẫn đúng |
| import | `type { LeadCtaContext }` | `{ leadCtaHref, type LeadCtaContext }` | — | cần dựng lead href |

**Không thay copy nào khác.** Dòng decision guide của Voicebot dùng đúng copy đã
duyệt trước đây nằm trong `PRODUCTS_HUB` (`b26db78`), chỉ đổi nhãn link sang tên
giải pháp đã duyệt — vì brief cấm dùng "Gcalls Voicebot AI" như tên sản phẩm.

Chuỗi "Bốn" duy nhất còn lại nằm trong câu **"Gcalls có bảy giải pháp. Bốn giải
pháp gắn với hệ thống và thị trường…"** — là số đếm của nhóm A trong một câu đã
nói "bảy", không phải "bốn nhóm giải pháp". Gate assert riêng cả hai chuỗi bị cấm.

---

## 5. Link-attribution report

| Card | href | Attribution giữ nguyên |
|---|---|---|
| Cloud Call Center | `/lien-he/?intent=consultation&source=consultation&solution=Cloud+Call+Center` | ✓ khớp homepage |
| Call Button Widget | `/lien-he/?intent=consultation&source=consultation&solution=Call+Button+Widget` | ✓ khớp homepage |

- Dựng bằng `leadCtaHref(...)`, **không** nối chuỗi query thủ công.
- Không tạo route giả cho hai giải pháp chưa có trang con.
- 0 `href="#"`, 0 href rỗng.
- Gate **điều hướng thật** tới mọi internal href và fail nếu trang trả 404.
- `leadAwareHref` để nguyên href đã có query (nó chỉ can thiệp khi path đúng bằng
  `/lien-he/`), nên attribution không bị nuốt.

---

## 6. UI

| Hạng mục | Trước | Sau |
|---|---|---|
| Container | 1280px | **1180px** (chỉ trong `.sh-page`) |
| Seam | 192px @1440 | **50px** (25px mỗi bên) |
| Hero | text-only | text-only, nhẹ hơn — **không mock dashboard** |
| Nhóm A | 4 card 2 cột | **2×2**, giữ 2×2 ở `lg` để hàng đều |
| Nhóm B | — | **3 cột ở `lg`**; ở `sm` card thứ ba span 2 track và căn giữa |
| Glyph | không | **7 glyph riêng**, khớp icon homepage |

- Card cùng hàng bằng chiều cao — assert ở cả 6 breakpoint.
- Một link/card → không nested link; mỗi CTA có `aria-label` riêng (hai card
  cùng nhãn "Nhận tư vấn" nên nhãn hiển thị là không đủ).
- Một final CTA duy nhất. Không có ảnh nào trên hub — hub điều hướng, không bán.
- `HubLayout.tsx` **không bị sửa**; tạo `SolutionsHubLayout.tsx` page-local.

### Chiều cao

| Breakpoint | Trước | Sau | Chênh |
|---|---|---|---|
| 1440 | 4 671px | **4 642px** | −29px |
| 1280 | 4 671px | **4 642px** | −29px |
| 1024 | 4 991px | **5 008px** | +17px |
| 768 | 5 762px | **5 780px** | +18px |
| 390 | 7 749px | **9 115px** | +1 366px |
| 320 | 8 491px | **10 018px** | +1 527px |

Desktop **thấp hơn** dù thêm ba card — nhịp 50px và container 1180px bù lại.
Mobile cao hơn là đúng và không tránh được: ba giải pháp nữa xếp dọc. Trang này
lẽ ra vẫn phải cao hơn ở mobile, vì trước đó nó đang **thiếu nội dung**.

---

## 7. Gate

`node scripts/verify-solutions-hub.mjs` → **125 passed / 0 failed**.

7 solution cards · mỗi tên đúng một lần · Voicebot đúng một lần và dùng tên đã
duyệt · tên bị cấm "Gcalls Voicebot AI" không xuất hiện ở DOM lẫn code · 3 sản
phẩm không nằm trong solution cards · Cloud Call Center + Call Button Widget tồn
tại · không có giải pháp thứ tám · 1 H1 · 0 fabricated KPI (count/%/năm/uptime/
SLA/đối tác/giá/24-7) · 0 PII · 0 `href="#"` · mọi internal href điều hướng thật ·
0 broken link · 0 overflow · 0 empty grid track · 0 heading orphan · mọi chuỗi
`SOLUTIONS_HUB` được render · 5 hub ngoài phạm vi byte-equivalent · container 1180 ·
seam 25/25 · card cùng hàng bằng chiều cao · tap target ≥44px · 6 breakpoint.

`typecheck` / `test` / `lint` / `build`: PASS. Lint giữ nguyên **6 warning** như base.

### Regression — `regression-report.txt`

`/` · `/san-pham/` · `/tich-hop/` · `/nganh/` · `/tai-nguyen/` · `/cong-ty/` ·
`/gcalls-plus-webphone/` · `/qc-bot-ai/` · `/gcalls-cx/` · `/voicebot-ai/`
→ **IDENTICAL**. Chỉ `/giai-phap/` CHANGED.

**Unexpected route changes: 0.**

Năm hub ngoài phạm vi: xem `unaffected-hub-hashes.md` — cả năm byte-equivalent.

---

## 8. Ghi chú quá trình

Lần chạy đầu tôi đo nhầm: cổng 5205 đã bị dev server của worker CX chiếm, nên
`--strictPort` của tôi fail và tôi đọc kết quả từ server của họ (`/giai-phap/`
vẫn là bản cũ). Đã chuyển sang cổng 5211/5212 do worktree này sở hữu và đo lại
toàn bộ. Không đọc file chưa commit của worker nào.

`/favicon.ico` trả 404 trên mọi route — thiếu sót toàn site, ngoài phạm vi.

---

## 9. Tín hiệu

- `SOLUTIONS_HUB_CONTENT_PASS`
- `SOLUTIONS_HUB_TAXONOMY_7_PASS`
- `VOICEBOT_SOLUTION_CARD_PASS`
- `VOICEBOT_PRODUCT_CARD_ZERO`
- `SOLUTIONS_HUB_LINKS_PASS`
- `SOLUTIONS_HUB_UI_LOCAL_PASS`
- `UNAFFECTED_HUBS_BYTE_EQUIVALENT`
- `SOLUTIONS_HUB_REVIEW_PENDING_OWNER`

## Nội dung thư mục

- `README.md` — checkpoint này
- `unaffected-hub-hashes.md` — 5 băm trước/sau
- `preview/` — 6 full-page, hero desktop/mobile, crop 7 card, lưới card desktop + 390, crop decision guide, `metrics.json`
- `regression-report.txt` — 11 route
- `verify-output.txt` — kết quả gate
- `file-diff.txt` — diffstat + file mới + full diff
