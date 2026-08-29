<?php
/**
 * Plugin Name:       Gcalls Core
 * Plugin URI:        https://gcalls.co/
 * Description:       Site behaviour that must survive a theme change: the HUB taxonomy for blog articles, FAQ structured data, breadcrumbs, the legacy route/redirect map and the WP-CLI content import pipeline.
 * Version:           0.7.4
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            Gcalls
 * Author URI:        https://gcalls.co/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gcalls-core
 * Domain Path:       /languages
 *
 * WHY A PLUGIN AND NOT THE THEME
 * Everything here would be lost or broken by switching themes, and losing it
 * would change URLs, structured data or taxonomy assignments — not just the
 * look of the site. That is the line: presentation in the theme, everything
 * else here.
 *
 * WHAT THIS PLUGIN DOES NOT DO
 * It does not output meta titles, meta descriptions, canonical tags, Open Graph
 * tags or an XML sitemap. Rank Math owns those. Two plugins writing the same
 * <head> tags produce duplicates, and duplicated canonicals are worse than
 * none. The SEO module here only *feeds* Rank Math (see includes/class-seo.php).
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

const VERSION = '0.7.4';

/** Absolute path to this plugin's directory, trailing slash included. */
define( 'GCALLS_CORE_FILE', __FILE__ );
define( 'GCALLS_CORE_DIR', plugin_dir_path( __FILE__ ) );
define( 'GCALLS_CORE_URL', plugin_dir_url( __FILE__ ) );

require_once GCALLS_CORE_DIR . 'includes/class-hub-taxonomy.php';
require_once GCALLS_CORE_DIR . 'includes/class-breadcrumbs.php';
require_once GCALLS_CORE_DIR . 'includes/class-faq.php';
require_once GCALLS_CORE_DIR . 'includes/class-seo.php';
require_once GCALLS_CORE_DIR . 'includes/class-redirects.php';
require_once GCALLS_CORE_DIR . 'includes/class-hardening.php';
require_once GCALLS_CORE_DIR . 'includes/class-importer.php';
require_once GCALLS_CORE_DIR . 'includes/class-shortcodes.php';
require_once GCALLS_CORE_DIR . 'includes/class-mockups.php';
require_once GCALLS_CORE_DIR . 'includes/template-tags.php';

/**
 * Boots every module.
 *
 * Each module registers its own hooks; none of them run work at require time,
 * so the order of the requires above does not matter.
 */
function bootstrap(): void {
	Hub_Taxonomy::init();
	Breadcrumbs::init();
	Faq::init();
	Seo::init();
	Redirects::init();
	Hardening::init();
	Shortcodes::init();
	Mockups::init();

	// The import screen registers a Tools submenu and nothing else. Loading it
	// only in the admin keeps its code off every front-end request, and the
	// importer itself is still reached exclusively through an explicit,
	// nonce-checked POST — never a hook that fires on its own.
	if ( is_admin() ) {
		require_once GCALLS_CORE_DIR . 'includes/class-admin.php';
		Admin::init();
	}

	if ( defined( 'WP_CLI' ) && \WP_CLI ) {
		require_once GCALLS_CORE_DIR . 'includes/class-cli.php';
		Cli::init();
	}
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\\bootstrap' );

/**
 * Loads translations.
 */
function load_textdomain(): void {
	load_plugin_textdomain( 'gcalls-core', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'init', __NAMESPACE__ . '\\load_textdomain' );

/**
 * Activation: register the taxonomy, then flush rewrite rules once.
 *
 * Flushing on every load is a documented performance mistake; flushing here is
 * the supported way to make /hub/<slug>/ resolve immediately after activation.
 */
function activate(): void {
	Hub_Taxonomy::register();
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, __NAMESPACE__ . '\\activate' );

/**
 * Deactivation: drop the rewrite rules this plugin added.
 *
 * Nothing is deleted — terms, posts and meta survive deactivation. Removing
 * data belongs in uninstall.php, and even there it is opt-in.
 */
function deactivate(): void {
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, __NAMESPACE__ . '\\deactivate' );
