# Lead Capture Architecture

**Status:** frontend complete · **backend NOT connected** (see §Deployment requirement)

Every conversion surface on the GCALLS website uses one pipeline. Pages do not
implement their own submit logic, validation or lead shape.

---

## 1. Current delivery status — read this first

**No lead submitted through this website reaches Gcalls today.**

The frontend is finished: forms validate, normalize, carry campaign attribution
and estimator configuration, and call a single transport. That transport has
nowhere to send to, because the project builds to **static assets only** and a
lead destination requires a private credential that cannot live in the browser.

The site says so honestly. It never shows "Gửi thành công" — it shows:

> Biểu mẫu hiện chưa được kết nối hệ thống tiếp nhận. Vui lòng liên hệ Gcalls
> qua email hoặc hotline.

followed by `sales@gcalls.co` and `028 7302 5469`, so the visitor still has a
way through.

**Unblocking this is one deployment decision plus one adapter.** See §7.

---

## 2. Flow

```
Website CTA  (carries source / intent / product / solution)
     ↓
/lien-he/  or inline estimator form
     ↓
LeadForm            single component, four variants
     ↓
validateLead()      client-side UX validation
     ↓
normalizeLeadPayload()   trims, caps, lowercases email, attaches attribution
     ↓
submitLead()        the only transport
     ↓
POST {VITE_LEAD_API_URL}    ← server holds the secrets
     ↓
LeadDeliveryResult  discriminated union, never a thrown error
     ↓
Analytics event     categorical context only, never PII
```

### Files

| Path | Role |
|---|---|
| `src/lib/leads/types.ts` | `LeadPayload`, `LeadSource`, `LeadIntent`, `LeadDeliveryResult`, `LeadProvider` |
| `src/lib/leads/validation.ts` | `validateLead()` — required fields, email/phone format |
| `src/lib/leads/normalize.ts` | `normalizeLeadPayload()` — canonical shape |
| `src/lib/leads/attribution.ts` | UTM / referrer / landing-page capture |
| `src/lib/leads/submitLead.ts` | The single transport |
| `src/lib/leads/ctaLink.ts` | Builds and parses `/lien-he/?intent=…&source=…` |
| `src/components/lead/LeadForm.tsx` | The site's only lead form |
| `src/lib/analytics.ts` | Vendor-agnostic events, with a PII blocklist |
| `server/README.md` | Server contract + deployment options |

---

## 3. Payload

`LeadPayload` — see `src/lib/leads/types.ts` for the authoritative definition.

Contact fields: `name`, `company`, `email`, `phone`, `message`, `need`.
Context: `intent`, `source`, `sourcePath`, `product`, `solution`.
Attribution: `utmSource/Medium/Campaign/Content/Term`, `referrer`, `landingPage`.
Optional: `estimatorResult` (`EstimatorLeadContext`), `submittedAt` (ISO 8601).

Normalization collapses whitespace, caps field lengths, and lowercases email.

---

## 4. Validation

**Required:** name, company, and **at least one** of email / phone.

- Email: `local@domain.tld` shape.
- Phone: deliberately permissive — accepts international formats. Restricting to
  Vietnamese numbers would reject legitimate prospects, which costs more than a
  few malformed entries the sales team can sanity-check.

Errors are Vietnamese, inline, and tied to their input via `aria-describedby`
with `aria-invalid` set.

> The server **must** re-validate. Client validation is a convenience and
> protects nothing.

---

## 5. Spam protection

| Layer | Behaviour |
|---|---|
| Honeypot | Hidden `website` field. Non-empty → silently rejected. |
| Timing gate | Submission under 2.5s after mount → silently rejected. |
| Double-submit | Button disabled while in flight; blocked after success. |

Rejections are silent — telling a bot which check it failed helps it adapt.
No CAPTCHA: the friction is not justified at current volume.

**Server must add:** rate limiting per IP and per email, plus its own honeypot
check.

---

## 6. Backend endpoint contract

`POST /api/leads`, JSON body = `LeadPayload`.

| Status | Meaning | Client behaviour |
|---|---|---|
| `200`/`201` | Accepted (`{ leadId? }`) | **Only** path that shows success |
| `422` | Validation failed (`{ message, fieldErrors }`) | Field errors shown |
| `501` | No provider configured | Honest "not connected" state |
| other non-2xx | Server error | Retry message + email/phone |
| network/timeout (15s) | — | Retry message + email/phone |

---

## 7. Deployment requirement — the exact blocker

