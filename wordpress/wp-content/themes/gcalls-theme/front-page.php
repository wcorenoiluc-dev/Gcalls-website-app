<?php
/**
 * Homepage.
 *
 * The site is configured with a static front page (Settings > Reading), so this
 * template renders a Page, not the posts loop. It is deliberately thin: the
 * homepage layout is built in Elementor and stored with the page, which is what
 * lets a non-developer change it after handover.
 *
 * If someone ever switches Settings > Reading back to "Your latest posts",
 * WordPress ignores front-page.php in favour of home.php, so that case is
 * handled too — by a different file, correctly.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

get_header();

while ( have_posts() ) :
	the_post();

	if ( gcalls_is_elementor_page() ) :
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class( 'gcalls-page gcalls-page--elementor' ); ?>>
			<?php the_content(); ?>
		</article>
		<?php
	else :
		?>
		<div class="gcalls-container gcalls-stack">
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'gcalls-page' ); ?>>
				<header class="gcalls-page-header">
					<?php the_title( '<h1 class="gcalls-page-header__title">', '</h1>' ); ?>
				</header>

				<div class="gcalls-prose">
					<?php the_content(); ?>
				</div>
			</article>
		</div>
		<?php
	endif;

endwhile;

get_footer();
