# Stella 🛰️

An educational browser-based RPG where players guide Stella (a German Shepherd satellite scientist) through a SAR satellite image of the 2025 LA wildfire to learn Earth observation science.

**Tech:** Phaser 3 · TypeScript · Vite

---

## Getting Started

### 1. Install Node.js

Download from [nodejs.org](https://nodejs.org) (LTS version recommended).

### 2. Install dependencies

```bash
cd RPG
npm install
```

### 3. Add your SAR image

Place your SAR image at:
```
public/assets/images/sar-map.png
```

Then update the map dimensions in `src/constants.ts`:
```ts
export const MAP_WIDTH_TILES = 64   // imageWidthPx / 32
export const MAP_HEIGHT_TILES = 64  // imageHeightPx / 32
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Update discovery point coordinates

Open `src/data/discoveryPoints.ts` and update `tileX` / `tileY` for each discovery point to match where those features appear in your SAR image.

---

## Project Structure

```
src/
├── main.ts                  # Phaser game config, registers scenes
├── constants.ts             # Tile size, map dims, HP/XP values — edit here
├── scenes/
│   ├── BootScene.ts         # Loads assets, shows loading bar
│   ├── GameScene.ts         # Core gameplay: map, Stella, discovery
│   └── HudScene.ts          # HP/XP/level/badge overlay (parallel scene)
├── objects/
│   ├── Stella.ts            # Avatar sprite + tile movement
│   └── DiscoveryPoint.ts    # Glowing ? markers on the map
├── ui/
│   └── DiscoveryPopup.ts    # DOM popup shown on discovery
└── data/
    └── discoveryPoints.ts   # All 4 discovery point definitions
```

---

## Controls

| Key | Action |
|---|---|
| Arrow keys | Move Stella one tile |
| Walk near `?` | Triggers discovery popup |

---

## Build for deployment

```bash
npm run build
```

Output goes to `dist/`. Deploy anywhere that serves static files (GitHub Pages, Netlify, Vercel).

For GitHub Pages, `base: './'` is already set in `vite.config.ts`.

---

## License

MIT
