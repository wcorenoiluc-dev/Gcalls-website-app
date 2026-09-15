<?php
/**
 * Uninstall: content records, revisions and the audit log are KEPT by default
 * so an accidental "Delete" in the plugin list cannot erase published copy.
 * Define `GCALLS_CS_UNINSTALL_PURGE` as true in wp-config.php before deleting
 * the plugin to remove everything.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

if ( ! defined( 'GCALLS_CS_UNINSTALL_PURGE' ) || true !== GCALLS_CS_UNINSTALL_PURGE ) {
	return;
}

foreach ( array( 'gcalls_content', 'gcalls_cs_audit' ) as $post_type ) {
	$posts = get_posts(
		array(
			'post_type'        => $post_type,
			'post_status'      => 'any',
			'numberposts'      => -1,
			'fields'           => 'ids',
			'suppress_filters' => true,
		)
	);
	foreach ( $posts as $post_id ) {
		wp_delete_post( (int) $post_id, true );
	}
}

delete_option( 'gcalls_cs_public_base_url' );
delete_option( 'gcalls_cs_pilot_mode' );

foreach ( array( 'administrator', 'editor' ) as $role_name ) {
	$role = get_role( $role_name );
	if ( $role ) {
		$role->remove_cap( 'edit_gcalls_content' );
		$role->remove_cap( 'publish_gcalls_content' );
		$role->remove_cap( 'manage_gcalls_content' );
	}
}
