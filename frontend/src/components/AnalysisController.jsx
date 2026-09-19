import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizationPanel from './VisualizationPanel';
import { SpatialTimelineStep } from './Telemetry';

export const STAGES = [
  { id: 'PRE', label: 'PREPROCESS', sub: 'Gaussian Denoising & CLAHE', number: '01' },
  { id: 'SIFT', label: 'SIFT DETECT', sub: 'Multi-Octave Keypoints', number: '02' },
  { id: 'MATCH', label: 'FLANN MATCH', sub: 'Lowe Ratio Test (0.70x)', number: '03' },
  { id: 'RANSAC', label: 'RANSAC VERIFY', sub: 'Outlier Rejection (8-DOF)', number: '04' },
  { id: 'HOMO', label: 'HOMOGRAPHY', sub: 'Perspective Warp & LK', number: '05' },
  { id: 'FINAL', label: 'CORRESPONDENCE', sub: 'Geometric Verification', number: '06' }
];

export const AnalysisController = ({ 
  backendData, 
  currentStageIndex = 0, 
  setCurrentStageIndex,
  onStageChange 
}) => {
  const [internalStage, setInternalStage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeIndex = currentStageIndex !== undefined ? currentStageIndex : internalStage;
  const updateStage = (idx) => {
    if (setCurrentStageIndex) {
      setCurrentStageIndex(idx);
    } else {
      setInternalStage(idx);
    }
    if (onStageChange) onStageChange(idx, STAGES[idx]);
  };

  // State-driven stage sequence runner
  useEffect(() => {
    if (isPaused) return;

    if (activeIndex < STAGES.length - 1) {
      const timer = setTimeout(() => {
        updateStage(activeIndex + 1);
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, isPaused]);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Horizontal Spatial Timeline */}
      <div className="spatial-glass p-3 rounded-sm border border-spatial-glow/60 overflow-x-auto">
        <div className="flex items-center justify-between gap-2 min-w-[760px]">
          {STAGES.map((st, idx) => (
            <SpatialTimelineStep
              key={st.id}
              number={st.number}
              label={st.label}
              sublabel={st.sub}
              status={idx < activeIndex ? 'COMPLETE' : idx === activeIndex ? 'ACTIVE' : 'PENDING'}
              isCurrent={idx === activeIndex}
              isLast={idx === STAGES.length - 1}
              onClick={() => updateStage(idx)}
            />
          ))}
        </div>
      </div>

      {/* Process Header & Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-mission-amber shadow-[0_0_8px_#e2b07e] animate-pulse" />
          <div>
            <span className="font-mono text-[10px] text-mission-amber tracking-ultra uppercase block">
              ACTIVE STAGE {STAGES[activeIndex].number} // {STAGES[activeIndex].label}
            </span>
            <span className="text-sm font-sans font-light text-lunar-50 tracking-wide">
              {STAGES[activeIndex].sub}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="spatial-glass px-3 py-1.5 rounded-sm font-mono text-[10px] text-lunar-200 hover:text-mission-amber border border-spatial-glow hover:border-mission-amber transition-colors cursor-pointer uppercase tracking-wider"
          >
            {isPaused ? '▶ RESUME SEQUENCE' : '⏸ PAUSE SEQUENCE'}
          </button>
          <button
            onClick={() => updateStage(Math.min(STAGES.length - 1, activeIndex + 1))}
            disabled={activeIndex >= STAGES.length - 1}
            className="spatial-glass px-3 py-1.5 rounded-sm font-mono text-[10px] text-lunar-200 hover:text-mission-cyan border border-spatial-glow hover:border-mission-cyan transition-colors cursor-pointer uppercase tracking-wider disabled:opacity-40"
          >
            NEXT STAGE →
          </button>
        </div>
      </div>

      {/* Main Spatial Visualization Area */}
      <div className="flex-1 min-h-[460px] spatial-glass rounded-sm border border-spatial-glow relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <VisualizationPanel 
            key={STAGES[activeIndex].id} 
            stage={STAGES[activeIndex].id} 
            data={backendData}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalysisController;
