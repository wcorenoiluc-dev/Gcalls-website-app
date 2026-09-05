# GCALLS UI V2 — Company hub `/cong-ty/`

- Nhánh: `feature/gcalls-company-hub-ui-v2`
- Worktree: `/Users/macos/Desktop/Gcalls/App/Gcalls-company-hub-ui-v2`
- Base SHA: `5364ed6` (Solutions Hub checkpoint, chứa Products Hub)
- Dev server: `127.0.0.1:5215`, PID 45962, branch `feature/gcalls-company-hub-ui-v2`, HEAD tại thời điểm chạy `5364ed6`
- Chưa push, chưa deploy, không port WordPress.

> Base: brief yêu cầu "immutable base SHA phù hợp sau Products Hub". Dùng
> `5364ed6` vì đó là commit mới nhất đã có Products Hub, và `/giai-phap/` nằm
> trong danh sách regression — base cũ hơn sẽ báo giả sai ở route đó.

---

## 1. Content reconciliation

Toàn bộ copy đọc từ `COMPANY_HUB`. **`src/data/hubs.ts` không bị sửa** (gate
assert riêng). Trang render đủ 8 khối:

| # | Khối | Nguồn | Render |
|---|---|---|---|
| 1 | Breadcrumb | `breadcrumbLabel` | ✓ |
| 2 | Hero | `hero.eyebrow/h1/description/primaryCta/secondaryCta` | ✓ |
| 3 | Direct answer | `directAnswer.eyebrow/question/answer` | ✓ |
| 4 | Ba nguyên tắc | `cards.eyebrow/h2/items[3]` | ✓ |
| 5 | Các trang thông tin | `decisionGuide.eyebrow/h2/rows[4]` | ✓ |
| 6 | Liên hệ trực tiếp | `CONTACT` (navigation.ts) | ✓ |
| 7 | Onward links | `links.h2/items[5]` | ✓ |
| 8 | Final CTA | `finalCta.*` | ✓ |

Gate đối chiếu **mọi chuỗi ≥12 ký tự** mà `COMPANY_HUB` khai báo với text đã
render, và assert phép quét không rỗng (≥20 chuỗi) để không PASS giả.

H1 duy nhất, đúng chuỗi yêu cầu:
*"Gcalls xây dựng nền tảng giao tiếp cho doanh nghiệp Việt Nam"*.

### Ba nguyên tắc — đúng nguồn, không thêm số

1. Cuộc gọi gắn với dữ liệu
2. Triển khai theo hệ thống thực tế
3. Nói rõ phạm vi trước khi cam kết

Trình bày dạng ba bước đánh số `01/02/03`, bằng chiều cao, không kết quả định lượng.

---

## 2. Claim audit

Gate fail nếu xuất hiện bất kỳ mục nào dưới đây. **Tất cả đều vắng mặt:**

| Nhóm | Trạng thái |
|---|---|
| năm thành lập · số năm hoạt động | absent |
| số khách hàng · số quốc gia · số CRM · số nhân sự | absent |
| doanh thu · vốn đầu tư | absent |
| giải thưởng · chứng nhận | absent |
| thị phần · tỷ lệ tăng trưởng | absent |
| uptime / SLA | absent |
| tên khách hàng · customer logo wall · testimonial · partnership logo | absent |
| "hàng đầu" · "số một" · "tiên phong" · "tốt nhất" · "được tin dùng bởi hàng nghìn doanh nghiệp" | absent |

**Trang chỉ có đúng 1 ảnh** — logo Gcalls chính thức. Gate assert điều này, nên
một logo wall không thể lọt vào mà không fail.

Một điều chỉnh trong checker: mẫu bắt "logo khách hàng" ban đầu báo động nhầm
câu **đã duyệt** *"Tên và logo khách hàng chỉ được đăng sau khi có sự đồng ý
bằng văn bản."* — đó là chính sách xin phép, **ngược lại** với logo wall. Mẫu đã
được sửa để không bắt câu này; phần chặn logo wall thật nằm ở assertion "chỉ có
một ảnh".

Không có Organization JSON-LD trên trang này: node đó mời gọi `foundingDate`,
`numberOfEmployees`, `award` — đều chưa có bằng chứng.

---

## 3. Official logo

Xem `official-logo-manifest.json`.

| Field | Giá trị |
|---|---|
| `sourceUrl` | `https://gcalls.co/wp-content/uploads/2019/07/logo@2x.png` |
| `sha256` | `17b080c3988ac97617c394ce3cb51c135c5f00785dfe187b482a319b124f4d21` |
| `mimeType` | `image/png` |
| `width` × `height` | 137 × 40 |
| `variant` | primary-on-light |
| `localPath` | `public/images/brand/gcalls-official-logo-137x40.png` |
| `hotlinkFalse` | `true` |

