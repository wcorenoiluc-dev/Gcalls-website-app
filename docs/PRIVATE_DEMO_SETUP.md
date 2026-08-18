# Private demo — configuration and guard rails

Checkpoint `GCALLS-DEMO-IMAGE-FOUNDATION-001` §H.

This describes how to stand up the private review demo that renders the 18
Batch 1 draft articles. It is a **content-review build**, not a staging
environment and not a soft launch.

---

## 1. What the demo is for

Reviewers need to read the 18 drafts as rendered pages, and to see the Gcalls
Plus page with real product imagery. Nothing else. The demo:

- serves the 18 drafts, which a production build does not route at all;
- keeps every page out of search;
- talks to no production system.

---

## 2. Build configuration

Copy `.env.demo.example` to `.env.demo` (git-ignored) and adjust
`VITE_SITE_ORIGIN` to the real demo hostname:

```
VITE_BLOG_PREVIEW=true
VITE_ALLOW_INDEXING=false
VITE_SITE_ORIGIN=https://<demo-host>
```

Build:

```
npm ci
npm run build -- --mode demo
```

`--mode demo` makes Vite read `.env.demo`. The two flags are the only
difference from a production build.

### Why both flags matter

| Flag | Effect | If it is wrong |
| --- | --- | --- |
| `VITE_BLOG_PREVIEW=true` | Registers the 18 draft routes and lists them in the archive | `false` → the drafts 404 and the demo is pointless |
| `VITE_ALLOW_INDEXING=false` | Site-wide `noindex` | `true` → the demo becomes indexable |

---

## 3. Draft protection is not one switch

Four independent layers keep drafts out of search. Any one of them failing
still leaves three standing.

1. **Routing.** `VISIBLE_ARTICLES` in `src/data/blog/visibility.ts` is empty in
   a production build, so draft URLs are never registered and fall through to
   the 404 route.
2. **Per-article robots.** `DRAFT_ROBOTS` is the constant
   `noindex,nofollow,noarchive,nosnippet,noimageindex`. It is deliberately
   **not** derived from `VITE_ALLOW_INDEXING`, so flipping the global indexing
   switch at go-live cannot publish a draft by accident. A draft becomes
   indexable only by editing `status` in `catalog.ts`, which is a reviewed
   change.
3. **`public/robots.txt`.** `Disallow: /` site-wide.
4. **`public/_headers`.** `X-Robots-Tag: noindex, nofollow, noarchive,
   nosnippet, noimageindex`. This is the only layer covering assets fetched
   directly — a `.webp` served on its own never parses an HTML meta tag, so
   this is what keeps the masked product screenshots out of image search.

Verify all four with `node scripts/verify-demo-build.mjs`.

---

## 4. Hosting

The demo must sit behind authentication **at the hosting layer**, not behind
anything implemented in this repository. A React app cannot keep a secret: any
in-app gate ships the content to the browser before it checks anything.

Acceptable:

- Cloudflare Access policy in front of the Pages project, restricted to named
  reviewer identities;
- Netlify password protection on the site;
- an HTTP Basic auth layer on a private host.

Configure it **before** the first deploy, not after. A URL that was public for
five minutes has been crawled.

Also required:

- a hostname that is not `gcalls.co` and not a subdomain that is advertised
  anywhere;
- no link to the demo from any public page, sitemap, email footer or social
  profile.

---

## 5. What the demo must never be connected to

Not configured, on purpose — see the block at the bottom of
`.env.demo.example`:

- `LEAD_PROVIDER`, `HUBSPOT_ACCESS_TOKEN`, `LARK_*`, `N8N_WEBHOOK_URL`,
  `LEAD_API_SHARED_SECRET`, `LEAD_ALLOWED_ORIGIN`.

With the lead endpoint unconfigured the contact form validates and fails
closed. That is the intended behaviour: a demo that can write into the
production CRM is not a demo. Reviewers testing the form should be told it is
expected not to submit.

No production database is involved at any point — the site has no runtime
database dependency; all content is compiled in.

---

## 6. Secrets

Nothing in this repository holds a credential. `.env` and `.env.*` are
git-ignored; the only exceptions are the two `*.example` templates, which hold
placeholders. Do not add a real value to either.

---

## 7. Before handing the demo link over

- [ ] `npm run build -- --mode demo` succeeds
- [ ] `node scripts/verify-demo-build.mjs` reports 0 failing routes, 18 draft
      articles rendered, 0 indexable pages
- [ ] hosting authentication is live and tested from a signed-out browser
- [ ] `robots.txt` returns `Disallow: /` on the demo host
- [ ] `X-Robots-Tag` is present on an HTML response *and* on a `.webp` response
- [ ] the contact form does not reach a production system

---

## 8. At go-live — do not carry these over

`VITE_ALLOW_INDEXING=true`, the `robots.txt` policy and the `X-Robots-Tag`
block in `public/_headers` must change **together**. Shipping one without the
others either leaves the live site unindexable or exposes the preview. See
`docs/LAUNCH_CHECKLIST.md`.

Draft articles do **not** become public by flipping those switches. They become
public by changing `status` in `src/data/blog/catalog.ts`, one reviewed article
at a time.
