import { EQUIPMENT_SLOTS } from '../items.js';

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

        // Equipment and inventory
        this.equipment = {
            [EQUIPMENT_SLOTS.WEAPON]: null,
            [EQUIPMENT_SLOTS.HEAD]: null,
            [EQUIPMENT_SLOTS.CHEST]: null,
            [EQUIPMENT_SLOTS.HANDS]: null,
            [EQUIPMENT_SLOTS.LEGS]: null,
            [EQUIPMENT_SLOTS.FEET]: null,
            [EQUIPMENT_SLOTS.ACCESSORY1]: null,
            [EQUIPMENT_SLOTS.ACCESSORY2]: null
        };

        this.inventory = [];
        this.maxInventorySize = 20; // Maximum items player can carry

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

    // Method to add gold (for resource generation)
    addGold(amount) {
        this.stats.gold += amount;
        if (this.stats.gold < 0) this.stats.gold = 0; // Prevent negative gold
    }

    // Method to add mana (for resource generation)
    addMana(amount) {
        this.stats.mana += amount;
        if (this.stats.mana < 0) this.stats.mana = 0; // Prevent negative mana
        // Cap mana at maxMana if needed
        if (this.stats.mana > this.stats.maxMana) this.stats.mana = this.stats.maxMana;
    }

    // Combat-related methods

    // Calculate derived combat stats
    calculateCombatStats() {
        // Base damage calculation: strength * 2
        this.stats.attackDamage = this.stats.strength * 2;

        // Base defense calculation: agility * 0.5
        this.stats.defense = this.stats.agility * 0.5;

        // Magic damage calculation: intelligence * 1.5
        this.stats.magicDamage = this.stats.intelligence * 1.5;

        // Max mana calculation: intelligence * 10
        this.stats.maxMana = this.stats.intelligence * 10;

        // Attack speed calculation: base 1.0, modified by agility
        this.stats.attackSpeed = 1.0 + (this.stats.agility * 0.01);

        return this.stats;
    }

    // Calculate damage dealt to enemy
    calculateDamageDealt() {
        let baseDamage = this.stats.attackDamage;
        // Critical hit chance: 5% + (agility * 0.1%)
        const critChance = 0.05 + (this.stats.agility * 0.001);
        const isCrit = Math.random() < critChance;

        if (isCrit) {
            baseDamage *= 1.5; // 50% bonus for critical hits
            console.log('Critical hit!');
        }

        // Add some randomness (±10%)
        const randomFactor = 0.9 + (Math.random() * 0.2);
        return Math.floor(baseDamage * randomFactor);
    }

    // Take damage from enemy
    takeDamage(damage) {
        // Apply defense reduction
        const actualDamage = Math.max(1, damage - this.stats.defense);
        this.stats.hp -= actualDamage;

        // Ensure HP doesn't go below 0
        if (this.stats.hp < 0) this.stats.hp = 0;

        console.log(`Player took ${actualDamage} damage. HP: ${this.stats.hp}/${this.stats.maxHp}`);
        return actualDamage;
    }

    // Check if player is alive
    isAlive() {
        return this.stats.hp > 0;
    }

    // Heal player (for potions, resting, etc.)
    heal(amount) {
        this.stats.hp += amount;
        if (this.stats.hp > this.stats.maxHp) {
            this.stats.hp = this.stats.maxHp;
        }
        console.log(`Player healed for ${amount}. HP: ${this.stats.hp}/${this.stats.maxHp}`);
    }

    // Add experience from combat
    addExperience(amount) {
        this.addXp(amount);
        console.log(`Gained ${amount} XP from combat`);
    }

    // Get player stats including combat stats
    getCombatStats() {
        this.calculateCombatStats();
        return {
            ...this.stats,
            attackDamage: this.stats.attackDamage,
            defense: this.stats.defense,
            magicDamage: this.stats.magicDamage,
            maxMana: this.stats.maxMana,
            attackSpeed: this.stats.attackSpeed
        };
    }

    // Reset player to full health (for testing or after death)
    resetHealth() {
        this.stats.hp = this.stats.maxHp;
    }

    // Equipment and Inventory Management

    // Calculate total stats including equipment bonuses
    getTotalStats() {
        const baseStats = { ...this.stats };
        const equipmentStats = this.getEquipmentStats();

        // Combine base stats with equipment bonuses
        const totalStats = { ...baseStats };
        for (const [stat, value] of Object.entries(equipmentStats)) {
            if (totalStats.hasOwnProperty(stat)) {
                totalStats[stat] += value;
            } else {
                totalStats[stat] = value;
            }
        }

        return totalStats;
    }

    // Get total equipment stat bonuses
    getEquipmentStats() {
        const equipmentStats = {};

        for (const item of Object.values(this.equipment)) {
            if (item) {
                for (const [stat, value] of Object.entries(item.stats)) {
                    if (equipmentStats[stat]) {
                        equipmentStats[stat] += value;
                    } else {
                        equipmentStats[stat] = value;
                    }
                }
            }
        }

        return equipmentStats;
    }

    // Equip an item
    equipItem(item) {
        if (!item || !item.slot) return false;

        const slot = item.slot;

        // If there's already an item in this slot, unequip it first
        if (this.equipment[slot]) {
            this.unequipItem(slot);
        }

        // Remove item from inventory if it's there
        const inventoryIndex = this.inventory.findIndex(invItem => invItem.uniqueId === item.uniqueId);
        if (inventoryIndex !== -1) {
            this.inventory.splice(inventoryIndex, 1);
        }

        // Equip the item
        this.equipment[slot] = item;

        console.log(`Equipped ${item.name} in ${slot} slot`);
        return true;
    }

    // Unequip an item from a specific slot
    unequipItem(slot) {
        const item = this.equipment[slot];
        if (!item) return false;

        // Try to add to inventory
        if (this.inventory.length >= this.maxInventorySize) {
            console.log('Inventory is full! Cannot unequip item.');
            return false;
        }

        // Remove from equipment and add to inventory
        this.equipment[slot] = null;
        this.inventory.push(item);

        console.log(`Unequipped ${item.name} from ${slot} slot`);
        return true;
    }

    // Add item to inventory
    addItemToInventory(item) {
        if (this.inventory.length >= this.maxInventorySize) {
            console.log('Inventory is full! Cannot add item.');
            return false;
        }

        this.inventory.push(item);
        console.log(`Added ${item.name} to inventory`);
        return true;
    }

    // Remove item from inventory
    removeItemFromInventory(uniqueId) {
        const index = this.inventory.findIndex(item => item.uniqueId === uniqueId);
        if (index !== -1) {
            const item = this.inventory.splice(index, 1)[0];
            console.log(`Removed ${item.name} from inventory`);
            return item;
        }
        return null;
    }

    // Get equipped item in a specific slot
    getEquippedItem(slot) {
        return this.equipment[slot];
    }

    // Get all equipped items
    getEquippedItems() {
        return { ...this.equipment };
    }

    // Get inventory items
    getInventory() {
        return [...this.inventory];
    }

    // Check if inventory has space
    hasInventorySpace() {
        return this.inventory.length < this.maxInventorySize;
    }

    // Get equipment stats for a specific slot
    getSlotStats(slot) {
        const item = this.equipment[slot];
        return item ? item.stats : {};
    }

    // Calculate combat stats including equipment
    getCombatStats() {
        this.calculateCombatStats();
        const equipmentStats = this.getEquipmentStats();

        // Apply equipment bonuses to combat stats
        const combatStats = { ...this.stats };

        // Equipment stat bonuses
        for (const [stat, value] of Object.entries(equipmentStats)) {
            if (combatStats.hasOwnProperty(stat)) {
                combatStats[stat] += value;
            }
        }

        return {
            ...combatStats,
            attackDamage: combatStats.attackDamage || 0,
            defense: combatStats.defense || 0,
            magicDamage: combatStats.magicDamage || 0,
            maxMana: combatStats.maxMana || combatStats.intelligence * 10,
            attackSpeed: combatStats.attackSpeed || 1.0
        };
    }
}

export { Player };