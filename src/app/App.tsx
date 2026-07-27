import { useState, useEffect, useRef } from "react";
import { Phone, PhoneIncoming, PhoneOff, Play, Pause, Mic, MicOff, BarChart2, Users, Clock, TrendingUp, Check, ChevronRight, Star, Wifi, Volume2, Search, Bell, Settings, MoreHorizontal, ArrowUpRight, Circle, PhoneCall, Voicemail, X, ClipboardList, UserX, PieChart, MapPin, Plug, ArrowRight, Tag, FileText, PhoneMissed, PhoneOutgoing, Filter, Download, SlidersHorizontal, Mail, Building2, UserCheck, Briefcase, HeadphonesIcon, ShieldCheck, ChevronDown, Plus, ExternalLink, Activity, Globe, GitBranch, Radio, LayoutGrid, Server, PhoneForwarded, Network, Layers, Cloud, Zap, RefreshCw, Code2, Link2, Key, MousePointerClick, MessageCircle, Webhook } from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────

const callLog = [
  { id: 1, name: "Nguyễn Văn Minh", phone: "0901 234 567", type: "out", duration: "3:42", status: "answered", time: "09:14", tag: "Khách hàng mới" },
  { id: 2, name: "Trần Thị Lan", phone: "0912 345 678", type: "in", duration: "7:18", status: "answered", time: "09:31", tag: "Gia hạn" },
  { id: 3, name: "Lê Hoàng Phúc", phone: "0888 901 234", type: "out", duration: "—", status: "missed", time: "09:52", tag: null },
  { id: 4, name: "Phạm Thu Hà", phone: "0976 543 210", type: "in", duration: "12:05", status: "answered", time: "10:08", tag: "Demo" },
  { id: 5, name: "Võ Minh Tuấn", phone: "0933 210 987", type: "out", duration: "5:20", status: "answered", time: "10:45", tag: "Upsell" },
];

const contacts = [
  { id: 1, name: "Công ty TNHH Bình Minh", contact: "Nguyễn Văn Minh", calls: 12, lastCall: "Hôm nay 09:14", stage: "Demo", avatar: "BM" },
  { id: 2, name: "CTCP Việt Phát", contact: "Trần Thị Lan", calls: 8, lastCall: "Hôm nay 09:31", stage: "Đàm phán", avatar: "VP" },
  { id: 3, name: "Tập đoàn Sao Việt", contact: "Phạm Thu Hà", calls: 24, lastCall: "Hôm nay 10:08", stage: "Đề xuất", avatar: "SV" },
];

const kpiData = [
  { label: "Cuộc gọi hôm nay", value: "84", change: "+12%", up: true },
  { label: "Tỷ lệ nghe máy", value: "73%", change: "+4%", up: true },
  { label: "Thời gian TB", value: "5:24", change: "-0:18", up: false },
  { label: "Đã chốt deal", value: "11", change: "+3", up: true },
];

