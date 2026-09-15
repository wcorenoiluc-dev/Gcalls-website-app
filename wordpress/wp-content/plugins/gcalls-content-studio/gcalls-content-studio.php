<?php
/**
 * Plugin Name:       Gcalls Content Studio
 * Plugin URI:        https://gcalls.co/
 * Description:       WordPress-native visual content editing for the Gcalls React Shell — manifest-driven structured fields, same-origin live preview, drafts, native revisions, audit log and SEO. No Elementor, no ACF.
 * Version:           0.2.0
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            Gcalls
 * Author URI:        https://gcalls.co/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gcalls-content-studio
 *
 * SCOPE
 * This plugin owns exactly one thing: structured content records for React
 * Shell routes/sections, served over a small REST surface. It does not touch
 * gcalls-core, gcalls-theme, Elementor, or the blog. The editable surface is
 * not declared here — it is read from the content manifest that the React
 * build generates and Gcalls React Shell exposes (see
 * docs/content-studio/CONTRACT-0.2.0.md), so PHP and TypeScript never carry
 * two hand-written copies of the same schema.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

const VERSION           = '0.2.0';
const SCHEMA_VERSION    = 2;
const MANIFEST_VERSION  = 2;
const CPT               = 'gcalls_content';
const CPT_AUDIT         = 'gcalls_cs_audit';
const CAP_EDIT          = 'edit_gcalls_content';
const CAP_PUBLISH       = 'publish_gcalls_content';
const CAP_MANAGE        = 'manage_gcalls_content';
const REST_NAMESPACE    = 'gcalls/v1';
const PREVIEW_QUERY_VAR = 'gcalls_content_preview';
const OPTION_PILOT_MODE = 'gcalls_cs_pilot_mode';
const OPTION_PUBLIC_URL = 'gcalls_cs_public_base_url';
const MIN_SHELL_VERSION = '0.3.7';

define( 'GCALLS_CS_FILE', __FILE__ );
define( 'GCALLS_CS_DIR', plugin_dir_path( __FILE__ ) );
define( 'GCALLS_CS_URL', plugin_dir_url( __FILE__ ) );

require_once GCALLS_CS_DIR . 'includes/class-manifest.php';
require_once GCALLS_CS_DIR . 'includes/class-schema.php';
require_once GCALLS_CS_DIR . 'includes/class-capabilities.php';
require_once GCALLS_CS_DIR . 'includes/class-cpt.php';
require_once GCALLS_CS_DIR . 'includes/class-audit.php';
require_once GCALLS_CS_DIR . 'includes/class-cache.php';
require_once GCALLS_CS_DIR . 'includes/class-seo.php';
require_once GCALLS_CS_DIR . 'includes/class-store.php';
require_once GCALLS_CS_DIR . 'includes/class-rest.php';
require_once GCALLS_CS_DIR . 'includes/class-preview.php';
require_once GCALLS_CS_DIR . 'includes/class-admin.php';

/** Boots every subsystem. Each class hooks itself; none calls another at construction time. */
function boot(): void {
	new Capabilities();
	new Cpt();
	new Audit();
	new Rest();
	new Preview();
	new Admin();

	// Public-site content injection. A filter, not a direct call from React
	// Shell, so React Shell has zero knowledge of this plugin and keeps
	// working unmodified when Content Studio is inactive — the dependency
	// points one way only.
	add_filter( 'gcalls_react_shell_config', __NAMESPACE__ . '\\inject_published_content', 10, 3 );
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\\boot' );

/** @return string 'pilot' | 'production' */
function pilot_mode(): string {
	$mode = get_option( OPTION_PILOT_MODE, 'pilot' );
	return 'production' === $mode ? 'production' : 'pilot';
}

/**
 * Adds THIS route's published content (and SEO fallback) to the config React
 * Shell embeds for a live visitor. Never runs for preview: Preview::render()
 * sets `gcallsContent` explicitly, and this checks for that first so it can
 * never clobber or duplicate it. Only the current route's payload is sent —
 * never all 38 pages.
 *
 * @param array<string, mixed> $extra_config
 * @return array<string, mixed>
 */
function inject_published_content( array $extra_config, string $route_key, string $path ): array {
	unset( $path );
	if ( isset( $extra_config['gcallsContent'] ) ) {
		return $extra_config;
	}
	if ( ! Manifest::route_exists( $route_key ) ) {
		return $extra_config;
	}

	$store     = new Store();
	$published = $store->published( $route_key );
	$meta      = $store->meta( $route_key );

	$payload = array(
		'restUrl'          => esc_url_raw( rest_url( REST_NAMESPACE ) ),
		'nonce'            => null, // A visitor can only ever read; the public GET needs no nonce.
		'schemaVersion'    => SCHEMA_VERSION,
		'version'          => (int) ( $meta['version'] ?? 0 ),
		'publishedContent' => array( 'sections' => $published['sections'] ?? array() ),
		'previewMode'      => false,
	);

	$seo = ( new Seo() )->public_payload( $route_key );
	if ( null !== $seo ) {
		$payload['seo'] = $seo;
	}

	$extra_config['gcallsContent'] = $payload;
	return $extra_config;
}

register_activation_hook( __FILE__, function (): void {
	// Capability grants and both CPTs must exist before the first admin page
	// loads; activation runs before plugins_loaded's normal order on this
	// request, so do it explicitly here too.
	( new Capabilities() )->grant_default_roles();
	( new Cpt() )->register();
	( new Audit() )->register();
	if ( false === get_option( OPTION_PILOT_MODE, false ) ) {
		add_option( OPTION_PILOT_MODE, 'pilot' );
	}
	flush_rewrite_rules();
} );

register_deactivation_hook( __FILE__, function (): void {
	flush_rewrite_rules();
} );
