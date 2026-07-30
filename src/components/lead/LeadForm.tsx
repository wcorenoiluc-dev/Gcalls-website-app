import { useEffect, useId, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Mail, Phone, Send } from 'lucide-react'
import { Card } from '@/components/common/primitives'
import { CONTACT } from '@/config/navigation'
import { track } from '@/lib/analytics'
import { displayableLeadProduct } from '@/lib/leads/ctaLink'
import {
  LEAD_BACKEND_CONFIGURED,
  normalizeLeadPayload,
  submitLead,
  validateLead,
  isValid,
  type EstimatorLeadContext,
  type LeadContactFields,
  type LeadDeliveryResult,
  type LeadFieldErrors,
  type LeadIntent,
  type LeadSource,
  type LeadFormVariant,
  LEAD_NEEDS,
} from '@/lib/leads'

/**
 * The site's single lead form.
 *
 * Every conversion surface renders this — contact page, estimator quote,
 * product CTAs. No page implements its own submit logic or form markup.
 *
 * Behaviour that matters:
 *  - Success is shown ONLY on a confirmed `ok: true` from the transport. A
 *    missing backend produces a distinct, honest state, not a fake success.
 *  - Field values survive an error, so nobody retypes their details.
 *  - Double-submit is blocked while in flight and after success.
 *  - Analytics receives categorical context only; PII is stripped upstream.
 */

const empty: LeadContactFields = {
  name: '',
  company: '',
  email: '',
  phone: '',
  message: '',
  need: '',
}

const HEADINGS: Record<LeadFormVariant, { title: string; lead: string }> = {
  consultation: {
    title: 'Đăng ký tư vấn',
    lead: 'Chia sẻ nhu cầu hiện tại để đội ngũ Gcalls chuẩn bị trước khi trao đổi.',
  },
  quote: {
    title: 'Nhận báo giá',
    lead: 'Cung cấp thông tin liên hệ để Gcalls xác nhận phạm vi và gửi báo giá phù hợp.',
  },
  contact: {
    title: 'Gửi yêu cầu tư vấn',
    lead: 'Chia sẻ nhu cầu hiện tại để đội ngũ Gcalls có thêm thông tin trước khi trao đổi.',
  },
  estimator: {
    title: 'Nhận báo giá chi tiết',
    lead: 'Cấu hình bạn vừa chọn sẽ được gửi kèm để đội ngũ Gcalls chuẩn bị báo giá phù hợp.',
  },
}

export interface LeadFormProps {
  variant?: LeadFormVariant
  source: LeadSource
  intent: LeadIntent
  /** Approved product label, prefills the need select when it matches. */
  product?: string
  solution?: string
  initialMessage?: string
  estimatorResult?: EstimatorLeadContext
  /** Hides the heading block — for embedding under an existing heading. */
  compact?: boolean
}

