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

		function setState( isOpen ) {
			nav.classList.toggle( 'is-open', isOpen );
			toggle.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );

			if ( label ) {
				label.textContent = isOpen ? strings.close : strings.open;
			}
		}

		toggle.addEventListener( 'click', function () {
			setState( toggle.getAttribute( 'aria-expanded' ) !== 'true' );
		} );

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
