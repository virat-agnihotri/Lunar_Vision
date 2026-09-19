import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCw, Move, ExternalLink, Globe2 } from 'lucide-react';

export const LunarGlobe3D = () => {
  // NASA Model Variants from SVS 14959: 'grid' (with lat/lon lines) or 'clean' (pure surface map)
  const [modelType, setModelType] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const mountRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.0018 });
  const moonGroupRef = useRef(null);
  const currentMeshRef = useRef(null);

  const modelPath =
    modelType === 'grid'
      ? '/moon_nasa_grid.glb'
      : '/moon_nasa_clean.glb';

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 360;
    let height = container.clientHeight || 360;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.borderRadius = '50%';
    container.appendChild(renderer.domElement);

    // 3. LIGHTING (Sun key light + soft scientific ambient fill)
    // Key Sun directional light casting realistic shadow terminator
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.9);
    sunLight.position.set(-6, 2.8, 4.5);
    scene.add(sunLight);

    // Soft ambient fill light for balanced contrast
    const ambientLight = new THREE.AmbientLight(0x64748b, 0.7);
    scene.add(ambientLight);

    // Cool rim light for limb separation
    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.6);
    rimLight.position.set(5, -2, -3);
    scene.add(rimLight);

    // 4. MOON 3D GROUP
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);
    moonGroupRef.current = moonGroup;

    // Initial orientation showing near side with Tycho & Copernicus
    moonGroup.rotation.x = 0.14;
    moonGroup.rotation.y = 0.55;

    // 5. LOAD NASA SVS 14959 GLB MODEL
    setIsLoading(true);
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      modelPath,
      (gltf) => {
        setIsLoading(false);
        const model = gltf.scene;

        // Auto-center and normalize size to radius 1.55
        const targetRadius = 1.55;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Re-center model geometry
        model.position.x += -center.x;
        model.position.y += -center.y;
        model.position.z += -center.z;

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = (targetRadius * 2) / (maxDim || 1);
        model.scale.set(scale, scale, scale);

        // Enhance material properties for scientific clarity
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.roughness = 0.92;
            child.material.metalness = 0.02;
            if (child.material.map) {
              child.material.map.anisotropy = 8;
            }
          }
        });

        // Add to moon group
        moonGroup.add(model);
        currentMeshRef.current = model;
      },
      undefined,
      (err) => {
        console.warn('NASA GLB load error:', err);
        setIsLoading(false);
      }
    );

    // 6. ANIMATION & INERTIAL ROTATION LOOP
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const delta = clock.getDelta();

      if (!isDraggingRef.current) {
        moonGroup.rotation.y += rotationVelocityRef.current.y;
        moonGroup.rotation.x += rotationVelocityRef.current.x;

        // Friction damping
        rotationVelocityRef.current.x *= 0.94;
        rotationVelocityRef.current.y *= 0.94;

        // Maintain gentle base auto-rotation
        if (Math.abs(rotationVelocityRef.current.y) < 0.0016) {
          rotationVelocityRef.current.y = 0.0016;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. POINTER INTERACTION HANDLERS
    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      setIsInteracting(true);
      previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch (_) {}
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current || !moonGroupRef.current) return;

      const deltaX = e.clientX - previousPointerPosRef.current.x;
      const deltaY = e.clientY - previousPointerPosRef.current.y;

      previousPointerPosRef.current = { x: e.clientX, y: e.clientY };

      const rotFactor = 0.007;
      moonGroupRef.current.rotation.y += deltaX * rotFactor;
      moonGroupRef.current.rotation.x += deltaY * rotFactor;

      rotationVelocityRef.current = {
        x: deltaY * rotFactor * 0.35,
        y: deltaX * rotFactor * 0.35,
      };
    };

    const handlePointerUp = (e) => {
      isDraggingRef.current = false;
      setIsInteracting(false);
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 8. RESIZE OBSERVER
    const handleResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 9. CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      if (currentMeshRef.current) {
        currentMeshRef.current.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
        });
      }

      renderer.dispose();
    };
  }, [modelPath]);

  const handleReset = (e) => {
    e.stopPropagation();
    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.x = 0.14;
      moonGroupRef.current.rotation.y = 0.55;
      rotationVelocityRef.current = { x: 0, y: 0.0018 };
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs rounded-full z-10">
          <div className="w-8 h-8 rounded-full border-2 border-brand-200 border-t-brand-600 animate-spin mb-2" />
          <span className="font-mono text-[10px] text-brand-800 font-semibold">
            LOADING NASA LRO MODEL...
          </span>
        </div>
      )}

      {/* Three.js Canvas Mount */}
      <div
        ref={mountRef}
        className={`w-full h-full rounded-full cursor-grab active:cursor-grabbing transition-all select-none touch-none ${
          isInteracting ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        title="Click and drag to rotate NASA LRO Moon surface"
      />

      {/* NASA Telemetry & Variant Switcher Pill */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-brand-200 px-2.5 py-1 rounded-full shadow-md pointer-events-auto z-20">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
        
        {/* Toggle between NASA Grid and NASA Clean models */}
        <button
          onClick={() => setModelType(modelType === 'grid' ? 'clean' : 'grid')}
          className="font-mono text-[9.5px] text-charcoal-800 hover:text-brand-700 font-bold tracking-wide flex items-center gap-1 transition-colors cursor-pointer"
          title="Toggle between NASA LRO Coordinate Grid and Clean Albedo Surface"
        >
          <Globe2 className="w-2.5 h-2.5 text-brand-600" />
          <span>{modelType === 'grid' ? 'NASA LRO (GRID)' : 'NASA LRO (CLEAN)'}</span>
        </button>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="ml-0.5 p-0.5 text-charcoal-400 hover:text-brand-600 rounded transition-colors cursor-pointer"
          title="Reset Orientation"
        >
          <RotateCw className="w-2.5 h-2.5" />
        </button>

        {/* Link to NASA SVS 14959 source */}
        <a
          href="https://svs.gsfc.nasa.gov/14959/"
          target="_blank"
          rel="noreferrer"
          className="p-0.5 text-charcoal-400 hover:text-brand-600 transition-colors"
          title="View NASA Scientific Visualization Studio Entry 14959"
        >
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {/* Floating Drag Hint Pill */}
      <div className="absolute top-3 right-4 flex items-center gap-1 font-mono text-[9px] text-charcoal-500 bg-white/90 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs pointer-events-none z-20">
        <Move className="w-2.5 h-2.5 text-brand-600" />
        <span>DRAG TO ROTATE</span>
      </div>
    </div>
  );
};

export default LunarGlobe3D;
