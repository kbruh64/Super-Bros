// Character Selection Scene with beautiful UI
class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterSelectScene' });
    }

    init(data) {
        this.gameMode = data.mode || 'single';
        this.player1Selection = null;
        this.player2Selection = null;
        this.aiDifficulty = 'MEDIUM';
        this.currentSelector = 1;
    }

    create() {
        this.createBackground();
        this.createTitle();
        this.createCharacterGrid();
        this.createPlayerPanels();
        this.createDifficultySelector();
        this.createConfirmButton();
        this.createBackButton();
        this.setupInput();
    }

    createBackground() {
        // Animated background
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x0f3460, 0x16213e, 0x1a1a2e, 0x16213e, 1);
        graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Animated grid pattern
        this.gridGraphics = this.add.graphics();
        this.gridOffset = 0;
        this.time.addEvent({
            delay: 50,
            callback: () => this.animateGrid(),
            loop: true
        });

        // Particle effects
        this.add.particles(0, 0, 'particle_star', {
            x: { min: 0, max: GAME_WIDTH },
            y: { min: 0, max: GAME_HEIGHT },
            lifespan: 3000,
            speed: 20,
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.5, end: 0 },
            frequency: 200,
            blendMode: 'ADD'
        });
    }

    animateGrid() {
        this.gridOffset = (this.gridOffset + 0.5) % 40;
        this.gridGraphics.clear();
        this.gridGraphics.lineStyle(1, 0xe94560, 0.1);

        for (let x = -40 + this.gridOffset; x < GAME_WIDTH + 40; x += 40) {
            this.gridGraphics.moveTo(x, 0);
            this.gridGraphics.lineTo(x, GAME_HEIGHT);
        }
        for (let y = -40 + this.gridOffset; y < GAME_HEIGHT + 40; y += 40) {
            this.gridGraphics.moveTo(0, y);
            this.gridGraphics.lineTo(GAME_WIDTH, y);
        }
        this.gridGraphics.strokePath();
    }

    createTitle() {
        const title = this.add.text(GAME_WIDTH / 2, 40, 'SELECT YOUR FIGHTER', {
            fontSize: '42px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        title.setStroke('#e94560', 6);
        title.setShadow(3, 3, '#000000', 5);

        // Mode indicator
        const modeText = this.gameMode === 'single' ? '1 PLAYER MODE' : '2 PLAYER MODE';
        this.add.text(GAME_WIDTH / 2, 80, modeText, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#e94560'
        }).setOrigin(0.5);
    }

    createCharacterGrid() {
        this.characterBoxes = [];
        const startX = 180;
        const startY = 180;
        const boxWidth = 130;
        const boxHeight = 150;
        const spacing = 15;
        const cols = 4;

        CHARACTER_LIST.forEach((char, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * (boxWidth + spacing);
            const y = startY + row * (boxHeight + spacing);

            const box = this.createCharacterBox(x, y, char, boxWidth, boxHeight);
            this.characterBoxes.push(box);
        });
    }

    createCharacterBox(x, y, character, width, height) {
        const container = this.add.container(x, y);

        // Background with gradient effect
        const bg = this.add.graphics();
        bg.fillStyle(0x16213e, 1);
        bg.fillRoundedRect(-width/2, -height/2, width, height, 10);

        // Character color accent
        const accent = this.add.graphics();
        accent.fillStyle(character.color, 0.3);
        accent.fillRoundedRect(-width/2 + 5, -height/2 + 5, width - 10, 40, 8);

        // Character sprite
        const sprite = this.add.image(0, -15, `char_${character.id}`);
        sprite.setScale(1.5);

        // Name
        const name = this.add.text(0, height/2 - 35, character.name, {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Selection border (hidden initially)
        const p1Border = this.add.graphics();
        p1Border.lineStyle(4, 0x00ff00, 1);
        p1Border.strokeRoundedRect(-width/2, -height/2, width, height, 10);
        p1Border.setVisible(false);

        const p2Border = this.add.graphics();
        p2Border.lineStyle(4, 0xff6600, 1);
        p2Border.strokeRoundedRect(-width/2 + 4, -height/2 + 4, width - 8, height - 8, 8);
        p2Border.setVisible(false);

        container.add([bg, accent, sprite, name, p1Border, p2Border]);

        // Interactive
        const hitArea = this.add.rectangle(x, y, width, height, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1.08,
                scaleY: 1.08,
                duration: 100
            });
            this.showCharacterInfo(character);
        });

        hitArea.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        hitArea.on('pointerdown', () => {
            this.selectCharacter(character);
        });

        return {
            container,
            character,
            p1Border,
            p2Border,
            sprite
        };
    }

    createPlayerPanels() {
        // Player 1 Panel
        this.p1Panel = this.createPlayerPanel(850, 200, 'PLAYER 1', 0x00ff00, true);

        // Player 2 Panel (or CPU)
        const p2Label = this.gameMode === 'single' ? 'CPU' : 'PLAYER 2';
        this.p2Panel = this.createPlayerPanel(1050, 200, p2Label, 0xff6600, false);
    }

    createPlayerPanel(x, y, label, color, isP1) {
        const container = this.add.container(x, y);

        // Panel background
        const bg = this.add.graphics();
        bg.fillStyle(0x16213e, 1);
        bg.fillRoundedRect(-80, -30, 160, 280, 15);
        bg.lineStyle(3, color, 1);
        bg.strokeRoundedRect(-80, -30, 160, 280, 15);

        // Label
        const labelText = this.add.text(0, -10, label, {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: Phaser.Display.Color.IntegerToColor(color).rgba
        }).setOrigin(0.5);

        // Character preview area
        const previewBg = this.add.graphics();
        previewBg.fillStyle(0x0a0a1a, 1);
        previewBg.fillRoundedRect(-60, 20, 120, 100, 10);

        // Character sprite placeholder
        const charSprite = this.add.image(0, 70, 'particle_star');
        charSprite.setScale(2);
        charSprite.setAlpha(0.3);

        // Character name
        const charName = this.add.text(0, 140, '???', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Ready indicator
        const readyText = this.add.text(0, 220, 'NOT READY', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ff4444'
        }).setOrigin(0.5);

        container.add([bg, labelText, previewBg, charSprite, charName, readyText]);

        return {
            container,
            charSprite,
            charName,
            readyText,
            color,
            selected: null
        };
    }

    showCharacterInfo(character) {
        // Update info panel if exists
        if (this.infoPanel) {
            this.infoPanel.destroy();
        }

        this.infoPanel = this.add.container(950, 480);

        const bg = this.add.graphics();
        bg.fillStyle(0x16213e, 0.9);
        bg.fillRoundedRect(-180, -60, 360, 120, 10);
        bg.lineStyle(2, character.color, 1);
        bg.strokeRoundedRect(-180, -60, 360, 120, 10);

        const desc = this.add.text(0, -30, character.description, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 340 }
        }).setOrigin(0.5);

        const stats = this.add.text(0, 20,
            `Speed: ${'★'.repeat(Math.round(character.speed / 100))}  |  ` +
            `Power: ${'★'.repeat(Math.round(character.weight * 3))}  |  ` +
            `Jump: ${'★'.repeat(Math.round(character.jumpPower * 3))}`, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        this.infoPanel.add([bg, desc, stats]);
    }

    selectCharacter(character) {
        // Play selection sound effect (visual flash instead)
        this.cameras.main.flash(50, 233, 69, 96);

        if (this.gameMode === 'single') {
            // Single player - select for player 1
            this.player1Selection = character;
            this.updatePlayerPanel(this.p1Panel, character);
            this.updateSelectionBorders();
        } else {
            // Versus mode - alternate between players
            if (this.currentSelector === 1) {
                this.player1Selection = character;
                this.updatePlayerPanel(this.p1Panel, character);
                this.currentSelector = 2;
            } else {
                this.player2Selection = character;
                this.updatePlayerPanel(this.p2Panel, character);
                this.currentSelector = 1;
            }
            this.updateSelectionBorders();
        }
    }

    updatePlayerPanel(panel, character) {
        panel.charSprite.setTexture(`char_${character.id}`);
        panel.charSprite.setScale(1.5);
        panel.charSprite.setAlpha(1);
        panel.charName.setText(character.name);
        panel.readyText.setText('READY!');
        panel.readyText.setColor('#00ff00');
        panel.selected = character;

        // Animate
        this.tweens.add({
            targets: panel.charSprite,
            scaleX: 1.7,
            scaleY: 1.7,
            duration: 100,
            yoyo: true
        });
    }

    updateSelectionBorders() {
        this.characterBoxes.forEach(box => {
            box.p1Border.setVisible(box.character === this.player1Selection);
            box.p2Border.setVisible(box.character === this.player2Selection);
        });
    }

    createDifficultySelector() {
        if (this.gameMode !== 'single') return;

        const y = 400;
        this.add.text(950, y - 30, 'AI DIFFICULTY', {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);

        const difficulties = ['EASY', 'MEDIUM', 'HARD'];
        this.diffButtons = [];

        difficulties.forEach((diff, i) => {
            const x = 850 + i * 100;
            const btn = this.add.container(x, y + 20);

            const bg = this.add.graphics();
            const isSelected = diff === this.aiDifficulty;
            bg.fillStyle(isSelected ? 0xe94560 : 0x16213e, 1);
            bg.fillRoundedRect(-40, -15, 80, 30, 8);
            bg.lineStyle(2, 0xe94560, 1);
            bg.strokeRoundedRect(-40, -15, 80, 30, 8);

            const text = this.add.text(0, 0, diff, {
                fontSize: '14px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);

            btn.add([bg, text]);
            btn.setData('difficulty', diff);
            btn.setData('bg', bg);

            const hitArea = this.add.rectangle(x, y + 20, 80, 30, 0x000000, 0);
            hitArea.setInteractive({ useHandCursor: true });

            hitArea.on('pointerdown', () => {
                this.aiDifficulty = diff;
                this.updateDifficultyButtons();
            });

            this.diffButtons.push({ btn, bg, difficulty: diff });
        });
    }

    updateDifficultyButtons() {
        this.diffButtons.forEach(({ btn, bg, difficulty }) => {
            bg.clear();
            const isSelected = difficulty === this.aiDifficulty;
            bg.fillStyle(isSelected ? 0xe94560 : 0x16213e, 1);
            bg.fillRoundedRect(-40, -15, 80, 30, 8);
            bg.lineStyle(2, 0xe94560, 1);
            bg.strokeRoundedRect(-40, -15, 80, 30, 8);
        });
    }

    createConfirmButton() {
        const btn = this.add.container(950, 560);

        const bg = this.add.graphics();
        bg.fillStyle(0x00aa44, 1);
        bg.fillRoundedRect(-100, -25, 200, 50, 12);

        const highlight = this.add.graphics();
        highlight.fillStyle(0x00dd66, 0.5);
        highlight.fillRoundedRect(-95, -22, 190, 20, 10);

        const text = this.add.text(0, 0, 'START BATTLE', {
            fontSize: '22px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);

        btn.add([bg, highlight, text]);

        const hitArea = this.add.rectangle(950, 560, 200, 50, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => btn.setScale(1.05));
        hitArea.on('pointerout', () => btn.setScale(1));
        hitArea.on('pointerdown', () => this.confirmSelection());
    }

    createBackButton() {
        const btn = this.add.text(50, 30, '← BACK', {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#e94560'
        }).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setScale(1.1));
        btn.on('pointerout', () => btn.setScale(1));
        btn.on('pointerdown', () => this.scene.start('MenuScene'));
    }

    setupInput() {
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });

        // Arrow key navigation for character selection
        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.selectedCharIndex === undefined) this.selectedCharIndex = 0;
            this.selectedCharIndex = Math.max(0, this.selectedCharIndex - 1);
            this.highlightCharacter(this.selectedCharIndex);
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.selectedCharIndex === undefined) this.selectedCharIndex = 0;
            this.selectedCharIndex = Math.min(CHARACTER_LIST.length - 1, this.selectedCharIndex + 1);
            this.highlightCharacter(this.selectedCharIndex);
        });

        this.input.keyboard.on('keydown-UP', () => {
            if (this.selectedCharIndex === undefined) this.selectedCharIndex = 0;
            const cols = 4;
            this.selectedCharIndex = Math.max(0, this.selectedCharIndex - cols);
            this.highlightCharacter(this.selectedCharIndex);
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            if (this.selectedCharIndex === undefined) this.selectedCharIndex = 0;
            const cols = 4;
            this.selectedCharIndex = Math.min(CHARACTER_LIST.length - 1, this.selectedCharIndex + cols);
            this.highlightCharacter(this.selectedCharIndex);
        });

        // Space or Enter to select
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.selectedCharIndex !== undefined) {
                this.selectCharacter(CHARACTER_LIST[this.selectedCharIndex]);
            }
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.selectedCharIndex !== undefined) {
                this.selectCharacter(CHARACTER_LIST[this.selectedCharIndex]);
            }
        });

        // F to confirm game start
        this.input.keyboard.on('keydown-F', () => {
            this.confirmSelection();
        });
    }

    highlightCharacter(index) {
        // Remove previous highlights
        if (this.characterBoxes && this.characterBoxes[this.lastHighlightIndex]) {
            this.characterBoxes[this.lastHighlightIndex].container.setScale(1);
        }

        // Highlight new character
        if (this.characterBoxes && this.characterBoxes[index]) {
            this.characterBoxes[index].container.setScale(1.1);
            this.showCharacterInfo(this.characterBoxes[index].character);
            this.lastHighlightIndex = index;
        }
    }

    confirmSelection() {
        if (!this.player1Selection) {
            // Flash to indicate need selection
            this.cameras.main.shake(100, 0.01);
            return;
        }

        if (this.gameMode === 'single') {
            // Auto-select random character for AI if not selected
            if (!this.player2Selection) {
                this.player2Selection = CHARACTER_LIST[Math.floor(Math.random() * CHARACTER_LIST.length)];
            }
        } else if (!this.player2Selection) {
            this.cameras.main.shake(100, 0.01);
            return;
        }

        // Transition to stage select
        this.cameras.main.fade(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
            this.scene.start('StageSelectScene', {
                mode: this.gameMode,
                player1: this.player1Selection,
                player2: this.player2Selection,
                aiDifficulty: this.aiDifficulty
            });
        });
    }
}
