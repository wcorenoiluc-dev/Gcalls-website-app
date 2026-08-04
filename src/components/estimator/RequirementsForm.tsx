import { Check, Minus, Plus } from 'lucide-react'
import type { EstimatorField } from '@/data/estimator'
import type { EstimatorAnswers } from '@/lib/estimate'

/**
 * Renders the fields for one step of the estimator.
 *
 * Every control is a real form element with a real `<label>` bound by `htmlFor`
 * — no div-only fake inputs. Multi-selects use `aria-pressed` toggle buttons
 * inside a labelled group.
 *
 * Number inputs get −/+ steppers with 48px targets, per the source doc's
 * "minus / value / plus with large touch targets" guidance. Values are clamped
 * to each field's min/max so 0, empty and very large inputs cannot produce an
 * invalid configuration.
 */

const fieldBase =
  'min-h-12 w-full rounded-[10px] border border-brand-border bg-background px-4 text-base text-foreground transition-colors duration-150 focus:border-brand focus:outline-2 focus:outline-offset-0 focus:outline-brand'

function clamp(value: number, field: EstimatorField) {
  const min = field.min ?? 0
  const max = field.max ?? Number.MAX_SAFE_INTEGER
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, Math.round(value)))
}

export function RequirementsForm({
  fields,
  answers,
  onChange,
  errors = {},
}: {
  fields: EstimatorField[]
  answers: EstimatorAnswers
  onChange: (id: string, value: EstimatorAnswers[string]) => void
  errors?: Record<string, string>
}) {
  if (fields.length === 0) {
    return (
      <p className="text-base leading-relaxed text-muted-foreground">
        Giải pháp này không cần thêm thông tin ở bước này. Bạn có thể tiếp tục.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {fields.map((field) => {
        const errorId = `${field.id}-error`
        const hintId = `${field.id}-hint`
        const error = errors[field.id]
        const describedBy =
          [field.hint ? hintId : null, error ? errorId : null]
            .filter(Boolean)
            .join(' ') || undefined

        return (
          <div key={field.id}>
            {/* multi/boolean groups get a legend instead of a label. */}
            {field.type === 'multi' || field.type === 'boolean' ? (
              <fieldset>
                <legend className="text-base font-bold text-foreground">
                  {field.label}
                </legend>
                {field.hint && (
                  <p id={hintId} className="mt-1 text-sm text-muted-foreground">
                    {field.hint}
                  </p>
                )}

                {field.type === 'multi' ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {field.options?.map((option) => {
                      const current = Array.isArray(answers[field.id])
                        ? (answers[field.id] as string[])
                        : []
                      const on = current.includes(option.value)

                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={on}
                          onClick={() =>
                            onChange(
                              field.id,
                              on
                                ? current.filter((v) => v !== option.value)
                                : [...current, option.value],
                            )
                          }
                          className={`inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-4 text-[15px] font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                            on
                              ? 'border-brand bg-brand text-white'
                              : 'border-brand-border bg-background text-muted-foreground hover:border-brand hover:text-brand'
                          }`}
                        >
                          {on && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="mt-3 flex gap-2">
                    {[
                      { value: true, label: 'Có' },
                      { value: false, label: 'Không' },
                    ].map((choice) => {
                      const on = answers[field.id] === choice.value
                      return (
                        <button
                          key={String(choice.value)}
                          type="button"
                          aria-pressed={on}
                          onClick={() => onChange(field.id, choice.value)}
                          className={`inline-flex min-h-12 flex-1 items-center justify-center rounded-[10px] border-2 px-4 text-[15px] font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:flex-none sm:px-8 ${
                            on
                              ? 'border-brand bg-brand text-white'
                              : 'border-brand-border bg-background text-muted-foreground hover:border-brand hover:text-brand'
                          }`}
                        >
                          {choice.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </fieldset>
            ) : (
              <>
                <label
                  htmlFor={field.id}
                  className="block text-base font-bold text-foreground"
                >
                  {field.label}
                  {field.unit && (
                    <span className="ml-1 font-normal text-muted-foreground">
                      ({field.unit})
                    </span>
                  )}
                </label>
                {field.hint && (
                  <p id={hintId} className="mt-1 text-sm text-muted-foreground">
                    {field.hint}
                  </p>
                )}

                {field.type === 'select' ? (
                  <select
                    id={field.id}
                    value={(answers[field.id] as string) ?? ''}
                    onChange={(event) => onChange(field.id, event.target.value)}
                    aria-describedby={describedBy}
                    aria-invalid={error ? true : undefined}
                    className={`${fieldBase} mt-3`}
                  >
                    <option value="">— Chọn —</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-3 flex items-stretch gap-2">
                    <button
                      type="button"
                      aria-label={`Giảm ${field.label}`}
                      onClick={() =>
                        onChange(
                          field.id,
                          clamp(Number(answers[field.id] ?? field.min ?? 0) - 1, field),
                        )
                      }
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border border-brand-border bg-background text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <Minus size={18} aria-hidden="true" />
                    </button>

                    <input
                      id={field.id}
                      type="number"
                      inputMode="numeric"
                      min={field.min}
                      max={field.max}
                      value={
                        typeof answers[field.id] === 'number'
                          ? (answers[field.id] as number)
                          : ''
                      }
                      placeholder={field.min !== undefined ? String(field.min) : '0'}
                      onChange={(event) => {
                        const raw = event.target.value
                        if (raw === '') return onChange(field.id, undefined)
                        onChange(field.id, clamp(Number(raw), field))
                      }}
                      aria-describedby={describedBy}
                      aria-invalid={error ? true : undefined}
                      className={`${fieldBase} text-center`}
                    />

                    <button
                      type="button"
                      aria-label={`Tăng ${field.label}`}
                      onClick={() =>
                        onChange(
                          field.id,
                          clamp(Number(answers[field.id] ?? field.min ?? 0) + 1, field),
                        )
                      }
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border border-brand-border bg-background text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <Plus size={18} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </>
            )}

            {error && (
              <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-[#d4183d]">
                {error}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
