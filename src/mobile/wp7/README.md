# Windows Phone 7 (WP7) Aero Mobile Shell

## Overview
Authentic Windows Phone 7 Metro/Aero Start Screen interface delivering a touch-first portfolio presentation for smartphone viewports (<768px). Features a 2-column live tile grid with pointerdown 3D perspective tilt transforms, full-screen slide-in detail sheets, and a persistent toggle to return to the full desktop interface.

## Interface
- `WP7MobileShell`: Primary mobile shell component hosting the status bar, Start header, live tile grid, and hub modal sheets [src/mobile/wp7/WP7MobileShell.tsx:WP7MobileShell]
- `WP7Tile`: Reusable 3D perspective tilt tile component supporting square (1x1) and wide (2x1) layouts with Aero gloss highlights [src/mobile/wp7/WP7Tile.tsx:WP7Tile]
- `WP7DetailModal`: Full-screen slide-in content sheet with back navigation app bar and 48px+ touch targets [src/mobile/wp7/WP7DetailModal.tsx:WP7DetailModal]

## Invariants
- Tilt physics formula: `rotateX = ((touchY - centerY) / height) * -16deg`, `rotateY = ((touchX - centerX) / width) * 16deg` with spring-back on pointerup [src/mobile/wp7/WP7Tile.tsx]
- All touch targets in modal sheets and tile grids meet or exceed the 48px accessibility minimum.
- Direct desktop mode switching executes through `onSwitchToDesktop` prop without losing global OS session state.

## Side Effects
- Audio click feedback through `aeroSound.playClick()` on tile and modal interactions [src/components/AeroSound.ts]
- In-memory resume text blob generation and download [src/mobile/wp7/WP7MobileShell.tsx:handleDownloadResume]

## Verification
- Run: `npm run lint` and `npm run build`
