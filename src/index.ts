import Phaser from 'phaser';
import Game from './scenes/game';

const config = {
  debug: true,
  type: Phaser.AUTO,
  antialias: true,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 1600,
  height: 900,
  transparent: true,
  scale: {
    mode: Phaser.Scale.FIT,
  },
  scene: Game,
};

const game = new Phaser.Game(config);
console.log(game);
