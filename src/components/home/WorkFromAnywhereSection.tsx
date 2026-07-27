import { useState, useEffect } from "react";
import { Activity, BarChart2, Briefcase, Check, Clock, Cloud, Globe, HeadphonesIcon, Layers, LayoutGrid, MapPin, Mic, MicOff, Phone, PhoneCall, PhoneForwarded, PhoneIncoming, PhoneOff, RefreshCw, ShieldCheck, Volume2, Wifi, X, Zap } from "lucide-react";

// ─── Section 9: Work From Anywhere ───────────────────────────────────────────

const remoteStatuses = [
  { name: "Nguyễn Hằng",    avatar: "NH", color: "#22c55e", status: "available", label: "Sẵn sàng",   location: "Hà Nội",    calls: 12, dur: "3:42" },
  { name: "Trần M. Tuấn",   avatar: "TT", color: "#673ab7", status: "in-call",   label: "Đang gọi",   location: "TP.HCM",    calls: 8,  dur: "01:24" },
  { name: "Lê P. Linh",     avatar: "LL", color: "#22c55e", status: "available", label: "Sẵn sàng",   location: "Đà Nẵng",   calls: 17, dur: "4:10" },
  { name: "Phạm Đ. Dương",  avatar: "PD", color: "#f59e0b", status: "away",      label: "Vắng mặt",   location: "Remote",    calls: 5,  dur: "—" },
  { name: "Võ Thị Thanh",   avatar: "VT", color: "#0891b2", status: "in-call",   label: "Đang gọi",   location: "TP.HCM",    calls: 21, dur: "02:58" },
  { name: "Đỗ Quang Hải",   avatar: "DH", color: "#9ca3af", status: "offline",   label: "Ngoại tuyến", location: "Hải Phòng", calls: 0,  dur: "—" },
];

const statusLog = [
  { time: "10:48", agent: "Nguyễn Hằng",   event: "Chuyển sang Sẵn sàng",          icon: Check,         color: "#22c55e" },
  { time: "10:45", agent: "Trần M. Tuấn",  event: "Bắt đầu cuộc gọi · 0912 345 678", icon: PhoneCall,   color: "#673ab7" },
  { time: "10:40", agent: "Võ Thị Thanh",  event: "Bắt đầu cuộc gọi · 0976 543 210", icon: PhoneCall,   color: "#0891b2" },
  { time: "10:32", agent: "Phạm Đ. Dương", event: "Chuyển sang Vắng mặt",           icon: Clock,         color: "#f59e0b" },
  { time: "10:18", agent: "Lê P. Linh",    event: "Kết thúc cuộc gọi · 7m 12s",    icon: PhoneOff,      color: "#6b7280" },
  { time: "09:55", agent: "Đỗ Quang Hải",  event: "Đăng xuất khỏi hệ thống",       icon: X,             color: "#9ca3af" },
];

const remoteFeatures2 = [
  { icon: Globe,   label: "Webphone",     desc: "Gọi điện trực tiếp trên Chrome, Edge, Safari — không cài extension", color: "#673ab7", bg: "#f5f0fd" },
  { icon: Mic,     label: "Softphone",    desc: "Chất lượng âm thanh HD, noise cancellation, dễ cấu hình",            color: "#0891b2", bg: "#f0f9ff" },
  { icon: Cloud,   label: "Cloud System", desc: "Dữ liệu lưu trên Cloud, truy cập bất cứ đâu, không phụ thuộc server nội bộ", color: "#16a34a", bg: "#f0fdf4" },
  { icon: RefreshCw, label: "Auto Sync", desc: "Lịch sử, ghi chú, trạng thái đồng bộ tức thì giữa các thiết bị",     color: "#d97706", bg: "#fffbeb" },
];

const remoteUseCases = [
  { role: "Sales Team",      icon: Briefcase,       color: "#673ab7", bg: "#f5f0fd",
    points: ["Gọi cho KH từ bất kỳ đâu", "Xem hồ sơ KH ngay trên trình duyệt", "Ghi chú kết quả sau mỗi cuộc gọi"] },
  { role: "Remote Team",     icon: Globe,           color: "#0891b2", bg: "#f0f9ff",
    points: ["Làm việc từ xa như tại văn phòng", "Quản lý theo dõi realtime", "Không cần VPN hay thiết bị đặc biệt"] },
  { role: "Multi Branch",    icon: Layers,          color: "#16a34a", bg: "#f0fdf4",
    points: ["Kết nối nhiều chi nhánh trên 1 hệ thống", "Đổ chuông liên chi nhánh", "Báo cáo tổng hợp toàn bộ"] },
  { role: "Contact Center",  icon: HeadphonesIcon,  color: "#d97706", bg: "#fffbeb",
    points: ["Điều phối đội ngũ theo ca", "Giám sát trạng thái realtime", "Ghi âm tự động cuộc gọi"] },
];

