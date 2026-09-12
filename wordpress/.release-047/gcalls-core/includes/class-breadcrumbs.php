<?php
/**
 * Breadcrumbs.
 *
 * Prints the visible trail and, when Rank Math is absent, the matching
 * BreadcrumbList JSON-LD. When Rank Math IS active it already emits that
 * schema, so this class emits none — two BreadcrumbList graphs on one page is a
 * validation error, not a redundancy.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Builds and renders the breadcrumb trail.
 */
final class Breadcrumbs {

	/**
	 * Hooks the JSON-LD output.
	 */
	public static function init(): void {
		add_action( 'wp_footer', array( self::class, 'print_schema' ) );
	}

	/**
	 * Builds the trail for the current view.
	 *
	 * @return array<int, array{label: string, url: string}> Ordered, home first.
	 *         The last item is the current page and carries its own URL.
	 */
	public static function trail(): array {
		if ( is_front_page() ) {
			return array();
		}

		$trail = array(
			array(
				'label' => __( 'Trang chủ', 'gcalls-core' ),
				'url'   => home_url( '/' ),
			),
		);

		if ( is_singular( 'post' ) ) {
			$posts_page_id = (int) get_option( 'page_for_posts' );

			if ( $posts_page_id ) {
				$trail[] = array(
					'label' => get_the_title( $posts_page_id ),
					'url'   => (string) get_permalink( $posts_page_id ),
				);
			}

			$hub = self::primary_hub( (int) get_the_ID() );

			if ( $hub ) {
				$trail[] = $hub;
			}

			$trail[] = array(
				'label' => get_the_title(),
				'url'   => (string) get_permalink(),
			);

			return $trail;
		}

		if ( is_page() ) {
			// Ancestors run child-first; the trail runs root-first.
			foreach ( array_reverse( get_post_ancestors( (int) get_the_ID() ) ) as $ancestor_id ) {
				$trail[] = array(
					'label' => get_the_title( $ancestor_id ),
					'url'   => (string) get_permalink( $ancestor_id ),
				);
			}

			$trail[] = array(
				'label' => get_the_title(),
				'url'   => (string) get_permalink(),
			);

			return $trail;
		}

		if ( is_tax() || is_category() || is_tag() ) {
			$term = get_queried_object();

			if ( $term instanceof \WP_Term ) {
				$link = get_term_link( $term );

				$trail[] = array(
					'label' => $term->name,
					'url'   => is_wp_error( $link ) ? home_url( '/' ) : $link,
				);
			}

			return $trail;
		}

		if ( is_search() ) {
			$trail[] = array(
				/* translators: %s: search term. */
				'label' => sprintf( __( 'Kết quả cho “%s”', 'gcalls-core' ), get_search_query() ),
				'url'   => get_search_link(),
			);
		}

		return $trail;
	}

	/**
	 * The first HUB term attached to a post, as a trail item.
	 *
	 * @param int $post_id Post ID.
	 * @return array{label: string, url: string}|null
	 */
	private static function primary_hub( int $post_id ): ?array {
		$terms = get_the_terms( $post_id, Hub_Taxonomy::TAXONOMY );

		if ( empty( $terms ) || is_wp_error( $terms ) ) {
			return null;
		}

		$term = $terms[0];
		$link = get_term_link( $term );

		if ( is_wp_error( $link ) ) {
			return null;
		}

		return array(
			'label' => $term->name,
			'url'   => $link,
		);
	}

	/**
	 * Prints the visible trail.
	 *
	 * The current page is rendered as plain text with aria-current rather than
	 * as a link to itself.
	 */
	public static function render(): void {
		$trail = self::trail();

		if ( count( $trail ) < 2 ) {
			return;
		}

		$last = count( $trail ) - 1;

		echo '<nav class="gcalls-breadcrumbs" aria-label="' . esc_attr__( 'Đường dẫn', 'gcalls-core' ) . '"><ol>';

		foreach ( $trail as $index => $item ) {
			if ( $index === $last ) {
				printf(
					'<li><span aria-current="page">%s</span></li>',
					esc_html( $item['label'] )
				);
				continue;
			}

			printf(
				'<li><a href="%1$s">%2$s</a></li>',
				esc_url( $item['url'] ),
				esc_html( $item['label'] )
			);
		}

		echo '</ol></nav>';
	}

	/**
	 * Prints BreadcrumbList JSON-LD, unless Rank Math is emitting it already.
	 */
	public static function print_schema(): void {
		if ( Seo::rank_math_active() ) {
			return;
		}

		$trail = self::trail();

		if ( count( $trail ) < 2 ) {
			return;
		}

		$items = array();

		foreach ( $trail as $index => $item ) {
			$items[] = array(
				'@type'    => 'ListItem',
				'position' => $index + 1,
				'name'     => $item['label'],
				'item'     => $item['url'],
			);
		}

		Seo::print_json_ld(
			array(
				'@context'        => 'https://schema.org',
				'@type'           => 'BreadcrumbList',
				'itemListElement' => $items,
			)
		);
	}
}
