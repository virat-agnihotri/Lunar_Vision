import React from 'react';

export const PipelineStrip = () => {
  const steps = [
    { num: '01', title: 'PREPROCESSING', detail: 'Gaussian + CLAHE' },
    { num: '02', title: 'SIFT', detail: 'DoG Extrema' },
    { num: '03', title: 'FLANN / KNN', detail: 'Lowe Ratio 0.70' },
    { num: '04', title: 'RANSAC', detail: 'Outlier Rejection' },
    { num: '05', title: 'HOMOGRAPHY', detail: '8-DOF Warp' },
    { num: '06', title: 'LK REFINEMENT', detail: 'Subpixel Flow' },
  ];

  return (
    <div className="w-full bg-[#0B1220]/80 backdrop-blur border-y border-white/5 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-2">
          {steps.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] font-bold text-cyan-400 bg-cyan-900/30 border border-cyan-500/30 px-1.5 py-1 rounded shadow-inner">
                  {step.num}
                </span>
                <div>
                  <span className="font-sans font-bold text-[11px] text-white tracking-widest block uppercase">
                    {step.title}
                  </span>
                  <span className="font-mono text-[9px] text-white/40 tracking-wider block uppercase">
                    {step.detail}
                  </span>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-cyan-500/20"></span>
                  <span className="w-1 h-1 rounded-full bg-cyan-500/50"></span>
                  <span className="w-1 h-1 rounded-full bg-cyan-500"></span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PipelineStrip;
