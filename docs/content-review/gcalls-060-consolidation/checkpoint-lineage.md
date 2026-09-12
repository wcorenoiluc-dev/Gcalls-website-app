# Checkpoint Lineage — Authoritative Git Reconciliation

**Date:** 2026-09-08 · **Coordinator, read-only.** No source modified.

## Authoritative integration tip
**`466fcda`** — `feature/gcalls-react-ui-v2-integration` (branch tip; 2026-09-08 22:24:56,
"docs: record the two owner decisions and the final Phase G result"). Its worktree
(`/Users/macos/Desktop/Gcalls/App/Gcalls-react-ui-v2-integration`) is clean.
The branch advanced twice during this coordination (1053d44 → … → 466fcda); it is live.

## Ancestry matrix (`git merge-base --is-ancestor`, not inferred from dates)
| commit | subject | ancestor of 466fcda | ancestor of 3154182 | ancestor of 1053d44 |
|---|---|:--:|:--:|:--:|
| f0b5489 | home: neutralize fabricated demo data | ✓ | ✓ | ✓ |
| 1053d44 | merge: Homepage 052 into integration lineage | ✓ | ✓ | ✓ (self) |
| b350256 | fix(home): retire leftover figures | ✓ | ✓ | ✗ |
| 57e8cb0 | fix(content): blog index falsely "empty" while 18 published | ✓ | ✓ | ✗ |
| 5b8b8ba | docs: 38-route scope audit, "two different thirty-sevens" | ✓ | ✓ | ✗ |
| 7f4f892 | merge: Homepage 052 closeout + WordPress content closeout | ✓ | ✓ | ✗ |
| 3154182 | fix(content): two voicebot sections mapped to non-rendering components | ✓ | ✓ (self) | ✗ |
| 1fb03f7 | docs(gcalls-059): IA/SEO audit (docs only) | ✗ | ✗ | ✗ |

**Reading:** the integration lineage is `f0b5489 → 1053d44 → b350256 → 57e8cb0 → (5b8b8ba, 7f4f892) →
3154182 → … → 466fcda`. `466fcda` contains every listed integration commit including `3154182`.
`1fb03f7` (Task 059) is a docs-only branch, NOT merged into the integration lineage (nothing to merge — it changed no source).

## Task 056/057/058 status — SUPERSEDED, not merged
- `feature/gcalls-056/057/058-*` each sit at base `1053d44` with **0 commits ahead** — they died mid-flight
  when the prior process exited, leaving only *uncommitted partial* working-tree files. Nothing landed.
- `466fcda` **already implements every route those tasks targeted**, wired to dedicated components in
  `router.tsx` (`SHELL_ROUTES = []`, no ShellPage fallback):
  - `/nganh/{giao-duc,tai-chinh,bao-hiem,bat-dong-san,thuong-mai-dien-tu,bpo}/` → `IndustryPage industry="…"`
  - `/blog/`,`/tai-nguyen/{guides,case-studies,ebook,glossary,faq}/` → `BlogPage/GuidesPage/CaseStudiesPage/EbookPage/GlossaryPage/FaqPage`
  - `/cong-ty/{khach-hang,doi-tac}/`,`/referral/` → `CustomersPage/PartnersPage/ReferralPage`
- **Conclusion:** do NOT merge the dead worker branches (nothing to merge; would duplicate/conflict) and
  do NOT re-spawn duplicates. Recommend removing the three dead worktrees + branches after this report.

## Was 3154182 the tasks? No.
`3154182` is an integration-lineage content fix ("two voicebot sections mapped to components that cannot
render them"), NOT any of Task 056/057/058 (those have no commits). `3154182` IS contained in `466fcda`.

## Core 0.10.11 / Theme 0.8.7 artifact scope
- Present in the integration worktree: `wordpress/.release-053/gcalls-core-0.10.11.zip`
  (sha256 `953a9970ead94deb…`) and `gcalls-theme-0.8.7.zip` (sha256 `b08fb85242f3fa8c…`).
- `git log <0.10.11-artifact-commit>..466fcda -- src/` is **empty** → no React source change landed after the
  0.10.11 artifact commit. So 0.10.11 currently reflects `466fcda` source (one-version = one-hash holds AS-IS).
- **Caveat:** the moment the outstanding Voicebot taxonomy fix (below) is applied to source, 0.10.11 is
  superseded and Core must be rebuilt as **0.10.12** (Theme unchanged → keep 0.8.7) per the one-version-one-hash rule.

## Outstanding source item (the only real remaining change)
The Voicebot solution-only reclassification is **NOT applied in `466fcda`** despite the "record the two owner
decisions" commit. See `voicebot-ia-patch.md`. This is the single consolidation action still pending.
