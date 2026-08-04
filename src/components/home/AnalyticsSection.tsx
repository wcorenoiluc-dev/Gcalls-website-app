import { useState } from "react";
import { ROUTES } from '@/config/navigation';
import { Link } from "react-router";
import { Activity, ArrowRight, ArrowUpRight, BarChart2, Check, ChevronRight, Clock, HeadphonesIcon, PhoneCall, PhoneIncoming, PhoneMissed, PhoneOutgoing, Settings, Star, TrendingUp } from "lucide-react";
import { stageClass, stageMainClass, stageFloatClass } from "@/components/common/ResponsiveProductVisual";

// ─── Section 6: Analytics ────────────────────────────────────────────────────

const analyticsFeatures = [
  "Thống kê cuộc gọi theo ngày, tuần, tháng",
  "Theo dõi hiệu suất từng nhân viên",
  "Báo cáo cuộc gọi đến và đi",
  "Theo dõi cuộc gọi nhỡ",
  "Đo lường thời lượng cuộc gọi",
  "Dashboard realtime",
];

const kpiCards = [
  { value: "Live",   label: "Tỷ lệ bắt máy realtime",     icon: PhoneCall,  color: "#673ab7", trend: "Minh họa" },
  { value: "Cuộc gọi", label: "Theo dõi theo tháng",     icon: BarChart2,  color: "#0891b2", trend: "Dashboard" },
  { value: "3m25s",  label: "Thời lượng trung bình",       icon: Clock,      color: "#16a34a", trend: "-0:12" },
  { value: "Live",   label: "Cập nhật liên tục",           icon: Activity,   color: "#d97706", trend: "Realtime" },
];

// Bar chart data – 7 days
const barData = [
  { day: "T2", out: 62, in: 48, missed: 7 },
  { day: "T3", out: 78, in: 55, missed: 5 },
  { day: "T4", out: 55, in: 42, missed: 9 },
  { day: "T5", out: 91, in: 67, missed: 4 },
  { day: "T6", out: 84, in: 60, missed: 6 },
  { day: "T7", out: 40, in: 31, missed: 11 },
  { day: "CN", out: 22, in: 18, missed: 8 },
];
const maxBar = 100;

const agentRows = [
  { name: "Nguyễn Hằng",    avatar: "NH", color: "#673ab7", out: 38, in: 29, missed: 2, rate: "97%",  dur: "3:52" },
  { name: "Trần M. Tuấn",   avatar: "TT", color: "#0891b2", out: 31, in: 22, missed: 4, rate: "92%",  dur: "4:10" },
  { name: "Lê P. Linh",     avatar: "LL", color: "#16a34a", out: 44, in: 35, missed: 1, rate: "98%",  dur: "3:18" },
  { name: "Phạm Đ. Dương",  avatar: "PD", color: "#d97706", out: 19, in: 14, missed: 6, rate: "86%",  dur: "5:04" },
];

const metricCards = [
  { label: "Cuộc gọi đến",       value: "284",   unit: "cuộc",  icon: PhoneIncoming, color: "#16a34a", bg: "#f0fdf4",  change: "+12%",  up: true },
  { label: "Cuộc gọi đi",        value: "391",   unit: "cuộc",  icon: PhoneOutgoing, color: "#673ab7", bg: "#f5f0fd",  change: "+8%",   up: true },
  { label: "Cuộc gọi nhỡ",       value: "23",    unit: "cuộc",  icon: PhoneMissed,   color: "#ef4444", bg: "#fff1f2",  change: "-5%",   up: false },
  { label: "Thời lượng TB",       value: "3:25",  unit: "phút",  icon: Clock,         color: "#0891b2", bg: "#f0f9ff",  change: "-0:12", up: false },
  { label: "Tỷ lệ bắt máy",      value: "—",     unit: "",      icon: TrendingUp,    color: "#d97706", bg: "#fffbeb",  change: "Minh họa", up: true },
  { label: "Hiệu suất nhân viên", value: "4.7",   unit: "/ 5",  icon: Star,          color: "#7c3aed", bg: "#f5f0ff",  change: "+0.3",  up: true },
];

const analyticUseCases = [
  { role: "Sales Manager",    icon: BarChart2,     color: "#673ab7", bg: "#f5f0fd",  desc: "Theo dõi KPI từng nhân viên Sales, phân tích tỷ lệ chốt deal và hiệu quả cuộc gọi." },
  { role: "CSKH Manager",     icon: HeadphonesIcon,color: "#0891b2", bg: "#f0f9ff",  desc: "Giám sát chất lượng phục vụ, theo dõi thời gian xử lý và mức độ hài lòng khách hàng." },
  { role: "Business Owner",   icon: TrendingUp,    color: "#16a34a", bg: "#f0fdf4",  desc: "Nắm tổng quan hiệu suất vận hành, so sánh theo giai đoạn và ra quyết định chiến lược." },
  { role: "Operation Team",   icon: Settings,      color: "#d97706", bg: "#fffbeb",  desc: "Cấu hình báo cáo tự động, phân tích tắc nghẽn luồng cuộc gọi và tối ưu phân công." },
];

