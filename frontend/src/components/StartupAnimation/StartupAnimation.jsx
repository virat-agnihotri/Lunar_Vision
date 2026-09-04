import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ANIMATION_CONFIG } from '../../config/animationConfig.js';
import {
  EarthGraphic,
  RocketGraphic,
  SatelliteGraphic,
  MoonGraphic,
  TelemetryHUD,
} from './SpaceGraphics.jsx';
import './StartupAnimation.css';

/**
 * Main Cinematic Startup Animation Component.
 * Animates the mission sequence:
 * Earth -> Rocket Launch -> Orbiter Separation -> Moon Approach -> Lunar Orbit -> Title Reveal -> Dashboard
 */
export default function StartupAnimation({ onComplete }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [solarDeployed, setSolarDeployed] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [missionTime, setMissionTime] = useState(0);

  const scenes = useMemo(
    () => [
      {
        id: 'scene1_earth',
        name: 'PHASE 01: EARTH LAUNCH PAD',
        alt: '0 KM',
        vel: '0.00 KM/S',
        sys: 'SYSTEMS NOMINAL',
      },
      {
        id: 'scene2_launch',
        name: 'PHASE 02: TRANSLUNAR INJECTION',
        alt: '120 KM',
        vel: '10.82 KM/S',
        sys: 'THRUST MAXIMUM',
      },
      {
        id: 'scene3_separation',
        name: 'PHASE 03: ORBITER SEPARATION',
        alt: '3,400 KM',
        vel: '9.45 KM/S',
        sys: 'DEPLOYING SOLAR ARRAYS',
      },
      {
        id: 'scene4_moonApproach',
        name: 'PHASE 04: LUNAR BOUND CAPTURE',
        alt: '240,000 KM',
        vel: '2.14 KM/S',
        sys: 'TRAJECTORY ON TARGET',
      },
      {
        id: 'scene5_lunarOrbit',
        name: 'PHASE 05: LUNAR ORBIT INSERTION',
        alt: '100 KM (POLAR ORBIT)',
        vel: '1.62 KM/S',
        sys: 'ORBIT ESTABLISHED',
      },
      {
        id: 'scene6_reveal',
        name: 'PHASE 06: MISSION CONTROL ACTIVE',
        alt: '100 KM POLAR',
        vel: '1.62 KM/S',
        sys: 'CORRESPONDENCE READY',
      },
    ],
    []
  );

  // Generate random twinkling stars for deep space canvas
  const starfield = useMemo(() => {
    const stars = [];
    const count = 120;
    for (let i = 0; i < count; i++) {
      stars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.8,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 3,
      });
    }
    return stars;
  }, []);

  const handleFinish = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 800);
  }, [onComplete]);

  // Handle manual skip
  const handleSkip = useCallback(() => {
    if (ANIMATION_CONFIG.allowSkip) {
      handleFinish();
    }
  }, [handleFinish]);

  // Keyboard shortcut listener (ESC or Space skips intro)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Telemetry Mission Timer Increment
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTime((prev) => prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Main Scene Progression State Machine
  useEffect(() => {
    if (!ANIMATION_CONFIG.enabled) {
      if (onComplete) onComplete();
      return;
    }

    const multiplier = ANIMATION_CONFIG.speedMultiplier || 1.0;
    const durations = ANIMATION_CONFIG.sceneDurations;

    const timeline = [
      durations.scene1_earth * multiplier,
      durations.scene2_launch * multiplier,
      durations.scene3_separation * multiplier,
      durations.scene4_moonApproach * multiplier,
      durations.scene5_lunarOrbit * multiplier,
      durations.scene6_reveal * multiplier,
    ];

    let currentStep = 0;
    let timeoutId;

    const runNextStep = () => {
      if (currentStep < timeline.length - 1) {
        currentStep += 1;
        setSceneIndex(currentStep);

        // Trigger solar panel deployment during Scene 3
        if (currentStep === 2) {
          setTimeout(() => setSolarDeployed(true), 600);
        }

        timeoutId = setTimeout(runNextStep, timeline[currentStep]);
      } else {
        // Timeline complete -> transition to dashboard
        handleFinish();
      }
    };

    timeoutId = setTimeout(runNextStep, timeline[0]);

    return () => clearTimeout(timeoutId);
  }, [handleFinish, onComplete]);

  const currentScene = scenes[sceneIndex] || scenes[0];
  const formattedTime = `T+00:${Math.floor(missionTime / 60)
    .toString()
    .padStart(2, '0')}:${(missionTime % 60).toFixed(1).padStart(4, '0')}`;

  return (
    <div className={`startup-animation-container ${isFadingOut ? 'fade-out' : ''}`}>
      {/* Deep Space Background Layer */}
      <div className="space-background">
        <div className="space-nebula-glow" />
        
        {/* Layered Starfield */}
        <div className="starfield">
          {starfield.map((star) => (
            <div
              key={star.id}
              className="star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Futuristic Telemetry Overlay */}
      <TelemetryHUD
        phaseName={currentScene.name}
        telemetryData={{
          alt: currentScene.alt,
          vel: currentScene.vel,
          sys: currentScene.sys,
        }}
      />

      {/* Top Left Mission Time Counter */}
      <div className="mission-clock">{formattedTime}</div>

      {/* Skip Button */}
      {ANIMATION_CONFIG.allowSkip && (
        <button className="skip-intro-btn" onClick={handleSkip} title="Press ESC or Space to skip">
          SKIP INTRO <span className="btn-arrow">→</span>
        </button>
      )}

      {/* Scene Render Layer */}
      <div className={`scene-stage scene-active-${sceneIndex + 1}`}>
        {/* Scene 1 & 2: Earth & Rocket Launch */}
        <div className="earth-launch-wrapper">
          <EarthGraphic className="earth-element" />
          
          <div className="rocket-flight-wrapper">
            <RocketGraphic
              className="rocket-element"
              engineOn={sceneIndex >= 1}
            />
          </div>
        </div>

        {/* Scene 3: Space Separation & Satellite Array Deployment */}
        <div className="separation-wrapper">
          <div className="receding-rocket-wrapper">
            <RocketGraphic className="receding-rocket" engineOn={false} />
          </div>
          <div className="deploying-satellite-wrapper">
            <SatelliteGraphic
              className="satellite-element"
              solarDeployed={solarDeployed || sceneIndex >= 3}
            />
          </div>
        </div>

        {/* Scene 4 & 5 & 6: Moon & Orbit Insertion & Title Reveal */}
        <div className="moon-orbit-wrapper">
          <MoonGraphic className="moon-element" />

          {/* Satellite Orbital Revolving Ring Container */}
          <div className="satellite-orbit-track">
            <div className="orbiting-satellite-container">
              <SatelliteGraphic className="orbiting-satellite" solarDeployed={true} />
            </div>
          </div>
        </div>

        {/* Scene 6: Cinematic Title & Subtitle Reveal Overlay */}
        <div className={`title-reveal-overlay ${sceneIndex === 5 ? 'visible' : ''}`}>
          <div className="reveal-hud-box">
            <div className="reveal-badge">ISRO CHANDRAYAAN-2 IMAGERY SUITE</div>
            <h1 className="reveal-main-title">{ANIMATION_CONFIG.titles.mainTitle}</h1>
            <div className="reveal-title-divider" />
            <h2 className="reveal-subtitle">{ANIMATION_CONFIG.titles.subtitle}</h2>
            <div className="reveal-status-bar">
              <span className="pulse-indicator" />
              <span>{ANIMATION_CONFIG.titles.systemReadyText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
