import Phaser from 'phaser'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'
import { BootScene } from './scenes/BootScene'
import { TitleScene } from './scenes/TitleScene'
import { ChapterSelectScene } from './scenes/ChapterSelectScene'
import { IntroScene } from './scenes/IntroScene'
import { GameScene } from './scenes/GameScene'
import { HudScene } from './scenes/HudScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor: '#000000',
  scene: [BootScene, TitleScene, ChapterSelectScene, IntroScene, GameScene, HudScene],
  render: {
    pixelArt: true,
    antialias: false,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}

new Phaser.Game(config)
