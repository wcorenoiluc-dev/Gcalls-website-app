import { ArrowRight, BarChart3, Check, Globe2, MonitorSmartphone, Plug } from "lucide-react";
import { Link } from "react-router";
import { leadCtaHref } from "@/lib/leads/ctaLink";

// ─── Section 3: Solution Bridge ──────────────────────────────────────────────

/**
 * The pivot from problem to product.
 *
 * This block used to live at the bottom of `PainPointsSection` as a CTA banner.
 * It is now its own section because the approved homepage structure needs a
 * distinct bridge between the six pain points and the product/solution
 * ecosystem that follows — the visitor should read "here is the shape of the
 * answer" before being asked to choose a product.
 *
 * Claim register: every chip below names a CAPABILITY, not an outcome. The
 * withheld set for this page — setup time, integration counts, market counts,
 * uptime, latency — must not reappear here in any form.
 */
const chips = [
  { icon: MonitorSmartphone, label: "Vận hành trên trình duyệt" },
  { icon: Plug, label: "Tích hợp CRM, POS và Helpdesk" },
  { icon: Globe2, label: "Hỗ trợ nhu cầu liên lạc quốc tế" },
  { icon: BarChart3, label: "Báo cáo theo thời gian thực" },
];

export function SolutionBridgeSection() {
  return (
    <section
      aria-labelledby="home-solution-bridge-heading"
      className="pb-24"
      style={{ background: "#fff", fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div
          className="relative rounded-3xl overflow-hidden px-6 sm:px-10 py-12 sm:py-14"
          style={{ background: "linear-gradient(135deg, #673ab7 0%, #4c1d95 100%)" }}
        >
          {/* Decorative background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dotsBridge" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#fff" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotsBridge)" />
            </svg>
            <div
              className="absolute rounded-full"
              style={{
                width: "420px",
                height: "420px",
                top: "-160px",
                right: "-80px",
                background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: "300px",
                height: "300px",
                bottom: "-120px",
                left: "-60px",
                background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
              }}
            />
          </div>

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-9">
            <div className="lg:max-w-2xl">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5"
                style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.92)", letterSpacing: "0.08em" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
                GIẢI PHÁP TỔNG ĐÀI GCALLS
              </div>

              <h2
                id="home-solution-bridge-heading"
                className="font-extrabold mb-4 text-white"
                style={{ fontSize: "clamp(24px, 3vw, 38px)", lineHeight: 1.18 }}
              >
                Tổng Đài Thông Minh Gcalls: Bứt Phá Doanh Số Đội Ngũ &amp; Nâng Cao Trải Nghiệm Khách Hàng
              </h2>

              <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.76)" }}>
                Gcalls kết nối hoạt động nghe gọi, dữ liệu khách hàng, lịch sử chăm sóc và báo cáo
                vận hành trong một hệ thống thống nhất, đồng thời hỗ trợ tích hợp với CRM, Helpdesk,
                POS và các giải pháp tự động hóa phù hợp.
              </p>

              {/* Chips */}
              <ul className="flex flex-wrap gap-3 mt-7">
                {chips.map((chip) => {
                  const Icon = chip.icon;
                  return (
                    <li
                      key={chip.label}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium"
                      style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.18)" }}
                        aria-hidden="true"
                      >
                        <Check size={9} color="rgba(255,255,255,0.9)" strokeWidth={3} />
                      </span>
                      <Icon size={13} color="rgba(255,255,255,0.75)" strokeWidth={2} aria-hidden="true" />
                      {chip.label}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-start lg:items-end gap-4 flex-shrink-0 w-full lg:w-auto">
              {/*
                A plain in-page `<a href="#…">`, not a router `<Link>`: the
                target is the next section on this same page, so the browser
                scrolls it natively against a fully painted document. Routing it
                through `<Link>` would push a location change that `ScrollManager`
                then has to re-resolve — see the note in `common/Seo.tsx`.
              */}
              <a
                href="#home-ecosystem"
                /* No `whitespace-nowrap`: at 320px the label plus the 32px
                   horizontal padding overran the card and the arrow clipped.
                   Wrapping is the correct answer at that width — the CTA is
                   still one target, it is just two lines tall. */
                className="group flex w-full lg:w-auto items-center justify-center gap-2.5 px-5 sm:px-8 py-4 rounded-2xl font-bold text-[15px] text-center transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ background: "#fff", color: "#673ab7", boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.15)";
                }}
              >
                Khám phá hệ sinh thái Gcalls
                <ArrowRight size={16} className="flex-shrink-0 transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
              </a>

              <Link
                to={leadCtaHref({ intent: "consultation", source: "consultation" })}
                className="text-xs font-semibold underline underline-offset-4 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                Hoặc trao đổi trực tiếp với đội ngũ Gcalls
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
