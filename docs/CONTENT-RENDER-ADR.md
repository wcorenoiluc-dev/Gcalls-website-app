# ADR — how the 31 empty routes get their content

**Status:** decided · **Choice: A1, the read-only route renderer** · GCALLS-027

---

## The decision in one line

The 31 routes are rendered from a versioned manifest inside the plugin, through
a `the_content` filter scoped to an exact slug allowlist. **No database write of
any kind.** A2, the updater that writes `post_content`, is not built.

---

## Why this was even a question

The pages exist in WordPress with the right slugs, titles and SEO records; what
they lack is a body. Two ways to give them one:

- **A1** — render at request time from a manifest. WordPress rows stay as they
  are.
- **A2** — write the body into `post_content` with an admin tool: snapshots,
  dry-run, nonce, journal, rollback.

A2 is the conventional answer, and "WordPress usually works that way" is not a
reason. The question is what each buys and what each risks.

---

## Threat model

The asset that must not be damaged is the **eighteen published articles**. They
are `post_type=post`, they carry approved copy, and their `body_sha256` is
checked before and after every deploy in this project.

| | A1 read-only | A2 updater |
|---|---|---|
| Code path that can write a post | **none exists** | `wp_insert_post` / `update_post_meta` |
| Worst case from a bug in slug matching | wrong page renders wrong body; refresh after a fix | wrong page's body **overwritten** |
| Worst case from a bug in the post-type guard | nothing — no writer to reach | an article body overwritten |
| Worst case from a bug in the capability check | nothing — no writer to reach | anonymous write path |
| Recovery | deploy previous plugin version | restore from snapshot, if the snapshot logic was itself correct |
| Blast radius | rendering only | the table the 18 articles live in |

The decisive asymmetry: **A2's failure modes are all "wrote something it should
not have"; A1 has no writer to misfire.** A1's worst case is a page that renders
wrongly until the next deploy.

That matters more than usual here. There is no PHP runtime on this machine, so
neither option can be executed before it meets the live database. Shipping an
unexecuted *renderer* risks a bad-looking page. Shipping an unexecuted *writer*
risks the articles. This project has already had one unexecuted PHP release
reach production and lock the administrator out of Settings (0.9.6); the lesson
is to keep the unverified surface as small as the job allows.

---

## Write surface

**A1: zero.** No `wp_insert_post`, no `wp_update_post`, no `update_post_meta`,
no `update_option`, no Elementor data written, no activation hook, no cron, no
`admin_init` write. The plugin gains a filter and a data file.

This is enforceable by grep, and a QA gate asserts it — the same shape as the
existing "lead pipeline sends nothing off this server" check.

**A2:** one write path per page, plus a snapshot write, plus a journal write,
plus a rollback write. Each needs its own guard and each guard needs a test that
cannot be run here.

---

## Conditions A1 had to meet

Checked against this codebase, not assumed:

| Requirement | Result |
|---|---|
| URLs unchanged | Yes — nothing about routing changes |
| Exactly one H1 | **Yes, and the theme already guarantees it.** `page-templates/full-width.php` buffers `the_content()`, then prints its own `<h1>` *only if* the content has none. A renderer that emits an H1 makes the template stand down. No theme change |
| Rank Math title/description | Yes — `rank_math/frontend/title` and `rank_math/frontend/description`, the same filters `class-seo.php` already uses. Scoped to allowlisted slugs |
| Canonical unchanged | Yes — not touched |
| Internal links work | Yes — plain anchors to real routes, checked for 200 in acceptance |
| Elementor / theme unaffected | Yes — the home page is not in the allowlist and is Elementor-rendered |
| Cache purgeable after deploy | Yes — same purge as any theme or plugin deploy |
| No hand-editing 31 pages in Elementor | Yes — that is the point |

A1 meets every condition. **No requirement was found that only A2 satisfies**,
so A2 is not built.

---

## Trade-offs A1 does carry

Recorded honestly, because they are real:

1. **The body is not editable in wp-admin.** An editor opening `/san-pham/` sees
   an empty editor. Git is the source of truth for these pages by design, but
   anyone expecting to edit in WordPress will be surprised. It is written on the
   Tools screen and in this ADR.
2. **WordPress on-site search will not find this text**, because search reads
   `post_content`. The demo is `noindex` and has no on-site search surface today;
   if that changes, it is a reason to revisit — and revisiting means moving to
   A2 deliberately, with tests, not by accident.
3. **A render-time cost per request**, negligible for a manifest read, and behind
   the page cache in any case.

If either of the first two ever becomes a requirement, this ADR should be
superseded rather than quietly worked around.

---

## Safety conditions the renderer enforces

- an **exact slug allowlist** taken from `route-matrix.json`; nothing pattern-matched
- `post_type=page` only
- `is_main_query()` **and** `is_singular()` **and** `in_the_loop()`
- never in `is_admin()`, REST, feed, preview, or AJAX
- renders **only** when the existing `post_content` is an empty shell or matches
  a recorded baseline hash. If someone gives the page real content in WordPress,
  the renderer stands down rather than hiding their work
- `post_type=post` can never match, so the eighteen articles are outside the
  code path entirely

---

## Rollback

Deploy the previous plugin version. There is no data to restore because there is
no data written. Compare with A2, where rollback means trusting snapshot logic
that has itself never been executed.

---

## SEO, cache and admin behaviour

- **SEO** — title and description supplied through Rank Math's own filters, only
  for allowlisted slugs; every other page keeps exactly what it has. Canonical
  untouched. The site-wide demo `noindex` is untouched.
- **Cache** — the rendered body is a normal page response; the edge caches it
  like any other. A purge after deploy is required, the same as for a theme
  change.
- **Admin** — nothing appears in the editor. Adding a read-only Tools screen that
  lists the allowlisted slugs and whether each is currently rendering is
  worthwhile, and it reads only.

---

## Decision

**A1.** It satisfies every stated requirement, and it does so with no code that
can write to the table holding the eighteen protected articles — which is the
property worth the most on a project where the runtime cannot be exercised
before deployment.
