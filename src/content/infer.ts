import type { Field, FieldMap, FieldOverrides, FieldType } from './types'

/**
 * Infers a Content Studio field schema from a section's default content, so
 * the schema is never hand-written twice (once in TypeScript, once in PHP).
 *
 * Rules (docs/content-studio/CONTRACT-0.2.0.md §1):
 *   string            → text; ≥ 120 chars → textarea;
 *                       key /url|href|path$/i → url; key /label$/i → ctaLabel
 *   boolean           → toggle
 *   string[]          → checklist
 *   object[]          → repeater (item schema inferred from the first item;
 *                       nested arrays are NOT declared — see mergeKnown, which
 *                       keeps the default's nested list for such items)
 *   {id,url,width,height} or null → image
 *   plain object      → flattened with dotted keys? NO — nested objects are
 *                       declared as their own fields with a dotted key so the
 *                       admin can edit `primaryCta.label` etc.
 *
 * Overrides may replace or refine any inferred field.
 */

const TEXTAREA_THRESHOLD = 120
const URL_KEY = /(url|href|path)$/i
const LABEL_KEY = /label$/i

/** Turns a camelCase / dotted key into a readable Vietnamese-friendly label. */
export function humanizeKey(key: string): string {
  const last = key.split('.').pop() ?? key
  const words = last
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
  const dictionary: Record<string, string> = {
    eyebrow: 'Nhãn nhỏ (eyebrow)',
    badge: 'Nhãn (badge)',
    h1: 'Tiêu đề chính (H1)',
    h2: 'Tiêu đề (H2)',
    heading: 'Tiêu đề',
    'heading highlight': 'Phần nhấn mạnh của tiêu đề',
    'heading tail': 'Phần cuối tiêu đề',
    description: 'Mô tả',
    lead: 'Đoạn dẫn',
    question: 'Câu hỏi',
    answer: 'Câu trả lời',
    label: 'Nhãn nút',
    title: 'Tiêu đề',
    detail: 'Chi tiết',
    desc: 'Mô tả',
    points: 'Các ý',
    items: 'Danh sách',
    steps: 'Các bước',
    note: 'Ghi chú',
    quote: 'Trích dẫn',
    role: 'Vai trò',
    company: 'Công ty',
    representative: 'Người đại diện',
    'primary cta': 'Nút chính',
    'secondary cta': 'Nút phụ',
    cta: 'Nút kêu gọi hành động',
    caption: 'Chú thích',
  }
  if (dictionary[words]) return dictionary[words]
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function isImageLike(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const v = value as Record<string, unknown>
  return typeof v.id === 'number' && typeof v.url === 'string' && typeof v.width === 'number' && typeof v.height === 'number'
}

function inferScalar(key: string, value: unknown): Field | null {
  if (typeof value === 'string') {
    if (URL_KEY.test(key)) return { type: 'url', label: humanizeKey(key), maxLen: 500 }
    if (LABEL_KEY.test(key)) return { type: 'ctaLabel', label: humanizeKey(key), maxLen: 80 }
    if (value.length >= TEXTAREA_THRESHOLD) return { type: 'textarea', label: humanizeKey(key), maxLen: 1200 }
    return { type: 'text', label: humanizeKey(key), maxLen: 240 }
  }
  if (typeof value === 'boolean') return { type: 'toggle', label: humanizeKey(key) }
  if (value === null || isImageLike(value)) return { type: 'image', label: humanizeKey(key) }
  return null
}

/** Item schema for a repeater: scalar fields of the first item only (nested lists/objects are skipped by contract). */
function inferItemSchema(first: Record<string, unknown>, overrides?: Record<string, Partial<Field>>): Record<string, Field> {
  const item: Record<string, Field> = {}
  for (const [k, v] of Object.entries(first)) {
    const scalar = inferScalar(k, v)
    if (!scalar) continue
    item[k] = { ...scalar, ...(overrides?.[k] ?? {}) } as Field
  }
  return item
}

function inferField(key: string, value: unknown, override?: FieldOverrides[string]): Field | null {
  let field: Field | null = null

  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === 'string')) {
      field = { type: 'checklist', label: humanizeKey(key), maxItems: Math.max(value.length + 4, 8), maxLen: 200 }
    } else if (value.length > 0 && value.every((v) => v && typeof v === 'object' && !Array.isArray(v))) {
      field = {
        type: 'repeater',
        label: humanizeKey(key),
        maxItems: Math.max(value.length + 4, 8),
        item: inferItemSchema(value[0] as Record<string, unknown>, override?.item),
      }
    } else {
      return null
    }
  } else {
    field = inferScalar(key, value)
  }
  if (!field) return null
  if (override) {
    const { item, ...rest } = override
    field = { ...field, ...rest } as Field
    if (item && field.item) {
      for (const [k, o] of Object.entries(item)) {
        if (field.item[k]) field.item[k] = { ...field.item[k], ...o } as Field
      }
    }
  }
  return field
}

/**
 * Builds the field map for a section. Nested plain objects (e.g. `primaryCta:
 * { label, path }`) are declared with dotted keys (`primaryCta.label`), which
 * both the admin UI and PHP treat as a path into the section object.
 */
export function inferFields(defaults: object, overrides: FieldOverrides = {}): FieldMap {
  const out: FieldMap = {}
  const walk = (obj: Record<string, unknown>, prefix: string) => {
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k
      if (v && typeof v === 'object' && !Array.isArray(v) && !isImageLike(v)) {
        walk(v as Record<string, unknown>, key)
        continue
      }
      const field = inferField(k, v, overrides[key])
      if (field) {
        // Prefix-aware labels: "primaryCta.label" → "Nút chính · Nhãn nút".
        if (!overrides[key]?.label && prefix) {
          field.label = `${humanizeKey(prefix.split('.').pop() ?? prefix)} · ${field.label}`
        }
        out[key] = field
      }
    }
  }
  walk(defaults as Record<string, unknown>, '')
  return out
}

/** Reads a dotted key from an object. */
export function getPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined), obj)
}

/**
 * Validates that every declared field has a default of the right shape.
 * Returns human-readable problems; empty when valid.
 */
export function validateDefaults(fields: FieldMap, defaults: object): string[] {
  const problems: string[] = []
  for (const [key, field] of Object.entries(fields)) {
    const value = getPath(defaults, key)
    const t: FieldType = field.type
    const ok = (() => {
      switch (t) {
        case 'text':
        case 'textarea':
        case 'richtext':
        case 'url':
        case 'ctaLabel':
        case 'imageAlt':
        case 'select':
          return typeof value === 'string'
        case 'toggle':
        case 'decorative':
          return typeof value === 'boolean'
        case 'image':
          return value === null || isImageLike(value)
        case 'checklist':
          return Array.isArray(value) && value.every((v) => typeof v === 'string')
        case 'repeater':
        case 'cards':
        case 'testimonials':
          return Array.isArray(value) && value.every((v) => v && typeof v === 'object')
      }
    })()
    if (!ok) problems.push(`${key}: default does not match type ${t}`)
    if (t === 'select' && field.options && !field.options.some((o) => o.value === value)) {
      problems.push(`${key}: default "${String(value)}" is not one of the select options`)
    }
  }
  return problems
}
