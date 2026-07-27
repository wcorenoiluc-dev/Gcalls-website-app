# Pricing Reference — Visual Audit

**Reference:** `https://bug-last-38911008.figma.site` (title: *Bảng giá Gcalls*)
**Inspected:** 2026-07-27 at 390px, 768px and 1440px
**Purpose:** capture the reference's **visual language and UX quality** before implementing `/bang-gia/`.

> **Scope note.** The reference is used as a *design* reference only. Its branding, copy and
> — critically — its price values are **not** copied. GCALLS brand tokens and the
> Checkpoint 3A content brief supply all content.

---

## ⚠️ Finding that needs a decision

**The reference page displays concrete price values.** Observed live:

- Plan cards: `200.000₫ / tháng` (PRO), `250.000₫ / tháng` (PREMIUM), `360.000₫ / tháng` (OMNI-CX)
- Carrier tables: setup/subscription/per-minute rates for CMC, Viettel, Mobifone, VNPT
- International tables: per-country setup, subscription and per-minute rates (US, UK, AU, CA, DE, SG, KR, JP, PH, MY)
- Plan quotas: user counts, contact-storage limits, recording storage (5/10/20Gb)
- Feature entitlement matrix across four tiers, and a monthly/annual billing toggle

**None of this was implemented.** The Checkpoint 3A brief states there is no approved public
pricing configuration in this codebase and forbids rendering price values, quotas, limits,
storage, SLA or feature entitlements. That instruction was followed — the build ships a
no-price state throughout.

**Decision needed:** if those figures are approved public pricing, supply them as a pricing
configuration and the UI will render them with no structural change — `src/data/pricing.ts`
already models `monthlyPrice`, `annualPrice`, `oneTimeFee`, `features` and a
`pricingConfigured` flag, and every component reads through one formatter. Until that flag
flips, nothing numeric renders.

---

## 1. Layout system

| Property | Reference | Adopted |
|---|---|---|
| Container max width | 1280px | ✅ `max-w-[1280px]` |
| Horizontal padding | 20px mobile / 32px desktop | ✅ `px-5 lg:px-8` |
| Section rhythm | ~80–112px vertical | ✅ `py-14 sm:py-20 lg:py-24` |
| Page background | `#FFFFFF` with alternating tinted bands | ✅ `#FFFFFF` / `#FAF9FC` |
| Alignment | Section headers centered; content grids left | ✅ same |
| Document height @1440 | 5,572px | 6,090px (extra sections in brief) |

## 2. Typography hierarchy

| Element | Reference | Adopted (GCALLS, Open Sans) |
|---|---|---|
| Eyebrow | ~13–14px, 600–700, uppercase, wide tracking | ✅ 12–13px, 700, uppercase, `tracking-wider`, `#673AB7` |
| H1 | 48–60px, weight 500, **gradient-filled text** | ✅ 32px mobile → 56px desktop, weight 800, gradient fill |
| H2 | 36px, weight 500 | ✅ 26px mobile → 40px desktop, weight 800 |
| H3 (card title) | 18px, weight 600 | ✅ 18–20px, weight 700 |
| Price | ~40px, weight 700, primary purple | ➖ N/A — no prices rendered |
| Body | 15–16px | ✅ 16px (mobile floor) |
| Supporting / table | 14px | ✅ 14px minimum |

The reference's H1 uses `color: transparent` + a clipped background gradient. Adopted, using
GCALLS brand stops instead of the reference's indigo.

## 3. Colour

Reference brand colour is `rgb(103, 58, 183)` — identical to the GCALLS primary `#673AB7`.
Its gradient second stop is an indigo (`oklch(0.511 0.262 276.966)`), which was **replaced**
with the GCALLS dark purple `#4A2391` so the page stays on brand.

| Token | Value |
|---|---|
| Primary | `#673AB7` |
| Dark purple | `#4A2391` |
| Light | `#F5F1FC` |
| Background | `#FFFFFF` |
| Alt background | `#FAF9FC` |
| Text | `#1E2026` |
| Secondary text | `#5B5F6B` |
| Border | `#E8E5EF` |
| Brand gradient | `linear-gradient(135deg, #673AB7, #4A2391)` |

## 4. Pricing card design

Measured on the reference at 1440px:

| Property | Reference | Adopted |
|---|---|---|
| Radius | `14px` | ✅ `14px` |
| Default border | `1px solid` light neutral | ✅ `1px solid #E8E5EF` |
| Highlighted border | `2px solid rgb(103,58,183)` | ✅ `2px solid #673AB7` |
| Background | `#FFFFFF` | ✅ `#FFFFFF` |
| Shadow | none by default | ✅ none; soft purple shadow on highlight only |
| Card width @1440 | 405px standard / 426px highlighted | ✅ equal-width grid, highlight via border + ring |
| Highlight badge | pill centred, overlapping the top border | ✅ same placement |
| Internal order | name → price → description → CTA → hairline → feature list | ✅ name → fit statement → price state → CTA → hairline → config note |

