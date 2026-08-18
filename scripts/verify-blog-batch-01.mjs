#!/usr/bin/env node
/**
 * Batch 1 blog verification — Checkpoint
 * GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING, §L.
 *
 * Verifies the SOURCE, not a build artefact, so the result does not depend on
 * which build flags happen to be set. Every rule below is one Asher locked in
 * the checkpoint; a failure here means the corrected Batch 1 has drifted.
 *
 * Usage:  node scripts/verify-blog-batch-01.mjs
 * Exit 0 = all checks pass. Exit 1 = at least one failure.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CATALOG = path.join(ROOT, 'src/data/blog/catalog.ts')
const ARTICLE_DIR = path.join(ROOT, 'src/data/blog/articles')
const SITEMAP = path.join(ROOT, 'src/config/sitemap.ts')
const CTAS = path.join(ROOT, 'src/data/blog/ctas.ts')
const REGISTRY = path.join(ROOT, 'src/data/blog/index.ts')

const failures = []
const notes = []

function fail(check, detail) {
  failures.push(`${check}: ${detail}`)
}

function read(file) {
  return fs.readFileSync(file, 'utf8')
}

/* ------------------------------------------------------------------ *
 * Locked expectations
 * ------------------------------------------------------------------ */

const EXPECTED_TOTAL = 18
const EXPECTED_HUBS = {
  'HUB-01': 3,
  'HUB-02': 2,
  'HUB-03': 3,
  'HUB-06': 2,
  'HUB-07': 3,
  'HUB-08': 2,
  'HUB-09': 3,
}
const EXPECTED_PILLAR = 8
const EXPECTED_SUPPORTING = 10
const EXPECTED_LEGACY = 7
const EXPECTED_NET_NEW = 11

const WORD_BANDS = {
  PILLAR: [2000, 3000],
  SUPPORTING: [1200, 2000],
}

const IMAGE_STATUSES = new Set([
  'IMAGE_READY',
  'PRODUCT_SCREENSHOT_REQUIRED',
  'CUSTOM_DIAGRAM_REQUIRED',
  'EDITORIAL_ILLUSTRATION_REQUIRED',
  'BRAND_VISUAL_REQUIRED',
])

/**
 * §J blocked claims.
 *
 * The percentage rule is deliberately broader than the listed figures: no
 * article in Batch 1 has evidence for ANY percentage, so any `NN%` is a
 * failure rather than only the four numbers Asher named. Same reasoning for
 * currency amounts — unverified pricing is blocked, and the safe rule is that
 * an article prints no price at all.
 */
const BLOCKED_CLAIMS = [
  [/\d+\s*(?:[–-]\s*\d+\s*)?%/u, 'tỷ lệ phần trăm chưa có bằng chứng'],
  [/\b\d[\d.,]*\s*(?:đồng|vnđ|vnd|usd)\b/iu, 'giá chưa xác minh'],
  [/\$\s?\d/u, 'giá chưa xác minh'],
  [/\b24\s*\/\s*7\b/u, 'cam kết phục vụ 24/7'],
  [/\bSLA\b/u, 'cam kết SLA'],
  [/\buptime\b/iu, 'cam kết uptime'],
  [/70\+?\s*(?:quốc gia|nước)/iu, 'phủ sóng 70+ quốc gia'],
  [/1[.,]?200\s*giờ/iu, 'tiết kiệm 1.200 giờ'],
  [/(?:trong|chỉ)\s*(?:vòng\s*)?(?:5|năm|30|ba mươi)\s*phút/iu, 'cam kết thời gian triển khai'],
  [/triển khai\s*(?:chỉ\s*)?trong\s*(?:một|1)\s*ngày/iu, 'cam kết thời gian triển khai'],
  [/không bao giờ (?:bỏ sót|bỏ lỡ)/iu, 'cam kết không bao giờ bỏ sót lead'],
  [/(?:ai|voicebot)[^.\n]{0,40}thay thế hoàn toàn/iu, 'AI thay thế hoàn toàn con người'],
  [/thay thế hoàn toàn (?:con người|nhân viên|người)/iu, 'AI thay thế hoàn toàn con người'],
  [/(?:bảo đảm|đảm bảo|cam kết)[^.\n]{0,30}tiết kiệm/iu, 'tiết kiệm được bảo đảm'],
]

