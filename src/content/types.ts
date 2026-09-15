/**
 * Content manifest types — the shared contract between the React Shell build
 * (which GENERATES `content-manifest.json`) and Gcalls Content Studio (which
 * READS it). See docs/content-studio/CONTRACT-0.2.0.md §1.
 */

export const MANIFEST_VERSION = 2
export const SCHEMA_VERSION = 2

export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'url'
  | 'ctaLabel'
  | 'select'
  | 'toggle'
  | 'image'
  | 'imageAlt'
  | 'decorative'
  | 'checklist'
  | 'repeater'
  | 'cards'
  | 'testimonials'

export interface SelectOption {
  value: string
  label: string
}

export interface Field {
  type: FieldType
  label: string
  help?: string
  required?: boolean
  maxLen?: number
  maxItems?: number
  options?: SelectOption[]
  /** Item schema for repeater/cards/testimonials. Never contains list types. */
  item?: Record<string, Field>
}

export type FieldMap = Record<string, Field>

/**
 * Per-field overrides an author may declare beside `defaults`: a full Field
 * replaces inference; a partial one (e.g. `{ label }` or `{ type: 'richtext' }`)
 * is merged over the inferred field. `item` overrides nest the same way.
 */
export type FieldOverride = Partial<Omit<Field, 'item'>> & {
  item?: Record<string, Partial<Field>>
}
export type FieldOverrides = Record<string, FieldOverride>

export interface ContentImage {
  id: number
  url: string
  width: number
  height: number
  filename: string
}

export interface SectionDef<T extends object = object> {
  key: string
  label: string
  previewSelector: string
  /** The React default content object — referenced, never copied. */
  defaults: T
  /** Optional inference overrides (labels, richtext, help, select options). */
  fields?: FieldOverrides
}

export interface ManifestSection {
  key: string
  label: string
  order: number
  previewSelector: string
  fields: FieldMap
  defaults: Record<string, unknown>
}

export type PageStatus = 'editable' | 'review'

export interface ManifestPage {
  key: string
  path: string
  label: string
  order: number
  status: PageStatus
  statusLabel: string
  sections: ManifestSection[]
}

export interface ContentManifest {
  manifestVersion: number
  schemaVersion: number
  blockedMedia: string[]
  pages: ManifestPage[]
}

export const REVIEW_STATUS_LABEL = 'Đang kiểm tra giao diện'
export const EDITABLE_STATUS_LABEL = 'Có thể chỉnh sửa'
