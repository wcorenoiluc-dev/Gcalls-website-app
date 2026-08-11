import { useState, useEffect } from "react";
import { Activity, Bell, Check, ChevronRight, Code2, FileText, HeadphonesIcon, Key, Link2, MessageCircle, MousePointerClick, Phone, PhoneIncoming, PhoneOff, PhoneOutgoing, RefreshCw, Users, Webhook, X, Zap } from "lucide-react";
import { Link } from "react-router";
import { leadCtaHref } from "@/lib/leads/ctaLink";
import { stageClass, stageMainClass, stageFloatClass } from "@/components/common/ResponsiveProductVisual";

// ─── Section 8: Integrations ─────────────────────────────────────────────────

/**
 * Integration capability cards — rewritten in Checkpoint WEB-SITE-QA-001.
 *
 * ---------------------------------------------------------------------------
 * WHY THESE ARE WORDED CONDITIONALLY
 * ---------------------------------------------------------------------------
 * This block is the homepage summary of work that five locked integration
 * checkpoints (INT-01…05) did in detail, and it had drifted into claiming MORE
 * than any of those pages is allowed to claim. Every correction below points at
 * the gate that closed against the original wording:
 *
 *  · "xác thực OAuth 2.0, sandbox miễn phí cho dev" — no repository evidence of
 *    either. Removed rather than softened: a named auth standard and a free
 *    sandbox are checkable facts, not positioning.
 *  · "Popup … ngay lập tức" — the §11 popup gate resolved CONTEXT ONLY, and the
 *    Salesforce title had to be corrected at INT-03 for exactly this claim
 *    (`src/config/sitemap.ts`, WEB-013). The word "popup" is deliberately gone.
 *  · "Click To Call … từ CRM, Helpdesk, ERP" — the Freshdesk and Zendesk gates
 *    closed against a Click-to-Call claim (INT-04 §11 A, INT-05 §11 A), so
 *    Helpdesk cannot be included unconditionally. ERP is not an integration
 *    category anywhere on this site.
 *  · "Đồng bộ hai chiều" — no page claims two-way sync. "Freshsales" is not a
 *    platform Gcalls has an integration page or any evidence for.
 *  · "ghi âm tự động" — the recording-sync gates closed at INT-03, INT-04 §11 J
 *    and INT-05 §11 J.
 *
 * The approved register is the one in `src/data/company/types.ts`: "có thể tích
 * hợp với…", "phạm vi tích hợp phụ thuộc API, gói dịch vụ và yêu cầu triển
 * khai", "được đánh giá trong quá trình khảo sát kỹ thuật". Keep to it.
 */
const integrationFeatures = [
  {
    icon: Code2,
    label: "Open API",
    color: "#673ab7",
    bg: "#f5f0fd",
    desc: "API để kết nối Gcalls với hệ thống nội bộ. Phạm vi được xác nhận theo yêu cầu triển khai.",
  },
  {
    icon: Webhook,
    label: "Webhook",
    color: "#0891b2",
    bg: "#f0f9ff",
    desc: "Nhận sự kiện cuộc gọi để hệ thống của doanh nghiệp xử lý tiếp, theo cấu hình.",
  },
  {
    icon: Bell,
    label: "Customer Context",
    color: "#16a34a",
    bg: "#f0fdf4",
    desc: "Hiển thị thông tin khách hàng lấy từ hệ thống đã kết nối, theo phạm vi cấu hình.",
  },
  {
    icon: MousePointerClick,
    label: "Click To Call",
    color: "#d97706",
    bg: "#fffbeb",
    desc: "Gọi từ hệ thống đang dùng, ở những nền tảng có hỗ trợ trong phạm vi tích hợp.",
  },
  {
    icon: Link2,
    label: "CRM Integration",
    color: "#7c3aed",
    bg: "#f5f0ff",
    desc: "Kết nối cuộc gọi với HubSpot, Salesforce và Zoho CRM. Mỗi nền tảng có trang riêng.",
  },
  {
    icon: RefreshCw,
    label: "Data Sync",
    color: "#0284c7",
    bg: "#e0f2fe",
    desc: "Đồng bộ liên hệ và lịch sử tương tác theo cấu hình, thay cho nhập liệu thủ công.",
  },
];

