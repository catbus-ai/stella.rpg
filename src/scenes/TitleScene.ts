import Phaser from 'phaser'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants'

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' })
  }

  create() {
    // ── Background image ─────────────────────────────────
    const bg = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'title-image')
    // Scale to fill canvas while keeping aspect ratio
    const scaleX = CANVAS_WIDTH  / bg.width
    const scaleY = CANVAS_HEIGHT / bg.height
    bg.setScale(Math.max(scaleX, scaleY))

    // Dark overlay for text readability
    this.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0x000000, 0.6).setOrigin(0, 0)

    // ── Title ────────────────────────────────────────────
    this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.30, 'STELLA', {
      fontFamily: '"Press Start 2P"',
      fontSize: '48px',
      color: '#ffff00',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5)

    // ── Subtitle ─────────────────────────────────────────
    this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.30 + 64, 'A SAR SATELLITE ADVENTURE', {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      color: '#aaaaff',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5)

    // ── Author / year ─────────────────────────────────────
    this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.82, 'by Dr. Shay Strong  —  2026', {
      fontFamily: '"Press Start 2P"',
      fontSize: '7px',
      color: '#888888',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5)

    // ── Press SPACE hint ──────────────────────────────────
    const hint = this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.90, '[ PRESS SPACE TO START ]', {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      color: '#ffffff',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5)

    // Blink the hint
    this.tweens.add({
      targets: hint,
      alpha: { from: 1, to: 0.2 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // ── Input ─────────────────────────────────────────────
    this.input.keyboard!.once('keydown-SPACE', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('ChapterSelectScene')
      })
    })

    // Also allow click / tap
    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('ChapterSelectScene')
      })
    })

    // Fade in
    this.cameras.main.fadeIn(600, 0, 0, 0)
  }
}