export function AnalyticsDashboardMockup() {
  const [range, setRange] = useState<"day" | "week" | "month">("week");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const summaryKPIs = [
    { label: "Tổng cuộc gọi", value: "675", icon: PhoneCall,  color: "#673ab7" },
    { label: "Bắt máy",       value: "638", icon: Check,      color: "#16a34a" },
    { label: "Cuộc gọi nhỡ", value: "37",  icon: PhoneMissed,color: "#ef4444" },
    { label: "TB thời lượng", value: "3:25",icon: Clock,       color: "#0891b2" },
  ];

  return (
    <div
      className="rounded-3xl overflow-hidden w-full"
      style={{
        background: "#fff",
        boxShadow: "0 32px 80px rgba(103,58,183,0.16), 0 4px 16px rgba(0,0,0,0.06)",
        border: "1px solid rgba(103,58,183,0.12)",
        fontFamily: "'Inter', sans-serif",
        maxWidth: "580px",
      }}
    >
      {/* Chrome */}
      <div className="flex items-center justify-between px-5 py-3.5" style={{ background: "#673ab7" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/25" />)}
          </div>
          <span className="text-xs text-white/75 font-medium ml-1.5">Analytics Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          {(["day","week","month"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all"
              style={{
                background: range === r ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.15)",
                color: range === r ? "#673ab7" : "rgba(255,255,255,0.85)",
              }}
            >
              {r === "day" ? "Ngày" : r === "week" ? "Tuần" : "Tháng"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-4 gap-px" style={{ background: "rgba(103,58,183,0.06)" }}>
        {summaryKPIs.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={10} color={k.color} />
                <span className="text-[10px]" style={{ color: "#9ca3af" }}>{k.label}</span>
              </div>
              <div className="text-lg font-extrabold tabular-nums" style={{ color: "#1e2026", fontFamily: "'DM Mono', monospace" }}>{k.value}</div>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold" style={{ color: "#1e2026" }}>Cuộc gọi theo ngày</span>
          <div className="flex items-center gap-3">
            {[{ label: "Đi", color: "#673ab7" }, { label: "Đến", color: "#0891b2" }, { label: "Nhỡ", color: "#fca5a5" }].map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
                <span className="text-[10px]" style={{ color: "#9ca3af" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end gap-2 h-28">
          {barData.map((d, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-0.5 cursor-pointer"
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* Tooltip */}
              {hoveredBar === i && (
                <div
                  className="absolute z-20 text-[9px] px-2 py-1 rounded-lg pointer-events-none"
                  style={{
                    background: "#1e2026",
                    color: "#fff",
                    transform: "translateY(-28px)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {d.out + d.in + d.missed} cuộc
                </div>
              )}
              <div className="w-full flex flex-col gap-px" style={{ height: "96px", justifyContent: "flex-end" }}>
                <div
                  className="w-full rounded-t transition-all duration-200"
                  style={{
                    height: `${(d.out / maxBar) * 60}px`,
                    background: hoveredBar === i ? "#5929a8" : "#673ab7",
                    opacity: hoveredBar !== null && hoveredBar !== i ? 0.5 : 1,
                  }}
                />
                <div
                  className="w-full transition-all duration-200"
                  style={{
                    height: `${(d.in / maxBar) * 60}px`,
                    background: hoveredBar === i ? "#0770a8" : "#0891b2",
                    opacity: hoveredBar !== null && hoveredBar !== i ? 0.5 : 1,
                  }}
                />
                <div
                  className="w-full rounded-b transition-all duration-200"
                  style={{
                    height: `${(d.missed / maxBar) * 60}px`,
                    background: "#fca5a5",
                    opacity: hoveredBar !== null && hoveredBar !== i ? 0.5 : 1,
                  }}
                />
              </div>
              <span className="text-[9px] mt-1" style={{ color: "#9ca3af" }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Agent performance table */}
      <div style={{ borderTop: "1px solid rgba(103,58,183,0.08)" }}>
        <div className="flex items-center justify-between px-5 py-2.5">
          <span className="text-xs font-bold" style={{ color: "#1e2026" }}>Hiệu suất nhân viên</span>
          <span className="text-[10px]" style={{ color: "#673ab7", cursor: "pointer" }}>Xem tất cả →</span>
        </div>
        {/* Table header */}
        <div className="grid px-5 py-1.5" style={{ gridTemplateColumns: "1fr 44px 44px 36px 52px 48px", borderBottom: "1px solid rgba(103,58,183,0.06)", gap: "0 8px" }}>
          {["Nhân viên", "Đi", "Đến", "Nhỡ", "Bắt máy", "TB"].map((h) => (
            <span key={h} className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "#9ca3af" }}>{h}</span>
          ))}
        </div>
        {agentRows.map((a, i) => (
          <div
            key={i}
            className="grid items-center px-5 py-2 transition-colors"
            style={{ gridTemplateColumns: "1fr 44px 44px 36px 52px 48px", borderBottom: "1px solid rgba(103,58,183,0.04)", gap: "0 8px" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#fbf9ff")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0" style={{ background: a.color + "18", color: a.color }}>{a.avatar}</div>
              <span className="text-[11px] font-medium truncate" style={{ color: "#1e2026" }}>{a.name}</span>
            </div>
            <span className="text-[11px] tabular-nums font-medium" style={{ color: "#673ab7", fontFamily: "'DM Mono',monospace" }}>{a.out}</span>
            <span className="text-[11px] tabular-nums font-medium" style={{ color: "#0891b2", fontFamily: "'DM Mono',monospace" }}>{a.in}</span>
            <span className="text-[11px] tabular-nums font-medium" style={{ color: "#ef4444", fontFamily: "'DM Mono',monospace" }}>{a.missed}</span>
            {/* Rate bar */}
            <div className="flex items-center gap-1.5">
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(103,58,183,0.10)" }}>
                <div className="h-full rounded-full" style={{ width: a.rate, background: parseFloat(a.rate) >= 95 ? "#16a34a" : parseFloat(a.rate) >= 90 ? "#d97706" : "#ef4444" }} />
              </div>
              <span className="text-[9px] font-bold tabular-nums" style={{ color: "#1e2026", fontFamily: "'DM Mono',monospace" }}>{a.rate}</span>
            </div>
            <span className="text-[10px] tabular-nums" style={{ color: "#5b5f6b", fontFamily: "'DM Mono',monospace" }}>{a.dur}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsSection() {
  return (
    <section className="py-28 overflow-hidden" style={{ background: "#fff", fontFamily: "'Open Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* ── 2-col hero ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center mb-20">

          {/* Left copy */}
          <div className="flex flex-col gap-7 order-2 lg:order-1">
            <div
              className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ background: "rgba(103,58,183,0.08)", color: "#673ab7", letterSpacing: "0.08em" }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#673ab7" }} />
              Analytics & KPI Dashboard
            </div>

            <div>
              <h2
                className="font-extrabold tracking-tight mb-5"
                style={{ fontSize: "clamp(26px, 3.2vw, 42px)", color: "#1e2026", lineHeight: 1.14 }}
              >
                Theo dõi hiệu suất đội ngũ{" "}
                <span style={{ background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  theo thời gian thực
                </span>
              </h2>
              <p style={{ color: "#5b5f6b", fontSize: "16px", lineHeight: 1.7, maxWidth: "480px" }}>
                Dashboard trực quan giúp quản lý theo dõi tình trạng cuộc gọi, hiệu suất nhân viên và chất lượng vận hành chỉ trong vài giây.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {analyticsFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(103,58,183,0.10)" }}>
                    <Check size={11} color="#673ab7" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#5b5f6b" }}>{f}</span>
                </div>
              ))}
            </div>

            {/* KPI stat pills */}
            <div className="grid grid-cols-2 gap-3 pt-2" style={{ borderTop: "1px solid rgba(103,58,183,0.10)" }}>
              {kpiCards.map((k) => {
                const Icon = k.icon;
                return (
                  <div
                    key={k.label}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ background: k.color + "0c", border: `1px solid ${k.color}20` }}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: k.color + "18" }}>
                      <Icon size={14} color={k.color} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-base font-extrabold leading-none mb-0.5" style={{ color: "#1e2026", fontFamily: "'DM Mono', monospace" }}>{k.value}</div>
                      <div className="text-[11px]" style={{ color: "#5b5f6b" }}>{k.label}</div>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: k.color + "15", color: k.color }}>{k.trend}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right mockup */}
          <div className={`${stageClass} flex items-center justify-center order-1 lg:order-2`} style={{ minHeight: "520px" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: "500px", height: "500px", background: "radial-gradient(circle, rgba(103,58,183,0.08) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
            <div className={stageMainClass} style={{ maxWidth: "580px", zIndex: 2 }}>
              <AnalyticsDashboardMockup />
            </div>
            {/* Floating KPI cards */}
            {kpiCards.map((k, i) => {
              const Icon = k.icon;
              const positions = [
                { top: "-12px", left: "-16px" },
                { top: "-12px", right: "-16px" },
                { bottom: "80px", left: "-24px" },
                { bottom: "16px", right: "-20px" },
              ];
              return (
                <div
                  key={i}
                  className={`${stageFloatClass} flex items-center gap-2.5 px-3.5 py-3 rounded-2xl`}
                  style={{
                    ...positions[i],
                    background: "#fff",
                    boxShadow: "0 8px 28px rgba(103,58,183,0.13), 0 1px 4px rgba(0,0,0,0.04)",
                    border: "1px solid rgba(103,58,183,0.10)",
                    zIndex: 10,
                    fontFamily: "'Inter', sans-serif",
                    minWidth: "152px",
                  }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: k.color + "15" }}>
                    <Icon size={14} color={k.color} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold leading-none mb-0.5" style={{ color: "#1e2026", fontFamily: "'DM Mono', monospace" }}>{k.value}</div>
                    <div className="text-[10px]" style={{ color: "#5b5f6b" }}>{k.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom highlight ── */}
        <div
          className="rounded-3xl px-10 py-12 mb-12 flex flex-col md:flex-row items-center gap-10 md:gap-16"
          style={{ background: "#f6f3fc", border: "1px solid rgba(103,58,183,0.10)" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)", boxShadow: "0 8px 24px rgba(103,58,183,0.30)" }}
          >
            <BarChart2 size={28} color="#fff" strokeWidth={1.8} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3
              className="font-extrabold mb-3"
              style={{ fontSize: "clamp(18px, 2.2vw, 28px)", color: "#1e2026", lineHeight: 1.2 }}
            >
              Ra quyết định nhanh hơn với{" "}
              <span style={{ color: "#673ab7" }}>dữ liệu trực quan</span>
            </h3>
            <p className="text-base leading-relaxed" style={{ color: "#5b5f6b", maxWidth: "560px" }}>
              Không cần tổng hợp báo cáo thủ công từ nhiều nguồn. Mọi chỉ số quan trọng đều được hiển thị trực quan giúp quản lý nhanh chóng nắm bắt tình hình vận hành.
            </p>
          </div>
          <Link
                to={ROUTES.gcallsPlus}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm flex-shrink-0 transition-all duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
            style={{ background: "#673ab7", color: "#fff", boxShadow: "0 4px 20px rgba(103,58,183,0.30)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#5929a8"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#673ab7"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            Khám phá Analytics
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* ── Block 2: 6 metric cards ── */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="font-extrabold" style={{ fontSize: "clamp(18px, 2.2vw, 28px)", color: "#1e2026" }}>
              Các chỉ số quan trọng trong{" "}
              <span style={{ color: "#673ab7" }}>một màn hình</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metricCards.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 cursor-default"
                  style={{ background: m.bg, border: `1px solid ${m.color}18` }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 12px 32px ${m.color}20`)}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: m.color + "18" }}>
                    <Icon size={16} color={m.color} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold tabular-nums leading-none mb-1" style={{ color: "#1e2026", fontFamily: "'DM Mono', monospace" }}>
                      {m.value}<span className="text-xs font-normal ml-0.5" style={{ color: "#9ca3af" }}>{m.unit}</span>
                    </div>
                    <div className="text-[11px] font-medium leading-tight mb-1.5" style={{ color: "#5b5f6b" }}>{m.label}</div>
                    <div className="flex items-center gap-1">
                      <ArrowUpRight size={10} color={m.up ? "#16a34a" : "#ef4444"} style={{ transform: m.up ? "none" : "rotate(90deg)" }} />
                      <span className="text-[10px] font-bold" style={{ color: m.up ? "#16a34a" : "#ef4444" }}>{m.change}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Block 3: use case grid ── */}
        <div>
          <div className="text-center mb-8">
            <h3 className="font-extrabold" style={{ fontSize: "clamp(18px, 2.2vw, 28px)", color: "#1e2026" }}>
              Dành cho{" "}
              <span style={{ color: "#673ab7" }}>quản lý, trưởng nhóm và chủ doanh nghiệp</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {analyticUseCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <div
                  key={uc.role}
                  className="rounded-2xl p-6 transition-all duration-200"
                  style={{ background: "#fff", border: `1px solid ${uc.color}18`, boxShadow: "0 2px 12px rgba(103,58,183,0.05)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${uc.color}18`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(103,58,183,0.05)"; }}
                >
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: uc.bg }}>
                    <Icon size={20} color={uc.color} strokeWidth={1.8} />
                  </div>
                  <div className="text-sm font-bold mb-2.5" style={{ color: "#1e2026" }}>{uc.role}</div>
                  <p className="text-sm leading-relaxed" style={{ color: "#5b5f6b" }}>{uc.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: uc.color }}>
                    Tìm hiểu thêm <ChevronRight size={13} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
