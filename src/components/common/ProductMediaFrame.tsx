import { useState, type ReactNode } from 'react'
import { Info, MonitorSmartphone } from 'lucide-react'
import type { ProductImage } from '@/data/productImages'

/**
 * The one frame every product visual on a product page sits in.
 *
 * Contract (Page 03 polish, React Shell 0.3.5):
 *  - the frame owns the box: explicit `aspectRatio`, `maxWidth`, `maxHeight`,
 *    `overflow: hidden`, padding — a child can never escape it, overlap the
 *    neighbouring column, or stretch;
 *  - an approved capture is rendered `object-fit: contain`, never scaled past
 *    its intrinsic width, never cropped;
 *  - a code-native mockup fills the frame at its own natural size and is
 *    clipped, not squeezed, if it is taller than `maxHeight`;
 *  - if a capture fails to load the frame does NOT go blank or show a broken
 *    icon — it swaps to a labelled neutral panel so the layout holds;
 *  - the caption is the single approved string passed in by the section's
 *    media contract, rendered once, below the frame.
 *
 * Nothing here is absolutely positioned outside the frame. Desktop keeps the
 * frame inside its grid column; below `lg` the frame is simply full-width and
 * stacks under the copy (DOM order is copy → visual everywhere).
 */
export function ProductMediaFrame({
  children,
  caption,
  aspectRatio = '16 / 10',
  /** Responsive Tailwind aspect classes (e.g. "aspect-square sm:aspect-[4/3]"); overrides `aspectRatio`. */
  aspectClassName,
  maxWidth = '600px',
  maxHeight = '460px',
  padded = true,
  label,
  className = '',
}: {
  children: ReactNode
  caption: string
  /** CSS aspect-ratio of the visible box. */
  aspectRatio?: string
  aspectClassName?: string
  maxWidth?: string
  maxHeight?: string
  /** Inner padding so a capture never touches the frame edge. */
  padded?: boolean
  /** Accessible name for a code-native mockup (captures carry their own alt). */
  label?: string
  className?: string
}) {
  return (
    <figure className={`m-0 w-full lg:mx-auto ${className}`} style={{ maxWidth: `min(100%, ${maxWidth})` }}>
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-border/70 bg-white shadow-[0_18px_50px_rgba(31,17,71,0.12)] ${
          padded ? 'p-3 sm:p-4' : ''
        } ${aspectClassName ?? ''}`}
        style={{ aspectRatio: aspectClassName ? undefined : aspectRatio, maxHeight }}
        role={label ? 'img' : undefined}
        aria-label={label}
        data-product-media-frame
      >
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
          {children}
        </div>
      </div>
      <figcaption className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
        <Info size={14} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
        {caption}
      </figcaption>
    </figure>
  )
}

/**
 * An approved, masked capture inside the frame. Contained, never stretched;
 * falls back to a neutral labelled panel instead of a broken image.
 */
export function FramedCapture({
  image,
  priority = false,
}: {
  image: ProductImage
  priority?: boolean
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-surface-alt text-center"
        role="img"
        aria-label={image.alt}
      >
        <MonitorSmartphone size={28} className="text-brand" aria-hidden="true" />
        <p className="max-w-[260px] px-4 text-sm text-muted-foreground">Giao diện mô phỏng</p>
      </div>
    )
  }

  return (
    <img
      src={image.src}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailed(true)}
      /* Pinned to the clipped inner box: an inset-positioned element always
         sizes to its containing block, whereas a percentage height inside an
         aspect-ratio box did not resolve and let the portrait capture grow
         past the frame. Contained, never cropped or stretched. */
      className="absolute inset-0 m-auto block max-h-full max-w-full rounded-xl"
      style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
    />
  )
}
