export type LandCoverClass = 'burnt' | 'intact' | 'vegetation'

export interface ChallengePointData {
  id: string
  tileX: number
  tileY: number
  correctAnswer: LandCoverClass
  // Shown when the player picks the wrong answer
  wrongHint: string
}

export interface ClassificationMission {
  id: string
  briefing: string      // Dr. Shay dialogue when mission starts
  question: string      // displayed at top of the choice popup
  points: ChallengePointData[]
  missionBadge: string
  missionBadgeImage: string
}

// ── Answer labels shown in the popup buttons ──────────────────────────────
export const CLASS_LABELS: Record<LandCoverClass, string> = {
  burnt:      'BURNT BUILDING',
  intact:     'INTACT BUILDING',
  vegetation: 'FOREST / VEGETATION',
}

// ── Final Classification Mission ──────────────────────────────────────────
// Triggered once ALL discovery points have been visited.
//
// Update tileX / tileY and correctAnswer for each point using the in-game
// coordinate picker: walk Stella to a feature, click it, read the tile
// coords from the top-right HUD display, enter them below.
// correctAnswer must be: 'burnt' | 'intact' | 'vegetation'
export const CLASSIFICATION_MISSION: ClassificationMission = {
  id: 'mission-final',
  briefing:
    'You have seen it all — burnt rubble, standing structures, forest. ' +
    'Now prove you can read the satellite image on your own. ' +
    'I have marked 7 locations. Tell me what each one is. ' +
    'Use everything you learned. We are counting on this data.',
  question: 'What type of location is this?',
  missionBadge: 'SAR Analyst',
  missionBadgeImage: 'badge-burntzone.png', // swap for a final mission badge when ready
  points: [
    {
      id: 'cf1',
      tileX: 36,   // PLACEHOLDER — update with coordinate picker
      tileY: 16,
      correctAnswer: 'burnt',
      wrongHint:
        'Look for the fuzzy grey patch with no strong color — ' +
        'that is the signature of collapsed walls and fire damage.',
    },
    {
      id: 'cf2',
      tileX: 31,   // PLACEHOLDER — update with coordinate picker
      tileY: 18,
      correctAnswer: 'intact',
      wrongHint:
        'A strong, saturated color means solid walls are still standing. ' ,
    },
    {
      id: 'cf3',
      tileX: 45,   // PLACEHOLDER — update with coordinate picker
      tileY: 21,
      correctAnswer: 'vegetation',
      wrongHint:
        'Forests scatter radar in many directions through branches and leaves — ' +
        'volume scattering creates that fuzzy textured look with no sharp edges.',
    },
    {
      id: 'cf4',
      tileX: 28,   // PLACEHOLDER — update with coordinate picker
      tileY: 35,
      correctAnswer: 'burnt',
      wrongHint:
        'No strong color and a noisy texture means the structure is gone. ' ,    },
    {
      id: 'cf5',
      tileX: 21,   // PLACEHOLDER — update with coordinate picker
      tileY: 30,
      correctAnswer: 'intact',
      wrongHint:
        'See those bright, colorful pixels? That is a manmade object — ' +
        'the building is standing.',
    },
    {
      id: 'cf6',
      tileX: 41,   // PLACEHOLDER — update with coordinate picker
      tileY: 37,
      correctAnswer: 'vegetation',
      wrongHint:
        'Volume scattering from tree canopy gives a soft, diffuse texture. ' +
        'No sharp geometry here — this is natural vegetation, not a man-made structure.',
    },
    {
      id: 'cf7',
      tileX: 52,   // PLACEHOLDER — update with coordinate picker
      tileY: 28,
      correctAnswer: 'burnt',
      wrongHint:
        'Rubble scatters the radar signal in every direction. ' +
        'Compare it to a nearby intact building — notice the difference in brightness and color.',
    },
  ],
}
