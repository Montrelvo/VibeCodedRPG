class Player {
    constructor() {
        this.stats = {
            gold: 0,
            mana: 0,
            hp: 100,
            maxHp: 100,
            strength: 10,
            intelligence: 10,
            agility: 10,
            level: 1,
            xp: 0,
            skillPoints: 0
        };
        this.calculateXpToNextLevel();
    }

    calculateXpToNextLevel() {
        this.stats.xpToNextLevel = this.stats.level * 100;
    }

    addXp(amount) {
        this.stats.xp += amount;
        while (this.stats.xp >= this.stats.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.stats.xp -= this.stats.xpToNextLevel;
        this.stats.level++;
        this.stats.skillPoints += 5; // Grant 5 skill points per level up
        this.stats.maxHp += 10; // Increase max HP on level up
        this.stats.hp = this.stats.maxHp; // Restore HP on level up
        this.calculateXpToNextLevel();
        console.log(`Player leveled up to Level ${this.stats.level}! You have ${this.stats.skillPoints} skill points.`);
    }

    allocateSkillPoint(statName) {
        if (this.stats.skillPoints > 0) {
            if (this.stats.hasOwnProperty(statName)) {
                this.stats[statName]++;
                this.stats.skillPoints--;
                console.log(`Allocated point to ${statName}. ${statName}: ${this.stats[statName]}. Remaining skill points: ${this.stats.skillPoints}`);
                // Update derived stats if necessary (e.g., strength affects attack power)
                if (statName === 'strength') {
                    // Example: attack power = strength * 2
                }
            } else {
                console.warn(`Stat '${statName}' does not exist.`);
            }
        } else {
            console.warn('No skill points available.');
        }
    }

    // Method to get current player stats
    getStats() {
        return this.stats;
    }

    // Method to set player stats (e.g., for loading game)
    setStats(newStats) {
        Object.assign(this.stats, newStats);
        this.calculateXpToNextLevel(); // Recalculate XP to next level after loading
    }
}

export { Player };