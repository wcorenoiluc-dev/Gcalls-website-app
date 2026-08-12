import { useState } from "react";
import { BarChart3, Globe2, Keyboard, PhoneOff, ShieldAlert, UserX } from "lucide-react";
import { LossEstimator } from "./LossEstimator";

// ─── Section 2: Pain Points + operational-loss estimator ─────────────────────

/**
 * The six approved pain points.
 *
 * ---------------------------------------------------------------------------
 * WORDING IS FIXED — DO NOT "IMPROVE" IT
 * ---------------------------------------------------------------------------
 * These six lines come verbatim from the approved homepage content. The source
 * spreadsheet's own commentary around them carries figures that are NOT
 * publishable (ROI percentages from the ICP deck, a "40% chi phí vận hành"
 * saving, "hơn 30 phần mềm tích hợp"), so the copy here deliberately describes
 * the SITUATION and never quantifies its cost. The only numbers on this section
 * are the ones a visitor types into the estimator below.
 * ---------------------------------------------------------------------------
 */
const painPoints = [
  {
    icon: PhoneOff,
    title: "Gián đoạn hoạt động telesales khi số gọi ra bị khóa hoặc bị người nhận báo cáo spam",
    desc: "Chiến dịch gọi ra đang chạy có thể dừng giữa chừng, đội ngũ phải chờ xử lý đầu số trước khi tiếp tục liên hệ khách hàng.",
    accent: "#673ab7",
    bg: "#f5f0fd",
  },
  {
    icon: UserX,
    title: "Khách hàng e ngại và từ chối cuộc gọi đến từ số lạ",
    desc: "Khi cuộc gọi không mang dấu hiệu nhận diện, người nhận khó biết ai đang gọi và thường bỏ qua trước khi nghe nội dung tư vấn.",
    accent: "#7c3aed",
    bg: "#f3f0fe",
  },
  {
    icon: ShieldAlert,
    title: "Quản lý khó kiểm soát chất lượng tư vấn thực tế",
    desc: "Nếu không có ghi âm, ghi chú và tiêu chí đánh giá tập trung, quản lý chỉ nắm được một phần nội dung trao đổi giữa nhân viên và khách hàng.",
    accent: "#5b21b6",
    bg: "#f0ebfd",
  },
  {
    icon: BarChart3,
    title: "Thiếu dữ liệu thời gian thực để đánh giá hiệu suất đội ngũ",
    desc: "Báo cáo tổng hợp thủ công thường đến sau khi vấn đề đã xảy ra, khiến quản lý khó điều phối nguồn lực trong ngày.",
    accent: "#673ab7",
    bg: "#f5f0fd",
  },
  {
    icon: Globe2,
    title: "Chi phí cao và tỷ lệ bắt máy thấp khi liên hệ thị trường quốc tế",
    desc: "Gọi ra thị trường nước ngoài bằng đầu số không phù hợp làm tăng chi phí liên lạc và giảm khả năng khách hàng nhận máy.",
    accent: "#7c3aed",
    bg: "#f3f0fe",
  },
  {
    icon: Keyboard,
    title: "Nhân viên mất thời gian nhập liệu và đối chiếu thông tin thủ công",
    desc: "Mỗi cuộc gọi kéo theo thao tác sao chép, nhập lại và kiểm tra chéo giữa các hệ thống, làm chậm quy trình và dễ phát sinh sai sót.",
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
        <Icon size={22} color={hovered ? "#fff" : item.accent} strokeWidth={1.8} aria-hidden="true" />
      </div>

      {/* Number badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-bold text-[15px] leading-snug" style={{ color: "#1e2026" }}>
          {item.title}
        </h3>
        <span
          className="text-xs font-bold flex-shrink-0 mt-0.5"
          style={{ color: "rgba(103,58,183,0.25)", fontFamily: "'DM Mono', monospace" }}
          aria-hidden="true"
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
        aria-hidden="true"
      />
    </div>
  );
}

export function PainPointsSection() {
  return (
    <section
      aria-labelledby="home-pain-points-heading"
      className="py-24"
      style={{
        background: "#fff",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
            style={{ background: "rgba(103,58,183,0.08)", color: "#673ab7", letterSpacing: "0.08em" }}
          >
            <span>NỖI ĐAU DOANH NGHIỆP</span>
          </div>

          <h2
            id="home-pain-points-heading"
            className="font-extrabold tracking-tight mb-5"
            style={{ fontSize: "clamp(28px, 3.5vw, 44px)", color: "#1e2026", lineHeight: 1.15 }}
          >
            “Khoảng Trống” Vận Hành Khiến Doanh Nghiệp{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Rò Rỉ Khách Hàng Và Thất Thoát Doanh Thu
            </span>
          </h2>

          <p className="text-base leading-relaxed" style={{ color: "#5b5f6b", fontSize: "17px" }}>
            Đội Sales và CSKH có thể mất nhiều thời gian và dữ liệu khi hệ thống nghe gọi,
            quản lý khách hàng và báo cáo vận hành hoạt động rời rạc.
          </p>
        </div>

        {/* Grid 3×2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {painPoints.map((item, i) => (
            <PainCard key={item.title} item={item} index={i} />
          ))}
        </div>

        {/*
          The estimator sits inside this section by design: it quantifies the
          six problems above using the visitor's own numbers, and its disclaimer
          is only honest while it stays next to the problem statement rather
          than being promoted into a standalone "savings" block.
        */}
        <LossEstimator />

      </div>
    </section>
  );
}
