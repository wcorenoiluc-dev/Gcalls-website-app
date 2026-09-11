/**
 * Real page bodies for the two routes a summary paragraph could not carry.
 *
 * WHY THESE TWO AND NOT ALL 38
 * `baselinePageContent()` in export-content.mjs writes one honest summary
 * paragraph per route, which is right for a section index nobody has written
 * copy for yet. It is wrong for a page that HAS copy in the React build:
 * /uoc-tinh-chi-phi/ and /blog/ both render several screens of editorial
 * content from data modules, and the WordPress pages were showing a single
 * sentence — 0 and 7 percent of the reference's headings. The product pages are
 * not here because `[gcalls_product_page]` already renders theirs.
 *
 * WHY GENERATED FROM THE DATA MODULES
 * The copy is 40-odd headings and paragraphs across two files. Retyped into
 * this script it would be wrong within one editorial pass and nobody would
 * notice, because a stale paragraph looks exactly like a current one.
 *
 * The modules import the `@/` alias, which plain Node cannot resolve, so the
 * import lines are rewritten against the route table before loading — the same
 * trick build-estimator-config.mjs uses, factored here so both share it.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/*
 * Nothing here may stringify `undefined`.
 *
 * `String(undefined)` is the seven-character word "undefined", and it has now
 * shipped to this site twice: five FAQ entries on each of eighteen articles,
 * and an h2 on /blog/ reading "undefined" because the final CTA keys its
 * heading `h2` and this read `title`. Both produced perfectly well-formed
 * markup that validated, imported and passed every gate — visible only by
 * reading the page. A missing string is a bug in the caller, so it throws.
 */
const esc = (text) => {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new TypeError(`page-bodies: expected a non-empty string, got ${JSON.stringify(text)}`)
  }

  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/* ------------------------------------------------------------------ *
 * Block helpers — Gutenberg serialisation, not HTML strings
 * ------------------------------------------------------------------ */

const p = (text) => `<!-- wp:paragraph -->\n<p>${esc(text)}</p>\n<!-- /wp:paragraph -->`

const heading = (text, level = 2, anchor = null) => {
  const attrs = []
  if (level !== 2) attrs.push(`"level":${level}`)
  if (anchor) attrs.push(`"anchor":"${anchor}"`)
  const json = attrs.length ? ` {${attrs.join(',')}}` : ''
  const id = anchor ? ` id="${anchor}"` : ''
  return `<!-- wp:heading${json} -->\n<h${level} class="wp-block-heading"${id}>${esc(text)}</h${level}>\n<!-- /wp:heading -->`
}

const list = (items) => {
  const rows = items
    .map((item) => `<!-- wp:list-item -->\n<li>${item}</li>\n<!-- /wp:list-item -->`)
    .join('\n')
  return `<!-- wp:list -->\n<ul class="wp-block-list">\n${rows}\n</ul>\n<!-- /wp:list -->`
}

const shortcode = (value) => `<!-- wp:shortcode -->\n${value}\n<!-- /wp:shortcode -->`

const link = (href, label) => `<a href="${href}">${esc(label)}</a>`

/**
 * A card: an h3 and a paragraph.
 *
 * React draws these as a grid of bordered cards. Reproduced here as headings
 * and paragraphs rather than as a wp:columns grid, because a grid built out of
 * fixed columns stops being a grid at 390px unless every breakpoint is written
 * by hand — and the theme already styles a run of h3 + p inside a page.
 */
const card = (title, detail) => [heading(title, 3), p(detail)]

/* ------------------------------------------------------------------ *
 * Loading the React data modules
 * ------------------------------------------------------------------ */

function routeTable(repo) {
  const source = fs.readFileSync(path.join(repo, 'src/config/sitemap.ts'), 'utf8')
  const block = source.slice(source.indexOf('export const ROUTES = {'), source.indexOf('} as const'))
  const routes = {}
  for (const [, key, value] of block.matchAll(/^\s*(\w+):\s*'([^']+)',/gm)) routes[key] = value
  if (Object.keys(routes).length === 0) throw new Error('no routes extracted from sitemap.ts')
  return routes
}

/** Loads a TS module after replacing its `@/config/navigation` import. */
async function loadModule(repo, relative, routes) {
  const source = fs.readFileSync(path.join(repo, relative), 'utf8')
  const patched = source.replace(
    /^import \{[^}]*\} from '@\/config\/navigation'$/m,
    `const ROUTES = ${JSON.stringify(routes)}\ntype RoutePath = string`,
  )

  if (patched === source && /@\/config\/navigation/.test(source)) {
    throw new Error(`the navigation import in ${relative} did not match`)
  }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gcalls-body-'))
  const file = path.join(dir, path.basename(relative))
  fs.writeFileSync(file, patched)

  return import(file)
}

/* ------------------------------------------------------------------ *
 * /uoc-tinh-chi-phi/
 * ------------------------------------------------------------------ */

