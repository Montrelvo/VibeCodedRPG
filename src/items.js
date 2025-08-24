// Item system for Idle Fantasy RPG
export const ITEM_TYPES = {
    WEAPON: 'weapon',
    ARMOR: 'armor',
    ACCESSORY: 'accessory',
    CONSUMABLE: 'consumable'
};

export const ITEM_RARITIES = {
    COMMON: { name: 'Common', color: 0xcccccc, multiplier: 1.0 },
    UNCOMMON: { name: 'Uncommon', color: 0x00ff00, multiplier: 1.2 },
    RARE: { name: 'Rare', color: 0x0088ff, multiplier: 1.5 },
    EPIC: { name: 'Epic', color: 0xff00ff, multiplier: 2.0 },
    LEGENDARY: { name: 'Legendary', color: 0xffaa00, multiplier: 3.0 }
};

export const EQUIPMENT_SLOTS = {
    WEAPON: 'weapon',
    HEAD: 'head',
    CHEST: 'chest',
    HANDS: 'hands',
    LEGS: 'legs',
    FEET: 'feet',
    ACCESSORY1: 'accessory1',
    ACCESSORY2: 'accessory2'
};

// Base item templates
export const ITEM_TEMPLATES = {
    // Weapons
    WOODEN_SWORD: {
        id: 'wooden_sword',
        name: 'Wooden Sword',
        type: ITEM_TYPES.WEAPON,
        slot: EQUIPMENT_SLOTS.WEAPON,
        rarity: ITEM_RARITIES.COMMON,
        baseStats: { attackDamage: 5 },
        description: 'A simple wooden sword for beginners'
    },
    IRON_SWORD: {
        id: 'iron_sword',
        name: 'Iron Sword',
        type: ITEM_TYPES.WEAPON,
        slot: EQUIPMENT_SLOTS.WEAPON,
        rarity: ITEM_RARITIES.UNCOMMON,
        baseStats: { attackDamage: 12 },
        description: 'A sturdy iron sword'
    },
    STEEL_CLAYMORE: {
        id: 'steel_claymore',
        name: 'Steel Claymore',
        type: ITEM_TYPES.WEAPON,
        slot: EQUIPMENT_SLOTS.WEAPON,
        rarity: ITEM_RARITIES.RARE,
        baseStats: { attackDamage: 25 },
        description: 'A massive two-handed sword'
    },
    MYTHRIL_RAPIER: {
        id: 'mythril_rapier',
        name: 'Mythril Rapier',
        type: ITEM_TYPES.WEAPON,
        slot: EQUIPMENT_SLOTS.WEAPON,
        rarity: ITEM_RARITIES.EPIC,
        baseStats: { attackDamage: 40, agility: 5 },
        description: 'A lightweight but deadly rapier'
    },
    DRAGON_SLAYER: {
        id: 'dragon_slayer',
        name: 'Dragon Slayer',
        type: ITEM_TYPES.WEAPON,
        slot: EQUIPMENT_SLOTS.WEAPON,
        rarity: ITEM_RARITIES.LEGENDARY,
        baseStats: { attackDamage: 75, strength: 10 },
        description: 'Said to have slain a dragon'
    },

    // Armor
    CLOTH_TUNIC: {
        id: 'cloth_tunic',
        name: 'Cloth Tunic',
        type: ITEM_TYPES.ARMOR,
        slot: EQUIPMENT_SLOTS.CHEST,
        rarity: ITEM_RARITIES.COMMON,
        baseStats: { defense: 3 },
        description: 'Basic cloth protection'
    },
    LEATHER_ARMOR: {
        id: 'leather_armor',
        name: 'Leather Armor',
        type: ITEM_TYPES.ARMOR,
        slot: EQUIPMENT_SLOTS.CHEST,
        rarity: ITEM_RARITIES.UNCOMMON,
        baseStats: { defense: 8, agility: 2 },
        description: 'Light but effective protection'
    },
    CHAIN_MAIL: {
        id: 'chain_mail',
        name: 'Chain Mail',
        type: ITEM_TYPES.ARMOR,
        slot: EQUIPMENT_SLOTS.CHEST,
        rarity: ITEM_RARITIES.RARE,
        baseStats: { defense: 15 },
        description: 'Interlocking metal rings provide excellent protection'
    },
    PLATE_ARMOR: {
        id: 'plate_armor',
        name: 'Plate Armor',
        type: ITEM_TYPES.ARMOR,
        slot: EQUIPMENT_SLOTS.CHEST,
        rarity: ITEM_RARITIES.EPIC,
        baseStats: { defense: 25, strength: 5 },
        description: 'Heavy but nearly impenetrable'
    },
    DRAGON_SCALE: {
        id: 'dragon_scale',
        name: 'Dragon Scale Armor',
        type: ITEM_TYPES.ARMOR,
        slot: EQUIPMENT_SLOTS.CHEST,
        rarity: ITEM_RARITIES.LEGENDARY,
        baseStats: { defense: 40, strength: 8, intelligence: 5 },
        description: 'Forged from the scales of a dragon'
    },

    // Accessories
    HEALTH_AMULET: {
        id: 'health_amulet',
        name: 'Amulet of Vitality',
        type: ITEM_TYPES.ACCESSORY,
        slot: EQUIPMENT_SLOTS.ACCESSORY1,
        rarity: ITEM_RARITIES.UNCOMMON,
        baseStats: { maxHp: 20 },
        description: 'Increases maximum health'
    },
    MAGIC_RING: {
        id: 'magic_ring',
        name: 'Ring of Magic',
        type: ITEM_TYPES.ACCESSORY,
        slot: EQUIPMENT_SLOTS.ACCESSORY2,
        rarity: ITEM_RARITIES.RARE,
        baseStats: { intelligence: 8, maxMana: 30 },
        description: 'Enhances magical abilities'
    },
    AGILITY_BOOTS: {
        id: 'agility_boots',
        name: 'Boots of Speed',
        type: ITEM_TYPES.ARMOR,
        slot: EQUIPMENT_SLOTS.FEET,
        rarity: ITEM_RARITIES.UNCOMMON,
        baseStats: { agility: 5 },
        description: 'Light boots that enhance movement speed'
    }
};

