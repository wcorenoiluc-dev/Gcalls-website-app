import { useState, useEffect } from "react";
import { ROUTES } from '@/config/navigation';
import { ArrowUpRight, BarChart2, Check, ChevronRight, Pause, Phone, PhoneCall, PhoneIncoming, Play, Search, TrendingUp, Users, Voicemail, Wifi } from "lucide-react";
import { Link } from "react-router";
import { leadCtaHref } from "@/lib/leads/ctaLink";
import { stageClass, stageMainClass, stageFloatFullClass, hideBelowLgClass } from "@/components/common/ResponsiveProductVisual";

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

/**
 * Bar height for the recording waveform, in px.
 *
 * Deterministic on purpose. This used to be `… + Math.random() * 6`, evaluated
 * inside the map during render — and `FloatingTimeline` re-renders every 80ms
 * while playback runs, so all 52 bars were re-randomised on every tick and the
 * waveform visibly boiled instead of scrubbing. The third term below keeps the
 * same irregular texture the random value gave, as a pure function of the bar
 * index, so a bar's height depends only on where it sits in the clip.
 */
function waveformHeight(index: number): number {
  const jitter = Math.abs(Math.sin(index * 12.9898) * 43758.5453) % 1;
  return Math.max(4, 10 + Math.sin(index * 0.7) * 6 + Math.sin(index * 1.3) * 8 + jitter * 6);
}


// ── Dashboard UI mockup ──────────────────────────────────────────────────────

export function DashboardMain() {
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

      {/* Incoming-call strip — the moment the rest of the hero visual explains. */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ background: "#f6fdf8", borderBottom: "1px solid rgba(34,197,94,0.18)" }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#dcfce7" }}
        >
          <PhoneIncoming size={13} color="#16a34a" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold truncate" style={{ color: "#1e2026" }}>
            Cuộc gọi đến · Nguyễn Văn Minh
          </div>
          <div className="text-[10px]" style={{ color: "#5b5f6b" }}>
            0901 234 567 · Hotline 1900 1234
          </div>
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
          style={{ background: "#dcfce7", color: "#16a34a" }}
        >
          Đang đổ chuông
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" aria-hidden="true" />
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
                    type="button"
                    aria-label={`${playingId === call.id ? "Tạm dừng" : "Nghe"} ghi âm cuộc gọi với ${call.name}`}
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
                    style={{ background: playingId === call.id ? "#673ab7" : "#f0ecf9" }}
                    onClick={() => setPlayingId(playingId === call.id ? null : call.id)}
                  >
                    {playingId === call.id
                      ? <Pause size={8} color="#fff" aria-hidden="true" />
                      : <Play size={8} color="#673ab7" aria-hidden="true" />}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Agent sidebar.
            Hidden below `md`: this dashboard is drawn at 540px, and at 390px
            the two-column split squeezed the call log until phone numbers
            wrapped onto three lines. Cropping to the primary column is the
            mobile focus treatment — the call log is the point of the visual. */}
        <div className="w-44 flex-shrink-0 max-md:hidden!" style={{ borderLeft: "1px solid rgba(103,58,183,0.08)" }}>
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

      {/*
        ILLUSTRATIVE-DATA LABEL.

        Every name, phone number, call count and rate inside this frame is
        invented. Without this line the frame reads as a screenshot of a real
        Gcalls tenant, which is exactly the class of implied customer proof the
        hero's removed rating row was deleted for. Keep it whenever the mockup
        is rendered at page scale.
      */}
      <div
        className="px-4 py-2 text-[10px] text-center"
        style={{ background: "#fbfaff", borderTop: "1px solid rgba(103,58,183,0.08)", color: "#8b8f9a" }}
      >
        Giao diện và số liệu minh họa — không phải dữ liệu vận hành của một doanh nghiệp cụ thể.
      </div>
    </div>
  );
}

/**
 * Incoming-call customer popup.
 *
 * Added for the hero composition, which has to show the identification moment
 * (call arrives → who is calling → what was discussed last time). The wording
 * is the approved conditional register used everywhere else on the site: the
 * information comes from a CONNECTED system, within the configured integration
 * scope. It is not "Gcalls tự động kéo dữ liệu và hiển thị popup ngay lập tức"
 * — that phrasing failed the popup gate at INT-02…05.
 */
