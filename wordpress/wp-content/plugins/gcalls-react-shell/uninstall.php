<?php
/**
 * Removes only this plugin's own option. Touches nothing belonging to
 * gcalls-core or any other plugin.
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option( 'gcalls_react_shell_scope' );
