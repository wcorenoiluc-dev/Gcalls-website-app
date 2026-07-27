import { useMemo } from 'react'
import { ArrowRight, Calculator, Info, ListChecks, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import {
  Card,
  Container,
  Eyebrow,
  GradientHeading,
  Section,
  SectionHeader,
} from '@/components/common/primitives'
import { JsonLd } from '@/components/common/JsonLd'
import { FaqAccordion } from '@/components/common/FaqAccordion'
import { FinalCtaBand } from '@/components/common/FinalCtaBand'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { ROUTES } from '@/config/navigation'
import { SITE_ORIGIN } from '@/config/seo'
import {
  COST_DRIVERS,
  ESTIMATOR_FAQ,
  HOW_IT_WORKS,
  QUOTE_DIFFERENCES,
} from '@/data/estimator'
import { Estimator } from '@/components/estimator/Estimator'

/**
 * `/uoc-tinh-chi-phi/` — Gcalls Solution & Cost Estimator.
 *
 * Positioned as a solution-and-configuration tool, not a price calculator: it
 * helps a business identify a suitable product, the expected configuration and
 * the cost drivers, then hands a structured result to the quote form.
 *
 * Pricing comes from the single config in `src/data/pricing.ts` via
 * `src/lib/estimate.ts`. No price is rendered while that config is inactive,
 * and 0₫ / NaN / undefined are unreachable by construction.
 *
 * Exactly one H1.
 */
export function CostEstimatorPage() {
  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${SITE_ORIGIN}/` },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Bảng giá',
              item: `${SITE_ORIGIN}${ROUTES.pricing}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Ước tính chi phí',
              item: `${SITE_ORIGIN}${ROUTES.costEstimator}`,
            },
          ],
        },
        {
          '@type': 'WebApplication',
          name: 'Gcalls Solution & Cost Estimator',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web browser',
          url: `${SITE_ORIGIN}${ROUTES.costEstimator}`,
          description:
            'Công cụ giúp doanh nghiệp chọn sản phẩm Gcalls, nhập quy mô sử dụng và xác định các yếu tố ảnh hưởng đến cấu hình và chi phí triển khai.',
          provider: { '@type': 'Organization', name: 'Gcalls' },
          // No `offers` block: public pricing is not configured.
        },
        {
          '@type': 'FAQPage',
          mainEntity: ESTIMATOR_FAQ.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    }),
    [],
  )

  return (
    <>
      <JsonLd id="estimator" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[
              { label: 'Bảng giá', path: ROUTES.pricing },
              { label: 'Ước tính chi phí' },
            ]}
          />
        </Container>
      </div>

      {/* ── 01 Hero ───────────────────────────────────────────────── */}
      <section
        className="w-full pt-14 pb-12 sm:pt-20 sm:pb-16"
        style={{
          background: 'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
        }}
      >
        <Container>
          <div className="flex flex-col items-center text-center">
            <Eyebrow icon={<Calculator size={14} aria-hidden="true" />}>
              Ước tính chi phí
            </Eyebrow>

            <GradientHeading as="h1" className="mt-5 max-w-4xl">
              Ước tính cấu hình và chi phí Gcalls phù hợp với nhu cầu
            </GradientHeading>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Chọn giải pháp, quy mô đội ngũ và nhu cầu sử dụng để xem cấu hình tham khảo
              trước khi nhận báo giá chính thức.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <a
                href="#estimator"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                <Sparkles size={18} aria-hidden="true" />
                Bắt đầu ước tính
              </a>

              <Link
                to={ROUTES.pricing}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                Xem bảng giá
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>

            {/* Direct-answer paragraph — approved copy, verbatim. */}
            <p className="mx-auto mt-8 max-w-3xl rounded-[14px] border border-brand-border bg-background px-5 py-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Công cụ giúp doanh nghiệp lựa chọn sản phẩm, nhập quy mô sử dụng và xác định
              các yếu tố có thể ảnh hưởng đến cấu hình và chi phí triển khai. Chi phí chỉ
              được hiển thị khi bảng giá tương ứng đã được cấu hình; báo giá chính thức phụ
              thuộc vào yêu cầu thực tế.
            </p>
          </div>
        </Container>
      </section>

      {/* ── 02–04 Estimator (steps 1–4, incl. result + quote form) ─── */}
      <Section tinted ariaLabelledBy="cong-cu-uoc-tinh">
        <Container>
          <h2 id="cong-cu-uoc-tinh" className="sr-only">
            Công cụ ước tính cấu hình và chi phí
          </h2>
          <Estimator />
        </Container>
      </Section>

      {/* ── 04 Cost drivers ───────────────────────────────────────── */}
      <Section ariaLabelledBy="yeu-to-chi-phi">
        <Container>
          <SectionHeader
            eyebrow="Các yếu tố ảnh hưởng chi phí"
            eyebrowIcon={<ListChecks size={14} aria-hidden="true" />}
            title="Chi phí thay đổi theo cách doanh nghiệp sử dụng Gcalls"
            titleId="yeu-to-chi-phi"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COST_DRIVERS.map((driver) => (
              <Card as="li" key={driver.id} className="flex h-full flex-col p-6">
                <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                  {driver.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {driver.detail}
                </p>
              </Card>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 05 How the estimate works ─────────────────────────────── */}
      <Section tinted ariaLabelledBy="cach-hoat-dong">
        <Container>
          <SectionHeader
            eyebrow="Quy trình"
            title="Công cụ ước tính hoạt động như thế nào?"
            titleId="cach-hoat-dong"
          />

          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <Card as="li" key={item.n} className="flex h-full flex-col p-6">
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                  aria-hidden="true"
                >
                  {item.n}
                </span>
                <h3 className="mt-4 text-base font-bold leading-snug text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </Card>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── 06 Why the final quote may differ ─────────────────────── */}
      <Section ariaLabelledBy="vi-sao-khac">
        <Container>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <Eyebrow icon={<Info size={14} aria-hidden="true" />}>Minh bạch chi phí</Eyebrow>
              <GradientHeading id="vi-sao-khac" className="mt-4">
                Vì sao báo giá chính thức có thể khác?
              </GradientHeading>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Cấu hình tham khảo dựa trên thông tin bạn cung cấp. Báo giá chính thức được
                xác nhận sau khi Gcalls rà soát các yếu tố dưới đây.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {QUOTE_DIFFERENCES.map((item) => (
                <li
                  key={item}
                  className="flex min-h-[60px] items-center rounded-[10px] border border-brand-border bg-background px-4 py-3 text-base font-medium text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── 07 FAQ ────────────────────────────────────────────────── */}
      <Section tinted ariaLabelledBy="faq-uoc-tinh">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về ước tính chi phí"
            titleId="faq-uoc-tinh"
          />
          <div className="mt-10">
            <FaqAccordion items={ESTIMATOR_FAQ} idPrefix="est-faq" />
          </div>
        </Container>
      </Section>

      {/* ── 08 Final CTA ──────────────────────────────────────────── */}
      <Section ariaLabelledBy="cta-uoc-tinh">
        <FinalCtaBand
          eyebrow="Bắt đầu"
          title="Chưa chắc cấu hình nào phù hợp với doanh nghiệp?"
          titleId="cta-uoc-tinh"
          description="Chia sẻ quy mô đội ngũ, hệ thống đang sử dụng và nhu cầu giao tiếp để Gcalls đề xuất cấu hình phù hợp."
          primary={{ label: 'Bắt đầu ước tính', path: `${ROUTES.costEstimator}#estimator` }}
          secondary={{ label: 'Xem bảng giá', path: ROUTES.pricing }}
          showPhone
        />
      </Section>
    </>
  )
}
