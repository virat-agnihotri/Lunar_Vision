import React from 'react';

/**
 * Detailed Earth vector graphic with realistic atmospheric glow,
 * continent vectors, clouds, and depth gradients.
 */
export function EarthGraphic({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 800 800"
      className={`space-graphic earth-svg ${className}`}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Outer Atmosphere Glow */}
        <filter id="atmosphere-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="16" result="blur1" />
          <feGaussianBlur stdDeviation="30" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dynamic Ocean Gradient */}
        <radialGradient id="oceanGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1e5799" />
          <stop offset="40%" stopColor="#0b2a59" />
          <stop offset="85%" stopColor="#03112b" />
          <stop offset="100%" stopColor="#010613" />
        </radialGradient>

        {/* Limb Atmosphere Outer Halo */}
        <radialGradient id="atmosphereGrad" cx="50%" cy="50%" r="50%">
          <stop offset="75%" stopColor="rgba(41, 171, 226, 0)" />
          <stop offset="90%" stopColor="rgba(56, 189, 248, 0.4)" />
          <stop offset="96%" stopColor="rgba(147, 197, 253, 0.7)" />
          <stop offset="100%" stopColor="rgba(191, 219, 254, 0.95)" />
        </radialGradient>

        {/* Continent Fill Gradient */}
        <linearGradient id="continentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2e7d32" />
          <stop offset="50%" stopColor="#1b5e20" />
          <stop offset="100%" stopColor="#0d3b13" />
        </linearGradient>

        {/* Cloud Layer Gradient */}
        <radialGradient id="cloudGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
          <stop offset="70%" stopColor="rgba(240, 248, 255, 0.4)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.0)" />
        </radialGradient>

        {/* Day/Night Terminator Clip / Shading */}
        <linearGradient id="terminatorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="45%" stopColor="rgba(0,0,0,0.15)" />
          <stop offset="80%" stopColor="rgba(2, 6, 23, 0.8)" />
          <stop offset="100%" stopColor="rgba(2, 6, 23, 0.97)" />
        </linearGradient>
      </defs>

      {/* Atmospheric Atmosphere Aura */}
      <circle cx="400" cy="400" r="380" fill="url(#atmosphereGrad)" filter="url(#atmosphere-glow)" />

      {/* Earth Main Sphere */}
      <circle cx="400" cy="400" r="350" fill="url(#oceanGrad)" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" />

      {/* Continents Group (India, Asia, Indian Ocean region highlighted) */}
      <g fill="url(#continentGrad)" opacity="0.88">
        {/* India Subcontinent */}
        <path d="M 410,260 Q 430,290 445,330 Q 435,360 410,380 Q 395,350 380,310 Q 390,280 410,260 Z" />
        
        {/* Eurasia Continent Mass */}
        <path d="M 330,140 Q 420,130 520,160 Q 580,210 560,260 Q 500,270 440,250 Q 380,240 330,200 Z" />
        <path d="M 440,250 Q 530,270 590,300 Q 610,340 550,350 Q 480,310 440,270 Z" />
        
        {/* Africa Continent */}
        <path d="M 240,260 Q 310,270 330,340 Q 310,420 270,450 Q 230,380 210,330 Q 220,290 240,260 Z" />

        {/* Southeast Asia & Islands */}
        <circle cx="510" cy="380" r="12" />
        <circle cx="540" cy="400" r="10" />
        <circle cx="570" cy="420" r="16" />
        <circle cx="530" cy="440" r="9" />

        {/* Australia */}
        <path d="M 560,480 Q 620,470 640,520 Q 610,570 550,560 Q 530,520 560,480 Z" />

        {/* Antarctica Edge */}
        <path d="M 200,690 Q 400,650 600,690 Q 700,740 100,740 Z" fill="#e2e8f0" opacity="0.7" />
      </g>

      {/* Cloud Swirls */}
      <g fill="url(#cloudGrad)" opacity="0.6">
        <path d="M 220,220 C 300,180 450,210 550,170 C 600,200 480,250 350,230 Z" />
        <path d="M 380,320 C 440,310 520,360 600,340 C 580,390 480,380 400,350 Z" />
        <path d="M 260,400 C 350,430 420,490 560,470 C 500,520 380,500 280,440 Z" />
      </g>

      {/* Night Shading Overlay */}
      <circle cx="400" cy="400" r="351" fill="url(#terminatorGrad)" />
    </svg>
  );
}

