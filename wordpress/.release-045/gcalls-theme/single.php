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

			<?php
			/*
			 * Every article gets a cover. None of the 250 has a featured image
			 * and every inline image is hotlinked to a host this site does not
			 * control, so gcalls_post_thumbnail() rendered nothing at all here
			 * — the article opened on a wall of text. gcalls_post_cover() draws
			 * one from the HUB and steps aside as soon as a real image exists.
			 */
			?>
			<figure class="gcalls-article__cover">
				<?php gcalls_post_cover( 'large' ); ?>
			</figure>

			<?php
			/*
			 * The contents list is built from the rendered HTML, not written
			 * into the article. The eighteen published bodies are being edited
			 * by a person and their hashes must not move, so nothing here
			 * touches post_content — the anchors are added to the output.
			 *
			 * the_content() is captured rather than echoed for that reason.
			 * The result is already filtered, so it is printed as-is;
			 * wp_kses_post() here would strip the attributes blocks render with.
			 */
			ob_start();
			the_content();
			$gcalls_rendered = (string) ob_get_clean();

			$gcalls_article = gcalls_article_contents( $gcalls_rendered );

			echo $gcalls_article['toc']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built from esc_html/esc_attr above.
			?>

			<div class="gcalls-prose gcalls-article__body">
				<?php
				// gcalls-qa: raw output — the_content() output, already filtered;
				// escaping it again strips block and Elementor attributes.
				echo $gcalls_article['body'];

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
			$gcalls_hub_terms = get_the_terms( get_the_ID(), 'gcalls_hub' );

			/*
			 * The CTA is added at render time, never written into a body — 238
			 * of the 250 articles have none, and editing 238 posts to fix that
			 * would move hashes on articles somebody is still working on.
			 *
			 * Twelve articles DO already ask the reader to get in touch, and
			 * appending to those would ask twice on one page. So the rendered
			 * body is checked first and the runtime CTA stands down when the
			 * article brought its own.
			 */
			if ( shortcode_exists( 'gcalls_cta' ) && ! gcalls_article_has_cta( $gcalls_article['body'] ) ) {
				$gcalls_hub_slug = ( is_array( $gcalls_hub_terms ) && isset( $gcalls_hub_terms[0] ) )
					? $gcalls_hub_terms[0]->slug
					: 'blog';

				echo do_shortcode(
					sprintf(
						'[gcalls_cta label="Đăng ký tư vấn" intent="consultation" source="blog-%s" note="Gcalls trao đổi về quy mô và hệ thống đang dùng trước khi đề xuất cấu hình."]',
						esc_attr( $gcalls_hub_slug )
					)
				);
			}

			/*
			 * Related reading. Same hub first, topped up with recent articles
			 * when the hub is thin — four of the thirteen hold two articles or
			 * fewer, and "same hub only" left those pages suggesting nothing.
			 */
			$gcalls_related = gcalls_related_articles( 3 );

			if ( array() !== $gcalls_related ) :
				$gcalls_related_heading = ( is_array( $gcalls_hub_terms ) && isset( $gcalls_hub_terms[0] ) )
					/* translators: %s: hub name. */
					? sprintf( __( 'Đọc tiếp trong %s', 'gcalls-theme' ), $gcalls_hub_terms[0]->name )
					: __( 'Bài viết mới nhất', 'gcalls-theme' );
				?>
				<section class="gcalls-related">
					<h2 class="gcalls-related__title"><?php echo esc_html( $gcalls_related_heading ); ?></h2>
					<div class="gcalls-cards">
						<?php
						global $post;
						$gcalls_saved_post = $post;

						foreach ( $gcalls_related as $post ) {
							setup_postdata( $post );
							get_template_part( 'template-parts/content', 'card' );
						}

						$post = $gcalls_saved_post;
						wp_reset_postdata();
						?>
					</div>
				</section>
				<?php
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
