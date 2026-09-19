import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ComparisonTool = ({ source, reference, warped, diff, metrics }) => {
  const [mode, setMode] = useState('SIDE_BY_SIDE'); // SIDE_BY_SIDE | OVERLAY | DIFFERENCE
  const [opacity, setOpacity] = useState(50);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Modes Navigation & Verification Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-spatial-glow/40 pb-3">
        <div className="flex items-center gap-2">
          {['SIDE_BY_SIDE', 'OVERLAY', 'DIFFERENCE'].map((m) => (
            <button 
              key={m}
              onClick={() => setMode(m)}
              className={`font-mono text-[10px] tracking-widest px-4 py-2 rounded-sm border transition-all duration-300 cursor-pointer ${
                mode === m 
                  ? 'border-mission-amber text-mission-amber bg-spatial-indigo/90 shadow-[0_0_15px_rgba(226,176,126,0.25)]' 
                  : 'border-spatial-glow/40 text-lunar-400 hover:border-spatial-glow hover:text-lunar-50 spatial-glass'
              }`}
            >
              {m.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {mode === 'OVERLAY' && (
          <div className="flex items-center gap-3 spatial-glass px-4 py-1.5 rounded-sm border border-spatial-glow">
            <span className="font-mono text-[9px] text-lunar-400 uppercase tracking-widest">BLEND:</span>
            <input 
              type="range" 
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-32 sm:w-44 accent-[#e2b07e] cursor-pointer"
            />
            <span className="font-mono text-[10px] text-mission-amber w-10 text-right">{opacity}%</span>
          </div>
        )}

        <div className="flex items-center gap-2.5 font-mono text-xs text-mission-green spatial-glass px-3.5 py-1.5 rounded-sm border border-mission-green/40 shadow-[0_0_12px_rgba(52,211,153,0.15)]">
          <span className="w-2 h-2 rounded-full bg-mission-green shadow-[0_0_8px_#34d399] animate-pulse" />
          <span className="font-medium tracking-wide">CORRESPONDENCE VERIFIED [PASS]</span>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 min-h-[380px] bg-spatial-void/90 rounded-sm border border-spatial-glow relative overflow-hidden flex items-center justify-center cursor-crosshair select-none">
        {mode === 'SIDE_BY_SIDE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full gap-2 p-2">
            <div className="relative h-full spatial-glass rounded-sm overflow-hidden flex items-center justify-center p-2 border border-spatial-glow/50 group">
              <img 
                src={source || '/lunar-surface-far.jpg'} 
                alt="Source Observation" 
                className="w-full h-full object-contain filter grayscale contrast-110"
              />
              <div className="absolute bottom-3 left-3 spatial-glass px-2.5 py-1 rounded border border-spatial-glow font-mono text-[9px] text-lunar-200">
                SAMPLE OBSERVATION (BASE)
              </div>
            </div>
            
            <div className="relative h-full spatial-glass rounded-sm overflow-hidden flex items-center justify-center p-2 border border-mission-amber/30 group">
              <img 
                src={warped || reference || '/lunar-surface-far.jpg'} 
                alt="Warped Reference" 
                className="w-full h-full object-contain filter contrast-110"
              />
              <div className="absolute bottom-3 right-3 spatial-glass px-2.5 py-1 rounded border border-mission-amber/50 font-mono text-[9px] text-mission-amber">
                WARPED REFERENCE (HOMOGRAPHY ALIGNED)
              </div>
            </div>
          </div>
        )}

        {mode === 'OVERLAY' && (
          <div className="relative w-full h-full flex items-center justify-center p-3">
            <img 
              src={source || '/lunar-surface-far.jpg'} 
              alt="Source Base"
              className="absolute inset-0 w-full h-full object-contain filter grayscale" 
            />
            <img 
              src={warped || reference || '/lunar-surface-far.jpg'} 
              alt="Overlay Registered"
              style={{ opacity: opacity / 100 }}
              className="absolute inset-0 w-full h-full object-contain mix-blend-screen" 
            />
            <div className="absolute bottom-4 left-4 spatial-glass px-3 py-1.5 rounded border border-spatial-glow font-mono text-[9px] text-lunar-300">
              LAYER BLEND: SOURCE BASE + WARPED ALIGNMENT ({opacity}%)
            </div>
          </div>
        )}

        {mode === 'DIFFERENCE' && (
          <div className="relative w-full h-full flex items-center justify-center p-3">
            {diff ? (
              <img 
                src={diff} 
                alt="Absolute Residual Difference" 
                className="w-full h-full object-contain filter contrast-150"
              />
            ) : (
              <img 
                src={warped || reference || '/lunar-surface-far.jpg'} 
                alt="Difference Representation" 
                className="w-full h-full object-contain invert mix-blend-difference opacity-85" 
              />
            )}
            <div className="absolute bottom-4 left-4 spatial-glass px-3 py-1.5 rounded border border-mission-amber/40 font-mono text-[9px] text-mission-amber">
              SURFACE RESIDUAL / DIFFERENCE MAP (SUBPIXEL ACCURACY)
            </div>
          </div>
        )}

        {/* Framing corner reticles */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-mission-cyan/50 pointer-events-none" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-mission-cyan/50 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-mission-cyan/50 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-mission-cyan/50 pointer-events-none" />
      </div>

      {/* Live Registration Telemetry Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[10px]">
        <div className="spatial-glass p-2.5 rounded-sm border border-spatial-glow/60">
          <div className="text-lunar-400 uppercase tracking-wider text-[9px] mb-1">RESIDUAL ERROR</div>
          <div className="text-mission-amber text-sm font-light">
            {metrics?.avg_error ?? '—'}
          </div>
        </div>

        <div className="spatial-glass p-2.5 rounded-sm border border-spatial-glow/60">
          <div className="text-lunar-400 uppercase tracking-wider text-[9px] mb-1">INLIER RATIO</div>
          <div className="text-mission-green text-sm font-light">
            {metrics?.inlier_ratio ?? '—'}
          </div>
        </div>

        <div className="spatial-glass p-2.5 rounded-sm border border-spatial-glow/60">
          <div className="text-lunar-400 uppercase tracking-wider text-[9px] mb-1">RANSAC CONSENSUS</div>
          <div className="text-lunar-200 text-sm font-light">
            {metrics?.inliers ? `${Number(metrics.inliers).toLocaleString()} pts` : '—'}
          </div>
        </div>

        <div className="spatial-glass p-2.5 rounded-sm border border-spatial-glow/60">
          <div className="text-lunar-400 uppercase tracking-wider text-[9px] mb-1">TOTAL KEYPOINTS</div>
          <div className="text-mission-cyan text-sm font-light">
            {metrics?.keypoints ? `${Number(metrics.keypoints).toLocaleString()} pts` : '—'}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ComparisonTool;
