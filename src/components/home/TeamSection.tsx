import { useState } from "react";
import { Activity, BarChart2, Briefcase, Building2, Check, ChevronRight, Filter, MoreHorizontal, PhoneCall, Plus, Search, Settings, ShieldCheck, UserCheck, Users } from "lucide-react";
import { stageClass, stageMainClass, stageFloatClass } from "@/components/common/ResponsiveProductVisual";

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

/**
 * Capability labels, NOT metrics — Checkpoint WEB-SITE-QA-001.
 *
 * These pills render twice: in the page copy column and as floating cards
 * beside the mockup. They are therefore PAGE-LEVEL STATEMENTS, not sample data
 * inside an illustrated UI, and they are read as claims.
 *
 * They previously said "50+ / Nhân sự được quản lý" and "100% / Dữ liệu tập
 * trung". Neither is evidenced anywhere in this repository: "50+" reads as a
 * customer-scale figure, and a bare "100%" is precisely the absolute the claim
 * guards forbid ("100% cuộc gọi" in `src/data/resources/types.ts`).
 *
 * Both are now capability labels, which is what the surrounding section
 * actually demonstrates. Do not put a number back without an approved source.
 */
const teamStats = [
  { value: "Đa phòng ban", label: "Quản lý theo nhóm và phòng ban", icon: Users, color: "#673ab7" },
  { value: "RBAC", label: "Role Based Permission", icon: ShieldCheck, color: "#0891b2" },
  { value: "Tập trung", label: "Dữ liệu trên một nền tảng", icon: Activity, color: "#16a34a" },
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

export function TeamSection() {
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
          <div className={`${stageClass} flex items-center justify-center`} style={{ minHeight: "500px" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: "480px", height: "480px", background: "radial-gradient(circle, rgba(103,58,183,0.08) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
            <div className={stageMainClass} style={{ maxWidth: "560px", zIndex: 2 }}>
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
                <div key={i} className={`${stageFloatClass} flex items-center gap-2.5 px-4 py-3 rounded-2xl`} style={{ ...s.pos, background: "#fff", boxShadow: "0 8px 28px rgba(103,58,183,0.13), 0 1px 4px rgba(0,0,0,0.04)", border: "1px solid rgba(103,58,183,0.10)", zIndex: 10, fontFamily: "'Inter', sans-serif", minWidth: "172px" }}>
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
