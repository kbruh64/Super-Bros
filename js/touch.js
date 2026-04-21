// Mobile touch controller — creates virtual gamepad overlays for P1 (left side) and P2 (right side)
// Exposes window.TouchInput.getState(1|2) which returns the same shape as processInput expects.

(function () {
    const isMobile = () => window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;

    // Per-player state
    const state = {
        1: { left: false, right: false, up: false, down: false, _jumpPending: false, _attackPending: false, _specialPending: false },
        2: { left: false, right: false, up: false, down: false, _jumpPending: false, _attackPending: false, _specialPending: false }
    };

    function getState(player) {
        const s = state[player];
        const jump    = s._jumpPending;
        const attack  = s._attackPending;
        const special = s._specialPending;
        // Clear one-shot flags after they are read
        s._jumpPending    = false;
        s._attackPending  = false;
        s._specialPending = false;
        return {
            left:    s.left,
            right:   s.right,
            up:      s.up,
            down:    s.down,
            jump,
            attack,
            special
        };
    }

    // Build a virtual controller for one player
    function buildPad(player) {
        const side = player === 1 ? 'left' : 'right';

        const pad = document.createElement('div');
        pad.className = `touch-pad touch-pad-${side}`;
        pad.setAttribute('data-player', player);

        // D-pad
        const dpad = document.createElement('div');
        dpad.className = 'touch-dpad';

        const dirs = [
            { cls: 'touch-up',    label: '▲', dir: 'up'    },
            { cls: 'touch-left',  label: '◀', dir: 'left'  },
            { cls: 'touch-right', label: '▶', dir: 'right' },
            { cls: 'touch-down',  label: '▼', dir: 'down'  }
        ];

        dirs.forEach(({ cls, label, dir }) => {
            const btn = document.createElement('button');
            btn.className = `touch-btn ${cls}`;
            btn.textContent = label;
            btn.setAttribute('data-dir', dir);
            dpad.appendChild(btn);
        });

        // Action buttons
        const actions = document.createElement('div');
        actions.className = 'touch-actions';

        const acts = [
            { cls: 'touch-jump',    label: 'JUMP',   action: 'jump'    },
            { cls: 'touch-attack',  label: 'ATK',    action: 'attack'  },
            { cls: 'touch-special', label: 'SPL',    action: 'special' }
        ];

        acts.forEach(({ cls, label, action }) => {
            const btn = document.createElement('button');
            btn.className = `touch-btn ${cls}`;
            btn.textContent = label;
            btn.setAttribute('data-action', action);
            actions.appendChild(btn);
        });

        pad.appendChild(dpad);
        pad.appendChild(actions);
        document.body.appendChild(pad);

        // Wire up touch events for directional buttons
        dpad.addEventListener('touchstart', e => {
            e.preventDefault();
            [...e.changedTouches].forEach(t => {
                const el = document.elementFromPoint(t.clientX, t.clientY);
                const dir = el && el.getAttribute('data-dir');
                if (dir) {
                    state[player][dir] = true;
                    if (dir === 'up') state[player]._jumpPending = true;
                    el.classList.add('active');
                }
            });
        }, { passive: false });

        dpad.addEventListener('touchmove', e => {
            e.preventDefault();
            // Reset all dirs first, then re-apply from current touch positions
            ['up','down','left','right'].forEach(d => state[player][d] = false);
            // Clear active styling
            dpad.querySelectorAll('.touch-btn').forEach(b => b.classList.remove('active'));
            [...e.touches].forEach(t => {
                const el = document.elementFromPoint(t.clientX, t.clientY);
                const dir = el && el.getAttribute('data-dir');
                if (dir && el.closest('.touch-dpad') === dpad) {
                    state[player][dir] = true;
                    el.classList.add('active');
                }
            });
        }, { passive: false });

        dpad.addEventListener('touchend', e => {
            e.preventDefault();
            [...e.changedTouches].forEach(t => {
                // Find which button this touch started on and release it
                // Re-derive current held dirs from remaining touches
            });
            ['up','down','left','right'].forEach(d => state[player][d] = false);
            dpad.querySelectorAll('.touch-btn').forEach(b => b.classList.remove('active'));
            [...e.touches].forEach(t => {
                const el = document.elementFromPoint(t.clientX, t.clientY);
                const dir = el && el.getAttribute('data-dir');
                if (dir && el.closest('.touch-dpad') === dpad) {
                    state[player][dir] = true;
                    el.classList.add('active');
                }
            });
        }, { passive: false });

        // Action buttons — one-shot on press
        actions.addEventListener('touchstart', e => {
            e.preventDefault();
            [...e.changedTouches].forEach(t => {
                const el = document.elementFromPoint(t.clientX, t.clientY);
                const action = el && el.getAttribute('data-action');
                if (action) {
                    if (action === 'jump')    { state[player]._jumpPending    = true; state[player].up = true; }
                    if (action === 'attack')  state[player]._attackPending  = true;
                    if (action === 'special') state[player]._specialPending = true;
                    el.classList.add('active');
                }
            });
        }, { passive: false });

        actions.addEventListener('touchend', e => {
            e.preventDefault();
            [...e.changedTouches].forEach(t => {
                const el = document.elementFromPoint(t.clientX, t.clientY);
                if (el) {
                    const action = el.getAttribute('data-action');
                    if (action === 'jump') state[player].up = false;
                    el.classList.remove('active');
                }
            });
            // Also clear any lingering active classes
            actions.querySelectorAll('.touch-btn').forEach(b => {
                if (![...e.touches].some(t => {
                    const el = document.elementFromPoint(t.clientX, t.clientY);
                    return el === b;
                })) b.classList.remove('active');
            });
        }, { passive: false });

        return pad;
    }

    function init() {
        if (!isMobile()) return;

        buildPad(1);
        buildPad(2);

        // Prevent context menu on long-press
        document.addEventListener('contextmenu', e => {
            if (e.target.closest('.touch-pad')) e.preventDefault();
        });
    }

    // Show/hide pads dynamically (e.g. only during GameScene)
    function show() {
        document.querySelectorAll('.touch-pad').forEach(p => p.style.display = '');
    }
    function hide() {
        document.querySelectorAll('.touch-pad').forEach(p => p.style.display = 'none');
        // Reset all state
        [1, 2].forEach(p => {
            Object.keys(state[p]).forEach(k => state[p][k] = false);
        });
    }

    window.TouchInput = { init, show, hide, getState, isMobile };

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
