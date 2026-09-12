import { Link } from 'react-router'
import { ROUTES } from '@/config/navigation'

const LOGO_SRC = '/brand/gcalls-logo-primary.png'
const LOGO_NATURAL_WIDTH = 389
const LOGO_NATURAL_HEIGHT = 129

type GcallsLogoVariant = 'header' | 'footer'

const VARIANT_WIDTH_CLASSES: Record<GcallsLogoVariant, string> = {
  // Mobile width first, desktop (md+) width second — both within the
  // approved ranges (header 118–130 / 137–150, footer 125–140 / 145–160).
  header: 'w-[124px] md:w-[143px]',
  footer: 'w-[132px] md:w-[152px]',
}

export function GcallsLogo({
  variant = 'header',
  src = LOGO_SRC,
}: {
  variant?: GcallsLogoVariant
  /** Content Studio override; falls back to the default asset on load failure. */
  src?: string
}) {
  return (
    <Link
      to={ROUTES.home}
      className="inline-flex items-center min-h-11 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#673ab7]"
      aria-label="Gcalls — về trang chủ"
    >
      <img
        src={src}
        alt="Gcalls"
        width={LOGO_NATURAL_WIDTH}
        height={LOGO_NATURAL_HEIGHT}
        className={`${VARIANT_WIDTH_CLASSES[variant]} h-auto object-contain`}
        onError={(event) => {
          const img = event.currentTarget
          if (img.src.endsWith(LOGO_SRC)) return
          img.src = LOGO_SRC
        }}
      />
    </Link>
  )
}
