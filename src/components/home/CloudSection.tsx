import { useState } from "react";
import { ArrowRight, BarChart2, Check, ChevronRight, Cloud, GitBranch, Globe, HeadphonesIcon, Layers, Mic, MoreHorizontal, Network, Phone, PhoneForwarded, PhoneIncoming, Plus, RefreshCw, Server, Settings, Users, Voicemail, Wifi, Zap } from "lucide-react";
import { stageClass, stageMainClass, stageFloatClass } from "@/components/common/ResponsiveProductVisual";

// ─── Section 7: Cloud Call Center ────────────────────────────────────────────

const sipAccounts = [
  { ext: "101", name: "Nguyễn Hằng",    hotline: "1900 1234", status: "registered", calls: 3,  color: "#22c55e" },
  { ext: "102", name: "Trần M. Tuấn",   hotline: "1900 1234", status: "on-call",    calls: 1,  color: "#673ab7" },
  { ext: "103", name: "Lê P. Linh",     hotline: "1900 5678", status: "registered", calls: 0,  color: "#22c55e" },
  { ext: "104", name: "Phạm Đ. Dương",  hotline: "1900 5678", status: "offline",    calls: 0,  color: "#9ca3af" },
  { ext: "105", name: "Võ Thị Thanh",   hotline: "1900 1234", status: "registered", calls: 2,  color: "#22c55e" },
];

const hotlines = [
  { number: "1900 1234", label: "Sales",        agents: 3, active: 2, color: "#673ab7" },
  { number: "1900 5678", label: "CSKH",         agents: 2, active: 1, color: "#0891b2" },
  { number: "028 7109 xxxx", label: "VoIP DID", agents: 5, active: 4, color: "#16a34a" },
];

const ivrTree = [
  { level: 0, key: "root",   label: "Khách hàng gọi đến",  sub: "1900 1234",           color: "#673ab7" },
  { level: 1, key: "ivr1",   label: "IVR: Bấm phím",       sub: "1–Sales · 2–CSKH · 0–Lễ tân", color: "#7c3aed" },
  { level: 2, key: "route",  label: "Call Routing",         sub: "Theo nhân viên rảnh", color: "#0891b2" },
  { level: 2, key: "group",  label: "Ring Group",           sub: "Đổ đồng thời 3 agent",color: "#16a34a" },
  { level: 3, key: "agent",  label: "Agent nhận máy",       sub: "Ghi âm tự động",      color: "#d97706" },
];

const cloudFeatures = [
  "SIP Account Management",
  "IVR nhiều cấp",
  "Call Routing thông minh",
  "Nhóm đổ chuông",
  "Chuyển tiếp cuộc gọi",
  "Hotline đa đầu số",
];

const cloudFloats = [
  { value: "Cloud",     label: "Hạ tầng Cloud SaaS",       icon: Cloud,       color: "#673ab7" },
  { value: "SIP",       label: "SIP Extensions",           icon: Server,      color: "#0891b2" },
  { value: "IVR",       label: "Điều hướng thông minh",   icon: GitBranch,   color: "#16a34a" },
  { value: "Multi",     label: "Hotline đa đầu số",        icon: Globe,       color: "#d97706" },
];

const featureGrid = [
  { label: "SIP Account",         icon: Server,        color: "#673ab7", bg: "#f5f0fd",  desc: "Tài khoản SIP cho từng nhân viên, đa thiết bị" },
  { label: "IVR",                 icon: GitBranch,     color: "#7c3aed", bg: "#f3f0fe",  desc: "Cây menu tự động nhiều cấp, cấu hình linh hoạt" },
  { label: "Call Routing",        icon: Network,       color: "#0891b2", bg: "#f0f9ff",  desc: "Điều hướng thông minh theo kỹ năng, thời gian" },
  { label: "Ring Group",          icon: Users,         color: "#16a34a", bg: "#f0fdf4",  desc: "Đổ chuông đồng thời hoặc tuần tự nhiều agent" },
  { label: "Multi Branch",        icon: Layers,        color: "#0284c7", bg: "#e0f2fe",  desc: "Kết nối nhiều văn phòng, chi nhánh trên 1 hệ thống" },
  { label: "Số quốc tế",          icon: Globe,         color: "#059669", bg: "#ecfdf5",  desc: "DID nội địa & quốc tế, số ảo nhiều vùng" },
  { label: "Call Forwarding",     icon: PhoneForwarded,color: "#d97706", bg: "#fffbeb",  desc: "Chuyển tiếp đến di động, email hoặc voicemail" },
  { label: "Voicemail",           icon: Voicemail,     color: "#7c3aed", bg: "#f5f0ff",  desc: "Hộp thư thoại, nhận qua email, ghi âm lưu trữ" },
];

