<?php
/**
 * Minimal document shell for a React-Shell route.
 *
 * Deliberately does NOT call get_header()/get_footer() — those would load the
 * active theme's header.php/footer.php and produce a duplicate chrome on top
 * of React's own header/footer. wp_head() and wp_footer() are called
 * directly instead, so SEO/meta/analytics hooks registered by other plugins
 * still fire.
 *
 * @var array{siteUrl:string,restUrl:string,restNonce:string,assetsUrl:string,routeKey:string,routePath:string,pluginVersion:string} $config
 * @var array{entry:?string,css:string[]} $manifest
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<?php foreach ( $manifest['css'] as $css_file ) : ?>
<link rel="stylesheet" href="<?php echo esc_url( $config['assetsUrl'] . $css_file ); ?>" />
<?php endforeach; ?>
<?php wp_head(); ?>
</head>
<body class="gcalls-react-shell" data-route="<?php echo esc_attr( $config['routePath'] ); ?>">
<div id="root"></div>
<script>
	window.__GCALLS_SHELL_CONFIG__ = <?php echo wp_json_encode( $config ); ?>;
</script>
<?php if ( $manifest['entry'] ) : ?>
<script type="module" src="<?php echo esc_url( $config['assetsUrl'] . $manifest['entry'] ); ?>"></script>
<?php else : ?>
<!-- gcalls-react-shell: no build entry found in the Vite manifest. Run `npm run build:wordpress`. -->
<?php endif; ?>
<?php wp_footer(); ?>
</body>
</html>
