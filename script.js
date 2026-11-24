/**
 * OneOps — Role-Based Value Proposition Master Controller
 * Orchestrates GSAP ScrollTrigger pinning, 5-scene cinematic timeline,
 * SVG stream path illumination, dual theme engine (dark/light),
 * and bidirectional 3D WebGL synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Visual Engine
  let threeScene = null;
  const canvasContainer = document.getElementById('oneopsCanvasContainer');
  if (canvasContainer && typeof THREE !== 'undefined' && typeof OneOpsRoleScene !== 'undefined' && !matchMedia('(max-width: 1080px), (max-height: 499px), (prefers-reduced-motion: reduce)').matches) {
    try {
      threeScene = new OneOpsRoleScene('oneopsCanvasContainer');
      canvasContainer.classList.add('has-webgl');
    } catch (err) {
      canvasContainer.querySelectorAll('canvas').forEach(canvas => canvas.remove());
      console.warn('WebGL unavailable; using the static core.');
    }
  }

  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  // 3. Cache DOM References
  const wrapper = document.getElementById('solutions') || document.getElementById('oneopsRoleWrapper');
  const section = document.getElementById('oneops-role-section');
  if (!wrapper || !section) {
    console.warn('OneOps Section 9 wrapper or section element not found.');
    return;
  }
  const siteHeader = document.querySelector('.site-header');
  function measureRoleHeader() {
    const bottom = siteHeader ? siteHeader.getBoundingClientRect().bottom : 72;
    wrapper.style.setProperty('--role-header-clearance', `${Math.max(90, Math.ceil(bottom + 18))}px`);
  }
  measureRoleHeader();
  if (siteHeader && 'ResizeObserver' in window) new ResizeObserver(measureRoleHeader).observe(siteHeader);
  window.addEventListener('resize', measureRoleHeader, { passive: true });
  if (document.fonts) document.fonts.ready.then(measureRoleHeader);
  const headlineSlides = document.querySelectorAll('.role-headline-slide');
  const leftNodeSets = document.querySelectorAll('#leftNodesGroup .node-set');
  const rightNodeSets = document.querySelectorAll('#rightNodesGroup .node-set');
  const capabilityPanels = document.querySelectorAll('.capability-panel');
  const navButtons = document.querySelectorAll('.role-nav-btn');
  const navActivePill = document.getElementById('navActivePill');
  const securityShield = document.getElementById('hudSecurityShield');
  const feedbackGroup = document.getElementById('svgFeedbackGroup');
  const coreHudTitle = document.getElementById('coreHudTitle');
  const coreHudMetric = document.getElementById('coreHudMetric');

  // Scene Configuration Data (with dark & light accents)
  const sceneConfigs = [
    {
      index: 0,
      name: 'Intro',
      hudTitle: 'ONEOPS CONTROL PLANE',
      hudMetric: 'REAL-TIME IN-FLIGHT INSPECTION // <1.2ms OVERHEAD',
      accentDark: '#d4857a',
      accentLight: '#a83125'
    },
    {
      index: 1,
      name: 'FinOps / Engineering Leads',
      hudTitle: 'FINOPS INTELLIGENCE ENGINE',
      hudMetric: 'PRE-EXECUTION BUDGET CAPS // 58% AVERAGE REDUCTION',
      accentDark: '#ef6d5d',
      accentLight: '#a83125'
    },
    {
      index: 2,
      name: 'Security / Compliance Officers',
      hudTitle: 'PRE-MODEL PERIMETER SHIELD',
      hudMetric: 'IN-FLIGHT PII INTERCEPTION // ZERO MODEL CONTAMINATION',
      accentDark: '#d4857a',
      accentLight: '#a83125'
    },
    {
      index: 3,
      name: 'Platform / DevOps Architects',
      hudTitle: 'UNIFIED MODEL GATEWAY',
      hudMetric: 'INTELLIGENT PROFILE ROUTING // 99.99% BEDROCK UPTIME',
      accentDark: '#b99aab',
      accentLight: '#69485d'
    },
    {
      index: 4,
      name: 'Executive / Procurement Leadership',
      hudTitle: 'ENTERPRISE GOVERNANCE DIGEST',
      hudMetric: 'CONTINUOUS FLYWHEEL // PAYS BACK EVERY WEEK',
      accentDark: '#e9a89b',
      accentLight: '#a34238'
    }
  ];

  let currentActiveScene = -1;

  // --- Theme Engine (Dark / Light Mode) Synchronization ---
  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') ||
           document.body.getAttribute('data-theme') ||
           'light';
  }

  function applyTheme(themeName) {
    if (threeScene) {
      threeScene.setTheme(themeName);
    }
    if (currentActiveScene >= 0) {
      updateNavDock(currentActiveScene);
      if (securityShield && currentActiveScene === 2) securityShield.style.stroke = themeName === 'light' ? '#a83125' : '#d4857a';
    }
  }

  // React to universal OneOps theme changes from header switcher
  window.addEventListener('oneops-theme-changed', (e) => {
    const nextTheme = (e && e.detail && e.detail.theme) ? e.detail.theme : getCurrentTheme();
    applyTheme(nextTheme);
  });

  // Set initial theme
  const initialStoredTheme = getCurrentTheme();
  applyTheme(initialStoredTheme);

  /**
   * Updates all DOM elements, HUD metrics, and navigation pill when switching scenes
   */
  function activateScene(sceneIndex, subProgress = 0) {
    if (sceneIndex === currentActiveScene) return;
    currentActiveScene = sceneIndex;

    const config = sceneConfigs[sceneIndex] || sceneConfigs[0];

    // 1. Update Headlines
    headlineSlides.forEach((slide) => {
      const slideScene = parseInt(slide.dataset.scene, 10);
      if (slideScene === sceneIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // 2. Update Left Stream Input Nodes
    leftNodeSets.forEach((set) => {
      const setScene = parseInt(set.dataset.nodeScene, 10);
      if (setScene === sceneIndex) {
        set.classList.add('active');
      } else {
        set.classList.remove('active');
      }
    });

    // 3. Update Right Stream Target Nodes
    rightNodeSets.forEach((set) => {
      const setScene = parseInt(set.dataset.nodeScene, 10);
      if (setScene === sceneIndex) {
        set.classList.add('active');
      } else {
        set.classList.remove('active');
      }
    });

    // 4. Update Capability Cards
    capabilityPanels.forEach((panel) => {
      const panelRole = parseInt(panel.dataset.roleCards, 10);
      if (panelRole === sceneIndex) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // 5. Update Center HUD Telemetry
    if (coreHudTitle) coreHudTitle.textContent = config.hudTitle;
    if (coreHudMetric) coreHudMetric.textContent = config.hudMetric;

    // 6. Update SVG Special Features (Shield & Feedback Loop)
    if (securityShield) {
      if (sceneIndex === 2) {
        securityShield.style.opacity = '0.9';
        securityShield.style.stroke = getCurrentTheme() === 'light' ? '#a83125' : '#d4857a';
      } else {
        securityShield.style.opacity = '0';
      }
    }

    if (feedbackGroup) {
      if (sceneIndex === 4) {
        feedbackGroup.style.opacity = '1.0';
      } else {
        feedbackGroup.style.opacity = '0.4';
      }
    }

    // 7. Update Navigation Dock Highlight
    updateNavDock(sceneIndex);

    // 8. Update Three.js 3D Visual Scene
    if (threeScene) {
      threeScene.setRoleScene(sceneIndex, subProgress);
    }
  }

  /**
   * Positions the sliding active pill on the floating navigation dock
   */
  function updateNavDock(sceneIndex) {
    if (!navActivePill || navButtons.length === 0) return;

    const targetNavIndex = sceneIndex;
    const isLight = getCurrentTheme() === 'light';
    navActivePill.style.opacity = sceneIndex === 0 ? '0' : '1';

    navButtons.forEach((btn) => {
      const btnScene = parseInt(btn.dataset.navScene, 10);
      if (btnScene === targetNavIndex) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const track = btn.parentElement;
        const btnRect = btn.getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();

        const leftOffset = btnRect.left - trackRect.left - navActivePill.offsetLeft;
        const width = btnRect.width;

        navActivePill.style.transform = `translateX(${leftOffset}px)`;
        navActivePill.style.width = `${width}px`;

        const accent = isLight
          ? sceneConfigs[targetNavIndex].accentLight
          : sceneConfigs[targetNavIndex].accentDark;

        navActivePill.style.borderColor = accent;
        navActivePill.style.boxShadow = isLight
          ? `0 2px 10px ${accent}33`
          : `0 0 16px ${accent}44`;
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  /**
   * Native sticky pinned sequence (independent of external animation libraries)
   */
  const compact = matchMedia('(max-width: 1080px), (max-height: 499px), (prefers-reduced-motion: reduce)');
  let nativeScroll = false;
  function updateProgress(p) {
    const scene = p < .15 ? 0 : p < .38 ? 1 : p < .62 ? 2 : p < .85 ? 3 : 4;
    activateScene(scene);
  }
  function onNativeScroll() {
    if (!nativeScroll) return;
    const rect = wrapper.getBoundingClientRect();
    const travel = wrapper.offsetHeight - section.offsetHeight;
    if (travel > 0) updateProgress(Math.min(1, Math.max(0, -rect.top / travel)));
  }
  function initScrollTrigger() {
    nativeScroll = false;
    wrapper.classList.remove('role-native-scroll', 'role-compact');
    if (compact.matches) {
      wrapper.classList.add('role-compact');
      if (currentActiveScene < 0) activateScene(0);
    } else {
      wrapper.classList.add('role-native-scroll');
      nativeScroll = true;
      onNativeScroll();
    }
  }
  window.addEventListener('scroll', onNativeScroll, { passive: true });
  compact.addEventListener('change', initScrollTrigger);
  initScrollTrigger();

  /**
   * Clickable Role Navigation Handlers
   */
  const sceneProgressTargets = {
    1: 0.22,
    2: 0.48,
    3: 0.72,
    4: 0.92
  };

  navButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetScene = parseInt(btn.dataset.navScene, 10);
      const targetProgress = sceneProgressTargets[targetScene];

      if (targetProgress === undefined) return;
      if (compact.matches) { activateScene(targetScene); return; }
      if (nativeScroll) {
        const start = wrapper.getBoundingClientRect().top + scrollY;
        window.scrollTo({ top: start + (wrapper.offsetHeight - section.offsetHeight) * targetProgress, behavior: 'smooth' });
        return;
      }

    });
  });

  window.addEventListener('resize', () => {
    if (hasGsap) ScrollTrigger.refresh();
    if (currentActiveScene >= 0) {
      updateNavDock(currentActiveScene);
    }
  });

  setTimeout(() => {
    if (currentActiveScene >= 0) updateNavDock(currentActiveScene);
  }, 150);
});
