import { Activity, Briefcase, Cloud, Code2, Globe, HeadphonesIcon, Layers, LayoutGrid, MessageCircle, Users } from "lucide-react";

/**
 * Data shared across homepage sections that were split out of the two former
 * monoliths.
 *
 * It lives in a plain `.ts` module rather than beside the components that used
 * to own it for one reason: a `.tsx` file that exports both components and
 * constants breaks React Fast Refresh, and the lint rule says so. Keeping the
 * data here means §10 and §11 can share `ecosystemGroups`, and §12 and §13 can
 * share the remote use cases, without either component file losing HMR.
 */

/**
 * Platforms shown in the integration ecosystem grid.
 *
 * ---------------------------------------------------------------------------
 * A PLATFORM APPEARS HERE ONLY IF IT HAS AN INTEGRATION PAGE
 * ---------------------------------------------------------------------------
 * The five named CRM/Helpdesk platforms are exactly the five with a completed
 * integration page (INT-01…05). "Freshsales" was removed in Checkpoint
 * WEB-SITE-QA-001: it has no page, no config and no evidence anywhere in this
 * repository, and a green status dot beside a platform name reads as a
 * confirmed, live integration. Do not add a platform here before its
 * integration page exists.
 * ---------------------------------------------------------------------------
 */
export const ecosystemGroups = [
  {
    category: "CRM",
    color: "#673ab7",
    icon: Users,
    tools: [
      { name: "HubSpot",    abbr: "HS",  color: "#ff7a59" },
      { name: "Salesforce", abbr: "SF",  color: "#00a1e0" },
      { name: "Zoho CRM",   abbr: "ZH",  color: "#e42527" },
    ],
  },
  {
    category: "Helpdesk",
    color: "#0891b2",
    icon: HeadphonesIcon,
    tools: [
      { name: "Freshdesk", abbr: "FD", color: "#0fa958" },
      { name: "Zendesk",   abbr: "ZD", color: "#03363d" },
    ],
  },
  {
    category: "Communication",
    color: "#16a34a",
    icon: MessageCircle,
    tools: [
      { name: "Facebook", abbr: "FB", color: "#1877f2" },
      { name: "Zalo OA",  abbr: "ZA", color: "#0068ff" },
      { name: "Email",    abbr: "EM", color: "#ea4335" },
    ],
  },
  {
    category: "Developer",
    color: "#d97706",
    icon: Code2,
    tools: [
      { name: "Open API",    abbr: "API", color: "#673ab7" },
      { name: "Webhook",     abbr: "WH",  color: "#0891b2" },
      { name: "Custom",      abbr: "DEV", color: "#6b7280" },
    ],
  },
];

/**
 * The four approved homepage use cases (§13).
 *
 * Withheld from the Contact Center card: "ghi âm 100% cuộc gọi" from the source
 * content. A total-coverage absolute of exactly the kind already blocked in
 * `src/data/resources/types.ts`.
 */
export const remoteUseCases = [
  { role: "Sales Team",      icon: Briefcase,       color: "#673ab7", bg: "#f5f0fd",
    points: ["Gọi cho KH từ bất kỳ đâu", "Xem hồ sơ KH ngay trên trình duyệt", "Ghi chú kết quả sau mỗi cuộc gọi"] },
  { role: "Remote Team",     icon: Globe,           color: "#0891b2", bg: "#f0f9ff",
    points: ["Làm việc từ xa như tại văn phòng", "Quản lý theo dõi realtime", "Không cần VPN hay thiết bị đặc biệt"] },
  { role: "Multi Branch",    icon: Layers,          color: "#16a34a", bg: "#f0fdf4",
    points: ["Kết nối nhiều chi nhánh trên 1 hệ thống", "Đổ chuông liên chi nhánh", "Báo cáo tổng hợp toàn bộ"] },
  { role: "Contact Center",  icon: HeadphonesIcon,  color: "#d97706", bg: "#fffbeb",
    points: ["Điều phối đội ngũ theo ca", "Giám sát trạng thái realtime", "Ghi âm cuộc gọi theo cấu hình"] },
];

/**
 * Capability chips beside the final CTA.
 *
 * Every "value" is a WORD, not a figure — deliberately. This block sits where a
 * SaaS homepage conventionally prints uptime, customer counts and ratings, and
 * none of those are evidenced for Gcalls.
 */
export const wfaStats = [
  { value: "Anywhere", label: "Work From Anywhere", icon: Globe,       color: "#673ab7" },
  { value: "Cloud",    label: "Cloud SaaS",          icon: Cloud,       color: "#0891b2" },
  { value: "Live",     label: "Realtime Sync",       icon: Activity,    color: "#16a34a" },
  { value: "Multi",    label: "Any Device",          icon: LayoutGrid,  color: "#d97706" },
];
