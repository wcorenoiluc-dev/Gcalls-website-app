import type { LeadContactFields } from './types'

/**
 * Client-side lead validation.
 *
 * This is a UX convenience. The server MUST validate again — a browser check
 * protects nobody. See docs/LEAD_CAPTURE_ARCHITECTURE.md §Security.
 */

/** Pragmatic: a local part, an @, a dot-bearing domain. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Deliberately permissive. Restricting to Vietnamese formats would reject
 * legitimate international prospects, which is worse than accepting a few
 * malformed numbers the sales team can sanity-check.
 */
const PHONE_RE = /^\+?[\d\s().-]{8,20}$/

export type LeadFieldErrors = Partial<
  Record<keyof LeadContactFields | 'contact', string>
>

export function validateLead(values: LeadContactFields): LeadFieldErrors {
  const errors: LeadFieldErrors = {}

  const name = values.name.trim()
  const company = values.company.trim()
  const email = values.email.trim()
  const phone = values.phone.trim()

  if (!name) errors.name = 'Vui lòng nhập họ và tên.'
  if (!company) errors.company = 'Vui lòng nhập tên doanh nghiệp.'

  if (!email && !phone) {
    errors.contact = 'Vui lòng cung cấp email hoặc số điện thoại.'
  }
  if (email && !EMAIL_RE.test(email)) {
    errors.email = 'Email chưa đúng định dạng.'
  }
  if (phone && !PHONE_RE.test(phone)) {
    errors.phone = 'Số điện thoại chưa đúng định dạng.'
  }

  return errors
}

export function isValid(errors: LeadFieldErrors): boolean {
  return Object.keys(errors).length === 0
}
