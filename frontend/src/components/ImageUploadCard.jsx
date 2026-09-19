import React, { useRef } from 'react';

export const ImageUploadCard = ({
  title,
  subtitle,
  accentColor = 'blue', // 'blue' | 'indigo'
  imageSrc,
  fileInfo,
  onFileSelect,
  onClear,
}) => {
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const topBarClass = accentColor === 'indigo'
    ? 'bg-gradient-to-r from-indigo-600 to-indigo-800'
    : 'bg-gradient-to-r from-brand-600 to-cyan-600';

  const imageBorderClass = accentColor === 'indigo'
    ? 'border-indigo-200'
    : 'border-brand-200';

  return (
    <div className="scientific-card overflow-hidden flex flex-col h-full shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {/* Top Accent Color Bar */}
      <div className={`h-1.5 w-full ${topBarClass}`} />

      {/* Header */}
      <div className="px-5 py-3.5 border-b border-surface-border bg-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${accentColor === 'indigo' ? 'bg-indigo-600' : 'bg-brand-600'}`} />
            <h3 className="font-sans font-bold text-xs text-charcoal-900 uppercase tracking-wider">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-[11px] text-charcoal-500 font-normal mt-0.5 pl-4">
              {subtitle}
            </p>
          )}
        </div>
        {imageSrc && (
          <button
            onClick={onClear}
            className="text-xs text-charcoal-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
          >
            Change Image
          </button>
        )}
      </div>

      {/* Upload Zone / Active Image Area */}
      <div className="p-5 flex-1 flex flex-col justify-center bg-surface-bg/60">
        {imageSrc ? (
          <div className={`relative aspect-video sm:aspect-[4/3] bg-white rounded border-2 ${imageBorderClass} overflow-hidden flex items-center justify-center shadow-sm`}>
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-contain filter contrast-105"
            />
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-surface-borderDark hover:border-brand-600 rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-white hover:bg-brand-50/30 transition-all aspect-video sm:aspect-[4/3] group"
          >
            {/* Scientific Lunar Feature Grid Icon */}
            <div className="w-14 h-14 rounded-full bg-brand-50 border border-brand-200/80 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <svg className="w-7 h-7 text-brand-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="1.5" strokeDasharray="3 2" />
                <circle cx="12" cy="12" r="4" strokeWidth="1.2" />
                <path d="M12 3v3m0 12v3M3 12h3m12 0h3" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9" cy="9" r="1" fill="currentColor" />
                <circle cx="15" cy="14" r="1.2" fill="currentColor" />
              </svg>
            </div>
            
            <p className="text-sm font-semibold text-charcoal-900 group-hover:text-brand-700 transition-colors">
              Select or Drop Observation
            </p>
            <p className="text-xs text-charcoal-500 mt-1 font-normal max-w-xs">
              Upload raw or calibrated optical lunar frame (PNG, JPG, TIFF)
            </p>
            <span className="mt-3 inline-block font-mono text-[10px] text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded">
              BROWSE LOCAL FILE
            </span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />
      </div>

      {/* Real Metadata Readout */}
      {fileInfo && (
        <div className="px-5 py-3 bg-white border-t border-surface-border text-xs font-mono text-charcoal-700 grid grid-cols-2 gap-2">
          <div className="truncate">
            <span className="text-charcoal-400">File: </span>
            <span className="font-semibold text-charcoal-900">{fileInfo.name}</span>
          </div>
          <div className="text-right">
            <span className="text-charcoal-400">Size: </span>
            <span>{formatFileSize(fileInfo.size)}</span>
          </div>
          {fileInfo.width && (
            <div className="col-span-2 pt-1.5 border-t border-surface-border/60 flex justify-between items-center">
              <span className="text-charcoal-400">Resolution:</span>
              <span className="font-bold text-brand-700 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                {fileInfo.width} × {fileInfo.height} px
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadCard;
