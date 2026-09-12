# `/bang-gia/` — MISSING_BATCH scope

**Không thuộc Core 0.10.1.** Không có manifest trong `gcalls-core-0.10.0.zip`
lẫn `gcalls-core-0.10.1.zip`. Trang live trả về vỏ rỗng 905px, 0 section. Đây là
một batch chưa từng được export, không phải Batch 2 chưa upload.

**Không đề xuất đưa vào Core 0.10.2**, vì làm vậy sẽ mở rộng release ra ngoài
Batch UI-1 đã duyệt. Ghi lại ở đây để lên lịch riêng.

## Nguồn React chính xác

| | |
| --- | --- |
| Route | `/bang-gia/` (`ROUTES.pricing`) |
| Page component | `src/pages/PricingPage.tsx` — 332 dòng |
| Data module | `src/data/pricing.ts` |
| Family | `pricing` — family mới, chưa có trong `content-pages.json` |

## Data shape

| Export | Nội dung |
| --- | --- |
| `PRICING_CONFIGURED` | **`false`** |
| `PRICE_FALLBACK` | object trạng thái khi chưa có giá |
| `PRICING_NOTE` | `'Chi phí phụ thuộc cấu hình'` |
| `ADDON_PRICE_LABEL` | `'Báo giá theo nhu cầu'` |
| `GCALLS_PLUS_PLANS` | 8 object |
| `SOLUTION_PRICING` | 21 object |
| `PRICING_FACTORS` | 6 object |
| `COMPARISON_COLUMNS` / `COMPARISON_ROWS` | 6 cột × 7 hàng |
| `PRICING_ADDONS` | 7 object |
| `PRICING_FAQ` | 7 câu |

## Pricing claims — điểm quan trọng nhất

`PRICING_CONFIGURED = false`, và mọi entry có `pricingConfigured: false` cùng
money field `null`. Comment trong chính file nói rõ: chừng nào còn như vậy, UI
**phải** render trạng thái yêu cầu báo giá, không phải một con số.

Nghĩa là: **không có bảng giá nào để port.** Port đúng đắn là port *trạng thái
chưa có giá* cùng 7 yếu tố ảnh hưởng chi phí và 7 câu FAQ. Bịa một con số ở đây
sẽ là vi phạm claim guard nghiêm trọng nhất trong toàn dự án — trang giá là nơi
một con số sai gây hậu quả thương mại trực tiếp.

Không sáng tác giá, không sáng tác chính sách thương mại.

## CTA

Từ CTA inventory: bốn product page đều trỏ tới `/bang-gia/` ("Xem bảng giá
Gcalls") từ section `*_PRICING`. Trang đích hiện là vỏ rỗng, nên **bốn conversion
path đang dẫn tới một trang trống**. Đó là lý do nên xếp lịch sớm, độc lập với
việc nó không thuộc release này.

## Component tái sử dụng được

| React | Component đã có |
| --- | --- |
| `PricingHero` | `gc-hero` |
| `SectionHeader` | `gc-head` |
| `PricingFactorCard` | `gc-grid` + `gc-card` |
| `PricingComparison` | `gc-compare` (đã có CSS, chưa có route nào dùng) |
| `PricingFAQ` | `gc-faq` |
| `EnterprisePricingCTA` | `gc-cta` |
| `SolutionPricingCard` | `gc-grid--3` |

## Component còn thiếu

| Cần | Vì sao chưa có |
| --- | --- |
| `gc-plan` — thẻ gói có trạng thái "chưa có giá" | Chưa route nào cần hiển thị một gói mà không hiển thị giá |
| `gc-pricing-selector` — chuyển giữa product/solution | Chưa có component tab nào trong hệ |
| `gc-addons` — danh sách add-on với nhãn "Báo giá theo nhu cầu" | Mới |

## Batch/version đề xuất

**Batch UI-4, Core 0.10.3.** Sau khi UI-1 và UI-2 được nghiệm thu trên live.
Điều kiện vào: exporter sinh được `content-pages` family `pricing`, và ba
component trên được dựng cùng gate "không hiển thị số tiền khi
`pricingConfigured` là false".

## `/uoc-tinh-chi-phi/`

Vẫn là shortcode `[gcalls_estimator]` với `estimator-config.json` riêng. Trang
live đã có nội dung thật và hoạt động. **Không** ép qua content-page renderer.