/** Markers that would mean legacy WordPress prose or layout leaked in. */
const LEGACY_MARKERS = [
  [/wp-content/i, 'đường dẫn ảnh WordPress'],
  [/\[caption/i, 'shortcode caption'],
  [/\[vc_/i, 'shortcode Visual Composer'],
  [/elementor/i, 'layout Elementor'],
  [/&nbsp;/i, 'thực thể HTML từ bản xuất'],
  [/<img\b/i, 'thẻ img nhúng trực tiếp'],
  [/<p\b|<div\b|<span\b/i, 'HTML thô trong thân bài'],
  [/20260716-222433/i, 'ảnh ICP bị cấm dùng'],
]

/**
 * Competitor-review and off-scope topics excluded from Batch 1.
 *
 * These are the fifteen topics this checkpoint removed. They may return only in
 * a later "integration landscape" batch, with third-party facts verified.
 */
const FORBIDDEN_TOPICS = [
  'hubspot',
  'zoho',
  'salesforce',
  'zendesk',
  'freshdesk',
  'getfly',
  'pancake',
  'sapo',
  'nhà đầu tư thiên thần',
  'angel investor',
  'giới thiệu khách hàng',
  'referral',
  'tự ghi âm cuộc gọi',
  'tai nghe',
]

/* ------------------------------------------------------------------ *
 * Parsing
 * ------------------------------------------------------------------ */

/** Site routes, read from the single source of truth. */
function parseRoutes() {
  const src = read(SITEMAP)
  const block = /export const ROUTES = \{([\s\S]*?)\n\} as const/.exec(src)
  if (!block) throw new Error('Could not locate ROUTES in sitemap.ts')

  const paths = new Set()
  for (const match of block[1].matchAll(/^\s*[\w]+:\s*'([^']+)',/gm)) {
    paths.add(match[1])
  }
  return paths
}

function field(block, name) {
  const match = new RegExp(`\\n\\s{4}${name}:\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|(\\d+)|(null|true|false))`, 'u').exec(block)
  if (!match) return undefined
  if (match[1] !== undefined) return match[1].replace(/\\'/g, "'")
  if (match[2] !== undefined) return Number(match[2])
  return match[3] === 'null' ? null : match[3] === 'true'
}

function arrayField(block, name) {
  const match = new RegExp(`\\n\\s{4}${name}:\\s*\\[([\\s\\S]*?)\\]`, 'u').exec(block)
  if (!match) return []
  return [...match[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1].replace(/\\'/g, "'"))
}

function parseCatalog() {
  const src = read(CATALOG)
  const arrayMatch = /const DRAFT_SEEDS: readonly CatalogSeed\[\] = \[([\s\S]*?)\n\]\n/.exec(src)
  if (!arrayMatch) throw new Error('Could not locate DRAFT_SEEDS in catalog.ts')

  const body = arrayMatch[1]
  const starts = [...body.matchAll(/\n\s{4}id: '/g)].map((m) => m.index)
  const entries = []

  starts.forEach((start, index) => {
    const end = index + 1 < starts.length ? starts[index + 1] : body.length
    const block = body.slice(start, end)

    entries.push({
      id: field(block, 'id'),
      legacyPostId: field(block, 'legacyPostId'),
      title: field(block, 'title'),
      slug: field(block, 'slug'),
      hub: field(block, 'hub'),
      cluster: field(block, 'cluster'),
      primaryKeyword: field(block, 'primaryKeyword'),
      secondaryKeywords: arrayField(block, 'secondaryKeywords'),
      searchIntent: field(block, 'searchIntent'),
      persona: field(block, 'persona'),
      funnelStage: field(block, 'funnelStage'),
      contentTier: field(block, 'contentTier'),
      seoTitle: field(block, 'seoTitle'),
      metaDescription: field(block, 'metaDescription'),
      featuredImage: field(block, 'featuredImage'),
      featuredImageAlt: field(block, 'featuredImageAlt'),
      productCta: arrayField(block, 'productCta'),
      claimStatus: field(block, 'claimStatus'),
      targetWordCount: field(block, 'targetWordCount'),
      excerpt: field(block, 'excerpt'),
      url: `/${field(block, 'slug')}/`,
    })
  })

  return entries
}

function parseArticle(file) {
  const src = read(path.join(ARTICLE_DIR, file))

  const slug = /\n  slug: '([^']+)'/.exec(src)?.[1]
  const bodyMatch = /\n  body: `([\s\S]*?)`,\n\n  faq:/.exec(src)
  const answerMatch = /answer:\s*\n?\s*'((?:[^'\\]|\\.)*)'/.exec(src)
  const questionMatch = /question:\s*'((?:[^'\\]|\\.)*)'/.exec(src)

  const faqBlock = /\n  faq: \[([\s\S]*?)\n  \],\n\n  images:/.exec(src)?.[1] ?? ''
  const faqQuestions = [...faqBlock.matchAll(/\n\s{6}q: '((?:[^'\\]|\\.)*)'/g)].map((m) => m[1])
  const faqAnswers = [...faqBlock.matchAll(/\n\s{6}a:\s*\n?\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1])
  const faqLinks = [...faqBlock.matchAll(/path: '([^']+)'/g)].map((m) => m[1])

  const imagesBlock = /\n  images: \[([\s\S]*?)\n  \],/.exec(src)?.[1] ?? ''
  const imageStatuses = [...imagesBlock.matchAll(/status: '([A-Z_]+)'/g)].map((m) => m[1])
  const imageRoles = [...imagesBlock.matchAll(/role: '([a-z-]+)'/g)].map((m) => m[1])
  const imageAlts = [...imagesBlock.matchAll(/\n\s{6}alt: '((?:[^'\\]|\\.)*)'/g)].map((m) => m[1])

  return {
    file,
    slug,
    src,
    body: bodyMatch?.[1] ?? '',
    directAnswerQuestion: questionMatch?.[1] ?? '',
    directAnswer: answerMatch?.[1] ?? '',
    faqQuestions,
    faqAnswers,
    faqLinks,
    imageStatuses,
    imageRoles,
    imageAlts,
  }
}

