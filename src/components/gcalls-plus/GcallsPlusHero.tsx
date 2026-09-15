import { ArrowRight, Check } from 'lucide-react'
import { Container, Eyebrow, GradientHeading } from '@/components/common/primitives'
import { ProductMediaFrame } from '@/components/common/ProductMediaFrame'
import { WebphoneWorkspaceMockup } from './ProductInterfaceMockup'
import { track } from '@/lib/analytics'
import { leadCtaHref } from '@/lib/leads/ctaLink'
import { GP_HERO, GP_LEAD_CONTEXT, GP_MEDIA } from '@/data/gcallsPlus'
import { CtaLink } from '@/components/common/Button'

/**
 * Page hero. Carries the page's single H1.
 *
 * Visual (Page 03 polish, React Shell 0.3.5): ONE complete code-native
 * composition in the right column — a browser frame holding the webphone
 * workspace, with the docked call panel inside the frame beside the contact
 * view. It sits in a ProductMediaFrame with an explicit aspect ratio,
 * max-width and max-height, so it can never overflow its column, overlap the
 * copy, or stretch. Nothing is floated over a placeholder: the previous
 * layout put a portrait phone capture (553×1084) over an empty "image
 * pending" box, which read as a hole in the page.
 *
 * Desktop: balanced two columns. Tablet and mobile: stacked, copy first,
 * visual second (DOM order is text-first at every breakpoint).
 */
export function GcallsPlusHero() {
  return (
    <section
      className="w-full pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
      style={{
        background:
          'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
      }}
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Text first in DOM order → first on mobile. */}
          <div>
            <Eyebrow>{GP_HERO.eyebrow}</Eyebrow>

            <GradientHeading as="h1" className="mt-5">
              {GP_HERO.h1}
            </GradientHeading>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {GP_HERO.description}
            </p>

            <ul className="mt-7 flex flex-col gap-5">
              {GP_HERO.valuePoints.map((point) => (
                <li key={point.title} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-light"
                    aria-hidden="true"
                  >
                    <Check size={12} className="text-brand" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-base font-semibold leading-snug text-foreground">
                      {point.title}
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                      {point.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <CtaLink
                to={leadCtaHref(GP_LEAD_CONTEXT)}
                variant="primary"
                fullWidth
                onClick={() =>
                  track('cta_clicked', {
                    label: GP_HERO.primaryCta.label,
                    source: GP_LEAD_CONTEXT.source,
                    intent: GP_LEAD_CONTEXT.intent,
                    product: GP_LEAD_CONTEXT.product,
                  })
                }
              >
                {GP_HERO.primaryCta.label}
              </CtaLink>

              <CtaLink to={GP_HERO.secondaryCta.href} variant="outline" fullWidth>
                {GP_HERO.secondaryCta.label}
                <ArrowRight size={18} aria-hidden="true" />
              </CtaLink>
            </div>
          </div>

          {/* Visual second. */}
          <ProductMediaFrame
            caption={GP_MEDIA.hero.caption}
            aspectClassName="aspect-square sm:aspect-[16/11]"
            maxWidth="620px"
            maxHeight="470px"
            padded={false}
            label="Giao diện mô phỏng Gcalls Plus Webphone trên trình duyệt: danh sách liên hệ, hồ sơ khách hàng đang gọi, ghi chú, lịch sử cuộc gọi và bảng điều khiển cuộc gọi; dữ liệu mẫu"
          >
            <WebphoneWorkspaceMockup />
          </ProductMediaFrame>
        </div>
      </Container>
    </section>
  )
}
