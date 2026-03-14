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
        const theme = arena.theme;

        // Determine if bright or dark theme
        this.isDarkTheme = ['cosmic', 'fire', 'cyber'].includes(theme);

        // Create pixelated background
        this.bgGraphics = this.add.graphics();
        this.createPixelatedSky(theme);

        // Create theme-specific background effects
        this.createThemeEffects();

        // Start sky animation
        this.skyTime = 0;
    }

    // PIXELATED SKY GENERATOR
    createPixelatedSky(theme) {
        const pixelSize = 8; // Size of each "pixel" in the sky
        const cols = Math.ceil(GAME_WIDTH / pixelSize);
        const rows = Math.ceil(GAME_HEIGHT / pixelSize);

        // Theme color palettes (gradient from top to bottom)
        const palettes = {
            cosmic: {
                colors: [0x0a0015, 0x150030, 0x200045, 0x1a0030, 0x0f0020],
                bright: false
            },
            fire: {
                colors: [0x1a0500, 0x331100, 0x552200, 0x773300, 0x440000],
                bright: false
            },
            ice: {
                colors: [0xaaddff, 0x88ccee, 0x66aadd, 0x4488cc, 0x3366aa],
                bright: true
            },
            cyber: {
                colors: [0x000022, 0x001133, 0x002244, 0x001133, 0x000022],
                bright: false
            },
            sky: {
                colors: [0x4488ff, 0x55aaff, 0x77ccff, 0x99ddff, 0xaaeeff],
                bright: true
            },
            nature: {
                colors: [0x1a3a1a, 0x2a5a2a, 0x3a7a3a, 0x4a9a4a, 0x3a6a3a],
                bright: true
            },
            epic: {
                colors: [0x1a1a2e, 0x252545, 0x16213e, 0x1f2f4f, 0x0f1a2e],
                bright: false
            },
            ancient: {
                colors: [0x2d1b0e, 0x3d2b1e, 0x4d3b2e, 0x3d2b1e, 0x2d1b0e],
                bright: false
            },
            default: {
                colors: [0x222244, 0x333355, 0x444466, 0x333355, 0x222244],
                bright: false
            }
        };

        const palette = palettes[theme] || palettes.default;

        // Draw pixelated gradient sky
        for (let row = 0; row < rows; row++) {
            const t = row / rows;
            const colorIndex = Math.floor(t * (palette.colors.length - 1));
            const nextIndex = Math.min(colorIndex + 1, palette.colors.length - 1);
            const blend = (t * (palette.colors.length - 1)) - colorIndex;

            for (let col = 0; col < cols; col++) {
                // Add some noise/variation
                const noise = (Math.sin(col * 0.3 + row * 0.2) + 1) * 0.1;
                const color = this.lerpColor(palette.colors[colorIndex], palette.colors[nextIndex], blend + noise * 0.2);

                this.bgGraphics.fillStyle(color, 1);
                this.bgGraphics.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
            }
        }
    }

    // Color interpolation helper
    lerpColor(color1, color2, t) {
        const r1 = (color1 >> 16) & 0xff;
        const g1 = (color1 >> 8) & 0xff;
        const b1 = color1 & 0xff;
        const r2 = (color2 >> 16) & 0xff;
        const g2 = (color2 >> 8) & 0xff;
        const b2 = color2 & 0xff;

        const r = Math.floor(r1 + (r2 - r1) * Math.max(0, Math.min(1, t)));
        const g = Math.floor(g1 + (g2 - g1) * Math.max(0, Math.min(1, t)));
        const b = Math.floor(b1 + (b2 - b1) * Math.max(0, Math.min(1, t)));

        return (r << 16) | (g << 8) | b;
    }

    createThemeEffects() {
        const theme = this.currentArena.theme;

        switch (theme) {
            case 'cosmic':
                this.createPixelCosmicBackground();
                break;
            case 'fire':
                this.createPixelFireBackground();
                break;
            case 'ice':
                this.createPixelIceBackground();
                break;
            case 'cyber':
                this.createPixelCyberBackground();
                break;
            case 'sky':
                this.createPixelSkyBackground();
                break;
            case 'nature':
                this.createPixelNatureBackground();
                break;
            case 'epic':
            case 'ancient':
                this.createPixelEpicBackground();
                break;
            default:
                this.createPixelDefaultBackground();
        }
    }

    // COSMIC - Dark with twinkling pixel stars
    createPixelCosmicBackground() {
        this.pixelStars = [];

        // Create pixel stars
        for (let i = 0; i < 80; i++) {
            const size = Math.random() > 0.8 ? 4 : 2;
            const star = this.add.rectangle(
                Math.random() * GAME_WIDTH,
                Math.random() * GAME_HEIGHT,
                size, size,
                [0xffffff, 0xaaaaff, 0xffaaff, 0xaaffff][Math.floor(Math.random() * 4)]
            );
            star.baseAlpha = 0.3 + Math.random() * 0.7;
            star.twinkleSpeed = 0.5 + Math.random() * 2;
            star.twinkleOffset = Math.random() * Math.PI * 2;
            this.pixelStars.push(star);
        }

        // Pixel nebula blobs
        for (let i = 0; i < 3; i++) {
            const nebula = this.add.graphics();
            const nx = 100 + Math.random() * (GAME_WIDTH - 200);
            const ny = 50 + Math.random() * (GAME_HEIGHT - 200);
            const color = [0xff00ff, 0x00ffff, 0xff6600][i];

            // Draw pixelated nebula
            for (let px = -5; px <= 5; px++) {
                for (let py = -5; py <= 5; py++) {
                    const dist = Math.sqrt(px * px + py * py);
                    if (dist < 5) {
                        nebula.fillStyle(color, 0.1 * (1 - dist / 5));
                        nebula.fillRect(nx + px * 12, ny + py * 12, 12, 12);
                    }
                }
            }
            nebula.setBlendMode('ADD');
        }
    }

    // FIRE - Dark with animated pixel embers
    createPixelFireBackground() {
        // Pixel lava at bottom
        const lavaGraphics = this.add.graphics();
        for (let x = 0; x < GAME_WIDTH; x += 8) {
            const height = 80 + Math.sin(x * 0.05) * 30;
            for (let y = 0; y < height; y += 8) {
                const t = y / height;
                const color = this.lerpColor(0xff6600, 0xff0000, t);
                lavaGraphics.fillStyle(color, 0.6 - t * 0.4);
                lavaGraphics.fillRect(x, GAME_HEIGHT - height + y, 8, 8);
            }
        }

        // Animated pixel embers
        this.pixelEmbers = [];
        for (let i = 0; i < 30; i++) {
            const ember = this.add.rectangle(
                Math.random() * GAME_WIDTH,
                GAME_HEIGHT + Math.random() * 50,
                4, 4,
                [0xff4400, 0xff6600, 0xffaa00, 0xffff00][Math.floor(Math.random() * 4)]
            );
            ember.setBlendMode('ADD');
            ember.vx = (Math.random() - 0.5) * 0.5;
            ember.vy = -1 - Math.random() * 2;
            this.pixelEmbers.push(ember);
        }
    }

    // ICE - Bright with pixel aurora and snowflakes
    createPixelIceBackground() {
        // Pixel aurora bands
        this.auroraGraphics = this.add.graphics();
        this.auroraPhase = 0;

        // Initial aurora draw
        this.drawPixelAurora();

        // Pixel snowflakes
        this.pixelSnow = [];
        for (let i = 0; i < 40; i++) {
            const snow = this.add.rectangle(
                Math.random() * GAME_WIDTH,
                Math.random() * GAME_HEIGHT,
                Math.random() > 0.7 ? 4 : 2,
                Math.random() > 0.7 ? 4 : 2,
                0xffffff,
                0.7 + Math.random() * 0.3
            );
            snow.vx = (Math.random() - 0.5) * 0.3;
            snow.vy = 0.5 + Math.random() * 1;
            this.pixelSnow.push(snow);
        }
    }

    drawPixelAurora() {
        this.auroraGraphics.clear();
        const colors = [0x00ff88, 0x00ffaa, 0x44ffcc, 0x88ffdd];

        for (let band = 0; band < 3; band++) {
            const baseY = 30 + band * 50;
            for (let x = 0; x < GAME_WIDTH; x += 8) {
                const wave = Math.sin(x * 0.02 + this.auroraPhase + band) * 20;
                const height = 30 + Math.sin(x * 0.01 + this.auroraPhase * 0.5) * 15;

                for (let y = 0; y < height; y += 8) {
                    const t = y / height;
                    this.auroraGraphics.fillStyle(colors[band], 0.15 * (1 - t));
                    this.auroraGraphics.fillRect(x, baseY + wave + y, 8, 8);
                }
            }
        }
    }

    // CYBER - Dark with pixel grid and neon scanlines
    createPixelCyberBackground() {
        // Pixel grid
        const gridGraphics = this.add.graphics();
        gridGraphics.fillStyle(0x00ffff, 0.15);

        for (let x = 0; x < GAME_WIDTH; x += 40) {
            for (let y = 0; y < GAME_HEIGHT; y += 8) {
                gridGraphics.fillRect(x, y, 2, 2);
            }
        }
        for (let y = 0; y < GAME_HEIGHT; y += 40) {
            for (let x = 0; x < GAME_WIDTH; x += 8) {
                gridGraphics.fillRect(x, y, 2, 2);
            }
        }

        // Neon scanlines
        this.scanlineY = 0;
        this.scanlineGraphics = this.add.graphics();

        // Data streams
        this.dataStreams = [];
        for (let i = 0; i < 8; i++) {
            const stream = {
                x: Math.random() * GAME_WIDTH,
                chars: [],
                speed: 2 + Math.random() * 3
            };
            for (let c = 0; c < 10; c++) {
                stream.chars.push({
                    y: -c * 20,
                    alpha: 1 - c * 0.1
                });
            }
            this.dataStreams.push(stream);
        }
        this.dataGraphics = this.add.graphics();
    }

    // SKY - Bright with pixel sun and clouds
    createPixelSkyBackground() {
        // Pixel sun
        const sunGraphics = this.add.graphics();
        const sunX = 150, sunY = 80;

        // Sun core
        for (let px = -4; px <= 4; px++) {
            for (let py = -4; py <= 4; py++) {
                const dist = Math.sqrt(px * px + py * py);
                if (dist <= 4) {
                    const color = dist < 2 ? 0xffffaa : (dist < 3 ? 0xffdd44 : 0xffaa00);
                    sunGraphics.fillStyle(color, 1);
                    sunGraphics.fillRect(sunX + px * 8, sunY + py * 8, 8, 8);
                }
            }
        }

        // Sun rays (pixelated)
        for (let r = 0; r < 8; r++) {
            const angle = (r / 8) * Math.PI * 2;
            for (let d = 5; d < 10; d++) {
                const rx = sunX + Math.cos(angle) * d * 8;
                const ry = sunY + Math.sin(angle) * d * 8;
                sunGraphics.fillStyle(0xffff00, 0.3);
                sunGraphics.fillRect(rx - 2, ry - 2, 4, 4);
            }
        }
        sunGraphics.setBlendMode('ADD');

        // Pixel clouds
        this.pixelClouds = [];
        for (let i = 0; i < 4; i++) {
            const cloud = this.createPixelCloud(
                -100 + Math.random() * (GAME_WIDTH + 100),
                40 + Math.random() * 120
            );
            cloud.vx = 0.3 + Math.random() * 0.5;
            this.pixelClouds.push(cloud);
        }
    }

    createPixelCloud(x, y) {
        const cloudGraphics = this.add.graphics();
        const cloudData = [];

        // Generate cloud shape
        const puffs = 4 + Math.floor(Math.random() * 3);
        for (let p = 0; p < puffs; p++) {
            const px = p * 20 - puffs * 10;
            const py = Math.sin(p * 0.8) * 8;
            const size = 2 + Math.floor(Math.random() * 2);

            for (let dx = -size; dx <= size; dx++) {
                for (let dy = -size; dy <= size; dy++) {
                    if (Math.abs(dx) + Math.abs(dy) <= size + 1) {
                        cloudData.push({ x: px + dx * 6, y: py + dy * 6 });
                    }
                }
            }
        }

        // Draw cloud pixels
        cloudData.forEach(pixel => {
            cloudGraphics.fillStyle(0xffffff, 0.8);
            cloudGraphics.fillRect(pixel.x, pixel.y, 6, 6);
        });

        cloudGraphics.setPosition(x, y);
        return cloudGraphics;
    }

    // NATURE - Bright jungle with pixel leaves and fireflies
    createPixelNatureBackground() {
        // Pixel trees in background
        const treeGraphics = this.add.graphics();
        for (let t = 0; t < 6; t++) {
            const tx = 80 + t * 150 + Math.random() * 50;
            const ty = GAME_HEIGHT - 100;

            // Tree trunk
            treeGraphics.fillStyle(0x4a3520, 1);
            for (let i = 0; i < 8; i++) {
                treeGraphics.fillRect(tx - 8 + (i % 2) * 2, ty - i * 12, 12, 12);
            }

            // Tree leaves (pixel circles)
            const leafColors = [0x2a6a2a, 0x3a8a3a, 0x4aaa4a];
            for (let lx = -3; lx <= 3; lx++) {
                for (let ly = -3; ly <= 1; ly++) {
                    const dist = Math.sqrt(lx * lx + ly * ly);
                    if (dist < 3.5) {
                        treeGraphics.fillStyle(leafColors[Math.floor(Math.random() * 3)], 0.9);
                        treeGraphics.fillRect(tx + lx * 14, ty - 90 + ly * 12, 12, 12);
                    }
                }
            }
        }

        // Pixel fireflies
        this.pixelFireflies = [];
        for (let i = 0; i < 15; i++) {
            const firefly = this.add.rectangle(
                Math.random() * GAME_WIDTH,
                100 + Math.random() * (GAME_HEIGHT - 200),
                3, 3,
                0xffff44
            );
            firefly.setBlendMode('ADD');
            firefly.baseX = firefly.x;
            firefly.baseY = firefly.y;
            firefly.phase = Math.random() * Math.PI * 2;
            firefly.glowPhase = Math.random() * Math.PI * 2;
            this.pixelFireflies.push(firefly);
        }

        // Falling leaves
        this.pixelLeaves = [];
        for (let i = 0; i < 12; i++) {
            const leaf = this.add.rectangle(
                Math.random() * GAME_WIDTH,
                Math.random() * GAME_HEIGHT,
                6, 4,
                [0x88aa44, 0x66882a, 0xaacc66][Math.floor(Math.random() * 3)]
            );
            leaf.setAngle(Math.random() * 360);
            leaf.vx = (Math.random() - 0.5) * 0.5;
            leaf.vy = 0.3 + Math.random() * 0.5;
            leaf.spin = (Math.random() - 0.5) * 2;
            this.pixelLeaves.push(leaf);
        }
    }

    // EPIC/ANCIENT - Dark dramatic with floating particles and light rays
    createPixelEpicBackground() {
        // Dramatic light rays from above
        const rayGraphics = this.add.graphics();
        for (let r = 0; r < 5; r++) {
            const rx = 100 + r * 180;
            const rayWidth = 30 + Math.random() * 20;

            for (let y = 0; y < GAME_HEIGHT; y += 8) {
                const spread = y * 0.15;
                const alpha = 0.1 * (1 - y / GAME_HEIGHT);
                rayGraphics.fillStyle(0xffffcc, alpha);
                rayGraphics.fillRect(rx - rayWidth/2 - spread/2, y, rayWidth + spread, 8);
            }
        }
        rayGraphics.setBlendMode('ADD');

        // Floating dust motes
        this.epicDust = [];
        for (let i = 0; i < 25; i++) {
            const dust = this.add.rectangle(
                Math.random() * GAME_WIDTH,
                Math.random() * GAME_HEIGHT,
                2, 2,
                0xffffaa,
                0.4 + Math.random() * 0.3
            );
            dust.setBlendMode('ADD');
            dust.vx = (Math.random() - 0.5) * 0.3;
            dust.vy = -0.1 - Math.random() * 0.2;
            dust.wobblePhase = Math.random() * Math.PI * 2;
            this.epicDust.push(dust);
        }

        // Pixel pillars/ruins in background
        const ruinGraphics = this.add.graphics();
        const pillarPositions = [50, 200, 600, 950, 1100];
        pillarPositions.forEach((px, idx) => {
            const height = 150 + Math.random() * 100;
            const broken = Math.random() > 0.5;

            for (let py = 0; py < height; py += 8) {
                const shade = 0x333344 + (py % 16 === 0 ? 0x111111 : 0);
                ruinGraphics.fillStyle(shade, 0.5);
                ruinGraphics.fillRect(px, GAME_HEIGHT - py - 8, 24, 8);

                if (broken && py > height - 40) {
                    if (Math.random() > 0.3) continue; // Skip some blocks for broken look
                }
            }
        });
    }

    createPixelDefaultBackground() {
        // Simple animated pixel particles
        this.defaultParticles = [];
        for (let i = 0; i < 20; i++) {
            const particle = this.add.rectangle(
                Math.random() * GAME_WIDTH,
                Math.random() * GAME_HEIGHT,
                4, 4,
                0x666688,
                0.3
            );
            particle.vx = (Math.random() - 0.5) * 0.5;
            particle.vy = (Math.random() - 0.5) * 0.5;
            this.defaultParticles.push(particle);
        }
    }

    // Update animated backgrounds (call in update loop)
    updatePixelBackgrounds() {
        this.skyTime = (this.skyTime || 0) + 0.016;

        // Update star twinkle
        if (this.pixelStars) {
            this.pixelStars.forEach(star => {
                star.setAlpha(star.baseAlpha * (0.5 + 0.5 * Math.sin(this.skyTime * star.twinkleSpeed + star.twinkleOffset)));
            });
        }

        // Update embers
        if (this.pixelEmbers) {
            this.pixelEmbers.forEach(ember => {
                ember.y += ember.vy;
                ember.x += ember.vx + Math.sin(this.skyTime * 2 + ember.x * 0.01) * 0.3;
                if (ember.y < -10) {
                    ember.y = GAME_HEIGHT + 10;
                    ember.x = Math.random() * GAME_WIDTH;
                }
            });
        }

        // Update snow
        if (this.pixelSnow) {
            this.pixelSnow.forEach(snow => {
                snow.y += snow.vy;
                snow.x += snow.vx + Math.sin(this.skyTime + snow.y * 0.01) * 0.2;
                if (snow.y > GAME_HEIGHT + 10) {
                    snow.y = -10;
                    snow.x = Math.random() * GAME_WIDTH;
                }
            });
        }

        // Update aurora
        if (this.auroraGraphics) {
            this.auroraPhase += 0.02;
            if (Math.floor(this.skyTime * 10) % 3 === 0) {
                this.drawPixelAurora();
            }
        }

        // Update cyber scanlines and data
        if (this.scanlineGraphics) {
            this.scanlineGraphics.clear();
            this.scanlineY = (this.scanlineY + 3) % GAME_HEIGHT;
            this.scanlineGraphics.fillStyle(0x00ffff, 0.2);
            this.scanlineGraphics.fillRect(0, this.scanlineY, GAME_WIDTH, 2);
            this.scanlineGraphics.fillStyle(0xff00ff, 0.1);
            this.scanlineGraphics.fillRect(0, (this.scanlineY + 100) % GAME_HEIGHT, GAME_WIDTH, 2);
        }

        if (this.dataStreams && this.dataGraphics) {
            this.dataGraphics.clear();
            this.dataStreams.forEach(stream => {
                stream.chars.forEach((char, i) => {
                    char.y += stream.speed;
                    if (char.y > GAME_HEIGHT) char.y = -20;
                    this.dataGraphics.fillStyle(0x00ff00, char.alpha * 0.5);
                    this.dataGraphics.fillRect(stream.x, char.y, 4, 8);
                });
            });
        }

        // Update clouds
        if (this.pixelClouds) {
            this.pixelClouds.forEach(cloud => {
                cloud.x += cloud.vx;
                if (cloud.x > GAME_WIDTH + 150) {
                    cloud.x = -150;
                }
            });
        }

        // Update default particles
        if (this.defaultParticles) {
            this.defaultParticles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > GAME_WIDTH) p.vx *= -1;
                if (p.y < 0 || p.y > GAME_HEIGHT) p.vy *= -1;
            });
        }

        // Update fireflies (nature theme)
        if (this.pixelFireflies) {
            this.pixelFireflies.forEach(ff => {
                ff.x = ff.baseX + Math.sin(this.skyTime * 0.5 + ff.phase) * 30;
                ff.y = ff.baseY + Math.cos(this.skyTime * 0.7 + ff.phase) * 20;
                ff.setAlpha(0.3 + 0.7 * Math.abs(Math.sin(this.skyTime * 2 + ff.glowPhase)));
            });
        }

        // Update falling leaves (nature theme)
        if (this.pixelLeaves) {
            this.pixelLeaves.forEach(leaf => {
                leaf.x += leaf.vx + Math.sin(this.skyTime + leaf.y * 0.02) * 0.3;
                leaf.y += leaf.vy;
                leaf.angle += leaf.spin;
                if (leaf.y > GAME_HEIGHT + 10) {
                    leaf.y = -10;
                    leaf.x = Math.random() * GAME_WIDTH;
                }
            });
        }

        // Update epic dust motes
        if (this.epicDust) {
            this.epicDust.forEach(dust => {
                dust.x += dust.vx + Math.sin(this.skyTime * 0.3 + dust.wobblePhase) * 0.2;
                dust.y += dust.vy;
                if (dust.y < -10) {
                    dust.y = GAME_HEIGHT + 10;
                    dust.x = Math.random() * GAME_WIDTH;
                }
            });
        }
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
        const graphics = this.add.graphics();
        const ps = 8; // pixel block size

        const cols = Math.ceil(width / ps);
        const rows = Math.ceil(height / ps);

        if (type === 'main') {
            // Grass-top stone brick platform
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const px = -width / 2 + col * ps;
                    const py = -height / 2 + row * ps;
                    let c;
                    if (row === 0) {
                        // Grass top — alternating blades
                        c = col % 3 === 2 ? 0x2f9e44 : 0x37b24d;
                    } else if (row === 1) {
                        // Dirt layer
                        c = 0x6b4226;
                    } else {
                        // Stone bricks — mortar pattern
                        const brickRow = row - 2;
                        const shift = (brickRow % 2) * Math.floor(ps * 1.5);
                        const brickId = Math.floor((col * ps + shift) / (ps * 2)) + brickRow * 3;
                        const shade = brickId % 4;
                        c = shade === 0 ? 0x495057 : shade === 1 ? 0x6c757d : shade === 2 ? 0x868e96 : 0x343a40;
                    }
                    // Mortar seam on left/bottom edges
                    if (col === 0 || row === rows - 1) c = 0x212529;
                    graphics.fillStyle(c, 1);
                    graphics.fillRect(px, py, ps - 1, ps - 1);
                }
            }
            // Grass highlight strip
            graphics.fillStyle(0x74c476, 0.7);
            graphics.fillRect(-width / 2 + 1, -height / 2 + 1, width - 2, 3);
            // Red neon underglow
            graphics.fillStyle(0xe94560, 0.25);
            graphics.fillRect(-width / 2, height / 2 - 2, width, 2);
        } else {
            // Floating crystal/metal platform
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const px = -width / 2 + col * ps;
                    const py = -height / 2 + row * ps;
                    let c;
                    if (row === 0) {
                        c = col % 2 === 0 ? 0x74c0fc : 0x4dabf7;
                    } else if (row === 1) {
                        c = 0x339af0;
                    } else {
                        const v = (col + row) % 3;
                        c = v === 0 ? 0x1864ab : v === 1 ? 0x1c7ed6 : 0x1971c2;
                    }
                    if (col === 0 || col === cols - 1) c = 0x0c4a6e;
                    graphics.fillStyle(c, 1);
                    graphics.fillRect(px, py, ps - 1, ps - 1);
                }
            }
            // Top shimmer
            graphics.fillStyle(0xbae6fd, 0.8);
            graphics.fillRect(-width / 2 + 2, -height / 2 + 1, width - 4, 2);
            // Cyan neon underglow
            graphics.fillStyle(0x00ffff, 0.2);
            graphics.fillRect(-width / 2, height / 2 - 2, width, 2);
        }

        graphics.setPosition(x, y);
        const platform = this.add.zone(x, y, width, height);
        this.physics.add.existing(platform, true);
        platform.graphics = graphics;
        platform.isPassthrough = type === 'floating';
        return platform;
    }


    createFighters() {
        // Find main platform to calculate spawn positions
        const mainPlatform = this.currentArena.platforms.find(p => p.type === 'main');
        const spawnY = mainPlatform.y - 60; // Spawn 60 pixels above main platform

        // Calculate spawn X positions based on platform width
        const platformLeft = mainPlatform.x - mainPlatform.width / 2;
        const platformRight = mainPlatform.x + mainPlatform.width / 2;
        const spawnOffset = Math.min(200, mainPlatform.width / 3); // Safe distance from edges

        const p1SpawnX = platformLeft + spawnOffset;
        const p2SpawnX = platformRight - spawnOffset;

        // Create Player 1 - left side of platform
        this.player1 = this.createFighter(p1SpawnX, spawnY, this.player1Data, 1);

        // Create Player 2 - right side of platform
        this.player2 = this.createFighter(p2SpawnX, spawnY, this.player2Data, 2);

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
        // BRIGHTER Cyber-Minecraft style panel
        const bgColor = 0x2a2a4e;  // Much brighter!
        const borderColor = 0x00ffff;

        // Outer BRIGHT glow - multiple layers
        graphics.fillStyle(borderColor, 0.3);
        graphics.fillRect(x - 4, y - 4, width + 8, height + 8);
        graphics.fillStyle(borderColor, 0.2);
        graphics.fillRect(x - 3, y - 3, width + 6, height + 6);
        graphics.fillStyle(borderColor, 0.1);
        graphics.fillRect(x - 2, y - 2, width + 4, height + 4);

        // Brighter background
        graphics.fillStyle(0x1a1a3e, 0.9);
        graphics.fillRect(x, y, width, height);

        // BRIGHT inner area
        graphics.fillStyle(bgColor, 0.95);
        graphics.fillRect(x + 2, y + 2, width - 4, height - 4);

        // BRIGHT neon border
        graphics.fillStyle(borderColor, 1);
        graphics.fillRect(x + 2, y + 2, width - 4, 3);  // Thicker
        graphics.fillRect(x + 2, y + height - 5, width - 4, 3);
        graphics.fillRect(x + 2, y + 2, 3, height - 4);
        graphics.fillRect(x + width - 5, y + 2, 3, height - 4);

        // BRIGHT corner accents
        graphics.fillStyle(0xff00ff, 1);
        graphics.fillRect(x, y, 6, 6);  // Bigger
        graphics.fillRect(x + width - 6, y, 6, 6);
        graphics.fillRect(x, y + height - 6, 6, 6);
        graphics.fillRect(x + width - 6, y + height - 6, 6, 6);

        // Add inner glow
        graphics.fillStyle(0xffffff, 0.1);
        graphics.fillRect(x + 4, y + 4, width - 8, height - 8);
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

        // Player 2 controls (IJKL + U/O for attack, H/Y for special)
        this.p2Keys = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
            attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U),
            attackAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
            special: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
            specialAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y)
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
            // Safety check - make sure both objects exist
            if (!obj1 || !obj2) return;

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

            // Extra safety checks
            if (!projectile || !projectile.active) return;
            if (!fighter || !fighter.body) return;
            if (!fighter.active) return;
            if (projectile.hasHit) return;

            // Don't hit the owner of the projectile
            if (projectile.owner === fighter) return;

            // Don't hit invincible fighters
            if (fighter.isInvincible) return;

            // Check fighter has characterData (is actually a fighter)
            if (!fighter.characterData) return;

            // Mark as hit BEFORE applying damage to prevent double-hits
            projectile.hasHit = true;

            try {
                // Get attack data from projectile with safe defaults
                const damage = (typeof projectile.attackDamage === 'number' && projectile.attackDamage > 0) ? projectile.attackDamage : 15;
                const knockback = (typeof projectile.attackKnockback === 'number' && projectile.attackKnockback > 0) ? projectile.attackKnockback : 1.2;
                const direction = (typeof projectile.x === 'number' && typeof fighter.x === 'number') ? (projectile.x < fighter.x ? 1 : -1) : 1;

                // Apply damage properly
                this.applyDamage(fighter, damage, knockback, direction);
            } catch (e) {
                console.warn('Error applying projectile damage:', e);
            }

            try {
                if (projectile && projectile.active && projectile.destroy) {
                    projectile.destroy();
                }
            } catch (e) {
                console.warn('Error destroying projectile:', e);
            }
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
                    SFX.countdown();
                    countdownText.setText(count.toString());
                    this.tweens.add({
                        targets: countdownText,
                        scaleX: 1.5,
                        scaleY: 1.5,
                        duration: 100,
                        yoyo: true
                    });
                } else if (count === 0) {
                    SFX.countdownGo();
                    Music.play('battle');
                    countdownText.setText('FIGHT!');
                    countdownText.setFontSize(80);
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
        // Always update animated backgrounds (even during countdown)
        this.updatePixelBackgrounds();

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
                SFX.jump();
                this.createJumpEffect(fighter);
                this.playAnimation(fighter, 'jump');
            } else if (fighter.canDoubleJump) {
                fighter.body.setVelocityY(DOUBLE_JUMP_VELOCITY * char.jumpPower);
                fighter.canDoubleJump = false;
                SFX.doubleJump();
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
            SFX.attack();
            this.createMeleeAttack(fighter, attack);
        } else {
            fighter.specialCooldown = SPECIAL_COOLDOWN;
            this.playAnimation(fighter, 'special');
            SFX.special();
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
        const effectType = fighter.characterData.attackEffect || 'slash_default';

        // Create varied visual effects based on character
        this.createMeleeEffect(fighter, direction, effectType);

        // Check hit
        const hitbox = {
            x: fighter.x + direction * attack.range / 2,
            y: fighter.y,
            width: attack.range,
            height: 50
        };

        const opponent = fighter.opponent;
        if (opponent && this.checkHitbox(hitbox, opponent) && !opponent.isInvincible) {
            this.applyDamage(opponent, attack.damage, attack.knockback, direction);
        }
    }

    // Check if two fighters overlap
    checkOverlap(fighter1, fighter2) {
        try {
            if (!fighter1 || !fighter2) return false;
            if (!fighter1.body || !fighter2.body) return false;
            if (!fighter1.active || !fighter2.active) return false;

            const bounds1 = fighter1.body.getBounds();
            const bounds2 = fighter2.body.getBounds();

            if (!bounds1 || !bounds2) return false;

            return Phaser.Geom.Rectangle.Overlaps(bounds1, bounds2);
        } catch (e) {
            console.warn('checkOverlap error:', e);
            return false;
        }
    }

    // Create pixelated particles
    createPixelParticles(x, y, color, count, spread, speed, gravity = 0) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            const size = 2 + Math.floor(Math.random() * 4);
            const particle = this.add.rectangle(x, y, size, size, color);
            particle.setBlendMode('ADD');

            const angle = Math.random() * Math.PI * 2;
            const velocity = speed * (0.5 + Math.random() * 0.5);
            const vx = Math.cos(angle) * velocity * spread;
            const vy = Math.sin(angle) * velocity * spread - speed * 0.5;

            particles.push({ obj: particle, vx, vy, gravity });
        }

        // Animate particles
        let frame = 0;
        const updateParticles = () => {
            frame++;
            particles.forEach(p => {
                p.obj.x += p.vx;
                p.obj.y += p.vy;
                p.vy += p.gravity;
                p.obj.alpha = Math.max(0, 1 - frame / 15);
            });

            if (frame < 15) {
                this.time.delayedCall(16, updateParticles);
            } else {
                particles.forEach(p => p.obj.destroy());
            }
        };
        updateParticles();
    }

    // Screen shake effect - gentle version
    doScreenShake(intensity = 5, duration = 100) {
        // Much more subtle - reduced by 70%
        this.cameras.main.shake(duration * 0.5, intensity / 4000);
    }

    // Hitstop effect (freeze frame) - subtle version
    doHitstop(duration = 50) {
        // Cap at 25ms for subtle effect
        const reducedDuration = Math.min(duration * 0.4, 25);
        this.physics.world.pause();
        this.time.delayedCall(reducedDuration, () => {
            this.physics.world.resume();
        });
    }

    // Create pixelated slash trail
    createPixelSlash(x, y, direction, color, size = 40) {
        const g = this.add.graphics();
        g.setBlendMode('ADD');

        const baseAngle = direction > 0 ? -0.95 : Math.PI + 0.95;
        const sweep = 1.9 * direction;
        const segs = 18;

        // Three concentric arc layers: outer (dim), mid (bright), inner-edge (white glow)
        const layers = [
            { r: size + 10, ps: 7, baseAlpha: 0.45 },
            { r: size,      ps: 5, baseAlpha: 0.85 },
            { r: size - 10, ps: 4, baseAlpha: 1.00 },
        ];

        layers.forEach(({ r, ps, baseAlpha }) => {
            for (let i = 0; i < segs; i++) {
                const t = i / (segs - 1);
                const angle = baseAngle + sweep * t;
                const px = x + Math.cos(angle) * r;
                const py = y + Math.sin(angle) * r;

                // Main arc colour — brighter on leading edge
                g.fillStyle(color, baseAlpha * (0.3 + t * 0.7));
                g.fillRect(px - ps / 2, py - ps / 2, ps, ps);

                // White hot leading edge highlight
                if (t > 0.55) {
                    g.fillStyle(0xffffff, baseAlpha * (t - 0.55) * 2.2);
                    g.fillRect(px - 2, py - 2, 3, 3);
                }
            }
        });

        // Ghost outer trail
        for (let i = 0; i < Math.floor(segs * 0.65); i++) {
            const t = i / (segs * 0.65 - 1);
            const angle = baseAngle + sweep * t * 0.75;
            const px = x + Math.cos(angle) * (size + 22);
            const py = y + Math.sin(angle) * (size + 22);
            g.fillStyle(0xffffff, 0.18 * t);
            g.fillRect(px - 3, py - 3, 4, 4);
        }

        // Speed-line streak from centre to arc
        for (let i = 0; i < 4; i++) {
            const t = i / 3;
            const angle = baseAngle + sweep * t;
            for (let s = 0; s < 5; s++) {
                const dist = 8 + s * (size / 5);
                g.fillStyle(color, 0.5 * (1 - s / 5));
                g.fillRect(x + Math.cos(angle) * dist - 1, y + Math.sin(angle) * dist - 1, 2, 2);
            }
        }

        this.tweens.add({
            targets: g,
            alpha: 0,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 150,
            ease: 'Power2',
            onComplete: () => g.destroy()
        });
        return g;
    }

    // Create pixelated hit impact effect when damage is taken

    // Create pixelated hit impact effect when damage is taken
    createPixelHitEffect(x, y, damage, direction) {
        const intensity = Math.min(damage / 10, 2);
        const base = 14 + intensity * 9;

        // Ground shadow
        const shadow = this.add.graphics();
        shadow.fillStyle(0x333333, 0.45);
        shadow.fillEllipse(x, y + 28, base * 3.2, base * 0.9);
        this.tweens.add({ targets: shadow, alpha: 0, duration: 320, onComplete: () => shadow.destroy() });

        // Main explosion
        const g = this.add.graphics();
        g.setBlendMode('ADD');

        // Fire blobs layered red -> orange -> yellow -> white
        const fireLayers = [
            { color: 0xff2200, r: base * 1.1, count: 8, ps: 7 },
            { color: 0xff6600, r: base * 0.82, count: 7, ps: 6 },
            { color: 0xffaa00, r: base * 0.55, count: 6, ps: 5 },
            { color: 0xffee44, r: base * 0.32, count: 5, ps: 4 },
            { color: 0xffffff, r: base * 0.12, count: 4, ps: 3 },
        ];
        fireLayers.forEach(function(layer) {
            for (let i = 0; i < layer.count; i++) {
                const angle = (i / layer.count) * Math.PI * 2 + Math.random() * 0.4;
                const dist = layer.r * (0.55 + Math.random() * 0.55);
                g.fillStyle(layer.color, 0.92);
                g.fillRect(x + Math.cos(angle) * dist - layer.ps / 2, y + Math.sin(angle) * dist - layer.ps / 2, layer.ps, layer.ps);
            }
        });

        // Lightning bolt lines
        const boltPalette = [0xffffff, 0xffff88, 0xffdd00];
        for (let b = 0; b < 5; b++) {
            const bAngle = (b / 5) * Math.PI * 2 + Math.random() * 0.5;
            let bx = x, by = y;
            const bc = boltPalette[b % boltPalette.length];
            for (let s = 0; s < 5; s++) {
                const reach = base * 0.4 + s * base * 0.28;
                const jx = (Math.random() - 0.5) * 9;
                const jy = (Math.random() - 0.5) * 9;
                const nx = x + Math.cos(bAngle) * reach + jx;
                const ny = y + Math.sin(bAngle) * reach + jy;
                g.fillStyle(bc, 1 - s * 0.17);
                g.fillRect(Math.min(bx, nx) - 1, Math.min(by, ny) - 1, Math.abs(nx - bx) + 3, Math.abs(ny - by) + 3);
                bx = nx; by = ny;
            }
        }

        // Centre white flash
        g.fillStyle(0xffffff, 1);
        g.fillRect(x - 6, y - 6, 12, 12);
        g.fillStyle(0xffffaa, 1);
        g.fillRect(x - 4, y - 4, 8, 8);

        this.tweens.add({
            targets: g,
            alpha: 0,
            scaleX: 1.6 + intensity * 0.3,
            scaleY: 1.6 + intensity * 0.3,
            duration: 200,
            ease: 'Power2',
            onComplete: () => g.destroy()
        });

        // Flying fire sparks
        this.createPixelParticles(x, y, 0xff8800, Math.floor(6 + damage / 2), 1.3, 5, -0.25);
        this.createPixelParticles(x, y, 0xffff00, Math.floor(4 + damage / 3), 0.9, 4, -0.35);

        // Big hit text
        if (damage >= 15) {
            const pows = ['POW!', 'BAM!', 'KA-POW!'];
            const pow = pows[Math.floor(Math.random() * pows.length)];
            const sz = (14 + Math.floor(intensity * 4)) + 'px';
            const hitText = this.add.text(x, y - 28, pow, {
                fontFamily: 'monospace', fontSize: sz, fontStyle: 'bold',
                color: '#ffffff', stroke: '#cc4400', strokeThickness: 4
            }).setOrigin(0.5).setBlendMode('ADD');
            this.tweens.add({ targets: hitText, y: y - 65, alpha: 0, scale: 1.6, duration: 380, onComplete: () => hitText.destroy() });
        }
    }


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
            if (!fighter.active) return;
            if (!fighter.body) return;
            if (fighter.isInvincible) return;
            if (typeof damage !== 'number' || damage <= 0) return;
            if (typeof knockbackMult !== 'number' || knockbackMult <= 0) knockbackMult = 1;
            if (typeof direction !== 'number') direction = 1;

            // Initialize damage if not set
            if (typeof fighter.damage !== 'number') {
                fighter.damage = 0;
            }

            fighter.damage += damage;
            SFX.hit(fighter.damage);

            // Combo tracking - update attacker's combo
            const attacker = fighter.opponent;
            if (attacker && attacker.active && typeof attacker.comboCount !== 'undefined') {
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

            // PIXELATED HIT IMPACT EFFECT
            try {
                this.createPixelHitEffect(fighter.x, fighter.y, damage, direction);
            } catch (e) {
                // Fallback to simple effect
                try {
                    if (this.hitEmitter && fighter.x && fighter.y) {
                        this.hitEmitter.emitParticleAt(fighter.x, fighter.y, 15);
                    }
                } catch (e2) {}
            }

            // Camera effects - GENTLE version (won't hurt your eyes)
            try {
                // Very subtle shake - reduced by 80%
                const shakeIntensity = Math.min(damage * 0.0004, 0.003);
                if (this.cameras && this.cameras.main) {
                    this.cameras.main.shake(40, shakeIntensity);

                    // Subtle hitstop only on really big hits
                    if (damage >= 18) {
                        this.doHitstop(20);
                    }

                    // Flash removed to prevent errors
                }
            } catch (e) {
                // Silently fail if camera effects don't work
            }
        } catch (e) {
            console.error('Error in applyDamage:', e);
        }
    }

    showComboText(attacker, target) {
        try {
            // Safety checks
            if (!attacker || !target) return;
            if (typeof attacker.comboCount !== 'number') return;
            if (typeof target.x !== 'number' || typeof target.y !== 'number') return;

            // Only show combo text for combos of 2 or more
            if (attacker.comboCount < 2) return;

            // Remove old combo text if exists
            if (attacker.comboText && attacker.comboText.active) {
                try {
                    attacker.comboText.destroy();
                } catch (e) {}
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
        } catch (e) {
            console.warn('Error showing combo text:', e);
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
        SFX.ko();

        // Check game over first
        if (fighter.stocks <= 0) {
            // Final stock lost - trigger full KO cutscene
            this.endGame(fighter.opponent);
            return;
        }

        // Stock lost but not game over - CINEMATIC KO ZOOM
        try {
            // Capture fighter position before any changes
            const koX = fighter.x;
            const koY = fighter.y;

            // Extreme slow motion
            this.physics.world.timeScale = 0.15;

            // Slow, dramatic zoom and pan to defeated fighter
            this.cameras.main.pan(koX, koY, 1000, 'Power2');
            this.cameras.main.zoomTo(1.8, 1000, 'Power2');

            // Cyber glitch flash effect (staggered)
            this.time.delayedCall(200, () => {
                this.cameras.main.flash(120, 255, 0, 0, true);
            });
            this.time.delayedCall(350, () => {
                this.cameras.main.flash(100, 255, 0, 0, true);
            });
            this.time.delayedCall(500, () => {
                this.cameras.main.flash(80, 255, 0, 0, true);
            });

            // Massive impact shockwaves
            for (let r = 0; r < 5; r++) {
                this.time.delayedCall(r * 80, () => {
                    const ring1 = this.add.circle(koX, koY, 15, 0x00ffff, 0);
                    ring1.setStrokeStyle(3, 0x00ffff, 0.9);
                    ring1.setDepth(998);

                    const ring2 = this.add.circle(koX, koY, 15, 0xff0000, 0);
                    ring2.setStrokeStyle(2, 0xff0000, 0.7);
                    ring2.setDepth(998);

                    this.tweens.add({
                        targets: ring1,
                        radius: 120 + r * 25,
                        alpha: 0,
                        duration: 600,
                        ease: 'Power2',
                        onComplete: () => ring1.destroy()
                    });

                    this.tweens.add({
                        targets: ring2,
                        radius: 130 + r * 25,
                        alpha: 0,
                        duration: 650,
                        ease: 'Power2',
                        onComplete: () => ring2.destroy()
                    });
                });
            }

            // Pixel disintegration effect
            for (let i = 0; i < 8; i++) {
                this.time.delayedCall(i * 50, () => {
                    this.createPixelParticles(koX, koY, 0xff0000, 25, 2.5 + i * 0.2, 7);
                    this.createPixelParticles(koX, koY, 0x00ffff, 20, 2.2 + i * 0.2, 6);
                    this.createPixelParticles(koX, koY, 0xffffff, 15, 1.8 + i * 0.2, 5);
                });
            }

            // Lightning strike effect
            this.time.delayedCall(250, () => {
                const lightning = this.add.graphics();
                lightning.setDepth(999);
                lightning.lineStyle(4, 0x00ffff, 0.9);
                lightning.lineBetween(koX, koY - 200, koX, koY + 50);
                lightning.lineStyle(2, 0xffffff, 1);
                lightning.lineBetween(koX, koY - 200, koX, koY + 50);

                this.tweens.add({
                    targets: lightning,
                    alpha: 0,
                    duration: 400,
                    onComplete: () => lightning.destroy()
                });
            });

            // Reset camera and time after effect, THEN respawn
            this.time.delayedCall(1200, () => {
                this.physics.world.timeScale = 1;
                this.cameras.main.pan(GAME_WIDTH / 2, GAME_HEIGHT / 2, 500, 'Power2');
                this.cameras.main.zoomTo(1.0, 500, 'Power2');

                // Respawn AFTER animation and physics are back to normal
                this.respawnFighter(fighter);
            });
        } catch (e) {
            // If animation fails, still respawn
            this.physics.world.timeScale = 1;
            this.respawnFighter(fighter);
        }

        // Make fighter temporarily invincible and hidden during KO animation
        fighter.isInvincible = true;
        fighter.body.enable = false;
        fighter.setAlpha(0);
    }

    respawnFighter(fighter) {
        // Calculate spawn position based on main platform
        const mainPlatform = this.currentArena.platforms.find(p => p.type === 'main');
        const spawnY = mainPlatform.y - 60;

        const platformLeft = mainPlatform.x - mainPlatform.width / 2;
        const platformRight = mainPlatform.x + mainPlatform.width / 2;
        const spawnOffset = Math.min(200, mainPlatform.width / 3);

        // Reset position - spawn on appropriate side of platform
        fighter.x = fighter.playerNum === 1 ? platformLeft + spawnOffset : platformRight - spawnOffset;
        fighter.y = spawnY;
        fighter.body.setVelocity(0, 0);
        fighter.damage = 0;

        // Reset combo
        fighter.comboCount = 0;

        // Ensure fighter is active, visible, and physics body works
        fighter.setAlpha(1);
        SFX.respawn();
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

        // Start dramatic KO cutscene
        this.playKOCutscene(winner);
    }

    playKOCutscene(winner) {
        const loser = winner === this.player1 ? this.player2 : this.player1;

        // Extreme slow motion for dramatic effect
        this.physics.world.timeScale = 0.1;

        // Intense camera shake
        this.cameras.main.shake(800, 0.04);

        // Dark red flash (not yellow/gold)
        const flash = this.add.rectangle(
            GAME_WIDTH / 2, GAME_HEIGHT / 2,
            GAME_WIDTH, GAME_HEIGHT,
            0xff0000, 0.5
        );
        flash.setDepth(1000);
        flash.setScrollFactor(0);
        flash.setBlendMode('ADD');

        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 400,
            onComplete: () => flash.destroy()
        });

        // Dramatic zoom to winner
        this.cameras.main.pan(winner.x, winner.y - 30, 600, 'Power2');
        this.cameras.main.zoomTo(1.6, 600, 'Power2');

        // Massive explosion at loser
        this.time.delayedCall(100, () => {
            this.createPixelParticles(loser.x, loser.y, 0xff0000, 80, 4, 12);
            this.createPixelParticles(loser.x, loser.y, 0x000000, 60, 3.5, 10);
            this.createPixelParticles(loser.x, loser.y, 0xffffff, 40, 3, 8);
        });

        // Dark energy particles around winner
        this.time.delayedCall(200, () => {
            for (let i = 0; i < 6; i++) {
                this.time.delayedCall(i * 80, () => {
                    this.createPixelParticles(winner.x, winner.y - 40, 0xff0000, 25, 2.5, 7);
                    this.createPixelParticles(winner.x, winner.y - 40, 0x00ffff, 20, 2, 6);
                    this.createPixelParticles(winner.x, winner.y - 40, 0x000000, 15, 1.5, 5);
                });
            }
        });

        // Shockwave rings around winner
        for (let i = 0; i < 4; i++) {
            this.time.delayedCall(300 + i * 100, () => {
                const ring = this.add.circle(winner.x, winner.y, 20, 0xff0000, 0);
                ring.setStrokeStyle(3, 0xff0000, 0.8);
                ring.setDepth(999);
                ring.setBlendMode('ADD');

                this.tweens.add({
                    targets: ring,
                    radius: 150 + i * 30,
                    alpha: 0,
                    duration: 700,
                    ease: 'Power2',
                    onComplete: () => ring.destroy()
                });
            });
        }

        // Freeze physics
        this.time.delayedCall(500, () => {
            this.physics.pause();
        });

        // Screen distortion effect (no text)
        this.time.delayedCall(600, () => {
            // Dark vignette
            const vignette = this.add.graphics();
            vignette.fillStyle(0x000000, 0);
            vignette.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 500);
            vignette.setDepth(1001);
            vignette.setScrollFactor(0);

            this.tweens.add({
                targets: vignette,
                alpha: 0.7,
                duration: 800,
                ease: 'Power2'
            });

            // Glitch lines
            for (let i = 0; i < 8; i++) {
                this.time.delayedCall(i * 100, () => {
                    const glitch = this.add.graphics();
                    glitch.fillStyle(0xff0000, 0.3);
                    glitch.fillRect(0, Math.random() * GAME_HEIGHT, GAME_WIDTH, 3);
                    glitch.setDepth(1002);
                    glitch.setScrollFactor(0);
                    glitch.setBlendMode('ADD');

                    this.tweens.add({
                        targets: glitch,
                        alpha: 0,
                        duration: 150,
                        onComplete: () => glitch.destroy()
                    });
                });
            }

            // Screen shake for emphasis
            this.cameras.main.shake(1200, 0.01);
        });

        // Transition to victory scene
        this.time.delayedCall(2200, () => {
            this.cameras.main.fadeOut(600, 0, 0, 0);

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('VictoryScene', {
                    winner: winner,
                    mode: this.gameMode,
                    player1: this.player1Data,
                    player2: this.player2Data,
                    arena: this.currentArena,
                    aiDifficulty: this.aiDifficulty
                });
            });
        });
    }
}
