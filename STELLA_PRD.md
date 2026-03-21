# Stella — Product Requirements Document
**Version:** 0.1 (MVP)
**Date:** 2026-03-20
**Author:** Dr. Shay Strong
**Status:** Draft

---

## 1. Overview

**Stella** is a browser-based 2D top-down pixel RPG educational game for students grades 4–12. Players guide Stella — a German Shepherd and beloved scientific companion to Dr. Shay — as she rides a satellite radar beam down to Earth to investigate a wildfire disaster zone using satellite imagery. The game teaches real Earth observation science (Synthetic Aperture Radar, optical imagery, change detection) through exploration, discovery, and classification challenges — all wrapped in a fun, slightly irreverent narrative.

---

## 2. Mission Statement

Make satellite remote sensing science accessible, memorable, and genuinely fun for kids. Use an RPG framework to turn passive learning into active investigation. Build a reusable game engine that supports future "chapters" set in different disaster scenarios.

---

## 3. Target Audience

| Segment | Age | Context |
|---|---|---|
| Primary | Grades 4–8 (9–14 yrs) | Classroom or independent play |
| Secondary | Grades 9–12 (14–18 yrs) | Science enrichment, after-school |
| Facilitators | Teachers, parents | Guided or unguided |

**Design principle:** Simple enough for a 4th grader to pick up immediately. Layered enough that a high schooler finds it scientifically interesting.

---

## 4. The Story — Chapter 1: The Wildfire

### Setup
Dr. Shay is a satellite data scientist. Her dog Stella is a German Shepherd who is intensely curious, a bit much, and absolutely obsessed with having a job. ("She's a shepherd. She needs to herd something.") Dr. Shay sends Stella on satellite expeditions partly for science, partly so Stella will sleep at night.

### Chapter 1 Brief
A wildfire has devastated a neighborhood in Los Angeles. The smoke is too thick for planes and helicopters to see through. But Stella's satellite uses **Synthetic Aperture Radar (SAR)** — which emits its own longer-wavelength signal that cuts right through smoke and haze — to image the scene.

Dr. Shay dispatches Stella with a mission: **investigate the scene, classify what you find, and bring back ground truth so first responders and scientists can help the people affected evacuate and rebuild.**

### Tone
- Warm but not saccharine
- Stella is earnest, enthusiastic, occasionally over-the-top
- Dr. Shay is smart, empathetic, very quantitative, funny, proud of her weird dog
- Science is treated as exciting and accessible, never dumbed down. Let's explain the hard stuff in a way people will understand and resonsate with.
- Humor comes from character, not from talking down to kids

### Future Chapters (roadmap, not MVP)
- Chapter 2: The Volcano Eruption
- Chapter 3: The Flood
- Chapter 4: The Conflict Zone

---

## 5. Core Gameplay Loop

```
Intro cinematic (beam-down) from the satellite that is in low earth orbit (LEO). We simulat a wavelength os light that Stella rides down to Earth.
        ↓
Stella lands on SAR image map in LA.
        ↓
Explore → reach Discovery Point
        ↓
Learn (popup: SAR explanation + optical photo comparison)
        ↓
Earn Discovery Badge
        ↓
Complete Classification Mission (find 5 similar features)
        ↓
Earn Mission Badge + Level Up
        ↓
Dr. Shay sends a funny message / Stella gets a treat (dog donuts)
        ↓
Repeat for all 4 Discovery Points
        ↓
End screen: mission debrief, all badges displayed
```

---

## 6. Intro Cinematic — The Beam-Down

**Goal:** Set the scene, explain SAR science, create excitement.

