/**
 * Homepage operational-loss estimator — the WordPress port of
 * src/components/home/LossEstimator.tsx.
 *
 * THE FORMULA IS DUPLICATED, AND THAT DUPLICATION IS TESTED
 * There is no build step here, so the arithmetic cannot be imported from the
 * TypeScript module the React app uses. It is reimplemented below, and
 * wordpress/scripts/test-loss-estimator.mjs runs this file and that module over
 * the same grid of inputs and fails the build if they disagree anywhere. The
 * functions are hung off `window.gcallsLossEstimate` for exactly that reason.
 *
 * WHY roundHalfUpToStep IS NOT Math.round(value / step) * step
 * The default input set lands exactly on a rounding tie: 15,750,000 VND, half
 * of a 100,000 step. Neither 12,000,000/176 nor its product with 231 is
 * representable in binary doubles, so the machine computes 15,749,999.999999998
 * and Math.round returns the step BELOW — printing 15.700.000 ₫ where the
 * arithmetic says 15.800.000 ₫. toPrecision(12) collapses that ~1e-16 relative
 * noise before the comparison so half-up can act on the tie. Twelve digits is
 * coarser than double precision and far finer than anything this widget shows.
 *
 * Everything here is display-only rounding. The intermediates stay unrounded,
 * exactly as the approved formula requires.
 */
