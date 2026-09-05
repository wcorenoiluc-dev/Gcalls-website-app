import type { ProductImage } from '@/data/productImages'

/**
 * External browser frame for a sanitized Gcalls CX screenshot crop.
 *
 * The application pixels are NOT repainted with a Gcalls logo — the source is
 * the owner's contact-center product and product equivalence is still
 * `GCALLS_CX_BRANDING_DECISION_REQUIRED`. Instead the frame is external: a
 * restrained browser chrome whose caption reads "Gcalls CX", plus a small
 * "Dữ liệu minh hoạ" chip that stays readable without dominating the visual.
 *
 * The image never exceeds its own intrinsic width (no upscale), and `width`/
 * `height` reach the DOM so the box is reserved before the bytes arrive.
 */
export function CxScreenshotFrame({
  image,
  caption = 'Gcalls CX',
  priority = false,
  className = '',
}: {
  image: ProductImage
  caption?: string
  priority?: boolean
  className?: string
}) {
  return (
    <figure
      className={`mx-auto overflow-hidden rounded-[14px] border border-border/70 bg-white shadow-[0_10px_34px_rgba(31,17,71,0.10)] ${className}`}
      style={{ maxWidth: `${image.width}px` }}
    >
      <div className="flex items-center gap-2 border-b border-border/60 bg-[#f6f5fa] px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e2666b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e7b04e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#69b578]" />
        </span>
        <span className="ml-1 truncate text-[11px] font-semibold text-muted-foreground">
          {caption}
        </span>
        <span className="ml-auto shrink-0 rounded-full bg-black/65 px-2 py-0.5 text-[9px] font-medium tracking-wide text-white/90">
          Dữ liệu minh hoạ
        </span>
      </div>
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        className="block h-auto w-full bg-white"
      />
    </figure>
  )
}
