import type { ProductImage } from '@/data/productImages'

/**
 * Renders an approved product screenshot.
 *
 * Loading contract (checkpoint §F):
 *  - `priority` marks the one LCP image on a page. It loads eagerly, decodes
 *    synchronously and gets `fetchpriority="high"`.
 *  - `aboveFold` marks a companion image that is also visible without
 *    scrolling on wide screens. It loads eagerly but deliberately does NOT get
 *    `fetchpriority="high"` — that would make it compete with the real LCP
 *    image for bandwidth.
 *  - Everything else lazy-loads.
 *  - `width`/`height` always reach the DOM, so the browser reserves the right
 *    box before the bytes arrive and the layout does not shift.
 *  - The image is never allowed to exceed its own intrinsic width, so a
 *    screenshot is never upscaled into a blurry hero.
 *  - `max-w-full` + `h-auto` keeps it inside the column down to 320px.
 */
export function ProductScreenshot({
  image,
  priority = false,
  aboveFold = false,
  className = '',
  sizes,
}: {
  image: ProductImage
  /** Set on the single LCP image of a page. */
  priority?: boolean
  /** Visible without scrolling on wide screens, but not the LCP image. */
  aboveFold?: boolean
  className?: string
  sizes?: string
}) {
  const eager = priority || aboveFold
  return (
    <img
      src={image.src}
      width={image.width}
      height={image.height}
      alt={image.alt}
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={`block h-auto w-full rounded-xl border border-border/70 bg-white shadow-[0_8px_30px_rgba(31,17,71,0.10)] ${className}`}
      style={{ maxWidth: `${image.width}px` }}
    />
  )
}

/**
 * Art-directed pair: a desktop capture that is replaced by a genuinely
 * different portrait capture on small screens, rather than being shrunk until
 * its own UI text is unreadable.
 *
 * `<source media>` switches the file; the `<img>` carries the desktop
 * intrinsic size and the alt text for the composition as a whole.
 */
export function ProductScreenshotPicture({
  desktop,
  mobile,
  breakpoint = '640px',
  priority = false,
  className = '',
}: {
  desktop: ProductImage
  mobile: ProductImage
  /** Below this width the mobile capture is used. */
  breakpoint?: string
  priority?: boolean
  className?: string
}) {
  return (
    <picture>
      <source
        media={`(max-width: ${breakpoint})`}
        srcSet={mobile.src}
        width={mobile.width}
        height={mobile.height}
      />
      <img
        src={desktop.src}
        width={desktop.width}
        height={desktop.height}
        alt={desktop.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        className={`block h-auto w-full rounded-xl border border-border/70 bg-white shadow-[0_8px_30px_rgba(31,17,71,0.10)] ${className}`}
        style={{ maxWidth: `${desktop.width}px` }}
      />
    </picture>
  )
}
