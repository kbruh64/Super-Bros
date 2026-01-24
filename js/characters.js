// Character Definitions
const CHARACTERS = {
    WARRIOR: {
        id: 'warrior',
        name: 'Warrior',
        color: 0xff4444,
        speed: 280,
        weight: 1.1,
        jumpPower: 1.0,
        size: { width: 40, height: 60 },
        attacks: {
            normal: { damage: 12, knockback: 1.0, range: 50, startup: 5, duration: 15 },
            special: { damage: 18, knockback: 1.4, range: 70, startup: 12, duration: 25, type: 'slash' }
        },
        description: 'Balanced fighter with strong melee attacks'
    },
    SPEEDSTER: {
        id: 'speedster',
        name: 'Speedster',
        color: 0x44ff44,
        speed: 380,
        weight: 0.8,
        jumpPower: 1.2,
        size: { width: 35, height: 55 },
        attacks: {
            normal: { damage: 8, knockback: 0.7, range: 40, startup: 3, duration: 10 },
            special: { damage: 14, knockback: 1.2, range: 80, startup: 6, duration: 20, type: 'dash' }
        },
        description: 'Fast and agile, but lightweight'
    },
    TANK: {
        id: 'tank',
        name: 'Tank',
        color: 0x4444ff,
        speed: 220,
        weight: 1.5,
        jumpPower: 0.8,
        size: { width: 50, height: 65 },
        attacks: {
            normal: { damage: 15, knockback: 1.3, range: 55, startup: 8, duration: 20 },
            special: { damage: 25, knockback: 1.8, range: 60, startup: 18, duration: 35, type: 'smash' }
        },
        description: 'Heavy hitter that is hard to launch'
    },
    NINJA: {
        id: 'ninja',
        name: 'Ninja',
        color: 0x8844ff,
        speed: 340,
        weight: 0.85,
        jumpPower: 1.3,
        size: { width: 35, height: 55 },
        attacks: {
            normal: { damage: 9, knockback: 0.8, range: 45, startup: 3, duration: 12 },
            special: { damage: 16, knockback: 1.5, range: 100, startup: 8, duration: 18, type: 'shuriken' }
        },
        description: 'Quick with ranged special attacks'
    },
    BRAWLER: {
        id: 'brawler',
        name: 'Brawler',
        color: 0xff8844,
        speed: 300,
        weight: 1.0,
        jumpPower: 1.0,
        size: { width: 45, height: 58 },
        attacks: {
            normal: { damage: 10, knockback: 0.9, range: 48, startup: 4, duration: 14 },
            special: { damage: 20, knockback: 1.6, range: 55, startup: 10, duration: 30, type: 'uppercut' }
        },
        description: 'Street fighter with powerful combos'
    },
    MAGE: {
        id: 'mage',
        name: 'Mage',
        color: 0xff44ff,
        speed: 260,
        weight: 0.9,
        jumpPower: 1.1,
        size: { width: 38, height: 58 },
        attacks: {
            normal: { damage: 7, knockback: 0.6, range: 60, startup: 5, duration: 15 },
            special: { damage: 22, knockback: 1.7, range: 150, startup: 15, duration: 40, type: 'fireball' }
        },
        description: 'Powerful ranged attacks but fragile'
    },
    ROBOT: {
        id: 'robot',
        name: 'Robot',
        color: 0x888888,
        speed: 270,
        weight: 1.3,
        jumpPower: 0.9,
        size: { width: 45, height: 60 },
        attacks: {
            normal: { damage: 11, knockback: 1.0, range: 50, startup: 6, duration: 16 },
            special: { damage: 18, knockback: 1.3, range: 120, startup: 12, duration: 28, type: 'laser' }
        },
        description: 'Mechanical fighter with laser attacks'
    },
    PIRATE: {
        id: 'pirate',
        name: 'Pirate',
        color: 0xffcc00,
        speed: 290,
        weight: 1.05,
        jumpPower: 1.0,
        size: { width: 42, height: 60 },
        attacks: {
            normal: { damage: 11, knockback: 1.0, range: 52, startup: 5, duration: 15 },
            special: { damage: 16, knockback: 1.4, range: 180, startup: 14, duration: 25, type: 'pistol' }
        },
        description: 'Swashbuckler with a trusty pistol'
    }
};

// Character list for menus
const CHARACTER_LIST = Object.values(CHARACTERS);