**Sequence:**
1. Black screen. Text: *"Los Angeles. January 2025. The wildfires are burning. They spread rapidly, forcing people to leave their homes quickly. No one can get back to the neighborhood to see the damage. Only a satellite that is safely away from the scene can 'remotely sense' what is happening."*
2. View from space — a satellite graphic orbiting Earth.
3. Dr. Shay's face appears (pixel art portrait). She briefs Stella: *"The smoke is too thick for regular optical cameras. They need light to work — and the smoke blocks it. But our radar? It makes its own beam, like a flashlight from space. And it uses a much longer wavelength than visible light. Think of wavelength like leg length on a dog. A dog with really long legs can leap right over a log. A corgi? That log is a problem. Smoke particles are the log — they stop short wavelengths cold. But our radar's wavelength is long enough to clear them completely. We can see straight through to the ground. Nobody else can right now. Go find out what happened down there, Stella."*
4. Stella's portrait appears. She looks extremely ready. Maybe too ready. Her ears perk and she twists her head to one side intently watching.
5. The satellite fires a radar beam toward Earth — visualized as a cone/flashlight of light cutting through a cloud layer.
6. Stella rides the beam down.
7. Camera zooms from orbital view → regional → neighborhood scale, landing on the SAR image.
8. Stella sprite appears on the map. Game begins.

**Science embedded:** SAR active sensor concept, longer wavelength penetration of smoke/clouds.

---

## 7. The Map

### Base Layer
- Static SAR image of the LA wildfire area (player-provided GeoTIFF or high-res image)
- Rendered as the ground plane — the world Stella walks on
- Divided into a **tile grid** for movement (e.g., 32×32px tiles)
- Top-down 2D view

### Overlay Layer
- Optical imagery available as a **toggle or popup** — not always visible
- Revealed contextually at Discovery Points to show the comparison between what SAR sees vs. what optical sees

### Tile Properties
- Walkable / non-walkable zones defined in a tile map
- Discovery Points marked with subtle visual indicator (e.g., glowing dot or small icon) visible on the map
- Challenge Points marked separately (simple dot)

---

## 8. Discovery Points (4 total — Chapter 1)

Discovery Points are pre-placed locations on the SAR map. When Stella walks near one, a popup is triggered automatically.

### Discovery Point 1 — Burnt Building
| | |
|---|---|
| **What Stella finds** | A building destroyed by the wildfire |
| **SAR appearance** | Low backscatter — dark patch (fire destroys the corner reflectors that normally bounce signal back strongly). We also use the concept of 'color subaperture image' (CSI): in the image, anything with a strong color is likely manmade with a strong geometric backscatter to the satellite. If there is no clear color, it is because there is only rubble and the scatter is going in many different directions. |
| **Popup content** | Simple text explanation of why burnt structures look dark in SAR + ground-level optical photo of the actual site |
| **Optical comparison** | Aerial or street-level photo showing ash, rubble |
| **Science fact** | Sourced from Cal Fire / USGS fire perimeter data |
| **Badge earned** | "Burnt Zone Scout" patch |

### Discovery Point 2 — Intact Building
| | |
|---|---|
| **What Stella finds** | A building that survived the fire |
| **SAR appearance** | High backscatter — bright return from corner reflector (wall + ground = double bounce), strong color return from the CSI image. |
| **Popup content** | Explanation of double-bounce scattering + optical photo |
| **Optical comparison** | Photo of intact standing structure |
| **Science fact** | SAR can identify surviving structures for search & rescue prioritization |
| **Badge earned** | "Safe House Finder" patch |

### Discovery Point 3 — Intact Sports Field
| | |
|---|---|
| **What Stella finds** | A sports field (grass, open area) that was not burned |
| **SAR appearance** | Medium, relatively uniform backscatter — smooth surface scattering |
| **Popup content** | Explanation of how flat open surfaces scatter differently than buildings + optical photo |
| **Optical comparison** | Aerial photo showing the field |
| **Science fact** | Open areas used as staging grounds for emergency response |
| **Badge earned** | "Open Ground Analyst" patch |