/** Plain prose from a body, with markup removed. Same rule the word bands use. */
function plainText(body) {
  return body
    .replace(/^#{2,3}\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/^[|>-]\s*/gm, '')
    .replace(/\|/g, ' ')
}

function countWords(body) {
  return plainText(body).split(/\s+/).filter(Boolean).length
}

/* ------------------------------------------------------------------ *
 * Checks
 * ------------------------------------------------------------------ */

const ROUTE_PATHS = parseRoutes()
const catalog = parseCatalog()
const articleFiles = fs.readdirSync(ARTICLE_DIR).filter((f) => f.endsWith('.ts')).sort()
const articles = articleFiles.map(parseArticle)
const bySlug = new Map(articles.map((a) => [a.slug, a]))
const ARTICLE_PATHS = new Set(catalog.map((entry) => entry.url))

/* 1 — exactly 18 */
if (catalog.length !== EXPECTED_TOTAL) {
  fail('Số lượng bài', `catalog có ${catalog.length} bài, cần đúng ${EXPECTED_TOTAL}`)
}
if (articleFiles.length !== EXPECTED_TOTAL) {
  fail('Số lượng file', `articles/ có ${articleFiles.length} file, cần đúng ${EXPECTED_TOTAL}`)
}

/* 2 — hub distribution */
const hubCounts = {}
for (const entry of catalog) hubCounts[entry.hub] = (hubCounts[entry.hub] ?? 0) + 1
for (const [hub, expected] of Object.entries(EXPECTED_HUBS)) {
  const actual = hubCounts[hub] ?? 0
  if (actual !== expected) fail('Phân bổ HUB', `${hub} có ${actual} bài, cần ${expected}`)
}
for (const hub of Object.keys(hubCounts)) {
  if (!(hub in EXPECTED_HUBS)) fail('Phân bổ HUB', `${hub} không thuộc Batch 1`)
}

/* 3 — every article is a draft (they live in DRAFT_SEEDS, which is the lock) */
{
  const src = read(CATALOG)
  const published = /const PUBLISHED_SEEDS: readonly CatalogSeed\[\] = \[\s*\]/.test(src)
  if (!published) {
    fail('Trạng thái Draft', 'PUBLISHED_SEEDS không rỗng — Batch 1 phải toàn bộ là Draft')
  }
  if (!/const DRAFT_SEEDS/.test(src)) {
    fail('Trạng thái Draft', 'không tìm thấy DRAFT_SEEDS trong catalog')
  }
}

/* 4 — pillar / supporting, legacy / net-new */
{
  const pillar = catalog.filter((e) => e.contentTier === 'PILLAR').length
  const supporting = catalog.filter((e) => e.contentTier === 'SUPPORTING').length
  if (pillar !== EXPECTED_PILLAR) fail('Pillar', `${pillar} bài, cần ${EXPECTED_PILLAR}`)
  if (supporting !== EXPECTED_SUPPORTING) {
    fail('Supporting', `${supporting} bài, cần ${EXPECTED_SUPPORTING}`)
  }

  const legacy = catalog.filter((e) => typeof e.legacyPostId === 'number').length
  const netNew = catalog.filter((e) => e.legacyPostId === null).length
  if (legacy !== EXPECTED_LEGACY) fail('Legacy re-scope', `${legacy} bài, cần ${EXPECTED_LEGACY}`)
  if (netNew !== EXPECTED_NET_NEW) fail('Net-new', `${netNew} bài, cần ${EXPECTED_NET_NEW}`)
}

/* 5 — uniqueness */
function assertUnique(label, values) {
  const seen = new Map()
  values.forEach(({ key, id }) => {
    const normalized = String(key).trim().toLowerCase()
    if (seen.has(normalized)) {
      fail(label, `"${key}" xuất hiện ở cả ${seen.get(normalized)} và ${id}`)
    } else {
      seen.set(normalized, id)
    }
  })
}

assertUnique('Trùng title', catalog.map((e) => ({ key: e.title, id: e.id })))
assertUnique('Trùng SEO title', catalog.map((e) => ({ key: e.seoTitle, id: e.id })))
assertUnique('Trùng meta description', catalog.map((e) => ({ key: e.metaDescription, id: e.id })))
assertUnique('Trùng final URL', catalog.map((e) => ({ key: e.url, id: e.id })))
assertUnique('Trùng canonical', catalog.map((e) => ({ key: e.url, id: e.id })))
assertUnique('Trùng primary keyword', catalog.map((e) => ({ key: e.primaryKeyword, id: e.id })))
assertUnique('Trùng excerpt', catalog.map((e) => ({ key: e.excerpt, id: e.id })))

/* 6 — required metadata present */
for (const entry of catalog) {
  for (const key of [
    'id',
    'title',
    'slug',
    'hub',
    'cluster',
    'primaryKeyword',
    'searchIntent',
    'persona',
    'funnelStage',
    'contentTier',
    'seoTitle',
    'metaDescription',
    'featuredImageAlt',
    'claimStatus',
    'targetWordCount',
    'excerpt',
  ]) {
    if (!entry[key]) fail('Thiếu metadata', `${entry.id} thiếu trường "${key}"`)
  }

  if (entry.secondaryKeywords.length === 0) {
    fail('Thiếu metadata', `${entry.id} không có secondary keyword`)
  }
  if (entry.productCta.length === 0) {
    fail('Thiếu CTA', `${entry.id} không có CTA nào`)
  }
  if (entry.featuredImage !== null) {
    fail('Ảnh', `${entry.id} khai báo featuredImage trong khi chưa có ảnh nào được sản xuất`)
  }
  if (entry.seoTitle.length > 70) {
    fail('SEO title', `${entry.id} dài ${entry.seoTitle.length} ký tự (tối đa 70)`)
  }
  if (entry.metaDescription.length < 100 || entry.metaDescription.length > 185) {
    fail(
      'Meta description',
      `${entry.id} dài ${entry.metaDescription.length} ký tự (cần 100–185)`,
    )
  }
}

/* 7 — CTA vocabulary */
{
  const ctaSrc = read(CTAS)
  const allowed = new Set(
    [...ctaSrc.matchAll(/\n {2}'?([a-z-]+)'?:\s*\{\n\s+id:/g)].map((m) => m[1]),
  )
  for (const entry of catalog) {
    for (const cta of entry.productCta) {
      if (!allowed.has(cta)) fail('CTA ngoài danh mục', `${entry.id} dùng "${cta}"`)
    }
  }
  if (allowed.size !== 10) {
    fail('Danh mục CTA', `ctas.ts có ${allowed.size} CTA, danh mục được duyệt là 10`)
  }
}

/* 8 — catalog and article files agree */
{
  const catalogSlugs = new Set(catalog.map((e) => e.slug))
  for (const entry of catalog) {
    if (!bySlug.has(entry.slug)) fail('Thiếu thân bài', `${entry.id} (${entry.slug})`)
  }
  for (const article of articles) {
    if (!catalogSlugs.has(article.slug)) {
      fail('Thân bài thừa', `${article.file} không có trong catalog`)
    }
    if (article.file !== `${article.slug}.ts`) {
      fail('Tên file', `${article.file} không khớp slug "${article.slug}"`)
    }
  }

  const registry = read(REGISTRY)
  for (const entry of catalog) {
    if (!registry.includes(`'${entry.slug}': () =>`)) {
      fail('Registry', `${entry.slug} chưa được đăng ký loader trong data/blog/index.ts`)
    }
  }
}

/* 9 — forbidden topics */
for (const entry of catalog) {
  const haystack = `${entry.title} ${entry.slug} ${entry.primaryKeyword} ${entry.secondaryKeywords.join(' ')} ${entry.cluster}`.toLowerCase()
  for (const topic of FORBIDDEN_TOPICS) {
    if (haystack.includes(topic)) {
      fail('Chủ đề bị loại khỏi Batch 1', `${entry.id} chứa "${topic}"`)
    }
  }
}

/* 10 — body-level checks */
const allParagraphs = new Map()

for (const article of articles) {
  const entry = catalog.find((e) => e.slug === article.slug)
  const label = entry ? entry.id : article.file

  if (!article.body.trim()) {
    fail('Thân bài rỗng', label)
    continue
  }

  /* direct answer, 40–80 words */
  const answerWords = article.directAnswer.split(/\s+/).filter(Boolean).length
  if (!article.directAnswerQuestion) fail('Direct answer', `${label} thiếu câu hỏi`)
  if (answerWords < 40 || answerWords > 80) {
    fail('Direct answer', `${label} dài ${answerWords} từ (cần 40–80)`)
  }

  /* word band */
  const words = countWords(article.body)
  const band = WORD_BANDS[entry?.contentTier ?? 'SUPPORTING']
  if (words < band[0] || words > band[1]) {
    fail('Độ dài', `${label} có ${words} từ, band ${entry?.contentTier} là ${band[0]}–${band[1]}`)
  }

  /* structure */
  const h1 = article.body.match(/^#\s+/gm) ?? []
  if (h1.length > 0) fail('H1 trong thân bài', `${label} có ${h1.length} H1 (H1 chỉ do trang render)`)

  const h2 = article.body.match(/^## /gm) ?? []
  if (h2.length < 5) fail('Cấu trúc', `${label} chỉ có ${h2.length} H2 (cần tối thiểu 5)`)

  const hasTable = /^\|\s*---/m.test(article.body)
  const hasChecklist = /^- \[ \]/m.test(article.body)
  if (!hasTable && !hasChecklist) {
    fail('Bảng/checklist', `${label} không có bảng hoặc checklist nào`)
  }
  if (!hasChecklist) fail('Checklist', `${label} thiếu checklist`)

  if (!/^## .*(Kết luận|Sai lầm)/m.test(article.body)) {
    fail('Cấu trúc', `${label} thiếu phần Kết luận hoặc Sai lầm thường gặp`)
  }
  if (!/^## .*Sai lầm/m.test(article.body)) {
    fail('Sai lầm thường gặp', `${label} thiếu mục sai lầm thường gặp`)
  }
  if (!/^## .*Kết luận/m.test(article.body)) {
    fail('Kết luận', `${label} thiếu mục kết luận`)
  }

  /* FAQ 4–6, question and answer counts must match */
  if (article.faqQuestions.length < 4 || article.faqQuestions.length > 6) {
    fail('FAQ', `${label} có ${article.faqQuestions.length} câu (cần 4–6)`)
  }
  if (article.faqQuestions.length !== article.faqAnswers.length) {
    fail(
      'FAQ',
      `${label} có ${article.faqQuestions.length} câu hỏi nhưng ${article.faqAnswers.length} câu trả lời`,
    )
  }

  /* image briefs */
  if (article.imageStatuses.length === 0) fail('Brief ảnh', `${label} không có brief ảnh nào`)
  if (!article.imageRoles.includes('featured')) {
    fail('Brief ảnh', `${label} thiếu brief ảnh đại diện`)
  }
  if (article.imageAlts.length !== article.imageStatuses.length) {
    fail('Brief ảnh', `${label} có brief thiếu alt text`)
  }
  for (const status of article.imageStatuses) {
    if (!IMAGE_STATUSES.has(status)) fail('Brief ảnh', `${label} dùng trạng thái lạ "${status}"`)
    if (status === 'IMAGE_READY') {
      fail('Brief ảnh', `${label} khai IMAGE_READY nhưng chưa có ảnh nào được sản xuất`)
    }
  }

  /* claim safety — body, direct answer and FAQ answers all count */
  const claimSurface = [
    plainText(article.body),
    article.directAnswer,
    ...article.faqAnswers,
  ].join('\n')

  for (const [pattern, description] of BLOCKED_CLAIMS) {
    const hit = pattern.exec(claimSurface)
    if (hit) fail('Claim bị chặn', `${label} — ${description} ("${hit[0].trim()}")`)
  }

  /* legacy markers */
  for (const [pattern, description] of LEGACY_MARKERS) {
    if (pattern.test(article.body)) fail('Dấu vết legacy', `${label} — ${description}`)
  }

  /* links — rendered links must resolve */
  const bodyLinks = [...article.body.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1])
  const links = [...bodyLinks, ...article.faqLinks]
  let internal = 0
  let productLinks = 0

  for (const link of links) {
    if (link.startsWith('#')) continue
    if (!ROUTE_PATHS.has(link) && !ARTICLE_PATHS.has(link)) {
      fail('Liên kết chết', `${label} trỏ tới "${link}" không tồn tại`)
      continue
    }
    internal += 1
    if (ROUTE_PATHS.has(link)) productLinks += 1
  }

  if (internal < 2 || internal > 12) {
    fail('Internal link', `${label} có ${internal} liên kết nội bộ được render (cần 2–12)`)
  }
  if (productLinks < 1) {
    fail('Internal link', `${label} không có liên kết nào tới trang sản phẩm/giải pháp`)
  }
  if (!links.includes(article.slug) && bodyLinks.includes(`/${article.slug}/`)) {
    fail('Internal link', `${label} tự liên kết tới chính nó`)
  }

  /* duplicate paragraphs across the corpus */
  for (const chunk of plainText(article.body).split(/\n{2,}/)) {
    const normalized = chunk.replace(/\s+/g, ' ').trim().toLowerCase()
    if (normalized.split(' ').length < 25) continue
    if (allParagraphs.has(normalized)) {
      fail('Đoạn trùng lặp', `${label} trùng đoạn với ${allParagraphs.get(normalized)}`)
    } else {
      allParagraphs.set(normalized, label)
    }
  }
}

/* 11 — no two articles share a search intent inside the same hub unless the
   cluster differs, which is how deliberate overlap was recorded */
{
  const seen = new Map()
  for (const entry of catalog) {
    const key = `${entry.hub}|${entry.searchIntent}|${entry.cluster}`
    if (seen.has(key)) {
      fail(
        'Chồng search intent',
        `${entry.id} và ${seen.get(key)} cùng hub, cùng intent, cùng cluster`,
      )
    } else {
      seen.set(key, entry.id)
    }
  }
}

/* 12 — draft guard is present in the source */
{
  const visibility = read(path.join(ROOT, 'src/data/blog/visibility.ts'))
  if (!visibility.includes('noindex,nofollow,noarchive,nosnippet,noimageindex')) {
    fail('Draft noindex', 'DRAFT_ROBOTS không phải chỉ thị đầy đủ theo §G')
  }

  const router = read(path.join(ROOT, 'src/app/router.tsx'))
  if (!router.includes('VISIBLE_ARTICLES.map')) {
    fail('Draft guard', 'router không dựng route từ VISIBLE_ARTICLES')
  }
}

/* ------------------------------------------------------------------ *
 * Editorial System consistency
 * ------------------------------------------------------------------ *
 * This repository has no separate editorial validator, so the decision
 * vocabulary check lives here — §D of the checkpoint requires one after
 * RETIRE_NO_PUBLIC_URL was added.
 * ------------------------------------------------------------------ */

const DOCS = path.join(ROOT, 'docs/content-review/blog')

const DECISION_VOCABULARY = new Set([
  'REBUILD_KEEP_URL',
  'REBUILD_UPDATE_TOPIC',
  'MERGE_INTO_PRIMARY',
  'RETIRE_410',
  /** Added at GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING for never-published drafts. */
  'RETIRE_NO_PUBLIC_URL',
  'MANUAL_DECISION',
])

/** Minimal RFC 4180 reader — enough for these files, no dependency. */
function readCsv(file) {
  const text = read(file)
  const rows = []
  let row = []
  let cell = ''
  let quoted = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]

    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i += 1
        } else {
          quoted = false
        }
      } else {
        cell += char
      }
      continue
    }

    if (char === '"') quoted = true
    else if (char === ',') {
      row.push(cell)
      cell = ''
    } else if (char === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (char !== '\r') cell += char
  }

  if (cell !== '' || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }

  const header = rows.shift()
  return rows
    .filter((r) => r.length > 1)
    .map((r) => Object.fromEntries(header.map((key, index) => [key, r[index] ?? ''])))
}

