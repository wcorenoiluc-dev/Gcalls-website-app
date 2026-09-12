#!/usr/bin/env node
/**
 * GCALLS-036B — generate the WordPress icon registry from lucide-react.
 *
 * WHY GENERATE RATHER THAN HAND-WRITE
 * React draws its 73 icons with lucide-react 0.487.0. Copying path data by hand
 * would drift, and taking SVG from the content manifest would mean the manifest
 * could inject markup. Reading the pinned dependency gives icons that are the
 * same shapes React uses, from a source that is already trusted and versioned.
 *
 * The registry is an ALLOWLIST: a key the map does not know renders nothing,
 * and no caller can pass raw SVG.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const ICONS_DIR = 'node_modules/lucide-react/dist/esm/icons'
const OUT = 'wordpress/wp-content/plugins/gcalls-core/includes/class-icons.php'

/** icon key used by section-components.json -> lucide icon file name */
const KEYS = {
  alert: 'triangle-alert', layers: 'layers', grid: 'layout-grid', clock: 'clock',
  user: 'user', route: 'route', chart: 'chart-column', plug: 'plug', target: 'target',
  shield: 'shield-check', rocket: 'rocket', tag: 'tag', quote: 'quote',
  message: 'message-circle', inbox: 'inbox', ticket: 'ticket', check: 'check',
  sparkles: 'sparkles', users: 'users', building: 'building-2', trending: 'trending-up',
  gauge: 'gauge', radar: 'radar', arrow: 'arrow-right', info: 'info',
  compare: 'columns-2', link: 'link-2', settings: 'settings', monitor: 'monitor',
  lifebuoy: 'life-buoy', 'arrow-in': 'arrow-down-left', globe: 'globe', phone: 'phone',
  'arrow-out': 'arrow-up-right', file: 'file-text', scale: 'scale', sync: 'repeat',
  cart: 'shopping-bag', store: 'store', dot: 'circle',
  // used by components rather than by a section source
  'chevron-down': 'chevron-down', 'phone-call': 'phone-call', mail: 'mail',
  send: 'send', search: 'search', puzzle: 'puzzle', network: 'network',
  database: 'database', headset: 'headset', history: 'history', workflow: 'workflow',
}

const available = new Set((await readdir(ICONS_DIR)).filter((f) => f.endsWith('.js') && !f.endsWith('.map.js')).map((f) => f.replace(/\.js$/, '')))

/** Pull the [tag, attrs] node list out of one lucide icon module. */
async function nodesFor(name) {
  const src = await readFile(path.join(ICONS_DIR, `${name}.js`), 'utf8')
  const block = src.match(/const __iconNode = \[([\s\S]*?)\];\s*\nconst /)
  if (!block) throw new Error(`no __iconNode in ${name}`)
  const out = []
  // Each node is ["tag", { attr: "value", key: "…" }] — possibly across lines.
  const re = /\[\s*"([a-z]+)",\s*\{([\s\S]*?)\}\s*\]/g
  let m
  while ((m = re.exec(block[1])) !== null) {
    const tag = m[1]
    const attrs = {}
    const ar = /([A-Za-z0-9-]+):\s*"([^"]*)"/g
    let a
    while ((a = ar.exec(m[2])) !== null) {
      if (a[1] === 'key') continue
      attrs[a[1]] = a[2]
    }
    out.push([tag, attrs])
  }
  if (!out.length) throw new Error(`no nodes parsed for ${name}`)
  return out
}

const missing = []
const reused = {}
const entries = []
for (const [key, lucide] of Object.entries(KEYS)) {
  if (!available.has(lucide)) { missing.push(`${key} -> ${lucide}`); continue }
  ;(reused[lucide] ||= []).push(key)
  const nodes = await nodesFor(lucide)
  const inner = nodes
    .map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')} />`)
    .join('')
  entries.push({ key, lucide, inner })
}

if (missing.length) {
  console.error('MISSING lucide icons:\n  ' + missing.join('\n  '))
  process.exit(1)
}

const php = `<?php
/**
 * Icon registry — GENERATED, do not edit by hand.
 *
 * Source: lucide-react 0.487.0, the same package the React reference draws with,
 * read out of node_modules by wordpress/scripts/build-icon-registry.mjs. Editing
 * this file means the next build silently reverts you; change the KEYS table in
 * that script instead.
 *
 * WHY AN ALLOWLIST
 * Icons are chosen by a key that the section-component contract owns. A caller
 * cannot pass SVG, a path, a URL or a class: an unknown key renders the empty
 * string. That is what keeps a content manifest from becoming a markup channel.
 *
 * Every icon here is DECORATIVE. It repeats a label that is already in the
 * markup, so it carries aria-hidden and focusable="false" and never becomes the
 * only accessible name for anything.
 *
 * @package Gcalls_Core
 */

declare( strict_types=1 );

namespace Gcalls\\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Trusted inline SVG, by key.
 */
final class Icons {

	private const VIEWBOX = '0 0 24 24';

	/**
	 * key => inner SVG markup.
	 *
	 * @var array<string, string>
	 */
	private const REGISTRY = array(
${entries.map((e) => `\t\t'${e.key}' => '${e.inner.replace(/'/g, "\\'")}', // lucide ${e.lucide}`).join('\n')}
	);

	/**
	 * Renders one decorative icon.
	 *
	 * @param string $key   Registry key.
	 * @param string $class Extra class names.
	 * @return string Empty string when the key is not in the registry.
	 */
	public static function render( string $key, string $class = '' ): string {
		if ( ! isset( self::REGISTRY[ $key ] ) ) {
			return '';
		}

		$classes = trim( 'gc-icon ' . $class );

		return sprintf(
			'<svg class="%s" viewBox="%s" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">%s</svg>',
			esc_attr( $classes ),
			esc_attr( self::VIEWBOX ),
			self::REGISTRY[ $key ]
		);
	}

	/**
	 * Whether a key exists. Used by the contract test.
	 *
	 * @param string $key Registry key.
	 * @return bool
	 */
	public static function has( string $key ): bool {
		return isset( self::REGISTRY[ $key ] );
	}

	/**
	 * Every registered key, for the contract test and the checkpoint report.
	 *
	 * @return array<int, string>
	 */
	public static function keys(): array {
		return array_keys( self::REGISTRY );
	}
}
`

await writeFile(OUT, php)
const shared = Object.entries(reused).filter(([, k]) => k.length > 1)
console.log(`registry keys:        ${entries.length}`)
console.log(`distinct lucide icons: ${Object.keys(reused).length}`)
console.log(`reused mappings:       ${shared.length ? shared.map(([l, k]) => `${l}<-${k.join('+')}`).join(', ') : 'none'}`)
console.log(`missing:               0`)
console.log('wrote', OUT)
