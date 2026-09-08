<?php
/**
 * GCALLS-047 — content completeness.
 *
 * WHY A THIRD TEST EXISTS
 * `renderer-test.php` proves the renderer obeys the manifest, and the live
 * verifier counts sections in the rendered HTML. Both agree when the manifest
 * itself is missing content: a section whose cards are all blank renders as
 * nothing, the renderer is behaving correctly, and every test stays green while
 * five live pages are short two sections each. That is what GCALLS-045 shipped.
 *
 * So this asserts something neither of the others can: that the manifest
 * CARRIES the content it claims to. A section that declares cards must have
 * cards a reader can see. Renderer and manifest agreeing with each other is not
 * evidence — they agreed the whole time.
 *
 * Run: php wordpress/tests/content-completeness-test.php [--manifest=PATH]
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

$opts     = getopt( '', array( 'manifest::', 'allow-empty::' ) );
$manifest = $opts['manifest'] ?? dirname( __DIR__ ) . '/wp-content/plugins/gcalls-core/data/content-pages.json';

if ( ! is_readable( (string) $manifest ) ) {
	fwrite( STDERR, "FATAL: manifest not readable: $manifest\n" );
	exit( 2 );
}

$doc = json_decode( (string) file_get_contents( (string) $manifest ), true );

if ( ! is_array( $doc ) || empty( $doc['pages'] ) ) {
	fwrite( STDERR, "FATAL: manifest has no pages\n" );
	exit( 2 );
}

/*
 * Sections that are legitimately allowed to carry no items. Everything else
 * that declares a list must fill it. This list is deliberately tiny and
 * explicit: growing it is how a completeness test becomes decorative.
 */
$allow_empty = array_filter( explode( ',', (string) ( $opts['allow-empty'] ?? '' ) ) );

$pass = 0;
$fail = 0;

function check( bool $ok, string $what ): void {
	global $pass, $fail;
	if ( $ok ) { ++$pass; } else { ++$fail; echo "  FAIL  $what\n"; }
}

$blank_sections = array();
$blank_cards    = 0;
$pages_short    = array();

foreach ( $doc['pages'] as $page ) {
	$slug     = (string) ( $page['slug'] ?? '?' );
	$sections = (array) ( $page['sections'] ?? array() );
	$dropped  = 0;

	foreach ( $sections as $index => $section ) {
		$section = (array) $section;
		$type    = (string) ( $section['type'] ?? '' );
		$heading = (string) ( $section['heading'] ?? '' );
		$key     = "$slug#$index";

		// The list a section of this type is expected to carry.
		$items = null;

		if ( 'cards' === $type || 'split' === $type ) {
			$items = (array) ( $section['cards'] ?? $section['columns'] ?? array() );
		} elseif ( 'steps' === $type ) {
			$items = (array) ( $section['steps'] ?? array() );
		} elseif ( 'taglist' === $type ) {
			$items = (array) ( $section['tags'] ?? array() );
		}

		if ( null === $items ) {
			/*
			 * A prose section renders as long as it has SOMETHING — the
			 * renderer emits the head when there is one, so a heading plus a
			 * lead is a legitimate section-header block and not a hole. Only a
			 * prose section with no body, no lead AND no heading disappears.
			 */
			if ( 'prose' === $type
				&& '' === trim( (string) ( $section['body'] ?? '' ) )
				&& '' === trim( (string) ( $section['lead'] ?? '' ) )
				&& '' === trim( $heading ) ) {
				$blank_sections[] = "$key ($type) — prose with nothing in it";
				++$dropped;
			}
			continue;
		}

		if ( in_array( $key, $allow_empty, true ) ) {
			continue;
		}

		if ( array() === $items ) {
			$blank_sections[] = "$key ($type) '$heading' — declares a list with zero items";
			++$dropped;
			continue;
		}

		/*
		 * The failure GCALLS-045 shipped: the array is populated, so nothing
		 * looks wrong, but every entry is blank and the renderer drops the lot.
		 */
		$visible = 0;

		foreach ( $items as $item ) {
			/*
			 * A taglist carries plain strings, a card carries an object. Casting
			 * to array first turns "Zalo" into array( 'Zalo' ) and then looks
			 * for a 'title' key that was never going to be there — which is how
			 * the first run of this test reported 118 blank items when most of
			 * them were perfectly good tags. Check the string case BEFORE the
			 * cast.
			 */
			if ( is_string( $item ) ) {
				if ( '' !== trim( $item ) ) { ++$visible; } else { ++$blank_cards; }
				continue;
			}

			$row = (array) $item;
			$has = '' !== trim( (string) ( $row['title'] ?? '' ) )
				|| '' !== trim( (string) ( $row['body'] ?? '' ) );

			if ( $has ) { ++$visible; } else { ++$blank_cards; }
		}

		if ( 0 === $visible ) {
			$blank_sections[] = "$key ($type) '$heading' — " . count( $items ) . ' items, every one blank';
			++$dropped;
		} elseif ( $visible < count( $items ) ) {
			/*
			 * A PARTIALLY blank list still renders, so the section survives and
			 * the page looks fine — but the reader is silently short one card.
			 * The brief's negative test is explicit that removing ONE required
			 * card has to fail, so a partial hole is a failure in its own right
			 * rather than something only counted when the whole list goes.
			 */
			$blank_sections[] = "$key ($type) '$heading' — " . ( count( $items ) - $visible )
				. ' of ' . count( $items ) . ' items blank';
			++$dropped;
		}
	}

	if ( $dropped > 0 ) {
		$pages_short[ $slug ] = $dropped;
	}
}