**Deliberate deviation.** The reference grows the highlighted card (426px vs 405px) and lifts
it. A scale/translate transform on mobile is a known overflow source, so the highlight is
expressed with border weight, a ring and background only — no transform. The card grid stays
equal-height.

## 5. Buttons

| Variant | Reference | Adopted |
|---|---|---|
| Radius | `8px` | ✅ `10px` (matches the site's existing `rounded-xl` CTAs) |
| Filled | purple gradient bg, white text, 14px/500 | ✅ `#673AB7`, white, 15–16px/600 |
| Outline | `2px` purple border, white bg, purple text | ✅ same |
| Height | 36–38px (cards), 56px (final CTA) | ⬆️ **48px minimum**, 52px final CTA |
| Width in card | full width | ✅ full width |

**Deliberate deviation.** The reference's 36px card buttons fail the 44px touch minimum and
the brief's 48px floor. All CTAs are ≥48px.

## 6. Comparison section

Reference: several stacked tables, one per feature module, each with a purple gradient header
bar (`14px 14px 0 0` radius, white text), hairline row dividers, and ✓ / ✗ marks with
occasional text values. Roughly 30+ rows in total.

Adopted: the **visual treatment** (gradient header, hairline rows, radius, alignment) applied
to a single decision-oriented matrix — 7 qualitative rows × 5 solution columns, per brief §11.
No entitlement claims, no invented limits.

**Mobile:** the reference keeps a wide table. Replaced with an expandable card per solution,
since a 5-column table cannot be read at 390px without horizontal scrolling.

## 7. Section eyebrow / badge treatment

The reference introduces most sections with a filled purple pill (rounded-full, white text,
sometimes with a leading icon) above a centred gradient H2. Adopted for every section
eyebrow. The reference's pill copy is promotional ("Bảng giá tốt nhất thị trường"); GCALLS
eyebrows come from the content brief and make no market claims.

## 8. Tables and disclaimers

Reference: bordered container, tinted header row, hairline dividers, generous cell padding,
italic grey footnotes below (`(*) …`). Adopted for the add-on and comparison tables, and for
the "chi phí phụ thuộc cấu hình" notes.

## 9. Final CTA

| Property | Reference | Adopted |
|---|---|---|
| Shape | full-width gradient card, ~24px radius | ✅ `24px` radius |
| Fill | purple → indigo gradient | ✅ `#673AB7 → #4A2391` |
| Content | centred white H2 + subtitle + single white button | ✅ centred, **two** CTAs per brief §15 |
| Padding | 32px+ | ✅ `px-6 py-12` → `px-10 py-16` |

## 10. Mobile behaviour @390px (reference)

Measured: document width 375px, **0px horizontal overflow**, 9,074px tall.

| Aspect | Reference | Adopted |
|---|---|---|
| Card stacking | one per row, full width | ✅ same |
| Highlight badge | stays centred on top border | ✅ same |
| Billing toggle | remains inline at top | ➖ no billing toggle (no prices to switch) |
| Comparison table | stays wide | ⬆️ replaced with expandable cards |
| Product selector | none present | ⬆️ added — scrollable chip row (brief §5) |
| Section padding | reduced | ✅ same |

## 11. Not present in the reference — designed from the brief

These sections have no reference counterpart and were built in the same visual language:

- Product/solution selector (7 chips, brief §5)
- "Cách tính chi phí" 6-factor grid (brief §8)
- Solution pricing-model cards (brief §9)
- Interactive cost-estimator preview (brief §10)
- Add-ons / expansion grid (brief §12)
- Enterprise section (brief §13)
- FAQ accordion (brief §14) — the reference has no FAQ

## 12. Sticky elements

None observed in the reference. None implemented — a sticky selector at 390px would consume
scarce vertical space for little gain. Revisit if analytics show deep-scroll drop-off.

---

## Summary of deliberate deviations

| # | Reference | This build | Why |
|---|---|---|---|
| 1 | Real price values everywhere | No-price state | No approved pricing config; brief §3 |
| 2 | 36px card buttons | 48px minimum | Touch target / brief §16 |
| 3 | Highlighted card scaled larger | Border + ring only | Transforms cause mobile overflow |
| 4 | 30+ row entitlement matrix | 7-row qualitative matrix | Brief §11; no verified entitlements |
| 5 | Wide table on mobile | Expandable cards | Unreadable at 390px |
| 6 | Indigo gradient stop | `#4A2391` | GCALLS brand |
| 7 | "⭐ Phổ biến nhất" | "GỢI Ý CHO ĐỘI NGŨ ĐANG MỞ RỘNG" | Popularity is unverified; brief §7 |
| 8 | Monthly/annual toggle | Omitted | Nothing to toggle without prices; data model supports it |
