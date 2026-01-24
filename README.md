# Super Bros - Platform Fighter

A Super Smash Bros-inspired platform fighting game built with Phaser.js. Battle with 8 unique fighters across 8 stunning arenas!

## Features

- **8 Unique Characters** - All unlocked from the start!
  - Warrior - Balanced fighter with strong melee attacks
  - Speedster - Fast and agile, but lightweight
  - Tank - Heavy hitter that's hard to launch
  - Ninja - Quick with ranged special attacks
  - Brawler - Street fighter with powerful combos
  - Mage - Powerful ranged attacks but fragile
  - Robot - Mechanical fighter with laser attacks
  - Pirate - Swashbuckler with a trusty pistol

- **8 Beautiful Arenas**
  - Battlefield - Classic floating platforms
  - Ancient Temple - Dusty ruins with torches
  - Volcanic Peak - Lava and rising embers
  - Sky Tower - High above the clouds
  - Neon City - Cyberpunk cityscape
  - Frozen Lake - Icy with snowfall
  - Final Destination - Cosmic single platform
  - Jungle Ruins - Overgrown ancient structures

- **Game Modes**
  - **1 Player** - Battle against AI with Easy, Medium, or Hard difficulty
  - **2 Players** - Local multiplayer battles

- **Amazing Graphics**
  - Particle effects and dynamic backgrounds
  - Theme-specific visual effects per arena
  - Smooth animations and hit effects
  - Victory celebrations with confetti

## Controls

### Player 1
| Action | Key |
|--------|-----|
| Move | W A S D |
| Attack | G |
| Special | H |

### Player 2
| Action | Key |
|--------|-----|
| Move | Arrow Keys |
| Attack | Numpad 1 |
| Special | Numpad 2 |

### General
| Action | Key |
|--------|-----|
| Pause | ESC |

## How to Play

1. Open `index.html` in a modern web browser
2. Select 1 Player or 2 Players mode
3. Choose your fighter (all characters are unlocked!)
4. Select an arena
5. Battle!

### Combat Mechanics

- **Damage Percentage** - Taking hits increases your damage %
- **Knockback** - Higher damage = more knockback when hit
- **Ring Outs** - Knock opponents off the stage to score KOs
- **Stocks** - Each player has 3 lives
- **Double Jump** - Jump again in mid-air
- **Special Attacks** - Unique abilities for each character

## Running the Game

Simply open `index.html` in your browser. The game uses Phaser.js loaded from CDN, so an internet connection is required on first load.

For local development, you can use any local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## Tech Stack

- **Phaser 3** - Game framework
- **Vanilla JavaScript** - No build tools required
- **Procedural Graphics** - All sprites generated in-game

## Credits

Created with Phaser.js
