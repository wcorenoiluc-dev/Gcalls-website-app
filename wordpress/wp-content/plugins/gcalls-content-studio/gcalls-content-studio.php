<?php
/**
 * Plugin Name:       Gcalls Content Studio
 * Plugin URI:        https://gcalls.co/
 * Description:       WordPress-native visual content editing for the Gcalls React Shell — structured fields, live same-origin preview, drafts and native revision history. No Elementor, no ACF.
 * Version:           0.1.0
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
 * gcalls-core, gcalls-theme, Elementor, or the blog. It is deliberately a
 * separate plugin so those systems can be verified unchanged by inspecting
 * whether this plugin's files were the only ones touched.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

const VERSION = '0.1.0';
const SCHEMA_VERSION = 1;
const CPT = 'gcalls_content';
const CAP_EDIT = 'edit_gcalls_content';
const CAP_PUBLISH = 'publish_gcalls_content';
const REST_NAMESPACE = 'gcalls/v1';
const PREVIEW_QUERY_VAR = 'gcalls_content_preview';

define( 'GCALLS_CS_FILE', __FILE__ );
define( 'GCALLS_CS_DIR', plugin_dir_path( __FILE__ ) );
define( 'GCALLS_CS_URL', plugin_dir_url( __FILE__ ) );

require_once GCALLS_CS_DIR . 'includes/class-schema.php';
require_once GCALLS_CS_DIR . 'includes/class-capabilities.php';
require_once GCALLS_CS_DIR . 'includes/class-cpt.php';
require_once GCALLS_CS_DIR . 'includes/class-store.php';
require_once GCALLS_CS_DIR . 'includes/class-rest.php';
require_once GCALLS_CS_DIR . 'includes/class-preview.php';
require_once GCALLS_CS_DIR . 'includes/class-admin.php';

/** Boots every subsystem. Order matters only for readability — each class
 * hooks itself and does not call the others directly at construction time. */
function boot(): void {
	new Capabilities();
	new Cpt();
	new Rest();
	new Preview();
	new Admin();

	// Public-site content injection. Registered as a filter, not a direct
	// call from React Shell, so React Shell has zero knowledge of this
	// plugin and keeps working unmodified when Content Studio is inactive
	// (the filter simply never runs) — the dependency points one way only.
	add_filter( 'gcalls_react_shell_config', __NAMESPACE__ . '\\inject_published_content', 10, 3 );
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\\boot' );

/**
 * Adds this route's *published* content to the config React Shell embeds
 * for a live, logged-out visitor. Never runs for preview: Preview::render()
 * already sets `gcallsContent` explicitly (with draft values and a
 * `restNonce` scoped to an authenticated editor), and this checks for that
 * first so it can never clobber or duplicate it.
 *
 * @param array<string, mixed> $extra_config
 * @return array<string, mixed>
 */
function inject_published_content( array $extra_config, string $route_key, string $path ): array {
	if ( isset( $extra_config['gcallsContent'] ) ) {
		return $extra_config;
	}
	if ( ! Schema::route_exists( $route_key ) ) {
		return $extra_config;
	}

	$store     = new Store();
	$published = $store->published( $route_key );

	$extra_config['gcallsContent'] = array(
		'restUrl'          => esc_url_raw( rest_url( REST_NAMESPACE ) ),
		'nonce'            => null, // No nonce for a logged-out visitor — they can only ever read, and REST GET here needs none.
		'publishedContent' => array( 'sections' => $published['sections'] ?? array() ),
		'previewMode'      => false,
		'schemaVersion'    => SCHEMA_VERSION,
	);
	return $extra_config;
}

register_activation_hook( __FILE__, function (): void {
	// Capability grants and the CPT itself must exist before the first
	// admin page loads, and activation runs before plugins_loaded's normal
	// order on this request, so do both explicitly here too.
	( new Capabilities() )->grant_default_roles();
	( new Cpt() )->register();
	flush_rewrite_rules();
} );

register_deactivation_hook( __FILE__, function (): void {
	flush_rewrite_rules();
} );
