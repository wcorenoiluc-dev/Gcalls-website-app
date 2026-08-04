# Server-side lead endpoint — contract

This directory is **not built or deployed** by the current project. `vite build`
produces static assets only; there is no serverless runtime configured.

It exists so the contract the frontend already speaks is written down and can be
dropped into whichever platform is chosen, without touching a single form.

See [`docs/LEAD_CAPTURE_ARCHITECTURE.md`](../docs/LEAD_CAPTURE_ARCHITECTURE.md)
for the full picture.

---

## What the frontend expects

**Endpoint:** whatever `VITE_LEAD_API_URL` points at (contract path: `POST /api/leads`)

**Request:** `Content-Type: application/json`, body = the normalized `LeadPayload`
from `src/lib/leads/types.ts`.

**Responses the client already handles:**

| Status | Meaning | Client behaviour |
|---|---|---|
| `200` / `201` | Accepted. Body may include `{ "leadId": "..." }` | Shows the success state — **the only path that does** |
| `422` | Validation failed. Body may include `{ message, fieldErrors }` | Shows field errors |
| `501` | No provider configured server-side | Shows the honest "not connected" state |
| any other non-2xx | Server error | Shows a retry message plus email/phone |
| network failure / timeout (15s) | — | Shows a retry message plus email/phone |

The client never treats a non-2xx as success, so a half-configured server cannot
produce a false "message sent".

---

## Provider interface

```ts
interface LeadProvider {
  readonly name: string
  submit(lead: LeadPayload): Promise<LeadDeliveryResult>
}
```

Adapters are written against this and selected by env var. Candidates:
`HubSpotLeadProvider`, `LarkLeadProvider`, `N8nLeadProvider`.

**No adapter is implemented here.** Writing one that returns `ok: true` without
a real destination would make the site look functional while silently dropping
every lead — worse than the current honest failure.

---

## Server responsibilities (do not skip)

1. **Re-validate.** Client validation is UX only; it protects nobody.
2. **Rate limit** per IP and per email.
3. **Check the honeypot** — reject if the `website` field is non-empty.
4. **Never echo secrets.** Credentials stay in server-only env vars.
5. **Log without PII**, or with explicit retention rules.
6. **CORS**: same-origin is simplest. If the endpoint lives elsewhere, allow
   only the production origin — never `*`.

---

## Deployment options

Any of these satisfies the requirement; pick one and add its config:

| Platform | What to add |
|---|---|
| Vercel | `api/leads.ts` + `vercel.json`; set env vars in the dashboard |
| Netlify | `netlify/functions/leads.ts` + `netlify.toml` |
| Cloudflare Pages | `functions/api/leads.ts` + `wrangler.toml` |
| Node/Express | a small server in front of `dist/` |
| No-code | n8n / Make webhook — still put the URL in a **server-side** env var, not `VITE_*` |
