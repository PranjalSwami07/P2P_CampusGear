/**
 * CampusGear P2P — Ultra-Smooth 3D Cyber-Blueprint Engine
 * Built with Three.js (r128)
 * Features:
 * - Ultra-smooth mouse parallax with fluid damping lerp physics
 * - Smoothly floating 3D academic hardware (Microcontroller PCB, Scientific Calculator, Drafting Compass)
 * - Interconnected campus peer network nodes with glowing packet pulses
 * - Interactive mouse hover raycasting with smooth scale transition
 * - Inertia-based 360° mouse drag orbit
 */

class Blueprint3DScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.container = this.canvas.parentElement;
    this.tooltip = document.getElementById('canvas-tooltip');
    this.isWireframe = false;
    this.isAutoRotating = true;

    // High-precision smooth mouse tracking with damping lerp
    this.mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      smoothX: 0,
      smoothY: 0
    };

    this.pointer = new THREE.Vector2(-1000, -1000);
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.dragVelocity = { x: 0, y: 0 };
    this.userRotation = { x: 0.12, y: -0.35, targetX: 0.12, targetY: -0.35 };

    this.interactiveObjects = [];
    this.packetPulses = [];
    this.hoveredObject = null;

    this.init();
    this.createBlueprintElements();
    this.setupEvents();
    this.animate();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();

    // 2. Camera setup
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 1000);
    this.camera.position.set(0, 4.5, 23);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.7);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(12, 22, 18);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x2563eb, 0.9);
    dirLight2.position.set(-14, -8, -10);
    this.scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x38bdf8, 2.5, 45);
    pointLight.position.set(0, 2, 0);
    this.scene.add(pointLight);

    // Raycaster
    this.raycaster = new THREE.Raycaster();

    // Main rotating group
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);
  }

  createBlueprintElements() {
    this.createCoordinateGrid();

    // Central Hardware: 3D Microcontroller PCB
    this.pcbMesh = this.createMicrocontrollerModel();
    this.pcbMesh.position.set(-4.2, 0.6, 1.2);
    this.pcbMesh.rotation.set(0.3, 0.45, -0.15);
    this.mainGroup.add(this.pcbMesh);

    // Central Hardware: 3D Scientific Calculator
    this.calcMesh = this.createCalculatorModel();
    this.calcMesh.position.set(4.2, 0.2, -1.2);
    this.calcMesh.rotation.set(0.25, -0.5, 0.1);
    this.mainGroup.add(this.calcMesh);

    // Central Hardware: 3D Drafting Compass
    this.compassMesh = this.createCompassModel();
    this.compassMesh.position.set(0, 2.8, 2.5);
    this.compassMesh.rotation.set(-0.2, 0.1, -0.2);
    this.mainGroup.add(this.compassMesh);

    // Campus P2P Network Nodes
    this.createNetworkNodes();

    // Dust particles
    this.createDustParticles();
  }

  createCoordinateGrid() {
    // Outer Blueprint Radar Ring
    const ringGeo = new THREE.RingGeometry(8, 8.08, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    this.radarRing = new THREE.Mesh(ringGeo, ringMat);
    this.radarRing.rotation.x = Math.PI / 2;
    this.radarRing.position.y = -3.5;
    this.mainGroup.add(this.radarRing);

    // Secondary dashed concentric ring
    const ringGeo2 = new THREE.RingGeometry(12, 12.06, 80);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -3.5;
    this.mainGroup.add(ring2);

    // Grid floor
    const gridHelper = new THREE.GridHelper(26, 26, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = -3.5;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.22;
    this.mainGroup.add(gridHelper);
  }

  createMicrocontrollerModel() {
    const group = new THREE.Group();
    group.userData = {
      title: "Arduino Uno R3 Lab Kit",
      category: "Microcontrollers & IoT",
      status: "Available for Student Loan"
    };

    // Board Base (Teal-Cyan PCB)
    const boardGeo = new THREE.BoxGeometry(4.2, 0.22, 5.8);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.3,
      metalness: 0.4
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    group.add(board);

    // Glowing Traces
    const traceGeo = new THREE.BoxGeometry(4.05, 0.25, 5.65);
    const traceMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const traces = new THREE.Mesh(traceGeo, traceMat);
    group.add(traces);

    // Central IC Chip
    const icGeo = new THREE.BoxGeometry(1.2, 0.35, 3.2);
    const icMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8
    });
    const ic = new THREE.Mesh(icGeo, icMat);
    ic.position.set(0.2, 0.15, 0.3);
    group.add(ic);

    // Silver USB Port
    const usbGeo = new THREE.BoxGeometry(1.2, 0.8, 1.4);
    const usbMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.1,
      metalness: 0.95
    });
    const usb = new THREE.Mesh(usbGeo, usbMat);
    usb.position.set(-1.4, 0.4, -2.4);
    group.add(usb);

    // Blinking LEDs
    const ledGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const led1 = new THREE.Mesh(ledGeo, ledMat);
    led1.position.set(1.4, 0.2, -1.8);
    group.add(led1);

    const ledMat2 = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const led2 = new THREE.Mesh(ledGeo, ledMat2);
    led2.position.set(1.4, 0.2, -1.3);
    group.add(led2);

    this.interactiveObjects.push(board);
    board.parentGroup = group;

    return group;
  }

  createCalculatorModel() {
    const group = new THREE.Group();
    group.userData = {
      title: "Casio fx-991EX ClassWiz",
      category: "Calculators",
      status: "Available for Student Loan"
    };

    // Body
    const bodyGeo = new THREE.BoxGeometry(3.6, 0.4, 6.2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // LCD Screen
    const screenGeo = new THREE.BoxGeometry(2.8, 0.08, 1.8);
    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.92
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.22, -1.8);
    group.add(screen);

    // Keypad grid
    const keyGeo = new THREE.BoxGeometry(0.42, 0.12, 0.35);
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.3
    });

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 4; c++) {
        const key = new THREE.Mesh(keyGeo, keyMat);
        key.position.set(
          -1.1 + c * 0.72,
          0.22,
          -0.4 + r * 0.65
        );
        group.add(key);
      }
    }

    this.interactiveObjects.push(body);
    body.parentGroup = group;

    return group;
  }

  createCompassModel() {
    const group = new THREE.Group();
    group.userData = {
      title: "Rotring Precision Compass",
      category: "Drafting & Architecture",
      status: "Available for Student Loan"
    };

    // Brass Pivot Joint
    const pivotGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.45, 16);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.85
    });
    const pivot = new THREE.Mesh(pivotGeo, brassMat);
    pivot.rotation.x = Math.PI / 2;
    group.add(pivot);

    // Steel Arms
    const armGeo = new THREE.BoxGeometry(0.18, 4.2, 0.18);
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.15,
      metalness: 0.95
    });
    const armLeft = new THREE.Mesh(armGeo, steelMat);
    armLeft.position.set(-0.9, -1.8, 0);
    armLeft.rotation.z = 0.25;
    group.add(armLeft);

    const armRight = new THREE.Mesh(armGeo, steelMat);
    armRight.position.set(0.9, -1.8, 0);
    armRight.rotation.z = -0.25;
    group.add(armRight);

    this.interactiveObjects.push(pivot);
    pivot.parentGroup = group;

    return group;
  }

  createNetworkNodes() {
    const campusNodesData = [
      { name: "North Campus Dorm (Hall 4)", pos: [-8, 3, -4], role: "Peer Lender" },
      { name: "Tech Tower ECE Lab", pos: [8, 4, -3], role: "Testing Equipment" },
      { name: "Central Library Commons", pos: [-6, -2, 5], role: "Borrowing Exchange" },
      { name: "Hostel Block B", pos: [7, -1, 4], role: "Lending Hub" },
      { name: "Architecture Studio", pos: [0, 6, -5], role: "Drafting Station" },
      { name: "Innovation MakerLab", pos: [0, -3.5, 7], role: "Escrow Station" }
    ];

    this.networkNodes = [];
    const nodeGeo = new THREE.SphereGeometry(0.5, 32, 32);

    campusNodesData.forEach((data, index) => {
      const nodeMat = new THREE.MeshStandardMaterial({
        color: index % 2 === 0 ? 0x38bdf8 : 0x10b981,
        emissive: index % 2 === 0 ? 0x0284c7 : 0x059669,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(data.pos[0], data.pos[1], data.pos[2]);

      nodeMesh.userData = {
        title: data.name,
        category: data.role,
        status: "Lending Node: Active"
      };

      // Node aura ring
      const ringGeo = new THREE.RingGeometry(0.7, 0.78, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.lookAt(0, 0, 10);
      nodeMesh.add(ring);

      this.mainGroup.add(nodeMesh);
      this.networkNodes.push(nodeMesh);
      this.interactiveObjects.push(nodeMesh);

      // Spline connection
      const start = nodeMesh.position;
      const end = new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2
      );
      const mid = new THREE.Vector3(
        (start.x + end.x) * 0.5 + (Math.random() - 0.5) * 3,
        (start.y + end.y) * 0.5 + 2,
        (start.z + end.z) * 0.5
      );

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(40);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.25
      });
      const line = new THREE.Line(lineGeo, lineMat);
      this.mainGroup.add(line);

      // Animated packet pulse
      const packetGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const packet = new THREE.Mesh(packetGeo, packetMat);
      this.mainGroup.add(packet);

      this.packetPulses.push({
        mesh: packet,
        curve: curve,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.005
      });
    });
  }

  createDustParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i + 1] = (Math.random() - 0.5) * 30;
      positions[i + 2] = (Math.random() - 0.5) * 30;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.5
    });

    this.particles = new THREE.Points(geometry, material);
    this.mainGroup.add(this.particles);
  }

  setupEvents() {
    window.addEventListener('resize', () => this.onResize());

    // Window-level smooth mouse coordinate tracking
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;

      // Pointer for raycaster within canvas
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.pointer.x = (x / this.canvas.clientWidth) * 2 - 1;
      this.pointer.y = -(y / this.canvas.clientHeight) * 2 + 1;

      // Smooth inertia drag
      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.dragVelocity.x = deltaX * 0.006;
        this.dragVelocity.y = deltaY * 0.006;

        this.userRotation.targetY += this.dragVelocity.x;
        this.userRotation.targetX += this.dragVelocity.y;

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragVelocity = { x: 0, y: 0 };
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Wireframe toggle button
    const wireframeBtn = document.getElementById('btn-toggle-wireframe');
    if (wireframeBtn) {
      wireframeBtn.addEventListener('click', () => {
        this.toggleWireframe();
        wireframeBtn.classList.toggle('active', this.isWireframe);
      });
    }

    // Auto-orbit toggle button
    const rotateBtn = document.getElementById('btn-toggle-rotate');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        this.isAutoRotating = !this.isAutoRotating;
        rotateBtn.classList.toggle('active', !this.isAutoRotating);
        rotateBtn.innerHTML = this.isAutoRotating
          ? `<i data-lucide="pause"></i> Orbiting`
          : `<i data-lucide="play"></i> Paused`;
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Reset view button
    const resetBtn = document.getElementById('btn-reset-view');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.userRotation.targetX = 0.12;
        this.userRotation.targetY = -0.35;
        this.camera.position.set(0, 4.5, 23);
      });
    }
  }

  toggleWireframe() {
    this.isWireframe = !this.isWireframe;
    this.mainGroup.traverse((child) => {
      if (child.isMesh && child.material && child !== this.radarRing) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.wireframe = this.isWireframe);
        } else {
          child.material.wireframe = this.isWireframe;
        }
      }
    });
  }

  onResize() {
    if (!this.canvas || !this.renderer || !this.camera) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  checkRaycast() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const data = (hit.parentGroup ? hit.parentGroup.userData : hit.userData) || hit.userData;

      if (data && data.title && this.tooltip) {
        this.canvas.style.cursor = 'pointer';
        this.tooltip.style.opacity = '1';
        this.tooltip.innerHTML = `
          <div style="font-weight:700; color:#38bdf8;">${data.title}</div>
          <div style="font-size:0.7rem; color:#94a3b8;">${data.category}</div>
          <div style="font-size:0.68rem; color:#10b981; margin-top:2px;">● ${data.status}</div>
        `;

        const screenPos = hit.position.clone();
        if (hit.parentGroup) screenPos.add(hit.parentGroup.position);
        screenPos.project(this.camera);

        const x = ((screenPos.x + 1) * this.canvas.clientWidth) / 2;
        const y = ((-screenPos.y + 1) * this.canvas.clientHeight) / 2;

        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
        return;
      }
    }

    if (this.tooltip) {
      this.tooltip.style.opacity = '0';
    }
    if (!this.isDragging) {
      this.canvas.style.cursor = 'grab';
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = performance.now() * 0.001;

    // High-performance smooth damping interpolation (lerp)
    this.mouse.smoothX += (this.mouse.targetX - this.mouse.smoothX) * 0.045;
    this.mouse.smoothY += (this.mouse.targetY - this.mouse.smoothY) * 0.045;

    // Apply auto-rotation
    if (this.isAutoRotating && !this.isDragging) {
      this.userRotation.targetY += 0.0018;
    }

    // Damped user rotation lerp
    this.userRotation.x += (this.userRotation.targetX - this.userRotation.x) * 0.08;
    this.userRotation.y += (this.userRotation.targetY - this.userRotation.y) * 0.08;

    // Parallax tilt applied smoothly
    this.mainGroup.rotation.y = this.userRotation.y + this.mouse.smoothX * 0.18;
    this.mainGroup.rotation.x = this.userRotation.x + this.mouse.smoothY * 0.12;

    // Floating bobbing motion on hardware pieces
    if (this.pcbMesh) {
      this.pcbMesh.position.y = 0.6 + Math.sin(time * 1.5) * 0.22;
      this.pcbMesh.rotation.z = -0.15 + Math.cos(time * 1.1) * 0.06;
    }
    if (this.calcMesh) {
      this.calcMesh.position.y = 0.2 + Math.cos(time * 1.3) * 0.22;
      this.calcMesh.rotation.y = -0.5 + Math.sin(time * 0.9) * 0.08;
    }
    if (this.compassMesh) {
      this.compassMesh.position.y = 2.8 + Math.sin(time * 1.6) * 0.18;
    }

    // Spin radar ring slowly
    if (this.radarRing) {
      this.radarRing.rotation.z += 0.0025;
    }

    // Smooth packet pulses
    this.packetPulses.forEach((p) => {
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;
      const point = p.curve.getPoint(p.progress);
      p.mesh.position.copy(point);
    });

    // Check raycast
    this.checkRaycast();

    // Render frame
    this.renderer.render(this.scene, this.camera);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined') {
    window.blueprintScene = new Blueprint3DScene('hero-3d-canvas');
  }
});
