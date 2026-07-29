import { useState } from "react";
import { ROUTES } from '@/config/navigation';
import { Link } from "react-router";
import { ArrowRight, Check, ClipboardList, MapPin, Phone, PieChart, Plug, UserX } from "lucide-react";

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

export function PainPointsSection() {
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
              <Link
                to={ROUTES.gcallsPlus}
                className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-[15px] transition-all duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
              </Link>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Không cần cài đặt phần mềm · Chạy trực tiếp trên trình duyệt</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
