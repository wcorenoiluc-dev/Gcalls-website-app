import { useState } from "react";
import { Activity, Briefcase, Building2, Check, ExternalLink, FileText, Filter, HeadphonesIcon, Mail, MoreHorizontal, Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, Plug, Plus, Search, ShieldCheck, Tag, Users } from "lucide-react";
import { stageClass, stageMainClass, stageFloatClass } from "@/components/common/ResponsiveProductVisual";

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
      <div className="w-52 flex-shrink-0 flex flex-col max-md:w-full!" style={{ borderRight: "1px solid rgba(103,58,183,0.09)" }}>
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
      {/* Contact detail panel. Hidden below md: this mockup is drawn at
          580px, and at 390px the two-column split squeezed both columns
          until names wrapped onto three lines. The contact list is the
          point of the visual, so it keeps the full width. */}
      <div className="flex-1 flex flex-col overflow-hidden max-md:hidden!">
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

export function CRMSection() {
  return (
    <section
      className="py-28 overflow-hidden"
      style={{ background: "#ffffff", fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* ── Right: mockup first visually on desktop ── */}
          <div className={`${stageClass} flex items-center justify-center order-1`} style={{ minHeight: "520px" }}>
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

            <div className={stageMainClass} style={{ maxWidth: "580px", zIndex: 2 }}>
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
                  className={`${stageFloatClass} flex items-center gap-2.5 px-4 py-3 rounded-2xl`}
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
