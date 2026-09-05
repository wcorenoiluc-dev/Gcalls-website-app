import { ResourcesHubLayout } from '@/components/resources-hub/ResourcesHubLayout'
import { RESOURCES_HUB } from '@/data/hubs'

/**
 * `/tai-nguyen/` — resource hub.
 *
 * Six categories: Blog, Guides, Case Studies, Ebook, Glossary, FAQ. No content
 * count, article title or publication date is claimed — categories awaiting
 * content say so. Copy lives in `src/data/hubs.ts`.
 */
export function ResourcesHubPage() {
  return <ResourcesHubLayout content={RESOURCES_HUB} trail={[{ label: 'Tài nguyên' }]} />
}
