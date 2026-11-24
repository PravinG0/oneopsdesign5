/**
 * ONEOPS ENTERPRISE BEDROCK CONTROL PLANE — MASTER APPLICATION ENGINE
 * 
 * Modular Architecture:
 * 1. Theme Engine (Dark/Light Switcher with LocalStorage & Custom Events)
 * 2. Header Engine (Section 8 Frosted Pill Shrink on Scroll & Active Link Spy)
 * 3. Section 6 Hero Engine (Isometric SVG Stack, 3 View Modes, Spec Card & Live HUD)
 * 4. Section 4 Scrollytelling Engine (Orbital 2D Canvas, Word Scrub & Trajectory Spline)
 * 5. Section 2 Horizontal Track Engine ("Govern" Letter Rise, Hex Grid & Card Spring)
 * 6. Section 1 Rotary Dial Engine (Trigonometric Arc, SVG Radial Ticks & Touch Drag)
 * 7. Section 5 Orbital Galaxy Engine (Concentric Rings, Upright Logos & Magnetic Attraction)
 * 8. FinOps Savings Calculator Engine (Interactive Bedrock Spend Slider)
 * 9. Role-Based Solutions Engine (4-Persona Tabs Switcher)
 * 10. Customer FAQs Accordion Engine
 * 11. Architecture Review & Lead Demo Modal
 * 12. Opt-in Web Audio API Haptic Audio Feedback
 */

