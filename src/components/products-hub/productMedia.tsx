import type { ReactNode } from 'react'
import { ClipboardCheck, MessagesSquare, PhoneCall } from 'lucide-react'
import { ROUTES } from '@/config/navigation'
import {
  CxChannelsDiagram,
  QaQcPipelineDiagram,
  WebphoneCapture,
} from './productVisuals'

/**
 * One media slot per product on `/san-pham/`.
 *
 * ---------------------------------------------------------------------------
 * MEDIA PROVENANCE — WHY THE THREE SLOTS ARE NOT THE SAME KIND OF THING
 * ---------------------------------------------------------------------------
 * A hub card's visual has to help a visitor tell three products apart at a
 * glance. It must never overstate what exists, so each slot shows the strongest
 * asset actually approved AT THE BASE COMMIT, and no more:
 *
 *   Gcalls Plus  REAL CAPTURE. `gcalls-plus-webphone-desktop-v1.webp` — the
 *                webphone workspace, with contact list, customer profile, notes
 *                and keypad on one screen. Masked irreversibly before it
 *                entered the repo. Chosen over the overview-activity capture
 *                because that one is an empty state, which the brief rules out
 *                where a stronger capture exists. It carries no KPI tile.
 *
 *   QA QC Center NEUTRAL DIAGRAM. No QA/QC product capture exists — the image
 *                master map records the route as PRODUCT_SCREENSHOT_REQUIRED /
 *                NOT DELIVERED, "do not stage a fake scoring screen". The
 *                diagram states the pipeline the approved copy describes and is
 *                labelled "Sơ đồ quy trình minh họa".
 *
 *   Gcalls CX    NEUTRAL SLOT. No sanitized CX asset is committed at the base
 *                commit — `docs/screenshots/gcalls-cx/` holds 1440px-wide
 *                captures of the WEBSITE, not of the product. The CX checkpoint
 *                is still in progress in another worktree, and reading another
 *                worker's uncommitted files is out of bounds, so this stays a
 *                labelled channel diagram until a sanitized asset lands with a
 *                recorded hash.
 *
 * No Voicebot visual appears here: Voicebot is not a product at this hub.
 * ---------------------------------------------------------------------------
 */

export interface ProductMedia {
  /** Rendered inside the card's fixed-ratio media frame. */
  node: ReactNode
  /** Visible caption. Required on anything that is not a real capture. */
  label: string
  kind: 'capture' | 'diagram'
}

/**
 * Hero-tile glyphs.
 *
 * The hero tiles are small. An earlier version scaled the card media down into
 * that box and it rendered as unreadable mush — three grey smudges that helped
 * nobody tell the products apart, which is the one job the tiles have. A single
 * distinct glyph per product survives the size and reads instantly: a handset
 * for the calling channel, a checked clipboard for quality control, and stacked
 * conversations for the omnichannel inbox.
 */
export const PRODUCT_GLYPH: Record<string, typeof PhoneCall> = {
  [ROUTES.gcallsPlus]: PhoneCall,
  [ROUTES.qcCenter]: ClipboardCheck,
  [ROUTES.gcallsCx]: MessagesSquare,
}

/**
 * Media keyed by the product's ROUTE, not by array position or title.
 *
 * A route is the one identifier that cannot drift: renaming a card or
 * reordering `PRODUCTS_HUB.cards.items` must not silently give a product
 * another product's picture. A product with no entry renders no media frame
 * rather than borrowing one — `verify-products-hub.mjs` asserts all three
 * products resolve, and that no two cards share a visual.
 */
export const PRODUCT_MEDIA: Record<string, ProductMedia> = {
  [ROUTES.gcallsPlus]: {
    node: <WebphoneCapture />,
    label: 'Ảnh chụp thật, dữ liệu khách hàng đã được che vĩnh viễn',
    kind: 'capture',
  },
  [ROUTES.qcCenter]: {
    node: <QaQcPipelineDiagram />,
    label: 'Sơ đồ quy trình minh họa',
    kind: 'diagram',
  },
  [ROUTES.gcallsCx]: {
    node: <CxChannelsDiagram />,
    label: 'Sơ đồ quy trình minh họa',
    kind: 'diagram',
  },
}