const wfaStats = [
  { value: "Anywhere", label: "Work From Anywhere", icon: Globe,       color: "#673ab7" },
  { value: "Cloud",    label: "Cloud SaaS",          icon: Cloud,       color: "#0891b2" },
  { value: "Live",     label: "Realtime Sync",       icon: Activity,    color: "#16a34a" },
  { value: "Multi",    label: "Any Device",          icon: LayoutGrid,  color: "#d97706" },
];

export function DialpadMockup() {
  const [dialInput, setDialInput] = useState("0901 234");
  const keys = [["1","2","3"],["4","5","6"],["7","8","9"],["*","0","#"]];

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "#fff",
        boxShadow: "0 24px 64px rgba(103,58,183,0.18), 0 4px 12px rgba(0,0,0,0.06)",
        border: "1px solid rgba(103,58,183,0.12)",
        fontFamily: "'Inter', sans-serif",
        width: "220px",
      }}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "#673ab7" }}>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-white/80 font-medium">SIP: Online</span>
        </div>
        <div className="flex items-center gap-1">
          <Wifi size={11} color="rgba(255,255,255,0.7)" />
          <span className="text-[9px] text-white/60">HD</span>
        </div>
      </div>

      {/* Display */}
      <div className="px-5 pt-5 pb-3 text-center">
        <div className="text-xl font-bold tabular-nums tracking-widest mb-1" style={{ color: "#1e2026", fontFamily: "'DM Mono',monospace" }}>
          {dialInput || <span style={{ color: "#d1d5db" }}>Nhập số</span>}
        </div>
        <div className="text-[10px]" style={{ color: "#9ca3af" }}>Ext: 101 · Hotline: 1900 1234</div>
      </div>

      {/* Keypad */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2 mb-3">
          {keys.flat().map((k) => (
            <button
              key={k}
              className="h-10 rounded-2xl text-sm font-bold transition-all duration-100"
              style={{ background: "#f6f3fc", color: "#1e2026", fontFamily: "'DM Mono',monospace" }}
              onClick={() => setDialInput(p => p + k)}
              onMouseDown={e => (e.currentTarget.style.background = "#ede8f9")}
              onMouseUp={e => (e.currentTarget.style.background = "#f6f3fc")}
            >
              {k}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            className="flex-1 h-11 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white transition-all duration-150"
            style={{ background: "#22c55e", boxShadow: "0 4px 16px rgba(34,197,94,0.30)" }}
          >
            <Phone size={15} /> Gọi
          </button>
          <button
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: "#fef2f2" }}
            onClick={() => setDialInput(p => p.slice(0, -1))}
          >
            <PhoneOff size={14} color="#ef4444" />
          </button>
        </div>
      </div>

      {/* Quick contacts */}
      <div className="px-4 pb-4 pt-0" style={{ borderTop: "1px solid rgba(103,58,183,0.07)" }}>
        <div className="text-[9px] font-bold uppercase tracking-wide mb-2 pt-3" style={{ color: "#9ca3af" }}>Gọi nhanh</div>
        {[
          { name: "Nguyễn Hằng", ext: "101", color: "#673ab7" },
          { name: "Trần M. Tuấn", ext: "102", color: "#0891b2" },
        ].map(c => (
          <div key={c.ext} className="flex items-center gap-2 py-1.5 cursor-pointer rounded-xl px-1 transition-colors" onMouseEnter={e => (e.currentTarget.style.background = "#f6f3fc")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: c.color + "18", color: c.color }}>{c.name[0]}{c.name.split(" ").pop()![0]}</div>
            <span className="text-[10px] flex-1" style={{ color: "#5b5f6b" }}>{c.name}</span>
            <span className="text-[9px] font-bold tabular-nums" style={{ color: c.color, fontFamily: "'DM Mono',monospace" }}>Ext {c.ext}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SoftphoneMockup() {
  const [onCall, setOnCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!onCall) { setElapsed(0); return; }
    const t = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [onCall]);

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: onCall ? "linear-gradient(160deg,#3b1a80 0%,#673ab7 100%)" : "#fff",
        boxShadow: "0 24px 64px rgba(103,58,183,0.18), 0 4px 12px rgba(0,0,0,0.06)",
        border: "1px solid rgba(103,58,183,0.12)",
        fontFamily: "'Inter', sans-serif",
        width: "240px",
        transition: "background 0.4s",
      }}
    >
      {/* Chrome bar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: onCall ? "rgba(0,0,0,0.20)" : "#673ab7" }}>
        <span className="text-[10px] text-white/75 font-medium">Gcalls Softphone</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: onCall ? "#4ade80" : "#22c55e" }} />
          <span className="text-[9px] text-white/70">{onCall ? "In Call" : "Ready"}</span>
        </div>
      </div>

      <div className="px-5 py-5">
        {onCall ? (
          /* Active call state */
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
              TL
            </div>
            <div className="text-base font-bold text-white mb-0.5">Trần Thị Lan</div>
            <div className="text-[11px] mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>0912 345 678</div>
            <div className="text-2xl font-extrabold tabular-nums mb-4" style={{ color: "#fff", fontFamily: "'DM Mono',monospace" }}>{fmt(elapsed)}</div>

            {/* Waveform */}
            <div className="flex items-center justify-center gap-[3px] h-8 mb-5">
              {Array.from({length: 24}, (_,i) => {
                const h = muted ? 3 : 4 + Math.abs(Math.sin(i * 0.7 + elapsed * 0.5)) * 20;
                return <div key={i} className="rounded-full transition-all duration-150" style={{ width: "3px", height: `${h}px`, background: "rgba(255,255,255,0.6)" }} />;
              })}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { icon: muted ? MicOff : Mic, label: muted ? "Unmute" : "Mute", action: () => setMuted(!muted), active: muted },
                { icon: Volume2, label: "Loa", action: () => {}, active: false },
                { icon: PhoneForwarded, label: "Chuyển", action: () => {}, active: false },
              ].map((btn, i) => {
                const Icon = btn.icon;
                return (
                  <button key={i} onClick={btn.action} className="flex flex-col items-center gap-1 py-2 rounded-xl" style={{ background: btn.active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)" }}>
                    <Icon size={14} color="#fff" />
                    <span className="text-[9px] text-white/70">{btn.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: "#ef4444", color: "#fff", boxShadow: "0 4px 16px rgba(239,68,68,0.35)" }}
              onClick={() => { setOnCall(false); setMuted(false); }}
            >
              <PhoneOff size={15} /> Kết thúc cuộc gọi
            </button>
          </div>
        ) : (
          /* Idle state */
          <div>
            <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl" style={{ background: "#f6f3fc" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "#ede8f9", color: "#673ab7" }}>TL</div>
              <div>
                <div className="text-sm font-bold" style={{ color: "#1e2026" }}>Trần Thị Lan</div>
                <div className="text-[10px]" style={{ color: "#5b5f6b" }}>0912 345 678 · Gia hạn</div>
              </div>
              <PhoneIncoming size={14} color="#673ab7" className="ml-auto animate-bounce" />
            </div>
            <div className="text-xs text-center mb-4" style={{ color: "#9ca3af" }}>Cuộc gọi đến · 1900 1234</div>
            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                style={{ background: "#22c55e", color: "#fff", boxShadow: "0 4px 16px rgba(34,197,94,0.30)" }}
                onClick={() => setOnCall(true)}
              >
                <Phone size={14} /> Bắt máy
              </button>
              <button className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2" style={{ background: "#fef2f2", color: "#ef4444" }}>
                <PhoneOff size={14} /> Từ chối
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function UserStatusDashboard() {
  const [filter, setFilter] = useState<"all" | "available" | "in-call" | "away" | "offline">("all");
  const filtered = filter === "all" ? remoteStatuses : remoteStatuses.filter(s => s.status === filter);

  const counts = {
    available: remoteStatuses.filter(s => s.status === "available").length,
    "in-call":  remoteStatuses.filter(s => s.status === "in-call").length,
    away:       remoteStatuses.filter(s => s.status === "away").length,
    offline:    remoteStatuses.filter(s => s.status === "offline").length,
  };

  const filterBtns = [
    { key: "all",       label: "Tất cả",       count: remoteStatuses.length, color: "#673ab7" },
    { key: "available", label: "Sẵn sàng",      count: counts.available,     color: "#22c55e" },
    { key: "in-call",   label: "Đang gọi",      count: counts["in-call"],    color: "#673ab7" },
    { key: "away",      label: "Vắng mặt",      count: counts.away,          color: "#f59e0b" },
    { key: "offline",   label: "Ngoại tuyến",   count: counts.offline,       color: "#9ca3af" },
  ];

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "#fff",
        boxShadow: "0 32px 80px rgba(103,58,183,0.14), 0 4px 16px rgba(0,0,0,0.05)",
        border: "1px solid rgba(103,58,183,0.12)",
        fontFamily: "'Inter', sans-serif",
        maxWidth: "560px",
        width: "100%",
      }}
    >
      {/* Chrome */}
      <div className="flex items-center justify-between px-5 py-3.5" style={{ background: "#673ab7" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">{[0,1,2].map(i=><div key={i} className="w-2.5 h-2.5 rounded-full bg-white/25"/>)}</div>
          <span className="text-xs text-white/75 font-medium ml-1.5">Trạng thái đội ngũ · Realtime</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-white/80">{counts["in-call"]} đang gọi</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.15)" }}>
            <span className="text-[10px] text-white/80">{counts.available} sẵn sàng</span>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      {/* Wraps below `lg` rather than scrolling: at 390px this row hid 252px
          of content, leaving the "Vắng mặt" and "Ngoại tuyến" filters
          unreachable behind a horizontal drag most visitors never discover. */}
      <div className="flex gap-1 px-4 pt-3 pb-0 flex-wrap overflow-x-visible!" style={{ borderBottom: "1px solid rgba(103,58,183,0.08)", overflowX: "auto" }}>
        {filterBtns.map(fb => (
          <button
            key={fb.key}
            className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold rounded-t whitespace-nowrap transition-all"
            style={{
              color: filter === fb.key ? fb.color : "#9ca3af",
              borderBottom: filter === fb.key ? `2px solid ${fb.color}` : "2px solid transparent",
              marginBottom: "-1px",
              background: "transparent",
            }}
            onClick={() => setFilter(fb.key as typeof filter)}
          >
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold"
              style={{ background: filter === fb.key ? fb.color + "20" : "#f3f4f6", color: filter === fb.key ? fb.color : "#9ca3af" }}
            >{fb.count}</span>
            {fb.label}
          </button>
        ))}
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: "rgba(103,58,183,0.06)" }}>
        {filtered.map((agent) => (
          <div
            key={agent.name}
            className="flex items-center gap-3 px-4 py-3.5 bg-white transition-colors"
            onMouseEnter={e => (e.currentTarget.style.background = "#fbf9ff")}
            onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
          >
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: agent.color + "18", color: agent.color }}>
                {agent.avatar}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background: agent.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold truncate" style={{ color: "#1e2026" }}>{agent.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-medium" style={{ color: agent.color }}>{agent.label}</span>
                <span className="text-[9px]" style={{ color: "#9ca3af" }}>· {agent.location}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[11px] font-bold tabular-nums" style={{ color: "#1e2026", fontFamily: "'DM Mono',monospace" }}>
                {agent.status === "in-call" ? agent.dur : `${agent.calls}`}
              </div>
              <div className="text-[9px]" style={{ color: "#9ca3af" }}>
                {agent.status === "in-call" ? "thời gian" : "cuộc gọi"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status log preview */}
      <div style={{ borderTop: "1px solid rgba(103,58,183,0.08)" }}>
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-[11px] font-bold" style={{ color: "#1e2026" }}>Activity Log</span>
          <span className="text-[10px]" style={{ color: "#673ab7", cursor: "pointer" }}>Xem tất cả →</span>
        </div>
        {statusLog.slice(0, 3).map((log, i) => {
          const Icon = log.icon;
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-2" style={{ borderBottom: "1px solid rgba(103,58,183,0.04)" }}>
              <span className="text-[9px] tabular-nums flex-shrink-0" style={{ color: "#9ca3af", fontFamily: "'DM Mono',monospace", minWidth: "34px" }}>{log.time}</span>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: log.color + "15" }}>
                <Icon size={9} color={log.color} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: "#1e2026" }}>{log.agent}</span>
              <span className="text-[10px] truncate" style={{ color: "#5b5f6b" }}>{log.event}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WorkFromAnywhereSection() {
  return (
    <section className="py-28 overflow-hidden" style={{ background: "#fff", fontFamily: "'Open Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* ── Block 1: Hero 2-col ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center mb-20">
          {/* Left copy */}
          <div className="flex flex-col gap-7">
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase" style={{ background: "rgba(103,58,183,0.08)", color: "#673ab7", letterSpacing: "0.08em" }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#673ab7" }} />
              Work From Anywhere
            </div>
            <div>
              <h2 className="font-extrabold tracking-tight mb-5" style={{ fontSize: "clamp(26px, 3.2vw, 42px)", color: "#1e2026", lineHeight: 1.14 }}>
                Mang tổng đài doanh nghiệp{" "}
                <span style={{ background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  theo bạn đến bất kỳ đâu
                </span>
              </h2>
              <p style={{ color: "#5b5f6b", fontSize: "16px", lineHeight: 1.7, maxWidth: "480px" }}>
                Dù đang ở văn phòng, làm việc tại nhà hay di chuyển gặp khách hàng, đội ngũ vẫn có thể tiếp nhận và thực hiện cuộc gọi như đang ngồi tại tổng đài.
              </p>
            </div>
            {/* Quick benefits */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Globe,      label: "Đăng nhập trên trình duyệt", color: "#673ab7" },
                { icon: Zap,        label: "Không cần cài đặt phức tạp",  color: "#0891b2" },
                { icon: MapPin,     label: "Làm việc mọi nơi",            color: "#16a34a" },
                { icon: RefreshCw,  label: "Đồng bộ dữ liệu realtime",    color: "#d97706" },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.label} className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl" style={{ background: b.color + "0c", border: `1px solid ${b.color}20` }}>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: b.color + "18" }}>
                      <Icon size={13} color={b.color} strokeWidth={2} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "#1e2026" }}>{b.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: dialpad + softphone side by side.
              Their fixed widths (220px + 240px + gap) total 484px, so below
              `lg` they stack instead of overflowing a 350px column. The
              decorative rotations are dropped at the same breakpoint. */}
          <div
            className="relative flex items-center justify-center gap-6 max-lg:flex-col! max-lg:min-h-0!"
            style={{ minHeight: "520px" }}
          >
            <div className="absolute rounded-full pointer-events-none" style={{ width: "480px", height: "480px", background: "radial-gradient(circle, rgba(103,58,183,0.08) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
            <div className="relative max-lg:transform-none!" style={{ zIndex: 2, transform: "rotate(-2deg) translateY(-12px)" }}>
              <DialpadMockup />
            </div>
            <div className="relative max-lg:transform-none!" style={{ zIndex: 3, transform: "rotate(1.5deg) translateY(12px)" }}>
              <SoftphoneMockup />
            </div>
            {/* Floating stat chips */}
            {[
              { label: "Browser Ready",  color: "#673ab7", pos: { top: "12px", left: "0px" } },
              { label: "HD Voice",       color: "#16a34a", pos: { bottom: "30px", left: "0px" } },
              { label: "No Install",     color: "#0891b2", pos: { top: "12px", right: "0px" } },
              { label: "Auto Sync",      color: "#d97706", pos: { bottom: "30px", right: "0px" } },
            ].map((chip, i) => (
              <div
                key={i}
                className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold"
                style={{ ...chip.pos, background: "#fff", border: `1px solid ${chip.color}25`, boxShadow: `0 4px 16px ${chip.color}18`, color: chip.color, zIndex: 10 }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: chip.color }} />
                {chip.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Block 2: Feature cards ── */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="font-extrabold" style={{ fontSize: "clamp(18px, 2.2vw, 28px)", color: "#1e2026" }}>
              Chỉ cần trình duyệt là{" "}
              <span style={{ color: "#673ab7" }}>có thể bắt đầu</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {remoteFeatures2.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  className="rounded-2xl p-6 transition-all duration-200 cursor-default"
                  style={{ background: "#fff", border: `1px solid ${f.color}18`, boxShadow: "0 2px 10px rgba(103,58,183,0.05)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${f.color}18`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(103,58,183,0.05)"; }}
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

        {/* ── Block 3 & 4: Status dashboard full width ── */}
        <div className="mb-16 rounded-3xl overflow-hidden" style={{ background: "#f6f3fc", border: "1px solid rgba(103,58,183,0.09)" }}>
          <div className="px-8 pt-10 pb-6 text-center">
            <h3 className="font-extrabold mb-2" style={{ fontSize: "clamp(18px, 2.2vw, 28px)", color: "#1e2026" }}>
              Biết đội ngũ đang làm gì{" "}
              <span style={{ color: "#673ab7" }}>theo thời gian thực</span>
            </h3>
            <p className="text-sm mx-auto" style={{ color: "#5b5f6b", maxWidth: "480px" }}>
              Quản lý theo dõi trạng thái từng nhân viên, lịch sử hoạt động và hiệu suất — dù đội ngũ đang làm việc từ bất kỳ đâu.
            </p>
          </div>
          <div className="px-8 pb-8 flex justify-center">
            <UserStatusDashboard />
          </div>

          {/* Block 4 benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 pb-10">
            {[
              { label: "Quản lý từ xa",          icon: Globe,       color: "#673ab7", desc: "Theo dõi đội ngũ làm việc ở mọi nơi" },
              { label: "Activity Tracking",       icon: Activity,    color: "#0891b2", desc: "Ghi lại mọi thay đổi trạng thái" },
              { label: "KPI Support",             icon: BarChart2,   color: "#16a34a", desc: "Dữ liệu hỗ trợ đánh giá năng suất" },
              { label: "Minh bạch hoạt động",     icon: ShieldCheck, color: "#d97706", desc: "Mọi hành động đều được ghi nhận" },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "#fff", border: `1px solid ${b.color}18` }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: b.color + "12" }}>
                    <Icon size={15} color={b.color} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-xs font-bold mb-0.5" style={{ color: "#1e2026" }}>{b.label}</div>
                    <div className="text-[11px] leading-snug" style={{ color: "#5b5f6b" }}>{b.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Block 5: Use cases ── */}
        <div className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {remoteUseCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <div
                  key={uc.role}
                  className="rounded-2xl p-6 transition-all duration-200"
                  style={{ background: "#fff", border: `1px solid ${uc.color}18`, boxShadow: "0 2px 10px rgba(103,58,183,0.05)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 36px ${uc.color}18`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(103,58,183,0.05)"; }}
                >
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: uc.bg }}>
                    <Icon size={20} color={uc.color} strokeWidth={1.8} />
                  </div>
                  <div className="text-sm font-bold mb-3" style={{ color: "#1e2026" }}>{uc.role}</div>
                  <div className="flex flex-col gap-2">
                    {uc.points.map((pt) => (
                      <div key={pt} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: uc.color + "15" }}>
                          <Check size={9} color={uc.color} strokeWidth={3} />
                        </div>
                        <span className="text-xs leading-snug" style={{ color: "#5b5f6b" }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Block 6: CTA purple ── */}
        <div
          className="relative rounded-3xl overflow-hidden px-10 py-16"
          style={{ background: "linear-gradient(135deg, #2d0e6e 0%, #673ab7 55%, #9c63d6 100%)" }}
        >
          <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="dotsWFA" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#fff" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dotsWFA)" />
          </svg>
          <div className="absolute rounded-full pointer-events-none" style={{ width: "600px", height: "600px", top: "-240px", right: "-120px", background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)" }} />

          <div className="relative flex flex-col lg:flex-row items-center gap-10">
            {/* Left: stats */}
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              {wfaStats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.value} className="flex flex-col items-center gap-2 px-5 py-4 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                      <Icon size={18} color="#fff" strokeWidth={1.8} />
                    </div>
                    <div className="text-sm font-extrabold text-white" style={{ fontFamily: "'DM Mono',monospace" }}>{s.value}</div>
                    <div className="text-[10px] text-center" style={{ color: "rgba(255,255,255,0.6)" }}>{s.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Right: copy + CTA */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-5" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Sẵn sàng triển khai ngay hôm nay
              </div>
              <h3 className="font-extrabold text-white mb-4" style={{ fontSize: "clamp(22px, 2.8vw, 34px)", lineHeight: 1.15 }}>
                Tổng đài doanh nghiệp luôn đồng hành cùng đội ngũ của bạn
              </h3>
              <p className="mb-8" style={{ color: "rgba(255,255,255,0.70)", fontSize: "15px", lineHeight: 1.7 }}>
                Không cần phần cứng, không cần cài đặt phức tạp — chỉ cần trình duyệt và kết nối internet, đội ngũ của bạn đã có thể bắt đầu ngay.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-150"
                  style={{ background: "#fff", color: "#673ab7", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}
                >
                  <Phone size={15} /> Đăng ký tư vấn
                </button>
                <button
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-150"
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.28)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.22)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)"}
                >
                  <Zap size={15} /> Khám phá tính năng
                </button>
              </div>
              <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>Đội ngũ Gcalls hỗ trợ cấu hình và triển khai theo nhu cầu thực tế</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
