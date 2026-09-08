/**
 * Interaction engine for the product mockups.
 *
 * ONE ENGINE, NOT SEVEN
 * All seven ported components do the same four things: switch a tab, select an
 * item from a list, advance a progress bar, and count a timer. Written per
 * mockup that would be four bugs repeated seven times; written once it is four
 * behaviours with one place to fix them.
 *
 * MOTION SAFETY, AND WHY EACH RULE IS HERE
 * - prefers-reduced-motion: no timers start at all. Someone who has asked the
 *   operating system to stop moving things has asked this page too, and a
 *   progress bar crawling in the corner is exactly what that setting is about.
 * - document.hidden: timers pause on a background tab. A demo left open in a
 *   second tab should not spend the reviewer's battery advancing a bar nobody
 *   is looking at, and it should not be at 0:47 when they come back either.
 * - Nothing here changes an element's size. Every animated value is a width
 *   percentage inside a track that already has its height, or text inside a
 *   fixed-width slot, so no frame can shift the layout below it.
 * - Every control is a real <button> with aria-selected, so the whole thing
 *   works from the keyboard without any extra code.
 */
(function () {
  'use strict'

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var timers = []

  /** setInterval that registers itself so visibility can pause the lot. */
  function every(ms, fn) {
    if (reduced) return
    timers.push({ ms: ms, fn: fn, id: null })
  }

  function startAll() {
    timers.forEach(function (t) {
      if (t.id === null) t.id = window.setInterval(t.fn, t.ms)
    })
  }

  function stopAll() {
    timers.forEach(function (t) {
      if (t.id !== null) {
        window.clearInterval(t.id)
        t.id = null
      }
    })
  }

  function selectIn(root, attr, value) {
    var buttons = root.querySelectorAll('[' + attr + ']')
    Array.prototype.forEach.call(buttons, function (button) {
      button.setAttribute('aria-selected', button.getAttribute(attr) === value ? 'true' : 'false')
    })
  }

  /** Tabs that filter a list by data-mock-type. */
  function wireFilters(root) {
    var tabs = root.querySelectorAll('[data-mock-tab]')
    if (!tabs.length) return

    Array.prototype.forEach.call(tabs, function (tab) {
      tab.addEventListener('click', function () {
        var value = tab.getAttribute('data-mock-tab')
        selectIn(root, 'data-mock-tab', value)

        Array.prototype.forEach.call(root.querySelectorAll('[data-mock-type]'), function (row) {
          row.hidden = value !== 'all' && row.getAttribute('data-mock-type') !== value
        })
      })
    })
  }

  /** A list whose selection shows the matching panel. */
  function wirePanels(root) {
    var buttons = root.querySelectorAll('[data-mock-select]')
    if (!buttons.length) return

    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-mock-select')
        selectIn(root, 'data-mock-select', value)

        Array.prototype.forEach.call(root.querySelectorAll('[data-mock-panel]'), function (panel) {
          panel.hidden = panel.getAttribute('data-mock-panel') !== value
        })
      })
    })
  }

  /** An approved screenshot gallery with tabs and arrow-key navigation. */
  function wireGallery(root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-gallery-tab]'))
    if (!tabs.length) return

    function activate(tab) {
      var value = tab.getAttribute('data-gallery-tab')
      selectIn(root, 'data-gallery-tab', value)
      tabs.forEach(function (item) { item.tabIndex = item === tab ? 0 : -1 })
      Array.prototype.forEach.call(root.querySelectorAll('[data-gallery-panel]'), function (panel) {
        panel.hidden = panel.getAttribute('data-gallery-panel') !== value
      })
    }

    tabs.forEach(function (tab, index) {
      tab.tabIndex = index === 0 ? 0 : -1
      tab.addEventListener('click', function () { activate(tab) })
      tab.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        event.preventDefault()
        var direction = event.key === 'ArrowRight' ? 1 : -1
        var next = tabs[(index + direction + tabs.length) % tabs.length]
        activate(next)
        next.focus()
      })
    })
  }

  /** The playback bar. Advances only while "playing". */
  function wirePlayer(root) {
    var play = root.querySelector('[data-mock-play]')
    var fill = root.querySelector('[data-mock-progress]')
    var time = root.querySelector('[data-mock-elapsed]')
    if (!play || !fill) return

    var percent = parseInt(fill.style.width, 10) || 0
    var playing = false

    function paint() {
      fill.style.width = percent + '%'
      if (time) {
        var seconds = Math.round((percent / 100) * 100)
        time.textContent = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0')
      }
    }

    play.addEventListener('click', function () {
      playing = !playing
      play.setAttribute('aria-pressed', playing ? 'true' : 'false')
      play.querySelector('[aria-hidden]').textContent = playing ? '❚❚' : '▶'
    })

    every(700, function () {
      if (!playing) return
      percent = percent >= 100 ? 0 : percent + 2
      paint()
    })
  }

  /** The call timer on an agent row. */
  function wireTimer(root) {
    var slot = root.querySelector('[data-mock-timer]')
    if (!slot) return

    var seconds = 42

    every(1000, function () {
      seconds += 1
      slot.textContent = String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0')
    })
  }

  /** The chart's range switch. Bars are re-scaled, never re-created. */
  function wireChart(root) {
    var chart = root.querySelector('[data-mock-series]')
    var ranges = root.querySelectorAll('[data-mock-range]')
    if (!chart || !ranges.length) return

    var series
    try {
      series = JSON.parse(chart.getAttribute('data-mock-series'))
    } catch (error) {
      return
    }

    var bars = chart.querySelectorAll('[data-mock-bar]')

    Array.prototype.forEach.call(ranges, function (button) {
      button.addEventListener('click', function () {
        var key = button.getAttribute('data-mock-range')
        var values = series[key]
        if (!values) return

        selectIn(root, 'data-mock-range', key)

        var max = Math.max.apply(null, values)
        Array.prototype.forEach.call(bars, function (bar, index) {
          bar.style.height = Math.round((values[index] / max) * 100) + '%'
        })
      })
    })
  }

  /**
   * The incoming-call popup: ringing → connected, or ringing → ended.
   *
   * The reference also drops out of ringing on a timer after 2.8s. That is
   * not reproduced: a state that changes on its own while nobody is looking
   * is a distraction on a marketing page, and the point of porting this as
   * markup rather than a screenshot is that the visitor can cause the change
   * themselves. Answering is what demonstrates the moment.
   */
  function wirePopup(root) {
    var pop = root.querySelector('[data-mock-pop]')
    if (!pop) return

    var label = pop.querySelector('[data-mock-pop-state]')
    var answer = pop.querySelector('[data-mock-pop-answer]')
    var reject = pop.querySelector('[data-mock-pop-reject]')

    function setState(cls, text) {
      pop.classList.remove('is-connected', 'is-ended')
      if (cls) pop.classList.add(cls)
      // textContent only. Every mockup in this file builds text and DOM
      // nodes rather than assigning markup, and that rule has no exceptions.
      if (label) label.textContent = text
    }

    if (answer) {
      answer.addEventListener('click', function () {
        setState('is-connected', 'Đã kết nối')
      })
    }

    if (reject) {
      reject.addEventListener('click', function () {
        setState('is-ended', 'Đã kết thúc')
      })
    }
  }

  /** The call-button widget: the fab opens and closes the callback panel. */
  function wireWidget(root) {
    var widget = root.querySelector('[data-mock-widget]')
    if (!widget) return

    var toggle = widget.querySelector('[data-mock-widget-toggle]')
    var panel = widget.querySelector('[data-mock-widget-panel]')
    if (!toggle || !panel) return

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true'
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true')
      panel.hidden = open
    })
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-gcalls-mock]'), function (root) {
    wireFilters(root)
    wirePanels(root)
    wireGallery(root)
    wirePlayer(root)
    wireTimer(root)
    wireChart(root)
    wirePopup(root)
    wireWidget(root)
  })

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopAll()
    else startAll()
  })

  if (!document.hidden) startAll()
})()
