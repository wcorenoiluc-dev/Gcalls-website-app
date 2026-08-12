import { Check, Phone, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { leadCtaHref } from "@/lib/leads/ctaLink";
import { remoteUseCases, wfaStats } from "./sectionData";

// ─── Section 13: Use Cases & Final CTA ───────────────────────────────────────

/**
 * The page's closing section, promoted out of `WorkFromAnywhereSection` where
 * it was "Block 5" (use cases) and "Block 6" (final CTA).
 *
 * ---------------------------------------------------------------------------
 * WHAT THE SOURCE CONTENT ASKED FOR AND WHY IT IS NOT ALL HERE
 * ---------------------------------------------------------------------------
 * The approved four use cases — Sales Team, Remote Team, Multi Branch, Contact
 * Center — are rendered from `remoteUseCases`, unchanged. Two things attached
 * to them in the source are NOT published:
 *
 *  · "ghi âm 100%" on the Contact Center card. A total-coverage claim; the same
 *    absolute is already blocked in `src/data/resources/types.ts`.
 *  · The closing microcopy "Không cần thẻ tín dụng · dùng thử 14 ngày ·
 *    onboarding 1-1". No trial, price or card policy is published anywhere on
 *    this site, so this would be the only place stating one.
 *
 * The two closing CTAs are the approved pair: "Đăng ký demo" and "Nhận tư vấn
 * giải pháp". Both route through the existing lead flow with their own intent,
 * so the form records which of the two a visitor chose.
 * ---------------------------------------------------------------------------
 */

export function UseCasesFinalCtaSection() {
  return (
    <section
      aria-labelledby="home-final-cta-heading"
      className="pb-28 overflow-hidden"
      style={{ background: "#fff", fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* Section header.
            The approved §13 headline is the section's own H2, at the top,
            rather than the CTA band's headline at the bottom — a section
            labelled by a heading that only appears after all of its content
            reads correctly to nobody, sighted or otherwise. */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
            style={{ background: "rgba(103,58,183,0.08)", color: "#673ab7", letterSpacing: "0.08em" }}
          >
            <Sparkles size={12} aria-hidden="true" />
            USE CASES
          </div>
          <h2
            id="home-final-cta-heading"
            className="font-extrabold tracking-tight mb-5"
            style={{ fontSize: "clamp(26px, 3.2vw, 42px)", color: "#1e2026", lineHeight: 1.15 }}
          >
            Tổng đài doanh nghiệp{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              luôn đồng hành
            </span>{" "}
            cùng đội ngũ của bạn
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#5b5f6b", fontSize: "17px" }}>
            Không cần phần cứng, không cần cài đặt phức tạp — chỉ cần trình duyệt và kết nối
            internet, đội ngũ của bạn đã có thể bắt đầu ngay.
          </p>
        </div>

        {/* ── Use cases ── */}
        <div className="mb-16">
          <div className="text-center mb-9">
            <h3
              className="font-extrabold tracking-tight"
              style={{ fontSize: "clamp(20px, 2.4vw, 28px)", color: "#1e2026", lineHeight: 1.18 }}
            >
              Gcalls phù hợp với{" "}
              <span style={{ color: "#673ab7" }}>mô hình đội ngũ nào</span>
            </h3>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {remoteUseCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <li
                  key={uc.role}
                  className="rounded-2xl p-6 transition-all duration-200"
                  style={{ background: "#fff", border: `1px solid ${uc.color}18`, boxShadow: "0 2px 10px rgba(103,58,183,0.05)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 36px ${uc.color}18`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(103,58,183,0.05)"; }}
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: uc.bg }}
                    aria-hidden="true"
                  >
                    <Icon size={20} color={uc.color} strokeWidth={1.8} />
                  </div>
                  <h4 className="text-sm font-bold mb-3" style={{ color: "#1e2026" }}>{uc.role}</h4>
                  <div className="flex flex-col gap-2">
                    {uc.points.map((pt) => (
                      <div key={pt} className="flex items-start gap-2">
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: uc.color + "15" }}
                          aria-hidden="true"
                        >
                          <Check size={9} color={uc.color} strokeWidth={3} />
                        </span>
                        <span className="text-xs leading-snug" style={{ color: "#5b5f6b" }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Final CTA ── */}
        <div
          className="relative rounded-3xl overflow-hidden px-6 sm:px-10 py-14 sm:py-16"
          style={{ background: "linear-gradient(135deg, #2d0e6e 0%, #673ab7 55%, #9c63d6 100%)" }}
        >
          <div aria-hidden="true">
            <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dotsFinalCta" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#fff" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotsFinalCta)" />
            </svg>
            <div
              className="absolute rounded-full pointer-events-none"
              style={{ width: "600px", height: "600px", top: "-240px", right: "-120px", background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)" }}
            />
          </div>

          <div className="relative flex flex-col lg:flex-row items-center gap-10">
            {/* Left: capability chips */}
            <ul className="grid grid-cols-2 gap-3 flex-shrink-0">
              {wfaStats.map((s) => {
                const Icon = s.icon;
                return (
                  <li
                    key={s.value}
                    className="flex flex-col items-center gap-2 px-5 py-4 rounded-2xl text-center"
                    style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    <span
                      className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.15)" }}
                      aria-hidden="true"
                    >
                      <Icon size={18} color="#fff" strokeWidth={1.8} />
                    </span>
                    <span className="text-sm font-extrabold text-white" style={{ fontFamily: "'DM Mono',monospace" }}>{s.value}</span>
                    <span className="text-[10px] text-center" style={{ color: "rgba(255,255,255,0.6)" }}>{s.label}</span>
                  </li>
                );
              })}
            </ul>

            {/* Right: copy + CTAs */}
            <div className="flex-1 text-center lg:text-left">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-5"
                style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
                Sẵn sàng triển khai cùng đội ngũ Gcalls
              </div>

              <h3
                className="font-extrabold text-white mb-4"
                style={{ fontSize: "clamp(22px, 2.8vw, 34px)", lineHeight: 1.15 }}
              >
                Bắt đầu với đội ngũ hiện tại của bạn
              </h3>

              <p className="mb-8" style={{ color: "rgba(255,255,255,0.70)", fontSize: "15px", lineHeight: 1.7 }}>
                Đội ngũ Gcalls trao đổi về quy mô, hệ thống đang dùng và quy trình vận hành để
                đề xuất cấu hình phù hợp trước khi triển khai.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  to={leadCtaHref({ intent: 'demo', source: 'consultation' })}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  style={{ background: "#fff", color: "#673ab7", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}
                >
                  <Phone size={15} aria-hidden="true" /> Đăng ký demo
                </Link>
                <Link
                  to={leadCtaHref({ intent: 'consultation', source: 'consultation' })}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.28)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.22)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)"}
                >
                  <Sparkles size={15} aria-hidden="true" /> Nhận tư vấn giải pháp
                </Link>
              </div>

              <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                Đội ngũ Gcalls hỗ trợ cấu hình và triển khai theo nhu cầu thực tế
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
