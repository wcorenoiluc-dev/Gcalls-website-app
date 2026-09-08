/**
 * GCALLS-050 — the Gcalls illustration system.
 *
 * WHY EIGHT ARCHETYPES AND NOT ONE TEMPLATE
 * The brief is explicit: "Đa dạng tình huống và cách minh hoạ; không dùng một
 * mẫu cho tất cả bài." One title-on-gradient template stamped 163 times would
 * satisfy the letter of "every article has a featured image" while failing the
 * actual request. So the archetype is chosen from what the article IS — a
 * process piece gets a flow, a comparison gets two columns, an infrastructure
 * piece gets a stack.
 *
 * WHAT NONE OF THEM WILL DO
 * No archetype accepts a metric, a percentage, a price or a KPI. That is
 * deliberate and structural: the project has already shipped invented figures
 * ("1,248 total calls", "CSAT 4.7/5") inside fake product screenshots once.
 * An archetype that cannot take a number cannot repeat that. Labels only, and
 * every label is supposed to come from the article's own headings.
 */

const C = {
  purple: '#673AB7',
  purpleDeep: '#4A2A85',
  purpleSoft: '#EFEBF5',
  purpleTint: '#F7F5FA',
  line: '#E3DCEE',
  ink: '#191324',
  muted: '#5C5568',
  white: '#FFFFFF',
  accent: '#00A88F',
}

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const shell = (body, w, h) => `<!doctype html><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px}
body{font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
  background:${C.white};color:${C.ink};overflow:hidden;position:relative;-webkit-font-smoothing:antialiased}
.rail{position:absolute;top:0;left:0;right:0;height:9px;background:${C.purple};z-index:5}
.kicker{font-size:19px;letter-spacing:.15em;text-transform:uppercase;color:${C.purple};font-weight:800}
.title{font-weight:800;letter-spacing:-.022em;line-height:1.12;color:${C.ink}}
.cap{position:absolute;left:0;right:0;bottom:0;padding:14px 56px;font-size:16px;color:${C.muted};
  background:${C.purpleTint};border-top:1px solid ${C.line};z-index:5}
.node{background:${C.white};border:1.5px solid ${C.line};border-radius:14px;
  box-shadow:0 2px 10px rgba(25,19,36,.05)}
</style><body>${body}</body>`

/* A quiet ground so the page is never a flat white rectangle. Purely
 * geometric — no imagery, nothing that could read as a product UI. */
const ground = (variant = 0) => {
  const g = [
    `<div style="position:absolute;right:-140px;top:-140px;width:560px;height:560px;border-radius:50%;
      background:radial-gradient(circle at 32% 32%,rgba(103,58,183,.16),rgba(103,58,183,.03) 70%)"></div>`,
    `<div style="position:absolute;left:0;top:0;right:0;bottom:0;
      background:linear-gradient(135deg,${C.purpleTint} 0%,${C.white} 55%)"></div>
     <div style="position:absolute;right:64px;bottom:-90px;width:360px;height:360px;border-radius:44px;
      transform:rotate(24deg);background:rgba(103,58,183,.07)"></div>`,
    `<div style="position:absolute;inset:0;background:${C.purpleTint}"></div>
     <div style="position:absolute;inset:0;opacity:.5;background-image:
      linear-gradient(${C.line} 1px,transparent 1px),linear-gradient(90deg,${C.line} 1px,transparent 1px);
      background-size:48px 48px"></div>`,
  ][variant % 3]
  return g
}

const head = (spec, titleSize = 46, width = 660) => `
  <div style="position:relative;z-index:2">
    <div class="kicker">${esc(spec.kicker)}</div>
    <div class="title" style="font-size:${titleSize}px;margin-top:16px;max-width:${width}px">${esc(spec.headline)}</div>
  </div>`

const caption = (spec) => spec.caption ? `<div class="cap">${esc(spec.caption)}</div>` : ''

const chip = (t, i, total) => {
  /* Stage colour deepens along the sequence so direction reads without arrows
   * carrying meaning of their own. */
  const mix = total < 2 ? 0 : i / (total - 1)
  const bg = `color-mix(in srgb, ${C.purple} ${8 + mix * 16}%, ${C.white})`
  return `<div class="node" style="flex:1;padding:20px 18px;background:${bg};border-color:rgba(103,58,183,.22)">
    <div style="font-size:13px;font-weight:800;color:${C.purple};letter-spacing:.1em">${String(i + 1).padStart(2, '0')}</div>
    <div style="font-size:19px;font-weight:700;margin-top:8px;line-height:1.25">${esc(t)}</div>
  </div>`
}

