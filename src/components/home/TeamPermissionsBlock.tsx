import { BarChart2, Check, PhoneCall, ShieldCheck, UserCheck, Users } from "lucide-react";

/**
 * The role-and-permission argument, folded into §12 "Làm việc mọi nơi".
 *
 * ---------------------------------------------------------------------------
 * WHAT WAS FOLDED IN, AND WHAT WAS DELIBERATELY LEFT BEHIND
 * ---------------------------------------------------------------------------
 * `TeamSection` never rendered — it had no route and no importer. Its argument
 * belongs on the page, next to "your team can work from anywhere": who may do
 * what, once they are working from anywhere. That argument is what moved here.
 *
 * Its ROSTER did not move, on the owner's decision, and must not be restored:
 *
 *  · `teamMembers` — six invented people carrying addresses on `@gcalls.vn`,
 *    a domain with no evidence record in this repository. The verified company
 *    domain is gcalls.co. Six names with roles, groups and per-person call
 *    counts render as a real company's staff directory, and the address pattern
 *    would disclose a mail convention even if the people are invented.
 *  · `TeamMgmtMockup` — the tabbed UI whose only purpose is to display that
 *    roster. §12 already shows per-agent presence through `remoteStatuses`, so
 *    the roster was also the duplicated half.
 *  · The `count: "—" / 4 / 38` headcounts on each role. "38" is a headcount claim
 *    about Gcalls that nothing in this repository evidences. The roles are kept;
 *    the numbers attached to them are not.
 *
 * `TeamSection.tsx` is left intact and unimported — nothing was deleted, and it
 * remains available if the owner later approves a labelled roster.
 * ---------------------------------------------------------------------------
 */

/** Roles and their permissions. Headcounts deliberately absent — see above. */
const rolePermissions = [
  {
    role: "Admin",
    color: "#673ab7",
    bg: "#f5f0fd",
    perms: ["Quản lý toàn bộ hệ thống", "Thêm / xóa người dùng", "Xem tất cả cuộc gọi", "Xuất báo cáo", "Cấu hình hotline & SIP"],
  },
  {
    role: "Manager",
    color: "#0891b2",
    bg: "#f0f9ff",
    perms: ["Xem báo cáo đội ngũ", "Nghe lại ghi âm", "Phân công khách hàng", "Quản lý nhóm của mình"],
  },
  {
    role: "Sales / CSKH",
    color: "#16a34a",
    bg: "#f0fdf4",
    perms: ["Gọi & nhận cuộc gọi", "Xem KH được phân công", "Ghi chú & gắn tag", "Xem lịch sử của mình"],
  },
];

const workflowSteps = [
  { n: "01", title: "Tạo tài khoản nhân viên",  desc: "Thêm thành viên vào hệ thống, gán hotline và nhóm làm việc",               icon: UserCheck,   color: "#673ab7" },
  { n: "02", title: "Phân quyền theo vai trò",  desc: "Thiết lập quyền truy cập phù hợp cho từng vai trò trong tổ chức",          icon: ShieldCheck, color: "#7c3aed" },
  { n: "03", title: "Giao khách hàng & hotline", desc: "Phân công danh sách khách hàng và đường dây riêng cho từng nhân viên",    icon: Users,       color: "#0891b2" },
  { n: "04", title: "Theo dõi cuộc gọi",        desc: "Giám sát realtime: ai đang gọi, ai nhỡ máy, chất lượng từng cuộc gọi",     icon: PhoneCall,   color: "#16a34a" },
  { n: "05", title: "Đánh giá KPI",             desc: "Tổng hợp hiệu suất gọi, tỷ lệ chốt deal và điểm chất lượng từng nhân viên", icon: BarChart2,  color: "#d97706" },
];

export function TeamPermissionsBlock() {
  return (
    <div className="mt-16">
      {/* Roles and what each may do. */}
      <div className="rounded-3xl px-6 sm:px-8 py-12 mb-12" style={{ background: "#f6f3fc", border: "1px solid rgba(103,58,183,0.10)" }}>
        <div className="text-center mb-10">
          <h3 className="font-extrabold mb-4" style={{ fontSize: "clamp(20px, 2.4vw, 30px)", color: "#1e2026", lineHeight: 1.2 }}>
            Mỗi nhân viên chỉ thấy đúng{" "}
            <span style={{ color: "#673ab7" }}>những gì họ cần</span>
          </h3>
          <p className="text-base leading-relaxed mx-auto" style={{ color: "#5b5f6b", maxWidth: "560px" }}>
            Doanh nghiệp có thể thiết lập quyền truy cập cho từng bộ phận, từng nhóm hoặc từng nhân viên nhằm bảo vệ dữ liệu khách hàng và chuẩn hóa quy trình làm việc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rolePermissions.map((r) => (
            <div key={r.role} className="rounded-2xl p-6 bg-white" style={{ border: `1px solid ${r.color}22` }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: r.bg }}>
                <ShieldCheck size={13} color={r.color} strokeWidth={2.2} aria-hidden="true" />
                <span className="text-xs font-bold" style={{ color: r.color }}>{r.role}</span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {r.perms.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check size={13} color={r.color} strokeWidth={2.6} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span className="text-[13px] leading-snug" style={{ color: "#5b5f6b" }}>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* How a team gets from an empty account to measured work. */}
      <div>
        <div className="text-center mb-10">
          <h3 className="font-extrabold mb-3" style={{ fontSize: "clamp(18px, 2.2vw, 28px)", color: "#1e2026", lineHeight: 1.2 }}>
            Từ nhân viên đến quản lý,{" "}
            <span style={{ color: "#673ab7" }}>mọi hoạt động đều được ghi nhận</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {workflowSteps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="rounded-2xl p-5 bg-white" style={{ border: `1px solid ${s.color}20` }}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + "16" }}>
                    <Icon size={15} color={s.color} strokeWidth={2} aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold tabular-nums" style={{ color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.n}</span>
                </div>
                <div className="text-sm font-bold mb-1.5" style={{ color: "#1e2026" }}>{s.title}</div>
                <div className="text-[12px] leading-snug" style={{ color: "#5b5f6b" }}>{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
