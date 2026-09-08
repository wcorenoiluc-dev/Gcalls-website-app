# GCALLS-055 · Homepage fabricated-data audit (Step 1)

Owner decision: neutralize ALL simulated result data (phones, counts, %, KPI, agent results, IDs, names, emails) even where captioned "minh họa". Keep functional labels + captions; replace values with `—` / masked / generic. Scope = rendered homepage mockup / illustration / stat regions only. Do NOT touch years, step numbers, config weights, valid ordinals, or approved marketing copy.

| Component | Section | Fabricated field | Before | Replacement |
|---|---|---|---|---|
| HeroSection | 1 Hero | stat tiles | `84`, `73%`, `5:24`, `+12%`, `+4%`, `-0:18` | value `—`, drop `change` |
| CallTimelineSection | 5 | contact phones | `0900 000 001…005` | `—` / masked |
| CallTimelineSection | 5 | stat tiles | `84` "Cuộc gọi hôm nay (minh họa)", `73%` "Tỷ lệ nghe máy (minh họa)" | value `—` (keep label+caption) |
| CRMSection | 6 | customer emails | `kh01…05@example.com` | drop (masked skeleton) |
| CRMSection | 6 | customer phones/values | any `0900…`, order totals | `—` |
| AnalyticsSection | 7 | agent table | `out/in/missed`, `rate 97/92/98/86%`, `dur` | `—` |
| AnalyticsSection | 7 | KPI tiles | `284/391/23/3:25/4.7`, `+12%/+8%/-5%/-0:12/+0.3`, totals `675/638/37` | value `—`, drop `change` |
| CloudSection | 8 | extension board | `ext 101…`, `hotline 1900 000x`, `calls N` | ext keep? → hotline `—`, calls `—` |
| WorkFromAnywhereSection | 12 | team roster | `calls 12/8/17/5/21/0`, `dur` | `—` |
| WorkFromAnywhereSection | 12 | event log + phone display | `0900 000 002/004`, "· Gia hạn" phone | `—` / masked |
| TeamPermissionsBlock | 12 | role headcounts | `count 2/4/38` | `—` |
| IntegrationsSection | 11 | contact phone | `0900000001` | `—` / masked |

Names: `Nhân viên 01…` / `Khách hàng 01…` are generic placeholders (kept as generic; not real). No `api.gcalls.vn` / `sip.gcalls.vn` found. No real PII (already stripped in 5835a0b).

To verify after Step 2: (a) source scan clean, (b) rendered-DOM scan at 6 breakpoints clean (incl aria-label/title/data-*/serialized JSON), (c) no old values left in comments the packager could surface.
