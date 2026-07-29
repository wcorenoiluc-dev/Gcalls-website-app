import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { Card } from '@/components/common/primitives'
import { ESTIMATOR_SOLUTIONS } from '@/data/estimator'
import { track } from '@/lib/analytics'
import {
  buildPriceState,
  buildResult,
  getSolution,
  recommend,
  type EstimatorAnswers,
} from '@/lib/estimate'
import { EstimatorStepper } from './EstimatorStepper'
import { ProductSelector } from './ProductSelector'
import { RequirementsForm } from './RequirementsForm'
import { EstimatorResult } from './EstimatorResult'
import { QuoteRequestForm } from './QuoteRequestForm'

/**
 * Step-driven estimator.
 *
 * Mobile is the primary target: exactly one step is on screen at a time —
 * step header → inputs → continue. It is not a desktop form squeezed down.
 * From `lg` the result step shows the configuration and the quote form
 * side by side.
 *
 * Switching solution resets the answers, because field sets differ per
 * solution and stale values from another product would silently corrupt the
 * configuration.
 */
/**
 * Reads `?product=` and returns it only when it names a real solution.
 *
 * Product pages deep-link here (e.g. `/uoc-tinh-chi-phi/?product=gcalls-plus`)
 * so a visitor arriving from a product page does not have to re-pick the
 * product they were just reading about. An unknown or absent value simply
 * falls through to the normal "choose a solution" step — the parameter can
 * never put the estimator into an invalid state.
 */
/** Seed a solution's answers from its field defaults. */
function defaultAnswersFor(id: string): EstimatorAnswers {
  const next: EstimatorAnswers = {}
  for (const field of getSolution(id).fields) {
    if (field.defaultValue !== undefined) next[field.id] = field.defaultValue
  }
  return next
}

/**
 * Public slugs that differ from the internal solution id.
 *
 * Product pages link with a readable, stable marketing slug; the estimator's
 * internal ids are shorter. Mapping here keeps the public URL stable without
 * renaming product data (which would change estimator analytics history).
 */
const PRODUCT_SLUG_ALIASES: Record<string, string> = {
  'gcalls-cx': 'cx',
  'crm-integration': 'crm',
  'helpdesk-integration': 'helpdesk',
  'pos-integration': 'pos',
}

function usePreselectedSolution(): string | null {
  const [params] = useSearchParams()
  const requested = params.get('product')
  if (!requested) return null

  const id = PRODUCT_SLUG_ALIASES[requested] ?? requested
  return ESTIMATOR_SOLUTIONS.some((s) => s.id === id) ? id : null
}

