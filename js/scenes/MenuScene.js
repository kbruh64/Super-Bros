// Main Menu Scene with stunning visuals
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Animated gradient background
        this.createAnimatedBackground();

        // Particle systems for ambiance
        this.createParticleEffects();

        // Title with glow effect
        this.createTitle();

        // Menu buttons
        this.createMenuButtons();

        // Floating character previews
        this.createFloatingCharacters();

        // Version text
        this.add.text(GAME_WIDTH - 10, GAME_HEIGHT - 10, 'v1.0.0', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#666666'
        }).setOrigin(1, 1);
    }

    createAnimatedBackground() {
        // Create multiple gradient layers
        this.bgLayers = [];

        for (let i = 0; i < 3; i++) {
            const graphics = this.add.graphics();
            graphics.fillGradientStyle(
                0x1a1a2e, 0x16213e,
                0x0f3460, 0x1a1a2e,
                1
            );
            graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            graphics.setAlpha(0.5 + i * 0.2);
            this.bgLayers.push(graphics);
        }

        // Animated color overlay
        this.colorOverlay = this.add.graphics();
        this.updateOverlay(0);

        // Animate the overlay
        this.tweens.addCounter({
            from: 0,
            to: 360,
            duration: 10000,
            repeat: -1,
            onUpdate: (tween) => {
                this.updateOverlay(tween.getValue());
            }
        });
    }

    updateOverlay(hue) {
        this.colorOverlay.clear();
        const color = Phaser.Display.Color.HSLToColor(hue / 360, 0.5, 0.15);
        this.colorOverlay.fillStyle(color.color, 0.3);
        this.colorOverlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    createParticleEffects() {
        // Create star field
        this.particles = this.add.particles(0, 0, 'particle_star', {
            x: { min: 0, max: GAME_WIDTH },
            y: { min: 0, max: GAME_HEIGHT },
            lifespan: 4000,
            speed: { min: 10, max: 30 },
            angle: { min: 260, max: 280 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.8, end: 0 },
            frequency: 100,
            blendMode: 'ADD'
        });

        // Glowing orbs
        this.glowOrbs = [];
        for (let i = 0; i < 5; i++) {
            const orb = this.add.circle(
                Math.random() * GAME_WIDTH,
                Math.random() * GAME_HEIGHT,
                20 + Math.random() * 30,
                0xe94560,
                0.1
            );
            orb.setBlendMode('ADD');

            this.tweens.add({
                targets: orb,
                x: Math.random() * GAME_WIDTH,
                y: Math.random() * GAME_HEIGHT,
                alpha: { from: 0.05, to: 0.2 },
                scale: { from: 0.8, to: 1.2 },
                duration: 5000 + Math.random() * 5000,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });

            this.glowOrbs.push(orb);
        }
    }

    createTitle() {
        // Shadow layers for 3D effect
        for (let i = 5; i > 0; i--) {
            this.add.text(GAME_WIDTH / 2 + i * 2, 100 + i * 2, 'SUPER BROS', {
                fontSize: '72px',
                fontFamily: 'Arial Black, Arial',
                color: '#000000'
            }).setOrigin(0.5).setAlpha(0.3 - i * 0.05);
        }

        // Main title
        const title = this.add.text(GAME_WIDTH / 2, 100, 'SUPER BROS', {
            fontSize: '72px',
            fontFamily: 'Arial Black, Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Glow effect using stroke
        title.setStroke('#e94560', 8);
        title.setShadow(0, 0, '#e94560', 20, true, true);

        // Animate title
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtitle
        const subtitle = this.add.text(GAME_WIDTH / 2, 170, 'PLATFORM FIGHTER', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#e94560'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: subtitle,
            alpha: { from: 0.6, to: 1 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }

    createMenuButtons() {
        const buttonY = 320;
        const buttonSpacing = 70;

        const buttons = [
            { text: '1 PLAYER', scene: 'CharacterSelectScene', mode: 'single' },
            { text: '2 PLAYERS', scene: 'CharacterSelectScene', mode: 'versus' },
            { text: 'HOW TO PLAY', action: 'controls' }
        ];

        buttons.forEach((btn, index) => {
            this.createButton(
                GAME_WIDTH / 2,
                buttonY + index * buttonSpacing,
                btn.text,
                () => {
                    if (btn.action === 'controls') {
                        this.showControls();
                    } else {
                        this.scene.start(btn.scene, { mode: btn.mode });
                    }
                }
            );
        });
    }

    createButton(x, y, text, callback) {
        const container = this.add.container(x, y);

        // Button background
        const bg = this.add.graphics();
        bg.fillStyle(0xe94560, 1);
        bg.fillRoundedRect(-120, -30, 240, 60, 12);

        // Highlight
        const highlight = this.add.graphics();
        highlight.fillStyle(0xff6680, 0.5);
        highlight.fillRoundedRect(-115, -27, 230, 25, 10);

        // Border
        const border = this.add.graphics();
        border.lineStyle(3, 0xff8899, 0.8);
        border.strokeRoundedRect(-120, -30, 240, 60, 12);

        // Text
        const btnText = this.add.text(0, 0, text, {
            fontSize: '28px',
            fontFamily: 'Arial Black, Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        btnText.setStroke('#000000', 4);

        container.add([bg, highlight, border, btnText]);

        // Make interactive
        const hitArea = this.add.rectangle(x, y, 240, 60, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
            bg.clear();
            bg.fillStyle(0xff6680, 1);
            bg.fillRoundedRect(-120, -30, 240, 60, 12);
        });

        hitArea.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
            bg.clear();
            bg.fillStyle(0xe94560, 1);
            bg.fillRoundedRect(-120, -30, 240, 60, 12);
        });

        hitArea.on('pointerdown', () => {
            this.cameras.main.flash(100, 233, 69, 96);
            callback();
        });

        return container;
    }

    createFloatingCharacters() {
        // Show random characters floating in background
        const positions = [
            { x: 150, y: 500 },
            { x: 1050, y: 480 },
            { x: 200, y: 280 },
            { x: 1000, y: 300 }
        ];

        positions.forEach((pos, i) => {
            const char = CHARACTER_LIST[i % CHARACTER_LIST.length];
            const sprite = this.add.image(pos.x, pos.y, `char_${char.id}`);
            sprite.setAlpha(0.3);
            sprite.setScale(1.5);

            this.tweens.add({
                targets: sprite,
                y: pos.y + 20,
                alpha: { from: 0.2, to: 0.4 },
                duration: 2000 + i * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    showControls() {
        // Create overlay
        const overlay = this.add.rectangle(
            GAME_WIDTH / 2, GAME_HEIGHT / 2,
            GAME_WIDTH, GAME_HEIGHT,
            0x000000, 0.8
        );

        const panel = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2);

        // Panel background
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x16213e, 1);
        panelBg.fillRoundedRect(-300, -220, 600, 440, 20);
        panelBg.lineStyle(4, 0xe94560, 1);
        panelBg.strokeRoundedRect(-300, -220, 600, 440, 20);

        // Title
        const title = this.add.text(0, -180, 'CONTROLS', {
            fontSize: '36px',
            fontFamily: 'Arial Black',
            color: '#e94560'
        }).setOrigin(0.5);

        // Controls info
        const controlsText = [
            'PLAYER 1:',
            'Move: W A S D',
            'Attack: G',
            'Special: H',
            '',
            'PLAYER 2:',
            'Move: Arrow Keys',
            'Attack: Numpad 1',
            'Special: Numpad 2',
            '',
            'GENERAL:',
            'Pause: ESC'
        ];

        const textContent = this.add.text(0, 20, controlsText.join('\n'), {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);

        // Close button
        const closeBtn = this.add.text(0, 180, 'CLOSE', {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            backgroundColor: '#e94560',
            padding: { x: 30, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerover', () => closeBtn.setScale(1.1));
        closeBtn.on('pointerout', () => closeBtn.setScale(1));
        closeBtn.on('pointerdown', () => {
            panel.destroy();
            overlay.destroy();
        });

        panel.add([panelBg, title, textContent, closeBtn]);
    }
}
