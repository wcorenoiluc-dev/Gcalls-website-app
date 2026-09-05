# Resources Hub — six-route content audit

Worktree base `9c562e7`, dev server `http://127.0.0.1:5214`. Source of truth = `src/data/resources/*` (bundled + read live). Live checks via real Chrome.

| Route | HTTP | H1 | sections | items | real / placeholder | real download? | approved case study? | public / draft | source | source hash (sha256[:16]) |
|---|---|---|---|---|---|---|---|---|---|---|
| `/blog/` | 200 | 1 | 16 | 0 published articles · 6 editorial categories | REAL editorial foundation; **no articles** (by design) | no | n/a | no article published (163 exist only as WP drafts, not here) | blog.ts | d544172e160385dd |
| `/tai-nguyen/guides/` | 200 | 1 | 8 | 6 paths · 30 checkpoints | REAL | **no** — web-only, page states so | n/a | public | guides.ts | e3cbc6c4a8233382 |
| `/tai-nguyen/case-studies/` | 200 | 1 | 10 | 0 approved stories | REAL evidence-standard page; **no story** | no | **none approved** | public (standard only) | caseStudies.ts | cae97ae152572ce5 |
| `/tai-nguyen/ebook/` | 200 | 1 | 9 | 5 topic groups | REAL topic descriptions; **no file** | **no** — no button, no file | n/a | public (foundation) | ebook.ts | b87130570cd6bc3c |
| `/tai-nguyen/glossary/` | 200 | 1 | 13 | 24 terms · 6 groups | REAL | no | n/a | public | glossary.ts | 02badfb4e6d6ca62 |
| `/tai-nguyen/faq/` | 200 | 1 | 12 | 21 questions · 6 groups | REAL | no | n/a | public | faq.ts | b6b97022bebcab5f |

All six routes: HTTP 200, exactly one H1, 0 horizontal overflow, 0 broken images. The only console entry is a site-wide `/favicon.ico` 404 (backlog, unrelated). "Không dùng URL public để kết luận draft không tồn tại" respected — draft state was read from source (blog articles=0 published, drafts are a WordPress concern, not asserted here).

## Content rules — pass
- **Blog**: distinguishes published (0) from planned categories (6); does NOT claim the 163 WP drafts are published; no fixed article count shown as a result.
- **Guides**: 6 real paths / 30 checkpoints; explicitly NOT a downloadable file.
- **Case Studies**: no fabricated customer name or result; evidence standard only, 0 approved stories.
- **Ebook**: no download button, no file, no cover mockup; 5 topic groups described honestly.
- **Glossary**: 6 groups / 24 terms verified; count not forced into the hero H1.
- **FAQ**: 21 real questions across 6 groups; not a duplicate of product-page FAQs.
