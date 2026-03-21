import Phaser from 'phaser'
import { TILE_SIZE } from '../constants'
import { DiscoveryData } from '../data/discoveryPoints'

export class DiscoveryPoint extends Phaser.GameObjects.Container {
  public data: DiscoveryData
  public triggered: boolean = false
  private glow: Phaser.GameObjects.Arc
  private icon: Phaser.GameObjects.Text
  private glowTween: Phaser.Tweens.Tween

  constructor(scene: Phaser.Scene, data: DiscoveryData) {
    const pixelX = data.tileX * TILE_SIZE + TILE_SIZE / 2
    const pixelY = data.tileY * TILE_SIZE + TILE_SIZE / 2
    super(scene, pixelX, pixelY)

    this.data = data

    // Outer glow ring
    this.glow = scene.add.arc(0, 0, 25, 0, 360, false, 0xffff00, 0.5)
    // Inner dot
    const dot = scene.add.arc(0, 0, 10, 0, 360, false, 0xffff00, 0.7)
    // "?" icon
    this.icon = scene.add
      .text(0, -1, '?', {
        fontFamily: '"Press Start 2P"',
        fontSize: '14px',
        color: '#000000',
      })
      .setOrigin(0.5)

    this.add([this.glow, dot, this.icon])
    scene.add.existing(this)
    this.setDepth(5)

    // Pulse animation
    this.glowTween = scene.tweens.add({
      targets: this.glow,
      alpha: { from: 0.1, to: 0.6 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  markDiscovered() {
    this.triggered = true
    this.glowTween.stop()
    // Turn green to show it's been visited
    this.glow.setFillStyle(0x00ff88, 1)
    this.icon.setText('✓')
  }
}