echo "CONTENT COMPLETENESS\n\n";
echo 'manifest: ' . $manifest . "\n";
echo 'pages:    ' . count( $doc['pages'] ) . "\n\n";

check( empty( $blank_sections ), count( $blank_sections ) . ' section(s) declare content they do not carry' );

if ( $blank_sections ) {
	foreach ( $blank_sections as $line ) {
		echo "        $line\n";
	}
	echo "\n  pages affected: " . count( $pages_short ) . ' — ';
	foreach ( $pages_short as $slug => $n ) {
		echo "$slug($n) ";
	}
	echo "\n  blank cards total: $blank_cards\n";
}

/*
 * EXPECTED SHAPE — the guard that catches a DELETED section.
 *
 * Everything above validates what the manifest contains. It cannot notice what
 * the manifest no longer contains: delete a whole section and the remaining
 * ones are all still fine, so the test stays green. The negative test in the
 * GCALLS-047 brief is explicit that removing a required section must FAIL, so
 * the expected section count per page is locked in its own file — the same
 * convention `build-homepage-template.mjs` already uses, where the count is
 * read from a reviewed inventory rather than being a magic number.
 *
 * Changing a count here is a deliberate, reviewable edit. That is the point.
 */
$inventory_path = dirname( __FILE__ ) . '/../wp-content/plugins/gcalls-core/data/content-inventory.json';

if ( is_readable( $inventory_path ) ) {
	$inventory = json_decode( (string) file_get_contents( $inventory_path ), true );
	$expected  = (array) ( $inventory['pages'] ?? array() );
	$actual    = array();

	foreach ( $doc['pages'] as $page ) {
		$actual[ (string) $page['slug'] ] = count( (array) ( $page['sections'] ?? array() ) );
	}

	$shape = array();

	foreach ( $expected as $slug => $want ) {
		$have = $actual[ $slug ] ?? null;

		if ( null === $have ) {
			$shape[] = "$slug — page missing entirely (inventory expects $want section(s))";
		} elseif ( (int) $want !== (int) $have ) {
			$shape[] = "$slug — $have section(s), inventory expects $want";
		}
	}

	foreach ( $actual as $slug => $have ) {
		if ( ! array_key_exists( $slug, $expected ) ) {
			$shape[] = "$slug — $have section(s) but the page is not in the inventory";
		}
	}

	check( empty( $shape ), count( $shape ) . ' page(s) disagree with the locked inventory' );

	foreach ( $shape as $line ) {
		echo "        $line\n";
	}
} else {
	echo "  note  no content-inventory.json — section-deletion guard inactive\n";
}

/* Every page must still have a hero h1 and at least one section. */
$no_h1 = array();
$no_sections = array();

foreach ( $doc['pages'] as $page ) {
	if ( '' === trim( (string) ( $page['hero']['h1'] ?? '' ) ) ) { $no_h1[] = $page['slug']; }
	if ( array() === (array) ( $page['sections'] ?? array() ) ) { $no_sections[] = $page['slug']; }
}

check( empty( $no_h1 ), 'every page has a hero h1' . ( $no_h1 ? ': ' . implode( ',', $no_h1 ) : '' ) );
check( empty( $no_sections ), 'every page has at least one section' . ( $no_sections ? ': ' . implode( ',', $no_sections ) : '' ) );

echo "\ncontent-completeness: $pass ok, $fail failed\n";

exit( $fail > 0 ? 1 : 0 );
