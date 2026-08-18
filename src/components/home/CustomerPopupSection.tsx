import { Bell, Check, PhoneIncoming } from "lucide-react";
import { CustomerPopupMockup } from "./IntegrationsSection";

// ─── Section 9: Customer Popup ───────────────────────────────────────────────

/**
 * Promoted out of the old integrations monolith, where it was "Block 3".
 *
 * ---------------------------------------------------------------------------
 * THE CLAIM HERE IS CONTEXT, NOT AN AUTOMATIC POPUP
 * ---------------------------------------------------------------------------
 * The source content says Gcalls "kéo thông tin từ CRM và hiển thị popup khi
 * có cuộc gọi đến". The automatic-popup gate resolved CONTEXT ONLY across
 * INT-02…05, and the Salesforce page title had to be corrected at INT-03 for
 * publishing exactly that sentence. So the body copy describes what the agent
 * SEES, sourced from a connected system, within the integration scope
 * configured for that business. Do not restore the guaranteed-popup wording.
 * ---------------------------------------------------------------------------
 */

const benefits = [
  "Biết khách hàng là ai trước khi bắt máy",
  "Xem lịch sử chăm sóc và ghi chú đã lưu",
  "Không cần hỏi lại thông tin đã có",
  "Giữ ngữ cảnh trao đổi giữa các lần liên hệ",
];

export function CustomerPopupSection() {
  return (
    <section
      aria-labelledby="home-customer-popup-heading"
      className="py-24 overflow-hidden"
      style={{ background: "#fff", fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center rounded-3xl px-6 sm:px-8 py-12 sm:py-14"
          style={{ background: "#f6f3fc", border: "1px solid rgba(103,58,183,0.08)" }}
        >
          {/* Left copy */}
          <div className="flex flex-col gap-6">
            <div
              className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ background: "rgba(103,58,183,0.10)", color: "#673ab7", letterSpacing: "0.08em" }}
            >
              <Bell size={11} color="#673ab7" aria-hidden="true" />
              Customer Popup
            </div>

            <h2
              id="home-customer-popup-heading"
              className="font-extrabold tracking-tight"
              style={{ fontSize: "clamp(26px, 3.2vw, 42px)", color: "#1e2026", lineHeight: 1.14 }}
            >
              Nhận diện khách hàng{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #673ab7 0%, #9c63d6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ngay khi cuộc gọi đến
              </span>
            </h2>

            <p style={{ color: "#5b5f6b", fontSize: "16px", lineHeight: 1.7, maxWidth: "500px" }}>
              Khi có cuộc gọi đến, nhân viên xem được thông tin khách hàng lấy từ hệ thống
              đã kết nối — trong phạm vi tích hợp được cấu hình cho doanh nghiệp.
            </p>

            <ul className="flex flex-col gap-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(103,58,183,0.12)" }}
                    aria-hidden="true"
                  >
                    <Check size={11} color="#673ab7" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: "#5b5f6b" }}>{b}</span>
                </li>
              ))}
            </ul>

            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl self-start"
              style={{ background: "#fff", border: "1px solid rgba(103,58,183,0.12)" }}
            >
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(22,163,74,0.12)" }}
                aria-hidden="true"
              >
                <PhoneIncoming size={13} color="#16a34a" strokeWidth={2} />
              </span>
              <span className="text-xs font-semibold" style={{ color: "#1e2026" }}>
                Thông tin hiển thị theo dữ liệu có trong hệ thống đã kết nối
              </span>
            </div>
          </div>

          {/* Right: popup mockup */}
          <div className="flex items-center justify-center min-w-0">
            <CustomerPopupMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
