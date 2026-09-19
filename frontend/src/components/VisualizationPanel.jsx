import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ComparisonTool from './ComparisonTool';

export const VisualizationPanel = ({ stage, data }) => {
  // Keypoints sampling for visual overlay
  const keypointList = useMemo(() => {
    if (data?.keypoints && data.keypoints.length > 0) {
      return data.keypoints;
    }
    // High-density procedural keypoints for visual simulation
    const kps = [];
    for (let i = 0; i < 220; i++) {
      kps.push({
        x: ((Math.sin(i * 1.41) + 1) / 2) * 580 + 30,
        y: ((Math.cos(i * 2.37) + 1) / 2) * 360 + 30,
        scale: (i % 4) + 1,
      });
    }
    return kps;
  }, [data]);

  // Match line vectors for visual overlay
  const matchList = useMemo(() => {
    if (data?.matches && data.matches.length > 0) {
      return data.matches;
    }
    const matches = [];
    for (let i = 0; i < 90; i++) {
      const isInlier = i % 4 !== 0;
      matches.push({
        x1: ((Math.sin(i * 1.7) + 1) / 2) * 260 + 20,
        y1: ((Math.cos(i * 2.1) + 1) / 2) * 340 + 30,
        x2: ((Math.sin(i * 1.7) + 1) / 2) * 260 + 340,
        y2: ((Math.cos(i * 2.1) + 1) / 2) * 340 + (isInlier ? 30 : 75),
        is_inlier: isInlier
      });
    }
    return matches;
  }, [data]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex flex-col p-4 sm:p-6 overflow-hidden bg-spatial-void/40"
    >
      {/* 01: PREPROCESSING */}
      {stage === 'PRE' && (
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div className="relative spatial-glass rounded-sm overflow-hidden flex items-center justify-center">
              <img 
                src={data?.sample_image || '/lunar-surface-far.jpg'} 
                alt="Raw Optical Input" 
                className="w-full h-full object-contain filter grayscale contrast-90 brightness-90"
              />
              <div className="absolute top-3 left-3 spatial-glass px-2.5 py-1 rounded border border-spatial-glow font-mono text-[9px] text-lunar-200">
                SENSOR INPUT: RAW LUNAR RADIOMETRY
              </div>
            </div>

            <div className="relative spatial-glass rounded-sm overflow-hidden flex items-center justify-center">
              <img 
                src={data?.sample_image || '/lunar-surface-far.jpg'} 
                alt="Denoised and Enhanced" 
                className="w-full h-full object-contain filter grayscale contrast-130 brightness-105"
              />
              {/* Glowing scanning laser */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mission-amber to-transparent shadow-[0_0_15px_#e2b07e] z-10"
              />
              <div className="absolute top-3 left-3 spatial-glass px-2.5 py-1 rounded border border-mission-amber/50 font-mono text-[9px] text-mission-amber">
                PREPROCESSED: GAUSSIAN (5x5) + CLAHE EQUALIZED
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between font-mono text-[10px] px-4 py-2.5 spatial-glass rounded-sm border border-spatial-glow text-lunar-400">
            <span>FILTER: GAUSSIAN SMOOTHING (σ = 1.0)</span>
            <span className="text-mission-amber">DYNAMIC RANGE ADAPTATION IN PROGRESS...</span>
            <span className="text-mission-green">LOCAL CONTRAST MAXIMIZED</span>
          </div>
        </div>
      )}

      {/* 02: SIFT FEATURE DETECTION */}
      {stage === 'SIFT' && (
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div className="relative flex-1 spatial-glass rounded-sm overflow-hidden flex items-center justify-center">
            <img 
              src={data?.sift_viz || data?.sample_image || '/lunar-surface-far.jpg'} 
              alt="SIFT Detection" 
              className="w-full h-full object-contain filter grayscale opacity-75"
            />
            {/* SVG Progressive Keypoint Reveal */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 640 420" preserveAspectRatio="none">
              {keypointList.map((kp, i) => (
                <motion.g key={i}>
                  <motion.circle
                    initial={{ opacity: 0, r: 0 }}
                    animate={{ opacity: 0.85, r: 2.2 }}
                    transition={{ delay: (i % 70) * 0.015, duration: 0.4 }}
                    cx={kp.x} 
                    cy={kp.y}
                    fill="#e2b07e"
                  />
                  <motion.circle
                    initial={{ opacity: 0, r: 0 }}
                    animate={{ opacity: 0.35, r: 5.5 }}
                    transition={{ delay: (i % 70) * 0.015 + 0.1, duration: 0.5 }}
                    cx={kp.x} 
                    cy={kp.y}
                    stroke="#38bdf8"
                    strokeWidth="0.75"
                    fill="none"
                  />
                </motion.g>
              ))}
            </svg>

            {/* Sweep radar beam */}
            <motion.div 
              animate={{ left: ['0%', '100%', '0%'] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-mission-cyan to-transparent shadow-[0_0_20px_#38bdf8] z-10"
            />

            {/* SIFT Data HUD */}
            <div className="absolute top-4 left-4 font-mono text-[10px] spatial-glass p-3.5 rounded border border-mission-amber/40 space-y-1.5 backdrop-blur-md">
              <div className="text-lunar-50 font-light flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mission-amber" />
                FEATURE EXTRACTOR: SCALE-INVARIANT SIFT
              </div>
              <div className="text-lunar-400">DETECTION MODE: DOG EXTREMA (MULTI-OCTAVE)</div>
              <div className="text-lunar-400">SCALE SPACE: 3 OCTAVES | INITIAL SIGMA: 1.6</div>
              <div className="text-mission-cyan">
                KEYPOINTS LOCALIZED: {data?.metrics?.keypoints ? Number(data.metrics.keypoints).toLocaleString() : '—'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between font-mono text-[10px] px-4 py-2.5 spatial-glass rounded-sm border border-spatial-glow text-lunar-400">
            <span>ORIENTATION ASSIGNMENT: CANONICAL GRADIENT</span>
            <span className="text-mission-amber">EXTRACTING 128-DIMENSIONAL DESCRIPTORS</span>
            <span className="text-mission-green">KEYPOINT EXTRACTION COMPLETE</span>
          </div>
        </div>
      )}

      {/* 03: FEATURE MATCHING (FLANN/KNN) */}
      {stage === 'MATCH' && (
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div className="relative flex-1 spatial-glass rounded-sm overflow-hidden flex items-center justify-center">
            {data?.matches_viz ? (
              <img 
                src={data.matches_viz} 
                alt="FLANN Matching Result" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="relative w-full h-full flex">
                <div className="flex-1 border-r border-spatial-glow/60 overflow-hidden flex items-center justify-center p-2">
                  <img src={data?.sample_image || '/lunar-surface-far.jpg'} className="w-full h-full object-contain filter grayscale opacity-60" />
                </div>
                <div className="flex-1 overflow-hidden flex items-center justify-center p-2">
                  <img src={data?.reference_image || '/lunar-surface-far.jpg'} className="w-full h-full object-contain filter grayscale opacity-60" />
                </div>
                <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" viewBox="0 0 640 420" preserveAspectRatio="none">
                  {matchList.map((m, i) => (
                    <motion.line
                      key={i}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.6 }}
                      transition={{ delay: (i % 60) * 0.015, duration: 0.5 }}
                      x1={m.x1} 
                      y1={m.y1} 
                      x2={m.x2} 
                      y2={m.y2}
                      stroke="#94a3b8"
                      strokeWidth="0.8"
                    />
                  ))}
                </svg>
              </div>
            )}

            <div className="absolute top-4 left-4 font-mono text-[10px] spatial-glass p-3.5 rounded border border-spatial-glow space-y-1.5">
              <div className="text-lunar-50 font-light flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mission-cyan" />
                MATCHER: FLANN BASED (KD-TREES = 5)
              </div>
              <div className="text-lunar-400">SEARCH CHECKS: 50 | K-NEAREST NEIGHBORS = 2</div>
              <div className="text-lunar-400">LOWE RATIO TEST: 0.70x THRESHOLD</div>
              <div className="text-mission-amber">
                CANDIDATE CORRESPONDENCES: {data?.metrics?.good_matches ? Number(data.metrics.good_matches).toLocaleString() : '—'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between font-mono text-[10px] px-4 py-2.5 spatial-glass rounded-sm border border-spatial-glow text-lunar-400">
            <span>INDEXING: RANDOMIZED TREE FOREST</span>
            <span className="text-mission-amber">REJECTING AMBIGUOUS CORRESPONDENCES</span>
            <span className="text-mission-green">DISTANCE RATIO VERIFIED</span>
          </div>
        </div>
      )}

      {/* 04: RANSAC GEOMETRIC VERIFICATION */}
      {stage === 'RANSAC' && (
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div className="relative flex-1 spatial-glass rounded-sm overflow-hidden flex items-center justify-center">
            {data?.ransac_viz ? (
              <img 
                src={data.ransac_viz} 
                alt="RANSAC Inliers" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="relative w-full h-full flex">
                <div className="flex-1 border-r border-spatial-glow/60 overflow-hidden flex items-center justify-center p-2">
                  <img src={data?.sample_image || '/lunar-surface-far.jpg'} className="w-full h-full object-contain filter grayscale opacity-65" />
                </div>
                <div className="flex-1 overflow-hidden flex items-center justify-center p-2">
                  <img src={data?.reference_image || '/lunar-surface-far.jpg'} className="w-full h-full object-contain filter grayscale opacity-65" />
                </div>
                <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" viewBox="0 0 640 420" preserveAspectRatio="none">
                  {matchList.map((m, i) => (
                    <motion.line
                      key={i}
                      initial={{ opacity: 0.3, stroke: "#666" }}
                      animate={{ 
                        opacity: m.is_inlier ? 0.95 : 0.08, 
                        stroke: m.is_inlier ? "#e2b07e" : "#f87171" 
                      }}
                      transition={{ delay: 0.2 + (i % 40) * 0.02, duration: 0.7 }}
                      x1={m.x1} 
                      y1={m.y1} 
                      x2={m.x2} 
                      y2={m.y2}
                      strokeWidth={m.is_inlier ? "1.4" : "0.5"}
                    />
                  ))}
                </svg>
              </div>
            )}

            <div className="absolute top-4 left-4 font-mono text-[10px] spatial-glass p-3.5 rounded border border-mission-amber/50 space-y-1.5">
              <div className="text-mission-amber font-light flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mission-amber" />
                GEOMETRIC VERIFICATION: RANSAC HOMOGRAPHY (8-DOF)
              </div>
              <div className="text-lunar-400">REPROJECTION DISTANCE TOLERANCE: 5.0 PX</div>
              <div className="text-mission-green">
                INLIER CONSENSUS: {data?.metrics?.inliers ? Number(data.metrics.inliers).toLocaleString() : '—'}
              </div>
              <div className="text-mission-red">
                OUTLIERS PURGED: {data?.metrics?.outliers ? Number(data.metrics.outliers).toLocaleString() : '—'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between font-mono text-[10px] px-4 py-2.5 spatial-glass rounded-sm border border-spatial-glow text-lunar-400">
            <span>TOTAL SIFT MATCHES: {data?.metrics?.good_matches ? Number(data.metrics.good_matches).toLocaleString() : '—'}</span>
            <span className="text-mission-amber italic">SOLVING HOMOGRAPHY NORMAL EQUATION...</span>
            <span className="text-mission-green">INLIER RATIO: {data?.metrics?.inlier_ratio || '—'}</span>
          </div>
        </div>
      )}

      {/* 05: HOMOGRAPHY TRANSFORMATION */}
      {stage === 'HOMO' && (
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div className="relative flex-1 spatial-glass rounded-sm overflow-hidden flex items-center justify-center p-3">
            <motion.img 
              initial={{ scale: 0.98, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              src={data?.warped_image || data?.sample_image || '/lunar-surface-far.jpg'} 
              alt="Homography Warped Observation" 
              className="w-full h-full object-contain rounded-sm filter contrast-120"
            />
            {/* Perspective Grid Wireframe */}
            <div className="absolute inset-0 border border-mission-cyan/20 pointer-events-none bg-grid-pattern opacity-30" />
            
            <div className="absolute top-4 left-4 font-mono text-[10px] spatial-glass p-3.5 rounded border border-spatial-glow space-y-1.5">
              <div className="text-mission-cyan font-light flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mission-cyan" />
                PERSPECTIVE WARP: PROJECTIVE HOMOGRAPHY MATRIX
              </div>
              <div className="text-lunar-400">INTERPOLATION: BILINEAR ANTI-ALIASED</div>
              <div className="text-lunar-400">SUBPIXEL REFINEMENT: ITERATIVE LUCAS-KANADE</div>
              <div className="text-mission-green">
                AVERAGE REPROJECTION ERROR: {data?.metrics?.avg_error || '—'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between font-mono text-[10px] px-4 py-2.5 spatial-glass rounded-sm border border-spatial-glow text-lunar-400">
            <span>HOMOGRAPHY TRANSFORMATION: 3x3 TENSOR</span>
            <span className="text-mission-amber">RE-SAMPLING SENSOR PIXEL COORDINATES</span>
            <span className="text-mission-green">WARP APPLIED TO FRAME</span>
          </div>
        </div>
      )}

      {/* 06: FINAL CORRESPONDENCE */}
      {stage === 'FINAL' && (
        <ComparisonTool 
          source={data?.sample_image}
          reference={data?.reference_image}
          warped={data?.warped_image}
          diff={data?.diff_image}
          metrics={data?.metrics}
        />
      )}
    </motion.div>
  );
};

export default VisualizationPanel;
