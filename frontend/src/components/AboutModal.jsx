import React from 'react';

export const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050810]/80 backdrop-blur flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#101A2A] rounded-xl border border-white/10 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-sans font-bold text-white tracking-widest uppercase">
              SYSTEM ARCHITECTURE
            </h2>
            <p className="text-[10px] font-mono text-cyan-500 mt-2 uppercase tracking-widest">
              LUNAR IMAGE CORRESPONDENCE
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-lg font-bold p-1 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Project Description */}
        <div className="text-sm text-white/70 space-y-4 leading-relaxed font-light">
          <p>
            <strong className="text-white font-medium">Lunar Vision</strong> is a computer vision application built to align and verify high-resolution multi-temporal lunar observation frames (such as Chandrayaan-2 Optical High Resolution Camera captures).
          </p>
          <p>
            Due to differences in solar incidence angles, orbital viewpoint shifts, and steep crater shadows on the lunar surface, direct pixel matching fails. This system employs an established multi-stage feature extraction, outlier rejection, and optical flow refinement pipeline.
          </p>
        </div>

        {/* 6-Stage Algorithm Pipeline Diagram */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest border-b border-white/10 pb-2">
            Execution Flow
          </h3>
          <div className="space-y-1 bg-[#050810]/50 p-4 rounded-lg border border-white/5">
            {[
              { role: 'Frontend', text: 'React UI' },
              { role: 'Backend', text: 'FastAPI Integration' },
              { role: 'Stage 1', text: 'Image Preprocessing (Gaussian + CLAHE)' },
              { role: 'Stage 2', text: 'SIFT Feature Extraction' },
              { role: 'Stage 3', text: 'FLANN / KNN Matching' },
              { role: 'Stage 4', text: 'RANSAC Verification' },
              { role: 'Stage 5', text: 'Homography Registration' },
              { role: 'Stage 6', text: 'Subpixel Refinement (Optical Flow)' }
            ].map((node, i, arr) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-16 text-right font-mono text-[9px] text-cyan-500/70 uppercase tracking-widest">
                  {node.role}
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  {i < arr.length - 1 && <div className="w-[1px] h-4 bg-cyan-500/30" />}
                </div>
                <div className="font-mono text-[11px] text-white/80 group-hover:text-white uppercase tracking-wider">
                  {node.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-[10px] font-mono font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded transition-colors cursor-pointer uppercase tracking-widest"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