const ecosystemGroups = [
  {
    category: "CRM",
    color: "#673ab7",
    icon: Users,
    tools: [
      /*
        The five platforms listed across this grid are exactly the five with a
        completed integration page (INT-01…05). "Freshsales" was removed in
        Checkpoint WEB-SITE-QA-001: it has no page, no config and no evidence
        anywhere in this repository, and a green status dot beside a platform
        name reads as a confirmed, live integration. Do not add a platform here
        before its integration page exists.
      */
      { name: "HubSpot",    abbr: "HS",  color: "#ff7a59" },
      { name: "Salesforce", abbr: "SF",  color: "#00a1e0" },
      { name: "Zoho CRM",   abbr: "ZH",  color: "#e42527" },
    ],
  },
  {
    category: "Helpdesk",
    color: "#0891b2",
    icon: HeadphonesIcon,
    tools: [
      { name: "Freshdesk", abbr: "FD", color: "#0fa958" },
      { name: "Zendesk",   abbr: "ZD", color: "#03363d" },
    ],
  },
  {
    category: "Communication",
    color: "#16a34a",
    icon: MessageCircle,
    tools: [
      { name: "Facebook", abbr: "FB", color: "#1877f2" },
      { name: "Zalo OA",  abbr: "ZA", color: "#0068ff" },
      { name: "Email",    abbr: "EM", color: "#ea4335" },
    ],
  },
  {
    category: "Developer",
    color: "#d97706",
    icon: Code2,
    tools: [
      { name: "Open API",    abbr: "API", color: "#673ab7" },
      { name: "Webhook",     abbr: "WH",  color: "#0891b2" },
      { name: "Custom",      abbr: "DEV", color: "#6b7280" },
    ],
  },
];

const apiEndpoints = [
  { method: "GET",    path: "/v1/calls",            desc: "Lấy danh sách cuộc gọi" },
  { method: "POST",   path: "/v1/calls/outbound",   desc: "Khởi tạo cuộc gọi đi" },
  { method: "GET",    path: "/v1/contacts/:id",     desc: "Chi tiết khách hàng" },
  { method: "PUT",    path: "/v1/contacts/:id",     desc: "Cập nhật thông tin KH" },
  { method: "POST",   path: "/v1/webhooks",         desc: "Đăng ký webhook event" },
];

const methodColor: Record<string, { bg: string; text: string }> = {
  GET:    { bg: "#dcfce7", text: "#16a34a" },
  POST:   { bg: "#ede8f9", text: "#673ab7" },
  PUT:    { bg: "#fef9c3", text: "#b45309" },
  DELETE: { bg: "#fee2e2", text: "#dc2626" },
};

