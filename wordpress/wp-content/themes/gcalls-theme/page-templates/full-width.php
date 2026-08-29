<?php
/**
 * Template Name: Toàn chiều rộng (Elementor)
 * Template Post Type: page
 *
 * Full-bleed page: theme header and footer stay, the content container does
 * not. This is the template a section-based Elementor layout wants.
 *
 * It differs from Elementor's own "Elementor Full Width" in keeping the theme
 * navigation, and from "Elementor Canvas" in keeping both header and footer.
 * A page using this template still renders correctly with Elementor
 * deactivated — it just renders the stored block/HTML content instead.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

get_header();

while ( have_posts() ) :
	the_post();
	?>
	<article id="post-<?php the_ID(); ?>" <?php post_class( 'gcalls-page gcalls-page--full-width' ); ?>>
		<?php
		/*
		 * A TITLE ONLY IF THE CONTENT DOES NOT ALREADY CARRY ONE.
		 *
		 * This template printed no title at all, on the reasoning that an
		 * Elementor layout supplies its own. Most do — but the four product
		 * pages and /uoc-tinh-chi-phi/ are shortcodes, not Elementor, and every
		 * one of them shipped with NO h1: nothing telling a search engine, or
		 * someone asking a screen reader, what the page is.
		 *
		 * Printing one unconditionally is the opposite mistake: the home page's
		 * hero has an h1 and a second one above it would be worse than none.
		 * So the content is rendered first and asked. Shortcodes have run by
		 * then, which is the only point at which the question can be answered.
		 */
		ob_start();
		the_content();
		$gcalls_content = (string) ob_get_clean();

		if ( false === stripos( $gcalls_content, '<h1' ) ) {
			echo '<div class="gcalls-container"><h1 class="gcalls-page__title">' . esc_html( get_the_title() ) . '</h1></div>';
		}

		// gcalls-qa: raw output — the_content() is already filtered, and
		// wp_kses_post() would strip the data attributes Elementor renders with.
		echo $gcalls_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		?>
	</article>
	<?php
endwhile;

get_footer();
