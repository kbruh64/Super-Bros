// Boot Scene - Pixel Art Asset Generation with Animations
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
        this.pixelSize = 4; // Size of each "pixel" for retro look
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRoundedRect(width / 2 - 160, height / 2 - 25, 320, 50, 10);

        this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '24px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.generateAssets();
    }

    generateAssets() {
        CHARACTER_LIST.forEach(char => {
            this.generateCharacterSpritesheet(char);
        });
        this.generatePlatformTextures();
        this.generateParticleTextures();
        this.generateUITextures();
        this.generateAttackEffects();
        this.generateSpecialEffects();
    }

    // Draw a pixel at position with size multiplier
    drawPixel(graphics, x, y, color, alpha = 1) {
        graphics.fillStyle(color, alpha);
        graphics.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
    }

    // Generate full spritesheet with all animation frames
    generateCharacterSpritesheet(character) {
        const frameWidth = 48;
        const frameHeight = 64;
        const framesPerRow = 6;
        const totalRows = 4;
        const sheetWidth = frameWidth * framesPerRow;
        const sheetHeight = frameHeight * totalRows;

        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        const color = character.color;
        const mainColor = Phaser.Display.Color.IntegerToColor(color);
        const darkColor = mainColor.clone().darken(40).color;
        const lightColor = mainColor.clone().lighten(30).color;

        // Row 0: Idle animation (6 frames)
        for (let f = 0; f < 6; f++) {
            const offsetX = f * frameWidth;
            const bounce = Math.sin(f * Math.PI / 3) * 2;
            this.drawCharacterFrame(graphics, offsetX, 0, character, 'idle', bounce, f);
        }

        // Row 1: Walk animation (6 frames)
        for (let f = 0; f < 6; f++) {
            const offsetX = f * frameWidth;
            this.drawCharacterFrame(graphics, offsetX, frameHeight, character, 'walk', 0, f);
        }

        // Row 2: Jump (2) + Attack (4 frames)
        for (let f = 0; f < 2; f++) {
            const offsetX = f * frameWidth;
            this.drawCharacterFrame(graphics, offsetX, frameHeight * 2, character, 'jump', 0, f);
        }
        for (let f = 0; f < 4; f++) {
            const offsetX = (f + 2) * frameWidth;
            this.drawCharacterFrame(graphics, offsetX, frameHeight * 2, character, 'attack', 0, f);
        }

        // Row 3: Special (4) + Hurt (2 frames)
        for (let f = 0; f < 4; f++) {
            const offsetX = f * frameWidth;
            this.drawCharacterFrame(graphics, offsetX, frameHeight * 3, character, 'special', 0, f);
        }
        for (let f = 0; f < 2; f++) {
            const offsetX = (f + 4) * frameWidth;
            this.drawCharacterFrame(graphics, offsetX, frameHeight * 3, character, 'hurt', 0, f);
        }

        graphics.generateTexture(`char_${character.id}`, sheetWidth, sheetHeight);
        graphics.destroy();
    }

    drawCharacterFrame(graphics, offsetX, offsetY, character, animation, bounce, frame) {
        const color = character.color;
        const accentColor = character.accentColor || color;
        const mainColor = Phaser.Display.Color.IntegerToColor(color);
        const accentMain = Phaser.Display.Color.IntegerToColor(accentColor);
        const darkColor = mainColor.clone().darken(30).color;
        const lightColor = mainColor.clone().lighten(40).color;
        const outlineColor = 0x111122;
        const p = this.pixelSize;

        // Center position in the frame
        const cx = offsetX + 24;
        const cy = offsetY + 36 + Math.floor(bounce);
        const bx = Math.floor(cx / p);
        const by = Math.floor(cy / p);

        // Animation modifiers
        let armSwing = 0, legSwing = 0, attackPunch = 0, glowIntensity = 0, shake = 0;

        switch (animation) {
            case 'idle':
                glowIntensity = Math.sin(frame * Math.PI / 3) * 0.3 + 0.3;
                break;
            case 'walk':
                legSwing = Math.sin(frame * Math.PI / 3) * 2;
                armSwing = -legSwing;
                break;
            case 'jump':
                glowIntensity = 0.5;
                break;
            case 'attack':
                attackPunch = [0, 3, 5, 2][frame];
                glowIntensity = [0.2, 0.6, 1.0, 0.4][frame];
                break;
            case 'special':
                attackPunch = [1, 3, 4, 2][frame];
                glowIntensity = [0.4, 0.8, 1.0, 0.6][frame];
                break;
            case 'hurt':
                shake = frame === 0 ? -1 : 1;
                break;
        }

        const x = bx + shake;
        const y = by;

        // Draw unique character based on ID
        switch (character.id) {
            case 'warrior':
                this.drawWarrior(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'speedster':
                this.drawSpeedster(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'tank':
                this.drawTank(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'ninja':
                this.drawNinja(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'brawler':
                this.drawBrawler(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'mage':
                this.drawMage(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'robot':
                this.drawRobot(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'pirate':
                this.drawPirate(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'frostmage':
                this.drawFrostmage(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'demon':
                this.drawDemon(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'angel':
                this.drawAngel(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'shadow':
                this.drawShadow(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'beast':
                this.drawBeast(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'druid':
                this.drawDruid(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'knight':
                this.drawKnight(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'hacker':
                this.drawHacker(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'sniper':
                this.drawSniper(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'bomber':
                this.drawBomber(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'striker':
                this.drawStriker(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            case 'golem':
                this.drawGolem(graphics, x, y, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
                break;
            default:
                this.drawDefaultChar(graphics, x, y, color, accentColor, animation, frame, attackPunch, glowIntensity, legSwing, armSwing);
        }
    }

    // WARRIOR - Cyber samurai with plasma blade
    drawWarrior(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Helmet - samurai style
        g.fillStyle(0x556677, 1);
        this.fillRect(g, x - 3, y - 7, 6, 5);
        g.fillStyle(0xff00ff, 1);
        this.fillRect(g, x - 2, y - 5, 4, 2); // Visor
        g.fillStyle(0x334455, 1);
        this.fillRect(g, x - 4, y - 6, 2, 3); // Side plates
        this.fillRect(g, x + 2, y - 6, 2, 3);
        g.fillStyle(0xff00ff, 0.8);
        this.fillRect(g, x - 1, y - 8, 2, 1); // Crest

        // Armored body
        g.fillStyle(0x556677, 1);
        this.fillRect(g, x - 3, y - 2, 6, 5);
        g.fillStyle(0xff00ff, 1);
        this.fillRect(g, x - 1, y - 1, 2, 1); // Chest light
        g.fillStyle(0x00ffff, 0.5);
        this.fillRect(g, x - 2, y, 4, 2); // Core glow

        // Arms with blade
        g.fillStyle(0x445566, 1);
        this.fillRect(g, x - 4, y - 1, 1, 3);
        this.fillRect(g, x + 3, y - 1, 1, 3);

        // Plasma blade (always visible)
        if (anim === 'attack' || anim === 'special') {
            g.fillStyle(0xff00ff, 0.9);
            this.fillRect(g, x + 4 + punch, y - 3, 1, 6);
            g.fillStyle(0xffffff, 1);
            this.fillRect(g, x + 4 + punch, y - 2, 1, 4);
            g.fillStyle(0xff00ff, 0.5);
            this.fillRect(g, x + 5 + punch, y - 2, 1, 4);
        } else {
            g.fillStyle(0xff00ff, 0.6);
            this.fillRect(g, x + 3, y - 4, 1, 3);
        }

        // Legs
        g.fillStyle(0x445566, 1);
        const lx = Math.round(legSwing / 2);
        this.fillRect(g, x - 2 + lx, y + 3, 2, 4);
        this.fillRect(g, x + lx, y + 3, 2, 4);
        g.fillStyle(0xff00ff, 0.6);
        this.fillRect(g, x - 2 + lx, y + 6, 2, 1);
        this.fillRect(g, x + lx, y + 6, 2, 1);
    }

    // SPEEDSTER - Sleek runner with visor
    drawSpeedster(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Aerodynamic helmet
        g.fillStyle(0x00ff88, 1);
        this.fillRect(g, x - 2, y - 6, 4, 4);
        g.fillStyle(0x88ffff, 1);
        this.fillRect(g, x - 2, y - 5, 4, 1); // Visor
        g.fillStyle(0x00ff88, 1);
        this.fillRect(g, x + 1, y - 7, 2, 1); // Fin

        // Slim body
        g.fillStyle(0x00aa66, 1);
        this.fillRect(g, x - 1, y - 2, 3, 4);
        g.fillStyle(0x88ffff, 1);
        this.fillRect(g, x, y - 1, 1, 2); // Stripe

        // Speed lines when moving
        if (anim === 'walk' || anim === 'special') {
            g.fillStyle(0x88ffff, 0.6);
            this.fillRect(g, x - 5, y - 1, 2, 1);
            this.fillRect(g, x - 6, y, 2, 1);
            this.fillRect(g, x - 5, y + 1, 2, 1);
        }

        // Arms
        g.fillStyle(0x00aa66, 1);
        this.fillRect(g, x - 2, y - 1 + Math.round(armSwing/2), 1, 2);
        this.fillRect(g, x + 2, y - 1 - Math.round(armSwing/2), 1, 2);

        // Long legs for running
        const lx = Math.round(legSwing / 2);
        g.fillStyle(0x00aa66, 1);
        this.fillRect(g, x - 1 + lx, y + 2, 1, 5);
        this.fillRect(g, x + 1 - lx, y + 2, 1, 5);
        g.fillStyle(0x88ffff, 1);
        this.fillRect(g, x - 1 + lx, y + 6, 2, 1);
        this.fillRect(g, x + 1 - lx, y + 6, 2, 1);
    }

    // TANK - Massive mech with cannons
    drawTank(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Big square head
        g.fillStyle(0x3366aa, 1);
        this.fillRect(g, x - 3, y - 8, 7, 6);
        g.fillStyle(0x00ffff, 1);
        this.fillRect(g, x - 2, y - 6, 5, 2); // Visor
        g.fillStyle(0x224488, 1);
        this.fillRect(g, x - 4, y - 7, 2, 4); // Side armor
        this.fillRect(g, x + 3, y - 7, 2, 4);

        // Massive body
        g.fillStyle(0x4488ff, 1);
        this.fillRect(g, x - 4, y - 2, 9, 7);
        g.fillStyle(0x00ffff, 1);
        this.fillRect(g, x - 2, y - 1, 5, 1); // Chest plate
        g.fillStyle(0x224488, 1);
        this.fillRect(g, x - 3, y + 2, 7, 2); // Belt

        // Shoulder cannons
        g.fillStyle(0x224488, 1);
        this.fillRect(g, x - 6, y - 3, 3, 3);
        this.fillRect(g, x + 4, y - 3, 3, 3);
        g.fillStyle(0x00ffff, 0.8);
        this.fillRect(g, x - 5, y - 2, 1, 1);
        this.fillRect(g, x + 5, y - 2, 1, 1);

        // Thick legs
        g.fillStyle(0x3366aa, 1);
        this.fillRect(g, x - 3, y + 5, 3, 4);
        this.fillRect(g, x + 1, y + 5, 3, 4);
        g.fillStyle(0x00ffff, 0.6);
        this.fillRect(g, x - 2, y + 7, 2, 1);
        this.fillRect(g, x + 1, y + 7, 2, 1);
    }

    // NINJA - Shadowy figure with mask
    drawNinja(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Masked head
        g.fillStyle(0x331144, 1);
        this.fillRect(g, x - 2, y - 6, 4, 4);
        g.fillStyle(0xff00aa, 1);
        this.fillRect(g, x - 1, y - 5, 1, 1); // Eyes
        this.fillRect(g, x + 1, y - 5, 1, 1);
        g.fillStyle(0xaa00ff, 1);
        this.fillRect(g, x + 2, y - 5, 2, 1); // Headband tail
        this.fillRect(g, x + 3, y - 4, 1, 1);

        // Slim body
        g.fillStyle(0x220033, 1);
        this.fillRect(g, x - 2, y - 2, 4, 4);
        g.fillStyle(0xaa00ff, 0.6);
        this.fillRect(g, x - 1, y - 1, 2, 1); // Sash

        // Arms (one holds shuriken)
        g.fillStyle(0x331144, 1);
        this.fillRect(g, x - 3, y - 1, 1, 2);
        this.fillRect(g, x + 2, y - 1, 1, 2);

        // Shuriken during attack
        if (anim === 'special' && frame >= 1) {
            g.fillStyle(0xcccccc, 1);
            this.fillRect(g, x + 4 + frame * 2, y, 1, 1);
            g.fillStyle(0xff00aa, 0.7);
            this.fillRect(g, x + 3 + frame * 2, y - 1, 1, 1);
            this.fillRect(g, x + 5 + frame * 2, y + 1, 1, 1);
        }

        // Legs
        const lx = Math.round(legSwing / 2);
        g.fillStyle(0x220033, 1);
        this.fillRect(g, x - 1 + lx, y + 2, 1, 4);
        this.fillRect(g, x + 1 - lx, y + 2, 1, 4);
        g.fillStyle(0x331144, 1);
        this.fillRect(g, x - 1 + lx, y + 5, 2, 1);
        this.fillRect(g, x - lx, y + 5, 2, 1);
    }

    // BRAWLER - Muscular fighter with chrome fists
    drawBrawler(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Muscular head
        g.fillStyle(0xffaa66, 1);
        this.fillRect(g, x - 2, y - 6, 5, 4);
        g.fillStyle(0xff8800, 1);
        this.fillRect(g, x - 1, y - 8, 3, 2); // Mohawk
        g.fillStyle(0xffffff, 1);
        this.fillRect(g, x - 1, y - 5, 1, 1); // Eyes
        this.fillRect(g, x + 1, y - 5, 1, 1);
        g.fillStyle(0xcc8844, 1);
        this.fillRect(g, x - 1, y - 3, 3, 1); // Mouth

        // Muscular body
        g.fillStyle(0xff6600, 1);
        this.fillRect(g, x - 3, y - 2, 7, 5);
        g.fillStyle(0xffff00, 1);
        this.fillRect(g, x - 2, y - 1, 5, 1); // Chest stripe
        g.fillStyle(0xcc5500, 1);
        this.fillRect(g, x - 2, y + 1, 5, 1); // Belt

        // Chrome fists
        g.fillStyle(0xcccccc, 1);
        if (anim === 'attack' || anim === 'special') {
            this.fillRect(g, x + 3 + punch, y - 1, 2, 3);
            g.fillStyle(0xffff00, 0.8);
            this.fillRect(g, x + 3 + punch, y, 2, 1);
        } else {
            this.fillRect(g, x - 4, y, 2, 2);
            this.fillRect(g, x + 3, y, 2, 2);
        }

        // Legs
        g.fillStyle(0xff6600, 1);
        this.fillRect(g, x - 2, y + 3, 2, 4);
        this.fillRect(g, x + 1, y + 3, 2, 4);
        g.fillStyle(0xcccccc, 1);
        this.fillRect(g, x - 2, y + 6, 2, 1);
        this.fillRect(g, x + 1, y + 6, 2, 1);
    }

    // MAGE - Robed spellcaster with glowing orb
    drawMage(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Hooded head
        g.fillStyle(0x8800aa, 1);
        this.fillRect(g, x - 3, y - 7, 6, 5);
        g.fillStyle(0x220033, 1);
        this.fillRect(g, x - 2, y - 5, 4, 3); // Face shadow
        g.fillStyle(0xff00ff, 1);
        this.fillRect(g, x - 1, y - 4, 1, 1); // Glowing eyes
        this.fillRect(g, x + 1, y - 4, 1, 1);

        // Flowing robe
        g.fillStyle(0x8800aa, 1);
        this.fillRect(g, x - 3, y - 2, 6, 4);
        this.fillRect(g, x - 4, y + 2, 8, 5);
        g.fillStyle(0xaa22cc, 1);
        this.fillRect(g, x - 1, y - 1, 2, 5); // Robe stripe

        // Staff
        g.fillStyle(0x664422, 1);
        this.fillRect(g, x - 5, y - 3, 1, 8);

        // Magic orb
        g.fillStyle(0xff00ff, glow * 0.8 + 0.2);
        this.fillRect(g, x - 5, y - 5, 2, 2);
        g.fillStyle(0xffffff, glow * 0.5);
        this.fillRect(g, x - 5, y - 5, 1, 1);

        // Spell effect during special
        if (anim === 'special') {
            g.fillStyle(0xff00ff, 0.8);
            this.fillRect(g, x + 3 + punch, y - 1, 2, 2);
            g.fillStyle(0xffffff, 0.6);
            this.fillRect(g, x + 4 + punch, y, 1, 1);
        }
    }

    // ROBOT - Full android body
    drawRobot(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Dome head
        g.fillStyle(0x556677, 1);
        this.fillRect(g, x - 3, y - 7, 6, 5);
        g.fillStyle(0x00ffff, 1);
        this.fillRect(g, x - 2, y - 5, 4, 2); // Visor
        g.fillStyle(0x334455, 1);
        this.fillRect(g, x - 1, y - 8, 2, 1); // Top
        // Antenna
        g.fillStyle(0x00ffff, frame % 2 === 0 ? 1 : 0.5);
        this.fillRect(g, x, y - 9, 1, 1);

        // Boxy torso
        g.fillStyle(0x667788, 1);
        this.fillRect(g, x - 3, y - 2, 7, 5);
        g.fillStyle(0x00ffff, 1);
        this.fillRect(g, x - 1, y - 1, 3, 1); // Chest light
        g.fillStyle(0xff00ff, 0.6);
        this.fillRect(g, x, y + 1, 1, 1); // Core

        // Mechanical arms
        g.fillStyle(0x556677, 1);
        this.fillRect(g, x - 4, y - 1, 1, 3);
        this.fillRect(g, x + 4, y - 1, 1, 3);
        g.fillStyle(0x00ffff, 0.6);
        this.fillRect(g, x - 4, y + 1, 1, 1);
        this.fillRect(g, x + 4, y + 1, 1, 1);

        // Laser during special
        if (anim === 'special' && frame >= 1) {
            g.fillStyle(0x00ffff, 0.9);
            for (let i = 0; i < 4 + frame; i++) {
                this.fillRect(g, x + 5 + i, y, 1, 1);
            }
        }

        // Mechanical legs
        g.fillStyle(0x556677, 1);
        this.fillRect(g, x - 2, y + 3, 2, 4);
        this.fillRect(g, x + 1, y + 3, 2, 4);
        g.fillStyle(0x00ffff, 0.5);
        this.fillRect(g, x - 2, y + 5, 1, 1);
        this.fillRect(g, x + 2, y + 5, 1, 1);
    }

    // PIRATE - Net runner with visor and gun
    drawPirate(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Head with visor
        g.fillStyle(0xffcc88, 1);
        this.fillRect(g, x - 2, y - 6, 4, 4);
        g.fillStyle(0xffff00, 1);
        this.fillRect(g, x - 2, y - 5, 4, 1); // Visor
        g.fillStyle(0x00ff00, 1);
        this.fillRect(g, x - 1, y - 5, 1, 1); // Eye behind visor
        g.fillStyle(0xffff00, 0.8);
        this.fillRect(g, x - 2, y - 7, 4, 1); // Bandana

        // Jacket body
        g.fillStyle(0xcccc00, 1);
        this.fillRect(g, x - 2, y - 2, 5, 4);
        g.fillStyle(0x00ff00, 1);
        this.fillRect(g, x - 1, y - 1, 3, 1); // Stripe
        g.fillStyle(0x888800, 1);
        this.fillRect(g, x - 2, y + 1, 5, 1); // Belt

        // Gun arm
        g.fillStyle(0xffcc88, 1);
        this.fillRect(g, x - 3, y - 1, 1, 2);
        g.fillStyle(0x444444, 1);
        this.fillRect(g, x + 3, y - 1, 2, 2);
        if (anim === 'special' && frame >= 2) {
            g.fillStyle(0xffff00, 1);
            this.fillRect(g, x + 5, y - 1, 2, 1);
        }

        // Legs
        const lx = Math.round(legSwing / 2);
        g.fillStyle(0x666600, 1);
        this.fillRect(g, x - 1 + lx, y + 2, 2, 4);
        this.fillRect(g, x + lx, y + 2, 2, 4);
        g.fillStyle(0x444400, 1);
        this.fillRect(g, x - 1 + lx, y + 5, 2, 1);
        this.fillRect(g, x + lx, y + 5, 2, 1);
    }

    // FROSTMAGE - Ice queen with crystal crown
    drawFrostmage(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Ice crown head
        g.fillStyle(0xaaddff, 1);
        this.fillRect(g, x - 2, y - 6, 4, 4);
        g.fillStyle(0x00ddff, 1);
        this.fillRect(g, x - 3, y - 8, 1, 2); // Crown crystals
        this.fillRect(g, x, y - 9, 1, 3);
        this.fillRect(g, x + 2, y - 8, 1, 2);
        g.fillStyle(0xffffff, 1);
        this.fillRect(g, x - 1, y - 5, 1, 1); // Eyes
        this.fillRect(g, x + 1, y - 5, 1, 1);

        // Icy robe
        g.fillStyle(0x00aadd, 1);
        this.fillRect(g, x - 3, y - 2, 6, 4);
        this.fillRect(g, x - 4, y + 2, 8, 5);
        g.fillStyle(0xaaffff, 0.7);
        this.fillRect(g, x - 1, y - 1, 2, 5);

        // Ice staff
        g.fillStyle(0x88ccff, 1);
        this.fillRect(g, x - 5, y - 4, 1, 8);
        g.fillStyle(0xffffff, glow * 0.5 + 0.5);
        this.fillRect(g, x - 6, y - 5, 2, 2);

        // Ice blast during special
        if (anim === 'special') {
            g.fillStyle(0xaaffff, 0.9);
            this.fillRect(g, x + 3 + punch, y - 1, 2, 2);
            g.fillStyle(0xffffff, 0.7);
            this.fillRect(g, x + 4 + punch, y, 1, 1);
        }
    }

    // DEMON - Horned virus with wings
    drawDemon(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Demonic head with horns
        g.fillStyle(0xcc2222, 1);
        this.fillRect(g, x - 3, y - 6, 6, 5);
        g.fillStyle(0x660000, 1);
        this.fillRect(g, x - 4, y - 9, 1, 3); // Horns
        this.fillRect(g, x + 3, y - 9, 1, 3);
        this.fillRect(g, x - 5, y - 8, 1, 2);
        this.fillRect(g, x + 4, y - 8, 1, 2);
        g.fillStyle(0xff0000, 1);
        this.fillRect(g, x - 1, y - 4, 1, 1); // Glowing eyes
        this.fillRect(g, x + 1, y - 4, 1, 1);
        g.fillStyle(0xffffff, 1);
        this.fillRect(g, x - 1, y - 2, 1, 1); // Fangs
        this.fillRect(g, x + 1, y - 2, 1, 1);

        // Muscular demon body
        g.fillStyle(0xaa0000, 1);
        this.fillRect(g, x - 3, y - 1, 7, 5);
        g.fillStyle(0xff4400, 0.6);
        this.fillRect(g, x - 1, y, 3, 2); // Inner glow

        // Bat wings
        g.fillStyle(0x660000, 1);
        this.fillRect(g, x - 5, y - 2, 2, 4);
        this.fillRect(g, x + 4, y - 2, 2, 4);
        this.fillRect(g, x - 6, y - 1, 1, 3);
        this.fillRect(g, x + 6, y - 1, 1, 3);

        // Fire during special
        if (anim === 'special' || anim === 'attack') {
            g.fillStyle(0xff4400, 0.9);
            this.fillRect(g, x + 3 + punch, y - 1, 2, 2);
            g.fillStyle(0xffff00, 0.7);
            this.fillRect(g, x + 4 + punch, y, 1, 1);
        }

        // Legs
        g.fillStyle(0x880000, 1);
        this.fillRect(g, x - 2, y + 4, 2, 4);
        this.fillRect(g, x + 1, y + 4, 2, 4);
        g.fillStyle(0x660000, 1);
        this.fillRect(g, x - 2, y + 7, 2, 1);
        this.fillRect(g, x + 1, y + 7, 2, 1);
    }

    // ANGEL - Winged AI with halo
    drawAngel(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Glowing halo
        g.fillStyle(0xffff88, glow * 0.4 + 0.6);
        this.fillRect(g, x - 2, y - 9, 4, 1);
        this.fillRect(g, x - 3, y - 8, 1, 1);
        this.fillRect(g, x + 2, y - 8, 1, 1);

        // Serene face
        g.fillStyle(0xffeedd, 1);
        this.fillRect(g, x - 2, y - 6, 4, 4);
        g.fillStyle(0x88ccff, 1);
        this.fillRect(g, x - 1, y - 5, 1, 1); // Eyes
        this.fillRect(g, x + 1, y - 5, 1, 1);
        g.fillStyle(0xffaaaa, 1);
        this.fillRect(g, x, y - 3, 1, 1);

        // Flowing robes
        g.fillStyle(0xaaffff, 1);
        this.fillRect(g, x - 2, y - 2, 5, 4);
        this.fillRect(g, x - 3, y + 2, 7, 4);
        g.fillStyle(0xffffff, 0.8);
        this.fillRect(g, x - 1, y - 1, 3, 1);

        // Large wings
        g.fillStyle(0xffffff, 1);
        this.fillRect(g, x - 5, y - 3, 2, 5);
        this.fillRect(g, x + 4, y - 3, 2, 5);
        this.fillRect(g, x - 6, y - 2, 1, 3);
        this.fillRect(g, x + 6, y - 2, 1, 3);
        g.fillStyle(0xffffaa, glow * 0.5);
        this.fillRect(g, x - 5, y - 2, 2, 3);
        this.fillRect(g, x + 4, y - 2, 2, 3);

        // Holy light during special
        if (anim === 'special') {
            g.fillStyle(0xffff88, 0.9);
            this.fillRect(g, x + 3 + punch, y - 2, 2, 4);
        }
    }

    // SHADOW - Ghostly teleporter
    drawShadow(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Hooded ghost head
        g.fillStyle(0x440066, 0.9);
        this.fillRect(g, x - 2, y - 6, 5, 4);
        g.fillStyle(0x220033, 1);
        this.fillRect(g, x - 1, y - 5, 3, 2);
        g.fillStyle(0xff00ff, 1);
        this.fillRect(g, x - 1, y - 4, 1, 1); // Eyes
        this.fillRect(g, x + 1, y - 4, 1, 1);

        // Wispy body (fades at bottom)
        g.fillStyle(0x440066, 0.9);
        this.fillRect(g, x - 2, y - 2, 5, 3);
        g.fillStyle(0x330055, 0.7);
        this.fillRect(g, x - 2, y + 1, 5, 2);
        g.fillStyle(0x220044, 0.5);
        this.fillRect(g, x - 2, y + 3, 5, 2);
        g.fillStyle(0x110022, 0.3);
        this.fillRect(g, x - 1, y + 5, 3, 2);

        // Shadow wisps
        if (anim === 'idle' || anim === 'walk') {
            g.fillStyle(0x8800ff, glow * 0.4);
            this.fillRect(g, x - 4, y + 2 + frame % 2, 2, 2);
            this.fillRect(g, x + 3, y + 1 + frame % 2, 2, 2);
        }

        // Shadow strike during special
        if (anim === 'special') {
            g.fillStyle(0xaa00ff, 0.8);
            this.fillRect(g, x + 3 + punch, y - 1, 2, 2);
            g.fillStyle(0x220044, 0.5);
            this.fillRect(g, x + 5 + punch, y, 2, 2);
        }
    }

    // BEAST - Cyber wolf on all fours
    drawBeast(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Wolf head
        g.fillStyle(0x00cc44, 1);
        this.fillRect(g, x, y - 5, 5, 4);
        g.fillStyle(0x008833, 1);
        this.fillRect(g, x + 4, y - 4, 2, 2); // Snout
        g.fillStyle(0x88ff00, 1);
        this.fillRect(g, x + 1, y - 4, 1, 1); // Eyes
        this.fillRect(g, x + 3, y - 4, 1, 1);
        // Ears
        g.fillStyle(0x00aa33, 1);
        this.fillRect(g, x, y - 7, 2, 2);
        this.fillRect(g, x + 3, y - 7, 2, 2);

        // Long body (horizontal beast)
        g.fillStyle(0x00cc44, 1);
        this.fillRect(g, x - 4, y - 2, 8, 4);
        g.fillStyle(0x88ff00, 0.6);
        this.fillRect(g, x - 2, y - 1, 4, 2);

        // Four legs
        const lx = Math.round(legSwing / 2);
        g.fillStyle(0x008833, 1);
        this.fillRect(g, x - 4 + lx, y + 2, 2, 4); // Front legs
        this.fillRect(g, x - 1 - lx, y + 2, 2, 4);
        this.fillRect(g, x + 2 + lx, y + 2, 2, 4); // Back legs
        this.fillRect(g, x + 5 - lx, y + 2, 2, 4);

        // Tail
        g.fillStyle(0x00aa33, 1);
        this.fillRect(g, x - 6, y - 2, 2, 2);
        this.fillRect(g, x - 7, y - 3, 1, 2);

        // Roar/claw attack
        if (anim === 'special' || anim === 'attack') {
            g.fillStyle(0x88ff00, 0.8);
            this.fillRect(g, x + 6, y - 3, 2, 2);
            this.fillRect(g, x + 7, y - 2, 1, 2);
        }
    }

    // DRUID - Plant creature with vines
    drawDruid(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Leafy head
        g.fillStyle(0x00aa44, 1);
        this.fillRect(g, x - 2, y - 6, 4, 4);
        g.fillStyle(0x88ff44, 1);
        this.fillRect(g, x - 3, y - 8, 2, 2); // Leaf crown
        this.fillRect(g, x, y - 9, 1, 3);
        this.fillRect(g, x + 1, y - 8, 2, 2);
        g.fillStyle(0xffffff, 1);
        this.fillRect(g, x - 1, y - 5, 1, 1); // Eyes
        this.fillRect(g, x + 1, y - 5, 1, 1);

        // Wooden body
        g.fillStyle(0x664422, 1);
        this.fillRect(g, x - 2, y - 2, 5, 5);
        g.fillStyle(0x44ff88, 0.6);
        this.fillRect(g, x - 1, y - 1, 3, 3); // Moss

        // Vine arms
        g.fillStyle(0x00aa44, 1);
        this.fillRect(g, x - 4, y - 2, 2, 1);
        this.fillRect(g, x - 5, y - 1, 1, 2);
        this.fillRect(g, x + 3, y - 2, 2, 1);
        this.fillRect(g, x + 5, y - 1, 1, 2);

        // Vine attack during special
        if (anim === 'special') {
            g.fillStyle(0x44ff88, 0.9);
            for (let i = 0; i < 3 + frame; i++) {
                this.fillRect(g, x + 5 + i, y - 1 + (i % 2), 1, 1);
            }
        }

        // Root legs
        g.fillStyle(0x553311, 1);
        this.fillRect(g, x - 2, y + 3, 2, 4);
        this.fillRect(g, x + 1, y + 3, 2, 4);
        g.fillStyle(0x442200, 1);
        this.fillRect(g, x - 3, y + 6, 2, 1);
        this.fillRect(g, x + 2, y + 6, 2, 1);
    }

    // KNIGHT - Heavy exosuit
    drawKnight(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Full helmet
        g.fillStyle(0xbb9944, 1);
        this.fillRect(g, x - 3, y - 7, 6, 6);
        g.fillStyle(0x222233, 1);
        this.fillRect(g, x - 2, y - 5, 4, 2); // Visor slit
        g.fillStyle(0x88aaff, 1);
        this.fillRect(g, x - 1, y - 4, 1, 1); // Eyes
        this.fillRect(g, x + 1, y - 4, 1, 1);
        g.fillStyle(0xddbb66, 1);
        this.fillRect(g, x, y - 9, 1, 2); // Plume

        // Plate armor body
        g.fillStyle(0xaa8833, 1);
        this.fillRect(g, x - 4, y - 1, 8, 6);
        g.fillStyle(0x777788, 1);
        this.fillRect(g, x - 2, y, 5, 2); // Chest plate
        g.fillStyle(0x666677, 1);
        this.fillRect(g, x - 3, y + 3, 7, 1); // Belt

        // Shield
        g.fillStyle(0xddbb55, 1);
        this.fillRect(g, x - 6, y - 1, 2, 4);
        g.fillStyle(0xaa8833, 1);
        this.fillRect(g, x - 5, y, 1, 2);

        // Sword arm
        if (anim === 'attack' || anim === 'special') {
            g.fillStyle(0xeeeeff, 1);
            this.fillRect(g, x + 4 + punch, y - 2, 1, 5);
            g.fillStyle(0xffffff, 0.8);
            this.fillRect(g, x + 4 + punch, y - 3, 1, 1);
        }

        // Armored legs
        g.fillStyle(0x998844, 1);
        this.fillRect(g, x - 3, y + 5, 3, 4);
        this.fillRect(g, x + 1, y + 5, 3, 4);
        g.fillStyle(0x777788, 1);
        this.fillRect(g, x - 2, y + 7, 2, 1);
        this.fillRect(g, x + 1, y + 7, 2, 1);
    }

    // HACKER - Hoodie figure with laptop
    drawHacker(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Hooded head
        g.fillStyle(0x003300, 1);
        this.fillRect(g, x - 2, y - 6, 5, 4);
        g.fillStyle(0x001100, 1);
        this.fillRect(g, x - 1, y - 5, 3, 2);
        g.fillStyle(0x00ff00, 1);
        this.fillRect(g, x - 1, y - 4, 1, 1); // Matrix eyes
        this.fillRect(g, x + 1, y - 4, 1, 1);

        // Hoodie body
        g.fillStyle(0x004400, 1);
        this.fillRect(g, x - 3, y - 2, 6, 5);
        g.fillStyle(0x00ff00, 0.5);
        this.fillRect(g, x - 1, y - 1, 2, 1); // Chest logo

        // Laptop/device
        g.fillStyle(0x222222, 1);
        this.fillRect(g, x + 3, y, 3, 2);
        g.fillStyle(0x00ff00, frame % 2 === 0 ? 0.8 : 0.5);
        this.fillRect(g, x + 4, y, 1, 1);

        // Data stream during special
        if (anim === 'special') {
            g.fillStyle(0x00ff00, 0.8);
            for (let i = 0; i < 3 + frame; i++) {
                this.fillRect(g, x + 6 + i, y - 1 + (i % 3), 1, 1);
            }
        }

        // Legs
        const lx = Math.round(legSwing / 2);
        g.fillStyle(0x222222, 1);
        this.fillRect(g, x - 1 + lx, y + 3, 2, 4);
        this.fillRect(g, x + lx, y + 3, 2, 4);
        g.fillStyle(0x00ff00, 0.4);
        this.fillRect(g, x - 1 + lx, y + 6, 2, 1);
    }

    // SNIPER - Long coat with rifle
    drawSniper(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Helmet/goggles head
        g.fillStyle(0xffaa66, 1);
        this.fillRect(g, x - 2, y - 6, 4, 4);
        g.fillStyle(0xff4400, 1);
        this.fillRect(g, x - 2, y - 5, 4, 2); // Goggles
        g.fillStyle(0xffaa00, 1);
        this.fillRect(g, x - 1, y - 5, 1, 1); // Lens glow
        this.fillRect(g, x + 1, y - 5, 1, 1);

        // Long coat
        g.fillStyle(0xaa3300, 1);
        this.fillRect(g, x - 3, y - 2, 6, 4);
        this.fillRect(g, x - 4, y + 2, 8, 4);
        g.fillStyle(0xffaa00, 0.6);
        this.fillRect(g, x - 1, y - 1, 2, 1);

        // Long rifle
        g.fillStyle(0x444444, 1);
        this.fillRect(g, x + 3, y - 2, 5, 1);
        this.fillRect(g, x + 2, y - 1, 2, 2);
        if (anim === 'special') {
            g.fillStyle(0xff4400, 0.9);
            this.fillRect(g, x + 8, y - 2, 2, 1);
            g.fillStyle(0xffff00, 0.7);
            this.fillRect(g, x + 9, y - 2, 1, 1);
        }

        // Coat continues as legs
        g.fillStyle(0x882200, 1);
        this.fillRect(g, x - 2, y + 6, 2, 2);
        this.fillRect(g, x + 1, y + 6, 2, 2);
    }

    // BOMBER - Round body with bombs
    drawBomber(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Round head with fuse
        g.fillStyle(0xff6600, 1);
        this.fillRect(g, x - 3, y - 7, 6, 5);
        g.fillStyle(0xffff00, frame % 2 === 0 ? 1 : 0.6);
        this.fillRect(g, x, y - 9, 1, 2); // Fuse spark
        g.fillStyle(0x884400, 1);
        this.fillRect(g, x, y - 8, 1, 1); // Fuse
        g.fillStyle(0xffffff, 1);
        this.fillRect(g, x - 1, y - 5, 1, 1); // Eyes
        this.fillRect(g, x + 1, y - 5, 1, 1);
        g.fillStyle(0x222222, 1);
        this.fillRect(g, x - 1, y - 3, 3, 1); // Grin

        // Round bomb body
        g.fillStyle(0xff8800, 1);
        this.fillRect(g, x - 4, y - 2, 8, 6);
        g.fillStyle(0xffff00, 1);
        this.fillRect(g, x - 2, y - 1, 4, 1); // Warning stripe
        g.fillStyle(0x222222, 1);
        this.fillRect(g, x - 1, y + 1, 2, 2); // Skull symbol

        // Bomb in hand during special
        if (anim === 'special') {
            g.fillStyle(0x444444, 1);
            this.fillRect(g, x + 4 + punch, y - 2, 3, 3);
            g.fillStyle(0xffff00, frame % 2 === 0 ? 1 : 0.5);
            this.fillRect(g, x + 5 + punch, y - 3, 1, 1);
        }

        // Short legs
        g.fillStyle(0xcc5500, 1);
        this.fillRect(g, x - 2, y + 4, 2, 3);
        this.fillRect(g, x + 1, y + 4, 2, 3);
        g.fillStyle(0x884400, 1);
        this.fillRect(g, x - 2, y + 6, 2, 1);
        this.fillRect(g, x + 1, y + 6, 2, 1);
    }

    // STRIKER - Electric speedster
    drawStriker(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Spiky electric hair
        g.fillStyle(0xffff00, 1);
        this.fillRect(g, x - 2, y - 6, 4, 4);
        g.fillStyle(0xffff88, 1);
        this.fillRect(g, x - 2, y - 9, 1, 3);
        this.fillRect(g, x, y - 10, 1, 4);
        this.fillRect(g, x + 2, y - 9, 1, 3);
        g.fillStyle(0xffffff, 1);
        this.fillRect(g, x - 1, y - 5, 1, 1); // Eyes
        this.fillRect(g, x + 1, y - 5, 1, 1);

        // Sleek body
        g.fillStyle(0xdddd00, 1);
        this.fillRect(g, x - 2, y - 2, 5, 4);
        g.fillStyle(0xff8800, 1);
        this.fillRect(g, x - 1, y - 1, 3, 1); // Lightning bolt
        g.fillStyle(0xffffff, 0.6);
        this.fillRect(g, x, y, 1, 2);

        // Electric trail
        if (anim === 'walk' || anim === 'special') {
            g.fillStyle(0xffff00, 0.7);
            this.fillRect(g, x - 5, y - 1, 2, 1);
            this.fillRect(g, x - 4, y, 1, 1);
            this.fillRect(g, x - 6, y + 1, 2, 1);
        }

        // Lightning during special
        if (anim === 'special') {
            g.fillStyle(0xffff00, 0.9);
            this.fillRect(g, x + 3 + punch, y - 2, 1, 1);
            this.fillRect(g, x + 4 + punch, y - 1, 1, 2);
            this.fillRect(g, x + 5 + punch, y, 1, 2);
            g.fillStyle(0xffffff, 0.8);
            this.fillRect(g, x + 4 + punch, y, 1, 1);
        }

        // Fast legs
        const lx = Math.round(legSwing / 2);
        g.fillStyle(0xcccc00, 1);
        this.fillRect(g, x - 1 + lx, y + 2, 1, 5);
        this.fillRect(g, x + 1 - lx, y + 2, 1, 5);
        g.fillStyle(0xffff00, 0.7);
        this.fillRect(g, x - 1 + lx, y + 6, 2, 1);
    }

    // GOLEM - Massive stone creature
    drawGolem(g, x, y, anim, frame, punch, glow, legSwing, armSwing) {
        // Massive stone head
        g.fillStyle(0x666666, 1);
        this.fillRect(g, x - 4, y - 8, 8, 6);
        g.fillStyle(0x888888, 1);
        this.fillRect(g, x - 3, y - 7, 6, 4);
        g.fillStyle(0x00ffff, 1);
        this.fillRect(g, x - 2, y - 5, 2, 2); // Glowing eyes
        this.fillRect(g, x + 1, y - 5, 2, 2);
        g.fillStyle(0x444444, 1);
        this.fillRect(g, x - 1, y - 3, 3, 1); // Mouth crack

        // Huge rocky body
        g.fillStyle(0x555555, 1);
        this.fillRect(g, x - 5, y - 2, 10, 8);
        g.fillStyle(0x777777, 1);
        this.fillRect(g, x - 3, y - 1, 6, 4);
        g.fillStyle(0x00ffff, 0.5);
        this.fillRect(g, x - 1, y, 2, 2); // Core glow

        // Massive arms
        g.fillStyle(0x666666, 1);
        this.fillRect(g, x - 7, y - 2, 2, 6);
        this.fillRect(g, x + 5, y - 2, 2, 6);
        g.fillStyle(0x444444, 1);
        this.fillRect(g, x - 7, y + 3, 2, 2); // Fists
        this.fillRect(g, x + 5, y + 3, 2, 2);

        // Earthquake during special
        if (anim === 'special') {
            g.fillStyle(0x888888, 0.8);
            this.fillRect(g, x - 6, y + 8, 3, 2);
            this.fillRect(g, x - 2, y + 9, 2, 2);
            this.fillRect(g, x + 2, y + 8, 3, 2);
        }

        // Thick legs
        g.fillStyle(0x555555, 1);
        this.fillRect(g, x - 4, y + 6, 4, 4);
        this.fillRect(g, x + 1, y + 6, 4, 4);
        g.fillStyle(0x444444, 1);
        this.fillRect(g, x - 4, y + 9, 4, 1);
        this.fillRect(g, x + 1, y + 9, 4, 1);
    }

    // Default character drawing
    drawDefaultChar(g, x, y, color, accentColor, anim, frame, punch, glow, legSwing, armSwing) {
        // Simple head
        g.fillStyle(color, 1);
        this.fillRect(g, x - 2, y - 6, 4, 4);
        g.fillStyle(0xffffff, 1);
        this.fillRect(g, x - 1, y - 5, 1, 1);
        this.fillRect(g, x + 1, y - 5, 1, 1);

        // Body
        g.fillStyle(color, 1);
        this.fillRect(g, x - 2, y - 2, 5, 5);
        g.fillStyle(accentColor, 1);
        this.fillRect(g, x - 1, y - 1, 3, 1);

        // Arms
        g.fillStyle(color, 1);
        this.fillRect(g, x - 3, y - 1, 1, 3);
        this.fillRect(g, x + 3, y - 1, 1, 3);

        // Legs
        this.fillRect(g, x - 1, y + 3, 1, 4);
        this.fillRect(g, x + 1, y + 3, 1, 4);
    }

    fillRect(graphics, x, y, w, h) {
        const p = this.pixelSize;
        graphics.fillRect(x * p, y * p, w * p, h * p);
    }

    // Legacy function - kept for compatibility
    drawCharacterFeatures(graphics, bx, by, character, animation, frame, attackPunch, mainColor, accentMain, glowIntensity, headHeight) {
        // No longer used - each character has unique drawing function
        return;
        const darkColor = mainColor.clone().darken(25).color;
        const lightColor = mainColor.clone().lighten(50).color;
        const accentColor = accentMain ? accentMain.color : lightColor;
        const accentLight = accentMain ? accentMain.clone().lighten(40).color : lightColor;

        // Head top position (where hats/hair go)
        const headTop = by - headHeight;
        const eyeLevel = by - headHeight + 2;

        switch (character.id) {
            case 'warrior':
                // Silver helmet with red plume
                graphics.fillStyle(0x99aabb, 1);
                this.fillRect(graphics, bx - 2, headTop - 1, 4, 2);
                graphics.fillStyle(0xbbccdd, 1);
                this.fillRect(graphics, bx - 1, headTop - 1, 2, 1);
                // Helmet crest/plume
                graphics.fillStyle(0xff5555, 1);
                this.fillRect(graphics, bx, headTop - 3, 1, 2);
                this.fillRect(graphics, bx - 1, headTop - 2, 1, 1);
                // Sword during attack - brighter
                if (animation === 'attack' || animation === 'special') {
                    graphics.fillStyle(0xeeeeff, 1);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 1, 1, 4);
                    graphics.fillStyle(0xffffff, 1);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 2, 1, 1);
                    // Sword glow
                    graphics.fillStyle(0xffaa00, glowIntensity * 0.6);
                    this.fillRect(graphics, bx + 2 + attackPunch, by - 1, 1, 3);
                }
                break;

            case 'speedster':
                // Bright spiky green hair
                graphics.fillStyle(0x66ffaa, 1);
                this.fillRect(graphics, bx - 1, headTop - 2, 1, 2);
                this.fillRect(graphics, bx, headTop - 3, 1, 3);
                this.fillRect(graphics, bx + 1, headTop - 2, 1, 2);
                // Glowing speed goggles
                graphics.fillStyle(0xffff44, 1);
                this.fillRect(graphics, bx - 1, eyeLevel, 1, 1);
                this.fillRect(graphics, bx + 1, eyeLevel, 1, 1);
                // Speed trail - more visible
                if (animation === 'walk' || animation === 'attack' || animation === 'special') {
                    graphics.fillStyle(0x44ff88, 0.6);
                    this.fillRect(graphics, bx - 4, by, 1, 3);
                    graphics.fillStyle(0x44ff88, 0.4);
                    this.fillRect(graphics, bx - 5, by + 1, 1, 2);
                }
                break;

            case 'tank':
                // Blue military helmet
                graphics.fillStyle(0x4466aa, 1);
                this.fillRect(graphics, bx - 2, headTop - 2, 5, 2);
                graphics.fillStyle(0x88aadd, 1);
                this.fillRect(graphics, bx - 1, headTop - 2, 3, 1);
                // Heavy shoulder armor
                graphics.fillStyle(0x5588ff, 1);
                this.fillRect(graphics, bx - 4, by, 2, 2);
                this.fillRect(graphics, bx + 3, by, 2, 2);
                // Armor glow on attack
                if (animation === 'special') {
                    graphics.fillStyle(0x88ddff, glowIntensity * 0.5);
                    this.fillRect(graphics, bx - 3, by - 1, 6, 2);
                }
                break;

            case 'ninja':
                // Black mask with glowing eyes
                graphics.fillStyle(0x222233, 1);
                this.fillRect(graphics, bx - 1, eyeLevel - 1, 3, 2);
                graphics.fillStyle(0xff4488, 1);
                this.fillRect(graphics, bx - 1, eyeLevel, 1, 1);
                this.fillRect(graphics, bx + 1, eyeLevel, 1, 1);
                // Red headband tails
                graphics.fillStyle(0xff4444, 1);
                this.fillRect(graphics, bx + 2, headTop, 2, 1);
                this.fillRect(graphics, bx + 3, headTop + 1, 1, 1);
                // Shuriken during special - brighter
                if (animation === 'special' && frame >= 1) {
                    graphics.fillStyle(0xeeeeff, 1);
                    this.fillRect(graphics, bx + 4 + frame * 2, by + 1, 1, 1);
                    graphics.fillStyle(0xaa66ff, 0.7);
                    this.fillRect(graphics, bx + 3 + frame * 2, by, 1, 1);
                    this.fillRect(graphics, bx + 5 + frame * 2, by + 2, 1, 1);
                }
                break;

            case 'brawler':
                // Bright orange mohawk with flames
                graphics.fillStyle(0xffaa44, 1);
                this.fillRect(graphics, bx - 1, headTop - 2, 2, 2);
                graphics.fillStyle(0xff6622, 1);
                this.fillRect(graphics, bx, headTop - 3, 1, 1);
                this.fillRect(graphics, bx - 1, headTop - 3, 1, 1);
                // Flame effect during special
                if (animation === 'special' || animation === 'attack') {
                    graphics.fillStyle(0xff5500, 0.8);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 1, 1, 2);
                    graphics.fillStyle(0xffff00, 0.9);
                    this.fillRect(graphics, bx + 3 + attackPunch, by, 1, 1);
                    graphics.fillStyle(0xffaa00, 0.6);
                    this.fillRect(graphics, bx + 4 + attackPunch, by - 1, 1, 1);
                }
                break;

            case 'mage':
                // Purple wizard hat with star
                graphics.fillStyle(0x8844cc, 1);
                this.fillRect(graphics, bx - 2, headTop - 2, 4, 2);
                this.fillRect(graphics, bx - 1, headTop - 3, 2, 1);
                this.fillRect(graphics, bx, headTop - 4, 1, 1);
                graphics.fillStyle(0xffff44, 1);
                this.fillRect(graphics, bx, headTop - 2, 1, 1);
                // Glowing staff
                graphics.fillStyle(0x664422, 1);
                this.fillRect(graphics, bx - 4, by, 1, 5);
                graphics.fillStyle(0xff66ff, 1);
                this.fillRect(graphics, bx - 4, by - 1, 1, 1);
                // Magic aura
                if (animation === 'idle' || animation === 'special') {
                    graphics.fillStyle(0xff88ff, glowIntensity * 0.5);
                    this.fillRect(graphics, bx - 5, by - 2, 2, 2);
                }
                // Magic burst during special
                if (animation === 'special') {
                    graphics.fillStyle(0xff66ff, 0.9);
                    this.fillRect(graphics, bx + 3 + attackPunch, by, 1, 1);
                    graphics.fillStyle(0xaa44ff, 0.7);
                    this.fillRect(graphics, bx + 4 + attackPunch, by - 1, 1, 1);
                }
                break;

            case 'robot':
                // Antenna with blinking light
                graphics.fillStyle(0x99aabb, 1);
                this.fillRect(graphics, bx, headTop - 3, 1, 2);
                graphics.fillStyle(frame % 2 === 0 ? 0xff0000 : 0xff4444, 1);
                this.fillRect(graphics, bx, headTop - 4, 1, 1);
                // Visor glow already in body
                // Laser during special - brighter
                if (animation === 'special' && frame >= 1) {
                    graphics.fillStyle(0x00ffff, 0.9);
                    for (let i = 0; i < 4 + frame; i++) {
                        this.fillRect(graphics, bx + 3 + i, by + 1, 1, 1);
                    }
                    graphics.fillStyle(0xffffff, 0.8);
                    for (let i = 0; i < 2 + frame; i++) {
                        this.fillRect(graphics, bx + 4 + i, by + 1, 1, 1);
                    }
                }
                break;

            case 'pirate':
                // Red bandana with gold trim
                graphics.fillStyle(0xff3333, 1);
                this.fillRect(graphics, bx - 2, headTop - 1, 4, 1);
                graphics.fillStyle(0xffdd44, 1);
                this.fillRect(graphics, bx - 2, headTop - 2, 4, 1);
                this.fillRect(graphics, bx + 2, headTop, 2, 1);
                // Eyepatch
                graphics.fillStyle(0x111111, 1);
                this.fillRect(graphics, bx + 1, eyeLevel, 1, 1);
                // Cutlass with gold handle
                if (animation === 'attack' || animation === 'special') {
                    graphics.fillStyle(0xffcc44, 1);
                    this.fillRect(graphics, bx + 3 + attackPunch, by + 1, 1, 1);
                    graphics.fillStyle(0xeeeeff, 1);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 1, 1, 2);
                    // Blade glint
                    graphics.fillStyle(0xffffff, 0.8);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 2, 1, 1);
                }
                break;

            case 'frostmage':
                // Ice crown/tiara
                graphics.fillStyle(0xaaffff, 1);
                this.fillRect(graphics, bx - 2, headTop - 2, 4, 1);
                this.fillRect(graphics, bx - 1, headTop - 3, 1, 1);
                this.fillRect(graphics, bx + 1, headTop - 3, 1, 1);
                this.fillRect(graphics, bx, headTop - 4, 1, 1);
                // Ice crystal
                graphics.fillStyle(0xffffff, 1);
                this.fillRect(graphics, bx, headTop - 3, 1, 1);
                // Ice staff
                graphics.fillStyle(0x88ccff, 1);
                this.fillRect(graphics, bx - 4, by, 1, 5);
                graphics.fillStyle(0xaaffff, 1);
                this.fillRect(graphics, bx - 4, by - 1, 1, 1);
                // Frost aura
                if (animation === 'idle' || animation === 'special') {
                    graphics.fillStyle(0x88ddff, glowIntensity * 0.4);
                    this.fillRect(graphics, bx - 5, by - 1, 2, 2);
                }
                // Ice blast during special
                if (animation === 'special') {
                    graphics.fillStyle(0xaaffff, 0.9);
                    this.fillRect(graphics, bx + 3 + attackPunch, by, 1, 1);
                    graphics.fillStyle(0x66ddff, 0.7);
                    this.fillRect(graphics, bx + 4 + attackPunch, by - 1, 1, 2);
                    graphics.fillStyle(0xffffff, 0.5);
                    this.fillRect(graphics, bx + 5 + attackPunch, by, 1, 1);
                }
                break;

            case 'demon':
                // Curved horns
                graphics.fillStyle(0x442222, 1);
                this.fillRect(graphics, bx - 2, headTop - 2, 1, 2);
                this.fillRect(graphics, bx + 2, headTop - 2, 1, 2);
                this.fillRect(graphics, bx - 3, headTop - 3, 1, 1);
                this.fillRect(graphics, bx + 3, headTop - 3, 1, 1);
                // Fire aura
                if (animation === 'idle' || animation === 'special' || animation === 'attack') {
                    graphics.fillStyle(0xff4400, glowIntensity * 0.5);
                    this.fillRect(graphics, bx - 3, by - 1, 1, 2);
                    this.fillRect(graphics, bx + 3, by - 1, 1, 2);
                }
                // Hellfire during special
                if (animation === 'special') {
                    graphics.fillStyle(0xff6600, 0.9);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 1, 1, 2);
                    graphics.fillStyle(0xffaa00, 0.8);
                    this.fillRect(graphics, bx + 4 + attackPunch, by, 1, 1);
                    graphics.fillStyle(0xffff00, 0.7);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 2, 1, 1);
                }
                break;

            case 'angel':
                // Halo
                graphics.fillStyle(0xffff88, 1);
                this.fillRect(graphics, bx - 2, headTop - 3, 4, 1);
                graphics.fillStyle(0xffffaa, 0.8);
                this.fillRect(graphics, bx - 1, headTop - 4, 2, 1);
                // Wings
                graphics.fillStyle(0xffffff, 1);
                this.fillRect(graphics, bx - 4, by - 1, 1, 3);
                this.fillRect(graphics, bx - 5, by, 1, 2);
                this.fillRect(graphics, bx + 3, by - 1, 1, 3);
                this.fillRect(graphics, bx + 4, by, 1, 2);
                // Wing glow
                graphics.fillStyle(0xffffaa, glowIntensity * 0.4);
                this.fillRect(graphics, bx - 5, by - 1, 2, 3);
                this.fillRect(graphics, bx + 3, by - 1, 2, 3);
                // Holy light during special
                if (animation === 'special') {
                    graphics.fillStyle(0xffff88, 0.9);
                    this.fillRect(graphics, bx + 3 + attackPunch, by, 1, 1);
                    graphics.fillStyle(0xffffff, 0.8);
                    this.fillRect(graphics, bx + 4 + attackPunch, by - 1, 1, 2);
                }
                break;

            case 'shadow':
                // Dark hood
                graphics.fillStyle(0x331144, 1);
                this.fillRect(graphics, bx - 1, headTop - 1, 3, 2);
                this.fillRect(graphics, bx - 2, headTop, 1, 2);
                this.fillRect(graphics, bx + 2, headTop, 1, 2);
                // Shadow wisps
                if (animation === 'idle' || animation === 'walk') {
                    graphics.fillStyle(0x9944cc, glowIntensity * 0.4);
                    this.fillRect(graphics, bx - 3, by + 2, 1, 2);
                    this.fillRect(graphics, bx + 3, by + 2, 1, 2);
                }
                // Shadow attack
                if (animation === 'special') {
                    graphics.fillStyle(0xaa44ff, 0.8);
                    this.fillRect(graphics, bx + 3 + attackPunch, by, 1, 1);
                    graphics.fillStyle(0x6622aa, 0.6);
                    this.fillRect(graphics, bx + 4 + attackPunch, by - 1, 1, 2);
                    graphics.fillStyle(0x220044, 0.4);
                    this.fillRect(graphics, bx + 5 + attackPunch, by, 1, 1);
                }
                break;

            case 'beast':
                // Pointy ears
                graphics.fillStyle(0xcc8844, 1);
                this.fillRect(graphics, bx - 3, headTop, 1, 2);
                this.fillRect(graphics, bx + 3, headTop, 1, 2);
                this.fillRect(graphics, bx - 3, headTop - 1, 1, 1);
                this.fillRect(graphics, bx + 3, headTop - 1, 1, 1);
                // Fur tuft
                graphics.fillStyle(0xffcc66, 1);
                this.fillRect(graphics, bx - 1, headTop, 2, 1);
                // Muzzle/snout
                graphics.fillStyle(0xaa7744, 1);
                this.fillRect(graphics, bx - 1, by - 2, 2, 1);
                // Claw swipe during attack
                if (animation === 'attack' || animation === 'special') {
                    graphics.fillStyle(0xffffcc, 0.9);
                    this.fillRect(graphics, bx + 3 + attackPunch, by, 1, 1);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 1, 1, 1);
                    this.fillRect(graphics, bx + 3 + attackPunch, by + 1, 1, 1);
                }
                // Roar effect during special
                if (animation === 'special' && frame >= 2) {
                    graphics.fillStyle(0xffaa44, 0.6);
                    this.fillRect(graphics, bx + 4, by - 1, 2, 3);
                    graphics.fillStyle(0xffcc66, 0.4);
                    this.fillRect(graphics, bx + 5, by, 2, 2);
                }
                break;

            case 'druid':
                // Leafy crown
                graphics.fillStyle(0x44aa44, 1);
                this.fillRect(graphics, bx - 2, headTop - 2, 4, 1);
                graphics.fillStyle(0x88ff44, 1);
                this.fillRect(graphics, bx - 1, headTop - 3, 1, 1);
                this.fillRect(graphics, bx + 1, headTop - 3, 1, 1);
                graphics.fillStyle(0x66dd44, 1);
                this.fillRect(graphics, bx, headTop - 2, 1, 1);
                // Nature staff
                graphics.fillStyle(0x665533, 1);
                this.fillRect(graphics, bx - 4, by, 1, 5);
                graphics.fillStyle(0x88ff44, 1);
                this.fillRect(graphics, bx - 4, by - 1, 1, 1);
                this.fillRect(graphics, bx - 5, by - 1, 1, 1);
                // Nature aura
                if (animation === 'idle') {
                    graphics.fillStyle(0x88ff44, glowIntensity * 0.3);
                    this.fillRect(graphics, bx - 5, by - 2, 2, 2);
                }
                // Vine attack during special
                if (animation === 'special') {
                    graphics.fillStyle(0x44dd66, 0.9);
                    for (let i = 0; i < 2 + frame; i++) {
                        this.fillRect(graphics, bx + 3 + i, by + (i % 2), 1, 1);
                    }
                    graphics.fillStyle(0x88ff44, 0.7);
                    this.fillRect(graphics, bx + 3 + frame, by - 1, 1, 1);
                }
                break;

            case 'knight':
                // Full helmet with visor
                graphics.fillStyle(0xbbaa77, 1);
                this.fillRect(graphics, bx - 2, headTop - 2, 4, 3);
                graphics.fillStyle(0xddcc88, 1);
                this.fillRect(graphics, bx - 1, headTop - 2, 2, 1);
                // Visor slit
                graphics.fillStyle(0x222222, 1);
                this.fillRect(graphics, bx - 1, headTop, 2, 1);
                // Plume
                graphics.fillStyle(0xcccccc, 1);
                this.fillRect(graphics, bx, headTop - 3, 1, 1);
                this.fillRect(graphics, bx + 1, headTop - 3, 1, 1);
                // Shield
                graphics.fillStyle(0xccaa44, 1);
                this.fillRect(graphics, bx - 4, by, 1, 3);
                this.fillRect(graphics, bx - 5, by + 1, 1, 2);
                graphics.fillStyle(0xddbb55, 1);
                this.fillRect(graphics, bx - 4, by + 1, 1, 1);
                // Shield bash during special
                if (animation === 'special') {
                    graphics.fillStyle(0xffdd44, glowIntensity * 0.7);
                    this.fillRect(graphics, bx + 2 + attackPunch, by, 2, 3);
                    graphics.fillStyle(0xffffff, 0.5);
                    this.fillRect(graphics, bx + 3 + attackPunch, by + 1, 1, 1);
                }
                // Sword during attack
                if (animation === 'attack') {
                    graphics.fillStyle(0xeeeeff, 1);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 1, 1, 3);
                    graphics.fillStyle(0xffffff, 0.8);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 2, 1, 1);
                }
                break;
        }
    }

    drawCharacterHair(graphics, x, y, character, darkColor, lightColor) {
        switch (character.id) {
            case 'warrior':
                // Helmet
                for (let i = -2; i <= 2; i++) {
                    this.drawPixel(graphics, x + i, y - 1, 0x888888);
                }
                this.drawPixel(graphics, x, y - 2, 0xaaaaaa);
                break;
            case 'speedster':
                // Spiky hair
                this.drawPixel(graphics, x - 1, y - 1, 0x44ff44);
                this.drawPixel(graphics, x, y - 2, 0x44ff44);
                this.drawPixel(graphics, x + 1, y - 1, 0x44ff44);
                break;
            case 'tank':
                // Flat top
                for (let i = -2; i <= 2; i++) {
                    this.drawPixel(graphics, x + i, y - 1, 0x4444ff);
                }
                break;
            case 'ninja':
                // Mask/bandana
                this.drawPixel(graphics, x - 2, y, 0x222222);
                this.drawPixel(graphics, x + 2, y, 0x222222);
                this.drawPixel(graphics, x + 3, y + 1, 0x222222);
                break;
            case 'brawler':
                // Mohawk
                this.drawPixel(graphics, x, y - 1, 0xff8844);
                this.drawPixel(graphics, x, y - 2, 0xff8844);
                break;
            case 'mage':
                // Wizard hat
                this.drawPixel(graphics, x, y - 1, 0x8844ff);
                this.drawPixel(graphics, x - 1, y - 1, 0x8844ff);
                this.drawPixel(graphics, x + 1, y - 1, 0x8844ff);
                this.drawPixel(graphics, x, y - 2, 0xaa66ff);
                this.drawPixel(graphics, x, y - 3, 0xaa66ff);
                break;
            case 'robot':
                // Antenna
                this.drawPixel(graphics, x, y - 1, 0x666666);
                this.drawPixel(graphics, x, y - 2, 0x00ffff);
                break;
            case 'pirate':
                // Bandana + eyepatch hint
                for (let i = -2; i <= 2; i++) {
                    this.drawPixel(graphics, x + i, y - 1, 0xff0000);
                }
                break;
        }
    }

    drawCharacterDetails(graphics, x, y, character, animation, frame, attackExtend) {
        switch (character.id) {
            case 'warrior':
                // Sword on back or in hand during attack
                if (animation === 'attack' || animation === 'special') {
                    const swordX = x + 5 + Math.floor(attackExtend / 4);
                    this.drawPixel(graphics, swordX, y, 0xcccccc);
                    this.drawPixel(graphics, swordX + 1, y - 1, 0xffffff);
                    this.drawPixel(graphics, swordX + 2, y - 2, 0xffffff);
                }
                // Shield
                this.drawPixel(graphics, x - 4, y + 2, 0x8888ff);
                this.drawPixel(graphics, x - 4, y + 3, 0x8888ff);
                break;
            case 'ninja':
                // Throwing stars during special
                if (animation === 'special' && frame >= 2) {
                    this.drawPixel(graphics, x + 6 + frame * 2, y + 1, 0xcccccc);
                }
                break;
            case 'mage':
                // Magic particles during special
                if (animation === 'special') {
                    const sparkle = (frame % 2 === 0);
                    this.drawPixel(graphics, x + 5 + frame, y + sparkle, 0xff88ff);
                    this.drawPixel(graphics, x + 4 + frame, y + 2 - sparkle, 0xffaaff);
                }
                // Staff
                this.drawPixel(graphics, x + 4, y + 1, 0x884400);
                this.drawPixel(graphics, x + 4, y + 2, 0x884400);
                this.drawPixel(graphics, x + 4, y - 1, 0xff00ff);
                break;
            case 'robot':
                // Laser during special
                if (animation === 'special' && frame >= 1) {
                    for (let i = 0; i < 4 + frame * 2; i++) {
                        graphics.fillStyle(0x00ffff, 0.8 - i * 0.1);
                        graphics.fillRect((x + 4 + i) * this.pixelSize, (y + 1) * this.pixelSize, this.pixelSize, this.pixelSize);
                    }
                }
                break;
            case 'pirate':
                // Pistol
                this.drawPixel(graphics, x + 4, y + 2, 0x444444);
                if (animation === 'special' && frame >= 2) {
                    // Muzzle flash
                    this.drawPixel(graphics, x + 6, y + 2, 0xffff00);
                    this.drawPixel(graphics, x + 7, y + 2, 0xff8800);
                }
                break;
        }
    }

    generateSpecialEffects() {
        // Generate unique special attack effects for each character
        CHARACTER_LIST.forEach(char => {
            try {
                const graphics = this.make.graphics({ x: 0, y: 0, add: false });

                switch (char.id) {
                    case 'warrior':
                    // Sword slash arc
                    graphics.lineStyle(6, 0xffffff, 0.9);
                    graphics.beginPath();
                    graphics.arc(30, 40, 25, -Math.PI * 0.7, Math.PI * 0.2);
                    graphics.stroke();
                    graphics.lineStyle(3, 0xaaaaff, 0.7);
                    graphics.beginPath();
                    graphics.arc(30, 40, 30, -Math.PI * 0.7, Math.PI * 0.2);
                    graphics.stroke();
                    break;
                case 'speedster':
                    // Speed lines
                    for (let i = 0; i < 5; i++) {
                        graphics.fillStyle(0x44ff44, 0.8 - i * 0.15);
                        graphics.fillRect(5 + i * 10, 25 + i * 3, 15, 3);
                        graphics.fillRect(5 + i * 10, 35 - i * 3, 15, 3);
                    }
                    break;
                case 'tank':
                    // Ground pound shockwave
                    graphics.lineStyle(4, 0x4444ff, 0.8);
                    graphics.strokeCircle(30, 50, 20);
                    graphics.lineStyle(3, 0x8888ff, 0.5);
                    graphics.strokeCircle(30, 50, 30);
                    graphics.fillStyle(0xffff00, 0.6);
                    graphics.fillCircle(30, 50, 8);
                    break;
                case 'ninja':
                    // Shuriken
                    graphics.fillStyle(0xcccccc, 1);
                    graphics.beginPath();
                    graphics.moveTo(30, 15);
                    graphics.lineTo(35, 28);
                    graphics.lineTo(45, 30);
                    graphics.lineTo(35, 32);
                    graphics.lineTo(30, 45);
                    graphics.lineTo(25, 32);
                    graphics.lineTo(15, 30);
                    graphics.lineTo(25, 28);
                    graphics.closePath();
                    graphics.fill();
                    graphics.fillStyle(0x666666, 1);
                    graphics.fillCircle(30, 30, 5);
                    break;
                case 'brawler':
                    // Flame uppercut
                    graphics.fillStyle(0xff4400, 0.7);
                    graphics.fillCircle(30, 40, 18);
                    graphics.fillStyle(0xff8800, 0.8);
                    graphics.fillCircle(30, 35, 14);
                    graphics.fillStyle(0xffcc00, 0.9);
                    graphics.fillCircle(30, 30, 10);
                    graphics.fillStyle(0xffffff, 1);
                    graphics.fillCircle(30, 28, 5);
                    break;
                case 'mage':
                    // Fireball
                    graphics.fillStyle(0xff00ff, 0.4);
                    graphics.fillCircle(30, 30, 25);
                    graphics.fillStyle(0xff44ff, 0.6);
                    graphics.fillCircle(30, 30, 18);
                    graphics.fillStyle(0xff88ff, 0.8);
                    graphics.fillCircle(30, 30, 12);
                    graphics.fillStyle(0xffffff, 1);
                    graphics.fillCircle(30, 30, 6);
                    break;
                case 'robot':
                    // Laser beam
                    graphics.fillStyle(0x00ffff, 0.3);
                    graphics.fillRect(0, 22, 60, 16);
                    graphics.fillStyle(0x00ffff, 0.6);
                    graphics.fillRect(0, 25, 60, 10);
                    graphics.fillStyle(0xffffff, 0.9);
                    graphics.fillRect(0, 28, 60, 4);
                    break;
                case 'pirate':
                    // Cannonball
                    graphics.fillStyle(0x333333, 1);
                    graphics.fillCircle(30, 30, 12);
                    graphics.fillStyle(0x666666, 1);
                    graphics.fillCircle(26, 26, 4);
                    // Smoke trail
                    graphics.fillStyle(0x888888, 0.5);
                    graphics.fillCircle(15, 35, 8);
                    graphics.fillCircle(8, 38, 6);
                    break;
                case 'frostmage':
                    // Ice shard burst
                    graphics.fillStyle(0x88ddff, 1);
                    graphics.fillCircle(30, 30, 16);
                    graphics.fillStyle(0x44aaff, 0.9);
                    graphics.fillCircle(30, 30, 12);
                    graphics.fillStyle(0xccffff, 1);
                    graphics.fillCircle(30, 30, 8);
                    // Ice spikes
                    graphics.lineStyle(3, 0x88ddff, 0.8);
                    graphics.beginPath();
                    graphics.moveTo(30, 8);
                    graphics.lineTo(35, 20);
                    graphics.lineTo(30, 25);
                    graphics.lineTo(25, 20);
                    graphics.closePath();
                    graphics.stroke();
                    break;
                case 'demon':
                    // Infernal flame burst
                    graphics.fillStyle(0xff2200, 0.6);
                    graphics.fillCircle(30, 30, 22);
                    graphics.fillStyle(0xff6600, 0.7);
                    graphics.fillCircle(30, 30, 16);
                    graphics.fillStyle(0xff9900, 0.8);
                    graphics.fillCircle(30, 30, 10);
                    graphics.fillStyle(0xffcc00, 0.9);
                    graphics.fillCircle(30, 30, 5);
                    break;
                case 'angel':
                    // Holy light beam
                    graphics.fillStyle(0xffff44, 0.3);
                    graphics.fillCircle(30, 30, 24);
                    graphics.fillStyle(0xffff88, 0.5);
                    graphics.fillCircle(30, 30, 18);
                    graphics.fillStyle(0xffffff, 0.7);
                    graphics.fillCircle(30, 30, 12);
                    graphics.fillStyle(0xffff00, 1);
                    graphics.fillCircle(30, 30, 6);
                    break;
                case 'shadow':
                    // Dark void
                    graphics.fillStyle(0x330033, 0.4);
                    graphics.fillCircle(30, 30, 20);
                    graphics.fillStyle(0x660066, 0.6);
                    graphics.fillCircle(30, 30, 15);
                    graphics.fillStyle(0x990099, 0.8);
                    graphics.fillCircle(30, 30, 10);
                    graphics.lineStyle(2, 0xcc00cc, 0.9);
                    graphics.strokeCircle(30, 30, 16);
                    break;
                case 'beast':
                    // Roaring aura
                    graphics.fillStyle(0xaa6633, 0.5);
                    graphics.fillCircle(30, 30, 20);
                    graphics.lineStyle(4, 0xdd8844, 0.8);
                    graphics.strokeCircle(30, 30, 18);
                    graphics.lineStyle(3, 0xffaa55, 0.6);
                    graphics.strokeCircle(30, 30, 23);
                    graphics.fillStyle(0xff9933, 0.7);
                    graphics.fillRect(20, 25, 20, 10);
                    break;
                case 'druid':
                    // Vine growth
                    graphics.lineStyle(4, 0x00aa44, 0.8);
                    graphics.beginPath();
                    graphics.moveTo(30, 10);
                    graphics.quadraticCurveTo(25, 20, 30, 30);
                    graphics.quadraticCurveTo(35, 40, 30, 50);
                    graphics.stroke();
                    graphics.fillStyle(0x22dd66, 0.7);
                    graphics.fillCircle(30, 20, 6);
                    graphics.fillCircle(20, 30, 6);
                    graphics.fillCircle(40, 35, 6);
                    break;
                case 'knight':
                    // Shield bash glow
                    graphics.lineStyle(5, 0xccaa00, 0.9);
                    graphics.strokeCircle(30, 30, 22);
                    graphics.fillStyle(0xffcc00, 0.4);
                    graphics.fillCircle(30, 30, 18);
                    graphics.lineStyle(3, 0xddbb00, 0.7);
                    graphics.strokeCircle(30, 30, 15);
                    break;
                default:
                    // Generic energy ball fallback
                    graphics.fillStyle(0xffffff, 0.5);
                    graphics.fillCircle(30, 30, 20);
                    graphics.fillStyle(0xffff00, 0.7);
                    graphics.fillCircle(30, 30, 12);
                    graphics.fillStyle(0xff00ff, 0.8);
                    graphics.fillCircle(30, 30, 6);
                    break;
                }

                graphics.generateTexture(`special_${char.id}`, 60, 60);
                graphics.destroy();
            } catch (e) {
                console.warn(`Failed to generate special effect for ${char.id}:`, e);
            }
        });
    }

    generatePlatformTextures() {
        const mainGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        mainGraphics.fillStyle(0x3a3a5a, 1);
        mainGraphics.fillRoundedRect(0, 0, 100, 40, 5);
        mainGraphics.fillStyle(0x4a4a6a, 1);
        mainGraphics.fillRoundedRect(2, 2, 96, 20, 4);
        mainGraphics.fillStyle(0x5a5a7a, 0.7);
        mainGraphics.fillRoundedRect(4, 4, 92, 10, 3);
        mainGraphics.lineStyle(2, 0x8888aa, 0.8);
        mainGraphics.beginPath();
        mainGraphics.moveTo(5, 3);
        mainGraphics.lineTo(95, 3);
        mainGraphics.stroke();
        mainGraphics.generateTexture('platform_main', 100, 40);
        mainGraphics.destroy();

        const floatGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        floatGraphics.fillStyle(0x2a4a6a, 1);
        floatGraphics.fillRoundedRect(0, 0, 100, 25, 8);
        floatGraphics.fillStyle(0x3a5a7a, 1);
        floatGraphics.fillRoundedRect(2, 2, 96, 12, 6);
        floatGraphics.fillStyle(0x4a6a8a, 0.6);
        floatGraphics.fillRoundedRect(4, 3, 92, 6, 4);
        floatGraphics.lineStyle(2, 0x6a9aba, 0.6);
        floatGraphics.strokeRoundedRect(0, 0, 100, 25, 8);
        floatGraphics.generateTexture('platform_floating', 100, 25);
        floatGraphics.destroy();
    }

    generateParticleTextures() {
        const starGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        starGraphics.fillStyle(0xffffff, 1);
        starGraphics.fillCircle(8, 8, 3);
        starGraphics.fillStyle(0xffffff, 0.5);
        starGraphics.fillCircle(8, 8, 6);
        starGraphics.generateTexture('particle_star', 16, 16);
        starGraphics.destroy();

        const sparkGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        sparkGraphics.fillStyle(0xffff00, 1);
        sparkGraphics.fillCircle(6, 6, 4);
        sparkGraphics.fillStyle(0xffffff, 1);
        sparkGraphics.fillCircle(6, 6, 2);
        sparkGraphics.generateTexture('particle_spark', 12, 12);
        sparkGraphics.destroy();

        const emberGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        emberGraphics.fillStyle(0xff4400, 0.8);
        emberGraphics.fillCircle(5, 5, 4);
        emberGraphics.fillStyle(0xff8800, 1);
        emberGraphics.fillCircle(5, 5, 2);
        emberGraphics.generateTexture('particle_ember', 10, 10);
        emberGraphics.destroy();

        const snowGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        snowGraphics.fillStyle(0xffffff, 0.9);
        snowGraphics.fillCircle(4, 4, 3);
        snowGraphics.generateTexture('particle_snow', 8, 8);
        snowGraphics.destroy();

        const hitGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        hitGraphics.fillStyle(0xffffff, 1);
        hitGraphics.fillCircle(16, 16, 12);
        hitGraphics.fillStyle(0xffff00, 0.8);
        hitGraphics.fillCircle(16, 16, 6);
        hitGraphics.generateTexture('particle_hit', 32, 32);
        hitGraphics.destroy();

        const smokeGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        smokeGraphics.fillStyle(0x888888, 0.6);
        smokeGraphics.fillCircle(10, 10, 10);
        smokeGraphics.generateTexture('particle_smoke', 20, 20);
        smokeGraphics.destroy();

        const trailGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        trailGraphics.fillStyle(0xffffff, 0.8);
        trailGraphics.fillCircle(4, 4, 4);
        trailGraphics.generateTexture('particle_trail', 8, 8);
        trailGraphics.destroy();
    }

    generateUITextures() {
        const btnGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        btnGraphics.fillStyle(0xe94560, 1);
        btnGraphics.fillRoundedRect(0, 0, 200, 50, 10);
        btnGraphics.fillStyle(0xff6680, 0.5);
        btnGraphics.fillRoundedRect(3, 3, 194, 22, 8);
        btnGraphics.lineStyle(2, 0xff8899, 0.8);
        btnGraphics.strokeRoundedRect(0, 0, 200, 50, 10);
        btnGraphics.generateTexture('button', 200, 50);
        btnGraphics.destroy();

        const selectGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        selectGraphics.fillStyle(0x16213e, 1);
        selectGraphics.fillRoundedRect(0, 0, 120, 140, 8);
        selectGraphics.lineStyle(3, 0xe94560, 1);
        selectGraphics.strokeRoundedRect(0, 0, 120, 140, 8);
        selectGraphics.generateTexture('char_select_box', 120, 140);
        selectGraphics.destroy();

        const stageGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        stageGraphics.fillStyle(0x16213e, 1);
        stageGraphics.fillRoundedRect(0, 0, 180, 120, 8);
        stageGraphics.lineStyle(3, 0xe94560, 1);
        stageGraphics.strokeRoundedRect(0, 0, 180, 120, 8);
        stageGraphics.generateTexture('stage_select_box', 180, 120);
        stageGraphics.destroy();

        const hpBgGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        hpBgGraphics.fillStyle(0x1a1a2e, 1);
        hpBgGraphics.fillRoundedRect(0, 0, 200, 30, 5);
        hpBgGraphics.lineStyle(2, 0x3a3a4e, 1);
        hpBgGraphics.strokeRoundedRect(0, 0, 200, 30, 5);
        hpBgGraphics.generateTexture('hp_bg', 200, 30);
        hpBgGraphics.destroy();

        const stockGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        stockGraphics.fillStyle(0xe94560, 1);
        stockGraphics.fillCircle(10, 10, 8);
        stockGraphics.fillStyle(0xff6680, 1);
        stockGraphics.fillCircle(8, 8, 3);
        stockGraphics.generateTexture('stock_icon', 20, 20);
        stockGraphics.destroy();
    }

    generateAttackEffects() {
        const slashGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        for (let i = 0; i < 5; i++) {
            slashGraphics.lineStyle(3 - i * 0.5, 0xffffff, 1 - i * 0.15);
            slashGraphics.beginPath();
            slashGraphics.arc(40, 40, 30 + i * 5, -Math.PI * 0.3, Math.PI * 0.3);
            slashGraphics.stroke();
        }
        slashGraphics.generateTexture('effect_slash', 80, 80);
        slashGraphics.destroy();

        const impactGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        impactGraphics.fillStyle(0xffffff, 0.9);
        impactGraphics.fillCircle(30, 30, 25);
        impactGraphics.fillStyle(0xffff00, 0.8);
        impactGraphics.fillCircle(30, 30, 15);
        impactGraphics.fillStyle(0xffffff, 1);
        impactGraphics.fillCircle(30, 30, 8);
        impactGraphics.generateTexture('effect_impact', 60, 60);
        impactGraphics.destroy();

        const shieldGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        shieldGraphics.lineStyle(4, 0x00aaff, 0.8);
        shieldGraphics.strokeCircle(30, 35, 28);
        shieldGraphics.lineStyle(2, 0x88ddff, 0.6);
        shieldGraphics.strokeCircle(30, 35, 24);
        shieldGraphics.fillStyle(0x00aaff, 0.2);
        shieldGraphics.fillCircle(30, 35, 28);
        shieldGraphics.generateTexture('effect_shield', 60, 70);
        shieldGraphics.destroy();
    }

    create() {
        // IMPORTANT: Add frame data BEFORE creating animations
        this.addFrameData();

        // Create animations for all characters
        this.createAnimations();

        document.getElementById('loading').style.display = 'none';
        this.scene.start('MenuScene');
    }

    addFrameData() {
        const frameWidth = 48;
        const frameHeight = 64;

        // Add spritesheet frame data to texture manager FIRST
        CHARACTER_LIST.forEach(char => {
            const texture = this.textures.get(`char_${char.id}`);

            // Add individual frames
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 6; col++) {
                    const frameIndex = row * 6 + col;
                    texture.add(frameIndex, 0, col * frameWidth, row * frameHeight, frameWidth, frameHeight);
                }
            }
        });
    }

    createAnimations() {
        CHARACTER_LIST.forEach(char => {
            // Idle animation (row 0, frames 0-5)
            this.anims.create({
                key: `${char.id}_idle`,
                frames: this.anims.generateFrameNumbers(`char_${char.id}`, {
                    start: 0, end: 5
                }),
                frameRate: 8,
                repeat: -1
            });

            // Walk animation (row 1, frames 6-11)
            this.anims.create({
                key: `${char.id}_walk`,
                frames: this.anims.generateFrameNumbers(`char_${char.id}`, {
                    start: 6, end: 11
                }),
                frameRate: 12,
                repeat: -1
            });

            // Jump animation (row 2, frames 12-13)
            this.anims.create({
                key: `${char.id}_jump`,
                frames: this.anims.generateFrameNumbers(`char_${char.id}`, {
                    start: 12, end: 13
                }),
                frameRate: 8,
                repeat: 0
            });

            // Attack animation (row 2, frames 14-17)
            this.anims.create({
                key: `${char.id}_attack`,
                frames: this.anims.generateFrameNumbers(`char_${char.id}`, {
                    start: 14, end: 17
                }),
                frameRate: 16,
                repeat: 0
            });

            // Special animation (row 3, frames 18-21)
            this.anims.create({
                key: `${char.id}_special`,
                frames: this.anims.generateFrameNumbers(`char_${char.id}`, {
                    start: 18, end: 21
                }),
                frameRate: 12,
                repeat: 0
            });

            // Hurt animation (row 3, frames 22-23)
            this.anims.create({
                key: `${char.id}_hurt`,
                frames: this.anims.generateFrameNumbers(`char_${char.id}`, {
                    start: 22, end: 23
                }),
                frameRate: 10,
                repeat: 0
            });
        });
    }
}
