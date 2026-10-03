import React, { useState } from 'react';

export const PipelineResults = ({ data, isProcessing }) => {
  const [comparisonMode, setComparisonMode] = useState('OVERLAY'); // 'SIDE_BY_SIDE' | 'OVERLAY' | 'DIFFERENCE'
  const [overlayOpacity, setOverlayOpacity] = useState(50);

  if (!data && !isProcessing) {
    return null;
  }

  const metrics = data?.metrics || {};
  const H = metrics?.homography || null;

  return (
    <section id="results-section" className="space-y-12 pt-8">
      {/* Metric Summary */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
          <div className="w-1.5 h-6 bg-cyan-500 rounded-sm shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
          <h2 className="text-2xl font-sans font-bold text-white tracking-wide uppercase">
            ANALYSIS RESULTS
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-[#101A2A]/80 rounded border border-white/10 shadow-lg">
            <p className="text-[10px] text-white/50 uppercase font-mono tracking-widest mb-1">KEYPOINTS</p>
            <p className="text-xl font-mono font-bold text-white">
              {metrics.keypoints ? Number(metrics.keypoints).toLocaleString() : '—'}
            </p>
          </div>
          <div className="p-4 bg-[#101A2A]/80 rounded border border-white/10 shadow-lg">
            <p className="text-[10px] text-white/50 uppercase font-mono tracking-widest mb-1">RANSAC INLIERS</p>
            <p className="text-xl font-mono font-bold text-white">
              {metrics.inliers ? Number(metrics.inliers).toLocaleString() : '—'}
            </p>
          </div>
          <div className="p-4 bg-[#101A2A]/80 rounded border border-white/10 shadow-lg">
            <p className="text-[10px] text-white/50 uppercase font-mono tracking-widest mb-1">INLIER RATIO</p>
            <p className="text-xl font-mono font-bold text-white">
              {metrics.inlier_ratio || '—'}
            </p>
          </div>
          <div className="p-4 bg-[#101A2A]/80 rounded border border-white/10 shadow-lg">
            <p className="text-[10px] text-white/50 uppercase font-mono tracking-widest mb-1">MEAN LK ERROR</p>
            <p className="text-xl font-mono font-bold text-white">
              {metrics.avg_error || '—'}
            </p>
          </div>
          <div className="p-4 bg-[#101A2A]/80 rounded border border-white/10 shadow-lg">
            <p className="text-[10px] text-white/50 uppercase font-mono tracking-widest mb-1">MAX LK ERROR</p>
            <p className="text-xl font-mono font-bold text-white">
              {metrics.max_error || '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analysis Panels */}
      <div className="space-y-16">
        
        {/* SIFT */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
             <h3 className="font-sans font-bold text-lg text-white uppercase tracking-widest">
               SIFT KEYPOINTS
             </h3>
          </div>
          <p className="text-[11px] font-mono text-white/50 uppercase tracking-wider pl-5">
            Difference of Gaussians (DoG) pyramid extrema extraction.
          </p>
          <div className="aspect-video max-h-[600px] w-full bg-[#050810] rounded-xl border border-white/10 overflow-hidden flex items-center justify-center p-2 shadow-inner">
            <img src={data?.sift_viz || data?.sample_image} alt="SIFT Visualization" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* FLANN */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
             <h3 className="font-sans font-bold text-lg text-white uppercase tracking-widest">
               FLANN / KNN MATCHES
             </h3>
          </div>
          <p className="text-[11px] font-mono text-white/50 uppercase tracking-wider pl-5">
            kd-tree nearest-neighbor search with Lowe's ratio test (0.70x).
          </p>
          <div className="aspect-video max-h-[600px] w-full bg-[#050810] rounded-xl border border-white/10 overflow-hidden flex items-center justify-center p-2 shadow-inner">
            <img src={data?.matches_viz || data?.sample_image} alt="FLANN Matches Visualization" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* RANSAC */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
             <h3 className="font-sans font-bold text-lg text-white uppercase tracking-widest">
               RANSAC INLIERS
             </h3>
          </div>
          <p className="text-[11px] font-mono text-white/50 uppercase tracking-wider pl-5">
            Random Sample Consensus for projective geometric outlier rejection.
          </p>
          <div className="aspect-video max-h-[600px] w-full bg-[#050810] rounded-xl border border-white/10 overflow-hidden flex items-center justify-center p-2 shadow-inner">
            <img src={data?.ransac_viz || data?.sample_image} alt="RANSAC Inliers Visualization" className="w-full h-full object-contain" />
          </div>
        </div>

      </div>

      {/* Final Registration Climax */}
      <div className="pt-12 border-t border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-sans font-extrabold text-2xl text-white uppercase tracking-widest flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
              FINAL REGISTERED IMAGE
            </h3>
            <p className="text-sm font-mono text-cyan-400 uppercase tracking-widest pl-6">
              REGISTRATION RESULT
            </p>
            <p className="text-xs text-white/60 pl-6 max-w-2xl font-light leading-relaxed">
              Geometric transformation estimated from matched lunar features and used to align the target observation with the reference frame.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-[#101A2A] rounded border border-white/10">
            {['OVERLAY', 'SIDE_BY_SIDE', 'DIFFERENCE'].map((mode) => (
              <button
                key={mode}
                onClick={() => setComparisonMode(mode)}
                className={`px-4 py-2 rounded font-mono text-[10px] tracking-widest uppercase transition-all ${
                  comparisonMode === mode
                    ? 'bg-cyan-600/30 text-cyan-300 font-bold border border-cyan-500/50'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {mode.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {comparisonMode === 'OVERLAY' && (
          <div className="flex items-center gap-4 bg-[#101A2A]/50 p-4 rounded border border-white/5">
            <span className="text-white/60 font-mono text-xs uppercase tracking-widest">ALPHA BLEND:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
              className="w-64 accent-cyan-500 cursor-pointer"
            />
            <span className="text-cyan-400 font-mono text-xs font-bold w-12 text-right">{overlayOpacity}%</span>
          </div>
        )}

        <div className="w-full aspect-square sm:aspect-video lg:aspect-[21/9] bg-[#050810] rounded-2xl border-2 border-white/10 overflow-hidden relative flex items-center justify-center shadow-2xl">
          {/* subtle coordinate grid */}
          <div className="absolute inset-0 bg-measurement-grid opacity-20 pointer-events-none z-0" />

          {comparisonMode === 'SIDE_BY_SIDE' && (
            <div className="grid grid-cols-2 w-full h-full gap-2 p-2 z-10">
              <div className="relative h-full overflow-hidden flex items-center justify-center bg-black/50 border border-white/5 rounded-lg">
                <img src={data?.sample_image} alt="Sample" className="w-full h-full object-contain filter grayscale" />
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur text-white font-mono text-[10px] px-3 py-1.5 rounded border border-white/10 uppercase tracking-widest">
                  TARGET OBSERVATION
                </div>
              </div>
              <div className="relative h-full overflow-hidden flex items-center justify-center bg-black/50 border border-white/5 rounded-lg">
                <img src={data?.warped_image || data?.reference_image} alt="Warped" className="w-full h-full object-contain" />
                <div className="absolute bottom-4 right-4 bg-cyan-900/80 backdrop-blur text-cyan-50 font-mono text-[10px] px-3 py-1.5 rounded border border-cyan-500/30 uppercase tracking-widest">
                  WARPED ALIGNMENT
                </div>
              </div>
            </div>
          )}

          {comparisonMode === 'OVERLAY' && (
            <div className="relative w-full h-full flex items-center justify-center z-10 p-2">
              <img src={data?.sample_image} alt="Base" className="absolute inset-0 w-full h-full object-contain filter grayscale" />
              <img 
                src={data?.warped_image || data?.reference_image} 
                alt="Overlay" 
                style={{ opacity: overlayOpacity / 100 }}
                className="absolute inset-0 w-full h-full object-contain mix-blend-screen"
              />
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur text-white font-mono text-[10px] px-3 py-1.5 rounded border border-white/10 uppercase tracking-widest">
                TARGET + WARPED ALIGNMENT
              </div>
            </div>
          )}

          {comparisonMode === 'DIFFERENCE' && (
            <div className="relative w-full h-full flex items-center justify-center z-10 p-2">
              <img src={data?.diff_image || data?.warped_image || data?.sample_image} alt="Diff" className="w-full h-full object-contain filter contrast-125 invert mix-blend-difference opacity-80" />
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur text-amber-400 font-mono text-[10px] px-3 py-1.5 rounded border border-amber-500/30 uppercase tracking-widest">
                RESIDUAL DIFFERENCE MAP
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PipelineResults;
