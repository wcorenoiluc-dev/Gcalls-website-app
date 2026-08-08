/**
 * Shared shapes for the two `/cong-ty/…` pages — Checkpoint WEB-COMPANY-001.
 *
 * Routes: /cong-ty/khach-hang/ · /cong-ty/doi-tac/
 *
 * ---------------------------------------------------------------------------
 * WHY THESE TWO ARE NOT ONE CONTENT TYPE
 * ---------------------------------------------------------------------------
 * `CompanyPageBase` fixes only what both pages genuinely share — hero, purpose
 * and audience, onward routing, the honest state block, the closing CTA — and
 * each page extends it with its own body. A page about who Gcalls serves and a
 * page about how a partnership would be assessed answer different questions,
 * and flattening them into one renderer would produce two pages that say the
 * same thing twice.
 *
 * ---------------------------------------------------------------------------
 * PERMISSION GUARD — READ BEFORE EDITING
 * ---------------------------------------------------------------------------
 * These two pages are the ones a marketing site normally fills with logos. This
 * repository holds NO permission record for any customer or partner name, so
 * neither page publishes one. Specifically forbidden anywhere in
 * `src/data/company/*`:
 *
 *  · Customer names. VinUniversity, VinaCapital and Kingsport appear in a
 *    supplied planning source; a name in a planning deck is not consent to be
 *    named, and none of them may be published here in any form — including a
 *    text-only "logo" substitute, an initial, or an unnamed description
 *    specific enough to identify them.
 *  · Customer logos, testimonials, deployment stories, metrics, or industries
 *    and results inferred from a name.
 *  · Any statement that a named platform is an official, certified, technology,
 *    strategic or premier partner, an authorised reseller, or a preferred
 *    vendor; that an integration is "native"; or that compatibility is
 *    universal. Platform integration is a technical fact and establishes no
 *    commercial relationship.
 *  · Third-party logos of any kind, absent an approved asset and a permission
 *    record.
 *  · `Review`, `Rating`, `AggregateRating`, `Product`, `Offer` schema, and any
 *    `Organization` node asserting a relationship with an unverified customer
 *    or partner.
 *
 * Platform NAMES may be written in body copy where the repository already
 * supports the statement — every one of the five named platforms has a
 * completed integration page — and only in the approved register: "có thể tích
 * hợp với…", "phạm vi tích hợp phụ thuộc API, gói dịch vụ và yêu cầu triển
 * khai", "được đánh giá trong quá trình khảo sát kỹ thuật".
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD
 * ---------------------------------------------------------------------------
 * Inherits every guard in `src/data/industries/types.ts` and
 * `src/data/resources/types.ts`. WITHHELD here as everywhere: every ROI,
 * productivity, saving, coverage and timeline figure from the planning sources,
 * and in particular any promise of deployment "in 30 minutes" or "within one
 * day" — the working model below describes phases, never durations.
 */

import type { ReactNode } from 'react'
import type { RoutePath } from '@/config/navigation'
import type { FaqItem } from '@/components/common/FaqAccordion'
import type { LeadCtaContext } from '@/lib/leads/ctaLink'

/** An internal link. `RoutePath` makes a link to a non-existent route a type error. */
export interface CompanyLink {
  label: string
  path: RoutePath
}

/** A plain title + body card. */
export interface CompanyItem {
  title: string
  detail: string
}

/** A card that routes somewhere real. */
export interface CompanyRoutingCard extends CompanyItem {
  path: RoutePath
  cta: string
}

/** A numbered step in a sequence. */
export interface CompanyStep {
  n: string
  title: string
  detail: string
}

export interface CompanyHero {
  eyebrow: string
  h1: string
  description: string
  /** Always routed through the shared lead architecture. */
  primaryCta: { label: string }
  /** In-page anchor into this page's own body. Must match a rendered id. */
  secondaryCta: { label: string; href: string }
  microcopy: string
}

/** Purpose and audience — required section on both pages. */
export interface CompanyPurpose {
  eyebrow: string
  h2: string
  description: string
  audience: readonly CompanyItem[]
  note: string
}

/**
 * An approved third-party mark.
 *
 * DELIBERATELY EMPTY EVERYWHERE, and the reason it exists as a type at all is
 * to make the permission gate explicit rather than implicit: a future logo wall
 * needs an approved asset path AND a permission record, and this shape refuses
 * to be populated without both. `CompanyStatusSection` renders nothing when the
 * array is absent or empty, so there is no placeholder frame, no grey box and
 * no empty carousel in the meantime.
 */
export interface ApprovedLogo {
  /** Legal name exactly as the permission record grants it. */
  name: string
  /** Repository-relative asset path. No hotlinking a third party's CDN. */
  assetPath: string
  /** Where the permission is recorded, e.g. a signed agreement reference. */
  permissionRecord: string
}

/**
 * The honest state block.
 *
 * `description` must say plainly what does not exist yet, and `links` must
 * point at pages that are actually complete — the whole purpose of this block
 * is to send a reader who arrived expecting a customer wall or a partner
 * directory somewhere useful instead of showing them fabricated cards.
 */
