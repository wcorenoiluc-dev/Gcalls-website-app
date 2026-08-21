<?php
/**
 * SEO helper.
 *
 * SCOPE — READ BEFORE ADDING ANYTHING HERE
 * Rank Math owns the <head>: title, meta description, canonical, robots meta,
 * Open Graph, Twitter cards and the XML sitemap. This class must never write
 * any of those. What it does instead:
 *
 *   1. transfers migrated SEO fields INTO Rank Math's own post meta, so the
 *      values are editable in the Rank Math UI after import rather than locked
 *      inside a plugin nobody will maintain;
 *   2. holds the shared JSON-LD printer used by the breadcrumb and FAQ modules;
 *   3. keeps the demo's noindex posture honest at the application layer.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Rank Math bridge and JSON-LD utilities.
 */
final class Seo {

	/** Rank Math's own meta keys. Writing these is the supported integration. */
	public const RANK_MATH_TITLE       = 'rank_math_title';
	public const RANK_MATH_DESCRIPTION = 'rank_math_description';
	public const RANK_MATH_FOCUS_KW    = 'rank_math_focus_keyword';
	public const RANK_MATH_ROBOTS      = 'rank_math_robots';

	/**
	 * Hooks the demo-safety filters.
	 */
	public static function init(): void {
		add_filter( 'wp_robots', array( self::class, 'filter_robots' ), 20 );
	}

	/**
	 * Is Rank Math active?
	 */
	public static function rank_math_active(): bool {
		return defined( 'RANK_MATH_VERSION' ) || class_exists( '\RankMath\Helper' );
	}

	/**
	 * Forces the strongest exclusion directives while the site is a demo.
	 *
	 * Driven by WordPress's own "Discourage search engines" setting, so turning
	 * indexing on at go-live is one checkbox rather than a code change — and so
	 * this can never contradict what the admin screen says.
	 *
	 * `blog_public = 0` already yields `noindex, nofollow`. The extra
	 * directives are what stops a snippet or a cached copy appearing from an
	 * external reference, matching DRAFT_ROBOTS in the React source and the
	 * X-Robots-Tag header set in .htaccess.
	 *
	 * @param array<string, bool|string> $robots Directives keyed by name.
	 * @return array<string, bool|string>
	 */
	public static function filter_robots( array $robots ): array {
		if ( (int) get_option( 'blog_public' ) === 1 ) {
			return $robots;
		}

		$robots['noindex']       = true;
		$robots['nofollow']      = true;
		$robots['noarchive']     = true;
		$robots['nosnippet']     = true;
		$robots['noimageindex']  = true;

		return $robots;
	}

	/**
	 * Writes migrated SEO fields into Rank Math's post meta.
	 *
	 * Skips any field that already holds a value: an editor's correction in the
	 * Rank Math UI must survive a re-run of the importer, which is the whole
	 * point of the pipeline being idempotent.
	 *
	 * @param int                   $post_id Target post.
	 * @param array<string, string> $fields  Keys: title, description, focus_keyword.
	 * @param bool                  $dry_run When true, nothing is written.
	 * @return array<int, string> Names of the fields that were (or would be) written.
	 */
	public static function apply_meta( int $post_id, array $fields, bool $dry_run = false ): array {
		$map = array(
			'title'         => self::RANK_MATH_TITLE,
			'description'   => self::RANK_MATH_DESCRIPTION,
			'focus_keyword' => self::RANK_MATH_FOCUS_KW,
		);

		$written = array();

		foreach ( $map as $field => $meta_key ) {
			$value = isset( $fields[ $field ] ) ? trim( (string) $fields[ $field ] ) : '';

			if ( '' === $value ) {
				continue;
			}

			if ( '' !== (string) get_post_meta( $post_id, $meta_key, true ) ) {
				continue;
			}

			$written[] = $field;

			if ( ! $dry_run ) {
				update_post_meta( $post_id, $meta_key, sanitize_text_field( $value ) );
			}
		}

		return $written;
	}

	/**
	 * Prints one JSON-LD graph.
	 *
	 * `wp_json_encode` handles the escaping; `JSON_UNESCAPED_UNICODE` keeps
	 * Vietnamese readable in the source rather than as \uXXXX escapes, and
	 * `JSON_UNESCAPED_SLASHES` keeps URLs readable. The type attribute means the
	 * browser never executes this, and the encoder cannot emit a `</script>`
	 * sequence because `<` and `>` are escaped by JSON_HEX_TAG.
	 *
	 * @param array<string, mixed> $graph Schema.org graph.
	 */
	public static function print_json_ld( array $graph ): void {
		$json = wp_json_encode( $graph, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG );

		if ( false === $json ) {
			return;
		}

		echo '<script type="application/ld+json">' . $json . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_json_encode with JSON_HEX_TAG is the escaping for this context; esc_html() would corrupt the JSON.
	}
}
