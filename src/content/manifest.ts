/**
 * Builds `content-manifest.json` (docs/content-studio/CONTRACT-0.2.0.md §1).
 *
 * Executed by wordpress/scripts/generate-content-manifest.mjs under Node,
 * never bundled into the browser app. The route list and its ORDER come from
 * routes.json (the React Shell's canonical 38-route contract) — nothing here
 * hard-codes a route count. Page labels come from src/config/sitemap.ts.
 *
 * Pages 01–09 are editable and carry their sections; every other page is
 * listed read-only with the review label, so the admin shows all routes in
 * the canonical order.
 */
import { getEntry } from '@/config/sitemap'
import { PII_BLOCKED_IMAGE_FILENAMES } from './piiBlocked'
import { inferFields, validateDefaults } from './infer'
import { HOME_SECTIONS } from './sections/home'
import { PRODUCTS_SECTIONS } from './sections/products'
import { GCALLS_PLUS_SECTIONS } from './sections/gcallsPlus'
import { QC_BOT_AI_SECTIONS } from './sections/qcBotAi'
import { GCALLS_CX_SECTIONS } from './sections/gcallsCx'
import { VOICEBOT_SECTIONS } from './sections/voicebotAi'
import { SOLUTIONS_SECTIONS } from './sections/solutions'
import { CRM_SECTIONS } from './sections/crmIntegration'
import { HELPDESK_SECTIONS } from './sections/helpdeskIntegration'
import {
  EDITABLE_STATUS_LABEL,
  MANIFEST_VERSION,
  REVIEW_STATUS_LABEL,
  SCHEMA_VERSION,
  type ContentManifest,
  type ManifestPage,
  type ManifestSection,
  type SectionDef,
} from './types'

export interface RouteEntry {
  key: string
  path: string
}

/** Editable pages by routes.json key → their section definitions. */
const EDITABLE: Record<string, SectionDef[]> = {
  home: HOME_SECTIONS,
  products: PRODUCTS_SECTIONS,
  gcallsPlus: GCALLS_PLUS_SECTIONS,
  qcCenter: QC_BOT_AI_SECTIONS,
  gcallsCx: GCALLS_CX_SECTIONS,
  voicebotAi: VOICEBOT_SECTIONS,
  solutions: SOLUTIONS_SECTIONS,
  crmIntegration: CRM_SECTIONS,
  helpdeskIntegration: HELPDESK_SECTIONS,
}

/** Deep-clones plain data so `as const`/readonly objects serialise as fresh JSON. */
function plain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function buildSection(def: SectionDef, order: number, where: string): ManifestSection {
  const fields = inferFields(def.defaults, def.fields)
  const problems = validateDefaults(fields, def.defaults)
  if (problems.length) {
    throw new Error(`content manifest: ${where}/${def.key}: ${problems.join('; ')}`)
  }
  return {
    key: def.key,
    label: def.label,
    order,
    previewSelector: def.previewSelector,
    fields,
    defaults: plain(def.defaults) as Record<string, unknown>,
  }
}

export function buildManifest(routes: RouteEntry[]): ContentManifest {
  const pages: ManifestPage[] = routes.map((route, order) => {
    const entry = getEntry(route.path)
    const defs = EDITABLE[route.key]
    const editable = Array.isArray(defs)
    const seen = new Set<string>()
    const sections = editable
      ? defs.map((def, i) => {
          if (seen.has(def.key)) throw new Error(`content manifest: duplicate section key ${route.key}/${def.key}`)
          seen.add(def.key)
          return buildSection(def, i, route.key)
        })
      : []
    return {
      key: route.key,
      path: route.path,
      label: entry?.label ?? route.path,
      order,
      status: editable ? 'editable' : 'review',
      statusLabel: editable ? EDITABLE_STATUS_LABEL : REVIEW_STATUS_LABEL,
      sections,
    }
  })

  for (const key of Object.keys(EDITABLE)) {
    if (!routes.some((r) => r.key === key)) {
      throw new Error(`content manifest: editable page "${key}" is not in routes.json`)
    }
  }

  return {
    manifestVersion: MANIFEST_VERSION,
    schemaVersion: SCHEMA_VERSION,
    blockedMedia: [...PII_BLOCKED_IMAGE_FILENAMES],
    pages,
  }
}