export function FloatingCustomerPopup() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        boxShadow: "0 8px 32px rgba(103,58,183,0.14), 0 1px 4px rgba(0,0,0,0.05)",
        border: "1px solid rgba(103,58,183,0.10)",
        width: "230px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        className="flex items-center gap-2 px-3.5 py-2.5"
        style={{ background: "#16a34a" }}
      >
        <PhoneIncoming size={12} color="#fff" aria-hidden="true" />
        <span className="text-[11px] font-semibold text-white">Cuộc gọi đến</span>
        <span className="ml-auto text-[9px]" style={{ color: "rgba(255,255,255,0.8)" }}>1900 1234</span>
      </div>

      <div className="p-3.5">
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: "#ede8f9", color: "#673ab7" }}
          >
            BM
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold truncate" style={{ color: "#1e2026" }}>Nguyễn Văn Minh</div>
            <div className="text-[10px] truncate" style={{ color: "#5b5f6b" }}>Công ty TNHH Bình Minh</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {["Demo", "Ưu tiên cao"].map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: "#f0ecf9", color: "#673ab7" }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-2.5" style={{ borderTop: "1px solid rgba(103,58,183,0.08)" }}>
          <div className="text-[9px] font-bold uppercase tracking-wide mb-1" style={{ color: "#9ca3af" }}>
            Lịch sử gần nhất
          </div>
          <div className="text-[10px] leading-snug" style={{ color: "#5b5f6b" }}>
            Gọi đi 09:14 · “KH quan tâm gói Business, hẹn demo thứ 5”
          </div>
        </div>

        <div className="mt-3 flex gap-1.5">
          <span
            className="flex-1 text-center text-[9px] font-semibold py-1.5 rounded-lg"
            style={{ background: "#f6f3fc", color: "#673ab7" }}
          >
            Ghi chú
          </span>
          <span
            className="flex-1 text-center text-[9px] font-semibold py-1.5 rounded-lg"
            style={{ background: "#f6f3fc", color: "#673ab7" }}
          >
            Gắn tag
          </span>
          <span
            className="flex-1 text-center text-[9px] font-semibold py-1.5 rounded-lg"
            style={{ background: "#f6f3fc", color: "#673ab7" }}
          >
            Hồ sơ
          </span>
        </div>
      </div>
    </div>
  );
}

