// Character Definitions - CYBER THEME
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
        description: 'Neon blade fighter with plasma attacks'
    },
    SPEEDSTER: {
        id: 'speedster',
        name: 'Neon Rush',
        color: 0x00ff88,
        accentColor: 0x88ffff,
        speed: 380,
        weight: 0.8,
        jumpPower: 1.2,
        size: { width: 35, height: 55 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 8, knockback: 0.7, range: 40, startup: 3, duration: 10 },
            special: { damage: 14, knockback: 1.2, range: 80, startup: 6, duration: 20, type: 'dash' }
        },
        description: 'Lightning-fast cyber runner'
    },
    TANK: {
        id: 'tank',
        name: 'Mech Unit',
        color: 0x4488ff,
        accentColor: 0x00ffff,
        speed: 220,
        weight: 1.5,
        jumpPower: 0.8,
        size: { width: 50, height: 65 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 15, knockback: 1.3, range: 55, startup: 8, duration: 20 },
            special: { damage: 25, knockback: 1.8, range: 60, startup: 18, duration: 35, type: 'smash' }
        },
        description: 'Heavy assault mech armor'
    },
    NINJA: {
        id: 'ninja',
        name: 'Ghost Protocol',
        color: 0xaa00ff,
        accentColor: 0xff00aa,
        speed: 340,
        weight: 0.85,
        jumpPower: 1.3,
        size: { width: 35, height: 55 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 9, knockback: 0.8, range: 45, startup: 3, duration: 12 },
            special: { damage: 16, knockback: 1.5, range: 100, startup: 8, duration: 18, type: 'shuriken' }
        },
        description: 'Stealth hacker with holo-blades'
    },
    BRAWLER: {
        id: 'brawler',
        name: 'Chrome Fist',
        color: 0xff8800,
        accentColor: 0xffff00,
        speed: 300,
        weight: 1.0,
        jumpPower: 1.0,
        size: { width: 45, height: 58 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 10, knockback: 0.9, range: 48, startup: 4, duration: 14 },
            special: { damage: 20, knockback: 1.6, range: 55, startup: 10, duration: 30, type: 'uppercut' }
        },
        description: 'Cybernetic brawler with power fists'
    },
    MAGE: {
        id: 'mage',
        name: 'Data Witch',
        color: 0xff00ff,
        accentColor: 0x8800ff,
        speed: 260,
        weight: 0.9,
        jumpPower: 1.1,
        size: { width: 38, height: 58 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 7, knockback: 0.6, range: 60, startup: 5, duration: 15 },
            special: { damage: 22, knockback: 1.7, range: 150, startup: 15, duration: 40, type: 'fireball' }
        },
        description: 'Casts digital spells and viruses'
    },
    ROBOT: {
        id: 'robot',
        name: 'V-800',
        color: 0x00ffff,
        accentColor: 0xff00ff,
        speed: 270,
        weight: 1.3,
        jumpPower: 0.9,
        size: { width: 45, height: 60 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 11, knockback: 1.0, range: 50, startup: 6, duration: 16 },
            special: { damage: 18, knockback: 1.3, range: 120, startup: 12, duration: 28, type: 'laser' }
        },
        description: 'Combat android with laser systems'
    },
    PIRATE: {
        id: 'pirate',
        name: 'Net Runner',
        color: 0xffff00,
        accentColor: 0x00ff00,
        speed: 290,
        weight: 1.05,
        jumpPower: 1.0,
        size: { width: 42, height: 60 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 11, knockback: 1.0, range: 52, startup: 5, duration: 15 },
            special: { damage: 16, knockback: 1.4, range: 180, startup: 14, duration: 25, type: 'pistol' }
        },
        description: 'Digital pirate with EMP blaster'
    },
    FROSTMAGE: {
        id: 'frostmage',
        name: 'Cryo Unit',
        color: 0x00ddff,
        accentColor: 0xaaffff,
        speed: 240,
        weight: 0.95,
        jumpPower: 1.15,
        size: { width: 40, height: 60 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 8, knockback: 0.7, range: 55, startup: 5, duration: 14 },
            special: { damage: 20, knockback: 1.6, range: 140, startup: 12, duration: 35, type: 'ice' }
        },
        description: 'Cryogenic weapons specialist'
    },
    DEMON: {
        id: 'demon',
        name: 'Virus Prime',
        color: 0xff0044,
        accentColor: 0xff8800,
        speed: 320,
        weight: 1.2,
        jumpPower: 1.4,
        size: { width: 48, height: 65 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 13, knockback: 1.1, range: 60, startup: 6, duration: 16 },
            special: { damage: 24, knockback: 1.9, range: 90, startup: 10, duration: 32, type: 'inferno' }
        },
        description: 'Corrupted AI with malware attacks'
    },
    ANGEL: {
        id: 'angel',
        name: 'Guardian AI',
        color: 0xaaffff,
        accentColor: 0xffffff,
        speed: 310,
        weight: 0.9,
        jumpPower: 1.35,
        size: { width: 42, height: 62 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 9, knockback: 0.8, range: 50, startup: 4, duration: 12 },
            special: { damage: 17, knockback: 1.5, range: 160, startup: 11, duration: 28, type: 'holy' }
        },
        description: 'Protective firewall with light beams'
    },
    SHADOW: {
        id: 'shadow',
        name: 'Darknet',
        color: 0x8800ff,
        accentColor: 0x000044,
        speed: 360,
        weight: 0.8,
        jumpPower: 1.25,
        size: { width: 35, height: 56 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 10, knockback: 0.9, range: 45, startup: 3, duration: 11 },
            special: { damage: 19, knockback: 1.4, range: 110, startup: 7, duration: 22, type: 'shadow' }
        },
        description: 'Dark web assassin with glitch attacks'
    },
    BEAST: {
        id: 'beast',
        name: 'Cyber Wolf',
        color: 0x00ff44,
        accentColor: 0x88ff00,
        speed: 330,
        weight: 1.4,
        jumpPower: 1.1,
        size: { width: 50, height: 62 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 14, knockback: 1.2, range: 48, startup: 5, duration: 13 },
            special: { damage: 21, knockback: 1.7, range: 65, startup: 9, duration: 26, type: 'roar' }
        },
        description: 'Bio-mechanical predator'
    },
    DRUID: {
        id: 'druid',
        name: 'Bio Hacker',
        color: 0x00ff88,
        accentColor: 0x44ffaa,
        speed: 250,
        weight: 1.0,
        jumpPower: 1.2,
        size: { width: 42, height: 59 },
        bodyType: 'slim',
        attacks: {
            normal: { damage: 8, knockback: 0.75, range: 55, startup: 6, duration: 15 },
            special: { damage: 19, knockback: 1.5, range: 130, startup: 13, duration: 33, type: 'nature' }
        },
        description: 'Nano-tech nature controller'
    },
    KNIGHT: {
        id: 'knight',
        name: 'Titan Frame',
        color: 0xffaa00,
        accentColor: 0x888888,
        speed: 260,
        weight: 1.25,
        jumpPower: 0.95,
        size: { width: 48, height: 64 },
        bodyType: 'mechanical',
        attacks: {
            normal: { damage: 12, knockback: 1.15, range: 58, startup: 7, duration: 17 },
            special: { damage: 23, knockback: 1.8, range: 75, startup: 14, duration: 30, type: 'shield' }
        },
        description: 'Heavy exosuit with energy shield'
    }
};

// Character list for menus
const CHARACTER_LIST = Object.values(CHARACTERS);
