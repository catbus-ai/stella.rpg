# Assets — Images

## sar-map.png

Place your SAR satellite image here as `sar-map.png`.

**Then update `src/constants.ts`:**

```ts
// Divide your image's pixel dimensions by TILE_SIZE (32) to get tile counts
export const MAP_WIDTH_TILES = 64   // e.g. 2048px / 32 = 64
export const MAP_HEIGHT_TILES = 64  // e.g. 2048px / 32 = 64
```

**Also update discovery point tile coordinates in `src/data/discoveryPoints.ts`:**

For each discovery point, find the feature in your image and calculate:
- `tileX = featurePixelX / 32` (round to nearest integer)
- `tileY = featurePixelY / 32`

## stella.png (future)

When a pixel art Stella sprite is ready, place it here and uncomment the
spritesheet loader in `src/scenes/BootScene.ts`.
