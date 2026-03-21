import Phaser from 'phaser'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants'
import { showIntroDialogue, triggerAdvance, removeIntroDialogue } from '../ui/IntroDialogue'

interface CinematicStep {
  type: 'text' | 'dialogue' | 'beam' | 'done'
  lines?: string[]
  speaker?: string
  portrait?: string  // any key from src/data/portraits.ts
  duration?: number
}

const STEPS: CinematicStep[] = [
  {
    type: 'text',
    lines: [
      'Los Angeles. January 2025.',
      '',
      'The wildfires have been burning for days.',
      '',
      'They spread rapidly, forcing thousands',
      'of people to flee their homes.',
      '',
      'The smoke is too thick for planes.',
      'Too dangerous for crews on the ground.',
      '',
      'Only a special satellite, safely in orbit,',
      'can see what is happening below.',
    ],
    duration: 5000,
  },
  {
    type: 'dialogue',
    speaker: 'DR. SHAY',
    portrait: 'shay-talk',
    lines: [
      'The smoke is too thick for regular cameras -',
      'it is like a thick blanket that prevents visbile light from getting through.',
      '',
      'But our radar satellite makes a special beam of light that passes through smoke.',
      'Like a strong flashlight from space.',
    ],
  },
  {
    type: 'dialogue',
    speaker: 'DR. SHAY',
    portrait: 'shay',
    lines: [
      'Radar waves have a much longer wavelength',
      'than visible light.',
      '',
      'Think of wavelength like the length of a dog\'s leg.',
      'The smoke is like a a big log.',
      'Your long German Shepherd legs can leap right over it.',
      'But a corgi? That log is a problem.',
    ],
  },
  {
    type: 'dialogue',
    speaker: 'STELLA',
    portrait: 'stella',
    lines: [
      '...',
      '?',
    ],
  },  
  {
    type: 'dialogue',
    speaker: 'DR. SHAY',
    portrait: 'shay-talk',
    lines: [
      'Smoke particles are the log.',
      'Our radar has the legs.',
      '',
      'We can jump straight over the smoke to the ground.',
      'Nobody else can right now.',
    ],
  },
   {
    type: 'dialogue',
    speaker: 'STELLA',
    portrait: 'stella-mouthopen',
    lines: [
      '...',
      '!!',
    ],
  }, 
  {
    type: 'dialogue',
    speaker: 'DR. SHAY',
    portrait: 'shay-talk',
    lines: [
      'Stella.',
      '',
      'I need you to go down there.',
      'Use the radar wavelength to find out what happened.',
      'Classify what you see.',
      '',
      'Bring back the ground truth.',
    ],
  },
  {
    type: 'dialogue',
    speaker: 'DR. SHAY',
    portrait: 'shay',
    lines: [
      'First responders are waiting.',
      'Scientists are waiting.',
      'The people of Los Angeles are waiting.',
      '',
      '...also you have been running circles',
      'in my office for three hours.',
      'This should give you something to do.',
    ],
  },
  {
    type: 'dialogue',
    speaker: 'STELLA',
    portrait: 'stella',
    lines: [
      '.',
      '..',
      '...',
      '',
      'ALREADY RUNNING.',
    ],
  },
  { type: 'beam' },
  { type: 'done' },
]

export class IntroScene extends Phaser.Scene {
  private stepIndex = 0
  private canAdvance = false
  private textGroup!: Phaser.GameObjects.Group
  private skipKey!: Phaser.Input.Keyboard.Key
  private advanceKey!: Phaser.Input.Keyboard.Key
  private hintText: Phaser.GameObjects.Text | null = null

  constructor() {
    super({ key: 'IntroScene' })
  }

  create() {
    this.textGroup = this.add.group()

    // ── Earth scene background ──────────────────────────
    const bg = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'earth-scene')
    const scale = Math.max(CANVAS_WIDTH / bg.width, CANVAS_HEIGHT / bg.height)
    bg.setScale(scale).setDepth(-1)

