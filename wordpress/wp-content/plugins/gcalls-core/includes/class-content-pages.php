<?php
/**
 * Read-only page renderer.
 *
 * Thirty-one pages exist in WordPress with the right slugs, titles and SEO
 * records and no body. This supplies the body at request time from a versioned
 * manifest shipped inside the plugin.
 *
 * IT WRITES NOTHING. No wp_insert_post, no wp_update_post, no update_post_meta,
 * no update_option, no Elementor data, no activation hook, no cron. The reason
 * is in docs/CONTENT-RENDER-ADR.md and it is worth restating here: the
 * alternative was an admin tool that writes post_content, and every failure mode
 * of that tool is "wrote something it should not have" into the same table the
 * eighteen protected articles live in. This module has no writer to misfire.
 * Its worst case is a page that renders wrongly until the next deploy.
 *
 * WHAT KEEPS IT OFF EVERYTHING ELSE
 * An exact slug allowlist — no patterns, no prefixes. Pages only. Main query,
 * singular, in the loop. Never in the admin, REST, a feed, a preview or AJAX.
 * `post_type=post` cannot match any branch here, so the articles are outside the
 * code path entirely rather than merely excluded by a condition.
 *
 * AND ONE MORE GUARD
 * It renders only when the page's existing content is an empty shell. If someone
 * writes real content into one of these pages in WordPress, this stands down and
 * shows their work instead of hiding it behind the manifest.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Renders manifest-backed content for allowlisted page slugs.
 */
final class Content_Pages {

	/** Manifest shipped beside this file. */
	private const DATA = 'data/content-pages.json';

	/**
	 * A page with less than this much text is an empty shell.
	 *
	 * The shells render a title and nothing else — measured at 7 to 29 words of
	 * body. A real page is far above this. The threshold is deliberately low so
	 * that a page someone has genuinely started writing is left alone.
	 */
	private const SHELL_MAX_CHARS = 200;

	/** Cached manifest, per request. */
	private static ?array $manifest = null;

	/**
	 * Hooks the renderer.
	 *
	 * `the_content` only. Nothing is hooked that could fire on save, activation
	 * or a scheduled event.
	 */
	public static function init(): void {
		add_filter( 'the_content', array( self::class, 'render' ), 9 );

		// SEO is supplied through Rank Math's own filters, scoped to the same
		// allowlist, exactly as class-seo.php already does for its fallbacks.
		add_filter( 'rank_math/frontend/title', array( self::class, 'seo_title' ), 25 );
		add_filter( 'rank_math/frontend/description', array( self::class, 'seo_description' ), 25 );
	}

	/* ------------------------------------------------------------ manifest */

	/**
	 * Loads the manifest once per request.
	 *
	 * @return array<string, array<string, mixed>> Keyed by slug.
	 */
	private static function manifest(): array {
		if ( null !== self::$manifest ) {
			return self::$manifest;
		}

		self::$manifest = array();

		$path = GCALLS_CORE_DIR . self::DATA;

		if ( ! is_readable( $path ) ) {
			return self::$manifest;
		}

		$decoded = json_decode( (string) file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- a file inside the plugin.

		if ( ! is_array( $decoded ) || ! isset( $decoded['pages'] ) || ! is_array( $decoded['pages'] ) ) {
			return self::$manifest;
		}

		foreach ( $decoded['pages'] as $page ) {
			if ( is_array( $page ) && isset( $page['slug'] ) && is_string( $page['slug'] ) ) {
				self::$manifest[ $page['slug'] ] = $page;
			}
		}

		return self::$manifest;
	}

	/**
	 * Whether this request may be rendered into.
	 *
	 * Every condition is stated rather than inferred, and any one of them
	 * failing means the content passes through untouched.
	 *
	 * @param string $content Existing content.
	 * @return array<string, mixed>|null The page manifest entry, or null.
	 */
	private static function target( string $content ): ?array {
		if ( is_admin() || wp_doing_ajax() || is_feed() || is_preview() || is_embed() ) {
			return null;
		}

		if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
			return null;
		}

		if ( ! is_singular( 'page' ) || ! is_main_query() || ! in_the_loop() ) {
			return null;
		}

		$post = get_post();

		if ( ! $post instanceof \WP_Post || 'page' !== $post->post_type ) {
			return null;
		}

		// The front page is never a target. It is Elementor-built and signed off.
		if ( (int) get_option( 'page_on_front' ) === (int) $post->ID ) {
			return null;
		}

		$pages = self::manifest();

		// EXACT slug match. No prefix, no pattern, no fuzzy fallback.
		if ( ! isset( $pages[ $post->post_name ] ) ) {
			return null;
		}

		// Only fill a page that is genuinely empty. Someone's real content wins.
		if ( ! self::is_empty_shell( $content ) ) {
			return null;
		}

		return $pages[ $post->post_name ];
	}

