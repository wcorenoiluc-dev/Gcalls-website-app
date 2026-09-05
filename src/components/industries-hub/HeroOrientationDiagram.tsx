import { Phone } from 'lucide-react'
import type { HubCard } from '@/data/hubs'
import { INDUSTRY_ICON } from './icons'

/**
 * Hero orientation diagram — six industry contexts around a central Gcalls node.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS IS, AND IS NOT
 * ---------------------------------------------------------------------------
 * A wayfinding illustration. It carries NO stock photo, NO customer logo, NO
 * dashboard, NO KPI and NO fake data map — icons are navigation symbols, not
 * product evidence. Labels are the industry titles straight from
 * `INDUSTRIES_HUB.cards.items`, so the diagram can never name an industry the
 * source does not.
 * ---------------------------------------------------------------------------
 */
export function HeroOrientationDiagram({ items }: { items: readonly HubCard[] }) {
  const left = items.slice(0, 3)
  const right = items.slice(3, 6)

  const Chip = ({ item }: { item: HubCard }) => {
    const Icon = INDUSTRY_ICON[item.path]
    return (
      <div className="flex items-center gap-2.5 rounded-[12px] border border-brand-border bg-white px-3 py-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-brand-light text-brand" aria-hidden="true">
          {Icon && <Icon size={16} />}
        </span>
        <span className="text-[13px] font-semibold leading-tight text-foreground">{item.title}</span>
      </div>
    )
  }

  return (
    <div className="relative w-full rounded-[18px] border border-brand-border bg-brand-light/40 p-4 sm:p-6">
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-brand shadow-sm">
        Sơ đồ định hướng minh họa
      </span>

      <div className="mt-7 grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr]">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {left.map((item) => (
            <li key={item.path}><Chip item={item} /></li>
          ))}
        </ul>

        <div className="mx-auto flex flex-col items-center justify-center gap-2 rounded-[16px] border border-brand bg-brand px-5 py-4 text-white shadow-[0_10px_30px_rgba(103,58,183,0.25)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-white/15" aria-hidden="true">
            <Phone size={20} />
          </span>
          <span className="text-sm font-extrabold">Gcalls</span>
          <span className="text-[11px] leading-tight text-white/80">Theo bối cảnh ngành</span>
        </div>

        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {right.map((item) => (
            <li key={item.path}><Chip item={item} /></li>
          ))}
        </ul>
      </div>
    </div>
  )
}
