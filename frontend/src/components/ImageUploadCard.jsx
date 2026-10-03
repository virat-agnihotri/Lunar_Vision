import React, { useRef, useState } from 'react';

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
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const borderAccent = accentColor === 'indigo'
    ? 'border-indigo-500/30'
    : 'border-cyan-500/30';

  const dotAccent = accentColor === 'indigo'
    ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]'
    : 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]';

  return (
    <div className={`scientific-card overflow-hidden flex flex-col h-full ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 bg-[#0B1220]/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${dotAccent}`} />
            <h3 className="font-sans font-bold text-sm text-white uppercase tracking-widest">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-[10px] text-white/50 font-medium mt-1 pl-5 uppercase tracking-wider">
              {subtitle}
            </p>
          )}
        </div>
        {imageSrc && (
          <button
            onClick={() => {
              onClear();
              setZoom(1);
              setIsFullscreen(false);
            }}
            className="text-[10px] font-mono border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-3 py-1.5 rounded transition-colors cursor-pointer uppercase tracking-wider"
          >
            Clear / Change
          </button>
        )}
      </div>

      {/* Upload Zone / Active Image Area */}
      <div className={`p-4 flex-1 flex flex-col justify-center bg-[#0B1220] relative ${isFullscreen ? 'h-full' : ''}`}>
        {imageSrc ? (
          <div className={`relative ${isFullscreen ? 'h-full' : 'h-[400px]'} w-full bg-[#050810] rounded-lg border ${borderAccent} overflow-hidden shadow-inner group flex items-center justify-center`}>
            
            <div className="absolute inset-0 bg-measurement-grid opacity-20 pointer-events-none z-0" />
            
            <div className="relative w-full h-full flex items-center justify-center overflow-auto z-10" style={{ cursor: zoom > 1 ? 'grab' : 'default' }}>
               <img
                  src={imageSrc}
                  alt={title}
                  className="max-w-none transition-transform duration-300 ease-out"
                  style={{
                    transform: `scale(${zoom})`,
                    maxHeight: zoom === 1 ? '100%' : 'none',
                    maxWidth: zoom === 1 ? '100%' : 'none',
                    objectFit: 'contain'
                  }}
                />
            </div>

            {/* Viewer Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#101A2A]/90 backdrop-blur border border-white/10 px-2 py-1.5 rounded shadow-lg z-20">
              <button onClick={() => setZoom(z => Math.max(1, z - 0.5))} className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer text-lg leading-none" title="Zoom Out">-</button>
              <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
              <span className="font-mono text-[10px] text-white/90 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
              <button onClick={() => setZoom(z => z + 0.5)} className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer text-lg leading-none" title="Zoom In">+</button>
              <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
              <button onClick={() => setZoom(1)} className="px-3 h-8 flex items-center justify-center text-[10px] font-mono text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer uppercase tracking-wider" title="Fit to Viewport">FIT</button>
              <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
              <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 h-8 flex items-center justify-center text-[10px] font-mono text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer uppercase tracking-wider" title="Toggle Fullscreen">{isFullscreen ? 'EXIT' : 'FULL'}</button>
            </div>

          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed border-white/20 hover:border-cyan-500/50 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[#101A2A]/40 hover:bg-[#101A2A]/80 transition-all ${isFullscreen ? 'h-full' : 'h-[350px]'} group`}
          >
            {/* Scientific Lunar Feature Grid Icon */}
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner bg-gradient-to-br from-white/5 to-transparent relative">
              <svg className="w-8 h-8 text-cyan-500/80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                <path d="M3 14l5-5 4 4 6-6 3 3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            <p className="font-mono text-xs text-white/70 group-hover:text-cyan-400 transition-colors uppercase tracking-widest font-semibold mb-2">
              UPLOAD OBSERVATION
            </p>
            <p className="text-[10px] text-white/40 max-w-xs uppercase tracking-wider leading-relaxed">
              Accepts high-resolution lunar optical frames (PNG, JPG, TIFF)
            </p>
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
      {fileInfo && !isFullscreen && (
        <div className="px-5 py-3 bg-[#101A2A]/90 border-t border-white/10 text-[10px] font-mono text-white/60 grid grid-cols-2 gap-y-2 gap-x-4 uppercase tracking-wider">
          <div className="truncate flex items-center gap-2">
            <span className="text-white/30">FILE:</span>
            <span className="font-semibold text-white/90 truncate">{fileInfo.name}</span>
          </div>
          <div className="text-right flex items-center justify-end gap-2">
            <span className="text-white/30">SIZE:</span>
            <span className="text-white/90">{formatFileSize(fileInfo.size)}</span>
          </div>
          {fileInfo.width && (
            <div className="col-span-2 pt-2 border-t border-white/5 flex justify-between items-center">
              <span className="text-white/30">NATIVE RESOLUTION:</span>
              <span className="font-bold text-cyan-400 bg-cyan-950/30 border border-cyan-900/50 px-2 py-0.5 rounded shadow-inner">
                {fileInfo.width} × {fileInfo.height} PX
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadCard;
