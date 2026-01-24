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

        // Create arena
        this.createArenaBackground();
        this.createPlatforms();
        this.createParticleEffects();

        // Create fighters
        this.createFighters();

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

        // Setup collisions
        this.setupCollisions();

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
        // Create Player 1
        this.player1 = this.createFighter(400, 300, this.player1Data, 1);

        // Create Player 2
        this.player2 = this.createFighter(800, 300, this.player2Data, 2);

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
        fighter.isInvincible = false;
        fighter.attackCooldown = 0;
        fighter.specialCooldown = 0;
        fighter.hitstun = 0;
        fighter.currentAnim = 'idle';
        fighter.inputState = {
            left: false, right: false, up: false, down: false,
            jump: false, attack: false, special: false
        };

        // Create projectiles group
        fighter.projectiles = this.physics.add.group();

        // Start idle animation
        sprite.play(`${charData.id}_idle`);

        return fighter;
    }

    createHUD() {
        // Player 1 HUD (left side)
        this.p1HUD = this.createPlayerHUD(30, 20, this.player1, 0x00ff00);

        // Player 2 HUD (right side)
        this.p2HUD = this.createPlayerHUD(GAME_WIDTH - 230, 20, this.player2, 0xff6600);

        // Timer (center)
        this.timerText = this.add.text(GAME_WIDTH / 2, 30, '∞', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.timerText.setStroke('#000000', 4);
    }

    createPlayerHUD(x, y, fighter, color) {
        const container = this.add.container(x, y);

        // Background
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.5);
        bg.fillRoundedRect(0, 0, 200, 80, 10);

        // Player label
        const label = this.add.text(10, 8, `P${fighter.playerNum}`, {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: Phaser.Display.Color.IntegerToColor(color).rgba
        });

        // Character name
        const name = this.add.text(45, 8, fighter.characterData.name, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff'
        });

        // Damage percentage
        const damageText = this.add.text(100, 35, '0%', {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#00ff00'
        }).setOrigin(0.5, 0);

        // Stock icons
        const stockContainer = this.add.container(10, 60);
        const stockIcons = [];
        for (let i = 0; i < fighter.stocks; i++) {
            const icon = this.add.image(i * 22, 0, 'stock_icon');
            stockContainer.add(icon);
            stockIcons.push(icon);
        }

        container.add([bg, label, name, damageText, stockContainer]);

        return {
            container,
            damageText,
            stockIcons,
            fighter
        };
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

        // Player 2 controls (Arrows + F/Shift, E/Right Ctrl)
        this.p2Keys = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
            attackAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
            special: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            specialAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT_CONTROL)
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

        // Projectile collisions
        this.physics.add.overlap(this.player1.projectiles, this.player2, this.handleProjectileHit, null, this);
        this.physics.add.overlap(this.player2.projectiles, this.player1, this.handleProjectileHit, null, this);
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

    handleProjectileHit(projectile, fighter) {
        // Make sure projectile still exists and hasn't been destroyed
        if (!projectile || !projectile.active || fighter.isInvincible) return;

        const damage = projectile.damage || 10;
        const knockback = projectile.knockback || 1;
        const direction = projectile.x < fighter.x ? 1 : -1;

        // Apply damage
        this.applyDamage(fighter, damage, knockback, direction);

        // Destroy projectile with effect
        if (this.hitEmitter && projectile.x && projectile.y) {
            this.hitEmitter.setPosition(projectile.x, projectile.y);
            this.hitEmitter.explode(10);
        }

        // Safely destroy projectile
        if (projectile.active) {
            projectile.destroy();
        }
    }

    startCountdown() {
        this.countdownActive = true;

        // Freeze players during countdown
        this.player1.body.setImmovable(true);
        this.player2.body.setImmovable(true);

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
                    this.player1.body.setImmovable(false);
                    this.player2.body.setImmovable(false);
                }
            },
            repeat: 4
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
        [this.player1, this.player2].forEach(fighter => {
            if (fighter.attackCooldown > 0) fighter.attackCooldown -= delta;
            if (fighter.specialCooldown > 0) fighter.specialCooldown -= delta;
            if (fighter.hitstun > 0) fighter.hitstun -= delta;
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
        const charId = fighter.characterData.id;

        // Show special effect with error handling
        const textureKey = `special_${charId}`;
        if (this.textures.exists(textureKey)) {
            try {
                const specialEffect = this.add.image(
                    fighter.x + direction * 50,
                    fighter.y,
                    textureKey
                );
                specialEffect.setFlipX(!fighter.facingRight);
                specialEffect.setBlendMode('ADD');
                specialEffect.setScale(1.5);

                this.tweens.add({
                    targets: specialEffect,
                    x: specialEffect.x + direction * 30,
                    alpha: 0,
                    scaleX: 2,
                    scaleY: 2,
                    duration: 400,
                    onComplete: () => specialEffect.destroy()
                });
            } catch (e) {
                console.warn('Error creating special effect:', e);
            }
        }

        // Check if it's a projectile-based attack
        if (attack.range > 80) {
            this.createProjectile(fighter, attack, direction);
        } else {
            // Melee special - wider hitbox
            const hitbox = {
                x: fighter.x + direction * attack.range / 2,
                y: fighter.y,
                width: attack.range * 1.5,
                height: 70
            };

            const opponent = fighter.opponent;
            if (this.checkHitbox(hitbox, opponent) && !opponent.isInvincible) {
                this.applyDamage(opponent, attack.damage, attack.knockback, direction);
            }
        }
    }

    createProjectile(fighter, attack, direction) {
        const charId = fighter.characterData.id;
        const textureKey = `special_${charId}`;
        
        let projectile;
        
        // Try to use texture if it exists, otherwise create a simple circle
        if (this.textures.exists(textureKey)) {
            try {
                projectile = this.add.image(
                    fighter.x + direction * 40,
                    fighter.y,
                    textureKey
                );
                projectile.setScale(1.2);
                projectile.setFlipX(!fighter.facingRight);
            } catch (e) {
                console.warn('Error creating projectile image, using fallback:', e);
                projectile = this.add.circle(
                    fighter.x + direction * 40,
                    fighter.y,
                    12,
                    fighter.characterData.color
                );
            }
        } else {
            // Fallback: create a simple circle if texture doesn't exist
            projectile = this.add.circle(
                fighter.x + direction * 40,
                fighter.y,
                12,
                fighter.characterData.color
            );
        }

        // Add physics body
        try {
            this.physics.add.existing(projectile);
            projectile.body.setVelocityX(direction * 400);
            projectile.body.setAllowGravity(false);
            projectile.body.setCollideWorldBounds(true);
            projectile.body.onWorldBounds = true;
        } catch (e) {
            console.warn('Error setting up projectile physics:', e);
        }

        // Set projectile properties
        projectile.damage = attack.damage || 10;
        projectile.knockback = attack.knockback || 1;
        projectile.setBlendMode('ADD');

        // Add to fighter's projectile group
        fighter.projectiles.add(projectile);

        // Add rotation for some projectile types
        if (attack.type === 'shuriken') {
            try {
                this.tweens.add({
                    targets: projectile,
                    angle: direction * 360 * 3,
                    duration: 1000,
                    repeat: -1
                });
            } catch (e) {
                console.warn('Error creating rotation tween:', e);
            }
        }

        // Destroy after time
        this.time.delayedCall(2000, () => {
            try {
                if (projectile && projectile.active) {
                    projectile.destroy();
                }
            } catch (e) {
                console.warn('Error destroying projectile:', e);
            }
        });
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
            if (!fighter || !fighter.body) return;

            fighter.damage += damage;

            // Calculate knockback based on damage
            const knockbackForce = BASE_KNOCKBACK + (fighter.damage * KNOCKBACK_GROWTH * 100);
            const totalKnockback = knockbackForce * knockbackMult;

            // Apply knockback
            if (fighter.body) {
                fighter.body.setVelocityX(direction * totalKnockback);
                fighter.body.setVelocityY(-totalKnockback * 0.5);
            }

            // Hitstun
            fighter.hitstun = HITSTUN_BASE + (fighter.damage * HITSTUN_GROWTH);

            // Visual effects
            if (this.hitEmitter) {
                this.hitEmitter.setPosition(fighter.x, fighter.y);
                this.hitEmitter.explode(15);
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
                console.warn('Error creating impact effect:', e);
            }

            // Camera shake based on damage
            const shakeIntensity = Math.min(damage * 0.001, 0.01);
            if (this.cameras && this.cameras.main) {
                this.cameras.main.shake(100, shakeIntensity);

                // Screen flash for big hits
                if (damage >= 15) {
                    this.cameras.main.flash(50, 255, 255, 255);
                }
            }
        } catch (e) {
            console.warn('Error in applyDamage:', e);
        }
    }

    checkBlastZones() {
        const zones = this.currentArena.blastZones;

        [this.player1, this.player2].forEach(fighter => {
            if (fighter.x < zones.left || fighter.x > zones.right ||
                fighter.y < zones.top || fighter.y > zones.bottom) {
                this.handleKO(fighter);
            }
        });
    }

    handleKO(fighter) {
        if (fighter.isInvincible) return;

        fighter.stocks--;

        // KO effect
        this.cameras.main.flash(300, 255, 100, 100);
        this.cameras.main.shake(300, 0.02);

        // Check game over
        if (fighter.stocks <= 0) {
            this.endGame(fighter.opponent);
            return;
        }

        // Respawn
        this.respawnFighter(fighter);
    }

    respawnFighter(fighter) {
        // Reset position
        fighter.x = fighter.playerNum === 1 ? 400 : 800;
        fighter.y = 200;
        fighter.body.setVelocity(0, 0);
        fighter.damage = 0;

        // Invincibility
        fighter.isInvincible = true;

        // Flashing effect
        const flashTween = this.tweens.add({
            targets: fighter.sprite,
            alpha: { from: 0.3, to: 1 },
            duration: 100,
            repeat: RESPAWN_INVINCIBILITY / 100,
            onComplete: () => {
                fighter.isInvincible = false;
                fighter.sprite.setAlpha(1);
            }
        });
    }

    checkCombat() {
        // Check melee range combat (already handled in attack functions)
    }

    updateHUD() {
        // Update damage displays
        [this.p1HUD, this.p2HUD].forEach(hud => {
            const damage = Math.floor(hud.fighter.damage);
            hud.damageText.setText(`${damage}%`);

            // Color based on damage
            if (damage < 50) {
                hud.damageText.setColor('#00ff00');
            } else if (damage < 100) {
                hud.damageText.setColor('#ffff00');
            } else if (damage < 150) {
                hud.damageText.setColor('#ff8800');
            } else {
                hud.damageText.setColor('#ff0000');
            }

            // Update stock icons
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
