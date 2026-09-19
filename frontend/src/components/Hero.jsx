import React from 'react';
import { motion } from 'framer-motion';

export const Hero = ({ onStart }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-12 lg:p-16 z-10 select-none overflow-hidden">
      {/* Top Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-mission-amber" />
          <span className="font-mono text-xs tracking-widest text-lunar-200 uppercase">
            CHANDRAYAAN-2 OPTICAL IMAGERY
          </span>
        </div>
      </motion.header>

      {/* Main Hero Content (Clean Left Placement, Leaving Right Clear for the Moon) */}
      <div className="my-auto max-w-2xl py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Main Title: Medium/Semi-Bold Inter with High Contrast */}
          <div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-sans font-semibold text-white tracking-tight leading-[1.05]">
              LUNAR<br />VISION
            </h1>
          </div>

          {/* Subtitle */}
          <p className="font-mono text-xs sm:text-sm text-mission-amber tracking-wider uppercase font-medium">
            MULTI-MODAL LUNAR IMAGE CORRESPONDENCE
          </p>

          {/* Clear, Legible Narrative Description */}
          <p className="text-base sm:text-lg text-lunar-200 font-normal leading-relaxed max-w-lg">
            High-precision optical surface registration and feature correspondence for lunar orbital observations.
          </p>

          {/* Primary Action Button */}
          <div className="pt-4">
            <button
              onClick={onStart}
              className="px-8 py-4 rounded-sm font-sans font-medium text-sm text-white bg-spatial-indigo hover:bg-lunar-800 border border-mission-amber/60 hover:border-mission-amber transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer flex items-center gap-3 group"
            >
              <span>BEGIN ANALYSIS</span>
              <span className="text-mission-amber group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Clean Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="pt-4 border-t border-lunar-800/50 flex items-center justify-between text-xs font-mono text-lunar-400"
      >
        <span>LUNAR SURFACE REGISTRATION SYSTEM</span>
        <span>SIFT • FLANN • RANSAC • HOMOGRAPHY</span>
      </motion.footer>
    </div>
  );
};

export default Hero;
