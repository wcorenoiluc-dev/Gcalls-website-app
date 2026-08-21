<?php
/**
 * Category, tag, HUB, date and author archives.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

get_header();
?>

<div class="gcalls-container gcalls-stack">
	<?php gcalls_breadcrumbs(); ?>

	<header class="gcalls-page-header">
		<?php
		the_archive_title( '<h1 class="gcalls-page-header__title">', '</h1>' );
		the_archive_description( '<div class="gcalls-page-header__intro">', '</div>' );
		?>
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