### Discovery Point 4 — Forest / Vegetation
| | |
|---|---|
| **What Stella finds** | A forested area, some burnt, some surviving |
| **SAR appearance** | Variable backscatter — volume scattering from canopy; burnt areas darker |
| **Popup content** | Explanation of volume scattering in vegetation, why healthy vs. burnt vegetation looks different in SAR + optical photo |
| **Optical comparison** | Photo of burn scar vs. surviving trees |
| **Science fact** | Sourced from NASA Earthdata vegetation burn severity products |
| **Badge earned** | "Forest Watcher" patch |

---

## 9. Classification Missions (4 total — one per Discovery Point)

After earning a Discovery Badge, Stella is given a **Classification Mission**: find and correctly identify 5 similar features on the map using her new knowledge.

### Mechanics
- Challenge Points appear as simple dots on the map
- Stella walks up to a dot and clicks/taps to classify it
- A multiple-choice prompt appears: *"What do you think this is?"* (3 options)
- **Correct:** Points awarded, dot resolved
- **Incorrect:** Stella loses health points + a short corrective explanation is shown
- Health can be regenerated by revisiting Discovery Points for a "refresher"
- Complete all 5 → earn Mission Badge

### Example Mission (Burnt Building)
*"Stella thinks she's spotted more burnt buildings. Help her confirm. Find and classify 5 burnt structures in the scene."*

| Outcome | Effect |
|---|---|
| Correct classification | +XP, dot cleared |
| Wrong classification | -HP, brief science correction shown |
| Health reaches zero | Stella "calls Dr. Shay for help" — hint given, health restored to 50% |
| All 5 classified | Mission Badge earned, level up triggered |

---

## 10. Progression & Rewards

### Badges
Earned as retro embroidered-style pixel patches that appear on **Stella's backpack** in the HUD.

| Badge | Trigger |
|---|---|
| Discovery Badge (×4) | Reach and complete each Discovery Point |
| Mission Badge (×4) | Complete all 5 classifications for each mission |
| Chapter Complete Badge | All 8 badges earned |

### Leveling Up
- Stella gains a level after each completed Mission Badge
- **Level up trigger:** Dr. Shay sends a funny in-game message (pixel portrait popup)
- Dr. Shay message examples:
  - *"Good girl. I knew you'd find it. Now please come home and sleep."*
  - *"Impressive. The scientists are very impressed. The couch is still not yours."*
  - *"You've earned this. [Treat icon appears] Don't tell me you ate it already."*
- Stella also receives a virtual dog treat item (cosmetic, displayed in HUD inventory)

### Stats (HUD)
Displayed at all times during gameplay:

| Stat | Description |
|---|---|
| HP (Health) | Lost on wrong classifications, restored at Discovery Points |
| XP / Level | Increases with correct classifications and discoveries |
| Badges | Backpack patch count |
| Treats | Count of treats received from Dr. Shay |

---

## 11. HUD Layout (Top-Down 2D)

```
┌─────────────────────────────────────────────────────────┐
│  [Stella portrait]  HP: ████░░  XP: ██░░  Lv: 2         │
│  Badges: 🟡🟡🟡░░░░░   Treats: 🦴🦴░                     │
└─────────────────────────────────────────────────────────┘
                    [ MAP / GAME WORLD ]
┌─────────────────────────────────────────────────────────┐
│  [Mini-map]                          [Backpack / Badges] │
└─────────────────────────────────────────────────────────┘
```

---

## 12. Popup / Discovery Card Design

Each popup contains:
1. **Header:** Feature name (e.g., "Burnt Building")
2. **SAR image crop** — zoomed view of the feature
3. **Optical photo** — ground-level or aerial photo for comparison
4. **Explanation** — 2–4 sentences, written for a 4th–6th grade reading level
5. **Fun fact** — one surprising or dramatic fact about the wildfire (cited)
6. **Source link** — small "Learn more →" linking to USGS / NASA Earthdata / Cal Fire / news article
7. **[Close]** button

**Citation policy:** All wildfire facts must cite source. Sources: USGS, NASA Earthdata, Cal Fire, AP/Reuters reporting on the 2025 LA wildfires.

