// Character Selection Scene - Cyber Minecraft Style UI
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
        // Cyber-grid background
            this.setupInput();
            this.updateCharacterSelection();
        bg.fillStyle(0x0a0a15, 1);
        bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Neon grid
        bg.lineStyle(1, 0x00ffff, 0.15);
        for (let x = 0; x < GAME_WIDTH; x += 32) {
            bg.moveTo(x, 0);
            bg.lineTo(x, GAME_HEIGHT);
        }
        for (let y = 0; y < GAME_HEIGHT; y += 32) {
            bg.moveTo(0, y);
            bg.lineTo(GAME_WIDTH, y);
        }
        bg.strokePath();

        // Random neon pixels
            this.input.keyboard.on('keydown-LEFT', () => {
                this.currentSelector = (this.currentSelector - 1 + Object.keys(CHARACTERS).length) % Object.keys(CHARACTERS).length;
                this.updateCharacterSelection();
            bg.fillStyle(colors[Math.floor(Math.random() * colors.length)], 0.1);
            bg.fillRect(
                Math.floor(Math.random() * GAME_WIDTH / 16) * 16,
                this.currentSelector = (this.currentSelector + 1) % Object.keys(CHARACTERS).length;
                this.updateCharacterSelection();
                16, 16
            );
        }
        updateCharacterSelection() {
            // Logic to visually update the selected character based on currentSelector
        }
    }

    createTitle() {
        // Glitch effect
        this.add.text(GAME_WIDTH / 2 - 2, 32, 'SELECT FIGHTER', {
            fontSize: '32px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: '#ff00ff'
        }).setOrigin(0.5).setAlpha(0.5);

        this.add.text(GAME_WIDTH / 2 + 2, 32, 'SELECT FIGHTER', {
            fontSize: '32px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: '#00ffff'
        }).setOrigin(0.5).setAlpha(0.5);

        const title = this.add.text(GAME_WIDTH / 2, 32, 'SELECT FIGHTER', {
            fontSize: '32px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        title.setStroke('#00ffff', 2);

        // Mode indicator
        const modeText = this.gameMode === 'single' ? '[ SINGLEPLAYER ]' : '[ MULTIPLAYER ]';
        this.add.text(GAME_WIDTH / 2, 62, modeText, {
            fontSize: '14px',
            fontFamily: 'Courier New, monospace',
            color: '#00ff00'
        }).setOrigin(0.5);
    }

    createCharacterGrid() {
        this.characterBoxes = [];
        const startX = 85;
        const startY = 100;
        const boxWidth = 95;
        const boxHeight = 105;
        const spacing = 8;
        const cols = 5;

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

        // Cyber slot background
        const bg = this.add.graphics();
        this.drawCyberSlot(bg, -width/2, -height/2, width, height, character.color);

        // Character sprite
        const sprite = this.add.image(0, -8, `char_${character.id}`);
        sprite.setScale(1.2);

        // Name with neon glow
        const name = this.add.text(0, height/2 - 18, character.name, {
            fontSize: '9px',
            fontFamily: 'Courier New, monospace',
            color: '#ffffff'
        }).setOrigin(0.5);
        name.setStroke('#000000', 2);

        // Selection borders
        const p1Border = this.add.graphics();
        p1Border.lineStyle(3, 0x00ff00, 1);
        p1Border.strokeRect(-width/2, -height/2, width, height);
        p1Border.setVisible(false);

        const p2Border = this.add.graphics();
        p2Border.lineStyle(3, 0xff0000, 1);
        p2Border.strokeRect(-width/2 + 3, -height/2 + 3, width - 6, height - 6);
        p2Border.setVisible(false);

        container.add([bg, sprite, name, p1Border, p2Border]);

        // Interactive
        const hitArea = this.add.rectangle(x, y, width, height, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            container.setScale(1.08);
            this.showCharacterInfo(character);
        });

        hitArea.on('pointerout', () => {
            container.setScale(1);
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

    drawCyberSlot(graphics, x, y, width, height, charColor) {
        // Dark background
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(x, y, width, height);

        // Inner area
        graphics.fillStyle(0x1a1a2e, 1);
        graphics.fillRect(x + 2, y + 2, width - 4, height - 4);

        // Character color accent at top
        graphics.fillStyle(charColor, 0.3);
        graphics.fillRect(x + 2, y + 2, width - 4, 20);

        // Neon border
        graphics.fillStyle(0x00ffff, 0.8);
        graphics.fillRect(x + 2, y + 2, width - 4, 1);
        graphics.fillRect(x + 2, y + height - 3, width - 4, 1);
        graphics.fillRect(x + 2, y + 2, 1, height - 4);
        graphics.fillRect(x + width - 3, y + 2, 1, height - 4);

        // Corner accents
        graphics.fillStyle(0xff00ff, 1);
        graphics.fillRect(x, y, 4, 4);
        graphics.fillRect(x + width - 4, y, 4, 4);
        graphics.fillRect(x, y + height - 4, 4, 4);
        graphics.fillRect(x + width - 4, y + height - 4, 4, 4);
    }

    createPlayerPanels() {
        this.p1Panel = this.createPlayerPanel(680, 140, 'P1', 0x00ff00, true);
        const p2Label = this.gameMode === 'single' ? 'CPU' : 'P2';
        this.p2Panel = this.createPlayerPanel(850, 140, p2Label, 0xff0000, false);
    }

    createPlayerPanel(x, y, label, color, isP1) {
        const container = this.add.container(x, y);

        // Cyber panel
        const bg = this.add.graphics();
        this.drawCyberPanel(bg, -70, -20, 140, 220, color);

        // Label
        const labelText = this.add.text(0, 0, `[ ${label} ]`, {
            fontSize: '16px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: Phaser.Display.Color.IntegerToColor(color).rgba
        }).setOrigin(0.5);

        // Character preview slot
        const previewBg = this.add.graphics();
        this.drawCyberSlot(previewBg, -45, 20, 90, 80, 0x333333);

        // Character sprite
        const charSprite = this.add.image(0, 60, 'particle_star');
        charSprite.setScale(1.2);
        charSprite.setAlpha(0.3);

        // Character name
        const charName = this.add.text(0, 115, '???', {
            fontSize: '11px',
            fontFamily: 'Courier New, monospace',
            color: '#888888'
        }).setOrigin(0.5);

        // Ready indicator
        const readyText = this.add.text(0, 170, 'WAITING...', {
            fontSize: '10px',
            fontFamily: 'Courier New, monospace',
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

    drawCyberPanel(graphics, x, y, width, height, accentColor) {
        // Glow
        graphics.fillStyle(accentColor, 0.1);
        graphics.fillRect(x - 4, y - 4, width + 8, height + 8);

        // Background
        graphics.fillStyle(0x0a0a15, 1);
        graphics.fillRect(x, y, width, height);

        // Inner
        graphics.fillStyle(0x1a1a2e, 1);
        graphics.fillRect(x + 3, y + 3, width - 6, height - 6);

        // Border
        graphics.fillStyle(accentColor, 0.8);
        graphics.fillRect(x + 3, y + 3, width - 6, 2);
        graphics.fillRect(x + 3, y + height - 5, width - 6, 2);
        graphics.fillRect(x + 3, y + 3, 2, height - 6);
        graphics.fillRect(x + width - 5, y + 3, 2, height - 6);
    }

    showCharacterInfo(character) {
        if (this.infoPanel) this.infoPanel.destroy();

        this.infoPanel = this.add.container(765, 420);

        const bg = this.add.graphics();
        this.drawCyberPanel(bg, -150, -50, 300, 100, 0x00ffff);

        const desc = this.add.text(0, -25, character.description, {
            fontSize: '11px',
            fontFamily: 'Courier New, monospace',
            color: '#00ffff',
            align: 'center',
            wordWrap: { width: 280 }
        }).setOrigin(0.5);

        const speedBars = '|'.repeat(Math.round(character.speed / 60));
        const powerBars = '|'.repeat(Math.round(character.weight * 2.5));
        const jumpBars = '|'.repeat(Math.round(character.jumpPower * 3));

        const stats = this.add.text(0, 15,
            `SPD:[${speedBars.padEnd(7)}] PWR:[${powerBars.padEnd(5)}] JMP:[${jumpBars.padEnd(5)}]`, {
            fontSize: '9px',
            fontFamily: 'Courier New, monospace',
            color: '#888888'
        }).setOrigin(0.5);

        this.infoPanel.add([bg, desc, stats]);
    }

    selectCharacter(character) {
        if (this.gameMode === 'single') {
            this.player1Selection = character;
            this.updatePlayerPanel(this.p1Panel, character);
            this.updateSelectionBorders();
        } else {
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
        panel.charSprite.setScale(1.2);
        panel.charSprite.setAlpha(1);
        panel.charName.setText(character.name);
        panel.charName.setColor('#00ffff');
        panel.readyText.setText('>> READY <<');
        panel.readyText.setColor('#00ff00');
        panel.selected = character;
    }

    updateSelectionBorders() {
        this.characterBoxes.forEach(box => {
            box.p1Border.setVisible(box.character === this.player1Selection);
            box.p2Border.setVisible(box.character === this.player2Selection);
        });
    }

    createDifficultySelector() {
        if (this.gameMode !== 'single') return;

        const y = 385;
        this.add.text(765, y - 20, '[ AI LEVEL ]', {
            fontSize: '12px',
            fontFamily: 'Courier New, monospace',
            color: '#888888'
        }).setOrigin(0.5);

        const difficulties = ['EASY', 'MEDIUM', 'HARD'];
        this.diffButtons = [];

        difficulties.forEach((diff, i) => {
            const x = 680 + i * 85;
            const btn = this.add.container(x, y + 10);

            const bg = this.add.graphics();
            this.drawCyberButton(bg, -35, -12, 70, 24, diff === this.aiDifficulty);

            const text = this.add.text(0, 0, diff, {
                fontSize: '10px',
                fontFamily: 'Courier New, monospace',
                color: diff === this.aiDifficulty ? '#00ffff' : '#666666'
            }).setOrigin(0.5);

            btn.add([bg, text]);

            const hitArea = this.add.rectangle(x, y + 10, 70, 24, 0x000000, 0);
            hitArea.setInteractive({ useHandCursor: true });

            hitArea.on('pointerdown', () => {
                this.aiDifficulty = diff;
                this.updateDifficultyButtons();
            });

            this.diffButtons.push({ btn, bg, text, difficulty: diff });
        });
    }

    drawCyberButton(graphics, x, y, width, height, selected) {
        const borderColor = selected ? 0x00ffff : 0x333333;

        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(x, y, width, height);

        graphics.fillStyle(selected ? 0x1a2a3a : 0x1a1a2e, 1);
        graphics.fillRect(x + 2, y + 2, width - 4, height - 4);

        graphics.fillStyle(borderColor, 1);
        graphics.fillRect(x + 2, y + 2, width - 4, 1);
        graphics.fillRect(x + 2, y + height - 3, width - 4, 1);
        graphics.fillRect(x + 2, y + 2, 1, height - 4);
        graphics.fillRect(x + width - 3, y + 2, 1, height - 4);
    }

    updateDifficultyButtons() {
        this.diffButtons.forEach(({ bg, text, difficulty }) => {
            bg.clear();
            this.drawCyberButton(bg, -35, -12, 70, 24, difficulty === this.aiDifficulty);
            text.setColor(difficulty === this.aiDifficulty ? '#00ffff' : '#666666');
        });
    }

    createConfirmButton() {
        const btn = this.add.container(765, 530);

        const bg = this.add.graphics();
        this.drawCyberButton(bg, -80, -20, 160, 40, true);

        const text = this.add.text(0, 0, '>> START <<', {
            fontSize: '16px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: '#00ffff'
        }).setOrigin(0.5);

        btn.add([bg, text]);

        const hitArea = this.add.rectangle(765, 530, 160, 40, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            text.setColor('#ffffff');
        });
        hitArea.on('pointerout', () => {
            text.setColor('#00ffff');
        });
        hitArea.on('pointerdown', () => this.confirmSelection());
    }

    createBackButton() {
        const btn = this.add.text(50, 25, '< BACK', {
            fontSize: '14px',
            fontFamily: 'Courier New, monospace',
            color: '#666666'
        }).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#00ffff'));
        btn.on('pointerout', () => btn.setColor('#666666'));
        btn.on('pointerdown', () => this.scene.start('MenuScene'));
    }

    setupInput() {
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.selectedCharIndex !== undefined) {
                this.selectCharacter(CHARACTER_LIST[this.selectedCharIndex]);
            }
        });

        this.input.keyboard.on('keydown-F', () => {
            this.confirmSelection();
        });
    }

    confirmSelection() {
        if (!this.player1Selection) {
            this.cameras.main.shake(100, 0.01);
            return;
        }

        if (this.gameMode === 'single') {
            if (!this.player2Selection) {
                this.player2Selection = CHARACTER_LIST[Math.floor(Math.random() * CHARACTER_LIST.length)];
            }
        } else if (!this.player2Selection) {
            this.cameras.main.shake(100, 0.01);
            return;
        }

        this.cameras.main.flash(200, 0, 255, 255);
        this.time.delayedCall(200, () => {
            this.scene.start('StageSelectScene', {
                mode: this.gameMode,
                player1: this.player1Selection,
                player2: this.player2Selection,
                aiDifficulty: this.aiDifficulty
            });
        });
    }
}