	/**
	 * Whether the existing content is an empty shell.
	 *
	 * @param string $content Existing content.
	 * @return bool
	 */
	public static function is_empty_shell( string $content ): bool {
		$text = trim( wp_strip_all_tags( $content ) );

		return '' === $text || mb_strlen( $text ) <= self::SHELL_MAX_CHARS;
	}

	/* -------------------------------------------------------------- render */

	/**
	 * Supplies the page body.
	 *
	 * @param string $content Existing content.
	 * @return string
	 */
	public static function render( $content ): string {
		$content = (string) $content;
		$page    = self::target( $content );

		if ( null === $page ) {
			return $content;
		}

		$html = self::hero( $page );

		foreach ( (array) ( $page['sections'] ?? array() ) as $section ) {
			$html .= self::section( (array) $section );
		}

		$html .= self::faq( $page );
		$html .= self::cta( $page );

		return '<div class="gcalls-cp">' . $html . '</div>';
	}

	/**
	 * The hero, which carries the page's only h1.
	 *
	 * The theme template prints its own h1 only when the content has none
	 * (page-templates/full-width.php), so emitting one here is what keeps the
	 * page to exactly one.
	 *
	 * @param array<string, mixed> $page Page entry.
	 * @return string
	 */
	private static function hero( array $page ): string {
		$hero = (array) ( $page['hero'] ?? array() );

		if ( '' === (string) ( $hero['h1'] ?? '' ) ) {
			return '';
		}

		$out = '<header class="gcalls-cp__hero">';

		if ( ! empty( $hero['eyebrow'] ) ) {
			$out .= '<p class="gcalls-cp__eyebrow">' . esc_html( (string) $hero['eyebrow'] ) . '</p>';
		}

		$out .= '<h1 class="gcalls-cp__h1">' . esc_html( (string) $hero['h1'] ) . '</h1>';

		if ( ! empty( $hero['description'] ) ) {
			$out .= '<p class="gcalls-cp__lead">' . esc_html( (string) $hero['description'] ) . '</p>';
		}

		$points = (array) ( $hero['points'] ?? array() );

		if ( array() !== $points ) {
			$out .= '<div class="gcalls-cp__grid gcalls-cp__grid--3">';

			foreach ( $points as $p ) {
				$out .= self::card( (array) $p );
			}

			$out .= '</div>';
		}

		return $out . '</header>';
	}

	/**
	 * One card.
	 *
	 * @param array<string, mixed> $c Card.
	 * @return string
	 */
	private static function card( array $c ): string {
		$title = (string) ( $c['title'] ?? '' );
		$body  = (string) ( $c['body'] ?? '' );

		if ( '' === $title && '' === $body ) {
			return '';
		}

		$out = '<article class="gcalls-cp__card">';

		if ( '' !== $title ) {
			$out .= '<h3 class="gcalls-cp__card-title">' . esc_html( $title ) . '</h3>';
		}

		if ( '' !== $body ) {
			$out .= '<p class="gcalls-cp__card-body">' . esc_html( $body ) . '</p>';
		}

		$href = self::safe_href( (string) ( $c['href'] ?? '' ) );

		if ( '' !== $href ) {
			$out .= '<a class="gcalls-cp__card-link" href="' . esc_url( $href ) . '">'
				. esc_html__( 'Tìm hiểu thêm', 'gcalls-core' ) . '</a>';
		}

		return $out . '</article>';
	}

	/**
	 * Internal paths only.
	 *
	 * The manifest is generated from repository data, not user input, but this
	 * renderer is the only thing standing between that file and the page. An
	 * allowlist of same-site paths costs nothing and means a `javascript:` or
	 * `data:` URL cannot reach an href even if one ever got into the manifest.
	 *
	 * @param string $href Candidate.
	 * @return string Empty when not allowed.
	 */
	public static function safe_href( string $href ): string {
		$href = trim( $href );

		if ( '' === $href ) {
			return '';
		}

		// Must be a site-root path. Never a scheme, never protocol-relative.
		return (bool) preg_match( '#^/[A-Za-z0-9\-/]*/(\?[A-Za-z0-9=&%\-_.]*)?$#', $href ) ? $href : '';
	}

