import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroVisual from './components/HeroVisual';
import PipelineStrip from './components/PipelineStrip';
import ImageUploadCard from './components/ImageUploadCard';
import PipelineResults from './components/PipelineResults';
import AboutModal from './components/AboutModal';
import { processImages } from './api/imageApi';

export default function App() {
  const [sampleFile, setSampleFile] = useState(null);
  const [referenceFile, setReferenceFile] = useState(null);
  const [samplePreview, setSamplePreview] = useState(null);
  const [referencePreview, setReferencePreview] = useState(null);
  const [sampleInfo, setSampleInfo] = useState(null);
  const [referenceInfo, setReferenceInfo] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Subtle interactive background contour shift based on cursor
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      const normX = (e.clientX - halfW) / halfW;
      const normY = (e.clientY - halfH) / halfH;
      // Very restrained shift: max 6 pixels
      setBgOffset({ x: normX * 6, y: normY * 6 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Measure actual image dimensions when file is chosen
  const handleSampleSelect = (file) => {
    setSampleFile(file);
    const url = URL.createObjectURL(file);
    setSamplePreview(url);
    const img = new Image();
    img.onload = () => {
      setSampleInfo({
        name: file.name,
        size: file.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = url;
  };

  const handleReferenceSelect = (file) => {
    setReferenceFile(file);
    const url = URL.createObjectURL(file);
    setReferencePreview(url);
    const img = new Image();
    img.onload = () => {
      setReferenceInfo({
        name: file.name,
        size: file.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = url;
  };

  const handleClearSample = () => {
    setSampleFile(null);
    setSamplePreview(null);
    setSampleInfo(null);
  };

  const handleClearReference = () => {
    setReferenceFile(null);
    setReferencePreview(null);
    setReferenceInfo(null);
  };

  // Run backend POST /process-images
  const handleStartAnalysis = async () => {
    if (!sampleFile || !referenceFile) {
      setErrorMessage('Please select both a sample and a reference observation frame.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    try {
      const result = await processImages(sampleFile, referenceFile);
      setAnalysisData(result);
      setIsProcessing(false);
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err) {
      console.warn('Backend connection error:', err);
      setErrorMessage(
        'Could not connect to FastAPI at http://localhost:8000/process-images. Verify backend is running or run the sample pair.'
      );
      setIsProcessing(false);
    }
  };

  // Run with provided demo pair
  const handleRunSamplePair = () => {
    setIsProcessing(true);
    setErrorMessage('');
    setTimeout(() => {
      const mockResult = {
        status: 'VERIFIED',
        sample_image: '/lunar-surface-far.jpg',
        reference_image: '/lunar-surface-far.jpg',
        original_sample: '/lunar-surface-far.jpg',
        gaussian_sample: '/lunar-surface-far.jpg',
        clahe_sample: '/lunar-surface-far.jpg',
        sift_viz: '/lunar-surface-far.jpg',
        matches_viz: '/lunar-surface-far.jpg',
        ransac_viz: '/lunar-surface-far.jpg',
        warped_image: '/lunar-surface-far.jpg',
        overlay_image: '/lunar-surface-far.jpg',
        metrics: {
          keypoints: 58903,
          keypoints_image1: 31204,
          keypoints_image2: 27699,
          good_matches: 10375,
          inliers: 4581,
          outliers: 5794,
          inlier_ratio: '44.1%',
          avg_error: '0.247 px',
          max_error: '1.420 px',
          successful_refinements: 4520,
          failed_refinements: 61,
          homography: [
            [1.0004051, -0.0009669, 0.4479901],
            [0.0008885, 0.9997861, -0.6385153],
            [0.0000004, -0.0000004, 1.0000000],
          ],
        },
      };
      setAnalysisData(mockResult);
      setIsProcessing(false);
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }, 1000);
  };

  const handleReset = () => {
    handleClearSample();
    handleClearReference();
    setAnalysisData(null);
    setErrorMessage('');
  };

  const scrollToAnalysis = () => {
    document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const canAnalyze = Boolean(sampleFile && referenceFile && !isProcessing);

  return (
    <div className="relative min-h-screen bg-scientific-atmosphere text-charcoal-900 flex flex-col selection:bg-brand-100 selection:text-brand-900">
      {/* Background Topographic Contour & Coordinate Grid Layer (Shifts slightly with cursor) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-topographic-contours bg-measurement-grid opacity-75 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${bgOffset.x}px, ${bgOffset.y}px)`,
        }}
      />

      {/* 1. Header Navigation */}
      <Navbar
        onOpenAbout={() => setIsAboutOpen(true)}
        onScrollToAnalysis={scrollToAnalysis}
      />

      {/* 2. Hero Section with Topographic Diagram Composition */}
      <section className="relative z-10 border-b border-surface-border py-12 sm:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              {/* Technical Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-50 border border-brand-200 text-xs font-mono text-brand-800 font-semibold tracking-wide">
                <span>[ OPENCV · FASTAPI · COMPUTER VISION ]</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl font-sans font-extrabold text-charcoal-900 tracking-tight leading-[1.08]">
                LUNAR VISION
              </h1>

              {/* Subtitle */}
              <p className="font-mono text-xs sm:text-sm text-brand-700 font-semibold tracking-wider uppercase">
                MULTI-MODAL LUNAR IMAGE CORRESPONDENCE USING COMPUTER VISION
              </p>

              {/* Concise 2-3 line narrative */}
              <p className="text-base text-charcoal-700 leading-relaxed font-normal max-w-xl">
                An optical image registration system establishing high-precision subpixel correspondence between lunar orbital observations across varying illumination, steep crater shadows, and viewpoint shifts.
              </p>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <button
                  onClick={scrollToAnalysis}
                  className="px-7 py-3.5 rounded font-sans font-semibold text-xs tracking-wider uppercase text-white bg-brand-700 hover:bg-brand-800 transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2.5 group"
                >
                  <span>BEGIN ANALYSIS</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">↓</span>
                </button>
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="px-6 py-3.5 rounded font-sans font-semibold text-xs tracking-wider uppercase text-charcoal-700 bg-white hover:bg-surface-bg border border-surface-borderDark transition-colors shadow-xs cursor-pointer"
                >
                  VIEW PIPELINE ARCHITECTURE
                </button>
              </div>
            </div>

            {/* Right Column: Abstract Lunar Topographic Visual Diagram */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Horizontal Feature Strip (Pipeline Summary) */}
      <div className="relative z-10">
        <PipelineStrip />
      </div>

      {/* 4. Main Analysis Workspace */}
      <main id="analysis-section" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-8">
        {/* Section Heading with Blue Indicator Accent */}
        <div className="flex flex-wrap justify-between items-end gap-4 border-b border-surface-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-brand-700 rounded-full" />
            <div>
              <h2 className="text-2xl font-sans font-bold text-charcoal-900 tracking-tight">
                IMAGE CORRESPONDENCE ANALYSIS
              </h2>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Upload two lunar observation frames to execute feature matching and geometric homography.
              </p>
            </div>
          </div>

          {(sampleFile || referenceFile || analysisData) && (
            <button
              onClick={handleReset}
              className="text-xs font-semibold font-mono text-charcoal-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Reset Session
            </button>
          )}
        </div>

        {/* Dual Observation Upload Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploadCard
            title="SAMPLE OBSERVATION"
            subtitle="Target observation frame requiring perspective alignment"
            accentColor="blue"
            imageSrc={samplePreview}
            fileInfo={sampleInfo}
            onFileSelect={handleSampleSelect}
            onClear={handleClearSample}
          />

          <ImageUploadCard
            title="REFERENCE OBSERVATION"
            subtitle="Reference orbital baseline image for geometric ground truth"
            accentColor="indigo"
            imageSrc={referencePreview}
            fileInfo={referenceInfo}
            onFileSelect={handleReferenceSelect}
            onClear={handleClearReference}
          />
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded bg-red-50 border border-red-200 text-xs font-mono text-red-800 flex items-start justify-between gap-3 shadow-xs">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="font-bold text-red-600">✕</button>
          </div>
        )}

        {/* Process Action Bar */}
        <div className="scientific-card p-6 bg-white border border-surface-border flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div>
            <p className="text-sm font-bold text-charcoal-900">
              {canAnalyze
                ? 'Ready to execute correspondence pipeline'
                : 'Upload both observation frames to begin analysis'}
            </p>
            <p className="text-xs text-charcoal-500 mt-0.5">
              The frames will pass through SIFT feature detection, FLANN matching, RANSAC, and subpixel LK refinement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={!canAnalyze}
              onClick={handleStartAnalysis}
              className={`px-8 py-3.5 rounded font-sans font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-sm ${
                canAnalyze
                  ? 'bg-brand-700 hover:bg-brand-800 text-white'
                  : 'bg-surface-muted border border-surface-border text-charcoal-400 cursor-not-allowed opacity-60'
              }`}
            >
              {isProcessing ? 'CALCULATING PIPELINE...' : 'BEGIN CORRESPONDENCE ANALYSIS →'}
            </button>

            <button
              onClick={handleRunSamplePair}
              className="px-5 py-3.5 rounded font-mono text-xs font-semibold text-charcoal-700 bg-surface-muted hover:bg-surface-border border border-surface-border transition-colors cursor-pointer"
            >
              ⚡ Run Sample Pair
            </button>
          </div>
        </div>

        {/* 5. Comprehensive Pipeline Results View */}
        <PipelineResults data={analysisData} isProcessing={isProcessing} />
      </main>

      {/* 6. Clean Scientific Footer */}
      <footer className="relative z-10 bg-white border-t border-surface-border py-6 mt-16 shadow-[0_-1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-charcoal-500">
          <div>LUNAR VISION • MULTI-MODAL LUNAR IMAGE CORRESPONDENCE</div>
          <div>COMPUTER VISION • SIFT • FLANN • RANSAC • HOMOGRAPHY</div>
        </div>
      </footer>

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
