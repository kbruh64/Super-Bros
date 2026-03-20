const fs = require('fs');

let src = fs.readFileSync('js/scenes/GameScene.js.bak', 'utf8');
console.log('Read backup:', src.split('\n').length, 'lines');

function findFunctionEnd(s, startIdx) {
    let depth = 0, i = startIdx, inStr = false, strChar = '', inLineComment = false, inBlockComment = false;
    let foundOpen = false;
    while (i < s.length) {
        const c = s[i];
        if (inLineComment) { if (c === '\n') inLineComment = false; i++; continue; }
        if (inBlockComment) { if (c === '*' && s[i+1] === '/') { inBlockComment = false; i += 2; } else i++; continue; }
        if (inStr) {
            if (c === '\\') { i += 2; continue; }
            if (c === strChar) inStr = false;
            i++; continue;
        }
        if (c === '/' && s[i+1] === '/') { inLineComment = true; i += 2; continue; }
        if (c === '/' && s[i+1] === '*') { inBlockComment = true; i += 2; continue; }
        if (c === '"' || c === "'" || c === '`') { inStr = true; strChar = c; i++; continue; }
        if (c === '{') { depth++; foundOpen = true; }
        if (c === '}') { depth--; if (foundOpen && depth === 0) { return i + 1; } }
        i++;
    }
    return -1;
}

let changes = 0;
function replace(old, neo) {
    if (src.indexOf(old) === -1) { console.warn('NOT FOUND:', old.slice(0, 60).replace(/\n/g, '\\n')); return; }
    src = src.replace(old, neo);
    changes++;
}

// ── 1. createShadowAttack: null check in delayed callback ──
replace(
    '        this.time.delayedCall(200, () => {\n            const behindX = opponent.x - direction * 60;',
    '        this.time.delayedCall(200, () => {\n            if (!opponent || !opponent.active) { if (fighter.sprite) fighter.sprite.setAlpha(1); return; }\n            const behindX = opponent.x - direction * 60;'
);

// ── 2. createReapAttack: fix fighter.health (doesn't exist) ──
replace(
    '            // Heal fighter\n            fighter.health = Math.min(fighter.maxHealth, fighter.health + 10);',
    '            // Reduce fighter damage percentage\n            fighter.damage = Math.max(0, fighter.damage - 10);'
);

// ── 3. createSlowAttack: fix direction 0 ──
replace(
    '        this.applyDamage(opponent, attack.damage, attack.knockback, 0);\n    }\n\n    // SMITE',
    '        this.applyDamage(opponent, attack.damage, attack.knockback, direction);\n    }\n\n    // SMITE'
);

// ── 4. createStealAttack: null check in onUpdate ──
replace(
    '            onUpdate: () => {\n                const dist = Phaser.Math.Distance.Between(steal.x, steal.y, opponent.x, opponent.y);\n                if (dist < 30 && !steal.hasHit)',
    '            onUpdate: () => {\n                if (!opponent || !opponent.active || steal.hasHit) return;\n                const dist = Phaser.Math.Distance.Between(steal.x, steal.y, opponent.x, opponent.y);\n                if (dist < 30 && !steal.hasHit)'
);

// ── 5. createElementsAttack: null check in onUpdate ──
replace(
    '                    onUpdate: () => {\n                        const opponent = fighter === this.player1 ? this.player2 : this.player1;\n                        const dist = Phaser.Math.Distance.Between(ball.x, ball.y, opponent.x, opponent.y);',
    '                    onUpdate: () => {\n                        const opponent = fighter === this.player1 ? this.player2 : this.player1;\n                        if (!opponent || !opponent.active || ball.hasHit) return;\n                        const dist = Phaser.Math.Distance.Between(ball.x, ball.y, opponent.x, opponent.y);'
);

