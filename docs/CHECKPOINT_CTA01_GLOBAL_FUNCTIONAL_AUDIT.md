# Checkpoint CTA-01 — Global CTA Functional Audit + Repair

**Scope:** CTA wiring only. No page copy, layout or design was changed.
**Method:** real browser interaction — not href inspection.

---

## 0. Why previous "0 broken links" reports missed this

Earlier checkpoints validated that every CTA had a *valid href pointing at a
declared route*. That is a necessary but insufficient test: it cannot detect a
control that has no href at all because it is a `<button>` with no `onClick`.

Six Home CTAs were exactly that — visually identical to working buttons,
correctly styled, hover animation working, and completely inert. They never
appeared as "broken links" because they were never links.

This audit therefore used three independent techniques:

1. **Hit-testing** — `elementFromPoint` at each CTA's centre, to catch overlays
   and pointer interception that href inspection cannot see.
2. **Dispatched click** — a real `MouseEvent` on the visible element, exercising
   the actual React handler and router, then asserting the resulting SPA URL.
3. **Real mouse and keyboard input** — OS-level clicks at screen coordinates and
   real `Tab`/`Enter` keys, on key CTAs.

---

## 1. Root causes found

| # | Root cause | Impact | Where |
|---|---|---|---|
| 1 | `<button>` used for navigation with **only hover handlers and no `onClick`** | 6 CTAs completely dead — click did nothing | Home sections |
| 2 | Header/mobile CTA pointed at bare `/lien-he/` with **no conversion context** | Navigated fine, but lead arrived unattributed and the form did not pre-scope | Header, MobileMenu |
| 3 | Converted CTAs had **no visible keyboard focus ring** | Keyboard users could not see focus (§12) | Home sections |

No click-blocking CSS, no `pointer-events` bug, no z-index interception, no
nested `<a><button>`, no `href="#"`, no empty handler, and no disabled control
was found anywhere on the site.

---

## 2. CTA matrix

| Page | CTA | Expected | Actual before | Fix | Actual after |
|---|---|---|---|---|---|
| Home hero | Khám phá tính năng | → product page | **DEAD** (`<button>`, no onClick) | → `Link` to `/gcalls-plus-webphone/` | PASS |
| Home pain points | Khám phá Gcalls Webphone | → product page | **DEAD** | → `Link` | PASS |
| Home timeline | Xem tính năng Timeline | → product page | **DEAD** | → `Link` | PASS |
| Home analytics | Khám phá Analytics | → product page | **DEAD** | → `Link` | PASS |
| Home cloud | Xem Cloud PBX | → product page | **DEAD** | → `Link` | PASS |
| Home work-anywhere | Khám phá tính năng | → product page | **DEAD** | → `Link` | PASS |
| Header (desktop) | Đăng ký tư vấn | → lead form w/ context | Navigated, **no context** | `leadCtaHref(consultation)` | PASS, `intent=consultation` |
| Mobile menu | Đăng ký tư vấn | → lead form w/ context | Navigated, **no context** | `leadCtaHref(consultation)` | PASS, 52px tap target |
| Home hero | Đăng ký tư vấn | → lead form | PASS | — | PASS |
| Home CRM band | Tư vấn tích hợp | → lead form | PASS | — | PASS |
| Gcalls Plus | Đăng ký tư vấn | `intent=consultation`, `source=gcalls_plus` | PASS | — | PASS |
| QA QC Center | Yêu cầu demo | `intent=demo`, `source=qa_qc_center` | PASS | — | PASS |
| Gcalls CX | Yêu cầu demo Gcalls CX | `intent=demo`, `source=gcalls_cx` | PASS | — | PASS |
| CRM Integration | Tư vấn tích hợp CRM | `intent=consultation`, `source=crm_integration` | PASS | — | PASS |
| Helpdesk Integration | Tư vấn tích hợp Helpdesk | `intent=consultation`, `source=helpdesk_integration` | PASS | — | PASS |
| POS Integration | Tư vấn tích hợp POS | `intent=consultation`, `source=pos_integration` | PASS | — | PASS |
| All solution pages | Ước tính cấu hình & chi phí | estimator + correct preselect | PASS | — | PASS |
| All product pages | Xem bảng giá | `/bang-gia/` | PASS | — | PASS |
| CX / CRM / HD / POS | Khám phá cách … hoạt động | scroll to `#cach-hoat-dong` | PASS | — | PASS |
| Footer | product / solution / resource links | navigate | PASS | — | PASS |
| Footer | sales@gcalls.co, 028 7302 5469 | mailto:/tel: | PASS | — | PASS |

---

## 3. Estimator alias verification (§10)

Each alias was opened and the **rendered selected state** was asserted — a query
string alone was not accepted as success.

| Alias | Selected in UI | Result |
|---|---|---|
| `gcalls-plus` | Gcalls Plus Webphone | PASS |
| `qa-qc` | QA QC Center | PASS |
| `gcalls-cx` | Gcalls CX | PASS |
| `crm-integration` | Tích hợp CRM | PASS |
| `helpdesk-integration` | Tích hợp Helpdesk | PASS |
| `pos-integration` | Tích hợp POS | PASS |

End-to-end: clicking the POS page's estimator CTA landed on the estimator with
"Tích hợp POS" already selected.

---

## 4. Lead context round-trip (§7)