const flowSteps = [
  { label: "Khách hàng gọi đến", icon: Phone,         color: "#673ab7", note: "1900 1234 · 028 xxxx" },
  { label: "IVR",                icon: GitBranch,     color: "#7c3aed", note: "Bấm 1–Sales, 2–CSKH" },
  { label: "Call Routing",       icon: Network,       color: "#0891b2", note: "Phân phối thông minh" },
  { label: "Ring Group",         icon: Users,         color: "#16a34a", note: "Đổ chuông đồng thời" },
  { label: "Agent",              icon: HeadphonesIcon,color: "#d97706", note: "Nhân viên nhận máy" },
  { label: "Recording",          icon: Mic,           color: "#dc2626", note: "Ghi âm tự động cuộc gọi" },
  { label: "Analytics",          icon: BarChart2,     color: "#6d28d9", note: "Báo cáo realtime" },
];

const sipStatusLabel: Record<string, { label: string; bg: string; dot: string }> = {
  registered: { label: "Đã đăng ký", bg: "#dcfce7", dot: "#22c55e" },
  "on-call":  { label: "Đang gọi",   bg: "#ede8f9", dot: "#673ab7" },
  offline:    { label: "Ngoại tuyến", bg: "#f3f4f6", dot: "#9ca3af" },
};