### Cách xác minh

Trang chủ `gcalls.co` **tự khai báo** đúng file này là logo tổ chức trong
schema.org JSON-LD của chính nó:

```
Organization.logo = ImageObject { url: .../logo@2x.png, width: 137, height: 40 }
```

File tải về có kích thước nội tại **đúng bằng** 137×40 mà schema khai báo. Đây
là bằng chứng mạnh nhất có thể lấy mà không cần hỏi chủ sở hữu.

### Ứng viên bị loại

| Ứng viên | Lý do loại |
|---|---|
| `logolight@2x.png` (137×40) | Biến thể light-on-dark. Hub render trên nền sáng, và schema chỉ định file primary. |
| `Untitled-design-1.svg` (512×512) | Là **favicon**, không phải wordmark. Cũng không phải vector thật: 183 KB SVG chứa 2 phần tử `<image>`, tức raster bọc trong SVG. Ưu tiên SVG của brief áp dụng cho file logo vector thật. |

### Ràng buộc đang được gate kiểm

- Phục vụ **local**, không hotlink — và assert **không request nào tới gcalls.co**
  lúc runtime.
- SHA-256 file trên đĩa khớp manifest.
- Kích thước nội tại khớp manifest.
- **Không upscale** — render tối đa 137px, kiểm ở cả 6 breakpoint.
- Không đổi màu, không vẽ lại.
- Chỉ dùng trong visual page-local của Company Hub. Header/footer/logo component
  toàn cục **không bị sửa**.

---

## 4. Child-route audit

Xem `child-route-audit.md`. **200 không phải bằng chứng trang đã hoàn chỉnh** —
cột "Content" mới là.

| Route | HTTP | Sections | Words | Content | Form |
|---|---|---|---|---|---|
| `/cong-ty/khach-hang/` | 200 | 12 | 2 988 | real content | không |
| `/cong-ty/doi-tac/` | 200 | 12 | 3 201 | real content | không |
| `/referral/` | 200 | **3** | **175** | real, nhưng **mỏng** | không |
| `/lien-he/` | 200 | 3 | 209 | real content | **có — 1 form, 7 field, 1 submit** |

### Claim cần chủ sở hữu duyệt

Checker gắn cờ hai chỗ; **cả hai đều là dương tính giả**, đã đối chiếu văn bản:

| Route | Cờ | Văn bản khớp | Kết luận |
|---|---|---|---|
| `/cong-ty/khach-hang/` | customer count | `"03 Doanh nghiệp"` | số thứ tự trong danh sách, không phải số khách hàng |
| `/cong-ty/doi-tac/` | official-partner claim | `"đối tác chính thức"` | nằm trong câu **phân biệt** tích hợp kỹ thuật với quan hệ đối tác chính thức — là disclaimer, không phải claim |

Checker in kèm đoạn văn bản khớp để người đọc tự phán xét, thay vì chỉ báo động.

### Nhận xét cần chú ý

`/referral/` **không công bố tỷ lệ hoa hồng hay điều khoản tài chính** — đúng
yêu cầu. Nhưng nó chỉ có 3 section / 175 từ và H1 là "Referral": đây là trang
sơ khai, không phải trang hoàn chỉnh. Hub liên kết tới nó với mô tả đúng mức
("Điều khoản được trao đổi trực tiếp"), nên không có gì bị nói quá — nhưng nếu
chủ sở hữu muốn trang này thuyết phục thì nó cần một vòng nội dung riêng.

Khách hàng: chưa có case/logo được duyệt → hub **không** hiển thị logo hay
testimonial, giữ nguyên qualification trong nguồn, CTA dẫn đúng `/cong-ty/khach-hang/`.

---

## 5. Contact verification

Xem `contact-verification.md`.

| Field | CONTACT | Render |
|---|---|---|
| email | `sales@gcalls.co` | text + `mailto:sales@gcalls.co` |
| phone | `028 7302 5469` | text |
| phoneHref | `tel:+842873025469` | href |

Component **không hardcode** bản sao nào: 0 lần xuất hiện literal `@gcalls.co`,
0 lần literal `028 ` trong `CompanyHubLayout.tsx`.

Gate: đúng 1 `mailto:`; href và text đều bằng `CONTACT.email`; `tel:` hiển thị
`CONTACT.phone`; **mọi** `tel:` href trên trang bằng `CONTACT.phoneHref`; không
có email nào khác; không có số điện thoại nào khác; CTA liên hệ không xếp sát nhau.

