import { HubLayout } from '@/components/hub/HubLayout'
import { RESOURCES_HUB } from '@/data/hubs'

/**
 * `/tai-nguyen/` — resource hub.
 *
 * Six categories: Blog, Guides, Case Studies, Ebook, Glossary, FAQ. No content
 * count, article title or publication date is claimed — categories awaiting
 * content say so. Copy lives in `src/data/hubs.ts`.
 */
export function ResourcesHubPage() {
  return <HubLayout content={RESOURCES_HUB} trail={[{ label: 'Tài nguyên' }]} />
}
