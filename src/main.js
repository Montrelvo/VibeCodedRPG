import { Boot } from './scenes/Boot.js';
import { Preload } from './scenes/Preload.js';
import { MainMenu } from './scenes/MainMenu.js';
import { GameScene } from './scenes/GameScene.js';
import { InventoryScene } from './scenes/InventoryScene.js';
import { Player } from './player/Player.js';

// Create a global player instance
const player = new Player();

// Function to load game state
function loadGameFromFile(file, gameInstance) {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const gameState = JSON.parse(event.target.result);

            // Validate loaded game state
            if (!gameState.playerStats || typeof gameState.playerStats !== 'object') {
                throw new Error('Invalid save file: Missing or invalid player stats');
            }

            // Validate required stats
            const requiredStats = ['gold', 'mana', 'hp', 'maxHp', 'strength', 'intelligence', 'agility', 'level', 'xp', 'skillPoints'];
            for (const stat of requiredStats) {
                if (typeof gameState.playerStats[stat] !== 'number') {
                    throw new Error(`Invalid save file: ${stat} must be a number`);
                }
            }

            // Ensure stats are within valid ranges
            gameState.playerStats.gold = Math.max(0, gameState.playerStats.gold);
            gameState.playerStats.mana = Math.max(0, gameState.playerStats.mana);
            gameState.playerStats.hp = Math.max(0, Math.min(gameState.playerStats.hp, gameState.playerStats.maxHp));
            gameState.playerStats.level = Math.max(1, gameState.playerStats.level);
            gameState.playerStats.skillPoints = Math.max(0, gameState.playerStats.skillPoints);

            gameInstance.registry.get('player').setStats(gameState.playerStats);
            console.log('Game Loaded from file!');
            console.log('Player stats after loading from file:', gameInstance.registry.get('player').getStats());

            // Optionally, transition to GameScene after loading
            if (gameInstance.scene.isActive('MainMenu')) {
                gameInstance.scene.stop('MainMenu');
                gameInstance.scene.start('GameScene');
            }
        } catch (e) {
            console.error('Failed to parse game state from file:', e);
            alert(`Error loading game: ${e.message}`);
        }
    };
    reader.onerror = (event) => {
        console.error('Error reading file:', event.target.error);
        alert('Error reading file. Please try again with a valid save file.');
    };
    reader.readAsText(file);
}

// Expose loadGameFromFile to the global scope or game instance if needed by scenes
// For now, we'll pass it directly to the MainMenu scene via data
// The initial loadGame() using localStorage is removed as per instructions.
// The game will now start with default stats unless a file is loaded via the button.


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
        GameScene,
        InventoryScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    // Pass the player instance and loadGameFromFile function to scenes
    // This is a common way to share data between scenes in Phaser
    data: {
        player: player
    }
};

const game = new Phaser.Game(config);

// Add the player instance to the game's global registry
game.registry.set('player', player);
game.registry.set('loadGameFromFile', loadGameFromFile);
game.registry.set('gameInstance', game);