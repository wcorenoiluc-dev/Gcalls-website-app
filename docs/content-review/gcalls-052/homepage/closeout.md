# GCALLS-052 · Homepage `/` — closeout

Branch `feature/gcalls-homepage-052-closeout`, cut from `feature/gcalls-react-ui-v2-integration @ 351f7cf`.

Everything below was measured against the **real rendered React app** — a Vite server on
`127.0.0.1`, driven by system Chrome through `playwright-core`. Nothing here comes from a Node
preview harness. Each gate was run twice: once against the dev server (`vite`, port 5180/5181) and
once against the **production build** served by `vite preview` (port 5182), because the dev server
and the shipped bundle are not the same program and only the second one is what a visitor gets.
The numbers reported are the production-build numbers; the dev-server run agreed with them.

---

## The thirteen sections, in the approved order

Read off the live DOM as the `<section>` children of `.home-page`, with the heading each one
actually renders.

| # | Section | Component | Rendered heading |
|---|---|---|---|
| 1 | Hero | `HeroSection` | Tổng Đài Ảo Tích Hợp CRM - Bứt Phá Doanh Số Cho Đội Sales & CSKH **(the H1)** |
| 2 | Pain points + loss estimator | `PainPointsSection` | "Khoảng Trống" Vận Hành Khiến Doanh Nghiệp Rò Rỉ Khách Hàng… |
| 3 | Solution bridge | `SolutionBridgeSection` | Tổng Đài Thông Minh Gcalls: Bứt Phá Doanh Số Đội Ngũ… |
| 4 | Product & solution ecosystem | `EcosystemSection` | Hệ sinh thái sản phẩm và giải pháp Gcalls |
| 5 | Realtime call activity | `CallTimelineSection` | Theo dõi toàn bộ hoạt động cuộc gọi theo thời gian thực |
| 6 | Built-in mini CRM | `CRMSection` | Quản lý khách hàng tập trung ngay trên Gcalls |
| 7 | Analytics & KPI dashboard | `AnalyticsSection` | Theo dõi hiệu suất đội ngũ theo thời gian thực |
| 8 | Cloud call center | `CloudSection` | Xây dựng hệ thống tổng đài doanh nghiệp trên nền tảng Cloud |
| 9 | Customer popup | `CustomerPopupSection` | Nhận diện khách hàng ngay khi cuộc gọi đến |
| 10 | Call button widget | `CallWidgetSection` | Biến khách truy cập website thành cuộc gọi |
| 11 | Integration CTA | `IntegrationCtaSection` | Kết nối Gcalls với hệ thống CRM của doanh nghiệp bạn |
| 12 | Work from anywhere | `WorkFromAnywhereSection` + `TeamPermissionsBlock` | Mang tổng đài doanh nghiệp theo bạn đến bất kỳ đâu |
| 13 | Use cases & final CTA | `UseCasesFinalCtaSection` (+ the fail-closed lead form) | Tổng đài doanh nghiệp luôn đồng hành cùng đội ngũ của bạn |

**Measured: 13 sections.** Unchanged by this work — the order was already correct and was verified,
not restructured.

`src/components/home/` holds seventeen component files; thirteen of them are the sections above.
The other four are not sections and were never meant to be counted as such:

- `TeamPermissionsBlock.tsx` — a block **inside** §12, not a section of its own.
- `MockupCaption.tsx` — the "minh họa" label stamped on each drawn mockup.
- `LossEstimator.tsx` — the calculator embedded in §2.
- `TeamSection.tsx` — deliberately unrendered. Its argument moved into §12 as
  `TeamPermissionsBlock`; the file is kept intact rather than deleted (it has no route, so nothing
  breaks either way). It is still scanned for fabricated data, and one invented headcount was found
  and removed there — see below.

**`TeamPermissionsBlock` is present and rendered inside §12**, at
`src/components/home/WorkFromAnywhereSection.tsx:517`, and its content was confirmed in the live DOM
of section 12.

---

## H1 count

**1.** `document.querySelectorAll('h1').length === 1` at all six breakpoints. The single H1 is §1's
"Tổng Đài Ảo Tích Hợp CRM - Bứt Phá Doanh Số Cho Đội Sales & CSKH". Every other section opens on an
`h2`.

---

## Seams and container

Each seam is `padding-bottom` of section *n* plus `padding-top` of section *n+1*, read from
`getComputedStyle` on the live elements — not from the stylesheet source.

