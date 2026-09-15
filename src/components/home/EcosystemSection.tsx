import { ArrowRight, Bot, Cloud, Headphones, Layers, LifeBuoy, MonitorSmartphone, MousePointerClick, Globe2, ShoppingCart, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { ctaAttrs } from "@/components/common/Button";
import { ROUTES } from "@/config/navigation";
import { leadCtaHref } from "@/lib/leads/ctaLink";
import { HOME_ECOSYSTEM } from "./homeContent";
import { useGcallsContent } from "@/lib/gcallsContent/useGcallsContent";

// ─── Section 4: Gcalls product & solution ecosystem ──────────────────────────

/**
 * The homepage's single map of what Gcalls sells.
 *
 * ---------------------------------------------------------------------------
 * EVERY CARD LINKS TO A ROUTE THAT EXISTS
 * ---------------------------------------------------------------------------
 * `href` is either a `ROUTES.*` value — so it cannot drift from the route
 * registry — or, where an offering has no page of its own yet (Cloud Call
 * Center, Call Button Widget), the canonical lead route carrying that
 * offering's context. There is deliberately no third option: inventing a
 * plausible-looking path here is how a homepage grows dead links.
 *
 * Descriptions state what each product DOES. None of them may acquire a
 * coverage figure ("chấm điểm 100% cuộc gọi"), a scale figure, or a setup-time
 * figure without an approved evidence record.
 * ---------------------------------------------------------------------------
 */

interface EcosystemCard {
  name: string;
  supporting?: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  /** Shown instead of "Tìm hiểu thêm" when the card routes to the lead form. */
  ctaLabel?: string;
  color: string;
  bg: string;
}

/**
 * Icon, route and colour per card, by index. Names and descriptions live in
 * homeContent.ts so Content Studio can edit the words but never the target.
 */
const productStyles = [
  { icon: MonitorSmartphone, href: ROUTES.gcallsPlus, color: "#673ab7", bg: "#f5f0fd" },
  { icon: Sparkles, href: ROUTES.qcCenter, color: "#0891b2", bg: "#f0f9ff" },
  { icon: Headphones, href: ROUTES.gcallsCx, color: "#d97706", bg: "#fffbeb" },
];
const solutionStyles = [
  { icon: Bot, href: ROUTES.voicebotAi, color: "#16a34a", bg: "#f0fdf4" },
  { icon: Users, href: ROUTES.crmIntegration, color: "#673ab7", bg: "#f5f0fd" },
  { icon: LifeBuoy, href: ROUTES.helpdeskIntegration, color: "#0891b2", bg: "#f0f9ff" },
  { icon: ShoppingCart, href: ROUTES.posIntegration, color: "#16a34a", bg: "#f0fdf4" },
  { icon: Globe2, href: ROUTES.internationalCalling, color: "#0284c7", bg: "#e0f2fe" },
  {
    icon: Cloud,
    href: leadCtaHref({ intent: "consultation", source: "consultation", solution: "Cloud Call Center" }),
    ctaLabel: "Nhận tư vấn",
    color: "#7c3aed",
    bg: "#f3f0fe",
  },
  {
    icon: MousePointerClick,
    href: leadCtaHref({ intent: "consultation", source: "consultation", solution: "Call Button Widget" }),
    ctaLabel: "Nhận tư vấn",
    color: "#d97706",
    bg: "#fffbeb",
  },
];

function Card({ card }: { card: EcosystemCard }) {
  const Icon = card.icon;

  return (
    <Link
      to={card.href}
      className="group flex flex-col rounded-2xl p-6 h-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
      style={{
        background: "#fff",
        border: `1px solid ${card.color}1a`,
        boxShadow: "0 2px 12px rgba(103,58,183,0.05)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${card.color}1f`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "none";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(103,58,183,0.05)";
      }}
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 flex-shrink-0"
        style={{ background: card.bg }}
      >
        <Icon size={20} color={card.color} strokeWidth={1.8} aria-hidden="true" />
      </div>

      <div className="text-[15px] font-bold leading-snug" style={{ color: "#1e2026" }}>
        {card.name}
      </div>
      {card.supporting && (
        <div className="text-xs font-semibold mt-1" style={{ color: card.color }}>
          {card.supporting}
        </div>
      )}

      <p className="text-sm leading-relaxed mt-2.5 flex-1" style={{ color: "#5b5f6b" }}>
        {card.desc}
      </p>

      <span
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold"
        style={{ color: card.color }}
      >
        {card.ctaLabel ?? "Tìm hiểu thêm"}
        <ArrowRight
          size={13}
          className="transition-transform duration-150 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

function Group({
  id,
  eyebrow,
  title,
  lead,
  cards,
  columns,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  cards: EcosystemCard[];
  columns: string;
}) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase mb-3"
            style={{ background: "rgba(103,58,183,0.08)", color: "#673ab7", letterSpacing: "0.08em" }}
          >
            {eyebrow}
          </div>
          <h3 id={id} className="font-extrabold" style={{ fontSize: "clamp(20px, 2.4vw, 28px)", color: "#1e2026" }}>
            {title}
          </h3>
        </div>
        <p className="text-sm leading-relaxed sm:text-right sm:max-w-sm" style={{ color: "#5b5f6b" }}>
          {lead}
        </p>
      </div>

      <ul className={`grid gap-5 ${columns}`}>
        {cards.map((card) => (
          <li key={card.name} className="h-full">
            <Card card={card} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EcosystemSection() {
  const content = useGcallsContent('/', 'ecosystem', HOME_ECOSYSTEM);
  const products: EcosystemCard[] = content.products.map((card, i) => ({
    ...productStyles[i % productStyles.length],
    name: card.name,
    desc: card.desc,
    supporting: card.supporting || undefined,
  }));
  const solutions: EcosystemCard[] = content.solutions.map((card, i) => ({
    ...solutionStyles[i % solutionStyles.length],
    name: card.name,
    desc: card.desc,
  }));
  return (
    <section
      id="home-ecosystem"
      aria-labelledby="home-ecosystem-heading"
      className="py-24 scroll-mt-24"
      style={{ background: "#faf8ff", fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
            style={{ background: "rgba(103,58,183,0.08)", color: "#673ab7", letterSpacing: "0.08em" }}
          >
            <Layers size={12} aria-hidden="true" />
            {content.badge}
          </div>

          <h2
            id="home-ecosystem-heading"
            className="font-extrabold tracking-tight mb-5"
            style={{ fontSize: "clamp(26px, 3.2vw, 42px)", color: "#1e2026", lineHeight: 1.15 }}
          >
            {content.heading}{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {content.headingHighlight}
            </span>
          </h2>

          <p className="text-base leading-relaxed" style={{ color: "#5b5f6b", fontSize: "17px" }}>
            {content.description}
          </p>
        </div>

        <div className="flex flex-col gap-16">
          <Group
            id="home-ecosystem-products"
            eyebrow={content.productsEyebrow}
            title={content.productsTitle}
            /*
              Reworded twice, both times to stop this line asserting more than
              the cards below it. It first read "Bốn sản phẩm nền tảng cho…",
              which counted the Voicebot integration as a fourth Gcalls-built
              product; it then had to carry a Voicebot clause while that card
              still sat in this group. With the card moved to "Giải pháp" the
              clause is gone too, and the line now describes exactly the three
              products Gcalls does build.
            */
            lead={content.productsLead}
            cards={products}
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          />

          <Group
            id="home-ecosystem-solutions"
            eyebrow={content.solutionsEyebrow}
            title={content.solutionsTitle}
            lead={content.solutionsLead}
            cards={solutions}
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          />
        </div>

        {/* Overview CTAs — wayfinding, deliberately untagged for lead attribution. */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <Link
            {...ctaAttrs('primary')}
            to={ROUTES.products}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
            style={{ background: "#673ab7", color: "#fff", boxShadow: "0 4px 20px rgba(103,58,183,0.30)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#5929a8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#673ab7"; }}
          >
            {content.primaryCtaLabel}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link
            {...ctaAttrs('outline')}
            to={ROUTES.solutions}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
            style={{
              background: "#fff",
              color: "#673ab7",
              border: "1.5px solid rgba(103,58,183,0.25)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#673ab7"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(103,58,183,0.25)"; }}
          >
            {content.secondaryCtaLabel}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
}
