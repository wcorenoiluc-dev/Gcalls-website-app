/**
 * Blog content model — Checkpoint GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING.
 *
 * ---------------------------------------------------------------------------
 * WHY TYPESCRIPT MODULES AND NOT `content/blog/<slug>.md`
 * ---------------------------------------------------------------------------
 * The checkpoint's preferred layout was a Markdown file per article with YAML
 * frontmatter, with the caveat "if the repo already has a better architecture,
 * use it and explain". It does, on three counts:
 *
 *  1. This repo has no Markdown or YAML dependency and no network install is
 *     permitted in this checkpoint, so a `.md` pipeline would need a
 *     hand-rolled YAML parser — an untyped second content pipeline sitting
 *     beside the typed one in `src/data/`, which is precisely the "two content
 *     sources" the checkpoint forbids.
 *  2. `src/config/sitemap.ts` is the single source of truth for routes, and
 *     `RoutePath` makes a link to a non-existent route a COMPILE error. CTAs
 *     and internal links authored in frontmatter would lose that guarantee.
 *  3. Metadata lives in `catalog.ts` exactly once. The body module imports
 *     nothing about itself, so an article cannot carry metadata that disagrees
 *     with the catalog, and `scripts/verify-blog-batch-01.mjs` reads the same
 *     catalog the app renders.
 *
 * The FRONTMATTER FIELDS the checkpoint specified are all present on
 * `BlogArticle` below, under the same names. Only the file format differs.
 *
 * Article BODIES are authored as a restricted Markdown subset (see
 * `renderBody.tsx`) so prose stays readable in source and word counts,
 * headings, tables and links stay machine-checkable.
 */

import type { RoutePath } from '@/config/navigation'
import type { FaqItem } from '@/components/common/FaqAccordion'
import type { LeadIntent, LeadSource } from '@/lib/leads/types'

/** The seven strategic hubs carrying Batch 1. */
export type BlogHubId =
  | 'HUB-01'
  | 'HUB-02'
  | 'HUB-03'
  | 'HUB-06'
  | 'HUB-07'
  | 'HUB-08'
  | 'HUB-09'

export type BlogTier = 'PILLAR' | 'SUPPORTING'

/**
 * Publication status.
 *
 * `draft` is the ONLY value in this repository today. It is not cosmetic: it
 * drives `noindex,nofollow,noarchive,nosnippet,noimageindex`, the draft banner,
 * and exclusion from the production archive. See `visibility.ts`.
 */
export type BlogStatus = 'draft' | 'published'

export type BlogSearchIntent =
  | 'informational-definition'
  | 'informational-howto'
  | 'informational-general'
  | 'commercial-investigation'

export type BlogFunnelStage = 'TOFU' | 'MOFU' | 'BOFU'

/** Image production state (§K). No article may ship `IMAGE_READY` it has not earned. */
export type BlogImageStatus =
  | 'IMAGE_READY'
  | 'PRODUCT_SCREENSHOT_REQUIRED'
  | 'CUSTOM_DIAGRAM_REQUIRED'
  | 'EDITORIAL_ILLUSTRATION_REQUIRED'
  | 'BRAND_VISUAL_REQUIRED'

/** Claim-safety verdict recorded per article (§J). */
export type BlogClaimStatus =
  | 'NO_UNVERIFIED_CLAIM'
  | 'CLAIM_PENDING_EVIDENCE'
  | 'CLAIM_BLOCKED'

/**
 * The approved CTA vocabulary (§I).
 *
 * A `BlogArticle` references CTAs by id, so an article physically cannot ship a
 * CTA outside the approved list. Destinations are `RoutePath`, so a CTA cannot
 * point at a route that does not exist.
 */
export type BlogCtaId =
  | 'gcalls-plus'
  | 'gcalls-cx'
  | 'qa-qc-center'
  | 'crm-integration'
  | 'helpdesk-integration'
  | 'international'
  | 'cloud-call-center'
  | 'voicebot-ai'
  | 'consult'
  | 'cost-estimator'

export interface BlogCta {
  id: BlogCtaId
  /** Approved product / solution label. Never invented per article. */
  label: string
  /** Button copy. */
  action: string
  path: RoutePath
  /** One line explaining what the reader gets. Shown under the button. */
  detail: string
  lead: { intent: LeadIntent; source: LeadSource; solution?: string; product?: string }
}

/** A planned internal link. `rendered: false` stays in the map and never becomes an anchor. */
export interface PlannedLink {
  label: string
  /** Where it will point once the target exists. Not a route type — it does not exist yet. */
  target: string
  reason: string
}

/** An image brief (§K). No file is referenced until production delivers one. */
export interface BlogImageBrief {
  /** `featured` or an in-article slot id. */
  id: string
  role: 'featured' | 'in-article'
  status: BlogImageStatus
  /** Diagram / product screenshot / editorial illustration / brand visual. */
  kind: string
  /** What the image must show. */
  shows: string
  /** Where it sits in the article. */
  placement: string
  /** Where the asset comes from. */
  source: string
  /** What must be masked before the asset can ship. */
  masking: string
  alt: string
  dimensions: string
  reusable: string
}

/**
 * Article metadata — the checkpoint's frontmatter, typed.
 *
 * Authored once, in `catalog.ts`. Bodies never restate any of it.
 */
export interface BlogArticleMeta {
  /** Stable editorial id, e.g. `GC-B01-01`. */
  id: string
  /** Legacy WordPress post id when this replaces one, otherwise null. */
  legacyPostId: number | null
  title: string
  slug: string
  /** Final URL. Root-level for URL-preserving rows, per the locked §D URL policy. */
  url: string
  status: BlogStatus
  author: string
  hub: BlogHubId
  /** Full hub name, for breadcrumbs and the archive. */
  hubLabel: string
  cluster: string
  primaryKeyword: string
  secondaryKeywords: readonly string[]
  searchIntent: BlogSearchIntent
  persona: string
  funnelStage: BlogFunnelStage
  contentTier: BlogTier
  seoTitle: string
  metaDescription: string
  /** Absolute canonical, built from SITE_ORIGIN at render time. */
  canonical: string
  /** Null until image production delivers the asset. Never a legacy file. */
  featuredImage: string | null
  featuredImageAlt: string
  productCta: readonly BlogCtaId[]
  claimStatus: BlogClaimStatus
  /** Target length band from the editorial system. */
  targetWordCount: string
  createdAt: string
  updatedAt: string
  /** One-sentence archive card summary. Not the meta description. */
  excerpt: string
}

/** The direct answer block (§E) — 40–80 words, rendered above the table of contents. */
export interface BlogDirectAnswer {
  question: string
  answer: string
}

/** Article body — lazily loaded, one module per article. */
export interface BlogArticleBody {
  /** Must match the catalog slug. Verified at build time by the registry. */
  slug: string
  directAnswer: BlogDirectAnswer
  /** Restricted Markdown. See `renderBody.tsx` for the supported subset. */
  body: string
  faq: readonly FaqItem[]
  images: readonly BlogImageBrief[]
  /** Links that will exist later. Recorded, never rendered. */
  plannedLinks?: readonly PlannedLink[]
}

/** Meta + body, assembled by the registry for the article page. */
export interface BlogArticle extends BlogArticleMeta {
  body: BlogArticleBody
}