The project has **no serverless runtime, no Node server and no deployment
target committed**: no `vercel.json`, `netlify.toml`, `wrangler.toml`, `api/`
directory or server dependency. `npm run build` emits static files.

**To connect leads, one of these must be added:**

| Platform | Add |
|---|---|
| Vercel | `api/leads.ts` + `vercel.json`; env vars in dashboard |
| Netlify | `netlify/functions/leads.ts` + `netlify.toml` |
| Cloudflare Pages | `functions/api/leads.ts` + `wrangler.toml` |
| Node/Express | small server in front of `dist/` |
| n8n / Make | webhook — URL still stored **server-side**, not `VITE_*` |

Then set `VITE_LEAD_API_URL` (public — an address, not a credential) and the
provider secret **server-side**. No frontend file changes.

### Why not just POST to a webhook from the browser?

A webhook URL is a credential: anyone who views the bundle can read it and post
arbitrary leads, or flood the destination. Shipping one to make the demo look
functional would be a security problem disguised as progress.

---

## 8. Provider abstraction

```ts
interface LeadProvider {
  readonly name: string
  submit(lead: LeadPayload): Promise<LeadDeliveryResult>
}
```

Server-side only. Future adapters — `HubSpotLeadProvider`, `LarkLeadProvider`,
`N8nLeadProvider` — swap behind this without touching any form.

**No adapter is implemented.** A stub returning `ok: true` would make the site
appear to work while dropping every lead.

---

## 9. Analytics

Vendor-agnostic seam in `src/lib/analytics.ts`; nothing is wired yet.

`cta_clicked` · `lead_form_viewed` · `lead_form_started` ·
`lead_form_validation_error` · `lead_form_submitted` · `lead_form_success` ·
`lead_form_error` · `estimator_started` · `estimator_solution_selected` ·
`estimator_completed` · `quote_request_started` · `quote_request_success`

Properties: `source`, `sourcePath`, `intent`, `product`, `solution`.

**PII is blocked at the boundary.** `track()` strips `name`, `email`, `phone`,
`message`, `company` and similar keys, warning in development. A careless call
site cannot leak personal data.

---

## 10. UTM & attribution

Captured **once per browser session** into `sessionStorage`
(`gcalls:attribution`): the five UTM parameters, landing page and external
referrer.

- **sessionStorage, not cookies** — no cross-site transmission, no consent
  banner obligation, cleared when the tab closes.
- **Captured once** — a visitor arriving from an ad stays attributed to that ad
  rather than to the last internal page they viewed.
- **No personal data** — only campaign identifiers their own URL already carried.

Storage failures (private mode) are swallowed; attribution is best-effort and
never blocks a submission.

---

## 11. Privacy & security

- No lead payload is logged in production. The development diagnostic redacts
  name, email and phone.
- No PII in URLs. CTA context carries only categorical values, validated against
  allow-lists on read, so a crafted query string cannot inject content.
- No PII in analytics (enforced, §9).
- No PII in `localStorage`.
- Forms display: *Thông tin được sử dụng để Gcalls liên hệ và tư vấn theo yêu
  cầu của bạn.*
- No privacy-policy URL is linked, because none exists yet. Add one and link it
  here rather than inventing a path.

---

## 12. Conversion routing

`/lien-he/` is the canonical lead route. CTAs link to it with context:

```
/lien-he/?intent=quote&source=pricing&product=Gcalls%20Plus%20Webphone
```

| Surface | source | intent |
|---|---|---|
| Contact page (direct) | `contact` | `consultation` |
| Pricing CTAs | `pricing` | `quote` |
| Gcalls Plus final CTA | `gcalls_plus` | `consultation` |
| CRM final CTA | `crm_integration` | `integration` |
| Estimator quote form | `cost_estimator` | `quote` |
| Shell pages / header CTA | `consultation` | `consultation` |

The estimator keeps its **inline** form: the configuration is already on screen
and travels with the lead, so the visitor never retypes it.

---

## 13. Checklist to go live

- [ ] Choose a deployment platform with server execution (§7)
- [ ] Implement `POST /api/leads` against the contract (§6)
- [ ] Implement one `LeadProvider` (§8)
- [ ] Set `VITE_LEAD_API_URL` (public) and provider secrets (server-only)
- [ ] Add server-side validation, rate limiting, honeypot check
- [ ] Submit a real lead end to end and confirm it lands in the destination
- [ ] Wire an analytics vendor + consent (§9)
- [ ] Publish a privacy policy and link it from the forms (§11)
