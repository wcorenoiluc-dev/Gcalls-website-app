# Gcalls CX UI V2 — Before / After

Scope of change: the four product visuals only. Content contract, copy, layout rhythm and section
order are unchanged.

## Product visuals

| Section | Before (base 9c562e7) | After (736ef8f) |
|---|---|---|
| 01 Hero | `OmnichannelInboxMockup` | `InboxDiagram` (neutral) |
| 04 Overview | `CustomerContextMockup` | `CustomerContextDiagram` (neutral) |
| 06 Omnichannel Inbox | `OmnichannelInboxMockup` w/ masked IDs "KH #4821", fake previews | `InboxDiagram` — skeleton rows, channel + state only |
| 07 Ticket & workflow | `TicketPanelMockup` — **Ticket #T-2043**, "Agent 02", timestamps | `TicketDiagram` — no ID, no times, workflow stages only |
| 08 Customer Context | `CustomerContextMockup` — "KH #4821", **#T-2043** | `CustomerContextDiagram` — skeleton profile, no IDs |
| 10 Reporting | `CxReportingMockup` — **"47" tickets, "312", 34/28/19/12/7%, status counts 12/21/14** | `ReportingDiagram` — category labels + skeleton bars, **no numbers** |

## Fabricated data removed (brief's named items)
- `#T-2043` — removed (was in Ticket + Customer visuals).
- `47` open tickets, `312` conversations — removed.
- channel split `34/28/19/12/7`, ticket-status counts `12/21/14` — removed.
- fake CSAT/FCR/SLA — none rendered (were only in the source ZIP, never published).
- fabricated names / conversation text / customer IDs — replaced by skeleton slots.

## Captions
Every visual now carries an explicit "Giao diện minh họa — sơ đồ bố cục…" note stating it is a layout
diagram, not a screenshot, with no real figures or customer data. The prior "…là dữ liệu mẫu"
(sample-data) captions are gone, per the brief's rule against sample-data-labelled dashboards.

## UI
- Hero copy/visual split changed 50/50 → **44/56** (brief UI spec).
- Container width (1180 via shared `Container`), 50px section seams and alternating layouts were
  already correct at base and were not modified (global primitives are out of scope).

## Measurements
Per-breakpoint geometry, H1 census, overflow and image census are in `screenshots/metrics.json`;
full-page shots `cx-{1440,1280,1024,768,390,320}-full.png`; hero crops `cx-hero-{1440,390}.png`;
section crops `cx-section-01..20.png`.