---

## 13. Technical Approach

### Platform
- Browser-based (desktop + tablet priority, mobile stretch goal)
- No install required — shareable URL for classrooms

### Recommended Stack
| Component | Recommendation | Rationale |
|---|---|---|
| Game engine | **Phaser 3** | Leading open-source 2D browser game framework; large community; excellent tile map support; MIT license |
| Language | **JavaScript / TypeScript** | Runs in browser natively; TypeScript adds safety for a solo dev |
| Tile maps | **Tiled Map Editor** | Free, open-source; exports JSON compatible with Phaser |
| Pixel art / sprites | **Aseprite** (paid, ~$20) or **Libresprite** (free fork) | Industry standard for pixel art sprites and animation |
| Image serving | Static file hosting (GitHub Pages, Netlify, or Vercel) | Simple, free, no backend needed |
| Fonts | Press Start 2P (Google Fonts) | Free retro pixel font |

### Art Style Reference
- Top-down 2D pixel art (Stardew Valley / classic Zelda LTTP aesthetic)
- Tile size: 32×32px or 16×16px
- Satellite image serves as ground plane (no additional terrain art needed for MVP)
- UI elements (HUD, popups, portraits) in pixel art style

### Open Source
- License: MIT
- Repository: GitHub (public)
- All assets to be original or Creative Commons licensed

---

## 14. MVP Scope

### In Scope
- [x] Intro cinematic / beam-down sequence
- [x] Stella sprite on SAR image map, tile-based movement
- [x] 4 Discovery Points with popup cards (text + optical photo)
- [x] 4 Classification Missions (5 challenges each)
- [x] HP / XP / Badge HUD
- [x] Badge backpack display
- [x] Level-up + Dr. Shay message system
- [x] End screen / mission debrief

### Out of Scope (MVP)
- [ ] Multiple chapters / worlds
- [ ] Mobile touch optimization
- [ ] User accounts / progress saving
- [ ] Multiplayer
- [ ] Audio / music (nice to have, not required)
- [ ] Animated Stella sprite (static facing directions acceptable for MVP)
- [ ] Accessibility features (future iteration)

---

## 15. Content & Asset Checklist

| Asset | Status |
|---|---|
| SAR image of LA wildfire area | Available (player-provided) |
| Optical overlay image | TBD — to be sourced |
| Ground-level photos (4 discovery points) | TBD — to be sourced |
| Stella pixel sprite | TBD — to be created |
| Dr. Shay pixel portrait | TBD — to be created |
| Badge patch designs (9 total) | TBD — to be created |
| Wildfire facts + citations | TBD — to be researched |
| Popup copy (4 discovery cards) | TBD — to be written |
| Mission prompt copy (4 missions) | TBD — to be written |
| Dr. Shay level-up messages | TBD — to be written |

---

## 16. Success Metrics (Qualitative — MVP)

Since this is a learning demo, success is measured by:
- Kids can complete the game without adult help
- Kids can correctly answer "what does a burnt building look like in SAR and why?" after playing
- Teachers report it as usable in a classroom setting
- Playtesters (target age 9–14) find it fun, not boring or too hard
- The concept is compelling enough to justify building Chapter 2

---

## 17. Open Questions

| Question | Priority |
|---|---|
| What are the exact coordinates / crop of the SAR image to use? | High |
| Do we have optical comparison imagery for all 4 discovery point locations? | High |
| What tile resolution works best for the SAR image dimensions? | High |
| What does Stella's sprite look like (pose, facing directions needed)? | Medium |
| Do we want background music / sound effects in MVP? | Low |
| Should HP reach-zero result in a "game over" screen or just a help prompt? | Medium |

---

*"Stella wants to use satellite imagery to alert first responders and scientists to help the people on the ground evacuate and rebuild. She will take this information back to her pack of scientists. She just also really needs a nap after."*

---
**End of PRD v0.1**