    // Dark overlay so text is always readable
    this.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0x000000, 0.8)
      .setOrigin(0, 0).setDepth(0)

    // Input
    this.skipKey    = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    this.advanceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    // Skip button (Phaser canvas, always visible)
    const skipBtn = this.add
      .text(CANVAS_WIDTH - 16, CANVAS_HEIGHT - 14, '[ ESC: SKIP INTRO ]', {
        fontFamily: '"Press Start 2P"',
        fontSize: '8px',
        color: '#555555',
        resolution: window.devicePixelRatio,
      })
      .setOrigin(1, 1).setDepth(100).setInteractive()

    skipBtn.on('pointerover', () => skipBtn.setColor('#aaaaaa'))
    skipBtn.on('pointerout',  () => skipBtn.setColor('#555555'))
    skipBtn.on('pointerdown', () => this.startGame())

    this.runStep()
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.skipKey)) {
      this.startGame()
      return
    }
    if (Phaser.Input.Keyboard.JustDown(this.advanceKey) && this.canAdvance) {
      // Dialogue steps are handled by DOM — delegate to triggerAdvance.
      // Opening text steps are handled by Phaser — call advanceStep().
      const step = STEPS[this.stepIndex]
      if (step?.type === 'dialogue') {
        triggerAdvance()
      } else {
        this.advanceStep()
      }
    }
  }

  shutdown() {
    removeIntroDialogue()
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  private advanceStep() {
    if (!this.canAdvance) return
    this.canAdvance = false
    this.stepIndex++
    this.clearText()
    this.runStep()
  }

  private clearText() {
    this.textGroup.clear(true, true)
    if (this.hintText) { this.hintText.destroy(); this.hintText = null }
  }

  private runStep() {
    const step = STEPS[this.stepIndex]
    if (!step) { this.startGame(); return }

    switch (step.type) {
      case 'text':     this.showOpeningText(step); break
      case 'dialogue': this.showDialogue(step);    break
      case 'beam':     this.showBeamSequence();    break
      case 'done':     this.startGame();           break
    }
  }

  private enableAdvance() {
    this.canAdvance = true
    this.showPhaserHint()
  }

  // Small Phaser-rendered hint for opening text screen only
  private showPhaserHint() {
    if (this.hintText) return
    this.hintText = this.add
      .text(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 32, '[ SPACE or CLICK to continue ]', {
        fontFamily: '"Press Start 2P"',
        fontSize: '9px',
        color: '#888888',
        resolution: window.devicePixelRatio,
      })
      .setOrigin(0.5).setDepth(50)

    this.tweens.add({
      targets: this.hintText,
      alpha: { from: 1, to: 0.25 },
      duration: 700, yoyo: true, repeat: -1,
    })

    // Also allow click on Phaser canvas to advance opening text
    this.input.once('pointerdown', () => { if (this.canAdvance) this.advanceStep() })
  }

  // ── Opening narration — Phaser canvas text (no dialogue box) ───────────────

  private showOpeningText(step: CinematicStep) {
    const lines  = step.lines ?? []
    const cx     = CANVAS_WIDTH / 2
    const lineH  = 30
    const startY = CANVAS_HEIGHT / 2 - (lines.length * lineH) / 2
    const dpr    = window.devicePixelRatio

    lines.forEach((line, i) => {
      const t = this.add
        .text(cx, startY + i * lineH, line, {
          fontFamily: '"Press Start 2P"',
          fontSize: '14px',
          color: '#dddddd',
          align: 'center',
          resolution: dpr,
        })
        .setOrigin(0.5).setAlpha(0).setDepth(10)

      this.textGroup.add(t)
      this.tweens.add({ targets: t, alpha: 1, duration: 500, delay: i * 240 })
    })

    const readyAfter = lines.length * 240 + 600
    this.time.delayedCall(readyAfter, () => this.enableAdvance())
  }

  // ── Dialogue — DOM overlay (always crisp) ───────────────────────────────────

  private showDialogue(step: CinematicStep) {
    showIntroDialogue(
      {
        speaker:  step.speaker ?? '',
        portrait: step.portrait ?? 'shay',
        lines:    step.lines ?? [],
      },
      () => {
        // Called when user clicks/presses space inside the DOM overlay
        this.stepIndex++
        this.runStep()
      }
    )

    // Let the Phaser keyboard listener also advance the DOM dialogue
    this.canAdvance = true
  }

  // ── Radar beam sequence — Phaser only ───────────────────────────────────────

  private showBeamSequence() {
    const satX      = CANVAS_WIDTH / 2
    const satY      = 60
    const dpr       = window.devicePixelRatio
    const beamWidth = 80

    // ── Satellite (drawn — no asset yet) ───────────────────────────────────
    const satGfx = this.add.graphics().setDepth(22)
    this.textGroup.add(satGfx)

    const drawSatellite = (glow: number) => {
      satGfx.clear()
      // Glow halo
      satGfx.fillStyle(0x44aaff, 0.06 + glow * 0.08)
      satGfx.fillCircle(satX, satY, 36)
      // Solar panel left
      satGfx.fillStyle(0x2255aa, 1)
      satGfx.fillRect(satX - 46, satY - 6, 28, 12)
      satGfx.fillStyle(0x4488ff, 0.6)
      satGfx.fillRect(satX - 44, satY - 4, 24, 8)
      // Solar panel right
      satGfx.fillStyle(0x2255aa, 1)
      satGfx.fillRect(satX + 18, satY - 6, 28, 12)
      satGfx.fillStyle(0x4488ff, 0.6)
      satGfx.fillRect(satX + 20, satY - 4, 24, 8)
      // Body
      satGfx.fillStyle(0x99bbdd, 1)
      satGfx.fillRect(satX - 16, satY - 10, 32, 20)
      // Antenna
      satGfx.lineStyle(2, 0xaaccff, 1)
      satGfx.lineBetween(satX + 6, satY - 10, satX + 14, satY - 24)
      satGfx.fillStyle(0xffffff, 1)
      satGfx.fillCircle(satX + 14, satY - 25, 3)
    }

    // Pulse glow on satellite
    let pulse = 0
    this.tweens.addCounter({
      from: 0, to: 1, duration: 700, yoyo: true, repeat: -1,
      onUpdate: t => { pulse = t.getValue() ?? 0; drawSatellite(pulse) },
    })
    drawSatellite(0)

    // ── "RADAR BEAM ACTIVE" label ───────────────────────────────────────────
    const label = this.add.text(satX, satY + 46, 'RADAR BEAM ACTIVE', {
      fontFamily: '"Press Start 2P"',
      fontSize: '13px',
      color: '#44aaff',
      resolution: dpr,
    }).setOrigin(0.5).setDepth(22)
    this.textGroup.add(label)

    // ── Beam grows downward ─────────────────────────────────────────────────
    const beam = this.add.graphics().setDepth(14)
    this.textGroup.add(beam)

    this.tweens.addCounter({
      from: 0, to: 1, duration: 2400, ease: 'Sine.easeIn',
      onUpdate: tween => {
        const p = tween.getValue() ?? 0
        beam.clear()
        // Outer cone
        beam.fillStyle(0x44aaff, 0.08 + pulse * 0.06)
        beam.fillTriangle(
          satX,     satY + 20,
          satX - beamWidth * p, CANVAS_HEIGHT * p,
          satX + beamWidth * p, CANVAS_HEIGHT * p
        )
        // Inner bright column
        beam.fillStyle(0x88ddff, 0.18 + pulse * 0.1)
        beam.fillTriangle(
          satX,              satY + 20,
          satX - 6 * p,      CANVAS_HEIGHT * p,
          satX + 6 * p,      CANVAS_HEIGHT * p
        )
        // Center line
        beam.lineStyle(1, 0xcceeff, 0.6 * p)
        beam.lineBetween(satX, satY + 20, satX, CANVAS_HEIGHT * p)
      },
    })

    // ── Stella rides the beam down ──────────────────────────────────────────
    this.time.delayedCall(1400, () => {
      // "Stella is on her way" text
      const rideText = this.add.text(satX, CANVAS_HEIGHT / 2 - 60, 'STELLA IS ON HER WAY...', {
        fontFamily: '"Press Start 2P"',
        fontSize: '14px',
        color: '#ffff00',
        resolution: dpr,
      }).setOrigin(0.5).setAlpha(0).setDepth(22)
      this.textGroup.add(rideText)
      this.tweens.add({ targets: rideText, alpha: 1, duration: 500 })

      // Stella sprite — walk image, scaled to ~70px tall
      const stellaImg = this.add.image(satX, satY + 30, 'stella-walk')
      const stellaScale = 70 / stellaImg.height
      stellaImg.setScale(stellaScale).setOrigin(0.5, 0).setDepth(21).setAlpha(0)
      this.textGroup.add(stellaImg)

      // Fade in then ride the beam to the bottom
      this.tweens.add({
        targets: stellaImg,
        alpha: 1,
        duration: 300,
        onComplete: () => {
          this.tweens.add({
            targets: stellaImg,
            y: CANVAS_HEIGHT + 40,
            duration: 2200,
            ease: 'Cubic.easeIn',
          })
          // Slight left-right wobble as she descends
          this.tweens.add({
            targets: stellaImg,
            x: { from: satX - 6, to: satX + 6 },
            duration: 300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          })
        },
      })
    })

    this.time.delayedCall(4200, () => {
      this.cameras.main.fade(800, 0, 0, 0)
      this.time.delayedCall(800, () => this.startGame())
    })
  }

  private startGame() {
    removeIntroDialogue()
    this.cameras.main.fade(500, 0, 0, 0)
    this.time.delayedCall(500, () => this.scene.start('GameScene'))
  }
}