export function Estimator() {
  const preselected = usePreselectedSolution()

  const [step, setStep] = useState(1)
  const [solutionId, setSolutionId] = useState<string | null>(preselected)
  const [answers, setAnswers] = useState<EstimatorAnswers>(() =>
    preselected ? defaultAnswersFor(preselected) : {},
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [started, setStarted] = useState(false)

  const headingRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)

  const solution = solutionId ? getSolution(solutionId) : null
  const step2Fields = useMemo(
    () => solution?.fields.filter((f) => f.step === 2) ?? [],
    [solution],
  )
  const step3Fields = useMemo(
    () => solution?.fields.filter((f) => f.step === 3) ?? [],
    [solution],
  )

  const result = useMemo(
    () => (solution ? buildResult(solution, answers) : null),
    [solution, answers],
  )
  const recommendation = useMemo(
    () => (solution ? recommend(solution, answers) : null),
    [solution, answers],
  )
  const price = useMemo(
    () => (recommendation ? buildPriceState(recommendation) : null),
    [recommendation],
  )

  // Move focus to the step heading on change so keyboard and screen-reader
  // users are not left at the bottom of the previous step.
  useEffect(() => {
    if (started) headingRef.current?.focus()
  }, [step, started])

  useEffect(() => {
    if (showQuoteForm) quoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [showQuoteForm])

  const onSelectSolution = (id: string) => {
    if (!started) {
      setStarted(true)
      track('estimator_started')
    }
    // Field sets differ per solution — clear rather than carry over.
    setSolutionId(id)
    setAnswers(defaultAnswersFor(id))
    setErrors({})
    setShowQuoteForm(false)
    track('estimator_solution_selected', { solution: id })
  }

  const validateStep = (target: number) => {
    const next: Record<string, string> = {}

    if (target === 2 && solution) {
      for (const field of step2Fields) {
        if (field.type === 'select' && !answers[field.id]) {
          next[field.id] = 'Vui lòng chọn một tùy chọn.'
        }
        if (field.id === 'agents') {
          const value = answers.agents
          if (typeof value !== 'number' || value < 1) {
            next.agents = 'Số lượng Agent phải từ 1 trở lên.'
          }
        }
      }
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goNext = () => {
    if (step === 1 && !solutionId) {
      setErrors({ solution: 'Vui lòng chọn một giải pháp để tiếp tục.' })
      return
    }
    if (!validateStep(step)) return

    const target = Math.min(4, step + 1)
    setStep(target)
    if (target === 4) {
      track('estimator_completed', {
        solution: solutionId ?? undefined,
        agents: typeof answers.agents === 'number' ? answers.agents : undefined,
      })
    }
  }

  const goBack = () => {
    setErrors({})
    setShowQuoteForm(false)
    setStep((s) => Math.max(1, s - 1))
  }

  const restart = () => {
    setStep(1)
    setSolutionId(null)
    setAnswers({})
    setErrors({})
    setShowQuoteForm(false)
  }

  const onRequestQuote = () => {
    setShowQuoteForm(true)
    track('quote_request_started', { solution: solutionId ?? undefined })
  }

  const navButtons = (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:justify-end">
      {step < 4 && (
        <button
          type="button"
          onClick={goNext}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
        >
          Tiếp tục
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      )}

      {step > 1 && (
        <button
          type="button"
          onClick={goBack}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Quay lại
        </button>
      )}

      {step === 4 && (
        <button
          type="button"
          onClick={restart}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] px-5 text-base font-medium text-muted-foreground transition-colors duration-150 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
        >
          <RotateCcw size={16} aria-hidden="true" />
          Ước tính lại
        </button>
      )}
    </div>
  )

  return (
    <div id="estimator" className="scroll-mt-24">
      <EstimatorStepper current={step} />

      <div
        ref={headingRef}
        tabIndex={-1}
        className="mt-6 outline-none sm:mt-8"
        aria-live="polite"
      >
        {step === 1 && (
          <Card className="p-6 sm:p-8">
            <ProductSelector selectedId={solutionId} onSelect={onSelectSolution} />
            {errors.solution && (
              <p role="alert" className="mt-4 text-sm font-medium text-[#d4183d]">
                {errors.solution}
              </p>
            )}
            {navButtons}
          </Card>
        )}

        {step === 2 && solution && (
          <Card className="p-6 sm:p-8">
            <h3 className="text-lg font-extrabold text-foreground sm:text-xl">
              Quy mô sử dụng
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {solution.name} — nhập thông tin bạn đã có. Ước lượng tương đối là đủ.
            </p>

            <div className="mt-6">
              <RequirementsForm
                fields={step2Fields}
                answers={answers}
                errors={errors}
                onChange={(id, value) => setAnswers((a) => ({ ...a, [id]: value }))}
              />
            </div>
            {navButtons}
          </Card>
        )}

        {step === 3 && solution && (
          <Card className="p-6 sm:p-8">
            <h3 className="text-lg font-extrabold text-foreground sm:text-xl">
              Nhu cầu bổ sung
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              Một vài câu hỏi giúp Gcalls hiểu rõ hơn phạm vi triển khai.
            </p>

            <div className="mt-6">
              <RequirementsForm
                fields={step3Fields}
                answers={answers}
                errors={errors}
                onChange={(id, value) => setAnswers((a) => ({ ...a, [id]: value }))}
              />
            </div>
            {navButtons}
          </Card>
        )}

        {step === 4 && result && recommendation && price && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <EstimatorResult
                result={result}
                recommendation={recommendation}
                price={price}
                onRequestQuote={onRequestQuote}
              />
              {navButtons}
            </div>

            <div ref={quoteRef} className="scroll-mt-24">
              {showQuoteForm ? (
                <QuoteRequestForm estimate={result} />
              ) : (
                <Card className="p-6 sm:p-8">
                  <h3 className="text-lg font-extrabold text-foreground sm:text-xl">
                    Gửi cấu hình cho Gcalls
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    Chọn “Nhận báo giá chi tiết” để gửi cấu hình vừa tạo kèm thông tin
                    liên hệ. Đội ngũ Gcalls sẽ xác nhận phạm vi trước khi báo giá.
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Solutions are also listed here so the step-1 choices are crawlable
          text even before any interaction. */}
      <p className="sr-only">
        Các giải pháp có thể ước tính: {ESTIMATOR_SOLUTIONS.map((s) => s.name).join(', ')}.
      </p>
    </div>
  )
}
