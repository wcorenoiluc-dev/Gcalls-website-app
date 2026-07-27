import { useState, useEffect, useRef } from "react";
import { ArrowRight, Check, Clock, Download, FileText, Mic, Pause, PhoneCall, PhoneIncoming, PhoneMissed, PhoneOutgoing, Play, Search, SlidersHorizontal, Star, Tag, Voicemail, Volume2 } from "lucide-react";
import { stageClass, stageMainClass, stageFloatClass } from "@/components/common/ResponsiveProductVisual";

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

export function CallTimelineSection() {
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
          <div className={`${stageClass} flex items-center justify-center order-1 lg:order-2`} style={{ minHeight: "520px" }}>
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
            <div className={stageMainClass} style={{ maxWidth: "560px", zIndex: 2 }}>
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
                  className={`${stageFloatClass} flex items-center gap-2.5 px-4 py-3 rounded-2xl`}
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
