/**
 * Shared shapes for the six `/tai-nguyen/…` pages — Checkpoint WEB-RES-001.
 *
 * Routes: /blog/ · /tai-nguyen/guides/ · /tai-nguyen/case-studies/ ·
 * /tai-nguyen/ebook/ · /tai-nguyen/glossary/ · /tai-nguyen/faq/
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT ONE CONTENT TYPE
 * ---------------------------------------------------------------------------
 * `ResourcePageBase` fixes only the parts every resource page genuinely shares
 * — hero, purpose and audience, onward routing, closing CTA — and each page
 * then extends it with the sections that are actually its own. A glossary and a
 * case-study index do not have the same body, and flattening them into one
 * renderer would produce six pages that read identically. The shared base is
 * what enforces the required order; the extensions are what keep the pages
 * different.
 *
 * The resource NAVIGATION is deliberately absent from this type: it is the same
 * six links on every page and lives in `./index.ts`, so a page cannot ship with
 * a stale copy of it.
 *
 * ---------------------------------------------------------------------------
 * FABRICATION GUARD — READ BEFORE EDITING
 * ---------------------------------------------------------------------------
 * These pages are an editorial FOUNDATION. This repository holds no approved
 * article, no approved customer evidence and no ebook file, and nothing below
 * may pretend otherwise. Specifically forbidden anywhere in `src/data/resources/*`:
 *
 *  · Article titles, authors, publication dates, reading times, view counts,
 *    thumbnails or placeholder article cards. No `Article` or `BlogPosting`
 *    schema may be emitted while no article exists.
 *  · Case studies, customer quotes, customer metrics, deployment timelines or
 *    customer logos. VinUniversity, VinaCapital and Kingsport appear in a
 *    supplied planning source and are NOT published here — a name in a
 *    planning deck is not a customer's permission to be named.
 *  · Ebook titles, cover images, download buttons or lead-magnet forms while
 *    no approved file exists.
 *  · `Review`, `Rating`, `AggregateRating`, `Product` and `Offer` schema.
 *
 * Where a page would otherwise show an inventory, it shows an honest state
 * instead — `ResourceStatus` below — which says plainly what does not exist yet
 * and routes the reader to pages that do.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD
 * ---------------------------------------------------------------------------
 * These pages inherit every guard already established in `src/data/industries/types.ts`
 * and the product data files, and add nothing to the evidence base. WITHHELD
 * throughout: every ROI, productivity, saving, coverage, stability and timeline
 * figure from the supplied planning sources ("2.5%", "30–50%", "40%", "50–90%",
 * "100% cuộc gọi", "1.200 giờ", "cài đặt trong 30 phút", "triển khai trong một
 * ngày"), plus Auto Dialer / Auto Call as an available Gcalls capability, plus
 * Voice Brandname as a universal or guaranteed one, plus any count of
 * countries, integrations, customers or years.
 *
 * The glossary is the one place several of those terms are allowed to appear at
 * all, and only because a glossary DEFINES an industry concept rather than
 * asserting Gcalls sells it. See the rule at the head of `./glossary.ts`.
 */

import type { RoutePath } from '@/config/navigation'
import type { FaqItem } from '@/components/common/FaqAccordion'
import type { LeadCtaContext } from '@/lib/leads/ctaLink'

/** An internal link. `path` is `RoutePath`, so a link to a route that does not
 * exist in the registry is a type error rather than a 404 found in QA. */
export interface ResourceLink {
  label: string
  path: RoutePath
}

/** A plain title + body card. */
export interface ResourceItem {
  title: string
  detail: string
}

/** A card that routes somewhere real. */
export interface ResourceRoutingCard extends ResourceItem {
  path: RoutePath
  cta: string
}

export interface ResourceHero {
  eyebrow: string
  h1: string
  description: string
  /** Always routed through the shared lead architecture. */
  primaryCta: { label: string }
  /** In-page anchor into this page's own body. Must match a rendered id. */
  secondaryCta: { label: string; href: string }
  microcopy: string
}

/** Purpose and audience — required section 2 on every resource page. */
export interface ResourcePurpose {
  eyebrow: string
  h2: string
  description: string
  audience: readonly ResourceItem[]
  note: string
}

/**
 * The honest state a page shows where an inventory would otherwise go.
 *
 * `description` must say plainly what does not exist yet. `links` must point at
 * pages that are actually complete, because the whole purpose of this block is
 * to send a reader who arrived expecting content somewhere useful instead of
 * showing them a grid of fake cards.
 */
export interface ResourceStatus {
  eyebrow: string
  h2: string
  description: string
  /** What is true today, stated as plain facts. */
  points: readonly string[]
  linksHeading: string
  links: readonly ResourceLink[]
  note: string
}

/** Onward routing — required section 5. */
export interface ResourceRouting {
  eyebrow: string
  h2: string
  description: string
  items: readonly ResourceRoutingCard[]
}

/** The single conversion action — required section 6. */
export interface ResourceFinalCta {
  eyebrow: string
  h2: string
  description: string
  primaryCta: { label: string; path: RoutePath }
}

/**
 * What every resource page has, in the order it must appear.
 *
 * `ResourcePageLayout` renders these around the page-specific body, so the
 * order is enforced by the layout rather than by six independent page files
 * each remembering it.
 */
