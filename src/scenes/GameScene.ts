import Phaser from 'phaser'
import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE_SIZE, MAP_WIDTH_PX, MAP_HEIGHT_PX, MAX_HP, DISCOVERY_TRIGGER_RADIUS } from '../constants'
import { Stella } from '../objects/Stella'
import { DiscoveryPoint } from '../objects/DiscoveryPoint'
import { ChallengePoint } from '../objects/ChallengePoint'
import { showDiscoveryPopup } from '../ui/DiscoveryPopup'
import { showClassificationPopup } from '../ui/ClassificationPopup'
import { showIntroDialogue, triggerAdvance } from '../ui/IntroDialogue'
import { showEndScreen, showPigEarReveal } from '../ui/EndScreen'
import { DISCOVERY_POINTS } from '../data/discoveryPoints'
import { CLASSIFICATION_MISSION, ClassificationMission } from '../data/classificationMissions'

const HP_LOSS_PER_WRONG = 15
const XP_PER_CORRECT    = 40
const XP_PER_DISCOVERY  = 100

export class GameScene extends Phaser.Scene {
  private stella!: Stella
  private discoveryPoints: DiscoveryPoint[] = []
  private challengePoints: ChallengePoint[] = []
  private activeMission: ClassificationMission | null = null
  private missionProgress: number = 0
  private earnedBadges: Array<{ label: string; image: string }> = []
  private hp: number = MAX_HP
  private xp: number = 0
  private level: number = 1
  private badges: number = 0
  private treats: number = 0
  private popupOpen: boolean = false

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    // ── Map background ───────────────────────────────────
    const map = this.add.image(0, 0, 'sar-map').setOrigin(0, 0)

    if (!this.textures.exists('sar-map') || this.textures.get('sar-map').key === '__MISSING') {
      map.destroy()
      this.drawPlaceholderMap()
    }

    // ── Camera bounds ────────────────────────────────────
    this.cameras.main.setBounds(0, 0, MAP_WIDTH_PX, MAP_HEIGHT_PX)
    this.cameras.main.setViewport(0, 50, CANVAS_WIDTH, CANVAS_HEIGHT - 50)

    // ── Stella ───────────────────────────────────────────
    const startTileX = Math.floor(MAP_WIDTH_PX / TILE_SIZE / 2)
    const startTileY = Math.floor(MAP_HEIGHT_PX / TILE_SIZE / 2)
    this.stella = new Stella(this, startTileX, startTileY)
    this.cameras.main.startFollow(this.stella, true, 0.1, 0.1)

    // ── Discovery points ─────────────────────────────────
    this.discoveryPoints = DISCOVERY_POINTS.map((data) => new DiscoveryPoint(this, data))

    // ── Debug grid ───────────────────────────────────────
    this.drawDebugGrid()

    // ── HUD ──────────────────────────────────────────────
    this.scene.launch('HudScene')

    // ── Space bar — advance any open dialogue ─────────────
    this.input.keyboard!.on('keydown-SPACE', () => {
      triggerAdvance()
    })

