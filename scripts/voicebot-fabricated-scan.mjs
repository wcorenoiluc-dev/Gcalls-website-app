#!/usr/bin/env node
/**
 * Voicebot AI — fabricated-data guard.
 *
 * Fails (exit 1) if any of the retired fake values reappears anywhere in the
 * Voicebot source. These are the counts, percentages, lead IDs, timestamps and
 * statuses that used to live in `VoicebotCampaignMockup` / `VoicebotHandoffMockup`
 * before WEB-PRO-004 §5 required neutral diagrams. Labelling a realistic mock
 * "Minh họa" is not enough — the numbers themselves must not exist.
 *
 * Scope is intentionally the Voicebot page only, so a legitimate `size={24}` or
 * `pt-24` elsewhere is never in range. Within scope we match the fabricated
 * shapes precisely (quoted literals, `share:` values, `LH-####` IDs, `HH:MM`
 * campaign times) rather than bare digits, so Tailwind classes and icon sizes
 * do not false-positive.
 *
 * Usage: node scripts/voicebot-fabricated-scan.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')

const FILES = [
  'src/pages/VoicebotAiPage.tsx',
  'src/components/voicebot/visuals.tsx',
  'src/components/voicebot/sections.tsx',
  'src/components/voicebot/MediaSlot.tsx',
  'src/data/voicebotAi.ts',
]

/** Each rule: a human label and a RegExp matched per line. */
const RULES = [
  { label: 'fabricated lead ID (LH-####)', re: /\bLH-\d{4}\b/ },
  { label: 'retired campaign count literal', re: /['"`](?:480|312|198)['"`]/ },
  { label: 'retired "needs-agent" count (24) as a data value', re: /value:\s*['"`]24['"`]/ },
  { label: 'retired response percentage', re: /\b(?:46|27|15|12)\s*%/ },
  { label: 'retired response percentage (share: N)', re: /share:\s*(?:46|27|15|12)\b/ },
  { label: 'fabricated campaign timestamp', re: /['"`]09:(?:12|08|03)['"`]/ },
  {
    label: 'retired mockup component reintroduced (definition/JSX/import)',
    // Anchored to code shapes (def, JSX tag, import, destructure) so the
    // doc comment naming what was removed does not trip the guard.
    re: /(?:function\s+|<\/?|import[^\n]*\b|[{,]\s*)Voicebot(?:Campaign|Handoff)Mockup\b/,
  },
]

let failures = 0

for (const rel of FILES) {
  const abs = path.join(ROOT, rel)
  if (!fs.existsSync(abs)) continue
  const lines = fs.readFileSync(abs, 'utf8').split('\n')
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      if (rule.re.test(line)) {
        failures += 1
        console.error(`FAIL ${rel}:${i + 1}  ${rule.label}\n     ${line.trim()}`)
      }
    }
  })
}

if (failures > 0) {
  console.error(`\nVOICEBOT_FABRICATED_DATA_ZERO: FAIL — ${failures} match(es).`)
  process.exit(1)
}

console.log('VOICEBOT_FABRICATED_DATA_ZERO: PASS — no retired fake values found.')
