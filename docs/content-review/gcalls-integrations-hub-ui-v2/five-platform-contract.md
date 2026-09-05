# Five-Platform Contract

Exactly five platforms, grouped by system type. No sixth platform. POS is a *system type* shown in the
hero diagram and the decision guide — it has no platform card because there is no POS platform page.

| # | Platform | Group | supportingLabel | Card route (verified) | CTA |
|--:|---|---|---|---|---|
| 1 | HubSpot | CRM | CRM | `/tich-hop/hubspot/` | Xem tích hợp HubSpot |
| 2 | Salesforce | CRM | CRM | `/tich-hop/salesforce/` | Xem tích hợp Salesforce |
| 3 | Zoho CRM | CRM | CRM | `/tich-hop/zoho-crm/` | Xem tích hợp Zoho CRM |
| 4 | Freshdesk | Helpdesk | Helpdesk | `/tich-hop/freshdesk/` | Xem tích hợp Freshdesk |
| 5 | Zendesk | Helpdesk | Helpdesk | `/tich-hop/zendesk/` | Xem tích hợp Zendesk |

- **CRM = 3** (rendered in a three-column grid at desktop).
- **Helpdesk = 2** (rendered in a balanced two-column grid — not stretched to fill a third).
- Each card carries: platform name, a neutral system-type icon indicator (Users for CRM, Headset for
  Helpdesk), the supporting label, the source description, a specific CTA, and an explicit
  `aria-label` accessible name equal to the CTA.
- Runtime check `platformLinks_5 = true`: exactly the five nested routes above are present as links.

Responsive card layout: desktop CRM 3-col / Helpdesk 2-col · tablet (sm) 2-col · mobile 1-col.
