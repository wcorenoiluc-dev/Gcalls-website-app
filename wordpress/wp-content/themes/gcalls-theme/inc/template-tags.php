<?php
/**
 * Template helpers.
 *
 * Every function here prints escaped output. Templates call these instead of
 * assembling markup inline, so escaping is decided once per piece of data
 * rather than once per template that happens to print it.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

/**
 * Prints the site branding: the custom logo if one is set, the site title
 * otherwise.
 *
 * The homepage gets an <h1> only when nothing else on the page would claim it;
 * on an inner page the site name is a link, not a heading, so the article title
 * stays the single h1.
 */
function gcalls_site_branding(): void {
	/*
	 * ALWAYS A PARAGRAPH, NEVER AN H1.
	 *
	 * The classic-theme convention is to promote the site name to h1 on the
	 * front page, on the reasoning that the front page has no other title. That
	 * reasoning does not hold here: the front page is an Elementor layout whose
	 * hero carries a real h1, so the convention produced TWO h1 elements — the
	 * word "Gcalls" and the page's actual subject — with the brand first. A
	 * screen-reader user asking what this page is about heard the company name.
	 * React renders the logo as a link, and that is the correct shape.
	 */
	$tag = 'p';

	echo '<' . esc_attr( $tag ) . ' class="gcalls-branding">';

	if ( has_custom_logo() ) {
		the_custom_logo();
	} else {
		/*
		 * The reference mark, not the site title.
		 *
		 * React's <Logo> is a 32px brand tile carrying a phone glyph, followed
		 * by the wordmark with "g" in ink and "calls" in brand. The port
		 * printed get_bloginfo('name') instead, which rendered as the single
		 * word "Gcalls" in one colour — recognisably not the same logo, on
		 * every page of the site.
		 *
		 * The glyph is inline SVG rather than an uploaded image on purpose: an
		 * attachment id would not survive a migration to another site, and this
		 * has to render identically on a fresh install with no media library.
		 * aria-label carries the accessible name, so the SVG is decorative.
		 */
		printf(
			'<a class="gcalls-branding__link" href="%1$s" rel="home" aria-label="%2$s">'
				. '<span class="gcalls-branding__mark" aria-hidden="true">'
				. '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" focusable="false">'
				. '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'
				. '</svg></span>'
				. '<span class="gcalls-branding__text">g<span>calls</span></span>'
				. '</a>',
			esc_url( home_url( '/' ) ),
			esc_attr__( 'Gcalls — về trang chủ', 'gcalls-theme' )
		);
	}

	echo '</' . esc_attr( $tag ) . '>';
}

/**
 * Prints the published/updated line for a post.
 *
 * Shows the updated date only when it is meaningfully later than the published
 * date — WordPress stores a modified date for every save, so an unconditional
 * "updated" line would mark a typo fix as new content.
 */
function gcalls_posted_on(): void {
	$published = (int) get_post_time( 'U', true );
	$modified  = (int) get_post_modified_time( 'U', true );

	printf(
		'<time class="gcalls-meta__date" datetime="%1$s">%2$s</time>',
		esc_attr( (string) get_the_date( DATE_W3C ) ),
		esc_html( (string) get_the_date() )
	);

	if ( $modified > $published + DAY_IN_SECONDS ) {
		printf(
			' <time class="gcalls-meta__updated" datetime="%1$s">%2$s</time>',
			esc_attr( (string) get_the_modified_date( DATE_W3C ) ),
			esc_html( sprintf( /* translators: %s: date the article was last updated. */ __( 'Cập nhật %s', 'gcalls-theme' ), get_the_modified_date() ) )
		);
	}
}

/**
 * Prints the taxonomy terms attached to a post.
 *
 * Prefers the Gcalls Core HUB taxonomy when the plugin is active, and falls
 * back to the built-in category so the template still says something useful
 * with the plugin switched off.
 */
