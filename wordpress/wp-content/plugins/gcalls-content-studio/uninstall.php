<?php
/**
 * Uninstall.
 *
 * Runs only when the plugin is DELETED from the admin, never on deactivation.
 *
 * WHAT IS REMOVED: this plugin's own setting (the public-base-URL option).
 *
 * WHAT IS KEPT: every `gcalls_content` post, its meta and its revisions —
 * that is the site's edited content. There is no setting that opts into
 * deleting it, so uninstalling never can, deliberately: the same content is
 * what `gcalls_content_studio_version()`-unaware code (React Shell, or the
 * REST API directly) keeps reading regardless of whether this admin UI is
 * still installed, and losing it because someone removed an *editor* would
 * be a data-loss surprise, not cleanup.
 *
 * Deactivating and later reactivating this plugin is unaffected either way
 * — deactivation runs none of this plugin's code at all.
 *
 * @package Gcalls\ContentStudio
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

delete_option( 'gcalls_cs_public_base_url' );
