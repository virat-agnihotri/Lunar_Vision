import * as THREE from 'three';

/**
 * Unified Mathematical Trajectory & Lunar Orbit System.
 * Ensures the rocket and satellite strictly share the exact same curve
 * as the visible trajectory line and orbital ring, guaranteeing 100% alignment.
 */
export function createUnifiedFlightSystem(earthRadius, moonPos, moonRadius) {
  // 1. Earth Launch Pad position on Earth surface
  const launchPadPos = new THREE.Vector3(0, earthRadius, 0);

  // 2. Trajectory Waypoints connecting Earth to Moon
  const p0 = launchPadPos.clone(); // Liftoff from surface
  const p1 = new THREE.Vector3(0.8, earthRadius + 6.0, -1.5); // Atmospheric ascent
  const p2 = new THREE.Vector3(6.0, earthRadius + 18.0, -8.0); // Gravity turn / staging
  const p3 = new THREE.Vector3(28.0, earthRadius + 38.0, -22.0); // Trans-lunar injection
  const p4 = new THREE.Vector3(75.0, 52.0, -42.0); // Deep space coast
  const p5 = new THREE.Vector3(120.0, 36.0, -52.0); // Lunar gravity capture approach
  const p6 = new THREE.Vector3(
    moonPos.x - moonRadius * 1.5,
    moonPos.y + 1.2,
    moonPos.z + moonRadius * 0.8
  ); // Lunar Orbit Entry Point

  const flightCurve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4, p5, p6], false, 'centripetal');

  // Generate the glowing 3D trajectory line directly from this curve
  const curvePoints = flightCurve.getPoints(240);
  const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
  const lineMat = new THREE.LineDashedMaterial({
    color: 0x38bdf8,
    dashSize: 1.6,
    gapSize: 0.9,
    linewidth: 2,
    transparent: true,
    opacity: 0.85,
  });
  const trajectoryLine = new THREE.Line(lineGeo, lineMat);
  trajectoryLine.computeLineDistances();

  // Helper to extract spacecraft position & tangent orientation along trajectory
  const getSpacecraftTransform = (t) => {
    const clampedT = Math.max(0, Math.min(1, t));
    const position = flightCurve.getPointAt(clampedT);
    const tangent = flightCurve.getTangentAt(clampedT).normalize();

    // Align spacecraft nose (+Y) with tangent vector
    const orientation = new THREE.Quaternion();
    orientation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

    return { position, tangent, orientation };
  };

  // 3. Parametric Lunar Orbit System
  const orbitRadius = moonRadius * 1.55;
  // Polar inclined orbital plane vectors
  const u = new THREE.Vector3(Math.cos(0.35), Math.sin(0.4), 0).normalize();
  const v = new THREE.Vector3(0, -Math.sin(0.4), Math.cos(0.35)).normalize();

  // Generate glowing orbital ring mesh from identical parametric equation
  const orbitRingPoints = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const pt = new THREE.Vector3()
      .copy(moonPos)
      .addScaledVector(u, orbitRadius * Math.cos(theta))
      .addScaledVector(v, orbitRadius * 0.9 * Math.sin(theta));
    orbitRingPoints.push(pt);
  }
  const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitRingPoints);
  const orbitMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.75,
  });
  const orbitRing = new THREE.Line(orbitGeo, orbitMat);

  // Helper to get satellite orbital position & orientation
  const getOrbitTransform = (theta) => {
    const pos = new THREE.Vector3()
      .copy(moonPos)
      .addScaledVector(u, orbitRadius * Math.cos(theta))
      .addScaledVector(v, orbitRadius * 0.9 * Math.sin(theta));

    // Velocity tangent along orbit
    const tangent = new THREE.Vector3()
      .addScaledVector(u, -orbitRadius * Math.sin(theta))
      .addScaledVector(v, orbitRadius * 0.9 * Math.cos(theta))
      .normalize();

    const orientation = new THREE.Quaternion();
    orientation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

    return { position: pos, tangent, orientation };
  };

  return {
    flightCurve,
    trajectoryLine,
    orbitRing,
    getSpacecraftTransform,
    getOrbitTransform,
  };
}

/**
 * Creates a Realistic Modern Aerospace Launch Vehicle (Rocket).
 * Features aerodynamic ogive fairing, roll-pattern markings,
 * ribbed interstages, 4 nozzle bells, and separate upper stage geometry.
 */
