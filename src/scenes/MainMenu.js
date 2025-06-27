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

        // Add Settings button (placeholder)
        const settingsButton = this.add.text(400, 380, 'Settings', {
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