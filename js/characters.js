// Character Definitions - CYBER THEME with 30 unique fighters
// BALANCE NOTES:
// - Fast chars: high speed, low weight/damage
// - Heavy chars: slow, high damage/weight
// - Balanced chars: moderate all stats
const CHARACTERS = {
    // ===== BALANCED FIGHTERS =====
    WARRIOR: {
        id: 'warrior',
        name: 'Cyber Blade',
        color: 0xff00ff,
        accentColor: 0x00ffff,
        speed: 290,
        weight: 1.1,
        jumpPower: 1.0,
        size: { width: 40, height: 60 },
        bodyType: 'mechanical',
        attackEffect: 'slash_purple',
        attacks: {
            normal: { damage: 11, knockback: 1.0, range: 50, startup: 4, duration: 14 },
            special: { damage: 20, knockback: 1.5, range: 75, startup: 10, duration: 22, type: 'slash' }
        },
        description: 'Neon blade fighter with plasma sword attacks'
    },
    BRAWLER: {
        id: 'brawler',
        name: 'Chrome Fist',
        color: 0xff8800,
        accentColor: 0xffff00,
        speed: 280,
        weight: 1.2,
        jumpPower: 0.95,
        size: { width: 45, height: 58 },
        bodyType: 'mechanical',
        attackEffect: 'punch_orange',
        attacks: {
            normal: { damage: 13, knockback: 1.1, range: 42, startup: 3, duration: 11 },
            special: { damage: 24, knockback: 2.0, range: 55, startup: 7, duration: 22, type: 'uppercut' }
        },
        description: 'Power-fist combos with rocket uppercut'
    },
    PIRATE: {
        id: 'pirate',
        name: 'Net Runner',
        color: 0xffff00,
        accentColor: 0x00ff00,
        speed: 300,
        weight: 1.0,
        jumpPower: 1.05,
        size: { width: 40, height: 58 },
        bodyType: 'slim',
        attackEffect: 'shot_yellow',
        attacks: {
            normal: { damage: 9, knockback: 0.8, range: 48, startup: 3, duration: 12 },
            special: { damage: 16, knockback: 1.4, range: 200, startup: 8, duration: 18, type: 'pistol' }
        },
        description: 'Hacker with rapid-fire EMP blaster'
    },
    ROBOT: {
        id: 'robot',
        name: 'V-800',
        color: 0x00ffff,
        accentColor: 0xff00ff,
        speed: 260,
        weight: 1.35,
        jumpPower: 0.9,
        size: { width: 48, height: 62 },
        bodyType: 'mechanical',
        attackEffect: 'beam_cyan',
        attacks: {
            normal: { damage: 12, knockback: 1.0, range: 52, startup: 6, duration: 16 },
            special: { damage: 22, knockback: 1.6, range: 200, startup: 14, duration: 28, type: 'laser' }
        },
        description: 'Combat android with piercing laser beam'
    },

    // ===== SPEED FIGHTERS (buffed damage slightly, glass cannons) =====
    SPEEDSTER: {
        id: 'speedster',
        name: 'Neon Rush',
        color: 0x00ff88,
        accentColor: 0x88ffff,
        speed: 420,
        weight: 0.65,
        jumpPower: 1.35,
        size: { width: 32, height: 52 },
        bodyType: 'slim',
        attackEffect: 'dash_green',
        attacks: {
            normal: { damage: 7, knockback: 0.5, range: 35, startup: 2, duration: 7 },
            special: { damage: 16, knockback: 1.5, range: 130, startup: 3, duration: 14, type: 'dash' }
        },
        description: 'Blazing fast with multi-hit dash attacks'
    },
    NINJA: {
        id: 'ninja',
        name: 'Ghost Protocol',
        color: 0xaa00ff,
        accentColor: 0xff00aa,
        speed: 380,
        weight: 0.7,
        jumpPower: 1.45,
        size: { width: 32, height: 52 },
        bodyType: 'slim',
        attackEffect: 'kunai_purple',
        attacks: {
            normal: { damage: 8, knockback: 0.6, range: 38, startup: 2, duration: 9 },
            special: { damage: 14, knockback: 1.3, range: 220, startup: 4, duration: 11, type: 'shuriken' }
        },
        description: 'Teleporting assassin with holo-shuriken'
    },
    SHADOW: {
        id: 'shadow',
        name: 'Darknet',
        color: 0x8800ff,
        accentColor: 0x220044,
        speed: 390,
        weight: 0.65,
        jumpPower: 1.35,
        size: { width: 30, height: 54 },
        bodyType: 'slim',
        attackEffect: 'void_dark',
        attacks: {
            normal: { damage: 8, knockback: 0.7, range: 38, startup: 2, duration: 9 },
            special: { damage: 20, knockback: 1.6, range: 160, startup: 5, duration: 18, type: 'shadow' }
        },
        description: 'Phase through attacks with glitch teleport'
    },
    STRIKER: {
        id: 'striker',
        name: 'Blitz',
        color: 0xffff00,
        accentColor: 0xff8800,
        speed: 400,
        weight: 0.75,
        jumpPower: 1.3,
        size: { width: 35, height: 55 },
        bodyType: 'slim',
        attackEffect: 'spark_yellow',
        attacks: {
            normal: { damage: 8, knockback: 0.65, range: 36, startup: 2, duration: 7 },
            special: { damage: 18, knockback: 1.6, range: 90, startup: 4, duration: 16, type: 'lightning' }
        },
        description: 'Electric speed demon with chain lightning'
    },

    // ===== HEAVY FIGHTERS (nerfed speed, buffed damage) =====
    TANK: {
        id: 'tank',
        name: 'Mech Titan',
        color: 0x4488ff,
        accentColor: 0x00ffff,
        speed: 160,
        weight: 1.9,
        jumpPower: 0.55,
        size: { width: 55, height: 70 },
        bodyType: 'mechanical',
        attackEffect: 'crush_blue',
        attacks: {
            normal: { damage: 20, knockback: 1.6, range: 62, startup: 11, duration: 26 },
            special: { damage: 35, knockback: 2.4, range: 85, startup: 22, duration: 42, type: 'smash' }
        },
        description: 'Massive mech with devastating ground pounds'
    },
    KNIGHT: {
        id: 'knight',
        name: 'Titan Frame',
        color: 0xffaa00,
        accentColor: 0x888888,
        speed: 200,
        weight: 1.6,
        jumpPower: 0.85,
        size: { width: 52, height: 66 },
        bodyType: 'mechanical',
        attackEffect: 'shield_gold',
        attacks: {
            normal: { damage: 15, knockback: 1.3, range: 58, startup: 7, duration: 17 },
            special: { damage: 22, knockback: 1.8, range: 75, startup: 14, duration: 28, type: 'shield' }
        },
        description: 'Heavy exosuit with reflective shield bash'
    },
    GOLEM: {
        id: 'golem',
        name: 'Monolith',
        color: 0x888888,
        accentColor: 0x00ffff,
        speed: 140,
        weight: 2.2,
        jumpPower: 0.45,
        size: { width: 60, height: 75 },
        bodyType: 'mechanical',
        attackEffect: 'quake_gray',
        attacks: {
            normal: { damage: 22, knockback: 1.8, range: 68, startup: 14, duration: 30 },
            special: { damage: 40, knockback: 2.8, range: 100, startup: 28, duration: 55, type: 'earthquake' }
        },
        description: 'Immovable fortress with ground-shaking slams'
    },
    BEAST: {
        id: 'beast',
        name: 'Cyber Wolf',
        color: 0x00ff44,
        accentColor: 0x88ff00,
        speed: 320,
        weight: 1.4,
        jumpPower: 1.25,
        size: { width: 52, height: 58 },
        bodyType: 'mechanical',
        attackEffect: 'claw_green',
        attacks: {
            normal: { damage: 16, knockback: 1.4, range: 48, startup: 3, duration: 11 },
            special: { damage: 24, knockback: 1.8, range: 65, startup: 7, duration: 20, type: 'roar' }
        },
        description: 'Savage mechanical predator with pounce'
    },

    // ===== MAGE/RANGED FIGHTERS (glass cannon, high damage specials) =====
    MAGE: {
        id: 'mage',
        name: 'Data Witch',
        color: 0xff00ff,
        accentColor: 0x8800ff,
        speed: 240,
        weight: 0.8,
        jumpPower: 1.15,
        size: { width: 36, height: 56 },
        bodyType: 'slim',
        attackEffect: 'magic_pink',
        attacks: {
            normal: { damage: 7, knockback: 0.5, range: 65, startup: 5, duration: 15 },
            special: { damage: 28, knockback: 2.2, range: 280, startup: 16, duration: 40, type: 'fireball' }
        },
        description: 'Long-range digital virus projectiles'
    },
    FROSTMAGE: {
        id: 'frostmage',
        name: 'Cryo Unit',
        color: 0x00ddff,
        accentColor: 0xaaffff,
        speed: 220,
        weight: 0.95,
        jumpPower: 1.1,
        size: { width: 42, height: 60 },
        bodyType: 'mechanical',
        attackEffect: 'frost_blue',
        attacks: {
            normal: { damage: 8, knockback: 0.6, range: 58, startup: 5, duration: 14 },
            special: { damage: 20, knockback: 1.5, range: 200, startup: 12, duration: 32, type: 'ice' }
        },
        description: 'Freezing attacks that slow enemies'
    },
    SNIPER: {
        id: 'sniper',
        name: 'Railgun',
        color: 0xff4400,
        accentColor: 0xffaa00,
        speed: 230,
        weight: 0.9,
        jumpPower: 1.0,
        size: { width: 36, height: 58 },
        bodyType: 'slim',
        attackEffect: 'rail_red',
        attacks: {
            normal: { damage: 7, knockback: 0.5, range: 42, startup: 5, duration: 13 },
            special: { damage: 42, knockback: 2.8, range: 450, startup: 28, duration: 55, type: 'railgun' }
        },
        description: 'Slow but devastating long-range shots'
    },
    HACKER: {
        id: 'hacker',
        name: 'Zero Day',
        color: 0x00ff00,
        accentColor: 0x003300,
        speed: 270,
        weight: 0.85,
        jumpPower: 1.1,
        size: { width: 38, height: 56 },
        bodyType: 'slim',
        attackEffect: 'data_green',
        attacks: {
            normal: { damage: 8, knockback: 0.65, range: 52, startup: 4, duration: 11 },
            special: { damage: 22, knockback: 1.7, range: 320, startup: 18, duration: 38, type: 'hack' }
        },
        description: 'Places traps and hacks enemy controls'
    },

    // ===== HYBRID FIGHTERS (unique playstyles) =====
    DEMON: {
        id: 'demon',
        name: 'Virus Prime',
        color: 0xff0044,
        accentColor: 0xff8800,
        speed: 310,
        weight: 1.3,
        jumpPower: 1.4,
        size: { width: 50, height: 68 },
        bodyType: 'mechanical',
        attackEffect: 'fire_red',
        attacks: {
            normal: { damage: 14, knockback: 1.2, range: 52, startup: 4, duration: 13 },
            special: { damage: 28, knockback: 2.2, range: 110, startup: 11, duration: 28, type: 'inferno' }
        },
        description: 'Corrupted AI with explosive malware'
    },
    ANGEL: {
        id: 'angel',
        name: 'Guardian AI',
        color: 0xaaffff,
        accentColor: 0xffffff,
        speed: 290,
        weight: 0.8,
        jumpPower: 1.55,
        size: { width: 40, height: 60 },
        bodyType: 'slim',
        attackEffect: 'holy_white',
        attacks: {
            normal: { damage: 9, knockback: 0.7, range: 48, startup: 4, duration: 11 },
            special: { damage: 18, knockback: 1.5, range: 220, startup: 10, duration: 25, type: 'holy' }
        },
        description: 'Floaty with healing light beams'
    },
    DRUID: {
        id: 'druid',
        name: 'Bio Hacker',
        color: 0x00ff88,
        accentColor: 0x44ffaa,
        speed: 260,
        weight: 1.0,
        jumpPower: 1.15,
        size: { width: 40, height: 58 },
        bodyType: 'slim',
        attackEffect: 'vine_green',
        attacks: {
            normal: { damage: 8, knockback: 0.6, range: 58, startup: 5, duration: 14 },
            special: { damage: 20, knockback: 1.5, range: 180, startup: 12, duration: 32, type: 'nature' }
        },
        description: 'Nano-vine traps and area denial'
    },
    BOMBER: {
        id: 'bomber',
        name: 'Payload',
        color: 0xff6600,
        accentColor: 0xffff00,
        speed: 210,
        weight: 1.35,
        jumpPower: 0.9,
        size: { width: 48, height: 60 },
        bodyType: 'mechanical',
        attackEffect: 'bomb_orange',
        attacks: {
            normal: { damage: 11, knockback: 1.0, range: 48, startup: 5, duration: 15 },
            special: { damage: 32, knockback: 2.4, range: 130, startup: 14, duration: 32, type: 'bomb' }
        },
        description: 'Explosive projectiles with area damage'
    },

    // ===== NEW CHARACTERS (10 more) =====
    SAMURAI: {
        id: 'samurai',
        name: 'Ronin.exe',
        color: 0xff2222,
        accentColor: 0xffffaa,
        speed: 300,
        weight: 1.05,
        jumpPower: 1.1,
        size: { width: 38, height: 60 },
        bodyType: 'slim',
        attackEffect: 'katana_red',
        attacks: {
            normal: { damage: 14, knockback: 1.1, range: 55, startup: 3, duration: 10 },
            special: { damage: 26, knockback: 2.0, range: 80, startup: 8, duration: 20, type: 'iai' }
        },
        description: 'Precise counter-attacks with quick draw'
    },
    MEDIC: {
        id: 'medic',
        name: 'Nano Doc',
        color: 0x44ff44,
        accentColor: 0xffffff,
        speed: 270,
        weight: 0.9,
        jumpPower: 1.1,
        size: { width: 36, height: 56 },
        bodyType: 'slim',
        attackEffect: 'heal_green',
        attacks: {
            normal: { damage: 6, knockback: 0.5, range: 45, startup: 4, duration: 12 },
            special: { damage: 15, knockback: 1.2, range: 150, startup: 10, duration: 25, type: 'heal' }
        },
        description: 'Support fighter with healing nanobots'
    },
    PHANTOM: {
        id: 'phantom',
        name: 'Wraith',
        color: 0x6600aa,
        accentColor: 0xcc00ff,
        speed: 350,
        weight: 0.6,
        jumpPower: 1.4,
        size: { width: 32, height: 56 },
        bodyType: 'slim',
        attackEffect: 'phase_purple',
        attacks: {
            normal: { damage: 9, knockback: 0.7, range: 42, startup: 2, duration: 9 },
            special: { damage: 22, knockback: 1.7, range: 100, startup: 6, duration: 18, type: 'phase' }
        },
        description: 'Intangible ghost with possession attacks'
    },
    GLADIATOR: {
        id: 'gladiator',
        name: 'Arena King',
        color: 0xcc8800,
        accentColor: 0xffdd00,
        speed: 250,
        weight: 1.45,
        jumpPower: 0.95,
        size: { width: 50, height: 64 },
        bodyType: 'mechanical',
        attackEffect: 'trident_gold',
        attacks: {
            normal: { damage: 16, knockback: 1.3, range: 60, startup: 6, duration: 16 },
            special: { damage: 25, knockback: 2.0, range: 70, startup: 12, duration: 26, type: 'arena' }
        },
        description: 'Crowd favorite with devastating combos'
    },
    PSYCHIC: {
        id: 'psychic',
        name: 'Mind.sys',
        color: 0xff44ff,
        accentColor: 0x8888ff,
        speed: 260,
        weight: 0.85,
        jumpPower: 1.2,
        size: { width: 34, height: 56 },
        bodyType: 'slim',
        attackEffect: 'mind_pink',
        attacks: {
            normal: { damage: 7, knockback: 0.6, range: 50, startup: 5, duration: 14 },
            special: { damage: 20, knockback: 1.8, range: 200, startup: 14, duration: 30, type: 'psi' }
        },
        description: 'Telekinetic attacks from a distance'
    },
    BERSERKER: {
        id: 'berserker',
        name: 'Rampage',
        color: 0xdd0000,
        accentColor: 0xff4400,
        speed: 340,
        weight: 1.25,
        jumpPower: 1.15,
        size: { width: 48, height: 62 },
        bodyType: 'mechanical',
        attackEffect: 'rage_red',
        attacks: {
            normal: { damage: 18, knockback: 1.4, range: 50, startup: 3, duration: 10 },
            special: { damage: 30, knockback: 2.2, range: 60, startup: 6, duration: 22, type: 'rage' }
        },
        description: 'Gets stronger as damage increases'
    },
    ENGINEER: {
        id: 'engineer',
        name: 'Turret.io',
        color: 0x888800,
        accentColor: 0xffff00,
        speed: 240,
        weight: 1.1,
        jumpPower: 1.0,
        size: { width: 40, height: 58 },
        bodyType: 'mechanical',
        attackEffect: 'wrench_yellow',
        attacks: {
            normal: { damage: 10, knockback: 0.8, range: 45, startup: 4, duration: 13 },
            special: { damage: 18, knockback: 1.4, range: 250, startup: 15, duration: 35, type: 'turret' }
        },
        description: 'Deploys auto-turrets for zone control'
    },
    VAMPIRE: {
        id: 'vampire',
        name: 'Blood.dll',
        color: 0x880022,
        accentColor: 0xff0044,
        speed: 310,
        weight: 0.95,
        jumpPower: 1.3,
        size: { width: 36, height: 60 },
        bodyType: 'slim',
        attackEffect: 'drain_red',
        attacks: {
            normal: { damage: 10, knockback: 0.8, range: 44, startup: 3, duration: 11 },
            special: { damage: 18, knockback: 1.4, range: 80, startup: 8, duration: 22, type: 'drain' }
        },
        description: 'Steals health with each hit'
    },
    SCORPION: {
        id: 'scorpion',
        name: 'Stinger',
        color: 0xaaaa00,
        accentColor: 0x444400,
        speed: 290,
        weight: 1.15,
        jumpPower: 1.05,
        size: { width: 46, height: 54 },
        bodyType: 'mechanical',
        attackEffect: 'poison_yellow',
        attacks: {
            normal: { damage: 11, knockback: 0.9, range: 50, startup: 4, duration: 12 },
            special: { damage: 16, knockback: 1.3, range: 140, startup: 10, duration: 24, type: 'sting' }
        },
        description: 'Poison attacks deal damage over time'
    },
    TITAN: {
        id: 'titan',
        name: 'Colossus',
        color: 0x446688,
        accentColor: 0x88aacc,
        speed: 180,
        weight: 1.85,
        jumpPower: 0.65,
        size: { width: 58, height: 72 },
        bodyType: 'mechanical',
        attackEffect: 'stomp_blue',
        attacks: {
            normal: { damage: 19, knockback: 1.5, range: 64, startup: 10, duration: 24 },
            special: { damage: 36, knockback: 2.6, range: 95, startup: 22, duration: 48, type: 'titan' }
        },
        description: 'Ancient war machine with meteor strike'
    }
};

// Character list for menus
const CHARACTER_LIST = Object.values(CHARACTERS);
