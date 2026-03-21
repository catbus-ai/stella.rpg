import Phaser from 'phaser'
import { TILE_SIZE, MAP_WIDTH_TILES, MAP_HEIGHT_TILES, MOVE_DURATION_MS } from '../constants'

// Stella is displayed at this height in pixels on the map.
// Increase this number to make her bigger on the SAR map.
const DISPLAY_HEIGHT = 80

export class Stella extends Phaser.GameObjects.Container {
  public tileX: number
  public tileY: number
  private isMoving: boolean = false
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private sprite: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene, startTileX: number, startTileY: number) {
    const pixelX = startTileX * TILE_SIZE + TILE_SIZE / 2
    const pixelY = startTileY * TILE_SIZE + TILE_SIZE / 2
    super(scene, pixelX, pixelY)

    this.tileX = startTileX
    this.tileY = startTileY

    // Stella avatar — mouth open portrait, easier to see on the map
    this.sprite = scene.add.image(0, 0, 'stella-avatar')

    // Scale to DISPLAY_HEIGHT, preserve aspect ratio
    const scale = DISPLAY_HEIGHT / this.sprite.height
    this.sprite.setScale(scale)

    // Slight upward offset so her feet land on the tile center
    this.sprite.setY(-4)

    this.add(this.sprite)
    scene.add.existing(this)

    this.cursors = scene.input.keyboard!.createCursorKeys()
    this.setDepth(10)
  }

  update() {
    if (this.isMoving) return

    let dx = 0
    let dy = 0

    if (this.cursors.left.isDown) dx = -1
    else if (this.cursors.right.isDown) dx = 1
    else if (this.cursors.up.isDown) dy = -1
    else if (this.cursors.down.isDown) dy = 1

    if (dx === 0 && dy === 0) return

    // Flip sprite horizontally when moving left
    if (dx === -1) this.sprite.setFlipX(true)
    if (dx === 1) this.sprite.setFlipX(false)

    const nextTileX = Phaser.Math.Clamp(this.tileX + dx, 0, MAP_WIDTH_TILES - 1)
    const nextTileY = Phaser.Math.Clamp(this.tileY + dy, 0, MAP_HEIGHT_TILES - 1)

    if (nextTileX === this.tileX && nextTileY === this.tileY) return

    this.tileX = nextTileX
    this.tileY = nextTileY

    const targetX = this.tileX * TILE_SIZE + TILE_SIZE / 2
    const targetY = this.tileY * TILE_SIZE + TILE_SIZE / 2

    this.isMoving = true
    this.scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      duration: MOVE_DURATION_MS,
      ease: 'Linear',
      onComplete: () => {
        this.isMoving = false
      },
    })
  }
}
