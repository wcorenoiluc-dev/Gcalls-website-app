<?php
/**
 * Default page template.
 *
 * Handles both kinds of page in this site:
 *
 *   - a page written in the block editor, which gets the prose container and a
 *     rendered page title;
 *   - a page built in Elementor, which gets neither. Elementor sections manage
 *     their own width and usually carry their own headline, so wrapping them in
 *     a 1280px container would clip every full-bleed section and printing
 *     the_title() above them would duplicate the hero heading.
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
			<?php gcalls_breadcrumbs(); ?>

			<article id="post-<?php the_ID(); ?>" <?php post_class( 'gcalls-page' ); ?>>
				<header class="gcalls-page-header">
					<?php the_title( '<h1 class="gcalls-page-header__title">', '</h1>' ); ?>
				</header>

				<?php gcalls_post_thumbnail( 'large' ); ?>

				<div class="gcalls-prose">
					<?php
					the_content();

					wp_link_pages(
						array(
							'before' => '<nav class="gcalls-page-links">',
							'after'  => '</nav>',
						)
					);
					?>
				</div>
			</article>
		</div>
		<?php
	endif;

endwhile;

get_footer();