(function () {
  'use strict';

  // ==========================================================================
  // MODULE 12: OPT-IN WEB AUDIO HAPTIC BEEP
  // ==========================================================================
  let audioCtx = null;
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let audioEnabled = storage.get('oneops-audio') === 'true';
  const audioBtn = document.getElementById('audioToggleBtn');
  function syncAudio() {
    if (!audioBtn) return;
    audioBtn.setAttribute('aria-pressed', String(audioEnabled));
    audioBtn.setAttribute('aria-label', audioEnabled ? 'Mute sound effects' : 'Enable sound effects');
    audioBtn.querySelector('.sound-icon-muted').style.display = audioEnabled ? 'none' : '';
    audioBtn.querySelector('.sound-icon-active').style.display = audioEnabled ? '' : 'none';
  }
  syncAudio();
  audioBtn?.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    storage.set('oneops-audio', String(audioEnabled));
    syncAudio();
    if (audioEnabled) playHapticBeep(540);
  });
  function playHapticBeep(freq = 440, type = 'sine', duration = 0.05) {
    if (!audioEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      if (audioCtx) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      }
    } catch (e) {
      // Audio autoplay gracefully suppressed if blocked
    }
  }

  // ==========================================================================
  // MODULE 1: THEME SWITCHING ENGINE (DARK / LIGHT)
  // ==========================================================================
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  function initTheme() {
    const savedTheme = storage.get('oneops-theme') === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', savedTheme);
    themeToggleBtn?.setAttribute('aria-pressed', String(savedTheme === 'light'));
  }

  function toggleTheme() {
    const currentTheme = root.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
    storage.set('oneops-theme', nextTheme);
    themeToggleBtn?.setAttribute('aria-pressed', String(nextTheme === 'light'));
    playHapticBeep(nextTheme === 'dark' ? 320 : 540);
    window.dispatchEvent(new CustomEvent('oneops-theme-changed', { detail: { theme: nextTheme } }));
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  initTheme();

  // ==========================================================================
  // MODULE 2: HEADER SCROLL SHRINK & ACTIVE LINK SPY (SECTION 8 PILL NAV)
  // ==========================================================================
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('[data-link]');
  const sections = [...navLinks].map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  const linksHl = document.querySelector('[data-hl]');

  let hoveredNavLink = null;
  function moveHlToLink(link) {
    if (!linksHl || !link) return;
    const parent = link.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    if (linkRect.width > 0) {
      navLinks.forEach(item => item.classList.toggle('is-highlighted', item === link));
      linksHl.style.width = `${linkRect.width}px`;
      linksHl.style.left = `${linkRect.left - parentRect.left}px`;
      linksHl.style.opacity = '1';
    }
  }

  function updateHeaderOnScroll() {
    if (!siteHeader) return;
    if (window.scrollY > 40) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
    highlightActiveNavLink();
  }

  function highlightActiveNavLink() {
    if (navLinks.length === 0) return;
    const scrollPos = window.scrollY + 180;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const height = rect.height;
      if (top <= scrollPos && top + height > scrollPos) {
        const id = sec.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            navLinks.forEach(l => l.classList.remove('is-active'));
            link.classList.add('is-active');
            navLinks.forEach(l => l.removeAttribute('aria-current'));
            link.setAttribute('aria-current', 'location');
            moveHlToLink(hoveredNavLink || link);
          }
        });
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => { hoveredNavLink = link; moveHlToLink(link); });
    link.addEventListener('mouseleave', () => {
      hoveredNavLink = null;
      const currentActive = document.querySelector('[data-link].is-active');
      if (currentActive) moveHlToLink(currentActive);
    });
  });

  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  updateHeaderOnScroll();
  const initialActive = document.querySelector('[data-link].is-active');
  if (initialActive) setTimeout(() => moveHlToLink(hoveredNavLink || document.querySelector('[data-link].is-active')), 150);

  // Responsive navigation keeps every section reachable.
  const menu = document.getElementById('mobileNavToggle');
  const nav = document.querySelector('[data-links]');
  function setMenu(open, restore = false) {
    if (!menu || !nav) return;
    nav.classList.toggle('mobile-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (restore) menu.focus();
  }
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') setMenu(false, true); });
  document.addEventListener('pointerdown', e => { if (!e.target.closest('#mobileNavToggle, [data-links]')) setMenu(false); });
  window.addEventListener('resize', () => { if (innerWidth > 1140) setMenu(false); highlightActiveNavLink(); });
  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.matches('.open-demo-btn, .open-blueprint-modal-btn')) return;
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.getElementById(targetId.slice(1));
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
          try { history.replaceState(null, '', targetId); } catch (_) {}
          playHapticBeep(480);
        }
      }
    });
  });

  // ==========================================================================
  // MODULE 3: HERO SECTION 6 MASTER CONTROLLER
  // ==========================================================================
  (function initHeroEngine() {
    const LAYER_DATA = {
      'layer-control': {
        badge: 'LAYER 01',
        title: 'Control Layer: In-Flight Guardrails',
        overview: {
          body: 'Enforces RBAC access policies, automated model allowlists, token budget hard caps, and real-time PII redaction before requests touch Amazon Bedrock.',
          metrics: [
            { val: '0 ms', lbl: 'Proxy Latency' },
            { val: '100%', lbl: 'Zero Retention' },
            { val: '<15 min', lbl: 'AWS Deployment' }
          ]
        },
        telemetry: {
          body: 'Active budget envelopes prevent end-of-month cloud billing surprises by throttling or routing rogue autonomous agent loops.',
          metrics: [
            { val: '14 Blk/hr', lbl: 'Prompt Injections' },
            { val: '100%', lbl: 'Budget Cap Enforced' },
            { val: '99.99%', lbl: 'Proxy Reliability' }
          ]
        },
        policies: {
          body: 'Automated in-line PII sanitization (SSN, credit cards, confidential internal tokens) with zero enterprise payload retention.',
          metrics: [
            { val: 'AES-256', lbl: 'In-Flight Encryption' },
            { val: 'AWS IAM', lbl: 'Role Delegation' },
            { val: 'SOC 2', lbl: 'Compliance Ready' }
          ]
        }
      },

      'layer-optimize': {
        badge: 'LAYER 02',
        title: 'Optimize Layer: 5 Savings Levers',
        overview: {
          body: 'Intelligently routes prompts to right-sized models, executes automatic prompt caching, applies semantic compression, and runs asynchronous batch inference to save up to 60% on Bedrock costs.',
          metrics: [
            { val: 'Up to 60%', lbl: 'Cost Reduction' },
            { val: '4.2x', lbl: 'Cache Speedup' },
            { val: '0 Loss', lbl: 'Output Quality' }
          ]
        },
        telemetry: {
          body: 'Continuous model routing directs simple classification tasks to Haiku/Llama-8B while preserving Claude 3.5 Sonnet for deep reasoning.',
          metrics: [
            { val: '$62,840', lbl: 'Saved This Month' },
            { val: '79.2%', lbl: 'Semantic Cache Hit' },
            { val: '1.8x', lbl: 'Throughput Multiplier' }
          ]
        },
        policies: {
          body: 'Automatic batching shifts non-interactive workloads into Bedrock 50% discount batch inference windows automatically.',
          metrics: [
            { val: '50% Disc', lbl: 'Batch Savings' },
            { val: 'Smart SLA', lbl: 'Latency Guarantees' },
            { val: 'Auto-Fallback', lbl: 'Zero Outages' }
          ]
        }
      },

      'layer-observe': {
        badge: 'LAYER 03',
        title: 'Observe Layer: Real-Time Telemetry & Traces',
        overview: {
          body: 'Captures distributed traces for every request, tracks token throughput across models, and streams live spend attribution directly to CloudWatch, Datadog, or your OpenTelemetry collector.',
          metrics: [
            { val: '100%', lbl: 'Request Capture' },
            { val: 'OTel & AWS', lbl: 'Native Export' },
            { val: 'P99 < 8ms', lbl: 'Telemetry Overhead' }
          ]
        },
        telemetry: {
          body: 'Full token streaming transparency: breakdown of input prompt tokens, output completion tokens, cached tokens, and unit cost per call.',
          metrics: [
            { val: '14.2k/min', lbl: 'Current Invocations' },
            { val: '12 ms', lbl: 'P99 Latency' },
            { val: '18 Squads', lbl: 'Tracked in Real-Time' }
          ]
        },
        policies: {
          body: 'Zero-payload-logging guarantee: only telemetry metadata, latency stamps, and token counts leave the private VPC.',
          metrics: [
            { val: 'Zero Ret', lbl: 'Prompt Body Kept' },
            { val: 'ISO 27001', lbl: 'Audit Grade' },
            { val: 'CloudWatch', lbl: 'Direct Streaming' }
          ]
        }
      },

      'layer-report': {
        badge: 'LAYER 04',
        title: 'Report Layer: Audit Vault & Chargeback',
        overview: {
          body: 'Generates granular cost allocation reports by engineering squad, project, and autonomous agent. Produces immutable compliance audit logs for EU AI Act, SOC 2, and internal governance.',
          metrics: [
            { val: '1-Click', lbl: 'Chargeback CSV' },
            { val: 'SOC 2 / ISO', lbl: 'Audit Ready' },
            { val: 'Zero Drift', lbl: 'Budget Proof' }
          ]
        },
        telemetry: {
          body: 'Weekly FinOps Flywheel attribution calculates exact unit economics per feature, autonomous agent, and internal department.',
          metrics: [
            { val: '100% Attrib', lbl: 'Cost Tagging' },
            { val: 'Daily Sync', lbl: 'AWS Cost Explorer' },
            { val: 'Weekly', lbl: 'Automated Flywheel' }
          ]
        },
        policies: {
          body: 'Immutable cryptographic audit trails for enterprise AI governance, supporting EU AI Act Article 12 compliance out of the box.',
          metrics: [
            { val: 'WORM Vault', lbl: 'Tamper Evident' },
            { val: 'EU AI Act', lbl: 'Compliance Mapping' },
            { val: 'FinOps Org', lbl: 'Certified Standards' }
          ]
        }
      },

      'layer-bedrock': {
        badge: 'FOUNDATION',
        title: 'Amazon Bedrock: Native Enterprise Substrate',
        overview: {
          body: 'Plugs natively into your existing AWS infrastructure and VPC. Uses standard AWS IAM role delegation and standard AWS SDK endpoints. Adds governance and FinOps without changing a single line of backend code.',
          metrics: [
            { val: 'Native', lbl: 'AWS Bedrock' },
            { val: 'Zero', lbl: 'Code Refactoring' },
            { val: '99.99%', lbl: 'SLA Uptime' }
          ]
        },
        telemetry: {
          body: 'Direct PrivateLink connectivity to Claude 3.5, Llama 3, Amazon Titan, and Mistral foundation model endpoints with zero egress cost.',
          metrics: [
            { val: 'Direct AWS', lbl: 'PrivateLink VPC' },
            { val: '0 Egress', lbl: 'Cross-Cloud Fees' },
            { val: 'Cross-Region', lbl: 'Native Failover' }
          ]
        },
        policies: {
          body: 'All foundational AWS guarantees, data encryption via AWS KMS, and enterprise privacy commitments remain 100% intact.',
          metrics: [
            { val: 'AWS KMS', lbl: 'Customer-Managed Keys' },
            { val: 'IAM Roles', lbl: 'Least Privilege' },
            { val: 'Replaces 0', lbl: 'AWS Stack Changes' }
          ]
        }
      }
    };

    let activeLayerId = 'layer-control';
    let activeSpecTab = 'overview';

    const pillarItems = document.querySelectorAll('.pillar-item');
    const specTabs = document.querySelectorAll('.spec-tab');
    const specBadge = document.getElementById('specBadge');
    const specTitle = document.getElementById('specTitle');
    const specBody = document.getElementById('specBody');
    const specMetric1 = document.getElementById('specMetric1');
    const specMetric1Lbl = document.getElementById('specMetric1Lbl');
    const specMetric2 = document.getElementById('specMetric2');
    const specMetric2Lbl = document.getElementById('specMetric2Lbl');
    const specMetric3 = document.getElementById('specMetric3');
    const specMetric3Lbl = document.getElementById('specMetric3Lbl');

    const stackLayers = document.querySelectorAll('.stack-layer');
    const stackViewport = document.getElementById('stackViewport');
    const isometricStackSvg = document.getElementById('isometricStackSvg');

    // Ensure Exploded 3D view is permanently active
    if (stackViewport) stackViewport.classList.add('is-exploded');
    if (isometricStackSvg) isometricStackSvg.classList.add('is-exploded');

    function updateSpecCard() {
      const data = LAYER_DATA[activeLayerId] || LAYER_DATA['layer-control'];
      const tabContent = data[activeSpecTab] || data.overview;

      if (specBadge) specBadge.textContent = data.badge;
      if (specTitle) specTitle.textContent = data.title;
      if (specBody) specBody.textContent = tabContent.body;

      if (tabContent.metrics && tabContent.metrics.length >= 3) {
        if (specMetric1) specMetric1.textContent = tabContent.metrics[0].val;
        if (specMetric1Lbl) specMetric1Lbl.textContent = tabContent.metrics[0].lbl;
        if (specMetric2) specMetric2.textContent = tabContent.metrics[1].val;
        if (specMetric2Lbl) specMetric2Lbl.textContent = tabContent.metrics[1].lbl;
        if (specMetric3) specMetric3.textContent = tabContent.metrics[2].val;
        if (specMetric3Lbl) specMetric3Lbl.textContent = tabContent.metrics[2].lbl;
      }
    }

    function selectLayer(layerId) {
      if (!LAYER_DATA[layerId]) return;
      activeLayerId = layerId;
      pillarItems.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-layer') === layerId);
      });
      document.querySelectorAll('.stack-layer').forEach(l => {
        const id = l.getAttribute('data-layer') || l.getAttribute('data-layer-id');
        if (id === layerId) {
          l.classList.add('is-active');
          l.style.opacity = '1';
        } else {
          l.classList.remove('is-active');
          l.style.opacity = '0.85';
        }
      });
      updateSpecCard();
      playHapticBeep(520);
    }

    pillarItems.forEach(btn => {
      const layer = btn.getAttribute('data-layer');
      btn.addEventListener('click', () => {
        if (layer) selectLayer(layer);
      });
      btn.addEventListener('mouseenter', () => {
        if (layer) selectLayer(layer);
      });
    });

    document.querySelectorAll('.stack-layer').forEach(l => {
      const layer = l.getAttribute('data-layer') || l.getAttribute('data-layer-id');
      l.addEventListener('click', () => {
        if (layer) selectLayer(layer);
      });
      l.addEventListener('mouseenter', () => {
        if (layer) selectLayer(layer);
      });
    });

    specTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        specTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeSpecTab = tab.getAttribute('data-tab') || 'overview';
        updateSpecCard();
        playHapticBeep(450);
      });
    });

    // Live Bedrock Events Rotating Ticker
    const HUD_EVENTS = [
      '[Control] Blocked prompt injection from autonomous agent squad #04',
      '[Optimize] 4,200 tokens cached via semantic cache ($0.042 saved)',
      '[Optimize] Routed general summarization request to Claude 3.5 Haiku (saved 73%)',
      '[Observe] P99 latency: 12ms across 2,400 active Bedrock sessions',
      '[Control] Masked 3 SSN & credit card occurrences before Bedrock ingestion',
      '[Report] Monthly AWS Bedrock savings ledger updated: $62,840 saved to date',
      '[Optimize] Asynchronous batch inference job completed on 120k records (50% discount)',
      '[Observe] Real-time token velocity: 14,280 tokens/sec across 4 foundation models',
      '[Control] Budget envelope alert: Squad #02 allocated spend at 82% threshold'
    ];

    const hudTicker = document.getElementById('hudTicker');
    if (hudTicker) {
      let eventIdx = 0;
      setInterval(() => {
        eventIdx = (eventIdx + 1) % HUD_EVENTS.length;
        hudTicker.innerHTML = `<span class="ticker-item">${HUD_EVENTS[eventIdx]}</span>`;
      }, 4200);
    }

    updateSpecCard();
  })();

  // ==========================================================================
  // MODULE 3.5: ONEOPS CINEMATIC ECOSYSTEM ENGINE (7-NODE INTERACTIVE NETWORK)
  // ==========================================================================
  (function initOneOpsCinematic() {
    const root = document.getElementById('oneops-cinematic');
    if (!root) return;

    const $ = s => root.querySelector(s);
    const NS = 'http://www.w3.org/2000/svg';

    const make = (tag, attrs, parent) => {
      const e = document.createElementNS(NS, tag);
      for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
      parent.appendChild(e);
      return e;
    };

    const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
    const mix = (a, b, t) => a + (b - a) * t;
    const smooth = t => {
      t = clamp(t);
      return t * t * (3 - 2 * t);
    };

    const chapters = [
      { label: 'Discover', title: 'Your stack.', accent: 'In motion.', desc: 'Seven integrations. One control layer. Adds to Bedrock, replaces nothing.' },
      { label: 'Connect', title: 'Built around', accent: 'your AWS.', desc: 'Bring together Bedrock, IAM, CloudWatch, Organizations and Terraform without replacing your existing infrastructure.' },
      { label: 'Route', title: 'Intelligence.', accent: 'In sync.', desc: 'Connect foundation models, prompt caching and high-efficiency routing through a single orchestration layer.' },
      { label: 'Explore', title: 'One stack.', accent: 'All connected.', desc: 'Explore every integration and follow the animated data pathways across the ecosystem.' }
    ];

    const data = [
      ['Amazon Bedrock', 'Native VPC Endpoint', 'INFRASTRUCTURE', 'BR', 'M4 12 12 4 20 12 12 20Z M8 12 12 8 16 12 12 16Z'],
      ['AWS IAM', 'Role-Based Delegation', 'IDENTITY', 'IA', 'M12 3 20 6V12Q20 18 12 21Q4 18 4 12V6Z M9 12 11 14 15 9'],
      ['Amazon CloudWatch', 'Telemetry Streaming', 'OBSERVABILITY', 'CW', 'M3 17 7 12 11 15 15 7 21 11 M3 5V21H21'],
      ['AWS Organizations', 'Multi-Account Budgets', 'GOVERNANCE', 'OR', 'M9 3H15V9H9Z M3 15H9V21H3Z M15 15H21V21H15Z M12 9V12M6 15V12H18V15'],
      ['HashiCorp Terraform', 'IaC Automation', 'AUTOMATION', 'TF', 'M4 3 11 7V15L4 11Z M13 8 20 4V12L13 16Z M13 18 20 22V14'],
      ['Anthropic Claude', 'Prompt Caching & Haiku', 'FOUNDATION MODEL', 'CL', 'M12 2V22M2 12H22M5 5 19 19M19 5 5 19M8 3 16 21M3 16 21 8'],
      ['Meta Llama 3.3', 'High-Efficiency Routing', 'FOUNDATION MODEL', 'ML', 'M12 13C8 4 3 4 3 13S8 22 12 13 21 4 21 13 16 22 12 13Z']
    ];

    const svg = $('#oo-svg'),
          stars = $('#oo-stars'),
          orbits = $('#oo-orbits'),
          wires = $('#oo-wires'),
          packets = $('#oo-packets'),
          core = $('#oo-core'),
          cube = $('#oo-cube'),
          nodes = $('#oo-nodes');

    if (!svg || !nodes) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let mobile = false, W = 960, H = 640, cx = 480, cy = 320, nw = 208, nh = 65, selected = -1, hover = -1, progress = 0, display = 0, chapter = -1, mouse = { x: 0, y: 0 }, pointer = { x: 0, y: 0 };

    const seeds = Array.from({ length: 85 }, (_, i) => ({
      x: ((i * 73.91) % 100) / 100,
      y: ((i * i * 13.37 + i * 17.9) % 100) / 100,
      r: i % 7 === 0 ? 1.6 : .7
    }));

    const dots = seeds.map(s => make('circle', { r: s.r, fill: '#E07063' }, stars));
    const rings = Array.from({ length: 4 }, (_, i) => make('ellipse', {
      fill: 'none',
      stroke: i === 0 ? '#E07063' : 'rgba(224, 112, 99, 0.35)',
      'stroke-width': i === 0 ? 1.2 : .7,
      'stroke-dasharray': i === 1 ? '2 8' : i === 2 ? '16 12' : 'none'
    }, orbits));

    const nav = $('.oo-steps');
    if (nav) {
      chapters.forEach((c, i) => {
        const b = document.createElement('button');
        b.className = 'oo-step';
        b.innerHTML = `<span class="num">0${i + 1}</span><span class="rail"></span><span>${c.label}</span>`;
        b.addEventListener('click', () => {
          const pin = root.querySelector('.oo-pin');
          const pinHeight = pin ? pin.offsetHeight : window.innerHeight;
          const start = window.scrollY + root.getBoundingClientRect().top;
          const range = root.offsetHeight - pinHeight;
          window.scrollTo({
            top: start + range * [.03, .32, .63, .97][i],
            behavior: reduce.matches ? 'instant' : 'smooth'
          });
        });
        nav.append(b);
      });
    }

    const buttons = nav ? [...nav.children] : [];

    const items = data.map((d, i) => {
      const base = make('path', { fill: 'none', stroke: 'rgba(224, 112, 99, 0.25)', 'stroke-width': 1.1, 'stroke-opacity': .3 }, wires);
      const line = make('path', { fill: 'none', stroke: '#E07063', 'stroke-width': 1.5, 'stroke-linecap': 'round' }, wires);
      const dots = Array.from({ length: 3 }, () => make('circle', { r: 2.6, fill: '#FFB2A8', filter: 'url(#oo-glow)' }, packets));
      const g = make('g', { class: 'oo-node', role: 'button', tabindex: '0', 'aria-label': d[0] + ': ' + d[1], 'aria-pressed': 'false' }, nodes);
      const rect = make('rect', { class: 'face', rx: 10, fill: '#1E161C', stroke: 'rgba(224, 112, 99, 0.22)', 'stroke-width': .8 }, g);
      const iconBg = make('rect', { rx: 7, fill: 'rgba(224, 112, 99, 0.08)', stroke: 'rgba(224, 112, 99, 0.28)', 'stroke-width': .7 }, g);
      const icon = make('path', { d: d[4], fill: 'none', stroke: '#E07063', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      const title = make('text', { class: 'node-title' }, g);
      title.textContent = d[0];
      const sub = make('text', { class: 'node-sub' }, g);
      sub.textContent = d[1];
      const status = make('circle', { r: 2.6, fill: '#E07063' }, g);
      const label = make('text', { class: 'node-cat' }, g);
      label.textContent = d[2];

      const toggle = () => {
        selected = selected === i ? -1 : i;
        updateDetail();
      };

      g.addEventListener('pointerenter', () => { hover = i; updateDetail(); });
      g.addEventListener('pointerleave', () => { hover = -1; updateDetail(); });
      g.addEventListener('focus', () => { hover = i; updateDetail(); });
      g.addEventListener('blur', () => { hover = -1; updateDetail(); });
      g.addEventListener('click', toggle);
      g.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
        if (e.key === 'Escape') {
          selected = -1;
          hover = -1;
          updateDetail();
        }
      });

      return { g, rect, iconBg, icon, title, sub, status, label, base, line, dots };
    });

    function updateDetail() {
      const idx = hover >= 0 ? hover : selected;
      items.forEach((it, i) => {
        it.g.classList.toggle('chosen', i === idx);
        it.g.setAttribute('aria-pressed', String(i === selected));
      });
      const iconEl = $('#oo-detail-icon');
      const titleEl = $('#oo-detail-title');
      const textEl = $('#oo-detail-text');
      const statusEl = $('#oo-detail-status');

      if (iconEl) iconEl.textContent = idx < 0 ? '07' : data[idx][3];
      if (titleEl) titleEl.textContent = idx < 0 ? 'Explore the ecosystem' : data[idx][0];
      if (textEl) textEl.textContent = idx < 0 ? 'Hover, tap or focus an integration node to inspect its connection.' : data[idx][1] + ' · ' + data[idx][2].toLowerCase();
      if (statusEl) statusEl.textContent = idx < 0 ? 'NETWORK / DEMO' : 'NODE / ' + String(idx + 1).padStart(2, '0');
    }

    function layout() {
      mobile = window.innerWidth <= 700;
      W = mobile ? 420 : 960;
      H = mobile ? 465 : 640;
      cx = W / 2;
      cy = mobile ? 221 : 305;
      nw = mobile ? 191 : 210;
      nh = mobile ? 43 : 65;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

      items.forEach(it => {
        const x = -nw / 2, y = -nh / 2;
        for (const [k, v] of Object.entries({ x, y, width: nw, height: nh })) it.rect.setAttribute(k, v);
        for (const [k, v] of Object.entries({ x: x + 9, y: y + (mobile ? 8 : 12), width: mobile ? 26 : 35, height: mobile ? 26 : 35 })) it.iconBg.setAttribute(k, v);
        it.icon.setAttribute('transform', `translate(${x + (mobile ? 13 : 15)} ${y + (mobile ? 12 : 18)}) scale(${mobile ? .75 : 1})`);
        it.title.setAttribute('x', x + (mobile ? 42 : 53));
        it.title.setAttribute('y', y + (mobile ? 17 : 26));
        it.title.style.fontSize = mobile ? '12px' : '13px';
        it.title.style.fontFamily = "'Space Grotesk', sans-serif";
        it.sub.setAttribute('x', x + (mobile ? 42 : 53));
        it.sub.setAttribute('y', y + (mobile ? 31 : 42));
        it.sub.style.fontSize = mobile ? '9.2px' : '10px';
        it.sub.style.fontFamily = "'Space Grotesk', sans-serif";
        it.status.setAttribute('cx', nw / 2 - 10);
        it.status.setAttribute('cy', y + 10);
        it.label.setAttribute('x', x + 2);
        it.label.setAttribute('y', y - 7);
        it.label.style.display = mobile ? 'none' : '';
        it.label.style.fontFamily = "'Space Grotesk', monospace";
      });
      readScroll();
    }

    function readScroll() {
      const rect = root.getBoundingClientRect();
      const pin = root.querySelector('.oo-pin');
      const pinH = pin ? pin.offsetHeight : window.innerHeight;
      progress = reduce.matches ? 1 : clamp(-rect.top / Math.max(1, root.offsetHeight - pinH));
    }

    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', layout);
    reduce.addEventListener('change', layout);

    const sceneEl = $('.oo-scene');
    if (sceneEl) {
      sceneEl.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        const r = sceneEl.getBoundingClientRect();
        pointer.x = (e.clientX - r.left) / r.width - .5;
        pointer.y = (e.clientY - r.top) / r.height - .5;
      });
      sceneEl.addEventListener('pointerleave', () => {
        pointer.x = pointer.y = 0;
      });
    }

    function updateChapter(i) {
      if (i === chapter) return;
      chapter = i;
      const c = chapters[i];
      const idxEl = $('#oo-index');
      const titleEl = $('#oo-title');
      const descEl = $('#oo-desc');

      if (idxEl) idxEl.textContent = `0${i + 1} / 04 — ${c.label.toUpperCase()}`;
      if (titleEl) titleEl.innerHTML = c.title + '<em>' + c.accent + '</em>';
      if (descEl) descEl.textContent = c.desc;

      for (const el of [titleEl, descEl]) {
        if (el) {
          el.classList.remove('oo-flash');
          void el.offsetWidth;
          el.classList.add('oo-flash');
        }
      }

      buttons.forEach((b, n) => {
        b.classList.toggle('active', n === i);
        if (n === i) b.setAttribute('aria-current', 'step');
        else b.removeAttribute('aria-current');
      });
    }

    const posDesktop = [[155, 112], [480, 65], [805, 112], [145, 330], [815, 330], [235, 535], [725, 535]];
    const posMobile = [[105, 38], [315, 38], [105, 106], [315, 106], [105, 365], [315, 365], [210, 429]];

    function frame(now) {
      requestAnimationFrame(frame);
      const rect = root.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      display = reduce.matches ? 1 : mix(display, progress, .13);
      if (Math.abs(display - progress) < .0005) display = progress;

      const p = display, t = reduce.matches ? 0 : now / 1000;
      mouse.x = mix(mouse.x, pointer.x, .07);
      mouse.y = mix(mouse.y, pointer.y, .07);
      const px = reduce.matches ? 0 : mouse.x * (mobile ? 0 : 18);
      const py = reduce.matches ? 0 : mouse.y * (mobile ? 0 : 12);

      const chapterIndex = p < .20 ? 0 : p < .48 ? 1 : p < .76 ? 2 : 3;
      updateChapter(chapterIndex);

      const assemble = smooth((p - .06) / .53);
      const energy = smooth((p - .28) / .48);
      const rotate = (1 - assemble) * .85;

      const centerX = cx + px, centerY = cy + py;
      const coreScale = (mobile ? .63 : 1) * (1 + .10 * Math.sin(p * Math.PI));

      core.setAttribute('transform', `translate(${centerX} ${centerY}) scale(${coreScale})`);
      cube.setAttribute('transform', `translate(0 ${Math.sin(t * 1.8) * 5}) rotate(${Math.sin(t * .7) * 2 + (1 - assemble) * -12})`);

      seeds.forEach((s, i) => {
        dots[i].setAttribute('cx', s.x * W + px * (i % 3 + 1));
        dots[i].setAttribute('cy', s.y * H + py * (i % 3 + 1));
        dots[i].setAttribute('opacity', (.09 + .16 * (.5 + .5 * Math.sin(t * .6 + i))) * (1 + .5 * energy));
      });

      rings.forEach((r, i) => {
        const k = mobile ? .52 : 1;
        r.setAttribute('cx', centerX);
        r.setAttribute('cy', centerY);
        r.setAttribute('rx', (120 + i * 62) * k * (.8 + .2 * assemble));
        r.setAttribute('ry', (48 + i * 40) * k * (.7 + .3 * assemble));
        r.setAttribute('transform', `rotate(${(i % 2 ? 1 : -1) * (18 + i * 12 + rotate * 35) + t * (i % 2 ? 2 : -2)} ${centerX} ${centerY})`);
        r.setAttribute('opacity', .10 + .13 * energy);
        r.setAttribute('stroke-dashoffset', t * 9 * (i % 2 ? 1 : -1));
      });

      let linked = 0;
      const focus = hover >= 0 ? hover : selected;

      items.forEach((it, i) => {
        const target = (mobile ? posMobile : posDesktop)[i];
        const a = i * 2.39996 + t * .16;
        const radius = (mobile ? 38 : 75) * (1 + i * .11);
        const startX = cx + Math.cos(a) * radius;
        const startY = cy + Math.sin(a) * radius * .62;
        const reveal = smooth((p + .035 - i * .039) / .25);
        const travel = smooth((p - .04 - i * .035) / .43);
        const x = mix(startX, target[0], travel) + px * (.6 + i * .06);
        const y = mix(startY, target[1], travel) + py * (.6 + i * .06);
        const s = (.28 + .72 * travel);

        it.g.setAttribute('transform', `translate(${x} ${y}) scale(${s})`);
        it.g.setAttribute('opacity', reveal * (focus >= 0 && focus !== i ? .53 : 1));
        it.g.style.pointerEvents = reveal > .7 && travel > .7 ? 'auto' : 'none';
        it.g.setAttribute('tabindex', reveal > .7 && travel > .7 ? '0' : '-1');
        it.g.setAttribute('aria-hidden', reveal > .7 && travel > .7 ? 'false' : 'true');

        const dx = x - centerX, dy = y - centerY;
        const bx = x - Math.sign(dx) * Math.min(Math.abs(dx), nw * s / 2 * .85);
        const by = y - Math.sign(dy) * Math.min(Math.abs(dy), nh * s / 2 * .5);
        const d = `M${centerX} ${centerY} C${centerX + dx * .16} ${centerY + dy * .72},${centerX + dx * .78} ${centerY + dy * .23},${bx} ${by}`;

        it.base.setAttribute('d', d);
        it.line.setAttribute('d', d);
        it.base.setAttribute('opacity', travel * .9);

        const charge = smooth((p - .23 - i * .052) / .27);
        const length = it.line.getTotalLength();
        it.line.setAttribute('stroke-dasharray', `${length} ${length + 1}`);
        it.line.setAttribute('stroke-dashoffset', length * (1 - charge));
        it.line.setAttribute('opacity', charge * (focus >= 0 && focus !== i ? .18 : focus === i ? 1 : .68));
        it.line.setAttribute('stroke-width', focus === i ? 2.8 : 1.5);
        it.status.setAttribute('fill', charge > .92 ? '#2ECC71' : '#E07063');
        if (charge > .92) linked++;

        it.dots.forEach((dot, j) => {
          const u = (t * (.16 + i * .014) + j / 3 + i * .12) % 1;
          const point = it.line.getPointAtLength(u * length);
          dot.setAttribute('cx', point.x);
          dot.setAttribute('cy', point.y);
          dot.setAttribute('opacity', reduce.matches ? 0 : charge > .9 && u > .07 && u < .94 ? (focus >= 0 && focus !== i ? .13 : .85) * energy : 0);
        });
      });

      const countEl = $('#oo-count');
      const percEl = $('#oo-percent');
      const progressRail = $('.oo-progress i');
      const progressWrap = $('.oo-progress');

      if (countEl) countEl.textContent = String(linked).padStart(2, '0');
      const perc = Math.round(p * 100);
      if (percEl) percEl.textContent = String(perc).padStart(2, '0') + '%';
      if (progressRail) progressRail.style.width = perc + '%';
      if (progressWrap) progressWrap.setAttribute('aria-valuenow', perc);
    }

    layout();
    display = progress;
    requestAnimationFrame(frame);
  })();

  // ==========================================================================
  // MODULE 4: SECTION 4 SCROLLYTELLING ENGINE (CANVAS 2D & TRAJECTORY SPLINE)
  // ==========================================================================
  (function initSection4Engine() {
    const scrollyTrack = document.getElementById('hero-scrolly-track');
    const slides = [
      document.getElementById('slide-1'),
      document.getElementById('slide-2'),
      document.getElementById('slide-3')
    ];
    const scrollFill = document.getElementById('scroll-fill');
    const programsSection = document.getElementById('programs-section');
    const stageColHeads = document.querySelectorAll('.stage-col-head');
    const programCards = document.querySelectorAll('.stage-program-card');
    const mainPath = document.getElementById('main-path');
    const branchPaths = [
      document.getElementById('branch-1'),
      document.getElementById('branch-2'),
      document.getElementById('branch-3'),
      document.getElementById('branch-4')
    ];
    const dots = [
      document.getElementById('dot-1'),
      document.getElementById('dot-2'),
      document.getElementById('dot-3'),
      document.getElementById('dot-4')
    ];
    const canvas = document.getElementById('orbital-canvas');

    if (!scrollyTrack || !canvas) return;

    let currentScrollProgress = 0;
    let targetScrollProgress = 0;
    let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
    let mainLength = 0;
    let branchLengths = [0, 0, 0, 0];

    // Word Span Tokenizer for Scroll-driven Illumination
    function wrapWordsInElement(el, isLight = false) {
      if (!el) return [];
      const spanClass = isLight ? 'word-light' : 'word';
      const spans = [];

      function process(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const chunks = text.split(/(\s+)/);
          const frag = document.createDocumentFragment();

          chunks.forEach(chunk => {
            if (/^\s+$/.test(chunk)) {
              frag.appendChild(document.createTextNode(chunk));
            } else if (chunk.length > 0) {
              const span = document.createElement('span');
              span.className = spanClass;
              span.textContent = chunk;
              frag.appendChild(span);
              spans.push(span);
            }
          });
          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList.contains('accent-word')) {
            const span = document.createElement('span');
            span.className = `${spanClass} accent-word`;
            span.textContent = node.textContent;
            node.parentNode.replaceChild(span, node);
            spans.push(span);
          } else {
            Array.from(node.childNodes).forEach(process);
          }
        }
      }
      process(el);
      return spans;
    }

    const scrubRegistry = {
      slide1: [],
      slide2Title: [],
      slide2Desc: [],
      slide3Title: [],
      slide3Desc: [],
      progLine1: wrapWordsInElement(document.getElementById('prog-line-1'), true),
      progLine2: wrapWordsInElement(document.getElementById('prog-line-2'), true)
    };

    // 2D Canvas Geometric Circles Rendering
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = 0, height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function drawGeometricCircle(cx, cy, radius) {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = isLight ? 'rgba(58, 46, 53, 0.22)' : 'rgba(255, 255, 255, 0.38)';
      ctx.shadowColor = isLight ? 'rgba(194, 59, 46, 0.15)' : 'rgba(194, 59, 46, 0.35)';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.restore();
    }

    function drawGlassySegment(cx, cy, radius, centerAngle, arcLength) {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const startAngle = centerAngle - arcLength * 0.5;
      const endAngle = centerAngle + arcLength * 0.5;

      // 1. Soft diffused outer bloom / ambient glass dispersion
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.lineWidth = 6.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = isLight ? 'rgba(194, 59, 46, 0.22)' : 'rgba(224, 112, 99, 0.28)';
      ctx.shadowColor = isLight ? 'rgba(194, 59, 46, 0.65)' : 'rgba(224, 112, 99, 0.9)';
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.restore();

      // 2. Vibrant logo-colored body cylinder (#E07063 / #C23B2E)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = isLight ? '#C23B2E' : '#E07063';
      ctx.shadowColor = isLight ? 'rgba(194, 59, 46, 0.8)' : 'rgba(224, 112, 99, 0.95)';
      ctx.shadowBlur = 9;
      ctx.stroke();
      ctx.restore();

      // 3. Inner translucent gloss highlight
      ctx.save();
      const midHalf = arcLength * 0.32;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, centerAngle - midHalf, centerAngle + midHalf);
      ctx.lineWidth = 2.0;
      ctx.lineCap = 'round';
      ctx.strokeStyle = isLight ? 'rgba(255, 140, 130, 0.85)' : 'rgba(255, 195, 185, 0.9)';
      ctx.shadowColor = isLight ? 'rgba(194, 59, 46, 0.45)' : 'rgba(255, 180, 170, 0.8)';
      ctx.shadowBlur = 5;
      ctx.stroke();
      ctx.restore();

      // 4. Specular reflection sheen (sharp pure white glassy reflection streak)
      ctx.save();
      const sheenHalf = arcLength * 0.16;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, centerAngle - sheenHalf, centerAngle + sheenHalf);
      ctx.lineWidth = 1.1;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.restore();

      // 5. Specular refraction lens flare / bead at the center
      const px = cx + radius * Math.cos(centerAngle);
      const py = cy + radius * Math.sin(centerAngle);
      ctx.save();
      // Outer lens aura
      const flareGrad = ctx.createRadialGradient(px, py, 0, px, py, 9);
      flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      flareGrad.addColorStop(0.3, isLight ? 'rgba(194, 59, 46, 0.7)' : 'rgba(224, 112, 99, 0.75)');
      flareGrad.addColorStop(0.7, isLight ? 'rgba(194, 59, 46, 0.2)' : 'rgba(224, 112, 99, 0.2)');
      flareGrad.addColorStop(1, 'rgba(224, 112, 99, 0)');
      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, Math.PI * 2);
      ctx.fill();

      // Sharp glassy bead center
      const beadGrad = ctx.createRadialGradient(px - 0.7, py - 0.7, 0, px, py, 3.0);
      beadGrad.addColorStop(0, '#ffffff');
      beadGrad.addColorStop(0.4, '#FFE0DC');
      beadGrad.addColorStop(0.85, isLight ? '#C23B2E' : '#E07063');
      beadGrad.addColorStop(1, isLight ? 'rgba(194, 59, 46, 0.8)' : 'rgba(224, 112, 99, 0.8)');
      ctx.fillStyle = beadGrad;
      ctx.beginPath();
      ctx.arc(px, py, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    let orbitalTime = 0;
    let lastTimestamp = performance.now();

    function renderOrbitalScene(timestamp) {
      const rect = scrollyTrack.getBoundingClientRect();
      if (document.hidden || rect.bottom < 0 || rect.top > innerHeight) {
        lastTimestamp = timestamp || performance.now();
        requestAnimationFrame(renderOrbitalScene);
        return;
      }
      if (!timestamp) timestamp = performance.now();
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;
      orbitalTime += dt;

      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.09;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2 + mouseX * 15;
      const centerY = height / 2 + mouseY * 15;

      const R_start = height * 0.649;
      const R_end = height * 0.337;
      const t = currentScrollProgress;

      let R = R_start;
      let dist = R_start * 2.002;
      let angle = 0;

      if (t < 0.16) {
        R = R_start;
        dist = R_start * 2.002;
        angle = 0;
      } else if (t >= 0.16 && t < 0.32) {
        const rotProg = (t - 0.16) / 0.16;
        const easeRot = rotProg < 0.5 ? 2 * rotProg * rotProg : -1 + (4 - 2 * rotProg) * rotProg;
        angle = easeRot * (Math.PI / 2);
        R = R_start - (R_start - height * 0.48) * easeRot;
        dist = (R_start * 2.002) - (R_start * 2.002 - height * 0.493) * easeRot;
      } else if (t >= 0.32 && t < 0.62) {
        angle = Math.PI / 2;
        R = height * 0.48;
        dist = height * 0.493;
      } else if (t >= 0.62 && t < 0.78) {
        const mergeProg = (t - 0.62) / 0.16;
        const easeMerge = mergeProg < 0.5 ? 2 * mergeProg * mergeProg : -1 + (4 - 2 * mergeProg) * mergeProg;
        angle = Math.PI / 2;
        const R_mid = height * 0.48;
        R = R_mid - (R_mid - R_end) * easeMerge;
        dist = (height * 0.493) * (1 - easeMerge);
      } else {
        R = R_end;
        dist = 0;
        angle = 0;
      }

      const dx = dist * Math.cos(angle) * 0.5;
      const dy = dist * Math.sin(angle) * 0.5;

      // Draw base geometric circles
      drawGeometricCircle(centerX - dx, centerY - dy, R);
      if (dist > 1.5) {
        drawGeometricCircle(centerX + dx, centerY + dy, R);
      }

      // Orbital motion parameters: both circles have logo color moving along circle with glassy effect
      const arcLength = 0.72; // ~41 degrees arc
      const angle1 = (orbitalTime * 0.48 + currentScrollProgress * 1.8) % (Math.PI * 2);
      const angle2 = (-orbitalTime * 0.42 + currentScrollProgress * 1.8 + Math.PI * 0.75) % (Math.PI * 2);

      // Render moving glassy logo color segment in both circles
      drawGlassySegment(centerX - dx, centerY - dy, R, angle1, arcLength);
      drawGlassySegment(centerX - dx, centerY - dy, R, (angle1 + Math.PI) % (Math.PI * 2), arcLength);
      if (dist > 1.5) {
        drawGlassySegment(centerX + dx, centerY + dy, R, angle2, arcLength);
        drawGlassySegment(centerX + dx, centerY + dy, R, (angle2 + Math.PI) % (Math.PI * 2), arcLength);
      }

      requestAnimationFrame(renderOrbitalScene);
    }

    requestAnimationFrame(renderOrbitalScene);

    function scrubWords(wordArray, progress) {
      if (!wordArray || wordArray.length === 0) return;
      const total = wordArray.length;
      const activeCount = Math.floor(progress * total);
      wordArray.forEach((span, idx) => {
        if (idx <= activeCount) {
          span.classList.add('is-revealed');
        } else {
          span.classList.remove('is-revealed');
        }
      });
    }

    function handleScrollyProgress(t) {
      targetScrollProgress = t;
      if (scrollFill) {
        scrollFill.style.width = `${Math.max(15, t * 100)}%`;
      }

      let activeIdx = 0;
      if (t >= 0.28 && t < 0.62) activeIdx = 1;
      else if (t >= 0.62) activeIdx = 2;

      slides.forEach((slide, idx) => {
        if (slide) {
          slide.classList.toggle('active', idx === activeIdx);
        }
      });

      if (activeIdx === 0) {
        // Slide 1 active - full text always visible, no scroll letter highlighting
      } else if (activeIdx === 1) {
        // Slide 2 active - full text always visible, no scroll letter highlighting
      } else if (activeIdx === 2) {
        // Slide 3 active - full text always visible, no scroll letter highlighting
      }
    }

    // Trajectory SVG and Stage Program Cards
    function initSvgPaths() {
      if (mainPath) {
        mainLength = mainPath.getTotalLength();
        mainPath.style.strokeDasharray = mainLength;
        mainPath.style.strokeDashoffset = mainLength;
      }
      branchPaths.forEach((path, idx) => {
        if (path) {
          const len = path.getTotalLength();
          branchLengths[idx] = len;
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;
        }
      });
    }
    initSvgPaths();

    function scrubProgramsSection(progress) {
      if (progress < 0.35) {
        const p1 = Math.min(1, progress / 0.22);
        const p2 = Math.max(0, (progress - 0.1) / 0.22);
        scrubWords(scrubRegistry.progLine1, p1);
        scrubWords(scrubRegistry.progLine2, p2);
      } else {
        scrubWords(scrubRegistry.progLine1, 1.0);
        scrubWords(scrubRegistry.progLine2, 1.0);
      }

      const curveProg = Math.max(0, Math.min(1, (progress - 0.12) / 0.45));
      if (mainPath && mainLength > 0) {
        mainPath.style.strokeDashoffset = mainLength * (1 - curveProg);
      }

      const branchThresholds = [0.22, 0.32, 0.42, 0.52];
      branchPaths.forEach((path, idx) => {
        if (!path) return;
        const th = branchThresholds[idx];
        const bProg = Math.max(0, Math.min(1, (progress - th) / 0.16));
        path.style.strokeDashoffset = branchLengths[idx] * (1 - bProg);

        if (dots[idx]) {
          dots[idx].classList.toggle('is-active', bProg > 0.85);
        }
      });

      if (progress >= 0.18) {
        stageColHeads.forEach((col, idx) => {
          setTimeout(() => col.classList.add('is-revealed'), idx * 70);
        });
      }

      if (progress >= 0.48) {
        programCards.forEach((card, idx) => {
          setTimeout(() => card.classList.add('is-revealed'), idx * 90);
        });
      } else if (progress < 0.2) {
        programCards.forEach(card => card.classList.remove('is-revealed'));
      }
    }

    function onSection4Scroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      const trackRect = scrollyTrack.getBoundingClientRect();
      const trackTop = trackRect.top + scrollY;
      const trackHeight = scrollyTrack.offsetHeight - window.innerHeight;
      let runwayProgress = (scrollY - trackTop) / Math.max(trackHeight, 1);
      runwayProgress = Math.max(0, Math.min(1, runwayProgress));
      handleScrollyProgress(runwayProgress);

      if (programsSection) {
        const progRect = programsSection.getBoundingClientRect();
        const progTotalHeight = programsSection.offsetHeight;
        const progScrolled = window.innerHeight - progRect.top;
        const progProgress = Math.max(0, Math.min(1, progScrolled / (progTotalHeight * 0.85)));
        scrubProgramsSection(progProgress);
      }
    }

    window.addEventListener('scroll', onSection4Scroll, { passive: true });
    onSection4Scroll();

    stageColHeads.forEach((head, idx) => {
      head.addEventListener('mouseenter', () => {
        if (branchPaths[idx]) {
          branchPaths[idx].style.stroke = 'var(--curve-stroke-active)';
          branchPaths[idx].style.strokeWidth = '2.6px';
        }
        if (dots[idx]) dots[idx].style.transform = 'scale(1.8)';
      });
      head.addEventListener('mouseleave', () => {
        if (branchPaths[idx]) {
          branchPaths[idx].style.stroke = 'var(--curve-stroke)';
          branchPaths[idx].style.strokeWidth = '1.6px';
        }
        if (dots[idx]) dots[idx].style.transform = 'scale(1)';
      });
    });
  })();

  // ==========================================================================
  // MODULE 5: SECTION 2 PINNED HORIZONTAL TRACK & "GOVERN" REVEAL ENGINE
  // ==========================================================================
  (function initSection2Engine() {
    const pinnedWrapper = document.getElementById('rules-track') || document.querySelector('.pinned-section-wrapper');
    const horizontalTrack = document.getElementById('horizontal-track');
    const hexGridBg = document.querySelector('.hex-grid-bg');
    const wordReveal = document.getElementById('word-reveal');
    const giantWordContainer = document.querySelector('.giant-word-container');
    const ruleCards = document.querySelectorAll('.rule-card');
    const baseLetterSpans = document.querySelectorAll('#word-base .char-span');
    const revealLetterSpans = document.querySelectorAll('#word-reveal .char-span');

    if (!pinnedWrapper || !horizontalTrack) return;

    const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
    const lerp = (start, end, factor) => start + (end - start) * factor;

    let maxScrollDistance = 0;
    let currentTranslateX = 0, targetTranslateX = 0;
    let currentProgress = 0, targetProgress = 0;
    let currentCardScale = 1.0;
    let isTicking = false;

    function updateDimensions() {
      const trackWidth = horizontalTrack.scrollWidth;
      const windowWidth = window.innerWidth;
      maxScrollDistance = Math.max(0, trackWidth - windowWidth + 120);
    }

    function onScroll() {
      const rect = pinnedWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableHeight = pinnedWrapper.offsetHeight - windowHeight;

      if (totalScrollableHeight <= 0) return;

      const rawProgress = -rect.top / totalScrollableHeight;
      targetProgress = clamp(rawProgress, 0, 1);
      targetTranslateX = targetProgress * maxScrollDistance;

      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(renderLoop);
      }
    }

    function renderLoop() {
      currentTranslateX = lerp(currentTranslateX, targetTranslateX, 0.12);
      currentProgress = lerp(currentProgress, targetProgress, 0.12);

      horizontalTrack.style.transform = `translate3d(${-currentTranslateX}px, 0, 0)`;

      if (hexGridBg) {
        if (currentProgress <= 0.005) {
          hexGridBg.style.opacity = '0';
        } else {
          const bgFade = clamp(currentProgress * 3.5, 0, 0.40);
          hexGridBg.style.opacity = bgFade.toFixed(3);
        }
      }

      // One-by-one letters rise from bottom
      const totalLetters = Math.max(baseLetterSpans.length, 6);
      for (let i = 0; i < totalLetters; i++) {
        const letterStart = (i / totalLetters) * 0.45;
        const letterDuration = 0.16;
        const rawLetterT = (currentProgress - letterStart) / letterDuration;
        const letterT = clamp(rawLetterT, 0, 1);
        const easeT = letterT * letterT * (3 - 2 * letterT);
        const translateY = (1 - easeT) * 110;

        const baseSpan = baseLetterSpans[i];
        const revealSpan = revealLetterSpans[i];

        if (baseSpan) {
          baseSpan.style.transform = `translateY(${translateY.toFixed(2)}%)`;
          baseSpan.style.opacity = easeT.toFixed(3);
        }
        if (revealSpan) {
          revealSpan.style.transform = `translateY(${translateY.toFixed(2)}%)`;
          revealSpan.style.opacity = easeT.toFixed(3);
        }
      }

      if (giantWordContainer) {
        const parallaxDrift = currentProgress * -120;
        giantWordContainer.style.transform = `translate3d(${parallaxDrift}px, 0, 0)`;
      }

      if (wordReveal) {
        const revealPercentage = clamp(currentProgress * 115, 0, 100);
        wordReveal.style.clipPath = `inset(0 ${100 - revealPercentage}% 0 0)`;
      }

      const motionDelta = Math.abs(targetTranslateX - currentTranslateX);
      const targetScale = clamp(1.0 - (motionDelta * 0.0035), 0.935, 1.0);
      currentCardScale = lerp(currentCardScale, targetScale, 0.14);

      ruleCards.forEach((card) => {
        card.style.setProperty('--card-scale', currentCardScale.toFixed(4));
      });

      const trackDiff = Math.abs(targetTranslateX - currentTranslateX);
      const scaleDiff = Math.abs(currentCardScale - 1.0);

      if (trackDiff > 0.1 || scaleDiff > 0.002) {
        requestAnimationFrame(renderLoop);
      } else {
        isTicking = false;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateDimensions();
      onScroll();
    });

    updateDimensions();
    onScroll();
  })();

  // ==========================================================================
  // MODULE 6: SECTION 1 ROTARY DIAL FLYWHEEL ENGINE
  // ==========================================================================
  (function initSection1Engine() {
    const CONFIG = {
      totalCards: 4,
      angleStepDesktop: 25,
      angleStepTablet: 29,
      angleStepMobile: 34,
      radiusDesktop: 1500,
      radiusTablet: 1150,
      radiusMobile: 780,
      ticketHeightDesktop: 205,
      ticketHeightTablet: 220,
      ticketHeightMobile: 190,
      apexYRatio: 0.04,
      lerpFactor: 0.11,
      dragSensitivity: 0.08,
      numberParallaxFactor: 1.85,
    };

    const dialSection = document.getElementById('flywheel-dial') || document.querySelector('.dial-section');
    const dialViewport = document.getElementById('dial-viewport');
    const dialTrackSvg = document.getElementById('dial-track-svg');
    const cards = Array.from(document.querySelectorAll('.dial-card-node'));
    const phaseTabs = Array.from(document.querySelectorAll('.phase-tab-btn'));
    const phaseNumberDisplay = document.getElementById('phase-number');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (!dialSection || !dialViewport) return;

    let viewportWidth = 0, viewportHeight = 0;
    let currentRadius = CONFIG.radiusDesktop;
    let currentAngleStep = CONFIG.angleStepDesktop;
    let currentTicketHeight = CONFIG.ticketHeightDesktop;
    let centerX = 0, centerY = 0, apexY = 0;

    let targetRotation = 0, currentRotation = 0, activeIndex = 0;
    let isDragging = false, dragStartX = 0, dragStartRotation = 0, lastDragX = 0, dragVelocity = 0;
    let isUserInteracting = false;

    function updateDimensions() {
      const rect = dialViewport.getBoundingClientRect();
      viewportWidth = rect.width;
      viewportHeight = rect.height;

      if (window.innerWidth < 768) {
        currentRadius = CONFIG.radiusMobile;
        currentAngleStep = CONFIG.angleStepMobile;
        currentTicketHeight = CONFIG.ticketHeightMobile;
      } else if (window.innerWidth < 1024) {
        currentRadius = CONFIG.radiusTablet;
        currentAngleStep = CONFIG.angleStepTablet;
        currentTicketHeight = CONFIG.ticketHeightTablet;
      } else {
        currentRadius = CONFIG.radiusDesktop;
        currentAngleStep = CONFIG.angleStepDesktop;
        currentTicketHeight = CONFIG.ticketHeightDesktop;
      }

      centerX = viewportWidth / 2;
      apexY = viewportHeight * CONFIG.apexYRatio;
      centerY = apexY + currentTicketHeight + currentRadius;

      renderSvgTrack();
      updateCardPositions(true);
    }

    function renderSvgTrack() {
      if (!dialTrackSvg || viewportWidth === 0) return;
      dialTrackSvg.setAttribute('viewBox', `0 0 ${viewportWidth} ${viewportHeight}`);
      dialTrackSvg.innerHTML = '';

      const sectorColors = ['#C23B2E', '#7A5C6E', '#D4857A', '#3A2E35'];
      const minAngle = -50;
      const maxAngle = 50 + (CONFIG.totalCards - 1) * currentAngleStep;
      const tickInterval = 0.7;

      const gTicks = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gTicks.setAttribute('id', 'dial-ticks-group');

      const pathArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const radStart = (minAngle * Math.PI) / 180;
      const radEnd = (maxAngle * Math.PI) / 180;
      const pStartX = centerX + currentRadius * Math.sin(radStart);
      const pStartY = centerY - currentRadius * Math.cos(radStart);
      const pEndX = centerX + currentRadius * Math.sin(radEnd);
      const pEndY = centerY - currentRadius * Math.cos(radEnd);

      pathArc.setAttribute('d', `M ${pStartX.toFixed(1)} ${pStartY.toFixed(1)} A ${currentRadius} ${currentRadius} 0 0 1 ${pEndX.toFixed(1)} ${pEndY.toFixed(1)}`);
      pathArc.setAttribute('fill', 'none');
      pathArc.setAttribute('stroke', 'rgba(194, 59, 46, 0.25)');
      pathArc.setAttribute('stroke-width', '1.5');
      gTicks.appendChild(pathArc);

      for (let deg = minAngle; deg <= maxAngle; deg += tickInterval) {
        const rad = (deg * Math.PI) / 180;
        const isMajor = Math.abs(deg % (tickInterval * 5)) < 0.01;
        const tickLength = isMajor ? 22 : 12;
        const rInner = currentRadius - 2;
        const rOuter = currentRadius + tickLength;

        const x1 = centerX + rInner * Math.sin(rad);
        const y1 = centerY - rInner * Math.cos(rad);
        const x2 = centerX + rOuter * Math.sin(rad);
        const y2 = centerY - rOuter * Math.cos(rad);

        const phaseIndex = Math.max(0, Math.min(CONFIG.totalCards - 1, Math.round(deg / currentAngleStep)));
        const tickColor = sectorColors[phaseIndex] || sectorColors[0];

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1.toFixed(1));
        line.setAttribute('y1', y1.toFixed(1));
        line.setAttribute('x2', x2.toFixed(1));
        line.setAttribute('y2', y2.toFixed(1));
        line.setAttribute('stroke', tickColor);
        line.setAttribute('stroke-width', isMajor ? '2' : '1.2');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('opacity', isMajor ? '0.85' : '0.42');
        gTicks.appendChild(line);
      }
      dialTrackSvg.appendChild(gTicks);
    }

    function updateCardPositions() {
      if (cards.length === 0 || viewportWidth === 0) return;

      const ticksGroup = document.getElementById('dial-ticks-group');
      if (ticksGroup) {
        ticksGroup.setAttribute('transform', `rotate(${currentRotation.toFixed(2)}, ${centerX}, ${centerY})`);
      }

      let closestIndex = 0;
      let minAbsDiff = Infinity;

      cards.forEach((card, index) => {
        const baseAngle = index * currentAngleStep;
        const cardAngle = baseAngle + currentRotation;
        const rad = (cardAngle * Math.PI) / 180;

        const circX = centerX + currentRadius * Math.sin(rad);
        const circY = centerY - currentRadius * Math.cos(rad);

        const cardWidth = card.offsetWidth || 440;
        const posX = circX - cardWidth / 2;
        const posY = circY - currentTicketHeight;

        card.style.transformOrigin = `50% ${currentTicketHeight}px`;
        card.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0) rotate(${cardAngle.toFixed(2)}deg)`;

        const artwork = card.querySelector('.ticket-artwork');
        if (artwork) {
          const numShiftX = cardAngle * CONFIG.numberParallaxFactor;
          artwork.style.transform = `translate3d(${numShiftX.toFixed(1)}px, 0, 0)`;
        }

        const absAngle = Math.abs(cardAngle);
        if (absAngle < minAbsDiff) {
          minAbsDiff = absAngle;
          closestIndex = index;
        }

        const opacity = Math.max(0.15, 1 - Math.pow(absAngle / 65, 1.5));
        card.style.opacity = Math.min(1, opacity).toFixed(2);

        if (absAngle < currentAngleStep * 0.45) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });

      if (closestIndex !== activeIndex) {
        activeIndex = closestIndex;
        updateIndicators(activeIndex);
      }
    }

    function updateIndicators(index) {
      if (phaseNumberDisplay) {
        phaseNumberDisplay.textContent = `0${index + 1}`;
      }
      phaseTabs.forEach((tab, i) => {
        tab.classList.toggle('is-active', i === index);
      });
      if (btnPrev) btnPrev.disabled = index <= 0;
      if (btnNext) btnNext.disabled = index >= CONFIG.totalCards - 1;
    }

    function onDialScroll() {
      if (isUserInteracting || !dialSection) return;
      const rect = dialSection.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
      const maxRotation = (CONFIG.totalCards - 1) * currentAngleStep;
      targetRotation = -progress * maxRotation;
    }

    function rotateToIndex(index, syncScroll = true) {
      index = Math.max(0, Math.min(CONFIG.totalCards - 1, index));
      targetRotation = -index * currentAngleStep;

      if (syncScroll && dialSection) {
        const rect = dialSection.getBoundingClientRect();
        const scrollableDistance = dialSection.offsetHeight - window.innerHeight;
        const scrollTarget = window.pageYOffset + rect.top + (index / (CONFIG.totalCards - 1)) * scrollableDistance;
        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
      }
      playHapticBeep(490);
    }

    function onPointerDown(e) {
      if (e.target.closest('.card-body a') || e.target.closest('button')) return;
      isDragging = true;
      isUserInteracting = true;
      dragStartX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      dragStartRotation = currentRotation;
      lastDragX = dragStartX;
      dragVelocity = 0;
      dialViewport.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - dragStartX;
      dragVelocity = clientX - lastDragX;
      lastDragX = clientX;

      const minRot = -(CONFIG.totalCards - 1) * currentAngleStep - 8;
      const maxRot = 8;
      const tentativeRot = dragStartRotation + deltaX * CONFIG.dragSensitivity;
      targetRotation = Math.max(minRot, Math.min(maxRot, tentativeRot));
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      if (dialViewport.hasPointerCapture?.(e.pointerId)) dialViewport.releasePointerCapture(e.pointerId);

      const projectedRotation = targetRotation + dragVelocity * 0.25;
      const targetIndex = Math.round(-projectedRotation / currentAngleStep);
      rotateToIndex(targetIndex, true);

      setTimeout(() => { isUserInteracting = false; }, 500);
    }

    function tick() {
      const diff = targetRotation - currentRotation;
      if (Math.abs(diff) > 0.001) {
        currentRotation += diff * CONFIG.lerpFactor;
        updateCardPositions();
      }
      requestAnimationFrame(tick);
    }

    window.addEventListener('resize', updateDimensions, { passive: true });
    window.addEventListener('scroll', onDialScroll, { passive: true });
    window.addEventListener('oneops-theme-changed', renderSvgTrack);

    dialViewport.addEventListener('pointerdown', onPointerDown);
    dialViewport.addEventListener('pointermove', onPointerMove);
    dialViewport.addEventListener('pointerup', onPointerUp);
    dialViewport.addEventListener('pointercancel', onPointerUp);

    phaseTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const idx = parseInt(tab.getAttribute('data-target'), 10);
        if (!isNaN(idx)) rotateToIndex(idx);
      });
    });

    if (btnPrev) btnPrev.addEventListener('click', () => rotateToIndex(activeIndex - 1));
    if (btnNext) btnNext.addEventListener('click', () => rotateToIndex(activeIndex + 1));

    cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        if (!isDragging) rotateToIndex(index);
      });
    });

    updateDimensions();
    onDialScroll();
    currentRotation = targetRotation;
    updateCardPositions();
    updateIndicators(0);
    requestAnimationFrame(tick);
  })();

  // ==========================================================================
  // MODULE 7: SECTION 5 CONCENTRIC ORBITAL GALAXY ENGINE
  // ==========================================================================
  (function initSection5Engine() {
    const track = document.getElementById('galaxy-track') || document.getElementById('integrations-track');
    const circleOut = document.getElementById('galaxy-circle-out');
    const circleIn = document.getElementById('galaxy-circle-in');
    const spinOut = document.getElementById('spin-out');
    const spinIn = document.getElementById('spin-in');
    const content = document.getElementById('galaxy-content');

    const logosOut = Array.from(circleOut ? circleOut.querySelectorAll('.c-galaxy_logo') : []);
    const logosIn = Array.from(circleIn ? circleIn.querySelectorAll('.c-galaxy_logo') : []);
    const allLogos = [...logosOut, ...logosIn];

    const tooltip = document.getElementById('logo-tooltip');
    const tooltipName = document.getElementById('tooltip-name');
    const tooltipDesc = document.getElementById('tooltip-desc');

    if (!track || !circleOut) return;

    const ATTRACTION_RADIUS = 600;
    const ATTRACTION_INTENSITY = 0.8;
    const LERP_SMOOTH = 0.05;
    const BASE_SPIN_OUT = 180;
    const BASE_SPIN_IN = -180;

    let scrollProgress = 0, targetScrollProgress = 0;
    let pointer = null;
    let isPointerActive = false;
    const logoOffsets = allLogos.map(() => ({ x: 0, y: 0 }));
    let ambientSpinOut = 0, ambientSpinIn = 0;

    function updateScroll() {
      const rect = track.getBoundingClientRect();
      const trackScrolled = -rect.top;
      const totalDistance = track.offsetHeight - window.innerHeight;
      if (totalDistance <= 0) {
        targetScrollProgress = 0;
        return;
      }
      targetScrollProgress = Math.max(0, Math.min(1, trackScrolled / totalDistance));
    }

    function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function easeInQuad(t) { return t * t; }
    function lerp(start, end, factor) { return start + (end - start) * factor; }

    function renderGalaxy() {
      const rect = track.getBoundingClientRect();
      if (document.hidden || rect.bottom < 0 || rect.top > innerHeight) {
        requestAnimationFrame(renderGalaxy);
        return;
      }
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.12;

      if (targetScrollProgress > 0 && targetScrollProgress < 1) {
        ambientSpinOut += 0.035;
        ambientSpinIn -= 0.045;
      }

      const p = scrollProgress;
      let scaleOut = 0.1, scaleIn = 0.1, opacityCircles = 1;
      let scrollRotOut = 0, scrollRotIn = 0, logoScale = 0.1;

      if (p <= 0.5) {
        const enterNorm = p / 0.5;
        scaleOut = lerp(0.1, 1.0, easeInOutQuad(enterNorm));
        scaleIn = lerp(0.1, 1.0, easeInOutCubic(enterNorm));
        scrollRotOut = enterNorm * BASE_SPIN_OUT;
        scrollRotIn = enterNorm * BASE_SPIN_IN;
        logoScale = lerp(0.1, 1.0, easeInOutQuad(Math.min(1, enterNorm / 0.6)));
      } else {
        const exitNorm = (p - 0.5) / 0.5;
        scaleOut = lerp(1.0, 2.5, easeInQuad(exitNorm));
        scaleIn = lerp(1.0, 2.2, easeInQuad(exitNorm));
        opacityCircles = lerp(1.0, 0.0, exitNorm);
        scrollRotOut = BASE_SPIN_OUT + exitNorm * 60;
        scrollRotIn = BASE_SPIN_IN - exitNorm * 60;
        logoScale = 1.0;
      }

      if (circleOut) {
        circleOut.style.transform = `scale(${scaleOut.toFixed(4)})`;
        circleOut.style.opacity = opacityCircles.toFixed(3);
      }
      if (circleIn) {
        circleIn.style.transform = `scale(${scaleIn.toFixed(4)})`;
        circleIn.style.opacity = opacityCircles.toFixed(3);
      }

      const totalAngleOut = scrollRotOut + ambientSpinOut;
      const totalAngleIn = scrollRotIn + ambientSpinIn;

      if (spinOut) spinOut.style.transform = `rotate(${totalAngleOut.toFixed(2)}deg)`;
      if (spinIn) spinIn.style.transform = `rotate(${totalAngleIn.toFixed(2)}deg)`;

      logosOut.forEach(logo => {
        const mark = logo.querySelector('.c-galaxy_mark');
        if (mark) mark.style.transform = `rotate(${-totalAngleOut.toFixed(2)}deg) scale(${logoScale.toFixed(3)})`;
      });

      logosIn.forEach(logo => {
        const mark = logo.querySelector('.c-galaxy_mark');
        if (mark) mark.style.transform = `rotate(${-totalAngleIn.toFixed(2)}deg) scale(${logoScale.toFixed(3)})`;
      });

      if (content) {
        let contentOpacity = 0, contentY = 30, contentScale = 0.95;
        if (p < 0.22) {
          contentOpacity = 0;
          content.style.pointerEvents = 'none';
        } else if (p >= 0.22 && p <= 0.75) {
          const revealNorm = Math.min(1, (p - 0.22) / 0.2);
          contentOpacity = easeInOutQuad(revealNorm);
          contentY = (1 - contentOpacity) * 30;
          contentScale = 0.95 + 0.05 * contentOpacity;
          content.style.pointerEvents = 'auto';
        } else {
          const exitTextNorm = (p - 0.75) / 0.25;
          contentOpacity = Math.max(0, 1 - exitTextNorm * 1.5);
          contentY = -exitTextNorm * 60;
          contentScale = 1.0;
          content.style.pointerEvents = 'none';
        }
        content.style.opacity = contentOpacity.toFixed(3);
        content.style.transform = `translate3d(0, ${contentY.toFixed(1)}px, 0) scale(${contentScale.toFixed(3)})`;
      }

      // Magnetic pointer attraction
      if (pointer && isPointerActive && p > 0.15 && p < 0.85) {
        allLogos.forEach((logo, idx) => {
          const offset = logoOffsets[idx];
          const rect = logo.getBoundingClientRect();
          const logoCenterX = rect.left + rect.width / 2 - offset.x;
          const logoCenterY = rect.top + rect.height / 2 - offset.y;
          const dx = pointer.x - logoCenterX;
          const dy = pointer.y - logoCenterY;
          const dist = Math.hypot(dx, dy);

          let targetX = 0, targetY = 0;
          if (dist < ATTRACTION_RADIUS) {
            const factor = Math.pow(Math.max(0, 1 - dist / ATTRACTION_RADIUS), 2) * ATTRACTION_INTENSITY;
            targetX = dx * factor;
            targetY = dy * factor;
          }
          offset.x += (targetX - offset.x) * LERP_SMOOTH;
          offset.y += (targetY - offset.y) * LERP_SMOOTH;
          logo.style.transform = `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0)`;
        });
      } else {
        allLogos.forEach((logo, idx) => {
          const offset = logoOffsets[idx];
          if (Math.abs(offset.x) > 0.1 || Math.abs(offset.y) > 0.1) {
            offset.x += (0 - offset.x) * 0.1;
            offset.y += (0 - offset.y) * 0.1;
            logo.style.transform = `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0)`;
          }
        });
      }

      requestAnimationFrame(renderGalaxy);
    }

    allLogos.forEach(logo => {
      logo.addEventListener('mouseenter', () => {
        const name = logo.getAttribute('data-name');
        const desc = logo.getAttribute('data-desc');
        if (tooltip && name) {
          if (tooltipName) tooltipName.textContent = name;
          if (tooltipDesc) tooltipDesc.textContent = desc || 'Amazon Bedrock Partner Node';
          tooltip.classList.add('is-visible');
        }
      });
      logo.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.classList.remove('is-visible');
      });
    });

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    window.addEventListener('pointermove', (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      isPointerActive = true;
    }, { passive: true });
    window.addEventListener('pointerleave', () => { isPointerActive = false; });

    updateScroll();
    requestAnimationFrame(renderGalaxy);
  })();

  // ==========================================================================
  // MODULE 8: INTERACTIVE FINOPS SAVINGS CALCULATOR
  // ==========================================================================
  (function initCalculatorEngine() {
    const slider = document.getElementById('calcSliderSpend');
    const displayMonthlySpend = document.getElementById('displayMonthlySpend');
    const displaySavings = document.getElementById('displaySavings');
    const displayAnnualSavings = document.getElementById('displayAnnualSavings');

    if (!slider) return;

    function recalculate() {
      const spend = parseInt(slider.value, 10);
      if (displayMonthlySpend) {
        displayMonthlySpend.textContent = `$${spend.toLocaleString()}`;
      }
      // OneOps 5 Levers consistently deliver 42% - 58% savings on Bedrock
      const monthlySavings = Math.round(spend * 0.48);
      const annualSavings = monthlySavings * 12;

      if (displaySavings) {
        displaySavings.textContent = `$${monthlySavings.toLocaleString()}/mo`;
      }
      if (displayAnnualSavings) {
        displayAnnualSavings.textContent = `$${annualSavings.toLocaleString()}`;
      }
    }

    slider.addEventListener('input', recalculate);
    recalculate();
  })();

  // ==========================================================================
  // MODULE 9: ROLE-BASED SOLUTIONS PERSONA TABS
  // ==========================================================================
  (function initPersonaTabs() {
    const personaBtns = document.querySelectorAll('.persona-tab-btn');
    const personaPanels = document.querySelectorAll('.persona-panel');

    personaBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        personaBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-persona');

        personaPanels.forEach(panel => {
          if (panel.id === `persona-${targetId}`) {
            panel.style.display = 'block';
          } else {
            panel.style.display = 'none';
          }
        });
        playHapticBeep(470);
      });
    });
  })();

  // ==========================================================================
  // MODULE 10: CUSTOMER FAQS ACCORDION
  // ==========================================================================
  (function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    function syncFaq(item, open) {
      item.classList.toggle('active', open);
      item.querySelector('.faq-question')?.setAttribute('aria-expanded', String(open));
      const answer = item.querySelector('.faq-answer');
      if (answer) answer.hidden = !open;
    }
    faqItems.forEach((item, index) => {
      const questionBtn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (answer && questionBtn) {
        answer.id ||= `faq-answer-${index + 1}`;
        questionBtn.setAttribute('aria-controls', answer.id);
      }
      syncFaq(item, item.classList.contains('active'));
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');
          faqItems.forEach(i => syncFaq(i, false));
          if (!isOpen) {
            syncFaq(item, true);
            playHapticBeep(500);
          } else {
            playHapticBeep(420);
          }
        });
      }
    });
  })();

  // ==========================================================================
  // MODULE 11: DEMO & ARCHITECTURE REVIEW MODAL
  // ==========================================================================
  function bindDialog(modal, openBtns, closeBtn, activeClass) {
    if (!modal) return;
    let opener = null;
    let previousOverflow = '';
    const focusable = () => [...modal.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')].filter(el => el.getClientRects().length);
    modal.inert = true;
    const open = e => {
      e?.preventDefault();
      if (modal.classList.contains(activeClass)) return;
      opener = e?.currentTarget || document.activeElement;
      previousOverflow = document.body.style.overflow;
      modal.inert = false;
      modal.classList.add(activeClass);
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      (closeBtn || focusable()[0])?.focus({ preventScroll: true });
      playHapticBeep(520);
    };
    const close = () => {
      if (!modal.classList.contains(activeClass)) return;
      modal.classList.remove(activeClass);
      opener?.focus({ preventScroll: true });
      modal.setAttribute('aria-hidden', 'true');
      modal.inert = true;
      document.body.style.overflow = previousOverflow;
      playHapticBeep(360);
    };
    openBtns.forEach(btn => btn.addEventListener('click', open));
    closeBtn?.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', e => {
      if (!modal.classList.contains(activeClass)) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') {
        const items = focusable(), first = items[0], last = items[items.length - 1];
        if (!first) { e.preventDefault(); return; }
        if (e.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
      }
    });
  }

  // Optional form endpoints must return HTTP 2xx only after accepting a submission.
  async function sendForm(form) {
    const endpoint = form.dataset.endpoint?.trim();
    if (!endpoint) throw new Error('This form is not connected yet. Your details have not been sent.');
    const res = await fetch(endpoint, { method: 'POST', body: new FormData(form) });
    if (!res.ok) throw new Error('Submission failed. Please try again later.');
  }
  function bindForm(form, status, successMessage) {
    if (!form || !status) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const btn = form.querySelector('button[type="submit"]');
      if (btn?.disabled) return;
      if (btn) btn.disabled = true;
      status.textContent = 'Sending…';
      status.style.color = '';
      try {
        await sendForm(form);
        status.textContent = successMessage;
        form.reset();
      } catch (err) {
        status.textContent = err instanceof Error && err.message.startsWith('This form') ? err.message : 'Unable to send your request. Please try again later.';
        status.style.color = 'var(--brand-coral-light)';
      } finally { if (btn) btn.disabled = false; }
    });
  }
  (function initModal() {
    const modal = document.getElementById('demoModal') || document.getElementById('leadModal');
    const openBtns = document.querySelectorAll('.open-demo-btn');
    const closeBtn = document.getElementById('modalCloseBtn');
    const modalForm = document.getElementById('demoLeadForm') || document.getElementById('modalForm');

    bindDialog(modal, openBtns, closeBtn, 'is-active');
    bindForm(modalForm, document.getElementById('demoFormStatus'), 'Your request was submitted successfully.');
  })();

  // ==========================================================================
  // MODULE 12: ARCHITECTURAL BLUEPRINT MODAL CONTROLLER
  // ==========================================================================
  (function initBlueprintModal() {
    const openBlueprintBtns = document.querySelectorAll('#btnOpenBlueprint, .open-blueprint-modal-btn');
    const blueprintModal = document.getElementById('blueprintModal');
    const blueprintModalCloseBtn = document.getElementById('blueprintModalCloseBtn');

    if (!blueprintModal) return;

    bindDialog(blueprintModal, openBlueprintBtns, blueprintModalCloseBtn, 'is-open');
  })();

  // ==========================================================================
  // MODULE 13: ENTERPRISE FOOTER CONTROLLER (NEWSLETTER & COPYRIGHT YEAR)
  // ==========================================================================
  (function initEnterpriseFooter() {
    // 1. Dynamic copyright year
    const yearEls = document.querySelectorAll('#currentYear, [data-year]');
    const thisYear = new Date().getFullYear();
    yearEls.forEach(el => {
      el.textContent = thisYear;
    });

    // Newsletter uses the same honest, endpoint-aware submission handling.
    document.querySelectorAll('form.nl, .footer-newsletter form').forEach(form => {
      bindForm(form, form.parentElement.querySelector('.msg'), 'Thanks for subscribing!');
    });
  })();


  // ==========================================================================
  // MODULE 14: THE RUNAWAY REALITY OF ENTERPRISE AI
  // Sticky Stacking Cards with 3D Holographic Canvas & GSAP Controller (Section 10)
  // ==========================================================================
  (function initRunawayRealitySection() {
    'use strict';

    // Only pin the deck when every card fits below the fixed navigation.
    function fitChallengeDeck() {
      const deck = document.getElementById('cardsStack');
      if (!deck) return;
      const cards = Array.from(deck.querySelectorAll('[data-card]'));
      const desktop = window.matchMedia('(min-width: 1001px) and (prefers-reduced-motion: no-preference)');
      let frame = 0;
      function measure() {
        frame = 0;
        const header = document.querySelector('.site-header');
        const navBottom = header ? header.getBoundingClientRect().bottom : 68;
        const top = Math.max(80, Math.ceil(navBottom + 12));
        const strip = window.innerHeight <= 800 ? 6 : 12;
        deck.style.setProperty('--cap-strip', `${strip}px`);
        deck.style.setProperty('--cap-top', `${top}px`);
        const fits = desktop.matches && cards.every((card, i) =>
          card.offsetHeight + top + i * strip + 12 <= window.innerHeight);
        if (deck.classList.contains('deck-fits-viewport') !== fits) {
          deck.classList.toggle('deck-fits-viewport', fits);
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }
      }
      function queue() { if (!frame) frame = requestAnimationFrame(measure); }
      if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(queue);
        cards.forEach(card => observer.observe(card));
      }
      window.addEventListener('resize', queue, { passive: true });
      if (document.fonts) document.fonts.ready.then(queue);
      measure();
    }

    // 1. GSAP ScrollTrigger Card Stacking Kinetics
    function initStackCards() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded. Relying on native CSS sticky stacking.');
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      const cards = Array.from(document.querySelectorAll('[data-card]'));
      if (!cards.length) return;

      cards.forEach((card, i) => {
        const nextCard = cards[i + 1];
        if (!nextCard) return;

        gsap.fromTo(
          card,
          {
            rotate: 0,
            scale: 1,
            transformOrigin: 'center top'
          },
          {
            rotate: i % 2 === 0 ? 0.8 : -0.8,
            scale: 0.97,
            ease: 'none',
            scrollTrigger: {
              trigger: nextCard,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
              invalidateOnRefresh: true
            }
          }
        );
      });

      // Click on card to scroll smoothly into view
      cards.forEach((card, i) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('a') || e.target.closest('button')) return;
          
          if (!card.closest('.deck-fits-viewport')) return;
          const deckStyle = getComputedStyle(card.parentElement);
          const stripHeight = parseFloat(deckStyle.getPropertyValue('--cap-strip')) || 12;
          const top = parseFloat(deckStyle.getPropertyValue('--cap-top')) || 80;
          const targetScroll = card.getBoundingClientRect().top + scrollY - (top + i * stripHeight);
          
          window.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: 'smooth'
          });
        });
      });

      ScrollTrigger.refresh();
    }

    // 2. 3D Holographic Stage Canvas (Wavy Particle Mesh & Floor Radar)
    function initStageCanvases() {
      const canvases = Array.from(document.querySelectorAll('.o-problem-stack-section [data-canvas]'));
      if (!canvases.length) return;

      const stages = canvases.map((canvas) => {
        const ctx = canvas.getContext('2d');
        return {
          canvas,
          ctx,
          parent: canvas.parentElement,
          width: 0,
          height: 0,
          time: Math.random() * 100,
          isVisible: true
        };
      });

      function resize() {
        stages.forEach((st) => {
          const rect = st.parent.getBoundingClientRect();
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          st.width = rect.width;
          st.height = rect.height;
          st.canvas.width = Math.floor(st.width * dpr);
          st.canvas.height = Math.floor(st.height * dpr);
          st.ctx.scale(dpr, dpr);
        });
      }

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const matched = stages.find((s) => s.canvas === entry.target);
            if (matched) matched.isVisible = entry.isIntersecting;
          });
        }, { threshold: 0.05 });

        stages.forEach((st) => observer.observe(st.canvas));
      }

      function render() {
        stages.forEach((st) => {
          if (!st.isVisible || st.width <= 0 || st.height <= 0) return;

          const { ctx, width, height } = st;
          st.time += 0.018;

          ctx.clearRect(0, 0, width, height);

          const centerX = width / 2;
          const floorY = height * 0.94;

          // 1. Concentric Glowing Floor Pedestal Rings (Foreshortened at Base of Stage)
          ctx.save();
          ctx.globalCompositeOperation = 'screen';

          ctx.beginPath();
          ctx.ellipse(centerX, floorY, width * 0.46, height * 0.08, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(centerX, floorY, width * 0.34, height * 0.055, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.20)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.beginPath();
          ctx.setLineDash([4, 6]);
          ctx.ellipse(centerX, floorY, width * 0.22, height * 0.035, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
          ctx.stroke();
          ctx.setLineDash([]);

          const floorGrad = ctx.createRadialGradient(centerX, floorY, 10, centerX, floorY, width * 0.35);
          floorGrad.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
          floorGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = floorGrad;
          ctx.fill();

          ctx.restore();

          // 2. Undulating 3D Particle Wave Mesh (Red on Left, Green on Right)
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';

          const cols = 36;
          const rows = 12;
          const colSpacing = width / (cols - 1);
          const rowSpacing = (height * 0.45) / rows;
          const startY = height * 0.22;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const normX = c / (cols - 1);
              const normY = r / (rows - 1);

              const wave1 = Math.sin(normX * 5 + st.time + normY * 2) * 16;
              const wave2 = Math.cos(normX * 8 - st.time * 0.8) * 10;
              const py = startY + r * rowSpacing + wave1 + wave2;
              const px = c * colSpacing;

              let colorStr;
              const distFromCenter = Math.abs(normX - 0.5) * 2;
              const alpha = (0.2 + (1 - normY) * 0.45) * Math.min(distFromCenter + 0.3, 1);

              if (normX < 0.48) {
                colorStr = `rgba(255, 77, 77, ${alpha * 0.75})`;
              } else if (normX > 0.52) {
                colorStr = `rgba(0, 229, 163, ${alpha * 0.75})`;
              } else {
                colorStr = `rgba(255, 255, 255, ${alpha * 0.3})`;
              }

              const radius = 1.1 + Math.sin(normX * 3 + st.time) * 0.5;
              ctx.beginPath();
              ctx.arc(px, py, radius, 0, Math.PI * 2);
              ctx.fillStyle = colorStr;
              ctx.fill();
            }
          }

          // 3. Ambient Floor Reflection Glows for Red & Green Tablets
          const leftReflectX = width * 0.25;
          const rightReflectX = width * 0.75;
          const reflectY = height * 0.84;

          const redReflect = ctx.createRadialGradient(leftReflectX, reflectY, 5, leftReflectX, reflectY, width * 0.22);
          redReflect.addColorStop(0, 'rgba(255, 77, 77, 0.16)');
          redReflect.addColorStop(1, 'transparent');
          ctx.fillStyle = redReflect;
          ctx.beginPath();
          ctx.ellipse(leftReflectX, reflectY, width * 0.2, height * 0.08, 0, 0, Math.PI * 2);
          ctx.fill();

          const greenReflect = ctx.createRadialGradient(rightReflectX, reflectY, 5, rightReflectX, reflectY, width * 0.22);
          greenReflect.addColorStop(0, 'rgba(0, 229, 163, 0.16)');
          greenReflect.addColorStop(1, 'transparent');
          ctx.fillStyle = greenReflect;
          ctx.beginPath();
          ctx.ellipse(rightReflectX, reflectY, width * 0.2, height * 0.08, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        requestAnimationFrame(render);
      }

      resize();
      window.addEventListener('resize', resize, { passive: true });
      requestAnimationFrame(render);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        fitChallengeDeck();
        initStackCards();
        initStageCanvases();
      });
    } else {
      fitChallengeDeck();
      initStackCards();
      initStageCanvases();
    }
  })();

  // MODULE: ONEOPS GUARDRAILS STAGE ENGINE (.og)
  // ==========================================================================
  (function initGuardrailsEngine() {
    function setupGuardrails() {
      document.querySelectorAll('.og').forEach(root => {
        if (root.__ogInitialized) return;
        root.__ogInitialized = true;

        const canvas = root.querySelector('canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        const fine = matchMedia('(pointer:fine) and (hover:hover)');
        let w = 0, h = 0, raf = 0, active = false, start = 0, tiltEnabled = false, tiltTimer;

        function draw(ms = 0) {
          if (!ctx || !w || !h) return;
          const t = reduced.matches ? 0 : ms * 0.00055;
          ctx.clearRect(0, 0, w, h);
          const step = w < 700 ? 10 : 13, rows = w < 700 ? 12 : 21;
          for (let side = 0; side < 2; side++) {
            const rgb = side ? '32,255,150' : '255,75,40';
            for (let j = 0; j < rows; j++) {
              const v = j / (rows - 1);
              for (let k = 0; k <= Math.ceil(w * 0.56 / step); k++) {
                const u = k * step / (w * 0.56);
                if (u > 1) continue;
                const x = side ? w - u * w * 0.56 : u * w * 0.56;
                const envelope = Math.pow(1 - u, 1.8);
                const wave = Math.sin(u * 8.3 + v * 2.2 + t * (side ? 1 : -1));
                const base = side ? h * (0.47 + 0.18 * u) : h * (0.49 + 0.25 * u);
                const y = base + wave * h * 0.12 * envelope + (v - 0.5) * h * 0.22 * envelope + Math.sin(u * 18 + t * 1.6 + j * 0.5) * 5;
                const fade = Math.pow(1 - u, 1.45) * (0.2 + 0.8 * Math.pow(Math.abs(Math.sin(j * 0.42 + u * 9 + t)), 2));
                const r = (0.55 + 1.1 * Math.pow(Math.abs(Math.sin(u * 13 + j * 0.8 + t)), 6)) * (w < 700 ? 0.72 : 1);
                ctx.fillStyle = `rgba(${rgb},${fade * 0.84})`;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
              }
            }
            ctx.beginPath();
            for (let k = 0; k <= 100; k++) {
              const u = k / 100, x = side ? w - u * w * 0.56 : u * w * 0.56, env = Math.pow(1 - u, 1.8);
              const y = (side ? h * (0.47 + 0.18 * u) : h * (0.49 + 0.25 * u)) + Math.sin(u * 8.3 + 1.1 + t * (side ? 1 : -1)) * h * 0.12 * env;
              k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
            }
            const g = ctx.createLinearGradient(side ? w : 0, 0, w * 0.5, 0);
            g.addColorStop(0, `rgba(${rgb},0.85)`);
            g.addColorStop(0.45, `rgba(${rgb},0.5)`);
            g.addColorStop(1, `rgba(${rgb},0)`);
            ctx.strokeStyle = g;
            ctx.lineWidth = 1.25;
            ctx.shadowColor = `rgb(${rgb})`;
            ctx.shadowBlur = 12;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }

        function tick(now) {
          if (!active || reduced.matches || document.hidden) {
            raf = 0;
            return;
          }
          draw(now - start);
          raf = requestAnimationFrame(tick);
        }

        function playCanvas() {
          if (!raf && active && !reduced.matches && !document.hidden) {
            start = performance.now();
            raf = requestAnimationFrame(tick);
          }
        }

        function stopCanvas() {
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
        }

        function resize() {
          if (!ctx) return;
          const rect = root.getBoundingClientRect();
          w = rect.width;
          h = rect.height;
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.round(w * dpr);
          canvas.height = Math.round(h * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          draw(0);
        }

        if ('ResizeObserver' in window) {
          new ResizeObserver(resize).observe(root);
        } else {
          window.addEventListener('resize', resize, { passive: true });
        }
        resize();

        function reveal() {
          root.classList.add('og-visible');
          tiltEnabled = false;
          clearTimeout(tiltTimer);
          tiltTimer = setTimeout(() => tiltEnabled = true, 1800);
        }

        if (!reduced.matches && 'IntersectionObserver' in window) {
          root.classList.add('og-ready');
        }

        if ('IntersectionObserver' in window) {
          new IntersectionObserver(entries => {
            entries.forEach(e => {
              active = e.isIntersecting;
              if (active) {
                playCanvas();
              } else {
                stopCanvas();
              }
            });
          }, { threshold: 0 }).observe(root);

          const revealObserver = new IntersectionObserver(entries => {
            if (entries.some(e => e.isIntersecting)) {
              reveal();
              revealObserver.disconnect();
            }
          }, { threshold: 0.12 });
          revealObserver.observe(root);
        } else {
          active = true;
          reveal();
          playCanvas();
        }

        const replayBtn = root.querySelector('.og-replay');
        if (replayBtn) {
          replayBtn.addEventListener('click', () => {
            if (reduced.matches) return;
            root.classList.add('og-ready');
            root.classList.remove('og-visible');
            root.querySelectorAll('.og-panel').forEach(p => {
              p.style.setProperty('--rx', '0deg');
              p.style.setProperty('--ry', '0deg');
            });
            void root.offsetWidth;
            reveal();
          });
        }

        root.querySelectorAll('.og-panel').forEach(panel => {
          panel.addEventListener('pointermove', e => {
            if (!fine.matches || reduced.matches || !tiltEnabled) return;
            const r = panel.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            panel.style.setProperty('--rx', `${-y * 7}deg`);
            panel.style.setProperty('--ry', `${x * 9}deg`);
          });
          panel.addEventListener('pointerleave', () => {
            panel.style.setProperty('--rx', '0deg');
            panel.style.setProperty('--ry', '0deg');
          });
        });

        document.addEventListener('visibilitychange', () => document.hidden ? stopCanvas() : playCanvas());
        reduced.addEventListener('change', () => {
          if (reduced.matches) {
            stopCanvas();
            draw(0);
            reveal();
          } else {
            playCanvas();
          }
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupGuardrails);
    } else {
      setupGuardrails();
    }
  })();

})();