export interface CompanyStatus {
  eyebrow: string
  h2: string
  description: string
  points: readonly string[]
  linksHeading: string
  links: readonly CompanyLink[]
  note: string
  /** See `ApprovedLogo`. Nothing renders while this is absent or empty. */
  approvedLogos?: readonly ApprovedLogo[]
}

export interface CompanyRouting {
  eyebrow: string
  h2: string
  description: string
  items: readonly CompanyRoutingCard[]
}

export interface CompanyFinalCta {
  eyebrow: string
  h2: string
  description: string
  primaryCta: { label: string; path: RoutePath }
}

/**
 * What both company pages have, in the order it must appear.
 *
 * `CompanyPageLayout` renders these around the page-specific body, so the order
 * is enforced in one place rather than re-remembered per page.
 */
export interface CompanyPageBase {
  /** Used for element ids and the JSON-LD node id. */
  id: string
  route: RoutePath
  breadcrumbLabel: string
  /** Conversion context carried by every CTA on the page. */
  lead: LeadCtaContext
  hero: CompanyHero
  purpose: CompanyPurpose
  /**
   * The TRAILING routing section, rendered after the honest state block.
   * Customers uses it for industry routing, Partners for integration and
   * product routes. A page whose body also needs a routing grid earlier on
   * declares its own field for that — see `CustomersContent.pathways`.
   */
  routing: CompanyRouting
  status: CompanyStatus
  faq: readonly FaqItem[]
  finalCta: CompanyFinalCta
}

/**
 * Optional hero visual.
 *
 * Wired but unfilled, exactly as `IndustryHero` is: no customer or partner
 * imagery exists in this repository, and generating one would be a fabricated
 * screenshot. Passing a node switches the hero to two columns; passing nothing
 * leaves today's single column untouched — there is no empty frame either way.
 */
export type CompanyHeroVisual = ReactNode

/* ------------------------------------------------------------------ *
 * Customers
 * ------------------------------------------------------------------ */

/**
 * An operational profile.
 *
 * Profiles replace the customer wall. They describe HOW a team works, never WHO
 * it is, which is what a visitor comparing themselves to existing customers
 * actually needs — and unlike a logo grid it requires nobody's permission.
 */
export interface CustomerProfile {
  id: string
  n: string
  title: string
  detail: string
  /** What tends to matter operationally for this profile. */
  signals: readonly string[]
  links: readonly CompanyLink[]
}

export interface CustomersContent extends CompanyPageBase {
  serves: {
    eyebrow: string
    h2: string
    description: string
    items: readonly CompanyItem[]
    note: string
  }
  profiles: {
    eyebrow: string
    h2: string
    description: string
    /** Target of the hero's secondary CTA. */
    anchorId: string
    items: readonly CustomerProfile[]
    note: string
  }
  problems: {
    eyebrow: string
    h2: string
    description: string
    items: readonly CompanyItem[]
    note: string
  }
  /** Solution routing, rendered inside the body rather than at the foot. */
  pathways: CompanyRouting
  workingModel: {
    eyebrow: string
    h2: string
    description: string
    steps: readonly CompanyStep[]
    /** Mandatory. States that phases are not a fixed timetable. */
    note: string
  }
  evidenceStandard: {
    eyebrow: string
    h2: string
    description: string
    items: readonly CompanyItem[]
    /** Deep link into the case-study evidence methodology. */
    methodologyLink: { label: string; path: string }
    note: string
  }
}

/* ------------------------------------------------------------------ *
 * Partners
 * ------------------------------------------------------------------ */

/**
 * A prospective partnership category.
 *
 * `examples` describe the KIND of organisation the category covers. They must
 * never name an organisation Gcalls has a relationship with, because no such
 * relationship is evidenced here.
 */
export interface PartnerCategory {
  id: string
  title: string
  detail: string
  examples: readonly string[]
  links: readonly CompanyLink[]
}

/**
 * A collaboration model.
 *
 * `availability` is required and is the honest half of the card: these models
 * are described conditionally because not all of them are open today, and a
 * card that omitted the condition would read as an offer.
 */
export interface PartnerModel {
  title: string
  detail: string
  availability: string
}

export interface PartnersContent extends CompanyPageBase {
  why: {
    eyebrow: string
    h2: string
    description: string
    items: readonly CompanyItem[]
    note: string
  }
  categories: {
    eyebrow: string
    h2: string
    description: string
    /** Target of the hero's secondary CTA. */
    anchorId: string
    items: readonly PartnerCategory[]
    note: string
  }
  models: {
    eyebrow: string
    h2: string
    description: string
    items: readonly PartnerModel[]
    note: string
  }
  principles: {
    eyebrow: string
    h2: string
    description: string
    items: readonly CompanyStep[]
    note: string
  }
  journey: {
    eyebrow: string
    h2: string
    description: string
    steps: readonly CompanyStep[]
    note: string
  }
  /** Integration is not partnership. The page says so in its own section. */
  clarification: {
    eyebrow: string
    h2: string
    description: string
    items: readonly CompanyItem[]
    note: string
  }
}
