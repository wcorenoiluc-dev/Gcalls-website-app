import { ArrowRight, Headset, Phone, Store, Users, Waypoints } from 'lucide-react'

/**
 * Neutral hero diagram for `/tich-hop/`: Gcalls → connection layer → CRM /
 * Helpdesk / POS.
 *
 * It is a schematic, not a product screenshot: no dashboard, no KPI, no logos.
 * It deliberately communicates three things the copy also states —
 *   1. connection runs through an API layer (data/capability depend on it),
 *   2. scope is surveyed per system ("khảo sát theo hệ thống"),
 *   3. the three destination types are different kinds of system, not one thing
 *      with identical behaviour everywhere.
 * All labels are generic system-type words; no partnership or capability claim.
 */
function TypeNode({
  icon: Icon,
  label,
}: {
  icon: typeof Users
  label: string
}) {
  return (
    <li className="flex items-center gap-2.5 rounded-[12px] border border-brand-border bg-background px-4 py-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-brand-light text-brand"
        aria-hidden="true"
      >
        <Icon size={18} />
      </span>
      <span className="text-[15px] font-bold text-foreground">{label}</span>
    </li>
  )
}

export function ConnectionDiagram() {
  return (
    <figure
      className="rounded-[18px] border border-brand-border bg-white p-5 shadow-[0_18px_50px_rgba(103,58,183,0.10)] sm:p-6"
      aria-labelledby="integrations-diagram-caption"
    >
      <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
        {/* Gcalls */}
        <div className="flex shrink-0 flex-col items-center gap-2 rounded-[14px] bg-brand px-5 py-4 text-center text-white lg:w-40">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"
            aria-hidden="true"
          >
            <Phone size={20} />
          </span>
          <span className="text-[15px] font-extrabold">Tổng đài Gcalls</span>
        </div>

        <ArrowRight
          className="mx-auto shrink-0 rotate-90 text-brand lg:rotate-0"
          size={22}
          aria-hidden="true"
        />

        {/* Connection layer */}
        <div className="flex flex-1 flex-col items-center gap-2 rounded-[14px] border-2 border-dashed border-brand/40 bg-brand-light/50 px-5 py-4 text-center">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand"
            aria-hidden="true"
          >
            <Waypoints size={20} />
          </span>
          <span className="text-[15px] font-extrabold text-foreground">Lớp kết nối</span>
          <span className="text-[13px] leading-snug text-muted-foreground">
            Kết nối qua API · phạm vi được khảo sát theo từng hệ thống
          </span>
        </div>

        <ArrowRight
          className="mx-auto shrink-0 rotate-90 text-brand lg:rotate-0"
          size={22}
          aria-hidden="true"
        />

        {/* Destination system types */}
        <ul className="flex shrink-0 flex-col gap-2.5 lg:w-52">
          <TypeNode icon={Users} label="CRM" />
          <TypeNode icon={Headset} label="Helpdesk" />
          <TypeNode icon={Store} label="POS" />
        </ul>
      </div>

      <figcaption
        id="integrations-diagram-caption"
        className="mt-4 text-[13px] leading-relaxed text-muted-foreground"
      >
        Sơ đồ minh họa. Khả năng kết nối và phạm vi dữ liệu phụ thuộc API, quyền truy cập và
        cấu hình của từng hệ thống — không phải mọi hệ thống đều có chức năng giống nhau.
      </figcaption>
    </figure>
  )
}