async function costEstimatorBody(repo, routes) {
  const { COST_DRIVERS, ESTIMATOR_FAQ, HOW_IT_WORKS, QUOTE_DIFFERENCES } = await loadModule(
    repo,
    'src/data/estimator.ts',
    routes,
  )

  const parts = [
    p(
      'Chọn giải pháp, quy mô đội ngũ và nhu cầu sử dụng để xem cấu hình tham khảo trước khi nhận báo giá chính thức.',
    ),
    // Approved copy, verbatim. It is the direct answer the page is built
    // around, and it is what keeps the tool from reading as a price list.
    p(
      'Công cụ giúp doanh nghiệp lựa chọn sản phẩm, nhập quy mô sử dụng và xác định các yếu tố ' +
        'có thể ảnh hưởng đến cấu hình và chi phí triển khai. Chi phí chỉ được hiển thị khi bảng giá ' +
        'tương ứng đã được cấu hình; báo giá chính thức phụ thuộc vào yêu cầu thực tế.',
    ),

    heading('Công cụ ước tính cấu hình', 2, 'cong-cu-uoc-tinh'),
    shortcode('[gcalls_estimator]'),

    heading('Chi phí thay đổi theo cách doanh nghiệp sử dụng Gcalls', 2, 'yeu-to-chi-phi'),
    ...COST_DRIVERS.flatMap((driver) => card(driver.title, driver.detail)),

    heading('Công cụ ước tính hoạt động như thế nào?', 2, 'cach-hoat-dong'),
    // The step number goes in the body, not into the heading: React's
    // heading is "Chọn sản phẩm", and "01. Chọn sản phẩm" is a different
    // string to anything matching on headings, a reader included.
    ...HOW_IT_WORKS.flatMap((step) => card(step.title, `${step.n} — ${step.detail}`)),

    heading('Vì sao báo giá chính thức có thể khác?', 2, 'vi-sao-khac'),
    p(
      'Cấu hình tham khảo dựa trên thông tin bạn cung cấp. Báo giá chính thức được xác nhận ' +
        'sau khi Gcalls rà soát các yếu tố dưới đây.',
    ),
    list(QUOTE_DIFFERENCES.map((item) => esc(item))),

    shortcode('[gcalls_faq title="Câu hỏi thường gặp về ước tính chi phí"]'),

    heading('Chưa chắc cấu hình nào phù hợp với doanh nghiệp?', 2, 'cta-uoc-tinh'),
    p(
      'Chia sẻ quy mô đội ngũ, hệ thống đang sử dụng và nhu cầu giao tiếp để Gcalls đề xuất ' +
        'cấu hình phù hợp.',
    ),
    shortcode('[gcalls_cta label="Đăng ký tư vấn" intent="consultation" source="cost-estimator"]'),
  ]

  return {
    content: parts.join('\n\n'),
    faq: ESTIMATOR_FAQ.map((item) => ({ question: item.q, answer: item.a })),
  }
}

/* ------------------------------------------------------------------ *
 * /blog/
 * ------------------------------------------------------------------ */

/**
 * Two things in the React blog page are TRUE THERE AND FALSE HERE.
 *
 * React's `/blog/` says, in a section of its own and in two FAQ answers, that
 * no article has been published — which is exactly right in that build, where
 * every Batch 1 article is a draft. This site has eighteen published articles
 * and an archive listing them. Copying those passages across would put a plain
 * false statement on the live page, directly above the posts it denies, and
 * would score BETTER on a heading-parity metric for doing it.
 *
 * So they are dropped, by exact wording rather than by a fuzzy match: if an
 * editor rephrases one, the build fails here instead of quietly reinstating a
 * claim nobody checked.
 */
const BLOG_EMPTY_STATE_QUESTIONS = [
  'Vì sao blog chưa có bài viết nào?',
  'Trong lúc chờ bài viết, có thể đọc gì?',
]

