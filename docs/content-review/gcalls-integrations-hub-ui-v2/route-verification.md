# Route Verification

Each route loaded in a real browser (Chrome via Playwright): final URL unchanged (no bad redirect), exactly one H1, not a 404 page. Card paths use nested `/tich-hop/<slug>/` — no flat legacy paths, no `#`.

| Route | HTTP | 1 H1 | no redirect | not 404 | H1 text |
|---|--:|:--:|:--:|:--:|---|
| /tich-hop/ | 200 | ✓ | ✓ | ✓ | Kết nối Gcalls với hệ thống doanh nghiệp đang sử dụng |
| /tich-hop/hubspot/ | 200 | ✓ | ✓ | ✓ | Tổng đài Gcalls tích hợp HubSpot – đưa cuộc gọi vào quy trình CRM |
| /tich-hop/salesforce/ | 200 | ✓ | ✓ | ✓ | Tổng đài tích hợp Salesforce cho đội Sales và Customer Service |
| /tich-hop/zoho-crm/ | 200 | ✓ | ✓ | ✓ | Tổng đài tích hợp Zoho CRM cho đội Sales và CSKH |
| /tich-hop/freshdesk/ | 200 | ✓ | ✓ | ✓ | Tổng đài tích hợp Freshdesk cho đội CSKH và Support |
| /tich-hop/zendesk/ | 200 | ✓ | ✓ | ✓ | Tổng đài tích hợp Zendesk cho đội CSKH và Support |

**All routes pass: true.** Gate cross-checks: hashLinks_zero=true, platformLinks_5=true.
