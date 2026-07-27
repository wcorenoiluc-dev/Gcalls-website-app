import { Hero } from '@/components/home/HeroSection'
import { PainPointsSection } from '@/components/home/PainPointsSection'
import { CallTimelineSection } from '@/components/home/CallTimelineSection'
import { CRMSection } from '@/components/home/CRMSection'
import { TeamSection } from '@/components/home/TeamSection'
import { AnalyticsSection } from '@/components/home/AnalyticsSection'
import { CloudSection } from '@/components/home/CloudSection'
import { IntegrationsSection } from '@/components/home/IntegrationsSection'
import { WorkFromAnywhereSection } from '@/components/home/WorkFromAnywhereSection'

/**
 * Home page.
 *
 * Section composition is unchanged from the Figma Make baseline — the
 * sections were lifted out of the 4,679-line monolith verbatim. Header and
 * footer now come from SiteLayout rather than being rendered here.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <PainPointsSection />
      <CallTimelineSection />
      <CRMSection />
      <TeamSection />
      <AnalyticsSection />
      <CloudSection />
      <IntegrationsSection />
      <WorkFromAnywhereSection />
    </>
  )
}
