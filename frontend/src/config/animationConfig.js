/**
 * Configuration options for the Lunar Startup Animation.
 * Adjust timings, titles, or disable animation directly from this single file.
 */
export const ANIMATION_CONFIG = {
  // Master toggle to enable or disable the intro animation completely
  enabled: true,

  // Speed multiplier (1.0 = standard speed, 0.5 = double speed, 2.0 = half speed)
  speedMultiplier: 1.0,

  // Enable or allow user to skip intro using button or keyboard (ESC / Space)
  allowSkip: true,

  // Duration of individual scenes in milliseconds (base values before speedMultiplier)
  sceneDurations: {
    scene1_earth: 3500,        // Earth & space overview
    scene2_launch: 4000,       // Rocket launch & ascent
    scene3_separation: 4000,   // Satellite separation & solar panel deployment
    scene4_moonApproach: 4500, // Travel towards Moon
    scene5_lunarOrbit: 5000,   // Lunar orbit insertion & revolving orbiter
    scene6_reveal: 4500,       // Title reveal & final transition to dashboard
  },

  // Telemetry HUD text settings
  telemetry: {
    agency: 'ISRO / LUNAR RESEARCH DIVISION',
    mission: 'CHANDRAYAAN-2 / LUNAR CORRESPONDENCE',
  },

  // Titles shown during Scene 6
  titles: {
    mainTitle: 'LUNAR IMAGE CORRESPONDENCE',
    subtitle: 'Multi-Modal Lunar Image Matching',
    systemReadyText: 'MISSION CONTROL SYSTEM ONLINE • ENTERING DASHBOARD',
  }
};