	/**
	 * One section, by type.
	 *
	 * A section whose payload is empty renders nothing at all — no heading
	 * floating above an absent grid, and no empty box contributing height.
	 *
	 * @param array<string, mixed> $s Section.
	 * @return string
	 */
	private static function section( array $s ): string {
		$type = (string) ( $s['type'] ?? '' );
		$head = '';

		if ( ! empty( $s['eyebrow'] ) ) {
			$head .= '<p class="gcalls-cp__eyebrow">' . esc_html( (string) $s['eyebrow'] ) . '</p>';
		}

		if ( ! empty( $s['heading'] ) ) {
			$head .= '<h2 class="gcalls-cp__h2">' . esc_html( (string) $s['heading'] ) . '</h2>';
		}

		if ( ! empty( $s['lead'] ) ) {
			$head .= '<p class="gcalls-cp__lead">' . esc_html( (string) $s['lead'] ) . '</p>';
		}

		$open = '<section class="gcalls-cp__section">' . $head;

		if ( 'prose' === $type ) {
			$body = (string) ( $s['body'] ?? '' );

			if ( '' === $body && '' === $head ) {
				return '';
			}

			return $open . ( '' !== $body ? '<p class="gcalls-cp__prose">' . esc_html( $body ) . '</p>' : '' ) . '</section>';
		}

		if ( 'cards' === $type || 'split' === $type ) {
			$items = (array) ( $s['cards'] ?? $s['columns'] ?? array() );

			if ( array() === $items ) {
				return '';
			}

			$grid = 'split' === $type ? ' gcalls-cp__grid--2' : ' gcalls-cp__grid--3';
			$out  = $open . '<div class="gcalls-cp__grid' . $grid . '">';

			foreach ( $items as $c ) {
				$out .= self::card( (array) $c );
			}

			$out .= '</div>';

			if ( ! empty( $s['note'] ) ) {
				$out .= '<p class="gcalls-cp__note">' . esc_html( (string) $s['note'] ) . '</p>';
			}

			return $out . '</section>';
		}

		if ( 'steps' === $type ) {
			$steps = (array) ( $s['steps'] ?? array() );

			if ( array() === $steps ) {
				return '';
			}

			$out = $open . '<ol class="gcalls-cp__steps">';

			foreach ( $steps as $st ) {
				$st    = (array) $st;
				$title = (string) ( $st['title'] ?? '' );
				$body  = (string) ( $st['body'] ?? '' );

				if ( '' === $title && '' === $body ) {
					continue;
				}

				$out .= '<li class="gcalls-cp__step">';
				$out .= '<span class="gcalls-cp__step-n" aria-hidden="true">'
					. esc_html( str_pad( (string) ( $st['n'] ?? '' ), 2, '0', STR_PAD_LEFT ) ) . '</span><div>';

				if ( '' !== $title ) {
					$out .= '<h3 class="gcalls-cp__step-title">' . esc_html( $title ) . '</h3>';
				}

				if ( '' !== $body ) {
					$out .= '<p class="gcalls-cp__step-body">' . esc_html( $body ) . '</p>';
				}

				$out .= '</div></li>';
			}

			return $out . '</ol></section>';
		}

		if ( 'taglist' === $type ) {
			$tags = array_filter( array_map( 'strval', (array) ( $s['tags'] ?? array() ) ) );

			if ( array() === $tags ) {
				return '';
			}

			$out = $open . '<ul class="gcalls-cp__tags">';

			foreach ( $tags as $t ) {
				$out .= '<li class="gcalls-cp__tag">' . esc_html( $t ) . '</li>';
			}

			return $out . '</ul></section>';
		}

		if ( 'comparison' === $type ) {
			$out = $open . '<div class="gcalls-cp__compare">';

			foreach ( array( 'before', 'after' ) as $side ) {
				$col = (array) ( $s[ $side ] ?? array() );
				$st  = array_filter( array_map( 'strval', (array) ( $col['steps'] ?? array() ) ) );

				if ( array() === $st ) {
					continue;
				}

				$out .= '<div class="gcalls-cp__compare-col gcalls-cp__compare-col--' . esc_attr( $side ) . '">';
				$out .= '<h3 class="gcalls-cp__compare-label">' . esc_html( (string) ( $col['label'] ?? '' ) ) . '</h3>';
				$out .= '<ol class="gcalls-cp__flow">';

				foreach ( $st as $one ) {
					$out .= '<li>' . esc_html( $one ) . '</li>';
				}

				$out .= '</ol></div>';
			}

			return $out . '</div></section>';
		}

		return '';
	}

