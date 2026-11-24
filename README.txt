ONEOPS WEBSITE — BUG-FIXED VERSION

Run: extract the ZIP, open index.html or serve the Website folder with
VS Code Live Server / python -m http.server 8000.

Changes:
- Mobile menu with all 8 navigation links, keyboard close and current-link state.
- Opt-in sound toggle, safe localStorage and theme state.
- Fixed FAQ expanded states, modal focus/escape/scroll locking, and mobile dialog overflow.
- Role-based section works with GSAP when available and native sticky scrolling
  when unavailable; compact view uses accessible role buttons and the static cube.
- Reduced off-screen canvas rendering and fixed document-relative card scroll.
- Removed misleading fake demo/newsletter success messages; added form validation
  and optional real submission endpoint handling.
- Disabled placeholder privacy/trust-center links pending real URLs.
- Removed invalid nested main landmark and improved sticky/card layouts.

Before deployment:
1. Add real form POST URLs to data-endpoint on #demoLeadForm and form.nl in
   index.html. They receive multipart FormData; return HTTP 2xx only after
   accepting the request. Configure server-side validation, spam protection,
   and CORS if needed. No submission is sent until configured.
2. Replace the footer's Privacy Policy and Security Trust Center placeholders
   with real links supplied by your organization.
3. Test online with Google Fonts, Three.js r128, GSAP 3.12.5 and ScrollTrigger
   3.12.5 available. The environment could not reach those CDN resources.

Verification performed:
- Node syntax checks of all three scripts.
- Original verification suite passed all listed checks (including 28 local URLs).
- Chromium DOM-based tests at 1440x900, 1366x768, 768x1024, and 390x844 with
  external libraries omitted: no uncaught JS errors, no document horizontal
  overflow, theme, FAQ, demo dialog, mobile nav and compact role selection tested.
- Additional desktop and phone tests: sound control, blueprint modal,
  newsletter and native pinned role-scroll scene switching.
- Actual CDN-powered 3D animation and live backend submissions not verified.

Challenge section layout update:
- Increased the section container maximum width from 1220px to 1660px.
- Made the comparison panels equal-height with responsive typography, shields and padding.
- Sticky stacking is enabled only when all five cards fit below the fixed navigation; otherwise cards scroll normally.
- Checked desktop, tablet and mobile layouts in Chromium with external libraries unavailable.

Challenge panel spacing update:
- Increased inner padding on both 3D comparison panels, with extra clearance
  on their beveled outer edges, plus heading and paragraph spacing.
- Verified all five cards at eight viewport sizes; no horizontal content
  overflow or uncaught JavaScript errors in the tested offline scenarios.

Hero and FAQ replacement:
- Integrated the supplied oneops-hero-updated (1).html and oneops-faq-enhanced(1).html sections into index.html.
- Added hero-enhanced.css/js and faq-enhanced.css/js with isolated selectors to avoid conflicts with the cinematic section and original FAQ styles.
- Original navigation anchors, shared dialog controllers, form handling and previous Challenge panel width/spacing fixes remain in place.
- The new sections retain the supplied dark visual designs, including when the rest of the site uses light mode.
- Desktop interaction checks passed with remote resources blocked. For deployment, verify online CDN-dependent sections and configure form endpoints.

VISUAL REFINEMENTS — 24 November 2026
- Narrower comparison panels with taller minimum height and preserved internal padding, for all five Challenge cards. The existing viewport-fit check automatically uses normal scrolling where a taller card cannot be pinned safely.
- Consistent hero-style warm gradient accents on section headings, with darker gradient stops in light mode. Red/green comparison status colors remain distinct.
- Space Grotesk throughout; corrected Google Fonts request to supported 300–700 weight range. Font loading requires connectivity to Google Fonts; sans-serif fallback is available.
- Fixed light-mode navigation highlight/text synchronization and improved text contrast in the hero, FAQ, comparison deck, scroll narrative and other shared components.
- Browser checks at 1440×900, 1366×768 and 390×844 (local scripts and styles, external CDN requests blocked): theme toggle, desktop hover, mobile menu, FAQ interaction, viewport overflow and runtime errors. The supplied static verification suite passed. External font and CDN animation loading were not tested in this environment.
- Original FAQ content and backend integration requirements remain unchanged.

Challenge question punctuation fix: added inline gradient paint space for italic glyph overhang on all five question headings. Existing cards, content and animations are unchanged.

Role-Based Solutions refinements:
- Replaced blue, cyan and gold styling with OneOps crimson, coral, mauve and warm neutrals across CSS, SVG and WebGL materials/shaders. Security-specific positive/negative particle indicators remain semantic.
- Added a header-height-aware safe zone for the eyebrow and role labels. Grid sizing reserves room for the longest scene headline and capability cards while preserving the pinned scroll sequence and tabs.
- Verified all five native scroll stages in both themes at 1440x900, 1366x768 and 1280x721; mobile tabs checked at 390x844. External CDN scripts were unavailable in the test environment, so live WebGL/GSAP rendering requires online verification.

Light hero fix: removed negative stage margins in light mode, added responsive column gutter, confined SVG art to stage, switched all SVG surfaces, labels, layer accents and particles to a light-mode palette. Existing dark palette and interactive renderer retained.
