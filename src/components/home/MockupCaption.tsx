/**
 * The illustration label carried by every drawn mockup on the homepage.
 *
 * The homepage renders no operational data. Its mockups are constructed, and
 * several of them — a call log, a customer record, an agent league table, a SIP
 * account list — are the exact shapes a visitor would expect to hold real
 * numbers about real people. Unlabelled, they read as a live tenant.
 *
 * This is the label `HeroSection` already used, lifted into one component so the
 * wording is identical everywhere instead of drifting per section, and so a gate
 * can count the labels against the mockups.
 *
 * Render it as the LAST child of the mockup frame, so it reads as a caption on
 * the frame rather than as page copy.
 *
 * `w-full basis-full` matters: CRMMockup's frame is a flex ROW (sidebar +
 * detail), so without a full basis the caption becomes a third column and is
 * pushed outside the frame at narrow widths. The frame carries `flex-wrap` so
 * this lands on its own line.
 */
export function MockupCaption({ text }: { text?: string }) {
  return (
    <div
      data-mockup-caption
      className="w-full basis-full px-4 py-2 text-[10px] text-center"
      style={{
        background: "#fbfaff",
        borderTop: "1px solid rgba(103,58,183,0.08)",
        color: "#8b8f9a",
      }}
    >
      {text ?? "Giao diện và số liệu minh họa — không phải dữ liệu vận hành của một doanh nghiệp cụ thể."}
    </div>
  );
}
