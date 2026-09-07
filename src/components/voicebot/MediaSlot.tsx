import type { ReactNode } from 'react'
import { Info } from 'lucide-react'

/**
 * Page-local media slot for `/voicebot-ai/`.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS AND NOT `ProductVisual`
 * ---------------------------------------------------------------------------
 * The repository holds NO real Voicebot screenshot. Every Voicebot visual is
 * therefore an illustrative diagram until a real, PII-cleared capture arrives.
 * This slot reserves a STABLE 16:10 box on desktop so that swapping the
 * fallback diagram for a real image later causes NO layout shift, and it
 * always prints a visible classification — `Sơ đồ quy trình minh họa` or
 * `Ảnh giao diện sản phẩm` — so a reader can never mistake a diagram for a
 * real product screen. The shared `ProductVisual` frame carries neither the
 * fixed ratio nor the classification, and it is a shared component this track
 * is not allowed to modify.
 *
 * Mobile: full width, natural height (the diagram flows), so it stays readable
 * down to 320px. Desktop (`lg+`): fixed 16:10, content fills the box.
 * ---------------------------------------------------------------------------
 */

export type MediaClassification = 'Sơ đồ quy trình minh họa' | 'Ảnh giao diện sản phẩm'

export function VoicebotMediaSlot({
  classification,
  src,
  alt = '',
  maxWidth = '560px',
  children,
}: {
  classification: MediaClassification
  /** Real image source. When absent, the fallback diagram (`children`) renders. */
  src?: string
  alt?: string
  maxWidth?: string
  /** Fallback diagram, shown until a real image `src` exists. */
  children?: ReactNode
}) {
  const isImage = classification === 'Ảnh giao diện sản phẩm'

  return (
    <div className="w-full lg:mx-auto" style={{ maxWidth: `min(100%, ${maxWidth})` }}>
      <div className="relative w-full overflow-hidden rounded-[18px] border border-brand-border bg-white shadow-[0_18px_50px_rgba(103,58,183,0.13)] lg:aspect-[16/10]">
        {src ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full lg:absolute lg:inset-0 lg:h-full lg:w-full lg:object-cover"
          />
        ) : (
          <div className="flex w-full items-center justify-center px-4 pb-4 pt-11 sm:px-6 sm:pb-6 sm:pt-12 lg:absolute lg:inset-0 lg:p-6">
            {children}
          </div>
        )}

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-brand shadow-sm backdrop-blur-sm">
          {classification}
        </span>
      </div>

      <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
        <Info size={14} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
        {isImage
          ? 'Ảnh giao diện sản phẩm.'
          : 'Sơ đồ quy trình minh họa — không phải ảnh chụp hệ thống đang vận hành.'}
      </p>
    </div>
  )
}