// ── 6. createGravityAttack: guard setVelocityY calls ──
replace(
    '        // Pull opponent and slow\n        opponent.body.setVelocityY(-200);\n        this.time.delayedCall(100, () => {\n            opponent.body.setVelocityY(300);\n        });\n\n        this.time.delayedCall(200, () => {\n            const dist = Phaser.Math.Distance.Between(well.x, well.y, opponent.x, opponent.y);\n            if (dist < 80) {\n                this.applyDamage(opponent, attack.damage, attack.knockback, 0);\n            }\n        });',
    '        // Pull opponent and slow\n        if (opponent && opponent.active && opponent.body) opponent.body.setVelocityY(-200);\n        this.time.delayedCall(100, () => {\n            if (opponent && opponent.active && opponent.body) opponent.body.setVelocityY(300);\n        });\n\n        this.time.delayedCall(200, () => {\n            if (!opponent || !opponent.active) return;\n            const dist = Phaser.Math.Distance.Between(well.x, well.y, opponent.x, opponent.y);\n            if (dist < 80) {\n                this.applyDamage(opponent, attack.damage, attack.knockback, direction);\n            }\n        });'
);

console.log('Special attack fixes applied:', changes);

// ── 7. Music: play battle at FIGHT! ──
replace(
    '                    SFX.countdownGo();\n                    countdownText.setText(\'FIGHT!\');',
    '                    SFX.countdownGo();\n                    if (typeof Music !== \'undefined\') Music.play(\'battle\');\n                    countdownText.setText(\'FIGHT!\');'
);

console.log('Music hook applied, total changes:', changes);

// ── 8. Replace createPixelSlash using brace counting ──
{
    const fnMarker = '    createPixelSlash(';
    const startIdx = src.indexOf(fnMarker);
    if (startIdx === -1) { console.warn('WARNING: createPixelSlash not found'); }
    else {
        const endIdx = findFunctionEnd(src, startIdx);
        if (endIdx === -1) { console.warn('WARNING: createPixelSlash end not found'); }
        else {
            console.log('createPixelSlash:', startIdx, '->', endIdx);
            const newFn = `    createPixelSlash(x, y, direction, color, size) {
        const g = this.add.graphics();

        // Three arc layers: outer ghost trail, mid, inner
        const layers = [
            { r: 72, lw: 6, color: 0xffffff, alpha: 0.18 },
            { r: 58, lw: 9, color: 0x88eeff, alpha: 0.55 },
            { r: 44, lw: 7, color: 0xffffff, alpha: 0.90 },
        ];
        layers.forEach(({ r, lw, color, alpha }) => {
            g.lineStyle(lw, color, alpha);
            const startA = direction > 0 ? Math.PI * 0.85 : Math.PI * 0.15;
            const endA   = direction > 0 ? Math.PI * 0.15 : Math.PI * 0.85;
            g.beginPath();
            g.arc(x, y, r, startA, endA, direction > 0);
            g.strokePath();
        });

        // Speed lines
        for (let i = 0; i < 5; i++) {
            const ang = (direction > 0 ? Math.PI : 0) + (Math.random() - 0.5) * 0.9;
            const len = 18 + Math.random() * 28;
            g.lineStyle(2, 0xffffff, 0.45);
            g.beginPath();
            g.moveTo(x, y + (Math.random() - 0.5) * 60);
            g.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
            g.strokePath();
        }

        this.tweens.add({
            targets: g,
            alpha: 0,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 220,
            ease: 'Power2',
            onComplete: () => g.destroy()
        });
    }`;
            src = src.slice(0, startIdx) + newFn + src.slice(endIdx);
            console.log('Replaced createPixelSlash');
        }
    }
}

