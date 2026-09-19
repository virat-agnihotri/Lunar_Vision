import React from 'react';

export const PipelineStrip = () => {
  const steps = [
    { num: '01', title: 'PREPROCESSING', detail: 'Gaussian + CLAHE' },
    { num: '02', title: 'SIFT', detail: 'DoG Extrema' },
    { num: '03', title: 'FLANN / KNN', detail: 'Lowe Ratio 0.70' },
    { num: '04', title: 'RANSAC', detail: 'Outlier Rejection' },
    { num: '05', title: 'HOMOGRAPHY', detail: '8-DOF Warp' },
    { num: '06', title: 'LK REFINEMENT', detail: 'Subpixel Optical Flow' },
  ];

  return (
    <div className="w-full bg-white border-y border-surface-border py-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-2">
          {steps.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-1.5 py-0.5 rounded">
                  {step.num}
                </span>
                <div>
                  <span className="font-sans font-semibold text-xs text-charcoal-900 tracking-wide block">
                    {step.title}
                  </span>
                  <span className="font-mono text-[10px] text-charcoal-500 block">
                    {step.detail}
                  </span>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <span className="hidden lg:inline-block text-brand-300 font-bold select-none text-sm">
                  →
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PipelineStrip;
