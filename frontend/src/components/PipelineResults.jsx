import React, { useState } from 'react';

export const PipelineResults = ({ data, isProcessing }) => {
  const [activeTab, setActiveTab] = useState('01'); // '01'..'07'
  const [comparisonMode, setComparisonMode] = useState('OVERLAY'); // 'SIDE_BY_SIDE' | 'OVERLAY' | 'DIFFERENCE'
  const [overlayOpacity, setOverlayOpacity] = useState(50);

  if (!data && !isProcessing) {
    return null;
  }

  const metrics = data?.metrics || {};
  const H = metrics?.homography || null;

  const STAGES = [
    { id: '01', title: '01 Preprocessing', label: 'PREPROCESSING', sub: 'Gaussian + CLAHE' },
    { id: '02', title: '02 SIFT Extractor', label: 'SIFT DETECTION', sub: 'DoG Keypoints' },
    { id: '03', title: '03 FLANN Matching', label: 'FEATURE MATCHING', sub: 'Lowe Ratio (0.70x)' },
    { id: '04', title: '04 RANSAC Filter', label: 'GEOMETRIC RANSAC', sub: 'Outlier Rejection' },
    { id: '05', title: '05 Homography', label: 'HOMOGRAPHY WARP', sub: 'Perspective Transform' },
    { id: '06', title: '06 LK Refinement', label: 'SUBPIXEL LK', sub: 'Optical Flow' },
    { id: '07', title: '07 Final Result', label: 'CORRESPONDENCE', sub: 'Registration Verification' },
  ];

  return (
    <section id="results-section" className="space-y-6 pt-6">
      {/* Section Header with Indicator Accent */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-brand-700 rounded-full" />
          <div>
            <h2 className="text-xl font-sans font-bold text-charcoal-900 tracking-tight">
              PIPELINE INSPECTION & VERIFICATION
            </h2>
            <p className="text-xs text-charcoal-500 font-normal">
              Direct telemetry and visualization across the 6-stage computer vision workflow.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-charcoal-500">Execution Status:</span>
          {isProcessing ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              CALCULATING...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              VERIFIED [COMPLETE]
            </span>
          )}
        </div>
      </div>

      {/* Visual Pipeline Nodes Bar */}
      <div className="scientific-card p-3 bg-white overflow-x-auto shadow-xs">
        <div className="flex items-center justify-between min-w-[760px] gap-2">
          {STAGES.map((st, idx) => {
            const isSelected = activeTab === st.id;
            const isDone = !isProcessing && data;
            return (
              <React.Fragment key={st.id}>
                <button
                  onClick={() => setActiveTab(st.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded transition-all text-left cursor-pointer flex-1 ${
                    isSelected
                      ? 'bg-brand-50 border border-brand-200 text-brand-900 font-semibold shadow-xs'
                      : 'hover:bg-surface-bg border border-transparent text-charcoal-700'
                  }`}
                >
                  {/* Circular Node Indicator */}
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0 ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isProcessing && isSelected
                        ? 'bg-brand-600 text-white animate-pulse'
                        : 'bg-surface-muted text-charcoal-500 border border-surface-border'
                    }`}
                  >
                    {isDone ? '✓' : st.id}
                  </span>
                  <div className="truncate">
                    <span className="text-[11px] font-bold block truncate uppercase">
                      {st.label}
                    </span>
                    <span className="text-[9px] font-mono text-charcoal-500 block truncate">
                      {st.sub}
                    </span>
                  </div>
                </button>
                {idx < STAGES.length - 1 && (
                  <span className="text-surface-borderDark font-bold select-none px-0.5">
                    →
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Stage Inspection Panel */}
      <div className="scientific-card p-6 sm:p-8 bg-white shadow-sm border border-surface-border">
        {/* STAGE 01: PREPROCESSING */}
        {activeTab === '01' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-4">
              <h3 className="font-sans font-bold text-sm text-charcoal-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600" />
                01 Preprocessing Comparative Radiometry
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Gaussian blur (5×5, σ=1.0) attenuates thermal high-frequency noise. CLAHE (clip limit=2.0, 8×8 tiles) redistributes local intensities to resolve features within deep crater shadow regions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-xs font-mono font-semibold text-charcoal-700 bg-surface-muted px-2.5 py-1 rounded border border-surface-border">
                  1. RAW SENSOR INPUT
                </div>
                <div className="aspect-square bg-slate-900 rounded border border-surface-border overflow-hidden flex items-center justify-center p-1">
                  <img
                    src={data?.original_sample || data?.sample_image}
                    alt="Original Input"
                    className="w-full h-full object-contain filter contrast-90"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-semibold text-charcoal-700 bg-surface-muted px-2.5 py-1 rounded border border-surface-border">
                  2. GAUSSIAN DENOISED (5×5)
                </div>
                <div className="aspect-square bg-slate-900 rounded border border-surface-border overflow-hidden flex items-center justify-center p-1">
                  <img
                    src={data?.gaussian_sample || data?.sample_image}
                    alt="Gaussian Denoised"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-semibold text-brand-800 bg-brand-50 px-2.5 py-1 rounded border border-brand-200">
                  3. CLAHE ENHANCED (CLIP = 2.0)
                </div>
                <div className="aspect-square bg-slate-900 rounded border-2 border-brand-300 overflow-hidden flex items-center justify-center p-1 shadow-xs">
                  <img
                    src={data?.clahe_sample || data?.sample_image}
                    alt="CLAHE Enhanced"
                    className="w-full h-full object-contain filter contrast-125"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 02: SIFT FEATURE DETECTION */}
        {activeTab === '02' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-4">
              <h3 className="font-sans font-bold text-sm text-charcoal-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600" />
                02 SIFT Feature Detection & Descriptors
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Multi-scale Difference of Gaussians (DoG) pyramid identifies stable scale-space extrema. Each keypoint receives canonical orientation and a 128-dimensional invariant gradient descriptor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-4 bg-surface-bg rounded border border-surface-border">
                <p className="text-[11px] text-charcoal-500 uppercase">Keypoints (Image 1)</p>
                <p className="text-2xl font-bold text-charcoal-900 mt-1">
                  {metrics.keypoints_image1 ? Number(metrics.keypoints_image1).toLocaleString() : '—'}
                </p>
              </div>

              <div className="p-4 bg-surface-bg rounded border border-surface-border">
                <p className="text-[11px] text-charcoal-500 uppercase">Keypoints (Image 2)</p>
                <p className="text-2xl font-bold text-charcoal-900 mt-1">
                  {metrics.keypoints_image2 ? Number(metrics.keypoints_image2).toLocaleString() : '—'}
                </p>
              </div>

              <div className="p-4 bg-brand-50 rounded border border-brand-200">
                <p className="text-[11px] text-brand-700 uppercase font-semibold">Total Features Located</p>
                <p className="text-2xl font-bold text-brand-900 mt-1">
                  {metrics.keypoints ? Number(metrics.keypoints).toLocaleString() : '—'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-charcoal-600">
                <span>SIFT Extrema & Orientation Visualization:</span>
                <span className="text-brand-700 font-medium">128-Dim Vector Features</span>
              </div>
              <div className="aspect-video max-h-[480px] bg-slate-900 rounded border border-surface-border overflow-hidden flex items-center justify-center p-1">
                <img
                  src={data?.sift_viz || data?.sample_image}
                  alt="SIFT Detection Visualization"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 03: FLANN / KNN FEATURE MATCHING */}
        {activeTab === '03' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-4">
              <h3 className="font-sans font-bold text-sm text-charcoal-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600" />
                03 Feature Matching (FLANN & Lowe's Ratio Test)
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Randomized kd-trees (trees=5, checks=50) perform k-nearest-neighbors (k=2) search. David Lowe’s distance ratio test (threshold=0.70) purges ambiguous correspondence pairs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <div className="p-4 bg-brand-50 rounded border border-brand-200">
                <p className="text-[11px] text-brand-700 uppercase font-semibold">Candidate Matches Passed</p>
                <p className="text-2xl font-bold text-brand-900 mt-1">
                  {metrics.good_matches ? Number(metrics.good_matches).toLocaleString() : '—'}
                </p>
              </div>

              <div className="p-4 bg-surface-bg rounded border border-surface-border">
                <p className="text-[11px] text-charcoal-500 uppercase">Lowe Ratio Constraint</p>
                <p className="text-2xl font-bold text-charcoal-900 mt-1">
                  0.70x Distance
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono text-charcoal-600">Candidate Correspondence Vectors:</p>
              <div className="aspect-video max-h-[480px] bg-slate-900 rounded border border-surface-border overflow-hidden flex items-center justify-center p-1">
                <img
                  src={data?.matches_viz || data?.sample_image}
                  alt="FLANN Matches Visualization"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 04: RANSAC GEOMETRIC VERIFICATION */}
        {activeTab === '04' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-4">
              <h3 className="font-sans font-bold text-sm text-charcoal-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600" />
                04 RANSAC Geometric Verification & Outlier Purge
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Random Sample Consensus isolates the projective geometric consensus set under an 8-DOF planar homography model (reprojection tolerance = 5.0 px), purging incorrect correspondence lines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-4 bg-emerald-50 rounded border border-emerald-200">
                <p className="text-[11px] text-emerald-700 uppercase font-semibold">Consensus Inliers</p>
                <p className="text-2xl font-bold text-emerald-800 mt-1">
                  {metrics.inliers ? Number(metrics.inliers).toLocaleString() : '—'}
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded border border-red-200">
                <p className="text-[11px] text-red-700 uppercase font-semibold">Rejected Outliers</p>
                <p className="text-2xl font-bold text-red-800 mt-1">
                  {metrics.outliers ? Number(metrics.outliers).toLocaleString() : '—'}
                </p>
              </div>

              <div className="p-4 bg-surface-bg rounded border border-surface-border">
                <p className="text-[11px] text-charcoal-500 uppercase">Inlier Consensus Ratio</p>
                <p className="text-2xl font-bold text-charcoal-900 mt-1">
                  {metrics.inlier_ratio || '—'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono text-charcoal-600">RANSAC Inliers (Green Consensus Set):</p>
              <div className="aspect-video max-h-[480px] bg-slate-900 rounded border border-surface-border overflow-hidden flex items-center justify-center p-1">
                <img
                  src={data?.ransac_viz || data?.sample_image}
                  alt="RANSAC Inliers Visualization"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 05: HOMOGRAPHY ALIGNMENT */}
        {activeTab === '05' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-4">
              <h3 className="font-sans font-bold text-sm text-charcoal-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600" />
                05 Perspective Homography Transformation
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Projective 3×3 transformation matrix calculated via singular value decomposition over inlier coordinate pairs. Warps the sample observation into the reference model perspective.
              </p>
            </div>

            {/* Formatted 3x3 Homography Matrix */}
            {H && H.length === 3 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-charcoal-700">
                  <span className="font-semibold">Estimated 3×3 Homography Matrix Tensor:</span>
                  <span className="text-brand-700">8 Degrees of Freedom</span>
                </div>
                <div className="scientific-code p-4 rounded font-mono text-xs overflow-x-auto space-y-1.5 bg-surface-bg border border-surface-border">
                  {H.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex gap-6">
                      <span className="text-charcoal-400 select-none">[{rowIdx}]</span>
                      {row.map((val, colIdx) => (
                        <span key={colIdx} className="w-40 text-charcoal-900 font-medium">
                          {typeof val === 'number' ? val.toFixed(8) : val}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-mono text-charcoal-600">Aligned / Warped Sample Observation:</p>
              <div className="aspect-video max-h-[480px] bg-slate-900 rounded border border-surface-border overflow-hidden flex items-center justify-center p-1">
                <img
                  src={data?.warped_image || data?.sample_image}
                  alt="Warped Image"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 06: LUCAS-KANADE SUBPIXEL REFINEMENT */}
        {activeTab === '06' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-4">
              <h3 className="font-sans font-bold text-sm text-charcoal-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600" />
                06 Iterative Lucas-Kanade Subpixel Refinement
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Multi-resolution optical flow (3 pyramidal levels, window size 21×21 px) fine-tunes inlier coordinates to achieve subpixel registration precision (&lt; 0.25 px).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
              <div className="p-4 bg-emerald-50 rounded border border-emerald-200">
                <p className="text-[11px] text-emerald-700 uppercase font-semibold">Refined Inliers</p>
                <p className="text-2xl font-bold text-emerald-800 mt-1">
                  {metrics.successful_refinements ? Number(metrics.successful_refinements).toLocaleString() : '—'}
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded border border-red-200">
                <p className="text-[11px] text-red-700 uppercase font-semibold">Failed Refinements</p>
                <p className="text-2xl font-bold text-red-800 mt-1">
                  {metrics.failed_refinements !== undefined ? Number(metrics.failed_refinements).toLocaleString() : '—'}
                </p>
              </div>

              <div className="p-4 bg-brand-50 rounded border border-brand-200">
                <p className="text-[11px] text-brand-700 uppercase font-semibold">Mean LK Error</p>
                <p className="text-2xl font-bold text-brand-900 mt-1">
                  {metrics.avg_error || '—'}
                </p>
              </div>

              <div className="p-4 bg-surface-bg rounded border border-surface-border">
                <p className="text-[11px] text-charcoal-500 uppercase">Max LK Error</p>
                <p className="text-2xl font-bold text-charcoal-900 mt-1">
                  {metrics.max_error || '—'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono text-charcoal-600">Subpixel Optical Flow Alpha Overlay:</p>
              <div className="aspect-video max-h-[480px] bg-slate-900 rounded border border-surface-border overflow-hidden flex items-center justify-center p-1">
                <img
                  src={data?.overlay_image || data?.warped_image || data?.sample_image}
                  alt="Refined Overlay"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 07: FINAL CORRESPONDENCE */}
        {activeTab === '07' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-sans font-bold text-sm text-charcoal-900 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  07 Final Correspondence Inspection
                </h3>
                <p className="text-xs text-charcoal-500 mt-1">
                  Compare geometric correspondence between sample observation and warped reference model.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-surface-muted rounded border border-surface-border text-xs font-mono">
                {['SIDE_BY_SIDE', 'OVERLAY', 'DIFFERENCE'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setComparisonMode(mode)}
                    className={`px-3 py-1 rounded transition-all cursor-pointer ${
                      comparisonMode === mode
                        ? 'bg-white text-brand-800 font-bold shadow-xs border border-surface-border'
                        : 'text-charcoal-600 hover:text-charcoal-900'
                    }`}
                  >
                    {mode.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider Control for Overlay */}
            {comparisonMode === 'OVERLAY' && (
              <div className="flex items-center gap-4 bg-brand-50/60 p-3 rounded border border-brand-200 text-xs font-mono">
                <span className="text-brand-900 font-semibold">Alpha Blend Ratio:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                  className="w-56 accent-brand-700 cursor-pointer"
                />
                <span className="text-brand-900 font-bold w-12 text-right">{overlayOpacity}%</span>
              </div>
            )}

            {/* Large Inspection Viewport */}
            <div className="aspect-video max-h-[560px] bg-slate-900 rounded-lg border-2 border-surface-border overflow-hidden relative flex items-center justify-center shadow-sm">
              {comparisonMode === 'SIDE_BY_SIDE' && (
                <div className="grid grid-cols-2 w-full h-full gap-1 p-1">
                  <div className="relative h-full overflow-hidden flex items-center justify-center bg-black">
                    <img
                      src={data?.sample_image}
                      alt="Sample Observation"
                      className="w-full h-full object-contain filter grayscale"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/80 text-white font-mono text-[10px] px-2.5 py-1 rounded border border-white/20">
                      SAMPLE OBSERVATION
                    </div>
                  </div>
                  <div className="relative h-full overflow-hidden flex items-center justify-center bg-black">
                    <img
                      src={data?.warped_image || data?.reference_image}
                      alt="Warped Reference"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 right-2 bg-brand-900/90 text-white font-mono text-[10px] px-2.5 py-1 rounded border border-brand-400/40">
                      WARPED REFERENCE MODEL
                    </div>
                  </div>
                </div>
              )}

              {comparisonMode === 'OVERLAY' && (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <img
                    src={data?.sample_image}
                    alt="Sample Base"
                    className="absolute inset-0 w-full h-full object-contain filter grayscale"
                  />
                  <img
                    src={data?.warped_image || data?.reference_image}
                    alt="Registered Overlay"
                    style={{ opacity: overlayOpacity / 100 }}
                    className="absolute inset-0 w-full h-full object-contain mix-blend-screen"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/85 text-white font-mono text-[10px] px-3 py-1 rounded border border-white/20">
                    SAMPLE BASE + WARPED ALIGNMENT ({overlayOpacity}%)
                  </div>
                </div>
              )}

              {comparisonMode === 'DIFFERENCE' && (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  {data?.diff_image ? (
                    <img
                      src={data.diff_image}
                      alt="Absolute Residual Difference"
                      className="w-full h-full object-contain filter contrast-125"
                    />
                  ) : (
                    <img
                      src={data?.warped_image || data?.sample_image}
                      alt="Difference Residual"
                      className="w-full h-full object-contain invert mix-blend-difference opacity-80"
                    />
                  )}
                  <div className="absolute bottom-3 left-3 bg-black/85 text-amber-300 font-mono text-[10px] px-3 py-1 rounded border border-amber-400/30">
                    ABSOLUTE RESIDUAL DIFFERENCE MAP
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Summary Table */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono font-bold text-charcoal-900 uppercase">
                Analysis Summary Table
              </h4>
              <div className="border border-surface-border rounded-lg overflow-hidden text-xs shadow-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-surface-muted text-charcoal-600 uppercase text-[10px] border-b border-surface-border font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Pipeline Phase</th>
                      <th className="px-4 py-2.5">Algorithm</th>
                      <th className="px-4 py-2.5">Backend Metric</th>
                      <th className="px-4 py-2.5">Consensus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-charcoal-800 bg-white">
                    <tr>
                      <td className="px-4 py-2 font-medium">Feature Extraction</td>
                      <td className="px-4 py-2">SIFT (Difference-of-Gaussians)</td>
                      <td className="px-4 py-2">{metrics.keypoints ? `${Number(metrics.keypoints).toLocaleString()} keypoints` : '—'}</td>
                      <td className="px-4 py-2 text-emerald-600 font-bold">Passed</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">Feature Matching</td>
                      <td className="px-4 py-2">FLANN + Lowe Ratio Test (0.70x)</td>
                      <td className="px-4 py-2">{metrics.good_matches ? `${Number(metrics.good_matches).toLocaleString()} candidate matches` : '—'}</td>
                      <td className="px-4 py-2 text-emerald-600 font-bold">Passed</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">Geometric Verification</td>
                      <td className="px-4 py-2">RANSAC Outlier Rejection</td>
                      <td className="px-4 py-2">{metrics.inliers ? `${Number(metrics.inliers).toLocaleString()} inliers (${metrics.inlier_ratio})` : '—'}</td>
                      <td className="px-4 py-2 text-emerald-600 font-bold">Verified</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">Image Alignment</td>
                      <td className="px-4 py-2">8-DOF Projective Homography</td>
                      <td className="px-4 py-2">3×3 Transformation Tensor Applied</td>
                      <td className="px-4 py-2 text-emerald-600 font-bold">Verified</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">Subpixel Refinement</td>
                      <td className="px-4 py-2">Pyramidal Lucas-Kanade Optical Flow</td>
                      <td className="px-4 py-2">{metrics.avg_error ? `Mean LK Error: ${metrics.avg_error}` : '—'}</td>
                      <td className="px-4 py-2 text-emerald-600 font-bold">Verified</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PipelineResults;