| Breakpoint | Seams measured | Distinct values | Result |
|---|---|---|---|
| 1440 | 12 | 50 | 50 50 50 50 50 50 50 50 50 50 50 50 |
| 1280 | 12 | 50 | 50 50 50 50 50 50 50 50 50 50 50 50 |
| 1024 | 12 | 50 | 50 50 50 50 50 50 50 50 50 50 50 50 |
| 768 | 12 | 50 | 50 50 50 50 50 50 50 50 50 50 50 50 |
| 390 | 12 | 50 | 50 50 50 50 50 50 50 50 50 50 50 50 |
| 320 | 12 | 50 | 50 50 50 50 50 50 50 50 50 50 50 50 |

**All 12 seams are exactly 50px at all six breakpoints.** Container width at 1440: **1180px**.

No horizontal overflow (`documentElement.scrollWidth <= clientWidth`) and no clipped text (no leaf
text node whose box escapes the viewport) at any of the six. The off-screen honeypot input is
excluded from the clipping walk by position, not by name.

`verify-home-ui.mjs` now prints this table on every run. It previously printed only `ok`/`FAIL`,
which meant the seam numbers — the thing the gate exists to establish — had to be recovered by
re-running it.

---

## Fabricated data

**Result: `HOMEPAGE_FABRICATED_DATA_ZERO`.** 0 source findings, 0 DOM findings across all six
breakpoints, on both the dev server and the production build.

### The scanner was not trustworthy, and that is why more was found

`scan-home-fabricated.mjs` passed clean on the merged tree while real invented figures were on
screen. It matched `0900` and `1900` only, so two `0901` numbers survived it (caught by hand in
`385afbe`); it had no concept of a bare integer presented as a result; and it never looked at clock
times, durations, latencies, record ids or freshness stamps. It has been rewritten:

- **Two passes.** The DOM pass is what a visitor sees. A source pass runs beside it because a value
  parked on an inactive mockup tab renders nothing and is therefore invisible to the DOM — a
  fabricated hotline one click away is still fabricated. The DOM pass now also clicks through every
  mockup tab before reading.
- **Sixteen pattern classes**, each a *class* of invented fact rather than a specific value: VN
  mobile / hotline / landline / partially-masked numbers, non-`example.com` emails, percentages,
  deltas, clock times, `ms` latencies, `m s` durations, throughput, "updated N ago" stamps, money,
  bare integers next to a work noun, pagination fractions, quality scores, record ids, masked keys
  with an invented tail, and the render residue `NaN` / `undefined`.
- **Exemptions are named, not implied.** Four of them: the loss estimator's region (marked with a
  `data-loss-estimator` attribute on the component root, so the exemption cannot quietly widen),
  inline CSS values in the source pass, business-hours windows, and weekday/step/dialpad/API-version
  labels.
- **It was proved to fail.** Eleven probe values were injected into a rendered section and every one
  was caught — seven in the source pass and, on a separate compiling probe, six in the DOM pass via
  an `aria`/`title` attribute. The probes were then removed and the scan re-run clean. A gate that
  has never been seen to fail is not evidence.

### What was still fabricated, and what replaced it

All of this was live on the page at `351f7cf`, after two prior neutralization passes.