function CloudMockup() {
  const [activeTab, setActiveTab] = useState<"sip" | "ivr" | "routing">("sip");

  return (
    <div
      className="rounded-3xl overflow-hidden w-full"
      style={{
        background: "#fff",
        boxShadow: "0 32px 80px rgba(103,58,183,0.16), 0 4px 16px rgba(0,0,0,0.06)",
        border: "1px solid rgba(103,58,183,0.12)",
        fontFamily: "'Inter', sans-serif",
        maxWidth: "570px",
      }}
    >
      {/* Chrome */}
      <div className="flex items-center justify-between px-5 py-3.5" style={{ background: "#673ab7" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/25" />)}
          </div>
          <span className="text-xs text-white/75 font-medium ml-1.5">Cloud Call Center</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-white/80 font-medium">SIP: Online</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.15)" }}>
            <Cloud size={11} color="rgba(255,255,255,0.85)" />
            <span className="text-[10px] text-white/80">Cloud SaaS</span>
          </div>
        </div>
      </div>

      {/* Tabs — wrap below `lg` so the trailing "Thêm" action is not clipped
          off the right edge of the card at mobile widths. */}
      <div className="flex px-4 pt-3 gap-1 max-lg:flex-wrap!" style={{ borderBottom: "1px solid rgba(103,58,183,0.08)" }}>
        {([
          { key: "sip",     label: "SIP Accounts" },
          { key: "ivr",     label: "IVR & Routing" },
          { key: "routing", label: "Hotlines" },
        ] as const).map((t) => (
          <button
            key={t.key}
            className="px-4 py-2 text-xs font-semibold rounded-t-lg transition-all duration-150"
            style={{
              color: activeTab === t.key ? "#673ab7" : "#9ca3af",
              borderBottom: activeTab === t.key ? "2px solid #673ab7" : "2px solid transparent",
              marginBottom: "-1px",
              background: "transparent",
            }}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto pb-2 flex items-center gap-1.5">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#f0ecf9", color: "#673ab7" }}>5 extensions</span>
          <button className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg" style={{ background: "#673ab7", color: "#fff" }}>
            <Plus size={9} /> Thêm
          </button>
        </div>
      </div>

      {activeTab === "sip" && (
        <div>
          {/* Column headers */}
          <div className="grid px-4 py-2" style={{ gridTemplateColumns: "52px 1fr 110px 80px 40px", gap: "0 8px", borderBottom: "1px solid rgba(103,58,183,0.06)" }}>
            {["Ext", "Nhân viên", "Hotline", "Trạng thái", ""].map(h => (
              <span key={h} className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "#9ca3af" }}>{h}</span>
            ))}
          </div>
          {sipAccounts.map((a) => {
            const st = sipStatusLabel[a.status];
            return (
              <div
                key={a.ext}
                className="grid items-center px-4 py-2.5 transition-colors"
                style={{ gridTemplateColumns: "52px 1fr 110px 80px 40px", gap: "0 8px", borderBottom: "1px solid rgba(103,58,183,0.05)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#fbf9ff")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span className="text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-lg self-center" style={{ background: "#f0ecf9", color: "#673ab7", fontFamily: "'DM Mono',monospace" }}>
                  {a.ext}
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: a.color + "18", color: a.color }}>
                      {a.name.split(" ").slice(-1)[0][0]}{a.name[0]}
                    </div>
                    <div className="absolute -bottom-px -right-px w-2 h-2 rounded-full border border-white" style={{ background: a.color }} />
                  </div>
                  <span className="text-[11px] font-medium truncate" style={{ color: "#1e2026" }}>{a.name}</span>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full self-center" style={{ background: "#f6f3fc", color: "#673ab7" }}>{a.hotline}</span>
                <div className="flex items-center gap-1.5 self-center">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: st.dot }} />
                  <span className="text-[10px]" style={{ color: "#5b5f6b" }}>{st.label}</span>
                </div>
                <button className="w-6 h-6 rounded-lg flex items-center justify-center self-center" style={{ background: "#f6f3fc" }}>
                  <MoreHorizontal size={10} color="#673ab7" />
                </button>
              </div>
            );
          })}
          {/* SIP server info */}
          <div className="flex items-center gap-4 px-4 py-3" style={{ background: "#fbf9ff", borderTop: "1px solid rgba(103,58,183,0.08)" }}>
            <div className="flex items-center gap-1.5">
              <Server size={11} color="#673ab7" />
              <span className="text-[10px] font-medium" style={{ color: "#5b5f6b" }}>SIP Server: <span style={{ fontFamily: "'DM Mono',monospace", color: "#673ab7" }}>sip.gcalls.vn</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi size={11} color="#16a34a" />
              <span className="text-[10px] font-medium" style={{ color: "#5b5f6b" }}>Kết nối: <span style={{ fontFamily: "'DM Mono',monospace", color: "#16a34a" }}>Ổn định</span></span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <RefreshCw size={10} color="#9ca3af" />
              <span className="text-[10px]" style={{ color: "#9ca3af" }}>Cập nhật 5s trước</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ivr" && (
        <div className="px-5 py-5">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch size={14} color="#673ab7" />
            <span className="text-xs font-bold" style={{ color: "#1e2026" }}>Cây IVR — 1900 1234</span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "#f0ecf9", color: "#673ab7" }}>3 cấp</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {ivrTree.map((node, i) => (
              <div
                key={node.key}
                className="flex items-start gap-3"
                style={{ paddingLeft: `${node.level * 24}px` }}
              >
                {/* Connector */}
                <div className="flex flex-col items-center flex-shrink-0 mt-1" style={{ width: "20px" }}>
                  {i > 0 && <div className="w-px flex-1" style={{ height: "12px", background: "rgba(103,58,183,0.18)", marginBottom: "3px" }} />}
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: node.color + "18", border: `1.5px solid ${node.color}30` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: node.color }} />
                  </div>
                </div>
                <div
                  className="flex-1 rounded-xl px-3.5 py-2.5"
                  style={{ background: node.color + "08", border: `1px solid ${node.color}20` }}
                >
                  <div className="text-xs font-bold" style={{ color: "#1e2026" }}>{node.label}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "#5b5f6b" }}>{node.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(103,58,183,0.08)" }}>
            <span className="text-[10px]" style={{ color: "#9ca3af" }}>Cập nhật lần cuối: hôm nay 08:30</span>
            <button className="flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-lg" style={{ background: "#f0ecf9", color: "#673ab7" }}>
              <Settings size={10} /> Chỉnh sửa IVR
            </button>
          </div>
        </div>
      )}

      {activeTab === "routing" && (
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold" style={{ color: "#1e2026" }}>Hotlines đang hoạt động</span>
            <span className="text-[10px]" style={{ color: "#9ca3af" }}>3 đầu số</span>
          </div>
          <div className="flex flex-col gap-2.5 mb-4">
            {hotlines.map((h) => (
              <div
                key={h.number}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: h.color + "08", border: `1px solid ${h.color}20` }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: h.color + "18" }}>
                  <Phone size={15} color={h.color} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tabular-nums" style={{ color: "#1e2026", fontFamily: "'DM Mono',monospace" }}>{h.number}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: h.color + "15", color: h.color }}>{h.label}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px]" style={{ color: "#5b5f6b" }}>{h.agents} agents</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
                      <span className="text-[10px]" style={{ color: "#22c55e" }}>{h.active} đang trực</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: "#f0ecf9" }}>
                  <Zap size={10} color="#673ab7" />
                  <span className="text-[9px] font-semibold" style={{ color: "#673ab7" }}>Active</span>
                </div>
              </div>
            ))}
          </div>
          {/* Routing rule preview */}
          <div className="rounded-2xl p-3.5" style={{ background: "#f6f3fc", border: "1px solid rgba(103,58,183,0.10)" }}>
            <div className="flex items-center gap-2 mb-2.5">
              <Network size={12} color="#673ab7" />
              <span className="text-[11px] font-bold" style={{ color: "#1e2026" }}>Routing Rule: Sales Queue</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Thứ 2–6", "08:00–18:00", "Skills-based", "Fallback: VM"].map(tag => (
                <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ background: "#fff", color: "#673ab7", border: "1px solid rgba(103,58,183,0.18)" }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CloudSection() {
  return (
    <section className="py-28 overflow-hidden" style={{ background: "#fff", fontFamily: "'Open Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* ── 2-col hero ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center mb-20">

          {/* Left copy */}
          <div className="flex flex-col gap-7">
            <div
              className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ background: "rgba(103,58,183,0.08)", color: "#673ab7", letterSpacing: "0.08em" }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#673ab7" }} />
              Cloud Call Center
            </div>

            <div>
              <h2
                className="font-extrabold tracking-tight mb-5"
                style={{ fontSize: "clamp(26px, 3.2vw, 42px)", color: "#1e2026", lineHeight: 1.14 }}
              >
                Xây dựng hệ thống tổng đài doanh nghiệp{" "}
                <span style={{ background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  trên nền tảng Cloud
                </span>
              </h2>
              <p style={{ color: "#5b5f6b", fontSize: "16px", lineHeight: 1.7, maxWidth: "480px" }}>
                Từ doanh nghiệp nhỏ đến Contact Center nhiều chi nhánh, Gcalls giúp triển khai hệ thống tổng đài linh hoạt, dễ mở rộng và vận hành hoàn toàn trên nền tảng điện toán đám mây.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {cloudFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(103,58,183,0.10)" }}>
                    <Check size={11} color="#673ab7" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#5b5f6b" }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Float stat pills */}
            <div className="grid grid-cols-2 gap-3 pt-2" style={{ borderTop: "1px solid rgba(103,58,183,0.10)" }}>
              {cloudFloats.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: f.color + "0c", border: `1px solid ${f.color}20` }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: f.color + "18" }}>
                      <Icon size={14} color={f.color} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold leading-none mb-0.5" style={{ color: "#1e2026", fontFamily: "'DM Mono',monospace" }}>{f.value}</div>
                      <div className="text-[11px]" style={{ color: "#5b5f6b" }}>{f.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right mockup */}
          <div className={`${stageClass} flex items-center justify-center`} style={{ minHeight: "520px" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: "500px", height: "500px", background: "radial-gradient(circle, rgba(103,58,183,0.08) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
            <div className={stageMainClass} style={{ maxWidth: "570px", zIndex: 2 }}>
              <CloudMockup />
            </div>
            {/* Floating cards */}
            {cloudFloats.map((f, i) => {
              const Icon = f.icon;
              const pos = [
                { top: "-10px", left: "-16px" },
                { top: "-10px", right: "-12px" },
                { bottom: "90px", left: "-24px" },
                { bottom: "16px", right: "-16px" },
              ][i];
              return (
                <div key={i} className={`${stageFloatClass} flex items-center gap-2.5 px-3.5 py-3 rounded-2xl`} style={{ ...pos, background: "#fff", boxShadow: "0 8px 28px rgba(103,58,183,0.13), 0 1px 4px rgba(0,0,0,0.04)", border: "1px solid rgba(103,58,183,0.10)", zIndex: 10, fontFamily: "'Inter',sans-serif", minWidth: "155px" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: f.color + "15" }}>
                    <Icon size={14} color={f.color} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold leading-none mb-0.5" style={{ color: "#1e2026", fontFamily: "'DM Mono',monospace" }}>{f.value}</div>
                    <div className="text-[10px]" style={{ color: "#5b5f6b" }}>{f.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom highlight ── */}
        <div
          className="rounded-3xl px-10 py-12 mb-14 flex flex-col md:flex-row items-center gap-10"
          style={{ background: "linear-gradient(135deg, #673ab7 0%, #4c1d95 100%)", position: "relative", overflow: "hidden" }}
        >
          {/* Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="dotsCloud" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#fff" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dotsCloud)" />
          </svg>
          <div className="absolute rounded-full pointer-events-none" style={{ width: "360px", height: "360px", top: "-120px", right: "-60px", background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)" }} />

          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <PhoneIncoming size={28} color="#fff" strokeWidth={1.8} />
          </div>
          <div className="flex-1 relative text-center md:text-left">
            <h3 className="font-extrabold text-white mb-3" style={{ fontSize: "clamp(20px, 2.4vw, 30px)", lineHeight: 1.2 }}>
              Không bỏ lỡ bất kỳ <span style={{ color: "rgba(255,255,255,0.75)" }}>cuộc gọi nào</span>
            </h3>
            <p style={{ color: "rgba(255,255,255,0.72)", maxWidth: "540px", fontSize: "15px", lineHeight: 1.7 }}>
              Tự động điều hướng cuộc gọi đến đúng bộ phận, đúng nhân viên hoặc đúng chi nhánh giúp nâng cao trải nghiệm khách hàng và tăng tỷ lệ kết nối thành công.
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-sm flex-shrink-0 transition-all duration-150 whitespace-nowrap relative"
            style={{ background: "#fff", color: "#673ab7", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}
          >
            Xem Cloud PBX
            <ArrowRight size={15} />
          </button>
        </div>

        {/* ── Feature grid 8 cards ── */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="font-extrabold" style={{ fontSize: "clamp(18px, 2.2vw, 28px)", color: "#1e2026" }}>
              Đầy đủ tính năng{" "}
              <span style={{ color: "#673ab7" }}>Cloud PBX doanh nghiệp</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featureGrid.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  className="rounded-2xl p-5 transition-all duration-200 cursor-default"
                  style={{ background: "#fff", border: `1px solid ${f.color}18`, boxShadow: "0 2px 10px rgba(103,58,183,0.05)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 36px ${f.color}18`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(103,58,183,0.05)"; }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3.5" style={{ background: f.bg }}>
                    <Icon size={18} color={f.color} strokeWidth={1.8} />
                  </div>
                  <div className="text-sm font-bold mb-1.5" style={{ color: "#1e2026" }}>{f.label}</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#5b5f6b" }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Flow section ── */}
        <div className="rounded-3xl px-8 py-12" style={{ background: "#f6f3fc", border: "1px solid rgba(103,58,183,0.10)" }}>
          <div className="text-center mb-10">
            <h3 className="font-extrabold mb-2" style={{ fontSize: "clamp(18px, 2.2vw, 26px)", color: "#1e2026" }}>
              Hành trình cuộc gọi từ{" "}
              <span style={{ color: "#673ab7" }}>đầu đến cuối</span>
            </h3>
            <p className="text-sm" style={{ color: "#5b5f6b" }}>Mỗi cuộc gọi đều được xử lý, ghi nhận và phân tích hoàn toàn tự động</p>
          </div>

          {/* Flow steps — horizontal on desktop, vertical on mobile */}
          <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-0">
            {flowSteps.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === flowSteps.length - 1;
              return (
                <div key={i} className="flex md:flex-col flex-1 items-center md:items-stretch">
                  {/* Card */}
                  <div
                    className="flex md:flex-col items-center gap-3 md:gap-2.5 flex-1 px-4 py-4 md:py-5 rounded-2xl md:rounded-none md:first:rounded-l-2xl md:last:rounded-r-2xl transition-all duration-200"
                    style={{
                      background: "#fff",
                      borderTop: `3px solid ${step.color}`,
                      boxShadow: "0 2px 10px rgba(103,58,183,0.06)",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = step.color + "08")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                  >
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: step.color + "15" }}
                    >
                      <Icon size={18} color={step.color} strokeWidth={1.8} />
                    </div>
                    <div className="text-center md:text-center flex-1 md:flex-none">
                      <div className="text-[11px] font-bold mb-0.5" style={{ color: "#1e2026" }}>{step.label}</div>
                      <div className="text-[10px]" style={{ color: "#9ca3af" }}>{step.note}</div>
                    </div>
                    <div className="text-[9px] font-bold tabular-nums" style={{ color: step.color, fontFamily: "'DM Mono',monospace" }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                  {/* Connector */}
                  {!isLast && (
                    <div className="flex items-center justify-center md:hidden flex-shrink-0 py-1">
                      <div className="w-px h-5" style={{ background: "rgba(103,58,183,0.20)" }} />
                    </div>
                  )}
                  {!isLast && (
                    <div className="hidden md:flex items-center justify-center flex-shrink-0" style={{ width: "20px" }}>
                      <ChevronRight size={16} color="rgba(103,58,183,0.35)" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
