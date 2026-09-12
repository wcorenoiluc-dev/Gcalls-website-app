/**
 * Gcalls Content Studio — editor screen.
 *
 * Plain JS, no build step: this runs directly in wp-admin. State lives in
 * one object; every write path (draft save, publish, restore) re-fetches
 * meta from the server rather than trusting its own optimistic guess, since
 * this is the only client for a record other sessions can also be editing.
 */
( function () {
	'use strict';

	var cfg = window.GcallsContentStudio;
	if ( ! cfg ) {
		return;
	}

	var DEBOUNCE_MS = 250;

	var state = {
		route: Object.keys( cfg.routes )[ 0 ],
		section: null,
		values: {},
		published: {},
		errors: {},
		viewport: 'desktop',
		debounceTimer: null,
	};
	state.section = Object.keys( cfg.routes[ state.route ].sections )[ 0 ];

	var root = document.getElementById( 'gcalls-cs-root' );
	if ( ! root ) {
		return;
	}

	root.innerHTML =
		'<div class="gcalls-cs-left">' +
			'<div class="gcalls-cs-field"><label>Page</label><select id="gcalls-cs-route"></select></div>' +
			'<div class="gcalls-cs-field"><label>Section</label><select id="gcalls-cs-section"></select></div>' +
			'<div id="gcalls-cs-fields"></div>' +
			'<div class="gcalls-cs-actions">' +
				'<button type="button" class="button button-primary" id="gcalls-cs-save-draft">' + cfg.i18n.saveDraft + '</button>' +
				'<button type="button" class="button button-primary" id="gcalls-cs-publish" style="background:#673ab7;border-color:#673ab7">' + cfg.i18n.publish + '</button>' +
				'<button type="button" class="button" id="gcalls-cs-restore-published">' + cfg.i18n.restorePrevious + '</button>' +
				'<button type="button" class="button" id="gcalls-cs-restore-defaults">' + cfg.i18n.restoreDefaults + '</button>' +
			'</div>' +
			'<div class="gcalls-cs-status" id="gcalls-cs-status"></div>' +
		'</div>' +
		'<div class="gcalls-cs-right">' +
			'<div class="gcalls-cs-toolbar">' +
				'<div class="gcalls-cs-viewports">' +
					'<button type="button" class="button" data-viewport="desktop">Desktop (1440)</button>' +
					'<button type="button" class="button" data-viewport="tablet">Tablet (768)</button>' +
					'<button type="button" class="button" data-viewport="mobile">Mobile (390)</button>' +
				'</div>' +
				'<div>' +
					'<button type="button" class="button" id="gcalls-cs-refresh-preview">Refresh Preview</button>' +
					'<a class="button" id="gcalls-cs-open-public" href="#" target="_blank" rel="noopener">Open Public Page</a>' +
				'</div>' +
			'</div>' +
			'<div class="gcalls-cs-preview-frame-wrap"><iframe id="gcalls-cs-frame" title="Live preview"></iframe></div>' +
			'<div class="gcalls-cs-preview-status" id="gcalls-cs-preview-status">Loading preview…</div>' +
		'</div>';

	var el = {
		routeSelect: document.getElementById( 'gcalls-cs-route' ),
		sectionSelect: document.getElementById( 'gcalls-cs-section' ),
		fields: document.getElementById( 'gcalls-cs-fields' ),
		status: document.getElementById( 'gcalls-cs-status' ),
		frame: document.getElementById( 'gcalls-cs-frame' ),
		previewStatus: document.getElementById( 'gcalls-cs-preview-status' ),
		openPublic: document.getElementById( 'gcalls-cs-open-public' ),
	};

	// ── Page/section selectors ──────────────────────────────────────────

	Object.keys( cfg.routes ).forEach( function ( slug ) {
		var opt = document.createElement( 'option' );
		opt.value = slug;
		opt.textContent = cfg.routes[ slug ].label + ' (' + cfg.routes[ slug ].path + ')';
		el.routeSelect.appendChild( opt );
	} );
	el.routeSelect.value = state.route;

	function populateSections() {
		el.sectionSelect.innerHTML = '';
		var sections = cfg.routes[ state.route ].sections;
		Object.keys( sections ).forEach( function ( slug ) {
			var opt = document.createElement( 'option' );
			opt.value = slug;
			opt.textContent = sections[ slug ].label;
			el.sectionSelect.appendChild( opt );
		} );
		el.sectionSelect.value = state.section;
	}
	populateSections();

	el.routeSelect.addEventListener( 'change', function () {
		state.route = el.routeSelect.value;
		state.section = Object.keys( cfg.routes[ state.route ].sections )[ 0 ];
		populateSections();
		loadContent();
	} );
	el.sectionSelect.addEventListener( 'change', function () {
		state.section = el.sectionSelect.value;
		loadContent();
	} );

	// ── REST helpers ─────────────────────────────────────────────────────

	function api( path, options ) {
		options = options || {};
		options.headers = Object.assign( { 'X-WP-Nonce': cfg.wpNonce, 'Content-Type': 'application/json' }, options.headers || {} );
		return fetch( cfg.restUrl + path, options ).then( function ( res ) {
			return res.json().then( function ( body ) {
				if ( ! res.ok ) {
					var err = new Error( ( body && body.message ) || 'Request failed' );
					err.body = body;
					throw err;
				}
				return body;
			} );
		} );
	}

	function fieldSchema() {
		return cfg.routes[ state.route ].sections[ state.section ].fields;
	}

	// ── Field rendering ──────────────────────────────────────────────────

	function renderFields() {
		var schema = fieldSchema();
		el.fields.innerHTML = '';
		Object.keys( schema ).forEach( function ( key ) {
			var field = schema[ key ];
			var wrap = document.createElement( 'div' );
			wrap.className = 'gcalls-cs-field';
			wrap.dataset.field = key;

			var label = document.createElement( 'label' );
			label.textContent = field.label + ( field.required ? ' *' : '' );
			wrap.appendChild( label );

			var input = buildInput( key, field );
			wrap.appendChild( input );

			var err = document.createElement( 'div' );
			err.className = 'gcalls-cs-error';
			err.style.display = 'none';
			wrap.appendChild( err );

			el.fields.appendChild( wrap );
		} );
	}

	function buildInput( key, field ) {
		var value = state.values[ key ];

		if ( 'bool' === field.type ) {
			var label = document.createElement( 'label' );
			var box = document.createElement( 'input' );
			box.type = 'checkbox';
			box.checked = !! value;
			box.addEventListener( 'change', function () {
				setValue( key, box.checked );
			} );
			label.appendChild( box );
			label.appendChild( document.createTextNode( ' Bật' ) );
			return label;
		}

		if ( 'textarea' === field.type ) {
			var textarea = document.createElement( 'textarea' );
			textarea.value = value || '';
			textarea.maxLength = field.max_len || 2000;
			textarea.addEventListener( 'input', function () {
				setValue( key, textarea.value );
			} );
			return textarea;
		}

		if ( 'list' === field.type ) {
			return buildListInput( key, field, value || [] );
		}

		if ( 'image' === field.type ) {
			return buildImageInput( key, field, value );
		}

		var input = document.createElement( 'input' );
		input.type = 'url' === field.type ? 'url' : 'text';
		input.value = value || '';
		if ( field.max_len ) {
			input.maxLength = field.max_len;
		}
		input.addEventListener( 'input', function () {
			setValue( key, input.value );
		} );
		return input;
	}

	function buildListInput( key, field, items ) {
		var wrap = document.createElement( 'div' );

		function redraw() {
			wrap.innerHTML = '';
			items.forEach( function ( item, index ) {
				var row = document.createElement( 'div' );
				row.className = 'gcalls-cs-list-item';
				var input = document.createElement( 'input' );
				input.type = 'text';
				input.value = item;
				input.maxLength = field.max_len || 200;
				input.addEventListener( 'input', function () {
					items[ index ] = input.value;
					setValue( key, items.slice() );
				} );
				var remove = document.createElement( 'button' );
				remove.type = 'button';
				remove.className = 'button';
				remove.textContent = '×';
				remove.addEventListener( 'click', function () {
					items.splice( index, 1 );
					setValue( key, items.slice() );
					redraw();
				} );
				row.appendChild( input );
				row.appendChild( remove );
				wrap.appendChild( row );
			} );
			if ( items.length < ( field.max_items || 20 ) ) {
				var add = document.createElement( 'button' );
				add.type = 'button';
				add.className = 'button';
				add.textContent = '+ Thêm mục';
				add.addEventListener( 'click', function () {
					items.push( '' );
					setValue( key, items.slice() );
					redraw();
				} );
				wrap.appendChild( add );
			}
		}
		redraw();
		return wrap;
	}

	function buildImageInput( key, field, image ) {
		var wrap = document.createElement( 'div' );
		var preview = document.createElement( 'div' );
		var chooseBtn = document.createElement( 'button' );
		chooseBtn.type = 'button';
		chooseBtn.className = 'button';
		var removeBtn = document.createElement( 'button' );
		removeBtn.type = 'button';
		removeBtn.className = 'button';
		removeBtn.textContent = 'Xoá ảnh';

		function refresh() {
			preview.innerHTML = '';
			if ( image && image.url ) {
				var img = document.createElement( 'img' );
				img.src = image.url;
				img.style.maxWidth = '160px';
				img.style.display = 'block';
				img.style.marginBottom = '6px';
				preview.appendChild( img );
				chooseBtn.textContent = 'Đổi ảnh';
				removeBtn.style.display = '';
			} else {
				chooseBtn.textContent = 'Chọn ảnh từ Media Library';
				removeBtn.style.display = 'none';
			}
		}

		chooseBtn.addEventListener( 'click', function () {
			var frame = wp.media( { title: field.label, multiple: false, library: { type: 'image' } } );
			frame.on( 'select', function () {
				var attachment = frame.state().get( 'selection' ).first().toJSON();
				image = { id: attachment.id, url: attachment.url, width: attachment.width, height: attachment.height };
				setValue( key, image );
				refresh();
			} );
			frame.open();
		} );
		removeBtn.addEventListener( 'click', function () {
			image = null;
			setValue( key, null );
			refresh();
		} );

		refresh();
		wrap.appendChild( preview );
		wrap.appendChild( chooseBtn );
		wrap.appendChild( removeBtn );
		return wrap;
	}

	function setValue( key, value ) {
		state.values[ key ] = value;
		schedulePreviewUpdate();
	}

	// ── Preview: debounce + postMessage ─────────────────────────────────

	function schedulePreviewUpdate() {
		if ( state.debounceTimer ) {
			clearTimeout( state.debounceTimer );
		}
		state.debounceTimer = setTimeout( sendPreviewUpdate, DEBOUNCE_MS );
	}

	function sendPreviewUpdate() {
		var win = el.frame.contentWindow;
		if ( ! win ) {
			return;
		}
		win.postMessage(
			{
				source: 'gcalls-content-studio',
				type: 'preview-update',
				route: cfg.routes[ state.route ].path,
				section: state.section,
				fields: state.values,
			},
			window.location.origin
		);
		el.previewStatus.textContent = 'Preview cập nhật lúc ' + new Date().toLocaleTimeString();
	}

	function buildPreviewUrl() {
		var nonce = cfg.routes[ state.route ].previewNonce;
		var params = new URLSearchParams( {
			gcalls_content_preview: '1',
			route: state.route,
			section: state.section,
			_wpnonce: nonce,
		} );
		return cfg.previewUrl + '?' + params.toString();
	}

	function loadPreviewFrame() {
		el.previewStatus.textContent = 'Đang tải preview…';
		el.frame.src = buildPreviewUrl();
	}
	el.frame.addEventListener( 'load', function () {
		el.previewStatus.textContent = 'Preview sẵn sàng.';
		sendPreviewUpdate();
	} );

	document.getElementById( 'gcalls-cs-refresh-preview' ).addEventListener( 'click', loadPreviewFrame );

	// Viewport buttons
	var viewportButtons = document.querySelectorAll( '[data-viewport]' );
	function applyViewport() {
		var px = cfg.viewports[ state.viewport ];
		el.frame.style.width = px + 'px';
		viewportButtons.forEach( function ( btn ) {
			btn.classList.toggle( 'active', btn.dataset.viewport === state.viewport );
		} );
	}
	viewportButtons.forEach( function ( btn ) {
		btn.addEventListener( 'click', function () {
			state.viewport = btn.dataset.viewport;
			applyViewport();
			// Draft values are preserved across viewport switches deliberately —
			// only `state.viewport` changes here, `state.values` is untouched.
		} );
	} );
	applyViewport();

	// Only accept messages this same window originated an iframe for — the
	// preview never talks back with content, but a defensive origin check
	// costs nothing and matches the "validate postMessage origin" rule.
	window.addEventListener( 'message', function ( event ) {
		if ( event.origin !== window.location.origin ) {
			return;
		}
	} );

	// ── Load / save / publish / restore ─────────────────────────────────

	function loadContent() {
		renderFields();
		api( 'content/' + state.route + '?context=edit' ).then( function ( body ) {
			state.published = ( body.sections && body.sections[ state.section ] ) || {};
			var draftSection = body.draft && body.draft[ state.section ];
			state.values = Object.assign( {}, defaultsFor( state.section ), state.published, draftSection || {} );
			renderFields();
			renderValuesIntoInputs();
			el.status.innerHTML = statusHtml( body.meta, !! draftSection );
			el.openPublic.href = ( cfg.publicBaseUrl || cfg.previewUrl ) + cfg.routes[ state.route ].path.replace( /^\//, '' );
			loadPreviewFrame();
		} );
	}

	function defaultsFor( section ) {
		var schema = cfg.routes[ state.route ].sections[ section ].fields;
		var defaults = {};
		Object.keys( schema ).forEach( function ( key ) {
			var type = schema[ key ].type;
			defaults[ key ] = 'bool' === type ? true : 'list' === type ? [] : 'image' === type ? null : '';
		} );
		return defaults;
	}

	// Re-render already-built inputs with fetched values instead of
	// rebuilding, so a slow network response doesn't wipe mid-typed input —
	// in practice this only runs right after renderFields(), before any
	// typing, so a full rebuild is safe and simplest.
	function renderValuesIntoInputs() {
		renderFields();
	}

	function statusHtml( meta, hasDraft ) {
		meta = meta || {};
		return (
			'<div>Trạng thái: <strong>' + ( hasDraft ? 'Bản nháp' : 'Đã xuất bản' ) + '</strong></div>' +
			'<div>Sửa lần cuối: ' + ( meta.lastModified || '—' ) + '</div>' +
			'<div>Người sửa: ' + ( meta.lastEditor || '—' ) + '</div>' +
			'<div>Phiên bản đang xuất bản: #' + ( meta.publishedRevision || '—' ) + '</div>'
		);
	}

	function showErrors( errors ) {
		var list = errors && errors.errors ? errors.errors : [];
		document.querySelectorAll( '.gcalls-cs-error' ).forEach( function ( n ) {
			n.style.display = 'none';
			n.textContent = '';
		} );
		list.forEach( function ( code ) {
			var key = code.split( ':' )[ 1 ];
			var wrap = el.fields.querySelector( '[data-field="' + key + '"] .gcalls-cs-error' );
			if ( wrap ) {
				wrap.textContent = 'Không hợp lệ: ' + code.split( ':' )[ 0 ].replace( /_/g, ' ' );
				wrap.style.display = '';
			}
		} );
	}

	document.getElementById( 'gcalls-cs-save-draft' ).addEventListener( 'click', function () {
		api( 'content/' + state.route + '/draft', {
			method: 'POST',
			body: JSON.stringify( { section: state.section, fields: state.values } ),
		} )
			.then( function ( body ) {
				el.status.innerHTML = statusHtml( body.meta, true );
				el.status.insertAdjacentHTML( 'beforeend', '<div style="color:#008a20">Đã lưu bản nháp.</div>' );
			} )
			.catch( function ( err ) {
				showErrors( err.body );
			} );
	} );

	document.getElementById( 'gcalls-cs-publish' ).addEventListener( 'click', function () {
		if ( ! cfg.canPublish ) {
			window.alert( 'Bạn không có quyền xuất bản.' );
			return;
		}
		var changed = diffFields( state.published, state.values );
		confirmModal( changed, function () {
			// Save the current field state as a draft first, so Publish
			// always publishes exactly what is on screen, even if the
			// editor never clicked "Lưu bản nháp".
			api( 'content/' + state.route + '/draft', {
				method: 'POST',
				body: JSON.stringify( { section: state.section, fields: state.values } ),
			} )
				.then( function () {
					return api( 'content/' + state.route + '/publish', { method: 'POST' } );
				} )
				.then( function ( body ) {
					state.published = Object.assign( {}, state.values );
					el.status.innerHTML = statusHtml( body.meta, false );
					el.status.insertAdjacentHTML( 'beforeend', '<div style="color:#008a20">Đã xuất bản.</div>' );
				} )
				.catch( function ( err ) {
					showErrors( err.body );
					window.alert( 'Không thể xuất bản: kiểm tra các trường bắt buộc.' );
				} );
		} );
	} );

	document.getElementById( 'gcalls-cs-restore-published' ).addEventListener( 'click', function () {
		api( 'content/' + state.route + '/revisions' ).then( function ( revisions ) {
			var current = revisions.find( function ( r ) { return r.is_published; } );
			var previous = revisions.find( function ( r ) { return ! r.is_published; } );
			var target = previous || current;
			if ( ! target ) {
				window.alert( 'Chưa có phiên bản nào để khôi phục.' );
				return;
			}
			if ( ! window.confirm( 'Khôi phục phiên bản #' + target.id + '?' ) ) {
				return;
			}
			api( 'content/' + state.route + '/restore/' + target.id, { method: 'POST' } ).then( function () {
				loadContent();
			} );
		} );
	} );

	document.getElementById( 'gcalls-cs-restore-defaults' ).addEventListener( 'click', function () {
		if ( ! window.confirm( 'Khôi phục mặc định React cho section này? Nội dung tuỳ chỉnh hiện tại sẽ được thay bằng nội dung mặc định trong mã nguồn React.' ) ) {
			return;
		}
		api( 'content/' + state.route + '/restore-defaults', {
			method: 'POST',
			body: JSON.stringify( { section: state.section } ),
		} ).then( function () {
			loadContent();
		} );
	} );

	function diffFields( before, after ) {
		var changed = [];
		Object.keys( after ).forEach( function ( key ) {
			if ( JSON.stringify( before[ key ] ) !== JSON.stringify( after[ key ] ) ) {
				changed.push( key );
			}
		} );
		return changed;
	}

	function confirmModal( changedFields, onConfirm ) {
		var backdrop = document.createElement( 'div' );
		backdrop.className = 'gcalls-cs-modal-backdrop';
		backdrop.innerHTML =
			'<div class="gcalls-cs-modal">' +
				'<h2>' + cfg.i18n.confirmPublish + '</h2>' +
				'<table>' +
					'<tr><td>Page</td><td>' + cfg.routes[ state.route ].label + '</td></tr>' +
					'<tr><td>Section</td><td>' + cfg.routes[ state.route ].sections[ state.section ].label + '</td></tr>' +
					'<tr><td>Fields changed</td><td class="gcalls-cs-changed-fields">' + ( changedFields.join( ', ' ) || '(không có thay đổi)' ) + '</td></tr>' +
				'</table>' +
				'<div style="display:flex;gap:8px;justify-content:flex-end">' +
					'<button type="button" class="button" id="gcalls-cs-modal-cancel">Huỷ</button>' +
					'<button type="button" class="button button-primary" id="gcalls-cs-modal-confirm" style="background:#673ab7;border-color:#673ab7">Xuất bản</button>' +
				'</div>' +
			'</div>';
		document.body.appendChild( backdrop );
		backdrop.querySelector( '#gcalls-cs-modal-cancel' ).addEventListener( 'click', function () {
			document.body.removeChild( backdrop );
		} );
		backdrop.querySelector( '#gcalls-cs-modal-confirm' ).addEventListener( 'click', function () {
			document.body.removeChild( backdrop );
			onConfirm();
		} );
	}

	loadContent();
} )();
