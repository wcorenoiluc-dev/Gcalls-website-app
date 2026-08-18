import { Check, Code2, MousePointerClick, Zap } from "lucide-react";
import { WidgetMockup } from "./IntegrationsSection";
import { ecosystemGroups } from "./sectionData";

// ─── Section 10: Call Button Widget & Integration Ecosystem ──────────────────

/**
 * Promoted out of the old integrations monolith, where these were "Block 4"
 * (widget) and "Block 5" (ecosystem grid). They are one section because the
 * approved structure pairs them: the widget creates the call, the ecosystem
 * grid shows where that call's data can go.
 *
 * Withheld here, deliberately: "kết nối trong 5 giây" from the source content.
 * Connection time depends on agent availability and carrier routing, so it is
 * the same family of claim as the withheld deployment-time figures.
 */

const widgetBenefits = [
  { label: "Tăng tỷ lệ chuyển đổi từ visitor thành lead", color: "#673ab7" },
  { label: "Thu thập số điện thoại và gọi lại tức thì", color: "#0891b2" },
  { label: "Theo dõi nguồn cuộc gọi từ từng trang web", color: "#16a34a" },
];

export function CallWidgetSection() {
  return (
    <section
      aria-labelledby="home-call-widget-heading"
      className="py-24 overflow-hidden"
      style={{ background: "#fff", fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* ── Widget ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center mb-16">
          {/* Left: widget mockup */}
          <div className="flex items-center justify-center min-w-0 order-2 lg:order-1">
            <WidgetMockup />
          </div>

          {/* Right copy */}
          <div className="flex flex-col gap-6 order-1 lg:order-2">
            <div
              className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ background: "rgba(103,58,183,0.10)", color: "#673ab7", letterSpacing: "0.08em" }}
            >
              <MousePointerClick size={11} color="#673ab7" aria-hidden="true" />
              Call Button Widget
            </div>

            <h2
              id="home-call-widget-heading"
              className="font-extrabold tracking-tight"
              style={{ fontSize: "clamp(26px, 3.2vw, 42px)", color: "#1e2026", lineHeight: 1.14 }}
            >
              Biến khách truy cập website{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                thành cuộc gọi
              </span>
            </h2>

            <p style={{ color: "#5b5f6b", fontSize: "16px", lineHeight: 1.7, maxWidth: "500px" }}>
              Nhúng nút gọi vào website chỉ với vài dòng code. Khách truy cập để lại số
              điện thoại và đội ngũ gọi lại theo cấu hình phân phối cuộc gọi của doanh nghiệp.
            </p>

            <ul className="flex flex-col gap-2.5">
              {widgetBenefits.map((b) => (
                <li key={b.label} className="flex items-start gap-2.5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: b.color + "15" }}
                    aria-hidden="true"
                  >
                    <Check size={11} color={b.color} strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: "#5b5f6b" }}>{b.label}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "#f0ecf9" }}>
                <Code2 size={12} color="#673ab7" aria-hidden="true" />
                <span className="text-xs font-semibold" style={{ color: "#673ab7" }}>{"<script>"} 1 dòng</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "#f0fdf4" }}>
                <Zap size={12} color="#16a34a" aria-hidden="true" />
                <span className="text-xs font-semibold" style={{ color: "#16a34a" }}>Gọi lại theo cấu hình</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Integration ecosystem ── */}
        <div
          className="rounded-3xl p-6 sm:p-8"
          style={{ background: "#f6f3fc", border: "1px solid rgba(103,58,183,0.09)" }}
        >
          <div className="text-center mb-8">
            <h3 className="font-extrabold mb-2" style={{ fontSize: "clamp(18px, 2.2vw, 26px)", color: "#1e2026" }}>
              Hệ sinh thái <span style={{ color: "#673ab7" }}>tích hợp của Gcalls</span>
            </h3>
            {/* "phổ biến nhất" is an unsupported superlative — dropped. */}
            <p className="text-sm" style={{ color: "#5b5f6b" }}>
              Các nền tảng Gcalls có thể kết nối, theo phạm vi tích hợp được xác nhận
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ecosystemGroups.map((group) => {
              const GroupIcon = group.icon;
              return (
                <div
                  key={group.category}
                  className="rounded-2xl p-5"
                  style={{ background: "#fff", border: `1px solid ${group.color}18`, boxShadow: "0 2px 10px rgba(103,58,183,0.05)" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center"
                      style={{ background: group.color + "15" }}
                      aria-hidden="true"
                    >
                      <GroupIcon size={14} color={group.color} strokeWidth={2} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: "#1e2026" }}>{group.category}</span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {group.tools.map((t) => (
                      <li
                        key={t.name}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl"
                        style={{ background: "#f9f7fe" }}
                      >
                        <span
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                          style={{ background: t.color + "18", color: t.color }}
                          aria-hidden="true"
                        >
                          {t.abbr}
                        </span>
                        <span className="text-xs font-medium" style={{ color: "#5b5f6b" }}>{t.name}</span>
                        <span
                          className="w-1.5 h-1.5 rounded-full ml-auto flex-shrink-0"
                          style={{ background: "#22c55e" }}
                          aria-hidden="true"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
