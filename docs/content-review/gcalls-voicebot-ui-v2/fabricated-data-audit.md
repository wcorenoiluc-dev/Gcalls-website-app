# Voicebot AI — fabricated-data before/after

Every banned value lived inside two mockups in `src/components/voicebot/visuals.tsx`.
Both were replaced with neutral labeled diagrams. A standing guard
(`scripts/voicebot-fabricated-scan.mjs`) now fails the build if any retired value returns.

| Banned value | Where it was (before) | After |
| --- | --- | --- |
| `480`, `312`, `198`, `24` (campaign count tiles) | `VoicebotCampaignMockup` tiles | removed — hero is a process-flow diagram with no counts |
| `46%`, `27%`, `15%`, `12%` (response bars) | `VoicebotCampaignMockup` outcomes | removed — no percentages anywhere |
| `LH-2481`, `LH-2479`, `LH-2476` + times `09:12/09:08/09:03` + statuses | `VoicebotCampaignMockup` history | removed — no IDs, times or statuses |
| `LH-2479`, `LH-2465`, `LH-2452`, `LH-2440` + reasons + routes | `VoicebotHandoffMockup` queue | removed — replaced by two-lane responsibility diagram |

**Before → after visuals**

- Hero (§1): fake campaign console → `VoicebotProcessDiagram` — `Danh sách đầu vào → Voicebot (gọi theo kịch bản) → Xác nhận / Gọi lại / Chuyển nhân viên`. Label: "Sơ đồ quy trình minh họa".
- Capabilities (§5): fake handoff queue → `VoicebotHandoffDiagram` — two lanes `Voicebot xử lý` / `Đội ngũ tiếp nhận`, populated only from approved `VB_HUMAN_AI` copy.

**Verification**
- `node scripts/voicebot-fabricated-scan.mjs` → PASS (source).
- Rendered-DOM scan across 1440/1280/1024/768/390/320 → `bannedHits: []` at every breakpoint (`qa-report.json`).
- No copy in `src/data/voicebotAi.ts` was changed; the claim guard there is intact.

`VOICEBOT_FABRICATED_DATA_ZERO` — PASS (source + rendered DOM).
