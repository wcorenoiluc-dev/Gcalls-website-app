# Content Reconciliation — `/lien-he/`

Approved copy preserved; nothing invented. Sources: `CONTACT` (navigation.ts), the contact sitemap
entry (sitemap.ts), and the shared `LeadForm`.

| Element | Value | Source |
|---|---|---|
| H1 (exactly one) | "Liên hệ" | sitemap `shellHeading` → entry label (unchanged) |
| Lead paragraph | "Chia sẻ nhu cầu hiện tại để đội ngũ Gcalls có thêm thông tin trước khi trao đổi cùng doanh nghiệp." | sitemap entry `intro` (read at runtime) |
| SEO `<title>` | "Liên hệ Gcalls \| Tư vấn giải pháp tổng đài cho doanh nghiệp" | app-level `<Seo/>` (pathname-driven, unchanged) |
| Meta description | approved contact description | sitemap entry `description` via `<Seo/>` |
| Email | `sales@gcalls.co` (`mailto:`) | `CONTACT.email` |
| Hotline | `028 7302 5469` (`tel:+842873025469`) | `CONTACT.phone` / `CONTACT.phoneHref` |
| Breadcrumb | Trang chủ › Liên hệ (+ BreadcrumbList JSON-LD) | `getBreadcrumbTrail` |
| Form heading/fields/CTA | "Gửi yêu cầu tư vấn" + Họ tên/Công ty/Email/SĐT/Nhu cầu/Nội dung | shared `LeadForm` variant="contact" (unchanged) |
| "What helps" hints | Quy mô đội ngũ · Hệ thống đang sử dụng · Thời điểm dự kiến triển khai | verbatim from LeadForm's message placeholder |

## Deliberately NOT present
- No SLA / response-time promise ("phản hồi trong 15 phút/24 giờ") — none is approved.
- No eyebrow duplicating the H1 (the prior bug): the page has one H1 and no repeated "Liên hệ" eyebrow.
- No product mockup, dashboard or screenshot.
- No generic closing CTA band (the previous RouteShell render appended one; the dedicated page omits it).
- No "chưa được kết nối" persistent notice (the DEV-only notice is absent from the production build).

## Attribution copy
When the visitor arrives with an allow-listed `?product=`, the left column shows
"Bạn đang quan tâm: <approved label>" and the form shows its own "Quan tâm:" chip. Both are gated by
`displayableLeadProduct` — an unrecognised value renders nothing.