export function LeadForm({
  variant = 'consultation',
  source,
  intent,
  product,
  solution,
  initialMessage = '',
  estimatorResult,
  compact = false,
}: LeadFormProps) {
  const uid = useId()
  const headings = HEADINGS[variant]

  /**
   * Pre-select the need from `product`, falling back to `solution`.
   *
   * The fallback matters for platform pages: `/tich-hop/hubspot/` sets
   * `product: 'HubSpot'` (the platform is the only thing the payload can carry
   * it in) and `solution: 'Tích hợp CRM'` (an approved LEAD_NEEDS value).
   * Resolving only `product ?? solution` would leave the select empty there.
   * Behaviour is unchanged for every caller that passes one or the other.
   */
  const needs = LEAD_NEEDS as readonly string[]
  const initialNeed =
    needs.find((n) => n === product) ?? needs.find((n) => n === solution) ?? ''

  /**
   * The product label, only if it is safe to display (see the helper).
   *
   * Suppressed when it duplicates the pre-selected "Nhu cầu", so a page that
   * passes one approved label does not say the same word twice.
   */
  const displayable = displayableLeadProduct(product)
  const shownProduct = displayable === initialNeed ? undefined : displayable

  const [values, setValues] = useState<LeadContactFields>({
    ...empty,
    need: initialNeed,
    message: initialMessage,
  })
  const [errors, setErrors] = useState<LeadFieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<LeadDeliveryResult | null>(null)
  const [startedTracked, setStartedTracked] = useState(false)

  /** Honeypot. Bots fill hidden inputs; humans never see this one. */
  const [botField, setBotField] = useState('')
  /** Render time — a submission faster than this is almost certainly scripted. */
  const mountedAt = useRef(Date.now())
  const MIN_FILL_MS = 2500

  const analyticsContext = {
    source,
    sourcePath: typeof window !== 'undefined' ? window.location.pathname : '',
    intent,
    product,
    solution,
  }

  useEffect(() => {
    track('lead_form_viewed', analyticsContext)
    // Fires once per mounted form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (key: keyof LeadContactFields, value: string) => {
    if (!startedTracked) {
      setStartedTracked(true)
      track('lead_form_started', analyticsContext)
    }
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
    if (key === 'email' || key === 'phone') {
      setErrors((e) => ({ ...e, contact: undefined }))
    }
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting || result?.ok) return

    const fieldErrors = validateLead(values)
    if (!isValid(fieldErrors)) {
      setErrors(fieldErrors)
      track('lead_form_validation_error', {
        ...analyticsContext,
        fields: Object.keys(fieldErrors).join(','),
      })
      return
    }

    // Silent bot rejection: report success-shaped UI to the bot without
    // sending anything, rather than teaching it which check it failed.
    const tooFast = Date.now() - mountedAt.current < MIN_FILL_MS
    if (botField.trim() !== '' || tooFast) {
      setResult({ ok: false, code: 'NOT_CONFIGURED', message: notConfiguredCopy })
      return
    }

    setSubmitting(true)
    track('lead_form_submitted', analyticsContext)

    const payload = normalizeLeadPayload({
      fields: values,
      intent,
      source,
      sourcePath: window.location.pathname,
      product,
      solution,
      estimatorResult,
    })

    const response = await submitLead(payload)
    setSubmitting(false)
    setResult(response)

    if (response.ok) {
      track('lead_form_success', analyticsContext)
      if (variant === 'estimator' || variant === 'quote') {
        track('quote_request_success', analyticsContext)
      }
    } else {
      track('lead_form_error', { ...analyticsContext, code: response.code })
      if (response.fieldErrors) setErrors(response.fieldErrors)
    }
  }

  const fieldBase =
    'min-h-12 w-full rounded-[10px] border border-brand-border bg-background px-4 text-base text-foreground transition-colors duration-150 focus:border-brand focus:outline-2 focus:outline-offset-0 focus:outline-brand'

  /* ── Confirmed success ───────────────────────────────────────── */
  if (result?.ok) {
    return (
      <Card className="p-6 sm:p-8">
        <div role="status" aria-live="polite">
          <p className="flex items-center gap-2 text-lg font-extrabold text-foreground">
            <CheckCircle2 size={20} className="shrink-0 text-brand" aria-hidden="true" />
            Đã nhận yêu cầu của bạn
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Đội ngũ Gcalls sẽ tiếp nhận thông tin và liên hệ để trao đổi về nhu cầu phù
            hợp.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 sm:p-8">
      {!compact && (
        <>
          <h2 className="text-lg font-extrabold text-foreground sm:text-xl">
            {headings.title}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            {headings.lead}
          </p>
        </>
      )}

      {/*
        Confirms WHAT the visitor clicked about.
        A CTA on a platform page (e.g. `/tich-hop/hubspot/`) carries the platform
        in `product`; without this the visitor lands on a generic form with no
        sign their HubSpot context survived. Allow-listed before rendering — an
        arbitrary `?product=` must not be able to write text onto the page.
      */}
      {shownProduct && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-light px-3.5 py-1.5 text-[13px] font-bold text-brand">
          Quan tâm: {shownProduct}
        </p>
      )}

      {/* Failure states. Distinct copy per cause — a missing backend is not
          the same thing as a server error, and saying so is the honest thing. */}
      {result && !result.ok && (
        <div
          role="alert"
          className="mt-5 rounded-[10px] border px-4 py-4"
          style={{ borderColor: 'rgba(212,24,61,0.28)', background: '#fef5f7' }}
        >
          <p className="flex items-start gap-2 text-[15px] font-semibold text-foreground">
            <AlertCircle size={17} className="mt-0.5 shrink-0 text-[#d4183d]" aria-hidden="true" />
            {result.message}
          </p>

          <ul className="mt-3 flex flex-col gap-1 pl-6">
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Mail size={15} aria-hidden="true" />
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.phoneHref}
                className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Phone size={15} aria-hidden="true" />
                {CONTACT.phone}
              </a>
            </li>
          </ul>
        </div>
      )}

      {!LEAD_BACKEND_CONFIGURED && import.meta.env.DEV && (
        <p className="mt-5 rounded-[10px] border border-dashed border-brand/40 bg-brand-light px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-brand">Đang phát triển · </span>
          Chưa có transport nhận lead (VITE_LEAD_API_URL trống). Xem{' '}
          <code>docs/LEAD_CAPTURE_ARCHITECTURE.md</code>.
        </p>
      )}

      <form className="mt-6 flex flex-col gap-5" onSubmit={onSubmit} noValidate>
        {/* Honeypot — visually and programmatically hidden from humans. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={`${uid}-website`}>Website</label>
          <input
            id={`${uid}-website`}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
          />
        </div>

        {/* Name + company: stacked at 390px, 2-up from sm. */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-name`} className="block text-base font-bold text-foreground">
              Họ và tên <span className="text-[#d4183d]">*</span>
            </label>
            <input
              id={`${uid}-name`}
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(e) => set('name', e.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? `${uid}-name-error` : undefined}
              className={`${fieldBase} mt-2`}
            />
            {errors.name && (
              <p id={`${uid}-name-error`} role="alert" className="mt-2 break-words text-sm font-medium text-[#d4183d]">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={`${uid}-company`} className="block text-base font-bold text-foreground">
              Công ty <span className="text-[#d4183d]">*</span>
            </label>
            <input
              id={`${uid}-company`}
              name="organization"
              autoComplete="organization"
              value={values.company}
              onChange={(e) => set('company', e.target.value)}
              aria-invalid={errors.company ? true : undefined}
              aria-describedby={errors.company ? `${uid}-company-error` : undefined}
              className={`${fieldBase} mt-2`}
            />
            {errors.company && (
              <p id={`${uid}-company-error`} role="alert" className="mt-2 break-words text-sm font-medium text-[#d4183d]">
                {errors.company}
              </p>
            )}
          </div>
        </div>

        {/* Email / phone stay stacked until sm — never side by side at 390px. */}
        <fieldset>
          <legend className="text-base font-bold text-foreground">
            Thông tin liên hệ <span className="text-[#d4183d]">*</span>
          </legend>
          <p className="mt-1 text-sm text-muted-foreground">Cung cấp ít nhất một trong hai.</p>

          <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-email`} className="block text-[15px] font-semibold text-foreground">
                Email
              </label>
              <input
                id={`${uid}-email`}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? `${uid}-email-error` : undefined}
                className={`${fieldBase} mt-2`}
              />
              {errors.email && (
                <p id={`${uid}-email-error`} role="alert" className="mt-2 break-words text-sm font-medium text-[#d4183d]">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`${uid}-phone`} className="block text-[15px] font-semibold text-foreground">
                Số điện thoại
              </label>
              <input
                id={`${uid}-phone`}
                name="tel"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(e) => set('phone', e.target.value)}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
                className={`${fieldBase} mt-2`}
              />
              {errors.phone && (
                <p id={`${uid}-phone-error`} role="alert" className="mt-2 break-words text-sm font-medium text-[#d4183d]">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {errors.contact && (
            <p role="alert" className="mt-2 break-words text-sm font-medium text-[#d4183d]">
              {errors.contact}
            </p>
          )}
        </fieldset>

        <div>
          <label htmlFor={`${uid}-need`} className="block text-base font-bold text-foreground">
            Nhu cầu
          </label>
          <select
            id={`${uid}-need`}
            name="need"
            value={values.need}
            onChange={(e) => set('need', e.target.value)}
            className={`${fieldBase} mt-2`}
          >
            <option value="">— Chọn —</option>
            {LEAD_NEEDS.map((need) => (
              <option key={need} value={need}>
                {need}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${uid}-message`} className="block text-base font-bold text-foreground">
            Nội dung
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={4}
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder="Quy mô đội ngũ, hệ thống đang dùng, thời điểm dự kiến triển khai…"
            className={`${fieldBase} mt-2 py-3`}
          />
        </div>

        {/* Estimator configuration travels with the lead — the visitor never
            retypes what they already selected. */}
        {estimatorResult && (
          <p className="rounded-[10px] bg-brand-light px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-brand">Kèm cấu hình: </span>
            {estimatorResult.selectedSolution}
            {estimatorResult.agents ? ` · ${estimatorResult.agents} Agent` : ''}
            {estimatorResult.usage ? ` · ${estimatorResult.usage}` : ''}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60 sm:w-auto sm:self-start"
        >
          <Send size={17} aria-hidden="true" />
          {submitting ? 'Đang gửi...' : headings.title}
        </button>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Thông tin được sử dụng để Gcalls liên hệ và tư vấn theo yêu cầu của bạn.
        </p>
      </form>
    </Card>
  )
}

const notConfiguredCopy =
  'Biểu mẫu hiện chưa được kết nối hệ thống tiếp nhận. Vui lòng liên hệ Gcalls qua email hoặc hotline.'
