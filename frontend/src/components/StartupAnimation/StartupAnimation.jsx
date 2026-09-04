import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ANIMATION_CONFIG } from '../../config/animationConfig.js';
import {
  createEarthDayTexture,
  createEarthNightTexture,
  createEarthCloudsTexture,
  createEarthShaderMaterial,
  createMoonTexture,
  createMoonBumpMap,
} from './spaceTextures.js';
import {
  createUnifiedFlightSystem,
  createRealisticRocket,
  createLaunchGantry,
  createRealisticSatellite,
  createStarfield,
} from './spaceModels.js';
import './StartupAnimation.css';

/**
 * Photorealistic 3D Aerospace Mission Visualization (Lunar Vision).
 * Perfectly matches the reference storyboard:
 * 01 LAUNCH -> 02 ASCENT -> 03 SATELLITE DEPLOYMENT -> 04 JOURNEY TO MOON ->
 * 05 LUNAR ORBIT -> 06 LUNAR VISION TITLE REVEAL -> EXISTING DASHBOARD.
 * 
 * Optimized for rock-solid single execution:
 * - Direct DOM refs for 60fps telemetry HUD updates (zero React re-render thrashing).
 * - Authoritative ref guards preventing duplicate runs or restarts.
 * - Comprehensive Three.js WebGL resource cleanup.
 */
