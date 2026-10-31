# Desktop Shell

## Overview
Root desktop shell environment combining the Harmony wallpaper, desktop shortcut icons with rubber-band marquee selection, right-click context menus, floating desktop gadgets, window container hosting, system notification balloon, two-pane Start Menu, and bottom Superbar taskbar with Aero Peek.

## Interface
- `DesktopShell`: Master React shell component coordinating desktop layout, window hierarchy, and OS overlays [src/core/shell/index.tsx:DesktopShell]

## Invariants
- The active window is resolved strictly as the topmost open, non-minimized window by highest `zIndex` value [src/core/shell/index.tsx:activeWindowId]
- Marquee drag calculations evaluate 2D bounding-box intersections against all DOM shortcut nodes with `[data-desktop-icon-id]` [src/core/shell/index.tsx:onPointerMove]

## Side Effects
- Updates root document CSS properties (`--aero-glass-rgb`, `--aero-taskbar-rgb`, `--aero-glass-alpha`) [src/core/shell/index.tsx:useEffect]
- Modifies open windows, minimized states, and active virtual files in `useOS()` [src/core/shell/index.tsx:useOS]
- Emits desktop sound effects via `aeroSound` [src/core/shell/index.tsx:aeroSound]

## Verification
- Run: `npm run lint`
