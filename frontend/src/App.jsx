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
      // Very restrained shift
      setBgOffset({ x: normX * 6, y: normY * 6 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSampleSelect = (file) => {
    setSampleFile(file);
    const url = URL.createObjectURL(file);
    setSamplePreview(url);
    const img = new Image();
    img.onload = () => {
      setSampleInfo({ name: file.name, size: file.size, width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  };

  const handleReferenceSelect = (file) => {
    setReferenceFile(file);
    const url = URL.createObjectURL(file);
    setReferencePreview(url);
    const img = new Image();
    img.onload = () => {
      setReferenceInfo({ name: file.name, size: file.size, width: img.naturalWidth, height: img.naturalHeight });
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
      setErrorMessage('Could not connect to backend. Processing failed.');
      setIsProcessing(false);
    }
  };

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
    <div className="relative min-h-screen bg-scientific-atmosphere text-white flex flex-col selection:bg-cyan-500/30 selection:text-cyan-50">
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-measurement-grid opacity-20 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${bgOffset.x}px, ${bgOffset.y}px)` }}
      />

      <Navbar onOpenAbout={() => setIsAboutOpen(true)} onScrollToAnalysis={scrollToAnalysis} />

      <section className="relative z-10 py-24 sm:py-32 overflow-hidden border-b border-white/5 bg-gradient-to-b from-transparent to-[#101A2A]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-900/20 border border-cyan-500/20 text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                System Ready
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-7xl font-sans font-extrabold text-white tracking-tight leading-[1.05]">
                  LUNAR VISION
                </h1>
                <p className="font-mono text-xs sm:text-sm text-cyan-500 font-semibold tracking-[0.2em] uppercase">
                  LUNAR IMAGE CORRESPONDENCE & REGISTRATION
                </p>
              </div>

              <p className="text-lg text-white/70 leading-relaxed font-light max-w-xl">
                Feature-based registration of lunar surface imagery using SIFT, FLANN, RANSAC and homography estimation.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-6">
                <button
                  onClick={scrollToAnalysis}
                  className="px-8 py-4 rounded bg-cyan-600 hover:bg-cyan-500 font-sans font-bold text-xs tracking-[0.15em] uppercase text-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] cursor-pointer flex items-center gap-3 group border border-cyan-400/50"
                >
                  <span>BEGIN ANALYSIS</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="px-8 py-4 rounded bg-[#101A2A]/80 hover:bg-[#162235] font-sans font-bold text-xs tracking-[0.15em] uppercase text-white/80 hover:text-white border border-white/10 transition-all cursor-pointer backdrop-blur shadow-sm"
                >
                  VIEW PIPELINE
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 border-b border-white/5">
        <PipelineStrip />
      </div>

      <main id="analysis-section" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 w-full space-y-12">
        <div className="flex flex-wrap justify-between items-end gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-cyan-500 rounded-sm shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
            <div>
              <h2 className="text-3xl font-sans font-bold text-white tracking-wide uppercase">
                ANALYSIS — OBSERVATION INPUTS
              </h2>
            </div>
          </div>

          {(sampleFile || referenceFile || analysisData) && (
            <button
              onClick={handleReset}
              className="text-xs font-semibold font-mono text-white/50 hover:text-red-400 transition-colors cursor-pointer uppercase tracking-wider"
            >
              Reset Session
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploadCard
            title="TARGET IMAGE"
            subtitle="Target observation frame requiring perspective alignment"
            accentColor="blue"
            imageSrc={samplePreview}
            fileInfo={sampleInfo}
            onFileSelect={handleSampleSelect}
            onClear={handleClearSample}
          />
          <ImageUploadCard
            title="REFERENCE IMAGE"
            subtitle="Reference orbital baseline image for geometric ground truth"
            accentColor="indigo"
            imageSrc={referencePreview}
            fileInfo={referenceInfo}
            onFileSelect={handleReferenceSelect}
            onClear={handleClearReference}
          />
        </div>

        {errorMessage && (
          <div className="p-4 rounded-lg bg-red-950/50 border border-red-500/30 text-xs font-mono text-red-200 flex items-start justify-between gap-3 shadow-lg backdrop-blur">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="font-bold text-red-400 hover:text-red-300">✕</button>
          </div>
        )}

        <div className="scientific-card p-8 bg-[#101A2A]/80 flex flex-wrap items-center justify-between gap-6 shadow-xl border-t border-white/10">
          <div>
            <p className="text-lg font-bold text-white uppercase tracking-wider">
              {canAnalyze ? 'READY FOR PROCESSING' : 'AWAITING DATA INPUT'}
            </p>
            <p className="text-xs text-white/50 mt-1 font-mono uppercase tracking-widest">
              {canAnalyze ? 'Target and Reference images loaded' : 'Upload both images to enable the pipeline'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleRunSamplePair}
              className="px-6 py-4 rounded font-mono text-xs font-bold text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer uppercase tracking-widest"
            >
              Run Demo Data
            </button>
            <button
              disabled={!canAnalyze}
              onClick={handleStartAnalysis}
              className={`px-10 py-4 rounded font-sans font-bold text-sm tracking-[0.2em] uppercase transition-all cursor-pointer shadow-lg flex items-center justify-center min-w-[280px] ${
                canAnalyze
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-3">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  PROCESSING...
                </span>
              ) : 'PROCESS IMAGES'}
            </button>
          </div>
        </div>

        <PipelineResults data={analysisData} isProcessing={isProcessing} />
      </main>

      <footer className="relative z-10 bg-[#0B1220] border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-white/40 tracking-widest uppercase">
          <div>LUNAR VISION • SCIENTIFIC VISUALIZATION</div>
          <div>SIFT • FLANN • RANSAC • HOMOGRAPHY</div>
        </div>
      </footer>
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
