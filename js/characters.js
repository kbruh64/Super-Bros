// Character Definitions - CYBER THEME with 20 unique fighters
const CHARACTERS = {
    WARRIOR: {
        id: 'warrior',
        name: 'Cyber Blade',
        color: 0xff00ff,
        accentColor: 0x00ffff,
        speed: 280,
        weight: 1.1,
        jumpPower: 1.0,
        size: { width: 40, height: 60 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 12, knockback: 1.0, range: 50, startup: 5, duration: 15 },
            special: { damage: 18, knockback: 1.4, range: 70, startup: 12, duration: 25, type: 'slash' }
        },
        description: 'Neon blade fighter with plasma sword attacks'
    },
    SPEEDSTER: {
        id: 'speedster',
        name: 'Neon Rush',
        color: 0x00ff88,
        accentColor: 0x88ffff,
        speed: 400,
        weight: 0.7,
        jumpPower: 1.3,
        size: { width: 32, height: 52 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 6, knockback: 0.5, range: 35, startup: 2, duration: 8 },
            special: { damage: 14, knockback: 1.4, range: 120, startup: 4, duration: 15, type: 'dash' }
        },
        description: 'Blazing fast with multi-hit dash attacks'
    },
    TANK: {
        id: 'tank',
        name: 'Mech Titan',
        color: 0x4488ff,
        accentColor: 0x00ffff,
        speed: 180,
        weight: 1.8,
        jumpPower: 0.6,
        size: { width: 55, height: 70 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 18, knockback: 1.5, range: 60, startup: 10, duration: 25 },
            special: { damage: 30, knockback: 2.2, range: 80, startup: 20, duration: 40, type: 'smash' }
        },
        description: 'Massive mech with devastating ground pounds'
    },
    NINJA: {
        id: 'ninja',
        name: 'Ghost Protocol',
        color: 0xaa00ff,
        accentColor: 0xff00aa,
        speed: 350,
        weight: 0.75,
        jumpPower: 1.4,
        size: { width: 32, height: 52 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 8, knockback: 0.6, range: 40, startup: 2, duration: 10 },
            special: { damage: 12, knockback: 1.2, range: 200, startup: 5, duration: 12, type: 'shuriken' }
        },
        description: 'Teleporting assassin with holo-shuriken'
    },
    BRAWLER: {
        id: 'brawler',
        name: 'Chrome Fist',
        color: 0xff8800,
        accentColor: 0xffff00,
        speed: 300,
        weight: 1.15,
        jumpPower: 1.0,
        size: { width: 45, height: 58 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 11, knockback: 1.0, range: 45, startup: 3, duration: 12 },
            special: { damage: 22, knockback: 1.8, range: 50, startup: 8, duration: 25, type: 'uppercut' }
        },
        description: 'Power-fist combos with rocket uppercut'
    },
    MAGE: {
        id: 'mage',
        name: 'Data Witch',
        color: 0xff00ff,
        accentColor: 0x8800ff,
        speed: 250,
        weight: 0.85,
        jumpPower: 1.15,
        size: { width: 36, height: 56 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 6, knockback: 0.5, range: 70, startup: 6, duration: 18 },
            special: { damage: 25, knockback: 2.0, range: 250, startup: 18, duration: 45, type: 'fireball' }
        },
        description: 'Long-range digital virus projectiles'
    },
    ROBOT: {
        id: 'robot',
        name: 'V-800',
        color: 0x00ffff,
        accentColor: 0xff00ff,
        speed: 260,
        weight: 1.4,
        jumpPower: 0.85,
        size: { width: 48, height: 62 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 13, knockback: 1.1, range: 55, startup: 7, duration: 18 },
            special: { damage: 20, knockback: 1.5, range: 180, startup: 15, duration: 30, type: 'laser' }
        },
        description: 'Combat android with piercing laser beam'
    },
    PIRATE: {
        id: 'pirate',
        name: 'Net Runner',
        color: 0xffff00,
        accentColor: 0x00ff00,
        speed: 290,
        weight: 1.0,
        jumpPower: 1.05,
        size: { width: 40, height: 58 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 10, knockback: 0.9, range: 48, startup: 4, duration: 14 },
            special: { damage: 15, knockback: 1.3, range: 220, startup: 10, duration: 20, type: 'pistol' }
        },
        description: 'Hacker with rapid-fire EMP blaster'
    },
    FROSTMAGE: {
        id: 'frostmage',
        name: 'Cryo Unit',
        color: 0x00ddff,
        accentColor: 0xaaffff,
        speed: 230,
        weight: 1.0,
        jumpPower: 1.1,
        size: { width: 42, height: 60 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 7, knockback: 0.6, range: 60, startup: 5, duration: 16 },
            special: { damage: 18, knockback: 1.4, range: 180, startup: 14, duration: 35, type: 'ice' }
        },
        description: 'Freezing attacks that slow enemies'
    },
    DEMON: {
        id: 'demon',
        name: 'Virus Prime',
        color: 0xff0044,
        accentColor: 0xff8800,
        speed: 320,
        weight: 1.25,
        jumpPower: 1.35,
        size: { width: 50, height: 68 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 14, knockback: 1.2, range: 55, startup: 5, duration: 14 },
            special: { damage: 26, knockback: 2.0, range: 100, startup: 12, duration: 30, type: 'inferno' }
        },
        description: 'Corrupted AI with explosive malware'
    },
    ANGEL: {
        id: 'angel',
        name: 'Guardian AI',
        color: 0xaaffff,
        accentColor: 0xffffff,
        speed: 310,
        weight: 0.85,
        jumpPower: 1.5,
        size: { width: 40, height: 60 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 8, knockback: 0.7, range: 50, startup: 4, duration: 12 },
            special: { damage: 16, knockback: 1.4, range: 200, startup: 12, duration: 28, type: 'holy' }
        },
        description: 'Floaty with healing light beams'
    },
    SHADOW: {
        id: 'shadow',
        name: 'Darknet',
        color: 0x8800ff,
        accentColor: 0x220044,
        speed: 370,
        weight: 0.7,
        jumpPower: 1.3,
        size: { width: 30, height: 54 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 9, knockback: 0.8, range: 40, startup: 2, duration: 10 },
            special: { damage: 18, knockback: 1.5, range: 150, startup: 6, duration: 20, type: 'shadow' }
        },
        description: 'Phase through attacks with glitch teleport'
    },
    BEAST: {
        id: 'beast',
        name: 'Cyber Wolf',
        color: 0x00ff44,
        accentColor: 0x88ff00,
        speed: 340,
        weight: 1.35,
        jumpPower: 1.2,
        size: { width: 52, height: 58 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 15, knockback: 1.3, range: 45, startup: 4, duration: 12 },
            special: { damage: 20, knockback: 1.6, range: 60, startup: 8, duration: 22, type: 'roar' }
        },
        description: 'Savage mechanical predator with pounce'
    },
    DRUID: {
        id: 'druid',
        name: 'Bio Hacker',
        color: 0x00ff88,
        accentColor: 0x44ffaa,
        speed: 250,
        weight: 1.0,
        jumpPower: 1.15,
        size: { width: 40, height: 58 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 7, knockback: 0.65, range: 60, startup: 6, duration: 16 },
            special: { damage: 18, knockback: 1.4, range: 160, startup: 14, duration: 35, type: 'nature' }
        },
        description: 'Nano-vine traps and area denial'
    },
    KNIGHT: {
        id: 'knight',
        name: 'Titan Frame',
        color: 0xffaa00,
        accentColor: 0x888888,
        speed: 240,
        weight: 1.5,
        jumpPower: 0.9,
        size: { width: 52, height: 66 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 14, knockback: 1.2, range: 55, startup: 8, duration: 18 },
            special: { damage: 20, knockback: 1.6, range: 70, startup: 15, duration: 30, type: 'shield' }
        },
        description: 'Heavy exosuit with reflective shield bash'
    },
    // ===== NEW CHARACTERS =====
    HACKER: {
        id: 'hacker',
        name: 'Zero Day',
        color: 0x00ff00,
        accentColor: 0x003300,
        speed: 280,
        weight: 0.9,
        jumpPower: 1.1,
        size: { width: 38, height: 56 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 8, knockback: 0.7, range: 55, startup: 4, duration: 12 },
            special: { damage: 20, knockback: 1.6, range: 300, startup: 20, duration: 40, type: 'hack' }
        },
        description: 'Places traps and hacks enemy controls'
    },
    SNIPER: {
        id: 'sniper',
        name: 'Railgun',
        color: 0xff4400,
        accentColor: 0xffaa00,
        speed: 240,
        weight: 0.95,
        jumpPower: 1.0,
        size: { width: 36, height: 58 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 6, knockback: 0.5, range: 40, startup: 5, duration: 14 },
            special: { damage: 35, knockback: 2.5, range: 400, startup: 25, duration: 50, type: 'railgun' }
        },
        description: 'Slow but devastating long-range shots'
    },
    BOMBER: {
        id: 'bomber',
        name: 'Payload',
        color: 0xff6600,
        accentColor: 0xffff00,
        speed: 220,
        weight: 1.3,
        jumpPower: 0.95,
        size: { width: 48, height: 60 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 10, knockback: 0.9, range: 50, startup: 6, duration: 16 },
            special: { damage: 28, knockback: 2.2, range: 120, startup: 16, duration: 35, type: 'bomb' }
        },
        description: 'Explosive projectiles with area damage'
    },
    STRIKER: {
        id: 'striker',
        name: 'Blitz',
        color: 0xffff00,
        accentColor: 0xff8800,
        speed: 360,
        weight: 0.9,
        jumpPower: 1.25,
        size: { width: 35, height: 55 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 7, knockback: 0.6, range: 38, startup: 2, duration: 8 },
            special: { damage: 16, knockback: 1.5, range: 80, startup: 5, duration: 18, type: 'lightning' }
        },
        description: 'Electric speed demon with chain lightning'
    },
    GOLEM: {
        id: 'golem',
        name: 'Monolith',
        color: 0x888888,
        accentColor: 0x00ffff,
        speed: 160,
        weight: 2.0,
        jumpPower: 0.5,
        size: { width: 60, height: 75 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 20, knockback: 1.6, range: 65, startup: 12, duration: 28 },
            special: { damage: 35, knockback: 2.5, range: 90, startup: 25, duration: 50, type: 'earthquake' }
        },
        description: 'Immovable fortress with ground-shaking slams'
    }
};

// Character list for menus
const CHARACTER_LIST = Object.values(CHARACTERS);
