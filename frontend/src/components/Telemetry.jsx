import React from 'react';

export const Stat = ({ label, value, color = 'text-lunar-50' }) => (
  <div className="flex flex-col gap-0.5">
    <span className="telemetry-label">{label}</span>
    <span className={`font-mono text-xs tracking-wider ${color}`}>
      {value}
    </span>
  </div>
);

export const BigStat = ({ label, value, unit = '', subtext = '' }) => {
  return (
    <div className="spatial-glass p-3.5 rounded-sm border border-spatial-glow/60">
      <p className="font-mono text-[9px] text-lunar-400 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-xl sm:text-2xl text-lunar-50 font-light tracking-tight">
          {value !== undefined && value !== null && value !== '' ? value : '—'}
        </span>
        {unit && <span className="font-mono text-[11px] text-lunar-400">{unit}</span>}
      </div>
      {subtext && (
        <p className="font-mono text-[9px] text-lunar-400/80 mt-1">{subtext}</p>
      )}
    </div>
  );
};

export const SpatialTimelineStep = ({ number, label, status, sublabel, onClick, isCurrent, isLast }) => {
  const getStatusBadge = () => {
    if (status === 'COMPLETE') {
      return (
        <span className="flex items-center gap-1 text-[9px] font-mono text-mission-green">
          <span className="w-1.5 h-1.5 rounded-full bg-mission-green shadow-[0_0_6px_#34d399]" />
          DONE
        </span>
      );
    }
    if (status === 'ACTIVE' || isCurrent) {
      return (
        <span className="flex items-center gap-1 text-[9px] font-mono text-mission-amber">
          <span className="w-1.5 h-1.5 rounded-full bg-mission-amber shadow-[0_0_8px_#e2b07e] animate-ping" />
          ACTIVE
        </span>
      );
    }
    return (
      <span className="text-[9px] font-mono text-lunar-400/50">
        QUEUED
      </span>
    );
  };

  return (
    <div className="flex items-center flex-1 min-w-[130px]">
      <div 
        onClick={onClick}
        className={`flex flex-col gap-1 p-2.5 rounded-sm spatial-glass transition-all duration-200 cursor-pointer select-none flex-1 ${
          isCurrent || status === 'ACTIVE'
            ? 'border-mission-amber/80 shadow-[0_0_15px_rgba(226,176,126,0.25)] bg-spatial-indigo/90'
            : status === 'COMPLETE'
            ? 'border-mission-green/40 hover:border-mission-green'
            : 'border-spatial-glow/40 hover:border-spatial-glow opacity-60 hover:opacity-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-lunar-400 tracking-wider">STAGE {number}</span>
          {getStatusBadge()}
        </div>
        <span className={`text-[11px] uppercase tracking-wider font-medium truncate ${
          isCurrent || status === 'ACTIVE' ? 'text-mission-amber' : 'text-lunar-50'
        }`}>
          {label}
        </span>
        {sublabel && (
          <span className="font-mono text-[8px] text-lunar-400/70 tracking-tight truncate">
            {sublabel}
          </span>
        )}
      </div>

      {!isLast && (
        <div className="hidden xl:flex items-center px-1 text-lunar-400/30 text-xs select-none">
          ───
        </div>
      )}
    </div>
  );
};

export const ImageObservationFrame = ({ 
  title, 
  imageSrc, 
  fileName,
  dimensions,
  onFileChange, 
  label = "SELECT IMAGE FILE", 
  alt = "Observation"
}) => {
  return (
    <div className="spatial-glass rounded-sm overflow-hidden flex flex-col h-full border border-spatial-glow/60">
      {/* Frame Header */}
      <div className="flex justify-between items-center px-3.5 py-2.5 border-b border-spatial-glow/40 bg-spatial-void/80">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-mission-amber" />
          <span className="font-sans text-xs tracking-wide text-lunar-100 font-medium">
            {title}
          </span>
        </div>
        {fileName && (
          <span className="font-mono text-[10px] text-lunar-300 max-w-[200px] truncate">
            {fileName}
          </span>
        )}
      </div>

      {/* Image Display Area */}
      <div className="relative aspect-video sm:aspect-[4/3] bg-spatial-void flex items-center justify-center group overflow-hidden cursor-crosshair">
        {imageSrc ? (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <img 
              src={imageSrc} 
              alt={alt}
              className="w-full h-full object-contain filter grayscale contrast-125 brightness-95 rounded-sm"
            />
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-3 cursor-pointer z-10 p-6 text-center w-full h-full">
            <div className="w-10 h-10 rounded-full spatial-glass border border-spatial-glow flex items-center justify-center group-hover:border-mission-amber transition-colors">
              <svg className="w-5 h-5 text-lunar-400 group-hover:text-mission-amber transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-lunar-200 text-xs font-sans font-medium uppercase tracking-wider group-hover:text-mission-amber transition-colors">
                {label}
              </p>
              <span className="text-[10px] font-mono text-lunar-400/60 block mt-1">PNG / JPG / TIFF</span>
            </div>
            {onFileChange && (
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={onFileChange}
              />
            )}
          </label>
        )}
      </div>

      {/* Frame Footer: only show actual dimensions if available */}
      {dimensions && (
        <div className="px-3.5 py-1.5 border-t border-spatial-glow/30 bg-spatial-void/60 flex justify-between font-mono text-[9px] text-lunar-400">
          <span>DIMENSIONS: {dimensions.width} × {dimensions.height} PX</span>
          <span>CHANNELS: 1 (MONOCHROME)</span>
        </div>
      )}
    </div>
  );
};
