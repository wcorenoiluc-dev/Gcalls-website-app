import { ArrowRight, Quote } from 'lucide-react'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'
import { CtaLink } from '@/components/common/Button'
import { GP_STORY } from '@/data/gcallsPlus'
import { TESTIMONIALS } from '@/data/testimonials'

/**
 * Trust / customer section — three published testimonials.
 *
 * Content comes from `src/data/testimonials.ts` (verbatim from the public
 * Gcalls site, source URL + retrieval date recorded there). No logo or
 * headshot is rendered: none is approved, so each card carries a text
 * monogram of the company name. No metric is added that the source does not
 * contain. The CTA goes to the Case Studies hub, a canonical route.
 */
export function CustomerStory() {
  return (
    <Section tinted ariaLabelledBy="cau-chuyen-khach-hang">
      <Container>
        <SectionHeader
          eyebrow={GP_STORY.eyebrow}
          eyebrowIcon={<Quote size={14} aria-hidden="true" />}
          title={GP_STORY.h2}
          titleId="cau-chuyen-khach-hang"
          lead={GP_STORY.lead}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3" data-testimonial-list>
          {TESTIMONIALS.map((t) => (
            <Card as="li" key={t.id} className="flex h-full flex-col p-6">
              <figure className="flex h-full flex-col" data-testimonial={t.id}>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light"
                  aria-hidden="true"
                >
                  <Quote size={16} className="text-brand" />
                </span>

                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
                  <p>“{t.quote}”</p>
                </blockquote>

                <figcaption className="mt-5 flex items-center gap-3 border-t border-border/70 pt-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-extrabold text-brand"
                    style={{ background: '#ede8f9' }}
                    aria-hidden="true"
                  >
                    {t.monogram}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-foreground">{t.representative}</span>
                    <span className="block text-[13px] leading-snug text-muted-foreground">
                      {t.role} · {t.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Card>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <CtaLink to={GP_STORY.cta.path} variant="outline">
            {GP_STORY.cta.label}
            <ArrowRight size={18} aria-hidden="true" />
          </CtaLink>
        </div>
      </Container>
    </Section>
  )
}
