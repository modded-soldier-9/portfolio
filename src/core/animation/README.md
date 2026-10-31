# Animation Engine

## Overview
Centralized GSAP animation timeline factory and easing presets powering all Windows 7 micro-interactions, including the BIOS-less boot sequence, login screen transitions, window manager actions (open, close, minimize, restore, snap), Start menu slide-in, flyout scaling, and game animations (Minesweeper reveal, card dealing, board shake).

## Interface
- `AERO_EASE`: Easing curve dictionary tuned for Windows 7 Aero ergonomics [src/core/animation/index.ts:AERO_EASE]
- `isReducedMotion()`: Utility verifying whether the user has enabled OS-level reduced motion preferences [src/core/animation/index.ts:isReducedMotion]
- `createBootSequenceTimeline()`: GSAP timeline orchestrating the 4 firefly orbs, light trails, and flag bloom [src/core/animation/index.ts:createBootSequenceTimeline]
- `animateLoginScreenIn()`: Entrance animation for the user tile and logon controls [src/core/animation/index.ts:animateLoginScreenIn]
- `animateInvalidPasswordShake()`: Error shake effect on invalid credential input [src/core/animation/index.ts:animateInvalidPasswordShake]
- `animateWelcomeTransition()`: Logon-to-desktop transition sequence with spinning Aero ring [src/core/animation/index.ts:animateWelcomeTransition]
- `animateWindowOpen()`, `animateWindowRestore()`, `animateWindowMinimize()`, `animateWindowClose()`, `animateWindowSnapChange()`: Window manager state transition animations [src/core/animation/index.ts:animateWindowOpen]
- `animateStartMenuOpen()`, `animateFlyoutOpen()`: Origin-aware popover and menu opening animations [src/core/animation/index.ts:animateStartMenuOpen]
- `animateMinesweeperReveal()`, `animateBoardShake()`, `animateCardsDeal()`, `animateCardPulse()`: Game-specific physical animations [src/core/animation/index.ts:animateMinesweeperReveal]

## Invariants
- All interactive window animations maintain durations strictly under 240ms with scale starting from >= 0.93 [src/core/animation/index.ts:animateWindowOpen]
- When `isReducedMotion()` returns true, all transitions bypass motion interpolation and resolve instantly [src/core/animation/index.ts:isReducedMotion]

## Side Effects
- Mutates inline DOM styles (`transform`, `opacity`, `filter`) across animated targets via GSAP engine [src/core/animation/index.ts:gsap]

## Verification
- Run: `npm run lint`