/**
 * Realistic ISRO-inspired launch vehicle (LVM3 style) with boosters,
 * payload fairing, metallic details, and intense engine flame thrust.
 */
export function RocketGraphic({ className = '', style = {}, engineOn = true }) {
  return (
    <svg
      viewBox="0 0 200 600"
      className={`space-graphic rocket-svg ${className}`}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Thruster Flame Energy Gradients */}
        <linearGradient id="flameCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="90%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="rgba(220, 38, 38, 0)" />
        </linearGradient>

        <linearGradient id="flameOuterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(253, 224, 71, 0.9)" />
          <stop offset="40%" stopColor="rgba(249, 115, 22, 0.7)" />
          <stop offset="80%" stopColor="rgba(239, 68, 68, 0.4)" />
          <stop offset="100%" stopColor="rgba(185, 28, 28, 0)" />
        </linearGradient>

        <radialGradient id="thrustGlow" cx="50%" cy="10%" r="80%">
          <stop offset="0%" stopColor="rgba(255, 237, 213, 0.95)" />
          <stop offset="30%" stopColor="rgba(251, 146, 60, 0.7)" />
          <stop offset="70%" stopColor="rgba(239, 68, 68, 0.3)" />
          <stop offset="100%" stopColor="rgba(185, 28, 28, 0)" />
        </radialGradient>

        {/* Metallic Hull Gradients */}
        <linearGradient id="coreHullGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="30%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        <linearGradient id="boosterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="40%" stopColor="#f8fafc" />
          <stop offset="80%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        <linearGradient id="fairingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="35%" stopColor="#ffffff" />
          <stop offset="85%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        <filter id="glow-flame" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Engine Exhaust & Plasma Plume */}
      {engineOn && (
        <g className="rocket-exhaust-group">
          {/* Broad Thrust Ambient Glow */}
          <ellipse cx="100" cy="450" rx="90" ry="140" fill="url(#thrustGlow)" filter="url(#glow-flame)" opacity="0.85" />
          
          {/* Main Core Plume */}
          <path
            d="M 85,380 Q 75,470 100,570 Q 125,470 115,380 Z"
            fill="url(#flameCoreGrad)"
            filter="url(#glow-flame)"
          />
          <path
            d="M 70,380 Q 55,480 100,590 Q 145,480 130,380 Z"
            fill="url(#flameOuterGrad)"
            filter="url(#glow-flame)"
            opacity="0.9"
          />

          {/* Left Booster Plume */}
          <path
            d="M 50,370 Q 42,440 50,510 Q 58,440 50,370 Z"
            fill="url(#flameCoreGrad)"
            filter="url(#glow-flame)"
          />

          {/* Right Booster Plume */}
          <path
            d="M 150,370 Q 142,440 150,510 Q 158,440 150,370 Z"
            fill="url(#flameCoreGrad)"
            filter="url(#glow-flame)"
          />

          {/* Shock Diamond Rings */}
          <ellipse cx="100" cy="420" rx="14" ry="4" fill="#ffffff" opacity="0.9" />
          <ellipse cx="100" cy="460" rx="18" ry="5" fill="#ffffff" opacity="0.8" />
          <ellipse cx="100" cy="500" rx="22" ry="6" fill="#fef08a" opacity="0.7" />
        </g>
      )}

      {/* Rocket Assembly Hull */}
      <g className="rocket-body-group">
        {/* Left Strap-on Booster (S200 style) */}
        <path d="M 40,210 L 60,210 L 60,370 L 40,370 Z" fill="url(#boosterGrad)" />
        <path d="M 40,210 Q 50,180 60,210 Z" fill="#dc2626" /> {/* Nosecone accent */}
        <rect x="40" y="360" width="20" height="15" fill="#334155" /> {/* Nozzle */}

        {/* Right Strap-on Booster */}
        <path d="M 140,210 L 160,210 L 160,370 L 140,370 Z" fill="url(#boosterGrad)" />
        <path d="M 140,210 Q 150,180 160,210 Z" fill="#dc2626" />
        <rect x="140" y="360" width="20" height="15" fill="#334155" />

        {/* Center Main Stage Core */}
        <rect x="75" y="160" width="50" height="220" fill="url(#coreHullGrad)" />
        
        {/* Interstage Ring */}
        <rect x="73" y="155" width="54" height="10" fill="#0f172a" />
        <rect x="73" y="270" width="54" height="6" fill="#0f172a" />

        {/* Payload Fairing (Ogive Nose Cone) */}
        <path
          d="M 75,160 Q 75,70 100,40 Q 125,70 125,160 Z"
          fill="url(#fairingGrad)"
        />

        {/* Tricolor Accent Stripe (Indian Space Program Theme) */}
        <g className="isro-stripe">
          <rect x="75" y="190" width="50" height="4" fill="#f97316" />
          <rect x="75" y="194" width="50" height="4" fill="#ffffff" />
          <rect x="75" y="198" width="50" height="4" fill="#16a34a" />
        </g>

        {/* Payload Fairing Separation Line */}
        <line x1="100" y1="40" x2="100" y2="160" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />

        {/* Main Core Nozzle Assembly */}
        <path d="M 80,380 L 120,380 L 115,395 L 85,395 Z" fill="#1e293b" />
      </g>
    </svg>
  );
}

