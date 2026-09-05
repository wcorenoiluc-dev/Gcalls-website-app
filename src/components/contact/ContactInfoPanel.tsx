import { Check, Mail, Phone } from 'lucide-react'
import { GradientHeading } from '@/components/common/primitives'
import { CONTACT } from '@/config/navigation'
import { displayableLeadProduct } from '@/lib/leads/ctaLink'

/**
 * Left column of `/lien-he/` — the single H1, the page's purpose, the two direct
 * channels (always visible, real links), a short "what helps us advise" list and
 * an optional attribution line.
 *
 * Content is sourced, not invented:
 *  - H1 "Liên hệ" and the lead paragraph come from the approved sitemap entry
 *    (`intro`), passed in by the page so this component holds no page copy.
 *  - The "helpful info" bullets are the exact hints already in the shared lead
 *    form's message placeholder — no new claim, and deliberately NO response-time
 *    or SLA promise (none is approved).
 *  - Attribution is gated through `displayableLeadProduct`: only an allow-listed
 *    label ever renders, so a crafted `?product=` cannot write text onto the page.
 */
export function ContactInfoPanel({
  intro,
  product,
}: {
  intro: string
  product?: string
}) {
  const attributed = displayableLeadProduct(product)

  return (
    <div className="flex flex-col">
      <GradientHeading as="h1">Liên hệ</GradientHeading>

      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
        {intro}
      </p>

      {attributed && (
        <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand-light px-3.5 py-1.5 text-[13px] font-bold text-brand">
          Bạn đang quan tâm: {attributed}
        </p>
      )}

      {/* Direct channels — always available regardless of form state. */}
      <div className="mt-7 flex flex-col gap-2">
        <a
          href={`mailto:${CONTACT.email}`}
          aria-label={`Gửi email tới Gcalls: ${CONTACT.email}`}
          className="inline-flex min-h-12 w-fit items-center gap-2.5 rounded-[10px] text-base font-semibold text-foreground transition-colors duration-150 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-brand-light text-brand"
            aria-hidden="true"
          >
            <Mail size={18} />
          </span>
          {CONTACT.email}
        </a>
        <a
          href={CONTACT.phoneHref}
          aria-label={`Gọi hotline Gcalls: ${CONTACT.phone}`}
          className="inline-flex min-h-12 w-fit items-center gap-2.5 rounded-[10px] text-base font-semibold text-foreground transition-colors duration-150 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-brand-light text-brand"
            aria-hidden="true"
          >
            <Phone size={18} />
          </span>
          {CONTACT.phone}
        </a>
      </div>

      {/* What helps Gcalls advise more accurately — hints only, no promise. */}
      <div className="mt-8 border-t border-brand-border pt-6">
        <p className="text-[15px] font-bold text-foreground">
          Chia sẻ thêm để Gcalls tư vấn sát hơn
        </p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {['Quy mô đội ngũ', 'Hệ thống đang sử dụng', 'Thời điểm dự kiến triển khai'].map(
            (item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-light"
                  aria-hidden="true"
                >
                  <Check size={12} className="text-brand" strokeWidth={3} />
                </span>
                <span className="text-[15px] leading-relaxed text-muted-foreground">{item}</span>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  )
}