	/**
	 * The FAQ block.
	 *
	 * No FAQ, no markup — and specifically no FAQ structured data, because
	 * schema describing questions a visitor cannot see is exactly what search
	 * engines penalise.
	 *
	 * @param array<string, mixed> $page Page entry.
	 * @return string
	 */
	private static function faq( array $page ): string {
		$faq = (array) ( $page['faq'] ?? array() );

		if ( array() === $faq ) {
			return '';
		}

		$out = '<section class="gcalls-cp__section gcalls-cp__faq">';
		$out .= '<h2 class="gcalls-cp__h2">' . esc_html__( 'Câu hỏi thường gặp', 'gcalls-core' ) . '</h2>';

		foreach ( $faq as $item ) {
			$item = (array) $item;
			$q    = (string) ( $item['q'] ?? '' );
			$a    = (string) ( $item['a'] ?? '' );

			if ( '' === $q || '' === $a ) {
				continue;
			}

			$out .= '<div class="gcalls-cp__faq-item">';
			$out .= '<h3 class="gcalls-cp__faq-q">' . esc_html( $q ) . '</h3>';
			$out .= '<p class="gcalls-cp__faq-a">' . esc_html( $a ) . '</p>';
			$out .= '</div>';
		}

		return $out . '</section>';
	}

	/**
	 * The closing CTA, carrying this route's own attribution.
	 *
	 * Built here rather than taken from the manifest so a page can never carry
	 * the header's generic `source=header` for a CTA that sits in its body.
	 *
	 * @param array<string, mixed> $page Page entry.
	 * @return string
	 */
	private static function cta( array $page ): string {
		$cta = (array) ( $page['cta'] ?? array() );

		if ( array() === $cta ) {
			return '';
		}

		$attribution = (array) ( $page['attribution'] ?? array() );
		$query       = array();

		foreach ( array( 'intent', 'source', 'product', 'solution' ) as $key ) {
			if ( ! empty( $attribution[ $key ] ) ) {
				$query[ $key ] = (string) $attribution[ $key ];
			}
		}

		$href = Shortcodes::LEAD_ROUTE;

		if ( array() !== $query ) {
			$href = add_query_arg( array_map( 'rawurlencode', $query ), $href );
		}

		$out = '<section class="gcalls-cp__section gcalls-cp__cta">';

		if ( ! empty( $cta['heading'] ) ) {
			$out .= '<h2 class="gcalls-cp__h2">' . esc_html( (string) $cta['heading'] ) . '</h2>';
		}

		if ( ! empty( $cta['body'] ) ) {
			$out .= '<p class="gcalls-cp__lead">' . esc_html( (string) $cta['body'] ) . '</p>';
		}

		$label = (string) ( $cta['label'] ?? '' );
		$label = '' !== $label ? $label : __( 'Đăng ký tư vấn', 'gcalls-core' );

		$out .= '<a class="gcalls-cp__btn" href="' . esc_url( home_url( $href ) ) . '">' . esc_html( $label ) . '</a>';

		return $out . '</section>';
	}

	/* ----------------------------------------------------------------- SEO */

	/**
	 * Rank Math title, for allowlisted slugs only.
	 *
	 * @param string $title Incoming title.
	 * @return string
	 */
	public static function seo_title( $title ): string {
		$page = self::seo_target();

		return $page && ! empty( $page['seo']['title'] ) ? (string) $page['seo']['title'] : (string) $title;
	}

	/**
	 * Rank Math description, for allowlisted slugs only.
	 *
	 * @param string $description Incoming description.
	 * @return string
	 */
	public static function seo_description( $description ): string {
		$page = self::seo_target();

		return $page && ! empty( $page['seo']['description'] )
			? (string) $page['seo']['description']
			: (string) $description;
	}

	/**
	 * The manifest entry for SEO filters.
	 *
	 * Deliberately does NOT require in_the_loop() — the SEO filters run in the
	 * document head, outside the loop — but keeps every other condition.
	 *
	 * @return array<string, mixed>|null
	 */
	private static function seo_target(): ?array {
		if ( is_admin() || ! is_singular( 'page' ) ) {
			return null;
		}

		$post = get_post();

		if ( ! $post instanceof \WP_Post || 'page' !== $post->post_type ) {
			return null;
		}

		if ( (int) get_option( 'page_on_front' ) === (int) $post->ID ) {
			return null;
		}

		$pages = self::manifest();

		return $pages[ $post->post_name ] ?? null;
	}
}