const agentStatus = [
  { name: "Hằng N.", status: "on-call", duration: "04:12", color: "#22c55e" },
  { name: "Tuấn V.", status: "on-call", duration: "01:48", color: "#22c55e" },
  { name: "Linh P.", status: "available", duration: null, color: "#673ab7" },
  { name: "Dương M.", status: "break", duration: null, color: "#f59e0b" },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#673ab7" }}>
        <Phone size={15} color="#fff" strokeWidth={2.5} />
      </div>
      <span className="font-bold text-[17px] tracking-tight" style={{ color: "#1e2026", fontFamily: "'Open Sans', sans-serif" }}>
        g<span style={{ color: "#673ab7" }}>calls</span>
      </span>
    </div>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Tổng quan", "Tính năng", "Bảng giá", "Tích hợp", "FAQ"];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(103,58,183,0.10)",
        boxShadow: scrolled ? "0 1px 12px rgba(103,58,183,0.07)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150"
              style={{ color: "#5b5f6b", fontFamily: "'Open Sans', sans-serif" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "#673ab7";
                (e.target as HTMLElement).style.background = "#f6f3fc";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "#5b5f6b";
                (e.target as HTMLElement).style.background = "transparent";
              }}
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150"
            style={{
              background: "#673ab7",
              color: "#fff",
              fontFamily: "'Open Sans', sans-serif",
              boxShadow: "0 2px 16px rgba(103,58,183,0.28)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = "#5929a8";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "#673ab7";
            }}
          >
            Đăng ký tư vấn
          </button>
          <button className="md:hidden p-2 rounded-lg" onClick={() => setMobileOpen(!mobileOpen)} style={{ color: "#673ab7" }}>
            {mobileOpen ? <X size={22} /> : <MoreHorizontal size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

// ── Dashboard UI mockup ──────────────────────────────────────────────────────

function DashboardMain() {
  const [playingId, setPlayingId] = useState<number | null>(null);

  return (
    <div
      className="rounded-3xl overflow-hidden w-full"
      style={{
        background: "#fff",
        boxShadow: "0 24px 80px rgba(103,58,183,0.18), 0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid rgba(103,58,183,0.12)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: "#673ab7", borderBottom: "1px solid rgba(255,255,255,0.12)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white/30" />
          <div className="w-3 h-3 rounded-full bg-white/30" />
          <div className="w-3 h-3 rounded-full bg-white/30" />
          <span className="ml-3 text-xs text-white/80 font-medium tracking-wide">Gcalls Webphone — Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi size={13} color="rgba(255,255,255,0.7)" />
          <span className="text-xs text-white/70">SIP: Kết nối</span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-px" style={{ background: "rgba(103,58,183,0.06)" }}>
        {kpiData.map((k) => (
          <div key={k.label} className="bg-white px-4 py-3">
            <div className="text-xs mb-1" style={{ color: "#5b5f6b" }}>{k.label}</div>
            <div className="text-xl font-bold" style={{ color: "#1e2026", fontFamily: "'Open Sans', sans-serif" }}>{k.value}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <ArrowUpRight size={11} color={k.up ? "#22c55e" : "#ef4444"} style={{ transform: k.up ? "none" : "rotate(90deg)" }} />
              <span className="text-xs font-medium" style={{ color: k.up ? "#22c55e" : "#ef4444" }}>{k.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex" style={{ height: "260px" }}>
        {/* Call log */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid rgba(103,58,183,0.08)" }}>
            <span className="text-xs font-semibold" style={{ color: "#1e2026" }}>Lịch sử cuộc gọi</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "#f6f3fc" }}>
              <Search size={11} color="#673ab7" />
              <span className="text-xs" style={{ color: "#673ab7" }}>Tìm kiếm</span>
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "215px" }}>
            {callLog.map((call) => (
              <div
                key={call.id}
                className="flex items-center gap-3 px-4 py-2.5 transition-colors"
                style={{ borderBottom: "1px solid rgba(103,58,183,0.05)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fbf9ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: call.status === "missed" ? "#fef2f2" : "#f0ecf9" }}
                >
                  {call.type === "out" ? (
                    <PhoneCall size={12} color={call.status === "missed" ? "#ef4444" : "#673ab7"} />
                  ) : (
                    <PhoneIncoming size={12} color={call.status === "missed" ? "#ef4444" : "#22c55e"} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold truncate" style={{ color: "#1e2026" }}>{call.name}</span>
                    {call.tag && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: "#ede8f9", color: "#673ab7" }}>{call.tag}</span>
                    )}
                  </div>
                  <div className="text-[10px]" style={{ color: "#5b5f6b" }}>{call.phone}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] font-medium" style={{ color: call.status === "missed" ? "#ef4444" : "#1e2026" }}>{call.duration}</div>
                  <div className="text-[10px]" style={{ color: "#9ca3af" }}>{call.time}</div>
                </div>
                {call.status === "answered" && (
                  <button
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: playingId === call.id ? "#673ab7" : "#f0ecf9" }}
                    onClick={() => setPlayingId(playingId === call.id ? null : call.id)}
                  >
                    {playingId === call.id ? <Pause size={8} color="#fff" /> : <Play size={8} color="#673ab7" />}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Agent sidebar */}
        <div className="w-44 flex-shrink-0" style={{ borderLeft: "1px solid rgba(103,58,183,0.08)" }}>
          <div className="px-3 py-2.5" style={{ borderBottom: "1px solid rgba(103,58,183,0.08)" }}>
            <span className="text-xs font-semibold" style={{ color: "#1e2026" }}>Đội ngũ</span>
          </div>
          {agentStatus.map((a) => (
            <div key={a.name} className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: "1px solid rgba(103,58,183,0.05)" }}>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                style={{ background: a.color + "22", color: a.color }}
              >
                {a.name.split(" ")[0][0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate" style={{ color: "#1e2026" }}>{a.name}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: a.color }} />
                  <span className="text-[9px] truncate" style={{ color: "#5b5f6b" }}>
                    {a.status === "on-call" ? `Đang gọi · ${a.duration}` : a.status === "available" ? "Sẵn sàng" : "Giải lao"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FloatingTimeline() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(38);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { setPlaying(false); return 38; }
        return p + 0.5;
      });
    }, 80);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <div
      className="rounded-2xl p-3.5"
      style={{
        background: "#fff",
        boxShadow: "0 8px 32px rgba(103,58,183,0.14), 0 1px 4px rgba(0,0,0,0.05)",
        border: "1px solid rgba(103,58,183,0.10)",
        width: "250px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#f0ecf9" }}>
          <Voicemail size={11} color="#673ab7" />
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: "#1e2026" }}>Trần Thị Lan</div>
          <div className="text-[10px]" style={{ color: "#5b5f6b" }}>Cuộc gọi đến · 7:18 phút</div>
        </div>
        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "#dcfce7", color: "#16a34a" }}>Đã nghe</span>
      </div>

      {/* Waveform */}
      <div className="flex items-center gap-[2px] h-8 mb-2.5 px-1">
        {Array.from({ length: 52 }, (_, i) => {
          const h = 10 + Math.sin(i * 0.7) * 6 + Math.sin(i * 1.3) * 8 + Math.random() * 6;
          const pct = (i / 52) * 100;
          return (
            <div
              key={i}
              className="rounded-full flex-1 transition-colors duration-150"
              style={{
                height: `${Math.max(4, h)}px`,
                background: pct <= progress ? "#673ab7" : "#e5e0f5",
              }}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "#673ab7" }}
          onClick={() => setPlaying(!playing)}
        >
          {playing ? <Pause size={10} color="#fff" /> : <Play size={10} color="#fff" />}
        </button>
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "#e5e0f5" }}>
          <div className="h-full rounded-full transition-all duration-75" style={{ width: `${progress}%`, background: "#673ab7" }} />
        </div>
        <span className="text-[10px] tabular-nums" style={{ color: "#5b5f6b", fontFamily: "'DM Mono', monospace" }}>
          {Math.floor((progress / 100) * 438)}s
        </span>
      </div>

      <div className="mt-2.5 pt-2 flex gap-1.5" style={{ borderTop: "1px solid rgba(103,58,183,0.08)" }}>
        {["Gia hạn gói", "Cần follow-up", "Hài lòng"].map((tag) => (
          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "#f0ecf9", color: "#673ab7" }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

function FloatingCRM() {
  return (
    <div
      className="rounded-2xl p-3.5"
      style={{
        background: "#fff",
        boxShadow: "0 8px 32px rgba(103,58,183,0.14), 0 1px 4px rgba(0,0,0,0.05)",
        border: "1px solid rgba(103,58,183,0.10)",
        width: "220px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Users size={13} color="#673ab7" />
        <span className="text-xs font-semibold" style={{ color: "#1e2026" }}>CRM Khách hàng</span>
        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "#f0ecf9", color: "#673ab7" }}>248 liên hệ</span>
      </div>
      {contacts.map((c) => (
        <div key={c.id} className="flex items-center gap-2 py-2" style={{ borderBottom: "1px solid rgba(103,58,183,0.06)" }}>
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold flex-shrink-0"
            style={{ background: "#ede8f9", color: "#673ab7" }}
          >
            {c.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold truncate" style={{ color: "#1e2026" }}>{c.name}</div>
            <div className="text-[9px] truncate" style={{ color: "#5b5f6b" }}>{c.contact} · {c.calls} cuộc</div>
          </div>
          <span className="text-[9px] px-1 py-0.5 rounded flex-shrink-0 font-medium" style={{ background: "#ede8f9", color: "#673ab7" }}>{c.stage}</span>
        </div>
      ))}
    </div>
  );
}

function FloatingAnalytics() {
  const bars = [65, 80, 72, 90, 78, 85, 73];
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <div
      className="rounded-2xl p-3.5"
      style={{
        background: "#673ab7",
        boxShadow: "0 8px 32px rgba(103,58,183,0.28)",
        width: "200px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <BarChart2 size={13} color="rgba(255,255,255,0.9)" />
        <span className="text-xs font-semibold text-white">Hiệu suất tuần</span>
      </div>
      <div className="flex items-end gap-1 h-16">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-sm transition-all duration-300"
              style={{ height: `${(h / 100) * 52}px`, background: i === 4 ? "#fff" : "rgba(255,255,255,0.35)" }}
            />
            <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.6)" }}>{days[i]}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2.5 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <div>
          <div className="text-xs font-bold text-white">543</div>
          <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.6)" }}>Cuộc gọi / tuần</div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
          <TrendingUp size={10} color="#fff" />
          <span className="text-[10px] text-white font-medium">+18%</span>
        </div>
      </div>
    </div>
  );
}

function FloatingDialpad() {
  const [input, setInput] = useState("0901 234 5");

  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "#fff",
        boxShadow: "0 8px 32px rgba(103,58,183,0.14), 0 1px 4px rgba(0,0,0,0.05)",
        border: "1px solid rgba(103,58,183,0.10)",
        width: "168px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="text-center mb-3">
        <div className="text-sm font-bold tabular-nums tracking-widest" style={{ color: "#1e2026", fontFamily: "'DM Mono', monospace" }}>{input}</div>
        <div className="text-[10px] mt-0.5" style={{ color: "#5b5f6b" }}>Nhập số gọi</div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {keys.flat().map((k) => (
          <button
            key={k}
            className="h-8 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: "#f6f3fc", color: "#1e2026", fontFamily: "'DM Mono', monospace" }}
            onClick={() => setInput((p) => p + k)}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#ede8f9")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "#f6f3fc")}
          >
            {k}
          </button>
        ))}
      </div>
      <button
        className="w-full h-9 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-xs transition-colors"
        style={{ background: "#22c55e", color: "#fff" }}
      >
        <Phone size={13} />
        Gọi ngay
      </button>
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────

const highlights = [
  "Nghe gọi trực tiếp trên trình duyệt",
  "Quản lý danh bạ và lịch sử tương tác",
  "Ghi chú, nhắc nhở và phân loại cuộc gọi",
  "Theo dõi lịch sử, thống kê và hiệu suất đội ngũ",
];

function Hero() {
  return (
    <section
      className="min-h-screen flex items-center pt-16 pb-20 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f9f7fe 40%, #f0eaf9 100%)",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      {/* Decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: "600px",
            height: "600px",
            top: "-160px",
            right: "-120px",
            background: "radial-gradient(circle, rgba(103,58,183,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "400px",
            height: "400px",
            bottom: "0px",
            left: "-100px",
            background: "radial-gradient(circle, rgba(103,58,183,0.05) 0%, transparent 70%)",
          }}
        />
        {/* Grid dots */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#673ab7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left column ─────────────────────────────────────── */}
          <div className="flex flex-col gap-7">
            {/* Label badge */}
            <div className="inline-flex items-center gap-2 self-start">
              <div
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{ background: "rgba(103,58,183,0.1)", color: "#673ab7", letterSpacing: "0.08em" }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#673ab7" }} />
                GCALLS PLUS WEBPHONE
              </div>
            </div>

            {/* Headline */}
            <div>
              <h1
                className="font-extrabold leading-tight tracking-tight mb-5"
                style={{
                  fontSize: "clamp(32px, 4.5vw, 54px)",
                  color: "#1e2026",
                  lineHeight: 1.12,
                }}
              >
                Gcalls Plus Webphone –{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  tổng đài chuyên nghiệp
                </span>{" "}
                chạy trên trình duyệt
              </h1>

              <p className="text-base leading-relaxed" style={{ color: "#5b5f6b", maxWidth: "520px", fontSize: "17px" }}>
                Gcalls Plus Webphone giúp đội Sales và CSKH nghe gọi, quản lý danh bạ, lịch sử tương tác, ghi chú và theo dõi hoạt động cuộc gọi ngay trên trình duyệt.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] transition-all duration-150"
                style={{
                  background: "#673ab7",
                  color: "#fff",
                  boxShadow: "0 4px 24px rgba(103,58,183,0.35)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#5929a8";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 32px rgba(103,58,183,0.45)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#673ab7";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(103,58,183,0.35)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <Phone size={16} />
                Đăng ký tư vấn
              </button>
              <button
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] transition-all duration-150"
                style={{
                  background: "#fff",
                  color: "#673ab7",
                  border: "1.5px solid rgba(103,58,183,0.25)",
                  boxShadow: "0 2px 8px rgba(103,58,183,0.06)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#673ab7";
                  (e.currentTarget as HTMLElement).style.background = "#f6f3fc";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(103,58,183,0.25)";
                  (e.currentTarget as HTMLElement).style.background = "#fff";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                Khám phá tính năng
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Quick highlights */}
            <div className="flex flex-col gap-2.5 pt-1">
              {highlights.map((h) => (
                <div key={h} className="flex items-center gap-2.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(103,58,183,0.12)" }}
                  >
                    <Check size={11} color="#673ab7" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#5b5f6b" }}>{h}</span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-5 pt-2" style={{ borderTop: "1px solid rgba(103,58,183,0.10)" }}>
              <div className="flex -space-x-2">
                {["VP", "BM", "SV", "TH"].map((a, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white"
                    style={{ background: `hsl(${260 + i * 20},50%,${55 + i * 6}%)`, color: "#fff" }}
                  >
                    {a}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} fill="#f59e0b" color="#f59e0b" />
                  ))}
                  <span className="text-xs font-bold ml-1" style={{ color: "#1e2026" }}>4.9</span>
                </div>
                <div className="text-xs" style={{ color: "#5b5f6b" }}>Được tin dùng bởi các doanh nghiệp Việt Nam</div>
              </div>
            </div>
          </div>

          {/* ── Right column — Layered UI ────────────────────────── */}
          <div className="relative flex items-center justify-center" style={{ minHeight: "560px" }}>
            {/* Main dashboard */}
            <div className="w-full" style={{ maxWidth: "540px" }}>
              <DashboardMain />
            </div>

            {/* Timeline/audio — top-right */}
            <div
              className="absolute"
              style={{ top: "-30px", right: "-40px", zIndex: 10, transform: "rotate(1.5deg)" }}
            >
              <FloatingTimeline />
            </div>

            {/* Analytics — bottom-left */}
            <div
              className="absolute"
              style={{ bottom: "-20px", left: "-32px", zIndex: 10, transform: "rotate(-1.5deg)" }}
            >
              <FloatingAnalytics />
            </div>

            {/* CRM — mid-left */}
            <div
              className="absolute"
              style={{ top: "50%", left: "-44px", zIndex: 9, transform: "translateY(-50%) rotate(-1deg)" }}
            >
              <FloatingCRM />
            </div>

            {/* Dialpad — bottom-right */}
            <div
              className="absolute"
              style={{ bottom: "-24px", right: "-20px", zIndex: 10, transform: "rotate(2deg)" }}
            >
              <FloatingDialpad />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 2: Pain Points ──────────────────────────────────────────────────

const painPoints = [
  {
    icon: UserX,
    title: "Dữ liệu khách hàng và lịch sử cuộc gọi bị phân tán",
    desc: "Thông tin lưu ở nhiều nơi khác nhau, đội ngũ không có cái nhìn đầy đủ về khách hàng khi cần.",
    accent: "#673ab7",
    bg: "#f5f0fd",
  },
  {
    icon: ClipboardList,
    title: "Nhân viên phải chuyển đổi giữa nhiều công cụ khi gọi và ghi chú",
    desc: "Mỗi cuộc gọi yêu cầu thao tác trên nhiều ứng dụng khác nhau, làm chậm quy trình và dễ bỏ sót thông tin.",
    accent: "#7c3aed",
    bg: "#f3f0fe",
  },
  {
    icon: Phone,
    title: "Khó theo dõi trạng thái và lịch sử tương tác của từng khách hàng",
    desc: "Không có lịch sử tương tác tập trung khiến đội ngũ mất ngữ cảnh và phải hỏi lại thông tin đã có.",
    accent: "#5b21b6",
    bg: "#f0ebfd",
  },
  {
    icon: PieChart,
    title: "Quản lý thiếu dữ liệu tập trung để theo dõi hoạt động và hiệu suất",
    desc: "Không có bảng điều khiển tổng hợp khiến quản lý khó đánh giá hiệu suất và phân bổ nguồn lực hợp lý.",
    accent: "#673ab7",
    bg: "#f5f0fd",
  },
  {
    icon: MapPin,
    title: "Đội ngũ làm việc từ nhiều nơi thiếu công cụ thống nhất",
    desc: "Sales remote, CSKH tại văn phòng, telesales — mỗi nơi dùng một công cụ, khó phối hợp và giám sát.",
    accent: "#7c3aed",
    bg: "#f3f0fe",
  },
  {
    icon: Plug,
    title: "Tổng đài và hệ thống doanh nghiệp hoạt động rời rạc",
    desc: "Khi tổng đài và CRM không kết nối, nhân viên phải nhập liệu thủ công, tốn thời gian và dễ sai sót.",
    accent: "#5b21b6",
    bg: "#f0ebfd",
  },
];

function PainCard({ item, index }: { item: typeof painPoints[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <div
      className="rounded-[20px] p-7 cursor-default transition-all duration-200"
      style={{
        background: "#fff",
        border: "1px solid rgba(103,58,183,0.10)",
        boxShadow: hovered
          ? "0 20px 48px rgba(103,58,183,0.14), 0 4px 12px rgba(0,0,0,0.05)"
          : "0 2px 12px rgba(103,58,183,0.06), 0 1px 4px rgba(0,0,0,0.03)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        fontFamily: "'Open Sans', sans-serif",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-200"
        style={{
          background: hovered ? item.accent : item.bg,
        }}
      >
        <Icon size={22} color={hovered ? "#fff" : item.accent} strokeWidth={1.8} />
      </div>

      {/* Number badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-bold text-[15px] leading-snug" style={{ color: "#1e2026" }}>
          {item.title}
        </h3>
        <span
          className="text-xs font-bold flex-shrink-0 mt-0.5"
          style={{ color: "rgba(103,58,183,0.25)", fontFamily: "'DM Mono', monospace" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: "#5b5f6b" }}>
        {item.desc}
      </p>

      {/* Hover line */}
      <div
        className="mt-5 h-0.5 rounded-full transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, ${item.accent}, transparent)`,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
        }}
      />
    </div>
  );
}

function PainPointsSection() {
  return (
    <section
      className="py-24"
      style={{
        background: "#fff",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
            style={{ background: "rgba(103,58,183,0.08)", color: "#673ab7", letterSpacing: "0.08em" }}
          >
            <span>BÀI TOÁN</span>
          </div>

          <h2
            className="font-extrabold tracking-tight mb-5"
            style={{ fontSize: "clamp(28px, 3.5vw, 44px)", color: "#1e2026", lineHeight: 1.15 }}
          >
            Những điểm nghẽn{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              làm giảm hiệu suất
            </span>{" "}
            nghe gọi của đội Sales và CSKH
          </h2>

          <p className="text-base leading-relaxed" style={{ color: "#5b5f6b", fontSize: "17px" }}>
            Khi dữ liệu khách hàng, lịch sử cuộc gọi và công cụ làm việc nằm ở nhiều nơi, đội ngũ dễ mất ngữ cảnh và tốn thời gian cho thao tác thủ công.
          </p>
        </div>

        {/* Grid 3×2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {painPoints.map((item, i) => (
            <PainCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* CTA Banner */}
        <div
          className="relative rounded-3xl overflow-hidden px-10 py-12"
          style={{
            background: "linear-gradient(135deg, #673ab7 0%, #4c1d95 100%)",
          }}
        >
          {/* Subtle pattern */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots2" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#fff" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots2)" />
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

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:max-w-xl">
              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-5"
                style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Giải pháp Gcalls
              </div>

              <h3
                className="font-extrabold mb-4 text-white"
                style={{ fontSize: "clamp(22px, 2.8vw, 34px)", lineHeight: 1.2 }}
              >
                Một nền tảng duy nhất để quản lý toàn bộ hoạt động cuộc gọi
              </h3>

              <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                Từ gọi điện, chăm sóc khách hàng, quản lý danh bạ, ghi âm, báo cáo cho đến phân quyền đội ngũ.
              </p>

              {/* Mini feature list */}
              <div className="flex flex-wrap gap-3 mt-6">
                {["Webphone trên trình duyệt", "Danh bạ & lịch sử tương tác", "CRM tích hợp", "Báo cáo theo dữ liệu"].map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)" }}
                  >
                    <Check size={11} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center lg:items-end gap-4 flex-shrink-0">
              <button
                className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-[15px] transition-all duration-150 whitespace-nowrap"
                style={{
                  background: "#fff",
                  color: "#673ab7",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.15)";
                }}
              >
                Khám phá Gcalls Webphone
                <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-1" />
              </button>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Không cần cài đặt phần mềm · Chạy trực tiếp trên trình duyệt</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Section 3: Call Timeline ────────────────────────────────────────────────

const timelineItems = [
  {
    id: 1,
    name: "Nguyễn Văn Minh",
    phone: "0901 234 567",
    hotline: "1900 1234",
    type: "out" as const,
    status: "answered" as const,
    duration: "3:42",
    time: "09:14",
    date: "Hôm nay",
    tag: "Khách hàng mới",
    tagColor: "#673ab7",
    note: "KH quan tâm gói Business, hẹn demo thứ 5",
    score: 4,
  },
  {
    id: 2,
    name: "Trần Thị Lan",
    phone: "0912 345 678",
    hotline: "1900 5678",
    type: "in" as const,
    status: "answered" as const,
    duration: "7:18",
    time: "09:31",
    date: "Hôm nay",
    tag: "Gia hạn",
    tagColor: "#0891b2",
    note: "Cần gửi báo giá gia hạn trước 15h",
    score: 5,
  },
  {
    id: 3,
    name: "Lê Hoàng Phúc",
    phone: "0888 901 234",
    hotline: "1900 1234",
    type: "out" as const,
    status: "missed" as const,
    duration: "—",
    time: "09:52",
    date: "Hôm nay",
    tag: null,
    tagColor: null,
    note: null,
    score: null,
  },
  {
    id: 4,
    name: "Phạm Thu Hà",
    phone: "0976 543 210",
    hotline: "1900 5678",
    type: "in" as const,
    status: "answered" as const,
    duration: "12:05",
    time: "10:08",
    date: "Hôm nay",
    tag: "Demo",
    tagColor: "#16a34a",
    note: "Demo thành công, gửi proposal",
    score: 5,
  },
  {
    id: 5,
    name: "Võ Minh Tuấn",
    phone: "0933 210 987",
    hotline: "1900 1234",
    type: "out" as const,
    status: "answered" as const,
    duration: "5:20",
    time: "10:45",
    date: "Hôm nay",
    tag: "Upsell",
    tagColor: "#d97706",
    note: "Đang cân nhắc nâng gói Pro",
    score: 4,
  },
];

const featureList = [
  "Lưu lịch sử cuộc gọi tự động",
  "Ghi âm và nghe lại cuộc gọi",
  "Gắn nhãn và phân loại khách hàng",
  "Ghi chú sau mỗi cuộc gọi",
  "Theo dõi trạng thái cuộc gọi",
  "Tìm kiếm lịch sử nhanh chóng",
];

const floatingStats = [
  { value: "84", label: "Cuộc gọi hôm nay (minh họa)", icon: PhoneCall, color: "#673ab7" },
  { value: "73%", label: "Tỷ lệ nghe máy (minh họa)", icon: Check, color: "#16a34a" },
  { value: "Ghi âm", label: "Tự động theo cuộc gọi", icon: Mic, color: "#0891b2" },
];

function CallTimelineMockup() {
  const [activeId, setActiveId] = useState<number>(2);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(44);
  const [activeTab, setActiveTab] = useState<"all" | "in" | "out" | "missed">("all");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setProgress((p) => { if (p >= 100) { setPlaying(false); return 44; } return p + 0.6; });
    }, 80);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const activeItem = timelineItems.find((i) => i.id === activeId)!;
  const filtered = activeTab === "all" ? timelineItems : timelineItems.filter((i) =>
    activeTab === "missed" ? i.status === "missed" : i.type === activeTab
  );

  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "in", label: "Đến" },
    { key: "out", label: "Đi" },
    { key: "missed", label: "Nhỡ" },
  ];

  return (
    <div
      className="rounded-3xl overflow-hidden w-full"
      style={{
        background: "#fff",
        boxShadow: "0 32px 80px rgba(103,58,183,0.16), 0 4px 16px rgba(0,0,0,0.06)",
        border: "1px solid rgba(103,58,183,0.12)",
        fontFamily: "'Inter', sans-serif",
        maxWidth: "560px",
      }}
    >
      {/* Chrome bar */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ background: "#673ab7" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/25" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/25" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/25" />
          </div>
          <span className="text-xs text-white/75 font-medium ml-1.5">Timeline Cuộc gọi</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.15)" }}>
            <Search size={11} color="rgba(255,255,255,0.8)" />
            <span className="text-[11px] text-white/70">Tìm kiếm...</span>
          </div>
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={14} color="rgba(255,255,255,0.7)" />
            <Download size={14} color="rgba(255,255,255,0.7)" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-0" style={{ borderBottom: "1px solid rgba(103,58,183,0.08)" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            className="px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all duration-150"
            style={{
              color: activeTab === t.key ? "#673ab7" : "#9ca3af",
              borderBottom: activeTab === t.key ? "2px solid #673ab7" : "2px solid transparent",
              marginBottom: "-1px",
              background: "transparent",
            }}
            onClick={() => setActiveTab(t.key as typeof activeTab)}
          >
            {t.label}
            {t.key === "missed" && (
              <span className="ml-1.5 px-1 py-0.5 rounded text-[9px] font-bold" style={{ background: "#fee2e2", color: "#ef4444" }}>1</span>
            )}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 pb-2">
          <span className="text-[10px]" style={{ color: "#9ca3af" }}>Hotline:</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "#f0ecf9", color: "#673ab7" }}>1900 1234</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "#f0ecf9", color: "#673ab7" }}>1900 5678</span>
        </div>
      </div>

      {/* Timeline list */}
      <div style={{ maxHeight: "248px", overflowY: "auto" }}>
        {filtered.map((item) => {
          const isActive = item.id === activeId;
          const TypeIcon = item.type === "in" ? PhoneIncoming : item.status === "missed" ? PhoneMissed : PhoneOutgoing;
          const iconColor = item.status === "missed" ? "#ef4444" : item.type === "in" ? "#16a34a" : "#673ab7";
          const iconBg = item.status === "missed" ? "#fef2f2" : item.type === "in" ? "#f0fdf4" : "#f0ecf9";

          return (
            <div
              key={item.id}
              className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-100"
              style={{
                background: isActive ? "#fbf9ff" : "transparent",
                borderBottom: "1px solid rgba(103,58,183,0.06)",
                borderLeft: isActive ? "3px solid #673ab7" : "3px solid transparent",
              }}
              onClick={() => { setActiveId(item.id); setPlaying(false); setProgress(44); }}
            >
              {/* Icon */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: iconBg }}>
                <TypeIcon size={13} color={iconColor} strokeWidth={2} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-semibold truncate" style={{ color: "#1e2026" }}>{item.name}</span>
                  {item.tag && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0" style={{ background: item.tagColor + "18", color: item.tagColor! }}>{item.tag}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px]" style={{ color: "#9ca3af" }}>{item.phone}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "#f6f3fc", color: "#673ab7" }}>
                    {item.hotline}
                  </span>
                </div>
                {item.note && isActive && (
                  <div className="flex items-center gap-1 mt-1">
                    <FileText size={10} color="#9ca3af" />
                    <span className="text-[10px] truncate" style={{ color: "#5b5f6b" }}>{item.note}</span>
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[11px] font-medium" style={{ color: item.status === "missed" ? "#ef4444" : "#5b5f6b" }}>{item.duration}</span>
                <span className="text-[10px]" style={{ color: "#9ca3af" }}>{item.time}</span>
                {item.status === "answered" && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                    style={{ background: isActive ? "#673ab7" : "#f0ecf9" }}
                    onClick={(e) => { e.stopPropagation(); setActiveId(item.id); setPlaying((p) => !p); }}
                  >
                    {playing && isActive ? <Pause size={8} color="#fff" /> : <Play size={8} color={isActive ? "#fff" : "#673ab7"} />}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Audio player */}
      {activeItem.status === "answered" && (
        <div className="px-4 py-3.5" style={{ background: "#fbf9ff", borderTop: "1px solid rgba(103,58,183,0.10)" }}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#f0ecf9" }}>
                <Voicemail size={11} color="#673ab7" />
              </div>
              <div>
                <span className="text-xs font-semibold" style={{ color: "#1e2026" }}>{activeItem.name}</span>
                <span className="text-[10px] ml-2" style={{ color: "#9ca3af" }}>{activeItem.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: activeItem.score ?? 0 }).map((_, i) => (
                <Star key={i} size={10} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
          </div>

          {/* Waveform */}
          <div className="flex items-center gap-[2px] h-9 mb-2">
            {Array.from({ length: 64 }, (_, i) => {
              const h = 8 + Math.sin(i * 0.55) * 7 + Math.sin(i * 1.2) * 5 + Math.abs(Math.sin(i * 0.3)) * 10;
              const pct = (i / 64) * 100;
              return (
                <div
                  key={i}
                  className="rounded-full flex-1 transition-colors duration-75"
                  style={{
                    height: `${Math.max(3, h)}px`,
                    background: pct <= progress ? "#673ab7" : "rgba(103,58,183,0.15)",
                  }}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#673ab7" }}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause size={10} color="#fff" /> : <Play size={10} color="#fff" />}
            </button>
            <div
              className="flex-1 h-1 rounded-full cursor-pointer overflow-hidden"
              style={{ background: "rgba(103,58,183,0.15)" }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setProgress(((e.clientX - rect.left) / rect.width) * 100);
              }}
            >
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "#673ab7" }} />
            </div>
            <span className="text-[10px] tabular-nums flex-shrink-0" style={{ color: "#9ca3af", fontFamily: "'DM Mono', monospace" }}>
              {String(Math.floor((progress / 100) * parseInt(activeItem.duration))).padStart(1, "0")}:
              {String(Math.floor(((progress / 100) * parseFloat(activeItem.duration.replace(":", ".")) % 1) * 60)).padStart(2, "0")}
            </span>
            <Volume2 size={13} color="#9ca3af" />
          </div>

          {/* Tags row */}
          {activeItem.tag && (
            <div className="flex items-center gap-1.5 mt-2.5 pt-2.5" style={{ borderTop: "1px solid rgba(103,58,183,0.08)" }}>
              <Tag size={10} color="#9ca3af" />
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: (activeItem.tagColor ?? "#673ab7") + "18", color: activeItem.tagColor ?? "#673ab7" }}>
                {activeItem.tag}
              </span>
              {activeItem.note && (
                <span className="text-[10px] truncate" style={{ color: "#5b5f6b" }}>{activeItem.note}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CallTimelineSection() {
  return (
    <section
      className="py-28 overflow-hidden"
      style={{ background: "#fff", fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* ── Left ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-7 order-2 lg:order-1">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ background: "rgba(103,58,183,0.08)", color: "#673ab7", letterSpacing: "0.08em" }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#673ab7" }} />
              Hoạt động cuộc gọi Realtime
            </div>

            {/* Headline */}
            <div>
              <h2
                className="font-extrabold tracking-tight mb-5"
                style={{ fontSize: "clamp(26px, 3.2vw, 42px)", color: "#1e2026", lineHeight: 1.14 }}
              >
                Theo dõi toàn bộ hoạt động cuộc gọi{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  theo thời gian thực
                </span>
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "#5b5f6b", fontSize: "16px", maxWidth: "480px" }}>
                Từ cuộc gọi đến, cuộc gọi đi, cuộc gọi nhỡ, ghi âm, ghi chú đến đánh giá chất lượng cuộc gọi — tất cả đều được lưu trữ tập trung trên Gcalls Webphone.
              </p>
            </div>

            {/* Feature list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {featureList.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(103,58,183,0.10)" }}
                  >
                    <Check size={11} color="#673ab7" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#5b5f6b" }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Stat pills */}
            <div
              className="flex flex-wrap gap-3 pt-2 pb-1"
              style={{ borderTop: "1px solid rgba(103,58,183,0.10)" }}
            >
              {floatingStats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                    style={{
                      background: s.color + "0d",
                      border: `1px solid ${s.color}22`,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: s.color + "18" }}
                    >
                      <Icon size={13} color={s.color} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold leading-none mb-0.5" style={{ color: "#1e2026" }}>{s.value}</div>
                      <div className="text-[11px]" style={{ color: "#5b5f6b" }}>{s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right — UI mockup ────────────────────────────── */}
          <div className="relative flex items-center justify-center order-1 lg:order-2" style={{ minHeight: "520px" }}>
            {/* Glow backdrop */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "480px",
                height: "480px",
                background: "radial-gradient(circle, rgba(103,58,183,0.09) 0%, transparent 70%)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Main card */}
            <div className="relative w-full" style={{ maxWidth: "560px", zIndex: 2 }}>
              <CallTimelineMockup />
            </div>

            {/* Floating stat cards */}
            {floatingStats.map((s, i) => {
              const Icon = s.icon;
              const positions = [
                { top: "12px", left: "-52px" },
                { bottom: "100px", left: "-64px" },
                { bottom: "20px", right: "-32px" },
              ];
              return (
                <div
                  key={s.label}
                  className="absolute flex items-center gap-2.5 px-4 py-3 rounded-2xl"
                  style={{
                    ...positions[i],
                    background: "#fff",
                    boxShadow: "0 8px 28px rgba(103,58,183,0.14), 0 1px 4px rgba(0,0,0,0.04)",
                    border: "1px solid rgba(103,58,183,0.10)",
                    zIndex: 10,
                    fontFamily: "'Inter', sans-serif",
                    minWidth: "180px",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: s.color + "15" }}
                  >
                    <Icon size={16} color={s.color} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-base font-extrabold leading-none mb-0.5" style={{ color: "#1e2026", fontFamily: "'Open Sans', sans-serif" }}>{s.value}</div>
                    <div className="text-[11px]" style={{ color: "#5b5f6b" }}>{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom highlight block ──────────────────────── */}
        <div
          className="mt-20 rounded-3xl px-10 py-12 flex flex-col md:flex-row items-center gap-8 md:gap-16"
          style={{
            background: "#f6f3fc",
            border: "1px solid rgba(103,58,183,0.10)",
          }}
        >
          {/* Icon accent */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)", boxShadow: "0 8px 24px rgba(103,58,183,0.30)" }}
          >
            <Clock size={28} color="#fff" strokeWidth={1.8} />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3
              className="font-extrabold mb-3"
              style={{ fontSize: "clamp(20px, 2.4vw, 28px)", color: "#1e2026", lineHeight: 1.2 }}
            >
              Mỗi cuộc gọi đều trở thành{" "}
              <span style={{ color: "#673ab7" }}>dữ liệu giá trị</span>
            </h3>
            <p className="text-base leading-relaxed" style={{ color: "#5b5f6b", maxWidth: "580px" }}>
              Lịch sử trao đổi, ghi âm, ghi chú và kết quả cuộc gọi được lưu lại giúp đội Sales và CSKH dễ dàng tiếp nối công việc mà không bỏ lỡ bất kỳ cơ hội nào.
            </p>
          </div>

          <button
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm flex-shrink-0 transition-all duration-150"
            style={{
              background: "#673ab7",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(103,58,183,0.30)",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#5929a8";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#673ab7";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Xem tính năng Timeline
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}

// ─── Section 4: CRM ──────────────────────────────────────────────────────────

const crmContacts = [
  {
    id: 1,
    name: "Nguyễn Văn Minh",
    company: "Công ty TNHH Bình Minh",
    phone: "0901 234 567",
    email: "minh.nv@binhminh.vn",
    avatar: "NM",
    avatarColor: "#673ab7",
    tags: ["Khách hàng mới", "Demo"],
    calls: 12,
    lastCall: "Hôm nay 09:14",
    stage: "Demo",
    stageColor: "#673ab7",
    note: "KH quan tâm gói Business. Hẹn demo thứ 5 tuần này. Cần gửi proposal trước ngày 25.",
  },
  {
    id: 2,
    name: "Trần Thị Lan",
    company: "CTCP Việt Phát",
    phone: "0912 345 678",
    email: "lan.tt@vietphat.com",
    avatar: "TL",
    avatarColor: "#0891b2",
    tags: ["Gia hạn", "VIP"],
    calls: 8,
    lastCall: "Hôm nay 09:31",
    stage: "Đàm phán",
    stageColor: "#d97706",
    note: "Cần gửi báo giá gia hạn trước 15h hôm nay.",
  },
  {
    id: 3,
    name: "Phạm Thu Hà",
    company: "Tập đoàn Sao Việt",
    phone: "0976 543 210",
    email: "ha.pt@saoviet.vn",
    avatar: "PH",
    avatarColor: "#16a34a",
    tags: ["Đề xuất", "Hot"],
    calls: 24,
    lastCall: "Hôm nay 10:08",
    stage: "Đề xuất",
    stageColor: "#16a34a",
    note: "Demo thành công, đang chờ duyệt ngân sách từ BGĐ.",
  },
  {
    id: 4,
    name: "Võ Minh Tuấn",
    company: "StartupHub Việt Nam",
    phone: "0933 210 987",
    email: "tuan.vm@startuphub.vn",
    avatar: "VT",
    avatarColor: "#7c3aed",
    tags: ["Upsell"],
    calls: 6,
    lastCall: "Hôm nay 10:45",
    stage: "Cân nhắc",
    stageColor: "#9ca3af",
    note: "Đang xem xét nâng lên gói Pro. Follow up sau 3 ngày.",
  },
];

const crmInteractions = [
  { type: "call", label: "Cuộc gọi đến", detail: "7:18 phút · Ghi âm có sẵn", time: "09:31", icon: PhoneIncoming, color: "#16a34a" },
  { type: "note", label: "Ghi chú", detail: "Cần gửi báo giá gia hạn trước 15h hôm nay", time: "09:35", icon: FileText, color: "#673ab7" },
  { type: "call", label: "Cuộc gọi đi", detail: "3:42 phút · Đã nghe máy", time: "Hôm qua", icon: PhoneOutgoing, color: "#0891b2" },
  { type: "tag", label: "Gắn nhãn VIP", detail: "Thêm tag: VIP, Gia hạn", time: "2 ngày trước", icon: Tag, color: "#d97706" },
];

const crmFeatures = [
  "Danh bạ khách hàng tập trung",
  "Hồ sơ khách hàng chi tiết",
  "Ghi chú và lịch sử chăm sóc",
  "Phân loại khách hàng bằng Tag",
  "Tìm kiếm khách hàng nhanh chóng",
  "Theo dõi hoạt động theo thời gian thực",
];

const crmStats = [
  { value: "Danh bạ", label: "Quản lý tập trung trên Webphone", icon: Users, color: "#673ab7" },
  { value: "Lịch sử", label: "Tương tác được lưu trữ đầy đủ", icon: Activity, color: "#16a34a" },
  { value: "CRM", label: "Tích hợp sẵn trong nền tảng", icon: Plug, color: "#0891b2" },
];

const useCases = [
  {
    icon: Briefcase,
    role: "Sales Team",
    color: "#673ab7",
    bg: "#f5f0fd",
    points: ["Xem hồ sơ KH trước khi gọi", "Ghi chú kết quả tư vấn ngay sau cuộc gọi", "Theo dõi pipeline theo từng KH"],
  },
  {
    icon: HeadphonesIcon,
    role: "CSKH Team",
    color: "#0891b2",
    bg: "#f0f9ff",
    points: ["Biết ngay lịch sử KH khi nhận cuộc gọi", "Gắn nhãn phân loại mức độ ưu tiên", "Ghi nhận phản hồi và yêu cầu hỗ trợ"],
  },
  {
    icon: ShieldCheck,
    role: "Manager",
    color: "#16a34a",
    bg: "#f0fdf4",
    points: ["Theo dõi tương tác toàn đội ngũ", "Kiểm soát chất lượng chăm sóc KH", "Báo cáo hoạt động theo KH / nhân viên"],
  },
];

function CRMMockup() {
  const [activeContact, setActiveContact] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const contact = crmContacts[activeContact];

  const filtered = crmContacts.filter(
    (c) => !searchVal || c.name.toLowerCase().includes(searchVal.toLowerCase()) || c.company.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div
      className="rounded-3xl overflow-hidden w-full flex"
      style={{
        background: "#fff",
        boxShadow: "0 32px 80px rgba(103,58,183,0.16), 0 4px 16px rgba(0,0,0,0.06)",
        border: "1px solid rgba(103,58,183,0.12)",
        fontFamily: "'Inter', sans-serif",
        maxWidth: "580px",
        minHeight: "480px",
      }}
    >
      {/* ── Left panel: contact list ── */}
      <div className="w-52 flex-shrink-0 flex flex-col" style={{ borderRight: "1px solid rgba(103,58,183,0.09)" }}>
        {/* Panel header */}
        <div className="px-3.5 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(103,58,183,0.08)" }}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold" style={{ color: "#1e2026" }}>Danh bạ</span>
            <div className="flex items-center gap-1">
              <button className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: "#f0ecf9" }}>
                <Filter size={10} color="#673ab7" />
              </button>
              <button className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: "#673ab7" }}>
                <Plus size={10} color="#fff" />
              </button>
            </div>
          </div>
          {/* Search */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: "#f6f3fc" }}>
            <Search size={11} color="#9ca3af" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="text-xs bg-transparent outline-none flex-1 w-0"
              style={{ color: "#1e2026" }}
            />
          </div>
        </div>

        {/* Contact rows */}
        <div className="flex-1 overflow-y-auto">
          {(searchVal ? filtered : crmContacts).map((c, i) => (
            <div
              key={c.id}
              className="flex items-center gap-2.5 px-3.5 py-3 cursor-pointer transition-colors"
              style={{
                background: activeContact === i ? "#fbf9ff" : "transparent",
                borderLeft: activeContact === i ? "3px solid #673ab7" : "3px solid transparent",
                borderBottom: "1px solid rgba(103,58,183,0.05)",
              }}
              onClick={() => setActiveContact(i)}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: c.avatarColor + "18", color: c.avatarColor }}
              >
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold truncate" style={{ color: "#1e2026" }}>{c.name}</div>
                <div className="text-[10px] truncate" style={{ color: "#9ca3af" }}>{c.company}</div>
              </div>
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: c.stageColor }}
              />
            </div>
          ))}
        </div>

        {/* Footer count */}
        <div className="px-3.5 py-2.5" style={{ borderTop: "1px solid rgba(103,58,183,0.08)" }}>
          <span className="text-[10px]" style={{ color: "#9ca3af" }}>{crmContacts.length} liên hệ · trang 1/12</span>
        </div>
      </div>

      {/* ── Right panel: contact detail ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Detail header */}
        <div
          className="px-5 pt-5 pb-4"
          style={{ borderBottom: "1px solid rgba(103,58,183,0.08)", background: "linear-gradient(180deg, #fbf9ff 0%, #fff 100%)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: contact.avatarColor + "20", color: contact.avatarColor }}
            >
              {contact.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold" style={{ color: "#1e2026" }}>{contact.name}</span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: contact.stageColor + "18", color: contact.stageColor }}
                >
                  {contact.stage}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Building2 size={10} color="#9ca3af" />
                <span className="text-xs truncate" style={{ color: "#5b5f6b" }}>{contact.company}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {contact.tags.map((t) => (
                  <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: contact.avatarColor + "12", color: contact.avatarColor }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "#f0ecf9" }}>
                <Phone size={12} color="#673ab7" />
              </button>
              <button className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "#f0ecf9" }}>
                <Mail size={12} color="#673ab7" />
              </button>
              <button className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "#f0ecf9" }}>
                <MoreHorizontal size={12} color="#673ab7" />
              </button>
            </div>
          </div>

          {/* Contact info pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px]" style={{ background: "#f6f3fc", color: "#5b5f6b" }}>
              <Phone size={9} color="#673ab7" /> {contact.phone}
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px]" style={{ background: "#f6f3fc", color: "#5b5f6b" }}>
              <Mail size={9} color="#673ab7" /> {contact.email}
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px]" style={{ background: "#f6f3fc", color: "#5b5f6b" }}>
              <PhoneCall size={9} color="#673ab7" /> {contact.calls} cuộc gọi
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(103,58,183,0.07)", background: "#fffdf7" }}>
          <div className="flex items-start gap-2">
            <FileText size={11} color="#d97706" className="mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-[10px] font-semibold mb-0.5" style={{ color: "#d97706" }}>Ghi chú gần nhất</div>
              <p className="text-[11px] leading-relaxed" style={{ color: "#5b5f6b" }}>{contact.note}</p>
            </div>
          </div>
        </div>

        {/* Interaction history */}
        <div className="flex-1 px-5 py-3 overflow-y-auto">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold" style={{ color: "#1e2026" }}>Lịch sử hoạt động</span>
            <span className="text-[10px]" style={{ color: "#9ca3af" }}>Gần nhất</span>
          </div>
          <div className="flex flex-col gap-2">
            {crmInteractions.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: item.color + "15" }}
                  >
                    <Icon size={10} color={item.color} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold" style={{ color: "#1e2026" }}>{item.label}</span>
                      <span className="text-[10px] flex-shrink-0" style={{ color: "#9ca3af" }}>{item.time}</span>
                    </div>
                    <p className="text-[10px] leading-relaxed mt-0.5 truncate" style={{ color: "#5b5f6b" }}>{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom action */}
        <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(103,58,183,0.08)" }}>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]" style={{ color: "#9ca3af" }}>Cập nhật lần cuối: {contact.lastCall}</span>
            <div className="flex-1" />
            <button
              className="flex items-center gap-1 text-[10px] font-medium px-2.5 py-1.5 rounded-lg transition-colors"
              style={{ background: "#f0ecf9", color: "#673ab7" }}
            >
              <ExternalLink size={9} />
              Xem đầy đủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CRMSection() {
  return (
    <section
      className="py-28 overflow-hidden"
      style={{ background: "#ffffff", fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* ── Right: mockup first visually on desktop ── */}
          <div className="relative flex items-center justify-center order-1" style={{ minHeight: "520px" }}>
            {/* Glow */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "500px",
                height: "500px",
                background: "radial-gradient(circle, rgba(103,58,183,0.08) 0%, transparent 70%)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            <div className="relative w-full" style={{ maxWidth: "580px", zIndex: 2 }}>
              <CRMMockup />
            </div>

            {/* Floating stat cards */}
            {[
              { ...crmStats[0], pos: { top: "8px", right: "-16px" } },
              { ...crmStats[1], pos: { bottom: "80px", right: "-24px" } },
              { ...crmStats[2], pos: { bottom: "12px", left: "-20px" } },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="absolute flex items-center gap-2.5 px-4 py-3 rounded-2xl"
                  style={{
                    ...s.pos,
                    background: "#fff",
                    boxShadow: "0 8px 28px rgba(103,58,183,0.13), 0 1px 4px rgba(0,0,0,0.04)",
                    border: "1px solid rgba(103,58,183,0.10)",
                    zIndex: 10,
                    fontFamily: "'Inter', sans-serif",
                    minWidth: "176px",
                  }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + "15" }}>
                    <Icon size={16} color={s.color} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold leading-none mb-0.5" style={{ color: "#1e2026", fontFamily: "'Open Sans', sans-serif" }}>{s.value}</div>
                    <div className="text-[11px]" style={{ color: "#5b5f6b" }}>{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Left: copy ── */}
          <div className="flex flex-col gap-7 order-2">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ background: "rgba(103,58,183,0.08)", color: "#673ab7", letterSpacing: "0.08em" }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#673ab7" }} />
              CRM Mini Tích Hợp
            </div>

            <div>
              <h2
                className="font-extrabold tracking-tight mb-5"
                style={{ fontSize: "clamp(26px, 3.2vw, 42px)", color: "#1e2026", lineHeight: 1.14 }}
              >
                Quản lý khách hàng{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  tập trung
                </span>{" "}
                ngay trên Gcalls
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "#5b5f6b", fontSize: "16px", maxWidth: "480px" }}>
                Toàn bộ thông tin khách hàng, lịch sử tương tác và ghi chú chăm sóc được lưu trữ tập trung giúp đội Sales và CSKH làm việc hiệu quả hơn.
              </p>
            </div>

            {/* Feature list 2-col */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {crmFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(103,58,183,0.10)" }}>
                    <Check size={11} color="#673ab7" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#5b5f6b" }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3 pt-2" style={{ borderTop: "1px solid rgba(103,58,183,0.10)" }}>
              {crmStats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                    style={{ background: s.color + "0d", border: `1px solid ${s.color}22` }}
                  >
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + "18" }}>
                      <Icon size={13} color={s.color} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold leading-none mb-0.5" style={{ color: "#1e2026" }}>{s.value}</div>
                      <div className="text-[11px]" style={{ color: "#5b5f6b" }}>{s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Bottom highlight ── */}
        <div
          className="mt-20 rounded-3xl px-8 py-12"
          style={{ background: "#f6f3fc", border: "1px solid rgba(103,58,183,0.10)" }}
        >
          <div className="text-center mb-10">
            <h3
              className="font-extrabold mb-4"
              style={{ fontSize: "clamp(20px, 2.4vw, 30px)", color: "#1e2026", lineHeight: 1.2 }}
            >
              Mỗi khách hàng đều có{" "}
              <span style={{ color: "#673ab7" }}>một hồ sơ riêng</span>
            </h3>
            <p
              className="text-base leading-relaxed mx-auto"
              style={{ color: "#5b5f6b", maxWidth: "560px" }}
            >
              Khi có cuộc gọi đến hoặc đi, nhân viên có thể xem ngay thông tin khách hàng, lịch sử chăm sóc, ghi chú và các hoạt động liên quan mà không cần chuyển đổi giữa nhiều hệ thống.
            </p>
          </div>

          {/* Use case cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {useCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <div
                  key={uc.role}
                  className="rounded-2xl p-6"
                  style={{
                    background: "#fff",
                    border: `1px solid ${uc.color}1a`,
                    boxShadow: "0 2px 12px rgba(103,58,183,0.06)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: uc.bg }}
                    >
                      <Icon size={18} color={uc.color} strokeWidth={1.8} />
                    </div>
                    <span className="font-bold text-sm" style={{ color: "#1e2026" }}>{uc.role}</span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {uc.points.map((pt) => (
                      <div key={pt} className="flex items-start gap-2">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: uc.color + "15" }}
                        >
                          <Check size={9} color={uc.color} strokeWidth={3} />
                        </div>
                        <span className="text-sm leading-snug" style={{ color: "#5b5f6b" }}>{pt}</span>
                      </div>
                    ))}
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

// ─── Section 5: Team Management ──────────────────────────────────────────────

const teamMembers = [
  { id: 1, name: "Nguyễn Hằng",    email: "hang.n@gcalls.vn",    role: "Sales",        group: "Nhóm Bắc",   status: "online",  calls: 24, avatar: "NH", color: "#673ab7" },
  { id: 2, name: "Trần Minh Tuấn", email: "tuan.tm@gcalls.vn",   role: "Telesales",    group: "Nhóm Nam",   status: "on-call", calls: 18, avatar: "TT", color: "#0891b2" },
  { id: 3, name: "Lê Phương Linh", email: "linh.lp@gcalls.vn",   role: "CSKH",         group: "Nhóm Trung", status: "online",  calls: 31, avatar: "LL", color: "#16a34a" },
  { id: 4, name: "Phạm Đức Dương", email: "duong.pd@gcalls.vn",  role: "Team Leader",  group: "Nhóm Bắc",   status: "away",    calls: 9,  avatar: "PD", color: "#d97706" },
  { id: 5, name: "Võ Thị Thanh",   email: "thanh.vt@gcalls.vn",  role: "Sales",        group: "Nhóm Nam",   status: "online",  calls: 22, avatar: "VT", color: "#7c3aed" },
  { id: 6, name: "Đỗ Quang Hải",   email: "hai.dq@gcalls.vn",    role: "Manager",      group: "Ban quản lý", status: "offline", calls: 5,  avatar: "DH", color: "#64748b" },
];

const rolePermissions = [
  {
    role: "Admin",
    color: "#673ab7",
    bg: "#f5f0fd",
    perms: ["Quản lý toàn bộ hệ thống", "Thêm / xóa người dùng", "Xem tất cả cuộc gọi", "Xuất báo cáo", "Cấu hình hotline & SIP"],
    count: 2,
  },
  {
    role: "Manager",
    color: "#0891b2",
    bg: "#f0f9ff",
    perms: ["Xem báo cáo đội ngũ", "Nghe lại ghi âm", "Phân công khách hàng", "Quản lý nhóm của mình"],
    count: 4,
  },
  {
    role: "Sales / CSKH",
    color: "#16a34a",
    bg: "#f0fdf4",
    perms: ["Gọi & nhận cuộc gọi", "Xem KH được phân công", "Ghi chú & gắn tag", "Xem lịch sử của mình"],
    count: 38,
  },
];

const teamFeatures = [
  "Quản lý tài khoản nhân viên",
  "Phân quyền theo vai trò",
  "Quản lý phòng ban và nhóm",
  "Kiểm soát dữ liệu khách hàng",
  "Theo dõi hoạt động người dùng",
  "Tăng cường bảo mật hệ thống",
];

const teamStats = [
  { value: "50+", label: "Nhân sự được quản lý", icon: Users, color: "#673ab7" },
  { value: "RBAC", label: "Role Based Permission", icon: ShieldCheck, color: "#0891b2" },
  { value: "100%", label: "Dữ liệu tập trung", icon: Activity, color: "#16a34a" },
];

const workflowSteps = [
  { n: "01", title: "Tạo tài khoản nhân viên",   desc: "Thêm thành viên vào hệ thống, gán hotline và nhóm làm việc",              icon: UserCheck,   color: "#673ab7" },
  { n: "02", title: "Phân quyền theo vai trò",    desc: "Thiết lập quyền truy cập phù hợp cho từng vai trò trong tổ chức",         icon: ShieldCheck, color: "#7c3aed" },
  { n: "03", title: "Giao khách hàng & hotline",  desc: "Phân công danh sách khách hàng và đường dây riêng cho từng nhân viên",    icon: Users,       color: "#0891b2" },
  { n: "04", title: "Theo dõi cuộc gọi",          desc: "Giám sát realtime: ai đang gọi, ai nhỡ máy, chất lượng từng cuộc gọi",    icon: PhoneCall,   color: "#16a34a" },
  { n: "05", title: "Đánh giá KPI",               desc: "Tổng hợp hiệu suất gọi, tỷ lệ chốt deal và điểm chất lượng từng nhân viên", icon: BarChart2,  color: "#d97706" },
];

const teamUseCases = [
  { role: "Sales Team",    icon: Briefcase,        color: "#673ab7", bg: "#f5f0fd", desc: "Tập trung vào gọi, ghi chú kết quả, theo dõi pipeline KH được phân công." },
  { role: "Team Leader",   icon: UserCheck,        color: "#0891b2", bg: "#f0f9ff", desc: "Nghe lại ghi âm, đánh giá chất lượng cuộc gọi, huấn luyện nhân viên." },
  { role: "Manager",       icon: BarChart2,        color: "#16a34a", bg: "#f0fdf4", desc: "Xem báo cáo KPI, phân tích hiệu suất nhóm, điều phối nguồn lực." },
  { role: "Admin",         icon: ShieldCheck,      color: "#7c3aed", bg: "#f5f0ff", desc: "Cấu hình hệ thống, quản lý tài khoản, thiết lập bảo mật và tích hợp." },
];

const statsBlock = [
  { title: "User Management",    value: "Tập trung",      sub: "Toàn bộ nhân sự trong 1 giao diện",     icon: Users,      color: "#673ab7" },
  { title: "Permission Control", value: "Linh hoạt",      sub: "Phân quyền chi tiết theo role & nhóm",  icon: ShieldCheck,color: "#0891b2" },
  { title: "Multi Department",   value: "Đa phòng ban",   sub: "Quản lý nhiều nhóm & phòng ban",         icon: Building2,  color: "#16a34a" },
  { title: "Activity Tracking",  value: "Realtime",       sub: "Mọi hoạt động được ghi lại tức thì",     icon: Activity,   color: "#d97706" },
];

const statusDot: Record<string, { bg: string; label: string }> = {
  online:  { bg: "#22c55e", label: "Trực tuyến" },
  "on-call": { bg: "#673ab7", label: "Đang gọi" },
  away:    { bg: "#f59e0b", label: "Vắng mặt" },
  offline: { bg: "#9ca3af", label: "Ngoại tuyến" },
};

function TeamMgmtMockup() {
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");
  const [activeRole, setActiveRole] = useState(0);

  return (
    <div
      className="rounded-3xl overflow-hidden w-full"
      style={{
        background: "#fff",
        boxShadow: "0 32px 80px rgba(103,58,183,0.16), 0 4px 16px rgba(0,0,0,0.06)",
        border: "1px solid rgba(103,58,183,0.12)",
        fontFamily: "'Inter', sans-serif",
        maxWidth: "560px",
      }}
    >
      {/* Chrome */}
      <div className="flex items-center justify-between px-5 py-3.5" style={{ background: "#673ab7" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/25" />)}
          </div>
          <span className="text-xs text-white/75 font-medium ml-1.5">Quản lý đội ngũ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.15)" }}>
            <Search size={11} color="rgba(255,255,255,0.8)" />
            <span className="text-[11px] text-white/70">Tìm nhân viên...</span>
          </div>
          <button className="flex items-center gap-1 text-[11px] font-semibold text-white px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.2)" }}>
            <Plus size={11} color="#fff" /> Thêm
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-3 gap-1" style={{ borderBottom: "1px solid rgba(103,58,183,0.08)" }}>
        {(["users", "roles"] as const).map((t) => (
          <button
            key={t}
            className="px-4 py-2 text-xs font-semibold rounded-t-lg transition-all duration-150"
            style={{
              color: activeTab === t ? "#673ab7" : "#9ca3af",
              borderBottom: activeTab === t ? "2px solid #673ab7" : "2px solid transparent",
              marginBottom: "-1px",
              background: "transparent",
            }}
            onClick={() => setActiveTab(t)}
          >
            {t === "users" ? "Người dùng" : "Vai trò & Quyền hạn"}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 pb-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "#f0ecf9", color: "#673ab7" }}>44 thành viên</span>
          <Filter size={13} color="#9ca3af" />
        </div>
      </div>

      {activeTab === "users" ? (
        /* ── User list ── */
        <div>
          {/* Column headers */}
          <div className="grid px-4 py-2" style={{ gridTemplateColumns: "1fr 90px 70px 60px 44px", borderBottom: "1px solid rgba(103,58,183,0.06)" }}>
            {["Nhân viên", "Vai trò", "Nhóm", "Cuộc gọi", ""].map((h) => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#9ca3af" }}>{h}</span>
            ))}
          </div>
          {teamMembers.map((m) => {
            const dot = statusDot[m.status];
            return (
              <div
                key={m.id}
                className="grid items-center px-4 py-2.5 transition-colors"
                style={{
                  gridTemplateColumns: "1fr 90px 70px 60px 44px",
                  borderBottom: "1px solid rgba(103,58,183,0.05)",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#fbf9ff")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {/* Name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: m.color + "18", color: m.color }}>
                      {m.avatar}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white" style={{ background: dot.bg }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold truncate" style={{ color: "#1e2026" }}>{m.name}</div>
                    <div className="text-[10px] truncate" style={{ color: "#9ca3af" }}>{m.email}</div>
                  </div>
                </div>
                {/* Role */}
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full self-center" style={{ background: m.color + "15", color: m.color }}>
                  {m.role}
                </span>
                {/* Group */}
                <span className="text-[10px] truncate self-center" style={{ color: "#5b5f6b" }}>{m.group}</span>
                {/* Calls */}
                <div className="flex items-center gap-1 self-center">
                  <PhoneCall size={9} color="#9ca3af" />
                  <span className="text-[11px] font-semibold tabular-nums" style={{ color: "#1e2026", fontFamily: "'DM Mono', monospace" }}>{m.calls}</span>
                </div>
                {/* Actions */}
                <button className="w-6 h-6 rounded-lg flex items-center justify-center self-center" style={{ background: "#f6f3fc" }}>
                  <MoreHorizontal size={10} color="#673ab7" />
                </button>
              </div>
            );
          })}
          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: "1px solid rgba(103,58,183,0.07)" }}>
            <span className="text-[10px]" style={{ color: "#9ca3af" }}>Hiển thị 6 / 44 nhân viên</span>
            <div className="flex items-center gap-1">
              {[1,2,3,"..."].map((p, i) => (
                <button key={i} className="w-5 h-5 rounded text-[9px] font-medium" style={{ background: p === 1 ? "#673ab7" : "#f6f3fc", color: p === 1 ? "#fff" : "#5b5f6b" }}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── Roles & Permissions ── */
        <div className="flex">
          {/* Role list sidebar */}
          <div className="w-36 flex-shrink-0" style={{ borderRight: "1px solid rgba(103,58,183,0.08)" }}>
            {rolePermissions.map((r, i) => (
              <div
                key={r.role}
                className="flex items-center gap-2 px-3.5 py-3 cursor-pointer transition-colors"
                style={{
                  borderBottom: "1px solid rgba(103,58,183,0.06)",
                  background: activeRole === i ? "#fbf9ff" : "transparent",
                  borderLeft: activeRole === i ? "3px solid #673ab7" : "3px solid transparent",
                }}
                onClick={() => setActiveRole(i)}
              >
                <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: r.bg }}>
                  <ShieldCheck size={11} color={r.color} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold" style={{ color: "#1e2026" }}>{r.role}</div>
                  <div className="text-[9px]" style={{ color: "#9ca3af" }}>{r.count} users</div>
                </div>
              </div>
            ))}
          </div>
          {/* Permission detail */}
          <div className="flex-1 px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: rolePermissions[activeRole].bg }}>
                <ShieldCheck size={13} color={rolePermissions[activeRole].color} />
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: "#1e2026" }}>Vai trò: {rolePermissions[activeRole].role}</div>
                <div className="text-[10px]" style={{ color: "#9ca3af" }}>{rolePermissions[activeRole].count} người dùng</div>
              </div>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wide mb-2.5" style={{ color: "#9ca3af" }}>Quyền hạn được cấp</div>
            <div className="flex flex-col gap-2">
              {rolePermissions[activeRole].perms.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ background: rolePermissions[activeRole].color + "18" }}>
                    <Check size={9} color={rolePermissions[activeRole].color} strokeWidth={3} />
                  </div>
                  <span className="text-[11px]" style={{ color: "#5b5f6b" }}>{p}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(103,58,183,0.08)" }}>
              <button className="flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors" style={{ background: rolePermissions[activeRole].color + "10", color: rolePermissions[activeRole].color }}>
                <Settings size={10} /> Chỉnh sửa quyền hạn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TeamSection() {
  return (
    <section
      className="py-28 overflow-hidden"
      style={{ background: "#fff", fontFamily: "'Open Sans', sans-serif" }}
    >
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
              Team Management
            </div>

            <div>
              <h2
                className="font-extrabold tracking-tight mb-5"
                style={{ fontSize: "clamp(26px, 3.2vw, 42px)", color: "#1e2026", lineHeight: 1.14 }}
              >
                Quản lý đội ngũ và{" "}
                <span style={{ background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  phân quyền
                </span>{" "}
                theo từng vai trò
              </h2>
              <p style={{ color: "#5b5f6b", fontSize: "16px", lineHeight: 1.7, maxWidth: "480px" }}>
                Từ nhân viên Sales, Telesales, CSKH đến quản lý và quản trị hệ thống, Gcalls giúp doanh nghiệp dễ dàng kiểm soát quyền truy cập và hoạt động của từng thành viên.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {teamFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(103,58,183,0.10)" }}>
                    <Check size={11} color="#673ab7" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#5b5f6b" }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3 pt-2" style={{ borderTop: "1px solid rgba(103,58,183,0.10)" }}>
              {teamStats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl" style={{ background: s.color + "0d", border: `1px solid ${s.color}22` }}>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + "18" }}>
                      <Icon size={13} color={s.color} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold leading-none mb-0.5" style={{ color: "#1e2026" }}>{s.value}</div>
                      <div className="text-[11px]" style={{ color: "#5b5f6b" }}>{s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right mockup */}
          <div className="relative flex items-center justify-center" style={{ minHeight: "500px" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: "480px", height: "480px", background: "radial-gradient(circle, rgba(103,58,183,0.08) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
            <div className="relative w-full" style={{ maxWidth: "560px", zIndex: 2 }}>
              <TeamMgmtMockup />
            </div>
            {/* Floating cards */}
            {[
              { ...teamStats[0], pos: { top: "0px", right: "-16px" } },
              { ...teamStats[1], pos: { bottom: "100px", right: "-20px" } },
              { ...teamStats[2], pos: { bottom: "16px", left: "-16px" } },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="absolute flex items-center gap-2.5 px-4 py-3 rounded-2xl" style={{ ...s.pos, background: "#fff", boxShadow: "0 8px 28px rgba(103,58,183,0.13), 0 1px 4px rgba(0,0,0,0.04)", border: "1px solid rgba(103,58,183,0.10)", zIndex: 10, fontFamily: "'Inter', sans-serif", minWidth: "172px" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + "15" }}>
                    <Icon size={16} color={s.color} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold leading-none mb-0.5" style={{ color: "#1e2026", fontFamily: "'Open Sans', sans-serif" }}>{s.value}</div>
                    <div className="text-[11px]" style={{ color: "#5b5f6b" }}>{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Block 1: Use cases bottom highlight ── */}
        <div className="rounded-3xl px-8 py-12 mb-12" style={{ background: "#f6f3fc", border: "1px solid rgba(103,58,183,0.10)" }}>
          <div className="text-center mb-10">
            <h3 className="font-extrabold mb-4" style={{ fontSize: "clamp(20px, 2.4vw, 30px)", color: "#1e2026", lineHeight: 1.2 }}>
              Mỗi nhân viên chỉ thấy đúng{" "}
              <span style={{ color: "#673ab7" }}>những gì họ cần</span>
            </h3>
            <p className="text-base leading-relaxed mx-auto" style={{ color: "#5b5f6b", maxWidth: "560px" }}>
              Doanh nghiệp có thể thiết lập quyền truy cập cho từng bộ phận, từng nhóm hoặc từng nhân viên nhằm bảo vệ dữ liệu khách hàng và chuẩn hóa quy trình làm việc.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamUseCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <div key={uc.role} className="rounded-2xl p-5 bg-white" style={{ border: `1px solid ${uc.color}1a`, boxShadow: "0 2px 12px rgba(103,58,183,0.05)" }}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ background: uc.bg }}>
                    <Icon size={18} color={uc.color} strokeWidth={1.8} />
                  </div>
                  <div className="text-sm font-bold mb-2" style={{ color: "#1e2026" }}>{uc.role}</div>
                  <p className="text-sm leading-relaxed" style={{ color: "#5b5f6b" }}>{uc.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Block 2: Workflow steps ── */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h3 className="font-extrabold mb-3" style={{ fontSize: "clamp(18px, 2.2vw, 28px)", color: "#1e2026", lineHeight: 1.2 }}>
              Từ nhân viên đến quản lý,{" "}
              <span style={{ color: "#673ab7" }}>mọi hoạt động đều được ghi nhận</span>
            </h3>
          </div>

          {/* Steps row */}
          <div className="relative flex flex-col md:flex-row gap-4">
            {/* Connector line on desktop */}
            <div className="hidden md:block absolute top-10 left-10 right-10 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(103,58,183,0.20), rgba(103,58,183,0.20), rgba(103,58,183,0.20), transparent)", zIndex: 0 }} />

            {workflowSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative flex-1 flex flex-col items-center text-center px-3">
                  {/* Step circle */}
                  <div
                    className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center mb-4 relative z-10"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}18 0%, ${step.color}08 100%)`,
                      border: `1.5px solid ${step.color}28`,
                      boxShadow: `0 4px 20px ${step.color}15`,
                    }}
                  >
                    <Icon size={24} color={step.color} strokeWidth={1.8} />
                    <span className="text-[9px] font-bold mt-1" style={{ color: step.color, fontFamily: "'DM Mono', monospace" }}>{step.n}</span>
                  </div>
                  <div className="text-sm font-bold mb-1.5" style={{ color: "#1e2026" }}>{step.title}</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#5b5f6b" }}>{step.desc}</p>
                  {/* Arrow connector */}
                  {i < workflowSteps.length - 1 && (
                    <div className="hidden md:flex absolute right-0 top-9 items-center" style={{ transform: "translateX(50%)", zIndex: 1 }}>
                      <ChevronRight size={16} color="rgba(103,58,183,0.30)" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Block 3: 4 stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statsBlock.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="rounded-2xl p-6 flex flex-col gap-3"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(103,58,183,0.10)",
                  boxShadow: "0 2px 12px rgba(103,58,183,0.06)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 12px 40px rgba(103,58,183,0.13)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(103,58,183,0.06)")}
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: s.color + "12" }}>
                  <Icon size={20} color={s.color} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-xl font-extrabold mb-0.5" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-sm font-bold mb-1" style={{ color: "#1e2026" }}>{s.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "#5b5f6b" }}>{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

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

function AnalyticsDashboardMockup() {
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

function AnalyticsSection() {
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
          <div className="relative flex items-center justify-center order-1 lg:order-2" style={{ minHeight: "520px" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: "500px", height: "500px", background: "radial-gradient(circle, rgba(103,58,183,0.08) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
            <div className="relative w-full" style={{ maxWidth: "580px", zIndex: 2 }}>
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
                  className="absolute flex items-center gap-2.5 px-3.5 py-3 rounded-2xl"
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
          <button
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm flex-shrink-0 transition-all duration-150 whitespace-nowrap"
            style={{ background: "#673ab7", color: "#fff", boxShadow: "0 4px 20px rgba(103,58,183,0.30)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#5929a8"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#673ab7"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            Khám phá Analytics
            <ArrowRight size={15} />
          </button>
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

      {/* Tabs */}
      <div className="flex px-4 pt-3 gap-1" style={{ borderBottom: "1px solid rgba(103,58,183,0.08)" }}>
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

function CloudSection() {
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
          <div className="relative flex items-center justify-center" style={{ minHeight: "520px" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: "500px", height: "500px", background: "radial-gradient(circle, rgba(103,58,183,0.08) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
            <div className="relative w-full" style={{ maxWidth: "570px", zIndex: 2 }}>
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
                <div key={i} className="absolute flex items-center gap-2.5 px-3.5 py-3 rounded-2xl" style={{ ...pos, background: "#fff", boxShadow: "0 8px 28px rgba(103,58,183,0.13), 0 1px 4px rgba(0,0,0,0.04)", border: "1px solid rgba(103,58,183,0.10)", zIndex: 10, fontFamily: "'Inter',sans-serif", minWidth: "155px" }}>
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

// ─── Section 8: Integrations ─────────────────────────────────────────────────

const integrationFeatures = [
  {
    icon: Code2,
    label: "Open API",
    color: "#673ab7",
    bg: "#f5f0fd",
    desc: "REST API đầy đủ tài liệu, xác thực OAuth 2.0, sandbox miễn phí cho dev.",
  },
  {
    icon: Webhook,
    label: "Webhook",
    color: "#0891b2",
    bg: "#f0f9ff",
    desc: "Nhận sự kiện realtime: cuộc gọi đến, kết thúc, ghi âm, ghi chú mới.",
  },
  {
    icon: Bell,
    label: "Customer Popup",
    color: "#16a34a",
    bg: "#f0fdf4",
    desc: "Hiển thị thông tin KH ngay khi nhận cuộc gọi, kéo dữ liệu từ CRM.",
  },
  {
    icon: MousePointerClick,
    label: "Click To Call",
    color: "#d97706",
    bg: "#fffbeb",
    desc: "Gọi trực tiếp từ CRM, Helpdesk, ERP chỉ bằng một click chuột.",
  },
  {
    icon: Link2,
    label: "CRM Integration",
    color: "#7c3aed",
    bg: "#f5f0ff",
    desc: "Đồng bộ hai chiều với HubSpot, Salesforce, Zoho CRM và Freshsales.",
  },
  {
    icon: RefreshCw,
    label: "Data Sync",
    color: "#0284c7",
    bg: "#e0f2fe",
    desc: "Đồng bộ liên hệ, lịch sử, ghi âm tự động — không cần copy thủ công.",
  },
];

const ecosystemGroups = [
  {
    category: "CRM",
    color: "#673ab7",
    icon: Users,
    tools: [
      { name: "HubSpot",    abbr: "HS",  color: "#ff7a59" },
      { name: "Salesforce", abbr: "SF",  color: "#00a1e0" },
      { name: "Zoho CRM",   abbr: "ZH",  color: "#e42527" },
      { name: "Freshsales", abbr: "FS",  color: "#0fa958" },
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

function APIManagerMockup() {
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

function CustomerPopupMockup() {
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

function WidgetMockup() {
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
              <span className="text-[9px]" style={{ color: "#5b5f6b" }}>Đang trực · Phản hồi trong 30 giây</span>
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

function IntegrationsSection() {
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
          <div className="relative flex items-center justify-center order-1 lg:order-2" style={{ minHeight: "480px" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: "460px", height: "460px", background: "radial-gradient(circle, rgba(103,58,183,0.07) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
            <div className="relative w-full" style={{ maxWidth: "540px", zIndex: 2 }}>
              <APIManagerMockup />
            </div>
            {/* Floating integration badges */}
            {[
              { name: "HubSpot", abbr: "HS", color: "#ff7a59", pos: { top: "8px", left: "-28px" } },
              { name: "Zendesk", abbr: "ZD", color: "#03363d", pos: { top: "8px", right: "-20px" } },
              { name: "Salesforce", abbr: "SF", color: "#00a1e0", pos: { bottom: "60px", left: "-20px" } },
              { name: "Webhook", abbr: "WH", color: "#0891b2", pos: { bottom: "12px", right: "-12px" } },
            ].map((b, i) => (
              <div key={i} className="absolute flex items-center gap-2 px-3 py-2 rounded-xl" style={{ ...b.pos, background: "#fff", boxShadow: "0 6px 20px rgba(103,58,183,0.12)", border: "1px solid rgba(103,58,183,0.10)", zIndex: 10, fontFamily: "'Inter',sans-serif" }}>
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
              <Bell size={11} color="#673ab7" /> Customer Popup
            </div>
            <h3 className="font-extrabold" style={{ fontSize: "clamp(20px, 2.4vw, 30px)", color: "#1e2026", lineHeight: 1.2 }}>
              Nhận diện khách hàng{" "}
              <span style={{ color: "#673ab7" }}>ngay khi cuộc gọi đến</span>
            </h3>
            <p style={{ color: "#5b5f6b", fontSize: "15px", lineHeight: 1.7 }}>
              Gcalls tự động kéo thông tin từ CRM và hiển thị popup ngay lập tức khi có cuộc gọi đến — nhân viên biết ngay đang nói chuyện với ai.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                "Biết khách hàng là ai trước khi bắt máy",
                "Xem lịch sử chăm sóc và ghi chú ngay lập tức",
                "Không cần hỏi lại thông tin đã có",
                "Tăng trải nghiệm và sự hài lòng của khách hàng",
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
              Nhúng nút gọi ngay vào website chỉ với vài dòng code. Khách hàng nhập số điện thoại và được kết nối với nhân viên trong vòng 30 giây.
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
                <span className="text-xs font-semibold" style={{ color: "#16a34a" }}>Kết nối trong 30s</span>
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
            <p className="text-sm" style={{ color: "#5b5f6b" }}>Kết nối sẵn sàng với các nền tảng phổ biến nhất tại Việt Nam và toàn cầu</p>
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
              Tích hợp sẵn sàng · Không cần dev
            </div>
            <h3 className="font-extrabold text-white mb-4" style={{ fontSize: "clamp(22px, 3vw, 36px)", lineHeight: 1.15 }}>
              Kết nối Gcalls với hệ thống doanh nghiệp của bạn
            </h3>
            <p className="mb-8" style={{ color: "rgba(255,255,255,0.72)", fontSize: "16px", lineHeight: 1.7 }}>
              Từ CRM, Helpdesk đến các hệ thống nội bộ — Gcalls kết nối nhanh chóng qua API mở, không yêu cầu kiến thức kỹ thuật chuyên sâu.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-150"
                style={{ background: "#fff", color: "#673ab7", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.22)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.18)"; }}
              >
                <Phone size={15} /> Đăng ký tư vấn
              </button>
              <button
                className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-150"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.30)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.22)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)"}
              >
                <Code2 size={15} /> Tư vấn tích hợp
              </button>
            </div>
            <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Đăng ký để nhận tư vấn cấu hình phù hợp với nhu cầu</p>
          </div>
        </div>

      </div>
    </section>
  );
}

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

function DialpadMockup() {
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

function SoftphoneMockup() {
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

function UserStatusDashboard() {
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
      <div className="flex gap-1 px-4 pt-3 pb-0" style={{ borderBottom: "1px solid rgba(103,58,183,0.08)", overflowX: "auto" }}>
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

function WorkFromAnywhereSection() {
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

          {/* Right: dialpad + softphone side by side */}
          <div className="relative flex items-center justify-center gap-6" style={{ minHeight: "520px" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: "480px", height: "480px", background: "radial-gradient(circle, rgba(103,58,183,0.08) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
            <div className="relative" style={{ zIndex: 2, transform: "rotate(-2deg) translateY(-12px)" }}>
              <DialpadMockup />
            </div>
            <div className="relative" style={{ zIndex: 3, transform: "rotate(1.5deg) translateY(12px)" }}>
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

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="relative bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <Hero />
      <PainPointsSection />
      <CallTimelineSection />
      <CRMSection />
      <TeamSection />
      <AnalyticsSection />
      <CloudSection />
      <IntegrationsSection />
      <WorkFromAnywhereSection />
    </div>
  );
}
