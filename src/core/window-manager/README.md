# Window Manager

## Overview
Shared window management framework providing Windows 7 Aero Glass translucent chrome, title bar controls (Minimize, Maximize/Restore, Close), pointer-driven moving, 8-directional edge/corner resizing, Aero Snap screen edge docking (Left 50%, Right 50%, Fullscreen Maximize), and GSAP state transition animations.

## Interface
- `SnapState`: Union type of window docking states (`'none' | 'maximized' | 'left' | 'right'`) [src/core/window-manager/index.tsx:SnapState]
- `WindowPosition`: Interface for window coordinate boundaries (`x`, `y`, `width`, `height`) [src/core/window-manager/index.tsx:WindowPosition]
- `AeroWindowProps`: Comprehensive property contract for managed application windows [src/core/window-manager/index.tsx:AeroWindowProps]
- `AeroWindow`: Shared React wrapper component hosting application views inside Aero chrome [src/core/window-manager/index.tsx:AeroWindow]

## Invariants
- Minimized windows preserve their internal React subtree mounted in the DOM via `display: none` rather than unmounting [src/core/window-manager/index.tsx:AeroWindow]
- Window resizing operations clamp dimensions to a strict minimum threshold of 320x240 pixels [src/core/window-manager/index.tsx:AeroWindow]
- Single-clicking a maximized window title bar preserves maximized state, whereas double-clicking restores normal geometry [src/core/window-manager/index.tsx:handlePointerMoveTitle]

## Side Effects
- Attaches temporary global pointer movement and release listeners to the browser `window` during drag operations [src/core/window-manager/index.tsx:handlePointerDownTitle]
- Plays click feedback audio through `aeroSound.playClick()` [src/core/window-manager/index.tsx:aeroSound]

## Verification
- Run: `npm run lint`
