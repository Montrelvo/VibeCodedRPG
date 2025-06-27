class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.playerStats = {
            gold: 0,
            mana: 0,
            hp: 100,
            maxHp: 100,
            strength: 10,
            intelligence: 10,
            level: 1,
            xp: 0,
            xpToNextLevel: 100
        };
        this.goldPerSecond = 1;
        this.manaPerSecond = 0.5;
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background').setDepth(0);

        // Add player character (placeholder)
        this.player = this.add.sprite(150, 450, 'spaceship').setScale(0.5).setDepth(1);

        // HUD Elements
        this.goldText = this.add.text(10, 10, `Gold: ${this.playerStats.gold}`, { fontSize: '24px', fill: '#fff' });
        this.manaText = this.add.text(10, 40, `Mana: ${this.playerStats.mana}`, { fontSize: '24px', fill: '#fff' });
        this.hpText = this.add.text(10, 70, `HP: ${this.playerStats.hp}/${this.playerStats.maxHp}`, { fontSize: '24px', fill: '#fff' });
        this.levelText = this.add.text(10, 100, `Level: ${this.playerStats.level}`, { fontSize: '24px', fill: '#fff' });
        this.xpText = this.add.text(10, 130, `XP: ${this.playerStats.xp}/${this.playerStats.xpToNextLevel}`, { fontSize: '24px', fill: '#fff' });

        // Idle Resource Generation
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.playerStats.gold += this.goldPerSecond;
                this.playerStats.mana += this.manaPerSecond;
                this.updateHUD();
            },
            loop: true
        });

        // Placeholder for combat area
        this.add.rectangle(550, 400, 400, 300, 0x000000, 0.5).setDepth(0.5);
        this.add.text(550, 400, 'Combat Area (Coming Soon!)', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5).setDepth(0.6);

        // Save/Load System (initial check)
        this.loadGame();
    }

    update() {
        // Game loop logic for combat, animations, etc. will go here
    }

    updateHUD() {
        this.goldText.setText(`Gold: ${Math.floor(this.playerStats.gold)}`);
        this.manaText.setText(`Mana: ${Math.floor(this.playerStats.mana)}`);
        this.hpText.setText(`HP: ${this.playerStats.hp}/${this.playerStats.maxHp}`);
        this.levelText.setText(`Level: ${this.playerStats.level}`);
        this.xpText.setText(`XP: ${this.playerStats.xp}/${this.playerStats.xpToNextLevel}`);
    }

    saveGame() {
        const gameState = {
            playerStats: this.playerStats,
            timestamp: Date.now()
        };
        localStorage.setItem('idleRpgSave', JSON.stringify(gameState));
        console.log('Game Saved!');
    }

    loadGame() {
        const savedData = localStorage.getItem('idleRpgSave');
        if (savedData) {
            const gameState = JSON.parse(savedData);
            this.playerStats = gameState.playerStats;

            // Calculate offline progress
            const lastPlayed = gameState.timestamp;
            const now = Date.now();
            const elapsedSeconds = (now - lastPlayed) / 1000;

            this.playerStats.gold += this.goldPerSecond * elapsedSeconds;
            this.playerStats.mana += this.manaPerSecond * elapsedSeconds;

            console.log(`Game Loaded! Offline gains: ${Math.floor(this.goldPerSecond * elapsedSeconds)} gold, ${Math.floor(this.manaPerSecond * elapsedSeconds)} mana.`);
            this.updateHUD();
        }
    }
}

export { GameScene };