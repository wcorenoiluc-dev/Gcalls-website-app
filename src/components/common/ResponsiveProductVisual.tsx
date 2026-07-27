import type { CSSProperties, ReactNode } from 'react'

/**
 * Responsive product-visual system.
 *
 * The Figma Make baseline composes every product visual the same way: a wide
 * mockup card with 3–4 stat badges absolutely positioned on top of it using
 * negative offsets (`left: -52px`, `right: -40px`, …) and small rotations.
 * That composition is correct at desktop and collapses below it — at 390px the
 * badges overlapped the mockup and each other, and content was clipped.
 *
 * These helpers keep the desktop composition byte-for-byte identical and
 * change only what happens below `lg`:
 *
 *   Desktop (lg+)   main mockup + all supporting badges, overlapping as designed
 *   Tablet (md–lg)  main mockup + at most one supporting badge
 *   Mobile (<md)    no overlap at all — mockup full width, badges reflowed
 *                   into a simple two-column card grid beneath it
 *
 * Implementation note: the desktop offsets live in inline `style` props in the
 * original code, and inline styles beat class selectors. The `max-lg:` classes
 * below therefore carry Tailwind v4's `!` important suffix so the mobile rules
 * win. Nothing is duplicated in the DOM — there is one tree, restyled.
 */

/**
 * Stage wrapper — replaces the `relative` container that holds a mockup and
 * its floating badges.
 *
 * Below `lg` it becomes a two-column grid so badges reflow into cards; the
 * baseline's `minHeight` (sized for the desktop overlap) is neutralised.
 */
export const stageClass =
  'relative ' +
  'max-lg:grid! max-lg:grid-cols-2! max-lg:gap-3! max-lg:min-h-0! max-lg:items-start!'

/** Main mockup wrapper — full width and full span below `lg`. */
export const stageMainClass =
  'relative w-full max-lg:col-span-2! max-lg:max-w-none!'

/**
 * Floating badge wrapper.
 *
 * Below `lg`: dropped out of absolute positioning, un-rotated, and allowed to
 * size itself as a grid cell.
 */
export const stageFloatClass =
  'absolute ' +
  'max-lg:static! max-lg:w-auto! max-lg:min-w-0! max-lg:max-w-none! ' +
  'max-lg:transform-none! max-lg:z-auto!'

/**
 * Floating wrapper for a supporting visual that is itself a full mockup card
 * (not a small stat badge).
 *
 * Two-column reflow would squeeze these to ~187px at 390px and clip their
 * internals, so below `lg` they take the full stage width and stack instead.
 */
export const stageFloatFullClass =
  'absolute ' +
  'max-lg:static! max-lg:col-span-2! max-lg:w-full! max-lg:min-w-0! max-lg:max-w-none! ' +
  'max-lg:transform-none! max-lg:z-auto!'

/** Hide a supporting visual on mobile only (tablet keeps at most one). */
export const hideOnMobileClass = 'max-md:hidden!'

/**
 * Hide a supporting visual on everything below `lg`.
 *
 * Used where the desktop composition stacks several full mockups: at tablet
 * and below only the main mockup plus one supporting visual are kept, per the
 * responsive image rules.
 */
export const hideBelowLgClass = 'max-lg:hidden!'

interface ResponsiveProductVisualProps {
  /** The primary mockup. */
  main: ReactNode
  /** Supporting badges/cards rendered over the mockup at desktop. */
  floats?: Array<{
    key: string
    node: ReactNode
    /** Desktop-only position, exactly as in the baseline. */
    style: CSSProperties
    /** Drop this one on mobile to keep the stack short. */
    hideOnMobile?: boolean
  }>
  /** Desktop stage height, e.g. "560px". Neutralised below `lg`. */
  minHeight?: string
  /** Desktop max width for the main mockup, e.g. "540px". */
  mainMaxWidth?: string
  className?: string
}

export function ResponsiveProductVisual({
  main,
  floats = [],
  minHeight,
  mainMaxWidth,
  className = '',
}: ResponsiveProductVisualProps) {
  return (
    <div
      className={`${stageClass} ${className}`}
      style={minHeight ? { minHeight } : undefined}
    >
      <div className={stageMainClass} style={mainMaxWidth ? { maxWidth: mainMaxWidth } : undefined}>
        {main}
      </div>

      {floats.map((float) => (
        <div
          key={float.key}
          className={`${stageFloatClass} ${float.hideOnMobile ? hideOnMobileClass : ''}`}
          style={float.style}
        >
          {float.node}
        </div>
      ))}
    </div>
  )
}

/**
 * Vertical stack for mobile-only visual sequences — use when visuals must
 * read in order rather than as a grid.
 */
export function MobileVisualStack({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-4 lg:contents ${className}`}>{children}</div>
  )
}

/**
 * Wrapper for real raster screenshots.
 *
 * Enforces the §17 rules — `max-width: 100%`, `height: auto`, never a fixed
 * desktop width on mobile — and preserves aspect ratio so a wide dashboard is
 * not scaled until its internal text is microscopic.
 *
 * The site currently ships zero <img> elements (all visuals are inline SVG /
 * DOM), so this is the intended entry point when real screenshots land.
 */
export function ResponsiveScreenshot({
  src,
  alt,
  aspectRatio,
  className = '',
  priority = false,
}: {
  src: string
  alt: string
  /** e.g. "16 / 10" — reserves space and prevents layout shift. */
  aspectRatio?: string
  className?: string
  priority?: boolean
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`block w-full max-w-full h-auto ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    />
  )
}
