/**
 * OneOps — Role-Based Value Proposition 3D Visual Engine
 * Dual Theme Architecture: Dark Mode & Light Mode
 * Recreates the atmospheric fluid background, central morphing floral toroid core,
 * concentric radar ticks, and dynamic particle streams with seamless theme blending.
 */

class OneOpsRoleScene {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) {
      console.error(`Container #${canvasContainerId} not found`);
      return;
    }

    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;

    // Check initial document theme
    const isLight = document.documentElement.getAttribute('data-theme') === 'light' ||
                    document.body.getAttribute('data-theme') === 'light';

    // State uniforms & transitions
    this.state = {
      roleProgress: 0,
      targetRole: 0,
      morphFactor: 0.0,
      rotationSpeed: 0.0022,
      pulseSpeed: 1.0,
      shieldActive: 0.0,
      accentColor: new THREE.Color(0xef6d5d),
      tealColor: new THREE.Color(0xd4857a),
      isLightMode: isLight ? 1.0 : 0.0,
      targetLightMode: isLight ? 1.0 : 0.0,
      time: 0,
      mouse: { x: 0, y: 0, targetX: 0, targetY: 0 }
    };

    this.init();
  }

  init() {
    // 1. Scene & Camera Setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 27);

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);

    // 3. Dual-Theme Atmospheric Background
    this.createAtmosphericBackground();

    // 4. Central OneOps Control Plane Core (Translucent Ribbon Flower)
    this.createCentralCore();

    // 5. Delicate Vortex Particle Core
    this.createVortexEnergyCore();

    // 6. Concentric Radar & Orbit Rings
    this.createRadarAndOrbitRings();

    // 7. Crisp High-Tech Stream Data Particles
    this.createStreamParticlesSystem();

    // 8. Event Listeners
    this.bindEvents();

    // 9. Start Render Loop
    this.animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this.animate);
  }

  /**
   * Dual-Theme Fluid Smoke Shader
   * Dark Mode: Charcoal to deep brand mauve.
   * Light Mode: Warm off-white to muted blush.
   */
  createAtmosphericBackground() {
    const bgGeometry = new THREE.PlaneGeometry(120, 70);

    const bgVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const bgFragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uRole;
      uniform float uLightMode;
      uniform vec3 uColorAccent;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        vec2 p = (uv - 0.5) * 2.0;
        p.x *= uResolution.x / uResolution.y;

        float t = uTime * 0.12;

        // Smooth harmonic fluid displacement (large wavelength, zero banding)
        float w1 = sin(p.x * 0.85 + t * 0.6) * cos(p.y * 0.7 - t * 0.45);
        float w2 = sin(p.y * 1.1 + t * 0.5 + w1 * 1.2) * cos(p.x * 0.95 - t * 0.55);
        float w3 = sin(length(p * 0.75 + vec2(w1, w2) * 0.4) * 1.8 - t * 0.4);

        float smoke = w1 * 0.38 + w2 * 0.42 + w3 * 0.2;
        smoke = smoothstep(-0.65, 0.85, smoke);

        // Dark Palette
        vec3 darkVoid = vec3(0.055, 0.04, 0.052);       // #010406
        vec3 darkTeal = vec3(0.12, 0.075, 0.10);       // #041319
        vec3 darkCyan = vec3(0.26, 0.105, 0.14);         // #06303a

        // Light Palette (Warm off-white and blush)
        vec3 lightVoid = vec3(0.97, 0.95, 0.94);         // #f8fafc
        vec3 lightTeal = vec3(0.93, 0.87, 0.86);         // #e2edf2
        vec3 lightCyan = vec3(0.86, 0.72, 0.73);         // #c2e0ec

        vec3 colVoid = mix(darkVoid, lightVoid, uLightMode);
        vec3 colDeepTeal = mix(darkTeal, lightTeal, uLightMode);
        vec3 colSoftCyan = mix(darkCyan, lightCyan, uLightMode);

        vec3 color = mix(colVoid, colDeepTeal, smoke);
        color += colSoftCyan * pow(smoke, 2.4) * (0.45 - uLightMode * 0.15);

        // Central ambient light pool behind core
        float centerGlow = exp(-length(p * 0.85) * 1.5);
        vec3 glowTintDark = vec3(0.16, 0.055, 0.08) * centerGlow;
        vec3 glowTintLight = vec3(0.01, -0.035, -0.035) * centerGlow;
        color += mix(glowTintDark, glowTintLight, uLightMode);

        // Role accent ambient tinting
        color += uColorAccent * centerGlow * (0.045 - uLightMode * 0.02);

        // Mouse volumetric interaction
        float mouseDist = length(p - uMouse * 1.8);
        color += mix(vec3(0.085, 0.028, 0.042), vec3(0.005, -0.026, -0.02), uLightMode) * smoothstep(1.8, 0.0, mouseDist);

        // Soft vignette
        float vignetteDark = 1.0 - smoothstep(0.55, 1.6, length(p));
        float vignetteLight = 1.0 - smoothstep(0.7, 1.7, length(p)) * 0.1;
        float vignette = mix(vignetteDark, vignetteLight, uLightMode);
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    this.bgMaterial = new THREE.ShaderMaterial({
      vertexShader: bgVertexShader,
      fragmentShader: bgFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uRole: { value: 0 },
        uLightMode: { value: this.state.isLightMode },
        uColorAccent: { value: this.state.accentColor }
      },
      depthWrite: false,
      depthTest: false
    });

    this.bgMesh = new THREE.Mesh(bgGeometry, this.bgMaterial);
    this.bgMesh.position.z = -14;
    this.scene.add(this.bgMesh);
  }

  /**
   * Central OneOps Control Plane Core:
   * 6-lobed parametric spirograph toroid ribbon flower.
   * In light mode: deep crystalline teal/sapphire with crisp Fresnel glass edges.
   */
  createCentralCore() {
    this.coreGroup = new THREE.Group();
    this.coreGroup.position.set(0, 0.2, 0);
    this.scene.add(this.coreGroup);

    const petalCount = 6;
    this.petals = [];

    const petalVertexShader = `
      uniform float uTime;
      uniform float uMorph;
      uniform float uPulse;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        
        vec3 pos = position;
        float breathe = sin(uTime * 1.5 + pos.x * 0.4 + pos.y * 0.4) * 0.05;
        pos += normal * breathe * (1.0 + uPulse * 0.3);

        pos.z += sin(pos.x * 0.8 + uTime) * (uMorph * 0.25);
        pos.xy *= 1.0 + uMorph * 0.08;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const petalFragmentShader = `
      uniform float uTime;
      uniform vec3 uColorTeal;
      uniform vec3 uColorAccent;
      uniform float uAccentSector;
      uniform float uPetalIndex;
      uniform float uPulse;
      uniform float uShieldMode;
      uniform float uLightMode;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 2.2);

        // Delicate concentric ribbed striations
        float ribs = sin(vUv.x * 70.0 + vUv.y * 10.0);
        float ribGlow = smoothstep(0.15, 0.85, ribs) * 0.3 + 0.7;

        // Longitudinal filament line along ribbon
        float centerGlow = 1.0 - abs(vUv.y - 0.5) * 2.0;
        centerGlow = pow(clamp(centerGlow, 0.0, 1.0), 2.0);

        // Dynamic accent sector
        float angle = atan(vWorldPosition.y, vWorldPosition.x);
        float sectorDiff = mod(angle - uAccentSector + 3.14159, 6.28318) - 3.14159;
        float accentZone = smoothstep(1.2, 0.0, abs(sectorDiff));

        vec3 activeAccent = mix(uColorAccent, vec3(0.95, 0.23, 0.20), uShieldMode);

        // Palette adaptation for Light vs Dark
        vec3 darkTeal = uColorTeal * 0.75 + vec3(0.13, 0.065, 0.09);
        vec3 lightTeal = vec3(0.48, 0.25, 0.31); // Deep mauve in light mode
        vec3 baseTeal = mix(darkTeal, lightTeal, uLightMode);

        vec3 finalColor = mix(baseTeal, activeAccent * 1.3, accentZone);

        finalColor *= ribGlow;
        vec3 rimColor = mix(vec3(1.0, 0.77, 0.73), vec3(0.64, 0.32, 0.36), uLightMode);
        finalColor += rimColor * pow(fresnel, 2.8) * 0.75;
        finalColor += activeAccent * accentZone * centerGlow * (0.6 + uPulse * 0.3);

        float alphaDark = clamp(0.28 + fresnel * 0.48 + accentZone * 0.3, 0.12, 0.85);
        float alphaLight = clamp(0.48 + fresnel * 0.42 + accentZone * 0.35, 0.25, 0.95);
        float alpha = mix(alphaDark, alphaLight, uLightMode);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    for (let k = 0; k < petalCount; k++) {
      const geometry = this.createPetalRibbonGeometry(k, petalCount);

      const material = new THREE.ShaderMaterial({
        vertexShader: petalVertexShader,
        fragmentShader: petalFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uPulse: { value: 0 },
          uColorTeal: { value: this.state.tealColor },
          uColorAccent: { value: this.state.accentColor },
          uAccentSector: { value: 0 },
          uPetalIndex: { value: k },
          uShieldMode: { value: 0 },
          uLightMode: { value: this.state.isLightMode }
        },
        transparent: true,
        blending: THREE.NormalBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const mesh = new THREE.Mesh(geometry, material);
      this.coreGroup.add(mesh);
      this.petals.push({ mesh, material, baseAngle: (k * Math.PI * 2) / petalCount });
    }

    this.createRibbonWireframes();
  }

  createPetalRibbonGeometry(petalIdx, totalPetals) {
    const uSegments = 70;
    const vSegments = 16;
    const geometry = new THREE.BufferGeometry();

    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    const baseAngle = (petalIdx * Math.PI * 2) / totalPetals;
    const petalRadius = 4.0;

    for (let i = 0; i <= uSegments; i++) {
      const u = i / uSegments;

      const r = Math.pow(Math.sin(Math.PI * u), 0.75) * petalRadius + 0.3;
      const angle = baseAngle + Math.sin(Math.PI * u) * 1.35 + u * 0.45;
      const z = Math.sin(Math.PI * 2 * u) * 0.85 + Math.cos(Math.PI * u) * 0.25;

      const cx = Math.cos(angle) * r;
      const cy = Math.sin(angle) * r;
      const cz = z;

      const uNext = Math.min(1.0, u + 0.01);
      const rNext = Math.pow(Math.sin(Math.PI * uNext), 0.75) * petalRadius + 0.3;
      const angleNext = baseAngle + Math.sin(Math.PI * uNext) * 1.35 + uNext * 0.45;
      const zNext = Math.sin(Math.PI * 2 * uNext) * 0.85 + Math.cos(Math.PI * uNext) * 0.25;
      const tx = Math.cos(angleNext) * rNext - cx;
      const ty = Math.sin(angleNext) * rNext - cy;
      const tz = zNext - cz;
      const tLen = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1;
      const T = new THREE.Vector3(tx / tLen, ty / tLen, tz / tLen);

      const Up = new THREE.Vector3(0, 0, 1);
      const B = new THREE.Vector3().crossVectors(T, Up).normalize();
      const N = new THREE.Vector3().crossVectors(B, T).normalize();

      const width = Math.sin(Math.PI * u) * 1.35 + 0.12;

      for (let j = 0; j <= vSegments; j++) {
        const v = j / vSegments;
        const offset = (v - 0.5) * width;

        const px = cx + B.x * offset;
        const py = cy + B.y * offset;
        const pz = cz + B.z * offset;

        positions.push(px, py, pz);
        normals.push(N.x, N.y, N.z);
        uvs.push(u, v);
      }
    }

    for (let i = 0; i < uSegments; i++) {
      for (let j = 0; j < vSegments; j++) {
        const a = i * (vSegments + 1) + j;
        const b = (i + 1) * (vSegments + 1) + j;
        const c = (i + 1) * (vSegments + 1) + (j + 1);
        const d = i * (vSegments + 1) + (j + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }

  createRibbonWireframes() {
    const ringCount = 4;
    this.filamentRings = [];

    for (let i = 0; i < ringCount; i++) {
      const radius = 1.1 + i * 0.75;
      const points = [];
      const segments = 90;
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        const r = radius + Math.sin(theta * 6) * 0.2;
        const z = Math.cos(theta * 3) * 0.25;
        points.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, z));
      }
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: i === 1 ? 0xef6d5d : 0xd4857a,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      const line = new THREE.Line(lineGeom, lineMat);
      this.coreGroup.add(line);
      this.filamentRings.push(line);
    }
  }

  createVortexEnergyCore() {
    const particleCount = 240;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    const colTeal = new THREE.Color(0xd4857a);
    const colOrange = new THREE.Color(0xef6d5d);
    const colCyanLight = new THREE.Color(0xf1c3b8);

    for (let i = 0; i < particleCount; i++) {
      const r = Math.pow(Math.random(), 1.6) * 1.6 + 0.15;
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 0.8 * (1.0 - r / 2.0);

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(theta) * r;
      positions[i * 3 + 2] = z;

      radii[i] = r;
      angles[i] = theta;
      speeds[i] = (0.35 / (r + 0.4)) * (Math.random() * 0.8 + 0.6);

      let c;
      const rand = Math.random();
      if (rand < 0.2) c = colCyanLight;
      else if (rand < 0.75) c = colTeal;
      else c = colOrange;

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      scales[i] = Math.random() * 1.4 + 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const particleVertexShader = `
      attribute float aScale;
      varying vec3 vColor;
      uniform float uTime;
      uniform float uPulse;

      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aScale * (38.0 / -mvPosition.z) * (1.0 + uPulse * 0.2);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const particleFragmentShader = `
      varying vec3 vColor;
      uniform float uLightMode;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float alpha = smoothstep(0.5, 0.05, dist);
        vec3 finalColor = mix(vColor, vColor * 0.75, uLightMode);
        gl_FragColor = vec4(finalColor, alpha * (0.55 + uLightMode * 0.25));
      }
    `;

    this.vortexMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPulse: { value: 0 },
        uLightMode: { value: this.state.isLightMode }
      },
      transparent: true,
      vertexColors: true,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    this.vortexPoints = new THREE.Points(geometry, this.vortexMaterial);
    this.coreGroup.add(this.vortexPoints);

    this.vortexData = { radii, angles, speeds, count: particleCount };
  }

  createRadarAndOrbitRings() {
    this.radarGroup = new THREE.Group();
    this.radarGroup.position.set(0, 0.2, 0);
    this.scene.add(this.radarGroup);

    const ringRadii = [5.2, 6.0, 7.2];
    this.orbitRings = [];

    ringRadii.forEach((r, idx) => {
      const circleGeom = new THREE.BufferGeometry();
      const segments = 120;
      const pts = [];
      for (let i = 0; i <= segments; i++) {
        const th = (i / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(th) * r, Math.sin(th) * r, 0));
      }
      circleGeom.setFromPoints(pts);

      const mat = new THREE.LineBasicMaterial({
        color: idx === 1 ? 0xd4857a : 0x4d333e,
        transparent: true,
        opacity: idx === 1 ? 0.45 : 0.2,
        blending: THREE.NormalBlending
      });

      const line = new THREE.Line(circleGeom, mat);
      this.radarGroup.add(line);
      this.orbitRings.push(line);
    });

    const tickCount = 240;
    const tickPositions = [];
    const tickColors = [];
    const baseRadius = 5.35;
    const colTeal = new THREE.Color(0xd4857a);
    const colDim = new THREE.Color(0x3a2e35);

    for (let i = 0; i < tickCount; i++) {
      const theta = (i / tickCount) * Math.PI * 2;
      const isMajor = i % 12 === 0;
      const isSemi = i % 4 === 0;
      const len = isMajor ? 0.32 : (isSemi ? 0.18 : 0.1);

      const r1 = baseRadius;
      const r2 = baseRadius + len;

      const cos = Math.cos(theta);
      const sin = Math.sin(theta);

      tickPositions.push(cos * r1, sin * r1, 0);
      tickPositions.push(cos * r2, sin * r2, 0);

      const c = isMajor ? colTeal : (isSemi ? colTeal : colDim);
      tickColors.push(c.r, c.g, c.b);
      tickColors.push(c.r, c.g, c.b);
    }

    const tickGeometry = new THREE.BufferGeometry();
    tickGeometry.setAttribute('position', new THREE.Float32BufferAttribute(tickPositions, 3));
    tickGeometry.setAttribute('color', new THREE.Float32BufferAttribute(tickColors, 3));

    this.tickMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.NormalBlending
    });

    this.radarTicks = new THREE.LineSegments(tickGeometry, this.tickMaterial);
    this.radarGroup.add(this.radarTicks);

    const shieldGeom = new THREE.RingGeometry(5.2, 5.5, 96);
    this.shieldMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4857a,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending
    });
    this.shieldMesh = new THREE.Mesh(shieldGeom, this.shieldMaterial);
    this.shieldMesh.position.z = 0.05;
    this.radarGroup.add(this.shieldMesh);
  }

  createStreamParticlesSystem() {
    this.streamGroup = new THREE.Group();
    this.streamGroup.position.set(0, 0.2, 0);
    this.scene.add(this.streamGroup);

    this.leftPaths = [
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(-14, 3.2, 0),
        new THREE.Vector3(-9.5, 2.6, 0),
        new THREE.Vector3(-7.2, 0.6, 0),
        new THREE.Vector3(-5.3, 0.2, 0)
      ),
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(-14, 1.2, 0),
        new THREE.Vector3(-9.8, 1.0, 0),
        new THREE.Vector3(-7.5, 0.3, 0),
        new THREE.Vector3(-5.3, 0.0, 0)
      ),
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(-14, -1.2, 0),
        new THREE.Vector3(-9.8, -1.0, 0),
        new THREE.Vector3(-7.5, -0.3, 0),
        new THREE.Vector3(-5.3, 0.0, 0)
      ),
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(-14, -3.2, 0),
        new THREE.Vector3(-9.5, -2.6, 0),
        new THREE.Vector3(-7.2, -0.6, 0),
        new THREE.Vector3(-5.3, -0.2, 0)
      )
    ];

    this.rightPaths = [
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(5.3, 0.2, 0),
        new THREE.Vector3(7.2, 0.6, 0),
        new THREE.Vector3(9.5, 2.6, 0),
        new THREE.Vector3(14, 3.2, 0)
      ),
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(5.3, 0.0, 0),
        new THREE.Vector3(7.5, 0.3, 0),
        new THREE.Vector3(9.8, 1.0, 0),
        new THREE.Vector3(14, 1.2, 0)
      ),
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(5.3, 0.0, 0),
        new THREE.Vector3(7.5, -0.3, 0),
        new THREE.Vector3(9.8, -1.0, 0),
        new THREE.Vector3(14, -1.2, 0)
      ),
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(5.3, -0.2, 0),
        new THREE.Vector3(7.2, -0.6, 0),
        new THREE.Vector3(9.5, -2.6, 0),
        new THREE.Vector3(14, -3.2, 0)
      )
    ];

    this.streamLines = [];
    const allPaths = [...this.leftPaths, ...this.rightPaths];
    allPaths.forEach((path) => {
      const pts = path.getPoints(40);
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: 0xd4857a,
        transparent: true,
        opacity: 0.12,
        blending: THREE.NormalBlending
      });
      const line = new THREE.Line(geom, mat);
      this.streamGroup.add(line);
      this.streamLines.push(line);
    });

    const totalStreamParticles = 55;
    this.streamParticles = [];

    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(totalStreamParticles * 3);
    const pCol = new Float32Array(totalStreamParticles * 3);
    const pSize = new Float32Array(totalStreamParticles);

    for (let i = 0; i < totalStreamParticles; i++) {
      const isLeft = i < 32;
      const pathList = isLeft ? this.leftPaths : this.rightPaths;
      const pathIdx = Math.floor(Math.random() * pathList.length);
      const progress = Math.random();
      const isUnsafe = isLeft && (i % 4 === 0);

      this.streamParticles.push({
        isLeft,
        pathList,
        pathIdx,
        progress,
        speed: Math.random() * 0.005 + 0.003,
        isUnsafe
      });

      pPos[i * 3] = 0;
      pPos[i * 3 + 1] = 0;
      pPos[i * 3 + 2] = 0;

      pCol[i * 3] = 0.0;
      pCol[i * 3 + 1] = 0.9;
      pCol[i * 3 + 2] = 1.0;

      pSize[i] = Math.random() * 1.5 + 1.2;
    }

    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeom.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    pGeom.setAttribute('aScale', new THREE.BufferAttribute(pSize, 1));

    const sParticleVertexShader = `
      attribute float aScale;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aScale * (32.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const sParticleFragmentShader = `
      varying vec3 vColor;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, dist);
        gl_FragColor = vec4(vColor, alpha * 0.85);
      }
    `;

    this.streamParticlesMaterial = new THREE.ShaderMaterial({
      vertexShader: sParticleVertexShader,
      fragmentShader: sParticleFragmentShader,
      transparent: true,
      vertexColors: true,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    this.streamPointsMesh = new THREE.Points(pGeom, this.streamParticlesMaterial);
    this.streamGroup.add(this.streamPointsMesh);
  }

  triggerSecurityInterception(x, y) {
    if (this.shieldMaterial) {
      this.shieldMaterial.opacity = 0.65;
      this.shieldMaterial.color.setHex(0xff5b59);
    }
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      this.state.mouse.targetX = nx;
      this.state.mouse.targetY = ny;
    });

    window.addEventListener('resize', () => {
      this.onResize();
    });

    window.addEventListener('oneops-theme-changed', (e) => {
      if (e && e.detail && e.detail.theme) {
        this.setTheme(e.detail.theme);
      }
    });
  }

  onResize() {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (this.bgMaterial) {
      this.bgMaterial.uniforms.uResolution.value.set(this.width, this.height);
    }
  }

  /**
   * Theme Switch API:
   * @param {'dark'|'light'} themeName
   */
  setTheme(themeName) {
    this.state.targetLightMode = themeName === 'light' ? 1.0 : 0.0;
    this.setRoleScene(this.state.targetRole, this.state.roleProgress - this.state.targetRole);
  }

  setRoleScene(sceneIndex, subProgress = 0) {
    this.state.targetRole = sceneIndex;
    this.state.roleProgress = sceneIndex + subProgress;

    const isLight = this.state.targetLightMode > 0.5;

    switch (sceneIndex) {
      case 0:
        this.state.morphFactor = 0.0;
        this.state.rotationSpeed = 0.002;
        this.state.shieldActive = 0.0;
        this.state.accentColor.setHex(isLight ? 0xa83125 : 0xef6d5d);
        break;
      case 1:
        this.state.morphFactor = 0.25;
        this.state.rotationSpeed = 0.0028;
        this.state.shieldActive = 0.0;
        this.state.accentColor.setHex(isLight ? 0xc23b2e : 0xef6d5d);
        break;
      case 2:
        this.state.morphFactor = 0.55;
        this.state.rotationSpeed = 0.0018;
        this.state.shieldActive = 1.0;
        this.state.accentColor.setHex(isLight ? 0xa83125 : 0xd4857a);
        break;
      case 3:
        this.state.morphFactor = 0.85;
        this.state.rotationSpeed = 0.0035;
        this.state.shieldActive = 0.0;
        this.state.accentColor.setHex(isLight ? 0x69485d : 0xb99aab);
        break;
      case 4:
        this.state.morphFactor = 1.0;
        this.state.rotationSpeed = 0.0022;
        this.state.shieldActive = 0.0;
        this.state.accentColor.setHex(isLight ? 0xa34238 : 0xe9a89b);
        break;
    }
  }

  animate() {
    this.rafId = requestAnimationFrame(this.animate);
    const rect = this.container.getBoundingClientRect();
    if (document.hidden || rect.bottom < 0 || rect.top > window.innerHeight) return;
    this.state.time += 0.016;
    const t = this.state.time;

    // Smooth light mode interpolation
    this.state.isLightMode += (this.state.targetLightMode - this.state.isLightMode) * 0.08;
    const lightVal = this.state.isLightMode;

    this.state.mouse.x += (this.state.mouse.targetX - this.state.mouse.x) * 0.05;
    this.state.mouse.y += (this.state.mouse.targetY - this.state.mouse.y) * 0.05;

    // 1. Background shader
    if (this.bgMaterial) {
      this.bgMaterial.uniforms.uTime.value = t;
      this.bgMaterial.uniforms.uMouse.value.set(this.state.mouse.x, this.state.mouse.y);
      this.bgMaterial.uniforms.uRole.value = this.state.roleProgress;
      this.bgMaterial.uniforms.uLightMode.value = lightVal;
      this.bgMaterial.uniforms.uColorAccent.value.lerp(this.state.accentColor, 0.04);
    }

    // 2. Central 3D Core
    if (this.coreGroup) {
      this.coreGroup.rotation.z += this.state.rotationSpeed;
      this.coreGroup.rotation.x = this.state.mouse.y * 0.12 + Math.sin(t * 0.5) * 0.03;
      this.coreGroup.rotation.y = this.state.mouse.x * 0.16 + Math.cos(t * 0.6) * 0.03;

      const accentAngle = (t * 0.38) % (Math.PI * 2);
      const pulse = Math.sin(t * 2.5) * 0.5 + 0.5;

      this.petals.forEach((p) => {
        p.material.uniforms.uTime.value = t;
        p.material.uniforms.uAccentSector.value = accentAngle;
        p.material.uniforms.uPulse.value = pulse;
        p.material.uniforms.uLightMode.value = lightVal;
        p.material.uniforms.uMorph.value = THREE.MathUtils.lerp(
          p.material.uniforms.uMorph.value,
          this.state.morphFactor,
          0.04
        );
        p.material.uniforms.uColorAccent.value.lerp(this.state.accentColor, 0.04);
        p.material.uniforms.uShieldMode.value = THREE.MathUtils.lerp(
          p.material.uniforms.uShieldMode.value,
          this.state.shieldActive,
          0.04
        );
      });
    }

    // 3. Central Vortex Particles
    if (this.vortexPoints && this.vortexData) {
      const posAttr = this.vortexPoints.geometry.attributes.position;
      const { radii, angles, speeds, count } = this.vortexData;

      for (let i = 0; i < count; i++) {
        angles[i] += speeds[i] * 0.018;
        const r = radii[i];
        posAttr.setXY(i, Math.cos(angles[i]) * r, Math.sin(angles[i]) * r);
      }
      posAttr.needsUpdate = true;
      this.vortexMaterial.uniforms.uTime.value = t;
      this.vortexMaterial.uniforms.uPulse.value = Math.sin(t * 3.0) * 0.5 + 0.5;
      this.vortexMaterial.uniforms.uLightMode.value = lightVal;
    }

    // 4. Radar Ticks & Lines color adaptation
    if (this.radarTicks) {
      this.radarTicks.rotation.z -= 0.0008;
      if (this.tickMaterial) {
        this.tickMaterial.opacity = THREE.MathUtils.lerp(0.65, 0.85, lightVal);
      }
    }
    if (this.shieldMaterial) {
      if (this.state.shieldActive > 0.5) {
        const targetOpacity = 0.25 + Math.sin(t * 4.0) * 0.12;
        this.shieldMaterial.opacity = THREE.MathUtils.lerp(this.shieldMaterial.opacity, targetOpacity, 0.06);
        const shieldHex = lightVal > 0.5 ? 0xa83125 : 0xd4857a;
        this.shieldMaterial.color.lerp(new THREE.Color(shieldHex), 0.05);
      } else {
        this.shieldMaterial.opacity = THREE.MathUtils.lerp(this.shieldMaterial.opacity, 0.0, 0.08);
      }
    }

    // 5. Data Stream Particles
    if (this.streamPointsMesh && this.streamParticles) {
      const pPosAttr = this.streamPointsMesh.geometry.attributes.position;
      const pColAttr = this.streamPointsMesh.geometry.attributes.color;

      const colTealDark = new THREE.Color(0xd4857a);
      const colTealLight = new THREE.Color(0xa83125);
      const colTeal = new THREE.Color().lerpColors(colTealDark, colTealLight, lightVal);

      const colOrangeDark = new THREE.Color(0xef6d5d);
      const colOrangeLight = new THREE.Color(0xa83125);
      const colOrange = new THREE.Color().lerpColors(colOrangeDark, colOrangeLight, lightVal);

      const colRed = new THREE.Color(0xe74b46);
      const colGreen = new THREE.Color(0x059669);

      this.streamParticles.forEach((sp, idx) => {
        sp.progress += sp.speed;

        if (this.state.shieldActive > 0.5 && sp.isLeft && sp.isUnsafe) {
          if (sp.progress >= 0.88 && sp.progress <= 0.94) {
            const path = sp.pathList[sp.pathIdx];
            const pt = path.getPoint(0.88);
            this.triggerSecurityInterception(pt.x, pt.y);
            sp.progress = 0;
          }
        }

        if (sp.progress >= 1.0) {
          sp.progress = 0;
          sp.pathIdx = Math.floor(Math.random() * sp.pathList.length);
        }

        const path = sp.pathList[sp.pathIdx];
        const point = path.getPoint(sp.progress);
        pPosAttr.setXYZ(idx, point.x, point.y, point.z);

        let c;
        if (this.state.targetRole === 1) {
          c = sp.isLeft ? colTeal : colOrange;
        } else if (this.state.targetRole === 2) {
          c = sp.isUnsafe ? colRed : (sp.isLeft ? colGreen : colTeal);
        } else if (this.state.targetRole === 3) {
          c = colTeal;
        } else if (this.state.targetRole === 4) {
          c = sp.progress > 0.5 ? colOrange : colTeal;
        } else {
          c = colTeal;
        }

        pColAttr.setXYZ(idx, c.r, c.g, c.b);
      });

      pPosAttr.needsUpdate = true;
      pColAttr.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);

    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}

window.OneOpsRoleScene = OneOpsRoleScene;
