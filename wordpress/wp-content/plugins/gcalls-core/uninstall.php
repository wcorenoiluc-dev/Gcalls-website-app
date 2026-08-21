<?php
/**
 * Uninstall.
 *
 * Runs only when the plugin is DELETED from the admin, never on deactivation.
 *
 * WHAT IS REMOVED: this plugin's own options — the redirect map and the import
 * run history. They are meaningless without the plugin.
 *
 * WHAT IS KEPT: posts, pages, HUB terms, FAQ meta and Rank Math meta. Those are
 * the site's content. Deleting a client's articles because a plugin was removed
 * is not cleanup, and a taxonomy term's disappearance would silently drop every
 * post's HUB assignment with no way back.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

delete_option( 'gcalls_redirect_map' );
delete_option( 'gcalls_import_runs' );