/**
 * Detailed Lunar Orbiter Spacecraft graphic inspired by Chandrayaan-2.
 * Features golden MLI foil insulation, solar array panels, antenna, and sensors.
 */
export function SatelliteGraphic({ className = '', style = {}, solarDeployed = true }) {
  return (
    <svg
      viewBox="0 0 500 400"
      className={`space-graphic satellite-svg ${className}`}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gold Thermal Blanket (MLI) Foil Texture Gradient */}
        <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="25%" stopColor="#eab308" />
          <stop offset="55%" stopColor="#ca8a04" />
          <stop offset="85%" stopColor="#a16207" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>

        {/* Solar Panel Dark Blue Silicon Grid Gradient */}
        <linearGradient id="solarCellGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="20%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="80%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Parabolic Antenna Dish Gradient */}
        <radialGradient id="antennaGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="85%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </radialGradient>

        <filter id="antennaGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Thruster Burst Glow Effect (Active Navigation) */}
      <g className="rcs-thrusters">
        <circle cx="250" cy="275" r="8" fill="#38bdf8" opacity="0.6" filter="url(#antennaGlow)" />
      </g>

      {/* Solar Panel Wing (Left) */}
      <g
        className="solar-panel-left"
        style={{
          transformOrigin: '200px 200px',
          transform: solarDeployed ? 'scaleX(1)' : 'scaleX(0.1)',
          transition: 'transform 2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Support Yoke */}
        <rect x="70" y="195" width="130" height="10" fill="#64748b" />
        
        {/* Solar Panel Plate */}
        <rect x="20" y="130" width="160" height="140" fill="url(#solarCellGrad)" rx="4" stroke="#93c5fd" strokeWidth="1.5" />
        
        {/* Solar Cell Grid Lines */}
        <line x1="20" y1="165" x2="180" y2="165" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="20" y1="200" x2="180" y2="200" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="20" y1="235" x2="180" y2="235" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="60" y1="130" x2="60" y2="270" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="100" y1="130" x2="100" y2="270" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="140" y1="130" x2="140" y2="270" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />
      </g>

      {/* Solar Panel Wing (Right) */}
      <g
        className="solar-panel-right"
        style={{
          transformOrigin: '300px 200px',
          transform: solarDeployed ? 'scaleX(1)' : 'scaleX(0.1)',
          transition: 'transform 2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <rect x="300" y="195" width="130" height="10" fill="#64748b" />
        <rect x="320" y="130" width="160" height="140" fill="url(#solarCellGrad)" rx="4" stroke="#93c5fd" strokeWidth="1.5" />
        
        <line x1="320" y1="165" x2="480" y2="165" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="320" y1="200" x2="480" y2="200" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="320" y1="235" x2="480" y2="235" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="360" y1="130" x2="360" y2="270" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="400" y1="130" x2="400" y2="270" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="440" y1="130" x2="440" y2="270" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />
      </g>

      {/* Main Satellite Body (Gold MLI Box Architecture) */}
      <g className="satellite-bus">
        {/* Main Structure Box */}
        <rect x="200" y="140" width="100" height="120" fill="url(#goldFoil)" rx="6" stroke="#fbbf24" strokeWidth="2" />
        
        {/* Gold Foil Pattern Facets */}
        <line x1="200" y1="140" x2="300" y2="260" stroke="#78350f" strokeWidth="1" opacity="0.4" />
        <line x1="300" y1="140" x2="200" y2="260" stroke="#78350f" strokeWidth="1" opacity="0.4" />
        
        {/* Top Payload Deck */}
        <rect x="210" y="130" width="80" height="10" fill="#475569" />

        {/* High Gain Dish Antenna */}
        <path d="M 215,130 Q 250,90 285,130 Z" fill="url(#antennaGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
        <line x1="250" y1="110" x2="250" y2="75" stroke="#0ea5e9" strokeWidth="2" />
        <circle cx="250" cy="72" r="4" fill="#38bdf8" filter="url(#antennaGlow)" />

        {/* Optical Sensor Array / Terrain Mapping Camera (TMC-2) lenses */}
        <circle cx="230" cy="200" r="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="230" cy="200" r="6" fill="#0284c7" />
        <circle cx="232" cy="198" r="2" fill="#ffffff" />

        <circle cx="270" cy="200" r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="270" cy="200" r="5" fill="#0284c7" />

        {/* Bottom Main Engine Thruster Nozzle */}
        <path d="M 235,260 L 265,260 L 270,275 L 230,275 Z" fill="#334155" />
      </g>
    </svg>
  );
}

/**
 * Realistic 2D Moon Graphic with procedural craters, dark basaltic maria,
 * high-altitude terminator lighting, and subtle lunar atmospheric halo.
 */
export function MoonGraphic({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 800 800"
      className={`space-graphic moon-svg ${className}`}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Moon Radial Surface Texture Base */}
        <radialGradient id="moonSurface" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="30%" stopColor="#e2e8f0" />
          <stop offset="65%" stopColor="#94a3b8" />
          <stop offset="90%" stopColor="#475569" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>

        {/* Outer Lunar Atmosphere Glow */}
        <radialGradient id="moonGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="80%" stopColor="rgba(226, 232, 240, 0)" />
          <stop offset="94%" stopColor="rgba(203, 213, 225, 0.25)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.6)" />
        </radialGradient>

        {/* Crater Shadow Depth Gradient */}
        <radialGradient id="craterShadow" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(15, 23, 42, 0.75)" />
          <stop offset="70%" stopColor="rgba(51, 65, 85, 0.4)" />
          <stop offset="100%" stopColor="rgba(203, 213, 225, 0.1)" />
        </radialGradient>

        <filter id="moon-soft-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Moon Halo Glow */}
      <circle cx="400" cy="400" r="375" fill="url(#moonGlowGrad)" />

      {/* Main Lunar Disk */}
      <circle cx="400" cy="400" r="340" fill="url(#moonSurface)" />

      {/* Lunar Maria (Dark Basaltic Plains - Sea of Tranquility, Oceanus Procellarum) */}
      <g fill="#334155" opacity="0.45" filter="url(#moon-soft-blur)">
        {/* Oceanus Procellarum */}
        <path d="M 230,220 Q 180,320 220,440 Q 300,500 350,410 Q 320,290 230,220 Z" />
        
        {/* Mare Tranquillitatis (Sea of Tranquility) */}
        <path d="M 420,280 Q 520,260 560,330 Q 520,410 440,380 Q 390,330 420,280 Z" />
        
        {/* Mare Serenitatis */}
        <path d="M 450,200 Q 530,190 540,260 Q 480,270 450,200 Z" />

        {/* Mare Imbrium */}
        <path d="M 280,180 Q 380,160 410,240 Q 320,280 280,180 Z" />
      </g>

      {/* Major Craters with rim highlights */}
      <g className="lunar-craters">
        {/* Tycho Crater & Ejecta Rays (Bottom South Region) */}
        <g transform="translate(420, 610)">
          {/* Ejecta Rays */}
          <line x1="0" y1="0" x2="-140" y2="-220" stroke="#f1f5f9" strokeWidth="1.5" opacity="0.4" />
          <line x1="0" y1="0" x2="160" y2="-180" stroke="#f1f5f9" strokeWidth="1.5" opacity="0.4" />
          <line x1="0" y1="0" x2="-60" y2="-290" stroke="#f1f5f9" strokeWidth="1.5" opacity="0.4" />
          <line x1="0" y1="0" x2="80" y2="-310" stroke="#f1f5f9" strokeWidth="1.5" opacity="0.4" />
          
          {/* Crater Rim */}
          <circle cx="0" cy="0" r="28" fill="url(#craterShadow)" stroke="#cbd5e1" strokeWidth="2.5" />
          <circle cx="-3" cy="-3" r="10" fill="#f8fafc" opacity="0.9" /> {/* Central Peak */}
        </g>

        {/* Copernicus Crater (Equatorial region) */}
        <g transform="translate(320, 360)">
          <circle cx="0" cy="0" r="24" fill="url(#craterShadow)" stroke="#e2e8f0" strokeWidth="2" />
          <circle cx="-2" cy="-2" r="7" fill="#cbd5e1" />
        </g>

        {/* Kepler Crater */}
        <g transform="translate(210, 340)">
          <circle cx="0" cy="0" r="16" fill="url(#craterShadow)" stroke="#e2e8f0" strokeWidth="1.5" />
        </g>

        {/* Aristarchus Crater (Bright spot) */}
        <g transform="translate(240, 240)">
          <circle cx="0" cy="0" r="14" fill="#ffffff" opacity="0.95" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="#f1f5f9" strokeWidth="1" opacity="0.6" />
        </g>

        {/* Plato Crater (Dark flooded crater in North) */}
        <g transform="translate(380, 170)">
          <ellipse cx="0" cy="0" rx="20" ry="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
        </g>

        {/* Minor Craters scatter */}
        <circle cx="530" cy="480" r="12" fill="url(#craterShadow)" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="480" cy="530" r="15" fill="url(#craterShadow)" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="280" cy="490" r="18" fill="url(#craterShadow)" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="580" cy="220" r="10" fill="url(#craterShadow)" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="360" cy="240" r="9" fill="url(#craterShadow)" stroke="#94a3b8" strokeWidth="1" />
      </g>

      {/* Orbital Path HUD Reticle Overlay */}
      <ellipse
        cx="400"
        cy="400"
        rx="370"
        ry="210"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeDasharray="6,8"
        opacity="0.35"
        transform="rotate(-18 400 400)"
      />
    </svg>
  );
}

/**
 * Futuristic Sci-Fi Telemetry HUD Overlay displaying mission parameters,
 * target lock crosshairs, coordinate grids, and live phase telemetry.
 */
export function TelemetryHUD({ phaseName = '', telemetryData = {} }) {
  return (
    <div className="telemetry-hud-overlay">
      {/* Corner Bracket Bracing */}
      <div className="hud-corner top-left">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M 0,15 L 0,0 L 15,0" fill="none" stroke="#38bdf8" strokeWidth="2" />
        </svg>
      </div>

      <div className="hud-corner top-right">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M 40,15 L 40,0 L 25,0" fill="none" stroke="#38bdf8" strokeWidth="2" />
        </svg>
      </div>

      <div className="hud-corner bottom-left">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M 0,25 L 0,40 L 15,40" fill="none" stroke="#38bdf8" strokeWidth="2" />
        </svg>
      </div>

      <div className="hud-corner bottom-right">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M 40,25 L 40,40 L 25,40" fill="none" stroke="#38bdf8" strokeWidth="2" />
        </svg>
      </div>

      {/* Top Left Header Telemetry */}
      <div className="hud-telemetry-panel top-left-panel">
        <div className="hud-badge">ISRO / LUNAR OBSERVATION</div>
        <div className="hud-phase-title">{phaseName}</div>
      </div>

      {/* Top Right Live Telemetry Data */}
      <div className="hud-telemetry-panel top-right-panel">
        <div className="hud-data-row">
          <span className="label">ALT:</span>
          <span className="value">{telemetryData.alt || '384,400 KM'}</span>
        </div>
        <div className="hud-data-row">
          <span className="label">VEL:</span>
          <span className="value">{telemetryData.vel || '10.82 KM/S'}</span>
        </div>
        <div className="hud-data-row">
          <span className="label">SYS:</span>
          <span className="value status-ok">{telemetryData.sys || 'NOMINAL'}</span>
        </div>
      </div>

      {/* Bottom Center Reticle Accent */}
      <div className="hud-bottom-bar">
        <div className="hud-grid-dots" />
        <span className="hud-lat-long">LAT: 19.0760° N | LONG: 72.8777° E | INC: 90.0° POLAR</span>
      </div>
    </div>
  );
}
