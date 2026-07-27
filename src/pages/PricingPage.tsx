import { useMemo, useState } from 'react'
import { ArrowRight, Layers, Phone, Puzzle, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { CONTACT, ROUTES } from '@/config/navigation'
import { SITE_ORIGIN } from '@/config/seo'
import { leadCtaHref } from '@/lib/leads/ctaLink'
import { JsonLd } from '@/components/common/JsonLd'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import {
  ADDON_PRICE_LABEL,
  GCALLS_PLUS_PLANS,
  PRICING_ADDONS,
  PRICING_FACTORS,
  PRICING_NOTE,
  SOLUTION_PRICING,
  buildPricingJsonLd,
} from '@/data/pricing'
import {
  Container,
  Section,
  SectionHeader,
  Card,
} from '@/components/common/primitives'
import { PricingHero } from '@/components/pricing/PricingHero'
import { PricingProductSelector } from '@/components/pricing/PricingProductSelector'
import { PricingPlanCard } from '@/components/pricing/PricingPlanCard'
import { PricingFactorCard } from '@/components/pricing/PricingFactorCard'
import { SolutionPricingCard } from '@/components/pricing/SolutionPricingCard'
import { PricingComparison } from '@/components/pricing/PricingComparison'
import { EstimatorPreview } from '@/components/pricing/EstimatorPreview'
import { EnterprisePricingCTA } from '@/components/pricing/EnterprisePricingCTA'
import { PricingFAQ } from '@/components/pricing/PricingFAQ'

/**
 * `/bang-gia/` — Gcalls pricing page.
 *
 * Visual language follows docs/PRICING_REFERENCE_AUDIT.md. All content comes
 * from the approved Checkpoint 3A brief.
 *
 * NO PRICE VALUES ARE RENDERED ANYWHERE. Every monetary surface reads from
 * `src/data/pricing.ts`, which gates numbers behind `pricingConfigured`. The
 * same module backs `/uoc-tinh-chi-phi/` — there is one pricing model, not two.
 *
 * Exactly one H1, in PricingHero.
 */
export function PricingPage() {
  const [selectedId, setSelectedId] = useState(SOLUTION_PRICING[0].id)

  const selected =
    SOLUTION_PRICING.find((s) => s.id === selectedId) ?? SOLUTION_PRICING[0]
  const isGcallsPlus = selected.id === 'gcalls-plus'

  const jsonLd = useMemo(() => buildPricingJsonLd(SITE_ORIGIN), [])

  return (
    <>
      <JsonLd id="pricing" data={jsonLd} />

      {/* Breadcrumb sits above the hero, matching the other routes. */}
      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb trail={[{ label: 'Bảng giá' }]} />
        </Container>
      </div>

      <PricingHero />

      {/* ── Product selector + package cards ───────────────────────── */}
      <Section tinted ariaLabelledBy="chon-san-pham">
        <Container>
          <SectionHeader
            eyebrow="Chọn nhu cầu"
            eyebrowIcon={<Layers size={14} aria-hidden="true" />}
            title="Chọn sản phẩm hoặc giải pháp bạn quan tâm"
            titleId="chon-san-pham"
            lead="Mỗi sản phẩm có mô hình chi phí riêng. Chọn một mục để xem cách Gcalls xây dựng cấu hình và báo giá."
          />

          <div className="mt-8 sm:mt-10">
            <PricingProductSelector
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          <div
            role="tabpanel"
            id={`panel-${selected.id}`}
            aria-labelledby={`chip-${selected.id}`}
            className="mt-8 sm:mt-10"
          >
            {isGcallsPlus ? (
              <>
                {/* One card per row at 390px; 2-up at md; 4-up at xl. */}
                <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {GCALLS_PLUS_PLANS.map((plan) => (
                    <PricingPlanCard key={plan.id} plan={plan} />
                  ))}
                </ul>

                <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
                  Tên gói phản ánh mức độ nhu cầu vận hành. Cấu hình chi tiết và chi phí
                  được xác nhận sau khi trao đổi.
                </p>
              </>
            ) : (
              <Card className="p-6 sm:p-8 lg:p-10">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                      {selected.name}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                      {selected.summary}
                    </p>

                    <div className="mt-6 rounded-[10px] bg-brand-light px-5 py-4">
                      <p className="text-[12px] font-bold uppercase tracking-wider text-brand">
                        Mô hình báo giá
                      </p>
                      <p className="mt-1.5 text-base font-semibold leading-snug text-foreground">
                        {selected.pricingModel}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                      Chi phí
                    </p>
                    <p className="mt-2 text-[22px] font-extrabold leading-tight text-brand sm:text-2xl">
                      Nhận báo giá
                    </p>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                      {PRICING_NOTE}. Đội ngũ Gcalls sẽ xác nhận phạm vi trước khi báo
                      giá.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Link
                        to={selected.cta.path}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-6 text-[15px] font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
                      >
                        {selected.cta.label}
                        <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                      <Link
                        to={leadCtaHref({
                          intent: 'quote',
                          source: 'pricing',
                          product: selected.name,
                        })}
                        className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] border-2 border-brand bg-background px-6 text-[15px] font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
                      >
                        Nhận báo giá
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Container>
      </Section>

      {/* ── How pricing is composed ────────────────────────────────── */}
      <Section ariaLabelledBy="cach-tinh-chi-phi">
        <Container>
          <SectionHeader
            eyebrow="Cách tính chi phí"
            title="Chi phí Gcalls được cấu thành từ những yếu tố nào?"
            titleId="cach-tinh-chi-phi"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRICING_FACTORS.map((factor) => (
              <PricingFactorCard key={factor.n} {...factor} />
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── Per-solution pricing models ────────────────────────────── */}
      <Section tinted ariaLabelledBy="theo-giai-phap">
        <Container>
          <SectionHeader
            eyebrow="Theo giải pháp"
            eyebrowIcon={<Puzzle size={14} aria-hidden="true" />}
            title="Chọn mô hình phù hợp với bài toán của doanh nghiệp"
            titleId="theo-giai-phap"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTION_PRICING.map((solution) => (
              <SolutionPricingCard key={solution.id} solution={solution} />
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── Cost estimator preview ─────────────────────────────────── */}
      <Section ariaLabelledBy="uoc-tinh-chi-phi">
        <Container>
          <SectionHeader
            eyebrow="Ước tính chi phí"
            eyebrowIcon={<Sparkles size={14} aria-hidden="true" />}
            title="Ước tính cấu hình Gcalls phù hợp với nhu cầu của bạn"
            titleId="uoc-tinh-chi-phi"
            lead="Chọn giải pháp, số lượng Agent và nhu cầu sử dụng để chuẩn bị cấu hình tham khảo trước khi trao đổi với đội ngũ Gcalls."
          />

          <div className="mt-10">
            <EstimatorPreview />
          </div>
        </Container>
      </Section>

      {/* ── Decision comparison ────────────────────────────────────── */}
      <Section tinted ariaLabelledBy="so-sanh">
        <Container>
          <SectionHeader
            eyebrow="So sánh"
            title="Giải pháp nào phù hợp với doanh nghiệp của bạn?"
            titleId="so-sanh"
            lead="So sánh theo tiêu chí lựa chọn thay vì danh sách tính năng. Giá trị mang tính định hướng và được xác nhận khi báo giá."
          />

          <div className="mt-10">
            <PricingComparison />
          </div>
        </Container>
      </Section>

      {/* ── Add-ons ────────────────────────────────────────────────── */}
      <Section ariaLabelledBy="dich-vu-bo-sung">
        <Container>
          <SectionHeader
            eyebrow="Dịch vụ bổ sung"
            title="Chi phí có thể thay đổi khi doanh nghiệp mở rộng cấu hình"
            titleId="dich-vu-bo-sung"
          />

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRICING_ADDONS.map((addon) => (
              <Card
                as="li"
                key={addon.id}
                className="flex min-h-[92px] flex-col justify-center gap-1.5 p-5"
              >
                <p className="text-base font-bold text-foreground">{addon.title}</p>
                <p className="text-[15px] font-semibold text-brand">
                  {ADDON_PRICE_LABEL}
                </p>
              </Card>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── Enterprise ─────────────────────────────────────────────── */}
      <Section tinted ariaLabelledBy="enterprise-heading">
        <EnterprisePricingCTA />
      </Section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <Section ariaLabelledBy="faq-bang-gia">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về bảng giá Gcalls"
            titleId="faq-bang-gia"
          />

          <div className="mt-10">
            <PricingFAQ />
          </div>
        </Container>
      </Section>

      {/* ── Final CTA — also the #nhan-bao-gia anchor target ───────── */}
      <Section tinted ariaLabelledBy="cta-cuoi" className="scroll-mt-20">
        <Container>
          <div
            id="nhan-bao-gia"
            className="scroll-mt-24 rounded-[24px] px-6 py-12 text-center sm:px-10 sm:py-16"
            style={{
              backgroundImage: 'var(--brand-gradient)',
              boxShadow: '0 16px 56px rgba(103,58,183,0.28)',
            }}
          >
            <h2
              id="cta-cuoi"
              className="mx-auto max-w-2xl text-[26px] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[34px] lg:text-[40px]"
            >
              Chưa chắc cấu hình nào phù hợp với doanh nghiệp?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Chia sẻ quy mô đội ngũ, hệ thống đang sử dụng và nhu cầu giao tiếp để Gcalls
              đề xuất cấu hình phù hợp.
            </p>

            <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <Link
                to={ROUTES.costEstimator}
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-white px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
              >
                Ước tính chi phí
                <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <Link
                to={leadCtaHref({ intent: 'consultation', source: 'pricing' })}
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-[10px] border border-white/45 px-7 text-base font-semibold text-white transition-colors duration-150 hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
              >
                Đăng ký tư vấn
              </Link>
            </div>

            <a
              href={CONTACT.phoneHref}
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] px-4 text-base font-medium text-white/90 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Phone size={17} aria-hidden="true" />
              {CONTACT.phone}
            </a>
          </div>
        </Container>
      </Section>
    </>
  )
}
