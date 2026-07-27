import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { COMPARISON_COLUMNS, COMPARISON_ROWS } from '@/data/pricing'

/**
 * Decision-oriented comparison.
 *
 * Reference styling — purple gradient header bar with a 14px top radius,
 * hairline row dividers, tinted label column — applied to a compact 7-row
 * matrix instead of the reference's 30+ row entitlement grid. Values are
 * qualitative; no limit, quota or entitlement is asserted.
 *
 * Below `lg` the table is replaced entirely by one expandable card per
 * solution. A five-column table cannot be read at 390px, and horizontal
 * scrolling for comparison data is a poor mobile experience.
 */
export function PricingComparison() {
  return (
    <>
      {/* ── Desktop / large tablet: table ─────────────────────────── */}
      <div className="hidden overflow-hidden rounded-[14px] border border-brand-border lg:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            So sánh các giải pháp Gcalls theo tiêu chí lựa chọn
          </caption>
          <thead>
            <tr style={{ backgroundImage: 'var(--brand-gradient)' }}>
              <th
                scope="col"
                className="px-5 py-4 text-sm font-bold uppercase tracking-wider text-white/90"
              >
                Tiêu chí
              </th>
              {COMPARISON_COLUMNS.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-5 py-4 text-sm font-bold text-white"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, rowIndex) => (
              <tr
                key={row.label}
                className={rowIndex % 2 === 1 ? 'bg-surface-alt' : 'bg-background'}
              >
                <th
                  scope="row"
                  className="border-t border-brand-border px-5 py-4 align-top text-sm font-bold text-foreground"
                >
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td
                    key={`${row.label}-${COMPARISON_COLUMNS[i]}`}
                    className="border-t border-brand-border px-5 py-4 align-top text-sm leading-relaxed text-muted-foreground"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile / small tablet: expandable cards ───────────────── */}
      <ul className="flex flex-col gap-3 lg:hidden">
        {COMPARISON_COLUMNS.map((col, colIndex) => (
          <ComparisonCard key={col} name={col} colIndex={colIndex} />
        ))}
      </ul>
    </>
  )
}

function ComparisonCard({ name, colIndex }: { name: string; colIndex: number }) {
  const [open, setOpen] = useState(colIndex === 0)
  const panelId = `compare-panel-${colIndex}`
  const buttonId = `compare-button-${colIndex}`

  return (
    <li className="overflow-hidden rounded-[14px] border border-brand-border bg-background">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex min-h-14 w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
        >
          <span className="text-base font-extrabold text-foreground">{name}</span>
          <ChevronDown
            size={20}
            aria-hidden="true"
            className={`shrink-0 text-brand transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>
      </h3>

      {open && (
        <dl
          id={panelId}
          aria-labelledby={buttonId}
          className="border-t border-brand-border px-5 py-2"
        >
          {COMPARISON_ROWS.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 border-b border-brand-border py-3.5 last:border-b-0"
            >
              <dt className="text-sm font-bold text-foreground">{row.label}</dt>
              <dd className="text-[15px] leading-relaxed text-muted-foreground">
                {row.values[colIndex]}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </li>
  )
}
