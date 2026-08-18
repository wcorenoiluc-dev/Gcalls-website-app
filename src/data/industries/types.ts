/**
 * Shared shape for the six industry pages — Checkpoint WEB-IND-001.
 *
 * Routes: /nganh/giao-duc/ · /nganh/tai-chinh/ · /nganh/bao-hiem/ ·
 * /nganh/bat-dong-san/ · /nganh/thuong-mai-dien-tu/ · /nganh/bpo/
 *
 * ---------------------------------------------------------------------------
 * CONTENT HIERARCHY — EVERY PAGE, SAME ORDER
 * ---------------------------------------------------------------------------
 * The section order below is the approved hierarchy and is enforced by the
 * shape of this interface, not by convention:
 *
 *   1. `problem`    — the customer's operational problem, in their words
 *   2. `impact`     — what that costs the business
 *   3. `capability` — what Gcalls actually does about it
 *   4. `workflow`   — how it lands in the process the team already runs
 *   5. `outcomes`   — carefully qualified expected value
 *   6. `routing` + `finalCta` — where to go next, and the one conversion action
 *
 * A page that leads with a feature list instead of a problem is wrong for this
 * site, regardless of how good the feature list is.
 *
 * ---------------------------------------------------------------------------
 * ONE PRIMARY ICP PER PAGE
 * ---------------------------------------------------------------------------
 * Each industry file names its primary ICP and at most ONE secondary ICP in its
 * header comment. Blending three or more produces a page that describes nobody:
 * the whole reason these are separate routes is that the operating context
 * differs. Do not add a third.
 *
 * ---------------------------------------------------------------------------
 * CLAIM GUARD — READ BEFORE EDITING
 * ---------------------------------------------------------------------------
 * These pages inherit every guard already established elsewhere in this
 * repository, and add nothing to the evidence base. Specifically WITHHELD on
 * all six pages:
 *
 *  · AUTO DIALER / AUTO CALL and outbound number rotation. `src/data/gcallsCx.ts`
 *    records the scope decision: no product config, no estimator field, no
 *    scope-document entry exists, so the capability is not published. The ICP
 *    source names it; these pages therefore describe the PROBLEM it addresses
 *    and route to consultation, and never assert the mechanism.
 *  · VOICE BRANDNAME as an available, universal or guaranteed capability.
 *    The capability IS documented in supplied Gcalls material, so it is not
 *    unsourced — WEB-IND-001A classifies it `SOURCE-DOCUMENTED — PRODUCT SCOPE
 *    CONFIRMATION REQUIRED`. What is missing is operational scope: no carrier
 *    list, market coverage or approval record exists in this repository, and
 *    `src/data/internationalCalling.ts` withholds brandname outright for
 *    international numbers. The e-commerce page therefore scopes it to
 *    domestic numbers, conditions it on carrier approval, and promises no
 *    answer-rate effect. See that file's header for the three conditions.
 *  · "70+ quốc gia", "30+ tích hợp", "1.000+ khách hàng", "10+ năm" and every
 *    other count already withheld by the hub and international claim guards.
 *  · EVERY numeric outcome from the ICP source: "tăng 2.5%", "tăng 30–50% năng
 *    suất", "tăng 40% tỷ lệ nghe máy", "tiết kiệm 50–80%", "chi phí hạ tầng
 *    bằng 0", "mở chi nhánh trong 5 phút".
 *  · Any statement that AI replaces staff, is perfectly accurate, or reviews
 *    100% of calls.
 *
 * Required register instead: "có thể", "tùy phạm vi triển khai", "theo cấu
 * hình", "được khảo sát trong quá trình tư vấn", "phụ thuộc hệ thống hiện tại",
 * "mục tiêu thường được đặt ra".
 *
 * Every withheld claim is tagged `NEEDS_GCALLS_VERIFICATION` at the point in
 * the content where it would otherwise have appeared, so the next person can
 * see exactly what is waiting on product confirmation rather than guessing.
 */

import type { RoutePath } from '@/config/navigation'
import type { FaqItem } from '@/components/common/FaqAccordion'
import type { LeadCtaContext } from '@/lib/leads/ctaLink'

/** A numbered problem or workflow card. */
export interface IndustryNumberedItem {
  n: string
  title: string
  detail: string
}

/** A plain title + body card. */
export interface IndustryItem {
  title: string
  detail: string
}

/**
 * A capability card.
 *
 * `path` is optional on purpose: a capability that has its own page links to
 * it, and one that does not simply does not link. Inventing a destination to
 * make the grid look uniform is how dead CTAs get shipped.
 */
export interface IndustryCapability extends IndustryItem {
  path?: RoutePath
  linkLabel?: string
}

/** A routing card at the foot of the page. */
export interface IndustryRoutingCard extends IndustryItem {
  path: RoutePath
  cta: string
}

export interface IndustryContent {
  /** Used for element ids, the JSON-LD node and the lazy route key. */
  id: string
  route: RoutePath
  breadcrumbLabel: string
  /** Conversion context carried by every CTA on the page. */
  lead: LeadCtaContext

  hero: {
    eyebrow: string
    h1: string
    description: string
    primaryCta: { label: string }
    /** In-page anchor. Must match `capability.anchorId`. */
    secondaryCta: { label: string; href: string }
    microcopy: string
  }

  /** 1 — the operational problem. */
  problem: {
    eyebrow: string
    h2: string
    description: string
    items: readonly IndustryNumberedItem[]
  }

  /** 2 — what it costs the business. */
  impact: {
    eyebrow: string
    h2: string
    description: string
    items: readonly IndustryItem[]
  }

  /** 3 — what Gcalls does about it. */
  capability: {
    eyebrow: string
    h2: string
    description: string
    /** Target of the hero's secondary CTA. */
    anchorId: string
    items: readonly IndustryCapability[]
    note: string
  }

  /** 4 — how it fits the existing workflow. */
  workflow: {
    eyebrow: string
    h2: string
    description: string
    steps: readonly IndustryNumberedItem[]
  }

  /** 5 — qualified expected value. Never a promise. */
  outcomes: {
    eyebrow: string
    h2: string
    description: string
    items: readonly IndustryItem[]
    /** Mandatory. States plainly that these are targets, not commitments. */
    note: string
  }

  /** 6a — where to go next. */
  routing: {
    eyebrow: string
    h2: string
    description: string
    items: readonly IndustryRoutingCard[]
  }

  faq: readonly FaqItem[]

  /** 6b — the single conversion action. */
  finalCta: {
    eyebrow: string
    h2: string
    description: string
    primaryCta: { label: string; path: RoutePath }
  }
}
