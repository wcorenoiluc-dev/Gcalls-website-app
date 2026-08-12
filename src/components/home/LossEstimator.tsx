import { useMemo, useState } from "react";
import { Link } from "react-router";
import { AlertTriangle, ArrowRight, Calculator, Clock, RotateCcw } from "lucide-react";
import { leadCtaHref } from "@/lib/leads/ctaLink";
import {
  DEFAULT_LOSS_INPUT,
  LOSS_DISCLAIMER,
  LOSS_FIELDS,
  calculateLoss,
  clampField,
  formatNumber,
  formatVnd,
  roundHalfUpToStep,
  type LossEstimateInput,
  type LossFieldKey,
} from "./lossEstimate";

/**
 * "Ước tính tổn thất vận hành" — homepage only.
 *
 * Sits directly under the six pain points so the section moves from a
 * qualitative problem to a quantified one the visitor scoped themselves.
 *
 * Two deliberate choices:
 *
 *  1. Every field is BOTH a slider and a number box, bound to the same state.
 *     The slider is the fast path at 390px; the number box is the only way to
 *     enter a salary that is not on a 500,000 VND step. Out-of-range and
 *     mid-edit values are clamped by `clampField`, so the headline figure can
 *     never come from a stray keystroke.
 *  2. The result is recomputed synchronously on every change — there is no
 *     "Tính toán" button, and therefore no state in which the numbers shown
 *     disagree with the inputs shown.
 */

interface FieldConfig {
  key: LossFieldKey;
  label: string;
  hint: string;
  /** Rendered after the number box, e.g. "người" or "VNĐ". */
  unit: string;
  /** Formats the value shown beside the slider. */
  display: (value: number) => string;
}

const FIELDS: FieldConfig[] = [
  {
    key: "employees",
    label: "Số nhân viên",
    hint: "Nhân sự Sales, Telesales hoặc CSKH tham gia nghe gọi.",
    unit: "người",
    display: (v) => `${formatNumber(v)} người`,
  },
  {
    key: "monthlySalary",
    label: "Chi phí nhân sự / tháng / người",
    hint: "Tổng chi phí doanh nghiệp trả cho một nhân sự mỗi tháng.",
    unit: "VNĐ",
    display: (v) => formatVnd(v),
  },
  {
    key: "wastedMinutesPerDay",
    label: "Thời gian thao tác thủ công",
    hint: "Nhập liệu, đối chiếu, tổng hợp báo cáo — mỗi người mỗi ngày.",
    unit: "phút/ngày",
    display: (v) => `${formatNumber(v)} phút/ngày`,
  },
  {
    key: "errorRatePercent",
    label: "Tỷ lệ lỗi và làm lại",
    hint: "Phần công việc phải xử lý lại do sai sót dữ liệu.",
    unit: "%",
    display: (v) => `${formatNumber(v)}%`,
  },
  {
    key: "workingDays",
    label: "Số ngày làm việc / tháng",
    hint: "Dùng để quy đổi chi phí theo giờ.",
    unit: "ngày",
    display: (v) => `${formatNumber(v)} ngày`,
  },
  {
    key: "workingHoursPerDay",
    label: "Số giờ làm việc / ngày",
    hint: "Dùng để quy đổi chi phí theo giờ.",
    unit: "giờ",
    display: (v) => `${formatNumber(v)} giờ`,
  },
];

function EstimatorField({
  config,
  value,
  onChange,
}: {
  config: FieldConfig;
  value: number;
  onChange: (next: number) => void;
}) {
  const bounds = LOSS_FIELDS[config.key];
  const sliderId = `loss-${config.key}-slider`;
  const numberId = `loss-${config.key}-number`;
  const hintId = `loss-${config.key}-hint`;

  /**
   * The in-progress text of the number box.
   *
   * `null` means "mirror the committed value"; a string means "the visitor is
   * mid-edit, show exactly what they typed". This is what lets the box sit
   * EMPTY while someone clears it to retype — the committed state behind it is
   * untouched and is only ever a clamped number, so the slider and the result
   * never flicker to a value nobody asked for.
   */
  const [draft, setDraft] = useState<string | null>(null);

  /**
   * Resolve the typed text on blur or Enter.
   *
   * Clamping happens HERE, not on every keystroke: clamping as you type makes
   * "150" impossible to reach in a field whose minimum is 22, because the
   * intermediate "1" snaps up the moment it is typed.
   *
   * An empty or non-numeric box reverts to the value that was already committed
   * — deliberately NOT to the field default. Someone who clears "250" to retype
   * it and then tabs away has not asked to go back to 10; silently resetting
   * their scenario is worse than leaving it as it was.
   */
  const commit = (raw: string) => {
    const cleaned = raw.replace(/[^\d.-]/g, "");
    const parsed = cleaned === "" ? Number.NaN : Number(cleaned);
    onChange(Number.isFinite(parsed) ? clampField(config.key, parsed) : value);
    setDraft(null);
  };

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "#fff", border: "1px solid rgba(103,58,183,0.10)" }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-1">
        <label
          htmlFor={sliderId}
          className="text-[13px] font-bold"
          style={{ color: "#1e2026" }}
        >
          {config.label}
        </label>
        <span
          className="text-[13px] font-extrabold tabular-nums"
          style={{ color: "#673ab7", fontFamily: "'DM Mono', monospace" }}
        >
          {config.display(value)}
        </span>
      </div>

      <p id={hintId} className="text-[11px] leading-snug mb-3" style={{ color: "#8b8f9a" }}>
        {config.hint}
      </p>

      <input
        id={sliderId}
        type="range"
        min={bounds.min}
        max={bounds.max}
        step={bounds.step}
        value={value}
        aria-describedby={hintId}
        onChange={(e) => onChange(clampField(config.key, Number(e.target.value)))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#673ab7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#673ab7]"
        style={{ background: "#e9e3f7" }}
      />

      <div className="flex items-center gap-2 mt-3">
        <input
          id={numberId}
          type="number"
          inputMode="numeric"
          min={bounds.min}
          max={bounds.max}
          step={bounds.step}
          aria-label={`${config.label} — nhập giá trị (${config.unit})`}
          value={draft ?? String(value)}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit((e.target as HTMLInputElement).value);
            }
          }}
          className="w-full min-w-0 rounded-xl px-3 py-2 text-sm font-semibold tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
          style={{
            color: "#1e2026",
            background: "#faf8ff",
            border: "1px solid rgba(103,58,183,0.16)",
            fontFamily: "'DM Mono', monospace",
          }}
        />
        <span className="text-[11px] font-medium flex-shrink-0" style={{ color: "#8b8f9a" }}>
          {config.unit}
        </span>
      </div>
    </div>
  );
}