function gcalls_post_terms(): void {
	$taxonomy = taxonomy_exists( 'gcalls_hub' ) ? 'gcalls_hub' : 'category';
	$terms    = get_the_terms( get_the_ID(), $taxonomy );

	if ( empty( $terms ) || is_wp_error( $terms ) ) {
		return;
	}

	echo '<ul class="gcalls-terms">';

	foreach ( $terms as $term ) {
		$link = get_term_link( $term );

		if ( is_wp_error( $link ) ) {
			continue;
		}

		printf(
			'<li class="gcalls-terms__item"><a href="%1$s">%2$s</a></li>',
			esc_url( $link ),
			esc_html( $term->name )
		);
	}

	echo '</ul>';
}

/**
 * Prints the featured image with the dimensions WordPress recorded.
 *
 * `post-thumbnail` carries width and height attributes, which is what stops the
 * page from reflowing as images arrive. The first image in the main query is
 * eager and high priority because it is the LCP candidate; everything after it
 * is lazy.
 *
 * @param string $size Registered image size.
 */
function gcalls_post_thumbnail( string $size = 'post-thumbnail' ): void {
	if ( post_password_required() || is_attachment() || ! has_post_thumbnail() ) {
		return;
	}

	static $rendered = 0;
	$is_first = ( 0 === $rendered );
	++$rendered;

	$attributes = $is_first
		? array(
			'loading'       => 'eager',
			'fetchpriority' => 'high',
			'decoding'      => 'async',
		)
		: array(
			'loading'  => 'lazy',
			'decoding' => 'async',
		);

	echo '<figure class="gcalls-thumbnail">';
	the_post_thumbnail( $size, $attributes );
	echo '</figure>';
}

/**
 * Prints the breadcrumb trail.
 *
 * Delegates to Gcalls Core when the plugin is active — the trail and its
 * structured data have to agree, and the plugin owns both. Prints nothing at
 * all when the plugin is absent, which is correct: a breadcrumb that disagrees
 * with the schema is worse than no breadcrumb.
 */
function gcalls_breadcrumbs(): void {
	if ( function_exists( 'gcalls_core_breadcrumbs' ) ) {
		gcalls_core_breadcrumbs();
	}
}

/**
 * Prints numbered pagination for archive templates.
 */
function gcalls_pagination(): void {
	the_posts_pagination(
		array(
			'mid_size'           => 2,
			'prev_text'          => esc_html__( 'Trang trước', 'gcalls-theme' ),
			'next_text'          => esc_html__( 'Trang sau', 'gcalls-theme' ),
			'screen_reader_text' => esc_html__( 'Điều hướng trang', 'gcalls-theme' ),
			'aria_label'         => esc_html__( 'Trang', 'gcalls-theme' ),
		)
	);
}

/**
 * Renders the footer navigation as one column per top-level item.
 *
 * WHY NOT wp_nav_menu()
 * `wp_nav_menu( depth 2 )` renders the five column titles as top-level LINKS
 * with their children nested underneath. React renders each column as its own
 * landmark with an `<h2>` title that is not a link — and that difference is not
 * cosmetic: it is five headings per page, on every page, that a screen-reader
 * user navigating by heading gets in one build and not the other. It is also
 * why the footer read as one long list of ten links on a phone instead of five
 * labelled groups.
 *
 * A walker could do it, but a walker that has to close one landmark and open
 * another between siblings is harder to read than the tree it renders. The menu
 * is five items deep by two; fetching it and rendering it is clearer.
 */
function gcalls_footer_columns(): void {
	$location = 'footer-nav';
	$locations = get_nav_menu_locations();

	if ( empty( $locations[ $location ] ) ) {
		return;
	}

	$items = wp_get_nav_menu_items( (int) $locations[ $location ] );

	if ( ! is_array( $items ) || array() === $items ) {
		return;
	}

	$children = array();

	foreach ( $items as $item ) {
		$parent = (int) $item->menu_item_parent;

		if ( 0 !== $parent ) {
			$children[ $parent ][] = $item;
		}
	}

	foreach ( $items as $item ) {
		if ( 0 !== (int) $item->menu_item_parent ) {
			continue;
		}

		$column = $children[ (int) $item->ID ] ?? array();

		// A column title with nothing under it is a link, not a heading. That
		// happens when the menu is edited by hand, and rendering an empty
		// group would leave a heading pointing at nothing.
		if ( array() === $column ) {
			continue;
		}

		printf(
			'<nav class="gcalls-footer__column" aria-label="%s">',
			esc_attr( (string) $item->title )
		);
		printf(
			'<h2 class="gcalls-footer__column-title">%s</h2>',
			esc_html( (string) $item->title )
		);
		echo '<ul class="gcalls-footer__list">';

		foreach ( $column as $child ) {
			printf(
				'<li><a href="%s">%s</a></li>',
				esc_url( (string) $child->url ),
				esc_html( (string) $child->title )
			);
		}

		echo '</ul></nav>';
	}
}

