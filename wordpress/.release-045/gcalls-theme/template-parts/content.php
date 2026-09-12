<?php
/**
 * Generic single-post content block.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'gcalls-entry' ); ?>>
	<header class="gcalls-entry__header">
		<?php the_title( sprintf( '<h2 class="gcalls-entry__title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>
	</header>

	<div class="gcalls-prose">
		<?php the_content(); ?>
	</div>
</article>
