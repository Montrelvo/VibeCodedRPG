// Enemy data definitions for Idle Fantasy RPG
export const ENEMY_TYPES = {
    SLIME: 'slime',
    GOBLIN: 'goblin',
    SKELETON: 'skeleton',
    ORC: 'orc',
    DRAGON: 'dragon'
};

export const ENEMY_TEMPLATES = {
    [ENEMY_TYPES.SLIME]: {
        name: 'Slime',
        baseHp: 50,
        baseDamage: 5,
        baseXpReward: 10,
        baseGoldReward: 5,
        attackSpeed: 2000, // ms between attacks
        sprite: 'enemy_slime',
        color: 0x00ff00,
        scale: 0.6
    },
    [ENEMY_TYPES.GOBLIN]: {
        name: 'Goblin',
        baseHp: 100,
        baseDamage: 8,
        baseXpReward: 20,
        baseGoldReward: 10,
        attackSpeed: 1800,
        sprite: 'enemy_goblin',
        color: 0x008800,
        scale: 0.7
    },
    [ENEMY_TYPES.SKELETON]: {
        name: 'Skeleton',
        baseHp: 150,
        baseDamage: 12,
        baseXpReward: 35,
        baseGoldReward: 15,
        attackSpeed: 1600,
        sprite: 'enemy_skeleton',
        color: 0xcccccc,
        scale: 0.8
    },
    [ENEMY_TYPES.ORC]: {
        name: 'Orc',
        baseHp: 250,
        baseDamage: 18,
        baseXpReward: 60,
        baseGoldReward: 25,
        attackSpeed: 1400,
        sprite: 'enemy_orc',
        color: 0xff6600,
        scale: 0.9
    },
    [ENEMY_TYPES.DRAGON]: {
        name: 'Dragon',
        baseHp: 500,
        baseDamage: 30,
        baseXpReward: 150,
        baseGoldReward: 75,
        attackSpeed: 1200,
        sprite: 'enemy_dragon',
        color: 0xff0000,
        scale: 1.0
    }
};

// Dungeon configurations
export const DUNGEON_TYPES = {
    FOREST: 'forest',
    CAVE: 'cave',
    CASTLE: 'castle',
    VOLCANO: 'volcano'
};

export const DUNGEON_CONFIGS = {
    [DUNGEON_TYPES.FOREST]: {
        name: 'Enchanted Forest',
        enemyPool: [ENEMY_TYPES.SLIME, ENEMY_TYPES.GOBLIN],
        waveCount: 5,
        difficultyMultiplier: 1.0,
        backgroundColor: 0x228B22
    },
    [DUNGEON_TYPES.CAVE]: {
        name: 'Dark Cave',
        enemyPool: [ENEMY_TYPES.GOBLIN, ENEMY_TYPES.SKELETON],
        waveCount: 8,
        difficultyMultiplier: 1.3,
        backgroundColor: 0x2F2F2F
    },
    [DUNGEON_TYPES.CASTLE]: {
        name: 'Ancient Castle',
        enemyPool: [ENEMY_TYPES.SKELETON, ENEMY_TYPES.ORC],
        waveCount: 10,
        difficultyMultiplier: 1.6,
        backgroundColor: 0x8B4513
    },
    [DUNGEON_TYPES.VOLCANO]: {
        name: 'Volcano Depths',
        enemyPool: [ENEMY_TYPES.ORC, ENEMY_TYPES.DRAGON],
        waveCount: 12,
        difficultyMultiplier: 2.0,
        backgroundColor: 0x8B0000
    }
};

// Combat configuration
export const COMBAT_CONFIG = {
    PLAYER_ATTACK_SPEED: 1500, // ms between player attacks
    ENEMY_SPAWN_DELAY: 3000, // ms between enemy spawns
    WAVE_DELAY: 5000, // ms between waves
    MAX_ACTIVE_ENEMIES: 3,
    CRIT_CHANCE: 0.05, // 5% critical hit chance
    CRIT_MULTIPLIER: 1.5
};