{
  const master = readCsv(path.join(DOCS, 'editorial-master-map.csv'))

  if (master.length !== 263) {
    fail('Editorial System', `master map có ${master.length} dòng, phải giữ nguyên 263`)
  }

  const decisions = {}
  for (const row of master) {
    const decision = row.Decision
    decisions[decision] = (decisions[decision] ?? 0) + 1
    if (!DECISION_VOCABULARY.has(decision)) {
      fail('Vocabulary decision', `"${decision}" không thuộc từ vựng được duyệt`)
    }
  }

  const decisionTotal = Object.values(decisions).reduce((a, b) => a + b, 0)
  if (decisionTotal !== 263) {
    fail('Editorial System', `tổng decision là ${decisionTotal}, phải bằng 263`)
  }
  notes.push(
    `Decision: ${Object.entries(decisions)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join(' · ')} (tổng ${decisionTotal})`,
  )

  /* the three resolved manual decisions */
  const resolved = {
    9980: 'RETIRE_410',
    9991: 'RETIRE_410',
    15328: 'RETIRE_NO_PUBLIC_URL',
  }
  for (const [id, expected] of Object.entries(resolved)) {
    const row = master.find((r) => r['Legacy Post ID'] === id)
    if (!row) fail('Manual decision', `không tìm thấy dòng ${id}`)
    else if (row.Decision !== expected) {
      fail('Manual decision', `${id} là "${row.Decision}", cần "${expected}"`)
    } else if (!/Asher/.test(row['Editorial Notes'])) {
      fail('Manual decision', `${id} thiếu ghi chú bằng chứng và người quyết định`)
    } else if (!/Homepage/.test(row['Editorial Notes'])) {
      fail('Manual decision', `${id} chưa ghi rõ không redirect về Homepage`)
    }
  }

  /* the batch plan must carry exactly the eighteen */
  const plan = readCsv(path.join(DOCS, 'editorial-batch-plan.csv'))
  const planBatch1 = plan.filter((r) => r.Batch === 'Batch 1')
  if (planBatch1.length !== EXPECTED_TOTAL) {
    fail('Batch plan', `Batch 1 có ${planBatch1.length} dòng, cần ${EXPECTED_TOTAL}`)
  }
  const planTitles = new Set(planBatch1.map((r) => r.Title))
  for (const entry of catalog) {
    if (!planTitles.has(entry.title)) {
      fail('Batch plan', `thiếu "${entry.title}" trong Batch 1`)
    }
  }
  for (const row of planBatch1) {
    const haystack = `${row.Title} ${row.HUB}`.toLowerCase()
    for (const topic of FORBIDDEN_TOPICS) {
      if (haystack.includes(topic)) {
        fail('Batch plan', `Batch 1 vẫn chứa chủ đề bị loại: "${topic}"`)
      }
    }
  }

  /* the fifteen removed rows must be re-homed, not deleted */
  const REMOVED_IDS = [
    '2621', '2437', '2850', '2835', '2819', '2883', '2864', '2244',
    '1967', '2584', '16271', '553', '16324', '15384', '15380',
  ]
  for (const id of REMOVED_IDS) {
    const row = master.find((r) => r['Legacy Post ID'] === id)
    if (!row) {
      fail('Bài bị loại khỏi Batch 1', `${id} đã biến mất khỏi master map`)
    } else if (row.Batch === 'Batch 1') {
      fail('Bài bị loại khỏi Batch 1', `${id} vẫn còn trong Batch 1`)
    } else if (!row.Batch) {
      fail('Bài bị loại khỏi Batch 1', `${id} không được gán batch nào`)
    }
  }

  /* the proposal CSV must mirror the catalog */
  const proposal = readCsv(path.join(DOCS, 'batch-01-replacement-proposal.csv'))
  if (proposal.length !== EXPECTED_TOTAL) {
    fail('Replacement proposal', `có ${proposal.length} dòng, cần ${EXPECTED_TOTAL}`)
  }
  for (const entry of catalog) {
    const row = proposal.find((r) => r.ID === entry.id)
    if (!row) {
      fail('Replacement proposal', `thiếu ${entry.id}`)
      continue
    }
    if (row['Final URL'] !== entry.url) {
      fail('Replacement proposal', `${entry.id} URL lệch: "${row['Final URL']}" ≠ "${entry.url}"`)
    }
    if (row['Primary Keyword'] !== entry.primaryKeyword) {
      fail('Replacement proposal', `${entry.id} primary keyword lệch với catalog`)
    }
    if (row['New Title'] !== entry.title) {
      fail('Replacement proposal', `${entry.id} tiêu đề lệch với catalog`)
    }
  }
}

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */

notes.push(`Bài viết: ${catalog.length}`)
notes.push(
  `Phân bổ HUB: ${Object.entries(EXPECTED_HUBS)
    .map(([hub]) => `${hub}=${hubCounts[hub] ?? 0}`)
    .join(' · ')}`,
)
notes.push(
  `Pillar/Supporting: ${catalog.filter((e) => e.contentTier === 'PILLAR').length}/${
    catalog.filter((e) => e.contentTier === 'SUPPORTING').length
  }`,
)
notes.push(
  `Legacy/Net-new: ${catalog.filter((e) => typeof e.legacyPostId === 'number').length}/${
    catalog.filter((e) => e.legacyPostId === null).length
  }`,
)
notes.push(
  `Tổng số từ thân bài: ${articles.reduce((sum, a) => sum + countWords(a.body), 0).toLocaleString('vi-VN')}`,
)
notes.push(`Tổng số câu FAQ: ${articles.reduce((sum, a) => sum + a.faqQuestions.length, 0)}`)
notes.push(
  `Tổng số brief ảnh: ${articles.reduce((sum, a) => sum + a.imageStatuses.length, 0)}`,
)

console.log('\nVERIFY BLOG BATCH 01 — GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING\n')
for (const note of notes) console.log(`  · ${note}`)

if (failures.length > 0) {
  console.error(`\n✗ ${failures.length} lỗi:\n`)
  for (const failure of failures) console.error(`  - ${failure}`)
  console.error('')
  process.exit(1)
}

console.log('\n✓ Toàn bộ kiểm tra Batch 1 PASS\n')
