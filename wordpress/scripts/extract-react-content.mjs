/*
 * Extract the approved React content for a route by EXECUTING its data module,
 * not by transcribing it.
 *
 * These modules open with a CLAIM GUARD naming the figures that are not
 * approved for publication. Retyping the copy is how a guard like that gets
 * quietly dropped and an unapproved number reappears, so nothing here is
 * retyped: Node 24 strips the TypeScript, the module is imported, and its
 * exported literals are written out verbatim.
 *
 *   node --import ./wordpress/scripts/register-alias.mjs \
 *        wordpress/scripts/extract-react-content.mjs <out-dir>
 */
import fs from 'node:fs'
import path from 'node:path'

const REPO = process.env.GCALLS_REPO || '/Users/macos/Desktop/Gcalls/App/Gcalls-website-app'
const OUT = process.argv[2] || 'wordpress/content/extracted'
fs.mkdirSync(OUT, { recursive: true })

const ROUTES = [
  { slug: 'tong-dai-tich-hop-crm', family: 'solution-detail', data: ['crmIntegration.ts'] },
  { slug: 'tong-dai-tich-hop-helpdesk', family: 'solution-detail', data: ['helpdeskIntegration.ts'] },
  { slug: 'tong-dai-tich-hop-pos', family: 'solution-detail', data: ['posIntegration.ts'] },
  { slug: 'tong-dai-quoc-te', family: 'solution-detail', data: ['internationalCalling.ts'] },
  { slug: 'san-pham', family: 'product-overview', data: ['gcallsPlus.ts', 'qaQcCenter.ts', 'gcallsCx.ts'] },
  { slug: 'giai-phap', family: 'solution-overview',
    data: ['crmIntegration.ts', 'helpdeskIntegration.ts', 'posIntegration.ts', 'internationalCalling.ts', 'voicebotAi.ts'] },

  /* Batch 2 — the five integration vendors and their hub. Same two shapes as
   * Batch 1, so they need no new family and no sixth copy of the renderer:
   * one data file per detail page, and a hub that aggregates all five. */
  { slug: 'hubspot', family: 'integration-detail', data: ['hubspotIntegration.ts'] },
  { slug: 'salesforce', family: 'integration-detail', data: ['salesforceIntegration.ts'] },
  { slug: 'zoho-crm', family: 'integration-detail', data: ['zohoCrmIntegration.ts'] },
  { slug: 'freshdesk', family: 'integration-detail', data: ['freshdeskIntegration.ts'] },
  { slug: 'zendesk', family: 'integration-detail', data: ['zendeskIntegration.ts'] },
  { slug: 'tich-hop', family: 'integration-overview',
    data: ['hubspotIntegration.ts', 'salesforceIntegration.ts', 'zohoCrmIntegration.ts', 'freshdeskIntegration.ts', 'zendeskIntegration.ts'] },
]

const sha = async (f) => {
  const crypto = await import('node:crypto')
  return crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
}

const summary = []

for (const r of ROUTES) {
  const out = { slug: r.slug, family: r.family, sources: [], exports: {} }

  for (const d of r.data) {
    const file = path.join(REPO, 'src/data', d)
    const mod = await import(file)
    out.sources.push({ file: `src/data/${d}`, sha256: await sha(file), exportCount: Object.keys(mod).length })

    for (const [k, v] of Object.entries(mod)) {
      if (typeof v === 'function') continue
      out.exports[`${d}::${k}`] = v
    }
  }

  const file = path.join(OUT, `${r.slug}.json`)
  fs.writeFileSync(file, JSON.stringify(out, null, 1))

  const blob = JSON.stringify(out.exports)
  summary.push({
    slug: r.slug, family: r.family,
    sources: out.sources.length,
    exports: Object.keys(out.exports).length,
    bytes: blob.length,
    headings: (blob.match(/"(h1|h2|title|heading)":/g) || []).length,
  })
}

fs.writeFileSync(path.join(OUT, '_summary.json'), JSON.stringify(summary, null, 1))
console.log('EXTRACTED')
for (const s of summary) {
  console.log(`  ${s.slug.padEnd(30)} ${s.family.padEnd(19)} src=${s.sources} exports=${String(s.exports).padStart(3)} headings=${String(s.headings).padStart(3)} ${(s.bytes/1024).toFixed(1)}KB`)
}
