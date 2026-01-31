// Main Game Scene - The Battle Arena
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.gameMode = data.mode;
        this.player1Data = data.player1;
        this.player2Data = data.player2;
        this.currentArena = data.arena;
        this.aiDifficulty = data.aiDifficulty || 'MEDIUM';
    }

    create() {
        // Initialize game state
        this.gameOver = false;
        this.isPaused = false;
        this.countdownActive = true; // Set IMMEDIATELY to prevent any update logic before countdown starts

        // Calculate ground level from arena's main platform
        const mainPlatform = this.currentArena.platforms.find(p => p.type === 'main');
        this.groundY = mainPlatform ? mainPlatform.y - (mainPlatform.height / 2) : 530;

        // Create arena
        this.createArenaBackground();
        this.createPlatforms();
        this.createParticleEffects();

        // Create fighters
        this.createFighters();

        // Setup collisions IMMEDIATELY after fighters (before they fall)
        this.setupCollisions();

        // Create UI
        this.createHUD();

        // Setup input
        this.setupInput();

        // Setup AI if single player
        if (this.gameMode === 'single') {
            this.aiController = new AIController(
                this,
                this.player2,
                this.player1,
                this.aiDifficulty
            );
        }

        // Start game with countdown
        this.startCountdown();
    }

    createArenaBackground() {
        const arena = this.currentArena;

        // Main gradient background
        this.bgGraphics = this.add.graphics();
        this.bgGraphics.fillGradientStyle(
            arena.background.colors[0],
            arena.background.colors[0],
            arena.background.colors[2],
            arena.background.colors[2],
            1
        );
        this.bgGraphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Create theme-specific background effects
        this.createThemeEffects();
    }

    createThemeEffects() {
        const theme = this.currentArena.theme;

        switch (theme) {
            case 'cosmic':
                this.createCosmicBackground();
                break;
            case 'fire':
                this.createFireBackground();
                break;
            case 'ice':
                this.createIceBackground();
                break;
            case 'cyber':
                this.createCyberBackground();
                break;
            case 'sky':
                this.createSkyBackground();
                break;
            default:
                this.createDefaultBackground();
        }
    }

    createCosmicBackground() {
        // Starfield
        for (let i = 0; i < 100; i++) {
            const star = this.add.circle(
                Math.random() * GAME_WIDTH,
                Math.random() * GAME_HEIGHT,
                Math.random() * 2 + 1,
                0xffffff,
                Math.random() * 0.8 + 0.2
            );

            this.tweens.add({
                targets: star,
                alpha: { from: star.alpha, to: star.alpha * 0.3 },
                duration: 1000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1
            });
        }

        // Nebula effect
        for (let i = 0; i < 5; i++) {
            const nebula = this.add.circle(
                Math.random() * GAME_WIDTH,
                Math.random() * GAME_HEIGHT,
                100 + Math.random() * 100,
                [0xff00ff, 0x00ffff, 0xff6600][i % 3],
                0.05
            );
            nebula.setBlendMode('ADD');

            this.tweens.add({
                targets: nebula,
                x: nebula.x + Math.random() * 100 - 50,
                y: nebula.y + Math.random() * 50 - 25,
                alpha: { from: 0.03, to: 0.08 },
                duration: 5000 + Math.random() * 5000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createFireBackground() {
        // Lava glow at bottom
        const lavaGlow = this.add.graphics();
        lavaGlow.fillStyle(0xff4400, 0.3);
        lavaGlow.fillRect(0, GAME_HEIGHT - 150, GAME_WIDTH, 150);

        // Ember particles rising
        this.add.particles(0, 0, 'particle_ember', {
            x: { min: 0, max: GAME_WIDTH },
            y: GAME_HEIGHT,
            lifespan: 4000,
            speed: { min: 50, max: 150 },
            angle: { min: 260, max: 280 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            frequency: 50,
            blendMode: 'ADD'
        });

        // Heat wave effect
        this.heatWave = this.add.graphics();
        this.heatPhase = 0;
    }

    createIceBackground() {
        // Aurora effect
        for (let i = 0; i < 3; i++) {
            const aurora = this.add.graphics();
            aurora.fillStyle([0x00ff88, 0x00ffcc, 0x88ffff][i], 0.1);

            const y = 50 + i * 80;
            aurora.fillRect(0, y, GAME_WIDTH, 60);

            this.tweens.add({
                targets: aurora,
                alpha: { from: 0.05, to: 0.15 },
                duration: 3000 + i * 1000,
                yoyo: true,
                repeat: -1
            });
        }

        // Snowfall
        this.add.particles(0, 0, 'particle_snow', {
            x: { min: 0, max: GAME_WIDTH },
            y: -10,
            lifespan: 8000,
            speedY: { min: 30, max: 80 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.8, end: 0.4 },
            alpha: { start: 0.9, end: 0.3 },
            frequency: 30,
            rotate: { min: 0, max: 360 }
        });
    }

    createCyberBackground() {
        // Grid lines
        const gridGraphics = this.add.graphics();
        gridGraphics.lineStyle(1, 0x00ffff, 0.2);

        for (let x = 0; x < GAME_WIDTH; x += 50) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, GAME_HEIGHT);
        }
        for (let y = 0; y < GAME_HEIGHT; y += 50) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(GAME_WIDTH, y);
        }
        gridGraphics.strokePath();

        // Neon glow pulses
        this.neonPulses = [];
        for (let i = 0; i < 4; i++) {
            const pulse = this.add.rectangle(
                Math.random() * GAME_WIDTH,
                Math.random() * GAME_HEIGHT,
                200,
                2,
                [0xff00ff, 0x00ffff, 0xffff00, 0xff0088][i],
                0.5
            );
            pulse.setBlendMode('ADD');

            this.tweens.add({
                targets: pulse,
                x: Math.random() * GAME_WIDTH,
                alpha: { from: 0.2, to: 0.6 },
                scaleX: { from: 0.5, to: 2 },
                duration: 2000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1
            });

            this.neonPulses.push(pulse);
        }
    }

    createSkyBackground() {
        // Sun
        const sun = this.add.circle(200, 100, 60, 0xffdd00, 0.8);
        sun.setBlendMode('ADD');

        // Sun rays
        for (let i = 0; i < 8; i++) {
            const ray = this.add.rectangle(
                200, 100,
                200, 3,
                0xffff00, 0.3
            );
            ray.setAngle(i * 45);
            ray.setBlendMode('ADD');

            this.tweens.add({
                targets: ray,
                scaleX: { from: 0.8, to: 1.2 },
                alpha: { from: 0.2, to: 0.4 },
                duration: 2000,
                yoyo: true,
                repeat: -1
            });
        }

        // Clouds
        for (let i = 0; i < 5; i++) {
            const cloud = this.createCloud(
                -200 + Math.random() * (GAME_WIDTH + 200),
                50 + Math.random() * 150
            );

            this.tweens.add({
                targets: cloud,
                x: cloud.x + GAME_WIDTH + 400,
                duration: 30000 + Math.random() * 20000,
                repeat: -1
            });
        }
    }

    createCloud(x, y) {
        const cloud = this.add.container(x, y);

        for (let i = 0; i < 5; i++) {
            const puff = this.add.ellipse(
                i * 25 - 50, Math.sin(i) * 10,
                60 + Math.random() * 30,
                40 + Math.random() * 20,
                0xffffff, 0.6
            );
            cloud.add(puff);
        }

        return cloud;
    }

    createDefaultBackground() {
        // Generic particle effect
        this.add.particles(0, 0, 'particle_star', {
            x: { min: 0, max: GAME_WIDTH },
            y: { min: 0, max: GAME_HEIGHT },
            lifespan: 5000,
            speed: 20,
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.6, end: 0 },
            frequency: 200,
            blendMode: 'ADD'
        });
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        this.currentArena.platforms.forEach(platData => {
            const plat = this.createPlatform(platData);
            this.platforms.add(plat);
        });
    }

    createPlatform(data) {
        const { x, y, width, height, type } = data;

        // Create platform graphics
        const graphics = this.add.graphics();

        if (type === 'main') {
            // Main platform - more detailed
            graphics.fillStyle(0x3a3a5a, 1);
            graphics.fillRoundedRect(-width/2, -height/2, width, height, 8);

            // Top surface highlight
            graphics.fillStyle(0x5a5a7a, 1);
            graphics.fillRoundedRect(-width/2 + 5, -height/2 + 3, width - 10, 8, 4);

            // Edge details
            graphics.lineStyle(2, 0x6a6a8a, 0.8);
            graphics.strokeRoundedRect(-width/2, -height/2, width, height, 8);

            // Glow effect
            graphics.lineStyle(4, 0xe94560, 0.3);
            graphics.strokeRoundedRect(-width/2 - 2, -height/2 - 2, width + 4, height + 4, 10);
        } else {
            // Floating platform
            graphics.fillStyle(0x2a4a6a, 1);
            graphics.fillRoundedRect(-width/2, -height/2, width, height, 12);

            // Inner glow
            graphics.fillStyle(0x4a6a8a, 0.5);
            graphics.fillRoundedRect(-width/2 + 5, -height/2 + 3, width - 10, 6, 8);

            // Outline
            graphics.lineStyle(2, 0x5a8aaa, 0.8);
            graphics.strokeRoundedRect(-width/2, -height/2, width, height, 12);
        }

        graphics.setPosition(x, y);

        // Create physics body
        const platform = this.add.zone(x, y, width, height);
        this.physics.add.existing(platform, true);

        // Store reference
        platform.graphics = graphics;
        platform.isPassthrough = type === 'floating';

        return platform;
    }

    createParticleEffects() {
        // Hit effect emitter
        this.hitEmitter = this.add.particles(0, 0, 'particle_spark', {
            speed: { min: 100, max: 300 },
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 300,
            blendMode: 'ADD',
            emitting: false
        });

        // Trail emitter for fast movement
        this.trailEmitter = this.add.particles(0, 0, 'particle_trail', {
            speed: 10,
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.5, end: 0 },
            lifespan: 200,
            blendMode: 'ADD',
            emitting: false
        });
    }

    createFighters() {
        // Find the main platform to determine spawn height
        const mainPlatform = this.currentArena.platforms.find(p => p.type === 'main');
        const platformY = mainPlatform ? mainPlatform.y : 550;
        const platformHeight = mainPlatform ? mainPlatform.height : 40;
        const spawnY = platformY - (platformHeight / 2) - 50; // Spawn above platform surface

        // Spawn positions based on platform width
        const platformX = mainPlatform ? mainPlatform.x : 600;
        const platformWidth = mainPlatform ? mainPlatform.width : 600;
        const spawnX1 = platformX - platformWidth / 4; // Left side of platform
        const spawnX2 = platformX + platformWidth / 4; // Right side of platform

        // Create Player 1
        this.player1 = this.createFighter(spawnX1, spawnY, this.player1Data, 1);

        // Create Player 2
        this.player2 = this.createFighter(spawnX2, spawnY, this.player2Data, 2);

        // Set up fighter references for combat
        this.player1.opponent = this.player2;
        this.player2.opponent = this.player1;
    }

    createFighter(x, y, charData, playerNum) {
        const fighter = this.add.container(x, y);

        // Character sprite - use sprite for animations
        const sprite = this.add.sprite(0, 0, `char_${charData.id}`, 0);
        sprite.setScale(1.5);

        // Direction indicator (facing)
        fighter.facingRight = playerNum === 1;
        if (!fighter.facingRight) sprite.setFlipX(true);

        // Shield effect (hidden initially)
        const shield = this.add.image(0, 0, 'effect_shield');
        shield.setScale(1.5);
        shield.setAlpha(0);
        shield.setBlendMode('ADD');

        // Add to container
        fighter.add([sprite, shield]);

        // Physics
        this.physics.add.existing(fighter);
        fighter.body.setSize(charData.size.width, charData.size.height);
        fighter.body.setOffset(-charData.size.width/2, -charData.size.height/2);
        fighter.body.setCollideWorldBounds(false);
        fighter.body.setGravityY(GRAVITY);
        fighter.body.setMaxVelocity(500, 800);

        // Start with gravity disabled - will be enabled after countdown
        fighter.body.setAllowGravity(false);
        fighter.body.setImmovable(true);

        // Fighter properties
        fighter.characterData = charData;
        fighter.playerNum = playerNum;
        fighter.sprite = sprite;
        fighter.shield = shield;
        fighter.damage = 0;
        fighter.stocks = STARTING_STOCKS;
        fighter.isGrounded = false;
        fighter.canDoubleJump = true;
        fighter.isAttacking = false;
        fighter.isInvincible = true; // Start invincible for spawn protection
        fighter.attackCooldown = 0;
        fighter.specialCooldown = 0;
        fighter.hitstun = 0;
        fighter.currentAnim = 'idle';
        fighter.inputState = {
            left: false, right: false, up: false, down: false,
            jump: false, attack: false, special: false
        };

        // Combo tracking
        fighter.comboCount = 0;
        fighter.lastHitTime = 0;
        fighter.comboText = null;

        // Create projectiles group
        fighter.projectiles = this.physics.add.group();

        // Start idle animation
        sprite.play(`${charData.id}_idle`);

        return fighter;
    }

    createHUD() {
        // Player 1 HUD (left side)
        this.p1HUD = this.createPlayerHUD(30, 20, this.player1, 0x55ff55);

        // Player 2 HUD (right side)
        this.p2HUD = this.createPlayerHUD(GAME_WIDTH - 230, 20, this.player2, 0xff5555);

        // Timer (center) - Minecraft style
        this.timerText = this.add.text(GAME_WIDTH / 2, 30, '∞', {
            fontSize: '28px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.timerText.setStroke('#3f3f3f', 3);
    }

    createPlayerHUD(x, y, fighter, color) {
        const container = this.add.container(x, y);

        // Minecraft-style inventory panel background
        const bg = this.add.graphics();
        this.drawMinecraftHUDPanel(bg, 0, 0, 200, 80);

        // Player label - blocky style
        const label = this.add.text(10, 8, `P${fighter.playerNum}`, {
            fontSize: '14px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: Phaser.Display.Color.IntegerToColor(color).rgba
        });
        label.setStroke('#000000', 2);

        // Character name
        const name = this.add.text(40, 8, fighter.characterData.name, {
            fontSize: '12px',
            fontFamily: 'Courier New, monospace',
            color: '#3f3f3f'
        });

        // Damage percentage - large blocky text
        const damageText = this.add.text(100, 32, '0%', {
            fontSize: '24px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: '#55ff55'
        }).setOrigin(0.5, 0);
        damageText.setStroke('#003300', 3);

        // Stock icons - Minecraft heart style
        const stockContainer = this.add.container(10, 58);
        const stockIcons = [];
        for (let i = 0; i < fighter.stocks; i++) {
            // Draw pixelated heart
            const heart = this.add.graphics();
            this.drawPixelHeart(heart, i * 22, 0, 0xff0000);
            stockContainer.add(heart);
            stockIcons.push(heart);
        }

        container.add([bg, label, name, damageText, stockContainer]);

        return {
            container,
            damageText,
            stockIcons,
            fighter
        };
    }

    drawMinecraftHUDPanel(graphics, x, y, width, height) {
        // Cyber-Minecraft style panel
        const bgColor = 0x0a0a15;
        const borderColor = 0x00ffff;

        // Outer glow
        graphics.fillStyle(borderColor, 0.15);
        graphics.fillRect(x - 2, y - 2, width + 4, height + 4);

        // Dark background
        graphics.fillStyle(0x000000, 0.9);
        graphics.fillRect(x, y, width, height);

        // Inner area
        graphics.fillStyle(bgColor, 0.9);
        graphics.fillRect(x + 2, y + 2, width - 4, height - 4);

        // Neon border
        graphics.fillStyle(borderColor, 0.8);
        graphics.fillRect(x + 2, y + 2, width - 4, 2);
        graphics.fillRect(x + 2, y + height - 4, width - 4, 2);
        graphics.fillRect(x + 2, y + 2, 2, height - 4);
        graphics.fillRect(x + width - 4, y + 2, 2, height - 4);

        // Corner accents
        graphics.fillStyle(0xff00ff, 1);
        graphics.fillRect(x, y, 4, 4);
        graphics.fillRect(x + width - 4, y, 4, 4);
        graphics.fillRect(x, y + height - 4, 4, 4);
        graphics.fillRect(x + width - 4, y + height - 4, 4, 4);
    }

    drawPixelHeart(graphics, x, y, color) {
        // 8x8 pixel heart - cyber neon style
        const pixels = [
            [0,1,1,0,0,1,1,0],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,0,0,0,0,0]
        ];

        const size = 2;

        // Glow effect
        graphics.fillStyle(0xff00ff, 0.3);
        for (let py = 0; py < pixels.length; py++) {
            for (let px = 0; px < pixels[py].length; px++) {
                if (pixels[py][px] === 1) {
                    graphics.fillRect(x + px * size - 1, y + py * size - 1, size + 2, size + 2);
                }
            }
        }

        // Main heart
        graphics.fillStyle(0xff00ff, 1);
        for (let py = 0; py < pixels.length; py++) {
            for (let px = 0; px < pixels[py].length; px++) {
                if (pixels[py][px] === 1) {
                    graphics.fillRect(x + px * size, y + py * size, size, size);
                }
            }
        }

        // Highlight
        graphics.fillStyle(0xffffff, 0.5);
        graphics.fillRect(x + 2, y + 2, 2, 2);
    }

    setupInput() {
        // Player 1 controls (WASD + F/Shift, E/Right Ctrl)
        this.p1Keys = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
            attackAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
            special: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            specialAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT_CONTROL)
        };

        // Player 2 controls (Arrows + Numpad 1/4, Numpad 2/5)
        this.p2Keys = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE),
            attackAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR),
            special: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO),
            specialAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE)
        };

        // Pause
        this.input.keyboard.on('keydown-ESC', () => {
            if (!this.gameOver) {
                this.togglePause();
            }
        });
    }

    setupCollisions() {
        // Fighters with platforms
        this.physics.add.collider(this.player1, this.platforms, this.handlePlatformCollision, null, this);
        this.physics.add.collider(this.player2, this.platforms, this.handlePlatformCollision, null, this);

        // Projectile collisions - set up separately to avoid confusion
        // Player 1's projectiles hit Player 2
        this.physics.add.overlap(
            this.player1.projectiles,
            this.player2,
            (projectile, fighter) => this.handleProjectileHit(projectile, fighter),
            null,
            this
        );

        // Player 2's projectiles hit Player 1
        this.physics.add.overlap(
            this.player2.projectiles,
            this.player1,
            (projectile, fighter) => this.handleProjectileHit(projectile, fighter),
            null,
            this
        );
    }

    handlePlatformCollision(fighter, platform) {
        // Check if it's a passthrough platform
        if (platform.isPassthrough) {
            // Only collide from above
            if (fighter.body.velocity.y < 0 || fighter.inputState.down) {
                platform.body.checkCollision.none = true;
                this.time.delayedCall(100, () => {
                    platform.body.checkCollision.none = false;
                });
                return false;
            }
        }

        fighter.isGrounded = true;
        fighter.canDoubleJump = true;
    }

    handleProjectileHit(obj1, obj2) {
        try {
            // Phaser can swap arguments - identify which is which
            let projectile, fighter;

            if (obj1 && obj1.isProjectile) {
                projectile = obj1;
                fighter = obj2;
            } else if (obj2 && obj2.isProjectile) {
                projectile = obj2;
                fighter = obj1;
            } else {
                // Neither is a projectile, skip
                return;
            }

            if (!projectile || !projectile.active) return;
            if (!fighter || !fighter.body) return;
            if (projectile.hasHit) return;

            // Don't hit the owner of the projectile
            if (projectile.owner === fighter) return;

            // Don't hit invincible fighters
            if (fighter.isInvincible) return;

            // Check fighter has characterData (is actually a fighter)
            if (!fighter.characterData) return;

            projectile.hasHit = true;

            try {
                // Get attack data from projectile
                const damage = projectile.attackDamage || 15;
                const knockback = projectile.attackKnockback || 1.2;
                const direction = projectile.x < fighter.x ? 1 : -1;

                // Apply damage properly
                this.applyDamage(fighter, damage, knockback, direction);
            } catch (e) {
                console.warn('Error applying projectile damage:', e);
            }

            try {
                if (projectile && projectile.active) {
                    projectile.destroy();
                }
            } catch (e) {}
        } catch (e) {
            console.error('Collision error:', e);
        }
    }

    startCountdown() {
        this.countdownActive = true;

        // Completely freeze players during countdown - disable gravity and movement
        [this.player1, this.player2].forEach(fighter => {
            fighter.body.setAllowGravity(false);
            fighter.body.setVelocity(0, 0);
            fighter.body.setImmovable(true);

            // Visual spawn protection effect during countdown
            this.tweens.add({
                targets: fighter.sprite,
                alpha: { from: 0.5, to: 1 },
                duration: 150,
                repeat: 15,
                yoyo: true
            });
        });

        const countdownText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '3', {
            fontSize: '120px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        countdownText.setStroke('#e94560', 8);

        // Countdown animation
        let count = 3;
        const countdownTimer = this.time.addEvent({
            delay: 800,
            callback: () => {
                count--;
                if (count > 0) {
                    countdownText.setText(count.toString());
                    this.tweens.add({
                        targets: countdownText,
                        scaleX: 1.5,
                        scaleY: 1.5,
                        duration: 100,
                        yoyo: true
                    });
                } else if (count === 0) {
                    countdownText.setText('FIGHT!');
                    countdownText.setFontSize(80);
                    this.cameras.main.flash(200, 233, 69, 96);
                } else {
                    countdownText.destroy();
                    this.countdownActive = false;

                    // Re-enable physics for both players
                    [this.player1, this.player2].forEach(fighter => {
                        fighter.body.setImmovable(false);
                        fighter.body.setAllowGravity(true);
                        fighter.body.setVelocity(0, 0);
                    });

                    // Start spawn protection timer after countdown
                    this.startSpawnProtection(this.player1);
                    this.startSpawnProtection(this.player2);
                }
            },
            repeat: 4
        });
    }

    startSpawnProtection(fighter) {
        fighter.isInvincible = true;
        fighter.sprite.setAlpha(1);

        // Show shield visual during spawn protection
        if (fighter.shield) {
            fighter.shield.setAlpha(0.5);
            fighter.shield.setScale(1.8);
        }

        // Flashing effect for spawn protection
        this.tweens.add({
            targets: fighter.sprite,
            alpha: { from: 0.4, to: 1 },
            duration: 150,
            repeat: Math.floor(RESPAWN_INVINCIBILITY / 150),
            yoyo: true,
            onComplete: () => {
                fighter.isInvincible = false;
                fighter.sprite.setAlpha(1);
                if (fighter.shield) {
                    fighter.shield.setAlpha(0);
                }
            }
        });

        // Backup timer to ensure invincibility ends
        this.time.delayedCall(RESPAWN_INVINCIBILITY + 100, () => {
            fighter.isInvincible = false;
            fighter.sprite.setAlpha(1);
            if (fighter.shield) {
                fighter.shield.setAlpha(0);
            }
        });
    }

    update(time, delta) {
        if (this.gameOver || this.isPaused || this.countdownActive) return;

        // Update cooldowns
        this.updateCooldowns(delta);

        // Process input
        this.processInput();

        // Update fighters
        this.updateFighter(this.player1, delta);
        this.updateFighter(this.player2, delta);

        // Update AI
        if (this.aiController) {
            this.aiController.update(time, delta);
        }

        // Check blast zones
        this.checkBlastZones();

        // Update HUD
        this.updateHUD();

        // Check combat
        this.checkCombat();
    }

    updateCooldowns(delta) {
        const currentTime = this.time.now;
        const COMBO_WINDOW = 2000;

        [this.player1, this.player2].forEach(fighter => {
            if (fighter.attackCooldown > 0) fighter.attackCooldown -= delta;
            if (fighter.specialCooldown > 0) fighter.specialCooldown -= delta;
            if (fighter.hitstun > 0) fighter.hitstun -= delta;

            // Reset combo if window expired
            if (fighter.comboCount > 0 && currentTime - fighter.lastHitTime > COMBO_WINDOW) {
                fighter.comboCount = 0;
            }
        });
    }

    processInput() {
        // Player 1
        this.player1.inputState = {
            left: this.p1Keys.left.isDown,
            right: this.p1Keys.right.isDown,
            up: this.p1Keys.up.isDown,
            down: this.p1Keys.down.isDown,
            jump: Phaser.Input.Keyboard.JustDown(this.p1Keys.up),
            attack: Phaser.Input.Keyboard.JustDown(this.p1Keys.attack) || Phaser.Input.Keyboard.JustDown(this.p1Keys.attackAlt),
            special: Phaser.Input.Keyboard.JustDown(this.p1Keys.special) || Phaser.Input.Keyboard.JustDown(this.p1Keys.specialAlt)
        };

        // Player 2 (if not AI)
        if (this.gameMode !== 'single') {
            this.player2.inputState = {
                left: this.p2Keys.left.isDown,
                right: this.p2Keys.right.isDown,
                up: this.p2Keys.up.isDown,
                down: this.p2Keys.down.isDown,
                jump: Phaser.Input.Keyboard.JustDown(this.p2Keys.up),
                attack: Phaser.Input.Keyboard.JustDown(this.p2Keys.attack) || Phaser.Input.Keyboard.JustDown(this.p2Keys.attackAlt),
                special: Phaser.Input.Keyboard.JustDown(this.p2Keys.special) || Phaser.Input.Keyboard.JustDown(this.p2Keys.specialAlt)
            };
        }
    }

    updateFighter(fighter, delta) {
        const input = fighter.inputState;
        const char = fighter.characterData;
        const charId = char.id;

        // Skip if in hitstun
        if (fighter.hitstun > 0) {
            fighter.sprite.setTint(0xff0000);
            this.playAnimation(fighter, 'hurt');
            return;
        } else {
            fighter.sprite.clearTint();
        }

        // Movement
        const speed = char.speed * (fighter.isGrounded ? 1 : AIR_CONTROL);

        if (input.left) {
            fighter.body.setVelocityX(-speed);
            fighter.facingRight = false;
            fighter.sprite.setFlipX(true);
        } else if (input.right) {
            fighter.body.setVelocityX(speed);
            fighter.facingRight = true;
            fighter.sprite.setFlipX(false);
        } else {
            // Apply friction
            fighter.body.setVelocityX(fighter.body.velocity.x * GROUND_FRICTION);
        }

        // Jumping
        if (input.jump || input.up) {
            if (fighter.isGrounded) {
                fighter.body.setVelocityY(JUMP_VELOCITY * char.jumpPower);
                fighter.isGrounded = false;
                this.createJumpEffect(fighter);
                this.playAnimation(fighter, 'jump');
            } else if (fighter.canDoubleJump) {
                fighter.body.setVelocityY(DOUBLE_JUMP_VELOCITY * char.jumpPower);
                fighter.canDoubleJump = false;
                this.createJumpEffect(fighter);
                this.playAnimation(fighter, 'jump');
            }
        }

        // Fast fall
        if (input.down && !fighter.isGrounded && fighter.body.velocity.y > 0) {
            fighter.body.setVelocityY(fighter.body.velocity.y + 20);
        }

        // Attacks
        if (input.attack && fighter.attackCooldown <= 0) {
            this.performAttack(fighter, 'normal');
        }

        if (input.special && fighter.specialCooldown <= 0) {
            this.performAttack(fighter, 'special');
        }

        // Check if grounded
        fighter.isGrounded = fighter.body.blocked.down || fighter.body.touching.down;

        // Update animation based on state (if not attacking)
        if (!fighter.isAttacking) {
            if (!fighter.isGrounded) {
                this.playAnimation(fighter, 'jump');
            } else if (Math.abs(fighter.body.velocity.x) > 20) {
                this.playAnimation(fighter, 'walk');
            } else {
                this.playAnimation(fighter, 'idle');
            }
        }

        // Movement trail for fast movement
        if (Math.abs(fighter.body.velocity.x) > 200 || Math.abs(fighter.body.velocity.y) > 300) {
            this.trailEmitter.setPosition(fighter.x, fighter.y);
            this.trailEmitter.setParticleTint(fighter.characterData.color);
            this.trailEmitter.emitParticle(1);
        }
    }

    playAnimation(fighter, animName) {
        const charId = fighter.characterData.id;
        const animKey = `${charId}_${animName}`;

        if (fighter.currentAnim !== animName) {
            fighter.currentAnim = animName;
            fighter.sprite.play(animKey, true);
        }
    }

    createJumpEffect(fighter) {
        // Dust particles
        for (let i = 0; i < 5; i++) {
            const dust = this.add.circle(
                fighter.x + (Math.random() - 0.5) * 30,
                fighter.y + 30,
                5 + Math.random() * 5,
                0xffffff,
                0.6
            );

            this.tweens.add({
                targets: dust,
                y: dust.y + 20,
                alpha: 0,
                scale: 0,
                duration: 300,
                onComplete: () => dust.destroy()
            });
        }
    }

    performAttack(fighter, type) {
        const attack = fighter.characterData.attacks[type];
        fighter.isAttacking = true;

        if (type === 'normal') {
            fighter.attackCooldown = ATTACK_COOLDOWN;
            this.playAnimation(fighter, 'attack');
            this.createMeleeAttack(fighter, attack);
        } else {
            fighter.specialCooldown = SPECIAL_COOLDOWN;
            this.playAnimation(fighter, 'special');
            this.createSpecialAttack(fighter, attack);
        }

        // End attack after duration
        this.time.delayedCall(attack.duration * 16, () => {
            fighter.isAttacking = false;
            fighter.currentAnim = ''; // Force animation update
        });
    }

    createMeleeAttack(fighter, attack) {
        const direction = fighter.facingRight ? 1 : -1;

        // Visual effect
        const slash = this.add.image(
            fighter.x + direction * 30,
            fighter.y,
            'effect_slash'
        );
        slash.setFlipX(!fighter.facingRight);
        slash.setBlendMode('ADD');
        slash.setTint(fighter.characterData.color);

        this.tweens.add({
            targets: slash,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 200,
            onComplete: () => slash.destroy()
        });

        // Check hit
        const hitbox = {
            x: fighter.x + direction * attack.range / 2,
            y: fighter.y,
            width: attack.range,
            height: 50
        };

        const opponent = fighter.opponent;
        if (this.checkHitbox(hitbox, opponent) && !opponent.isInvincible) {
            this.applyDamage(opponent, attack.damage, attack.knockback, direction);
        }
    }

    createSpecialAttack(fighter, attack) {
        const direction = fighter.facingRight ? 1 : -1;
        const attackType = attack.type || 'default';

        // Execute unique attack based on type
        switch (attackType) {
            case 'dash':
                this.createDashAttack(fighter, attack, direction);
                break;
            case 'smash':
                this.createSmashAttack(fighter, attack, direction);
                break;
            case 'uppercut':
                this.createUppercutAttack(fighter, attack, direction);
                break;
            case 'shuriken':
                this.createShurikenAttack(fighter, attack, direction);
                break;
            case 'fireball':
                this.createFireballAttack(fighter, attack, direction);
                break;
            case 'laser':
                this.createLaserAttack(fighter, attack, direction);
                break;
            case 'pistol':
                this.createPistolAttack(fighter, attack, direction);
                break;
            case 'ice':
                this.createIceAttack(fighter, attack, direction);
                break;
            case 'inferno':
                this.createInfernoAttack(fighter, attack, direction);
                break;
            case 'holy':
                this.createHolyAttack(fighter, attack, direction);
                break;
            case 'shadow':
                this.createShadowAttack(fighter, attack, direction);
                break;
            case 'roar':
                this.createRoarAttack(fighter, attack, direction);
                break;
            case 'nature':
                this.createNatureAttack(fighter, attack, direction);
                break;
            case 'shield':
                this.createShieldAttack(fighter, attack, direction);
                break;
            case 'hack':
                this.createHackAttack(fighter, attack, direction);
                break;
            case 'railgun':
                this.createRailgunAttack(fighter, attack, direction);
                break;
            case 'bomb':
                this.createBombAttack(fighter, attack, direction);
                break;
            case 'lightning':
                this.createLightningAttack(fighter, attack, direction);
                break;
            case 'earthquake':
                this.createEarthquakeAttack(fighter, attack, direction);
                break;
            case 'slash':
                this.createSlashAttack(fighter, attack, direction);
                break;
            default:
                this.createDefaultProjectile(fighter, attack, direction);
        }
    }

    // DASH - Speed burst with afterimages
    createDashAttack(fighter, attack, direction) {
        const startX = fighter.x;
        const dashDistance = attack.range;

        // Create afterimages
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 30, () => {
                const afterimage = this.add.image(fighter.x, fighter.y, `char_${fighter.characterData.id}`);
                afterimage.setScale(1.5);
                afterimage.setAlpha(0.6 - i * 0.1);
                afterimage.setTint(0x00ffff);
                afterimage.setBlendMode('ADD');
                afterimage.setFlipX(!fighter.facingRight);

                this.tweens.add({
                    targets: afterimage,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => afterimage.destroy()
                });
            });
        }

        // Dash movement
        fighter.body.setVelocityX(direction * 800);
        this.time.delayedCall(150, () => {
            fighter.body.setVelocityX(direction * 100);
        });

        // Hit detection during dash
        const checkHits = this.time.addEvent({
            delay: 30,
            repeat: 4,
            callback: () => {
                const opponent = fighter.opponent;
                if (!opponent.isInvincible && !opponent.dashHit) {
                    const dist = Phaser.Math.Distance.Between(fighter.x, fighter.y, opponent.x, opponent.y);
                    if (dist < 60) {
                        opponent.dashHit = true;
                        this.applyDamage(opponent, attack.damage / 3, attack.knockback * 0.5, direction);
                        this.createHitSpark(opponent.x, opponent.y, 0x00ffff);
                    }
                }
            }
        });

        this.time.delayedCall(200, () => {
            if (fighter.opponent) fighter.opponent.dashHit = false;
        });
    }

    // SMASH - Ground pound with shockwave
    createSmashAttack(fighter, attack, direction) {
        // Jump up first
        fighter.body.setVelocityY(-300);

        this.time.delayedCall(200, () => {
            // Slam down
            fighter.body.setVelocityY(600);

            // Wait for ground impact
            this.time.delayedCall(150, () => {
                // Shockwave effect
                const shockwave = this.add.circle(fighter.x, fighter.y + 30, 10, 0x4488ff, 0.8);
                shockwave.setBlendMode('ADD');

                this.tweens.add({
                    targets: shockwave,
                    scaleX: 15,
                    scaleY: 3,
                    alpha: 0,
                    duration: 400,
                    onComplete: () => shockwave.destroy()
                });

                // Ground crack lines
                for (let i = 0; i < 8; i++) {
                    const crack = this.add.rectangle(
                        fighter.x + (i - 4) * 30,
                        fighter.y + 35,
                        4, 20, 0xffff00
                    );
                    crack.setBlendMode('ADD');
                    this.tweens.add({
                        targets: crack,
                        y: crack.y - 30,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => crack.destroy()
                    });
                }

                // Camera shake
                this.cameras.main.shake(200, 0.02);

                // Damage in area
                const opponent = fighter.opponent;
                if (!opponent.isInvincible) {
                    const dist = Math.abs(opponent.x - fighter.x);
                    if (dist < attack.range && opponent.y > fighter.y - 50) {
                        this.applyDamage(opponent, attack.damage, attack.knockback, opponent.x > fighter.x ? 1 : -1);
                    }
                }
            });
        });
    }

    // UPPERCUT - Rising attack with fire trail
    createUppercutAttack(fighter, attack, direction) {
        // Launch upward
        fighter.body.setVelocityY(-500);
        fighter.body.setVelocityX(direction * 200);

        // Fire trail
        const trailEvent = this.time.addEvent({
            delay: 30,
            repeat: 8,
            callback: () => {
                const flame = this.add.circle(
                    fighter.x + (Math.random() - 0.5) * 20,
                    fighter.y + 20,
                    8 + Math.random() * 8,
                    0xff8800
                );
                flame.setBlendMode('ADD');

                this.tweens.add({
                    targets: flame,
                    y: flame.y + 40,
                    scaleX: 0,
                    scaleY: 0,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => flame.destroy()
                });
            }
        });

        // Hit detection
        const hitCheck = this.time.addEvent({
            delay: 50,
            repeat: 5,
            callback: () => {
                const opponent = fighter.opponent;
                if (!opponent.isInvincible && !opponent.uppercutHit) {
                    const dist = Phaser.Math.Distance.Between(fighter.x, fighter.y, opponent.x, opponent.y);
                    if (dist < 70) {
                        opponent.uppercutHit = true;
                        opponent.body.setVelocityY(-400);
                        this.applyDamage(opponent, attack.damage, attack.knockback, direction);
                    }
                }
            }
        });

        this.time.delayedCall(400, () => {
            if (fighter.opponent) fighter.opponent.uppercutHit = false;
        });
    }

    // SHURIKEN - Multiple throwing stars in spread
    createShurikenAttack(fighter, attack, direction) {
        const angles = [-20, 0, 20];

        angles.forEach((angle, i) => {
            this.time.delayedCall(i * 80, () => {
                const shuriken = this.add.star(fighter.x + direction * 30, fighter.y, 4, 5, 12, 0xaa00ff);
                this.physics.add.existing(shuriken);

                shuriken.isProjectile = true;
                shuriken.hasHit = false;
                shuriken.owner = fighter;
                shuriken.attackDamage = attack.damage / 2;
                shuriken.attackKnockback = attack.knockback * 0.7;
                shuriken.setBlendMode('ADD');

                // Set proper body size for collision
                shuriken.body.setSize(24, 24);
                shuriken.body.setOffset(-12, -12);

                fighter.projectiles.add(shuriken);

                const rad = Phaser.Math.DegToRad(angle);
                const speed = 450;
                shuriken.body.setAllowGravity(false);
                shuriken.body.setVelocity(
                    Math.cos(rad) * speed * direction,
                    Math.sin(rad) * speed
                );

                // Spin animation
                this.tweens.add({
                    targets: shuriken,
                    angle: 720 * direction,
                    duration: 500
                });

                this.time.delayedCall(1500, () => {
                    if (shuriken && shuriken.active) shuriken.destroy();
                });
            });
        });
    }

    // FIREBALL - Big exploding projectile
    createFireballAttack(fighter, attack, direction) {
        const fireball = this.add.circle(fighter.x + direction * 40, fighter.y, 20, 0xff00ff);
        this.physics.add.existing(fireball);

        fireball.isProjectile = true;
        fireball.hasHit = false;
        fireball.owner = fighter;
        fireball.attackDamage = attack.damage;
        fireball.attackKnockback = attack.knockback;
        fireball.setBlendMode('ADD');

        // Set circular physics body for proper collision
        fireball.body.setCircle(20);

        fighter.projectiles.add(fireball);
        fireball.body.setAllowGravity(false);
        fireball.body.setVelocityX(direction * 300);

        // Pulsing effect
        this.tweens.add({
            targets: fireball,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 100,
            yoyo: true,
            repeat: -1
        });

        // Trail particles
        const trailEvent = this.time.addEvent({
            delay: 50,
            repeat: 30,
            callback: () => {
                if (!fireball.active) return;
                const trail = this.add.circle(fireball.x, fireball.y, 8 + Math.random() * 8, 0x8800ff);
                trail.setBlendMode('ADD');
                this.tweens.add({
                    targets: trail,
                    scale: 0,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => trail.destroy()
                });
            }
        });

        // Explosion on hit or timeout
        const explode = () => {
            if (!fireball.active) return;
            // Explosion circle
            const explosion = this.add.circle(fireball.x, fireball.y, 20, 0xff00ff, 0.8);
            explosion.setBlendMode('ADD');
            this.tweens.add({
                targets: explosion,
                scale: 4,
                alpha: 0,
                duration: 300,
                onComplete: () => explosion.destroy()
            });

            // Damage nearby
            const opponent = fighter.opponent;
            if (!opponent.isInvincible) {
                const dist = Phaser.Math.Distance.Between(fireball.x, fireball.y, opponent.x, opponent.y);
                if (dist < 80) {
                    this.applyDamage(opponent, attack.damage * 0.5, attack.knockback * 0.8, direction);
                }
            }

            this.cameras.main.shake(100, 0.01);
            fireball.destroy();
        };

        fireball.explode = explode;
        this.time.delayedCall(2000, explode);
    }

    // LASER - Instant piercing beam
    createLaserAttack(fighter, attack, direction) {
        const beamLength = attack.range;

        // Charge up effect
        const charge = this.add.circle(fighter.x + direction * 30, fighter.y, 5, 0x00ffff);
        charge.setBlendMode('ADD');

        this.tweens.add({
            targets: charge,
            scale: 3,
            duration: 200,
            onComplete: () => {
                charge.destroy();

                // Fire beam
                const beam = this.add.rectangle(
                    fighter.x + direction * (beamLength / 2 + 30),
                    fighter.y,
                    beamLength,
                    8,
                    0x00ffff
                );
                beam.setBlendMode('ADD');

                // Beam glow
                const beamGlow = this.add.rectangle(
                    beam.x, beam.y,
                    beamLength, 20,
                    0x00ffff, 0.3
                );
                beamGlow.setBlendMode('ADD');

                // Hit detection along beam
                const opponent = fighter.opponent;
                if (!opponent.isInvincible) {
                    const inBeamX = direction > 0
                        ? (opponent.x > fighter.x && opponent.x < fighter.x + beamLength)
                        : (opponent.x < fighter.x && opponent.x > fighter.x - beamLength);
                    const inBeamY = Math.abs(opponent.y - fighter.y) < 40;

                    if (inBeamX && inBeamY) {
                        this.applyDamage(opponent, attack.damage, attack.knockback, direction);
                        this.createHitSpark(opponent.x, opponent.y, 0x00ffff);
                    }
                }

                // Beam fade
                this.tweens.add({
                    targets: [beam, beamGlow],
                    alpha: 0,
                    scaleY: 0,
                    duration: 150,
                    onComplete: () => {
                        beam.destroy();
                        beamGlow.destroy();
                    }
                });
            }
        });
    }

    // PISTOL - Rapid fire shots
    createPistolAttack(fighter, attack, direction) {
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 80, () => {
                const bullet = this.add.rectangle(
                    fighter.x + direction * 40,
                    fighter.y + (Math.random() - 0.5) * 10,
                    12, 4, 0xffff00
                );
                this.physics.add.existing(bullet);

                bullet.isProjectile = true;
                bullet.hasHit = false;
                bullet.owner = fighter;
                bullet.attackDamage = attack.damage / 4;
                bullet.attackKnockback = attack.knockback * 0.3;
                bullet.setBlendMode('ADD');

                // Set proper body size for collision
                bullet.body.setSize(12, 4);

                fighter.projectiles.add(bullet);
                bullet.body.setAllowGravity(false);
                bullet.body.setVelocityX(direction * 600);

                // Muzzle flash
                const flash = this.add.circle(fighter.x + direction * 35, fighter.y, 15, 0xffff00, 0.8);
                flash.setBlendMode('ADD');
                this.tweens.add({
                    targets: flash,
                    scale: 0,
                    alpha: 0,
                    duration: 100,
                    onComplete: () => flash.destroy()
                });

                this.time.delayedCall(1000, () => {
                    if (bullet && bullet.active) bullet.destroy();
                });
            });
        }
    }

    // ICE - Freezing projectile
    createIceAttack(fighter, attack, direction) {
        const iceSpike = this.add.polygon(fighter.x + direction * 40, fighter.y, [
            0, -15, 10, 15, -10, 15
        ], 0x00ddff);
        iceSpike.setRotation(direction > 0 ? Math.PI / 2 : -Math.PI / 2);
        this.physics.add.existing(iceSpike);

        iceSpike.isProjectile = true;
        iceSpike.hasHit = false;
        iceSpike.owner = fighter;
        iceSpike.attackDamage = attack.damage;
        iceSpike.attackKnockback = attack.knockback;
        iceSpike.isIce = true;
        iceSpike.setBlendMode('ADD');

        // Set proper body size for collision
        iceSpike.body.setSize(30, 20);
        iceSpike.body.setOffset(-15, -10);

        fighter.projectiles.add(iceSpike);
        iceSpike.body.setAllowGravity(false);
        iceSpike.body.setVelocityX(direction * 350);

        // Ice trail
        const trailEvent = this.time.addEvent({
            delay: 40,
            repeat: 25,
            callback: () => {
                if (!iceSpike.active) return;
                const crystal = this.add.star(iceSpike.x, iceSpike.y, 6, 3, 6, 0xaaffff);
                crystal.setBlendMode('ADD');
                crystal.setAlpha(0.6);
                this.tweens.add({
                    targets: crystal,
                    scale: 0,
                    alpha: 0,
                    angle: 180,
                    duration: 300,
                    onComplete: () => crystal.destroy()
                });
            }
        });

        this.time.delayedCall(2000, () => {
            if (iceSpike && iceSpike.active) iceSpike.destroy();
        });
    }

    // INFERNO - Explosive area burst
    createInfernoAttack(fighter, attack, direction) {
        // Charge effect
        const chargeRing = this.add.circle(fighter.x, fighter.y, 20, 0xff0044, 0);
        chargeRing.setStrokeStyle(3, 0xff0044);

        this.tweens.add({
            targets: chargeRing,
            scale: 2,
            alpha: 1,
            duration: 300,
            onComplete: () => {
                chargeRing.destroy();

                // Explosion burst
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    const flame = this.add.circle(fighter.x, fighter.y, 15, 0xff4400);
                    flame.setBlendMode('ADD');

                    this.tweens.add({
                        targets: flame,
                        x: fighter.x + Math.cos(angle) * attack.range,
                        y: fighter.y + Math.sin(angle) * attack.range,
                        scale: 0.3,
                        alpha: 0,
                        duration: 400,
                        onComplete: () => flame.destroy()
                    });
                }

                // Center explosion
                const explosion = this.add.circle(fighter.x, fighter.y, 30, 0xff8800);
                explosion.setBlendMode('ADD');
                this.tweens.add({
                    targets: explosion,
                    scale: 4,
                    alpha: 0,
                    duration: 400,
                    onComplete: () => explosion.destroy()
                });

                this.cameras.main.shake(200, 0.015);

                // Damage in radius
                const opponent = fighter.opponent;
                if (!opponent.isInvincible) {
                    const dist = Phaser.Math.Distance.Between(fighter.x, fighter.y, opponent.x, opponent.y);
                    if (dist < attack.range) {
                        const knockDir = opponent.x > fighter.x ? 1 : -1;
                        this.applyDamage(opponent, attack.damage, attack.knockback, knockDir);
                    }
                }
            }
        });
    }

    // HOLY - Light beam with heal
    createHolyAttack(fighter, attack, direction) {
        // Heal self slightly
        fighter.damage = Math.max(0, fighter.damage - 5);

        // Light pillar on opponent
        const opponent = fighter.opponent;
        const targetX = opponent.x;

        // Warning circle
        const warning = this.add.circle(targetX, opponent.y + 30, 40, 0xffffff, 0.3);

        this.tweens.add({
            targets: warning,
            alpha: 0.8,
            duration: 400,
            yoyo: true,
            onComplete: () => {
                warning.destroy();

                // Light beam from above
                const beam = this.add.rectangle(targetX, -100, 60, 800, 0xaaffff, 0.8);
                beam.setBlendMode('ADD');

                this.tweens.add({
                    targets: beam,
                    y: 300,
                    duration: 200,
                    onComplete: () => {
                        // Hit check
                        if (!opponent.isInvincible && Math.abs(opponent.x - targetX) < 50) {
                            this.applyDamage(opponent, attack.damage, attack.knockback, direction);
                        }

                        this.tweens.add({
                            targets: beam,
                            alpha: 0,
                            duration: 200,
                            onComplete: () => beam.destroy()
                        });
                    }
                });

                // Sparkles
                for (let i = 0; i < 10; i++) {
                    const sparkle = this.add.star(
                        targetX + (Math.random() - 0.5) * 80,
                        300 + Math.random() * 200,
                        4, 3, 8, 0xffffff
                    );
                    sparkle.setBlendMode('ADD');
                    this.tweens.add({
                        targets: sparkle,
                        y: sparkle.y - 100,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => sparkle.destroy()
                    });
                }
            }
        });
    }

    // SHADOW - Teleport behind and strike
    createShadowAttack(fighter, attack, direction) {
        const opponent = fighter.opponent;
        const startX = fighter.x;
        const startY = fighter.y;

        // Vanish effect
        fighter.sprite.setAlpha(0);
        const vanishEffect = this.add.circle(startX, startY, 30, 0x8800ff);
        vanishEffect.setBlendMode('ADD');
        this.tweens.add({
            targets: vanishEffect,
            scale: 0,
            duration: 200,
            onComplete: () => vanishEffect.destroy()
        });

        // Teleport behind opponent
        this.time.delayedCall(200, () => {
            const behindX = opponent.x - direction * 60;
            fighter.x = behindX;
            fighter.y = opponent.y;

            // Reappear effect
            const appearEffect = this.add.circle(fighter.x, fighter.y, 5, 0x8800ff);
            appearEffect.setBlendMode('ADD');
            this.tweens.add({
                targets: appearEffect,
                scale: 6,
                alpha: 0,
                duration: 200,
                onComplete: () => appearEffect.destroy()
            });

            fighter.sprite.setAlpha(1);
            fighter.facingRight = opponent.x > fighter.x;
            fighter.sprite.setFlipX(!fighter.facingRight);

            // Strike
            if (!opponent.isInvincible) {
                const newDir = fighter.facingRight ? 1 : -1;
                this.applyDamage(opponent, attack.damage, attack.knockback, newDir);
                this.createHitSpark(opponent.x, opponent.y, 0x8800ff);
            }
        });
    }

    // ROAR - Area knockback wave
    createRoarAttack(fighter, attack, direction) {
        // Roar rings
        for (let i = 0; i < 4; i++) {
            this.time.delayedCall(i * 80, () => {
                const ring = this.add.circle(fighter.x, fighter.y, 20, 0x00ff44, 0);
                ring.setStrokeStyle(4, 0x00ff44);
                ring.setBlendMode('ADD');

                this.tweens.add({
                    targets: ring,
                    scale: 5,
                    alpha: 0,
                    duration: 400,
                    onComplete: () => ring.destroy()
                });
            });
        }

        // Screen shake
        this.cameras.main.shake(300, 0.015);

        // Knockback in radius
        const opponent = fighter.opponent;
        if (!opponent.isInvincible) {
            const dist = Phaser.Math.Distance.Between(fighter.x, fighter.y, opponent.x, opponent.y);
            if (dist < attack.range) {
                const knockDir = opponent.x > fighter.x ? 1 : -1;
                this.applyDamage(opponent, attack.damage, attack.knockback * 1.5, knockDir);
                opponent.body.setVelocityY(-300);
            }
        }
    }

    // NATURE - Vine trap
    createNatureAttack(fighter, attack, direction) {
        const trapX = fighter.x + direction * 100;

        // Seed projectile
        const seed = this.add.circle(fighter.x + direction * 30, fighter.y, 8, 0x00ff88);
        this.physics.add.existing(seed);
        seed.body.setVelocityX(direction * 300);
        seed.body.setGravityY(500);

        this.tweens.add({
            targets: seed,
            angle: 360 * direction,
            duration: 500,
            repeat: -1
        });

        // Check for ground contact
        const groundY = this.groundY;
        const groundCheck = this.time.addEvent({
            delay: 50,
            repeat: 20,
            callback: () => {
                if (seed.y > groundY - 10) {
                    groundCheck.remove();
                    seed.destroy();

                    // Spawn vines
                    for (let i = 0; i < 5; i++) {
                        const vine = this.add.rectangle(
                            seed.x + (i - 2) * 15,
                            groundY,
                            6, 0, 0x00ff44
                        );
                        vine.setOrigin(0.5, 1);

                        this.tweens.add({
                            targets: vine,
                            height: 60 + Math.random() * 30,
                            duration: 200,
                            delay: i * 50
                        });

                        this.time.delayedCall(2000, () => {
                            this.tweens.add({
                                targets: vine,
                                height: 0,
                                alpha: 0,
                                duration: 200,
                                onComplete: () => vine.destroy()
                            });
                        });
                    }

                    // Trap damage check
                    const trapCheck = this.time.addEvent({
                        delay: 100,
                        repeat: 18,
                        callback: () => {
                            const opponent = fighter.opponent;
                            if (!opponent.isInvincible && !opponent.vineHit) {
                                if (Math.abs(opponent.x - seed.x) < 50 && opponent.y > groundY - 50) {
                                    opponent.vineHit = true;
                                    this.applyDamage(opponent, attack.damage, attack.knockback * 0.5, direction);
                                    opponent.body.setVelocityX(0);
                                    this.time.delayedCall(500, () => { opponent.vineHit = false; });
                                }
                            }
                        }
                    });
                }
            }
        });

        this.time.delayedCall(1500, () => {
            if (seed && seed.active) seed.destroy();
        });
    }

    // SHIELD - Reflective shield bash
    createShieldAttack(fighter, attack, direction) {
        // Shield visual
        const shield = this.add.ellipse(
            fighter.x + direction * 35,
            fighter.y,
            25, 50, 0xffaa00
        );
        shield.setStrokeStyle(4, 0xffffff);

        // Shield glow
        const glow = this.add.ellipse(
            shield.x, shield.y,
            35, 60, 0xffaa00, 0.3
        );
        glow.setBlendMode('ADD');

        // Shield active period
        fighter.hasShield = true;

        // Check for projectile reflection
        const reflectCheck = this.time.addEvent({
            delay: 50,
            repeat: 10,
            callback: () => {
                // Check opponent projectiles
                const opponent = fighter.opponent;
                opponent.projectiles.getChildren().forEach(proj => {
                    if (proj.active && !proj.reflected) {
                        const dist = Phaser.Math.Distance.Between(shield.x, shield.y, proj.x, proj.y);
                        if (dist < 50) {
                            proj.reflected = true;
                            proj.owner = fighter;
                            proj.body.setVelocityX(-proj.body.velocity.x * 1.5);
                            proj.setTint(0xffaa00);

                            // Reflection flash
                            const flash = this.add.circle(proj.x, proj.y, 20, 0xffffff);
                            flash.setBlendMode('ADD');
                            this.tweens.add({
                                targets: flash,
                                scale: 0,
                                duration: 100,
                                onComplete: () => flash.destroy()
                            });
                        }
                    }
                });
            }
        });

        // Bash forward
        this.time.delayedCall(300, () => {
            fighter.hasShield = false;

            this.tweens.add({
                targets: [shield, glow],
                x: shield.x + direction * 60,
                duration: 100,
                onComplete: () => {
                    // Bash damage
                    const opponent = fighter.opponent;
                    if (!opponent.isInvincible) {
                        const dist = Phaser.Math.Distance.Between(shield.x, shield.y, opponent.x, opponent.y);
                        if (dist < 70) {
                            this.applyDamage(opponent, attack.damage, attack.knockback, direction);
                        }
                    }

                    this.tweens.add({
                        targets: [shield, glow],
                        alpha: 0,
                        duration: 150,
                        onComplete: () => {
                            shield.destroy();
                            glow.destroy();
                        }
                    });
                }
            });
        });
    }

    // HACK - Deploy trap
    createHackAttack(fighter, attack, direction) {
        const trapX = fighter.x + direction * 80;
        const groundY = this.groundY;

        // Deploy animation
        const deployEffect = this.add.circle(fighter.x, fighter.y, 10, 0x00ff00);
        deployEffect.setBlendMode('ADD');

        this.tweens.add({
            targets: deployEffect,
            x: trapX,
            y: groundY,
            duration: 300,
            onComplete: () => {
                deployEffect.destroy();

                // Trap visual - glitchy square
                const trap = this.add.rectangle(trapX, groundY, 40, 10, 0x00ff00, 0.6);
                const trapGlow = this.add.rectangle(trapX, groundY, 50, 15, 0x00ff00, 0.2);
                trapGlow.setBlendMode('ADD');

                // Glitch effect
                this.tweens.add({
                    targets: trap,
                    scaleX: { from: 0.9, to: 1.1 },
                    duration: 100,
                    yoyo: true,
                    repeat: -1
                });

                // Trap trigger check
                const trapCheck = this.time.addEvent({
                    delay: 100,
                    repeat: 50,
                    callback: () => {
                        const opponent = fighter.opponent;
                        if (!opponent.isInvincible && !opponent.hacked) {
                            if (Math.abs(opponent.x - trapX) < 40 && opponent.y > groundY - 50) {
                                opponent.hacked = true;

                                // Hack effect - glitch on opponent
                                this.applyDamage(opponent, attack.damage, attack.knockback * 0.3, direction);

                                // Stun with glitch visuals
                                opponent.body.setVelocity(0, 0);
                                opponent.hitstun = 800;

                                for (let i = 0; i < 8; i++) {
                                    this.time.delayedCall(i * 80, () => {
                                        const glitch = this.add.rectangle(
                                            opponent.x + (Math.random() - 0.5) * 40,
                                            opponent.y + (Math.random() - 0.5) * 60,
                                            20 + Math.random() * 30, 4, 0x00ff00
                                        );
                                        glitch.setBlendMode('ADD');
                                        this.tweens.add({
                                            targets: glitch,
                                            alpha: 0,
                                            duration: 100,
                                            onComplete: () => glitch.destroy()
                                        });
                                    });
                                }

                                trap.destroy();
                                trapGlow.destroy();
                                trapCheck.remove();

                                this.time.delayedCall(1000, () => { opponent.hacked = false; });
                            }
                        }
                    }
                });

                // Trap expires
                this.time.delayedCall(5000, () => {
                    if (trap.active) {
                        this.tweens.add({
                            targets: [trap, trapGlow],
                            alpha: 0,
                            duration: 200,
                            onComplete: () => {
                                trap.destroy();
                                trapGlow.destroy();
                            }
                        });
                    }
                });
            }
        });
    }

    // RAILGUN - Super fast piercing shot
    createRailgunAttack(fighter, attack, direction) {
        // Long charge up
        const chargeBar = this.add.rectangle(fighter.x, fighter.y - 50, 0, 8, 0xff4400);

        // Charge particles
        const chargeEvent = this.time.addEvent({
            delay: 30,
            repeat: 15,
            callback: () => {
                const particle = this.add.circle(
                    fighter.x + (Math.random() - 0.5) * 60,
                    fighter.y + (Math.random() - 0.5) * 60,
                    4, 0xff4400
                );
                particle.setBlendMode('ADD');
                this.tweens.add({
                    targets: particle,
                    x: fighter.x + direction * 30,
                    y: fighter.y,
                    scale: 0,
                    duration: 200,
                    onComplete: () => particle.destroy()
                });
            }
        });

        this.tweens.add({
            targets: chargeBar,
            width: 60,
            duration: 500,
            onComplete: () => {
                chargeBar.destroy();

                // Fire railgun
                const beam = this.add.rectangle(
                    fighter.x + direction * 250,
                    fighter.y,
                    500, 6, 0xff4400
                );
                beam.setBlendMode('ADD');

                // Wider glow beam
                const beamGlow = this.add.rectangle(
                    beam.x, beam.y,
                    500, 20, 0xff4400, 0.4
                );
                beamGlow.setBlendMode('ADD');

                // Screen shake
                this.cameras.main.shake(200, 0.02);

                // Instant hit check
                const opponent = fighter.opponent;
                if (!opponent.isInvincible) {
                    const inBeam = direction > 0
                        ? opponent.x > fighter.x
                        : opponent.x < fighter.x;
                    const inHeight = Math.abs(opponent.y - fighter.y) < 30;

                    if (inBeam && inHeight) {
                        this.applyDamage(opponent, attack.damage, attack.knockback, direction);
                        this.createHitSpark(opponent.x, opponent.y, 0xff4400);
                    }
                }

                // Beam fade
                this.tweens.add({
                    targets: [beam, beamGlow],
                    alpha: 0,
                    scaleY: 0,
                    duration: 100,
                    onComplete: () => {
                        beam.destroy();
                        beamGlow.destroy();
                    }
                });
            }
        });
    }

    // BOMB - Arcing explosive
    createBombAttack(fighter, attack, direction) {
        const bomb = this.add.circle(fighter.x + direction * 30, fighter.y - 20, 15, 0xff6600);
        this.physics.add.existing(bomb);

        // Fuse glow
        const fuse = this.add.circle(bomb.x, bomb.y - 12, 4, 0xffff00);
        fuse.setBlendMode('ADD');

        bomb.body.setVelocity(direction * 250, -300);
        bomb.body.setGravityY(600);
        bomb.body.setBounce(0.4);

        // Update fuse position
        const fuseUpdate = this.time.addEvent({
            delay: 16,
            repeat: -1,
            callback: () => {
                if (bomb.active) {
                    fuse.x = bomb.x;
                    fuse.y = bomb.y - 12;
                }
            }
        });

        // Fuse flicker
        this.tweens.add({
            targets: fuse,
            scale: { from: 0.8, to: 1.5 },
            duration: 100,
            yoyo: true,
            repeat: -1
        });

        // Explode after delay or on contact
        const explode = () => {
            if (!bomb.active) return;
            fuseUpdate.remove();

            // Big explosion
            const explosion = this.add.circle(bomb.x, bomb.y, 20, 0xff6600);
            explosion.setBlendMode('ADD');

            this.tweens.add({
                targets: explosion,
                scale: 6,
                alpha: 0,
                duration: 400,
                onComplete: () => explosion.destroy()
            });

            // Debris
            for (let i = 0; i < 12; i++) {
                const debris = this.add.circle(
                    bomb.x, bomb.y,
                    4 + Math.random() * 6,
                    [0xff6600, 0xffff00, 0xff0000][i % 3]
                );
                const angle = (i / 12) * Math.PI * 2;
                const speed = 200 + Math.random() * 200;

                this.tweens.add({
                    targets: debris,
                    x: bomb.x + Math.cos(angle) * speed,
                    y: bomb.y + Math.sin(angle) * speed,
                    alpha: 0,
                    duration: 400,
                    onComplete: () => debris.destroy()
                });
            }

            this.cameras.main.shake(250, 0.025);

            // Area damage
            const opponent = fighter.opponent;
            if (!opponent.isInvincible) {
                const dist = Phaser.Math.Distance.Between(bomb.x, bomb.y, opponent.x, opponent.y);
                if (dist < 100) {
                    const knockDir = opponent.x > bomb.x ? 1 : -1;
                    this.applyDamage(opponent, attack.damage, attack.knockback, knockDir);
                }
            }

            bomb.destroy();
            fuse.destroy();
        };

        this.time.delayedCall(1500, explode);
    }

    // LIGHTNING - Chain lightning
    createLightningAttack(fighter, attack, direction) {
        const opponent = fighter.opponent;

        // Initial bolt to opponent
        this.createLightningBolt(fighter.x, fighter.y, opponent.x, opponent.y, 0xffff00);

        // Hit
        if (!opponent.isInvincible) {
            this.applyDamage(opponent, attack.damage, attack.knockback, direction);
        }

        // Chain effect - sparks around opponent
        for (let i = 0; i < 3; i++) {
            this.time.delayedCall(i * 100, () => {
                const spark = this.add.star(
                    opponent.x + (Math.random() - 0.5) * 40,
                    opponent.y + (Math.random() - 0.5) * 60,
                    4, 5, 15, 0xffff00
                );
                spark.setBlendMode('ADD');
                this.tweens.add({
                    targets: spark,
                    scale: 0,
                    angle: 180,
                    duration: 200,
                    onComplete: () => spark.destroy()
                });
            });
        }

        this.cameras.main.flash(50, 255, 255, 100);
    }

    createLightningBolt(x1, y1, x2, y2, color) {
        const graphics = this.add.graphics();
        graphics.lineStyle(3, color, 1);
        graphics.setBlendMode('ADD');

        // Jagged lightning path
        const segments = 8;
        let prevX = x1, prevY = y1;

        graphics.beginPath();
        graphics.moveTo(x1, y1);

        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const nextX = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 40;
            const nextY = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 30;
            graphics.lineTo(nextX, nextY);
            prevX = nextX;
            prevY = nextY;
        }

        graphics.lineTo(x2, y2);
        graphics.strokePath();

        // Glow
        graphics.lineStyle(8, color, 0.3);
        graphics.beginPath();
        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);
        graphics.strokePath();

        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 150,
            onComplete: () => graphics.destroy()
        });
    }

    // EARTHQUAKE - Ground shockwave
    createEarthquakeAttack(fighter, attack, direction) {
        const groundY = this.groundY;

        // Big stomp
        fighter.body.setVelocityY(400);

        this.time.delayedCall(150, () => {
            // Shockwaves in both directions
            for (let dir = -1; dir <= 1; dir += 2) {
                for (let i = 0; i < 6; i++) {
                    this.time.delayedCall(i * 60, () => {
                        const pillar = this.add.rectangle(
                            fighter.x + dir * (50 + i * 40),
                            groundY,
                            30, 0, 0x888888
                        );
                        pillar.setOrigin(0.5, 1);

                        this.tweens.add({
                            targets: pillar,
                            height: 50 + Math.random() * 40,
                            duration: 100,
                            yoyo: true,
                            hold: 100,
                            onComplete: () => pillar.destroy()
                        });
                    });
                }
            }

            // Dust clouds
            for (let i = 0; i < 10; i++) {
                const dust = this.add.circle(
                    fighter.x + (Math.random() - 0.5) * 200,
                    groundY + 10,
                    15 + Math.random() * 15,
                    0x888888, 0.6
                );
                this.tweens.add({
                    targets: dust,
                    y: dust.y - 40,
                    alpha: 0,
                    scale: 2,
                    duration: 500,
                    onComplete: () => dust.destroy()
                });
            }

            // Heavy screen shake
            this.cameras.main.shake(400, 0.03);

            // Damage grounded opponents
            const opponent = fighter.opponent;
            if (!opponent.isInvincible && opponent.isGrounded) {
                const dist = Math.abs(opponent.x - fighter.x);
                if (dist < attack.range) {
                    opponent.body.setVelocityY(-350);
                    this.applyDamage(opponent, attack.damage, attack.knockback, opponent.x > fighter.x ? 1 : -1);
                }
            }
        });
    }

    // SLASH - Wide plasma arc
    createSlashAttack(fighter, attack, direction) {
        // Create arc slash effect
        const arc = this.add.graphics();
        arc.lineStyle(6, 0xff00ff, 1);
        arc.setBlendMode('ADD');

        const arcX = fighter.x + direction * 40;
        const startAngle = direction > 0 ? -0.8 : Math.PI - 0.8;
        const endAngle = direction > 0 ? 0.8 : Math.PI + 0.8;

        arc.beginPath();
        arc.arc(arcX, fighter.y, 60, startAngle, endAngle);
        arc.strokePath();

        // Glow arc
        const glowArc = this.add.graphics();
        glowArc.lineStyle(15, 0xff00ff, 0.4);
        glowArc.setBlendMode('ADD');
        glowArc.beginPath();
        glowArc.arc(arcX, fighter.y, 60, startAngle, endAngle);
        glowArc.strokePath();

        // Slash particles
        for (let i = 0; i < 8; i++) {
            const angle = startAngle + (endAngle - startAngle) * (i / 7);
            const particle = this.add.circle(
                arcX + Math.cos(angle) * 60,
                fighter.y + Math.sin(angle) * 60,
                5, 0x00ffff
            );
            particle.setBlendMode('ADD');

            this.tweens.add({
                targets: particle,
                x: particle.x + Math.cos(angle) * 30,
                y: particle.y + Math.sin(angle) * 30,
                alpha: 0,
                duration: 200,
                onComplete: () => particle.destroy()
            });
        }

        // Fade arc
        this.tweens.add({
            targets: [arc, glowArc],
            alpha: 0,
            duration: 200,
            onComplete: () => {
                arc.destroy();
                glowArc.destroy();
            }
        });

        // Hit detection
        const opponent = fighter.opponent;
        if (!opponent.isInvincible) {
            const dist = Phaser.Math.Distance.Between(fighter.x, fighter.y, opponent.x, opponent.y);
            if (dist < attack.range) {
                this.applyDamage(opponent, attack.damage, attack.knockback, direction);
                this.createHitSpark(opponent.x, opponent.y, 0xff00ff);
            }
        }
    }

    // Default projectile for any unhandled types
    createDefaultProjectile(fighter, attack, direction) {
        const projectile = this.add.circle(
            fighter.x + direction * 40,
            fighter.y,
            12,
            fighter.characterData.color
        );
        this.physics.add.existing(projectile);

        projectile.isProjectile = true;
        projectile.hasHit = false;
        projectile.owner = fighter;
        projectile.attackDamage = attack.damage;
        projectile.attackKnockback = attack.knockback;
        projectile.setBlendMode('ADD');

        fighter.projectiles.add(projectile);
        projectile.body.setAllowGravity(false);
        projectile.body.setVelocityX(direction * 350);

        this.time.delayedCall(3000, () => {
            if (projectile && projectile.active) projectile.destroy();
        });
    }

    // Helper: Create hit spark effect
    createHitSpark(x, y, color) {
        for (let i = 0; i < 8; i++) {
            const spark = this.add.circle(x, y, 4, color);
            spark.setBlendMode('ADD');
            const angle = (i / 8) * Math.PI * 2;

            this.tweens.add({
                targets: spark,
                x: x + Math.cos(angle) * 40,
                y: y + Math.sin(angle) * 40,
                alpha: 0,
                scale: 0,
                duration: 200,
                onComplete: () => spark.destroy()
            });
        }
    }

    checkHitbox(hitbox, target) {
        const targetBounds = {
            x: target.x - target.characterData.size.width / 2,
            y: target.y - target.characterData.size.height / 2,
            width: target.characterData.size.width,
            height: target.characterData.size.height
        };

        return Phaser.Geom.Rectangle.Overlaps(
            new Phaser.Geom.Rectangle(hitbox.x - hitbox.width/2, hitbox.y - hitbox.height/2, hitbox.width, hitbox.height),
            new Phaser.Geom.Rectangle(targetBounds.x, targetBounds.y, targetBounds.width, targetBounds.height)
        );
    }

    applyDamage(fighter, damage, knockbackMult, direction) {
        try {
            if (!fighter) return;
            if (!fighter.body) return;
            if (fighter.isInvincible) return;
            if (typeof damage !== 'number' || damage <= 0) return;
            if (typeof knockbackMult !== 'number') knockbackMult = 1;
            if (typeof direction !== 'number') direction = 1;

            // Initialize damage if not set
            if (typeof fighter.damage !== 'number') {
                fighter.damage = 0;
            }

            fighter.damage += damage;

            // Combo tracking - update attacker's combo
            const attacker = fighter.opponent;
            if (attacker) {
                const currentTime = this.time.now;
                const COMBO_WINDOW = 2000; // 2 seconds to continue combo

                if (currentTime - attacker.lastHitTime < COMBO_WINDOW) {
                    attacker.comboCount++;
                } else {
                    attacker.comboCount = 1;
                }
                attacker.lastHitTime = currentTime;

                // Show combo counter
                this.showComboText(attacker, fighter);
            }

            // Calculate knockback based on damage
            const knockbackForce = BASE_KNOCKBACK + (fighter.damage * KNOCKBACK_GROWTH * 100);
            const totalKnockback = knockbackForce * knockbackMult;

            // Apply knockback
            try {
                fighter.body.setVelocityX(direction * totalKnockback);
                fighter.body.setVelocityY(-totalKnockback * 0.5);
            } catch (e) {
                console.warn('Error applying knockback:', e);
            }

            // Hitstun
            fighter.hitstun = HITSTUN_BASE + (fighter.damage * HITSTUN_GROWTH);

            // Visual effects - use hitEmitter safely
            try {
                if (this.hitEmitter && fighter.x && fighter.y) {
                    this.hitEmitter.emitParticleAt(fighter.x, fighter.y, 15);
                }
            } catch (e) {
                // Silently fail if emitter doesn't work
            }

            // Impact effect
            try {
                const impact = this.add.image(fighter.x, fighter.y, 'effect_impact');
                if (impact) {
                    impact.setBlendMode('ADD');
                    impact.setScale(0.5);

                    this.tweens.add({
                        targets: impact,
                        alpha: 0,
                        scale: 2,
                        duration: 200,
                        onComplete: () => {
                            try {
                                if (impact && impact.active) impact.destroy();
                            } catch (e) {}
                        }
                    });
                }
            } catch (e) {
                // Silently fail if impact effect doesn't work
            }

            // Camera effects
            try {
                const shakeIntensity = Math.min(damage * 0.001, 0.01);
                if (this.cameras && this.cameras.main) {
                    this.cameras.main.shake(100, shakeIntensity);

                    // Screen flash for big hits
                    if (damage >= 15) {
                        this.cameras.main.flash(50, 255, 255, 255);
                    }
                }
            } catch (e) {
                // Silently fail if camera effects don't work
            }
        } catch (e) {
            console.error('Error in applyDamage:', e);
        }
    }

    showComboText(attacker, target) {
        // Only show combo text for combos of 2 or more
        if (attacker.comboCount < 2) return;

        // Remove old combo text if exists
        if (attacker.comboText && attacker.comboText.active) {
            attacker.comboText.destroy();
        }

        // Determine combo text and color based on combo count
        let comboLabel = '';
        let comboColor = '#ffffff';

        if (attacker.comboCount >= 10) {
            comboLabel = 'UNSTOPPABLE!';
            comboColor = '#ff0000';
        } else if (attacker.comboCount >= 7) {
            comboLabel = 'DOMINATING!';
            comboColor = '#ff4400';
        } else if (attacker.comboCount >= 5) {
            comboLabel = 'BRUTAL!';
            comboColor = '#ff8800';
        } else if (attacker.comboCount >= 3) {
            comboLabel = 'NICE!';
            comboColor = '#ffff00';
        }

        // Create combo counter text near the target - Minecraft style
        const comboText = this.add.text(target.x, target.y - 60, `${attacker.comboCount} HIT COMBO!`, {
            fontSize: '20px',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'bold',
            color: comboColor
        }).setOrigin(0.5);
        comboText.setStroke('#000000', 3);

        // Add label below if earned
        if (comboLabel) {
            const labelText = this.add.text(target.x, target.y - 35, comboLabel, {
                fontSize: '14px',
                fontFamily: 'Courier New, monospace',
                fontStyle: 'bold',
                color: comboColor
            }).setOrigin(0.5);
            labelText.setStroke('#000000', 3);

            this.tweens.add({
                targets: labelText,
                y: labelText.y - 30,
                alpha: 0,
                scale: 1.3,
                duration: 800,
                ease: 'Power2',
                onComplete: () => labelText.destroy()
            });
        }

        attacker.comboText = comboText;

        // Animate and destroy
        this.tweens.add({
            targets: comboText,
            y: comboText.y - 40,
            alpha: 0,
            scale: 1.2,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                if (comboText && comboText.active) {
                    comboText.destroy();
                }
            }
        });

        // Bonus damage for high combos
        if (attacker.comboCount >= 5) {
            // Screen shake for big combos
            this.cameras.main.shake(150, 0.01 * Math.min(attacker.comboCount, 10));
        }
    }

    checkBlastZones() {
        const zones = this.currentArena.blastZones;

        [this.player1, this.player2].forEach(fighter => {
            // Skip if fighter is invincible (spawn protection)
            if (fighter.isInvincible) return;

            if (fighter.x < zones.left || fighter.x > zones.right ||
                fighter.y < zones.top || fighter.y > zones.bottom) {
                this.handleKO(fighter);
            }
        });
    }

    handleKO(fighter) {
        if (fighter.isInvincible) return;

        fighter.stocks--;

        // KO effect - subtle camera shake instead of bright flash
        try {
            this.cameras.main.shake(300, 0.015);
        } catch (e) {}

        // Check game over
        if (fighter.stocks <= 0) {
            this.endGame(fighter.opponent);
            return;
        }

        // Respawn
        this.respawnFighter(fighter);
    }

    respawnFighter(fighter) {
        // Calculate spawn position based on arena's main platform
        const mainPlatform = this.currentArena.platforms.find(p => p.type === 'main');
        const platformY = mainPlatform ? mainPlatform.y : 550;
        const platformHeight = mainPlatform ? mainPlatform.height : 40;
        const spawnY = platformY - (platformHeight / 2) - 50;

        const platformX = mainPlatform ? mainPlatform.x : 600;
        const platformWidth = mainPlatform ? mainPlatform.width : 600;
        const spawnX = fighter.playerNum === 1
            ? platformX - platformWidth / 4
            : platformX + platformWidth / 4;

        // Reset position
        fighter.x = spawnX;
        fighter.y = spawnY;
        fighter.body.setVelocity(0, 0);
        fighter.damage = 0;

        // Reset combo
        fighter.comboCount = 0;

        // Ensure fighter is active and physics body works
        fighter.body.enable = true;
        fighter.body.setAllowGravity(true);

        // Use shared spawn protection
        this.startSpawnProtection(fighter);
    }

    checkCombat() {
        // Check melee range combat (already handled in attack functions)
    }

    updateHUD() {
        // Update damage displays - Minecraft style colors
        [this.p1HUD, this.p2HUD].forEach(hud => {
            const damage = Math.floor(hud.fighter.damage);
            hud.damageText.setText(`${damage}%`);

            // Color based on damage - Minecraft-ish colors
            if (damage < 50) {
                hud.damageText.setColor('#55ff55');  // Green
                hud.damageText.setStroke('#005500', 3);
            } else if (damage < 100) {
                hud.damageText.setColor('#ffff55');  // Yellow
                hud.damageText.setStroke('#555500', 3);
            } else if (damage < 150) {
                hud.damageText.setColor('#ffaa00');  // Gold/Orange
                hud.damageText.setStroke('#553300', 3);
            } else {
                hud.damageText.setColor('#ff5555');  // Red
                hud.damageText.setStroke('#550000', 3);
            }

            // Update stock icons (hearts)
            hud.stockIcons.forEach((icon, i) => {
                icon.setVisible(i < hud.fighter.stocks);
            });
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            this.physics.pause();
            this.scene.launch('PauseScene', { gameScene: this });
        } else {
            this.physics.resume();
            this.scene.stop('PauseScene');
        }
    }

    endGame(winner) {
        this.gameOver = true;
        this.physics.pause();

        // Victory transition
        this.cameras.main.flash(500, 255, 255, 255);

        this.time.delayedCall(1000, () => {
            this.scene.start('VictoryScene', {
                winner: winner,
                mode: this.gameMode,
                player1: this.player1Data,
                player2: this.player2Data,
                arena: this.currentArena,
                aiDifficulty: this.aiDifficulty
            });
        });
    }
}
