import { ImageOff } from 'lucide-react'

/**
 * Stand-in for a product screenshot that is deliberately not shipped.
 *
 * A handful of "approved" Gcalls Plus captures turned out to leak a real
 * account tag or other identifying value that their mask missed — see
 * `PII_BLOCKED_IMAGE_FILENAMES` in vite.config.wordpress.ts and
 * `docs/content-review/images/product-media-manifest.json` (GCALLS-032).
 * The safe response to "this asset cannot ship" is not an `<img>` pointed at
 * a URL that will 404 — visitors saw exactly that broken-image icon before
 * this component existed. This renders a clearly-labelled, self-contained
 * placeholder instead, sized like the screenshot it replaces so the section
 * layout is unaffected, until an owner-approved re-masked capture exists.
 */
export function ProductScreenshotPlaceholder({
  width,
  height,
  label = 'Ảnh minh hoạ đang được cập nhật',
  className = '',
}: {
  width: number
  height: number
  label?: string
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-muted/40 text-center ${className}`}
      style={{ maxWidth: `${width}px`, aspectRatio: `${width} / ${height}` }}
    >
      <ImageOff size={28} className="text-muted-foreground/60" aria-hidden="true" />
      <p className="max-w-[220px] px-4 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
