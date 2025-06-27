import { Boot } from './scenes/Boot.js';
import { Preload } from './scenes/Preload.js';
import { MainMenu } from './scenes/MainMenu.js';
import { GameScene } from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    title: 'Idle Fantasy RPG',
    description: 'An idle RPG/MMO game built with Phaser.js',
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        Boot,
        Preload,
        MainMenu,
        GameScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
};

new Phaser.Game(config);