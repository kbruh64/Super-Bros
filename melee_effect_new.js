    createMeleeEffect(fighter, direction, effectType) {
        const x = fighter.x + direction * 40;
        const y = fighter.y - 10;
        const col = fighter.characterData.color || 0xffffff;

        // Bucket effectType into visual style
        const isRanged = /shot|rail|beam|data|kunai|poison|arrow|bullet/.test(effectType);
        const isHeavy  = /rage|smash|dragon|stomp|hammer/.test(effectType);
        const isVoid   = /void|dark|shadow|reap|scythe/.test(effectType);
        const isEnergy = /spark|lightning|psi|phase/.test(effectType);

        // ── Arc slash ──
        const g = this.add.graphics();
        const arcColor  = isVoid ? 0x9900cc : isEnergy ? 0x44eeff : col;
        const arcColor2 = isVoid ? 0xcc44ff : isEnergy ? 0xffffff : 0xffffff;
        const arcR      = isHeavy ? 62 : isRanged ? 22 : 46;

        // Ghost outer trail
        g.lineStyle(isHeavy ? 12 : 8, arcColor2, 0.14);
        const a0 = direction > 0 ? -Math.PI * 0.6 : Math.PI * 0.4;
        const a1 = direction > 0 ?  Math.PI * 0.6 : Math.PI * 1.6;
        g.beginPath();
        g.arc(x, y, arcR + 14, a0, a1, direction < 0);
        g.strokePath();

        // Main arc
        g.lineStyle(isHeavy ? 8 : 5, arcColor, 0.92);
        g.beginPath();
        g.arc(x, y, arcR, a0, a1, direction < 0);
        g.strokePath();

        // Inner highlight edge
        g.lineStyle(2, arcColor2, 0.72);
        g.beginPath();
        g.arc(x, y, arcR - 9, a0, a1, direction < 0);
        g.strokePath();

        // Speed streaks behind the swing
        for (let i = 0; i < 4; i++) {
            const ang = a0 + (a1 - a0) * (i / 4);
            const rx  = x + Math.cos(ang) * arcR;
            const ry  = y + Math.sin(ang) * arcR;
            g.lineStyle(2, arcColor2, 0.38 - i * 0.07);
            g.beginPath();
            g.moveTo(rx, ry);
            g.lineTo(rx - direction * (isHeavy ? 24 : 15), ry);
            g.strokePath();
        }

        this.tweens.add({
            targets: g,
            alpha: 0,
            scaleX: isHeavy ? 1.45 : 1.22,
            scaleY: isHeavy ? 1.45 : 1.22,
            duration: isHeavy ? 210 : 145,
            ease: 'Power2',
            onComplete: () => g.destroy()
        });

        // ── Impact flash ──
        const flash = this.add.graphics();
        flash.fillStyle(0xffffff, 0.88);
        flash.fillCircle(x, y, isHeavy ? 20 : 12);
        flash.fillStyle(arcColor, 0.65);
        flash.fillCircle(x, y, isHeavy ? 11 : 6);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            scale: isHeavy ? 2.4 : 1.9,
            duration: 85,
            ease: 'Power3',
            onComplete: () => flash.destroy()
        });

        // ── Sparks ──
        const sparkCount = isHeavy ? 8 : 5;
        for (let i = 0; i < sparkCount; i++) {
            const spark = this.add.graphics();
            const ang = (direction > 0 ? 0 : Math.PI) + (Math.random() - 0.5) * Math.PI * 0.85;
            const spd  = 85 + Math.random() * 115;
            spark.fillStyle(i % 2 === 0 ? arcColor : arcColor2, 1);
            spark.fillRect(-2, -2, isHeavy ? 5 : 3, isHeavy ? 5 : 3);
            spark.setPosition(x, y);
            this.tweens.add({
                targets: spark,
                x: x + Math.cos(ang) * spd,
                y: y + Math.sin(ang) * spd,
                alpha: 0,
                duration: 145 + Math.random() * 80,
                ease: 'Power2',
                onComplete: () => spark.destroy()
            });
        }
    }
