/*
 * Lead form progressive enhancement.
 *
 * THE FORM WORKS WITHOUT THIS FILE. It is a real <form method="post"> posting
 * to admin-post.php, validated on the server, answering with a redirect. If
 * this script fails to load, is blocked, or throws, a visitor can still submit
 * a lead and still sees the right result — which is the only acceptable
 * arrangement for the one page on the site that earns money.
 *
 * So everything here is comfort: a busy state, a guard against the double click
 * that a slow connection invites, and moving focus to whatever the visitor now
 * needs to read.
 */
(function () {
	'use strict';

	/**
	 * Focus the outcome so a screen reader announces it and a keyboard user is
	 * put where the new content is.
	 *
	 * On an error we want the FIRST invalid field, not the banner: the banner
	 * says "check the marked fields" and the useful place to be is the first
	 * one of them. On success there is no field left, so the confirmation
	 * itself takes focus.
	 */
	function focusOutcome() {
		var status = document.getElementById('gcalls-lead-status');

		if (!status) {
			return;
		}

		var firstInvalid = document.querySelector('.gcalls-lead__form [aria-invalid="true"]');
		var target = firstInvalid || status;

		/* Let the browser finish its own restoration scroll first, or ours is
		 * immediately undone on a back-forward navigation. */
		window.requestAnimationFrame(function () {
			try {
				target.focus({ preventScroll: true });
				target.scrollIntoView({ block: 'center', behavior: 'smooth' });
			} catch (e) {
				target.focus();
			}
		});
	}

	function enhance(form) {
		var button = form.querySelector('[data-gcalls-lead-submit]');
		var label = form.querySelector('[data-gcalls-lead-label]');
		var submitting = false;

		if (!button || !label) {
			return;
		}

		var idle = label.textContent;

		form.addEventListener('submit', function (event) {
			/*
			 * The server is idempotent, so a double submit costs a duplicate
			 * request but never a duplicate lead. Blocking it here still
			 * matters: without it the visitor sees a button that appears to do
			 * nothing and clicks harder.
			 */
			if (submitting) {
				event.preventDefault();
				return;
			}

			submitting = true;

			/* Not `button.disabled` before the post completes: a disabled
			 * submit button is omitted from the payload in some browsers, and
			 * this one carries no value, but the class of bug is worth
			 * avoiding. aria-disabled announces the state without that risk. */
			button.setAttribute('aria-disabled', 'true');
			button.classList.add('is-busy');
			label.textContent = label.getAttribute('data-busy') || 'Đang gửi…';

			/* If the navigation is cancelled — the visitor hits Escape, or a
			 * validation error bounces them straight back from cache — give
			 * the button back rather than leaving it stuck. */
			window.setTimeout(function () {
				submitting = false;
				button.removeAttribute('aria-disabled');
				button.classList.remove('is-busy');
				label.textContent = idle;
			}, 15000);
		});
	}

	function init() {
		var forms = document.querySelectorAll('[data-gcalls-lead-form]');

		for (var i = 0; i < forms.length; i++) {
			enhance(forms[i]);
		}

		focusOutcome();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
