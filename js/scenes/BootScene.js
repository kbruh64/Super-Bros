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
    }

    drawCharacterFrame(graphics, offsetX, offsetY, character, animation, bounce, frame) {
        const color = character.color;
        const mainColor = Phaser.Display.Color.IntegerToColor(color);
        const darkColor = mainColor.clone().darken(30).color;
        const lightColor = mainColor.clone().lighten(40).color;
        const skinColor = 0xffd4b3;
        const darkSkin = 0xe6b89c;
        const outlineColor = 0x222233;
        const p = this.pixelSize;

        // Center position in the frame
        const cx = offsetX + 24;
        const cy = offsetY + 36 + Math.floor(bounce);

        // Animation modifiers
        let armSwing = 0, legSwing = 0, attackPunch = 0, squash = 0, shake = 0;

        switch (animation) {
            case 'idle':
                squash = Math.sin(frame * Math.PI / 3) * 0.5;
                break;
            case 'walk':
                legSwing = Math.sin(frame * Math.PI / 3) * 2;
                armSwing = -legSwing;
                break;
            case 'jump':
                squash = frame === 0 ? 1 : -1;
                break;
            case 'attack':
                attackPunch = [0, 3, 5, 2][frame];
                break;
            case 'special':
                attackPunch = [1, 3, 4, 2][frame];
                break;
            case 'hurt':
                shake = frame === 0 ? -1 : 1;
                break;
        }

        const bx = Math.floor(cx / p) + shake;
        const by = Math.floor(cy / p);

        // === OUTLINE & BODY FILL ===
        // Draw outline first for cleaner look
        graphics.fillStyle(outlineColor, 1);

        // Head outline
        this.fillRect(graphics, bx - 3, by - 6, 6, 1);
        this.fillRect(graphics, bx - 3, by - 5, 1, 5);
        this.fillRect(graphics, bx + 2, by - 5, 1, 5);

        // Body outline
        this.fillRect(graphics, bx - 3, by, 1, 5);
        this.fillRect(graphics, bx + 2, by, 1, 5);
        this.fillRect(graphics, bx - 3, by + 5, 6, 1);

        // === HEAD ===
        graphics.fillStyle(skinColor, 1);
        this.fillRect(graphics, bx - 2, by - 5, 4, 5);

        // Face highlight
        graphics.fillStyle(0xffe4c9, 1);
        this.fillRect(graphics, bx - 1, by - 4, 2, 2);

        // Eyes
        graphics.fillStyle(0xffffff, 1);
        this.fillRect(graphics, bx - 2, by - 3, 1, 1);
        this.fillRect(graphics, bx + 1, by - 3, 1, 1);

        const blinking = frame === 3 && animation === 'idle';
        if (!blinking) {
            graphics.fillStyle(0x111122, 1);
            this.fillRect(graphics, bx - 2, by - 3, 1, 1);
            this.fillRect(graphics, bx + 1, by - 3, 1, 1);
            // Pupils/shine
            graphics.fillStyle(0xffffff, 1);
            graphics.fillRect((bx - 2) * p, (by - 3) * p, 2, 2);
            graphics.fillRect((bx + 1) * p, (by - 3) * p, 2, 2);
        }

        // Mouth
        graphics.fillStyle(darkSkin, 1);
        this.fillRect(graphics, bx - 1, by - 1, 2, 1);

        // === TORSO ===
        graphics.fillStyle(color, 1);
        this.fillRect(graphics, bx - 2, by, 4, 4);

        // Torso highlight
        graphics.fillStyle(lightColor, 1);
        this.fillRect(graphics, bx - 1, by, 2, 1);

        // Torso shading
        graphics.fillStyle(darkColor, 1);
        this.fillRect(graphics, bx - 2, by + 3, 4, 1);

        // === ARMS ===
        const leftArmX = bx - 3;
        const rightArmX = bx + 2;
        const armLen = 3;

        if (animation === 'attack' || animation === 'special') {
            // Punching arm
            graphics.fillStyle(skinColor, 1);
            for (let i = 0; i <= attackPunch; i++) {
                this.fillRect(graphics, rightArmX + i, by + 1, 1, 2);
            }
            // Fist
            graphics.fillStyle(skinColor, 1);
            this.fillRect(graphics, rightArmX + attackPunch, by, 1, 3);

            // Other arm
            graphics.fillStyle(skinColor, 1);
            this.fillRect(graphics, leftArmX, by + 1, 1, 2);
        } else {
            // Normal arms with swing
            graphics.fillStyle(skinColor, 1);
            const lArmY = by + 1 + Math.round(armSwing / 2);
            const rArmY = by + 1 - Math.round(armSwing / 2);
            this.fillRect(graphics, leftArmX, lArmY, 1, 2);
            this.fillRect(graphics, rightArmX, rArmY, 1, 2);
        }

        // === LEGS ===
        const legY = by + 4;
        graphics.fillStyle(color, 1);

        if (animation === 'walk') {
            const lLegX = bx - 1 + Math.round(legSwing / 2);
            const rLegX = bx + Math.round(-legSwing / 2);
            this.fillRect(graphics, lLegX, legY, 1, 3);
            this.fillRect(graphics, rLegX, legY, 1, 3);
            // Feet
            graphics.fillStyle(darkColor, 1);
            this.fillRect(graphics, lLegX - 1, legY + 3, 2, 1);
            this.fillRect(graphics, rLegX, legY + 3, 2, 1);
        } else if (animation === 'jump') {
            // Tucked legs
            const spread = frame === 0 ? 0 : 1;
            this.fillRect(graphics, bx - 1 - spread, legY - (frame === 0 ? 1 : 0), 1, 2);
            this.fillRect(graphics, bx + spread, legY - (frame === 0 ? 1 : 0), 1, 2);
        } else {
            // Standing legs
            this.fillRect(graphics, bx - 1, legY, 1, 3);
            this.fillRect(graphics, bx, legY, 1, 3);
            // Feet
            graphics.fillStyle(darkColor, 1);
            this.fillRect(graphics, bx - 2, legY + 3, 2, 1);
            this.fillRect(graphics, bx, legY + 3, 2, 1);
        }

        // === CHARACTER-SPECIFIC FEATURES ===
        this.drawCharacterFeatures(graphics, bx, by, character, animation, frame, attackPunch, mainColor);
    }

    fillRect(graphics, x, y, w, h) {
        const p = this.pixelSize;
        graphics.fillRect(x * p, y * p, w * p, h * p);
    }

    drawCharacterFeatures(graphics, bx, by, character, animation, frame, attackPunch, mainColor) {
        const darkColor = mainColor.clone().darken(30).color;
        const lightColor = mainColor.clone().lighten(40).color;

        switch (character.id) {
            case 'warrior':
                // Silver helmet
                graphics.fillStyle(0x8899aa, 1);
                this.fillRect(graphics, bx - 2, by - 6, 4, 2);
                graphics.fillStyle(0xaabbcc, 1);
                this.fillRect(graphics, bx - 1, by - 6, 2, 1);
                // Helmet crest
                graphics.fillStyle(0xff4444, 1);
                this.fillRect(graphics, bx, by - 7, 1, 1);
                // Sword during attack
                if (animation === 'attack' || animation === 'special') {
                    graphics.fillStyle(0xcccccc, 1);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 1, 1, 4);
                    graphics.fillStyle(0xffffff, 1);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 2, 1, 1);
                }
                break;

            case 'speedster':
                // Spiky green hair
                graphics.fillStyle(0x44ff44, 1);
                this.fillRect(graphics, bx - 2, by - 7, 1, 2);
                this.fillRect(graphics, bx, by - 8, 1, 3);
                this.fillRect(graphics, bx + 1, by - 7, 1, 2);
                // Speed goggles
                graphics.fillStyle(0xffff00, 1);
                this.fillRect(graphics, bx - 2, by - 4, 1, 1);
                this.fillRect(graphics, bx + 1, by - 4, 1, 1);
                // Speed trail
                if (animation === 'walk' || animation === 'attack') {
                    graphics.fillStyle(0x44ff44, 0.4);
                    this.fillRect(graphics, bx - 4, by, 1, 3);
                }
                break;

            case 'tank':
                // Blue flat top
                graphics.fillStyle(0x334466, 1);
                this.fillRect(graphics, bx - 2, by - 6, 4, 1);
                // Shoulder pads
                graphics.fillStyle(0x4455ff, 1);
                this.fillRect(graphics, bx - 3, by, 1, 2);
                this.fillRect(graphics, bx + 2, by, 1, 2);
                break;

            case 'ninja':
                // Black mask
                graphics.fillStyle(0x222233, 1);
                this.fillRect(graphics, bx - 2, by - 3, 4, 2);
                // Eyes through mask
                graphics.fillStyle(0xffffff, 1);
                this.fillRect(graphics, bx - 1, by - 3, 1, 1);
                this.fillRect(graphics, bx, by - 3, 1, 1);
                // Headband tails
                graphics.fillStyle(0x882222, 1);
                this.fillRect(graphics, bx + 2, by - 5, 2, 1);
                // Shuriken during special
                if (animation === 'special' && frame >= 2) {
                    graphics.fillStyle(0xcccccc, 1);
                    this.fillRect(graphics, bx + 5 + frame, by + 1, 1, 1);
                }
                break;

            case 'brawler':
                // Orange mohawk
                graphics.fillStyle(0xff6622, 1);
                this.fillRect(graphics, bx - 1, by - 7, 2, 2);
                this.fillRect(graphics, bx, by - 8, 1, 1);
                // Fire effect during special
                if (animation === 'special') {
                    graphics.fillStyle(0xff4400, 0.7);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 1, 1, 2);
                    graphics.fillStyle(0xffff00, 0.8);
                    this.fillRect(graphics, bx + 3 + attackPunch, by, 1, 1);
                }
                break;

            case 'mage':
                // Purple wizard hat
                graphics.fillStyle(0x6622aa, 1);
                this.fillRect(graphics, bx - 2, by - 7, 4, 2);
                this.fillRect(graphics, bx - 1, by - 8, 2, 1);
                this.fillRect(graphics, bx, by - 9, 1, 1);
                // Hat star
                graphics.fillStyle(0xffff00, 1);
                this.fillRect(graphics, bx, by - 7, 1, 1);
                // Staff
                graphics.fillStyle(0x664422, 1);
                this.fillRect(graphics, bx - 4, by, 1, 5);
                graphics.fillStyle(0xff44ff, 1);
                this.fillRect(graphics, bx - 4, by - 1, 1, 1);
                // Magic particles
                if (animation === 'special') {
                    graphics.fillStyle(0xff88ff, 0.8);
                    this.fillRect(graphics, bx + 3 + attackPunch, by, 1, 1);
                }
                break;

            case 'robot':
                // Metal head
                graphics.fillStyle(0x666677, 1);
                this.fillRect(graphics, bx - 2, by - 5, 4, 4);
                // Visor
                graphics.fillStyle(0x00ffff, 1);
                this.fillRect(graphics, bx - 1, by - 4, 2, 1);
                // Antenna
                graphics.fillStyle(0x888899, 1);
                this.fillRect(graphics, bx, by - 7, 1, 2);
                graphics.fillStyle(0xff0000, 1);
                this.fillRect(graphics, bx, by - 8, 1, 1);
                // Laser during special
                if (animation === 'special' && frame >= 1) {
                    graphics.fillStyle(0x00ffff, 0.8);
                    for (let i = 0; i < 3 + frame; i++) {
                        this.fillRect(graphics, bx + 3 + i, by + 1, 1, 1);
                    }
                }
                break;

            case 'pirate':
                // Red bandana
                graphics.fillStyle(0xcc2222, 1);
                this.fillRect(graphics, bx - 2, by - 6, 4, 1);
                this.fillRect(graphics, bx + 2, by - 5, 1, 1);
                // Eyepatch
                graphics.fillStyle(0x111111, 1);
                this.fillRect(graphics, bx + 1, by - 3, 1, 1);
                // Cutlass during attack
                if (animation === 'attack' || animation === 'special') {
                    graphics.fillStyle(0xccaa77, 1);
                    this.fillRect(graphics, bx + 3 + attackPunch, by + 1, 1, 1);
                    graphics.fillStyle(0xcccccc, 1);
                    this.fillRect(graphics, bx + 3 + attackPunch, by - 1, 1, 2);
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
            }

            graphics.generateTexture(`special_${char.id}`, 60, 60);
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
    }

    generateParticleTextures() {
        const starGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        starGraphics.fillStyle(0xffffff, 1);
        starGraphics.fillCircle(8, 8, 3);
        starGraphics.fillStyle(0xffffff, 0.5);
        starGraphics.fillCircle(8, 8, 6);
        starGraphics.generateTexture('particle_star', 16, 16);

        const sparkGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        sparkGraphics.fillStyle(0xffff00, 1);
        sparkGraphics.fillCircle(6, 6, 4);
        sparkGraphics.fillStyle(0xffffff, 1);
        sparkGraphics.fillCircle(6, 6, 2);
        sparkGraphics.generateTexture('particle_spark', 12, 12);

        const emberGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        emberGraphics.fillStyle(0xff4400, 0.8);
        emberGraphics.fillCircle(5, 5, 4);
        emberGraphics.fillStyle(0xff8800, 1);
        emberGraphics.fillCircle(5, 5, 2);
        emberGraphics.generateTexture('particle_ember', 10, 10);

        const snowGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        snowGraphics.fillStyle(0xffffff, 0.9);
        snowGraphics.fillCircle(4, 4, 3);
        snowGraphics.generateTexture('particle_snow', 8, 8);

        const hitGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        hitGraphics.fillStyle(0xffffff, 1);
        hitGraphics.fillCircle(16, 16, 12);
        hitGraphics.fillStyle(0xffff00, 0.8);
        hitGraphics.fillCircle(16, 16, 6);
        hitGraphics.generateTexture('particle_hit', 32, 32);

        const smokeGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        smokeGraphics.fillStyle(0x888888, 0.6);
        smokeGraphics.fillCircle(10, 10, 10);
        smokeGraphics.generateTexture('particle_smoke', 20, 20);

        const trailGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        trailGraphics.fillStyle(0xffffff, 0.8);
        trailGraphics.fillCircle(4, 4, 4);
        trailGraphics.generateTexture('particle_trail', 8, 8);
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

        const selectGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        selectGraphics.fillStyle(0x16213e, 1);
        selectGraphics.fillRoundedRect(0, 0, 120, 140, 8);
        selectGraphics.lineStyle(3, 0xe94560, 1);
        selectGraphics.strokeRoundedRect(0, 0, 120, 140, 8);
        selectGraphics.generateTexture('char_select_box', 120, 140);

        const stageGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        stageGraphics.fillStyle(0x16213e, 1);
        stageGraphics.fillRoundedRect(0, 0, 180, 120, 8);
        stageGraphics.lineStyle(3, 0xe94560, 1);
        stageGraphics.strokeRoundedRect(0, 0, 180, 120, 8);
        stageGraphics.generateTexture('stage_select_box', 180, 120);

        const hpBgGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        hpBgGraphics.fillStyle(0x1a1a2e, 1);
        hpBgGraphics.fillRoundedRect(0, 0, 200, 30, 5);
        hpBgGraphics.lineStyle(2, 0x3a3a4e, 1);
        hpBgGraphics.strokeRoundedRect(0, 0, 200, 30, 5);
        hpBgGraphics.generateTexture('hp_bg', 200, 30);

        const stockGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        stockGraphics.fillStyle(0xe94560, 1);
        stockGraphics.fillCircle(10, 10, 8);
        stockGraphics.fillStyle(0xff6680, 1);
        stockGraphics.fillCircle(8, 8, 3);
        stockGraphics.generateTexture('stock_icon', 20, 20);
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

        const impactGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        impactGraphics.fillStyle(0xffffff, 0.9);
        impactGraphics.fillCircle(30, 30, 25);
        impactGraphics.fillStyle(0xffff00, 0.8);
        impactGraphics.fillCircle(30, 30, 15);
        impactGraphics.fillStyle(0xffffff, 1);
        impactGraphics.fillCircle(30, 30, 8);
        impactGraphics.generateTexture('effect_impact', 60, 60);

        const shieldGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        shieldGraphics.lineStyle(4, 0x00aaff, 0.8);
        shieldGraphics.strokeCircle(30, 35, 28);
        shieldGraphics.lineStyle(2, 0x88ddff, 0.6);
        shieldGraphics.strokeCircle(30, 35, 24);
        shieldGraphics.fillStyle(0x00aaff, 0.2);
        shieldGraphics.fillCircle(30, 35, 28);
        shieldGraphics.generateTexture('effect_shield', 60, 70);
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