export function APIManagerMockup() {
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "#fff",
        boxShadow: "0 32px 80px rgba(103,58,183,0.16), 0 4px 16px rgba(0,0,0,0.06)",
        border: "1px solid rgba(103,58,183,0.12)",
        fontFamily: "'Inter', sans-serif",
        maxWidth: "540px",
      }}
    >
      {/* Chrome */}
      <div className="flex items-center justify-between px-5 py-3.5" style={{ background: "#673ab7" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/25" />)}
          </div>
          <span className="text-xs text-white/75 font-medium ml-1.5">API Management</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.15)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[10px] text-white/80 font-medium">v1.4.2 · Live</span>
        </div>
      </div>

      {/* API key row */}
      <div className="flex items-center gap-3 px-5 py-3" style={{ background: "#fbf9ff", borderBottom: "1px solid rgba(103,58,183,0.08)" }}>
        <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl" style={{ background: "#f0ecf9" }}>
          <Key size={11} color="#673ab7" />
          <span className="text-[11px] font-medium flex-1" style={{ color: "#673ab7", fontFamily: "'DM Mono',monospace" }}>sk-gc-••••••••••••••••4f2a</span>
          <button className="text-[9px] px-2 py-0.5 rounded font-semibold" style={{ background: "#673ab7", color: "#fff" }}>Copy</button>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: "#f0fdf4" }}>
          <Activity size={11} color="#16a34a" />
          <span className="text-[11px] font-medium" style={{ color: "#16a34a" }}>2.4k req/h</span>
        </div>
      </div>

      {/* Endpoint list */}
      <div style={{ borderBottom: "1px solid rgba(103,58,183,0.08)" }}>
        <div className="flex items-center justify-between px-5 py-2.5">
          <span className="text-xs font-bold" style={{ color: "#1e2026" }}>Endpoints</span>
          <span className="text-[10px]" style={{ color: "#9ca3af" }}>Base URL: api.gcalls.vn</span>
        </div>
        {apiEndpoints.map((ep, i) => {
          const mc = methodColor[ep.method];
          const isActive = i === activeEndpoint;
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-colors"
              style={{ background: isActive ? "#fbf9ff" : "transparent", borderLeft: isActive ? "3px solid #673ab7" : "3px solid transparent", borderBottom: "1px solid rgba(103,58,183,0.05)" }}
              onClick={() => setActiveEndpoint(i)}
            >
              <span className="text-[9px] font-bold px-2 py-0.5 rounded flex-shrink-0 tabular-nums" style={{ background: mc.bg, color: mc.text, minWidth: "38px", textAlign: "center" }}>{ep.method}</span>
              <span className="text-[11px] font-medium flex-1 truncate" style={{ color: "#1e2026", fontFamily: "'DM Mono',monospace" }}>{ep.path}</span>
              <span className="text-[10px]" style={{ color: "#9ca3af" }}>{ep.desc}</span>
              <ChevronRight size={11} color={isActive ? "#673ab7" : "#d1d5db"} />
            </div>
          );
        })}
      </div>

      {/* Response preview */}
      <div className="px-5 py-4" style={{ background: "#0d0d1a" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>RESPONSE · 200 OK · 48ms</span>
          <span className="text-[9px] px-2 py-0.5 rounded font-medium" style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80" }}>JSON</span>
        </div>
        <pre className="text-[10px] leading-relaxed overflow-x-auto" style={{ color: "#a78bfa", fontFamily: "'DM Mono',monospace" }}>
{`{
  "id": "call_8f3kd9",
  "contact": "Nguyễn Văn Minh",
  "phone": "0901234567",
  "status": "answered",
  "duration": 222,
  "recording_url": "https://..."
}`}
        </pre>
      </div>
    </div>
  );
}

