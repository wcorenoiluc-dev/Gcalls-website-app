# Changed Files — Contact UI V2 (vs base 9c562e7)

## Changed / new
```
 src/pages/ContactPage.tsx | 131 ++++++++++++++++++++++++++++------------------
 1 file changed, 81 insertions(+), 50 deletions(-)
(new) src/components/contact/ContactInfoPanel.tsx
(new) scripts/contact-preview.mjs, scripts/contact-states.mjs
```
## Shared at-risk files — UNCHANGED (SHA-256 pre == post)
```
683ac7f1570e0670f2a7e0037013221d565fe93da7488853252167972ea37a17  src/components/lead/LeadForm.tsx
0ac55436b42d0fbbc387e5dc6518c6a7a17479f4df2101e7d5e91f7403195f0e  src/lib/leads/submitLead.ts
6372eb2ed77626d9d70bc1d1675aec1b7a3db0fb65ee89d21b434dfa1335db2d  src/config/navigation.ts
2431a0b3d592d3650547a264955b3a231586150ad238099a195b8742d8e17e93  src/lib/leads/ctaLink.ts
```
Homepage worker owns LeadForm.tsx; it was not touched, so no shared-lead-form-change-proposal.md is needed.
