<?php
/**
 * Search results.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

get_header();
?>

<div class="gcalls-container gcalls-stack">
	<header class="gcalls-page-header">
		<h1 class="gcalls-page-header__title">
			<?php
			printf(
				/* translators: %s: the search term. */
				esc_html__( 'Kết quả cho “%s”', 'gcalls-theme' ),
				esc_html( get_search_query() )
			);
			?>
		</h1>
		<?php get_search_form(); ?>
	</header>

	<?php if ( have_posts() ) : ?>
		<div class="gcalls-cards">
			<?php
			while ( have_posts() ) :
				the_post();
				get_template_part( 'template-parts/content', 'card' );
			endwhile;
			?>
		</div>

		<?php gcalls_pagination(); ?>
	<?php else : ?>
		<?php get_template_part( 'template-parts/content', 'none' ); ?>
	<?php endif; ?>
</div>

<?php
get_footer();
