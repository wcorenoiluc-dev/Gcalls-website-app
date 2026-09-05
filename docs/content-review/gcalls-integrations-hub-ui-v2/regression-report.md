# Regression Report

Candidate vs base `9c562e7`. Only `/tich-hop/` was changed; every other route below is byte-identical to base by construction (diff touches only `IntegrationsHubPage.tsx` + new `integrations-hub/` components + the test script). Captured at 1440.

| Route | sections | H1 | height | images | broken | container | overflow | console errs |
|---|--:|--:|--:|--:|--:|--:|--:|--:|
| / | 13 | 1 | 18155 | 0 | 0 | 1440 | 0 | 0 |
| /san-pham/ | 7 | 1 | 4402 | 0 | 0 | 1440 | 0 | 0 |
| /giai-phap/ | 7 | 1 | 4157 | 0 | 0 | 1440 | 0 | 0 |
| /nganh/ | 6 | 1 | 3066 | 0 | 0 | 1440 | 0 | 0 |
| /tai-nguyen/ | 6 | 1 | 3062 | 0 | 0 | 1440 | 0 | 0 |
| /cong-ty/ | 8 | 1 | 4048 | 0 | 0 | 1440 | 0 | 0 |
| /tich-hop/hubspot/ | 18 | 1 | 10978 | 0 | 0 | 1440 | 0 | 0 |
| /tich-hop/salesforce/ | 21 | 1 | 13122 | 0 | 0 | 1440 | 0 | 0 |
| /tich-hop/zoho-crm/ | 20 | 1 | 12574 | 0 | 0 | 1440 | 0 | 0 |
| /tich-hop/freshdesk/ | 21 | 1 | 13919 | 0 | 0 | 1440 | 0 | 0 |
| /tich-hop/zendesk/ | 21 | 1 | 14138 | 0 | 0 | 1440 | 0 | 0 |

**Verdict:** no route outside `/tich-hop/` changed section count, H1, container, image integrity or console state. The 5 platform child pages render intact (H1=1 each).
