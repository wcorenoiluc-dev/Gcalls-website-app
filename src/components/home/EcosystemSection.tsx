import { ArrowRight, Bot, Cloud, Headphones, Layers, LifeBuoy, MonitorSmartphone, MousePointerClick, Globe2, ShoppingCart, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "@/config/navigation";
import { leadCtaHref } from "@/lib/leads/ctaLink";

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

const products: EcosystemCard[] = [
  {
    name: "Gcalls Plus Webphone",
    icon: MonitorSmartphone,
    href: ROUTES.gcallsPlus,
    desc: "Tổng đài trên trình duyệt hỗ trợ nghe gọi, lịch sử cuộc gọi, ghi âm, danh bạ và theo dõi hoạt động đội ngũ.",
    color: "#673ab7",
    bg: "#f5f0fd",
  },
  {
    name: "QA/QC Center",
    supporting: "QC Bot AI",
    icon: Sparkles,
    href: ROUTES.qcCenter,
    desc: "Hỗ trợ chuyển giọng nói thành văn bản, phân tích từ khóa, chấm điểm theo tiêu chí và tổng hợp dữ liệu phục vụ kiểm soát chất lượng.",
    color: "#0891b2",
    bg: "#f0f9ff",
  },
  {
    name: "Gcalls CX",
    icon: Headphones,
    href: ROUTES.gcallsCx,
    desc: "Nền tảng Contact Center hỗ trợ quản lý tương tác đa kênh và quy trình chăm sóc khách hàng.",
    color: "#d97706",
    bg: "#fffbeb",
  },
];

const solutions: EcosystemCard[] = [
  /*
    VOICEBOT IS A SOLUTION, NOT A GCALLS PRODUCT.
    ---------------------------------------------------------------------------
    Two checkpoints acted on this card. HOME-CONTENT-AUDIT-CORRECTION-001 fixed
    the WORDING — it read "Voicebot AI" beside three offerings Gcalls does
    build, which positioned Gcalls as the owner of the voicebot engine. It is
    not; Gcalls advises, connects and integrates. GCALLS-WP-DEMO-FOUNDATION-001
    then fixed the PLACEMENT, moving it out of the "Sản phẩm" group into this
    one, which is what the corrected wording had been implying all along.

    Must NOT be reintroduced in any form: that Gcalls owns the voicebot engine
    or develops its AI components; that a voicebot replaces staff; a 24/7
    availability claim; or any success-rate or ROI figure. None has an evidence
    record. Do not move this card back into `products` without one.
    ---------------------------------------------------------------------------
  */
  {
    name: "Giải pháp tích hợp Voicebot AI",
    icon: Bot,
    href: ROUTES.voicebotAi,
    desc: "Gcalls tư vấn, kết nối và tích hợp Voicebot vào hệ thống tổng đài theo kịch bản và phạm vi triển khai của doanh nghiệp.",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    name: "Tổng đài tích hợp CRM",
    icon: Users,
    href: ROUTES.crmIntegration,
    desc: "Kết nối cuộc gọi với dữ liệu và quy trình trên CRM của doanh nghiệp.",
    color: "#673ab7",
    bg: "#f5f0fd",
  },
  {
    name: "Tổng đài tích hợp Helpdesk",
    icon: LifeBuoy,
    href: ROUTES.helpdeskIntegration,
    desc: "Đưa cuộc gọi vào quy trình hỗ trợ và ticket của đội CSKH.",
    color: "#0891b2",
    bg: "#f0f9ff",
  },
  {
    name: "Tổng đài tích hợp POS",
    icon: ShoppingCart,
    href: ROUTES.posIntegration,
    desc: "Kết nối cuộc gọi với dữ liệu bán hàng và đơn hàng trên hệ thống POS.",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    name: "Tổng đài quốc tế",
    icon: Globe2,
    href: ROUTES.internationalCalling,
    desc: "Đầu số và phương án liên lạc theo từng thị trường doanh nghiệp phục vụ.",
    color: "#0284c7",
    bg: "#e0f2fe",
  },
  {
    name: "Cloud Call Center",
    icon: Cloud,
    href: leadCtaHref({ intent: "consultation", source: "consultation", solution: "Cloud Call Center" }),
    ctaLabel: "Nhận tư vấn",
    desc: "Hệ thống tổng đài vận hành trên nền tảng Cloud với SIP, IVR và điều hướng cuộc gọi.",
    color: "#7c3aed",
    bg: "#f3f0fe",
  },
  {
    name: "Call Button Widget",
    icon: MousePointerClick,
    href: leadCtaHref({ intent: "consultation", source: "consultation", solution: "Call Button Widget" }),
    ctaLabel: "Nhận tư vấn",
    desc: "Nút gọi nhúng vào website để khách truy cập để lại số điện thoại cho đội ngũ liên hệ lại.",
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
            HỆ SINH THÁI GCALLS
          </div>

          <h2
            id="home-ecosystem-heading"
            className="font-extrabold tracking-tight mb-5"
            style={{ fontSize: "clamp(26px, 3.2vw, 42px)", color: "#1e2026", lineHeight: 1.15 }}
          >
            Hệ sinh thái sản phẩm và{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              giải pháp Gcalls
            </span>
          </h2>

          <p className="text-base leading-relaxed" style={{ color: "#5b5f6b", fontSize: "17px" }}>
            Doanh nghiệp có thể bắt đầu từ một sản phẩm phù hợp với nhu cầu hiện tại, sau đó
            mở rộng sang các giải pháp tích hợp khi quy mô vận hành thay đổi.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          <Group
            id="home-ecosystem-products"
            eyebrow="Sản phẩm"
            title="Sản phẩm Gcalls"
            /*
              Reworded twice, both times to stop this line asserting more than
              the cards below it. It first read "Bốn sản phẩm nền tảng cho…",
              which counted the Voicebot integration as a fourth Gcalls-built
              product; it then had to carry a Voicebot clause while that card
              still sat in this group. With the card moved to "Giải pháp" the
              clause is gone too, and the line now describes exactly the three
              products Gcalls does build.
            */
            lead="Ba nền tảng Gcalls xây dựng cho hoạt động nghe gọi, kiểm soát chất lượng và chăm sóc khách hàng đa kênh."
            cards={products}
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          />

          <Group
            id="home-ecosystem-solutions"
            eyebrow="Giải pháp"
            title="Giải pháp Gcalls"
            lead="Các cấu hình triển khai theo hệ thống, thị trường và nhu cầu tự động hóa doanh nghiệp đang vận hành."
            cards={solutions}
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          />
        </div>

        {/* Overview CTAs — wayfinding, deliberately untagged for lead attribution. */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={ROUTES.products}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
            style={{ background: "#673ab7", color: "#fff", boxShadow: "0 4px 20px rgba(103,58,183,0.30)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#5929a8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#673ab7"; }}
          >
            Xem tất cả sản phẩm
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link
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
            Xem tất cả giải pháp
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
}
