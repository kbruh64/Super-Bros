// Victory Screen Scene
class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data) {
        this.winner = data.winner;
        this.gameMode = data.mode;
        this.player1Data = data.player1;
        this.player2Data = data.player2;
        this.arena = data.arena;
        this.aiDifficulty = data.aiDifficulty;
    }

    create() {
        this.createBackground();
        this.createVictoryEffects();
        this.createWinnerDisplay();
        this.createButtons();
        this.playVictoryAnimation();
    }

    createBackground() {
        // Dark gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a1a3a, 0x1a1a3a, 1);
        bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Radial glow behind winner
        const glow = this.add.graphics();
        const winnerColor = this.winner.characterData.color;
        glow.fillStyle(winnerColor, 0.1);
        glow.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, 300);
        glow.fillStyle(winnerColor, 0.05);
        glow.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, 400);

        // Animated light rays
        this.lightRays = [];
        for (let i = 0; i < 12; i++) {
            const ray = this.add.graphics();
            ray.fillStyle(winnerColor, 0.1);

            const angle = (i / 12) * Math.PI * 2;
            ray.beginPath();
            ray.moveTo(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);
            ray.lineTo(
                GAME_WIDTH / 2 + Math.cos(angle) * 500,
                GAME_HEIGHT / 2 - 50 + Math.sin(angle) * 500
            );
            ray.lineTo(
                GAME_WIDTH / 2 + Math.cos(angle + 0.1) * 500,
                GAME_HEIGHT / 2 - 50 + Math.sin(angle + 0.1) * 500
            );
            ray.closePath();
            ray.fill();

            this.tweens.add({
                targets: ray,
                alpha: { from: 0.3, to: 0.1 },
                angle: 360,
                duration: 20000,
                repeat: -1
            });

            this.lightRays.push(ray);
        }
    }

    createVictoryEffects() {
        // Confetti particles
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

        this.confettiEmitter = this.add.particles(0, 0, 'particle_star', {
            x: { min: 0, max: GAME_WIDTH },
            y: -20,
            lifespan: 4000,
            speedY: { min: 100, max: 200 },
            speedX: { min: -50, max: 50 },
            scale: { start: 0.8, end: 0.2 },
            rotate: { min: 0, max: 360 },
            tint: colors,
            frequency: 50
        });

        // Sparkle bursts
        this.time.addEvent({
            delay: 500,
            callback: () => this.createSparkleBurst(),
            repeat: -1
        });
    }

    createSparkleBurst() {
        const x = Math.random() * GAME_WIDTH;
        const y = Math.random() * GAME_HEIGHT * 0.6;

        for (let i = 0; i < 8; i++) {
            const spark = this.add.star(x, y, 4, 3, 8, 0xffffff);
            spark.setAlpha(0.8);

            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;

            this.tweens.add({
                targets: spark,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                alpha: 0,
                scale: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => spark.destroy()
            });
        }
    }

    createWinnerDisplay() {
        const winnerData = this.winner.characterData;
        const isPlayer1 = this.winner.playerNum === 1;

        // Winner label
        const labelText = isPlayer1 ? 'PLAYER 1' : (this.gameMode === 'single' ? 'CPU' : 'PLAYER 2');

        // Main container
        this.winnerContainer = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80);

        // Character sprite (large)
        const sprite = this.add.image(0, 30, `char_${winnerData.id}`);
        sprite.setScale(4);

        // Glow effect behind sprite
        const spriteGlow = this.add.image(0, 30, `char_${winnerData.id}`);
        spriteGlow.setScale(4.5);
        spriteGlow.setTint(winnerData.color);
        spriteGlow.setAlpha(0.3);
        spriteGlow.setBlendMode('ADD');

        // Winner banner
        const banner = this.add.graphics();
        banner.fillStyle(0x000000, 0.7);
        banner.fillRoundedRect(-250, -140, 500, 60, 15);
        banner.lineStyle(3, winnerData.color, 1);
        banner.strokeRoundedRect(-250, -140, 500, 60, 15);

        // Winner text
        const winText = this.add.text(0, -110, 'WINNER!', {
            fontSize: '42px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        winText.setStroke('#000000', 6);

        // Character name
        const nameText = this.add.text(0, 150, winnerData.name.toUpperCase(), {
            fontSize: '36px',
            fontFamily: 'Arial Black',
            color: Phaser.Display.Color.IntegerToColor(winnerData.color).rgba
        }).setOrigin(0.5);
        nameText.setStroke('#000000', 5);

        // Player label
        const playerLabel = this.add.text(0, 190, labelText, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        this.winnerContainer.add([spriteGlow, sprite, banner, winText, nameText, playerLabel]);
        this.winnerContainer.setScale(0);
    }

    playVictoryAnimation() {
        // Dramatic entrance
        this.tweens.add({
            targets: this.winnerContainer,
            scale: 1,
            duration: 800,
            ease: 'Back.out',
            onComplete: () => {
                // Bounce animation
                this.tweens.add({
                    targets: this.winnerContainer,
                    y: this.winnerContainer.y - 10,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });

        // Screen flash
        this.cameras.main.flash(300, 255, 255, 255);
    }

    createButtons() {
        const buttonY = GAME_HEIGHT - 100;

        // Rematch button
        this.createButton(GAME_WIDTH / 2 - 150, buttonY, 'REMATCH', () => {
            this.cameras.main.fade(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start('GameScene', {
                    mode: this.gameMode,
                    player1: this.player1Data,
                    player2: this.player2Data,
                    arena: this.arena,
                    aiDifficulty: this.aiDifficulty
                });
            });
        });

        // Character select button
        this.createButton(GAME_WIDTH / 2 + 150, buttonY, 'NEW GAME', () => {
            this.cameras.main.fade(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start('CharacterSelectScene', { mode: this.gameMode });
            });
        });

        // Main menu button
        const menuBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 40, 'MAIN MENU', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#888888'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        menuBtn.on('pointerover', () => menuBtn.setColor('#ffffff'));
        menuBtn.on('pointerout', () => menuBtn.setColor('#888888'));
        menuBtn.on('pointerdown', () => {
            this.cameras.main.fade(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start('MenuScene');
            });
        });
    }

    createButton(x, y, text, callback) {
        const container = this.add.container(x, y);

        // Background
        const bg = this.add.graphics();
        bg.fillStyle(0xe94560, 1);
        bg.fillRoundedRect(-100, -25, 200, 50, 12);

        // Highlight
        const highlight = this.add.graphics();
        highlight.fillStyle(0xff6680, 0.5);
        highlight.fillRoundedRect(-95, -22, 190, 20, 10);

        // Border
        const border = this.add.graphics();
        border.lineStyle(2, 0xff8899, 0.8);
        border.strokeRoundedRect(-100, -25, 200, 50, 12);

        // Text
        const btnText = this.add.text(0, 0, text, {
            fontSize: '22px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        btnText.setStroke('#000000', 3);

        container.add([bg, highlight, border, btnText]);

        // Hit area
        const hitArea = this.add.rectangle(x, y, 200, 50, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            container.setScale(1.1);
            bg.clear();
            bg.fillStyle(0xff6680, 1);
            bg.fillRoundedRect(-100, -25, 200, 50, 12);
        });

        hitArea.on('pointerout', () => {
            container.setScale(1);
            bg.clear();
            bg.fillStyle(0xe94560, 1);
            bg.fillRoundedRect(-100, -25, 200, 50, 12);
        });

        hitArea.on('pointerdown', () => {
            this.cameras.main.flash(50);
            callback();
        });

        return container;
    }
}