| Component | § | Was | Now |
|---|---|---|---|
| `HeroSection` | 1 | call-log timestamps `09:14 … 10:45` | `—` |
| `HeroSection` | 1 | `Gọi đi 09:14 · "KH quan tâm gói Business, hẹn demo thứ 5"` | `Gọi đi — · Ghi chú sau cuộc gọi` |
| `HeroSection` | 1 | `Cuộc gọi đến · 7:18 phút` | `Cuộc gọi đến · —` |
| `HeroSection` | 1 | `543` calls/week and a `+18%` delta | `—`, `—` |
| `CallTimelineSection` | 5 | timestamps `09:14 … 10:45` | `—` |
| `CallTimelineSection` | 5 | call notes carrying invented dates and commitments | generic `Ghi chú: …` labels |
| `CallTimelineSection` | 5 | per-call star scores `4` / `5` | `null` (no rating drawn) |
| `CallTimelineSection` | 5 | **`NaN:NaN`** in the playback clock | `—:—`, via a parser that only shows a clock for a real `m:ss` |
| `CallTimelineSection` | 5 | hardcoded `1` on the "Nhỡ" tab | derived from the rows drawn |
| `CRMSection` | 6 | four notes with invented deadlines (`trước ngày 25`, `15h hôm nay`, `sau 3 ngày`) | generic `Ghi chú: …` labels |
| `CRMSection` | 6 | `Hôm qua`, `2 ngày trước` on the activity feed | `—` |
| `CRMSection` | 6 | `4 liên hệ · trang 1/12` | `Danh sách liên hệ` |
| `CloudSection` | 8 | `note: "— · 028 xxxx"` (a partial HCMC DID) | `Đầu số hotline` |
| `CloudSection` | 8 | `5 extensions`, `3 cấp` | `Extensions`, `Nhiều cấp` |
| `CloudSection` | 8 | `Cây IVR — —` (residue of an emptied field) | `Cây IVR` |
| `CloudSection` | 8 | `Cập nhật 5s trước`, `Cập nhật lần cuối: hôm nay 08:30` | `Cập nhật realtime`, `Cập nhật lần cuối: —` |
| `IntegrationsSection` | 11 | `2.4k req/h`, `48ms`, `"duration": 222` | `— req/h`, `—`, `null` |
| `IntegrationsSection` | 11 | `"id": "call_8f3kd9"` (a record id) | `"call_…"` |
| `IntegrationsSection` | 11 | `sk-gc-••••••••••••••••4f2a` (masked key, invented tail) | fully masked |
| `IntegrationsSection` | 11 | `Gọi đi · 3:42`, `Hôm nay 09:14`, `Hôm nay 09:35` | `—` |
| `WorkFromAnywhereSection` | 12 | `Ext: 101` on the dialpad | `Ext: —` |
| `WorkFromAnywhereSection` | 12 | activity-log timestamps, `7m 12s` | `—` |
| `TeamSection` | (unrendered) | `Hiển thị 6 / 44 nhân viên` | derived from the roster length |

`NaN:NaN` deserves a note: it was rendering on the page. `parseInt("—")` in the audio scrubber
returned `NaN` once the duration was neutralized, and no gate looked for it — not the fabricated
scan, not the UI gate, not the console-error check, because it is not an error. It is the clearest
evidence that the previous scan's silence was not the same as a clean page.

### What deliberately still contains digits

Stated so the next reader does not have to re-derive it:

- **The loss estimator (§2)** — `10 người`, `12.000.000 ₫`, `60 phút/ngày`, `5%`, `22 ngày`,
  `8 giờ`, and the `231 giờ` / `15.800.000 ₫` outputs. These are the visitor's own inputs and the
  arithmetic on them. They assert nothing about Gcalls and change the moment a slider moves. Guarded
  separately by `scripts/verify-loss-estimator.mjs` (passing). Exempted **by region**, via
  `data-loss-estimator` on the component root, not by value.
- **Chart geometry** — the bar heights in the hero and analytics mockups. They carry no readable
  number and no axis; they are the shape of a chart, not a claim. Removing them would remove the
  illustration rather than a figure.
- **Structural UI chrome** — dialpad keys `0–9 * #`, weekday labels `T2–T7`, `24/7`, step numbers,
  `/v1/…` API paths, the `v1.4.2` version badge, `200 OK`, the `08:00–18:00` routing window (a
  configured schedule, not a measurement), and the `/ 5` unit on a KPI tile whose value is `—`.
- **Placeholder identities** — `Khách hàng 01–05`, `Nhân viên 01–06`, `Công ty A–D`. Generic by
  construction, no real person, no real company, no live domain.

---

## Media provenance

**The homepage references no raster media at all.** Measured on the live page: `0` `<img>` elements
inside `.home-page`, `0` CSS `background-image: url(…)` declarations, and no `<video>`/`<picture>`.
Every product visual is **337 inline `<svg>` elements plus CSS-drawn markup**, authored in the
component files themselves.

This settles the "approved, PII-clean media only" criterion by construction rather than by audit:
there is no screenshot to have been captured from a real tenant, no photograph of a real person, and
nothing copied in from outside the repo. Nothing was added by this work.

Seven drawn mockups carry a `MockupCaption`, each reading *"Giao diện và số liệu minh họa — không
phải dữ liệu vận hành của một doanh nghiệp cụ thể."* The UI gate asserts the caption count so a new
mockup cannot ship without one.

---

## Lead form — fail-closed

The form is present (`1` `<form>` in `.home-page`, at the end of §13) and **cannot be submitted**.

