# Stale-copy report — Resources Hub

Rule: a status string is `STALE` only if its route already has real content. Checked across all of `src/`.

## Exact gate strings — 0 occurrences
| String | Found | Verdict |
|---|---|---|
| `Đang biên tập` | 0 | — |
| `Chờ duyệt công bố` | 0 | — |
| `Trong lúc chờ nội dung` | 0 | — |
| `sẽ được đăng tải` | 0 | — |

## Broader "awaiting" phrases — checked against route content, none STALE
| Phrase / location | Route | Route has real content? | Verdict |
|---|---|---|---|
| `Trong lúc chờ bài viết, có thể đọc gì?` (blog.ts:252) | /blog/ | No published articles (0) | NOT stale — accurately describes an empty blog |
| `Trong lúc chờ, có thể xem…` (caseStudies.ts:255) | /tai-nguyen/case-studies/ | No approved story (0) | NOT stale — genuinely awaiting evidence |
| `đang chuẩn bị ở dạng tài liệu dài` (ebook.ts:37) | /tai-nguyen/ebook/ | No file (0) | NOT stale — no ebook published |
| `chưa phát hành bản tải về` (guides.ts:39/201/254) | /tai-nguyen/guides/ | Has content, web-only | NOT stale — a guarded negation (correctly says no download) |
| `Hiện chưa có bài viết nào được đăng tải` (blog status) | /blog/ | 0 articles | NOT stale — accurate current status |

## Conclusion
`RESOURCES_HUB_STALE_COPY_IDENTIFIED` = **0 stale**. Every "awaiting/no-content" line is attached to a route that genuinely has no content yet (Blog, Case Studies, Ebook), and every "has content" claim (Guides, Glossary, FAQ) is backed by real items. No string was softened into a broader claim.
