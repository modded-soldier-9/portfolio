# Boot Sequence

## Overview
Recreation of the classic Windows 7 BIOS-less boot sequence (`bootres.dll`), rendering 4 glowing colored orbs (Red, Yellow, Green, Blue) that swirl along vector SVG orbital paths and merge into the glowing Windows 7 flag accompanied by pulsing progress dots.

## Interface
- `BootSequence`: React component managing boot screen mounting, key shortcuts, and completion callbacks [src/core/boot/index.tsx:BootSequence]

## Invariants
- Pressing `Escape` kills the active timeline and immediately transitions session state to the desktop [src/core/boot/index.tsx:handleKeyDown]
- Pressing `Enter` or `Space` kills the active timeline and advances directly to the login screen [src/core/boot/index.tsx:handleKeyDown]

## Side Effects
- Spawns and cleans up GSAP animation timelines on container lifecycle [src/core/boot/index.tsx:createBootSequenceTimeline]
- Registers and unregisters window keyboard listeners for bypass shortcuts [src/core/boot/index.tsx:handleKeyDown]

## Verification
- Run: `npm run lint`
