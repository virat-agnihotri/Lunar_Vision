/**
 * Configuration options for the Lunar Vision 3D Startup Animation.
 * Control duration, toggle animation, or adjust title text from this single file.
 */
export const ANIMATION_CONFIG = {
  // Master toggle to enable or disable the intro animation completely
  enabled: true,

  // Total duration of the cinematic sequence in seconds (default ~18s for full cinematic experience)
  // Set to e.g. 10 for a quicker presentation or 20 for full cinematic pacing
  INTRO_DURATION: 18.0,

  // Enable or allow user to skip intro using button or keyboard (ESC / Space)
  allowSkip: true,

  // Titles shown during the title reveal phase
  titles: {
    mainTitle: 'LUNAR VISION',
    subtitle: 'MULTI-MODAL LUNAR IMAGE CORRESPONDENCE & ALIGNMENT',
    missionStatus: 'MISSION STATUS: ORBIT STABLE',
    systemReadyText: 'SYSTEM SYNCHRONIZATION COMPLETE • ENTERING WORKSPACE',
  },

  // Telemetry HUD metadata
  telemetry: {
    agency: 'LUNAR OBSERVATION & RECONNAISSANCE DIVISION',
    mission: 'CHANDRAYAAN // LUNAR-CORRESPONDENCE-ORBITER',
    frequency: '2.24 GHz S-BAND DSN',
  },
};
