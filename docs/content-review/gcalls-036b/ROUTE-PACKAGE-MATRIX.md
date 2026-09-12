# GCALLS-036B — Route / package matrix (corrected)

Nguồn: nội dung thật của `gcalls-core-0.10.0.zip` và `gcalls-core-0.10.1.zip`
(`data/product-pages.json`, `data/content-pages.json`), không suy đoán.

**Đính chính GCALLS-036.** Báo cáo trước gộp sáu route "trống trên live" thành
một nhóm và ngầm gán chúng cho Batch 2. Sai. Core 0.10.1 Batch 2 chỉ thêm sáu
route tích hợp; `/bang-gia/` và `/uoc-tinh-chi-phi/` **không** nằm trong bất kỳ
gói nào, và `/san-pham/`, `/giai-phap/`, `/lien-he/` đã có mặt từ 0.10.0.

| Route | Family | Gói đầu tiên có manifest | Live (Core 0.10.0) | Trạng thái live | Preview local | Lý do nếu blocked |
| --- | --- | --- | --- | --- | --- | --- |
| `/gcalls-plus-webphone/` | product | 0.10.0 | có | có nội dung | **có** | — |
| `/gcalls-cx/` | product | 0.10.0 | có | có nội dung | **có** | — |
| `/voicebot-ai/` | product | 0.10.0 | có | có nội dung | **có** | — |
| `/qc-bot-ai/` | product | 0.10.0 | có | có nội dung | **có** | — |
| `/san-pham/` | hub | 0.10.0 | có | 4 section, mỏng | **có** | — |
| `/giai-phap/` | hub | 0.10.0 | có | 4 section, mỏng | **có** | — |
| `/lien-he/` | contact | 0.10.0 | có | 1 section + form slot khoá | **có** | form runtime chưa merge — chủ ý |
| `/tong-dai-tich-hop-crm/` | solution | 0.10.0 | có | 14 section | **có** | — |
| `/tong-dai-tich-hop-helpdesk/` | solution | 0.10.0 | có | 12 section | **có** | — |
| `/tong-dai-tich-hop-pos/` | solution | 0.10.0 | có | 13 section | **có** | — |
| `/tong-dai-quoc-te/` | solution | 0.10.0 | có | 14 section | **có** | — |
| `/tich-hop/` | integration hub | **0.10.1** | không | vỏ rỗng, 1 011px | **có** | 0.10.1 chưa upload |
| `/tich-hop/hubspot/` | integration | **0.10.1** | không | chưa tồn tại | **có** | 0.10.1 chưa upload |
| `/tich-hop/salesforce/` | integration | **0.10.1** | không | chưa tồn tại | **có** | 0.10.1 chưa upload |
| `/tich-hop/zoho-crm/` | integration | **0.10.1** | không | chưa tồn tại | **có** | 0.10.1 chưa upload |
| `/tich-hop/freshdesk/` | integration | **0.10.1** | không | chưa tồn tại | **có** | 0.10.1 chưa upload |
| `/tich-hop/zendesk/` | integration | **0.10.1** | không | chưa tồn tại | **có** | 0.10.1 chưa upload |
| `/bang-gia/` | pricing | **không gói nào** | — | vỏ rỗng, 905px | **không** | không có manifest ở 0.10.0 lẫn 0.10.1 |
| `/uoc-tinh-chi-phi/` | estimator | — (shortcode) | có | estimator hoạt động | **không** | render bằng `[gcalls_estimator]` + `estimator-config.json`, không phải manifest section |

Sáu route Batch 2 = đúng danh sách trong brief. `/bang-gia/` là **batch còn
thiếu**, không phải Batch 2 chưa upload — cần một exporter run mới sinh manifest
cho nó. Không tạo nội dung thay thế.

`/uoc-tinh-chi-phi/` không thuộc hệ component này: nó là một shortcode riêng có
config riêng, và trang live đã có nội dung thật. Đưa nó vào route matrix của
renderer là nhầm lẫn thể loại.

## Có manifest local nhưng chưa live

Sáu route `/tich-hop/*` đã dựng preview local đầy đủ (12–16 section mỗi trang)
từ `content-pages.json` của gói 0.10.1. Acceptance local PASS ở cả năm
breakpoint. **Live acceptance vẫn phải chờ upload** — preview không thay thế nó.