export function createRealisticRocket() {
  const rocketGroup = new THREE.Group();

  // Materials
  const hullWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.35,
    roughness: 0.25,
  });

  const interstageMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.8,
    roughness: 0.35,
  });

  const nozzleMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.95,
    roughness: 0.2,
  });

  const rollStripeMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.4,
  });

  // 1. Lower Core Booster Stage
  const lowerCoreGeo = new THREE.CylinderGeometry(0.75, 0.75, 4.5, 32);
  const lowerCore = new THREE.Mesh(lowerCoreGeo, hullWhiteMat);
  lowerCore.position.y = -0.75;
  rocketGroup.add(lowerCore);

  // Roll Pattern Marking Band
  const stripeGeo = new THREE.CylinderGeometry(0.752, 0.752, 0.6, 32, 1, false, 0, Math.PI);
  const stripe1 = new THREE.Mesh(stripeGeo, rollStripeMat);
  stripe1.position.y = 0.5;
  rocketGroup.add(stripe1);

  // 2. Ribbed Interstage Ring with Aerodynamic Grid Fins
  const interstageGeo = new THREE.CylinderGeometry(0.76, 0.76, 0.5, 32);
  const interstage = new THREE.Mesh(interstageGeo, interstageMat);
  interstage.position.y = 1.75;
  rocketGroup.add(interstage);

  // 4 Grid Fins for aerodynamic stability
  const gridFinGeo = new THREE.BoxGeometry(0.32, 0.42, 0.04);
  const gridFinMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.3 });
  const finAngles = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
  finAngles.forEach((ang) => {
    const fin = new THREE.Mesh(gridFinGeo, gridFinMat);
    fin.position.set(Math.cos(ang) * 0.95, 1.75, Math.sin(ang) * 0.95);
    fin.rotation.y = ang;
    rocketGroup.add(fin);
  });

  // 3. Upper Stage
  const upperStageGeo = new THREE.CylinderGeometry(0.75, 0.75, 2.2, 32);
  const upperStage = new THREE.Mesh(upperStageGeo, hullWhiteMat);
  upperStage.position.y = 3.1;
  rocketGroup.add(upperStage);

  // 4. Aerodynamic Ogive Payload Fairing (Nose Cone)
  const fairingGeo = new THREE.ConeGeometry(0.75, 2.4, 32);
  const fairing = new THREE.Mesh(fairingGeo, hullWhiteMat);
  fairing.position.y = 5.4;
  rocketGroup.add(fairing);

  // 5. Cluster of 4 Rocket Engine Nozzle Bells with Copper Throat Rings
  const nozzleBellGeo = new THREE.ConeGeometry(0.24, 0.7, 16, 1, true);
  nozzleBellGeo.rotateX(Math.PI);
  const throatRingGeo = new THREE.TorusGeometry(0.16, 0.03, 8, 16);
  const copperMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9, roughness: 0.25 });

  const nozzleOffsets = [
    [-0.32, -0.32],
    [0.32, -0.32],
    [-0.32, 0.32],
    [0.32, 0.32],
  ];

  nozzleOffsets.forEach(([nx, nz]) => {
    const nozzle = new THREE.Mesh(nozzleBellGeo, nozzleMat);
    nozzle.position.set(nx, -3.3, nz);
    const throat = new THREE.Mesh(throatRingGeo, copperMat);
    throat.rotation.x = Math.PI * 0.5;
    throat.position.set(nx, -3.05, nz);
    rocketGroup.add(nozzle, throat);
  });

  // 6. Multi-layered Realistic Engine Flame Plume
  const plumeGroup = new THREE.Group();
  plumeGroup.position.y = -3.3;

  // Layer A: Incandescent White Hot Core Cone
  const coreFlameGeo = new THREE.ConeGeometry(0.35, 3.2, 16);
  coreFlameGeo.rotateX(Math.PI);
  const coreFlameMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const coreFlame = new THREE.Mesh(coreFlameGeo, coreFlameMat);
  coreFlame.position.y = -1.6;
  plumeGroup.add(coreFlame);

  // Layer B: Expanding Supersonic Plasma Envelope
  const outerFlameGeo = new THREE.ConeGeometry(0.85, 5.5, 16);
  outerFlameGeo.rotateX(Math.PI);
  const outerFlameMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);
  outerFlame.position.y = -2.75;
  plumeGroup.add(outerFlame);

  // Layer C: Shock Diamond Discs
  for (let i = 1; i <= 4; i++) {
    const discGeo = new THREE.CylinderGeometry(0.24 / i, 0.24 / i, 0.08, 16);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      blending: THREE.AdditiveBlending,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = -0.85 * i;
    plumeGroup.add(disc);
  }

  // Engine Thrust Illumination Light
  const thrustLight = new THREE.PointLight(0xf97316, 12, 35);
  thrustLight.position.y = -2.5;
  plumeGroup.add(thrustLight);

  rocketGroup.add(plumeGroup);

  // Dynamic throttle / flame control
  rocketGroup.setThrust = (intensity) => {
    const cl = Math.max(0, Math.min(1.5, intensity));
    plumeGroup.visible = cl > 0.02;
    plumeGroup.scale.set(
      1 + (Math.random() - 0.5) * 0.1 * cl,
      cl * (1 + (Math.random() - 0.5) * 0.15),
      1 + (Math.random() - 0.5) * 0.1 * cl
    );
    thrustLight.intensity = cl * 12;
  };

  rocketGroup.scale.set(0.65, 0.65, 0.65);
  return rocketGroup;
}