// ── 9. Replace createPixelHitEffect using brace counting ──
{
    const fnMarker = '    createPixelHitEffect(';
    const startIdx = src.indexOf(fnMarker);
    if (startIdx === -1) { console.warn('WARNING: createPixelHitEffect not found'); }
    else {
        const endIdx = findFunctionEnd(src, startIdx);
        if (endIdx === -1) { console.warn('WARNING: createPixelHitEffect end not found'); }
        else {
            console.log('createPixelHitEffect:', startIdx, '->', endIdx, 'length:', endIdx - startIdx);
            const newFn = `    createPixelHitEffect(x, y) {
        const g = this.add.graphics();

        // Ground shadow
        g.fillStyle(0x000000, 0.18);
        g.fillEllipse(x, y + 55, 90, 22);

        // Fire blobs: red -> orange -> yellow -> white core
        const blobs = [
            { color: 0xcc1100, r: 38, alpha: 0.85 },
            { color: 0xff4400, r: 30, alpha: 0.90 },
            { color: 0xff9900, r: 22, alpha: 0.95 },
            { color: 0xffee44, r: 13, alpha: 1.00 },
            { color: 0xffffff, r:  6, alpha: 1.00 },
        ];
        blobs.forEach(({ color, r, alpha }) => {
            g.fillStyle(color, alpha);
            for (let i = 0; i < 5; i++) {
                const ox = (Math.random() - 0.5) * r * 0.7;
                const oy = (Math.random() - 0.5) * r * 0.7 - r * 0.15;
                g.fillCircle(x + ox, y + oy, r * (0.55 + Math.random() * 0.45));
            }
        });

        // Lightning bolts
        for (let b = 0; b < 4; b++) {
            const ang = (b / 4) * Math.PI * 2 + Math.random() * 0.4;
            const len = 36 + Math.random() * 24;
            g.lineStyle(3, 0xffffff, 0.80);
            g.beginPath();
            let cx = x, cy = y;
            for (let s = 0; s < 4; s++) {
                const nx = cx + Math.cos(ang) * (len / 4) + (Math.random() - 0.5) * 14;
                const ny = cy + Math.sin(ang) * (len / 4) + (Math.random() - 0.5) * 14;
                g.lineTo(nx, ny);
                cx = nx; cy = ny;
            }
            g.strokePath();
        }

        // Center white flash
        g.fillStyle(0xffffff, 0.95);
        g.fillCircle(x, y, 10);

        // Upward sparks
        for (let i = 0; i < 7; i++) {
            const sx = x + (Math.random() - 0.5) * 50;
            const sy = y - 10 - Math.random() * 40;
            g.fillStyle(Math.random() > 0.5 ? 0xffee44 : 0xff9900, 0.90);
            g.fillRect(sx, sy, 4, 4);
        }

        this.tweens.add({
            targets: g,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            y: g.y - 20,
            duration: 320,
            ease: 'Power2',
            onComplete: () => g.destroy()
        });

        // POW text
        const words = ['POW!', 'BAM!', 'ZAP!'];
        const word = words[Math.floor(Math.random() * words.length)];
        const txt = this.add.text(x + (Math.random() - 0.5) * 40, y - 50, word, {
            fontSize: '28px', fontFamily: 'monospace',
            color: '#ffee44', stroke: '#cc4400', strokeThickness: 5
        }).setOrigin(0.5);
        this.tweens.add({
            targets: txt, y: txt.y - 40, alpha: 0, duration: 500,
            ease: 'Power2', onComplete: () => txt.destroy()
        });
    }`;
            src = src.slice(0, startIdx) + newFn + src.slice(endIdx);
            console.log('Replaced createPixelHitEffect');
        }
    }
}