    // ── Coordinate picker ─────────────────────────────────
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const worldX = pointer.worldX
      const worldY = pointer.worldY
      const tileX = Math.floor(worldX / TILE_SIZE)
      const tileY = Math.floor(worldY / TILE_SIZE)
      console.log(`📍 Clicked tile — tileX: ${tileX}, tileY: ${tileY}  (pixel: ${Math.floor(worldX)}, ${Math.floor(worldY)})`)
      this.events.emit('coords-clicked', tileX, tileY)
      this.showCoordToast(tileX, tileY)
    })

    this.emitStats()
  }

  update() {
    if (this.popupOpen) return
    this.stella.update()
    this.checkDiscoveries()
    if (this.activeMission) this.checkChallenges()
    this.events.emit('coords-changed', this.stella.tileX, this.stella.tileY)
    this.emitTargetDirection()
  }

  // ── Discovery proximity check ─────────────────────────
  private checkDiscoveries() {
    for (const point of this.discoveryPoints) {
      if (point.triggered) continue

      const dx = Math.abs(this.stella.tileX - point.pointData.tileX)
      const dy = Math.abs(this.stella.tileY - point.pointData.tileY)

      if (dx <= DISCOVERY_TRIGGER_RADIUS && dy <= DISCOVERY_TRIGGER_RADIUS) {
        point.markDiscovered()
        this.openDiscoveryPopup(point)
        break
      }
    }
  }

  private openDiscoveryPopup(point: DiscoveryPoint) {
    this.popupOpen = true
    this.scene.pause()

    showDiscoveryPopup(point.pointData, () => {
      this.badges += 1
      this.earnedBadges.push({ label: point.pointData.badge, image: point.pointData.badgeImage })
      this.xp += XP_PER_DISCOVERY
      this.checkLevelUp()
      this.emitStats()
      this.scene.resume()
      this.popupOpen = false

      // Start the final classification mission once all discoveries are done
      const allDiscovered = this.discoveryPoints.every((p) => p.triggered)
      if (allDiscovered && !this.activeMission) {
        this.startMission(CLASSIFICATION_MISSION)
      }
    })
  }

  // ── Mission start ─────────────────────────────────────
  private startMission(mission: ClassificationMission) {
    this.activeMission = mission
    this.missionProgress = 0
    this.popupOpen = true
    this.scene.pause()

    showIntroDialogue(
      {
        speaker: 'DR. SHAY',
        portrait: 'shay-talk',
        lines: [mission.briefing, `Find the ${mission.points.length} orange ! markers on the map.`],
      },
      () => {
        this.scene.resume()
        this.popupOpen = false
        // Spawn challenge points only after player dismisses briefing
        this.challengePoints = mission.points.map((p) => new ChallengePoint(this, p))
        this.events.emit('mission-started', mission.points.length)
      }
    )
  }

  // ── Challenge proximity check ─────────────────────────
  private checkChallenges() {
    for (const cp of this.challengePoints) {
      if (cp.resolved) continue

      const dx = Math.abs(this.stella.tileX - cp.pointData.tileX)
      const dy = Math.abs(this.stella.tileY - cp.pointData.tileY)

      if (dx <= DISCOVERY_TRIGGER_RADIUS && dy <= DISCOVERY_TRIGGER_RADIUS) {
        this.openClassificationPopup(cp)
        break
      }
    }
  }

  private openClassificationPopup(cp: ChallengePoint) {
    if (!this.activeMission) return
    this.popupOpen = true
    this.scene.pause()

    showClassificationPopup(cp.pointData, this.activeMission.question, (result) => {
      this.scene.resume()
      this.popupOpen = false

      if (result.correct) {
        cp.markResolved(true)
        this.xp += XP_PER_CORRECT
        this.missionProgress += 1
        this.checkLevelUp()
        this.emitStats()
      } else {
        cp.markResolved(false)
        this.hp = Math.max(0, this.hp - HP_LOSS_PER_WRONG)
        this.emitStats()

        if (this.hp <= 0) {
          this.triggerRescue()
        } else if (this.treats > 0) {
          this.offerTreatHeal()
        }
      }

      // Mission ends when every point has been visited (correct or not)
      const allVisited = this.challengePoints.every((c) => c.resolved)
      if (allVisited) {
        this.completeMission()
      } else {
        const remaining = this.challengePoints.filter((c) => !c.resolved).length
        const color = result.correct ? '#00ff88' : '#ff4444'
        const bg    = result.correct ? '#001a00' : '#1a0000'
        this.showToast(
          result.correct ? `CORRECT! ${remaining} left.` : `WRONG. ${remaining} left.`,
          color, bg, color
        )
      }
    })
  }

  // ── Mission complete ──────────────────────────────────
  private completeMission() {
    const mission = this.activeMission!
    this.activeMission = null
    this.badges += 1
    this.earnedBadges.push({ label: mission.missionBadge, image: mission.missionBadgeImage })
    this.emitStats()
    this.showEndSequence()
  }

  // ── End sequence: dialogue → beam-up → badges screen ──
  private showEndSequence() {
    this.popupOpen = true
    this.scene.pause()

    // Step 1 — mission success
    showIntroDialogue(
      {
        speaker: 'DR. SHAY',
        portrait: 'shay-talk',
        lines: [
          'Stella. You did it!',
          'Every location documented and classified. The science team has everything they need to help with the recovery.',
        ],
      },
      () => {
        // Step 2 — proud moment
        showIntroDialogue(
          {
            speaker: 'DR. SHAY',
            portrait: 'shay',
            lines: [
              'You are the best dog ever! I am so proud of you!',
              'Not just because you got the data. Because you used what you learned to help me.',
            ],
          },
          () => {
            // Step 3 — pig ear
            showIntroDialogue(
              {
                speaker: 'DR. SHAY',
                portrait: 'shay-talk',
                lines: [
                  'I also got you something.',
                  'You have been requesting it for four years since we have been in space.',
                  'The world\'s largest pig ear. I had to special order it.',
                  'Sit...',
                  'Wait...',
                  'OK! It\'s yours.',
                ],
              },
              () => {
                // Step 4 — Stella reacts
                showIntroDialogue(
                  {
                    speaker: 'STELLA',
                    portrait: 'stella-mouthopen',
                    lines: ['...', '(Stella has already eaten the pig ear in one chomp.)'],
                  },
                  () => {
                    // Award pig ear badge + treat + XP
                    this.treats += 1
                    this.xp += 100
                    this.badges += 1
                    this.earnedBadges.push({ label: 'Pig Ear Champion', image: 'badge-pigear.png' })
                    this.emitStats()
                    this.scene.resume()
                    this.popupOpen = false
                    // Show the badge large before beam-up
                    showPigEarReveal(() => {
                      this.playBeamUp()
                    })
                  }
                )
              }
            )
          }
        )
      }
    )
  }

  // ── Beam-up animation ─────────────────────────────────
  private playBeamUp() {
    this.cameras.main.stopFollow()

    // Beam of light over Stella
    const beam = this.add.rectangle(
      this.stella.x, this.stella.y - 200,
      28, 500,
      0xffffaa, 0.6
    ).setDepth(10)

    // Shrink Stella upward and fade out
    this.tweens.add({
      targets: this.stella,
      y: this.stella.y - 300,
      alpha: 0,
      scaleX: 0.1,
      scaleY: 0.1,
      duration: 1400,
      ease: 'Cubic.easeIn',
    })

    // Fade the beam out after Stella is gone
    this.tweens.add({
      targets: beam,
      alpha: 0,
      duration: 1800,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        beam.destroy()
        // Fade canvas to black then show end screen
        this.cameras.main.fadeOut(600, 0, 0, 0)
        this.cameras.main.once('camerafadeoutcomplete', () => {
          showEndScreen(this.earnedBadges)
        })
      },
    })
  }

  // ── HP rescue (reaches zero) ──────────────────────────
  private triggerRescue() {
    this.hp = Math.floor(MAX_HP * 0.5)
    this.emitStats()

    const toast = document.createElement('div')
    toast.style.cssText = `
      position: fixed;
      bottom: 32px; left: 50%;
      transform: translateX(-50%);
      background: #1a0000;
      border: 3px solid #ff4444;
      padding: 16px 24px;
      font-family: "Press Start 2P", monospace;
      font-size: 8px; color: #ff4444;
      line-height: 2.2; text-align: center;
      z-index: 200; max-width: 440px;
      white-space: pre-line;
    `
    toast.innerHTML = `<strong>DR. SHAY:</strong><br>Stella, you're losing altitude. Focus.<br>
      Remember: <span style="color:#ffff00;">no strong color = fire damage.</span><br>
      HP restored to 50%.`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 5000)
  }

  // ── Treat heal offer ─────────────────────────────────
  private offerTreatHeal() {
    this.popupOpen = true
    this.scene.pause()

    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: center;
    `
    const card = document.createElement('div')
    card.style.cssText = `
      background: #1a0a00;
      border: 3px solid #ffaa00;
      padding: 28px 32px;
      max-width: 420px;
      width: 92%;
      font-family: "Press Start 2P", monospace;
      color: #ffffff;
      text-align: center;
    `
    card.innerHTML = `
      <p style="font-size:8px; color:#ffaa00; margin-bottom:12px; letter-spacing:1px;">[ WRONG ANSWER ]</p>
      <p style="font-size:8px; line-height:2.2; color:#dddddd; margin-bottom:20px;">
        Stella looks a little defeated.<br>
        You have <span style="color:#ffaa00;">${this.treats} treat${this.treats !== 1 ? 's' : ''}</span> left.<br>
        Eat one to restore <span style="color:#ff4444;">+${HP_LOSS_PER_WRONG} HP</span>?
      </p>
    `

    const eatBtn = document.createElement('button')
    eatBtn.style.cssText = `
      display: block; width: 100%;
      background: #ffaa00; color: #000000;
      border: none; padding: 12px; margin-bottom: 10px;
      font-family: "Press Start 2P", monospace;
      font-size: 9px; cursor: pointer; letter-spacing: 1px;
    `
    eatBtn.textContent = '[ EAT A TREAT ]'
    eatBtn.addEventListener('click', () => {
      this.treats -= 1
      this.hp = Math.min(MAX_HP, this.hp + HP_LOSS_PER_WRONG)
      this.emitStats()
      overlay.remove()
      this.scene.resume()
      this.popupOpen = false
    })

    const skipBtn = document.createElement('button')
    skipBtn.style.cssText = `
      display: block; width: 100%;
      background: transparent; color: #888888;
      border: 2px solid #444444; padding: 10px;
      font-family: "Press Start 2P", monospace;
      font-size: 8px; cursor: pointer; letter-spacing: 1px;
    `
    skipBtn.textContent = '[ KEEP GOING ]'
    skipBtn.addEventListener('click', () => {
      overlay.remove()
      this.scene.resume()
      this.popupOpen = false
    })

    card.appendChild(eatBtn)
    card.appendChild(skipBtn)
    overlay.appendChild(card)
    document.body.appendChild(overlay)
  }

  // ── Level up ──────────────────────────────────────────
  private checkLevelUp() {
    const xpPerLevel = 200
    const newLevel = Math.floor(this.xp / xpPerLevel) + 1
    if (newLevel > this.level) {
      this.level = newLevel
      this.treats += 1
      this.showDrShayMessage()
    }
  }

  private showDrShayMessage() {
    const messages = [
      'Great job. I knew you\'d find it.\nWhat\'s next?',
      'Impressive. But you are not done yet!',
      'You\'ve earned this. A treat is waiting.\nDon\'t tell me you ate it already. Savor the flavor.',
      'Outstanding work, Stella.\nSeriously. Stop running. You\'re fine.',
    ]
    const msg = messages[(this.level - 2) % messages.length]
    const toast = document.createElement('div')
    toast.style.cssText = `
      position: fixed;
      bottom: 32px; left: 50%;
      transform: translateX(-50%);
      background: #1a0a00;
      border: 3px solid #ffaa00;
      padding: 16px 24px;
      font-family: "Press Start 2P", monospace;
      font-size: 8px; color: #ffaa00;
      line-height: 2.2; text-align: center;
      z-index: 200; max-width: 400px;
      white-space: pre-line;
    `
    toast.innerHTML = `<strong>DR. SHAY:</strong><br>${msg}<br><br>LEVEL ${this.level}!`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 4000)
  }

  // ── Generic toast ─────────────────────────────────────
  private showToast(msg: string, color: string, bg: string, border: string) {
    const toast = document.createElement('div')
    toast.style.cssText = `
      position: fixed;
      top: 70px; right: 12px;
      background: ${bg};
      border: 2px solid ${border};
      padding: 8px 12px;
      font-family: "Press Start 2P", monospace;
      font-size: 7px; color: ${color};
      line-height: 2; z-index: 200;
    `
    toast.textContent = msg
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2500)
  }

  // ── Stats emit ────────────────────────────────────────
  private emitStats() {
    const xpPerLevel = 200
    this.events.emit('hp-changed', this.hp)
    this.events.emit('xp-changed', this.xp % xpPerLevel, xpPerLevel)
    this.events.emit('level-changed', this.level)
    this.events.emit('badges-changed', this.badges)
    this.events.emit('treats-changed', this.treats)
  }

  // ── Waypoint direction ────────────────────────────────
  // Emits the angle (radians) and tile distance to the nearest active target.
  // HudScene uses this to rotate the compass arrow.
  private emitTargetDirection() {
    let nearestDist = Infinity
    let nearestDx = 0
    let nearestDy = 0
    let type: 'discovery' | 'challenge' | 'none' = 'none'

    if (this.activeMission) {
      // Point toward nearest unresolved challenge
      for (const cp of this.challengePoints) {
        if (cp.resolved) continue
        const dx = cp.pointData.tileX - this.stella.tileX
        const dy = cp.pointData.tileY - this.stella.tileY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < nearestDist) {
          nearestDist = dist
          nearestDx = dx
          nearestDy = dy
          type = 'challenge'
        }
      }
    } else {
      // Point toward nearest undiscovered discovery point
      for (const dp of this.discoveryPoints) {
        if (dp.triggered) continue
        const dx = dp.pointData.tileX - this.stella.tileX
        const dy = dp.pointData.tileY - this.stella.tileY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < nearestDist) {
          nearestDist = dist
          nearestDx = dx
          nearestDy = dy
          type = 'discovery'
        }
      }
    }

    const angle = type === 'none' ? 0 : Math.atan2(nearestDy, nearestDx) + Math.PI / 2
    const distance = Math.round(nearestDist)
    this.events.emit('target-direction', { angle, distance, type })
  }

  // ── Coord toast ───────────────────────────────────────
  private showCoordToast(tileX: number, tileY: number) {
    const existing = document.getElementById('coord-toast')
    if (existing) existing.remove()

    const toast = document.createElement('div')
    toast.id = 'coord-toast'
    toast.style.cssText = `
      position: fixed;
      top: 60px; right: 12px;
      background: #001a00;
      border: 2px solid #00ff88;
      padding: 8px 12px;
      font-family: "Press Start 2P", monospace;
      font-size: 7px; color: #00ff88;
      line-height: 2; z-index: 200;
    `
    toast.innerHTML = `tileX: <strong>${tileX}</strong><br>tileY: <strong>${tileY}</strong>`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  // ── Placeholder map ───────────────────────────────────
  private drawPlaceholderMap() {
    const graphics = this.add.graphics()
    graphics.fillStyle(0x2a2a2a)
    graphics.fillRect(0, 0, MAP_WIDTH_PX, MAP_HEIGHT_PX)
    graphics.lineStyle(1, 0x3a3a3a, 0.5)
    for (let x = 0; x <= MAP_WIDTH_PX; x += TILE_SIZE) {
      graphics.lineBetween(x, 0, x, MAP_HEIGHT_PX)
    }
    for (let y = 0; y <= MAP_HEIGHT_PX; y += TILE_SIZE) {
      graphics.lineBetween(0, y, MAP_WIDTH_PX, y)
    }
    this.add
      .text(MAP_WIDTH_PX / 2, MAP_HEIGHT_PX / 2, 'ADD YOUR SAR IMAGE\nto public/assets/images/sar-map.png', {
        fontFamily: '"Press Start 2P"',
        fontSize: '12px',
        color: '#666666',
        align: 'center',
      })
      .setOrigin(0.5)
  }

  // ── Debug grid ────────────────────────────────────────
  private drawDebugGrid() {
    const graphics = this.add.graphics()
    graphics.lineStyle(1, 0xffffff, 0.05)
    for (let x = 0; x <= MAP_WIDTH_PX; x += TILE_SIZE) {
      graphics.lineBetween(x, 0, x, MAP_HEIGHT_PX)
    }
    for (let y = 0; y <= MAP_HEIGHT_PX; y += TILE_SIZE) {
      graphics.lineBetween(0, y, MAP_WIDTH_PX, y)
    }
  }
}
