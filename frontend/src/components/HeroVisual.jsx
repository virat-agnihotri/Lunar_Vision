import React from 'react';
import { LunarGlobe3D } from './LunarGlobe3D';

export const HeroVisual = () => {
  return (
    <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center select-none">
      {/* Subtle outer coordinate ring */}
      <div className="absolute inset-0 rounded-full border border-dashed border-brand-200 animate-[spin_120s_linear_infinite]" />

      {/* Main Lunar Topographic 3D Disc Viewport */}
      <div className="relative w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] rounded-full bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50 border border-brand-200/90 shadow-[0_16px_45px_-12px_rgba(29,78,216,0.14)] overflow-hidden flex items-center justify-center">
        {/* Fine measurement grid inside disc */}
        <div className="absolute inset-0 bg-measurement-grid opacity-40 pointer-events-none" />

        {/* 3D Moon Model Canvas */}
        <LunarGlobe3D />
      </div>

      {/* Cardinal Direction Marks */}
      <span className="absolute top-2 font-mono text-[9px] text-charcoal-400">000°</span>
      <span className="absolute bottom-2 font-mono text-[9px] text-charcoal-400">180°</span>
      <span className="absolute left-2 font-mono text-[9px] text-charcoal-400">270°</span>
      <span className="absolute right-2 font-mono text-[9px] text-charcoal-400">090°</span>
    </div>
  );
};

export default HeroVisual;

