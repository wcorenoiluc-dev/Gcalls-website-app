/**
 * Mobile navigation toggle.
 *
 * Deliberately dependency-free and tiny. The menu is a plain <ul> that CSS
 * hides below 1024px; this only flips a class and keeps aria-expanded and the
 * button's accessible name in step with it.
 *
 * With JavaScript disabled the menu stays closed, which is why the site's
 * primary links are also repeated in the footer navigation.
 */
( function () {
	'use strict';

	var strings =
		typeof window.gcallsNavStrings === 'object' && window.gcallsNavStrings !== null
			? window.gcallsNavStrings
			: { open: 'Open menu', close: 'Close menu' };

	function setup( toggle ) {
		var nav = document.getElementById( toggle.getAttribute( 'aria-controls' ) );

		if ( ! nav ) {
			return;
		}

		var label = toggle.querySelector( '[data-gcalls-nav-label]' );

		function setState( open ) {
			nav.classList.toggle( 'is-open', open );
			toggle.setAttribute( 'aria-expanded', open ? 'true' : 'false' );

			// Scroll lock. Without it the page behind the panel scrolls under
			// the finger, so closing the menu returns the reader somewhere they
			// did not choose to be.
			document.documentElement.classList.toggle( 'gcalls-nav-open', open );

			if ( label ) {
				label.textContent = open ? strings.close : strings.open;
			}
		}

		function isOpen() {
			return toggle.getAttribute( 'aria-expanded' ) === 'true';
		}

		toggle.addEventListener( 'click', function () {
			setState( ! isOpen() );
		} );

		/**
		 * ESC closes the panel and returns focus to the button.
		 *
		 * Without this the only way out of an open menu on a phone is to find
		 * the toggle again, and for a keyboard user there is no way out at all —
		 * tabbing walks the whole menu and then the page behind it.
		 */
		document.addEventListener( 'keydown', function ( event ) {
			if ( 'Escape' !== event.key || ! isOpen() ) {
				return;
			}

			setState( false );
			toggle.focus();
		} );

		/** A click outside the panel closes it, which is what people expect. */
		document.addEventListener( 'click', function ( event ) {
			if ( ! isOpen() ) {
				return;
			}

			if ( nav.contains( event.target ) || toggle.contains( event.target ) ) {
				return;
			}

			setState( false );
		} );

		/**
		 * The panel closes when the viewport crosses into desktop.
		 *
		 * The CSS shows the desktop bar above 1024px whether or not the panel
		 * class is set, so rotating a phone with the menu open left the site
		 * with both navigations rendered and `aria-expanded="true"` on a button
		 * that was no longer visible.
		 */
		if ( window.matchMedia ) {
			var desktop = window.matchMedia( '(min-width: 1024px)' );
			var onChange = function ( event ) {
				if ( event.matches && isOpen() ) {
					setState( false );
				}
			};

			if ( desktop.addEventListener ) {
				desktop.addEventListener( 'change', onChange );
			} else if ( desktop.addListener ) {
				desktop.addListener( onChange );
			}
		}

		// Escape closes the panel and returns focus to the control that opened
		// it, so keyboard users are not stranded inside a closed menu.
		document.addEventListener( 'keydown', function ( event ) {
			if ( 'Escape' === event.key && toggle.getAttribute( 'aria-expanded' ) === 'true' ) {
				setState( false );
				toggle.focus();
			}
		} );

		// Crossing into the desktop breakpoint hides the panel in CSS. Clearing
		// the class here keeps aria-expanded honest about what is on screen.
		var desktop = window.matchMedia( '(min-width: 1024px)' );

		function onBreakpoint( event ) {
			if ( event.matches ) {
				setState( false );
			}
		}

		if ( typeof desktop.addEventListener === 'function' ) {
			desktop.addEventListener( 'change', onBreakpoint );
		}
	}

	document.querySelectorAll( '[data-gcalls-nav-toggle]' ).forEach( setup );
} )();

/**
 * Blog HUB filter.
 *
 * Shows and hides the hub groups already on the page. It queries nothing,
 * changes no URL and touches no post data — every article is in the document
 * before this runs, and filtering only sets `hidden` on the groups.
 *
 * The bar itself is revealed by CSS only when `.gcalls-js` is on the root, so
 * with scripting off there are no buttons that do nothing and every group is
 * visible. That is why this file may assume the bar means business.
 */
( function () {
	'use strict';

	var bar = document.querySelector( '[data-gcalls-hubfilter]' );

	if ( ! bar ) {
		return;
	}

	var buttons = Array.prototype.slice.call( bar.querySelectorAll( '[data-hub-filter]' ) );
	var groups = Array.prototype.slice.call( document.querySelectorAll( '[data-hub]' ) );
	var status = document.querySelector( '[data-gcalls-hubfilter-status]' );

	if ( ! buttons.length || ! groups.length ) {
		return;
	}

	function apply( value ) {
		var shown = 0;

		groups.forEach( function ( group ) {
			var match = value === 'all' || group.getAttribute( 'data-hub' ) === value;
			group.hidden = ! match;
			if ( match ) {
				shown += 1;
			}
		} );

		buttons.forEach( function ( button ) {
			button.setAttribute(
				'aria-pressed',
				button.getAttribute( 'data-hub-filter' ) === value ? 'true' : 'false'
			);
		} );

		/*
		 * Announced through role="status". Hiding half the page with no spoken
		 * confirmation leaves a screen-reader user with no idea the button did
		 * anything — the change is entirely visual otherwise.
		 */
		if ( status ) {
			var label = 'all' === value
				? ''
				: ( bar.querySelector( '[data-hub-filter="' + value + '"]' ) || {} ).textContent || '';

			status.textContent = 'all' === value
				? 'Đang hiển thị tất cả nhóm chủ đề.'
				: 'Đang lọc theo ' + label.trim().replace( /\s+/g, ' ' ) + '. ' + shown + ' nhóm hiển thị.';
		}
	}

	buttons.forEach( function ( button ) {
		if ( button.disabled ) {
			return;
		}

		button.addEventListener( 'click', function () {
			apply( button.getAttribute( 'data-hub-filter' ) );
		} );
	} );
}() );
