# Components

## Overview
Presentation components for the Windows 7 desktop shell, taskbar, Start Menu, floating gadgets, Web Audio synthesizer, and legacy portfolio sections.

## Interface
- `AeroDesktop`: Root React component orchestrating the OS provider and desktop shell [src/components/AeroDesktop.tsx:AeroDesktop]
- `aeroSound`: Web Audio API sound generator synthesizing click and chime effects [src/components/AeroSound.ts:aeroSound]
- `DesktopGadgets`: Floating desktop gadgets hosting live SVG analog clock and security meter [src/components/DesktopGadgets.tsx:DesktopGadgets]
- `StartMenu`: Two-pane Windows 7 Start Menu featuring search filtering and All Programs tree [src/components/StartMenu.tsx:StartMenu]
- `Taskbar`: Superbar taskbar with Start Orb, running application buttons, notification area, and Aero Peek [src/components/Taskbar.tsx:Taskbar]
- `StructuredData`: JSON-LD metadata injector for search engine optimization [src/components/StructuredData.tsx:StructuredData]
- Subdirectories:
  - [Windows](./windows/README.md) - Specialized application window views (Cmd, Contact, Personalize, Security Center, System)

## Invariants
- `aeroSound` lazily constructs the browser `AudioContext` upon the first explicit user interaction to comply with browser autoplay policies [src/components/AeroSound.ts:ensureContext]
- Start menu and context menus automatically dismiss on `Escape` keypress or external click [src/components/StartMenu.tsx:StartMenu]

## Side Effects
- Synthesizes Web Audio oscillator waveforms through the client audio hardware [src/components/AeroSound.ts:playTone]

## Verification
- Run: `npm run lint`
