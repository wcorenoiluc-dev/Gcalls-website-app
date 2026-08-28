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

			<?php
			/**
			 * The FAQ block.
			 *
			 * Rendered by gcalls-core from `_gcalls_faq`, which is the same meta
			 * that produces the FAQPage JSON-LD. Marking these up again in the
			 * post body would put the questions on the page twice and give the
			 * structured data a second, disagreeing source.
			 *
			 * Guarded because the theme has to render with the plugin switched
			 * off — that is the whole reason the two are separate.
			 */
			if ( function_exists( 'gcalls_core_faq' ) ) {
				gcalls_core_faq();
			}
			?>

			<?php
			/**
			 * The ask, then where to read next.
			 *
			 * An article that ends at its last paragraph gives the reader
			 * nowhere to go: the eighteen were commissioned as hub content, so
			 * the next article in the same hub is the most useful thing on the
			 * page after the body. The CTA carries the hub in `source`, which is
			 * what makes it possible to tell later which topic actually converts.
			 */
			if ( shortcode_exists( 'gcalls_cta' ) ) {
				$gcalls_hub_terms = get_the_terms( get_the_ID(), 'gcalls_hub' );
				$gcalls_hub_slug  = ( is_array( $gcalls_hub_terms ) && isset( $gcalls_hub_terms[0] ) )
					? $gcalls_hub_terms[0]->slug
					: 'blog';

				echo do_shortcode(
					sprintf(
						'[gcalls_cta label="Đăng ký tư vấn" intent="consultation" source="blog-%s" note="Gcalls trao đổi về quy mô và hệ thống đang dùng trước khi đề xuất cấu hình."]',
						esc_attr( $gcalls_hub_slug )
					)
				);
			}

			if ( is_array( $gcalls_hub_terms ?? null ) && isset( $gcalls_hub_terms[0] ) ) :
				$gcalls_related = new WP_Query(
					array(
						'post_type'              => 'post',
						'post_status'            => 'publish',
						'posts_per_page'         => 3,
						'post__not_in'           => array( get_the_ID() ),
						'ignore_sticky_posts'    => true,
						'no_found_rows'          => true,
						'update_post_meta_cache' => false,
						'tax_query'              => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- Three posts, one term.
							array(
								'taxonomy' => 'gcalls_hub',
								'field'    => 'term_id',
								'terms'    => $gcalls_hub_terms[0]->term_id,
							),
						),
					)
				);

				if ( $gcalls_related->have_posts() ) :
					?>
					<section class="gcalls-related">
						<h2 class="gcalls-related__title">
							<?php
							printf(
								/* translators: %s: hub name. */
								esc_html__( 'Đọc tiếp trong %s', 'gcalls-theme' ),
								esc_html( $gcalls_hub_terms[0]->name )
							);
							?>
						</h2>
						<div class="gcalls-cards">
							<?php
							while ( $gcalls_related->have_posts() ) :
								$gcalls_related->the_post();
								get_template_part( 'template-parts/content', 'card' );
							endwhile;
							?>
						</div>
					</section>
					<?php
				endif;

				wp_reset_postdata();
			endif;
			?>

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