export default function StartupAnimation({ onComplete }) {
  const mountRef = useRef(null);
  const titleOverlayRef = useRef(null);
  const missionClockRef = useRef(null);
  const phaseTitleRef = useRef(null);
  const altValRef = useRef(null);
  const velValRef = useRef(null);
  const sysValRef = useRef(null);

  const [isExiting, setIsExiting] = useState(false);

  // Authoritative lifecycle guards
  const hasInitializedRef = useRef(false);
  const hasFinishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    setIsExiting(true);
    setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, 700);
  }, []);

  // Keyboard shortcut listener (ESC or Space to skip)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Escape' || e.key === ' ') && ANIMATION_CONFIG.allowSkip) {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  useEffect(() => {
    if (!ANIMATION_CONFIG.enabled) {
      handleFinish();
      return;
    }

    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x01030a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Astronomical Lighting
    // Directional Sun lighting Earth and Moon at an angle for dramatic terminators
    const sunDir = new THREE.Vector3(140, 50, 90).normalize();
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.copy(sunDir).multiplyScalar(200);
    scene.add(sunLight);

    // Subtle blue deep-space fill light for realistic ambient illumination
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.28);
    fillLight.position.set(-100, -30, -80);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0x0c1427, 0.45);
    scene.add(ambientLight);

    // 3. 3D Starfield with natural stellar magnitude
    const starfield = createStarfield(2600);
    scene.add(starfield);

    // 4. Photorealistic Earth Setup
    const earthRadius = 15;
    const earthGroup = new THREE.Group();
    earthGroup.position.set(0, 0, 0);

    const earthDayTex = createEarthDayTexture();
    const earthNightTex = createEarthNightTexture();
    const earthCloudsTex = createEarthCloudsTexture();

    const earthShaderMat = createEarthShaderMaterial(
      earthDayTex,
      earthNightTex,
      earthCloudsTex,
      sunDir
    );

    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMesh = new THREE.Mesh(earthGeo, earthShaderMat);
    earthMesh.rotation.y = Math.PI * 0.72; // Orient Indian Ocean & golden city lights
    earthGroup.add(earthMesh);

    scene.add(earthGroup);

    // 5. High-Detail Moon Setup
    const moonRadius = 6.8;
    const moonPos = new THREE.Vector3(180, 42, -90);
    const moonGroup = new THREE.Group();
    moonGroup.position.copy(moonPos);

    const moonTex = createMoonTexture();
    const moonBump = createMoonBumpMap();
    const moonGeo = new THREE.SphereGeometry(moonRadius, 64, 64);
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTex,
      bumpMap: moonBump,
      bumpScale: 0.12,
      roughness: 0.92,
      metalness: 0.05,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.rotation.y = Math.PI * 0.45;
    moonGroup.add(moonMesh);

    scene.add(moonGroup);

    // 6. Unified Mathematical Flight Trajectory & Orbit System
    const {
      trajectoryLine,
      orbitRing,
      getSpacecraftTransform,
      getOrbitTransform,
    } = createUnifiedFlightSystem(earthRadius, moonPos, moonRadius);

    scene.add(trajectoryLine);
    scene.add(orbitRing);
    trajectoryLine.visible = false;
    orbitRing.visible = false;

    // 7. Spacecraft & Launch Pad Models
    const gantry = createLaunchGantry();
    gantry.position.set(0, earthRadius, 0);
    scene.add(gantry);

    // Realistic Rocket
    const rocket = createRealisticRocket();
    scene.add(rocket);

    // Realistic Satellite (Chandrayaan-2 inspired)
    const satellite = createRealisticSatellite();
    satellite.visible = false;
    scene.add(satellite);

    // 8. Launchpad Volumetric Smoke Billow Particles
    const smokeCount = 180;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);
    const smokeVelocities = [];

    for (let i = 0; i < smokeCount; i++) {
      smokePositions[i * 3] = (Math.random() - 0.5) * 1.5;
      smokePositions[i * 3 + 1] = earthRadius + 0.2;
      smokePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      smokeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.25,
          Math.random() * 0.15 + 0.05,
          (Math.random() - 0.5) * 0.25
        )
      );
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0xd1d5db,
      size: 2.2,
      transparent: true,
      opacity: 0.55,
      blending: THREE.NormalBlending,
    });
    const launchSmoke = new THREE.Points(smokeGeo, smokeMat);
    scene.add(launchSmoke);

    // 9. Continuous 8-Phase Cinematic Camera Director Loop
    const totalDuration = ANIMATION_CONFIG.INTRO_DURATION || 16.0;
    const startTime = performance.now();
    let animationFrameId;

    const animate = (currentTime) => {
      const elapsedSec = (currentTime - startTime) / 1000;
      const p = Math.min(1.0, elapsedSec / totalDuration);

      // Direct DOM Mission Clock update (avoids React re-renders)
      if (missionClockRef.current) {
        const mins = Math.floor(elapsedSec / 60)
          .toString()
          .padStart(2, '0');
        const secs = (elapsedSec % 60).toFixed(1).padStart(4, '0');
        missionClockRef.current.textContent = `T+00:${mins}:${secs}`;
      }

      // Passive planetary rotation
      earthShaderMat.uniforms.uCloudOffset.value += 0.0003;
      earthMesh.rotation.y += 0.00015;
      moonMesh.rotation.y += 0.00025;

      // -------------------------------------------------------------
      // 8-Phase Visual Director based on normalized progress p
      // -------------------------------------------------------------

      if (p < 0.12) {
        // --- PHASE 1: 01 LAUNCH (Matching Panel 01) ---
        const subP = p / 0.12;
        const trajT = subP * 0.06;
        const { position, orientation } = getSpacecraftTransform(trajT);

        rocket.visible = true;
        satellite.visible = false;
        rocket.position.copy(position);
        rocket.quaternion.copy(orientation);
        rocket.setThrust(0.8 + subP * 0.5);

        // Camera starts low looking up at the poised rocket & gantry
        const camY = earthRadius + 1.2 + subP * 2.8;
        const camZ = 5.2 + subP * 1.5;
        const rumble = (Math.random() - 0.5) * (0.05 * (1 + subP));
        camera.position.set(2.4 + rumble, camY, camZ + rumble);
        camera.lookAt(position.x, position.y + 1.5, position.z);

        // Launch smoke billows
        const posArray = smokeGeo.attributes.position.array;
        for (let i = 0; i < smokeCount; i++) {
          posArray[i * 3] += smokeVelocities[i].x;
          posArray[i * 3 + 1] += smokeVelocities[i].y;
          posArray[i * 3 + 2] += smokeVelocities[i].z;
        }
        smokeGeo.attributes.position.needsUpdate = true;
        smokeMat.opacity = Math.max(0, 0.7 - subP * 0.4);

        if (phaseTitleRef.current) phaseTitleRef.current.textContent = 'PHASE 01: LAUNCH & LIFTOFF';
        if (altValRef.current) altValRef.current.textContent = `${(subP * 48).toFixed(1)} KM`;
        if (velValRef.current) velValRef.current.textContent = `${(subP * 2.1).toFixed(2)} KM/S`;
        if (sysValRef.current) sysValRef.current.textContent = 'PROPULSION MAXIMUM';
      } else if (p < 0.28) {
        // --- PHASE 2: 02 ASCENT (Matching Panel 02) ---
        const subP = (p - 0.12) / 0.16;
        const trajT = 0.06 + subP * 0.16;
        const { position, orientation } = getSpacecraftTransform(trajT);

        rocket.visible = true;
        satellite.visible = false;
        rocket.position.copy(position);
        rocket.quaternion.copy(orientation);
        rocket.setThrust(1.2);
        smokeMat.opacity = 0;

        // Camera tracks rocket upward at dramatic angle over Earth curve
        camera.position.set(
          position.x + 6.5 + subP * 5.0,
          position.y + 3.5 + subP * 8.0,
          position.z + 10.0 + subP * 12.0
        );
        camera.lookAt(position.x, position.y, position.z);

        if (phaseTitleRef.current) phaseTitleRef.current.textContent = 'PHASE 02: ASCENT INTO SPACE';
        if (altValRef.current) altValRef.current.textContent = `${(48 + subP * 210).toFixed(0)} KM`;
        if (velValRef.current) velValRef.current.textContent = `${(2.1 + subP * 6.2).toFixed(2)} KM/S`;
        if (sysValRef.current) sysValRef.current.textContent = 'GRAVITY TURN ACTIVE';
      } else if (p < 0.44) {
        // --- PHASE 3: THE BIG ZOOM-OUT & SCALE REVEAL (Scale of Earth-Moon) ---
        const subP = (p - 0.28) / 0.16;
        const trajT = 0.22 + subP * 0.16;
        const { position, orientation } = getSpacecraftTransform(trajT);

        rocket.visible = true;
        satellite.visible = false;
        rocket.position.copy(position);
        rocket.quaternion.copy(orientation);
        rocket.setThrust(0.7 - subP * 0.3);

        // Exponential camera zoom-out revealing the deep cosmic void
        const zoomDist = 28.0 + subP * 125.0;
        camera.position.set(22.0 + subP * 45.0, 32.0 + subP * 25.0, zoomDist);
        camera.lookAt(earthGroup.position.x + 12, earthGroup.position.y + 8, 0);

        trajectoryLine.visible = true;

        if (phaseTitleRef.current) phaseTitleRef.current.textContent = 'PHASE 03: TRANSLUNAR INJECTION & SCALE REVEAL';
        if (altValRef.current) altValRef.current.textContent = `${(258 + subP * 14200).toFixed(0)} KM`;
        if (velValRef.current) velValRef.current.textContent = '10.82 KM/S';
        if (sysValRef.current) sysValRef.current.textContent = 'EARTH GRAVITY ESCAPE';
      } else if (p < 0.58) {
        // --- PHASE 4: 03 SATELLITE DEPLOYMENT (Matching Panel 03) ---
        const subP = (p - 0.44) / 0.14;
        const trajT = 0.38 + subP * 0.14;
        const { position, orientation } = getSpacecraftTransform(trajT);

        // Rocket booster stage slows and separates
        rocket.visible = true;
        rocket.setThrust(0);
        rocket.position.copy(position).add(new THREE.Vector3(subP * 2.8, -subP * 1.5, subP * 1.2));
        rocket.scale.multiplyScalar(0.99);

        // Satellite is deployed and strictly inherits the trajectory
        satellite.visible = true;
        satellite.position.copy(position);
        satellite.quaternion.copy(orientation);
        satellite.setDeployProgress(subP); // Unfolds solar panel wings

        // Camera tracks the deploying satellite in foreground
        camera.position.set(
          position.x - 7.5,
          position.y + 4.2,
          position.z + 11.5
        );
        camera.lookAt(position.x, position.y, position.z);

        if (phaseTitleRef.current) phaseTitleRef.current.textContent = 'PHASE 04: SATELLITE DEPLOYMENT';
        if (altValRef.current) altValRef.current.textContent = `${(14458 + subP * 92000).toFixed(0)} KM`;
        if (velValRef.current) velValRef.current.textContent = '9.45 KM/S';
        if (sysValRef.current) sysValRef.current.textContent = 'SOLAR PANELS DEPLOYED';
      } else if (p < 0.72) {
        // --- PHASE 5: 04 JOURNEY TO MOON (Matching Panel 04) ---
        const subP = (p - 0.58) / 0.14;
        const trajT = 0.52 + subP * 0.33;
        const { position, orientation } = getSpacecraftTransform(trajT);

        rocket.visible = false;
        satellite.visible = true;
        satellite.setDeployProgress(1.0);
        satellite.position.copy(position);
        satellite.quaternion.copy(orientation);

        // Panoramic wide shot: Earth on left, satellite along glowing cyan line, Moon on right
        camera.position.set(
          position.x - 18.0 + subP * 12.0,
          position.y + 14.0 + subP * 4.0,
          position.z + 32.0 - subP * 8.0
        );
        camera.lookAt(position.x, position.y, position.z);

        if (phaseTitleRef.current) phaseTitleRef.current.textContent = 'PHASE 05: JOURNEY TO THE MOON';
        if (altValRef.current) altValRef.current.textContent = `${(106458 + subP * 185000).toFixed(0)} KM`;
        if (velValRef.current) velValRef.current.textContent = `${(9.45 - subP * 6.5).toFixed(2)} KM/S`;
        if (sysValRef.current) sysValRef.current.textContent = 'TRAJECTORY ALIGNED';
      } else if (p < 0.84) {
        // --- PHASE 6: MOON APPROACH & GRAVITY CAPTURE ---
        const subP = (p - 0.72) / 0.12;
        const trajT = 0.85 + subP * 0.15;
        const { position, orientation } = getSpacecraftTransform(trajT);

        rocket.visible = false;
        satellite.visible = true;
        satellite.position.copy(position);
        satellite.quaternion.copy(orientation);

        // Camera shifts dynamically as Moon grows dominant in the frame
        camera.position.set(
          moonPos.x - 42.0 + (1 - subP) * 18.0,
          moonPos.y + 16.0 + (1 - subP) * 8.0,
          moonPos.z + 36.0 + (1 - subP) * 12.0
        );
        camera.lookAt(moonPos.x, moonPos.y, moonPos.z);

        orbitRing.visible = true;

        if (phaseTitleRef.current) phaseTitleRef.current.textContent = 'PHASE 06: LUNAR BOUND CAPTURE';
        if (altValRef.current) altValRef.current.textContent = `${(291458 + subP * 92942).toFixed(0)} KM`;
        if (velValRef.current) velValRef.current.textContent = '2.14 KM/S';
        if (sysValRef.current) sysValRef.current.textContent = 'LUNAR GRAVITY CAPTURE';
      } else {
        // --- PHASE 7 & 8: 05 LUNAR ORBIT & 06 LUNAR VISION (Matching Panel 05 & 06) ---
        const subP = (p - 0.84) / 0.16;
        rocket.visible = false;
        satellite.visible = true;
        orbitRing.visible = true;

        // Satellite strictly follows the exact mathematical orbit around the Moon
        const orbitTheta = subP * Math.PI * 3.6;
        const { position, orientation } = getOrbitTransform(orbitTheta);

        satellite.position.copy(position);
        satellite.quaternion.copy(orientation);

        // Camera settles into the exact cinematic framing of Panel 05 & 06
        camera.position.set(
          moonPos.x - 18.0 + Math.sin(subP * 0.8) * 3.5,
          moonPos.y + 7.5,
          moonPos.z + 32.0
        );
        camera.lookAt(moonPos.x, moonPos.y, moonPos.z);

        // Reveal the Panel 06 HUD title overlay when orbit is stable (DOM class update)
        if (p >= 0.88 && titleOverlayRef.current && !titleOverlayRef.current.classList.contains('visible')) {
          titleOverlayRef.current.classList.add('visible');
        }

        if (phaseTitleRef.current) phaseTitleRef.current.textContent = 'PHASE 07: LUNAR ORBIT INSERTION';
        if (altValRef.current) altValRef.current.textContent = '100 KM POLAR';
        if (velValRef.current) velValRef.current.textContent = '1.62 KM/S';
        if (sysValRef.current) sysValRef.current.textContent = 'ORBIT STABLE';
      }

      renderer.render(scene, camera);

      if (p < 1.0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        handleFinish();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);

      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              if (mat.map) mat.map.dispose();
              mat.dispose();
            });
          } else {
            if (child.material.map) child.material.map.dispose();
            if (child.material.bumpMap) child.material.bumpMap.dispose();
            child.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [handleFinish]);

  return (
    <div className={`startup-animation-container ${isExiting ? 'fade-out' : ''}`}>
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="webgl-canvas-container" />

      {/* Top Left Mission Telemetry Clock */}
      <div className="mission-clock-panel">
        <div className="clock-label">{ANIMATION_CONFIG.telemetry.mission}</div>
        <div ref={missionClockRef} className="clock-time">T+00:00:00.0</div>
      </div>

      {/* Top Right Animated Skip Intro Button */}
      {ANIMATION_CONFIG.allowSkip && (
        <button
          className="skip-intro-btn"
          onClick={handleFinish}
          title="Press ESC or Space to skip"
        >
          <span className="btn-glow-bar" />
          <span className="btn-text">SKIP INTRO</span>
          <span className="btn-shortcut">[ESC]</span>
          <span className="btn-arrow">→</span>
        </button>
      )}

      {/* Futuristic Telemetry HUD Brackets & Status */}
      <div className="hud-overlay-layer">
        <div className="hud-corner top-left" />
        <div className="hud-corner top-right" />
        <div className="hud-corner bottom-left" />
        <div className="hud-corner bottom-right" />

        {/* Live Mission Telemetry Panel */}
        <div className="hud-live-panel">
          <div ref={phaseTitleRef} className="hud-phase-name">PHASE 01: LAUNCH & LIFTOFF</div>
          <div className="hud-metrics">
            <div className="metric-item">
              <span className="lbl">ALTITUDE</span>
              <span ref={altValRef} className="val">0 KM</span>
            </div>
            <div className="metric-item">
              <span className="lbl">VELOCITY</span>
              <span ref={velValRef} className="val">0.00 KM/S</span>
            </div>
            <div className="metric-item">
              <span className="lbl">STATUS</span>
              <span ref={sysValRef} className="val status-glow">IGNITION SEQUENCE START</span>
            </div>
          </div>
        </div>

        {/* Mission Agency Indicator */}
        <div className="hud-bottom-telemetry">
          <span>{ANIMATION_CONFIG.telemetry.agency}</span>
          <span className="telemetry-separator">|</span>
          <span>LAT: 19.0760° N • LONG: 72.8777° E • INC: 90.0° POLAR</span>
          <span className="telemetry-separator">|</span>
          <span>{ANIMATION_CONFIG.telemetry.frequency}</span>
        </div>
      </div>

      {/* Panel 06 Exact HUD & LUNAR VISION Title Reveal Overlay */}
      <div ref={titleOverlayRef} className="title-reveal-overlay">
        {/* Panel 06 Top Right Orbit Stable Status Badge */}
        <div className="hud-status-badge-panel">
          <div className="status-label">STATUS</div>
          <div className="status-val">ORBIT STABLE</div>
        </div>

        {/* Center Title Card */}
        <div className="title-glass-card">
          <div className="title-pre-badge">ISRO CHANDRAYAAN-2 IMAGERY SUITE</div>
          <h1 className="title-main-heading">{ANIMATION_CONFIG.titles.mainTitle}</h1>
          <div className="title-divider-line" />
          <h2 className="title-sub-heading">{ANIMATION_CONFIG.titles.subtitle}</h2>
        </div>

        {/* Panel 06 Bottom Left Mission Active Telemetry */}
        <div className="hud-bottom-left-panel">
          <div className="mini-hud-row">
            <span className="mini-lbl">MISSION</span>
            <span className="mini-val">LUNAR VISION</span>
          </div>
          <div className="mini-hud-row">
            <span className="mini-lbl">MODE</span>
            <span className="mini-val highlight">ACTIVE</span>
          </div>
        </div>

        {/* Panel 06 Bottom Right Loading Progress */}
        <div className="hud-bottom-right-panel">
          <div className="loading-label-row">
            <span>LOADING</span>
            <span>100%</span>
          </div>
          <div className="loading-bar-track">
            <div className="loading-bar-fill" />
          </div>
        </div>

        {/* Panel 06 Bottom Center Welcome Banner */}
        <div className="welcome-banner">Welcome to Lunar Vision</div>
      </div>
    </div>
  );
}