/**
 * Creates Launch Pad Gantry Towers on the Earth Surface (matching Panel 01).
 */
export function createLaunchGantry() {
  const gantryGroup = new THREE.Group();
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.8,
    roughness: 0.4,
    wireframe: true,
  });

  // Left & Right Umbilical Tower Trusses
  const towerGeo = new THREE.BoxGeometry(0.8, 6.5, 0.8);
  const leftTower = new THREE.Mesh(towerGeo, towerMat);
  leftTower.position.set(-2.2, 3.2, 0);

  const rightTower = new THREE.Mesh(towerGeo, towerMat);
  rightTower.position.set(2.2, 3.2, 0);

  // Launch Table Platform Base
  const baseGeo = new THREE.BoxGeometry(5.5, 0.4, 5.5);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = 0.2;

  gantryGroup.add(leftTower, rightTower, baseMesh);
  gantryGroup.scale.set(0.65, 0.65, 0.65);
  return gantryGroup;
}

/**
 * Creates a Realistic Scientific Lunar Observation Satellite (Chandrayaan-2 inspired).
 * Features gold MLI thermal foil body, deployable dual solar wings with gold backing,
 * high-gain parabolic antenna dish, TMC-2 camera optics, and attitude thruster blocks.
 */
export function createRealisticSatellite() {
  const satelliteGroup = new THREE.Group();

  // Materials
  const goldFoilMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Gold thermal MLI blanket
    metalness: 0.95,
    roughness: 0.2,
  });

  const goldBackingMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.85,
    roughness: 0.35,
  });

  const solarCellMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a, // Deep blue silicon solar cells
    metalness: 0.8,
    roughness: 0.15,
  });

  const antennaMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.6,
    roughness: 0.25,
  });

  const opticMat = new THREE.MeshStandardMaterial({
    color: 0x020617,
    roughness: 0.05,
  });

  // 1. Central Faceted Gold MLI Bus Body
  const busGeo = new THREE.BoxGeometry(1.6, 1.8, 1.4);
  const bus = new THREE.Mesh(busGeo, goldFoilMat);
  satelliteGroup.add(bus);

  // Structural Corner Bevel Bands
  const cornerMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });
  const cornerBandGeo = new THREE.BoxGeometry(1.62, 0.12, 1.42);
  const band1 = new THREE.Mesh(cornerBandGeo, cornerMat);
  band1.position.y = 0.6;
  const band2 = new THREE.Mesh(cornerBandGeo, cornerMat);
  band2.position.y = -0.6;
  satelliteGroup.add(band1, band2);

  // 2. High-Gain Parabolic Antenna Dish with Feed Horn
  const dishGeo = new THREE.SphereGeometry(0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
  const dish = new THREE.Mesh(dishGeo, antennaMat);
  dish.rotation.x = -Math.PI * 0.35;
  dish.position.set(0, 1.25, 0.2);
  satelliteGroup.add(dish);

  const feedGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.65);
  const feed = new THREE.Mesh(feedGeo, antennaMat);
  feed.position.set(0, 1.6, 0.48);
  satelliteGroup.add(feed);

  // 3. Optical Terrain Mapping Cameras (TMC-2 Apertures)
  const cameraBarrelGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.4, 16);
  cameraBarrelGeo.rotateX(Math.PI * 0.5);
  const cam1 = new THREE.Mesh(cameraBarrelGeo, opticMat);
  cam1.position.set(-0.35, -0.4, 0.75);
  const cam2 = new THREE.Mesh(cameraBarrelGeo, opticMat);
  cam2.position.set(0.35, -0.4, 0.75);
  satelliteGroup.add(cam1, cam2);

  // 4. RCS Thruster Quads on 4 Corners
  const rcsGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
  const rcsMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 });
  const rcsPositions = [
    [-0.85, 0.8, -0.75],
    [0.85, 0.8, -0.75],
    [-0.85, -0.8, -0.75],
    [0.85, -0.8, -0.75],
  ];
  rcsPositions.forEach(([rx, ry, rz]) => {
    const rcs = new THREE.Mesh(rcsGeo, rcsMat);
    rcs.position.set(rx, ry, rz);
    satelliteGroup.add(rcs);
  });

  // 4b. Telemetry Dipole Antennas & Sun Sensor Mast
  const boomGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.75);
  const boomMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
  const boom1 = new THREE.Mesh(boomGeo, boomMat);
  boom1.position.set(-0.8, 1.1, -0.6);
  boom1.rotation.z = Math.PI * 0.25;
  const boom2 = new THREE.Mesh(boomGeo, boomMat);
  boom2.position.set(0.8, 1.1, -0.6);
  boom2.rotation.z = -Math.PI * 0.25;

  const sunSensorGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.4);
  const sunSensor = new THREE.Mesh(sunSensorGeo, boomMat);
  sunSensor.position.set(0, 1.25, -0.65);
  satelliteGroup.add(boom1, boom2, sunSensor);

  // 5. Deployable Dual Solar Panel Wings with Gold Backing
  const panelWidth = 2.4;
  const panelHeight = 1.3;
  const panelThickness = 0.04;

  // Left Wing Pivot
  const leftPivot = new THREE.Group();
  leftPivot.position.set(-0.8, 0, 0);

  // Front Solar Cells
  const leftFrontGeo = new THREE.BoxGeometry(panelWidth, panelHeight, panelThickness * 0.5);
  const leftFront = new THREE.Mesh(leftFrontGeo, solarCellMat);
  leftFront.position.set(-panelWidth * 0.5 - 0.1, 0, panelThickness * 0.25);

  // Back Gold Foil
  const leftBack = new THREE.Mesh(leftFrontGeo, goldBackingMat);
  leftBack.position.set(-panelWidth * 0.5 - 0.1, 0, -panelThickness * 0.25);
  leftPivot.add(leftFront, leftBack);
  satelliteGroup.add(leftPivot);

  // Right Wing Pivot
  const rightPivot = new THREE.Group();
  rightPivot.position.set(0.8, 0, 0);

  const rightFront = new THREE.Mesh(leftFrontGeo, solarCellMat);
  rightFront.position.set(panelWidth * 0.5 + 0.1, 0, panelThickness * 0.25);
  const rightBack = new THREE.Mesh(leftFrontGeo, goldBackingMat);
  rightBack.position.set(panelWidth * 0.5 + 0.1, 0, -panelThickness * 0.25);
  rightPivot.add(rightFront, rightBack);
  satelliteGroup.add(rightPivot);

  // Articulated deployment method (0 = folded against bus, 1 = fully deployed)
  satelliteGroup.setDeployProgress = (progress) => {
    const p = Math.max(0, Math.min(1, progress));
    const foldAngle = (1 - p) * (Math.PI * 0.5);
    leftPivot.rotation.y = foldAngle;
    rightPivot.rotation.y = -foldAngle;
    leftPivot.scale.set(0.2 + 0.8 * p, 0.2 + 0.8 * p, 0.2 + 0.8 * p);
    rightPivot.scale.set(0.2 + 0.8 * p, 0.2 + 0.8 * p, 0.2 + 0.8 * p);
  };

  satelliteGroup.scale.set(0.8, 0.8, 0.8);
  return satelliteGroup;
}

/**
 * 3D Starfield with natural stellar magnitude distribution (2600 stars).
 */
export function createStarfield(count = 2600) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const colorPalette = [
    new THREE.Color(0xffffff), // Pure white
    new THREE.Color(0xdbeafe), // Blue-white
    new THREE.Color(0xfef3c7), // Warm yellow star
    new THREE.Color(0x93c5fd), // Deep blue-cyan
    new THREE.Color(0xfed7aa), // Faint orange giant
  ];

  for (let i = 0; i < count; i++) {
    const r = 350 + Math.random() * 450;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    // Add natural magnitude brightness variation
    const brightness = Math.random() < 0.08 ? 1.0 : (Math.random() * 0.5 + 0.45);
    colors[i * 3] = c.r * brightness;
    colors[i * 3 + 1] = c.g * brightness;
    colors[i * 3 + 2] = c.b * brightness;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
  });

  return new THREE.Points(geometry, material);
}
