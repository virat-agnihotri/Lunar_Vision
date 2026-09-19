import React from 'react';

export const Navbar = ({ onOpenAbout, onScrollToAnalysis }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with Gradient Mark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-sm">
            LV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-base text-charcoal-900 tracking-tight">
                LUNAR VISION
              </span>
              <span className="hidden md:inline-block text-[11px] font-mono text-cyan-700 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded">
                CV PIPELINE
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-charcoal-500 font-normal">
              Lunar Image Correspondence System
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <button
            onClick={onScrollToAnalysis}
            className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 hover:text-brand-700 transition-colors cursor-pointer"
          >
            Analysis
          </button>
          <button
            onClick={onOpenAbout}
            className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 hover:text-brand-700 transition-colors cursor-pointer"
          >
            Architecture
          </button>
        </nav>
      </div>

      {/* Thin Colored Scientific Accent Line Underneath */}
      <div className="h-[2px] w-full bg-gradient-to-r from-brand-700 via-cyan-500 to-brand-800" />
    </header>
  );
};

export default Navbar;