Có **hai** link `tel:` — một ở khối liên hệ, một ở final CTA band. Đó là đúng,
không phải trùng lặp: gate đo **khoảng cách dọc** giữa các link liên hệ thay vì
đếm, và yêu cầu ≥200px.

---

## 6. UI và before/after

| Hạng mục | Trước | Sau |
|---|---|---|
| Container | 1280px | **1180px** (chỉ trong `.ch-page`) |
| Seam | 192px @1440 | **50px** |
| Hero | text-only, full width | **52% copy / 48% brand visual** |
| Brand visual | không có | **logo chính thức + 3 lớp trung tính** |
| Nguyên tắc | card có link chrome | **3 bước đánh số**, bằng chiều cao |
| Trang thông tin | guide 2 cột kiểu bài toán | **card theo tên trang**, dễ quét |
| Liên hệ | 2 card text | **2 card có icon**, đọc từ `CONTACT` |

| Breakpoint | Trước | Sau | Chênh |
|---|---|---|---|
| 1440 | 4 562px | **3 850px** | −712px (−15.6%) |
| 1280 | 4 562px | **3 850px** | −712px (−15.6%) |
| 1024 | 4 886px | **4 217px** | −669px (−13.7%) |
| 768 | 5 679px | **5 464px** | −215px (−3.8%) |
| 390 | 7 118px | **7 271px** | +153px (+2.1%) |
| 320 | 7 659px | **7 891px** | +232px (+3.0%) |

Desktop thấp hơn đáng kể dù thêm brand visual. Mobile cao hơn chút vì brand
visual xếp dưới copy — đổi lại trang có một dấu hiệu nhận diện thật.

Hero vừa phải, không dashboard/KPI/ảnh stock đội ngũ, không ảnh văn phòng.
Một final CTA duy nhất. Không bọc section bằng panel lớn.

---

## 7. Gate

`node scripts/verify-company-hub.mjs` → **109 passed / 0 failed**.

1 H1 đúng chuỗi · mọi field `COMPANY_HUB` render · logo chính thức local, hash
khớp, không upscale, không request ra gcalls.co · email/phone đúng nguồn ·
0 fabricated company metric · 0 customer logo · 0 testimonial · 0 unsupported
partnership claim · 0 PII ngoài contact công khai · 0 `href="#"` · mọi internal
href điều hướng thật · 0 broken route · 0 overflow · 0 empty grid track ·
0 heading orphan · 0 task-created console error · container 1180 · seam 25/25 ·
card cùng hàng bằng chiều cao · tap target ≥44px · 6 breakpoint ·
`hubs.ts` và `HubLayout.tsx` không bị chạm.

`typecheck` / `test` / `lint` / `build`: PASS. Lint giữ nguyên **6 warning** như base.

### Regression — `regression-report.txt`

`/` · `/san-pham/` · `/giai-phap/` · `/tich-hop/` · `/nganh/` · `/tai-nguyen/` ·
`/cong-ty/khach-hang/` · `/cong-ty/doi-tac/` · `/referral/` · `/lien-he/`
→ **IDENTICAL**. Chỉ `/cong-ty/` CHANGED.

**Unexpected route changes: 0.**

---

## 8. Ghi chú

`/favicon.ico` trả 404 trên mọi route — thiếu sót toàn site, ngoài phạm vi.
Đáng chú ý: site **có** một SVG icon đang dùng làm favicon
(`Untitled-design-1.svg`), nhưng `index.html` của bản React không khai báo nó.

Dev server 5215 được dừng sau khi chụp.

---

## 9. Tín hiệu

- `COMPANY_HUB_CONTENT_PASS`
- `COMPANY_HUB_CLAIM_GUARD_PASS`
- `GCALLS_OFFICIAL_LOGO_LOCAL_PASS`
- `COMPANY_CONTACT_PASS`
- `COMPANY_CHILD_ROUTES_AUDITED`
- `COMPANY_HUB_UI_LOCAL_PASS`
- `COMPANY_HUB_REVIEW_PENDING_OWNER`

## Nội dung thư mục

- `README.md` — checkpoint này
- `official-logo-manifest.json` — nguồn, hash, kích thước, ứng viên bị loại
- `child-route-audit.md` — 4 route con
- `contact-verification.md` — đối chiếu `CONTACT`
- `preview/` — 6 full-page, hero desktop/mobile, crop nguyên tắc / trang thông tin / liên hệ, `metrics.json`
- `regression-report.txt` — 11 route
- `verify-output.txt` — kết quả gate
- `file-diff.txt` — diffstat + file mới + full diff
