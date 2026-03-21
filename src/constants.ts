// Tile grid
export const TILE_SIZE = 32 // pixels per tile

// Map dimensions — derived from sar_fire.png (1856 × 1360 px)
// Formula: MAP_WIDTH_TILES = imageWidthPx / TILE_SIZE (round down)
export const MAP_WIDTH_TILES = 58  // 1856 / 32
export const MAP_HEIGHT_TILES = 42 // 1360 / 32 (floor)
export const MAP_WIDTH_PX = MAP_WIDTH_TILES * TILE_SIZE   // 2048
export const MAP_HEIGHT_PX = MAP_HEIGHT_TILES * TILE_SIZE // 2048

// Viewport / canvas
export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600

// Stella stats
export const MAX_HP = 100
export const WRONG_ANSWER_HP_COST = 20
export const REVISIT_HP_RESTORE = 30

// Movement
export const MOVE_DURATION_MS = 120 // ms per tile step — adjust for feel

// Discovery
export const DISCOVERY_TRIGGER_RADIUS = 1 // tiles
