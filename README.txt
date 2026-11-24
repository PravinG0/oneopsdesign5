OneOps website — simplified sections update

Open index.html directly or via a local HTTP server. Light theme remains default; saved theme choice is respected.
Removed Challenge, Architecture & Core Layers (programs grid only), and Role-Based Solutions sections and their navigation links. Kept Bedrock scrollytelling, hero layer interactions, other sections, FAQ and popups. Removed animated hero orbits and floating usage/request cards. Recreated video-inspired atmospheric orb background using CSS and existing canvas rings, with 1.3px moving accents in both themes.
Demo/newsletter backend endpoints and privacy/security URLs remain unconfigured, as in the previous version. External fonts and any remaining CDN animation dependencies require online verification.

Validation: JavaScript syntax checks passed for all retained JS files; no missing local assets, duplicate IDs, or broken internal anchors found. Browser navigation blocked by environment policy, so visual and interactive browser testing was not completed.

Integrations exit fix: shortened the galaxy scroll track from 260vh to 200vh. Retained the orbit rotation, logo scaling, magnetic pointer interaction and CTA. The final state remains visible instead of expanding and fading to zero while pinned; the heading and CTA remain visible even before JS starts.
Validation of this update: all JS files passed syntax checks. The galaxy engine was tested using simulated scroll positions at viewport heights of 550, 625, 768, 844 and 900px, including reverse scrolling and the sticky exit; all visible elements retained opacity 1. Actual Chromium navigation was blocked by environment policy, so visual browser testing is not verified.
