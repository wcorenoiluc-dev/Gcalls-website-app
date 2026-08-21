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
		<?php the_content(); ?>
	</article>
	<?php
endwhile;

get_footer();
