import Phaser from 'phaser'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants'
import { loadChapterProgress, BadgeRecord } from '../utils/progress'

interface ChapterDef {
  number: number
  title: string
  subtitle: string
  tag: string
  unlocked: boolean
  targetScene: string
}

const CHAPTERS: ChapterDef[] = [
  {
    number: 1,
    title: 'HOT ON THE TRAIL',
    subtitle: 'LA Wildfires • 2025',
    tag: 'SAR Damage Detection',
    unlocked: true,
    targetScene: 'IntroScene',
  },
  {
    number: 2,
    title: 'SOGGY PAWS',
    subtitle: 'Australian Flooding',
    tag: 'SAR Flood Mapping',
    unlocked: false,
    targetScene: '',
  },
  {
    number: 3,
    title: 'FROZEN FETCH',
    subtitle: 'Arctic Glaciar Monitoring',
    tag: 'Sea Ice Tracking',
    unlocked: false,
    targetScene: '',
  },
  {
    number: 4,
    title: 'THE BIG SHAKE',
    subtitle: 'Cascadia • TBD',
    tag: 'Earthquake Damage Assessment',
    unlocked: false,
    targetScene: '',
  },
]

const CARD_W    = 340
const CARD_H    = 155
const CARD_GAP  = 18
const GRID_COLS = 2
const GRID_TOP  = 145

const BADGE_SIZE = 26
const BADGE_GAP  = 6