// ── 10. Replace createPlatform using brace counting ──
{
    const fnMarker = '    createPlatform(';
    const startIdx = src.indexOf(fnMarker);
    if (startIdx === -1) { console.warn('WARNING: createPlatform not found'); }
    else {
        const endIdx = findFunctionEnd(src, startIdx);
        if (endIdx === -1) { console.warn('WARNING: createPlatform end not found'); }
        else {
            console.log('createPlatform:', startIdx, '->', endIdx, 'length:', endIdx - startIdx);
            const newFn = `    createPlatform(data) {
        const { x, y, width, height, type } = data;
        const S = 8; // pixel block size
        const isMain = type === 'main';

        const g = this.add.graphics();
        const ox = -width / 2;
        const oy = -height / 2;

        if (isMain) {
            const grassColors = [0x4caf50, 0x43a047, 0x388e3c];
            for (let bx = 0; bx < width; bx += S) {
                g.fillStyle(grassColors[Math.floor(bx / S) % grassColors.length], 1);
                g.fillRect(ox + bx, oy, Math.min(S, width - bx), S);
            }
            const dirtColors = [0x8d6e63, 0x795548, 0x6d4c41];
            for (let by = S; by < height; by += S) {
                for (let bx = 0; bx < width; bx += S) {
                    g.fillStyle(dirtColors[Math.floor((bx + by) / S) % dirtColors.length], 1);
                    g.fillRect(ox + bx, oy + by, Math.min(S, width - bx), Math.min(S, height - by));
                }
            }
            for (let row = 1; row * S * 2 < height; row++) {
                const by = row * S * 2;
                const offset = (row % 2) * S * 2;
                for (let bx = -offset; bx < width; bx += S * 4) {
                    g.lineStyle(1, 0x4a3728, 0.35);
                    g.strokeRect(ox + bx, oy + by, S * 4, S * 2);
                }
            }
        } else {
            const topColors = [0x00e5ff, 0x00bcd4, 0x0097a7];
            for (let bx = 0; bx < width; bx += S) {
                g.fillStyle(topColors[Math.floor(bx / S) % topColors.length], 1);
                g.fillRect(ox + bx, oy, Math.min(S, width - bx), S);
            }
            const blockColors = [0x1565c0, 0x1976d2, 0x1e88e5, 0x2196f3];
            for (let by = S; by < height; by += S) {
                for (let bx = 0; bx < width; bx += S) {
                    g.fillStyle(blockColors[Math.floor((bx / S + by / S)) % blockColors.length], 1);
                    g.fillRect(ox + bx, oy + by, Math.min(S, width - bx), Math.min(S, height - by));
                }
            }
            g.fillStyle(0xffffff, 0.55);
            for (let bx = S; bx < width; bx += S * 3) {
                g.fillRect(ox + bx, oy + 2, 3, 3);
            }
        }

        g.setPosition(x, y);

        const platform = this.add.zone(x, y, width, height);
        this.physics.add.existing(platform, true);
        platform.graphics = g;
        platform.isPassthrough = type === 'floating';
        return platform;
    }`;
            src = src.slice(0, startIdx) + newFn + src.slice(endIdx);
            console.log('Replaced createPlatform');
        }
    }
// ── 11. Replace createMeleeEffect using brace counting ──
{
    const fnMarker = '    createMeleeEffect(';
    const startIdx = src.indexOf(fnMarker);
    if (startIdx === -1) { console.warn('WARNING: createMeleeEffect not found'); }
    else {
        const endIdx = findFunctionEnd(src, startIdx);
        if (endIdx === -1) { console.warn('WARNING: createMeleeEffect end not found'); }
        else {
            console.log('createMeleeEffect:', startIdx, '->', endIdx, 'length:', endIdx - startIdx);
            const newFn = fs.readFileSync('melee_effect_new.js', 'utf8').trimEnd();
            /*    createMeleeEffect(fighter, direction, effectType) {
        const x = fighter.x + direction * 40;
        const y = fighter.y - 10;
        const col = fighter.characterData.color || 0xffffff;

        // Determine style from effectType
        const isRanged   = /shot|rail|beam|data|kunai|poison|arrow|bullet/.test(effectType);
        const isHeavy    = /rage|smash|dragon|stomp|hammer/.test(effectType);
        const isVoid     = /void|dark|shadow|reap|scythe/.test(effectType);
        const isEnergy   = /spark|lightning|psi|beam|data|phase/.test(effectType);

        // ── Arc slash ──
        const g = this.add.graphics();
        const arcColor  = isVoid ? 0x9900cc : isEnergy ? 0x44eeff : col;
        const arcColor2 = isVoid ? 0x440066 : isEnergy ? 0xffffff : 0xffffff;
        const arcR      = isHeavy ? 64 : isRanged ? 20 : 48;

        // Ghost outer trail
        g.lineStyle(isHeavy ? 10 : 7, arcColor2, 0.15);
        const a0 = direction > 0 ? -Math.PI * 0.6 : Math.PI * 0.4;
        const a1 = direction > 0 ?  Math.PI * 0.6 : Math.PI * 1.6;
        g.beginPath();
        g.arc(x, y, arcR + 14, a0, a1, direction < 0);
        g.strokePath();

        // Main arc
        g.lineStyle(isHeavy ? 7 : 5, arcColor, 0.9);
        g.beginPath();
        g.arc(x, y, arcR, a0, a1, direction < 0);
        g.strokePath();

        // Inner bright edge
        g.lineStyle(2, arcColor2, 0.7);
        g.beginPath();
        g.arc(x, y, arcR - 8, a0, a1, direction < 0);
        g.strokePath();

        // Speed lines (3 short streaks behind the swing)
        for (let i = 0; i < 4; i++) {
            const ang  = a0 + (a1 - a0) * (i / 4);
            const rx   = x + Math.cos(ang) * arcR;
            const ry   = y + Math.sin(ang) * arcR;
            const len  = isHeavy ? 22 : 14;
            g.lineStyle(2, arcColor2, 0.4 - i * 0.07);
            g.beginPath();
            g.moveTo(rx, ry);
            g.lineTo(rx - direction * len, ry);
            g.strokePath();
        }

        this.tweens.add({
            targets: g,
            alpha: 0,
            scaleX: isHeavy ? 1.4 : 1.2,
            scaleY: isHeavy ? 1.4 : 1.2,
            duration: isHeavy ? 200 : 140,
            ease: 'Power2',
            onComplete: () => g.destroy()
        });

        // ── Impact flash ──
        const flash = this.add.graphics();
        flash.fillStyle(0xffffff, 0.85);
        flash.fillCircle(x, y, isHeavy ? 18 : 11);
        flash.fillStyle(arcColor, 0.6);
        flash.fillCircle(x, y, isHeavy ? 10 : 6);
        this.tweens.add({
            targets: flash, alpha: 0, scale: isHeavy ? 2.2 : 1.8,
            duration: 80, ease: 'Power3', onComplete: () => flash.destroy()
        });

        // ── Sparks ──
        const sparkCount = isHeavy ? 8 : 5;
        for (let i = 0; i < sparkCount; i++) {
            const spark = this.add.graphics();
            const ang = (direction > 0 ? 0 : Math.PI) + (Math.random() - 0.5) * Math.PI * 0.9;
            const spd  = 80 + Math.random() * 120;
            spark.fillStyle(i % 2 === 0 ? arcColor : arcColor2, 1);
            spark.fillRect(-2, -2, isHeavy ? 5 : 3, isHeavy ? 5 : 3);
            spark.setPosition(x, y);
            this.tweens.add({
                targets: spark,
                x: x + Math.cos(ang) * spd,
                y: y + Math.sin(ang) * spd,
                alpha: 0,
                duration: 150 + Math.random() * 80,
                ease: 'Power2',
                onComplete: () => spark.destroy()
            });
        }
    }*/
            src = src.slice(0, startIdx) + newFn + src.slice(endIdx);
            console.log('Replaced createMeleeEffect');
        }
    }
}

const lines = src.split('\n').length;
console.log('Final line count:', lines);

let depth = 0;
for (const c of src) { if (c === '{') depth++; else if (c === '}') depth--; }
console.log('Brace balance:', depth, '(should be 0)');

fs.writeFileSync('js/scenes/GameScene.js', src, 'utf8');
console.log('Written successfully.');