Before this change it was *undeliverable* but not *unsubmittable*: `LEAD_BACKEND_CONFIGURED` is
false, so `submitLead` returns `NOT_CONFIGURED` and no success is ever faked — but the controls were
live, the submit button was enabled, and the page still ran validation and fired analytics on a
click. The acceptance asks for disabled, not merely undelivered.

`LeadForm.tsx` is owned by another agent and has no `disabled` prop, so §13 makes the guarantee in
its own markup, twice over:

1. **`<fieldset disabled>`** wrapping the form. A nested `<form>` is a descendant, so every control
   inside it is *actually disabled* and the submit button cannot be activated. Implicit submission
   (Enter in a field) has no enabled default button to click, so it does nothing either. `inert` is
   set alongside it for pointer and tab-order isolation. The fieldset's default border, padding and
   `min-inline-size` are reset — any of the three would have moved the 1180/50px measurements.
2. **`onSubmitCapture`** on the same fieldset, cancelling and stopping the event. React dispatches
   capture listeners from the root down before the target's own handler, so `LeadForm`'s `onSubmit`
   never runs. This exists because `form.requestSubmit()` ignores a disabled submitter and this form
   sets `noValidate` — the scripted path is not the user's path, but it was open.

A visible dashed notice above the form says the form is in preview and points at the email and phone
fallbacks, so the disabled state reads as deliberate rather than broken.

Measured in the live DOM at 1440 on both dev and production builds:

| Check | Result |
|---|---|
| form present | 1 |
| controls rendered | 8 (honeypot, name, company, email, phone, need, message, submit) |
| controls **actually** disabled (`:disabled`) | 8 of 8 — `0` enabled |
| clicking submit fires a submit event | **no** |
| a scripted `requestSubmit()` reaches the form's handler | **no** — cancelled in capture |

The gate's first draft of this check tested `element.disabled` and reported a false failure: that
IDL property reflects the element's *own* attribute and stays `false` for a control disabled by an
ancestor fieldset. It now tests `:disabled`, which is the state the browser actually acts on. Worth
recording — the same mistake read the other way round would have been a false pass.

---

## Gate results

Run against the production build (`vite preview`, 127.0.0.1:5182) and, identically, against the dev
server.

| Gate | Result |
|---|---|
| `scripts/verify-home-ui.mjs` | **45 passed, 0 failed** — `HOMEPAGE_UI_V2_LOCAL_PASS` |
| `scripts/scan-home-fabricated.mjs` | 0 source, 0 DOM — `HOMEPAGE_FABRICATED_DATA_ZERO` |
| `scripts/verify-loss-estimator.mjs` | all checks pass |
| `tsc --build --force` | clean |
| `eslint` (owned paths) | 0 errors, 1 pre-existing warning (`maxBar` unused, `AnalyticsSection.tsx:36`, untouched here) |
| `vite build` | clean |
| console errors / failed requests | none at any of the six breakpoints |

The UI gate grew from 41 checks to 45: three lead-form checks and one asserting the form renders
controls at all, so "every control is disabled" cannot pass by there being no controls.

---

## Contract reconciliation

`wordpress/.release-053/release-manifest.json` locks `homepageTopLevelSections: 13` and
`homepageWidgets: 77`.

- **Sections: still 13.** Unchanged.
- **Widgets: still 77, and this work cannot have moved it.** The WordPress generators read exactly
  one file from `src/components/home/` — `lossEstimate.ts`, consumed by
  `build-loss-estimator-config.mjs` and `test-loss-estimator.mjs` — and that file was **not**
  modified. Every other reference to `src/components/home/` in `wordpress/scripts/` is a prose
  comment naming a parity target, not a read.
- **No copy divergence.** Every string changed here was grepped against `wordpress/`. The only
  match was the substring `543` inside an Elementor element id (`19c5434`) — a coincidence, not the
  retired KPI. None of the neutralized values exist in the WordPress artifacts, so the Elementor
  rendering and the React rendering do not now disagree about anything.

Nothing under `wordpress/**` was read for modification or staged.

---

## Not claimed

- **This is a React verification only.** The page has not been rendered through PHP/Elementor in
  this pass, and no WordPress gate was run — `wordpress/**` is owned by another agent and was being
  edited concurrently in the same working tree. The 052 rule that the homepage is not PASS until it
  has been through the real WordPress render still stands.
- **Nothing was deployed or pushed.** All servers were bound to `127.0.0.1`.
