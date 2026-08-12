import { Hero } from '@/components/home/HeroSection'
import { PainPointsSection } from '@/components/home/PainPointsSection'
import { SolutionBridgeSection } from '@/components/home/SolutionBridgeSection'
import { EcosystemSection } from '@/components/home/EcosystemSection'
import { CallTimelineSection } from '@/components/home/CallTimelineSection'
import { CRMSection } from '@/components/home/CRMSection'
import { AnalyticsSection } from '@/components/home/AnalyticsSection'
import { CloudSection } from '@/components/home/CloudSection'
import { CustomerPopupSection } from '@/components/home/CustomerPopupSection'
import { CallWidgetSection } from '@/components/home/CallWidgetSection'
import { IntegrationCtaSection } from '@/components/home/IntegrationsSection'
import { WorkFromAnywhereSection } from '@/components/home/WorkFromAnywhereSection'
import { UseCasesFinalCtaSection } from '@/components/home/UseCasesFinalCtaSection'

/**
 * Home page — thirteen sections, in the approved order.
 *
 * ---------------------------------------------------------------------------
 * THE ORDER IS THE CONTENT DECISION. DO NOT REARRANGE IT CASUALLY.
 * ---------------------------------------------------------------------------
 * The page argues in one direction: what it is (1) → what hurts and roughly
 * what that costs you (2) → the shape of the answer (3) → what Gcalls actually
 * sells (4) → the capabilities, in the order an operations lead evaluates them
 * (5–8) → the two moments a visitor can picture (9–10) → how it plugs into what
 * they already run (11) → where their team can be while using it (12) → who it
 * is for, and the ask (13). Moving a section breaks that argument, not just the
 * layout.
 *
 *   1  Hero                                    HeroSection
 *   2  Pain points + loss estimator            PainPointsSection
 *   3  Solution bridge                         SolutionBridgeSection
 *   4  Product & solution ecosystem            EcosystemSection
 *   5  Realtime call activity                  CallTimelineSection
 *   6  Built-in mini CRM                       CRMSection
 *   7  Analytics & KPI dashboard               AnalyticsSection
 *   8  Cloud call center                       CloudSection
 *   9  Customer popup                          CustomerPopupSection
 *  10  Call button widget & ecosystem          CallWidgetSection
 *  11  Integration CTA                         IntegrationCtaSection
 *  12  Work from anywhere                      WorkFromAnywhereSection
 *  13  Use cases & final CTA                   UseCasesFinalCtaSection
 *
 * ---------------------------------------------------------------------------
 * WHAT WAS REMOVED FROM THIS PAGE, AND WHERE IT STILL LIVES
 * ---------------------------------------------------------------------------
 * `TeamSection` (role-based permissions) no longer renders here. It duplicated
 * §7's "watch your team's performance" argument at page scale and is not in the
 * approved thirteen. The component is intact and still exported — nothing was
 * deleted, and no route changed, because it never had a route of its own. The
 * same applies to the material split out of the two former monoliths: the old
 * `IntegrationsSection` and `WorkFromAnywhereSection` bodies became §§9–11 and
 * §§12–13 respectively, and their mockups are still re-exported through
 * `@/components/product-ui` for the product and integration pages.
 * ---------------------------------------------------------------------------
 *
 * Header and footer come from SiteLayout, not from here.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <PainPointsSection />
      <SolutionBridgeSection />
      <EcosystemSection />
      <CallTimelineSection />
      <CRMSection />
      <AnalyticsSection />
      <CloudSection />
      <CustomerPopupSection />
      <CallWidgetSection />
      <IntegrationCtaSection />
      <WorkFromAnywhereSection />
      <UseCasesFinalCtaSection />
    </>
  )
}
