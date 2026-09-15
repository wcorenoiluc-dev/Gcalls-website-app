<?php
/**
 * Per-page SEO fields, with Rank Math as the system of record when active.
 *
 * When Rank Math is active the tab reads/writes the WordPress page that owns
 * the route path (front page for "/"), through Rank Math's own meta keys —
 * one source of truth, no competing head tags. Otherwise the values live in
 * `_gcalls_seo_json` on the content record and are injected into
 * `gcallsContent.seo` for React's Seo component.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Seo {

	private const FIELDS = array( 'title', 'description', 'canonical', 'ogTitle', 'ogDescription', 'ogImage', 'noindex' );

	private const RANK_MATH_KEYS = array(
		'title'         => 'rank_math_title',
		'description'   => 'rank_math_description',
		'canonical'     => 'rank_math_canonical_url',
		'ogTitle'       => 'rank_math_facebook_title',
		'ogDescription' => 'rank_math_facebook_description',
		'ogImage'       => 'rank_math_facebook_image',
		'ogImageId'     => 'rank_math_facebook_image_id',
		'robots'        => 'rank_math_robots',
	);

	public static function rank_math_active(): bool {
		return class_exists( 'RankMath' ) || defined( 'RANK_MATH_VERSION' );
	}

	/** The WordPress page whose permalink is this route's path, or null. */
	public static function owning_page( string $route ): ?\WP_Post {
		$path = Manifest::route_path( $route );
		if ( '' === $path ) {
			return null;
		}
		if ( '/' === $path ) {
			$front = (int) get_option( 'page_on_front', 0 );
			$post  = $front ? get_post( $front ) : null;
			return $post instanceof \WP_Post ? $post : null;
		}
		$post = get_page_by_path( trim( $path, '/' ), OBJECT, 'page' );
		return $post instanceof \WP_Post ? $post : null;
	}

	/** @return array<string, mixed> */
	private static function empty_seo(): array {
		return array(
			'title'         => '',
			'description'   => '',
			'canonical'     => '',
			'ogTitle'       => '',
			'ogDescription' => '',
			'ogImage'       => null,
			'noindex'       => false,
		);
	}

	/**
	 * @return array<string, mixed> seo fields + managedBy + canEditNoindex
	 */
	public function get( string $route ): array {
		$seo       = self::empty_seo();
		$page      = self::owning_page( $route );
		$rank_math = self::rank_math_active() && $page;

		if ( $rank_math ) {
			$seo['title']         = (string) get_post_meta( $page->ID, self::RANK_MATH_KEYS['title'], true );
			$seo['description']   = (string) get_post_meta( $page->ID, self::RANK_MATH_KEYS['description'], true );
			$seo['canonical']     = (string) get_post_meta( $page->ID, self::RANK_MATH_KEYS['canonical'], true );
			$seo['ogTitle']       = (string) get_post_meta( $page->ID, self::RANK_MATH_KEYS['ogTitle'], true );
			$seo['ogDescription'] = (string) get_post_meta( $page->ID, self::RANK_MATH_KEYS['ogDescription'], true );
			$image_id             = (int) get_post_meta( $page->ID, self::RANK_MATH_KEYS['ogImageId'], true );
			$image_url            = (string) get_post_meta( $page->ID, self::RANK_MATH_KEYS['ogImage'], true );
			$seo['ogImage']       = $image_id || '' !== $image_url ? array( 'id' => $image_id, 'url' => $image_url ) : null;
			$robots               = get_post_meta( $page->ID, self::RANK_MATH_KEYS['robots'], true );
			$seo['noindex']       = is_array( $robots ) && in_array( 'noindex', $robots, true );
		} else {
			$post = ( new Cpt() )->find( $route );
			if ( $post ) {
				$stored = json_decode( (string) get_post_meta( $post->ID, Cpt::META_SEO, true ), true );
				if ( is_array( $stored ) ) {
					$seo = array_merge( $seo, array_intersect_key( $stored, $seo ) );
				}
			}
		}

		$seo['managedBy']      = $rank_math ? 'rank-math' : 'content-studio';
		$seo['canEditNoindex'] = Capabilities::can_manage();
		return $seo;
	}

	/**
	 * Sanitizes, then writes. The noindex flag is only applied when the
	 * caller may manage — otherwise it is left exactly as stored.
	 *
	 * @param array<string, mixed> $raw
	 * @return array{0: bool, 1: array<int, string>} [saved, errors]
	 */
	public function save( string $route, array $raw, int $user_id ): array {
		$errors  = array();
		$current = $this->get( $route );
		$clean   = array();

		foreach ( array( 'title', 'ogTitle' ) as $k ) {
			$clean[ $k ] = mb_substr( sanitize_text_field( (string) ( $raw[ $k ] ?? '' ) ), 0, 120 );
		}
		foreach ( array( 'description', 'ogDescription' ) as $k ) {
			$clean[ $k ] = mb_substr( sanitize_textarea_field( (string) ( $raw[ $k ] ?? '' ) ), 0, 320 );
		}

		$canonical = trim( (string) ( $raw['canonical'] ?? '' ) );
		if ( '' === $canonical ) {
			$clean['canonical'] = '';
		} else {
			$url = Schema::sanitize_url( $canonical );
			if ( null === $url || ! preg_match( '#^https?://#i', $url ) ) {
				$errors[]           = 'invalid_url:canonical';
				$clean['canonical'] = '';
			} else {
				$clean['canonical'] = $url;
			}
		}

		$clean['ogImage'] = null;
		if ( ! empty( $raw['ogImage'] ) ) {
			$image = Schema::sanitize_image( $raw['ogImage'] );
			if ( null === $image ) {
				$errors[] = 'invalid_image:ogImage';
			} else {
				$clean['ogImage'] = array( 'id' => $image['id'], 'url' => $image['url'] );
			}
		}

		$wants_noindex = filter_var( $raw['noindex'] ?? $current['noindex'], FILTER_VALIDATE_BOOLEAN );
		if ( $wants_noindex !== (bool) $current['noindex'] && ! Capabilities::can_manage() ) {
			return array( false, array( 'forbidden:noindex' ) );
		}
		$clean['noindex'] = Capabilities::can_manage() ? $wants_noindex : (bool) $current['noindex'];

		if ( ! empty( $errors ) ) {
			return array( false, $errors );
		}

		$page = self::owning_page( $route );
		if ( self::rank_math_active() && $page ) {
			update_post_meta( $page->ID, self::RANK_MATH_KEYS['title'], $clean['title'] );
			update_post_meta( $page->ID, self::RANK_MATH_KEYS['description'], $clean['description'] );
			update_post_meta( $page->ID, self::RANK_MATH_KEYS['canonical'], $clean['canonical'] );
			update_post_meta( $page->ID, self::RANK_MATH_KEYS['ogTitle'], $clean['ogTitle'] );
			update_post_meta( $page->ID, self::RANK_MATH_KEYS['ogDescription'], $clean['ogDescription'] );
			if ( $clean['ogImage'] ) {
				update_post_meta( $page->ID, self::RANK_MATH_KEYS['ogImage'], $clean['ogImage']['url'] );
				update_post_meta( $page->ID, self::RANK_MATH_KEYS['ogImageId'], $clean['ogImage']['id'] );
			} else {
				delete_post_meta( $page->ID, self::RANK_MATH_KEYS['ogImage'] );
				delete_post_meta( $page->ID, self::RANK_MATH_KEYS['ogImageId'] );
			}
			if ( Capabilities::can_manage() ) {
				$robots = get_post_meta( $page->ID, self::RANK_MATH_KEYS['robots'], true );
				$robots = is_array( $robots ) ? array_values( array_diff( $robots, array( 'index', 'noindex' ) ) ) : array();
				$robots[] = $clean['noindex'] ? 'noindex' : 'index';
				update_post_meta( $page->ID, self::RANK_MATH_KEYS['robots'], $robots );
			}
			clean_post_cache( $page->ID );
		} else {
			$post_id = ( new Cpt() )->get_or_create( $route );
			if ( 0 === $post_id ) {
				return array( false, array( 'storage_failed' ) );
			}
			update_post_meta( $post_id, Cpt::META_SEO, wp_json_encode( $clean ) );
		}

		Audit::append( 'seo_update', $route, array( 'seo' ), $user_id );
		return array( true, array() );
	}

	/**
	 * What the public config carries. With Rank Math active it prints its own
	 * head tags through wp_head(), so nothing is duplicated into the React
	 * payload; only the fallback store is injected.
	 *
	 * @return array<string, mixed>|null
	 */
	public function public_payload( string $route ): ?array {
		if ( self::rank_math_active() && self::owning_page( $route ) ) {
			return null;
		}
		$post = ( new Cpt() )->find( $route );
		if ( ! $post ) {
			return null;
		}
		$stored = json_decode( (string) get_post_meta( $post->ID, Cpt::META_SEO, true ), true );
		if ( ! is_array( $stored ) ) {
			return null;
		}
		$out = array();
		foreach ( self::FIELDS as $k ) {
			if ( array_key_exists( $k, $stored ) && '' !== $stored[ $k ] && null !== $stored[ $k ] ) {
				$out[ $k ] = $stored[ $k ];
			}
		}
		return empty( $out ) ? null : $out;
	}
}