export const ARCHETYPES = {
  /* Sequential stages. For quy trình / N bước / how-to. */
  PROCESS_FLOW: {
    body: (s) => {
      const els = (s.elements ?? []).slice(0, 5)
      return `<div class="rail"></div>${ground(1)}
      <div style="position:absolute;left:56px;right:56px;top:9px;bottom:50px;display:flex;flex-direction:column;justify-content:center">
        ${head(s, 42, 720)}
        <div style="display:flex;gap:14px;align-items:stretch;margin-top:38px">
          ${els.map((e, i) => chip(e, i, els.length)).join(
            `<div style="align-self:center;color:${C.purple};font-size:26px;font-weight:800">›</div>`)}
        </div>
      </div>${caption(s)}`
    },
  },

  /* Two labelled sides. For A-vs-B. Never asserts which side wins. */
  SPLIT_COMPARE: {
    body: (s) => {
      const [l = {}, r = {}] = s.elements ?? []
      const col = (o, tint) => `<div class="node" style="flex:1;padding:26px 24px;background:${tint}">
        <div style="font-size:24px;font-weight:800;color:${C.ink}">${esc(o.label ?? o)}</div>
        <div style="height:2px;background:${C.line};margin:16px 0"></div>
        ${(o.points ?? []).slice(0, 4).map((p) => `<div style="font-size:17px;color:${C.muted};
          line-height:1.5;margin-bottom:9px">• ${esc(p)}</div>`).join('')}
      </div>`
      return `<div class="rail"></div>${ground(0)}
      <div style="position:absolute;left:56px;right:56px;top:9px;bottom:50px;display:flex;flex-direction:column;justify-content:center">
        ${head(s, 40, 760)}
        <div style="display:flex;gap:20px;align-items:stretch;margin-top:32px">
          ${col(l, C.white)}
          <div style="align-self:center;font-size:20px;font-weight:800;color:${C.purple}">vs</div>
          ${col(r, C.purpleTint)}
        </div>
      </div>${caption(s)}`
    },
  },

  /* Tiers. For IVR / SIP trunk / VoIP / ACD infrastructure pieces. */
  LAYERED_STACK: {
    body: (s) => {
      const els = (s.elements ?? []).slice(0, 4)
      return `<div class="rail"></div>${ground(2)}
      <div style="position:absolute;left:56px;right:56px;top:9px;bottom:50px;display:flex;gap:40px;align-items:center">
        <div style="flex:1">${head(s, 40, 440)}</div>
        <div style="width:520px;display:flex;flex-direction:column;gap:12px;margin-top:6px">
          ${els.map((e, i) => `<div class="node" style="padding:18px 22px;
            background:color-mix(in srgb, ${C.purple} ${6 + i * 7}%, ${C.white});
            border-color:rgba(103,58,183,.20)">
            <div style="font-size:20px;font-weight:700">${esc(e)}</div>
          </div>`).join('')}
        </div>
      </div>${caption(s)}`
    },
  },

  /* A grid of named criteria. For chỉ số / tiêu chí — names only, no values. */
  CRITERIA_GRID: {
    body: (s) => {
      const els = (s.elements ?? []).slice(0, 6)
      return `<div class="rail"></div>${ground(0)}
      <div style="position:absolute;left:56px;right:56px;top:9px;bottom:50px;display:flex;flex-direction:column;justify-content:center">
        ${head(s, 40, 700)}
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:32px">
          ${els.map((e, i) => `<div class="node" style="padding:18px 18px;background:${i % 2 ? C.purpleTint : C.white}">
            <div style="width:30px;height:30px;border-radius:9px;background:${C.purpleSoft};
              color:${C.purple};font-weight:800;font-size:14px;display:flex;align-items:center;
              justify-content:center">${i + 1}</div>
            <div style="font-size:17px;font-weight:650;margin-top:10px;line-height:1.3">${esc(e)}</div>
          </div>`).join('')}
        </div>
      </div>${caption(s)}`
    },
  },

  /* One term, radiating attributes. For "X là gì". */
  DEFINITION_ANCHOR: {
    body: (s) => {
      const els = (s.elements ?? []).slice(0, 4)
      return `<div class="rail"></div>${ground(1)}
      <div style="position:absolute;left:56px;right:56px;top:9px;bottom:50px;display:flex;gap:46px;align-items:center">
        <div style="flex:1">${head(s, 46, 460)}</div>
        <div style="width:470px;position:relative">
          <div style="background:${C.purple};color:${C.white};border-radius:18px;padding:22px 24px;
            font-size:24px;font-weight:800;text-align:center">${esc(s.anchor ?? s.kicker)}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
            ${els.map((e) => `<div class="node" style="padding:14px 16px;font-size:16px;
              font-weight:600;line-height:1.35">${esc(e)}</div>`).join('')}
          </div>
        </div>
      </div>${caption(s)}`
    },
  },

  /* Channels converging on one desk. For omnichannel / hợp nhất hội thoại. */
  CHANNEL_MAP: {
    body: (s) => {
      const els = (s.elements ?? []).slice(0, 5)
      return `<div class="rail"></div>${ground(2)}
      <div style="position:absolute;left:56px;right:56px;top:9px;bottom:50px;display:flex;flex-direction:column;justify-content:center">
        ${head(s, 40, 660)}
        <div style="display:flex;align-items:center;gap:26px;margin-top:36px">
          <div style="display:flex;flex-direction:column;gap:10px;width:300px">
            ${els.map((e) => `<div class="node" style="padding:13px 16px;font-size:17px;font-weight:650">${esc(e)}</div>`).join('')}
          </div>
          <svg width="150" height="200" style="flex:none">
            ${els.map((_, i) => {
              const y = 22 + i * (156 / Math.max(1, els.length - 1 || 1))
              return `<path d="M0 ${y} C 70 ${y}, 80 100, 148 100" fill="none"
                stroke="${C.purple}" stroke-opacity=".38" stroke-width="2.5"/>`
            }).join('')}
            <circle cx="148" cy="100" r="6" fill="${C.purple}"/>
          </svg>
          <div class="node" style="flex:1;padding:26px 24px;background:${C.purpleSoft};
            border-color:rgba(103,58,183,.25)">
            <div style="font-size:22px;font-weight:800;color:${C.purpleDeep}">${esc(s.anchor ?? 'Một nơi xử lý')}</div>
            <div style="font-size:16px;color:${C.muted};margin-top:8px;line-height:1.45">${esc(s.anchorNote ?? '')}</div>
          </div>
        </div>
      </div>${caption(s)}`
    },
  },

  /* Horizontal progression. For trends / tương lai. No dates unless given. */
  TIMELINE_TREND: {
    body: (s) => {
      const els = (s.elements ?? []).slice(0, 4)
      return `<div class="rail"></div>${ground(1)}
      <div style="position:absolute;left:56px;right:56px;top:9px;bottom:50px;display:flex;flex-direction:column;justify-content:center">
        ${head(s, 42, 720)}
        <div style="position:relative;margin-top:34px;padding-top:26px">
          <div style="position:absolute;left:0;right:0;top:6px;height:3px;background:${C.line}"></div>
          <div style="display:flex;gap:16px">
            ${els.map((e, i) => `<div style="flex:1;position:relative">
              <div style="position:absolute;top:-30px;left:0;width:15px;height:15px;border-radius:50%;
                background:${C.purple};opacity:${0.4 + i * 0.2}"></div>
              <div style="font-size:18px;font-weight:700;line-height:1.3">${esc(e)}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>${caption(s)}`
    },
  },

  /* Two abstract parties and a handoff. For telesales / CSKH / soft-skill. */
  CONVERSATION_MOMENT: {
    body: (s) => {
      const els = (s.elements ?? []).slice(0, 3)
      const bubble = (t, right) => `<div style="max-width:330px;align-self:${right ? 'flex-end' : 'flex-start'};
        background:${right ? C.purple : C.white};color:${right ? C.white : C.ink};
        border:1.5px solid ${right ? C.purple : C.line};border-radius:${right ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
        padding:15px 18px;font-size:17px;font-weight:600;line-height:1.4;
        box-shadow:0 2px 10px rgba(25,19,36,.06)">${esc(t)}</div>`
      return `<div class="rail"></div>${ground(0)}
      <div style="position:absolute;left:56px;right:56px;top:9px;bottom:50px;display:flex;gap:44px;align-items:center">
        <div style="flex:1">${head(s, 40, 430)}</div>
        <div style="width:470px;display:flex;flex-direction:column;gap:13px;margin-top:8px">
          ${els.map((e, i) => bubble(e, i % 2 === 1)).join('')}
        </div>
      </div>${caption(s)}`
    },
  },
}

/* Aliases, so a spec written with a near-miss name still renders rather than
 * silently dropping an article's cover. */
ARCHETYPES.FLOW = ARCHETYPES.PROCESS_FLOW
ARCHETYPES.COMPARISON = ARCHETYPES.SPLIT_COMPARE
ARCHETYPES.STACK = ARCHETYPES.LAYERED_STACK
ARCHETYPES.GRID = ARCHETYPES.CRITERIA_GRID
ARCHETYPES.DEFINITION = ARCHETYPES.DEFINITION_ANCHOR
ARCHETYPES.TIMELINE = ARCHETYPES.TIMELINE_TREND
ARCHETYPES.CONVERSATION = ARCHETYPES.CONVERSATION_MOMENT
