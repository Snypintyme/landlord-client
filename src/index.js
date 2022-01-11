import Phaser from 'phaser';
import Game from "./scenes/game.js"

const config = {
    type: Phaser.AUTO,
    antialias: true,
    autoCenter: true,
    width: 1600,
    height: 900,
    //backgroundColour: "#121212",
    transparent: true,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    scene: Game
};

const game = new Phaser.Game(config);
