<?php
/**
 * Gcalls theme bootstrap.
 *
 * This file does one job: define the version/path constants and load the
 * modules under inc/. Everything else — theme supports, asset enqueueing,
 * template helpers, Elementor integration — lives in its own file so that a
 * change to one concern cannot break another.
 *
 * WHAT DOES NOT BELONG HERE
 * Business logic that must survive a theme switch (taxonomies, structured
 * data, redirects, import commands) belongs in the Gcalls Core plugin. If a
 * feature would be missed after activating a different theme, it is not a
 * theme feature.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

/**
 * Bumping this busts the browser cache for every theme asset at once, because
 * it is passed as the $ver argument of every enqueue. Keep it in step with the
 * Version: header in style.css.
 */
// Read from style.css rather than hardcoded: the constant is the cache-busting
// query string on every enqueued asset, and at 0.1.0 it stopped changing three
// releases ago. Browsers went on serving the CSS they had cached under that
// version while the file on disk had moved on — which is how a deployed
// stylesheet fix appears not to have deployed.
define( 'GCALLS_THEME_VERSION', wp_get_theme()->get( 'Version' ) ?: '0.1.0' );

/** Absolute path, trailing slash included. */
define( 'GCALLS_THEME_DIR', trailingslashit( get_template_directory() ) );

/** Public URL, trailing slash included. */
define( 'GCALLS_THEME_URI', trailingslashit( get_template_directory_uri() ) );

require_once GCALLS_THEME_DIR . 'inc/setup.php';
require_once GCALLS_THEME_DIR . 'inc/assets.php';
require_once GCALLS_THEME_DIR . 'inc/template-tags.php';
require_once GCALLS_THEME_DIR . 'inc/elementor.php';
