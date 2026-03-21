import Phaser from 'phaser'
import { CANVAS_WIDTH, MAX_HP } from '../constants'

const HUD_HEIGHT = 50
const BAR_WIDTH = 120
const BAR_HEIGHT = 14

export class HudScene extends Phaser.Scene {
  private hpFill!: Phaser.GameObjects.Rectangle
  private xpFill!: Phaser.GameObjects.Rectangle
  private levelText!: Phaser.GameObjects.Text
  private badgeText!: Phaser.GameObjects.Text
  private treatText!: Phaser.GameObjects.Text
  private coordText!: Phaser.GameObjects.Text
  private arrowContainer!: Phaser.GameObjects.Container
  private arrowGraphics!: Phaser.GameObjects.Graphics
  private arrowDistText!: Phaser.GameObjects.Text
  private arrowTypeText!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'HudScene' })
  }

  create() {
    // Dark semi-transparent bar across the top
    this.add.rectangle(0, 0, CANVAS_WIDTH, HUD_HEIGHT, 0x000000, 0.8).setOrigin(0, 0)

    // ── HP ──────────────────────────────────────────────
    this.add.text(10, 10, 'HP', { fontFamily: '"Press Start 2P"', fontSize: '8px', color: '#ff4444' })
    this.add.rectangle(40, 10, BAR_WIDTH, BAR_HEIGHT, 0x440000).setOrigin(0, 0)
    this.hpFill = this.add.rectangle(40, 10, BAR_WIDTH, BAR_HEIGHT, 0xff4444).setOrigin(0, 0)

    // ── XP ──────────────────────────────────────────────
    this.add.text(178, 10, 'XP', { fontFamily: '"Press Start 2P"', fontSize: '8px', color: '#44aaff' })
    this.add.rectangle(208, 10, BAR_WIDTH, BAR_HEIGHT, 0x001444).setOrigin(0, 0)
    this.xpFill = this.add.rectangle(208, 10, 0, BAR_HEIGHT, 0x44aaff).setOrigin(0, 0)

    // ── Level ────────────────────────────────────────────
    this.levelText = this.add.text(350, 10, 'LV: 1', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: '#ffff00',
    })

    // ── Badges ───────────────────────────────────────────
    this.badgeText = this.add.text(440, 10, 'BADGES: 0/5', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: '#ffaa00',
    })

    // ── Treats ───────────────────────────────────────────
    this.treatText = this.add.text(620, 10, 'TREATS: 0', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: '#ffffff',
    })

    // ── Second row: short hint (left) ────────────────────
    this.add.text(10, 34, 'ARROWS=MOVE  ?=DISCOVER  !=CLASSIFY', {
      fontFamily: '"Press Start 2P"',
      fontSize: '6px',
      color: '#555555',
    })

    // ── Waypoint compass arrow (right side of row 2) ──────
    // Label
    this.arrowTypeText = this.add.text(CANVAS_WIDTH - 130, 33, 'NEXT:', {
      fontFamily: '"Press Start 2P"',
      fontSize: '6px',
      color: '#888888',
    })

    // Rotating triangle — drawn pointing up (north = rotation 0)
    this.arrowGraphics = this.add.graphics()
    this.drawArrow(0xffff00)

    // Container lets us rotate the arrow in place
    this.arrowContainer = this.add.container(CANVAS_WIDTH - 94, 40)
    this.arrowContainer.add(this.arrowGraphics)

    // Distance text
    this.arrowDistText = this.add.text(CANVAS_WIDTH - 82, 34, '--', {
      fontFamily: '"Press Start 2P"',
      fontSize: '6px',
      color: '#ffff00',
    })

    // ── Live tile coords (top-right, dev tool) ────────────
    this.coordText = this.add.text(CANVAS_WIDTH - 8, 8, 'tile 0,0', {
      fontFamily: '"Press Start 2P"',
      fontSize: '6px',
      color: '#336633',
    }).setOrigin(1, 0)

    // ── Listen for state changes from GameScene ───────────
    const gameScene = this.scene.get('GameScene')

    gameScene.events.on('hp-changed', (current: number) => {
      this.hpFill.width = BAR_WIDTH * (current / MAX_HP)
    })

    gameScene.events.on('xp-changed', (current: number, max: number) => {
      this.xpFill.width = BAR_WIDTH * Math.min(current / max, 1)
    })

    gameScene.events.on('level-changed', (level: number) => {
      this.levelText.setText(`LV: ${level}`)
    })

    gameScene.events.on('badges-changed', (count: number) => {
      this.badgeText.setText(`BADGES: ${count}/4`)
    })

    gameScene.events.on('treats-changed', (count: number) => {
      this.treatText.setText(`TREATS: ${count}`)
    })

    gameScene.events.on('coords-changed', (tileX: number, tileY: number) => {
      this.coordText.setText(`tile ${tileX},${tileY}`)
    })

    gameScene.events.on('target-direction', (data: { angle: number; distance: number; type: string }) => {
      if (data.type === 'none') {
        this.arrowContainer.setAlpha(0.2)
        this.arrowDistText.setText('--')
        this.arrowTypeText.setText('NEXT:')
        return
      }

      const color = data.type === 'challenge' ? 0xff8800 : 0xffff00
      this.arrowGraphics.clear()
      this.drawArrow(color)
      this.arrowDistText.setColor(data.type === 'challenge' ? '#ff8800' : '#ffff00')
      this.arrowContainer.setAlpha(1)
      this.arrowContainer.setRotation(data.angle)
      this.arrowDistText.setText(`${data.distance}t`)
      this.arrowTypeText.setText(data.type === 'challenge' ? '  !:' : '  ?:')
      this.arrowTypeText.setColor(data.type === 'challenge' ? '#ff8800' : '#ffff00')
    })
  }

  private drawArrow(color: number) {
    this.arrowGraphics.fillStyle(color, 1)
    // Small triangle pointing up, centered at (0, 0)
    this.arrowGraphics.fillTriangle(0, -7, -5, 5, 5, 5)
  }
}
