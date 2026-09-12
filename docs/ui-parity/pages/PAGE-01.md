# PAGE 01 — home

ROUTE: /
PAGE_GROUP: Home
STATUS: PASS

## Fields

REACT_AUTHORITY: src/pages/HomePage.tsx (13 sections, order locked and documented in-file)
SECTION_COUNT: 13 (verified live via `document.querySelectorAll('section').length` === 13, matches HomePage.tsx's documented list)
BREADCRUMB: N/A — Home does not render a breadcrumb (no `<Breadcrumb>` import in HomePage.tsx; convention confirmed elsewhere: every other route's breadcrumb wrapper starts from "Trang chủ", i.e. Home itself)
TYPOGRAPHY: Open Sans loaded (`css2` stylesheet present); `gcalls-theme`/`gcalls-components` (the handles carrying theme.css's bare h1-h6/font-size overrides) confirmed absent from `document.styleSheets` at all three viewports post-0.3.2 deploy
CTA: PASS — site-wide collision scan (`bg === color` on every `<a>`/`<button>`) returns 0 matches; 8 white-on-purple + 18 purple-on-white CTAs found and colored correctly; 4 dark-section headings confirmed white
IMAGES: PASS — 0 broken `<img>` (hero uses inline SVG/DOM mockup, no external screenshot files on this route, so the PII-blocked-image fix is not applicable here — that applies to /gcalls-plus-webphone/, see PAGE 03)
SAFE_DEMO_DATA: PASS — scanned rendered body text for all 10 previously-unsafe names + 5 phone numbers: 0 found. Visible mock data reads "Khách hàng A/B/C", "090x xxx 001", "Công ty Demo A", "Hằng N." (screenshot-verified)
DESKTOP_1440: PASS — screenshot captured (1456px actual viewport), layout matches approved WEB-SITE-QA-001 composition, hero mockup renders correctly with sanitized data
TABLET_768: PASS — h1=1, header=1, footer=1, 0 horizontal overflow (verified via same-origin iframe at exactly 768px, browser window resize was unavailable this session)
MOBILE_390: PASS — h1=1, header=1, footer=1, 0 horizontal overflow (verified via same-origin iframe at exactly 390px)
VISUAL_PARITY: PASS
SOURCE_COMMIT: 834fb52
LIVE_DEPLOYED: YES (gcalls-react-shell 0.3.2, confirmed via window.__GCALLS_SHELL_CONFIG__.pluginVersion on live page)
NOTES: Tablet/mobile evidence is computed-style + structural (H1/header/footer/overflow/stylesheet-list), not a pixel screenshot — this session's window-resize control became unreliable partway through (stuck reporting innerWidth 1680 regardless of requested size) and the iframe technique was used as the reliable substitute, same method the original WEB-SITE-QA-001 checkpoint used for its own 390/360 measurements.
