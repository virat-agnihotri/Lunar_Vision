import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createMoonTexture, createMoonBumpMap } from './StartupAnimation/spaceTextures';
import { createRealisticSatellite } from './StartupAnimation/spaceModels';

export const SpatialCanvas = ({ mode = 'HERO', isProcessing = false }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1500);
    camera.position.set(0, 0, 50);

    // 2. RENDERER (Optimized, clamped pixel ratio for low-end laptops)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 3. PHYSICALLY BELIEVABLE LIGHTING (Realistic sun + deep space fill)
    // Key Directional Sun Light casting natural terminator shadow across craters
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 2.8);
    sunLight.position.set(-65, 18, 38);
    scene.add(sunLight);

    // Very subtle deep space fill (earthshine / starlight) so shadow side remains visible
    const ambientLight = new THREE.AmbientLight(0x0e111a, 0.5);
    scene.add(ambientLight);

    // 4. SUBTLE BACKGROUND STARS (Subtle pinpoints, zero cubes or neon sparkles)
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      const radius = 300 + Math.random() * 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPos[idx] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPos[idx + 2] = radius * Math.cos(phi);
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.1,
      color: 0xd4d8e2,
      transparent: true,
      opacity: 0.65,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 5. THE 3D MOON (High-density sphere, realistic surface texture & bump relief)
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    const moonRadius = 14.2;
    // 96x96 subdivision for a perfectly smooth, non-polygonal lunar sphere
    const moonGeo = new THREE.SphereGeometry(moonRadius, 96, 96);

    const moonTexture = createMoonTexture();
    const moonBumpMap = createMoonBumpMap();

    // Pure natural lunar grey material with high roughness (zero metalness, no blue/purple tint)
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      bumpMap: moonBumpMap,
      bumpScale: 0.32,
      roughness: 0.95,
      metalness: 0.0,
      color: 0xb5b7bd,
    });

    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moonMesh);

    // Base neutral orientation showing iconic near side features (Tycho, Copernicus, Ocean of Storms)
    const baseRotX = 0.08;
    const baseRotY = 0.35;
    moonMesh.rotation.set(baseRotX, baseRotY, 0);

    // Initial moon placement: positioned on right side of screen with breathing room
    moonGroup.position.set(16.5, -0.8, -6);

    // 6. SCIENTIFIC CHANDRAYAAN-2 SATELLITE (Subtle, realistic, orbiting)
    const satellite = createRealisticSatellite();
    satellite.scale.set(0.35, 0.35, 0.35);
    scene.add(satellite);

    // Faint, clean orbital ellipse path
    const orbitRadiusA = 22.5;
    const orbitRadiusB = 16.5;
    const orbitTilt = 0.38;

    const orbitPoints = [];
    for (let i = 0; i <= 100; i++) {
      const theta = (i / 100) * Math.PI * 2;
      const x = Math.cos(theta) * orbitRadiusA;
      const y = Math.sin(theta) * Math.sin(orbitTilt) * orbitRadiusB;
      const z = Math.sin(theta) * Math.cos(orbitTilt) * orbitRadiusB;
      orbitPoints.push(new THREE.Vector3(x, y, z));
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.25,
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    moonGroup.add(orbitLine);

    // 7. PREDICTABLE CURSOR-DRIVEN ROTATION MAPPING
    // Mouse coordinates normalized: Left = -1, Center = 0, Right = +1
    // Top = -1, Center = 0, Bottom = +1
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      // Clamped to [-1, 1]
      mouse.targetX = Math.max(-1, Math.min(1, (e.clientX - halfW) / halfW));
      mouse.targetY = Math.max(-1, Math.min(1, (e.clientY - halfH) / halfH));
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 8. RENDER LOOP (Zero autonomous rotation - rotation strictly driven by cursor)
    let animationFrameId;
    let orbitTheta = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const delta = clock.getDelta();

      // Smooth elastic damping to follow cursor position
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Direct, predictable rotation mapping around Moon's center:
      // Cursor moves LEFT  -> mouse.x negative -> rotates LEFT
      // Cursor moves RIGHT -> mouse.x positive -> rotates RIGHT
      // Cursor moves UP    -> mouse.y negative -> tilts UP
      // Cursor moves DOWN  -> mouse.y positive -> tilts DOWN
      // When cursor is at center (0, 0), Moon returns to neutral base orientation
      const maxRotAngleY = 0.48; // Max ~27 degrees horizontal turn
      const maxRotAngleX = 0.35; // Max ~20 degrees vertical tilt

      const targetRotY = baseRotY + mouse.x * maxRotAngleY;
      const targetRotX = baseRotX + mouse.y * maxRotAngleX;

      moonMesh.rotation.y += (targetRotY - moonMesh.rotation.y) * 0.08;
      moonMesh.rotation.x += (targetRotX - moonMesh.rotation.x) * 0.08;

      // Mode-based Moon screen position (Hero vs Workstation)
      const isHero = mode === 'HERO';
      const targetMoonX = isHero ? 16.5 : 22.0;
      const targetMoonY = isHero ? -0.8 : 3.5;
      const targetMoonZ = isHero ? -6.0 : -16.0;

      moonGroup.position.x += (targetMoonX - moonGroup.position.x) * 0.05;
      moonGroup.position.y += (targetMoonY - moonGroup.position.y) * 0.05;
      moonGroup.position.z += (targetMoonZ - moonGroup.position.z) * 0.05;

      // Very subtle camera parallax (restrained, zero UI shake)
      const targetCamX = mouse.x * 0.9;
      const targetCamY = -mouse.y * 0.6;
      const targetCamZ = isHero ? 50 : 54;

      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.position.z += (targetCamZ - camera.position.z) * 0.04;
      camera.lookAt(0, 0, 0);

      // Satellite slow orbital transit around the Moon
      orbitTheta += delta * 0.12;
      const satRelX = Math.cos(orbitTheta) * orbitRadiusA;
      const satRelY = Math.sin(orbitTheta) * Math.sin(orbitTilt) * orbitRadiusB;
      const satRelZ = Math.sin(orbitTheta) * Math.cos(orbitTilt) * orbitRadiusB;

      satellite.position.set(
        moonGroup.position.x + satRelX,
        moonGroup.position.y + satRelY,
        moonGroup.position.z + satRelZ
      );

      const satTanX = -Math.sin(orbitTheta) * orbitRadiusA;
      const satTanY = Math.cos(orbitTheta) * Math.sin(orbitTilt) * orbitRadiusB;
      const satTanZ = Math.cos(orbitTheta) * Math.cos(orbitTilt) * orbitRadiusB;
      const tangent = new THREE.Vector3(satTanX, satTanY, satTanZ).normalize();
      satellite.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

      renderer.render(scene, camera);
    };

    animate();

    // 9. RESIZE HANDLER
    const handleResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth || window.innerWidth;
      height = mountRef.current.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 10. CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      orbitGeo.dispose();
      orbitMat.dispose();
    };
  }, [mode, isProcessing]);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden" 
      aria-hidden="true"
    />
  );
};

export default SpatialCanvas;
