# GCALLS Website — Production Launch Checklist

Everything on this list must be done deliberately before the site goes live.
Nothing here should happen as a side effect of a routine code change.

---

## 1. 🔴 Enable search indexing

**The site currently ships `noindex, nofollow` on every route. This is intentional.**

The pre-launch build must not be indexed. Indexing is controlled by one flag —
it is not hardcoded and must not be removed ad hoc.

### How it works

| Layer | File | Behaviour |
|---|---|---|
| Runtime (per route) | `src/config/seo.ts` → `ALLOW_INDEXING` / `ROBOTS_CONTENT` | Reads `VITE_ALLOW_INDEXING`; applied by `src/components/common/Seo.tsx` on every navigation |
| Pre-hydration default | `index.html` | Static `<meta name="robots" content="noindex, nofollow">`, matching the runtime default |
| Crawl policy | `public/robots.txt` | `Disallow: /` — added for the Boss Demo V1 preview |
| Transport header | `public/_headers` | `X-Robots-Tag: noindex, nofollow, noarchive` (Cloudflare Pages) |

### To enable at go-live

1. Set the production build environment variable:
   ```bash
   VITE_ALLOW_INDEXING=true
   VITE_SITE_ORIGIN=https://gcalls.co   # or the real production origin
   ```
2. Update the static fallback in `index.html` to `index, follow` so crawlers
   that read pre-hydration HTML are not blocked.
3. Replace `Disallow: /` in `public/robots.txt` with the production crawl policy.
4. Remove the `X-Robots-Tag` line from `public/_headers`.
5. Rebuild and redeploy.
6. Verify on the live site: view source, inspect the hydrated DOM, **and**
   `curl -I` the response — all three must show `index, follow` with no
   `X-Robots-Tag`.

> All four layers must agree. Changing only the env var leaves the static tag,
> `robots.txt` and the header still blocking crawlers.

---

## 2. Server configuration for client-side routing

The site is a client-rendered SPA using the History API. The production server
**must** rewrite all unmatched paths to `/index.html`, or every route except
`/` will 404 on direct load and refresh.

Vite's dev server does this automatically; production hosts do not, unless told.

- **Cloudflare Pages / Netlify** — `public/_redirects`: `/*  /index.html  200` — **committed** (see that file)
- **Vercel** — `vercel.json` rewrite: `{ "source": "/(.*)", "destination": "/index.html" }`
- **Nginx** — `try_files $uri $uri/ /index.html;`
- **Apache** — `FallbackResource /index.html`
- **S3 + CloudFront** — error document `index.html`, 403/404 → 200 `/index.html`

Trailing slashes are part of the approved route paths (`/bang-gia/`). Configure
the host to preserve them rather than redirecting them away.

**Verify after deploy:** load every route from §4 directly by URL, then hard-refresh each.

---

## 3. Still missing before launch

These are known gaps, deferred from Checkpoint 2 by design.

| Item | Status | Notes |
|---|---|---|
| Lead capture | ⚠️ Frontend done, **backend not connected** | Shared pipeline complete; needs a server endpoint. See [`LEAD_CAPTURE_ARCHITECTURE.md`](LEAD_CAPTURE_ARCHITECTURE.md) §7. |
| Analytics / tag manager | ❌ None | No GA, GTM, or pixel. No attribution from day one without this. |
| Cookie / consent banner | ❌ None | Required before analytics if targeting EU visitors. |
| Favicon | ❌ None | No `<link rel="icon">`. |
| OG preview image | ❌ None | `og:image` is not set — shared links have no thumbnail. The site has zero `<img>` elements. |
| `sitemap.xml` | ❌ None | Generate from `ROUTES` in `src/config/navigation.ts`. |
| `robots.txt` | ⚠️ Preview policy | `public/robots.txt` ships `Disallow: /` for the demo. Must be replaced at go-live — see §1. |
| Structured data (JSON-LD) | ✅ Per page | Service / SoftwareApplication / CollectionPage + BreadcrumbList + FAQPage on every built page and hub. Organization-level node still to add. |
| Page content | ⚠️ Mixed | All 6 hubs, 3 products, 4 solutions, pricing, estimator and contact are built. 21 CHILD routes remain sitemap-driven shells — see `docs/BOSS_DEMO_V1.md` §8. |
| Pricing configuration | ⚠️ Absent | Pricing and estimator show "Liên hệ để nhận báo giá". They must never render `0₫`. |
| SEO copy | ⚠️ Placeholder | `src/config/seo.ts` holds descriptive placeholders, not optimised copy. |
| Footer legal links | ⚠️ Deliberately absent | No privacy/terms/company links were invented. Add once approved. |

---

## 4. Route verification

Load each directly, then hard-refresh:

- [ ] `/`
- [ ] `/gcalls-plus-webphone/`
- [ ] `/tong-dai-tich-hop-crm/`
- [ ] `/tong-dai-tich-hop-helpdesk/`
- [ ] `/tong-dai-tich-hop-pos/`
- [ ] `/tong-dai-quoc-te/`
- [ ] `/qc-bot-ai/`
- [ ] `/gcalls-cx/`
- [ ] `/bang-gia/`
- [ ] `/uoc-tinh-chi-phi/`
- [ ] An unknown path → 404 page renders (not a server error)

---

## 5. Pre-deploy gate

```bash
npm run check    # typecheck + lint + build
```

Then verify at 390 / 430 / 768 / 1024 / 1440:

- [ ] no horizontal page scroll
- [ ] mobile menu opens, closes on Escape, closes after navigation
- [ ] no clipped content
- [ ] primary CTA tap targets >= 44px

---

## 6. Dependency advisories

Re-check `npm audit` before launch. Known accepted at Checkpoint 2:

| Package | Advisory | Why accepted |
|---|---|---|
| `react-router` 7.18.1 | RSC-mode CSRF bypass | Not reachable — this is a client-only SPA with no server and no RSC. Fixing requires React Router 8, which requires React 19. Revisit with a React 19 migration. |
| `eslint` toolchain | `brace-expansion` / `minimatch` DoS | Dev dependencies only; never shipped to users. No non-breaking fix published. |
