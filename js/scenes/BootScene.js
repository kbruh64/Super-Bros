// Boot Scene - Asset Generation and Loading
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRoundedRect(width / 2 - 160, height / 2 - 25, 320, 50, 10);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '24px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Generate all game assets programmatically for AMAZING graphics
        this.generateAssets();
    }

    generateAssets() {
        // Generate character sprites with glow effects
        CHARACTER_LIST.forEach(char => {
            this.generateCharacterSprite(char);
        });

        // Generate platform textures
        this.generatePlatformTextures();

        // Generate particle textures
        this.generateParticleTextures();

        // Generate UI elements
        this.generateUITextures();

        // Generate attack effects
        this.generateAttackEffects();
    }

    generateCharacterSprite(character) {
        const { width, height } = character.size;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Create character body with gradient effect
        const color = Phaser.Display.Color.IntegerToColor(character.color);
        const darkerColor = color.clone().darken(30);
        const lighterColor = color.clone().lighten(30);

        // Main body with rounded rectangle
        graphics.fillStyle(character.color, 1);
        graphics.fillRoundedRect(2, 2, width - 4, height - 4, 8);

        // Inner glow effect
        graphics.fillStyle(lighterColor.color, 0.6);
        graphics.fillRoundedRect(6, 6, width - 16, height * 0.4, 6);

        // Face area
        graphics.fillStyle(0xffeedd, 1);
        graphics.fillCircle(width / 2, height * 0.25, 12);

        // Eyes
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(width / 2 - 5, height * 0.23, 3);
        graphics.fillCircle(width / 2 + 5, height * 0.23, 3);

        // Eye shine
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(width / 2 - 4, height * 0.22, 1);
        graphics.fillCircle(width / 2 + 6, height * 0.22, 1);

        // Border glow
        graphics.lineStyle(3, lighterColor.color, 0.8);
        graphics.strokeRoundedRect(2, 2, width - 4, height - 4, 8);

        graphics.generateTexture(`char_${character.id}`, width, height);

        // Generate attack sprite
        this.generateAttackSprite(character);
    }

    generateAttackSprite(character) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        const color = character.color;
        const attack = character.attacks.special;

        // Different attack visuals based on type
        switch (attack.type) {
            case 'fireball':
                this.generateFireball(graphics, color);
                break;
            case 'shuriken':
                this.generateShuriken(graphics, color);
                break;
            case 'laser':
                this.generateLaser(graphics, color);
                break;
            case 'pistol':
                this.generateBullet(graphics, color);
                break;
            default:
                this.generateSlash(graphics, color);
        }

        graphics.generateTexture(`attack_${character.id}`, 60, 60);
    }

    generateFireball(graphics, color) {
        // Outer glow
        graphics.fillStyle(0xff6600, 0.3);
        graphics.fillCircle(30, 30, 28);
        graphics.fillStyle(0xff8800, 0.5);
        graphics.fillCircle(30, 30, 22);
        graphics.fillStyle(0xffaa00, 0.7);
        graphics.fillCircle(30, 30, 16);
        graphics.fillStyle(0xffcc00, 1);
        graphics.fillCircle(30, 30, 10);
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(30, 30, 4);
    }

    generateShuriken(graphics, color) {
        graphics.fillStyle(color, 1);
        // 4-pointed star
        graphics.beginPath();
        graphics.moveTo(30, 5);
        graphics.lineTo(35, 25);
        graphics.lineTo(55, 30);
        graphics.lineTo(35, 35);
        graphics.lineTo(30, 55);
        graphics.lineTo(25, 35);
        graphics.lineTo(5, 30);
        graphics.lineTo(25, 25);
        graphics.closePath();
        graphics.fill();
        // Inner circle
        graphics.fillStyle(0xffffff, 0.5);
        graphics.fillCircle(30, 30, 6);
    }

    generateLaser(graphics, color) {
        graphics.fillStyle(color, 0.3);
        graphics.fillRect(0, 20, 60, 20);
        graphics.fillStyle(color, 0.6);
        graphics.fillRect(5, 23, 50, 14);
        graphics.fillStyle(0xffffff, 0.9);
        graphics.fillRect(10, 27, 40, 6);
    }

    generateBullet(graphics, color) {
        graphics.fillStyle(0xffcc00, 0.5);
        graphics.fillCircle(30, 30, 15);
        graphics.fillStyle(0xffdd00, 0.8);
        graphics.fillCircle(30, 30, 10);
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(30, 30, 5);
    }

    generateSlash(graphics, color) {
        graphics.lineStyle(8, color, 0.3);
        graphics.beginPath();
        graphics.moveTo(5, 55);
        graphics.lineTo(55, 5);
        graphics.stroke();
        graphics.lineStyle(5, color, 0.6);
        graphics.beginPath();
        graphics.moveTo(5, 55);
        graphics.lineTo(55, 5);
        graphics.stroke();
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.beginPath();
        graphics.moveTo(5, 55);
        graphics.lineTo(55, 5);
        graphics.stroke();
    }

    generatePlatformTextures() {
        // Main platform
        const mainGraphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Create gradient-like effect with layers
        mainGraphics.fillStyle(0x3a3a5a, 1);
        mainGraphics.fillRoundedRect(0, 0, 100, 40, 5);
        mainGraphics.fillStyle(0x4a4a6a, 1);
        mainGraphics.fillRoundedRect(2, 2, 96, 20, 4);
        mainGraphics.fillStyle(0x5a5a7a, 0.7);
        mainGraphics.fillRoundedRect(4, 4, 92, 10, 3);

        // Top highlight
        mainGraphics.lineStyle(2, 0x8888aa, 0.8);
        mainGraphics.beginPath();
        mainGraphics.moveTo(5, 3);
        mainGraphics.lineTo(95, 3);
        mainGraphics.stroke();

        mainGraphics.generateTexture('platform_main', 100, 40);

        // Floating platform
        const floatGraphics = this.make.graphics({ x: 0, y: 0, add: false });

        floatGraphics.fillStyle(0x2a4a6a, 1);
        floatGraphics.fillRoundedRect(0, 0, 100, 25, 8);
        floatGraphics.fillStyle(0x3a5a7a, 1);
        floatGraphics.fillRoundedRect(2, 2, 96, 12, 6);
        floatGraphics.fillStyle(0x4a6a8a, 0.6);
        floatGraphics.fillRoundedRect(4, 3, 92, 6, 4);

        // Glow effect
        floatGraphics.lineStyle(2, 0x6a9aba, 0.6);
        floatGraphics.strokeRoundedRect(0, 0, 100, 25, 8);

        floatGraphics.generateTexture('platform_floating', 100, 25);
    }

    generateParticleTextures() {
        // Star particle
        const starGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        starGraphics.fillStyle(0xffffff, 1);
        starGraphics.fillCircle(8, 8, 3);
        starGraphics.fillStyle(0xffffff, 0.5);
        starGraphics.fillCircle(8, 8, 6);
        starGraphics.generateTexture('particle_star', 16, 16);

        // Spark particle
        const sparkGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        sparkGraphics.fillStyle(0xffff00, 1);
        sparkGraphics.fillCircle(6, 6, 4);
        sparkGraphics.fillStyle(0xffffff, 1);
        sparkGraphics.fillCircle(6, 6, 2);
        sparkGraphics.generateTexture('particle_spark', 12, 12);

        // Ember particle
        const emberGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        emberGraphics.fillStyle(0xff4400, 0.8);
        emberGraphics.fillCircle(5, 5, 4);
        emberGraphics.fillStyle(0xff8800, 1);
        emberGraphics.fillCircle(5, 5, 2);
        emberGraphics.generateTexture('particle_ember', 10, 10);

        // Snow particle
        const snowGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        snowGraphics.fillStyle(0xffffff, 0.9);
        snowGraphics.fillCircle(4, 4, 3);
        snowGraphics.generateTexture('particle_snow', 8, 8);

        // Hit effect particle
        const hitGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        hitGraphics.fillStyle(0xffffff, 1);
        hitGraphics.fillStar(16, 16, 4, 16, 8);
        hitGraphics.generateTexture('particle_hit', 32, 32);

        // Smoke particle
        const smokeGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        smokeGraphics.fillStyle(0x888888, 0.6);
        smokeGraphics.fillCircle(10, 10, 10);
        smokeGraphics.generateTexture('particle_smoke', 20, 20);

        // Trail particle
        const trailGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        trailGraphics.fillStyle(0xffffff, 0.8);
        trailGraphics.fillCircle(4, 4, 4);
        trailGraphics.generateTexture('particle_trail', 8, 8);
    }

    generateUITextures() {
        // Button texture
        const btnGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        btnGraphics.fillStyle(0xe94560, 1);
        btnGraphics.fillRoundedRect(0, 0, 200, 50, 10);
        btnGraphics.fillStyle(0xff6680, 0.5);
        btnGraphics.fillRoundedRect(3, 3, 194, 22, 8);
        btnGraphics.lineStyle(2, 0xff8899, 0.8);
        btnGraphics.strokeRoundedRect(0, 0, 200, 50, 10);
        btnGraphics.generateTexture('button', 200, 50);

        // Character select box
        const selectGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        selectGraphics.fillStyle(0x16213e, 1);
        selectGraphics.fillRoundedRect(0, 0, 120, 140, 8);
        selectGraphics.lineStyle(3, 0xe94560, 1);
        selectGraphics.strokeRoundedRect(0, 0, 120, 140, 8);
        selectGraphics.generateTexture('char_select_box', 120, 140);

        // Stage select box
        const stageGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        stageGraphics.fillStyle(0x16213e, 1);
        stageGraphics.fillRoundedRect(0, 0, 180, 120, 8);
        stageGraphics.lineStyle(3, 0xe94560, 1);
        stageGraphics.strokeRoundedRect(0, 0, 180, 120, 8);
        stageGraphics.generateTexture('stage_select_box', 180, 120);

        // Health bar background
        const hpBgGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        hpBgGraphics.fillStyle(0x1a1a2e, 1);
        hpBgGraphics.fillRoundedRect(0, 0, 200, 30, 5);
        hpBgGraphics.lineStyle(2, 0x3a3a4e, 1);
        hpBgGraphics.strokeRoundedRect(0, 0, 200, 30, 5);
        hpBgGraphics.generateTexture('hp_bg', 200, 30);

        // Stock icon
        const stockGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        stockGraphics.fillStyle(0xe94560, 1);
        stockGraphics.fillCircle(10, 10, 8);
        stockGraphics.fillStyle(0xff6680, 1);
        stockGraphics.fillCircle(8, 8, 3);
        stockGraphics.generateTexture('stock_icon', 20, 20);
    }

    generateAttackEffects() {
        // Slash effect
        const slashGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        for (let i = 0; i < 5; i++) {
            slashGraphics.lineStyle(3 - i * 0.5, 0xffffff, 1 - i * 0.15);
            slashGraphics.beginPath();
            slashGraphics.arc(40, 40, 30 + i * 5, -Math.PI * 0.3, Math.PI * 0.3);
            slashGraphics.stroke();
        }
        slashGraphics.generateTexture('effect_slash', 80, 80);

        // Impact effect
        const impactGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        impactGraphics.fillStyle(0xffffff, 0.9);
        impactGraphics.fillStar(30, 30, 6, 30, 15);
        impactGraphics.fillStyle(0xffff00, 0.6);
        impactGraphics.fillStar(30, 30, 6, 20, 10);
        impactGraphics.generateTexture('effect_impact', 60, 60);

        // Shield effect
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
        document.getElementById('loading').style.display = 'none';
        this.scene.start('MenuScene');
    }
}
