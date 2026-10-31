# 3D Space Cadet Pinball

## Overview
Classic Windows Space Cadet pinball simulation built with HTML5 2D canvas, authentic coordinate geometry (600x800), flipper rotational dynamics, elastic bumper impulses, slingshot recoil, Web Audio procedural sound generation, and responsive touch controls for mobile.

## Interface
- `SpaceCadetGame`: Core React component managing canvas physics loop, ball velocity, bumper collisions, flipper controls, and game over state [src/games/space-cadet/SpaceCadetGame.tsx:SpaceCadetGame]
- `spaceCadetModule`: AppModuleContract registering Space Cadet in the desktop window manager, Start Menu, taskbar, and mobile hubs [src/games/space-cadet/index.tsx:spaceCadetModule]

## Invariants
- Coordinate space is fixed at 600x800 internal pixels and scaled responsively via canvas CSS [src/games/space-cadet/SpaceCadetGame.tsx:TABLE_WIDTH]
- Physics constants: `GRAVITY = 0.22`, `BALL_RADIUS = 7`, `BOUNCE_RESTITUTION = 1.35`, `MAX_VELOCITY = 18` [src/games/space-cadet/SpaceCadetGame.tsx]
- Left flipper pivot at `(210, 720)` and right flipper pivot at `(390, 720)` with length `70px` [src/games/space-cadet/SpaceCadetGame.tsx]
- Game loop automatically pauses on `document.hidden` or window minimization to eliminate battery drain [src/games/space-cadet/SpaceCadetGame.tsx]

## Side Effects
- Web Audio procedural audio synthesized via `aeroSound.playPinballFlipper()`, `aeroSound.playPinballBumper()`, `aeroSound.playPinballPlunger()`, and `aeroSound.playPinballTilt()` [src/components/AeroSound.ts]
- In-memory score and high score updates during session [src/games/space-cadet/SpaceCadetGame.tsx]

## Verification
- Run: `npm run lint` and `npm run build`
