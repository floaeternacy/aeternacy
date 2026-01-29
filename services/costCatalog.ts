
/**
 * æternacy™ Energy Catalog
 * Units represent 'Energy' consumed by neural processing.
 * High-cost actions (>100 energy units) trigger explicit confirmation.
 * Low-cost actions are used silently for a seamless premium experience.
 */
export const TOKEN_COSTS = {
  // --- LOW INTENSITY (Flash Model) - Processed Silently ---
  BASIC_STORY_SYNTHESIS: 1, 
  STORY_REWRITE: 5,
  AI_INSIGHT: 2,
  MAGIC_EDIT: 25,
  TIME_CAPSULE_SEAL: 10,

  // --- MEDIUM INTENSITY (Pro Model) ---
  BIOGRAFER_SESSION: 250, // Per guided chapter session
  JOURNAEY_WEAVING: 150,  // Complex multi-moment synthesis
  MAGAZINE_ISSUE: 500,

  // --- HIGH INTENSITY (Veo & Specialized Models) ---
  AI_VIDEO_REFLECTION: 500, 
  VOCAL_IDENTITY_CALIBRATION: 2500, // One-time neural fingerprinting
  
  // --- BULK RECLAMATION (Archive Rescue™) ---
  BULK_UPLOAD_BASE_PER_1000: 1000,
};

export const HIGH_COST_THRESHOLD = 100;