/**
 * The thirteen canonical HUB slugs, each with the hue and glyph its cover uses.
 *
 * Kept here rather than read from the plugin because this has to keep working
 * when the plugin is not active — a theme that fatals without a plugin cannot
 * be handed over. If a slug is not in this list the generic cover is used, so
 * a fourteenth hub degrades rather than breaks.
 *
 * The glyphs are lucide paths (ISC), the same set the product mockups draw
 * from, so the blog and the product pages are drawn in one hand.
 *
 * @return array<string, array{hue: int, glyph: string}>
 */
function gcalls_hub_cover_styles(): array {
	return array(
		'tong-dai-va-call-center'                 => array( 'hue' => 262, 'glyph' => 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' ),
		'gcalls-plus-webphone'                    => array( 'hue' => 258, 'glyph' => 'M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01' ),
		'crm-helpdesk-va-tich-hop'                => array( 'hue' => 272, 'glyph' => 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' ),
		'telesales-va-sales-operations'           => array( 'hue' => 250, 'glyph' => 'M3 3v16a2 2 0 0 0 2 2h16M18 17V9M13 17V5M8 17v-3' ),
		'customer-service-va-customer-experience' => array( 'hue' => 200, 'glyph' => 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' ),
		'gcalls-cx'                               => array( 'hue' => 210, 'glyph' => 'M4 4h16v12H5.17L4 17.17V4zM8 9h8M8 12h5' ),
		'qa-qc-va-quan-tri-chat-luong'            => array( 'hue' => 160, 'glyph' => 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1zM9 12l2 2 4-4' ),
		'voicebot-ai-va-tu-dong-hoa'              => array( 'hue' => 285, 'glyph' => 'M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v1a7 7 0 0 1-14 0v-1M12 18v4' ),
		'tong-dai-quoc-te'                        => array( 'hue' => 190, 'glyph' => 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' ),
		'cloud-call-center-va-lam-viec-tu-xa'     => array( 'hue' => 220, 'glyph' => 'M17.5 19a4.5 4.5 0 1 0 0-9 6 6 0 0 0-11.6-1.5A4 4 0 0 0 6.5 19z' ),
		'van-hanh-doanh-nghiep'                   => array( 'hue' => 240, 'glyph' => 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6' ),
		'huong-dan-su-dung-gcalls'                => array( 'hue' => 280, 'glyph' => 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' ),
		'case-study'                              => array( 'hue' => 175, 'glyph' => 'M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM9 7V5h6v2' ),
	);
}

/**
 * Prints a cover for the current post.
 *
 * WHY THIS IS DRAWN AND NOT AN UPLOADED IMAGE
 * The audit is unambiguous: not one of the 250 articles has a featured image,
 * and every inline image is hotlinked to a host this site does not control —
 * 169 to gcalls.co, which is production and off limits, and 87 to
 * cdn.gcalls.co / cdn.cdn.gcalls.co, neither of which resolves at all. So
 * there is no existing asset to fall back to for any article.
 *
 * The alternative was generating 250 images and uploading them, which means
 * 250 attachment rows, 250 files, and a media library nobody asked for, to
 * illustrate articles whose real artwork is still to come. This draws the
 * cover instead: one gradient and one glyph per HUB, resolved at render time,
 * writing nothing. When real artwork arrives, setting a featured image is all
 * it takes — step 1 below wins and this never runs for that post.
 *
 * Resolution order, first match wins:
 *   1. A featured image on the post.
 *   2. A manifest image, if one is ever mapped for this post.
 *   3. The cover for the post's HUB.
 *   4. The generic Gcalls cover.
 *
 * @param string $size Image size to use when a real image is available.
 */
function gcalls_post_cover( string $size = 'medium_large' ): void {
	/* 1 — a real featured image always wins. */
	if ( has_post_thumbnail() ) {
		gcalls_post_thumbnail( $size );
		return;
	}

	/*
	 * 2 — a manifest image, if one is ever mapped to this post. No article
	 * carries this today; the filter is the seam that lets the media pipeline
	 * supply one later without touching this function or any post body.
	 */
	$manifest = apply_filters( 'gcalls_post_cover_image', '', get_the_ID() );

	if ( is_string( $manifest ) && '' !== $manifest ) {
		printf(
			'<img class="gcalls-cover__img" src="%1$s" alt="%2$s" loading="lazy" decoding="async">',
			esc_url( $manifest ),
			esc_attr( get_the_title() )
		);
		return;
	}

	/* 3 and 4 — the drawn cover, keyed on the HUB when there is one. */
	$styles = gcalls_hub_cover_styles();
	$hub    = null;

	if ( taxonomy_exists( 'gcalls_hub' ) ) {
		$terms = get_the_terms( get_the_ID(), 'gcalls_hub' );

		if ( is_array( $terms ) && array() !== $terms ) {
			$hub = $terms[0];
		}
	}

	$slug  = $hub instanceof WP_Term ? $hub->slug : '';
	$style = $styles[ $slug ] ?? array( 'hue' => 262, 'glyph' => $styles['tong-dai-va-call-center']['glyph'] );

	$label = $hub instanceof WP_Term
		? $hub->name
		: __( 'Gcalls', 'gcalls-theme' );

	/*
	 * role="img" with a label naming the topic. The cover carries no
	 * information the title does not, so the accessible name says what it is —
	 * an illustration for this hub — rather than repeating the headline that
	 * sits directly beneath it.
	 */
	printf(
		'<span class="gcalls-cover" style="--gcalls-cover-hue:%1$d" role="img" aria-label="%2$s">',
		(int) $style['hue'],
		/* translators: %s: hub name. */
		esc_attr( sprintf( __( 'Ảnh minh họa chủ đề %s', 'gcalls-theme' ), $label ) )
	);

	echo '<svg class="gcalls-cover__glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" '
		. 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'
		. '<path d="' . esc_attr( $style['glyph'] ) . '"/></svg>';

	echo '<span class="gcalls-cover__label">' . esc_html( $label ) . '</span>';
	echo '</span>';
}

/**
 * Splits rendered article HTML into a table of contents and a body with anchors.
 *
 * THE CONTENT IS FILTERED EXACTLY ONCE
 * single.php captures one the_content() call and hands the result here. This
 * function never filters, never runs a shortcode and never touches the post
 * row — it is given HTML and returns HTML. That is what stops a second filter
 * pass from rendering every shortcode twice, which on these articles would
 * mean two CTAs and two FAQ blocks on the page.
 *
 * WHY THE IDS ARE ADDED TO THE OUTPUT
 * The obvious implementation writes anchor ids into post_content once. That
 * edits the article, and the eighteen published articles are being edited by a
 * person right now — their bodies and modified dates must not move. So the ids
 * are added to the rendered output and the post row is untouched. Turn this
 * off and the articles are byte-identical to what the editor saved.
 *
 * WHY DOM AND NOT A REGULAR EXPRESSION
 * A heading is not always `<h2>text</h2>`. It carries `<strong>`, `<em>`,
 * links and entities, its attributes can contain a `>` inside a quoted value,
 * and legacy imported bodies are not well-formed. A pattern that copes with
 * all of that is a parser written badly, so this uses the one PHP ships.
 * libxml is told to swallow the errors malformed legacy markup produces rather
 * than warn on the page.
 *
 * A heading that already carries an id keeps it: someone may have shared that
 * link. Duplicate slugs get a numeric suffix, so ids stay unique and stable
 * for a given body.
 *
 * @param string $html    Rendered post content. Already filtered.
 * @param int    $minimum Headings required before a contents list is worth it.
 * @return array{toc: string, body: string}
 */
function gcalls_article_contents( string $html, int $minimum = 3 ): array {
	$plain = array(
		'toc'  => '',
		'body' => $html,
	);

	if ( '' === trim( $html ) ) {
		return $plain;
	}

	if ( ! class_exists( 'DOMDocument' ) ) {
		return gcalls_article_contents_fallback( $html, $minimum );
	}

	$document = new DOMDocument();

	/*
	 * The meta charset is what makes DOMDocument read this as UTF-8; without
	 * it every Vietnamese heading comes back mojibake. The wrapper div gives a
	 * single node to serialise back from, so the html/body elements libxml
	 * inserts do not end up in the output.
	 */
	$previous = libxml_use_internal_errors( true );
	$loaded   = $document->loadHTML(
		'<?xml encoding="UTF-8"><!DOCTYPE html><html><body><div id="gcalls-root">' . $html . '</div></body></html>',
		LIBXML_HTML_NODEFDTD | LIBXML_HTML_NOIMPLIED
	);
	libxml_clear_errors();
	libxml_use_internal_errors( $previous );

	if ( ! $loaded ) {
		return gcalls_article_contents_fallback( $html, $minimum );
	}

	$root = $document->getElementById( 'gcalls-root' );

	if ( ! $root instanceof DOMElement ) {
		return gcalls_article_contents_fallback( $html, $minimum );
	}

	$entries = array();
	$used    = array();

	$headings = array();

	foreach ( $root->getElementsByTagName( '*' ) as $node ) {
		$tag = strtolower( $node->nodeName );

		if ( 'h2' === $tag || 'h3' === $tag ) {
			$headings[] = $node;
		}
	}

	foreach ( $headings as $node ) {
		$text = trim( (string) $node->textContent );

		if ( '' === $text ) {
			continue;
		}

		$id = $node->getAttribute( 'id' );

		if ( '' === $id ) {
			$id = sanitize_title( $text );
			$id = '' === $id ? 'muc' : $id;

			$base = $id;
			$n    = 2;

			while ( in_array( $id, $used, true ) ) {
				$id = $base . '-' . $n;
				++$n;
			}

			$node->setAttribute( 'id', $id );
		}

		$used[]    = $id;
		$entries[] = array(
			'id'    => $id,
			'text'  => $text,
			'level' => 'h3' === strtolower( $node->nodeName ) ? 3 : 2,
		);
	}

	if ( count( $entries ) < $minimum ) {
		return $plain;
	}

	/* Serialise the wrapper's children, so the wrapper itself is not output. */
	$body = '';

	foreach ( $root->childNodes as $child ) {
		$body .= (string) $document->saveHTML( $child );
	}

	return array(
		'toc'  => gcalls_article_toc_markup( $entries ),
		'body' => $body,
	);
}

/**
 * Builds the contents list markup.
 *
 * @param array<int, array{id: string, text: string, level: int}> $entries Headings.
 */
function gcalls_article_toc_markup( array $entries ): string {
	$toc = '<nav class="gcalls-toc" aria-labelledby="gcalls-toc-title">'
		. '<p class="gcalls-toc__title" id="gcalls-toc-title">'
		. esc_html__( 'Nội dung bài viết', 'gcalls-theme' ) . '</p><ol>';

	foreach ( $entries as $entry ) {
		$toc .= '<li class="' . ( 3 === $entry['level'] ? 'li--sub' : '' ) . '">'
			. '<a href="#' . esc_attr( $entry['id'] ) . '">' . esc_html( $entry['text'] ) . '</a></li>';
	}

	return $toc . '</ol></nav>';
}

/**
 * Contents list without DOMDocument.
 *
 * ext-dom is enabled on essentially every WordPress host, so this exists for
 * the one that is not rather than as the main path. It is deliberately
 * conservative: it only recognises a heading whose attributes contain no `>`,
 * and if anything about a heading looks unusual it leaves that heading
 * untouched rather than rewriting markup it did not fully understand. The body
 * is returned with anchors added and nothing else changed — a fallback that
 * mangles the article is worse than a page with no contents list.
 *
 * @param string $html    Rendered post content.
 * @param int    $minimum Headings required.
 * @return array{toc: string, body: string}
 */
function gcalls_article_contents_fallback( string $html, int $minimum = 3 ): array {
	$entries = array();
	$used    = array();

	$body = (string) preg_replace_callback(
		'#<(h[23])((?:\s+[a-zA-Z-]+="[^"]*")*)\s*>(.*?)</\1\s*>#is',
		static function ( array $match ) use ( &$entries, &$used ): string {
			list( , $tag, $attributes, $inner ) = $match;

			$text = trim( wp_strip_all_tags( $inner ) );

			if ( '' === $text ) {
				return $match[0];
			}

			if ( preg_match( '/\bid="([^"]*)"/i', $attributes, $found ) && '' !== $found[1] ) {
				$id = $found[1];
			} else {
				$id   = sanitize_title( $text );
				$id   = '' === $id ? 'muc' : $id;
				$base = $id;
				$n    = 2;

				while ( in_array( $id, $used, true ) ) {
					$id = $base . '-' . $n;
					++$n;
				}

				$attributes .= ' id="' . esc_attr( $id ) . '"';
			}

			$used[]    = $id;
			$entries[] = array(
				'id'    => $id,
				'text'  => $text,
				'level' => 'h3' === strtolower( $tag ) ? 3 : 2,
			);

			return '<' . $tag . $attributes . '>' . $inner . '</' . $tag . '>';
		},
		$html
	);

	if ( count( $entries ) < $minimum || null === $body ) {
		return array(
			'toc'  => '',
			'body' => $html,
		);
	}

	return array(
		'toc'  => gcalls_article_toc_markup( $entries ),
		'body' => $body,
	);
}

/**
 * Whether an article already carries its own call to action.
 *
 * 238 of the 250 articles have no CTA, and the answer to that is a renderer
 * that adds one — not an edit to 238 bodies. But twelve articles DO have one,
 * and appending a second would give those a page that asks twice. This looks
 * at the rendered body and reports what is there.
 *
 * A link to the contact page is the signal, whether it arrived as a shortcode
 * or was typed by an editor: both are the reader being asked to get in touch.
 *
 * @param string $html Rendered article body.
 */
function gcalls_article_has_cta( string $html ): bool {
	if ( false !== strpos( $html, 'gcalls-cta' ) ) {
		return true;
	}

	return (bool) preg_match( '#href="[^"]*/lien-he/#i', $html );
}

/**
 * Related articles for the current post.
 *
 * Same hub first, newest first, and topped up with recent articles when the
 * hub cannot supply enough — four of the thirteen hubs hold two articles or
 * fewer, so "same hub only" would leave those pages with one suggestion or
 * none.
 *
 * Two queries at most, never one per post: the top-up is a second bounded
 * query with the already-chosen ids excluded, not a loop.
 *
 * Published posts only, and `post_status` is stated rather than left to
 * default — a logged-in editor's default query would otherwise surface their
 * own drafts to them and make the page look different to different people.
 *
 * @param int $limit How many to return.
 * @return array<int, WP_Post>
 */
function gcalls_related_articles( int $limit = 3 ): array {
	$current = (int) get_the_ID();
	$exclude = array( $current );
	$found   = array();

	$terms = taxonomy_exists( 'gcalls_hub' ) ? get_the_terms( $current, 'gcalls_hub' ) : array();

	$common = array(
		'post_type'              => 'post',
		'post_status'            => 'publish',
		'ignore_sticky_posts'    => true,
		'no_found_rows'          => true,
		'update_post_meta_cache' => false,
		'orderby'                => 'date',
		'order'                  => 'DESC',
	);

	if ( is_array( $terms ) && isset( $terms[0] ) ) {
		$in_hub = get_posts(
			$common + array(
				'numberposts' => $limit,
				'exclude'     => $exclude,
				'tax_query'   => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- Bounded by $limit, one term.
					array(
						'taxonomy' => 'gcalls_hub',
						'field'    => 'term_id',
						'terms'    => $terms[0]->term_id,
					),
				),
			)
		);

		foreach ( $in_hub as $post ) {
			$found[]   = $post;
			$exclude[] = (int) $post->ID;
		}
	}

	if ( count( $found ) >= $limit ) {
		return $found;
	}

	/* Top up. One more query, not one per missing slot. */
	$recent = get_posts(
		$common + array(
			'numberposts' => $limit - count( $found ),
			'exclude'     => $exclude,
		)
	);

	return array_merge( $found, $recent );
}
