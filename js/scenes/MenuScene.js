// Main Menu Scene - Minecraft Style UI
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Minecraft-style dirt background
        this.createMinecraftBackground();

        // Title with blocky style
        this.createTitle();

        // Minecraft-style menu buttons
        this.createMenuButtons();

        // Floating character previews
        this.createFloatingCharacters();

        // Version text
        this.add.text(GAME_WIDTH - 10, GAME_HEIGHT - 10, 'v1.0.0', {
            fontSize: '14px',
            fontFamily: 'Courier New, monospace',
            color: '#555555'
        }).setOrigin(1, 1);
    }

    createMinecraftBackground() {
        // Dark background
        const bg = this.add.graphics();
        bg.fillStyle(0x2d2d2d, 1);
        bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Draw dirt-like pattern
        const dirtColors = [0x6b5344, 0x5a4636, 0x7a6352, 0x4a3828];
        const grassColors = [0x5a8f3a, 0x4a7f2a, 0x6a9f4a];

        for (let x = 0; x < GAME_WIDTH; x += 16) {
            for (let y = 0; y < GAME_HEIGHT; y += 16) {
                const noise = Math.random();
                let color;
                if (y < 64) {
                    // Grass at top
                    color = grassColors[Math.floor(Math.random() * grassColors.length)];
                } else {
                    // Dirt/stone below
                    color = dirtColors[Math.floor(Math.random() * dirtColors.length)];
                }
                bg.fillStyle(color, 0.3 + noise * 0.2);
                bg.fillRect(x, y, 16, 16);

                // Add pixel noise texture
                if (Math.random() > 0.7) {
                    bg.fillStyle(0x000000, 0.1);
                    bg.fillRect(x + Math.random() * 8, y + Math.random() * 8, 4, 4);
                }
            }
        }

        // Darker vignette around edges
        const vignette = this.add.graphics();
        for (let i = 0; i < 5; i++) {
            vignette.fillStyle(0x000000, 0.15 - i * 0.025);
            vignette.fillRect(0, 0, GAME_WIDTH, 40 - i * 8);
            vignette.fillRect(0, GAME_HEIGHT - 40 + i * 8, GAME_WIDTH, 40 - i * 8);
            vignette.fillRect(0, 0, 40 - i * 8, GAME_HEIGHT);
            vignette.fillRect(GAME_WIDTH - 40 + i * 8, 0, 40 - i * 8, GAME_HEIGHT);
        }
    }

    createTitle() {
        // Shadow for 3D blocky effect
        for (let i = 4; i > 0; i--) {
            this.add.text(GAME_WIDTH / 2 + i, 80 + i, 'SUPER BROS', {
                fontSize: '64px',
                fontFamily: 'Courier New, monospace',
                fontStyle: 'bold',
                color: '#000000'
            }).setOrigin(0.5).setAlpha(0.5);
        }

        // Main title - yellow like Minecraft
        const title = this.add.text(GAME_WIDTH / 2, 80, 'SUPER BROS', {
            fontSize: '64px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: '#ffff00'
        }).setOrigin(0.5);
        title.setStroke('#5a5a00', 6);

        // Subtitle - "CYBER EDITION"
        const subtitle = this.add.text(GAME_WIDTH / 2, 140, 'CYBER EDITION', {
            fontSize: '24px',
            fontFamily: 'Courier New, monospace',
            color: '#00ffff'
        }).setOrigin(0.5);
        subtitle.setStroke('#005555', 3);

        // Splash text like Minecraft
        const splashes = ['Also try Minecraft!', '100% Neon!', 'Cyber themed!', 'Now with combos!', 'Blocky UI!'];
        const splash = this.add.text(GAME_WIDTH / 2 + 200, 120, splashes[Math.floor(Math.random() * splashes.length)], {
            fontSize: '18px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: '#ffff00'
        }).setOrigin(0.5).setRotation(-0.3);

        this.tweens.add({
            targets: splash,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    createMenuButtons() {
        const buttonY = 280;
        const buttonSpacing = 60;

        const buttons = [
            { text: 'Singleplayer', scene: 'CharacterSelectScene', mode: 'single' },
            { text: 'Multiplayer', scene: 'CharacterSelectScene', mode: 'versus' },
            { text: 'How To Play', action: 'controls' }
        ];

        buttons.forEach((btn, index) => {
            this.createMinecraftButton(
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

    createMinecraftButton(x, y, text, callback) {
        const container = this.add.container(x, y);
        const width = 300;
        const height = 40;

        // Button background - stone-like gray
        const bg = this.add.graphics();
        this.drawMinecraftButtonBg(bg, -width/2, -height/2, width, height, false);

        // Text
        const btnText = this.add.text(0, 0, text, {
            fontSize: '20px',
            fontFamily: 'Courier New, monospace',
            color: '#ffffff'
        }).setOrigin(0.5);
        btnText.setStroke('#3f3f3f', 2);

        container.add([bg, btnText]);

        // Make interactive
        const hitArea = this.add.rectangle(x, y, width, height, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            bg.clear();
            this.drawMinecraftButtonBg(bg, -width/2, -height/2, width, height, true);
            btnText.setColor('#ffffa0');
        });

        hitArea.on('pointerout', () => {
            bg.clear();
            this.drawMinecraftButtonBg(bg, -width/2, -height/2, width, height, false);
            btnText.setColor('#ffffff');
        });

        hitArea.on('pointerdown', () => {
            callback();
        });

        return container;
    }

    drawMinecraftButtonBg(graphics, x, y, width, height, hovered) {
        // Minecraft button style - gray with beveled edges
        const mainColor = hovered ? 0x6c8ccc : 0x8b8b8b;
        const lightColor = hovered ? 0x9cbcfc : 0xc6c6c6;
        const darkColor = hovered ? 0x3c5c9c : 0x555555;
        const borderColor = 0x000000;

        // Black border
        graphics.fillStyle(borderColor, 1);
        graphics.fillRect(x, y, width, height);

        // Main button body
        graphics.fillStyle(mainColor, 1);
        graphics.fillRect(x + 2, y + 2, width - 4, height - 4);

        // Top/left highlight
        graphics.fillStyle(lightColor, 1);
        graphics.fillRect(x + 2, y + 2, width - 4, 2);
        graphics.fillRect(x + 2, y + 2, 2, height - 4);

        // Bottom/right shadow
        graphics.fillStyle(darkColor, 1);
        graphics.fillRect(x + 2, y + height - 4, width - 4, 2);
        graphics.fillRect(x + width - 4, y + 2, 2, height - 4);

        // Pixelated texture
        for (let i = 0; i < 8; i++) {
            const px = x + 4 + Math.random() * (width - 8);
            const py = y + 4 + Math.random() * (height - 8);
            graphics.fillStyle(hovered ? 0x8cacdc : 0x7a7a7a, 0.5);
            graphics.fillRect(px, py, 4, 4);
        }
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
            0x000000, 0.7
        );

        const panel = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2);

        // Panel background - Minecraft inventory style
        const panelBg = this.add.graphics();
        this.drawMinecraftPanel(panelBg, -280, -200, 560, 400);

        // Title
        const title = this.add.text(0, -160, 'CONTROLS', {
            fontSize: '28px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: '#3f3f3f'
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
            fontSize: '16px',
            fontFamily: 'Courier New, monospace',
            color: '#3f3f3f',
            align: 'center',
            lineSpacing: 6
        }).setOrigin(0.5);

        // Close button - Minecraft style
        const closeBg = this.add.graphics();
        this.drawMinecraftButtonBg(closeBg, -60, -15, 120, 30, false);
        const closeText = this.add.text(0, 0, 'Done', {
            fontSize: '16px',
            fontFamily: 'Courier New, monospace',
            color: '#ffffff'
        }).setOrigin(0.5);
        closeText.setStroke('#3f3f3f', 2);

        const closeContainer = this.add.container(0, 160, [closeBg, closeText]);

        const closeHit = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 160, 120, 30, 0x000000, 0);
        closeHit.setInteractive({ useHandCursor: true });

        closeHit.on('pointerover', () => {
            closeBg.clear();
            this.drawMinecraftButtonBg(closeBg, -60, -15, 120, 30, true);
            closeText.setColor('#ffffa0');
        });

        closeHit.on('pointerout', () => {
            closeBg.clear();
            this.drawMinecraftButtonBg(closeBg, -60, -15, 120, 30, false);
            closeText.setColor('#ffffff');
        });

        closeHit.on('pointerdown', () => {
            panel.destroy();
            overlay.destroy();
            closeHit.destroy();
        });

        panel.add([panelBg, title, textContent, closeContainer]);
    }

    drawMinecraftPanel(graphics, x, y, width, height) {
        // Minecraft inventory panel - light gray with dark border
        const bgColor = 0xc6c6c6;
        const borderDark = 0x373737;
        const borderLight = 0xffffff;

        // Outer dark border
        graphics.fillStyle(borderDark, 1);
        graphics.fillRect(x, y, width, height);

        // Inner light area
        graphics.fillStyle(bgColor, 1);
        graphics.fillRect(x + 4, y + 4, width - 8, height - 8);

        // Top/left white highlight
        graphics.fillStyle(borderLight, 1);
        graphics.fillRect(x + 4, y + 4, width - 8, 2);
        graphics.fillRect(x + 4, y + 4, 2, height - 8);

        // Bottom/right dark shadow
        graphics.fillStyle(borderDark, 0.5);
        graphics.fillRect(x + 4, y + height - 6, width - 8, 2);
        graphics.fillRect(x + width - 6, y + 4, 2, height - 8);
    }
}
