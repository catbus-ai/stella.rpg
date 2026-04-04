export interface DiscoveryData {
  id: string
  tileX: number
  tileY: number
  triggerRadius: number
  title: string
  sarDescription: string
  body: string
  scienceFact: string
  sourceLabel: string
  sourceUrl: string
  badge: string
  badgeImage: string  // filename inside public/assets/images/
  opticalImageUrl?: string
  opticalImageCredit?: string
  sarImageUrl?: string      // cropped SAR chip for this discovery point
  sarImageCredit?: string
}

// Place these at tile coordinates that match interesting features in YOUR SAR image.
// Open your SAR image, find a feature, divide its pixel X by TILE_SIZE (32) to get tileX.
// These are placeholders — update tileX/tileY once you know your image.
export const DISCOVERY_POINTS: DiscoveryData[] = [
  {
    id: 'burnt-building',
    tileX: 31,
    tileY: 13,
    triggerRadius: 1,
    title: 'Burnt House',
    sarDescription: 'Observation: Fuzzy white blobs',
    body:
      'When a building burns down, its walls & roof collapse into rubble. ' +
      'In radar, standing walls are like mirrors that bounce the radar beam back to the satellite. ' +
      'When the walls collapse, the radar signal scatters in many directions, making the signal fuzzy, white, & noisy. ',
    scienceFact:
      'The 2025 Palisades and Eaton fires destroyed over 16,000 structures in Los Angeles County — ' +
      'making it the most destructive wildfire in California history.',
    sourceLabel: 'Cal Fire Damage Inspection Report 2025',
    sourceUrl: 'https://www.fire.ca.gov/incidents/2025',
    badge: 'Burnt Zone Scout',
    badgeImage: 'badge-burntzone.png',
    opticalImageUrl: 'assets/images/house-burnt.png',
    opticalImageCredit: 'AP Photo / Mark J. Terrill',
    sarImageUrl: 'assets/images/sar-chip-burnt.png',
    sarImageCredit: 'ICEYE SAR Image (2025)',
  },
  {
    id: 'intact-building',
    tileX: 27,
    tileY: 24,
    triggerRadius: 1,
    title: 'Intact Building',
    sarDescription: 'Observation: A strong, dominant color',
    body:
      'This building survived the fire. The strong, red \'backscatter\' means this building is intact. It is one strong color.' +
      'The radar signal bounces off the roof, and flies straight back to the satellite. ' +
      'In a color subaperture image, a strong, saturated color here tells us: a solid structure is standing. ' +
      'First responders can use this information to prioritize which neighborhoods are safe to enter for search and rescue.',
    scienceFact:
      'SAR satellites like Sentinel-1 can image through smoke, clouds, and at night — ' +
      'making them critical tools for disaster response when optical cameras cannot see the ground.',
    sourceLabel: 'NASA Earthdata — SAR for Disaster Response',
    sourceUrl: 'https://earthdata.nasa.gov/learn/backgrounders/sar',
    badge: 'Safe House Finder',
    badgeImage: 'badge-safehouse.png',
    opticalImageUrl: 'assets/images/house-intact.png',
    opticalImageCredit: 'AP Photo / Chris Pizzello',
    sarImageUrl: 'assets/images/sar-chip-intact.png',
    sarImageCredit: 'ICEYE SAR Image (2025)',
  },
  {
    id: 'forest-vegetation',
    tileX: 46,
    tileY: 7,
    triggerRadius: 1,
    title: 'Forest & Vegetation',
    sarDescription: 'Observation: A fuzzy region with no dominant color',
    body:
      'Forests & vegetation scatter radar in a unique way called "volume scattering." ' +
      'The signal bounces through branches, leaves, & trunks before returning to the satellite. This creates a fuzzy texture in SAR. ' +
      'Since the signal scatters in many directions, and there is no dominant color, we know it is a natural area.',
    scienceFact:
      'NASA\'s NIFC (National Interagency Fire Center) uses SAR burn severity maps to guide reforestation ' +
      'efforts and predict mudslide risk after fires remove vegetation that holds hillsides in place.',
    sourceLabel: 'NASA Earthdata — Burn Severity Products',
    sourceUrl: 'https://earthdata.nasa.gov/learn/backgrounders/wildfires',
    badge: 'Forest Watcher',
    badgeImage: 'badge-forestwatch.png',
    opticalImageUrl: 'assets/images/forest.png',
    opticalImageCredit: 'AllTrails, Monique Thomas 2022',
    sarImageUrl: 'assets/images/sar-chip-forest.png',
    sarImageCredit: 'ICEYE SAR Image (2025)',
  },
]
