<?php
/**
 * Single blog article.
 *
 * Posts are written in the block editor, never in Elementor — see
 * inc/elementor.php for why — so this template always renders the prose
 * container.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

get_header();

while ( have_posts() ) :
	the_post();
	?>

	<div class="gcalls-container gcalls-stack">
		<?php gcalls_breadcrumbs(); ?>

		<article id="post-<?php the_ID(); ?>" <?php post_class( 'gcalls-article' ); ?>>
			<header class="gcalls-page-header">
				<?php gcalls_post_terms(); ?>

				<?php the_title( '<h1 class="gcalls-page-header__title">', '</h1>' ); ?>

				<p class="gcalls-meta">
					<?php gcalls_posted_on(); ?>
				</p>
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

			<footer class="gcalls-article__footer">
				<?php
				the_post_navigation(
					array(
						'prev_text' => '<span class="gcalls-post-nav__label">' . esc_html__( 'Bài trước', 'gcalls-theme' ) . '</span> <span class="gcalls-post-nav__title">%title</span>',
						'next_text' => '<span class="gcalls-post-nav__label">' . esc_html__( 'Bài sau', 'gcalls-theme' ) . '</span> <span class="gcalls-post-nav__title">%title</span>',
					)
				);
				?>
			</footer>
		</article>
	</div>

	<?php
	if ( comments_open() || get_comments_number() ) {
		?>
		<div class="gcalls-container">
			<?php comments_template(); ?>
		</div>
		<?php
	}

endwhile;

get_footer();