;(function () {
  'use strict'

  /* ------------------------------------------------------------- maths */

  function clampField(field, value) {
    if (typeof value !== 'number' || !isFinite(value)) return field.default
    return Math.min(field.max, Math.max(field.min, value))
  }

  function roundHalfUpToStep(value, step) {
    if (typeof value !== 'number' || !isFinite(value)) return 0
    return Math.round(Number((value / step).toPrecision(12))) * step
  }

  function calculateLoss(input) {
    var hourlyCost = input.monthlySalary / (input.workingDays * input.workingHoursPerDay)
    var manualHours = (input.employees * input.workingDays * input.wastedMinutesPerDay) / 60
    var reworkHours = manualHours * (input.errorRatePercent / 100)
    var totalLostHours = manualHours + reworkHours
    var estimatedLoss = totalLostHours * hourlyCost

    return {
      hourlyCost: hourlyCost,
      manualHours: manualHours,
      reworkHours: reworkHours,
      totalLostHours: totalLostHours,
      estimatedLoss: estimatedLoss,
      displayHours: roundHalfUpToStep(totalLostHours, 1),
      displayLoss: roundHalfUpToStep(estimatedLoss, 100000),
    }
  }

  /* --------------------------------------------------------- formatting */

  var vnd = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  })
  var plain = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })

  function formatVnd(value) {
    return vnd.format(value)
  }
  function formatNumber(value) {
    return plain.format(value)
  }

  // The unit suffix each field shows beside its slider. Kept next to the
  // formatter rather than in the config because it IS formatting: the config
  // carries the wording, this decides how a number is spelled.
  function display(field, value) {
    if (field.key === 'monthlySalary') return formatVnd(value)
    if (field.key === 'errorRatePercent') return formatNumber(value) + '%'
    return formatNumber(value) + ' ' + field.unit
  }

  // Exposed for the parity test. Not an API for anything else.
  window.gcallsLossEstimate = {
    clampField: clampField,
    roundHalfUpToStep: roundHalfUpToStep,
    calculateLoss: calculateLoss,
  }

  /* ------------------------------------------------------------ render */

  function el(tag, className, text) {
    var node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined && text !== null) node.textContent = String(text)
    return node
  }

  function defaults(fields) {
    var out = {}
    for (var i = 0; i < fields.length; i += 1) out[fields[i].key] = fields[i].default
    return out
  }

  function build(root) {
    var config
    try {
      config = JSON.parse(root.getAttribute('data-config') || 'null')
    } catch (error) {
      return
    }
    if (!config || !config.fields || !config.fields.length) return

    var fields = config.fields
    var text = config.labels || {}
    var byKey = {}
    for (var i = 0; i < fields.length; i += 1) byKey[fields[i].key] = fields[i]

    var state = defaults(fields)
    var views = []

    function result() {
      var input = {}
      for (var k in state) {
        if (Object.prototype.hasOwnProperty.call(state, k)) {
          input[k] = clampField(byKey[k], state[k])
        }
      }
      return calculateLoss(input)
    }

    /* ---- header ---- */

    var card = el('div', 'gcalls-loss')
    var head = el('div', 'gcalls-loss__head')
    head.appendChild(el('span', 'gcalls-loss__eyebrow', text.eyebrow || ''))

    var heading = el('h3', 'gcalls-loss__title', (text.heading || '') + ' ')
    heading.appendChild(el('span', 'gcalls-loss__title-accent', text.headingAccent || ''))
    head.appendChild(heading)
    head.appendChild(el('p', 'gcalls-loss__intro', text.intro || ''))
    card.appendChild(head)

    var body = el('div', 'gcalls-loss__body')
    var inputs = el('div', 'gcalls-loss__inputs')
    var grid = el('div', 'gcalls-loss__grid')

    /* ---- one field ---- */

    fields.forEach(function (field) {
      var wrap = el('div', 'gcalls-loss__field')
      var sliderId = 'gcalls-loss-' + field.key
      var numberId = sliderId + '-num'
      var hintId = sliderId + '-hint'

      var top = el('div', 'gcalls-loss__field-top')
      var label = el('label', 'gcalls-loss__label', field.label)
      label.setAttribute('for', sliderId)
      var value = el('span', 'gcalls-loss__value', display(field, state[field.key]))
      top.appendChild(label)
      top.appendChild(value)
      wrap.appendChild(top)

      var hint = el('p', 'gcalls-loss__hint', field.hint)
      hint.id = hintId
      wrap.appendChild(hint)

      var slider = el('input', 'gcalls-loss__slider')
      slider.type = 'range'
      slider.id = sliderId
      slider.min = field.min
      slider.max = field.max
      slider.step = field.step
      slider.value = state[field.key]
      slider.setAttribute('aria-describedby', hintId)
      wrap.appendChild(slider)

      var row = el('div', 'gcalls-loss__row')
      var number = el('input', 'gcalls-loss__number')
      number.type = 'number'
      number.id = numberId
      number.inputMode = 'numeric'
      number.min = field.min
      number.max = field.max
      number.step = field.step
      number.value = state[field.key]
      number.setAttribute('aria-label', field.label + ' — nhập giá trị (' + field.unit + ')')
      row.appendChild(number)
      row.appendChild(el('span', 'gcalls-loss__unit', field.unit))
      wrap.appendChild(row)

      // The slider is the fast path on a phone; the number box is the only way
      // to enter a salary that is not on a 500,000 VND step.
      slider.addEventListener('input', function () {
        state[field.key] = clampField(field, Number(slider.value))
        number.value = state[field.key]
        paint()
      })

      // Committed on blur and on Enter, never on each keystroke: clamping as
      // you type makes "150" unreachable in a field whose minimum is 22,
      // because the intermediate "1" snaps up the moment it is typed.
      function commit() {
        var cleaned = String(number.value).replace(/[^\d.-]/g, '')
        var parsed = cleaned === '' ? NaN : Number(cleaned)
        // An empty or unparseable box reverts to the value already committed,
        // deliberately not to the field default: someone who clears "250" to
        // retype it has not asked to go back to 10.
        state[field.key] = isFinite(parsed) ? clampField(field, parsed) : state[field.key]
        number.value = state[field.key]
        slider.value = state[field.key]
        paint()
      }

      number.addEventListener('blur', commit)
      number.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault()
          commit()
        }
      })

      views.push(function () {
        value.textContent = display(field, state[field.key])
        slider.value = state[field.key]
        if (document.activeElement !== number) number.value = state[field.key]
      })

      grid.appendChild(wrap)
    })

    inputs.appendChild(grid)

    var reset = el('button', 'gcalls-loss__reset', text.reset || '')
    reset.type = 'button'
    reset.addEventListener('click', function () {
      state = defaults(fields)
      paint()
    })
    inputs.appendChild(reset)
    body.appendChild(inputs)

    /* ---- result ---- */

    var panel = el('div', 'gcalls-loss__result')
    panel.appendChild(el('span', 'gcalls-loss__badge', text.resultBadge || ''))

    var hoursBlock = el('div', 'gcalls-loss__metric')
    hoursBlock.appendChild(el('div', 'gcalls-loss__metric-label', text.hoursLabel || ''))
    var hoursValue = el('div', 'gcalls-loss__metric-value')
    var hoursNumber = el('span', 'gcalls-loss__metric-number', '')
    hoursValue.appendChild(hoursNumber)
    hoursValue.appendChild(el('span', 'gcalls-loss__metric-unit', ' ' + (text.hoursUnit || '')))
    hoursBlock.appendChild(hoursValue)
    panel.appendChild(hoursBlock)

    var costBlock = el('div', 'gcalls-loss__cost')
    costBlock.appendChild(el('div', 'gcalls-loss__metric-label', text.costLabel || ''))
    var costValue = el('div', 'gcalls-loss__cost-value', '')
    costBlock.appendChild(costValue)
    var rate = el('div', 'gcalls-loss__rate', '')
    costBlock.appendChild(rate)
    panel.appendChild(costBlock)

    // Never separated from the figures above it.
    panel.appendChild(el('p', 'gcalls-loss__disclaimer', config.disclaimer || ''))

    var cta = el('a', 'gcalls-loss__cta', text.cta || '')
    cta.href = root.getAttribute('data-cta-url') || '#'
    panel.appendChild(cta)

    body.appendChild(panel)
    card.appendChild(body)

    /* ---- paint ---- */

    function paint() {
      for (var i = 0; i < views.length; i += 1) views[i]()

      var out = result()
      hoursNumber.textContent = formatNumber(out.displayHours)
      costValue.textContent = formatVnd(out.displayLoss)
      rate.textContent = (text.perHour || '{rate}').replace(
        '{rate}',
        formatVnd(roundHalfUpToStep(out.hourlyCost, 1000)),
      )

      var untouched = fields.every(function (field) {
        return state[field.key] === field.default
      })
      reset.disabled = untouched
    }

    // The noscript fallback is only correct while there is no script. Replacing
    // the contents rather than appending is what removes it.
    root.textContent = ''
    root.appendChild(card)
    paint()
  }

  function init() {
    var roots = document.querySelectorAll('[data-gcalls-loss-estimator]')
    for (var i = 0; i < roots.length; i += 1) build(roots[i])
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
