# Form State Matrix — `/lien-he/`

The form is the shared `LeadForm` (unmodified). States 1–5 were exercised on the **production build
with NO backend** (the real route). States 4/6/7 (submitting/success/server/network) need a live
transport, so they were captured in a **test fixture**: a dev server started with
`VITE_LEAD_API_URL=/api/leads` (a public URL, not a secret) whose `/api/leads` calls are **intercepted
by Playwright** — no real API is hit, no lead is created, data is neutral.

| # | State | How reached | Verified | Screenshot |
|--:|---|---|---|---|
| 1 | Default | load route | renders form, no notice | `state-01-default.png` |
| 2 | Focus | focus name field | focus ring visible | `state-02-focus.png` |
| 3 | Validation error | submit empty | `[role=alert]` errors, tied via `aria-describedby` | `state-03-validation.png` |
| 4 | Submitting | fill + submit (mock delays 2.5s) | button `aria-busy`, "Đang gửi…", request intercepted | `state-04-submitting.png` |
| 5 | Backend not configured | fill + submit on real route (no backend) | "…chưa được kết nối…" honest error + email/phone fallback; **no success** | `state-05-not-configured.png` |
| 6 | Success — **TEST ONLY** | fill + submit (mock 200) | "Đã nhận yêu cầu" — only on real `ok:true`, never on the production route | `state-06-success-TEST.png` |
| 7 | Server error | fill + submit (mock 500) | "Không thể gửi yêu cầu lúc này…" + fallbacks | `state-07-server-error.png` |
| 8 | Network error | fill + submit (mock abort) | network error copy + fallbacks | `state-08-network-error.png` |

## Guarantees
- **No fake success on production**: metrics `noSuccessOnContact = true`; on the real route submit yields
  the NOT_CONFIGURED state, never success.
- **No data loss on error**: metrics `fieldsPreservedAfterError = true` (typed name survived the error).
- **Double-submit blocked**: submit is disabled while `submitting` and after success (LeadForm behaviour).
- **No production write**: success/submitting were driven by an intercepted mock endpoint; nothing left
  the browser, no lead created, no real API called → `CONTACT_PRODUCTION_WRITE_ZERO`.
- The success fixture is off the production route, absent from navigation, and uses neutral data.