export function FloatingTimeline() {
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
          const h = waveformHeight(i);
          const pct = (i / 52) * 100;
          return (
            <div
              key={i}
              className="rounded-full flex-1 transition-colors duration-150"
              style={{
                height: `${h}px`,
                background: pct <= progress ? "#673ab7" : "#e5e0f5",
              }}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={playing ? "Tạm dừng ghi âm minh họa" : "Phát ghi âm minh họa"}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
          style={{ background: "#673ab7" }}
          onClick={() => setPlaying(!playing)}
        >
          {playing
            ? <Pause size={10} color="#fff" aria-hidden="true" />
            : <Play size={10} color="#fff" aria-hidden="true" />}
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

export function FloatingCRM() {
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

export function FloatingAnalytics() {
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

export function FloatingDialpad() {
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
            type="button"
            aria-label={`Nhập phím ${k}`}
            className="h-8 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
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
        type="button"
        className="w-full h-9 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
        style={{ background: "#22c55e", color: "#fff" }}
      >
        <Phone size={13} aria-hidden="true" />
        Gọi ngay
      </button>
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────

/**
 * The four approved hero benefits — wording is fixed by the content checkpoint.
 *
 * Note what is NOT here: the source spreadsheet's hero copy carried "thiết lập
 * ngay trong 5 phút", "hơn 30 phần mềm quản trị" and "tối ưu 40% chi phí vận
 * hành", plus a "4.9 / 1.000+ doanh nghiệp" social-proof row. All four are on
 * the withheld list and none of them may be reinstated without an approved
 * evidence record.
 */
const highlights = [
  "Gọi trực tiếp trên trình duyệt",
  "Lưu lịch sử và ghi âm cuộc gọi",
  "Quản lý danh bạ khách hàng",
  "Theo dõi KPI realtime",
];

export function Hero() {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="min-h-screen flex items-center pt-16 pb-20 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f9f7fe 40%, #f0eaf9 100%)",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      {/* Decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
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
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#673ab7" }} aria-hidden="true" />
                GCALLS WEBPHONE
              </div>
            </div>

            {/* Headline — the page's only H1. */}
            <div>
              <h1
                id="home-hero-heading"
                className="font-extrabold leading-tight tracking-tight mb-5"
                style={{
                  fontSize: "clamp(32px, 4.5vw, 54px)",
                  color: "#1e2026",
                  lineHeight: 1.12,
                }}
              >
                Tổng Đài Ảo Tích Hợp CRM -{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Bứt Phá Doanh Số
                </span>{" "}
                Cho Đội Sales &amp; CSKH
              </h1>

              <p className="text-base leading-relaxed" style={{ color: "#5b5f6b", maxWidth: "560px", fontSize: "17px" }}>
                Giải pháp tổng đài thông minh giúp đội Sales và CSKH thực hiện cuộc gọi trên trình
                duyệt, lưu lịch sử và ghi âm, quản lý thông tin khách hàng, theo dõi hiệu suất và
                kết nối với hệ thống quản trị doanh nghiệp.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link to={leadCtaHref({ intent: 'demo', source: 'consultation', product: 'Gcalls Plus Webphone' })}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
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
                <Phone size={16} aria-hidden="true" />
                Đăng ký demo
              </Link>
              <Link
                to={ROUTES.gcallsPlus}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
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
                Khám phá Gcalls Webphone
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>

            {/* Quick highlights */}
            <div className="flex flex-col gap-2.5 pt-1">
              {highlights.map((h) => (
                <div key={h} className="flex items-center gap-2.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(103,58,183,0.12)" }}
                    aria-hidden="true"
                  >
                    <Check size={11} color="#673ab7" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#5b5f6b" }}>{h}</span>
                </div>
              ))}
            </div>

            {/*
              WHAT USED TO BE HERE, AND WHY IT IS GONE — Checkpoint WEB-SITE-QA-001.

              A five-star row reading "4.9" beside four avatar initials
              ("VP", "BM", "SV", "TH") under the caption "Được tin dùng bởi các
              doanh nghiệp Việt Nam". Every part of it was fabricated: this
              repository holds no rating, no review, no customer count and no
              permission record for any customer name, and the four initials
              matched the invented companies in the mock contact list further
              down the page.

              It was also the single most visible contradiction on the site.
              `/cong-ty/khach-hang/` deliberately publishes no customer name for
              exactly this reason, and `src/data/company/types.ts` makes the
              permission gate a type error — while the homepage hero showed a
              rating and a logo wall in miniature.

              Do not restore any of it without an approved evidence record. A
              real rating needs a source; real customer marks need
              `ApprovedLogo` in `src/data/company/types.ts`, which requires a
              legal name, an asset path and a permission reference.
            */}
            <div className="pt-2" style={{ borderTop: "1px solid rgba(103,58,183,0.10)" }}>
              <div className="text-xs" style={{ color: "#5b5f6b" }}>
                Phạm vi triển khai và cấu hình được xác nhận cùng đội ngũ Gcalls theo hệ
                thống thực tế của doanh nghiệp.
              </div>
              {/*
                The illustrative-data label is repeated here, in flowing text,
                because the one inside the dashboard frame is partially covered
                by the overlapping float cards at desktop widths. A claim-safety
                label that a layered composition can hide is not a label.
              */}
              <div className="text-xs mt-1.5" style={{ color: "#8b8f9a" }}>
                Hình ảnh giao diện và toàn bộ số liệu trong ảnh là minh họa, không phải kết quả
                vận hành của một doanh nghiệp cụ thể.
              </div>
            </div>
          </div>

          {/* ── Right column — Layered UI ────────────────────────── */}
          {/*
            Desktop keeps the original overlapping composition exactly.
            Below `lg` the stage reflows: the dashboard goes full width and
            only the call-timeline card is kept beneath it. The other three
            floats are desktop-only — at 390px they overlapped each other and
            clipped their own internals.
          */}
          <div
            className={`${stageClass} flex items-center justify-center`}
            style={{ minHeight: "560px" }}
          >
            {/* Main dashboard */}
            <div className={stageMainClass} style={{ maxWidth: "540px" }}>
              <DashboardMain />
            </div>

            {/* Timeline/audio — top-right. The one supporting visual kept below lg. */}
            <div
              className={stageFloatFullClass}
              style={{ top: "-30px", right: "-40px", zIndex: 10, transform: "rotate(1.5deg)" }}
            >
              <FloatingTimeline />
            </div>

            {/* Analytics — bottom-left */}
            <div
              className={`${stageFloatFullClass} ${hideBelowLgClass}`}
              style={{ bottom: "-20px", left: "-32px", zIndex: 10, transform: "rotate(-1.5deg)" }}
            >
              <FloatingAnalytics />
            </div>

            {/* Customer popup — mid-left.
                Replaces the contact-list card that was here: the hero has to
                show the identification moment (call arrives → who is calling),
                and a static directory does not. `FloatingCRM` is still exported
                for the product pages that compose a contact list. */}
            <div
              className={`${stageFloatFullClass} ${hideBelowLgClass}`}
              style={{ top: "50%", left: "-44px", zIndex: 9, transform: "translateY(-50%) rotate(-1deg)" }}
            >
              <FloatingCustomerPopup />
            </div>

            {/* Dialpad — bottom-right */}
            <div
              className={`${stageFloatFullClass} ${hideBelowLgClass}`}
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
