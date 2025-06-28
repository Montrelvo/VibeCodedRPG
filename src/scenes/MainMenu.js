class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        // Add background image
        this.add.image(400, 300, 'background');

        // Add game title
        this.add.text(400, 150, 'Idle Fantasy RPG', {
            fontSize: '64px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Add Play button
        const playButton = this.add.text(400, 300, 'Play Game', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#888'
        })
        .setPadding(10)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Add Load Game button
        const loadButton = this.add.text(400, 380, 'Load Game', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#888'
        })
        .setPadding(10)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        loadButton.on('pointerdown', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.txt,.json'; // Accept .txt and .json files
            fileInput.style.display = 'none'; // Hide the input element
            document.body.appendChild(fileInput);

            fileInput.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    // Access the loadGameFromFile function and game instance from the scene's data
                    const loadGameFromFile = this.sys.game.registry.get('loadGameFromFile');
                    const gameInstance = this.sys.game.registry.get('gameInstance');
                    loadGameFromFile(file, gameInstance);
                }
                document.body.removeChild(fileInput); // Clean up the input element
            };

            fileInput.click(); // Programmatically click the hidden input
        });

        // Add Settings button (placeholder)
        const settingsButton = this.add.text(400, 460, 'Settings', { // Adjusted Y position
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#888'
        })
        .setPadding(10)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        settingsButton.on('pointerdown', () => {
            console.log('Settings button clicked!');
            // Future: Open settings menu
        });
    }
}

export { MainMenu };