export function LossEstimator() {
  const [input, setInput] = useState<LossEstimateInput>(DEFAULT_LOSS_INPUT);

  const result = useMemo(() => calculateLoss(input), [input]);

  const setField = (key: LossFieldKey) => (next: number) =>
    setInput((prev) => ({ ...prev, [key]: next }));

  const isDefault = FIELDS.every((f) => input[f.key] === DEFAULT_LOSS_INPUT[f.key]);

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{ background: "#faf8ff", border: "1px solid rgba(103,58,183,0.12)" }}
    >
      {/* Header */}
      <div className="px-6 sm:px-9 pt-9 pb-6 text-center">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5"
          style={{ background: "rgba(103,58,183,0.10)", color: "#673ab7", letterSpacing: "0.08em" }}
        >
          <Calculator size={12} aria-hidden="true" />
          Công cụ ước tính tổn thất
        </div>
        <h3
          className="font-extrabold tracking-tight mb-3"
          style={{ fontSize: "clamp(20px, 2.4vw, 30px)", color: "#1e2026", lineHeight: 1.2 }}
        >
          Ước tính chi phí vận hành thủ công{" "}
          <span style={{ color: "#673ab7" }}>mỗi tháng</span>
        </h3>
        <p
          className="text-sm leading-relaxed mx-auto"
          style={{ color: "#5b5f6b", maxWidth: "560px" }}
        >
          Điều chỉnh các thông số theo thực tế doanh nghiệp của bạn để xem số giờ làm việc
          và chi phí tương ứng đang dành cho thao tác thủ công và xử lý lại.
        </p>
      </div>

      <div className="px-6 sm:px-9 pb-9 grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6 lg:gap-8 items-start">
        {/* ── Inputs ── */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FIELDS.map((config) => (
              <EstimatorField
                key={config.key}
                config={config}
                value={input[config.key]}
                onChange={setField(config.key)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setInput(DEFAULT_LOSS_INPUT)}
            disabled={isDefault}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-45 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
            style={{ background: "#fff", color: "#673ab7", border: "1px solid rgba(103,58,183,0.18)" }}
          >
            <RotateCcw size={13} aria-hidden="true" />
            Đặt lại giá trị mặc định
          </button>
        </div>

        {/* ── Result ── */}
        <div
          className="rounded-3xl p-6 sm:p-7 lg:sticky lg:top-28"
          style={{
            background: "linear-gradient(135deg, #673ab7 0%, #4c1d95 100%)",
            boxShadow: "0 16px 48px rgba(103,58,183,0.24)",
          }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold mb-6"
            style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.92)" }}
          >
            <AlertTriangle size={11} aria-hidden="true" />
            Ước tính hằng tháng
          </div>

          {/* Hours */}
          <div className="flex items-start gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Clock size={18} color="#fff" strokeWidth={1.8} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>
                Tổng thời gian dành cho thao tác thủ công và làm lại
              </div>
              <div
                className="font-extrabold tabular-nums leading-none text-white break-words"
                style={{ fontSize: "clamp(24px, 3vw, 32px)", fontFamily: "'DM Mono', monospace" }}
              >
                {formatNumber(result.displayHours)}{" "}
                <span className="text-base font-bold">giờ</span>
              </div>
            </div>
          </div>

          {/* Cost */}
          <div
            className="rounded-2xl px-4 py-4 mb-5"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.14)" }}
          >
            <div className="text-[11px] mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
              Chi phí tương ứng ước tính
            </div>
            <div
              className="font-extrabold tabular-nums leading-tight text-white break-words"
              style={{ fontSize: "clamp(22px, 2.8vw, 30px)", fontFamily: "'DM Mono', monospace" }}
            >
              {formatVnd(result.displayLoss)}
            </div>
            <div className="text-[11px] mt-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
              Tương đương {formatVnd(roundHalfUpToStep(result.hourlyCost, 1_000))} / giờ / người
            </div>
          </div>

          {/* Disclaimer — never separated from the figures above. */}
          <p className="text-[11px] leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
            {LOSS_DISCLAIMER}
          </p>

          <Link
            to={leadCtaHref({ intent: "consultation", source: "consultation" })}
            className="flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ background: "#fff", color: "#673ab7", boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Nhận tư vấn tối ưu vận hành
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
