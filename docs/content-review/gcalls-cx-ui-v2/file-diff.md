# Gcalls CX UI V2 — Exact File Diff (commit 736ef8f vs base 9c562e7)

```diff
commit 736ef8fd7e7574bdf474388540c6f158c666fda7
feat(gcalls-cx): neutral illustrative diagrams, no fabricated data, no published media


diff --git a/scripts/gcalls-cx-preview.mjs b/scripts/gcalls-cx-preview.mjs
new file mode 100644
index 0000000..a43eec5
--- /dev/null
+++ b/scripts/gcalls-cx-preview.mjs
@@ -0,0 +1,191 @@
+/**
+ * Preview capture + gate check for /gcalls-cx/ (GCALLS CX UI V2).
+ *
+ * Produces the handover set:
+ *   - full-page shot per breakpoint (1440 / 1280 / 1024 / 768 / 390 / 320)
+ *   - hero crop desktop + mobile
+ *   - a crop of each section that carries a product-visual diagram
+ *   - metrics.json: page/section geometry, H1 census, horizontal overflow,
+ *     image census (broken / upscaled), and the brief's gate checks
+ *   - regression.json: section count / H1 / height / image count / container /
+ *     console errors for the six routes that must stay unchanged
+ *
+ * Usage: node scripts/gcalls-cx-preview.mjs <outDir> [baseUrl]
+ */
+import { chromium } from 'playwright-core'
+import { mkdir, writeFile } from 'node:fs/promises'
+import path from 'node:path'
+
+const OUT = path.resolve(process.argv[2] ?? 'preview')
+const BASE = process.argv[3] ?? 'http://localhost:5199'
+const URL = `${BASE}/gcalls-cx/`
+
+const BREAKPOINTS = [
+  { name: '1440', width: 1440, height: 900 },
+  { name: '1280', width: 1280, height: 900 },
+  { name: '1024', width: 1024, height: 800 },
+  { name: '768', width: 768, height: 900 },
+  { name: '390', width: 390, height: 844 },
+  { name: '320', width: 320, height: 640 },
+]
+
+const REGRESSION_ROUTES = [
+  '/',
+  '/gcalls-plus-webphone/',
+  '/qc-bot-ai/',
+  '/voicebot-ai/',
+  '/san-pham/',
+  '/giai-phap/',
+]
+
+async function settle(page) {
+  await page.evaluate(async () => {
+    window.scrollTo(0, 0)
+    const step = window.innerHeight
+    for (let y = 0; y < document.body.scrollHeight; y += step) {
+      window.scrollTo(0, y)
+      await new Promise((r) => setTimeout(r, 60))
+    }
+    window.scrollTo(0, 0)
+    await Promise.all(
+      Array.from(document.images)
+        .filter((img) => !img.complete)
+        .map((img) => new Promise((r) => { img.onload = img.onerror = r })),
+    )
+  })
+  await page.waitForTimeout(350)
+}
+
+/** Full page analysis: geometry, H1s, overflow, images, container width. */
+async function analyze(page) {
+  return page.evaluate(() => {
+    const root = document.querySelector('main') ?? document.body
+    const sections = Array.from(root.querySelectorAll(':scope > *'))
+    const boxes = sections.map((el) => {
+      const r = el.getBoundingClientRect()
+      const heading = el.querySelector('h1, h2')
+      return {
+        tag: el.tagName.toLowerCase(),
+        label: heading?.textContent?.trim().slice(0, 50) ?? '(no heading)',
+        height: Math.round(r.height),
+      }
+    })
+    const imgs = Array.from(document.images).map((img) => ({
+      src: img.currentSrc || img.src,
+      natural: `${img.naturalWidth}x${img.naturalHeight}`,
+      rendered: `${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)}`,
+      broken: img.complete && img.naturalWidth === 0,
+      upscaled:
+        img.naturalWidth > 0 &&
+        img.getBoundingClientRect().width > img.naturalWidth + 1,
+    }))
+    // widest container (the site's Container primitive)
+    const containers = Array.from(document.querySelectorAll('main *')).map((el) =>
+      Math.round(el.getBoundingClientRect().width),
+    )
+    return {
+      docWidth: Math.round(document.documentElement.getBoundingClientRect().width),
+      scrollWidth: document.documentElement.scrollWidth,
+      clientWidth: document.documentElement.clientWidth,
+      horizontalOverflow:
+        document.documentElement.scrollWidth - document.documentElement.clientWidth,
+      h1Count: document.querySelectorAll('h1').length,
+      h1Text: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent?.trim()),
+      sectionCount: boxes.length,
+      sections: boxes,
+      imageCount: imgs.length,
+      brokenImages: imgs.filter((i) => i.broken).length,
+      upscaledImages: imgs.filter((i) => i.upscaled),
+      maxContainer: Math.max(0, ...containers.filter((w) => w <= (window.innerWidth || 9999))),
+    }
+  })
+}
+
+const browser = await chromium.launch({ channel: 'chrome', headless: true })
+await mkdir(OUT, { recursive: true })
+const metrics = { url: URL, breakpoints: {} }
+
+// ---- CX page: full captures + analysis per breakpoint ----
+for (const bp of BREAKPOINTS) {
+  const ctx = await browser.newContext({
+    viewport: { width: bp.width, height: bp.height },
+    deviceScaleFactor: 1,
+  })
+  const page = await ctx.newPage()
+  const consoleErrors = []
+  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
+  page.on('pageerror', (e) => consoleErrors.push(String(e)))
+  await page.goto(URL, { waitUntil: 'networkidle' })
+  await settle(page)
+  const a = await analyze(page)
+  a.consoleErrors = consoleErrors
+  metrics.breakpoints[bp.name] = a
+  await page.screenshot({ path: path.join(OUT, `cx-${bp.name}-full.png`), fullPage: true })
+
+  if (bp.name === '1440' || bp.name === '390') {
+    // hero crop
+    const hero = await page.$('section')
+    if (hero) await hero.screenshot({ path: path.join(OUT, `cx-hero-${bp.name}.png`) })
+  }
+
+  // section crops at desktop only
+  if (bp.name === '1440') {
+    const secEls = await page.$$('main > *')
+    for (let i = 0; i < secEls.length; i++) {
+      try {
+        await secEls[i].screenshot({
+          path: path.join(OUT, `cx-section-${String(i + 1).padStart(2, '0')}.png`),
+        })
+      } catch { /* zero-height wrapper — skip */ }
+    }
+  }
+  await ctx.close()
+}
+
+// ---- Regression: the six routes that must not change ----
+const regression = {}
+for (const route of REGRESSION_ROUTES) {
+  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
+  const page = await ctx.newPage()
+  const consoleErrors = []
+  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
+  page.on('pageerror', (e) => consoleErrors.push(String(e)))
+  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
+  await settle(page)
+  const a = await analyze(page)
+  regression[route] = {
+    sectionCount: a.sectionCount,
+    h1Count: a.h1Count,
+    pageHeight: a.sections.reduce((s, b) => s + b.height, 0),
+    imageCount: a.imageCount,
+    brokenImages: a.brokenImages,
+    maxContainer: a.maxContainer,
+    horizontalOverflow: a.horizontalOverflow,
+    consoleErrors,
+  }
+  await page.screenshot({ path: path.join(OUT, `regress-${route.replace(/\W+/g, '_') || 'home'}-1440.png`), fullPage: true })
+  await ctx.close()
+}
+
+await browser.close()
+
+// ---- Gate evaluation ----
+const cxBps = Object.entries(metrics.breakpoints)
+const gate = {
+  contentComponents_expect_breadcrumb_plus_19: null, // filled below
+  h1_exactly_1: cxBps.every(([, a]) => a.h1Count === 1),
+  overflow_zero: cxBps.every(([, a]) => a.horizontalOverflow <= 0),
+  brokenImages_zero: cxBps.every(([, a]) => a.brokenImages === 0),
+  upscaledImages_zero: cxBps.every(([, a]) => a.upscaledImages.length === 0),
+  consoleErrors_zero: cxBps.every(([, a]) => a.consoleErrors.length === 0),
+}
+// section census from 1440: <main> children = breadcrumb wrapper + 19 sections = 20
+gate.mainChildren_1440 = metrics.breakpoints['1440'].sectionCount
+metrics.gate = gate
+metrics.regression = regression
+
+await writeFile(path.join(OUT, 'metrics.json'), JSON.stringify(metrics, null, 2))
+console.log('GATE:', JSON.stringify(gate, null, 2))
+console.log('mainChildren@1440:', gate.mainChildren_1440)
+console.log('regression routes captured:', Object.keys(regression).length)
+console.log('done ->', OUT)
diff --git a/src/components/gcalls-cx/sections.tsx b/src/components/gcalls-cx/sections.tsx
index 3416cbd..e337ef3 100644
--- a/src/components/gcalls-cx/sections.tsx
+++ b/src/components/gcalls-cx/sections.tsx
@@ -49,12 +49,20 @@ import {
   CX_USE_CASES,
 } from '@/data/gcallsCx'
 import {
-  CustomerContextMockup,
-  CxReportingMockup,
-  OmnichannelInboxMockup,
-  TicketPanelMockup,
+  CustomerContextDiagram,
+  InboxDiagram,
+  ReportingDiagram,
+  TicketDiagram,
 } from './visuals'
 
+/**
+ * Shared caption for every product visual on this page. The visuals are neutral
+ * layout diagrams, not screenshots — see the header of `./visuals.tsx` and
+ * `docs/content-review/gcalls-cx-ui-v2/pii-branding-report.md`.
+ */
+const DIAGRAM_NOTE =
+  'Giao diện minh họa — sơ đồ bố cục, không phải ảnh chụp sản phẩm và không hiển thị số liệu hay dữ liệu khách hàng thật.'
+
 const PRIMARY_BTN =
   'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto'
 
@@ -102,7 +110,7 @@ export function CxHero() {
       }}
     >
       <Container>
-        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
+        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[44fr_56fr] lg:gap-14">
           <div>
             <Eyebrow>{CX_HERO.eyebrow}</Eyebrow>
 
@@ -145,8 +153,8 @@ export function CxHero() {
             </div>
           </div>
 
-          <ProductVisual maxWidth="560px">
-            <OmnichannelInboxMockup />
+          <ProductVisual maxWidth="560px" note={DIAGRAM_NOTE}>
+            <InboxDiagram />
           </ProductVisual>
         </div>
       </Container>
@@ -258,8 +266,8 @@ export function CxOverview() {
             </ul>
           </div>
 
-          <ProductVisual maxWidth="520px">
-            <CustomerContextMockup />
+          <ProductVisual maxWidth="520px" note={DIAGRAM_NOTE}>
+            <CustomerContextDiagram />
           </ProductVisual>
         </div>
       </Container>
@@ -313,11 +321,8 @@ export function CxInbox() {
       description={CX_INBOX.description}
       points={CX_INBOX.points}
       visual={
-        <ProductVisual
-          maxWidth="520px"
-          note="Giao diện minh họa. Mã khách hàng, hội thoại và trạng thái hiển thị là dữ liệu mẫu."
-        >
-          <OmnichannelInboxMockup />
+        <ProductVisual maxWidth="520px" note={DIAGRAM_NOTE}>
+          <InboxDiagram />
         </ProductVisual>
       }
     />
@@ -338,11 +343,8 @@ export function CxTickets() {
       description={CX_TICKETS.description}
       points={CX_TICKETS.points}
       visual={
-        <ProductVisual
-          maxWidth="480px"
-          note="Giao diện minh họa. Mã ticket, người phụ trách và lịch sử hiển thị là dữ liệu mẫu."
-        >
-          <TicketPanelMockup />
+        <ProductVisual maxWidth="480px" note={DIAGRAM_NOTE}>
+          <TicketDiagram />
         </ProductVisual>
       }
     />
@@ -361,11 +363,8 @@ export function CxCustomerContext() {
       description={CX_CONTEXT.description}
       points={CX_CONTEXT.points}
       visual={
-        <ProductVisual
-          maxWidth="480px"
-          note="Giao diện minh họa. Thông tin khách hàng hiển thị là dữ liệu mẫu, không phải dữ liệu thật."
-        >
-          <CustomerContextMockup />
+        <ProductVisual maxWidth="480px" note={DIAGRAM_NOTE}>
+          <CustomerContextDiagram />
         </ProductVisual>
       }
     />
@@ -425,9 +424,9 @@ export function CxReporting() {
       visual={
         <ProductVisual
           maxWidth="460px"
-          note="Giao diện minh họa. Toàn bộ số liệu, trạng thái và phân bổ kênh hiển thị là dữ liệu mẫu, không phải kết quả vận hành của khách hàng Gcalls."
+          note="Giao diện minh họa — sơ đồ bố cục báo cáo. Không hiển thị số liệu, tỷ lệ hay kết quả vận hành nào; các ô nội dung chỉ là khối minh họa."
         >
-          <CxReportingMockup />
+          <ReportingDiagram />
         </ProductVisual>
       }
     />
diff --git a/src/components/gcalls-cx/visuals.tsx b/src/components/gcalls-cx/visuals.tsx
index 312ce99..a02a1f9 100644
--- a/src/components/gcalls-cx/visuals.tsx
+++ b/src/components/gcalls-cx/visuals.tsx
@@ -1,27 +1,32 @@
 import { Facebook, Mail, MessageCircle, MessageSquare, Phone } from 'lucide-react'
 
 /**
- * Gcalls CX demo product UI.
+ * Gcalls CX — NEUTRAL LAYOUT DIAGRAMS.
  *
  * ---------------------------------------------------------------------------
- * DEMO_VISUAL_REPLACE_LATER
+ * WHY THESE ARE DIAGRAMS, NOT SCREENSHOTS  (GCALLS_CX_MEDIA decision)
  * ---------------------------------------------------------------------------
- * The repository holds no real or sanitized Gcalls CX screenshots. Rather than
- * repurpose an unrelated Gcalls mockup (which would misrepresent the product)
- * or use stock artwork, these are conceptual surfaces built from the design
- * system. Replace them with authentic screenshots when available — this file
- * is the single swap point.
+ * The owner-supplied capture set (`CX V2-…zip`, 58 images) is screenshots of a
+ * DIFFERENT product ("PitelCX — Contact Center Platform"): its branding sits in
+ * both the chrome and inside chat content, and the captures are saturated with
+ * personal data (customer names, phone numbers, emails, companies, debts,
+ * customer IDs, agent leaderboards, KPI values). See
+ * `docs/content-review/gcalls-cx-ui-v2/pii-branding-report.md`.
  *
- * RULES THESE MOCKUPS FOLLOW (P03 §28):
- *  - They depict ONLY capabilities evidenced for Gcalls CX: the five verified
- *    channels, omnichannel inbox, ticket/workflow, customer context and
- *    operational reporting. Nothing is invented to fill a layout.
- *  - No real PII and no fabricated customer names. Contacts are masked
- *    identifiers ("KH #4821"); agents are role labels ("Agent 02").
- *  - Every figure is demo data, rendered inside `ProductVisual`, which prints
- *    the demo-data caption beneath it — so no number can read as a Gcalls
- *    result, a channel guarantee or a customer outcome.
- *  - Channel badges show only the five verified channels.
+ * Owner decision on that review: DO NOT publish or rebrand those captures.
+ * Ship neutral layout diagrams instead. So this file draws the *shape* of each
+ * surface from the design system and deliberately contains:
+ *   - NO fabricated figures (no ticket IDs, no "47 open", no "312", no CSAT /
+ *     FCR / SLA / percentages) — content slots are rendered as skeleton bars.
+ *   - NO personal data and NO fabricated names or conversation text.
+ *   - ONLY real, evidenced labels: the five verified channels and generic UI
+ *     state chips (Chờ xử lý / Đang xử lý / Đã xong).
+ * Every diagram is captioned "Giao diện minh họa" by `ProductVisual`, so a
+ * reader can never mistake a slot for a Gcalls figure, a channel guarantee or a
+ * customer outcome.
+ *
+ * This is the single swap point: if authentic, cleared Gcalls CX captures ever
+ * exist, replace these diagrams here.
  * ---------------------------------------------------------------------------
  */
 
@@ -53,6 +58,20 @@ function ChannelBadge({ channel }: { channel: ChannelKey }) {
   )
 }
 
+/**
+ * Skeleton content slot — a neutral placeholder bar standing in for text that a
+ * real deployment would render. Carries no information, so nothing here can be
+ * read as data. `w` is a Tailwind width class.
+ */
+function Bar({ w = 'w-full', className = '' }: { w?: string; className?: string }) {
+  return (
+    <span
+      className={`block h-2 rounded-full bg-brand-light ${w} ${className}`}
+      aria-hidden="true"
+    />
+  )
+}
+
 function Chrome({ label }: { label: string }) {
   return (
     <div className="flex items-center gap-2.5 bg-brand px-4 py-3">
@@ -66,20 +85,33 @@ function Chrome({ label }: { label: string }) {
   )
 }
 
-/** Omnichannel inbox — conversations from connected channels, with status. */
-export function OmnichannelInboxMockup() {
-  const rows: Array<{
-    id: string
-    channel: ChannelKey
-    preview: string
-    status: string
-    warn?: boolean
-  }> = [
-    { id: 'KH #4821', channel: 'zalo', preview: 'Đơn của mình khi nào giao?', status: 'Chờ xử lý', warn: true },
-    { id: 'KH #4817', channel: 'voice', preview: 'Cuộc gọi đến · 2:14', status: 'Đang xử lý' },
-    { id: 'KH #4813', channel: 'facebook', preview: 'Shop còn size M không ạ?', status: 'Đang xử lý' },
-    { id: 'KH #4809', channel: 'email', preview: 'Yêu cầu xuất hóa đơn', status: 'Đã xong' },
-    { id: 'KH #4804', channel: 'sms', preview: 'Xác nhận lịch hẹn', status: 'Đã xong' },
+/** Neutral state chips — generic UI states, not metrics. */
+const STATES = ['Chờ xử lý', 'Đang xử lý', 'Đã xong'] as const
+function StateChip({ state }: { state: (typeof STATES)[number] }) {
+  const warn = state === 'Chờ xử lý'
+  return (
+    <span
+      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
+        warn ? 'bg-amber-50 text-amber-700' : 'bg-brand-light text-brand'
+      }`}
+    >
+      {state}
+    </span>
+  )
+}
+
+/**
+ * Omnichannel inbox — the *layout* of a unified conversation list: a channel
+ * filter, then rows that each carry a channel and a handling state. Row content
+ * is skeletoned; no identifiers, previews or counts.
+ */
+export function InboxDiagram() {
+  const rows: Array<{ channel: ChannelKey; state: (typeof STATES)[number]; w: string }> = [
+    { channel: 'zalo', state: 'Chờ xử lý', w: 'w-3/4' },
+    { channel: 'voice', state: 'Đang xử lý', w: 'w-2/3' },
+    { channel: 'facebook', state: 'Đang xử lý', w: 'w-4/5' },
+    { channel: 'email', state: 'Đã xong', w: 'w-1/2' },
+    { channel: 'sms', state: 'Đã xong', w: 'w-3/5' },
   ]
 
   return (
@@ -96,24 +128,20 @@ export function OmnichannelInboxMockup() {
       </div>
 
       <ul className="flex flex-col divide-y divide-brand-border">
-        {rows.map((r) => (
-          <li key={r.id} className="flex items-center gap-3 px-4 py-3">
-            <div className="min-w-0 flex-1">
+        {rows.map((r, i) => (
+          <li key={i} className="flex items-center gap-3 px-4 py-3.5">
+            <span
+              className="h-8 w-8 shrink-0 rounded-full bg-brand-light"
+              aria-hidden="true"
+            />
+            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
               <div className="flex items-center gap-2">
-                <span className="text-[12px] font-bold text-foreground">{r.id}</span>
                 <ChannelBadge channel={r.channel} />
+                <Bar w="w-20" />
               </div>
-              <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
-                {r.preview}
-              </p>
+              <Bar w={r.w} className="!h-1.5" />
             </div>
-            <span
-              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
-                r.warn ? 'bg-amber-50 text-amber-700' : 'bg-brand-light text-brand'
-              }`}
-            >
-              {r.status}
-            </span>
+            <StateChip state={r.state} />
           </li>
         ))}
       </ul>
@@ -121,43 +149,47 @@ export function OmnichannelInboxMockup() {
   )
 }
 
-/** Ticket panel — status, assignee and history. */
-export function TicketPanelMockup() {
-  const history = [
-    { at: '09:12', text: 'Tiếp nhận từ Zalo OA' },
-    { at: '09:20', text: 'Phân công cho Agent 02' },
-    { at: '10:05', text: 'Đã phản hồi khách hàng' },
-  ]
+/**
+ * Ticket panel — the layout of a ticket: a state + channel + owner header, a
+ * subject/description block, and an activity trail of workflow stages. No
+ * ticket number, no timestamps, no names.
+ */
+export function TicketDiagram() {
+  const stages = ['Tiếp nhận', 'Phân công', 'Đang xử lý', 'Phản hồi']
 
   return (
     <div className={SHELL}>
-      <Chrome label="Ticket #T-2043" />
+      <Chrome label="Ticket" />
 
       <div className="p-4">
         <div className="flex flex-wrap items-center gap-2">
-          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
-            Đang xử lý
-          </span>
+          <StateChip state="Đang xử lý" />
           <ChannelBadge channel="zalo" />
-          <span className="ml-auto text-[11px] text-muted-foreground">
-            Phụ trách: Agent 02
+          <span className="ml-auto flex items-center gap-1.5">
+            <span className="text-[11px] text-muted-foreground">Phụ trách</span>
+            <span className="h-5 w-5 rounded-full bg-brand-light" aria-hidden="true" />
           </span>
         </div>
 
-        <p className="mt-3 text-[13px] font-bold text-foreground">
-          Yêu cầu kiểm tra tình trạng đơn hàng
-        </p>
-        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
-          Khách hàng liên hệ qua Zalo OA và cần cập nhật thời gian giao dự kiến.
-        </p>
+        <div className="mt-4 flex flex-col gap-2">
+          <Bar w="w-2/3" className="!h-2.5" />
+          <Bar w="w-full !h-1.5" />
+          <Bar w="w-5/6 !h-1.5" />
+        </div>
 
-        <ul className="mt-4 flex flex-col gap-2.5 border-t border-brand-border pt-3">
-          {history.map((h) => (
-            <li key={h.at} className="flex gap-3">
-              <span className="w-10 shrink-0 text-[11px] tabular-nums text-muted-foreground">
-                {h.at}
-              </span>
-              <span className="text-[12px] leading-snug text-foreground">{h.text}</span>
+        <p className="mt-5 text-[11px] font-bold uppercase tracking-wide text-brand">
+          Lịch sử xử lý
+        </p>
+        <ul className="mt-3 flex flex-col gap-3 border-t border-brand-border pt-3">
+          {stages.map((s, i) => (
+            <li key={s} className="flex items-center gap-3">
+              <span
+                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
+                  i < 3 ? 'bg-brand' : 'bg-brand-light'
+                }`}
+                aria-hidden="true"
+              />
+              <span className="text-[12px] leading-snug text-foreground">{s}</span>
             </li>
           ))}
         </ul>
@@ -166,8 +198,14 @@ export function TicketPanelMockup() {
   )
 }
 
-/** Customer context — profile, channel history, ticket history. */
-export function CustomerContextMockup() {
+/**
+ * Customer context — the layout of a profile: identity block, channels touched,
+ * a recent-interaction list and a related-ticket slot. Identity, interaction
+ * text and dates are skeletoned; no personal data of any kind.
+ */
+export function CustomerContextDiagram() {
+  const recent: ChannelKey[] = ['zalo', 'voice', 'email']
+
   return (
     <div className={SHELL}>
       <Chrome label="Customer Context" />
@@ -180,92 +218,68 @@ export function CustomerContextMockup() {
           >
             KH
           </span>
-          <div className="min-w-0">
-            <p className="text-[13px] font-bold text-foreground">KH #4821</p>
-            <p className="text-[11px] text-muted-foreground">
-              Khách hàng · 3 kênh đã tương tác
-            </p>
+          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
+            <Bar w="w-1/2" className="!h-2.5" />
+            <Bar w="w-2/3 !h-1.5" />
           </div>
         </div>
 
         <div className="mt-3 flex flex-wrap gap-1.5">
-          <ChannelBadge channel="zalo" />
-          <ChannelBadge channel="voice" />
-          <ChannelBadge channel="email" />
+          {recent.map((c) => (
+            <ChannelBadge key={c} channel={c} />
+          ))}
         </div>
 
         <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-brand">
           Tương tác gần đây
         </p>
         <ul className="mt-2 flex flex-col gap-2">
-          {[
-            { c: 'zalo' as ChannelKey, t: 'Hỏi tình trạng đơn hàng', d: 'Hôm nay' },
-            { c: 'voice' as ChannelKey, t: 'Cuộc gọi đến · 2:14', d: 'Hôm qua' },
-            { c: 'email' as ChannelKey, t: 'Yêu cầu xuất hóa đơn', d: '3 ngày trước' },
-          ].map((i) => (
+          {recent.map((c, i) => (
             <li
-              key={i.t}
-              className="flex items-center gap-2 rounded-[10px] border border-brand-border px-3 py-2"
+              key={i}
+              className="flex items-center gap-2 rounded-[10px] border border-brand-border px-3 py-2.5"
             >
-              <ChannelBadge channel={i.c} />
-              <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">
-                {i.t}
-              </span>
-              <span className="shrink-0 text-[10px] text-muted-foreground">{i.d}</span>
+              <ChannelBadge channel={c} />
+              <Bar w="min-w-0 flex-1" className="!h-1.5" />
+              <span className="h-3 w-10 shrink-0 rounded-full bg-brand-light" aria-hidden="true" />
             </li>
           ))}
         </ul>
 
-        <div className="mt-3 rounded-[10px] bg-brand-light px-3 py-2">
+        <div className="mt-3 rounded-[10px] bg-brand-light px-3 py-2.5">
           <p className="text-[10px] font-semibold uppercase tracking-wide text-brand">
             Ticket liên quan
           </p>
-          <p className="mt-0.5 text-[12px] text-foreground">
-            #T-2043 · Đang xử lý · Agent 02
-          </p>
+          <div className="mt-1.5">
+            <Bar w="w-3/5" className="!bg-white/70" />
+          </div>
         </div>
       </div>
     </div>
   )
 }
 
-/** Operational reporting — workload, ticket status, channel distribution. */
-export function CxReportingMockup() {
-  const tiles = [
-    { label: 'Hội thoại hôm nay', value: '312' },
-    { label: 'Ticket đang mở', value: '47' },
-  ]
-  const statuses = [
-    { label: 'Chờ xử lý', value: 12, tone: '#d97706' },
-    { label: 'Đang xử lý', value: 21, tone: '#673ab7' },
-    { label: 'Đã xong', value: 14, tone: '#16a34a' },
-  ]
-  const maxStatus = Math.max(...statuses.map((s) => s.value))
-  const dist: Array<{ c: ChannelKey; pct: number }> = [
-    { c: 'voice', pct: 34 },
-    { c: 'zalo', pct: 28 },
-    { c: 'facebook', pct: 19 },
-    { c: 'email', pct: 12 },
-    { c: 'sms', pct: 7 },
-  ]
-
+/**
+ * Operational reporting — a NEUTRAL dashboard diagram. It shows the *categories*
+ * a report groups by (from CX_REPORTING: conversation volume, ticket status,
+ * channel distribution, team workload) with skeleton content in place of every
+ * figure. No numbers, no percentages, no KPI values are drawn — the layout
+ * communicates "operational reporting exists", not any result.
+ */
+export function ReportingDiagram() {
   return (
     <div className={SHELL}>
       <Chrome label="Báo cáo vận hành" />
 
       <div className="p-4">
         <ul className="grid grid-cols-2 gap-2.5">
-          {tiles.map((t) => (
+          {['Khối lượng hội thoại', 'Ticket đang mở'].map((label) => (
             <li
-              key={t.label}
+              key={label}
               className="rounded-[12px] border border-brand-border px-3 py-2.5"
             >
-              <p className="text-lg font-extrabold tabular-nums leading-none text-brand">
-                {t.value}
-              </p>
-              <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
-                {t.label}
-              </p>
+              <Bar w="w-10" className="!h-4" />
+              <p className="mt-2 text-[11px] leading-snug text-muted-foreground">{label}</p>
             </li>
           ))}
         </ul>
@@ -274,23 +288,13 @@ export function CxReportingMockup() {
           <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
             Trạng thái ticket
           </p>
-          <ul className="mt-2.5 flex flex-col gap-2">
-            {statuses.map((s) => (
-              <li key={s.label} className="flex items-center gap-2.5">
+          <ul className="mt-2.5 flex flex-col gap-2.5">
+            {STATES.map((label, i) => (
+              <li key={label} className="flex items-center gap-2.5">
                 <span className="w-16 shrink-0 text-[11px] text-muted-foreground">
-                  {s.label}
-                </span>
-                <span
-                  className="h-2 rounded-full"
-                  style={{
-                    width: `${(s.value / maxStatus) * 62}%`,
-                    background: s.tone,
-                  }}
-                  aria-hidden="true"
-                />
-                <span className="shrink-0 text-[11px] font-semibold tabular-nums text-foreground">
-                  {s.value}
+                  {label}
                 </span>
+                <Bar w={['w-1/2', 'w-4/5', 'w-3/5'][i]} className="!h-2.5" />
               </li>
             ))}
           </ul>
@@ -301,18 +305,12 @@ export function CxReportingMockup() {
             Phân bổ theo kênh
           </p>
           <ul className="mt-2.5 flex flex-col gap-1.5">
-            {dist.map((d) => (
-              <li key={d.c} className="flex items-center gap-2">
+            {(Object.keys(CHANNEL_STYLE) as ChannelKey[]).map((c) => (
+              <li key={c} className="flex items-center gap-2">
                 <span className="w-[74px] shrink-0">
-                  <ChannelBadge channel={d.c} />
-                </span>
-                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-light">
-                  <span
-                    className="block h-full rounded-full bg-brand/80"
-                    style={{ width: `${d.pct}%` }}
-                    aria-hidden="true"
-                  />
+                  <ChannelBadge channel={c} />
                 </span>
+                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-light" />
               </li>
             ))}
           </ul>
```
