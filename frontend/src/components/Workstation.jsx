import React, { useState, useEffect } from 'react';
import { Stat, BigStat, ImageObservationFrame } from './Telemetry';
import AnalysisController from './AnalysisController';
import { processImages } from '../api/imageApi';

export const Workstation = ({ view, data, onUploadComplete, onBackToHero }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [sampleFile, setSampleFile] = useState(null);
  const [referenceFile, setReferenceFile] = useState(null);
  const [samplePreview, setSamplePreview] = useState(null);
  const [referencePreview, setReferencePreview] = useState(null);
  const [sampleDim, setSampleDim] = useState(null);
  const [referenceDim, setReferenceDim] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [utcTime, setUtcTime] = useState('');
  const [activeViewMode, setActiveViewMode] = useState(view === 'ANALYSIS' ? 'PIPELINE' : 'ACQUISITION');
  const [analysisData, setAnalysisData] = useState(data || null);

  // UTC Z-time clock
  useEffect(() => {
    const updateTime = () => {
      setUtcTime(new Date().toISOString().split('T')[1].slice(0, 8) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync data updates
  useEffect(() => {
    if (data) {
      setAnalysisData(data);
      if (data.sample_image) setSamplePreview(data.sample_image);
      if (data.reference_image) setReferencePreview(data.reference_image);
      setActiveViewMode('PIPELINE');
    }
  }, [data]);

  // Handle image selections with real dimension detection
  const handleSampleSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSampleFile(file);
      const url = URL.createObjectURL(file);
      setSamplePreview(url);
      const img = new Image();
      img.onload = () => {
        setSampleDim({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = url;
    }
  };

  const handleReferenceSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceFile(file);
      const url = URL.createObjectURL(file);
      setReferencePreview(url);
      const img = new Image();
      img.onload = () => {
        setReferenceDim({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = url;
    }
  };

  // Demo runner with standard lunar observation frame for preview
  const handleRunDemoPair = () => {
    setIsProcessing(true);
    setErrorMessage('');
    setTimeout(() => {
      const mockResult = {
        status: "VERIFIED",
        sample_image: "/lunar-surface-far.jpg",
        reference_image: "/lunar-surface-far.jpg",
        metrics: {
          keypoints: 58903,
          keypoints_image1: 31204,
          keypoints_image2: 27699,
          good_matches: 10375,
          inliers: 4581,
          outliers: 5794,
          inlier_ratio: "44.1%",
          avg_error: "0.247 px"
        }
      };
      setAnalysisData(mockResult);
      setIsProcessing(false);
      setActiveViewMode('PIPELINE');
      setCurrentStageIdx(0);
      if (onUploadComplete) onUploadComplete(mockResult);
    }, 1000);
  };

  // Call FastAPI backend with user files
  const handleStartAnalysis = async () => {
    if (!sampleFile || !referenceFile) {
      setErrorMessage('Please select both observation images to proceed.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    try {
      const result = await processImages(sampleFile, referenceFile);
      setAnalysisData(result);
      setIsProcessing(false);
      setActiveViewMode('PIPELINE');
      setCurrentStageIdx(0);
      if (onUploadComplete) onUploadComplete(result);
    } catch (err) {
      console.warn("Backend processing error:", err);
      setErrorMessage('Backend error connecting to http://localhost:8000. Check if FastAPI server is active or run demo pair.');
      setIsProcessing(false);
    }
  };

  const metrics = analysisData?.metrics;

  return (
    <div className="relative min-h-screen w-full flex flex-col p-4 sm:p-8 z-10 select-none overflow-x-hidden">
      {/* Top Floating Header */}
      <header className="spatial-glass rounded-sm p-4 mb-6 flex flex-wrap justify-between items-center gap-4 border border-spatial-glow">
        <div className="flex flex-wrap items-center gap-6">
          <button 
            onClick={onBackToHero}
            className="flex items-center gap-2 font-mono text-xs text-lunar-300 hover:text-mission-amber transition-colors cursor-pointer"
          >
            <span className="text-mission-amber">◀</span>
            <span className="tracking-wider uppercase">OBSERVATORY HOME</span>
          </button>

          <div className="h-4 w-px bg-spatial-glow/60 hidden sm:block" />

          <Stat label="PIPELINE" value={isProcessing ? 'PROCESSING' : (analysisData ? 'VERIFIED' : 'READY')} color={isProcessing ? 'text-mission-amber' : (analysisData ? 'text-mission-green' : 'text-lunar-300')} />
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Switcher */}
          <div className="flex spatial-glass rounded p-0.5 border border-spatial-glow">
            <button
              onClick={() => setActiveViewMode('ACQUISITION')}
              className={`font-mono text-[10px] px-3 py-1.5 rounded transition-all uppercase cursor-pointer ${
                activeViewMode === 'ACQUISITION' 
                  ? 'bg-spatial-indigo text-mission-amber shadow-[0_0_10px_rgba(226,176,126,0.2)]' 
                  : 'text-lunar-400 hover:text-lunar-50'
              }`}
            >
              Observation Input
            </button>
            <button
              onClick={() => setActiveViewMode('PIPELINE')}
              className={`font-mono text-[10px] px-3 py-1.5 rounded transition-all uppercase cursor-pointer ${
                activeViewMode === 'PIPELINE' 
                  ? 'bg-spatial-indigo text-mission-amber shadow-[0_0_10px_rgba(226,176,126,0.2)]' 
                  : 'text-lunar-400 hover:text-lunar-50'
              }`}
            >
              Pipeline Visualizer
            </button>
          </div>

          <div className="font-mono text-xs text-lunar-300 border border-spatial-glow px-3 py-1.5 rounded bg-spatial-void/80">
            {utcTime || '00:00:00 UTC'}
          </div>
        </div>
      </header>

      {/* Main Workstation Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Center: Image Observation Input or Pipeline Visualizer */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {activeViewMode === 'ACQUISITION' ? (
            <div className="flex flex-col gap-6">
              {/* Dual Image Observation Frames */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageObservationFrame 
                  title="SAMPLE OBSERVATION"
                  fileName={sampleFile?.name}
                  dimensions={sampleDim}
                  imageSrc={samplePreview}
                  onFileChange={handleSampleSelect}
                  label="Select Sample Image"
                  alt="Sample Observation"
                />

                <ImageObservationFrame 
                  title="REFERENCE OBSERVATION"
                  fileName={referenceFile?.name}
                  dimensions={referenceDim}
                  imageSrc={referencePreview}
                  onFileChange={handleReferenceSelect}
                  label="Select Reference Image"
                  alt="Reference Observation"
                />
              </div>

              {/* Action Panel */}
              <div className="spatial-glass rounded-sm p-6 border border-spatial-glow flex flex-col items-center justify-center text-center">
                <div className="max-w-xl space-y-4">
                  <h2 className="text-xl font-sans font-medium text-white tracking-wide">
                    Surface Image Registration
                  </h2>
                  <p className="text-xs text-lunar-300 leading-relaxed font-normal">
                    Select two overlapping lunar orbital observations to extract scale-invariant keypoints, filter outliers with RANSAC, and compute perspective homography.
                  </p>

                  {errorMessage && (
                    <p className="text-xs font-mono text-mission-red bg-mission-red/10 border border-mission-red/30 px-3 py-1.5 rounded">
                      {errorMessage}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <button
                      disabled={isProcessing}
                      onClick={handleStartAnalysis}
                      className="px-8 py-3.5 rounded-sm bg-spatial-indigo hover:bg-lunar-800 border border-mission-amber text-mission-amber font-sans font-medium text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-[0_2px_15px_rgba(0,0,0,0.4)] disabled:opacity-50"
                    >
                      {isProcessing ? 'PROCESSING SIFT & RANSAC...' : 'PROCESS OBSERVATIONS'}
                    </button>

                    <button
                      onClick={handleRunDemoPair}
                      className="px-6 py-3.5 rounded-sm spatial-glass border border-spatial-glow text-lunar-300 hover:text-white font-mono text-xs tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      ⚡ RUN SAMPLE PAIR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <AnalysisController 
              backendData={analysisData}
              currentStageIndex={currentStageIdx}
              setCurrentStageIndex={setCurrentStageIdx}
            />
          )}
        </div>

        {/* Right Aside: Actual Registration Telemetry */}
        <aside className="lg:col-span-3 flex flex-col gap-4">
          <div className="spatial-glass rounded-sm p-4 border border-spatial-glow">
            <div className="flex items-center justify-between border-b border-spatial-glow/40 pb-3 mb-4">
              <span className="font-mono text-xs text-lunar-200 uppercase tracking-wider font-medium">
                REGISTRATION METRICS
              </span>
              {analysisData && (
                <span className="w-2 h-2 rounded-full bg-mission-green shadow-[0_0_6px_#34d399]" />
              )}
            </div>

            <div className="space-y-3">
              <BigStat 
                label="KEYPOINTS FOUND" 
                value={metrics?.keypoints ? Number(metrics.keypoints).toLocaleString() : null}
                subtext={metrics ? "Image 1 + Image 2 SIFT features" : "Awaiting processing"}
              />
              <BigStat 
                label="CANDIDATE MATCHES" 
                value={metrics?.good_matches ? Number(metrics.good_matches).toLocaleString() : null}
                subtext={metrics ? "FLANN Lowe ratio filtered" : "Awaiting processing"}
              />
              <BigStat 
                label="RANSAC INLIERS" 
                value={metrics?.inliers ? Number(metrics.inliers).toLocaleString() : null}
                subtext={metrics ? "Consensus correspondence set" : "Awaiting processing"}
              />
              <BigStat 
                label="INLIER RATIO" 
                value={metrics?.inlier_ratio || null}
                subtext={metrics ? "Inlier geometric percentage" : "Awaiting processing"}
              />
              <BigStat 
                label="AVERAGE LK ERROR" 
                value={metrics?.avg_error || null}
                subtext={metrics ? "Subpixel optical flow error" : "Awaiting processing"}
              />
            </div>
          </div>

          {/* Session Controls */}
          <div className="spatial-glass rounded-sm p-3.5 border border-spatial-glow space-y-2">
            <button
              onClick={() => {
                setSampleFile(null);
                setReferenceFile(null);
                setSamplePreview(null);
                setReferencePreview(null);
                setSampleDim(null);
                setReferenceDim(null);
                setAnalysisData(null);
                setActiveViewMode('ACQUISITION');
                setCurrentStageIdx(0);
                setErrorMessage('');
              }}
              className="w-full py-2.5 rounded-sm border border-spatial-glow/40 text-lunar-300 hover:text-white font-mono text-[10px] tracking-wider uppercase transition-colors cursor-pointer text-center block"
            >
              Reset Session
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Workstation;
