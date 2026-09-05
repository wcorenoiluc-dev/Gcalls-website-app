import {
  Building2,
  GraduationCap,
  Headphones,
  Landmark,
  ShieldCheck,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '@/config/sitemap'

/**
 * Industry → navigation icon.
 *
 * Keyed by the child route (the stable identity in `INDUSTRIES_HUB`), not by the
 * display title, so a copy edit never silently drops an icon. An icon here is a
 * WAYFINDING symbol only — never evidence of a product screen or a result.
 */
export const INDUSTRY_ICON: Record<string, LucideIcon> = {
  [ROUTES.education]: GraduationCap,
  [ROUTES.finance]: Landmark,
  [ROUTES.insurance]: ShieldCheck,
  [ROUTES.realEstate]: Building2,
  [ROUTES.ecommerce]: ShoppingCart,
  [ROUTES.bpo]: Headphones,
}
