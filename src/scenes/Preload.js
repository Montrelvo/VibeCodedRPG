class Preload extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        // Display a loading bar or progress indicator here if desired
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        // Load all game assets here
        // Example assets from the PDF and existing project structure
        this.load.image('background', 'assets/space.png'); // Using existing space.png as a placeholder background
        this.load.image('spaceship', 'assets/spaceship.png'); // Using existing spaceship.png as a placeholder hero
        // this.load.image('hero', 'assets/hero.png'); // Placeholder from PDF, will need to be added
        // this.load.image('castle_bg', 'assets/castle_bg.png'); // Placeholder from PDF, will need to be added

        // UI icons, spritesheets, etc. will be added here as they are collected
    }

    create() {
        this.scene.start('MainMenu');
    }
}

export { Preload };