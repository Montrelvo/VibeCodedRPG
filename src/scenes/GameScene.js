import { ENEMY_TYPES, ENEMY_TEMPLATES, DUNGEON_TYPES, DUNGEON_CONFIGS, COMBAT_CONFIG } from '../enemies.js';
import { generateEnemyDrop } from '../items.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.goldPerSecond = 1;
        this.manaPerSecond = 0.5;

        // Combat system properties
        this.activeEnemies = [];
        this.currentDungeon = DUNGEON_TYPES.FOREST;
        this.currentWave = 0;
        this.enemiesDefeated = 0;
        this.combatLog = [];
        this.lastPlayerAttack = 0;
        this.lastEnemySpawn = 0;
        this.waveActive = false;
        this.combatActive = true; // Enable combat by default
    }

    create() {
        // Access the global player instance from the registry
        this.player = this.registry.get('player');

        // Add background
        this.add.image(400, 300, 'background').setDepth(0);

        // Add player character (placeholder)
        this.playerSprite = this.add.sprite(150, 450, 'spaceship').setScale(0.5).setDepth(1);

        // Enhanced HUD with better styling and backgrounds
        this.createHUDPanel();

        // HUD Elements with enhanced styling
        this.goldText = this.add.text(20, 15, `💰 ${Math.floor(this.player.getStats().gold)}`, {
            fontSize: '20px',
            fill: '#ffd700',
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setDepth(1);

        this.manaText = this.add.text(20, 45, `🔵 ${Math.floor(this.player.getStats().mana)}`, {
            fontSize: '18px',
            fill: '#4169e1',
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 1
        }).setDepth(1);

        this.hpText = this.add.text(20, 75, `❤️ ${this.player.getStats().hp}/${this.player.getStats().maxHp}`, {
            fontSize: '18px',
            fill: '#ff4444',
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 1
        }).setDepth(1);

        this.levelText = this.add.text(20, 105, `⭐ Level ${this.player.getStats().level}`, {
            fontSize: '18px',
            fill: '#ffffff',
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 1
        }).setDepth(1);

        this.xpText = this.add.text(20, 135, `⚡ XP: ${this.player.getStats().xp}/${this.player.getStats().xpToNextLevel}`, {
            fontSize: '16px',
            fill: '#ffff00',
            stroke: '#000000',
            strokeThickness: 1
        }).setDepth(1);

        this.skillPointsText = this.add.text(20, 165, `🎯 Skill Points: ${this.player.getStats().skillPoints}`, {
            fontSize: '16px',
            fill: '#ff69b4',
            stroke: '#000000',
            strokeThickness: 1
        }).setDepth(1);

        // Update HUD initially with loaded data
        this.updateHUD();

        // Idle Resource Generation
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.player.addGold(this.goldPerSecond);
                this.player.addMana(this.manaPerSecond);
                this.updateHUD();
            },
            loop: true
        });

        // Combat area setup
        this.setupCombatArea();
        this.initializeCombatSystem();
        this.startCombatWave();

        // Add game title and info
        this.addGameTitle();
    }

    createHUDPanel() {
        // HUD background panel
        this.hudPanel = this.add.rectangle(10, 10, 220, 180, 0x000000, 0.7).setOrigin(0, 0).setDepth(0.9);

        // HUD border
        this.add.rectangle(10, 10, 220, 180, 0x555555, 1).setOrigin(0, 0).setDepth(1).setStrokeStyle(2, 0x888888);
    }

    addGameTitle() {
        // Game title in top-right
        this.add.text(650, 15, '🎮 Idle Fantasy RPG 🎮', {
            fontSize: '22px',
            fill: '#ffffff',
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(1);

        // Version info
        this.add.text(650, 45, 'v1.0.0', {
            fontSize: '14px',
            fill: '#cccccc',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5).setDepth(1);
    }


        // Enhanced Save Button
        this.saveButtonBg = this.add.rectangle(700, 130, 120, 35, 0x007bff, 1).setDepth(1);
        this.saveButtonText = this.add.text(700, 130, '💾 Save Game', {
            fontSize: '16px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(2);

        this.saveButtonBg.setInteractive({ useHandCursor: true });
        this.saveButtonBg.on('pointerdown', () => {
            this.saveGame();
            // Button press feedback
            this.tweens.add({
                targets: [this.saveButtonBg, this.saveButtonText],
                scale: 0.95,
                duration: 100,
                yoyo: true,
                ease: 'Power2'
            });
        });

        // Enhanced Inventory Button
        this.inventoryButtonBg = this.add.rectangle(700, 175, 120, 35, 0x28a745, 1).setDepth(1);
        this.inventoryButtonText = this.add.text(700, 175, '🎒 Inventory', {
            fontSize: '16px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(2);

        this.inventoryButtonBg.setInteractive({ useHandCursor: true });
        this.inventoryButtonBg.on('pointerdown', () => {
            this.openInventory();
            // Button press feedback
            this.tweens.add({
                targets: [this.inventoryButtonBg, this.inventoryButtonText],
                scale: 0.95,
                duration: 100,
                yoyo: true,
                ease: 'Power2'
            });
        });
    }

    update(time, delta) {
        if (!this.combatActive) return;

        // Handle player attacks
        if (time > this.lastPlayerAttack + (COMBAT_CONFIG.PLAYER_ATTACK_SPEED / this.player.getCombatStats().attackSpeed)) {
            this.playerAttack(time);
        }

        // Handle enemy spawning
        if (time > this.lastEnemySpawn + COMBAT_CONFIG.ENEMY_SPAWN_DELAY && this.activeEnemies.length < COMBAT_CONFIG.MAX_ACTIVE_ENEMIES) {
            this.spawnEnemy();
            this.lastEnemySpawn = time;
        }

        // Update enemy positions and handle enemy attacks
        this.activeEnemies.forEach((enemy, index) => {
            if (time > enemy.lastAttack + enemy.attackSpeed) {
                this.enemyAttack(enemy, time);
            }
        });

        // Clean up defeated enemies
        this.activeEnemies = this.activeEnemies.filter(enemy => enemy.hp > 0);

        // Update combat UI
        this.updateCombatUI();
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
        try {
            const gameState = {
                playerStats: this.player.getStats(), // Get stats from Player instance
                timestamp: Date.now()
            };

            // Validate game state before saving
            if (!gameState.playerStats) {
                throw new Error('Player stats are not available for saving');
            }

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
        } catch (error) {
            console.error('Error saving game:', error);
            alert(`Error saving game: ${error.message}`);
        }
    }

    // Combat System Methods

    setupCombatArea() {
        // Combat area background with enhanced styling
        this.combatArea = this.add.rectangle(550, 400, 400, 300, 0x1a1a1a, 0.9).setDepth(0.5);

        // Add decorative background elements
        this.add.circle(450, 300, 30, 0x333333, 0.7).setDepth(0.4);
        this.add.circle(650, 500, 25, 0x333333, 0.7).setDepth(0.4);
        this.add.circle(750, 300, 20, 0x333333, 0.7).setDepth(0.4);

        // Enhanced combat UI elements with emojis and styling
        this.combatTitle = this.add.text(550, 250, '🏰 Combat Arena 🏰', {
            fontSize: '28px',
            fill: '#ffffff',
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(0.6);

        this.waveText = this.add.text(550, 285, 'Wave: 1/5', {
            fontSize: '18px',
            fill: '#ffff00',
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(0.6);

        this.enemiesText = this.add.text(550, 500, '👥 Active Enemies: 0', {
            fontSize: '16px',
            fill: '#ff6666',
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5).setDepth(0.6);

        this.combatLogText = this.add.text(550, 525, '⚔️ Combat ready... ⚔️', {
            fontSize: '14px',
            fill: '#cccccc',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5).setDepth(0.6);

        // Initialize particle effects
        this.setupParticleEffects();
    }

    initializeCombatSystem() {
        // Enemy sprites group
        this.enemySprites = this.add.group();
        this.damageNumbers = this.add.group();

        // Setup particle effects
        this.setupParticleEffects();
    }

    setupParticleEffects() {
        // Create particle emitter for combat effects
        this.combatParticles = this.add.particles(0, 0, 'particle', {
            lifespan: 500,
            speed: { min: 50, max: 150 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            quantity: 10,
            blendMode: 'ADD',
            on: false
        });

        // Create hit effect particles
        this.hitParticles = this.add.particles(0, 0, 'particle', {
            lifespan: 300,
            speed: { min: 100, max: 200 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.8, end: 0 },
            quantity: 5,
            tint: 0xff0000,
            blendMode: 'ADD',
            on: false
        });

        // Create level up effect particles
        this.levelUpParticles = this.add.particles(0, 0, 'particle', {
            lifespan: 1000,
            speed: { min: 200, max: 400 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            quantity: 20,
            tint: 0xffff00,
            blendMode: 'ADD',
            on: false
        });
    }

    startCombatWave() {
        this.currentWave = 1;
        this.waveActive = true;
        this.updateWaveUI();
        console.log(`Starting wave ${this.currentWave} in ${DUNGEON_CONFIGS[this.currentDungeon].name}`);
    }

    spawnEnemy() {
        if (!this.waveActive) return;

        const dungeonConfig = DUNGEON_CONFIGS[this.currentDungeon];
        const enemyType = dungeonConfig.enemyPool[Math.floor(Math.random() * dungeonConfig.enemyPool.length)];
        const template = ENEMY_TEMPLATES[enemyType];

        // Calculate enemy stats based on wave and difficulty
        const levelMultiplier = 1 + ((this.currentWave - 1) * 0.2);
        const difficultyMultiplier = dungeonConfig.difficultyMultiplier;

        const enemy = {
            type: enemyType,
            name: template.name,
            maxHp: Math.floor(template.baseHp * levelMultiplier * difficultyMultiplier),
            hp: Math.floor(template.baseHp * levelMultiplier * difficultyMultiplier),
            damage: Math.floor(template.baseDamage * levelMultiplier * difficultyMultiplier),
            xpReward: Math.floor(template.baseXpReward * levelMultiplier * difficultyMultiplier),
            goldReward: Math.floor(template.baseGoldReward * levelMultiplier * difficultyMultiplier),
            attackSpeed: template.attackSpeed,
            lastAttack: 0,
            sprite: null,
            hpBar: null,
            hpText: null
        };

        // Combat area bounds (within the 400x300 combat rectangle)
        const combatArea = {
            x: 550,
            y: 400,
            width: 400,
            height: 300,
            left: 350,   // 550 - 200
            right: 750,  // 550 + 200
            top: 250,    // 400 - 150
            bottom: 550  // 400 + 150
        };

        // Position enemies in a grid within combat area
        const maxEnemiesPerRow = 4;
        const enemyIndex = this.activeEnemies.length;
        const row = Math.floor(enemyIndex / maxEnemiesPerRow);
        const col = enemyIndex % maxEnemiesPerRow;

        const x = combatArea.left + 80 + (col * 90);
        const y = combatArea.top + 80 + (row * 80);

        // Ensure we don't exceed combat area bounds
        if (x > combatArea.right - 40 || y > combatArea.bottom - 40) {
            console.log('Combat area full, cannot spawn more enemies');
            return;
        }

        // Create enemy sprite (circle)
        enemy.sprite = this.add.circle(x, y, 25, template.color, 1).setDepth(1);

        // Create HP bar above enemy
        enemy.hpBar = this.add.rectangle(x, y - 35, 50, 6, 0x00ff00).setDepth(1.1);

        // Create HP text
        enemy.hpText = this.add.text(x, y - 50, `${enemy.hp}/${enemy.maxHp}`, {
            fontSize: '12px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(1.2);

        this.activeEnemies.push(enemy);
        this.updateCombatUI();
        console.log(`Spawned ${enemy.name} at (${x}, ${y}) (HP: ${enemy.hp}, DMG: ${enemy.damage})`);
    }

    playerAttack(time) {
        if (this.activeEnemies.length === 0 || !this.player.isAlive()) return;

        const target = this.activeEnemies[0]; // Attack first enemy
        const combatStats = this.player.getCombatStats();
        const damage = this.player.calculateDamageDealt();

        target.hp -= damage;

        // Enhanced visual feedback with animations
        this.showDamageNumber(target.sprite.x, target.sprite.y, damage, 0xff0000);

        // Attack animation effect
        this.playAttackEffect(this.playerSprite.x, this.playerSprite.y, target.sprite.x, target.sprite.y, 0xffaa00);

        // Hit effect on target
        this.playHitEffect(target.sprite.x, target.sprite.y);

        // Screen shake for impactful attacks
        if (damage > combatStats.attackDamage * 1.5) {
            this.cameras.main.shake(200, 0.005);
        }

        // Update enemy health bar with animation
        this.tweens.add({
            targets: target.hpBar,
            width: 50 * (target.hp / target.maxHp),
            duration: 200,
            ease: 'Power2'
        });
        this.updateEnemyHpBar(target);

        console.log(`Player attacks ${target.name} for ${damage} damage (Attack: ${combatStats.attackDamage})`);

        if (target.hp <= 0) {
            this.defeatEnemy(target);
        }

        this.lastPlayerAttack = time;
    }

    enemyAttack(enemy, time) {
        if (!this.player.isAlive()) return;

        const damage = enemy.damage;
        const actualDamage = this.player.takeDamage(damage);

        // Enhanced visual feedback with animations
        this.showDamageNumber(this.playerSprite.x, this.playerSprite.y, actualDamage, 0xff0000);

        // Enemy attack effect
        this.playAttackEffect(enemy.sprite.x, enemy.sprite.y, this.playerSprite.x, this.playerSprite.y, 0xff4444);

        // Hit effect on player
        this.playHitEffect(this.playerSprite.x, this.playerSprite.y);

        // Player sprite flash when hit
        this.tweens.add({
            targets: this.playerSprite,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            ease: 'Power2'
        });

        if (!this.player.isAlive()) {
            console.log('Player defeated! Respawning...');
            this.showDamageNumber(this.playerSprite.x, this.playerSprite.y, '💀 DEFEATED! 💀', 0xff0000);

            // Death effect
            this.playDeathEffect(this.playerSprite.x, this.playerSprite.y);

            // Respawn after a delay
            this.time.delayedCall(2000, () => {
                this.player.resetHealth();
                this.updateHUD();
                this.showDamageNumber(this.playerSprite.x, this.playerSprite.y, '🔄 RESPAWNED!', 0x00ff00);
            });
        }

        enemy.lastAttack = time;
    }

    defeatEnemy(enemy) {
        // Grant rewards
        this.player.addExperience(enemy.xpReward);
        this.player.addGold(enemy.goldReward);
        this.enemiesDefeated++;

        // Generate and drop item (30% chance)
        if (Math.random() < 0.3) {
            this.dropItemFromEnemy(enemy);
        }

        // Visual feedback
        this.showDamageNumber(enemy.sprite.x, enemy.sprite.y, 'DEFEATED!', 0x00ff00);

        // Remove enemy
        enemy.sprite.destroy();
        enemy.hpBar.destroy();
        if (enemy.hpText) enemy.hpText.destroy();

        console.log(`Defeated ${enemy.name}! +${enemy.xpReward} XP, +${enemy.goldReward} Gold`);

        // Update HUD
        this.updateHUD();
    }

    showDamageNumber(x, y, damage, color) {
        const damageText = this.add.text(x, y, damage.toString(), {
            fontSize: '16px',
            fill: '#' + color.toString(16).padStart(6, '0'),
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(2);

        // Animate damage number
        this.tweens.add({
            targets: damageText,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => damageText.destroy()
        });
    }

    updateEnemyHpBar(enemy) {
        const hpPercent = enemy.hp / enemy.maxHp;
        enemy.hpBar.width = 50 * hpPercent;

        if (hpPercent > 0.5) {
            enemy.hpBar.fillColor = 0x00ff00; // Green
        } else if (hpPercent > 0.25) {
            enemy.hpBar.fillColor = 0xffff00; // Yellow
        } else {
            enemy.hpBar.fillColor = 0xff0000; // Red
        }

        // Update HP text if it exists
        if (enemy.hpText) {
            enemy.hpText.setText(`${Math.max(0, enemy.hp)}/${enemy.maxHp}`);
        }
    }

    updateCombatUI() {
        const dungeonConfig = DUNGEON_CONFIGS[this.currentDungeon];
        this.waveText.setText(`Wave: ${this.currentWave}/${dungeonConfig.waveCount}`);
        this.enemiesText.setText(`Active Enemies: ${this.activeEnemies.length}`);

        if (this.activeEnemies.length > 0) {
            const firstEnemy = this.activeEnemies[0];
            this.combatLogText.setText(`${firstEnemy.name} (${firstEnemy.hp}/${firstEnemy.maxHp} HP)`);
        } else {
            this.combatLogText.setText('No enemies active');
        }
    }

    updateWaveUI() {
        const dungeonConfig = DUNGEON_CONFIGS[this.currentDungeon];
        this.waveText.setText(`Wave: ${this.currentWave}/${dungeonConfig.waveCount}`);
    }

    // Item Drop System

    dropItemFromEnemy(enemy) {
        // Generate item based on enemy type and current wave
        const itemLevel = this.currentWave;
        const item = generateEnemyDrop(enemy.type, itemLevel);

        // Try to add item to player's inventory
        const added = this.player.addItemToInventory(item);

        if (added) {
            // Visual feedback for item drop
            this.showItemDrop(item, enemy.sprite.x, enemy.sprite.y);
            console.log(`Item dropped: ${item.name} (${item.rarity.name})`);
        } else {
            console.log('Inventory full! Item could not be added:', item.name);
            this.showDamageNumber(enemy.sprite.x, enemy.sprite.y, 'INVENTORY FULL!', 0xff0000);
        }
    }

    showItemDrop(item, x, y) {
        // Create item drop animation
        const itemIcon = this.add.circle(x, y, 15, item.rarity.color, 0.8).setDepth(2);

        // Item name text
        const itemText = this.add.text(x, y + 20, item.name, {
            fontSize: '12px',
            fill: '#' + item.rarity.color.toString(16).padStart(6, '0'),
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(2);

        // Animate item drop
        this.tweens.add({
            targets: [itemIcon, itemText],
            y: y - 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                itemIcon.destroy();
                itemText.destroy();
            }
        });
    }

    openInventory() {
        // Pause the game scene
        this.scene.pause();

        // Launch the inventory scene
        this.scene.launch('InventoryScene');
    }

    // Animation and Visual Effects Methods

    playAttackEffect(fromX, fromY, toX, toY, color) {
        // Create attack projectile effect
        const attackEffect = this.add.circle(fromX, fromY, 8, color, 0.9).setDepth(1.5);

        // Animate the attack
        this.tweens.add({
            targets: attackEffect,
            x: toX,
            y: toY,
            scale: 0.5,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                attackEffect.destroy();
            }
        });
    }

    playHitEffect(x, y) {
        // Trigger hit particles if available
        if (this.hitParticles) {
            this.hitParticles.setPosition(x, y);
            this.hitParticles.explode(8);
        }

        // Flash effect
        const flash = this.add.circle(x, y, 30, 0xffffff, 0.3).setDepth(1.4);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            scale: 2,
            duration: 200,
            onComplete: () => flash.destroy()
        });
    }

    playDeathEffect(x, y) {
        // Death particle explosion
        if (this.combatParticles) {
            this.combatParticles.setPosition(x, y);
            this.combatParticles.explode(15);
        }

        // Screen shake
        this.cameras.main.shake(500, 0.02);

        // Fade to red effect
        const redOverlay = this.add.rectangle(400, 300, 800, 600, 0xff0000, 0.2).setDepth(5);
        this.tweens.add({
            targets: redOverlay,
            alpha: 0,
            duration: 1000,
            onComplete: () => redOverlay.destroy()
        });
    }

    playLevelUpEffect() {
        // Level up particle effect
        if (this.levelUpParticles) {
            this.levelUpParticles.setPosition(400, 300);
            this.levelUpParticles.explode(25);
        }

        // Screen flash
        const flash = this.add.rectangle(400, 300, 800, 600, 0xffff00, 0.3).setDepth(5);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy()
        });
    }
}

export { GameScene };