// Generate random item based on level and type
export function generateRandomItem(level = 1, itemType = null) {
    // Filter templates by type if specified
    let availableTemplates = Object.values(ITEM_TEMPLATES);
    if (itemType) {
        availableTemplates = availableTemplates.filter(template => template.type === itemType);
    }

    // Select random template
    const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];

    // Calculate level-based stats
    const levelMultiplier = 1 + ((level - 1) * 0.1);
    const rarityMultiplier = template.rarity.multiplier;

    const itemStats = {};
    for (const [stat, baseValue] of Object.entries(template.baseStats)) {
        itemStats[stat] = Math.floor(baseValue * levelMultiplier * rarityMultiplier);
    }

    return {
        id: template.id,
        name: template.name,
        type: template.type,
        slot: template.slot,
        rarity: template.rarity,
        stats: itemStats,
        description: template.description,
        level: level,
        uniqueId: Date.now() + Math.random() // Unique identifier for inventory
    };
}

// Generate item drops based on enemy level and type
export function generateEnemyDrop(enemyType, enemyLevel) {
    const dropChances = {
        common: 0.4,    // 40% chance for common items
        uncommon: 0.25, // 25% chance for uncommon
        rare: 0.1,      // 10% chance for rare
        epic: 0.03,     // 3% chance for epic
        legendary: 0.01 // 1% chance for legendary
    };

    // Determine rarity based on weighted random
    const rand = Math.random();
    let selectedRarity = ITEM_RARITIES.COMMON;

    if (rand < dropChances.legendary) {
        selectedRarity = ITEM_RARITIES.LEGENDARY;
    } else if (rand < dropChances.legendary + dropChances.epic) {
        selectedRarity = ITEM_RARITIES.EPIC;
    } else if (rand < dropChances.legendary + dropChances.epic + dropChances.rare) {
        selectedRarity = ITEM_RARITIES.RARE;
    } else if (rand < dropChances.legendary + dropChances.epic + dropChances.rare + dropChances.uncommon) {
        selectedRarity = ITEM_RARITIES.UNCOMMON;
    }

    // Get templates of selected rarity
    const rarityTemplates = Object.values(ITEM_TEMPLATES).filter(template => template.rarity === selectedRarity);

    if (rarityTemplates.length === 0) {
        // Fallback to any item if no items of that rarity exist
        return generateRandomItem(enemyLevel);
    }

    // Select random template of the chosen rarity
    const template = rarityTemplates[Math.floor(Math.random() * rarityTemplates.length)];

    // Calculate stats with enemy level
    const levelMultiplier = 1 + ((enemyLevel - 1) * 0.1);
    const rarityMultiplier = template.rarity.multiplier;

    const itemStats = {};
    for (const [stat, baseValue] of Object.entries(template.baseStats)) {
        itemStats[stat] = Math.floor(baseValue * levelMultiplier * rarityMultiplier);
    }

    return {
        id: template.id,
        name: template.name,
        type: template.type,
        slot: template.slot,
        rarity: template.rarity,
        stats: itemStats,
        description: template.description,
        level: enemyLevel,
        uniqueId: Date.now() + Math.random()
    };
}