export interface ResourcePageBase {
  /** Used for element ids and the JSON-LD node id. */
  id: string
  route: RoutePath
  breadcrumbLabel: string
  /** Conversion context carried by every CTA on the page. */
  lead: LeadCtaContext
  hero: ResourceHero
  purpose: ResourcePurpose
  routing: ResourceRouting
  /**
   * Optional because the FAQ page's own body IS its questions — giving it a
   * second FAQ block would duplicate them in the DOM and break the exact
   * match the FAQPage JSON-LD depends on.
   */
  faq?: readonly FaqItem[]
  finalCta: ResourceFinalCta
}

/* ------------------------------------------------------------------ *
 * Blog
 * ------------------------------------------------------------------ */

/**
 * An editorial category.
 *
 * `topics` are the subjects the category WILL cover, written as subjects and
 * never as article titles — "cách tổ chức luồng tiếp nhận cuộc gọi đến" is a
 * subject; "5 cách tối ưu IVR cho doanh nghiệp SME" is a fabricated headline.
 */
export interface BlogCategory {
  id: string
  title: string
  detail: string
  topics: readonly string[]
  links: readonly ResourceLink[]
}

export interface BlogContent extends ResourcePageBase {
  categories: {
    eyebrow: string
    h2: string
    description: string
    /** Target of the hero's secondary CTA. */
    anchorId: string
    items: readonly BlogCategory[]
    note: string
  }
  status: ResourceStatus
}

/* ------------------------------------------------------------------ *
 * Guides
 * ------------------------------------------------------------------ */

/**
 * An operational journey.
 *
 * The four required parts — the question, who it is for, what to assess, where
 * to go next — are all non-optional, because a guide card missing any of them
 * degrades into a link with a heading on top of it.
 */
export interface GuidePath {
  id: string
  n: string
  /** The operational question, phrased the way a reader would ask it. */
  question: string
  title: string
  /** Who this path is for. */
  audience: string
  /** What the reader should assess. This is the substance of the guide. */
  checkpoints: readonly string[]
  /** Related existing Gcalls pages. */
  related: readonly ResourceLink[]
  nextAction: { label: string; path: RoutePath }
}

export interface GuidesContent extends ResourcePageBase {
  paths: {
    eyebrow: string
    h2: string
    description: string
    anchorId: string
    items: readonly GuidePath[]
    note: string
  }
  status: ResourceStatus
}

/* ------------------------------------------------------------------ *
 * Case studies
 * ------------------------------------------------------------------ */

/** A filter dimension. Structure only — it filters nothing yet, and says so. */
export interface CaseFilterDimension {
  id: string
  title: string
  detail: string
  /** Example values, drawn from routes and concepts that already exist here. */
  values: readonly string[]
}

/** One line of the evidence checklist. */
export interface EvidenceRequirement {
  n: string
  title: string
  detail: string
}

export interface CaseStudiesContent extends ResourcePageBase {
  whyEvidence: {
    eyebrow: string
    h2: string
    description: string
    items: readonly ResourceItem[]
    note: string
  }
  filters: {
    eyebrow: string
    h2: string
    description: string
    anchorId: string
    items: readonly CaseFilterDimension[]
    note: string
  }
  standard: {
    eyebrow: string
    h2: string
    description: string
    /** Target of the hero's secondary CTA. */
    anchorId: string
    items: readonly EvidenceRequirement[]
    note: string
  }
  status: ResourceStatus
}

/* ------------------------------------------------------------------ *
 * Ebook
 * ------------------------------------------------------------------ */

/**
 * A topic pathway.
 *
 * `title` is a SUBJECT AREA, never a book title, and `contents` are the
 * questions such a document would answer. Nothing here may look like a
 * published cover.
 */
export interface EbookTopic {
  id: string
  title: string
  detail: string
  contents: readonly string[]
  links: readonly ResourceLink[]
}

export interface EbookContent extends ResourcePageBase {
  topics: {
    eyebrow: string
    h2: string
    description: string
    anchorId: string
    items: readonly EbookTopic[]
    note: string
  }
  standard: {
    eyebrow: string
    h2: string
    description: string
    items: readonly ResourceItem[]
    note: string
  }
  status: ResourceStatus
}

/* ------------------------------------------------------------------ *
 * Glossary
 * ------------------------------------------------------------------ */

export interface GlossaryTerm {
  /** ASCII kebab-case. Becomes the heading's anchor id. */
  id: string
  term: string
  /** Alternative names a reader may search for. */
  aka?: readonly string[]
  /**
   * The concept itself, explained without reference to Gcalls. This comes
   * FIRST, and it is what makes the page worth reading rather than an
   * advertisement with definitions attached.
   */
  definition: string
  /**
   * How the term relates to Gcalls. Optional, always qualified, and never a
   * statement that a proposed capability is universally available.
   */
  gcallsNote?: string
  /** Only where a completed page genuinely owns the topic. */
  link?: ResourceLink
}

export interface GlossaryGroup {
  id: string
  label: string
  description: string
  terms: readonly GlossaryTerm[]
}

export interface GlossaryContent extends ResourcePageBase {
  index: {
    eyebrow: string
    h2: string
    description: string
    anchorId: string
  }
  groups: readonly GlossaryGroup[]
  note: string
}

/* ------------------------------------------------------------------ *
 * FAQ
 * ------------------------------------------------------------------ */

export interface FaqGroup {
  id: string
  label: string
  description: string
  items: readonly FaqItem[]
}

export interface FaqContent extends ResourcePageBase {
  index: {
    eyebrow: string
    h2: string
    description: string
    anchorId: string
  }
  groups: readonly FaqGroup[]
  note: string
}
