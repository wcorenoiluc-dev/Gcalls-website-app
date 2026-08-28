/**
 * Cost estimator — the WordPress port of src/components/estimator/.
 *
 * THIS TOOL DOES NOT PRICE ANYTHING, AND THAT IS THE POINT.
 * The React original gates every number behind PRICING_CONFIGURED, which is
 * false, because no rate table has been approved. The result panel therefore
 * ends on "Chi phí theo cấu hình" and a request to talk to Gcalls. The gate is
 * carried over literally: `config.pricingConfigured` is read from the generated
 * config and there is no arithmetic here to run if it were ever true, so this
 * file cannot start inventing totals.
 *
 * No framework and no build step. The questionnaire is data, the steps are a
 * small state machine, and everything is rendered with DOM calls rather than
 * innerHTML so a label containing `<` cannot become markup.
 */
(function () {
  'use strict'

  var root = document.querySelector('[data-gcalls-estimator]')
  if (!root) return

  var config = null
  try {
    config = JSON.parse(root.getAttribute('data-config') || 'null')
  } catch (error) {
    return
  }
  if (!config || !config.solutions || !config.solutions.length) return

  var state = { step: 1, solutionId: null, answers: {} }

  function el(tag, className, text) {
    var node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined && text !== null) node.textContent = String(text)
    return node
  }

  function solution() {
    return config.solutions.filter(function (s) { return s.id === state.solutionId })[0] || null
  }

  function fieldsForStep(step) {
    var current = solution()
    if (!current) return []
    return current.fields.filter(function (f) { return f.step === step })
  }

  /* ---------------------------------------------------------------- steps */

  function renderStepper() {
    var labels = ['Chọn giải pháp', 'Quy mô', 'Yêu cầu thêm', 'Kết quả']
    var wrap = el('ol', 'gcalls-est__steps')

    labels.forEach(function (label, index) {
      var number = index + 1
      var item = el('li', 'gcalls-est__step' + (number === state.step ? ' is-current' : '') + (number < state.step ? ' is-done' : ''))
      item.appendChild(el('span', 'gcalls-est__step-num', number))
      item.appendChild(el('span', 'gcalls-est__step-label', label))
      if (number === state.step) item.setAttribute('aria-current', 'step')
      wrap.appendChild(item)
    })

    return wrap
  }

  function renderSolutions() {
    var wrap = el('div', 'gcalls-est__cards')

    config.solutions.forEach(function (item) {
      var card = el('button', 'gcalls-est__card' + (state.solutionId === item.id ? ' is-selected' : ''))
      card.type = 'button'
      card.setAttribute('aria-pressed', state.solutionId === item.id ? 'true' : 'false')
      card.appendChild(el('span', 'gcalls-est__card-name', item.name))
      card.appendChild(el('span', 'gcalls-est__card-use', item.useCase))
      card.addEventListener('click', function () {
        state.solutionId = item.id
        state.answers = {}
        // Number fields start at the value the React form starts at, so the
        // two tools produce the same summary from the same clicks.
        item.fields.forEach(function (field) {
          if (field.type === 'number' && field.defaultValue !== null) state.answers[field.id] = field.defaultValue
          if (field.type === 'multi') state.answers[field.id] = []
        })
        state.step = 2
        render()
      })
      wrap.appendChild(card)
    })

    return wrap
  }

  function renderField(field) {
    var wrap = el('div', 'gcalls-est__field')
    var id = 'gcalls-est-' + field.id

    var label = el('label', 'gcalls-est__label', field.label + (field.unit ? ' (' + field.unit + ')' : ''))
    label.setAttribute('for', id)
    wrap.appendChild(label)

    if (field.hint) wrap.appendChild(el('p', 'gcalls-est__hint', field.hint))

    if (field.type === 'number') {
      var number = document.createElement('input')
      number.type = 'number'
      number.id = id
      number.className = 'gcalls-est__input'
      if (field.min !== null) number.min = field.min
      if (field.max !== null) number.max = field.max
      number.value = state.answers[field.id] !== undefined ? state.answers[field.id] : ''
      number.addEventListener('input', function () {
        var value = parseInt(number.value, 10)
        state.answers[field.id] = isNaN(value) ? undefined : value
      })
      wrap.appendChild(number)
      return wrap
    }

    if (field.type === 'boolean') {
      var boxWrap = el('label', 'gcalls-est__check')
      var box = document.createElement('input')
      box.type = 'checkbox'
      box.id = id
      box.checked = state.answers[field.id] === true
      box.addEventListener('change', function () { state.answers[field.id] = box.checked })
      boxWrap.appendChild(box)
      boxWrap.appendChild(el('span', null, 'Có'))
      wrap.appendChild(boxWrap)
      return wrap
    }

    if (field.type === 'select') {
      var select = document.createElement('select')
      select.id = id
      select.className = 'gcalls-est__input'
      var blank = document.createElement('option')
      blank.value = ''
      blank.textContent = '— Chọn —'
      select.appendChild(blank)
      ;(field.options || []).forEach(function (option) {
        var node = document.createElement('option')
        node.value = option.value
        node.textContent = option.label
        if (state.answers[field.id] === option.value) node.selected = true
        select.appendChild(node)
      })
      select.addEventListener('change', function () { state.answers[field.id] = select.value || undefined })
      wrap.appendChild(select)
      return wrap
    }

    // multi
    var group = el('div', 'gcalls-est__multi')
    ;(field.options || []).forEach(function (option) {
      var item = el('label', 'gcalls-est__check')
      var box = document.createElement('input')
      box.type = 'checkbox'
      box.value = option.value
      box.checked = (state.answers[field.id] || []).indexOf(option.value) !== -1
      box.addEventListener('change', function () {
        var current = state.answers[field.id] || []
        if (box.checked) current = current.concat([option.value])
        else current = current.filter(function (v) { return v !== option.value })
        state.answers[field.id] = current
      })
      item.appendChild(box)
      item.appendChild(el('span', null, option.label))
      group.appendChild(item)
    })
    wrap.appendChild(group)
    return wrap
  }

  /* --------------------------------------------------------- result panel */

  function labelFor(fieldId, value) {
    var current = solution()
    if (!current) return value
    var field = current.fields.filter(function (f) { return f.id === fieldId })[0]
    if (!field || !field.options) return value
    var option = field.options.filter(function (o) { return o.value === value })[0]
    return option ? option.label : value
  }

  /** Mirrors recommend() in src/lib/estimate.ts, driven by the exported rules. */
  function recommendations() {
    var rules = config.recommendationRules[state.solutionId] || []
    var out = []

    rules.forEach(function (rule) {
      if (rule.when && state.answers[rule.when.field] !== rule.when.equals) return
      var found = config.solutions.filter(function (s) { return s.id === rule.consider })[0]
      if (found && found.id !== state.solutionId && out.indexOf(found) === -1) out.push(found)
    })

    return out
  }

  function summaryRows() {
    var current = solution()
    var rows = []

    current.fields.forEach(function (field) {
      var value = state.answers[field.id]
      if (value === undefined || value === null || value === '') return
      if (Array.isArray(value)) {
        if (!value.length) return
        rows.push([field.label, value.map(function (v) { return labelFor(field.id, v) }).join(', ')])
        return
      }
      if (field.type === 'boolean') {
        if (value !== true) return
        rows.push([field.label, 'Có'])
        return
      }
      if (field.type === 'select') {
        rows.push([field.label, labelFor(field.id, value)])
        return
      }
      rows.push([field.label, String(value) + (field.unit ? ' ' + field.unit : '')])
    })

    return rows
  }

  function renderResult() {
    var current = solution()
    var wrap = el('div', 'gcalls-est__result')

    wrap.appendChild(el('h3', 'gcalls-est__result-title', 'Cấu hình đề xuất'))

    var primary = el('div', 'gcalls-est__primary')
    primary.appendChild(el('span', 'gcalls-est__primary-label', 'Giải pháp chính'))
    primary.appendChild(el('strong', 'gcalls-est__primary-name', current.name))
    wrap.appendChild(primary)

    var consider = recommendations()
    if (consider.length) {
      wrap.appendChild(el('p', 'gcalls-est__consider-label', 'Có thể cân nhắc thêm'))
      var list = el('ul', 'gcalls-est__consider')
      consider.forEach(function (item) {
        var li = document.createElement('li')
        var link = document.createElement('a')
        link.href = item.path
        link.textContent = item.name
        li.appendChild(link)
        list.appendChild(li)
      })
      wrap.appendChild(list)
    }

    var rows = summaryRows()
    if (rows.length) {
      var table = el('table', 'gcalls-est__summary')
      var tbody = document.createElement('tbody')
      rows.forEach(function (row) {
        var tr = document.createElement('tr')
        var th = el('th', null, row[0])
        var td = el('td', null, row[1])
        tr.appendChild(th)
        tr.appendChild(td)
        tbody.appendChild(tr)
      })
      table.appendChild(tbody)
      wrap.appendChild(table)
    }

    // The price gate. There is no branch that produces a number, by design.
    var price = el('div', 'gcalls-est__price')
    price.appendChild(el('span', 'gcalls-est__price-label', config.priceUnavailableLabel))
    price.appendChild(el('p', 'gcalls-est__price-supporting', config.priceUnavailableSupporting))
    wrap.appendChild(price)

    var cta = document.createElement('a')
    cta.className = 'gcalls-cta gcalls-cta--primary'
    cta.href = root.getAttribute('data-lead-url') + '?intent=quote&source=cost-estimator&solution=' + encodeURIComponent(current.name)
    cta.textContent = 'Nhận tư vấn cấu hình'
    wrap.appendChild(cta)

    return wrap
  }

  /* ------------------------------------------------------------- controls */

  function renderNav() {
    var nav = el('div', 'gcalls-est__nav')

    if (state.step > 1) {
      var back = el('button', 'gcalls-cta gcalls-cta--secondary', 'Quay lại')
      back.type = 'button'
      back.addEventListener('click', function () { state.step -= 1; render() })
      nav.appendChild(back)
    }

    if (state.step === 2 || state.step === 3) {
      var next = el('button', 'gcalls-cta gcalls-cta--primary', state.step === 3 ? 'Xem kết quả' : 'Tiếp tục')
      next.type = 'button'
      next.addEventListener('click', function () {
        // Step 3 is skipped when the chosen solution asks nothing there.
        if (state.step === 2 && !fieldsForStep(3).length) state.step = 4
        else state.step += 1
        render()
      })
      nav.appendChild(next)
    }

    if (state.step === 4) {
      var restart = el('button', 'gcalls-cta gcalls-cta--secondary', 'Bắt đầu lại')
      restart.type = 'button'
      restart.addEventListener('click', function () {
        state = { step: 1, solutionId: null, answers: {} }
        render()
      })
      nav.appendChild(restart)
    }

    return nav
  }

  function render() {
    root.textContent = ''
    root.appendChild(renderStepper())

    var body = el('div', 'gcalls-est__body')

    if (state.step === 1) {
      body.appendChild(el('p', 'gcalls-est__lead', 'Chọn giải pháp gần nhất với nhu cầu hiện tại của doanh nghiệp.'))
      body.appendChild(renderSolutions())
    } else if (state.step === 2 || state.step === 3) {
      var fields = fieldsForStep(state.step)
      if (!fields.length) {
        body.appendChild(el('p', 'gcalls-est__lead', 'Không có câu hỏi nào ở bước này.'))
      }
      fields.forEach(function (field) { body.appendChild(renderField(field)) })
    } else {
      body.appendChild(renderResult())
    }

    root.appendChild(body)
    root.appendChild(renderNav())
  }

  render()
})()
