<?php
/**
 * Blog posts index — the page assigned as "Posts page" in Settings > Reading.
 *
 * Separate from index.php because this view has a title and an intro that the
 * generic fallback must not assume exists.
 *
 * GROUPED BY HUB, NOT PAGINATED BY DATE
 * The default loop would show ten of the eighteen articles in publication order
 * and put the rest on page two. That is the wrong shape for this archive: the
 * eighteen were commissioned as seven topic hubs, a reader arrives wanting one
 * of those topics, and "page 2" is where articles go to be unread. Grouping by
 * `gcalls_hub` shows every article, in its editorial context, on one screen.
 *
 * The grouped view needs gcalls-core for the taxonomy. Without the plugin the
 * template falls back to the ordinary paginated loop, because a theme that
 * white-screens when a plugin is deactivated is a theme that cannot be handed
 * over.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

get_header();

$posts_page_id = (int) get_option( 'page_for_posts' );
$hub_taxonomy  = 'gcalls_hub';
$grouped       = taxonomy_exists( $hub_taxonomy ) && ! is_paged();
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

	<?php if ( $grouped ) : ?>
		<?php
		$hub_terms = get_terms(
			array(
				'taxonomy'   => $hub_taxonomy,
				'hide_empty' => true,
			)
		);

		$rendered = 0;

		if ( ! is_wp_error( $hub_terms ) && array() !== $hub_terms ) :
			?>
			<nav class="gcalls-hub-index" aria-label="<?php esc_attr_e( 'Danh mục bài viết', 'gcalls-theme' ); ?>">
				<ul class="gcalls-hub-index__list">
					<?php foreach ( $hub_terms as $term ) : ?>
						<li>
							<a href="#hub-<?php echo esc_attr( $term->slug ); ?>">
								<?php echo esc_html( $term->name ); ?>
								<span class="gcalls-hub-index__count"><?php echo esc_html( (string) $term->count ); ?></span>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			</nav>

			<?php foreach ( $hub_terms as $term ) : ?>
				<?php
				// One bounded query per hub. `posts_per_page => -1` is safe here
				// and only here: the archive is eighteen articles by design, and
				// the count is asserted by wordpress/scripts/qa-foundation.mjs.
				$hub_query = new WP_Query(
					array(
						'post_type'              => 'post',
						'post_status'            => 'publish',
						'posts_per_page'         => -1,
						'ignore_sticky_posts'    => true,
						'no_found_rows'          => true,
						'update_post_meta_cache' => false,
						'tax_query'              => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- Bounded archive, seven terms.
							array(
								'taxonomy' => $hub_taxonomy,
								'field'    => 'term_id',
								'terms'    => $term->term_id,
							),
						),
					)
				);

				if ( ! $hub_query->have_posts() ) {
					continue;
				}
				?>
				<section class="gcalls-hub-group" id="hub-<?php echo esc_attr( $term->slug ); ?>">
					<h2 class="gcalls-hub-group__title"><?php echo esc_html( $term->name ); ?></h2>

					<?php if ( '' !== trim( (string) $term->description ) ) : ?>
						<p class="gcalls-hub-group__description"><?php echo esc_html( $term->description ); ?></p>
					<?php endif; ?>

					<div class="gcalls-cards">
						<?php
						while ( $hub_query->have_posts() ) :
							$hub_query->the_post();
							++$rendered;
							get_template_part( 'template-parts/content', 'card' );
						endwhile;
						?>
					</div>
				</section>
				<?php
				wp_reset_postdata();
				?>
			<?php endforeach; ?>

			<p class="gcalls-meta gcalls-hub-total">
				<?php
				printf(
					/* translators: 1: number of articles, 2: number of hubs. */
					esc_html__( '%1$d bài viết trong %2$d nhóm chủ đề.', 'gcalls-theme' ),
					(int) $rendered,
					count( $hub_terms )
				);
				?>
			</p>
		<?php else : ?>
			<?php get_template_part( 'template-parts/content', 'none' ); ?>
		<?php endif; ?>

	<?php elseif ( have_posts() ) : ?>
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
