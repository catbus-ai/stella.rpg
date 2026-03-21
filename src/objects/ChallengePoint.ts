import Phaser from 'phaser'
import { TILE_SIZE } from '../constants'
import { ChallengePointData } from '../data/classificationMissions'

export class ChallengePoint extends Phaser.GameObjects.Container {
  public pointData: ChallengePointData
  public resolved: boolean = false
  private ring: Phaser.GameObjects.Arc
  private pulseTween: Phaser.Tweens.Tween

  constructor(scene: Phaser.Scene, data: ChallengePointData) {
    const pixelX = data.tileX * TILE_SIZE + TILE_SIZE / 2
    const pixelY = data.tileY * TILE_SIZE + TILE_SIZE / 2
    super(scene, pixelX, pixelY)

    this.pointData = data

    // Outer ring — orange, distinct from the yellow discovery "?"
    this.ring = scene.add.arc(0, 0, 20, 0, 360, false, 0xff8800, 0.5)
    // Inner dot
    const dot = scene.add.arc(0, 0, 8, 0, 360, false, 0xff8800, 0.8)
    // "!" label
    const icon = scene.add
      .text(0, -1, '!', {
        fontFamily: '"Press Start 2P"',
        fontSize: '12px',
        color: '#000000',
      })
      .setOrigin(0.5)

    this.add([this.ring, dot, icon])
    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject)
    this.setDepth(5)

    // Pulse animation
    this.pulseTween = scene.tweens.add({
      targets: this.ring,
      alpha: { from: 0.15, to: 0.6 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  markResolved(correct: boolean) {
    this.resolved = true
    this.pulseTween.stop()
    if (correct) {
      this.ring.setFillStyle(0x00ff88, 0.3)
    } else {
      this.ring.setFillStyle(0xff2244, 0.3)
    }
  }
}
