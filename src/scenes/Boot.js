class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Load any assets needed for the loading screen or initial boot
        // For now, we'll just load a placeholder image
        this.load.image('phaser_logo', 'assets/phaser.png');
    }

    create() {
        this.scene.start('Preload');
    }
}

export { Boot };