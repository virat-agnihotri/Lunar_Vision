import React from 'react';
import { LunarGlobe3D } from './LunarGlobe3D';

export const HeroVisual = () => {
  return (
    <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center select-none pt-12 lg:pt-0">
      {/* Outer orbital boundary rings */}
      <div className="absolute inset-4 rounded-full border border-white/5" />
      <div className="absolute inset-8 rounded-full border border-dashed border-cyan-500/20 animate-[spin_120s_linear_infinite]" />

      {/* Main Scientific Visualization Viewport */}
      <div className="relative w-[340px] h-[340px] rounded-full bg-surface-card border border-white/10 shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)] overflow-hidden flex items-center justify-center">
        {/* 3D Moon Model Canvas */}
        <LunarGlobe3D />

        {/* Subtle coordinate overlay */}
        <div className="absolute inset-0 bg-measurement-grid opacity-30 pointer-events-none" />
        
        {/* Cyan boundary lines */}
        <div className="absolute w-[80%] h-[80%] rounded-full border border-cyan-500/30 opacity-60" />
      </div>

      {/* Technical Labels (Clearly UI, not fake data) */}
      <div className="absolute bottom-4 bg-[#101A2A]/80 backdrop-blur border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
        <span className="font-mono text-[9px] text-white/80 font-semibold tracking-wider">REFERENCE DATASET</span>
        <span className="font-mono text-[9px] text-white/40">·</span>
        <span className="font-mono text-[9px] text-white/40 tracking-wider">OPTICAL IMAGERY</span>
      </div>

      {/* Orbital / Coordinate Marks */}
      <span className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-white/30">000°</span>
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-white/30">180°</span>
      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-mono text-[9px] text-white/30">270°</span>
      <span className="absolute right-6 top-1/2 -translate-y-1/2 font-mono text-[9px] text-white/30">090°</span>
    </div>
  );
};

export default HeroVisual;

