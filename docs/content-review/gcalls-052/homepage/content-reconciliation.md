# GCALLS-052 · Homepage `/` — Step A React reconciliation

Integration branch `feature/gcalls-ui-v2-integration @ 5835a0b` (worktree `gcalls-ui-v2-integration`), branched from the consolidated `feature/gcalls-react-ui-v2-integration` after its Homepage checkpoint `5835a0b` ("homepage V2 — 13 sections at 1180/50px").

React source: `src/pages/HomePage.tsx` + `src/components/home/*`. Style scope: `src/styles/home.css` (`.home-page` — 1180 container, 25px block padding = 50px seam).

## 13 sections — approved order (matches acceptance "13 section")
| # | Section | Component | 1 H1? | Media/mockup | Fabricated-data flag |
|---|---|---|---|---|---|
| 1 | Hero | HeroSection | **H1 here** | — | — |
| 2 | Pain points + loss estimator | PainPointsSection | — | — | — |
| 3 | Solution bridge | SolutionBridgeSection | — | — | — |
| 4 | Product & solution ecosystem | EcosystemSection | — | — | — |
| 5 | Realtime call activity | CallTimelineSection | — | animated timeline mockup | **`73%` "Tỷ lệ nghe máy (minh họa)"**, "Khách hàng 01–05" (generic) |
| 6 | Built-in mini CRM | CRMSection | — | CRM mockup | — |
| 7 | Analytics & KPI dashboard | AnalyticsSection | — | dashboard mockup | check for invented KPI values |
| 8 | Cloud call center | CloudSection | — | — | — |
| 9 | Customer popup | CustomerPopupSection | — | popup mockup | — |
| 10 | Call button widget | CallWidgetSection | — | widget mockup | — |
| 11 | Integration CTA | IntegrationCtaSection | — | integration mockup | **phone `0900000001`** |
| 12 | Work from anywhere | WorkFromAnywhereSection (+ `TeamPermissionsBlock`) | — | team/permissions dashboard | per-agent `calls` (12/8/17/5/21/0), phones `0900 000 002/004` |
| 13 | Use cases & final CTA | UseCasesFinalCtaSection | — | — | final CTA (1) |

## Acceptance reconciliation
- **13 sections / 1 H1 / 1180 container / 50px seam** — present (H1=1, overflow=0, pii=[] measured @1440).
- **TeamSection không bị mất; chuyển vào "Làm việc mọi nơi"** — ✅ satisfied. `TeamSection.tsx` is intentionally unrendered (had no route); its argument was moved into §12 via `TeamPermissionsBlock`. Nothing deleted.
- **No invented people** — names are generic placeholders ("Nhân viên 01", "Khách hàng 01"), emails `@example.com`. No real PII (the prior real-looking phone/email were already stripped).
- **⚠️ Fabricated demo metrics remain on rendered sections** — this fails `HOMEPAGE_FABRICATED_DATA_ZERO` as written:
  - fake phone numbers `0900000001`, `0900 000 002`, `0900 000 004` (obvious sequential placeholders, but the acceptance forbids fabricated phone numbers);
  - per-agent call counts and `73%` answer-rate (invented metrics, one labeled "(minh họa)").
  - **Recommendation** (consistent with the CX task + [[gcalls-fabricated-product-imagery]]): neutralize the numeric values (phones → masked `••••`, counts/`73%` → `—` or drop), keep the generic labels + the "(minh họa)" caption. This is REMOVING invented data, not rewriting locked copy. Needs a go-ahead before the WordPress port (Step C) so the port carries the neutral version.

## Status
- Step A (reconciliation) — **done**.
- Steps B–G (bring UI into branch [already committed as 5835a0b] → neutralize fabricated demo data → WordPress generator port → real WordPress/Elementor render → 6-breakpoint QA → regression → checkpoint commit) — **pending**.
- **Homepage is NOT claimed PASS** — it has only been verified on React; it has not been run through PHP/Elementor (per the explicit rule).
