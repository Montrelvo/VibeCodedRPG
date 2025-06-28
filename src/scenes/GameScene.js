class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.goldPerSecond = 1;
        this.manaPerSecond = 0.5;
    }

    create() {
        // Access the global player instance from the registry
        this.player = this.registry.get('player');

        // Add background
        this.add.image(400, 300, 'background').setDepth(0);

        // Add player character (placeholder)
        this.playerSprite = this.add.sprite(150, 450, 'spaceship').setScale(0.5).setDepth(1);

        // HUD Elements
        this.goldText = this.add.text(10, 10, `Gold: ${this.player.getStats().gold}`, { fontSize: '24px', fill: '#fff' });
        this.manaText = this.add.text(10, 40, `Mana: ${this.player.getStats().mana}`, { fontSize: '24px', fill: '#fff' });
        this.hpText = this.add.text(10, 70, `HP: ${this.player.getStats().hp}/${this.player.getStats().maxHp}`, { fontSize: '24px', fill: '#fff' });
        this.levelText = this.add.text(10, 100, `Level: ${this.player.getStats().level}`, { fontSize: '24px', fill: '#fff' });
        this.xpText = this.add.text(10, 130, `XP: ${this.player.getStats().xp}/${this.player.getStats().xpToNextLevel}`, { fontSize: '24px', fill: '#fff' });
        this.skillPointsText = this.add.text(10, 160, `Skill Points: ${this.player.getStats().skillPoints}`, { fontSize: '24px', fill: '#fff' });

        // Update HUD initially with loaded data
        this.updateHUD();

        // Idle Resource Generation
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.player.getStats().gold += this.goldPerSecond;
                this.player.getStats().mana += this.manaPerSecond;
                this.updateHUD();
            },
            loop: true
        });

        // Placeholder for combat area
        this.add.rectangle(550, 400, 400, 300, 0x000000, 0.5).setDepth(0.5);
        this.add.text(550, 400, 'Combat Area (Coming Soon!)', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5).setDepth(0.6);

        // Temporary button to add XP for testing
        const addXpButton = this.add.text(700, 50, 'Add XP (Test)', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#555'
        })
        .setPadding(5)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        addXpButton.on('pointerdown', () => {
            this.player.addXp(50); // Add 50 XP for testing
            this.updateHUD();
        });

        // Temporary button to allocate skill point for testing
        const allocateStrButton = this.add.text(700, 90, 'Add STR (Test)', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#555'
        })
        .setPadding(5)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        allocateStrButton.on('pointerdown', () => {
            this.player.allocateSkillPoint('strength');
            this.updateHUD();
        });

        // Save Button
        const saveButton = this.add.text(700, 130, 'Save Game', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#007bff'
        })
        .setPadding(5)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        saveButton.on('pointerdown', () => {
            this.saveGame();
        });
    }

    update() {
        // Game loop logic for combat, animations, etc. will go here
    }

    updateHUD() {
        const stats = this.player.getStats();
        this.goldText.setText(`Gold: ${Math.floor(stats.gold)}`);
        this.manaText.setText(`Mana: ${Math.floor(stats.mana)}`);
        this.hpText.setText(`HP: ${stats.hp}/${stats.maxHp}`);
        this.levelText.setText(`Level: ${stats.level}`);
        this.xpText.setText(`XP: ${stats.xp}/${stats.xpToNextLevel}`);
        this.skillPointsText.setText(`Skill Points: ${stats.skillPoints}`);
    }

    saveGame() {
        const gameState = {
            playerStats: this.player.getStats(), // Get stats from Player instance
            timestamp: Date.now()
        };
        const dataStr = JSON.stringify(gameState, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        const date = new Date();
        const filename = `save_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}.txt`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('Game Saved to file:', filename);
    }
}

export { GameScene };