export class ChapterSelectScene extends Phaser.Scene {
  // Shared tooltip — one instance repositioned on hover
  private tooltip!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'ChapterSelectScene' })
  }

  create() {
    // ── Background ───────────────────────────────────────
    const bg = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'title-image')
    const scaleX = CANVAS_WIDTH  / bg.width
    const scaleY = CANVAS_HEIGHT / bg.height
    bg.setScale(Math.max(scaleX, scaleY))

    this.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0x000000, 0.72).setOrigin(0, 0)

    // ── Header ───────────────────────────────────────────
    this.add.text(CANVAS_WIDTH / 2, 52, 'STELLA', {
      fontFamily: '"Press Start 2P"',
      fontSize: '22px',
      color: '#ffff00',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5)

    this.add.text(CANVAS_WIDTH / 2, 90, 'SELECT CHAPTER', {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      color: '#aaaaff',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5)

    // ── Shared tooltip (hidden until badge hover) ─────────
    this.tooltip = this.add.text(0, 0, '', {
      fontFamily: '"Press Start 2P"',
      fontSize: '7px',
      color: '#ffffff',
      backgroundColor: '#000000dd',
      padding: { x: 6, y: 4 },
      resolution: window.devicePixelRatio,
    }).setDepth(50).setAlpha(0).setOrigin(0.5, 1)

    // ── Chapter cards ─────────────────────────────────────
    const totalGridW = GRID_COLS * CARD_W + (GRID_COLS - 1) * CARD_GAP
    const gridLeft   = (CANVAS_WIDTH - totalGridW) / 2

    CHAPTERS.forEach((ch, i) => {
      const col = i % GRID_COLS
      const row = Math.floor(i / GRID_COLS)
      const cx  = gridLeft + col * (CARD_W + CARD_GAP)
      const cy  = GRID_TOP + row * (CARD_H + CARD_GAP)
      this.buildCard(ch, cx, cy)
    })

    // ── Back hint ─────────────────────────────────────────
    this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 18, '[ ESC ] BACK TO TITLE', {
      fontFamily: '"Press Start 2P"',
      fontSize: '7px',
      color: '#555555',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5)

    this.input.keyboard!.once('keydown-ESC', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('TitleScene')
      })
    })

    this.cameras.main.fadeIn(500, 0, 0, 0)
  }

  private buildCard(ch: ChapterDef, x: number, y: number) {
    const progress   = ch.unlocked ? loadChapterProgress(ch.number) : null
    const complete   = !!progress?.complete
    const inProgress = !!progress?.started && !complete

    const alpha    = ch.unlocked ? 1 : 0.38
    const border   = complete ? 0x00ff88 : inProgress ? 0xffaa00 : ch.unlocked ? 0xffff00 : 0x444444
    const numColor = ch.unlocked ? '#ffff00' : '#666666'
    const txtColor = ch.unlocked ? '#ffffff' : '#666666'
    const tagColor = ch.unlocked ? '#88aaff' : '#555555'

    // Card background
    const card = this.add.rectangle(x, y, CARD_W, CARD_H, 0x020814, 0.9 * alpha)
      .setOrigin(0, 0)
      .setStrokeStyle(2, border, alpha)

    // Chapter number
    this.add.text(x + 14, y + 14, `CH.${ch.number}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: numColor,
      resolution: window.devicePixelRatio,
    }).setAlpha(alpha)

    // Top-right indicator
    if (complete) {
      this.add.text(x + CARD_W - 14, y + 14, '✓ COMPLETE', {
        fontFamily: '"Press Start 2P"',
        fontSize: '7px',
        color: '#00ff88',
        resolution: window.devicePixelRatio,
      }).setOrigin(1, 0)
    } else if (inProgress) {
      this.add.text(x + CARD_W - 14, y + 14, '… IN PROGRESS', {
        fontFamily: '"Press Start 2P"',
        fontSize: '7px',
        color: '#ffaa00',
        resolution: window.devicePixelRatio,
      }).setOrigin(1, 0)
    } else if (!ch.unlocked) {
      this.add.text(x + CARD_W - 14, y + 14, '🔒', {
        fontSize: '14px',
      }).setOrigin(1, 0).setAlpha(0.5)
    }

    // Title
    this.add.text(x + 14, y + 42, ch.title, {
      fontFamily: '"Press Start 2P"',
      fontSize: '11px',
      color: txtColor,
      wordWrap: { width: CARD_W - 28 },
      resolution: window.devicePixelRatio,
    }).setAlpha(alpha)

    // Divider
    this.add.rectangle(x + 14, y + 82, CARD_W - 28, 1, border, 0.25 * alpha)
      .setOrigin(0, 0)

    // Subtitle
    this.add.text(x + 14, y + 94, ch.subtitle, {
      fontFamily: '"Press Start 2P"',
      fontSize: '7px',
      color: txtColor,
      resolution: window.devicePixelRatio,
    }).setAlpha(alpha * 0.8)

    // Science tag
    this.add.text(x + 14, y + 116, ch.tag, {
      fontFamily: '"Press Start 2P"',
      fontSize: '6px',
      color: tagColor,
      resolution: window.devicePixelRatio,
    }).setAlpha(alpha)

    // ── Earned badge icons (bottom-right row) ─────────────
    if (complete && progress!.badges.length > 0) {
      this.buildBadgeIcons(progress!.badges, x, y)
    }

    // Status label (bottom-right, below badge row)
    const statusLabel = complete ? '▶  REPLAY' : inProgress ? '▶  CONTINUE' : ch.unlocked ? '▶  PLAY' : 'COMING SOON'
    const statusColor = complete ? '#00ff88' : inProgress ? '#ffaa00' : ch.unlocked ? '#00ff88' : '#555555'
    this.add.text(x + CARD_W - 14, y + CARD_H - 12, statusLabel, {
      fontFamily: '"Press Start 2P"',
      fontSize: '7px',
      color: statusColor,
      resolution: window.devicePixelRatio,
    }).setOrigin(1, 1).setAlpha(alpha)

    // ── Interactivity ─────────────────────────────────────
    if (!ch.unlocked) return

    card.setInteractive({ useHandCursor: true })

    card.on('pointerover', () => {
      card.setStrokeStyle(2, 0xffffff, 1)
      this.tweens.add({ targets: card, scaleX: 1.015, scaleY: 1.015, duration: 80, ease: 'Sine.easeOut' })
    })
    card.on('pointerout', () => {
      card.setStrokeStyle(2, border, 1)
      this.tweens.add({ targets: card, scaleX: 1, scaleY: 1, duration: 80, ease: 'Sine.easeOut' })
    })
    card.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(ch.targetScene)
      })
    })
  }

  private buildBadgeIcons(badges: BadgeRecord[], cardX: number, cardY: number) {
    // Row anchored to bottom-right of card, above the status label
    const rowY    = cardY + CARD_H - 28
    const rowEndX = cardX + CARD_W - 14

    badges.forEach((badge, i) => {
      const bx = rowEndX - i * (BADGE_SIZE + BADGE_GAP) - BADGE_SIZE / 2
      const by = rowY

      // Derive Phaser texture key from filename (strip .png)
      const textureKey = badge.image.replace(/\.png$/i, '')

      // Only render if texture was loaded
      if (!this.textures.exists(textureKey)) return

      const icon = this.add.image(bx, by, textureKey)
        .setDisplaySize(BADGE_SIZE, BADGE_SIZE)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: false })

      icon.on('pointerover', () => {
        icon.setDisplaySize(BADGE_SIZE * 1.4, BADGE_SIZE * 1.4)
        this.tooltip.setText(badge.label)
        this.tooltip.setPosition(bx, by - BADGE_SIZE * 0.8)
        this.tooltip.setAlpha(1)
      })
      icon.on('pointerout', () => {
        icon.setDisplaySize(BADGE_SIZE, BADGE_SIZE)
        this.tooltip.setAlpha(0)
      })
    })
  }
}
