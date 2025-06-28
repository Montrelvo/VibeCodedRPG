import { Boot } from './scenes/Boot.js';
import { Preload } from './scenes/Preload.js';
import { MainMenu } from './scenes/MainMenu.js';
import { GameScene } from './scenes/GameScene.js';
import { Player } from './player/Player.js';

// Create a global player instance
const player = new Player();

// Function to load game state
function loadGame() {
    const savedData = localStorage.getItem('idleRpgSave');
    if (savedData) {
        const gameState = JSON.parse(savedData);
        player.setStats(gameState.playerStats);
        console.log('Game Loaded from main.js!');
        console.log('Player stats after initial load in main.js:', player.getStats());
    } else {
        console.log('No saved game found. Starting new game.');
    }
}

// Load game state immediately when the application starts
console.log('Player stats before initial load in main.js:', player.getStats());
loadGame();


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
    // Pass the player instance to scenes
    // This is a common way to share data between scenes in Phaser
    data: {
        player: player
    }
};

const game = new Phaser.Game(config);

// Add the player instance to the game's global registry
game.registry.set('player', player);