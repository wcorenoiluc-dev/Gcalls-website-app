<?php
/**
 * Blog posts index — the page assigned as "Posts page" in Settings > Reading.
 *
 * Separate from index.php because this view has a title and an intro that the
 * generic fallback must not assume exists.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

get_header();

$posts_page_id = (int) get_option( 'page_for_posts' );
?>

<div class="gcalls-container gcalls-stack">
	<?php gcalls_breadcrumbs(); ?>

	<header class="gcalls-page-header">
		<h1 class="gcalls-page-header__title">
			<?php echo $posts_page_id ? esc_html( get_the_title( $posts_page_id ) ) : esc_html__( 'Blog', 'gcalls-theme' ); ?>
		</h1>

		<?php
		// The posts page cannot use the_content() inside the loop — the loop
		// holds posts, not the page — so its intro is fetched explicitly.
		if ( $posts_page_id ) :
			$intro = get_post_field( 'post_content', $posts_page_id );

			if ( '' !== trim( (string) $intro ) ) :
				?>
				<div class="gcalls-page-header__intro">
					<?php echo wp_kses_post( apply_filters( 'the_content', $intro ) ); ?>
				</div>
				<?php
			endif;
		endif;
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
