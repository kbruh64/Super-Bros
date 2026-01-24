// Pause Menu Scene
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    init(data) {
        this.gameScene = data.gameScene;
    }

    create() {
        // Semi-transparent overlay
        this.overlay = this.add.rectangle(
            GAME_WIDTH / 2, GAME_HEIGHT / 2,
            GAME_WIDTH, GAME_HEIGHT,
            0x000000, 0.7
        );

        // Blur effect simulation with multiple overlays
        for (let i = 0; i < 3; i++) {
            const blur = this.add.rectangle(
                GAME_WIDTH / 2, GAME_HEIGHT / 2,
                GAME_WIDTH, GAME_HEIGHT,
                0x1a1a2e, 0.1
            );
        }

        // Pause panel
        this.createPanel();

        // Input
        this.input.keyboard.on('keydown-ESC', () => {
            this.resumeGame();
        });
    }

    createPanel() {
        const panel = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2);

        // Background
        const bg = this.add.graphics();
        bg.fillStyle(0x16213e, 0.95);
        bg.fillRoundedRect(-200, -180, 400, 360, 20);
        bg.lineStyle(4, 0xe94560, 1);
        bg.strokeRoundedRect(-200, -180, 400, 360, 20);

        // Decorative corner accents
        const corners = this.add.graphics();
        corners.lineStyle(3, 0xe94560, 0.5);
        corners.moveTo(-180, -150);
        corners.lineTo(-180, -130);
        corners.moveTo(-180, -150);
        corners.lineTo(-160, -150);

        corners.moveTo(180, -150);
        corners.lineTo(180, -130);
        corners.moveTo(180, -150);
        corners.lineTo(160, -150);

        corners.moveTo(-180, 150);
        corners.lineTo(-180, 130);
        corners.moveTo(-180, 150);
        corners.lineTo(-160, 150);

        corners.moveTo(180, 150);
        corners.lineTo(180, 130);
        corners.moveTo(180, 150);
        corners.lineTo(160, 150);
        corners.strokePath();

        // Title
        const title = this.add.text(0, -130, 'PAUSED', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        title.setStroke('#e94560', 6);

        // Pulsing animation
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        panel.add([bg, corners, title]);

        // Menu buttons
        const buttonY = -40;
        const spacing = 60;

        this.createButton(panel, 0, buttonY, 'RESUME', () => this.resumeGame());
        this.createButton(panel, 0, buttonY + spacing, 'RESTART', () => this.restartGame());
        this.createButton(panel, 0, buttonY + spacing * 2, 'MAIN MENU', () => this.goToMenu());

        // Controls reminder
        const controlsText = this.add.text(0, 130, 'Press ESC to resume', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#888888'
        }).setOrigin(0.5);

        panel.add(controlsText);
    }

    createButton(panel, x, y, text, callback) {
        const btn = this.add.container(x, y);

        // Background
        const bg = this.add.graphics();
        bg.fillStyle(0xe94560, 1);
        bg.fillRoundedRect(-120, -25, 240, 50, 10);

        // Highlight
        const highlight = this.add.graphics();
        highlight.fillStyle(0xff6680, 0.5);
        highlight.fillRoundedRect(-115, -22, 230, 20, 8);

        // Text
        const btnText = this.add.text(0, 0, text, {
            fontSize: '22px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        btnText.setStroke('#000000', 3);

        btn.add([bg, highlight, btnText]);
        panel.add(btn);

        // Hit area
        const hitArea = this.add.rectangle(
            GAME_WIDTH / 2 + x,
            GAME_HEIGHT / 2 + y,
            240, 50,
            0x000000, 0
        );
        hitArea.setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            btn.setScale(1.1);
            bg.clear();
            bg.fillStyle(0xff6680, 1);
            bg.fillRoundedRect(-120, -25, 240, 50, 10);
        });

        hitArea.on('pointerout', () => {
            btn.setScale(1);
            bg.clear();
            bg.fillStyle(0xe94560, 1);
            bg.fillRoundedRect(-120, -25, 240, 50, 10);
        });

        hitArea.on('pointerdown', () => {
            this.cameras.main.flash(50);
            callback();
        });
    }

    resumeGame() {
        this.scene.get('GameScene').togglePause();
    }

    restartGame() {
        const gameScene = this.scene.get('GameScene');
        this.scene.stop('PauseScene');
        this.scene.stop('GameScene');
        this.scene.start('GameScene', {
            mode: gameScene.gameMode,
            player1: gameScene.player1Data,
            player2: gameScene.player2Data,
            arena: gameScene.currentArena,
            aiDifficulty: gameScene.aiDifficulty
        });
    }

    goToMenu() {
        this.scene.stop('PauseScene');
        this.scene.stop('GameScene');
        this.scene.start('MenuScene');
    }
}
