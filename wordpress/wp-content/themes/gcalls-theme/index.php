<?php
/**
 * Fallback template.
 *
 * WordPress falls back to this file whenever no more specific template exists.
 * Every view in this theme has one, so reaching index.php means a new view was
 * added without a template — it must therefore still render something correct
 * rather than a blank page.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

get_header();
?>

<div class="gcalls-container gcalls-stack">
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
