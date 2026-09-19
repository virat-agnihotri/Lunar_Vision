import React from 'react';

export const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-lg border border-surface-border shadow-xl max-w-2xl w-full p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-border pb-4">
          <div>
            <h2 className="text-xl font-sans font-bold text-charcoal-900 tracking-tight">
              About Lunar Vision
            </h2>
            <p className="text-xs text-charcoal-500 mt-1">
              Multi-modal lunar orbital image correspondence and registration system.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-charcoal-400 hover:text-charcoal-700 text-lg font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Project Description */}
        <div className="text-sm text-charcoal-700 space-y-3 leading-relaxed">
          <p>
            <strong>Lunar Vision</strong> is a computer vision application built to align and verify high-resolution multi-temporal lunar observation frames (such as Chandrayaan-2 Optical High Resolution Camera captures).
          </p>
          <p>
            Due to differences in solar incidence angles, orbital viewpoint shifts, and steep crater shadows on the lunar surface, direct pixel matching fails. This system employs an established multi-stage feature extraction, outlier rejection, and optical flow refinement pipeline.
          </p>
        </div>

        {/* 6-Stage Algorithm Pipeline */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-semibold text-charcoal-900 uppercase">
            Computer Vision Architecture
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-surface-muted rounded border border-surface-border">
              <span className="font-semibold text-brand-800">1. Preprocessing:</span> Gaussian filtering (5×5, σ=1.0) removes sensor noise, followed by Contrast Limited Adaptive Histogram Equalization (CLAHE) to reveal low-contrast terrain features inside shadowed regions.
            </div>
            <div className="p-2.5 bg-surface-muted rounded border border-surface-border">
              <span className="font-semibold text-brand-800">2. SIFT Extraction:</span> Identifies scale-space extrema via Difference of Gaussians (DoG) and computes 128-dimensional gradient orientation descriptors invariant to scale, illumination, and rotation.
            </div>
            <div className="p-2.5 bg-surface-muted rounded border border-surface-border">
              <span className="font-semibold text-brand-800">3. FLANN Matching:</span> Fast Library for Approximate Nearest Neighbors with randomized kd-trees. Mismatches are rejected using David Lowe’s distance ratio test (0.70x).
            </div>
            <div className="p-2.5 bg-surface-muted rounded border border-surface-border">
              <span className="font-semibold text-brand-800">4. RANSAC Verification:</span> Iteratively computes the consensus set under an 8-DOF projective constraint, purging non-coplanar and false-positive correspondences.
            </div>
            <div className="p-2.5 bg-surface-muted rounded border border-surface-border">
              <span className="font-semibold text-brand-800">5. Homography Warp:</span> Applies the 3×3 perspective transformation tensor to map the sample coordinates into the reference observation frame.
            </div>
            <div className="p-2.5 bg-surface-muted rounded border border-surface-border">
              <span className="font-semibold text-brand-800">6. Lucas-Kanade Refinement:</span> Multi-level pyramidal optical flow iteratively minimizes gradient residuals to achieve subpixel registration accuracy (&lt; 0.25 px).
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-surface-border pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
