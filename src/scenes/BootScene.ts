import Phaser from 'phaser'
import { PORTRAITS } from '../data/portraits'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    // Loading bar background
    const { width, height } = this.scale
    const barBg = this.add.rectangle(width / 2, height / 2, 300, 20, 0x333333)
    const bar = this.add.rectangle(width / 2 - 150, height / 2, 0, 20, 0xffff00).setOrigin(0, 0.5)

    this.add
      .text(width / 2, height / 2 - 40, 'LOADING...', {
        fontFamily: '"Press Start 2P"',
        fontSize: '12px',
        color: '#ffffff',
      })
      .setOrigin(0.5)

    this.load.on('progress', (value: number) => {
      bar.width = 300 * value
      barBg // suppress unused warning
    })

    // Title screen image
    this.load.image('title-image', 'assets/images/title-image.png')

    // Intro background
    this.load.image('earth-scene', 'assets/images/earth_scene.png')

    // SAR map image — place your file at public/assets/images/sar-map.png
    // The image will be used as the full game world background.
    // Update MAP_WIDTH_TILES and MAP_HEIGHT_TILES in constants.ts to match your image size.
    this.load.image('sar-map', 'assets/images/sar_fire.png')

    // Stella sprites — transparent background
    this.load.image('stella', 'assets/images/stella.png')
    this.load.image('stella-walk', 'assets/images/stella_walk.png')
    this.load.image('stella-avatar', 'assets/images/portrait_stella_mouthopen.png')

    // Badge images
    this.load.image('badge-burntzone',   'assets/images/badge-burntzone.png')
    this.load.image('badge-safehouse',   'assets/images/badge-safehouse.png')
    this.load.image('badge-forestwatch', 'assets/images/badge-forestwatch.png')
    this.load.image('badge-pigear',      'assets/images/badge-pigear.png')

    // Portrait images — auto-loaded from the registry in src/data/portraits.ts
    // To add a new portrait, add an entry there and drop the PNG in public/assets/images/
    Object.entries(PORTRAITS).forEach(([key, def]) => {
      this.load.image(`portrait-${key}`, `assets/images/${def.file}`)
    })
  }

  create() {
    // Small delay to ensure Press Start 2P font is ready before text renders
    this.time.delayedCall(100, () => {
      this.scene.start('TitleScene')
    })
  }
}
