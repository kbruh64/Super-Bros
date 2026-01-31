// Character Selection Scene - Minecraft Style UI
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
        // Minecraft-style dirt background
        const bg = this.add.graphics();
        bg.fillStyle(0x2d2d2d, 1);
        bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Draw dirt-like pattern
        const dirtColors = [0x6b5344, 0x5a4636, 0x7a6352, 0x4a3828];
        for (let x = 0; x < GAME_WIDTH; x += 16) {
            for (let y = 0; y < GAME_HEIGHT; y += 16) {
                const color = dirtColors[Math.floor(Math.random() * dirtColors.length)];
                bg.fillStyle(color, 0.25 + Math.random() * 0.15);
                bg.fillRect(x, y, 16, 16);
            }
        }
    }

    createTitle() {
        // Shadow effect
        for (let i = 3; i > 0; i--) {
            this.add.text(GAME_WIDTH / 2 + i, 35 + i, 'SELECT FIGHTER', {
                fontSize: '36px',
                fontFamily: 'Courier New, monospace',
                fontStyle: 'bold',
                color: '#000000'
            }).setOrigin(0.5).setAlpha(0.5);
        }

        const title = this.add.text(GAME_WIDTH / 2, 35, 'SELECT FIGHTER', {
            fontSize: '36px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        title.setStroke('#3f3f3f', 4);

        // Mode indicator
        const modeText = this.gameMode === 'single' ? 'Singleplayer' : 'Multiplayer';
        this.add.text(GAME_WIDTH / 2, 70, modeText, {
            fontSize: '16px',
            fontFamily: 'Courier New, monospace',
            color: '#aaaaaa'
        }).setOrigin(0.5);
    }

    createCharacterGrid() {
        this.characterBoxes = [];
        const startX = 180;
        const startY = 160;
        const boxWidth = 120;
        const boxHeight = 130;
        const spacing = 10;
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

        // Minecraft inventory slot style background
        const bg = this.add.graphics();
        this.drawMinecraftSlot(bg, -width/2, -height/2, width, height);

        // Character sprite
        const sprite = this.add.image(0, -10, `char_${character.id}`);
        sprite.setScale(1.3);

        // Name - Minecraft font style
        const name = this.add.text(0, height/2 - 25, character.name, {
            fontSize: '11px',
            fontFamily: 'Courier New, monospace',
            color: '#ffffff'
        }).setOrigin(0.5);
        name.setStroke('#3f3f3f', 2);

        // Selection border (hidden initially)
        const p1Border = this.add.graphics();
        p1Border.lineStyle(4, 0x55ff55, 1);
        p1Border.strokeRect(-width/2, -height/2, width, height);
        p1Border.setVisible(false);

        const p2Border = this.add.graphics();
        p2Border.lineStyle(4, 0xff5555, 1);
        p2Border.strokeRect(-width/2 + 4, -height/2 + 4, width - 8, height - 8);
        p2Border.setVisible(false);

        container.add([bg, sprite, name, p1Border, p2Border]);

        // Interactive
        const hitArea = this.add.rectangle(x, y, width, height, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1.05,
                scaleY: 1.05,
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

    drawMinecraftSlot(graphics, x, y, width, height) {
        // Minecraft inventory slot style
        const bgColor = 0x8b8b8b;
        const borderDark = 0x373737;
        const borderLight = 0xffffff;

        // Dark border
        graphics.fillStyle(borderDark, 1);
        graphics.fillRect(x, y, width, height);

        // Main background
        graphics.fillStyle(bgColor, 1);
        graphics.fillRect(x + 2, y + 2, width - 4, height - 4);

        // Inner darker area (slot look)
        graphics.fillStyle(0x555555, 1);
        graphics.fillRect(x + 4, y + 4, width - 8, height - 8);

        // Top-left shadow (makes it look inset)
        graphics.fillStyle(borderDark, 0.5);
        graphics.fillRect(x + 4, y + 4, width - 8, 2);
        graphics.fillRect(x + 4, y + 4, 2, height - 8);
    }

    createPlayerPanels() {
        // Player 1 Panel
        this.p1Panel = this.createPlayerPanel(850, 180, 'PLAYER 1', 0x55ff55, true);

        // Player 2 Panel (or CPU)
        const p2Label = this.gameMode === 'single' ? 'CPU' : 'PLAYER 2';
        this.p2Panel = this.createPlayerPanel(1050, 180, p2Label, 0xff5555, false);
    }

    createPlayerPanel(x, y, label, color, isP1) {
        const container = this.add.container(x, y);

        // Minecraft-style panel background
        const bg = this.add.graphics();
        this.drawMinecraftPanel(bg, -75, -25, 150, 260);

        // Label
        const labelText = this.add.text(0, -5, label, {
            fontSize: '14px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: Phaser.Display.Color.IntegerToColor(color).rgba
        }).setOrigin(0.5);
        labelText.setStroke('#000000', 2);

        // Character preview area (inventory slot)
        const previewBg = this.add.graphics();
        this.drawMinecraftSlot(previewBg, -50, 15, 100, 90);

        // Character sprite placeholder
        const charSprite = this.add.image(0, 60, 'particle_star');
        charSprite.setScale(1.5);
        charSprite.setAlpha(0.3);

        // Character name
        const charName = this.add.text(0, 120, '???', {
            fontSize: '12px',
            fontFamily: 'Courier New, monospace',
            color: '#3f3f3f'
        }).setOrigin(0.5);

        // Ready indicator
        const readyText = this.add.text(0, 200, 'NOT READY', {
            fontSize: '12px',
            fontFamily: 'Courier New, monospace',
            color: '#aa0000'
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

    drawMinecraftPanel(graphics, x, y, width, height) {
        const bgColor = 0xc6c6c6;
        const borderDark = 0x373737;
        const borderLight = 0xffffff;

        // Outer dark border
        graphics.fillStyle(borderDark, 1);
        graphics.fillRect(x, y, width, height);

        // Inner light area
        graphics.fillStyle(bgColor, 1);
        graphics.fillRect(x + 3, y + 3, width - 6, height - 6);

        // Top/left white highlight
        graphics.fillStyle(borderLight, 0.7);
        graphics.fillRect(x + 3, y + 3, width - 6, 2);
        graphics.fillRect(x + 3, y + 3, 2, height - 6);

        // Bottom/right dark shadow
        graphics.fillStyle(borderDark, 0.5);
        graphics.fillRect(x + 3, y + height - 5, width - 6, 2);
        graphics.fillRect(x + width - 5, y + 3, 2, height - 6);
    }

    showCharacterInfo(character) {
        if (this.infoPanel) {
            this.infoPanel.destroy();
        }

        this.infoPanel = this.add.container(950, 470);

        const bg = this.add.graphics();
        this.drawMinecraftPanel(bg, -170, -50, 340, 100);

        const desc = this.add.text(0, -25, character.description, {
            fontSize: '12px',
            fontFamily: 'Courier New, monospace',
            color: '#3f3f3f',
            align: 'center',
            wordWrap: { width: 320 }
        }).setOrigin(0.5);

        const stats = this.add.text(0, 15,
            `SPD: ${'|'.repeat(Math.round(character.speed / 80))}  ` +
            `PWR: ${'|'.repeat(Math.round(character.weight * 3))}  ` +
            `JMP: ${'|'.repeat(Math.round(character.jumpPower * 3))}`, {
            fontSize: '11px',
            fontFamily: 'Courier New, monospace',
            color: '#555555'
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
        panel.charSprite.setScale(1.3);
        panel.charSprite.setAlpha(1);
        panel.charName.setText(character.name);
        panel.readyText.setText('READY!');
        panel.readyText.setColor('#00aa00');
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
        this.add.text(950, y - 25, 'AI DIFFICULTY', {
            fontSize: '14px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: '#3f3f3f'
        }).setOrigin(0.5);

        const difficulties = ['EASY', 'MEDIUM', 'HARD'];
        this.diffButtons = [];

        difficulties.forEach((diff, i) => {
            const x = 860 + i * 90;
            const btn = this.add.container(x, y + 15);

            const bg = this.add.graphics();
            this.drawMinecraftButton(bg, -35, -12, 70, 24, diff === this.aiDifficulty);

            const text = this.add.text(0, 0, diff, {
                fontSize: '11px',
                fontFamily: 'Courier New, monospace',
                color: '#ffffff'
            }).setOrigin(0.5);
            text.setStroke('#3f3f3f', 2);

            btn.add([bg, text]);
            btn.setData('difficulty', diff);
            btn.setData('bg', bg);
            btn.setData('text', text);

            const hitArea = this.add.rectangle(x, y + 15, 70, 24, 0x000000, 0);
            hitArea.setInteractive({ useHandCursor: true });

            hitArea.on('pointerdown', () => {
                this.aiDifficulty = diff;
                this.updateDifficultyButtons();
            });

            this.diffButtons.push({ btn, bg, text, difficulty: diff });
        });
    }

    drawMinecraftButton(graphics, x, y, width, height, selected) {
        const mainColor = selected ? 0x6c8ccc : 0x8b8b8b;
        const lightColor = selected ? 0x9cbcfc : 0xc6c6c6;
        const darkColor = selected ? 0x3c5c9c : 0x555555;

        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(x, y, width, height);

        graphics.fillStyle(mainColor, 1);
        graphics.fillRect(x + 2, y + 2, width - 4, height - 4);

        graphics.fillStyle(lightColor, 1);
        graphics.fillRect(x + 2, y + 2, width - 4, 2);
        graphics.fillRect(x + 2, y + 2, 2, height - 4);

        graphics.fillStyle(darkColor, 1);
        graphics.fillRect(x + 2, y + height - 4, width - 4, 2);
        graphics.fillRect(x + width - 4, y + 2, 2, height - 4);
    }

    updateDifficultyButtons() {
        this.diffButtons.forEach(({ btn, bg, text, difficulty }) => {
            bg.clear();
            this.drawMinecraftButton(bg, -35, -12, 70, 24, difficulty === this.aiDifficulty);
            text.setColor(difficulty === this.aiDifficulty ? '#ffffa0' : '#ffffff');
        });
    }

    createConfirmButton() {
        const btn = this.add.container(950, 545);

        const bg = this.add.graphics();
        this.drawMinecraftButton(bg, -80, -18, 160, 36, false);

        const text = this.add.text(0, 0, 'START BATTLE', {
            fontSize: '14px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        text.setStroke('#3f3f3f', 2);

        btn.add([bg, text]);

        const hitArea = this.add.rectangle(950, 545, 160, 36, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            bg.clear();
            this.drawMinecraftButton(bg, -80, -18, 160, 36, true);
            text.setColor('#ffffa0');
        });
        hitArea.on('pointerout', () => {
            bg.clear();
            this.drawMinecraftButton(bg, -80, -18, 160, 36, false);
            text.setColor('#ffffff');
        });
        hitArea.on('pointerdown', () => this.confirmSelection());
    }

    createBackButton() {
        const btn = this.add.text(50, 25, '< Back', {
            fontSize: '16px',
            fontFamily: 'Courier New, monospace',
            color: '#aaaaaa'
        }).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#ffffff'));
        btn.on('pointerout', () => btn.setColor('#aaaaaa'));
        btn.on('pointerdown', () => this.scene.start('MenuScene'));
    }

    setupInput() {
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });

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

        this.input.keyboard.on('keydown-F', () => {
            this.confirmSelection();
        });
    }

    highlightCharacter(index) {
        if (this.characterBoxes && this.characterBoxes[this.lastHighlightIndex]) {
            this.characterBoxes[this.lastHighlightIndex].container.setScale(1);
        }

        if (this.characterBoxes && this.characterBoxes[index]) {
            this.characterBoxes[index].container.setScale(1.08);
            this.showCharacterInfo(this.characterBoxes[index].character);
            this.lastHighlightIndex = index;
        }
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
