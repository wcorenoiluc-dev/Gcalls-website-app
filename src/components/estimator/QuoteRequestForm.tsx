import { useId, useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { Card } from '@/components/common/primitives'
import { ROUTES } from '@/config/navigation'
import { track } from '@/lib/analytics'
import {
  LEAD_BACKEND_CONFIGURED,
  submitQuoteRequest,
  type QuoteRequestContact,
} from '@/lib/leads'
import type { EstimatorResultData } from '@/lib/estimate'

/**
 * Quote-request form.
 *
 * The estimator configuration travels with the submission, so a sales reply
 * has the full context without the visitor retyping it.
 *
 * Required: name, company, and at least one of email/phone. Client validation
 * is a convenience — whatever backend is connected must validate again.
 *
 * IMPORTANT: while no backend exists, the success state says the form is ready
 * to be connected. It never claims the request reached Gcalls.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s+().-]{8,20}$/

const empty: QuoteRequestContact = {
  name: '',
  company: '',
  email: '',
  phone: '',
  note: '',
}

export function QuoteRequestForm({ estimate }: { estimate: EstimatorResultData | null }) {
  const uid = useId()
  const [values, setValues] = useState<QuoteRequestContact>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteRequestContact | 'contact', string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [outcome, setOutcome] = useState<{ delivered: boolean; message: string } | null>(
    null,
  )

  const set = (key: keyof QuoteRequestContact, value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = () => {
    const next: typeof errors = {}

    if (!values.name.trim()) next.name = 'Vui lòng nhập họ và tên.'
    if (!values.company.trim()) next.company = 'Vui lòng nhập tên công ty.'

    const hasEmail = values.email.trim().length > 0
    const hasPhone = values.phone.trim().length > 0

    if (!hasEmail && !hasPhone) {
      next.contact = 'Vui lòng cung cấp email hoặc số điện thoại để Gcalls liên hệ.'
    }
    if (hasEmail && !EMAIL_RE.test(values.email.trim())) {
      next.email = 'Email chưa đúng định dạng.'
    }
    if (hasPhone && !PHONE_RE.test(values.phone.trim())) {
      next.phone = 'Số điện thoại chưa hợp lệ.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    const response = await submitQuoteRequest({
      contact: values,
      estimate,
      submittedAt: new Date().toISOString(),
      source: ROUTES.costEstimator,
    })
    setSubmitting(false)

    if (response.ok) {
      track('quote_request_submitted', {
        solution: estimate?.solutionId,
        delivered: response.delivered,
      })
      setOutcome({ delivered: response.delivered, message: response.message })
    }
  }

  const fieldBase =
    'min-h-12 w-full rounded-[10px] border border-brand-border bg-background px-4 text-base text-foreground transition-colors duration-150 focus:border-brand focus:outline-2 focus:outline-offset-0 focus:outline-brand'

  if (outcome) {
    return (
      <Card className="p-6 sm:p-8">
        <p className="flex items-center gap-2 text-lg font-extrabold text-foreground">
          <CheckCircle2 size={20} className="shrink-0 text-brand" aria-hidden="true" />
          {outcome.delivered ? 'Đã gửi yêu cầu' : 'Yêu cầu đã được ghi nhận trên trình duyệt'}
        </p>

        <p className="mt-3 text-base leading-relaxed text-muted-foreground" role="status">
          {outcome.message}
        </p>

        {!outcome.delivered && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Hệ thống tiếp nhận yêu cầu chưa được kết nối, nên thông tin chưa được gửi tới
            Gcalls. Vui lòng liên hệ trực tiếp qua email hoặc số điện thoại ở cuối trang.
          </p>
        )}
      </Card>
    )
  }

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-lg font-extrabold text-foreground sm:text-xl">
        Nhận báo giá chi tiết
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        Cấu hình bạn vừa chọn sẽ được gửi kèm để đội ngũ Gcalls chuẩn bị báo giá phù hợp.
      </p>

      {!LEAD_BACKEND_CONFIGURED && import.meta.env.DEV && (
        <p
          className="mt-4 rounded-[10px] border border-dashed border-brand/40 bg-brand-light px-4 py-3 text-sm leading-relaxed text-muted-foreground"
        >
          <span className="font-semibold text-brand">Đang phát triển · </span>
          Hệ thống tiếp nhận lead chưa được kết nối. Xem TODO trong{' '}
          <code>src/lib/leads.ts</code>.
        </p>
      )}

      <form className="mt-6 flex flex-col gap-5" onSubmit={onSubmit} noValidate>
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
              <p id={`${uid}-name-error`} role="alert" className="mt-2 text-sm font-medium text-[#d4183d]">
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
              <p id={`${uid}-company-error`} role="alert" className="mt-2 text-sm font-medium text-[#d4183d]">
                {errors.company}
              </p>
            )}
          </div>
        </div>

        <fieldset>
          <legend className="text-base font-bold text-foreground">
            Thông tin liên hệ <span className="text-[#d4183d]">*</span>
          </legend>
          <p className="mt-1 text-sm text-muted-foreground">
            Cung cấp ít nhất một trong hai.
          </p>

          <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-email`} className="block text-[15px] font-semibold text-foreground">
                Email
              </label>
              <input
                id={`${uid}-email`}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? `${uid}-email-error` : undefined}
                className={`${fieldBase} mt-2`}
              />
              {errors.email && (
                <p id={`${uid}-email-error`} role="alert" className="mt-2 text-sm font-medium text-[#d4183d]">
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
                type="tel"
                name="tel"
                autoComplete="tel"
                inputMode="tel"
                value={values.phone}
                onChange={(e) => set('phone', e.target.value)}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
                className={`${fieldBase} mt-2`}
              />
              {errors.phone && (
                <p id={`${uid}-phone-error`} role="alert" className="mt-2 text-sm font-medium text-[#d4183d]">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {errors.contact && (
            <p role="alert" className="mt-2 text-sm font-medium text-[#d4183d]">
              {errors.contact}
            </p>
          )}
        </fieldset>

        <div>
          <label htmlFor={`${uid}-note`} className="block text-base font-bold text-foreground">
            Ghi chú
          </label>
          <textarea
            id={`${uid}-note`}
            name="note"
            rows={4}
            value={values.note}
            onChange={(e) => set('note', e.target.value)}
            placeholder="Nhu cầu cụ thể, hệ thống đang dùng, thời điểm dự kiến triển khai…"
            className={`${fieldBase} mt-2 py-3`}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60 sm:w-auto sm:self-start"
        >
          <Send size={17} aria-hidden="true" />
          {submitting ? 'Đang gửi…' : 'Gửi yêu cầu báo giá'}
        </button>
      </form>
    </Card>
  )
}