The specific failure §7 warns about — CTA emits a value the Contact allow-list
rejects, silently dropping context — **does not occur**. `leadCtaHref` emits
`product`/`solution` as approved `LEAD_NEEDS` **labels**, and `LeadForm` matches
against that same list.

Verified by loading `/lien-he/` with each context and reading the rendered
`need` dropdown value:

| Incoming context | Form preselected |
|---|---|
| `source=gcalls_plus`, product Gcalls Plus Webphone | Gcalls Plus Webphone |
| `intent=demo`, `source=gcalls_cx` | Gcalls CX |
| `intent=demo`, `source=qa_qc_center` | QA QC Center |
| `source=crm_integration` | Tích hợp CRM |
| `source=helpdesk_integration` | Tích hợp Helpdesk |
| `source=pos_integration` | Tích hợp POS |

**Demo intent (§8):** `intent=demo` survives the round-trip for both QA QC
Center and Gcalls CX — it is *not* converted back to `product_information`.

---

## 5. Form behaviour vs lead delivery (§11)

These are two different things and must not be conflated:

| Aspect | State |
|---|---|
| CTA navigation | **WORKING** |
| Form fields editable | PASS |
| Validation | PASS — empty submit produced 5 field errors, stayed on form |
| Submit button | PASS — enabled, `type="submit"`, clickable |
| Valid submission | PASS — invokes `submitLead()` |
| **Lead delivery** | **NOT_CONFIGURED** (expected) |
| Honest fallback | PASS — "Biểu mẫu hiện chưa được kết nối hệ thống tiếp nhận…" with sales@gcalls.co and 028 7302 5469 |
| Values preserved after failure | PASS — name, email, message all retained |
| Fake success shown | **No** |

---

## 6. Responsive CTA QA

| Width | Blocked CTAs | Conversion links < 44px | Result |
|---|---|---|---|
| 390 | 0 | 0 (min 44px) | PASS |
| 1440 | 0 | 0 (min 44px) | PASS |

Checked across Home, all six locked pages, Pricing, Estimator and Contact. The
mobile menu opens and its CTA is 52px, unblocked, and carries context.

---

## 7. Visual states (§12)

Default, hover, active and cursor states were already correct. The six converted
CTAs initially had **no visible focus ring**; `focus-visible` outlines were added
— brand purple on light sections, white on dark sections. Verified with a real
keyboard `Tab`: 3px solid visible outline, and `:focus-visible` matching.

---

## 8. Console (§15)

0 CTA-caused console errors. The only console output during click testing was
expected analytics INFO (`lead_form_validation_error`, `lead_form_error` — the
NOT_CONFIGURED path). No React, router, DOM-nesting or undefined-property errors,
including after the `button` → `Link` conversions.

---

## 9. Known non-CTA controls (intentional, not defects)

The Home and product pages render demo product-UI mockups containing ~75
`<button>` elements — dialpad keys, call filters, "Ghi chú", "Bắt máy",
"Xem đầy đủ", pagination. These are **illustrations, not CTAs**: they carry no
handler by design and are part of the approved `DEMO_VISUAL_REPLACE_LATER`
visual layer.

They are not conversion controls, so they are out of scope for this checkpoint
and were not modified. **Recommendation for a future accessibility pass** (not
done here, to avoid an unrelated refactor): mark them `tabIndex={-1}` /
`aria-hidden` so they are not keyboard-focusable or announced as buttons.

Three of them hit-tested as "blocked" (overlapped by sibling mockup layers) —
again cosmetic, inside decorative UI, not conversion paths.

---

## 10. A note on test-method artifacts

Two intermediate readings during this audit looked like failures and were not:

- A real click at CSS-pixel coordinates appeared to do nothing — the click tool
  addresses **screenshot** coordinates, which differ from CSS pixels. Clicking
  the correct screen position navigated correctly.
- A synthetic `Enter` keypress appeared not to activate a focused link — a
  capture-phase `document` keydown listener recorded **no event at all**,
  proving the key never reached the page rather than the link being broken. A
  control link behaved identically, and real keyboard input worked.

Both were confirmed working with genuine OS-level input before being reported as
PASS.

---

## 11. Regression

No locked page file was modified. Changes are confined to six Home section
components plus `Header.tsx` and `MobileMenu.tsx`, and contain **no copy edits**
(verified by filtering the diff for non-attribute text: empty).

| Page | H1 | H2 | Title | Overflow |
|---|---|---|---|---|
| Home | 1 | 13 | unchanged | 0 |
| Gcalls Plus | 1 | 21 | unchanged | 0 |
| QA QC Center | 1 | 22 | unchanged | 0 |
| Gcalls CX | 1 | 23 | unchanged | 0 |
| CRM Integration | 1 | 23 | unchanged | 0 |
| Helpdesk Integration | 1 | 20 | unchanged | 0 |
| POS Integration | 1 | 21 | unchanged | 0 |

All match their locked baselines.

---

## 12. Technical QA

| Check | Result |
|---|---|
| `npm run typecheck` | PASS (0 errors) |
| `npm run lint` | PASS (0 errors; 6 pre-existing shadcn vendor warnings) |
| `npm run build` | PASS |
| `href="#"` | 0 |
| Empty-action buttons among CTA controls | 0 |
| CTA-caused console errors | 0 |
| Broken conversion CTAs | 0 |
| Page-level overflow | 0 |

**Remaining intentional limitation: lead backend NOT_CONFIGURED.** Nothing else
is dead.
