import React from 'react';

export const Navbar = ({ onOpenAbout, onScrollToAnalysis }) => {
  return (
    <div className="w-full pt-4 px-4 sm:px-6 lg:px-8 z-40 fixed top-0">
      <header className="max-w-7xl mx-auto rounded-2xl bg-[#101A2A]/70 backdrop-blur-md border border-white/10 shadow-lg px-6 h-16 flex items-center justify-between">
        {/* Left Side: Brand */}
        <div className="flex items-center gap-4">
          {/* Logo / Icon - Abstract Orbital */}
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white font-bold text-sm shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            LV
            <div className="absolute w-[120%] h-[120%] rounded-[50%] border border-cyan-500/30 transform rotate-12 scale-110"></div>
          </div>
          
          <div className="flex flex-col justify-center">
            <span className="font-sans font-bold text-lg text-white tracking-wide leading-tight">
              LUNAR VISION
            </span>
            <span className="text-[10px] text-white/50 font-medium tracking-wider uppercase">
              Lunar Image Correspondence System
            </span>
          </div>
        </div>

        {/* Right Side: Navigation Links */}
        <nav className="flex items-center gap-8">
          <button
            onClick={onScrollToAnalysis}
            className="text-[11px] font-semibold uppercase tracking-widest text-white/70 hover:text-white transition-colors cursor-pointer relative group"
          >
            Analysis
            <span className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full group-hover:left-0 rounded-full"></span>
          </button>
          <button
            onClick={onOpenAbout}
            className="text-[11px] font-semibold uppercase tracking-widest text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Architecture
          </button>
          <button className="text-[11px] font-semibold uppercase tracking-widest text-white/70 hover:text-white transition-colors cursor-pointer">
            Dataset
          </button>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