export function CustomerPopupMockup() {
  const [ringing, setRinging] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setRinging(false), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        boxShadow: "0 20px 60px rgba(103,58,183,0.18), 0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid rgba(103,58,183,0.12)",
        fontFamily: "'Inter', sans-serif",
        width: "280px",
      }}
    >
      {/* Incoming bar */}
      <div
        className="flex items-center gap-2.5 px-4 py-3"
        style={{ background: ringing ? "#673ab7" : "#16a34a" }}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${ringing ? "animate-pulse" : ""}`} style={{ background: "rgba(255,255,255,0.2)" }}>
          <PhoneIncoming size={15} color="#fff" />
        </div>
        <div>
          <div className="text-xs font-bold text-white">{ringing ? "Cuộc gọi đến..." : "Đã kết nối"}</div>
          <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.75)" }}>1900 1234 · Hà Nội</div>
        </div>
        <div className="ml-auto flex gap-1.5">
          {ringing ? (
            <>
              <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#22c55e" }} onClick={() => setRinging(false)}><Phone size={12} color="#fff" /></button>
              <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}><PhoneOff size={12} color="#fff" /></button>
            </>
          ) : (
            <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}><PhoneOff size={12} color="#fff" /></button>
          )}
        </div>
      </div>

      {/* Contact info */}
      <div className="px-4 pt-3.5 pb-3">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "#ede8f9", color: "#673ab7" }}>NM</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold" style={{ color: "#1e2026" }}>Nguyễn Văn Minh</div>
            <div className="text-[11px]" style={{ color: "#5b5f6b" }}>Công ty TNHH Bình Minh</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "#ede8f9", color: "#673ab7" }}>Demo</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "#dcfce7", color: "#16a34a" }}>VIP</span>
            </div>
          </div>
        </div>

        {/* History pills */}
        <div className="flex flex-col gap-1.5 mb-3 p-2.5 rounded-xl" style={{ background: "#f6f3fc" }}>
          <div className="text-[9px] font-bold uppercase tracking-wide mb-1" style={{ color: "#9ca3af" }}>Lịch sử gần nhất</div>
          {[
            { icon: PhoneOutgoing, label: "Gọi đi · 3:42", time: "Hôm nay 09:14", color: "#673ab7" },
            { icon: FileText,      label: "Ghi chú: Cần gửi proposal", time: "Hôm nay 09:35", color: "#d97706" },
          ].map((h, i) => {
            const Icon = h.icon;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: h.color + "15" }}>
                  <Icon size={8} color={h.color} />
                </div>
                <span className="text-[10px] flex-1" style={{ color: "#5b5f6b" }}>{h.label}</span>
                <span className="text-[9px]" style={{ color: "#9ca3af" }}>{h.time}</span>
              </div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="flex gap-1.5">
          {["Ghi chú", "Gắn tag", "Xem hồ sơ"].map((a) => (
            <button key={a} className="flex-1 py-1.5 rounded-xl text-[9px] font-semibold text-center transition-colors" style={{ background: "#f0ecf9", color: "#673ab7" }}>{a}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WidgetMockup() {
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [widgetInput, setWidgetInput] = useState("");

  return (
    <div className="flex flex-col items-end gap-3" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Simulated webpage */}
      <div
        className="rounded-2xl overflow-hidden w-72"
        style={{ background: "#fff", border: "1px solid rgba(103,58,183,0.10)", boxShadow: "0 8px 24px rgba(103,58,183,0.10)" }}
      >
        <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: "#f9f9f9", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-[9px] ml-2 px-3 py-0.5 rounded bg-white border" style={{ color: "#9ca3af", borderColor: "rgba(0,0,0,0.08)" }}>yourwebsite.vn/pricing</span>
        </div>
        <div className="px-4 py-5">
          <div className="h-3 w-2/3 rounded mb-2" style={{ background: "#f0ecf9" }} />
          <div className="h-2 w-full rounded mb-1.5" style={{ background: "#f3f4f6" }} />
          <div className="h-2 w-5/6 rounded mb-4" style={{ background: "#f3f4f6" }} />
          <div className="flex gap-2">
            <div className="h-7 flex-1 rounded-xl" style={{ background: "#673ab7" }} />
            <div className="h-7 flex-1 rounded-xl" style={{ background: "#f0ecf9" }} />
          </div>
        </div>
      </div>

      {/* Widget popup */}
      {widgetOpen && (
        <div
          className="rounded-2xl overflow-hidden w-64"
          style={{ background: "#fff", border: "1px solid rgba(103,58,183,0.12)", boxShadow: "0 16px 48px rgba(103,58,183,0.20)" }}
        >
          <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(103,58,183,0.08)", background: "#f8f6ff" }}>
            <div className="text-xs font-bold mb-0.5" style={{ color: "#1e2026" }}>Gọi ngay cho chúng tôi</div>
            <div className="text-[10px]" style={{ color: "#5b5f6b" }}>Nhập số điện thoại để được gọi lại ngay</div>
          </div>
          <div className="px-4 py-3 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#f6f3fc", border: "1px solid rgba(103,58,183,0.15)" }}>
              <Phone size={11} color="#673ab7" />
              <input
                type="text"
                placeholder="09xx xxx xxx"
                value={widgetInput}
                onChange={e => setWidgetInput(e.target.value)}
                className="text-xs bg-transparent outline-none flex-1"
                style={{ color: "#1e2026" }}
              />
            </div>
            <button className="w-full py-2.5 rounded-xl text-xs font-bold text-white" style={{ background: "#673ab7" }}>
              📞 Nhận cuộc gọi ngay
            </button>
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[9px]" style={{ color: "#5b5f6b" }}>Đang trực · Gọi lại khi có yêu cầu</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
        style={{
          background: widgetOpen ? "#5929a8" : "#673ab7",
          boxShadow: "0 8px 28px rgba(103,58,183,0.40)",
          transform: widgetOpen ? "rotate(15deg)" : "none",
        }}
        onClick={() => setWidgetOpen(!widgetOpen)}
      >
        {widgetOpen ? <X size={22} color="#fff" /> : <Phone size={22} color="#fff" />}
      </button>
    </div>
  );
}

export function IntegrationsSection() {
  return (
    <section className="py-28 overflow-hidden" style={{ background: "#fff", fontFamily: "'Open Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* ── Block 1: Hero 2-col ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center mb-20">

          {/* Left copy */}
          <div className="flex flex-col gap-7 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase" style={{ background: "rgba(103,58,183,0.08)", color: "#673ab7", letterSpacing: "0.08em" }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#673ab7" }} />
              Integrations & Automation
            </div>

            <div>
              <h2 className="font-extrabold tracking-tight mb-5" style={{ fontSize: "clamp(26px, 3.2vw, 42px)", color: "#1e2026", lineHeight: 1.14 }}>
                Kết nối dữ liệu khách hàng và cuộc gọi{" "}
                <span style={{ background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  trên một nền tảng duy nhất
                </span>
              </h2>
              <p style={{ color: "#5b5f6b", fontSize: "16px", lineHeight: 1.7, maxWidth: "480px" }}>
                Gcalls giúp doanh nghiệp đồng bộ dữ liệu khách hàng, cuộc gọi và hoạt động chăm sóc khách hàng với CRM, Helpdesk và các hệ thống nội bộ thông qua API mở và Webhook.
              </p>
            </div>

            {/* Ecosystem logo cloud */}
            <div className="grid grid-cols-4 gap-2.5 pt-2" style={{ borderTop: "1px solid rgba(103,58,183,0.10)" }}>
              {ecosystemGroups.flatMap(g => g.tools).slice(0, 8).map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl transition-all duration-150 cursor-default"
                  style={{ background: "#f9f7fe", border: "1px solid rgba(103,58,183,0.08)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f0ecf9")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#f9f7fe")}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[11px]" style={{ background: t.color + "15", color: t.color }}>{t.abbr}</div>
                  <span className="text-[9px] font-medium text-center leading-tight" style={{ color: "#5b5f6b" }}>{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: API mockup */}
          <div className={`${stageClass} flex items-center justify-center order-1 lg:order-2`} style={{ minHeight: "480px" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: "460px", height: "460px", background: "radial-gradient(circle, rgba(103,58,183,0.07) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
            <div className={stageMainClass} style={{ maxWidth: "540px", zIndex: 2 }}>
              <APIManagerMockup />
            </div>
            {/* Floating integration badges */}
            {[
              { name: "HubSpot", abbr: "HS", color: "#ff7a59", pos: { top: "8px", left: "-28px" } },
              { name: "Zendesk", abbr: "ZD", color: "#03363d", pos: { top: "8px", right: "-20px" } },
              { name: "Salesforce", abbr: "SF", color: "#00a1e0", pos: { bottom: "60px", left: "-20px" } },
              { name: "Webhook", abbr: "WH", color: "#0891b2", pos: { bottom: "12px", right: "-12px" } },
            ].map((b, i) => (
              <div key={i} className={`${stageFloatClass} flex items-center gap-2 px-3 py-2 rounded-xl`} style={{ ...b.pos, background: "#fff", boxShadow: "0 6px 20px rgba(103,58,183,0.12)", border: "1px solid rgba(103,58,183,0.10)", zIndex: 10, fontFamily: "'Inter',sans-serif" }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold" style={{ background: b.color + "18", color: b.color }}>{b.abbr}</div>
                <span className="text-[11px] font-semibold" style={{ color: "#1e2026" }}>{b.name}</span>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Block 2: 6 feature cards ── */}
        <div className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {integrationFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  className="rounded-2xl p-6 transition-all duration-200 cursor-default"
                  style={{ background: "#fff", border: `1px solid ${f.color}18`, boxShadow: "0 2px 12px rgba(103,58,183,0.05)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${f.color}18`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(103,58,183,0.05)"; }}
                >
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: f.bg }}>
                    <Icon size={20} color={f.color} strokeWidth={1.8} />
                  </div>
                  <div className="text-sm font-bold mb-2" style={{ color: "#1e2026" }}>{f.label}</div>
                  <p className="text-sm leading-relaxed" style={{ color: "#5b5f6b" }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Block 3: Customer Popup ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-16 rounded-3xl px-8 py-14" style={{ background: "#f6f3fc", border: "1px solid rgba(103,58,183,0.08)" }}>
          {/* Left copy */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(103,58,183,0.10)", color: "#673ab7" }}>
              <Bell size={11} color="#673ab7" /> Customer Context
            </div>
            <h3 className="font-extrabold" style={{ fontSize: "clamp(20px, 2.4vw, 30px)", color: "#1e2026", lineHeight: 1.2 }}>
              Nhận diện khách hàng{" "}
              <span style={{ color: "#673ab7" }}>khi có cuộc gọi đến</span>
            </h3>
            {/*
              Reworded in Checkpoint WEB-SITE-QA-001. The original said Gcalls
              "tự động kéo thông tin từ CRM và hiển thị popup ngay lập tức". The
              automatic-popup gate resolved CONTEXT ONLY across INT-02…05, and
              the Salesforce page title had to be corrected at INT-03 for
              publishing exactly this. The capability shown here is customer
              context on an incoming call, within the configured integration
              scope — not a guaranteed automatic popup.
            */}
            <p style={{ color: "#5b5f6b", fontSize: "15px", lineHeight: 1.7 }}>
              Khi có cuộc gọi đến, nhân viên xem được thông tin khách hàng lấy từ hệ thống
              đã kết nối — trong phạm vi tích hợp được cấu hình cho doanh nghiệp.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                "Biết khách hàng là ai trước khi bắt máy",
                "Xem lịch sử chăm sóc và ghi chú đã lưu",
                "Không cần hỏi lại thông tin đã có",
                "Giữ ngữ cảnh trao đổi giữa các lần liên hệ",
              ].map((b) => (
                <div key={b} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(103,58,183,0.12)" }}>
                    <Check size={11} color="#673ab7" strokeWidth={3} />
                  </div>
                  <span className="text-sm" style={{ color: "#5b5f6b" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right: popup mockup */}
          <div className="flex items-center justify-center">
            <CustomerPopupMockup />
          </div>
        </div>

        {/* ── Block 4: Widget ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-16">
          {/* Left: widget mockup */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <WidgetMockup />
          </div>
          {/* Right copy */}
          <div className="flex flex-col gap-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(103,58,183,0.10)", color: "#673ab7" }}>
              <MousePointerClick size={11} color="#673ab7" /> Call Button Widget
            </div>
            <h3 className="font-extrabold" style={{ fontSize: "clamp(20px, 2.4vw, 30px)", color: "#1e2026", lineHeight: 1.2 }}>
              Biến khách truy cập website{" "}
              <span style={{ color: "#673ab7" }}>thành cuộc gọi</span>
            </h3>
            <p style={{ color: "#5b5f6b", fontSize: "15px", lineHeight: 1.7 }}>
              {/*
                "được kết nối với nhân viên trong vòng 30 giây" was a guaranteed
                connection time — the same family of claim as the withheld
                deployment-time figures ("thiết lập trong 5 phút", "triển khai
                trong một ngày"). It depends on agent availability and carrier
                routing, neither of which this page can promise.
              */}
              Nhúng nút gọi vào website chỉ với vài dòng code. Khách truy cập để lại số
              điện thoại và đội ngũ gọi lại theo cấu hình phân phối cuộc gọi của doanh nghiệp.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Tăng tỷ lệ chuyển đổi từ visitor thành lead", color: "#673ab7" },
                { label: "Thu thập số điện thoại và gọi lại tức thì", color: "#0891b2" },
                { label: "Theo dõi nguồn cuộc gọi từ từng trang web", color: "#16a34a" },
              ].map((b) => (
                <div key={b.label} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: b.color + "15" }}>
                    <Check size={11} color={b.color} strokeWidth={3} />
                  </div>
                  <span className="text-sm" style={{ color: "#5b5f6b" }}>{b.label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "#f0ecf9" }}>
                <Code2 size={12} color="#673ab7" />
                <span className="text-xs font-semibold" style={{ color: "#673ab7" }}>{"<script>"} 1 dòng</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "#f0fdf4" }}>
                <Zap size={12} color="#16a34a" />
                <span className="text-xs font-semibold" style={{ color: "#16a34a" }}>Gọi lại theo cấu hình</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Block 5: Ecosystem grid ── */}
        <div className="mb-14 rounded-3xl p-8" style={{ background: "#f6f3fc", border: "1px solid rgba(103,58,183,0.09)" }}>
          <div className="text-center mb-8">
            <h3 className="font-extrabold mb-2" style={{ fontSize: "clamp(18px, 2.2vw, 26px)", color: "#1e2026" }}>
              Hệ sinh thái <span style={{ color: "#673ab7" }}>tích hợp của Gcalls</span>
            </h3>
            {/* "phổ biến nhất" is an unsupported superlative — dropped. */}
            <p className="text-sm" style={{ color: "#5b5f6b" }}>Các nền tảng Gcalls có thể kết nối, theo phạm vi tích hợp được xác nhận</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ecosystemGroups.map((group) => {
              const GroupIcon = group.icon;
              return (
                <div key={group.category} className="rounded-2xl p-5" style={{ background: "#fff", border: `1px solid ${group.color}18`, boxShadow: "0 2px 10px rgba(103,58,183,0.05)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: group.color + "15" }}>
                      <GroupIcon size={14} color={group.color} strokeWidth={2} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: "#1e2026" }}>{group.category}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {group.tools.map((t) => (
                      <div key={t.name} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl" style={{ background: "#f9f7fe" }}>
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold flex-shrink-0" style={{ background: t.color + "18", color: t.color }}>{t.abbr}</div>
                        <span className="text-xs font-medium" style={{ color: "#5b5f6b" }}>{t.name}</span>
                        <div className="w-1.5 h-1.5 rounded-full ml-auto flex-shrink-0" style={{ background: "#22c55e" }} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Block 6: CTA ── */}
        <div
          className="relative rounded-3xl overflow-hidden px-10 py-16 text-center"
          style={{ background: "linear-gradient(135deg, #3b1a80 0%, #673ab7 50%, #8b5cf6 100%)" }}
        >
          {/* Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="dotsInteg" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#fff" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dotsInteg)" />
          </svg>
          <div className="absolute rounded-full pointer-events-none" style={{ width: "500px", height: "500px", top: "-180px", left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)" }} />

          {/* Floating integration chips */}
          <div className="absolute top-6 left-8 hidden lg:flex flex-col gap-2">
            {["HubSpot ✓", "Salesforce ✓", "Zendesk ✓"].map(t => (
              <span key={t} className="text-[10px] px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}>{t}</span>
            ))}
          </div>
          <div className="absolute top-6 right-8 hidden lg:flex flex-col gap-2 items-end">
            {["Webhook ✓", "Open API ✓", "Custom Dev ✓"].map(t => (
              <span key={t} className="text-[10px] px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}>{t}</span>
            ))}
          </div>

          <div className="relative max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {/*
                "Không cần dev" was an absolute. `src/data/gcallsPlus.ts` already
                records that "Không cần IT" is NOT approved as an absolute claim;
                this is the same claim in the same place on the same site.
              */}
              Tích hợp theo phạm vi được xác nhận
            </div>
            <h3 className="font-extrabold text-white mb-4" style={{ fontSize: "clamp(22px, 3vw, 36px)", lineHeight: 1.15 }}>
              Kết nối Gcalls với hệ thống doanh nghiệp của bạn
            </h3>
            <p className="mb-8" style={{ color: "rgba(255,255,255,0.72)", fontSize: "16px", lineHeight: 1.7 }}>
              Từ CRM, Helpdesk đến các hệ thống nội bộ — Gcalls kết nối qua API mở. Phạm vi
              và công việc cần thiết được đánh giá trong quá trình khảo sát kỹ thuật.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to={leadCtaHref({ intent: 'consultation', source: 'consultation' })}
                className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-150"
                style={{ background: "#fff", color: "#673ab7", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.22)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.18)"; }}
              >
                <Phone size={15} /> Đăng ký tư vấn
              </Link>
              <Link to={leadCtaHref({ intent: 'integration', source: 'consultation' })}
                className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-150"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.30)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.22)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)"}
              >
                <Code2 size={15} /> Tư vấn tích hợp
              </Link>
            </div>
            <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Đăng ký để nhận tư vấn cấu hình phù hợp với nhu cầu</p>
          </div>
        </div>

      </div>
    </section>
  );
}