async function blogBody(repo, routes) {
  const { BLOG } = await loadModule(repo, 'src/data/resources/blog.ts', routes)

  const faqItems = Array.isArray(BLOG.faq) ? BLOG.faq : (BLOG.faq?.items ?? [])
  const missing = BLOG_EMPTY_STATE_QUESTIONS.filter(
    (question) => !faqItems.some((item) => item.q === question),
  )

  if (missing.length) {
    throw new Error(
      `blog FAQ: these questions were dropped as "no articles yet" claims and no longer exist — ` +
        `check whether they still need dropping: ${missing.join(' / ')}`,
    )
  }

  const parts = []

  // The page's real title. WordPress uses the posts page's post_title, which
  // is the menu label "Blog" — accurate and useless: it is the one heading a
  // reader and a search engine both read first, and it says nothing about what
  // the blog covers. React heads the page with the sentence that does.
  if (BLOG.hero?.h1) parts.push(heading(BLOG.hero.h1, 1))
  if (BLOG.hero?.description) parts.push(p(BLOG.hero.description))

  if (BLOG.purpose) {
    parts.push(heading(BLOG.purpose.h2, 2, BLOG.purpose.anchorId ?? null))
    if (BLOG.purpose.description) parts.push(p(BLOG.purpose.description))
    for (const item of BLOG.purpose.audience ?? BLOG.purpose.items ?? []) {
      parts.push(...card(item.title, item.detail))
    }
    if (BLOG.purpose.note) parts.push(p(BLOG.purpose.note))
  }

  /*
   * Where the article listing goes.
   *
   * Checkpoint 007 put the whole body below the listing, on the reasoning that
   * burying eighteen articles under screens of scope notes is an odd way to
   * publish an archive. Half right: the SIX CATEGORIES are screens of scope
   * notes, but the purpose block above is four short paragraphs saying who the
   * blog is written for, and React puts it first for a reason — it is what
   * tells a reader whether the list below is for them.
   *
   * home.php splits the body here.
   */
  parts.push('<!-- gcalls:archive -->')

  if (BLOG.categories) {
    parts.push(heading(BLOG.categories.h2, 2, BLOG.categories.anchorId ?? null))
    if (BLOG.categories.description) parts.push(p(BLOG.categories.description))

    for (const item of BLOG.categories.items ?? []) {
      parts.push(heading(item.title, 3))
      parts.push(p(item.detail))
      if (item.topics?.length) parts.push(list(item.topics.map((topic) => esc(topic))))
      // The links are the point of a category with no articles yet: they send
      // the reader to the finished page covering the same problem.
      if (item.links?.length) {
        parts.push(list(item.links.map((entry) => link(entry.path, entry.label))))
      }
    }
  }

  if (BLOG.routing) {
    parts.push(heading(BLOG.routing.h2, 2, BLOG.routing.anchorId ?? null))
    if (BLOG.routing.description) parts.push(p(BLOG.routing.description))
    for (const item of BLOG.routing.items ?? []) {
      parts.push(heading(item.title, 3))
      if (item.detail) parts.push(p(item.detail))
      if (item.path) parts.push(list([link(item.path, item.cta ?? item.title)]))
    }
  }

  // One heading, not two: the shortcode prints its own unless told otherwise.
  parts.push(shortcode('[gcalls_faq title="Câu hỏi thường gặp — Blog"]'))

  if (BLOG.finalCta) {
    parts.push(heading(BLOG.finalCta.h2 ?? BLOG.finalCta.title, 2, 'cta-blog'))
    if (BLOG.finalCta.description) parts.push(p(BLOG.finalCta.description))
  }

  parts.push(shortcode('[gcalls_cta label="Đăng ký tư vấn" intent="consultation" source="blog"]'))

  return {
    content: parts.join('\n\n'),
    // The shortcode renders from `_gcalls_faq`, the same meta that feeds the
    // FAQPage JSON-LD, so the answers a reader sees and the answers Google is
    // told about cannot diverge.
    faq: faqItems
      .filter((item) => !BLOG_EMPTY_STATE_QUESTIONS.includes(item.q))
      .map((item) => ({ question: item.q, answer: item.a })),
  }
}

/* ------------------------------------------------------------------ *
 * The four product pages
 * ------------------------------------------------------------------ */

/**
 * Each product page is one shortcode, rendered from `data/product-pages.json`.
 *
 * WHY THESE ARE HERE AT ALL WHEN THE SHORTCODE DOES THE WORK
 * They were inserted into the live pages BY HAND. That worked, and it made
 * every one of those pages unreproducible: the manifest still described them as
 * a one-line placeholder, so re-running the import with --force — the ordinary
 * way to push a content fix — would have replaced four finished product pages
 * with a sentence each. The importer's edited-content guard is what caught it,
 * and a guard catching this every time is not the same as it not being a
 * problem. A page that only exists because somebody pasted something into
 * wp-admin is a page nobody can rebuild.
 */
function productBodies(repo) {
  const file = path.join(repo, 'wordpress/wp-content/plugins/gcalls-core/data/product-pages.json')
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  const out = {}

  for (const [id, page] of Object.entries(data.pages ?? {})) {
    if (!page.route) throw new Error(`product page ${id} has no route`)
    out[page.route] = { content: shortcode(`[gcalls_product_page id="${id}"]`) }
  }

  return out
}

/* ------------------------------------------------------------------ *
 * Public entry point
 * ------------------------------------------------------------------ */

/**
 * Returns `{ route: blockMarkup }` for the routes that have a real body.
 *
 * @param {string} repo Repository root.
 */
export async function pageBodies(repo) {
  const routes = routeTable(repo)

  return {
    ...productBodies(repo),
    '/uoc-tinh-chi-phi/': await costEstimatorBody(repo, routes),
    '/blog/': await blogBody(repo, routes),
  }
}
