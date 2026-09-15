/**
 * Gcalls Content Studio 0.2.0 — Website editor screen.
 *
 * Plain browser JS, no build step. Implements docs/content-studio/CONTRACT-0.2.0.md
 * §5 (REST) and §7 (admin). One `state` object; small functions; no native
 * alert()/confirm() — every dialog is an in-page modal.
 *
 * Layout: [page list] [sections + fields / SEO tab] [preview iframe].
 */
( function () {
	'use strict';

	var cfg = window.GcallsContentStudio;
	var root = document.getElementById( 'gcalls-cs-root' );
	if ( ! cfg || ! root || ! cfg.manifest || ! Array.isArray( cfg.manifest.pages ) ) {
		return;
	}

	var PREVIEW_DEBOUNCE_MS = 200;
	var TEXTAREA_ROWS = 4;

	/* ───────────────────────── state ───────────────────────── */

	var state = {
		pages: cfg.manifest.pages.slice().sort( function ( a, b ) { return a.order - b.order; } ),
		listMeta: {},            // route -> meta from GET /content
		route: null,             // current page key
		page: null,              // current page manifest object
		section: null,           // selected section key
		tab: 'content',          // 'content' | 'seo'
		values: {},              // section -> fields (working copy)
		published: {},           // section -> fields (server published)
		draft: {},               // section -> fields (server draft)
		version: 0,              // optimistic lock base
		meta: null,
		seo: null,
		seoDirty: false,
		dirty: {},               // section -> true when unsaved
		errors: {},              // section -> { field: message }
		viewport: 'desktop',
		previewRevision: null,
		previewTimer: null,
		previewReady: false,
		search: '',
		busy: false,
	};

	function isDirty() {
		return Object.keys( state.dirty ).length > 0 || state.seoDirty;
	}

	/* ───────────────────────── helpers ───────────────────────── */

	function h( tag, attrs, children ) {
		var node = document.createElement( tag );
		attrs = attrs || {};
		Object.keys( attrs ).forEach( function ( k ) {
			var v = attrs[ k ];
			if ( v === null || v === undefined || v === false ) {
				return;
			}
			if ( 'class' === k ) {
				node.className = v;
			} else if ( 'text' === k ) {
				node.textContent = v;
			} else if ( 'html' === k ) {
				node.innerHTML = v;
			} else if ( 0 === k.indexOf( 'on' ) && 'function' === typeof v ) {
				node.addEventListener( k.slice( 2 ).toLowerCase(), v );
			} else if ( 'dataset' === k ) {
				Object.keys( v ).forEach( function ( d ) { node.dataset[ d ] = v[ d ]; } );
			} else if ( true === v ) {
				node.setAttribute( k, '' );
			} else {
				node.setAttribute( k, v );
			}
		} );
		( children || [] ).forEach( function ( c ) {
			if ( c === null || c === undefined || c === false ) {
				return;
			}
			node.appendChild( 'string' === typeof c ? document.createTextNode( c ) : c );
		} );
		return node;
	}

	function clear( node ) {
		while ( node.firstChild ) {
			node.removeChild( node.firstChild );
		}
	}

	var uidCounter = 0;
	function uid( prefix ) {
		uidCounter += 1;
		return 'gcs-' + prefix + '-' + uidCounter;
	}

	function clone( v ) {
		return JSON.parse( JSON.stringify( v === undefined ? null : v ) );
	}

	function formatDate( iso ) {
		if ( ! iso ) {
			return '—';
		}
		var d = new Date( iso );
		return isNaN( d.getTime() ) ? String( iso ) : d.toLocaleString();
	}

	function pageUrl( page ) {
		var base = cfg.publicBaseUrl || cfg.homeUrl || '/';
		return base.replace( /\/$/, '' ) + page.path;
	}

	function isEditable( page ) {
		return 'editable' === page.status;
	}

	function i18n( key, fallback ) {
		return ( cfg.i18n && cfg.i18n[ key ] ) || fallback;
	}

	/* ───────────────────────── REST ───────────────────────── */

	function api( path, options ) {
		options = options || {};
		var init = {
			method: options.method || 'GET',
			credentials: 'same-origin',
			headers: { 'X-WP-Nonce': cfg.wpNonce, Accept: 'application/json' },
		};
		if ( options.body !== undefined ) {
			init.headers[ 'Content-Type' ] = 'application/json';
			init.body = JSON.stringify( options.body );
		}
		return fetch( cfg.restUrl.replace( /\/$/, '' ) + '/' + path.replace( /^\//, '' ), init )
			.catch( function () {
				var err = new Error( 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.' );
				err.network = true;
				throw err;
			} )
			.then( function ( res ) {
				return res.text().then( function ( text ) {
					var body = null;
					try { body = text ? JSON.parse( text ) : null; } catch ( e ) { body = null; }
					if ( ! res.ok ) {
						var err = new Error( ( body && body.message ) || ( 'HTTP ' + res.status ) );
						err.status = res.status;
						err.code = body && body.code;
						err.body = body;
						err.data = body && body.data;
						throw err;
					}
					return body;
				} );
			} );
	}

	function errorsOf( err ) {
		var list = ( err && err.data && err.data.errors ) || ( err && err.body && err.body.errors ) || [];
		return Array.isArray( list ) ? list : [];
	}

	/* ───────────────────────── notices & modals ───────────────────────── */

	var noticeEl;
	function notice( kind, message, actions ) {
		clear( noticeEl );
		if ( ! message ) {
			return;
		}
		var box = h( 'div', { class: 'gcs-notice gcs-notice--' + kind, role: 'alert' }, [ h( 'span', { text: message } ) ] );
		( actions || [] ).forEach( function ( a ) {
			box.appendChild( h( 'button', { type: 'button', class: 'button button-small', text: a.label, onClick: a.onClick } ) );
		} );
		box.appendChild( h( 'button', { type: 'button', class: 'gcs-notice__close', 'aria-label': 'Đóng', text: '×', onClick: function () { clear( noticeEl ); } } ) );
		noticeEl.appendChild( box );
	}

	function describeError( err ) {
		if ( ! err ) {
			return 'Lỗi không xác định.';
		}
		if ( err.network ) {
			return err.message;
		}
		if ( 401 === err.status ) {
			return 'Phiên đăng nhập đã hết hạn. Tải lại trang và đăng nhập lại.';
		}
		if ( 403 === err.status ) {
			return 'Bạn không có quyền thực hiện thao tác này.';
		}
		if ( 409 === err.status ) {
			return 'Nội dung này vừa được người khác cập nhật. Tải lại để lấy phiên bản mới nhất.';
		}
		if ( 422 === err.status ) {
			return 'Một số trường chưa hợp lệ. Kiểm tra các lỗi được đánh dấu.';
		}
		return err.message || 'Yêu cầu thất bại.';
	}

	/**
	 * In-page modal. `opts.buttons` = [{label, primary, onClick(close)}].
	 * Focus moves into the modal and returns to the opener on close.
	 */
	function modal( opts ) {
		var opener = document.activeElement;
		var backdrop = h( 'div', { class: 'gcs-modal-backdrop' } );
		var titleId = uid( 'modal-title' );
		var box = h( 'div', { class: 'gcs-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId, tabindex: '-1' } );
		box.appendChild( h( 'h2', { id: titleId, text: opts.title } ) );
		if ( opts.body ) {
			box.appendChild( 'string' === typeof opts.body ? h( 'p', { text: opts.body } ) : opts.body );
		}
		var row = h( 'div', { class: 'gcs-modal__actions' } );
		function close() {
			if ( backdrop.parentNode ) {
				backdrop.parentNode.removeChild( backdrop );
			}
			document.removeEventListener( 'keydown', onKey );
			if ( opener && opener.focus ) {
				opener.focus();
			}
		}
		function onKey( e ) {
			if ( 'Escape' === e.key ) {
				e.preventDefault();
				close();
			} else if ( 'Tab' === e.key ) {
				var f = box.querySelectorAll( 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])' );
				if ( ! f.length ) {
					return;
				}
				var first = f[ 0 ], last = f[ f.length - 1 ];
				if ( e.shiftKey && document.activeElement === first ) { e.preventDefault(); last.focus(); }
				else if ( ! e.shiftKey && document.activeElement === last ) { e.preventDefault(); first.focus(); }
			}
		}
		( opts.buttons || [] ).forEach( function ( b ) {
			row.appendChild( h( 'button', {
				type: 'button',
				class: 'button' + ( b.primary ? ' button-primary gcs-btn-brand' : '' ),
				text: b.label,
				onClick: function () { b.onClick ? b.onClick( close ) : close(); },
			} ) );
		} );
		box.appendChild( row );
		backdrop.appendChild( box );
		document.body.appendChild( backdrop );
		document.addEventListener( 'keydown', onKey );
		var firstBtn = row.querySelector( '.button-primary' ) || row.querySelector( 'button' );
		( firstBtn || box ).focus();
		return close;
	}

	function confirmModal( title, body, confirmLabel, onConfirm ) {
		modal( {
			title: title,
			body: body,
			buttons: [
				{ label: 'Huỷ' },
				{ label: confirmLabel, primary: true, onClick: function ( close ) { close(); onConfirm(); } },
			],
		} );
	}

	/* ───────────────────────── skeleton ───────────────────────── */

	clear( root );
	noticeEl = h( 'div', { class: 'gcs-notices', 'aria-live': 'polite' } );
	var leftEl = h( 'aside', { class: 'gcs-col gcs-col--pages', 'aria-label': 'Danh sách trang' } );
	var midEl = h( 'section', { class: 'gcs-col gcs-col--editor', 'aria-label': 'Nội dung trang' } );
	var rightEl = h( 'section', { class: 'gcs-col gcs-col--preview', 'aria-label': 'Xem trước' } );
	root.appendChild( noticeEl );
	root.appendChild( h( 'div', { class: 'gcs-layout' }, [ leftEl, midEl, rightEl ] ) );

	/* ───────────────────────── left: pages ───────────────────────── */

	function pageMatches( page, q ) {
		if ( ! q ) {
			return true;
		}
		var hay = [ page.label, page.path ].concat( ( page.sections || [] ).map( function ( s ) { return s.label; } ) ).join( ' ' ).toLowerCase();
		return hay.indexOf( q ) !== -1;
	}

	function statusChip( route ) {
		var m = state.listMeta[ route ];
		var label = 'Published', cls = 'published';
		if ( route === state.route && isDirty() ) {
			label = 'Unsaved'; cls = 'unsaved';
		} else if ( m && ( m.hasDraft || 'draft' === m.status ) ) {
			label = 'Draft'; cls = 'draft';
		} else if ( m && 'unsaved' === m.status ) {
			label = 'Unsaved'; cls = 'unsaved';
		}
		return h( 'span', { class: 'gcs-chip gcs-chip--' + cls, text: label } );
	}

	function renderPages() {
		clear( leftEl );
		var searchId = uid( 'search' );
		leftEl.appendChild( h( 'label', { for: searchId, class: 'screen-reader-text', text: 'Tìm trang hoặc section' } ) );
		var input = h( 'input', { id: searchId, type: 'search', class: 'gcs-search', placeholder: 'Tìm trang / section…', value: state.search, onInput: function ( e ) {
			state.search = e.target.value.trim().toLowerCase();
			renderPageList( list );
		} } );
		leftEl.appendChild( input );
		var list = h( 'ul', { class: 'gcs-pages', role: 'list' } );
		leftEl.appendChild( list );
		renderPageList( list );
	}

	function renderPageList( list ) {
		clear( list );
		state.pages.forEach( function ( page ) {
			if ( ! pageMatches( page, state.search ) ) {
				return;
			}
			var btn = h( 'button', {
				type: 'button',
				class: 'gcs-page' + ( page.key === state.route ? ' is-active' : '' ) + ( isEditable( page ) ? '' : ' is-review' ),
				'aria-current': page.key === state.route ? 'page' : null,
				onClick: function () { selectPage( page.key ); },
			}, [
				h( 'span', { class: 'gcs-page__label', text: page.label } ),
				h( 'span', { class: 'gcs-page__path', text: page.path } ),
				h( 'span', { class: 'gcs-page__badges' }, [
					h( 'span', { class: 'gcs-badge gcs-badge--' + page.status, text: page.statusLabel || ( isEditable( page ) ? 'Có thể chỉnh sửa' : cfg.reviewLabel || 'Đang kiểm tra giao diện' ) } ),
					isEditable( page ) ? statusChip( page.key ) : null,
				] ),
			] );
			list.appendChild( h( 'li', {}, [ btn ] ) );
		} );
	}

	function refreshPageChips() {
		var list = leftEl.querySelector( '.gcs-pages' );
		if ( list ) {
			renderPageList( list );
		}
	}

	/* ───────────────────────── page selection & loading ───────────────────────── */

	function selectPage( key ) {
		if ( key === state.route ) {
			return;
		}
		if ( isDirty() ) {
			confirmModal( 'Thay đổi chưa lưu', i18n( 'unsaved', 'Bạn có thay đổi chưa lưu.' ) + ' Rời trang này sẽ mất các thay đổi đó.', 'Rời trang', function () {
				loadPage( key );
			} );
			return;
		}
		loadPage( key );
	}

	function resetPageState() {
		state.values = {};
		state.published = {};
		state.draft = {};
		state.dirty = {};
		state.errors = {};
		state.seo = null;
		state.seoDirty = false;
		state.version = 0;
		state.meta = null;
		state.previewRevision = null;
		state.tab = 'content';
	}

	function loadPage( key ) {
		var page = state.pages.filter( function ( p ) { return p.key === key; } )[ 0 ];
		if ( ! page ) {
			return;
		}
		resetPageState();
		state.route = key;
		state.page = page;
		state.section = page.sections && page.sections.length ? page.sections[ 0 ].key : null;
		renderPages();
		renderEditor( true );
		notice( null );

		api( 'content/' + key + '?context=edit' ).then( function ( body ) {
			state.version = body.version || 0;
			state.meta = body.meta || null;
			state.published = body.sections || {};
			state.draft = body.draft || {};
			state.seo = body.seo || null;
			( page.sections || [] ).forEach( function ( s ) {
				var base = clone( s.defaults || {} );
				var pub = state.published[ s.key ] || {};
				var dr = state.draft[ s.key ] || {};
				state.values[ s.key ] = Object.assign( base, pub, dr );
			} );
			if ( state.meta ) {
				state.listMeta[ key ] = state.meta;
			}
			renderEditor( false );
			refreshPageChips();
			loadPreview();
		} ).catch( function ( err ) {
			renderEditor( false );
			notice( 'error', describeError( err ), [ { label: 'Thử lại', onClick: function () { loadPage( key ); } } ] );
		} );
	}

	function loadList() {
		return api( 'content' ).then( function ( rows ) {
			( rows || [] ).forEach( function ( r ) { state.listMeta[ r.route ] = r; } );
			refreshPageChips();
		} ).catch( function () { /* list meta is cosmetic */ } );
	}

	/* ───────────────────────── middle: editor ───────────────────────── */

	function renderEditor( loading ) {
		clear( midEl );
		var page = state.page;
		if ( ! page ) {
			midEl.appendChild( h( 'p', { class: 'gcs-empty', text: 'Chọn một trang ở cột bên trái.' } ) );
			return;
		}
		var head = h( 'header', { class: 'gcs-editor__head' }, [
			h( 'div', {}, [
				h( 'h2', { class: 'gcs-editor__title', text: page.label } ),
				h( 'div', { class: 'gcs-editor__meta' }, [ metaLine() ] ),
			] ),
			isEditable( page ) ? statusChip( page.key ) : h( 'span', { class: 'gcs-badge gcs-badge--review', text: page.statusLabel || cfg.reviewLabel || 'Đang kiểm tra giao diện' } ),
		] );
		midEl.appendChild( head );

		var tabs = h( 'div', { class: 'gcs-tabs', role: 'tablist' }, [
			tabButton( 'content', 'Nội dung' ),
			tabButton( 'seo', 'SEO' ),
		] );
		midEl.appendChild( tabs );

		var body = h( 'div', { class: 'gcs-editor__body', role: 'tabpanel' } );
		midEl.appendChild( body );
		if ( loading ) {
			body.appendChild( h( 'p', { class: 'gcs-empty', text: 'Đang tải…' } ) );
			return;
		}
		if ( 'seo' === state.tab ) {
			renderSeo( body );
		} else {
			renderSections( body );
		}
		midEl.appendChild( renderActions() );
	}

	function tabButton( key, label ) {
		return h( 'button', {
			type: 'button',
			role: 'tab',
			class: 'gcs-tab' + ( state.tab === key ? ' is-active' : '' ),
			'aria-selected': state.tab === key ? 'true' : 'false',
			onClick: function () {
				state.tab = key;
				renderEditor( false );
				if ( 'seo' === key && ! state.seo ) {
					loadSeo();
				}
			},
		}, [ label ] );
	}

	function metaLine() {
		var m = state.meta;
		if ( ! m ) {
			return h( 'span', { text: '' } );
		}
		var parts = [];
		parts.push( 'Sửa: ' + ( m.updatedBy || '—' ) + ' · ' + formatDate( m.updatedAt ) );
		parts.push( 'Xuất bản: ' + ( m.publishedBy || '—' ) + ' · ' + formatDate( m.publishedAt ) );
		parts.push( 'v' + ( m.version || 0 ) );
		return h( 'span', { text: parts.join( '   |   ' ) } );
	}

	function renderSections( container ) {
		var page = state.page;
		var readOnly = ! isEditable( page );
		if ( readOnly ) {
			container.appendChild( h( 'div', { class: 'gcs-review-note', text: ( page.statusLabel || cfg.reviewLabel || 'Đang kiểm tra giao diện' ) + ' — trang này chỉ xem, chưa cho phép chỉnh sửa.' } ) );
		}
		if ( ! page.sections || ! page.sections.length ) {
			container.appendChild( h( 'p', { class: 'gcs-empty', text: 'Trang này chưa khai báo section nào.' } ) );
			return;
		}
		var acc = h( 'div', { class: 'gcs-accordion' } );
		page.sections.slice().sort( function ( a, b ) { return a.order - b.order; } ).forEach( function ( s ) {
			acc.appendChild( renderSectionItem( s, readOnly ) );
		} );
		container.appendChild( acc );
	}

	function renderSectionItem( s, readOnly ) {
		var open = s.key === state.section;
		var panelId = uid( 'panel' );
		var btn = h( 'button', {
			type: 'button',
			class: 'gcs-accordion__btn',
			'aria-expanded': open ? 'true' : 'false',
			'aria-controls': panelId,
			onClick: function () {
				state.section = open ? null : s.key;
				renderEditor( false );
				if ( ! open ) {
					sendFocus( s.key );
				}
			},
		}, [
			h( 'span', { class: 'gcs-accordion__label', text: s.label } ),
			state.dirty[ s.key ] ? h( 'span', { class: 'gcs-chip gcs-chip--unsaved', text: 'Unsaved' } ) : ( state.draft[ s.key ] ? h( 'span', { class: 'gcs-chip gcs-chip--draft', text: 'Draft' } ) : null ),
			h( 'span', { class: 'gcs-accordion__chev', 'aria-hidden': 'true', text: open ? '▾' : '▸' } ),
		] );
		var panel = h( 'div', { id: panelId, class: 'gcs-accordion__panel', hidden: ! open } );
		if ( open ) {
			var fields = s.fields || {};
			var values = state.values[ s.key ] || {};
			Object.keys( fields ).forEach( function ( name ) {
				panel.appendChild( renderField( s.key, name, fields[ name ], values, readOnly, [ s.key, name ] ) );
			} );
		}
		return h( 'div', { class: 'gcs-accordion__item' + ( open ? ' is-open' : '' ) }, [ h( 'h3', { class: 'gcs-accordion__h' }, [ btn ] ), panel ] );
	}

	/* ───────────────────────── fields ───────────────────────── */

	function setSectionValue( section, name, value ) {
		state.values[ section ] = state.values[ section ] || {};
		state.values[ section ][ name ] = value;
		state.dirty[ section ] = true;
		clearFieldError( section, name );
		schedulePreview( section );
		refreshDirtyUi();
	}

	function refreshDirtyUi() {
		var head = midEl.querySelector( '.gcs-editor__head .gcs-chip' );
		if ( head && state.page && isEditable( state.page ) ) {
			head.replaceWith( statusChip( state.route ) );
		}
		refreshPageChips();
	}

	function fieldError( section, name ) {
		return state.errors[ section ] && state.errors[ section ][ name ];
	}

	function clearFieldError( section, name ) {
		if ( state.errors[ section ] ) {
			delete state.errors[ section ][ name ];
		}
		var err = midEl.querySelector( '[data-error-for="' + section + '.' + name + '"]' );
		if ( err ) {
			err.textContent = '';
			err.hidden = true;
		}
	}

	function errorNode( section, name ) {
		var msg = fieldError( section, name );
		return h( 'div', { class: 'gcs-field__error', role: 'alert', 'data-error-for': section + '.' + name, hidden: ! msg, text: msg || '' } );
	}

	/**
	 * Generic field renderer. `values` is the object holding this field;
	 * `path` identifies it for errors. For repeater items, `onChange`
	 * writes into the item and re-emits the whole array.
	 */
	function renderField( section, name, field, values, readOnly, path, onChange ) {
		var value = values[ name ];
		var id = uid( 'f' );
		var wrap = h( 'div', { class: 'gcs-field gcs-field--' + field.type } );
		var labelText = field.label || name;
		var isToggle = 'toggle' === field.type || 'decorative' === field.type;
		if ( ! isToggle ) {
			wrap.appendChild( h( 'label', { for: id, class: 'gcs-field__label' }, [ labelText, field.required ? h( 'span', { class: 'gcs-req', 'aria-hidden': 'true', text: ' *' } ) : null ] ) );
		}
		var set = onChange || function ( v ) { setSectionValue( section, name, v ); };
		var control;
		switch ( field.type ) {
			case 'textarea':
				control = h( 'textarea', { id: id, rows: TEXTAREA_ROWS, maxlength: field.maxLen || null, disabled: readOnly, onInput: function ( e ) { set( e.target.value ); } } );
				control.value = value || '';
				break;
			case 'richtext':
				control = richTextEditor( id, value || '', readOnly, set );
				break;
			case 'select':
				control = h( 'select', { id: id, disabled: readOnly, onChange: function ( e ) { set( e.target.value ); } } );
				( field.options || [] ).forEach( function ( o ) {
					var opt = h( 'option', { value: o.value, text: o.label || o.value } );
					if ( o.value === value ) { opt.selected = true; }
					control.appendChild( opt );
				} );
				break;
			case 'toggle':
			case 'decorative':
				var box = h( 'input', { id: id, type: 'checkbox', disabled: readOnly, onChange: function ( e ) { set( !! e.target.checked ); } } );
				box.checked = !! value;
				control = h( 'label', { for: id, class: 'gcs-toggle' }, [ box, h( 'span', { text: labelText } ) ] );
				break;
			case 'image':
				control = imageField( id, section, name, field, values, readOnly, set );
				break;
			case 'checklist':
				control = checklistField( id, field, Array.isArray( value ) ? value.slice() : [], readOnly, set );
				break;
			case 'repeater':
			case 'cards':
			case 'testimonials':
				control = repeaterField( id, section, name, field, Array.isArray( value ) ? clone( value ) : [], readOnly, set );
				break;
			case 'url':
				control = h( 'input', { id: id, type: 'text', inputmode: 'url', maxlength: field.maxLen || null, placeholder: 'https://… hoặc /duong-dan/', disabled: readOnly, onInput: function ( e ) { set( e.target.value ); } } );
				control.value = value || '';
				break;
			default: // text, ctaLabel, imageAlt
				control = h( 'input', { id: id, type: 'text', maxlength: field.maxLen || null, disabled: readOnly, onInput: function ( e ) { set( e.target.value ); } } );
				control.value = value || '';
		}
		wrap.appendChild( control );
		if ( field.help ) {
			wrap.appendChild( h( 'p', { class: 'gcs-field__help', text: field.help } ) );
		}
		if ( field.maxLen && ( 'text' === field.type || 'textarea' === field.type || 'ctaLabel' === field.type || 'imageAlt' === field.type ) ) {
			var counter = h( 'span', { class: 'gcs-field__count', text: String( ( value || '' ).length ) + '/' + field.maxLen } );
			control.addEventListener( 'input', function ( e ) { counter.textContent = String( e.target.value.length ) + '/' + field.maxLen; } );
			wrap.appendChild( counter );
		}
		if ( path && path.length === 2 ) {
			wrap.appendChild( errorNode( section, name ) );
		}
		return wrap;
	}

	function richTextEditor( id, html, readOnly, set ) {
		var wrap = h( 'div', { class: 'gcs-rich' } );
		var editor = h( 'div', { id: id, class: 'gcs-rich__editor', contenteditable: readOnly ? 'false' : 'true', role: 'textbox', 'aria-multiline': 'true', html: html } );
		if ( ! readOnly ) {
			var bar = h( 'div', { class: 'gcs-rich__bar', role: 'toolbar', 'aria-label': 'Định dạng' } );
			[
				[ 'bold', 'B', 'Đậm' ], [ 'italic', 'I', 'Nghiêng' ], [ 'insertUnorderedList', '•', 'Danh sách' ], [ 'createLink', '🔗', 'Liên kết' ], [ 'removeFormat', '⌫', 'Xoá định dạng' ],
			].forEach( function ( c ) {
				bar.appendChild( h( 'button', { type: 'button', class: 'button button-small', title: c[ 2 ], 'aria-label': c[ 2 ], text: c[ 1 ], onMousedown: function ( e ) { e.preventDefault(); }, onClick: function () {
					editor.focus();
					if ( 'createLink' === c[ 0 ] ) {
						promptLink( function ( url ) { document.execCommand( 'createLink', false, url ); emit(); } );
						return;
					}
					document.execCommand( c[ 0 ], false, null );
					emit();
				} } ) );
			} );
			wrap.appendChild( bar );
		}
		function emit() {
			set( scrubHtml( editor.innerHTML ) );
		}
		editor.addEventListener( 'input', emit );
		editor.addEventListener( 'paste', function ( e ) {
			e.preventDefault();
			var text = ( e.clipboardData || window.clipboardData ).getData( 'text/plain' );
			document.execCommand( 'insertText', false, text );
		} );
		wrap.appendChild( editor );
		return wrap;
	}

	function promptLink( cb ) {
		var input = h( 'input', { type: 'text', class: 'regular-text', placeholder: 'https://… hoặc /duong-dan/' } );
		modal( {
			title: 'Chèn liên kết',
			body: h( 'div', {}, [ input ] ),
			buttons: [ { label: 'Huỷ' }, { label: 'Chèn', primary: true, onClick: function ( close ) {
				var v = input.value.trim();
				close();
				if ( v && /^(https?:\/\/|\/|#|tel:|mailto:)/i.test( v ) ) {
					cb( v );
				} else if ( v ) {
					notice( 'error', 'Liên kết không hợp lệ. Chỉ chấp nhận http(s), đường dẫn nội bộ, #, tel: hoặc mailto:.' );
				}
			} } ],
		} );
		setTimeout( function () { input.focus(); }, 0 );
	}

	/** Client-side tidy only: strips scripts/styles/event handlers. The server sanitizes for real. */
	function scrubHtml( html ) {
		var tmp = document.createElement( 'div' );
		tmp.innerHTML = html;
		tmp.querySelectorAll( 'script, style, iframe, object, embed' ).forEach( function ( n ) { n.remove(); } );
		tmp.querySelectorAll( '*' ).forEach( function ( n ) {
			Array.prototype.slice.call( n.attributes ).forEach( function ( a ) {
				if ( /^on/i.test( a.name ) || ( 'href' === a.name && /^\s*(javascript|data):/i.test( a.value ) ) || 'style' === a.name ) {
					n.removeAttribute( a.name );
				}
			} );
		} );
		return tmp.innerHTML;
	}

	function checklistField( id, field, items, readOnly, set ) {
		var wrap = h( 'div', { id: id, class: 'gcs-list' } );
		function redraw() {
			clear( wrap );
			items.forEach( function ( item, index ) {
				var input = h( 'input', { type: 'text', maxlength: field.maxLen || null, disabled: readOnly, 'aria-label': ( field.label || '' ) + ' mục ' + ( index + 1 ), onInput: function ( e ) { items[ index ] = e.target.value; set( items.slice() ); } } );
				input.value = item;
				var row = h( 'div', { class: 'gcs-list__row' }, [ input ] );
				if ( ! readOnly ) {
					row.appendChild( moveButtons( items, index, function () { set( items.slice() ); redraw(); } ) );
					row.appendChild( h( 'button', { type: 'button', class: 'button button-small', 'aria-label': 'Xoá mục ' + ( index + 1 ), text: '×', onClick: function () { items.splice( index, 1 ); set( items.slice() ); redraw(); } } ) );
				}
				wrap.appendChild( row );
			} );
			if ( ! readOnly && items.length < ( field.maxItems || 20 ) ) {
				wrap.appendChild( h( 'button', { type: 'button', class: 'button button-small', text: '+ Thêm mục', onClick: function () { items.push( '' ); set( items.slice() ); redraw(); var last = wrap.querySelectorAll( 'input' ); if ( last.length ) { last[ last.length - 1 ].focus(); } } } ) );
			}
		}
		redraw();
		return wrap;
	}

	function moveButtons( arr, index, after ) {
		var g = h( 'span', { class: 'gcs-move' } );
		g.appendChild( h( 'button', { type: 'button', class: 'button button-small', 'aria-label': 'Chuyển lên', text: '↑', disabled: 0 === index, onClick: function () { var t = arr[ index - 1 ]; arr[ index - 1 ] = arr[ index ]; arr[ index ] = t; after(); } } ) );
		g.appendChild( h( 'button', { type: 'button', class: 'button button-small', 'aria-label': 'Chuyển xuống', text: '↓', disabled: index === arr.length - 1, onClick: function () { var t = arr[ index + 1 ]; arr[ index + 1 ] = arr[ index ]; arr[ index ] = t; after(); } } ) );
		return g;
	}

	function repeaterField( id, section, name, field, items, readOnly, set ) {
		var wrap = h( 'div', { id: id, class: 'gcs-repeater' } );
		var itemSchema = field.item || {};
		function emptyItem() {
			var o = {};
			Object.keys( itemSchema ).forEach( function ( k ) {
				var t = itemSchema[ k ].type;
				o[ k ] = ( 'toggle' === t || 'decorative' === t ) ? false : ( 'checklist' === t ? [] : ( 'image' === t ? null : '' ) );
			} );
			return o;
		}
		function redraw() {
			clear( wrap );
			items.forEach( function ( item, index ) {
				var card = h( 'fieldset', { class: 'gcs-repeater__item' } );
				var legend = h( 'legend', {}, [ h( 'span', { text: ( field.label || 'Mục' ) + ' ' + ( index + 1 ) } ) ] );
				if ( ! readOnly ) {
					legend.appendChild( moveButtons( items, index, function () { set( clone( items ) ); redraw(); } ) );
					legend.appendChild( h( 'button', { type: 'button', class: 'button button-small', 'aria-label': 'Xoá mục ' + ( index + 1 ), text: '×', onClick: function () { items.splice( index, 1 ); set( clone( items ) ); redraw(); } } ) );
				}
				card.appendChild( legend );
				Object.keys( itemSchema ).forEach( function ( k ) {
					card.appendChild( renderField( section, k, itemSchema[ k ], item, readOnly, [ section, name, index, k ], function ( v ) { item[ k ] = v; set( clone( items ) ); } ) );
				} );
				wrap.appendChild( card );
			} );
			if ( ! readOnly && items.length < ( field.maxItems || 20 ) ) {
				wrap.appendChild( h( 'button', { type: 'button', class: 'button', text: '+ Thêm ' + ( field.label || 'mục' ).toLowerCase(), onClick: function () { items.push( emptyItem() ); set( clone( items ) ); redraw(); } } ) );
			}
		}
		redraw();
		return wrap;
	}

	function imageField( id, section, name, field, values, readOnly, set ) {
		var image = values[ name ] || null;
		var wrap = h( 'div', { id: id, class: 'gcs-image' } );
		var preview = h( 'div', { class: 'gcs-image__preview' } );
		var info = h( 'div', { class: 'gcs-image__info' } );
		var choose = h( 'button', { type: 'button', class: 'button', disabled: readOnly } );
		var remove = h( 'button', { type: 'button', class: 'button', text: 'Gỡ khỏi section', disabled: readOnly, onClick: function () { image = null; set( null ); refresh(); } } );
		function siblingAlt() {
			var keys = Object.keys( values );
			var altKey = keys.filter( function ( k ) { return k.toLowerCase() === ( name + 'alt' ).toLowerCase(); } )[ 0 ];
			return altKey ? values[ altKey ] : null;
		}
		function refresh() {
			clear( preview );
			clear( info );
			if ( image && image.url ) {
				preview.appendChild( h( 'img', { src: image.url, alt: '' , loading: 'lazy' } ) );
				info.appendChild( h( 'div', { text: image.filename || image.url.split( '/' ).pop() } ) );
				info.appendChild( h( 'div', { text: ( image.width || '?' ) + '×' + ( image.height || '?' ) + ' px · ID ' + image.id } ) );
				var alt = siblingAlt();
				info.appendChild( h( 'div', { class: alt ? '' : 'gcs-image__warn', text: alt ? 'Alt: ' + alt : 'Chưa có alt (bắt buộc trừ khi đánh dấu trang trí).' } ) );
				choose.textContent = 'Đổi ảnh';
				remove.hidden = false;
			} else {
				preview.appendChild( h( 'div', { class: 'gcs-image__empty', text: 'Chưa chọn ảnh' } ) );
				choose.textContent = 'Chọn từ Media Library';
				remove.hidden = true;
			}
		}
		choose.addEventListener( 'click', function () {
			if ( ! window.wp || ! wp.media ) {
				notice( 'error', 'Media Library chưa sẵn sàng trên trang này.' );
				return;
			}
			var frame = wp.media( { title: field.label || 'Chọn ảnh', multiple: false, library: { type: 'image' }, button: { text: 'Dùng ảnh này' } } );
			frame.on( 'select', function () {
				var a = frame.state().get( 'selection' ).first().toJSON();
				api( 'media/check?ids=' + encodeURIComponent( a.id ) ).then( function ( rows ) {
					var r = ( rows || [] )[ 0 ];
					if ( ! r || ! r.ok || r.blocked ) {
						notice( 'error', 'Ảnh này không được phép sử dụng' + ( r && r.blocked ? ' (nằm trong danh sách chặn vì chứa dữ liệu nhạy cảm).' : '.' ) );
						return;
					}
					image = { id: r.id, url: r.url || a.url, width: r.width || a.width, height: r.height || a.height, filename: r.filename || a.filename };
					set( image );
					refresh();
				} ).catch( function ( err ) { notice( 'error', describeError( err ) ); } );
			} );
			frame.open();
		} );
		refresh();
		wrap.appendChild( preview );
		wrap.appendChild( info );
		wrap.appendChild( h( 'div', { class: 'gcs-image__actions' }, [ choose, remove ] ) );
		return wrap;
	}

	/* ───────────────────────── SEO tab ───────────────────────── */

	var SEO_FIELDS = [
		[ 'title', 'SEO title', 'text', 70 ],
		[ 'description', 'Meta description', 'textarea', 160 ],
		[ 'canonical', 'Canonical URL', 'url', null ],
		[ 'ogTitle', 'OG title', 'text', 95 ],
		[ 'ogDescription', 'OG description', 'textarea', 200 ],
		[ 'ogImage', 'OG image', 'image', null ],
		[ 'noindex', 'Không cho công cụ tìm kiếm lập chỉ mục (noindex)', 'toggle', null ],
	];

	function loadSeo() {
		api( 'content/' + state.route + '/seo' ).then( function ( body ) {
			state.seo = body || {};
			if ( 'seo' === state.tab ) {
				renderEditor( false );
			}
		} ).catch( function ( err ) { notice( 'error', describeError( err ) ); } );
	}

	function renderSeo( container ) {
		if ( ! state.seo ) {
			container.appendChild( h( 'p', { class: 'gcs-empty', text: 'Đang tải SEO…' } ) );
			return;
		}
		var seo = state.seo;
		var readOnly = ! isEditable( state.page );
		container.appendChild( h( 'p', { class: 'gcs-seo__managed', text: 'Nguồn quản lý: ' + ( 'rank-math' === seo.managedBy ? 'Rank Math (đồng bộ với metadata Rank Math của trang)' : 'Content Studio' ) } ) );
		var values = seo;
		SEO_FIELDS.forEach( function ( f ) {
			var key = f[ 0 ], field = { type: f[ 2 ], label: f[ 1 ], maxLen: f[ 3 ] };
			var ro = readOnly || ( 'noindex' === key && ! ( cfg.canManage || seo.canEditNoindex ) );
			if ( 'noindex' === key ) {
				field.help = ro ? 'Chỉ Administrator được thay đổi.' : 'Cẩn trọng: bật sẽ ẩn trang khỏi Google.';
			}
			container.appendChild( renderField( '__seo', key, field, values, ro, [ '__seo', key ], function ( v ) {
				seo[ key ] = v;
				state.seoDirty = true;
				refreshDirtyUi();
			} ) );
		} );
	}

	function saveSeo() {
		var payload = {};
		SEO_FIELDS.forEach( function ( f ) { payload[ f[ 0 ] ] = state.seo[ f[ 0 ] ]; } );
		return api( 'content/' + state.route + '/seo', { method: 'POST', body: payload } ).then( function () {
			state.seoDirty = false;
			refreshDirtyUi();
			notice( 'success', 'Đã lưu SEO.' );
		} );
	}

	/* ───────────────────────── actions ───────────────────────── */

	function renderActions() {
		var page = state.page;
		var bar = h( 'div', { class: 'gcs-actions' } );
		if ( ! isEditable( page ) ) {
			bar.appendChild( h( 'span', { class: 'gcs-actions__note', text: page.statusLabel || cfg.reviewLabel || 'Đang kiểm tra giao diện' } ) );
			return bar;
		}
		bar.appendChild( h( 'button', { type: 'button', class: 'button', text: i18n( 'saveDraft', 'Lưu bản nháp' ), onClick: onSaveDraft } ) );
		if ( cfg.canPublish ) {
			bar.appendChild( h( 'button', { type: 'button', class: 'button button-primary gcs-btn-brand', text: i18n( 'publish', 'Cập nhật website' ), onClick: onPublish } ) );
			bar.appendChild( h( 'button', { type: 'button', class: 'button', text: i18n( 'revert', 'Hoàn tác' ), onClick: onRevert } ) );
		}
		bar.appendChild( h( 'button', { type: 'button', class: 'button-link gcs-link-danger', text: 'Huỷ bản nháp', onClick: onDiscard } ) );
		bar.appendChild( h( 'span', { class: 'gcs-actions__spacer' } ) );
		bar.appendChild( h( 'a', { class: 'button-link', href: pageUrl( page ), target: '_blank', rel: 'noopener', text: 'Mở trang công khai' } ) );
		return bar;
	}

	function setBusy( busy ) {
		state.busy = busy;
		midEl.querySelectorAll( '.gcs-actions button' ).forEach( function ( b ) { b.disabled = busy; } );
	}

	function applyMeta( meta ) {
		if ( ! meta ) {
			return;
		}
		state.meta = meta;
		state.version = meta.version || state.version;
		state.listMeta[ state.route ] = meta;
	}

	function showFieldErrors( errs ) {
		state.errors = {};
		var firstSection = null;
		errs.forEach( function ( code ) {
			var parts = String( code ).split( ':' );
			var kind = parts[ 0 ], key = ( parts[ 1 ] || '' ).split( '.' )[ 0 ]; // "cards.2.title" → "cards"
			var detail = ( parts[ 1 ] || '' ).indexOf( '.' ) !== -1 ? ' (mục ' + ( parseInt( parts[ 1 ].split( '.' )[ 1 ], 10 ) + 1 ) + ')' : '';
			var section = null;
			( state.page.sections || [] ).forEach( function ( s ) {
				if ( s.fields && s.fields[ key ] ) { section = section || s.key; }
			} );
			if ( ! section && state.dirty ) {
				section = state.section;
			}
			if ( ! section ) {
				return;
			}
			state.errors[ section ] = state.errors[ section ] || {};
			state.errors[ section ][ key ] = errorMessage( kind ) + detail;
			firstSection = firstSection || section;
		} );
		if ( firstSection ) {
			state.section = firstSection;
		}
		renderEditor( false );
	}

	function errorMessage( kind ) {
		return {
			required: 'Trường bắt buộc.',
			missing: 'Thiếu giá trị.',
			too_long: 'Vượt quá độ dài cho phép.',
			invalid_url: 'URL không hợp lệ (chỉ http(s), đường dẫn nội bộ, #, tel:, mailto:).',
			invalid_list: 'Danh sách không hợp lệ.',
			invalid_image: 'Ảnh không hợp lệ hoặc không thuộc Media Library.',
			blocked_image: 'Ảnh nằm trong danh sách chặn (dữ liệu nhạy cảm).',
			blocked_media: 'Ảnh nằm trong danh sách chặn (dữ liệu nhạy cảm).',
			invalid_item: 'Mục không hợp lệ.',
			unknown_section: 'Section không còn tồn tại trong manifest.',
			no_draft: 'Chưa có bản nháp để cập nhật.',
			storage_failed: 'Không lưu được vào cơ sở dữ liệu.',
			invalid_option: 'Giá trị không nằm trong danh sách cho phép.',
			too_many: 'Quá số mục cho phép.',
			invalid_html: 'Nội dung định dạng không hợp lệ.',
		}[ kind ] || ( 'Không hợp lệ: ' + kind.replace( /_/g, ' ' ) );
	}

	function handleWriteError( err, retry ) {
		if ( 409 === err.status ) {
			applyMeta( err.data && err.data.meta );
			notice( 'error', describeError( err ), [ { label: 'Tải lại trang này', onClick: function () { state.dirty = {}; state.seoDirty = false; loadPage( state.route ); } } ] );
			return;
		}
		if ( 422 === err.status ) {
			showFieldErrors( errorsOf( err ) );
			notice( 'error', describeError( err ) );
			return;
		}
		notice( 'error', describeError( err ), retry ? [ { label: 'Thử lại', onClick: retry } ] : [] );
	}

	/** Saves every dirty section sequentially (draft endpoint is per section). */
	function saveDirtySections() {
		var sections = Object.keys( state.dirty );
		var p = Promise.resolve();
		sections.forEach( function ( key ) {
			p = p.then( function () {
				return api( 'content/' + state.route + '/draft', { method: 'POST', body: { section: key, fields: state.values[ key ], baseVersion: state.version } } ).then( function ( body ) {
					applyMeta( body.meta );
					state.draft[ key ] = clone( state.values[ key ] );
					delete state.dirty[ key ];
				} );
			} );
		} );
		return p;
	}

	function onSaveDraft() {
		if ( state.busy ) {
			return;
		}
		setBusy( true );
		var chain = saveDirtySections();
		if ( state.seoDirty ) {
			chain = chain.then( saveSeo );
		}
		chain.then( function () {
			setBusy( false );
			notice( 'success', 'Đã lưu bản nháp. Website công khai chưa thay đổi.' );
			renderEditor( false );
			refreshPageChips();
		} ).catch( function ( err ) {
			setBusy( false );
			handleWriteError( err, onSaveDraft );
		} );
	}

	function onPublish() {
		if ( state.busy || ! cfg.canPublish ) {
			return;
		}
		var changed = [];
		( state.page.sections || [] ).forEach( function ( s ) {
			if ( JSON.stringify( state.values[ s.key ] ) !== JSON.stringify( Object.assign( clone( s.defaults || {} ), state.published[ s.key ] || {} ) ) ) {
				changed.push( s.label );
			}
		} );
		var body = h( 'div', {}, [
			h( 'p', { class: 'gcs-modal__warn', text: i18n( 'confirmPublish', 'Nội dung này sẽ được hiển thị ngay trên website.' ) } ),
			h( 'p', { text: 'Trang: ' + state.page.label + ' (' + state.page.path + ')' } ),
			h( 'p', { text: 'Section thay đổi: ' + ( changed.join( ', ' ) || '(không có thay đổi so với bản đang xuất bản)' ) } ),
		] );
		modal( {
			title: i18n( 'publish', 'Cập nhật website' ),
			body: body,
			buttons: [ { label: 'Huỷ' }, { label: i18n( 'publish', 'Cập nhật website' ), primary: true, onClick: function ( close ) { close(); doPublish(); } } ],
		} );
	}

	function doPublish() {
		setBusy( true );
		saveDirtySections()
			.then( function () { return state.seoDirty ? saveSeo() : null; } )
			.then( function () { return api( 'content/' + state.route + '/publish', { method: 'POST', body: { baseVersion: state.version } } ); } )
			.then( function ( body ) {
				applyMeta( body.meta );
				( state.page.sections || [] ).forEach( function ( s ) { state.published[ s.key ] = clone( state.values[ s.key ] ); } );
				state.draft = {};
				state.dirty = {};
				setBusy( false );
				renderEditor( false );
				refreshPageChips();
				var url = body.publicUrl || pageUrl( state.page );
				var link = h( 'a', { href: url, target: '_blank', rel: 'noopener', text: i18n( 'viewUpdated', 'Xem trang vừa cập nhật' ) } );
				clear( noticeEl );
				noticeEl.appendChild( h( 'div', { class: 'gcs-notice gcs-notice--success', role: 'status' }, [ h( 'span', { text: 'Đã cập nhật website. ' } ), link ] ) );
				loadPreview();
			} )
			.catch( function ( err ) {
				setBusy( false );
				handleWriteError( err, null );
			} );
	}

	function onDiscard() {
		confirmModal( 'Huỷ bản nháp', 'Bản nháp trên máy chủ và các thay đổi chưa lưu sẽ bị bỏ. Website công khai không đổi.', 'Huỷ bản nháp', function () {
			setBusy( true );
			api( 'content/' + state.route + '/discard-draft', { method: 'POST' } ).then( function () {
				state.dirty = {};
				state.seoDirty = false;
				setBusy( false );
				loadPage( state.route );
			} ).catch( function ( err ) { setBusy( false ); handleWriteError( err, null ); } );
		} );
	}

	/* ───────────────────────── revisions (Hoàn tác) ───────────────────────── */

	function onRevert() {
		if ( state.busy ) {
			return;
		}
		api( 'content/' + state.route + '/revisions' ).then( function ( revisions ) {
			var list = h( 'ul', { class: 'gcs-revisions', role: 'list' } );
			if ( ! revisions || ! revisions.length ) {
				list.appendChild( h( 'li', { text: 'Chưa có phiên bản nào.' } ) );
			}
			( revisions || [] ).forEach( function ( r ) {
				var row = h( 'li', { class: 'gcs-revisions__row' + ( r.isPublished ? ' is-published' : '' ) }, [
					h( 'div', { class: 'gcs-revisions__meta' }, [
						h( 'strong', { text: '#' + r.id + ( r.isPublished ? ' · đang xuất bản' : '' ) } ),
						h( 'div', { text: formatDate( r.date ) + ' · ' + ( r.author || '—' ) + ( r.summary ? ' · ' + r.summary : '' ) } ),
					] ),
					h( 'div', { class: 'gcs-revisions__btns' }, [
						h( 'button', { type: 'button', class: 'button button-small', text: 'Xem trước', onClick: function () { state.previewRevision = r.id; loadPreview(); rightEl.querySelector( '.gcs-preview__status' ).textContent = 'Đang xem phiên bản #' + r.id + ' (chỉ đọc).'; } } ),
						r.isPublished ? null : h( 'button', { type: 'button', class: 'button button-small button-primary gcs-btn-brand', text: 'Khôi phục bản này', onClick: function () { confirmRestore( r.id ); } } ),
					] ),
				] );
				list.appendChild( row );
			} );
			var panel = h( 'div', { class: 'gcs-revert' }, [
				h( 'p', { text: 'Chọn một phiên bản, xem trước ở khung bên phải, rồi xác nhận khôi phục. Khôi phục sẽ xuất bản lại phiên bản đó lên website.' } ),
				list,
			] );
			modal( { title: i18n( 'revert', 'Hoàn tác' ), body: panel, buttons: [ { label: 'Đóng', onClick: function ( close ) { close(); state.previewRevision = null; loadPreview(); } } ] } );
		} ).catch( function ( err ) { notice( 'error', describeError( err ) ); } );
	}

	function confirmRestore( id ) {
		modal( {
			title: 'Khôi phục phiên bản #' + id,
			body: h( 'p', { class: 'gcs-modal__warn', text: i18n( 'confirmPublish', 'Nội dung này sẽ được hiển thị ngay trên website.' ) } ),
			buttons: [ { label: 'Huỷ' }, { label: 'Khôi phục và cập nhật website', primary: true, onClick: function ( close ) {
				close();
				setBusy( true );
				api( 'content/' + state.route + '/restore/' + id, { method: 'POST', body: { baseVersion: state.version } } ).then( function ( body ) {
					applyMeta( body.meta );
					state.previewRevision = null;
					state.dirty = {};
					setBusy( false );
					notice( 'success', 'Đã khôi phục phiên bản #' + id + '.', [] );
					loadPage( state.route );
				} ).catch( function ( err ) { setBusy( false ); handleWriteError( err, null ); } );
			} } ],
		} );
	}

	/* ───────────────────────── right: preview ───────────────────────── */

	var frame, previewStatus, viewportBtns = [];

	function renderPreviewShell() {
		clear( rightEl );
		var bar = h( 'div', { class: 'gcs-preview__bar' } );
		var vp = h( 'div', { class: 'gcs-preview__viewports', role: 'group', 'aria-label': 'Kích thước xem trước' } );
		viewportBtns = [];
		[ [ 'desktop', 'Desktop' ], [ 'tablet', 'Tablet' ], [ 'mobile', 'Mobile' ] ].forEach( function ( v ) {
			var b = h( 'button', { type: 'button', class: 'button button-small', 'aria-pressed': 'false', text: v[ 1 ] + ' ' + cfg.viewports[ v[ 0 ] ], dataset: { viewport: v[ 0 ] }, onClick: function () { state.viewport = v[ 0 ]; applyViewport(); } } );
			viewportBtns.push( b );
			vp.appendChild( b );
		} );
		bar.appendChild( vp );
		bar.appendChild( h( 'div', { class: 'gcs-preview__tools' }, [
			h( 'button', { type: 'button', class: 'button button-small', text: 'Refresh Preview', onClick: function () { loadPreview(); } } ),
			h( 'button', { type: 'button', class: 'button button-small', text: 'Open Preview in New Tab', onClick: function () { var u = previewUrl(); if ( u ) { window.open( u, '_blank', 'noopener' ); } } } ),
		] ) );
		rightEl.appendChild( bar );
		var wrap = h( 'div', { class: 'gcs-preview__frame-wrap' } );
		frame = h( 'iframe', { class: 'gcs-preview__frame', title: 'Xem trước website', sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups' } );
		frame.addEventListener( 'load', function () {
			previewStatus.textContent = 'Preview sẵn sàng.';
			state.previewReady = false; // React announces readiness itself
			setTimeout( function () { sendUpdate( state.section ); }, 50 );
		} );
		wrap.appendChild( frame );
		rightEl.appendChild( wrap );
		previewStatus = h( 'div', { class: 'gcs-preview__status', 'aria-live': 'polite', text: 'Chọn trang để xem trước.' } );
		rightEl.appendChild( previewStatus );
		applyViewport();
	}

	function applyViewport() {
		var px = cfg.viewports[ state.viewport ] || 1440;
		if ( frame ) {
			frame.style.width = px + 'px';
		}
		viewportBtns.forEach( function ( b ) {
			var on = b.dataset.viewport === state.viewport;
			b.classList.toggle( 'is-active', on );
			b.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
		} );
	}

	function previewUrl() {
		if ( ! state.route ) {
			return '';
		}
		var nonce = cfg.previewNonces && cfg.previewNonces[ state.route ];
		var params = new URLSearchParams( { gcalls_content_preview: '1', route: state.route, section: state.section || ( state.page.sections[ 0 ] && state.page.sections[ 0 ].key ) || '', _wpnonce: nonce || '' } );
		if ( state.previewRevision ) {
			params.set( 'revision', String( state.previewRevision ) );
		}
		return ( cfg.homeUrl || '/' ).replace( /\/$/, '' ) + '/?' + params.toString();
	}

	function loadPreview() {
		if ( ! frame || ! state.route ) {
			return;
		}
		previewStatus.textContent = 'Đang tải preview…';
		frame.src = previewUrl();
	}

	function schedulePreview( section ) {
		if ( state.previewTimer ) {
			clearTimeout( state.previewTimer );
		}
		state.previewTimer = setTimeout( function () { sendUpdate( section ); }, PREVIEW_DEBOUNCE_MS );
	}

	function post( message ) {
		if ( ! frame || ! frame.contentWindow || state.previewRevision ) {
			return;
		}
		frame.contentWindow.postMessage( message, window.location.origin );
	}

	function sendUpdate( section ) {
		if ( ! section || ! state.page ) {
			return;
		}
		post( { source: 'gcalls-content-studio', type: 'preview-update', route: state.page.path, section: section, fields: state.values[ section ] || {} } );
		previewStatus.textContent = 'Preview cập nhật lúc ' + new Date().toLocaleTimeString();
	}

	function sendFocus( section ) {
		if ( ! state.page ) {
			return;
		}
		var focusDef = ( state.page.sections || [] ).filter( function ( s ) { return s.key === section; } )[ 0 ];
		post( { source: 'gcalls-content-studio', type: 'preview-focus', route: state.page.path, section: section, selector: focusDef ? focusDef.previewSelector : undefined } );
	}

	window.addEventListener( 'message', function ( event ) {
		if ( event.origin !== window.location.origin ) {
			return;
		}
		if ( ! frame || event.source !== frame.contentWindow ) {
			return;
		}
		var d = event.data;
		if ( ! d || 'gcalls-react-shell' !== d.source ) {
			return;
		}
		if ( 'preview-ready' === d.type ) {
			state.previewReady = true;
			previewStatus.textContent = 'Preview sẵn sàng (' + ( d.route || '' ) + ').';
			// Push every section's working copy so the whole page reflects unsaved edits.
			Object.keys( state.values ).forEach( function ( key ) {
				post( { source: 'gcalls-content-studio', type: 'preview-update', route: state.page.path, section: key, fields: state.values[ key ] } );
			} );
			if ( state.section ) {
				sendFocus( state.section );
			}
		}
	} );

	/* ───────────────────────── unsaved guard ───────────────────────── */

	window.addEventListener( 'beforeunload', function ( e ) {
		if ( isDirty() ) {
			e.preventDefault();
			e.returnValue = i18n( 'unsaved', 'Bạn có thay đổi chưa lưu.' );
			return e.returnValue;
		}
		return undefined;
	} );

	/* ───────────────────────── boot ───────────────────────── */

	renderPreviewShell();
	renderPages();
	renderEditor( true );
	loadList().then( function () {
		var initial = ( new URLSearchParams( window.location.search ).get( 'route' ) ) || ( state.pages[ 0 ] && state.pages[ 0 ].key );
		if ( initial && state.pages.some( function ( p ) { return p.key === initial; } ) ) {
			loadPage( initial );
		}
	} );
} )();
