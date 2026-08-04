/**
 * GCALLS demo product-UI library.
 *
 * These are the existing Gcalls product mockups built for the Home page. They
 * are the approved demo visuals for the whole site — product pages reuse them
 * rather than generating new generic SaaS UI.
 *
 * ---------------------------------------------------------------------------
 * DEMO_VISUAL_REPLACE_LATER
 * ---------------------------------------------------------------------------
 * Every value rendered inside these components is DEMO DATA. Call counts,
 * answer rates, durations, agent names and scores are illustrative only and
 * must never be quoted as Gcalls performance results in marketing copy.
 * Authentic screenshots replace these later; this barrel is the swap point.
 * ---------------------------------------------------------------------------
 *
 * The components still physically live under `components/home/` because the
 * Home page is approved and out of scope for the current checkpoint. This
 * barrel is the stable import surface: when they are moved into this folder,
 * consumers do not change.
 */

// Webphone dashboard + hero floats
export {
  DashboardMain,
  FloatingTimeline,
  FloatingCRM,
  FloatingAnalytics,
  FloatingDialpad,
} from '@/components/home/HeroSection'

// Call activity / interaction history
export { CallTimelineMockup } from '@/components/home/CallTimelineSection'

// Contact profile & customer context
export { CRMMockup } from '@/components/home/CRMSection'

// Analytics & agent performance
export { AnalyticsDashboardMockup } from '@/components/home/AnalyticsSection'

// Integration surfaces
export {
  APIManagerMockup,
  CustomerPopupMockup,
  WidgetMockup,
} from '@/components/home/IntegrationsSection'

// Softphone / dialpad / agent status
export {
  DialpadMockup,
  SoftphoneMockup,
  UserStatusDashboard,
} from '@/components/home/WorkFromAnywhereSection'
